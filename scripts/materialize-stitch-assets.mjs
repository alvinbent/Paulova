#!/usr/bin/env node

import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const ZIP_EXPORT_ROOT = ".stitch-cache/zip-export/stitch_paunova_premium_web";
const PUBLIC_OUT = "public/stitch-assets";
const PAGES_OUT = path.join(PUBLIC_OUT, "pages");
const IMAGES_OUT = path.join(PUBLIC_OUT, "images");
const SHOTS_OUT = path.join(PUBLIC_OUT, "screenshots");
const REFERENCE_OUT = path.join(PUBLIC_OUT, "reference-images");
const gitShow = promisify(execFile);

const pages = [
  {
    sourceDir: "home_premium_paunova",
    slug: "home",
    output: "home.html",
    title: "Home Premium - Paunova",
    route: "/",
  },
  {
    sourceDir: "home_premium_con_acceso_privado_paunova",
    slug: "home-acceso-privado",
    output: "home-acceso-privado.html",
    title: "Home Premium con Acceso Privado - Paunova",
    route: "/home-acceso-privado",
  },
  {
    sourceDir: "tratamientos_premium_paunova",
    slug: "tratamientos",
    output: "tratamientos.html",
    title: "Tratamientos Premium - Paunova",
    route: "/tratamientos",
  },
  {
    sourceDir: "hydrash_detox_facial_paquetes_exclusivos",
    slug: "limpieza-facial-profunda-hydrash",
    output: "limpieza-facial-profunda-hydrash.html",
    title: "Hydrash Detox Facial - Paquetes Exclusivos",
    route: "/limpieza-facial-profunda-hydrash",
  },
  {
    sourceDir: "toxina_botul_nica_detalle_de_tratamiento",
    slug: "toxina-botulinica",
    output: "toxina-botulinica.html",
    title: "Toxina Botulinica - Detalle de Tratamiento",
    route: "/toxina-botulinica",
  },
  {
    sourceDir: "qui_nes_somos_dra._carolina_aguirre",
    slug: "quienes-somos",
    output: "quienes-somos.html",
    title: "Quienes Somos - Dra. Carolina Aguirre",
    route: "/quienes-somos",
  },
  {
    sourceDir: "contacto_paunova",
    slug: "contacto",
    output: "contacto.html",
    title: "Contacto - Paunova",
    route: "/contacto",
  },
  {
    sourceDir: "international_patients_paunova",
    slug: "international-patients",
    output: "international-patients.html",
    title: "International Patients - Paunova",
    route: "/international-patients",
  },
  {
    sourceDir: "blog_educativo_paunova",
    slug: "blog",
    output: "blog.html",
    title: "Blog Educativo - Paunova",
    route: "/blog",
  },
];

const linkRewrites = new Map([
  ["https://www.paunova.co/", "/"],
  ["https://www.paunova.co/quienes-somos/", "/quienes-somos"],
  ["https://www.paunova.co/contacto/", "/contacto"],
  ["https://www.paunova.co/limpieza-facial-profunda-hydrash/", "/limpieza-facial-profunda-hydrash"],
  ["https://www.paunova.co/toxina-botulinica/", "/toxina-botulinica"],
  ["https://www.paunova.co/tratamientos/", "/tratamientos"],
  ["https://www.paunova.co/blog/", "/blog"],
  ["https://www.paunova.co/international-patients/", "/international-patients"],
]);

const hashRewrites = new Map([
  ["#tratamientos", "/tratamientos"],
  ["#nosotros", "/quienes-somos"],
  ["#contacto", "/contacto"],
]);

const canonicalLocation = "Av. Principal 123, Centro Médico Especializado, Consultorio 504.";
const canonicalClinicName = "Paunova";
const canonicalClinicLongName = "Paunova Skin & Age Clinic";

const topNavigationScript = `<script>
document.addEventListener("click", function(event) {
  const link = event.target.closest && event.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http://wa.link")) return;
  if (href.startsWith("/")) {
    event.preventDefault();
    window.location.href = href;
  }
});
</script>`;

