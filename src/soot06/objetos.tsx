import React from "react";
import { Obj } from "./kit2";
import { C, fontFamily } from "./kit";
import { Ropa } from "./persona";
import { rnd } from "../soot/lib";

// Objetos y bichos de soot06 (castillo, noche de 1300). Todo vector plano en código, centrado en (x, y).
type Pos = { x: number; y: number; s?: number; t?: number; t0?: number; t1?: number; rot?: number; op?: number };
const B = (d: string, w = 8) => <path d={d} stroke="#fff" strokeOpacity={0.5} strokeWidth={w} fill="none" strokeLinecap="round" />;

// vestuario
export const CHICO: Ropa = { tunica: "#5c9a3e", tunica2: "#386a22", cinto: "#5a3418", piel: "#f5c7a0", piel2: "#dc9d78", pelo: "#d0672a" };
export const SENOR: Ropa = { tunica: "#2d5bb5", tunica2: "#1a347a", cinto: "#f7c548", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2418" };
export const DAMA: Ropa = { tunica: "#b5266a", tunica2: "#7a1446", cinto: "#f7c548", piel: "#f5c7a0", piel2: "#dc9d78", pelo: "#8a4a1a" };
export const GUARDIA: Ropa = { tunica: "#8a2a3a", tunica2: "#5a1424", cinto: "#3b230f", piel: "#e0a882", piel2: "#b9805e", pelo: "#3a2418" };
export const SIERVO = (i: number): Ropa => {
  const t = [["#a8743a", "#7a4f22"], ["#6b7a8a", "#47525e"], ["#8a6a4a", "#5e4630"], ["#7a5a8a", "#523a60"], ["#9a8a5a", "#6e6238"]][i % 5];
  const p = [["#f2b48a", "#d98d66"], ["#c98b62", "#a2643f"], ["#8d5a3b", "#6a3f26"], ["#f5c7a0", "#dc9d78"]][i % 4];
  return { tunica: t[0], tunica2: t[1], cinto: "#4a2810", piel: p[0], piel2: p[1], pelo: ["#4a2a17", "#1d1410", "#7a4a22", "#c9c4c0", "#a0602c"][(i * 3) % 5] };
};

// ── animales
export const Perro: React.FC<Pos & { t: number; duerme?: boolean; camina?: number; flip?: boolean; color?: string; ladra?: number }> = ({ t, duerme, camina = 0, flip, color = "#a8622c", ladra = 1e9, ...p }) => {
  const f = Math.sin(t * camina * 7) * 14;
  const lad = t > ladra && t < ladra + 0.5 ? Math.sin((t - ladra) * 30) * 0.5 + 0.5 : 0;
  return (
    <Obj {...p} t={t} w={300} h={220}>
      <g transform={`scale(${flip ? -1 : 1} 1)`}>
        {duerme ? (
          <g>
            <ellipse cx={0} cy={40} rx={130} ry={56} fill={color} />
            <ellipse cx={80} cy={30} rx={56} ry={44} fill={color} />
            <ellipse cx={110} cy={6} rx={22} ry={34} fill="#6b3a1f" transform="rotate(30 110 6)" />
            <path d="M 70 26 Q 84 32 96 26" stroke="#2a1530" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d={`M -120 50 Q -170 ${40 + Math.sin(t * 2) * 8} -150 80`} stroke={color} strokeWidth={18} fill="none" strokeLinecap="round" />
            <ellipse cx={0} cy={22 + Math.sin(t * 2.2) * 3} rx={90} ry={14} fill="#fff" opacity={0.15} />
          </g>
        ) : (
          <g>
            {[-70, -40, 50, 80].map((xx, i) => <rect key={xx} x={xx - 10} y={20 + (i % 2 ? f : -f) * 0.2} width={22} height={70} rx={8} fill="#7a4520" transform={`rotate(${(i % 2 ? f : -f)} ${xx} 20)`} />)}
            <ellipse cx={0} cy={10} rx={120} ry={52} fill={color} />
            <path d={`M -110 0 Q -160 ${-50 + Math.sin(t * 12) * 20} -150 -80`} stroke={color} strokeWidth={18} fill="none" strokeLinecap="round" />
            <g transform={`translate(110 -40) rotate(${-lad * 20})`}>
              <ellipse cx={20} cy={0} rx={56} ry={44} fill={color} />
              <ellipse cx={66} cy={14} rx={30} ry={22 + lad * 10} fill="#c98b5a" />
              <circle cx={84} cy={6} r={9} fill="#2a1530" />
              <circle cx={28} cy={-10} r={9} fill="#2a1530" /><circle cx={31} cy={-13} r={3} fill="#fff" />
              <ellipse cx={-10} cy={-6} rx={18} ry={40} fill="#6b3a1f" transform="rotate(20 -10 -6)" />
              {lad > 0.3 && <ellipse cx={74} cy={34} rx={14} ry={10} fill="#5a1a22" />}
            </g>
          </g>
        )}
      </g>
    </Obj>
  );
};
export const Rata: React.FC<Pos & { t: number; flip?: boolean; corre?: number }> = ({ t, flip, corre = 1, ...p }) => {
  const f = Math.sin(t * 22 * corre);
  return (
    <Obj {...p} t={t} w={240} h={120}>
      <g transform={`scale(${flip ? -1 : 1} 1)`}>
        <path d={`M -60 10 Q -130 ${-20 + f * 14} -170 ${30 + f * 6}`} stroke="#c98b8b" strokeWidth={8} fill="none" strokeLinecap="round" />
        {[-30, 20].map((xx, i) => <ellipse key={xx} cx={xx + (i ? f : -f) * 8} cy={38} rx={14} ry={8} fill="#c98b8b" />)}
        <ellipse cx={0} cy={6} rx={70} ry={38} fill="#4a4258" />
        <path d={`M 50 -10 Q 110 0 110 14 Q 80 32 50 26 Z`} fill="#4a4258" />
        <circle cx={40} cy={-22} r={20} fill="#5d5470" /><circle cx={40} cy={-22} r={10} fill="#c98b8b" />
        <circle cx={78} cy={2} r={6} fill="#ff4a5a" /><circle cx={80} cy={0} r={2} fill="#fff" />
        <circle cx={110} cy={14} r={6} fill="#c98b8b" />
        {[-1, 1].map((d) => <line key={d} x1={104} y1={14} x2={130} y2={14 + d * 10} stroke="#fff" strokeWidth={2} opacity={0.7} />)}
        {B("M -40 -18 Q -10 -30 20 -24", 6)}
      </g>
    </Obj>
  );
};
export const Gato: React.FC<Pos & { t: number; flip?: boolean; susto?: boolean }> = ({ t, flip, susto, ...p }) => (
  <Obj {...p} t={t} w={260} h={260}>
    <g transform={`scale(${flip ? -1 : 1} 1)`}>
      <path d={`M -70 60 Q -140 ${10 + Math.sin(t * 3) * 20} -110 -60`} stroke="#3a3048" strokeWidth={20} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={50} rx={80} ry={64} fill="#3a3048" />
      <circle cx={10} cy={-40} r={58} fill="#3a3048" />
      <path d="M -40 -80 L -30 -130 L 0 -94 Z M 60 -80 L 50 -130 L 20 -94 Z" fill="#3a3048" />
      {[-12, 32].map((xx) => <g key={xx}><ellipse cx={xx} cy={-44} rx={13} ry={susto ? 16 : 12} fill="#d9ff7a" /><ellipse cx={xx} cy={-44} rx={4} ry={susto ? 12 : 10} fill="#1a1424" /></g>)}
      <path d="M 4 -20 L 16 -20 L 10 -12 Z" fill="#ff8aa0" />
    </g>
  </Obj>
);
// nube de pulgas que saltan alrededor de un punto
export const Pulgas: React.FC<{ t: number; x: number; y: number; n?: number; rad?: number; seed?: number; t0?: number }> = ({ t, x, y, n = 12, rad = 120, seed = 1, t0 = -9 }) => {
  if (t < t0) return null;
  const r = rnd(seed);
  return (
    <svg style={{ position: "absolute", left: x - rad * 2, top: y - rad * 2, overflow: "visible", pointerEvents: "none" }} width={rad * 4} height={rad * 4}>
      {Array.from({ length: n }, (_, i) => {
        const f = r() * 6, v = 1.5 + r() * 2;
        const k = ((t - t0) * v + f) % 1;
        const cx = rad * 2 + Math.cos(f * 3 + Math.floor((t - t0) * v + f)) * rad * r();
        const cy = rad * 2 + Math.sin(f * 5 + Math.floor((t - t0) * v + f)) * rad * 0.6 - Math.sin(k * Math.PI) * 60;
        return <g key={i} transform={`translate(${cx} ${cy})`}><ellipse rx={7} ry={5} fill="#3a1a14" /><line x1={-4} y1={3} x2={-10} y2={10} stroke="#3a1a14" strokeWidth={2} /><line x1={4} y1={3} x2={10} y2={10} stroke="#3a1a14" strokeWidth={2} /></g>;
      })}
    </svg>
  );
};

// ── comida y mesa
export const Trinchero: React.FC<Pos & { salsa?: number; duro?: boolean }> = ({ salsa = 0, duro, ...p }) => (
  <Obj {...p} w={300} h={160}>
    <rect x={-130} y={-50} width={260} height={100} rx={22} fill="#a8621f" />
    <rect x={-122} y={-62} width={244} height={96} rx={24} fill={duro ? "#c98f4a" : "#e0a55a"} />
    {[-80, -20, 40, 90].map((xx) => <circle key={xx} cx={xx} cy={-20 + (xx % 3) * 6} r={6} fill="#a8621f" />)}
    {salsa > 0 && <ellipse cx={0} cy={-20} rx={100 * salsa} ry={30 * salsa} fill="#7a3a14" opacity={0.85} />}
    {duro && <path d="M -60 -40 L -30 -10 L -50 10" stroke="#7a4520" strokeWidth={5} fill="none" />}
    {B("M -100 -50 Q -40 -64 30 -60", 7)}
  </Obj>
);
export const Arenque: React.FC<Pos & { sal?: boolean }> = ({ sal = true, ...p }) => (
  <Obj {...p} w={320} h={140}>
    <path d="M -130 0 Q -40 -60 80 -10 L 140 -50 L 130 0 L 140 50 L 80 10 Q -40 60 -130 0 Z" fill="#b9c4d6" />
    <path d="M -130 0 Q -40 -30 80 0" stroke="#8a96aa" strokeWidth={6} fill="none" />
    <circle cx={-90} cy={-8} r={10} fill="#fff" /><circle cx={-88} cy={-8} r={5} fill="#1a1424" />
    {sal && Array.from({ length: 16 }, (_, i) => <rect key={i} x={-110 + (i * 37) % 210} y={-30 + ((i * 53) % 50)} width={9} height={9} fill="#fff" transform={`rotate(45 ${-106 + (i * 37) % 210} ${-26 + ((i * 53) % 50)})`} />)}
    {B("M -100 -20 Q -40 -42 20 -30", 6)}
  </Obj>
);
export const Castor: React.FC<Pos & { t?: number; cola?: number }> = ({ cola = 0, ...p }) => (
  <Obj {...p} w={420} h={280}>
    <g transform={`translate(-120 40) rotate(${-10 - cola * 20})`}>
      <ellipse cx={-80} cy={0} rx={110} ry={48} fill="#4a3a5a" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${-170 + (i % 6) * 34} ${-20 + Math.floor(i / 6) * 34} q 17 -16 34 0`} stroke="#6d5d82" strokeWidth={6} fill="none" />)}
    </g>
    <ellipse cx={40} cy={10} rx={130} ry={90} fill="#8a5a32" />
    <circle cx={140} cy={-50} r={66} fill="#8a5a32" />
    <circle cx={110} cy={-110} r={18} fill="#6b3a1f" />
    <circle cx={160} cy={-60} r={10} fill="#1a1424" /><circle cx={163} cy={-63} r={3} fill="#fff" />
    <ellipse cx={200} cy={-30} rx={20} ry={14} fill="#3a2418" />
    <rect x={180} y={-10} width={24} height={30} rx={4} fill="#fff6d8" stroke="#c9b9a0" strokeWidth={3} />
    {B("M 0 -60 Q 60 -90 120 -100", 8)}
  </Obj>
);
export const Ganso: React.FC<Pos & { t?: number; brota?: number }> = ({ brota = 1, ...p }) => (
  <Obj {...p} w={420} h={420}>
    {/* el tronco a la deriva del que "brotan" */}
    <rect x={-200} y={120} width={400} height={70} rx={34} fill="#7a4520" />
    {[-120, 0, 120].map((xx) => <g key={xx}><path d={`M ${xx} 120 Q ${xx + 10} ${120 - 70 * brota} ${xx} ${120 - 120 * brota}`} stroke="#d9cfc0" strokeWidth={12} fill="none" /><ellipse cx={xx} cy={120 - 130 * brota} rx={26 * brota} ry={36 * brota} fill="#e8e0d0" stroke="#9a8a7a" strokeWidth={4} /></g>)}
    <g transform={`translate(0 ${-60 - 60 * brota}) scale(${brota})`}>
      <ellipse cx={0} cy={0} rx={110} ry={60} fill="#e8e6ea" />
      <path d="M -40 -20 Q 0 -50 60 -10" fill="#3a3a48" />
      <path d="M 80 -10 Q 110 -100 130 -120" stroke="#2a2a34" strokeWidth={26} fill="none" strokeLinecap="round" />
      <circle cx={136} cy={-126} r={30} fill="#2a2a34" />
      <ellipse cx={130} cy={-122} rx={14} ry={12} fill="#fff" />
      <path d="M 160 -128 L 190 -120 L 160 -112 Z" fill="#2a2a34" />
    </g>
  </Obj>
);
export const Jarra: React.FC<Pos & { nivel?: number; espuma?: boolean }> = ({ nivel = 1, espuma = true, ...p }) => (
  <Obj {...p} w={220} h={260}>
    <path d="M 60 -60 Q 120 -60 120 0 Q 120 60 60 60" stroke="#7a4520" strokeWidth={22} fill="none" />
    <rect x={-80} y={-110} width={150} height={220} rx={14} fill="#a8622c" />
    <rect x={-80} y={110 - 200 * nivel} width={150} height={200 * nivel} fill="#e8a23a" opacity={0.9} />
    {[-50, 0, 40].map((xx) => <rect key={xx} x={xx - 6} y={-100} width={12} height={200} fill="#7a4520" opacity={0.5} />)}
    <rect x={-84} y={-30} width={158} height={16} fill="#3a3a48" /><rect x={-84} y={70} width={158} height={16} fill="#3a3a48" />
    {espuma && nivel > 0.9 && <path d="M -90 -110 Q -70 -150 -40 -126 Q -10 -160 20 -128 Q 50 -156 80 -116 L 70 -100 L -80 -100 Z" fill="#fff6e0" />}
  </Obj>
);
export const Olla: React.FC<Pos & { t?: number }> = ({ t = 0, ...p }) => (
  <Obj {...p} t={t} w={300} h={240}>
    {[0, 1, 2].map((i) => { const k = ((t * 0.5 + i / 3) % 1); return <circle key={i} cx={-40 + i * 40 + Math.sin(t + i) * 10} cy={-80 - k * 120} r={20 + k * 30} fill="#fff" opacity={0.4 * (1 - k)} />; })}
    <path d="M -130 -60 Q -130 100 0 100 Q 130 100 130 -60 Z" fill="#3a3a48" />
    <ellipse cx={0} cy={-60} rx={130} ry={30} fill="#8a9a4a" />
    {[-60, -10, 40, 80].map((xx, i) => <circle key={xx} cx={xx} cy={-60 + (i % 2) * 8} r={10} fill={["#c9b23a", "#6b8a2a", "#d9c08a", "#a8743a"][i]} />)}
    {B("M -110 -20 Q -100 40 -60 70", 8)}
  </Obj>
);
// vela: cera (blanca, limpia) o sebo (amarilla, humea y gotea)
export const Vela: React.FC<Pos & { t: number; sebo?: boolean; alto?: number; apaga?: number }> = ({ t, sebo, alto = 1, apaga = 1e9, ...p }) => {
  const viva = t < apaga ? 1 : Math.max(0, 1 - (t - apaga) * 4);
  const f = Math.sin(t * 13) * 0.08;
  return (
    <Obj {...p} t={t} w={200} h={420}>
      <rect x={-34} y={130 - 200 * alto} width={68} height={200 * alto} rx={8} fill={sebo ? "#e8d48a" : "#fff8ea"} />
      {sebo && [-20, 14].map((xx, i) => <path key={xx} d={`M ${xx} ${130 - 200 * alto} q 6 ${30 + i * 20} 0 ${50 + i * 30}`} stroke="#d9c070" strokeWidth={12} fill="none" strokeLinecap="round" />)}
      <rect x={-70} y={126} width={140} height={22} rx={8} fill="#a8743a" />
      <line x1={0} y1={130 - 200 * alto} x2={0} y2={112 - 200 * alto} stroke="#2a1530" strokeWidth={5} />
      <g transform={`translate(0 ${112 - 200 * alto}) scale(${viva} ${viva * (1 + f)})`}>
        <ellipse cx={0} cy={-30} rx={56} ry={66} fill="#ffb347" opacity={0.2} />
        <path d="M 0 -80 Q 26 -36 18 0 Q 0 12 -18 0 Q -22 -36 0 -80 Z" fill={sebo ? "#ff8a3d" : "#ffb020"} />
        <path d="M 0 -50 Q 12 -24 9 0 Q 0 6 -9 0 Q -10 -24 0 -50 Z" fill="#fff3b0" />
      </g>
      {(sebo || viva < 1) && [0, 1, 2].map((i) => { const k = ((t * 0.6 + i / 3) % 1); return <circle key={i} cx={Math.sin(t * 2 + i) * 20} cy={30 - 200 * alto - 80 - k * 200} r={14 + k * 26} fill="#4a4258" opacity={(sebo ? 0.45 : 0.6 * (1 - viva)) * (1 - k)} />; })}
      {!sebo && B("M -20 0 L -20 100", 7)}
    </Obj>
  );
};
// junco pelado untado en grasa, sostenido por una pinza de hierro
export const Junco: React.FC<Pos & { t: number; quema?: number }> = ({ t, quema = 0, ...p }) => {
  const largo = 300 * (1 - quema * 0.85);
  return (
    <Obj {...p} t={t} w={360} h={360}>
      <path d="M -10 160 L -10 40 L -40 -10 M -10 40 L 20 -10" stroke="#3a3a48" strokeWidth={14} fill="none" strokeLinecap="round" />
      <rect x={-130} y={150} width={240} height={30} rx={10} fill="#5a3418" />
      <g transform="rotate(-40 -10 0)">
        <rect x={-10} y={-6} width={largo} height={12} rx={6} fill="#c9b26a" />
        <g transform={`translate(${largo} 0) rotate(40)`}>
          <ellipse cx={0} cy={-20} rx={36} ry={44} fill="#ffb347" opacity={0.2} />
          <path d={`M 0 -46 Q ${14 + Math.sin(t * 12) * 4} -20 10 0 Q 0 6 -10 0 Q -12 -20 0 -46 Z`} fill="#ff9a3d" />
        </g>
      </g>
    </Obj>
  );
};
export const Manta: React.FC<Pos & { w?: number; cubre?: number }> = ({ w = 320, cubre = 1, ...p }) => (
  <Obj {...p} w={w + 40} h={140}>
    <path d={`M ${-w / 2} 50 Q ${-w / 2} ${-30 * cubre} ${-w / 4} ${-40 * cubre} Q 0 ${-60 * cubre} ${w / 4} ${-36 * cubre} Q ${w / 2} ${-20 * cubre} ${w / 2} 50 Z`} fill="#8a7a6a" />
    {Array.from({ length: Math.floor(w / 40) }, (_, i) => <line key={i} x1={-w / 2 + 20 + i * 40} y1={40} x2={-w / 2 + 30 + i * 40} y2={-20 * cubre} stroke="#6b5d4a" strokeWidth={5} />)}
    <rect x={-w / 2 + 30} y={-10 * cubre} width={60} height={30} fill="#a8743a" opacity={0.7} />
  </Obj>
);
export const Cuerno: React.FC<Pos> = (p) => (
  <Obj {...p} w={300} h={160}>
    <path d="M -130 30 Q -40 40 60 -10 Q 110 -40 130 -70 L 150 -40 Q 120 20 50 40 Q -40 70 -130 50 Z" fill="#e8d4a8" />
    <rect x={-140} y={26} width={22} height={30} rx={6} fill="#a8743a" />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${-60 + i * 60} ${40 - i * 18} q 10 18 4 28`} stroke="#a8743a" strokeWidth={8} fill="none" />)}
  </Obj>
);
export const EscaleraCuerda: React.FC<{ x: number; y: number; alto: number; sube?: number }> = ({ x, y, alto, sube = 1 }) => (
  <svg style={{ position: "absolute", left: x - 60, top: y - alto * sube, overflow: "visible" }} width={120} height={alto * sube}>
    <line x1={10} y1={0} x2={10} y2={alto * sube} stroke="#c9a36a" strokeWidth={8} />
    <line x1={110} y1={0} x2={110} y2={alto * sube} stroke="#c9a36a" strokeWidth={8} />
    {Array.from({ length: Math.floor((alto * sube) / 60) }, (_, i) => <line key={i} x1={10} y1={30 + i * 60} x2={110} y2={30 + i * 60} stroke="#a8843a" strokeWidth={10} />)}
    <path d="M -10 0 L 10 0 L 10 -30 M 110 0 L 130 0 L 110 -30" stroke="#5a5a68" strokeWidth={10} fill="none" />
  </svg>
);
export const Pala: React.FC<Pos> = (p) => (
  <Obj {...p} w={120} h={460}>
    <rect x={-8} y={-220} width={16} height={330} fill="#7a4520" />
    <rect x={-34} y={-230} width={68} height={20} rx={8} fill="#7a4520" />
    <path d="M -50 100 L 50 100 L 44 210 Q 0 236 -44 210 Z" fill="#8a93a3" />
  </Obj>
);
export const Heno: React.FC<Pos & { k: "heno" | "musgo" | "lana" }> = ({ k, ...p }) => (
  <Obj {...p} w={220} h={160}>
    {k === "heno" && Array.from({ length: 16 }, (_, i) => <line key={i} x1={-90 + i * 11} y1={60} x2={-60 + i * 8 + Math.sin(i) * 30} y2={-50 + (i % 3) * 12} stroke={i % 2 ? "#e8c84a" : "#c9a83a"} strokeWidth={8} strokeLinecap="round" />)}
    {k === "musgo" && <>{[[-40, 10, 60], [20, -10, 56], [60, 20, 44], [-10, 30, 50]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={["#5c8f3e", "#4a7a30", "#6b9a4a", "#3e6a2a"][i]} />)}</>}
    {k === "lana" && <><path d="M -80 50 Q -90 -40 -20 -50 Q 60 -60 80 0 Q 90 50 30 56 Z" fill="#e8e0d0" /><path d="M -40 -10 Q 0 -30 40 -10 M -50 20 Q 0 0 50 20" stroke="#c9bfae" strokeWidth={6} fill="none" /></>}
  </Obj>
);
export const PanTrampa: React.FC<Pos & { t: number }> = ({ t, ...p }) => (
  <Obj {...p} t={t} w={360} h={300}>
    <ellipse cx={0} cy={60} rx={160} ry={56} fill="#d98a35" />
    <ellipse cx={0} cy={50} rx={150} ry={50} fill="#f2c27a" />
    <ellipse cx={0} cy={50} rx={130} ry={40} fill="#b8d0e8" opacity={0.7} />
    <rect x={-20} y={-60} width={40} height={110} rx={6} fill="#e8d48a" />
    <path d={`M 0 -110 Q ${18 + Math.sin(t * 12) * 4} -80 12 -60 Q 0 -54 -12 -60 Q -14 -80 0 -110 Z`} fill="#ff9a3d" />
    {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${-100 + i * 28} ${44 + (i % 3) * 8})`}><ellipse rx={7} ry={5} fill="#3a1a14" /></g>)}
  </Obj>
);
// campana colgando que se balancea cuando suena (golpe en tb)
export const Campanita: React.FC<Pos & { t: number; tb?: number[] }> = ({ t, tb = [], ...p }) => {
  const g = tb.reduce((a, b) => a + (t >= b ? Math.sin((t - b) * 14) * Math.exp(-(t - b) * 3) * 22 : 0), 0);
  return (
    <Obj {...p} t={t} w={300} h={340}>
      <rect x={-120} y={-160} width={240} height={26} rx={8} fill="#5a3418" />
      <g transform={`rotate(${g} 0 -140)`}>
        <path d="M -90 100 Q -96 -10 -60 -60 Q 0 -140 60 -60 Q 96 -10 90 100 Z" fill="#e0a83a" />
        <rect x={-104} y={90} width={208} height={24} rx={10} fill="#b8781f" />
        <circle cx={0} cy={124} r={20} fill="#8a5414" />
        {B("M -50 -40 Q -60 20 -60 80", 10)}
      </g>
      {tb.map((b, i) => t > b && t < b + 0.6 ? <g key={i} opacity={1 - (t - b) / 0.6}>{[-1, 1].map((d) => [0, 1].map((k) => <path key={`${d}${k}`} d={`M ${d * (130 + k * 30 + (t - b) * 80)} ${-20 - k * 20} q ${d * 16} 40 0 80`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />))}</g> : null)}
    </Obj>
  );
};
// globo de texto pequeño con letra (para "ZZZ", "!", nombres en el mundo)
export const Globo: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; text: string; s?: number; color?: string }> = ({ t, t0, t1 = 1e9, x, y, text, s = 1, color = "#fff" }) => {
  if (t < t0 || t > t1) return null;
  const e = Math.min(1, (t - t0) / 0.18);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${s * (0.6 + 0.4 * e)})`, opacity: e, transformOrigin: "50% 100%" }}>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 52, color: C.noche, background: color, padding: "10px 26px", borderRadius: 30, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(20,10,50,.3)" }}>{text}</div>
      <div style={{ width: 0, height: 0, margin: "0 auto", borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `24px solid ${color}` }} />
    </div>
  );
};
