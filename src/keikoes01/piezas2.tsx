// Keiko ES · piezas NUEVAS de los minutos 2-11 (mismo idioma visual: washi, tinta sumi, sello hanko, madera hinoki, índigo ai).
// Cada truco tiene su pieza propia; todas entran con un tiempo de la voz (at) que les pasa Resto.tsx.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, HAND, KO, SERIF, e, ei, extrude, spr } from "./lib";

const fade = (t: number, a: number, out: number) => e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
const pk = (t: number, a: number, k = 1.2) => Math.min(1.12, spr(t, a, k));
const washi = `linear-gradient(180deg, ${KO.washi}, #e7d8b6)`;
const shadow = "0 30px 60px rgba(0,0,0,.55)";
const Big: React.FC<{ c?: string; s?: number; children: React.ReactNode; st?: React.CSSProperties }> = ({ c = KO.washi, s = 90, children, st }) =>
  <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: s, color: c, lineHeight: 1.02, textShadow: extrude(Math.round(s / 14), "#1c1210"), whiteSpace: "nowrap", ...st }}>{children}</div>;
const Hand: React.FC<{ c?: string; s?: number; children: React.ReactNode; st?: React.CSSProperties }> = ({ c = KO.washi, s = 54, children, st }) =>
  <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: s, color: c, textShadow: c === KO.washi ? "0 5px 16px rgba(0,0,0,.85)" : undefined, whiteSpace: "nowrap", ...st }}>{children}</div>;
const ChileSvg: React.FC<{ w?: number; faded?: number }> = ({ w = 160, faded = 0 }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 160 66">
    <path d="M 12 40 C 30 6, 100 4, 138 26 C 112 38, 60 62, 12 40 Z" fill={faded ? "#8a5a3a" : "#c0261a"} />
    <path d="M 30 30 C 60 18, 100 16, 126 26" stroke="rgba(255,255,255,.35)" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M 136 26 C 146 18, 152 20, 156 12" stroke="#4f6a2a" strokeWidth={7} fill="none" strokeLinecap="round" />
  </svg>);

// T1 · balanza de mercado: dos chiles en un platillo equilibran una bolsa de 5 kg (la medida) + "cada 2-3 meses" el chile pierde el color
export const BalanzaChiles: React.FC<{ t: number; at: number; meses: number; out: number }> = ({ t, at: a, meses, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const tilt = 14 * (1 - ei(t, a + 0.6, a + 1.6)) * Math.cos((t - a) * 5) ** 2;
  const fadeC = ei(t, meses + 0.3, meses + 1.6);
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 1420, top: 210, transform: `translate(-50%,0) scale(${pk(t, a)})` }}>
      <div style={{ width: 16, height: 300, margin: "0 auto", background: "linear-gradient(90deg,#5a3418,#a77a48,#5a3418)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: "50%", top: 20, width: 560, transform: `translateX(-50%) rotate(${tilt}deg)` }}>
        <div style={{ height: 14, background: "#3a2214", borderRadius: 7 }} />
        <div style={{ position: "absolute", left: -10, top: 12, width: 190, textAlign: "center" }}>
          <div style={{ width: 2, height: 70, margin: "0 auto", background: "#3a2214" }} />
          <div style={{ width: 190, height: 34, borderRadius: "0 0 95px 95px", background: "linear-gradient(180deg,#c9a46a,#8a6a3a)" }} />
          <div style={{ position: "absolute", left: 18, top: 40 }}><ChileSvg w={150} /></div>
          <div style={{ position: "absolute", left: 30, top: 58 }}><ChileSvg w={130} /></div>
          <Big s={64} c={KO.beni} st={{ marginTop: 14, textShadow: "0 3px 0 #fff" }}>2</Big>
        </div>
        <div style={{ position: "absolute", right: -10, top: 12, width: 190, textAlign: "center" }}>
          <div style={{ width: 2, height: 70, margin: "0 auto", background: "#3a2214" }} />
          <div style={{ width: 190, height: 34, borderRadius: "0 0 95px 95px", background: "linear-gradient(180deg,#c9a46a,#8a6a3a)" }} />
          <div style={{ position: "absolute", left: 30, top: -96, width: 130, height: 130, borderRadius: "18px 18px 8px 8px", background: "linear-gradient(180deg,#f3ead6,#d8c79e)", boxShadow: "inset 0 -10px 0 rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 30, color: KO.sumi }}>ARROZ</div>
          <Big s={64} st={{ marginTop: 14 }}>5 kg</Big>
        </div>
      </div>
    </div>
    {t > meses && <div style={{ position: "absolute", left: 1420, top: 760, transform: `translateX(-50%) scale(${pk(t, meses)})`, padding: "18px 34px", background: washi, borderRadius: 10, boxShadow: shadow, display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ position: "relative", width: 150, height: 64 }}><div style={{ position: "absolute", inset: 0, opacity: 1 - fadeC }}><ChileSvg w={150} /></div><div style={{ position: "absolute", inset: 0, opacity: fadeC }}><ChileSvg w={150} faded={1} /></div></div>
      <div><div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: KO.sumi }}>CADA 2-3 MESES</div><div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 34, color: KO.beni }}>cuando pierde el color</div></div>
    </div>}
  </AbsoluteFill>;
};

