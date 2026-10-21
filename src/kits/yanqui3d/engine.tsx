// ykit · MOTOR de la vara gary01 (20-oct): una base por frase (toma agnes / mundo 3D / avatar) y CERO cortes secos —
// cada cambio de base es una transición (latigazo, portal desde un punto, zoom a través, giro de tarjeta, empuje, fogonazo),
// y las piezas 2.5D viven en una capa aparte (pieces) que CRUZA las transiciones. Todo anclado a la palabra con at("frase").
// Un video = makeVideo({ caps, avwin, avail, T0, TEND, beats: (h) => [...], pieces: (t, h) => [...] }). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COL, Flash, FONT, P, Portal, Vid, e, ei, s, spr, extrude } from "./lib";

export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110 }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${COL.red}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: COL.red, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: "0 0 30px rgba(255,60,40,.45)", textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// letrero de precio colgante (estante del garaje)
export const Price: React.FC<{ t: number; at: number; x: number; y: number; item: string; $: number; out: number }> = ({ t, at, x, y, item, $, out }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const sw = Math.sin((t - at) * 5) * 14 * Math.exp(-(t - at) * 2.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% -40px", transform: `translate(-50%,0) rotate(${sw}deg) scale(${Math.min(1.05, k)})` }}>
      <svg width={4} height={40} style={{ position: "absolute", left: "50%", top: -40 }}><line x1={2} y1={0} x2={2} y2={40} stroke="#ddd" strokeWidth={2} /></svg>
      <div style={{ background: "linear-gradient(180deg,#ffe7a3,#f2c860)", borderRadius: 10, padding: "8px 20px 10px", boxShadow: "0 18px 30px rgba(0,0,0,.55)", fontFamily: FONT, textAlign: "center", color: "#2a1d08" }}>
        <div style={{ fontWeight: 900, fontSize: 52, lineHeight: 1 }}>${$}</div>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 3 }}>{item}</div>
      </div>
    </div>
  );
};

// ---------- at("frase", después_de): segundo exacto en que la voz dice la frase (caps.json = [[texto, ms], ...]) ----------
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9$°]/g, "");
export const makeAt = (caps: [string, number][]) => {
  // un token de caps puede traer varias palabras ("about $25"): se parten con +0,3 s por palabra
  const W = caps.flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: norm(x), t: ms / 1000 + j * 0.3 }))).filter((x) => x.w);
  return (phrase: string, after = 0): number => {
    const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i < W.length; i++) {
      if (W[i].t < after - 0.01) continue;
      let ok = true;
      for (let j = 0; j < ws.length; j++) if (!W[i + j] || W[i + j].w !== ws[j]) { ok = false; break; }
      if (ok) return W[i].t;
    }
    throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
  };
};

// ---------- transiciones entre bases ----------
export type Tr = "whip" | "whipL" | "portal" | "zoom" | "flip" | "push" | "light" | "cut";
export const DUR: Record<Tr, number> = { whip: 0.5, whipL: 0.5, portal: 0.6, zoom: 0.55, flip: 0.6, push: 0.55, light: 0.5, cut: 0 };
const HB: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>;
export const transition = (tr: Tr, k: number, prev: React.ReactNode, cur: React.ReactNode, p: [number, number]) => {
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


export type Beat = { a: number; tr: Tr; p?: [number, number]; k?: string; r: (t: number) => React.ReactNode };
type Win = { ms: number; me: number; off: number };
export type Kit = {
  at: (phrase: string, after?: number) => number;
  Clip: React.FC<{ k: string; a: number; z?: [number, number]; dur?: number; style?: React.CSSProperties }>;
  Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }>;
  soft: (t: number, spans: [number, number][], amt?: number) => number;
  av: (ms: number) => number;
  AV: (ms: number, tr: Tr, opt?: { spans?: [number, number][]; edge?: boolean; p?: [number, number] }) => Beat;
  CL: (a: number, k: string, tr: Tr, p?: [number, number], z?: [number, number], extra?: (t: number) => React.ReactNode) => Beat;
};

