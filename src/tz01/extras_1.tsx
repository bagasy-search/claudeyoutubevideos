// tz01 · helpers de la vuelta 3 para planos1 (P01-P28): espejo de contraplano, texto a mano con placa,
// manos cenitales (P02), panel «nunca grita» (P13), palma que alisa la toalla (P26), barra del día con Leo encima (P06).
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { ACENTO, ORO } from "../tenzo/elenco";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lerp = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], cl);
const TINTA = "#3a2a20";
const PIEL = "#ecc9a3";

// ---------- contraplano: el set entero espejado (sólo sets SIN texto: el cuarto) ----------
export const Espejo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ transform: "scaleX(-1)" }}>{children}</AbsoluteFill>
);

// ---------- texto a mano (voz de Mara) sobre placa oscura: nunca se pierde contra el fondo ni detrás de una cabeza ----------
export const TextoPlaca: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string; vel?: number; centro?: boolean }> = ({ texto, x, y, desde, hasta, tam = 70, color = ACENTO, vel = 1.4, centro }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const n = (f - desde) * vel;
  const o = lerp(f, desde, desde + 6, 0, 1) * (hasta !== undefined ? lerp(f, hasta - 8, hasta, 1, 0) : 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: centro ? "translateX(-50%)" : undefined, opacity: o, background: "rgba(12,9,10,0.72)", border: `2px solid ${color}55`, borderRadius: 18, padding: "4px 26px 10px", whiteSpace: "pre", fontFamily: F_MANO, fontWeight: 700, fontSize: tam, lineHeight: 1.05, color, textShadow: `0 0 14px ${color}88` }}>
      {/* el texto entero ocupa su lugar desde el principio (la placa no crece); las letras se escriben encima */}
      {texto.split("").map((c, i) => {
        const a = Math.min(1, Math.max(0, n - i));
        return <span key={i} style={{ opacity: a, display: "inline-block", transform: `translateY(${(1 - a) * 6}px)` }}>{c === " " ? " " : c}</span>;
      })}
    </div>
  );
};

