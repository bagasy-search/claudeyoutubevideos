// autopilot.mjs — un video de punta a punta SIN humano: corre la fábrica y, ante cada freno, llama al
// arreglo que corresponde (código fijo → modelo director → juez de visión). Nunca a Claude.
//
//   node factory/tools/autopilot.mjs <slug> [--max-usd 2] [--render-local] [--max-vueltas 25]
//
// Qué resuelve solo (todo medido en hlqwen3, 04/05-oct-2026, donde lo resolvió Claude a mano):
//   30_direct needs/failed   → el MODELO director escribe/corrige la dirección (factory/tools/llm.mjs)
//   50_agnes revisión a ojo  → JUEZ de visión por cuadro (factory/lib/vision_judge.mjs); 2º rechazo → foto quieta
//   45_stock                 → el juez audita cada clip real (caras, fuera de tema); rechazado → vuelve a imagen
//   60_build "MISMO asset"   → se le devuelve al director como error de dirección
//   60_build apertura        → sin miniatura (no hay motor de imagen pago para hacerla)
//   60_build capas 2.5D      → factory/py/local_parallax.py (CPU, gratis)
//   --render-local           → Remotion en esta máquina (la nube no puede empujar ramas del farm)
// Lo que NO resuelve (para y lo dice): falta de saldo (blocked), errores desconocidos, tope de US$.
// ⛔ Plata: con FACTORY_AVATAR_NO_PAGAR=1 el avatar sólo se reusa. El tope --max-usd cuenta modelo + juez.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT, env } from "../lib/env.mjs";
import { slugPaths } from "../lib/paths.mjs";
import { juzgarClip } from "../lib/vision_judge.mjs";

const [slug, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest[i + 1] : d; };
if (!slug) { console.log("uso: autopilot.mjs <slug> [--max-usd 2] [--render-local] [--max-vueltas 25]"); process.exit(2); }
const MAX_USD = Number(opt("max-usd", 2)), MAX_VUELTAS = Number(opt("max-vueltas", 25)), LOCAL = rest.includes("--render-local");
const P = slugPaths(slug);
const PRECIOS = { "qwen3.8-max": [1.65, 4.95], "qwen3.8-flash": [0.16, 0.47], "deepseek-v4-pro": [0.43, 0.87] };
const MODELO = env("LLM_MODEL") || "qwen3.8-max";
const [USD_IN, USD_OUT] = PRECIOS[MODELO] || [Number(env("LLM_USD_IN") || 1), Number(env("LLM_USD_OUT") || 5)];
const VISION_USD = 0.0005;   // qwen3-vl-flash, ~1.000 tokens por clip: una cota holgada

const stF = path.join(P.state, "autopilot.json");
const st = fs.existsSync(stF) ? JSON.parse(fs.readFileSync(stF, "utf8")) : { usd: 0, rechazos: {}, stockJuzgado: false, acciones: [] };
const guardar = () => { fs.mkdirSync(path.dirname(stF), { recursive: true }); fs.writeFileSync(stF, JSON.stringify(st, null, 1)); };
const accion = (a) => { const l = `[${new Date().toISOString().slice(11, 19)}] ${a}`; console.log(`🤖 ${l}`); st.acciones.push(l); guardar(); };
const gastar = (usd, que) => { st.usd = +(st.usd + usd).toFixed(4); accion(`gasto ${que}: US$ ${usd.toFixed(4)} (acumulado US$ ${st.usd.toFixed(3)} de ${MAX_USD})`); if (st.usd > MAX_USD) fin(3, `tope de US$ ${MAX_USD} superado`); };
function fin(code, msg) { accion(`FIN (${code}): ${msg}`); process.exit(code); }

