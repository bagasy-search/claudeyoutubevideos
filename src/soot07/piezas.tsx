import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { C, ent, fontFamily } from "./kit";
import { Persona, CIVIL, Ropa, Expr } from "./persona";
import { CALLE, edifEn, X } from "./motor07";
import { altoEdif } from "./mundo";

// Piezas que viven EN el mundo (coordenadas de mundo, suelo y = 0): carros con bueyes, cosas que caen de las
// ventanas, Juvenal asomado, la inundación, el derrumbe, la escalera de la casa. Todo vector en código.
export const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const en = (t: number, a: number, b: number) => t >= a && t < b;
const K = "#1a0d24";

// centro de la ventana más cercana a x en el piso p (0 = primer piso sobre la planta baja)
export const ventana = (x: number, p: number) => {
  const e = edifEn(x) ?? CALLE[0];
  const nv = Math.max(2, Math.floor(e.w / 150));
  const k = Math.max(0, Math.min(nv - 1, Math.floor(((x - e.x) / e.w) * nv)));
  const pp = Math.max(0, Math.min(e.pisos - 2, p));
  return { x: e.x + (e.w / nv) * (k + 0.5), y: -270 - (pp + 1) * 200 + 96, e };
};

// ── buey (mira a la izquierda), patas que caminan
export const Buey: React.FC<{ x: number; y: number; t: number; paso: number; s?: number }> = ({ x, y, t, paso, s = 1 }) => {
  const f = t * paso * Math.PI * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[[-70, 0], [-30, 1], [60, 1], [100, 0]].map(([lx, ph], i) => (
        <rect key={i} x={lx - 10} y={-80} width={22} height={82} rx={8} fill="#5a3420" transform={`rotate(${Math.sin(f + ph * Math.PI) * 16} ${lx} -80)`} />
      ))}
      <ellipse cx={20} cy={-120} rx={120} ry={62} fill="#8a5632" />
      <ellipse cx={40} cy={-150} rx={70} ry={22} fill="#a86a3e" opacity={0.6} />
      <g transform={`translate(-110 ${-140 + Math.sin(f * 2) * 4})`}>
        <ellipse cx={0} cy={0} rx={46} ry={36} fill="#8a5632" />
        <ellipse cx={-30} cy={14} rx={24} ry={18} fill="#c9a08a" />
        <path d="M 10 -26 Q 40 -60 70 -44" stroke="#efe3c8" strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d="M -14 -28 Q -40 -64 -70 -50" stroke="#efe3c8" strokeWidth={10} fill="none" strokeLinecap="round" />
        <circle cx={-14} cy={-6} r={6} fill={K} />
      </g>
      <path d={`M 140 -140 Q 170 ${-100 + Math.sin(f) * 14} 160 -60`} stroke="#5a3420" strokeWidth={8} fill="none" />
    </g>
  );
};

