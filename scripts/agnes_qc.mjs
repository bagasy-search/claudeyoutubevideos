// agnes_qc.mjs — CONTROL ÚNICO de los clips de agnes, para TODOS los canales. Junta lo que servía de
// check_redibujo / vision_haygente / clipaudit_agnes / idaudit_agnes y descarta lo que daba ruido
// (texto borroso, deriva numérica sola: 31 falsos en tcbriquetas).
//
//   node scripts/agnes_qc.mjs <slug>          → mide y escribe el sello _v3/<slug>_agnes_qc.json
//   node scripts/agnes_qc.mjs <slug> --fix    → además REPARA en escalera y vuelve a medir
//
// Qué clips mira: los del registro `_v3/<slug>_agnes_clips.json` (lo escribe scripts/agnes_i2v.mjs)
// y los de listas viejas `_v3/<slug>_i2v*.json` (campo `nombre`). Imprime SIEMPRE cuántos midió.
//
// Qué juzga, por clip, en UNA llamada de visión (agnes-2.5-flash, gratis) con 4 imágenes:
//   imagen 1 = la FOTO BASE (primer cuadro pedido) · 2/3/4 = cuadro inicial, medio y FINAL del clip
//   · base_has_person   la foto base sin presentador ya trae gente inventada (11/110 en tcbriquetas)
//   · new_person        aparece alguien que no está en la foto base (pies, un señor, alguien al fondo)
//   · scene_changed     otra escena / otro objeto principal (p188: el detector se volvió un living)
//   · identity_changed  el presentador se vuelve otra persona
//   · melted            manos, objetos o cuerpos que se derriten, fusionan o deforman
//   · impossible_motion un cambio entre cuadros que no puede pasar en una toma continua
//   · first_bad         1..4: primera imagen donde aparece el defecto (para recortar)
// y además, sin visión: 30/1 CFR y duración.
//
// REPARACIÓN (--fix), en escalera — medida sobre tcbriquetas (13 de 14 se arreglaron en el paso 1):
//   1. regenerar UNA vez con agnes_i2v.mjs, harden + escena vacía (el original va a _v3/bak_<slug>/qc/)
//   2. si sigue mal y el defecto aparece recién en el cuadro FINAL → recortar al 60 % (limpio)
//   3. si no → sacar el clip (a bak): el build usa la FOTO del momento. Nunca queda un hueco.
//   base_has_person NO se autorrepara (la foto sale de otro motor): se lista para regenerar la foto.
//
// REPETICIÓN (regla del creador): si existe `_v3/<slug>_cues.json` ([{src,dur}] de la capa base),
// ningún plano puede durar más que su clip (el loop repite el movimiento: tcbriquetas 86/236 planos)
// y ningún clip puede usarse en dos planos. Lo exige el gate del farm.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const [SLUG, ...flags] = process.argv.slice(2);
if (!SLUG) { console.error("uso: node scripts/agnes_qc.mjs <slug> [--fix]"); process.exit(1); }
const FIX = flags.includes("--fix");
const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KS = (process.env.AGNES_KEYS || env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KS.length) { console.error("faltan AGNES_KEYS"); process.exit(1); }
const API = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const IMGDIR = process.env.QC_IMGDIR || `public/img/${SLUG}`;
const CLIPDIR = process.env.QC_CLIPDIR || `public/broll/${SLUG}`;
const TMP = `_v3/_agnesqc/${SLUG}`; fs.mkdirSync(TMP, { recursive: true });
const BAK = `_v3/bak_${SLUG}/qc`; fs.mkdirSync(BAK, { recursive: true });
const OUTJ = `_v3/${SLUG}_agnes_qc.json`;
const CONC = Number(process.env.QC_CONC || 8);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const probe = (args) => execFileSync("ffprobe", ["-v", "error", ...args], { encoding: "utf8" }).replace(/\r/g, "").trim();

