# Stitch Sync

Stitch is the visual source of truth for **Paunova Premium Web**.

Do not redesign or reinterpret Stitch output. The workflow is:

1. Read the design from Stitch MCP.
2. Enumerate pages, assets, CSS, fonts, images and reusable components.
3. Integrate page by page into Next.js/React.
4. Keep assets under `public/stitch-assets`.
5. Preserve structure, layout, colors, spacing, typography, shadows, borders, content and hierarchy.

## Configuration

Codex MCP configuration lives in `.codex/config.toml` and reads the API key from:

```env
STITCH_API_KEY=
```

Never commit the real key.

## Local Sync

After setting `STITCH_API_KEY` and restarting Codex or the shell:

```powershell
node scripts/stitch-sync.mjs
```

Optional overrides:

```powershell
$env:STITCH_PROJECT_TITLE="Paunova Premium Web"
$env:STITCH_OUT_DIR=".stitch-cache"
node scripts/stitch-sync.mjs
```

The script writes MCP snapshots to `.stitch-cache/`, which is ignored by Git. This cache is only for inspection and implementation; Stitch remains the source of truth.

## Current Blocker

`STITCH_API_KEY` is not available in the current Codex process, user environment, or machine environment. The Stitch MCP endpoint is reachable, but authenticated calls such as `list_projects` return `HTTP 401` until the key is configured.

