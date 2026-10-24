// ojos · PIEZAS 2.5D con el look de la noche de Reiko: papel WASHI con fibras, tinta SUMI, ÍNDIGO, el ÁMBAR del aceite y el sello
// HANKO rojo. Todas reciben t (segundo) y a/b (entrada/salida) ya resueltos desde el EDL de cada idioma. Nada que ver con cuello/manos.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, HAND, SERIF, e, spr } from "./lib";

export const J = { washi: "#f3ead7", washi2: "#e9dcc0", sumi: "#1d1a17", indigo: "#27466e", indigo2: "#5b7fb0", amber: "#f0a83a", amber2: "#ffd38a", hanko: "#c0392b", cream: "#fbf5ea", jade: "#3f7d64" };
const fade = (t: number, a: number, b: number, fi = 0.18, fo = 0.25) => e(t, a, a + fi) * (1 - e(t, b - fo, b));
const fibras = `repeating-linear-gradient(83deg, rgba(150,120,80,.06) 0 2px, transparent 2px 9px), repeating-linear-gradient(-7deg, rgba(150,120,80,.05) 0 1px, transparent 1px 13px)`;
export const washi = (bg = J.washi): React.CSSProperties => ({ background: `${fibras}, ${bg}`, boxShadow: "0 18px 50px rgba(0,0,0,.45), inset 0 0 40px rgba(150,110,60,.18)" });
const sombra = "0 3px 18px rgba(0,0,0,.75), 0 1px 3px rgba(0,0,0,.9)";

type T = { t: number; a: number; b: number };

// sello hanko: cuadrado rojo con borde gastado y el texto adentro
export const Hanko: React.FC<{ txt: string; size?: number; col?: string; rot?: number; k?: number }> = ({ txt, size = 120, col = J.hanko, rot = -6, k = 1 }) => (
  <div style={{ width: size, height: size, border: `${size * 0.07}px solid ${col}`, borderRadius: size * 0.12, color: col, display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: SERIF, fontWeight: 900, fontSize: size * (txt.length > 2 ? 0.3 : 0.56), transform: `rotate(${rot}deg) scale(${k})`, opacity: 0.92, lineHeight: 1,
    maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.75) 70%, #000 80%)", WebkitMaskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.75) 70%, #000 80%)" }}>{txt}</div>
);

// REGLA N: tarjeta de washi que cae al centro, el número en un hanko, el título a pincel; atrás todo se desenfoca y oscurece
export const RuleCard: React.FC<T & { n: number; title: string; lang: string }> = ({ t, a, b, n, title, lang }) => {
  const o = fade(t, a, b, 0.25, 0.35); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, a, 0.9)), stampK = spr(t, a + 0.45, 1.3);
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ backdropFilter: `blur(${10 * o}px) brightness(${1 - 0.35 * o})`, WebkitBackdropFilter: `blur(${10 * o}px) brightness(${1 - 0.35 * o})` }} />
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${(1 - k) * 25}deg) translateY(${(1 - k) * 60}px) rotate(-1.5deg)` }}>
      <div style={{ ...washi(), width: 1180, padding: "56px 70px 60px", display: "flex", alignItems: "center", gap: 54 }}>
        <div style={{ transform: `scale(${stampK})` }}><Hanko txt={String(n)} size={190} /></div>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, letterSpacing: 10, fontSize: 34, color: J.indigo }}>{lang === "es" ? `REGLA ${n} DE 7` : `RULE ${n} OF 7`}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: title.length > 30 ? 66 : 78, lineHeight: 1.08, color: J.sumi, marginTop: 10 }}>{title}</div>
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};

// nota escrita a mano en una tira de washi (arriba o abajo)
export const Note: React.FC<T & { txt: string; pos?: string }> = ({ t, a, b, txt, pos = "bottom" }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, a, 1.1)), n = Math.max(0, Math.min(txt.length, Math.floor((t - a) * 34)));
  return <div style={{ position: "absolute", left: 960, top: pos === "top" ? 150 : 900, opacity: o, transform: `translate(-50%,-50%) rotate(-1.2deg) scaleX(${0.6 + 0.4 * k})` }}>
    <div style={{ ...washi("rgba(243,234,215,.94)"), padding: "16px 46px 20px", fontFamily: HAND, fontWeight: 700, fontSize: 62, color: J.sumi, whiteSpace: "nowrap" }}>
      {txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span></div>
  </div>;
};

// sello grande golpeado sobre la imagen (col: red | ink)
export const Stamp: React.FC<T & { txt: string; col?: string }> = ({ t, a, b, txt, col = "red" }) => {
  const o = fade(t, a, b, 0.06, 0.3); if (o <= 0.01) return null;
  const k = t < a + 0.12 ? 1.6 - 0.6 * e(t, a, a + 0.12) : 1 + 0.03 * Math.exp(-(t - a - 0.12) * 8) * Math.sin((t - a) * 50);
  const c = col === "red" ? J.hanko : J.indigo;
  return <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: `translate(-50%,-50%) rotate(-5deg) scale(${k})` }}>
    <div style={{ border: `9px solid ${c}`, borderRadius: 16, padding: "14px 40px", color: c, fontFamily: SERIF, fontWeight: 900, fontSize: txt.length > 22 ? 64 : 84, letterSpacing: 3, whiteSpace: "nowrap",
      background: "rgba(251,245,234,.82)", boxShadow: "0 14px 40px rgba(0,0,0,.4)" }}>{txt}</div>
  </div>;
};

// texto grande con canto (extrusión) en crema, con subtítulo
export const Big: React.FC<T & { txt: string; sub?: string; soft?: number }> = ({ t, a, b, txt, sub, soft }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, a));
  const ext = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 0.5}px ${(i + 1) * 0.9}px 0 #6b4a22`).join(", ") + ", 8px 24px 40px rgba(0,0,0,.65)";
  return <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: txt.length > 18 ? 118 : 150, color: soft ? J.amber2 : J.cream, textShadow: ext, whiteSpace: "nowrap", letterSpacing: 2 }}>{txt}</div>
    {sub && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: J.amber2, textShadow: sombra, marginTop: 6, opacity: e(t, a + 0.35, a + 0.6) }}>{sub}</div>}
  </div>;
};

