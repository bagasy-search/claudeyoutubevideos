// clipsfirst_template.mjs — TEMPLATE CANÓNICO para videos CLIPS-FIRST (estilo "barcos",
// "hurón", "construcciones": documental/compilación de cientos de clips reales de YouTube
// matcheados a la narración, muy dinámico). Copialo a build_<slug>.mjs y llenalo.
//
// ▼▼ RECETA GANADORA (no reinventar — esto es lo que hizo el video de barcos "increíble") ▼▼
//
// 1) PACING: corte cada ~2.5-5s. Dur PROMEDIO objetivo ~4.5-5s (barcos 5.1s, hurón 4.4s,
//    construcciones 3.6s). 7s+ se ve LENTO. Dos formas de lograrlo:
//      a) HAND-SET (estilo barcos): clip(dur, ...) con dur ~3s y back-to-back (T += dur).
//      b) GRILLA + MINGAP (estilo peroxide): ~3.2s de grilla y MINGAP ~3.4 → ~5s/clip.
//
// 2) QUERIES (lo MÁS importante): en ESPAÑOL, específicas, VISUALES y CON ANCLA DE
//    SUJETO (el nombre de la cosa: "ventilador botellas congeladas atras"). NUNCA la
//    palabra literal del narrador, NUNCA inglés narrativo ("person frustrated saying...")
//    — eso trae youtubers cara-a-cámara (mitad del footage del video ventilador fue
//    basura por esto). Poné "anchor" con el sujeto: 2_search_mosaics lo fuerza en código.
//
// 3) MATCHEO = match_v3/ (el cerebro nuevo, juez de visión sobre storyboards):
//      node match_v3/2_search_mosaics.mjs _v3/<slug>_beats.json _v3_mosaics 6 2 --anchors "sujeto"
//      node match_v3/split_judge.mjs _v3_mosaics 8          # batches para agentes-juez
//      (agentes JUEZ §2 de match_v3/PROMPTS.md → picks.json)
//      node match_v3/3_assemble.mjs <beats> picks.json public/broll/clips_<slug>_matched.json _v3_mosaics/_manifest.json
//    Filtra solo: blocklist, shorts, talking-heads, duración, ancla — todo en código.
//
// 4) DESCARGA: node scripts/fetch_parallel.mjs public/broll/clips_<slug>_matched.json
//    (por los 6 proxies). fetch_clips ya valida lo bajado (ffprobe: truncado/vertical/
//    <480p → _failed.json). Después el VERIFICADOR OBLIGATORIO:
//      node match_v3/4_stills.mjs <matched> _v3_<slug>_stills
//      (agentes VERIFICADOR §3 → verdicts.json)
//      node match_v3/5_apply_verdicts.mjs <matched> verdicts.json --stills _v3_<slug>_stills/_stills.json
//      node scripts/stockfallback.mjs --list <matched>_needstock.json   # cascada Pexels→Pixabay→Archive→foto
//
// 4b) ★ FALLBACK WEB-IMAGES (estándar, NO opcional): para TODO concepto que NO matcheó
//     clip (o cayó por _text>0.85), bajar una IMAGEN REAL de la web con fetch_bing.mjs
//     (DuckDuckGo, sin key) — castiga DURO texto/marca de agua (textMax>0.14 ⇒ ×0.06) y
//     rankea con CLIP por la frase, así "encaja perfecto y sin textos". Da variedad on-topic
//     en vez de REUSAR el mismo clip (queja del usuario: "dejás un clip 40s"). Receta:
//       node -e '... arma public/real/bing_<slug>.json = [{name,query,count:2}] de los
//                conceptos SIN public/broll/<name>.mp4 ...'
//       RANK_CANDS=12 node fetch_bing.mjs public/real/bing_<slug>.json   // → public/real/<name>.jpg
//     En el BUILD, prioridad por concepto (helper pickSrc): SU clip > SU imagen web > clip
//     ciclado del pool (último recurso). Así casi no se reusan clips y cae a ~0 IA de b-roll.
//     fetch_parallel y fetch_bing ambos por proxy/sin-IP. Incluir public/real/* en el tar del farm.
//
// 4c) ★ ANECSEQ — imágenes BESPOKE (gpt-image-2 vía gen_images.mjs, modo low) para los momentos
//     NARRATIVOS donde el clip genérico no alcanza: "su abuelo haciendo X", anécdotas, personajes.
//     Generar un set propio (ej. corn_gf_*: abuelo probando el grano con la uña, enseñando al nieto,
//     cosechando al amanecer...) con prompts CORTOS + imperfecciones (ver reference_video_prompt_imperfections),
//     y ANCLARLAS al ms EXACTO de su frase: en el build, [frase → img] reemplaza el beat raw en ese anchor.
//     Da el salto de "esfuerzo/profesional": cuando narra al abuelo, se VE al abuelo haciendo eso.
//
// 5) AVATAR (si el video lo tiene): full en beats personales + PiP QUIETO en UNA esquina
//    (cornerBR default) que a veces DESAPARECE (hidden) — NO rotar de esquina en esquina,
//    distrae (feedback duro del usuario: feedback_video_avatar_pip_quieto).
//
// 6) SIN filtros de color creativos (regla dura). La única excepción: NORMALIZACIÓN
//    medida entre fuentes → node scripts/probe_grade.mjs <slug> (beatsheet la aplica solo).
//
// 7) AUDIO PRO (nuevo, jul 2026): en el beatsheet poné
//      "music": { "src": "music/<pista>.mp3" }   → AudioBed con ducking por Whisper
//      (SFX suaves automáticos en componentes; "sfx": false para apagarlos)
//    y "maxRawDur": 8  → AUTOSPLIT: ningún plano clavado >8s (tomas A/B mismo asset).
//
// 8) ANTES DEL RENDER FINAL (auto-pilot de calidad):
//      node scripts/audit_video.mjs <slug> --video out/<slug>_preview.mp4
//      agente AUDITOR (§4 PROMPTS) → issues.json → aplicar fixes → repetir hasta {}
//
// 9) Render = farm (render.yml).
//
// Memoria relacionada: feedback_video_clip_pacing, feedback_video_query_authoring,
// reference_matchclip_proxies, feedback_video_documental_clips_first, feedback_video_no_text_clips.
//
// ── HELPERS (de build_barcos.mjs) ────────────────────────────────────────────
import fs from "fs";

