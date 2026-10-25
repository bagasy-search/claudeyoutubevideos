import React from "react";
import { Persona } from "./persona";
import { GenteFab, OBRERO } from "./mundo";
import { V } from "./kit3";
import { C, ent, prog, fontFamily } from "./kit";

// Piezas chicas que se repiten entre partes: gente acostada / cargada, el despertador con su pértiga, goteras.

// persona girada alrededor de los pies (acostada en la cama, cargada en brazos, colgando…)
export const Girado: React.FC<{ t: number; g: GenteFab; rot: number }> = ({ t, g, rot }) => (
  <div style={{ position: "absolute", left: g.x, top: g.y, width: 0, height: 0, transform: `rotate(${rot}deg)` }}>
    <Persona t={t} h={g.h ?? 300} {...g} x={0} y={0} />
  </div>
);

// el knocker-up: camina por la vereda con la pértiga y, al llegar, golpea la ventana (wx, wy) desde `golpe`
export const Despertador: React.FC<{ t: number; x: number; wx: number; wy: number; golpe: number; camina?: number; seed?: number }> = ({ t, x, wx, wy, golpe, camina = 0, seed = 90 }) => {
  const g = t - golpe;
  const tap = g > 0 && g < 2.2 ? Math.abs(Math.sin(g * 9)) * 22 : 0;
  const levantado = g > -0.5;
  const hx = levantado ? x - 40 : x + 70, hy = levantado ? -330 : -260; // mano (aprox.)
  const px = levantado ? wx + 10 : x + 330, py = levantado ? wy - tap : -930; // punta: al hombro, hacia atrás, mientras camina
  const palo = (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
      <line x1={hx} y1={hy + 80} x2={px} y2={py} stroke="#7a4a22" strokeWidth={16} strokeLinecap="round" />
      <circle cx={px} cy={py} r={13} fill={V.hierro} />
      {g > 0 && g < 2.2 && tap > 16 && <g stroke="#fff3c4" strokeWidth={7} strokeLinecap="round">{[-1, 0, 1].map((d) => <line key={d} x1={px + d * 30} y1={py - 30} x2={px + d * 52} y2={py - 62} />)}</g>}
    </svg>
  );
  return (
    <>
      {!levantado && palo}
      <Persona t={t} seed={seed} x={x} y={0} h={500} ropa={OBRERO(7)} gorro="copa" barba flip camina={camina} bD={levantado ? 140 : 10} cD={levantado ? 10 : 20} expr="neutro" />
      {levantado && palo}
    </>
  );
};

