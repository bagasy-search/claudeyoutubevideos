import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { K, Pal } from "./mundo";

// CUADRO 0 = la miniatura elegida (D:/rtmp/soot_ola/minis/soot03_elegida.png) rehecha en código, sin el texto ni la
// flecha, con su nivel de detalle: piedra con textura, medias tejidas, horda con cuerpo (cascos, lanzas, ojos que
// brillan), luz cálida de la antorcha contra el frío azul del valle, lluvia que salpica. En t=0 es la miniatura quieta;
// enseguida cobra vida (lluvia, goteo, llamas, ojos que parpadean, tirita) y la cámara empuja a la cara hasta fundirse
// con el primer plano del protagonista en el muro (P0 arranca justo ahí).
const pr = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const FIN = 1.3;
export const keysM: K[] = [];
export const ambM: [number, Pal][] = [];

// borde de arriba del muro de la derecha (sube desde el hombro del legionario y se pierde abajo a la derecha)
const yMuro = (x: number) => 585 + (x - 930) * 0.37;

// la horda: [x, pies y, escala]; atrás chiquitos en la niebla, adelante grandes asomando sobre el muro
const HORDA: [number, number, number][] = [];
for (let f = 0; f < 9; f++) {
  const n = 12 + f * 2, s = 0.16 + f * 0.075;
  for (let i = 0; i < n; i++) {
    const x = 1010 + ((i + rnd(f * 17 + i) * 0.8) / n) * 920;
    const y = 445 + f * 34 + (rnd(f * 31 + i) - 0.5) * 30 + (x - 1010) * 0.08;
    if (y - 140 * s > yMuro(x) - 10) continue; // tapado del todo por el muro
    HORDA.push([x, y, s * (0.85 + rnd(i * 3 + f) * 0.3)]);
  }
}
HORDA.push([1500, 830, 0.95], [1640, 880, 1.15], [1810, 930, 1.3], [1380, 770, 0.8], [1720, 860, 1.0], [1265, 720, 0.7]);
HORDA.sort((a, b) => a[2] - b[2]);

const Barbaro: React.FC<{ x: number; y: number; s: number; t: number; i: number }> = ({ x, y, s, t, i }) => {
  const parp = (t * 1.3 + rnd(i) * 10) % 3.3 < 0.11 && t > 0.05 ? 0.12 : 1;
  const brillo = 0.85 + 0.15 * Math.sin(t * 7 + i);
  const cuerno = i % 4 !== 1;
  const arma = i % 3;
  const c = "#0b1120", rim = "#4a6ea4";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* arma: lanza o hacha */}
      {arma === 0 && <><line x1={58} y1={-20} x2={70} y2={-330} stroke={c} strokeWidth={9} /><path d="M 70 -380 L 86 -326 L 56 -326 Z" fill="#2a3448" stroke={rim} strokeWidth={3} /></>}
      {arma === 1 && <><line x1={-62} y1={-40} x2={-80} y2={-260} stroke={c} strokeWidth={10} /><path d="M -80 -270 Q -130 -250 -126 -200 L -84 -214 Z" fill="#2a3448" stroke={rim} strokeWidth={3} /></>}
      {/* piernas y capa de piel */}
      <path d="M -34 0 L -26 -70 L -4 -70 L -8 0 Z M 34 0 L 26 -70 L 4 -70 L 8 0 Z" fill={c} />
      <path d="M -66 -40 Q -78 -150 -50 -190 Q 0 -214 50 -190 Q 78 -150 66 -40 Q 40 -24 30 -48 Q 18 -30 0 -46 Q -18 -30 -30 -48 Q -40 -24 -66 -40 Z" fill={c} />
      {Array.from({ length: 7 }, (_, k) => <path key={k} d={`M ${-60 + k * 20} -40 l 6 18 l 6 -18`} fill={c} />)}
      {/* brazos */}
      <path d="M -50 -180 Q -76 -120 -64 -60" stroke={c} strokeWidth={26} strokeLinecap="round" fill="none" />
      <path d="M 50 -180 Q 74 -120 60 -70" stroke={c} strokeWidth={26} strokeLinecap="round" fill="none" />
      {/* hombros con luz fría de borde */}
      <path d="M -52 -188 Q 0 -214 52 -188" stroke={rim} strokeWidth={6} fill="none" opacity={0.8} />
      {/* cabeza, barba, casco */}
      <path d="M -30 -196 Q -36 -250 0 -262 Q 36 -250 30 -196 Q 20 -170 0 -166 Q -20 -170 -30 -196 Z" fill={c} />
      <path d="M -28 -200 Q -30 -160 -10 -150 L 0 -140 L 10 -150 Q 30 -160 28 -200 Z" fill="#111827" />
      <path d="M -36 -236 Q 0 -284 36 -236 Z" fill="#141c2e" stroke={rim} strokeWidth={4} />
      {cuerno && <><path d="M -32 -244 Q -76 -262 -70 -312 Q -56 -276 -24 -258 Z" fill="#1e2638" stroke={rim} strokeWidth={3} /><path d="M 32 -244 Q 76 -262 70 -312 Q 56 -276 24 -258 Z" fill="#1e2638" stroke={rim} strokeWidth={3} /></>}
      {/* ojos que brillan */}
      <g transform={`translate(0 ${-218 * (1 - parp)}) scale(1 ${parp})`}>
        <circle cx={-13} cy={-218} r={22} fill="#ff6a10" opacity={0.8 * brillo} filter="url(#mglow)" />
        <circle cx={13} cy={-218} r={22} fill="#ff6a10" opacity={0.8 * brillo} filter="url(#mglow)" />
        <path d="M -24 -224 L -5 -219 L -8 -212 L -23 -215 Z" fill="#ffc04a" opacity={brillo} />
        <path d="M 24 -224 L 5 -219 L 8 -212 L 23 -215 Z" fill="#ffc04a" opacity={brillo} />
      </g>
    </g>
  );
};

