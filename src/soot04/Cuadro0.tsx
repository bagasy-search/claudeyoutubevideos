import React from "react";
import { interpolate } from "remotion";
import { fontFamily } from "./kit";

// CUADRO 0 = la miniatura (soot04_elegida.png) rehecha en código, SIN el texto grande y SIN la flecha.
// Tormenta, cola de cachalote que sale del agua chorreando, el greenhand aterrado con el arpón en el bote
// y el recibo de $0.00. En 0-0,9 s la escena vive (olas, agua que cae, el chico tiembla); de 0,9 a 1,5 s la
// cámara empuja hasta la cara del chico y funde con su cara en el muelle de P0 (match cut de cara a cara).
// Coordenadas del dibujo = las de la miniatura (1672x941).
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const FIN_CUADRO0 = 1.5;
const W = 1672, H = 941;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// masas de nubes de tormenta: racimos opacos con borde de luz arriba
const Racimo: React.FC<{ x: number; y: number; w: number; seed: number; base: string; luz: string; t: number }> = ({ x, y, w, seed, base, luz, t }) => {
  const n = Math.round(w / 34);
  const cs = Array.from({ length: n }, (_, i) => ({ cx: x + (i / n) * w + (rnd(seed * 31 + i) - 0.5) * 30 + t * 9, cy: y - Math.sin((i / n) * Math.PI) * w * 0.12 + (rnd(seed * 31 + i + 40) - 0.5) * 30, r: 34 + rnd(seed * 31 + i + 80) * w * 0.09 }));
  return <g>
    {cs.map((c, i) => <circle key={`l${i}`} cx={c.cx} cy={c.cy - 9} r={c.r} fill={luz} />)}
    {cs.map((c, i) => <circle key={`b${i}`} cx={c.cx + 7} cy={c.cy + 7} r={c.r * 0.95} fill={base} />)}
  </g>;
};
const Nubes: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Racimo x={480} y={40} w={460} seed={5} base="#1e3468" luz="#4a70b4" t={t} />
    <Racimo x={-80} y={110} w={720} seed={1} base="#1a2f62" luz="#3a5ea2" t={t} />
    <Racimo x={1080} y={50} w={720} seed={2} base="#203a72" luz="#a6c4ea" t={t} />
    <Racimo x={-60} y={270} w={600} seed={4} base="#24427c" luz="#7fa2d6" t={t} />
    <Racimo x={1240} y={210} w={520} seed={3} base="#2a4a88" luz="#c8dcf4" t={t} />
    <Racimo x={1380} y={340} w={360} seed={6} base="#2e5090" luz="#dce8f8" t={t} />
    <Racimo x={-40} y={400} w={560} seed={7} base="#284a86" luz="#b4ccee" t={t} />
  </g>
);
const Ola: React.FC<{ y: number; amp: number; k: number; t: number; fill: string; fase: number; espuma?: boolean }> = ({ y, amp, k, t, fill, fase, espuma }) => {
  const pts: [number, number][] = [];
  for (let x = -40; x <= W + 40; x += 24) pts.push([x, y + Math.sin(x * k + fase + t * 2.4) * amp + Math.sin(x * k * 2.3 + fase * 2 - t * 1.7) * amp * 0.4]);
  const linea = pts.map((p) => `${p[0]},${p[1]}`).join(" L ");
  const d = `M -40 ${H + 20} L ${linea} L ${W + 40} ${H + 20} Z`;
  return (
    <g>
      <path d={d} fill={fill} />
      {espuma && <>
        <path d={`M ${linea}`} stroke="#eef6ff" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.9} />
        {pts.filter((_, i) => i % 3 === 0).map(([px, py], i) => <path key={i} d={`M ${px - 40} ${py + 6} q 30 -40 72 -10 q -30 4 -48 30 Z`} fill="#f4f9ff" opacity={0.88} />)}
        {Array.from({ length: 22 }, (_, i) => <path key={`v${i}`} d={`M ${rnd(i + y) * W} ${y + 34 + rnd(i + y + 1) * 70} q 40 -14 96 0`} stroke="#bcd6f4" strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />)}
      </>}
    </g>
  );
};
const Espuma: React.FC<{ cx: number; cy: number; w: number; h: number; n: number; seed: number; t: number }> = ({ cx, cy, w, h, n, seed, t }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(seed + i), b = rnd(seed + i + 500);
      return <circle key={i} cx={cx + (a - 0.5) * w + Math.sin(t * 3 + i) * 6} cy={cy + (b - 0.5) * h - Math.abs(Math.sin(t * 2 + i)) * 8} r={10 + rnd(seed + i + 900) * 34} fill={i % 4 ? "#f4f9ff" : "#cfe2f8"} />;
    })}
  </g>
);
// chorros de agua que suben a los costados de la cola + rocío
const Salpicon: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {Array.from({ length: 30 }, (_, i) => {
      const lado = i % 2 ? 1 : -1, x0 = 1150 + lado * (70 + rnd(i + 30) * 270), alto = 140 + rnd(i + 31) * 380;
      const x1 = x0 + lado * (30 + rnd(i + 32) * 130), y1 = 640 - alto - Math.sin(t * 4 + i) * 12;
      return <path key={i} d={`M ${x0 - 24} 650 Q ${x0 + lado * 10} ${640 - alto * 0.5} ${x1} ${y1} Q ${x0 + lado * 34} ${640 - alto * 0.45} ${x0 + 24} 650 Z`} fill="#f2f8ff" opacity={0.8} />;
    })}
    {Array.from({ length: 160 }, (_, i) => {
      const a = -Math.PI / 2 + (rnd(i + 70) - 0.5) * 2.8, d = 140 + rnd(i + 71) * 500 + ((t * 120 + rnd(i) * 60) % 60);
      return <circle key={`r${i}`} cx={1150 + Math.cos(a) * d} cy={650 + Math.sin(a) * d * 0.9} r={3 + rnd(i + 72) * 9} fill="#ffffff" opacity={0.9} />;
    })}
  </g>
);