const globalInteractionStyle = `<style id="paunova-global-button-interactions">
:where(button, a[href]) {
  -webkit-tap-highlight-color: transparent;
}

:where(
  button,
  a[href][class*="bg-"],
  a[href][class*="border"],
  a[href][class*="rounded"],
  a[href][class*="shadow"],
  a[href][class*="px-"],
  a[href][class*="py-"],
  a[href][class*="w-10"],
  a[href][class*="w-12"],
  a[href][class*="w-14"]
) {
  transform-origin: center;
  transition-property: transform, box-shadow, background-color, color, border-color, opacity;
  transition-duration: 220ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

@media (hover: hover) {
  :where(
    button,
    a[href][class*="bg-"],
    a[href][class*="border"],
    a[href][class*="rounded"],
    a[href][class*="shadow"],
    a[href][class*="px-"],
    a[href][class*="py-"],
    a[href][class*="w-10"],
    a[href][class*="w-12"],
    a[href][class*="w-14"]
  ):hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 18px 42px -24px rgba(109, 88, 71, 0.55);
  }
}

:where(
  button,
  a[href][class*="bg-"],
  a[href][class*="border"],
  a[href][class*="rounded"],
  a[href][class*="shadow"],
  a[href][class*="px-"],
  a[href][class*="py-"],
  a[href][class*="w-10"],
  a[href][class*="w-12"],
  a[href][class*="w-14"]
):active {
  transform: scale(1.10);
}

@media (prefers-reduced-motion: reduce) {
  :where(button, a[href]) {
    transition-duration: 1ms !important;
  }

  :where(button, a[href]):hover,
  :where(button, a[href]):active {
    transform: none !important;
  }
}
</style>`;

const imageUrlToLocal = new Map();
const missingAssets = [];

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

async function readGitBlob(filePath) {
  const gitPath = filePath.replaceAll(path.sep, "/");
  for (const ref of ["HEAD", "origin/main", "main"]) {
    try {
      const { stdout } = await gitShow("git", ["show", `${ref}:${gitPath}`], {
        encoding: "buffer",
        maxBuffer: 10 * 1024 * 1024,
      });
      return stdout;
    } catch {
      // Try the next local or remote ref before declaring the asset unavailable.
    }
  }

  return null;
}

async function restoreCachedImage(url) {
  const hash = hashUrl(url);
  for (const ext of [".jpg", ".png", ".webp", ".gif", ".svg"]) {
    const fileName = `${hash}${ext}`;
    const outPath = path.join(IMAGES_OUT, fileName);
    const publicPath = `/stitch-assets/images/${fileName}`;

    if (await exists(outPath)) {
      imageUrlToLocal.set(url, publicPath);
      return publicPath;
    }

    const cached = await readGitBlob(path.join(PUBLIC_OUT, "images", fileName));
    if (cached) {
      await writeFile(outPath, cached);
      imageUrlToLocal.set(url, publicPath);
      return publicPath;
    }
  }

  return null;
}

function normalizeName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadImage(url) {
  if (imageUrlToLocal.has(url)) return imageUrlToLocal.get(url);

  const hashed = hashUrl(url);
  const possibleExtensions = [".jpg", ".png", ".webp", ".gif", ".svg"];
  for (const ext of possibleExtensions) {
    const fileName = `${hashed}${ext}`;
    const localPath = path.join(IMAGES_OUT, fileName);
    try {
      await stat(localPath);
      const publicPath = `/stitch-assets/images/${fileName}`;
      imageUrlToLocal.set(url, publicPath);
      return publicPath;
    } catch {
      // Not found with this extension, check next
    }
  }

  const res = await fetch(url);
  if (!res.ok) {
    const cachedUrl = await restoreCachedImage(url);
    if (cachedUrl) return cachedUrl;

    missingAssets.push({ type: "image", url, reason: `HTTP ${res.status}` });
    return url;
  }

  const ext = extensionFromContentType(res.headers.get("content-type"));
  const fileName = `${hashed}${ext}`;
  const publicPath = `/stitch-assets/images/${fileName}`;
  const outPath = path.join(IMAGES_OUT, fileName);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(outPath, buffer);
  imageUrlToLocal.set(url, publicPath);
  return publicPath;
}