// T2 · las tres palabras del arroz: tres tablillas que caen y se encienden una por una
export const TresPalabras: React.FC<{ t: number; ats: number[]; out: number; words: string[]; y?: number }> = ({ t, ats, out, words, y = 760 }) => {
  const o = fade(t, ats[0] - 0.1, out); if (o <= 0.01) return null;
  const ico = [
    <svg key="a" width={70} height={70} viewBox="0 0 70 70"><path d="M35 6 L35 64 M10 20 L60 50 M60 20 L10 50" stroke={KO.ai} strokeWidth={6} strokeLinecap="round" /></svg>,
    <svg key="b" width={70} height={70} viewBox="0 0 70 70"><path d="M48 10 A 26 26 0 1 0 60 48 A 20 20 0 1 1 48 10 Z" fill={KO.sumi} /></svg>,
    <svg key="c" width={70} height={70} viewBox="0 0 70 70"><rect x={14} y={30} width={42} height={32} rx={5} fill={KO.beni} /><path d="M22 30 V20 a13 13 0 0 1 26 0 V30" stroke={KO.beni} strokeWidth={7} fill="none" /></svg>,
  ];
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 960, top: y, transform: "translate(-50%,-50%)", display: "flex", gap: 40 }}>
      {words.map((w, i) => { const k = pk(t, ats[i], 1.4), on = e(t, ats[i], ats[i] + 0.2); return <div key={i} style={{ width: 380, padding: "26px 0", textAlign: "center", background: washi, borderTop: `8px solid ${KO.beni}`, boxShadow: shadow, opacity: on, transform: `translateY(${(1 - Math.min(1, k)) * -260}px) rotate(${(i - 1) * 2}deg)` }}>
        {ico[i % 3]}<div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: KO.sumi, letterSpacing: 4 }}>{w}</div></div>; })}
    </div>
  </AbsoluteFill>;
};

// sello de prohibido pintado a pincel encima de lo que NO se hace (círculo rojo + raya)
export const NoSeHace: React.FC<{ t: number; at: number; out: number; x: number; y: number; r?: number; label?: string }> = ({ t, at: a, out, x, y, r = 230, label }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const d = ei(t, a, a + 0.45), l = ei(t, a + 0.35, a + 0.6), C = 2 * Math.PI * r;
  return <AbsoluteFill style={{ opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "url(#tinta) drop-shadow(0 8px 14px rgba(0,0,0,.5))" }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={KO.beni} strokeWidth={30} strokeDasharray={C} strokeDashoffset={C * (1 - d)} strokeLinecap="round" transform={`rotate(-110 ${x} ${y})`} />
      <line x1={x - r * 0.7} y1={y - r * 0.7} x2={x - r * 0.7 + r * 1.4 * l} y2={y - r * 0.7 + r * 1.4 * l} stroke={KO.beni} strokeWidth={30} strokeLinecap="round" />
    </svg>
    {label && <div style={{ position: "absolute", left: x, top: y + r + 30, transform: "translateX(-50%)", opacity: e(t, a + 0.5, a + 0.7) }}><Big s={62}>{label}</Big></div>}
  </AbsoluteFill>;
};

// T3 · el miso en corte: el pote, la superficie se alisa, el film baja y las burbujas de aire salen por los costados
export const MisoCorte: React.FC<{ t: number; at: number; film: number; out: number }> = ({ t, at: a, film, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const f = ei(t, film, film + 0.9), flat = ei(t, a + 0.3, a + 1.2);
  const surf = (k: number) => `M 60 ${150 + (1 - flat) * 14 * Math.sin(k)} ` + Array.from({ length: 9 }, (_, i) => `L ${60 + (i + 1) * 40} ${150 + (1 - flat) * 16 * Math.sin(i * 1.7 + k)}`).join(" ");
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 1380, top: 520, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, padding: 30, background: washi, borderRadius: 16, boxShadow: shadow }}>
      <svg width={520} height={400} viewBox="0 0 520 400">
        <path d="M 40 110 L 60 360 Q 260 392 460 360 L 480 110" fill="#f2ead8" stroke={KO.nogal} strokeWidth={8} />
        <path d={surf(0) + " L 460 350 Q 260 380 60 350 Z"} fill="#a8743c" />
        <path d={surf(0)} stroke="#6a4520" strokeWidth={6} fill="none" opacity={1 - f} />
        <path d={`M 50 ${40 + 110 * f} L 470 ${40 + 110 * f}`} stroke="rgba(150,200,220,.95)" strokeWidth={8} />
        {[0, 1, 2, 3, 4, 5].map((i) => { const side = i % 2 ? 1 : -1, p = ei(t, film + 0.3 + i * 0.08, film + 1.1 + i * 0.08); return p <= 0 ? null : <circle key={i} cx={260 + side * (60 + p * 200) + (i - 2) * 6} cy={145 - p * 80 - (i % 3) * 8} r={10 - i} fill="none" stroke="#7fb3c8" strokeWidth={3} opacity={1 - p} />; })}
      </svg>
      <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: KO.sumi, opacity: e(t, film + 0.6, film + 0.9) }}>PEGADITO · SIN AIRE</div>
    </div>
  </AbsoluteFill>;
};

// T3 · la cuchara mojada abre "la puerta del moho": una puerta de fusuma que se corre y deja ver manchas verdes
export const PuertaMoho: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const op = ei(t, a + 0.4, a + 1.3);
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 520, top: 540, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, width: 440, height: 520, overflow: "hidden", borderRadius: 10, boxShadow: shadow, background: "#2b3324" }}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + ((i * 97) % 340), top: 50 + ((i * 131) % 400), width: 40 + (i % 4) * 22, height: 40 + (i % 4) * 22, borderRadius: "50%", background: i % 3 ? "radial-gradient(circle,#9fc46a,#4f7a3a 60%,transparent 70%)" : "radial-gradient(circle,#8fb6c8,#3f6a82 60%,transparent 70%)", transform: `scale(${ei(t, a + 0.8 + i * 0.05, a + 1.6 + i * 0.05)})` }} />)}
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", top: 0, bottom: 0, width: 220, left: k ? 220 + op * 200 : -op * 200, background: `repeating-linear-gradient(0deg, transparent 0 86px, ${KO.nogal} 86px 92px), repeating-linear-gradient(90deg, transparent 0 70px, ${KO.nogal} 70px 76px), ${KO.washi}`, border: `8px solid ${KO.nogal}` }} />)}
    </div>
    <div style={{ position: "absolute", left: 520, top: 870, transform: "translateX(-50%)", opacity: e(t, a + 0.9, a + 1.2) }}><Big s={60}>LA PUERTA DEL MOHO</Big></div>
  </AbsoluteFill>;
};

