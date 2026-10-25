// piezas 2D propias del 2b (el cable de la batería): la computadora que aprende y olvida, la batería con sus bornes,
// el cronómetro de 15 minutos, la ventanilla que reaprende y la aguja del ralentí. Mismo lenguaje que kit2d.
// Sin desenfoque en ninguna.
import React from "react";
import { AbsoluteFill } from "remotion";
import { COL, FONT, e, ei } from "./lib";
import { Big, card, dark, pop } from "./kit2d";

const K = (k: number) => Math.min(1, k);
const GREEN = "#7dff9e", YEL = "#ffd60a";

// pizarrón del taller (fondo de las piezas)
export const Fondo: React.FC<{ t: number; tone?: string }> = ({ t, tone = "#0f1b2c" }) => {
  const lx = 50 + 18 * Math.sin(t * 0.21), ly = 40 + 10 * Math.cos(t * 0.17);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${lx}% ${ly}%, ${tone} 0%, #070c14 70%)` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(143,214,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(143,214,255,.06) 1px, transparent 1px)", backgroundSize: "80px 80px", backgroundPosition: `${(t * 6) % 80}px ${(t * 3) % 80}px` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// la computadora (ECU): una cajita de metal con su "memoria" de barras que se corrigen con el tiempo;
// en resetAt las barras vuelven a FÁBRICA y después reaprenden de cero
export const Ecu: React.FC<{ t: number; at: number; out: number; resetAt?: number; learnAt?: number; x?: number; y?: number; sc?: number; label?: string }> = ({ t, at, out, resetAt = 1e9, learnAt = 1e9, x = 960, y = 540, sc = 1, label }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const rs = ei(t, resetAt, resetAt + 0.8), ln = ei(t, learnAt, learnAt + 2.2);
  const base = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], learned = [0.62, 0.78, 0.9, 0.84, 0.7, 0.88, 0.95, 0.8], sano = [0.48, 0.52, 0.5, 0.55, 0.47, 0.51, 0.53, 0.5];
  const v = base.map((b, i) => { const drift = learned[i] + 0.02 * Math.sin(t * 2 + i); const r = drift + (b - drift) * rs; return r + (sano[i] - r) * ln; });
  const st = rs > 0.5 ? (ln > 0.5 ? "APRENDIENDO DE CERO" : "VALORES DE FÁBRICA") : "LO APRENDIDO";
  const stc = rs > 0.5 ? (ln > 0.5 ? GREEN : COL.ice) : YEL;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * (0.6 + 0.4 * K(k))}) rotateX(${(1 - K(k)) * 40}deg)` }}>
      <div style={{ width: 640, padding: 30, borderRadius: 26, background: "linear-gradient(160deg,#a9b2bb,#5d6670 55%,#3a424b)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.5)", fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 40, color: "#10161e", letterSpacing: 2 }}>{label ?? "COMPUTADORA · ECU"}</div>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: stc, boxShadow: `0 0 18px ${stc}` }} />
        </div>
        <div style={{ ...dark, borderRadius: 16, padding: "22px 24px", display: "flex", gap: 14, alignItems: "flex-end", height: 230 }}>
          {v.map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 8, background: `linear-gradient(180deg, ${stc}, rgba(255,255,255,.15))` }} />)}
        </div>
        <div style={{ marginTop: 16, textAlign: "center", fontWeight: 900, fontSize: 38, color: "#10161e" }}>{st}</div>
      </div>
      <div style={{ position: "absolute", left: -40, top: 60, width: 40, height: 180, background: "repeating-linear-gradient(180deg,#c9a34a 0 10px,#2b2f35 10px 20px)", borderRadius: "8px 0 0 8px" }} />
    </div>
  );
};

// la batería de 12 V con sus dos postes; la llave afloja el negativo, el borne se levanta y se envuelve;
// spark: en ese segundo salta la chispa del positivo a la masa (la regla de oro)
export const Bateria: React.FC<{ t: number; at: number; out: number; offAt?: number; wrapAt?: number; onAt?: number; spark?: number; x?: number; y?: number; sc?: number; note?: string }> = ({ t, at, out, offAt = 1e9, wrapAt = 1e9, onAt = 1e9, spark, x = 960, y = 560, sc = 1, note }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const lift = ei(t, offAt + 0.6, offAt + 1.3) * (1 - ei(t, onAt, onAt + 0.8));
  const rot = ei(t, offAt, offAt + 0.6) * (1 - e(t, offAt + 0.6, offAt + 0.8)) * 120 + (t > onAt ? -ei(t, onAt + 0.8, onAt + 1.4) * 120 * (1 - e(t, onAt + 1.4, onAt + 1.6)) : 0);
  const wrap = e(t, wrapAt, wrapAt + 0.5) * (1 - e(t, onAt - 0.3, onAt));
  const wrenchOn = (t > offAt - 0.3 && t < offAt + 0.9) || (t > onAt + 0.6 && t < onAt + 1.7);
  const sp = spark !== undefined ? Math.max(0, 1 - Math.abs(t - spark - 0.3) / 0.3) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * (0.6 + 0.4 * K(k))})` }}>
      <svg width={900} height={620} viewBox="-450 -330 900 620" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={-330} y={-120} width={660} height={380} rx={26} fill="#22262c" stroke="#3b424b" strokeWidth={6} />
        <rect x={-330} y={-150} width={660} height={60} rx={16} fill="#30353d" />
        <text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#e9edf2">12 V</text>
        {/* postes */}
        <rect x={160} y={-200} width={70} height={60} rx={10} fill="#b9b0a2" /><text x={195} y={-225} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={COL.red}>+</text>
        <rect x={-230} y={-200} width={70} height={60} rx={10} fill="#b9b0a2" /><text x={-195} y={-225} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#e9edf2">−</text>
        {/* borne positivo con su cable rojo */}
        <rect x={150} y={-205} width={90} height={44} rx={10} fill="#d23a2a" /><path d="M 240 -185 C 330 -185 360 -260 430 -280" stroke="#d23a2a" strokeWidth={26} fill="none" strokeLinecap="round" />
        {/* borne negativo: se levanta y se dobla hacia afuera */}
        <g transform={`translate(${-195 - lift * 170} ${-183 - lift * 120}) rotate(${-lift * 35})`}>
          <path d="M -40 0 C -140 0 -200 -60 -280 -90" stroke="#15181c" strokeWidth={26} fill="none" strokeLinecap="round" />
          <rect x={-45} y={-22} width={90} height={44} rx={10} fill="#3a3f46" stroke="#596270" strokeWidth={4} />
          {wrap > 0 && <rect x={-60} y={-38} width={120} height={76} rx={20} fill="#c8b48a" opacity={wrap} stroke="#8a744a" strokeWidth={4} />}
          {wrap > 0.6 && <text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#3a2a10">TRAPO</text>}
        </g>
        {wrenchOn && <g transform={`translate(-195 -183) rotate(${-rot})`}><rect x={-8} y={-16} width={190} height={32} rx={14} fill="#c7ccd3" stroke="#7d848e" strokeWidth={4} /><circle r={30} fill="none" stroke="#c7ccd3" strokeWidth={16} /><text x={110} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#2a3038">10 mm</text></g>}
        {sp > 0 && <g opacity={sp}><circle cx={300} cy={-230} r={70 * sp + 20} fill="rgba(255,240,150,.5)" /><path d="M 230 -190 L 270 -230 L 255 -232 L 300 -280 L 285 -240 L 305 -238 Z" fill="#fff6a8" /></g>}
      </svg>
      {note && <div style={{ position: "absolute", left: "50%", top: 590, transform: "translateX(-50%)" }}><Big s={52} c={YEL} edge="#5a4500">{note}</Big></div>}
    </div>
  );
};

