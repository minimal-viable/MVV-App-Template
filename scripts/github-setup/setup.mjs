#!/usr/bin/env node
// Recreates the MVV milestones, role labels, issues and sub-issues on a GitHub
// repo from mvv-milestones.json. Safe to re-run: anything that already exists
// (matched by milestone code / issue ID) is updated rather than duplicated.
//
// Usage:  pnpm setup:github [--repo owner/name] [--dry-run]
// Needs:  the GitHub CLI (`gh`), logged in with access to the target repo.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const repoArg = args[args.indexOf("--repo") + 1];
const repo =
  args.includes("--repo") && repoArg
    ? repoArg
    : gh(["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]).trim();

const data = JSON.parse(
  readFileSync(new URL("./mvv-milestones.json", import.meta.url), "utf8"),
);

function gh(argv, input) {
  return execFileSync("gh", argv, {
    encoding: "utf8",
    input,
    stdio: ["pipe", "pipe", "inherit"],
  });
}

function api(method, path, body) {
  if (dryRun && method !== "GET") {
    console.log(`  [dry-run] ${method} ${path}`);
    return {};
  }
  const argv = ["api", "-X", method, path];
  if (body) argv.push("--input", "-");
  const out = gh(argv, body ? JSON.stringify(body) : undefined);
  return out ? JSON.parse(out) : {};
}

function getAll(path) {
  const results = [];
  for (let page = 1; ; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const batch = api("GET", `${path}${sep}per_page=100&page=${page}`);
    results.push(...batch);
    if (batch.length < 100) return results;
  }
}

const milestoneTitle = (m) => `${m.code} · ${m.name}`;
const issueTitle = (i) => `${i.id} · ${i.title}`;

function issueBody(milestone, issue) {
  return [
    `**Milestone:** ${milestoneTitle(milestone)} (${milestone.timeframe})`,
    "",
    "**User story**",
    "",
    "",
    "**Acceptance criteria**",
    "",
    ...issue.ac.map((c) => `- ${c}`),
    "",
  ].join("\n");
}

console.log(`Setting up ${repo}${dryRun ? " (dry run)" : ""}\n`);

// 1. Role labels
const labels = getAll(`repos/${repo}/labels`);
for (const label of data.labels) {
  const exists = labels.some((l) => l.name === label.name);
  console.log(`${exists ? "Update" : "Create"} label  ${label.name}`);
  if (exists) {
    api("PATCH", `repos/${repo}/labels/${encodeURIComponent(label.name)}`, {
      color: label.color,
      description: label.description,
    });
  } else {
    api("POST", `repos/${repo}/labels`, label);
  }
}

// 2. Milestones — matched on their code ("M0 ", "M0 · …", "M0 – …")
const milestones = getAll(`repos/${repo}/milestones?state=all`);
const milestoneNumbers = {};
for (const m of data.milestones) {
  const body = {
    title: milestoneTitle(m),
    description: `Timeframe: ${m.timeframe} · Owner: All Roles. ${m.description}`,
  };
  const existing = milestones.find((x) => x.title.split(/\s/)[0] === m.code);
  console.log(`${existing ? "Update" : "Create"} milestone  ${body.title}`);
  const saved = existing
    ? api("PATCH", `repos/${repo}/milestones/${existing.number}`, body)
    : api("POST", `repos/${repo}/milestones`, { ...body, state: "open" });
  milestoneNumbers[m.code] = saved.number ?? existing?.number;
}

// 3. Issues and sub-issues — matched on the ID at the start of the title
const issues = getAll(`repos/${repo}/issues?state=all`).filter(
  (i) => !i.pull_request,
);
const taskTypeId = findIssueTypeId("Task");

function upsertIssue(milestone, issue) {
  const body = {
    title: issueTitle(issue),
    body: issueBody(milestone, issue),
    labels: [`role: ${issue.role}`],
    milestone: milestoneNumbers[milestone.code],
  };
  const existing = issues.find((i) => i.title.split(/\s/)[0] === issue.id);
  console.log(`${existing ? "Update" : "Create"} issue  ${body.title}`);
  const saved = existing
    ? api("PATCH", `repos/${repo}/issues/${existing.number}`, body)
    : api("POST", `repos/${repo}/issues`, body);
  if (taskTypeId && saved.node_id) setIssueType(saved.node_id, taskTypeId);
  return saved.number ? saved : existing;
}

for (const m of data.milestones) {
  for (const issue of m.issues) {
    const parent = upsertIssue(m, issue);
    if (!issue.subIssues) continue;
    const linked = parent?.number
      ? getAll(`repos/${repo}/issues/${parent.number}/sub_issues`).map((s) => s.id)
      : [];
    for (const sub of issue.subIssues) {
      const child = upsertIssue(m, sub);
      if (child?.id && !linked.includes(child.id)) {
        api("POST", `repos/${repo}/issues/${parent.number}/sub_issues`, {
          sub_issue_id: child.id,
        });
      }
    }
  }
}

console.log("\nDone.");

// Issue types are an org-level feature; skip quietly if the org doesn't have them.
function findIssueTypeId(name) {
  try {
    const [owner] = repo.split("/");
    const out = gh([
      "api", "graphql",
      "-f", `query=query($o:String!){organization(login:$o){issueTypes(first:20){nodes{id name}}}}`,
      "-f", `o=${owner}`,
      "-q", `.data.organization.issueTypes.nodes[] | select(.name=="${name}") | .id`,
    ]);
    return out.trim() || null;
  } catch {
    return null;
  }
}

function setIssueType(issueId, issueTypeId) {
  if (dryRun) return;
  gh([
    "api", "graphql",
    "-f", "query=mutation($i:ID!,$t:ID!){updateIssue(input:{id:$i,issueTypeId:$t}){issue{id}}}",
    "-f", `i=${issueId}`,
    "-f", `t=${issueTypeId}`,
  ]);
}
