// lc02 · vuelta 4 (v4f, planos P21-P40): componentes nuevos. Todo ADITIVO; no toca los compartidos.
// - SubFundido: corte interno de una escena con fundido CORTO de 6 cuadros (la toma B entra encima de la A).
// - TapaAlarma: tapa con pared la alarma de CO del set Living (estorbaba en los encuadres cerrados).
// - TarjetaRopaV4: la tarjeta de ropa con el ancho calculado por el texto (el ✓ ya no pisa la palabra).
// - TermoPoste: termómetro de tubo atado al poste de la farola (mundo): la cifra la cuenta el mercurio, sin dígitos grandes.
// - EscarchaCanio: escarcha que avanza por FUERA del caño del diagrama y la fisura que se abre antes de reventar.
// - AlarmaV4: alarma de CO a pila con LED y halo que laten SUAVE (sin parpadeo duro de 1 cuadro).
// - Beep: «BEEP» blanco con borde rojo que salta con cada bip.
// - Botas: un par de botas en primer término (cámara al ras del piso).
// - CanioHollin: el caño de la estufa con una ventana en corte: el hollín crece adentro y el humo vuelve a bajar.
// - Rama: rama de pino con estrella (la que trae Theo en P40).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { Halo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { EXPRESIONES } from "../../anikit/personaje";
import { cl, ou } from "./lc02_planos1_comp";

// párpados casi cerrados (se duermen por el CO)
if (!EXPRESIONES.dormido) EXPRESIONES.dormido = { ...EXPRESIONES.cansado, parpado: 0.88 };

const rnd = (n: number) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