export type Carga = "sacos" | "anforas" | "tronco" | "marmol" | "vacio";
// ── carro de dos bueyes: rueda que gira según el avance; `vuelco` 0-1 rompe el eje
export const Carro: React.FC<{ x: number; t: number; carga: Carga; vx: number; balanceo?: number; vuelco?: number; y?: number; s?: number; luz?: boolean }> = ({ x, t, carga, vx, balanceo = 0, vuelco = 0, y = 0, s = 1, luz = true }) => {
  const rueda = (x / 90) * (180 / Math.PI);
  const paso = Math.abs(vx) / 260;
  const sway = Math.sin(t * 1.6) * balanceo;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Buey x={-330} y={0} t={t} paso={paso} />
      <Buey x={-300} y={-6} t={t + 0.3} paso={paso} s={0.96} />
      <line x1={-220} y1={-120} x2={-40} y2={-110} stroke="#6b3a1f" strokeWidth={14} />
      <g transform={`rotate(${vuelco * 16} 160 -40)`}>
        <rect x={-60} y={-170} width={420} height={70} rx={8} fill="#8c5a2c" />
        <rect x={-60} y={-170} width={420} height={16} fill="#a8743c" />
        {[0, 1, 2, 3, 4].map((k) => <line key={k} x1={-40 + k * 90} y1={-170} x2={-40 + k * 90} y2={-100} stroke="#5a3418" strokeWidth={6} />)}
        <g transform={`rotate(${sway} 150 -170)`}>
          {carga === "sacos" && [0, 1, 2, 3, 4, 5].map((k) => <ellipse key={k} cx={-10 + (k % 3) * 120} cy={-200 - Math.floor(k / 3) * 60} rx={66} ry={42} fill={k % 2 ? "#d8b878" : "#c9a060"} stroke={K} strokeWidth={5} />)}
          {carga === "anforas" && [0, 1, 2, 3, 4].map((k) => <g key={k} transform={`translate(${-10 + k * 80} -230)`}><path d="M -22 -60 Q -40 0 0 60 Q 40 0 22 -60 Z" fill="#c9673f" stroke={K} strokeWidth={5} /><rect x={-10} y={-80} width={20} height={22} fill="#a8512c" /></g>)}
          {carga === "tronco" && <g><rect x={-260} y={-250} width={900} height={74} rx={36} fill="#7a4a24" stroke={K} strokeWidth={6} /><ellipse cx={640} cy={-213} rx={26} ry={37} fill="#d8a86a" stroke={K} strokeWidth={6} /><circle cx={640} cy={-213} r={10} fill="none" stroke="#a8743c" strokeWidth={4} /><line x1={-200} y1={-230} x2={560} y2={-232} stroke="#5a3418" strokeWidth={5} /></g>}
          {carga === "marmol" && vuelco < 0.25 && <g><rect x={-20} y={-330} width={340} height={160} fill="#e9e4da" stroke={K} strokeWidth={6} /><path d="M 20 -300 q 60 30 120 -10 t 140 20" stroke="#b9b0a4" strokeWidth={5} fill="none" /></g>}
        </g>
      </g>
      {[20, 280].map((wx, i) => (
        <g key={i} transform={`translate(${wx} -60) rotate(${rueda + (i === 1 ? vuelco * 40 : 0)})`}>
          <circle r={60} fill="none" stroke="#4a2a14" strokeWidth={16} />
          {[0, 45, 90, 135].map((a) => <line key={a} x1={0} y1={0} x2={0} y2={60} stroke="#4a2a14" strokeWidth={8} transform={`rotate(${a}) translate(0 -30)`} />)}
          <circle r={12} fill="#2a1a10" />
        </g>
      ))}
      {/* el carrero, con su linterna (la única luz que tiene la vía) */}
      <g transform="translate(-60 -170)">
        <circle cx={0} cy={-60} r={30} fill="#c98b62" stroke={K} strokeWidth={5} />
        <path d="M -30 -40 L 30 -40 L 36 20 L -36 20 Z" fill="#5c8f3e" stroke={K} strokeWidth={5} />
        <path d={`M 30 -20 L ${-150} ${-100 + Math.sin(t * 5) * 30}`} stroke="#3a2010" strokeWidth={4} fill="none" />
        {luz && <g transform="translate(-40 -10)"><rect x={-10} y={-26} width={20} height={30} fill="#ffcf6a" stroke={K} strokeWidth={4} /></g>}
      </g>
    </g>
  );
};

