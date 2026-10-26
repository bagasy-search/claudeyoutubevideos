// Piezas nuevas para lc04b (E46-E82): contadores de pantalla, barras, calendario de tachas, ventana con siluetas,
// mano con brocha, muro de piedras, moscas, gotas, flechas de aire frío, confeti de hojas, estrellitas. Todo vector en código.
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { useF } from "../../anikit/camara";
import { Halo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { Papa } from "./granja";
import { Escarabajo } from "./piezas4";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const fmt = (n: number, dec = 0) => n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);

// ---------- DATO: píldora oscura con rótulo + número que corre (HUD, coordenadas de pantalla) ----------
export const Dato: React.FC<{ x: number; y: number; rotulo: string; de: number; a: number; desde: number; fin?: number; hasta?: number; sufijo?: string; color?: string; tam?: number; dec?: number; total?: string; vivo?: boolean; v?: number }> = ({ x, y, rotulo, de, a, desde, fin, hasta, sufijo = "", color = "#ffcf6e", tam = 74, dec = 0, total, vivo = true, v: vFijo }) => {
  const f = useF();
  if (f < desde) return null;
  const e = Math.min(1, Math.max(0, (f - desde) / 8));
  const fin2 = fin ?? desde + 70;
  const u = ease(f, desde + 4, fin2);
  const v = vFijo ?? de + (a - de) * u;
  const pop = vivo ? interpolate(((f - desde) % 24), [0, 3, 12], [0.06, 0.0, 0], cl) * (u > 0 && u < 1 ? 1 : 0) + (u >= 1 ? interpolate(f - fin2, [0, 4, 14], [0, 0.14, 0], cl) : 0) : 0;
  const o = hasta ? Math.min(e, interpolate(f, [hasta - 10, hasta], [1, 0], cl)) : e;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${(0.88 + 0.12 * e) * (1 + pop)})`, opacity: o, textAlign: "center", fontFamily: F_HUD, whiteSpace: "nowrap", background: "rgba(14,10,18,0.78)", border: `3px solid ${color}`, borderRadius: 26, padding: `${tam * 0.12}px ${tam * 0.4}px ${tam * 0.16}px`, boxShadow: `0 0 28px ${color}44, 0 6px 0 rgba(0,0,0,0.4)` }}>
      <div style={{ fontWeight: 500, fontSize: tam * 0.34, letterSpacing: 3, color: "#f3ead2" }}>{rotulo}</div>
      <div style={{ fontWeight: 600, fontSize: tam, lineHeight: 1.02, color, fontVariantNumeric: "tabular-nums" }}>{fmt(v, dec)}{sufijo}{total ? <span style={{ fontSize: tam * 0.5, color: "#f3ead2" }}> {total}</span> : null}</div>
    </div>
  );
};

// ---------- BARRA de progreso (HUD) ----------
export const Barra: React.FC<{ x: number; y: number; w: number; rotulo: string; de: number; a: number; desde: number; fin?: number; hasta?: number; color?: string; texto?: (v: number) => string; tam?: number }> = ({ x, y, w, rotulo, de, a, desde, fin, hasta, color = "#7cd36a", texto, tam = 40 }) => {
  const f = useF();
  if (f < desde) return null;
  const e = Math.min(1, (f - desde) / 8);
  const fin2 = fin ?? desde + 80;
  const u = ease(f, desde + 4, fin2);
  const v = de + (a - de) * u;
  const o = hasta ? Math.min(e, interpolate(f, [hasta - 10, hasta], [1, 0], cl)) : e;
  const pop = interpolate(f - fin2, [0, 4, 14], [0, 0.08, 0], cl);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, opacity: o, transform: `scale(${1 + pop})`, fontFamily: F_HUD, background: "rgba(14,10,18,0.78)", border: `3px solid ${color}`, borderRadius: 22, padding: `${tam * 0.2}px ${tam * 0.5}px ${tam * 0.3}px`, boxShadow: "0 6px 0 rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: tam, color: "#f3ead2" }}><span style={{ letterSpacing: 2 }}>{rotulo}</span><span style={{ color, fontVariantNumeric: "tabular-nums" }}>{texto ? texto(v) : `${Math.round(v * 100)}%`}</span></div>
      <div style={{ marginTop: tam * 0.2, height: tam * 0.5, borderRadius: tam, background: "#2a2430", overflow: "hidden" }}><div style={{ width: `${Math.max(0, Math.min(1, v)) * 100}%`, height: "100%", background: color, borderRadius: tam }} /></div>
    </div>
  );
};

// ---------- capa SVG en coordenadas de pantalla (para insertos: manómetro, termómetro, ventana) ----------
export const Pip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ overflow: "visible" }}>{children}</svg>
  </div>
);

// ---------- calendario de tachas: celdas con el número del día y una X roja a medida que pasan ----------
export const CalTachas: React.FC<{ x: number; y: number; titulo: string; n: number; cols: number; k: number; desde: number; tam?: number; ini?: number; color?: string }> = ({ x, y, titulo, n, cols, k, desde, tam = 46, ini = 1, color = "#e2483a" }) => {
  const f = useF();
  if (f < desde) return null;
  const e = Math.min(1, (f - desde) / 8);
  const rows = Math.ceil(n / cols);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${0.9 + 0.1 * e})`, opacity: e, fontFamily: F_HUD, background: "rgba(246,239,224,0.96)", border: "4px solid #2a1c18", borderRadius: 16, padding: tam * 0.25, boxShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
      <div style={{ background: color, color: "#fff", fontWeight: 600, fontSize: tam * 0.8, textAlign: "center", letterSpacing: 4, borderRadius: 8, marginBottom: tam * 0.15 }}>{titulo}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${tam}px)`, gridTemplateRows: `repeat(${rows}, ${tam}px)`, gap: 4 }}>
        {Array.from({ length: n }).map((_, i) => {
          const t = Math.min(1, Math.max(0, k - i));
          return (
            <div key={i} style={{ position: "relative", fontSize: tam * 0.5, fontWeight: 600, color: "#2a1c18", display: "flex", alignItems: "center", justifyContent: "center", background: t > 0 ? "#efe0c0" : "#fffaf0", border: "2px solid #8a7a60", borderRadius: 4 }}>
              {ini + i}
              {t > 0 && <svg width={tam} height={tam} style={{ position: "absolute", left: -2, top: -2 }}><path d={`M6,6 L${6 + (tam - 12) * Math.min(1, t * 2)},${6 + (tam - 12) * Math.min(1, t * 2)}`} stroke={color} strokeWidth={6} strokeLinecap="round" />{t > 0.5 && <path d={`M${tam - 6},6 L${tam - 6 - (tam - 12) * (t - 0.5) * 2},${6 + (tam - 12) * (t - 0.5) * 2}`} stroke={color} strokeWidth={6} strokeLinecap="round" />}</svg>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- escarabajo que MASTICA (mandíbulas que abren y cierran) + migajas ----------
export const EscarabajoM: React.FC<{ x: number; y: number; s?: number; rot?: number; f: number; seed?: number }> = ({ x, y, s = 1, rot = 0, f, seed = 0 }) => {
  const ab = 6 + 10 * (0.5 + 0.5 * Math.sin(f * 0.9 + seed * 2));
  return (
    <g>
      <Escarabajo x={x} y={y} s={s} rot={rot} f={f} seed={seed} />
      <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
        {[-1, 1].map((k) => <path key={k} d={`M${k * 5},-46 Q${k * (ab + 6)},-58 ${k * (ab - 2)},-66`} stroke="#1c1416" strokeWidth={5} fill="none" strokeLinecap="round" />)}
        {[0, 1, 2].map((i) => { const t = ((f / 14 + i / 3 + seed * 0.13) % 1); return <circle key={i} cx={(i - 1) * 9 + Math.sin(t * 6) * 6} cy={-66 - t * 24} r={3.5 * (1 - t)} fill="#7cc45a" opacity={1 - t} />; })}
      </g>
    </g>
  );
};

// ---------- mano de Marcus con brocha pintando en (x,y): manga verde que entra desde la derecha ----------
export const ManoBrocha: React.FC<{ x: number; y: number; f: number; color?: string; o?: number; manga?: string; ox?: number; oy?: number }> = ({ x, y, f, color = "#2a1c18", o = 1, manga = "#3f7a3a", ox = 190, oy = 250 }) => {
  const sx = Math.sin(f / 2.6) * 10, sy = Math.cos(f / 3.4) * 7;
  const px = x + sx, py = y + sy;
  return (
    <g opacity={o}>
      <path d={`M${px + ox},${py + oy} Q${px + ox * 0.63},${py + oy * 0.52} ${px + 34},${py + 24}`} stroke={manga} strokeWidth={40} fill="none" strokeLinecap="round" />
      <path d={`M${px + ox},${py + oy} Q${px + ox * 0.63},${py + oy * 0.52} ${px + 34},${py + 24}`} stroke="#00000033" strokeWidth={6} fill="none" strokeDasharray="14 12" />
      <circle cx={px + 30} cy={py + 20} r={25} fill="#3a2a24" />
      <g transform={`translate(${px},${py}) rotate(-35)`}><rect x={-4} y={-8} width={8} height={70} rx={3} fill="#c9a36a" /><rect x={-11} y={-28} width={22} height={24} rx={3} fill="#9aa0a8" /><rect x={-11} y={-44} width={22} height={18} rx={3} fill={color} /></g>
    </g>
  );
};

// ---------- muro de piedras que crece (k 0..1) ----------
export const Muro: React.FC<{ x: number; y: number; k: number; w?: number; filas?: number }> = ({ x, y, k, w = 260, filas = 4 }) => {
  const por = Math.round(w / 52);
  const total = por * filas;
  const n = Math.floor(k * total);
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const r = Math.floor(i / por), c = i % por;
        const cai = i === n - 1 ? 1 - interpolate(k * total - n, [0, 1], [0, 1], cl) : 0;
        return <rect key={i} x={x + c * 52 + (r % 2) * 26} y={y - (r + 1) * 30 - cai * 40} width={50} height={28} rx={8} fill={["#8a8580", "#9a948c", "#7a756f"][(i * 7) % 3]} stroke="#4a4642" strokeWidth={2} />;
      })}
    </g>
  );
};

// ---------- planta que se marchita: k 0 (sana) … 1 (seca, caída) ----------
export const PlantaSeca: React.FC<{ x: number; y: number; s?: number; k: number; f: number }> = ({ x, y, s = 1, k, f }) => {
  const verde = k < 0.5 ? "#5aa848" : "#9a8a3a";
  const marron = "#7a5a32";
  const col = k > 0.75 ? marron : verde;
  const doblar = 20 + 90 * k;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cy={4} rx={60} ry={10} fill="#3a2418" />
      <path d={`M0,0 Q${doblar * 0.2},-80 ${doblar},-${150 - 70 * k}`} stroke={col} strokeWidth={9} fill="none" strokeLinecap="round" />
      {[0.3, 0.5, 0.7, 0.9].map((t, i) => {
        const px = doblar * t * 0.9, py = -(150 - 70 * k) * t;
        const ang = (i % 2 ? 1 : -1) * (30 + 60 * k) + 90 * k;
        return <ellipse key={i} cx={px + (i % 2 ? 22 : -22)} cy={py + 30 * k} rx={26} ry={10} fill={col} transform={`rotate(${ang} ${px} ${py})`} />;
      })}
    </g>
  );
};

// ---------- moscas que rondan (x,y centro, radio r) ----------
export const Moscas: React.FC<{ x: number; y: number; r: number; n: number; f: number; o?: number }> = ({ x, y, r, n, f, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const a = f / (7 + (i % 4)) + i * 2.1;
      const px = x + Math.cos(a) * r * (0.6 + 0.4 * Math.sin(f / 23 + i)), py = y + Math.sin(a * 1.3) * r * 0.55;
      const al = Math.sin(f * 1.6 + i) * 6;
      return <g key={i} transform={`translate(${px},${py})`}><ellipse cx={-6} cy={-4} rx={9} ry={4 + al * 0.3} fill="#dfe8f0" opacity={0.7} /><ellipse cx={6} cy={-4} rx={9} ry={4 - al * 0.3} fill="#dfe8f0" opacity={0.7} /><ellipse rx={7} ry={5} fill="#15131a" /></g>;
    })}
  </g>
);

// ---------- gotas que caen entre y0 e y1 con salpicadura ----------
export const Gotas: React.FC<{ x0: number; x1: number; y0: number; y1: number; n: number; f: number; k?: number; tam?: number; color?: string }> = ({ x0, x1, y0, y1, n, f, k = 1, tam = 1, color = "#7ab8f0" }) => (
  <g opacity={k}>
    {Array.from({ length: n }).map((_, i) => {
      const x = x0 + ((i + 0.5) / n) * (x1 - x0);
      const t = (((f + i * 7) % 22) / 22);
      const y = y0 + (y1 - y0) * t * t;
      return (
        <g key={i}>
          {t < 0.92 && <ellipse cx={x} cy={y} rx={7 * tam} ry={13 * tam} fill={color} />}
          {t > 0.85 && <ellipse cx={x} cy={y1} rx={(t - 0.85) * 220 * tam} ry={(t - 0.85) * 40 * tam} fill="none" stroke={color} strokeWidth={4 * tam} opacity={1 - (t - 0.85) * 6} />}
        </g>
      );
    })}
  </g>
);

// ---------- hojas que caen / confeti (x0..x1, de y0 a y1) ----------
export const Hojitas: React.FC<{ x0: number; x1: number; y0: number; y1: number; n: number; f: number; vel?: number; colores?: string[]; tam?: number }> = ({ x0, x1, y0, y1, n, f, vel = 70, colores = ["#7cc45a", "#e8c860", "#d8782a", "#5aa848"], tam = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const t = ((f / vel + random(`hj${i}`)) % 1);
      const x = x0 + random(`hx${i}`) * (x1 - x0) + Math.sin(f / 14 + i) * 50;
      const y = y0 + (y1 - y0) * t;
      return <ellipse key={i} cx={x} cy={y} rx={16 * tam} ry={7 * tam} fill={colores[i % colores.length]} transform={`rotate(${f * 4 + i * 50} ${x} ${y})`} />;
    })}
  </g>
);

// ---------- estrellitas que titilan (cielo de la granja) ----------
export const Estrellitas: React.FC<{ f: number; n: number; x0: number; x1: number; y0: number; y1: number; tam?: number }> = ({ f, n, x0, x1, y0, y1, tam = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = x0 + random(`ex${i}`) * (x1 - x0), y = y0 + random(`ey${i}`) * (y1 - y0);
      const s = (0.4 + 0.6 * Math.abs(Math.sin(f / (9 + (i % 5) * 3) + i))) * tam;
      return <path key={i} d={`M${x},${y - 16 * s} Q${x},${y} ${x + 16 * s},${y} Q${x},${y} ${x},${y + 16 * s} Q${x},${y} ${x - 16 * s},${y} Q${x},${y} ${x},${y - 16 * s} Z`} fill="#fff6d8" opacity={0.5 + 0.5 * s / tam} />;
    })}
  </g>
);

// ---------- flechas de aire frío que bajan por la ladera + niebla ----------
export const FlechasFrio: React.FC<{ f: number; k: number; piso: number }> = ({ f, k, piso }) => {
  if (k <= 0) return null;
  return (
    <g opacity={k}>
      {Array.from({ length: 9 }).map((_, i) => {
        const u = ((f / 90 + i / 9) % 1);
        const x = 2250 + u * 1700;
        const y = piso - 320 + Math.min(1, u * 1.55) * 290 + (i % 3) * 18;
        const a = Math.min(1, u * 1.55) * 28 + 6;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${a})`} opacity={Math.sin(u * Math.PI)}>
            <path d="M-70,0 L50,0" stroke="#bfe4ff" strokeWidth={14} strokeLinecap="round" />
            <path d="M20,-34 L66,0 L20,34" stroke="#bfe4ff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const u = ((f / 160 + i / 14) % 1);
        return <Halo key={i} x={2300 + u * 2800 + Math.sin(f / 30 + i) * 40} y={piso - 70 + (i % 4) * 22} r={150 + (i % 3) * 60} color="#d6eaff" fuerza={0.28 * k} />;
      })}
    </g>
  );
};

