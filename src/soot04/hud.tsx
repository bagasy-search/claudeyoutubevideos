import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande } from "./kit";
import { Svg } from "./kit3";
import { Rayos2 } from "./insertos";
import { mezcla } from "./mundo";
import { Chico } from "./reparto";

// Piezas de pantalla de Soot 04: cartel de trampa, boyas del mapa del viaje, mapa de Massachusetts,
// mapa del Pacífico (ruta del Essex), colectivo para la escala, iconos.

// cartel de trampa: "TRAP #n" + nombre + las 7 bolitas
export const CartelTrampa: React.FC<{ t: number; t0: number; t1: number; n: number; nombre: string; col?: string }> = ({ t, t0, t1, n, nombre, col = C.rojo }) => {
  if (t < t0 || t > t1 + 0.4) return null;
  const out = interpolate(t, [t1, t1 + 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `circle(${Math.min(1, (t - t0) / 0.22) * 82}% at 50% 40%)` }}><Rayos2 t={t} c1={col} c2={mezcla(col, "#1b1240", 0.18)} cy={420} /></div>
      <Grande t={t} t0={t0 + 0.05} text={`TRAP #${n}`} y={300} size={210} color={C.crema} />
      <Chip t={t} t0={t0 + 0.55} text={nombre} color={C.noche} x={960} y={500} centro size={84} />
      {t > t0 + 0.15 && <Chico x={320} y={1290} h={1050} t={t} expr={(["miedo", "sorpresa", "triste", "miedo", "enojado", "miedo", "triste"] as const)[(n - 1) % 7]} salta={t0 + 0.2} bD={n % 2 ? 150 : 40} cD={n % 2 ? 20 : 120} bI={n % 2 ? 40 : 150} cI={n % 2 ? 110 : 20} mira={0.7} />}
      <Svg x={1650} y={640 + Math.sin(t * 2.4) * 18} s={2.0 * ent(t, t0 + 0.35)} rot={Math.sin(t * 1.8) * 8}><circle r={110} fill="#fff" stroke={C.noche} strokeWidth={12} /><Icono k={n} /></Svg>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 960 - 3 * 80 + i * 80 - 24, top: 640, width: 48, height: 48, borderRadius: 24, background: i < n ? C.oro : "rgba(255,255,255,.2)", border: "6px solid #fff", transform: `scale(${ent(t, t0 + 0.2, i * 0.05) * (i === n - 1 ? 1 + 0.2 * Math.abs(Math.sin(t * 6)) : 1)})` }} />
      ))}
    </div>
  );
};

// iconos de cada trampa (para las boyas y el tablero)
export const Icono: React.FC<{ k: number }> = ({ k }) => {
  if (k === 1) return <g><rect x={-34} y={-80} width={68} height={70} rx={6} fill="#1a1420" /><rect x={-34} y={-30} width={68} height={12} fill={C.rojo} /><ellipse cx={0} cy={-10} rx={64} ry={12} fill="#1a1420" /></g>;
  if (k === 2) return <g><circle r={56} fill={C.oro} stroke="#7a4a10" strokeWidth={8} /><text y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={64} fill="#7a4a10">$</text></g>;
  if (k === 3) return <g><rect x={-60} y={-46} width={120} height={36} fill="#7a4a26" /><rect x={-60} y={10} width={120} height={36} fill="#7a4a26" /><ellipse cx={20} cy={-56} rx={26} ry={14} fill="#6a6470" /><circle cx={42} cy={-62} r={6} fill="#e8a0a0" /></g>;
  if (k === 4) return <g><path d="M -70 0 Q 0 30 70 0 L 56 26 Q 0 40 -56 26 Z" fill="#f2efe4" /><path d="M -60 -6 L 40 -70" stroke="#9a6a3a" strokeWidth={8} /><path d="M 40 -70 L 60 -84 L 50 -60 Z" fill="#c8ccd4" /></g>;
  if (k === 5) return <g>{[0, 1, 2].map((i) => <path key={i} d={`M ${-40 + i * 40} 40 Q ${-60 + i * 40} -10 ${-30 + i * 40} ${-60 + (i % 2) * 20} Q ${-10 + i * 40} 0 ${-20 + i * 40} 40 Z`} fill={i % 2 ? C.ambar : C.naranja} />)}</g>;
  if (k === 6) return <g><path d="M -50 -10 Q -52 -60 0 -62 Q 52 -60 50 -10 Z" fill="#1d2440" /><path d="M -66 -10 Q 0 -30 66 -10 L 60 4 Q 0 -14 -60 4 Z" fill="#10142a" /><circle cx={0} cy={-36} r={9} fill={C.oro} /><path d="M -60 30 Q 0 70 60 20" stroke="#5a3418" strokeWidth={8} fill="none" /></g>;
  return <g><circle cx={0} cy={-10} r={50} fill="#f4f0e8" /><rect x={-26} y={26} width={52} height={30} rx={6} fill="#f4f0e8" /><circle cx={-18} cy={-14} r={14} fill="#1a1020" /><circle cx={18} cy={-14} r={14} fill="#1a1020" /><path d="M -6 10 L 0 0 L 6 10 Z" fill="#1a1020" /></g>;
};

