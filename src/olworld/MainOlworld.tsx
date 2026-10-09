// MainOlworld — Main COMPARTIDO de la serie olworld (ol30min · ol30suppers · olsled), Ole's Camp Kitchen.
// Capa base: avatar InfiniteTalk (un reel por video) · imágenes (gpt con Ole / agnes sin cara) con su clip agnes v2.0 mientras dure ·
// STOCK real · fotos de ARCHIVO reales · componentes del mundo (libro de cuentas, pizarra, triángulo, estante) + página del libro y CTA.
// Encima: overlays. Audio: UN máster ya mezclado (voz + cama de fuego/viento + triángulo + foley), SIN música.
// ⛔ Todo video con OffthreadVideo (nunca <Video>), clip nunca en loop (después su último cuadro), Ken-Burns al azar por plano.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { rnd } from "../olsup/OleSupTheme";
import { OleArchivePhoto } from "../olsup/OleCards";
import { OleBookPage, OleCTA } from "../olsup/OleBook";
import { OleNameTag, OleAsk } from "../olsup/OleOverlays";
import { OleLedger } from "./OleLedger";
import { OleChalkboard } from "./OleChalkboard";
import { OleTriangle } from "./OleTriangle";
import { OleShelf } from "./OleShelf";

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

const Placeholder: React.FC = () => (<AbsoluteFill style={{ backgroundColor: "#1E140D" }}><Img src={staticFile("ref_ole_av.png")} style={{ ...FILL, opacity: 0.35 }} /></AbsoluteFill>);
const Photo: React.FC<{ src: string | null; seed: number }> = ({ src, seed }) => {
  const kb = useKB(seed, false);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#1E140D" }}>{src ? <Img src={staticFile(src)} style={{ ...FILL, ...kb }} /> : <Placeholder />}</AbsoluteFill>;
};
const Clip: React.FC<{ src: string; sf?: number; seed: number; kb?: boolean }> = ({ src, sf = 0, seed, kb = true }) => {
  const k = useKB(seed, true);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}><OffthreadVideo src={staticFile(src)} startFrom={sf} muted style={{ ...FILL, ...(kb ? k : {}) }} /></AbsoluteFill>;
};
// imagen con su clip agnes: el clip mientras dure y después su ÚLTIMO cuadro quieto (con su propio Ken-Burns)
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
const StockShot: React.FC<{ c: any }> = ({ c }) => {
  const n = Math.min(c.dur, Math.max(1, c.clipF || c.dur));
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={n}><Clip src={c.src} seed={c.seed} /></Sequence>
      {c.dur > n ? <Sequence from={n}><Photo src={c.src.replace(/\.mp4$/, "_last.jpg")} seed={c.seed + 1} /></Sequence> : null}
    </AbsoluteFill>
  );
};
// avatar: el reel único a 30 fps en el offset de su ventana; push lento SIEMPRE, sin filtros
const Avatar: React.FC<{ c: any }> = ({ c }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1.0, 1.035 + rnd(c.seed) * 0.02], { extrapolateRight: "clamp" });
  if (!c.src) return <Placeholder />;
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}><OffthreadVideo src={staticFile(c.src)} startFrom={c.sf} muted style={{ ...FILL, scale: String(z), transformOrigin: "50% 38%" }} /></AbsoluteFill>;
};

const COMP: Record<string, React.FC<any>> = { OleLedger, OleChalkboard, OleTriangle, OleShelf, OleBookPage, OleCTA };
const OVC: Record<string, React.FC<any>> = { OleNameTag, OleAsk };

const Shot: React.FC<{ c: any }> = ({ c }) => {
  if (c.k === "av") return <Avatar c={c} />;
  if (c.k === "img") return <ImgShot c={c} />;
  if (c.k === "st") return <StockShot c={c} />;
  if (c.k === "ar") return <OleArchivePhoto {...c.props} />;
  if (c.k === "comp") { const C = COMP[c.cname]; return C ? <C {...c.props} /> : <Placeholder />; }
  return <Placeholder />;
};

export const MainOlworld: React.FC<{ TL: any[]; OV: any[]; AUDIO: string }> = ({ TL, OV, AUDIO }) => (
  <AbsoluteFill style={{ backgroundColor: "#1E140D" }}>
    {TL.map((c, i) => (<Sequence key={"b" + i} from={c.from} durationInFrames={c.dur}><Shot c={c} /></Sequence>))}
    {OV.map((o, i) => { const C = OVC[o.name]; return C ? <Sequence key={"o" + i} from={o.from} durationInFrames={o.dur}><C {...o.props} /></Sequence> : null; })}
    <Audio src={staticFile(AUDIO)} />
  </AbsoluteFill>
);
