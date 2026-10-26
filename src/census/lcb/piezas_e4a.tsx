// Piezas nuevas para las escenas 0:00-3:25 del Ep.4 (lc04a): contadores y barras de HUD, polvo, aves, ranas, marcas de
// tilde/cruz, mapa con línea que viaja, surco con plantitas, fardos, termómetro de energía. Todo vector plano en código.
import React from "react";
import { interpolate, random } from "remotion";
import { useF } from "../../anikit/camara";
import { Halo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";

export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], cl);
const CONTORNO = (tam: number) => ({ WebkitTextStroke: `${Math.max(3, tam * 0.07)}px rgba(14,10,18,0.92)`, paintOrder: "stroke fill" as const });

// ---------- número grande que rueda (HUD, coordenadas de pantalla) ----------
export const Num: React.FC<{ x: number; y: number; desde: number; hasta?: number; f0: number; f1: number; v0: number; v1: number; pre?: string; suf?: string; color?: string; tam?: number; rotulo?: string; dec?: number; centro?: boolean; coma?: boolean; cubica?: boolean }> = ({ x, y, desde, hasta, f0, f1, v0, v1, pre = "", suf = "", color = "#ffcf6e", tam = 84, rotulo, dec = 0, centro = true, coma = true, cubica }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const k = interpolate(f, [f0, f1], [0, 1], cl);
  const v = v0 + (v1 - v0) * (1 - Math.pow(1 - k, cubica ? 3 : 2)); // cubica = misma curva que el HUD (valorEn)
  const s = 1 + 0.2 * Math.max(0, 1 - (f - desde) / 9);
  const o = (hasta !== undefined ? interpolate(f, [hasta - 8, hasta], [1, 0], cl) : 1) * ap(f, desde, 4);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `${centro ? "translateX(-50%) " : ""}scale(${s})`, transformOrigin: "50% 100%", opacity: o, textAlign: centro ? "center" : "left", fontFamily: F_HUD, fontWeight: 600, whiteSpace: "pre", color, lineHeight: 1.05, ...CONTORNO(tam), textShadow: "0 5px 0 rgba(10,8,14,0.85), 0 0 22px rgba(0,0,0,0.55)" }}>
      <div style={{ fontSize: tam, fontVariantNumeric: "tabular-nums" }}>{pre}{coma ? v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : String(Math.round(v))}{suf}</div>
      {rotulo && <div style={{ fontSize: tam * 0.4, color: "#f6ecd2", letterSpacing: 3, ...CONTORNO(tam * 0.4) }}>{rotulo}</div>}
    </div>
  );
};

// ---------- barra de progreso (HUD) con rótulo ----------
export const BarraHud: React.FC<{ x: number; y: number; w?: number; k: number; desde: number; hasta?: number; color?: string; rotulo?: string; h?: number; vacia?: boolean }> = ({ x, y, w = 560, k, desde, hasta, color = "#7cd36a", rotulo, h = 34 }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const o = ap(f, desde, 8) * (hasta !== undefined ? interpolate(f, [hasta - 8, hasta], [1, 0], cl) : 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, transform: `translateX(-50%) translateY(${(1 - ap(f, desde, 8)) * 14}px)` }}>
      {rotulo && <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: "#f6ecd2", textAlign: "center", marginBottom: 6, ...CONTORNO(34) }}>{rotulo}</div>}
      <div style={{ height: h, borderRadius: h, background: "rgba(14,10,18,0.78)", border: "4px solid #f6ecd2", overflow: "hidden", boxSizing: "border-box" }}>
        <div style={{ width: `${Math.max(0, Math.min(1, k)) * 100}%`, height: "100%", background: color, borderRadius: h }} />
      </div>
    </div>
  );
};

// ---------- polvo / humo que sube (mundo): n bocanadas en bucle ----------
export const Nube: React.FC<{ x: number; y: number; f: number; n?: number; ancho?: number; alto?: number; deriva?: number; color?: string; r0?: number; opac?: number; seed?: number }> = ({ x, y, f, n = 8, ancho = 80, alto = 120, deriva = 60, color = "#d8c6a0", r0 = 10, opac = 0.65, seed = 0 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = (f / 38 + i / n + random(`nb${seed}${i}`) * 0.2) % 1;
      return <circle key={i} cx={x + (random(`nx${seed}${i}`) - 0.5) * ancho + ph * deriva} cy={y - ph * alto} r={r0 + ph * r0 * 2.6} fill={color} opacity={(1 - ph) * opac * Math.min(1, ph * 6)} />;
    })}
  </g>
);

