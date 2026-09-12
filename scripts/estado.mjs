#!/usr/bin/env node
// ESTADO DE UN VIDEO EN UNA SOLA LLAMADA.
//   node scripts/estado.mjs <slug>
//
// Por qué existe: medido el 28/07/2026 sobre el job 47, el agente gastó 125 llamadas
// (49 `cd` + 31 `ls` + 24 `grep` + 21 `sed`) SOLO para averiguar cómo venía el video. Cada una
// re-lee todo el contexto acumulado (~150k), así que "mirar de a poquito" es lo más caro que se
// puede hacer. Esto responde lo mismo en UNA llamada y en media pantalla.
//
// Se corre desde la raíz del worktree del video. No modifica nada: solo mira y reporta.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/estado.mjs <slug>"); process.exit(1); }

const R = process.cwd();
const p = (...a) => join(R, ...a);
const hay = (f) => existsSync(p(f));
const kb = (f) => { try { return Math.round(statSync(p(f)).size / 1024); } catch { return 0; } };
const cuenta = (d) => { try { return readdirSync(p(d)).length; } catch { return 0; } };
const json = (f) => { try { return JSON.parse(readFileSync(p(f), "utf8")); } catch { return null; } };
const ok = (b) => (b ? "✓" : "·");

const L = [];
const linea = (etiqueta, bien, detalle = "") => L.push(`  ${ok(bien)} ${etiqueta.padEnd(22)}${detalle}`);

// ── 1. base: guion, avatar, captions ──
const guion = `public/guiones/${slug}.txt`, txt = `public/${slug}.txt`;
const gk = kb(guion) || kb(txt);
linea("guion", gk > 0, gk ? `${gk} KB` : "FALTA");
linea("avatar mp4", hay(`public/avatar_${slug}.mp4`), hay(`public/avatar_${slug}.mp4`) ? `${kb(`public/avatar_${slug}.mp4`)} KB` : "FALTA");
const caps = json(`public/captions_${slug}.json`);
const nCaps = Array.isArray(caps) ? caps.length : Array.isArray(caps?.segments) ? caps.segments.length : 0;
linea("captions (whisper)", nCaps > 0, nCaps ? `${nCaps} segmentos` : "FALTA — sin esto no se ancla nada");

// ── 2. planes de componentes y de imágenes ──
let planes = [];
try { planes = readdirSync(p("public")).filter((f) => f.startsWith("comp_plan") && f.includes(slug)); } catch {}
linea("planes de componentes", planes.length > 0, planes.length ? planes.join(" · ") : "FALTA");
let imgPlanes = [];
try { imgPlanes = readdirSync(p("public")).filter((f) => f.startsWith("img_plan") && f.includes(slug)); } catch {}
linea("planes de imagen", imgPlanes.length > 0, imgPlanes.length ? `${imgPlanes.length} lote(s)` : "—");

// ── 3. assets en disco ──
const nImg = cuenta("public/img"), nBroll = cuenta(`public/broll/${slug}`), nSfx = cuenta("public/sfx");
linea("imágenes", nImg > 0, `${nImg} en public/img`);
linea("b-roll", nBroll > 0, `${nBroll} en public/broll/${slug}`);
linea("sfx", nSfx > 0, `${nSfx} (el tarball del farm los NECESITA)`);

