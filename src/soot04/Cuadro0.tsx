import React from "react";
import { interpolate } from "remotion";
import { fontFamily } from "./kit";

// CUADRO 0 = la miniatura (soot04_elegida.png) rehecha en código, SIN el texto grande y SIN la flecha.
// Tormenta, cola de cachalote que sale del agua chorreando, el greenhand aterrado con el arpón en el bote
// y el recibo de $0.00. En 0-0,9 s la escena vive (olas, agua que cae, el chico tiembla); de 0,9 a 1,5 s la
// cámara empuja hasta la cara del chico y funde con su cara en el muelle de P0 (match cut de cara a cara).
// Nivel de detalle de la miniatura: piel mojada con textura y brillo (feTurbulence + especular), veta de
// madera, pergamino manchado, espuma de borde orgánico (desplazamiento), luz cálida del sol contra sombra fría.
// Coordenadas del dibujo = las de la miniatura (1672x941).
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const FIN_CUADRO0 = 1.5;
const W = 1672, H = 941;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// textura multiplicada dentro de la silueta (+ brillo especular opcional = superficie mojada)
const Tex: React.FC<{ id: string; bf: string; oct?: number; seed?: number; lo?: number; hi?: number; brillo?: number; luz?: string; az?: number }> = ({ id, bf, oct = 4, seed = 1, lo = 0.62, hi = 1.18, brillo = 0, luz = "#fff4dc", az = 235 }) => (
  <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency={bf} numOctaves={oct} seed={seed} result="n" />
    <feColorMatrix in="n" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="g" />
    <feComponentTransfer in="g" result="m">
      <feFuncR type="linear" slope={(hi - lo) * 2} intercept={lo - (hi - lo) * 0.5} />
      <feFuncG type="linear" slope={(hi - lo) * 2} intercept={lo - (hi - lo) * 0.5} />
      <feFuncB type="linear" slope={(hi - lo) * 2} intercept={lo - (hi - lo) * 0.5} />
    </feComponentTransfer>
    <feBlend in="SourceGraphic" in2="m" mode="multiply" result="t" />
    {brillo > 0 ? <>
      <feSpecularLighting in="n" surfaceScale={5} specularConstant={brillo} specularExponent={22} lightingColor={luz} result="s">
        <feDistantLight azimuth={az} elevation={38} />
      </feSpecularLighting>
      <feComposite in="t" in2="s" operator="arithmetic" k1={0} k2={1} k3={0.55} k4={0} result="ts" />
      <feComposite in="ts" in2="SourceAlpha" operator="in" />
    </> : <feComposite in="t" in2="SourceAlpha" operator="in" />}
  </filter>
);
// borde orgánico (espuma, nubes, pergamino)
const Rugoso: React.FC<{ id: string; bf: number; esc: number; seed?: number }> = ({ id, bf, esc, seed = 2 }) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency={bf} numOctaves={3} seed={seed} result="n" />
    <feDisplacementMap in="SourceGraphic" in2="n" scale={esc} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