const Cola: React.FC<{ t: number }> = ({ t }) => {
  const sube = -t * 18;
  // borde de fuga de cada aleta, de donde cae el agua
  const bordeIzq = (u: number) => [822 + (1040 - 822) * u, 50 + (400 - 50) * u] as const;
  const bordeDer = (u: number) => [1262 + (1650 - 1262) * u, 350 - (350 - 256) * u] as const;
  return (
    <g transform={`translate(0 ${sube})`}>
      <defs>
        <linearGradient id="c0cola" x1="0" x2="1" y1="0" y2="0.4">
          <stop offset="0" stopColor="#3e4f7e" /><stop offset="0.4" stopColor="#222d4c" /><stop offset="1" stopColor="#121a2e" />
        </linearGradient>
      </defs>
      {/* tronco grueso + aleta izquierda maciza (una sola forma) */}
      <path d="M 1020 700 C 1050 560 1060 460 1040 400 C 960 330 860 210 812 40 C 808 16 830 8 846 20 C 980 60 1130 130 1225 235 C 1250 330 1280 520 1330 700 Z" fill="url(#c0cola)" />
      {/* aleta derecha */}
      <path d="M 1222 232 C 1350 180 1520 168 1640 214 C 1668 226 1672 244 1655 252 C 1540 300 1360 320 1262 350 Z" fill="#1a2340" />
      <path d="M 1226 234 C 1350 186 1510 176 1630 216" stroke="#6a7eaa" strokeWidth={10} fill="none" opacity={0.55} />
      <path d="M 846 20 C 980 60 1130 130 1225 235" stroke="#8294c2" strokeWidth={12} fill="none" opacity={0.55} />
      <path d="M 1090 420 C 1090 520 1070 600 1050 690" stroke="#5a6c98" strokeWidth={14} fill="none" opacity={0.4} />
      {Array.from({ length: 70 }, (_, i) => <ellipse key={i} cx={860 + rnd(i + 300) * 560} cy={60 + rnd(i + 340) * 600} rx={5 + rnd(i) * 12} ry={3 + rnd(i + 1) * 8} fill={i % 3 ? "#0c1222" : "#4a5a86"} opacity={0.4} />)}
      {/* agua que cae del borde de las aletas: cortinas cortas de gotas */}
      {Array.from({ length: 40 }, (_, i) => {
        const [x0, y0] = i < 20 ? bordeIzq(rnd(i + 610)) : bordeDer(rnd(i + 620));
        const largo = 30 + rnd(i) * 90;
        return <g key={i}>
          <path d={`M ${x0 - 7} ${y0} Q ${x0} ${y0 + largo} ${x0 + 2} ${y0 + largo + 10} Q ${x0 + 7} ${y0 + largo * 0.5} ${x0 + 7} ${y0} Z`} fill="#e6f2ff" opacity={0.85} />
          {[0, 1, 2].map((j) => { const u = (t * 1.4 + rnd(i * 3 + j + 640)) % 1; return <ellipse key={j} cx={x0 + 2} cy={y0 + largo + 10 + u * 260} rx={5} ry={8} fill="#ffffff" opacity={0.95 * (1 - u)} />; })}
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
      {/* piernas: la de adelante flexionada hacia el centro del bote */}
      <path d="M 410 690 L 372 850 L 440 868 L 478 716 Z" fill="#1c2340" />
      <path d="M 498 690 L 568 830 L 626 800 L 560 686 Z" fill="#1c2340" />
      <path d="M 366 846 L 440 864 L 444 884 L 356 870 Z" fill="#3a2418" />
      <path d="M 566 828 L 628 798 L 640 814 L 572 848 Z" fill="#3a2418" />
      {/* torso con rayas, girado 3/4 */}
      <g transform="rotate(-8 480 630)">
        <clipPath id="c0torso"><rect x={372} y={560} width={220} height={140} rx={50} /></clipPath>
        <rect x={372} y={560} width={220} height={140} rx={50} fill="#f4f4f4" />
        <g clipPath="url(#c0torso)">{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={360} y={572 + i * 24} width={250} height={11} fill="#2c3f80" />)}</g>
        <rect x={408} y={560} width={14} height={140} fill="#1c2340" /><rect x={540} y={560} width={14} height={140} fill="#1c2340" />
        <rect x={372} y={680} width={220} height={22} rx={8} fill="#6a3e1e" />
        <rect x={468} y={678} width={34} height={26} rx={5} fill="#d8a63a" stroke="#8a6420" strokeWidth={4} />
      </g>
      {/* brazo de atrás */}
      <path d="M 392 610 Q 376 660 440 672" stroke="#f4f4f4" strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d="M 392 610 Q 376 660 440 672" stroke="#2c3f80" strokeWidth={46} fill="none" strokeDasharray="10 14" opacity={0.85} />
      {/* cabeza */}
      <ellipse cx={444} cy={472} rx={100} ry={98} fill="#f7caa2" />
      <ellipse cx={350} cy={486} rx={18} ry={26} fill="#eeb48e" />
      {/* pelo bajo el gorro */}
      <path d="M 344 452 Q 330 520 358 552 Q 352 500 372 468 Z" fill="#9a5426" />
      <path d="M 532 448 Q 556 476 544 516 Q 534 482 518 466 Z" fill="#9a5426" />
      <path d="M 360 438 Q 392 470 420 440 Q 446 474 476 438 Q 504 466 532 436 L 540 424 L 350 430 Z" fill="#a45c2a" />
      {/* gorro con vuelta acanalada */}
      <path d="M 336 440 Q 326 318 444 308 Q 560 304 562 424 Z" fill="#26407f" />
      {Array.from({ length: 7 }, (_, i) => <path key={`g${i}`} d={`M ${364 + i * 30} 326 Q ${368 + i * 30} 370 ${364 + i * 30} 414`} stroke="#1a2e64" strokeWidth={5} fill="none" opacity={0.6} />)}
      <path d="M 326 418 Q 444 384 570 412 L 574 452 Q 444 422 330 460 Z" fill="#1f3570" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={336 + i * 20} y1={420 - Math.sin((i / 11) * Math.PI) * 14} x2={337 + i * 20} y2={452 - Math.sin((i / 11) * Math.PI) * 10} stroke="#142656" strokeWidth={4} />)}
      {/* cejas de susto, levantadas */}
      <path d="M 384 452 Q 402 430 430 440" stroke="#7a3e1a" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M 470 434 Q 494 420 520 432" stroke="#7a3e1a" strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* ojos enormes mirando a la ballena (derecha) */}
      <g transform={`translate(0 ${(1 - parpadeo) * 10}) scale(1 ${parpadeo})`} style={{ transformOrigin: "450px 484px" }}>
        <ellipse cx={410} cy={486} rx={31} ry={36} fill="#fff" stroke="#4a2a1c" strokeWidth={2.5} />
        <ellipse cx={490} cy={480} rx={30} ry={35} fill="#fff" stroke="#4a2a1c" strokeWidth={2.5} />
        <circle cx={422} cy={482} r={19} fill="#6a3c1e" /><circle cx={502} cy={476} r={19} fill="#6a3c1e" />
        <circle cx={424} cy={482} r={11} fill="#120a08" /><circle cx={504} cy={476} r={11} fill="#120a08" />
        <circle cx={430} cy={474} r={6} fill="#fff" /><circle cx={510} cy={468} r={6} fill="#fff" />
      </g>
      <path d="M 452 500 q 6 14 -4 20" stroke="#d89a76" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* cachetes */}
      <ellipse cx={382} cy={530} rx={20} ry={12} fill="#f08a8a" opacity={0.6} />
      <ellipse cx={522} cy={522} rx={18} ry={11} fill="#f08a8a" opacity={0.6} />
      {/* boca gritando */}
      <path d="M 422 536 Q 456 522 486 536 Q 494 578 456 584 Q 418 582 422 536 Z" fill="#6a1a1c" />
      <path d="M 424 538 Q 456 526 484 538 L 482 548 Q 456 538 426 550 Z" fill="#fff" />
      <ellipse cx={456} cy={572} rx={20} ry={9} fill="#e0606e" />
      {/* gotas de sudor */}
      <path d={`M 366 ${452 + gota * 30} q -10 18 0 26 q 10 -8 0 -26 Z`} fill="#8cc8ff" opacity={1 - gota * 0.6} />
      <path d={`M 380 ${512 + gota * 20} q -8 14 0 20 q 8 -6 0 -20 Z`} fill="#8cc8ff" />
      <path d="M 532 506 q -9 16 0 23 q 9 -7 0 -23 Z" fill="#8cc8ff" />
      {/* arpón */}
      <line x1={332} y1={790} x2={815} y2={350} stroke="#7a4622" strokeWidth={18} strokeLinecap="round" />
      <line x1={332} y1={784} x2={812} y2={344} stroke="#b07440" strokeWidth={5} strokeLinecap="round" />
      <path d="M 866 300 L 760 344 L 800 362 L 822 404 Z" fill="#3a3c46" />
      <path d="M 866 300 L 800 362 L 822 404 Z" fill="#5a5e6c" />
      {[0, 1, 2].map((i) => <line key={i} x1={786 - i * 8} y1={364 + i * 8} x2={808 - i * 8} y2={386 + i * 8} stroke="#c8a070" strokeWidth={6} />)}
      {/* soga */}
      <path d={`M 790 380 Q ${740 + Math.sin(t * 3) * 10} 520 690 600 Q 650 660 690 720`} stroke="#c8a070" strokeWidth={6} fill="none" />
      {/* brazo de adelante y manos */}
      <path d="M 560 600 Q 600 560 636 528" stroke="#f4f4f4" strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d="M 560 600 Q 600 560 636 528" stroke="#2c3f80" strokeWidth={46} fill="none" strokeDasharray="10 14" opacity={0.85} />
      <circle cx={640} cy={528} r={30} fill="#f7caa2" stroke="#d29a76" strokeWidth={3} />
      <circle cx={452} cy={672} r={30} fill="#f7caa2" stroke="#d29a76" strokeWidth={3} />
    </g>
  );
};

