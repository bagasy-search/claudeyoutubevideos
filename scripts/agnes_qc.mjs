// agnes_qc.mjs — CONTROL ÚNICO de los clips de agnes, para TODOS los canales.
//
//   node scripts/agnes_qc.mjs <slug>                              1. medir + armar HOJAS de lo no revisado
//   node scripts/agnes_qc.mjs <slug> --revision "ninguno"         2. registrar la revisión A OJO de esas hojas
//   node scripts/agnes_qc.mjs <slug> --revision "p015:salto de encuadre;p079:otra escena"
//   node scripts/agnes_qc.mjs <slug> --fix                        3. regenerar los rechazados (vuelven a revisión)
//
// ⛔⛔ POR QUÉ LA DECISIÓN ES A OJO Y NO DEL JUEZ DE VISIÓN (medido 15-sep-2026 sobre 250 clips reales de
// tcbriquetas, contra etiquetas puestas a ojo): tres versiones del juez automático (agnes-2.5-flash) con
// prompts, severidad, segunda opinión y desempate. La mejor cazó 2 de 6 defectos fuertes y dejó 20 falsos;
// la más sensible cazó más pero con 35 falsos de 47 marcados. Cada ajuste que saca falsos pierde reales y
// el modelo contesta distinto en cada corrida. Lo que SÍ fue confiable: mirar la hoja foto base | medio |
// final — 47 clips etiquetados en minutos sin dudas. Por eso:
//   · BLOQUEA SOLO lo inequívoco: fps 30/1, duración, repetición (plano más largo que su clip / clip en 2 planos)
//   · la VISIÓN sólo ORDENA la hoja (los sospechosos van primero, con su pista); nunca aprueba ni condena sola
//   · la DECISIÓN es la revisión a ojo, sellada por clip con tamaño+fecha: un clip regenerado después vuelve
//     a pendiente, y el farm (scripts/agnes_qc_gate.mjs) no rendea nada pendiente o rechazado.
//
// Qué mirar en la hoja (lo que rompió clips reales): gente que no estaba (también pies/zapatos en un borde),
// la foto base que ya trae gente inventada, la escena o el objeto principal reemplazado, salto de encuadre,
// el presentador que pasa a ser otro, cosas que se estiran/derriten/cambian de color o forma.
// NO es defecto: texto borroso, deriva lenta de cámara, fuego/humo/agua cambiando, brazos que entran por un borde.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const [SLUG, ...args] = process.argv.slice(2);
if (!SLUG) { console.error("uso: node scripts/agnes_qc.mjs <slug> [--revision \"ninguno|pNNN:motivo;...\"] [--fix]"); process.exit(1); }
const FIX = args.includes("--fix");
const REV = args.includes("--revision") ? (args[args.indexOf("--revision") + 1] || "") : null;
const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KS = (process.env.AGNES_KEYS || env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
const API = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const IMGDIR = process.env.QC_IMGDIR || `public/img/${SLUG}`;
const CLIPDIR = process.env.QC_CLIPDIR || `public/broll/${SLUG}`;
const TMP = `_v3/_agnesqc/${SLUG}`; fs.mkdirSync(TMP, { recursive: true });
const HOJAS = process.env.QC_HOJAS || `D:/rtmp/${SLUG}_agnesqc_hojas`;
const BAK = `_v3/bak_${SLUG}/qc`; fs.mkdirSync(BAK, { recursive: true });
const OUTJ = `_v3/${SLUG}_agnes_qc.json`;
const CONC = Number(process.env.QC_CONC || 8);
const FONT = process.env.QC_FONT || "C\\:/Windows/Fonts/arialbd.ttf";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const probe = (a) => execFileSync("ffprobe", ["-v", "error", ...a], { encoding: "utf8" }).replace(/\r/g, "").trim();
const stamp = (f) => { const s = fs.statSync(f); return { size: s.size, mtime: Math.round(s.mtimeMs) }; };
const baseOf = (n) => [".jpg", ".png", ".webp"].map((e) => path.join(IMGDIR, n + e)).find((f) => fs.existsSync(f));
const clipOf = (n) => path.join(CLIPDIR, `${n}.mp4`);

// ---------- qué clips son de agnes ----------
const info = {};
const REG = `_v3/${SLUG}_agnes_clips.json`;
if (fs.existsSync(REG)) Object.assign(info, JSON.parse(fs.readFileSync(REG, "utf8")));
for (const f of fs.readdirSync("_v3").filter((f) => f.startsWith(`${SLUG}_i2v`) && f.endsWith(".json"))) {
  try {
    const arr = JSON.parse(fs.readFileSync(`_v3/${f}`, "utf8").replace(/^\uFEFF/, ""));
    if (Array.isArray(arr)) for (const it of arr) if (it && it.nombre) info[it.nombre] = { ...info[it.nombre], ...it, person: !!(it.person || it.pres || it.gente) };
  } catch { /* no es lista de i2v */ }
}
// ⛔ El registro de agnes guarda TAMBIÉN los nombres que después pisó el METRAJE REAL de Pexels
//    (medido en fbtelgopor/fbdeterg, 18-sep-2026: los 28/33 planos con `st` estaban en los dos lados).
//    Si el QC los revisa como si fueran de agnes, un "rechazado" los manda a regenerar y el clip real
//    desaparece. El registro de stock manda: lo que es metraje real NO lo revisa el QC de agnes.
const REAL = (() => {
  try { return new Set(Object.keys(JSON.parse(fs.readFileSync(`_v3/${SLUG}_stock.json`, "utf8")))); }
  catch { return new Set(); }
})();
const names = Object.keys(info).filter((n) => !REAL.has(n) && fs.existsSync(clipOf(n))).sort();
const doc = fs.existsSync(OUTJ) ? JSON.parse(fs.readFileSync(OUTJ, "utf8")) : {};
doc.clips ||= {};
const guardar = () => { doc.version = 2; doc.slug = SLUG; doc.at = new Date().toISOString(); fs.writeFileSync(OUTJ, JSON.stringify(doc, null, 1)); };
const vigente = (n) => { const c = doc.clips[n], st = stamp(clipOf(n)); return c && c.size === st.size && c.mtime === st.mtime; };
console.log(`agnes_qc · ${SLUG} · ${Object.keys(info).length} clips registrados · ${REAL.size} son metraje REAL (no se revisan) · ${names.length} en disco a revisar`);

// ---------- 2. registrar la revisión a ojo de las últimas hojas ----------
if (REV !== null) {
  const pend = doc.hojas?.clips || [];
  if (!pend.length) { console.error("⛔ no hay hojas pendientes de revisión: corré primero node scripts/agnes_qc.mjs " + SLUG); process.exit(1); }
  const rech = {};
  if (!/^ninguno$/i.test(REV.trim())) for (const part of REV.split(";").map((s) => s.trim()).filter(Boolean)) {
    const [n, ...m] = part.split(":"); const k = n.trim();
    if (!pend.some((p) => p.name === k)) { console.error(`⛔ ${k} no estaba en las hojas revisadas`); process.exit(1); }
    rech[k] = m.join(":").trim() || "rechazado a ojo";
  }
  let cambiados = 0;
  for (const p of pend) {
    const c = doc.clips[p.name] || {};
    if (!fs.existsSync(clipOf(p.name)) || stamp(clipOf(p.name)).size !== p.size || stamp(clipOf(p.name)).mtime !== p.mtime) { cambiados++; continue; }   // cambió después de la hoja: no vale
    doc.clips[p.name] = { ...c, size: p.size, mtime: p.mtime, revisado: new Date().toISOString(), rechazado: rech[p.name] || null };
  }
  doc.hojas = null;
  guardar();
  console.log(`revisión registrada: ${pend.length - cambiados} clips · rechazados ${Object.keys(rech).length}${cambiados ? ` · ⛔ ${cambiados} cambiaron después de la hoja (vuelven a pendiente)` : ""}`);
  if (Object.keys(rech).length) console.log(`siguiente: node scripts/agnes_qc.mjs ${SLUG} --fix`);
}

// ---------- 3. reparar los rechazados ----------
if (FIX) {
  const aRegen = names.filter((n) => vigente(n) && doc.clips[n].rechazado);
  const sinBase = aRegen.filter((n) => /foto base|base con gente|foto/i.test(doc.clips[n].rechazado));
  if (sinBase.length) console.log(`⛔ rechazados por la FOTO BASE (regenerá la foto con "an empty unoccupied scene, nobody in the frame" y volvé a animar): ${sinBase.join(" ")}`);
  const lista = aRegen.filter((n) => !sinBase.includes(n));
  if (lista.length) {
    console.log(`[fix] regenero ${lista.length} con escena vacía + harden (el original va a ${BAK})`);
    // rename no cruza discos (EXDEV): los worktrees del farm viven en D:/rtmp y el respaldo puede estar en C:
    const mover = (a, b) => { try { fs.renameSync(a, b); } catch (e) { if (e.code !== "EXDEV") throw e; fs.copyFileSync(a, b); fs.unlinkSync(a); } };
    for (const n of lista) mover(clipOf(n), path.join(BAK, `${n}_r${Date.now()}.mp4`));
    const lf = `${TMP}/regen.json`;
    fs.writeFileSync(lf, JSON.stringify(lista.map((n) => ({ nombre: n, motion: info[n].motion || "the scene stays still with a very small natural movement", change: info[n].change || "",
      pres: !!info[n].pres, gente: !!info[n].gente, person: !!info[n].person, harden: true })), null, 1));
    spawnSync("node", ["scripts/agnes_i2v.mjs", lf, SLUG, IMGDIR, CLIPDIR], { stdio: "inherit" });
    for (const n of lista) if (!fs.existsSync(clipOf(n))) { doc.clips[n] = { removed: true, why: "no se pudo regenerar: el build usa la foto del momento" }; console.log(`  ${n}: sin clip → queda la foto`); }
    guardar();
  }
}

// ---------- 1. medir lo que no tiene revisión vigente + armar hojas ----------
async function preguntar(imgs, q, attempt = 1) {
  if (!KS.length) return null;
  try {
    const r = await fetch(API, { method: "POST", signal: AbortSignal.timeout(60_000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[(attempt * 11 + imgs[0].length) % KS.length]}` },
      body: JSON.stringify({ model: "agnes-2.5-flash", temperature: 0, messages: [{ role: "user", content: [{ type: "text", text: q },
        ...imgs.map((f) => ({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}` } }))] }] }) });
    if (!r.ok) { if (attempt < 4) { await sleep(1500 * attempt); return preguntar(imgs, q, attempt + 1); } return null; }
    const txt = (await r.json()).choices?.[0]?.message?.content || "";
    const m = txt.match(/\{[\s\S]*\}/g);
    return m ? JSON.parse(m[m.length - 1]) : null;
  } catch { if (attempt < 4) { await sleep(1500 * attempt); return preguntar(imgs, q, attempt + 1); } return null; }
}
const PISTA = (it) => `Image 1 is the starting photo; images 2, 3, 4 are the first, middle and last frames of the short video made from it (slightly zoomed; slow camera drift is normal). ${it.pres ? "The presenter is supposed to be in the shot." : it.gente ? "The people in image 1 are supposed to be in the shot." : "Nobody is supposed to be in the shot; hands or arms entering from an edge are fine."}
List ONLY clear problems a viewer would notice: a person or feet/legs that were not in image 1, image 1 itself containing an unwanted person, the place or main object replaced, a jump in framing, the presenter becoming someone else, something stretching, melting or changing shape or colour. Ignore blur, unreadable labels, flames, smoke, water.
Answer ONLY JSON: {"suspect": true|false, "hint": "<max 10 words, empty if none>"}`;

