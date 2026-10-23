// ClientReady marketing site.
// Pages live in src/pages as HTML fragments with a small front-matter block.
// At startup every page is rendered into the shared layout once and kept in
// memory. Configuration comes from environment variables so the same code
// runs locally and on Railway without a rebuild.
//
//   GA_MEASUREMENT_ID   Google Analytics 4 measurement id, e.g. G-ABC123XYZ
//   FORMSPREE_FORM_ID   the id at the end of https://formspree.io/f/<id>
//   SITE_URL            public origin, e.g. https://clientready.example
//   PORT                set by Railway

const fs = require("fs");
const path = require("path");
const express = require("express");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const PAGES_DIR = path.join(SRC, "pages");
const PUBLIC = path.join(ROOT, "public");

const config = {
  gaId: process.env.GA_MEASUREMENT_ID || "G-VZ595XF2ME",
  formspreeId: process.env.FORMSPREE_FORM_ID || "xbggrvoo",
  siteUrl: (process.env.SITE_URL || "https://clientready.cc").replace(/\/$/, ""),
  port: Number(process.env.PORT) || 3000,
};

if (!/^G-[A-Z0-9]{8,12}$/.test(config.gaId)) {
  console.warn("GA_MEASUREMENT_ID looks wrong; check the Google tag id.");
}
if (!/^[a-z0-9]{8}$/i.test(config.formspreeId)) {
  console.warn("FORMSPREE_FORM_ID looks wrong; the signup form may not deliver.");
}

// --- tiny template helpers ---------------------------------------------------

function readFront(raw) {
  // Front matter is a leading block:  ---\nkey: value\n---\n
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: raw.slice(m[0].length) };
}

function fill(template, vars) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) =>
    vars[k] === undefined ? "" : String(vars[k])
  );
}

// Short content hash of the stylesheet and script, appended to their URLs so
// browsers and the CDN pick up a new version on every deploy.
const crypto = require("crypto");
const assetVersion = crypto
  .createHash("sha1")
  .update(fs.readFileSync(path.join(PUBLIC, "assets", "site.css")))
  .update(fs.readFileSync(path.join(PUBLIC, "assets", "site.js")))
  .digest("hex")
  .slice(0, 8);

const layout = fs.readFileSync(path.join(SRC, "layout.html"), "utf8");
const partials = {};
for (const f of fs.readdirSync(path.join(SRC, "partials"))) {
  partials[path.basename(f, ".html")] = fs.readFileSync(path.join(SRC, "partials", f), "utf8");
}

function renderPage(file) {
  const raw = fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
  const { meta, body } = readFront(raw);
  const slug = meta.slug !== undefined ? meta.slug : path.basename(file, ".html");
  const route = slug === "index" ? "/" : `/${slug}`;
  const vars = {
    asset_v: assetVersion,
    ga_id: config.gaId,
    formspree_id: config.formspreeId,
    site_url: config.siteUrl,
    canonical: config.siteUrl + route,
    route,
    page_key: slug === "index" ? "home" : slug,
    title: meta.title || "ClientReady",
    description: meta.description || "",
    body_class: meta.body_class || "",
    nav_mode: meta.nav || "full",
    ...meta,
  };
  // Partials may themselves use variables, so fill them first.
  const filledPartials = {};
  for (const k of Object.keys(partials)) filledPartials["partial_" + k] = fill(partials[k], vars);
  const content = fill(body, { ...vars, ...filledPartials });
  const html = fill(layout, { ...vars, ...filledPartials, content });
  return { route, html, slug };
}

const pages = fs
  .readdirSync(PAGES_DIR)
  .filter((f) => f.endsWith(".html"))
  .map(renderPage);

// --- optional static export: node server.js --export dist --------------------

const exportIdx = process.argv.indexOf("--export");
if (exportIdx !== -1) {
  const out = path.resolve(process.argv[exportIdx + 1] || "dist");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  fs.cpSync(PUBLIC, out, { recursive: true });
  // Flat files: /long-document.html is served at /long-document by Cloudflare
  // Pages, Netlify and Vercel; 404.html at the root is the custom not-found page.
  for (const p of pages) {
    fs.writeFileSync(path.join(out, `${p.slug}.html`), p.html);
  }
  // Static hosts without a server still need the clean-URL redirects spelled out.
  fs.writeFileSync(
    path.join(out, "_redirects"),
    pages
      .filter((p) => p.slug !== "index" && p.slug !== "404")
      .map((p) => `/${p.slug}/ /${p.slug} 301`)
      .join("\n") + "\n"
  );
  fs.writeFileSync(path.join(out, "_headers"), "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n");
  console.log(`Exported ${pages.length} pages to ${out}`);
  process.exit(0);
}

// --- server ------------------------------------------------------------------

const app = express();
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.static(PUBLIC, { maxAge: "1h", extensions: false }));

for (const p of pages) {
  app.get(p.route, (req, res) => {
    res.type("html").send(p.html);
  });
  if (p.slug !== "index") {
    // tolerate a trailing slash
    app.get(p.route + "/", (req, res) => res.redirect(301, p.route));
  }
}

app.get("/healthz", (req, res) => res.type("text").send("ok"));

app.use((req, res) => {
  const notFound = pages.find((p) => p.slug === "404");
  res.status(404).type("html").send(notFound ? notFound.html : "Not found");
});

app.listen(config.port, () => {
  console.log(`ClientReady site listening on :${config.port}`);
  console.log("Routes: " + pages.map((p) => p.route).join("  "));
});