function sh(cmd, args, extraEnv = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", env: { ...process.env, ...extraEnv }, maxBuffer: 256 * 1024 * 1024 });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}
const fabrica = (args) => sh(process.execPath, [path.join(ROOT, "factory", "run.mjs"), "run", slug, ...args]);
const estados = (log) => Object.fromEntries([...log.matchAll(/^\s{2}(\d\d_\w+)\s+(\w+)/gm)].map((m) => [m[1], m[2]]));
const dirFiles = () => (fs.existsSync(P.dirDir) ? fs.readdirSync(P.dirDir).filter((f) => /^dir_[A-Z]+\.json$/.test(f)) : []);

// El director (modelo) escribe o corrige la dirección. Devuelve true si pasó 30_direct.
// LLM_THINK=0: el director arranca SIN razonamiento (medido 05-oct: qwen3.8-max 7× más barato, casi igual).
// Si una ronda así falla, la siguiente ESCALA a razonamiento: el caro se paga sólo cuando hace falta.
function director(extra = []) {
  const seguir = dirFiles().length > 0;
  // Escalar a razonar SÓLO si se pide (LLM_ESCALAR=1): en un video de 15 min una ronda razonando costó
  // US$ 2,57 (hl20qwen, 05-oct). Por defecto, el director sigue en el modo con el que arrancó.
  const razona = env("LLM_THINK") !== "0" || (env("LLM_ESCALAR") === "1" && (st.directorFallas || 0) > 0);
  accion(`director ${MODELO}${razona ? "" : " (sin razonar)"}: ${seguir ? "corrige" : "escribe"} la dirección${extra.length ? ` (${extra.length} errores de fases posteriores)` : ""}`);
  const r = sh(process.execPath, [path.join(ROOT, "factory", "tools", "llm.mjs"), "direct", slug, "--intentos", "4", ...(seguir ? ["--seguir"] : []), ...extra.flatMap((e) => ["--extra", e])],
    { LLM_MODEL: MODELO, LLM_USD_IN: String(USD_IN), LLM_USD_OUT: String(USD_OUT), LLM_THINK: razona ? "1" : "0", LLM_TOPE_USD: String(Math.max(0.0001, MAX_USD - st.usd).toFixed(4)) });
  const tk = [...r.out.matchAll(/(\d+) in \/ (\d+) out/g)].reduce((a, m) => [a[0] + +m[1], a[1] + +m[2]], [0, 0]);
  gastar((tk[0] * USD_IN + tk[1] * USD_OUT) / 1e6, `director (${tk[0]} in / ${tk[1]} out)`);
  if (/TOPE_USD/.test(r.out)) fin(3, `el director se cortó para no pasar el tope de US$ ${MAX_USD} (gastado US$ ${st.usd.toFixed(3)})`);
  const ok = /pasó TODAS las compuertas/.test(r.out);
  accion(`director: ${ok ? "✅ pasó las compuertas" : "⛔ no pasó: " + ((r.out.split("── 30_direct intento").pop().match(/⛔.*$/m) || [""])[0]).slice(0, 200)}`);
  return ok;
}

// Cambia planos de la dirección (lo hace el CÓDIGO del piloto, no un humano).
function editarDireccion(fnPorPlano, motivo) {
  for (const f of dirFiles()) {
    const fp = path.join(P.dirDir, f);
    const arr = JSON.parse(fs.readFileSync(fp, "utf8"));
    fs.writeFileSync(fp, JSON.stringify(arr.map((x) => fnPorPlano(x) || x), null, 1));
  }
  accion(`dirección editada por el piloto: ${motivo}`);
}
const aparte = (f) => { if (!fs.existsSync(f)) return; const d = path.join(P.work, "rechazados"); fs.mkdirSync(d, { recursive: true }); fs.renameSync(f, path.join(d, `${Date.now()}_${path.basename(f)}`)); };
const planDe = () => new Map(JSON.parse(fs.readFileSync(P.plan, "utf8")).map((p) => [p.name, p]));

async function revisarAgnes() {
  const qf = path.join(ROOT, "_v3", `${slug}_agnes_qc.json`);
  const q = JSON.parse(fs.readFileSync(qf, "utf8"));
  const plan = planDe();
  const pend = Object.entries(q.clips || {}).filter(([, c]) => !c.revisado && !c.removed).map(([n]) => n);
  accion(`juez de visión: ${pend.length} clips de agnes`);
  const malos = [], aFoto = [];
  for (const n of pend) {
    const mp4 = path.join(P.brollDir, `${n}.mp4`);
    if (!fs.existsSync(mp4)) continue;
    const p = plan.get(n) || {};
    const r = await juzgarClip({ mp4, tipo: "agnes", muestra: p.muestra || "", escena: p.prompt || "", movimiento: p.motion || "" });
    gastar(VISION_USD, `juez ${n}`);
    accion(`   ${n}: ${r.ok ? "✓ aprobado" : "✗ " + r.defectos.join(",")}`);
    if (r.ok) continue;
    st.rechazos[n] = (st.rechazos[n] || 0) + 1;
    (st.rechazos[n] >= 2 ? aFoto : malos).push(`${n}:${r.defectos.join("+")}`);
  }
  // 2º rechazo → FOTO QUIETA (regla del creador): se marca en el QC, se aparta el mp4 y la dirección
  // lo deja quieto para que ninguna re-corrida lo vuelva a pedir.
  if (aFoto.length) {
    const nombres = aFoto.map((x) => x.split(":")[0]);
    for (const n of nombres) { q.clips[n] = { removed: true, why: "piloto: reincidente → foto quieta" }; aparte(path.join(P.brollDir, `${n}.mp4`)); }
    fs.writeFileSync(qf, JSON.stringify(q, null, 1));
    editarDireccion((x) => (nombres.includes(x.n) ? (() => { const y = { ...x, q: 1 }; delete y.mo; return y; })() : null), `${nombres.join(", ")} → foto quieta (2 rechazos del juez)`);
  }
  const revision = malos.length ? malos.join(";") : "ninguno";
  const r = sh(process.execPath, [path.join(ROOT, "scripts", "agnes_qc.mjs"), slug, "--revision", revision]);
  accion(`agnes_qc --revision "${revision}" → exit ${r.code}`);
  return aFoto.length ? "30_direct" : "50_agnes";
}

async function revisarStock() {
  const reg = path.join(ROOT, "_v3", `${slug}_stock.json`);
  st.stockJuzgado = true; guardar();
  if (!fs.existsSync(reg)) return accion("stock: no hay clips reales que auditar");
  const R = JSON.parse(fs.readFileSync(reg, "utf8"));
  const plan = planDe();
  const fuera = [];
  accion(`juez de visión: ${Object.keys(R).length} clips de STOCK`);
  for (const n of Object.keys(R)) {
    const mp4 = path.join(P.brollDir, `${n}.mp4`);
    if (!fs.existsSync(mp4)) continue;
    const p = plan.get(n) || {};
    const r = await juzgarClip({ mp4, tipo: "stock", muestra: p.muestra || "", consulta: p.st || R[n]?.query || "" });
    gastar(VISION_USD, `juez stock ${n}`);
    accion(`   ${n}: ${r.ok ? "✓ aprobado" : "✗ " + r.defectos.join(",")}`);
    if (!r.ok) { fuera.push(n); delete R[n]; aparte(mp4); }
  }
  if (!fuera.length) return;
  fs.writeFileSync(reg, JSON.stringify(R, null, 1));
  editarDireccion((x) => (fuera.includes(x.n) ? (() => { const y = { ...x, q: 1 }; delete y.st; return y; })() : null), `stock rechazado → vuelve a imagen: ${fuera.join(", ")}`);
  return "30_direct";
}

function renderLocal() {
  // Los sonidos internos del kit viven en public/sfx (no viajan en git); la entrega usa la MEZCLA de la
  // fábrica, así que en una máquina sin ellos se reemplazan por silencio en vez de romper el render.
  const refs = new Set(sh("bash", ["-c", `grep -rhoE '"(sfx|fx)/[^"]+\\.(mp3|wav)"' src/VideoEdit src/${slug} | tr -d '"' | sort -u`]).out.split("\n").filter(Boolean));
  let n = 0;
  for (const f of refs) { const fp = path.join(ROOT, "public", f); if (fs.existsSync(fp)) continue; fs.mkdirSync(path.dirname(fp), { recursive: true }); sh("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-t", "0.5", fp]); n++; }
  if (n) accion(`render local: ${n} sonidos del kit ausentes → silencio`);
  const out = path.join(env("FACTORY_FINALS") || path.join(P.work, "final"), `${slug}.mp4`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const comp = slug.charAt(0).toUpperCase() + slug.slice(1);
  accion(`render local (Remotion, CPU) → ${out}`);
  const r = sh("npx", ["remotion", "render", `src/index_${slug}.tsx`, comp, out, "--concurrency", String(Math.max(1, (Number(sh("nproc", []).out) || 2))),
    ...(env("REMOTION_CHROME") ? ["--browser-executable", env("REMOTION_CHROME")] : [])]);
  if (r.code !== 0) fin(1, `render local falló: ${r.out.split("\n").filter((l) => /Error/.test(l))[0] || r.out.slice(-300)}`);
  if (env("FACTORY_DELIVER") !== "1") fin(0, `✅ VIDEO LISTO: ${out}`);
  accion(`✅ VIDEO LISTO: ${out} → entrega en la nube (meta + release + Bagasy)`);
  if (!fs.existsSync(P.meta)) {
    const m = sh(process.execPath, [path.join(ROOT, "factory", "tools", "llm.mjs"), "meta", slug], { LLM_MODEL: MODELO, LLM_USD_IN: String(USD_IN), LLM_USD_OUT: String(USD_OUT), LLM_THINK: "0" });
    const c = m.out.match(/US\$ ([\d.]+)/);
    if (c) { st.usd += Number(c[1]); guardar(); }
    if (m.code !== 0) fin(1, `meta: ${m.out.slice(-300)}`);
    accion(`meta escrita por ${MODELO}${c ? ` · US$ ${c[1]}` : ""}`);
  }
  const e = sh(process.execPath, [path.join(ROOT, "factory", "tools", "entrega_nube.mjs"), slug]);
  if (e.code !== 0) fin(1, `entrega falló: ${(e.out.match(/⛔ entrega: .*/) || [e.out.slice(-300)])[0]}`);
  fin(0, (e.out.match(/✅ ENTREGADO: .*/) || ["✅ ENTREGADO"])[0]);
}

// ── el bucle ─────────────────────────────────────────────────────────────────────────────────────
let from = null;
for (let v = 1; v <= MAX_VUELTAS; v++) {
  const hasta = !st.stockJuzgado ? "55_avatar" : LOCAL ? "70_gates" : null;
  const r = fabrica([...(from ? ["--from", from] : []), ...(hasta ? ["--hasta", hasta] : [])]);
  const E = estados(r.out);
  from = null;
  const malas = Object.entries(E).filter(([, s]) => ["failed", "needs", "blocked"].includes(s));
  accion(`vuelta ${v}${hasta ? ` (hasta ${hasta})` : ""}: ${malas.length ? malas.map(([f, s]) => `${f}=${s}`).join(" · ") : "todo verde"}`);
  const err = (f) => (r.out.match(new RegExp(`${f} ✗ FAILED: (.*)`)) || r.out.match(new RegExp(`${f} ⏸ NEEDS: (.*)`)) || [, ""])[1];

  if (!malas.length) {
    if (!st.stockJuzgado) { from = (await revisarStock()) || null; continue; }
    if (LOCAL) renderLocal();
    fin(0, "✅ fábrica terminada (render/entrega por el farm)");
  }
  const [fase, estado] = malas[0];
  if (estado === "blocked") fin(3, `${fase} BLOQUEADA (plata o disco): ${err(fase) || "ver log"} — no se gasta sin el creador`);
  if (fase === "30_direct") { if (!director()) { if ((st.directorFallas = (st.directorFallas || 0) + 1) >= 3) fin(1, "el director no logró pasar las compuertas en 3 rondas"); } from = "30_direct"; continue; }
  if (fase === "50_agnes" && estado === "needs") { from = await revisarAgnes(); continue; }
  if (fase === "60_build") {
    const e = err(fase);
    if (/aperturaMiniatura/.test(e)) {
      const sf = path.join(ROOT, "factory", "specs", `${slug}.json`);
      const s = JSON.parse(fs.readFileSync(sf, "utf8"));
      s.overrides = { ...(s.overrides || {}), apertura: { miniatura: false, _: "piloto: sin motor de imagen pago para la miniatura" } };
      fs.writeFileSync(sf, JSON.stringify(s, null, 2) + "\n");
      accion("apertura sin miniatura (spec.overrides.apertura)"); from = "60_build"; continue;
    }
    if (/fxPlanosConCapas2p5D/.test(e)) {
      const imgs = fs.readdirSync(P.imgDir).filter((f) => /^p\d+x?\.jpg$/.test(f)).map((f) => path.join(P.imgDir, f));
      const lista = path.join(P.work, "px_lista.txt"); fs.writeFileSync(lista, imgs.join("\n"));
      const px = sh("python", [path.join(ROOT, "factory", "py", "local_parallax.py"), "--lista", lista, "--out", path.join(P.imgDir, "px"), "--workers", "4"]);
      accion(`capas 2.5D locales: ${(px.out.match(/GATE parallaxCapas: [^\n]*/) || ["?"])[0]}`); from = "60_build"; continue;
    }
    const mismo = e.match(/MISMO asset: (m\d+)/);
    if (mismo) {
      const pn = "p" + mismo[1].slice(1);
      if (!director([`${pn}: la frase es larga y el montaje la parte en dos tramos con la MISMA foto. Agregá un segundo plano ${pn}x de IMAGEN (c, e, l, m, s, q:1) que muestre otra cosa de lo que se dice.`])) fin(1, "el director no pudo corregir el error del montaje");
      from = "30_direct"; continue;
    }
  }
  // Error del MONTAJE que nombra planos (pNNN): casi siempre es de dirección → se lo devuelve al director,
  // UNA vez por error distinto (si vuelve el mismo, no hay arreglo y se para).
  const e0 = err(fase);
  // Si el error nombra un ARCHIVO (assetsEnDisco), se busca qué plano lo usa para que el director sepa dónde.
  const faltan = [...e0.matchAll(/no existe public\/([^\s,;]+)/g)].map((m) => m[1]);
  const donde = faltan.map((a) => { for (const f of dirFiles()) { const arr = JSON.parse(fs.readFileSync(path.join(P.dirDir, f), "utf8")); const x = arr.find((y) => JSON.stringify(y.k || {}).includes(a)); if (x) return `${x.n} (componente ${x.k?.kind} con "${a}")`; } return null; }).filter(Boolean);
  const e = donde.length ? `${e0} — lo usa: ${donde.join(", ")}` : e0;
  if (fase === "60_build" && e) {
    st.errMontaje = st.errMontaje || [];
    if (st.errMontaje.includes(e)) fin(1, `el director no resolvió este error del montaje: ${e.slice(0, 300)}`);
    st.errMontaje.push(e); guardar();
    if (!director([`El MONTAJE rechazó la dirección: ${e}. Corregí esos planos.`])) fin(1, "el director no pudo corregir el error del montaje");
    from = "30_direct"; continue;
  }
  fin(1, `${fase}=${estado} sin arreglo automático conocido: ${e.slice(0, 300) || "ver log"}`);
}
fin(1, `${MAX_VUELTAS} vueltas sin terminar`);
