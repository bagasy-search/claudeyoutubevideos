import React from "react";
import { AbsoluteFill } from "remotion";
import { C, prog, ent, Chip } from "./kit";
import { Mula } from "./kit2";
import { Actua, Carro, Picto, AUX, gesto } from "./kit3";
import { Persona, CIVIL, CENTURION } from "./persona";
import { Sala } from "./sets";
import { Exterior } from "./escenas4";

// VUELTA 5: escenas re-animadas en plano medio (las que el director dejó en 5).

// almena en primer plano (estás arriba del muro): parapeto que cruza abajo
const Parapeto: React.FC<{ y?: number }> = ({ y = 930 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    <rect x={-20} y={y} width={1960} height={1100 - y} fill="#b9ad98" stroke="#6a5e4a" strokeWidth={6} />
    {Array.from({ length: 11 }, (_, i) => <rect key={i} x={i * 190} y={y - 50} width={120} height={60} rx={6} fill="#b9ad98" stroke="#6a5e4a" strokeWidth={6} />)}
    <rect x={-20} y={y} width={1960} height={18} fill="#d8ccb6" />
  </svg>
);

// 0:58 · «fue el primero en construir un muro…» — Adriano traza la línea con la vara y el muro se levanta detrás
export const Adriano: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const k = prog(t, t0 + 0.3, t1);
  const punta = 360 + 1150 * k;
  const hx = punta - 60;
  return (
    <Exterior t={t} tono="dia" horizonte={600}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <line x1={300} y1={905} x2={punta} y2={905} stroke="#7a4a22" strokeWidth={10} strokeDasharray="30 18" />
        {Array.from({ length: 17 }, (_, i) => {
          const x = 120 + i * 104;
          if (x > punta - 150) return null;
          const e = Math.min(1, (punta - 150 - x) / 200), hh = 300 * e;
          return <g key={i}><rect x={x} y={900 - hh} width={102} height={hh} fill="#d8c8ae" stroke="#8a7a64" strokeWidth={5} />{e > 0.9 && i % 2 === 0 && <rect x={x + 14} y={900 - hh - 56} width={74} height={58} rx={5} fill="#d8c8ae" stroke="#8a7a64" strokeWidth={5} />}<line x1={x} y1={900 - hh * 0.5} x2={x + 102} y2={900 - hh * 0.5} stroke="#8a7a64" strokeWidth={3} />{e > 0 && e < 1 && [0, 1, 2].map((j) => <circle key={j} cx={x + 20 + j * 30} cy={900 - hh - 10 - j * 8} r={26 - j * 5} fill="#e8dcc6" opacity={0.8 * (1 - e)} />)}</g>;
        })}
      </svg>
      <Actua t={t} beats={[[t0, "camina"], [t0 + 0.6, "señala"], [t0 + 1.6, "habla"]]} x0={hx} x1={hx} y={1010} h={540} casco={false} quien={48} ropa={{ ...CIVIL(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        <line x1={hx + 120} y1={640} x2={punta} y2={905} stroke="#6b4a2f" strokeWidth={12} strokeLinecap="round" />
        {[0, 1, 2].map((i) => { const q = ((t * 3 + i / 3) % 1); return <circle key={i} cx={punta - q * 60} cy={900 - q * 30} r={8 + q * 10} fill="#c9a36a" opacity={0.7 * (1 - q)} />; })}
      </svg>
    </Exterior>
  );
};

// 3:50 · «en el muro, a nadie le importa» — tres en pantalones en la almena, el centurión ni los mira
export const NadieCuida: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => (
  <Exterior t={t} tono="gris" viento={1.6}>
    <Actua t={t} beats={[[t0, "festeja"], [t0 + 1.2, "habla"]]} x0={420} x1={420} y={935} h={500} frio />
    {[0, 1].map((i) => <Persona key={i} x={820 + i * 300} y={935} h={430 - i * 30} t={t} seed={150 + i} ropa={AUX(i + 1)} casco="legion" malla pantalon={["#5a4a3a", "#3a4a5a"][i]} capa={["#7a3a2a", "#2a4a6a"][i]} bD={140 + Math.sin(t * 5 + i) * 20} cD={40} expr="feliz" habla={i === 0} />)}
    <Persona x={1600} y={935} h={520} t={t} seed={160} ropa={CENTURION} casco="centurion" {...gesto(t, [[t0, "niega"], [t0 + 0.9, "encoge"], [t0 + 2.4, "niega"]])} mira={0.9} />
    <Parapeto />
    {t > t0 + 0.6 && <Chip t={t} t0={t0 + 0.6} text="TROUSERS: 3 · COMPLAINTS: 0" color="#2a2350" x={1000} y={330} centro size={50} />}
  </Exterior>
);

// 6:48 · «todo eso sube por caminos largos, en carros, bajo la lluvia, pasando gente a la que le encantaría robarlo»
export const CaminoLluvia: React.FC<{ t: number; t0: number; tLadron: number }> = ({ t, t0, tLadron }) => (
  <Exterior t={t} tono="gris" viento={1.8} horizonte={560}>
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
      <rect x={0} y={660} width={1920} height={420} fill="#6f8f45" /><path d="M 640 660 L 1080 660 L 1780 1080 L 220 1080 Z" fill="#8a6a4a" /><path d="M 800 660 L 560 1080 M 920 660 L 1300 1080" stroke="#6a4e34" strokeWidth={10} fill="none" />
      {[[900, 820, 200], [1100, 980, 260], [760, 700, 90]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.26} fill="#5a4a3a" opacity={0.75} />)}
      {[[200, 760], [1660, 720], [1840, 860]].map(([x, y], i) => <g key={i}>{[0, 1, 2].map((j) => <circle key={j} cx={x + j * 70 - 70} cy={y - (j % 2) * 30} r={80} fill={["#3f6a2a", "#4f7a34", "#355a24"][j]} />)}</g>)}
    </svg>
    {t < tLadron && [[200, 740], [1660, 700], [1840, 840]].map(([x, y], i) => { const p = Math.sin(t * 1.4 + i * 2) > -0.6 ? 1 : 0.1; return <div key={"oj" + i} style={{ position: "absolute", left: x - 40, top: y - 10, opacity: p }}>{[0, 1].map((j) => <div key={j} style={{ position: "absolute", left: j * 44, top: 0, width: 30, height: 18, borderRadius: "50%", background: "#fff36a", boxShadow: "0 0 18px #fff36a" }} />)}</div>; })}
    {t > tLadron - 0.2 && [0, 1, 2].map((i) => <Picto key={i} x={[180, 1640, 1820][i]} y={[700, 660, 800][i]} s={1.25} t={t} seed={70 + i} sube={tLadron + i * 0.18} />)}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(${-3 + Math.sin(t * 6) * 1.5}deg)`, transformOrigin: "900px 880px" }}>
      <Carro x={900} y={820} s={1.1} t={t * 0.15} carga="barril" />
    </div>
    <Mula x={1330} y={760} s={0.85} t={t} camina={0.6} />
    <Actua t={t} beats={[[t0, "carga"], [t0 + 1.5, "golpea"], [t0 + 2.6, "carga"], [tLadron + 0.4, "miedo"]]} x0={660} x1={720} y={1000} h={480} quien={4} />
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: 80 }, (_, i) => { const k = (t * 1.9 * (0.7 + (i % 5) * 0.12) + i * 0.137) % 1, y = k * 1260 - 140, x = ((i * 157) % 2300) - 200 - 0.45 * y; return <line key={i} x1={x} y1={y} x2={x + 22} y2={y - 50} stroke="#e6eeff" strokeWidth={4} strokeLinecap="round" opacity={0.55} />; })}
    </svg>
  </Exterior>
);

// 7:50 · «¿quién cruza? ¿qué lleva? ¿paga el peaje?» — la mesa de la aduana en el portón, cara a cara
export const Aduana: React.FC<{ t: number; t0: number; tQue: number; tPeaje: number }> = ({ t, t0, tQue, tPeaje }) => (
  <AbsoluteFill>
    <Sala t={t} tono="piedra" ventana="der" estante={false} lampara={false} />
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
      <path d="M 620 840 L 620 420 Q 960 200 1300 420 L 1300 840 Z" fill="#cfe2ee" />
      <rect x={620} y={700} width={680} height={140} fill="#7fa05a" />
      <path d="M 620 840 L 620 420 Q 960 200 1300 420 L 1300 840" stroke="#6a5e4a" strokeWidth={24} fill="none" />
    </svg>
    {[0, 1, 2, 3].map((i) => <Persona key={i} x={760 + i * 130 - 90 * prog(t, tQue + 0.3, tQue + 1.5) - 90 * prog(t, tPeaje + 0.6, tPeaje + 1.8)} y={800} h={190} t={t} seed={170 + i} ropa={CIVIL(i + 1)} flip expr={i % 2 ? "triste" : "neutro"} habla={i === 1} />)}
    <div style={{ position: "absolute", left: 300, top: 760, width: 760, height: 60, borderRadius: 10, background: "#8a5a2a", boxShadow: "0 16px 0 rgba(0,0,0,.25)" }} />
    <div style={{ position: "absolute", left: 340, top: 820, width: 30, height: 200, background: "#6b4a2f" }} />
    <div style={{ position: "absolute", left: 990, top: 820, width: 30, height: 200, background: "#6b4a2f" }} />
    <div style={{ position: "absolute", left: 640, top: 726, width: 180, height: 40, borderRadius: 6, background: "#d9b878", border: "4px solid #8a6a3a", transform: `rotate(${-4 + Math.sin(t * 3) * 2}deg)` }} />
    {t > tPeaje && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 900 + i * 34, top: 724 - 120 * (1 - ent(t, tPeaje + i * 0.15)), width: 36, height: 36, borderRadius: "50%", background: "#f2c23a", border: "4px solid #a8782a" }} />)}
    <Actua t={t} beats={[[t0, "escribe"], [t0 + 0.6, "habla"], [tQue, "señala"], [tPeaje, "enojado"]]} x0={380} x1={380} y={1040} h={540} frio />
    <Actua t={t} beats={[[t0, "habla"], [tQue + 0.3, "niega"], [tPeaje + 0.5, "triste"]]} x0={1380} x1={1380} y={1040} h={520} quien={3} casco={false} ropa={{ ...CIVIL(5), tunica: "#c9a23d", tunica2: "#8f7025" }} vuelta={t0} />
    <Mula x={1720} y={830} s={0.8} t={t} carga />
  </AbsoluteFill>
);
