import {
  AbsoluteFill,
  Sequence,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { DocNameCard } from "./scenes/DocNameCard";
import { RawShot } from "./scenes/RawShot";
import { F_INTER } from "./kit/premium/theme";
import { HOOKS, TALKS } from "./federer_hooks";
import { FED_BEATS } from "./federer_beats";
import { FED_BROLL } from "./federer_broll";
import { renderFedererComp, COMP_KINDS } from "./FedererComponents";
import { Pizarra } from "./scenes/Pizarra";
import { EmphasisMoment } from "./scenes/EmphasisMoment";
import { Endcard } from "./scenes/Endcard";

// frases de énfasis: avatar a pantalla completa + frase grande (seg globales)
const EMPHASIS = [
  { from: 243.2, to: 245.6, text: "Piénsalo" },
  { from: 365.5, to: 368.2, text: "Escúchame bien" },
  { from: 418.6, to: 421.2, text: "A los 80" },
  { from: 448.1, to: 451.2, text: "Empieza hoy" },
];

// componentes que se pueden AGRUPAR en una pizarra persistente cuando van seguidos
const PANELABLE = new Set(["headline", "checklist", "process", "splitlist", "chips", "stat", "ingredients", "quote", "annotated"]);
const strp = (s?: string) => (s || "").replace(/\*/g, "");

// convierte un beat de componente en una ESTACIÓN de la pizarra
function beatToSlide(b: any): any {
  switch (b.kind) {
    case "headline": return { kind: "phrase", eyebrow: b.eyebrow, heading: (b.tokens || []).map((t: any) => t.t).join(" ") };
    case "checklist": return { kind: "checklist", heading: b.title, items: (b.items || []).map((i: any) => (typeof i === "string" ? i : i.text)) };
    case "splitlist": return { kind: "bullets", heading: b.title, items: b.items || [] };
    case "chips": return { kind: "bullets", heading: b.title, items: b.chips || [] };
    case "process": return { kind: "steps", eyebrow: b.eyebrow, heading: b.title, steps: (b.steps || []).map((s: any) => ({ title: s.title, sub: s.desc, image: s.image })) };
    case "ingredients": return { kind: "steps", heading: b.title, steps: (b.items || []).map((i: any) => ({ title: i.name, sub: i.amount, image: i.image })) };
    case "stat": return { kind: "stat", eyebrow: b.eyebrow, value: b.value, prefix: b.prefix, suffix: b.suffix, label: b.label };
    case "quote": return { kind: "imgtext", image: b.image, body: strp(b.text) };
    case "annotated": return { kind: "imgtext", eyebrow: b.eyebrow, image: b.image, body: b.caption };
    default: return { kind: "phrase", heading: b.title || "" };
  }
}

// agrupa los beats de componentes en RUNS: panelables contiguos → una pizarra
function buildRuns(beats: any[]): any[][] {
  const sorted = [...beats].sort((a, b) => a.start - b.start);
  const runs: any[][] = [];
  let cur: any[] = [];
  for (const b of sorted) {
    const last = cur[cur.length - 1];
    const contiguous = last && b.start - (last.start + last.dur) < 1.4;
    if (cur.length && PANELABLE.has(b.kind) && PANELABLE.has(last.kind) && contiguous) cur.push(b);
    else { if (cur.length) runs.push(cur); cur = [b]; }
  }
  if (cur.length) runs.push(cur);
  return runs;
}

// ── CANAL "Dr. Federer" · Video 1 · ROMERO ──────────────────────────────────
// 3 capas: (1) B-ROLL DENSO real cada ~3s (stock, anclado por frase) · (2) AVATAR
// (full/PiP quieto/oculto) · (3) COMPONENTES premium Fable 5 (glassmórficos MEDICO)
// SIEMPRE por encima. Hook: FARMACIA (coral) → tarjeta glass → ROMERO (teal)+ramita.
const TEAL = "#12B3AE";
const CORAL = "#E0523E";
const BG = "#0E1D23";

const compBeats = FED_BEATS.filter((b: any) => COMP_KINDS.has(b.kind));
const lastBroll = FED_BROLL[FED_BROLL.length - 1];
const VIDEO_END = Math.max(lastBroll.start + lastBroll.dur, ...compBeats.map((b: any) => b.start + b.dur)) + 1.2;
export const TOTAL_FRAMES_FED = Math.round(VIDEO_END * 30);

// componentes que ocultan el avatar (gráfico manda) vs los que lo dejan en PiP
const HIDE = new Set(["diagram", "headline", "rule", "stat", "checklist", "splitlist", "annotated", "ingredients", "nametag", "blurexplainer", "pizarra"]);

// ── ventanas del avatar ──────────────────────────────────────────────────────
// full en TALKS · hidden en componentes gráficos · cornerTR (quieto) sobre b-roll
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  // b-roll → avatar PiP quieto en la esquina
  for (const b of FED_BROLL) pts.push({ start: b.start, mode: "cornerTR", pr: 0 });
  // componentes gráficos → avatar oculto
  for (const b of compBeats) if (HIDE.has(b.kind)) pts.push({ start: b.start, mode: "hidden", pr: 1 });
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);

  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  const talkAt = (s: number) => TALKS.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  // asegurar full al inicio de cada talk
  for (const t of TALKS) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "cornerTR" }); }
  w.sort((a, b) => a.start - b.start);
  // colapsar duplicados de modo consecutivos
  const out: AvatarWindow[] = [];
  for (const x of w) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

