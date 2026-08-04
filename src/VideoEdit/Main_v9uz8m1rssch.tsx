import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayer, AvatarWindow } from "../_fed6/VideoEdit/scenes/AvatarLayer";
import { RawShot } from "../_fed6/VideoEdit/scenes/RawShot";
import { ErrorStinger } from "../_fed6/VideoEdit/scenes/ErrorStinger";
import { GuardaEsto } from "../_fed6/VideoEdit/scenes/GuardaEsto";
import { FraseCinetica } from "../_fed6/VideoEdit/scenes/FraseCinetica";
import { MitoVerdad } from "../_fed6/VideoEdit/scenes/MitoVerdad";
import { renderFederer2Comp } from "../_fed6/VideoEdit/FedererComponents2";
import timeline from "./timeline_v9uz8m1rssch.json";

const TEAL = "#12B3AE";
const BG = "#0E1D23";
const FPS = timeline.fps || 30;
const AVATAR_SRC = timeline.audio_src;
const AVATAR_WAV = "v9uz8m1rssch.wav";
const scenes: any[] = timeline.scenes as any[];
const secF = (s: number) => Math.round(s * FPS);

// Pool de láminas gpt-image temáticas (agua/hidratación/circulación/libido +60).
// Rutas CRUDAS (Media/sf resuelve staticFile), round-robin para los explainers con imagen.
const IMG_POOL: string[] = Array.from({ length: 18 }, (_, i) =>
  `img/v9uz8m1rssch_image_${String(i + 1).padStart(3, "0")}.png`
);

// Etiqueta ES del bloque de acento por FAMILIA del director.
const EYEBROW: Record<string, string> = {
  contrast_split: "EN CONTRASTE",
  body_signal_grid: "SEÑALES DEL CUERPO",
  loop_cycle: "EL CICLO",
  daily_timeline: "EN EL DÍA",
  mechanism_diagram: "CÓMO FUNCIONA",
  comparison_scale: "COMPARACIÓN",
  cause_chain: "CAUSA Y EFECTO",
  dose_meter: "LA DOSIS",
  urine_color_scale: "SEÑAL DE COLOR",
  safety_boundary: "CUIDADO",
  anatomy_callout: "EN EL CUERPO",
  myth_vs_fact: "MITO O VERDAD",
  med_interaction_panel: "INTERACCIÓN",
  checklist_plan: "TU PLAN",
  evidence: "DATO",
};

// FAMILIA del director -> KIND _fed6 REAL (explainer temático data-driven, NO tarjeta de texto).
// 10 familias distintas de kind; ninguna >25% de los beats de componente.
const FAM2KIND: Record<string, string> = {
  mechanism_diagram: "process",      // NumberedSteps: agua -> volumen -> flujo -> firmeza
  daily_timeline: "process",         // NumberedSteps con horarios del día
  cause_chain: "ingredients",        // FlowSteps: deshidratación -> ... -> menos respuesta
  loop_cycle: "splitlist",           // BulletCascade: el ciclo que se retroalimenta
  comparison_scale: "chips",         // SplitPanel: deshidratado vs hidratado + lámina
  contrast_split: "chips",           // SplitPanel: el freno vs el alivio + lámina
  dose_meter: "stat",                // BigStatReveal: los vasos por día
  urine_color_scale: "annotated",    // CutawayCallouts sobre lámina de escala de color
  anatomy_callout: "callout",        // CalloutMark sobre lámina anatómica
  body_signal_grid: "checklist",     // ChecklistReveal: señales de deshidratación
  checklist_plan: "checklist",       // ChecklistReveal: el plan diario
  safety_boundary: "errorstinger",   // ErrorStinger (warn): el límite de seguridad
  med_interaction_panel: "errorstinger",
  myth_vs_fact: "mitoverdad",        // MitoVerdad (si el título parte mito:verdad)
};
const WARN = new Set<string>(["med_interaction_panel", "safety_boundary"]);
const capSec: Record<string, number> = {
  process: 6.5, ingredients: 6.5, splitlist: 5, chips: 5.5, stat: 5, annotated: 6,
  callout: 5, checklist: 6, mitoverdad: 5.5, errorstinger: 4.5, headline: 5,
};

const famOf = (layer: any): string =>
  String(layer.family || layer.layout_family || layer.render_component || "evidence").toLowerCase();
const usableTitle = (layer: any): string => String(layer.title || "").trim();
const hasMythSplit = (title: string): boolean => {
  const i = title.indexOf(":");
  return i > 2 && i < title.length - 2;
};
const firstNum = (t: string): number => {
  const m = t.match(/(\d+)/);
  return m ? Math.min(20, Math.max(1, parseInt(m[1], 10))) : 8;
};

