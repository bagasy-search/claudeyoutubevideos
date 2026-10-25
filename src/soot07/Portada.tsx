import React from "react";

// Cuadro 0 = la miniatura elegida (sin el texto ni la flecha), rehecha en SVG puro, que cobra vida:
// el chorro cae, los caballos galopan, la llama tiembla, la cámara empuja; en "pot" el chorro salpica
// la lente y el manchón abre al mundo lateral del gancho (que ya viene corriendo debajo).
// Coordenadas en el espacio de la miniatura (1672x941), escaladas a 1920x1080.
const SC = 1920 / 1672;
export const PORTADA_FIN = 2.9;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const rr = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Antorcha: React.FC<{ x: number; y: number; s?: number; t: number; k: number }> = ({ x, y, s = 1, t, k }) => {
  const f = 1 + Math.sin(t * 17 + k) * 0.08 + Math.sin(t * 7.3 + k * 2) * 0.06;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-30} r={170} fill="url(#pGlow)" opacity={0.8} />
      <path d="M -4 0 L -40 40 M -40 40 L -40 70" stroke="#2a1a12" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M -16 -6 L 16 -6 L 10 22 L -10 22 Z" fill="#3a2418" />
      <g transform={`scale(${f} ${f * (1 + Math.sin(t * 11 + k) * 0.05)})`}>
        <path d="M 0 -78 C 20 -50 26 -30 18 -12 C 10 0 -10 0 -18 -12 C -26 -30 -14 -50 0 -78 Z" fill="#ff8a1e" />
        <path d="M 0 -56 C 12 -38 14 -24 9 -14 C 4 -6 -4 -6 -9 -14 C -14 -24 -8 -38 0 -56 Z" fill="#ffd34a" />
        <path d="M 0 -36 C 5 -26 6 -20 3 -15 C 1 -12 -1 -12 -3 -15 C -6 -20 -5 -26 0 -36 Z" fill="#fff6c8" />
      </g>
    </g>
  );
};