// ── objetos que caen de las ventanas (con gravedad) y revientan contra el suelo
export type Caida = { t0: number; x: number; y: number; k: "olla" | "agua" | "tiesto" | "verdura" | "orinal" | "maceta"; yFin?: number };
const G = 2600;
export const tCaida = (c: Caida) => Math.sqrt((2 * ((c.yFin ?? 0) - c.y)) / G);
export const Caidas: React.FC<{ t: number; lista: Caida[] }> = ({ t, lista }) => (
  <g>
    {lista.map((c, i) => {
      const lt = t - c.t0;
      if (lt < 0) return null;
      const d = tCaida(c);
      const yF = c.yFin ?? 0;
      const r = rnd(i * 17 + 3);
      if (lt < d) {
        const y = c.y + 0.5 * G * lt * lt;
        const rot = lt * 400 * (r() - 0.5);
        if (c.k === "agua") return <path key={i} d={`M ${c.x - 30} ${y - 80} Q ${c.x} ${y + 40} ${c.x + 30} ${y - 80} Z`} fill="#c7b23a" opacity={0.85} />;
        return <g key={i} transform={`translate(${c.x} ${y}) rotate(${rot})`}>{OBJ[c.k]}</g>;
      }
      const s = lt - d;
      if (s > 25) return null;
      const op = cl(1 - s / 0.7);
      const charco = cl(1 - (s - 12) / 8);
      const col = c.k === "agua" || c.k === "orinal" ? "#c7b23a" : c.k === "verdura" ? "#7aa83a" : "#c9673f";
      return (
        <g key={i}>
          {yF >= 0 && <ellipse cx={c.x} cy={yF + 4} rx={70 + Math.min(1, s * 4) * 40} ry={14} fill={col} opacity={0.55 * charco} />}
          {op > 0 && Array.from({ length: 9 }, (_, k) => {
            const a = -Math.PI * (0.1 + 0.8 * (k / 8));
            const v0 = 300 + r() * 400;
            const px = c.x + Math.cos(a) * v0 * s, py = yF + Math.sin(a) * v0 * s + 0.5 * G * s * s;
            return <rect key={k} x={px - 9} y={Math.min(yF, py) - 9} width={18} height={14} rx={4} fill={col} opacity={op} transform={`rotate(${k * 40 + s * 500} ${px} ${py})`} />;
          })}
        </g>
      );
    })}
  </g>
);
const OBJ: Record<string, React.ReactNode> = {
  olla: <g stroke={K} strokeWidth={6}><path d="M -46 -30 Q -56 40 0 46 Q 56 40 46 -30 Z" fill="#c9673f" /><ellipse cx={0} cy={-30} rx={48} ry={14} fill="#8a3a1f" /><path d="M -46 -10 Q -70 -10 -64 10" fill="none" /><path d="M 46 -10 Q 70 -10 64 10" fill="none" /></g>,
  tiesto: <g stroke={K} strokeWidth={6}><path d="M -40 -20 L 40 -20 L 30 40 L -30 40 Z" fill="#c9673f" /><path d="M -20 -20 L -30 -70 M 0 -20 L 6 -80 M 20 -20 L 34 -66" stroke="#4f8a3a" strokeWidth={10} /></g>,
  maceta: <g stroke={K} strokeWidth={6}><path d="M -40 -20 L 40 -20 L 30 40 L -30 40 Z" fill="#c9673f" /><circle cx={-16} cy={-48} r={22} fill="#e8344a" /><circle cx={18} cy={-56} r={20} fill="#ffb020" /><path d="M -10 -20 L -14 -40 M 12 -20 L 16 -40" stroke="#4f8a3a" strokeWidth={8} /></g>,
  verdura: <g stroke={K} strokeWidth={5}><ellipse cx={0} cy={0} rx={34} ry={22} fill="#7aa83a" /><path d="M -20 -10 Q 0 -40 24 -12" fill="#9be15d" /></g>,
  orinal: <g stroke={K} strokeWidth={6}><path d="M -44 -20 Q -48 40 0 44 Q 48 40 44 -20 Z" fill="#b8a888" /><ellipse cx={0} cy={-20} rx={46} ry={14} fill="#c7b23a" /></g>,
};

