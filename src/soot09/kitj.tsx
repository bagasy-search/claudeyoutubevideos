import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { C, ent, fontFamily, prog } from "./kit";
import type { Ropa } from "./persona";

// Kit de Jamestown (soot09): el mundo continuo de 1606-1610. Todo vector plano saturado en código, cero imágenes.
export const TOM: Ropa = { tunica: "#7a5a3a", tunica2: "#4e3622", cinto: "#2e1e12", piel: "#f2b48a", piel2: "#d98d66", pelo: "#6b3a1f" };
export const GENT = (i: number): Ropa => ({ tunica: ["#7b2fb0", "#1f5fae", "#b0263a", "#1c7a5a"][i % 4], tunica2: ["#4a1a70", "#123a70", "#6e1424", "#0e4a36"][i % 4], cinto: "#e0b44a", piel: ["#f6c6a0", "#f2b48a", "#efb898"][i % 3], piel2: "#d98d66", pelo: ["#c99a4a", "#3a2416", "#8a4a1a"][i % 3] });
export const COLONO = (i: number): Ropa => ({ tunica: ["#8a6a4a", "#6a7a5a", "#7a5040", "#5a5a6a"][i % 4], tunica2: ["#5a4028", "#44523a", "#4e3026", "#3a3a48"][i % 4], cinto: "#2e1e12", piel: ["#f2b48a", "#e8a882", "#f6c6a0"][i % 3], piel2: "#d08a64", pelo: ["#6b3a1f", "#2a1a10", "#a0602a", "#4a2a17"][i % 4] });
export const POW = (i: number): Ropa => ({ tunica: ["#c8955a", "#b8844a", "#d0a066"][i % 3], tunica2: ["#8a5a2e", "#7a4c26", "#94643a"][i % 3], cinto: "#5a3418", piel: ["#b9774f", "#a86a44", "#c4845a"][i % 3], piel2: "#8a5434", pelo: "#1a1210" });
export const SMITH: Ropa = { tunica: "#a3402a", tunica2: "#6a2416", cinto: "#2a1a10", piel: "#e8a882", piel2: "#c27a56", pelo: "#8a4a1a" };

type Pos = { x: number; y: number; s?: number; t?: number; t0?: number; rot?: number; op?: number };
// envoltorio SVG centrado con entrada elástica
export const O: React.FC<Pos & { w: number; h: number; children: React.ReactNode; flip?: boolean }> = ({ x, y, s = 1, t = 0, t0, rot = 0, op = 1, w, h, children, flip }) => {
  if (t0 !== undefined && t < t0) return null;
  const e = t0 === undefined ? 1 : ent(t, t0);
  return (
    <svg style={{ position: "absolute", left: x - (w / 2) * s, top: y - (h / 2) * s, overflow: "visible", opacity: op, transform: `scale(${(flip ? -1 : 1) * e} ${e}) rotate(${rot + (1 - e) * -12}deg)` }} width={w * s} height={h * s} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
      {children}
    </svg>
  );
};