// ---------- mano vista desde arriba: palma + 4 dedos + pulgar; `cierra` 0..1 encoge los dedos (se cierra en el vacío) ----------
const ManoArriba: React.FC<{ x: number; y: number; rot: number; cierra: number; s?: number; manga?: string; fantasma?: boolean }> = ({ x, y, rot, cierra, s = 1, manga = "#24242a", fantasma }) => {
  const dedos = [-36, -12, 12, 36];
  const largos = [92, 112, 106, 84];
  const st = fantasma ? { fill: "#e9e3d622", stroke: "#e9e3d6", strokeWidth: 7, strokeDasharray: "14 10" } : { fill: PIEL, stroke: TINTA, strokeWidth: 5 };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {!fantasma && <path d="M0,40 L0,560" stroke={manga} strokeWidth={150} strokeLinecap="round" />}
      {dedos.map((a, i) => {
        const L = largos[i] * (1 - 0.62 * cierra);
        return <rect key={i} x={-17} y={-70 - L} width={34} height={L + 30} rx={17} transform={`rotate(${a * (1 - 0.3 * cierra)} 0 -40)`} {...st} />;
      })}
      <rect x={-17} y={-90 * (1 - 0.45 * cierra)} width={34} height={90 * (1 - 0.45 * cierra) + 20} rx={17} transform={`rotate(${-78 + 40 * cierra} 0 0) translate(-58,10)`} {...st} />
      <ellipse cx={0} cy={0} rx={78} ry={86} {...st} />
      {!fantasma && <path d={`M-40,${-10 + 20 * cierra} q40,${18 - 10 * cierra} 70,-6`} stroke="#c99f78" strokeWidth={4} fill="none" strokeLinecap="round" />}
    </g>
  );
};
// P02 · plano detalle cenital: la mano derecha scrollea el tel; la izquierda, abierta sobre la frazada, se cierra en el vacío;
// una mano «fantasma» punteada viene desde arriba y se borra antes de llegar.
export const ManosCenital: React.FC = () => {
  const f = useF();
  const pulgar = Math.sin(f / 3.2) * 34;
  const cierra = lerp(f, 30, 56, 0, 1);
  const fant = lerp(f, 4, 26, 0, 1) * lerp(f, 34, 48, 1, 0);
  const fy = lerp(f, 2, 40, -120, 230);
  return (
    <AbsoluteFill style={{ background: "#2f3542" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* frazada con pliegues */}
        {[180, 420, 700, 930].map((y, i) => <path key={i} d={`M-40,${y} C400,${y - 60} 900,${y + 70} 1960,${y - 20}`} stroke="#252a35" strokeWidth={26} fill="none" opacity={0.7} />)}
        <path d="M-40,1000 C500,960 1100,1040 1960,990 L1960,1080 L-40,1080 Z" fill="#3a4152" />
        {/* el tel en la mano derecha */}
        <g transform="translate(1260,520) rotate(12)">
          <Halo x={0} y={0} r={420} color={ACENTO} fuerza={0.45} />
          <rect x={-150} y={-280} width={300} height={560} rx={40} fill="#15171c" />
          <rect x={-134} y={-262} width={268} height={524} rx={30} fill="#262a32" />
          {[0, 1, 2, 3, 4].map((k) => { const yy = ((k * 120 - f * 9) % 600 + 600) % 600 - 262; return <g key={k}><rect x={-118} y={yy} width={236} height={86} rx={12} fill={k % 2 ? "#3c414b" : "#4a3a33"} /><circle cx={-80} cy={yy + 43} r={20} fill={k % 2 ? "#6a707b" : ACENTO} /></g>; })}
          <rect x={-134} y={-262} width={268} height={524} rx={30} fill="none" stroke="#15171c" strokeWidth={6} />
          {/* dedos que abrazan el borde y pulgar que sube y baja */}
          {[0, 1, 2, 3].map((k) => <rect key={k} x={128} y={-150 + k * 82} width={70} height={66} rx={32} fill={PIEL} stroke={TINTA} strokeWidth={5} />)}
          <path d="M150,330 L150,900" stroke="#24242a" strokeWidth={240} strokeLinecap="round" />
          <path d="M60,300 C120,240 180,200 190,120 L200,320 Z" fill={PIEL} stroke={TINTA} strokeWidth={5} />
          <rect x={-40} y={40 + pulgar} width={64} height={220} rx={32} fill={PIEL} stroke={TINTA} strokeWidth={5} transform={`rotate(-24 0 ${150 + pulgar})`} />
        </g>
        {/* la mano izquierda, vacía */}
        <ManoArriba x={640} y={660} rot={-14} cierra={cierra} s={1.45} />
        {/* la que nunca llega */}
        <g opacity={fant}><ManoArriba x={600} y={fy} rot={170} cierra={0} s={1.3} fantasma /></g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- P13 · panel «nunca grita»: megáfono tachado + barras de volumen (sólo la primera prendida) + WHISPER ----------
export const PanelSusurro: React.FC<{ x: number; y: number; desde: number; tachar: number }> = ({ x, y, desde, tachar }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 160 } });
  const t = lerp(f, tachar, tachar + 8, 0, 1);
  const barras = lerp(f, desde + 4, desde + 24, 0, 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 460, transform: `scale(${0.9 + 0.1 * s})`, opacity: s, transformOrigin: "50% 0", background: "rgba(14,15,19,0.82)", borderRadius: 26, padding: "26px 30px 22px", border: "2px solid #ffffff22" }}>
      <svg width={400} height={150} style={{ display: "block" }}>
        <g transform="translate(70,75)">
          <path d="M-40,-22 L0,-22 L60,-60 L60,60 L0,22 L-40,22 Z" fill="#c9ced6" />
          {[0, 1, 2].map((k) => <path key={k} d={`M${80 + k * 22},-30 q16,30 0,60`} stroke="#c9ced6" strokeWidth={6} fill="none" strokeLinecap="round" opacity={1 - t * 0.7} />)}
          <line x1={-56} y1={-66} x2={-56 + 200 * t} y2={-66 + 132 * t} stroke={ACENTO} strokeWidth={14} strokeLinecap="round" />
        </g>
        <text x={240} y={70} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe6" letterSpacing={2}>NEVER</text>
        <text x={240} y={116} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f4efe6" letterSpacing={2}>SHOUTS</text>
      </svg>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 110, marginTop: 14 }}>
        {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ width: 52, height: 30 + k * 16, borderRadius: 8, background: k === 0 ? ACENTO : "#3a3f48", opacity: barras > k ? 1 : 0.15 }} />)}
      </div>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 52, color: ACENTO, letterSpacing: 8, marginTop: 10 }}>WHISPER</div>
    </div>
  );
};