// ── alguien asomado a una ventana (Juvenal, el vecino, Cicerón): ventana iluminada + medio cuerpo
export const Asomado: React.FC<{ t: number; t0: number; t1: number; x: number; y: number; ropa?: Ropa; expr?: Expr; habla?: boolean; rollo?: boolean; seed?: number; bD?: number; cD?: number; manoD?: React.ReactNode; laurel?: boolean }> = ({ t, t0, t1, x, y, ropa = CIVIL(2), expr = "orgullo", habla = true, rollo, seed = 40, bD, cD, manoD, laurel = true }) => {
  if (t < t0 - 0.1 || t > t1 + 0.6) return null;
  const sube = ent(t, t0, 0, { damping: 13, stiffness: 160 }) * (1 - cl((t - t1) / 0.5));
  const abre = cl((t - t0 + 0.1) / 0.25) * (1 - cl((t - t1 - 0.3) / 0.3));
  return (
    <>
      <svg style={{ position: "absolute", left: x - 140, top: y - 160, overflow: "visible" }} width={280} height={300} viewBox="-140 -160 280 300">
        <rect x={-120} y={-150} width={240} height={250} fill="#2a1626" />
        <rect x={-104} y={-136} width={208} height={222} fill="#ffcf6a" />
        <rect x={-104} y={-136} width={208} height={222} fill="#ffefb8" opacity={0.35} />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, clipPath: `inset(${y - 136}px -9999999px ${-(y + 86)}px -9999999px)` }}>
        <Persona x={x} y={y + 200 + 240 * (1 - sube)} h={300} t={t} seed={seed} ropa={ropa} expr={expr} habla={habla && sube > 0.6} bD={bD} cD={cD} manoD={manoD} />
        {laurel && sube > 0.05 && (
          <svg style={{ position: "absolute", left: x - 80, top: y + 200 + 240 * (1 - sube) - 300 * (450 / 560) - 70, overflow: "visible" }} width={160} height={60} viewBox="-80 -30 160 60">
            {[-1, 1].map((d) => [0, 1, 2, 3].map((k) => <ellipse key={`${d}${k}`} cx={d * (20 + k * 16)} cy={8 - k * 4} rx={12} ry={6} fill="#5c8f3e" transform={`rotate(${d * (20 + k * 12)} ${d * (20 + k * 16)} ${8 - k * 4})`} />))}
          </svg>
        )}
      </div>
      <svg style={{ position: "absolute", left: x - 140, top: y - 160, overflow: "visible" }} width={280} height={300} viewBox="-140 -160 280 300">
        <rect x={-132} y={86} width={264} height={26} fill="#4a2a22" stroke={K} strokeWidth={5} />
        {/* postigos que se abren */}
        <rect x={-104 - 96 * abre} y={-136} width={104} height={222} fill="#4a2a22" stroke={K} strokeWidth={4} />
        <rect x={96 * abre} y={-136} width={104} height={222} fill="#4a2a22" stroke={K} strokeWidth={4} />
        {rollo && sube > 0.6 && (
          <g transform={`translate(70 ${40 + 60 * (1 - sube)}) rotate(-8)`}>
            <rect x={-12} y={-10} width={130 * cl((t - t0 - 0.4) / 0.5)} height={90} fill="#f2e2b8" stroke={K} strokeWidth={4} />
            <rect x={-22} y={-16} width={20} height={102} rx={8} fill="#c9a46a" stroke={K} strokeWidth={4} />
            {[0, 1, 2, 3].map((k) => <line key={k} x1={8} y1={8 + k * 18} x2={8 + 96 * cl((t - t0 - 0.6 - k * 0.15) / 0.4)} y2={8 + k * 18} stroke="#5a3a20" strokeWidth={4} />)}
          </g>
        )}
      </svg>
    </>
  );
};