// ── cielo continuo: la hora y la estación cambian con el viaje (sin cortes)
export type Tono = { a: string; b: string; c: string };
export const CIELO: Record<string, Tono> = {
  londres: { a: "#5d6a8a", b: "#a9a0b8", c: "#d8c8c0" },
  mar: { a: "#2a6fd0", b: "#6fb6f0", c: "#cfeaff" },
  tormenta: { a: "#1c1a3a", b: "#3a3a6a", c: "#5a5a80" },
  primavera: { a: "#3a8ae0", b: "#8fd0ff", c: "#fff0c8" },
  verano: { a: "#f08a2a", b: "#ffc060", c: "#fff0b0" },
  invierno: { a: "#2a3a6a", b: "#6a7aa8", c: "#b8c4dc" },
  noche: { a: "#120c30", b: "#2d1b69", c: "#4a2a7a" },
  hambre: { a: "#3a2a4a", b: "#7a5a6a", c: "#c0a090" },
  amanecer: { a: "#ff7a6a", b: "#ffb070", c: "#ffe6a0" },
};
const mezcla = (a: string, b: string, u: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join("");
};
export const tonoEn = (ks: [number, string][], t: number): Tono => {
  // cada clave [t, tono] = desde ese segundo el cielo pasa (en ~2 s) del tono anterior a éste
  let i = -1;
  while (i < ks.length - 1 && t >= ks[i + 1][0]) i++;
  if (i < 0) return CIELO[ks[0][1]];
  const A = CIELO[ks[Math.max(0, i - 1)][1]], B = CIELO[ks[i][1]];
  const u = i === 0 ? 1 : Math.max(0, Math.min(1, (t - ks[i][0]) / 2));
  return { a: mezcla(A.a, B.a, u), b: mezcla(A.b, B.b, u), c: mezcla(A.c, B.c, u) };
};
export const CieloT: React.FC<{ tono: Tono }> = ({ tono }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${tono.a} 0%, ${tono.b} 55%, ${tono.c} 100%)` }} />
);

// ── mar con olas en capas (paralaje con la cámara)
export const Olas: React.FC<{ t: number; y: number; dx?: number; color?: string; amp?: number; largo?: number; vel?: number; op?: number; ancho?: number; x0?: number }> = ({ t, y, dx = 0, color = "#1f6fc0", amp = 18, largo = 240, vel = 1, op = 1, ancho = 2400, x0 = -240 }) => {
  const pts: string[] = [];
  for (let x = 0; x <= ancho; x += 30) pts.push(`${x0 + x} ${y + Math.sin((x + dx) / largo * Math.PI * 2 + t * 2 * vel) * amp + Math.sin((x + dx) / (largo * 0.43) + t * 3.1 * vel) * amp * 0.3}`);
  return <path d={`M ${x0} 22000 L ${pts.join(" L ")} L ${x0 + ancho} 22000 Z`} fill={color} opacity={op} />;
};

// ── barco de tres palos (Susan Constant / Godspeed / Discovery), con velas que se inflan
export const Nave: React.FC<Pos & { t: number; tam?: number; vela?: number; bandera?: boolean; nombre?: string; rolido?: number; casco?: string; roto?: number }> = ({ t, tam = 1, vela = 1, bandera = true, nombre, rolido = 3, casco = "#7a3e1a", roto = 0, ...p }) => {
  const r = Math.sin(t * 1.3 + p.x * 0.01) * rolido;
  const v = 0.6 + 0.4 * vela;
  return (
    <O {...p} t={t} w={900} h={900}>
      <g transform={`rotate(${r + roto * 18}) scale(${tam})`}>
        {/* casco */}
        <path d="M -380 40 L 360 40 Q 390 30 420 -20 L 400 60 Q 340 200 -300 200 Q -380 190 -400 60 L -420 -40 Q -400 30 -380 40 Z" fill={casco} />
        <path d="M -400 60 Q -380 190 -300 200 Q 340 200 400 60 Z" fill="#4e2410" opacity={0.6} />
        <rect x={-400} y={36} width={810} height={14} fill="#e8b84a" />
        {[-260, -140, -20, 100, 220].map((x) => <rect key={x} x={x} y={74} width={34} height={26} rx={4} fill="#2a1408" />)}
        <path d="M -420 -40 L -300 -40 L -290 40 L -400 40 Z" fill="#8a4a20" />
        <path d="M 300 -10 L 420 -20 L 400 40 L 300 40 Z" fill="#8a4a20" />
        {/* palos y velas */}
        {[[-180, 470, 0.8], [40, 560, 1], [250, 400, 0.7]].map(([x, h, k], i) => (
          <g key={i} transform={roto > 0.5 && i === 1 ? `rotate(${(roto - 0.5) * 120} ${x} 40)` : undefined}>
            <rect x={x - 9} y={40 - h} width={18} height={h} fill="#5a2e14" />
            {[0, 1].map((j) => {
              const top = 40 - h + 30 + j * h * 0.42, hh = h * 0.36, w = 210 * k;
              return <path key={j} d={`M ${x - w / 2} ${top} L ${x + w / 2} ${top} Q ${x + w / 2 + 40 * v} ${top + hh / 2} ${x + w / 2 - 6} ${top + hh} L ${x - w / 2 + 6} ${top + hh} Q ${x - w / 2 + 40 * v} ${top + hh / 2} ${x - w / 2} ${top} Z`} fill="#f4ecd8" stroke="#d8ccb0" strokeWidth={4} />;
            })}
            {bandera && <path d={`M ${x} ${40 - h} L ${x + 70} ${40 - h + 14 + Math.sin(t * 6 + i) * 6} L ${x} ${40 - h + 30} Z`} fill={i === 1 ? C.rojo : "#f4ecd8"} />}
          </g>
        ))}
        {bandera && <g transform="translate(40 -330)"><rect x={-40} y={-30} width={80} height={60} fill="#fff" /><rect x={-40} y={-7} width={80} height={14} fill={C.rojo} /><rect x={-7} y={-30} width={14} height={60} fill={C.rojo} /></g>}
        <path d="M -400 -30 L -420 -330 L 40 -480" stroke="#3a2010" strokeWidth={3} fill="none" opacity={0.5} />
        <path d="M 420 -20 L 520 -110" stroke="#5a2e14" strokeWidth={14} strokeLinecap="round" />
      </g>
      {nombre && <text x={0} y={150} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={46} fill="#fff" stroke={C.noche} strokeWidth={12} paintOrder="stroke">{nombre}</text>}
    </O>
  );
};

// ── bote a remo (el mensajero)
export const Bote: React.FC<Pos & { t: number; remos?: number }> = ({ t, remos = 1, ...p }) => (
  <O {...p} t={t} w={500} h={300}>
    <g transform={`rotate(${Math.sin(t * 2) * 2})`}>
      <path d="M -220 0 L 220 0 Q 200 70 120 80 L -140 80 Q -210 70 -220 0 Z" fill="#9a5a2a" />
      <rect x={-220} y={-6} width={440} height={12} fill="#e8b84a" />
      {[-80, 40].map((x, i) => <line key={i} x1={x} y1={10} x2={x - 120 * Math.cos(t * 4 * remos + i)} y2={110 + 20 * Math.sin(t * 4 * remos + i)} stroke="#6b3a1f" strokeWidth={10} strokeLinecap="round" />)}
    </g>
  </O>
);

// ── el fuerte triangular de 1607 (vista lateral): empalizada, 3 baluartes con cañón, casitas, iglesia y almacén
export const Fuerte: React.FC<Pos & { t: number; arma?: number; ruina?: number; nieve?: number; humo?: boolean }> = ({ t, arma = 1, ruina = 0, nieve = 0, humo = true, ...p }) => {
  const n = 26;
  return (
    <O {...p} t={t} w={1600} h={700}>
      {/* casitas y edificios adentro (se ven por encima de la empalizada) */}
      <g opacity={arma > 0.3 ? 1 : 0}>
        <path d="M -120 -40 L -120 -190 L -40 -260 L 40 -190 L 40 -40 Z" fill="#c9a074" />
        <rect x={-50} y={-330} width={20} height={80} fill="#6b3a1f" /><rect x={-70} y={-310} width={60} height={14} fill="#6b3a1f" />
        <path d="M 160 -40 L 160 -150 L 380 -150 L 380 -40 Z" fill="#b48a5a" /><path d="M 140 -150 L 270 -230 L 400 -150 Z" fill="#7a4a24" />
        <path d="M -420 -40 L -420 -130 L -250 -130 L -250 -40 Z" fill="#c09060" /><path d="M -440 -130 L -335 -200 L -230 -130 Z" fill="#8a5a2a" />
        {humo && [0, 1, 2].map((i) => { const k = (t * 0.4 + i / 3) % 1; return <circle key={i} cx={-300 + k * 60} cy={-210 - k * 220} r={20 + k * 50} fill="#e8e0d8" opacity={0.5 * (1 - k)} />; })}
      </g>
      {/* empalizada: los troncos crecen de a uno (arma 0→1) */}
      {Array.from({ length: n }, (_, i) => {
        const k = Math.max(0, Math.min(1, arma * n - i));
        const x = -700 + i * 56;
        const h = (170 + ((i * 37) % 30)) * k * (1 - ruina * (((i * 53) % 7) / 9));
        const inc = ruina * (((i * 31) % 9) - 4) * 4;
        return <g key={i} transform={`rotate(${inc} ${x} 40)`}><path d={`M ${x - 24} 40 L ${x - 24} ${40 - h} L ${x} ${40 - h - 26 * k} L ${x + 24} ${40 - h} L ${x + 24} 40 Z`} fill={i % 2 ? "#8a5228" : "#7a4620"} stroke="#4e2a12" strokeWidth={4} /></g>;
      })}
      {/* baluartes */}
      {[-760, 760].map((x, i) => (
        <g key={i} opacity={arma}>
          <path d={`M ${x - 80} 40 L ${x - 70} -170 L ${x + 70} -170 L ${x + 80} 40 Z`} fill="#6a3a1a" />
          <rect x={x - 76} y={-190} width={152} height={26} fill="#4e2a12" />
          <g transform={`translate(${x + (i ? -30 : 30)} -196) scale(${i ? -1 : 1} 1)`}><rect x={0} y={-16} width={110} height={30} rx={12} fill="#2a2a34" /><circle cx={6} cy={0} r={22} fill="#3a3a44" /></g>
        </g>
      ))}
      {nieve > 0 && <path d={`M -840 ${40 - 0} L -840 34 Q 0 ${20 - nieve * 20} 840 34 L 840 40 Z`} fill="#f4f8ff" opacity={nieve} />}
      <rect x={-860} y={36} width={1720} height={16} fill="#5a3a1a" opacity={0.4} />
    </O>
  );
};

// ── fuerte visto desde arriba (el triángulo), para el plano cenital
export const FuerteTriangulo: React.FC<Pos & { t: number; dibuja?: number }> = ({ t, dibuja = 1, ...p }) => {
  const L = 1100 * dibuja;
  return (
    <O {...p} t={t} w={900} h={800}>
      <path d="M -380 260 L 380 260 L 0 -340 Z" fill="#7a9a4a" opacity={0.5} />
      <path d="M -380 260 L 380 260 L 0 -340 Z" fill="none" stroke="#7a4620" strokeWidth={26} strokeLinejoin="round" strokeDasharray={`${L * 2.4} 4000`} />
      {[[-380, 260], [380, 260], [0, -340]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={70 * Math.min(1, dibuja * 1.2)} fill="#6a3a1a" stroke="#4e2a12" strokeWidth={8} />)}
      {dibuja > 0.8 && [[-90, 120], [60, 140], [-20, 20]].map(([x, y], i) => <rect key={i} x={x} y={y} width={70} height={50} fill="#c9a074" stroke="#7a4a24" strokeWidth={6} />)}
    </O>
  );
};

// ── árboles de Virginia (pino y ciprés calvo) y pantano
export const Pino: React.FC<Pos & { h?: number; color?: string }> = ({ h = 1, color = "#1f6a3a", ...p }) => (
  <O {...p} w={300} h={600}>
    <rect x={-14} y={150} width={28} height={130} fill="#5a3418" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${-130 + i * 22} ${190 - i * 100} L 0 ${-10 - i * 100 - 60} L ${130 - i * 22} ${190 - i * 100} Z`} fill={i % 2 ? color : mezcla(color, "#000000", 0.18)} />)}
  </O>
);
export const Cipres: React.FC<Pos & { anillos?: boolean }> = ({ anillos, ...p }) => (
  <O {...p} w={500} h={900}>
    <path d="M -120 420 Q -60 300 -50 0 L -40 -300 L 40 -300 L 50 0 Q 60 300 120 420 Z" fill="#8a5a3a" />
    {[-1, 1].map((s) => <path key={s} d={`M ${s * 20} -200 Q ${s * 200} -260 ${s * 220} -360`} stroke="#6a4028" strokeWidth={18} fill="none" />)}
    <ellipse cx={-150} cy={-380} rx={140} ry={70} fill="#4a7a3a" /><ellipse cx={140} cy={-400} rx={150} ry={70} fill="#3e6a30" /><ellipse cx={0} cy={-330} rx={130} ry={60} fill="#5a8a44" />
    {[-140, -60, 70, 150].map((x, i) => <path key={i} d={`M ${x} 430 Q ${x + 10} 380 ${x + 6} 330`} stroke="#7a4a2a" strokeWidth={22} strokeLinecap="round" />)}
  </O>
);
export const Pantano: React.FC<{ t: number; x: number; y: number; w: number }> = ({ t, x, y, w }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={200}>
    <path d={`M 0 50 Q ${w * 0.25} 0 ${w * 0.5} 30 Q ${w * 0.75} 60 ${w} 40 Q ${w * 1.02} 90 ${w * 0.85} 96 Q ${w * 0.5} 110 ${w * 0.15} 96 Q ${-w * 0.02} 90 0 50 Z`} fill="#4a6a3a" /><ellipse cx={w * 0.35} cy={70} rx={w * 0.12} ry={10} fill="#5a7a8a" opacity={0.8} /><ellipse cx={w * 0.68} cy={66} rx={w * 0.09} ry={8} fill="#5a7a8a" opacity={0.8} />
    {Array.from({ length: Math.floor(w / 60) }, (_, i) => <path key={i} d={`M ${i * 60 + 20} 50 Q ${i * 60 + 18 + Math.sin(t * 2 + i) * 6} 10 ${i * 60 + 30} -20`} stroke="#6a8a3a" strokeWidth={6} fill="none" />)}
    {Array.from({ length: 6 }, (_, i) => { const k = (t * 0.6 + i / 6) % 1; return <circle key={i} cx={(i * 211) % w} cy={80 - k * 30} r={6 + k * 6} fill="none" stroke="#a8c080" strokeWidth={3} opacity={1 - k} />; })}
  </svg>
);

