// tz01 · vuelta 4 del ojo del director (planos 46-86): brazo de Leo en el contraplano, el farol en las manos, el príncipe del próximo capítulo.
// Pantalla = coordenadas del cuadro 1920×1080. ⚠ hooks SIEMPRE antes de cualquier return.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { ORO } from "../tenzo/elenco";
import { FarolPapel } from "../tenzo/utileria";
import { Llama } from "../tenzo/graficos";
import { lerp } from "./extras";

const TINTA = "#221c18";
const PIEL_L = "#ecc9a3"; // Leo
const PIEL_T = "#f2bf8f"; // Tenzo

// ---------- brazo de Leo en primer término (contraplano por encima del hombro): manga de buzo que se afina, puño y mano abierta
// con la palma hacia arriba que «presenta» al viejo («but he was a monk…»). sube = 0..1 (entra desde abajo), golpe = acento de la frase
export const BrazoLeoOTS: React.FC<{ sube: number; golpe?: number }> = ({ sube, golpe = 0 }) => {
  const f = useF();
  const e = 1 - Math.pow(1 - Math.min(1, Math.max(0, sube)), 3);
  // hombro fuera de cuadro abajo a la izquierda; la mano llega a ~(860, 760)
  const hx = 400, hy = 1160;
  const mx = 470 + 230 * e + 12 * golpe, my = 1150 - 300 * e - 20 * golpe + 3 * Math.sin(f / 9);
  const ang = Math.atan2(my - hy, mx - hx);
  const nx = -Math.sin(ang), ny = Math.cos(ang); // normal al brazo
  const w0 = 120, w1 = 66; // ancho de la manga: hombro → muñeca
  const P = (t: number, s: number) => { const w = w0 + (w1 - w0) * t; return `${hx + (mx - hx) * t + nx * w * s * 0.5},${hy + (my - hy) * t + ny * w * s * 0.5}`; };
  const deg = (ang * 180) / Math.PI;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* manga del buzo con un pliegue en el codo */}
        <path d={`M${P(0, 1)} Q${P(0.5, 1.12)} ${P(0.92, 1)} L${P(0.92, -1)} Q${P(0.5, -1.06)} ${P(0, -1)} Z`} fill="#1c1c21" stroke="#0c0c0f" strokeWidth={5} strokeLinejoin="round" />
        <path d={`M${P(0.05, 0.62)} Q${P(0.5, 0.75)} ${P(0.88, 0.6)}`} stroke="#3a3a44" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
        <path d={`M${P(0.48, 1)} Q${P(0.52, 0.2)} ${P(0.56, -0.9)}`} stroke="#2e2e36" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* puño */}
        <path d={`M${P(0.9, 1.08)} L${P(1, 1.02)} L${P(1, -1.02)} L${P(0.9, -1.08)} Z`} fill="#2e2e36" stroke="#0c0c0f" strokeWidth={4} />
        {/* mano: palma hacia arriba, dedos juntos que apuntan al viejo, pulgar arriba */}
        <g transform={`translate(${mx},${my}) rotate(${deg})`}>
          <path d="M-4,-30 Q30,-40 70,-30 L128,-26 Q146,-24 146,-12 Q146,0 128,0 L84,2 L132,10 Q148,14 146,26 Q142,36 126,34 L78,30 Q40,40 6,32 Q-10,10 -4,-30 Z"
            fill={PIEL_L} stroke={TINTA} strokeWidth={5} strokeLinejoin="round" />
          <path d="M84,2 L122,4 M80,16 L118,20" stroke="#b98d68" strokeWidth={3} strokeLinecap="round" />
          <path d="M30,-34 Q44,-66 62,-70 Q76,-72 74,-58 Q66,-44 54,-30" fill={PIEL_L} stroke={TINTA} strokeWidth={5} strokeLinejoin="round" />
          <path d="M18,6 Q40,14 62,8" stroke="#c99a74" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- inserto: el farol de papel en las DOS manos de Tenzo; los pulgares aprietan el papel (se hunde y se arruga) y la llama