// masas de nubes de tormenta: racimos con luz arriba y panza fría
const Racimo: React.FC<{ x: number; y: number; w: number; seed: number; base: string; luz: string; t: number }> = ({ x, y, w, seed, base, luz, t }) => {
  const n = Math.round(w / 30);
  const cs = Array.from({ length: n }, (_, i) => ({ cx: x + (i / n) * w + (rnd(seed * 31 + i) - 0.5) * 30 + t * 9, cy: y - Math.sin((i / n) * Math.PI) * w * 0.12 + (rnd(seed * 31 + i + 40) - 0.5) * 30, r: 30 + rnd(seed * 31 + i + 80) * w * 0.14 }));
  return <g>
    {cs.map((c, i) => <circle key={`l${i}`} cx={c.cx} cy={c.cy - 10} r={c.r} fill={luz} />)}
    {cs.map((c, i) => <circle key={`b${i}`} cx={c.cx + 7} cy={c.cy + 8} r={c.r * 0.94} fill={base} />)}
    {cs.map((c, i) => <circle key={`p${i}`} cx={c.cx + 12} cy={c.cy + 20} r={c.r * 0.7} fill="#0f1e48" opacity={0.35} />)}
  </g>;
};
const Nubes: React.FC<{ t: number }> = ({ t }) => (
  <g filter="url(#c0rugNube)">
    <Racimo x={480} y={40} w={460} seed={5} base="#1e3468" luz="#5a80c0" t={t} />
    <Racimo x={-80} y={110} w={720} seed={1} base="#1a2f62" luz="#4468a8" t={t} />
    <Racimo x={1080} y={50} w={720} seed={2} base="#203a72" luz="#b4cdec" t={t} />
    <Racimo x={-60} y={270} w={600} seed={4} base="#24427c" luz="#8fb0dc" t={t} />
    <Racimo x={1240} y={210} w={520} seed={3} base="#2a4a88" luz="#d2e2f6" t={t} />
    <Racimo x={1380} y={340} w={360} seed={6} base="#2e5090" luz="#e4eefa" t={t} />
    <Racimo x={-40} y={400} w={560} seed={7} base="#284a86" luz="#c2d6f2" t={t} />
    {/* bordes encendidos por el sol, cálidos */}
    {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={600 + rnd(i + 900) * 380 + t * 9} cy={150 + rnd(i + 910) * 160} r={22 + rnd(i + 920) * 40} fill="#ffe8bc" opacity={0.35} />)}
  </g>
);
const Ola: React.FC<{ y: number; amp: number; k: number; t: number; arriba: string; abajo: string; fase: number; id: string }> = ({ y, amp, k, t, arriba, abajo, fase, id }) => {
  const pts: [number, number][] = [];
  for (let x = -40; x <= W + 40; x += 24) pts.push([x, y + Math.sin(x * k + fase + t * 2.4) * amp + Math.sin(x * k * 2.3 + fase * 2 - t * 1.7) * amp * 0.4]);
  const linea = pts.map((p) => `${p[0]},${p[1]}`).join(" L ");
  const d = `M -40 ${H + 20} L ${linea} L ${W + 40} ${H + 20} Z`;
  return (
    <g>
      <linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={arriba} /><stop offset="0.35" stopColor={abajo} /><stop offset="1" stopColor="#081a44" /></linearGradient>
      <path d={d} fill={`url(#${id})`} filter="url(#c0texAgua)" />
      {/* vetas de luz y espuma sobre el lomo */}
      {Array.from({ length: 26 }, (_, i) => <path key={`v${i}`} d={`M ${rnd(i + y) * W} ${y + 30 + rnd(i + y + 1) * 80} q ${30 + rnd(i) * 30} -14 ${80 + rnd(i + 2) * 60} -2`} stroke={i % 3 ? "#9cc4ee" : "#e8f3ff"} strokeWidth={3 + rnd(i + 3) * 5} fill="none" opacity={0.55} strokeLinecap="round" />)}
      <g filter="url(#c0rugEsp)">
        <path d={`M ${linea}`} stroke="#eef6ff" strokeWidth={16} fill="none" strokeLinecap="round" />
        {pts.filter((_, i) => i % 2 === 0).map(([px, py], i) => <path key={i} d={`M ${px - 44} ${py + 8} q 30 -44 76 -12 q -30 4 -50 34 Z`} fill="#f4f9ff" />)}
      </g>
    </g>
  );
};
const Espuma: React.FC<{ cx: number; cy: number; w: number; h: number; n: number; seed: number; t: number }> = ({ cx, cy, w, h, n, seed, t }) => (
  <g>
    <g filter="url(#c0rugEsp)">
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(seed + i), b = rnd(seed + i + 500);
        return <circle key={i} cx={cx + (a - 0.5) * w + Math.sin(t * 3 + i) * 6} cy={cy + (b - 0.5) * h - Math.abs(Math.sin(t * 2 + i)) * 8} r={10 + rnd(seed + i + 900) * 34} fill={i % 4 ? "#f4f9ff" : "#bcd6f2"} />;
      })}
    </g>
    {/* burbujas y gotitas sueltas del borde */}
    {Array.from({ length: Math.round(n * 0.8) }, (_, i) => <circle key={`g${i}`} cx={cx + (rnd(seed + i + 1300) - 0.5) * w * 1.2} cy={cy + (rnd(seed + i + 1400) - 0.5) * h * 1.4 - 20} r={2 + rnd(seed + i + 1500) * 5} fill="#ffffff" opacity={0.9} />)}
  </g>
);
// chorros que suben a los costados de la cola + rocío + bruma
const Salpicon: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <ellipse cx={1150} cy={560} rx={520} ry={190} fill="#dfeeff" opacity={0.35} filter="url(#c0bruma)" />
    <g filter="url(#c0rugEsp)">
      {Array.from({ length: 34 }, (_, i) => {
        const lado = i % 2 ? 1 : -1, x0 = 1150 + lado * (70 + rnd(i + 30) * 280), alto = 140 + rnd(i + 31) * 400;
        const x1 = x0 + lado * (30 + rnd(i + 32) * 140), y1 = 640 - alto - Math.sin(t * 4 + i) * 12;
        return <path key={i} d={`M ${x0 - 26} 650 Q ${x0 + lado * 10} ${640 - alto * 0.5} ${x1} ${y1} Q ${x0 + lado * 36} ${640 - alto * 0.45} ${x0 + 26} 650 Z`} fill={i % 3 ? "#f2f8ff" : "#c4dcf4"} opacity={0.82} />;
      })}
    </g>
    {Array.from({ length: 220 }, (_, i) => {
      const a = -Math.PI / 2 + (rnd(i + 70) - 0.5) * 2.9, d = 120 + rnd(i + 71) * 540 + ((t * 120 + rnd(i) * 60) % 60);
      const r = 2 + rnd(i + 72) * 9;
      return <g key={`r${i}`}>
        <circle cx={1150 + Math.cos(a) * d} cy={650 + Math.sin(a) * d * 0.9} r={r} fill="#ffffff" opacity={0.92} />
        {r > 7 && <circle cx={1150 + Math.cos(a) * d - r * 0.3} cy={650 + Math.sin(a) * d * 0.9 - r * 0.3} r={r * 0.35} fill="#9cc4ee" opacity={0.6} />}
      </g>;
    })}
  </g>
);

