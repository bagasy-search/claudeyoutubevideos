// tz01 · vuelta 4 (planos 1-28): hombro de Tenzo en primer término (P25), toalla cenital con manos de verdad y farol
// visto desde arriba (P23/P26), dibujos para globos (cuenco tachado → corazón, la casa), carteles de Broadway por
// delante de la vía (P03) y el look de Leo a los 14.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useF } from "../anikit/camara";
import { Halo } from "../anikit/luz";
import { Look } from "../anikit/personaje";
import { ACENTO, LEO, ORO } from "../tenzo/elenco";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lerp = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], cl);
const TINTA = "#221c18";
const PIEL_T = "#f2bf8f";
const TUNICA = "#8e8a82";

// ---------- Leo a los 14: remera azul, sin capucha, sin auriculares ni ojeras, cuerpo corto ----------
export const LEO_NINO: Look = { ...LEO, camisa: "#3d7cc9", pantalon: "#34425e", zapatos: "#e9e4da", accesorios: [{ t: "pelo", forma: "punta", color: "#16141a" }], alto: 0.72 };

// ---------- P25 · Tenzo de espaldas en primer término (por encima del hombro): calva con brillo, oreja, punta de la
// ceja blanca y de la barba asomando por el perfil, túnica gris con pliegue y las cuentas sobre el hombro ----------
export const HombroTenzo: React.FC<{ x: number; y: number; r?: number; gira?: (f: number) => number }> = ({ x, y, r = 210, gira }) => {
  const f = useF();
  const g = gira ? gira(f) : 0; // 0..1: gira un poco la cabeza hacia Leo (asoma más perfil)
  const ox = -r * 0.92 - 10 * g; // borde izquierdo (hacia Leo)
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(${x},${y})`}>
          {/* túnica: hombro y espalda */}
          <path d={`M${-r * 1.5},${r * 2.6} C${-r * 1.45},${r * 1.25} ${-r * 0.8},${r * 0.82} 0,${r * 0.8} C${r * 0.9},${r * 0.82} ${r * 1.6},${r * 1.2} ${r * 1.7},${r * 2.6} Z`} fill={TUNICA} stroke={TINTA} strokeWidth={6} />
          <path d={`M${-r * 0.55},${r * 0.95} C${-r * 0.2},${r * 1.5} ${r * 0.3},${r * 1.7} ${r * 0.9},${r * 2.6}`} stroke="#77736b" strokeWidth={10} fill="none" strokeLinecap="round" />
          {/* cuentas de madera cruzando el hombro */}
          {Array.from({ length: 11 }).map((_, k) => {
            const t = k / 10;
            const bx = -r * 1.05 + t * r * 1.1, by = r * 0.98 + Math.sin(t * Math.PI) * r * 0.32;
            return <circle key={k} cx={bx} cy={by} r={r * 0.075} fill="#7a4a2a" stroke={TINTA} strokeWidth={3} />;
          })}
          {/* cuello */}
          <rect x={-r * 0.32} y={r * 0.55} width={r * 0.64} height={r * 0.4} fill={PIEL_T} stroke={TINTA} strokeWidth={5} />
          {/* barba: asoma por el perfil izquierdo, debajo de la mandíbula */}
          <path d={`M${ox + r * 0.12},${r * 0.2} q${-r * 0.22},${r * 0.35} ${r * 0.1},${r * 0.62} q${r * 0.12},${-r * 0.1} ${r * 0.26},${-r * 0.02} q${-r * 0.08},${-r * 0.32} ${-r * 0.1},${-r * 0.6} Z`} fill="#f4efe4" stroke={TINTA} strokeWidth={4} />
          {/* cabeza calva de espaldas */}
          <circle cx={0} cy={0} r={r} fill={PIEL_T} stroke={TINTA} strokeWidth={6} />
          <ellipse cx={r * 0.28} cy={-r * 0.5} rx={r * 0.26} ry={r * 0.14} fill="#fff4e4" opacity={0.55} transform={`rotate(-25 ${r * 0.28} ${-r * 0.5})`} />
          {/* oreja del lado de Leo */}
          <ellipse cx={ox + r * 0.02} cy={r * 0.02} rx={r * 0.16} ry={r * 0.24} fill={PIEL_T} stroke={TINTA} strokeWidth={5} />
          <path d={`M${ox + r * 0.02},${-r * 0.1} q${-r * 0.07},${r * 0.12} 0,${r * 0.24}`} stroke="#c98f62" strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* punta de la ceja blanca, encima de la oreja, por delante del perfil */}
          <path d={`M${ox + r * 0.05},${-r * 0.42} q${-r * 0.16},${-r * 0.06} ${-r * 0.3},${r * 0.04}`} stroke="#f6f1e6" strokeWidth={r * 0.09} fill="none" strokeLinecap="round" />
          <path d={`M${ox + r * 0.05},${-r * 0.42} q${-r * 0.16},${-r * 0.06} ${-r * 0.3},${r * 0.04}`} stroke={TINTA} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
          {/* borde de luz del farol (viene de la izquierda) */}
          <path d={`M${-r * 0.15},${-r * 0.99} A${r},${r} 0 0 0 ${-r * 0.98},${r * 0.2}`} fill="none" stroke={ORO} strokeWidth={9} opacity={0.6} strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- el farol de papel visto desde arriba: halo de borde suave, papel con varillas y el loto (sin disco duro) ----------
export const FarolArriba: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useF();
  const id = "fa" + React.useId().replace(/:/g, "");
  const t = 0.92 + 0.08 * Math.sin(f / 9) * Math.sin(f / 4.3);
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="#fff6dc" stopOpacity={1} />
          <stop offset="55%" stopColor="#ffd88e" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#ffb85a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <Halo x={x} y={y} r={380 * s} color={ORO} fuerza={0.42 * t} />
      <circle cx={x} cy={y} r={120 * s} fill={`url(#${id})`} opacity={0.75 * t} />
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <circle r={52} fill="#ffe7b8" opacity={0.95} />
        {[0, 30, 60, 90, 120, 150].map((a) => <line key={a} x1={-52 * Math.cos((a * Math.PI) / 180)} y1={-52 * Math.sin((a * Math.PI) / 180)} x2={52 * Math.cos((a * Math.PI) / 180)} y2={52 * Math.sin((a * Math.PI) / 180)} stroke="#e2b77a" strokeWidth={2.5} opacity={0.7} />)}
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-16} rx={7} ry={15} fill="#e88a5a" opacity={0.75} transform={`rotate(${a})`} />)}
        <circle r={6} fill="#c9603a" opacity={0.8} />
        <circle r={52} fill="none" stroke="#d9a868" strokeWidth={2} opacity={0.6} />
      </g>
    </g>
  );
};

