// kit del TURBO (mec28c): el turbo en corte (turbina caliente ↔ eje con aceite ↔ compresor frío), la rueda de aletas de frente,
// el termómetro, la barra comparativa y el frasco. Todo en 2D (sin translateZ/rotateY), luces siempre montadas.
import React from "react";
import { AMB, DIM, GRN, ICE, RED, TX, cl } from "./hkit";

export const HOT = "#ff6a2a", OIL = "#e0a93a", COKE = "#2a1d14", STEEL = "linear-gradient(180deg,#c9ced4,#7d848c 55%,#a9afb6)";

// rueda de aletas vista de frente (compresor o turbina); ang en grados, chip = aletas rotas 0..1, col = tinte
export const Blades: React.FC<{ x: number; y: number; r: number; ang: number; n?: number; col?: string; glow?: number; chip?: number; blur?: number }> = ({ x, y, r, ang, n = 11, col = "#cfd5dc", glow = 0, chip = 0, blur = 0 }) => (
  <svg viewBox="-110 -110 220 220" style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, overflow: "visible", filter: glow > 0 ? `drop-shadow(0 0 ${30 * glow}px ${HOT})` : "drop-shadow(0 30px 40px rgba(0,0,0,.55))" }}>
    <circle r={104} fill="rgba(0,0,0,.35)" />
    <g transform={`rotate(${ang})`}>
      {Array.from({ length: n }, (_, i) => { const a = (i / n) * 360, br = chip > 0 && i % 4 === 1 ? 1 - 0.35 * chip : 1;
        return <path key={i} transform={`rotate(${a})`} d={`M0 -16 C 22 -34, 30 -${70 * br}, 12 -${100 * br} L 2 -${98 * br} C 16 -70, 10 -36, -6 -18 Z`} fill={col} stroke="rgba(0,0,0,.35)" strokeWidth={1.5} />; })}
      {blur > 0 && <circle r={96} fill="none" stroke={col} strokeOpacity={0.25 * blur} strokeWidth={50} />}
      <circle r={22} fill="url(#hubg)" stroke="#555b62" strokeWidth={3} />
      <circle r={6} fill="#3a3f45" />
    </g>
    <defs><radialGradient id="hubg"><stop offset="0" stopColor="#eef1f4" /><stop offset="1" stopColor="#8a9096" /></radialGradient></defs>
  </svg>
);