const Cola: React.FC<{ t: number }> = ({ t }) => {
  const sube = -t * 18;
  const bordeIzq = (u: number) => [822 + (1040 - 822) * u, 50 + (400 - 50) * u] as const;
  const bordeDer = (u: number) => [1262 + (1650 - 1262) * u, 350 - (350 - 256) * u] as const;
  const IZQ = "M 1020 700 C 1050 560 1060 460 1040 400 C 960 330 860 210 812 40 C 808 16 830 8 846 20 C 980 60 1130 130 1225 235 C 1250 330 1280 520 1330 700 Z";
  const DER = "M 1222 232 C 1350 180 1520 168 1640 214 C 1668 226 1672 244 1655 252 L 1630 262 L 1612 258 L 1590 270 L 1560 274 C 1480 300 1340 324 1262 350 Z";
  return (
    <g transform={`translate(0 ${sube})`}>
      <defs>
        <linearGradient id="c0cola" x1="0" x2="1" y1="0" y2="0.5">
          <stop offset="0" stopColor="#4e6aa8" /><stop offset="0.3" stopColor="#2a3e72" /><stop offset="0.7" stopColor="#1a2850" /><stop offset="1" stopColor="#0e1630" />
        </linearGradient>
        <linearGradient id="c0colaD" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#1a2850" /><stop offset="0.6" stopColor="#25325a" /><stop offset="1" stopColor="#3a4a78" /></linearGradient>
        <linearGradient id="c0cortina" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f4faff" stopOpacity={0.95} /><stop offset="1" stopColor="#bcd8f6" stopOpacity={0} /></linearGradient>
      </defs>
      <g filter="url(#c0texPiel)">
        <path d={IZQ} fill="url(#c0cola)" />
        <path d={DER} fill="url(#c0colaD)" />
      </g>
      {/* moteado de la piel, recortado a la silueta */}
      <clipPath id="c0silCola"><path d={IZQ} /><path d={DER} /></clipPath>
      <g clipPath="url(#c0silCola)">
        {Array.from({ length: 420 }, (_, i) => { const x = 812 + rnd(i + 2000) * 860, y = 10 + rnd(i + 2400) * 700, cl2 = i % 3 === 0; return <ellipse key={i} cx={x} cy={y} rx={3 + rnd(i + 2800) * (cl2 ? 9 : 14)} ry={2 + rnd(i + 3200) * (cl2 ? 6 : 9)} fill={cl2 ? "#7088c0" : "#0a1024"} opacity={cl2 ? 0.45 : 0.5} transform={`rotate(${rnd(i + 3600) * 60 - 30} ${x} ${y})`} />; })}
      </g>
      {/* brillo mojado grande (como la miniatura) */}
      <g filter="url(#c0suave)">
        <path d="M 880 70 C 960 120 1060 180 1150 260" stroke="#dce8ff" strokeWidth={26} fill="none" opacity={0.4} strokeLinecap="round" />
        <path d="M 1270 250 C 1380 214 1500 206 1600 228" stroke="#dce8ff" strokeWidth={22} fill="none" opacity={0.35} strokeLinecap="round" />
        <path d="M 1120 330 C 1130 430 1120 520 1100 620" stroke="#b8ccf4" strokeWidth={22} fill="none" opacity={0.3} strokeLinecap="round" />
        {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={880 + rnd(i + 1900) * 640} cy={60 + rnd(i + 1910) * 300} rx={10 + rnd(i) * 16} ry={4 + rnd(i + 1) * 6} fill="#ffffff" opacity={0.35} />)}
      </g>
      {/* luz cálida del sol en el borde de ataque, fría en el lomo */}
      <path d="M 846 20 C 980 60 1130 130 1225 235" stroke="#ffe7b8" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />
      <path d="M 850 34 C 980 76 1120 146 1206 240" stroke="#a8bce6" strokeWidth={16} fill="none" opacity={0.35} />
      <path d="M 1226 234 C 1350 186 1510 176 1630 216" stroke="#c4d6f4" strokeWidth={8} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d="M 1090 420 C 1090 520 1070 600 1050 690" stroke="#7a8cbc" strokeWidth={16} fill="none" opacity={0.35} />
      {/* cicatrices de calamar y arrugas de la piel */}
      {Array.from({ length: 26 }, (_, i) => { const x = 900 + rnd(i + 800) * 380, y = 100 + rnd(i + 810) * 520; return <path key={`s${i}`} d={`M ${x} ${y} q ${10 + rnd(i) * 30} ${-6 + rnd(i + 1) * 12} ${30 + rnd(i + 2) * 50} ${4 + rnd(i + 3) * 10}`} stroke="#8a9cc8" strokeWidth={2.5} fill="none" opacity={0.45} strokeLinecap="round" />; })}
      {Array.from({ length: 18 }, (_, i) => <path key={`a${i}`} d={`M ${1060 + rnd(i + 820) * 200} ${440 + i * 14} q 40 -6 90 2`} stroke="#0a1020" strokeWidth={3} fill="none" opacity={0.4} />)}
      {/* cortinas de agua que caen de las aletas */}
      <g filter="url(#c0rugEsp)">
        {Array.from({ length: 12 }, (_, i) => {
          const [x0, y0] = i < 6 ? bordeIzq(0.3 + rnd(i + 660) * 0.7) : bordeDer(0.1 + rnd(i + 670) * 0.8);
          const w = 10 + rnd(i + 680) * 16, largo = 90 + rnd(i + 690) * 160;
          return <path key={`c${i}`} d={`M ${x0 - w / 2} ${y0} Q ${x0 - w * 0.6} ${y0 + largo * 0.5} ${x0 - w * 0.15} ${y0 + largo} L ${x0 + w * 0.15} ${y0 + largo} Q ${x0 + w * 0.6} ${y0 + largo * 0.5} ${x0 + w / 2} ${y0} Z`} fill="url(#c0cortina)" />;
        })}
      </g>
      {Array.from({ length: 46 }, (_, i) => {
        const [x0, y0] = i < 23 ? bordeIzq(rnd(i + 610)) : bordeDer(rnd(i + 620));
        const largo = 30 + rnd(i) * 90;
        return <g key={i}>
          <path d={`M ${x0 - 7} ${y0} Q ${x0} ${y0 + largo} ${x0 + 2} ${y0 + largo + 10} Q ${x0 + 7} ${y0 + largo * 0.5} ${x0 + 7} ${y0} Z`} fill="#e6f2ff" opacity={0.85} />
          {[0, 1, 2].map((j) => { const u = (t * 1.4 + rnd(i * 3 + j + 640)) % 1; return <ellipse key={j} cx={x0 + 2} cy={y0 + largo + 10 + u * 260} rx={4 + rnd(i + j) * 3} ry={7 + rnd(i + j + 1) * 4} fill="#ffffff" opacity={0.95 * (1 - u)} />; })}
        </g>;
      })}
    </g>
  );
};