// ── ramita de romero que entra en el reveal "ROMERO" ────────────────────────
const RomeroFloat: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.8, stiffness: 120 } });
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rot = interpolate(enter, [0, 1], [-14, -4]);
  const sc = interpolate(enter, [0, 1], [0.7, 1]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img src={staticFile("img/romero.png")} style={{ position: "absolute", top: "12%", left: "50%", width: 760, transform: `translateX(-50%) rotate(${rot}deg) scale(${sc})`, opacity: Math.min(enter, out) * 0.96, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.55))" }} />
    </AbsoluteFill>
  );
};

export const MainFederer: React.FC = () => {
  const farmDur = HOOKS.federer - 0.2 - (HOOKS.farmacia - 2.4);
  const cardDur = 22.0 - HOOKS.federer;
  const romDur = 2.6;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO (footage real cada ~3s, anclado por frase) */}
      {FED_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" />
        </Sequence>
      ))}

      {/* CAPA 2 — AVATAR: PiP quieto sobre b-roll, full al hablar, oculto en gráficos */}
      <AvatarLayer src="federer_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 3 — COMPONENTES: runs de panelables consecutivos → UNA pizarra persistente
          (el recuadro se mantiene, el contenido se transforma). Singles/no-panelables → normal. */}
      {buildRuns(compBeats).map((run, ri) => {
        const start = run[0].start;
        const end = run[run.length - 1].start + run[run.length - 1].dur;
        const dur = Math.max(1, sec(end - start));
        if (run.length >= 2 && PANELABLE.has(run[0].kind)) {
          const slides = run.map((b) => ({ ...beatToSlide(b), dur: Math.max(1, b.dur) }));
          return (
            <Sequence key={`run_${ri}`} from={sec(start)} durationInFrames={dur} layout="none">
              <Pizarra durationInFrames={dur} slides={slides} />
            </Sequence>
          );
        }
        return run.map((b: any, i: number) => (
          <Sequence key={`comp_${b.id || ri + "_" + i}`} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
            {renderFedererComp(b, Math.max(1, sec(b.dur)))}
          </Sequence>
        ));
      })}

      {/* HOOK #1 — "…en contra de la FARMACIA" */}
      <Sequence from={sec(HOOKS.farmacia - 2.4)} durationInFrames={sec(Math.max(2, farmDur))} layout="none">
        <AvatarScrimText durationInFrames={sec(Math.max(2, farmDur))} setup="Va en contra de lo que te venden en la" impact="FARMACIA" accentColor={CORAL} font={F_INTER} fontSize={150} />
      </Sequence>

      {/* HOOK #2 — tarjeta glassmórfica de presentación */}
      <Sequence from={sec(HOOKS.federer)} durationInFrames={sec(Math.max(2, cardDur))} layout="none">
        <DocNameCard durationInFrames={sec(Math.max(2, cardDur))} name="Dr. Federer" role="Médico · 20 años de consultorio" />
      </Sequence>

      {/* HOOK #3 — reveal "ROMERO" + ramita */}
      <Sequence from={sec(HOOKS.romero - 0.5)} durationInFrames={sec(romDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(romDur)} impact="ROMERO" accentColor={TEAL} font={F_INTER} fontSize={190} />
        <RomeroFloat durationInFrames={sec(romDur)} />
      </Sequence>

      {/* MOMENTOS DE ÉNFASIS — avatar full + frase grande (encima de todo) */}
      {EMPHASIS.map((e, i) => (
        <Sequence key={`emph_${i}`} from={sec(e.from)} durationInFrames={sec(e.to - e.from)} layout="none">
          <EmphasisMoment durationInFrames={sec(e.to - e.from)} avatarFromSec={e.from} text={e.text} />
        </Sequence>
      ))}

      {/* ENDCARD de cierre (CTA suscripción) */}
      <Sequence from={sec(472)} durationInFrames={sec(Math.max(2, VIDEO_END - 472))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - 472))} />
      </Sequence>
    </AbsoluteFill>
  );
};
