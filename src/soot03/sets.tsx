import React from "react";
import { AbsoluteFill } from "remotion";

// SETS ILUSTRADOS para los planos (en vez de un degradé liso): una sala romana con luz.
// Pared de piedra con bloques, ventana en arco con cielo, haz de luz con polvo que flota, lámpara de aceite
// que titila con su halo, estante con rollos y ánforas, piso de baldosas en perspectiva y viñeta suave.
type Tono = "violeta" | "calido" | "rosa" | "noche" | "piedra";
const TONOS: Record<Tono, { pared: [string, string]; piso: [string, string]; cielo: [string, string]; luz: string }> = {
  violeta: { pared: ["#5b45a8", "#2a1e5a"], piso: ["#3a2a6a", "#1b1240"], cielo: ["#ffd9a0", "#ff9a6a"], luz: "255,226,170" },
  calido: { pared: ["#e0a25a", "#a8622c"], piso: ["#8a4a20", "#5a2a10"], cielo: ["#bfe6ff", "#7fc0f0"], luz: "255,244,210" },
  rosa: { pared: ["#e88aa8", "#9a3a62"], piso: ["#7a2a4a", "#4a1030"], cielo: ["#fff0c0", "#ffc070"], luz: "255,236,200" },
  noche: { pared: ["#2e2a5a", "#141030"], piso: ["#1e1a40", "#0a0818"], cielo: ["#3a4a8a", "#1b2250"], luz: "190,210,255" },
  piedra: { pared: ["#b9a98e", "#7a6a52"], piso: ["#6b5a40", "#3a2e20"], cielo: ["#cfe8f8", "#8ec4e8"], luz: "255,246,220" },
};

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const Sala: React.FC<{ t: number; tono?: Tono; ventana?: "der" | "izq"; lampara?: boolean; estante?: boolean }> = ({ t, tono = "violeta", ventana = "der", lampara = true, estante = true }) => {
  const P = TONOS[tono];
  const vx = ventana === "der" ? 1480 : 180, vw = 280, vy = 150, vh = 380;
  const pulso = 0.85 + 0.15 * Math.sin(t * 0.9);
  // haz de luz: de la ventana al piso, inclinado hacia el centro
  const dir = ventana === "der" ? -1 : 1;
  const hx0 = vx, hx1 = vx + vw, fx0 = vx + dir * 520 - 40, fx1 = vx + vw + dir * 520 + 120;
  const sx = ventana === "der" ? 90 : 1430, lx = sx + 340, ly = 336;
  const llama = 1 + 0.12 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29 + 1);
  return (
    <AbsoluteFill>
      {/* pared */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${P.pared[1]}, ${P.pared[0]} 70%)` }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => {
          const x = c * 240 - (r % 2) * 120, y = r * 96;
          return <rect key={r + "-" + c} x={x + 4} y={y + 4} width={232} height={88} rx={10} fill="#fff" opacity={0.035 + rnd(r * 9 + c) * 0.045} />;
        }))}
        {/* zócalo */}
        <rect x={0} y={800} width={1920} height={40} fill="#000" opacity={0.18} />
      </svg>
      {/* ventana en arco con cielo y nubecita */}
      <div style={{ position: "absolute", left: vx - 22, top: vy - 22, width: vw + 44, height: vh + 44, borderRadius: `${(vw + 44) / 2}px ${(vw + 44) / 2}px 12px 12px`, background: "rgba(0,0,0,.28)" }} />
      <div style={{ position: "absolute", left: vx, top: vy, width: vw, height: vh, borderRadius: `${vw / 2}px ${vw / 2}px 6px 6px`, overflow: "hidden", background: `linear-gradient(180deg, ${P.cielo[1]}, ${P.cielo[0]})` }}>
        <div style={{ position: "absolute", left: ((t * 14) % (vw + 200)) - 160, top: 120, width: 150, height: 46, borderRadius: 30, background: "rgba(255,255,255,.75)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "rgba(60,90,50,.55)", borderRadius: "60% 40% 0 0" }} />
        <div style={{ position: "absolute", left: vw / 2 - 6, top: 0, bottom: 0, width: 12, background: "rgba(40,25,15,.75)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: vh * 0.55, height: 12, background: "rgba(40,25,15,.75)" }} />
      </div>
      {/* haz de luz + polvo */}
      <svg style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }} width={1920} height={1080}>
        <defs>
          <linearGradient id="haz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`rgb(${P.luz})`} stopOpacity={0.34 * pulso} />
            <stop offset="1" stopColor={`rgb(${P.luz})`} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <polygon points={`${hx0},${vy + 60} ${hx1},${vy + 60} ${fx1},1080 ${fx0},1080`} fill="url(#haz)" />
        {Array.from({ length: 26 }, (_, i) => {
          const k = (rnd(i) + t * (0.02 + rnd(i + 50) * 0.03)) % 1;
          const y = vy + 80 + k * 880, a = (y - vy) / (1080 - vy);
          const xa = hx0 + (fx0 - hx0) * a, xb = hx1 + (fx1 - hx1) * a;
          const x = xa + (xb - xa) * rnd(i + 9) + Math.sin(t * 0.7 + i) * 14;
          return <circle key={i} cx={x} cy={y} r={2 + rnd(i + 3) * 3} fill={`rgb(${P.luz})`} opacity={0.5 * Math.sin(Math.PI * k)} />;
        })}
      </svg>
      {/* estante con rollos y ánforas */}
      {estante && (
        <div style={{ position: "absolute", left: sx, top: 250, width: 400, height: 0 }}>
          <div style={{ position: "absolute", left: 0, top: 120, width: 400, height: 22, background: "#6b4a2f", borderRadius: 6, boxShadow: "0 10px 0 rgba(0,0,0,.25)" }} />
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 110 + i * 62, top: 70, width: 54, height: 50, borderRadius: "50%", background: "#f2e2c0", border: "5px solid #b89a6a" }} />)}
          <svg style={{ position: "absolute", left: 0, top: 20, overflow: "visible" }} width={120} height={100}>
            <path d="M 30 0 L 50 0 L 52 14 Q 80 30 72 70 Q 64 100 40 100 Q 16 100 8 70 Q 0 30 28 14 Z" fill="#c9773a" stroke="#7a3f18" strokeWidth={5} />
            <path d="M 14 50 L 66 50" stroke="#7a3f18" strokeWidth={5} />
          </svg>
        </div>
      )}
      {/* lámpara de aceite con halo que titila */}
      {lampara && (
        <>
          <div style={{ position: "absolute", left: lx - 260, top: ly - 300, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,110,.38), rgba(255,170,80,0) 65%)", transform: `scale(${0.94 + 0.06 * llama})`, mixBlendMode: "screen" }} />
                    <svg style={{ position: "absolute", left: lx - 70, top: ly - 40, overflow: "visible" }} width={140} height={80}>
            <path d="M 10 50 Q 70 90 130 50 L 120 40 Q 70 60 20 40 Z" fill="#c9a23d" stroke="#7a5a18" strokeWidth={5} />
            <path d={`M 112 40 Q ${108 + 6 * Math.sin(t * 11)} ${40 - 34 * llama} 118 ${40 - 46 * llama} Q ${128 + 4 * Math.sin(t * 13)} ${40 - 26 * llama} 122 40 Z`} fill="#ffb347" />
            <path d={`M 115 40 Q 114 ${40 - 18 * llama} 118 ${40 - 26 * llama} Q 122 ${40 - 14 * llama} 120 40 Z`} fill="#fff3b0" />
          </svg>
        </>
      )}
      {/* piso de baldosas en perspectiva */}
      <svg style={{ position: "absolute", left: 0, top: 840 }} width={1920} height={240}>
        <defs>
          <linearGradient id="piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.piso[0]} /><stop offset="1" stopColor={P.piso[1]} /></linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={240} fill="url(#piso)" />
        {Array.from({ length: 17 }, (_, i) => <line key={i} x1={960 + (i - 8) * 150} y1={0} x2={960 + (i - 8) * 330} y2={240} stroke="#000" strokeOpacity={0.14} strokeWidth={4} />)}
        {[40, 100, 175].map((y, i) => <line key={"h" + i} x1={0} y1={y} x2={1920} y2={y} stroke="#000" strokeOpacity={0.12} strokeWidth={4} />)}
      </svg>
      {/* viñeta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,5,25,.38) 100%)" }} />
    </AbsoluteFill>
  );
};