// cronómetro que corre de verdad: arranca en runAt mostrando 00:00 y avanza "secs" segundos de reloj en "dur" segundos de video
export const Crono: React.FC<{ t: number; at: number; runAt: number; out: number; secs: number; dur: number; x?: number; y?: number; sub?: string; col?: string }> = ({ t, at, runAt, out, secs, dur, x = 960, y = 520, sub, col = GREEN }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const q = ei(t, runAt, runAt + dur), v = Math.round(q * secs), mm = String(Math.floor(v / 60)).padStart(2, "0"), ss = String(v % 60).padStart(2, "0");
  const R = 150, C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})`, display: "flex", alignItems: "center", gap: 34 }}>
      <svg width={360} height={360} viewBox="-180 -180 360 360" style={{ filter: "drop-shadow(0 25px 40px rgba(0,0,0,.6))" }}>
        <circle r={172} fill="rgba(12,18,28,.92)" /><circle r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={20} />
        <circle r={R} fill="none" stroke={col} strokeWidth={20} strokeDasharray={`${C * q} ${C}`} transform="rotate(-90)" strokeLinecap="round" />
        <text y={24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#fff">{mm}:{ss}</text>
      </svg>
      {sub && <Big s={62} c={col} edge="#0a3a1a">{sub}</Big>}
    </div>
  );
};

// la ventanilla que reaprende: baja del todo + mantener 3 s, sube del todo + mantener 3 s
export const Ventanilla: React.FC<{ t: number; at: number; out: number; downAt: number; upAt: number; x?: number; y?: number }> = ({ t, at, out, downAt, upAt, x = 700, y = 560 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const h = 1 - ei(t, downAt, downAt + 1.2) + ei(t, upAt, upAt + 1.2) * 1; // 1 = cerrada
  const holdD = t > downAt + 1.2 && t < downAt + 4.4, holdU = t > upAt + 1.2 && t < upAt + 4.4;
  const cnt = holdD ? Math.min(3, Math.floor(t - downAt - 1.2) + 1) : holdU ? Math.min(3, Math.floor(t - upAt - 1.2) + 1) : 0;
  const done = t > upAt + 4.4;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})` }}>
      <svg width={760} height={560} viewBox="0 0 760 560" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <path d="M 40 520 L 40 240 Q 60 60 300 40 L 700 40 L 720 520 Z" fill="#2b3139" stroke="#4a525d" strokeWidth={8} />
        <clipPath id="vc"><path d="M 80 290 Q 100 100 310 84 L 670 84 L 680 290 Z" /></clipPath>
        <rect x={60} y={80} width={640} height={220} fill="#0d141d" clipPath="url(#vc)" />
        <rect x={60} y={80 + (1 - h) * 210} width={640} height={220} fill="rgba(143,214,255,.38)" stroke="rgba(217,243,255,.8)" strokeWidth={4} clipPath="url(#vc)" />
        <rect x={60} y={300} width={660} height={14} fill="#1a1f25" />
        <rect x={500} y={380} width={150} height={70} rx={14} fill={holdD || holdU ? GREEN : "#59626e"} />
        <text x={575} y={428} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#10161e">{holdU || t > upAt ? "▲" : "▼"}</text>
      </svg>
      <div style={{ position: "absolute", left: 800, top: 120, ...card, padding: "20px 30px", minWidth: 470 }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: "#1d2733" }}>{t < upAt ? "1 · BAJA DEL TODO" : "2 · SUBE DEL TODO"}</div>
        <div style={{ fontWeight: 900, fontSize: 34, color: "#5a6470", marginTop: 8 }}>Y MANTÉN EL BOTÓN</div>
        <div style={{ fontWeight: 900, fontSize: 120, color: cnt ? "#0a8a3a" : "#c3c8ce", lineHeight: 1.1 }}>{done ? "✓" : `${cnt || 0} S`}</div>
      </div>
    </div>
  );
};

