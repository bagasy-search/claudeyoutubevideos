// <IconoGrande>: el ícono plano y grande AL LADO DE LA CABEZA en los planos medios cortos (la ref del creador: el cartel
// de advertencia junto al personaje). En coordenadas de PANTALLA (capa hud). Entra con resorte y un giro chico, se mece
// lento (≤0,5 Hz) y sale achicándose. Dibujos planos con contorno marrón oscuro, misma tinta que los personajes.
import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";

export type TipoIcono = "alerta" | "sol_no" | "calavera" | "moneda_no" | "casa_no" | "bombilla" | "reloj" | "pregunta" | "olor" | "zapatilla" | "cloaca_no" | "corazon" | "gota" | "inodoro" | "basura" | "gente";
const T = "#3a2414";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Tacha: React.FC = () => <g stroke="#e8352a" strokeWidth={22} strokeLinecap="round"><circle r={104} fill="none" /><path d="M-72 72 L72 -72" /></g>;

export const DibujoIcono: React.FC<{ tipo: TipoIcono; f: number }> = ({ tipo, f }) => {
  switch (tipo) {
    case "alerta":
      return <g><path d="M0 -112 L112 88 L-112 88 Z" fill="#f6c21c" stroke={T} strokeWidth={14} strokeLinejoin="round" /><path d="M0 -112 L112 88 L-112 88 Z" fill="none" stroke="#fff3c0" strokeWidth={5} transform="scale(0.8) translate(0 12)" /><rect x={-11} y={-48} width={22} height={86} rx={11} fill={T} /><circle cy={62} r={13} fill={T} /></g>;
    case "sol_no":
      return <g><g fill="#ffcf3a" stroke={T} strokeWidth={10}>{Array.from({ length: 8 }).map((_, i) => <path key={i} d="M-14 -70 L0 -104 L14 -70 Z" transform={`rotate(${i * 45 + f * 0.4})`} strokeLinejoin="round" />)}<circle r={58} /></g><Tacha /></g>;
    case "calavera":
      return <g><path d="M-78 -10 Q-78 -96 0 -96 Q78 -96 78 -10 Q78 30 50 44 L50 80 L-50 80 L-50 44 Q-78 30 -78 -10 Z" fill="#f4eee0" stroke={T} strokeWidth={12} strokeLinejoin="round" /><ellipse cx={-30} cy={-6} rx={22} ry={26} fill={T} /><ellipse cx={30} cy={-6} rx={22} ry={26} fill={T} /><path d="M0 22 L-12 44 L12 44 Z" fill={T} /><path d="M-26 80 V60 M0 80 V60 M26 80 V60" stroke={T} strokeWidth={8} /></g>;
    case "moneda_no":
      return <g><circle r={70} fill="#f0b830" stroke={T} strokeWidth={12} /><circle r={48} fill="none" stroke="#c88a18" strokeWidth={8} /><text y={26} textAnchor="middle" fontSize={78} fontWeight={900} fill="#8a5a10" fontFamily="Arial Black, sans-serif">£</text><Tacha /></g>;
    case "casa_no":
      return <g><path d="M-70 -6 L0 -70 L70 -6 V66 H-70 Z" fill="#e8c8a0" stroke={T} strokeWidth={12} strokeLinejoin="round" /><path d="M-86 4 L0 -78 L86 4" fill="none" stroke="#b5532e" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" /><rect x={-18} y={16} width={36} height={50} fill="#7a4a24" stroke={T} strokeWidth={8} /><Tacha /></g>;
    case "bombilla": {
      const brillo = 0.6 + 0.4 * Math.sin(f * 0.18);
      return <g>{Array.from({ length: 7 }).map((_, i) => <path key={i} d="M0 -96 V-122" stroke="#ffd23c" strokeWidth={12} strokeLinecap="round" opacity={brillo} transform={`rotate(${-90 + i * 30})`} />)}<path d="M-56 -20 Q-56 -86 0 -86 Q56 -86 56 -20 Q56 12 30 36 V56 H-30 V36 Q-56 12 -56 -20 Z" fill="#ffe66a" stroke={T} strokeWidth={12} strokeLinejoin="round" /><rect x={-30} y={56} width={60} height={30} rx={8} fill="#a8a8a8" stroke={T} strokeWidth={10} /></g>;
    }
    case "reloj": {
      const arena = (f % 120) / 120;
      return <g><rect x={-74} y={-104} width={148} height={20} rx={8} fill="#8a5a2e" stroke={T} strokeWidth={10} /><rect x={-74} y={84} width={148} height={20} rx={8} fill="#8a5a2e" stroke={T} strokeWidth={10} /><path d="M-56 -84 L56 -84 L8 0 L56 84 L-56 84 L-8 0 Z" fill="#e6f2f6" stroke={T} strokeWidth={10} strokeLinejoin="round" /><path d={`M${-40 + arena * 30} ${-56 + arena * 50} L${40 - arena * 30} ${-56 + arena * 50} L0 -4 Z`} fill="#e8a840" /><path d={`M-50 80 L50 80 L${30 - arena * 12} ${70 - arena * 30} L${-30 + arena * 12} ${70 - arena * 30} Z`} fill="#e8a840" /><path d="M0 -4 V76" stroke="#e8a840" strokeWidth={5} /></g>;
    }
    case "pregunta":
      return <g><circle r={96} fill="#ffffff" stroke={T} strokeWidth={12} /><text y={44} textAnchor="middle" fontSize={140} fontWeight={900} fill="#3a7ad8" stroke={T} strokeWidth={5} fontFamily="Arial Black, sans-serif">?</text></g>;
    case "olor":
      return <g fill="none" strokeLinecap="round" strokeWidth={22}>{[-50, 0, 50].map((x, i) => <path key={i} d={`M${x} 90 q-30 -30 0 -60 q30 -30 0 -60 q-24 -24 0 -48`} stroke={T} strokeWidth={34} transform={`translate(0 ${Math.sin(f * 0.15 + i) * 6})`} />)}{[-50, 0, 50].map((x, i) => <path key={i} d={`M${x} 90 q-30 -30 0 -60 q30 -30 0 -60 q-24 -24 0 -48`} stroke="#8fbf3a" transform={`translate(0 ${Math.sin(f * 0.15 + i) * 6})`} />)}</g>;
    case "zapatilla":
      return <g transform="scale(1.9)"><path d="M-46 0 Q-48 -34 -18 -38 L12 -32 Q44 -24 50 -6 L50 6 L-46 6 Z" fill="#fafafa" stroke={T} strokeWidth={6} /><path d="M-46 1 H50" stroke="#ff4a3d" strokeWidth={9} /><path d="M-12 -30 l10 10 M2 -30 l10 10" stroke="#3a6ad8" strokeWidth={5} /></g>;
    case "cloaca_no":
      return <g><circle r={70} fill="#6a6a6a" stroke={T} strokeWidth={12} />{[-36, -12, 12, 36].map((x) => <rect key={x} x={x - 6} y={-50} width={12} height={100} rx={6} fill="#2a2a2a" />)}<Tacha /></g>;
    case "gota":
      return <g><path d="M0 -110 Q66 -20 66 30 Q66 92 0 92 Q-66 92 -66 30 Q-66 -20 0 -110 Z" fill="#5ab8f0" stroke={T} strokeWidth={12} strokeLinejoin="round" /><path d="M-30 20 Q-32 56 -4 66" stroke="#d8f2ff" strokeWidth={12} fill="none" strokeLinecap="round" />{[0, 1, 2].map((i) => <circle key={i} cx={-22 + i * 26} cy={-6 + (i % 2) * 22} r={7 - i} fill="#6a8a2a" />)}</g>;
    case "inodoro":
      return <g><rect x={-62} y={-104} width={124} height={62} rx={12} fill="#f4eee0" stroke={T} strokeWidth={11} /><path d="M-80 -30 H80 Q80 40 30 52 L40 92 H-40 L-30 52 Q-80 40 -80 -30 Z" fill="#f4eee0" stroke={T} strokeWidth={11} strokeLinejoin="round" /><ellipse cy={-30} rx={80} ry={16} fill="#c8bca4" stroke={T} strokeWidth={9} /><rect x={38} y={-88} width={18} height={10} rx={4} fill={T} />{[-36, 0, 36].map((x, i) => <path key={i} d={`M${x} -118 q-12 -14 0 -28 q12 -14 0 -28`} stroke="#8fbf3a" strokeWidth={9} fill="none" strokeLinecap="round" transform={`translate(0 ${Math.sin(f * 0.15 + i) * 4})`} />)}</g>;
    case "basura":
      return <g><path d="M-62 -40 L62 -40 L50 92 L-50 92 Z" fill="#7a8a8a" stroke={T} strokeWidth={11} strokeLinejoin="round" /><rect x={-76} y={-62} width={152} height={24} rx={8} fill="#9aa8a8" stroke={T} strokeWidth={10} /><path d="M-22 -62 Q0 -84 22 -62" stroke={T} strokeWidth={9} fill="none" /><path d="M-24 -16 V70 M0 -16 V70 M24 -16 V70" stroke="#5a6868" strokeWidth={8} strokeLinecap="round" /><path d="M-40 -64 Q-62 -110 -24 -104 Q-8 -128 14 -100" fill="#f0c840" stroke={T} strokeWidth={8} /><path d="M30 -66 l26 -40 l14 10 z" fill="#c86a3a" stroke={T} strokeWidth={7} /></g>;
    case "gente":
      return <g>{[[-70, 20, "#f2c8a0"], [70, 20, "#e8b890"], [-36, -30, "#f6d8b8"], [36, -30, "#d8a880"], [0, 30, "#f4eee0"]].map(([x, y, c], i) => <g key={i} transform={`translate(${x} ${(y as number) + Math.sin(f * 0.2 + i) * 3})`}><path d="M-34 70 Q-34 30 0 30 Q34 30 34 70" fill="#8a5a3a" stroke={T} strokeWidth={8} /><circle r={30} fill={c as string} stroke={T} strokeWidth={8} /><circle cx={-9} cy={-3} r={4} fill={T} /><circle cx={9} cy={-3} r={4} fill={T} /></g>)}</g>;
    case "corazon":
      return <path d="M0 80 C-120 -10 -70 -100 0 -46 C70 -100 120 -10 0 80 Z" fill="#ff5a7a" stroke={T} strokeWidth={12} strokeLinejoin="round" />;
  }
};

