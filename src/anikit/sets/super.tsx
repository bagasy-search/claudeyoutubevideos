// SET 3 · SUPERMERCADO (serie zombie «30 Days Locked Inside a Supermarket»): góndolas largas llenas de
// productos con precios, tubos fluorescentes, cartel de pasillo, pirámide de latas, carrito y la entrada de
// vidrio con la noche afuera (por donde aparecen los de afuera). Piso: SUPER_PISO. x útil: -600 … 4200.
// Puntos: entrada 200, pasillo 1400, pirámide 2350, caja 3300. variante "zombi": luces que fallan, cosas caídas.
import React from "react";
import { random } from "remotion";
import { Charco, Halo } from "../luz";
import { F_HUD } from "../pantalla";
import { SetProps, acl, osc } from "./comun";

export const SUPER_PISO = 920;
export const SUPER_PUNTOS = { entrada: 200, pasillo: 1400, piramide: 2350, caja: 3300, carrito: 1900 };

const COLS = ["#e0563a", "#f1c24a", "#5aa0d8", "#7fc46a", "#f2efe6", "#c9463a", "#8f6bd1", "#f08a3c"];
const Producto: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  const c = COLS[Math.floor(random(`sp${k}`) * COLS.length)];
  const t = Math.floor(random(`st${k}`) * 4);
  if (t === 0) return <g><rect x={x} y={y - 46} width={30} height={46} rx={3} fill={c} /><rect x={x} y={y - 32} width={30} height={12} fill="#f6f1e6" opacity={0.85} /></g>; // caja
  if (t === 1) return <g><rect x={x + 3} y={y - 34} width={24} height={34} rx={5} fill={c} /><rect x={x + 3} y={y - 24} width={24} height={10} fill={osc(c, 0.7)} /></g>; // lata
  if (t === 2) return <g><rect x={x + 6} y={y - 52} width={18} height={52} rx={6} fill={c} /><rect x={x + 11} y={y - 62} width={8} height={12} fill={osc(c, 0.65)} /></g>; // botella
  return <g><path d={`M${x},${y} L${x + 3},${y - 40} Q${x + 15},${y - 48} ${x + 27},${y - 40} L${x + 30},${y} Z`} fill={c} /></g>; // bolsa
};

const Gondola: React.FC<{ x: number; w: number; piso: number; seed: number; vacia?: number; cartel?: string; fondo?: string }> = ({ x, w, piso, seed, vacia = 0, cartel, fondo = "#e9ebe6" }) => {
  const filas = 5;
  return (
    <g>
      <rect x={x} y={piso - 560} width={w} height={560} fill={fondo} />
      <rect x={x} y={piso - 560} width={w} height={560} fill={fondo === "#e9ebe6" ? "url(#spsombra)" : "url(#spsombraz)"} />
      {Array.from({ length: filas }).map((_, r) => {
        const ys = piso - 470 + r * 100;
        const n = Math.floor(w / 34);
        return (
          <g key={r}>
            {Array.from({ length: n }).map((_, k) => (random(`gv${seed}${r}${k}`) < vacia ? null : <Producto key={k} x={x + 6 + k * 34} y={ys} k={seed * 1000 + r * 100 + k} />))}
            <rect x={x} y={ys} width={w} height={12} fill={osc(fondo, 0.8)} />
            {Array.from({ length: Math.floor(w / 140) }).map((_, k) => <rect key={k} x={x + 20 + k * 140} y={ys + 2} width={34} height={9} fill={k % 3 ? "#f4e04a" : "#ff6a4a"} />)}
          </g>
        );
      })}
      <rect x={x - 8} y={piso - 580} width={w + 16} height={24} rx={4} fill={osc(fondo, 0.9)} />
      <rect x={x - 8} y={piso - 30} width={w + 16} height={30} fill={osc(fondo, 0.66)} />
      {cartel && (
        <g>
          <line x1={x + w / 2 - 90} y1={piso - 760} x2={x + w / 2 - 90} y2={piso - 690} stroke="#55595c" strokeWidth={3} />
          <line x1={x + w / 2 + 90} y1={piso - 760} x2={x + w / 2 + 90} y2={piso - 690} stroke="#55595c" strokeWidth={3} />
          <rect x={x + w / 2 - 160} y={piso - 700} width={320} height={86} rx={10} fill="#2c6e57" />
          <text x={x + w / 2} y={piso - 646} fontFamily={F_HUD} fontWeight={600} fontSize={40} letterSpacing={3} fill="#f6f1e2" textAnchor="middle">{cartel}</text>
        </g>
      )}
    </g>
  );
};