// ── el agua que sube por los desagües (valle) y lo inunda todo
export const Inundacion: React.FC<{ t: number; x0: number; x1: number; nivel: number }> = ({ t, x0, x1, nivel }) => {
  if (nivel <= 1) return null;
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += 60) pts.push(`${x},${-nivel + Math.sin(x * 0.012 + t * 2.4) * 10 + Math.sin(x * 0.031 - t * 3.1) * 5}`);
  return (
    <g>
      <polygon points={`${x0},600 ${pts.join(" ")} ${x1},600`} fill="#2f7f8f" opacity={0.78} />
      <polyline points={pts.join(" ")} fill="none" stroke="#9be7f0" strokeWidth={6} opacity={0.9} />
      {Array.from({ length: 14 }, (_, k) => { const bx = x0 + ((k * 397 + t * 40) % (x1 - x0)); return <ellipse key={k} cx={bx} cy={-nivel + 30 + (k % 3) * 20} rx={30} ry={4} fill="#c9f4f8" opacity={0.4} />; })}
    </g>
  );
};
// ── chorros que salen de una rejilla (el agua que vuelve al revés)
export const Chorro: React.FC<{ t: number; t0: number; x: number; alto?: number }> = ({ t, t0, x, alto = 260 }) => {
  const lt = t - t0;
  if (lt < 0 || lt > 3.4) return null;
  const h = alto * Math.sin(Math.min(Math.PI, lt / 3.4 * Math.PI)) * (0.85 + 0.15 * Math.sin(t * 20));
  return (
    <g>
      <rect x={x - 50} y={-8} width={100} height={14} fill="#2a1a20" />
      {[0, 1, 2, 3].map((k) => <line key={k} x1={x - 36 + k * 24} y1={-8} x2={x - 36 + k * 24} y2={6} stroke="#555" strokeWidth={5} />)}
      <path d={`M ${x - 34} 0 Q ${x - 20} ${-h} ${x} ${-h - 20} Q ${x + 20} ${-h} ${x + 34} 0 Z`} fill="#5fb7c4" opacity={0.85} />
      {Array.from({ length: 8 }, (_, k) => <circle key={k} cx={x + Math.cos(k + t * 6) * (40 + k * 6)} cy={-h - 10 + Math.sin(k * 3 + t * 9) * 26 + k * 8} r={9} fill="#c9f4f8" />)}
    </g>
  );
};

// ── derrumbe: un bloque del ancho del edificio que se ladea, cae y deja escombro y polvo
export const Derrumbe: React.FC<{ t: number; t0: number; x: number; w: number; h: number; col?: string }> = ({ t, t0, x, w, h, col = "#7c5060" }) => {
  const lt = t - t0;
  if (lt < -0.6) return null;
  const temb = lt < 0 ? Math.sin(t * 60) * 6 * (1 + lt / 0.6) : 0;
  const u = cl(lt / 1.1);
  const rot = Easing.in(Easing.quad)(u) * 78;
  const r = rnd(Math.round(x));
  return (
    <g>
      {u < 1 && (
        <g transform={`translate(${x + temb} 0) rotate(${rot} ${w} 0)`}>
          <rect x={0} y={-h} width={w} height={h} fill={col} stroke={K} strokeWidth={6} />
          {Array.from({ length: Math.floor(h / 200) }, (_, p) => Array.from({ length: Math.max(2, Math.floor(w / 150)) }, (_, k) => (
            <rect key={`${p}${k}`} x={(w / Math.max(2, Math.floor(w / 150))) * (k + 0.5) - 32} y={-h + 60 + p * 200} width={64} height={88} fill={p % 2 ? "#ff7a2a" : "#1a1028"} />
          )))}
          <path d={`M ${w * 0.3} ${-h} l 40 ${h * 0.3} l -30 ${h * 0.2} l 50 ${h * 0.25}`} stroke={K} strokeWidth={6} fill="none" />
        </g>
      )}
      {lt > 0.9 && (
        <g>
          {Array.from({ length: 16 }, (_, k) => <rect key={k} x={x - 80 + r() * (w + 400)} y={-40 - r() * 90} width={60 + r() * 80} height={40 + r() * 40} fill={k % 3 ? col : "#4a2a22"} stroke={K} strokeWidth={5} transform={`rotate(${r() * 60 - 30})`} />)}
          {Array.from({ length: 12 }, (_, k) => { const s = lt - 0.9; const rr = 120 + s * 160 + k * 10; return <circle key={`p${k}`} cx={x + w / 2 + Math.cos(k) * rr * 1.6} cy={-80 - Math.abs(Math.sin(k * 1.7)) * rr * 0.6} r={90 + s * 60} fill="#b9a8a0" opacity={cl(0.6 - s / 6)} />; })}
        </g>
      )}
    </g>
  );
};