// EL TURBO EN CORTE, de costado: turbina a la izquierda (gases), compresor a la derecha (aire), eje y cojinetes al medio.
// spin 0..1 velocidad · hot 0..1 rojo de la turbina · oil 0..1 aceite que baja por el caño · coke 0..1 costra negra en el eje
// gas / air 0..1 flechas de flujo · wobble 0..1 juego del eje · tt = segundos para animar
export const TurboX: React.FC<{ x: number; y: number; s?: number; tt: number; spin?: number; hot?: number; oil?: number; coke?: number; gas?: number; air?: number; wobble?: number; labels?: number }> = ({ x, y, s = 1, tt, spin = 1, hot = 0.4, oil = 1, coke = 0, gas = 0, air = 0, wobble = 0, labels = 0 }) => {
  const ang = tt * 900 * spin, wb = wobble * Math.sin(tt * 40) * 6;
  return <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: `scale(${s})` }}>
    {/* carcasa de la turbina (caracol caliente) */}
    <div style={{ position: "absolute", left: -560, top: -230, width: 420, height: 460, borderRadius: "48% 30% 30% 48%", background: `radial-gradient(circle at 60% 50%, rgba(255,${120 - 60 * hot},40,${0.25 + 0.6 * hot}), #2b2420 70%)`, boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 ${120 * hot}px rgba(255,90,30,${0.45 * hot}), inset 0 0 0 10px #3a302a` }} />
    {/* carcasa del compresor (aluminio frío) */}
    <div style={{ position: "absolute", left: 140, top: -230, width: 420, height: 460, borderRadius: "30% 48% 48% 30%", background: "radial-gradient(circle at 40% 50%, rgba(120,190,255,.18), #3a4048 72%)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 0 10px #4c535b" }} />
    {/* cuerpo central con el aceite */}
    <div style={{ position: "absolute", left: -150, top: -120, width: 300, height: 240, borderRadius: 26, background: "linear-gradient(180deg,#5a6068,#2f3338)", boxShadow: "0 30px 70px rgba(0,0,0,.55), inset 0 0 0 6px #6a7078" }} />
    {/* caño del aceite que baja de arriba */}
    <div style={{ position: "absolute", left: -12, top: -420, width: 24, height: 300, borderRadius: 12, background: "#4a4f55", boxShadow: "inset 0 0 0 4px #6c7279" }}>
      <div style={{ position: "absolute", left: 5, right: 5, bottom: 0, height: `${100 * cl(oil)}%`, borderRadius: 7, background: `linear-gradient(180deg, ${OIL}, #b07a18)` }} />
    </div>
    {/* eje */}
    <div style={{ position: "absolute", left: -470, top: -18 + wb, width: 940, height: 36, borderRadius: 18, background: STEEL, boxShadow: `0 0 ${30 * oil}px rgba(224,169,58,${0.5 * oil})` }} />
    {/* película de aceite alrededor del eje (respira con el giro) */}
    <div style={{ position: "absolute", left: -140, top: -34 + wb, width: 280, height: 68, borderRadius: 34, border: `${6 * oil}px solid rgba(224,169,58,${0.85 * oil})`, opacity: oil > 0.02 ? 0.6 + 0.4 * Math.sin(tt * 9) : 0 }} />
    {/* costra: manchas negras que crecen sobre el eje y el cojinete */}
    {coke > 0 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: -130 + i * 19, top: -30 + (i % 3) * 18 + wb, width: 26 * coke + 8, height: 22 * coke + 6, borderRadius: "40% 60% 50% 45%", background: COKE, opacity: cl(coke * 1.4 - i * 0.04) }} />)}
    {/* las dos ruedas, de canto (líneas que giran) */}
    {[-1, 1].map((sd) => <svg key={sd} viewBox="-60 -170 120 340" style={{ position: "absolute", left: sd * 350 - 60, top: -170, width: 120, height: 340, overflow: "visible" }}>
      {Array.from({ length: 9 }, (_, i) => { const yy = Math.sin(((ang * (sd < 0 ? 1 : 1.0)) / 57.3) + (i / 9) * Math.PI * 2) * 150, depth = Math.cos(((ang) / 57.3) + (i / 9) * Math.PI * 2);
        return <rect key={i} x={-46} y={yy - 6} width={92} height={12} rx={6} fill={sd < 0 ? `rgb(${190 + 60 * hot},${150 - 60 * hot},${120 - 80 * hot})` : "#d6dce2"} opacity={0.35 + 0.65 * (depth > 0 ? depth : 0)} />; })}
    </svg>)}
    {/* flujo de gases (izquierda, de abajo hacia afuera) y de aire (derecha, entra) */}
    {gas > 0 && Array.from({ length: 6 }, (_, i) => { const p = ((tt * 1.3 + i / 6) % 1); return <div key={i} style={{ position: "absolute", left: -720 + p * 260, top: 160 - p * 150, width: 70, height: 16, borderRadius: 8, background: `rgba(255,120,50,${gas * (1 - p)})`, transform: "rotate(-30deg)" }} />; })}
    {air > 0 && Array.from({ length: 6 }, (_, i) => { const p = ((tt * 1.3 + i / 6) % 1); return <div key={i} style={{ position: "absolute", left: 760 - p * 300, top: -10, width: 80, height: 14, borderRadius: 7, background: `rgba(140,210,255,${air * (1 - p * 0.8)})` }} />; })}
    {labels > 0 && <>
      <div style={{ position: "absolute", left: -350, top: 260, transform: "translateX(-50%)", fontWeight: 900, fontSize: 34, color: HOT, opacity: labels, whiteSpace: "nowrap" }}>TURBINA · GASES</div>
      <div style={{ position: "absolute", left: 350, top: 260, transform: "translateX(-50%)", fontWeight: 900, fontSize: 34, color: ICE, opacity: labels, whiteSpace: "nowrap" }}>COMPRESOR · AIRE</div>
      <div style={{ position: "absolute", left: 0, top: 150, transform: "translateX(-50%)", fontWeight: 900, fontSize: 28, color: OIL, opacity: labels, whiteSpace: "nowrap" }}>EJE + ACEITE</div>
    </>}
  </div>;
};

