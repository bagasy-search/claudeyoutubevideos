// 60_build — UN build genérico por estilo. Emite src/<slug>/{Piezas,cues_<slug>.gen,Main_<slug>}.tsx,
// src/index_<slug>.tsx y _<slug>_assets.txt. Con FACTORY_DRY=1 emite en <work>/dry_src (no toca src/).
import fs from "node:fs";
import path from "node:path";
import { run, durSec, frameCount } from "../lib/exec.mjs";
import { assertMeasured, assertNoProblems } from "../lib/gate.mjs";
import { planVlog } from "../lib/vlogplan.mjs";
import { conApertura } from "../lib/apertura.mjs";
import { cargarKit, planPremium } from "../lib/kit.mjs";
import { ROOT, env } from "../lib/env.mjs";
import { pool } from "../lib/phase.mjs";

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const MONTAJES = ["vlog-crudo", "premium"];

export function emitVlog({ slug, comp, total, cues, ventanas, placa, fondo, ambiente = null, fps = 30, premium = false, audioDesdeF = 0, audios = [], audioSrc = null }) {
  const AUD = audioSrc || `${slug}.m4a`;
  const U = slug.toUpperCase().replace(/[^A-Z0-9]/g, "_");
  const el = (c) => (c.kind === "hook" ? `<Hook kind="${c.hook}" props={${JSON.stringify(c.props || {})} as any} dur={${c.dur}} />`
    : c.kind === "golpe" ? `<Golpe kind="${c.golpe}" props={${JSON.stringify(c.props)} as any} dur={${c.dur}} />`
    : c.kind === "apertura" ? `<AperturaMiniatura ${c.src ? `src="${c.src}" ` : ""}${c.foto ? `foto="${c.foto}" ` : ""}frames={${c.frames || 0}} />`
    : c.kind === "glitch" ? `<GlitchCut durationInFrames={${c.dur}} />`
    : c.kind === "cta" ? `<CtaFinal {...(${JSON.stringify(c.props)} as any)} />`
    // ⛔ El componente va SIN envoltorio: nada de placa/recuadro crema detrás (el creador lo rechazó
    //    expresamente). Comp.tsx sólo lo mete en un AbsoluteFill y le pasa durationInFrames.
    : c.comp ? `<Comp kind="${c.comp}" props={${JSON.stringify(c.props)} as any} />`
      : c.tipo === "clip" ? `<Clip src="${c.src}" seed={${c.start}} frames={${c.frames || 0}}${c.audio ? ` audio={${c.audio}}` : ""} />`
        : `<Foto src="${c.src}" seed={${c.start}} />`);
  const gen = `// cues_${slug}.gen.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { Clip, CtaFinal, Foto${cues.some((c) => c.kind === "apertura") ? ", AperturaMiniatura, GlitchCut" : ""}${cues.some((c) => c.kind === "golpe") ? ", Golpe" : ""}${cues.some((c) => c.kind === "hook") ? ", Hook" : ""} } from "./Piezas";${premium ? `
import { Comp } from "./Comp";` : ""}

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: (frame: number) => React.ReactNode };

export const CUES_${U}: Cue[] = [
${cues.map((c) => `  { key: "${c.key}", start: ${c.start}, dur: ${c.dur}, capa: "${c.capa}", el: (frame: number) => ${el(c)} },`).join("\n")}
];
`;
  const main = `// Main_${slug}.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_${U} } from "./cues_${slug}.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_${U} = ${total};

const VENTANAS = ${JSON.stringify(ventanas)};
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = ${JSON.stringify(audios)};

export const Main${comp}: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "${fondo}" }}>
      ${placa ? `<PlacaPiso src="${placa}" />` : ""}
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_${U}.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_${U}.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      ${audioDesdeF > 0 ? `<Sequence from={${audioDesdeF}} layout="none"><Audio src={staticFile("${AUD}")} /></Sequence>` : `<Audio src={staticFile("${AUD}")} />`}${ambiente ? `
      <Audio src={staticFile("${ambiente}")} />` : ""}
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
`;
  const index = `// index_${slug}.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main${comp}, TOTAL_FRAMES_${U} } from "./${slug}/Main_${slug}";

const Root: React.FC = () => (
  <Composition id="${comp}" component={Main${comp}}
    durationInFrames={TOTAL_FRAMES_${U}} fps={${fps}} width={1920} height={1080} />
);
registerRoot(Root);
`;
  return { gen, main, index, totalConst: `TOTAL_FRAMES_${U}` };
}

