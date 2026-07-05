#!/usr/bin/env node

const MCP_URL = process.env.STITCH_MCP_URL || "https://stitch.googleapis.com/mcp";
const API_KEY = process.env.STITCH_API_KEY;
const TARGET_TITLE = process.env.STITCH_PROJECT_TITLE || "Paunova Premium Web";
const OUT_DIR = process.env.STITCH_OUT_DIR || ".stitch-cache";

if (!API_KEY) {
  console.error("Missing STITCH_API_KEY. Set it as an environment variable before running this script.");
  process.exit(1);
}

let rpcId = 1;

async function rpc(method, params = {}) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: rpcId++,
      method,
      params,
    }),
  });

  const text = await res.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`MCP returned non-JSON response (${res.status}): ${text.slice(0, 500)}`);
  }

  if (!res.ok || payload.error) {
    throw new Error(`MCP ${method} failed (${res.status}): ${JSON.stringify(payload.error || payload).slice(0, 1000)}`);
  }

  return payload.result;
}

async function callTool(name, args = {}) {
  return rpc("tools/call", {
    name,
    arguments: args,
  });
}

function toolContentToJson(result) {
  if (!result) return result;
  if (result.structuredContent) return result.structuredContent;
  if (Array.isArray(result.content)) {
    const text = result.content
      .filter((item) => item.type === "text" && typeof item.text === "string")
      .map((item) => item.text)
      .join("\n");
    if (text) {
      try {
        return JSON.parse(text);
      } catch {
        return { text };
      }
    }
  }
  return result;
}

function findProjects(payload) {
  if (Array.isArray(payload?.projects)) return payload.projects;
  if (Array.isArray(payload?.project)) return payload.project;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function getProjectId(project) {
  if (project.projectId) return project.projectId;
  if (project.id) return project.id;
  if (typeof project.name === "string") return project.name.replace(/^projects\//, "");
  return undefined;
}

function getProjectTitle(project) {
  return project.title || project.displayName || project.name || "";
}

async function writeJson(path, value) {
  const fs = await import("node:fs/promises");
  const pathModule = await import("node:path");
  await fs.mkdir(pathModule.dirname(path), { recursive: true });
  await fs.writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function ensureDir(path) {
  const fs = await import("node:fs/promises");
  await fs.mkdir(path, { recursive: true });
}

async function main() {
  await rpc("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "paunova-stitch-sync", version: "0.1.0" },
  });

  const [ownedRaw, sharedRaw] = await Promise.all([
    callTool("list_projects", { filter: "view=owned" }).then(toolContentToJson),
    callTool("list_projects", { filter: "view=shared" }).then(toolContentToJson),
  ]);

  const projects = [...findProjects(ownedRaw), ...findProjects(sharedRaw)];
  const target = projects.find((project) =>
    getProjectTitle(project).toLowerCase().includes(TARGET_TITLE.toLowerCase()),
  );

  if (!target) {
    console.error(`Project not found: ${TARGET_TITLE}`);
    console.error("Available projects:");
    for (const project of projects) {
      console.error(`- ${getProjectTitle(project)} (${getProjectId(project) || "no-id"})`);
    }
    process.exit(2);
  }

  const projectId = getProjectId(target);
  if (!projectId) {
    throw new Error(`Could not determine project ID for ${getProjectTitle(target)}`);
  }

  await ensureDir(`${OUT_DIR}/screens`);

  const project = toolContentToJson(await callTool("get_project", { name: `projects/${projectId}` }));
  const screensPayload = toolContentToJson(await callTool("list_screens", { projectId }));
  const designSystems = toolContentToJson(await callTool("list_design_systems", { projectId }));
  const screens = Array.isArray(screensPayload?.screens)
    ? screensPayload.screens
    : Array.isArray(screensPayload)
      ? screensPayload
      : [];

  const fullScreens = [];
  for (const screen of screens) {
    const name = screen.name;
    const screenId = typeof name === "string" ? name.split("/").pop() : screen.id;
    if (!name || !screenId) continue;
    const full = toolContentToJson(await callTool("get_screen", { name, projectId, screenId }));
    fullScreens.push(full);
    await writeJson(`${OUT_DIR}/screens/${screenId}.json`, full);
  }

  const manifest = {
    syncedAt: new Date().toISOString(),
    source: "Stitch MCP",
    projectTitle: getProjectTitle(target),
    projectId,
    projectName: `projects/${projectId}`,
    screenCount: fullScreens.length,
    screens: fullScreens.map((screen) => ({
      name: screen.name,
      id: screen.id || screen.name?.split("/").pop(),
      title: screen.title,
      width: screen.width,
      height: screen.height,
      type: screen.screenType,
      hasHtml: Boolean(screen.htmlCode),
      hasScreenshot: Boolean(screen.screenshot),
      hasFigmaExport: Boolean(screen.figmaExport),
    })),
  };

  await writeJson(`${OUT_DIR}/project.json`, project);
  await writeJson(`${OUT_DIR}/screens.json`, screensPayload);
  await writeJson(`${OUT_DIR}/design-systems.json`, designSystems);
  await writeJson(`${OUT_DIR}/manifest.json`, manifest);

  console.log(`Synced Stitch project: ${manifest.projectTitle}`);
  console.log(`Project ID: ${projectId}`);
  console.log(`Screens: ${manifest.screenCount}`);
  console.log(`Output: ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
