// gus1 · componentes PROPIOS del video de las manchas marrones del inodoro (Gj*). Mundo del conserje de hotel:
// llavero de bronce, tarjeta de inspección, cuaderno del turno noche, etiqueta que se tacha, balde, cronómetro, recibo.
// Multicapa: foto real desenfocada de fondo → superficie con textura real (madera de la llavera, azulejo, papel, corcho)
// → sombra proyectada → objeto/foto → datos → acento animado con resorte. 2 familias: Barlow Condensed + Kalam.
// Paleta = la piecita de Gus: azul pizarra de la camisa, azul marino del parche, bronce del llavero, nogal, crema, porcelana.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { img, sp, useT, type P } from "../lkit/core";

const LB = loadBarlow("normal", { weights: ["600", "700", "800"], subsets: ["latin"] }).fontFamily;
const HD = loadKalam("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const K = { slate: "#4F6177", navy: "#1F2E48", brass: "#C9A15A", brassD: "#8E6C2F", walnut: "#5A3A22", cream: "#EFE6D2", porc: "#FAF8F3", ink: "#1E1A16", red: "#B3342B", green: "#3E7C4F", rust: "#B5602A", paper: "#F7F1E1" };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };

// ── capas base ──
const Bed: React.FC<{ k: string; f: number; d: number; blur?: number; dim?: number }> = ({ k, f, d, blur = 14, dim = 0.45 }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
    <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.1 + 0.06 * (f / Math.max(1, d))})`, filter: `blur(${blur}px) brightness(${dim}) saturate(0.85)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(10,8,6,0.45) 100%)" }} />
  </AbsoluteFill>
);
const Tex: React.FC<{ k: string; style?: React.CSSProperties; tint?: string; children?: React.ReactNode }> = ({ k, style, tint, children }) => (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <Img src={img(k)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    {tint ? <div style={{ position: "absolute", inset: 0, background: tint }} /> : null}
    {children}
  </div>
);
const Photo: React.FC<{ k: string; x: number; y: number; w: number; h: number; rot?: number; f: number; at: number; border?: number; pos?: string }> = ({ k, x, y, w, h, rot = 0, f, at, border = 12, pos = "50% 50%" }) => {
  const s = sp(f, at, 15, 120);
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - s) * 50, width: w, height: h, opacity: cl(s * 1.5), transform: `rotate(${rot + (1 - s) * 2.5}deg) scale(${0.95 + 0.05 * s})`,
      background: "#FDFBF6", padding: border, boxShadow: "0 28px 56px rgba(10,6,2,0.55), 0 6px 14px rgba(10,6,2,0.35)" }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block" }} />
    </div>
  );
};
const In: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; x?: number }> = ({ f, at, children, style, from = 22, x = 0 }) => {
  const s = sp(f, at, 16, 150);
  return <div style={{ opacity: cl(s * 1.6), transform: `translate(${(1 - s) * x}px, ${(1 - s) * from}px)`, ...style }}>{children}</div>;
};
const Write: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 18, children, style }) => {
  const p = ez((f - at) / dur);
  return <div style={{ clipPath: p >= 1 ? undefined : `inset(-30% ${100 - p * 100}% -30% -2%)`, opacity: p > 0 ? 1 : 0, ...style }}>{children}</div>;
};
const Draw: React.FC<{ d: string; f: number; at: number; dur?: number; color?: string; w?: number; len?: number; vb?: string; style?: React.CSSProperties }> = ({ d, f, at, dur = 12, color = K.red, w = 8, len = 2600, vb = "0 0 1920 1080", style }) => {
  const p = ez((f - at) / dur);
  return (
    <svg viewBox={vb} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={p > 0 ? 0.95 : 0} />
    </svg>
  );
};
const Lab: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties; ls?: number; w?: number }> = ({ children, size, color = K.ink, style, ls = 1.5, w = 700 }) => (
  <div style={{ fontFamily: LB, fontWeight: w, fontSize: size, color, letterSpacing: ls, lineHeight: 1.02, textTransform: "uppercase", ...style }}>{children}</div>
);
const Hand: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = K.navy, style }) => (
  <div style={{ fontFamily: HD, fontWeight: 700, fontSize: size, color, lineHeight: 1.1, ...style }}>{children}</div>
);
const Stamp: React.FC<{ f: number; at: number; txt: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ f, at, txt, color = K.red, size = 60, rot = -7, style }) => {
  const s = sp(f, at, 11, 220);
  return (
    <div style={{ position: "absolute", opacity: cl(s * 2), transform: `rotate(${rot}deg) scale(${1.5 - 0.5 * s})`, border: `6px solid ${color}`, borderRadius: 10, padding: "4px 20px", color, fontFamily: LB, fontWeight: 800, fontSize: size, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap", background: "rgba(250,248,243,0.92)", boxShadow: "0 10px 24px rgba(0,0,0,0.35)", ...style }}>{txt}</div>
  );
};
const Check: React.FC<{ f: number; at: number; size?: number; no?: boolean; color?: string }> = ({ f, at, size = 54, no, color }) => {
  const p = ez((f - at) / 9);
  const c = color || (no ? K.red : K.green);
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ flex: "none" }}>
      <rect x={4} y={4} width={52} height={52} rx={6} fill="rgba(255,255,255,0.6)" stroke={K.ink} strokeWidth={3} />
      {no ? <path d="M16 16 L44 44 M44 16 L16 44" stroke={c} strokeWidth={7} strokeLinecap="round" strokeDasharray={90} strokeDashoffset={90 * (1 - p)} />
          : <path d="M13 31 L26 44 L48 15" fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={70} strokeDashoffset={70 * (1 - p)} />}
    </svg>
  );
};
// etiqueta de llave de bronce (la del tablero de la Lafayette)
const KeyTag: React.FC<{ n: string | number; lit?: number; size?: number }> = ({ n, lit = 0, size = 1 }) => (
  <div style={{ position: "relative", width: 92 * size, height: 150 * size }}>
    <div style={{ position: "absolute", left: 40 * size, top: 0, width: 12 * size, height: 34 * size, background: `linear-gradient(90deg, ${K.brassD}, ${K.brass}, ${K.brassD})`, borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 0, top: 30 * size, width: 92 * size, height: 120 * size, borderRadius: `${46 * size}px ${46 * size}px 12px 12px`,
      background: `linear-gradient(160deg, #E8C980 0%, ${K.brass} 45%, ${K.brassD} 100%)`, boxShadow: `0 10px 20px rgba(0,0,0,0.5), 0 0 ${40 * lit}px rgba(255,214,120,${0.9 * lit})`,
      display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${K.brassD}` }}>
      <div style={{ fontFamily: LB, fontWeight: 800, fontSize: 46 * size, color: "#3B2A10", textShadow: "0 1px 0 rgba(255,240,200,0.6)" }}>{n}</div>
    </div>
  </div>
);
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// ═══ 1 · Etiqueta de precio: $380 inodoro nuevo se tacha → $3 bidón de vinagre ═══
export const GjTag: P<{ k: string; old: string; sub: string; neu: string; sub2: string; t: number; t2: number }> = ({ a, d, k, old, sub, neu, sub2, t, t2 }) => {
  const { f, at } = useT(a);
  const s2 = sp(f, at(t2), 13, 160);
  const Tag = ({ txt, cap, x, y, rot, col, o }: any) => (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, opacity: o }}>
      <div style={{ position: "relative", width: 520, height: 300, background: K.paper, borderRadius: "18px 18px 18px 18px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)" }}>
        <div style={{ position: "absolute", left: 34, top: 132, width: 36, height: 36, borderRadius: 18, background: "#3A2E22", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6)" }} />
        <Lab size={150} color={col} style={{ position: "absolute", left: 110, top: 22 }}>{txt}</Lab>
        <Hand size={40} color={K.ink} style={{ position: "absolute", left: 114, top: 200 }}>{cap}</Hand>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.5} />
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080"><path d="M 470 120 Q 560 260 520 330" stroke="#2A2018" strokeWidth={4} fill="none" /></svg>
      <In f={f} at={at(t) - 6}><Tag txt={old} cap={sub} x={250} y={300} rot={-6} col={K.ink} o={1} /></In>
      <Draw f={f} at={at(t) + 18} dur={10} w={14} d="M 380 420 L 740 380" />
      <Draw f={f} at={at(t) + 24} dur={10} w={14} d="M 380 470 L 750 450" />
      <div style={{ position: "absolute", left: 1000, top: 330 - (1 - s2) * 80, opacity: cl(s2 * 1.5), transform: `rotate(${5 - 3 * (1 - s2)}deg) scale(${0.9 + 0.1 * s2})` }}>
        <Tag txt={neu} cap={sub2} x={0} y={0} rot={0} col={K.green} o={1} />
      </div>
      <Stamp f={f} at={at(t2) + 10} txt="ONE NIGHT" color={K.green} size={54} rot={-10} style={{ left: 1180, top: 690 }} />
    </AbsoluteFill>
  );
};

// ═══ 2 · Siete llaves de bronce colgadas en el tablero; la 6 brilla ═══
export const GjTags: P<{ k: string; head: string; hot: number; txt6: string; t: number; t2: number }> = ({ a, d, k, head, hot, txt6, t, t2 }) => {
  const { f, at } = useT(a);
  const glow = ez((f - at(t2)) / 14);
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ inset: 0 }} tint="rgba(30,18,8,0.35)" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(255,220,150,0.18), rgba(0,0,0,0.55) 75%)" }} />
      <In f={f} at={at(t) - 8}><Lab size={92} color={K.cream} ls={8} style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", textShadow: "0 6px 20px rgba(0,0,0,0.7)" }}>{head}</Lab></In>
      <div style={{ position: "absolute", top: 300, left: 0, width: "100%", display: "flex", justifyContent: "center", gap: 70 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((n, i) => {
          const s = sp(f, at(t) + i * 4, 10, 120);
          const sw = Math.sin((f - at(t) - i * 4) / 9) * 6 * Math.exp(-Math.max(0, f - at(t) - i * 4) / 40);
          const isHot = n === hot;
          return (
            <div key={n} style={{ position: "relative", transformOrigin: "50% 0", transform: `translateY(${(1 - s) * -120}px) rotate(${sw + (isHot ? glow * 0 : 0)}deg) scale(${isHot ? 1 + 0.18 * glow : 1})`, opacity: cl(s * 2) * (isHot ? 1 : 1 - 0.45 * glow) }}>
              <div style={{ position: "absolute", left: 38, top: -26, width: 18, height: 18, borderRadius: 9, background: "#2B2015", boxShadow: "0 2px 0 rgba(255,255,255,0.2)" }} />
              <KeyTag n={n} lit={isHot ? glow : 0} size={1.25} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, width: "100%", top: 610, display: "flex", justifyContent: "center" }}>
        <In f={f} at={at(t2) + 6}><div style={{ background: K.navy, border: `3px solid ${K.brass}`, padding: "16px 36px", borderRadius: 12, boxShadow: "0 18px 40px rgba(0,0,0,0.6)" }}>
          <Hand size={58} color={K.cream}>#{hot} — {txt6}</Hand></div></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 3 · Tablero de llaves de la Lafayette: se encienden 212 etiquetas ═══
export const GjKeys: P<{ k: string; num: number; txt: string; sub: string; t: number }> = ({ a, d, k, num, txt, sub, t }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / 50);
  const n = Math.round(num * p);
  const cols = 18, rows = 6;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.35} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 1100, height: 760, background: `linear-gradient(180deg, #4A2E1A, #2E1C10)`, borderRadius: 16, boxShadow: "0 40px 80px rgba(0,0,0,0.7), inset 0 0 0 10px #3A2414" }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const on = i < (n / num) * cols * rows;
          const x = 60 + (i % cols) * 56, y = 70 + Math.floor(i / cols) * 112;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#C9A15A", position: "absolute", left: 13, top: -8 }} />
              <div style={{ width: 32, height: 52, borderRadius: "16px 16px 5px 5px", background: on ? "linear-gradient(160deg,#F2D898,#C9A15A)" : "linear-gradient(160deg,#6E5A36,#4A3A20)",
                boxShadow: on ? "0 0 18px rgba(255,210,120,0.75)" : "0 3px 6px rgba(0,0,0,0.6)" }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 1290, top: 250, width: 560 }}>
        <Lab size={230} color={K.brass} style={{ textShadow: "0 10px 30px rgba(0,0,0,0.7)" }}>{n}</Lab>
        <In f={f} at={at(t) + 10}><Lab size={54} color={K.cream} ls={3}>{txt}</Lab></In>
        <In f={f} at={at(t) + 22}><Hand size={50} color={K.brass} style={{ marginTop: 18 }}>{sub}</Hand></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 4 · Foto vieja clavada en el corcho del vestuario (1979) ═══
export const GjSnap: P<{ k: string; cap: string; date: string; t: number }> = ({ a, d, k, cap, date, t }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.3} blur={22} />
      <div style={{ position: "absolute", left: 470, top: 90, width: 980, height: 900, background: "linear-gradient(135deg,#B48A5A,#9C744A)", borderRadius: 8, boxShadow: "0 30px 70px rgba(0,0,0,0.6), inset 0 0 0 14px #6E4C2C" }} />
      <Photo k={k} x={600} y={150} w={720} h={560} rot={-3} f={f} at={at(t) - 4} border={18} />
      <In f={f} at={at(t) + 6} style={{ position: "absolute", left: 930, top: 132 }}><div style={{ width: 34, height: 34, borderRadius: 17, background: "radial-gradient(circle at 35% 35%, #F05A4A, #8E1E14)", boxShadow: "0 6px 10px rgba(0,0,0,0.5)" }} /></In>
      <In f={f} at={at(t) + 14} style={{ position: "absolute", left: 640, top: 760 }}>
        <div style={{ background: K.paper, padding: "14px 34px", transform: "rotate(2deg)", boxShadow: "0 12px 26px rgba(0,0,0,0.45)" }}>
          <Hand size={62} color={K.navy}>{cap} · <span style={{ color: K.red }}>{date}</span></Hand>
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 5 · Corte de la taza en la línea de agua: capas de mineral que crecen y atrapan la mancha ═══
export const GjRock: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const g1 = ez((f - at(t)) / 20), g2 = ez((f - at(t2)) / 26), g3 = ez((f - at(t3)) / 26);
  const layers = [{ c: "#E2D8BE", n: "CALCIUM", h: 46 }, { c: "#CDBE98", n: "MAGNESIUM", h: 38 }, { c: "#B97B3F", n: "IRON", h: 32 }];
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.42} />
      <div style={{ position: "absolute", left: 140, top: 110, width: 1640, height: 860, borderRadius: 24, background: "linear-gradient(180deg,#F7F5EF,#E7E3DA)", boxShadow: "0 40px 80px rgba(0,0,0,0.55)", overflow: "hidden" }}>
        <Lab size={46} color={K.slate} ls={6} style={{ position: "absolute", left: 60, top: 40 }}>INSIDE THE BOWL · AT THE WATERLINE</Lab>
        {/* porcelana en corte */}
        <div style={{ position: "absolute", left: 0, top: 380, width: 1640, height: 480, background: "linear-gradient(180deg,#FFFFFF,#EDEAE3)", borderTop: "4px solid #CFCAC0" }} />
        {/* agua */}
        <div style={{ position: "absolute", left: 0, top: 470, width: 1640, height: 390, background: "linear-gradient(180deg,rgba(150,190,215,0.55),rgba(90,140,175,0.7))" }} />
        <div style={{ position: "absolute", left: 0, top: 462, width: 1640, height: 10, background: "rgba(255,255,255,0.8)" }} />
        {/* capas minerales justo en la línea */}
        {layers.map((L, i) => {
          const gg = i === 0 ? g1 : i === 1 ? g2 : g2 * 0.9;
          const off = layers.slice(0, i).reduce((m, x) => m + x.h * (i === 1 ? g1 : g2), 0);
          return <div key={i} style={{ position: "absolute", left: 120, top: 456 - off - L.h * gg, width: 1400, height: L.h * gg, background: L.c, borderRadius: 6, boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.12)" }} />;
        })}
        {/* rugosidad + mancha atrapada */}
        {Array.from({ length: 34 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 140 + i * 41, top: 300 + ((i * 37) % 60), width: 26 + (i % 4) * 6, height: 18 + (i % 3) * 6, borderRadius: 10, background: "#6E4520", opacity: g3 * (0.5 + 0.5 * ((i % 5) / 5)), transform: `scale(${0.5 + 0.5 * g3})` }} />
        ))}
        <div style={{ position: "absolute", left: 120, top: 640, display: "flex", gap: 40 }}>
          {layers.map((L, i) => (
            <In key={i} f={f} at={at(i === 0 ? t : t2) + i * 6}><div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 8, background: L.c, border: "3px solid #3A3028" }} />
              <Lab size={48} color={K.navy}>{L.n}</Lab></div></In>
          ))}
        </div>
        <In f={f} at={at(t2) + 4} style={{ position: "absolute", right: 70, top: 120 }}><Hand size={56} color={K.slate}>thin as paper…</Hand></In>
        <In f={f} at={at(t3) + 6} style={{ position: "absolute", right: 70, top: 200 }}><Hand size={64} color={K.red}>…rough rock catches the stain</Hand></In>
        <Draw f={f} at={at(t3) + 14} color={K.red} w={6} vb="0 0 1640 860" d="M 1300 270 Q 1150 320 1020 390" />
      </div>
    </AbsoluteFill>
  );
};

