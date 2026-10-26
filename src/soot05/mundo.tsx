import React from "react";
import { rnd } from "../soot/lib";
import { C, fontFamily } from "./kit";

// Mundo único de soot05: Londres medieval en CORTE TRANSVERSAL (casa de muñecas) por donde viaja una sola cámara.
// De izquierda a derecha: panadería → puerta de Newgate + cárcel (oficina del carcelero, lado de los que pagan, sala
// común, sótano duro, el pozo) → tribunal → Ludgate y la reja de la Fleet → Támesis con el Savoy y la Torre →
// camino al norte → St Andrews con la mazmorra botella. Coordenadas de mundo en px a zoom 1; el suelo está en Y = SUELO.
export const SUELO = 2000;
export const ANCHO = 20400;

// ── lugares del mundo (para la cámara y los actores)
export const L = {
  panaderia: { x: 500, y: SUELO },
  puerta: { x: 1500, y: SUELO },
  oficina: { x: 2450, y: SUELO }, // oficina del carcelero (planta baja)
  arriba: { x: 2650, y: SUELO - 640 }, // lado de los que pagan (1er piso)
  comun: { x: 3650, y: SUELO }, // sala común (planta baja)
  rejaN: { x: 4400, y: SUELO }, // reja de Newgate a la calle
  duro: { x: 2700, y: SUELO + 640 }, // celda dura (sótano)
  pozo: { x: 3820, y: SUELO + 1450 }, // fondo del pozo
  tribunal: { x: 5950, y: SUELO },
  ludgate: { x: 7900, y: SUELO },
  fleet: { x: 9000, y: SUELO },
  savoy: { x: 10800, y: SUELO },
  torre: { x: 13400, y: SUELO },
  little: { x: 13100, y: SUELO + 160 },
  norte: { x: 16300, y: SUELO },
  standrews: { x: 19100, y: SUELO },
  botella: { x: 19100, y: SUELO + 1250 },
};

const SVG: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; op?: number }> = ({ x, y, w, h, children, op = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: op }} width={w} height={h}>{children}</svg>
);

// ── piezas
const PIEDRA = { a: "#6a5fa0", b: "#574c8a", c: "#463c74", jun: "#3a3062" };
const Bloques: React.FC<{ w: number; h: number; seed: number; col?: string; jun?: string; bw?: number; bh?: number }> = ({ w, h, seed, col = PIEDRA.a, jun = PIEDRA.jun, bw = 120, bh = 60 }) => {
  const r = rnd(seed);
  const out: React.ReactNode[] = [<rect key="f" x={0} y={0} width={w} height={h} fill={col} />];
  for (let j = 0; j * bh < h; j++)
    for (let i = -1; i * bw < w; i++) {
      const x = i * bw + (j % 2 ? bw / 2 : 0);
      const k = r();
      out.push(<rect key={`${i}-${j}`} x={x + 3} y={j * bh + 3} width={bw - 6} height={bh - 6} rx={6} fill={k < 0.2 ? "rgba(255,255,255,.07)" : k > 0.85 ? "rgba(0,0,0,.12)" : "none"} stroke={jun} strokeWidth={3} opacity={0.7} />);
    }
  return <g>{out}</g>;
};

export const Antorcha: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number }> = ({ x, y, t, s = 1, seed = 1 }) => {
  const f = 1 + Math.sin(t * 13 + seed) * 0.08 + Math.sin(t * 7.1 + seed * 2) * 0.06;
  return (
    <SVG x={x - 200 * s} y={y - 260 * s} w={400 * s} h={400 * s}>
      <g transform={`scale(${s})`}>
        <circle cx={200} cy={150} r={170 * f} fill="url(#glowT)" />
        <rect x={192} y={170} width={16} height={90} rx={4} fill="#5a3418" />
        <rect x={182} y={160} width={36} height={22} rx={6} fill="#8a5a2a" />
        <path d={`M 200 ${168 - 70 * f} Q ${230 + Math.sin(t * 9 + seed) * 6} 140 214 166 Q 200 176 186 166 Q ${170 - Math.sin(t * 8 + seed) * 6} 140 200 ${168 - 70 * f} Z`} fill="#ff9a2e" />
        <path d={`M 200 ${168 - 40 * f} Q 214 150 207 166 Q 200 170 193 166 Q 186 150 200 ${168 - 40 * f} Z`} fill="#ffe27a" />
      </g>
    </SVG>
  );
};

const Defs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <radialGradient id="glowT"><stop offset="0" stopColor="#ffb347" stopOpacity={0.55} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
      <radialGradient id="glowV"><stop offset="0" stopColor="#ffe9a0" stopOpacity={0.6} /><stop offset="1" stopColor="#ffe9a0" stopOpacity={0} /></radialGradient>
      <linearGradient id="tierra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a3428" /><stop offset="1" stopColor="#24121c" /></linearGradient>
      <linearGradient id="interior" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2c66" /><stop offset="1" stopColor="#24183f" /></linearGradient>
      <linearGradient id="sotano" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1f45" /><stop offset="1" stopColor="#140d24" /></linearGradient>
      <linearGradient id="rio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2ec4d6" /><stop offset="1" stopColor="#1a5a8a" /></linearGradient>
      <linearGradient id="dorado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe08a" /><stop offset="1" stopColor="#e8a23a" /></linearGradient>
      <linearGradient id="techo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8344a" /><stop offset="1" stopColor="#9e1f35" /></linearGradient>
    </defs>
  </svg>
);

