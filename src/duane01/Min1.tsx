// duane01 · MINUTO 1 (0-63,77 s). Un solo hilo visual, sin cortes secos:
// avatar (6 AM · enero · sin luz) → (portal) los dos garajes en corte al amanecer, −8 °F → (portal desde el portón) toma
// del garaje helado → (el portal se cierra en el bowl 3D) hielo + taladro muerto → (latigazo) avatar "meat locker"
// → (zoom) la cámara cruza del garaje del vecino al taller de Duane con la VISIÓN TÉRMICA: azul contra ámbar → el dial
// marca 41 → (portal) Duane limpiando el termómetro → no gas / no wood / no power tachados → avatar + rótulo → (fogonazo de
// soldadura) Duane soldando → tormenta → la maceta de internet en el banco → avatar con tarjetas (maceta, pistola IR)
// → (zoom) de día: el sol entra por la ventana sur y los tambores se encienden en el mapa térmico → tomas de cómo lo armó.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ShopWorld, PT, screenOf, camSpeed, Key, FX, ironCss, tU } from "./shop3d";
import { BigNum, COL, Card3D, DrawX, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr, setSlug } from "../kits/yanqui3d/lib";
import { Stamp } from "../kits/yanqui3d/engine";
import { Words } from "../kits/yanqui3d/pieces";
import AVAIL from "./avail.json";
import AVW from "./avwin.json";

setSlug("duane01");
export const MIN1_END = 63.769;
export const MIN1_FRAMES = Math.round(MIN1_END * 30);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
export const REEL = true; // true cuando llega el reel del avatar (public/duane01/reel0.mp4)

// toma agnes si llegó; si no la foto del primer cuadro con zoom lento; si no una placa
export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.04, 1.12] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 9);
  const inner = HAS.clips.includes(k) ? <Vid id={"ltx_" + k} from={from} at={a} /> : HAS.imgs.includes(k) ? <Vid id={"img_" + k} /> :
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill>;
};