// ---------- mano de Tenzo vista desde arriba: manga gris con puño, palma, 4 dedos que pellizcan, pulgar ----------
export const ManoTenzoArriba: React.FC<{ x: number; y: number; rot: number; s?: number; agarra?: number }> = ({ x, y, rot, s = 1, agarra = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {/* manga ancha con puño */}
    <path d="M-62,90 L-78,520 L78,520 L62,90 Z" fill={TUNICA} stroke={TINTA} strokeWidth={5} />
    <path d="M-30,140 L-40,500" stroke="#77736b" strokeWidth={8} strokeLinecap="round" />
    <rect x={-66} y={70} width={132} height={40} rx={14} fill="#77736b" stroke={TINTA} strokeWidth={5} />
    {/* dedos (doblados según agarra) */}
    {[-30, -10, 10, 30].map((dx, i) => {
      const L = (78 - Math.abs(i - 1.5) * 10) * (1 - 0.45 * agarra);
      return <rect key={i} x={dx - 13} y={-38 - L} width={26} height={L + 40} rx={13} fill={PIEL_T} stroke={TINTA} strokeWidth={4.5} />;
    })}
    {/* palma */}
    <path d="M-48,-30 Q-52,40 -40,72 L40,72 Q52,40 48,-30 Q0,-52 -48,-30 Z" fill={PIEL_T} stroke={TINTA} strokeWidth={5} />
    {/* pulgar */}
    <rect x={-13} y={-62} width={26} height={70} rx={13} fill={PIEL_T} stroke={TINTA} strokeWidth={4.5} transform={`rotate(${-62 + 22 * agarra} -40 20)`} />
    <path d="M-26,22 q24,12 48,0" stroke="#c98f62" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

// ---------- P23 · la toalla vista desde arriba, doblándose esquina con esquina (pantalla completa) ----------
export const ToallaCenital2: React.FC<{ p: number }> = ({ p }) => {
  const f = useF();
  const S = 540, cx = 900, cy = 560;
  const t1 = Math.min(1, p / 0.5), t2 = Math.max(0, (p - 0.5) / 0.5);
  const e = (t: number) => t * t * (3 - 2 * t);
  const a = e(t1), b = e(t2);
  const A = { x: cx - S / 2, y: cy - S / 2 }, B = { x: cx + S / 2, y: cy - S / 2 }, C = { x: cx + S / 2, y: cy + S / 2 }, D = { x: cx - S / 2, y: cy + S / 2 };
  const Cm = { x: C.x + (A.x - C.x) * a, y: C.y + (A.y - C.y) * a };
  const M = { x: (B.x + D.x) / 2, y: (B.y + D.y) / 2 };
  const Dm = { x: D.x + (B.x - D.x) * b, y: D.y + (B.y - D.y) * b };
  const tela = "#e9e6e0", sombra = "#c9c4ba", dorso = "#f6f4f0";
  const lleva = b > 0 ? Dm : Cm; // la punta que viaja
  const sost = b > 0 ? B : A; // la punta que se sostiene
  const tri = (q: { x: number; y: number }[]) => `M${q.map((k) => `${k.x},${k.y}`).join(" L")} Z`;
  // ángulo del brazo que lleva la punta: el antebrazo viene desde abajo a la derecha
  const respira = 4 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{ background: "#7c8088" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={140} y={150} width={1640} height={820} rx={18} fill="#c3c6cb" />
        {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={140} y={190 + k * 86} width={1640} height={3} fill="#b2b5ba" />)}
        <FarolArriba x={1520} y={330} s={1.15} />
        {/* sombra suave de la toalla sobre la mesa */}
        <path d={tri([{ x: A.x + 10, y: A.y + 14 }, { x: B.x + 10, y: B.y + 14 }, { x: D.x + 10, y: D.y + 14 }])} fill="#000" opacity={0.08} />
        {b === 0 && <>
          <path d={tri([A, B, D])} fill={tela} />
          {[0.2, 0.4, 0.6, 0.8].map((k) => <line key={k} x1={A.x} y1={A.y + S * k} x2={A.x + S * (1 - k)} y2={A.y + S * k} stroke={sombra} strokeWidth={3} opacity={0.6} />)}
          <path d={tri([B, Cm, D])} fill={a > 0.5 ? dorso : tela} stroke="#bdb8ae" strokeWidth={3} />
        </>}
        {b > 0 && <>
          <path d={tri([A, B, M])} fill={dorso} stroke="#bdb8ae" strokeWidth={3} />
          <path d={tri([A, M, Dm])} fill={b > 0.5 ? "#fbfaf7" : sombra} stroke="#bdb8ae" strokeWidth={3} />
        </>}
        {/* la mano que sostiene (desde abajo a la izquierda) y la que lleva la punta (desde abajo a la derecha) */}
        <ManoTenzoArriba x={sost.x + (b > 0 ? 10 : -10)} y={sost.y + 34} rot={b > 0 ? -30 : 32} s={0.95} agarra={0.5} />
        <ManoTenzoArriba x={lleva.x + (b > 0 ? -8 : 10)} y={lleva.y + 26 + respira} rot={b > 0 ? 34 : -40} s={0.95} agarra={0.45} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- dibujos para globos de pensamiento (coordenadas del globo) ----------
// cuenco de arroz con palitos; `tacha` 0..1 dibuja la cruz
export const CuencoTachado: React.FC<{ x: number; y: number; s?: number; tacha: number }> = ({ x, y, s = 1, tacha }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-70,-6 Q-70,70 0,74 Q70,70 70,-6 Z" fill="#c8553a" stroke={TINTA} strokeWidth={5} />
    <path d="M-40,40 q40,16 80,0" stroke="#e98a6a" strokeWidth={5} fill="none" />
    <path d="M-66,-6 Q-50,-48 0,-50 Q50,-48 66,-6 Z" fill="#fbf7ee" stroke={TINTA} strokeWidth={5} />
    {[[-30, -24], [-6, -34], [20, -26], [36, -14], [-44, -12]].map(([a, b2], i) => <ellipse key={i} cx={a} cy={b2} rx={6} ry={4} fill="#e8e1d2" />)}
    <path d="M18,-40 L96,-96 M30,-34 L108,-84" stroke="#a8743a" strokeWidth={7} strokeLinecap="round" />
    <path d={`M-80,-70 L${-80 + 160 * tacha},${-70 + 150 * tacha}`} stroke={ACENTO} strokeWidth={13} strokeLinecap="round" opacity={tacha > 0 ? 1 : 0} />
    <path d={`M80,-70 L${80 - 160 * Math.max(0, tacha * 2 - 1)},${-70 + 150 * Math.max(0, tacha * 2 - 1)}`} stroke={ACENTO} strokeWidth={13} strokeLinecap="round" opacity={tacha > 0.5 ? 1 : 0} />
  </g>
);
// corazón con brillo cálido que late; `p` 0..1 aparece
export const CorazonLuz: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => {
  const f = useF();
  const lat = 1 + 0.08 * Math.max(0, Math.sin(f / 4)) * p;
  return (
    <g transform={`translate(${x},${y}) scale(${s * (0.6 + 0.4 * p) * lat})`} opacity={p}>
      <Halo x={0} y={0} r={110} color={ORO} fuerza={0.5} />
      <path d="M0,40 C-70,-4 -66,-62 -26,-62 C-10,-62 0,-50 0,-38 C0,-50 10,-62 26,-62 C66,-62 70,-4 0,40 Z" fill="#ffcf7a" stroke={TINTA} strokeWidth={5} />
      <path d="M-30,-40 q-14,10 -12,26" stroke="#fff4d8" strokeWidth={7} fill="none" strokeLinecap="round" />
    </g>
  );
};
// la casa: techo, ventana con luz, puerta y la cama adentro
export const CasaLejos: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-110,-10 L0,-100 L110,-10 Z" fill="#6a707b" stroke={TINTA} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-90} y={-12} width={180} height={130} fill="#c9ced6" stroke={TINTA} strokeWidth={5} />
    <rect x={-66} y={14} width={60} height={50} fill="#ffcf7a" stroke={TINTA} strokeWidth={4} />
    <line x1={-36} y1={14} x2={-36} y2={64} stroke={TINTA} strokeWidth={3} />
    <rect x={20} y={40} width={44} height={78} rx={4} fill="#5a4a3a" stroke={TINTA} strokeWidth={4} />
    <circle cx={56} cy={82} r={4} fill="#f1d36b" />
  </g>
);

// ---------- P03 · los carteles de GREEN MILL y LAWRENCE redibujados POR DELANTE de la vía elevada (mismas coords del set) ----------
export const CartelesBroadway: React.FC = () => {
  const f = useF();
  const P = 900;
  const parp = Math.sin(f * 1.7) * Math.sin(f / 13) > 0.93 ? 0.45 : 1;
  const verde = "#cfeedd";
  return (
    <g>
      <g transform="translate(1750,0)">
        <rect x={-310} y={P - 470} width={620} height={110} rx={8} fill="#22262d" />
        {Array.from({ length: 22 }).map((_, k) => <circle key={k} cx={-290 + k * 27.5} cy={P - 462} r={5} fill={(k + Math.floor(f / 6)) % 3 ? "#f4f0dc" : "#9a9680"} />)}
        <text x={0} y={P - 400} fontSize={56} textAnchor="middle" fill={verde} opacity={parp} fontFamily="serif" fontWeight={800} letterSpacing={4}>GREEN MILL</text>
        <text x={0} y={P - 372} fontSize={20} textAnchor="middle" fill="#e8e4dc" fontFamily="sans-serif" fontWeight={700} letterSpacing={6}>COCKTAIL LOUNGE · JAZZ</text>
        <g transform="translate(250,-120)">
          <rect x={0} y={P - 760} width={84} height={380} rx={10} fill="#22262d" stroke={verde} strokeWidth={4} opacity={parp} />
          {"GREEN".split("").map((c, k) => <text key={k} x={42} y={P - 700 + k * 62} fontSize={50} textAnchor="middle" fill={verde} opacity={parp} fontFamily="serif" fontWeight={800}>{c}</text>)}
        </g>
      </g>
      <g transform="translate(2800,0)">
        <rect x={-300} y={P - 480} width={600} height={70} rx={6} fill="#e8e6e0" />
        <circle cx={-240} cy={P - 445} r={24} fill="#c23a32" />
        <text x={-240} y={P - 437} fontSize={22} textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontWeight={800}>CTA</text>
        <text x={30} y={P - 430} fontSize={44} textAnchor="middle" fill="#22262d" fontFamily="sans-serif" fontWeight={800} letterSpacing={6}>LAWRENCE</text>
      </g>
    </g>
  );
};

// ---------- P09 · el parpadeo de la pantalla: un destello blanco-ámbar que sale desde abajo (la notificación) ----------
export const Destello: React.FC<{ f0: number; color?: string }> = ({ f0, color = "#ffe2c4" }) => {
  const f = useF();
  const o = f < f0 ? 0 : lerp(f, f0, f0 + 2, 0, 0.55) * lerp(f, f0 + 3, f0 + 14, 1, 0);
  return <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 60% 110%, ${color}, transparent 62%)`, opacity: o }} />;
};