const Llama: React.FC<{ x: number; y: number; s: number; t: number; i: number }> = ({ x, y, s, t, i }) => {
  const f = 1 + 0.12 * Math.sin(t * 22 + i) + 0.06 * Math.sin(t * 37 + i * 2);
  const ld = Math.sin(t * 13 + i) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-60} r={190} fill="#ff7a1a" opacity={0.22} filter="url(#mglow2)" />
      <g transform={`scale(${2 - f} ${f})`}>
        <path d={`M ${ld} -220 Q 70 -120 58 -40 Q 50 8 0 14 Q -50 8 -58 -40 Q -66 -110 -20 -150 Q -10 -100 6 -120 Q -4 -170 ${ld} -220 Z`} fill="#e8401a" />
        <path d={`M ${ld * 0.7} -170 Q 44 -96 38 -36 Q 32 4 0 8 Q -32 4 -38 -36 Q -40 -90 -8 -110 Q 0 -80 10 -96 Q 4 -130 ${ld * 0.7} -170 Z`} fill="#ff8f1f" />
        <path d="M 0 -110 Q 24 -60 20 -24 Q 16 2 0 4 Q -16 2 -20 -24 Q -22 -60 0 -110 Z" fill="#ffd95a" />
        <path d="M 0 -60 Q 10 -30 8 -10 Q 0 0 -8 -10 Q -10 -30 0 -60 Z" fill="#fff6c8" />
      </g>
    </g>
  );
};
const Nieve: React.FC<{ d: string }> = ({ d }) => <path d={d} fill="url(#mnieve)" stroke="#9fb8d6" strokeWidth={3} />;
// carámbanos colgando de un borde (x0..x1 a la altura y), con brillo
const Hielo: React.FC<{ x0: number; x1: number; y: number; n: number; l?: number; seed?: number }> = ({ x0, x1, y, n, l = 40, seed = 1 }) => (
  <>{Array.from({ length: n }, (_, i) => { const x = x0 + ((i + 0.5) / n) * (x1 - x0) + (rnd(i + seed * 7) - 0.5) * 10; const h = l * (0.4 + rnd(i * 13 + seed)); const w = 5 + rnd(i + seed) * 5; return <g key={i}><path d={`M ${x - w} ${y} L ${x + w} ${y} L ${x} ${y + h} Z`} fill="url(#mhielo)" /><path d={`M ${x - w * 0.4} ${y + 2} L ${x} ${y + h * 0.8}`} stroke="#fff" strokeWidth={2} opacity={0.7} /></g>; })}</>
);
// bloques de piedra con textura (para los muros)
const Bloques: React.FC<{ x: number; y: number; w: number; h: number; filas: number; cols: number; c1: string; c2: string; seed: number }> = ({ x, y, w, h, filas, cols, c1, c2, seed }) => {
  const bw = w / cols, bh = h / filas;
  return (
    <g filter="url(#mtex)">
      {Array.from({ length: filas }, (_, r) => Array.from({ length: cols + 1 }, (_, c) => {
        const k = r * 40 + c + seed;
        const bx = x + c * bw - (r % 2) * bw * 0.5 + 3, by = y + r * bh + 3;
        return <g key={k}><rect x={bx} y={by} width={bw - 6} height={bh - 6} rx={7} fill={rnd(k) > 0.5 ? c1 : c2} stroke="#12141e" strokeWidth={4} /><path d={`M ${bx + 6} ${by + bh - 12} L ${bx + 6} ${by + 6} L ${bx + bw - 14} ${by + 6}`} stroke="#9aa6c4" strokeWidth={3} fill="none" opacity={0.45} /></g>;
      }))}
    </g>
  );
};
const Media: React.FC<{ x: number; y: number; rot: number; t: number; flip?: boolean }> = ({ x, y, rot, t, flip }) => {
  const d = "M -54 0 L 54 0 L 58 210 Q 60 250 92 268 Q 128 290 112 330 Q 92 362 40 346 L -36 310 Q -66 292 -62 240 Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + Math.sin(t * 5) * 2}) scale(${flip ? -0.85 : 0.85} 0.85)`}>
      <path d={d} fill="#9c8670" />
      <path d={d} fill="url(#mpunto)" />
      <path d={d} fill="url(#msombra)" />
      <path d={d} fill="none" stroke="#3a2a20" strokeWidth={6} />
      {/* talón y punta más oscuros, puño acanalado */}
      <path d="M 40 280 Q 104 280 112 330 Q 96 356 46 342 Z" fill="#4e3e32" opacity={0.85} />
      {Array.from({ length: 9 }, (_, k) => <line key={k} x1={-50 + k * 12.5} y1={6} x2={-50 + k * 12.5} y2={46} stroke="#5a4a3c" strokeWidth={4} />)}
      {/* hielo arriba */}
      <path d="M -60 0 Q 0 -22 60 0 L 56 16 Q 0 4 -56 16 Z" fill="url(#mnieve)" />
      <Hielo x0={-54} x1={54} y={12} n={6} l={40} seed={rot + 3} />
      {/* agua que chorrea */}
      {[-30, 0, 34].map((xx, k) => <path key={k} d={`M ${xx} 230 Q ${xx - 4} 270 ${xx + 2} ${300 + k * 12}`} stroke="#bfe3ff" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.85} />)}
      {[0, 1, 2, 3, 4].map((k) => { const ph = ((t * 1.6 + k * 0.23 + (flip ? 0.13 : 0)) % 1); return <ellipse key={k} cx={-36 + k * 22} cy={310 + k * 10 + ph * 160} rx={6} ry={10} fill="#cdeaff" opacity={t > 0.04 ? 1 - ph : 1} />; })}
    </g>
  );
};
const Mano: React.FC<{ x: number; y: number; flip?: boolean }> = ({ x, y, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <ellipse cx={0} cy={10} rx={46} ry={40} fill="url(#mpiel)" />
    {[-30, -10, 10, 30].map((fx, k) => <rect key={k} x={fx - 10} y={-34 + Math.abs(fx) * 0.2} width={20} height={48} rx={10} fill="#f0b892" stroke="#c98a66" strokeWidth={3} />)}
    <path d="M -44 12 Q -64 -4 -54 -26" stroke="#e8ae88" strokeWidth={20} strokeLinecap="round" fill="none" />
    <path d="M -36 -10 L -24 -6 M -16 -14 L -4 -10" stroke="#fff" strokeWidth={4} opacity={0.6} />
  </g>
);
const Soldado: React.FC<{ t: number }> = ({ t }) => {
  const tir = t > 0.15 ? Math.sin(t * 34) * 1.6 : 0;
  const parp = t > 0.55 && t < 0.68 ? 0.1 : 1;
  const mir = Math.sin(t * 2) * 3;
  return (
    <g transform={`translate(${tir} 0)`}>
      {/* capa */}
      <path d="M 430 1080 L 450 760 Q 480 690 560 676 L 830 676 Q 900 690 925 760 L 950 1080 Z" fill="url(#mcapa)" />
      {[500, 560, 860, 910].map((x, k) => <path key={k} d={`M ${x} 760 Q ${x + (k < 2 ? -10 : 10)} 900 ${x + (k < 2 ? -20 : 20)} 1080`} stroke="#5e1014" strokeWidth={8} fill="none" opacity={0.6} />)}
      {/* túnica */}
      <path d="M 520 1080 L 532 700 Q 562 664 612 660 L 770 660 Q 820 664 842 700 L 860 1080 Z" fill="url(#mtunica)" />
      {[600, 690, 780].map((x, k) => <path key={k} d={`M ${x} 940 Q ${x + 6} 1010 ${x - 4} 1080`} stroke="#7a1418" strokeWidth={7} fill="none" opacity={0.7} />)}
      {/* brazos: manga roja corta y brazo desnudo con escarcha */}
      <path d="M 452 642 Q 404 600 362 548" stroke="url(#mpiel)" strokeWidth={52} strokeLinecap="round" fill="none" />
      <path d="M 902 650 Q 990 628 1062 588" stroke="url(#mpiel)" strokeWidth={52} strokeLinecap="round" fill="none" />
      <path d="M 440 628 Q 400 594 372 560" stroke="#b5d8f5" strokeWidth={9} strokeDasharray="14 18" strokeLinecap="round" fill="none" opacity={0.8} />
      <path d="M 920 636 Q 990 618 1046 590" stroke="#b5d8f5" strokeWidth={9} strokeDasharray="14 18" strokeLinecap="round" fill="none" opacity={0.8} />
      <path d="M 562 702 Q 502 682 456 646" stroke="#c8262c" strokeWidth={80} strokeLinecap="round" fill="none" />
      <path d="M 814 702 Q 860 682 898 652" stroke="#c8262c" strokeWidth={80} strokeLinecap="round" fill="none" />
      <path d="M 470 620 Q 510 640 540 660" stroke="#e4555a" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.7} />
      {/* lorica segmentada con brillos */}
      <path d="M 548 690 Q 690 676 828 690 L 842 906 Q 690 920 534 906 Z" fill="url(#mlorica)" stroke="#4e5464" strokeWidth={7} />
      {[738, 782, 826, 870].map((y) => <g key={y}><path d={`M 540 ${y} Q 690 ${y + 14} 838 ${y}`} stroke="#5e6474" strokeWidth={7} fill="none" /><path d={`M 548 ${y + 8} Q 690 ${y + 22} 830 ${y + 8}`} stroke="#eef2f8" strokeWidth={3} fill="none" opacity={0.7} /></g>)}
      <path d="M 536 694 Q 566 650 616 656 L 606 746 L 534 736 Z" fill="url(#mlorica)" stroke="#4e5464" strokeWidth={5} />
      <path d="M 840 694 Q 810 650 760 656 L 770 746 L 842 736 Z" fill="url(#mlorica)" stroke="#4e5464" strokeWidth={5} />
      {[[570, 700], [596, 722], [806, 700], [780, 722]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={5} fill="#e6b422" />)}
      <path d="M 604 664 L 566 900" stroke="#5a3218" strokeWidth={22} /><path d="M 774 664 L 814 900" stroke="#5a3218" strokeWidth={22} />
      <path d="M 604 664 L 566 900" stroke="#8a5a30" strokeWidth={6} /><path d="M 774 664 L 814 900" stroke="#8a5a30" strokeWidth={6} />
      {/* cinturón con tachas y hebilla */}
      <rect x={526} y={894} width={330} height={46} rx={10} fill="#5a3218" stroke="#2e180a" strokeWidth={5} />
      {Array.from({ length: 9 }, (_, k) => <circle key={k} cx={548 + k * 36} cy={917} r={7} fill="#d9a62a" stroke="#8a6414" strokeWidth={2} />)}
      <rect x={662} y={898} width={58} height={38} rx={8} fill="#e6b422" stroke="#8a6414" strokeWidth={4} />
      <Hielo x0={545} x1={835} y={938} n={10} l={46} seed={4} />
      {/* nieve en los hombros */}
      <path d="M 520 692 Q 560 664 616 664 Q 600 684 560 690 Z" fill="url(#mnieve)" /><path d="M 856 692 Q 816 664 760 664 Q 776 684 816 690 Z" fill="url(#mnieve)" />
      {/* cabeza: cara azul de frío, pelo bajo el casco */}
      <ellipse cx={520} cy={580} rx={24} ry={34} fill="#6f96e0" /><ellipse cx={836} cy={580} rx={24} ry={34} fill="#6f96e0" />
      <ellipse cx={678} cy={575} rx={152} ry={136} fill="url(#mcara)" />
      <path d="M 540 500 Q 560 470 600 480 Q 590 500 610 506 Q 640 480 676 492 Q 710 480 740 504 Q 760 486 800 490 Q 820 500 816 520 Q 790 500 760 516 Q 720 500 690 512 Q 650 500 620 516 Q 580 504 540 520 Z" fill="#6b3e22" />
      {/* escarcha en la cara */}
      {Array.from({ length: 26 }, (_, k) => { const a = rnd(k + 50) * Math.PI * 2, r = 90 + rnd(k + 80) * 50; return <circle key={k} cx={678 + Math.cos(a) * r} cy={590 + Math.sin(a) * r * 0.8} r={2 + rnd(k) * 4} fill="#eaf6ff" opacity={0.85} />; })}
      <ellipse cx={572} cy={632} rx={34} ry={22} fill="#f08aa8" opacity={0.75} /><ellipse cx={786} cy={632} rx={34} ry={22} fill="#f08aa8" opacity={0.75} />
      {/* ojos grandes asustados, mirando de reojo a la horda */}
      <g transform={`translate(0 ${566 * (1 - parp)}) scale(1 ${parp})`}>
        <ellipse cx={622} cy={566} rx={48} ry={56} fill="#fff" stroke="#24305a" strokeWidth={5} /><ellipse cx={738} cy={566} rx={48} ry={56} fill="#fff" stroke="#24305a" strokeWidth={5} />
        <circle cx={636 + mir} cy={574} r={28} fill="#3a2414" /><circle cx={752 + mir} cy={574} r={28} fill="#3a2414" />
        <circle cx={636 + mir} cy={574} r={17} fill="#0e0a10" /><circle cx={752 + mir} cy={574} r={17} fill="#0e0a10" />
        <circle cx={646 + mir} cy={560} r={10} fill="#fff" /><circle cx={762 + mir} cy={560} r={10} fill="#fff" />
        <circle cx={628 + mir} cy={586} r={4} fill="#fff" /><circle cx={744 + mir} cy={586} r={4} fill="#fff" />
        {/* lágrimas juntas en el borde de abajo */}
        <path d="M 580 600 Q 622 626 664 600" stroke="#cdeeff" strokeWidth={9} fill="none" /><path d="M 696 600 Q 738 626 780 600" stroke="#cdeeff" strokeWidth={9} fill="none" />
      </g>
      {/* cejas preocupadas */}
      <path d="M 576 506 Q 612 500 650 482" stroke="#4a2a16" strokeWidth={13} strokeLinecap="round" fill="none" /><path d="M 782 506 Q 746 500 708 482" stroke="#4a2a16" strokeWidth={13} strokeLinecap="round" fill="none" />
      {/* nariz roja */}
      <ellipse cx={682} cy={624} rx={18} ry={14} fill="#e87a96" /><circle cx={676} cy={618} r={5} fill="#fff" opacity={0.6} />
      {/* lágrimas que caen */}
      <path d="M 588 612 Q 580 660 592 690" stroke="#cfeaff" strokeWidth={13} strokeLinecap="round" fill="none" />
      <path d="M 772 612 Q 782 660 770 690" stroke="#cfeaff" strokeWidth={13} strokeLinecap="round" fill="none" />
      <ellipse cx={592} cy={698 + ((t * 2) % 1) * 40} rx={7} ry={10} fill="#cfeaff" opacity={1 - ((t * 2) % 1)} />
      {/* boca apretada con dientes y encías */}
      <path d="M 616 646 Q 682 632 748 646 Q 752 690 682 700 Q 612 690 616 646 Z" fill="#5a1430" />
      <path d="M 626 652 Q 682 640 738 652 L 736 686 Q 682 694 628 686 Z" fill="#fff" />
      {[650, 674, 698, 718].map((x) => <line key={x} x1={x} y1={646} x2={x} y2={690} stroke="#9aa6b4" strokeWidth={4} />)}
      <path d="M 628 669 Q 682 674 736 669" stroke="#9aa6b4" strokeWidth={4} fill="none" />
      {/* casco dorado con hielo */}
      <path d="M 498 530 Q 494 340 678 328 Q 862 340 858 530 L 832 530 Q 824 420 678 410 Q 532 420 524 530 Z" fill="url(#mcasco)" stroke="#7a5210" strokeWidth={8} />
      <path d="M 516 476 Q 678 432 840 476" stroke="#8a5e14" strokeWidth={12} fill="none" />
      <path d="M 516 470 Q 678 426 840 470" stroke="#ffe08a" strokeWidth={4} fill="none" opacity={0.8} />
      {[540, 600, 678, 756, 816].map((x, k) => <circle key={k} cx={x} cy={k === 2 ? 446 : 458 - Math.abs(k - 2) * 2} r={7} fill="#fff0b0" stroke="#8a5e14" strokeWidth={2} />)}
      <rect x={660} y={312} width={36} height={34} rx={8} fill="#c9922a" stroke="#7a5210" strokeWidth={5} />
      <path d="M 494 530 L 466 652 Q 498 664 522 610 L 526 530 Z" fill="url(#mcasco)" stroke="#7a5210" strokeWidth={6} />
      <path d="M 862 530 L 890 652 Q 858 664 834 610 L 830 530 Z" fill="url(#mcasco)" stroke="#7a5210" strokeWidth={6} />
      <circle cx={496} cy={590} r={6} fill="#fff0b0" /><circle cx={860} cy={590} r={6} fill="#fff0b0" />
      <path d="M 566 372 Q 640 342 700 344" stroke="#fffbe0" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.75} />
      <Hielo x0={504} x1={852} y={526} n={14} l={44} seed={9} />
      <path d="M 552 356 Q 678 314 806 356 Q 790 380 740 366 Q 680 346 620 368 Q 580 380 552 356 Z" fill="url(#mnieve)" />
    </g>
  );
};

