// SET · EL MIRADOR (lc-b, Ep.3): Duluth vista desde la colina nevada, como la miniatura del Ep.3.
//   lejos: cielo de atardecer, sol sobre el lago a la derecha, el Aerial Lift Bridge recortado, chimeneas y tanque de agua
//   medio: 6 filas de ciudad apagada (de lejos a cerca, escaladas), la avenida que baja al centro con autos quietos,
//          postes torcidos con cables caídos, autos abandonados en las laderas y la cima nevada donde se paran los 10.
//   Encuadre de la miniatura = mira(0, 960, 540, 1). Piso de los 10 = MIR_PISO.
//   `luces` 0..1 = ventanas prendidas (casi todo apagado) · `apagar` 0..1 = la ciudad se oscurece (los 4 círculos de Ep.3)
//   `ghost` 0..1 = siluetas de trabajadores fantasma por las calles (cientos) · `nieve` en techos · `cae` nieve cayendo.
import React from "react";
import { random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Cielo, Colinas, Nube, SetProps, mezclar, osc } from "../../anikit/sets/comun";
import { Auto, COLORES_AUTO, Edificio, NieveCae } from "../mundo/comun";
import { PuenteLift } from "../mundo/puenteLift";

export const MIR_PISO = 985;
export const MIR_SOL = { x: 1310, y: 262 };

type P = SetProps & { luces?: number; apagar?: number; ghost?: number; nieve?: number; cae?: boolean; noche?: number };

// filas de ciudad: base (y), escala, color, rango x
const FILAS = [
  { y: 300, k: 0.32, c: "#2a2342", x0: -700, x1: 2700, hMin: 120, hMax: 420 },
  { y: 360, k: 0.42, c: "#2b2546", x0: -700, x1: 2700, hMin: 140, hMax: 460 },
  { y: 450, k: 0.55, c: "#2c2648", x0: -700, x1: 2700, hMin: 150, hMax: 480 },
  { y: 560, k: 0.7, c: "#2a2444", x0: -700, x1: 2700, hMin: 160, hMax: 440 },
  { y: 690, k: 0.86, c: "#28223f", x0: -700, x1: 2700, hMin: 150, hMax: 380 },
];
// la avenida baja desde (930, 300) hasta (690..1190, 985): no se construye encima
const avenida = (y: number) => { const t = (y - 300) / 685; return { a: 930 - 240 * t, b: 950 + 240 * t }; };

export const Fantasma: React.FC<{ x: number; y: number; s: number; f: number; seed: number }> = ({ x, y, s, f, seed }) => {
  const sw = Math.sin(f / 6 + seed) * 10;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={0.85}>
      <rect x={-7} y={-34} width={5} height={34} fill="#ffcf6e" transform={`rotate(${sw} -4 -34)`} />
      <rect x={2} y={-34} width={5} height={34} fill="#ffcf6e" transform={`rotate(${-sw} 4 -34)`} />
      <rect x={-10} y={-70} width={20} height={38} rx={5} fill="#ff8a2a" />
      <rect x={-10} y={-56} width={20} height={5} fill="#f6ecd2" />
      <circle cx={0} cy={-80} r={9} fill="#ffcf6e" />
      <path d="M-11,-82 Q0,-98 11,-82 Z" fill="#f2c230" />
    </g>
  );
};

