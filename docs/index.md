---
title: Real World Software Patterns
layout: home

hero:
  name: "Real World Software Patterns"
  text: "Choose patterns by problem, layer, and trade-offs."
  tagline: A Markdown-first playbook for developers who want to know when a pattern is justified, where it lives, what it costs, and what simpler option might be enough.
  actions:
    - theme: brand
      text: Open the Pattern Index
      link: /pattern-index
    - theme: alt
      text: Start with Decision Guides
      link: /01-decision-guides/choose-by-problem

features:
  - title: Problem First
    details: Every guide starts from a recurring project problem — provider switching, workflow branching, boundary pressure — never from a pattern name.
  - title: When Not to Use, Always
    details: Each pattern guide is required to explain misuse risks and simpler alternatives before recommending itself.
  - title: Full GoF Coverage
    details: All 23 canonical GoF patterns plus modern architecture (Clean, CQRS, Event Sourcing, DDD) and resilience guides (Outbox, Saga, Circuit Breaker).
  - title: Real-World Scenarios
    details: Payment systems, checkout flows, order processing, multi-tenant SaaS — see multiple patterns working together under real constraints.
  - title: Tested Examples
    details: Selected guides have runnable Go and TypeScript counterparts executed in CI on every commit.
  - title: Review Checklists
    details: Project-start, architecture-review, and pattern-review checklists for senior engineers and architects.
---

## How To Read This Playbook

Start from the [decision guides](/01-decision-guides/choose-by-problem) if you have a problem but do not know the pattern name yet.

Then move to the [pattern guides](/pattern-index) to understand where a pattern helps, where it does not, and what it costs.

Finish with [real-world scenarios](/05-real-world-scenarios/order-processing) to see how multiple patterns work together in an application workflow.

If you are new, begin with [What Is a Pattern?](/00-introduction/what-is-a-pattern) and [When Not to Use Patterns](/00-introduction/when-not-to-use-patterns).