// anillo que se dibuja (24 h, 30 s, 3 respiraciones…) con el número al centro; spin = la aguja recorre el anillo
export const Ring: React.FC<T & { big: string; sub: string; x: number; y: number; spin?: number }> = ({ t, a, b, big, sub, x, y, spin }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const R = 120, C = 2 * Math.PI * R, k = Math.min(1, spr(t, a)), d = e(t, a + 0.1, a + (spin ? Math.min(3.5, b - a - 0.4) : 0.9));
  const ang = -90 + 360 * d;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})` }}>
    <svg width={320} height={320} style={{ overflow: "visible" }}>
      <circle cx={160} cy={160} r={R + 34} fill="rgba(29,26,23,.62)" />
      <circle cx={160} cy={160} r={R} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={14} />
      <circle cx={160} cy={160} r={R} fill="none" stroke={J.amber} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${C * d} ${C}`} transform="rotate(-90 160 160)" style={{ filter: `drop-shadow(0 0 10px ${J.amber})` }} />
      {spin ? <circle cx={160 + R * Math.cos((ang * Math.PI) / 180)} cy={160 + R * Math.sin((ang * Math.PI) / 180)} r={13} fill={J.amber2} style={{ filter: `drop-shadow(0 0 12px ${J.amber2})` }} /> : null}
    </svg>
    <div style={{ position: "absolute", left: 160, top: 150, transform: "translate(-50%,-50%)", fontFamily: SERIF, fontWeight: 900, fontSize: big.length > 4 ? 64 : 92, color: J.cream, textShadow: sombra, whiteSpace: "nowrap" }}>{big}</div>
    <div style={{ position: "absolute", left: 160, top: 360, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: J.cream, textShadow: sombra, whiteSpace: "nowrap" }}>{sub}</div>
  </div>;
};

// fichas de washi que saltan en fila
export const Chips: React.FC<T & { items: string[]; y?: number }> = ({ t, a, b, items, y = 860 }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 26, opacity: o }}>
    {items.map((it, i) => { const k = Math.min(1.1, spr(t, a + i * 0.28)); return <div key={i} style={{ ...washi(), transform: `scale(${k}) rotate(${(i % 2 ? 1.5 : -1.5)}deg)`, padding: "12px 34px", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: J.sumi, letterSpacing: 1.5, borderBottom: `6px solid ${J.amber}` }}>{it}</div>; })}
  </div>;
};