// ── 4. lo que el render lee de verdad ──
// El nombre de la composición NO es fijo: según el kit puede ser cues_<slug>.gen.tsx,
// Main_<slug>.tsx, y vivir en src/VideoEdit/ o en src/_fed6/VideoEdit/. Adivinar el nombre daba
// "FALTA" en videos que ya habían rendeado. Se resuelve siguiendo el import del entry, que es lo
// que el render carga de verdad.
const entry = `src/index_${slug}.tsx`;
linea("entry propio", hay(entry), hay(entry) ? "" : "FALTA — sin esto el render pisa a otro agente");
let comp = null, compOk = false;
if (hay(entry)) {
  const imp = [...readFileSync(p(entry), "utf8").matchAll(/from\s+"(\.[^"]+)"/g)].map((m) => m[1]);
  const rel = imp.find((x) => /main|cues|video/i.test(x));
  if (rel) {
    const base = join("src", rel.replace(/^\.\//, ""));
    comp = [".tsx", ".ts", ""].map((e) => base + e).find(hay) || base + ".tsx";
    compOk = hay(comp);
  }
}
linea("composición", compOk, comp ? `${comp.replace(/\\/g, "/")}${compOk ? ` · ${kb(comp)} KB` : " — el entry la importa pero NO existe"}` : "el entry no importa ninguna");
// El render lee el .gen, NO el beatsheet: editar a mano sin correr beatsheet.mjs no viaja.
const av = [`src/VideoEdit/avatar_${slug}.gen.ts`, `src/_fed6/VideoEdit/avatar_${slug}.gen.ts`].find(hay);
linea("avatar .gen.ts", !!av, av ? "" : "— si el kit lo usa, TOTAL_* tiene que estar commiteado");

// ── 5. auditoría y salida ──
const audit = `public/_audit/${slug}`;
linea("grilla de auditoría", hay(`${audit}/grid-${slug}.jpg`), hay(`${audit}/stills`) ? `${cuenta(`${audit}/stills`)} stills` : "");
const mp4 = [`public/${slug}.mp4`, `out/${slug}.mp4`, `${slug}.mp4`].find(hay);
linea("MP4 final", !!mp4, mp4 ? `${mp4} · ${kb(mp4)} KB` : "todavía no");
linea("paquete YouTube", hay(`public/${slug}_meta.json`), hay(`public/${slug}_meta.json`) ? "" : "hace falta ANTES de JOB_DONE");

// ── 6. qué falta de los assets que los planes PIDEN ──
// Las 3 clases de "asset faltante" se ven iguales desde afuera: carpeta compartida, nombre mal en
// los beats, o derivado (_blur) sin hornear. Acá se listan por nombre para poder distinguirlas.
const pedidos = new Set();
for (const f of planes) {
  const d = json(`public/${f}`);
  const rec = (o) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string" && /\.(png|jpe?g|mp4|webm|mov)$/i.test(v)) pedidos.add(v.replace(/^\/+/, ""));
      else rec(v);
    }
  };
  rec(d);
}
const faltan = [...pedidos].filter((a) => !hay(join("public", a)) && !hay(a));
console.log(`\nESTADO · ${slug}   (${R})`);
console.log(L.join("\n"));
if (pedidos.size) {
  console.log(`\n  assets pedidos por los planes: ${pedidos.size} · en disco: ${pedidos.size - faltan.length} · FALTAN: ${faltan.length}`);
  if (faltan.length) console.log("  " + faltan.slice(0, 12).map((x) => "✗ " + x).join("\n  ") + (faltan.length > 12 ? `\n  … y ${faltan.length - 12} más` : ""));
}

// ── 7. la próxima acción, para no tener que deducirla ──
const siguiente =
  !gk ? "escribir el guion" :
  !hay(`public/avatar_${slug}.mp4`) ? "generar el avatar en HeyGen (1 llamada, todas las escenas)" :
  !nCaps ? "transcribir con whisper" :
  !planes.length ? "correr el DIRECTOR y escribir el plan" :
  faltan.length ? `conseguir los ${faltan.length} assets que faltan` :
  !hay(entry) ? `crear src/index_${slug}.tsx` :
  !compOk ? "generar la composición (beatsheet.mjs) — el entry la importa y no existe" :
  !mp4 ? "disparar el render (FARM_NOWAIT=1 + WAIT_RUN, NO esperarlo acá)" :
  !hay(`public/${slug}_meta.json`) ? "escribir el _meta.json y auditar" :
  "auditar (subagente para las imágenes) y JOB_DONE";
console.log(`\n  ➜ SIGUIENTE: ${siguiente}\n`);