async function medir(n) {
  const clip = clipOf(n), it = info[n];
  // Una compuerta NO se cae: informa. Antes `stamp()` tiraba ENOENT en el primer clip que
  // faltara y mataba la corrida entera, asi que en vez de "faltan 46" salia un stack de fs.statSync
  // (medido en cmeamazon: 264 de 310 generados, se cayo en p083x).
  if (!fs.existsSync(clip)) return { size: 0, mtime: 0, dur: 0, auto: "clip inexistente", hint: "" };
  const st = stamp(clip);
  const r = { ...st, auto: null, hint: "" };
  let fps = "", dur = 0;
  try { fps = probe(["-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", clip]); dur = +probe(["-show_entries", "format=duration", "-of", "csv=p=0", clip]); } catch {}
  r.dur = +dur.toFixed(3);
  if (!baseOf(n)) r.auto = "sin foto base";
  else if (fps !== "30/1") r.auto = `fps ${fps || "?"} (tiene que ser 30/1)`;
  else if (dur < 1.5) r.auto = `dura ${dur.toFixed(2)} s`;
  const frames = [0.05, dur / 2, Math.max(0, dur - 0.1)].map((t, k) => {
    const f = path.join(TMP, `${n}_${k}.jpg`);
    try { execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", t.toFixed(3), "-i", clip, "-frames:v", "1", "-vf", "scale=640:-2", "-q:v", "4", f]); } catch {}
    return f;
  });
  if (!r.auto && baseOf(n)) {
    const v = await preguntar([baseOf(n), ...frames], PISTA(it));
    if (v?.suspect) r.hint = String(v.hint || "sospechoso").slice(0, 60);
  }
  return r;
}

const pendientes = names.filter((n) => !vigente(n) || !doc.clips[n].revisado);
if (pendientes.length && REV === null) {
  console.log(`midiendo ${pendientes.length} clips sin revisión vigente…`);
  let i = 0, hechos = 0;
  await Promise.all(Array.from({ length: Math.min(CONC, pendientes.length) }, async () => {
    while (i < pendientes.length) {
      const n = pendientes[i++];
      doc.clips[n] = { ...(await medir(n)), revisado: null, rechazado: null };
      if (++hechos % 25 === 0) console.log(`  · medidos ${hechos}/${pendientes.length}`);
    }
  }));
  // hojas: sospechosos primero; cada fila = foto base | medio | final, con nombre y pista
  fs.rmSync(HOJAS, { recursive: true, force: true }); fs.mkdirSync(HOJAS, { recursive: true });
  const orden = [...pendientes].sort((a, b) => (doc.clips[b].hint ? 1 : 0) - (doc.clips[a].hint ? 1 : 0) || a.localeCompare(b));
  const tiles = [];
  for (const n of orden) {
    const t = path.join(TMP, `${n}_tile.jpg`);
    const label = `${n}${doc.clips[n].auto ? "  AUTO: " + doc.clips[n].auto : ""}${doc.clips[n].hint ? "  ? " + doc.clips[n].hint : ""}`.replace(/[':\\%,;\[\]]/g, " ");
    const ins = [baseOf(n) || path.join(TMP, `${n}_0.jpg`), path.join(TMP, `${n}_1.jpg`), path.join(TMP, `${n}_2.jpg`)];
    try {
      execFileSync("ffmpeg", ["-v", "error", "-y", ...ins.flatMap((f) => ["-i", f]), "-filter_complex",
        // el cuadro FINAL va grande (480 px): ahí aparecen los defectos tardíos, y a 256 px un zapato en el
        // borde (tcbriquetas p170) no se ve en la hoja
        `[0]scale=240:135,format=yuvj420p[a];[1]scale=240:135,format=yuvj420p[b];[2]scale=480:270,format=yuvj420p[c];[a][b]vstack=2[ab];[ab][c]hstack=2,pad=720:292:0:22:black,drawtext=fontfile='${FONT}':text='${label}':x=4:y=3:fontsize=16:fontcolor=${doc.clips[n].hint || doc.clips[n].auto ? "yellow" : "white"}`,
        "-frames:v", "1", "-q:v", "4", t]);
      tiles.push(t);
    } catch (e) { console.log(`  ⚠️ no pude armar la fila de ${n}: ${String(e.message).slice(0, 80)}`); }
  }
  const POR = 16, hojas = [];
  for (let s = 0; s < tiles.length; s += POR) {
    const part = tiles.slice(s, s + POR); while (part.length % 2) part.push(part[part.length - 1]);
    const lst = path.join(TMP, `hoja${s / POR}.txt`); fs.writeFileSync(lst, part.map((p) => `file '${path.resolve(p).replace(/\\/g, "/")}'\n`).join(""));
    const out = path.join(HOJAS, `hoja${String(s / POR).padStart(2, "0")}.jpg`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-vf", `tile=2x${Math.ceil(part.length / 2)}:padding=6:color=white`, "-frames:v", "1", "-q:v", "4", out]);
    hojas.push(out);
  }
  doc.hojas = { at: new Date().toISOString(), archivos: hojas, clips: orden.map((n) => ({ name: n, size: doc.clips[n].size, mtime: doc.clips[n].mtime })) };
  guardar();
  const sosp = orden.filter((n) => doc.clips[n].hint).length;
  console.log(`\nHOJAS para revisar A OJO (${orden.length} clips, ${sosp} con pista de la visión primero):\n  ${hojas.join("\n  ")}`);
  console.log(`después: node scripts/agnes_qc.mjs ${SLUG} --revision "ninguno"   (o "pNNN:motivo;pMMM:motivo")`);
}

// ---------- repetición ----------
const CUES = `_v3/${SLUG}_cues.json`;
if (fs.existsSync(CUES)) {
  const cues = JSON.parse(fs.readFileSync(CUES, "utf8")).filter((c) => c.src && /\.mp4$/.test(c.src));
  const durDe = {}, uso = {}, loops = [];
  for (const c of cues) {
    const f = path.join("public", c.src); if (!fs.existsSync(f)) continue;
    durDe[c.src] ??= +probe(["-show_entries", "format=duration", "-of", "csv=p=0", f]);
    uso[c.src] = (uso[c.src] || 0) + 1;
    if (c.dur > durDe[c.src] + 2 / 30) loops.push(`${c.key || c.src} ${c.dur.toFixed(2)}s > clip ${durDe[c.src].toFixed(2)}s`);
  }
  const dobles = Object.entries(uso).filter(([, v]) => v > 1).map(([k, v]) => `${k} ×${v}`);
  doc.repeticion = { planos: cues.length, loops: loops.length, dobles: dobles.length, ejemplos: [...loops.slice(0, 8), ...dobles.slice(0, 8)] };
  console.log(`\nrepetición: ${cues.length} planos de clip · ${loops.length} más largos que su clip · ${dobles.length} clips usados más de una vez`);
  for (const e of doc.repeticion.ejemplos) console.log(`  ✗ ${e}`);
} else { doc.repeticion = null; console.log(`\nrepetición: sin ${CUES} → no medida (el build tiene que emitirlo; el farm lo exige)`); }

// ---------- estado final ----------
for (const n of names) { const c = doc.clips[n]; if (c) c.ok = !!(vigente(n) && c.revisado && !c.rechazado && !c.auto); }
guardar();
const vivos = names.filter((n) => fs.existsSync(clipOf(n)));
const est = (f) => vivos.filter(f).length;
const sinRev = est((n) => !doc.clips[n]?.revisado || !vigente(n)), rech = est((n) => doc.clips[n]?.rechazado && vigente(n)), auto = est((n) => doc.clips[n]?.auto);
console.log(`\n=== agnes_qc ${SLUG} · clips ${vivos.length} · aprobados ${est((n) => doc.clips[n]?.ok)} · sin revisar ${sinRev} · rechazados ${rech} · bloqueo automático ${auto} ===`);
process.exit(sinRev || rech || auto || (doc.repeticion && (doc.repeticion.loops || doc.repeticion.dobles)) ? 1 : 0);