// boya numerada (en el mundo): sube del agua en t0
export const Boya: React.FC<{ x: number; t: number; t0: number; n: number; pulsa?: number }> = ({ x, t, t0, n, pulsa = 1e9 }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 9, stiffness: 140 });
  const bob = Math.sin(t * 2 + n) * 10;
  const p = t > pulsa ? 1 + 0.12 * Math.abs(Math.sin((t - pulsa) * 6 + n * 0.5)) : 1;
  return (
    <Svg x={x} y={(1 - e) * 500 + bob} s={1.8 * p} rot={Math.sin(t * 1.6 + n) * 5}>
      <line x1={0} y1={-200} x2={0} y2={-520} stroke="#3a2a22" strokeWidth={10} />
      <g transform="translate(0 -600)"><circle r={110} fill="#fff" stroke={n === 7 ? "#1a1020" : C.rojo} strokeWidth={14} /><Icono k={n} /></g>
      <path d="M -120 0 Q -110 -200 0 -210 Q 110 -200 120 0 Z" fill={C.rojo} />
      <path d="M -116 -80 Q 0 -100 116 -80 L 112 -30 Q 0 -50 -112 -30 Z" fill="#fff" />
      <text x={0} y={-118} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={90} fill="#fff" stroke="#1a1020" strokeWidth={8} paintOrder="stroke">{n}</text>
      <ellipse cx={0} cy={0} rx={150} ry={26} fill="#1a3a6a" opacity={0.4} />
    </Svg>
  );
};

// colectivo amarillo (para la escala: "the size of a bus")
export const Colectivo: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <Svg x={x} y={y} s={s} rot={rot}>
    <rect x={-560} y={-300} width={1120} height={260} rx={40} fill="#ffc21a" stroke="#2a1530" strokeWidth={10} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-500 + i * 140} y={-260} width={110} height={100} rx={12} fill="#9ad8ff" stroke="#2a1530" strokeWidth={6} />)}
    <rect x={-560} y={-120} width={1120} height={22} fill="#2a1530" />
    {[-360, 360].map((wx) => <g key={wx}><circle cx={wx} cy={-30} r={70} fill="#2a1530" /><circle cx={wx} cy={-30} r={30} fill="#c8ccd4" /></g>)}
  </Svg>
);

