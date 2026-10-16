// La Casa de $2 — el MUNDO del documental (coordenadas de mundo, se dibuja dentro de la cámara).
// Casa en corte (sin pared de frente): altillo bajo el techo, piso 2 (dormitorio + baño), piso 1 (living + cocina),
// garaje-taller a la derecha, jardín a la izquierda, tierra con caños abajo. Paleta de la marca Constructor.
import React from "react";

export const WW = 4800, WH = 2800, GROUND = 2000;
export const C = {
  ink: "#2B2118", paper: "#FBF6EA", card: "#F6EEDC", accent: "#8E2F1F", gold: "#B08A3E", green: "#3E5B3A",
  wall: "#EADCC0", wallDark: "#CDB894", floor: "#A47C45", floorDark: "#7E5E33", slab: "#6E5B47", roof: "#8E2F1F", roofDark: "#6A2216",
};
// cuartos [x0, y0, x1, y1]
export const R = {
  attic: [1300, 700, 3300, 1100],
  bed: [1300, 1100, 2300, 1550],
  bath: [2300, 1100, 3300, 1550],
  living: [1300, 1550, 2300, 2000],
  kitchen: [2300, 1550, 3300, 2000],
  garage: [3300, 1440, 4150, 2000],
} as const;

const S = 4; // trazo de mundo
const line = { stroke: C.ink, strokeOpacity: 0.55, strokeWidth: S, strokeLinejoin: "round" as const };

const Window: React.FC<{ x: number; y: number; w: number; h: number; snow?: number; t?: number }> = ({ x, y, w, h, snow = 0, t = 0 }) => (
  <g>
    <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} fill="#fff" {...line} />
    <rect x={x} y={y} width={w} height={h} fill={snow > 0 ? "#c9d8e6" : "#bfe3f0"} />
    {snow > 0 && Array.from({ length: 26 }).map((_, i) => {
      const sx = x + ((i * 53) % w), sy = y + ((((i * 97) % h) + t * 60 * (0.6 + (i % 3) * 0.2)) % h);
      return <circle key={i} cx={sx} cy={sy} r={4 + (i % 3)} fill="#fff" opacity={snow} />;
    })}
    <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} {...line} strokeWidth={8} stroke="#fff" strokeOpacity={1} />
    <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} {...line} strokeWidth={8} stroke="#fff" strokeOpacity={1} />
    <rect x={x - 22} y={y + h + 8} width={w + 44} height={14} fill={C.wallDark} {...line} />
  </g>
);

const Room: React.FC<{ r: readonly number[]; fill: string; children?: React.ReactNode; pattern?: string }> = ({ r, fill, children, pattern }) => (
  <g>
    <rect x={r[0]} y={r[1]} width={r[2] - r[0]} height={r[3] - r[1]} fill={fill} />
    {pattern && <rect x={r[0]} y={r[1]} width={r[2] - r[0]} height={r[3] - r[1]} fill={`url(#${pattern})`} />}
    {/* sombra interior: la casa tiene profundidad */}
    <rect x={r[0]} y={r[1]} width={r[2] - r[0]} height={r[3] - r[1]} fill="url(#inshadow)" />
    {children}
  </g>
);

export const Sky: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-2000} y={-2000} width={WW + 4000} height={GROUND + 2000} fill="url(#sky)" />
    <circle cx={600} cy={420} r={150} fill="#fff4cf" opacity={0.95} />
    <circle cx={600} cy={420} r={260} fill="#fff4cf" opacity={0.25} />
    {[[900, 300, 1.1], [3200, 240, 1.4], [4300, 420, 0.9], [-300, 520, 1.2], [2100, 160, 0.8]].map(([x, y, s], i) => {
      const dx = ((x + t * 14 * (1 + i * 0.2)) % (WW + 1600)) - 600;
      return (
        <g key={i} transform={`translate(${dx},${y}) scale(${s})`} opacity={0.92}>
          <ellipse cx={0} cy={0} rx={150} ry={46} fill="#fff" />
          <ellipse cx={-70} cy={-20} rx={80} ry={52} fill="#fff" />
          <ellipse cx={60} cy={-34} rx={95} ry={62} fill="#fff" />
        </g>
      );
    })}
    {/* lomas al fondo */}
    <path d={`M -2000 ${GROUND} L -2000 1700 Q 300 1450 1400 1720 T 3600 1640 T 6800 1700 L 6800 ${GROUND} Z`} fill="#9fbf7c" />
    <path d={`M -2000 ${GROUND} L -2000 1820 Q 900 1660 2200 1840 T 6800 1800 L 6800 ${GROUND} Z`} fill="#86ab63" />
  </g>
);

