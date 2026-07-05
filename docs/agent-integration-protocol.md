# Agent Integration Protocol

## Goal

Codex and AntiGravity must collaborate without overwriting each other's work.

## Work Model

1. AntiGravity does heavy construction on a task branch.
2. AntiGravity writes handoff notes in `docs/control-tower.md`.
3. Codex reviews and audits.
4. Codex merges or requests fixes.

## Branch Rules

- `main`: stable, deployable baseline.
- `develop`: integration branch for accepted work.
- `stitch-integration`: Stitch sync and visual fidelity branch.
- Feature branches: `feature/<short-name>`.

## Protected Visual Contract

Current public visuals are not conventional React components yet. They are Stitch HTML mounted via `StitchFrame`.

AntiGravity may extract components only if:

- the source is the Stitch HTML/CSS,
- no visual reinterpretation is introduced,
- before/after screenshots are compared,
- Codex reviews the result.

## Conflict Resolution

If Stitch and local code conflict, Stitch wins for public visual design.

If AntiGravity and Codex conflict:

1. Stop editing affected files.
2. Write the conflict in `docs/control-tower.md`.
3. Codex decides architecture/security/build direction.
4. AntiGravity continues construction after the decision is logged.

## Required Handoff Format

```md
### Handoff - YYYY-MM-DD - Agent

Scope:

Files changed:

Protected files changed: yes/no

Verification:

Risks:

Next recommended action:
```

