// valniveamix · piezas 2.5D con la marca de la Doctora Valeria Alcázar: papel crema, tinta espresso, latón/oro, Playfair,
// anotaciones a mano (Caveat). Viven encima del mundo, de las tomas y del avatar. Todas entran con resorte y profundidad.
import React from "react";
import { VAL, FONT_DISPLAY, FONT_SERIF, FONT_HAND, FONT_SANS, CARD_SHADOW, rgba } from "../valeria/theme";
import { e, ei, spr } from "./lib";

export const K = { ...VAL, water: "#3f8fcf", bad: VAL.terracotta, ok: VAL.sage };
const k1 = (t: number, a: number, s = 1) => Math.min(1.08, spr(t, a, s));
const vis = (t: number, at: number, out: number, fi = 0.14, fo = 0.3) => e(t, at, at + fi) * (1 - e(t, out, out + fo));
// tarjeta de papel con borde de latón
const card = (pad = "18px 30px"): React.CSSProperties => ({ background: `linear-gradient(180deg, ${VAL.card}, ${VAL.paper})`, border: `2px solid ${VAL.cardEdge}`, borderRadius: 18, boxShadow: CARD_SHADOW + `, inset 0 1px 0 rgba(255,255,255,.8)`, padding: pad });
const ink = (n = 3) => `0 ${n}px ${n * 4}px ${rgba("#FBF5E8", 0.9)}`;

// rótulo anclado a un punto de la pantalla (línea de latón + punto + tarjeta)
export const Tag: React.FC<{ t: number; at: number; x: number; y: number; dx?: number; dy?: number; text: string; sub?: string; col?: string; out?: number; size?: number }> = ({ t, at, x, y, dx = 140, dy = -110, text, sub, col = VAL.ink, out = 1e9, size = 46 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at), L = e(t, at, at + 0.35), ex = x + dx * L, ey = y + dy * L;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={VAL.gold} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 2px 4px ${rgba(VAL.ink, 0.45)})` }} />
        <circle cx={x} cy={y} r={10 * Math.min(1, k)} fill={VAL.card} stroke={VAL.gold} strokeWidth={4} />
        <circle cx={x} cy={y} r={18 + 30 * e(t, at, at + 0.7)} fill="none" stroke={VAL.gold} strokeWidth={2.5} opacity={1 - e(t, at, at + 0.7)} />
      </svg>
      <div style={{ position: "absolute", left: ex + (dx >= 0 ? 10 : -10), top: ey, perspective: 1000, transform: `translate(${dx >= 0 ? 0 : -100}%, -50%)` }}>
        <div style={{ ...card("14px 26px 16px"), transformOrigin: dx >= 0 ? "0 50%" : "100% 50%", transform: `rotateY(${(1 - Math.min(1, k)) * (dx >= 0 ? 55 : -55)}deg) scale(${0.65 + 0.35 * k})`, whiteSpace: "nowrap", borderLeft: `8px solid ${col === VAL.ink ? VAL.gold : col}` }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, color: col, letterSpacing: 0.5, lineHeight: 1.05 }}>{text}</div>
          {sub && <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: size * 0.46, color: VAL.inkSoft, letterSpacing: 3, marginTop: 6 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};

// número grande en Playfair con canto de latón (gira y nace desde el fondo)
export const BigNum: React.FC<{ t: number; at: number; text: string; x?: number; y?: number; size?: number; col?: string; out?: number; sub?: string; plate?: boolean }> = ({ t, at, text, x = 1400, y = 300, size = 200, col = VAL.ink, out = 1e9, sub, plate = true }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9), ry = (1 - Math.min(1, k)) * -65 + Math.sin((t - at) * 0.8) * 4;
  const edge = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 0.5}px ${(i + 1) * 0.9}px 0 ${VAL.goldDark}`).join(", ") + `, 6px 18px 30px ${rgba(VAL.ink, 0.35)}`;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o }}>
      <div style={{ transform: `translateZ(${(1 - Math.min(1, k)) * -800}px) rotateY(${ry}deg) rotateX(5deg)`, textAlign: "center", ...(plate ? card("22px 46px 26px") : {}), background: plate ? `radial-gradient(120% 120% at 50% 0%, ${VAL.card}, ${VAL.paperWarm})` : undefined }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: size, color: col, lineHeight: 1, textShadow: edge, whiteSpace: "nowrap" }}>{text}</div>
        {sub && <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: Math.max(26, size * 0.17), letterSpacing: 5, color: VAL.ink2, marginTop: 10, whiteSpace: "nowrap" }}>{sub}</div>}
      </div>
    </div>
  );
};