export const Ground: React.FC = () => (
  <g>
    <rect x={-2000} y={GROUND} width={WW + 4000} height={1600} fill="url(#soil)" />
    {[2120, 2260, 2430, 2620].map((y, i) => (
      <path key={i} d={`M -2000 ${y} Q 1200 ${y + 30} 2400 ${y - 10} T 6800 ${y + 20}`} fill="none" stroke="#3d2b1c" strokeOpacity={0.18} strokeWidth={6} />
    ))}
    {Array.from({ length: 60 }).map((_, i) => (
      <ellipse key={i} cx={-1800 + ((i * 337) % 8400)} cy={GROUND + 80 + ((i * 191) % 700)} rx={16 + (i % 4) * 7} ry={10 + (i % 3) * 5} fill="#3d2b1c" opacity={0.22} />
    ))}
    {/* caños bajo tierra */}
    <path d={`M 2800 ${GROUND} L 2800 2220 L 4700 2220`} fill="none" stroke="#9aa4ab" strokeWidth={34} />
    <path d={`M 2800 ${GROUND} L 2800 2220 L 4700 2220`} fill="none" stroke="#c3ccd2" strokeWidth={14} />
    <path d={`M 1750 ${GROUND} L 1750 2380 L -1500 2380`} fill="none" stroke="#7d6a58" strokeWidth={40} />
    <rect x={-2000} y={GROUND - 14} width={WW + 4000} height={30} fill="#5f8f3f" />
  </g>
);