// ── escalera exterior de madera de la ínsula (subida final de 5 pisos)
export const Escalera: React.FC<{ x: number; pisos: number }> = ({ x, pisos }) => (
  <g>
    {Array.from({ length: pisos }, (_, p) => {
      const y0 = -p * 220, dir = p % 2 ? -1 : 1;
      return (
        <g key={p}>
          <line x1={x - dir * 120} y1={y0} x2={x + dir * 120} y2={y0 - 220} stroke="#5a3418" strokeWidth={16} />
          {Array.from({ length: 8 }, (_, k) => <line key={k} x1={x - dir * 120 + dir * k * 30} y1={y0 - k * 27.5} x2={x - dir * 120 + dir * k * 30 + dir * 26} y2={y0 - k * 27.5} stroke="#8c5a2c" strokeWidth={10} />)}
          <rect x={x - 150} y={y0 - 230} width={300} height={14} fill="#6b3a1f" />
          <line x1={x - 150} y1={y0 - 216} x2={x - 150} y2={y0 + 4} stroke="#4a2a14" strokeWidth={8} />
          <line x1={x + 150} y1={y0 - 216} x2={x + 150} y2={y0 + 4} stroke="#4a2a14" strokeWidth={8} />
        </g>
      );
    })}
  </g>
);
export const subidaPos = (x: number, u: number, pisos: number) => {
  const tramo = Math.min(pisos - 1e-6, u * pisos);
  const p = Math.floor(tramo), f = tramo - p, dir = p % 2 ? -1 : 1;
  return { x: x - dir * 120 + dir * 240 * f, y: -p * 220 - 220 * f, dir };
};

// ── puntales de madera torcidos contra una fachada (la Roma sostenida con palitos)
export const Puntales: React.FC<{ t: number; t0: number; x: number; h: number }> = ({ t, t0, x, h }) => {
  if (t < t0) return null;
  return <g>{[0, 1, 2].map((k) => { const e = ent(t, t0, k * 0.2); return <line key={k} x1={x + k * 180 - 160} y1={0} x2={x + k * 180} y2={-h * (0.4 + k * 0.15) * e} stroke="#8c5a2c" strokeWidth={18} strokeLinecap="round" />; })}</g>;
};

// ── ratones que salen corriendo por la puerta
export const Ratones: React.FC<{ t: number; t0: number; x: number }> = ({ t, t0, x }) => (
  <g>
    {[0, 0.25, 0.5, 0.8, 1.1, 1.4].map((d, k) => {
      const lt = t - t0 - d;
      if (lt < 0 || lt > 4) return null;
      const px = x + lt * 520, py = -14 - Math.abs(Math.sin(lt * 18)) * 10;
      return (
        <g key={k} transform={`translate(${px} ${py})`}>
          <ellipse cx={0} cy={0} rx={34} ry={18} fill="#8a8090" stroke={K} strokeWidth={4} />
          <circle cx={30} cy={-8} r={12} fill="#8a8090" stroke={K} strokeWidth={4} />
          <circle cx={26} cy={-20} r={7} fill="#e8b0c0" />
          <path d={`M -34 0 Q -60 ${-14 + Math.sin(lt * 20) * 8} -80 -4`} stroke="#e8b0c0" strokeWidth={4} fill="none" />
          {k === 0 && <g transform="translate(-10 -40)"><rect x={-26} y={-30} width={50} height={34} fill="#c9a060" stroke={K} strokeWidth={3} /></g>}
        </g>
      );
    })}
  </g>
);

// ── lámpara de barro (va en la mano del protagonista)
export const Lampara: React.FC<{ t: number; on: number }> = ({ t, on }) => (
  <g transform="scale(1.5)">
    <path d="M -34 0 Q -30 -22 0 -22 Q 30 -22 40 -8 L 58 -10 Q 62 2 40 6 Q 10 14 -34 0 Z" fill="#c9673f" stroke={K} strokeWidth={5} />
    <circle cx={-2} cy={-14} r={6} fill="#5a2a1a" />
    {on > 0 && <path d={`M 52 -10 Q ${46 + Math.sin(t * 14) * 4} ${-40 - on * 14} 60 ${-56 - on * 10} Q ${68 + Math.sin(t * 11) * 4} -30 60 -10 Z`} fill="#ffd23a" stroke="#ff8a2a" strokeWidth={3} opacity={on} />}
  </g>
);

