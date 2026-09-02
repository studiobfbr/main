#!/usr/bin/env node
// ============================================================
// BFBR — Pubblicazione automatica siti
// Per ogni codice: crea la repo GitHub, pusha i file,
// crea il sito Netlify e fa il deploy in produzione.
// Deploya SOLO i siti nuovi o modificati (confronto hash).
//
// USO:
//   node bfbr-pubblica.mjs                 -> tutti i siti in ../siti/** (solo nuovi/modificati)
//   node bfbr-pubblica.mjs RIS000001MB     -> solo quel codice
//   node bfbr-pubblica.mjs --force         -> forza il re-deploy di tutti
//   node bfbr-pubblica.mjs RIS000001MB --force
//
// Richiede: Node 18+, git, e (installato in automatico) netlify-cli.
// I token vanno in  bfbr-config.json  (vedi bfbr-config.esempio.json).
// ============================================================
import { readFileSync, writeFileSync, existsSync, mkdtempSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = join(__dir, '..');
const SITI  = join(ROOT, 'siti');
const CFG_PATH = join(__dir, 'bfbr-config.json');
const MAP_PATH = join(__dir, 'bfbr-netlify-map.json');
const CODE_RE  = /^[A-Z]{3}\d{6}[A-Z]{2}$/;

const log = (...a) => console.log(...a);
const die = (m) => { console.error('\n❌ ERRORE:', m); process.exit(1); };

// --- config / token ---
if (!existsSync(CFG_PATH))
  die(`Manca il file dei token. Copia bfbr-config.esempio.json in bfbr-config.json e incolla i token.`);
const CFG = JSON.parse(readFileSync(CFG_PATH, 'utf8'));
const GH_TOKEN = CFG.github_token, OWNER = CFG.github_owner || 'studiobfbr';
const NF_TOKEN = CFG.netlify_token, TEAM = CFG.netlify_team || 'studiobfbr';
if (!GH_TOKEN || GH_TOKEN.includes('INCOLLA')) die('Inserisci github_token in bfbr-config.json');
if (!NF_TOKEN || NF_TOKEN.includes('INCOLLA')) die('Inserisci netlify_token in bfbr-config.json');

// --- args ---
const rawArgs = process.argv.slice(2);
const FORCE = rawArgs.includes('--force');
const argCodes = rawArgs.filter((a) => !a.startsWith('--')).map((s) => s.toUpperCase());

// --- ricerca cartelle sito + hash contenuto ---
function findSiteDir(code) {
  for (const cat of readdirSync(SITI)) {
    const p = join(SITI, cat, code);
    if (existsSync(p) && statSync(p).isDirectory()) return p;
  }
  return null;
}
function allCodes() {
  const out = [];
  for (const cat of readdirSync(SITI)) {
    const catp = join(SITI, cat);
    if (!statSync(catp).isDirectory()) continue;
    for (const d of readdirSync(catp)) if (CODE_RE.test(d)) out.push(d);
  }
  return out;
}
function walk(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir).sort()) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, base, acc);
    else acc.push([p.slice(base.length), readFileSync(p)]);
  }
  return acc;
}
function hashDir(dir) {
  const h = createHash('sha256');
  for (const [rel, buf] of walk(dir)) { h.update(rel); h.update(buf); }
  return h.digest('hex');
}

