# ArcVision System Context Artifact


## What This Is [arcvision.context.json](./arcvision.context.json)

This file is the **canonical structural context** of this codebase.
It represents how the system actually works — not how it is described.

It is generated directly from source code by ArcVision.

## What This Replaces

This artifact replaces:
- Manual repository scanning
- Tribal knowledge held by senior engineers
- Re-explaining the system to new developers
- Re-prompting LLMs with partial or incorrect context
- Guessing blast radius of changes

## When You Must Use This

Use this artifact when:
- Onboarding a new developer
- Prompting an AI assistant about this codebase
- Making architectural changes
- Investigating unexpected behavior
- Assessing risk before modifying core modules

## What This Artifact Contains

- Canonical module and dependency graph
- Execution and data flow relationships
- Structural roles (service, store, boundary, etc.)
- Invariants inferred from the system
- Impact metrics (blast radius, coupling)
- Authority core identification
- Hidden coupling detection
- Architectural archetype classification
- Analysis completeness metrics

## Determinism & Trust

- Generated from commit: ae164d81a70b781ce2aa48702aa493acc245b50c
- Generation timestamp: 2026-01-22T05:58:42.291Z
- Tool version: 0.2.14
- Deterministic: same input → same output
- Explicit assumptions listed inside the artifact

If this artifact conflicts with human memory, **trust the artifact**.

## Structural Context Hubs

The following files have the highest blast radius and represent critical structural hubs in the system:

- **User.js**
  - Blast Radius: 0 files (0% of codebase)
  - Risk: Changes here may silently propagate across the system.



## How to Use With AI

When prompting AI tools, include this file as system context.
Do not ask the AI to infer architecture without it.

## When to Regenerate

Regenerate this artifact when:
- Core modules change
- New services are added
- Dependency structure shifts

Run:

```
arcvision scan --upload
```

## Source of Truth

This artifact is the **source of truth** for system structure.
All explanations, decisions, and AI reasoning should reference it.

Some execution script invocations are dynamically assembled at runtime and may not be statically traceable; such scripts are included 
as execution boundaries without guaranteed call-site resolution