// Toda la casa (atrás de los personajes y de los problemas)
export const House: React.FC<{ t: number; snow: number }> = ({ t, snow }) => {
  const [ax0, , ax1, ay1] = R.attic;
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8ccbe2" /><stop offset="0.7" stopColor="#dff0ec" /><stop offset="1" stopColor="#f3efdc" /></linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a6a48" /><stop offset="1" stopColor="#4e3a29" /></linearGradient>
        <linearGradient id="inshadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.16" /><stop offset="0.25" stopColor="#000" stopOpacity="0" /><stop offset="0.85" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.1" /></linearGradient>
        <pattern id="planks" width="2000" height="56" patternUnits="userSpaceOnUse"><rect width="2000" height="56" fill="none" /><line x1="0" y1="55" x2="2000" y2="55" stroke="#7a5a33" strokeOpacity="0.22" strokeWidth="4" /></pattern>
        <pattern id="tiles" width="70" height="70" patternUnits="userSpaceOnUse"><rect width="70" height="70" fill="none" stroke="#9cc3c3" strokeWidth="4" /></pattern>
        <pattern id="brick" width="120" height="60" patternUnits="userSpaceOnUse"><rect width="120" height="60" fill="none" stroke="#b9a07a" strokeOpacity="0.5" strokeWidth="3" /><line x1="60" y1="30" x2="60" y2="60" stroke="#b9a07a" strokeOpacity="0.5" strokeWidth="3" /><line x1="0" y1="30" x2="120" y2="30" stroke="#b9a07a" strokeOpacity="0.5" strokeWidth="3" /></pattern>
        <pattern id="slats" width="40" height="44" patternUnits="userSpaceOnUse"><rect width="40" height="44" fill="#c9ccc6" /><line x1="0" y1="42" x2="40" y2="42" stroke="#8f948d" strokeWidth="5" /></pattern>
        <clipPath id="atticClip"><path d={`M ${ax0} ${ay1} L 2300 620 L ${ax1} ${ay1} Z`} /></clipPath>
      </defs>

      {/* altillo (triángulo bajo el techo) */}
      <g clipPath="url(#atticClip)">
        <Room r={R.attic} fill="#E4CFA6" pattern="planks">
          {[1500, 1800, 2100, 2500, 2800, 3100].map((x) => <line key={x} x1={x} y1={620} x2={x} y2={1100} stroke="#9a7442" strokeOpacity={0.35} strokeWidth={14} />)}
          {/* cajas y baúl */}
          <rect x={2550} y={980} width={170} height={120} fill="#c79a5b" {...line} />
          <rect x={2740} y={1020} width={120} height={80} fill="#b5864a" {...line} />
          <rect x={1480} y={1010} width={200} height={90} rx={10} fill="#8a5a33" {...line} />
        </Room>
      </g>
      {/* techo */}
      <path d={`M ${ax0 - 110} ${ay1 + 10} L 2300 540 L ${ax1 + 110} ${ay1 + 10} L ${ax1 + 60} ${ay1 + 50} L 2300 610 L ${ax0 - 60} ${ay1 + 50} Z`} fill={C.roof} {...line} />
      {/* tejas: filas paralelas a cada faldón */}
      {Array.from({ length: 8 }).map((_, i) => {
        const k = (i + 1) / 9;
        return (
          <g key={i} stroke={C.roofDark} strokeWidth={6} strokeOpacity={0.55}>
            <line x1={2300 - (2300 - ax0 + 110) * k} y1={540 + (ay1 + 10 - 540) * k} x2={2300 - (2300 - ax0 + 60) * k + 30} y2={610 + (ay1 + 50 - 610) * k} />
            <line x1={2300 + (ax1 + 110 - 2300) * k} y1={540 + (ay1 + 10 - 540) * k} x2={2300 + (ax1 + 60 - 2300) * k - 30} y2={610 + (ay1 + 50 - 610) * k} />
          </g>
        );
      })}
      <rect x={2860} y={600} width={120} height={260} fill="#a9533c" {...line} />
      <rect x={2840} y={590} width={160} height={36} fill="#7d3a28" {...line} />

      {/* piso 2: dormitorio */}
      <Room r={R.bed} fill="#DCE6E8">
        <Window x={1900} y={1210} w={230} h={190} />
        {/* cama */}
        <rect x={1450} y={1420} width={380} height={80} rx={14} fill="#f4f1ea" {...line} />
        <rect x={1450} y={1460} width={380} height={60} fill="#5f7fa3" {...line} />
        <rect x={1420} y={1360} width={40} height={180} rx={8} fill="#8a6a43" {...line} />
        <rect x={1475} y={1395} width={110} height={40} rx={18} fill="#fff" {...line} />
        <rect x={2150} y={1440} width={90} height={110} fill="#b08a5e" {...line} />
        <path d="M 2175 1440 L 2195 1380 L 2215 1440 Z" fill="#f2d27a" {...line} />
      </Room>
      {/* piso 2: baño */}
      <Room r={R.bath} fill="#E2F0EF" pattern="tiles">
        <rect x={2420} y={1420} width={420} height={110} rx={40} fill="#fff" {...line} />
        <path d="M 2480 1420 L 2480 1300 Q 2480 1270 2510 1270 L 2540 1270" fill="none" {...line} strokeWidth={10} stroke="#9aa4ab" strokeOpacity={1} />
        <rect x={3020} y={1420} width={120} height={110} rx={20} fill="#fff" {...line} />
        <rect x={3010} y={1330} width={140} height={90} rx={10} fill="#fff" {...line} />
        <rect x={2920} y={1190} width={150} height={120} rx={10} fill="#cfe5ea" {...line} />
      </Room>
      {/* piso 1: living */}
      <Room r={R.living} fill="#F1E2C8">
        <Window x={1420} y={1630} w={210} h={170} snow={snow} t={t} />
        {/* sillón */}
        <rect x={1780} y={1830} width={420} height={120} rx={22} fill="#7a8f5b" {...line} />
        <rect x={1760} y={1790} width={460} height={60} rx={22} fill="#8aa067" {...line} />
        <rect x={1960} y={1640} width={140} height={100} fill="#fff" {...line} />
        <rect x={1975} y={1655} width={110} height={70} fill="#9cbfd0" />
        <rect x={1340} y={1880} width={60} height={120} fill="#c8a36a" {...line} />
      </Room>
      {/* piso 1: cocina */}
      <Room r={R.kitchen} fill="#F3EAD6">
        <rect x={2560} y={1650} width={520} height={130} fill="url(#tiles)" opacity={0.8} />
        {/* mesada con pileta + bajo mesada abierto (se ve el caño) */}
        <rect x={2540} y={1780} width={560} height={30} fill="#d9d3c6" {...line} />
        <rect x={2550} y={1810} width={540} height={190} fill="#efe6d2" {...line} />
        <rect x={2700} y={1830} width={220} height={170} fill="#5b4a3a" opacity={0.85} />
        <path d="M 2780 1790 L 2780 1740 Q 2780 1715 2805 1715 L 2830 1715" fill="none" stroke="#9aa4ab" strokeWidth={12} />
        {/* heladera */}
        <rect x={3140} y={1640} width={140} height={360} rx={14} fill="#e7eef0" {...line} />
        <line x1={3140} y1={1770} x2={3280} y2={1770} {...line} />
        <rect x={2340} y={1700} width={160} height={120} fill="#c8a36a" {...line} />
      </Room>

      {/* losas y paredes (el corte) */}
      {[[1280, 1090, 2040, 30], [1280, 1540, 2040, 30], [1280, 1990, 2040, 20]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={C.slab} {...line} />
      ))}
      <rect x={1270} y={1090} width={40} height={910} fill={C.wallDark} {...line} />
      <rect x={3290} y={1090} width={40} height={910} fill={C.wallDark} {...line} />
      <rect x={2290} y={1100} width={20} height={300} fill={C.wallDark} opacity={0.9} />
      <rect x={2290} y={1560} width={20} height={250} fill={C.wallDark} opacity={0.9} />

      {/* garaje-taller */}
      <Room r={R.garage} fill="#E6DDCB" pattern="brick">
        {/* tablero de herramientas */}
        <rect x={3420} y={1560} width={360} height={200} fill="#a27a49" {...line} />
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={3440 + (i % 10) * 36} cy={1580 + Math.floor(i / 10) * 46} r={4} fill="#5b4126" />)}
        <path d="M 3470 1600 L 3470 1700 M 3455 1600 L 3485 1600" stroke="#6b7177" strokeWidth={12} />
        <path d="M 3550 1590 L 3550 1690" stroke="#c9a23f" strokeWidth={16} />
        <rect x={3620} y={1600} width={22} height={110} fill="#d9b53c" {...line} />
        <path d="M 3700 1600 L 3730 1700 L 3700 1700 Z" fill="#9aa4ab" {...line} />
        {/* estante con frascos */}
        <rect x={3820} y={1600} width={70} height={14} fill="#7e5e33" />
        {[3826, 3852].map((x) => <rect key={x} x={x} y={1560} width={22} height={40} rx={4} fill="#d8c27a" {...line} strokeWidth={3} />)}
      </Room>
      <path d={`M 3290 1440 L 4220 1500 L 4220 1530 L 3290 1470 Z`} fill={C.roof} {...line} />
      <rect x={4130} y={1500} width={36} height={500} fill={C.wallDark} {...line} />
      {/* portón del garaje (persiana) */}
      <rect x={3930} y={1530} width={200} height={470} fill="url(#slats)" {...line} />
    </g>
  );
};

