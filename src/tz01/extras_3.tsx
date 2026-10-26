// tz01 · vuelta 3 del ojo del director (planos 46-86): insertos a pantalla completa, contraplanos, primeros términos y arreglos de texto.
// Pantalla = coordenadas del cuadro 1920×1080. Mundo = SVG del set (va en `extra` / `medio`).
// ⚠ hooks SIEMPRE antes de cualquier return.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { ACENTO, ORO } from "../tenzo/elenco";
import { FarolPapel } from "../tenzo/utileria";
import { Llama, Ola } from "../tenzo/graficos";
import { ManoMara } from "../tenzo/hud";
import { lerp } from "./extras";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const TINTA = "#221c18";
const PIEL_T = "#f2bf8f"; // Tenzo
const PIEL_L = "#ecc9a3"; // Leo
const FRIO = "#9fd0ff";

// ---------- cartel OPEN del ventanal, al DERECHO (el del set está espejado y se lee «N∃PO») — mundo del lavadero ----------
export const OpenDerecho: React.FC<{ on?: number }> = ({ on = 1 }) => {
  const f = useF();
  const x = 2620 + 1440 - 300, y = 90 + 470; // mismo lugar que el del set
  const tit = 0.85 + 0.15 * Math.sin(f / 5);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-6} y={-6} width={232} height={102} rx={50} fill="#121822" />
      <rect x={0} y={0} width={220} height={90} rx={45} fill="none" stroke={FRIO} strokeWidth={6} opacity={0.9 * on * tit} />
      <text x={110} y={62} fontSize={50} fill={FRIO} opacity={on * tit} textAnchor="middle" fontFamily="sans-serif" fontWeight={800}>OPEN</text>
    </g>
  );
};