// ---------------------------------------------------------------------------------------------------------------
export const SubFundido: React.FC<{ c: number; d?: number; a: React.ReactNode; b: React.ReactNode }> = ({ c, d = 6, a, b }) => {
  const f = useF();
  return (
    <AbsoluteFill>
      {f < c + d && <AbsoluteFill>{a}</AbsoluteFill>}
      {f >= c && <AbsoluteFill style={{ opacity: interpolate(f, [c, c + d], [0, 1], cl) }}>{b}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// la alarma de CO de la pared del Living (x = 760, y = piso − 400) tapada con el color de la pared
export const TapaAlarma: React.FC<{ piso: number; x?: number; pared?: string }> = ({ piso, x = 760, pared = "#5a4a5e" }) => (
  <g><circle cx={x} cy={piso - 400} r={44} fill={pared} /><rect x={x - 30} y={piso - 372} width={60} height={30} fill={pared} /></g>
);

// ---------------------------------------------------------------------------------------------------------------
export const TarjetaRopaV4: React.FC<{ x: number; y: number; desde: number; rotulo: string; ok: boolean; color: string; gotas?: number; calor?: number; prenda?: "buzo" | "remera" }> = ({ x, y, desde, rotulo, ok, color, gotas = 0, calor = 0, prenda = "buzo" }) => {
  const f = useF();
  if (f < desde) return null;
  const s = interpolate(f, [desde, desde + 10], [0.6, 1], ou), o = interpolate(f, [desde, desde + 8], [0, 1], cl);
  const tw = rotulo.length * 23;
  const W = 160 + tw + 96, H = 150;
  return (
    <svg width={W + 60} height={H + 160} viewBox={`-30 -130 ${W + 60} ${H + 160}`} style={{ position: "absolute", left: x - 235 - 30, top: y - H / 2 - 130, opacity: o, transform: `scale(${s})`, transformOrigin: "265px 205px", overflow: "visible" }}>
      <rect x={0} y={0} width={W} height={H} rx={24} fill="#120f18" opacity={0.92} stroke={ok ? "#5ad07a" : "#e2483a"} strokeWidth={5} />
      <g transform={`translate(80,${H / 2})`}>
        {prenda === "buzo" ? <path d="M-50,-40 L-20,-50 Q0,-36 20,-50 L50,-40 L64,10 L44,16 L40,-6 L40,48 L-40,48 L-40,-6 L-44,16 L-64,10 Z" fill={color} stroke="#00000055" strokeWidth={3} />
          : <path d="M-46,-40 L-18,-48 Q0,-38 18,-48 L46,-40 L58,-14 L38,-6 L38,48 L-38,48 L-38,-6 L-58,-14 Z" fill={color} stroke="#00000055" strokeWidth={3} />}
        {prenda === "buzo" && [-24, 0, 24].map((d) => <path key={d} d={`M${d - 8},-10 l8,10 l8,-10`} stroke="#ffffff66" strokeWidth={3} fill="none" />)}
        {gotas > 0 && [[-20, -6], [10, 14], [22, -18], [-8, 26]].map(([gx, gy], i) => <path key={i} d={`M${gx},${gy - 12} q9,13 0,20 q-9,-7 0,-20 Z`} fill="#5aa8e8" opacity={Math.max(0, Math.min(1, gotas * 4 - i))} />)}
        {calor > 0 && [-30, 0, 30].map((d, i) => { const t = ((f / 18) + i / 3) % 1; return <path key={d} d={`M${d},${-56 - t * 50} q-10,-12 0,-24 q10,-12 0,-24`} stroke="#ff9a4a" strokeWidth={6} fill="none" strokeLinecap="round" opacity={calor * (1 - t)} />; })}
      </g>
      <text x={160} y={H / 2 + 13} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#f6ecd2" letterSpacing={1}>{rotulo}</text>
      <g transform={`translate(${W - 48},${H / 2})`}>{ok ? <path d="M-20,0 L-6,16 L22,-18" stroke="#5ad07a" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M-18,-18 L18,18 M18,-18 L-18,18" stroke="#e2483a" strokeWidth={10} strokeLinecap="round" />}</g>
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// termómetro de tubo atado a un poste (mundo). x = poste, y0 = arriba del cuerpo, alto del cuerpo = 300.
// La escala sólo marca 20 / 0 / −20 / −40 y una franja roja «peor» bajo −30: la lectura la da el mercurio.
export const TermoPoste: React.FC<{ x: number; y0: number; temp: number; f: number; brilla?: number }> = ({ x, y0, temp, f, brilla = 0 }) => {
  const H = 300, top = y0 + 26, bot = y0 + H - 60;
  const yT = (t: number) => interpolate(t, [-40, 20], [bot, top], cl);
  const nivel = yT(temp);
  return (
    <g>
      {/* abrazaderas al poste */}
      {[y0 + 30, y0 + H - 40].map((yy) => <rect key={yy} x={x - 46} y={yy} width={92} height={12} rx={4} fill="#5a5660" />)}
      <rect x={x - 40} y={y0} width={80} height={H} rx={30} fill="#e8e4dc" stroke="#9a948a" strokeWidth={3} />
      {/* franja «las peores noches» */}
      <rect x={x - 32} y={yT(-30)} width={10} height={yT(-40) - yT(-30)} fill="#e2483a" opacity={0.85} />
      <rect x={x - 9} y={top - 8} width={18} height={bot - top + 20} rx={9} fill="#ffffff" stroke="#bdb6a8" strokeWidth={3} />
      <rect x={x - 5} y={nivel} width={10} height={bot + 12 - nivel} rx={5} fill="#e2483a" />
      <circle cx={x} cy={bot + 26} r={20} fill="#e2483a" stroke="#bdb6a8" strokeWidth={3} />
      {brilla > 0 && <Halo x={x} y={nivel} r={90} color="#ff5a4a" fuerza={0.5 * brilla * (0.8 + 0.2 * Math.sin(f / 4))} />}
      {[20, 0, -20, -40].map((t) => <g key={t}><rect x={x + 12} y={yT(t) - 2} width={14} height={4} fill="#3a3440" /><text x={x + 30} y={yT(t) + 7} fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#3a3440">{t < 0 ? `−${-t}` : t}</text></g>)}
      {[10, -10, -30].map((t) => <rect key={t} x={x + 12} y={yT(t) - 1.5} width={8} height={3} fill="#3a3440" />)}
      {/* escarcha en el vidrio */}
      <path d={`M${x - 40},${y0 + 40} q16,10 10,30 q14,-6 22,8`} stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.8} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// escarcha por fuera del caño de CanioPared (pantalla): costra blanca dentada que avanza desde los dos extremos;
// fisura negra que se abre en el centro cuando el hielo empuja (antes del reventón)
export const EscarchaCanio: React.FC<{ hielo: number; fisura: number; roto: boolean }> = ({ hielo, fisura, roto }) => {
  const y = 600, cx = 1000;
  const hinch = Math.max(0, hielo - 0.55) / 0.45 * 30;
  const fI = (cx - 60) * hielo, fD = 1920 - (1920 - cx - 60) * hielo;
  const costra = (a: number, b: number, lado: number, k: number) => {
    if (b - a < 4) return null;
    const n = Math.max(2, Math.floor((b - a) / 26));
    let d = `M${a},${y + lado * 46}`;
    for (let i = 0; i <= n; i++) {
      const xx = a + ((b - a) * i) / n;
      const yy = y + lado * (46 + (i % 2 ? 14 + rnd(i + k) * 10 : 4));
      d += ` L${xx},${yy}`;
    }
    d += ` L${b},${y + lado * 46} Z`;
    return <path d={d} fill="#f2f9ff" stroke="#cfe6ff" strokeWidth={2} />;
  };
  return (
    <g>
      {costra(0, fI, -1, 1)}{costra(0, fI, 1, 2)}{costra(fD, 1920, -1, 3)}{costra(fD, 1920, 1, 4)}
      {/* cristales en los frentes */}
      {hielo > 0.02 && hielo < 0.999 && [fI, fD].map((xx, j) => Array.from({ length: 4 }).map((_, i) => <g key={`${j}${i}`} transform={`translate(${xx},${y + (i % 2 ? -1 : 1) * (56 + i * 6)}) rotate(${i * 30})`}>{[0, 60, 120].map((a) => <path key={a} d="M-12,0 H12" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" transform={`rotate(${a})`} />)}</g>))}
      {fisura > 0 && !roto && <path d={`M${cx - 30},${y - 48 - hinch * 2} l14,${18 * fisura} l-10,${14 * fisura} l18,${16 * fisura} l-8,${20 * fisura}`} stroke="#120f18" strokeWidth={6} fill="none" strokeLinejoin="round" />}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// alarma de CO a pila (mundo) con latido suave: lat 0..1
export const AlarmaV4: React.FC<{ x: number; y: number; s?: number; lat: number }> = ({ x, y, s = 1, lat }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {lat > 0 && <Halo x={0} y={0} r={190} color="#ff3a2e" fuerza={0.25 + 0.5 * lat} />}
    <rect x={-38} y={-38} width={76} height={76} rx={16} fill="#f2ece0" stroke="#bdb6a8" strokeWidth={4} />
    {[0, 1, 2].map((k) => <rect key={k} x={-22} y={-20 + k * 10} width={44} height={4} rx={2} fill="#bdb6a8" />)}
    <circle cx={22} cy={22} r={8} fill="#5a1410" /><circle cx={22} cy={22} r={8} fill="#ff3a2e" opacity={0.3 + 0.7 * lat} />
    <text x={-8} y={30} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#3a3440">CO</text>
  </g>
);

// «BEEP» (pantalla): cada bip salta de la alarma, blanco con borde rojo
export const Beep: React.FC<{ x: number; y: number; en: number[]; tam?: number }> = ({ x, y, en, tam = 58 }) => {
  const f = useF();
  return (
    <>{en.map((e, i) => {
      if (f < e || f > e + 18) return null;
      const t = (f - e) / 18;
      return <div key={i} style={{ position: "absolute", left: x + (i % 2 ? 40 : -10), top: y - t * 50 - (i % 3) * 20, opacity: Math.min(1, (1 - t) * 1.6), transform: `translate(-50%,-50%) rotate(${i % 2 ? 6 : -6}deg) scale(${0.7 + 0.4 * Math.min(1, t * 5)})`, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color: "#ffffff", WebkitTextStroke: "3px #e2283a", letterSpacing: 2 }}>BEEP</div>;
    })}</>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// par de botas de nieve en primer término (mundo; x = centro, piso)
export const Botas: React.FC<{ x: number; piso: number; s?: number; color?: string }> = ({ x, piso, s = 1, color = "#3a2c26" }) => (
  <g transform={`translate(${x},${piso}) scale(${s})`}>
    {[-70, 40].map((d, i) => <g key={d} transform={`translate(${d},0) rotate(${i ? 6 : -4})`}>
      <path d="M-30,0 L-30,-120 Q-30,-136 -14,-136 L22,-136 Q34,-136 34,-120 L34,-50 Q90,-46 96,-16 L96,0 Z" fill={color} stroke="#120f18" strokeWidth={4} />
      <rect x={-34} y={-140} width={72} height={22} rx={8} fill="#c8bca8" />
      <rect x={-30} y={-12} width={126} height={12} rx={4} fill="#120f18" />
    </g>)}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// caño de la estufa con ventana en corte (mundo): x = caño, y0..y1 = tramo cortado; hollin 0..1 cierra el paso;
// vuelve 0..1 = el humo que no puede subir vuelve a bajar
export const CanioHollin: React.FC<{ x: number; y0: number; y1: number; f: number; hollin: number; vuelve: number }> = ({ x, y0, y1, f, hollin, vuelve }) => {
  const w = 120;
  const paso = 1 - hollin * 0.82;
  const tope = y1 - (y1 - y0) * (0.25 + 0.75 * paso);
  return (
    <g>
      <rect x={x - w / 2 - 14} y={y0 - 14} width={w + 28} height={y1 - y0 + 28} rx={10} fill="#3a3440" stroke="#f1d36b" strokeWidth={5} strokeDasharray="14 9" />
      <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} fill="#1a1416" />
      {/* costra de hollín en las paredes de adentro */}
      {Array.from({ length: 12 }).map((_, i) => {
        const yy = y0 + 6 + i * ((y1 - y0 - 12) / 12);
        const a = hollin * (22 + rnd(i) * 22);
        return <g key={i}>
          <path d={`M${x - w / 2},${yy} q${a},6 ${a * 0.8},${(y1 - y0) / 24} q${-a * 0.2},8 ${-a * 0.8},${(y1 - y0) / 24} Z`} fill="#0a0808" stroke="#2e2a2c" strokeWidth={2} />
          <path d={`M${x + w / 2},${yy + 8} q${-a},6 ${-a * 0.8},${(y1 - y0) / 24} q${a * 0.2},8 ${a * 0.8},${(y1 - y0) / 24} Z`} fill="#0a0808" stroke="#2e2a2c" strokeWidth={2} />
        </g>;
      })}
      {/* humo adentro: sube hasta el tapón y vuelve */}
      <defs><radialGradient id="chh"><stop offset="0" stopColor="#a8acb8" stopOpacity={0.9} /><stop offset="1" stopColor="#a8acb8" stopOpacity={0} /></radialGradient></defs>
      {Array.from({ length: 7 }).map((_, i) => {
        const t = ((f / 26) + i / 7) % 1;
        const sube = t < 0.6;
        const yy = sube ? y1 - (t / 0.6) * (y1 - tope) : tope + ((t - 0.6) / 0.4) * (y1 - tope) * vuelve;
        return <ellipse key={i} cx={x + Math.sin(f / 9 + i) * 14} cy={yy} rx={34} ry={26} fill="url(#chh)" opacity={sube ? 0.9 : 0.9 * vuelve} />;
      })}
      {/* tapón */}
      <path d={`M${x - w / 2},${tope - 30} Q${x - 20},${tope + 10 * hollin} ${x},${tope - 4} Q${x + 24},${tope + 12 * hollin} ${x + w / 2},${tope - 30} V${tope - 70} H${x - w / 2} Z`} fill="#0a0808" opacity={hollin} />
    </g>
  );
};

// rama de pino con estrella (en la mano)
export const Rama: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`translate(0,-34) scale(${s})`}>
    <path d="M0,50 L0,-40" stroke="#5a3a24" strokeWidth={6} />
    {[-28, -12, 4, 20].map((y, i) => <path key={i} d={`M0,${y} l${-30 + i * 2},${18} M0,${y} l${30 - i * 2},${18}`} stroke={i % 2 ? "#3a7a50" : "#2f6a44"} strokeWidth={8} strokeLinecap="round" />)}
    {[[-18, 0, "#e2483a"], [16, 14, "#f1d36b"], [-10, 26, "#5aa8e8"]].map(([cx, cy, c], i) => <circle key={i} cx={cx as number} cy={cy as number} r={5} fill={c as string} />)}
    <path d="M0,-58 l6,12 h12 l-10,8 l4,12 l-12,-7 l-12,7 l4,-12 l-10,-8 h12 Z" fill="#ffcf6e" stroke="#c89a3a" strokeWidth={2} />
  </g>
);
