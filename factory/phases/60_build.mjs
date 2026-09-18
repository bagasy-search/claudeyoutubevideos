// 60_build — UN build genérico por estilo. Emite src/<slug>/{Piezas,cues_<slug>.gen,Main_<slug>}.tsx,
// src/index_<slug>.tsx y _<slug>_assets.txt. Con FACTORY_DRY=1 emite en <work>/dry_src (no toca src/).
import fs from "node:fs";
import path from "node:path";
import { run, durSec, frameCount } from "../lib/exec.mjs";
import { assertMeasured, assertNoProblems } from "../lib/gate.mjs";
import { planVlog } from "../lib/vlogplan.mjs";
import { cargarKit, planPremium } from "../lib/kit.mjs";
import { ROOT, env } from "../lib/env.mjs";
import { pool } from "../lib/phase.mjs";

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const MONTAJES = ["vlog-crudo", "premium"];

export function emitVlog({ slug, comp, total, cues, ventanas, placa, fondo, ambiente = null, fps = 30, premium = false }) {
  const U = slug.toUpperCase().replace(/[^A-Z0-9]/g, "_");
  const el = (c) => (c.kind === "cta" ? `<CtaFinal {...(${JSON.stringify(c.props)} as any)} />`
    // ⛔ El componente va SIN envoltorio: nada de placa/recuadro crema detrás (el creador lo rechazó
    //    expresamente). Comp.tsx sólo lo mete en un AbsoluteFill y le pasa durationInFrames.
    : c.comp ? `<Comp kind="${c.comp}" props={${JSON.stringify(c.props)} as any} />`
      : c.tipo === "clip" ? `<Clip src="${c.src}" seed={${c.start}} frames={${c.frames || 0}} />`
        : `<Foto src="${c.src}" seed={${c.start}} />`);
  const gen = `// cues_${slug}.gen.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { Clip, CtaFinal, Foto } from "./Piezas";${premium ? `
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

export const Main${comp}: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "${fondo}" }}>
      ${placa ? `<PlacaPiso src="${placa}" />` : ""}
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
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
      <Audio src={staticFile("${slug}.m4a")} />${ambiente ? `
      <Audio src={staticFile("${ambiente}")} />` : ""}
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
    return [P.mom, P.plan, P.ventanas, P.wav, P.imgDir, P.brollDir, style.vlog, spec.cta, spec.ctas || null,
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
    const assetOf = (name) => {
      if (fs.existsSync(path.join(P.brollDir, `${name}.mp4`))) { const src = `broll/${slug}/${name}.mp4`; clips.push(src); return { tipo: "clip", src }; }
      if (fs.existsSync(path.join(P.imgDir, `${name}.jpg`))) return { tipo: "foto", src: `img/${slug}/${name}.jpg` };
      return null;
    };
    for (const p of plan) { assetOf(p.name); assetOf(`${p.name}x`); }
    const frames = new Map();
    await pool([...new Set(clips)], 8, async (src) => { try { frames.set(src, await frameCount(path.join(ROOT, "public", src))); } catch { frames.set(src, 0); } });
    assertMeasured("clipsMedidos", frames.size, { min: 1, allowZero: plan.every((p) => p.tipo === "avatar"), log });

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

    if (!dry) await pool(finPend, 4, async ([name, clipSrc]) => {
      const jpg = path.join(P.imgDir, `${name}_fin.jpg`);
      if (!fs.existsSync(jpg)) await run("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.1", "-i", path.join(ROOT, "public", clipSrc), "-frames:v", "1", "-q:v", "2", jpg], { timeoutMs: 60_000 });
    });

    for (const c of r.cues) if (c.tipo === "clip") c.frames = frames.get(c.src) || 0;
    const ventanas = r.ventanas.map((w) => ({ ...w, src: `broll/${slug}/av_w${String(w.k).padStart(3, "0")}.mp4` }));
    const out = emitVlog({ slug, comp: P.comp, total: r.total, cues: r.cues, ventanas, placa: spec.modo === "avatar" ? placaRel : null, fondo: style.fondo || "#0A0B08", ambiente: spec.ambiente || null, premium });
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

    const assets = new Set([`${slug}.m4a`]);
    if (spec.ambiente) assets.add(spec.ambiente);   // la cama de ambiente tambien viaja al farm
    if (spec.modo === "avatar") assets.add(placaRel);
    for (const c of r.cues) if (c.src) assets.add(c.src);
    // ⛔ Un asset que viaja en las PROPS de un componente (el QR del CTA) no tiene `src`, asi que no
    // entraba en la lista y el farm lo servia 404: el chunk moria con EncodingError. Medido en
    // cmeamazon (dos renders fallados seguidos por `public/qr/cmeamazon.png` 404).
    for (const c of r.cues) if (c.props?.qr) assets.add(c.props.qr);
    // ⛔ MISMA MINA, MÁS GRANDE, en premium: los componentes del kit reciben rutas de asset DENTRO de
    // las props (`image`, `src`, `steps[].image`, `events[].image`). Ninguna tiene `src` en el cue, así
    // que ninguna entraba en la lista y el farm las servía 404 → EncodingError y chunk muerto.
    // planPremium las junta recorriendo el contrato (kit.json declara cuáles son de tipo `asset`).
    for (const a of r.compAssets || []) assets.add(a);
    for (const w of ventanas) assets.add(w.src);
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
