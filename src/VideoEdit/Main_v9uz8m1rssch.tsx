import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayer, AvatarWindow } from "../_fed6/VideoEdit/scenes/AvatarLayer";
import { RawShot } from "../_fed6/VideoEdit/scenes/RawShot";
import { ErrorStinger } from "../_fed6/VideoEdit/scenes/ErrorStinger";
import { GuardaEsto } from "../_fed6/VideoEdit/scenes/GuardaEsto";
import { FraseCinetica } from "../_fed6/VideoEdit/scenes/FraseCinetica";
import { renderFederer2Comp } from "../_fed6/VideoEdit/FedererComponents2";
import timeline from "./timeline_v9uz8m1rssch.json";

const TEAL = "#12B3AE";
const BG = "#0E1D23";
const FPS = timeline.fps || 30;
const AVATAR_SRC = timeline.audio_src;
const AVATAR_WAV = "v9uz8m1rssch_16k.wav";
const scenes: any[] = timeline.scenes as any[];
const secF = (s: number) => Math.round(s * FPS);

// etiqueta ES del bloque de acento por FAMILIA que emitió el director
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
// FAMILIA del director -> kind _fed6 (todos rinden bien SOLO con el título, a pantalla completa)
const KINDMAP: Record<string, string> = {
  contrast_split: "headline",
  body_signal_grid: "guardaesto",
  loop_cycle: "frasecinetica",
  daily_timeline: "guardaesto",
  mechanism_diagram: "headline",
  comparison_scale: "errorstinger",
  cause_chain: "frasecinetica",
  dose_meter: "errorstinger",
  urine_color_scale: "guardaesto",
  safety_boundary: "guardaesto",
  anatomy_callout: "headline",
  myth_vs_fact: "headline",
  med_interaction_panel: "errorstinger",
  checklist_plan: "guardaesto",
};
const WARN = new Set<string>(["med_interaction_panel", "safety_boundary"]);
const capSec = (kind: string): number =>
  kind === "guardaesto" ? 8 : kind === "errorstinger" ? 4.5 : 5;

const famOf = (layer: any): string => String(layer.family || layer.render_component || "evidence").toLowerCase();
const usableTitle = (layer: any): string => String(layer.title || "").trim();

// Componentes a renderizar: SOLO las escenas component con copy editorial. Las genéricas
// (evidence/FedHero sin título, que solo traen la nota del director) NO se dibujan: el avatar
// sigue hablando a pantalla completa (nunca se imprime la nota del director en pantalla).
type Comp = { scene: any; kind: string; durF: number };
const comps: Comp[] = [];
for (const scene of scenes) {
  const layer = scene.layers[0];
  if (layer.type !== "component") continue;
  if (!usableTitle(layer)) continue;
  const kind = KINDMAP[famOf(layer)] || "headline";
  const durF = Math.max(secF(2), Math.min(scene.duration, secF(capSec(kind))));
  comps.push({ scene, kind, durF });
}
const compByScene = new Map<any, Comp>(comps.map((c) => [c.scene, c]));

// ── CAPA 3 · ventanas del avatar ────────────────────────────────────────────
// full por defecto (arranca full: la escena 0 es avatar_full >=2s); hidden mientras un
// componente full-screen (o un b-roll) ocupa la pantalla; halfR para fotos junto al avatar.
// Tras un componente topeado más corto que su escena, el avatar VUELVE a full.
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

const renderComp = (c: Comp) => {
  const layer = c.scene.layers[0];
  const fam = famOf(layer);
  const eyebrow = EYEBROW[fam] || "DATO";
  const title = usableTitle(layer);
  const d = c.durF;
  const tone: "teal" | "warn" = WARN.has(fam) ? "warn" : "teal";
  if (c.kind === "errorstinger") {
    return <ErrorStinger durationInFrames={d} number={"✚"} title={title} eyebrow={eyebrow} tone={tone} />;
  }
  if (c.kind === "guardaesto") {
    const items = (Array.isArray(layer.items) ? layer.items : []).filter(Boolean);
    return <GuardaEsto durationInFrames={d} title={title} items={items} tag={eyebrow} />;
  }
  if (c.kind === "frasecinetica") {
    const wds = title.split(/\s+/).filter(Boolean).map((w: string) => ({ t: w }));
    return <FraseCinetica durationInFrames={d} words={wds} tone={tone} onImage={false} />;
  }
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
    {/* CAPA 4 — COMPONENTES _fed6, topeados */}
    {comps.map((c) => (
      <Sequence key={"c-" + c.scene.id} from={c.scene.from} durationInFrames={c.durF} layout="none">
        {renderComp(c)}
      </Sequence>
    ))}
  </AbsoluteFill>
);
