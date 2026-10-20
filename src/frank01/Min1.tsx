// frank01 · MINUTO 1 (0 → 84,58 s), a mano, vara gary01: un solo hilo visual, cero cortes secos.
// avatar → (portal) buzón real → (zoom a través: la toma baja a la vereda = el mundo) vereda 3D con la grieta, el lápiz,
// el otoño pasado → (portal) toma a ras → mundo desde arriba: crece hasta los escalones → (latigazo) avatar
// → el avatar SE PARTE por una grieta y abre el CORTE: lluvia, agua bajo la losa, helada, empuja → (portal) el dedo en la grieta
// → losa levantada → avatar → contratista (30 s) → martillo neumático, $4.000 → avatar FRANK → bloque, 38 años
// → la lechada llena desde el fondo ($2) → avatar con fichas → la línea de 1997 → maqueta entera, el parche salta.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SlabWorld, PT, screenOf, camSpeed } from "./slab3d";
import { ST } from "./states";
import { BigNum, COL, Chips, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr, setSlug, setDurs } from "../kits/yanqui3d/lib";
import { Stamp } from "../kits/yanqui3d/engine";
import { Timer, Words } from "../kits/yanqui3d/pieces";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("frank01");
setDurs((AVAIL as { dur?: Record<string, number> }).dur);
export const T0 = 84.577;
export const MIN1_FRAMES = Math.round(T0 * 30);

// ---------- tomas agnes: mp4 si llegó; si no la foto; si no un fondo ----------
const HAS = AVAIL as { clips: string[]; imgs: string[]; reel?: boolean };
const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.04, 1.12] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const inner = HAS.clips.includes(k) ? <Vid id={"ltx_" + k} from={from} at={a} /> : HAS.imgs.includes(k) ? <Vid id={"img_" + k} /> :
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#2a2f36,#101317)", color: "#667", fontFamily: FONT, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill>;
};

// ---------- AVATAR: ventanas pagadas (avwin), preroll 10 cuadros ----------
const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win.filter((w) => w.ms < T0 + 1);
const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = !HAS.reel ? <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 32} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.7 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  ));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------- mundo 3D con blur de movimiento real ----------
export const World: React.FC<{ t: number; blur?: number }> = ({ t, blur = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5) + blur, by: Math.min(3.5, v0.by * 0.5) + blur };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><SlabWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// latigazo lateral entre dos capas (k: 0→1)
const HB: React.FC<{ id: string; x: number }> = ({ id, x }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" width="140%"><feGaussianBlur stdDeviation={`${x} 0`} /></filter></svg>;
const whip = (k: number, prev: React.ReactNode, cur: React.ReactNode, key: string, dir = -1) => {
  const out = k < 0.5, k2 = out ? k * 2 : (1 - k) * 2, b = Math.round(90 * k2);
  return [
    <AbsoluteFill key={key} style={{ transform: `translateX(${(out ? dir : -dir) * k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: b ? `url(#${key}h${b})` : undefined }}>{b ? <HB id={`${key}h${b}`} x={b} /> : null}{out ? prev : cur}</AbsoluteFill>,
    k2 > 0.4 ? <AbsoluteFill key={key + "l"} style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.5) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} /> : null,
  ];
};
// zoom a través (la capa de adelante crece y se desvanece revelando la de atrás, que viene de chica)
const zoomThru = (k: number, prev: React.ReactNode, cur: React.ReactNode, key: string, o: [number, number] = [960, 540]) => {
  const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k));
  return [
    <AbsoluteFill key={key + "c"} style={{ transformOrigin: `${o[0]}px ${o[1]}px`, transform: `scale(${0.6 + 0.4 * z})`, opacity: e(k, 0.25, 0.6), filter: b ? `blur(${b * 0.5}px)` : undefined }}>{cur}</AbsoluteFill>,
    <AbsoluteFill key={key + "p"} style={{ transformOrigin: `${o[0]}px ${o[1]}px`, transform: `scale(${1 + z * z * 5})`, opacity: 1 - e(k, 0.35, 0.75), filter: b ? `blur(${b}px)` : undefined }}>{prev}</AbsoluteFill>,
  ];
};

