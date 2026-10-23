// duane02 · MINUTO 1 (0-64,72 s). Un solo hilo visual, sin cortes secos:
// avatar (6:30 · enero) → (portal) el taller de chapa helado desde el aire hasta la ventana escarchada → la morsa que
// quema a través del guante → avatar: 26 °F ADENTRO → caminando en el taller helado → (zoom) "now picture this": la estufa
// de dos discos se arma en el aire en el rincón → palitos y fósforo → avatar "10 minutos, el caño hace tic" → (zoom) fuego
// por las ranuras, aire caliente, visión térmica, el dial sube de 26 a 45 → "that's my shop" → (portal) el depósito de
// chatarra con el disco como trofeo → avatar + rótulo DUANE → tormenta → la tarjeta del video de los tambores y los
// comentarios pidiendo la estufa. Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { StoveWorld, PT, screenOf, camSpeed, Key, FX, ironCss } from "./stove3d";
import { BigNum, COL, Card3D, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr, setSlug } from "../kits/yanqui3d/lib";
import { Stamp } from "../kits/yanqui3d/engine";
import { Words } from "../kits/yanqui3d/pieces";
import AVAIL from "./avail.json";
import AVW from "./avwin.json";

setSlug("duane02");
export const MIN1_END = 64.72;
export const MIN1_FRAMES = Math.round(MIN1_END * 30);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
export const REEL = true; // true cuando llega el reel del avatar (public/duane02/reel0.mp4)

// toma (agnes/LTX) si llegó; si no la foto con zoom lento; si no una placa
export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.04, 1.12] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 9);
  const inner = HAS.clips.includes(k) ? <Vid id={"ltx_" + k} from={from} at={a} /> : HAS.imgs.includes(k) ? <Vid id={"img_" + k} /> :
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill>;
};
const pick = (...ks: string[]) => ks.find((k) => HAS.clips.includes(k)) ?? ks.find((k) => HAS.imgs.includes(k)) ?? ks[0];

