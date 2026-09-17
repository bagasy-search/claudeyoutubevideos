/**
 * Main_tfbesponjas — El Constructor Libre · "NUNCA MÁS las Tires: las Esponjas Usadas Valen ORO en tus Plantas"
 * Motor valvasmix (cada cue cubre su tramo, build garantiza cobertura) + kit TALLER (rowe rebrandeado + TallerKit).
 * Audio: UN <Audio> con el máster (Fish) + SFX. Todo video muteado. Beats en ./cues_tfbesponjas.gen
 */
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, Clip, Foto, AvatarWin } from "./RayStage";
import { BigStat } from "./BigStat";
import { CheckCard } from "./CheckCard";
import { MythTruth } from "./MythTruth";
import { ProcessChips } from "./ProcessChips";
import { PullQuote } from "./PullQuote";
import { RayChecklist } from "./RayChecklist";
import { RedFlags } from "./RedFlags";
import { RouteFlow } from "./RouteFlow";
import { RoutineSwap } from "./RoutineSwap";
import { SelfCheck } from "./SelfCheck";
import { SplitVs } from "./SplitVs";
import { VetSenal } from "./VetSenal";
import { WorstSpots } from "./WorstSpots";
import { FraseTaller, EtiquetaFicha, SelloGancho, CapituloTaller, MacetaCorte, ReglaMedidas, ErrorCorrecto, ZoomCirculo, LaminaTour, GuiaCta } from "./TallerKit";
import { BEATS, OVERLAYS, SFX, TOTAL_FRAMES_TFBESP } from "./cues_tfbesponjas.gen";

