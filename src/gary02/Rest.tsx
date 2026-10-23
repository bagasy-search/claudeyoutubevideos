// gary02 · DEL 1:39 AL FINAL (99,05 → 1037,4 s). Misma vara que el minuto 1: una base por frase (foto de Gary haciendo /
// la arena 3D de los tres contendientes / la casa en corte / avatar) y CERO cortes secos — cada cambio de base es una transición
// (latigazo, portal, zoom a través, giro, empuje, fogonazo) y las piezas 2.5D viven en una capa aparte que CRUZA las transiciones.
// Tiempos = segundos reales de la voz (captions). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { HouseWorld, camSpeed } from "./house3d";
import { ArenaWorld, AKey, PED } from "./arena3d";
import { BigNum, COL, Chips, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";
import { Stamp, Price, MIN1_END } from "./Min1";
import { CheckList, ColdBattery, Mistake, MistakesDeal, NextCard, StepTitle, Toggle, Versus, Words } from "./comps2";
import AVW from "./avwin.json";
import AVAIL from "./rest_avail.json";

export const T0 = MIN1_END, TEND = 1037.4;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// ---------- tomas: mp4 LTX si llegó; si no la foto con zoom lento; si no un fondo ----------
const HAS = AVAIL as { clips: string[]; imgs: string[] };
const Clip: React.FC<{ k: string; a: number; z?: [number, number]; dur?: number; pan?: number }> = ({ k, a, z = [1.03, 1.12], dur = 7, pan = 0 }) => {
  const t = useCurrentFrame() / 30, q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const inner = HAS.clips.includes(k) ? <Vid id={"ltx_" + k} at={a} /> : HAS.imgs.includes(k) ? <Vid id={"img_" + k} /> :
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc}) translateX(${pan * (q - 0.5) * 40}px)` }}>{inner}</AbsoluteFill>;
};

// ---------- avatar: tramos visibles pagados (avwin.pieces); el reel corre desde off + (a - ms) ----------
type AW = { ms: number; me: number; off: number; pieces: [number, number][] };
const VIS = (AVW as { win: AW[] }).win.flatMap((w) => w.pieces.map(([a, b]) => ({ a, b, r: w.off + (a - w.ms) })));
const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = VIS.filter((v) => v.b > T0).map((v, i) => (
    <Sequence key={i} from={s(v.a) - 10} durationInFrames={s(v.b - v.a) + 34} layout="none">
      <AbsoluteFill style={{ opacity: t >= v.a - 0.3 && t < v.b + 0.7 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(v.r) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  ));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
      {false && edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
const soft = (t: number, spans: [number, number][], amt = 14) => spans.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 0.35) * (1 - e(t, b, b + 0.35))), 0) * amt;

// ---------- la arena (otra cámara por beat: de una pose a otra) y la casa en corte (re-usando su propia línea de tiempo) ----------
type Pose = { p: [number, number, number]; l: [number, number, number]; fov?: number };
const WIDE: Pose = { p: [0, 2.1, 8.6], l: [0, 1.1, 0], fov: 40 };
const WIDE2: Pose = { p: [2.4, 1.9, 7.6], l: [0, 1.1, 0], fov: 40 };
const near = (i: number, side = 1): Pose => ({ p: [PED[i][0] + 0.9 * side, 1.75, 2.7], l: [PED[i][0], 1.2, 0], fov: 36 });
const near2 = (i: number, side = 1): Pose => ({ p: [PED[i][0] - 0.5 * side, 1.6, 2.35], l: [PED[i][0], 1.2, 0], fov: 34 });
const Arena: React.FC<{ t: number; a: number; d: number; A: Pose; B: Pose; on?: [number, number, number]; blur?: number }> = ({ t, a, d, A, B, on = [1, 1, 1], blur = 0 }) => {
  const keys: AKey[] = [{ t: a, ...A }, { t: a + d, ...B }];
  return <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(.75)` : undefined }}><ArenaWorld t={t} keys={keys} on={on} run={on[0]} pct="100%" /></AbsoluteFill>;
};
const House: React.FC<{ t: number; a: number; t0: number }> = ({ t, a, t0 }) => {
  const tt = t0 + (t - a);
  const v0 = camSpeed(tt), bx = Math.min(5, v0.bx * 0.5), by = Math.min(3.5, v0.by * 0.5), id = "hb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: bx + by > 0.6 ? `url(#${id})` : undefined }}><HouseWorld t={tt} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const Dark: React.FC<{ col?: string }> = ({ col = "#0c0f14" }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${col}, #030405)` }} />;

// ---------- transiciones entre bases ----------
type Tr = "whip" | "whipL" | "portal" | "zoom" | "flip" | "push" | "light" | "cut";
const DUR: Record<Tr, number> = { whip: 0.5, whipL: 0.5, portal: 0.6, zoom: 0.55, flip: 0.6, push: 0.55, light: 0.5, cut: 0 };
const HB: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>;
const transition = (tr: Tr, k: number, prev: React.ReactNode, cur: React.ReactNode, p: [number, number]) => {
  const L: React.ReactNode[] = [];
  if (tr === "whip" || tr === "whipL") {
    const out = k < 0.5, k2 = out ? k * 2 : (1 - k) * 2, b = Math.round(90 * k2), d = tr === "whip" ? -1 : 1, id = `wb${b}`;
    L.push(<AbsoluteFill key="w" style={{ transform: `translateX(${(out ? d : -d) * k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={0} /> : null}{out ? prev : cur}</AbsoluteFill>);
    if (k2 > 0.4) L.push(<AbsoluteFill key="wl" style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.5) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} />);
  } else if (tr === "portal") {
    L.push(<AbsoluteFill key="pp">{prev}</AbsoluteFill>);
    L.push(<Portal key="pc" x={p[0]} y={p[1]} r={ei(k, 0, 1) * 0.999 + 0.001}>{cur}</Portal>);
  } else if (tr === "zoom") {
    const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k)), id = `zb${b}`;
    L.push(<AbsoluteFill key="zc" style={{ transform: `scale(${1.35 - 0.35 * z})` }}>{cur}</AbsoluteFill>);
    L.push(<AbsoluteFill key="zp" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, transform: `scale(${1 + 3.2 * z})`, opacity: 1 - e(k, 0.35, 0.9), filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={b} /> : null}{prev}</AbsoluteFill>);
  } else if (tr === "flip") {
    const out = k < 0.5, a = out ? ei(k * 2, 0, 1) * 90 : (1 - ei((k - 0.5) * 2, 0, 1)) * -90;
    L.push(<AbsoluteFill key="fb" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a222c, #05070a)" }} />);
    L.push(<AbsoluteFill key="ff" style={{ perspective: 2200 }}><AbsoluteFill style={{ transform: `translateZ(${-Math.sin(Math.PI * k) * 500}px) rotateY(${a}deg)`, borderRadius: 30 * Math.sin(Math.PI * k), overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.8)" }}>{out ? prev : cur}</AbsoluteFill></AbsoluteFill>);
  } else if (tr === "push") {
    const z = ei(k, 0, 1), b = Math.round(60 * Math.sin(Math.PI * k)), id = `pb${b}`;
    L.push(<AbsoluteFill key="up" style={{ transform: `translateY(${-z * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={0} y={b} /> : null}{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="uc" style={{ transform: `translateY(${(1 - z) * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{cur}</AbsoluteFill>);
  } else if (tr === "light") {
    L.push(<AbsoluteFill key="lp">{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="lc" style={{ opacity: e(k, 0.25, 0.75) }}>{cur}</AbsoluteFill>);
    const g = Math.sin(Math.PI * k);
    L.push(<AbsoluteFill key="ll" style={{ background: `radial-gradient(ellipse 80% 70% at ${30 + 40 * k}% 45%, rgba(255,236,200,${0.95 * g}), rgba(255,170,90,${0.35 * g}) 50%, transparent 80%)`, mixBlendMode: "screen" }} />);
  } else L.push(<AbsoluteFill key="c">{cur}</AbsoluteFill>);
  return L;
};

// ---------- piezas propias de este video ----------
const op = (t: number, a: number, out: number) => e(t, a - 0.05, a + 0.15) * (1 - e(t, out, out + 0.3));
// recibo con filas de texto libre y total escrito
const Bill: React.FC<{ t: number; title: string; rows: { at: number; item: string; val: string }[]; total: { at: number; txt: string; col?: string }; x: number; y: number; out: number; rot?: number }> = ({ t, title, rows, total, x, y, out, rot = -14 }) => {
  const o = op(t, rows[0].at, out); if (o <= 0.01) return null;
  const shown = rows.filter((r) => t >= r.at), H = 130 + shown.length * 54 + (t >= total.at ? 96 : 0), k = Math.min(1, spr(t, rows[0].at, 0.9));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ transform: `rotateY(${rot}deg) rotateX(4deg) rotateZ(1.5deg) translateY(${(1 - k) * 200}px)`, width: 600, height: H, background: "linear-gradient(180deg,#fbfaf6,#efece3)", borderRadius: 4, boxShadow: "0 40px 80px rgba(0,0,0,.65)", padding: "28px 34px", fontFamily: "'Courier New', monospace", color: "#1c1c1c", overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, #000 calc(100% - 14px), transparent)" } as React.CSSProperties}>
        <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 3, textAlign: "center", borderBottom: "2px dashed #999", paddingBottom: 10, marginBottom: 12 }}>{title}</div>
        {shown.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 31, fontWeight: 700, lineHeight: "54px", opacity: e(t, r.at, r.at + 0.15) }}><span>{r.item}</span><span>{r.val}</span></div>)}
        {t >= total.at && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 46, fontWeight: 900, borderTop: "2px dashed #999", marginTop: 10, paddingTop: 12, color: total.col ?? "#b3261e", transform: `scale(${Math.min(1.08, spr(t, total.at))})`, transformOrigin: "100% 50%" }}><span>TOTAL</span><span>{total.txt}</span></div>}
      </div>
    </div>
  );
};
// onda pura vs onda "modificada" (escalones) que se dibujan
const Waves: React.FC<{ t: number; at: number; at2: number; out: number }> = ({ t, at, at2, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const W = 760, Hh = 150, n = 160;
  const pure = Array.from({ length: n + 1 }, (_, i) => `${(i / n) * W},${Hh / 2 - Math.sin((i / n) * Math.PI * 4) * 60}`).join(" ");
  const mod = Array.from({ length: n + 1 }, (_, i) => { const v = Math.sin((i / n) * Math.PI * 4); return `${(i / n) * W},${Hh / 2 - (v > 0.38 ? 60 : v < -0.38 ? -60 : 0)}`; }).join(" ");
  const row = (pts: string, a: number, lab: string, col: string, ok: boolean) => {
    const k = ei(t, a, a + 1.2), kk = Math.min(1, spr(t, a, 1));
    return (
      <div style={{ marginBottom: 40, opacity: e(t, a - 0.05, a + 0.15), transform: `translateX(${(1 - kk) * -120}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 5, color: col, textShadow: "0 4px 10px rgba(0,0,0,.8)", marginBottom: 6 }}>{ok ? "✓ " : "✗ "}{lab}</div>
        <svg width={W} height={Hh} style={{ background: "rgba(5,8,12,.72)", borderRadius: 14, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
          <line x1={0} y1={Hh / 2} x2={W} y2={Hh / 2} stroke="rgba(255,255,255,.15)" strokeWidth={2} />
          <polyline points={pts} fill="none" stroke={col} strokeWidth={7} strokeLinejoin="round" strokeDasharray={3000} strokeDashoffset={3000 * (1 - k)} style={{ filter: `drop-shadow(0 0 10px ${col})` }} />
        </svg>
      </div>
    );
  };
  return <div style={{ position: "absolute", left: 1060, top: 230, opacity: o }}>{row(pure, at, "PURE SINE", "#5ee38f", true)}{row(mod, at2, "MODIFIED SINE", COL.red, false)}</div>;
};
// pregunta para comentar (burbuja de comentario 3D)
const Ask: React.FC<{ t: number; at: number; at2: number; out: number }> = ({ t, at, at2, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 0.9)), k2 = e(t, at2, at2 + 0.3);
  return (
    <div style={{ position: "absolute", left: 1000, top: 210, width: 800, opacity: o, transform: `perspective(1400px) rotateY(-12deg) scale(${k})`, transformOrigin: "0 50%" }}>
      <div style={{ background: "#f7f7f5", borderRadius: 28, padding: "34px 40px", boxShadow: "0 40px 90px rgba(0,0,0,.7)", fontFamily: FONT, color: "#1d1d1d", position: "relative" }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 4, color: "#888", marginBottom: 14 }}>💬 TELL ME IN THE COMMENTS</div>
        <div style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.12 }}>What's the longest you've gone without power?</div>
        <div style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.15, color: COL.amber.replace("#", "#") , marginTop: 18, opacity: k2, filter: "brightness(.8)" }}>…and what did you do about the fridge?</div>
        <div style={{ position: "absolute", left: 70, bottom: -34, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "36px solid #f7f7f5" }} />
      </div>
    </div>
  );
};
// ecuación grande que entra por términos
const Eq: React.FC<{ t: number; items: { at: number; txt: string; col?: string }[]; out: number; y?: number; size?: number }> = ({ t, items, out, y = 200, size = 96 }) => <Words t={t} items={items} out={out} y={y} size={size} />;

// ---------- LA LÍNEA DE TIEMPO DE BASES ----------
type Beat = { a: number; tr: Tr; p?: [number, number]; r: (t: number) => React.ReactNode; k?: string; w3?: boolean };
const IM = (a: number, k: string, tr: Tr, p?: [number, number], z?: [number, number], extra?: (t: number) => React.ReactNode): Beat => ({ a, tr, p, k, r: (t) => <AbsoluteFill><Clip k={k} a={a} z={z} />{extra?.(t)}</AbsoluteFill> });
const AR = (a: number, d: number, A: Pose, B: Pose, tr: Tr, on?: [number, number, number], blur = 0): Beat => ({ a, tr, w3: true, r: (t) => <Arena t={t} a={a} d={d} A={A} B={B} on={on} blur={blur} /> });
const HO = (a: number, t0: number, tr: Tr, p?: [number, number]): Beat => ({ a, tr, p, w3: true, r: (t) => <House t={t} a={a} t0={t0} /> });
const DK = (a: number, tr: Tr, col?: string): Beat => ({ a, tr, r: () => <Dark col={col} /> });
// avatar: un beat por cada tramo visible; transición, desenfoque [desde,hasta] y borde
const AVO: Record<number, { tr?: Tr; spans?: [number, number][]; edge?: boolean; p?: [number, number] }> = {
  102.09: { tr: "whip", spans: [[105.4, 106]] }, 116.0: { tr: "light", spans: [[116.0, 117.5]] }, 132.91: { tr: "zoom", spans: [[133.0, 137.8]] }, 149.77: { tr: "whipL" },
  165.5: { tr: "flip", spans: [[166.0, 168.6]] }, 184.63: { tr: "push", spans: [[186.4, 188.5]] }, 198.77: { tr: "whip", edge: true }, 215.99: { tr: "light", spans: [[217.6, 221]] },
  233.21: { tr: "zoom", spans: [[233.3, 237.1]] }, 248.04: { tr: "whipL", spans: [[248.0, 252]] }, 265.38: { tr: "portal", spans: [[265.4, 268.7]] }, 280.92: { tr: "push", spans: [[282.2, 285.6]] },
  296.65: { tr: "flip", spans: [[298.4, 301]] }, 313.45: { tr: "zoom", edge: true }, 330.91: { tr: "whip", spans: [[331.0, 334.9]] }, 348.63: { tr: "light", spans: [[349.9, 352.2]] },
  364.62: { tr: "whipL" }, 379.88: { tr: "push", edge: true }, 397.72: { tr: "zoom", spans: [[398.0, 401.1]] }, 412.51: { tr: "whip", spans: [[412.6, 418.4]] },
  428.94: { tr: "light", spans: [[429.0, 434.5]] }, 447.21: { tr: "flip", spans: [[449.4, 451.1]] }, 460.67: { tr: "portal", spans: [[460.6, 464.7]] }, 477.62: { tr: "whipL", spans: [[477.7, 482.2]] },
  494.24: { tr: "zoom" }, 508.74: { tr: "push", spans: [[511.0, 514.3]] }, 527.46: { tr: "light", spans: [[528.0, 532.3]] }, 544.72: { tr: "whip", spans: [[545.0, 548.4]] },
  559.98: { tr: "zoom", edge: true }, 579.56: { tr: "flip", spans: [[579.6, 583.9]] }, 594.97: { tr: "whipL", spans: [[595.0, 598.8]] }, 611.69: { tr: "push", edge: true },
  628.79: { tr: "light", spans: [[630.0, 633.3]] }, 644.99: { tr: "zoom", spans: [[645.0, 650.6]] }, 663.16: { tr: "whip", spans: [[663.3, 667.8]] }, 679.63: { tr: "portal", spans: [[679.6, 682.9]] },
  694.01: { tr: "flip", spans: [[694.1, 697.7]] }, 709.29: { tr: "whipL", spans: [[709.2, 714.8]] }, 726.01: { tr: "push", spans: [[726.0, 729.1]] }, 742.0: { tr: "zoom", spans: [[744.7, 746.5]] },
  758.99: { tr: "light", spans: [[759.0, 763.6]] }, 775.13: { tr: "whip", spans: [[775.1, 779.9]] }, 794.32: { tr: "flip", spans: [[794.3, 799.4]] }, 812.16: { tr: "whipL", spans: [[812.1, 816.7]] },
  827.23: { tr: "zoom", edge: true }, 847.27: { tr: "push", spans: [[847.3, 853]] }, 865.47: { tr: "light", spans: [[865.5, 871.5]] }, 884.42: { tr: "whip", spans: [[884.5, 889.4]] },
  901.9: { tr: "flip", spans: [[901.9, 906.1]] }, 916.54: { tr: "zoom", spans: [[916.5, 920.8]] }, 932.57: { tr: "whipL", spans: [[932.6, 937.8]] }, 949.89: { tr: "push", edge: true },
  965.69: { tr: "light", spans: [[966.9, 970]] }, 982.83: { tr: "zoom", spans: [[982.9, 988]] }, 999.61: { tr: "flip", spans: [[999.6, 1004.7]] }, 1017.25: { tr: "whip", spans: [[1017.3, 1021.3]] },
};
const AVB: Beat[] = VIS.filter((v) => v.a > T0 + 1).map((v) => {
  const o = AVO[Math.round(v.a * 100) / 100] ?? {};
  return { a: v.a, tr: o.tr ?? "whip", p: o.p, r: (t: number) => <Avatar t={t} dark={soft(t, o.spans ?? [], 0.2)} edge={0} /> };
});

const B: Beat[] = [
  // ===== los tres contendientes =====
  AR(T0, 2.9, { p: [-1.6, 1.6, 3.2], l: [-2.2, 1.2, 0], fov: 36 }, near2(0), "cut"),
  IM(105.44, "r_store", "push"), IM(111.0, "r_runs", "whip"),
  IM(120.96, "r_pull", "zoom", [700, 500]), AR(124.6, 3.5, WIDE2, near(1, -1), "light", [1, 1, 0]), IM(128.1, "r_hold", "portal", [960, 640]),
  AR(137.77, 2.85, near2(1, -1), near(1), "whipL", [1, 1, 0]), IM(140.62, "r_button", "zoom", [960, 540]), AR(145.3, 4.5, WIDE, near(2), "flip"),
  IM(155.16, "r_clamp", "push"), AR(161.02, 4.5, near(2), WIDE2, "whip"),
  // ===== ronda 1: costo =====
  IM(171.63, "r_tag", "zoom", [960, 400]), IM(178.7, "r_nozzle", "whip"),
  IM(188.46, "r_rowcans", "push"), IM(193.4, "r_deadpumps", "light"),
  IM(203.49, "r_cans", "whipL"), IM(206.0, "r_varnish", "zoom", [960, 560]), IM(212.16, "r_oil", "push"),
  IM(220.99, "r_panel", "flip"), IM(227.7, "r_transfer", "zoom", [960, 540]),
  IM(237.06, "r_wall", "whip"), IM(240.56, "r_closet", "portal", [960, 540]), IM(244.8, "r_topoff", "push"),
  IM(251.97, "r_cables", "light"), AR(258.72, 1.8, WIDE, WIDE2, "zoom"), IM(260.52, "r_meter", "whip"),
  // ===== ronda 2: ruido =====
  IM(268.67, "r_window", "push"), IM(272.16, "r_street", "light"), IM(278.64, "r_chain", "zoom", [960, 700]),
  IM(285.55, "r_listen", "whipL"), IM(291.5, "r_idle", "whip"),
  // ===== ronda 3: peligro =====
  HO(301.02, 37.6, "zoom", [960, 540]), IM(308.92, "r_cars", "push"),
  IM(318.62, "r_window2", "flip"), IM(322.8, "r_tape", "whip"),
  IM(334.85, "r_rain", "push"), IM(336.92, "r_cheat", "zoom", [960, 600]), IM(343.48, "r_alarm", "light"),
  IM(352.12, "r_two", "whipL"), IM(356.12, "r_fumeless", "portal", [960, 540]), IM(361.96, "r_cpap", "push"),
  IM(369.08, "r_point", "whip"), IM(373.7, "r_garagecar", "zoom", [960, 540]),
  IM(384.75, "r_tailpipe", "push"), AR(390.34, 2.6, WIDE2, WIDE, "flip"), IM(392.98, "r_board", "whip"),
  // ===== ronda 4: qué hace andar =====
  IM(401.12, "r_hose", "zoom", [960, 540]), IM(410.46, "r_fridge", "push"),
  IM(418.44, "r_kitchen", "light"),
  AR(434.49, 6.7, near(0), near2(0), "whip", [1, 0.25, 0.25]), IM(441.18, "r_wellpump", "push"),
  AR(451.1, 3.5, near(1, -1), near2(1, -1), "flip", [0.25, 1, 0.25]), IM(454.62, "r_fridgestation", "zoom", [960, 540]),
  IM(464.66, "r_jacket", "whipL"), AR(469.66, 5.2, near(2), near2(2), "zoom", [0.25, 0.25, 1]), IM(474.84, "r_battery", "push"),
  IM(482.18, "r_dead", "whip"), DK(489.75, "light", "#1d1408"),
  IM(497.37, "r_hood", "zoom", [960, 500]), IM(503.78, "r_wheels", "push"),
  AR(514.25, 13.2, WIDE2, WIDE, "flip", [1, 1, 1], 0),
  // ===== lo que compraría =====
  IM(532.26, "r_answer", "light"), IM(539.82, "r_sonlaw", "whip"),
  IM(548.41, "r_bucketwell", "push"), IM(553.76, "r_hookup", "zoom", [960, 540]),
  IM(565.46, "r_display", "whipL"), IM(570.98, "r_sunrise", "light"),
  IM(583.92, "r_notepad", "push"), DK(589.4, "zoom", "#13161c"),
  IM(598.82, "r_emptycorner", "whip"), IM(602.52, "r_honest", "light"), IM(609.1, "r_oxygen", "push"),
  IM(616.66, "r_install", "zoom", [960, 540]), IM(622.36, "r_alarmwall", "whipL"),
  IM(633.27, "r_family", "light"), IM(639.0, "r_phones", "push"),
  IM(650.64, "r_milk", "whip"), IM(655.26, "r_bench", "zoom", [960, 560]),
  // ===== los 6 pasos =====
  IM(667.78, "r_outlets", "push"), IM(672.36, "r_smallbank", "whip"), DK(678.1, "flip", "#0d1a12"),
  DK(682.92, "light", "#121212"), IM(692.42, "r_station2", "whipL"),
  IM(697.75, "r_inverter", "zoom", [960, 540]),
  DK(714.8, "push", "#0a0f0c"),
  IM(729.08, "r_lighter", "whip"), IM(736.76, "r_clamps", "zoom", [960, 540]),
  IM(746.53, "r_deadcar", "light"), IM(756.48, "r_park", "push"),
  IM(763.62, "r_corddoor", "whipL"), IM(771.18, "r_inside", "zoom", [960, 600]),
  IM(779.93, "r_radio", "push"), IM(782.86, "r_pump", "whip"), IM(789.06, "r_jugs", "light"),
  DK(799.46, "flip", "#0a1218"), DK(806.86, "zoom", "#120c08"),
  // ===== errores =====
  HO(816.73, 20.6, "whip"), IM(823.88, "r_engine", "push"),
  IM(832.97, "r_suicide", "zoom", [960, 540]), IM(839.74, "r_lineman", "light"),
  IM(853.02, "r_thin", "whipL"), IM(860.0, "r_heavy", "push"),
  IM(871.55, "r_tapeinv", "whip"), IM(879.54, "r_cablesbench", "zoom", [960, 540]),
  IM(889.38, "r_open", "push"), IM(896.04, "r_close", "whip"), DK(899.82, "flip", "#14100a"),
  // ===== la cuenta final =====
  IM(906.12, "r_gendust2", "light"), DK(920.83, "zoom", "#170a08"),
  IM(937.82, "r_camp", "whip"), IM(944.0, "r_porch", "push"),
  IM(953.89, "r_dusty", "whipL"), AR(958.46, 7.2, WIDE, WIDE2, "zoom"),
  AR(969.96, 10.2, near(1, -1), near(2), "light", [0.3, 1, 1]), IM(980.12, "r_sticker", "whip"),
  IM(987.99, "r_specs", "push"), IM(990.24, "r_test", "zoom", [960, 540]), DK(994.62, "light", "#101418"),
  IM(1004.75, "r_phone", "whip"), DK(1009.44, "push", "#0f1115"),
  IM(1021.31, "r_nextfridge", "light"), IM(1029.98, "r_bye", "whip"),
];
const BEATS: Beat[] = [...B, ...AVB].sort((x, y) => x.a - y.a);

// ---------- LA CAPA DE PIEZAS (cruza las transiciones) ----------
const pieces = (t: number) => [
  // contendientes
  <Tag key="c1" t={t} at={99.6} x={760} y={430} dx={-260} dy={-150} text="CONTENDER #1" sub="GAS GENERATOR" col={COL.red} out={102.0} />,
  <BigNum key="w35" t={t} at={102.6} text="3,500 W" x={1450} y={220} size={120} col={COL.amber} sub="PORTABLE" out={105.3} />,
  <Price key="p550" t={t} at={105.6} x={1500} y={260} item="ON SALE" $="$550" out={108.5} big={1.2} />,
  <Words key="dbs" t={t} items={[{ at: 109.6, txt: "THE DAY BEFORE" }, { at: 112.4, txt: "THE STORM", col: COL.red }]} out={114.2} y={880} size={90} />,
  <Chips key="runs" t={t} at={114.6} items={["FRIDGE", "FREEZER", "LIGHTS", "PHONES", "SUMP PUMP"]} out={120.9} y={880} />,
  <Stamp key="mus" t={t} at={121.2} text="REAL MUSCLE" x={1400} y={250} rot={-6} size={86} out={124.4} col={COL.amber} />,
  <Tag key="c2" t={t} at={125.2} x={960} y={470} dx={240} dy={-170} text="CONTENDER #2" sub="BATTERY POWER STATION" col={COL.ice} out={128.0} />,
  <Words key="lbb" t={t} items={[{ at: 128.6, txt: "A BIG LITHIUM BATTERY" }, { at: 130.2, txt: "IN A BOX", col: COL.ice }]} out={132.8} y={170} size={84} />,
  <ColdBattery key="kwh" t={t} at={133.6} out={137.7} label="1,000 WATT-HOURS" />,
  <Price key="p450" t={t} at={138.3} x={1460} y={250} item="POWER STATION" $="$450" out={140.5} big={1.15} />,
  <Words key="nog" t={t} items={[{ at: 140.7, txt: "NO GAS" }, { at: 141.5, txt: "NO OIL" }, { at: 142.4, txt: "NO PULL CORD", col: COL.ice }]} out={145.2} y={170} size={92} />,
  <Words key="btn" t={t} items={[{ at: 143.7, txt: "PUSH A BUTTON", col: "#5ee38f" }]} out={145.2} y={900} size={84} />,
  <Tag key="c3" t={t} at={146.2} x={1240} y={470} dx={-260} dy={-170} text="CONTENDER #3" sub="THE ELECTRICIAN'S TRICK" col={COL.amber} out={149.7} />,
  <Words key="cbi" t={t} items={[{ at: 150.2, txt: "CAR BATTERY" }, { at: 152.0, txt: "+ INVERTER", col: COL.amber }]} out={155.1} y={880} size={90} />,
  <Price key="p80" t={t} at={155.8} x={1500} y={250} item="1,000 W INVERTER" $="$80" out={158.9} />,
  <Tag key="own" t={t} at={158.6} x={700} y={600} dx={-200} dy={-170} text="THE CAR YOU OWN" sub="$0" col={COL.ice} out={161.0} />,
  <Words key="same" t={t} items={[{ at: 163.3, txt: "SAME TESTS" }, { at: 164.3, txt: "ALL THREE", col: COL.amber }]} out={165.4} y={170} size={92} />,
  // ronda 1
  <StepTitle key="r1" word="ROUND" t={t} at={166.0} n={1} name="WHAT IT REALLY COSTS" out={168.9} col={COL.amber} />,
  <Stamp key="mis1" t={t} at={169.6} text="THE FIRST MISTAKE" x={960} y={880} rot={-4} size={70} out={171.6} />,
  <Words key="cov" t={t} items={[{ at: 175.6, txt: "$550 = THE COVER CHARGE", col: COL.amber }]} out={178.6} y={880} size={80} />,
  <BigNum key="hg" t={t} at={181.8} text="½ GAL / HR" x={1420} y={230} size={120} col={COL.amber} sub="AT HALF LOAD" out={184.6} />,
  <BigNum key="12g" t={t} at={186.6} text="12 GAL / DAY" x={1420} y={260} size={110} col={COL.red} edge="#4a0d08" out={188.5} />,
  <BigNum key="36g" t={t} at={189.0} text="3 DAYS = 36 GAL" x={960} y={200} size={110} col={COL.ink} out={193.2} />,
  <BigNum key="100" t={t} at={192.4} text="$100+" x={1500} y={760} size={150} col={COL.red} edge="#4a0d08" sub="OF GAS" out={198.7} />,
  <Tag key="pmp" t={t} at={197.3} x={900} y={560} dx={-220} dy={-190} text="PUMPS RUN ON ELECTRICITY" col={COL.red} out={198.7} />,
  <Words key="lin" t={t} items={[{ at: 202.0, txt: "I'VE SEEN THE LINES", col: COL.amber }]} out={203.5} y={880} size={84} />,
  <Bill key="hid" t={t} title="HIDDEN COSTS" x={1180} y={140} rows={[{ at: 203.8, item: "GAS CANS", val: "✓" }, { at: 206.0, item: "STABILIZER", val: "✓" }, { at: 212.2, item: "OIL CHANGES", val: "✓" }, { at: 217.8, item: "TRANSFER SWITCH", val: "?" }]} total={{ at: 227.8, txt: "+$500-1,000" }} out={232.0} />,
  <Tag key="stl" t={t} at={207.6} x={900} y={520} dx={-220} dy={-180} text="STALE IN ~1 MONTH" sub="GUMS THE CARBURETOR" col={COL.amber} out={212.0} />,
  <Stamp key="win" t={t} at={219.0} text="NOT A CORD THROUGH THE WINDOW" x={960} y={900} rot={-3} size={56} out={221.0} />,
  <Price key="p450b" t={t} at={232.2} x={1450} y={260} item="THE WHOLE BILL" $="$450" out={237.0} big={1.2} />,
  <Tag key="wl" t={t} at={237.6} x={1100} y={560} dx={220} dy={-170} text="CHARGE FROM THE WALL" sub="BEFORE THE STORM" col={COL.ice} out={240.5} />,
  <Words key="mon" t={t} items={[{ at: 241.6, txt: "HOLDS A CHARGE" }, { at: 242.6, txt: "FOR MONTHS", col: COL.ice }]} out={244.7} y={880} size={84} />,
  <Words key="top" t={t} items={[{ at: 245.0, txt: "TOP IT OFF" }, { at: 246.2, txt: "= MAINTENANCE", col: "#5ee38f" }]} out={247.9} y={170} size={84} />,
  <Bill key="car" t={t} title="CAR SETUP" x={1180} y={180} rows={[{ at: 248.6, item: "INVERTER", val: "$80" }, { at: 250.6, item: "HEAVY CABLES", val: "$20" }, { at: 253.6, item: "FUEL", val: "IN YOUR TANK" }]} total={{ at: 255.4, txt: "$100", col: "#2b7a3d" }} out={258.6} />,
  // ronda 2
  <StepTitle key="r2" word="ROUND" t={t} at={258.8} n={2} name="NOISE" out={260.4} col={COL.ice} />,
  <Tag key="20f" t={t} at={262.4} x={960} y={620} dx={240} dy={-170} text="20 FEET AWAY" col={COL.amber} out={265.3} />,
  <BigNum key="72" t={t} at={265.6} text="72 dB" x={1480} y={250} size={150} col={COL.red} edge="#4a0d08" sub="GAS GENERATOR" out={268.6} />,
  <Words key="vac" t={t} items={[{ at: 268.8, txt: "A VACUUM CLEANER" }, { at: 270.0, txt: "ALL NIGHT", col: COL.red }]} out={272.1} y={170} size={84} />,
  <Words key="nbh" t={t} items={[{ at: 274.6, txt: "EVERYONE HEARS IT", col: COL.amber }]} out={278.5} y={880} size={80} />,
  <Stamp key="sto" t={t} at={278.8} text="STOLEN — EVEN CHAINED" x={960} y={190} rot={-5} size={74} out={280.8} />,
  <BigNum key="0db" t={t} at={284.2} text="SILENT" x={1450} y={250} size={130} col={"#5ee38f"} edge="#174a28" sub="THE METER DIDN'T MOVE" out={291.3} />,
  <BigNum key="50" t={t} at={292.6} text="50 dB" x={1480} y={250} size={150} col={COL.amber} sub="CAR IDLING · 20 FT" out={296.5} />,
  <Words key="tlk" t={t} items={[{ at: 296.5, txt: "TALK RIGHT OVER IT" }]} out={298.5} y={880} size={80} />,
  // ronda 3
  <StepTitle key="r3" word="ROUND" t={t} at={298.7} n={3} name="THE DANGER" out={301.0} col={COL.red} />,
  <Tag key="cot" t={t} at={304.9} x={760} y={430} dx={-220} dy={-170} text="CARBON MONOXIDE" sub="A LOT OF IT" col="#c9ced6" out={308.8} />,
  <BigNum key="hun" t={t} at={309.2} text="= HUNDREDS" x={960} y={220} size={130} col={COL.red} edge="#4a0d08" sub="OF IDLING CARS" out={313.5} />,
  <Stamp key="x1" t={t} at={316.3} text="GARAGE DOOR OPEN ✗" x={960} y={230} rot={-5} size={64} out={318.6} />,
  <Stamp key="x2" t={t} at={319.0} text="WINDOW OPEN ✗" x={620} y={300} rot={-6} size={70} out={322.7} />,
  <Stamp key="x3" t={t} at={321.3} text="A FAN ✗" x={1320} y={780} rot={5} size={74} out={322.7} />,
  <BigNum key="20" t={t} at={323.6} text="20 FT" x={1460} y={240} size={170} col={COL.amber} sub="FROM THE HOUSE" out={330.8} />,
  <Tag key="exa" t={t} at={327.0} x={900} y={640} dx={-220} dy={-150} text="EXHAUST AWAY" sub="FROM DOORS + WINDOWS" col={COL.amber} out={330.8} />,
  <Words key="yrd" t={t} items={[{ at: 332.3, txt: "IN THE YARD" }, { at: 333.5, txt: "IN THE RAIN", col: COL.ice }]} out={334.8} y={880} size={80} />,
  <Stamp key="die" t={t} at={340.6} text="THAT'S HOW THEY DIE" x={960} y={880} rot={-4} size={80} out={343.4} />,
  <Tag key="flo" t={t} at={345.0} x={980} y={420} dx={240} dy={-140} text="EVERY FLOOR" sub="WITH A BATTERY" col={COL.red} out={348.5} />,
  <Price key="p25" t={t} at={350.3} x={1500} y={260} item="CO ALARM" $="$25" out={352.1} />,
  <Stamp key="b2" t={t} at={352.6} text="BUY TWO FIRST" x={1350} y={820} rot={-6} size={84} out={356.0} />,
  <BigNum key="zf" t={t} at={356.3} text="ZERO FUMES" x={960} y={200} size={120} col={"#5ee38f"} edge="#174a28" out={361.9} />,
  <Tag key="cpp" t={t} at={362.4} x={1000} y={560} dx={240} dy={-170} text="NEXT TO YOUR BED" sub="CPAP" col={COL.ice} out={364.5} />,
  <Words key="mid" t={t} items={[{ at: 367.6, txt: "THE CAR: IN THE MIDDLE", col: COL.amber }]} out={369.1} y={880} size={74} />,
  <Tag key="sm" t={t} at={369.6} x={1240} y={640} dx={-240} dy={-180} text="ALSO MAKES CO" col={COL.red} out={373.6} />,
  <Stamp key="ng" t={t} at={373.8} text="NEVER IN A GARAGE" x={960} y={190} rot={-5} size={80} out={379.8} />,
  <Words key="dr" t={t} items={[{ at: 378.2, txt: "DRIVEWAY · TAILPIPE TO THE STREET", col: COL.ice }]} out={379.8} y={900} size={58} />,
  <Words key="ok" t={t} items={[{ at: 385.0, txt: "DONE RIGHT: SAFE", col: "#5ee38f" }]} out={390.2} y={200} size={90} />,
  <Words key="lz" t={t} items={[{ at: 386.9, txt: "DONE LAZY: DEADLY", col: COL.red }]} out={390.2} y={880} size={90} />,
  // ronda 4
  <StepTitle key="r4" word="ROUND" t={t} at={390.5} n={4} name="WHAT IT RUNS" out={392.8} col={COL.amber} />,
  <Words key="wv" t={t} items={[{ at: 398.3, txt: "WATTS = HOW HARD" }, { at: 401.4, txt: "WATT-HOURS = HOW LONG", col: COL.ice }]} out={404.0} y={170} size={80} />,
  <Versus key="hb" t={t} at={404.2} out={410.3} title="THINK OF IT LIKE" L={{ label: "WATTS = THE HOSE", val: "HOW FAST", h: 0.5, col: COL.amber }} R={{ label: "WATT-HOURS = THE BUCKET", val: "HOW MUCH", h: 0.72, col: COL.ice }} />,
  <BigNum key="150" t={t} at={410.6} text="~150 W" x={1450} y={250} size={140} col={COL.amber} sub="FRIDGE RUNNING" out={415.4} />,
  <BigNum key="kick" t={t} at={415.6} text="600-800 W" x={1430} y={600} size={110} col={COL.red} edge="#4a0d08" sub="FOR ONE SECOND AT START" out={418.4} />,
  <Words key="rrr" t={t} items={[{ at: 423.0, txt: "RUNS" }, { at: 423.8, txt: "RESTS", col: COL.dim }, { at: 424.6, txt: "RUNS" }]} out={425.8} y={200} size={110} />,
  <BigNum key="kd" t={t} at={426.2} text="1-1.5 kWh" x={960} y={560} size={150} col={COL.ice} edge="#1d3a52" sub="A WHOLE DAY OF FRIDGE" out={428.9} />,
  <Words key="dc" t={t} items={[{ at: 434.6, txt: "THE GENERATOR DOESN'T CARE", col: COL.amber }]} out={436.4} y={880} size={70} />,
  <Chips key="all" t={t} at={436.6} items={["FRIDGE", "FREEZER", "SUMP PUMP", "+ ROOM TO SPARE"]} out={441.1} y={880} />,
  <Chips key="win2" t={t} at={441.4} items={["WELL PUMP", "ELECTRIC FURNACE", "MEDICAL DEVICE"]} out={447.1} y={880} />,
  <Stamp key="gw" t={t} at={446.0} text="GENERATOR WINS" x={960} y={200} rot={-5} size={84} out={449.6} col={COL.amber} />,
  <Stamp key="nc" t={t} at={449.7} text="NO CONTEST" x={1400} y={760} rot={5} size={80} out={451.1} col={COL.amber} />,
  <ColdBattery key="st1" t={t} at={451.3} out={460.6} label="1,000 Wh" />,
  <BigNum key="1d" t={t} at={456.6} text="≈ 1 DAY" x={700} y={230} size={130} col={COL.ice} edge="#1d3a52" sub="FULL FRIDGE · DOOR SHUT" out={460.6} />,
  <Words key="lv" t={t} items={[{ at: 461.4, txt: "LAST VIDEO:" }, { at: 464.9, txt: "JUGS + JACKET", col: COL.ice }]} out={469.5} y={880} size={78} />,
  <Stamp key="wk" t={t} at={470.2} text="WEAK — BY ITSELF" x={960} y={880} rot={-4} size={70} out={472.1} />,
  <Words key="wr" t={t} items={[{ at: 472.4, txt: "MOST VIDEOS GET THIS WRONG", col: COL.red }]} out={474.8} y={180} size={70} />,
  <Tag key="sb" t={t} at={475.2} x={960} y={520} dx={240} dy={-170} text="A STARTING BATTERY" sub="3 SECONDS OF PUNCH" col={COL.amber} out={477.6} />,
  <Stamp key="nd" t={t} at={482.3} text="NOT BUILT TO BE DRAINED" x={960} y={200} rot={-4} size={66} out={484.6} />,
  <Stamp key="rui" t={t} at={486.6} text="RUINED" x={1400} y={760} rot={6} size={110} out={489.0} />,
  <BigNum key="200" t={t} at={490.0} text="~200 Wh" x={960} y={420} size={170} col={COL.amber} sub="ONLY ⅓ OF THE WAY DOWN" out={494.2} />,
  <Words key="cph" t={t} items={[{ at: 494.5, txt: "= A COUPLE HOURS OF FRIDGE", col: COL.red }]} out={497.3} y={880} size={66} />,
  <Words key="da" t={t} items={[{ at: 497.5, txt: "ENGINE RUNNING =", col: COL.ink }, { at: 498.8, txt: "A DIFFERENT ANIMAL", col: "#5ee38f" }]} out={500.4} y={180} size={76} />,
  <Tag key="alt" t={t} at={500.6} x={1050} y={520} dx={240} dy={-170} text="ALTERNATOR" sub="MAKING POWER" col={COL.amber} out={503.7} />,
  <Words key="gow" t={t} items={[{ at: 503.9, txt: "A GENERATOR ON WHEELS", col: COL.amber }]} out={508.7} y={180} size={86} />,
  <Chips key="mft" t={t} at={505.6} items={["MUFFLER", "COOLING", "FULL TANK"]} out={508.7} y={880} />,
  <Versus key="gph" t={t} at={515.0} out={524.9} title="GALLONS PER HOUR" L={{ label: "GENERATOR", val: "½ GAL", h: 0.72, col: COL.red, mark: "x" }} R={{ label: "IDLING CAR", val: "⅕-⅓ GAL", h: 0.36, col: "#5ee38f", mark: "ok" }} />,
  <BigNum key="ww" t={t} at={525.3} text="WHO WINS?" x={960} y={220} size={130} col={COL.ink} out={527.4} />,
  <Words key="nal" t={t} items={[{ at: 526.7, txt: "NONE OF THEM, ALONE", col: COL.amber }]} out={530.2} y={880} size={80} />,
  <Stamp key="sec" t={t} at={528.1} text="THE WHOLE SECRET" x={1400} y={260} rot={-6} size={70} out={532.2} col={COL.amber} />,
  // lo que compraría
  <Words key="ans" t={t} items={[{ at: 535.4, txt: "POWER STATION" }, { at: 537.4, txt: "+ MY CAR", col: COL.amber }]} out={539.8} y={170} size={96} />,
  <Words key="sil" t={t} items={[{ at: 548.7, txt: "SILENT · NO FUMES", col: "#5ee38f" }]} out={550.5} y={180} size={84} />,
  <Tag key="bkt" t={t} at={550.6} x={900} y={620} dx={-240} dy={-180} text="THE BUCKET" col={COL.ice} out={553.7} />,
  <Tag key="wel" t={t} at={552.0} x={1250} y={420} dx={220} dy={-150} text="THE WELL" sub="YOUR CAR" col={COL.amber} out={553.7} />,
  <Words key="2x" t={t} items={[{ at: 553.9, txt: "TWICE A DAY" }, { at: 556.4, txt: "1½ HOURS IDLING", col: COL.amber }]} out={559.9} y={180} size={84} />,
  <BigNum key="in" t={t} at={565.6} text="300-400 W" x={1430} y={240} size={130} col={COL.ice} edge="#1d3a52" sub="CHARGING INPUT" out={570.9} />,
  <Words key="hb2" t={t} items={[{ at: 571.0, txt: "1½ HRS = ½ OF THE DAY BACK", col: COL.ice }]} out={576.4} y={180} size={70} />,
  <Words key="me" t={t} items={[{ at: 576.6, txt: "MORNING + EVENING" }, { at: 578.0, txt: "= EVEN", col: "#5ee38f" }]} out={579.5} y={880} size={84} />,
  <Eq key="eq1" t={t} items={[{ at: 581.9, txt: "3 HRS" }, { at: 584.3, txt: "× ¼ GAL", col: COL.amber }, { at: 586.0, txt: "= ¾ GAL / DAY", col: "#5ee38f" }]} out={589.3} y={200} size={92} />,
  <Versus key="3d" t={t} at={589.5} out={594.9} title="GAS FOR 3 DAYS" L={{ label: "GENERATOR", val: "36 GAL", h: 0.72, col: COL.red, mark: "x" }} R={{ label: "MY WAY", val: "~2 GAL", h: 0.12, col: "#5ee38f", mark: "ok" }} />,
  <BigNum key="15" t={t} at={596.6} text="15× LESS GAS" x={960} y={820} size={110} col={"#5ee38f"} edge="#174a28" out={598.8} />,
  <Words key="ncan" t={t} items={[{ at: 599.0, txt: "NOT ONE GAS CAN", col: COL.ice }]} out={602.4} y={880} size={84} />,
  <Stamp key="ari" t={t} at={604.6} text="ARITHMETIC, NOT A SALES PITCH" x={960} y={880} rot={-3} size={54} out={609.0} />,
  <CheckList key="bg" t={t} title="BUY THE GENERATOR IF" rows={[{ at: 609.6, txt: "WELL PUMP" }, { at: 611.0, txt: "ELECTRIC FURNACE" }, { at: 612.8, txt: "OXYGEN AT HOME" }, { at: 614.6, txt: "WEEK-LONG BLACKOUTS" }]} out={616.6} />,
  <CheckList key="br" t={t} title="AND BUY IT RIGHT" rows={[{ at: 622.4, txt: "LICENSED INTERLOCK" }, { at: 624.6, txt: "20 FEET OUT" }, { at: 626.2, txt: "CO ALARMS UP" }]} out={628.7} />,
  <Words key="rtj" t={t} items={[{ at: 628.8, txt: "A REAL TOOL" }, { at: 629.8, txt: "FOR A REAL JOB", col: COL.amber }]} out={633.2} y={880} size={78} />,
  <Words key="23" t={t} items={[{ at: 633.4, txt: "2-3 DAYS" }, { at: 635.6, txt: "2-3 TIMES A YEAR", col: COL.ice }]} out={639.0} y={180} size={84} />,
  <Chips key="sc" t={t} at={639.2} items={["FOOD", "PHONES", "A FEW LIGHTS", "CPAP"]} out={644.9} y={880} />,
  <Bill key="gw2" t={t} title="FOR THAT?" x={1200} y={180} rows={[{ at: 645.6, item: "GENERATOR", val: "$550" }, { at: 647.0, item: "GAS", val: "$100" }, { at: 648.4, item: "TRANSFER SWITCH", val: "$500+" }]} total={{ at: 649.6, txt: "$1,150+" }} out={650.6} />,
  <Stamp key="pk" t={t} at={651.2} text="A PICKUP FOR A GALLON OF MILK" x={960} y={880} rot={-3} size={56} out={655.2} />,
  <Words key="sbs" t={t} items={[{ at: 655.4, txt: "STEP BY STEP" }, { at: 658.6, txt: "+ THE MISTAKES", col: COL.red }]} out={661.8} y={180} size={86} />,
  // pasos
  <StepTitle key="s1" t={t} at={661.9} n={1} name="THE RIGHT POWER STATION" out={665.5} />,
  <Chips key="2t" t={t} at={665.8} items={["CAPACITY", "BATTERY TYPE", "OUTPUT"]} out={667.7} y={880} />,
  <BigNum key="1k" t={t} at={668.0} text="~1,000 Wh" x={1430} y={240} size={130} col={COL.ice} edge="#1d3a52" sub="YOUR BUCKET" out={672.3} />,
  <Stamp key="ph" t={t} at={672.6} text="PHONES ONLY" x={1380} y={250} rot={-6} size={84} out={676.2} />,
  <BigNum key="lfp" t={t} at={678.4} text="LFP" x={960} y={360} size={300} col={"#5ee38f"} edge="#174a28" sub="LITHIUM IRON PHOSPHATE" out={679.7} />,
  <Versus key="cyc" t={t} at={683.2} out={692.3} title="CHARGE CYCLES" L={{ label: "LFP", val: "3,000+", h: 0.72, col: "#5ee38f", mark: "ok" }} R={{ label: "CHEAPER LITHIUM", val: "~500", h: 0.18, col: COL.red, mark: "x" }} />,
  <Tag key="out" t={t} at={692.5} x={1000} y={560} dx={240} dy={-170} text="OUTPUT" col={COL.amber} out={694.0} />,
  <BigNum key="1kw" t={t} at={694.4} text="≥ 1,000 W" x={1430} y={240} size={120} col={COL.amber} sub="CONTINUOUS" out={697.7} />,
  <StepTitle key="s2" t={t} at={700.7} n={2} name="THE RIGHT INVERTER" out={703.4} />,
  <Words key="ps" t={t} items={[{ at: 703.6, txt: "PURE SINE WAVE" }, { at: 706.2, txt: "≥ 1,000 W", col: COL.amber }]} out={709.2} y={180} size={86} />,
  <Waves key="wav" t={t} at={714.9} at2={715.6} out={720.6} />,
  <Words key="chop" t={t} items={[{ at: 715.6, txt: "RUNS HOT + LOUD", col: COL.red }]} out={720.6} y={900} size={70} />,
  <Price key="p20" t={t} at={720.9} x={1460} y={260} item="FOR PURE SINE" $="+$20" out={725.8} big={1.2} />,
  <Stamp key="pay" t={t} at={723.8} text="PAY IT" x={760} y={760} rot={-6} size={130} out={725.8} col={COL.amber} />,
  <StepTitle key="s3" t={t} at={725.4} n={3} name="CLAMP TO THE BATTERY" out={728.0} />,
  <Tag key="cig" t={t} at={729.3} x={960} y={540} dx={240} dy={-170} text="~150 W MAX" col={COL.red} out={734.0} />,
  <Stamp key="10h" t={t} at={734.2} text="10 HOURS" x={1400} y={260} rot={-5} size={100} out={736.7} />,
  <Words key="rb" t={t} items={[{ at: 739.0, txt: "RED +", col: COL.red }, { at: 740.4, txt: "BLACK −", col: COL.ink }]} out={741.9} y={180} size={100} />,
  <Words key="sh" t={t} items={[{ at: 742.3, txt: "SHORT + THICK CABLES", col: COL.amber }]} out={744.8} y={880} size={74} />,
  <Words key="eng" t={t} items={[{ at: 744.9, txt: "THEN START THE CAR", col: "#5ee38f" }]} out={746.5} y={880} size={74} />,
  <Stamp key="eo" t={t} at={746.8} text="ENGINE OFF = NEVER" x={960} y={200} rot={-4} size={80} out={750.6} />,
  <Words key="dcb" t={t} items={[{ at: 750.8, txt: "DEAD CAR" }, { at: 752.6, txt: "+ A BLACKOUT", col: COL.red }]} out={756.4} y={880} size={86} />,
  <StepTitle key="s4" t={t} at={756.5} n={4} name="PARK IT RIGHT" out={758.8} />,
  <Words key="nose" t={t} items={[{ at: 763.7, txt: "TAILPIPE → STREET", col: COL.amber }]} out={765.0} y={180} size={84} />,
  <Words key="gdc" t={t} items={[{ at: 765.1, txt: "GARAGE DOOR CLOSED", col: COL.ice }]} out={766.5} y={880} size={74} />,
  <Tag key="cd" t={t} at={766.8} x={960} y={600} dx={240} dy={-190} text="CORD TO THE STATION" sub="NOT THE OTHER WAY" col={COL.amber} out={771.1} />,
  <Tag key="ins" t={t} at={771.4} x={900} y={620} dx={-240} dy={-180} text="STAYS INSIDE" sub="WARM + SAFE" col={COL.ice} out={775.1} />,
  <StepTitle key="s5" t={t} at={775.2} n={5} name="CHARGE IT BEFORE" out={777.6} />,
  <Words key="wwn" t={t} items={[{ at: 780.0, txt: "WEATHER WARNING" }, { at: 781.4, txt: "= PLUG IT IN", col: "#5ee38f" }]} out={782.8} y={180} size={84} />,
  <Tag key="ft" t={t} at={783.0} x={960} y={520} dx={240} dy={-170} text="FILL THE TANK TOO" col={COL.amber} out={789.0} />,
  <Words key="pd" t={t} items={[{ at: 786.0, txt: "PUMPS MAY BE DEAD TOMORROW", col: COL.red }]} out={789.0} y={880} size={64} />,
  <StepTitle key="s6" t={t} at={789.1} n={6} name="HELP THE FRIDGE" out={791.5} col={COL.ice} />,
  <Chips key="hf" t={t} at={794.5} items={["WATER JUGS", "THE JACKET", "DOOR SHUT"]} out={799.4} y={880} />,
  <Versus key="hw" t={t} at={799.7} out={806.7} title="FRIDGE WORK CUT IN HALF" L={{ label: "POWER STATION LASTS", val: "2×", h: 0.72, col: "#5ee38f", mark: "ok" }} R={{ label: "CAR IDLES", val: "½", h: 0.3, col: COL.ice, mark: "ok" }} />,
  // errores
  <MistakesDeal key="md" t={t} at={806.9} out={810.5} />,
  <Mistake key="m1" t={t} at={810.7} n={1} txt="AN ENGINE IN THE GARAGE" out={823.7} />,
  <Words key="goc" t={t} items={[{ at: 815.1, txt: "GENERATOR OR CAR" }, { at: 816.7, txt: "DOOR OPEN OR NOT", col: COL.amber }]} out={818.3} y={180} size={76} />,
  <Stamp key="jd" t={t} at={818.4} text="JUST DON'T" x={960} y={220} rot={-5} size={120} out={823.7} />,
  <Mistake key="m2" t={t} at={823.9} n={2} txt="BACKFEEDING THE HOUSE" out={847.2} />,
  <Stamp key="sui" t={t} at={834.8} text="THE SUICIDE CORD" x={960} y={220} rot={-4} size={90} out={839.6} />,
  <Tag key="lmn" t={t} at={843.0} x={960} y={420} dx={240} dy={-150} text="IT CAN KILL THE LINEMAN" col={COL.red} out={847.2} />,
  <Words key="itl" t={t} items={[{ at: 849.0, txt: "INTERLOCK" }, { at: 850.4, txt: "OR TRANSFER SWITCH", col: COL.amber }]} out={855.4} y={180} size={74} />,
  <Stamp key="per" t={t} at={855.5} text="PERIOD." x={1400} y={300} rot={-6} size={110} out={857.6} />,
  <Mistake key="m3" t={t} at={856.0} n={3} txt="A THIN EXTENSION CORD" out={871.6} />,
  <Tag key="hot" t={t} at={862.6} x={960} y={600} dx={240} dy={-180} text="GETS HOT" sub="OVER A FEW DAYS" col={COL.red} out={865.4} />,
  <BigNum key="12ga" t={t} at={866.2} text="12 GAUGE" x={1440} y={250} size={120} col={COL.amber} sub="HEAVY · OUTDOOR · SHORT" out={871.5} />,
  <Mistake key="m4" t={t} at={871.8} n={4} txt="DRAINING THE CAR BATTERY" out={884.5} />,
  <Toggle key="tg" t={t} at={875.2} flipAt={877.2} out={884.3} a={["ENGINE RUNNING", "INVERTER ON"]} b={["ENGINE OFF", "UNPLUG IT"]} />,
  <Mistake key="m5" t={t} at={884.7} n={5} txt="OPENING THE FRIDGE TO CHECK" out={899.7} />,
  <Words key="ob" t={t} items={[{ at: 892.0, txt: "COLD FALLS OUT", col: COL.ice }, { at: 893.8, txt: "→ BATTERY PAYS", col: COL.red }]} out={896.0} y={180} size={76} />,
  <Words key="oc" t={t} items={[{ at: 896.1, txt: "OPEN ONCE." }, { at: 897.6, txt: "CLOSE IT.", col: "#5ee38f" }]} out={899.7} y={180} size={96} />,
  // la cuenta final
  <Words key="fmc" t={t} items={[{ at: 899.9, txt: "THE FINAL" }, { at: 900.6, txt: "MONEY COUNT", col: COL.amber }]} out={901.9} y={540} size={120} />,
  <Bill key="gway" t={t} title="THE GENERATOR WAY" x={1170} y={110} rot={-12} rows={[{ at: 906.6, item: "GENERATOR", val: "$550" }, { at: 908.8, item: "GAS · 3 DAYS", val: "$100" }, { at: 911.6, item: "CANS + STABILIZER", val: "$30" }, { at: 913.4, item: "HEAVY CORD", val: "$50" }, { at: 914.8, item: "2 CO ALARMS", val: "$50" }, { at: 918.4, item: "HOUSE HOOKUP", val: "$500-1,000" }]} total={{ at: 923.1, txt: "$700-1,700" }} out={929.8} />,
  <Words key="gs" t={t} items={[{ at: 925.6, txt: "+ GAS STORED ALL YEAR", col: COL.red }]} out={929.8} y={900} size={64} />,
  <Bill key="myw" t={t} title="MY WAY" x={1170} y={150} rot={-12} rows={[{ at: 929.9, item: "POWER STATION", val: "$450" }, { at: 932.4, item: "INVERTER + CABLES", val: "$100" }, { at: 936.4, item: "2 CO ALARMS", val: "$50" }, { at: 940.3, item: "GAS · 3 DAYS", val: "<$10" }]} total={{ at: 943.1, txt: "~$600", col: "#2b7a3d" }} out={947.4} />,
  <Words key="box" t={t} items={[{ at: 945.0, txt: "+ A BOX IN THE CLOSET", col: "#5ee38f" }]} out={947.4} y={900} size={64} />,
  <Words key="cmp" t={t} items={[{ at: 947.6, txt: "NO BLACKOUT?" }, { at: 948.6, txt: "IT GOES CAMPING", col: "#5ee38f" }]} out={949.8} y={180} size={80} />,
  <Words key="oil" t={t} items={[{ at: 958.6, txt: "WAITS FOR ITS OIL CHANGE", col: COL.amber }]} out={962.7} y={880} size={66} />,
  <Words key="one" t={t} items={[{ at: 962.9, txt: "REMEMBER" }, { at: 963.8, txt: "ONE THING", col: COL.amber }]} out={965.6} y={200} size={96} />,
  <Words key="nm" t={t} items={[{ at: 967.1, txt: "NOT A MACHINE" }, { at: 968.4, txt: "THAT MAKES POWER", col: COL.dim }]} out={970.0} y={880} size={66} />,
  <Tag key="bk2" t={t} at={970.3} x={960} y={500} dx={-260} dy={-200} text="THE BUCKET" sub="THE POWER STATION" col={COL.ice} out={980.0} />,
  <Tag key="wl2" t={t} at={972.8} x={1300} y={520} dx={220} dy={-190} text="THE WELL" sub="THE CAR YOU OWN" col={COL.amber} out={980.0} />,
  <Words key="hw2" t={t} items={[{ at: 980.2, txt: "YOUR HOMEWORK", col: COL.ice }]} out={982.7} y={540} size={120} />,
  <Tag key="sti" t={t} at={984.0} x={1050} y={480} dx={240} dy={-160} text="HOW MANY WATTS?" col={COL.amber} out={990.2} />,
  <Tag key="tst" t={t} at={990.5} x={960} y={420} dx={240} dy={-150} text="EVERY FLOOR" sub="DOES IT WORK?" col={COL.red} out={994.5} />,
  <CheckList key="hwk" t={t} title="10 MINUTES" rows={[{ at: 994.7, txt: "FRIDGE STICKER WATTS" }, { at: 995.4, txt: "CO ALARM EVERY FLOOR" }]} out={999.4} />,
  <Ask key="ask" t={t} at={999.6} at2={1002.3} out={1004.7} />,
  <Words key="rd" t={t} items={[{ at: 1004.9, txt: "I READ EVERY ONE", col: COL.amber }]} out={1009.3} y={880} size={74} />,
  <NextCard key="nx" t={t} at={1009.6} subAt={1010.6} out={1029.8}><AbsoluteFill style={{ background: "#111" }}><Clip k="r_nextfridge" a={1009.6} z={[1.0, 1.08]} /></AbsoluteFill></NextCard>,
  <Words key="sto2" t={t} items={[{ at: 1021.6, txt: "WHAT HOUR IT DIES" }, { at: 1024.6, txt: "+ HOW NOT TO RUIN IT", col: COL.amber }]} out={1029.8} y={880} size={66} />,
  <Words key="20b" t={t} items={[{ at: 1030.1, txt: "KEEP THE EXHAUST" }, { at: 1032.6, txt: "20 FEET AWAY", col: COL.amber }]} out={1034.4} y={180} size={80} />,
  <LowerThird key="lt" t={t} at={1034.6} out={TEND - 0.6} name="GARY" l2="SEE YOU NEXT WEEK" l2at={1035.6} />,
];

export const beatTable = () => BEATS.map((b, i) => ({ i, a: +b.a.toFixed(2), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(2), tr: b.tr, k: b.k ?? "" }));
export const clipPlan = () => BEATS.map((b, i) => ({ k: b.k, a: +b.a.toFixed(3), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(3) })).filter((x) => x.k);

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  if (t < T0 - 0.001) return null;
  let i = 0; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++;
  const b = BEATS[i], tr: Tr = b.tr === "zoom" && BEATS[i - 1]?.w3 ? "portal" : b.tr, D = DUR[tr], k = D > 0 ? (t - b.a) / D : 1;
  const base = i > 0 && k < 1 ? transition(tr, k, BEATS[i - 1].r(t), b.r(t), b.p ?? [960, 540]) : [<AbsoluteFill key="b">{b.r(t)}</AbsoluteFill>];
  const fin = 1 - e(t, TEND - 0.7, TEND - 0.05);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fin }}>
        {base}
        {pieces(t)}
      </AbsoluteFill>
      <Flash t={t} at={T0 + 0.02} peak={0.0} w={0.3} />
    </AbsoluteFill>
  );
};
void extrude;