// Andamiajes HONESTOS y temáticos (agua/hidratación/circulación/libido +60). Cada uno
// es genérico-pero-verdadero para la familia; el TÍTULO del beat (narration_match) se
// preserva como encabezado. Se rotan variantes en las familias con muchos beats.
const MECH_STEPS = [
  [{ title: "Bebés agua" }, { title: "Sube el volumen de sangre" }, { title: "Mejora la circulación" }, { title: "Respuesta más firme" }],
  [{ title: "Cuerpo hidratado" }, { title: "Vasos más flexibles" }, { title: "Más óxido nítrico" }, { title: "Mejor erección" }],
];
const DAY_STEPS = [
  [{ title: "Al despertar", desc: "1 vaso" }, { title: "Media mañana", desc: "1 vaso" }, { title: "Tarde", desc: "1–2 vasos" }, { title: "Con la cena", desc: "1 vaso" }],
];
const CAUSE_NODES = [
  [{ name: "Deshidratación" }, { name: "Sangre más espesa" }, { name: "Menos flujo" }, { name: "Menos firmeza" }],
  [{ name: "Falta de agua" }, { name: "Presión más baja" }, { name: "Vasos estrechos" }, { name: "Menos rigidez" }],
  [{ name: "Poca agua" }, { name: "Más fatiga" }, { name: "Menos deseo" }, { name: "Menos respuesta" }],
];
const SIGNAL_ITEMS = ["Sed frecuente", "Orina oscura", "Fatiga sin causa", "Boca seca"];
const PLAN_ITEMS = ["Vaso al despertar", "Agua en cada comida", "Menos alcohol", "Cortar cafeína de noche"];

type Comp = { scene: any; fam: string; kind: string; durF: number; idx: number };
const comps: Comp[] = [];
let compIdx = 0;
for (const scene of scenes) {
  const layer = scene.layers[0];
  if (layer.type !== "component") continue;
  const title = usableTitle(layer);
  if (!title) continue;
  const fam = famOf(layer);
  let kind = FAM2KIND[fam] || "headline";
  if (kind === "mitoverdad" && !hasMythSplit(title)) kind = "headline";
  const cap = capSec[kind] ?? 5;
  const durF = Math.max(secF(2.6), Math.min(scene.duration, secF(cap)));
  comps.push({ scene, fam, kind, durF, idx: compIdx++ });
}
const compByScene = new Map<any, Comp>(comps.map((c) => [c.scene, c]));
const imgFor = (i: number) => IMG_POOL[i % IMG_POOL.length];

// ── CAPA 3 · ventanas del avatar ──────────────────────────────────────────────
const pts: { start: number; mode: AvatarWindow["mode"] }[] = [{ start: 0, mode: "full" }];
let flip = false;
for (const scene of scenes) {
  const layer = scene.layers[0];
  const s = scene.from / FPS;
  if (layer.type === "avatar") {
    pts.push({ start: s, mode: "full" });
  } else if (layer.type === "component") {
    const c = compByScene.get(scene);
    if (c) {
      pts.push({ start: s, mode: "hidden" });
      if (c.durF < scene.duration) pts.push({ start: (scene.from + c.durF) / FPS, mode: "full" });
    } else {
      pts.push({ start: s, mode: "full" });
    }
  } else if (layer.type === "image") {
    pts.push({ start: s, mode: flip ? "halfR" : "hidden" });
    flip = !flip;
  } else {
    pts.push({ start: s, mode: "hidden" });
  }
}
pts.sort((a, b) => a.start - b.start);
const AVATAR_WINDOWS: AvatarWindow[] = [];
for (const p of pts) {
  if (!AVATAR_WINDOWS.length || AVATAR_WINDOWS[AVATAR_WINDOWS.length - 1].mode !== p.mode) {
    AVATAR_WINDOWS.push({ start: p.start, mode: p.mode });
  }
}
if (AVATAR_WINDOWS[0].start > 0) AVATAR_WINDOWS.unshift({ start: 0, mode: "full" });

// tramos halfR (para confinar la foto a la mitad izquierda pegada al avatar)
const HALFR: [number, number][] = [];
for (let i = 0; i < AVATAR_WINDOWS.length; i++) {
  if (AVATAR_WINDOWS[i].mode === "halfR") {
    const s = AVATAR_WINDOWS[i].start;
    const e = i + 1 < AVATAR_WINDOWS.length ? AVATAR_WINDOWS[i + 1].start : timeline.duration_in_frames / FPS;
    HALFR.push([s, e]);
  }
}
const inHalfR = (t: number) => HALFR.some(([s, e]) => t >= s - 0.05 && t < e - 0.1);
const HalfLeft = ({ children }: { children: any }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden", background: BG }}>{children}</div>
);