export const Supermercado: React.FC<SetProps> = ({ capa, f, pal, variante }) => {
  const P = SUPER_PISO;
  const zombi = variante === "zombi";
  // tubos: en zombi, algunos titilan y uno está muerto
  const tubo = (i: number) => {
    if (!zombi) return 1;
    if (i === 3) return 0.05;
    if (i % 3 === 1) return random(`tb${i}${Math.floor(f / 2)}`) > 0.9 ? 0.2 : 1;
    return 0.85;
  };
  if (capa === "lejos") {
    return (
      <g>
        <rect x={-800} y={-500} width={6000} height={1600} fill={zombi ? "#1b2826" : "#cfd6d2"} />
        {/* pared del fondo con el cartel de la tienda y la heladera de lácteos */}
        <rect x={-800} y={P - 760} width={6000} height={760} fill={zombi ? "#2a3836" : "#dfe5e0"} />
        <rect x={-800} y={P - 760} width={6000} height={60} fill={zombi ? "#1f6b4f" : "#2f8a63"} />
        {Array.from({ length: 12 }).map((_, i) => <text key={i} x={-600 + i * 520} y={P - 718} fontFamily={F_HUD} fontWeight={600} fontSize={30} letterSpacing={5} fill="#f2f0e6" opacity={0.85}>FRESH · DAIRY · BAKERY</text>)}
        {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={-700 + i * 330} y={P - 620} width={300} height={420} rx={6} fill={zombi ? "#27403e" : "#bfe1e6"} stroke="#9fb2b4" strokeWidth={6} />)}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {/* carrito en primer término */}
        <g transform={`translate(${SUPER_PUNTOS.carrito},${P + 40})`} opacity={0.98}>
          <path d="M-120,-170 L130,-170 L110,-50 L-95,-50 Z" fill="none" stroke="#8d969b" strokeWidth={8} />
          {Array.from({ length: 7 }).map((_, k) => <line key={k} x1={-110 + k * 36} y1={-170} x2={-90 + k * 32} y2={-50} stroke="#8d969b" strokeWidth={4} />)}
          <path d="M-120,-170 L-150,-210 L-185,-210" stroke="#7b8388" strokeWidth={9} fill="none" strokeLinecap="round" />
          <circle cx={-80} cy={-10} r={16} fill="#2a2a2a" /><circle cx={90} cy={-10} r={16} fill="#2a2a2a" />
        </g>
      </g>
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id={zombi ? "spsombraz" : "spsombra"} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={zombi ? 0.45 : 0.15} /></linearGradient>
        <linearGradient id={zombi ? "sppisoz" : "sppiso"} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={zombi ? "#3a4644" : "#d9ddd6"} /><stop offset="1" stopColor={zombi ? "#1f2826" : "#b9c0b8"} /></linearGradient>
      </defs>
      {/* piso de baldosas con reflejos */}
      <rect x={-800} y={P} width={6000} height={900} fill={zombi ? "url(#sppisoz)" : "url(#sppiso)"} />
      {Array.from({ length: 60 }).map((_, i) => <line key={i} x1={-800 + i * 110} y1={P} x2={-800 + i * 110 - 60} y2={P + 300} stroke="#000" strokeOpacity={0.08} strokeWidth={2} />)}
      {[0, 1, 2].map((r) => <line key={r} x1={-800} y1={P + 30 + r * 50} x2={5200} y2={P + 30 + r * 50} stroke="#000" strokeOpacity={0.08} strokeWidth={2} />)}
      {/* entrada de vidrio con la noche afuera */}
      <g>
        <rect x={-500} y={P - 720} width={900} height={720} fill="#0e1a20" />
        <rect x={-500} y={P - 720} width={900} height={720} fill={osc(pal.luzFria, 0.25)} opacity={0.7} />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-480 + i * 110} y={P - 560 - random(`ed${i}`) * 120} width={90} height={400} fill="#0a1216" />)}
        {[-260, 0, 260].map((x) => <rect key={x} x={x - 6} y={P - 720} width={12} height={720} fill="#c9cfd2" />)}
        <rect x={-500} y={P - 720} width={900} height={720} fill="none" stroke="#c9cfd2" strokeWidth={16} />
        <rect x={-200} y={P - 820} width={500} height={80} rx={8} fill="#2f8a63" />
        <text x={50} y={P - 766} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f6f1e2" textAnchor="middle" letterSpacing={4}>ENTRANCE</text>
      </g>
      <Gondola x={560} w={1100} piso={P} seed={1} vacia={zombi ? 0.35 : 0.03} fondo={zombi ? "#6f7c79" : undefined} cartel="AISLE 4 · CANS" />
      <Gondola x={1760} w={420} piso={P} seed={2} vacia={zombi ? 0.5 : 0.05} fondo={zombi ? "#6f7c79" : undefined} />
      {/* pirámide de latas en punta de góndola */}
      <g>
        {Array.from({ length: 7 }).map((_, r) => Array.from({ length: 9 - r }).map((_, k) => {
          const x = SUPER_PUNTOS.piramide - (9 - r) * 21 + k * 42;
          const y = P - 40 - r * 44;
          if (zombi && r > 4 && k > 1) return null;
          return <g key={`${r}${k}`}><rect x={x} y={y - 40} width={38} height={42} rx={6} fill="#e0563a" /><rect x={x} y={y - 28} width={38} height={14} fill="#f6efe2" /></g>;
        }))}
        <rect x={SUPER_PUNTOS.piramide - 210} y={P - 40} width={420} height={40} fill="#7a4a2e" />
        <rect x={SUPER_PUNTOS.piramide - 90} y={P - 380} width={180} height={50} rx={6} fill="#ffcf3a" />
        <text x={SUPER_PUNTOS.piramide} y={P - 344} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#7a2016" textAnchor="middle">2 FOR $1</text>
      </g>
      <Gondola x={2620} w={500} piso={P} seed={3} vacia={zombi ? 0.4 : 0.02} fondo={zombi ? "#6f7c79" : undefined} />
      {/* caja registradora */}
      <g>
        <rect x={3200} y={P - 230} width={420} height={230} rx={8} fill="#4a5a64" />
        <rect x={3190} y={P - 246} width={440} height={24} rx={6} fill="#2c3a42" />
        <rect x={3420} y={P - 330} width={150} height={90} rx={8} fill="#1d2a30" />
        <rect x={3432} y={P - 320} width={126} height={56} rx={4} fill={zombi ? "#0d1a14" : "#5de0b0"} opacity={0.85} />
        <line x1={3495} y1={P - 330} x2={3495} y2={P - 470} stroke="#55595c" strokeWidth={4} />
        <rect x={3430} y={P - 520} width={130} height={56} rx={6} fill="#ffcf3a" />
        <text x={3495} y={P - 482} fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#3a2a10" textAnchor="middle">3</text>
      </g>
      <Gondola x={3720} w={900} piso={P} seed={4} vacia={zombi ? 0.45 : 0.02} fondo={zombi ? "#6f7c79" : undefined} cartel="AISLE 5 · WATER" />
      {zombi && Array.from({ length: 22 }).map((_, i) => <g key={i} transform={`translate(${600 + i * 170 + random(`cf${i}`) * 80},${P + 14 + random(`cy${i}`) * 40}) rotate(${random(`cr${i}`) * 180})`}><Producto x={-15} y={20} k={9000 + i} /></g>)}
      {/* tubos fluorescentes y sus charcos de luz */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = -200 + i * 560, k = tubo(i);
        return (
          <g key={i}>
            <line x1={x - 140} y1={-300} x2={x - 140} y2={P - 860} stroke="#55595c" strokeWidth={3} />
            <line x1={x + 140} y1={-300} x2={x + 140} y2={P - 860} stroke="#55595c" strokeWidth={3} />
            <rect x={x - 170} y={P - 868} width={340} height={20} rx={10} fill={k > 0.5 ? "#f6fbff" : "#6c7478"} />
            <Halo x={x} y={P - 856} r={420} color={zombi ? pal.luzFria : "#f4fbff"} fuerza={0.5 * k} />
            <Charco x={x} y={P + 20} rx={380} color={zombi ? pal.luzFria : "#ffffff"} fuerza={0.32 * k} />
          </g>
        );
      })}
      {zombi && <Halo x={-50} y={P - 760} r={300} color={pal.acento} fuerza={Math.floor(f / 20) % 2 ? 0.65 : 0.25} />}
      {zombi && <g><rect x={-110} y={P - 800} width={120} height={36} rx={6} fill={pal.acento} opacity={0.95} /><text x={-50} y={P - 774} fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#fff" textAnchor="middle">EXIT</text></g>}
    </g>
  );
};
