// Símbolos expresivos 2D (estilo manga/cartoon) que se cuelgan de los personajes 3D: ! ? sudor calavera corazón
// bombilla zzz estrellas enojo moneda olor pulgas. En coordenadas del MUNDO (van en la capa `sobre` de EscenaB).
// Entran con resorte (pop con rebote), se mecen lento (≤1 Hz) y salen con un fundido corto. Deterministas.
import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";

export type TipoSimbolo = "!" | "?" | "!?" | "sudor" | "calavera" | "corazon" | "bombilla" | "zzz" | "estrellas" | "enojo" | "moneda" | "olor" | "pulgas" | "nota";
export type SimboloProps = { tipo: TipoSimbolo; x: number; y: number; desde: number; hasta?: number; s?: number; color?: string };

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TINTA = "#1d1410";

export const Simbolo: React.FC<SimboloProps> = ({ tipo, x, y, desde, hasta, s = 1, color }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const fin = hasta ?? desde + 60;
  if (f < desde || f > fin + 8) return null;
  const t = f - desde;
  const pop = spring({ frame: t, fps, config: { damping: 9, stiffness: 180, mass: 0.6 } });
  const o = interpolate(f, [fin, fin + 8], [1, 0], cl);
  const mece = Math.sin((t / fps) * 1.0 * 2 * Math.PI) * 6;
  const k = s * pop;
  const g = (hijo: React.ReactNode, rot = mece) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`} opacity={o}>{hijo}</g>;
  const c = color;
  switch (tipo) {
    case "!":
      return g(<g><path d="M-14 -110 L14 -110 L8 -30 L-8 -30 Z" fill={c ?? "#ff4a3d"} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" /><circle cy={-6} r={12} fill={c ?? "#ff4a3d"} stroke={TINTA} strokeWidth={6} /></g>);
    case "?":
      return g(<g><path d="M-30 -84 Q-30 -120 0 -120 Q34 -120 34 -88 Q34 -64 8 -54 L8 -32" stroke={TINTA} strokeWidth={26} fill="none" strokeLinecap="round" /><path d="M-30 -84 Q-30 -120 0 -120 Q34 -120 34 -88 Q34 -64 8 -54 L8 -32" stroke={c ?? "#ffc93c"} strokeWidth={14} fill="none" strokeLinecap="round" /><circle cx={8} cy={-6} r={12} fill={c ?? "#ffc93c"} stroke={TINTA} strokeWidth={6} /></g>);
    case "!?":
      return <g>{<Simbolo tipo="!" x={x - 30} y={y} desde={desde} hasta={hasta} s={s * 0.85} />}{<Simbolo tipo="?" x={x + 34} y={y + 4} desde={desde + 3} hasta={hasta} s={s * 0.85} />}</g>;
    case "sudor": {
      const caida = (t % 40) / 40;
      return g(<g>
        <path d="M0 -60 Q22 -24 0 -8 Q-22 -24 0 -60 Z" fill={c ?? "#7fd0ff"} stroke={TINTA} strokeWidth={5} />
        <path d="M-4 -34 q2 -8 6 -12" stroke="#fff" strokeWidth={4} fill="none" />
        <g transform={`translate(${-34},${caida * 50})`} opacity={1 - caida}><path d="M0 -30 Q11 -12 0 -4 Q-11 -12 0 -30 Z" fill={c ?? "#7fd0ff"} stroke={TINTA} strokeWidth={4} /></g>
      </g>, 0);
    }
    case "calavera":
      return g(<g>
        <path d="M-40 -60 Q-40 -110 0 -110 Q40 -110 40 -60 Q40 -36 24 -30 L24 -12 L-24 -12 L-24 -30 Q-40 -36 -40 -60 Z" fill="#f6f1e6" stroke={TINTA} strokeWidth={6} />
        <circle cx={-16} cy={-62} r={11} fill={TINTA} /><circle cx={16} cy={-62} r={11} fill={TINTA} /><path d="M0 -48 l-6 10 h12 Z" fill={TINTA} />
        <path d="M-12 -24 v12 M0 -24 v12 M12 -24 v12" stroke={TINTA} strokeWidth={4} />
      </g>);
    case "corazon": {
      const late = 1 + 0.12 * Math.max(0, Math.sin((t / fps) * 2 * 2 * Math.PI));
      return g(<g transform={`scale(${late})`}><path d="M0 -10 C-60 -50 -40 -110 0 -80 C40 -110 60 -50 0 -10 Z" fill={c ?? "#ff4f7a"} stroke={TINTA} strokeWidth={6} /><path d="M-24 -78 q-10 8 -8 20" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" /></g>);
    }
    case "bombilla": {
      const brillo = interpolate(t, [6, 14], [0, 1], cl);
      return g(<g>
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d="M0 -96 v-24" stroke="#ffd23c" strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 45 - 157} 0 -60)`} opacity={brillo} />)}
        <circle cy={-66} r={36} fill={brillo > 0.5 ? "#ffe680" : "#f4f0dc"} stroke={TINTA} strokeWidth={6} />
        <rect x={-16} y={-34} width={32} height={22} rx={4} fill="#9a9a9a" stroke={TINTA} strokeWidth={5} />
      </g>, mece * 0.5);
    }
    case "zzz":
      return <g opacity={o}>{[0, 1, 2].map((i) => {
        const u = ((t / fps) * 0.5 + i / 3) % 1;
        return <text key={i} x={x + u * 70} y={y - u * 120} fontSize={(34 + i * 10) * s} fontFamily="Arial Black, Arial" fontWeight={900} fill="#e8f2ff" stroke={TINTA} strokeWidth={5} paintOrder="stroke" opacity={Math.sin(u * Math.PI)}>Z</text>;
      })}</g>;
    case "estrellas":
      return <g opacity={o}>{[0, 1, 2].map((i) => {
        const a = (t / fps) * 1.0 * 2 * Math.PI + (i * 2 * Math.PI) / 3;
        const ex = x + Math.cos(a) * 70 * s, ey = y - 20 + Math.sin(a) * 22 * s;
        return <path key={i} transform={`translate(${ex},${ey}) scale(${s * pop})`} d="M0 -20 L6 -6 L20 -6 L9 3 L13 18 L0 9 L-13 18 L-9 3 L-20 -6 L-6 -6 Z" fill="#ffd23c" stroke={TINTA} strokeWidth={4} />;
      })}</g>;
    case "enojo":
      return g(<g stroke={c ?? "#ff3b30"} strokeWidth={12} strokeLinecap="round" fill="none">
        <path d="M-30 -70 q14 4 18 18" /><path d="M30 -70 q-14 4 -18 18" /><path d="M-30 -30 q14 -4 18 -18" /><path d="M30 -30 q-14 -4 -18 -18" />
      </g>, 0);
    case "moneda": {
      const gira = Math.cos((t / fps) * 1.2 * Math.PI);
      return g(<g transform={`scale(${Math.max(0.15, Math.abs(gira))},1)`}><circle cy={-50} r={36} fill="#d8d8d0" stroke={TINTA} strokeWidth={6} /><circle cy={-50} r={24} fill="none" stroke="#9a9a90" strokeWidth={4} /><path d="M0 -66 v32 M-14 -50 h28" stroke="#8a8a80" strokeWidth={5} /></g>, 0);
    }
    case "olor":
      return <g opacity={o * 0.9}>{[0, 1, 2].map((i) => {
        const u = ((t / fps) * 0.4 + i / 3) % 1;
        return <path key={i} d={`M${x - 40 + i * 40} ${y - u * 120} q-14 -20 0 -40 q14 -20 0 -40`} stroke={c ?? "#8fbf3a"} strokeWidth={8 * s} fill="none" strokeLinecap="round" opacity={Math.sin(u * Math.PI)} />;
      })}</g>;
    case "pulgas":
      return <g opacity={o}>{Array.from({ length: 9 }).map((_, i) => {
        const u = ((t / fps) * 1.4 + i * 0.37) % 1;
        const bx = x + ((i * 53) % 160) - 80, by = y - Math.sin(u * Math.PI) * (40 + (i % 3) * 24);
        return <ellipse key={i} cx={bx + u * 30} cy={by} rx={5 * s} ry={3.5 * s} fill="#2a1a10" />;
      })}</g>;
    case "nota":
      return g(<g><path d="M-10 -20 V-96 L34 -108 V-32" stroke={TINTA} strokeWidth={8} fill="none" /><ellipse cx={-20} cy={-20} rx={16} ry={12} fill={TINTA} /><ellipse cx={24} cy={-32} rx={16} ry={12} fill={TINTA} /></g>);
  }
  return null;
};
