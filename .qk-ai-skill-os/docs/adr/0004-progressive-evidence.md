# 4. Progressive Evidence Collection

Date: 2026-07-02

## Status
Accepted

## Context
AI Agents frequently fall into "hallucination loops" or "over-exploration loops", running commands like `ls`, `tree`, or reading entire project directories just to find one file. This burns through context windows rapidly and leads to poor reasoning.

## Decision
We implemented a strict **Progressive Evidence Collection** pipeline inside the OS Kernel (`AGENTS.md`):
- **Context Budget:** Agents must start by reading 1 file, then 3 files, then a directory. They must never read the whole project unless explicitly required.
- **Sufficient Confidence:** Agents must stop collecting evidence the moment they reach an 80% confidence threshold to proceed. 
- **Evidence Priority:** User input > Existing context > Source code > Types > Logs > Runtime > External knowledge.

## Consequences
- **Positive:** Drastically reduced unnecessary `run_command` usage. Agents act much more like senior developers who pinpoint issues via stack traces instead of blindly searching the filesystem.
- **Negative:** Requires rigorous enforcement in the Kernel to prevent agents from falling back to old habits.
