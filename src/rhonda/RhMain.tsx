// RhMain — montaje genérico de los videos del canal Rhonda: recibe la línea de tiempo de vlog/rhonda/gen_timeline.mjs.
// Capa base: avatar (reel único RunPod) · clips agnes 2.5 (Rhonda hablando / detalles) · fotos gpt con Ken-Burns al azar (o su stock
// real, o su clip agnes v2.0 ralentizado y luego su último cuadro) · componentes Rh* sobre camas reales. Encima: overlays.
// Audio: sólo la voz (la mezcla final con foley/sfx la pone la entrega, determinista).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { rnd, RH } from "./RhTheme";
import { RhToiletCutaway3D } from "./RhToiletCutaway3D";
import { RhBottle3D } from "./RhBottle3D";
import { RhChapter, RhCheck, RhBookPage, RhQRCard, RhDoDont, RhPins, RhColorCode } from "./RhCards";
import { RhMeasureCup, RhTimer30 } from "./RhGauges";
import { RhRimJets, RhBleachVsRoots, RhNeverMix } from "./RhScience";
import { RhNameTag, RhAsk, RhPromise, RhKicker, RhPop } from "./RhOverlays";
import { RhGroutPore3D } from "./RhGroutPore3D";
import { RhBowlSection3D } from "./RhBowlSection3D";
import { RhCaulkSection3D } from "./RhCaulkSection3D";
import { RhGasketFold3D } from "./RhGasketFold3D";
import { RhPumpFilter, RhCycleThermo, RhDoorCrack, RhDrawerFlashlight } from "./RhWasher";
import { RhKnifeStop, RhOvernight, RhTwoNightRule, RhTapeLine } from "./RhCaulk";
import { RhPasteMix, RhWaterLevel, RhPumiceWetDry, RhHardWater, RhRingColors } from "./RhRing";
import { RhGroutJoint3D, RhQuoteStamp, RhFloorMap, RhBrushCompare } from "./RhGrout";
import { RhHousePlan3D, RhNoseMeter, RhDrainTrap, RhFridgeGrille, RhHygrometer } from "./RhMusty";
import { RhMoldCalendar, RhSwabTest, RhWipeReveal, RhFogMirror, RhPatchMeter, RhWetMap, RhStrengthMeter, RhNextVideo } from "./RhMold";

// Ken-Burns al azar POR PLANO (regla 1.ter): sentido 50/50, amplitud 3-9 % fotos / 1,5-4 % clips, foco 28-72 %, paneo atado a la escala.
const useKB = (seed: number, clip: boolean, zz?: number[], oo?: number[]) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  if (zz) { // punch-in de la vara (edl.py): encuadre explícito, mismo material más cerca en la 2ª mitad del plano
    const kk = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], { extrapolateRight: "clamp" });
    return { transform: `scale(${(zz[0] + (zz[1] - zz[0]) * kk).toFixed(4)})`, transformOrigin: `${(oo || [50, 50])[0]}% ${(oo || [50, 50])[1]}%` };
  }
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
const Photo: React.FC<{ src: string | null; seed: number; zz?: number[]; oo?: number[] }> = ({ src, seed, zz, oo }) => {
  const kb = useKB(seed, false, zz, oo);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: RH.white }}>{src ? <Img src={staticFile(src)} style={{ ...FILL, ...kb }} /> : <Placeholder />}</AbsoluteFill>;
};
const Clip: React.FC<{ src: string; sf?: number; seed: number; zz?: number[]; oo?: number[] }> = ({ src, sf = 0, seed, zz, oo }) => {
  const kb = useKB(seed, true, zz, oo);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: RH.white }}><OffthreadVideo src={staticFile(src)} startFrom={sf} muted style={{ ...FILL, ...kb }} /></AbsoluteFill>;
};
// foto con su clip (stock o agnes): el clip mientras dure (nunca en bucle ni repetido) y después su último cuadro quieto
const ImgShot: React.FC<{ c: any }> = ({ c }) => {
  if (!c.clip) return <Photo src={c.img} seed={c.seed} zz={c.z} oo={c.o} />;
  const ofs = c.cofs || 0, n = Math.max(0, Math.min(c.dur, c.clipF - ofs));
  return (
    <AbsoluteFill>
      {n > 0 ? <Sequence durationInFrames={n}><Clip src={c.clip} sf={ofs} seed={c.seed} zz={c.z} oo={c.o} /></Sequence> : null}
      {c.dur > n ? <Sequence from={n}><Photo src={c.clip.replace(/\.mp4$/, "_last.jpg")} seed={c.seed + 1} zz={c.z} oo={c.o} /></Sequence> : null}
    </AbsoluteFill>
  );
};
// avatar: el reel único (30 fps) en el offset de su ventana; push lento siempre (nunca estático)
const Avatar: React.FC<{ c: any }> = ({ c }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], c.z || [1.0, 1.035 + rnd(c.seed) * 0.02], { extrapolateRight: "clamp" });
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
  RhCaulkSection3D, RhKnifeStop, RhOvernight, RhTwoNightRule, RhTapeLine,
  RhGasketFold3D, RhPumpFilter, RhCycleThermo, RhDoorCrack, RhDrawerFlashlight,
  RhGroutJoint3D, RhQuoteStamp, RhFloorMap, RhBrushCompare,
  RhHousePlan3D, RhNoseMeter, RhDrainTrap, RhFridgeGrille, RhHygrometer,
};
const OVC: Record<string, React.FC<any>> = { RhNameTag, RhAsk, RhNextVideo, RhPromise, RhKicker, RhPop };