// termómetro vertical: v 0..1, etiqueta del valor
export const Thermo: React.FC<{ x: number; y: number; h: number; v: number; val: string; col?: string }> = ({ x, y, h, v, val, col = HOT }) => (
  <div style={{ position: "absolute", left: x - 40, top: y - h, width: 80, height: h + 80 }}>
    <div style={{ position: "absolute", left: 22, top: 0, width: 36, height: h, borderRadius: 18, background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.2)" }}>
      <div style={{ position: "absolute", left: 6, right: 6, bottom: 0, height: `${100 * cl(v)}%`, borderRadius: 12, background: `linear-gradient(0deg, ${col}, #ffd27a)`, boxShadow: `0 0 ${40 * v}px ${col}` }} />
    </div>
    <div style={{ position: "absolute", left: 4, top: h - 10, width: 72, height: 72, borderRadius: "50%", background: col, boxShadow: `0 0 50px ${col}` }} />
    <div style={{ position: "absolute", left: 100, top: h * (1 - cl(v)) - 30, fontWeight: 900, fontSize: 56, color: col, whiteSpace: "nowrap", textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{val}</div>
  </div>
);

// barra horizontal que crece (w px al 100 %)
export const BarH: React.FC<{ x: number; y: number; w: number; p: number; col: string; label: string; val: string; h?: number }> = ({ x, y, w, p, col, label, val, h = 70 }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 3, color: DIM, marginBottom: 10, whiteSpace: "nowrap" }}>{label}</div>
    <div style={{ width: w * cl(p), height: h, borderRadius: h / 2, background: `linear-gradient(90deg, ${col}aa, ${col})`, boxShadow: `0 0 40px ${col}55` }} />
    <div style={{ position: "absolute", left: Math.max(w * cl(p) + 24, 24), top: 40 + h / 2 - 32, fontWeight: 900, fontSize: 56, color: TX, whiteSpace: "nowrap" }}>{val}</div>
  </div>
);

// frasco de vidrio con líquido (level 0..1, col) y chorrito que cae (pour 0..1)
export const Jar: React.FC<{ x: number; y: number; level: number; col: string; label?: string; s?: number }> = ({ x, y, level, col, label, s = 1 }) => (
  <div style={{ position: "absolute", left: x - 120 * s, top: y - 300 * s, width: 240 * s, height: 300 * s }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: `${30 * s}px ${30 * s}px ${50 * s}px ${50 * s}px`, background: "rgba(255,255,255,.06)", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.25), 0 30px 60px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${100 * cl(level)}%`, background: `linear-gradient(180deg, ${col}, ${col}cc)` }} />
    </div>
    {label && <div style={{ position: "absolute", left: "50%", top: 320 * s, transform: "translateX(-50%)", fontWeight: 900, fontSize: 32 * s, color: TX, whiteSpace: "nowrap" }}>{label}</div>}
  </div>
);

// segundos que corren (anillo de reloj): p 0..1, txt en el centro
export const Ring: React.FC<{ x: number; y: number; r: number; p: number; txt: string; col?: string; sub?: string }> = ({ x, y, r, p, txt, col = GRN, sub }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r }}>
    <svg viewBox="-110 -110 220 220" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <circle r={96} fill="rgba(0,0,0,.45)" stroke="rgba(255,255,255,.12)" strokeWidth={12} />
      <circle r={96} fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" strokeDasharray={603} strokeDashoffset={603 * (1 - cl(p))} transform="rotate(-90)" />
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 76} y1={Math.sin(a) * 76} x2={Math.cos(a) * 84} y2={Math.sin(a) * 84} stroke="rgba(255,255,255,.35)" strokeWidth={3} />; })}
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontWeight: 900, fontSize: r * 0.42, color: TX, lineHeight: 1 }}>{txt}</div>
      {sub && <div style={{ fontWeight: 800, fontSize: r * 0.13, letterSpacing: 3, color: DIM, marginTop: 6 }}>{sub}</div>}
    </div>
  </div>
);
export { AMB, DIM, GRN, ICE, RED, TX };
