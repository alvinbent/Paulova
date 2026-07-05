# Paunova Agent Operating Rules

## Authority

Stitch is the visual source of truth for the public website. Do not redesign, reinterpret, or "improve" the Stitch visual output unless the user explicitly asks for a new Stitch revision.

Brand names are fixed:

- Doctor: **Dra Carolina Aguirre**
- Business: **Dra Carolina Aguirre - Paunova Skin & Age Clinic**

## Agent Roles

Codex is the principal auditor and integration architect.

- Owns architecture, security, API boundaries, backend, CI/build health, data separation, secrets, deployment checks, and final review.
- Reviews AntiGravity output before merge.
- Keeps documentation and control tower state updated.

AntiGravity is the construction and heavy implementation agent.

- Owns broad UI conversion, repetitive component extraction, scaffolding, page expansion, responsive pass, and bulk implementation.
- Must not overwrite Stitch assets or Codex integration files without documenting the reason in `docs/control-tower.md`.
- Must open a coordination note before large changes and leave a handoff note after changes.

## Coordination Files

Use these files as the tower of control:

- `docs/control-tower.md`: current status, decisions, locks, handoffs.
- `docs/agent-integration-protocol.md`: how Codex and AntiGravity coordinate.
- `docs/stitch-import-report.md`: Stitch inventory and page mapping.
- `docs/stitch-sync.md`: Stitch sync procedure.

## Protected Areas

Do not directly edit these unless the task is explicitly Stitch synchronization or visual fidelity repair:

- `public/stitch-assets/pages/**`
- `public/stitch-assets/images/**`
- `public/stitch-assets/screenshots/**`

If these must change, first update `docs/control-tower.md` with:

- reason,
- source of truth,
- exact files,
- rollback path.

## Data And Medical Safety

- Never expose API keys or secrets.
- Never create automatic medical diagnosis.
- Never promise guaranteed medical outcomes.
- Keep clinical data, commercial CRM data, and marketing data separated.
- Backend-only integrations must stay server-side.

## Verification

Before handoff, run when available:

- `npm run lint`
- `npm run build`

If local `NODE_OPTIONS=--use-system-ca` breaks Next/Turbopack workers, temporarily clear `NODE_OPTIONS` only for the command.