// caballo de frente-tres-cuartos a galope (como en la miniatura): cabeza larga, crin al viento, arnés dorado
const Caballo: React.FC<{ x: number; y: number; s: number; t: number; k: number }> = ({ x, y, s, t, k }) => {
  const g = t * 12 + k;
  const bob = Math.sin(g) * 8;
  const up = (Math.sin(g) + 1) / 2;
  const crin = (i: number) => Math.sin(g * 0.8 + i) * 10;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      {/* cuerpo que se aleja */}
      <ellipse cx={70} cy={20} rx={78} ry={56} fill="#3a1e12" />
      <ellipse cx={62} cy={12} rx={66} ry={44} fill="#5a2e1a" />
      {/* pata trasera */}
      <path d={`M 100 50 Q 120 110 ${110 + up * 20} 170`} stroke="#3a1e12" strokeWidth={26} strokeLinecap="round" fill="none" />
      {/* pecho */}
      <ellipse cx={0} cy={50} rx={74} ry={66} fill="#7a4226" />
      <ellipse cx={-18} cy={38} rx={40} ry={36} fill="#94552e" opacity={0.7} />
      {/* patas delanteras: una en el aire doblada, otra apoyando */}
      <path d={`M -32 90 Q ${-70 - up * 10} ${130 - up * 30} ${-40 + up * 6} ${170 - up * 46}`} stroke="#6a3820" strokeWidth={28} strokeLinecap="round" fill="none" />
      <ellipse cx={-40 + up * 6} cy={180 - up * 46} rx={20} ry={13} fill="#1a0f0a" />
      <path d={`M 34 92 Q ${40} 150 ${36 - up * 10} ${208 - (1 - up) * 30}`} stroke="#5a2e1a" strokeWidth={28} strokeLinecap="round" fill="none" />
      <ellipse cx={36 - up * 10} cy={216 - (1 - up) * 30} rx={20} ry={13} fill="#1a0f0a" />
      {/* arnés del pecho */}
      <path d="M -70 30 Q 0 90 74 30" stroke="#7a4a1a" strokeWidth={16} fill="none" />
      <path d="M -70 30 Q 0 90 74 30" stroke="#e0a83a" strokeWidth={5} fill="none" />
      <circle cx={0} cy={66} r={20} fill="#f0bf48" stroke="#8a5a1a" strokeWidth={5} />
      <circle cx={-4} cy={62} r={6} fill="#fff2b0" />
      {/* cuello */}
      <path d="M -50 10 Q -50 -70 -20 -110 L 40 -100 Q 50 -40 50 20 Z" fill="#6a3820" />
      {/* crin al viento */}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-10 + i * 6} ${-150 + i * 26} Q ${-70 - i * 8} ${-130 + i * 26 + crin(i)} ${-110 - i * 6} ${-100 + i * 30 + crin(i + 1)}`} stroke="#1a0c06" strokeWidth={22 - i * 2} strokeLinecap="round" fill="none" />)}
      {/* cabeza larga */}
      <path d="M -30 -150 Q 0 -178 32 -150 Q 44 -100 40 -40 Q 34 -4 4 -2 Q -28 -4 -34 -40 Q -40 -100 -30 -150 Z" fill="#7a4226" />
      <path d="M -6 -160 Q 8 -110 6 -60" stroke="#94552e" strokeWidth={14} fill="none" opacity={0.7} />
      <path d="M -30 -60 Q -36 -10 3 -4 Q 40 -10 34 -60 Q 3 -70 -30 -60 Z" fill="#a8684a" />
      <path d="M -18 -40 Q -12 -30 -8 -40 M 14 -40 Q 18 -30 24 -40" stroke="#2a140a" strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d={`M -18 -6 Q 3 ${10 + up * 8} 24 -6 Z`} fill="#5a1010" />
      <path d="M -14 -6 L 20 -6 L 18 0 L -12 0 Z" fill="#fff" />
      {/* ojos asustados a los costados */}
      <ellipse cx={-26} cy={-112} rx={18} ry={22} fill="#fff" stroke="#2a140a" strokeWidth={3} />
      <ellipse cx={32} cy={-112} rx={18} ry={22} fill="#fff" stroke="#2a140a" strokeWidth={3} />
      <circle cx={-22} cy={-108} r={9} fill="#140a06" />
      <circle cx={36} cy={-108} r={9} fill="#140a06" />
      <path d="M -44 -140 L -10 -128 M 50 -140 L 16 -128" stroke="#2a140a" strokeWidth={6} strokeLinecap="round" />
      {/* orejas y mechón */}
      <path d="M -26 -156 L -40 -204 L -8 -166 Z M 26 -158 L 38 -206 L 10 -168 Z" fill="#5a2e1a" />
      <path d="M -10 -170 Q -30 -150 -20 -130 Q 0 -150 10 -172 Z" fill="#1a0c06" />
      {/* cabezada dorada */}
      <path d="M -38 -136 L 44 -136 M -36 -52 L 42 -52" stroke="#7a4a1a" strokeWidth={10} />
      <path d="M -38 -136 L 44 -136 M -36 -52 L 42 -52" stroke="#e0a83a" strokeWidth={4} />
      <circle cx={-38} cy={-52} r={10} fill="#f0bf48" />
      <circle cx={42} cy={-52} r={10} fill="#f0bf48" />
    </g>
  );
};

const Nene: React.FC<{ t: number }> = ({ t }) => {
  const bob = Math.abs(Math.sin(t * 9)) * -10;
  const pie = Math.sin(t * 9) * 10;
  return (
    <g transform={`translate(40 ${bob}) rotate(-7 960 880)`}>
      <ellipse cx={940} cy={905} rx={150} ry={26} fill="#0a0506" opacity={0.55} />
      {/* piernas y sandalias */}
      <g transform="translate(0 22)">
      <g transform={`rotate(${22 + pie} 900 780)`}>
        <rect x={872} y={770} width={44} height={110} rx={18} fill="#f2c39a" />
        <path d="M 872 790 L 916 800 M 872 815 L 916 825 M 872 840 L 916 850" stroke="#6a3a1c" strokeWidth={7} />
        <ellipse cx={880} cy={882} rx={48} ry={20} fill="#6a3a1c" transform="rotate(-22 880 882)" />
      </g>
      <g transform={`rotate(${-30 - pie} 960 790)`}>
        <rect x={940} y={780} width={44} height={108} rx={18} fill="#eab58c" />
        <path d="M 940 800 L 984 810 M 940 828 L 984 838 M 940 856 L 984 866" stroke="#6a3a1c" strokeWidth={7} />
        <ellipse cx={968} cy={892} rx={46} ry={20} fill="#5a2e14" />
      </g>
      </g>
      <g transform="translate(0 40)">
      {/* túnica */}
      <path d="M 860 600 Q 950 560 1040 600 L 1060 800 Q 960 830 840 800 Z" fill="#f6f1e6" />
      <path d="M 860 600 Q 950 560 1040 600 L 1050 680 Q 950 660 852 690 Z" fill="#fffaf0" />
      <path d="M 845 760 Q 950 790 1060 760 L 1060 800 Q 960 830 840 800 Z" fill="#e6dcc8" />
      {/* faja roja + manto */}
      <path d="M 1030 590 Q 960 680 880 790 L 820 780 Q 760 760 735 760 Q 790 720 860 700 Q 930 650 990 585 Z" fill="#d6262b" />
      <path d="M 1030 590 Q 1000 640 960 690 L 940 680 Q 975 640 1000 588 Z" fill="#a8161b" />
      <rect x={880} y={705} width={160} height={20} rx={6} fill="#6a3a1c" />
      <circle cx={960} cy={715} r={16} fill="#e7b23a" stroke="#8a5a1a" strokeWidth={4} />
      {/* manchas del chorro en la ropa */}
      <ellipse cx={985} cy={630} rx={24} ry={14} fill="#c89a4a" />
      <ellipse cx={940} cy={600} rx={14} ry={9} fill="#b8863a" />
      {/* brazo izquierdo levantado, mano abierta */}
      <path d="M 880 610 Q 830 590 800 560" stroke="#f2c39a" strokeWidth={40} strokeLinecap="round" fill="none" />
      <g transform="translate(790 548) rotate(-30)">
        <ellipse cx={0} cy={0} rx={34} ry={30} fill="#f6c9a0" />
        {[-26, -12, 4, 18].map((a, i) => <rect key={i} x={a - 6} y={-64} width={13} height={48} rx={7} fill="#f6c9a0" />)}
        <rect x={26} y={-26} width={36} height={13} rx={7} fill="#f6c9a0" />
      </g>
      {/* brazo derecho con la lamparita */}
      <path d="M 1030 620 Q 1100 660 1170 640" stroke="#f2c39a" strokeWidth={38} strokeLinecap="round" fill="none" />
      <circle cx={1180} cy={636} r={22} fill="#f6c9a0" />
      <path d="M 1140 620 Q 1185 660 1235 620 Z" fill="#7a4220" />
      <circle cx={1200} cy={580} r={110} fill="url(#pGlow)" opacity={0.8} />
      <g transform={`translate(1205 612) scale(${1 + Math.sin(t * 19) * 0.08})`}>
        <path d="M 0 -64 C 16 -40 20 -22 12 -10 C 6 0 -6 0 -12 -10 C -20 -22 -14 -40 0 -64 Z" fill="#ff9a22" />
        <path d="M 0 -42 C 8 -28 9 -18 5 -10 C 2 -6 -2 -6 -5 -10 C -9 -18 -7 -28 0 -42 Z" fill="#fff2b0" />
      </g>
      {/* cabeza */}
      <circle cx={955} cy={500} r={95} fill="#f6c9a0" />
      <ellipse cx={870} cy={512} rx={18} ry={26} fill="#eab58c" />
      {/* casco dorado */}
      <path d="M 845 470 Q 850 345 960 340 Q 1070 345 1070 470 Q 1010 430 955 432 Q 900 432 845 470 Z" fill="#e0a92e" />
      <path d="M 860 440 Q 880 365 960 360 Q 1000 362 1030 380 Q 960 380 900 450 Z" fill="#f5cf5a" opacity={0.8} />
      <path d="M 840 470 Q 955 420 1075 470 L 1078 492 Q 955 448 838 492 Z" fill="#b8821e" />
      <path d="M 955 340 L 955 300" stroke="#b8821e" strokeWidth={14} />
      {/* lo que le cayó encima (sopa sobre el casco) */}
      <path d="M 870 400 Q 900 345 955 340 Q 1020 342 1050 400 Q 1030 380 1010 400 Q 990 375 965 395 Q 940 372 915 398 Q 895 378 870 400 Z" fill="#7a4a22" />
      <path d="M 935 342 Q 945 320 965 330 Q 970 345 950 350 Z" fill="#4c8a2e" />
      <path d="M 850 430 Q 845 470 858 480 Q 870 470 866 430 Z M 1040 420 Q 1060 470 1050 492 Q 1036 470 1030 420 Z M 960 430 Q 958 470 968 476 Q 978 468 972 430 Z" fill="#7a4a22" />
      <path d="M 880 390 Q 955 330 1040 390 Q 1000 370 960 372 Q 920 372 880 390 Z" fill="#e8c890" />
      <ellipse cx={905} cy={420} rx={10} ry={18} fill="#7a4a22" />
      <ellipse cx={1030} cy={415} rx={8} ry={20} fill="#7a4a22" />
      {/* cara asustada */}
      <ellipse cx={915} cy={500} rx={30} ry={34} fill="#fff" />
      <ellipse cx={995} cy={496} rx={34} ry={38} fill="#fff" />
      <circle cx={925} cy={502} r={13} fill="#120a08" />
      <circle cx={1003} cy={498} r={14} fill="#120a08" />
      <circle cx={929} cy={497} r={4} fill="#fff" />
      <circle cx={1008} cy={492} r={4} fill="#fff" />
      <path d="M 888 448 Q 910 444 936 430 M 974 428 Q 1000 440 1026 444" stroke="#6a3a1c" strokeWidth={7} strokeLinecap="round" fill="none" />
      <ellipse cx={890} cy={548} rx={16} ry={9} fill="#f39a8a" opacity={0.7} />
      <ellipse cx={1040} cy={545} rx={16} ry={9} fill="#f39a8a" opacity={0.7} />
      <ellipse cx={965} cy={570} rx={32} ry={36 + Math.sin(t * 10) * 3} fill="#5a1010" />
      <path d="M 940 548 Q 965 538 990 548 L 988 556 Q 965 548 942 556 Z" fill="#fff" />
      <ellipse cx={965} cy={592} rx={20} ry={11} fill="#e0606a" />
      </g>
    </g>
  );
};

const Escena: React.FC<{ t: number }> = ({ t }) => {
  // gotas del chorro: caen desde la boca del cántaro hacia el casco y alrededor
  const gotas = Array.from({ length: 70 }, (_, k) => {
    const per = 0.9 + rr(k) * 0.6;
    const u = ((t + rr(k + 50) * per) % per) / per;
    const x0 = 1120 - rr(k + 7) * 120, y0 = 190 + rr(k + 9) * 60;
    const x1 = 760 + rr(k + 3) * 520, y1 = 330 + rr(k + 5) * 560;
    const x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u * u + Math.sin(u * 3.14) * -40;
    const r = 6 + rr(k + 11) * 12;
    if (Math.hypot(x - 990, y - 600) < 110) return null;
    return <ellipse key={k} cx={x} cy={y} rx={r * 0.8} ry={r * 1.25} fill={k % 4 ? "#e2a640" : "#f3c86a"} opacity={0.95} transform={`rotate(${-30 + rr(k) * 30} ${x} ${y})`} />;
  });
  const fl = (t * 260) % 80;
  return (
    <g>
      <defs>
        <linearGradient id="pCielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060f36" /><stop offset="0.7" stopColor="#16246a" /><stop offset="1" stopColor="#2a2d6e" /></linearGradient>
        <radialGradient id="pGlow"><stop offset="0" stopColor="#ffb648" stopOpacity="0.85" /><stop offset="0.45" stopColor="#ff8a1e" stopOpacity="0.3" /><stop offset="1" stopColor="#ff8a1e" stopOpacity="0" /></radialGradient>
        <linearGradient id="pPiedra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2216" /><stop offset="0.3" stopColor="#7a4626" /><stop offset="0.8" stopColor="#c47a3a" /><stop offset="1" stopColor="#8a5028" /></linearGradient>
        <linearGradient id="pSuelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3e2416" /><stop offset="1" stopColor="#1e120c" /></linearGradient>
        <linearGradient id="pCol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2a5a" stopOpacity="0.6" /><stop offset="1" stopColor="#ff9a40" stopOpacity="0.5" /></linearGradient>
        <radialGradient id="pVin" cx="0.55" cy="0.55" r="0.75"><stop offset="0.45" stopColor="#03061e" stopOpacity="0" /><stop offset="1" stopColor="#03061e" stopOpacity="0.92" /></radialGradient>
        <linearGradient id="pRefl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffc060" stopOpacity="0.75" /><stop offset="1" stopColor="#ff9a30" stopOpacity="0" /></linearGradient>
        <linearGradient id="pChorro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c99a52" /><stop offset="1" stopColor="#f0cf8a" /></linearGradient>
      </defs>
      {/* cielo, estrellas, luna */}
      <rect x={-200} y={-200} width={2100} height={900} fill="url(#pCielo)" />
      {Array.from({ length: 60 }, (_, k) => <circle key={k} cx={300 + rr(k) * 700} cy={rr(k + 99) * 380} r={1.2 + rr(k + 3) * 2} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 2 + k))} />)}
      <circle cx={738} cy={78} r={60} fill="#fff6c8" opacity={0.12} />
      <path d="M 750 50 A 30 30 0 1 0 760 108 A 24 24 0 1 1 750 50 Z" fill="#fff6c8" />
      {/* ciudad lejana y Coliseo */}
      <path d="M 300 560 L 300 330 L 360 330 L 360 280 L 420 280 L 420 360 L 470 360 L 470 300 L 520 300 L 520 560 Z" fill="#1c1d52" />
      <path d="M 660 560 L 660 260 L 720 260 L 720 200 L 760 200 L 760 300 L 840 300 L 840 560 Z" fill="#23205a" />
      <circle cx={565} cy={400} r={190} fill="url(#pGlow)" opacity={0.55} />
      <g transform="translate(565 405)">
        <path d="M -125 60 L -120 -50 Q 0 -80 120 -50 L 125 60 Z" fill="#6a4a5a" />
        <path d="M -125 60 L -120 -50 Q 0 -80 120 -50 L 125 60 Z" fill="url(#pCol)" />
        {[0, 1, 2].map((f) => Array.from({ length: 8 }, (_, i) => <path key={`${f}${i}`} d={`M ${-104 + i * 27} ${-20 + f * 30} l 0 -14 a 9 9 0 0 1 18 0 l 0 14 Z`} fill={f === 2 ? "#ffd070" : "#ffb04a"} />))}
        <path d="M -122 -48 Q 0 -78 122 -48" stroke="#5a4278" strokeWidth={6} fill="none" />
      </g>
      {/* pared izquierda en fuga */}
      <path d="M 0 0 L 300 0 L 480 300 L 560 560 L 300 650 L 0 800 Z" fill="#4a2e22" />
      <path d="M 0 0 L 260 0 L 340 280 L 300 650 L 0 800 Z" fill="#553220" />
      <clipPath id="pIzq"><path d="M 0 0 L 260 0 L 340 280 L 300 650 L 0 800 Z" /></clipPath>
      <g clipPath="url(#pIzq)">
        {Array.from({ length: 30 }, (_, f) => Array.from({ length: 6 }, (_, c) => { const y = f * 30 - c * 10; return <rect key={`${f}-${c}`} x={c * 56 + (f % 2) * 28} y={y + c * 6} width={52} height={26} rx={3} fill={(f + c) % 3 ? "#6a4028" : "#7a4a2e"} stroke="#2a160c" strokeWidth={3} />; }))}
        <rect x={0} y={0} width={360} height={820} fill="url(#pVin)" />
      </g>
      {[[90, 120, 70, 120], [90, 340, 70, 120], [220, 250, 50, 90]].map(([x, y, w, h], i) => <g key={i}><path d={`M ${x} ${y + h} L ${x} ${y + w / 2} a ${w / 2} ${w / 2} 0 0 1 ${w} 0 L ${x + w} ${y + h} Z`} fill={i === 1 ? "#ffbe5a" : "#1a0e10"} />{i === 1 && <circle cx={x + w / 2} cy={y + h / 2} r={90} fill="url(#pGlow)" opacity={0.6} />}</g>)}
      <path d="M 300 0 L 480 300 L 560 560 L 520 575 L 440 320 L 260 0 Z" fill="#8a5432" />
      <path d="M 455 560 L 470 420 L 500 420 L 510 560 Z" fill="#20141a" />
      <circle cx={620} cy={560} r={30} fill="url(#pGlow)" />
      <circle cx={700} cy={555} r={24} fill="url(#pGlow)" />
      {/* suelo empedrado */}
      <path d="M -50 800 L 560 560 L 880 560 L 1720 840 L 1720 960 L -50 960 Z" fill="url(#pSuelo)" />
      {Array.from({ length: 140 }, (_, k) => {
        const v = rr(k + 400), w = rr(k + 500);
        const y = 580 + v * v * 380, sp = (y - 560) / 380;
        const x = 560 - sp * 620 + w * (320 + sp * 1600);
        return <ellipse key={k} cx={x} cy={y} rx={10 + sp * 46} ry={4 + sp * 16} fill={k % 3 ? "#4a2a18" : "#6a3a20"} stroke="#120804" strokeWidth={1 + sp * 2} />;
      })}
      {[[190, 600, 140], [420, 590, 80], [1610, 860, 200], [1205, 760, 160], [710, 590, 50]].map(([x, y, w], i) => <ellipse key={i} cx={x} cy={y + w * 0.6} rx={w * 0.45} ry={w * 1.1} fill="url(#pRefl)" />)}
      {Array.from({ length: 140 }, (_, k) => {
        const v = rr(k + 400), w = rr(k + 500);
        const y = 580 + v * v * 380, sp = (y - 560) / 380;
        const x = 560 - sp * 620 + w * (320 + sp * 1600);
        return <ellipse key={k} cx={x - sp * 8} cy={y - (4 + sp * 16) * 0.45} rx={(10 + sp * 46) * 0.5} ry={(4 + sp * 16) * 0.3} fill="#ffd590" opacity={0.25 + 0.5 * Math.abs(Math.sin(k + t * 1.5))} />;
      })}
      
      {/* edificio derecho: costado en fuga + fachada de piedra */}
      <path d="M 860 0 L 1120 0 L 1120 780 L 860 560 Z" fill="#4a2a1c" />
      <path d="M 1120 0 L 1720 0 L 1720 860 L 1120 780 Z" fill="url(#pPiedra)" />
      {Array.from({ length: 16 }, (_, f) => Array.from({ length: 9 }, (_, c) => {
        const x = 1120 + c * 70 + (f % 2) * 35, y = 260 + f * 36;
        return x < 1720 ? <rect key={`${f}-${c}`} x={x} y={y} width={64} height={30} rx={4} fill="none" stroke="#2a160c" strokeWidth={4} opacity={0.75} /> : null;
      }))}
      {[[880, 120], [940, 300]].map(([x, y], i) => <path key={i} d={`M ${x} ${y} l 60 30 l 0 120 l -60 -30 Z`} fill="#2a1a14" />)}
      {/* ventana de arriba con la vecina */}
      <rect x={1150} y={-20} width={420} height={230} fill="#3a2214" />
      <rect x={1180} y={-20} width={250} height={210} fill="#ffcf6a" />
      <rect x={1180} y={-20} width={250} height={210} fill="url(#pGlow)" opacity={0.6} />
      <path d="M 1430 -20 L 1560 -20 L 1550 190 L 1430 200 Z" fill="#4a2a18" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={1440} y={i * 48} width={105} height={34} rx={3} fill="#5e3820" />)}
      {/* vecina */}
      <g transform={`translate(0 ${Math.sin(t * 6) * 3})`}>
        <path d="M 1230 210 Q 1300 120 1390 150 L 1410 230 Z" fill="#6a2a6a" />
        <circle cx={1300} cy={62} r={58} fill="#f2c39a" />
        <path d="M 1240 50 Q 1250 -10 1310 -6 Q 1370 0 1360 60 Q 1340 20 1300 20 Q 1260 20 1240 50 Z" fill="#7a4220" />
        <path d="M 1262 46 L 1292 58 M 1340 46 L 1312 58" stroke="#3a1a0a" strokeWidth={7} strokeLinecap="round" />
        <circle cx={1282} cy={68} r={9} fill="#120a08" />
        <circle cx={1322} cy={68} r={9} fill="#120a08" />
        <path d="M 1285 92 Q 1305 82 1325 94 Q 1318 112 1302 112 Q 1288 110 1285 92 Z" fill="#6a1414" />
        <path d="M 1250 150 Q 1220 150 1200 160" stroke="#f2c39a" strokeWidth={26} strokeLinecap="round" />
      </g>
      {/* cornisa */}
      <rect x={1090} y={200} width={630} height={40} fill="#6e4630" />
      <rect x={1090} y={236} width={630} height={12} fill="#3a2418" />
      {/* cántaro volcado */}
      <g transform={`translate(1168 150) rotate(${-62 + Math.sin(t * 3) * 3})`}>
        <path d="M -40 -50 Q -60 0 -40 50 Q 0 70 40 50 Q 60 0 40 -50 Q 20 -66 0 -64 Q -20 -66 -40 -50 Z" fill="#8a4a24" />
        <path d="M -30 -30 Q -40 0 -28 30" stroke="#b06a36" strokeWidth={8} fill="none" />
        <rect x={-18} y={-84} width={36} height={24} rx={6} fill="#6a3418" />
        <ellipse cx={0} cy={-84} rx={22} ry={8} fill="#2a140a" />
      </g>
      {/* el chorro */}
      {(() => { const w = (u: number) => Math.sin(t * 9 + u * 12) * 8; return <>
        <path d={`M 1128 120 C ${1080 + w(0)} 150 ${1060 + w(1)} 200 ${1030 + w(2)} 250 C ${1000 + w(3)} 300 ${960 + w(4)} 330 ${900 + w(5)} 370 Q 950 345 1000 372 Q 1040 340 1050 360 C ${1060 + w(6)} 300 ${1090 + w(7)} 240 ${1110 + w(8)} 200 C ${1130} 170 1150 150 1160 132 Z`} fill="#6a3a18" />
        <path d={`M 1132 124 C ${1090 + w(0)} 156 ${1072 + w(1)} 206 ${1042 + w(2)} 254 C ${1012 + w(3)} 300 ${975 + w(4)} 330 ${925 + w(5)} 362 Q 965 342 1000 362 Q 1030 340 1040 350 C ${1050 + w(6)} 296 ${1080 + w(7)} 238 ${1100 + w(8)} 200 C 1120 172 1140 150 1150 134 Z`} fill="url(#pChorro)" />
        {[0, 1, 2, 3, 4, 5].map((i) => { const u = ((t * 1.2 + i / 6) % 1); return <ellipse key={i} cx={1120 - u * 150} cy={140 + u * 210} rx={9} ry={7} fill="#5a3014" />; })}
      </>; })()}
      <path d="M 1120 130 Q 1060 210 1010 300 Q 990 340 975 385" stroke="#fff2c8" strokeWidth={10} fill="none" strokeDasharray="30 50" strokeDashoffset={-fl} opacity={0.8} />
      <path d="M 1100 150 Q 1050 230 1000 320" stroke="#a4742e" strokeWidth={8} fill="none" strokeDasharray="20 60" strokeDashoffset={-fl * 1.3} opacity={0.7} />
      <circle cx={1052} cy={268} r={24} fill="#c8202a" />
      <path d="M 1052 246 Q 1060 232 1072 236" stroke="#4c8a2e" strokeWidth={6} fill="none" />
      {/* salpicón sobre el casco */}
      {Array.from({ length: 14 }, (_, k) => { const a = -2.6 + k * 0.38; const L = 60 + rr(k) * 70 + Math.sin(t * 8 + k) * 10; return <ellipse key={k} cx={955 + Math.cos(a) * L} cy={360 + Math.sin(a) * L * 0.6} rx={10} ry={20} fill="#f0cf8a" transform={`rotate(${(a * 180) / Math.PI + 90} ${955 + Math.cos(a) * L} ${360 + Math.sin(a) * L * 0.6})`} />; })}
      {/* puerta en arco, antorchas, barriles y ánfora */}
      <path d="M 1330 760 L 1330 520 Q 1390 440 1450 520 L 1450 770 Z" fill="#2a1a12" />
      <path d="M 1345 760 L 1345 530 Q 1390 470 1435 530 L 1435 768 Z" fill="#4a2c1a" />
      {[1370, 1395, 1420].map((x) => <path key={x} d={`M ${x} 500 L ${x} 765`} stroke="#2a1a12" strokeWidth={4} />)}
      <Antorcha x={1610} y={300} s={1.05} t={t} k={1} />
      <Antorcha x={190} y={390} s={0.9} t={t} k={2} />
      <Antorcha x={420} y={470} s={0.5} t={t} k={3} />
      <Antorcha x={710} y={590} s={0.35} t={t} k={4} />
      <Antorcha x={520} y={530} s={0.4} t={t} k={5} />
      <Antorcha x={790} y={575} s={0.3} t={t} k={6} />
      <Antorcha x={1040} y={420} s={0.6} t={t} k={7} />
      {[[1120, 840, 1], [1220, 790, 0.85], [1570, 690, 1.25], [60, 760, 1.3]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M -60 -90 Q -70 0 -60 90 L 60 90 Q 70 0 60 -90 Z" fill="#6a4026" />
          <rect x={-64} y={-60} width={128} height={12} fill="#2a1a10" />
          <rect x={-66} y={40} width={132} height={12} fill="#2a1a10" />
          <ellipse cx={0} cy={-90} rx={60} ry={14} fill="#4a2c1a" />
        </g>
      ))}
      <g transform="translate(1420 730)">
        <path d="M -60 -60 Q -90 30 -40 90 L 40 90 Q 90 30 60 -60 Q 30 -84 0 -84 Q -30 -84 -60 -60 Z" fill="#9a4e2a" />
        <rect x={-30} y={-110} width={60} height={30} rx={6} fill="#7a3a1e" />
      </g>
      {/* carro con dos caballos y el carrero */}
      <g>
        <path d="M 380 520 L 540 520 L 560 640 L 360 640 Z" fill="#5a3418" />
        <path d="M 370 540 L 550 540" stroke="#8a5a2a" strokeWidth={8} />
        <g transform="translate(450 470)">
          <path d="M -46 50 Q -46 -16 0 -16 Q 46 -16 46 50 Z" fill="#8a1e22" />
          <path d="M -30 -10 Q 0 10 30 -10" stroke="#5a1014" strokeWidth={6} fill="none" />
          <circle cx={0} cy={-50} r={32} fill="#d9a07a" />
          <path d="M -32 -56 Q -34 -92 0 -90 Q 34 -92 32 -56 Q 16 -74 0 -74 Q -16 -74 -32 -56 Z" fill="#241410" />
          <path d="M -30 -46 Q -34 -10 0 -6 Q 34 -10 30 -46 Q 20 -30 0 -32 Q -20 -30 -30 -46 Z" fill="#241410" />
          <path d="M -12 -36 Q 0 -44 12 -36 Q 8 -26 0 -26 Q -8 -26 -12 -36 Z" fill="#5a1010" />
          <path d="M -22 -66 L -4 -56 M 22 -66 L 4 -56" stroke="#241410" strokeWidth={7} strokeLinecap="round" />
          <circle cx={-11} cy={-54} r={4} fill="#120a08" /><circle cx={11} cy={-54} r={4} fill="#120a08" />
          <path d="M -40 0 L -110 40 M 40 0 L 120 50" stroke="#d9a07a" strokeWidth={16} strokeLinecap="round" />
          <path d="M -110 40 L -150 90 M 120 50 L 150 120" stroke="#3a2214" strokeWidth={4} />
        </g>
        <circle cx={640} cy={720} r={62} fill="none" stroke="#3a2214" strokeWidth={14} transform={`rotate(${t * 400} 640 720)`} />
        <Caballo x={290} y={560} s={1.05} t={t} k={0} />
        <Caballo x={600} y={600} s={0.98} t={t} k={1.7} />
        {/* polvo del galope */}
        {Array.from({ length: 30 }, (_, k) => { const u = (t * 0.9 + rr(k)) % 1; return <circle key={k} cx={170 + rr(k + 1) * 560 - u * 60} cy={760 - u * 50 + rr(k + 2) * 60} r={8 + u * 26} fill="#d8cfc4" opacity={0.55 * (1 - u)} />; })}
        {Array.from({ length: 16 }, (_, k) => { const u = (t * 1.6 + rr(k + 30)) % 1; return <ellipse key={k} cx={200 + rr(k + 31) * 520 + u * 40} cy={790 - Math.sin(u * 3.14) * 90} rx={8} ry={6} fill="#3a2418" stroke="#1a0e08" strokeWidth={2} />; })}
      </g>
      <Nene t={t} />
      {gotas}
      <rect x={-100} y={-100} width={1900} height={1150} fill="url(#pVin)" />
      <circle cx={1205} cy={590} r={160} fill="url(#pGlow)" opacity={0.3} style={{ mixBlendMode: "screen" }} />
      <circle cx={1610} cy={280} r={240} fill="url(#pGlow)" opacity={0.3} style={{ mixBlendMode: "screen" }} />
      <circle cx={190} cy={370} r={200} fill="url(#pGlow)" opacity={0.25} style={{ mixBlendMode: "screen" }} />
    </g>
  );
};

export const Portada: React.FC<{ t: number }> = ({ t }) => {
  if (t >= PORTADA_FIN) return null;
  // empuje de cámara suave hacia el nene; en "pot" (~2,1 s) el chorro salpica la lente
  const push = 1 + Math.min(t, 2.1) * 0.035;
  const w0 = 2.0, w1 = 2.35;
  const tapa = cl((t - w0) / (w1 - w0));
  const abre = cl((t - 2.45) / (PORTADA_FIN - 2.45));
  const manchas = Array.from({ length: 22 }, (_, k) => {
    const cx = rr(k + 700) * 1920, cy = rr(k + 800) * 1080;
    const d = rr(k + 900) * 0.6;
    const r = cl((tapa - d * 0.5) / 0.5) * (260 + rr(k + 950) * 320);
    return <circle key={k} cx={cx} cy={cy} r={r} fill={k % 3 ? "#2a1a2e" : "#3a2416"} />;
  });
  // al abrir: telón lleno con agujeros que crecen (desde el centro y unos cuantos al azar)
  const agujeros = [[960, 600, 0], ...Array.from({ length: 9 }, (_, k) => [rr(k + 60) * 1920, rr(k + 70) * 1080, 0.1 + rr(k + 80) * 0.35])].map(([x, y, d], k) => (
    <circle key={k} cx={x} cy={y} r={Math.max(0, cl((abre - d) / (1 - d))) ** 1.6 * 2300} fill="#000" />
  ));
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080} viewBox="0 0 1920 1080">
      {t < 2.45 && (
        <g transform={`translate(960 560) scale(${push}) translate(-960 -560)`}>
          <g transform={`scale(${SC})`}>
            <Escena t={t} />
          </g>
        </g>
      )}
      {t >= w0 && t < 2.45 && <g>{manchas}<rect width={1920} height={1080} fill="#2a1a2e" opacity={cl((t - 2.25) / 0.2)} /></g>}
      {t >= 2.45 && (
        <g>
          <defs><mask id="pAbre"><rect width={1920} height={1080} fill="#fff" />{agujeros}</mask></defs>
          <rect width={1920} height={1080} fill="#2a1a2e" mask="url(#pAbre)" />
        </g>
      )}
    </svg>
  );
};