// ── mosquitos (enjambre que zumba)
export const Mosquitos: React.FC<{ t: number; x: number; y: number; n?: number; r?: number; seed?: number }> = ({ t, x, y, n = 18, r = 160, seed = 3 }) => {
  const q = React.useMemo(() => { const g = rnd(seed); return Array.from({ length: n }, () => [g() * 6.28, 0.6 + g() * 1.2, 0.4 + g(), g()]); }, [n, seed]);
  return (
    <svg style={{ position: "absolute", left: x - r * 1.5, top: y - r * 1.5, overflow: "visible", pointerEvents: "none" }} width={r * 3} height={r * 3}>
      {q.map(([a, v, rr, ph], i) => {
        const cx = r * 1.5 + Math.cos(a + t * v * 3) * r * rr + Math.sin(t * 9 + i) * 8;
        const cy = r * 1.5 + Math.sin(a * 1.7 + t * v * 2.3) * r * rr * 0.6;
        const al = Math.sin(t * 60 + i) * 8;
        return <g key={i} transform={`translate(${cx} ${cy})`}><ellipse cx={-8} cy={-6 + al * 0.2} rx={10} ry={5} fill="#fff" opacity={0.6} transform={`rotate(${-30 + al})`} /><ellipse cx={8} cy={-6} rx={10} ry={5} fill="#fff" opacity={0.6} transform={`rotate(${30 - al})`} /><ellipse cx={0} cy={0} rx={10} ry={4} fill="#2a1a2a" /><line x1={8} y1={0} x2={22 + ph * 4} y2={6} stroke="#2a1a2a" strokeWidth={2.5} /></g>;
      })}
    </svg>
  );
};