// grieta que parte la pantalla (el avatar se raja en dos y abre el corte)
const CRACK = Array.from({ length: 23 }, (_, i) => { const y = (i / 22) * 1080; const x = 960 + Math.sin(i * 1.7) * 38 + Math.sin(i * 4.3) * 16 + (i % 2 ? 22 : -22); return [x, y]; });
const crackPath = (d: number) => CRACK.map(([x, y]) => `${x}px ${y}px`).join(",") + (d > 0 ? "" : "");
const Split: React.FC<{ t: number; a: number; children: React.ReactNode; behind: React.ReactNode }> = ({ t, a, children, behind }) => {
  const draw = e(t, a, a + 0.45), open = ei(t, a + 0.5, a + 1.15);
  const L = `polygon(0px 0px, ${crackPath(0)}, 0px 1080px)`;
  const R = `polygon(1920px 0px, ${CRACK.map(([x, y]) => `${x}px ${y}px`).join(",")}, 1920px 1080px)`;
  const n = Math.max(2, Math.round(CRACK.length * draw));
  const line = CRACK.slice(0, n).map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <AbsoluteFill>
      {open > 0 && <AbsoluteFill>{behind}</AbsoluteFill>}
      <AbsoluteFill style={{ clipPath: L, transform: `perspective(1600px) translateX(${-open * 1100}px) rotateY(${open * 28}deg)`, transformOrigin: "0% 50%", boxShadow: "0 0 80px #000" }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: R, transform: `perspective(1600px) translateX(${open * 1100}px) rotateY(${-open * 28}deg)`, transformOrigin: "100% 50%" }}>{children}</AbsoluteFill>
      {open < 0.3 && draw > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - open / 0.3 }}>
          <polyline points={line} fill="none" stroke="#0b0a09" strokeWidth={10 + 16 * e(t, a + 0.3, a + 0.5)} strokeLinejoin="round" />
          <polyline points={line} fill="none" stroke="rgba(255,178,87,.9)" strokeWidth={2.5} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px #ffb257)" }} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

// flecha que empuja hacia arriba (el hielo levanta la losa)
const Push: React.FC<{ t: number; at: number; out: number; x: number; y: number; col?: string; label?: string }> = ({ t, at, out, x, y, col = COL.ice2, label }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const k = Math.min(1.1, spr(t, at)), bob = Math.sin((t - at) * 9) * 8;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, opacity: o, transform: `translate(-50%,-100%) scale(${k})`, textAlign: "center" }}>
      <svg width={120} height={170} style={{ filter: `drop-shadow(0 0 14px ${col}) drop-shadow(0 10px 18px rgba(0,0,0,.6))` }}><path d="M60 6 L112 70 L80 70 L80 166 L40 166 L40 70 L8 70 Z" fill={col} stroke="#0b1424" strokeWidth={5} /></svg>
      {label && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 4, color: col, textShadow: extrude(6, "rgba(0,0,0,.6)"), marginTop: 6 }}>{label}</div>}
    </div>
  );
};