const Shot: React.FC<{ c: any }> = ({ c }) => {
  if (c.k === "av") return <Avatar c={c} />;
  if (c.k === "vl" || c.k === "kf") return <Clip src={c.src} sf={c.sf} seed={c.seed} zz={c.z} oo={c.o} />;
  if (c.k === "img") return <ImgShot c={c} />;
  if (c.k === "comp") { const C = COMP[c.name]; return C ? (c.beats?.length ? <BeatCam beats={c.beats}><C {...c.props} /></BeatCam> : <C {...c.props} />) : <Placeholder />; }
  return <Placeholder />;
};
// CÁMARA POR GOLPES (vara cltoilet): en cada palabra-golpe el encuadre del componente salta suave (4 cuadros) entre 4 posiciones
const CAMS = [{ s: 1.0, x: 50, y: 50 }, { s: 1.065, x: 40, y: 46 }, { s: 1.0, x: 50, y: 52 }, { s: 1.065, x: 60, y: 54 }];
const BeatCam: React.FC<{ beats: number[]; children: React.ReactNode }> = ({ beats, children }) => {
  const f = useCurrentFrame();
  let i = -1; beats.forEach((b, j) => { if (f >= b) i = j; });
  const cur = CAMS[(i + 1) % 4], prev = CAMS[(i + 4) % 4];
  const u = i < 0 ? 1 : Easing.out(Easing.cubic)(Math.min(1, (f - beats[i]) / 4));
  return <AbsoluteFill style={{ transform: `scale(${prev.s + (cur.s - prev.s) * u})`, transformOrigin: `${prev.x + (cur.x - prev.x) * u}% ${prev.y + (cur.y - prev.y) * u}%` }}>{children}</AbsoluteFill>;
};
// entrada con BARRIDO (después de un componente): el plano entra de costado con desenfoque de movimiento en 6 cuadros
const Enter: React.FC<{ tin?: string; children: React.ReactNode }> = ({ tin, children }) => {
  const f = useCurrentFrame();
  if (tin !== "whip" || f >= 6) return <>{children}</>;
  const u = Easing.out(Easing.cubic)(f / 6);
  return <AbsoluteFill style={{ transform: `translateX(${(1 - u) * 420}px)`, filter: `blur(${(1 - u) * 22}px)` }}>{children}</AbsoluteFill>;
};

export const RhMain: React.FC<{ TL: any[]; OV: any[]; AUDIO: string }> = ({ TL, OV, AUDIO }) => (
  <AbsoluteFill style={{ backgroundColor: RH.white }}>
    {TL.map((c, i) => (<Sequence key={"b" + i} from={c.from} durationInFrames={c.dur}><Enter tin={c.tin}><Shot c={c} /></Enter></Sequence>))}
    {OV.map((o, i) => { const C = OVC[o.name]; return C ? <Sequence key={"o" + i} from={o.from} durationInFrames={o.dur}><C {...o.props} /></Sequence> : null; })}
    <Audio src={staticFile(AUDIO)} />
  </AbsoluteFill>
);