// ── anillos del ciprés: el corte transversal que es un calendario (1606-1612 = los más finos)
export const Anillos: React.FC<{ t: number; t0: number; x: number; y: number; r: number; marca?: number; tMarca?: number }> = ({ t, t0, x, y, r, tMarca = 1e9 }) => {
  if (t < t0) return null;
  const N = 34;
  const anchos = Array.from({ length: N }, (_, i) => (i >= 24 && i <= 30 ? 0.35 : 0.8 + ((i * 37) % 10) / 14));
  const tot = anchos.reduce((a, b) => a + b, 0);
  let acc = 0;
  const rad = anchos.map((w) => { acc += w; return (acc / tot) * r; });
  const crece = prog(t, t0, t0 + 0.5);
  const m = prog(t, tMarca, tMarca + 0.6);
  return (
    <svg style={{ position: "absolute", left: x - r - 40, top: y - r - 40, overflow: "visible" }} width={2 * r + 80} height={2 * r + 80} viewBox={`${-r - 40} ${-r - 40} ${2 * r + 80} ${2 * r + 80}`}>
      <circle r={(r + 30) * Math.min(1, crece * 1.1 + 0.02)} fill="#5a3418" />
      {rad.slice().reverse().map((rr, j) => {
        const i = N - 1 - j;
        const seco = i >= 24 && i <= 30;
        return <circle key={i} r={rr * Math.min(1, crece * 1.1 + 0.02)} fill={i % 2 ? "#e8b880" : "#d9a46a"} stroke={seco && m > 0 ? mezcla("#8a5a2a", "#e8344a", m) : "#8a5a2a"} strokeWidth={seco ? 3 + m * 6 : 3} />;
      })}
      <circle r={10} fill="#8a5a2a" />
      {/* grietas radiales */}
      {[20, 140, 250].map((a, i) => <line key={i} x1={0} y1={0} x2={Math.cos(a / 57.3) * r * 0.9} y2={Math.sin(a / 57.3) * r * 0.9} stroke="#7a4a20" strokeWidth={4} opacity={0.5} />)}
    </svg>
  );
};

// ── maíz, cuentas, cobre y hachas (el comercio)
export const Choclo: React.FC<Pos> = (p) => (
  <O {...p} w={120} h={260}>
    <path d="M 0 -110 Q 50 -60 40 60 Q 0 120 -40 60 Q -50 -60 0 -110 Z" fill="#f7c548" />
    {Array.from({ length: 7 }, (_, r) => [-20, 0, 20].map((x) => <circle key={`${r}${x}`} cx={x} cy={-70 + r * 22} r={9} fill="#ffdc6a" stroke="#d9a020" strokeWidth={2} />))}
    <path d="M -40 60 Q -70 0 -30 -60 Q -20 40 0 100 Z" fill="#7ab040" /><path d="M 40 60 Q 70 0 30 -60 Q 20 40 0 100 Z" fill="#5a9a30" />
  </O>
);
export const Canasta: React.FC<Pos & { llena?: number }> = ({ llena = 1, ...p }) => (
  <O {...p} w={320} h={260}>
    {llena > 0 && Array.from({ length: Math.round(9 * llena) }, (_, i) => <ellipse key={i} cx={-100 + (i % 5) * 50} cy={-30 - Math.floor(i / 5) * 30} rx={22} ry={40} fill="#f7c548" stroke="#d9a020" strokeWidth={3} transform={`rotate(${(i % 3 - 1) * 20} ${-100 + (i % 5) * 50} ${-30 - Math.floor(i / 5) * 30})`} />)}
    <path d="M -140 -20 L 140 -20 L 110 110 L -110 110 Z" fill="#b5803a" />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={-136 + i * 4} y1={10 + i * 26} x2={136 - i * 4} y2={10 + i * 26} stroke="#8a5a20" strokeWidth={6} />)}
  </O>
);
export const Cuentas: React.FC<Pos> = (p) => (
  <O {...p} w={260} h={140}>
    <path d="M -110 -20 Q 0 90 110 -20" stroke="#5a3a2a" strokeWidth={4} fill="none" />
    {Array.from({ length: 11 }, (_, i) => { const u = i / 10; const x = -110 + u * 220; const y = -20 + Math.sin(u * Math.PI) * 52; return <circle key={i} cx={x} cy={y} r={13} fill={["#2ec4d6", "#e8344a", "#f7c548", "#fff"][i % 4]} stroke="#1b1240" strokeWidth={3} />; })}
  </O>
);
export const Hacha: React.FC<Pos> = (p) => (
  <O {...p} w={200} h={260}>
    <rect x={-10} y={-90} width={20} height={200} rx={8} fill="#8a5a2a" />
    <path d="M -10 -100 L 80 -120 Q 100 -70 80 -20 L -10 -40 Z" fill="#b9c2cf" stroke="#6a7484" strokeWidth={5} />
  </O>
);

// ── oro falso: escamas brillantes, cofre y la balanza
export const Pepitas: React.FC<{ t: number; x: number; y: number; n?: number; w?: number; seed?: number; apaga?: number }> = ({ t, x, y, n = 30, w = 400, seed = 7, apaga = 0 }) => {
  const q = React.useMemo(() => { const g = rnd(seed); return Array.from({ length: n }, () => [g() * w - w / 2, g() * 120 - 60, g() * 6.28, 8 + g() * 14]); }, [n, w, seed]);
  return (
    <svg style={{ position: "absolute", left: x - w / 2 - 40, top: y - 100, overflow: "visible" }} width={w + 80} height={200}>
      {q.map(([px, py, a, r], i) => { const br = (Math.sin(t * 5 + a * 3) + 1) / 2; return <g key={i} transform={`translate(${px + w / 2 + 40} ${py + 100}) rotate(${a * 57})`}><path d={`M ${-r} 0 L 0 ${-r * 0.6} L ${r} 0 L 0 ${r * 0.6} Z`} fill={mezcla("#ffd84a", "#7a6a50", apaga)} />{apaga < 0.5 && br > 0.8 && <path d={`M 0 ${-r * 1.4} L 0 ${r * 1.4} M ${-r * 1.4} 0 L ${r * 1.4} 0`} stroke="#fff" strokeWidth={3} />}</g>; })}
    </svg>
  );
};
export const Cofre: React.FC<Pos & { t: number; abre?: number; falso?: number }> = ({ abre = 0, falso = 0, t, ...p }) => (
  <O {...p} t={t} w={420} h={360}>
    <rect x={-170} y={-20} width={340} height={160} rx={14} fill="#8a4a20" stroke="#4e2410" strokeWidth={8} />
    <rect x={-170} y={40} width={340} height={20} fill="#e0b44a" />
    {abre > 0 && <ellipse cx={0} cy={-20} rx={150} ry={30} fill={mezcla("#ffd84a", "#7a6a50", falso)} />}
    <g transform={`rotate(${-abre * 70} -170 -20)`}><path d="M -170 -20 Q 0 -120 170 -20 Z" fill="#9a5a2a" stroke="#4e2410" strokeWidth={8} /></g>
    <rect x={-20} y={20} width={40} height={50} rx={6} fill="#e0b44a" />
  </O>
);
export const Frasco: React.FC<Pos> = (p) => (
  <O {...p} w={160} h={240}>
    <path d="M -60 -20 Q -70 100 0 110 Q 70 100 60 -20 Z" fill="#ff8fc8" stroke="#c0407a" strokeWidth={6} />
    <rect x={-20} y={-70} width={40} height={52} fill="#ffc0e0" stroke="#c0407a" strokeWidth={6} />
    <circle cx={0} cy={-84} r={18} fill="#9a3aa0" />
    <path d="M -36 10 Q -40 60 -20 80" stroke="#fff" strokeWidth={8} fill="none" opacity={0.6} strokeLinecap="round" />
  </O>
);

