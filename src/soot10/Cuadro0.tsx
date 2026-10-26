import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { S } from "./obj";

// CUADRO 0 = la miniatura elegida (D:/rtmp/soot_ola/minis/soot10_elegida.png) sin texto ni flecha, rehecha en código con su
// nivel de detalle: anatomía con volumen, madera con veta, luz cálida del fuego contra el azul frío de la tormenta, chispas,
// espuma y salpicaduras. Coordenadas de la miniatura (1672x941). A los 0 s está quieta e idéntica; después cobra vida (lluvia,
// balas que vuelan, el grumete fregando y llorando, el capitán sacudiendo el dedo) y la bala grande viene a cámara: tapa todo
// y abre al mundo del gancho.
const W = 1672, H = 941;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (s0: number) => {
  // semillas seguidas dan valores casi en línea con un LCG: se mezcla la semilla y se descartan los primeros
  let s = Math.floor(Math.abs(Math.sin(s0 * 12.9898 + 78.233) * 43758.5453) * 2147483646) % 2147483646 + 1;
  const f = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  f(); f(); f();
  return f;
};
const PIEL = "url(#c0piel)", TINTA = "#2a160c";

// ---------- piezas sueltas ----------
const Fuego: React.FC<{ x: number; y: number; r: number; t: number; rot?: number; k?: number }> = ({ x, y, r, t, rot = 0, k = 0 }) => {
  const q = rnd(k + 7);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r * 1.6} fill="url(#c0brillo)" opacity={0.85} />
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + q() * 0.4, l = r * (0.9 + q() * 0.9) * (1 + 0.15 * Math.sin(t * 25 + i));
        return <path key={i} d={`M ${Math.cos(a + 0.18) * r * 0.3} ${Math.sin(a + 0.18) * r * 0.3} L ${Math.cos(a) * l} ${Math.sin(a) * l} L ${Math.cos(a - 0.18) * r * 0.3} ${Math.sin(a - 0.18) * r * 0.3} Z`} fill={i % 2 ? "#ffd04a" : "#ff8a2a"} />;
      })}
      <circle r={r * 0.45} fill="#fff6c8" />
    </g>
  );
};

// bala con estela de fuego (dir = hacia dónde va la estela: 1 derecha, -1 izquierda)
const Bala: React.FC<{ x: number; y: number; r: number; t: number; dir?: number; fuego?: number; k?: number }> = ({ x, y, r, t, dir = 1, fuego = 1, k = 0 }) => {
  const q = rnd(k + 31);
  return (
    <g transform={`translate(${x} ${y})`}>
      <g opacity={fuego}>
        <path d={`M ${dir * r * 0.2} ${-r * 0.75} Q ${dir * r * 2.4} ${-r * 0.5} ${dir * r * (3.8 + Math.sin(t * 30 + k) * 0.3)} 0 Q ${dir * r * 2.4} ${r * 0.5} ${dir * r * 0.2} ${r * 0.75} Z`} fill={dir > 0 ? "url(#c0estela)" : "url(#c0estelaI)"} opacity={0.9} />
        <path d={`M ${dir * r * 0.3} ${-r * 0.35} Q ${dir * r * 1.6} ${-r * 0.2} ${dir * r * 2.6} 0 Q ${dir * r * 1.6} ${r * 0.2} ${dir * r * 0.3} ${r * 0.35} Z`} fill="#fff4c0" />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={dir * (r * 0.8 + q() * r * 3.2)} cy={(q() - 0.5) * r * 1.8} r={1.5 + q() * 3.5} fill={q() > 0.5 ? "#ffd04a" : "#ff7a2a"} />)}
      </g>
      <circle r={r} fill="url(#c0bala)" />
      <circle r={r} fill="none" stroke="#0a090e" strokeWidth={Math.max(2, r * 0.05)} />
      <path d={`M ${dir * r * 0.95} ${-r * 0.2} A ${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${dir * r * 0.3} ${r * 0.95}`} stroke="#ff9a3a" strokeWidth={r * 0.1} fill="none" opacity={0.75} />
      {Array.from({ length: 9 }, (_, i) => <circle key={`o${i}`} cx={(q() - 0.5) * r * 1.3} cy={(q() - 0.3) * r * 1.2} r={r * (0.03 + q() * 0.05)} fill="#8a4a24" opacity={0.7} />)}
      <ellipse cx={-r * 0.35} cy={-r * 0.42} rx={r * 0.3} ry={r * 0.15} fill="#cfd4e8" opacity={0.55} transform={`rotate(-35 ${-r * 0.35} ${-r * 0.42})`} />
    </g>
  );
};