// cuarto en corte: pared del fondo + piso + vigas; `luz` = cálido
const Sala: React.FC<{ x: number; y: number; w: number; h: number; seed: number; fondo?: string; piso?: string; luz?: number }> = ({ x, y, w, h, seed, fondo = "url(#interior)", piso = "#3b2a2a", luz = 0 }) => (
  <SVG x={x} y={y} w={w} h={h}>
    <rect x={0} y={0} width={w} height={h} fill={fondo} />
    <g opacity={0.35}><Bloques w={w} h={h - 40} seed={seed} col="none" jun="#1a1230" bw={140} bh={70} /></g>
    {luz > 0 && <ellipse cx={w / 2} cy={h * 0.45} rx={w * 0.6} ry={h * 0.7} fill="url(#glowV)" opacity={luz} />}
    <rect x={0} y={h - 40} width={w} height={40} fill={piso} />
    <rect x={0} y={h - 40} width={w} height={6} fill="rgba(255,255,255,.1)" />
  </SVG>
);

const Rata: React.FC<{ t: number; x0: number; x1: number; y: number; vel?: number; seed?: number }> = ({ t, x0, x1, y, vel = 260, seed = 1 }) => {
  const L = x1 - x0;
  const per = (2 * L) / vel + 3;
  const k = ((t + seed * 3.7) % per) / per;
  const ida = k < 0.5;
  const u = ida ? k * 2 : (1 - k) * 2;
  const x = x0 + L * Math.min(1, u * 1.2);
  const hop = Math.abs(Math.sin(t * 22 + seed)) * 6;
  return (
    <SVG x={x - 40} y={y - 40 - hop} w={80} h={40}>
      <g transform={`translate(40 30) scale(${ida ? 1 : -1} 1)`}>
        <path d="M -30 0 Q -60 -4 -70 6" stroke="#9a8aa0" strokeWidth={4} fill="none" />
        <ellipse cx={0} cy={-6} rx={30} ry={14} fill="#7b6d86" />
        <circle cx={26} cy={-12} r={10} fill="#7b6d86" />
        <circle cx={22} cy={-22} r={6} fill="#c9a0b0" />
        <circle cx={32} cy={-14} r={2.5} fill="#1b1240" />
      </g>
    </SVG>
  );
};

const Gotera: React.FC<{ t: number; x: number; y: number; h: number; seed?: number }> = ({ t, x, y, h, seed = 1 }) => {
  const per = 1.6 + (seed % 3) * 0.4;
  const k = ((t + seed) % per) / per;
  const yy = k < 0.4 ? 0 : ((k - 0.4) / 0.6) ** 2 * h;
  return (
    <SVG x={x - 10} y={y} w={20} h={h + 20}>
      <path d={`M 10 ${yy} q 7 12 0 16 q -7 -4 0 -16 Z`} fill="#8fe3f0" opacity={0.85} />
      {k > 0.95 && <ellipse cx={10} cy={h + 8} rx={14} ry={4} fill="none" stroke="#8fe3f0" strokeWidth={3} />}
    </SVG>
  );
};

const Moscas: React.FC<{ t: number; x: number; y: number; n?: number; r?: number }> = ({ t, x, y, n = 6, r = 60 }) => (
  <SVG x={x - r * 2} y={y - r * 2} w={r * 4} h={r * 4}>
    {Array.from({ length: n }, (_, i) => {
      const a = t * (4 + i) + i * 2;
      return <circle key={i} cx={r * 2 + Math.cos(a) * r * (0.5 + 0.5 * Math.sin(i + t))} cy={r * 2 + Math.sin(a * 1.3) * r * 0.6} r={4} fill="#1b1240" />;
    })}
  </SVG>
);

const Paja: React.FC<{ x: number; y: number; w: number; seed: number }> = ({ x, y, w, seed }) => {
  const r = rnd(seed);
  return (
    <SVG x={x} y={y - 30} w={w} h={40}>
      <path d={`M 0 30 Q ${w / 2} 0 ${w} 30 Z`} fill="#c9a23a" opacity={0.85} />
      {Array.from({ length: Math.floor(w / 14) }, (_, i) => {
        const xx = i * 14 + r() * 10;
        return <line key={i} x1={xx} y1={30} x2={xx + (r() - 0.5) * 30} y2={14 + r() * 10} stroke="#e8c25a" strokeWidth={3} />;
      })}
    </SVG>
  );
};

// grillete colgado de la pared (con etiqueta de precio)
export const Grillete: React.FC<{ x: number; y: number; s?: number; precio?: string; peso?: number }> = ({ x, y, s = 1, precio, peso = 1 }) => (
  <SVG x={x - 60 * s} y={y} w={120 * s} h={260 * s}>
    <g transform={`scale(${s})`}>
      <circle cx={60} cy={8} r={8} fill="#2a2440" />
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={60} cy={30 + i * 30} rx={i % 2 ? 6 : 12} ry={16} fill="none" stroke="#b9c2cf" strokeWidth={7 * peso} />)}
      <path d="M 30 150 A 30 30 0 1 0 90 150" fill="none" stroke="#c8ccd4" strokeWidth={14 * peso} />
      <rect x={24} y={142} width={72} height={16} rx={5} fill="#8b93a3" />
      {precio && (
        <g transform="translate(70 180) rotate(12)">
          <line x1={-10} y1={-40} x2={0} y2={0} stroke="#d8c08a" strokeWidth={3} />
          <rect x={-30} y={0} width={70} height={40} rx={6} fill="#f6e3b4" />
          <text x={5} y={29} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={24} fill="#a8241f">{precio}</text>
        </g>
      )}
    </g>
  </SVG>
);

