// clyde2 · componentes PROPIOS del video del tocino (Bc*). Multicapa: textura real del oficio (papel de carnicero, kraft,
// pizarra, pino, acero) + sombra proyectada + objeto (foto real) + datos + acento animado con resorte. 2 familias: Oswald + Caveat.
// Paleta = el ahumadero de la foto de Clyde: pino, cuero, jean, papel crema; rojo sello sólo como acento.
import React from "react";
import { AbsoluteFill, Img, interpolate } from "remotion";
import { img, fr, sp, useT, LABEL, HAND, fit, type P } from "../lkit/core";

const K = { pine: "#8A5A33", leather: "#5C3420", denim: "#3F5E84", cream: "#F4EBD8", kraft: "#B8875A", ink: "#2A1E16", red: "#A3261E", mahog: "#6E2E16", chalk: "#F2EFE6", gold: "#E9C46A" };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
const tex = (k: string) => img(k);

// ── capas base ──
const Bed: React.FC<{ k: string; f: number; d: number; blur?: number; dim?: number }> = ({ k, f, d, blur = 16, dim = 0.5 }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 + 0.06 * (f / Math.max(1, d))})`, filter: `blur(${blur}px) brightness(${dim})` }} />
  </AbsoluteFill>
);
const Tex: React.FC<{ k: string; style?: React.CSSProperties; tint?: string }> = ({ k, style, tint }) => (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <Img src={tex(k)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    {tint ? <div style={{ position: "absolute", inset: 0, background: tint }} /> : null}
  </div>
);
// foto real impresa: borde blanco, sombra proyectada larga, cae con resorte y rota apenas
const Print: React.FC<{ k: string; x: number; y: number; w: number; h: number; rot?: number; f: number; at: number; border?: number; drift?: number }> = ({ k, x, y, w, h, rot = 0, f, at, border = 14, drift = 0 }) => {
  const s = sp(f, at, 15, 120);
  const dy = (1 - s) * 60, sc = 0.94 + 0.06 * s;
  return (
    <div style={{ position: "absolute", left: x, top: y + dy, width: w, height: h, opacity: cl(s * 1.4), transform: `rotate(${rot + (1 - s) * 3 + drift * Math.sin(f / 40)}deg) scale(${sc})`,
      background: "#FBF8F1", padding: border, boxShadow: "0 30px 60px rgba(20,10,4,0.55), 0 6px 14px rgba(20,10,4,0.35)" }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
};
const Tape: React.FC<{ x: number; y: number; rot: number; o?: number }> = ({ x, y, rot, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 42, transform: `rotate(${rot}deg)`, opacity: o, background: "rgba(236,222,190,0.82)", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }} />
);
// trazo dibujado (subrayado / círculo / tachado / tilde / cruz) con dash animado
const Draw: React.FC<{ d: string; f: number; at: number; dur?: number; color?: string; w?: number; len?: number; vb?: string; style?: React.CSSProperties }> = ({ d, f, at, dur = 12, color = K.red, w = 9, len = 2400, vb = "0 0 1920 1080", style }) => {
  const p = ez((f - at) / dur);
  return (
    <svg viewBox={vb} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={p > 0 ? 0.92 : 0} />
    </svg>
  );
};
const ellipse = (cx: number, cy: number, rx: number, ry: number) => `M ${cx + rx} ${cy} C ${cx + rx} ${cy - ry * 1.1}, ${cx - rx * 1.05} ${cy - ry}, ${cx - rx} ${cy + 4} C ${cx - rx * 0.95} ${cy + ry * 1.05}, ${cx + rx * 1.1} ${cy + ry}, ${cx + rx * 0.9} ${cy - ry * 0.75}`;
const Lab: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties; ls?: number }> = ({ children, size, color = K.ink, style, ls = 1 }) => (
  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: size, color, letterSpacing: ls, lineHeight: 1.02, textTransform: "uppercase", ...style }}>{children}</div>
);
const Hand: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = K.ink, style }) => (
  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, ...style }}>{children}</div>
);
// aparición limpia (sin parpadeo): sube 18 px y entra con resorte
const In: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ f, at, children, style, from = 18 }) => {
  const s = sp(f, at, 16, 150);
  return <div style={{ opacity: cl(s * 1.6), transform: `translateY(${(1 - s) * from}px)`, ...style }}>{children}</div>;
};
// escritura a mano: revela de izquierda a derecha
const Write: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 16, children, style }) => {
  const p = ez((f - at) / dur);
  return <div style={{ clipPath: p >= 1 ? undefined : `inset(-20% ${100 - p * 100}% -20% -2%)`, opacity: p > 0 ? 1 : 0, ...style }}>{children}</div>;
};
const Stamp: React.FC<{ f: number; at: number; txt: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ f, at, txt, color = K.red, size = 64, rot = -8, style }) => {
  const s = sp(f, at, 11, 220);
  return (
    <div style={{ position: "absolute", opacity: cl(s * 2), transform: `rotate(${rot}deg) scale(${1.5 - 0.5 * s})`, border: `7px solid ${color}`, borderRadius: 10, padding: "6px 22px", color, fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap", mixBlendMode: "multiply", ...style }}>{txt}</div>
  );
};

// ═══ 1 · Ticket de balanza que se imprime ═══
export const BcScale: P<{ k: string; title: string; rows: { txt: string; val: string; t: number; big?: boolean }[] }> = ({ a, d, k, title, rows }) => {
  const { f, at } = useT(a);
  const shown = rows.filter((r) => f >= at(r.t) - 2).length;
  const hT = 170 + 112 * rows.reduce((m, r, i) => m + (r.big ? 1.25 : 1) * ez((f - at(r.t) + 2) / 10), 0);
  const tot = rows[rows.length - 1];
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={150} y={170} w={880} h={560} rot={-3} f={f} at={0} drift={0.3} />
      {/* cabezal de acero de la balanza */}
      <Tex k="t_steel" style={{ left: 1140, top: 96, width: 640, height: 120, borderRadius: 14, boxShadow: "0 18px 40px rgba(0,0,0,0.6)" }} tint="rgba(0,0,0,0.12)" />
      <div style={{ position: "absolute", left: 1190, top: 190, width: 540, height: 14, background: "#151515", borderRadius: 6 }} />
      <Lab size={30} color="#2b2b2b" style={{ position: "absolute", left: 1170, top: 128, letterSpacing: 6 }}>SCALE · LB</Lab>
      {/* ticket */}
      <div style={{ position: "absolute", left: 1205, top: 197, width: 510, height: hT, overflow: "hidden", boxShadow: "0 24px 40px rgba(0,0,0,0.45)" }}>
        <Tex k="t_paper" style={{ inset: 0 }} tint="rgba(255,252,244,0.35)" />
        <div style={{ position: "absolute", left: 34, right: 34, top: 26 }}>
          <Lab size={30} color={K.ink} style={{ letterSpacing: 4, borderBottom: `3px dashed ${K.ink}`, paddingBottom: 10 }}>{title}</Lab>
          {rows.map((r, i) => (i < shown ? (
            <In key={i} f={f} at={at(r.t)} from={-10} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: r.big ? 22 : 18, borderTop: r.big ? `3px solid ${K.ink}` : undefined, paddingTop: r.big ? 14 : 0 }}>
              <Lab size={r.big ? 40 : 34} color={K.ink} style={{ letterSpacing: 3 }}>{r.txt}</Lab>
              <Lab size={r.big ? 76 : 44} color={r.big ? K.red : K.ink}>{r.val}</Lab>
            </In>) : null))}
        </div>
      </div>
      <Draw f={f} at={at(tot.t) + 10} d={ellipse(1580, 197 + hT - 62, 150, 58)} w={8} />
    </AbsoluteFill>
  );
};

// ═══ 2 · 1 libra vs 5 libras, mismo precio ═══
type Side = { k: string; w: string; p: string; cap: string };
export const BcVersus: P<{ left: Side; right: Side; t: number; t2: number }> = ({ a, d, left, right, t, t2 }) => {
  const { f, at } = useT(a);
  const tag = (s: Side, x: number, when: number, hot: boolean) => (
    <In f={f} at={when} style={{ position: "absolute", left: x, top: 760, width: 420 }}>
      <div style={{ position: "relative", background: hot ? K.cream : "#E9DFC9", padding: "18px 26px 16px 70px", borderRadius: "10px 10px 10px 10px", boxShadow: "0 16px 30px rgba(0,0,0,0.45)", clipPath: "polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)" }}>
        <div style={{ position: "absolute", left: 30, top: "50%", width: 20, height: 20, marginTop: -10, borderRadius: 10, background: K.kraft, boxShadow: "inset 0 2px 3px rgba(0,0,0,0.5)" }} />
        <Lab size={70} color={K.ink}>{s.w}</Lab>
        <Lab size={56} color={hot ? K.red : K.ink} style={{ marginTop: 4 }}>{s.p}</Lab>
        <Hand size={38} color={K.leather}>{s.cap}</Hand>
      </div>
    </In>
  );
  const eq = sp(f, at(t2), 14, 120);
  return (
    <AbsoluteFill>
      <Tex k="t_kraft" style={{ inset: 0 }} tint="rgba(40,20,8,0.18)" />
      <Print k={left.k} x={150} y={110} w={700} h={520} rot={-4} f={f} at={0} />
      <Print k={right.k} x={1070} y={90} w={700} h={540} rot={3} f={f} at={8} />
      {tag(left, 260, Math.max(4, at(t) - 6), false)}
      {tag(right, 1180, Math.max(12, at(t) + 6), true)}
      <div style={{ position: "absolute", left: 860, top: 380, width: 200, textAlign: "center", opacity: cl(eq * 1.5), transform: `scale(${0.6 + 0.4 * eq})` }}>
        <Lab size={150} color={K.cream} style={{ textShadow: "0 8px 22px rgba(0,0,0,0.6)" }}>=</Lab>
        <Lab size={40} color={K.cream} style={{ textShadow: "0 6px 16px rgba(0,0,0,0.7)" }}>SAME $</Lab>
      </div>
      <Stamp f={f} at={at(t2) + 12} txt="5× THE BACON" style={{ left: 1260, top: 30 }} size={58} rot={6} />
    </AbsoluteFill>
  );
};

// ═══ 3 · La tira que se encoge ═══
export const BcShrink: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const sh = ez((f - at(t)) / 30);
  const bar = (y: number, label: string, frac: number, col: string, when: number, note: string) => (
    <In f={f} at={when} style={{ position: "absolute", left: 1090, top: y, width: 700 }}>
      <Lab size={40} color={K.cream} style={{ letterSpacing: 4 }}>{label}</Lab>
      <div style={{ marginTop: 12, height: 64, width: 660, background: "rgba(255,255,255,0.12)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: `${frac * 100}%`, height: "100%", background: col, borderRadius: 8, boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.2)" }} />
      </div>
      <Hand size={46} color={K.gold} style={{ marginTop: 8 }}>{note}</Hand>
    </In>
  );
  return (
    <AbsoluteFill>
      <Tex k="t_counter" style={{ inset: 0 }} tint="rgba(20,10,4,0.55)" />
      <Print k={k} x={110} y={150} w={880} h={640} rot={-2} f={f} at={0} />
      {bar(250, "STORE PACKAGE", 1 - 0.5 * sh, "#C9B79A", at(t) - 4, sh > 0.6 ? "shrank to half" : "")}
      {bar(520, "THE SLAB", 1, "#B5623A", at(t2) - 4, f > at(t2) + 10 ? "laid flat" : "")}
      <Stamp f={f} at={at(t) + 32} txt="−50%" style={{ left: 1500, top: 190 }} size={60} rot={-10} />
    </AbsoluteFill>
  );
};

// ═══ 4 · Tablero de letras (menú) ═══
export const BcMenu: P<{ head: string; items: { txt: string; t: number; hot?: boolean }[] }> = ({ a, d, head, items }) => {
  const { f, at } = useT(a);
  const felt = "repeating-linear-gradient(180deg, #1d1b1a 0px, #1d1b1a 10px, #0f0e0d 10px, #0f0e0d 13px)";
  const s0 = sp(f, 0, 16, 110);
  return (
    <AbsoluteFill>
      <Tex k="t_pine" style={{ inset: 0 }} tint="rgba(30,15,5,0.35)" />
      <div style={{ position: "absolute", left: 300, top: 70 + (1 - s0) * 40, width: 1320, height: 940, background: "#5a3a22", borderRadius: 18, padding: 26, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", opacity: cl(s0 * 1.5) }}>
        <div style={{ width: "100%", height: "100%", background: felt, borderRadius: 6, padding: "48px 70px", boxSizing: "border-box", boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)" }}>
          <Lab size={78} color="#F7F3EA" style={{ letterSpacing: 10, textAlign: "center" }}>{head}</Lab>
          <div style={{ height: 3, background: "rgba(247,243,234,0.5)", margin: "22px 120px 30px" }} />
          {items.map((it, i) => {
            const s = sp(f, at(it.t), 13, 170);
            return (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 16, opacity: cl(s * 1.8), transform: `translateX(${(1 - s) * -40}px)` }}>
                <Lab size={74} color={it.hot ? K.gold : "#F7F3EA"} style={{ width: 90, letterSpacing: 2 }}>{(it as any).n ?? i + 1}.</Lab>
                <Lab size={fit(it.txt, 1000, 82, "label")} color={it.hot ? K.gold : "#F7F3EA"} style={{ letterSpacing: 5 }}>{it.txt}</Lab>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 5 · 55 años (número grande en cuero) ═══
export const BcYears: P<{ k: string; num: number; txt: string; sub: string; t: number }> = ({ a, d, k, num, txt, sub, t }) => {
  const { f, at } = useT(a);
  const n = Math.round(num * ez((f - at(t)) / 26));
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={900} y={130} w={900} h={700} rot={2.5} f={f} at={0} />
      <In f={f} at={4} style={{ position: "absolute", left: 120, top: 250, width: 700, padding: "40px 50px", background: K.leather, borderRadius: 16, boxShadow: "0 30px 60px rgba(0,0,0,0.6), inset 0 0 0 4px rgba(233,196,106,0.35)" }}>
        <Lab size={230} color={K.gold} style={{ lineHeight: 0.9 }}>{n}</Lab>
        <Lab size={56} color={K.cream} style={{ letterSpacing: 4 }}>{txt}</Lab>
        <Hand size={54} color="#E7D2B0" style={{ marginTop: 10 }}>{sub}</Hand>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 6 · Foto vieja clavada en el pino ═══
export const BcPhoto: P<{ k: string; cap: string; date: string; t: number }> = ({ a, d, k, cap, date, t }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Tex k="t_pine" style={{ inset: 0 }} tint="rgba(30,15,5,0.25)" />
      <Print k={k} x={480} y={90} w={960} h={700} rot={-2} f={f} at={0} border={26} />
      <Tape x={440} y={80} rot={-30} o={cl(sp(f, 6) * 2)} />
      <Tape x={1340} y={70} rot={28} o={cl(sp(f, 8) * 2)} />
      <Write f={f} at={Math.max(8, at(t))} dur={20} style={{ position: "absolute", left: 520, top: 830, width: 900, textAlign: "center" }}>
        <Hand size={70} color={K.cream} style={{ textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>{cap}</Hand>
      </Write>
      <Stamp f={f} at={Math.max(14, at(t) + 14)} txt={date} color={K.gold} size={46} rot={-6} style={{ left: 1260, top: 700, mixBlendMode: "normal" }} />
    </AbsoluteFill>
  );
};

// ═══ 7 · Tarjeta de fichero del abuelo ═══
export const BcCard: P<{ k: string; lines: { txt: string; t: number }[]; sig: string }> = ({ a, d, k, lines, sig }) => {
  const { f, at } = useT(a);
  const s = sp(f, 0, 15, 110);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.45} />
      <div style={{ position: "absolute", left: 330, top: 150 + (1 - s) * 60, width: 1260, height: 760, transform: `rotate(${-1.5 + (1 - s) * 2}deg)`, opacity: cl(s * 1.5),
        background: `repeating-linear-gradient(180deg, transparent 0px, transparent 88px, rgba(70,110,170,0.35) 88px, rgba(70,110,170,0.35) 91px), #F3E8CF`,
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)", borderRadius: 6, padding: "40px 80px", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 3, background: "rgba(180,40,40,0.55)" }} />
        <Lab size={34} color="#7a6448" style={{ letterSpacing: 6 }}>FROM THE SMOKEHOUSE · CURING</Lab>
        <div style={{ marginTop: 50 }}>
          {lines.map((l, i) => (
            <Write key={i} f={f} at={at(l.t)} dur={18} style={{ marginTop: 6 }}>
              <Hand size={104} color="#24324f">{l.txt}</Hand>
            </Write>
          ))}
        </div>
        <Write f={f} at={at(lines[lines.length - 1].t) + 20} dur={14} style={{ position: "absolute", right: 80, bottom: 40 }}>
          <Hand size={60} color="#5a4630">{sig}</Hand>
        </Write>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 8 · Etiqueta de pieza colgada de un hilo ═══