// ---------- AVATAR: ventanas pagadas (preroll 10 cuadros), desenfoque/oscurecido, borde borroso ----------
const WIN = (AVW as number[][]).filter(([ms]) => ms < MIN1_END - 1).map(([ms, me, off]) => ({ ms, me, off }));
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
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
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------- cámara del mundo en el minuto 1 (una sola, vuela entre tramos) ----------
const KF: Key[] = [
  // B · amanecer helado: desde el aire hasta el portón del vecino
  { t: 3.9, p: [-1.5, 15, 24], l: [-2.5, 1, 0], fov: 40 },
  { t: 7.3, p: [-5.2, 4.6, 12], l: [-7.2, 1.2, 0], fov: 40 },
  { t: 8.7, p: [-7.4, 1.75, 5.0], l: [-7.4, 1.2, 0], fov: 38 },
  // D · el bowl hecho hielo y el taladro
  { t: 10.85, p: [-5.75, 1.05, 2.75], l: [-6.2, 0.2, 1.05], fov: 36 },
  { t: 13.9, p: [-6.15, 0.75, 2.2], l: [-6.4, 0.2, 1.15], fov: 32 },
  { t: 14.7, p: [-9.85, 1.42, 0.45], l: [-10.6, 1.02, -0.6], fov: 34, arc: 0.2 },
  { t: 16.6, p: [-10.0, 1.38, 0.25], l: [-10.6, 1.02, -0.6], fov: 32 },
  // G · "Now walk into my garage": del vecino (azul) al taller de Duane (ámbar), visión térmica
  { t: 20.4, p: [-7.5, 2.0, 6.4], l: [-7.5, 1.3, 0], fov: 42 },
  { t: 22.2, p: [-2.4, 3.6, 10.5], l: [-2.0, 1.3, -0.4], fov: 46, arc: 0.4 },
  { t: 24.6, p: [1.8, 2.3, 6.0], l: [3.2, 1.2, -1.2], fov: 42 },
  { t: 25.8, p: [5.0, 1.85, 1.9], l: [6.9, 1.72, -0.9], fov: 36 },
  { t: 26.9, p: [6.28, 1.76, -0.86], l: [7.0, 1.75, -0.9], fov: 30 },
  // J · la tormenta de todos los inviernos
  { t: 38.9, p: [9, 11, 22], l: [-1, 1, 0], fov: 42 },
  { t: 42.7, p: [5.5, 3.6, 9], l: [3.5, 1.2, -0.5], fov: 40 },
  // K · la maceta de internet en el banco
  { t: 42.75, p: [4.6, 1.75, 2.3], l: [6.25, 1.1, 0.15], fov: 36 },
  { t: 46.3, p: [5.55, 1.38, 0.95], l: [6.25, 1.12, 0.15], fov: 30 },
  // M · de día: el sol entra por la ventana sur y los tambores se encienden
  { t: 52.0, p: [2.1, 1.7, 4.4], l: [2.05, 1.0, -2.6], fov: 46 },
  { t: 55.2, p: [-0.2, 1.55, 1.6], l: [2.0, 0.75, -2.5], fov: 44, arc: 0.15 },
  { t: 57.6, p: [0.55, 1.3, 0.1], l: [1.4, 0.7, -2.5], fov: 44 },
];
const fx = (t: number): Partial<FX> => {
  if (t < 17) return { day: 0.14, heat: 0, frost: 1, charge: 0.5 };
  if (t < 30) return { day: 0.12, heat: e(t, 20.7, 21.6) * (1 - e(t, 24.9, 25.6)), charge: 0.5, flow: 0.7 * e(t, 21, 22) };
  if (t < 42.7) return { day: 0.05, storm: 1, heat: 0 };
  if (t < 52) return { day: 0.35, pot: 1, heat: 0 };
  return { day: 1, heat: e(t, 54.3, 55.0), charge: 0.9, flow: e(t, 54.6, 55.6), shopTemp: 26 };
};
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t, KF), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><ShopWorld t={t} KF={KF} fx={fx} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const sc = (t: number, q: [number, number, number]) => screenOf(t, q, KF);

