// build_vqrzeb6lg0ul.mjs — genera src/VideoEdit/Main_vqrzeb6lg0ul.tsx desde el plan del DIRECTOR.
// Video: "El bote de $4 que seca tu casa sin electricidad" (El Constructor Libre).
// Estructura clonada de Main_termitas.tsx: CUES[] con overlays full-screen sobre el AvatarLayer.
import fs from "fs";

const SLUG = "vqrzeb6lg0ul";
const plan = JSON.parse(fs.readFileSync(`_v3/plan_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const moments = JSON.parse(fs.readFileSync(`_v3/vqrzeb6lg0ul_moments.json`, "utf8"));
const clipsMap = JSON.parse(fs.readFileSync(`_v3/clips_${SLUG}.json`, "utf8"));

const haveImg = new Set(fs.readdirSync("public/img").filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f)).map((f) => f.replace(/\.[^.]+$/, "")));
const haveClip = new Set(
  fs.existsSync(`public/broll/${SLUG}`) ? fs.readdirSync(`public/broll/${SLUG}`).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, "")) : []
);

const TOTAL_S = 1336.6;
const TOTAL_FRAMES = Math.round(TOTAL_S * 30);

// ── helpers ────────────────────────────────────────────────────────────────
const j = (v) => JSON.stringify(v);
const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const q = (s) => `"${esc(s)}"`;
// Se sirven los JPG (56 MB en total contra 691 MB en PNG): el tarball del farm
// tiene tope de 2 GB. Los PNG originales de gpt-image quedan en disco, sin viajar.
const haveJpg = new Set(fs.readdirSync("public/img").filter((f) => f.endsWith(".jpg")).map((f) => f.replace(/\.jpg$/, "")));
const ext = (n) => (haveJpg.has(n) ? "jpg" : "png");
const img = (name, fb) => {
  if (name && haveImg.has(name)) return `img/${name}.${ext(name)}`;
  return fb ? `img/${fb}.${ext(fb)}` : null;
};
// fallback de imagen: si el director pidió una que no se generó, usa la primera disponible del video
const FALLBACK = [...haveImg].filter((n) => n.startsWith(`dg_${SLUG}_`) && !n.endsWith("_b"))[0];

const HUES = ["amber", "cold", "red", "blue"];
const TONES = ["accent", "amber", "good", "cold", "danger"];
const pick = (arr, i) => arr[i % arr.length];

// ── construcción de cues ───────────────────────────────────────────────────
const cues = [];
const avatarWindows = [];
const assets = new Set();
let prevAvatar = null;

const push = (key, start, dur, el) => cues.push({ key, start: +start.toFixed(2), dur: +dur.toFixed(2), el });

const useImg = (name) => {
  const p = img(name, FALLBACK);
  if (p) assets.add(p);
  return p;
};
const useClip = (name) => {
  if (!haveClip.has(name)) return null;
  const p = `broll/${SLUG}/${name}.mp4`;
  assets.add(p);
  return p;
};

// mapa beat → clip
const beatClip = {};
for (const c of clipsMap) beatClip[c.beat] = c.name;

plan.forEach((cue, i) => {
  const m = moments[i];
  const start = m.sec;
  const dur = m.dur;
  const key = `m${String(i).padStart(3, "0")}`;
  const hue = pick(HUES, i);
  const tone = pick(TONES, i);
  const D = "d";

  const shotPair = (base, kicker) => {
    // parte el momento en 2 tomas si existe la segunda
    const a = useImg(base);
    const b = haveImg.has(`${base}_b`) ? useImg(`${base}_b`) : null;
    if (!a) return;
    if (b && dur >= 2.6) {
      const half = dur / 2;
      push(`${key}a`, start, half, `<RawShot durationInFrames={${D}} src=${q(a)} hue=${q(hue)}${kicker ? ` kicker=${q(kicker)}` : ""} kbPhase={0} />`);
      push(`${key}b`, start + half, half, `<RawShot durationInFrames={${D}} src=${q(b)} hue=${q(hue)} kbPhase={1} />`);
    } else {
      push(key, start, dur, `<RawShot durationInFrames={${D}} src=${q(a)} hue=${q(hue)}${kicker ? ` kicker=${q(kicker)}` : ""} />`);
    }
  };

  switch (cue.kind) {
    case "avatar": {
      // consecutivos se unen abajo en `merged` — acá solo se registra la ventana
      avatarWindows.push({ start, end: start + dur });
      prevAvatar = start + dur;
      break;
    }
    case "clip": {
      const cn = beatClip[cue.name];
      const p = cn ? useClip(cn) : null;
      if (p) {
        push(key, start, dur, `<RawShot durationInFrames={${D}} src=${q(p)} hue=${q(hue)}${cue.kicker ? ` kicker=${q(cue.kicker)}` : ""} clipDur={${dur}} />`);
      } else {
        // huérfano: cayó a imagen de fix
        const fixes = [...haveImg].filter((n) => n.startsWith(`dg_${SLUG}_fix_`));
        const f = fixes[i % Math.max(1, fixes.length)];
        const p2 = useImg(f);
        if (p2) push(key, start, dur, `<RawShot durationInFrames={${D}} src=${q(p2)} hue=${q(hue)}${cue.kicker ? ` kicker=${q(cue.kicker)}` : ""} />`);
      }
      break;
    }
    case "shot":
      shotPair(cue.img, cue.kicker);
      break;
    case "photo": {
      const a = useImg(cue.img);
      const b = haveImg.has(`${cue.img}_b`) ? useImg(`${cue.img}_b`) : null;
      if (!a) break;
      if (b && dur >= 2.6) {
        const half = dur / 2;
        push(`${key}a`, start, half, `<RawShot durationInFrames={${D}} src=${q(a)} hue=${q(hue)}${cue.caption ? ` kicker=${q(cue.caption)}` : cue.kicker ? ` kicker=${q(cue.kicker)}` : ""} kbPhase={0} kbBoost={1.15} />`);
        push(`${key}b`, start + half, half, `<RawShot durationInFrames={${D}} src=${q(b)} hue=${q(hue)} kbPhase={1} />`);
      } else {
        push(key, start, dur, `<RawShot durationInFrames={${D}} src=${q(a)} hue=${q(hue)}${cue.caption ? ` kicker=${q(cue.caption)}` : ""} />`);
      }
      break;
    }
    case "impact": {
      const p = useImg(cue.img);
      if (!p) break;
      push(key, start, dur, `<ImpactReveal durationInFrames={${D}} image=${q(p)} impact=${q(cue.impact || "")}${cue.setup ? ` setup=${q(cue.setup)}` : ""} impactAccent=${q(pick(["danger", "accent", "amber"], i))} hitAt={0.5} />`);
      break;
    }
    case "callout": {
      const p = useImg(cue.img);
      if (!p) break;
      push(key, start, dur, `<CalloutMark durationInFrames={${D}} image=${q(p)} figure=${q(cue.figure || "")}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""}${cue.caption ? ` caption=${q(cue.caption)}` : ""} accent=${q(tone)} hue=${q(hue)} />`);
      break;
    }
    case "annot": {
      const p = useImg(cue.img);
      const an = (cue.annotations || []).slice(0, 3).map((a) => ({ kind: a.kind || "circle", x: +a.x || 50, y: +a.y || 50, label: a.label || undefined }));
      if (!p || !an.length) break;
      push(key, start, dur, `<AnnotatedImage durationInFrames={${D}} image=${q(p)} annotations={${j(an)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""}${cue.caption ? ` caption=${q(cue.caption)}` : ""} hue=${q(hue)} />`);
      break;
    }
    case "stat":
      push(key, start, dur, `<StatBig durationInFrames={${D}} value={${+cue.value || 0}} ${cue.prefix ? `prefix=${q(cue.prefix)} ` : ""}${cue.suffix ? `suffix=${q(cue.suffix)} ` : ""}${cue.decimals ? `decimals={${+cue.decimals}} ` : ""}label=${q(cue.label || "")}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} accent=${q(tone)} hue=${q(hue)} />`);
      break;
    case "kinetic": {
      const tk = (cue.tokens || []).map((t) => ({ t: t.t || "", ...(t.hl ? { hl: true } : {}), ...(t.danger ? { danger: true } : {}), ...(t.good ? { good: true } : {}) }));
      if (!tk.length) break;
      const bg = cue.img && haveImg.has(cue.img) ? ` bg="image" image=${q(useImg(cue.img))} imageBlur={6} imageDarken={0.55}` : "";
      push(key, start, dur, `<KineticHeadline durationInFrames={${D}} tokens={${j(tk)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} hue=${q(pick(["amber", "red", "blue"], i))}${bg} />`);
      break;
    }
    case "quote": {
      const ws = (cue.words || []).map((w) => ({ text: w.text || "", ...(w.em ? { em: true } : {}) }));
      if (!ws.length) break;
      const im = cue.img && haveImg.has(cue.img) ? ` image=${q(useImg(cue.img))} imageBlur={8} imageDarken={0.6}` : "";
      push(key, start, dur, `<KineticQuote durationInFrames={${D}} words={${j(ws)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""}${cue.cite ? ` cite=${q(cue.cite)}` : ""} accent=${q(tone)} hue=${q(hue)}${im} />`);
      break;
    }
    case "check":
    case "plist": {
      const items = (cue.items || []).slice(0, 5).map((x) => ({ text: x.text || String(x), state: x.state || "done", ...(x.note ? { note: x.note } : {}) }));
      if (!items.length) break;
      const im = cue.img && haveImg.has(cue.img) ? ` image=${q(useImg(cue.img))} imageBlur={4} imageDarken={0.6}${cue.pin ? ` pin=${q(cue.pin)}` : ""}` : "";
      push(key, start, dur, `<PhotoChecklist durationInFrames={${D}} title=${q(cue.title || "")} items={${j(items)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} accent=${q(pick(["good", "accent", "amber"], i))} hue=${q(hue)}${im} />`);
      break;
    }
    case "split": {
      const items = (cue.items || []).slice(0, 5).map(String);
      if (!items.length) break;
      push(key, start, dur, `<SplitList durationInFrames={${D}} title=${q(cue.title || "")} items={${j(items)}}${cue.cross ? " cross" : ""} />`);
      break;
    }
    case "reflist": {
      const items = (cue.items || []).slice(0, 5).map((x) => ({ text: x.text || String(x), ...(x.cross ? { cross: true } : {}) }));
      if (!items.length) break;
      push(key, start, dur, `<ReframeList durationInFrames={${D}} title=${q(cue.title || "")} items={${j(items)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} />`);
      break;
    }
    case "chips": {
      const chips = (cue.chips || []).slice(0, 7).map(String);
      if (!chips.length) break;
      const bg = cue.img && haveImg.has(cue.img) ? ` bg="image" image=${q(useImg(cue.img))} imageBlur={7} imageDarken={0.55}` : "";
      push(key, start, dur, `<ChipsCluster durationInFrames={${D}} chips={${j(chips)}}${cue.title ? ` title=${q(cue.title)}` : ""} hue=${q(pick(["amber", "red", "blue"], i))}${bg} />`);
      break;
    }
    case "bars": {
      const bars = (cue.bars || []).slice(0, 4).map((b, k) => ({
        label: b.label || "", value: +b.value || 0, display: b.display || String(b.value ?? ""),
        ...(b.sub ? { sub: b.sub } : {}), tone: TONES.includes(b.tone) ? b.tone : k === 0 ? "danger" : "good", ...(b.winner ? { winner: true } : {}),
      }));
      if (!bars.length) break;
      push(key, start, dur, `<BarCompare durationInFrames={${D}} bars={${j(bars)}}${cue.title ? ` title=${q(cue.title)}` : ""}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""}${cue.unit ? ` unit=${q(cue.unit)}` : ""} hue=${q(hue)} />`);
      break;
    }
    case "steps": {
      const st = (cue.steps || []).slice(0, 4).map((s) => {
        const im = s.img && haveImg.has(s.img) ? useImg(s.img) : null;
        return { title: s.title || "", ...(s.desc ? { desc: s.desc } : {}), ...(im ? { image: im } : {}) };
      });
      if (!st.length) break;
      push(key, start, dur, `<ProcessSteps durationInFrames={${D}} steps={${j(st)}}${cue.title ? ` title=${q(cue.title)}` : ""}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} accent=${q(tone)} hue=${q(hue)} />`);
      break;
    }
    case "cards": {
      const lines = (cue.lines || []).slice(0, 4).map(String);
      if (!lines.length) break;
      push(key, start, dur, `<TextCardReveal durationInFrames={${D}} lines={${j(lines)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} />`);
      break;
    }
    case "rule":
      push(key, start, dur, `<RuleNumberScene durationInFrames={${D}} number=${q(String(cue.number ?? ""))} title=${q(cue.title || "")}${cue.label ? ` label=${q(cue.label)}` : ""} hue=${q(pick(["amber", "red", "blue"], i))} />`);
      break;
    case "cross": {
      const layers = (cue.layers || []).slice(0, 5).map((l) => ({ label: l.label || "", color: /^#/.test(l.color || "") ? l.color : "#8a6a3f", ...(l.depth ? { depth: String(l.depth) } : {}) }));
      if (!layers.length) break;
      const mk = cue.marker ? `{{label:${q(cue.marker.label || "")},atDepth:${+cue.marker.atDepth || 0.5}}}` : "null";
      push(key, start, dur, `<CrossSection durationInFrames={${D}} layers={${j(layers)}}${cue.title ? ` title=${q(cue.title)}` : ""}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} marker={${mk === "null" ? "null" : mk.slice(1, -1)}} hue=${q(hue)} />`);
      break;
    }
    case "value": {
      const nodes = (cue.nodes || []).slice(0, 5).map((n) => ({ label: n.label || "", ...(n.sub ? { sub: n.sub } : {}), level: Math.max(0, Math.min(1, +n.level || 0.5)) }));
      if (!nodes.length) break;
      push(key, start, dur, `<ValueJourney durationInFrames={${D}} nodes={${j(nodes)}}${cue.title ? ` title=${q(cue.title)}` : ""}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""}${cue.startValue ? ` startValue=${q(cue.startValue)}` : ""}${cue.startLabel ? ` startLabel=${q(cue.startLabel)}` : ""}${cue.endValue ? ` endValue=${q(cue.endValue)}` : ""}${cue.endLabel ? ` endLabel=${q(cue.endLabel)}` : ""} accent=${q(tone)} hue=${q(hue)} />`);
      break;
    }
    case "doc": {
      const lines = (cue.lines || []).slice(0, 5).map((l) => ({ text: l.text || String(l), ...(l.mark ? { mark: true } : {}) }));
      if (!lines.length) break;
      const im = cue.img && haveImg.has(cue.img) ? ` image=${q(useImg(cue.img))}` : "";
      push(key, start, dur, `<AgedDoc durationInFrames={${D}} heading=${q(cue.heading || "")} lines={${j(lines)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} accent=${q(tone)} hue=${q(hue)}${im} />`);
      break;
    }
    case "opt": {
      const L = cue.left || {}, R = cue.right || {};
      const mk = (o, ac) => `{tag:${q(o.tag || "")},title:${q(o.title || "")},sub:${q(o.sub || "")},note:${q(o.note || "")},icon:"check",accent:${q(ac)}}`;
      push(key, start, dur, `<OptionCompare durationInFrames={${D}} left={${mk(L, "danger")}} right={${mk(R, "good")}} />`);
      break;
    }
    case "journey": {
      const wps = (cue.waypoints || []).slice(0, 5).map((w, k) => {
        const im = w.img && haveImg.has(w.img) ? useImg(w.img) : null;
        return { x: +w.x || 20 + k * 20, y: +w.y || 50, ...(im ? { image: im } : {}), ...(w.label ? { label: w.label } : {}), ...(w.sub ? { sub: w.sub } : {}), ...(w.num ? { num: String(w.num) } : {}) };
      });
      if (!wps.length) break;
      push(key, start, dur, `<JourneyCanvas durationInFrames={${D}} waypoints={${j(wps)}}${cue.title ? ` title=${q(cue.title)}` : ""}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} dark />`);
      break;
    }
    // ── variantes propias del video (HumedadKit) ──
    case "three": {
      const ms = (cue.methods || []).slice(0, 3).map((x) => ({ title: x.title || "", sub: x.sub || "", note: x.note || "" }));
      if (ms.length !== 3) break;
      push(key, start, dur, `<ThreeMethodsH durationInFrames={${D}} methods={${j(ms)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} />`);
      break;
    }
    case "safety": {
      const items = (cue.items || []).slice(0, 4).map((x) => ({ text: x.text || String(x), ok: !!x.ok }));
      if (!items.length) break;
      push(key, start, dur, `<SafetyGridH durationInFrames={${D}} items={${j(items)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} />`);
      break;
    }
    case "selcomp": {
      const g = cue.good || {}, b = cue.bad || {};
      push(key, start, dur, `<SelectiveCompareH durationInFrames={${D}} good={${j({ title: g.title || "", sub: g.sub || "" })}} bad={${j({ title: b.title || "", sub: b.sub || "" })}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} />`);
      break;
    }
    case "cost":
      push(key, start, dur, `<CostCumulativeH durationInFrames={${D}} years={${+cue.years || 5}} aLabel=${q(cue.aLabel || "")} aPerYear={${+cue.aPerYear || 0}} bLabel=${q(cue.bLabel || "")} bOnce={${+cue.bOnce || 0}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""} />`);
      break;
    case "house": {
      const zs = (cue.zones || []).slice(0, 5).map((z, k) => ({ label: z.label || "", x: +z.x || 20 + k * 18, y: +z.y || 50, hot: !!z.hot }));
      if (!zs.length) break;
      push(key, start, dur, `<HouseInspectionH durationInFrames={${D}} zones={${j(zs)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""}${cue.caption ? ` caption=${q(cue.caption)}` : ""} />`);
      break;
    }
    case "map": {
      const pins = (cue.pins || []).slice(0, 4).map((p, k) => ({ label: p.label || "", sub: p.sub || "", x: +p.x || 25 + k * 20, y: +p.y || 45 }));
      if (!pins.length) break;
      push(key, start, dur, `<WorldMapPinsH durationInFrames={${D}} pins={${j(pins)}}${cue.eyebrow ? ` eyebrow=${q(cue.eyebrow)}` : ""}${cue.caption ? ` caption=${q(cue.caption)}` : ""} />`);
      break;
    }
    default:
      break;
  }
});

// ── ventanas del avatar ────────────────────────────────────────────────────
// El avatar está HIDDEN exactamente mientras hay un overlay tapando la pantalla,
// y FULL en todo el resto. Así nunca queda un hueco en negro: si un momento no
// generó cue (o el director lo marcó `avatar`), se ve al presentador hablando.
const cover = cues.map((c) => ({ start: c.start, end: c.start + c.dur })).sort((a, b) => a.start - b.start);
const merged = [];
for (const w of cover) {
  const last = merged[merged.length - 1];
  if (last && w.start - last.end < 0.25) last.end = Math.max(last.end, w.end);
  else merged.push({ ...w });
}
const windows = [{ start: 0, mode: "full" }];
for (const w of merged) {
  if (w.start > 0.02) windows.push({ start: +w.start.toFixed(2), mode: "hidden" });
  windows.push({ start: +w.end.toFixed(2), mode: "full" });
}
const winClean = [];
for (const w of windows.sort((a, b) => a.start - b.start)) {
  const last = winClean[winClean.length - 1];
  if (last && Math.abs(last.start - w.start) < 0.02) { winClean[winClean.length - 1] = w; continue; }
  if (last && last.mode === w.mode) continue;
  winClean.push(w);
}
const fullSpans = [];
for (let k = 0; k < winClean.length; k++) {
  if (winClean[k].mode !== "full") continue;
  fullSpans.push({ start: winClean[k].start, end: winClean[k + 1] ? winClean[k + 1].start : TOTAL_S });
}

// ── emitir el TSX ──────────────────────────────────────────────────────────
cues.sort((a, b) => a.start - b.start);
const cueLines = cues.map((c) => `  { key: "${c.key}", start: ${c.start}, dur: ${c.dur}, el: (d: number) => ${c.el.replace(/\{d\}/g, "{d}")} },`).join("\n");

const tsx = `import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { StatBig } from "./scenes/StatBig";
import { ReframeList, ChipsCluster } from "./scenes/ReframeContent";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { KineticQuote } from "./scenes/KineticQuote";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { CalloutMark } from "./scenes/CalloutMark";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { SplitList } from "./scenes/SplitList";
import { BarCompare } from "./scenes/BarCompare";
import { OptionCompare } from "./scenes/OptionCompare";
import { ValueJourney } from "./scenes/ValueJourney";
import { CrossSection } from "./scenes/CrossSection";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { AgedDoc } from "./scenes/AgedDoc";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { Checklist as PhotoChecklist } from "./scenes/Checklist";
import { RawShot } from "./scenes/RawShot";
import { AvatarLayer } from "./scenes/AvatarLayer";
import {
  ThreeMethodsH,
  SafetyGridH,
  SelectiveCompareH,
  CostCumulativeH,
  HouseInspectionH,
  WorldMapPinsH,
} from "./scenes/HumedadKit_vqrzeb6lg0ul";

// GENERADO por build_vqrzeb6lg0ul.mjs — no editar a mano.
// "El bote de $4 que seca tu casa sin electricidad" · El Constructor Libre · ${(TOTAL_S / 60).toFixed(1)} min.
export const TOTAL_FRAMES_VQR = ${TOTAL_FRAMES};

const AVATAR_WINDOWS: { start: number; mode: "full" | "hidden" }[] = ${JSON.stringify(winClean)};

type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

const CUES: Cue[] = [
${cueLines}
];

export const MainVqr: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#120f0b" }}>
      <TechBackground hue="amber" />
      <AvatarLayer src="${SLUG}_opt.mp4" wav="${SLUG}.wav" windows={AVATAR_WINDOWS} />
      {CUES.map((c) => {
        const from = Math.round(sec(c.start));
        const d = Math.max(6, Math.round(sec(c.dur)));
        return (
          <Sequence key={c.key} from={from} durationInFrames={d} layout="none">
            {c.el(d)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
`;

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, tsx);

const entry = `import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVqr, TOTAL_FRAMES_VQR } from "./VideoEdit/Main_${SLUG}";

// Entry AISLADO — solo la composición "Humedad4" (El Constructor Libre · bote de $4).
const RootVqr: React.FC = () => (
  <>
    <Composition id="Humedad4" component={MainVqr} durationInFrames={TOTAL_FRAMES_VQR} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootVqr);
`;
fs.writeFileSync(`src/index_${SLUG}.tsx`, entry);

// lista de assets para el farm (rutas relativas a public/)
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].sort().join("\n") + "\n");

const byKind = {};
plan.forEach((c) => (byKind[c.kind] = (byKind[c.kind] || 0) + 1));
const nImg = [...assets].filter((a) => a.startsWith("img/")).length;
const nClip = [...assets].filter((a) => a.startsWith("broll/")).length;
console.log(`CUES: ${cues.length} | ventanas avatar: ${winClean.length} | assets: ${assets.size} (img ${nImg}, clips ${nClip})`);
console.log(`TOTAL_FRAMES: ${TOTAL_FRAMES} (${TOTAL_S}s)`);
console.log(`plan por kind:`, JSON.stringify(byKind));
const fullS = fullSpans.reduce((a, w) => a + (w.end - w.start), 0);
console.log(`avatar full: ${fullS.toFixed(0)}s de ${TOTAL_S}s (${((fullS / TOTAL_S) * 100).toFixed(0)}%) | primer hidden en ${winClean.find((w) => w.mode === "hidden")?.start}s`);
