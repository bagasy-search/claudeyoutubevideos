// lc01 · vuelta 4 (v4c, planos 30-43): componentes nuevos. Todo ADITIVO; no toca los compartidos.
import React, { useId } from "react";
import { interpolate, random, spring, useVideoConfig } from "remotion";
import { F_MONO } from "../hud";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { Charco, Halo } from "../../anikit/luz";
import { SetProps, osc } from "../../anikit/sets/comun";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;


// ---------------------------------------------------------------- Lobby: el pasamanos del descanso termina en un poste
// (tapa el tramo horizontal del set, que cruzaba las rodillas de June). D = LOBBY_DESCANSO.
export const PasamanosCorto: React.FC<{ D: { x: number; y: number }; pared?: string; fin?: number }> = ({ D, pared = "#cdd6d8", fin }) => {
  const x0 = fin ?? D.x - 120;
  return (
    <g>
      <rect x={x0 + 10} y={D.y - 96} width={D.x + 580 - x0} height={14} fill={pared} />
      <rect x={x0 - 8} y={D.y - 104} width={18} height={104} rx={4} fill="#3a4048" />
      <circle cx={x0 + 1} cy={D.y - 106} r={12} fill="#3a4048" />
    </g>
  );
};

// ---------------------------------------------------------------- suspiro: una bocanada que sale de la boca (mundo), f0 = cuadro
export const Suspiro: React.FC<{ x: number; y: number; f0: number; dir?: number; color?: string; dur?: number }> = ({ x, y, f0, dir = 1, color = "#ffffff", dur = 30 }) => {
  const f = useF();
  const t = (f - f0) / dur;
  if (t < 0 || t > 1) return null;
  const e = 1 - Math.pow(1 - t, 2);
  return (
    <g opacity={Math.sin(Math.PI * Math.min(1, t * 1.4)) * 0.75}>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + dir * (10 + e * (50 + i * 26))} cy={y + 6 - e * (8 + i * 6)} r={6 + e * (10 + i * 5)} fill={color} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- SÚPER v4: góndolas BAJAS (4 estantes, 400 px) y pared lisa arriba
// (franja libre de y = P-740 a P-430 para los carteles del dato). Sin carteles de pasillo ni carrito suelto.
// Usar con zLejos={1} (la pared del fondo va pegada al medio: interior).
const COLS = ["#e0563a", "#f1c24a", "#5aa0d8", "#7fc46a", "#f2efe6", "#c9463a", "#8f6bd1", "#f08a3c"];
const Prod: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  const c = COLS[Math.floor(random(`sp${k}`) * COLS.length)];
  const t = Math.floor(random(`st${k}`) * 4);
  if (t === 0) return <g><rect x={x} y={y - 46} width={30} height={46} rx={3} fill={c} /><rect x={x} y={y - 32} width={30} height={12} fill="#f6f1e6" opacity={0.85} /></g>;
  if (t === 1) return <g><rect x={x + 3} y={y - 34} width={24} height={34} rx={5} fill={c} /><rect x={x + 3} y={y - 24} width={24} height={10} fill={osc(c, 0.7)} /></g>;
  if (t === 2) return <g><rect x={x + 6} y={y - 52} width={18} height={52} rx={6} fill={c} /><rect x={x + 11} y={y - 62} width={8} height={12} fill={osc(c, 0.65)} /></g>;
  return <g><path d={`M${x},${y} L${x + 3},${y - 40} Q${x + 15},${y - 48} ${x + 27},${y - 40} L${x + 30},${y} Z`} fill={c} /></g>;
};
export const GondolaV4: React.FC<{ x: number; w: number; piso: number; seed: number; alto?: number; vacia?: number; fondo?: string; huecos?: number[] }> = ({ x, w, piso, seed, alto = 400, vacia = 0.03, fondo = "#e9ebe6", huecos = [] }) => {
  const filas = Math.max(2, Math.round((alto - 60) / 100));
  const sid = useId().replace(/:/g, "");
  return (
    <g>
      <defs><linearGradient id={`gs${sid}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.15} /></linearGradient></defs>
      <rect x={x} y={piso - alto} width={w} height={alto} fill={fondo} />
      <rect x={x} y={piso - alto} width={w} height={alto} fill={`url(#gs${sid})`} />
      {Array.from({ length: filas }).map((_, r) => {
        const ys = piso - alto + 90 + r * 100;
        const n = Math.floor(w / 34);
        return (
          <g key={r}>
            {Array.from({ length: n }).map((_, k) => (random(`gv${seed}${r}${k}`) < vacia || huecos.indexOf(r * 100 + k) >= 0 ? null : <Prod key={k} x={x + 6 + k * 34} y={ys} k={seed * 1000 + r * 100 + k} />))}
            <rect x={x} y={ys} width={w} height={12} fill={osc(fondo, 0.8)} />
            {Array.from({ length: Math.floor(w / 140) }).map((_, k) => <rect key={k} x={x + 20 + k * 140} y={ys + 2} width={34} height={9} fill={k % 3 ? "#f4e04a" : "#ff6a4a"} />)}
          </g>
        );
      })}
      <rect x={x - 8} y={piso - alto - 20} width={w + 16} height={24} rx={4} fill={osc(fondo, 0.9)} />
      <rect x={x - 8} y={piso - 30} width={w + 16} height={30} fill={osc(fondo, 0.66)} />
    </g>
  );
};
export const SUPV4_PISO = 920;
export const SuperV4: React.FC<SetProps & { alto?: number; piramide?: boolean; caja?: boolean; gondolas?: boolean; luz?: number }> = ({ capa, pal, alto = 400, piramide = true, caja = true, gondolas = true, luz = 1 }) => {
  const P = SUPV4_PISO;
  const sid = useId().replace(/:/g, "");
  if (capa === "frente") return null;
  if (capa === "lejos") {
    return (
      <g>
        <rect x={-800} y={-500} width={6000} height={1600} fill="#cfd6d2" />
        <rect x={-800} y={P - 780} width={6000} height={780} fill="#dfe5e0" />
        <rect x={-800} y={P - 780} width={6000} height={56} fill="#2f8a63" />
        {Array.from({ length: 12 }).map((_, i) => <text key={i} x={-600 + i * 520} y={P - 740} fontFamily={F_HUD} fontWeight={600} fontSize={28} letterSpacing={5} fill="#f2f0e6" opacity={0.85}>FRESH · DAIRY · BAKERY</text>)}
        {/* zócalo de azulejos bajo, detrás de las góndolas */}
        <rect x={-800} y={P - alto + 40} width={6000} height={alto - 40} fill="#cfd8d4" />
      </g>
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id={`sp${sid}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d9ddd6" /><stop offset="1" stopColor="#b9c0b8" /></linearGradient>
      </defs>
      <rect x={-800} y={P} width={6000} height={900} fill={`url(#sp${sid})`} />
      {Array.from({ length: 60 }).map((_, i) => <line key={i} x1={-800 + i * 110} y1={P} x2={-800 + i * 110 - 60} y2={P + 300} stroke="#000" strokeOpacity={0.08} strokeWidth={2} />)}
      {[0, 1, 2].map((r) => <line key={r} x1={-800} y1={P + 30 + r * 50} x2={5200} y2={P + 30 + r * 50} stroke="#000" strokeOpacity={0.08} strokeWidth={2} />)}
      {/* entrada de vidrio con la noche afuera */}
      <g>
        <rect x={-500} y={P - 720} width={900} height={720} fill="#0e1a20" />
        <rect x={-500} y={P - 720} width={900} height={720} fill={osc(pal.luzFria, 0.25)} opacity={0.7} />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-480 + i * 110} y={P - 560 - random(`ed${i}`) * 120} width={90} height={400} fill="#0a1216" />)}
        {[-260, 0, 260].map((x) => <rect key={x} x={x - 6} y={P - 720} width={12} height={720} fill="#c9cfd2" />)}
        <rect x={-500} y={P - 720} width={900} height={720} fill="none" stroke="#c9cfd2" strokeWidth={16} />
      </g>
      {gondolas && <GondolaV4 x={560} w={1100} piso={P} seed={1} alto={alto} />}
      {gondolas && <GondolaV4 x={1760} w={420} piso={P} seed={2} alto={alto} />}
      {piramide && <g>
        {Array.from({ length: 7 }).map((_, r) => Array.from({ length: 9 - r }).map((_, k) => {
          const x = 2350 - (9 - r) * 21 + k * 42;
          const y = P - 40 - r * 44;
          return <g key={`${r}${k}`}><rect x={x} y={y - 40} width={38} height={42} rx={6} fill="#e0563a" /><rect x={x} y={y - 28} width={38} height={14} fill="#f6efe2" /></g>;
        }))}
        <rect x={2140} y={P - 40} width={420} height={40} fill="#7a4a2e" />
      </g>}
      {gondolas && <GondolaV4 x={2620} w={500} piso={P} seed={3} alto={alto} />}
      {caja && <g>
        <rect x={3200} y={P - 230} width={420} height={230} rx={8} fill="#4a5a64" />
        <rect x={3190} y={P - 246} width={440} height={24} rx={6} fill="#2c3a42" />
        <rect x={3420} y={P - 330} width={150} height={90} rx={8} fill="#1d2a30" />
        <rect x={3432} y={P - 320} width={126} height={56} rx={4} fill="#5de0b0" opacity={0.85} />
      </g>}
      {gondolas && <GondolaV4 x={3720} w={900} piso={P} seed={4} alto={alto} />}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = -200 + i * 560;
        return (
          <g key={i}>
            <line x1={x - 140} y1={-300} x2={x - 140} y2={P - 860} stroke="#55595c" strokeWidth={3} />
            <line x1={x + 140} y1={-300} x2={x + 140} y2={P - 860} stroke="#55595c" strokeWidth={3} />
            <rect x={x - 170} y={P - 868} width={340} height={20} rx={10} fill={luz > 0.5 ? "#f6fbff" : "#6c7478"} />
            {luz > 0.01 && <Halo x={x} y={P - 856} r={420} color="#f4fbff" fuerza={0.5 * luz} />}
            {luz > 0.01 && <Charco x={x} y={P + 20} rx={380} color="#ffffff" fuerza={0.32 * luz} />}
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- placa oscura (pantalla) con contraste completo: contador que rueda
export const ContadorPlaca: React.FC<{ x: number; y: number; rotulo: string; valor: string; desde: number; hasta?: number; color?: string; tam?: number; pop?: number }> = ({ x, y, rotulo, valor, desde, hasta = 1e9, color = "#ffc93c", tam = 84, pop = 0 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 140 } });
  const o = interpolate(f, [desde, desde + 8, hasta, hasta + 10], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${(0.8 + 0.2 * s) * (1 + 0.06 * pop)})`, transformOrigin: "50% 0%", opacity: o,
      background: "rgba(18,15,24,0.9)", border: `4px solid ${color}`, borderRadius: 20, padding: "12px 34px 14px", textAlign: "center", whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: Math.max(28, tam * 0.36), letterSpacing: 4, color: "#f6ecd2" }}>{rotulo}</div>
      <div style={{ fontFamily: F_MONO, fontWeight: 800, fontSize: tam, lineHeight: 1.05, color, fontVariantNumeric: "tabular-nums" }}>{valor}</div>
    </div>
  );
};
// placa oscura que envuelve cualquier contenido de pantalla (x,y = esquina sup. izq.)
export const PlacaOscura: React.FC<{ x: number; y: number; w: number; h: number; desde: number; hasta?: number; children?: React.ReactNode; borde?: string }> = ({ x, y, w, h, desde, hasta = 1e9, children, borde = "#ffc93c" }) => {
  const f = useF();
  if (f < desde || f > hasta + 10) return null;
  const o = interpolate(f, [desde, desde + 10, hasta, hasta + 10], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, background: "rgba(18,15,24,0.9)", border: `4px solid ${borde}`, borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------- cartel-temporizador de la sección (mundo): placa oscura colgada en la pared
// x = centro, y = borde de arriba. `pop` = cuadro del último cambio (late). Entra con resorte de 10 cuadros.
export const TagTimer: React.FC<{ x: number; y: number; rot: string; valor: string; color: string; desde: number; pop?: number; w?: number; sub?: string }> = ({ x, y, rot, valor, color, desde, pop = -99, w = 260, sub }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 11, stiffness: 150 } });
  const o = interpolate(f, [desde, desde + 8], [0, 1], CL);
  const p = Math.max(0, 1 - Math.abs(f - pop - 3) / 6);
  const h = sub ? 150 : 128;
  return (
    <g transform={`translate(${x},${y}) scale(${(0.6 + 0.4 * s) * (1 + 0.07 * p)})`} opacity={o}>
      <line x1={-w * 0.3} y1={-70} x2={-w * 0.3} y2={4} stroke="#6a6e72" strokeWidth={4} />
      <line x1={w * 0.3} y1={-70} x2={w * 0.3} y2={4} stroke="#6a6e72" strokeWidth={4} />
      <rect x={-w / 2 + 6} y={8} width={w} height={h} rx={16} fill="#000" opacity={0.2} />
      <rect x={-w / 2} y={0} width={w} height={h} rx={16} fill="#141019" stroke={color} strokeWidth={6} />
      <text x={0} y={40} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} letterSpacing={4} fill="#f6ecd2">{rot}</text>
      <text x={0} y={102} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={54} fill={color}>{valor}</text>
      {sub && <text x={0} y={136} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} letterSpacing={2} fill="#c8bfae">{sub}</text>}
    </g>
  );
};

// ---------------------------------------------------------------- freezer horizontal con tapa que se abre (mundo), vista de costado
// x = borde izq., piso = P. tapa 0..1 (1 = 100°); bisagra atrás-IZQUIERDA, el borde libre sube por la derecha. Adentro: carne; olor verde.
export const FREEZ = { w: 260, h: 200 };
export const FreezerV4: React.FC<{ x: number; piso: number; tapa: number; olor: number; carne?: React.ReactNode; luz?: number }> = ({ x, piso, tapa, olor, carne, luz = 1 }) => {
  const f = useF();
  const { w, h } = FREEZ;
  const top = piso - h;
  return (
    <g>
      {tapa > 0.04 && <g>
        <rect x={x + 10} y={top - 4} width={w - 20} height={26} rx={4} fill="#1d2630" />
        <g transform={`translate(${x + w / 2},${top + 4})`}>{carne}</g>
      </g>}
      <rect x={x} y={top} width={w} height={h} rx={14} fill="#e9edf0" />
      <rect x={x} y={top + h - 26} width={w} height={26} rx={8} fill="#c4ccd2" />
      <rect x={x + 22} y={top + 60} width={110} height={38} rx={6} fill={luz > 0.5 ? "#5ab0ff" : "#7a8a96"} />
      <text x={x + 77} y={top + 87} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#fff">FROZEN</text>
      <circle cx={x + w - 34} cy={top + 78} r={9} fill={luz > 0.5 ? "#6aff9a" : "#c0352c"} />
      {olor > 0 && [0, 1, 2].map((i) => (
        <path key={i} d={`M${x + 70 + i * 60},${top - 10} q-16,-24 0,-48 q16,-24 0,-48`} stroke="#8aa63a" strokeWidth={10} strokeLinecap="round" fill="none"
          opacity={olor * (0.55 + 0.35 * Math.sin(f / 5 + i))} transform={`translate(0,${-((f * 1.5 + i * 13) % 34)})`} />
      ))}
      <g transform={`rotate(${-tapa * 100} ${x} ${top})`}>
        <rect x={x - 4} y={top - 22} width={w + 12} height={26} rx={8} fill="#d6dde2" stroke="#b0bac2" strokeWidth={3} />
        <rect x={x + w - 12} y={top - 16} width={18} height={22} rx={4} fill="#8a949a" />
      </g>
    </g>
  );
};
// borde libre de la tapa (donde la agarra la mano), en mundo
export const tapaPunta = (x: number, piso: number, tapa: number) => {
  const a = (tapa * 100 * Math.PI) / 180;
  return { x: x + (FREEZ.w + 2) * Math.cos(a), y: piso - FREEZ.h - (FREEZ.w + 2) * Math.sin(a) - 8 };
};

// ---------------------------------------------------------------- estante del pan (mundo): x = borde izq.; `falta` = índice del pan que se llevaron (fila 1)
export const PanRackV4: React.FC<{ x: number; piso: number; falta?: number }> = ({ x, piso, falta = -1 }) => (
  <g>
    <rect x={x} y={piso - 380} width={300} height={380} fill="#6a4a32" />
    {[piso - 330, piso - 230, piso - 130, piso - 30].map((y) => <rect key={y} x={x - 6} y={y} width={312} height={12} fill="#4a3222" />)}
    {[piso - 330, piso - 230, piso - 130].map((y, r) => Array.from({ length: 4 }).map((_, i) => (r === 1 && i === falta ? null :
      <g key={`${r}${i}`} transform={`translate(${x + 40 + i * 72},${y})`}><path d="M-30,0 Q-32,-34 0,-36 Q32,-34 30,0 Z" fill="#d89a4a" />{[-12, 2, 16].map((xx) => <path key={xx} d={`M${xx - 4},-26 l8,12`} stroke="#a8642a" strokeWidth={3} strokeLinecap="round" />)}</g>)))}
    <rect x={x + 60} y={piso - 420} width={180} height={34} rx={6} fill="#f2ece0" /><text x={x + 150} y={piso - 396} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#6a4a32">BAKERY</text>
  </g>
);
// pan en la mano con moho que crece (0..1)
export const PanMoho: React.FC<{ moho: number }> = ({ moho }) => (
  <g transform="translate(0,-16)">
    <path d="M-34,14 Q-38,-14 0,-18 Q38,-14 34,14 Z" fill="#d89a4a" />
    {[-14, 4, 20].map((x) => <path key={x} d={`M${x - 5},-10 l10,16`} stroke="#a8642a" strokeWidth={4} strokeLinecap="round" />)}
    {moho > 0 && <g fill="#5f8a3a" opacity={Math.min(1, moho * 1.3)}>
      {[[-18, -4, 7], [6, -10, 6], [18, 4, 5], [-4, 6, 5], [24, -6, 4], [-26, 6, 4]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r * Math.min(1, moho * 1.6 - i * 0.12)} />)}
    </g>}
  </g>
);
// cartón de leche en la mano
export const CartonLeche: React.FC = () => (
  <g transform="translate(0,-30)">
    <path d="M-16,-26 L0,-40 L16,-26 Z" fill="#e8eef2" stroke="#9aa4ac" strokeWidth={2} />
    <rect x={-16} y={-26} width={32} height={56} rx={3} fill="#f6f8fa" stroke="#9aa4ac" strokeWidth={2} />
    <rect x={-16} y={-6} width={32} height={18} fill="#5ab0ff" />
    <text x={0} y={8} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={11} fill="#fff">MILK</text>
  </g>
);