// frase clave palabra por palabra en una banda de papel (arriba o abajo)
export const Words: React.FC<{ t: number; items: { at: number; txt: string; col?: string }[]; out: number; y?: number; size?: number }> = ({ t, items, out, y = 900, size = 78 }) => {
  const o = vis(t, items[0].at - 0.1, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: "translateY(-50%)", opacity: o, perspective: 1200 }}>
      <div style={{ ...card("16px 40px 20px"), display: "flex", gap: 22, alignItems: "baseline", transform: `rotateX(${(1 - Math.min(1, k1(t, items[0].at - 0.1))) * 60}deg)` }}>
        {items.map((it, i) => { const kk = k1(t, it.at), oo = e(t, it.at, it.at + 0.1); return (
          <span key={i} style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: size, color: it.col ?? VAL.ink, opacity: oo, display: "inline-block", transform: `translateY(${(1 - Math.min(1, kk)) * 40}px) scale(${0.8 + 0.2 * kk})`, whiteSpace: "nowrap", letterSpacing: 0.5 }}>{it.txt}</span>); })}
      </div>
    </div>
  );
};

// fichas en fila (palabras que se suman)
export const Chips: React.FC<{ t: number; items: { at: number; tx: string; col?: string }[]; out: number; y?: number }> = ({ t, items, out, y = 900 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 24, perspective: 1200, transform: "translateY(-50%)" }}>
    {items.map((it, i) => { const kk = k1(t, it.at), o = vis(t, it.at, out + i * 0.05, 0.1, 0.25); return o <= 0.01 ? null : (
      <div key={i} style={{ ...card("14px 30px 16px"), opacity: o, transform: `translateY(${(1 - Math.min(1, kk)) * 90}px) rotateX(${(1 - Math.min(1, kk)) * 70}deg)`, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: it.col ?? VAL.ink, borderBottom: `6px solid ${it.col ?? VAL.gold}`, whiteSpace: "nowrap" }}>{it.tx}</div>); })}
  </div>
);

// lista con tildes de salvia que se dibujan
export const CheckList: React.FC<{ t: number; title: string; rows: { at: number; txt: string; x?: boolean }[]; out: number; x?: number; y?: number }> = ({ t, title, rows, out, x = 1290, y = 190 }) => {
  const o = vis(t, rows[0].at - 0.35, out); if (o <= 0.01) return null;
  const k = k1(t, rows[0].at - 0.35, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ ...card("24px 34px 26px"), width: 560, transform: `rotateY(${-14 + (1 - Math.min(1, k)) * -50}deg)`, transformOrigin: "100% 50%" }}>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: VAL.gold, borderBottom: `2px solid ${VAL.line}`, paddingBottom: 10, marginBottom: 8 }}>{title}</div>
        {rows.map((r, i) => { const a = e(t, r.at, r.at + 0.2), d = e(t, r.at + 0.1, r.at + 0.45); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", opacity: 0.25 + 0.75 * a }}>
            <svg width={44} height={44} viewBox="0 0 44 44"><rect x={3} y={3} width={38} height={38} rx={9} fill="none" stroke={VAL.line} strokeWidth={3} />
              {r.x ? <path d="M12 12 L32 32 M32 12 L12 32" stroke={VAL.terracotta} strokeWidth={6} strokeLinecap="round" strokeDasharray={60} strokeDashoffset={60 * (1 - d)} />
                : <path d="M10 23 L19 32 L35 12" fill="none" stroke={VAL.sage} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - d)} />}</svg>
            <span style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 40, color: VAL.ink }}>{r.txt}</span>
          </div>); })}
      </div>
    </div>
  );
};