// ---------- aves en V que cruzan (mundo) ----------
export const Aves: React.FC<{ f: number; x0: number; x1: number; y: number; n?: number; dur?: number; color?: string }> = ({ f, x0, x1, y, n = 5, dur = 160, color = "#2a2230" }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const u = ((f / dur) + i * 0.07) % 1;
      const cx = x0 + (x1 - x0) * u + (i % 2 ? 40 : 0) * (i / n), cy = y + Math.sin(u * 6 + i) * 24 + i * 22;
      const a = Math.sin(f / 3 + i * 1.7) * 12;
      return <path key={i} d={`M${cx - 26},${cy - 6 + a} Q${cx - 12},${cy - 14 - a} ${cx},${cy} Q${cx + 12},${cy - 14 - a} ${cx + 26},${cy - 6 + a}`} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

// ---------- sombras de pájaros / ranas que saltan (mundo) ----------
export const Ranas: React.FC<{ f: number; xs: number[]; y: number; color?: string; s?: number }> = ({ f, xs, y, color = "#4f9a3c", s = 1 }) => (
  <g>
    {xs.map((x, i) => {
      const ph = ((f + i * 11) % 34) / 34;
      const salto = ph < 0.6 ? Math.sin((ph / 0.6) * Math.PI) * 60 : 0;
      const dx = Math.floor((f + i * 11) / 34) % 2 ? 40 : 0;
      return <g key={i} transform={`translate(${x + dx * s + (ph < 0.6 ? ph * 70 : 42) * s},${y - salto * s}) scale(${s})`}>
        <ellipse rx={22} ry={14} fill={color} /><circle cx={12} cy={-12} r={7} fill="#f6ecd2" /><circle cx={13} cy={-12} r={3} fill="#1c1416" />
        <ellipse cx={-14} cy={10} rx={14} ry={5} fill={color} /><ellipse cx={-3} cy={13} rx={6} ry={4} fill="#3f7c2e" />
        {salto > 3 && <ellipse cx={0} cy={salto + 14} rx={18 - salto / 8} ry={4} fill="#1c1416" opacity={0.25} />}
      </g>;
    })}
  </g>
);

// ---------- gotas que caen de a una en un charco (mundo) ----------
export const GotasCharco: React.FC<{ f: number; x: number; y: number; n?: number }> = ({ f, x, y, n = 3 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = ((f + i * 17) % 40) / 40;
      return ph < 0.4
        ? <ellipse key={i} cx={x + i * 90 - 90} cy={y - 220 + ph * 550} rx={5} ry={10} fill="#bfe0ff" />
        : <ellipse key={i} cx={x + i * 90 - 90} cy={y} rx={(ph - 0.4) * 130} ry={(ph - 0.4) * 28} fill="none" stroke="#e6f4ff" strokeWidth={3} opacity={1 - (ph - 0.4) / 0.6} />;
    })}
  </g>
);

// ---------- tilde verde / cruz roja que se dibujan (mundo) ----------
export const Marca: React.FC<{ x: number; y: number; k: number; tilde?: boolean; s?: number }> = ({ x, y, k, tilde, s = 1 }) => {
  if (k <= 0) return null;
  const pop = 1 + 0.35 * Math.max(0, 1 - k * 2.2);
  return (
    <g transform={`translate(${x},${y}) scale(${s * pop})`}>
      <circle r={86} fill="#f6efe0" opacity={0.92 * Math.min(1, k * 3)} stroke="#1c1416" strokeWidth={6} />
      {tilde
        ? <path d={`M-48,4 L-12,42 L50,-40`} stroke="#2f9a3c" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={200} strokeDashoffset={200 * (1 - k)} />
        : <path d={`M-42,-42 L42,42 M42,-42 L-42,42`} stroke="#d8382c" strokeWidth={24} strokeLinecap="round" fill="none" strokeDasharray={240} strokeDashoffset={240 * (1 - k)} />}
    </g>
  );
};