// ---------- nieve gruesa en primer término (pantalla) ----------
export const NieveCerca: React.FC<{ n?: number; o?: number }> = ({ n = 40, o = 0.8 }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: n }).map((_, k) => {
          const r = 3 + (k % 5) * 1.6;
          const y = ((k * 263 + f * (1.4 + (k % 4) * 0.5)) % 1200) - 60;
          const x = ((k * 397) % 1960) + 30 * Math.sin(f / 30 + k);
          return <circle key={k} cx={x} cy={y} r={r} fill="#f4f7fc" opacity={o * (0.4 + (k % 3) * 0.2)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- hombro de Leo de espaldas en primer término (contraplano): pelo en punta, vincha y auricular blancos ----------
export const HombroLeo: React.FC<{ x: number; y: number; r?: number; lado?: 1 | -1; luz?: string; giro?: number }> = ({ x, y, r = 230, lado = 1, luz = "#8fb4e8", giro = 0 }) => {
  const f = useF();
  const dy = 2 * Math.sin(f / 37);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(${x},${y + dy}) scale(${lado},1)`}>
          {/* capucha y hombros */}
          <path d={`M${-r * 1.5},${r * 2.6} Q${-r * 1.45},${r * 0.9} ${-r * 0.4},${r * 0.75} L${r * 0.5},${r * 0.75} Q${r * 1.5},${r * 0.9} ${r * 1.6},${r * 2.6} Z`} fill="#1c1c21" />
          <path d={`M${-r * 0.75},${r * 0.95} Q0,${r * 1.35} ${r * 0.8},${r * 0.95}`} stroke="#2e2e36" strokeWidth={r * 0.12} fill="none" />
          {/* cabeza de 3/4 de espaldas */}
          <circle cx={0} cy={0} r={r * 0.82} fill="#16141a" />
          {[-0.9, -0.45, 0, 0.45].map((a, i) => <path key={i} d={`M${Math.sin(a) * r * 0.78 - r * 0.16},${-Math.cos(a) * r * 0.74} l${r * 0.2},-${r * 0.38} l${r * 0.16},${r * 0.4} Z`} fill="#16141a" />)}
          {/* oreja y mejilla que asoma del lado de la escena */}
          <ellipse cx={r * 0.78} cy={r * 0.12} rx={r * 0.13} ry={r * 0.2} fill={PIEL_L} opacity={0.85 + 0.1 * giro} />
          <path d={`M${r * 0.7},${r * 0.35} Q${r * 0.86 + giro * 20},${r * 0.55} ${r * 0.6},${r * 0.78}`} stroke={PIEL_L} strokeWidth={r * 0.12} fill="none" strokeLinecap="round" opacity={0.7 + 0.3 * giro} />
          {/* vincha y auricular */}
          <path d={`M${-r * 0.7},${-r * 0.1} Q${0},${-r * 1.02} ${r * 0.74},${-r * 0.05}`} stroke="#f1ede6" strokeWidth={r * 0.08} fill="none" strokeLinecap="round" />
          <rect x={r * 0.62} y={-r * 0.12} width={r * 0.26} height={r * 0.38} rx={r * 0.1} fill="#f1ede6" />
          {/* borde de luz del lado de la escena */}
          <path d={`M${r * 0.15},${-r * 0.8} A${r * 0.82},${r * 0.82} 0 0 1 ${r * 0.8},${r * 0.1}`} fill="none" stroke={luz} strokeWidth={8} opacity={0.6} strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- farol grande y desenfocado en primer término (pantalla) ----------
export const FarolCerca: React.FC<{ x: number; y: number; s?: number; luz?: number; blur?: number }> = ({ x, y, s = 3, luz = 1.3, blur = 5 }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", filter: `blur(${blur}px)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <FarolPapel x={x} y={y + 2 * Math.sin(f / 23)} s={s} luz={luz * (0.95 + 0.05 * Math.sin(f / 4))} halo={0.6} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- pájaro blanco que se suelta de una mano y se va (pantalla) ----------
export const Pajaro: React.FC<{ x: number; y: number; desde: number; dx?: number; dy?: number; dur?: number; s0?: number }> = ({ x, y, desde, dx = 760, dy = -620, dur = 45, s0 = 1.4 }) => {
  const f = useF();
  const g = f - desde;
  if (g < 0 || g > dur + 4) return null;
  const t = g / dur;
  const e = t * t * (3 - 2 * t);
  const px = x + dx * e, py = y + dy * e - 120 * Math.sin(Math.PI * e);
  const ala = 26 * Math.sin(g * 1.3);
  const s = s0 * (1 - 0.5 * e);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(${px},${py}) scale(${s})`} opacity={lerp(g, dur - 6, dur + 4, 1, 0)}>
          <ellipse cx={0} cy={0} rx={30} ry={16} fill="#fbf8f1" stroke={TINTA} strokeWidth={4} />
          <circle cx={26} cy={-8} r={11} fill="#fbf8f1" stroke={TINTA} strokeWidth={4} />
          <path d="M36,-8 l12,4 l-12,3 Z" fill="#e0a23a" />
          <path d={`M-4,-4 Q-18,${-30 - ala} -40,${-26 - ala * 1.3} Q-20,-10 -4,-4 Z`} fill="#fbf8f1" stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
          <path d="M-28,2 l-22,-6 l6,14 Z" fill="#fbf8f1" stroke={TINTA} strokeWidth={3} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- inserto: la palma del Buda levantada, «WAIT.» (pantalla completa) ----------
export const PalmaEspera: React.FC<{ desde?: number; texto?: string }> = ({ desde = 0, texto = "WAIT." }) => {
  const f = useF();
  const g = Math.max(0, f - desde);
  const sube = interpolate(g, [0, 10], [140, 0], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #f6d7a0, #c8803a 70%, #8a4a22)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <Halo x={960} y={470} r={520} color="#fff2c8" fuerza={0.55} />
        <g transform={`translate(960,${620 + sube})`}>
          {/* manga y muñeca */}
          <path d="M-170,520 Q-150,240 -95,150 L95,150 Q150,240 170,520 Z" fill="#c7861f" stroke={TINTA} strokeWidth={6} />
          <path d="M-95,150 L95,150" stroke="#9c3b22" strokeWidth={22} />
          {/* palma y dedos */}
          <path d="M-95,150 Q-118,40 -112,-40 L-112,-150 Q-112,-176 -88,-176 Q-66,-176 -66,-150 L-66,-70 L-60,-230 Q-60,-258 -34,-258 Q-10,-258 -10,-230 L-10,-80 L-4,-262 Q-4,-290 22,-290 Q48,-290 48,-262 L48,-80 L54,-232 Q54,-258 78,-258 Q102,-258 102,-232 L102,-40 Q140,-120 168,-100 Q192,-80 168,-30 L112,110 Q100,150 95,150 Z"
            fill="#e2ad78" stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
          <path d="M-60,30 Q0,60 60,20" stroke="#b9875a" strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={0} cy={-10} r={16} fill="none" stroke="#c7861f" strokeWidth={5} opacity={0.7} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: F_HUD, fontWeight: 700, fontSize: 130, letterSpacing: 18, color: "#fffaf0", opacity: lerp(g, 4, 12, 0, 1), textShadow: "0 6px 24px rgba(90,40,10,0.6)" }}>{texto}</div>
    </AbsoluteFill>
  );
};

// ---------- nubes de lluvia que se abren y entra el sol (pantalla) ----------
export const NubesAbren: React.FC<{ p: number }> = ({ p }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs><radialGradient id="solAbre"><stop offset="0" stopColor="#fff6d0" stopOpacity={0.95} /><stop offset="1" stopColor="#ffd98a" stopOpacity={0} /></radialGradient></defs>
        {p > 0 && <circle cx={960} cy={140} r={260 + 160 * p} fill="url(#solAbre)" opacity={p} />}
        {p > 0 && Array.from({ length: 9 }).map((_, k) => { const a = (-60 + k * 15) * Math.PI / 180; return <path key={k} d={`M960,140 L${960 + Math.sin(a) * 1400 - 40},${140 + Math.cos(a) * 1400} L${960 + Math.sin(a) * 1400 + 40},${140 + Math.cos(a) * 1400} Z`} fill="#fff2c8" opacity={0.13 * p * (0.8 + 0.2 * Math.sin(f / 9 + k))} />; })}
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${960 + sd * (220 + 900 * p)},${120 - 40 * p})`} opacity={1 - 0.3 * p}>
            {[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={sd * (k * 150 - 120)} cy={(k % 2) * 40} rx={230} ry={120} fill={p > 0.5 ? "#b9a48c" : "#7d7466"} />)}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- inserto: los ojos de Tenzo en primerísimo primer plano; se achican y arrugan al sonreír ----------
export const OjosTenzo: React.FC<{ sonrisa: number; mira?: number }> = ({ sonrisa, mira = 0 }) => {
  const f = useF();
  const parp = (f % 95) > 90 ? 1 : 0; // parpadeo
  const s = Math.min(1, sonrisa);
  return (
    <AbsoluteFill style={{ background: PIEL_T }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* luz lateral cálida del farol (izquierda) y sombra del otro lado */}
        <defs>
          <linearGradient id="ojLuz" x1="0" x2="1"><stop offset="0" stopColor="#ffd38a" stopOpacity={0.55} /><stop offset="0.55" stopColor="#ffd38a" stopOpacity={0} /><stop offset="1" stopColor="#6a3a1a" stopOpacity={0.35} /></linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#ojLuz)" />
        {/* frente con arrugas */}
        {[0, 1, 2].map((k) => <path key={k} d={`M${560 + k * 20},${160 + k * 44} Q960,${120 + k * 44 - 10 * s} ${1360 - k * 20},${160 + k * 44}`} stroke="#c98e5e" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.6} />)}
        {[-1, 1].map((sd) => {
          const cx = 960 + sd * 330, cy = 560;
          const abre = (1 - s) * (1 - parp);
          return (
            <g key={sd}>
              {/* ceja blanca, tupida */}
              {Array.from({ length: 9 }).map((_, k) => <path key={k} d={`M${cx - sd * 170 + sd * k * 40},${cy - 170 - 18 * Math.sin((k / 8) * Math.PI) - 20 * s} q${sd * 26},-22 ${sd * 52},-6`} stroke="#f6f1e6" strokeWidth={22} strokeLinecap="round" fill="none" />)}
              {/* ojo chiquito: punto que se vuelve arco al sonreír */}
              {abre > 0.15
                ? <g><ellipse cx={cx + mira * 14} cy={cy} rx={34} ry={34 * abre + 4} fill="#1a1414" /><circle cx={cx + mira * 14 + 10} cy={cy - 10} r={8} fill="#fff" opacity={abre} /></g>
                : <path d={`M${cx - 52},${cy + 6} Q${cx},${cy - 40} ${cx + 52},${cy + 6}`} stroke="#1a1414" strokeWidth={16} fill="none" strokeLinecap="round" />}
              {/* patas de gallo que aparecen con la sonrisa */}
              {[-1, 0, 1].map((k) => <path key={k} d={`M${cx + sd * 110},${cy + k * 26} l${sd * (70 + 10 * (1 - Math.abs(k)))},${k * 24}`} stroke="#b9805a" strokeWidth={9} strokeLinecap="round" opacity={s} />)}
              {/* bolsas bajo el ojo, suben con la sonrisa */}
              <path d={`M${cx - 70},${cy + 70 - 16 * s} Q${cx},${cy + 110 - 26 * s} ${cx + 70},${cy + 70 - 16 * s}`} stroke="#c98e5e" strokeWidth={9} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
        {/* nariz */}
        <path d="M960,600 Q900,800 960,840 Q1010,850 1030,820" stroke="#c98e5e" strokeWidth={12} fill="none" strokeLinecap="round" />
        {/* barba blanca que asoma abajo */}
        <path d="M600,1080 Q700,940 820,990 Q960,920 1100,990 Q1220,940 1320,1080 Z" fill="#f4efe4" opacity={0.9 * (0.5 + 0.5 * s)} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- inserto: la mano de Leo con el tel todavía tibio (ondas de calor) ----------
export const ManoTelTibio: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useF();
  const g = f - desde;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 55% 60%, #2a2f38, #0c0d10 75%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <Halo x={1010} y={600} r={420} color="#ff8a4a" fuerza={0.45 + 0.05 * Math.sin(g / 6)} />
        <g transform={`translate(1000,${620 + 4 * Math.sin(g / 20)}) rotate(-8)`}>
          {/* tel */}
          <rect x={-150} y={-280} width={300} height={560} rx={40} fill="#16181d" stroke="#3a3f48" strokeWidth={6} />
          <rect x={-130} y={-250} width={260} height={480} rx={20} fill="#ff8a4a" opacity={0.85} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={-110} y={-220 + k * 110 - ((g * 2) % 110)} width={220} height={90} rx={10} fill="#ffd2a8" opacity={0.6} />)}
          {/* mano: palma que lo envuelve, pulgar arriba */}
          <path d="M-200,320 Q-230,120 -160,-20 Q-130,-40 -120,20 L-120,240 Z" fill={PIEL_L} stroke={TINTA} strokeWidth={6} />
          <path d="M150,60 Q230,40 230,120 L200,330 L-210,340 L-150,200 Q0,250 150,180 Z" fill={PIEL_L} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
          {[0, 1, 2].map((k) => <path key={k} d={`M150,${80 + k * 50} Q210,${70 + k * 50} 205,${110 + k * 50}`} stroke={TINTA} strokeWidth={5} fill="none" />)}
          <path d="M-60,520 L-60,330 M60,520 L60,330" stroke="#24242a" strokeWidth={130} />
        </g>
        {/* ondas de calor */}
        {[0, 1, 2].map((k) => { const t = ((g / 40 + k / 3) % 1); return <path key={k} d={`M${900 + k * 90},${330 - t * 220} q20,-25 0,-50 q-20,-25 0,-50`} stroke="#ffb070" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7 * Math.sin(t * Math.PI)} />; })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- inserto cenital: el tel sobre la mesa con la pantalla prendida; la mano entra y lo levanta ----------
export const TelCenital: React.FC<{ levanta: number; texto?: string }> = ({ levanta, texto = "9h 43m" }) => {
  const f = useF();
  const lv = Math.min(1, Math.max(0, levanta));
  const ent = Math.min(1, lv * 2.2);
  return (
    <AbsoluteFill style={{ background: "#b9bec6" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* mesa de doblar (chapa gris) con vetas */}
        <rect width={1920} height={1080} fill="#c9ccd2" />
        {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={0} y={k * 96} width={1920} height={3} fill="#b3b7be" />)}
        {/* toalla doblada al costado */}
        <rect x={1380} y={120} width={420} height={330} rx={16} fill="#e9e6e0" stroke="#b9b2a4" strokeWidth={5} transform="rotate(6 1590 285)" />
        {/* tel */}
        <g transform={`translate(${900 - 60 * lv},${560 - 160 * lv}) rotate(${-14 + 10 * lv}) scale(${1 + 0.18 * lv})`}>
          <rect x={-150} y={-290} width={300} height={580} rx={42} fill="#16181d" />
          <rect x={-132} y={-262} width={264} height={524} rx={22} fill="#1c2230" />
          <Halo x={0} y={0} r={300} color="#ff8a4a" fuerza={0.35 + 0.05 * Math.sin(f / 7)} />
          <text x={0} y={-110} textAnchor="middle" fontFamily={F_HUD} fontWeight={500} fontSize={30} fill="#c9ced6" letterSpacing={3}>SCREEN TIME</text>
          <text x={0} y={-40} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={84} fill="#ff8a4a">{texto}</text>
          {[0, 1, 2, 3, 4, 5, 6].map((k) => <rect key={k} x={-110 + k * 32} y={140 - [40, 60, 30, 90, 120, 70, 150][k]} width={22} height={[40, 60, 30, 90, 120, 70, 150][k]} rx={4} fill="#ff8a4a" opacity={0.75} />)}
        </g>
        {/* la mano que entra desde abajo a la izquierda */}
        <g transform={`translate(${-200 + 760 * ent},${1250 - 520 * ent - 140 * lv})`} opacity={ent > 0 ? 1 : 0}>
          <path d="M-400,240 L-60,-30 Q0,-80 60,-40 L120,10 Q150,40 120,70 L40,90 L-300,330 Z" fill={PIEL_L} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
          <path d="M-480,320 L-300,150 L-180,300 L-380,470 Z" fill="#24242a" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- la sombra (Mara) en primer término, grande y desenfocada (contraplano) ----------
export const MaraPrimer: React.FC<{ x: number; y: number; r?: number; enojo?: number; blur?: number; o?: number }> = ({ x, y, r = 300, enojo = 0, blur = 9, o = 0.95 }) => {
  const f = useF();
  const dy = 6 * Math.sin(f / 18);
  const e = enojo;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", filter: `blur(${blur}px)`, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(${x},${y + dy})`}>
          <path d={`M${-r * 1.1},${r * 3} L${-r * 0.7},${r * 0.95} L${r * 0.7},${r * 0.95} L${r * 1.0},${r * 3} Z`} fill="#0b0709" stroke={ACENTO} strokeWidth={10} />
          <circle cx={0} cy={0} r={r} fill="#0b0709" stroke={ACENTO} strokeWidth={14} />
          <circle cx={0} cy={0} r={r * 1.15} fill="none" stroke={ACENTO} strokeWidth={30} opacity={0.18} />
          {[-1, 1].map((sd) => <path key={sd} d={`M${sd * r * 0.5},${-r * 0.1 - 20 * e} Q${sd * r * 0.3},${-r * 0.3 + 30 * e} ${sd * r * 0.1},${-r * 0.1 + 10 * e}`} stroke={ACENTO} strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />)}
          <path d={`M${-r * 0.4},${r * 0.35} Q0,${r * 0.35 + r * 0.35 * (1 - 2 * e)} ${r * 0.4},${r * 0.35}`} stroke={ACENTO} strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- voz de Mara (letra a mano roja) DENTRO de una caja oscura: nunca se corta ni se pisa ----------
export const MaraCaja: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number }> = ({ texto, x, y, desde, hasta, tam = 72 }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const w = texto.length * tam * 0.5 + 90;
  const o = lerp(f, desde, desde + 5, 0, 1) * (hasta !== undefined ? lerp(f, hasta - 10, hasta, 1, 0) : 1);
  const xx = Math.min(Math.max(30, x), 1890 - w);
  return (
    <>
      <div style={{ position: "absolute", left: xx, top: y - 16, width: w, height: tam * 1.05 + 40, borderRadius: 22, background: "rgba(16,8,8,0.72)", border: `2px solid ${ACENTO}66`, opacity: o }} />
      <ManoMara texto={texto} x={xx + 34} y={y} desde={desde} hasta={hasta} tam={tam} vel={2.2} />
    </>
  );
};

// ---------- la ola en un panel oscuro arriba (los personajes siguen actuando abajo) ----------
export const PanelOla: React.FC<{ p: number; seg?: number; x?: number; y?: number; s?: number; reloj?: boolean; desde?: number }> = ({ p, seg, x = 980, y = 40, s = 0.5, reloj = true, desde = 0 }) => {
  const f = useF();
  const o = lerp(f, desde, desde + 8, 0, 1);
  const W = 1920 * s, H = 1080 * s * 0.86;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, height: H, borderRadius: 24, overflow: "hidden", background: "rgba(14,15,19,0.88)", border: "3px solid #3a3f48", opacity: o, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "absolute", left: 0, top: -1080 * s * 0.1, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <Ola p={p} fondo={false} seg={seg} reloj={reloj} y={-40} />
      </div>
    </div>
  );
};

// ---------- inserto: la mano de Tenzo levanta TRES dedos + el reloj 3:00 AM ----------
export const TresDedos: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useF();
  const g = Math.max(0, f - desde);
  const d = (k: number) => lerp(g, 4 + k * 4, 10 + k * 4, 0, 1); // cada dedo se estira
  const sube = interpolate(g, [0, 8], [120, 0], cl);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 40% 55%, #3a3226, #121214 75%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <Halo x={760} y={640} r={460} color={ORO} fuerza={0.4} />
        <g transform={`translate(760,${700 + sube})`}>
          <path d="M-150,420 Q-140,200 -110,120 L120,120 Q150,220 160,420 Z" fill="#8e8a82" stroke={TINTA} strokeWidth={6} />
          {/* puño con pulgar sobre el meñique */}
          <path d="M-110,130 Q-130,10 -100,-40 L120,-40 Q150,40 120,130 Z" fill={PIEL_T} stroke={TINTA} strokeWidth={6} />
          {[0, 1, 2].map((k) => { const x0 = -88 + k * 66, l = 70 + 150 * d(k) + (k === 1 ? 20 * d(k) : 0); return <rect key={k} x={x0} y={-40 - l} width={56} height={l + 20} rx={28} fill={PIEL_T} stroke={TINTA} strokeWidth={6} />; })}
          <path d="M110,-20 Q150,-40 160,20 Q150,60 110,60" fill={PIEL_T} stroke={TINTA} strokeWidth={6} />
          <path d="M-40,40 Q20,10 100,30" stroke={TINTA} strokeWidth={5} fill="none" />
        </g>
        {/* reloj de pared que marca las 3 */}
        <g transform="translate(1390,470)" opacity={lerp(g, 8, 16, 0, 1)}>
          <circle r={230} fill="#f4efe4" stroke="#3a3f48" strokeWidth={14} />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-5} y={-210} width={10} height={i % 3 ? 22 : 40} fill="#3a3f48" transform={`rotate(${i * 30})`} />)}
          <rect x={-9} y={-150} width={18} height={156} rx={9} fill="#221c18" transform={`rotate(${lerp(g, 10, 24, 0, 360)})`} />
          <rect x={-10} y={-110} width={20} height={116} rx={10} fill="#221c18" transform={`rotate(${lerp(g, 10, 24, 30, 90)})`} />
          <circle r={16} fill={ACENTO} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1390, top: 760, transform: "translateX(-50%)", fontFamily: F_HUD, fontWeight: 700, fontSize: 92, color: "#fff3d6", opacity: lerp(g, 14, 22, 0, 1), whiteSpace: "nowrap", textShadow: "0 4px 18px #000" }}>3:00 AM</div>
    </AbsoluteFill>
  );
};

// ---------- inserto: el farol de cerca; la llama de papel crece y se apaga sola, queda un hilo de humo ----------
export const FarolApaga: React.FC<{ t: number; humo: number }> = ({ t, humo }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #2a2622, #0c0d10 70%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <FarolPapel x={960} y={1010} s={5.2} luz={Math.max(0.08, t * 1.4)} halo={0.7} />
        <Llama x={960} y={760} t={t * 1.6} f={f} />
        {humo > 0 && [0, 1].map((k) => <path key={k} d={`M${960 + k * 20},${640} q${30 * Math.sin(f / 9 + k)},-60 0,-120 q${-30 * Math.sin(f / 9 + k)},-60 0,-120 q${30 * Math.sin(f / 7)},-60 0,-120`} stroke="#9aa0aa" strokeWidth={10 - k * 3} fill="none" strokeLinecap="round" opacity={0.5 * humo} />)}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- placa de dato con fondo propio (para medidores sobre fondos cargados) ----------
export const Placa: React.FC<{ x: number; y: number; w: number; h: number; o?: number }> = ({ x, y, w, h, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, background: "rgba(14,15,19,0.78)", border: "2px solid #4a4f58", opacity: o }} />
);

// ---------- hombro de Tenzo de espaldas en primer término: cabeza pelada, oreja, borde de barba blanca, túnica gris y rosario ----------
export const HombroTenzo: React.FC<{ x: number; y: number; r?: number; lado?: 1 | -1 }> = ({ x, y, r = 240, lado = -1 }) => {
  const f = useF();
  const dy = 2 * Math.sin(f / 41);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs><radialGradient id="htCab" cx="0.7" cy="0.35" r="0.8"><stop offset="0" stopColor="#f6c999" /><stop offset="1" stopColor="#9a6a44" /></radialGradient></defs>
        <g transform={`translate(${x},${y + dy}) scale(${lado},1)`}>
          <path d={`M${-r * 1.6},${r * 2.8} Q${-r * 1.5},${r * 0.95} ${-r * 0.45},${r * 0.78} L${r * 0.5},${r * 0.78} Q${r * 1.5},${r * 0.95} ${r * 1.6},${r * 2.8} Z`} fill="#6e6a63" />
          <path d={`M${-r * 0.2},${r * 0.8} L${r * 0.9},${r * 2.8}`} stroke="#5a5650" strokeWidth={r * 0.1} />
          {Array.from({ length: 7 }).map((_, k) => <circle key={k} cx={-r * 0.55 + k * r * 0.19} cy={r * 0.92 + Math.sin((k / 6) * Math.PI) * r * 0.22} r={r * 0.07} fill="#7a4a2a" />)}
          <circle cx={0} cy={0} r={r * 0.82} fill="url(#htCab)" />
          <ellipse cx={-r * 0.78} cy={r * 0.1} rx={r * 0.13} ry={r * 0.2} fill="#d99e6c" />
          <path d={`M${-r * 0.75},${r * 0.45} Q${-r * 0.5},${r * 0.95} ${0},${r * 0.9}`} stroke="#f4efe4" strokeWidth={r * 0.16} fill="none" strokeLinecap="round" />
          <path d={`M${-r * 0.4},${-r * 0.72} A${r * 0.82},${r * 0.82} 0 0 0 ${-r * 0.82},${r * 0.05}`} fill="none" stroke={ORO} strokeWidth={9} opacity={0.6} strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- inserto: el tel boca abajo sobre la mesa y el pulgar de Leo que tiembla hacia él (y se frena) ----------
export const PulgarTiembla: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useF();
  const g = Math.max(0, f - desde);
  const tir = 10 * Math.sin(g * 1.9) + 6 * Math.sin(g * 3.1); // temblor
  const avance = 60 * Math.sin(Math.min(1, g / 40) * Math.PI * 0.5) - 30 * Math.max(0, Math.sin((g - 40) / 12)); // se acerca y se frena
  return (
    <AbsoluteFill style={{ background: "#b9bec6" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect width={1920} height={1080} fill="#c9ccd2" />
        {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={0} y={k * 96} width={1920} height={3} fill="#b3b7be" />)}
        {/* tel boca abajo */}
        <g transform="translate(1260,560) rotate(8)">
          <rect x={-170} y={-320} width={340} height={640} rx={46} fill="#2a2d34" stroke="#121317" strokeWidth={8} />
          <rect x={-120} y={-280} width={110} height={170} rx={30} fill="#1a1c21" />
          <circle cx={-90} cy={-240} r={26} fill="#0d0e11" /><circle cx={-40} cy={-160} r={26} fill="#0d0e11" />
          <Halo x={0} y={330} r={260} color="#ff8a4a" fuerza={0.18 + 0.06 * Math.sin(f / 6)} />
        </g>
        {/* la mano de Leo: puño apoyado, el pulgar estirado que tiembla hacia el tel */}
        <g transform={`translate(${470 + avance},${640})`}>
          <path d="M-600,120 L-180,40 L-170,260 L-600,320 Z" fill="#24242a" />
          <path d="M-200,40 Q-40,-20 120,20 Q190,60 170,150 Q150,250 40,260 L-190,260 Z" fill={PIEL_L} stroke={TINTA} strokeWidth={7} strokeLinejoin="round" />
          {[0, 1, 2].map((k) => <path key={k} d={`M${60 - k * 70},${250} q20,-60 0,-120`} stroke={TINTA} strokeWidth={5} fill="none" />)}
          <g transform={`translate(120,40) rotate(${-18 + tir})`}>
            <rect x={0} y={-34} width={250} height={68} rx={34} fill={PIEL_L} stroke={TINTA} strokeWidth={7} />
            <rect x={196} y={-24} width={40} height={48} rx={14} fill="#f6e0cc" stroke={TINTA} strokeWidth={4} />
          </g>
          {[0, 1].map((k) => <path key={k} d={`M${390 + k * 22},${-60 + k * 30} l18,-10 M${390 + k * 22},${40 - k * 10} l18,10`} stroke="#3a2a22" strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(g * 2 + k)} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