// ---------- qué clips son de agnes ----------
const info = {};
const REG = `_v3/${SLUG}_agnes_clips.json`;
if (fs.existsSync(REG)) Object.assign(info, JSON.parse(fs.readFileSync(REG, "utf8")));
for (const f of fs.readdirSync("_v3").filter((f) => f.startsWith(`${SLUG}_i2v`) && f.endsWith(".json"))) {
  try {
    const arr = JSON.parse(fs.readFileSync(`_v3/${f}`, "utf8").replace(/^﻿/, ""));
    if (Array.isArray(arr)) for (const it of arr) if (it && it.nombre) info[it.nombre] = { ...info[it.nombre], ...it, person: !!(it.person || it.pres || it.gente) };
  } catch { /* lista que no es de i2v */ }
}
const names = Object.keys(info).filter((n) => fs.existsSync(path.join(CLIPDIR, `${n}.mp4`))).sort();
console.log(`agnes_qc · ${SLUG} · ${Object.keys(info).length} clips registrados · ${names.length} en disco a medir`);

const prev = fs.existsSync(OUTJ) ? JSON.parse(fs.readFileSync(OUTJ, "utf8")) : { clips: {} };
const stamp = (f) => { const s = fs.statSync(f); return { size: s.size, mtime: Math.round(s.mtimeMs) }; };
const baseOf = (n) => [".jpg", ".png", ".webp"].map((e) => path.join(IMGDIR, n + e)).find((f) => fs.existsSync(f));
const uri = (f) => `data:${/\.png$/i.test(f) ? "image/png" : "image/jpeg"};base64,${fs.readFileSync(f).toString("base64")}`;

const PROMPT = (it) => `Image 1 is the STARTING PHOTO that was animated. Images 2, 3 and 4 are the first, middle and last frames of the resulting short video, in order. It must be ONE continuous shot of the same scene.
${it.pres ? "The man in image 1 is the channel presenter; he is supposed to be in the shot." : it.gente ? "The people in image 1 are supposed to be in the shot." : "Nobody is supposed to be in this shot: it is a shot of objects or a place. Hands or forearms entering from a frame edge are allowed and are NOT a person."}
Answer ONLY with JSON:
{"base_has_person":bool,"new_person":bool,"scene_changed":bool,"identity_changed":bool|null,"melted":bool,"impossible_motion":bool,"severity":0-10,"first_bad":null|1|2|3|4,"why":"<max 15 words>"}
base_has_person: ${it.pres || it.gente ? "always false." : "image 1 shows a person (face, torso, body, feet or legs, someone in the background). Hands alone do not count."}
new_person: a person, body part other than the presenter's own hands, or face appears in images 2-4 that is NOT in image 1.
scene_changed: images 2-4 show a different place, a different main object, or the subject replaced by something else (not just movement or light change).
identity_changed: ${it.pres ? "the presenter in images 2-4 is clearly a different person than in image 1 (ignore if his face is not visible → null)." : "null."}
melted: the MAIN subject (the presenter, his hands, or the main object of the shot) melts, fuses, bends impossibly or loses its shape.
impossible_motion: the MAIN subject jumps, teleports, appears or vanishes between consecutive frames in a way a single continuous take cannot do. A slow camera drift that pushes background objects partly out of the frame is NORMAL and is not impossible motion.
severity: how visible and damaging the worst problem is for a viewer (0 = nothing, 10 = the shot is obviously broken).
first_bad: the number (1-4) of the first image where any of the above is visible; null if everything is fine.
Be strict about new people and scene changes; be lenient about small imperfections, blur and unreadable labels (those are fine).`;

async function vision(it, frames, attempt = 1) {
  const base = baseOf(it.name);
  const content = [{ type: "text", text: PROMPT(it) }, ...[base, ...frames].map((f) => ({ type: "image_url", image_url: { url: uri(f) } }))];
  try {
    const r = await fetch(API, { method: "POST", signal: AbortSignal.timeout(90_000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[(attempt + it.name.length) % KS.length]}` },
      body: JSON.stringify({ model: "agnes-2.5-flash", temperature: 0, messages: [{ role: "user", content }] }) });
    if (!r.ok) { if (attempt < 5) { await sleep(1500 * attempt); return vision(it, frames, attempt + 1); } return { error: `http ${r.status}` }; }
    const j = await r.json();
    const txt = j.choices?.[0]?.message?.content || "";
    const m = txt.match(/\{[\s\S]*\}/g);
    return m ? JSON.parse(m[m.length - 1]) : { error: "sin json" };
  } catch (e) { if (attempt < 5) { await sleep(1500 * attempt); return vision(it, frames, attempt + 1); } return { error: String(e.message).slice(0, 60) }; }
}

async function persona(f, attempt = 1) {
  const q = "Is there a PERSON visible in this image? A face, a torso, a whole body, legs, feet or shoes of someone, someone from behind, in the background or in a mirror all count. Hands or forearms alone entering from a frame edge do NOT count; a picture on the wall or a mannequin do NOT count. Answer ONLY JSON: {\"person\": true|false, \"where\": \"<max 8 words>\"}";
  try {
    const r = await fetch(API, { method: "POST", signal: AbortSignal.timeout(60_000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[(attempt * 7 + f.length) % KS.length]}` },
      body: JSON.stringify({ model: "agnes-2.5-flash", temperature: 0, messages: [{ role: "user", content: [{ type: "text", text: q }, { type: "image_url", image_url: { url: uri(f) } }] }] }) });
    if (!r.ok) { if (attempt < 5) { await sleep(1500 * attempt); return persona(f, attempt + 1); } return null; }
    const txt = (await r.json()).choices?.[0]?.message?.content || "";
    const m = txt.match(/\{[\s\S]*\}/g);
    return m ? JSON.parse(m[m.length - 1]).person === true : null;
  } catch { if (attempt < 5) { await sleep(1500 * attempt); return persona(f, attempt + 1); } return null; }
}

