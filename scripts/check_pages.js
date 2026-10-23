// Renders the site to a temp folder and checks what the course asks for on
// every public page: a Google tag, exactly one signup form (except thanks,
// privacy and 404), no unfilled template variables, and a canonical URL.
// Run: npm run check
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const out = fs.mkdtempSync(path.join(os.tmpdir(), "clientready-check-"));
execFileSync(process.execPath, [path.join(__dirname, "..", "server.js"), "--export", out], { stdio: "inherit" });

const noForm = new Set(["thanks", "privacy", "404"]);
let failures = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".html")) check(p);
  }
}

function check(file) {
  const rel = path.relative(out, file);
  const slug = rel === "index.html" ? "home" : rel.replace(/\.html$/, "");
  const html = fs.readFileSync(file, "utf8");
  const problems = [];
  if (/\{\{\s*[a-zA-Z0-9_]+\s*\}\}/.test(html)) problems.push("unfilled template variable");
  if (!/googletagmanager\.com\/gtag\/js\?id=G-/.test(html)) problems.push("no Google tag");
  if (/G-XXXXXXXXXX/.test(html)) problems.push("GA_MEASUREMENT_ID is still the placeholder");
  if (!/<link rel="canonical"/.test(html)) problems.push("no canonical");
  const forms = (html.match(/<form[^>]*data-signup/g) || []).length;
  if (!noForm.has(slug) && forms !== 1) problems.push(`expected 1 signup form, found ${forms}`);
  if (forms && !/formspree\.io\/f\/[a-z0-9]{8}"/i.test(html)) problems.push("Formspree id missing or malformed");
  if (!/<h1[\s>]/.test(html)) problems.push("no h1");
  if (slug === "thanks" && !/"signup"/.test(fs.readFileSync(path.join(__dirname, "..", "public", "assets", "site.js"), "utf8")))
    problems.push("site.js does not fire the signup event");
  const status = problems.length ? "FAIL" : "ok";
  if (problems.length) failures++;
  console.log(`${status.padEnd(4)} /${slug === "home" ? "" : slug}${problems.length ? "  — " + problems.join("; ") : ""}`);
}

walk(out);
fs.rmSync(out, { recursive: true, force: true });
if (failures) {
  console.error(`\n${failures} page(s) need attention.`);
  process.exit(1);
}
console.log("\nAll pages pass.");