// mapa de Massachusetts con Nantucket (inserto en pantalla)
export const MapaMA: React.FC<{ t: number; t0: number; t1: number; x?: number; y?: number }> = ({ t, t0, t1, x = 1460, y = 560 }) => {
  if (t < t0 || t > t1 + 0.4) return null;
  const e = ent(t, t0) * interpolate(t, [t1, t1 + 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = ((t - t0) % 1.2) / 1.2;
  return (
    <div style={{ position: "absolute", left: x - 380, top: y - 300, width: 760, height: 600, transform: `scale(${e}) rotate(${(1 - e) * 8 + 2}deg)`, borderRadius: 26, overflow: "hidden", border: "10px solid #fff", boxShadow: "0 16px 0 rgba(20,10,40,.4)", background: "#3b8fc8" }}>
      <svg width={760} height={600} viewBox="0 0 760 600">
        <path d="M 0 40 L 420 30 L 450 120 L 470 160 L 430 230 L 470 290 L 560 300 L 600 260 L 640 210 L 610 170 L 650 150 L 690 200 L 680 280 L 610 330 L 520 350 L 440 330 L 380 360 L 300 330 L 0 340 Z" fill="#8ac85a" stroke="#4a7a32" strokeWidth={6} />
        <path d="M 520 470 Q 560 440 640 452 Q 690 470 640 492 Q 580 500 530 492 Z" fill="#f2d79a" stroke="#c8a050" strokeWidth={5} />
        <path d="M 420 420 Q 450 404 480 418 Q 470 436 430 434 Z" fill="#f2d79a" stroke="#c8a050" strokeWidth={4} />
        <circle cx={590} cy={470} r={18 + k * 60} fill="none" stroke={C.rojo} strokeWidth={6} opacity={1 - k} />
        <circle cx={590} cy={470} r={16} fill={C.rojo} stroke="#fff" strokeWidth={5} />
        <text x={200} y={200} fontFamily={fontFamily} fontWeight={700} fontSize={46} fill="#2a4a1a" opacity={0.75}>MASSACHUSETTS</text>
        <text x={380} y={560} fontFamily={fontFamily} fontWeight={700} fontSize={50} fill="#fff" stroke="#1a2a4a" strokeWidth={8} paintOrder="stroke">NANTUCKET</text>
      </svg>
    </div>
  );
};

// mapa del Pacífico: Essex, Marquesas (2.000 km), Sudamérica (4.000 km), isla Henderson
export const MapaPacifico: React.FC<{ t: number; t0: number; t1: number; tMarq?: number; tRuta?: number; tIsla?: number; tRescate?: number }> = ({ t, t0, t1, tMarq = 1e9, tRuta = 1e9, tIsla = 1e9, tRescate = 1e9 }) => {
  if (t < t0 || t > t1 + 0.4) return null;
  const e = ent(t, t0) * interpolate(t, [t1, t1 + 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const E = [880, 330], M = [360, 290], H = [700, 600], S = [1500, 690];
  const ruta = prog(t, tRuta, tRuta + 2.4);
  const marq = prog(t, tMarq, tMarq + 0.8);
  const k = ((t - t0) % 1.2) / 1.2;
  return (
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 840, transform: `scale(${e})`, borderRadius: 30, overflow: "hidden", border: "10px solid #fff", boxShadow: "0 18px 0 rgba(20,10,40,.45)", background: "radial-gradient(circle at 50% 40%, #2a6aa8, #123a6a)" }}>
      <svg width={1600} height={840} viewBox="0 0 1600 840">
        {Array.from({ length: 120 }, (_, i) => <circle key={i} cx={(i * 137) % 1600} cy={(i * 271) % 840} r={3} fill="#fff" opacity={0.12} />)}
        <path d="M 1420 0 L 1600 0 L 1600 840 L 1450 840 Q 1400 700 1440 560 Q 1480 420 1400 300 Q 1380 160 1420 0 Z" fill="#7ab85a" stroke="#3a6a2a" strokeWidth={6} />
        <text x={1300} y={420} fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#fff" transform="rotate(-80 1300 420)">SOUTH AMERICA</text>
        {[[M[0] - 30, M[1]], [M[0] + 20, M[1] + 20], [M[0], M[1] - 30]].map(([ix, iy], i) => <circle key={i} cx={ix} cy={iy} r={12} fill="#f2d79a" />)}
        <text x={M[0] - 120} y={M[1] - 60} fontFamily={fontFamily} fontWeight={700} fontSize={38} fill="#fff">MARQUESAS</text>
        <circle cx={H[0]} cy={H[1]} r={10} fill="#f2d79a" />
        {t > tIsla && <text x={H[0] - 110} y={H[1] + 60} fontFamily={fontFamily} fontWeight={700} fontSize={32} fill="#fff">HENDERSON IS.</text>}
        {marq > 0 && <g><line x1={E[0]} y1={E[1]} x2={E[0] + (M[0] - E[0]) * marq} y2={E[1] + (M[1] - E[1]) * marq} stroke={C.lima} strokeWidth={8} strokeDasharray="18 14" /><text x={(E[0] + M[0]) / 2 - 60} y={E[1] - 30} fontFamily={fontFamily} fontWeight={700} fontSize={42} fill={C.lima} opacity={marq}>2,000 KM</text></g>}
        {t > tRuta && <path d={`M ${E[0]} ${E[1]} Q ${H[0] - 60} ${H[1] - 160} ${H[0]} ${H[1]} Q ${H[0] + 400} ${H[1] + 160} ${S[0]} ${S[1]}`} stroke={C.rojo} strokeWidth={10} fill="none" strokeDasharray="22 14" pathLength={1000} style={{ strokeDasharray: `${ruta * 1000} 1000` }} />}
        {t > tRuta + 1.4 && <text x={1040} y={770} fontFamily={fontFamily} fontWeight={700} fontSize={46} fill="#fff" stroke={C.rojo} strokeWidth={10} paintOrder="stroke">4,000+ KM</text>}
        {t > tRescate && <circle cx={S[0] - 60} cy={S[1]} r={22 + k * 50} fill="none" stroke={C.lima} strokeWidth={6} opacity={1 - k} />}
        <circle cx={E[0]} cy={E[1]} r={18 + k * 50} fill="none" stroke={C.rojo} strokeWidth={6} opacity={1 - k} />
        <path d={`M ${E[0] - 22} ${E[1] - 22} L ${E[0] + 22} ${E[1] + 22} M ${E[0] + 22} ${E[1] - 22} L ${E[0] - 22} ${E[1] + 22}`} stroke={C.rojo} strokeWidth={10} strokeLinecap="round" />
        <text x={E[0] + 30} y={E[1] - 20} fontFamily={fontFamily} fontWeight={700} fontSize={38} fill="#fff">ESSEX</text>
      </svg>
    </div>
  );
};

// libro de cuentas de la tripulación (saldo final)
export const Saldo: React.FC<{ t: number; t0: number; t1?: number; x?: number; y?: number; filas: { txt: string; monto: string; t0: number }[]; total: string; tTotal: number }> = ({ t, t0, t1 = 1e9, x = 960, y = 540, filas, total, tTotal }) => {
  if (t < t0 || t > t1 + 0.4) return null;
  const e = ent(t, t0, 0, { damping: 13, stiffness: 150 }) * interpolate(t, [t1, t1 + 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x - 400, top: y - 330, width: 800, height: 660, transform: `scale(${e}) rotate(${-2 + (1 - e) * 10}deg)`, background: "linear-gradient(180deg,#f4e6c4,#e2cc98)", borderRadius: 14, boxShadow: "0 18px 0 rgba(20,10,40,.4)", fontFamily, color: "#3a2418", border: "6px solid #b98a4a" }}>
      <div style={{ textAlign: "center", fontSize: 46, fontWeight: 700, marginTop: 26, letterSpacing: 3 }}>CREW ACCOUNT</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 96, borderBottom: "4px solid #3a2418" }} />
      {filas.map((f, i) => t >= f.t0 && (
        <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 120 + i * 70, display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 700, opacity: ent(t, f.t0), transform: `translateX(${(1 - ent(t, f.t0)) * -50}px)` }}>
          <span>{f.txt}</span><span style={{ color: f.monto.startsWith("-") ? C.rojo : "#1a6a3a" }}>{f.monto}</span>
        </div>
      ))}
      {t >= tTotal && <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", justifyContent: "space-between", fontSize: 64, fontWeight: 700, borderTop: "6px double #3a2418", paddingTop: 14, transform: `scale(${ent(t, tTotal)})` }}><span>BALANCE</span><span style={{ color: C.rojo }}>{total}</span></div>}
    </div>
  );
};