const Chico: React.FC<{ t: number }> = ({ t }) => {
  const tiembla = Math.sin(t * 38) * 2.2;
  const gota = (t * 0.8) % 1;
  const parpadeo = t > 0.55 && t < 0.62 ? 0.15 : 1;
  return (
    <g transform={`translate(${tiembla} ${Math.abs(tiembla) * 0.5})`}>
      <defs>
        <radialGradient id="c0cara" cx="0.62" cy="0.32" r="0.75"><stop offset="0" stopColor="#ffe0c2" /><stop offset="0.55" stopColor="#f6c49c" /><stop offset="1" stopColor="#d99872" /></radialGradient>
        <linearGradient id="c0pant" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#2a3460" /><stop offset="1" stopColor="#121834" /></linearGradient>
        <linearGradient id="c0sombraT" x1="1" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity={0} /><stop offset="1" stopColor="#1a2a5a" stopOpacity={0.45} /></linearGradient>
        <pattern id="c0punto" width={16} height={14} patternUnits="userSpaceOnUse"><path d="M 2 3 L 8 10 L 14 3" stroke="#142656" strokeWidth={2.2} fill="none" opacity={0.7} /></pattern>
        <linearGradient id="c0hierro" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#c8ccd8" /><stop offset="0.45" stopColor="#6a6e7c" /><stop offset="1" stopColor="#2a2c34" /></linearGradient>
        <linearGradient id="c0asta" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#c48a50" /><stop offset="1" stopColor="#6a3a18" /></linearGradient>
      </defs>
      {/* piernas */}
      <path d="M 410 690 L 372 850 L 440 868 L 478 716 Z" fill="url(#c0pant)" />
      <path d="M 498 690 L 568 830 L 626 800 L 560 686 Z" fill="url(#c0pant)" />
      <path d="M 430 740 Q 420 790 404 840" stroke="#3a4678" strokeWidth={4} fill="none" opacity={0.6} />
      <path d="M 530 720 Q 560 770 590 816" stroke="#3a4678" strokeWidth={4} fill="none" opacity={0.6} />
      <path d="M 366 846 L 440 864 L 444 884 L 356 870 Z" fill="#3a2418" />
      <path d="M 566 828 L 628 798 L 640 814 L 572 848 Z" fill="#3a2418" />
      {/* torso con rayas, girado 3/4 */}
      <g transform="rotate(-8 480 630)">
        <clipPath id="c0torso"><rect x={372} y={560} width={220} height={140} rx={50} /></clipPath>
        <rect x={372} y={560} width={220} height={140} rx={50} fill="#f4f4f4" />
        <g clipPath="url(#c0torso)">
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M 360 ${572 + i * 24} Q 480 ${566 + i * 24} 610 ${574 + i * 24} L 610 ${585 + i * 24} Q 480 ${577 + i * 24} 360 ${583 + i * 24} Z`} fill="#2c3f80" />)}
          <rect x={372} y={560} width={220} height={140} fill="url(#c0sombraT)" />
          <path d="M 440 600 Q 452 640 444 690" stroke="#8a94b0" strokeWidth={3} fill="none" opacity={0.5} />
          <path d="M 500 610 Q 512 650 506 694" stroke="#8a94b0" strokeWidth={3} fill="none" opacity={0.5} />
        </g>
        <rect x={408} y={560} width={14} height={140} fill="#1c2340" /><rect x={540} y={560} width={14} height={140} fill="#1c2340" />
        <circle cx={415} cy={680} r={4} fill="#d8a63a" /><circle cx={547} cy={680} r={4} fill="#d8a63a" />
        <rect x={372} y={680} width={220} height={22} rx={8} fill="#6a3e1e" />
        <rect x={372} y={680} width={220} height={6} rx={3} fill="#9a6a3a" opacity={0.6} />
        <rect x={468} y={678} width={34} height={26} rx={5} fill="#e0b048" stroke="#8a6420" strokeWidth={4} />
      </g>
      {/* brazo de atrás */}
      <path d="M 392 610 Q 376 660 440 672" stroke="#f4f4f4" strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d="M 392 610 Q 376 660 440 672" stroke="#2c3f80" strokeWidth={46} fill="none" strokeDasharray="10 14" opacity={0.85} />
      {/* cabeza con sombreado: luz cálida arriba-derecha, sombra fría abajo-izquierda */}
      <ellipse cx={444} cy={472} rx={100} ry={98} fill="url(#c0cara)" />
      <path d="M 352 500 Q 372 566 444 570 Q 380 540 360 470 Z" fill="#8a6a8a" opacity={0.25} />
      <path d="M 530 420 Q 552 460 542 510" stroke="#fff0dc" strokeWidth={6} fill="none" opacity={0.7} strokeLinecap="round" />
      <ellipse cx={350} cy={486} rx={18} ry={26} fill="#eaa884" />
      <path d="M 346 476 q 8 10 2 22" stroke="#c07a5a" strokeWidth={3} fill="none" />
      {/* pelo bajo el gorro, con mechones */}
      <path d="M 344 452 Q 330 520 358 552 Q 352 500 372 468 Z" fill="#9a5426" />
      <path d="M 532 448 Q 556 476 544 516 Q 534 482 518 466 Z" fill="#9a5426" />
      <path d="M 360 438 Q 392 476 420 440 Q 446 480 476 438 Q 504 470 532 436 L 540 424 L 350 430 Z" fill="#a45c2a" />
      {Array.from({ length: 9 }, (_, i) => <path key={`m${i}`} d={`M ${364 + i * 20} 434 q ${4 + rnd(i) * 6} 18 ${-2 + rnd(i + 1) * 8} ${26 + rnd(i + 2) * 12}`} stroke={i % 2 ? "#c47a3e" : "#7a3e1a"} strokeWidth={3} fill="none" strokeLinecap="round" />)}
      {[0, 1, 2].map((i) => <path key={`ml${i}`} d={`M ${346 + i * 4} ${470 + i * 18} q -6 20 4 ${36 - i * 6}`} stroke="#c47a3e" strokeWidth={3} fill="none" />)}
      {/* gorro tejido con vuelta */}
      <path d="M 336 440 Q 326 318 444 308 Q 560 304 562 424 Z" fill="#26407f" />
      <path d="M 336 440 Q 326 318 444 308 Q 560 304 562 424 Z" fill="url(#c0punto)" />
      <path d="M 470 312 Q 540 320 556 400" stroke="#5a78c0" strokeWidth={10} fill="none" opacity={0.45} strokeLinecap="round" />
      <path d="M 326 418 Q 444 384 570 412 L 574 452 Q 444 422 330 460 Z" fill="#1f3570" />
      {Array.from({ length: 16 }, (_, i) => <line key={i} x1={334 + i * 15} y1={420 - Math.sin((i / 15) * Math.PI) * 14} x2={335 + i * 15} y2={454 - Math.sin((i / 15) * Math.PI) * 10} stroke="#142656" strokeWidth={4} />)}
      <path d="M 330 420 Q 444 388 568 414" stroke="#4a66a8" strokeWidth={4} fill="none" opacity={0.7} />
      {/* cejas de susto */}
      <path d="M 384 452 Q 402 430 430 440" stroke="#7a3e1a" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M 470 434 Q 494 420 520 432" stroke="#7a3e1a" strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* ojos enormes mirando a la ballena */}
      <g transform={`translate(0 ${(1 - parpadeo) * 10}) scale(1 ${parpadeo})`} style={{ transformOrigin: "450px 484px" }}>
        <ellipse cx={410} cy={486} rx={31} ry={36} fill="#fff" stroke="#4a2a1c" strokeWidth={2.5} />
        <ellipse cx={490} cy={480} rx={30} ry={35} fill="#fff" stroke="#4a2a1c" strokeWidth={2.5} />
        <path d="M 380 476 Q 410 448 440 476" stroke="#c8ccd8" strokeWidth={6} fill="none" opacity={0.6} />
        <circle cx={422} cy={482} r={19} fill="#7a4622" /><circle cx={502} cy={476} r={19} fill="#7a4622" />
        <circle cx={422} cy={486} r={14} fill="#a8682e" opacity={0.6} /><circle cx={502} cy={480} r={14} fill="#a8682e" opacity={0.6} />
        <circle cx={424} cy={482} r={10} fill="#120a08" /><circle cx={504} cy={476} r={10} fill="#120a08" />
        <circle cx={430} cy={474} r={6} fill="#fff" /><circle cx={510} cy={468} r={6} fill="#fff" />
        <circle cx={418} cy={492} r={2.5} fill="#fff" /><circle cx={498} cy={486} r={2.5} fill="#fff" />
      </g>
      <path d="M 452 500 q 8 14 -4 22" stroke="#c88a68" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* cachetes */}
      <ellipse cx={382} cy={530} rx={20} ry={12} fill="#f08080" opacity={0.55} />
      <ellipse cx={522} cy={522} rx={18} ry={11} fill="#f08080" opacity={0.55} />
      {/* boca gritando */}
      <path d="M 422 536 Q 456 522 486 536 Q 494 578 456 584 Q 418 582 422 536 Z" fill="#5a1418" />
      <path d="M 424 538 Q 456 526 484 538 L 482 548 Q 456 538 426 550 Z" fill="#fff" />
      <ellipse cx={456} cy={572} rx={20} ry={9} fill="#e0606e" />
      <path d="M 422 536 Q 456 522 486 536" stroke="#a85a4a" strokeWidth={3} fill="none" />
      {/* gotas de sudor con brillo */}
      {[[366, 452 + gota * 30, 1], [380, 512 + gota * 20, 0.8], [532, 506, 0.9]].map(([x, y, s], i) => <g key={`sd${i}`} transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M 0 0 q -11 20 0 28 q 11 -8 0 -28 Z" fill="#7ab8f4" /><ellipse cx={-3} cy={16} rx={2.5} ry={4} fill="#fff" />
      </g>)}
      {/* arpón */}
      <line x1={332} y1={790} x2={815} y2={350} stroke="url(#c0asta)" strokeWidth={18} strokeLinecap="round" />
      <line x1={334} y1={784} x2={812} y2={344} stroke="#e0aa70" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      {Array.from({ length: 14 }, (_, i) => <line key={`v${i}`} x1={360 + i * 32} y1={765 - i * 29} x2={376 + i * 32} y2={752 - i * 29} stroke="#5a3016" strokeWidth={2} opacity={0.5} />)}
      <path d="M 866 300 L 760 344 L 800 362 L 822 404 Z" fill="url(#c0hierro)" />
      <path d="M 866 300 L 800 362 L 822 404 Z" fill="#3a3c46" opacity={0.6} />
      <path d="M 866 300 L 772 342" stroke="#eef0f6" strokeWidth={3} opacity={0.9} />
      {[0, 1, 2].map((i) => <line key={i} x1={786 - i * 8} y1={364 + i * 8} x2={808 - i * 8} y2={386 + i * 8} stroke="#c8a070" strokeWidth={6} />)}
      {/* soga torcida */}
      <path d={`M 790 380 Q ${740 + Math.sin(t * 3) * 10} 520 690 600 Q 650 660 690 720`} stroke="#b8905a" strokeWidth={7} fill="none" />
      <path d={`M 790 380 Q ${740 + Math.sin(t * 3) * 10} 520 690 600 Q 650 660 690 720`} stroke="#6a4a22" strokeWidth={7} fill="none" strokeDasharray="3 6" />
      {/* brazo de adelante y manos con dedos sobre el asta */}
      <path d="M 560 600 Q 600 560 636 528" stroke="#f4f4f4" strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d="M 560 600 Q 600 560 636 528" stroke="#2c3f80" strokeWidth={46} fill="none" strokeDasharray="10 14" opacity={0.85} />
      {[[640, 528], [452, 672]].map(([x, y], i) => <g key={`h${i}`}>
        <circle cx={x} cy={y} r={30} fill="url(#c0cara)" stroke="#c88a68" strokeWidth={3} />
        {[0, 1, 2, 3].map((j) => <ellipse key={j} cx={x + 14 - j * 3} cy={y - 16 + j * 11} rx={15} ry={8} fill="#f6c49c" stroke="#c88a68" strokeWidth={2.5} transform={`rotate(-42 ${x + 14 - j * 3} ${y - 16 + j * 11})`} />)}
        <path d={`M ${x - 24} ${y - 4} q 14 -18 30 -10`} stroke="#c88a68" strokeWidth={3} fill="none" />
      </g>)}
    </g>
  );
};

const Bote: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="c0casco" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8a5428" /><stop offset="1" stopColor="#3e2210" /></linearGradient>
      <linearGradient id="c0interior" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#7a4a24" /><stop offset="0.5" stopColor="#b07a42" /><stop offset="1" stopColor="#8a5a2e" /></linearGradient>
      <linearGradient id="c0barril" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#5a3416" /><stop offset="0.4" stopColor="#a8703a" /><stop offset="1" stopColor="#5a3416" /></linearGradient>
    </defs>
    <g filter="url(#c0texMadera)">
      <path d="M 90 664 Q 500 636 930 770 L 860 941 L 30 941 Q 50 800 90 664 Z" fill="url(#c0casco)" />
      <path d="M 124 690 Q 500 664 886 778 L 846 834 Q 500 736 146 760 Z" fill="url(#c0interior)" />
    </g>
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${80 - i * 10} ${790 + i * 40} Q 480 ${770 + i * 40} ${880 - i * 8} ${838 + i * 30}`} stroke="#2e180a" strokeWidth={5} fill="none" />)}
    {[0, 1, 2, 3].map((i) => <path key={`h${i}`} d={`M ${80 - i * 10} ${794 + i * 40} Q 480 ${774 + i * 40} ${880 - i * 8} ${842 + i * 30}`} stroke="#b07a42" strokeWidth={2} fill="none" opacity={0.5} />)}
    {Array.from({ length: 22 }, (_, i) => <circle key={`c${i}`} cx={120 + (i % 11) * 72} cy={800 + Math.floor(i / 11) * 40 - (i % 11) * -4} r={3} fill="#2a2a30" />)}
    <path d="M 90 664 Q 500 636 930 770" stroke="#c48a4c" strokeWidth={18} fill="none" strokeLinecap="round" filter="url(#c0texMadera)" />
    <path d="M 92 658 Q 500 630 926 764" stroke="#f0c48a" strokeWidth={3} fill="none" opacity={0.7} />
    <path d="M 90 664 Q 500 636 930 770" stroke="#4a2a12" strokeWidth={4} fill="none" transform="translate(0 11)" />
    {/* barril */}
    <g filter="url(#c0texMadera)"><rect x={200} y={676} width={134} height={96} rx={24} fill="url(#c0barril)" /></g>
    {[0, 1, 2, 3].map((i) => <line key={i} x1={226 + i * 28} y1={680} x2={226 + i * 28} y2={768} stroke="#4a2a12" strokeWidth={3} />)}
    <rect x={200} y={690} width={134} height={10} fill="#4a4e58" /><rect x={200} y={746} width={134} height={10} fill="#4a4e58" />
    <rect x={200} y={690} width={134} height={3} fill="#a8acb8" /><rect x={200} y={746} width={134} height={3} fill="#a8acb8" />
    {/* sogas enrolladas */}
    {[0, 1, 2].map((i) => <g key={i}>
      <ellipse cx={760} cy={772 - i * 8} rx={70 - i * 8} ry={18} fill="none" stroke="#c8a070" strokeWidth={9} />
      <ellipse cx={760} cy={772 - i * 8} rx={70 - i * 8} ry={18} fill="none" stroke="#7a5428" strokeWidth={9} strokeDasharray="3 6" />
    </g>)}
    <path d="M 130 700 Q 170 740 150 800" stroke="#c8a070" strokeWidth={8} fill="none" />
    <path d="M 130 700 Q 170 740 150 800" stroke="#7a5428" strokeWidth={8} fill="none" strokeDasharray="3 6" />
    {/* agua mojando la borda */}
    {Array.from({ length: 20 }, (_, i) => <ellipse key={`w${i}`} cx={120 + rnd(i + 1700) * 780} cy={660 + rnd(i + 1710) * 120 + rnd(i) * 30} rx={3} ry={5} fill="#e8f4ff" opacity={0.85} />)}
  </g>
);

