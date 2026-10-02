// hazeldealers — "What Estate Sale Dealers Grab First — Before You Even Open the Door" · Hazel Appraises (1er video)
// Capa base: avatar InfiniteTalk (reel único) · clips agnes 2.5 (minuto 1) · fotos gpt con Ken-Burns al azar (o su clip
// agnes v2.0) · stock real Pexels · componentes Hz*. Encima: overlays. Audio: UN máster + cama propia + foley + sfx.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TL, OV, SFX, FOLEY, AUDIO, MUSIC, TOTAL_FRAMES_HAZELDEALERS } from "./timeline_hazeldealers.gen";
import { rnd } from "../hazel/HzTheme";
import { HzPriceTag } from "../hazel/HzPriceTag";
import { HzSoldListings } from "../hazel/HzSoldListings";
import { HzWhereToSell } from "../hazel/HzWhereToSell";
import { HzDealerClock } from "../hazel/HzDealerClock";
import { HzMagnetTest } from "../hazel/HzMagnetTest";
import { HzWorthNothing } from "../hazel/HzWorthNothing";
import { HzLotVsPiece } from "../hazel/HzLotVsPiece";
import { HzLotCard } from "../hazel/HzLotCard";
import { HzRecap } from "../hazel/HzRecap";
import { HzRuleCard } from "../hazel/HzRuleCard";
import { HzHallmark3D } from "../hazel/HzHallmark3D";
import { HzRing3D } from "../hazel/HzRing3D";
import { HzNameTag, HzAsk, HzSubscribe } from "../hazel/HzOverlays";

export { TOTAL_FRAMES_HAZELDEALERS };

// Ken-Burns al azar POR PLANO (regla 1.ter): sentido 50/50, amplitud 3-9 % (fotos) / 1,5-4 % (clips), foco 28-72 %,
// paneo atado a la escala (nunca destapa borde). Semilla = hash del cuadro de inicio (nunca Math.random).
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

const Placeholder: React.FC<{ avatar?: boolean }> = ({ avatar }) => (
  <AbsoluteFill style={{ backgroundColor: "#E9D4A0" }}><Img src={staticFile("ref_hazeldealers.png")} style={{ ...FILL, opacity: avatar ? 1 : 0.35 }} /></AbsoluteFill>
);
const Photo: React.FC<{ src: string | null; seed: number }> = ({ src, seed }) => {
  const kb = useKB(seed, false);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#E9D4A0" }}>{src ? <Img src={staticFile(src)} style={{ ...FILL, ...kb }} /> : <Placeholder />}</AbsoluteFill>;
};
const Clip: React.FC<{ src: string; sf?: number; seed: number }> = ({ src, sf = 0, seed }) => {
  const kb = useKB(seed, true);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}><OffthreadVideo src={staticFile(src)} startFrom={sf} muted style={{ ...FILL, ...kb }} /></AbsoluteFill>;
};
// foto con su clip agnes v2.0: el clip mientras dure (sin loop, nunca repetido) y después su último cuadro quieto
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
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}><OffthreadVideo src={staticFile(c.src)} startFrom={c.sf} muted style={{ ...FILL, scale: String(z), transformOrigin: "50% 36%" }} /></AbsoluteFill>;
};

const COMP: Record<string, React.FC<any>> = {
  HzPriceTag, HzSoldListings, HzWhereToSell, HzDealerClock, HzMagnetTest, HzWorthNothing, HzLotVsPiece, HzLotCard, HzRecap, HzRuleCard, HzHallmark3D, HzRing3D,
};
const OVC: Record<string, React.FC<any>> = { HzNameTag, HzAsk, HzSubscribe };

const Shot: React.FC<{ c: any }> = ({ c }) => {
  if (c.k === "av") return <Avatar c={c} />;
  if ((c.k === "vl" || c.k === "kf") && c.src) return <Clip src={c.src} sf={c.sf} seed={c.seed} />;
  if (c.k === "clip") return c.src ? <Clip src={c.src} sf={0} seed={c.seed} /> : <Placeholder />;
  if (c.k === "img") return <ImgShot c={c} />;
  if (c.k === "comp") { const C = COMP[c.name]; return C ? <C {...c.props} seed={c.seed % 997} /> : <Placeholder />; }
  return <Placeholder />;
};

export const MainHazeldealers: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#E9D4A0" }}>
    {TL.map((c, i) => (<Sequence key={"b" + i} from={c.from} durationInFrames={c.dur}><Shot c={c} /></Sequence>))}
    {OV.map((o, i) => { const C = OVC[o.name]; return C ? <Sequence key={"o" + i} from={o.from} durationInFrames={o.dur}><C {...o.props} /></Sequence> : null; })}
    <Audio src={staticFile(AUDIO)} />
    <Sequence from={0}><Audio src={staticFile(MUSIC)} volume={1} /></Sequence>
    {FOLEY.map((a, i) => (<Sequence key={"f" + i} from={a.from} durationInFrames={a.dur}><Audio src={staticFile(a.src)} volume={(f) => interpolate(f, [0, 5, Math.max(6, a.dur - 5), Math.max(7, a.dur)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></Sequence>))}
    {SFX.map((a, i) => (<Sequence key={"s" + i} from={a.from} durationInFrames={a.dur}><Audio src={staticFile(a.src)} volume={a.vol} /></Sequence>))}
  </AbsoluteFill>
);
