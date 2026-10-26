import React from "react";
import { AbsoluteFill } from "remotion";
import { prog } from "./kit";

// Cuadro 0 = la miniatura elegida (D:/rtmp/soot_ola/minis/soot05_elegida.png) rehecha en SVG, sin el texto ni la flecha,
// con su nivel de detalle: piedra con textura, adoquín mojado, paja, luz fría de la ventana contra la cálida de la antorcha,
// polvo en el rayo, chispas. La escena cobra vida (antorcha, monedas, ratas, el carcelero que se ríe) y desde 0,2 s la cámara
// se zambulle en el grillete de la muñeca del preso: empalma con el primerísimo plano del grillete del mundo (d0.tsx).
export const PORTADA_FIN = 0.8;
const rr = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const TINTA = "#24140c";

// ── pared de piedra: sillares de tamaño irregular con degradado, grietas y musgo
const Pared: React.FC = () => {
  const bloques: React.ReactNode[] = [];
  let k = 0;
  for (let r = 0; r < 12; r++) {
    let x = -60 - rr(r) * 80;
    const h = 92;
    while (x < 1960) {
      const w = 120 + rr(k * 3.1) * 110;
      const y = r * h - 20;
      const g = ["url(#pt_s1)", "url(#pt_s2)", "url(#pt_s3)"][Math.floor(rr(k * 7.7) * 3)];
      bloques.push(
        <g key={k}>
          <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={10} fill={g} stroke="#120c10" strokeWidth={5} />
          <path d={`M ${x + 10} ${y + 12} L ${x + w - 14} ${y + 10}`} stroke="#8a8494" strokeWidth={3} opacity={0.35} />
          {rr(k * 5.3) > 0.55 && <path d={`M ${x + w * 0.3} ${y + 10} l 12 22 l -8 20 l 14 18`} stroke="#14101a" strokeWidth={3} fill="none" opacity={0.7} />}
          {rr(k * 9.1) > 0.7 && <ellipse cx={x + w * 0.7} cy={y + h - 14} rx={w * 0.22} ry={8} fill="#3d5a3a" opacity={0.45} />}
          {[0, 1, 2].map((j) => <circle key={j} cx={x + 16 + rr(k * 13 + j) * (w - 30)} cy={y + 14 + rr(k * 17 + j) * (h - 30)} r={2 + rr(k + j) * 3} fill="#0e0a10" opacity={0.5} />)}
        </g>
      );
      x += w; k++;
    }
  }
  return <g>{bloques}</g>;
};

