// Piezas de Chicago que comparten los sets de Tenzo Films: nieve, vía elevada de la línea roja, el tren que cruza,
// skyline de Uptown con ventanas frías. Todo en coordenadas del mundo.
import React from "react";
import { random } from "remotion";
import { Halo } from "../../anikit/luz";
import { osc } from "../../anikit/sets/comun";

// nieve: copos que caen lento con vaivén; `grande` = copos de primer término (capa frente)
export const Nieve: React.FC<{ f: number; x0?: number; w?: number; y0?: number; h?: number; n?: number; seed?: number; grande?: boolean; color?: string }> = ({ f, x0 = -500, w = 3000, y0 = -300, h = 1500, n = 120, seed = 0, grande, color = "#eef3fa" }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: string) => random(`nv${seed}${k}${i}`);
      const vel = (grande ? 2.6 : 1.1) + r("v") * (grande ? 2 : 1.2);
      const y = y0 + ((r("y") * h + f * vel) % h);
      const x = x0 + r("x") * w + Math.sin(f / (30 + r("p") * 30) + i) * (grande ? 22 : 10) + f * 0.4;
      const rad = (grande ? 5 : 2) + r("s") * (grande ? 5 : 2.4);
      return <circle key={i} cx={x0 + ((x - x0) % w)} cy={y} r={rad} fill={color} opacity={(grande ? 0.55 : 0.45) + r("o") * 0.4} />;
    })}
  </g>
);

// estructura de la vía elevada (vigas y columnas) a la altura y
export const ViaElevada: React.FC<{ x0: number; w: number; y: number; color?: string; columnas?: boolean; piso?: number }> = ({ x0, w, y, color = "#1a1d23", columnas = true, piso = 900 }) => (
  <g>
    <rect x={x0} y={y} width={w} height={46} fill={color} />
    <rect x={x0} y={y + 46} width={w} height={14} fill={osc(color.startsWith("#") ? color : "#1a1d23", 0.8)} />
    {Array.from({ length: Math.ceil(w / 60) }).map((_, k) => <path key={k} d={`M${x0 + k * 60},${y + 4} L${x0 + k * 60 + 30},${y + 42} L${x0 + k * 60 + 60},${y + 4}`} stroke="#2a2e36" strokeWidth={5} fill="none" />)}
    {columnas && Array.from({ length: Math.ceil(w / 520) + 1 }).map((_, k) => (
      <g key={k}>
        <rect x={x0 + k * 520 + 40} y={y + 60} width={26} height={piso - y - 60} fill={color} />
        <path d={`M${x0 + k * 520 + 10},${y + 60} L${x0 + k * 520 + 53},${y + 140} L${x0 + k * 520 + 96},${y + 60}`} stroke={color} strokeWidth={12} fill="none" />
      </g>
    ))}
  </g>
);

// el tren de la línea roja cruzando: f = cuadros desde que entra por la izquierda (tarda ~110 cuadros en cruzar w)
export const TrenElevado: React.FC<{ x0: number; w: number; y: number; f: number; vel?: number }> = ({ x0, w, y, f, vel = 34 }) => {
  if (f < 0) return null;
  const largo = 4 * 520;
  const x = x0 - largo + f * vel;
  if (x > x0 + w) return null;
  return (
    <g>
      {Array.from({ length: 4 }).map((_, k) => {
        const cx = x + k * 520;
        return (
          <g key={k}>
            <rect x={cx} y={y - 150} width={500} height={150} rx={14} fill="#b8bec8" />
            <rect x={cx} y={y - 40} width={500} height={14} fill="#c23a32" opacity={0.85} />
            {Array.from({ length: 6 }).map((_, j) => <rect key={j} x={cx + 24 + j * 78} y={y - 126} width={56} height={52} rx={6} fill="#e9eef8" opacity={0.85} />)}
            {Array.from({ length: 6 }).map((_, j) => random(`tp${k}${j}`) > 0.6 ? <circle key={`p${j}`} cx={cx + 52 + j * 78} cy={y - 96} r={12} fill="#5a6070" opacity={0.6} /> : null)}
            <Halo x={cx + 250} y={y - 100} r={360} color="#dfe8ff" fuerza={0.18} />
          </g>
        );
      })}
    </g>
  );
};

// skyline de Uptown: edificios bajos de ladrillo con ventanas frías (algunas prendidas), tanques de agua en los techos
export const Skyline: React.FC<{ x0: number; w: number; piso: number; f: number; seed?: number; dia?: boolean }> = ({ x0, w, piso, f, seed = 0, dia }) => {
  const eds: React.ReactNode[] = [];
  let x = x0;
  let i = 0;
  while (x < x0 + w) {
    const r = (k: string) => random(`sk${seed}${k}${i}`);
    const ew = 180 + r("w") * 260, eh = 220 + r("h") * 380;
    const c = dia ? ["#6a6e75", "#5b5f66", "#73777e"][i % 3] : ["#1d2129", "#232831", "#1a1e25"][i % 3];
    const filas = Math.floor((eh - 40) / 60), cols = Math.floor((ew - 30) / 50);
    eds.push(
      <g key={i}>
        <rect x={x} y={piso - eh} width={ew} height={eh} fill={c} />
        {r("t") > 0.5 && <g><rect x={x + ew * 0.6} y={piso - eh - 70} width={50} height={52} rx={6} fill={osc(c, 0.8)} /><rect x={x + ew * 0.6 + 6} y={piso - eh - 18} width={6} height={18} fill={osc(c, 0.8)} /><rect x={x + ew * 0.6 + 38} y={piso - eh - 18} width={6} height={18} fill={osc(c, 0.8)} /></g>}
        {Array.from({ length: filas }).map((_, fr) => Array.from({ length: cols }).map((_, cc) => {
          const on = random(`sw${seed}${i}${fr}${cc}`) > (dia ? 0.0 : 0.82);
          const tv = !dia && on && random(`tv${seed}${i}${fr}${cc}`) > 0.8; // titileo azul de una tele
          return <rect key={`${fr}${cc}`} x={x + 20 + cc * 50} y={piso - eh + 30 + fr * 60} width={28} height={36} fill={dia ? "#9aa3ae" : on ? (tv ? (Math.sin(f / 7 + cc) > 0 ? "#7fa0d8" : "#5a78b0") : "#5d7090") : "#14171d"} opacity={dia ? 0.6 : 1} />;
        }))}
      </g>,
    );
    x += ew + 6;
    i++;
  }
  return <g>{eds}</g>;
};
