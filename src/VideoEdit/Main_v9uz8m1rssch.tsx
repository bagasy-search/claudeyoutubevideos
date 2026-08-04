import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayer, AvatarWindow } from "../_fed6/VideoEdit/scenes/AvatarLayer";
import { RawShot } from "../_fed6/VideoEdit/scenes/RawShot";
import { ErrorStinger } from "../_fed6/VideoEdit/scenes/ErrorStinger";
import { GuardaEsto } from "../_fed6/VideoEdit/scenes/GuardaEsto";
import { FraseCinetica } from "../_fed6/VideoEdit/scenes/FraseCinetica";
import { MitoVerdad } from "../_fed6/VideoEdit/scenes/MitoVerdad";
import { ChapterTitle, THEME_MEDICO } from "../_fed6/VideoEdit/kit/premium";
import { renderFederer2Comp } from "../_fed6/VideoEdit/FedererComponents2";
import timeline from "./timeline_v9uz8m1rssch.json";

const TEAL = "#12B3AE";
const BG = "#0E1D23";
const FPS = timeline.fps || 30;
const AVATAR_SRC = timeline.audio_src;
const AVATAR_WAV = "v9uz8m1rssch.wav";
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
// FAMILIA del director -> LISTA de kinds _fed6 REALES (round-robin por familia → variedad).
// Cada kind rinde rico SOLO con el título limpio (o datos derivados mínimos); NINGUNO
// imprime el nombre del tipo ni la instrucción del director. El primer kind de cada lista
// es el que MEJOR representa el concepto; los siguientes rotan para no colapsar la variedad.
//   headline=HookCaption · quote=PullQuote · rule=ChapterTitle · frasecinetica=FraseCinetica
//   errorstinger=ErrorStinger · guardaesto=GuardaEsto · mitoverdad=MitoVerdad
const FAM_KINDS: Record<string, string[]> = {
  contrast_split: ["headline", "quote"],
  comparison_scale: ["quote", "headline", "errorstinger"],
  mechanism_diagram: ["headline", "frasecinetica"],
  anatomy_callout: ["headline"],
  cause_chain: ["frasecinetica", "headline", "errorstinger"],
  loop_cycle: ["frasecinetica", "errorstinger"],
  daily_timeline: ["guardaesto", "frasecinetica"],
  dose_meter: ["errorstinger", "rule"],
  urine_color_scale: ["guardaesto"],
  body_signal_grid: ["guardaesto", "errorstinger"],
  safety_boundary: ["errorstinger", "guardaesto", "rule"],
  checklist_plan: ["guardaesto"],
  med_interaction_panel: ["errorstinger"],
  myth_vs_fact: ["mitoverdad", "headline"],
};
const WARN = new Set<string>(["med_interaction_panel", "safety_boundary"]);
const capSec = (kind: string): number =>
  ({ guardaesto: 8, mitoverdad: 5.5, quote: 5, headline: 5, frasecinetica: 5, rule: 4.5, errorstinger: 4.5 } as Record<string, number>)[kind] ?? 5;

const famOf = (layer: any): string => String(layer.family || layer.layout_family || layer.render_component || "evidence").toLowerCase();
const usableTitle = (layer: any): string => String(layer.title || "").trim();

// mitoverdad SOLO si el título parte limpio en mito:verdad (dos frases). Si no, headline.
const hasMythSplit = (title: string): boolean => {
  const i = title.indexOf(":");
  return i > 2 && i < title.length - 2;
};

// Componentes a renderizar: SOLO las escenas component con copy editorial. Las genéricas
// (evidence/FedHero sin título, que solo traen la nota del director) NO se dibujan: el avatar
// sigue hablando a pantalla completa (nunca se imprime la nota del director en pantalla).
// La elección de kind ROTA por familia y evita 3 iguales seguidos → cero variedad colapsada.
type Comp = { scene: any; kind: string; durF: number };
const comps: Comp[] = [];
const famCount: Record<string, number> = {};
for (const scene of scenes) {
  const layer = scene.layers[0];
  if (layer.type !== "component") continue;
  const title = usableTitle(layer);
  if (!title) continue;
  const fam = famOf(layer);
  const list = FAM_KINDS[fam] || ["headline"];
  const n = famCount[fam] = (famCount[fam] || 0);
  famCount[fam] = n + 1;
  // round-robin dentro de la familia
  let kind = list[n % list.length];
  // myth_vs_fact: MitoVerdad SOLO si el copy parte en mito:verdad; si no, headline (semántico, no round-robin)
  if (fam === "myth_vs_fact") kind = hasMythSplit(title) ? "mitoverdad" : "headline";
  // guarda anti-monotonía: nunca 3 del mismo kind seguidos (usa el siguiente de la familia)
  const lastTwo = comps.slice(-2).map((c) => c.kind);
  if (list.length > 1 && lastTwo.length === 2 && lastTwo[0] === kind && lastTwo[1] === kind) {
    kind = list[(n + 1) % list.length];
  }
  // mitoverdad requiere un título partible; si no, cae a headline
  if (kind === "mitoverdad" && !hasMythSplit(title)) kind = "headline";
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
    // La foto está topeada a ~3.6s en CAPA 2. Si la escena dura más, hay que DEVOLVER el
    // avatar a full para el resto (idéntico al branch de componente); si no, la pantalla
    // queda en negro tras la foto (avatar "hidden" + foto ya terminada = fondo BG).
    const imgDurF = Math.max(1, Math.min(scene.duration, secF(3.6)));
    pts.push({ start: s, mode: flip ? "halfR" : "hidden" });
    if (imgDurF < scene.duration) pts.push({ start: (scene.from + imgDurF) / FPS, mode: "full" });
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
  // items estructurados SOLO si el plan los trae de verdad (nunca la instrucción del director)
  const planItems = (Array.isArray(layer.items) ? layer.items : []).filter(Boolean);
  if (c.kind === "errorstinger") {
    return <ErrorStinger durationInFrames={d} number={"✚"} title={title} eyebrow={eyebrow} tone={tone} />;
  }
  if (c.kind === "guardaesto") {
    return <GuardaEsto durationInFrames={d} title={title} items={planItems} tag={eyebrow} />;
  }
  if (c.kind === "frasecinetica") {
    const wds = title.split(/\s+/).filter(Boolean).map((w: string) => ({ t: w }));
    return <FraseCinetica durationInFrames={d} words={wds} tone={tone} onImage={false} />;
  }
  if (c.kind === "mitoverdad") {
    const i = title.indexOf(":");
    const myth = title.slice(0, i).trim();
    const truth = title.slice(i + 1).trim();
    return <MitoVerdad durationInFrames={d} myth={myth} truth={truth} />;
  }
  if (c.kind === "quote") {
    return renderFederer2Comp({ kind: "quote", text: title }, d, { medico: true });
  }
  if (c.kind === "rule") {
    // tarjeta de capítulo: número romano rotado + título. sub = etiqueta ES de la familia
    // (JAMÁS el default hardcodeado de ChapterTitle ni la instrucción del director).
    const romans = ["I", "II", "III", "IV", "V", "VI"];
    const num = romans[(comps.indexOf(c)) % romans.length];
    return <ChapterTitle durationInFrames={d} theme={THEME_MEDICO} number={num} title={title} sub={eyebrow} />;
  }
  // headline (default) — HookCaption con la última palabra resaltada
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