async function preguntar(imgs, q, attempt = 1) {
  try {
    const r = await fetch(API, { method: "POST", signal: AbortSignal.timeout(60_000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[(attempt * 11 + imgs[0].length) % KS.length]}` },
      body: JSON.stringify({ model: "agnes-2.5-flash", temperature: 0, messages: [{ role: "user", content: [{ type: "text", text: q }, ...imgs.map((f) => ({ type: "image_url", image_url: { url: uri(f) } }))] }] }) });
    if (!r.ok) { if (attempt < 5) { await sleep(1500 * attempt); return preguntar(imgs, q, attempt + 1); } return null; }
    const txt = (await r.json()).choices?.[0]?.message?.content || "";
    const m = txt.match(/\{[\s\S]*\}/g);
    return m ? JSON.parse(m[m.length - 1]) : null;
  } catch { if (attempt < 5) { await sleep(1500 * attempt); return preguntar(imgs, q, attempt + 1); } return null; }
}
const otraPersona = async (f, it) => (await preguntar([f],
  `${it.pres ? "This frame shows ONE main man, the presenter." : "This frame is supposed to show only the people already in the scene."} Is there ANY OTHER person visible besides ${it.pres ? "him" : "them"}: another face, body, legs, feet, someone in the background? Reflections, pictures on the wall and his own hands do NOT count. Answer ONLY JSON: {"other_person": true|false, "where": "<max 8 words>"}`))?.other_person === true;
const movimientoRoto = async (a, b) => { const j = await preguntar([a, b],
  "These two frames are from the SAME continuous shot, about two seconds apart (first image earlier). Did the MAIN subject (the person, his hands, or the main object) change in a way that cannot happen in one continuous take: melt, morph into another object, appear or vanish? A slow camera drift that moves background objects partly out of frame is NORMAL. Answer ONLY JSON: {\"broken\": true|false, \"severity\": 0-10, \"why\": \"<max 12 words>\"}");
  return j?.broken === true && Number(j.severity ?? 0) >= 6; };

async function medir(n) {
  const clip = path.join(CLIPDIR, `${n}.mp4`);
  const it = { name: n, pres: !!info[n].pres, gente: !!info[n].gente };
  const res = { ...stamp(clip), ok: false, issue: "", why: "" };
  if (!baseOf(n)) return { ...res, issue: "sin-foto-base", why: "no hay foto base para comparar" };
  let fps = "", dur = 0;
  try { fps = probe(["-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", clip]); dur = +probe(["-show_entries", "format=duration", "-of", "csv=p=0", clip]); } catch {}
  res.dur = +dur.toFixed(3);
  if (fps !== "30/1") return { ...res, issue: "fps", why: `r_frame_rate ${fps || "?"} (tiene que ser 30/1)` };
  if (dur < 1.5) return { ...res, issue: "corto", why: `${dur.toFixed(2)} s` };
  const ts = [0.05, dur / 2, Math.max(0, dur - 0.1)];
  const frames = ts.map((t, k) => { const f = path.join(TMP, `${n}_${k}.jpg`); execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", t.toFixed(3), "-i", clip, "-frames:v", "1", "-vf", "scale=640:-2", "-q:v", "4", f]); return f; });
  const v = await vision(it, frames);
  if (v.error) return { ...res, issue: "error-vision", why: v.error };
  // estrictos siempre (gente inventada, otra escena, otra persona); los de "rotura" sólo si se NOTAN:
  // en el control positivo, "impossible_motion" sin severidad marcó un clip sano por un balde del fondo
  const sev = Number(v.severity ?? 10);
  const malos = ["base_has_person", "scene_changed", "identity_changed"].filter((k) => v[k] === true)
    .concat(["melted"].filter((k) => v[k] === true && sev >= 6));
  // SEGUNDA OPINIÓN antes de condenar un clip por lo que más falsos da (control positivo: un clip sano
  // del presentador marcado por "un reflejo de otra persona" y "un balde que se teletransporta"):
  //   · persona nueva en un plano CON gente → se pregunta sola sobre el cuadro, "¿hay alguien más?"
  //   · movimiento imposible → se pregunta sola sobre el par medio/final, "¿el sujeto principal cambió?"
  if (v.new_person === true && (it.pres || it.gente)) {
    const k = [3, 4].includes(v.first_bad) ? v.first_bad : 4;
    if (await otraPersona(frames[k - 2], it)) malos.push("new_person");
  } else if (v.new_person === true) malos.push("new_person");
  if (v.impossible_motion === true && sev >= 6 && await movimientoRoto(frames[1], frames[2])) malos.push("impossible_motion");
  // la pregunta de persona HECHA SOLA sobre un cuadro caza lo que la llamada combinada se come
  // (tcbriquetas p170: un zapato en el borde a los 4 s — lo vio vision_haygente, no la combinada)
  if (!it.pres && !it.gente && !malos.includes("new_person")) {
    for (const [k, f] of [[3, frames[1]], [4, frames[2]]]) {
      const p = await persona(f);
      if (p === true) { malos.push("new_person"); v.why = `${v.why || ""} · persona visible en el cuadro ${k}`; v.first_bad = v.first_bad ?? k; break; }
    }
  }
  return { ...res, ok: malos.length === 0, issue: malos.join(",") || "ok", why: (v.why || "").slice(0, 120), first_bad: v.first_bad ?? null };
}

async function medirTodos(lista) {
  const out = {}; let i = 0, hechos = 0;
  await Promise.all(Array.from({ length: Math.min(CONC, lista.length) }, async () => {
    while (i < lista.length) {
      const n = lista[i++];
      const clip = path.join(CLIPDIR, `${n}.mp4`);
      const p = prev.clips?.[n];
      const st = stamp(clip);
      out[n] = (p && p.ok && p.size === st.size && p.mtime === st.mtime && !process.env.QC_FORCE) ? p : await medir(n);
      if (++hechos % 25 === 0) console.log(`  · medidos ${hechos}/${lista.length}`);
    }
  }));
  return out;
}

const guardar = (clips, extra = {}) => {
  const doc = { version: 1, slug: SLUG, at: new Date().toISOString(), clips, ...extra };
  fs.writeFileSync(OUTJ, JSON.stringify(doc, null, 1));
  return doc;
};

// ---------- ronda de medición ----------
let clips = { ...(prev.clips || {}), ...(await medirTodos(names)) };
for (const k of Object.keys(clips)) if (!names.includes(k) && !fs.existsSync(path.join(CLIPDIR, `${k}.mp4`))) clips[k] = { ...clips[k], removed: true };
let malos = names.filter((n) => !clips[n].ok);
console.log(`medición: ${names.length - malos.length} ok · ${malos.length} con defecto`);
for (const n of malos) console.log(`  ✗ ${n} [${clips[n].issue}] ${clips[n].why}`);

// ---------- reparación en escalera ----------
const fotoMala = malos.filter((n) => /base_has_person|sin-foto-base/.test(clips[n].issue));
if (FIX && malos.length) {
  const aRegen = malos.filter((n) => !fotoMala.includes(n) && clips[n].issue !== "error-vision");
  if (aRegen.length) {
    console.log(`\n[fix 1] regenero ${aRegen.length} con harden + escena vacía`);
    for (const n of aRegen) fs.renameSync(path.join(CLIPDIR, `${n}.mp4`), path.join(BAK, `${n}_r${Date.now()}.mp4`));
    const lista = `${TMP}/regen.json`;
    fs.writeFileSync(lista, JSON.stringify(aRegen.map((n) => ({ nombre: n, motion: info[n].motion || "the scene stays still with a very small natural movement", change: info[n].change || "",
      pres: !!info[n].pres, gente: !!info[n].gente, person: !!info[n].person, harden: true })), null, 1));
    spawnSync("node", ["scripts/agnes_i2v.mjs", lista, SLUG, IMGDIR, CLIPDIR], { stdio: "inherit" });
    Object.assign(clips, await medirTodos(aRegen.filter((n) => fs.existsSync(path.join(CLIPDIR, `${n}.mp4`)))));
    for (const n of aRegen) {
      const clip = path.join(CLIPDIR, `${n}.mp4`);
      if (!fs.existsSync(clip)) { clips[n] = { ok: true, removed: true, issue: "sin-clip", why: "no se pudo regenerar: el build usa la foto" }; continue; }
      if (clips[n].ok) continue;
      if (clips[n].first_bad === 4 && clips[n].dur > 2.5) {
        const tmp = `${TMP}/${n}_trim.mp4`;
        execFileSync("ffmpeg", ["-v", "error", "-y", "-i", clip, "-t", (clips[n].dur * 0.6).toFixed(3), "-an", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-r", "30", tmp]);
        fs.renameSync(clip, path.join(BAK, `${n}_pretrim.mp4`)); fs.renameSync(tmp, clip);
        clips[n] = (await medirTodos([n]))[n];
        console.log(`[fix 2] ${n} recortado al 60 % → ${clips[n].ok ? "ok" : clips[n].issue}`);
        if (clips[n].ok) { clips[n].trimmed = true; continue; }
      }
      fs.renameSync(clip, path.join(BAK, `${n}_rechazado.mp4`));
      clips[n] = { ok: true, removed: true, issue: "sacado", why: "falló la regeneración: el build usa la foto del momento" };
      console.log(`[fix 3] ${n} sacado → queda la foto`);
    }
  }
}

// ---------- repetición (planos más largos que su clip / clip usado dos veces) ----------
let rep = null;
const CUES = `_v3/${SLUG}_cues.json`;
if (fs.existsSync(CUES)) {
  const cues = JSON.parse(fs.readFileSync(CUES, "utf8")).filter((c) => c.src && /\.mp4$/.test(c.src));
  const durDe = {}, uso = {}, loops = [];
  for (const c of cues) {
    const f = path.join("public", c.src);
    if (!fs.existsSync(f)) continue;
    durDe[c.src] ??= +probe(["-show_entries", "format=duration", "-of", "csv=p=0", f]);
    uso[c.src] = (uso[c.src] || 0) + 1;
    if (c.dur > durDe[c.src] + 2 / 30) loops.push(`${c.key || c.src} ${c.dur.toFixed(2)}s > clip ${durDe[c.src].toFixed(2)}s`);
  }
  const dobles = Object.entries(uso).filter(([, v]) => v > 1).map(([k, v]) => `${k} ×${v}`);
  rep = { planos: cues.length, loops: loops.length, dobles: dobles.length, ejemplos: [...loops.slice(0, 8), ...dobles.slice(0, 8)] };
  console.log(`\nrepetición: ${cues.length} planos de clip · ${loops.length} más largos que su clip · ${dobles.length} clips usados más de una vez`);
  for (const e of rep.ejemplos) console.log(`  ✗ ${e}`);
} else console.log(`\nrepetición: sin ${CUES} → no medida (el gate del farm lo exige)`);

const doc = guardar(clips, { repeticion: rep });
const vivos = names.filter((n) => fs.existsSync(path.join(CLIPDIR, `${n}.mp4`)));
const siguenMal = vivos.filter((n) => !doc.clips[n]?.ok);
console.log(`\n=== agnes_qc ${SLUG} · clips vivos ${vivos.length} · ok ${vivos.length - siguenMal.length} · con defecto ${siguenMal.length} · sacados ${Object.values(doc.clips).filter((c) => c.removed).length} ===`);
if (fotoMala.length) console.log(`⛔ fotos base con gente inventada (regenerá la FOTO con "an empty unoccupied scene, nobody in the frame" y volvé a animar): ${fotoMala.join(" ")}`);
console.log(`sello → ${OUTJ}`);
process.exit(siguenMal.length || (rep && (rep.loops || rep.dobles)) ? 1 : 0);
