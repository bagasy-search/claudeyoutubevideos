// comps2.tsx — gráficos del minuto 2 de oldtech01v2 (Orata, Plinio, balineae pensiles, el negocio, el nombre griego). Todo por código.
import React from "react";
import { SANS, ROMAN, MONO, EMBER, EMBER2, W, H, k01, lerp, ease, easeOut, interp, rnd, shadow } from "./lib";

const fade = (t: number, a: number, b: number, i = 0.35, o = 0.3) => interp(t, [a, a + i, b - o, b], [0, 1, 1, 0]);

// ---------- nombre tallado en mármol: las letras se "cincelan" de izquierda a derecha con un brillo que pasa ----------
const marble = "radial-gradient(ellipse at 30% 20%, #f4efe6 0%, #e2dacb 45%, #cfc4b1 100%)";
export const Carved: React.FC<{ t: number; a: number; b: number; text: string; sub?: string; y?: number }> = ({ t, a, b, text, sub, y = 430 }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), rev = ease(k01(t, a + 0.15, a + 1.0)), sw = k01(t, a + 0.6, a + 1.5);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ position: "relative", padding: "38px 70px 30px", background: marble, borderRadius: 6, boxShadow: "0 30px 80px rgba(0,0,0,.55), inset 0 0 40px rgba(120,100,70,.25)",
        transform: `perspective(1400px) rotateX(${lerp(14, 4, easeOut(k01(t, a, a + 0.8)))}deg) scale(${lerp(0.94, 1, easeOut(k01(t, a, a + 0.8)))})` }}>
        <div style={{ position: "relative", fontFamily: ROMAN, fontWeight: 800, fontSize: 92, letterSpacing: 16, color: "#7a6a55",
          textShadow: "0 2px 0 rgba(255,255,255,.7), 0 -2px 0 rgba(60,45,30,.55)", clipPath: `inset(0 ${(1 - rev) * 100}% 0 0)`, whiteSpace: "nowrap" }}>{text}</div>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${sw * 130 - 30}%, rgba(255,255,255,.55) ${sw * 130 - 15}%, transparent ${sw * 130}%)`, mixBlendMode: "screen", borderRadius: 6 }} />
        {sub && <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: "#5b4c3a", marginTop: 10, opacity: k01(t, a + 0.9, a + 1.3) }}>{sub}</div>}
      </div>
    </div>
  );
};

// ---------- ficha de fuente: Plinio el Viejo, con la frase en latín subrayándose ----------
export const SourceCard: React.FC<{ t: number; a: number; b: number; author: string; work: string; latin: string; hi: [number, number]; en: string; x?: number; y?: number }> =
  ({ t, a, b, author, work, latin, hi, en, x = 150, y = 300 }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), k = easeOut(k01(t, a, a + 0.6)), ul = ease(k01(t, a + 1.0, a + 1.7));
  const n = Math.round(latin.length * k01(t, a + 0.3, a + 1.2));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 900, opacity: o, transform: `translateX(${(1 - k) * -60}px)` }}>
      <div style={{ background: "rgba(14,12,10,.78)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,196,107,.35)", borderRadius: 10, padding: "34px 44px", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: EMBER2 }}>SOURCE</div>
        <div style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 54, letterSpacing: 6, color: "#fff", marginTop: 6 }}>{author}</div>
        <div style={{ fontFamily: SANS, fontSize: 28, color: "rgba(255,255,255,.75)", marginTop: 2 }}>{work}</div>
        <div style={{ position: "relative", fontFamily: ROMAN, fontWeight: 600, fontSize: 40, lineHeight: 1.35, color: "#efe6d6", marginTop: 26, fontStyle: "italic" }}>
          “{latin.slice(0, Math.min(n, hi[0]))}<span style={{ position: "relative", color: n > hi[0] ? EMBER2 : undefined }}>{latin.slice(hi[0], Math.max(hi[0], Math.min(n, hi[1])))}
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 4, width: `${ul * 100}%`, background: EMBER, boxShadow: `0 0 12px ${EMBER}` }} /></span>{latin.slice(hi[1], Math.max(hi[1], n))}”
        </div>
        <div style={{ fontFamily: SANS, fontSize: 28, color: "rgba(255,255,255,.85)", marginTop: 16, opacity: k01(t, a + 1.4, a + 1.8) }}>{en}</div>
      </div>
    </div>
  );
};

// ---------- término latino: cada palabra baja su traducción ----------
export const Term: React.FC<{ t: number; a: number; b: number; words: { la: string; en: string; at: number }[]; y?: number }> = ({ t, a, b, words, y = 420 }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 70, opacity: o }}>
      {words.map((w, i) => {
        const k = easeOut(k01(t, a + i * 0.25, a + i * 0.25 + 0.6)), tr = easeOut(k01(t, w.at, w.at + 0.5));
        return <div key={i} style={{ textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
          <div style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 150, letterSpacing: 14, color: "#fff", textShadow: `0 0 40px rgba(0,0,0,.6), ${shadow}` }}>{w.la}</div>
          <div style={{ height: 4, margin: "6px auto 0", width: `${tr * 100}%`, background: EMBER, boxShadow: `0 0 14px ${EMBER}` }} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: 12, color: EMBER2, marginTop: 18, opacity: tr, transform: `translateY(${(1 - tr) * -24}px)`, textShadow: shadow }}>{w.en}</div>
        </div>;
      })}
    </div>
  );
};

// ---------- etimología: ὑπό + καίω → HYPOCAUST ----------
export const Etym: React.FC<{ t: number; a: number; b: number; join: number }> = ({ t, a, b, join }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), j = ease(k01(t, join, join + 0.6)), res = easeOut(k01(t, join + 0.35, join + 0.9));
  const part = (gr: string, en: string, side: number, at: number) => {
    const k = easeOut(k01(t, at, at + 0.5));
    return <div style={{ position: "absolute", top: 300, left: W / 2 + side * lerp(330, 120, j), transform: `translateX(-50%) scale(${lerp(1, 0.7, j)})`, textAlign: "center", opacity: k * (1 - j * 0.85) }}>
      <div style={{ fontFamily: ROMAN, fontWeight: 600, fontSize: 130, color: "#fff", textShadow: shadow }}>{gr}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: EMBER2, marginTop: 4, textShadow: shadow }}>{en}</div>
    </div>;
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {part("ὑπό", "UNDER", -1, a)}
      <div style={{ position: "absolute", top: 340, left: W / 2, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 400, fontSize: 90, color: "rgba(255,255,255,.7)", opacity: k01(t, a + 0.3, a + 0.6) * (1 - j) }}>+</div>
      {part("καίω", "TO BURN", 1, a + 0.4)}
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", opacity: res, transform: `scale(${lerp(1.15, 1, res)})` }}>
        <div style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 190, letterSpacing: lerp(60, 22, res), color: EMBER2, textShadow: `0 0 50px rgba(255,138,43,.5), ${shadow}`, paddingLeft: 22 }}>HYPOCAUST</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 14, color: "#fff", marginTop: 4, textShadow: shadow }}>HEAT FROM BELOW</div>
      </div>
    </div>
  );
};

// ---------- el negocio de Orata: comprar villa → poner baños colgantes → vender con ganancia ----------
const Ico: React.FC<{ k: string; c: string }> = ({ k, c }) => (
  <svg width={150} height={150} viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
    {k === "villa" && <><path d="M12 48 L50 20 L88 48" /><path d="M20 44 V82 H80 V44" /><path d="M42 82 V60 H58 V82" /><path d="M28 54 h8 M64 54 h8" /></>}
    {k === "bath" && <><path d="M14 46 H86" /><path d="M14 54 H86" />{[22, 36, 50, 64, 78].map((x) => <path key={x} d={`M${x} 54 V76`} />)}<path d="M10 80 H90" /><path d="M30 38 c4-8 -4-10 0-18 M50 38 c4-8 -4-10 0-18 M70 38 c4-8 -4-10 0-18" /></>}
    {k === "coin" && <><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="22" strokeWidth={2} /><path d="M50 36 V64 M42 42 h16 M42 58 h16" strokeWidth={3} /></>}
  </svg>
);
export const DevFlow: React.FC<{ t: number; a: number; b: number; steps: { at: number; ico: string; label: string; val?: string }[] }> = ({ t, a, b, steps }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), gap = 520, x0 = W / 2 - gap;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {steps.slice(1).map((s, i) => { const p = ease(k01(t, s.at - 0.35, s.at)); const xa = x0 + i * gap + 110, xb = x0 + (i + 1) * gap - 110;
          return <line key={i} x1={xa} y1={470} x2={lerp(xa, xb, p)} y2={470} stroke={EMBER} strokeWidth={4} strokeDasharray="14 10" style={{ filter: `drop-shadow(0 0 8px ${EMBER})` }} />; })}
      </svg>
      {steps.map((s, i) => {
        const k = easeOut(k01(t, s.at, s.at + 0.5));
        return <div key={i} style={{ position: "absolute", left: x0 + i * gap, top: 470, transform: `translate(-50%,-50%) scale(${lerp(0.6, 1, k)})`, opacity: k, textAlign: "center" }}>
          <div style={{ width: 210, height: 210, borderRadius: 105, background: "rgba(14,12,10,.72)", border: `3px solid ${i === steps.length - 1 ? EMBER2 : "rgba(255,255,255,.8)"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: `0 0 40px ${i === steps.length - 1 ? "rgba(255,138,43,.45)" : "rgba(0,0,0,.5)"}` }}>
            <Ico k={s.ico} c={i === steps.length - 1 ? EMBER2 : "#fff"} />
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: "#fff", marginTop: 26, textShadow: shadow, whiteSpace: "nowrap" }}>{s.label}</div>
          {s.val && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: s.val.startsWith("+") ? EMBER2 : "rgba(255,255,255,.7)", marginTop: 6, textShadow: shadow }}>{s.val}</div>}
        </div>;
      })}
    </div>
  );
};