// fila de figuritas (para "8 de 20")
export const Fila: React.FC<{ t: number; t0: number; n: number; vivos: number; tMuere: number; y?: number }> = ({ t, t0, n, vivos, tMuere, y = 700 }) => {
  if (t < t0) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const muere = i >= vivos && t > tMuere + (i - vivos) * 0.06;
        const x = 960 - (n - 1) * 42 + i * 84;
        return (
          <svg key={i} style={{ position: "absolute", left: x - 34, top: y - 110, overflow: "visible", transform: `scale(${ent(t, t0, i * 0.03)})`, opacity: muere ? 0.22 : 1 }} width={68} height={130}>
            <circle cx={34} cy={26} r={22} fill={muere ? "#8a8a9a" : C.crema} />
            <rect x={12} y={52} width={44} height={66} rx={18} fill={muere ? "#8a8a9a" : C.crema} />
          </svg>
        );
      })}
    </>
  );
};
export { Chip, Grande };

// contador que rueda de `de` a `a`
export const Cuenta: React.FC<{ t: number; t0: number; t1: number; de: number; a: number; x: number; y: number; size?: number; color?: string; pre?: string; suf?: string; t2?: number; sep?: boolean }> = ({ t, t0, t1, de, a, x, y, size = 150, color = "#fff", pre = "", suf = "", t2 = 1e9, sep = true }) => {
  if (t < t0 || t > t2 + 0.3) return null;
  const v = Math.round(de + (a - de) * prog(t, t0, t1));
  const out = interpolate(t, [t2, t2 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${ent(t, t0) * out})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.08}px #2a1530`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 ${size * 0.06}px 0 #2a1530` }}>{pre}{sep ? v.toLocaleString("en-US") : v}{suf}</div>;
};
// texto grande que sale (con tiempo de salida)
export const Titulo: React.FC<{ t: number; t0: number; t1: number; text: string; x?: number; y: number; size?: number; color?: string; borde?: string }> = ({ t1, ...p }) => {
  if (p.t > t1 + 0.25) return null;
  const out = interpolate(p.t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", inset: 0, opacity: out }}><Grande {...p} /></div>;
};
