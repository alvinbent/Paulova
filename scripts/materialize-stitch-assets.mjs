#!/usr/bin/env node

import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const HTML_IN = ".stitch-cache/html";
const SHOTS_IN = ".stitch-cache/screenshots";
const PUBLIC_OUT = "public/stitch-assets";
const PAGES_OUT = path.join(PUBLIC_OUT, "pages");
const IMAGES_OUT = path.join(PUBLIC_OUT, "images");
const SHOTS_OUT = path.join(PUBLIC_OUT, "screenshots");

const pageMap = new Map([
  ["42d134c36fac472d91b255aef6a4d07a.html", "home.html"],
  ["a80a1383282e40839140077a0ef8b615.html", "tratamientos.html"],
  ["210d5935032d419087a65ee5474e2c6e.html", "limpieza-facial-profunda-hydrash.html"],
  ["f913911b803043eaac9a8ca12c200582.html", "quienes-somos.html"],
  ["5bcca473651942ca9f61119d90daaa0d.html", "contacto.html"],
  ["373e2e3b16e2496faca6b14ebfd34545.html", "international-patients.html"],
  ["93636dc7f95d4d029e939ba9de24bb54.html", "blog.html"],
]);

const linkRewrites = new Map([
  ["https://www.paunova.co/", "/"],
  ["https://www.paunova.co/quienes-somos/", "/quienes-somos"],
  ["https://www.paunova.co/contacto/", "/contacto"],
  ["https://www.paunova.co/limpieza-facial-profunda-hydrash/", "/limpieza-facial-profunda-hydrash"],
  ["https://www.paunova.co/tratamientos/", "/tratamientos"],
  ["https://www.paunova.co/blog/", "/blog"],
  ["https://www.paunova.co/international-patients/", "/international-patients"],
]);

const topNavigationScript = `<script>
document.addEventListener("click", function(event) {
  const link = event.target.closest && event.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http://wa.link")) return;
  if (href.startsWith("/")) {
    event.preventDefault();
    window.top.location.href = href;
  }
});
</script>`;

const imageUrlToLocal = new Map();

function hashUrl(url) {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

function extensionFromContentType(contentType) {
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("gif")) return ".gif";
  if (contentType?.includes("svg")) return ".svg";
  return ".jpg";
}

async function downloadImage(url) {
  if (imageUrlToLocal.has(url)) return imageUrlToLocal.get(url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not download image ${url}: ${res.status}`);
  }

  const ext = extensionFromContentType(res.headers.get("content-type"));
  const fileName = `${hashUrl(url)}${ext}`;
  const publicPath = `/stitch-assets/images/${fileName}`;
  const outPath = path.join(IMAGES_OUT, fileName);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(outPath, buffer);
  imageUrlToLocal.set(url, publicPath);
  return publicPath;
}

async function rewriteHtml(fileName) {
  const outputName = pageMap.get(fileName);
  if (!outputName) return;

  let html = await readFile(path.join(HTML_IN, fileName), "utf8");
  const srcMatches = [...html.matchAll(/src="(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g)];

  for (const match of srcMatches) {
    const originalUrl = match[1];
    const localUrl = await downloadImage(originalUrl);
    html = html.replaceAll(originalUrl, localUrl);
  }

  for (const [from, to] of linkRewrites) {
    html = html.replaceAll(`href="${from}"`, `href="${to}"`);
  }

  html = html.replace("</body>", `${topNavigationScript}</body>`);

  await writeFile(path.join(PAGES_OUT, outputName), html, "utf8");
}

async function main() {
  await mkdir(PAGES_OUT, { recursive: true });
  await mkdir(IMAGES_OUT, { recursive: true });
  await mkdir(SHOTS_OUT, { recursive: true });

  const htmlFiles = (await readdir(HTML_IN)).filter((file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    await rewriteHtml(file);
  }

  const shotFiles = (await readdir(SHOTS_IN)).filter((file) => file.endsWith(".png"));
  for (const file of shotFiles) {
    await copyFile(path.join(SHOTS_IN, file), path.join(SHOTS_OUT, file));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: "Stitch MCP cache",
    pages: [...pageMap.values()],
    localImages: imageUrlToLocal.size,
    screenshots: shotFiles.length,
  };

  await writeFile(path.join(PUBLIC_OUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Materialized ${manifest.pages.length} Stitch pages`);
  console.log(`Downloaded ${manifest.localImages} images`);
  console.log(`Copied ${manifest.screenshots} screenshots`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