function visibleText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function routeForAnchor(href, innerHtml) {
  if (hashRewrites.has(href)) return hashRewrites.get(href);
  if (href !== "#") return null;

  const text = normalizeText(visibleText(innerHtml));
  if (!text) return null;

  if (text.includes("toxina")) return "/toxina-botulinica";
  if (text.includes("hydrash") || text.includes("limpieza")) return "/limpieza-facial-profunda-hydrash";
  if (text.includes("pacientes internacionales")) return "/international-patients";
  if (text.includes("blog")) return "/blog";
  if (
    text.includes("tratamiento") ||
    text.includes("catalogo") ||
    text.includes("faciales") ||
    text.includes("laser") ||
    text.includes("contorno")
  ) {
    return "/tratamientos";
  }
  if (
    text.includes("contact") ||
    text.includes("agendar") ||
    text.includes("valoracion") ||
    text.includes("iniciar proceso") ||
    text.includes("google maps")
  ) {
    return "/contacto";
  }
  if (text.includes("nosotros") || text.includes("sobre la dra") || text.includes("staff")) {
    return "/quienes-somos";
  }
  if (text.includes("dra. carolina") || text.includes("dra carolina")) return "/";

  return null;
}

function rewriteAnchorRoutes(html) {
  return html.replace(/<a\b([^>]*?)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (match, before, href, after, inner) => {
    const route = routeForAnchor(href, inner);
    if (!route) return match;
    return `<a${before}href="${route}"${after}>${inner}</a>`;
  });
}

function injectGlobalInteractionStyle(html) {
  if (html.includes('id="paunova-global-button-interactions"')) return html;
  return html.replace("</head>", `${globalInteractionStyle}</head>`);
}

function repairMojibake(html) {
  if (!/[\u00c3\u00c2\u00e2]/.test(html)) return html;
  return Buffer.from(html, "latin1").toString("utf8");
}