// ---------- cristales de hielo: estrellas de seis puntas que brotan ----------
export const Cristal: React.FC<{ x: number; y: number; s: number; rot?: number; o?: number }> = ({ x, y, s, rot = 0, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o} stroke="#e8f6ff" strokeWidth={5} strokeLinecap="round" fill="none">
    {[0, 60, 120].map((a) => <g key={a} transform={`rotate(${a})`}><path d="M-40,0 L40,0" /><path d="M24,0 L36,-12 M24,0 L36,12 M-24,0 L-36,-12 M-24,0 L-36,12" /></g>)}
  </g>
);

// ---------- ventana de granero con siluetas (June junto a Lily) ----------
export const SiluetasVentana: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => {
  const resp = Math.sin(f / 16) * 2;
  return (
    <g>
      <clipPath id="vtn"><rect x={x - 80} y={y - 75} width={160} height={150} /></clipPath>
      <g clipPath="url(#vtn)">
        {/* Lily acostada, junto a la cama de heno */}
        <path d={`M${x - 70},${y + 75} L${x - 70},${y + 40 + resp} Q${x - 20},${y + 28 + resp} ${x + 8},${y + 40} L${x + 8},${y + 75} Z`} fill="#2a1c1c" />
        <circle cx={x - 58} cy={y + 34 + resp} r={13} fill="#2a1c1c" />
        {/* June sentada a su lado, inclinada sobre ella, mano en la frente */}
        <path d={`M${x + 20},${y + 75} L${x + 28},${y - 6} Q${x + 48},${y - 22} ${x + 68},${y - 6} L${x + 74},${y + 75} Z`} fill="#241616" />
        <circle cx={x + 40} cy={y - 24} r={16} fill="#241616" />
        <path d={`M${x + 34},${y - 4} Q${x + 4},${y + 6} ${x - 40},${y + 20 + resp}`} stroke="#241616" strokeWidth={9} strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
};

// ---------- polvo / puff en un punto del mundo ----------
export const Polvo: React.FC<{ x: number; y: number; f: number; f0: number; s?: number; color?: string }> = ({ x, y, f, f0, s = 1, color = "#c9b48a" }) => {
  const t = (f - f0) / 20;
  if (t < 0 || t > 1) return null;
  return <g opacity={1 - t}>{[-1, 0, 1].map((k) => <circle key={k} cx={x + k * 34 * s * (0.4 + t)} cy={y - t * 26 * s - Math.abs(k) * 6} r={(14 + t * 26) * s} fill={color} />)}</g>;
};

// ---------- cara de papa que sufre (calor: sudor y ceño · frío: tiritando con dientes) ----------
export const CaraPapa: React.FC<{ x: number; y: number; s: number; rot?: number; tipo: "calor" | "frio"; f: number; k?: number }> = ({ x, y, s, rot = 0, tipo, f, k = 1 }) => {
  const tir = tipo === "frio" ? Math.sin(f * 2.2) * 3 * k : 0;
  return (
    <g transform={`translate(${x + tir * s * 0.5},${y}) rotate(${rot}) scale(${s})`} opacity={Math.min(1, k * 1.5)}>
      {[-9, 9].map((ex) => <g key={ex}><ellipse cx={ex} cy={-4} rx={5} ry={tipo === "frio" ? 6.5 : 5} fill="#fff" /><circle cx={ex + (tipo === "frio" ? 0 : ex > 0 ? -1 : 1)} cy={-3} r={2.4} fill="#1c1416" /></g>)}
      {tipo === "calor"
        ? <><path d="M-16,-13 L-4,-9 M16,-13 L4,-9" stroke="#1c1416" strokeWidth={2.4} strokeLinecap="round" /><path d="M-7,10 Q0,4 7,10" stroke="#1c1416" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((i) => { const t = ((f / 18 + i / 3) % 1); return <path key={i} d={`M${-20 + i * 20},${-14 + t * 30} q-3,5 0,8 q3,-3 0,-8 Z`} fill="#8fd0ff" opacity={1 - t} transform={`scale(1.3)`} />; })}</>
        : <><path d="M-15,-12 L-5,-14 M15,-12 L5,-14" stroke="#1c1416" strokeWidth={2.4} strokeLinecap="round" /><path d="M-8,9 L-4,6 L0,10 L4,6 L8,9" stroke="#1c1416" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx={-18} cy={2} r={3} fill="#bfe4ff" /><circle cx={19} cy={4} r={2.4} fill="#bfe4ff" /></>}
    </g>
  );
};