// de adentro se ve a través: «a fire made of paper». aprieta = 0..1
export const FarolEnManos: React.FC<{ desde: number; aprieta: number; luz?: number }> = ({ desde, aprieta, luz = 1.3 }) => {
  const f = useF();
  const g = Math.max(0, f - desde);
  const a = Math.min(1, Math.max(0, aprieta));
  const sube = 60 * (1 - Math.min(1, g / 10)) * (1 - Math.min(1, g / 10));
  const CX = 960, CY = 600 + sube;
  // empuje lento de cámara hacia el farol + la llama que crece hacia el papel (acción continua hasta el corte)
  const zoom = 1 + 0.1 * Math.min(1, g / 72);
  const crece = 0.4 * Math.min(1, g / 72);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 58%, #4a3420, #120d0a 72%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", transform: `scale(${zoom})`, transformOrigin: "50% 52%" }}>
        <Halo x={CX} y={CY - 40} r={620} color={ORO} fuerza={0.5 + 0.06 * Math.sin(f / 5)} />
        {/* el farol enorme: papel, costillas y la llama adentro */}
        <FarolPapel x={CX} y={CY + 420} s={8.4} luz={luz * (0.95 + 0.06 * Math.sin(f / 4))} halo={0.5} />
        <Llama x={CX} y={CY + 60 - 30 * crece} t={1.3 + crece + 0.14 * Math.sin(f / 3.5)} f={f} />
        {/* arrugas del papel donde aprietan los pulgares */}
        {[-1, 1].map((sd) => (
          <g key={sd} opacity={a}>
            {[0, 1, 2].map((k) => <path key={k} d={`M${CX + sd * (200 - k * 6)},${CY - 20 + k * 50} q${-sd * 40},${10 + k * 4} ${-sd * 70},${-6 + k * 6}`} stroke="#b9875a" strokeWidth={4} fill="none" strokeLinecap="round" />)}
          </g>
        ))}
        {/* manos: mangas grises desde abajo a cada lado, palmas que envuelven el farol, pulgares adelante que se hunden */}
        {[-1, 1].map((sd) => {
          const px = CX + sd * (250 - 30 * a), py = CY + 120;
          return (
            <g key={sd} transform={`translate(${px},${py}) scale(${sd},1)`}>
              <path d="M40,560 Q20,300 -10,160 L120,130 Q160,300 220,560 Z" fill="#8e8a82" stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
              <path d="M-10,160 L120,130" stroke="#6e6a63" strokeWidth={14} />
              <path d="M-30,150 Q-60,40 -40,-80 Q-20,-150 30,-150 Q80,-140 96,-60 L120,130 Z" fill={PIEL_T} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
              {[0, 1, 2].map((k) => <path key={k} d={`M${-38 + k * 4},${-40 + k * 50} q-30,6 -40,-4`} stroke={TINTA} strokeWidth={4} fill="none" strokeLinecap="round" />)}
              {/* pulgar: se dobla hacia el papel al apretar */}
              <g transform={`translate(-20,-110) rotate(${-30 - 28 * a})`}>
                <rect x={-120} y={-26} width={130} height={52} rx={26} fill={PIEL_T} stroke={TINTA} strokeWidth={6} />
                <rect x={-112} y={-16} width={34} height={32} rx={12} fill="#f8dcc0" stroke={TINTA} strokeWidth={3} />
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- el príncipe del próximo capítulo (dentro de un globo): un príncipe joven dentro del palacio, se asoma por la puerta
// entreabierta a un mundo que nunca vio (luz que entra), «?» grande que late. Coordenadas 0..w × 0..h
export const PrincipeAsoma: React.FC<{ w: number; h: number; abre: number }> = ({ w, h, abre }) => {
  const f = useF();
  const a = Math.min(1, Math.max(0, abre));
  const px = w * 0.36, py = h * 0.9;
  return (
    <g>
      <rect width={w} height={h} fill="#f3dcae" />
      {/* muro del palacio con almenas, adentro dorado */}
      <rect x={0} y={h * 0.12} width={w} height={h * 0.88} fill="#e3b46c" />
      {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={k * (w / 10) + 6} y={h * 0.04} width={w / 20} height={h * 0.1} fill="#e3b46c" stroke={TINTA} strokeWidth={3} />)}
      <rect x={0} y={h * 0.12} width={w} height={h * 0.88} fill="none" stroke={TINTA} strokeWidth={4} />
      {/* la puerta: se entreabre y entra la luz de afuera */}
      <rect x={w * 0.6} y={h * 0.3} width={w * 0.26} height={h * 0.62} fill="#fffbe8" stroke={TINTA} strokeWidth={4} />
      <path d={`M${w * 0.6},${h * 0.92} L${w * 0.86},${h * 0.92} L${w * 0.2},${h} L${w * 0.05},${h} Z`} fill="#fff6c8" opacity={0.7 * a} />
      <path d={`M${w * 0.6},${h * 0.3} L${w * 0.6 + w * 0.26 * (1 - a * 0.75)},${h * 0.34} L${w * 0.6 + w * 0.26 * (1 - a * 0.75)},${h * 0.88} L${w * 0.6},${h * 0.92} Z`} fill="#8a4a2a" stroke={TINTA} strokeWidth={4} />
      {/* el príncipe: corona, túnica violeta, se inclina hacia la luz con la mano en el marco */}
      <g transform={`translate(${px},${py}) rotate(${8 * a})`}>
        <path d="M-40,-150 Q0,-170 40,-150 L52,0 L-52,0 Z" fill="#7a3a8a" stroke={TINTA} strokeWidth={4} />
        <path d="M-40,-150 Q0,-130 40,-150" stroke="#f2c14a" strokeWidth={6} fill="none" />
        <path d={`M30,-130 Q${90 + 40 * a},-150 ${120 + 50 * a},-120`} stroke="#7a3a8a" strokeWidth={22} fill="none" strokeLinecap="round" />
        <circle cx={120 + 50 * a} cy={-120} r={13} fill="#e9b88a" stroke={TINTA} strokeWidth={3} />
        <circle cx={0} cy={-192} r={40} fill="#e9b88a" stroke={TINTA} strokeWidth={4} />
        <circle cx={16} cy={-196} r={6} fill={TINTA} /><circle cx={34} cy={-196} r={6} fill={TINTA} />
        <ellipse cx={26} cy={-172} rx={8} ry={6 + 4 * a} fill={TINTA} />
        <path d="M-34,-224 L-34,-258 L-17,-238 L0,-266 L17,-238 L34,-258 L34,-224 Z" fill="#f2c14a" stroke={TINTA} strokeWidth={3} />
      </g>
      <text x={w * 0.73} y={h * 0.26} fontSize={70 + 8 * Math.sin(f / 5)} fontWeight={800} fill="#c0392b" textAnchor="middle" fontFamily={F_HUD}>?</text>
    </g>
  );
};

// ---------- fila de noches: 5 ventanitas de noche que se prenden con un farol, una por una («every night») ----------
export const NochesFila: React.FC<{ x: number; y: number; desde: number; paso?: number }> = ({ x, y, desde, paso = 7 }) => {
  const f = useF();
  if (f < desde) return null;
  const o = lerp(f, desde, desde + 6, 0, 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translateX(-50%)", display: "flex", gap: 14, padding: "14px 20px", borderRadius: 22, background: "rgba(12,14,22,0.82)", border: "2px solid #ffe2a666" }}>
      {Array.from({ length: 5 }).map((_, k) => {
        const on = lerp(f, desde + 4 + k * paso, desde + 8 + k * paso, 0, 1);
        return (
          <svg key={k} width={92} height={110} viewBox="0 0 92 110">
            <rect x={2} y={2} width={88} height={106} rx={14} fill="#1a2238" stroke="#3a4560" strokeWidth={3} />
            <circle cx={66} cy={26} r={12} fill="#f4efe0" opacity={0.85} /><circle cx={72} cy={22} r={11} fill="#1a2238" />
            <circle cx={46} cy={70} r={30 * on} fill={ORO} opacity={0.35 * on} />
            <ellipse cx={46} cy={72} rx={14} ry={18} fill={on > 0.5 ? "#ffe7b0" : "#5a5f6a"} stroke={TINTA} strokeWidth={2.5} />
            <rect x={40} y={50} width={12} height={5} fill="#3a2a22" />
          </svg>
        );
      })}
    </div>
  );
};