// ---------- mapa 20 MILES (pantalla): ruta punteada con un autito que viaja ----------
export const MapaMillas: React.FC<{ x: number; y: number; k: number; desde: number; puntos?: number[] }> = ({ x, y, k, desde, puntos }) => {
  const f = useF();
  if (f < desde) return null;
  const o = ap(f, desde, 8);
  const P: [number, number][] = [[0, 150], [150, 60], [300, 130], [440, 40]];
  const path = `M${P[0]} Q${P[1]} ${P[2]} T${P[3]}`;
  const px = P[0][0] + (P[3][0] - P[0][0]) * k, py = 150 - Math.sin(k * Math.PI * 1.5) * 80 + k * -70;
  return (
    <svg width={520} height={220} style={{ position: "absolute", left: x, top: y, opacity: o, overflow: "visible" }}>
      <rect x={-20} y={-20} width={560} height={260} rx={22} fill="rgba(14,10,18,0.72)" stroke="#f6ecd2" strokeWidth={4} />
      <path d={path} stroke="#f6ecd2" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" fill="none" transform="translate(30,10)" />
      <circle cx={30} cy={160} r={16} fill="#7cd36a" stroke="#1c1416" strokeWidth={4} />
      <circle cx={470} cy={50} r={16} fill="#e23a2e" stroke="#1c1416" strokeWidth={4} />
      {puntos && [[0.34, "ORGANIC"], [0.62, "GARDEN"], [0.86, "PROCTOR"]].map(([u, t], i) => {
        const ux = 30 + 440 * (u as number), uy = 160 - Math.sin((u as number) * Math.PI * 1.5) * 80 + (u as number) * -70 + 10, kk = ap(f, puntos[i], 8);
        return <g key={i} transform={`translate(${ux},${uy})`}><circle r={15} fill="#f6efe0" stroke="#1c1416" strokeWidth={4} />{kk > 0 && <path d="M-7,0 L-2,6 L8,-7" stroke="#2f9a3c" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - kk)} />}<text y={34} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={18} fill="#f6ecd2">{t}</text></g>;
      })}
      <g transform={`translate(${30 + px},${py + 10})`}><rect x={-22} y={-14} width={44} height={22} rx={6} fill="#ffcf6e" stroke="#1c1416" strokeWidth={4} /><circle cx={-12} cy={10} r={7} fill="#1c1416" /><circle cx={12} cy={10} r={7} fill="#1c1416" /></g>
    </svg>
  );
};

// ---------- surco en corte con plantitas que brotan (mundo) ----------
export const Plantitas: React.FC<{ x0: number; ancho: number; y: number; n: number; f: number; desde: number; s?: number; cada?: number }> = ({ x0, ancho, y, n, f, desde, s = 1, cada = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const k = ap(f, desde + i * 3, 12);
      if (k <= 0 || i % cada) return null;
      const x = x0 + (i + 0.5) * (ancho / n), h = (40 + random(`pl${i}${x0}`) * 26) * k * s;
      return <g key={i} transform={`translate(${x},${y})`}>
        <path d={`M0,0 L0,${-h}`} stroke="#1f5a14" strokeWidth={7 * s} strokeLinecap="round" />
        <ellipse cx={-10 * s * k} cy={-h} rx={14 * s * k} ry={7 * s * k} fill="#b4f05a" stroke="#1f5a14" strokeWidth={2.5 * s} transform={`rotate(-30 ${-10 * s * k} ${-h})`} />
        <ellipse cx={10 * s * k} cy={-h + 6} rx={14 * s * k} ry={7 * s * k} fill="#c8f670" stroke="#1f5a14" strokeWidth={2.5 * s} transform={`rotate(30 ${10 * s * k} ${-h + 6})`} />
      </g>;
    })}
  </g>
);

// ---------- pila de fardos de heno que crece (mundo): k 0..1 ----------
export const PilaFardos: React.FC<{ x: number; y: number; n: number; t?: number }> = ({ x, y, n, t = 99 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const fila = i < 3 ? 0 : i < 5 ? 1 : 2, col = fila === 0 ? i : fila === 1 ? i - 3 + 0.5 : 1;
      const dy = i === n - 1 && t < 24 ? -70 * Math.exp(-t / 5) * Math.abs(Math.cos(t * 0.42)) : 0;
      return <g key={i} transform={`translate(${x + col * 124},${y - fila * 62 + dy})`}><rect width={118} height={58} rx={10} fill="#e2c060" stroke="#a78428" strokeWidth={4} /><path d="M20,0 L20,58 M60,0 L60,58 M98,0 L98,58" stroke="#a78428" strokeWidth={3} /></g>;
    })}
  </g>
);