const Barril: React.FC<{ x: number; y: number; w: number; h: number; mojado?: boolean }> = ({ x, y, w, h, mojado }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M ${-w / 2} 0 Q ${-w * 0.62} ${h / 2} ${-w / 2} ${h} L ${w / 2} ${h} Q ${w * 0.62} ${h / 2} ${w / 2} 0 Z`} fill="url(#c0madera)" />
    {[-0.36, -0.2, -0.05, 0.1, 0.25, 0.38].map((k, i) => <path key={k} d={`M ${k * w} 4 Q ${k * w * 1.18} ${h / 2} ${k * w} ${h}`} stroke={i % 2 ? "#4a220e" : "#5a2c12"} strokeWidth={3} fill="none" />)}
    {[-0.3, 0.05, 0.3].map((k) => <path key={`v${k}`} d={`M ${k * w + 8} ${h * 0.3} q 6 30 -2 60 M ${k * w + 14} ${h * 0.55} q 5 20 -3 40`} stroke="#3a1a08" strokeWidth={2} fill="none" opacity={0.6} />)}
    {[0.14, 0.5, 0.86].map((k) => (
      <g key={k}>
        <path d={`M ${-w * 0.6} ${h * k - 10} Q 0 ${h * k + 4} ${w * 0.6} ${h * k - 10} L ${w * 0.6} ${h * k + 10} Q 0 ${h * k + 24} ${-w * 0.6} ${h * k + 10} Z`} fill="#2e2a2c" />
        <path d={`M ${-w * 0.55} ${h * k - 6} Q 0 ${h * k + 8} ${w * 0.55} ${h * k - 6}`} stroke="#ffb060" strokeWidth={3} fill="none" opacity={0.6} />
        {[-0.4, 0, 0.4].map((n) => <circle key={n} cx={n * w} cy={h * k + 7 + (1 - Math.abs(n)) * 7} r={3.5} fill="#6a6466" />)}
      </g>
    ))}
    <ellipse cx={0} cy={0} rx={w / 2} ry={w * 0.13} fill="#9a5a28" stroke="#3a1a08" strokeWidth={5} />
    <ellipse cx={0} cy={0} rx={w * 0.4} ry={w * 0.09} fill="none" stroke="#6a3414" strokeWidth={3} />
    <path d={`M ${w * 0.3} ${h * 0.08} Q ${w * 0.5} ${h * 0.5} ${w * 0.32} ${h * 0.92}`} stroke="#ffb870" strokeWidth={10} fill="none" opacity={0.45} strokeLinecap="round" />
    {mojado && Array.from({ length: 6 }, (_, i) => <path key={`m${i}`} d={`M ${-w * 0.3 + i * w * 0.12} ${-4} q 4 ${30 + i * 9} 0 ${50 + i * 12}`} stroke="#d8f6ff" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8} />)}
  </g>
);

// rollo de soga trenzada
const Soga: React.FC<{ x: number; y: number; rx: number; ry: number; n?: number; g?: number }> = ({ x, y, rx, ry, n = 3, g = 26 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const cy = y - i * g * 0.75, rr = rx - i * 8;
      return (
        <g key={i}>
          <ellipse cx={x} cy={cy} rx={rr} ry={ry} fill="none" stroke="#6a4420" strokeWidth={g} />
          <ellipse cx={x} cy={cy} rx={rr} ry={ry} fill="none" stroke="#c8944e" strokeWidth={g * 0.8} />
          <ellipse cx={x} cy={cy} rx={rr} ry={ry} fill="none" stroke="#7a4e22" strokeWidth={g * 0.8} strokeDasharray={`${g * 0.35} ${g * 0.45}`} />
          <ellipse cx={x} cy={cy - g * 0.2} rx={rr} ry={ry} fill="none" stroke="#f0c888" strokeWidth={g * 0.15} strokeDasharray={`${g * 0.25} ${g * 0.55}`} opacity={0.8} />
        </g>
      );
    })}
  </g>
);

const BarcoNegro: React.FC<{ x: number; y: number; s: number; t: number; op?: number; k?: number }> = ({ x, y, s, t, op = 1, k = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(t * 1.4 + k) * 6}) scale(${s}) rotate(${Math.sin(t * 1.1 + k) * 2})`} opacity={op}>
    <path d="M -170 110 L 170 100 Q 160 150 120 190 L -120 190 Q -160 150 -170 110 Z" fill="#2a2430" />
    <path d="M -165 118 L 168 108" stroke="#5a4a50" strokeWidth={6} />
    {[-110, -60, -10, 40, 90].map((cx) => <rect key={cx} x={cx} y={130} width={18} height={14} fill={k % 2 ? "#ffb04a" : "#1a161e"} />)}
    <rect x={-5} y={-200} width={10} height={320} fill="#1e1820" />
    <rect x={-105} y={-110} width={7} height={230} fill="#1e1820" />
    <rect x={95} y={-90} width={7} height={210} fill="#1e1820" />
    <path d="M -2 -185 Q 80 -150 95 -60 L 100 70 Q 40 55 -2 75 Z" fill="#1b2232" stroke="#0e121c" strokeWidth={4} />
    <path d="M -100 -100 Q -50 -80 -30 -20 L -25 95 Q -65 85 -102 95 Z" fill="#1b2232" />
    <path d="M 98 -80 Q 140 -60 150 0 L 150 80 Q 125 75 100 85 Z" fill="#1b2232" />
    <g transform="translate(48 -40)"><path d="M -22 0 Q -22 -26 0 -26 Q 22 -26 22 0 Q 22 14 12 18 L 12 26 L -12 26 L -12 18 Q -22 14 -22 0 Z" fill="#e8e2f0" /><path d="M -34 34 L 34 66 M 34 34 L -34 66" stroke="#e8e2f0" strokeWidth={10} strokeLinecap="round" /><circle cx={-8} cy={-2} r={6} fill="#1b2232" /><circle cx={8} cy={-2} r={6} fill="#1b2232" /></g>
  </g>
);

// ---------- personajes ----------
const Mano: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  // mano apoyada sobre el cepillo: dorso + 4 dedos con nudillos
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -44 -20 Q -40 -42 -6 -44 Q 34 -44 46 -18 L 50 10 Q 20 22 -40 12 Z" fill={PIEL} stroke={TINTA} strokeWidth={3} />
    {[-34, -14, 6, 26].map((dx, i) => <path key={i} d={`M ${dx} 2 Q ${dx + 2} 22 ${dx + 9} 24 Q ${dx + 17} 22 ${dx + 17} 4`} fill={PIEL} stroke={TINTA} strokeWidth={3} />)}
    <path d="M -20 -26 q 6 -4 12 0 M 4 -28 q 6 -4 12 0" stroke="#c97a58" strokeWidth={3} fill="none" />
    <path d="M 46 -16 Q 66 -10 62 6 Q 56 14 46 8" fill={PIEL} stroke={TINTA} strokeWidth={3} />
  </g>
);

