// olcanned — «NEVER Cook Beans Again Without This Old Logging Camp Trick» · Ole's Camp Kitchen
// Capa base: avatar InfiniteTalk (reel único) · clips agnes 2.5 (vlog hablado + detalles) · stock REAL · fotos de
// ARCHIVO reales (dominio público) · fotos gpt con Ken-Burns (o su clip agnes v2) · componentes Ole* (3D incluidos).
// Encima: overlays. Audio: en el farm suena el máster + cama + foley + sfx; la ENTREGA reemplaza el audio por la
// mezcla determinista (vlog/olcanned/mix.py) en los cuadros exactos.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TL, OV, SFX, FOLEY, AUDIO, TOTAL_FRAMES_OLCANNED } from "./timeline_olcanned.gen";
import { rnd } from "../ole/OleTheme";
import { OleDutchOven3D } from "../ole/OleDutchOven3D";
import { OleBeanHole3D } from "../ole/OleBeanHole3D";
import { OleHeatCurve } from "../ole/OleHeatCurve";
import { OleBeanSwell } from "../ole/OleBeanSwell";
import { OleMythTrick } from "../ole/OleMythTrick";
import { OleSaltAcidTimeline } from "../ole/OleSaltAcidTimeline";
import { OleRuleCard, OleRecapCard } from "../ole/OleRuleCard";
import { OleBookPage } from "../ole/OleBookPage";
import { OleCTA } from "../ole/OleCTA";
import { OleCookhouse, OleCampMap } from "../ole/OleCookhouse";
import { OleNameTag, OleNote, OleArrow, OleComments, OleSubscribe, OleAsk, OleStamp, OleCounter } from "../ole/OleOverlays";

import { CanLedger, CanJarTag, CanBagVsCan } from "./CanKit";
import { OleTrick, OleFact } from "../olsup/OleCards";

export { TOTAL_FRAMES_OLCANNED };

// Ken-Burns al azar POR PLANO: sentido 50/50, amplitud 3-9 % (fotos) / 1,5-4 % (clips), foco 28-72 %.
// Semilla = cuadro de inicio (hash entero, nunca Math.random: el farm rinde en chunks).
const useKB = (seed: number, clip: boolean) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const r = (o: number) => rnd(seed + o * 7919);
  const piso = clip ? 1.03 : 1.06, amp = (clip ? 1.5 + 2.5 * r(1) : 3 + 6 * r(1)) / 100;
  const acerca = r(2) > 0.5;
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = acerca ? piso + amp * k : piso + amp * (1 - k);
  const pan = clip ? 0.6 : 1.3, dx = (r(3) - 0.5) * 2 * pan, dy = (r(4) - 0.5) * 2 * pan * 0.7;
  const kk = acerca ? k : 1 - k;
  return { transform: `scale(${z.toFixed(4)}) translate(${(dx * kk).toFixed(3)}%, ${(dy * kk).toFixed(3)}%)`, transformOrigin: `${(28 + 44 * r(5)).toFixed(1)}% ${(28 + 44 * r(6)).toFixed(1)}%` };
};
const FILL: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover" };

