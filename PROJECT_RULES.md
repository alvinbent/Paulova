# Project Rules

## Absolute Rules

1. Always write the doctor's name as **Dra Carolina Aguirre**.
2. Always write the business name as **Dra Carolina Aguirre - Paunova Skin & Age Clinic**.
3. Stitch is the official visual source of truth.
4. Do not change images, colors, spacing, typography, hierarchy, copy, buttons, cards, sections, or navigation from Stitch unless the user approves a new design source.
5. Do not expose secrets.
6. Do not diagnose, prescribe, or promise guaranteed medical results.
7. Separate clinical, commercial, and marketing data.

## Current Visual Integration Rule

The current implementation preserves Stitch fidelity by serving the exported Stitch HTML from:

`public/stitch-assets/pages`

Next.js route files only mount those pages through `StitchFrame`. Any future React component extraction must be validated visually against the Stitch screenshots before replacing an iframe route.

## Build Rule

The repo currently uses Next.js 16.2.10 and React 19.2.4.

Local Windows note: if build fails with `--use-system-ca is not allowed in NODE_OPTIONS`, clear `NODE_OPTIONS` for that command only.