// --- GitHub API ---
async function gh(path, method = 'GET', body) {
  const r = await fetch('https://api.github.com' + path, {
    method,
    headers: { Authorization: `token ${GH_TOKEN}`, 'User-Agent': 'bfbr', Accept: 'application/vnd.github+json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let j; const t = await r.text(); try { j = JSON.parse(t); } catch { j = { raw: t }; }
  return { status: r.status, j };
}
async function ensureRepo(code) {
  const got = await gh(`/repos/${OWNER}/${code}`);
  if (got.status === 200) { log(`  • repo ${OWNER}/${code} ok`); return; }
  const c = await gh('/user/repos', 'POST', { name: code, private: true, auto_init: false, description: `Sito ${code} — StudioBFBR` });
  if (c.status === 201) { log(`  • repo creata: ${OWNER}/${code}`); return; }
  if (c.status === 422) { log(`  • repo ${code} già esistente`); return; }
  die(`creazione repo ${code} fallita: ${c.status} ${JSON.stringify(c.j).slice(0, 200)}`);
}
function pushSite(code, siteDir) {
  const tmp = mkdtempSync(join(tmpdir(), 'bfbr-'));
  cpSync(siteDir, tmp, { recursive: true });
  const remote = `https://${OWNER}:${GH_TOKEN}@github.com/${OWNER}/${code}.git`;
  const run = (c) => execSync(c, { cwd: tmp, stdio: 'pipe' });
  try {
    run('git init -q');
    run('git config user.email "studiobfbr@bfbr.local"');
    run('git config user.name "StudioBFBR"');
    run('git add -A');
    run('git commit -q -m "Deploy sito ' + code + '"');
    run('git branch -M main');
    run(`git remote add origin "${remote}"`);
    run('git push -q -f -u origin main');
  } catch (e) {
    die(`push ${code} fallito: ${(e.stderr ? e.stderr.toString() : e.message).replace(GH_TOKEN, '***')}`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  log(`  • push OK → ${OWNER}/${code}`);
}

// --- Netlify API ---
async function nf(path, method = 'GET', body) {
  const r = await fetch('https://api.netlify.com/api/v1' + path, {
    method,
    headers: { Authorization: `Bearer ${NF_TOKEN}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let j; const t = await r.text(); try { j = JSON.parse(t); } catch { j = { raw: t }; }
  return { status: r.status, j };
}
const loadMap = () => (existsSync(MAP_PATH) ? JSON.parse(readFileSync(MAP_PATH, 'utf8')) : {});
const saveMap = (m) => writeFileSync(MAP_PATH, JSON.stringify(m, null, 2));

async function ensureSite(code, map) {
  if (map[code]?.siteId) return map[code].siteId;
  const name = code.toLowerCase();
  const c = await nf(`/${TEAM}/sites`, 'POST', { name });
  if (c.status === 200 || c.status === 201) { log(`  • sito Netlify creato: ${name}`); return c.j.id; }
  if (c.status === 422) {
    const all = await nf(`/sites`);
    const found = (all.j || []).find((s) => s.name === name);
    if (found) { log(`  • sito Netlify ${name} già esistente`); return found.id; }
  }
  die(`creazione sito Netlify ${name} fallita: ${c.status} ${JSON.stringify(c.j).slice(0, 200)}`);
}
function ensureNetlifyCli() {
  try { execSync('netlify --version', { stdio: 'ignore' }); }
  catch { log('Installo netlify-cli (solo la prima volta)…'); execSync('npm i -g netlify-cli', { stdio: 'inherit' }); }
}
function deploy(code, siteDir, siteId) {
  const env = { ...process.env, NETLIFY_AUTH_TOKEN: NF_TOKEN };
  execSync(`netlify deploy --prod --dir="${siteDir}" --site="${siteId}" --message="BFBR ${code}"`, { stdio: 'inherit', env });
  log(`  • ONLINE → https://${code.toLowerCase()}.netlify.app`);
}

// --- main ---
const codes = argCodes.length ? argCodes : allCodes();
if (!codes.length) { log('Nessun sito in siti/. Niente da fare.'); process.exit(0); }

const map = loadMap();
let deployed = 0, skipped = 0;
let cliReady = false;

for (const code of codes) {
  if (!CODE_RE.test(code)) { log(`— salto ${code}: codice non valido`); continue; }
  const dir = findSiteDir(code);
  if (!dir) { log(`— salto ${code}: cartella non trovata in siti/`); continue; }

  const hash = hashDir(dir);
  if (!FORCE && map[code]?.hash === hash) { skipped++; continue; }  // già online e invariato

  log(`\n=== ${code} ===`);
  if (!cliReady) { ensureNetlifyCli(); cliReady = true; }
  await ensureRepo(code);
  pushSite(code, dir);
  const siteId = await ensureSite(code, map);
  deploy(code, dir, siteId);
  map[code] = { siteId, hash };
  saveMap(map);
  deployed++;
}

log(`\n✅ Fatto. Nuovi/aggiornati: ${deployed} · invariati saltati: ${skipped}`);