// T4 · termómetro del congelador que baja a -18 °C con escarcha; el miso sigue blando
export const Congelador: React.FC<{ t: number; at: number; blando: number; out: number }> = ({ t, at: a, blando, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const v = 20 - 38 * ei(t, a + 0.2, a + 1.6), fr = ei(t, a + 0.6, a + 2);
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(190,225,240,${0.55 * fr}) 100%)` }} />
    {Array.from({ length: 22 }, (_, i) => { const x = (i * 211) % 1920, y = (i * 97) % 1080, edge = Math.min(x, 1920 - x, y, 1080 - y); return edge > 220 ? null : <svg key={i} width={70} height={70} viewBox="-35 -35 70 70" style={{ position: "absolute", left: x - 35, top: y - 35, opacity: fr * 0.9, transform: `rotate(${i * 23}deg) scale(${0.6 + (i % 3) * 0.3})` }}>{[0, 60, 120].map((r) => <line key={r} x1={0} y1={-30} x2={0} y2={30} stroke="#f2fbff" strokeWidth={4} transform={`rotate(${r})`} />)}</svg>; })}
    <div style={{ position: "absolute", left: 360, top: 540, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, display: "flex", alignItems: "flex-end", gap: 24 }}>
      <div style={{ position: "relative", width: 60, height: 420, borderRadius: 30, background: "#f4f8fa", boxShadow: shadow }}>
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 30, height: 30 + ((v + 20) / 40) * 330, borderRadius: 12, background: "linear-gradient(180deg,#5fa8d8,#2f6aa0)" }} />
        <div style={{ position: "absolute", left: 6, bottom: -10, width: 48, height: 48, borderRadius: "50%", background: "#2f6aa0" }} />
      </div>
      <Big s={110} c="#e8f6ff">{Math.round(v)}°</Big>
    </div>
    {t > blando && <div style={{ position: "absolute", left: 1480, top: 820, transform: `translate(-50%,-50%) scale(${pk(t, blando)})` }}><div style={{ padding: "16px 34px", background: washi, borderRadius: 10, boxShadow: shadow, fontFamily: SERIF, fontWeight: 800, fontSize: 48, color: KO.sumi }}>NO SE PONE DURO</div></div>}
  </AbsoluteFill>;
};

// T4 · el pote se parte en dos: una mitad se queda, la otra se va con escarcha al congelador
export const MitadPote: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const sp = ei(t, a + 0.4, a + 1.2);
  const half = (side: number) => <div style={{ position: "absolute", top: 0, left: side < 0 ? 0 : 150, width: 150, height: 220, overflow: "hidden", transform: `translateX(${side * sp * 150}px) translateY(${side > 0 ? sp * 40 : 0}px)` }}>
    <div style={{ position: "absolute", left: side < 0 ? 0 : -150, width: 300, height: 220, borderRadius: "14px 14px 40px 40px", background: "linear-gradient(180deg,#a8743c,#7a5228)", border: `8px solid ${KO.nogal}`, boxSizing: "border-box", filter: side > 0 ? `drop-shadow(0 0 ${20 * sp}px #bfe6ff)` : undefined }} /></div>;
  return <div style={{ position: "absolute", left: 1450, top: 380, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})` }}>
    <div style={{ position: "relative", width: 300, height: 220 }}>{half(-1)}{half(1)}</div>
    <div style={{ display: "flex", justifyContent: "space-between", width: 600, marginLeft: -150, marginTop: 30, opacity: e(t, a + 1, a + 1.3) }}><Hand>heladera</Hand><Hand c="#cfeaff">congelador ❄</Hand></div>
  </div>;
};

// T5 · contador de años que gira como cuentakilómetros de madera
export const Anos: React.FC<{ t: number; at: number; out: number; to: number; label: string; x?: number; y?: number }> = ({ t, at: a, out, to, label, x = 1450, y = 300 }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const v = to * ei(t, a + 0.2, a + 1.5);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, textAlign: "center" }}>
    <div style={{ display: "inline-flex", gap: 10, padding: 16, background: "#3a2214", borderRadius: 14, boxShadow: shadow }}>
      {[0, 1].map((d) => { const n = d ? v % 10 : Math.floor(v / 10); return <div key={d} style={{ width: 110, height: 150, overflow: "hidden", borderRadius: 8, background: washi, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -n * 150 }}>{Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: 150, lineHeight: "150px", fontFamily: SERIF, fontWeight: 800, fontSize: 120, color: KO.sumi }}>{i % 10}</div>)}</div></div>; })}
    </div>
    <Big s={64} st={{ marginTop: 14 }}>{label}</Big>
  </div>;
};

// T5/T6 · lupa sobre el detalle + veredicto (sí/no) con interruptor de madera
export const Veredicto: React.FC<{ t: number; at: number; flip: number; out: number; no: string; si: string; x?: number; y?: number }> = ({ t, at: a, flip, out, no, si, x = 1420, y = 820 }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const f = ei(t, flip, flip + 0.35);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, display: "flex", alignItems: "center", gap: 26, padding: "18px 30px", background: washi, borderRadius: 60, boxShadow: shadow }}>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: KO.sumi, opacity: 1 - 0.65 * f, textDecoration: f > 0.5 ? "line-through" : undefined, textDecorationColor: KO.beni, textDecorationThickness: 6 }}>{no}</div>
    <div style={{ position: "relative", width: 120, height: 60, borderRadius: 30, background: f > 0.5 ? KO.matcha : "#b9aa8c" }}><div style={{ position: "absolute", top: 6, left: 6 + 60 * f, width: 48, height: 48, borderRadius: "50%", background: "#fffaf0", boxShadow: "0 3px 8px rgba(0,0,0,.35)" }} /></div>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 56, color: KO.beni, opacity: 0.3 + 0.7 * f }}>{si}</div>
  </div>;
};

// T7 · la cuenta del arroz: una olla de domingo se reparte en tazones que se van llenando
export const OllaSeis: React.FC<{ t: number; at: number; tazas: number; seis: number; out: number }> = ({ t, at: a, tazas, seis, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 960, top: 300, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, display: "flex", alignItems: "center", gap: 30 }}>
      <svg width={240} height={180} viewBox="0 0 240 180"><ellipse cx={120} cy={60} rx={100} ry={26} fill="#f6f2e8" /><path d="M 20 60 L 30 160 Q 120 182 210 160 L 220 60" fill="#3a3a3a" /><ellipse cx={120} cy={60} rx={100} ry={26} fill="none" stroke="#555" strokeWidth={8} /></svg>
      <div><Big s={72}>{Math.min(3, Math.max(1, Math.ceil(3 * ei(t, tazas, tazas + 0.8))))} TAZAS</Big><Hand>el domingo</Hand></div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 720, transform: "translate(-50%,-50%)", display: "flex", gap: 26 }}>
      {Array.from({ length: 6 }, (_, i) => { const k = pk(t, seis + i * 0.16, 1.5); return <div key={i} style={{ textAlign: "center", transform: `scale(${k})` }}>
        <svg width={170} height={120} viewBox="0 0 170 120"><path d="M 10 40 Q 85 150 160 40 Z" fill={KO.ai} /><ellipse cx={85} cy={40} rx={75} ry={16} fill="#f6f2e8" /><path d="M 20 40 Q 85 6 150 40" fill="#fffdf6" /></svg>
        <Hand s={36}>{["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"][i]}</Hand></div>; })}
    </div>
    <div style={{ position: "absolute", left: 960, top: 930, transform: "translate(-50%,-50%)", opacity: e(t, seis + 1.1, seis + 1.4) }}><Big s={74} c={KO.oro}>= 6 COMIDAS</Big></div>
  </AbsoluteFill>;
};

// T7 · la porción planita: cuadrado de arroz envuelto, cinta métrica "150 g" y comparación bola vs plano con ondas de frío
export const Planito: React.FC<{ t: number; at: number; bola: number; out: number }> = ({ t, at: a, bola, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const cold = (t - bola) * 1.2;
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 1440, top: 330, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, textAlign: "center" }}>
      <div style={{ width: 300, height: 300, transform: "perspective(700px) rotateX(55deg) rotateZ(-20deg)", background: "radial-gradient(circle at 30% 30%, #fffdf6, #ece6d6)", borderRadius: 18, boxShadow: "0 30px 40px rgba(0,0,0,.45), inset 0 0 0 6px rgba(200,230,240,.8)" }} />
      <Big s={86} st={{ marginTop: -40 }}>150 g</Big><Hand>lo que entra en un tazón</Hand>
    </div>
    {t > bola && <div style={{ position: "absolute", left: 1440, top: 800, transform: `translate(-50%,-50%) scale(${pk(t, bola)})`, display: "flex", gap: 60, padding: "24px 40px", background: washi, borderRadius: 14, boxShadow: shadow }}>
      {[0, 1].map((k) => <div key={k} style={{ textAlign: "center", position: "relative" }}>
        <svg width={220} height={120} viewBox="0 0 220 120">
          {[0, 1, 2].map((r) => { const p = (cold * (k ? 1.6 : 0.6) + r * 0.33) % 1; return <ellipse key={r} cx={110} cy={k ? 80 : 60} rx={(k ? 90 : 50) + p * 20} ry={(k ? 22 : 50) + p * 14} fill="none" stroke="#8cc8e6" strokeWidth={4} opacity={1 - p} />; })}
          {k ? <rect x={30} y={66} width={160} height={28} rx={10} fill="#f6f2e8" /> : <circle cx={110} cy={60} r={46} fill="#f6f2e8" />}
        </svg>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: k ? KO.matcha : KO.beni }}>{k ? "PLANITO ✓" : "EN BOLA ✗"}</div></div>)}
    </div>}
  </AbsoluteFill>;
};

// T7 · por qué caliente: corte de la porción, el vapor queda atrapado dentro del film (gotitas que vuelven al arroz)
export const VaporAtrapado: React.FC<{ t: number; at: number; out: number; x?: number }> = ({ t, at: a, out, x = 480 }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const film = ei(t, a + 0.3, a + 1);
  return <div style={{ position: "absolute", left: x, top: 560, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, padding: 26, background: washi, borderRadius: 16, boxShadow: shadow, textAlign: "center" }}>
    <svg width={520} height={260} viewBox="0 0 520 260">
      <rect x={60} y={150} width={400} height={70} rx={20} fill="#f6f2e8" stroke="#d9cfb8" strokeWidth={3} />
      {Array.from({ length: 10 }, (_, i) => { const ph = ((t - a) * 0.8 + i * 0.1) % 1, x = 90 + i * 36, top = 150 - 90 * film - 20; const y = 150 - ph * (150 - top); return <circle key={i} cx={x + Math.sin(ph * 6 + i) * 6} cy={y} r={7 - ph * 3} fill="#bfe0ef" opacity={0.9} />; })}
      <path d={`M 40 220 L 40 ${150 - 90 * film - 30} Q 260 ${150 - 90 * film - 60} 480 ${150 - 90 * film - 30} L 480 220`} fill="none" stroke="rgba(120,190,220,.95)" strokeWidth={8} opacity={film} />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: KO.sumi }}>EL VAPOR SE QUEDA ADENTRO</div>
  </div>;
};

// T7 · microondas de cocina: dígitos 2:00 que cuentan + "1 min quieto"
export const Micro: React.FC<{ t: number; at: number; quieto: number; out: number }> = ({ t, at: a, quieto, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const left = Math.max(0, 120 - (t - a - 0.3) * 40), mm = Math.floor(left / 60), ss = Math.floor(left % 60);
  return <div style={{ position: "absolute", left: 1450, top: 500, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})` }}>
    <div style={{ width: 520, height: 300, borderRadius: 26, background: "linear-gradient(180deg,#f2efe8,#cfc9bc)", boxShadow: shadow, display: "flex", alignItems: "center", padding: 24, gap: 24 }}>
      <div style={{ width: 300, height: 230, borderRadius: 14, background: `radial-gradient(circle at 50% 60%, rgba(255,200,110,${t < quieto ? 0.7 : 0.15}), #2a2620 70%)` }} />
      <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 64, color: "#7ee08a", background: "#101410", padding: "6px 12px", borderRadius: 8 }}>{mm}:{String(ss).padStart(2, "0")}</div>
    </div>
    {t > quieto && <div style={{ position: "absolute", left: "50%", top: 330, transform: `translateX(-50%) scale(${pk(t, quieto)})`, padding: "14px 30px", background: KO.ai, borderRadius: 40, fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: KO.washi, whiteSpace: "nowrap" }}>+ 1 MIN QUIETO</div>}
  </div>;
};

