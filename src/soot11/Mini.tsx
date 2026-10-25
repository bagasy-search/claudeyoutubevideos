import React from "react";
import { clamp } from "../soot/lib";

// Cuadro 0 = la miniatura elegida (soot11_elegida.png, 1672x941) rehecha en código, SIN el texto y SIN la flecha.
// El viewBox usa los píxeles de la miniatura, así cada cosa cae donde está en la imagen: la nave de piedra con
// vitrales, rayos cálidos que cruzan en diagonal sobre un piso de mármol frío, polvo en la luz, arañas y velas,
// estandartes rojos; el verdugo encapuchado solo en la punta de un banco larguísimo (hacha, bolsa de monedas) y
// la gente apretada a la derecha tapándose la boca, uno lo señala. 0-0,9 s cobra vida; 0,9-1,45 s la cámara
// entra por el vitral grande y aparece el pueblo (P0).
const T_ZOOM = 0.9, T_FIN = 1.45;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Vela: React.FC<{ x: number; y: number; t: number; s?: number; i: number }> = ({ x, y, t, s = 1, i }) => {
  const f = 1 + Math.sin(t * 23 + i * 1.7) * 0.12 + Math.sin(t * 37 + i) * 0.05;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-22} r={26 * f} fill="url(#m11halo)" />
      <rect x={-5} y={-14} width={10} height={24} rx={2} fill="url(#m11cera)" />
      <path d="M -5 -14 q 2 4 0 8" stroke="#e8d4a8" strokeWidth={2} fill="none" />
      <path d={`M 0 ${-32 * f} Q 6 -21 0 -15 Q -6 -21 0 ${-32 * f} Z`} fill="#ffd36a" />
      <path d={`M 0 ${-25 * f} Q 3 -19 0 -16 Q -3 -19 0 ${-25 * f} Z`} fill="#fffbe8" />
    </g>
  );
};
const Arana: React.FC<{ x: number; y: number; w: number; t: number; k: number; n: number }> = ({ x, y, w, t, k, n }) => (
  <g>
    <line x1={x} y1={y - 200} x2={x} y2={y - 30} stroke="#2a1a10" strokeWidth={4} />
    {[-1, -0.4, 0.4, 1].map((d) => <line key={d} x1={x} y1={y - 40} x2={x + d * w * 0.46} y2={y} stroke="#2a1a10" strokeWidth={2.5} />)}
    <ellipse cx={x} cy={y + 8} rx={w / 2} ry={w * 0.08} fill="none" stroke="#3a2414" strokeWidth={9} />
    <ellipse cx={x} cy={y + 5} rx={w / 2} ry={w * 0.08} fill="none" stroke="#8a5a2a" strokeWidth={2} opacity={0.7} />
    {Array.from({ length: n }, (_, i) => {
      const a = (i / (n - 1)) * Math.PI;
      return <Vela key={i} x={x - Math.cos(a) * w * 0.48} y={y + Math.sin(a) * w * 0.05} t={t} i={i + k} s={1.05} />;
    })}
  </g>
);
const Candelabro: React.FC<{ x: number; y: number; t: number; k: number; s?: number }> = ({ x, y, t, k, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-3} y={0} width={6} height={200} fill="#3a2414" />
    <path d="M -40 0 Q -40 26 0 26 Q 40 26 40 0" stroke="#3a2414" strokeWidth={5} fill="none" />
    <ellipse cx={0} cy={200} rx={22} ry={6} fill="#2a1a10" />
    {[-40, 0, 40].map((d, i) => <Vela key={d} x={d} y={d === 0 ? -6 : 0} t={t} i={k + i} />)}
  </g>
);
const Vitral: React.FC<{ x: number; y: number; w: number; h: number; t: number; id: string; cruz?: boolean }> = ({ x, y, w, h, t, id, cruz }) => {
  const cols = ["#4aa8e0", "#f2c23a", "#e0609a", "#7ac84a", "#8a5ad8", "#f0883a", "#ffe28a", "#40c0c0"];
  const nx = Math.max(2, Math.round(w / 26)), ny = Math.round(h / 30);
  const p = `M ${x} ${y + h} L ${x} ${y + w / 2} Q ${x} ${y} ${x + w / 2} ${y - w * 0.15} Q ${x + w} ${y} ${x + w} ${y + w / 2} L ${x + w} ${y + h} Z`;
  return (
    <g>
      <path d={p} fill="#3a2414" stroke="#6a5444" strokeWidth={10} />
      <clipPath id={id}><path d={p} /></clipPath>
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: nx * (ny + 2) }, (_, i) => {
          const cx = i % nx, cy = Math.floor(i / nx) - 1, sk = (cy % 2) * 0.5;
          return <path key={i} d={`M ${x + ((cx + sk) * w) / nx} ${y + (cy * h) / ny} l ${w / nx} ${h / ny / 2} l 0 ${h / ny} l ${-w / nx} ${-h / ny / 2} Z`}
            fill={cols[Math.floor(rnd(i + x) * cols.length)]} stroke="#2a1a10" strokeWidth={2.5} opacity={0.95 + 0.05 * Math.sin(t * 3 + i)} />;
        })}
        {cruz && <><rect x={x + w / 2 - 12} y={y + h * 0.12} width={24} height={h * 0.62} fill="#fff4b8" /><rect x={x + w * 0.2} y={y + h * 0.3} width={w * 0.6} height={22} fill="#fff4b8" /></>}
        <rect x={x} y={y - w} width={w} height={h + w} fill="url(#m11vitbrillo)" />
      </g>
      {Array.from({ length: Math.max(1, Math.round(w / 60)) }, (_, i) => <rect key={i} x={x + ((i + 1) * w) / (Math.round(w / 60) + 1) - 3} y={y + w * 0.3} width={6} height={h - w * 0.3} fill="#2a1a10" />)}
    </g>
  );
};
// columna de piedra con sillares, junta de mortero y luz cálida de un lado
const Columna: React.FC<{ x: number; w: number; y0?: number; y1?: number; k: number }> = ({ x, w, y0 = 0, y1 = 870, k }) => (
  <g>
    <rect x={x} y={y0} width={w} height={y1 - y0} fill="url(#m11piedra)" />
    {Array.from({ length: Math.ceil((y1 - y0) / 44) }, (_, r) => (
      <g key={r}>
        <line x1={x} y1={y0 + r * 44} x2={x + w} y2={y0 + r * 44} stroke="#4a2814" strokeWidth={2} opacity={0.6} />
        <line x1={x + (r % 2 ? w * 0.35 : w * 0.7)} y1={y0 + r * 44} x2={x + (r % 2 ? w * 0.35 : w * 0.7)} y2={y0 + r * 44 + 44} stroke="#5a4232" strokeWidth={2} opacity={0.45} />
        <rect x={x + 3} y={y0 + r * 44 + 3} width={w * (0.3 + rnd(r + k) * 0.4)} height={5} fill="#f0d6b0" opacity={0.18} />
      </g>
    ))}
    <rect x={x + w * 0.72} y={y0} width={w * 0.28} height={y1 - y0} fill="#2a1a12" opacity={0.28} />
  </g>
);
const Estandarte: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => (
  <g transform={`translate(${x} ${y}) skewX(${Math.sin(t * 2 + x) * 1.2})`}>
    <rect x={-10} y={-12} width={w + 20} height={12} rx={5} fill="#4a2a12" />
    <path d={`M 0 0 L ${w} 0 L ${w} ${h} L ${w * 0.75} ${h - 22} L ${w / 2} ${h} L ${w * 0.25} ${h - 22} L 0 ${h} Z`} fill="url(#m11tela)" stroke="#4e0c18" strokeWidth={3} />
    <path d={`M 6 6 L ${w - 6} 6 L ${w - 6} ${h - 14} M 6 6 L 6 ${h - 14}`} stroke="#d8a040" strokeWidth={3} fill="none" opacity={0.8} />
    {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={w * f} y1={8} x2={w * f + 4} y2={h - 30} stroke="#3a0810" strokeWidth={5} opacity={0.25} />)}
    <path d={`M ${w / 2 - 8} ${h * 0.2} h 16 v ${h * 0.14} h ${w * 0.2} v 16 h ${-w * 0.2} v ${h * 0.32} h -16 v ${-h * 0.32} h ${-w * 0.2} v -16 h ${w * 0.2} Z`} fill="#e8b040" stroke="#a8761c" strokeWidth={2} />
  </g>
);
// mano con dedos (para taparse la boca o apoyarse)
const Mano: React.FC<{ x: number; y: number; s: number; rot: number; piel: string }> = ({ x, y, s, rot, piel }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-15, -5, 5, 15].map((d, i) => <rect key={d} x={d - 5} y={-30 + Math.abs(i - 1.5) * 4} width={10} height={28} rx={5} fill={piel} stroke="#a8643a" strokeWidth={1.6} />)}
    <ellipse cx={0} cy={4} rx={22} ry={17} fill={piel} stroke="#a8643a" strokeWidth={1.6} />
    <path d="M -20 0 Q -30 -10 -26 -20" stroke="#a8643a" strokeWidth={9} strokeLinecap="round" fill="none" />
    <path d="M -20 0 Q -30 -10 -26 -20" stroke={piel} strokeWidth={6} strokeLinecap="round" fill="none" />
  </g>
);
type Toc = "panuelo" | "capucha" | "gorro" | "sombrero" | "pelo";
// persona de la multitud: cara con degradé, ojos grandes que miran al verdugo (izquierda), cejas de miedo
const Persona: React.FC<{ x: number; y: number; s: number; piel: string; ropa: string; toc: Toc; tocCol: string; pelo?: string; barba?: string; mano?: boolean; t: number; i: number; luz?: number }> =
  ({ x, y, s, piel, ropa, toc, tocCol, pelo = "#5a3418", barba, mano, t, i, luz = 1 }) => {
    const parp = Math.abs(t - (0.42 + i * 0.07)) < 0.045 ? 0.12 : 1;
    const resp = Math.sin(t * 4 + i) * 1.5;
    return (
      <g transform={`translate(${x} ${y + resp}) scale(${s})`} opacity={luz}>
        <path d="M -78 190 Q -84 70 0 62 Q 84 70 78 190 Z" fill={ropa} />
        <path d="M -40 70 Q 0 100 40 70" stroke="#00000033" strokeWidth={5} fill="none" />
        <path d="M -60 120 Q -50 160 -54 190 M 50 110 Q 46 150 52 190" stroke="#00000026" strokeWidth={6} fill="none" />
        {(toc === "panuelo" || toc === "capucha") && <path d="M -64 30 Q -76 -70 0 -76 Q 76 -70 64 30 Q 74 80 46 96 L -46 96 Q -74 80 -64 30 Z" fill={tocCol} stroke="#00000030" strokeWidth={3} />}
        {toc === "pelo" && <path d="M -56 20 Q -66 -64 0 -66 Q 66 -64 56 20 Q 62 56 50 70 L -50 70 Q -62 56 -56 20 Z" fill={pelo} />}
        <ellipse cx={0} cy={0} rx={48} ry={52} fill={`url(#m11cara${i})`} />
        <radialGradient id={`m11cara${i}`} cx="0.62" cy="0.38" r="0.7"><stop offset="0" stopColor={piel} /><stop offset="0.75" stopColor={piel} /><stop offset="1" stopColor="#b86e44" /></radialGradient>
        {toc === "panuelo" && <path d="M -50 -6 Q -46 -58 0 -60 Q 46 -58 50 -6 Q 30 -34 0 -36 Q -30 -34 -50 -6 Z" fill={tocCol} />}
        {toc === "capucha" && <path d="M -52 0 Q -48 -60 0 -62 Q 48 -60 52 0 Q 34 -38 0 -40 Q -34 -38 -52 0 Z" fill={tocCol} />}
        {toc === "pelo" && <path d="M -48 -10 Q -40 -58 0 -58 Q 42 -58 48 -10 Q 20 -40 -10 -34 Q -30 -30 -48 -10 Z" fill={pelo} />}
        {toc === "gorro" && <><path d="M -50 -14 Q -48 -66 0 -68 Q 48 -66 50 -14 Z" fill={tocCol} /><path d="M -54 -16 Q 0 -4 54 -16 L 52 -6 Q 0 6 -52 -6 Z" fill="#00000030" /></>}
        {toc === "sombrero" && <><path d="M -46 -24 Q -44 -82 4 -84 Q 52 -80 48 -24 Z" fill={tocCol} /><ellipse cx={2} cy={-24} rx={64} ry={14} fill={tocCol} stroke="#00000040" strokeWidth={3} /></>}
        {barba && <path d="M -42 10 Q -40 74 0 80 Q 40 74 42 10 Q 26 34 0 32 Q -26 34 -42 10 Z" fill={barba} />}
        {[-18, 18].map((dx) => (
          <g key={dx}>
            <ellipse cx={dx} cy={-2} rx={15} ry={18 * parp} fill="#fff" stroke="#2b1c14" strokeWidth={2.5} />
            <circle cx={dx - 6} cy={1} r={9 * parp} fill="#1d1410" />
            <circle cx={dx - 3} cy={-3} r={3 * parp} fill="#fff" />
          </g>
        ))}
        <path d="M -34 -26 Q -24 -32 -8 -28 M 34 -26 Q 24 -32 8 -28" stroke="#4a2a14" strokeWidth={3.5} strokeLinecap="round" fill="none" transform="rotate(0)" />
        <ellipse cx={-30} cy={20} rx={10} ry={6} fill="#ff7a7a" opacity={0.35} /><ellipse cx={30} cy={20} rx={10} ry={6} fill="#ff7a7a" opacity={0.35} />
        {!mano && <path d={barba ? "M -12 40 Q 0 30 12 40" : "M -10 34 Q 0 27 10 34"} stroke="#5a2a14" strokeWidth={3} fill="none" strokeLinecap="round" />}
        {mano && <><Mano x={-8} y={36} s={0.95} rot={-8} piel={piel} /><Mano x={10} y={42} s={0.9} rot={10} piel={piel} /></>}
      </g>
    );
  };