const Bote: React.FC = () => (
  <g>
    <path d="M 90 664 Q 500 636 930 770 L 860 941 L 30 941 Q 50 800 90 664 Z" fill="#6a3e1e" />
    <path d="M 124 690 Q 500 664 886 778 L 846 834 Q 500 736 146 760 Z" fill="#9a6634" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${80 - i * 10} ${790 + i * 40} Q 480 ${770 + i * 40} ${880 - i * 8} ${838 + i * 30}`} stroke="#4a2a12" strokeWidth={5} fill="none" />)}
    <path d="M 90 664 Q 500 636 930 770" stroke="#b47c42" strokeWidth={18} fill="none" strokeLinecap="round" />
    <path d="M 90 664 Q 500 636 930 770" stroke="#5a3418" strokeWidth={4} fill="none" transform="translate(0 10)" />
    {/* barril */}
    <rect x={200} y={676} width={134} height={96} rx={24} fill="#8a5a2e" />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={226 + i * 28} y1={680} x2={226 + i * 28} y2={768} stroke="#6a3e1e" strokeWidth={3} />)}
    <rect x={200} y={690} width={134} height={10} fill="#4a4e58" /><rect x={200} y={746} width={134} height={10} fill="#4a4e58" />
    {/* sogas enrolladas */}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={760} cy={772 - i * 8} rx={70 - i * 8} ry={18} fill="none" stroke="#c8a070" strokeWidth={8} />)}
    <path d="M 130 700 Q 170 740 150 800" stroke="#c8a070" strokeWidth={7} fill="none" />
  </g>
);

const Recibo: React.FC = () => (
  <g transform="translate(1390 770) rotate(-9)">
    <path d="M -270 -160 L 260 -175 L 275 150 L -255 168 Z" fill="#efdcae" stroke="#b8945c" strokeWidth={5} />
    <path d="M -262 -150 L 252 -165 L 265 140 L -247 158 Z" fill="none" stroke="#c9a874" strokeWidth={3} opacity={0.6} />
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-220 + rnd(i + 40) * 460} cy={-120 + rnd(i + 44) * 260} r={8 + rnd(i) * 22} fill="#b8935a" opacity={0.22} />)}
    <g transform="translate(-205 -70)" stroke="#23305a" strokeWidth={7} fill="none" strokeLinecap="round">
      <circle cx={0} cy={-26} r={9} /><line x1={0} y1={-17} x2={0} y2={30} /><line x1={-16} y1={-6} x2={16} y2={-6} /><path d="M -26 14 Q 0 44 26 14" />
    </g>
    <text x={40} y={-80} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={62} fill="#23305a">PAY SLIP</text>
    <line x1={-150} y1={-46} x2={240} y2={-50} stroke="#23305a" strokeWidth={6} />
    <line x1={-245} y1={-14} x2={240} y2={-20} stroke="#23305a" strokeWidth={3} opacity={0.5} />
    <text x={-236} y={80} fontFamily={fontFamily} fontWeight={700} fontSize={32} fill="#23305a">TOTAL PAY:</text>
    <text x={132} y={66} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={76} fill="#c8202a">$0.00</text>
    <ellipse cx={132} cy={42} rx={132} ry={62} fill="none" stroke="#c8202a" strokeWidth={9} transform="rotate(-6 132 42)" />
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
          <stop offset="0" stopColor="#14295a" /><stop offset="0.45" stopColor="#2a5296" /><stop offset="1" stopColor="#1e4580" />
        </linearGradient>
        <radialGradient id="c0sol" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity={1} /><stop offset="0.25" stopColor="#e6f0ff" stopOpacity={0.75} /><stop offset="1" stopColor="#9cc4ff" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="c0mar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1f4c92" /><stop offset="1" stopColor="#0c2456" />
        </linearGradient>
      </defs>
      <g transform={`translate(${cx} ${cy}) scale(${s}) translate(-444 -480)`}>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#c0cielo)" />
        <circle cx={790} cy={120} r={300} fill="url(#c0sol)" />
        <Nubes t={t} />
        <circle cx={790} cy={120} r={150} fill="url(#c0sol)" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M 790 120 L ${790 + Math.cos(i * 0.7 - 0.6) * 700} ${120 + Math.sin(i * 0.7 - 0.6) * 700} L ${790 + Math.cos(i * 0.7 - 0.5) * 700} ${120 + Math.sin(i * 0.7 - 0.5) * 700} Z`} fill="#ffffff" opacity={0.07} />)}
        <Ola y={440} amp={24} k={0.012} t={t} fill="url(#c0mar)" fase={0} espuma />
        <Ola y={520} amp={34} k={0.009} t={t} fill="#1a4486" fase={1.4} espuma />
        <Salpicon t={t} />
        <Cola t={t} />
        <Espuma cx={1170} cy={650} w={680} h={170} n={90} seed={10} t={t} />
        <Ola y={650} amp={40} k={0.008} t={t} fill="#143a76" fase={2.6} espuma />
        <Espuma cx={240} cy={640} w={520} h={150} n={60} seed={200} t={t} />
        <Bote />
        <Chico t={t} />
        <Ola y={870} amp={36} k={0.01} t={t * 1.2} fill="#102e66" fase={4.1} espuma />
        <Espuma cx={980} cy={860} w={540} h={120} n={46} seed={400} t={t} />
        <Espuma cx={110} cy={890} w={320} h={100} n={30} seed={460} t={t} />
        <Recibo />
        {Array.from({ length: 70 }, (_, i) => { const u = (t * 0.9 + rnd(i + 700)) % 1; return <ellipse key={i} cx={rnd(i + 710) * W} cy={rnd(i + 720) * H * 0.85 + u * 140} rx={4} ry={7} fill="#ffffff" opacity={0.75 * (1 - u)} />; })}
      </g>
    </svg>
  );
};