// T7 · comidas listas vs la olla de domingo: barras de precio que crecen (x5)
export const Precio5: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const g = ei(t, a + 0.3, a + 1.4);
  return <div style={{ position: "absolute", left: 1400, top: 560, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, padding: "30px 44px", background: washi, borderRadius: 16, boxShadow: shadow, display: "flex", alignItems: "flex-end", gap: 60 }}>
    {[{ h: 70, l: "MI ARROZ", c: KO.matcha }, { h: 350, l: "COMIDA LISTA", c: KO.beni }].map((b, i) => <div key={i} style={{ textAlign: "center" }}>
      {i === 1 && <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 70, color: KO.beni, opacity: e(t, a + 1.2, a + 1.4) }}>×5</div>}
      <div style={{ width: 150, height: 12 + b.h * g, background: b.c, borderRadius: "10px 10px 0 0", margin: "0 auto" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 32, color: KO.sumi, marginTop: 10 }}>{b.l}</div></div>)}
  </div>;
};

// T8 · reloj de luna: el agua fría trabaja toda la noche (5 h mínimo) y el agua de los hongos se vuelve caldo
export const NocheFria: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const h = 5 * ei(t, a + 0.3, a + 2.2);
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(20,30,60,${0.55 * ei(t, a, a + 0.6)}), transparent 60%)` }} />
    <div style={{ position: "absolute", left: 360, top: 330, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, textAlign: "center" }}>
      <svg width={300} height={300} viewBox="-150 -150 300 300">
        <circle r={130} fill="#1b2440" stroke={KO.oro} strokeWidth={8} />
        <path d={`M 0 0 L 0 -120 A 120 120 0 ${h > 6 ? 1 : 0} 1 ${120 * Math.sin((h / 12) * 2 * Math.PI)} ${-120 * Math.cos((h / 12) * 2 * Math.PI)} Z`} fill="rgba(224,169,63,.45)" />
        <path d="M 30 -60 A 40 40 0 1 0 60 -10 A 32 32 0 1 1 30 -60 Z" fill="#f6e7b8" />
        <line x1={0} y1={0} x2={90 * Math.sin((h / 12) * 2 * Math.PI)} y2={-90 * Math.cos((h / 12) * 2 * Math.PI)} stroke="#f4ecdc" strokeWidth={8} strokeLinecap="round" />
      </svg>
      <Big s={80}>{Math.round(h)} HORAS</Big><Hand>en agua fría · en la heladera</Hand>
    </div>
  </AbsoluteFill>;
};

// T8 · el sol sube la vitamina D: rayos que bajan sobre un hongo dado vuelta y una barrita "D" que crece
export const SolD: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const g = ei(t, a + 0.6, a + 2);
  return <AbsoluteFill style={{ opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={1700} y1={-40} x2={1700 - 600 + i * 90} y2={700} stroke="rgba(255,214,120,.55)" strokeWidth={26} strokeDasharray="40 30" strokeDashoffset={-(t - a) * 160} />)}
      <circle cx={1700} cy={-20} r={140} fill="#ffd36a" />
    </svg>
    <div style={{ position: "absolute", left: 1460, top: 760, transform: `translate(-50%,-50%) scale(${pk(t, a + 0.3)})`, display: "flex", alignItems: "flex-end", gap: 20, padding: "20px 30px", background: washi, borderRadius: 14, boxShadow: shadow }}>
      <div style={{ width: 70, height: 40 + 180 * g, background: `linear-gradient(180deg, ${KO.oro}, #b07a1c)`, borderRadius: "10px 10px 0 0" }} />
      <div><Big s={84} c={KO.sumi} st={{ textShadow: "none" }}>VIT. D ↑</Big><Hand c={KO.beni} s={40}>1 hora al sol</Hand></div>
    </div>
  </AbsoluteFill>;
};