// ---------- P26 · cenital: la palma de Tenzo (manga gris) alisa la toalla doblada; las arrugas se van detrás de la mano ----------
export const PalmaToalla: React.FC<{ desde?: number; hasta: number }> = ({ desde = 0, hasta }) => {
  const f = useF();
  const u = lerp(f, desde, hasta, 0, 1);
  const ida = u < 0.5 ? u * 2 : 2 - u * 2; // va y vuelve
  const hx = 620 + 640 * ida;
  const pasada = u > 0 ? 1 : 0;
  const maxX = 620 + 640 * Math.min(1, u * 2); // hasta dónde llegó la palma (lo que ya pasó queda liso)
  return (
    <AbsoluteFill style={{ background: "#7c8088" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={120} y={140} width={1680} height={820} rx={18} fill="#c3c6cb" />
        {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={120} y={180 + k * 86} width={1680} height={3} fill="#b2b5ba" />)}
        <Halo x={1560} y={300} r={360} color={ORO} fuerza={0.45} />
        <circle cx={1560} cy={300} r={46} fill="#ffe2a8" stroke="#a87a3a" strokeWidth={4} />
        {/* toalla doblada */}
        <rect x={560} y={330} width={760} height={460} rx={20} fill="#ece9e3" stroke="#bdb8ae" strokeWidth={4} />
        <line x1={560} y1={560} x2={1320} y2={560} stroke="#d4cfc5" strokeWidth={4} />
        {/* arrugas: se borran a medida que pasa la palma */}
        {[[640, 420, 260], [720, 640, 300], [980, 470, 240], [1060, 700, 200], [860, 520, 180]].map(([x, y, w], i) => {
          const borrada = (x as number) + (w as number) / 2 < maxX - 40 && pasada > 0 ? 1 : 0;
          return <path key={i} d={`M${x},${y} q${(w as number) / 4},-18 ${(w as number) / 2},0 t${(w as number) / 2},0`} stroke="#b9b3a8" strokeWidth={5} fill="none" strokeLinecap="round" opacity={1 - 0.9 * borrada} />;
        })}
        {/* la mano de palma abierta, manga gris desde abajo a la derecha */}
        <g transform={`translate(${hx},${560 + 10 * Math.sin(u * Math.PI * 4)})`}>
          <path d="M60,60 L420,620" stroke="#8e8a82" strokeWidth={170} strokeLinecap="round" />
          <path d="M60,60 L120,150" stroke="#7a766e" strokeWidth={176} strokeLinecap="butt" opacity={0.5} />
          {[-30, -10, 10, 30].map((a, i) => <rect key={i} x={-16} y={-176} width={32} height={120 - Math.abs(i - 1.5) * 12} rx={16} transform={`rotate(${a - 20} 0 0)`} fill="#f2bf8f" stroke="#221c18" strokeWidth={5} />)}
          <rect x={-16} y={-110} width={32} height={96} rx={16} transform="rotate(-100 0 0) translate(0,-20)" fill="#f2bf8f" stroke="#221c18" strokeWidth={5} />
          <ellipse cx={0} cy={0} rx={82} ry={90} fill="#f2bf8f" stroke="#221c18" strokeWidth={5} transform="rotate(-20)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