const Grumete: React.FC<{ t: number }> = ({ t }) => {
  const fr = Math.sin(t * 12) * 16 * interpolate(t, [0, 0.15], [0, 1], cl); // friega
  const parp = (t % 2.7) > 2.6 ? 0.1 : 1;
  const lag = (t * 1.2) % 1;
  const resp = Math.sin(t * 5) * 3;
  return (
    <g>
      {/* pierna trasera: rodilla en el piso, pantorrilla y pie descalzo atrás */}
      <path d="M 1080 640 Q 1150 640 1185 700 L 1240 735 Q 1290 740 1312 762 Q 1322 785 1290 790 L 1235 784 Q 1170 772 1120 760 Z" fill={PIEL} stroke={TINTA} strokeWidth={4} />
      {[1262, 1278, 1292, 1304].map((x, i) => <ellipse key={x} cx={x + 6} cy={782 - i * 3} rx={7} ry={6} fill={PIEL} stroke={TINTA} strokeWidth={2.5} />)}
      <path d="M 1248 742 q 22 6 40 26" stroke="#c97a58" strokeWidth={3} fill="none" />
      {[[1150, 735], [1200, 752], [1235, 765]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={12} ry={6} fill="#b4583a" opacity={0.5} />)}
      {/* short oscuro rasgado */}
      <path d="M 1000 600 Q 1080 560 1150 600 Q 1190 640 1186 700 L 1170 712 L 1150 692 L 1132 720 L 1110 700 L 1090 728 L 1070 706 L 1050 740 L 1030 712 L 1004 742 Q 985 680 1000 600 Z" fill="url(#c0short)" stroke={TINTA} strokeWidth={4} />
      <path d="M 1040 640 q 30 -10 60 4 M 1060 690 q 20 -6 40 2" stroke="#4a4652" strokeWidth={3} fill="none" />
      {/* rodilla delantera apoyada */}
      <path d="M 1004 742 Q 1000 790 1020 812 Q 1060 826 1090 808 Q 1090 770 1070 740 Z" fill={PIEL} stroke={TINTA} strokeWidth={4} />
      <ellipse cx={1050} cy={792} rx={16} ry={10} fill="#c45a3c" opacity={0.55} />
      {/* torso: camisa de lino sucia y rota, faja roja */}
      <path d={`M 760 640 Q 800 ${570 + resp} 900 ${552 + resp} Q 1000 540 1070 560 Q 1100 600 1090 670 Q 1060 720 990 728 Q 900 736 840 720 Q 780 704 760 640 Z`} fill="url(#c0lino)" stroke={TINTA} strokeWidth={4} />
      <path d="M 840 720 L 852 740 L 870 722 L 888 746 L 905 724 L 924 740 L 940 726" stroke={TINTA} strokeWidth={3} fill="#efe2c6" />
      {[[870, 610, 9], [925, 650, 7], [990, 600, 8], [1020, 680, 6], [820, 660, 6], [960, 700, 5], [1045, 620, 5]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r * 1.5} ry={r} fill="#a8865a" opacity={0.45} />)}
      <path d="M 880 580 q 40 30 30 80 M 980 570 q 20 40 0 100" stroke="#c8b08a" strokeWidth={4} fill="none" />
      <path d={`M 1050 ${560 + resp} Q 1100 570 1112 620 Q 1112 680 1094 712 Q 1075 718 1062 700 Q 1078 640 1050 ${560 + resp} Z`} fill="url(#c0faja)" stroke={TINTA} strokeWidth={4} />
      <path d="M 1072 590 q 18 40 6 100" stroke="#ff7a7a" strokeWidth={4} fill="none" opacity={0.6} />
      {/* brazo trasero (derecho del chico): manga arremangada, antebrazo con volumen */}
      <path d="M 930 660 Q 980 690 990 740 L 945 760 Q 925 720 900 700 Z" fill="url(#c0lino)" stroke={TINTA} strokeWidth={4} />
      <path d={`M 948 752 Q 960 780 ${880 + fr} 812 L ${846 + fr} 806 Q 900 776 912 748 Z`} fill={PIEL} stroke={TINTA} strokeWidth={4} />
      <ellipse cx={930} cy={772} rx={12} ry={6} fill="#c45a3c" opacity={0.5} />
      {/* cepillo con veta y cerdas */}
      <g transform={`translate(${fr} 0)`}>
        <path d="M 652 828 L 930 812 L 942 846 L 640 864 Z" fill="url(#c0maderaC)" stroke={TINTA} strokeWidth={4} />
        <path d="M 668 836 Q 790 826 920 822 M 676 848 Q 800 838 928 832" stroke="#5a2c12" strokeWidth={2} fill="none" />
        <path d="M 660 830 L 928 815" stroke="#ffc888" strokeWidth={3} opacity={0.7} />
        {Array.from({ length: 44 }, (_, i) => <line key={i} x1={644 + i * 6.8} y1={862 - i * 0.45} x2={636 + i * 7.1 + Math.sin(t * 20 + i) * 3} y2={905 - i * 0.2} stroke={i % 3 ? "#d8a868" : "#b88444"} strokeWidth={4} />)}
        <Mano x={735} y={808} s={1.1} rot={-6} />
        <Mano x={862} y={800} s={1.05} rot={-8} />
      </g>
      {/* brazo delantero (izquierdo del chico) */}
      <path d="M 772 640 Q 742 680 744 722 L 806 728 Q 806 690 820 662 Z" fill="url(#c0lino)" stroke={TINTA} strokeWidth={4} />
      <path d={`M 750 720 Q 738 760 ${738 + fr} 790 L ${790 + fr} 792 Q 798 760 804 724 Z`} fill={PIEL} stroke={TINTA} strokeWidth={4} />
      <ellipse cx={772} cy={750} rx={11} ry={7} fill="#c45a3c" opacity={0.5} />
      {/* espuma y salpicones contra la madera */}
      {Array.from({ length: 70 }, (_, i) => { const r = rnd(i + 5); const a = 0.2 + r() * 2.6, d = 10 + ((r() * 120 + t * 220) % 150); const x0 = 600 + r() * 60; return <ellipse key={i} cx={x0 - Math.cos(a) * d} cy={880 - Math.sin(a) * d * 0.7} rx={2 + r() * 7} ry={1.5 + r() * 5} fill="#f4fbff" opacity={Math.max(0, 0.95 - d / 190)} />; })}
      {Array.from({ length: 22 }, (_, i) => { const r = rnd(i + 222); return <path key={`sp${i}`} d={`M ${540 + r() * 130} ${890 - r() * 20} q ${-10 - r() * 20} ${-30 - r() * 50} ${-r() * 30} ${-60 - r() * 60}`} stroke="#eaf8ff" strokeWidth={3 + r() * 4} strokeLinecap="round" fill="none" opacity={0.7} />; })}
      <ellipse cx={790} cy={905} rx={200} ry={14} fill="#bfe8ff" opacity={0.3} />
      {/* cabeza */}
      <g transform={`translate(850 520) rotate(${Math.sin(t * 6) * 1.2})`}>
        <path d="M 60 110 Q 30 150 -10 150 L 10 120 Z" fill={PIEL} />
        {/* pelo castaño que asoma */}
        <path d="M -130 -40 Q -160 10 -138 70 Q -128 40 -120 60 Q -122 20 -108 30 Z" fill="url(#c0pelo)" stroke={TINTA} strokeWidth={3} />
        <path d="M 120 -30 Q 150 0 134 50 Q 124 20 110 30 Z" fill="url(#c0pelo)" stroke={TINTA} strokeWidth={3} />
        <ellipse cx={0} cy={18} rx={128} ry={122} fill={PIEL} stroke={TINTA} strokeWidth={5} />
        {/* oreja */}
        <path d="M -126 30 Q -160 20 -158 60 Q -150 92 -118 84" fill={PIEL} stroke={TINTA} strokeWidth={4} />
        <path d="M -138 46 q -6 14 4 26" stroke="#c97a58" strokeWidth={3} fill="none" />
        {/* pañuelo rojo con pliegues, nudo y puntas */}
        <path d="M -138 -6 Q -140 -132 4 -142 Q 128 -138 136 -20 Q 120 -50 70 -62 Q 0 -74 -70 -54 Q -118 -40 -138 -6 Z" fill="url(#c0panuelo)" stroke={TINTA} strokeWidth={5} />
        <path d="M -100 -60 Q -40 -110 40 -112 M -60 -38 Q 0 -80 90 -78 M -118 -24 Q -60 -60 0 -62" stroke="#8a1420" strokeWidth={4} fill="none" opacity={0.7} />
        <path d="M -70 -120 Q -20 -134 40 -128" stroke="#ff8a7a" strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />
        <g transform="translate(140 -30)">
          <ellipse rx={24} ry={20} fill="#b81c2c" stroke={TINTA} strokeWidth={4} />
          <path d={`M 10 4 Q 50 0 ${74 + Math.sin(t * 14) * 6} 18 Q 50 28 18 18 Z`} fill="#c92436" stroke={TINTA} strokeWidth={4} />
          <path d={`M 8 14 Q 30 40 ${44 + Math.sin(t * 12) * 5} 64 Q 22 54 2 24 Z`} fill="#a81828" stroke={TINTA} strokeWidth={4} />
        </g>
        {/* cejas de miedo */}
        <path d="M -92 -32 Q -60 -52 -24 -40" stroke="#7a4420" strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M 22 -46 Q 58 -60 92 -38" stroke="#7a4420" strokeWidth={9} fill="none" strokeLinecap="round" />
        {/* ojos enormes mirando arriba a la bala */}
        {[[-48, 0, 46, 54], [52, -6, 44, 52]].map(([x, y, rx, ry], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(1 ${parp})`}>
            <ellipse rx={rx} ry={ry} fill="#fffdf6" stroke={TINTA} strokeWidth={5} />
            <circle cx={-10} cy={-14} r={27} fill="#3a2214" />
            <circle cx={-10} cy={-14} r={18} fill="#0e0a0c" />
            <circle cx={-20} cy={-26} r={9} fill="#fff" />
            <circle cx={-2} cy={-4} r={4} fill="#fff" />
            <path d={`M ${-rx + 6} ${ry * 0.55} Q 0 ${ry + 10} ${rx - 6} ${ry * 0.55}`} stroke="#9ce4ff" strokeWidth={6} fill="none" opacity={0.85} />
          </g>
        ))}
        {/* nariz */}
        <path d="M 8 50 Q 0 66 14 70" stroke="#b8664a" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* boca abierta llorando, dientes y lengua */}
        <path d="M -30 96 Q 10 64 58 90 Q 54 136 16 140 Q -22 138 -30 96 Z" fill="#6a1018" stroke={TINTA} strokeWidth={5} />
        <path d="M -18 90 Q 12 74 46 88 L 44 98 Q 12 86 -16 100 Z" fill="#fff" />
        <path d="M -8 128 Q 14 112 38 126 Q 22 138 12 138 Q -2 136 -8 128 Z" fill="#e8607a" />
        {/* lágrimas: chorro y gotas */}
        <path d={`M 74 40 Q 92 ${70 + lag * 20} 80 ${108 + lag * 30}`} stroke="#7ad8ff" strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.95} />
        <path d="M 74 44 Q 86 70 80 96" stroke="#e8fbff" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M 80 ${118 + lag * 50} q -10 14 0 22 q 10 -8 0 -22 Z`} fill="#7ad8ff" stroke="#3aa8d8" strokeWidth={2} opacity={1 - lag} />
        <path d="M -82 50 Q -94 74 -86 96" stroke="#7ad8ff" strokeWidth={11} fill="none" strokeLinecap="round" opacity={0.85} />
        {/* mejillas sucias y coloradas */}
        <ellipse cx={-92} cy={76} rx={24} ry={12} fill="#ff7a6a" opacity={0.45} />
        <ellipse cx={104} cy={70} rx={20} ry={11} fill="#ff7a6a" opacity={0.45} />
        {[[-70, 104, 6], [-100, 96, 4], [96, 104, 5], [40, 40, 3]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#8a5a3a" opacity={0.5} />)}
        {/* luz de borde: fuego a la derecha, tormenta a la izquierda */}
        <path d="M 108 -10 Q 132 40 112 100" stroke="#ffb45a" strokeWidth={8} fill="none" opacity={0.7} strokeLinecap="round" />
        <path d="M -124 10 Q -132 60 -110 104" stroke="#8ad8ff" strokeWidth={6} fill="none" opacity={0.55} strokeLinecap="round" />
      </g>
    </g>
  );
};

const Capitan: React.FC<{ t: number }> = ({ t }) => {
  const sac = Math.sin(t * 9) * 7 * interpolate(t, [0, 0.2], [0, 1], cl);
  const grito = 1 + 0.08 * Math.sin(t * 7);
  return (
    <g>
      {/* piernas, calzas oscuras y botas */}
      <path d="M 1300 450 L 1290 620 L 1360 622 L 1380 470 Z" fill="url(#c0short)" stroke={TINTA} strokeWidth={4} />
      <path d="M 1440 450 L 1480 600 L 1540 590 L 1510 450 Z" fill="url(#c0short)" stroke={TINTA} strokeWidth={4} />
      <path d="M 1284 600 L 1372 600 L 1378 640 Q 1372 690 1290 684 Q 1270 680 1280 640 Z" fill="#141016" stroke="#000" strokeWidth={4} />
      <path d="M 1270 596 L 1384 592 L 1386 618 L 1268 622 Z" fill="#26202a" stroke="#000" strokeWidth={3} />
      <path d="M 1300 640 Q 1330 650 1360 640" stroke="#ff9a4a" strokeWidth={5} fill="none" opacity={0.6} />
      <path d="M 1472 584 L 1548 576 L 1556 640 L 1484 650 Z" fill="#141016" stroke="#000" strokeWidth={4} />
      {/* casaca roja con faldones */}
      <path d="M 1180 250 Q 1300 210 1480 230 Q 1600 260 1672 330 L 1672 520 Q 1600 530 1560 500 L 1540 560 Q 1460 540 1440 470 L 1360 470 Q 1320 540 1270 520 Q 1250 420 1220 360 Z" fill="url(#c0casaca)" stroke={TINTA} strokeWidth={5} />
      <path d="M 1400 470 L 1370 560 Q 1330 570 1300 540" fill="#8a1420" stroke={TINTA} strokeWidth={4} />
      <path d="M 1500 470 L 1540 560 Q 1580 560 1600 520" fill="#8a1420" stroke={TINTA} strokeWidth={4} />
      {/* solapas negras con galón dorado */}
      <path d="M 1330 240 L 1360 390 L 1330 470 L 1290 380 Z" fill="#1a1418" stroke="#d8a838" strokeWidth={6} />
      <path d="M 1480 236 L 1470 390 L 1500 470 L 1540 380 Z" fill="#1a1418" stroke="#d8a838" strokeWidth={6} />
      {/* camisa con volados */}
      <path d="M 1360 250 L 1470 246 L 1468 400 L 1362 404 Z" fill="url(#c0lino)" stroke={TINTA} strokeWidth={4} />
      {[270, 300, 330, 360].map((y) => <path key={y} d={`M 1392 ${y} q 12 10 24 0 q 12 10 24 0`} stroke="#c8b08a" strokeWidth={3} fill="none" />)}
      {[1390, 1440].map((x) => <path key={x} d={`M ${x} 260 l 0 130`} stroke="#d8c8a8" strokeWidth={2} />)}
      {/* botones dorados */}
      {[290, 330, 370, 410].map((y) => [1305, 1530].map((x) => { const bx = x + (y - 290) * (x < 1400 ? 0.1 : -0.1); return <g key={`${x}${y}`}><circle cx={bx} cy={y} r={11} fill="url(#c0oro)" stroke="#6a4a10" strokeWidth={2} /><circle cx={bx - 3} cy={y - 3} r={3} fill="#fff6c0" /></g>; }))}
      {/* cinturón y hebilla */}
      <path d="M 1290 404 Q 1420 396 1560 410 L 1556 452 Q 1420 440 1294 446 Z" fill="#3a2214" stroke={TINTA} strokeWidth={4} />
      <path d="M 1300 418 Q 1420 410 1550 422" stroke="#6a4024" strokeWidth={3} fill="none" />
      <rect x={1396} y={394} width={76} height={62} rx={8} fill="none" stroke="url(#c0oro)" strokeWidth={13} />
      <rect x={1396} y={394} width={76} height={62} rx={8} fill="none" stroke="#6a4a10" strokeWidth={2} />
      <rect x={1430} y={418} width={30} height={10} fill="url(#c0oro)" />
      {/* brazo derecho colgando */}
      <path d="M 1600 280 Q 1660 300 1672 380 L 1672 440 Q 1640 420 1620 380 Z" fill="url(#c0casaca)" stroke={TINTA} strokeWidth={4} />
      <path d="M 1640 400 L 1672 396 L 1672 440 L 1648 444 Z" fill="#1a1418" stroke="#d8a838" strokeWidth={4} />
      {/* brazo que señala: manga, puño negro con galón, mano con índice */}
      <g transform={`rotate(${sac * 0.3} 1230 290)`}>
        <path d="M 1270 250 Q 1200 262 1140 268 L 1136 322 Q 1210 320 1280 330 Z" fill="url(#c0casaca)" stroke={TINTA} strokeWidth={5} />
        <path d="M 1200 262 q -10 30 6 58" stroke="#7a1018" strokeWidth={4} fill="none" />
        <path d="M 1094 258 L 1150 256 L 1156 330 L 1100 334 Z" fill="#1a1418" stroke="#d8a838" strokeWidth={6} />
        <g transform={`translate(1094 294) rotate(${sac * 0.2})`}>
          <path d="M 4 -30 Q -30 -34 -46 -18 L -92 -16 Q -104 -10 -92 -2 L -44 -2 Q -48 12 -40 22 Q -10 40 8 28 Z" fill={PIEL} stroke={TINTA} strokeWidth={4} />
          {[4, 16, 27].map((dy) => <path key={dy} d={`M -40 ${dy - 6} Q -50 ${dy} -40 ${dy + 6}`} stroke={TINTA} strokeWidth={3} fill="none" />)}
          <path d="M -70 -14 l 0 8" stroke="#c97a58" strokeWidth={3} />
          <path d="M -30 -26 Q -36 -40 -22 -40 Q -10 -38 -14 -26" fill={PIEL} stroke={TINTA} strokeWidth={3} />
        </g>
      </g>
      {/* cabeza */}
      <g transform={`translate(1320 210) rotate(${sac * 0.12})`}>
        <path d="M -110 -60 Q -150 40 -120 130 L -90 60 Z M 100 -60 Q 150 40 120 120 L 90 60 Z" fill="url(#c0pelo)" stroke={TINTA} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={96} ry={104} fill={PIEL} stroke={TINTA} strokeWidth={5} />
        <path d="M 92 -6 Q 126 -14 124 22 Q 118 50 92 44" fill={PIEL} stroke={TINTA} strokeWidth={4} />
        <circle cx={118} cy={52} r={16} fill="none" stroke="url(#c0oro)" strokeWidth={7} />
        {/* barba tupida con mechones */}
        <path d="M -104 -10 Q -120 110 -50 170 Q 0 196 56 172 Q 122 120 104 -14 Q 80 40 40 42 Q 0 30 -40 42 Q -84 40 -104 -10 Z" fill="url(#c0barba)" stroke={TINTA} strokeWidth={5} />
        {Array.from({ length: 16 }, (_, i) => { const x = -86 + i * 11.5; return <path key={i} d={`M ${x} ${60 + Math.abs(x) * 0.1} q ${i % 2 ? 6 : -6} 40 ${(i % 3) - 1} ${70 - Math.abs(x) * 0.35}`} stroke="#2a1408" strokeWidth={3} fill="none" opacity={0.8} />; })}
        <path d="M -76 30 Q -30 6 0 24 Q 30 6 76 30 Q 50 52 0 44 Q -50 52 -76 30 Z" fill="#3a1d0c" stroke={TINTA} strokeWidth={3} />
        {/* boca gritando */}
        <g transform={`translate(0 76) scale(1 ${grito})`}>
          <path d="M -40 -14 Q 0 -32 40 -14 Q 36 42 0 46 Q -36 42 -40 -14 Z" fill="#4a0a10" stroke={TINTA} strokeWidth={4} />
          <path d="M -32 -14 Q 0 -28 32 -14 L 30 -2 Q 0 -14 -30 -2 Z" fill="#fff" />
          <path d="M -22 30 Q 0 18 22 30 Q 10 42 0 42 Q -10 42 -22 30 Z" fill="#c8405a" />
        </g>
        <path d="M -10 -4 Q -18 30 0 34 Q 18 30 10 -4" fill="#d8906a" stroke={TINTA} strokeWidth={3} />
        {/* ojos furiosos, cejas en V */}
        {[[-40, -30], [40, -32]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse rx={28} ry={25} fill="#fffdf6" stroke={TINTA} strokeWidth={4} />
            <circle cx={i ? -6 : 6} cy={3} r={12} fill="#2a1a10" />
            <circle cx={i ? -6 : 6} cy={3} r={7} fill="#000" />
            <circle cx={i ? -10 : 2} cy={-1} r={3.5} fill="#fff" />
          </g>
        ))}
        <path d="M -82 -74 Q -50 -70 -12 -48" stroke="#2a1408" strokeWidth={17} strokeLinecap="round" fill="none" />
        <path d="M 82 -76 Q 50 -72 12 -48" stroke="#2a1408" strokeWidth={17} strokeLinecap="round" fill="none" />
        <path d="M -16 -62 q 8 10 0 18 M 16 -62 q -8 10 0 18" stroke="#b8664a" strokeWidth={3} fill="none" />
        <ellipse cx={-62} cy={8} rx={18} ry={9} fill="#ff6a5a" opacity={0.4} />
        <ellipse cx={62} cy={6} rx={18} ry={9} fill="#ff6a5a" opacity={0.4} />
        {/* tricornio con galón y calavera */}
        <path d="M -210 -50 Q -170 -130 -70 -150 Q -10 -260 80 -168 Q 190 -170 222 -70 Q 120 -104 0 -94 Q -120 -96 -210 -50 Z" fill="url(#c0sombrero)" stroke="#000" strokeWidth={5} />
        <path d="M -210 -50 Q -110 -100 0 -96 Q 130 -104 222 -70" stroke="url(#c0oro)" strokeWidth={12} fill="none" />
        <path d="M -170 -110 Q -60 -170 60 -170" stroke="#4a4a5a" strokeWidth={5} fill="none" opacity={0.6} />
        <g transform="translate(14 -168) scale(0.85)">
          <path d="M -26 0 Q -26 -30 0 -30 Q 26 -30 26 0 Q 26 16 14 20 L 14 30 L -14 30 L -14 20 Q -26 16 -26 0 Z" fill="#f4ead2" stroke="#000" strokeWidth={3} />
          <path d="M -40 38 L 40 72 M 40 38 L -40 72" stroke="#f4ead2" strokeWidth={11} strokeLinecap="round" />
          <circle cx={-9} cy={-2} r={7} fill="#141016" /><circle cx={9} cy={-2} r={7} fill="#141016" />
          <path d="M -8 22 l 0 6 M 0 22 l 0 6 M 8 22 l 0 6" stroke="#141016" strokeWidth={3} />
        </g>
        <path d="M 86 -40 Q 104 10 84 70" stroke="#ffb45a" strokeWidth={8} fill="none" opacity={0.75} strokeLinecap="round" />
      </g>
    </g>
  );
};

export const Cuadro0: React.FC<{ t: number }> = ({ t }) => {
  if (t > 1.62) return null;
  const vivo = interpolate(t, [0, 0.12], [0, 1], cl);
  const push = 1 + interpolate(t, [0, 1.1], [0, 0.05], cl);
  // la bala grande viene a cámara y tapa todo
  const viene = interpolate(t, [0.95, 1.38], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const bx = 565 + viene * (836 - 565), by = 375 + viene * (470 - 375), br = 80 + viene * 1300;
  const sale = interpolate(t, [1.38, 1.6], [1, 0], cl);
  const rayo = (t > 0.32 && t < 0.42) || (t > 0.5 && t < 0.56);
  const tv = t * vivo;
  const r = rnd(3);
  const gotas = Array.from({ length: 220 }, () => [r() * W, r() * H, 26 + r() * 50, r()]);
  return (
    <AbsoluteFill style={{ opacity: sale }}>
      <svg width={1920} height={1080} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="c0cielo" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stopColor="#0e1f3e" /><stop offset="0.45" stopColor="#24628a" /><stop offset="1" stopColor="#1a4a6a" /></linearGradient>
          <radialGradient id="c0claro" cx="0.35" cy="0.3" r="0.5"><stop offset="0" stopColor="#5ab8d8" stopOpacity={0.55} /><stop offset="1" stopColor="#5ab8d8" stopOpacity={0} /></radialGradient>
          <radialGradient id="c0calido" cx="0.85" cy="0.45" r="0.6"><stop offset="0" stopColor="#ff9a3a" stopOpacity={0.5} /><stop offset="1" stopColor="#ff7a2a" stopOpacity={0} /></radialGradient>
          <linearGradient id="c0piso" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7a4220" /><stop offset="0.5" stopColor="#5a2e14" /><stop offset="1" stopColor="#2e1608" /></linearGradient>
          <radialGradient id="c0luz"><stop offset="0" stopColor="#ffcf5a" stopOpacity={0.9} /><stop offset="1" stopColor="#ff8a3a" stopOpacity={0} /></radialGradient>
          <radialGradient id="c0brillo"><stop offset="0" stopColor="#fff2b0" stopOpacity={1} /><stop offset="0.4" stopColor="#ffb040" stopOpacity={0.7} /><stop offset="1" stopColor="#ff6a1a" stopOpacity={0} /></radialGradient>
          <linearGradient id="c0estela" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff2a0" /><stop offset="0.4" stopColor="#ffa040" /><stop offset="1" stopColor="#ff5a1a" stopOpacity={0} /></linearGradient>
          <linearGradient id="c0estelaI" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#fff2a0" /><stop offset="0.4" stopColor="#ffa040" /><stop offset="1" stopColor="#ff5a1a" stopOpacity={0} /></linearGradient>
          <radialGradient id="c0bala" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#5a5866" /><stop offset="0.5" stopColor="#2a2830" /><stop offset="1" stopColor="#0e0d12" /></radialGradient>
          <linearGradient id="c0ola" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7af0f0" /><stop offset="0.35" stopColor="#2ab8d0" /><stop offset="1" stopColor="#0a4a7a" /></linearGradient>
          <linearGradient id="c0madera" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a220c" /><stop offset="0.45" stopColor="#9a5424" /><stop offset="0.75" stopColor="#c87a3a" /><stop offset="1" stopColor="#5a2c10" /></linearGradient>
          <linearGradient id="c0maderaC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8622a" /><stop offset="1" stopColor="#5a2c12" /></linearGradient>
          <radialGradient id="c0piel" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#ffd2a8" /><stop offset="0.7" stopColor="#f0a878" /><stop offset="1" stopColor="#c8785a" /></radialGradient>
          <linearGradient id="c0lino" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6e2" /><stop offset="0.6" stopColor="#ecdcbc" /><stop offset="1" stopColor="#bca684" /></linearGradient>
          <linearGradient id="c0faja" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e03040" /><stop offset="1" stopColor="#8a1020" /></linearGradient>
          <linearGradient id="c0short" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3640" /><stop offset="1" stopColor="#1a181e" /></linearGradient>
          <linearGradient id="c0panuelo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f04a3a" /><stop offset="0.6" stopColor="#c8202c" /><stop offset="1" stopColor="#8a101c" /></linearGradient>
          <linearGradient id="c0pelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8843a" /><stop offset="1" stopColor="#7a4418" /></linearGradient>
          <linearGradient id="c0casaca" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8303c" /><stop offset="0.5" stopColor="#a81828" /><stop offset="1" stopColor="#6a0c16" /></linearGradient>
          <linearGradient id="c0barba" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a3818" /><stop offset="1" stopColor="#3a1a08" /></linearGradient>
          <linearGradient id="c0sombrero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2e2a36" /><stop offset="1" stopColor="#0a080c" /></linearGradient>
          <linearGradient id="c0oro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0a0" /><stop offset="0.5" stopColor="#e8b030" /><stop offset="1" stopColor="#9a6a10" /></linearGradient>
        </defs>
        <g transform={`translate(${W / 2} ${H * 0.55}) scale(${push}) translate(${-W / 2} ${-H * 0.55})`}>
          <rect width={W} height={H} fill="url(#c0cielo)" />
          <rect width={W} height={H} fill="url(#c0claro)" />
          {/* nubes de tormenta en capas */}
          {[[180, 60, 280], [520, 30, 240], [820, 100, 260], [1100, 40, 260], [360, 210, 220], [700, 240, 200], [60, 250, 200]].map(([x, y, rr], i) => (
            <g key={i} transform={`translate(${x + Math.sin(t + i) * 10 * vivo} ${y})`} opacity={0.85}>
              <ellipse rx={rr} ry={rr * 0.36} fill="#1a2c4c" />
              <ellipse cx={-rr * 0.42} cy={-rr * 0.14} rx={rr * 0.52} ry={rr * 0.3} fill="#2e4e78" />
              <ellipse cx={rr * 0.34} cy={-rr * 0.12} rx={rr * 0.46} ry={rr * 0.28} fill="#24426a" />
              <ellipse cx={-rr * 0.2} cy={-rr * 0.26} rx={rr * 0.3} ry={rr * 0.14} fill="#5a86b0" opacity={0.5} />
            </g>
          ))}
          {/* rayos */}
          {([["M 900 0 L 872 70 L 902 78 L 860 180 L 880 186 L 850 250", 1], ["M 140 120 L 112 200 L 140 206 L 100 300", 0.6], ["M 640 60 L 620 120 L 646 124 L 618 190", 0.5]] as [string, number][]).map(([d, o], i) => (
            <g key={i}><path d={d} stroke="#5ac8ff" strokeWidth={rayo ? 16 : 10} fill="none" opacity={0.35 * o} /><path d={d} stroke="#e8faff" strokeWidth={rayo ? 6 : 3} fill="none" opacity={(rayo ? 1 : 0.7) * o} /></g>
          ))}
          {/* mar embravecido a la izquierda, barcos piratas, ola enorme */}
          <path d="M 0 470 Q 300 430 760 520 L 760 700 L 0 700 Z" fill="#0e4a6a" />
          <BarcoNegro x={600} y={470} s={0.5} t={tv} op={0.55} k={1} />
          <BarcoNegro x={130} y={300} s={0.6} t={tv} op={0.6} k={2} />
          <path d={`M 0 430 Q 110 ${260 - Math.sin(t * 2) * 12 * vivo} 290 280 Q 410 300 440 390 Q 380 340 320 372 Q 400 480 540 570 Q 650 640 760 710 L 760 941 L 0 941 Z`} fill="url(#c0ola)" />
          <path d="M 0 520 Q 140 420 320 470 Q 480 560 700 690" stroke="#0a5a84" strokeWidth={30} fill="none" opacity={0.5} />
          <BarcoNegro x={180} y={420} s={1.2} t={tv} k={3} />
          <BarcoNegro x={300} y={545} s={0.7} t={tv} op={0.85} k={4} />
          <Fuego x={262} y={560} r={22} t={t} k={1} />
          <Fuego x={600} y={500} r={16} t={t} k={2} />
          <path d={`M 30 340 Q 150 ${250 - Math.sin(t * 2) * 12 * vivo} 290 292 Q 380 316 420 380`} stroke="#effffe" strokeWidth={20} fill="none" opacity={0.85} strokeLinecap="round" />
          {Array.from({ length: 160 }, (_, i) => { const q = rnd(i + 50); const x = q() * 700, y0 = 380 + q() * 360 - ((t * 140 * vivo + q() * 80) % 80); return <circle key={i} cx={x} cy={y0} r={2 + q() * 9} fill={q() > 0.3 ? "#ffffff" : "#aef4ff"} opacity={0.55 + q() * 0.45} />; })}
          {/* jarcia: red de sogas con nudos, a la derecha */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={1010 + i * 46} y1={0} x2={1110 + i * 56} y2={560} stroke="#2e1a10" strokeWidth={7} />)}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <path key={`h${i}`} d={`M ${1020 + i * 18} ${50 + i * 62} Q 1200 ${60 + i * 62} 1400 ${30 + i * 62}`} stroke="#2e1a10" strokeWidth={5} fill="none" />)}
          {/* mástil y farol encendido */}
          <rect x={1500} y={0} width={86} height={720} fill="url(#c0madera)" />
          <rect x={1494} y={300} width={98} height={24} fill="#2e2a2c" />
          <g transform="translate(1612 136)">
            <circle r={150} fill="url(#c0luz)" opacity={0.75 + 0.2 * Math.sin(t * 13)} />
            <path d="M -10 -96 L 10 -96 L 10 -70 L -10 -70 Z" fill="#2e2a2c" />
            <path d="M -40 -70 L 40 -70 L 30 -50 L -30 -50 Z" fill="#3a2a22" stroke="#000" strokeWidth={3} />
            <rect x={-32} y={-50} width={64} height={96} rx={8} fill="#ffcf5a" stroke="#2e2a2c" strokeWidth={8} />
            <path d="M -32 -2 L 32 -2 M 0 -50 L 0 46" stroke="#2e2a2c" strokeWidth={5} />
            <ellipse cx={0} cy={6} rx={10} ry={16 + Math.sin(t * 20) * 3} fill="#fff6c0" />
            <path d="M -40 46 L 40 46 L 30 62 L -30 62 Z" fill="#3a2a22" stroke="#000" strokeWidth={3} />
          </g>
          {/* barandas: tablones, postes y luz cálida en los cantos */}
          <path d="M 200 760 L 1580 540 L 1590 600 L 210 830 Z" fill="url(#c0piso)" stroke={TINTA} strokeWidth={4} />
          <path d="M 196 744 L 1584 520 L 1590 548 L 202 772 Z" fill="#8a4a20" stroke={TINTA} strokeWidth={4} />
          <path d="M 204 750 L 1584 528" stroke="#ffb870" strokeWidth={4} opacity={0.6} />
          {Array.from({ length: 13 }, (_, i) => { const x = 250 + i * 105, y = 752 - (x - 200) * 0.16; return <g key={i}><rect x={x} y={y - 12} width={28} height={80} fill="#4a240e" stroke={TINTA} strokeWidth={3} /><rect x={x + 18} y={y - 12} width={6} height={80} fill="#ffa860" opacity={0.4} /></g>; })}
          {/* cubierta mojada: tablones con veta, clavos y reflejos */}
          <path d="M 0 800 L 1672 560 L 1672 941 L 0 941 Z" fill="url(#c0piso)" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-200 + i * 40} y1={941} x2={1672} y2={600 + i * 32} stroke="#24100a" strokeWidth={4} opacity={0.75} />)}
          {Array.from({ length: 40 }, (_, i) => { const q = rnd(i + 300); const x = q() * W, y = 640 + q() * 300; return <path key={`v${i}`} d={`M ${x} ${y} q 40 -8 80 -10`} stroke="#3a1a08" strokeWidth={2} fill="none" opacity={0.6} />; })}
          {Array.from({ length: 30 }, (_, i) => { const q = rnd(i + 400); return <circle key={`c${i}`} cx={q() * W} cy={660 + q() * 280} r={3} fill="#1a0c06" />; })}
          {Array.from({ length: 26 }, (_, i) => { const q = rnd(i + 500); const x = 300 + q() * 1300, y = 900 - (x - 300) * 0.16 + (q() - 0.5) * 80; return <path key={`r${i}`} d={`M ${x} ${y} l ${30 + q() * 70} ${-6 - q() * 10}`} stroke={x > 900 ? "#ffb060" : "#8ad8ff"} strokeWidth={4 + q() * 5} opacity={0.35 + q() * 0.3} strokeLinecap="round" />; })}
          {/* charcos con salpicones de lluvia */}
          {Array.from({ length: 24 }, (_, i) => { const q = rnd(i + 600); const x = 200 + q() * 1400, y = 700 + q() * 230, f = (t * 3 + q()) % 1; return <ellipse key={`s${i}`} cx={x} cy={y} rx={4 + f * 18} ry={2 + f * 5} fill="none" stroke="#cfeeff" strokeWidth={2} opacity={(1 - f) * 0.7} />; })}
          <rect width={W} height={H} fill="url(#c0calido)" />
          {/* cañón disparando detrás del chico y fogonazo del costado derecho */}
          <g transform="translate(1210 486)">
            <path d="M -70 -26 L 60 -20 Q 76 0 60 20 L -70 26 Q -84 0 -70 -26 Z" fill="#2a2a34" stroke="#000" strokeWidth={4} />
            <rect x={-30} y={-28} width={14} height={56} fill="#3a3a46" />
            <path d="M -60 -18 L 50 -14" stroke="#8a8aa0" strokeWidth={4} opacity={0.6} />
            <circle cx={-20} cy={42} r={28} fill="#5a3418" stroke="#000" strokeWidth={4} />
            <circle cx={-20} cy={42} r={8} fill="#2a1408" />
          </g>
          <Fuego x={1110} y={470} r={52 + Math.sin(t * 22) * 6} t={t} k={3} />
          <Fuego x={1650} y={500} r={44} t={t} k={4} />
          {/* humo del disparo */}
          {[0, 1, 2, 3].map((i) => <circle key={`h${i}`} cx={1080 - i * 30 - tv * 40} cy={440 - i * 22 - tv * 30} r={30 + i * 10 + tv * 20} fill="#8a8a96" opacity={0.25} />)}
          {/* astillas volando */}
          {Array.from({ length: 16 }, (_, i) => { const q = rnd(i + 90); const x = 580 + q() * 450 - tv * 140, y = 240 + q() * 300 + tv * 60; return <path key={i} d="M -12 -4 L 14 -2 L 10 5 L -10 4 Z" fill="#7a4220" stroke="#2a140a" strokeWidth={1.5} transform={`translate(${x} ${y}) rotate(${q() * 180 + t * 300})`} />; })}
          {/* balas */}
          <Bala x={960 - tv * 180} y={170 + tv * 40} r={38} t={t} k={1} />
          <Bala x={848 - tv * 160} y={255 + tv * 30} r={38} t={t} k={2} />
          <Bala x={460 - tv * 140} y={585 + tv * 20} r={32} t={t} k={3} />
          {/* barriles con sogas, a los costados */}
          <Barril x={70} y={560} w={250} h={400} />
          <Barril x={1640} y={430} w={160} h={210} />
          <g transform="translate(1320 196) scale(1.06) translate(-1320 -210)"><Capitan t={tv} /></g>
          <Barril x={1570} y={640} w={270} h={320} mojado />
          <Soga x={1580} y={720} rx={150} ry={34} n={2} g={24} />
          <Grumete t={tv} />
          <Soga x={110} y={900} rx={210} ry={40} n={3} g={30} />
          {/* la bala grande (la del gancho), con su fogonazo detrás */}
          {viene < 0.98 && <g>
            <Fuego x={bx - br * 1.9} y={by - br * 0.3} r={br * 0.9} t={t} k={5} />
            <Bala x={bx} y={by} r={br} t={t} dir={-1} fuego={1 - viene} k={9} />
          </g>}
          {/* chispas sueltas */}
          {Array.from({ length: 60 }, (_, i) => { const q = rnd(i + 700); const x = q() * W, y = (q() * H - t * 90 * vivo + H) % H; return <circle key={`ch${i}`} cx={x} cy={y} r={1.5 + q() * 2.5} fill={q() > 0.5 ? "#ffd04a" : "#ff8a2a"} opacity={0.5 + q() * 0.5} />; })}
          {/* lluvia */}
          {gotas.map(([x, y, l, k], i) => { const yy = (y + t * 1400 * vivo) % H; const xx = x - (t * 500 * vivo) % 200; return <line key={i} x1={xx} y1={yy} x2={xx - l * 0.35} y2={yy + l} stroke={k > 0.7 ? "#ffffff" : "#bfe4ff"} strokeWidth={k > 0.7 ? 3 : 2} opacity={0.35 + k * 0.3} />; })}
          {rayo && <rect width={W} height={H} fill="#e8f0ff" opacity={0.22} />}
        </g>
        {viene >= 0.98 && <rect width={W} height={H} fill="#25232e" />}
      </svg>
      <S t={0.05} p="thunder" g={-10} />
      <S t={0.15} p="cannon" g={-10} />
      <S t={0.2} p="cloth" g={-10} />
      <S t={0.55} p="cloth" g={-10} pitch={1.1} />
      <S t={0.6} p="splash" g={-12} />
      <S t={0.95} p="whoosh_big" g={-4} />
      <S t={1.38} p="wood_hit" g={-6} />
    </AbsoluteFill>
  );
};