// agnes: el clip (4 s) dura menos que el plano → resto = ÚLTIMO CUADRO del clip, bajo la MISMA curva Ken-Burns
const ClipOrStill: React.FC<{ cue: any; df: number }> = ({ cue, df }) => {
  const f = useCurrentFrame();
  if (!(cue.frames && cue.still && cue.frames < df)) return <Clip src={cue.src} seed={cue.seed} />;
  const n = Math.max(2, df);
  const h = (salt: number) => { let x = Math.imul((cue.seed | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(salt + 1, 0xc2b2ae35); x = Math.imul(x ^ (x >>> 13), 0x27d4eb2d); x ^= x >>> 15; return (x >>> 0) / 4294967296; };
  const acerca = h(11) < 0.5;
  const amp = Math.min(0.1, (0.01 + h(12) * 0.012) * (n / 30));
  const k = interpolate(f, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = acerca ? 1.03 + amp * k : 1.03 + amp * (1 - k);
  const ox = 40 + h(13) * 20, oy = 40 + h(14) * 20;
  const st: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ background: V.ink0, overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`, transform: `scale(${z.toFixed(4)})` }}>
        {f < cue.frames - 1 ? <OffthreadVideo src={staticFile(cue.src)} muted style={st} /> : <Img src={staticFile(cue.still)} style={st} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Base: React.FC<{ cue: any; df: number }> = ({ cue: c, df }) => {
  const d = df;
  switch (c.kind) {
    case "avatar": return <AvatarWin src={c.src} />;
    case "clip": return <ClipOrStill cue={c} df={df} />;
    case "foto": return <Foto src={c.src} seed={c.seed} />;
    case "sello": return <SelloGancho durationInFrames={d} line1={c.line1} line2={c.line2} bed={c.bed} />;
    case "capitulo": return <CapituloTaller durationInFrames={d} n={c.n} kicker={c.kicker} title={c.title} bed={c.bed} />;
    case "zoom": return <ZoomCirculo durationInFrames={d} image={c.image} x={c.x} y={c.y} label={c.label} />;
    case "maceta": return <MacetaCorte durationInFrames={d} mode={c.mode} kicker={c.kicker} title={c.title} labels={c.labels} bed={c.bed} hitAt={c.hitAt} />;
    case "split": return <SplitVs durationInFrames={d} leftLabel={c.leftLabel} leftValue={c.leftValue} rightLabel={c.rightLabel} rightValue={c.rightValue} verdict={c.verdict} leftImage={c.leftImage} rightImage={c.rightImage} />;
    case "chips": return <ProcessChips durationInFrames={d} kicker={c.kicker} title={c.title} steps={c.steps} bed={c.bed} />;
    case "route": return <RouteFlow durationInFrames={d} kicker={c.kicker} title={c.title} steps={c.steps} bed={c.bed} />;
    case "quote": return <PullQuote durationInFrames={d} quote={c.quote} attrib={c.attrib} bed={c.bed} />;
    case "checkcard": return <CheckCard durationInFrames={d} kicker={c.kicker} title={c.title} items={c.items} bed={c.bed} />;
    case "checklist": return <RayChecklist durationInFrames={d} kicker={c.kicker} title={c.title} items={c.items} bed={c.bed} />;
    case "myth": return <MythTruth durationInFrames={d} kicker={c.kicker} myth={c.myth} truth={c.truth} mythImg={c.mythImg} truthImg={c.truthImg} bed={c.bed} hitAt={c.hitAt} truthAt={c.truthAt} />;
    case "flags": return <RedFlags durationInFrames={d} kicker={c.kicker} img={c.img} bed={c.bed} flags={c.flags} stamp={c.stamp} stampAt={c.stampAt} />;
    case "swap": return <RoutineSwap durationInFrames={d} mode={c.mode} kicker={c.kicker} title={c.title} items={c.items} chip={c.chip} chipAt={c.chipAt} bed={c.bed} />;
    case "selfcheck": return <SelfCheck durationInFrames={d} kicker={c.kicker} questions={c.questions} bed={c.bed} />;
    case "spots": return <WorstSpots durationInFrames={d} kicker={c.kicker} title={c.title} spots={c.spots} bed={c.bed} />;
    case "bigstat": return <BigStat durationInFrames={d} value={c.value} unit={c.unit} caption={c.caption} tone={c.tone} bed={c.bed} />;
    case "regla": return <ReglaMedidas durationInFrames={d} kicker={c.kicker} title={c.title} rows={c.rows} bed={c.bed} />;
    case "errok": return <ErrorCorrecto durationInFrames={d} kicker={c.kicker} malLabel={c.malLabel} bienLabel={c.bienLabel} malImg={c.malImg} bienImg={c.bienImg} flipAt={c.flipAt} />;
    case "lamina": return <LaminaTour durationInFrames={d} src={c.src} points={c.points} />;
    case "cta": return <GuiaCta durationInFrames={d} kicker={c.kicker} title={c.title} items={c.items} portada={c.portada} peeks={c.peeks} qr={c.qr} domain={c.domain} bed={c.bed} />;
    default: return null;
  }
};

const Over: React.FC<{ cue: any; df: number }> = ({ cue: c, df }) => {
  switch (c.kind) {
    case "frase": return <FraseTaller durationInFrames={df} kicker={c.kicker} title={c.title} hot={c.hot} />;
    case "etiqueta": return <EtiquetaFicha durationInFrames={df} label={c.label} value={c.value} />;
    case "senal": return <VetSenal durationInFrames={df} n={c.n} title={c.title} />;
    default: return null;
  }
};

export const MainTfbesponjas: React.FC = () => {
  const { fps } = useVideoConfig();
  const seq = (cue: any, el: (df: number) => React.ReactNode, pre = 20) => {
    const from = Math.round(cue.start * fps);
    const df = Math.max(1, Math.round(cue.dur * fps));
    return (
      <Sequence key={cue.id} from={from} durationInFrames={df} premountFor={pre} name={`${cue.kind} · ${cue.id}`}>
        {el(df)}
      </Sequence>
    );
  };
  return (
    <AbsoluteFill style={{ background: V.ink0, overflow: "hidden" }}>
      <Audio src={staticFile("tfbesponjas.m4a")} />
      {BEATS.map((cue: any) => seq(cue, (df) => <Base cue={cue} df={df} />))}
      {OVERLAYS.map((cue: any) => seq(cue, (df) => <Over cue={cue} df={df} />))}
      {SFX.map((s, k) => (
        <Sequence key={"sfx" + k} from={s.from} durationInFrames={60} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
export const TOTAL_FRAMES = TOTAL_FRAMES_TFBESP;
export default MainTfbesponjas;
