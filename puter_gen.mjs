// puter_gen.mjs — imágenes GRATIS con gpt-image-2 / gpt-image-1.5 vía Puter (SDK Node.js,
// modelo "user pays", sin pagar API). puter.ai.txt2img devuelve un data-URL base64 en Node.
//
//   node puter_gen.mjs --login                              → abre navegador, te logueás a
//     Puter UNA vez; agarra el token y lo guarda en .env (puterAuthToken=...).
//   node puter_gen.mjs <lista.json> [--model gpt-image-2] [--quality high] [--transparent]
//     lista = [{name, prompt, transparent?}] → baja a public/img/<name>.png
import fs from "fs";
import path from "path";

const envFile = path.join(process.cwd(), ".env");
const readEnv = () => { const o = {}; if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.+?)\s*$/); if (m) o[m[1]] = m[2].replace(/^["']|["']$/g, ""); } return o; };
const ENV = readEnv();
for (const [k, v] of Object.entries(ENV)) if (!process.env[k]) process.env[k] = v;

const ARGS = process.argv.slice(2);
const flag = (f, d) => { const i = ARGS.indexOf(f); return i >= 0 && ARGS[i + 1] ? ARGS[i + 1] : d; };
const MODEL = flag("--model", "gpt-image-2");
const QUALITY = flag("--quality", "low"); // ★ Puter: SIEMPRE low (rinde mucho más el crédito free)
const SIZE = flag("--size", "1536x1024"); // ★ 16:9
const TRANSPARENT_ALL = ARGS.includes("--transparent");
const PROMPTS = ARGS.find((a) => !a.startsWith("--") && a.endsWith(".json")) || "public/img/prompts.json";
const OUT = "public/img";
const GAP = Number(process.env.PUTER_GAP_MS) || 1200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── LOGIN: patchright abre puter.com, te logueás, agarra el token del localStorage ──
async function doLogin() {
  const { chromium } = await import("patchright");
  const PROFILE = path.resolve(process.env.PUTER_PROFILE || ".puterprofile");
  const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
  for (const f of ["SingletonLock", "SingletonCookie", "SingletonSocket"]) { try { fs.rmSync(path.join(PROFILE, f), { force: true }); } catch {} }
  const ctx = await chromium.launchPersistentContext(PROFILE, { channel: "chrome", executablePath: fs.existsSync(CHROME) ? CHROME : undefined, headless: false, viewport: null, acceptDownloads: true });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto("https://puter.com/", { waitUntil: "domcontentloaded" }).catch(() => {});
  console.log("\n→ Logueate / creá tu cuenta Puter en la ventana. Cuando entres a tu escritorio, espero el token solo...\n");
  let token = null;
  for (let i = 0; i < 300; i++) { // ~10 min
    token = await page.evaluate(() => { try { return localStorage.getItem("puter.auth.token.v2") || localStorage.getItem("puter.auth.token") || window.auth_token || null; } catch { return null; } }).catch(() => null);
    if (token) break;
    await sleep(2000);
  }
  await ctx.close().catch(() => {});
  if (!token) { console.error("✗ No se detectó token. ¿Entraste a Puter?"); process.exit(1); }
  const env = readEnv(); env.puterAuthToken = token;
  const txt = Object.entries(env).map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
  fs.writeFileSync(envFile, txt);
  console.log("✓ Token Puter guardado en .env (puterAuthToken)");
  process.exit(0);
}

// ── RUN: SDK Node, genera y baja del data-URL ──
async function doRun() {
  const token = process.env.puterAuthToken;
  if (!token) { console.error("✗ Falta puterAuthToken. Corré:  node puter_gen.mjs --login"); process.exit(1); }
  const { init } = await import("@heyputer/puter.js/src/init.cjs");
  const puter = init(token);

  const list = JSON.parse(fs.readFileSync(PROMPTS, "utf8").replace(/^﻿/, ""));
  fs.mkdirSync(OUT, { recursive: true });
  const pending = list.filter((p) => p.name && p.prompt && !fs.existsSync(path.join(OUT, `${p.name}.png`)));
  console.log(`Puter · modelo ${MODEL} · calidad ${QUALITY} · ${pending.length}/${list.length} por generar`);
  if (!pending.length) { console.log("nada que hacer ✓"); process.exit(0); }

  let ok = 0, err = 0;
  for (const p of pending) {
    const transparent = TRANSPARENT_ALL || !!p.transparent;
    const opts = { model: MODEL, quality: QUALITY, size: SIZE };
    if (transparent) { opts.background = "transparent"; opts.transparent = true; }
    try {
      const img = await puter.ai.txt2img(p.prompt, opts);
      const src = (img && (img.src || img.toString())) || "";
      if (!src.startsWith("data:")) throw new Error("respuesta no es data-URL: " + src.slice(0, 40));
      const b64 = src.split(",")[1];
      fs.writeFileSync(path.join(OUT, `${p.name}.png`), Buffer.from(b64, "base64"));
      const kb = Math.round(fs.statSync(path.join(OUT, `${p.name}.png`)).size / 1024);
      console.log(`↓ ${p.name}.png  ${kb}KB${transparent ? "  (transp)" : ""}`);
      ok++;
    } catch (e) { console.log(`✗ ${p.name}: ${String(e && (e.message || e.error?.message || e.code) || e)}`); err++; }
    await sleep(GAP);
  }
  console.log(`\n=== LISTO === ${ok} ok · ${err} err`);
  process.exit(0);
}

(ARGS.includes("--login") ? doLogin() : doRun()).catch((e) => { console.error(e); process.exit(1); });
