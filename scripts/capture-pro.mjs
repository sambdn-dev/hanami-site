// Captures des écrans Hanami Pro depuis le prototype (dossier prototype/).
// Usage : node scripts/capture-pro.mjs [--only=briefing-dirigeant,tournee-mobile]
// Échoue (exit 1) si une police, une photo ou une carte ne charge pas, ou si « API KEY REQUIRED » apparaît.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const PROTO_DIR = path.join(ROOT, 'prototype');
const PROTO_FILE = process.env.PROTOTYPE_FILE || 'Hanami Pro v2.dc.html';
const MANIFEST = path.join(ROOT, 'src/components/pro/pro-captures.json');
const KEEP_VERSIONS = 5;

// Écrans : id = valeur de ?capture= dans le prototype.
const SCREENS = [
  { id: 'briefing-dirigeant', viewport: { width: 1440, height: 1000 }, scale: 2 },
  { id: 'briefing-equipe', viewport: { width: 1440, height: 1000 }, scale: 2 },
  { id: 'tournee-mobile', viewport: { width: 390, height: 844 }, scale: 3, mobile: true },
  { id: 'contrats-mois', viewport: { width: 1440, height: 1000 }, scale: 2 },
  { id: 'fil-activite', viewport: { width: 1440, height: 1000 }, scale: 2 },
  { id: 'urgence-gazon', viewport: { width: 1440, height: 1000 }, scale: 2 },
  { id: 'fiche-client', viewport: { width: 1440, height: 1000 }, scale: 2 },
  { id: 'choix-creneau', viewport: { width: 390, height: 844 }, scale: 3, mobile: true },
];
const TILE_HOSTS = ['server.arcgisonline.com'];

const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const screens = only.length ? SCREENS.filter((s) => only.includes(s.id)) : SCREENS;
if (only.length && (screens.length !== only.length || new Set(only).size !== only.length)) {
  throw new Error(`Écran de capture inconnu ou dupliqué : ${only.join(', ')}`);
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
function serve(dir) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${file} n'est pas un PNG valide`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length };
}

const sha = (() => { try { return execSync('git rev-parse --short HEAD').toString().trim(); } catch { return 'local'; } })();
const version = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${sha}`;
const outDir = path.join(ROOT, 'public/images/pro/v', version);
fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(path.join(PROTO_DIR, PROTO_FILE))) throw new Error(`Prototype introuvable : ${PROTO_FILE}`);
const srv = await serve(PROTO_DIR);
const base = `http://127.0.0.1:${srv.address().port}/${encodeURIComponent(PROTO_FILE)}`;
const browser = await chromium.launch();
const results = {};
let failed = false;

for (const s of screens) {
  const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.scale, isMobile: !!s.mobile, hasTouch: !!s.mobile, locale: 'fr-FR', timezoneId: 'Europe/Paris', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const problems = [];
  page.on('pageerror', (e) => problems.push(`Erreur JS : ${e.message}`));
  page.on('requestfailed', (r) => { if (['image', 'font', 'stylesheet', 'script'].includes(r.resourceType())) problems.push(`Échec de chargement : ${r.url()}`); });
  page.on('response', (r) => {
    const t = r.request().resourceType();
    if (['image', 'font'].includes(t) && r.status() >= 400) problems.push(`HTTP ${r.status()} : ${r.url()}`);
    if (t === 'image' && /\/tile\/|\{z\}|basemaps|tiles?\./i.test(r.url()) && !TILE_HOSTS.includes(new URL(r.url()).host)) problems.push(`Tuile d'un fournisseur non autorisé : ${r.url()}`);
  });
  try {
    await page.goto(`${base}?capture=${s.id}`, { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction(() => ['ready', 'error'].includes(document.documentElement.getAttribute('data-capture-state')), null, { timeout: 45000 });
    const state = await page.evaluate(() => ({ state: document.documentElement.getAttribute('data-capture-state'), error: document.documentElement.getAttribute('data-capture-error') }));
    if (state.state !== 'ready') problems.push(`Prototype : ${state.error}`);
    if (await page.getByText(/API KEY REQUIRED/i).count()) problems.push('Texte « API KEY REQUIRED » visible');
    if (problems.length) throw new Error(problems.join('\n  '));
    const file = path.join(outDir, `${s.id}.png`);
    await page.screenshot({ path: file, animations: 'disabled' });
    const dim = pngSize(file);
    const expected = { width: s.viewport.width * s.scale, height: s.viewport.height * s.scale };
    if (dim.width !== expected.width || dim.height !== expected.height) throw new Error(`Dimensions inattendues ${dim.width}×${dim.height}`);
    if (dim.bytes < 30000) throw new Error(`Image trop légère (${dim.bytes} o) — écran probablement vide`);
    results[s.id] = { src: `/images/pro/v/${version}/${s.id}.png`, width: dim.width / s.scale, height: dim.height / s.scale };
    console.log(`✓ ${s.id} — ${dim.width}×${dim.height}`);
  } catch (e) {
    failed = true;
    console.error(`✗ ${s.id}\n  ${e.message}`);
  }
  await ctx.close();
}
await browser.close();
srv.close();

if (failed) { fs.rmSync(outDir, { recursive: true, force: true }); process.exit(1); }

const prev = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { screens: {} };
const manifest = { version, generatedAt: new Date().toISOString(), screens: { ...prev.screens, ...results } };
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

// Garde les N dernières versions (les plus anciennes restent dans l'historique Git).
const vRoot = path.join(ROOT, 'public/images/pro/v');
const inUse = new Set(Object.values(manifest.screens).map((x) => x.src.split('/')[4]));
fs.readdirSync(vRoot).sort().reverse().forEach((v, i) => { if (i >= KEEP_VERSIONS && !inUse.has(v)) fs.rmSync(path.join(vRoot, v), { recursive: true, force: true }); });
console.log(`Manifeste mis à jour → version ${version}`);