// T9 / T15 · receta de la abuela escrita a pincel en papel con renglones; cada línea entra con la voz
export const Receta: React.FC<{ t: number; at: number; out: number; title: string; lines: { at: number; q: string; what: string }[]; x?: number; y?: number; stamp?: string }> = ({ t, at: a, out, title, lines, x = 1420, y = 540, stamp }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-2deg) scale(${pk(t, a)})`, width: 640, padding: "34px 40px 40px", background: `repeating-linear-gradient(180deg, transparent 0 69px, rgba(36,55,92,.2) 69px 71px), ${washi}`, borderRadius: 6, boxShadow: shadow }}>
    <div style={{ position: "absolute", left: 30, top: -18, width: 120, height: 36, transform: "rotate(-4deg)", background: "rgba(181,47,58,.6)" }} />
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: KO.beni, letterSpacing: 3, marginBottom: 10 }}>{title}</div>
    {lines.map((l, i) => <div key={i} style={{ display: "flex", gap: 20, alignItems: "baseline", height: 70, clipPath: `inset(-20% ${100 - 100 * e(t, l.at, l.at + 0.5)}% -20% 0)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 48, color: KO.sumi, minWidth: 190 }}>{l.q}</div><div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 44, color: KO.tinta }}>{l.what}</div></div>)}
    {stamp && <div style={{ position: "absolute", right: 30, bottom: 24, padding: "6px 14px", border: `5px solid ${KO.beni}`, borderRadius: 8, fontFamily: SERIF, fontWeight: 800, fontSize: 30, color: KO.beni, transform: `rotate(8deg) scale(${2 - Math.min(1, spr(t, lines[lines.length - 1].at + 0.8, 1.4))})`, opacity: e(t, lines[lines.length - 1].at + 0.8, lines[lines.length - 1].at + 0.9) }}>{stamp}</div>}
  </div>;
};