const Cartel: React.FC<{ x: number; y: number; txt: string; w?: number; col?: string; tinta?: string; size?: number }> = ({ x, y, txt, w = 360, col = "#f6e3b4", tinta = "#6b2a14", size = 46 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", fontFamily, fontWeight: 700, fontSize: size, color: tinta, background: col, borderRadius: 14, padding: "6px 0", boxShadow: "0 8px 0 rgba(20,10,40,.35)", border: "4px solid rgba(0,0,0,.15)" }}>{txt}</div>
);

// ── edificios
const Panaderia: React.FC<{ t: number }> = ({ t }) => (
  <>
    <SVG x={-300} y={SUELO - 900} w={1100} h={900}>
      <rect x={60} y={260} width={760} height={640} fill="#f0c79a" />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={60} y1={300 + i * 150} x2={820} y2={300 + i * 150} stroke="#a8622a" strokeWidth={18} />)}
      {[0, 1, 2].map((i) => <line key={i} x1={100 + i * 340} y1={260} x2={100 + i * 340} y2={900} stroke="#a8622a" strokeWidth={18} />)}
      <path d="M 20 280 L 440 40 L 860 280 Z" fill="url(#techo)" />
      <rect x={600} y={80} width={70} height={160} fill="#7a4a3a" />
      {[0, 1, 2].map((i) => <circle key={i} cx={635 + Math.sin(t * 1.3 + i) * 20} cy={60 - ((t * 40 + i * 50) % 150)} r={26 + ((t * 40 + i * 50) % 150) * 0.15} fill="#cfc4d8" opacity={0.6 - ((t * 40 + i * 50) % 150) / 300} />)}
      <rect x={180} y={560} width={420} height={260} rx={10} fill="#5a3418" />
      <rect x={200} y={580} width={380} height={200} fill="#ffcf7a" />
      <ellipse cx={390} cy={680} rx={160} ry={70} fill="url(#glowV)" />
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={260 + i * 90} cy={740} rx={40} ry={24} fill="#d98a35" stroke="#a8621f" strokeWidth={5} />)}
      <rect x={160} y={800} width={460} height={30} fill="#8a5a2a" />
    </SVG>
    <Cartel x={140} y={SUELO - 760} txt="BAKER" w={260} col={C.oro} tinta="#5a2a08" />
  </>
);

const MuroCiudad: React.FC<{ x0: number; x1: number }> = ({ x0, x1 }) => (
  <SVG x={x0} y={SUELO - 620} w={x1 - x0} h={620}>
    <Bloques w={x1 - x0} h={620} seed={11} col={PIEDRA.b} />
    {Array.from({ length: Math.ceil((x1 - x0) / 140) }, (_, i) => <rect key={i} x={i * 140} y={-60} width={80} height={70} fill={PIEDRA.b} stroke={PIEDRA.jun} strokeWidth={3} />)}
  </SVG>
);