// ═══ 6 · Etiqueta del bidón de lavandina: dos tildes y una cruz roja ═══
export const GjLabel: P<{ k: string; name: string; rows: { txt: string; ok: boolean; t: number }[]; verdict: string; tv: number }> = ({ a, d, k, name, rows, verdict, tv }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.5} />
      <Photo k={k} x={150} y={170} w={560} h={740} rot={-4} f={f} at={0} border={14} pos="50% 40%" />
      <In f={f} at={4} x={60} from={0} style={{ position: "absolute", left: 820, top: 180, width: 940 }}>
        <div style={{ background: K.porc, borderRadius: 18, padding: "40px 54px", boxShadow: "0 30px 70px rgba(0,0,0,0.55)", borderLeft: `18px solid ${K.slate}` }}>
          <Lab size={88} color={K.navy} ls={6}>{name}</Lab>
          <div style={{ height: 4, background: K.navy, opacity: 0.2, margin: "16px 0 26px" }} />
          {rows.map((r, i) => (
            <In key={i} f={f} at={at(r.t)} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 22 }}>
              <Check f={f} at={at(r.t) + 4} no={!r.ok} size={70} />
              <Lab size={58} color={r.ok ? K.ink : K.red} w={r.ok ? 600 : 800} style={{ textDecoration: "none" }}>{r.txt}</Lab>
            </In>
          ))}
        </div>
      </In>
      <Stamp f={f} at={at(tv)} txt={verdict} size={64} rot={-6} style={{ left: 900, top: 800, background: "rgba(250,248,243,0.85)" }} />
    </AbsoluteFill>
  );
};