// ── ratas que corren
export const Rata: React.FC<{ t: number; x: number; y: number; s?: number; flip?: boolean; seed?: number }> = ({ t, x, y, s = 1, flip, seed = 1 }) => {
  const pata = Math.sin(t * 22 + seed) * 10;
  return (
    <svg style={{ position: "absolute", left: x - 90 * s, top: y - 60 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }} width={180 * s} height={90 * s} viewBox="-90 -60 180 90">
      <path d={`M -60 0 Q -110 ${-10 + pata} -88 -40`} stroke="#c88a8a" strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-10} rx={62} ry={30} fill="#6a6070" />
      <ellipse cx={56} cy={-18} rx={30} ry={22} fill="#6a6070" />
      <circle cx={46} cy={-40} r={13} fill="#8a8090" /><circle cx={46} cy={-40} r={7} fill="#e8a0a8" />
      <circle cx={70} cy={-22} r={5} fill="#100810" /><circle cx={86} cy={-14} r={5} fill="#e8a0a8" />
      {[-30, 20].map((px, i) => <line key={i} x1={px} y1={14} x2={px + (i ? pata : -pata)} y2={28} stroke="#4a4050" strokeWidth={8} strokeLinecap="round" />)}
    </svg>
  );
};

// ── olla al fuego (las botas hervidas)
export const Olla: React.FC<Pos & { t: number; dentro?: "bota" | "nada" | "agua" }> = ({ t, dentro = "agua", ...p }) => (
  <O {...p} t={t} w={420} h={420}>
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-80 + i * 40} 170 Q ${-90 + i * 40 + Math.sin(t * 9 + i) * 14} ${110 - (i % 2) * 30} ${-70 + i * 40} ${80 + Math.sin(t * 7 + i) * 10} Q ${-50 + i * 40} 130 ${-60 + i * 40} 170 Z`} fill={i % 2 ? "#ffb020" : "#ff6a2a"} />)}
    <path d="M -150 -40 L 150 -40 Q 150 90 0 100 Q -150 90 -150 -40 Z" fill="#2a2a34" />
    <ellipse cx={0} cy={-40} rx={150} ry={30} fill="#3a3a44" />
    <ellipse cx={0} cy={-36} rx={130} ry={22} fill={dentro === "nada" ? "#1a1a24" : "#8a7a5a"} />
    {dentro === "bota" && <g transform={`translate(10 ${-54 + Math.sin(t * 3) * 6}) rotate(${Math.sin(t * 2) * 10})`}><path d="M -50 -60 L -10 -60 L -10 0 L 60 0 Q 70 20 50 26 L -50 26 Z" fill="#6b3a1f" stroke="#3a1e0e" strokeWidth={5} /></g>}
    {[0, 1, 2].map((i) => { const k = (t * 0.7 + i / 3) % 1; return <path key={i} d={`M ${-40 + i * 40} ${-70 - k * 160} q 20 -30 0 -60`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.5 * (1 - k)} strokeLinecap="round" />; })}
  </O>
);

// ── animales del menú (que se van tachando)
export const Bicho: React.FC<Pos & { k: "caballo" | "cerdo" | "gallina" | "cabra" | "perro" | "gato" | "raton" | "bota" | "cinturon" | "almidon" }> = ({ k, ...p }) => (
  <O {...p} w={260} h={220}>
    {k === "caballo" && <g><ellipse cx={-10} cy={0} rx={90} ry={44} fill="#9a5a2a" /><path d="M 60 -20 L 100 -110 L 140 -96 L 110 -10 Z" fill="#9a5a2a" /><ellipse cx={130} cy={-100} rx={36} ry={22} fill="#9a5a2a" /><path d="M 80 -110 L 70 -60" stroke="#3a1e0e" strokeWidth={14} />{[-70, -40, 30, 60].map((x) => <rect key={x} x={x} y={30} width={16} height={76} fill="#7a4420" />)}<path d="M -100 -10 Q -140 20 -120 60" stroke="#3a1e0e" strokeWidth={14} fill="none" /></g>}
    {k === "cerdo" && <g><ellipse cx={0} cy={0} rx={96} ry={62} fill="#f4a0b0" /><ellipse cx={92} cy={-6} rx={24} ry={20} fill="#e88a9a" /><circle cx={60} cy={-24} r={7} fill="#2a1a2a" /><path d="M 40 -56 L 52 -84 L 66 -54 Z" fill="#e88a9a" />{[-60, -20, 30, 60].map((x) => <rect key={x} x={x} y={50} width={18} height={36} fill="#e88a9a" />)}</g>}
    {k === "gallina" && <g><ellipse cx={0} cy={10} rx={70} ry={56} fill="#fff" /><circle cx={50} cy={-46} r={32} fill="#fff" /><path d="M 40 -80 Q 50 -100 60 -78 Q 70 -96 74 -72 Z" fill={C.rojo} /><path d="M 80 -46 L 104 -38 L 80 -30 Z" fill="#ffb020" /><circle cx={58} cy={-50} r={5} fill="#2a1a2a" /><path d="M -70 0 L -110 -40 L -80 30 Z" fill="#eee" /></g>}
    {k === "cabra" && <g><ellipse cx={0} cy={0} rx={86} ry={46} fill="#e8e0d0" /><ellipse cx={90} cy={-50} rx={34} ry={26} fill="#e8e0d0" /><path d="M 80 -70 Q 70 -120 40 -110" stroke="#8a7a60" strokeWidth={12} fill="none" /><path d="M 100 -26 L 110 0 L 96 -10 Z" fill="#cfc4b0" />{[-60, -30, 30, 60].map((x) => <rect key={x} x={x} y={36} width={14} height={60} fill="#cfc4b0" />)}</g>}
    {k === "perro" && <g><ellipse cx={0} cy={10} rx={80} ry={40} fill="#c08a4a" /><circle cx={80} cy={-30} r={40} fill="#c08a4a" /><ellipse cx={60} cy={-50} rx={16} ry={34} fill="#8a5a2a" transform="rotate(20 60 -50)" /><circle cx={96} cy={-36} r={6} fill="#2a1a10" /><circle cx={120} cy={-24} r={8} fill="#2a1a10" />{[-50, -20, 30, 56].map((x) => <rect key={x} x={x} y={40} width={16} height={46} fill="#a87a3a" />)}<path d="M -80 0 Q -120 -30 -110 -60" stroke="#c08a4a" strokeWidth={14} fill="none" strokeLinecap="round" /></g>}
    {k === "gato" && <g><ellipse cx={0} cy={20} rx={70} ry={40} fill="#ff9a3a" /><circle cx={60} cy={-30} r={38} fill="#ff9a3a" /><path d="M 30 -56 L 34 -92 L 56 -64 Z M 70 -64 L 90 -92 L 94 -56 Z" fill="#ff9a3a" /><circle cx={50} cy={-34} r={6} fill="#2a1a10" /><circle cx={76} cy={-34} r={6} fill="#2a1a10" /><path d="M -70 20 Q -120 0 -100 -60" stroke="#ff9a3a" strokeWidth={14} fill="none" strokeLinecap="round" /></g>}
    {k === "raton" && <g transform="scale(1.3)"><ellipse cx={0} cy={0} rx={50} ry={28} fill="#8a8090" /><circle cx={40} cy={-26} r={14} fill="#a8a0b0" /><circle cx={56} cy={-6} r={5} fill="#2a1a2a" /><path d="M -50 0 Q -90 -10 -80 -40" stroke="#c88a8a" strokeWidth={5} fill="none" /></g>}
    {k === "bota" && <path d="M -60 -90 L 10 -90 L 10 20 L 100 20 Q 116 60 80 70 L -60 70 Z" fill="#6b3a1f" stroke="#3a1e0e" strokeWidth={6} />}
    {k === "cinturon" && <g><path d="M -110 -20 Q 0 40 110 -20 L 110 10 Q 0 70 -110 10 Z" fill="#6b3a1f" /><rect x={-30} y={4} width={60} height={46} rx={6} fill="none" stroke="#e0b44a" strokeWidth={10} /></g>}
    {k === "almidon" && <g><ellipse cx={0} cy={0} rx={100} ry={36} fill="#fbf6ea" />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${-88 + i * 16} -20 Q ${-80 + i * 16} 30 ${-72 + i * 16} -20`} stroke="#d8cfbd" strokeWidth={4} fill="none" />)}</g>}
  </O>
);