// ---------- AVATAR: ventanas pagadas (preroll 10 cuadros), borde nítido ----------
const WIN = (AVW as number[][]).filter(([ms]) => ms < MIN1_END - 1).map(([ms, me, off]) => ({ ms, me, off }));
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const face = REEL ? WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  )) : <Vid id="img_av" style={{ transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- la cámara del mundo en el minuto 1 (una sola, vuela entre tramos) ----------
const KF: Key[] = [
  // B · desde el aire nevado, entra por el corte del taller hasta la ventana escarchada
  { t: 2.7, p: [3.2, 9.5, 16], l: [3.0, 1.2, -1.0], fov: 42 },
  { t: 5.6, p: [3.6, 2.1, 4.6], l: [3.7, 1.5, -2.0], fov: 42 },
  { t: 8.7, p: [3.8, 1.72, -1.75], l: [3.8, 1.7, -3.0], fov: 36 },
  // C · a la morsa del banco
  { t: 9.9, p: [4.35, 1.5, -0.85], l: [4.7, 1.1, -1.5], fov: 34 },
  // F · "now picture this": del centro del taller al rincón; la estufa se arma en el aire
  { t: 22.3, p: [4.4, 2.6, 3.6], l: [1.0, 0.6, -1.9], fov: 44 },
  { t: 24.4, p: [2.6, 1.35, 0.2], l: [0.9, 0.55, -1.9], fov: 38 },
  { t: 27.2, p: [1.9, 0.95, -0.7], l: [0.9, 0.5, -1.9], fov: 34, arc: 0.12 },
  { t: 29.8, p: [0.05, 0.85, -0.65], l: [0.9, 0.48, -1.9], fov: 32 },
  // I · fuego por las ranuras → el aire caliente sube → el dial de 26 a 45
  { t: 36.1, p: [1.55, 0.62, -1.35], l: [0.9, 0.45, -1.9], fov: 30 },
  { t: 38.3, p: [1.4, 0.7, -1.25], l: [0.95, 0.45, -1.9], fov: 32 },
  { t: 39.6, p: [3.3, 2.2, 2.6], l: [1.6, 1.0, -1.6], fov: 46, arc: 0.15 },
  { t: 41.2, p: [2.4, 1.62, -0.25], l: [2.4, 1.6, -1.2], fov: 34 },
  // J · "that's my shop": se aleja hasta verlo entero, humo del caño, nieve
  { t: 42.7, p: [2.45, 1.62, -0.45], l: [2.4, 1.6, -1.2], fov: 34 },
  { t: 44.4, p: [8.5, 6.5, 13.5], l: [2.4, 1.6, -1.5], fov: 44 },
  // L · la tormenta de todos los inviernos (afuera, de noche, caño humeando)
  { t: 53.0, p: [-7, 5.2, -12], l: [1.2, 2.6, -2.5], fov: 42 },
  { t: 56.6, p: [-3.5, 3.6, -8.5], l: [0.9, 3.4, -3.3], fov: 40 },
  // M · de fondo para las tarjetas: adentro, la estufa encendida, lento
  { t: 56.65, p: [2.8, 1.5, 1.6], l: [0.9, 0.6, -1.9], fov: 40 },
  { t: 64.8, p: [2.0, 1.2, 0.4], l: [0.9, 0.55, -1.9], fov: 36 },
];
const fx = (t: number): Partial<FX> => {
  if (t < 22) return { day: 0.18, frost: 1, build: 0, fire: 0, shopTemp: 26 };
  if (t < 35.9) return { day: 0.22, frost: 1, build: 7 * ei(t, 23.4, 29.2), explode: 1 - e(t, 28.6, 29.6), fire: 0, shopTemp: 26 };
  if (t < 42.6) return { day: 0.25, frost: 1 - e(t, 39.6, 41.5), fire: e(t, 35.9, 36.8), flow: e(t, 37.4, 38.4), heat: e(t, 38.6, 39.2) * (1 - e(t, 40.8, 41.3)), shopTemp: 26 + 19 * ei(t, 38.4, 41.62) };
  if (t < 53) return { day: 0.45, fire: 1, flow: 0.5, shopTemp: 45 };
  if (t < 56.62) return { day: 0.2, storm: 1, fire: 1, shopTemp: 45 };
  return { day: 0.4, fire: 1, flow: 0.6, shopTemp: 45 };
};
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t, KF), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><StoveWorld t={t} KF={KF} fx={fx} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const sc = (t: number, q: [number, number, number]) => screenOf(t, q, KF);

// escarcha en los bordes (taller helado)
const Frost: React.FC<{ o: number }> = ({ o }) => o < 0.01 ? null : (
  <AbsoluteFill style={{ opacity: o, background: "radial-gradient(ellipse 70% 62% at 50% 50%, transparent 55%, rgba(170,215,255,.38) 85%, rgba(230,245,255,.7) 100%)", mixBlendMode: "screen", pointerEvents: "none" }} />
);
// chip de hora/dato que cae
const Chip: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; col?: string; size?: number }> = ({ t, at, out, x, y, text, col = COL.ink, size = 54 }) => {
  const k = Math.min(1.1, spr(t, at)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 900 }}>
    <div style={{ transform: `rotateX(${(1 - Math.min(1, k)) * 80}deg) translateY(${(1 - Math.min(1, k)) * -60}px)`, padding: "12px 26px", borderRadius: 14, background: "linear-gradient(180deg, rgba(14,22,36,.92), rgba(8,12,20,.92))", border: `3px solid ${col}`, boxShadow: `0 24px 50px rgba(0,0,0,.6), 0 0 24px ${col}55`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 3, whiteSpace: "nowrap", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>{text}</div>
  </div>;
};
// comentario del video anterior pidiendo la estufa
const Comment: React.FC<{ t: number; at: number; out: number; x: number; y: number; who: string; txt: string; likes: number }> = ({ t, at, out, x, y, who, txt, likes }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * 220}px) scale(${0.85 + 0.15 * Math.min(1, k)})`, transformOrigin: "100% 50%", width: 640, padding: "18px 24px", borderRadius: 18, background: "rgba(14,16,20,.94)", boxShadow: "0 24px 60px rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.12)", fontFamily: FONT, display: "flex", gap: 18 }}>
    <div style={{ width: 56, height: 56, borderRadius: 28, flex: "none", background: ["#6b8f71", "#8f6b6b", "#6b7a8f"][who.length % 3], color: "#fff", fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{who[1].toUpperCase()}</div>
    <div><div style={{ color: "#aab", fontWeight: 800, fontSize: 24 }}>{who}</div><div style={{ color: COL.ink, fontWeight: 800, fontSize: 34, lineHeight: 1.15, marginTop: 4 }}>{txt}</div></div>
  </div>;
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-3,1 · avatar; JANUARY / 6:30 AM; portal al mundo =====
  if (t < 3.15) {
    L.push(<Avatar key="avA" t={t} blur={8 * e(t, 2.45, 3.0)} dark={0.4 * e(t, 2.45, 3.0)} />);
    L.push(<Chip key="c1" t={t} at={0.25} out={2.9} x={1300} y={150} text="JANUARY" col={COL.ice} size={72} />);
    L.push(<Chip key="c2" t={t} at={1.35} out={2.9} x={1300} y={270} text="6:30 AM" />);
    const r = ei(t, 2.6, 3.12);
    if (r > 0) L.push(<Portal key="pA" x={960} y={540} r={r}><World t={Math.max(2.7, t)} /></Portal>);
  }
  // ===== B · 3,1-9,6 · del aire nevado al taller; el frío como pared; escarcha ADENTRO de la ventana =====
  if (t >= 3.1 && t < 9.65) {
    L.push(<World key="wB" t={t} />);
    L.push(<Frost key="frB" o={0.55 * e(t, 4.6, 5.4)} />);
    if (t < 6.4) L.push(<BigNum key="wall" t={t} at={4.6} text="COLD" x={960} y={470} size={230} col={COL.ice} edge="#123a5a" out={6.1} sub="LIKE A WALL" />);
    const w = sc(t, [3.8, 1.7, -2.93]);
    if (t > 6.6) L.push(<Tag key="fr" t={t} at={7.0} x={w.x} y={w.y} dx={260} dy={-150} text="FROST" sub="ON THE INSIDE" col={COL.ice2} out={9.3} size={64} />);
    const v = sc(Math.min(t, 9.9), [4.7, 1.12, -1.5]), pr = ei(t, 9.2, 9.65);
    if (pr > 0) L.push(<Portal key="pB" x={v.x} y={v.y} r={pr}><AbsoluteFill><Shot k={pick("hook_c", "n_vise")} t={t} a={9.2} /><Frost o={0.8} /></AbsoluteFill></Portal>);
  }
  // ===== C · 9,6-12,75 · la morsa que quema a través del guante; latigazo al avatar =====
  if (t >= 9.6 && t < 13.2) {
    const wp = ei(t, 12.4, 12.85), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="vC" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Shot k={pick("hook_c", "n_vise")} t={t} a={9.2} /><Frost o={0.8} />
      <Tag t={t} at={10.5} x={1180} y={600} dx={-260} dy={-260} text="BURNS YOUR FINGERS" sub="THROUGH THE GLOVE" col={COL.ice} out={12.3} size={58} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avC" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 12.75)} /></AbsoluteFill>);
  }
  // ===== D · 12,75-18,0 · avatar: el termómetro del poste dice 26 °F — y eso es ADENTRO =====
  if (t >= 12.85 && t < 18.4) {
    const wp = ei(t, 17.75, 18.2), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="avD" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Avatar t={t} />
      <BigNum t={t} at={14.8} text="26°F" x={1450} y={400} size={230} col={COL.ice} edge="#123a5a" out={17.6} />
      <Stamp t={t} at={16.75} text="INSIDE" x={1450} y={640} out={17.6} rot={-6} size={86} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="hkD" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Shot k={pick("hook_a", "hook_b", "n_cold")} t={Math.max(t, 17.9)} a={17.75} /><Frost o={0.6} /></AbsoluteFill>);
  }
  // ===== E · 18-22,6 · caminando en el taller helado; "ni sentís la llave"; zoom a través =====
  if (t >= 18.15 && t < 23.2) {
    const z = ei(t, 22.2, 22.75);
    L.push(<AbsoluteFill key="wE" style={{ opacity: z > 0 ? 1 : 0 }}><World t={Math.max(22.3, t)} /></AbsoluteFill>);
    L.push(<AbsoluteFill key="hkE" style={{ transformOrigin: "960px 540px", transform: `scale(${1 + z * z * 6})`, opacity: 1 - e(z, 0.55, 0.95) }}>
      <Shot k={pick("hook_a", "hook_b", "n_cold")} t={t} a={17.75} /><Frost o={0.6} />
      <Words t={t} items={[{ at: 19.75, txt: "CAN'T FEEL" }, { at: 20.5, txt: "THE WRENCH", col: COL.ice }]} out={21.9} y={820} size={96} />
    </AbsoluteFill>);
  }
  // ===== F · 22,6-29,75 · "now picture this": dos discos de camioneta se arman en el aire en el rincón =====
  if (t >= 22.7 && t < 30.2) {
    const wp = ei(t, 29.55, 30.0), mb = Math.sin(wp * Math.PI) * 40;
    const cap = sc(t, [0.9, 0.18, -1.9]);
    L.push(<AbsoluteFill key="wF" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <World t={t} />
      <Words t={t} items={[{ at: 22.75, txt: "NOW PICTURE THIS" }]} out={23.9} y={860} size={84} />
      <Chip t={t} at={24.6} out={27.6} x={150} y={150} text="2 OLD BRAKE ROTORS" col={COL.amber} size={60} />
      <Chip t={t} at={25.75} out={27.6} x={150} y={265} text="OFF A PICKUP TRUCK" />
      <Tag t={t} at={28.1} x={cap.x} y={cap.y} dx={-300} dy={-90} text="LITTLE STEEL STAND" sub="IN THE CORNER" col={COL.ink} out={29.5} size={52} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="mF" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Shot k={pick("d_match", "d_sticks")} t={Math.max(t, 29.75)} a={29.55} /></AbsoluteFill>);
  }
  // ===== G · 29,75-31,52 · palitos y un fósforo =====
  if (t >= 29.95 && t < 31.95) {
    const wp = ei(t, 31.3, 31.75), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="mG" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Shot k={pick("d_match", "d_sticks")} t={t} a={29.55} />
      <Chip t={t} at={30.2} out={31.2} x={150} y={150} text="A HANDFUL OF STICKS" col={COL.amber} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avG" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 31.52)} /></AbsoluteFill>);
  }
  // ===== H · 31,52-36,1 · avatar: 10 minutos y el caño empieza a hacer tic; zoom a la estufa =====
  if (t >= 31.7 && t < 36.6) {
    const z = ei(t, 35.75, 36.3);
    L.push(<AbsoluteFill key="wH" style={{ opacity: z > 0 ? 1 : 0 }}><World t={Math.max(36.1, t)} /></AbsoluteFill>);
    L.push(<AbsoluteFill key="avH" style={{ transformOrigin: "960px 470px", transform: `scale(${1 + z * z * 6})`, opacity: 1 - e(z, 0.55, 0.95) }}>
      <Avatar t={t} />
      <Chip t={t} at={33.45} out={35.6} x={1260} y={170} text="≈ 10 MINUTES" col={COL.amber} size={64} />
      <Chip t={t} at={34.75} out={35.6} x={1260} y={290} text="TICK · TICK · TICK" />
    </AbsoluteFill>);
  }
  // ===== I · 36,1-42,74 · fuego por las ranuras, el aire caliente, la visión térmica; el dial sube de 26 a 45 =====
  if (t >= 36.25 && t < 42.8) {
    L.push(<World key="wI" t={t} />);
    const sl = sc(t, PT.slots), dl = sc(t, PT.dial);
    L.push(<Tag key="tsl" t={t} at={37.2} x={sl.x} y={sl.y} dx={-320} dy={-170} text="FIRE GLOWS THROUGH" sub="THE SLOTS IN THE IRON" col={COL.amber} out={39.2} size={56} />);
    L.push(<Chip key="hr" t={t} at={39.3} out={42.5} x={150} y={150} text="+1 HOUR" col={ironCss(0.8)} size={64} />);
    const ho = e(t, 38.6, 39.2) * (1 - e(t, 40.8, 41.3));
    if (ho > 0.01) L.push(<div key="scale" style={{ position: "absolute", right: 60, top: 220, opacity: ho, fontFamily: FONT, fontWeight: 800, color: COL.ink, fontSize: 24, textAlign: "center" }}>
      <div>75°F</div><div style={{ width: 34, height: 420, margin: "8px auto", borderRadius: 17, border: "3px solid rgba(255,255,255,.8)", background: `linear-gradient(0deg, ${[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((u) => ironCss(u)).join(",")})` }} /><div>−5°F</div></div>);
    if (t > 41.0) L.push(<BigNum key="45" t={t} at={41.62} text="45°F" x={dl.x + 560} y={dl.y - 40} size={240} col={COL.amber} edge="#5a3410" out={42.6} />);
  }
  // ===== J · 42,74-48,4 · "that's my shop" → (portal) el depósito de chatarra: el disco como trofeo; OUT OF JUNK =====
  if (t >= 42.75 && t < 48.6) {
    L.push(<World key="wJ" t={Math.min(t, 44.4)} />);
    L.push(<Words key="ms" t={t} items={[{ at: 42.8, txt: "THAT'S MY SHOP" }]} out={44.0} y={880} size={92} />);
    const pr = ei(t, 43.95, 44.45), wp = ei(t, 48.0, 48.45), mb = Math.sin(wp * Math.PI) * 40;
    if (pr > 0) L.push(<AbsoluteFill key="tJ" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Portal x={960} y={420} r={pr}><Shot k={pick("d_trophy", "n_scrapbin")} t={t} a={43.95} /></Portal>
      <Stamp t={t} at={45.55} text="BUILT OUT OF JUNK" x={620} y={860} out={47.0} rot={-5} size={86} />
      <Chip t={t} at={46.65} out={47.9} x={1230} y={150} text="ALL LAST WINTER" col={COL.amber} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avJ" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 48.41)} /></AbsoluteFill>);
  }
  // ===== K · 48,4-53,1 · avatar + rótulo =====
  if (t >= 48.45 && t < 53.6) {
    const z = ei(t, 52.85, 53.35);
    L.push(<AbsoluteFill key="wK0" style={{ opacity: z > 0 ? 1 : 0 }}><World t={Math.max(53.0, t)} /></AbsoluteFill>);
    L.push(<AbsoluteFill key="avK" style={{ transformOrigin: "960px 470px", transform: `scale(${1 + z * z * 6})`, opacity: 1 - e(z, 0.55, 0.95) }}><Avatar t={t} /></AbsoluteFill>);
  }
  if (t >= 48.6 && t < 54.6) L.push(<LowerThird key="lt" t={t} at={48.75} out={53.7} name="DUANE" l2="WELDER · WISCONSIN · 40 YEARS" l2at={50.3} />);
  // ===== L · 53,1-56,6 · la tormenta: winter tries to kill you every single year =====
  if (t >= 53.3 && t < 56.75) {
    const fl = e(t, 56.45, 56.7);
    L.push(<AbsoluteFill key="wL" style={{ opacity: 1 - fl }}><World t={Math.min(t, 56.6)} /></AbsoluteFill>);
    L.push(<Words key="wy" t={t} items={[{ at: 54.75, txt: "EVERY." }, { at: 55.25, txt: "SINGLE." }, { at: 55.7, txt: "YEAR.", col: COL.red }]} out={56.4} y={480} size={130} />);
  }
  // ===== M · 56,56-64,72 · el video de los tambores → los comentarios pidiendo la estufa → la estufa =====
  if (t >= 56.4 && t < MIN1_END + 0.1) {
    const bl = 9 * e(t, 56.6, 57.3);
    L.push(<AbsoluteFill key="wM" style={{ opacity: e(t, 56.45, 56.7), filter: `blur(${bl}px) brightness(${1 - bl * 0.04})` }}><World t={Math.max(56.65, t)} /></AbsoluteFill>);
    const k = spr(t, 57.3, 0.8), k2 = spr(t, 62.3, 0.8), sw = ei(t, 60.3, 60.8);
    L.push(<Card3D key="cd" id="img_prev_drums" at={57.3} x={200 - sw * 120} y={200} w={720} h={405} ry={(1 - Math.min(1, k)) * 60 - 10 - sw * 30} rx={4} z={(1 - Math.min(1, k)) * -1300 - sw * 500} o={e(t, 57.3, 57.45) * (1 - e(t, 62.0, 62.3))} label="LAST TIME · THE WATER DRUMS" labelCol={COL.ice2} />);
    L.push(<Comment key="k1" t={t} at={60.65} out={64.5} x={1180} y={180} who="@ridgeline_mike" txt="Show us that rotor stove!" likes={412} />);
    L.push(<Comment key="k2" t={t} at={61.05} out={64.5} x={1180} y={380} who="@farmgirl_jo" txt="How'd you build the brake rotor heater?" likes={268} />);
    L.push(<Comment key="k3" t={t} at={61.45} out={64.5} x={1180} y={580} who="@old_ford_dan" txt="Need the stove video please" likes={151} />);
    L.push(<Card3D key="cs" id={pick("n_slots") === "n_slots" && HAS.clips.includes("plata_slots_a") ? "ltx_plata_slots_a" : "img_n_slots"} at={62.3} x={180} y={260} w={800} h={450} ry={(1 - Math.min(1, k2)) * -60 + 8} rx={4} z={(1 - Math.min(1, k2)) * -1300} o={e(t, 62.3, 62.45)} label="THE LITTLE ROTOR STOVE" labelCol={COL.amber} />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
