# 1. Intent-Based Architecture

Date: 2026-07-02

## Status
Accepted

## Context
As the framework grew from 5 to 20+ skills, managing individual tool permissions and specific verification overrides within each `SKILL.md` became a maintenance nightmare (violating DRY). Agents were also suffering from "context bloat" because they had to read sprawling, repetitive rules across different skills.

## Decision
We transitioned from a "Rule-Based" architecture to an "Intent-Based" architecture. 
- Skills no longer define their own verification exceptions or tool usage logic. 
- Instead, skills declare their `behavior` and `intent` via frozen YAML metadata. 
- The OS Kernel (`AGENTS.md`) intercepts these intents and automatically applies the correct global routing and execution constraints based on the categorized behavior.

## Consequences
- **Positive:** Massive reduction in skill file size. Easier to scale to 100+ skills. Centralized logic in the Kernel. Agent routing is drastically improved due to clear `intent` mapping.
- **Negative:** Less granular control over unique outliers, but this enforces better standardization.