// ── tabaco (la planta y la hoja)
export const Tabaco: React.FC<Pos & { crece?: number }> = ({ crece = 1, ...p }) => (
  <O {...p} w={300} h={420}>
    <rect x={-8} y={200 - 360 * crece} width={16} height={360 * crece} fill="#5a8a30" />
    {[0, 1, 2, 3, 4].map((i) => {
      const k = Math.max(0, Math.min(1, crece * 5 - i));
      const y = 170 - i * 70, s = i % 2 ? 1 : -1;
      return <path key={i} d={`M 0 ${y} Q ${s * 140 * k} ${y - 90 * k} ${s * 150 * k} ${y - 10} Q ${s * 80 * k} ${y + 20} 0 ${y} Z`} fill={i % 2 ? "#6aa83a" : "#5a9a30"} />;
    })}
    {crece > 0.95 && <g>{[-30, 0, 30].map((x) => <path key={x} d={`M ${x} -170 L ${x - 10} -210 L ${x + 10} -210 Z`} fill="#ff8fc8" />)}</g>}
  </O>
);

// ── palmera e isla de Bermudas
export const Palmera: React.FC<Pos & { t: number }> = ({ t, ...p }) => (
  <O {...p} t={t} w={400} h={600}>
    <path d="M 0 280 Q 20 100 -10 -160" stroke="#9a6a3a" strokeWidth={30} fill="none" strokeLinecap="round" />
    {[0, 1, 2, 3, 4, 5].map((i) => { const a = -150 + i * 60 + Math.sin(t * 1.5 + i) * 5; return <path key={i} d={`M -10 -160 Q ${Math.cos(a / 57.3) * 120} ${-160 + Math.sin(a / 57.3) * 120 - 40} ${Math.cos(a / 57.3) * 200} ${-160 + Math.sin(a / 57.3) * 200 + 40}`} stroke="#2a9a4a" strokeWidth={26} fill="none" strokeLinecap="round" />; })}
  </O>
);
export const Tortuga: React.FC<Pos> = (p) => (
  <O {...p} w={220} h={140}>
    <ellipse cx={0} cy={0} rx={80} ry={50} fill="#4a8a3a" />
    {[[-30, -10], [20, -16], [0, 20], [40, 14], [-40, 20]].map(([x, y], i) => <path key={i} d={`M ${x - 16} ${y} L ${x} ${y - 14} L ${x + 16} ${y} L ${x} ${y + 14} Z`} fill="#6aa84a" />)}
    <ellipse cx={96} cy={-4} rx={26} ry={18} fill="#8ab060" /><circle cx={104} cy={-8} r={4} fill="#1a1a1a" />
  </O>
);