// ---------- termómetro de energía (pantalla): 100 -> 0 ----------
export const Gotero: React.FC<{ x: number; y: number; k: number; desde: number; rotulo: string; color?: string }> = ({ x, y, k, desde, rotulo, color = "#f2b81e" }) => {
  const f = useF();
  if (f < desde) return null;
  const o = ap(f, desde, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translateX(-50%)", textAlign: "center", fontFamily: F_HUD, fontWeight: 600 }}>
      <div style={{ width: 54, height: 330, margin: "0 auto", borderRadius: 30, background: "rgba(14,10,18,0.78)", border: "4px solid #f6ecd2", position: "relative", overflow: "hidden", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${Math.max(0, Math.min(1, k)) * 100}%`, background: color }} />
      </div>
      <div style={{ fontSize: 34, color: "#f6ecd2", marginTop: 8, letterSpacing: 2, ...CONTORNO(34) }}>{rotulo}</div>
    </div>
  );
};

// ---------- cuenta de hojas de calendario / marca de días: casillas que se llenan (pantalla) ----------
export const Casillas: React.FC<{ x: number; y: number; n: number; llenas: number; desde: number; cols?: number; color?: string; tam?: number }> = ({ x, y, n, llenas, desde, cols = 7, color = "#ffcf6e", tam = 42 }) => {
  const f = useF();
  if (f < desde) return null;
  const o = ap(f, desde, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translateX(-50%)", display: "grid", gridTemplateColumns: `repeat(${cols}, ${tam}px)`, gap: 6, padding: 12, background: "rgba(14,10,18,0.72)", border: "4px solid #f6ecd2", borderRadius: 16 }}>
      {Array.from({ length: n }).map((_, i) => <div key={i} style={{ width: tam, height: tam, borderRadius: 8, background: i < llenas ? color : "rgba(246,236,210,0.15)", transform: i === Math.floor(llenas) - 1 ? "scale(1.18)" : "none" }} />)}
    </div>
  );
};

// ---------- ampolla (círculo inserto con una mano): pantalla ----------
export const InsertoMano: React.FC<{ x: number; y: number; r?: number; desde: number; f: number }> = ({ x, y, r = 130, desde, f }) => {
  if (f < desde) return null;
  const k = ap(f, desde, 8);
  return (
    <svg width={r * 2 + 20} height={r * 2 + 20} style={{ position: "absolute", left: x - r - 10, top: y - r - 10, transform: `scale(${k})`, overflow: "visible" }}>
      <clipPath id={`ins${x}`}><circle cx={r + 10} cy={r + 10} r={r} /></clipPath>
      <circle cx={r + 10} cy={r + 10} r={r} fill="#d8c6a0" stroke="#f6ecd2" strokeWidth={8} />
      <g clipPath={`url(#ins${x})`}>
        <ellipse cx={r + 10} cy={r + 70} rx={r * 0.6} ry={r * 0.78} fill="#e8b890" stroke="#5a3a28" strokeWidth={4} />
        {[-42, -14, 14, 42].map((dx, i) => <rect key={i} x={r + 10 + dx - 14} y={r - 70} width={28} height={80} rx={14} fill="#e8b890" stroke="#5a3a28" strokeWidth={4} />)}
        {[[-30, 10], [18, 4], [40, 30]].map(([dx, dy], i) => { const p = 1 + 0.12 * Math.sin(f / 5 + i); return <ellipse key={i} cx={r + 10 + dx} cy={r + 30 + dy} rx={18 * p} ry={14 * p} fill="#f4d6d0" stroke="#c9606a" strokeWidth={4} />; })}
      </g>
    </svg>
  );
};

export const Bruma: React.FC<{ x: number; y: number; r: number; color: string; fuerza?: number }> = ({ x, y, r, color, fuerza = 0.5 }) => <Halo x={x} y={y} r={r} color={color} fuerza={fuerza} />;

// ---------- llamita de gasto diario (mundo) con la etiqueta chica y opcional ----------
export const LlamaQ: React.FC<{ x: number; y: number; f: number; o?: number; lab?: boolean }> = ({ x, y, f, o = 1, lab = true }) => {
  if (o <= 0) return null;
  const t = Math.sin(f / 4 + x) * 4;
  return (
    <g transform={`translate(${x},${y})`} opacity={o}>
      <path d={`M0,0 Q-26,-30 -6,-64 Q${-2 + t},-44 10,-80 Q30,-40 22,-16 Q16,4 0,0 Z`} fill="#ff8a2a" />
      <path d={`M2,-6 Q-10,-24 2,-44 Q${8 + t * 0.5},-30 14,-40 Q20,-18 2,-6 Z`} fill="#ffd36a" />
      {lab && <text x={8} y={32} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={23} fill="#ffcf6e" stroke="#1c1416" strokeWidth={5} paintOrder="stroke">2,000/day</text>}
    </g>
  );
};

// ---------- rótulo estático en pantalla: entra COMPLETO en 6 cuadros, con pastilla opcional ----------
export const Cartel: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string; pastilla?: boolean; rebote?: number }> = ({ texto, x, y, desde, hasta, tam = 64, color = "#ffcf6e", pastilla = true, rebote = 0 }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const k = ap(f, desde, 6), o = k * (hasta !== undefined ? interpolate(f, [hasta - 8, hasta], [1, 0], cl) : 1);
  const sc = (0.9 + 0.1 * k) * (1 + rebote * Math.abs(Math.sin(f / 9)));
  const w = Math.max(...texto.split("\n").map((l) => l.length)) * tam * 0.6 + 60;
  const nl = texto.split("\n").length;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", opacity: o, transform: `scale(${sc})`, transformOrigin: "50% 50%" }}>
      {pastilla && <div style={{ position: "absolute", left: 0, top: -6, width: w, height: tam * 1.25 * nl, borderRadius: 30, background: "rgba(14,10,18,0.78)" }} />}
      <div style={{ position: "relative", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, lineHeight: 1.1, whiteSpace: "pre", color, letterSpacing: tam * 0.02, ...CONTORNO(tam), textShadow: "0 4px 0 rgba(10,8,14,0.85)" }}>{texto}</div>
    </div>
  );
};

// ---------- mano dibujada con dedos (mundo), sale de una manga que baja: rot en grados ----------
export const ManoDedos: React.FC<{ x: number; y: number; rot?: number; s?: number; manga?: string }> = ({ x, y, rot = 0, s = 1, manga = "#7a4a8a" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-48} y={40} width={96} height={400} rx={30} fill={manga} stroke="#1c1416" strokeWidth={5} />
    <rect x={-44} y={34} width={88} height={30} rx={12} fill="#f6efe0" stroke="#1c1416" strokeWidth={4} />
    <ellipse cx={0} cy={0} rx={52} ry={46} fill="#e8c4a0" stroke="#1c1416" strokeWidth={5} />
    {[-33, -11, 11, 33].map((dx, i) => <rect key={i} x={dx - 9} y={-84 + Math.abs(dx) * 0.25} width={18} height={62} rx={9} fill="#e8c4a0" stroke="#1c1416" strokeWidth={4} />)}
    <rect x={-80} y={-26} width={22} height={54} rx={11} fill="#e8c4a0" stroke="#1c1416" strokeWidth={4} transform="rotate(-32 -60 10)" />
  </g>
);

// ---------- cuchillo y mazo (en la mano de un personaje) ----------
export const Cuchillo: React.FC = () => (
  <g>
    <rect x={-6} y={-60} width={12} height={70} rx={5} fill="#3a2a22" />
    <path d="M-7,10 L7,10 L9,110 L-7,92 Z" fill="#d4dae2" stroke="#6a727c" strokeWidth={3} />
  </g>
);
export const Mazo: React.FC = () => (
  <g>
    <rect x={-6} y={-160} width={12} height={170} rx={5} fill="#8a6a42" />
    <rect x={-42} y={-206} width={84} height={54} rx={10} fill="#6a6a72" stroke="#1c1416" strokeWidth={4} />
  </g>
);

// ---------- bocanada de aire que sopla (mundo) ----------
export const Soplo: React.FC<{ x: number; y: number; f: number; dir?: 1 | -1 }> = ({ x, y, f, dir = 1 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = ((f + i * 9) % 27) / 27;
      return <circle key={i} cx={x + dir * ph * 90} cy={y - ph * 40 + i * 6} r={8 + ph * 22} fill="#f6f2ea" opacity={(1 - ph) * 0.55} />;
    })}
  </g>
);