// gotas de humedad que bajan por una pared (sótano húmedo)
export const Goteras: React.FC<{ t: number; x: number; y: number; w: number; h: number; n?: number; op?: number }> = ({ t, x, y, w, h, n = 9, op = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", pointerEvents: "none", opacity: op }} width={w} height={h}>
    {Array.from({ length: n }, (_, i) => {
      const k = ((t * (0.35 + (i % 3) * 0.12) + i * 0.37) % 1);
      const gx = (i * 137) % w;
      return (
        <g key={i}>
          <path d={`M ${gx} 0 L ${gx} ${k * h * 0.9}`} stroke="#5fa9c9" strokeWidth={8} opacity={0.35} />
          <path transform={`translate(${gx} ${k * h})`} d="M 0 -22 Q 13 0 0 10 Q -13 0 0 -22 Z" fill="#7fd6ff" opacity={1 - k * 0.5} />
        </g>
      );
    })}
  </svg>
);

// retrato enmarcado (testigos y personajes reales): marco dorado + persona de medio cuerpo + nombre
export const Retrato: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; g: Omit<GenteFab, "x" | "y">; nombre: string; sub?: string; s?: number }> = ({ t, t0, t1 = 1e9, x, y, g, nombre, sub, s = 1 }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0, 0, { damping: 10, stiffness: 180 });
  const out = 1 - prog(t, t1, t1 + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s * e * out}) rotate(${(1 - e) * 10 - 2}deg)` }}>
      <div style={{ position: "relative", width: 380, height: 440, background: "linear-gradient(180deg, #f3e2bd, #d9bf8a)", border: "18px solid #c8902a", borderRadius: 18, boxShadow: "12px 14px 0 rgba(20,8,40,.45), inset 0 0 0 6px #8a5a14", overflow: "hidden" }}>
        <Persona t={t} h={620} {...g} x={172} y={600} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: 420, transform: "translateX(-50%)", background: C.noche, color: "#fff", fontFamily, fontWeight: 700, fontSize: 40, padding: "8px 26px", borderRadius: 16, whiteSpace: "nowrap", border: "5px solid #fff3d6" }}>{nombre}</div>
      {sub && <div style={{ position: "absolute", left: "50%", top: 500, transform: "translateX(-50%)", color: "#fff", fontFamily, fontWeight: 700, fontSize: 30, whiteSpace: "nowrap", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill" }}>{sub}</div>}
    </div>
  );
};

// huellas de pie descalzo que avanzan por la pantalla (la caminata del piecer)
export const Huellas: React.FC<{ t: number; t0: number; t1: number; y?: number; n?: number; fuera?: number }> = ({ t, t0, t1, y = 900, n = 18, fuera = 1e9 }) => {
  if (t < t0 || t > fuera + 0.3) return null;
  const k = prog(t, t0, t1) * n;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, opacity: 1 - prog(t, fuera, fuera + 0.3) }} width={1920} height={1080}>
      {Array.from({ length: n }, (_, i) => i < k && (
        <g key={i} transform={`translate(${80 + i * (1760 / n)} ${y + (i % 2 ? -34 : 34)}) rotate(90) scale(${Math.min(1, (k - i) * 3)})`}>
          <ellipse cx={0} cy={0} rx={22} ry={36} fill="#fff3d6" opacity={0.9} />
          {[-16, -6, 4, 14].map((dx, j) => <circle key={j} cx={dx} cy={-46 + Math.abs(dx) * 0.3} r={7 - j * 0.6} fill="#fff3d6" opacity={0.9} />)}
        </g>
      ))}
    </svg>
  );
};

// pulmones que se llenan de fibra (sucio 0-1) y se achican (apaga 0-1); respiran con t
export const Pulmones: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; s?: number; sucio: number; apaga?: number }> = ({ t, t0, t1 = 1e9, x, y, s = 1, sucio, apaga = 0 }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0) * (1 - prog(t, t1, t1 + 0.3));
  const resp = 1 + Math.sin(t * (3 - apaga * 1.6)) * 0.04 * (1 - apaga * 0.8);
  const tono = (k: number) => `rgb(${Math.round(240 - 110 * k)}, ${Math.round(120 - 40 * k)}, ${Math.round(140 - 90 * k)})`;
  const L = "M -30 -200 Q -60 -230 -110 -200 Q -240 -120 -250 60 Q -255 190 -170 210 Q -80 225 -40 150 Z";
  return (
    <svg style={{ position: "absolute", left: x - 300 * s, top: y - 300 * s, overflow: "visible", transform: `scale(${e * resp * (1 - apaga * 0.12)})` }} width={600 * s} height={600 * s} viewBox="-300 -300 600 600">
      <rect x={-18} y={-300} width={36} height={130} rx={18} fill="#f2c0a8" stroke="#2a1530" strokeWidth={8} />
      <path d="M 0 -180 L -50 -150 M 0 -180 L 50 -150" stroke="#f2c0a8" strokeWidth={30} strokeLinecap="round" />
      {[1, -1].map((d) => (
        <g key={d} transform={`scale(${d} 1)`}>
          <path d={L} fill={tono(sucio)} stroke="#2a1530" strokeWidth={10} />
          {Array.from({ length: Math.floor(sucio * 34) }, (_, i) => <circle key={i} cx={-60 - ((i * 47) % 170)} cy={-150 + ((i * 89) % 330)} r={6 + (i % 3) * 3} fill="#7a5a3a" opacity={0.85} />)}
          <path d="M -60 -160 Q -150 -110 -180 20" stroke="#fff" strokeOpacity={0.4} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
};

// oreja con ondas que la golpean (el ruido); `sorda` 0-1 apaga el color y tacha
export const Oreja: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; s?: number; sorda?: number }> = ({ t, t0, t1 = 1e9, x, y, s = 1, sorda = 0 }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0) * (1 - prog(t, t1, t1 + 0.3));
  return (
    <svg style={{ position: "absolute", left: x - 300 * s, top: y - 300 * s, overflow: "visible", transform: `scale(${e})` }} width={600 * s} height={600 * s} viewBox="-300 -300 600 600">
      {Array.from({ length: 4 }, (_, i) => { const k = (t * 1.6 + i / 4) % 1; return <path key={i} d={`M ${-260 + k * 160} -120 Q ${-200 + k * 160} 0 ${-260 + k * 160} 120`} stroke={C.ambar} strokeWidth={16} fill="none" strokeLinecap="round" opacity={(1 - k) * (1 - sorda)} />; })}
      <path d="M 40 -170 Q 170 -190 170 -40 Q 170 60 100 100 Q 60 130 60 190 Q 50 240 0 220 Q -30 200 -10 160 Q 20 110 40 60 Q 60 0 20 -40 Q -10 -80 30 -110 Z" fill={sorda > 0.5 ? "#c9a890" : "#f2c09a"} stroke="#2a1530" strokeWidth={10} />
      <path d="M 70 -120 Q 130 -110 120 -40 Q 110 10 70 30" stroke="#d9997a" strokeWidth={14} fill="none" strokeLinecap="round" />
    </svg>
  );
};