const Recibo: React.FC = () => (
  <g transform="translate(1390 770) rotate(-9)">
    <defs>
      <radialGradient id="c0perg" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stopColor="#f6e6bc" /><stop offset="0.75" stopColor="#e2c890" /><stop offset="1" stopColor="#b48a52" /></radialGradient>
    </defs>
    <g filter="url(#c0rugPapel)">
      <path d="M -270 -160 L 260 -175 L 275 150 L -255 168 Z" fill="url(#c0perg)" filter="url(#c0texPapel)" />
    </g>
    <path d="M -262 -150 L 252 -165 L 265 140 L -247 158 Z" fill="none" stroke="#a8844c" strokeWidth={3} opacity={0.5} />
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-220 + rnd(i + 40) * 460} cy={-120 + rnd(i + 44) * 260} r={8 + rnd(i) * 22} fill="#a07a42" opacity={0.18} />)}
    {Array.from({ length: 12 }, (_, i) => <circle key={`w${i}`} cx={-240 + rnd(i + 60) * 500} cy={-150 + rnd(i + 64) * 300} r={2 + rnd(i + 68) * 4} fill="#d8ecff" opacity={0.7} />)}
    <g transform="translate(-205 -70)" stroke="#23305a" strokeWidth={7} fill="none" strokeLinecap="round">
      <circle cx={0} cy={-26} r={9} /><line x1={0} y1={-17} x2={0} y2={30} /><line x1={-16} y1={-6} x2={16} y2={-6} /><path d="M -26 14 Q 0 44 26 14" />
    </g>
    <text x={40} y={-80} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={62} fill="#23305a">PAY SLIP</text>
    <line x1={-150} y1={-46} x2={240} y2={-50} stroke="#23305a" strokeWidth={6} />
    <line x1={-150} y1={-38} x2={240} y2={-42} stroke="#23305a" strokeWidth={2} />
    <line x1={-245} y1={-14} x2={240} y2={-20} stroke="#23305a" strokeWidth={3} opacity={0.5} />
    <text x={-236} y={80} fontFamily={fontFamily} fontWeight={700} fontSize={32} fill="#23305a">TOTAL PAY:</text>
    <text x={132} y={66} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={76} fill="#c8202a">$0.00</text>
    <ellipse cx={132} cy={42} rx={132} ry={62} fill="none" stroke="#c8202a" strokeWidth={9} transform="rotate(-6 132 42)" filter="url(#c0rugTinta)" />
    <ellipse cx={136} cy={46} rx={124} ry={56} fill="none" stroke="#c8202a" strokeWidth={4} transform="rotate(-3 132 42)" opacity={0.6} filter="url(#c0rugTinta)" />
    <line x1={-245} y1={120} x2={250} y2={114} stroke="#23305a" strokeWidth={3} opacity={0.5} />
    <line x1={20} y1={100} x2={20} y2={160} stroke="#23305a" strokeWidth={3} opacity={0.4} />
  </g>
);