// ---------- lupa grande en pantalla: círculo con una papa y sus ojos que brotan ----------
export const LupaGrande: React.FC<{ x: number; y: number; r?: number; desde: number; Papa: React.ComponentType<any>; brotes: number }> = ({ x, y, r = 190, desde, Papa, brotes }) => {
  const f = useF();
  if (f < desde) return null;
  const k = ap(f, desde, 10);
  return (
    <svg width={r * 2 + 120} height={r * 2 + 240} style={{ position: "absolute", left: x - r - 60, top: y - r - 60, transform: `scale(${k})`, overflow: "visible" }}>
      <line x1={r + 60 + r * 0.7} y1={r + 60 + r * 0.7} x2={r + 60 + r * 1.55} y2={r + 60 + r * 1.55} stroke="#5a4a3a" strokeWidth={34} strokeLinecap="round" />
      <circle cx={r + 60} cy={r + 60} r={r} fill="#e8d4b0" stroke="#5a4a3a" strokeWidth={22} />
      <g transform={`translate(${r + 60},${r + 70})`}><Papa x={0} y={0} s={10} rot={-8} brotes={brotes} /></g>
    </svg>
  );
};

// ---------- mapita de Hermantown (pantalla) con el pin que tiembla en rojo y un rótulo debajo ----------
export const MapaPin: React.FC<{ x: number; y: number; desde: number; rotulo: string; w?: number }> = ({ x, y, desde, rotulo, w = 400 }) => {
  const f = useF();
  if (f < desde) return null;
  const k = ap(f, desde, 8), h = w * 0.55;
  const tb = f - desde > 10 ? Math.sin(f * 1.9) * 5 : 0;
  const late = 0.5 + 0.5 * Math.sin(f / 3);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, opacity: k, transform: `translateY(${(1 - k) * 16}px)` }}>
      <svg width={w} height={h} style={{ overflow: "visible" }}>
        <rect width={w} height={h} rx={20} fill="#e9dcb8" stroke="#f6ecd2" strokeWidth={6} />
        <path d={`M${w * 0.62},0 Q${w * 0.7},${h * 0.35} ${w},${h * 0.42} L${w},0 Z`} fill="#7fb0d8" />
        <text x={w * 0.84} y={h * 0.17} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={w * 0.045} fill="#2f5a7a">LAKE SUPERIOR</text>
        <path d={`M0,${h * 0.78} Q${w * 0.3},${h * 0.66} ${w * 0.62},${h * 0.5} T${w},${h * 0.28}`} stroke="#b89a6a" strokeWidth={9} fill="none" />
        <path d={`M${w * 0.2},${h} Q${w * 0.34},${h * 0.6} ${w * 0.36},0`} stroke="#b89a6a" strokeWidth={6} fill="none" />
        <circle cx={w * 0.66} cy={h * 0.47} r={9} fill="#6a4a32" /><text x={w * 0.66} y={h * 0.62} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={w * 0.05} fill="#4a3424">DULUTH</text>
        <g transform={`translate(${w * 0.34 + tb},${h * 0.62})`}>
          <circle r={26 + 14 * late} fill="#e23a2e" opacity={0.25} />
          <path d="M0,0 C-26,-30 -22,-62 0,-62 C22,-62 26,-30 0,0 Z" fill="#e23a2e" stroke="#1c1416" strokeWidth={4} /><circle cy={-42} r={9} fill="#f6efe0" />
        </g>
        <text x={w * 0.34} y={h * 0.86} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={w * 0.058} fill="#1c1416">HERMANTOWN</text>
      </svg>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: w * 0.085, color: "#ffcf6e", letterSpacing: 2, ...CONTORNO(w * 0.085) }}>{rotulo}</div>
    </div>
  );
};