export const IconoGrande: React.FC<{ tipo: TipoIcono; desde: number; hasta: number; x?: number; y?: number; tam?: number }> = ({ tipo, desde, hasta, x = 560, y = 330, tam = 1 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 8) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 9, stiffness: 170, mass: 0.7 } });
  const sal = interpolate(f, [hasta, hasta + 8], [1, 0], cl);
  const r = (1 - s) * -18 + Math.sin((f - desde) * 0.09) * 3;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
      <g transform={`translate(${x},${y + Math.sin((f - desde) * 0.07) * 6}) rotate(${r}) scale(${s * sal * tam})`}>
        <g transform="translate(6,10)" opacity={0.25}><g style={{ filter: "brightness(0)" }}><DibujoIcono tipo={tipo} f={f} /></g></g>
        <DibujoIcono tipo={tipo} f={f} />
      </g>
    </svg>
  );
};

// <Globo>: el globito de diálogo con un emoji/vector adentro (en vez de la palabra: AGUA → gota, BAÑO → inodoro…).
// Sale de la cabeza con un «pop» de burbuja (estira y rebota), el dibujo entra 3 cuadros después, se mece lento y
// se revienta achicándose. La cola apunta a `cola` (la boca/cabeza en pantalla). El blip suave va en la mezcla.
export const Globo: React.FC<{ tipo?: TipoIcono; texto?: string; desde: number; hasta: number; x: number; y: number; cola: [number, number]; tam?: number; color?: string }> = ({ tipo, texto, desde, hasta, x, y, cola, tam = 1, color = "#fffaf0" }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 7) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 7, stiffness: 220, mass: 0.6 } });
  const si = spring({ frame: f - desde - 3, fps, config: { damping: 8, stiffness: 200, mass: 0.6 } });
  const sal = interpolate(f, [hasta, hasta + 3, hasta + 7], [1, 1.12, 0], cl);
  const estira = 1 + (1 - s) * 0.25; // burbuja: entra estirada a lo alto y se asienta
  const yy = y + Math.sin((f - desde) * 0.08) * 5;
  const R = (texto && !tipo ? 150 : 135) * tam;
  const ancho = texto && !tipo ? Math.max(R, texto.length * 34 * tam) : R;
  // la cola: un triángulo curvo desde el borde del globo hacia la cabeza
  const dx = cola[0] - x, dy = cola[1] - yy, L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L, px = -uy, py = ux;
  const bx = ux * ancho * 0.8, by = uy * R * 0.8;
  const punta = Math.min(L, Math.max(ancho, R) + 70 * tam);
  const tx = ux * punta, ty = uy * punta;
  const w = 34 * tam;
  const camino = `M${bx + px * w} ${by + py * w} Q${(bx + tx) / 2 + px * 10} ${(by + ty) / 2 + py * 10} ${tx} ${ty} Q${(bx + tx) / 2 - px * 4} ${(by + ty) / 2 - py * 4} ${bx - px * w} ${by - py * w} Z`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
      <g transform={`translate(${x},${yy}) scale(${s * sal / estira},${s * sal * estira})`}>
        <g transform="translate(5,9)" fill="#1d1410" opacity={0.3}><ellipse rx={ancho} ry={R} /><path d={camino} /></g>
        <path d={camino} fill={color} stroke={T} strokeWidth={11} strokeLinejoin="round" />
        <ellipse rx={ancho} ry={R} fill={color} stroke={T} strokeWidth={11} />
        <path d={camino} fill={color} transform="scale(0.94)" />
        <ellipse cx={-ancho * 0.45} cy={-R * 0.55} rx={ancho * 0.16} ry={R * 0.08} fill="#ffffff" transform={`rotate(-25 ${-ancho * 0.45} ${-R * 0.55})`} />
        <g transform={`scale(${si * tam * (tipo ? (texto ? 0.74 : 0.86) : 1)}) translate(0 ${tipo && texto ? -40 : 0})`}>
          {tipo && <DibujoIcono tipo={tipo} f={f} />}
        </g>
        {texto && <text y={tipo ? R * 0.62 : 22 * tam} textAnchor="middle" fontSize={(tipo ? 62 : 70) * tam} fontWeight={900} fill={T} fontFamily="Arial Black, sans-serif" transform={`scale(${si})`}>{texto}</text>}
      </g>
    </svg>
  );
};