export const Cuadro0: React.FC<{ t: number }> = ({ t }) => {
  if (t >= FIN_CUADRO0) return null;
  const k = interpolate(t, [0.9, 1.45], [0, 1], { ...cl, easing: (x) => x * x * (3 - 2 * x) });
  const s = 1 + k * 1.6;
  const cx = 444 + (801 - 444) * k, cy = 480 + (488 - 480) * k;
  const op = interpolate(t, [1.12, 1.5], [1, 0], cl);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, opacity: op }} width={1920} height={1080} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="c0cielo" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#122656" /><stop offset="0.45" stopColor="#2a5296" /><stop offset="1" stopColor="#1e4580" />
        </linearGradient>
        <radialGradient id="c0sol" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffdf2" stopOpacity={1} /><stop offset="0.2" stopColor="#fff0c8" stopOpacity={0.85} /><stop offset="0.5" stopColor="#ffd890" stopOpacity={0.3} /><stop offset="1" stopColor="#9cc4ff" stopOpacity={0} />
        </radialGradient>
        <Tex id="c0texPiel" bf="0.008 0.014" oct={2} seed={7} lo={0.55} hi={1.3} brillo={0.45} luz="#eaf2ff" az={225} />
        <filter id="c0suave" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={9} /></filter>
        <Tex id="c0texAgua" bf="0.004 0.03" oct={3} seed={4} lo={0.75} hi={1.2} brillo={0.7} luz="#cfe4ff" az={250} />
        <Tex id="c0texMadera" bf="0.003 0.11" oct={3} seed={9} lo={0.6} hi={1.15} />
        <Tex id="c0texPapel" bf="0.012" oct={5} seed={12} lo={0.7} hi={1.08} />
        <Rugoso id="c0rugEsp" bf={0.035} esc={34} seed={3} />
        <Rugoso id="c0rugNube" bf={0.025} esc={22} seed={5} />
        <Rugoso id="c0rugPapel" bf={0.05} esc={12} seed={8} />
        <Rugoso id="c0rugTinta" bf={0.08} esc={6} seed={11} />
        <filter id="c0bruma" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={40} /></filter>
      </defs>
      <g transform={`translate(${cx} ${cy}) scale(${s}) translate(-444 -480)`}>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#c0cielo)" />
        <circle cx={790} cy={120} r={320} fill="url(#c0sol)" />
        <Nubes t={t} />
        <circle cx={790} cy={120} r={160} fill="url(#c0sol)" />
        {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M 790 120 L ${790 + Math.cos(i * 0.6 - 0.8) * 760} ${120 + Math.sin(i * 0.6 - 0.8) * 760} L ${790 + Math.cos(i * 0.6 - 0.72) * 760} ${120 + Math.sin(i * 0.6 - 0.72) * 760} Z`} fill="#fff4d6" opacity={0.08} />)}
        <Ola y={440} amp={24} k={0.012} t={t} arriba="#3a74bc" abajo="#1f4c92" fase={0} id="c0o1" />
        <Ola y={520} amp={34} k={0.009} t={t} arriba="#3068b2" abajo="#1a4486" fase={1.4} id="c0o2" />
        <Salpicon t={t} />
        <Cola t={t} />
        <Espuma cx={1170} cy={650} w={700} h={170} n={100} seed={10} t={t} />
        <Ola y={650} amp={40} k={0.008} t={t} arriba="#2c62aa" abajo="#143a76" fase={2.6} id="c0o3" />
        <Espuma cx={240} cy={640} w={540} h={150} n={70} seed={200} t={t} />
        <Bote />
        <Chico t={t} />
        <Ola y={870} amp={36} k={0.01} t={t * 1.2} arriba="#2a5ea4" abajo="#102e66" fase={4.1} id="c0o4" />
        <Espuma cx={980} cy={860} w={560} h={120} n={54} seed={400} t={t} />
        <Espuma cx={110} cy={890} w={340} h={100} n={36} seed={460} t={t} />
        <Recibo />
        {Array.from({ length: 90 }, (_, i) => { const u = (t * 0.9 + rnd(i + 700)) % 1; return <ellipse key={i} cx={rnd(i + 710) * W} cy={rnd(i + 720) * H * 0.85 + u * 140} rx={2.5 + rnd(i + 730) * 3} ry={5 + rnd(i + 740) * 4} fill="#ffffff" opacity={0.8 * (1 - u)} />; })}
      </g>
    </svg>
  );
};