export const Mini: React.FC<{ t: number }> = ({ t }) => {
  const push = pr(t, 0.25, FIN);
  const sc = 1 + push * 0.6;
  const op = 1 - pr(t, 1.0, 1.18);
  const wind = t * 1400;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(960 - 677) * push}px, ${(420 - 560) * push}px) scale(${sc})`, transformOrigin: "677px 560px" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="mcielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#081024" /><stop offset="0.35" stopColor="#173058" /><stop offset="0.6" stopColor="#2c4c7c" /><stop offset="1" stopColor="#1a2c4c" /></linearGradient>
            <radialGradient id="mluz" cx="0.82" cy="0.1" r="0.45"><stop offset="0" stopColor="#7fb6ff" stopOpacity="0.6" /><stop offset="1" stopColor="#7fb6ff" stopOpacity="0" /></radialGradient>
            <radialGradient id="mfuego" cx="0.05" cy="0.35" r="0.42"><stop offset="0" stopColor="#ff7a1a" stopOpacity="0.75" /><stop offset="0.5" stopColor="#ff5a10" stopOpacity="0.25" /><stop offset="1" stopColor="#ff5a10" stopOpacity="0" /></radialGradient>
            <linearGradient id="mnube" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f7fc0" /><stop offset="0.35" stopColor="#1e3660" /><stop offset="1" stopColor="#0e1a34" /></linearGradient>
            <linearGradient id="mvalle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a6a9a" /><stop offset="1" stopColor="#1c2c48" /></linearGradient>
            <linearGradient id="mniebla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8aa6cc" stopOpacity="0" /><stop offset="0.5" stopColor="#8aa6cc" stopOpacity="0.45" /><stop offset="1" stopColor="#8aa6cc" stopOpacity="0" /></linearGradient>
            <linearGradient id="mnieve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#b4cce6" /></linearGradient>
            <linearGradient id="mhielo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4fbff" /><stop offset="1" stopColor="#7fb2e0" /></linearGradient>
            <linearGradient id="mcapa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7a1418" /><stop offset="0.5" stopColor="#b8222a" /><stop offset="1" stopColor="#6a1014" /></linearGradient>
            <linearGradient id="mtunica" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8444a" /><stop offset="1" stopColor="#9a1a20" /></linearGradient>
            <linearGradient id="mlorica" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c8b0a0" /><stop offset="0.35" stopColor="#e6eaf0" /><stop offset="0.7" stopColor="#aab2c0" /><stop offset="1" stopColor="#6e7688" /></linearGradient>
            <radialGradient id="mcasco" cx="0.35" cy="0.25" r="0.8"><stop offset="0" stopColor="#ffe48a" /><stop offset="0.45" stopColor="#e2a42c" /><stop offset="1" stopColor="#9a6414" /></radialGradient>
            <radialGradient id="mcara" cx="0.4" cy="0.45" r="0.7"><stop offset="0" stopColor="#a8c8f8" /><stop offset="0.7" stopColor="#7aa0e8" /><stop offset="1" stopColor="#5a7cc8" /></radialGradient>
            <linearGradient id="mpiel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd0aa" /><stop offset="1" stopColor="#d8946e" /></linearGradient>
            <linearGradient id="msombra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffb070" stopOpacity="0.25" /><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.35" /></linearGradient>
            <linearGradient id="mpiedraF" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ff8a3a" stopOpacity="0.22" /><stop offset="0.5" stopColor="#ff8a3a" stopOpacity="0" /></linearGradient>
            {/* punto tejido de las medias: columnas de V */}
            <pattern id="mpunto" width={18} height={14} patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 9 11 L 18 0" stroke="#c4b098" strokeWidth={4} fill="none" />
              <path d="M 0 3 L 9 14 L 18 3" stroke="#54443a" strokeWidth={2} fill="none" />
              <circle cx={4} cy={9} r={1.2} fill="#d0c0b0" />
            </pattern>
            {/* textura de piedra: ruido que modula el color */}
            <filter id="mtex" x="0" y="0" width="1" height="1">
              <feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves={4} seed={4} result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.02  2.2 0 0 0 -0.75" result="manchas" />
              <feComposite in="manchas" in2="SourceGraphic" operator="in" result="m2" />
              <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="m2" /></feMerge>
            </filter>
            <filter id="mglow" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation={6} /></filter>
            <filter id="mglow2" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation={40} /></filter>
            <filter id="mbruma" x="-0.2" y="-0.5" width="1.4" height="2"><feGaussianBlur stdDeviation={18} /></filter>
            <clipPath id="mclipMuro"><path d={`M 900 ${yMuro(900)} L 1920 ${yMuro(1920)} L 1920 1080 L 900 1080 Z`} /></clipPath>
            <clipPath id="mclipIzq"><path d="M 0 360 L 300 410 L 310 720 L 0 720 Z" /></clipPath>
          </defs>
          {/* cielo de tormenta */}
          <rect width={1920} height={1080} fill="url(#mcielo)" />
          <rect width={1920} height={1080} fill="url(#mluz)" />
          {[[1020, 70, 300, 0], [1340, 40, 340, 1], [1680, 60, 320, 2], [1880, 140, 260, 3], [1180, 150, 260, 4], [1520, 170, 280, 5], [880, 160, 220, 6]].map(([x, y, r, i]) => (
            <g key={i} transform={`translate(${Math.sin(t * 0.5 + i) * 6} 0)`}>
              <ellipse cx={x} cy={y} rx={r} ry={r * 0.26} fill="url(#mnube)" opacity={0.9} filter="url(#mbruma)" />
              <ellipse cx={x - r * 0.4} cy={y - r * 0.06} rx={r * 0.5} ry={r * 0.16} fill="url(#mnube)" opacity={0.8} filter="url(#mbruma)" />
              <path d={`M ${x - r * 0.8} ${y - r * 0.12} Q ${x} ${y - r * 0.4} ${x + r * 0.8} ${y - r * 0.12}`} stroke="#8fc0ff" strokeWidth={6} fill="none" opacity={0.45} filter="url(#mglow)" />
            </g>
          ))}
          {/* montañas lejanas con borde de luz fría */}
          <path d="M 860 250 Q 980 150 1100 190 Q 1240 120 1380 170 Q 1520 110 1660 160 Q 1800 120 1920 150 L 1920 470 L 860 470 Z" fill="#3a5a88" />
          <path d="M 860 250 Q 980 150 1100 190 Q 1240 120 1380 170 Q 1520 110 1660 160 Q 1800 120 1920 150" stroke="#9cc4f4" strokeWidth={4} fill="none" opacity={0.6} />
          <path d="M 860 300 Q 1040 230 1220 270 Q 1420 220 1600 260 Q 1760 230 1920 250 L 1920 500 L 860 500 Z" fill="#2a4672" />
          <rect x={860} y={270} width={1060} height={120} fill="url(#mniebla)" filter="url(#mbruma)" />
          {/* muro lejano sobre la loma, con torre y fuegos */}
          <path d="M 960 340 L 1060 322 L 1240 330 L 1420 346 L 1420 362 L 1240 348 L 1060 342 L 960 360 Z" fill="#22324e" />
          <rect x={1060} y={282} width={56} height={62} fill="#22324e" /><path d="M 1056 282 h 64 l -6 -10 h -52 Z" fill="#2c3e5c" />
          {[[1088, 280], [1190, 330], [1300, 338], [990, 342]].map(([x, y], i) => <Llama key={i} x={x} y={y} s={0.1} t={t} i={i + 10} />)}
          {/* valle con bosque en la niebla */}
          <path d="M 860 380 Q 1300 350 1920 370 L 1920 960 L 860 620 Z" fill="url(#mvalle)" />
          {Array.from({ length: 260 }, (_, i) => {
            const x = 860 + rnd(i + 700) * 1080, y = 370 + rnd(i + 900) * 330;
            if (y - 20 > yMuro(x)) return null;
            const h = 22 + (y - 360) * 0.22, k = (y - 370) / 330;
            const col = k < 0.33 ? "#2c4468" : k < 0.66 ? "#203658" : "#162a48";
            return <path key={"q" + i} d={`M ${x} ${y - h} L ${x + h * 0.18} ${y - h * 0.6} L ${x + h * 0.1} ${y - h * 0.6} L ${x + h * 0.34} ${y} L ${x - h * 0.34} ${y} L ${x - h * 0.1} ${y - h * 0.6} L ${x - h * 0.18} ${y - h * 0.6} Z`} fill={col} />;
          })}
          {[[1350, 470, 560], [1600, 560, 640], [1250, 620, 520], [1750, 700, 400]].map(([x, y, r], i) => <ellipse key={i} cx={x + Math.sin(t + i) * 14} cy={y} rx={r} ry={46} fill="#7f9cc6" opacity={0.3} filter="url(#mbruma)" />)}
          {/* la horda */}
          {HORDA.map(([x, y, s], i) => <Barbaro key={i} x={x} y={y} s={s} t={t} i={i} />)}
          <ellipse cx={1500} cy={760} rx={600} ry={60} fill="#6f8cb8" opacity={0.22} filter="url(#mbruma)" />
          {/* el muro que se pierde a la derecha: cara de piedra con textura y almenas nevadas */}
          <path d={`M 900 ${yMuro(900)} L 1920 ${yMuro(1920)} L 1920 1080 L 900 1080 Z`} fill="#2a3044" />
          <g clipPath="url(#mclipMuro)">
            <g transform={`translate(900 ${yMuro(900)}) skewY(20.3)`}><Bloques x={0} y={0} w={1040} h={520} filas={9} cols={20} c1="#5a6480" c2="#48506a" seed={11} /></g>
            <rect x={900} y={0} width={1020} height={1080} fill="url(#mpiedraF)" />
          </g>
          {Array.from({ length: 15 }, (_, i) => {
            const x = 950 + i * 66, y = yMuro(x), w = 38 + i * 1.6, h = 40 + i * 1.8;
            return (
              <g key={i}>
                <rect x={x} y={y - h + 6} width={w} height={h} rx={4} fill="#525a72" stroke="#14161e" strokeWidth={4} filter="url(#mtex)" />
                <path d={`M ${x - 4} ${y - h + 10} Q ${x + w / 2} ${y - h - 10} ${x + w + 4} ${y - h + 10} Q ${x + w / 2} ${y - h + 2} ${x - 4} ${y - h + 14} Z`} fill="url(#mnieve)" />
                <Hielo x0={x} x1={x + w} y={y - h + 12} n={3} l={18 + i} seed={i + 30} />
              </g>
            );
          })}
          <Nieve d={`M 900 ${yMuro(900) - 6} L 1920 ${yMuro(1920) - 6} L 1920 ${yMuro(1920) + 14} L 900 ${yMuro(900) + 12} Z`} />
          {[[1180, 0.9], [1520, 1.1], [1850, 1.35]].map(([x, s], i) => { const y = yMuro(x); return <g key={i}><rect x={x - 4 * s} y={y - 110 * s} width={10 * s} height={100 * s} fill="#4a2e1a" /><path d={`M ${x - 18 * s} ${y - 120 * s} L ${x + 22 * s} ${y - 120 * s} L ${x + 14 * s} ${y - 100 * s} L ${x - 10 * s} ${y - 100 * s} Z`} fill="#2e1c10" /><Llama x={x + 2 * s} y={y - 118 * s} s={0.24 * s} t={t} i={i + 20} /><ellipse cx={x} cy={y + 40 * s} rx={110 * s} ry={70 * s} fill="#ff8a3a" opacity={0.22} filter="url(#mbruma)" /></g>; })}
          {/* resplandor de la antorcha (cálido) sobre todo el lado izquierdo */}
          <rect width={1920} height={1080} fill="url(#mfuego)" />
          {/* muro alto atrás, a la izquierda, con la canasta de fuego */}
          <path d="M 0 360 L 300 410 L 310 720 L 0 720 Z" fill="#2c2630" />
          <g clipPath="url(#mclipIzq)"><g transform="translate(0 360) skewY(9.5)"><Bloques x={0} y={0} w={310} h={380} filas={6} cols={3} c1="#5e5260" c2="#4c4250" seed={3} /></g></g>
          <path d="M 0 360 L 300 410 L 310 720 L 0 720 Z" fill="url(#mpiedraF)" />
          <Nieve d="M -10 352 Q 120 336 306 404 Q 266 428 150 404 Q 60 390 -10 396 Z" />
          <Hielo x0={0} x1={296} y={400} n={10} l={52} seed={7} />
          {/* canasta de hierro de la antorcha */}
          <path d="M 92 420 L 108 420 L 112 640 L 88 640 Z" fill="#3a2414" />
          <path d="M 30 360 L 170 360 L 150 440 L 50 440 Z" fill="#1e1410" stroke="#5a3a1e" strokeWidth={6} />
          {[48, 76, 100, 124, 152].map((x, k) => <line key={k} x1={x} y1={360} x2={x + (100 - x) * 0.25} y2={440} stroke="#5a3a1e" strokeWidth={6} />)}
          <path d="M 34 382 L 166 382" stroke="#7a4e26" strokeWidth={6} />
          <ellipse cx={100} cy={366} rx={66} ry={16} fill="#ff8a1a" />
          <Llama x={100} y={372} s={1.15} t={t} i={1} />
          {/* chispas y brasas */}
          {Array.from({ length: 22 }, (_, i) => { const k = (t * 0.9 + rnd(i)) % 1; return <circle key={i} cx={100 + (rnd(i + 5) - 0.5) * 160 + k * 60 + Math.sin(t * 8 + i) * 8} cy={330 - k * 300} r={2 + rnd(i) * 4} fill={i % 3 ? "#ffcf5a" : "#ff7a1a"} opacity={1 - k} />; })}
          {/* el legionario */}
          <Soldado t={t} />
          <Media x={350} y={538} rot={4} t={t} />
          <Media x={1062} y={596} rot={-4} t={t} flip />
          <Mano x={352} y={528} />
          <Mano x={1066} y={584} flip />
          {/* parapeto de adelante: bloques grandes nevados */}
          <path d="M 0 940 Q 200 910 420 930 Q 560 922 780 944 L 780 1080 L 0 1080 Z" fill="#2a2630" />
          <Bloques x={0} y={958} w={780} h={140} filas={1} cols={6} c1="#5a5060" c2="#4a4252" seed={21} />
          <rect x={0} y={940} width={780} height={140} fill="url(#mpiedraF)" />
          <Nieve d="M -10 950 Q 80 914 200 936 Q 300 914 420 934 Q 540 916 660 938 Q 730 930 790 956 Q 740 986 600 976 Q 420 986 260 978 Q 120 990 -10 988 Z" />
          <Hielo x0={0} x1={780} y={980} n={22} l={56} seed={5} />
          {/* lluvia con salpicaduras */}
          {Array.from({ length: 180 }, (_, i) => {
            const x0 = rnd(i) * 2400 - 240, y0 = rnd(i + 999) * 1080;
            const y = (y0 + wind) % 1180 - 50, x = x0 - ((y0 + wind) % 1180) * 0.18;
            return <line key={i} x1={x} y1={y} x2={x - 11} y2={y + 56} stroke="#c4daf4" strokeWidth={i % 4 ? 2.2 : 3.4} opacity={i % 4 ? 0.5 : 0.75} />;
          })}
          {Array.from({ length: 34 }, (_, i) => {
            const x = i < 12 ? 40 + rnd(i) * 720 : i < 26 ? 960 + rnd(i) * 940 : 560 + rnd(i) * 260;
            const y = i < 12 ? 940 : i < 26 ? yMuro(x) - 6 : 360;
            const k = (t * 2.4 + rnd(i + 40)) % 1;
            return <g key={"s" + i} opacity={1 - k}><path d={`M ${x - 14 * k - 4} ${y} Q ${x - 10 * k} ${y - 16 * k - 4} ${x - 4} ${y - 2}`} stroke="#d8ecff" strokeWidth={3} fill="none" /><path d={`M ${x + 4} ${y - 2} Q ${x + 10 * k} ${y - 16 * k - 4} ${x + 14 * k + 4} ${y}`} stroke="#d8ecff" strokeWidth={3} fill="none" /><ellipse cx={x} cy={y} rx={6 + 14 * k} ry={3} fill="none" stroke="#d8ecff" strokeWidth={2} /></g>;
          })}
          {/* gotas que rebotan en el casco */}
          {Array.from({ length: 12 }, (_, i) => { const k = (t * 3 + rnd(i + 60)) % 1; const x = 520 + rnd(i + 61) * 320; return <circle key={"h" + i} cx={x + (rnd(i) - 0.5) * 40 * k} cy={340 + rnd(i + 62) * 30 - 30 * k} r={3} fill="#e4f2ff" opacity={1 - k} />; })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
export const SM: React.FC<{ t: number }> = ({ t }) => (t > FIN ? null : <Mini t={t} />);