// ── documentos: libro mayor de la compañía, caja sellada, cartel de propaganda
export const Cartel: React.FC<Pos & { t: number; titulo: string; lineas: string[]; tl?: number[] }> = ({ titulo, lineas, tl = [], t, ...p }) => (
  <O {...p} t={t} w={700} h={860}>
    <rect x={-330} y={-410} width={660} height={820} rx={10} fill="#f4e6c4" stroke="#8a6a3a" strokeWidth={10} />
    <rect x={-300} y={-380} width={600} height={760} fill="none" stroke="#c09a5a" strokeWidth={4} />
    <text x={0} y={-290} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={76} fill="#7a1a24">{titulo}</text>
    <path d="M -200 -250 L 200 -250" stroke="#7a1a24" strokeWidth={6} />
    {lineas.map((l, i) => (t >= (tl[i] ?? -1) ? <text key={i} x={0} y={-160 + i * 92} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={54} fill="#2a1530" transform={`scale(${ent(t, tl[i] ?? -1)})`} style={{ transformOrigin: `0px ${-176 + i * 92}px` }}>{l}</text> : null))}
  </O>
);
export const Corona: React.FC<Pos> = (p) => (
  <O {...p} w={260} h={200}>
    <path d="M -110 60 L -120 -50 L -60 0 L 0 -80 L 60 0 L 120 -50 L 110 60 Z" fill="#f7c548" stroke="#b07a10" strokeWidth={8} />
    {[-60, 0, 60].map((x, i) => <circle key={i} cx={x} cy={30} r={14} fill={[C.rojo, C.teal, C.rojo][i]} />)}
  </O>
);
export const Caja: React.FC<Pos & { t: number; abre?: number }> = ({ abre = 0, t, ...p }) => (
  <O {...p} t={t} w={420} h={340}>
    <rect x={-160} y={-40} width={320} height={160} rx={8} fill="#5a3418" stroke="#2a1408" strokeWidth={8} />
    <g transform={`translate(0 ${-abre * 60}) rotate(${-abre * 20} -160 -40)`}><rect x={-170} y={-80} width={340} height={46} rx={8} fill="#7a4a24" stroke="#2a1408" strokeWidth={8} /></g>
    <circle cx={0} cy={-20} r={26} fill={C.rojo} stroke="#7a1020" strokeWidth={6} opacity={1 - abre} />
    {abre > 0.5 && <rect x={-80} y={-110 - abre * 60} width={160} height={110} fill="#f4e6c4" stroke="#8a6a3a" strokeWidth={5} />}
  </O>
);

// ── explosión de pólvora (destello + chispas)
export const Explosion: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => {
  const u = t - t0;
  if (u < 0 || u > 1.6) return null;
  const q = rnd(Math.round(t0 * 100));
  const ch = Array.from({ length: 26 }, () => [q() * 6.28, 300 + q() * 500]);
  return (
    <svg style={{ position: "absolute", left: x - 600 * s, top: y - 600 * s, overflow: "visible", pointerEvents: "none" }} width={1200 * s} height={1200 * s} viewBox="-600 -600 1200 1200">
      <circle r={80 + u * 520} fill="#fff3c4" opacity={Math.max(0, 1 - u * 2)} />
      <circle r={40 + u * 300} fill="#ffb020" opacity={Math.max(0, 0.9 - u * 1.6)} />
      {ch.map(([a, v], i) => <line key={i} x1={Math.cos(a) * v * u} y1={Math.sin(a) * v * u + u * u * 200} x2={Math.cos(a) * v * (u + 0.05)} y2={Math.sin(a) * v * (u + 0.05) + u * u * 200} stroke={i % 2 ? "#ffd84a" : "#ff6a2a"} strokeWidth={10} strokeLinecap="round" opacity={1 - u / 1.6} />)}
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={Math.cos(i * 1.3) * u * 140} cy={-u * 200 - i * 30} r={50 + u * 90} fill="#5a5060" opacity={Math.max(0, 0.6 - u * 0.4)} />)}
    </svg>
  );
};

// ── copos de nieve (el invierno del hambre)
export const Nieve: React.FC<{ t: number; n?: number; seed?: number; op?: number; viento?: number }> = ({ t, n = 90, seed = 5, op = 0.9, viento = 40 }) => {
  const q = React.useMemo(() => { const g = rnd(seed); return Array.from({ length: n }, () => [g() * 2100 - 90, g(), 0.5 + g() * 0.8, 3 + g() * 7]); }, [n, seed]);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {q.map(([x0, ph, v, r], i) => { const k = (t * 0.16 * v + ph) % 1; return <circle key={i} cx={x0 + Math.sin(t * 1.2 + i) * 30 + k * viento} cy={k * 1160 - 40} r={r} fill="#fff" opacity={op} />; })}
    </svg>
  );
};
// relámpago en la tormenta
export const Rayo: React.FC<{ t: number; t0: number; x: number }> = ({ t, t0, x }) => {
  const u = t - t0;
  if (u < 0 || u > 0.45) return null;
  const on = u < 0.08 || (u > 0.16 && u < 0.24);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: on ? 0.55 : 0, pointerEvents: "none" }} />
      <svg style={{ position: "absolute", left: x - 200, top: 0 }} width={400} height={700}><path d="M 220 0 L 160 220 L 230 230 L 130 480 L 200 490 L 90 700" stroke="#fff8c0" strokeWidth={on ? 16 : 6} fill="none" strokeLinejoin="round" /></svg>
    </>
  );
};

// ── tablero de sobrevivientes: la tabla de madera que acompaña todo el video
export const Tablero: React.FC<{ t: number; valor: number; x?: number; y?: number; titulo?: string; rojo?: boolean; s?: number; op?: number }> = ({ t, valor, x = 1640, y = 120, titulo = "SURVIVORS", rojo, s = 1, op = 1 }) => {
  const golpe = 1 + Math.exp(-((t * 30) % 30) / 4) * 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s * golpe}) rotate(${Math.sin(t * 1.3) * 1.5}deg)`, opacity: op, fontFamily, fontWeight: 700, textAlign: "center" }}>
      <div style={{ position: "absolute", left: "50%", top: -60, width: 4, height: 60, background: "#3a2410" }} />
      <div style={{ background: "linear-gradient(180deg,#a0683a,#7a4a24)", border: "8px solid #4e2a12", borderRadius: 14, padding: "8px 30px 6px", boxShadow: "0 10px 0 rgba(20,10,40,.35)" }}>
        <div style={{ fontSize: 30, color: "#ffe6b0", letterSpacing: 3 }}>{titulo}</div>
        <div style={{ fontSize: 92, lineHeight: 1, color: rojo ? "#ff5a6a" : "#fff3d6", WebkitTextStroke: "6px #2a1408", paintOrder: "stroke fill" }}>{Math.round(valor)}</div>
      </div>
    </div>
  );
};

// ── cartel de trampa clavado en el suelo (sale de la tierra)
export const Poste: React.FC<{ t: number; t0: number; x: number; y: number; n: number; titulo: string; s?: number }> = ({ t, t0, x, y, n, titulo, s = 1 }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 10, stiffness: 160 });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${s}) translateY(${(1 - e) * 320}px) rotate(${(1 - e) * 10 + Math.sin(t * 2) * 1}deg)`, transformOrigin: "50% 100%", fontFamily, fontWeight: 700, textAlign: "center" }}>
      <div style={{ background: "linear-gradient(180deg,#b07a42,#86552a)", border: "10px solid #4e2a12", borderRadius: 18, padding: "14px 54px 10px", boxShadow: "0 14px 0 rgba(20,10,40,.4)" }}>
        <div style={{ fontSize: 52, color: "#ffe6b0", letterSpacing: 4 }}>TRAP #{n}</div>
        <div style={{ fontSize: 110, lineHeight: 1.05, color: "#fff3d6", WebkitTextStroke: "8px #2a1408", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{titulo}</div>
      </div>
      <div style={{ margin: "0 auto", width: 40, height: 300, background: "linear-gradient(90deg,#6a3a1a,#8a5228)" }} />
    </div>
  );
};