// escarcha en los bordes (garaje helado)
const Frost: React.FC<{ o: number }> = ({ o }) => o < 0.01 ? null : (
  <AbsoluteFill style={{ opacity: o, background: "radial-gradient(ellipse 70% 62% at 50% 50%, transparent 55%, rgba(170,215,255,.38) 85%, rgba(230,245,255,.7) 100%)", mixBlendMode: "screen", pointerEvents: "none" }} />
);
// chip de reloj/fecha que cae sobre el avatar
const Chip: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; col?: string; size?: number }> = ({ t, at, out, x, y, text, col = COL.ink, size = 54 }) => {
  const k = Math.min(1.1, spr(t, at)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 900 }}>
    <div style={{ transform: `rotateX(${(1 - Math.min(1, k)) * 80}deg) translateY(${(1 - Math.min(1, k)) * -60}px)`, padding: "12px 26px", borderRadius: 14, background: "linear-gradient(180deg, rgba(14,22,36,.92), rgba(8,12,20,.92))", border: `3px solid ${col}`, boxShadow: `0 24px 50px rgba(0,0,0,.6), 0 0 24px ${col}55`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 3, whiteSpace: "nowrap", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>{text}</div>
  </div>;
};
// ícono tachado (sin gas / sin leña / sin luz): placa 3D con dibujo SVG
const NoCard: React.FC<{ t: number; at: number; x: number; kind: "gas" | "wood" | "power"; fall: number }> = ({ t, at, x, kind, fall }) => {
  const k = Math.min(1.1, spr(t, at)), o = e(t, at, at + 0.08);
  if (o <= 0.01) return null;
  const ic = kind === "gas" ? <path d="M100 30 C 130 80, 160 100, 150 150 C 142 190, 58 190, 50 150 C 44 118, 70 96, 78 70 C 88 90, 96 96, 100 30 Z" fill="#5fa8ff" stroke="#bfe0ff" strokeWidth={5} />
    : kind === "wood" ? <g>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${30 + i * 8},${70 + i * 34}) rotate(${i % 2 ? 8 : -8})`}><rect width={140} height={30} rx={14} fill="#9b6a3c" stroke="#e0b07a" strokeWidth={4} /><ellipse cx={128} cy={15} rx={12} ry={14} fill="#e8c08a" /></g>)}</g>
    : <g><rect x={70} y={60} width={60} height={70} rx={10} fill="#d7d3c9" stroke="#fff" strokeWidth={4} /><rect x={82} y={30} width={10} height={34} fill="#c9c4b8" /><rect x={108} y={30} width={10} height={34} fill="#c9c4b8" /><path d="M100 130 C 100 170, 60 160, 40 185" fill="none" stroke="#d7d3c9" strokeWidth={10} strokeLinecap="round" /></g>;
  const lab = kind === "gas" ? "NO GAS" : kind === "wood" ? "NO WOOD" : "NO POWER";
  return (
    <div style={{ position: "absolute", left: x, top: 300, opacity: o, perspective: 1200, transform: `translateY(${fall * 1300}px) rotate(${fall * (kind === "wood" ? 0 : kind === "gas" ? -25 : 25)}deg)` }}>
      <div style={{ transform: `translateZ(${(1 - Math.min(1, k)) * -900}px) rotateY(${(1 - Math.min(1, k)) * -80}deg)`, width: 400, height: 380, borderRadius: 26, background: "linear-gradient(180deg, rgba(22,30,44,.96), rgba(10,14,22,.96))", boxShadow: "0 40px 90px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.18)", border: "4px solid rgba(255,255,255,.85)", textAlign: "center", fontFamily: FONT }}>
        <svg width={200} height={200} viewBox="0 0 200 200" style={{ marginTop: 24 }}>{ic}</svg>
        <div style={{ fontWeight: 900, fontSize: 50, color: COL.ink, letterSpacing: 4, textShadow: extrude(5, "#000") }}>{lab}</div>
      </div>
      <DrawX t={t} at={at + 0.35} x={30} y={30} w={340} h={320} />
    </div>
  );
};
// miniatura falsa de "FREE HEAT" (el pulgar de internet) que se tacha
const Thumb: React.FC<{ t: number; at: number; xAt: number; out: number }> = ({ t, at, xAt, out }) => {
  const k = Math.min(1, spr(t, at, 0.8)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Card3D id={HAS.imgs.includes("n_claypot") ? "img_n_claypot" : "img_av"} x={1040} y={140} w={720} h={405} ry={(1 - k) * 70 - 10} rx={4} z={(1 - k) * -1200}>
        <div style={{ position: "absolute", left: 24, top: 18, fontFamily: FONT, fontWeight: 900, fontSize: 78, color: "#ffe23a", lineHeight: 0.95, textShadow: "0 0 0 #000, 5px 5px 0 #000, -3px -3px 0 #000, 0 10px 30px #000", transform: "rotate(-4deg)" }}>FREE HEAT!!<br /><span style={{ color: "#fff", fontSize: 54 }}>NO POWER NEEDED</span></div>
        <div style={{ position: "absolute", right: 26, bottom: 24, width: 96, height: 96, borderRadius: 48, border: "10px solid #ff2d2d" }} />
      </Card3D>
      <DrawX t={t} at={xAt} x={1060} y={160} w={680} h={365} />
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-4,39 · avatar; 6 AM / JANUARY / POWER OUT DAY 2; portal al mundo =====
  if (t < 4.4) {
    L.push(<Avatar key="avA" t={t} blur={8 * e(t, 3.6, 4.2)} dark={0.4 * e(t, 3.6, 4.2)} />);
    L.push(<Chip key="c1" t={t} at={0.2} out={4.0} x={1300} y={150} text="6:00 AM" col={COL.ice} size={72} />);
    L.push(<Chip key="c2" t={t} at={1.2} out={4.0} x={1300} y={270} text="JANUARY" />);
    L.push(<Chip key="c3" t={t} at={3.3} out={4.0} x={1300} y={370} text="POWER OUT · DAY 2" col={COL.red} />);
    const r = ei(t, 3.85, 4.38);
    if (r > 0) L.push(<Portal key="pA" x={960} y={540} r={r}><World t={Math.max(3.9, t)} /></Portal>);
  }
  // ===== B · 4,39-8,85 · amanecer helado, −8 °F; el portón del vecino se abre en portal a la toma =====
  if (t >= 4.38 && t < 11.05) {
    const back = ei(t, 10.55, 11.0);
    L.push(<World key="wB" t={t < 9 ? t : Math.max(10.85, t)} />);
    if (t < 7.3) L.push(<BigNum key="m8" t={t} at={4.9} text="−8°F" x={960} y={430} size={250} col={COL.ice} edge="#123a5a" out={7.0} sub="OUTSIDE" />);
    const g = sc(Math.min(t, 8.7), [-7.5, 1.3, 2.9]);
    const pr = ei(t, 8.3, 8.85) * (1 - back);
    if (pr > 0) {
      const bowl = sc(10.85, PT.bowl);
      const x = back > 0 ? bowl.x : g.x, y = back > 0 ? bowl.y : g.y;
      L.push(<Portal key="pB" x={x} y={y} r={pr}><AbsoluteFill><Shot k="n_frozen" t={t} a={8.3} /><Frost o={0.9} /></AbsoluteFill></Portal>);
    }
    if (t > 8.85 && t < 10.6) L.push(<Tag key="br" t={t} at={9.25} x={1150} y={430} dx={170} dy={-120} text="YOUR BREATH" sub="HANGS IN THE AIR" col={COL.ice2} out={10.4} />);
  }
  // ===== D · 11-16,5 · el bowl hecho hielo, el taladro que no gira; latigazo al avatar =====
  if (t >= 11.0 && t < 16.75) {
    const wp = ei(t, 16.25, 16.7), mb = Math.sin(wp * Math.PI) * 40;
    const b = sc(t, PT.bowl), d = sc(t, PT.drill);
    L.push(<AbsoluteFill key="wD" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <World t={t} /><Frost o={0.7} />
      <Tag t={t} at={13.1} x={b.x} y={b.y} dx={220} dy={-140} text="SOLID ICE" sub="THE DOG BOWL" col={COL.ice} out={14.3} size={58} />
      <Tag t={t} at={15.3} x={d.x} y={d.y} dx={-220} dy={-130} text="WON'T TURN OVER" sub="BATTERY TOO COLD" col={COL.ice2} out={16.3} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avW" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 16.5)} /></AbsoluteFill>);
  }
  // ===== E · 16,5-20,44 · avatar desenfocado; −4 °F adentro; "MEAT LOCKER"; zoom a través hacia el mundo =====
  if (t >= 16.7 && t < 21.0) {
    const bl = e(t, 16.9, 17.3), z = ei(t, 20.0, 20.55);
    L.push(<AbsoluteFill key="wE" style={{ opacity: z > 0 ? 1 : 0 }}><World t={Math.max(20.4, t)} /></AbsoluteFill>);
    L.push(<AbsoluteFill key="avE" style={{ transformOrigin: "960px 470px", transform: `scale(${1 + z * z * 6})`, opacity: 1 - e(z, 0.55, 0.95) }}>
      <Avatar t={t} blur={12 * bl} dark={0.45 * bl} /><Frost o={0.5 * bl} />
      <BigNum t={t} at={18.4} text="−4°F" x={960} y={420} size={260} col={COL.ice} edge="#123a5a" out={19.9} sub="IN HIS GARAGE" />
      <Stamp t={t} at={19.45} text="MEAT LOCKER" x={960} y={760} out={20.0} size={92} />
    </AbsoluteFill>);
  }
  // ===== G · 20,9-27,2 · cruzamos al taller de Duane: el aire en colores térmicos; "same storm/street/lines"; al dial =====
  if (t >= 20.95 && t < 27.3) {
    L.push(<World key="wG" t={t} />);
    const nb = sc(t, [-7.5, 2.2, 0]), sh = sc(t, [3.4, 2.2, -0.5]);
    L.push(<Tag key="tN" t={t} at={21.25} x={nb.x} y={nb.y} dx={-120} dy={-110} text="−4°F" sub="HIS GARAGE" col={ironCss(0.3)} out={24.4} size={64} />);
    L.push(<Tag key="tS" t={t} at={21.45} x={sh.x} y={sh.y} dx={140} dy={-120} text="41°F" sub="MINE" col={ironCss(0.72)} out={24.4} size={64} />);
    L.push(<Words key="ws" t={t} items={[{ at: 22.3, txt: "SAME STORM" }, { at: 23.3, txt: "SAME STREET" }, { at: 24.4, txt: "SAME DEAD LINES", col: COL.amber }]} out={25.5} y={880} size={84} />);
    // escala térmica (barra) mientras dura la visión térmica
    const ho = e(t, 21.0, 21.6) * (1 - e(t, 24.8, 25.4));
    if (ho > 0.01) L.push(<div key="scale" style={{ position: "absolute", right: 60, top: 220, opacity: ho, fontFamily: FONT, fontWeight: 800, color: COL.ink, fontSize: 24, textAlign: "center" }}>
      <div>90°F</div><div style={{ width: 34, height: 420, margin: "8px auto", borderRadius: 17, border: "3px solid rgba(255,255,255,.8)", background: `linear-gradient(0deg, ${[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((u) => ironCss(u)).join(",")})` }} /><div>−15°F</div></div>);
    const dl = sc(t, PT.dial), pr = ei(t, 26.85, 27.3);
    if (pr > 0) L.push(<Portal key="pG" x={dl.x} y={dl.y} r={pr}><Shot k="d_thermo" t={t} a={26.85} /></Portal>);
  }
  // ===== F · 27,3-32,5 · Duane limpia el dial: 41 °F; ABOVE ZERO; no gas / no wood / no power =====
  if (t >= 27.3 && t < 32.7) {
    const bl = e(t, 30.5, 30.9), wp = ei(t, 32.0, 32.45), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="f" style={{ transform: `translateX(${-wp * 1920}px)`, filter: `blur(${bl * 12 + mb}px) brightness(${1 - bl * 0.4})` }}><Shot k="d_thermo" t={t} a={26.85} /></AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avF" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 32.25)} blur={10} dark={0.4} /></AbsoluteFill>);
    L.push(<BigNum key="41" t={t} at={27.9} text="41°F" x={1400} y={420} size={260} col={COL.amber} edge="#5a3410" out={30.4} />);
    L.push(<Stamp key="az" t={t} at={29.6} text="ABOVE ZERO" x={1400} y={700} out={30.4} rot={-6} size={80} />);
  }
  // tarjetas tachadas: cruzan del plano de Duane al avatar
  if (t >= 30.6 && t < 34.4) {
    const fall = (i: number) => ei(t, 33.3 + i * 0.08, 33.9 + i * 0.08);
    L.push(<NoCard key="n1" t={t} at={30.8} x={160} kind="gas" fall={fall(0)} />);
    L.push(<NoCard key="n2" t={t} at={31.7} x={760} kind="wood" fall={fall(1)} />);
    L.push(<NoCard key="n3" t={t} at={32.6} x={1360} kind="power" fall={fall(2)} />);
  }
  // ===== H · 32,45-36,07 · avatar; NOTHING BURNING; rótulo DUANE =====
  if (t >= 32.45 && t < 36.6) {
    const bl = 10 * (1 - e(t, 33.5, 34.0));
    const fl = ei(t, 36.0, 36.5);
    L.push(<AbsoluteFill key="avH" style={{ opacity: 1 - fl }}><Avatar t={t} blur={bl} dark={bl * 0.04} edge={e(t, 34.4, 34.8)} /></AbsoluteFill>);
    L.push(<Stamp key="nb" t={t} at={33.6} text="NOTHING BURNING" x={960} y={180} out={34.6} rot={-4} size={86} />);
    if (fl > 0) L.push(<AbsoluteFill key="wl" style={{ opacity: e(fl, 0.25, 0.75) }}><Shot k="s31" t={t} a={36.0} /></AbsoluteFill>);
  }
  // ===== I · 36-38,95 · fogonazo de soldadura → Duane soldando (40 años) =====
  if (t >= 36.6 && t < 39.4) {
    const o = 1 - e(t, 38.85, 39.3);
    L.push(<AbsoluteFill key="sw" style={{ opacity: o }}><Shot k="s31" t={t} a={36.0} /></AbsoluteFill>);
    if (t > 38.8) L.push(<AbsoluteFill key="wJ0" style={{ opacity: 1 - o }}><World t={t} /></AbsoluteFill>);
  }
  L.push(<Flash key="weld" t={t} at={36.25} peak={0.95} col="#d9ecff" w={0.45} />);
  if (t >= 34.5 && t < 41.8) L.push(<LowerThird key="lt" t={t} at={34.6} out={40.9} name="DUANE" l2="WELDER · WISCONSIN · 40 YEARS" l2at={35.4} />);
  // ===== J · 39,3-42,7 · la tormenta: "every single year" =====
  if (t >= 39.3 && t < 42.75) {
    L.push(<World key="wJ" t={t} />);
    L.push(<Words key="wy" t={t} items={[{ at: 41.3, txt: "EVERY." }, { at: 41.7, txt: "SINGLE." }, { at: 42.1, txt: "YEAR.", col: COL.red }]} out={42.6} y={480} size={130} />);
  }
  // ===== K · 42,75-46,33 · la maceta de internet en el banco =====
  if (t >= 42.7 && t < 46.9) {
    const wp = ei(t, 46.0, 46.45), mb = Math.sin(wp * Math.PI) * 40;
    const p = sc(t, PT.pot);
    L.push(<AbsoluteFill key="wK" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <World t={Math.max(t, 42.75)} />
      <Tag t={t} at={43.5} x={p.x} y={p.y} dx={-260} dy={-160} text="THE INTERNET SAYS" sub="HEAT A ROOM WITH THIS" col={COL.amber} out={45.9} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avK" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 46.33)} blur={12} dark={0.4} /></AbsoluteFill>);
  }
  // ===== L · 46,33-52,05 · avatar con tarjetas: maceta y velas → "so I measured it" → REAL / LIE =====
  if (t >= 46.45 && t < 52.6) {
    const bl = 12 * (1 - e(t, 50.0, 50.4)), z = ei(t, 51.75, 52.3);
    L.push(<AbsoluteFill key="wM0" style={{ opacity: z > 0 ? 1 : 0 }}><World t={Math.max(52.0, t)} /></AbsoluteFill>);
    L.push(<AbsoluteFill key="avL" style={{ transformOrigin: "960px 470px", transform: `scale(${1 + z * z * 6})`, opacity: 1 - e(z, 0.55, 0.95) }}>
      <Avatar t={t} blur={bl} dark={bl * 0.035} />
      {(() => { const k = spr(t, 46.45, 0.8), k2 = spr(t, 48.6, 0.8), sw = ei(t, 48.5, 48.9);
        return <>
          <Card3D id={HAS.clips.includes("n_claypot") ? "ltx_n_claypot" : "img_n_claypot"} at={46.45} x={260} y={190} w={720} h={405} ry={(1 - Math.min(1, k)) * 60 - 10 - sw * 40} rx={4} z={(1 - Math.min(1, k)) * -1300 - sw * 400} o={e(t, 46.45, 46.6) * (1 - e(t, 50.1, 50.4))} label="1 FLOWER POT + 4 CANDLES" labelCol={COL.amber} />
          <Card3D id={HAS.clips.includes("d_irgun") ? "ltx_d_irgun" : "img_d_irgun"} at={48.6} x={940} y={250} w={720} h={405} ry={(1 - Math.min(1, k2)) * -60 + 10} rx={4} z={(1 - Math.min(1, k2)) * -1300} o={e(t, 48.6, 48.75) * (1 - e(t, 50.1, 50.4))} label="SO I MEASURED IT" labelCol={COL.ice2} />
        </>; })()}
      <Chip t={t} at={51.3} out={52.4} x={260} y={760} text="SOME IS REAL ✓" col="#5ee38f" size={56} />
    </AbsoluteFill>);
  }
  if (t >= 52.4 && t < 53.6) L.push(<Stamp key="lie" t={t} at={52.6} text="A LOT IS A LIE" x={960} y={760} out={53.35} rot={-7} size={96} />);
  // ===== M · 52,3-57,6 · de día: sol por la ventana sur; los tambores se encienden en el mapa térmico =====
  if (t >= 52.3 && t < 58.1) {
    L.push(<World key="wM" t={t} />);
    const d = sc(t, PT.drums), w = sc(t, PT.window);
    L.push(<Tag key="sun" t={t} at={53.0} x={w.x} y={w.y} dx={220} dy={-110} text="SOUTH WINDOW" col="#ffd88a" out={54.3} />);
    L.push(<Tag key="hs" t={t} at={54.7} x={d.x} y={d.y} dx={-240} dy={-200} text="THE HEAT SOURCE" sub="4 DRUMS OF WATER" col={ironCss(0.85)} out={57.1} size={60} />);
    const d0 = sc(t, PT.drum0), pr = ei(t, 57.4, 57.95);
    if (pr > 0) L.push(<Portal key="pM" x={d0.x} y={d0.y} r={pr}><Shot k="s01" t={t} a={57.4} /></Portal>);
  }
  // ===== N · 57,95-63,77 · cómo lo armó → sus números → la seguridad que nadie pone en la miniatura =====
  if (t >= 57.95 && t < 61.1) {
    const wp = ei(t, 58.45, 58.9), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="n1" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Shot k="s01" t={t} a={57.4} /></AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="n2" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Shot k="s17" t={t} a={58.45} /></AbsoluteFill>);
    L.push(<Chip key="bi" t={t} at={57.6} out={58.5} x={1250} y={160} text="HOW I BUILT IT" col={COL.amber} />);
    L.push(<Chip key="nu1" t={t} at={59.1} out={60.9} x={1250} y={160} text="DAY  85°F" col={ironCss(0.88)} />);
    L.push(<Chip key="nu2" t={t} at={59.6} out={60.9} x={1250} y={270} text="NIGHT  60°F" col={ironCss(0.62)} />);
  }
  if (t >= 60.6 && t < 63.8) {
    const z = ei(t, 60.6, 61.1);
    L.push(<AbsoluteFill key="p1" style={{ transform: `translateY(${-z * 1080}px)` }}><Shot k="s17" t={t} a={58.45} /></AbsoluteFill>);
    L.push(<AbsoluteFill key="p2" style={{ transform: `translateY(${(1 - z) * 1080}px)`, filter: `blur(${e(t, 61.9, 62.3) * 8}px) brightness(${1 - e(t, 61.9, 62.3) * 0.35})` }}><Shot k="s24" t={t} a={60.6} /></AbsoluteFill>);
    L.push(<Stamp key="saf" t={t} at={61.15} text="THE SAFETY PART" x={560} y={250} out={63.4} rot={-5} size={82} />);
    L.push(<Thumb key="th" t={t} at={61.9} xAt={63.0} out={63.6} />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