// T10 · la prensa: plato + frasco con agua bajan sobre el repollo salado y el agua sube por los costados
export const Prensa: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const d = ei(t, a + 0.2, a + 1), w = ei(t, a + 1, a + 2.4);
  return <div style={{ position: "absolute", left: 1460, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, padding: 26, background: washi, borderRadius: 16, boxShadow: shadow, textAlign: "center" }}>
    <svg width={460} height={420} viewBox="0 0 460 420">
      <path d="M 30 220 Q 230 420 430 220 Z" fill="#e9e2d0" stroke={KO.nogal} strokeWidth={6} />
      <path d={`M ${60 + 20 * w} ${300 - 50 * w} Q 230 ${330 - 20 * w} ${400 - 20 * w} ${300 - 50 * w} Q 230 ${360} ${60 + 20 * w} ${300 - 50 * w} Z`} fill="rgba(140,200,226,.75)" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${110 + (i % 8) * 32} ${250 - (i > 7 ? 18 : 0) + 30 * d * 0.5} q 16 -12 30 0`} stroke="#a8c86a" strokeWidth={9} fill="none" strokeLinecap="round" />)}
      <g transform={`translate(0 ${-140 + 140 * d})`}>
        <ellipse cx={230} cy={225} rx={170} ry={18} fill="#f6f2e8" stroke="#bbb" strokeWidth={4} />
        <rect x={180} y={100} width={100} height={120} rx={14} fill="rgba(170,215,235,.55)" stroke="#dfeef3" strokeWidth={4} />
        <rect x={186} y={140} width={88} height={76} rx={10} fill="rgba(110,170,210,.6)" />
      </g>
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: KO.sumi }}>2 CDTAS DE SAL · ½ KG</div>
  </div>;
};

// T11 · nieve de jengibre: copos finos que caen sobre la pantalla desde un rallador
export const Nieve: React.FC<{ t: number; at: number; out: number; x?: number }> = ({ t, at: a, out, x = 1300 }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  return <AbsoluteFill style={{ opacity: o }}>
    {Array.from({ length: 70 }, (_, i) => { const st = a + (i % 35) * 0.06, ph = (t - st) * (0.35 + (i % 7) * 0.05); if (ph < 0) return null; const y = 150 + (ph % 1) * 900, xx = x + Math.sin(i * 2.3 + ph * 4) * (60 + (i % 9) * 30); return <div key={i} style={{ position: "absolute", left: xx, top: y, width: 6 + (i % 3) * 3, height: 3 + (i % 2) * 2, borderRadius: 3, background: "#fff7e0", opacity: 0.9 * (1 - (ph % 1) * 0.6), boxShadow: "0 0 6px rgba(255,240,200,.9)" }} />; })}
    <div style={{ position: "absolute", left: 1640, top: 880, transform: `translate(-50%,-50%) scale(${pk(t, a + 0.6)})` }}><Big s={80}>COMO NIEVE</Big></div>
  </AbsoluteFill>;
};

// T12 · "bien seca": un paño de tela pasa y se llevan las gotas, tres veces
export const BienSeca: React.FC<{ t: number; ats: number[]; out: number }> = ({ t, ats, out }) => {
  const o = fade(t, ats[0], out); if (o <= 0.01) return null;
  const wipe = Math.max(...ats.map((x) => (t > x && t < x + 0.8 ? (t - x) / 0.8 : -1)));
  const dry = ats.filter((x) => t > x + 0.8).length / ats.length;
  return <div style={{ position: "absolute", left: 1450, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, ats[0])})`, width: 520, height: 360, borderRadius: 16, overflow: "hidden", background: washi, boxShadow: shadow }}>
    {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + ((i * 113) % 420), top: 40 + ((i * 71) % 220), width: 26, height: 34, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, #fff, #8cc8e6 60%)", opacity: 1 - dry }} />)}
    {wipe >= 0 && <div style={{ position: "absolute", top: 0, bottom: 0, left: -200 + wipe * 760, width: 200, background: "repeating-linear-gradient(45deg,#f4ecdc 0 14px,#e2d3b2 14px 28px)", boxShadow: "0 0 30px rgba(0,0,0,.35)" }} />}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: KO.sumi }}>BIEN SECA{"!".repeat(ats.filter((x) => t > x).length)}</div>
  </div>;
};

