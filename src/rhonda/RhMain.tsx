// RhMain — montaje genérico de los videos del canal Rhonda: recibe la línea de tiempo de vlog/rhonda/gen_timeline.mjs.
// Capa base: avatar (reel único RunPod) · clips agnes 2.5 (Rhonda hablando / detalles) · fotos gpt con Ken-Burns al azar (o su stock
// real, o su clip agnes v2.0 ralentizado y luego su último cuadro) · componentes Rh* sobre camas reales. Encima: overlays.
// Audio: sólo la voz (la mezcla final con foley/sfx la pone la entrega, determinista).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { rnd, RH } from "./RhTheme";
import { RhToiletCutaway3D } from "./RhToiletCutaway3D";
import { RhBottle3D } from "./RhBottle3D";
import { RhChapter, RhCheck, RhBookPage, RhQRCard, RhDoDont, RhPins, RhColorCode } from "./RhCards";
import { RhMeasureCup, RhTimer30 } from "./RhGauges";
import { RhRimJets, RhBleachVsRoots, RhNeverMix } from "./RhScience";
import { RhNameTag, RhAsk } from "./RhOverlays";
import { RhGroutPore3D } from "./RhGroutPore3D";
import { RhBowlSection3D } from "./RhBowlSection3D";
import { RhPasteMix, RhWaterLevel, RhPumiceWetDry, RhHardWater, RhRingColors } from "./RhRing";
import { RhMoldCalendar, RhSwabTest, RhWipeReveal, RhFogMirror, RhPatchMeter, RhWetMap, RhStrengthMeter, RhNextVideo } from "./RhMold";

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
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: RH.white }}>{src ? <Img src={staticFile(src)} style={{ ...FILL, ...kb }} /> : <Placeholder />}</AbsoluteFill>;
};
const Clip: React.FC<{ src: string; sf?: number; seed: number }> = ({ src, sf = 0, seed }) => {
  const kb = useKB(seed, true);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: RH.white }}><OffthreadVideo src={staticFile(src)} startFrom={sf} muted style={{ ...FILL, ...kb }} /></AbsoluteFill>;
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
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: RH.white }}><OffthreadVideo src={staticFile(c.src)} startFrom={c.sf} muted style={{ ...FILL, scale: String(z), transformOrigin: "50% 38%" }} /></AbsoluteFill>;
};
// ⛔ placeholder SÓLO para montar sin el asset: gen_timeline --final falla si queda alguno
const Placeholder: React.FC<{ avatar?: boolean }> = ({ avatar }) => (
  <AbsoluteFill style={{ backgroundColor: RH.white }}><Img src={staticFile("ref_rhtoiletrim.png")} style={{ ...FILL, opacity: avatar ? 1 : 0.35 }} /></AbsoluteFill>
);

const COMP: Record<string, React.FC<any>> = {
  RhToiletCutaway3D, RhBottle3D, RhChapter, RhCheck, RhBookPage, RhQRCard, RhDoDont, RhPins, RhColorCode, RhMeasureCup, RhTimer30, RhRimJets, RhBleachVsRoots, RhNeverMix,
  RhGroutPore3D, RhMoldCalendar, RhSwabTest, RhWipeReveal, RhFogMirror, RhPatchMeter, RhWetMap, RhStrengthMeter,
  RhBowlSection3D, RhPasteMix, RhWaterLevel, RhPumiceWetDry, RhHardWater, RhRingColors,
};
const OVC: Record<string, React.FC<any>> = { RhNameTag, RhAsk, RhNextVideo };

const Shot: React.FC<{ c: any }> = ({ c }) => {
  if (c.k === "av") return <Avatar c={c} />;
  if (c.k === "vl" || c.k === "kf") return <Clip src={c.src} sf={c.sf} seed={c.seed} />;
  if (c.k === "img") return <ImgShot c={c} />;
  if (c.k === "comp") { const C = COMP[c.name]; return C ? <C {...c.props} /> : <Placeholder />; }
  return <Placeholder />;
};

export const RhMain: React.FC<{ TL: any[]; OV: any[]; AUDIO: string }> = ({ TL, OV, AUDIO }) => (
  <AbsoluteFill style={{ backgroundColor: RH.white }}>
    {TL.map((c, i) => (<Sequence key={"b" + i} from={c.from} durationInFrames={c.dur}><Shot c={c} /></Sequence>))}
    {OV.map((o, i) => { const C = OVC[o.name]; return C ? <Sequence key={"o" + i} from={o.from} durationInFrames={o.dur}><C {...o.props} /></Sequence> : null; })}
    <Audio src={staticFile(AUDIO)} />
  </AbsoluteFill>
);