// ═══ 7 · Prueba de la uña: ÁSPERO = PIEDRA / RESBALOSO = PELÍCULA + muestras de color ═══
export const GjTest: P<{ k: string; t: number; t2: number; sw: { c: string; txt: string; sub: string; t: number }[] }> = ({ a, d, k, t, t2, sw }) => {
  const { f, at } = useT(a);
  const swipe = ez((f - at(t)) / 22);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.55} blur={6} />
      <Tex k="t_tile" style={{ left: 90, top: 90, width: 1740, height: 900, borderRadius: 20, boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }} tint="rgba(250,248,243,0.55)" />
      <div style={{ position: "absolute", left: 160, top: 150, width: 760, height: 380, borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 40px rgba(0,0,0,0.4)" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <svg viewBox="0 0 760 380" style={{ position: "absolute", inset: 0 }}><path d={`M 60 200 L ${60 + 620 * swipe} ${200 - 30 * swipe}`} stroke="#FFF7D6" strokeWidth={10} strokeLinecap="round" opacity={0.9} /></svg>
      </div>
      <div style={{ position: "absolute", left: 990, top: 160, width: 780 }}>
        <In f={f} at={at(t) + 4} style={{ display: "flex", alignItems: "center", gap: 20 }}><Check f={f} at={at(t) + 8} size={72} /><Lab size={74} color={K.navy}>ROUGH = <span style={{ color: K.rust }}>ROCK</span></Lab></In>
        <Hand size={44} color={K.slate} style={{ marginLeft: 92 }}>like fine sandpaper</Hand>
        <In f={f} at={at(t2)} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 34 }}><Check f={f} at={at(t2) + 4} size={72} color={K.slate} /><Lab size={74} color={K.navy}>SLICK = FILM</Lab></In>
        <Hand size={44} color={K.slate} style={{ marginLeft: 92 }}>brush + soap takes it</Hand>
      </div>
      <div style={{ position: "absolute", left: 160, top: 600, display: "flex", gap: 46 }}>
        {sw.map((s, i) => (
          <In key={i} f={f} at={at(s.t)}><div style={{ width: 500, background: K.porc, borderRadius: 14, padding: 22, boxShadow: "0 16px 36px rgba(0,0,0,0.4)", display: "flex", gap: 22, alignItems: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: 60, background: `radial-gradient(circle at 35% 30%, ${s.c}CC, ${s.c})`, border: "5px solid #fff", boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }} />
            <div><Lab size={50} color={K.ink}>{s.txt}</Lab><Hand size={40} color={K.slate}>{s.sub}</Hand></div></div></In>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══ 8 · Llave de paso: flecha curva "a la derecha hasta que pare" → FLUSH ═══
export const GjValve: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const rot = 270 * ez((f - at(t)) / 30);
  const fl = sp(f, at(t2), 12, 170);
  return (
    <AbsoluteFill>
      <Img src={img(k)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.05 * (f / d)})`, filter: "brightness(0.8)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(15,20,30,0.75) 0%, rgba(15,20,30,0.2) 55%, rgba(0,0,0,0) 100%)" }} />
      <div style={{ position: "absolute", left: 1150, top: 260, width: 460, height: 460 }}>
        <svg viewBox="0 0 460 460" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <circle cx={230} cy={230} r={190} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={6} strokeDasharray="10 14" />
          <path d={`M 230 40 A 190 190 0 ${rot > 180 ? 1 : 0} 1 ${230 + 190 * Math.sin((rot * Math.PI) / 180)} ${230 - 190 * Math.cos((rot * Math.PI) / 180)}`} fill="none" stroke={K.brass} strokeWidth={16} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 130, top: 130, width: 200, height: 200, borderRadius: 100, background: "radial-gradient(circle at 35% 30%, #F4F4F4, #9AA0A6 70%, #5E646A)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", transform: `rotate(${rot}deg)` }}>
          <div style={{ position: "absolute", left: 20, top: 82, width: 160, height: 36, borderRadius: 18, background: "linear-gradient(180deg,#E9EBED,#8B9197)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 250, width: 900 }}>
        <In f={f} at={at(t) - 4}><Lab size={64} color={K.brass} ls={6}>STEP 1 · THE VALVE</Lab></In>
        <In f={f} at={at(t) + 4}><Lab size={110} color={K.porc}>TO THE RIGHT</Lab></In>
        <In f={f} at={at(t) + 14}><Hand size={66} color={K.cream}>until it stops</Hand></In>
        <div style={{ marginTop: 50, opacity: cl(fl * 1.5), transform: `scale(${0.8 + 0.2 * fl})`, transformOrigin: "left center", display: "inline-block", background: K.slate, border: `4px solid ${K.porc}`, borderRadius: 14, padding: "12px 34px" }}>
          <Lab size={84} color={K.porc} ls={8}>THEN FLUSH</Lab>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 9 · Termómetro: tibio como el baño ✓ · hirviendo ✗ (porcelana se raja) ═══
export const GjTherm: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const lv = 0.42 * ez((f - at(t)) / 24) + 0.5 * ez((f - at(t2)) / 18) - 0.5 * ez((f - at(t2) - 26) / 18);
  const crack = ez((f - at(t3)) / 16);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.45} />
      <div style={{ position: "absolute", left: 240, top: 110, width: 170, height: 860 }}>
        <div style={{ position: "absolute", left: 45, top: 0, width: 80, height: 700, borderRadius: 40, background: "rgba(255,255,255,0.9)", boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 6px #D9D3C6" }} />
        <div style={{ position: "absolute", left: 67, bottom: 140, width: 36, height: 600 * lv + 40, borderRadius: 18, background: lv > 0.6 ? K.red : K.rust }} />
        <div style={{ position: "absolute", left: 15, bottom: 0, width: 140, height: 140, borderRadius: 70, background: lv > 0.6 ? K.red : K.rust, boxShadow: "0 10px 24px rgba(0,0,0,0.5), inset 0 0 0 8px rgba(255,255,255,0.7)" }} />
        {[0.42, 0.92].map((y, i) => <div key={i} style={{ position: "absolute", left: 130, bottom: 140 + 600 * y + 20, width: 70, height: 6, background: K.porc }} />)}
      </div>
      <In f={f} at={at(t)} style={{ position: "absolute", left: 480, top: 470 }}><div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(250,248,243,0.94)", padding: "20px 34px", borderRadius: 14 }}>
        <Check f={f} at={at(t) + 6} size={74} /><div><Lab size={70} color={K.green}>WARM LIKE BATH WATER</Lab><Hand size={44} color={K.slate}>warm acid works faster</Hand></div></div></In>
      <In f={f} at={at(t2)} style={{ position: "absolute", left: 480, top: 170 }}><div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(250,248,243,0.94)", padding: "20px 34px", borderRadius: 14 }}>
        <Check f={f} at={at(t2) + 6} size={74} no /><Lab size={70} color={K.red}>NOT BOILING</Lab></div></In>
      <div style={{ position: "absolute", left: 1230, top: 230, width: 520, height: 600, opacity: cl(crack * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "48% 48% 40% 40%", background: "radial-gradient(ellipse at 50% 35%, #FFFFFF, #E4E0D8)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
        <Draw f={f} at={at(t3) + 4} dur={14} color="#3A342C" w={6} vb="0 0 520 600" d="M 260 40 L 240 140 L 285 210 L 235 320 L 275 420 L 250 560" />
        <Lab size={56} color={K.red} style={{ position: "absolute", left: 0, width: 520, textAlign: "center", top: 615 }}>SUDDEN SHOCK = CRACK</Lab>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 10 · Reloj de la noche: la aguja corre 8 horas, la luna pasa a sol ═══
export const GjClock: P<{ k: string; t: number; t2: number; hrs: number }> = ({ a, d, k, t, t2, hrs }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / Math.max(20, at(t2) - at(t)));
  const ang = p * hrs * 30;
  const sky = p;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.35 + 0.25 * sky} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(20,30,60,${0.55 * (1 - sky)}), rgba(255,200,120,${0.25 * sky}))` }} />
      <div style={{ position: "absolute", left: 300, top: 160, width: 760, height: 760, borderRadius: 380, background: "radial-gradient(circle at 40% 35%, #FFFDF6, #EDE6D4)", boxShadow: "0 40px 90px rgba(0,0,0,0.6), inset 0 0 0 22px #6B4A2A, inset 0 0 0 30px #C9A15A" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 375, top: 60, width: 10, height: 40, background: K.ink, transformOrigin: "5px 320px", transform: `rotate(${i * 30}deg)` }} />
        ))}
        <div style={{ position: "absolute", left: 370, top: 170, width: 20, height: 210, borderRadius: 10, background: K.navy, transformOrigin: "10px 210px", transform: `rotate(${330 + ang}deg)` }} />
        <div style={{ position: "absolute", left: 374, top: 110, width: 12, height: 270, borderRadius: 6, background: K.red, transformOrigin: "6px 270px", transform: `rotate(${ang * 12}deg)` }} />
        <div style={{ position: "absolute", left: 355, top: 355, width: 50, height: 50, borderRadius: 25, background: K.brass }} />
      </div>
      <div style={{ position: "absolute", left: 1140, top: 230, width: 680 }}>
        <Lab size={60} color={K.brass} ls={6}>LET IT WORK</Lab>
        <Lab size={200} color={K.porc} style={{ textShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>{Math.min(hrs, Math.round(p * hrs))} HRS</Lab>
        <In f={f} at={at(t) + 14}><Hand size={58} color={K.cream}>lid down · note on top · go to bed</Hand></In>
        <div style={{ marginTop: 30, display: "flex", gap: 30, alignItems: "center" }}>
          <div style={{ width: 90, height: 90, borderRadius: 45, background: "#E8E4D6", boxShadow: "inset -22px -6px 0 0 #9AA3B5", opacity: 1 - sky }} />
          <div style={{ width: 90, height: 90, borderRadius: 45, background: "radial-gradient(circle,#FFE08A,#F2A93B)", boxShadow: `0 0 ${50 * sky}px rgba(255,200,90,0.9)`, opacity: sky }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 11 · Cucharas de medida: 2 cdas · ½ taza · 3-4 h ═══
export const GjSpoon: P<{ k: string; rows: { amt: string; txt: string; t: number }[] }> = ({ a, d, k, rows }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.45} />
      <Photo k={k} x={130} y={200} w={720} h={640} rot={-3} f={f} at={0} />
      <div style={{ position: "absolute", left: 960, top: 140, width: 840 }}>
        <In f={f} at={2}><Lab size={64} color={K.brass} ls={6}>CITRIC ACID · FOR IRON</Lab></In>
        {rows.map((r, i) => {
          const s = sp(f, at(r.t), 14, 150);
          return (
            <div key={i} style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 30, opacity: cl(s * 1.6), transform: `translateX(${(1 - s) * 60}px)` }}>
              <div style={{ width: 250, height: 150, borderRadius: 75, background: `linear-gradient(160deg,#E6E8EA,#9CA3A9)`, boxShadow: "0 16px 30px rgba(0,0,0,0.5), inset 0 -10px 0 rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lab size={62} color={K.navy}>{r.amt}</Lab></div>
              <Hand size={52} color={K.porc} style={{ textShadow: "0 4px 14px rgba(0,0,0,0.7)", width: 540 }}>{r.txt}</Hand>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══ 12 · Prohibidos sobre azulejo: lana de acero, cepillo de alambre, rasqueta → tachados ═══
export const GjBan: P<{ k: string; items: { txt: string; k: string; t: number }[]; t2: number }> = ({ a, d, k, items, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ inset: 0 }} tint="rgba(20,16,12,0.35)" />
      <div style={{ position: "absolute", top: 160, left: 0, width: "100%", display: "flex", justifyContent: "center", gap: 60 }}>
        {items.map((it, i) => {
          const s = sp(f, at(it.t), 14, 130);
          return (
            <div key={i} style={{ position: "relative", width: 500, opacity: cl(s * 1.5), transform: `translateY(${(1 - s) * 60}px) rotate(${[-3, 2, -2][i % 3]}deg)` }}>
              <div style={{ background: "#FDFBF6", padding: 14, boxShadow: "0 26px 50px rgba(0,0,0,0.55)" }}>
                <Img src={img(it.k)} style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
                <Lab size={58} color={K.ink} style={{ textAlign: "center", padding: "14px 0 4px" }}>{it.txt}</Lab>
              </div>
              <Draw f={f} at={at(it.t) + 10} dur={9} color={K.red} w={20} vb="0 0 500 520" d="M 30 40 L 470 480" />
              <Draw f={f} at={at(it.t) + 15} dur={9} color={K.red} w={20} vb="0 0 500 520" d="M 470 40 L 30 480" />
            </div>
          );
        })}
      </div>
      <In f={f} at={at(t2)} style={{ position: "absolute", top: 820, width: "100%", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: K.red, padding: "14px 44px", borderRadius: 10 }}><Lab size={72} color={K.porc} ls={4}>THEY SCRATCH THE GLAZE</Lab></div>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 13 · Cuaderno del turno noche, habitación 912 ═══
export const GjLog: P<{ k: string; head: string; lines: { txt: string; t: number }[]; sig: string }> = ({ a, d, k, head, lines, sig }) => {
  const { f, at } = useT(a);
  const last = lines[lines.length - 1];
  return (
    <AbsoluteFill style={{ background: "#2A1E14" }}>
      <Bed k="o_toilet_1926" f={f} d={d} dim={0.3} blur={20} />
      <div style={{ position: "absolute", left: 360, top: 70, width: 1200, height: 940, transform: "rotate(-1.5deg)", boxShadow: "0 40px 90px rgba(0,0,0,0.7)" }}>
        <Tex k={k} style={{ inset: 0 }} />
        <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 4, background: "rgba(200,60,60,0.55)" }} />
        <Lab size={60} color={K.navy} ls={4} style={{ position: "absolute", left: 160, top: 50 }}>{head}</Lab>
        {lines.map((l, i) => (
          <Write key={i} f={f} at={at(l.t)} dur={22} style={{ position: "absolute", left: 160, top: 190 + i * 150 }}>
            <Hand size={76} color={K.navy}>{l.txt}</Hand>
          </Write>
        ))}
        <Write f={f} at={at(last.t) + 24} dur={12} style={{ position: "absolute", right: 120, bottom: 70 }}><Hand size={70} color={K.navy}>{sig}</Hand></Write>
      </div>
      <Photo k="o_toilet_1926" x={1420} y={140} w={380} h={460} rot={6} f={f} at={6} />
    </AbsoluteFill>
  );
};

// ═══ 14 · Tarjeta de receta: pasta de bórax ═══
export const GjRecipe: P<{ k: string; head: string; rows: { amt: string; txt: string; t: number }[]; foot: string; tf: number }> = ({ a, d, k, head, rows, foot, tf }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.45} />
      <Photo k={k} x={1180} y={200} w={600} h={560} rot={5} f={f} at={4} />
      <In f={f} at={0} style={{ position: "absolute", left: 150, top: 150 }}>
        <div style={{ width: 960, height: 760, background: K.paper, borderRadius: 10, boxShadow: "0 36px 80px rgba(0,0,0,0.6)", transform: "rotate(-2deg)", overflow: "hidden", position: "relative" }}>
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 170 + i * 66, height: 2, background: "rgba(80,120,170,0.3)" }} />)}
          <div style={{ position: "absolute", left: 0, right: 0, top: 128, height: 4, background: "rgba(190,60,60,0.55)" }} />
          <Lab size={78} color={K.navy} ls={6} style={{ position: "absolute", left: 60, top: 36 }}>{head}</Lab>
          {rows.map((r, i) => (
            <Write key={i} f={f} at={at(r.t)} style={{ position: "absolute", left: 60, top: 180 + i * 132, display: "flex", gap: 30, alignItems: "baseline" }}>
              <Hand size={72} color={K.red} style={{ width: 230 }}>{r.amt}</Hand><Hand size={72} color={K.navy}>{r.txt}</Hand>
            </Write>
          ))}
          <Stamp f={f} at={at(tf)} txt={foot} color={K.slate} size={52} rot={-4} style={{ left: 300, top: 620 }} />
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 15 · La nota en la almohada (1988) ═══
export const GjNote: P<{ k: string; txt: string; date: string; t: number; t2: number }> = ({ a, d, k, txt, date, t, t2 }) => {
  const { f, at } = useT(a);
  const s = sp(f, at(t) - 10, 16, 110);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.5} blur={10} />
      <div style={{ position: "absolute", left: 460, top: 210 + (1 - s) * 60, width: 1000, height: 600, opacity: cl(s * 1.5), transform: `rotate(${-3 + (1 - s) * 4}deg)` }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFFDF7", borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 298, height: 2, background: "rgba(0,0,0,0.08)" }} />
        <Lab size={34} color={K.brassD} ls={8} style={{ position: "absolute", left: 60, top: 44 }}>THE LAFAYETTE HOTEL</Lab>
        <Write f={f} at={at(t)} dur={40} style={{ position: "absolute", left: 60, top: 140, width: 880 }}><Hand size={84} color="#1F2E48">{txt}</Hand></Write>
        <In f={f} at={at(t2)} style={{ position: "absolute", right: 60, bottom: 50 }}><Hand size={48} color={K.slate}>{date}</Hand></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 16 · NUNCA MEZCLAR: tres pares de bidones con una X roja y nube de gas ═══
export const GjNoMix: P<{ k: string; pairs: { a: string; b: string; t: number }[]; tg: number }> = ({ a, d, k, pairs, tg }) => {
  const { f, at } = useT(a);
  const gas = ez((f - at(tg)) / 26);
  const Jug = ({ txt, col }: any) => (
    <div style={{ width: 190, height: 250, borderRadius: "40px 40px 24px 24px", background: `linear-gradient(160deg,#FFFFFF,${col})`, boxShadow: "0 18px 30px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: -40, left: 60, width: 70, height: 50, borderRadius: 10, background: col }} />
      <Lab size={34} color={K.ink} style={{ textAlign: "center", background: "rgba(255,255,255,0.85)", padding: "6px 10px", borderRadius: 6 }}>{txt}</Lab>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ inset: 0 }} tint="rgba(30,10,8,0.5)" />
      <Lab size={84} color={K.porc} ls={10} style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>NEVER MIX</Lab>
      <div style={{ position: "absolute", top: 240, width: "100%", display: "flex", justifyContent: "center", gap: 80 }}>
        {pairs.map((p, i) => {
          const s = sp(f, at(p.t), 13, 140);
          return (
            <div key={i} style={{ position: "relative", opacity: cl(s * 1.6), transform: `translateY(${(1 - s) * 60}px)`, display: "flex", alignItems: "center", gap: 18 }}>
              <Jug txt={p.a} col="#DCE6EE" /><Lab size={80} color={K.porc}>+</Lab><Jug txt={p.b} col={i === 1 ? "#E6F0D8" : "#F1EBDD"} />
              <Draw f={f} at={at(p.t) + 12} dur={9} color={K.red} w={22} vb="0 0 520 300" d="M 20 20 L 500 290" />
              <Draw f={f} at={at(p.t) + 17} dur={9} color={K.red} w={22} vb="0 0 520 300" d="M 500 20 L 20 290" />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, width: "100%", top: 640, height: 300, opacity: gas, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 500 + i * 140 + Math.sin(f / 12 + i) * 20, top: 40 - gas * 30 + (i % 2) * 40, width: 260, height: 180, borderRadius: 120, background: "rgba(214,232,150,0.28)", filter: "blur(18px)" }} />)}
        <div style={{ background: K.red, padding: "16px 46px", borderRadius: 10, transform: `scale(${0.85 + 0.15 * gas})` }}><Lab size={72} color={K.porc} ls={4}>TOXIC GAS · BURNS YOUR LUNGS</Lab></div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 17 · Debajo del borde: los agujeritos se tapan y pintan las rayas marrones ═══
export const GjRim: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const clog = ez((f - at(t2)) / 26), streak = ez((f - at(t3)) / 30);
  const N = 11;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <div style={{ position: "absolute", left: 130, top: 120, width: 1660, height: 840, borderRadius: 24, overflow: "hidden", background: "linear-gradient(180deg,#F5F3EE,#E6E2D8)", boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 200, background: "linear-gradient(180deg,#DCD7CC,#F2EFE8)", borderBottom: "6px solid #CFC9BC" }} />
        <Lab size={42} color={K.slate} ls={6} style={{ position: "absolute", left: 50, top: 40 }}>UNDER THE RIM · LOOKING UP</Lab>
        {Array.from({ length: N }).map((_, i) => {
          const x = 130 + i * 140, s = sp(f, at(t) + i * 2, 14, 160);
          const bad = i % 3 !== 1;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x, top: 168, width: 52, height: 52, borderRadius: 26, background: "#2E2A26", transform: `scale(${s})`, boxShadow: "inset 0 6px 10px rgba(0,0,0,0.7)" }} />
              {bad ? <div style={{ position: "absolute", left: x + 4, top: 172, width: 44, height: 44, borderRadius: 22, background: "radial-gradient(circle,#EDE6D3,#C9B998)", transform: `scale(${clog})` }} /> : null}
              {!bad ? <div style={{ position: "absolute", left: x + 14, top: 220, width: 24, height: 560 * streak, borderRadius: 12, background: "linear-gradient(180deg,rgba(120,72,30,0.85),rgba(150,95,45,0.25))" }} /> : null}
            </React.Fragment>
          );
        })}
        <In f={f} at={at(t2) + 6} style={{ position: "absolute", left: 60, top: 700 }}><div style={{ background: K.navy, padding: "14px 30px", borderRadius: 10 }}><Lab size={54} color={K.porc}>HOLES FILL WITH MINERAL</Lab></div></In>
        <In f={f} at={at(t3) + 6} style={{ position: "absolute", right: 60, top: 700 }}><div style={{ background: K.red, padding: "14px 30px", borderRadius: 10 }}><Lab size={54} color={K.porc}>SAME PATHS = BROWN STREAKS</Lab></div></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 18 · Corte del tanque: el tubo de rebalse → agujeros del borde, 1 taza de vinagre tibio ═══
export const GjTank: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const tube = ez((f - at(t)) / 18), flow = ez((f - at(t2)) / 40), cup = sp(f, at(t3), 14, 140);
  const path = "M 640 260 L 640 760 Q 640 820 700 820 L 1180 820 Q 1240 820 1260 760 L 1300 640";
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, borderRadius: 26, background: "rgba(250,248,243,0.95)", boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }}>
        <svg viewBox="0 0 1400 860" style={{ position: "absolute", inset: 0 }}>
          <rect x={200} y={120} width={720} height={520} rx={28} fill="#F3F1EC" stroke="#9FA6AD" strokeWidth={8} />
          <rect x={610} y={160 + 200 * (1 - tube)} width={60} height={480 - 200 * (1 - tube)} rx={10} fill={K.slate} opacity={tube} />
          <path d="M 260 640 Q 300 600 340 640" stroke="#555" strokeWidth={6} fill="none" />
          <ellipse cx={1240} cy={690} rx={170} ry={90} fill="#FFFFFF" stroke="#9FA6AD" strokeWidth={8} />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1110 + i * 65} cy={640} r={10} fill="#2E2A26" />)}
          <path d={path} fill="none" stroke="#D9D2C2" strokeWidth={26} strokeLinecap="round" />
          <path d={path} fill="none" stroke={K.brass} strokeWidth={14} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - flow)} />
        </svg>
        <In f={f} at={at(t)} style={{ position: "absolute", left: 40, top: 30 }}><Lab size={58} color={K.navy} ls={4}>THE OVERFLOW TUBE</Lab></In>
        <In f={f} at={at(t2)} style={{ position: "absolute", left: 960, top: 60, width: 420 }}><Hand size={50} color={K.slate}>…comes out of the rim holes</Hand></In>
        <div style={{ position: "absolute", left: 700, top: 10 - (1 - cup) * 60, opacity: cl(cup * 1.5), transform: `rotate(${-28 * cup}deg)` }}>
          <div style={{ width: 150, height: 170, borderRadius: "10px 10px 30px 30px", background: "linear-gradient(180deg,rgba(230,240,250,0.6),rgba(240,230,190,0.9))", border: "6px solid rgba(160,170,180,0.9)" }} />
        </div>
        <In f={f} at={at(t3) + 8} style={{ position: "absolute", left: 230, top: 690 }}><div style={{ background: K.navy, padding: "12px 30px", borderRadius: 10, display: "inline-block" }}><Lab size={56} color={K.porc}>1 CUP WARM VINEGAR · 1 HOUR</Lab></div></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 19 · Las 212 válvulas blandas: el contador de flappers en el libro de compras ═══
