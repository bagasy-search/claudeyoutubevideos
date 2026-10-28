// mec28b · KIT DEL TABLERO para los componentes únicos: los dibujitos de los testigos (trazo SVG, nunca emoji), el testigo que se prende
// con su color, el reloj con aguja de resorte, el auto visto desde arriba con su tapa de nafta, la rueda, el pedal y la pantallita.
import React from "react";
import { AMB, DIM, GRN, ICE, RED, TX, cl } from "./hkit";

export const BLUE = "#4aa8ff";
export const LCOL: Record<string, string> = { red: RED, amber: "#ffb020", green: GRN, blue: BLUE };

// dibujitos de los testigos (viewBox -40..40, trazo)
export const WI: Record<string, string> = {
  pump: "M-22 30 V-24 a6 6 0 0 1 6 -6 h20 a6 6 0 0 1 6 6 V30 M-28 30 h44 M-16 -18 h20 v14 h-20 z M10 -10 l12 6 v24 a5 5 0 0 0 10 0 v-30 l-8 -8",
  tri: "M-12 -12 L12 0 L-12 12 Z",
  oil: "M-34 6 l10 -8 h30 l26 -12 l-16 26 h-40 z M-24 -2 v-8 h8 M30 6 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
  battery: "M-30 -16 h60 v38 h-60 z M-20 -16 v-7 h10 v7 M10 -16 v-7 h10 v7 M-21 2 h12 M10 2 h12 M16 -4 v12",
  brake: "M0 0 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 M-30 -18 q-10 18 0 36 M30 -18 q10 18 0 36 M0 -10 v10 M0 7 v2",
  temp: "M0 -30 v34 M0 4 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M0 -22 h10 M0 -12 h10 M-30 26 q8 -6 15 0 t15 0 t15 0 t15 0",
  engine: "M-26 -10 h40 v8 h8 v-6 h8 v26 h-8 v-6 h-8 v12 h-30 l-10 -10 v-8 h-6 v-8 h6 z M-14 -10 v-8 h18 v8",
  tpms: "M-24 -22 q-10 22 0 44 h48 q10 -22 0 -44 M-24 22 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 M0 -14 v14 M0 6 v3",
  snow: "M0 -30 V30 M-26 -15 L26 15 M-26 15 L26 -15 M-6 -24 L0 -18 L6 -24 M-6 24 L0 18 L6 24",
  leaf: "M-22 24 C-28 -12 4 -28 28 -26 C28 4 6 26 -22 24 Z M-22 24 L12 -8",
  lim: "M-28 14 a30 30 0 0 1 56 0 M0 14 L14 -6 M-34 30 h68",
  abs: "M0 0 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0 M-34 -20 q-10 20 0 40 M34 -20 q10 20 0 40",
  airbag: "M-8 -26 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M-12 -14 l-6 26 h14 l8 14 M8 -2 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0",
  belt: "M-4 -26 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M-10 -14 l-6 30 h16 M-18 -14 L16 22 M-6 26 h20",
  glow: "M-26 0 q6 -12 12 0 t12 0 t12 0 t12 0 M-26 12 h52",
  high: "M-6 -20 a20 20 0 0 1 0 40 a8 20 0 0 1 0 -40 M10 -14 h22 M10 -4 h22 M10 6 h22 M10 16 h22",
  turn: "M-30 0 L-10 -18 V-8 H10 V8 H-10 V18 Z",
  wrench: "M-24 24 L6 -6 M6 -6 a14 14 0 1 0 10 -22 l-8 8 l2 8 l8 2 l8 -8 a14 14 0 0 1 -20 20",
  sun: "M0 0 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M0 -26 v8 M0 18 v8 M-26 0 h8 M18 0 h8 M-18 -18 l6 6 M12 12 l6 6 M18 -18 l-6 6 M-12 12 l-6 6",
};
export const WIcon: React.FC<{ k: string; x: number; y: number; s?: number; col?: string; op?: number; w?: number; fill?: boolean }> = ({ k, x, y, s = 1, col = TX, op = 1, w = 4, fill }) => (
  <svg viewBox="-40 -40 80 80" style={{ position: "absolute", left: x - 40 * s, top: y - 40 * s, width: 80 * s, height: 80 * s, overflow: "visible", opacity: op }}>
    <path d={WI[k] ?? WI.engine} stroke={col} strokeWidth={w} fill={fill ? col : "none"} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
// testigo: casillero negro con el dibujito; on 0..1 lo prende con su color y halo
export const Lamp: React.FC<{ k: string; x: number; y: number; col: string; on: number; s?: number; label?: string }> = ({ k, x, y, col, on, s = 1, label }) => (
  <div style={{ position: "absolute", left: x - 70 * s, top: y - 70 * s, width: 140 * s, height: 140 * s, borderRadius: 26 * s, background: "linear-gradient(180deg,#121316,#0a0a0c)", boxShadow: `0 20px 50px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.06)${on > 0.05 ? `, 0 0 ${70 * on * s}px ${col}66` : ""}` }}>
    <WIcon k={k} x={70 * s} y={70 * s} s={1.25 * s} col={on > 0.05 ? col : "rgba(255,255,255,.14)"} op={0.35 + 0.65 * Math.max(on, 0.0)} w={5} />
    {label && <div style={{ position: "absolute", left: -40, right: -40, top: 150 * s, textAlign: "center", fontWeight: 900, fontSize: 26 * Math.max(0.8, s), letterSpacing: 2, color: on > 0.5 ? col : DIM, whiteSpace: "nowrap" }}>{label}</div>}
  </div>
);
// reloj redondo con marcas y aguja (v 0..1 recorre 270°)
export const Dial: React.FC<{ x: number; y: number; r: number; v: number; n?: number; labels?: string[]; col?: string; glow?: number; children?: React.ReactNode }> = ({ x, y, r, v, n = 10, labels, col = "#ff4a2a", glow = 1, children }) => {
  const ang = (k: number) => Math.PI * 0.75 + k * Math.PI * 1.5;
  return <div style={{ position: "absolute", left: x - r - 30, top: y - r - 30, width: 2 * r + 60, height: 2 * r + 60 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #1b1e22, #0a0b0d 70%)", boxShadow: `0 30px 80px rgba(0,0,0,.65), inset 0 0 0 10px #24272b, inset 0 0 0 12px rgba(255,255,255,.08), 0 0 ${60 * glow}px rgba(120,200,255,${0.12 * glow})` }} />
    <svg viewBox={`${-r - 30} ${-r - 30} ${2 * r + 60} ${2 * r + 60}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {Array.from({ length: n * 2 + 1 }, (_, i) => { const a = ang(i / (n * 2)), big = i % 2 === 0; return <line key={i} x1={Math.cos(a) * r * (big ? 0.8 : 0.88)} y1={Math.sin(a) * r * (big ? 0.8 : 0.88)} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={`rgba(232,238,242,${0.5 + 0.5 * glow})`} strokeWidth={big ? 5 : 2} />; })}
      {labels?.map((l, i) => { const a = ang(i / (labels.length - 1)); return <text key={i} x={Math.cos(a) * r * 0.64} y={Math.sin(a) * r * 0.64 + 9} fill={`rgba(232,238,242,${0.5 + 0.5 * glow})`} fontSize={r * 0.15} fontWeight={800} textAnchor="middle" fontFamily="sans-serif">{l}</text>; })}
      <line x1={-Math.cos(ang(v)) * r * 0.14} y1={-Math.sin(ang(v)) * r * 0.14} x2={Math.cos(ang(v)) * r * 0.86} y2={Math.sin(ang(v)) * r * 0.86} stroke={col} strokeWidth={r * 0.04} strokeLinecap="round" />
      <circle r={r * 0.08} fill="#2a2d31" stroke="#55595e" strokeWidth={3} />
    </svg>
    <div style={{ position: "absolute", left: r + 30, top: r + 30, width: 0, height: 0 }}>{children}</div>
  </div>;
};
// el medidor de combustible con E/F, el surtidor y la FLECHITA (side: -1 izquierda, 1 derecha); ring = círculo rojo que se dibuja
export const FuelDial: React.FC<{ x: number; y: number; r: number; v: number; side?: number; ring?: number; glow?: number; hose?: number }> = ({ x, y, r, v, side = -1, ring = 0, glow = 1, hose }) => (
  <Dial x={x} y={y} r={r} v={v} n={4} labels={["E", "", "1/2", "", "F"]} glow={glow}>
    <WIcon k="pump" x={0} y={r * 0.42} s={r / 170} col={TX} w={4} />
    {hose !== undefined && <WIcon k="pump" x={0} y={r * 0.42} s={r / 170} col={AMB} w={4} op={0} />}
    <svg viewBox="-40 -40 80 80" style={{ position: "absolute", left: (side < 0 ? -r * 0.36 : r * 0.36) - 20 * r / 170, top: r * 0.42 - 20 * r / 170, width: 40 * r / 170, height: 40 * r / 170, overflow: "visible", transform: side < 0 ? "scaleX(-1)" : undefined }}>
      <path d={WI.tri} fill={TX} transform="scale(1.6)" />
      {ring > 0 && <circle r={34} fill="none" stroke={RED} strokeWidth={6} strokeDasharray={214} strokeDashoffset={214 * (1 - cl(ring))} transform="rotate(-90)" />}
    </svg>
  </Dial>
);
// auto visto desde arriba (frente hacia arriba) con la tapa de combustible del lado side (-1 izq / 1 der)
export const CarTop: React.FC<{ x: number; y: number; s?: number; side?: number; door?: number; col?: string; rot?: number }> = ({ x, y, s = 1, side = -1, door = 0, col = "#9aa3ad", rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: `rotate(${rot}deg) scale(${s})` }}>
    <svg viewBox="-100 -200 200 400" style={{ position: "absolute", left: -100, top: -200, width: 200, height: 400, overflow: "visible" }}>
      <rect x={-86} y={-190} width={172} height={380} rx={60} fill={col} stroke="rgba(0,0,0,.4)" strokeWidth={4} />
      <rect x={-70} y={-110} width={140} height={70} rx={18} fill="#1d232a" />
      <rect x={-66} y={60} width={132} height={50} rx={16} fill="#1d232a" />
      <rect x={-74} y={-36} width={148} height={92} rx={14} fill="rgba(255,255,255,.18)" />
      {[[-92, -120], [92, -120], [-92, 110], [92, 110]].map(([a, b], i) => <rect key={i} x={a - 10} y={b - 30} width={20} height={60} rx={6} fill="#141414" />)}
      <rect x={side * 86 - 9} y={80} width={18} height={30} rx={4} fill={door > 0.05 ? AMB : "#6c747d"} stroke={door > 0.05 ? AMB : "none"} strokeWidth={door * 6} />
    </svg>
  </div>
);
// rueda de perfil (gira ang grados), aplastada abajo según low 0..1
export const Wheel: React.FC<{ x: number; y: number; r: number; ang?: number; low?: number; col?: string }> = ({ x, y, r, ang = 0, low = 0, col = "#1a1b1d" }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r * (1 - 0.12 * low), marginTop: 2 * r * 0.12 * low, borderRadius: `50% 50% ${50 - 18 * low}% ${50 - 18 * low}%`, background: `radial-gradient(circle, #bfc5cc 0 ${r * 0.42}px, #3a3d42 ${r * 0.44}px ${r * 0.6}px, ${col} ${r * 0.62}px)`, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
    <svg viewBox="-50 -50 100 100" style={{ position: "absolute", inset: 0, transform: `rotate(${ang}deg)` }}>
      {[0, 72, 144, 216, 288].map((a) => <line key={a} x1={0} y1={0} x2={Math.cos(a * Math.PI / 180) * 20} y2={Math.sin(a * Math.PI / 180) * 20} stroke="#8a9198" strokeWidth={6} strokeLinecap="round" />)}
      <circle r={6} fill="#5a6066" />
      {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 48} y2={Math.sin(a) * 48} stroke="#2a2c30" strokeWidth={3} />; })}
    </svg>
  </div>
);
// pantallita del tablero (LCD azulado)
export const Screen: React.FC<{ x: number; y: number; w: number; h: number; title: string; val: string; glow?: number; col?: string }> = ({ x, y, w, h, title, val, glow = 1, col = "#9fd8ff" }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 22, background: "linear-gradient(180deg,#0d141c,#070b10)", boxShadow: `0 30px 70px rgba(0,0,0,.6), inset 0 0 0 3px #22303d, 0 0 ${50 * glow}px rgba(120,200,255,${0.15 * glow})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: col, opacity: 0.4 + 0.6 * glow }}>
    <div style={{ fontWeight: 800, fontSize: h * 0.16, letterSpacing: 6 }}>{title}</div>
    <div style={{ fontWeight: 900, fontSize: h * 0.36, fontFamily: "monospace", whiteSpace: "nowrap" }}>{val}</div>
  </div>
);
// el pedal del acelerador de costado (press 0..1)
export const Pedal: React.FC<{ x: number; y: number; press: number; s?: number }> = ({ x, y, press, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: `scale(${s})` }}>
    <div style={{ position: "absolute", left: -10, top: -260, width: 20, height: 200, background: "linear-gradient(90deg,#3a3d42,#6a7076,#3a3d42)", borderRadius: 8, transformOrigin: "50% 0", transform: `rotate(${18 + 30 * press}deg)` }}>
      <div style={{ position: "absolute", left: -50, top: 180, width: 120, height: 46, borderRadius: 12, background: "linear-gradient(180deg,#2a2c30,#141518)", boxShadow: "0 10px 30px rgba(0,0,0,.6)" }} />
    </div>
  </div>
);
export { AMB, DIM, GRN, ICE, RED, TX };