// Lo que va ADELANTE de los personajes: mesa de trabajo del taller y cerco del jardín
export const Front: React.FC = () => (
  <g>
    {/* banco de trabajo (tapa la cintura de Claudio en el taller) */}
    <rect x={3360} y={1830} width={600} height={40} rx={6} fill="#b5864a" {...line} />
    <rect x={3380} y={1870} width={30} height={130} fill="#8a6a43" {...line} />
    <rect x={3910} y={1870} width={30} height={130} fill="#8a6a43" {...line} />
    <rect x={3420} y={1930} width={480} height={18} fill="#8a6a43" />
    {/* jardín: árbol, cantero, postes */}
    <rect x={380} y={1560} width={70} height={440} fill="#7a5532" {...line} />
    <circle cx={330} cy={1500} r={170} fill="#5d8a46" /><circle cx={500} cy={1460} r={150} fill="#6b9a52" /><circle cx={420} cy={1360} r={150} fill="#77a65c" />
    <rect x={-200} y={1900} width={300} height={100} rx={12} fill="#9a6a43" {...line} />
    {[-160, -90, -20, 50].map((x) => <path key={x} d={`M ${x} 1900 q 10 -70 20 0`} fill="#4f8a3a" />)}
    {/* cerco de madera (tapa la cintura de Claudio en el jardín) */}
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d={`M ${560 + i * 62} 2000 L ${560 + i * 62} 1868 L ${588 + i * 62} 1842 L ${616 + i * 62} 1868 L ${616 + i * 62} 2000 Z`} fill="#d9b98a" {...line} />
    ))}
    <rect x={540} y={1890} width={780} height={22} fill="#c9a575" {...line} />
    <rect x={540} y={1950} width={780} height={22} fill="#c9a575" {...line} />
  </g>
);