export type VideoSpec = {
  caps: [string, number][];                     // tiempos de la voz (ASR Groq)
  avwin: number[][];                            // ventanas del avatar en el reel: [inicio_voz, fin_voz, offset_en_reel]
  avail: { clips: string[]; imgs: string[] };   // ltx_<k>.mp4 / img_<k>.jpg presentes en public/<slug> (avail.py)
  T0: number; TEND: number;                     // tramo que maneja este motor (segundos de la voz)
  reel?: string;                                // mp4 del avatar en public/<slug>/ (default reel0)
  beats: (h: Kit) => Beat[];
  pieces: (t: number, h: Kit) => React.ReactNode[];
  flashAtStart?: boolean;
};

export const makeVideo = (spec: VideoSpec) => {
  const { T0, TEND } = spec;
  const at = makeAt(spec.caps);
  const HAS = spec.avail;
  const Clip: Kit["Clip"] = ({ k, a, z = [1.03, 1.11], dur = 8, style }) => {
    const t = useCurrentFrame() / 30, sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
    const inner = HAS.clips.includes(k) ? <Vid id={"ltx_" + k} at={a} /> : HAS.imgs.includes(k) ? <Vid id={"img_" + k} /> :
      <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
    return <AbsoluteFill style={{ transform: `scale(${sc})`, ...style }}>{inner}</AbsoluteFill>;
  };
  // avatar: TODAS las ventanas pagadas del reel (preroll 10 cuadros, cola 0,65 s para salir con transición)
  const WINS: Win[] = spec.avwin.map(([ms, me, off]) => ({ ms, me, off }));
  const reel = spec.reel ?? "reel0";
  const Avatar: Kit["Avatar"] = ({ t, dark = 0 }) => {
    const face = WINS.filter((w) => w.ms >= T0 - 1).map((w, i) => (
      <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 30} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
          <OffthreadVideo src={staticFile(P + reel + ".mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    ));
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
        {/* ⛔ 21-oct: avatar SIN desenfoque (nada de blur, halo, feather ni máscara radial): sólo se oscurece apenas bajo una pieza */}
        <AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>{face}</AbsoluteFill>
      </AbsoluteFill>
    );
  };
  // blur del avatar mientras hay una pieza pesada encima: tramos [desde, hasta]
  const soft: Kit["soft"] = (t, spans, amt = 14) => spans.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 0.35) * (1 - e(t, b, b + 0.35))), 0) * amt;
  const av = (ms: number) => WINS.reduce((b, w) => (Math.abs(w.ms - ms) < Math.abs(b.ms - ms) ? w : b)).ms;
  const AV: Kit["AV"] = (ms, tr, opt = {}) => ({ a: av(ms), tr, p: opt.p, r: (t) => <Avatar t={t} blur={soft(t, opt.spans ?? [])} dark={soft(t, opt.spans ?? [], 0.35)} edge={opt.edge ? 0.8 : 0} /> });
  const CL: Kit["CL"] = (a, k, tr, p, z, extra) => ({ a, tr, p, k, r: (t) => <AbsoluteFill><Clip k={k} a={a} z={z} />{extra?.(t)}</AbsoluteFill> });
  const kit: Kit = { at, Clip, Avatar, soft, av, AV, CL };
  const BEATS = spec.beats(kit);
  const FRAMES = Math.ceil(TEND * 30);
  // tabla de control (orden y largos) + plan de tomas para la mezcla (audio nativo bajo la voz: mezcla_full.py)
  const beatTable = () => BEATS.map((b, i) => ({ i, a: +b.a.toFixed(2), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(2), tr: b.tr, k: b.k ?? "" }));
  const clipPlan = () => BEATS.map((b, i) => ({ k: b.k, a: +b.a.toFixed(3), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(3) })).filter((x) => x.k);
  const Body: React.FC = () => {
    const t = useCurrentFrame() / 30;
    if (t < T0 - 0.001) return null;
    let i = 0; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++;
    const b = BEATS[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
    const base = i > 0 && k < 1 ? transition(b.tr, k, BEATS[i - 1].r(t), b.r(t), b.p ?? [960, 540]) : [<AbsoluteFill key="b">{b.r(t)}</AbsoluteFill>];
    const fin = 1 - e(t, TEND - 0.7, TEND - 0.05);
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <AbsoluteFill style={{ opacity: fin }}>{base}{spec.pieces(t, kit)}</AbsoluteFill>
        {spec.flashAtStart !== false && <Flash t={t} at={T0 + 0.02} peak={0.7} w={0.35} />}
      </AbsoluteFill>
    );
  };
  return { Body, FRAMES, beatTable, clipPlan, kit };
};
