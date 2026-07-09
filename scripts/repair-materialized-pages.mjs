#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { secretAccessHtml } from "./secret-access-template.mjs";

const pagesDir = path.join(process.cwd(), "public", "stitch-assets", "pages");

function repairMojibake(html) {
  if (!/[\u00c3\u00c2\u00e2]/.test(html)) return html;
  return Buffer.from(html, "latin1").toString("utf8");
}

function removeOldSecretAccess(html) {
  return html
    .replace(/<style id="paunova-secret-access-style">[\s\S]*?<\/script>\s*/g, "")
    .replace(/<button id="paunova-secret-trigger"[\s\S]*?<\/script>\s*/g, "")
    .replace(/<div id="paunova-secret-trigger"[\s\S]*?<\/script>\s*/g, "");
}

function injectSecretAccess(html) {
  const cleaned = removeOldSecretAccess(html);
  if (!cleaned.includes("</body>")) {
    throw new Error("Cannot inject secret access: missing </body>");
  }
  return cleaned.replace("</body>", `${secretAccessHtml}</body>`);
}

function rewriteBrandAssets(html) {
  return html
    .replaceAll("/brand-assets/logo-horizontal-dorado.png", "/brand-assets/logo-paunova-skin-age.png")
    .replaceAll("Dra Carolina Aguirre - Paunova", "Paunova Skin & Age Clinic")
    .replaceAll("Dra Carolina Aguirre Paunova", "Paunova Skin & Age Clinic")
    .replaceAll("alt=\"Dra Carolina Aguirre\"", "alt=\"Paunova Skin & Age Clinic\"")
    .replaceAll("alt=\"Dra Carolina Aguirre Paunova\"", "alt=\"Paunova Skin & Age Clinic\"")
    .replaceAll("class=\"h-10 md:h-12 w-auto object-contain\"", "class=\"h-12 md:h-14 w-auto object-contain\"")
    .replaceAll("class=\"h-14 w-auto object-contain mb-6\"", "class=\"h-16 md:h-20 w-auto object-contain mb-6\"")
    .replaceAll("class=\"h-12 w-auto object-contain\"", "class=\"h-14 md:h-16 w-auto object-contain\"");
}

function polishCopy(html) {
  return html
    .replace(/btn\.innerHTML = '\u00a1Enviado con \u00e9xito!';/g, "btn.innerHTML = 'Solicitud enviada';")
    .replace(/>\s*\u00a1Enviado con \u00e9xito!\s*</g, ">Solicitud enviada<");
}

const files = (await readdir(pagesDir)).filter((file) => file.endsWith(".html"));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  const original = await readFile(filePath, "utf8");
  const repaired = injectSecretAccess(rewriteBrandAssets(polishCopy(repairMojibake(original))));
  await writeFile(filePath, repaired, "utf8");
  console.log(`Repaired ${file}`);
}