// T13 · acostada se cansa, parada dura el doble: dos raíces de daikon y dos barras de días
export const Parada: React.FC<{ t: number; at: number; doble: number; out: number }> = ({ t, at: a, doble, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const g = ei(t, doble, doble + 1);
  const daikon = (stand: boolean) => <svg width={160} height={260} viewBox="0 0 160 260" style={{ transform: stand ? "none" : "rotate(90deg) translate(80px,0)" }}>
    <path d="M 80 20 C 40 30, 50 200, 80 250 C 110 200, 120 30, 80 20 Z" fill="#f4f0e6" stroke="#cfc6b4" strokeWidth={4} />
    <path d="M 60 30 Q 80 5 100 30" stroke={KO.matcha} strokeWidth={10} fill="none" />
    {!stand && <path d="M 60 120 Q 80 128 100 120" stroke="#9a8f7a" strokeWidth={5} fill="none" />}</svg>;
  return <div style={{ position: "absolute", left: 1400, top: 540, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, display: "flex", gap: 60, padding: "30px 46px", background: washi, borderRadius: 16, boxShadow: shadow }}>
    {[false, true].map((st, i) => <div key={i} style={{ textAlign: "center", width: 240 }}>
      <div style={{ height: 270, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{daikon(st)}</div>
      <div style={{ height: 22, width: (st ? 220 : 110) * (st ? g : 1), background: st ? KO.matcha : "#b9aa8c", borderRadius: 11, margin: "14px auto" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: st ? KO.matcha : "#8a7d64" }}>{st ? (g > 0.9 ? "×2 · PARADA" : "PARADA") : "ACOSTADA"}</div></div>)}
  </div>;
};

// T14 · botella chica vs grande: la grande se oscurece con el aire mes a mes
export const DosBotellas: React.FC<{ t: number; at: number; mes: number; out: number }> = ({ t, at: a, mes, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const ox = ei(t, a + 0.5, a + 2.5), m = ei(t, mes, mes + 0.4);
  const bot = (h: number, dark: number) => <svg width={h * 0.45} height={h} viewBox="0 0 90 200"><path d="M 35 0 H 55 V 40 Q 85 60 85 90 V 190 Q 85 200 75 200 H 15 Q 5 200 5 190 V 90 Q 5 60 35 40 Z" fill={`rgb(${60 - 40 * dark},${30 - 20 * dark},${20 - 14 * dark})`} /><rect x={33} y={0} width={24} height={14} fill={KO.beni} /><rect x={15} y={110} width={60} height={50} fill={KO.washi} /></svg>;
  return <div style={{ position: "absolute", left: 1400, top: 560, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, display: "flex", alignItems: "flex-end", gap: 70, padding: "30px 50px", background: washi, borderRadius: 16, boxShadow: shadow }}>
    <div style={{ textAlign: "center" }}>{bot(200, 0)}<div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: KO.matcha, opacity: 0.4 + 0.6 * m }}>1 MES ✓</div></div>
    <div style={{ textAlign: "center" }}>{bot(360, ox)}<div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: KO.beni }}>SE OXIDA</div></div>
  </div>;
};

// RUTINA · la semana de Keiko: tira de calendario con 7 días; se marca cada día cuando lo nombra
export const Semana: React.FC<{ t: number; at: number; out: number; days: { i: number; at: number; what: string }[]; y?: number }> = ({ t, at: a, out, days, y = 150 }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const D = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const cur = days.filter((d) => t >= d.at).pop();
  return <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: `translate(-50%,0) translateY(${(1 - Math.min(1, pk(t, a))) * (y > 540 ? 400 : -300)}px)`, display: "flex", gap: 10 }}>
    {D.map((d, i) => { const dd = days.find((x) => x.i === i), on = dd && t >= dd.at, now = cur && cur.i === i; return <div key={i} style={{ width: 190, height: 200, background: on ? (now ? KO.washi : "#e9dcbc") : "rgba(244,236,220,.55)", borderTop: `10px solid ${now ? KO.beni : KO.ai}`, borderRadius: 8, boxShadow: now ? "0 0 0 6px rgba(181,47,58,.6), " + shadow : "0 10px 20px rgba(0,0,0,.35)", transform: `translateY(${now ? 26 : 0}px)`, textAlign: "center", padding: 10 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: i === 0 ? KO.beni : KO.sumi }}>{d}</div>
      {on && dd && <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 30, lineHeight: "34px", color: KO.tinta, marginTop: 12, whiteSpace: "normal" }}>{dd.what}</div>}</div>; })}
  </div>;
};