export const BcPiece: P<{ n: number; name: string; sub: string; k: string; t: number }> = ({ a, d, n, name, sub, k, t }) => {
  const { f, at } = useT(a);
  const s = sp(f, 2, 7, 60);
  const sw = (1 - s) * 18 + Math.sin(f / 22) * 1.2 * cl(f / 30);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} blur={6} dim={0.55} />
      <div style={{ position: "absolute", left: 700, top: -40, width: 520, height: 1000, transformOrigin: "260px 0px", transform: `rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: 257, top: 0, width: 5, height: 190, background: "#d9c9a6", boxShadow: "2px 0 3px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 0, top: 170, width: 520, height: 700, clipPath: "polygon(22% 0, 78% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
          <Tex k="t_kraft" style={{ inset: 0 }} tint="rgba(233,205,150,0.35)" />
          <div style={{ position: "absolute", left: 230, top: 36, width: 60, height: 60, borderRadius: 30, background: "#2a1a10", boxShadow: "0 0 0 10px #C9A46A" }} />
          <div style={{ position: "absolute", left: 40, right: 40, top: 140, textAlign: "center" }}>
            <Lab size={52} color={K.leather} style={{ letterSpacing: 10 }}>PIECE</Lab>
            <Lab size={250} color={K.ink} style={{ lineHeight: 0.95 }}>{n}</Lab>
            <div style={{ height: 4, background: K.ink, margin: "10px 40px 18px" }} />
            <Lab size={fit(name, 430, 74, "label")} color={K.ink} style={{ letterSpacing: 2 }}>{name}</Lab>
            <Write f={f} at={at(t)} dur={16}><Hand size={fit(sub, 440, 56, "hand")} color={K.red} style={{ marginTop: 14 }}>{sub}</Hand></Write>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 9 · La panceta de costado: qué mirar ═══
export const BcBelly: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const call = (x: number, y: number, ok: boolean, txt: string, when: number) => (
    <In f={f} at={when} style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 18, background: "rgba(244,235,216,0.96)", padding: "14px 28px", borderRadius: 12, boxShadow: "0 18px 34px rgba(0,0,0,0.5)" }}>
      <Lab size={64} color={ok ? "#2F6B3A" : K.red}>{ok ? "✓" : "✗"}</Lab>
      <Hand size={60} color={K.ink}>{txt}</Hand>
    </In>
  );
  const r = ez((f - at(t3)) / 18);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={130} y={120} w={1240} h={820} rot={-1} f={f} at={0} />
      <Draw f={f} at={at(t)} d="M 330 560 C 520 520, 760 600, 1080 540" color={K.gold} w={10} />
      {call(1290, 220, true, "meat streaks all through", at(t))}
      {call(1290, 420, false, "one thin red line", at(t2))}
      {/* regla */}
      <div style={{ position: "absolute", left: 1420, top: 600, width: 120, height: 360 * r, background: "#E8D08A", boxShadow: "0 14px 30px rgba(0,0,0,0.5)", borderRadius: 4, overflow: "hidden" }}>
        {Array.from({ length: 13 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, top: i * 28, width: i % 4 === 0 ? 60 : 32, height: 3, background: K.ink }} />)}
      </div>
      <In f={f} at={at(t3) + 8} style={{ position: "absolute", left: 1570, top: 700 }}>
        <Lab size={110} color={K.cream} style={{ textShadow: "0 6px 18px rgba(0,0,0,0.7)" }}>1½"</Lab>
        <Hand size={56} color={K.gold}>even, end to end</Hand>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 10 · La cura en pizarra de tiza ═══
export const BcChalk: P<{ head: string; lines: { txt: string; t: number; hot?: boolean }[] }> = ({ a, d, head, lines }) => {
  const { f, at } = useT(a);
  const s = sp(f, 0, 16, 110);
  return (
    <AbsoluteFill>
      <Tex k="t_pine" style={{ inset: 0 }} tint="rgba(30,15,5,0.4)" />
      <div style={{ position: "absolute", left: 210, top: 80 + (1 - s) * 40, width: 1500, height: 900, padding: 30, background: "#7a5232", borderRadius: 14, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", opacity: cl(s * 1.5), boxSizing: "border-box" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 4 }}>
          <Tex k="t_chalk" style={{ inset: 0 }} tint="rgba(10,14,12,0.25)" />
          <div style={{ position: "absolute", left: 80, right: 80, top: 50 }}>
            <Lab size={60} color="rgba(242,239,230,0.85)" style={{ letterSpacing: 8 }}>{head}</Lab>
            {lines.map((l, i) => (
              <Write key={i} f={f} at={at(l.t)} dur={20} style={{ marginTop: 34 }}>
                <Hand size={fit(l.txt, 1260, 120, "hand")} color={l.hot ? K.gold : K.chalk} style={{ textShadow: "0 0 2px rgba(255,255,255,0.4)" }}>{l.txt}</Hand>
              </Write>
            ))}
          </div>
          {lines.some((l) => l.hot) ? <Draw f={f} at={at(lines.find((l) => l.hot)!.t) + 22} d="M 90 760 C 500 790, 900 740, 1290 770" color={K.gold} w={7} vb="0 0 1440 840" /> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 11 · La semana del volteo ═══
export const BcWeek: P<{ k: string; t: number; step: number; tag: string; t2: number }> = ({ a, d, k, t, step, tag, t2 }) => {
  const { f, at } = useT(a);
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={560} y={70} w={800} h={470} rot={-1.5} f={f} at={0} />
      <div style={{ position: "absolute", left: 110, top: 600, width: 1700, height: 300, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", opacity: cl(sp(f, 3) * 1.5) }}>
        <Tex k="t_kraft" style={{ inset: 0 }} />
        {days.map((dd, i) => {
          const w = at(t) + i * fr(step);
          const c = sp(f, w, 12, 180);
          return (
            <div key={i} style={{ position: "absolute", left: 30 + i * 238, top: 30, width: 210, height: 240, border: `4px solid ${K.ink}`, borderRadius: 8, background: "rgba(255,248,232,0.35)" }}>
              <Lab size={44} color={K.ink} style={{ textAlign: "center", marginTop: 14, letterSpacing: 4 }}>{dd}</Lab>
              <div style={{ textAlign: "center", opacity: cl(c * 2), transform: `rotate(${(1 - c) * -180}deg) scale(${0.5 + 0.5 * c})` }}>
                <Lab size={120} color={K.red}>⟲</Lab>
              </div>
            </div>
          );
        })}
      </div>
      <Stamp f={f} at={at(t2)} txt={tag} color={K.denim} size={54} rot={-3} style={{ left: 560, top: 920, mixBlendMode: "normal", background: "rgba(244,235,216,0.95)" }} />
    </AbsoluteFill>
  );
};

// ═══ 12 · La regla de los días ═══
export const BcRule: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const r = ez((f - at(t2)) / 20);
  return (
    <AbsoluteFill>
      <Tex k="t_counter" style={{ inset: 0 }} tint="rgba(20,10,4,0.45)" />
      <Print k={k} x={1020} y={140} w={780} h={560} rot={2} f={f} at={0} />
      <In f={f} at={at(t)} style={{ position: "absolute", left: 140, top: 140 }}>
        <Lab size={240} color={K.cream} style={{ lineHeight: 0.9, textShadow: "0 10px 26px rgba(0,0,0,0.6)" }}>7</Lab>
        <Lab size={92} color={K.cream} style={{ letterSpacing: 8, textShadow: "0 6px 16px rgba(0,0,0,0.6)" }}>DAYS</Lab>
      </In>
      <div style={{ position: "absolute", left: 140, top: 790, width: 1640 * r, height: 110, background: "#E8D08A", borderRadius: 6, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        {Array.from({ length: 25 }).map((_, i) => <div key={i} style={{ position: "absolute", top: 0, left: 20 + i * 66, width: 4, height: i % 4 === 0 ? 70 : 38, background: K.ink }} />)}
      </div>
      <In f={f} at={at(t2) + 6} style={{ position: "absolute", left: 140, top: 640 }}>
        <Hand size={92} color={K.gold} style={{ textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>1 day for every ¼ inch</Hand>
      </In>
      <Stamp f={f} at={at(t3)} txt="+ 1 DAY" size={74} rot={-7} style={{ left: 1080, top: 640, mixBlendMode: "normal", background: "rgba(244,235,216,0.95)" }} />
    </AbsoluteFill>
  );
};

// ═══ 13 · La prueba de la sartén: sellos ═══
export const BcFry: P<{ k: string; words: [string, number][] }> = ({ a, d, k, words }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={180} y={110} w={1000} h={860} rot={-2} f={f} at={0} />
      {words.map(([w, t], i) => (
        <Stamp key={i} f={f} at={at(t)} txt={w} color={i === 2 ? K.red : K.ink} size={96} rot={[-6, 4, -3][i % 3]} style={{ left: 1250, top: 170 + i * 250, mixBlendMode: "normal", background: "rgba(244,235,216,0.94)" }} />
      ))}
    </AbsoluteFill>
  );
};

// ═══ 14 · Humo fino y azul vs blanco y espeso ═══
export const BcSmoke: P<{ good: string; bad: string; t: number; t2: number }> = ({ a, d, good, bad, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Tex k="t_steel" style={{ inset: 0 }} tint="rgba(10,10,10,0.55)" />
      <Print k={good} x={110} y={120} w={820} h={620} rot={-2.5} f={f} at={0} />
      <Print k={bad} x={990} y={140} w={820} h={620} rot={2} f={f} at={6} />
      <In f={f} at={at(t)} style={{ position: "absolute", left: 180, top: 790, background: K.denim, padding: "16px 34px", borderRadius: 10, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}>
        <Lab size={64} color={K.cream}>✓ THIN &amp; BLUE</Lab>
      </In>
      <In f={f} at={at(t2)} style={{ position: "absolute", left: 1080, top: 810, background: K.red, padding: "16px 34px", borderRadius: 10, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}>
        <Lab size={64} color={K.cream}>✗ THICK &amp; WHITE</Lab>
      </In>
      <Draw f={f} at={at(t2) + 8} d="M 1010 160 L 1790 740 M 1790 160 L 1010 740" w={12} />
    </AbsoluteFill>
  );
};

// ═══ 15 · Termómetro de dial que sube a 150 ═══
export const BcThermo: P<{ k: string; target: number; pit: number; t: number; t2: number }> = ({ a, d, k, target, pit, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / Math.max(12, at(t2) - at(t) + 8));
  const val = Math.round(40 + (target - 40) * p);
  const ang = -135 + 270 * ((val - 0) / 220);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={110} y={150} w={900} h={700} rot={-2} f={f} at={0} />
      <div style={{ position: "absolute", left: 1130, top: 140, width: 640, height: 640, borderRadius: 320, background: "radial-gradient(circle at 40% 35%, #ffffff, #e9e4da 70%, #cfc8ba)", boxShadow: "0 40px 70px rgba(0,0,0,0.6), inset 0 0 0 22px #b9b9b9, inset 0 0 0 28px #8d8d8d", opacity: cl(sp(f, 2) * 1.5) }}>
        {Array.from({ length: 23 }).map((_, i) => {
          const an = -135 + i * (270 / 22);
          return <div key={i} style={{ position: "absolute", left: 318, top: 50, width: 4, height: i % 2 === 0 ? 44 : 24, background: K.ink, transformOrigin: "2px 270px", transform: `rotate(${an}deg)` }} />;
        })}
        <div style={{ position: "absolute", left: 312, top: 70, width: 16, height: 260, background: K.red, borderRadius: 8, transformOrigin: "8px 250px", transform: `rotate(${ang}deg)`, boxShadow: "0 4px 8px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 290, top: 290, width: 60, height: 60, borderRadius: 30, background: "#444" }} />
        <Lab size={110} color={K.ink} style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}>{val}°</Lab>
      </div>
      <In f={f} at={6} style={{ position: "absolute", left: 1230, top: 840, background: K.leather, padding: "12px 30px", borderRadius: 10, boxShadow: "0 14px 28px rgba(0,0,0,0.5)" }}>
        <Lab size={48} color={K.cream}>KETTLE {pit}°F · PULL AT {target}°F</Lab>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 16 · Papel de carnicero: dónde se guarda ═══
export const BcWrap: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const row = (i: number, big: string, small: string, when: number) => (
    <In f={f} at={when} style={{ position: "absolute", left: 1150, top: 200 + i * 230, width: 660, background: "rgba(244,235,216,0.96)", padding: "18px 30px", borderRadius: 10, borderLeft: `14px solid ${[K.kraft, K.denim, "#7FA7C9"][i]}`, boxShadow: "0 18px 34px rgba(0,0,0,0.5)" }}>
      <Lab size={58} color={K.ink}>{big}</Lab>
      <Hand size={50} color={K.leather}>{small}</Hand>
    </In>
  );
  return (
    <AbsoluteFill>
      <Tex k="t_kraft" style={{ inset: 0 }} tint="rgba(30,15,5,0.35)" />
      <Print k={k} x={120} y={140} w={960} h={760} rot={-2} f={f} at={0} />
      {row(0, "BUTCHER PAPER", "wrap the slab tight", at(t))}
      {row(1, "FRIDGE · 2 WEEKS", "slice what you need", at(t2))}
      {row(2, "FREEZER · WHOLE", "paper, then a bag", at(t3))}
    </AbsoluteFill>
  );
};

// ═══ 17 · 45 minutos de freezer ═══
export const BcTimer: P<{ k: string; mins: number; t: number; t2: number }> = ({ a, d, k, mins, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / 40);
  const R0 = 250, C0 = 2 * Math.PI * R0;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(160,200,230,0.18), rgba(0,0,0,0))" }} />
      <Print k={k} x={980} y={150} w={830} h={640} rot={2} f={f} at={0} />
      <svg viewBox="0 0 600 600" style={{ position: "absolute", left: 200, top: 200, width: 600, height: 600, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}>
        <circle cx={300} cy={300} r={290} fill="#F4EBD8" />
        <circle cx={300} cy={300} r={R0} fill="none" stroke="#D9CDB3" strokeWidth={40} />
        <circle cx={300} cy={300} r={R0} fill="none" stroke={K.denim} strokeWidth={40} strokeDasharray={C0} strokeDashoffset={C0 * (1 - p * 0.75)} transform="rotate(-90 300 300)" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 200, top: 360, width: 600, textAlign: "center" }}>
        <Lab size={190} color={K.ink} style={{ lineHeight: 0.9 }}>{Math.round(mins * p)}</Lab>
        <Lab size={56} color={K.ink} style={{ letterSpacing: 8 }}>MINUTES</Lab>
      </div>
      <Stamp f={f} at={at(t2)} txt="JUST STIFF · NOT FROZEN" color={K.denim} size={52} rot={-4} style={{ left: 300, top: 860, mixBlendMode: "normal", background: "rgba(244,235,216,0.95)" }} />
    </AbsoluteFill>
  );
};

// ═══ 18 · Problema → arreglo (nota del carnicero) ═══
export const BcFix: P<{ k: string; n: number; problem: string; fix: string; t: number; t2: number }> = ({ a, d, k, n, problem, fix, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={130} y={140} w={1000} h={780} rot={-2} f={f} at={0} />
      <In f={f} at={4} style={{ position: "absolute", left: 1220, top: 150 }}>
        <Lab size={46} color={K.gold} style={{ letterSpacing: 8 }}>WHAT WENT WRONG · {n}</Lab>
      </In>
      <Write f={f} at={at(t)} dur={14} style={{ position: "absolute", left: 1220, top: 230, width: 620 }}>
        <Hand size={fit(problem, 600, 110, "hand")} color={K.cream} style={{ textShadow: "0 4px 14px rgba(0,0,0,0.75)" }}>{problem}</Hand>
      </Write>
      <In f={f} at={at(t2)} style={{ position: "absolute", left: 1220, top: 520, width: 600, background: "rgba(244,235,216,0.97)", padding: "22px 30px", borderRadius: 12, boxShadow: "0 18px 34px rgba(0,0,0,0.5)", borderTop: `12px solid ${K.denim}` }}>
        <Lab size={40} color={K.denim} style={{ letterSpacing: 6 }}>THE FIX</Lab>
        <Hand size={fit(fix, 540, 72, "hand", 2)} color={K.ink}>{fix}</Hand>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 19 · Libro de cuentas (papel contable) ═══
export const BcLedger: P<{ rows: { txt: string; val: string; t: number }[]; total: { txt: string; val: string; t: number } }> = ({ a, d, rows, total }) => {
  const { f, at } = useT(a);
  const s = sp(f, 0, 16, 110);
  const paper = "repeating-linear-gradient(180deg, transparent 0px, transparent 96px, rgba(60,120,80,0.35) 96px, rgba(60,120,80,0.35) 99px), #EFEBD9";
  return (
    <AbsoluteFill>
      <Tex k="t_counter" style={{ inset: 0 }} tint="rgba(20,10,4,0.45)" />
      <div style={{ position: "absolute", left: 300, top: 70 + (1 - s) * 50, width: 1320, height: 940, background: paper, transform: "rotate(-1deg)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", opacity: cl(s * 1.5), padding: "40px 90px", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 1000, top: 0, bottom: 0, width: 3, background: "rgba(180,40,40,0.5)" }} />
        <Lab size={46} color="#3c5a44" style={{ letterSpacing: 8 }}>FIVE POUNDS OF BACON</Lab>
        {rows.map((r, i) => (
          <Write key={i} f={f} at={at(r.t)} dur={14} style={{ position: "absolute", left: 90, top: 150 + i * 132, width: 1140, display: "flex", justifyContent: "space-between" }}>
            <Hand size={84} color="#22314F">{r.txt}</Hand><Hand size={84} color="#22314F">{r.val}</Hand>
          </Write>
        ))}
        <Draw f={f} at={at(rows[1].t) - 6} d="M 80 210 L 1240 196" w={8} vb="0 0 1320 940" />
        <div style={{ position: "absolute", left: 90, right: 90, top: 690, height: 5, background: "#22314F", opacity: f > at(total.t) - 4 ? 1 : 0 }} />
        <Write f={f} at={at(total.t)} dur={14} style={{ position: "absolute", left: 90, top: 720, width: 1140, display: "flex", justifyContent: "space-between" }}>
          <Hand size={110} color={K.red}>{total.txt}</Hand><Hand size={120} color={K.red}>{total.val}</Hand>
        </Write>
        <Draw f={f} at={at(total.t) + 16} d={ellipse(1130, 790, 150, 80)} w={8} vb="0 0 1320 940" />
      </div>
    </AbsoluteFill>
  );
};

// ═══ 20 · Lo que queda en el año ═══
export const BcYear: P<{ k: string; per: number; num: number; t: number; t2: number }> = ({ a, d, k, per, num, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t2)) / 36);
  const weeks = Math.round(52 * p);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={1060} y={110} w={760} h={560} rot={2.5} f={f} at={0} />
      <In f={f} at={at(t)} style={{ position: "absolute", left: 130, top: 120 }}>
        <Lab size={52} color={K.cream} style={{ letterSpacing: 6, textShadow: "0 4px 12px rgba(0,0,0,0.7)" }}>YOU KEEP, EVERY 5 LB</Lab>
        <Lab size={230} color={K.gold} style={{ lineHeight: 0.95, textShadow: "0 10px 26px rgba(0,0,0,0.6)" }}>${per}</Lab>
      </In>
      <div style={{ position: "absolute", left: 130, top: 720, width: 1660, display: "flex", flexWrap: "wrap", gap: 10, opacity: cl((f - at(t2) + 6) / 8) }}>
        {Array.from({ length: 52 }).map((_, i) => <div key={i} style={{ width: 54, height: 54, borderRadius: 8, background: i < weeks ? K.gold : "rgba(255,255,255,0.15)", boxShadow: i < weeks ? "0 4px 10px rgba(0,0,0,0.4)" : "none" }} />)}
      </div>
      <In f={f} at={at(t2) + 30} style={{ position: "absolute", left: 1120, top: 560, background: K.red, padding: "14px 34px", borderRadius: 10, boxShadow: "0 18px 34px rgba(0,0,0,0.5)" }}>
        <Lab size={82} color={K.cream}>${num}+ A YEAR</Lab>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 21 · Sartén fría + perilla a medio-bajo ═══
export const BcSkillet: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const rot = -120 + 150 * ez((f - at(t2)) / 18);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={120} y={130} w={1040} h={800} rot={-1.5} f={f} at={0} />
      <In f={f} at={at(t)} style={{ position: "absolute", left: 1260, top: 150, background: "#7FA7C9", padding: "14px 34px", borderRadius: 10, boxShadow: "0 18px 34px rgba(0,0,0,0.5)" }}>
        <Lab size={70} color={K.ink}>COLD PAN</Lab>
      </In>
      <div style={{ position: "absolute", left: 1330, top: 420, width: 360, height: 360, borderRadius: 180, background: "radial-gradient(circle at 40% 35%, #fafafa, #d8d4cc)", boxShadow: "0 30px 50px rgba(0,0,0,0.55)" }}>
        {["OFF", "LOW", "MED", "HIGH"].map((w, i) => (
          <Lab key={w} size={34} color={K.ink} style={{ position: "absolute", left: 180 + 140 * Math.cos(((-150 + i * 60) * Math.PI) / 180) - 40, top: 180 + 140 * Math.sin(((-150 + i * 60) * Math.PI) / 180) - 20, width: 80, textAlign: "center" }}>{w}</Lab>
        ))}
        <div style={{ position: "absolute", left: 120, top: 120, width: 120, height: 120, borderRadius: 60, background: "#2b2b2b", transform: `rotate(${rot}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", left: 54, top: 6, width: 12, height: 50, background: K.gold, borderRadius: 6 }} />
        </div>
      </div>
      <In f={f} at={at(t2) + 12} style={{ position: "absolute", left: 1290, top: 820 }}>
        <Hand size={70} color={K.gold} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }}>medium-low, slow</Hand>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 22 · Tu precio en los comentarios ═══
export const BcComment: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Print k={k} x={140} y={150} w={880} h={680} rot={-2} f={f} at={0} />
      <In f={f} at={at(t) - 4} style={{ position: "absolute", left: 1100, top: 220, width: 700, background: "#FBF5E6", padding: "30px 40px", borderRadius: 14, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", transform: "rotate(1.5deg)" }}>
        <Lab size={40} color={K.leather} style={{ letterSpacing: 6 }}>DOWN IN THE COMMENTS</Lab>
        <Write f={f} at={at(t)} dur={18}><Hand size={84} color="#22314F" style={{ marginTop: 18 }}>belly: $___ / lb</Hand></Write>
        <Write f={f} at={at(t2)} dur={18}><Hand size={84} color="#22314F">from: ________</Hand></Write>
      </In>
    </AbsoluteFill>
  );
};

// ═══ superposición: sello de goma a un costado (nunca sobre la cara) ═══
export const BcStamp: P<{ txt: string; side?: "l" | "r" }> = ({ a, d, txt, side = "r" }) => {
  const { f } = useT(a);
  const out = cl((d - f) / 8);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Stamp f={f} at={0} txt={txt} size={66} rot={side === "r" ? -6 : 5} style={{ [side === "r" ? "right" : "left"]: 90, top: 90, mixBlendMode: "normal", background: "rgba(244,235,216,0.95)", boxShadow: "0 16px 30px rgba(0,0,0,0.45)" } as any} />
    </AbsoluteFill>
  );
};