const SLUG = "REEMPLAZAR";       // <- slug del video
const AVATAR = `${SLUG}_opt.mp4`; // o null si es faceless
const B = [];                     // beats (cues)
const M = [];                     // match list (conceptos a matchear)
const seenM = new Set();
let T = 0, _id = 0;
const nid = (p) => `${p}${++_id}`;

// ★★★ SUFIJO DE IMAGEN — IMPERFECCIONES, NO STOCK (ver memoria reference_video_prompt_imperfections).
// La CLAVE del realismo es el PROMPT. PROHIBIDO el sufijo "stock": vivid colors / sharp focus /
// well lit / clean / cinematic / highly detailed → eso vuelve las imágenes cara-de-IA / banco de fotos.
// Usar SIEMPRE estas imperfecciones explícitas (lo que el usuario notó que se perdió, jun 2026):
const IMG_STYLE = ", documentary photo that looks like a real casual phone snapshot, slightly soft focus, uneven natural light, real skin texture, natural hands, slightly messy background, small imperfections, nothing perfect, nothing polished, no AI look, low saturation, soft muted colors, no text, no captions, no watermark, no logo";
const HERO = ", documentary photo, real and a bit raw, moody natural light, slightly soft, real texture, small imperfections, nothing polished, no AI look, low saturation, muted colors, no text, no watermark, no logo";
// gen de IA: prompt = query[0] + IMG_STYLE  (NUNCA el campo `concept`, que es abstracto). Hero = +HERO.

// clip(dur, name, query, concept) — coloca un clip de YouTube de `dur` seg y avanza T.
// dur ~3-5s. query = string o array. concept = lo que se debe VER (anclado al tema).
const clip = (dur, name, query, concept, o = {}) => {
  B.push({ id: nid("c"), start: +T.toFixed(2), dur, kind: "raw", src: `broll/${name}.mp4`, hue: o.hue || "amber", ...(o.kicker ? { kicker: o.kicker } : {}) });
  if (!seenM.has(name)) { seenM.add(name); M.push({ name, query: Array.isArray(query) ? query : [query], concept, dur: Math.max(4, Math.ceil(dur) + 1) }); }
  T += dur;
};
// img(dur, name, query, concept) — foto real (public/real/*.jpg) en vez de clip.
const img = (dur, name, query, concept, o = {}) => {
  B.push({ id: nid("i"), start: +T.toFixed(2), dur, kind: "raw", src: `real/${name}.jpg`, hue: o.hue || "amber" });
  if (!seenM.has(name)) { seenM.add(name); M.push({ name, query: Array.isArray(query) ? query : [query], concept, dur: Math.max(4, Math.ceil(dur) + 1) }); }
  T += dur;
};

// ── AQUÍ van los clip()/img() del video, leyendo el guion beat por beat ──
// clip(3.0, "abyss", ["descending into deep dark ocean"], "descending into the dark deep ocean");
// ...

// ── SALIDA: match list (modo match) o beatsheet (modo build) ─────────────────
const MODE = process.argv[2] === "match" ? "match" : "build";
fs.mkdirSync("public/broll", { recursive: true });
if (MODE === "match") {
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(M, null, 2));
  console.log(`match_${SLUG}.json: ${M.length} clips · dur prom ${(B.reduce((a, b) => a + b.dur, 0) / B.length).toFixed(1)}s`);
} else {
  // (en build real: filtrar a los broll/<name>.mp4 presentes, armar avatar windows, etc.)
  fs.mkdirSync("beatsheet", { recursive: true });
  fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({
    video: SLUG, avatar: AVATAR,
    maxRawDur: 8,                                   // pacing: autosplit de planos clavados
    music: { src: `music/bed_${SLUG}.mp3` },        // cama con ducking (poner la pista en public/music/)
    beats: B,
  }, null, 2));
  console.log(`beatsheet/${SLUG}.json: ${B.length} beats`);
}