// ── gente de relleno (fiesta de la villa, la multitud del giro)
export const Gente: React.FC<{ t: number; lista: { x: number; v: number; seed: number; t0: number; t1: number; h?: number; expr?: Expr; carga?: React.ReactNode }[] }> = ({ t, lista }) => (
  <>
    {lista.map((g, i) => {
      if (t < g.t0 || t > g.t1) return null;
      const x = g.x + g.v * (t - g.t0);
      return <Persona key={i} x={x} y={8} h={g.h ?? 250} t={t} seed={g.seed} ropa={CIVIL(g.seed)} camina={g.v ? Math.abs(g.v) / 170 : 0} flip={g.v < 0} expr={g.expr ?? "neutro"} manoD={g.carga} bD={g.carga ? 40 : undefined} cD={g.carga ? 70 : undefined} opacity={cl((t - g.t0) / 0.4) * cl((g.t1 - t) / 0.4)} />;
    })}
  </>
);

// ── marquitas de "obstáculo" que asoman por el camino (gancho)
export const Peligros: React.FC<{ t: number; t0: number; t1: number; x0: number }> = ({ t, t0, t1, x0 }) => {
  if (t < t0 || t > t1 + 0.4) return null;
  const out = 1 - cl((t - t1) / 0.4);
  return (
    <g>
      {[0, 1, 2, 3, 4].map((k) => {
        const e = ent(t, t0 + 0.2 + k * 0.8) * out;
        const x = x0 + 300 + k * 420;
        return (
          <g key={k} transform={`translate(${x} -10) scale(${e})`}>
            <line x1={0} y1={0} x2={0} y2={-150} stroke="#3a2010" strokeWidth={10} />
            <path d="M 0 -280 L 70 -160 L -70 -160 Z" fill={C.ambar} stroke={K} strokeWidth={8} strokeLinejoin="round" />
            <text x={0} y={-176} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={80} fill={K}>!</text>
          </g>
        );
      })}
    </g>
  );
};

// ── sombra chinesca (Nerón): siluetas sobre un muro iluminado por la lámpara
export const MuroSombras: React.FC<{ t: number; t0: number; t1: number; x: number; luz: number }> = ({ t, t0, t1, x, luz }) => {
  if (t < t0 - 0.5 || t > t1 + 1) return null;
  const op = cl((t - t0 + 0.5) / 0.8) * (1 - cl((t - t1) / 1));
  return (
    <svg style={{ position: "absolute", left: x - 900, top: -1080, overflow: "visible", opacity: op }} width={1800} height={1080} viewBox={`-900 -1080 1800 1080`}>
      <defs>
        <radialGradient id="msluz" cx="0.45" cy="0.55" r="0.6"><stop offset="0" stopColor="#ffd9a0" stopOpacity={0.95 * luz} /><stop offset="0.6" stopColor="#e8a060" stopOpacity={0.6 * luz} /><stop offset="1" stopColor="#6d4466" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={-900} y={-1080} width={1800} height={1080} fill="#7c5060" />
      <rect x={-900} y={-1080} width={1800} height={1080} fill="url(#msluz)" />
      {Array.from({ length: 9 }, (_, k) => <line key={k} x1={-900} y1={-1000 + k * 110} x2={900} y2={-1000 + k * 110} stroke="#000" strokeOpacity={0.06} strokeWidth={4} />)}
    </svg>
  );
};
export const ALTO = altoEdif;
export { X };
export const easeIO = Easing.inOut(Easing.cubic);
export const lerp = (t: number, a: number, b: number, va: number, vb: number, e = easeIO) => interpolate(t, [a, b], [va, vb], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