// la aguja de las vueltas: sube y baja (ralentí raro) hasta calmAt, después queda quieta
export const Aguja: React.FC<{ t: number; at: number; out: number; calmAt: number; x?: number; y?: number; sc?: number }> = ({ t, at, out, calmAt, x = 960, y = 560, sc = 1 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const calm = ei(t, calmAt, calmAt + 1.5), wob = (1 - calm) * (Math.sin(t * 3.1) * 0.5 + Math.sin(t * 7.3) * 0.2);
  const rpm = 0.8 + wob * 0.45, ang = -120 + rpm / 8 * 240;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * (0.6 + 0.4 * K(k))})` }}>
      <svg width={560} height={560} viewBox="-280 -280 560 560" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <circle r={260} fill="#0c1118" stroke="#3a424c" strokeWidth={12} />
        {Array.from({ length: 9 }, (_, i) => { const a = (-120 + i * 30 - 90) * Math.PI / 180; return <g key={i}><line x1={Math.cos(a) * 200} y1={Math.sin(a) * 200} x2={Math.cos(a) * 235} y2={Math.sin(a) * 235} stroke="#cfd6dc" strokeWidth={8} /><text x={Math.cos(a) * 165} y={Math.sin(a) * 165 + 14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill="#cfd6dc">{i}</text></g>; })}
        <g transform={`rotate(${ang})`}><polygon points="-9,20 9,20 3,-215 -3,-215" fill={calm > 0.5 ? GREEN : "#ff7a3a"} /></g>
        <circle r={26} fill="#2b3139" />
        <text y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#8a96a3">×1000 RPM</text>
      </svg>
      <div style={{ position: "absolute", left: "50%", top: 590, transform: "translateX(-50%)" }}><Big s={56} c={calm > 0.5 ? GREEN : "#ff9f43"} edge="#10161e">{calm > 0.5 ? "QUIETA" : "SUBE Y BAJA"}</Big></div>
    </div>
  );
};
