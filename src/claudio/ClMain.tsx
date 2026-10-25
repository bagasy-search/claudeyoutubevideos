// ClMain — montaje genérico de los videos del canal Claudio el Conserje: recibe la línea de tiempo de vlog/rhonda/gen_timeline.mjs.
// Capa base: avatar (reel único RunPod) · clips agnes 2.5 (Rhonda hablando / detalles) · fotos gpt con Ken-Burns al azar (o su stock
// real, o su clip agnes v2.0 ralentizado y luego su último cuadro) · componentes Cl* sobre camas reales. Encima: overlays.
// Audio: sólo la voz (la mezcla final con foley/sfx la pone la entrega, determinista).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { rnd, CL } from "./ClTheme";
import { ClRimCutaway3D } from "./ClRimCutaway3D";
import { ClBottle3D } from "./ClBottle3D";
import { ClMicroscope3D } from "./ClMicroscope3D";
import { ClHallway3D } from "./ClHallway3D";
import { ClChapter, ClCheck, ClBookPage, ClQRCard, ClDoDont, ClPins, ClColorCode, ClBeforeAfter, ClSplit } from "./ClCards";
import { ClMeasureCup, ClTimer30 } from "./ClGauges";
import { ClRimJets, ClNeverMix } from "./ClScience";
import { ClNameTag, ClStampOv, ClChip, ClAsk } from "./ClOverlays";
import { tileBg } from "./ClParts";
import { ClBowl3D } from "./ClBowl3D";
import { ClValve3D } from "./ClValve3D";
import { ClPumiceTest, ClPasteRecipe, ClNotebook, ClVideoRef } from "./ClSarro";
import { ClWasher3D } from "./ClWasher3D";
import { ClFilterFind, ClDoseCap, ClSmellTest } from "./ClLavadora";
import { ClPores3D } from "./ClPores3D";
import { ClSwab, ClSpores, ClFlashlight, ClWallLeak, ClHygrometer } from "./ClMoho";
import { ClTray3D } from "./ClTray3D";
import { ClPasteCheck, ClCoating, ClTally, ClReceipt } from "./ClBandeja";
import { ClCaulk3D } from "./ClCaulk3D";
import { ClFilmWrap, ClTubMap, ClCaulkGun } from "./ClSilicona";
import { ClMixCloud3D } from "./ClMixCloud3D";
import { ClStoreLabel, ClMixLight, ClProtocol, ClLabelLens } from "./ClMezcla";
import { ClFlushJet3D, ClRiseOrSpin, ClTankMark, ClTwoDays, ClStickWire } from "./ClDescarga";
import { ClFilterTest, ClPotBoil, ClGrainWipe } from "./ClCampana";
import { ClMattressLayers3D, ClDampSoaked, ClSprayMix, ClDryFan, ClThreeRounds } from "./ClColchon";
import { ClFaucet3D, ClDropDry, ClAerator, ClMaterials, ClAcidBase, ClWrapGuide } from "./ClLavabo";
import { manoCam } from "../kits/camara/CamaraMano";

// Ken-Burns al azar POR PLANO (regla 1.ter): sentido 50/50, amplitud 3-9 % fotos / 1,5-4 % clips, foco 28-72 %, paneo atado a la escala.
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
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: CL.white }}>{src ? <Img src={staticFile(src)} style={{ ...FILL, ...kb }} /> : <Placeholder />}</AbsoluteFill>;
};
const Clip: React.FC<{ src: string; sf?: number; seed: number }> = ({ src, sf = 0, seed }) => {
  const kb = useKB(seed, true);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: CL.white }}><OffthreadVideo src={staticFile(src)} startFrom={sf} muted style={{ ...FILL, ...kb }} /></AbsoluteFill>;
};
// foto con su clip (stock o agnes): el clip mientras dure (nunca en bucle ni repetido) y después su último cuadro quieto
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
// avatar: el reel único (30 fps) en el offset de su ventana; push lento siempre (nunca estático)
const Avatar: React.FC<{ c: any }> = ({ c }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1.0, 1.035 + rnd(c.seed) * 0.02], { extrapolateRight: "clamp" });
  if (!c.src) return <Placeholder avatar />;
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: CL.white }}><OffthreadVideo src={staticFile(c.src)} startFrom={c.sf} muted style={{ ...FILL, scale: String(z), transformOrigin: "50% 38%" }} /></AbsoluteFill>;
};
// ⛔ placeholder SÓLO para montar sin el asset: gen_timeline --final falla si queda alguno
const Placeholder: React.FC<{ avatar?: boolean }> = ({ avatar }) => (
  <AbsoluteFill style={{ ...tileBg(), opacity: avatar ? 1 : 0.6 }} />
);