export const GjFlap: P<{ k: string; num: number; t: number; t2: number; t3: number }> = ({ a, d, k, num, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const warp = ez((f - at(t2)) / 20);
  const cnt = Math.round(num * ez((f - at(t3)) / 30));
  const bill = cnt * 6;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <Photo k={k} x={140} y={170} w={720} h={560} rot={-4} f={f} at={at(t) - 4} />
      <In f={f} at={at(t2) - 6} style={{ position: "absolute", left: 220, top: 780 }}>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <div style={{ width: 200, height: 120, borderRadius: "50%", background: "#1C1C1C", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
          <Lab size={60} color={K.porc}>→</Lab>
          <div style={{ width: 200, height: 120, borderRadius: "60% 40% 55% 45%", background: "#3A3A3A", transform: `skewX(${-18 * warp}deg) scaleY(${1 - 0.3 * warp})`, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
          <Hand size={52} color={K.porc}>soft &amp; warped</Hand>
        </div>
      </In>
      <In f={f} at={at(t3) - 4} style={{ position: "absolute", left: 1000, top: 170 }}>
        <div style={{ width: 780, background: K.paper, padding: "40px 50px", boxShadow: "0 36px 80px rgba(0,0,0,0.6)", transform: "rotate(2deg)", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 62px, rgba(60,120,80,0.18) 62px 64px)" }}>
          <Lab size={46} color={K.brassD} ls={6}>PURCHASE ORDER · 1994</Lab>
          <Hand size={64} color={K.navy} style={{ marginTop: 24 }}>toilet flappers, new</Hand>
          <Lab size={200} color={K.red} style={{ marginTop: 6 }}>×{cnt}</Lab>
          <Hand size={52} color={K.slate}>every one soft &amp; warped from the chlorine</Hand>
        </div>
      </In>
      <Stamp f={f} at={at(t3) + 34} txt="NOTHING IN THE TANK" size={52} rot={-5} style={{ left: 1060, top: 830 }} />
    </AbsoluteFill>
  );
};

// ═══ 20 · Horario de limpieza en el corcho de la oficina ═══
export const GjCal: P<{ k: string; items: { when: string; txt: string; t: number }[]; t2: number }> = ({ a, d, k, items, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ inset: 0 }} tint="rgba(40,24,10,0.2)" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,230,180,0.15), rgba(0,0,0,0.45) 80%)" }} />
      <Lab size={70} color={K.porc} ls={8} style={{ position: "absolute", top: 80, width: "100%", textAlign: "center", textShadow: "0 6px 20px rgba(0,0,0,0.7)" }}>GUS'S SCHEDULE</Lab>
      <div style={{ position: "absolute", top: 230, width: "100%", display: "flex", justifyContent: "center", gap: 50 }}>
        {items.map((it, i) => {
          const s = sp(f, at(it.t), 13, 130);
          return (
            <div key={i} style={{ width: 500, height: 520, background: [K.paper, "#FFF3B8", "#DDEBF4"][i % 3], boxShadow: "0 26px 50px rgba(0,0,0,0.55)", transform: `rotate(${[-3, 2, -1.5][i % 3]}deg) translateY(${(1 - s) * -80}px)`, opacity: cl(s * 1.6), padding: "60px 40px", position: "relative" }}>
              <div style={{ position: "absolute", left: 225, top: 16, width: 40, height: 40, borderRadius: 20, background: "radial-gradient(circle at 35% 35%, #F05A4A, #8E1E14)", boxShadow: "0 5px 8px rgba(0,0,0,0.5)" }} />
              <Lab size={76} color={i === 1 ? K.red : K.navy} ls={4}>{it.when}</Lab>
              <Hand size={60} color={K.navy} style={{ marginTop: 30 }}>{it.txt}</Hand>
            </div>
          );
        })}
      </div>
      <In f={f} at={at(t2)} style={{ position: "absolute", top: 860, width: "100%", textAlign: "center" }}><div style={{ display: "inline-block", background: K.navy, border: `3px solid ${K.brass}`, padding: "12px 40px", borderRadius: 10 }}><Lab size={60} color={K.porc}>TWO MINUTES A MONTH</Lab></div></In>
    </AbsoluteFill>
  );
};

// ═══ 21 · Libro de cuentas: la góndola vs el conserje ═══
export const GjLedger: P<{ k: string; left: { k: string; head: string; rows: string[][] }; right: { k: string; head: string; rows: string[][] }; t: number; t2: number; t3: number }> = ({ a, d, k, left, right, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const Side = ({ s, x, at0, col }: any) => (
    <div style={{ position: "absolute", left: x, top: 120, width: 760 }}>
      <Photo k={s.k} x={0} y={0} w={760} h={330} rot={0} f={f} at={at0} border={10} />
      <In f={f} at={at0 + 6} style={{ position: "absolute", top: 370, width: 760 }}><Lab size={64} color={col} ls={6}>{s.head}</Lab></In>
      {s.rows.map((r: string[], i: number) => (
        <In key={i} f={f} at={at0 + 12 + i * 14} style={{ position: "absolute", top: 460 + i * 86, width: 760, display: "flex", justifyContent: "space-between", borderBottom: "2px dashed rgba(40,40,40,0.3)", paddingBottom: 6 }}>
          <Hand size={52} color={K.navy}>{r[0]}</Hand><Lab size={60} color={col}>{r[1]}</Lab>
        </In>
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ left: 60, top: 50, width: 1800, height: 980, boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 958, top: 90, width: 4, height: 900, background: "rgba(60,120,80,0.35)" }} />
      <Side s={left} x={130} at0={at(t) - 10} col={K.red} />
      <Side s={right} x={1030} at0={at(t2) - 14} col={K.green} />
      <Stamp f={f} at={at(t3)} txt="WALTER KEPT $380" color={K.green} size={66} rot={-6} style={{ left: 620, top: 880, background: "rgba(247,241,225,0.9)" }} />
    </AbsoluteFill>
  );
};

// ═══ 22 · Tarjeta de inspección de habitación: los 7 puntos se tildan ═══
export const GjInspect: P<{ k: string; room: string; items: { txt: string; t: number }[] }> = ({ a, d, k, room, items }) => {
  const { f, at } = useT(a);
  const done = items.filter((it) => f >= at(it.t) + 6).length;
  return (
    <AbsoluteFill style={{ background: "#2A2F38" }}>
      <Bed k="n_bowl_white" f={f} d={d} dim={0.35} />
      <div style={{ position: "absolute", left: 420, top: 40, width: 1080, height: 1000 }}>
        <Tex k={k} style={{ inset: 0, borderRadius: 22, boxShadow: "0 40px 90px rgba(0,0,0,0.7)" }} />
        <div style={{ position: "absolute", left: 390, top: -14, width: 300, height: 80, borderRadius: 14, background: "linear-gradient(180deg,#D8DCE0,#8E959C)", boxShadow: "0 8px 16px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 70, top: 100, right: 70, bottom: 50, background: K.porc, boxShadow: "0 6px 14px rgba(0,0,0,0.3)", padding: "36px 50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Lab size={50} color={K.navy} ls={4}>ROOM INSPECTION</Lab><Lab size={50} color={K.red} ls={2}>{room}</Lab>
          </div>
          <div style={{ height: 4, background: K.navy, margin: "12px 0 18px" }} />
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 96, borderBottom: "2px solid rgba(31,46,72,0.15)" }}>
              <Check f={f} at={at(it.t) + 4} size={60} />
              <Lab size={34} color={K.slate} style={{ width: 40 }}>{i + 1}</Lab>
              <Write f={f} at={at(it.t)} dur={14}><Hand size={54} color={K.navy}>{it.txt}</Hand></Write>
            </div>
          ))}
          <div style={{ position: "absolute", right: 50, bottom: 24 }}><Lab size={44} color={done === items.length ? K.green : K.slate}>{done}/{items.length} ✓</Lab></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