// ── viñeta de calor / frío del cuadro completo
export const Tinte: React.FC<{ color: string; op: number }> = ({ color, op }) => (
  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, transparent 55%, ${color} 130%)`, opacity: op, pointerEvents: "none" }} />
);

export const ease = (t: number, a: number, b: number, va: number, vb: number) =>
  interpolate(t, [a, b], [va, vb], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

// ── esturión y peces (el río lleno de comida)
export const Pez: React.FC<{ t: number; x: number; y: number; s?: number; flip?: boolean; esturion?: boolean; seed?: number }> = ({ t, x, y, s = 1, flip, esturion, seed = 1 }) => {
  const w = esturion ? 420 : 160, ond = Math.sin(t * 8 + seed) * 10;
  return (
    <svg style={{ position: "absolute", left: x - w * s / 2, top: y - 60 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }} width={w * s} height={120 * s} viewBox={`${-w / 2} -60 ${w} 120`}>
      <path d={`M ${-w / 2 + 20} 0 L ${-w / 2 - 30} ${-30 + ond} L ${-w / 2 - 20} 0 L ${-w / 2 - 30} ${30 + ond} Z`} fill={esturion ? "#5a6a7a" : "#ff9a5a"} />
      <path d={`M ${-w / 2 + 10} 0 Q 0 ${esturion ? -44 : -50} ${w / 2} 0 Q 0 ${esturion ? 40 : 50} ${-w / 2 + 10} 0 Z`} fill={esturion ? "#7a8a9a" : "#ffb070"} />
      {esturion && Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${-w / 2 + 50 + i * 40} -22 l 10 -12 l 10 12 Z`} fill="#4a5a6a" />)}
      <circle cx={w / 2 - 34} cy={-8} r={esturion ? 7 : 9} fill="#1a1a2a" />
      {esturion && <path d={`M ${w / 2 - 6} 6 l 16 14 M ${w / 2 - 14} 10 l 10 16`} stroke="#4a5a6a" strokeWidth={4} />}
    </svg>
  );
};
// cruz de madera (tumbas, sin morbo)
export const Cruz: React.FC<Pos & { t: number }> = ({ t, ...p }) => (
  <O {...p} t={t} w={120} h={200}>
    <ellipse cx={0} cy={86} rx={56} ry={14} fill="#5a3a22" opacity={0.6} />
    <rect x={-9} y={-80} width={18} height={170} fill="#8a6a4a" stroke="#4e3622" strokeWidth={4} />
    <rect x={-46} y={-44} width={92} height={18} fill="#8a6a4a" stroke="#4e3622" strokeWidth={4} />
  </O>
);
// casa Tudor de Londres (entramado de madera)
export const CasaTudor: React.FC<Pos & { tono?: string; pisos?: number; humo?: boolean; tt?: number }> = ({ tono = "#f4e6c4", pisos = 3, humo = true, tt = 0, ...p }) => {
  const H = pisos * 130;
  return (
    <O {...p} w={420} h={H + 260}>
      <g transform={`translate(0 ${(H + 260) / 2})`}>
        <rect x={-150} y={-H} width={300} height={H} fill={tono} stroke="#3a2416" strokeWidth={10} />
        {Array.from({ length: pisos }, (_, i) => <g key={i}>
          <line x1={-150} y1={-i * 130} x2={150} y2={-i * 130} stroke="#3a2416" strokeWidth={12} />
          <line x1={-150} y1={-i * 130} x2={-60} y2={-(i + 1) * 130} stroke="#3a2416" strokeWidth={8} />
          <line x1={150} y1={-i * 130} x2={60} y2={-(i + 1) * 130} stroke="#3a2416" strokeWidth={8} />
          <rect x={-40} y={-(i + 1) * 130 + 30} width={80} height={60} fill={i === 0 ? "#3a2416" : "#ffd27a"} stroke="#3a2416" strokeWidth={6} />
        </g>)}
        <path d={`M -180 ${-H} L 0 ${-H - 170} L 180 ${-H} Z`} fill="#6a3a2a" stroke="#3a2416" strokeWidth={8} />
        <rect x={70} y={-H - 150} width={40} height={90} fill="#7a4a3a" />
        {humo && [0, 1, 2].map((i) => { const k = (tt * 0.35 + i / 3) % 1; return <circle key={i} cx={90 + k * 50} cy={-H - 170 - k * 200} r={18 + k * 40} fill="#cfc8d0" opacity={0.55 * (1 - k)} />; })}
      </g>
    </O>
  );
};
export const Barril: React.FC<Pos> = (p) => (
  <O {...p} w={160} h={200}>
    <path d="M -60 -80 Q -80 0 -60 80 L 60 80 Q 80 0 60 -80 Z" fill="#a0683a" stroke="#4e2a12" strokeWidth={6} />
    {[-50, 0, 50].map((y) => <path key={y} d={`M -70 ${y} Q 0 ${y + 10} 70 ${y}`} stroke="#3a3a44" strokeWidth={10} fill="none" />)}
  </O>
);
// cabo boscoso (la curva del río)
export const Cabo: React.FC<{ x: number; w?: number }> = ({ x, w = 700 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: 560, overflow: "visible" }} width={w} height={500}>
    <path d={`M 0 340 Q ${w * 0.2} 260 ${w * 0.5} 250 Q ${w * 0.8} 260 ${w} 340 L ${w} 500 L 0 500 Z`} fill="#3e6a28" />
    {Array.from({ length: 9 }, (_, i) => <g key={i} transform={`translate(${40 + i * (w - 80) / 8} ${270 - Math.sin((i / 8) * Math.PI) * 40})`}><path d="M -70 60 L 0 -200 L 70 60 Z" fill={i % 2 ? "#1f6a3a" : "#185a30"} /><path d="M -56 -20 L 0 -260 L 56 -20 Z" fill={i % 2 ? "#2a7a44" : "#1f6a3a"} /></g>)}
  </svg>
);