const Newgate: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* torre de la puerta: dos torres y el arco por donde pasa la calle */}
    <SVG x={900} y={SUELO - 1500} w={1100} h={1500}>
      <Bloques w={1100} h={1500} seed={21} col={PIEDRA.a} />
      <rect x={0} y={0} width={260} height={1500} fill="rgba(0,0,0,.12)" />
      <rect x={840} y={0} width={260} height={1500} fill="rgba(0,0,0,.12)" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 140} y={-70} width={84} height={76} fill={PIEDRA.a} stroke={PIEDRA.jun} strokeWidth={3} />)}
      <path d="M 330 1500 L 330 1040 A 220 220 0 0 1 770 1040 L 770 1500 Z" fill="#160e2a" />
      {/* rastrillo */}
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={370 + i * 72} y1={830} x2={370 + i * 72} y2={980} stroke="#2a2440" strokeWidth={10} />)}
      <rect x={340} y={600} width={420} height={140} rx={16} fill="#2a1f45" />
      <text x={550} y={694} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={82} fill={C.oro} letterSpacing={6}>NEWGATE</text>
      {[200, 900].map((xx) => <rect key={xx} x={xx - 30} y={300} width={60} height={130} rx={30} fill="#ffcf7a" opacity={0.85} />)}
    </SVG>
    {/* cuerpo de la cárcel, en corte: muros exteriores */}
    <SVG x={2000} y={SUELO - 1460} w={2480} h={1460}>
      <rect x={0} y={0} width={2480} height={1460} fill={PIEDRA.c} />
      <path d="M -40 120 L 1240 -260 L 2520 120 Z" fill="#3a3062" />
      <rect x={-40} y={100} width={2560} height={40} fill="#2a2248" />
    </SVG>
    {/* 1er piso: lado de los que pagan (cálido) */}
    <Sala x={2040} y={SUELO - 1260} w={1260} h={600} seed={31} luz={0.7} piso="#6b3a1f" />
    {/* 1er piso derecha: depósito de grilletes y la tabla de precios de hierro */}
    <Sala x={3320} y={SUELO - 1260} w={1120} h={600} seed={32} piso="#3b2a2a" />
    {/* planta baja: oficina del carcelero */}
    <Sala x={2040} y={SUELO - 620} w={860} h={620} seed={33} luz={0.5} piso="#5a3418" />
    {/* planta baja: sala común */}
    <Sala x={2920} y={SUELO - 620} w={1520} h={620} seed={34} piso="#3b2a2a" />
    {/* tabla de honorarios del carcelero */}
    <SVG x={2090} y={SUELO - 560} w={330} h={380}>
      <rect x={0} y={0} width={330} height={380} rx={10} fill="#f6e3b4" stroke="#8a5a2a" strokeWidth={10} />
      <text x={165} y={62} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={50} fill="#a8241f">FEES</text>
      {["ENTRY", "BED", "FOOD", "COAL", "WATER", "CANDLE"].map((k, i) => (
        <g key={k}><text x={28} y={112 + i * 44} fontFamily={fontFamily} fontWeight={600} fontSize={30} fill="#5a2a08">{k}</text><text x={300} y={112 + i * 44} textAnchor="end" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#a8241f">{["4d", "2d", "3d", "1d", "1d", "1d"][i]}</text></g>
      ))}
    </SVG>
    {/* escritorio, libro y cofre */}
    <SVG x={2470} y={SUELO - 250} w={420} h={250}>
      <rect x={0} y={60} width={380} height={30} rx={6} fill="#8a5a2a" />
      <rect x={20} y={90} width={24} height={150} fill="#5a3418" /><rect x={336} y={90} width={24} height={150} fill="#5a3418" />
      <rect x={70} y={30} width={170} height={32} rx={4} fill="#f6e3b4" stroke="#8a5a2a" strokeWidth={4} />
      <line x1={155} y1={30} x2={155} y2={62} stroke="#8a5a2a" strokeWidth={4} />
      <rect x={270} y={150} width={110} height={90} rx={8} fill="#7a4520" stroke="#e8b84a" strokeWidth={6} />
    </SVG>
    {/* llavero gigante en la pared */}
    <SVG x={2700} y={SUELO - 560} w={160} h={200}>
      <circle cx={80} cy={50} r={40} fill="none" stroke="#e8b84a" strokeWidth={10} />
      {[-1, 0, 1].map((k) => <g key={k} transform={`rotate(${k * 22 + Math.sin(t * 2 + k) * 3} 80 90)`}><rect x={74} y={86} width={12} height={90} fill="#e8b84a" /><rect x={86} y={156} width={22} height={10} fill="#e8b84a" /></g>)}
    </SVG>
    <Antorcha x={2300} y={SUELO - 140} t={t} seed={1} s={0.8} />
    <Antorcha x={3000} y={SUELO - 760} t={t} seed={2} s={0.8} />
    <Antorcha x={3700} y={SUELO - 760} t={t} seed={3} s={0.8} />
    <Antorcha x={3600} y={SUELO - 160} t={t} seed={4} s={0.7} />
    {/* lado que paga: camas */}
    <SVG x={2100} y={SUELO - 900} w={1200} h={240}>
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${60 + i * 560} 60)`}>
          <rect x={0} y={60} width={420} height={70} rx={10} fill="#8a5a2a" />
          <rect x={10} y={40} width={400} height={44} rx={16} fill={i ? "#e8e0f0" : "#f6e3b4"} />
          <rect x={10} y={40} width={110} height={40} rx={16} fill="#ffffff" />
          <rect x={150} y={44} width={260} height={40} rx={10} fill={i ? C.teal : C.rosa} opacity={0.9} />
          <rect x={0} y={120} width={20} height={56} fill="#5a3418" /><rect x={400} y={120} width={20} height={56} fill="#5a3418" />
        </g>
      ))}
    </SVG>
    {/* muro de grilletes (1er piso derecha) */}
    {[0, 1, 2, 3, 4, 5].map((i) => <Grillete key={i} x={3420 + i * 170} y={SUELO - 1180} s={0.9 + (i % 3) * 0.15} peso={1 + (i % 3) * 0.4} />)}
    {/* sala común: paja, desagüe, balde, reja a la calle */}
    <Paja x={2960} y={SUELO - 40} w={700} seed={5} />
    <Paja x={3720} y={SUELO - 40} w={560} seed={6} />
    <SVG x={2920} y={SUELO - 46} w={1520} h={20}><rect x={0} y={6} width={1520} height={12} fill="#2a5a5a" /><rect x={0} y={6} width={1520} height={4} fill="#4a9a8a" opacity={0.7} /></SVG>
    <SVG x={4140} y={SUELO - 150} w={110} h={120}><path d="M 10 20 L 100 20 L 88 116 L 22 116 Z" fill="#7a5a3a" /><rect x={6} y={14} width={98} height={12} rx={4} fill="#5a3418" /><path d="M 8 20 Q 55 50 102 20" stroke="#6a8a3a" strokeWidth={8} fill="none" /></SVG>
    <Moscas t={t} x={4195} y={SUELO - 200} />
    <SVG x={4330} y={SUELO - 470} w={140} h={200}>
      <rect x={0} y={0} width={140} height={200} fill="#140d24" />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={20 + i * 33} y1={0} x2={20 + i * 33} y2={200} stroke="#8b93a3" strokeWidth={10} />)}
      {[0, 1].map((i) => <line key={i} x1={0} y1={60 + i * 80} x2={140} y2={60 + i * 80} stroke="#8b93a3" strokeWidth={10} />)}
    </SVG>
    <Rata t={t} x0={2980} x1={4300} y={SUELO - 40} seed={1} />
    <Rata t={t} x0={2100} x1={3300} y={SUELO + 600} seed={2} vel={200} />
    {/* sótano: celda dura + pozo */}
    <Sala x={2040} y={SUELO + 40} w={1460} h={620} seed={41} fondo="url(#sotano)" piso="#2a1a1a" />
    <Gotera t={t} x={2400} y={SUELO + 50} h={560} seed={1} />
    <Gotera t={t} x={3200} y={SUELO + 50} h={560} seed={2} />
    <Antorcha x={3300} y={SUELO + 380} t={t} seed={5} s={0.6} />
    {/* el pozo: boca con tapa y caño hasta el fondo */}
    <SVG x={3560} y={SUELO + 40} w={520} h={1700}>
      <rect x={0} y={0} width={520} height={620} fill="url(#sotano)" />
      <rect x={0} y={580} width={520} height={40} fill="#2a1a1a" />
      <path d="M 170 620 L 350 620 L 350 900 Q 470 1000 470 1250 L 470 1600 L 50 1600 L 50 1250 Q 50 1000 170 900 Z" fill="#0e0818" />
      <path d="M 170 620 L 350 620 L 350 900 Q 470 1000 470 1250 L 470 1600 L 50 1600 L 50 1250 Q 50 1000 170 900 Z" fill="none" stroke="#3a2a4a" strokeWidth={14} />
      <ellipse cx={260} cy={1590} rx={210} ry={26} fill="#2a2030" />
      <rect x={150} y={600} width={220} height={22} rx={6} fill="#7a5a3a" />
    </SVG>
    <Gotera t={t} x={3700} y={SUELO + 940} h={640} seed={3} />
  </>
);

const Tribunal: React.FC<{ t: number }> = ({ t }) => (
  <>
    <SVG x={4900} y={SUELO - 1300} w={2200} h={1300}>
      <rect x={0} y={200} width={2200} height={1100} fill="#c9a36a" />
      <path d="M -60 220 L 1100 -120 L 2260 220 Z" fill="#7a3a2a" />
      <rect x={-60} y={200} width={2320} height={36} fill="#5a2a1f" />
      <rect x={60} y={280} width={2080} height={1020} fill="#4a2c5a" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={160 + i * 420} y={330} width={150} height={260} rx={75} fill="#ffcf7a" opacity={0.75} />)}
      {/* estrado de los jueces */}
      <rect x={1500} y={760} width={560} height={260} fill="#7a3a1a" />
      <rect x={1480} y={740} width={600} height={34} rx={8} fill="#a8622a" />
      <rect x={1620} y={420} width={330} height={200} rx={12} fill="#e8344a" />
      <path d="M 1785 450 l 26 54 l 58 6 l -44 38 l 14 58 l -54 -30 l -54 30 l 14 -58 l -44 -38 l 58 -6 Z" fill={C.oro} />
      {/* banquillo del acusado */}
      <rect x={760} y={900} width={420} height={140} fill="#7a4520" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={770 + i * 76} y={820} width={14} height={90} fill="#5a3418" />)}
      <rect x={760} y={810} width={420} height={20} rx={6} fill="#a8622a" />
      {/* jurado */}
      <rect x={130} y={860} width={520} height={160} fill="#7a4520" />
      <rect x={120} y={850} width={540} height={20} rx={6} fill="#a8622a" />
      <rect x={0} y={1260} width={2200} height={40} fill="#5a3418" />
    </SVG>
    <Cartel x={6000} y={SUELO - 1260} txt="THE COURT" w={420} col={C.rojo} tinta="#fff" />
    <Antorcha x={5200} y={SUELO - 520} t={t} seed={7} s={0.8} />
    <Antorcha x={6800} y={SUELO - 520} t={t} seed={8} s={0.8} />
  </>
);

const Ludgate: React.FC<{ t: number }> = ({ t }) => (
  <>
    <MuroCiudad x0={7200} x1={7400} />
    <SVG x={7400} y={SUELO - 1400} w={1000} h={1400 + 560}>
      <Bloques w={1000} h={1400} seed={51} col={PIEDRA.b} />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 145} y={-70} width={84} height={76} fill={PIEDRA.b} stroke={PIEDRA.jun} strokeWidth={3} />)}
      <path d="M 300 1400 L 300 1050 A 200 200 0 0 1 700 1050 L 700 1400 Z" fill="#160e2a" />
      {/* arriba: cuartos de los que pagan (luz) */}
      <rect x={80} y={240} width={840} height={360} fill="#3a2c66" />
      <ellipse cx={500} cy={420} rx={420} ry={200} fill="url(#glowV)" opacity={0.8} />
      <rect x={140} y={480} width={240} height={60} rx={10} fill="#f6e3b4" /><rect x={600} y={470} width={240} height={70} rx={10} fill={C.teal} />
      <rect x={80} y={580} width={840} height={20} fill="#6b3a1f" />
      {/* abajo: sótano oscuro */}
      <rect x={60} y={1420} width={880} height={520} fill="url(#sotano)" />
      <rect x={60} y={1900} width={880} height={40} fill="#2a1a1a" />
      <text x={500} y={176} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={80} fill={C.oro} letterSpacing={6}>LUDGATE</text>
    </SVG>
    <Gotera t={t} x={7700} y={SUELO + 30} h={480} seed={4} />
  </>
);

const Fleet: React.FC<{ t: number }> = ({ t }) => (
  <>
    <SVG x={8500} y={SUELO - 1100} w={1200} h={1100}>
      <Bloques w={1200} h={1100} seed={61} col={PIEDRA.c} />
      <path d="M -40 40 L 600 -220 L 1240 40 Z" fill="#3a3062" />
      <rect x={60} y={120} width={1080} height={940} fill="url(#interior)" />
      <rect x={60} y={1020} width={1080} height={40} fill="#3b2a2a" />
      <rect x={60} y={560} width={1080} height={30} fill="#6b3a1f" />
      {/* tiendita adentro */}
      <rect x={760} y={380} width={300} height={180} fill="#7a4520" />
      <path d="M 740 380 L 1080 380 L 1050 320 L 770 320 Z" fill={C.rojo} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={760 + i * 75} y={320} width={38} height={60} fill="#fff" opacity={0.85} />)}
      <text x={600} y={100} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={80} fill={C.oro} letterSpacing={6}>THE FLEET</text>
    </SVG>
    {/* la reja de la calle (planta baja, cara izquierda) */}
    <SVG x={8400} y={SUELO - 420} w={240} h={300}>
      <rect x={0} y={0} width={200} height={260} fill="#140d24" />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={20 + i * 40} y1={0} x2={20 + i * 40} y2={260} stroke="#8b93a3" strokeWidth={12} />)}
      {[0, 1].map((i) => <line key={i} x1={0} y1={80 + i * 90} x2={200} y2={80 + i * 90} stroke="#8b93a3" strokeWidth={12} />)}
    </SVG>
    <Antorcha x={9100} y={SUELO - 760} t={t} seed={9} s={0.8} />
  </>
);

const Rio: React.FC<{ t: number; x0: number; x1: number }> = ({ t, x0, x1 }) => (
  <SVG x={x0} y={SUELO + 40} w={x1 - x0} h={600}>
    <rect x={0} y={0} width={x1 - x0} height={600} fill="url(#rio)" />
    {Array.from({ length: Math.ceil((x1 - x0) / 160) }, (_, i) => (
      <path key={i} d={`M ${i * 160 + ((t * 40) % 160)} ${40 + (i % 3) * 60} q 40 -18 80 0`} stroke="#bff4fb" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.6} />
    ))}
    {/* barca */}
    <g transform={`translate(${((t * 60) % (x1 - x0 + 600)) - 300} ${30 + Math.sin(t * 2) * 6})`}>
      <path d="M 0 0 L 240 0 L 200 50 L 40 50 Z" fill="#7a4520" />
      <line x1={120} y1={0} x2={120} y2={-180} stroke="#5a3418" strokeWidth={10} />
      <path d={`M 126 -170 Q ${200 + Math.sin(t * 3) * 10} -110 126 -40 Z`} fill="#f6e3b4" />
    </g>
  </SVG>
);

const Savoy: React.FC<{ t: number }> = ({ t }) => (
  <>
    <SVG x={9900} y={SUELO - 1500} w={1900} h={1540}>
      <rect x={0} y={300} width={1900} height={1240} fill="#f0c79a" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${i * 330 - 20} 320 L ${i * 330 + 150} 120 L ${i * 330 + 320} 320 Z`} fill="url(#techo)" />)}
      {[0, 1].map((k) => <rect key={k} x={k ? 1660 : 0} y={0} width={240} height={1540} fill="#e8b98a" />)}
      {[0, 1].map((k) => <path key={k} d={`M ${k ? 1640 : -20} 10 L ${k ? 1780 : 120} -180 L ${k ? 1920 : 260} 10 Z`} fill="url(#techo)" />)}
      <rect x={120} y={380} width={1660} height={1080} fill="#7a3a5a" />
      <ellipse cx={950} cy={900} rx={900} ry={520} fill="url(#glowV)" opacity={0.9} />
      {/* tapices con flor de lis */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${260 + i * 420} 440)`}>
          <rect x={0} y={0} width={180} height={300} fill={i % 2 ? "#2b3a9f" : C.rojo} />
          <path d="M 90 70 q -30 40 0 90 q 30 -50 0 -90 M 50 120 q 40 -10 40 40 M 130 120 q -40 -10 -40 40 M 60 170 l 60 0" stroke={C.oro} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* mesa del banquete */}
      <rect x={300} y={1250} width={1300} height={34} rx={8} fill="#8a5a2a" />
      <rect x={300} y={1230} width={1300} height={24} fill="#fff" opacity={0.9} />
      {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={380 + i * 220} cy={1222} rx={46} ry={16} fill={["#d98a35", C.rojo, C.lima, C.oro, "#d98a35", C.rosa][i]} />)}
      <rect x={340} y={1284} width={30} height={170} fill="#5a3418" /><rect x={1530} y={1284} width={30} height={170} fill="#5a3418" />
      <rect x={120} y={1460} width={1660} height={40} fill="#c9a36a" />
      <text x={950} y={370} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={84} fill="#7a1f35" letterSpacing={6}>THE SAVOY</text>
    </SVG>
    {/* banderas */}
    {[10050, 11650].map((x, k) => (
      <SVG key={k} x={x} y={SUELO - 1960} w={300} h={300}>
        <line x1={20} y1={0} x2={20} y2={300} stroke="#5a3418" strokeWidth={10} />
        <path d={`M 24 10 Q ${110 + Math.sin(t * 4 + k) * 20} ${30 + Math.sin(t * 5 + k) * 10} 200 ${14 + Math.sin(t * 4 + k) * 12} L 200 ${104 + Math.sin(t * 4 + k) * 12} Q ${110 + Math.sin(t * 4 + k) * 20} ${120 + Math.sin(t * 5 + k) * 10} 24 100 Z`} fill={k ? C.rojo : "#2b3a9f"} />
      </SVG>
    ))}
  </>
);

const Torre: React.FC<{ t: number }> = ({ t }) => (
  <>
    <SVG x={12100} y={SUELO - 760} w={2700} h={800}>
      <Bloques w={2700} h={800} seed={71} col={PIEDRA.b} />
      {Array.from({ length: 19 }, (_, i) => <rect key={i} x={i * 145} y={-70} width={84} height={76} fill={PIEDRA.b} stroke={PIEDRA.jun} strokeWidth={3} />)}
    </SVG>
    {/* la Torre Blanca */}
    <SVG x={12700} y={SUELO - 2000} w={1500} h={2000}>
      <g transform="translate(0 300)"><Bloques w={1500} h={1700} seed={91} col="#d9cdb6" jun="#b3a68c" /></g>
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 155} y={240} width={90} height={70} fill="#d9cdb6" stroke="#b3a68c" strokeWidth={4} />)}
      {[0, 1350].map((x, k) => (
        <g key={k}><rect x={x - 40} y={140} width={230} height={1860} fill="#cbbea5" stroke="#b3a68c" strokeWidth={4} /><path d={`M ${x - 50} 150 Q ${x + 75} -10 ${x + 200} 150 Z`} fill="#9b7bf0" /></g>
      ))}
      {[1, 2, 3].map((j) => [0, 1, 2, 3].map((i) => <rect key={`${i}${j}`} x={300 + i * 250} y={420 + j * 330} width={70} height={140} rx={35} fill="#2a1f45" />))}
      {/* corte: la habitación del obispo en el último piso */}
      <rect x={240} y={420} width={1010} height={300} fill="#5a3a7a" />
      <ellipse cx={745} cy={560} rx={520} ry={200} fill="url(#glowV)" opacity={0.8} />
      <rect x={240} y={700} width={1010} height={30} fill="#6b3a1f" />
      <rect x={1250} y={470} width={90} height={160} rx={40} fill="#ffcf7a" />
      <rect x={330} y={170} width={840} height={110} rx={22} fill="#2a1460" stroke="#fff3d6" strokeWidth={8} />
      <text x={750} y={252} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#fff3d6" letterSpacing={5}>TOWER OF LONDON</text>
    </SVG>
    {/* Little Ease: celda mínima en el sótano */}
    <SVG x={12900} y={SUELO + 20} w={420} h={300}>
      <rect x={0} y={0} width={420} height={300} fill="#140d24" />
      <rect x={110} y={60} width={200} height={180} fill="#3a2c66" stroke="#8b93a3" strokeWidth={8} />
    </SVG>
  </>
);

const Norte: React.FC<{ t: number }> = ({ t }) => (
  <SVG x={14800} y={SUELO - 900} w={3400} h={940}>
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M 0 ${940} ${Array.from({ length: 18 }, (_, i) => `L ${i * 200} ${500 + k * 140 + Math.sin(i * 0.9 + k * 2) * 90}`).join(" ")} L 3400 940 Z`} fill={["#5c8f3e", "#4a7a32", "#3a6224"][k]} />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`translate(${600 + i * 420} ${820 + (i % 2) * 30})`}>
        <ellipse cx={0} cy={0} rx={50} ry={34} fill="#f4f0e8" /><circle cx={44 + Math.sin(t * 2 + i) * 3} cy={-14} r={20} fill="#2a2440" />
        <rect x={-30} y={26} width={8} height={24} fill="#2a2440" /><rect x={22} y={26} width={8} height={24} fill="#2a2440" />
      </g>
    ))}
    <g transform="translate(1900 640)">
      <rect x={-10} y={0} width={20} height={300} fill="#5a3418" />
      <path d="M -20 30 L 300 30 L 340 80 L 300 130 L -20 130 Z" fill={C.oro} />
      <text x={150} y={102} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={50} fill="#5a2a08">SCOTLAND</text>
    </g>
  </SVG>
);