const COMP: Record<string, React.FC<any>> = {
  ClRimCutaway3D, ClBottle3D, ClMicroscope3D, ClHallway3D, ClChapter, ClCheck, ClBookPage, ClQRCard, ClDoDont, ClPins, ClColorCode, ClBeforeAfter, ClSplit, ClMeasureCup, ClTimer30, ClRimJets, ClNeverMix, ClBowl3D, ClValve3D, ClPumiceTest, ClPasteRecipe, ClNotebook, ClVideoRef, ClWasher3D, ClFilterFind, ClDoseCap, ClSmellTest, ClPores3D, ClSwab, ClSpores, ClFlashlight, ClWallLeak, ClHygrometer, ClTray3D, ClPasteCheck, ClCoating, ClTally, ClReceipt, ClCaulk3D, ClFilmWrap, ClTubMap, ClCaulkGun, ClMixCloud3D, ClStoreLabel, ClMixLight, ClProtocol, ClLabelLens, ClFlushJet3D, ClMattressLayers3D, ClDampSoaked, ClSprayMix, ClDryFan, ClThreeRounds, ClRiseOrSpin, ClTankMark, ClTwoDays, ClStickWire, ClFilterTest, ClPotBoil, ClGrainWipe,
  ClFaucet3D, ClDropDry, ClAerator, ClMaterials, ClAcidBase, ClWrapGuide,
};
const OVC: Record<string, React.FC<any>> = { ClNameTag, ClStampOv, ClChip, ClAsk };

const Shot: React.FC<{ c: any }> = ({ c }) => {
  if (c.k === "av") return <Avatar c={c} />;
  if (c.k === "vl" || c.k === "kf") return <Clip src={c.src} sf={c.sf} seed={c.seed} />;
  if (c.k === "img") return <ImgShot c={c} />;
  if (c.k === "comp") { const C = COMP[c.name]; return C ? <C {...c.props} /> : <Placeholder />; }
  return <Placeholder />;
};

// cámara a mano virtual (vara 23-oct): balanceo lento CONTINUO con el reloj global (no se reinicia en cada plano); los componentes
// no llevan (sus mundos 3D/2.5D ya se mueven). Transición: cada plano entra XF cuadros antes, sobre el anterior (disolución, empuje
// o barrido), con su reloj corrido para que el avatar siga en sincro.
const XF = 7;
const Mano: React.FC<{ t0: number; children: React.ReactNode }> = ({ t0, children }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const m = manoCam((t0 + f) / fps, 1, 7);
  return (<AbsoluteFill style={{ overflow: "hidden", perspective: 1600 }}><AbsoluteFill style={{ transform: `translate3d(${m.x}px, ${m.y}px, 0) rotateX(${m.tilt}deg) rotateY(${m.pan}deg) rotateZ(${m.roll}deg) scale(1.05)` }}>{children}</AbsoluteFill></AbsoluteFill>);
};
const Enter: React.FC<{ x: number; seed: number; children: React.ReactNode }> = ({ x, seed, children }) => {
  const f = useCurrentFrame();
  if (x <= 0 || f >= x) return <>{children}</>;
  const k = interpolate(f, [0, x], [0, 1], { extrapolateRight: "clamp" }), e = k * k * (3 - 2 * k), kind = Math.floor(rnd(seed + 17) * 3);
  const st: React.CSSProperties = kind === 0 ? { opacity: e } : kind === 1 ? { opacity: e, scale: String(1.08 - 0.08 * e) } : { opacity: Math.min(1, e * 1.6), translate: `${(1 - e) * (rnd(seed) > 0.5 ? 14 : -14)}% 0`, filter: `blur(${(1 - e) * 10}px)` };
  return <AbsoluteFill style={st}>{children}</AbsoluteFill>;
};
const lead = (TL: any[], i: number) => (i === 0 ? 0 : Math.min(XF, TL[i - 1].dur - 2, TL[i].from));
export const ClMain: React.FC<{ TL: any[]; OV: any[]; AUDIO: string }> = ({ TL, OV, AUDIO }) => (
  <AbsoluteFill style={{ backgroundColor: CL.white }}>
    {TL.map((c, i) => {
      const x = Math.max(0, lead(TL, i)); const cc = x && c.sf != null ? { ...c, sf: Math.max(0, c.sf - x) } : c;
      const body = <Shot c={x && c.k === "av" && c.sf < x ? c : cc} />;
      return (<Sequence key={"b" + i} from={c.from - x} durationInFrames={c.dur + x}><Enter x={x} seed={c.seed || i}>{c.k === "comp" ? body : <Mano t0={c.from - x}>{body}</Mano>}</Enter></Sequence>);
    })}
    {OV.map((o, i) => { const C = OVC[o.name]; return C ? <Sequence key={"o" + i} from={o.from} durationInFrames={o.dur}><C {...o.props} /></Sequence> : null; })}
    <Audio src={staticFile(AUDIO)} />
  </AbsoluteFill>
);
