#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const requiredPaths = [
  "docs",
  "examples",
  "diagrams",
  "diagrams/mermaid",
  "templates",
  ".github/ISSUE_TEMPLATE",
  ".github/PULL_REQUEST_TEMPLATE.md",
  "diagrams/mermaid/pattern-selection-flow.mmd",
  "diagrams/mermaid/layer-placement.mmd",
  "diagrams/mermaid/scenario-flow.mmd",
  "diagrams/mermaid/pattern-relationships.mmd",
];

const requiredTemplateControls = [
  {
    file: ".github/ISSUE_TEMPLATE/pattern-request.yml",
    snippets: [
      "type: dropdown",
      "id: category",
      "type: checkboxes",
      "id: related_patterns",
    ],
  },
  {
    file: ".github/ISSUE_TEMPLATE/scenario-request.yml",
    snippets: [
      "type: dropdown",
      "id: domain",
      "id: scenario_type",
      "type: checkboxes",
      "id: candidate_patterns",
      "id: failure_modes",
    ],
  },
  {
    file: ".github/ISSUE_TEMPLATE/correction.yml",
    snippets: [
      "type: dropdown",
      "id: content_area",
      "id: issue_type",
    ],
  },
];

const placeholderScanFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "diagrams/README.md",
  "tools/README.md",
  "templates/pattern-template.md",
  "templates/scenario-template.md",
  "templates/decision-record-template.md",
  "templates/anti-pattern-template.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/pattern-request.yml",
  ".github/ISSUE_TEMPLATE/scenario-request.yml",
  ".github/ISSUE_TEMPLATE/correction.yml",
];

const errors = [];

function projectPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(projectPath(relativePath), "utf8");
}

function assertPathExists(relativePath) {
  if (!fs.existsSync(projectPath(relativePath))) {
    errors.push(`Missing required path: ${relativePath}`);
  }
}

function assertSnippet(file, snippet) {
  const content = read(file);
  if (!content.includes(snippet)) {
    errors.push(`Missing expected snippet in ${file}: ${snippet}`);
  }
}

function assertNoPlaceholderDrift(file) {
  const content = read(file);
  const lines = content.split(/\r?\n/);
  const placeholderPattern = /\b(TODO|TBD|FIXME)\b|placeholder only|coming soon/i;

  lines.forEach((line, index) => {
    if (placeholderPattern.test(line)) {
      errors.push(`${file}:${index + 1} contains placeholder drift: ${line.trim()}`);
    }
  });
}

for (const relativePath of requiredPaths) {
  assertPathExists(relativePath);
}

for (const control of requiredTemplateControls) {
  assertPathExists(control.file);
  if (fs.existsSync(projectPath(control.file))) {
    for (const snippet of control.snippets) {
      assertSnippet(control.file, snippet);
    }
  }
}

for (const file of placeholderScanFiles) {
  assertPathExists(file);
  if (fs.existsSync(projectPath(file))) {
    assertNoPlaceholderDrift(file);
  }
}

if (errors.length > 0) {
  console.error("Documentation validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Documentation validation passed.");