export const Mirador: React.FC<P> = ({ capa, f, luces = 0.12, apagar = 0, ghost = 0, nieve = 0.8, cae = false, noche = 0 }) => {
  const cielo: [string, string, string] = [mezclar("#26214a", "#0c0a18", noche), mezclar("#6a3458", "#1d2440", noche), mezclar("#f2883a", "#3b2e42", noche)];
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={cielo} x={-2400} y={-900} w={7000} h={1300} />
        <Halo x={MIR_SOL.x} y={MIR_SOL.y} r={560} color="#ffb04a" fuerza={0.75 * (1 - noche)} />
        {[[-300, 60, 1.6], [300, 110, 1.2], [700, 40, 1.8], [1650, 90, 1.5], [2100, 150, 1.1], [1150, 150, 0.9]].map(([x, y, s], i) => (
          <g key={i}><Nube x={x + Math.sin(f / 300 + i) * 30} y={y} s={s} color={mezclar("#e8763a", "#3a2a50", 0.35 + (i % 3) * 0.15)} o={0.85} /><Nube x={x + 20} y={y + 14} s={s * 0.8} color="#ffb46a" o={0.35 * (1 - noche)} /></g>
        ))}
        <circle cx={MIR_SOL.x} cy={MIR_SOL.y} r={30} fill="#ffe2a0" opacity={1 - noche} />
        <Colinas y={268} alto={40} color="#3a2a4a" seed={21} x0={-2400} w={7000} />
        {/* lago a la derecha con el reflejo del sol */}
        <path d="M1040,262 L4600,262 L4600,520 L1100,520 Q1060,400 1040,262 Z" fill={mezclar("#c96a48", "#2a2240", noche)} />
        {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={MIR_SOL.x - 60 + (random(`ml${i}`) - 0.5) * 220 + Math.sin(f / 20 + i) * 6} y={272 + i * 9} width={40 + random(`mw${i}`) * 90} height={3} rx={2} fill="#ffd27a" opacity={0.7 * (1 - noche)} />)}
        <PuenteLift x={1110} y={340} W={330} H={250} color="#16111c" luces={0} detalle={0.7} nieve={0} />
        {/* chimeneas de la usina y el tanque de agua */}
        {[[850, 34, 300], [900, 30, 330], [945, 28, 290], [1225, 16, 160], [1260, 14, 150]].map(([x, w, h], i) => <g key={i}><rect x={x} y={340 - h} width={w} height={h} fill="#1a1422" /><rect x={x - 2} y={340 - h} width={w + 4} height={8} fill="#120e18" /></g>)}
        <g transform="translate(1520,300)"><rect x={-4} y={-40} width={8} height={70} fill="#1a1422" />{[-26, 26].map((d) => <path key={d} d={`M${d},30 L${d * 0.6},-50`} stroke="#1a1422" strokeWidth={4} />)}<rect x={-34} y={-96} width={68} height={52} rx={6} fill="#1a1422" /><path d="M-38,-96 L0,-122 L38,-96 Z" fill="#1a1422" /></g>
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {/* ramas secas que entran por los bordes */}
        <path d="M-120,520 Q20,560 60,650 M10,580 L90,560 M30,610 L-20,650" stroke="#120e16" strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d="M2050,480 Q1900,540 1880,640 M1950,520 L1860,500 M1910,580 L1960,640" stroke="#120e16" strokeWidth={10} fill="none" strokeLinecap="round" />
        {cae && <NieveCae f={f} n={120} x0={-600} w={3200} y0={-300} h={1500} o={0.7} />}
      </g>
    );
  }
  const vent = mezclar("#ffcf6e", "#3a3040", apagar);
  const edif: React.ReactNode[] = [];
  FILAS.forEach((r, ri) => {
    let x = r.x0, i = 0;
    while (x < r.x1) {
      const w = (90 + random(`mw${ri}${i}`) * 140) * r.k;
      const h = r.hMin + random(`mh${ri}${i}`) * (r.hMax - r.hMin);
      const av = avenida(r.y);
      if (x + w < av.a - 10 || x > av.b + 10) {
        const col = mezclar(osc(r.c, 1 - 0.06 * (i % 3)), "#0c0a14", apagar * 0.5);
        edif.push(
          <g key={`${ri}-${i}`} transform={`translate(${x},${r.y}) scale(${r.k})`}>
            <Edificio x={0} y={0} w={w / r.k} h={h} color={col} luces={luces * (1 - apagar)} seed={`mir${ri}${i}`} ventana={vent} techoNieve={nieve * (ri > 2 ? 1 : 0.6)} tanque={random(`mt${ri}${i}`) > 0.82} base={0.6} />
          </g>,
        );
      }
      x += w + (4 + random(`mg${ri}${i}`) * 18) * r.k;
      i++;
    }
    // calle transversal con nieve sucia delante de cada fila
    edif.push(<rect key={`c${ri}`} x={-700} y={r.y} width={3400} height={10 * r.k} fill={mezclar("#3a3448", "#c9bfd6", 0.25 * nieve)} />);
  });
  // avenida en perspectiva y autos quietos
  const autos = Array.from({ length: 16 }).map((_, i) => {
    const t = i / 15;
    const y = 320 + t * 640;
    const av = avenida(y);
    const s = 0.12 + t * 0.55;
    const x = av.a + (av.b - av.a) * (0.25 + 0.5 * random(`ma${i}`));
    return <Auto key={i} x={x} y={y} s={s} color={COLORES_AUTO[i % COLORES_AUTO.length]} dir={random(`md${i}`) > 0.5 ? 1 : -1} nieve={nieve} tipo={(["sedan", "suv", "pickup"] as const)[i % 3]} />;
  });
  // postes torcidos con cables caídos (laderas)
  const postes = [[140, 760, -12, 1], [380, 700, 8, 0.9], [1560, 720, -9, 0.9], [1800, 780, 14, 1], [610, 600, -6, 0.6], [1330, 610, 7, 0.6]].map(([x, y, a, s], i) => (
    <g key={i} transform={`translate(${x},${y}) rotate(${a}) scale(${s})`}>
      <rect x={-6} y={-320} width={12} height={330} fill="#1a1420" />
      <rect x={-50} y={-300} width={100} height={10} fill="#1a1420" />
      <rect x={-36} y={-270} width={72} height={8} fill="#1a1420" />
      <path d={`M-50,-300 Q${-160},${-150} ${-240},${-60}`} stroke="#120e16" strokeWidth={3} fill="none" />
      <path d={`M50,-300 Q${170},${-200} ${300},${-230}`} stroke="#120e16" strokeWidth={3} fill="none" />
    </g>
  ));
  // fantasmas: trabajadores en las calles de cada fila (sale `ghost` 0..1 → cuántos)
  const nG = Math.round(ghost * 240);
  const fantasmas = Array.from({ length: nG }).map((_, i) => {
    const ri = 2 + (i % 3);
    const r = FILAS[ri];
    const x = -300 + random(`gx${i}`) * 2500;
    return <Fantasma key={i} x={x + Math.sin(f / 40 + i) * 12} y={r.y + 4} s={r.k * 0.55} f={f} seed={i} />;
  });
  return (
    <g>
      {/* la bajada de la ladera hasta el lago: base oscura detrás de la ciudad */}
      <rect x={-700} y={300} width={3400} height={800} fill="#231d36" />
      {edif}
      <path d={`M930,300 L950,300 L1190,985 L690,985 Z`} fill={mezclar("#2a2436", "#cfc2d8", 0.18 * nieve)} />
      <path d={`M940,300 L940,985`} stroke="#ffcf6e" strokeWidth={3} strokeDasharray="20 30" opacity={0.35} />
      {autos}
      {fantasmas}
      {postes}
      {/* laderas con autos abandonados y nieve */}
      <path d="M-700,640 Q-200,600 200,700 Q520,780 700,900 L700,1100 L-700,1100 Z" fill="#2a2338" />
      <path d="M2700,620 Q2100,600 1700,700 Q1380,790 1200,900 L1200,1100 L2700,1100 Z" fill="#2a2338" />
      <path d="M-700,650 Q-200,612 200,710 Q420,770 560,840 L500,846 Q300,760 -700,700 Z" fill="#e9dff0" opacity={0.75 * nieve} />
      <path d="M2700,632 Q2100,612 1700,712 Q1500,770 1360,840 L1420,846 Q1700,750 2700,690 Z" fill="#e9dff0" opacity={0.75 * nieve} />
      {[[160, 790, 0.9, "#5a5a66", "suv", -1], [420, 840, 0.8, "#4a3a4a", "sedan", 1], [-120, 760, 0.9, "#3a4a5a", "pickup", 1], [1560, 810, 0.85, "#5a4a3a", "sedan", -1], [1780, 760, 0.9, "#3a3a4a", "suv", 1], [2050, 740, 0.9, "#6a5a5a", "pickup", -1]].map(([x, y, s, c, t, d], i) => (
        <g key={i} transform={`rotate(${i % 2 ? 6 : -5} ${x} ${y})`}><Auto x={x as number} y={y as number} s={s as number} color={c as string} tipo={t as any} dir={d as any} nieve={nieve} /></g>
      ))}
      {Array.from({ length: 10 }).map((_, i) => { const x = -600 + i * 330 + random(`mtr${i}`) * 80, y = i % 2 ? 690 : 720; return <path key={i} d={`M${x},${y} L${x},${y - 120} M${x},${y - 70} L${x - 40},${y - 120} M${x},${y - 90} L${x + 36},${y - 140} M${x - 20},${y - 100} L${x - 30},${y - 140}`} stroke="#1a1420" strokeWidth={6} strokeLinecap="round" fill="none" />; })}
      {/* la cima: piso de los 10 */}
      <path d="M-700,930 Q300,900 960,915 Q1600,900 2700,935 L2700,1500 L-700,1500 Z" fill="#3a3346" />
      <path d="M-700,930 Q300,900 960,915 Q1600,900 2700,935 L2700,962 Q1600,930 960,944 Q300,930 -700,960 Z" fill="#e9dff0" opacity={0.85 * nieve} />
      {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={-500 + i * 240 + random(`mn${i}`) * 80} cy={1010 + random(`mny${i}`) * 50} rx={70 + random(`mr${i}`) * 60} ry={12} fill="#d9cfe2" opacity={0.5 * nieve} />)}
    </g>
  );
};
