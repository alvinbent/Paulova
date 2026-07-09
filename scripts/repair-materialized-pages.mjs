#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const pagesDir = path.join(process.cwd(), "public", "stitch-assets", "pages");

const secretAccessHtml = `<style id="paunova-secret-access-style">
#paunova-secret-trigger {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 2147483640;
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  border: 1px solid rgba(197, 168, 128, 0.62);
  background: rgba(251, 249, 248, 0.76) url('/logo_secreto.jpg') center / cover no-repeat;
  box-shadow: 0 18px 44px -26px rgba(38, 25, 0, 0.78), inset 0 1px 0 rgba(255, 255, 255, 0.72);
  cursor: pointer;
  opacity: 0.48;
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-tap-highlight-color: transparent;
}

#paunova-secret-trigger:hover,
#paunova-secret-trigger:focus-visible {
  opacity: 0.92;
  outline: none;
  transform: translateY(-1px) scale(1.04);
  box-shadow: 0 22px 52px -24px rgba(38, 25, 0, 0.82), 0 0 0 4px rgba(197, 168, 128, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

#paunova-secret-trigger:active {
  transform: scale(0.96);
}

@media (max-width: 640px) {
  #paunova-secret-trigger {
    top: 14px;
    right: 14px;
    width: 42px;
    height: 42px;
    opacity: 0.58;
  }
}
</style>
<button id="paunova-secret-trigger" type="button" aria-label="Abrir portal privado" title="Portal privado"></button>
<script>
(function() {
  const trigger = document.getElementById('paunova-secret-trigger');
  if (!trigger) return;

  function openPortal(event) {
    if (event) event.preventDefault();
    window.top.location.assign('/api/auth/bypass');
  }

  trigger.addEventListener('click', openPortal);
  trigger.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') openPortal(event);
  });
})();
</script>`;

function repairMojibake(html) {
  if (!/[\u00c3\u00c2\u00e2]/.test(html)) return html;
  return Buffer.from(html, "latin1").toString("utf8");
}

function removeOldSecretAccess(html) {
  return html
    .replace(/<style id="paunova-secret-access-style">[\s\S]*?<\/style>\s*/g, "")
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

function polishCopy(html) {
  return html
    .replace(/btn\.innerHTML = '\u00a1Enviado con \u00e9xito!';/g, "btn.innerHTML = 'Solicitud enviada';")
    .replace(/>\s*\u00a1Enviado con \u00e9xito!\s*</g, ">Solicitud enviada<");
}

const files = (await readdir(pagesDir)).filter((file) => file.endsWith(".html"));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  const original = await readFile(filePath, "utf8");
  const repaired = injectSecretAccess(polishCopy(repairMojibake(original)));
  await writeFile(filePath, repaired, "utf8");
  console.log(`Repaired ${file}`);
}