// CAPA 4 — cada familia dibuja un EXPLAINER temático REAL (data-driven), no una tarjeta de texto.
const renderComp = (c: Comp) => {
  const layer = c.scene.layers[0];
  const fam = c.fam;
  const eyebrow = EYEBROW[fam] || "DATO";
  const title = usableTitle(layer);
  const d = c.durF;
  const tone: "teal" | "warn" = WARN.has(fam) ? "warn" : "teal";

  if (c.kind === "process") {
    const steps = fam === "daily_timeline" ? DAY_STEPS[0] : MECH_STEPS[c.idx % MECH_STEPS.length];
    return renderFederer2Comp({ kind: "process", eyebrow, title, steps }, d, { medico: true });
  }
  if (c.kind === "ingredients") {
    const items = CAUSE_NODES[c.idx % CAUSE_NODES.length];
    return renderFederer2Comp({ kind: "ingredients", title, items }, d, { medico: true });
  }
  if (c.kind === "splitlist") {
    const items = ["Poca agua, peor circulación", "Peor circulación, menos energía", "Menos energía, menos deseo"];
    return renderFederer2Comp({ kind: "splitlist", title, items }, d, { medico: true });
  }
  if (c.kind === "chips") {
    const bullets = fam === "comparison_scale"
      ? ["Deshidratado: flujo lento", "Hidratado: flujo pleno"]
      : ["El freno: deshidratación", "El alivio: agua a tiempo"];
    return renderFederer2Comp({ kind: "chips", title, image: imgFor(c.idx), chips: bullets }, d, { medico: true });
  }
  if (c.kind === "stat") {
    return renderFederer2Comp({ kind: "stat", eyebrow, value: firstNum(title), suffix: " vasos", label: title }, d, { medico: true });
  }
  if (c.kind === "annotated") {
    const annotations = [
      { label: "Claro: bien hidratado", x: 30, y: 30 },
      { label: "Amarillo: bebé más", x: 55, y: 55 },
      { label: "Oscuro: alerta", x: 74, y: 78 },
    ];
    return renderFederer2Comp({ kind: "annotated", eyebrow, caption: title, image: imgFor(c.idx), annotations }, d, { medico: true });
  }
  if (c.kind === "callout") {
    return renderFederer2Comp({ kind: "callout", figure: "", caption: title, image: imgFor(c.idx), eyebrow }, d, { medico: true });
  }
  if (c.kind === "checklist") {
    const items = fam === "body_signal_grid" ? SIGNAL_ITEMS : PLAN_ITEMS;
    return renderFederer2Comp({ kind: "checklist", title, items }, d, { medico: true });
  }
  if (c.kind === "mitoverdad") {
    const i = title.indexOf(":");
    return <MitoVerdad durationInFrames={d} myth={title.slice(0, i).trim()} truth={title.slice(i + 1).trim()} />;
  }
  if (c.kind === "errorstinger") {
    return <ErrorStinger durationInFrames={d} number={"✚"} title={title} eyebrow={eyebrow} tone={tone} />;
  }
  // headline (fallback) — HookCaption con la última palabra resaltada
  const toks = title.split(/\s+/).filter(Boolean);
  const beat = { kind: "headline", tokens: toks.map((t: string, i: number) => ({ t, hl: i === toks.length - 1 })), eyebrow };
  return renderFederer2Comp(beat, d, { medico: true });
};

export const BagasyTimeline_v9uz8m1rssch = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    {/* CAPA 1 — B-ROLL continuo (video) con solape */}
    {scenes.filter((s) => s.layers[0].type === "video").map((s) => {
      const dd = Math.max(1, s.duration + 3);
      return (
        <Sequence key={"bv-" + s.id} from={s.from} durationInFrames={dd} premountFor={30}>
          <RawShot durationInFrames={dd} src={s.layers[0].src} hue="cold" />
        </Sequence>
      );
    })}
    {/* CAPA 2 — FOTOS topeadas (~3.6s) */}
    {scenes.filter((s) => s.layers[0].type === "image").map((s) => {
      const d = Math.max(1, Math.min(s.duration, secF(3.6)));
      const half = inHalfR(s.from / FPS);
      const shot = <RawShot durationInFrames={d} src={s.layers[0].src} hue="cold" />;
      return (
        <Sequence key={"ph-" + s.id} from={s.from} durationInFrames={d} premountFor={20}>
          {half ? <HalfLeft>{shot}</HalfLeft> : shot}
        </Sequence>
      );
    })}
    {/* CAPA 3 — AVATAR (full / hidden / halfR, cero recuadro) */}
    <AvatarLayer src={AVATAR_SRC} windows={AVATAR_WINDOWS} accent={TEAL} wav={AVATAR_WAV} />
    {/* CAPA 4 — EXPLAINERS temáticos _fed6, topeados */}
    {comps.map((c) => (
      <Sequence key={"c-" + c.scene.id} from={c.scene.from} durationInFrames={c.durF} layout="none">
        {renderComp(c)}
      </Sequence>
    ))}
  </AbsoluteFill>
);