const StAndrews: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* mar a la derecha */}
    <SVG x={19700} y={SUELO - 200} w={1200} h={2200}>
      <rect x={0} y={200} width={1200} height={2000} fill="url(#rio)" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${i * 150 + ((t * 50) % 150)} ${240 + (i % 3) * 50} q 40 -20 80 0`} stroke="#bff4fb" strokeWidth={8} fill="none" opacity={0.6} />)}
    </SVG>
    {/* castillo */}
    <SVG x={18200} y={SUELO - 1500} w={1600} h={1540}>
      <Bloques w={1100} h={900} seed={81} col="#a08a70" jun="#6a5a4a" />
      <rect x={0} y={0} width={0} height={0} />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 140} y={-60} width={84} height={70} fill="#a08a70" stroke="#6a5a4a" strokeWidth={3} />)}
      <g transform="translate(0 600)"><Bloques w={1100} h={940} seed={82} col="#a08a70" jun="#6a5a4a" /></g>
      <g transform="translate(700 -300)">
        <Bloques w={500} h={1840} seed={83} col="#b49a7a" jun="#6a5a4a" />
        {Array.from({ length: 4 }, (_, i) => <rect key={i} x={i * 130} y={-60} width={80} height={70} fill="#b49a7a" stroke="#6a5a4a" strokeWidth={3} />)}
        <text x={250} y={140} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill="#4a2a1a">SEA TOWER</text>
      </g>
    </SVG>
    {/* roca y mazmorra botella */}
    <SVG x={18000} y={SUELO} w={1800} h={1800}>
      <rect x={0} y={0} width={1800} height={1800} fill="#6a5a4a" />
      {Array.from({ length: 40 }, (_, i) => { const r = rnd(i + 90); return <ellipse key={i} cx={r() * 1800} cy={r() * 1800} rx={30 + r() * 60} ry={14 + r() * 30} fill="#5a4a3c" />; })}
      <path d="M 1040 0 L 1160 0 L 1160 380 Q 1400 520 1400 900 L 1400 1500 L 800 1500 L 800 900 Q 800 520 1040 380 Z" fill="#120a14" />
      <path d="M 1040 0 L 1160 0 L 1160 380 Q 1400 520 1400 900 L 1400 1500 L 800 1500 L 800 900 Q 800 520 1040 380 Z" fill="none" stroke="#3a2a2a" strokeWidth={16} />
      <ellipse cx={1100} cy={1490} rx={290} ry={30} fill="#2a1a20" />
    </SVG>
  </>
);

// ── cielo (pantalla) + estrellas con paralaje
export const CieloMundo: React.FC<{ t: number; cx: number; cy: number; z: number }> = ({ t, cx, z }) => {
  // del violeta de la noche al naranja del atardecer sobre el río; día nublado en el norte
  const u = Math.max(0, Math.min(1, (cx - 9500) / 2500)) * (1 - Math.max(0, Math.min(1, (cx - 14500) / 1500)));
  const top = u > 0.5 ? "#5b2bb5" : "#1b1240", mid = u > 0.5 ? "#ff7a3d" : "#5b2bb5";
  const r = rnd(5);
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${top} 0%, ${mid} 75%, ${u > 0.5 ? "#ffb020" : "#9b4bd0"} 100%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 80 }, (_, i) => {
          const x = ((r() * 4000 - cx * 0.05 * z) % 1920 + 1920) % 1920, y = r() * 700;
          return <circle key={i} cx={x} cy={y} r={1.5 + r() * 2.5} fill="#fff7d6" opacity={(0.3 + 0.7 * Math.abs(Math.sin(t * 1.3 + i))) * (1 - u * 0.8)} />;
        })}
      </svg>
    </div>
  );
};

// ── mundo completo con recorte por cámara
const PIEZAS: [number, number, React.FC<{ t: number }>][] = [
  [-400, 900, Panaderia],
  [900, 4500, Newgate],
  [4850, 7150, Tribunal],
  [7150, 8450, Ludgate],
  [8350, 9750, Fleet],
  [9850, 11850, Savoy],
  [12050, 14850, Torre],
  [14750, 18250, Norte],
  [17950, 20900, StAndrews],
];

export const Mundo: React.FC<{ t: number; x0: number; x1: number }> = ({ t, x0, x1 }) => (
  <>
    <Defs />
    {/* calle continua + tierra */}
    <SVG x={Math.max(-3000, x0 - 200)} y={SUELO} w={Math.min(24000, x1 - x0 + 400)} h={8000}>
      <rect x={0} y={0} width={Math.min(24000, x1 - x0 + 400)} height={8000} fill="url(#tierra)" />
      <rect x={0} y={0} width={Math.min(24000, x1 - x0 + 400)} height={40} fill="#8a4a2a" />
      {Array.from({ length: Math.ceil((x1 - x0 + 400) / 90) }, (_, i) => <rect key={i} x={i * 90 - ((x0 - 200) % 90)} y={6} width={70} height={26} rx={10} fill="#a85a32" opacity={0.6} />)}
    </SVG>
    {/* muro de la ciudad entre la panadería y Newgate, y entre Newgate y el tribunal */}
    {x0 < 1000 && x1 > 700 && <MuroCiudad x0={760} x1={900} />}
    {x1 > 9750 && x0 < 15000 && <Rio t={t} x0={9750} x1={15000} />}
    {PIEZAS.map(([a, b, P], i) => (b > x0 && a < x1 ? <P key={i} t={t} /> : null))}
  </>
);