const split2 = (s: string) => { const [h, ...r] = s.split(" · "); return [h, r.join(" · ")]; };
// par comparado (A | B): dos tarjetas, la segunda llega después
export const Pair: React.FC<T & { a1: string; b1: string }> = ({ t, a, b, a1, b1 }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const card = (s: string, i: number, col: string) => { const [h, sub] = split2(s), k = Math.min(1.08, spr(t, a + i * 0.55)); return (
    <div style={{ ...washi(), width: 600, padding: "26px 36px", transform: `scale(${k}) rotate(${i ? 1.4 : -1.4}deg)`, opacity: k > 0.02 ? 1 : 0, borderTop: `10px solid ${col}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 2, color: col }}>{h}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: J.sumi, lineHeight: 1.05 }}>{sub}</div>
    </div>); };
  return <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", gap: 60, opacity: o, alignItems: "flex-start" }}>
    {card(a1, 0, J.indigo)}<div style={{ alignSelf: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: J.cream, textShadow: sombra, opacity: e(t, a + 0.4, a + 0.6) }}>vs</div>{card(b1, 1, J.amber === "" ? J.amber : "#b0701a")}
  </div>;
};

// no / sí
export const NoSi: React.FC<T & { no: string; si: string }> = ({ t, a, b, no, si }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const k1 = Math.min(1.08, spr(t, a)), k2 = Math.min(1.08, spr(t, a + 0.7)), x = e(t, a + 0.3, a + 0.55);
  const row = (mark: string, txt: string, col: string, k: number, cross: number) => (
    <div style={{ ...washi(), display: "flex", alignItems: "center", gap: 24, padding: "18px 40px 18px 22px", transform: `scale(${k})`, opacity: k > 0.02 ? 1 : 0 }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: col, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>{mark}</div>
      <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: J.sumi, whiteSpace: "nowrap" }}>{txt}
        {cross > 0 && <div style={{ position: "absolute", left: -6, top: "54%", height: 7, width: `calc(${cross * 100}% + 12px)`, background: J.hanko, borderRadius: 4, transform: "rotate(-2deg)" }} />}</div>
    </div>);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: o }}>
    {row("✕", no, J.hanko, k1, x)}{row("✓", si, J.jade, k2, 0)}
  </div>;
};

// mito tachado → lo verdadero
export const Myth: React.FC<T & { myth: string; truth: string; lang: string }> = ({ t, a, b, myth, truth, lang }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, a)), x = e(t, a + 0.9, a + 1.3), k2 = spr(t, a + 1.4);
  return <div style={{ position: "absolute", left: 960, top: 300, transform: `translate(-50%,-50%) scale(${k}) rotate(-1deg)`, opacity: o }}>
    <div style={{ ...washi(), padding: "26px 50px", textAlign: "center", minWidth: 900 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, letterSpacing: 6, fontSize: 30, color: J.hanko }}>{lang === "es" ? "LO QUE DICE INTERNET" : "WHAT THE INTERNET SAYS"}</div>
      <div style={{ position: "relative", display: "inline-block", fontFamily: SERIF, fontWeight: 800, fontSize: 62, color: J.sumi, marginTop: 6 }}>{myth}
        <div style={{ position: "absolute", left: -10, top: "52%", height: 9, width: `calc(${x * 100}% + 20px)`, background: J.hanko, borderRadius: 5, transform: "rotate(-3deg)" }} /></div>
      {k2 > 0.02 && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: J.indigo, transform: `scale(${Math.min(1, k2)})` }}>→ {truth}</div>}
    </div>
  </div>;
};

// lista en washi: cada ítem se tilda (o se tacha si cross) cuando se dice
export const Check: React.FC<T & { title: string; items: { txt: string; at: number }[]; cross?: number; x?: number; y?: number }> = ({ t, a, b, title, items, cross, x = 1460, y = 560 }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, a));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${-8 * k}deg) scale(${0.9 + 0.1 * k})`, opacity: o }}>
    <div style={{ ...washi(), width: 700, padding: "30px 40px 34px" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 4, color: cross ? J.hanko : J.indigo, borderBottom: `3px solid ${J.washi2}`, paddingBottom: 10, marginBottom: 12 }}>{title}</div>
      {items.map((it, i) => { const on = e(t, it.at, it.at + 0.25), mk = Math.min(1.2, spr(t, it.at, 1.3)); return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, margin: "10px 0", opacity: 0.35 + 0.65 * on }}>
          <div style={{ width: 52, height: 52, flex: "none", border: `4px solid ${cross ? J.hanko : J.indigo}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: cross ? J.hanko : J.jade }}>
            <span style={{ transform: `scale(${mk})` }}>{t >= it.at ? (cross ? "✕" : "✓") : ""}</span></div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 42, color: J.sumi, lineHeight: 1.1 }}>{it.txt}</div>
        </div>); })}
    </div>
  </div>;
};

// pasos numerados en fila (aparecen al decirse)
export const Steps: React.FC<T & { items: { txt: string; at: number }[] }> = ({ t, a, b, items }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", gap: 30, opacity: o }}>
    {items.map((it, i) => { const k = Math.min(1.08, spr(t, it.at)); return (
      <div key={i} style={{ ...washi(), display: "flex", alignItems: "center", gap: 16, padding: "14px 30px 14px 16px", transform: `scale(${k})`, opacity: k > 0.02 ? 1 : 0 }}>
        <Hanko txt={String(i + 1)} size={58} rot={-4} /><div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: J.sumi, whiteSpace: "nowrap" }}>{it.txt}</div></div>); })}
  </div>;
};

// el repaso entero: un rollo de washi a la derecha; cada paso se escribe y se tilda cuando se dice, el actual resaltado en ámbar
export const Recap: React.FC<T & { items: { txt: string; at: number }[]; lang: string }> = ({ t, a, b, items, lang }) => {
  const o = fade(t, a, b, 0.3, 0.4); if (o <= 0.01) return null;
  const cur = items.reduce((m, it, i) => (t >= it.at ? i : m), -1);
  const k = Math.min(1, spr(t, a, 0.8));
  return <div style={{ position: "absolute", right: 60, top: 70, opacity: o, transform: `translateX(${(1 - k) * 260}px)` }}>
    <div style={{ ...washi("rgba(243,234,215,.95)"), width: 520, padding: "24px 30px 26px" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 5, color: J.indigo, marginBottom: 8 }}>{lang === "es" ? "MI RUTINA DE NOCHE" : "MY NIGHT ROUTINE"}</div>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, margin: "3px 0", padding: "2px 8px", borderRadius: 8, background: i === cur ? "rgba(240,168,58,.35)" : "transparent", opacity: i <= cur ? 1 : 0.28 }}>
          <div style={{ width: 34, fontFamily: SERIF, fontWeight: 900, fontSize: 28, color: J.hanko, textAlign: "right" }}>{i + 1}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: J.sumi, lineHeight: 1.0 }}>{it.txt}</div>
          {i < cur && <div style={{ marginLeft: "auto", color: J.jade, fontFamily: FONT, fontWeight: 900, fontSize: 30 }}>✓</div>}
        </div>))}
    </div>
  </div>;
};

// el mantra: tres líneas que se apilan
export const Mantra: React.FC<T & { lines: string[] }> = ({ t, a, b, lines }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", textAlign: "center", opacity: o }}>
    {lines.map((l, i) => { const k = Math.min(1.06, spr(t, a + i * 0.7)); return <div key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, lineHeight: 1.12, color: i === 2 ? J.amber2 : J.cream, transform: `scale(${k})`, opacity: k > 0.02 ? 1 : 0,
      textShadow: Array.from({ length: 8 }, (_, j) => `${(j + 1) * 0.5}px ${(j + 1) * 0.9}px 0 #6b4a22`).join(", ") + ", 6px 20px 36px rgba(0,0,0,.7)" }}>{l}</div>; })}
  </div>;
};

// zócalo con nombre
export const Lower: React.FC<T & { name: string; l2: string }> = ({ t, a, b, name, l2 }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const w = e(t, a, a + 0.5);
  return <div style={{ position: "absolute", left: 110, top: 820, opacity: o }}>
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <div style={{ width: 14, background: J.hanko, transform: `scaleY(${w})` }} />
      <div style={{ ...washi("rgba(243,234,215,.95)"), padding: "14px 34px 16px", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: J.sumi, whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 2, color: J.indigo, whiteSpace: "nowrap" }}>{l2}</div>
      </div>
    </div>
  </div>;
};

// ERROR N: franja índigo con el número en hanko
export const Err: React.FC<T & { n: number; txt: string; lang: string }> = ({ t, a, b, n, txt, lang }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const w = e(t, a, a + 0.45);
  return <div style={{ position: "absolute", left: 0, top: 120, opacity: o, transform: `translateX(${(w - 1) * 900}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 26, background: "rgba(29,26,23,.86)", padding: "18px 60px 18px 110px", borderBottom: `6px solid ${J.hanko}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 6, color: J.hanko }}>{lang === "es" ? "ERROR" : "MISTAKE"}</div>
      <Hanko txt={String(n)} size={70} col={J.hanko} k={spr(t, a + 0.3)} />
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 56, color: J.cream, whiteSpace: "nowrap" }}>{txt}</div>
    </div>
  </div>;
};

// cita a mano (la señora de Kobe)
export const Quote: React.FC<T & { txt: string }> = ({ t, a, b, txt }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const n = Math.floor(Math.max(0, t - a) * 26);
  return <div style={{ position: "absolute", left: 960, top: 830, transform: "translate(-50%,-50%) rotate(-1deg)", opacity: o }}>
    <div style={{ ...washi("rgba(243,234,215,.95)"), maxWidth: 1400, padding: "22px 50px 26px", fontFamily: HAND, fontWeight: 700, fontSize: 60, lineHeight: 1.1, color: J.sumi, textAlign: "center" }}>
      {txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span></div>
  </div>;
};

// la pregunta para comentar con las tres opciones
export const Ask: React.FC<T & { q: string; items: string[]; lang: string }> = ({ t, a, b, q, items, lang }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, a));
  return <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${k})`, opacity: o, textAlign: "center" }}>
    <div style={{ ...washi(), padding: "34px 60px 40px" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: J.indigo }}>{lang === "es" ? "DÍMELO EN LOS COMENTARIOS" : "TELL ME IN THE COMMENTS"}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: J.sumi, margin: "8px 0 24px" }}>{q}</div>
      <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>
        {items.map((it, i) => { const kk = Math.min(1.1, spr(t, a + 0.5 + i * 0.35)); return <div key={i} style={{ transform: `scale(${kk})`, padding: "14px 40px", borderRadius: 50, background: J.indigo, color: J.cream, fontFamily: FONT, fontWeight: 900, fontSize: 46, boxShadow: "0 10px 26px rgba(0,0,0,.35)" }}>{it}</div>; })}
      </div>
    </div>
  </div>;
};

// suscribirse + campana (en el idioma del video)
export const Sub: React.FC<T & { bell: string; lang: string; press: number; ring: number }> = ({ t, a, b, lang, press, ring }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, a)), pr = t > press ? 1 : 0, kp = t > press ? 1 - 0.1 * Math.exp(-(t - press) * 9) * Math.cos((t - press) * 30) : 1;
  const sw = t > ring ? 14 * Math.exp(-(t - ring) * 2.2) * Math.sin((t - ring) * 22) : 0;
  return <div style={{ position: "absolute", left: 960, top: 860, transform: `translate(-50%,-50%) scale(${k})`, opacity: o, display: "flex", alignItems: "center", gap: 30 }}>
    <div style={{ transform: `scale(${kp})`, padding: "22px 54px", borderRadius: 14, background: pr ? "#5a5a5a" : "#cc0000", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 50, letterSpacing: 2, boxShadow: "0 12px 30px rgba(0,0,0,.45)" }}>
      {pr ? (lang === "es" ? "SUSCRITA ✓" : "SUBSCRIBED ✓") : (lang === "es" ? "SUSCRIBIRSE" : "SUBSCRIBE")}</div>
    <svg width={110} height={110} viewBox="0 0 24 24" style={{ transform: `rotate(${sw}deg)`, transformOrigin: "50% 10%", filter: "drop-shadow(0 6px 14px rgba(0,0,0,.5))" }}>
      <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2z" fill={t > ring ? J.amber2 : J.cream} />
    </svg>
  </div>;
};

// rótulo con línea guía hasta un punto de pantalla
export const Tag: React.FC<T & { txt: string; x: number; y: number; dx?: number; dy?: number }> = ({ t, a, b, txt, x, y, dx = 140, dy = -110 }) => {
  const o = fade(t, a, b); if (o <= 0.01) return null;
  const L = e(t, a, a + 0.3), k = Math.min(1.15, spr(t, a)), ex = x + dx * L, ey = y + dy * L;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={J.amber2} strokeWidth={3} strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }} />
      <circle cx={x} cy={y} r={9 * k} fill={J.amber2} style={{ filter: `drop-shadow(0 0 12px ${J.amber})` }} />
    </svg>
    <div style={{ position: "absolute", left: ex, top: ey, transform: `translate(${dx < 0 ? "-100%" : "0"}, -50%) scale(${k})`, transformOrigin: dx < 0 ? "100% 50%" : "0 50%" }}>
      <div style={{ ...washi(), padding: "10px 26px", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 1.5, color: J.sumi, whiteSpace: "nowrap", borderLeft: `8px solid ${J.amber}` }}>{txt}</div>
    </div>
  </div>;
};