// ERRORES · tarjeta de error numerada que se rompe en diagonal (rojo) con su título
export const ErrorCard: React.FC<{ t: number; at: number; out: number; n: number; text: string; sub: string; x?: number; y?: number }> = ({ t, at: a, out, n, text, sub, x = 1480, y = 850 }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const crack = ei(t, a + 0.8, a + 1.1);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})` }}>
    <div style={{ position: "relative", width: 700, padding: "28px 40px 30px 150px", background: washi, borderRadius: 12, boxShadow: shadow }}>
      <div style={{ position: "absolute", left: 26, top: "50%", transform: "translateY(-50%)", width: 100, height: 100, borderRadius: "50%", background: KO.beni, color: KO.washi, fontFamily: SERIF, fontWeight: 800, fontSize: 64, lineHeight: "100px", textAlign: "center" }}>{n}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 50, color: KO.sumi, lineHeight: 1.1 }}>{text}</div>
      <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 38, color: KO.beni, marginTop: 6 }}>{sub}</div>
      <svg width={700} height={200} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} viewBox="0 0 700 200" preserveAspectRatio="none"><path d="M 40 20 L 660 180" stroke={KO.beni} strokeWidth={14} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - crack)} opacity={0.85} /></svg>
    </div>
  </div>;
};

// CALMA · tarjeta tranquila (verde) o de alarma (roja) con su check / cruz pintada
export const Calma: React.FC<{ t: number; at: number; out: number; ok: boolean; text: string; sub: string; y?: number }> = ({ t, at: a, out, ok, text, sub, y = 300 }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const d = ei(t, a + 0.3, a + 0.8);
  return <div style={{ position: "absolute", left: 1400, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, display: "flex", alignItems: "center", gap: 26, width: 720, padding: "24px 34px", background: washi, borderLeft: `14px solid ${ok ? KO.matcha : KO.beni}`, borderRadius: 12, boxShadow: shadow }}>
    <svg width={110} height={110} viewBox="0 0 110 110" style={{ flexShrink: 0 }}><circle cx={55} cy={55} r={48} fill="none" stroke={ok ? KO.matcha : KO.beni} strokeWidth={8} />
      {ok ? <path d="M 30 58 L 48 76 L 82 36" stroke={KO.matcha} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={90} strokeDashoffset={90 * (1 - d)} />
        : <path d="M 34 34 L 76 76 M 76 34 L 34 76" stroke={KO.beni} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - d)} />}</svg>
    <div><div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: KO.sumi, lineHeight: 1.1 }}>{text}</div><div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 36, color: ok ? "#4f6a2a" : KO.beni, marginTop: 4 }}>{sub}</div></div>
  </div>;
};

// LA CUENTA · tres paquetes, uno se va a la basura → pagás ×1,5 → con los trucos se salva
export const Cuenta: React.FC<{ t: number; at: number; tira: number; vez: number; salva: number; out: number; x?: number }> = ({ t, at: a, tira, vez, salva, out, x = 960 }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const fall = ei(t, tira, tira + 0.7) * (1 - ei(t, salva, salva + 0.6));
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: x, top: 420, transform: `translate(-50%,-50%) scale(${pk(t, a)})`, display: "flex", gap: 40, alignItems: "flex-end" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 200, height: 260, borderRadius: "20px 20px 10px 10px", background: "linear-gradient(180deg,#d6b27a,#a77a48)", boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 36, color: "#3a2214", transform: i === 2 ? `translateY(${fall * 380}px) rotate(${fall * 40}deg)` : undefined, opacity: i === 2 ? 1 - 0.4 * fall : 1, outline: i === 2 && t > salva ? `8px solid ${KO.matcha}` : undefined }}>ARROZ</div>)}
    </div>
    <div style={{ position: "absolute", left: x + 370, top: 840, transform: "translate(-50%,-50%)", opacity: e(t, tira + 0.2, tira + 0.5) * (1 - e(t, salva, salva + 0.3)) }}>
      <svg width={260} height={180} viewBox="0 0 260 180"><path d="M 40 40 L 60 170 H 200 L 220 40 Z" fill="#555" /><rect x={30} y={24} width={200} height={20} rx={6} fill="#666" /></svg></div>
    {t > vez && <div style={{ position: "absolute", left: x, top: 820, transform: `translate(-50%,-50%) scale(${pk(t, vez)})` }}><Big s={96} c={t > salva ? KO.matcha : KO.beni}>{t > salva ? "YA NO SE TIRA" : "PAGAS × 1,5"}</Big></div>}
  </AbsoluteFill>;
};

// TAREA · dos fichas de madera (el chile y el arroz congelado) con un "nada más" a pincel
export const Tarea: React.FC<{ t: number; at: number; b: number; out: number }> = ({ t, at: a, b, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1400, top: 520, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <Big s={70} st={{ marginBottom: 26, transform: `scale(${pk(t, a)})` }}>ESTA SEMANA, SOLO 2</Big>
    <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
      {[{ at: b, n: 1, l: "EL CHILE\nEN EL ARROZ" }, { at: b + 0.9, n: 7, l: "EL ARROZ\nCONGELADO" }].map((f, i) => <div key={i} style={{ width: 300, padding: "26px 10px", background: `linear-gradient(180deg, ${KO.hinoki}, #c99a62)`, borderRadius: 16, boxShadow: shadow, transform: `scale(${pk(t, f.at, 1.4)}) rotate(${i ? 3 : -3}deg)` }}>
        <div style={{ width: 80, height: 80, margin: "0 auto", borderRadius: "50%", background: KO.ai, color: KO.washi, fontFamily: SERIF, fontWeight: 800, fontSize: 50, lineHeight: "80px" }}>{f.n}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 38, color: KO.sumi, marginTop: 14, whiteSpace: "pre-line" }}>{f.l}</div></div>)}
    </div>
  </div>;
};

// COMENTARIOS · la pregunta de la abuela y burbujas de respuestas de distintos países que suben
export const Comentarios: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const R = [["Mi abuela ponía hojas de laurel", "#86a352"], ["¡Un diente de ajo en el arroz!", "#24375c"], ["En mi casa, una ramita de canela", "#b52f3a"], ["Sal gruesa en una gasita", "#e0a93f"], ["Mi nona lo guardaba en lata", "#7a4b2a"]];
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 1380, top: 170, transform: `translate(-50%,0) scale(${pk(t, a)})`, width: 760, padding: "26px 34px", background: washi, borderRadius: 16, boxShadow: shadow, textAlign: "center" }}>
      <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 52, color: KO.sumi, lineHeight: 1.2 }}>¿Tu abuela también tenía<br />un truco para el arroz?</div></div>
    {R.map(([txt, c], i) => { const st = a + 0.8 + i * 0.55, k = pk(t, st, 1.3); if (t < st) return null; return <div key={i} style={{ position: "absolute", left: 1040 + (i % 2) * 140, top: 470 + i * 104 - ei(t, st, st + 4) * 40, transform: `scale(${k})`, display: "flex", alignItems: "center", gap: 16, padding: "14px 26px", background: "rgba(251,248,241,.97)", borderRadius: 40, boxShadow: "0 14px 30px rgba(0,0,0,.45)" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: c as string }} /><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#3a3a3a", whiteSpace: "nowrap" }}>{txt}</div></div>; })}
  </AbsoluteFill>;
};

// PRÓXIMO VIDEO · tarjeta que se congela (escarcha que la cubre) con el tema del próximo
export const Proximo: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = fade(t, a, out); if (o <= 0.01) return null;
  const fr = ei(t, a + 0.6, a + 2.2);
  return <div style={{ position: "absolute", left: 1400, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${pk(t, a)}) rotate(-2deg)`, width: 720, padding: "34px 40px", borderRadius: 18, background: `linear-gradient(160deg, rgba(220,240,250,${0.5 + 0.5 * fr}), ${KO.washi})`, boxShadow: `0 0 ${40 * fr}px rgba(170,220,250,.9), ${shadow}`, textAlign: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 34, color: KO.ai, letterSpacing: 8 }}>PRÓXIMO VIDEO</div>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: KO.sumi, lineHeight: 1.1, marginTop: 10 }}>TRUCOS JAPONESES<br />PARA EL CONGELADOR</div>
    <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 40, color: KO.beni, marginTop: 14 }}>el pescado · el tofu congelado</div>
  </div>;
};