// año grande con sello verde
const Year: React.FC<{ t: number; at: number; subAt: number; out: number }> = ({ t, at, subAt, out }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at)), k2 = spr(t, subAt, 1.3);
  return (
    <div style={{ position: "absolute", left: 1380, top: 330, opacity: o, transform: `translate(-50%,-50%) perspective(900px) rotateY(-14deg) scale(${k})`, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 230, lineHeight: 1, color: COL.ink, textShadow: extrude(14, "#4a3d2c") }}>1997</div>
      {t >= subAt && <div style={{ display: "inline-block", marginTop: 26, transform: `rotate(-6deg) scale(${2.2 - 1.2 * Math.min(1, k2)})`, border: "9px solid #5ee38f", borderRadius: 14, padding: "4px 26px", fontFamily: FONT, fontWeight: 900, fontSize: 78, color: "#5ee38f", background: "rgba(0,30,10,.45)", boxShadow: "0 0 30px rgba(94,227,143,.45)", letterSpacing: 3 }}>STILL CLOSED ✓</div>}
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0 → 2,9 · avatar; "first warm day of spring"; portal al buzón real =====
  if (t < 2.95) {
    L.push(<Avatar key="avA" t={t} edge={0.6} />);
    L.push(<Tag key="tA" t={t} at={0.68} x={1500} y={300} dx={-120} dy={-80} text="FIRST WARM DAY" sub="OF SPRING" col={COL.amber} out={2.3} />);
    const r = ei(t, 2.45, 2.95);
    if (r > 0) L.push(<Portal key="pA" x={1240} y={560} r={r}><Shot k="m01" t={t} a={2.45} /></Portal>);
  }
  // ===== B · 2,9 → 5,9 · el buzón; la toma baja a la vereda → zoom a través al mundo =====
  if (t >= 2.9 && t < 5.95) {
    const k = ei(t, 5.35, 5.95);
    const shot = <Shot k="m01" t={t} a={2.45} />;
    if (k > 0) L.push(...zoomThru(k, shot, <World t={Math.max(t, 5.5)} />, "zB", [960, 760]));
    else L.push(<AbsoluteFill key="sB">{shot}</AbsoluteFill>);
    L.push(<Tag key="tMail" t={t} at={3.44} x={760} y={420} dx={-150} dy={-110} text="GETTING THE MAIL" out={5.0} size={40} />);
  }
  // ===== C · 5,9 → 19,4 · la vereda 3D: la grieta, fina como lápiz; (portal) toma a ras; el otoño pasado; crece hasta los escalones =====
  if (t >= 5.9 && t < 19.95) {
    const m2 = ei(t, 12.45, 12.95) * (1 - ei(t, 13.95, 14.4));
    const w = t < 19.35 ? <World t={t} /> : null;
    if (w) L.push(<AbsoluteFill key="wC">{w}</AbsoluteFill>);
    const ct = screenOf(t, PT.crackTop);
    L.push(<Tag key="tCr" t={t} at={8.34} x={ct.x} y={ct.y} dx={190} dy={-140} text="A CRACK" col={COL.amber} out={9.3} />);
    L.push(<Tag key="tTh" t={t} at={9.46} x={ct.x} y={ct.y} dx={-200} dy={-150} text="THIN" out={11.2} />);
    L.push(<Tag key="tPn" t={t} at={11.34} x={ct.x} y={ct.y} dx={210} dy={-170} text="PENCIL LINE" col={COL.amber} out={12.4} />);
    if (m2 > 0) {
      const cp = screenOf(12.45, PT.crackTop);
      L.push(<Portal key="pM2" x={cp.x} y={cp.y} r={m2}><Shot k="m02" t={t} a={12.45} /></Portal>);
      L.push(<Tag key="tSeen" t={t} at={12.8} x={960} y={300} dx={0} dy={-60} text="YOU'VE SEEN IT BEFORE" out={13.9} size={44} />);
    }
    const gh = screenOf(t, [0.08, 0.06, 0.2]);
    L.push(<Tag key="tLF" t={t} at={14.36} x={gh.x} y={gh.y} dx={-260} dy={-90} text="LAST FALL" sub="HALF THAT LONG" col={COL.amber} out={16.2} />);
    const far = screenOf(t, PT.crackFar), grass = screenOf(t, [0.8, 0.06, 4.0]);
    L.push(<Tag key="tGr" t={t} at={17.42} x={grass.x} y={grass.y} dx={-160} dy={-120} text="THE GRASS" col="#a8d38a" out={19.2} size={40} />);
    L.push(<Tag key="tSt" t={t} at={18.62} x={far.x} y={far.y} dx={180} dy={-120} text="ALMOST TO THE STEPS" col={COL.red} out={19.3} size={40} />);
    if (t >= 19.35) L.push(...whip(ei(t, 19.35, 19.95), <World t={19.35} />, <Avatar t={t} />, "wC2"));
  }
  // ===== D · 19,95 → 22,4 · avatar; "what you can't see" → el avatar SE PARTE y abre el corte =====
  if (t >= 19.95 && t < 22.5) {
    L.push(<Split key="spl" t={t} a={21.3} behind={<World t={t} />}><Avatar t={t} /></Split>);
    L.push(<Words key="wCant" t={t} items={[{ at: 20.78, txt: "WHAT YOU CAN'T SEE", col: COL.amber }]} out={21.5} y={860} size={90} />);
  }
  // ===== E · 22,4 → 34,0 · EL CORTE: lluvia, el agua baja, queda bajo la losa, de noche se congela, crece, empuja; primavera =====
  if (t >= 22.45 && t < 34.05) {
    L.push(<World key="wE" t={t} />);
    const cs = screenOf(t, PT.crackSec), un = screenOf(t, PT.under), sr = screenOf(t, PT.slabR), sl = screenOf(t, PT.slabSec), gv = screenOf(t, PT.gravel);
    L.push(<Tag key="tLosa" t={t} at={22.5} x={sl.x} y={sl.y} dx={-160} dy={-140} text="THE SLAB" out={24.0} size={40} />);
    L.push(<Tag key="tGrav" t={t} at={22.9} x={gv.x} y={gv.y} dx={-170} dy={110} text="GRAVEL & SAND" col={COL.dim} out={24.0} size={36} />);
    L.push(<Tag key="tRain" t={t} at={23.18} x={cs.x} y={cs.y} dx={200} dy={-200} text="EVERY RAIN" col={COL.ice} out={25.6} />);
    L.push(<Tag key="tIn" t={t} at={24.38} x={cs.x} y={cs.y} dx={-220} dy={-120} text="RUNS DOWN IN" col={COL.ice} out={26.3} />);
    L.push(<Tag key="tUn" t={t} at={26.46} x={un.x} y={un.y} dx={240} dy={100} text="UNDER THE SLAB" col={COL.ice} out={28.6} />);
    L.push(<Tag key="tFr" t={t} at={28.0} x={un.x} y={un.y} dx={-240} dy={110} text="FREEZES" sub="EVERY NIGHT" col={COL.ice2} out={30.6} />);
    L.push(<Tag key="tIce" t={t} at={29.38} x={un.x} y={un.y} dx={230} dy={-80} text="ICE GROWS" col={COL.ice2} out={30.8} size={52} />);
    L.push(<Push key="pu" t={t} at={30.9} out={32.2} x={sr.x} y={sr.y - 30} label="PUSH" />);
    L.push(<Words key="wSp" t={t} items={[{ at: 32.04, txt: "NEXT SPRING", col: COL.amber }]} out={33.5} y={190} size={96} />);
    const r = ei(t, 33.5, 34.05), cp = screenOf(33.5, PT.crackTop);
    if (r > 0) L.push(<Portal key="pM4" x={cp.x} y={cp.y} r={r}><Shot k="m04" t={t} a={33.5} /></Portal>);
  }
  // ===== F · 34,0 → 36,6 · el dedo entra en la grieta =====
  if (t >= 34.0 && t < 37.15) {
    const k = ei(t, 36.55, 37.15);
    const shot = <AbsoluteFill><Shot k="m04" t={t} a={33.5} /><Tag t={t} at={34.3} x={1000} y={560} dx={-260} dy={-200} text="A GAP" sub="YOU CAN STICK YOUR FINGER IN" col={COL.amber} out={36.3} /></AbsoluteFill>;
    if (k > 0) L.push(...zoomThru(k, shot, <World t={Math.max(t, 36.6)} />, "zF", [1000, 560]));
    else L.push(<AbsoluteFill key="sF">{shot}</AbsoluteFill>);
  }
  // ===== G · 36,6 → 39,9 · la losa levantada y desgranada =====
  if (t >= 37.1 && t < 40.4) {
    const w = <World t={Math.min(t, 39.9)} />;
    if (t < 39.9) L.push(<AbsoluteFill key="wG">{w}</AbsoluteFill>);
    const sr = screenOf(t, PT.slabR), ct = screenOf(t, PT.crackTop);
    L.push(<Tag key="tCrum" t={t} at={37.08} x={ct.x} y={ct.y} dx={-220} dy={-140} text="CRUMBLING" col={COL.red} out={39.6} />);
    L.push(<Push key="pu2" t={t} at={39.0} out={39.85} x={sr.x + 60} y={sr.y - 20} col={COL.red} label="LIFTING" />);
    if (t >= 39.9) L.push(...whip(ei(t, 39.9, 40.4), w, <Avatar t={t} />, "wG2", 1));
  }
  // ===== H · 40,4 → 41,7 · avatar "so you call a guy" → latigazo al contratista =====
  if (t >= 40.4 && t < 42.25) {
    if (t < 41.65) L.push(<Avatar key="avH" t={t} />);
    else L.push(...whip(ei(t, 41.65, 42.25), <Avatar t={t} />, <Shot k="m05" t={t} a={41.65} />, "wH"));
    L.push(<Tag key="tGuy" t={t} at={40.62} x={1400} y={420} dx={-60} dy={-140} text="CALL A GUY" col={COL.amber} out={41.6} size={44} />);
  }
  // ===== I · 42,2 → 46,4 · el contratista: 30 segundos; la sección entera =====
  if (t >= 42.25 && t < 46.95) {
    const k = ei(t, 46.35, 46.95);
    const shot = <Shot k="m05" t={t} a={41.65} />;
    L.push(k > 0 ? <AbsoluteFill key="iF" style={{ transform: `translateY(${-k * 1080}px)`, filter: `blur(${Math.sin(k * Math.PI) * 18}px)` }}>{shot}</AbsoluteFill> : <AbsoluteFill key="iS">{shot}</AbsoluteFill>);
    if (k > 0) L.push(<AbsoluteFill key="iN" style={{ transform: `translateY(${(1 - k) * 1080}px)`, filter: `blur(${Math.sin(k * Math.PI) * 18}px)` }}><Shot k="m06" t={t} a={46.35} /></AbsoluteFill>);
    L.push(<Timer key="tm" t={t} at={42.34} out={45.0} secs={30} unit="" label="SECONDS" x={1500} y={430} />);
    L.push(<Stamp key="whole" t={t} at={44.34} text="WHOLE SECTION" x={760} y={780} out={46.2} size={96} />);
  }
  // ===== J · 46,9 → 52,4 · martillo neumático; TEAR / HAUL / POUR; $4.000 =====
  if (t >= 46.95 && t < 52.45) {
    const k = ei(t, 51.83, 52.43);
    const shot = <Shot k="m06" t={t} a={46.35} />;
    if (k > 0) L.push(...whip(k, shot, <Avatar t={t} />, "wJ"));
    else L.push(<AbsoluteFill key="jS">{shot}</AbsoluteFill>);
  }
  if (t >= 46.3 && t < 52.0) {
    L.push(<Words key="wTear" t={t} items={[{ at: 46.44, txt: "TEAR IT OUT" }, { at: 47.3, txt: "HAUL IT AWAY" }, { at: 48.32, txt: "POUR NEW", col: COL.amber }]} out={49.2} y={300} size={110} />);
    L.push(<BigNum key="4k" t={t} at={49.38} text="$4,000" size={270} col={COL.red} edge="#4a1712" out={51.6} sub="MAYBE MORE" />);
  }
  // ===== K · 52,4 → 57,3 · avatar: FRANK, albañil, New Jersey, 50 años =====
  if (t >= 52.43 && t < 57.85) {
    const k = ei(t, 57.25, 57.85);
    L.push(<AbsoluteFill key="kA"><Avatar t={t} /></AbsoluteFill>);
    if (k > 0) L.push(<Portal key="pK" x={560} y={540} r={k}><Shot k="m09" t={t} a={57.25} /></Portal>);
  }
  if (t >= 52.0 && t < 58.2) L.push(<LowerThird key="lt" t={t} at={52.12} out={57.6} name="FRANK" l2="MASON · NEW JERSEY · 50 YEARS" l2at={54.08} />);
  // ===== L · 57,8 → 59,9 · Frank asentando un bloque: BRICK / BLOCK / STONE / CONCRETE =====
  if (t >= 57.85 && t < 60.45) {
    const k = ei(t, 59.85, 60.45);
    const shot = <Shot k="m09" t={t} a={57.25} />;
    if (k > 0) L.push(...zoomThru(k, shot, <Shot k="m07" t={t} a={59.85} />, "zL"));
    else L.push(<AbsoluteFill key="lS">{shot}</AbsoluteFill>);
  }
  if (t >= 56.6 && t < 60.2) L.push(<Words key="wMat" t={t} items={[{ at: 56.8, txt: "BRICK" }, { at: 57.3, txt: "BLOCK" }, { at: 57.6, txt: "STONE" }, { at: 59.2, txt: "CONCRETE", col: COL.amber }]} out={59.9} y={860} size={96} />);
  // ===== M · 60,4 → 64,8 · Frank vierte la lechada: 38 AÑOS =====
  if (t >= 60.45 && t < 65.4) {
    const k = ei(t, 64.8, 65.4);
    const shot = <Shot k="m07" t={t} a={59.85} />;
    if (k > 0) { const sp = screenOf(64.8, PT.crackSec); L.push(<AbsoluteFill key="mS">{shot}</AbsoluteFill>); L.push(<Portal key="pM" x={960} y={560} r={k}><World t={Math.max(t, 64.8)} /></Portal>); void sp; }
    else L.push(<AbsoluteFill key="mS">{shot}</AbsoluteFill>);
    L.push(<BigNum key="38" t={t} at={60.3} text="38 YEARS" x={1340} y={330} size={170} out={62.9} sub="SEALING CRACKS" />);
    L.push(<Tag key="tLiq" t={t} at={64.4} x={960} y={620} dx={-200} dy={-160} text="A LIQUID" col={COL.amber} out={65.2} size={44} />);
  }
  // ===== N · 65,4 → 67,8 · la lechada llena la grieta desde el fondo: $2 =====
  if (t >= 65.4 && t < 67.85) {
    const k = ei(t, 67.25, 67.85);
    const w = <World t={Math.min(t, 67.25)} />;
    if (k > 0) L.push(...whip(k, w, <Avatar t={t} edge={0.8} />, "wN"));
    else L.push(<AbsoluteFill key="nW">{w}</AbsoluteFill>);
    const cs = screenOf(Math.min(t, 67.25), PT.crackSec);
    L.push(<Tag key="tBot" t={t} at={65.6} x={cs.x} y={cs.y + 60} dx={230} dy={110} text="FILLS FROM THE BOTTOM" col={COL.ice2} out={67.2} size={40} />);
  }
  if (t >= 65.3 && t < 67.6) L.push(<BigNum key="2d" t={t} at={65.5} text="$2" x={1460} y={340} size={300} col="#9df0b4" edge="#1f5a36" out={67.2} sub="A BATCH" />);
  // ===== O · 67,8 → 71,7 · avatar: CEMENT / WATER / + ? =====
  if (t >= 67.85 && t < 72.25) {
    const k = ei(t, 71.65, 72.25);
    const av = <Avatar t={t} edge={0.8} />;
    if (k > 0) L.push(...whip(k, av, <Shot k="m08" t={t} a={71.65} />, "wO", 1));
    else L.push(<AbsoluteFill key="oA">{av}</AbsoluteFill>);
  }
  if (t >= 67.3 && t < 71.6) L.push(<Chips key="ch1" t={t} at={67.4} items={["CEMENT", "WATER", "+ ?"]} out={71.3} />);
  if (t >= 69.2 && t < 71.6) L.push(<Tag key="drw" t={t} at={69.9} x={1300} y={720} dx={60} dy={-170} text="ALREADY IN A DRAWER" col={COL.amber} out={71.3} size={40} />);
  // ===== P · 72,2 → 79,1 · la línea vieja reparada: 1997, STILL CLOSED =====
  if (t >= 72.25 && t < 79.2) {
    const k = ei(t, 78.6, 79.2);
    const shot = <Shot k="m08" t={t} a={71.65} />;
    if (k > 0) L.push(...zoomThru(k, shot, <World t={Math.max(t, 78.6)} />, "zP", [960, 700]));
    else L.push(<AbsoluteFill key="pS">{shot}</AbsoluteFill>);
    L.push(<Tag key="tMine" t={t} at={73.0} x={820} y={640} dx={-180} dy={-180} text="MY OWN HOUSE" out={74.0} size={42} />);
    L.push(<Year key="yr" t={t} at={74.2} subAt={75.4} out={77.9} />);
  }
  // ===== Q · 79,1 → 84,6 · la maqueta entera: MIX · PUT IN · MISTAKES; el parche salta =====
  if (t >= 79.2) {
    L.push(<World key="wQ" t={t} />);
    L.push(<Chips key="ch2" t={t} at={79.8} items={["HOW I MIX IT", "HOW I PUT IT IN", "THE MISTAKES"]} out={83.0} y={880} />);
    const ct = screenOf(t, PT.crackTop);
    L.push(<Tag key="tPop" t={t} at={83.3} x={ct.x} y={ct.y - 40} dx={200} dy={-150} text="POP!" col={COL.red} out={84.5} size={64} />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