// ---------- termómetro de fiebre: tubo con grados 98-104, mercurio que sube ----------
export const TermoFiebre: React.FC<{ x: number; y: number; temp: number; f: number; s?: number }> = ({ x, y, temp, f, s = 1 }) => {
  const H = 420, lo = 97, hi = 104;
  const nivel = ((Math.max(lo, Math.min(hi, temp)) - lo) / (hi - lo)) * H;
  const tem = Math.sin(f * 1.9) * 1.5;
  return (
    <g transform={`translate(${x + tem},${y}) scale(${s})`}>
      <rect x={-34} y={-H - 40} width={68} height={H + 100} rx={34} fill="#efe6d2" stroke="#6a5240" strokeWidth={5} />
      {[98, 99, 100, 101, 102, 103, 104].map((t) => { const yy = -((t - lo) / (hi - lo)) * H; return <g key={t}><rect x={14} y={yy - 2} width={t === 100 || t === 102 || t === 104 ? 22 : 12} height={4} fill="#6a5240" /><text x={-18} y={yy + 8} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#fff6e4" stroke="#2a1c18" strokeWidth={5} paintOrder="stroke">{t}</text></g>; })}
      <rect x={-9} y={-H} width={18} height={H} rx={9} fill="#d8d0c0" />
      <rect x={-9} y={-nivel} width={18} height={nivel + 6} rx={7} fill="#d8382c" />
      <circle cx={0} cy={26} r={26} fill="#d8382c" />
    </g>
  );
};

// ---------- mano que saca una papa sana de la tierra: k 0 (enterrada) … 1 (arriba) ----------
export const ManoSacaPapa: React.FC<{ x: number; y: number; k: number; f: number; manga?: string }> = ({ x, y, k, f, manga = "#3f7a3a" }) => {
  const py = y - k * 170;
  const sw = Math.sin(f / 2.2) * 4 * k;
  return (
    <g>
      <path d={`M${x + 60},${py - 650} L${x + 6},${py - 40}`} stroke={manga} strokeWidth={50} strokeLinecap="round" />
      <circle cx={x + sw} cy={py - 22} r={27} fill="#3a2a24" />
      <Papa2 x={x + sw} y={py + 6} />
      {k > 0.7 && <g opacity={(k - 0.7) * 3.3} stroke="#fff6d0" strokeWidth={5} strokeLinecap="round">{[0, 60, 120, 180, 240, 300].map((a) => <path key={a} d={`M${x + Math.cos((a * Math.PI) / 180) * 56},${py + 6 + Math.sin((a * Math.PI) / 180) * 44} L${x + Math.cos((a * Math.PI) / 180) * 84},${py + 6 + Math.sin((a * Math.PI) / 180) * 66}`} />)}</g>}
    </g>
  );
};
const Papa2: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}><ellipse rx={40} ry={28} fill="#c9935a" /><ellipse cx={-8} cy={-8} rx={24} ry={11} fill="#dba96e" opacity={0.7} />{[[-18, 6], [10, -10], [18, 10]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3} fill="#8a5e36" />)}</g>
);