// ERROR nº n: ficha terracota con X que se dibuja
export const Mistake: React.FC<{ t: number; at: number; n: number; txt: string; out: number; x?: number; y?: number }> = ({ t, at, n, txt, out, x = 960, y = 880 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9), d = e(t, at + 0.25, at + 0.55);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o }}>
      <div style={{ ...card("16px 36px 18px 20px"), display: "flex", alignItems: "center", gap: 22, transform: `rotateX(${(1 - Math.min(1, k)) * 70}deg) scale(${0.8 + 0.2 * k})`, borderLeft: `10px solid ${VAL.terracotta}` }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, background: VAL.terracotta, color: VAL.onAccent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 58, boxShadow: `0 8px 20px ${rgba(VAL.terracotta, 0.4)}` }}>{n}</div>
        <div>
          <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: VAL.terracotta }}>ERROR Nº {n}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 52, color: VAL.ink, whiteSpace: "nowrap", position: "relative" }}>{txt}
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }} viewBox="0 0 100 100" preserveAspectRatio="none"><line x1={0} y1={55} x2={100 * d} y2={55} stroke={VAL.terracotta} strokeWidth={5} vectorEffect="non-scaling-stroke" opacity={0.0} /></svg></div>
        </div>
      </div>
    </div>
  );
};

// los 3 errores repartidos como cartas (se apilan y se abren en abanico)
export const MistakesDeal: React.FC<{ t: number; at: number; out: number; items: string[] }> = ({ t, at, out, items }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, perspective: 1600 }}>
      {items.map((txt, i) => { const a = at + 0.3 + i * 0.35, kk = k1(t, a, 0.9), oo = e(t, a, a + 0.1), n = items.length, ang = (i - (n - 1) / 2) * 9;
        return <div key={i} style={{ position: "absolute", left: 960, top: 560, opacity: oo, transform: `translate(-50%,-50%) translateX(${(i - (n - 1) / 2) * 330 * Math.min(1, kk)}px) translateY(${(1 - Math.min(1, kk)) * 500 + Math.abs(i - (n - 1) / 2) * 30}px) rotate(${ang * Math.min(1, kk)}deg)` }}>
          <div style={{ ...card("30px 26px"), width: 300, height: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, borderTop: `12px solid ${VAL.terracotta}` }}>
            <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: VAL.terracotta }}>ERROR</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 150, color: VAL.ink, lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 30, color: VAL.ink2, textAlign: "center", opacity: e(t, a + 0.4, a + 0.7) }}>{txt}</div>
          </div>
        </div>; })}
    </div>
  );
};

// capítulo: lámina de papel con número romano/palabra y filete de oro que se dibuja
export const Chapter: React.FC<{ t: number; at: number; out: number; kicker: string; name: string; x?: number; y?: number; s?: number }> = ({ t, at, out, kicker, name, x = 960, y = 520, s = 1 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.8), ln = e(t, at + 0.2, at + 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, perspective: 1400, opacity: o }}>
      <div style={{ ...card("34px 70px 40px"), textAlign: "center", transform: `translateZ(${(1 - Math.min(1, k)) * -600}px) rotateX(${(1 - Math.min(1, k)) * 40}deg)` }}>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 28, letterSpacing: 9, color: VAL.gold }}>{kicker}</div>
        <div style={{ height: 3, width: 420 * ln, background: VAL.gold, margin: "14px auto 16px" }} />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 104, color: VAL.ink, whiteSpace: "nowrap", lineHeight: 1 }}>{name}</div>
      </div>
    </div>
  );
};