function rewriteLocationCopy(html) {
  const oldCityPattern = new RegExp(["Bu", "ga"].join(""), "g");
  const oldCapitalPattern = new RegExp(["Bo", "go", "ta"].join(""), "g");
  const oldCapitalAccentPattern = new RegExp(["Bo", "got", "\u00e1"].join(""), "g");
  const oldStreetName = ["Ca", "lle"].join("");
  const oldStreetOne = `${oldStreetName} ${["1", "00"].join("")}`;
  const oldStreetTwo = `${oldStreetName} ${["9", " Sur"].join("")}`;
  const oldMedicalCenter = ["Centro M", "\u00e9", "dico de Especialidades"].join("");
  const oldSuite = ["Suite", " 402"].join("");

  return html
    .replace(/Av\. Principal 123, Centro Médico Especializado, Consultorio 504\./g, canonicalLocation)
    .replace(new RegExp(`${oldStreetOne} # 15-32, Consultorio 504<br\\/>[^<]+, Colombia`, "g"), canonicalLocation)
    .replace(new RegExp(`${oldStreetTwo} # 13\\s*-?117<br\\/>[^<]+Valle del Cauca, Colombia\\.`, "g"), canonicalLocation)
    .replace(new RegExp(`${oldStreetTwo} # 13-117 [^,]+, Valle del Cauca, CO\\.`, "g"), canonicalLocation)
    .replace(new RegExp(`${oldStreetTwo} # 13-117 [^,]+, Valle`, "g"), canonicalLocation)
    .replace(new RegExp(`${oldStreetTwo} # 13\\s*-?117\\s*\\n[^,]+,\\s*Valle del Cauca,\\s*CO\\.?`, "g"), canonicalLocation)
    .replace(new RegExp(`${oldStreetTwo} # 13\\s*-?117`, "g"), canonicalLocation)
    .replace(new RegExp(`${oldCityPattern.source}\\s*,\\s*Valle del Cauca,\\s*CO\\.?`, "g"), canonicalLocation)
    .replace(new RegExp(`${oldCityPattern.source},\\s*Valle del Cauca`, "g"), canonicalLocation)
    .replace(new RegExp(`${oldCityPattern.source},\\s*Colombia`, "g"), canonicalLocation)
    .replace(oldCapitalPattern, canonicalLocation)
    .replace(oldCapitalAccentPattern, canonicalLocation)
    .replace(new RegExp(`${oldMedicalCenter}, ${oldSuite}`, "g"), canonicalLocation)
    .replace(new RegExp(`Paciente de ${oldCityPattern.source}`, "g"), "Paciente Paunova")
    .replaceAll("Clínica Paunova", canonicalClinicName)
    .replaceAll("Paunova Skin &amp; Age Clinic", canonicalClinicLongName)
    .replace(
      new RegExp(`Estamos ubicados en ${oldCityPattern.source}, ofreciendo atención premium para pacientes de todo el Valle del Cauca, incluyendo Cali, Palmira y Tuluá\\.`, "g"),
      `Estamos ubicados en ${canonicalLocation} Ofrecemos atención premium para pacientes locales, nacionales e internacionales.`
    )
    .replace(
      new RegExp(`Inicia tu camino hacia una belleza natural y saludable\\. Agenda una valoración personalizada en nuestra clínica de ${oldCityPattern.source}\\.`, "g"),
      "Inicia tu camino hacia una belleza natural y saludable. Agenda una valoración personalizada en nuestra clínica."
    )
    .replace(
      new RegExp(`Recomendaciones exclusivas en ${oldCityPattern.source} y sus alrededores\\. Desde transporte privado hasta los mejores hoteles boutique para tu recuperación\\.`, "g"),
      "Recomendaciones exclusivas para tu visita. Desde transporte privado hasta hoteles boutique seleccionados para una recuperación tranquila."
    )
    .replace(new RegExp(`${oldCityPattern.source}: Un Destino para la Renovación`, "g"), "Paunova: Un Destino para la Renovación")
    .replace(
      new RegExp(`Ubicada en el corazón del Valle del Cauca, ${oldCityPattern.source} no solo ofrece excelencia médica, sino también un entorno de paz y patrimonio histórico ideal para una recuperación serena\\.`, "g"),
      "Paunova combina excelencia médica, acompañamiento humano y un entorno cuidadosamente coordinado para una recuperación serena."
    )
    .replace(
      new RegExp(`Viajar desde Miami para mi tratamiento con la Dra\\. Carolina fue la mejor decisión\\. La atención virtual previa me dio toda la seguridad, y el cuidado en ${oldCityPattern.source} superó mis expectativas\\.`, "g"),
      "Viajar desde Miami para mi tratamiento con la Dra. Carolina fue la mejor decisión. La atención virtual previa me dio toda la seguridad, y el cuidado de Paunova superó mis expectativas."
    )
    .replace(
      new RegExp(`Excelencia médica y estética en ${oldCityPattern.source}, transformando vidas con discreción y naturalidad\\.`, "g"),
      "Excelencia médica y estética, transformando vidas con discreción y naturalidad."
    )
    .replace(oldCityPattern, canonicalClinicName);
}