// ---------- brillo (destello) sobre un punto ----------
export const Destello: React.FC<{ x: number; y: number; k: number; r?: number }> = ({ x, y, k, r = 60 }) => (
  <g opacity={k}><Halo x={x} y={y} r={r * 2} color="#fff3b0" fuerza={0.7} />{[0, 90].map((a) => <path key={a} d={`M${x - r},${y} L${x + r},${y}`} stroke="#fff8d0" strokeWidth={6} strokeLinecap="round" transform={`rotate(${a} ${x} ${y})`} />)}</g>
);

// ---------- carretilla con papas (x,y = piso bajo la rueda; dir hacia donde avanza) ----------
export const Carretilla: React.FC<{ x: number; y: number; dir?: 1 | -1; rueda?: number; papas?: number }> = ({ x, y, dir = 1, rueda = 0, papas = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${dir},1)`}>
    <path d="M-30,-95 L120,-95 L100,-40 L-10,-40 Z" fill="#c0352c" stroke="#7a2018" strokeWidth={4} />
    {papas > 0 && Array.from({ length: 9 }).map((_, i) => <g key={i} transform={`translate(${-4 + (i % 5) * 26},${-98 - Math.floor(i / 5) * 14}) scale(0.5)`}><ellipse rx={40} ry={28} fill="#c9935a" /><ellipse cx={-8} cy={-8} rx={24} ry={11} fill="#dba96e" opacity={0.7} /></g>)}
    <path d="M-30,-95 L-130,-70 M-30,-70 L-130,-70" stroke="#8a6a42" strokeWidth={9} strokeLinecap="round" />
    <path d="M-10,-40 L40,-10" stroke="#5a5a62" strokeWidth={7} />
    <g transform={`translate(52,-4) rotate(${rueda})`}><circle r={26} fill="#26262a" /><circle r={10} fill="#8a9297" /><line x1={-24} y1={0} x2={24} y2={0} stroke="#555" strokeWidth={4} /></g>
  </g>
);

// ---------- mano de Ben que sube desde abajo, pellizca el borde de la hoja y la voltea (k 0..1 = volteo) ----------
export const ManoPinza: React.FC<{ x: number; y: number; k: number; manga?: string }> = ({ x, y, k, manga = "#e0b030" }) => (
  <g opacity={Math.min(1, k * 8 + (k > 0 ? 0.2 : 0))}>
    <path d={`M${x + 330},${1250} Q${x + 200},${(y + 1250) / 2 + 40} ${x + 40},${y + 36}`} stroke={manga} strokeWidth={96} fill="none" strokeLinecap="round" />
    <path d={`M${x + 330},${1250} Q${x + 200},${(y + 1250) / 2 + 40} ${x + 40},${y + 36}`} stroke="#00000022" strokeWidth={10} fill="none" strokeDasharray="22 16" />
    <ellipse cx={x + 10} cy={y + 26} rx={52} ry={42} fill="#3a2a24" />
    {[-30, -8, 14, 36].map((dy, i) => <rect key={i} x={x - 66} y={y + dy - 8 + 12} width={64} height={17} rx={8} fill="#3a2a24" />)}
  </g>
);

// ---------- larvas en el envés de la hoja (coordenadas locales de la hoja) ----------
export const Larvas: React.FC<{ n?: number; k?: number }> = ({ n = 14, k = 1 }) => (
  <g opacity={k}>
    <path d="M-470,0 Q-300,-300 0,-280 Q320,-260 470,0 Q320,260 0,280 Q-300,300 -470,0 Z" fill="#b8d890" />
    <path d="M-470,0 L470,0" stroke="#7aa05a" strokeWidth={12} />
    {Array.from({ length: n }).map((_, i) => {
      const x = -330 + random(`lx${i}`) * 660, y = -190 + random(`ly${i}`) * 380, r = random(`lr${i}`) * 50 - 25;
      return <g key={i} transform={`translate(${x},${y}) rotate(${r}) scale(${0.8 + random(`ls${i}`) * 0.6})`}>
        {[0, 1, 2, 3].map((j) => <circle key={j} cx={j * 22 - 33} cy={0} r={20 - j * 1.5} fill="#e87a3a" stroke="#a84a1c" strokeWidth={3} />)}
        <circle cx={-38} cy={-4} r={4} fill="#1c1416" />
        {[0, 1, 2].map((j) => <circle key={j} cx={j * 22 - 22} cy={-8} r={3.4} fill="#7a2a14" />)}
      </g>;
    })}
  </g>
);