export const Mini: React.FC<{ t: number }> = ({ t }) => {
  if (t >= T_FIN) return null;
  const u = clamp((t - T_ZOOM) / (T_FIN - T_ZOOM), 0, 1);
  const ee = u * u * (3 - 2 * u);
  const empuje = 1 + clamp(t / T_ZOOM, 0, 1) * 0.035;
  const zoom = empuje * Math.exp(Math.log(7) * ee);
  const op = 1 - clamp((u - 0.55) / 0.45, 0, 1);
  const sus = Math.sin(clamp(t / 0.9, 0, 1) * Math.PI) * 4; // suspiro
  const rayo = 0.5 + 0.08 * Math.sin(t * 5);
  const senal = Math.sin(t * 9) * 5;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: op }}>
      <svg width={1920} height={1080} viewBox="0 0 1672 941" preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, transform: `scale(${zoom})`, transformOrigin: "1440px 205px" }}>
        <defs>
          <linearGradient id="m11pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a3a1e" /><stop offset="0.5" stopColor="#b06a30" /><stop offset="1" stopColor="#5a3018" /></linearGradient>
          <linearGradient id="m11piedra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a5430" /><stop offset="0.45" stopColor="#e8a85e" /><stop offset="1" stopColor="#6a3a1e" /></linearGradient>
          <linearGradient id="m11piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a4a66" /><stop offset="1" stopColor="#2e2c48" /></linearGradient>
          <linearGradient id="m11rayo" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6c8" stopOpacity="0.95" /><stop offset="0.6" stopColor="#ffd88a" stopOpacity="0.45" /><stop offset="1" stopColor="#ffc860" stopOpacity="0" /></linearGradient>
          <radialGradient id="m11sol" cx="0.75" cy="0.2" r="0.55"><stop offset="0" stopColor="#ffc860" stopOpacity="0.8" /><stop offset="1" stopColor="#ff9a30" stopOpacity="0" /></radialGradient>
          <radialGradient id="m11frio" cx="0.1" cy="0.95" r="0.6"><stop offset="0" stopColor="#2a3460" stopOpacity="0.45" /><stop offset="1" stopColor="#2a3460" stopOpacity="0" /></radialGradient>
          <radialGradient id="m11halo"><stop offset="0" stopColor="#ffe08a" stopOpacity="0.75" /><stop offset="1" stopColor="#ffc860" stopOpacity="0" /></radialGradient>
          <linearGradient id="m11cera" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff4dc" /><stop offset="1" stopColor="#d8c49a" /></linearGradient>
          <linearGradient id="m11vitbrillo" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffbe0" stopOpacity="0.12" /><stop offset="0.5" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <linearGradient id="m11tela" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6a1220" /><stop offset="0.5" stopColor="#a02030" /><stop offset="1" stopColor="#6a1220" /></linearGradient>
          <linearGradient id="m11respaldo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a220c" /><stop offset="0.45" stopColor="#8a4a1a" /><stop offset="0.7" stopColor="#c87a2a" /><stop offset="1" stopColor="#6a3410" /></linearGradient>
          <linearGradient id="m11asiento" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8a04a" /><stop offset="1" stopColor="#a05a20" /></linearGradient>
          <linearGradient id="m11frente" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a3814" /><stop offset="1" stopColor="#3a1e0a" /></linearGradient>
          <linearGradient id="m11poste" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a2e12" /><stop offset="0.5" stopColor="#b06a2a" /><stop offset="1" stopColor="#4a240e" /></linearGradient>
          <linearGradient id="m11hoja" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4f6fa" /><stop offset="0.5" stopColor="#aab0bc" /><stop offset="1" stopColor="#5a606c" /></linearGradient>
          <linearGradient id="m11mango" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a3416" /><stop offset="0.5" stopColor="#a8703a" /><stop offset="1" stopColor="#4a2a10" /></linearGradient>
          <linearGradient id="m11bota" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a3416" /><stop offset="0.55" stopColor="#9a6234" /><stop offset="1" stopColor="#4a2a12" /></linearGradient>
          <linearGradient id="m11negro" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1a181e" /><stop offset="0.6" stopColor="#34303a" /><stop offset="1" stopColor="#1e1c22" /></linearGradient>
          <radialGradient id="m11cuero" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#b07040" /><stop offset="1" stopColor="#5a2e12" /></radialGradient>
          <radialGradient id="m11verdugo" cx="0.62" cy="0.36" r="0.72"><stop offset="0" stopColor="#ffd6ac" /><stop offset="0.7" stopColor="#f2be92" /><stop offset="1" stopColor="#c47a4a" /></radialGradient>
          <linearGradient id="m11pelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b06a30" /><stop offset="1" stopColor="#6a3a14" /></linearGradient>
          <radialGradient id="m11moneda" cx="0.35" cy="0.35" r="0.7"><stop offset="0" stopColor="#fff2a0" /><stop offset="0.6" stopColor="#f2c032" /><stop offset="1" stopColor="#a8780e" /></radialGradient>
        </defs>

        {/* nave: pared, arcos góticos, columnas de piedra */}
        <rect x={0} y={0} width={1672} height={941} fill="url(#m11pared)" />
        {Array.from({ length: 22 }, (_, r) => <line key={r} x1={0} y1={r * 40} x2={1672} y2={r * 40} stroke="#4a2a16" strokeWidth={1.5} opacity={0.35} />)}
        {[[40, 150], [250, 800], [920, 1080], [1170, 1345], [1420, 1600]].map(([a, b], i) => <path key={i} d={`M ${a} 600 L ${a} 200 Q ${(a + b) / 2} ${-120} ${b} 200 L ${b} 600`} fill="none" stroke="#4a2a16" strokeWidth={18} opacity={0.55} />)}
        <rect x={0} y={0} width={1672} height={941} fill="url(#m11sol)" />
        <Vitral x={1182} y={30} w={152} h={340} t={t} id="m11v1" cruz />
        <Vitral x={930} y={300} w={34} h={240} t={t} id="m11v2" />
        <Vitral x={44} y={290} w={58} h={170} t={t} id="m11v3" />
        <Vitral x={258} y={290} w={92} h={150} t={t} id="m11v4" />
        <Vitral x={1448} y={250} w={70} h={140} t={t} id="m11v5" />
        <Columna x={0} w={40} k={1} />
        <Columna x={150} w={100} k={2} />
        <Columna x={800} w={120} k={3} />
        <Columna x={1080} w={90} k={4} />
        <Columna x={1345} w={75} k={5} />
        <Columna x={1600} w={72} k={6} />
        <Estandarte x={692} y={268} w={96} h={200} t={t} />
        <Estandarte x={1532} y={120} w={108} h={235} t={t} />
        <Arana x={1012} y={100} w={190} t={t} k={0} n={7} />
        <Arana x={1530} y={50} w={250} t={t} k={9} n={9} />
        <Candelabro x={585} y={315} t={t} k={30} s={0.9} />
        <Candelabro x={18} y={360} t={t} k={34} s={0.75} />
        <Candelabro x={1082} y={340} t={t} k={38} s={0.6} />
        <Candelabro x={1418} y={310} t={t} k={42} s={0.6} />
        {/* filas del fondo: gente en penumbra */}
        {Array.from({ length: 14 }, (_, i) => <g key={i} opacity={0.55}><ellipse cx={520 + i * 38 + (i % 2) * 10} cy={505 + (i % 3) * 8} rx={17} ry={19} fill="#5a3826" /><path d={`M ${500 + i * 38} 560 Q ${520 + i * 38} 520 ${545 + i * 38} 560 Z`} fill="#4a2c1e" /></g>)}
        {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={1110 + i * 60} cy={385 + (i % 2) * 14} rx={28} ry={32} fill="#6a4030" opacity={0.7} />)}

        {/* piso de mármol frío con manchas de luz cálida */}
        <rect x={0} y={858} width={1672} height={83} fill="url(#m11piso)" />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 150 - 60} y1={941} x2={i * 150 + 40} y2={858} stroke="#9a92b0" strokeWidth={2} opacity={0.4} />)}
        <line x1={0} y1={895} x2={1672} y2={890} stroke="#9a92b0" strokeWidth={2} opacity={0.4} />
        {[[560, 900, 300], [1000, 895, 220], [1380, 905, 200], [180, 915, 180]].map(([x, y, w], i) => <ellipse key={i} cx={x} cy={y} rx={w} ry={18} fill="#ffc870" opacity={0.6} />)}

        {/* bancos de la derecha, fila de atrás */}
        <path d="M 1000 520 L 1672 600 L 1672 640 L 1000 560 Z" fill="url(#m11respaldo)" opacity={0.85} />

        {/* la multitud */}
        <Persona x={1190} y={392} s={0.8} piel="#d8a07a" ropa="#5a3424" toc="capucha" tocCol="#5a3a2a" t={t} i={6} luz={0.8} />
        <Persona x={1450} y={378} s={0.82} piel="#e8b48c" ropa="#4a3a2a" toc="pelo" tocCol="#3a2414" pelo="#3a2414" t={t} i={7} luz={0.8} />
        <Persona x={1560} y={360} s={0.8} piel="#f0c09a" ropa="#3a4a5a" toc="capucha" tocCol="#3a4a5a" t={t} i={8} luz={0.8} />
        <Persona x={1122} y={455} s={0.95} piel="#c88a5a" ropa="#6a3a24" toc="pelo" tocCol="#5a3418" pelo="#5a3018" t={t} i={0} luz={0.95} />
        <Persona x={1640} y={412} s={1.08} piel="#f0c8a8" ropa="#6a5a4a" toc="panuelo" tocCol="#e8dccc" barba="#d8d4cc" t={t} i={1} />
        <Persona x={1266} y={460} s={1.12} piel="#f4c6a0" ropa="#4a6a34" toc="panuelo" tocCol="#f2ecdc" mano t={t} i={2} />
        <Persona x={1508} y={472} s={1.1} piel="#f2c09a" ropa="#7a2a2a" toc="capucha" tocCol="#7a2e28" mano t={t} i={3} />
        <Persona x={1378} y={404} s={1.12} piel="#eab088" ropa="#2a6a78" toc="sombrero" tocCol="#4a5a2a" barba="#2a1a10" t={t} i={4} />
        {/* el que señala: brazo con manga azul y el índice estirado hacia el verdugo */}
        <path d={`M 1440 490 Q 1400 498 ${1352 + senal} 500`} stroke="#2a6a78" strokeWidth={30} strokeLinecap="round" fill="none" />
        <path d={`M 1440 482 Q 1400 488 ${1356 + senal} 490`} stroke="#4a8a98" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7} />
        <g transform={`translate(${1336 + senal} 500)`}>
          <ellipse cx={0} cy={0} rx={18} ry={14} fill="#eab088" stroke="#a8643a" strokeWidth={1.6} />
          <rect x={-42} y={-8} width={34} height={10} rx={5} fill="#eab088" stroke="#a8643a" strokeWidth={1.6} />
          <path d="M -6 6 q -10 6 -2 10" stroke="#a8643a" strokeWidth={1.6} fill="none" />
        </g>

        {/* respaldo de la fila de adelante de la derecha y sus postes */}
        <path d="M 1100 600 L 1672 640 L 1672 860 L 1100 860 Z" fill="url(#m11respaldo)" stroke="#3a1e0a" strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M 1100 ${625 + i * 30} L 1672 ${662 + i * 30}`} stroke="#4a2a10" strokeWidth={1.6} opacity={0.5} />)}
        <path d="M 1100 690 L 1672 720 L 1672 740 L 1100 710 Z" fill="#e8a04a" opacity={0.5} />
        {[[1172, 580, 68], [1342, 582, 78]].map(([x, y, w]) => (
          <g key={x}>
            <path d={`M ${x} 860 L ${x} ${y + 20} Q ${x} ${y - 10} ${x + w / 2} ${y - 14} Q ${x + w} ${y - 10} ${x + w} ${y + 20} L ${x + w} 860 Z`} fill="url(#m11poste)" stroke="#2a1608" strokeWidth={4} />
            <path d={`M ${x + 12} 840 L ${x + 12} ${y + 40} Q ${x + w / 2} ${y + 14} ${x + w - 12} ${y + 40} L ${x + w - 12} 840`} fill="none" stroke="#3a1e0a" strokeWidth={3} opacity={0.6} />
          </g>
        ))}
        {/* el nene de gorro verde, adelante */}
        <Persona x={1622} y={585} s={1.0} piel="#f4c6a4" ropa="#8a2e36" toc="gorro" tocCol="#4a6a3a" mano t={t} i={5} />

        {/* el banco larguísimo y vacío de la izquierda */}
        <path d="M 0 418 L 1050 540 L 1050 712 L 0 700 Z" fill="url(#m11respaldo)" stroke="#2a1608" strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M 0 ${442 + i * 36} Q 500 ${500 + i * 33} 1050 ${562 + i * 22}`} stroke="#3a1e0a" strokeWidth={1.4} opacity={0.45} fill="none" />)}
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${60 + i * 64} ${470 + i * 6} q 22 ${4 + rnd(i) * 6} 46 2`} stroke="#ffd290" strokeWidth={1.4} opacity={0.35} fill="none" />)}
        <path d="M 0 480 L 1050 590 L 1050 612 L 0 502 Z" fill="#ffc060" opacity={0.55} />
        <path d="M 0 418 L 1050 540 L 1050 552 L 0 430 Z" fill="#ffd080" opacity={0.6} />
        <path d="M 520 520 L 940 560 L 960 712 L 560 708 Z" fill="#ffb040" opacity={0.3} />
        <path d="M 0 700 L 1050 712 L 1090 742 L 0 738 Z" fill="url(#m11asiento)" stroke="#3a1e0a" strokeWidth={3} />
        <path d="M 0 738 L 1090 742 L 1090 866 L 0 866 Z" fill="url(#m11frente)" />
        {Array.from({ length: 4 }, (_, i) => <line key={i} x1={0} y1={765 + i * 26} x2={1090} y2={766 + i * 26} stroke="#2a1608" strokeWidth={1.4} opacity={0.5} />)}
        {[110, 420, 700, 950].map((x) => <rect key={x} x={x} y={742} width={18} height={124} fill="#2a1608" opacity={0.7} />)}
        <path d="M 1040 866 L 1040 548 Q 1040 520 1090 518 Q 1140 520 1145 550 L 1145 866 Z" fill="url(#m11poste)" stroke="#2a1608" strokeWidth={4} />
        <path d="M 1054 846 L 1054 570 Q 1090 540 1130 570 L 1130 846" fill="none" stroke="#3a1e0a" strokeWidth={3} opacity={0.6} />

        {/* rayos de luz cálida en diagonal + polvo */}
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${1200 + i * 30} ${40 + i * 50} L ${1250 + i * 30} ${30 + i * 50} L ${520 + i * 170} 941 L ${380 + i * 170} 941 Z`} fill="url(#m11rayo)" opacity={rayo * (0.32 + (i % 2) * 0.2)} />)}
        {Array.from({ length: 90 }, (_, i) => {
          const k = rnd(i) , px = 400 + k * 1000, py = (rnd(i + 50) * 900 + t * 40 * (0.5 + rnd(i + 9))) % 900;
          return <circle key={i} cx={px - py * 0.5 + 300} cy={py} r={0.8 + rnd(i + 3) * 2.2} fill="#fff4c8" opacity={0.25 + 0.55 * Math.abs(Math.sin(t * 3 + i))} />;
        })}
        <rect x={0} y={0} width={1672} height={941} fill="url(#m11frio)" />

        {/* el hacha apoyada */}
        <g>
          <path d="M 18 904 L 200 340 L 216 346 L 34 910 Z" fill="url(#m11mango)" />
          {[0, 1, 2, 3].map((i) => <line key={i} x1={40 + i * 40} y1={840 - i * 120} x2={48 + i * 40} y2={812 - i * 120} stroke="#3a1e0a" strokeWidth={1.4} />)}
          <path d="M 10 880 L 46 892 L 38 916 L 4 906 Z" fill="#8a909a" stroke="#3a3e46" strokeWidth={2} />
          <path d="M 150 396 L 202 412 L 186 466 L 136 450 Z" fill="#6a707a" stroke="#2a2e34" strokeWidth={3} />
          {[0, 1, 2].map((i) => <circle key={i} cx={160 + i * 14} cy={416 + i * 14} r={3} fill="#cfd4dc" />)}
          <path d="M 156 410 L 112 334 Q 60 352 44 420 Q 30 500 54 580 Q 100 540 142 470 Z" fill="url(#m11hoja)" stroke="#3a3e46" strokeWidth={4} />
          <path d="M 108 344 Q 60 366 50 430 Q 42 500 60 566" stroke="#ffffff" strokeWidth={5} fill="none" opacity={0.85} />
          {[[90, 420, 120, 440], [80, 470, 112, 480], [96, 380, 118, 400], [70, 520, 98, 510]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#5a606c" strokeWidth={1.5} opacity={0.7} />)}
          <path d="M 196 404 L 214 326 L 226 360 Z" fill="#9aa0aa" stroke="#3a3e46" strokeWidth={2} />
          <path d="M 196 440 L 232 432 L 200 456 Z" fill="#7a808a" />
        </g>
        {/* la bolsa de monedas */}
        <g>
          <path d="M 135 705 Q 120 640 168 612 L 236 612 Q 282 640 272 705 Q 210 718 135 705 Z" fill="url(#m11cuero)" stroke="#3a1e0a" strokeWidth={3} />
          <path d="M 160 640 Q 180 690 170 704 M 230 640 Q 222 690 238 704" stroke="#3a1e0a" strokeWidth={1.6} opacity={0.5} fill="none" />
          <path d="M 164 618 Q 204 600 244 618" stroke="#3a1e0a" strokeWidth={6} fill="none" />
          <circle cx={258} cy={650} r={9} fill="none" stroke="#e0a840" strokeWidth={3} />
          {[[176, 616], [198, 608], [222, 614], [190, 628], [212, 626], [136, 702], [160, 708], [196, 712], [226, 710], [118, 694]].map(([x, y], i) => (
            <g key={i}><ellipse cx={x} cy={y} rx={14} ry={7} fill="url(#m11moneda)" stroke="#8a600a" strokeWidth={1.6} /><ellipse cx={x - 3} cy={y - 2} rx={5} ry={2} fill="#fff8c8" opacity={0.8} /></g>
          ))}
        </g>

        {/* el verdugo, solo */}
        <g transform={`translate(0 ${sus * 0.4})`}>
          {/* piernas y botas */}
          <path d="M 290 600 Q 280 650 300 700 L 330 780 L 420 780 L 430 690 Q 440 640 430 610 Z" fill="url(#m11negro)" />
          <path d="M 420 610 Q 460 620 500 660 L 470 780 L 560 780 L 560 690 Q 560 620 500 600 Z" fill="url(#m11negro)" />
          <path d="M 330 700 Q 360 690 400 700 M 480 690 Q 510 680 540 690" stroke="#4a4652" strokeWidth={3} fill="none" />
          {[[300, 420], [455, 590]].map(([a, b], i) => (
            <g key={i}>
              <path d={`M ${a + 8} 770 L ${b - 8} 770 L ${b - 6} 860 Q ${b + 10} 868 ${b + 4} 900 L ${a - 4} 900 Q ${a - 10} 880 ${a + 4} 860 Z`} fill="url(#m11bota)" stroke="#2a1608" strokeWidth={4} />
              <path d={`M ${a + 8} 770 L ${b - 8} 770 L ${b - 8} 786 L ${a + 8} 786 Z`} fill="#4a2a12" />
              {[800, 840].map((y) => <g key={y}><rect x={a + 8} y={y} width={b - a - 16} height={14} fill="#3a1e0a" /><rect x={a + (b - a) / 2 - 10} y={y - 4} width={20} height={22} rx={3} fill="none" stroke="#e8b040" strokeWidth={3.5} /></g>)}
              <path d={`M ${a + 14} 776 Q ${a + 20} 830 ${a + 16} 880`} stroke="#c8885a" strokeWidth={4} opacity={0.45} fill="none" />
            </g>
          ))}
          {/* capa con bordes rotos */}
          <path d="M 300 360 Q 300 330 360 320 L 500 330 Q 540 360 520 440 L 520 520 L 498 508 L 486 548 L 466 512 L 450 556 L 430 510 L 300 520 L 282 558 L 268 516 L 244 552 L 236 500 Q 250 440 300 360 Z" fill="url(#m11negro)" stroke="#0e0c10" strokeWidth={3} />
          {/* torso */}
          <path d="M 286 480 Q 300 460 380 458 Q 460 460 474 486 L 470 610 L 290 610 Z" fill="#2a2830" />
          <path d="M 330 500 Q 340 560 334 600 M 430 500 Q 426 560 432 600" stroke="#3e3a46" strokeWidth={4} fill="none" />
          <path d="M 260 470 L 290 520 L 300 496 L 318 540 L 334 500 L 300 470 Z" fill="#2a2830" />
          <path d="M 440 480 L 472 534 L 486 500 L 500 540 L 498 486 Z" fill="#2a2830" />
          <circle cx={402} cy={508} r={5} fill="#5a3418" />
          <rect x={296} y={566} width={176} height={24} fill="#5a3418" stroke="#2a1608" strokeWidth={2} />
          <rect x={356} y={560} width={40} height={36} rx={4} fill="none" stroke="#e8b040" strokeWidth={5} />
          <line x1={376} y1={566} x2={392} y2={566} stroke="#e8b040" strokeWidth={4} />
          {/* brazos sobre las rodillas con muñequeras de cuero tachonadas */}
          <path d="M 288 500 Q 262 560 310 620 L 390 662" stroke="#2a2830" strokeWidth={46} strokeLinecap="round" fill="none" />
          <path d="M 470 500 Q 500 560 478 616 L 446 664" stroke="#2a2830" strokeWidth={46} strokeLinecap="round" fill="none" />
          <g transform="rotate(32 340 630)"><rect x={304} y={606} width={74} height={48} rx={10} fill="url(#m11cuero)" stroke="#2a1608" strokeWidth={2.5} />{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={314 + (i % 3) * 26} cy={620 + Math.floor(i / 3) * 20} r={4} fill="#d8a86a" stroke="#5a3418" strokeWidth={1} />)}</g>
          <g transform="rotate(-40 470 632)"><rect x={436} y={610} width={70} height={46} rx={10} fill="url(#m11cuero)" stroke="#2a1608" strokeWidth={2.5} />{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={446 + (i % 3) * 25} cy={623 + Math.floor(i / 3) * 20} r={4} fill="#d8a86a" stroke="#5a3418" strokeWidth={1} />)}</g>
          <Mano x={404} y={672} s={1.05} rot={165} piel="#f2be92" />
          <Mano x={440} y={676} s={1.0} rot={195} piel="#f2be92" />
          {/* cabeza agachada */}
          <g transform={`translate(0 ${sus})`}>
            <path d="M 330 380 Q 320 300 440 296 Q 540 300 540 380 L 540 470 L 330 470 Z" fill="#1e1c22" />
            <ellipse cx={366} cy={418} rx={16} ry={22} fill="#e8aa7a" />
            <ellipse cx={446} cy={410} rx={80} ry={84} fill="url(#m11verdugo)" />
            {/* pelo castaño revuelto, mechones al frente */}
            <path d="M 366 380 Q 360 300 440 296 Q 534 296 532 384 Q 520 350 496 356 L 506 384 L 476 352 L 470 384 L 444 350 L 432 382 L 412 350 L 396 390 L 386 360 Z" fill="url(#m11pelo)" />
            {[[380, 310, 362, 282], [412, 300, 404, 266], [446, 296, 452, 262], [480, 300, 498, 270], [510, 316, 532, 296]].map(([a, b, c, d], i) => <path key={i} d={`M ${a - 12} ${b + 8} L ${c} ${d} L ${a + 14} ${b + 6} Z`} fill="#9a5a26" />)}
            {[[400, 330, 430, 360], [450, 320, 470, 356], [490, 330, 500, 360]].map(([a, b, c, d], i) => <path key={i} d={`M ${a} ${b} Q ${(a + c) / 2 + 6} ${(b + d) / 2} ${c} ${d}`} stroke="#d08a44" strokeWidth={3} fill="none" opacity={0.7} />)}
            {/* ojos grandes mirando abajo, cejas tristes */}
            {[[418, 426], [478, 430]].map(([x, y], i) => (
              <g key={x}>
                <ellipse cx={x} cy={y} rx={24} ry={28} fill="#fff" stroke="#2b1c14" strokeWidth={3} />
                <circle cx={x + 2} cy={y + 12} r={14} fill="#1d1410" />
                <circle cx={x + 7} cy={y + 6} r={4.5} fill="#fff" /><circle cx={x - 3} cy={y + 18} r={2} fill="#fff" />
                <path d={i === 0 ? `M ${x - 22} ${y - 34} Q ${x - 4} ${y - 40} ${x + 14} ${y - 50}` : `M ${x + 22} ${y - 34} Q ${x + 4} ${y - 40} ${x - 14} ${y - 50}`} stroke="#5a2a10" strokeWidth={6} strokeLinecap="round" fill="none" />
              </g>
            ))}
            <ellipse cx={392} cy={462} rx={14} ry={8} fill="#ff7a7a" opacity={0.45} /><ellipse cx={506} cy={466} rx={14} ry={8} fill="#ff7a7a" opacity={0.45} />
            <path d="M 446 452 q 4 8 -2 12" stroke="#c47a4a" strokeWidth={3} fill="none" />
            <path d="M 436 476 Q 450 466 464 476" stroke="#5a2a10" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M 440 486 Q 450 506 460 486 Q 450 492 440 486 Z" fill="#7a4018" />
          </g>
        </g>
      </svg>
      {/* destello al cruzar el vitral */}
      <div style={{ position: "absolute", inset: 0, background: "#fff6d8", opacity: clamp((u - 0.35) / 0.3, 0, 1) * (1 - clamp((u - 0.75) / 0.25, 0, 1)) * 0.9 }} />
    </div>
  );
};