// dos columnas: lo que conviene vs lo que no
type Side = { label: string; val: string; mark?: "ok" | "x"; col?: string };
export const Versus: React.FC<{ t: number; at: number; out: number; L: Side; R: Side; title?: string; y?: number }> = ({ t, at, out, L, R, title, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const col = (s: Side, i: number) => { const a = at + 0.2 + i * 0.45, kk = k1(t, a, 0.9), c = s.col ?? (s.mark === "x" ? VAL.terracotta : s.mark === "ok" ? VAL.sage : VAL.ink);
    return <div style={{ ...card("26px 34px"), width: 520, textAlign: "center", opacity: e(t, a, a + 0.12), transform: `rotateY(${(i ? 1 : -1) * (12 + (1 - Math.min(1, kk)) * 50)}deg)`, borderTop: `10px solid ${c}` }}>
      <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: VAL.inkSoft }}>{s.label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 64, color: c, marginTop: 10, lineHeight: 1.05 }}>{s.val}</div>
      {s.mark && <div style={{ fontSize: 60, marginTop: 8, color: c, fontWeight: 900 }}>{s.mark === "ok" ? "✓" : "✗"}</div>}
    </div>; };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: o, perspective: 1400 }}>
      {title && <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 64, color: VAL.ink, textShadow: ink() }}>{title}</div>}
      <div style={{ display: "flex", gap: 70 }}>{col(L, 0)}{col(R, 1)}</div>
    </div>
  );
};

// reloj de arena / cronómetro circular de latón
export const Timer: React.FC<{ t: number; at: number; out: number; secs: number; label: string; x?: number; y?: number; show?: (s: number) => string }> = ({ t, at, out, secs, label, x = 1540, y = 300, show }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9), p = Math.max(0, Math.min(1, (t - at - 0.2) / secs)), R = 110, C = 2 * Math.PI * R, left = Math.max(0, secs - (t - at - 0.2));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, opacity: o }}>
      <div style={{ ...card("20px 24px 18px"), borderRadius: 44, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width={260} height={260}><circle cx={130} cy={130} r={R} fill={VAL.paper} stroke={VAL.line} strokeWidth={14} />
          <circle cx={130} cy={130} r={R} fill="none" stroke={VAL.gold} strokeWidth={14} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * p} transform="rotate(-90 130 130)" />
          <text x={130} y={150} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={64} fill={VAL.ink}>{show ? show(left) : `${Math.ceil(left)} s`}</text></svg>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: VAL.ink2, marginTop: 4, textAlign: "center", maxWidth: 280, lineHeight: 1.2 }}>{label}</div>
      </div>
    </div>
  );
};

// anotación a mano (Caveat) con subrayado que se dibuja
export const Note: React.FC<{ t: number; at: number; out: number; txt: string; x: number; y: number; rot?: number; size?: number; col?: string }> = ({ t, at, out, txt, x, y, rot = -4, size = 80, col = VAL.ink }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const n = Math.round(txt.length * e(t, at, at + Math.min(1.4, 0.05 * txt.length + 0.3)));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, opacity: o }}>
      <div style={{ ...card("8px 30px 14px"), background: "#FFF9EA", borderRadius: 6, boxShadow: `0 18px 40px ${rgba(VAL.ink, 0.25)}` }}>
        <div style={{ fontFamily: FONT_HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap" }}>{txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span></div>
        <svg width="100%" height={14} viewBox="0 0 100 14" preserveAspectRatio="none" style={{ display: "block" }}><path d="M2 8 Q 30 2 55 8 T 98 6" fill="none" stroke={VAL.gold} strokeWidth={3} vectorEffect="non-scaling-stroke" strokeDasharray={120} strokeDashoffset={120 * (1 - e(t, at + 0.5, at + 1.1))} /></svg>
      </div>
    </div>
  );
};

// sello de tinta (palabra golpeada)
export const Stamp: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; rot?: number; size?: number; col?: string }> = ({ t, at, out, text, x, y, rot = -7, size = 96, col = VAL.terracotta }) => {
  const o = vis(t, at, out, 0.06); if (o <= 0.01) return null;
  const k = e(t, at, at + 0.12), sc = 1.8 - 0.8 * k + 0.05 * Math.sin(Math.min(1, (t - at) / 0.3) * Math.PI);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, opacity: o }}>
      <div style={{ border: `7px solid ${col}`, borderRadius: 14, padding: "6px 26px", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: size, color: col, background: rgba(VAL.card, 0.88), letterSpacing: 2, whiteSpace: "nowrap", boxShadow: `0 16px 34px ${rgba(VAL.ink, 0.25)}` }}>{text}</div>
    </div>
  );
};