const Photo: React.FC<{ src: string | null; seed: number }> = ({ src, seed }) => {
  const kb = useKB(seed, false);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#E9D9B8" }}>{src ? <Img src={staticFile(src)} style={{ ...FILL, ...kb }} /> : <Placeholder />}</AbsoluteFill>;
};
const Clip: React.FC<{ src: string; sf?: number; seed: number }> = ({ src, sf = 0, seed }) => {
  const kb = useKB(seed, true);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}><OffthreadVideo src={staticFile(src)} startFrom={sf} muted style={{ ...FILL, ...kb }} /></AbsoluteFill>;
};
// foto con su clip (agnes v2 o stock): el clip mientras dure (sin loop, nunca repetido) y después su último cuadro quieto
const ImgShot: React.FC<{ c: any }> = ({ c }) => {
  if (!c.clip) return <Photo src={c.img} seed={c.seed} />;
  const n = Math.min(c.dur, c.clipF);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={n}><Clip src={c.clip} seed={c.seed} /></Sequence>
      {c.dur > n ? <Sequence from={n}><Photo src={c.clip.replace(/\.mp4$/, "_last.jpg")} seed={c.seed + 1} /></Sequence> : null}
    </AbsoluteFill>
  );
};
// foto de ARCHIVO real: blanco y negro/sepia original, a pantalla completa sobre un fondo de su propio borde
// desenfocado (sin bandas negras), Ken-Burns lento. Nunca con rótulo de persona (no son "Swede" ni nadie del guion).
const Archive: React.FC<{ c: any }> = ({ c }) => {
  const kb = useKB(c.seed, false);
  if (!c.img) return <Placeholder />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#2b2620" }}>
      <Img src={staticFile(c.img)} style={{ ...FILL, filter: "blur(28px) brightness(0.75)", transform: "scale(1.15)" }} />
      <AbsoluteFill style={{ ...kb }}><Img src={staticFile(c.img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain" }} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
// avatar: el reel único (30 fps) en el offset de su ventana; push lento siempre (nunca estático)
const Avatar: React.FC<{ c: any }> = ({ c }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1.0, 1.035 + rnd(c.seed) * 0.02], { extrapolateRight: "clamp" });
  if (!c.src) return <Placeholder avatar />;
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}><OffthreadVideo src={staticFile(c.src)} startFrom={c.sf} muted style={{ ...FILL, scale: String(z), transformOrigin: "50% 38%" }} /></AbsoluteFill>;
};
// ⛔ placeholder SÓLO para montar sin el asset: la compuerta de entrega falla si queda alguno
const Placeholder: React.FC<{ avatar?: boolean }> = ({ avatar }) => (
  <AbsoluteFill style={{ backgroundColor: "#E9D9B8" }}><Img src={staticFile("ref_olcanned.png")} style={{ ...FILL, opacity: avatar ? 1 : 0.35 }} /></AbsoluteFill>
);

const COMP: Record<string, React.FC<any>> = {
  OleDutchOven3D, OleBeanHole3D, OleHeatCurve, OleBeanSwell, OleMythTrick, OleSaltAcidTimeline, OleRecapCard,
  OleBookPage, OleCTA, OleCookhouse, OleCampMap, OleTrick, OleFact, CanLedger, CanJarTag, CanBagVsCan,
};
const OVC: Record<string, React.FC<any>> = { OleNameTag, OleNote, OleArrow, OleComments, OleSubscribe, OleAsk, OleStamp, OleCounter, OleRuleCard, OleCTA };

const Shot: React.FC<{ c: any }> = ({ c }) => {
  if (c.k === "av") return <Avatar c={c} />;
  if (c.k === "vl" || c.k === "kf") return <Clip src={c.src} sf={c.sf} seed={c.seed} />;
  if (c.k === "img") return <ImgShot c={c} />;
  if (c.k === "arch") return <Archive c={c} />;
  if (c.k === "comp") { const C = COMP[c.name]; return C ? <C {...c.props} /> : <Placeholder />; }
  return <Placeholder />;
};

export const MainOlcanned: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#E9D9B8" }}>
    {TL.map((c, i) => (<Sequence key={"b" + i} from={c.from} durationInFrames={c.dur}><Shot c={c} /></Sequence>))}
    {OV.map((o, i) => { const C = OVC[o.name]; return C ? <Sequence key={"o" + i} from={o.from} durationInFrames={o.dur}><C {...o.props} /></Sequence> : null; })}
    <Audio src={staticFile(AUDIO)} />
    {FOLEY.map((a, i) => (<Sequence key={"f" + i} from={a.from} durationInFrames={a.dur}><Audio src={staticFile(a.src)} startFrom={a.sf || 0} volume={(f) => (a.vol ?? 1) * interpolate(f, [0, 5, Math.max(6, a.dur - 5), Math.max(7, a.dur)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></Sequence>))}
    {SFX.map((a, i) => (<Sequence key={"s" + i} from={a.from} durationInFrames={a.dur}><Audio src={staticFile(a.src)} volume={a.vol} /></Sequence>))}
  </AbsoluteFill>
);