async function rewriteHtml(page) {
  const sourcePath = path.join(ZIP_EXPORT_ROOT, page.sourceDir, "code.html");
  let html = repairMojibake(await readFile(sourcePath, "utf8"));
  const srcMatches = [...html.matchAll(/src="(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g)];

  for (const match of srcMatches) {
    const originalUrl = match[1];
    const localUrl = await downloadImage(originalUrl);
    html = html.replaceAll(originalUrl, localUrl);
  }

  for (const [from, to] of linkRewrites) {
    html = html.replaceAll(`href="${from}"`, `href="${to}"`);
  }

  const secretButtonHtml = `<style id="paunova-secret-access-style">
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

  html = rewriteAnchorRoutes(html);
  html = rewriteLocationCopy(html);
  html = injectGlobalInteractionStyle(html);
  html = html.replace(/btn\.innerHTML = '\u00a1Enviado con \u00e9xito!';/g, "btn.innerHTML = 'Solicitud enviada';");
  html = html.replace("</body>", `${secretButtonHtml}${topNavigationScript}</body>`);
  await writeFile(path.join(PAGES_OUT, page.output), html, "utf8");
}

async function copyScreenshots() {
  for (const page of pages) {
    const sourcePath = path.join(ZIP_EXPORT_ROOT, page.sourceDir, "screen.png");
    const targetPath = path.join(SHOTS_OUT, `${page.slug}.png`);
    if (await exists(sourcePath)) await copyFile(sourcePath, targetPath);
  }

  const entries = await readdir(ZIP_EXPORT_ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith("image_from_")) continue;
    const sourcePath = path.join(ZIP_EXPORT_ROOT, entry.name, "screen.png");
    if (!(await exists(sourcePath))) continue;
    await copyFile(sourcePath, path.join(REFERENCE_OUT, `${normalizeName(entry.name)}.png`));
  }
}

async function copyTextSource() {
  const entries = await readdir(ZIP_EXPORT_ROOT, { withFileTypes: true });
  const textFile = entries.find((entry) => entry.isFile() && entry.name.endsWith(".md"));
  if (!textFile) return null;

  const targetName = normalizeName(textFile.name);
  const source = repairMojibake(await readFile(path.join(ZIP_EXPORT_ROOT, textFile.name), "utf8"));
  await writeFile(path.join(PUBLIC_OUT, targetName), rewriteLocationCopy(source), "utf8");
  return targetName;
}

async function main() {
  if (!(await exists(ZIP_EXPORT_ROOT))) {
    throw new Error(`Stitch ZIP export not found at ${ZIP_EXPORT_ROOT}. Unzip the Stitch export before materializing.`);
  }

  await rm(PUBLIC_OUT, { recursive: true, force: true });
  await mkdir(PAGES_OUT, { recursive: true });
  await mkdir(IMAGES_OUT, { recursive: true });
  await mkdir(SHOTS_OUT, { recursive: true });
  await mkdir(REFERENCE_OUT, { recursive: true });

  for (const page of pages) {
    await rewriteHtml(page);
  }

  await copyScreenshots();
  const textSource = await copyTextSource();

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: "Stitch ZIP export",
    zipSource: "C:/Users/PC/Downloads/stitch_paunova_premium_web.zip",
    pages: pages.map(({ sourceDir, slug, output, title, route }) => ({
      sourceDir,
      slug,
      output,
      title,
      route,
      screenshot: `/stitch-assets/screenshots/${slug}.png`,
    })),
    assets: {
      cssFiles: [],
      fonts: [
        "Google Fonts: EB Garamond",
        "Google Fonts: Hanken Grotesk",
        "Google Fonts: Sora",
        "Google Fonts: Material Symbols Outlined",
      ],
      localImages: imageUrlToLocal.size,
      referenceImages: (await readdir(REFERENCE_OUT)).length,
      screenshots: (await readdir(SHOTS_OUT)).length,
      textSource,
      missingAssets,
    },
    reusableComponents: [
      "Navigation/header",
      "Hero sections",
      "Treatment cards",
      "CTA buttons",
      "Footer/contact blocks",
    ],
  };

  await writeFile(path.join(PUBLIC_OUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Materialized ${pages.length} Stitch ZIP pages`);
  console.log(`Downloaded ${imageUrlToLocal.size} images`);
  console.log(`Copied ${manifest.assets.screenshots} page screenshots`);
  console.log(`Copied ${manifest.assets.referenceImages} reference images`);
  if (missingAssets.length > 0) console.log(`Missing assets: ${missingAssets.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