// rótulo de la doctora (nombre + especialidad que se tipea)
export const LowerThird: React.FC<{ t: number; at: number; out: number; name: string; l2: string; l2at: number }> = ({ t, at, out, name, l2, l2at }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.8), n2 = Math.round(l2.length * e(t, l2at, l2at + 1));
  return (
    <div style={{ position: "absolute", left: 110, bottom: 110, perspective: 1100, opacity: o }}>
      <div style={{ ...card("16px 34px 18px 26px"), borderLeft: `10px solid ${VAL.gold}`, transformOrigin: "0 50%", transform: `rotateY(${(1 - Math.min(1, k)) * 70 + 8}deg)` }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 58, color: VAL.ink }}>{name}</div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 26, color: VAL.gold, letterSpacing: 5, minHeight: 34 }}>{l2.slice(0, n2)}</div>
      </div>
    </div>
  );
};

// la descripción del video: renglón 1 se ilumina y la flecha a mano lo señala (SIN URL en pantalla)
export const Desc: React.FC<{ t: number; at: number; out: number; l2?: string; l2at?: number }> = ({ t, at, out, l2, l2at = 1e9 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.8), hl = e(t, at + 0.8, at + 1.3), sw = e(t, at + 0.8, at + 1.8), h2 = e(t, l2at, l2at + 0.4);
  const ln = (w: number) => <div style={{ height: 14, width: w, borderRadius: 7, background: rgba(VAL.ink, 0.1), marginTop: 16 }} />;
  return (
    <div style={{ position: "absolute", left: 960, top: 650, perspective: 1500, opacity: o }}>
      <div style={{ ...card("28px 44px 34px"), width: 1220, transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${12 - 8 * Math.min(1, k)}deg) rotateY(${-6 + 3 * Math.sin(t * 0.8)}deg)` }}>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: VAL.inkSoft }}>DESCRIPCIÓN DEL VIDEO</div>
        <div style={{ position: "relative", marginTop: 14, padding: "14px 20px", borderRadius: 12, overflow: "hidden", background: rgba(VAL.gold, 0.16 * hl), boxShadow: hl > 0.05 ? `0 0 0 3px ${rgba(VAL.gold, 0.9 * hl)}` : undefined }}>
          <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 40, color: VAL.ink }}>📖 El Recetario de la Doctora: mis 67 recetas caseras para la piel madura</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sw}%`, width: "22%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)", opacity: sw < 1 ? 1 : 0 }} />
        </div>
        {l2 && <div style={{ marginTop: 12, padding: "10px 20px", borderRadius: 10, fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 34, color: VAL.ink2, background: rgba(VAL.sage, 0.14 * h2), boxShadow: h2 > 0.05 ? `0 0 0 3px ${rgba(VAL.sage, 0.8 * h2)}` : undefined }}>{l2}</div>}
        {ln(960)}{ln(720)}
      </div>
      <div style={{ position: "absolute", left: -930, top: -150, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 8 * Math.sin(t * 6)}px) rotate(-4deg)`, fontFamily: FONT_HAND, fontWeight: 700, fontSize: 74, color: VAL.terracotta, whiteSpace: "nowrap" }}>1ª línea ➜</div>
    </div>
  );
};

// la RECETA (tarjeta de fichero): renglones que se escriben al decirse
export const Recipe: React.FC<{ t: number; at: number; out: number; rows: { at: number; txt: string }[]; x?: number; y?: number }> = ({ t, at, out, rows, x = 1330, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1300, opacity: o }}>
      <div style={{ ...card("26px 36px 30px"), width: 640, background: `repeating-linear-gradient(180deg, ${VAL.card} 0 58px, ${rgba(VAL.line, 0.5)} 58px 60px)`, transform: `rotateY(${-10 + (1 - Math.min(1, k)) * -60}deg) rotate(1.5deg)`, borderTop: `12px solid ${VAL.gold}` }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 50, color: VAL.ink, marginBottom: 6 }}>Crema + sábila</div>
        {rows.map((r, i) => { const n = Math.round(r.txt.length * e(t, r.at, r.at + 0.9)); return n <= 0 ? <div key={i} style={{ height: 60 }} /> :
          <div key={i} style={{ fontFamily: FONT_HAND, fontWeight: 700, fontSize: 50, color: VAL.ink, lineHeight: "60px", whiteSpace: "nowrap" }}>{r.txt.slice(0, n)}</div>; })}
      </div>
    </div>
  );
};

// tarjeta "próximo video"
export const NextCard: React.FC<{ t: number; at: number; out: number; title: string; sub: string }> = ({ t, at, out, title, sub }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.8);
  return (
    <div style={{ position: "absolute", left: 1400, top: 300, transform: "translate(-50%,-50%)", perspective: 1300, opacity: o }}>
      <div style={{ ...card("26px 40px 30px"), width: 700, transform: `rotateY(${-12 + (1 - Math.min(1, k)) * -60}deg)`, borderLeft: `10px solid ${VAL.sage}` }}>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: VAL.sage }}>PRÓXIMO VIDEO</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 64, color: VAL.ink, marginTop: 8, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 36, color: VAL.ink2, marginTop: 8, opacity: e(t, at + 0.6, at + 1) }}>{sub}</div>
      </div>
    </div>
  );
};

// flechas a mano que indican el sentido (toquecitos hacia arriba)
export const Arrows: React.FC<{ t: number; at: number; out: number; x: number; y: number; up?: boolean; label?: string; col?: string }> = ({ t, at, out, x, y, up = true, label, col = VAL.sage }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const d = e(t, at, at + 0.6), bob = Math.sin((t - at) * 5) * 8;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, transform: "translate(-50%,-50%)", opacity: o, textAlign: "center" }}>
      <svg width={220} height={260} viewBox="0 0 220 260" style={{ transform: up ? undefined : "scaleY(-1)", filter: `drop-shadow(0 6px 10px ${rgba(VAL.ink, 0.3)})` }}>
        {[50, 110, 170].map((cx, i) => <path key={i} d={`M${cx} 240 C ${cx - 10} 170, ${cx + 10} 110, ${cx} 40 M${cx - 26} 70 L${cx} 36 L${cx + 26} 70`} fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={260} strokeDashoffset={260 * (1 - e(t, at + i * 0.12, at + i * 0.12 + 0.5))} />)}
      </svg>
      {label && <div style={{ fontFamily: FONT_HAND, fontWeight: 700, fontSize: 56, color: col, opacity: d, textShadow: ink() }}>{label}</div>}
    </div>
  );
};

// pregunta numerada ("¿DE DÍA?")
export const QCard: React.FC<{ t: number; at: number; out: number; n: number; q: string; x?: number; y?: number }> = ({ t, at, out, n, q, x = 960, y = 190 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, opacity: o }}>
      <div style={{ ...card("14px 36px 16px 16px"), display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 78, height: 78, borderRadius: 39, background: VAL.gold, color: VAL.onAccent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 48 }}>{n}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 70, color: VAL.ink, whiteSpace: "nowrap" }}>{q}</div>
      </div>
    </div>
  );
};

// lista numerada de lugares (1 CARA · 2 CUELLO …) que se arma a la izquierda
export const NumList: React.FC<{ t: number; out: number; rows: { at: number; txt: string }[]; x?: number; y?: number }> = ({ t, out, rows, x = 120, y = 200 }) => {
  const o = vis(t, rows[0].at - 0.2, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", flexDirection: "column", gap: 16 }}>
      {rows.map((r, i) => { const kk = k1(t, r.at, 0.9), oo = e(t, r.at, r.at + 0.12); return (
        <div key={i} style={{ ...card("10px 30px 12px 12px"), display: "flex", alignItems: "center", gap: 18, opacity: oo, transform: `translateX(${(1 - Math.min(1, kk)) * -260}px)` }}>
          <div style={{ width: 62, height: 62, borderRadius: 31, background: VAL.gold, color: VAL.onAccent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 38 }}>{i + 1}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 48, color: VAL.ink, whiteSpace: "nowrap" }}>{r.txt}</div>
        </div>); })}
    </div>
  );
};
export { ei };