export default {
  id: "60_build",
  deps: ["20_asr", "50_agnes", "55_avatar"],
  inputs: ({ P, style, spec }) => {
    const est = path.join(ROOT, "factory", "styles", style.montaje || "vlog-crudo");
    return [P.mom, P.plan, P.ventanas, P.wav, P.imgDir, P.brollDir, style.vlog, spec.cta, spec.ctas || null, spec.fx || null, spec.hook || null,
      path.join(est, "Piezas.tsx"),
      ...((style.montaje || "vlog-crudo") === "premium" ? [path.join(est, "Comp.tsx"), path.join(est, "kit.json")] : []),
      env("FACTORY_DRY") || ""];
  },
  async run({ slug, spec, style, P, log }) {
    const montaje = style.montaje || "vlog-crudo";
    if (!MONTAJES.includes(montaje)) throw new Error(`montaje "${montaje}" todavía no está en la fábrica (${MONTAJES.join(", ")})`);
    const premium = montaje === "premium";
    const estiloDir = path.join(ROOT, "factory", "styles", montaje);
    const dry = env("FACTORY_DRY") === "1";
    const mom = JSON.parse(fs.readFileSync(P.mom, "utf8"));
    const plan = JSON.parse(fs.readFileSync(P.plan, "utf8"));

    // ── el CATÁLOGO del kit, verificado contra los .tsx REALES antes de emitir nada ──────────
    // Comp.tsx lo promete en su cabecera y es la única defensa que existe: un kind que no está en el
    // MAPA llega `undefined`, React tira el error #130 sin decir cuál fue, y como el import es
    // NOMBRADO `tsc` tampoco lo marca.
    let kit = null;
    if (premium) {
      kit = cargarKit(estiloDir);
      assertMeasured("kitExportsVerificados", kit.medido.exportsVerificados, { total: kit.medido.kindsDeclarados, min: kit.medido.kindsDeclarados, log });
      assertNoProblems("kitContrato", kit.problemas, kit.medido.kindsDeclarados, { log });
      // El `k` de cada plano nace en dir_*.json. Si el plan.json de este slug es ANTERIOR al arreglo
      // de `compose`, lo recuperamos de la dirección en vez de emitir un premium sin componentes.
      if (!plan.some((p) => p.k) && fs.existsSync(P.dirDir)) {
        const tramos = fs.readdirSync(P.dirDir).filter((f) => /^dir_[A-Z]+\.json$/.test(f)).sort()
          .flatMap((f) => JSON.parse(fs.readFileSync(path.join(P.dirDir, f), "utf8").replace(/^﻿/, "")));
        const kDe = new Map(tramos.filter((x) => x.k).map((x) => [x.n, x.k]));
        let rec = 0;
        for (const p of plan) if (kDe.has(p.name)) { p.k = kDe.get(p.name); rec++; }
        if (rec) log(`recuperé ${rec} componentes de ${P.dirDir} (el plan.json es anterior al arreglo de compose)`);
      }
      assertMeasured("planosConComponente", plan.filter((p) => p.k).length, { total: plan.length, min: 1, log });
    }
    const vent = spec.modo === "avatar" ? JSON.parse(fs.readFileSync(P.ventanas, "utf8")) : [];
    const wavSec = await durSec(P.wav);

    // placa del avatar (piso cuando ningún plano llega): la misma cara que animó InfiniteTalk
    const placaRel = (style.placa || "img/{slug}/{slug}_placa_a.jpg").replaceAll("{slug}", slug);
    const placaAbs = path.join(ROOT, "public", placaRel);
    if (spec.modo === "avatar" && !fs.existsSync(placaAbs) && !dry) {
      fs.mkdirSync(path.dirname(placaAbs), { recursive: true });
      await run("ffmpeg", ["-v", "error", "-y", "-i", spec.avatar.face, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "2", placaAbs], { timeoutMs: 60_000 });
    }

    const clips = [];
    // ⛔ Un plano marcado QUIETO (`q:1` → `quieto`) tiene que salir como FOTO con Ken-Burns, aunque su
    //    clip siga en disco de una corrida anterior. Sin esto, `assetOf` prefería el mp4 y el montaje
    //    se iba con los 146 planos animados igual: la regla de "como mucho la mitad se anima" pasaba
    //    la compuerta en 30_direct y NO llegaba al video (medido en fbmarmol, 18-sep-2026).
    //    ⛔⛔ PERO el guard NO puede ser "quieto → nunca mp4": desde que los planos de METRAJE REAL se
    //    marcan `q:1` (para sacarlos del universo de agnes y que `animadoPct` mida lo que agnes anima),
    //    ese mismo `if` tiraba los mp4 de Pexels y de Creative Commons. Medido en fbaislar: de 49 clips
    //    de Pexels + 4 CC pedidos llegó 1 y 1 a pantalla, y el video quedó con 1,2 % de metraje real en
    //    movimiento contra 81 % de foto IA. Y ni siquiera fallaba parejo: los dos que sobrevivieron se
    //    colaron porque el guard mira `base` sin la `x` final.
    //    El discriminador correcto es "¿este mp4 lo hizo AGNES?", no "¿el plano es quieto?". El registro
    //    `_v3/<slug>_i2v.json` tiene exactamente los nombres que agnes generó (verificado: 40 de agnes y
    //    49 de stock, intersección vacía). Sin registro se cae al comportamiento anterior, que es el
    //    conservador.
    //    ⛔⛔⛔ Y el registro de AGNES tampoco sirve de discriminador: medido en fbtelgopor (18-sep),
    //    `_i2v.json` sólo guarda la ÚLTIMA tanda (108 de 221) y `_agnes_clips.json` guarda los 221,
    //    incluidos los 28 que después pisó el metraje real. O sea: "está en el registro de agnes" da
    //    verdadero para clips que en el disco son de Pexels. El discriminador que SÍ cierra es el del
    //    otro lado: un plano quieto conserva su mp4 SÓLO si ese mp4 es METRAJE REAL, y el único que
    //    sabe eso es el registro de stock, que se escribe con el archivo ya conformado en disco.
    const quietos = new Set(plan.filter((p) => p.quieto).map((p) => p.name));
    let real = new Set();
    try {
      const reg = path.join(ROOT, "_v3", `${slug}_stock.json`);
      if (fs.existsSync(reg)) real = new Set(Object.keys(JSON.parse(fs.readFileSync(reg, "utf8"))));
    } catch { real = new Set(); }
    log(`  quietos ${quietos.size} · clips de METRAJE REAL registrados ${real.size}`);
    // el plano quieto vuelve a ser FOTO salvo que su mp4 sea metraje real
    const tapaElClip = (name) => quietos.has(name.replace(/x$/, "")) && !real.has(name);
    const assetOf = (name) => {
      const base = name.replace(/x$/, "");
      const hayClip = fs.existsSync(path.join(P.brollDir, `${name}.mp4`));
      const clip = () => { const src = `broll/${slug}/${name}.mp4`; clips.push(src); return { tipo: "clip", src }; };
      if (hayClip && !tapaElClip(name)) return clip();
      // el plano de continuación ("pXXXx") normalmente no tiene jpg propio: cae al de su base, que es
      // la MISMA foto con otro Ken-Burns. Antes caía al mp4 y por ahí se colaban los clips tapados.
      for (const n of [name, base]) {
        if (fs.existsSync(path.join(P.imgDir, `${n}.jpg`))) return { tipo: "foto", src: `img/${slug}/${n}.jpg` };
      }
      return hayClip ? clip() : null;
    };
    for (const p of plan) { assetOf(p.name); assetOf(`${p.name}x`); }
    const frames = new Map();
    await pool([...new Set(clips)], 8, async (src) => { try { frames.set(src, await frameCount(path.join(ROOT, "public", src))); } catch { frames.set(src, 0); } });
    // 0 clips es legítimo si el director marcó TODOS los planos de imagen quietos (`q:1`, brief sin agnes:
    // cmecargador 24-sep-2026) y no hay metraje real: ahí no hay nada que medir, no es "no haber mirado".
    const sinClips = plan.every((p) => p.tipo === "avatar" || (p.quieto && !p.st));
    assertMeasured("clipsMedidos", frames.size, { min: sinClips ? 0 : 1, allowZero: sinClips, log });

    const finPend = [];
    const planificar = premium ? planPremium : planVlog;
    const r = planificar({
      ...(premium ? { kit } : {}),
      mom, plan, ventanasSec: vent, wavSec, assetOf,
      framesOf: (src) => frames.get(src) ?? 0,
      finFoto: (name, clipSrc) => { finPend.push([name, clipSrc]); return { tipo: "foto", src: `img/${slug}/${name}_fin.jpg` }; },
      cta: [
        ...(spec.ctas || []).map((c) => ({ regex: new RegExp("^" + escRe(c.ancla), "i"), head: c.head, sub: c.sub || "", qr: c.qr || spec.cta.qr, durS: c.durS || 9 })),
        { regex: new RegExp("^" + escRe(spec.cta.ancla), "i"), head: spec.cta.head, sub: spec.cta.sub || "", qr: spec.cta.qr },
      ],
      opts: style.vlog || {},
    });
    for (const [a, b] of Object.entries(r.medido)) if (!Array.isArray(b)) log(`  ${a.padEnd(26, ".")} ${b}`);
    for (const a of (r.avisos || []).slice(0, 10)) log(`   ⚠ ${a}`);
    assertNoProblems("buildVlog", r.problemas, r.medido.cuesBase, { log });
    if (premium) {
      // "0 problemas" sin decir cuántos comps miró sería un verde MENTIROSO: se mide el universo.
      assertMeasured("compsEmitidos", r.medido.compsEmitidos, { total: r.medido.compsPedidos, min: r.medido.compsPedidos, log });
      assertMeasured("compsKindsDistintos", r.medido.compsKinds, { min: 1, log });
      assertMeasured("compDurMinSec", r.medido.compDurMinSec, { min: 2, unidad: " s", log });
    }

    // METRAJE REAL, MEDIDO SOBRE LO QUE LLEGA A PANTALLA (18-sep-2026).
    // ⛔ `45_stock` imprimía `metrajeRealPct: 29` y no mentía: medía los clips PEDIDOS a Pexels.
    //    Pero el video de fbaislar salió con 1,2 % de metraje real en movimiento, porque el guard de
    //    `quietos` descartaba esos mp4 al armar los cues. Verde perfecto, video sin metraje real.
    //    Un porcentaje de algo que "se pidió" no dice nada del video: acá se cuentan los SEGUNDOS de
    //    cue que de verdad salen de un mp4 que NO hizo agnes (stock de Pexels + Creative Commons +
    //    cualquier clip colocado a mano), sobre el total del timeline.
    // ⛔ LA PRIMERA VERSIÓN DE ESTA MEDICIÓN ESTABA MAL Y LA CAZÓ UN AGENTE, no una compuerta:
    //    dividía `dur` por 30 asumiendo CUADROS sin verificarlo, y el denominador le daba 746,9 s — que
    //    no es ni el video entero (808,97 s) ni el tiempo de b-roll (648,9 s). El numerador estaba bien
    //    (174,5 s, verificado a mano contra los cues), el divisor era una mezcla. Una medición con la
    //    unidad ADIVINADA es justo el verde que miente que estamos persiguiendo.
    //    Ahora la unidad se DEDUCE y se imprime: se compara la suma contra el total conocido del video.
    //    Si no se parece a ninguno de los dos, no se inventa un número: se tira.
    // ⛔ Y LA SEGUNDA VERSIÓN TAMBIÉN ESTABA MAL, cazada por el mismo agente: sumaba TODOS los cues,
    //    incluidas las capas de OVERLAY (los componentes se dibujan ENCIMA del b-roll), así que contaba
    //    dos veces el mismo tiempo — 98 s de más en fboxidoropa, que caían enteros del lado de "foto" y
    //    hundían el porcentaje de 27 % a 23 %. El universo correcto es el MISMO que se exporta a
    //    `_v3/<slug>_cues.json`: la capa base con asset. Si dos mediciones del mismo video no dan igual,
    //    una de las dos está mal — acá lo estaba la mía, dos veces seguidas.
    const base = r.cues.filter((c) => c.capa === "base" && c.src);
    const crudo = base.reduce((a2, c) => a2 + (c.dur ?? c.durationInFrames ?? 0), 0);
    const videoSec = (r.total || 0) / 30;
    const enCuadros = videoSec > 0 && Math.abs(crudo / 30 - videoSec) < Math.abs(crudo - videoSec);
    const segDe = (c) => ((c.dur ?? c.durationInFrames ?? 0) / (enCuadros ? 30 : 1));
    const sinDur = base.filter((c) => (c.dur ?? c.durationInFrames) === undefined).length;
    if (sinDur) throw new Error(`metrajeReal: ${sinDur} de ${base.length} cues de la capa base sin duración — el porcentaje sería falso`);
    const brollSec = base.reduce((a2, c) => a2 + segDe(c), 0);
    // El metraje REAL se mide por el registro de stock (lo que se bajó de Pexels y se conformó en
    // disco), no por descarte de agnes: el registro de agnes incluye nombres que después pisó el clip
    // real, así que "no está en agnes" dejaba fuera metraje que SÍ es real.
    const esReal = (c) => c.src && String(c.src).endsWith(".mp4") && real.has(path.basename(String(c.src), ".mp4"));
    const esClip = (c) => c.src && String(c.src).endsWith(".mp4");
    const realSec = base.filter(esReal).reduce((a2, c) => a2 + segDe(c), 0);
    const agnesSec = base.filter((c) => esClip(c) && !esReal(c)).reduce((a2, c) => a2 + segDe(c), 0);
    // El porcentaje que vale es sobre el B-ROLL, no sobre el video: el resto del video es el avatar,
    // y meterlo en el divisor hace bajar el número por una razón que no tiene que ver con el metraje.
    const realPct = brollSec ? Math.round((100 * realSec) / brollSec) : 0;
    log(`  metraje real ${realSec.toFixed(1)} s · agnes ${agnesSec.toFixed(1)} s · foto ${(brollSec - realSec - agnesSec).toFixed(1)} s · b-roll ${brollSec.toFixed(1)} s de ${videoSec.toFixed(1)} s de video (dur en ${enCuadros ? "cuadros" : "segundos"})`);
    // El piso es 10, no 25: la regla del canal (≥25 %) la juzga el creador con el número a la vista,
    // porque un video puede quedar legítimamente en 20 % si Pexels no tenía material del tema. Lo que
    // esta compuerta tiene que frenar es el DERRUMBE — el 1,2 % de fbaislar, que fue un bug y no una
    // decisión. Una compuerta que no puede fallar nunca no es una compuerta.
    // ⛔ Esta compuerta nació para los canales que SÍ tienen fuente de metraje real (Pexels/YouTube CC).
    // `taller-de-claudio` no la tiene: su estilo no declara `stock`, 45_stock sale `skipped` y el b-roll
    // es 100 % gpt-image + agnes por decisión del creador (20-sep-2026). Ahí el piso de 10 % es
    // INALCANZABLE y mataba el build con "midió 0 = no miró", que es justo lo contrario de lo que pasa:
    // se midió perfecto y da 0 porque no hay de dónde sacar metraje. Con estilo SIN `stock` se informa
    // el número igual (nunca se deja de imprimir) pero no frena; con estilo CON `stock` sigue idéntica,
    // así que el derrumbe del 1,2 % de fbaislar se sigue cazando.
    const canalConStock = !!style.stock;
    if (!canalConStock) log(`  (el estilo "${style.nombre || spec.canal}" no declara fuente de stock: el piso de metraje real no aplica)`);
    assertMeasured("metrajeRealEnPantallaPct", realPct, { min: canalConStock ? 10 : undefined, allowZero: !canalConStock, unidad: " % del b-roll", log });

    if (!dry) await pool(finPend, 4, async ([name, clipSrc]) => {
      const jpg = path.join(P.imgDir, `${name}_fin.jpg`);
      if (!fs.existsSync(jpg)) await run("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.1", "-i", path.join(ROOT, "public", clipSrc), "-frames:v", "1", "-q:v", "2", jpg], { timeoutMs: 60_000 });
    });

    for (const c of r.cues) if (c.tipo === "clip") c.frames = frames.get(c.src) || 0;
    // SONIDO NATIVO de los clips (agnes 2.5-flash): sólo los que traen pista de audio, que ya pasó el
    // detector de voz en agnes_i2v. Volumen de cama bajo la voz (`style.clipAudioVol`, default 0,28).
    const eventosClip = [];
    if (!dry && (style.agnesModelo || Object.keys(spec.overrides?.agnesFlash || {}).length)) {   // flash por plano: overrides.agnesFlash
      let conAudio = 0;
      const clipsBase = [...new Set(r.cues.filter((c) => c.tipo === "clip").map((c) => c.src))];
      const tiene = new Map();
      await pool(clipsBase, 6, async (src) => {
        const o = await run("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", path.join(ROOT, "public", src)], { timeoutMs: 30_000, allowFail: true });
        tiene.set(src, /\d/.test(o.stdout || ""));
      });
      for (const c of r.cues) if (c.tipo === "clip" && tiene.get(c.src)) {
        const durF = Math.min(c.dur, c.frames || c.dur);
        eventosClip.push({ src: path.join(ROOT, "public", c.src), atF: c.start, dur: durF / 30, vol: Number(style.clipAudioVol ?? 0.28), norm: -24, maxGain: 20, piso: -62, fi: 4 / 30, fo: 4 / 30 });
        conAudio++;
      }
      log(`sonido nativo: ${conAudio} planos con audio de agnes (de ${r.cues.filter((c) => c.tipo === "clip").length} clips)`);
    }
    let ventanas = r.ventanas.map((w) => ({ ...w, src: `broll/${slug}/av_w${String(w.k).padStart(3, "0")}.mp4` }));
    // COMPOSITING (`fx` en momentos de avatar): el efecto se ancla al ms de la frase (+ `at` s) y se
    // mete en SU ventana, con el recorte del presentador (RVM en Modal) para el sándwich
    // fondo → efecto → presentador. ⛔ Un fx que no cae en una ventana es un error, no un no-op.
    // el fx vive en el SPEC (spec.fx[momento]) o en la dirección (p.fx): el spec no invalida imágenes/clips
    for (const p of plan) if (spec.fx?.[p.name]) p.fx = spec.fx[p.name];
    const conFx = plan.filter((p) => p.fx);
    if (conFx.length) {
      const probFx = [];
      const momDe = new Map(mom.map((m) => [m.name, m]));
      for (const p of conFx) {
        const m = momDe.get(p.name);
        const f = Math.round((m.start + (Number(p.fx.at) || 0)) * 30);
        const w = ventanas.find((v) => f >= v.from && f < v.from + v.dur);
        if (!w) { probFx.push(`${p.name}: el fx cae en ${(f / 30).toFixed(2)} s y ahí no hay ventana de avatar`); continue; }
        const dur = Math.min(Math.round((Number(p.fx.durS) || (m.end - m.start)) * 30), w.from + w.dur - f);
        if (dur < 30) { probFx.push(`${p.name}: el fx dura ${(dur / 30).toFixed(2)} s dentro de la ventana (mín 1 s)`); continue; }
        w.fx = [...(w.fx || []), { start: f - w.from, dur, kind: p.fx.kind, props: p.fx.props || {} }];
        w.fg = `broll/${slug}/av_w${String(w.k).padStart(3, "0")}_fg.webm`;
      }
      const fgs = ventanas.filter((w) => w.fg);
      if (!dry) for (const w of fgs) {
        const fgAbs = path.join(ROOT, "public", w.fg);
        if (fs.existsSync(fgAbs)) continue;
        await run("node", [path.join(ROOT, "factory", "tools", "matte.mjs"), path.join(ROOT, "public", w.src), fgAbs], { timeoutMs: 30 * 60_000 });
      }
      for (const w of fgs) if (!dry && !fs.existsSync(path.join(ROOT, "public", w.fg))) probFx.push(`falta el recorte ${w.fg}`);
      assertNoProblems("compositingFx", probFx, conFx.length, { log });
      log(`compositing: ${conFx.length} fx en ${fgs.length} ventanas con recorte`);
    }
    // EDICIÓN DEL PRIMER MINUTO (spec.hook, en SEGUNDOS del máster anclados a la palabra):
    //   cortes: planos BASE que reemplazan lo que el plan puso en [desde, hasta) — nunca sobre una ventana
    //   over:   capas encima (reloj, relámpago, caída a negro, cascada)
    //   sfx / camas: pista de efectos con fundidos
    // ⛔ Todo asset que viaja en props se suma a la lista del farm (si no, 404 y chunk muerto).
    const audios = [], hookAssets = new Set();
    const H = spec.hook;
    if (H) {
      const { HOOK_KINDS } = { HOOK_KINDS: ["foto", "clip", "dianoche", "reloj", "flash", "negro", "cascada"] };
      const F = (s) => Math.round(s * 30), probH = [];
      const juntar = (v) => { if (typeof v === "string" && /^(img|broll|sfx_fab)\//.test(v)) hookAssets.add(v); else if (v && typeof v === "object") Object.values(v).forEach(juntar); };
      for (const [i, c] of (H.cortes || []).entries()) {
        if (!HOOK_KINDS.includes(c.kind)) { probH.push(`corte ${i}: kind desconocido "${c.kind}"`); continue; }
        const f0 = F(c.desde), f1 = F(c.hasta);
        if (!(f1 > f0)) { probH.push(`corte ${i}: rango vacío`); continue; }
        if (ventanas.some((w) => f0 < w.from + w.dur && f1 > w.from)) { probH.push(`corte ${i} (${c.desde}-${c.hasta} s) pisa una ventana de avatar`); continue; }
        const nuevos = [];
        for (const b of r.cues) {
          if (b.capa !== "base") { nuevos.push(b); continue; }
          const e = b.start + b.dur;
          if (e <= f0 || b.start >= f1) { nuevos.push(b); continue; }
          if (b.start < f0) nuevos.push({ ...b, dur: f0 - b.start });
          if (e > f1) nuevos.push({ ...b, key: b.key + "_h" + i, start: f1, dur: e - f1 });
        }
        const props = { ...(c.props || {}) };
        let kind = c.kind;
        // `plano: "pNNN"` = el MISMO plano del plan: su clip de agnes si pasó el QC, si no su foto.
        if (props.plano) {
          const clipRel = `broll/${slug}/${props.plano}.mp4`, fotoRel = `img/${slug}/${props.plano}.jpg`;
          if (fs.existsSync(path.join(ROOT, "public", clipRel))) { kind = "clip"; props.src = clipRel; } else { kind = "foto"; props.src = fotoRel; }
          delete props.plano;
        }
        if (kind === "clip" && !dry) props.frames = await frameCount(path.join(ROOT, "public", props.src));
        nuevos.push({ key: `hook_b${i}`, start: f0, dur: f1 - f0, capa: "base", kind: "hook", hook: kind, props });
        r.cues = nuevos; juntar(props);
      }
      for (const [i, c] of (H.over || []).entries()) {
        if (!HOOK_KINDS.includes(c.kind)) { probH.push(`over ${i}: kind desconocido "${c.kind}"`); continue; }
        const f0 = F(c.desde), f1 = F(c.hasta);
        r.cues.push({ key: `hook_o${i}`, start: f0, dur: Math.max(1, f1 - f0), capa: "over", kind: "hook", hook: c.kind, props: c.props || {} });
        juntar(c.props || {});
      }
      for (const a of H.sfx || []) {
        const d = F(a.durS || 2.5);
        audios.push({ from: F(a.t), dur: d, src: a.src, vol: a.vol ?? 0.6, fi: 0, fo: Math.min(6, d) }); hookAssets.add(a.src);
      }
      for (const a of H.camas || []) {
        audios.push({ from: F(a.desde), dur: F(a.hasta) - F(a.desde), src: a.src, vol: a.vol ?? 0.2, fi: F(a.fadeIn ?? 1), fo: F(a.fadeOut ?? 1), loop: true }); hookAssets.add(a.src);
      }
      r.cues.sort((a, b) => a.start - b.start);
      const faltan = [...hookAssets].filter((a) => !dry && !fs.existsSync(path.join(ROOT, "public", a)));
      for (const a of faltan) probH.push(`falta public/${a}`);
      assertNoProblems("hookEdicion", probH, (H.cortes || []).length + (H.over || []).length + audios.length, { log });
      log(`hook: ${(H.cortes || []).length} cortes · ${(H.over || []).length} capas · ${audios.length} sonidos · ${hookAssets.size} assets`);
    }
    // APERTURA CON LA MINIATURA: corre todo `holdF` a la derecha y mete la miniatura + el glitch.
    let cuesFinal = r.cues, totalFinal = r.total, audioDesdeF = 0;
    const apCfg = style.apertura?.miniatura ? style.apertura : null;
    if (apCfg) {
      const clipRel = (apCfg.clip || "broll/{slug}/{slug}_apertura.mp4").replaceAll("{slug}", slug);
      const fotoRel = (apCfg.foto || "img/{slug}/{slug}_thumb.jpg").replaceAll("{slug}", slug);
      const clipAbs = path.join(ROOT, "public", clipRel);
      const fotoAbs = path.join(ROOT, "public", fotoRel);
      const hayClip = fs.existsSync(clipAbs), hayFoto = fs.existsSync(fotoAbs);
      // La foto EXACTA es la que hace el truco; el clip de agnes sólo la mueve. Sin ninguna de las dos
      // no hay apertura: se pide, no se inventa.
      assertNoProblems("aperturaMiniaturaPresente", hayClip || hayFoto ? [] : [
        `faltan ${clipRel} y ${fotoRel} — la apertura con la miniatura está prendida en el estilo. Generalos con: node scripts/apertura_miniatura.mjs ${slug} <miniatura.png> "<motion simple>"`,
      ], 1, { log });
      if (!hayClip) log(`  apertura SIN clip de agnes: va la miniatura quieta con su push (${fotoRel})`);
      const apFrames = hayClip && !dry ? await frameCount(clipAbs) : 0;
      const ap = conApertura({ cues: r.cues, ventanas, total: r.total, fps: P.fps || 30, ap: { ...apCfg, src: hayClip ? clipRel : null, foto: hayFoto ? fotoRel : null, frames: apFrames } });
      cuesFinal = ap.cues; ventanas = ap.ventanas; totalFinal = ap.total; audioDesdeF = ap.audioDesdeF;
      r.cues = cuesFinal; r.total = totalFinal;
      log(`apertura con miniatura: ${ap.medido.miniaturaSec} s de miniatura + glitch de ${ap.medido.glitchF} cuadros; audio y ventanas corridos ${ap.medido.holdF} cuadros`);
      for (const c of cuesFinal) if (c.foto) { /* la foto de respaldo también viaja al farm */ }
    }
    // MÁSTER DE MEZCLA: voz + efectos del hook + sonido nativo de los clips, cada uno en su cuadro.
    // ⛔ La entrega (90_deliver) le pone al mp4 el audio del máster: lo que viviera sólo en Remotion
    //    se perdería en silencio. Por eso NADA de audio suelto en el render: un único máster mezclado.
    let audioSrc = null;
    const eventos = [
      ...audios.map((a) => ({ src: path.join(ROOT, "public", a.src), at: a.from / 30, dur: a.dur / 30, vol: a.vol, fi: a.fi / 30, fo: a.fo / 30, loop: !!a.loop })),
      ...eventosClip.map((e) => ({ ...e, at: (e.atF - audioDesdeF) / 30 })),
    ].filter((e) => e.at >= 0);
    if (eventos.length && !dry) {
      const evFile = path.join(P.work, "audio", `${slug}_mezcla.json`);
      const mixWav = path.join(P.work, "audio", `${slug}_mix.wav`);
      fs.writeFileSync(evFile, JSON.stringify(eventos, null, 1));
      const rm = await run("python", [path.join(ROOT, "factory", "py", "mezcla.py"), P.wav, evFile, mixWav], { timeoutMs: 30 * 60_000, allowFail: true });
      log((rm.out || "").trim().split("\n").slice(-2).join(" · "));
      assertMeasured("mezclaEventos", rm.code === 0 && fs.existsSync(mixWav) ? eventos.length : 0, { min: 1, log });
      await run("ffmpeg", ["-v", "error", "-y", "-i", mixWav, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", path.join(ROOT, "public", `${slug}_mix.m4a`)], { timeoutMs: 20 * 60_000 });
      audioSrc = `${slug}_mix.m4a`;
      log(`máster de mezcla: ${eventos.length} eventos (${audios.length} efectos/camas + ${eventosClip.length} clips con sonido)`);
    }
    const out = emitVlog({ slug, comp: P.comp, total: totalFinal, cues: cuesFinal, ventanas, placa: spec.modo === "avatar" ? placaRel : null, fondo: style.fondo || "#0A0B08", ambiente: spec.ambiente || null, premium, audioDesdeF, audioSrc });
    // DRY emite adentro del repo (gitignored) para que `tsc` resuelva remotion desde node_modules
    const dryRoot = path.join(ROOT, "factory", "_dry");
    const srcDir = dry ? path.join(dryRoot, slug) : P.srcDir;
    const entry = dry ? path.join(dryRoot, `index_${slug}.tsx`) : P.entry;
    fs.mkdirSync(srcDir, { recursive: true });
    fs.copyFileSync(path.join(estiloDir, "Piezas.tsx"), path.join(srcDir, "Piezas.tsx"));
    if (premium) {
      // Comp.tsx importa el kit REAL por ruta relativa ("../VideoEdit/scenes/X"). Esa ruta vale desde
      // src/<slug>/, pero NO desde factory/_dry/<slug>/: se reescribe al copiar para que `tsc` resuelva
      // en los dos casos, y para que el importTree del farm arrastre los .tsx del kit al tarball.
      const rel = path.relative(srcDir, path.join(ROOT, "src", "VideoEdit", "scenes")).split(path.sep).join("/");
      const comp = fs.readFileSync(path.join(estiloDir, "Comp.tsx"), "utf8")
        .replace(/(["'])\.\.\/VideoEdit\/scenes\//g, `$1${rel}/`);
      fs.writeFileSync(path.join(srcDir, "Comp.tsx"), comp);
      const importados = [...comp.matchAll(/^import\s*\{([^}]+)\}\s*from\s*["']\.[^"']*scenes\/([^"']+)["']/gm)];
      // el MAPA de Comp.tsx tiene que cubrir exactamente los kinds del contrato: si falta uno, ese
      // cue emite `undefined` y el chunk muere con el React #130 que no dice cuál fue.
      const enMapa = new Set(importados.flatMap((m) => m[1].split(",").map((s) => s.trim()).filter(Boolean)));
      const faltanEnMapa = Object.keys(kit.kinds).filter((k) => !enMapa.has(k));
      assertNoProblems("compMapaCubreElKit", faltanEnMapa.map((k) => `Comp.tsx no importa "${k}" (llegaría undefined → React #130)`), Object.keys(kit.kinds).length, { log });
    }
    fs.writeFileSync(path.join(srcDir, `cues_${slug}.gen.tsx`), out.gen);
    fs.writeFileSync(path.join(srcDir, `Main_${slug}.tsx`), out.main);
    fs.writeFileSync(entry, out.index);

    const assets = new Set([audioSrc || `${slug}.m4a`]);
    if (spec.ambiente) assets.add(spec.ambiente);   // la cama de ambiente tambien viaja al farm
    if (spec.modo === "avatar") assets.add(placaRel);
    for (const c of r.cues) if (c.src) assets.add(c.src);
    // ⛔ Un asset que viaja en las PROPS de un componente (el QR del CTA) no tiene `src`, asi que no
    // entraba en la lista y el farm lo servia 404: el chunk moria con EncodingError. Medido en
    // cmeamazon (dos renders fallados seguidos por `public/qr/cmeamazon.png` 404).
    for (const c of r.cues) if (c.props?.qr) assets.add(c.props.qr);
    for (const c of r.cues) if (c.foto) assets.add(c.foto);   // la foto de la apertura no viaja en `src`
    // ⛔ MISMA MINA, MÁS GRANDE, en premium: los componentes del kit reciben rutas de asset DENTRO de
    // las props (`image`, `src`, `steps[].image`, `events[].image`). Ninguna tiene `src` en el cue, así
    // que ninguna entraba en la lista y el farm las servía 404 → EncodingError y chunk muerto.
    // planPremium las junta recorriendo el contrato (kit.json declara cuáles son de tipo `asset`).
    for (const a of r.compAssets || []) assets.add(a);
    for (const w of ventanas) { assets.add(w.src); if (w.fg) assets.add(w.fg); }
    for (const a of hookAssets) assets.add(a);
    const lista = [...assets];
    const sinDisco = dry ? [] : lista.filter((a) => !fs.existsSync(path.join(ROOT, "public", a)));
    assertNoProblems("assetsEnDisco", sinDisco.map((a) => `no existe public/${a}`), lista.length, { log });
    fs.writeFileSync(dry ? path.join(dryRoot, `_${slug}_assets.txt`) : P.assetsList, lista.join("\n") + "\n");
    // agnes_qc mide la REPETICIÓN (plano más largo que su clip, clip en dos planos) sobre esta lista
    if (!dry) fs.writeFileSync(path.join(ROOT, "_v3", `${slug}_cues.json`), JSON.stringify(r.cues.filter((c) => c.capa === "base" && c.src).sort((a, b) => a.start - b.start)
      .map((c) => ({ key: c.key, i: c.i, start: +(c.start / 30).toFixed(3), dur: +(c.dur / 30).toFixed(3), src: c.src })), null, 1));
    const tsx = [out.gen, out.main].join("\n").split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
    if (/<Video[\s>]/.test(tsx)) throw new Error("el build usa <Video> (va OffthreadVideo)");
    return { dry, total: r.total, assets: lista.length, ...r.medido, peoresVentanas: undefined };
  },
};