const Eslabones: React.FC<{ d: [number, number][]; w?: number }> = ({ d, w = 26 }) => (
  <g>
    {d.slice(1).map(([x, y], i) => {
      const [px, py] = d[i];
      const a = (Math.atan2(y - py, x - px) * 180) / Math.PI;
      const cx = (x + px) / 2, cy = (y + py) / 2, L = Math.hypot(x - px, y - py) * 0.62;
      const plano = i % 2 === 1;
      return (
        <g key={i} transform={`rotate(${a} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={L} ry={plano ? w * 0.18 : w * 0.55} fill="none" stroke={TINTA} strokeWidth={w * 0.42} />
          <ellipse cx={cx} cy={cy} rx={L} ry={plano ? w * 0.18 : w * 0.55} fill="none" stroke="url(#pt_hierro)" strokeWidth={w * 0.28} />
          {!plano && <path d={`M ${cx - L * 0.6} ${cy - w * 0.5} Q ${cx} ${cy - w * 0.75} ${cx + L * 0.6} ${cy - w * 0.5}`} stroke="#c9ccd8" strokeWidth={w * 0.08} fill="none" opacity={0.7} />}
        </g>
      );
    })}
  </g>
);

// grillete abierto, cilindro de hierro con bisagra y remaches
const Grillete: React.FC<{ x: number; y: number; r: number; rot?: number }> = ({ x, y, r, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={0} cy={r * 0.32} rx={r} ry={r * 0.86} fill="#2a2a32" stroke={TINTA} strokeWidth={7} />
    <path d={`M ${-r} 0 L ${-r} ${r * 0.32} A ${r} ${r * 0.86} 0 0 0 ${r} ${r * 0.32} L ${r} 0`} fill="url(#pt_hierro)" stroke={TINTA} strokeWidth={7} />
    <ellipse cx={0} cy={0} rx={r} ry={r * 0.86} fill="url(#pt_hierro)" stroke={TINTA} strokeWidth={7} />
    <ellipse cx={0} cy={0} rx={r * 0.72} ry={r * 0.6} fill="#121016" stroke="#4a4a56" strokeWidth={4} />
    <ellipse cx={-r * 0.1} cy={r * 0.12} rx={r * 0.5} ry={r * 0.38} fill="#1c1a22" />
    <path d={`M ${-r * 0.8} ${-r * 0.42} A ${r * 0.92} ${r * 0.78} 0 0 1 ${r * 0.5} ${-r * 0.7}`} stroke="#d8dbe6" strokeWidth={r * 0.07} fill="none" opacity={0.75} />
    <rect x={r * 0.62} y={-r * 0.2} width={r * 0.42} height={r * 0.42} rx={6} fill="#3a3a44" stroke={TINTA} strokeWidth={5} />
    {[-0.6, 0, 0.6].map((a, i) => <circle key={i} cx={Math.sin(a + 3.6) * r * 0.86} cy={Math.cos(a + 3.6) * r * 0.74} r={r * 0.06} fill="#6a6a76" stroke={TINTA} strokeWidth={2} />)}
    <path d={`M ${-r * 0.5} ${r * 0.9} l ${r * 0.12} ${-r * 0.1} M ${r * 0.2} ${r * 1} l ${r * 0.1} ${-r * 0.12}`} stroke="#8a4a22" strokeWidth={4} opacity={0.7} />
  </g>
);

const Rata: React.FC<{ x: number; y: number; s: number; t: number; k: number; flip?: boolean; boca?: boolean }> = ({ x, y, s, t, k, flip, boca }) => {
  const b = Math.sin(t * 9 + k) * 3;
  const nar = Math.sin(t * 30 + k) * 3;
  const cola = `M 120 30 Q 230 ${70 + Math.sin(t * 6 + k) * 18} 330 ${10 + Math.cos(t * 5 + k) * 14}`;
  return (
    <g transform={`translate(${x} ${y + b}) scale(${flip ? -s : s} ${s})`}>
      <path d={cola} stroke={TINTA} strokeWidth={17} fill="none" strokeLinecap="round" />
      <path d={cola} stroke="#d77d8e" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M 70 60 Q 100 100 70 112 L 30 112 Q 50 96 46 70 Z" fill="url(#pt_rata)" stroke={TINTA} strokeWidth={5} />
      <path d="M 28 112 l -8 8 M 40 114 l -2 10 M 52 114 l 4 9" stroke="#d77d8e" strokeWidth={5} strokeLinecap="round" />
      <path d="M -120 20 Q -110 -60 0 -70 Q 120 -76 150 10 Q 160 80 60 90 L -80 86 Q -130 70 -120 20 Z" fill="url(#pt_rata)" stroke={TINTA} strokeWidth={6} />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${-90 + i * 16} ${-40 - rr(i + k) * 20} l 8 14`} stroke="#6a6676" strokeWidth={3} opacity={0.6} />)}
      <path d="M -60 70 Q 20 90 100 70" stroke="#8a8494" strokeWidth={6} fill="none" opacity={0.5} />
      <path d={`M -100 -20 Q -150 -60 -210 ${-6 + nar * 0.3} Q -238 20 -200 40 Q -150 64 -100 46 Z`} fill="url(#pt_rata)" stroke={TINTA} strokeWidth={6} />
      <ellipse cx={-110} cy={-58} rx={38} ry={44} fill="#5a5664" stroke={TINTA} strokeWidth={6} />
      <ellipse cx={-110} cy={-56} rx={24} ry={30} fill="#e7909e" />
      <ellipse cx={-168} cy={-8} rx={20} ry={22} fill="#fff" stroke={TINTA} strokeWidth={4} />
      <circle cx={-174} cy={-6} r={12} fill="#120c10" /><circle cx={-178} cy={-11} r={4} fill="#fff" />
      <ellipse cx={-226} cy={18 + nar * 0.2} rx={13} ry={11} fill="#e7909e" stroke={TINTA} strokeWidth={4} />
      {boca && <><path d="M -214 40 Q -190 70 -160 46 Q -184 52 -214 40 Z" fill="#7a1f35" stroke={TINTA} strokeWidth={4} /><rect x={-206} y={42} width={9} height={11} fill="#fff" /><rect x={-195} y={44} width={9} height={11} fill="#fff" /></>}
      {[-1, 0, 1].map((j) => <line key={j} x1={-222} y1={22} x2={-290} y2={12 + j * 16 + nar} stroke="#d8d4e0" strokeWidth={2} />)}
      <path d="M -80 70 Q -92 98 -110 104 L -128 104" stroke="#e7909e" strokeWidth={10} strokeLinecap="round" fill="none" />
    </g>
  );
};

// dedo con uña y pliegue
const Dedo: React.FC<{ x: number; y: number; l: number; a: number; w?: number; c?: string }> = ({ x, y, l, a, w = 26, c = "url(#pt_piel)" }) => (
  <g transform={`rotate(${a} ${x} ${y})`}>
    <rect x={x} y={y - w / 2} width={l} height={w} rx={w / 2} fill={c} stroke={TINTA} strokeWidth={5} />
    <path d={`M ${x + l * 0.55} ${y - w * 0.3} q 4 ${w * 0.3} 0 ${w * 0.6}`} stroke="#b8704e" strokeWidth={2.5} fill="none" />
    <ellipse cx={x + l - w * 0.42} cy={y} rx={w * 0.26} ry={w * 0.3} fill="#f9d4bc" opacity={0.8} />
  </g>
);

export const Portada: React.FC<{ t: number }> = ({ t }) => {
  if (t >= PORTADA_FIN) return null;
  // empuje lento y después zambullida en el grillete de la muñeca (835, 728)
  const z = 1 + 0.03 * prog(t, 0, 0.2) + 4 * Math.pow(prog(t, 0.2, PORTADA_FIN), 2);
  const op = 1 - prog(t, 0.6, PORTADA_FIN);
  const fl = 1 + 0.08 * Math.sin(t * 31) + 0.05 * Math.sin(t * 17);
  const ri = Math.sin(Math.min(1, t / 0.4) * Math.PI) * 0.6; // risa del carcelero
  const bri = 0.6 + 0.4 * Math.abs(Math.sin(t * 7));
  return (
    <AbsoluteFill style={{ opacity: op, transformOrigin: "835px 728px", transform: `scale(${z})` }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="pt_s1" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#5a4c48" /><stop offset="1" stopColor="#2e2428" /></linearGradient>
          <linearGradient id="pt_s2" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#625450" /><stop offset="1" stopColor="#36292c" /></linearGradient>
          <linearGradient id="pt_s3" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#4e4646" /><stop offset="1" stopColor="#262024" /></linearGradient>
          <radialGradient id="pt_calida" cx="0.93" cy="0.12" r="0.95"><stop offset="0" stopColor="#ffb040" stopOpacity={0.9} /><stop offset="0.4" stopColor="#e2701c" stopOpacity={0.5} /><stop offset="1" stopColor="#e2701c" stopOpacity={0} /></radialGradient>
          <radialGradient id="pt_fria" cx="0.59" cy="0.12" r="0.45"><stop offset="0" stopColor="#7ab8ff" stopOpacity={0.55} /><stop offset="1" stopColor="#3a6aaa" stopOpacity={0} /></radialGradient>
          <radialGradient id="pt_oscuro" cx="0.5" cy="0.55" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#05030a" stopOpacity={0.55} /></radialGradient>
          <linearGradient id="pt_rayo" x1="0.7" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#cfe6ff" stopOpacity={0.55} /><stop offset="1" stopColor="#cfe6ff" stopOpacity={0} /></linearGradient>
          <linearGradient id="pt_vidrio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6f4ff" /><stop offset="1" stopColor="#7fb2e6" /></linearGradient>
          <radialGradient id="pt_fuego" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe08a" stopOpacity={0.95} /><stop offset="0.4" stopColor="#ff9a2a" stopOpacity={0.45} /><stop offset="1" stopColor="#ff7a1a" stopOpacity={0} /></radialGradient>
          <radialGradient id="pt_oro" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6c0" stopOpacity={0.95} /><stop offset="1" stopColor="#ffc93a" stopOpacity={0} /></radialGradient>
          <linearGradient id="pt_madera" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2e1a" /><stop offset="0.5" stopColor="#7a5232" /><stop offset="1" stopColor="#4a2e1a" /></linearGradient>
          <linearGradient id="pt_hierro" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#9a9eac" /><stop offset="0.45" stopColor="#5a5c68" /><stop offset="1" stopColor="#2c2c34" /></linearGradient>
          <linearGradient id="pt_casco" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stopColor="#8a8e9c" /><stop offset="0.5" stopColor="#4e5260" /><stop offset="1" stopColor="#2a2c36" /></linearGradient>
          <radialGradient id="pt_piel" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#ffd2b0" /><stop offset="0.6" stopColor="#f2aa80" /><stop offset="1" stopColor="#c87a56" /></radialGradient>
          <radialGradient id="pt_pielC" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#ffc8a4" /><stop offset="0.6" stopColor="#ee9c74" /><stop offset="1" stopColor="#b8684a" /></radialGradient>
          <linearGradient id="pt_rojo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8443a" /><stop offset="0.55" stopColor="#b8221e" /><stop offset="1" stopColor="#6a0e12" /></linearGradient>
          <linearGradient id="pt_piel_oso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5a34" /><stop offset="1" stopColor="#4a2c16" /></linearGradient>
          <linearGradient id="pt_tunica" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8c29a" /><stop offset="0.6" stopColor="#ad946a" /><stop offset="1" stopColor="#6e5a3c" /></linearGradient>
          <radialGradient id="pt_gorro" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#f2c24a" /><stop offset="0.6" stopColor="#c8901e" /><stop offset="1" stopColor="#7a5210" /></radialGradient>
          <radialGradient id="pt_rata" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stopColor="#7a7686" /><stop offset="0.6" stopColor="#4a4656" /><stop offset="1" stopColor="#24202c" /></radialGradient>
          <radialGradient id="pt_hueso" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stopColor="#efe2c4" /><stop offset="0.7" stopColor="#bfae88" /><stop offset="1" stopColor="#6e6248" /></radialGradient>
          <radialGradient id="pt_adoq" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stopColor="#6a5a4a" /><stop offset="1" stopColor="#2a2018" /></radialGradient>
          <linearGradient id="pt_moneda" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2a0" /><stop offset="0.5" stopColor="#f0b820" /><stop offset="1" stopColor="#a8700a" /></linearGradient>
        </defs>

        {/* ── fondo: pared de sillares + luz fría de la ventana y cálida de la antorcha */}
        <rect width={1920} height={1080} fill="#1e1c26" />
        <Pared />
        <path d="M 1020 250 L 1020 70 Q 1135 -40 1250 70 L 1250 250 Z" fill="#16141c" stroke="#0c0a10" strokeWidth={10} />
        <path d="M 1040 236 L 1040 78 Q 1135 -14 1230 78 L 1230 236 Z" fill="url(#pt_vidrio)" />
        {[1085, 1135, 1185].map((x) => <rect key={x} x={x - 8} y={10} width={16} height={230} fill="#2a2a36" stroke="#0c0a10" strokeWidth={3} />)}
        {[90, 160].map((y) => <rect key={y} x={1036} y={y} width={198} height={12} fill="#2a2a36" />)}
        <path d="M 1020 250 L 1250 250 L 1262 268 L 1008 268 Z" fill="#3a3846" />
        <g opacity={0.8 + 0.1 * Math.sin(t * 3)} style={{ mixBlendMode: "screen" }}>
          <path d="M 1040 240 L 1240 240 L 1180 900 L 760 900 Z" fill="url(#pt_rayo)" />
          <path d="M 1080 240 L 1130 240 L 990 820 L 900 820 Z" fill="url(#pt_rayo)" opacity={0.7} />
          <path d="M 1170 240 L 1220 240 L 1160 860 L 1080 860 Z" fill="url(#pt_rayo)" opacity={0.6} />
        </g>
        {Array.from({ length: 46 }, (_, i) => {
          const px = 820 + rr(i) * 400 - rr(i * 3) * 300 * rr(i * 5) + Math.sin(t * 1.5 + i) * 8;
          const py = 260 + rr(i * 7) * 600 + t * 20 * (rr(i * 11) - 0.3);
          return <circle key={i} cx={px} cy={py} r={1.5 + rr(i * 13) * 3} fill="#e8f2ff" opacity={0.25 + 0.5 * rr(i * 17) * (0.7 + 0.3 * Math.sin(t * 6 + i))} />;
        })}
        <rect width={1920} height={1080} fill="url(#pt_fria)" />
        <Eslabones d={Array.from({ length: 4 }, (_, i) => [1300 + Math.sin(t * 2) * 2, i * 40 - 10])} w={20} />
        <Eslabones d={Array.from({ length: 6 }, (_, i) => [1895, i * 42 - 10])} w={20} />
        {/* antorcha */}
        <circle cx={1795} cy={110} r={360 * fl} fill="url(#pt_fuego)" />
        <path d="M 1760 150 L 1830 150 L 1818 230 L 1772 230 Z" fill="#3a2414" stroke={TINTA} strokeWidth={5} />
        <rect x={1772} y={150} width={46} height={14} fill="#5a3a20" />
        <path d="M 1780 230 L 1810 230 L 1806 300 L 1784 300 Z" fill="#2a1a10" stroke={TINTA} strokeWidth={4} />
        <path d="M 1795 260 L 1880 240 L 1880 300" stroke="#1a1410" strokeWidth={14} fill="none" />
        <g transform={`translate(1795 150) scale(${fl} ${fl * (1 + Math.sin(t * 11) * 0.06)})`}>
          <path d="M 0 -150 C 40 -100 56 -60 40 -20 C 26 6 -26 6 -40 -20 C -56 -60 -30 -100 0 -150 Z" fill="#ff8a1e" />
          <path d="M 4 -110 C 26 -76 32 -50 22 -24 C 12 -6 -12 -6 -22 -24 C -32 -50 -16 -76 4 -110 Z" fill="#ffd34a" />
          <path d="M 2 -66 C 12 -50 14 -38 8 -26 C 4 -20 -4 -20 -8 -26 C -14 -38 -8 -50 2 -66 Z" fill="#fff6c8" />
        </g>
        {Array.from({ length: 12 }, (_, i) => {
          const u = (t * 0.9 + rr(i)) % 1;
          return <circle key={i} cx={1795 + (rr(i * 3) - 0.5) * 90 + Math.sin(t * 5 + i) * 14} cy={120 - u * 220} r={2 + rr(i * 7) * 3} fill="#ffcf6a" opacity={1 - u} />;
        })}
        <rect width={1920} height={1080} fill="url(#pt_calida)" />

        {/* ── puerta de tablones con herrajes */}
        <g>
          <rect x={-30} y={-10} width={230} height={880} fill="url(#pt_madera)" stroke={TINTA} strokeWidth={8} />
          {[0, 1, 2].map((i) => <rect key={i} x={-30 + i * 76} y={-10} width={76} height={880} fill="none" stroke="#2a180c" strokeWidth={6} />)}
          {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M ${-10 + (i % 3) * 76 + rr(i) * 40} ${20 + Math.floor(i / 3) * 140} q 10 30 0 60`} stroke="#3a2412" strokeWidth={3} fill="none" opacity={0.7} />)}
          {[380, 730].map((y) => (
            <g key={y}>
              <rect x={-30} y={y} width={250} height={72} rx={8} fill="url(#pt_hierro)" stroke={TINTA} strokeWidth={6} />
              {[20, 100, 180].map((x) => <circle key={x} cx={x} cy={y + 36} r={13} fill="#7a7c88" stroke={TINTA} strokeWidth={4} />)}
            </g>
          ))}
          <rect x={200} y={-10} width={26} height={880} fill="#1a120c" opacity={0.6} />
        </g>
        <Eslabones d={Array.from({ length: 6 }, (_, i) => [238 + Math.sin(i) * 4, 360 + i * 38])} w={22} />
        {/* cajones al fondo */}
        <g>
          <rect x={1100} y={720} width={260} height={230} fill="url(#pt_madera)" stroke={TINTA} strokeWidth={7} />
          {[760, 820, 880].map((y) => <line key={y} x1={1100} y1={y} x2={1360} y2={y} stroke="#3a2412" strokeWidth={5} />)}
          <rect x={1180} y={680} width={160} height={60} fill="#86603a" stroke={TINTA} strokeWidth={6} />
          <rect x={1220} y={640} width={110} height={50} fill="#7a5530" stroke={TINTA} strokeWidth={5} />
        </g>

        {/* ── piso de adoquín mojado con paja */}
        <path d="M 0 880 Q 960 830 1920 870 L 1920 1080 L 0 1080 Z" fill="#2a2018" />
        {Array.from({ length: 70 }, (_, i) => {
          const fila = Math.floor(i / 14), col = i % 14;
          const cx = col * 145 + (fila % 2) * 70 + rr(i) * 20, cy = 900 + fila * 42 + rr(i * 3) * 10;
          return <ellipse key={i} cx={cx} cy={cy} rx={64 + fila * 3} ry={17 + fila * 2} fill="url(#pt_adoq)" stroke="#120c08" strokeWidth={4} />;
        })}
        <ellipse cx={1300} cy={1000} rx={700} ry={110} fill="#ff9a2a" opacity={0.18} />
        <ellipse cx={1050} cy={1000} rx={170} ry={22} fill="#7ab8ff" opacity={0.18} />
        <ellipse cx={1600} cy={960} rx={140} ry={16} fill="#ffb040" opacity={0.22} />
        <ellipse cx={980} cy={1050} rx={90} ry={10} fill="#ffe08a" opacity={0.25} />
        {Array.from({ length: 90 }, (_, i) => {
          const x = rr(i * 2.3) * 1920, y = 880 + rr(i * 4.1) * 200, a = ((rr(i * 6.7) - 0.5) * 70 * Math.PI) / 180, l = 30 + rr(i) * 50;
          return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * l} y2={y + Math.sin(a) * l} stroke={rr(i * 9) > 0.5 ? "#d8aa3e" : "#a87a28"} strokeWidth={3 + rr(i * 3) * 2} strokeLinecap="round" opacity={0.85} />;
        })}

        {/* ── calavera y costillas */}
        <g transform="translate(232 755)">
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M -60 ${70 + i * 22} Q 0 ${50 + i * 22} 60 ${74 + i * 22}`} stroke="url(#pt_hueso)" strokeWidth={13} fill="none" strokeLinecap="round" />)}
          <path d="M -72 -10 Q -76 -84 0 -88 Q 76 -84 72 -10 Q 70 30 46 44 L 46 70 L -46 70 L -46 44 Q -70 30 -72 -10 Z" fill="url(#pt_hueso)" stroke={TINTA} strokeWidth={7} />
          <ellipse cx={-28} cy={0} rx={22} ry={25} fill="#1e140e" /><ellipse cx={28} cy={0} rx={22} ry={25} fill="#1e140e" />
          <path d="M 0 22 L -11 44 L 11 44 Z" fill="#1e140e" />
          {[-30, -15, 0, 15, 30].map((x) => <rect key={x} x={x - 6} y={50} width={11} height={22} rx={3} fill="#efe2c4" stroke={TINTA} strokeWidth={3} />)}
          <path d="M -40 -60 q 20 10 10 30" stroke="#6e6248" strokeWidth={4} fill="none" />
          {[0, 1, 2, 3, 4, 5].map((j) => <circle key={j} cx={-60 + rr(j) * 120} cy={-70 + rr(j * 3) * 120} r={4} fill="#5a4a30" opacity={0.6} />)}
        </g>

        {/* ── el preso, de rodillas, con la mano extendida y las monedas */}
        <g>
          <Eslabones d={[[850, 760], [880, 830], [860, 900], [810, 960], [740, 1000], [660, 1020], [570, 1025], [480, 1020], [390, 1010]]} w={30} />
          <path d="M 380 1000 Q 520 1050 720 1030 Q 760 1000 720 975 Q 560 960 400 960 Z" fill="url(#pt_piel)" stroke={TINTA} strokeWidth={6} />
          <path d="M 400 930 Q 560 900 700 950 Q 740 990 690 1010 Q 540 1010 420 990 Z" fill="url(#pt_piel)" stroke={TINTA} strokeWidth={6} />
          <path d="M 640 960 q 26 6 36 26" stroke="#a8604a" strokeWidth={4} fill="none" />
          <path d="M 330 1010 Q 380 990 430 1010 Q 440 1040 400 1046 Q 340 1048 330 1010 Z" fill="url(#pt_piel)" stroke={TINTA} strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={340 + i * 16} cy={1040 + (i % 2) * 2} rx={8} ry={7} fill="#f6b894" stroke={TINTA} strokeWidth={3} />)}
          {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={440 + rr(i * 9) * 260} cy={960 + rr(i * 4) * 50} r={4 + rr(i) * 6} fill="#7a4a2a" opacity={0.45} />)}
          {/* túnica rota con remiendos */}
          <path d="M 420 690 Q 520 640 650 650 L 700 700 Q 760 780 770 860 L 740 900 L 720 870 L 700 920 L 670 880 L 640 935 L 610 890 L 570 930 L 545 880 L 505 925 L 480 875 L 440 915 L 420 870 L 380 900 L 360 850 L 330 870 Q 340 760 420 690 Z" fill="url(#pt_tunica)" stroke={TINTA} strokeWidth={7} />
          {[[470, 760, 0], [610, 800, 12], [430, 840, -8], [680, 760, 6], [540, 700, -4]].map(([x, y, a], i) => (
            <g key={i} transform={`rotate(${a} ${x} ${y})`}>
              <rect x={x - 26} y={y - 22} width={52} height={44} rx={4} fill={["#7a5a3a", "#8a6a44", "#6a4a2e"][i % 3]} stroke={TINTA} strokeWidth={3} />
              <path d={`M ${x - 22} ${y - 18} l 6 0 m 6 0 l 6 0 m 6 0 l 6 0 M ${x - 22} ${y + 18} l 6 0 m 6 0 l 6 0 m 6 0 l 6 0`} stroke="#e8d6a8" strokeWidth={2} />
            </g>
          ))}
          {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={380 + rr(i * 3) * 360} cy={700 + rr(i * 5) * 200} r={4 + rr(i) * 8} fill="#5a4228" opacity={0.45} />)}
          <path d="M 480 700 Q 520 760 500 840" stroke="#8a7254" strokeWidth={5} fill="none" opacity={0.7} />
          {/* hombro y brazo extendido */}
          <path d="M 640 660 Q 720 680 760 730 L 720 770 Q 690 730 630 720 Z" fill="url(#pt_tunica)" stroke={TINTA} strokeWidth={6} />
          <path d="M 735 745 Q 840 728 960 700" stroke={TINTA} strokeWidth={76} strokeLinecap="round" fill="none" />
          <path d="M 735 745 Q 840 728 960 700" stroke="url(#pt_piel)" strokeWidth={64} strokeLinecap="round" fill="none" />
          <path d="M 780 760 Q 860 750 940 728" stroke="#c87a56" strokeWidth={6} fill="none" opacity={0.5} />
          {/* grillete de la muñeca (adonde se zambulle la cámara) */}
          <g transform="translate(835 728) rotate(-12)">
            <ellipse cx={0} cy={0} rx={30} ry={66} fill="#2a2a32" stroke={TINTA} strokeWidth={7} />
            <rect x={-30} y={-66} width={56} height={132} fill="url(#pt_hierro)" stroke={TINTA} strokeWidth={7} />
            <ellipse cx={26} cy={0} rx={30} ry={66} fill="url(#pt_hierro)" stroke={TINTA} strokeWidth={7} />
            <path d="M -24 -56 L 20 -56" stroke="#d8dbe6" strokeWidth={6} opacity={0.8} />
            {[-40, 0, 40].map((y) => <circle key={y} cx={2} cy={y} r={6} fill="#6a6a76" stroke={TINTA} strokeWidth={2} />)}
            <path d="M -10 60 l 6 -10 M 10 64 l 6 -12" stroke="#8a4a22" strokeWidth={4} opacity={0.7} />
          </g>
          {/* mano abierta, palma arriba, con monedas */}
          <path d="M 940 690 Q 1000 660 1070 668 Q 1110 676 1100 700 Q 1060 734 980 738 Q 930 736 920 712 Z" fill="url(#pt_piel)" stroke={TINTA} strokeWidth={6} />
          <Dedo x={1040} y={676} l={70} a={-8} w={24} />
          <Dedo x={1040} y={700} l={76} a={2} w={24} />
          <Dedo x={1030} y={722} l={66} a={10} w={22} />
          <Dedo x={960} y={690} l={56} a={-48} w={26} />
          <circle cx={1010} cy={640} r={140 * bri} fill="url(#pt_oro)" />
          {[[960, 676, -6], [1006, 664, 4], [1048, 652, -10], [990, 640, 8], [1030, 626, -4], [1060, 618, 12]].map(([x, y, a], i) => (
            <g key={i} transform={`rotate(${a} ${x} ${y})`}>
              <ellipse cx={x} cy={y + 6} rx={34} ry={14} fill="#8a5a08" stroke={TINTA} strokeWidth={4} />
              <ellipse cx={x} cy={y} rx={34} ry={14} fill="url(#pt_moneda)" stroke={TINTA} strokeWidth={4} />
              <ellipse cx={x} cy={y} rx={22} ry={8} fill="none" stroke="#c88a10" strokeWidth={3} />
              <path d={`M ${x - 18} ${y - 4} q 8 -6 16 -6`} stroke="#fffbe0" strokeWidth={3} fill="none" />
            </g>
          ))}
          {[[1000, 600, 0], [1080, 610, 2], [950, 640, 4]].map(([x, y, k]) => {
            const s = Math.max(0, Math.sin(t * 9 + k * 2)) * 1.1 * bri;
            return <path key={k} d={`M ${x} ${y - 24 * s} L ${x + 6 * s} ${y - 6 * s} L ${x + 24 * s} ${y} L ${x + 6 * s} ${y + 6 * s} L ${x} ${y + 24 * s} L ${x - 6 * s} ${y + 6 * s} L ${x - 24 * s} ${y} L ${x - 6 * s} ${y - 6 * s} Z`} fill="#fffbe0" />;
          })}
          {/* cuello y cabeza */}
          <path d="M 560 620 L 640 620 L 650 680 L 560 690 Z" fill="url(#pt_piel)" stroke={TINTA} strokeWidth={6} />
          <path d="M 470 520 Q 466 420 590 410 Q 720 410 745 520 Q 760 640 640 680 Q 520 700 480 620 Z" fill="url(#pt_piel)" stroke={TINTA} strokeWidth={7} />
          <ellipse cx={745} cy={540} rx={28} ry={40} fill="url(#pt_piel)" stroke={TINTA} strokeWidth={6} />
          <path d="M 742 526 q 10 14 0 28" stroke="#b8704e" strokeWidth={4} fill="none" />
          <path d="M 455 540 Q 440 620 470 650 Q 470 600 490 590 Q 480 560 500 540 Z" fill="#e0b040" stroke={TINTA} strokeWidth={5} />
          <path d="M 700 500 Q 740 540 730 590 Q 720 560 700 550 Z" fill="#e0b040" stroke={TINTA} strokeWidth={4} />
          <path d="M 560 470 L 580 500 L 600 466 L 625 498 L 640 462 L 668 494 L 690 470" stroke={TINTA} strokeWidth={5} fill="#e8bc48" />
          {/* gorro de cuero */}
          <path d="M 400 520 Q 380 330 560 320 Q 720 318 740 460 Q 600 430 400 520 Z" fill="url(#pt_gorro)" stroke={TINTA} strokeWidth={8} />
          <path d="M 384 540 Q 560 420 760 470 Q 770 500 750 506 Q 560 466 402 570 Q 376 566 384 540 Z" fill="#a8741a" stroke={TINTA} strokeWidth={7} />
          <path d="M 440 420 Q 520 360 620 352" stroke="#ffe08a" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
          <path d="M 560 320 Q 580 400 570 450" stroke="#8a5a10" strokeWidth={5} fill="none" strokeDasharray="10 8" />
          <circle cx={556} cy={316} r={18} fill="#a8741a" stroke={TINTA} strokeWidth={5} />
          {/* cara de miedo */}
          <ellipse cx={530} cy={565} rx={48} ry={54} fill="#fff" stroke={TINTA} strokeWidth={6} />
          <ellipse cx={660} cy={520} rx={44} ry={50} fill="#fff" stroke={TINTA} strokeWidth={6} />
          <circle cx={548 + Math.sin(t * 2) * 2} cy={552} r={25} fill="#140c10" /><circle cx={676 + Math.sin(t * 2) * 2} cy={506} r={23} fill="#140c10" />
          <circle cx={540} cy={542} r={8} fill="#fff" /><circle cx={668} cy={497} r={7} fill="#fff" />
          <path d="M 480 495 Q 515 488 552 500" stroke="#8a5a1a" strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M 616 460 Q 650 438 690 448" stroke="#8a5a1a" strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M 604 560 q 12 22 -4 30" stroke="#c87a56" strokeWidth={6} fill="none" />
          <path d={`M 580 640 Q 600 ${598 - 6 * Math.sin(t * 8)} 650 612 Q 668 650 640 672 Q 600 684 584 662 Z`} fill="#7a1f35" stroke={TINTA} strokeWidth={6} />
          <path d="M 596 664 Q 620 650 640 668 Q 620 680 596 664 Z" fill="#e05a6a" />
          <path d="M 592 622 Q 620 608 648 616" stroke="#fff" strokeWidth={7} fill="none" />
          <ellipse cx={500} cy={630} rx={34} ry={20} fill="#ee7a7e" opacity={0.45} /><ellipse cx={700} cy={590} rx={30} ry={18} fill="#ee7a7e" opacity={0.45} />
          {[[490, 650, 10], [520, 620, 7], [700, 620, 8], [560, 440, 6], [640, 640, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#8a5a3a" opacity={0.5} />)}
        </g>

        {/* ── el carcelero */}
        <g transform={`translate(0 ${-ri * 6})`}>
          <path d="M 1150 1080 Q 1130 620 1230 470 Q 1380 400 1560 420 Q 1800 450 1920 560 L 1920 1080 Z" fill="url(#pt_rojo)" stroke={TINTA} strokeWidth={8} />
          <path d="M 1320 640 Q 1330 860 1300 1080" stroke="#7a1414" strokeWidth={8} fill="none" opacity={0.7} />
          <path d="M 1700 600 Q 1720 840 1700 1080" stroke="#6a0e12" strokeWidth={10} fill="none" opacity={0.6} />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={1250 + rr(i * 3) * 600} cy={600 + rr(i * 7) * 400} r={5 + rr(i) * 8} fill="#5a0e0e" opacity={0.35} />)}
          {/* cinturón con hebilla de oro */}
          <path d="M 1200 720 Q 1500 700 1920 760 L 1920 830 Q 1500 770 1200 790 Z" fill="#5a3418" stroke={TINTA} strokeWidth={7} />
          <rect x={1460} y={700} width={130} height={110} rx={10} fill="none" stroke={TINTA} strokeWidth={26} />
          <rect x={1460} y={700} width={130} height={110} rx={10} fill="none" stroke="#e0aa30" strokeWidth={16} />
          <rect x={1515} y={712} width={12} height={86} fill="#e0aa30" stroke={TINTA} strokeWidth={3} />
          {/* tahalí cruzado */}
          <path d="M 1300 440 Q 1500 560 1640 760" stroke={TINTA} strokeWidth={66} fill="none" />
          <path d="M 1300 440 Q 1500 560 1640 760" stroke="#5a3418" strokeWidth={54} fill="none" />
          <rect x={1420} y={455} width={110} height={90} rx={10} fill="none" stroke={TINTA} strokeWidth={22} />
          <rect x={1420} y={455} width={110} height={90} rx={10} fill="none" stroke="#9a9eac" strokeWidth={12} />
          <rect x={1468} y={462} width={10} height={76} fill="#9a9eac" stroke={TINTA} strokeWidth={3} />
          {/* cuello de piel */}
          <path d="M 1160 470 Q 1220 330 1420 380 Q 1620 300 1880 380 Q 1920 440 1860 480 L 1840 470 L 1820 500 L 1790 476 L 1760 506 L 1730 480 L 1690 510 L 1660 480 L 1620 500 L 1600 470 Q 1500 460 1440 440 L 1400 470 L 1370 440 L 1330 470 L 1300 440 L 1260 470 L 1230 446 L 1200 476 Z" fill="url(#pt_piel_oso)" stroke={TINTA} strokeWidth={7} />
          {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${1200 + i * 22} ${400 + rr(i) * 40} l ${6 + rr(i * 3) * 8} ${18 + rr(i * 5) * 14}`} stroke="#3a2010" strokeWidth={4} opacity={0.6} />)}
          {/* brazo que agarra las monedas */}
          <path d="M 1270 470 Q 1180 520 1120 590" stroke={TINTA} strokeWidth={140} strokeLinecap="round" fill="none" />
          <path d="M 1270 470 Q 1180 520 1120 590" stroke="url(#pt_rojo)" strokeWidth={126} strokeLinecap="round" fill="none" />
          <path d="M 1150 560 Q 1100 590 1080 620" stroke={TINTA} strokeWidth={100} strokeLinecap="round" fill="none" />
          <path d="M 1150 560 Q 1100 590 1080 620" stroke="url(#pt_pielC)" strokeWidth={88} strokeLinecap="round" fill="none" />
          <path d="M 1020 570 Q 1060 520 1130 540 Q 1160 580 1120 630 Q 1080 660 1040 630 Z" fill="url(#pt_pielC)" stroke={TINTA} strokeWidth={6} />
          <Dedo x={1048} y={580} l={52} a={150} w={28} c="url(#pt_pielC)" />
          <Dedo x={1060} y={610} l={46} a={168} w={26} c="url(#pt_pielC)" />
          <Dedo x={1070} y={630} l={40} a={186} w={24} c="url(#pt_pielC)" />
          <Dedo x={1060} y={560} l={44} a={128} w={30} c="url(#pt_pielC)" />
          {/* brazo con las cadenas y el puño */}
          <path d="M 1800 470 Q 1840 520 1790 560" stroke={TINTA} strokeWidth={150} strokeLinecap="round" fill="none" />
          <path d="M 1800 470 Q 1840 520 1790 560" stroke="url(#pt_rojo)" strokeWidth={136} strokeLinecap="round" fill="none" />
          <rect x={1740} y={500} width={110} height={130} rx={16} fill="#6a4426" stroke={TINTA} strokeWidth={7} transform="rotate(-10 1795 565)" />
          <path d="M 1752 530 L 1840 520 M 1756 600 L 1846 590" stroke="#3a2412" strokeWidth={5} />
          <path d="M 1600 500 Q 1720 490 1750 560 Q 1760 630 1690 650 Q 1600 660 1580 600 Q 1570 540 1600 500 Z" fill="url(#pt_pielC)" stroke={TINTA} strokeWidth={7} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${1600 + i * 34} 520 q 14 -12 28 0`} stroke={TINTA} strokeWidth={5} fill="none" />)}
          <path d="M 1590 580 Q 1620 600 1650 586" stroke="#b8684a" strokeWidth={5} fill="none" />
          <Eslabones d={[[1620, 560], [1560, 540], [1500, 560], [1460, 620], [1430, 690], [1410, 760], [1400, 820]]} w={34} />
          <Eslabones d={[[1700, 640], [1720, 700], [1740, 760], [1755, 800]]} w={34} />
          <g transform={`rotate(${Math.sin(t * 4) * 3} 1400 820)`}><Grillete x={1395} y={895} r={112} rot={-8} /></g>
          <g transform={`rotate(${Math.sin(t * 4 + 1) * 3} 1755 800)`}><Grillete x={1760} y={865} r={112} rot={6} /></g>
          {/* cabeza */}
          <path d="M 1340 260 Q 1330 160 1450 150 Q 1590 150 1600 270 Q 1610 400 1480 430 Q 1360 440 1340 360 Z" fill="url(#pt_pielC)" stroke={TINTA} strokeWidth={8} />
          <ellipse cx={1600} cy={300} rx={30} ry={44} fill="url(#pt_pielC)" stroke={TINTA} strokeWidth={6} />
          <path d="M 1560 230 Q 1610 230 1620 300 Q 1610 340 1590 350 Q 1600 280 1560 260 Z" fill="#5a3418" stroke={TINTA} strokeWidth={5} />
          <path d="M 1340 260 Q 1320 300 1340 340 Q 1350 290 1370 270 Z" fill="#5a3418" stroke={TINTA} strokeWidth={5} />
          <ellipse cx={1392} cy={282} rx={30} ry={32} fill="#fff" stroke={TINTA} strokeWidth={5} />
          <ellipse cx={1484} cy={256} rx={32} ry={34} fill="#fff" stroke={TINTA} strokeWidth={5} />
          <circle cx={1400} cy={290} r={15} fill="#140c10" /><circle cx={1476} cy={264} r={16} fill="#140c10" />
          <circle cx={1404} cy={284} r={5} fill="#fff" /><circle cx={1480} cy={258} r={5} fill="#fff" />
          <path d="M 1350 240 Q 1380 236 1430 262" stroke="#2a160c" strokeWidth={20} fill="none" strokeLinecap="round" />
          <path d="M 1530 208 Q 1490 212 1450 240" stroke="#2a160c" strokeWidth={20} fill="none" strokeLinecap="round" />
          <ellipse cx={1500} cy={360} rx={34} ry={24} fill="#ee7a6e" opacity={0.5} />
          <path d="M 1412 300 Q 1380 330 1400 350 Q 1430 368 1458 346 Q 1470 320 1440 300 Z" fill="#f08a72" stroke={TINTA} strokeWidth={6} />
          <ellipse cx={1414} cy={318} rx={9} ry={6} fill="#ffd0b8" />
          <path d={`M 1428 384 Q 1500 ${396 + ri * 24} 1560 330 Q 1572 380 1530 420 Q 1470 446 1430 412 Z`} fill="#6a1a28" stroke={TINTA} strokeWidth={6} />
          <path d="M 1436 392 Q 1500 392 1552 344 L 1548 362 Q 1500 404 1442 406 Z" fill="#fff" stroke={TINTA} strokeWidth={3} />
          <rect x={1452} y={396} width={20} height={26} rx={4} fill="#fff" stroke={TINTA} strokeWidth={3} />
          <path d="M 1470 420 Q 1500 432 1526 414" fill="#d8505a" />
          <path d="M 1426 350 Q 1370 340 1340 382 Q 1350 400 1372 386 Q 1400 370 1430 378 Q 1460 362 1500 368 Q 1540 352 1548 316 Q 1520 330 1490 340 Q 1460 336 1426 350 Z" fill="#4a2a17" stroke={TINTA} strokeWidth={6} />
          {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={1380 + rr(i * 3) * 180} cy={400 + rr(i * 5) * 30} r={2.5} fill="#5a3a28" opacity={0.6} />)}
          {/* casco de hierro con remaches */}
          <path d="M 1340 190 Q 1340 30 1480 20 Q 1630 26 1640 180 Z" fill="url(#pt_casco)" stroke={TINTA} strokeWidth={8} />
          <path d="M 1250 236 Q 1300 160 1480 160 Q 1690 160 1730 230 Q 1700 280 1480 268 Q 1290 274 1250 236 Z" fill="url(#pt_casco)" stroke={TINTA} strokeWidth={8} />
          <path d="M 1330 196 Q 1480 170 1648 190 L 1650 216 Q 1480 200 1328 222 Z" fill="#3a3c46" stroke={TINTA} strokeWidth={5} />
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={1340 + i * 38} cy={206 - Math.sin((i / 8) * Math.PI) * 8} r={6} fill="#a8acb8" stroke={TINTA} strokeWidth={2} />)}
          <path d="M 1380 120 Q 1420 50 1490 42" stroke="#d8dbe6" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.8} />
          <path d="M 1290 226 Q 1480 196 1700 222" stroke="#b8bcc8" strokeWidth={6} fill="none" opacity={0.6} />
          <circle cx={1480} cy={16} r={16} fill="#5a5e6c" stroke={TINTA} strokeWidth={5} />
          <path d="M 1600 60 Q 1640 120 1630 170" stroke="#ffb040" strokeWidth={8} fill="none" opacity={0.6} />
        </g>

        {/* ratas */}
        <Rata x={140 + Math.min(1, t) * 20} y={940} s={0.95} t={t} k={1} flip boca />
        <Rata x={1030} y={945} s={0.42} t={t} k={2} />
        <Rata x={1700 - Math.min(1, t) * 30} y={1030} s={0.5} t={t} k={3} />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={760 + rr(i * 5) * 600} cy={1000 + rr(i * 7) * 60} r={2 + rr(i) * 4} fill="#cfe6ff" opacity={0.5} />)}
        <rect width={1920} height={1080} fill="url(#pt_oscuro)" />
      </svg>
    </AbsoluteFill>
  );
};
