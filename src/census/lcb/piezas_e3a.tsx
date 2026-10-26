// Piezas nuevas para lc03a (E1-E22): contadores con pop, onomatopeyas, ondas, manos, huellas, vaho, señal, tipeo letra a letra.
// Todo vector en código. HUD = coordenadas de pantalla (1920x1080); "mundo" = dentro de la cámara (medio / frente).
import React from "react";
import { Easing, interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD, valorEn } from "../../anikit/pantalla";
import { osc } from "../../anikit/sets/comun";
import { Hora, LUCES } from "../mundo/hora";

const cl = (f: number, a: number, b: number, c0 = 0, c1 = 1) => interpolate(f, [a, b], [c0, c1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const CONTORNO = "rgba(14,10,18,0.92)";

// resorte simple de "pop": 0 → 1.25 → 1 en ~10 cuadros
export const popDe = (u: number) => (u < 0 ? 0 : interpolate(u, [0, 3, 7, 12], [0.4, 1.28, 0.94, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }));

// capa HUD (pantalla) para meter piezas SVG fuera de la cámara
export const CapaHud: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>{children}</svg>
);

// ---------- contador grande con rótulo y pop en cada cambio (claves tipo valorEn, cuadros LOCALES) ----------
export const Cuenta: React.FC<{ x: number; y: number; claves: { f: number; v: number; d?: number }[]; rotulo?: string; desde?: number; hasta?: number; tam?: number; color?: string; sufijo?: string; prefijo?: string; colorRot?: string; fondo?: boolean; golpe?: number }> = ({ x, y, claves, rotulo, desde = 0, hasta, tam = 120, color = "#ffcf6e", sufijo = "", prefijo = "", colorRot = "#f4efe4", fondo, golpe }) => {
  const f = useF();
  if (f < desde) return null;
  const { v, pop } = valorEn(claves, f);
  const o = Math.min(cl(f, desde, desde + 8), hasta ? cl(f, hasta - 10, hasta, 1, 0) : 1);
  const e = popDe(f - desde);
  const g = golpe === undefined ? 1 : interpolate(f - golpe, [0, 4, 12], [1, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${(0.85 + 0.15 * e) * (1 + 0.22 * pop) * g})`, transformOrigin: "50% 60%", opacity: o, textAlign: "center", fontFamily: F_HUD, whiteSpace: "nowrap", ...(fondo ? { background: "rgba(16,12,22,0.82)", padding: "10px 34px 14px", borderRadius: 28 } : {}) }}>
      {rotulo && <div style={{ fontWeight: 600, fontSize: tam * 0.34, letterSpacing: tam * 0.05, color: colorRot, WebkitTextStroke: `${Math.max(3, tam * 0.03)}px ${CONTORNO}`, paintOrder: "stroke fill", textShadow: "0 4px 0 rgba(10,8,14,0.8)" }}>{rotulo}</div>}
      <div style={{ fontWeight: 600, fontSize: tam, lineHeight: 1.02, color, fontVariantNumeric: "tabular-nums", WebkitTextStroke: `${Math.max(4, tam * 0.07)}px ${CONTORNO}`, paintOrder: "stroke fill", textShadow: `0 6px 0 rgba(10,8,14,0.85), 0 0 30px ${color}66` }}>{prefijo}{Math.round(v).toLocaleString("en-US")}{sufijo}</div>
    </div>
  );
};

// ---------- texto con pop de entrada (envuelve un Rotulo u otro div absoluto) ----------
export const Pop: React.FC<{ cx: number; cy: number; desde: number; hasta?: number; children: React.ReactNode }> = ({ cx, cy, desde, hasta, children }) => {
  const f = useF();
  if (f < desde) return null;
  const o = hasta ? cl(f, hasta - 10, hasta, 1, 0) : 1;
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${popDe(f - desde)})`, opacity: o, pointerEvents: "none" }}>{children}</div>;
};

// ---------- texto que se escribe letra a letra (layout estable: las letras que faltan están transparentes) ----------
export const Tipeo: React.FC<{ texto: string; x: number; y: number; desde: number; cps?: number; tam?: number; color?: string; hasta?: number }> = ({ texto, x, y, desde, cps = 0.9, tam = 84, color = "#ffcf6e", hasta }) => {
  const f = useF();
  if (f < desde) return null;
  const n = Math.floor((f - desde) * cps);
  const o = hasta ? cl(f, hasta - 10, hasta, 1, 0) : 1;
  let k = 0;
  const lineas = texto.split("\n");
  const total = texto.replace(/\n/g, "").length;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, lineHeight: 1.1, letterSpacing: tam * 0.02, whiteSpace: "pre", opacity: o }}>
      {lineas.map((lin, r) => (
        <div key={r}>{lin.split("").map((ch, i) => {
          const vis = k < n; k++;
          return <span key={i} style={{ color, opacity: vis ? 1 : 0, WebkitTextStroke: `${Math.max(3, tam * 0.07)}px ${CONTORNO}`, paintOrder: "stroke fill", textShadow: `0 5px 0 rgba(10,8,14,0.85), 0 0 26px ${color}55` }}>{ch}</span>;
        })}</div>
      ))}
      {n < total && Math.floor(f / 5) % 2 === 0 && <span style={{ position: "absolute", right: -tam * 0.2, bottom: 0, width: tam * 0.08, height: tam * 0.9, background: color }} />}
    </div>
  );
};

// cuántas palabras ya terminaron de escribirse (para apagar una luz por palabra)
export const palabrasHechas = (texto: string, f: number, desde: number, cps = 0.9) => {
  const n = Math.floor(Math.max(0, f - desde) * cps);
  let c = 0, hechas = 0;
  for (const w of texto.replace(/\n/g, " ").split(" ")) { c += w.length; if (n >= c) hechas++; c += 0; }
  return hechas;
};

// ---------- onomatopeya (SVG): pop + sacudida en cada tiempo; sirve en mundo o dentro de <CapaHud> ----------
export const Onoma: React.FC<{ texto: string; x: number; y: number; tiempos: number[]; dur?: number; tam?: number; color?: string; rot?: number }> = ({ texto, x, y, tiempos, dur = 20, tam = 80, color = "#ffcf6e", rot = -6 }) => {
  const f = useF();
  return (
    <g>
      {tiempos.map((t, i) => {
        const u = f - t;
        if (u < 0 || u >= dur) return null;
        const s = interpolate(u, [0, 3, 6, 10], [0.35, 1.3, 0.95, 1], { extrapolateRight: "clamp" });
        const o = cl(u, dur - 7, dur, 1, 0);
        const sh = Math.sin(u * 2.4) * 5 * Math.exp(-u / 6);
        const dx = ((i % 3) - 1) * tam * 0.35; const dy = -u * 0.8;
        return (
          <g key={i} transform={`translate(${x + dx},${y + dy}) rotate(${rot + sh}) scale(${s})`} opacity={o}>
            <text textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={tam} fill={color} stroke={CONTORNO} strokeWidth={Math.max(5, tam * 0.1)} paintOrder="stroke" letterSpacing={tam * 0.03}>{texto}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- ondas concéntricas (mundo o HUD) ----------
export const Ondas: React.FC<{ x: number; y: number; color?: string; n?: number; rmax?: number; r0?: number; periodo?: number; grosor?: number; fuerza?: number; desde?: number; hasta?: number }> = ({ x, y, color = "#ffcf6e", n = 3, rmax = 220, r0 = 30, periodo = 60, grosor = 5, fuerza = 0.8, desde = 0, hasta }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const u = (((f - desde) + (i * periodo) / n) % periodo) / periodo;
        return <circle key={i} cx={x} cy={y} r={r0 + (rmax - r0) * u} fill="none" stroke={color} strokeWidth={grosor * (1 - u * 0.6)} opacity={fuerza * (1 - u)} />;
      })}
    </g>
  );
};

// ---------- brazo + mano (mundo): manga desde una base lejana hasta la punta (x,y) ----------
export const Mano: React.FC<{ x: number; y: number; bx: number; by: number; manga?: string; piel?: string; s?: number; rot?: number; pinza?: number; lapiz?: boolean; opacidad?: number }> = ({ x, y, bx, by, manga = "#b8423a", piel = "#d8a47c", s = 1, rot = 0, pinza = 0, lapiz = false, opacidad = 1 }) => {
  // (x,y) = la PUNTA (dedos o lápiz); el origen de la mano queda atrás sobre el eje del brazo
  const ang = Math.atan2(y - by, x - bx);
  const off = (lapiz ? 140 : 38) * s;
  const ox = x - Math.cos(ang) * off, oy = y - Math.sin(ang) * off;
  const L = Math.hypot(ox - bx, oy - by);
  const deg = (ang * 180) / Math.PI;
  return (
    <g opacity={opacidad} transform={`translate(${ox},${oy}) rotate(${deg})`}>
      <path d={`M${-L},${-46 * s} L${-70 * s},${-34 * s} L${-70 * s},${34 * s} L${-L},${46 * s} Z`} fill={manga} />
      <rect x={-96 * s} y={-38 * s} width={30 * s} height={76 * s} rx={8 * s} fill="#00000022" />
      <g transform={`rotate(${rot})`}>
        <rect x={-70 * s} y={-26 * s} width={64 * s} height={52 * s} rx={20 * s} fill={piel} />
        <ellipse cx={4 * s} cy={(-12 + pinza * 6) * s} rx={34 * s} ry={11 * s} fill={piel} />
        <ellipse cx={4 * s} cy={(12 - pinza * 6) * s} rx={30 * s} ry={11 * s} fill={mezcla(piel, "#000", 0.08)} />
        <ellipse cx={-10 * s} cy={-26 * s} rx={22 * s} ry={9 * s} fill={mezcla(piel, "#fff", 0.1)} transform={`rotate(-20 ${-10 * s} ${-26 * s})`} />
        {lapiz && <g><rect x={-6 * s} y={-5 * s} width={120 * s} height={10 * s} rx={4 * s} fill="#e8b02a" /><path d={`M${114 * s},${-5 * s} L${140 * s},0 L${114 * s},${5 * s} Z`} fill="#e8c7a0" /><path d={`M${132 * s},${-2 * s} L${140 * s},0 L${132 * s},${2 * s} Z`} fill="#2a2a2e" /></g>}
      </g>
    </g>
  );
};
const mezcla = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};

// perilla de la radio de la Mesa (cubre la del set) con una mano que la gira
export const PerillaMano: React.FC<{ x: number; y: number; ang: number; manoOp?: number; manga?: string; bx?: number; by?: number; ms?: number }> = ({ x, y, ang, manoOp = 1, manga, bx, by, ms = 1 }) => (
  <g>
    <circle cx={x} cy={y} r={50} fill="#2a2a30" />
    <circle cx={x} cy={y} r={46} fill="#3a3a42" /><circle cx={x} cy={y} r={36} fill="#55555e" />
    <g transform={`translate(${x},${y}) rotate(${ang})`}><rect x={-4} y={-36} width={8} height={30} fill="#f6ecd2" /></g>
    <Mano x={x + 6 + Math.sin((ang * Math.PI) / 180) * 18} y={y + 8 - Math.cos((ang * Math.PI) / 180) * 10} bx={bx ?? x + 560} by={by ?? y + 520} s={ms} rot={ang * 0.25} pinza={0.5 + 0.5 * Math.sin((ang * Math.PI) / 90)} opacidad={manoOp} manga={manga} />
  </g>
);

// ---------- vaho / aliento (mundo): bocanadas que suben y se agrandan ----------
export const Vaho: React.FC<{ x: number; y: number; tiempos: number[]; dir?: 1 | -1; dur?: number; tam?: number; color?: string }> = ({ x, y, tiempos, dir = 1, dur = 36, tam = 1, color = "#eef3ff" }) => {
  const f = useF();
  return (
    <g>
      {tiempos.map((t, i) => {
        const u = (f - t) / dur;
        if (u < 0 || u > 1) return null;
        return (
          <g key={i}>{[0, 1, 2].map((k) => {
            const uu = Math.max(0, u - k * 0.1);
            return <circle key={k} cx={x + dir * (30 + uu * 120 + k * 16) * tam} cy={y - uu * 80 * tam - k * 6} r={(14 + uu * 40 + k * 6) * tam} fill={color} opacity={0.55 * (1 - uu)} />;
          })}</g>
        );
      })}
    </g>
  );
};

// ---------- huellas en la nieve (mundo): aparecen cuando el personaje ya pasó por ahí ----------
export const Huellas: React.FC<{ x0: number; x1: number; paso?: number; y: number; xAct: (f: number) => number; color?: string }> = ({ x0, x1, paso = 64, y, xAct, color = "#8f9ab4" }) => {
  const f = useF();
  const xa = xAct(f);
  const dir = x1 > x0 ? 1 : -1;
  const n = Math.floor(Math.abs(x1 - x0) / paso);
  return (
    <g>
      {Array.from({ length: n }).map((_, k) => {
        const xk = x0 + dir * k * paso;
        if (dir > 0 ? xa < xk : xa > xk) return null;
        return <g key={k} transform={`translate(${xk},${y + 14 + (k % 2) * 16})`} opacity={0.6}>
          <ellipse cx={0} cy={0} rx={24} ry={6.5} fill={color} />
          <ellipse cx={dir * 24} cy={0} rx={7} ry={4.5} fill={color} />
        </g>;
      })}
    </g>
  );
};

// ---------- barras de señal (mundo o HUD): `nivel(f)` 0..5 ----------
export const Senal: React.FC<{ x: number; y: number; nivel: number; s?: number; color?: string }> = ({ x, y, nivel, s = 1, color = "#7cff9a" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={i * 26} y={-(i + 1) * 20} width={18} height={(i + 1) * 20} rx={4} fill={nivel > i + 0.2 ? color : "#3a3a42"} stroke={CONTORNO} strokeWidth={3} />
    ))}
  </g>
);

// ---------- lágrimas (mundo) ----------
export const Lagrimas: React.FC<{ x: number; y: number; ancho?: number; desde: number; s?: number }> = ({ x, y, ancho = 28, desde, s = 1 }) => {
  const f = useF();
  if (f < desde) return null;
  return (
    <g>
      {[-1, 1].flatMap((lado) => [0, 1, 2].map((k) => {
        const u = (((f - desde) * 1.6 + k * 17) % 52) / 52;
        return <path key={`${lado}${k}`} transform={`translate(${x + lado * ancho * s + (lado * u * 6)},${y + u * 70 * s}) scale(${s})`} d="M0,-9 Q7,2 0,8 Q-7,2 0,-9 Z" fill="#9bd8ff" opacity={1 - u * 0.8} />;
      }))}
    </g>
  );
};

// ---------- chispas (mundo) ----------
export const Chispas: React.FC<{ x: number; y: number; t0: number; n?: number; dur?: number }> = ({ x, y, t0, n = 10, dur = 18 }) => {
  const f = useF();
  const u = (f - t0) / dur;
  if (u < 0 || u > 1) return null;
  return (
    <g>{Array.from({ length: n }).map((_, i) => {
      const a = (i / n) * Math.PI * 2 + 0.4;
      const r = 20 + u * (60 + (i % 3) * 20);
      return <path key={i} d={`M${x + Math.cos(a) * r},${y + Math.sin(a) * r} L${x + Math.cos(a) * (r + 16)},${y + Math.sin(a) * (r + 16)}`} stroke={i % 2 ? "#ffe27a" : "#ffffff"} strokeWidth={5} strokeLinecap="round" opacity={1 - u} />;
    })}</g>
  );
};

// ---------- barra de recorrido (HUD) ----------
export const BarraRecorrido: React.FC<{ x: number; y: number; w?: number; rotulo: string; valor: string; desde: number; hasta: number; fin?: number; color?: string; pastilla?: boolean }> = ({ x, y, w = 760, rotulo, valor, desde, hasta, fin, color = "#ffcf6e", pastilla }) => {
  const f = useF();
  if (f < desde || (fin !== undefined && f > fin)) return null;
  const p = cl(f, desde, hasta);
  const o = Math.min(cl(f, desde, desde + 8), fin ? cl(f, fin - 8, fin, 1, 0) : 1);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, opacity: o, fontFamily: F_HUD, fontWeight: 600, color: "#ffffff", ...(pastilla ? { background: "rgba(27,34,51,0.85)", padding: "12px 28px 16px", borderRadius: 22, boxSizing: "border-box" as const } : {}) }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: pastilla ? 32 : 38, WebkitTextStroke: `7px ${CONTORNO}`, paintOrder: "stroke fill", marginBottom: 8 }}><span>{rotulo}</span><span style={{ color }}>{valor}</span></div>
      <div style={{ height: 22, borderRadius: 11, background: "#1b1622", border: `4px solid ${CONTORNO}`, overflow: "hidden" }}><div style={{ width: `${p * 100}%`, height: "100%", background: color }} /></div>
    </div>
  );
};

// =====================================================================================================
// VUELTA 2 (director creativo): piezas nuevas. Todo vector.
// =====================================================================================================
import { enPantalla, Clave } from "../../anikit/camara";
import { Globo } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { Espalda } from "./elenco_lcb";

// ---------- de espaldas con giro de cabeza (grados hacia +x si giro>0): se asoma un pedazo de cara con un ojo ----------
export const EspaldaGira: React.FC<{ x: number; y: number; s?: number; e: Espalda; f: number; seed?: number; giro?: number; borde?: string; torso?: number }> = ({ x, y, s = 1, e, f, seed = 0, giro = 0, borde = "#ffcf6e", torso = 0 }) => {
  const k = e.nino ? 0.74 : 1;
  const resp = Math.sin(f / 26 + seed) * 1.6;
  const pant = e.pantalon ?? "#1c1820";
  const H = 300 * k, cab = H - 30 * k;
  const g = Math.max(-1, Math.min(1, giro / 20));
  const pf = Math.max(0, Math.min(1, (Math.abs(giro) - 20) / 15)); // 20→35°: perfil completo (ojo + nariz)
  const cx = 0, cy = -cab + 18 * k;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M-30,0 L30,0 L${90 * k},${260 * k} L${-90 * k},${260 * k} Z`} fill="#0b0810" opacity={0.42} />
      <rect x={-24 * k} y={-110 * k} width={18 * k} height={110 * k} rx={6} fill={pant} />
      <rect x={6 * k} y={-110 * k} width={18 * k} height={110 * k} rx={6} fill={pant} />
      <ellipse cx={-15 * k} cy={-2} rx={15 * k} ry={7 * k} fill="#0b0a0c" />
      <ellipse cx={15 * k} cy={-2} rx={15 * k} ry={7 * k} fill="#0b0a0c" />
      <g transform={`translate(${torso * 0.5 * k},${resp}) rotate(${torso * 0.25} 0 ${-100 * k}) scale(${1 - Math.abs(torso) / 120},1)`}>
        <path d={`M${-46 * k},${-H + 92 * k} Q${-52 * k},${-H + 70 * k} ${-30 * k},${-H + 64 * k} L${30 * k},${-H + 64 * k} Q${52 * k},${-H + 70 * k} ${46 * k},${-H + 92 * k} L${50 * k},${-96 * k} Q0,${-86 * k} ${-50 * k},${-96 * k} Z`} fill={e.abrigo} />
        <rect x={-62 * k} y={-H + 80 * k} width={22 * k} height={110 * k} rx={10 * k} fill={e.abrigo} transform={`rotate(6 ${-50 * k} ${-H + 80 * k})`} />
        <rect x={40 * k} y={-H + 80 * k} width={22 * k} height={110 * k} rx={10 * k} fill={e.abrigo} transform={`rotate(-6 ${50 * k} ${-H + 80 * k})`} />
        <path d={`M${-46 * k},${-H + 92 * k} Q${-52 * k},${-H + 70 * k} ${-30 * k},${-H + 64 * k} L${30 * k},${-H + 64 * k} Q${52 * k},${-H + 70 * k} ${46 * k},${-H + 92 * k}`} stroke={borde} strokeWidth={5} fill="none" opacity={0.8} />
        {e.mochila && <g><rect x={-32 * k} y={-H + 96 * k} width={64 * k} height={84 * k} rx={14 * k} fill={e.mochila} /><rect x={-22 * k} y={-H + 136 * k} width={44 * k} height={30 * k} rx={8 * k} fill="#000" opacity={0.18} /></g>}
        {/* cabeza que gira sobre el cuello */}
        <g transform={`rotate(${giro * 0.25} ${cx} ${cy + 30 * k}) translate(${g * 7 * k},0)`}>
          <circle cx={cx} cy={cy} r={34 * k} fill={e.pelo ?? "#2a1e1a"} />
          {Math.abs(g) > 0.05 && <g>
            <ellipse cx={cx + Math.sign(g) * (22 + 4 * pf) * k * Math.abs(g)} cy={cy + 4 * k} rx={(18 + 8 * pf) * k * Math.abs(g)} ry={28 * k} fill="#0d0a0e" />
            {Math.abs(g) > 0.45 && <circle cx={cx + Math.sign(g) * (26 + 4 * pf) * k * Math.abs(g)} cy={cy + 2 * k} r={(5 + 4 * pf) * k} fill="#fff" />}
            {Math.abs(g) > 0.45 && pf > 0 && <circle cx={cx + Math.sign(g) * (27 + 4 * pf) * k + Math.sign(g) * 1.5 * k} cy={cy + 2 * k} r={3.4 * k} fill="#0d0a0e" />}
            {pf > 0 && <path d={`M${cx + Math.sign(g) * 31 * k},${cy - 2 * k} L${cx + Math.sign(g) * (31 + 16 * pf) * k},${cy + 14 * k} L${cx + Math.sign(g) * 29 * k},${cy + 18 * k} Z`} fill="#0d0a0e" stroke={borde} strokeWidth={2.5 * k} />}
          </g>}
          {e.rizos && Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={Math.cos((i / 6) * Math.PI + Math.PI) * 30 * k} cy={cy - 4 * k + Math.sin((i / 6) * Math.PI + Math.PI) * 26 * k} r={14 * k} fill={e.pelo} />)}
          {e.cola && <path d={`M${10 * k},${-cab + 30 * k} q${34 * k},${10 * k} ${26 * k},${70 * k} q${-8 * k},${10 * k} ${-14 * k},${-4 * k} q${6 * k},${-36 * k} ${-20 * k},${-56 * k} Z`} fill={e.pelo} />}
          {e.gorro && <g><path d={`M${-35 * k},${-cab + 12 * k} Q${-36 * k},${-cab - 34 * k} 0,${-cab - 36 * k} Q${36 * k},${-cab - 34 * k} ${35 * k},${-cab + 12 * k} Z`} fill={e.gorro} /><rect x={-37 * k} y={-cab + 2 * k} width={74 * k} height={16 * k} rx={7 * k} fill={e.vuelta ?? e.gorro} /></g>}
        </g>
      </g>
    </g>
  );
};

// ---------- etiqueta (número + rótulo) colgada de un punto del mundo, BLANCA con contorno oscuro, con pop de entrada ----------
export const Sello: React.FC<{ claves: Clave[]; X: number; Y: number; numero: string; rotulo: string; desde: number; hasta: number; tam?: number; color?: string; xMin?: number; xMax?: number; fijo?: { x: number; y: number }; fondo?: boolean; salida?: number }> = ({ claves, X, Y, numero, rotulo, desde, hasta, tam = 76, color = "#ffffff", xMin = 260, xMax = 1660, fijo, fondo, salida = 8 }) => {
  const f = useF();
  if (f < desde || f > hasta) return null;
  const s = enPantalla(claves, f, 30, X, Y);
  const e = popDe(f - desde);
  const o = Math.min(cl(f, desde, desde + 5), cl(f, hasta - salida, hasta, 1, 0));
  const px = fijo ? fijo.x : Math.max(xMin, Math.min(xMax, s.x)), py = fijo ? fijo.y : Math.max(fondo ? 205 : 150, s.y);
  const st = (t: number) => ({ WebkitTextStroke: `${Math.max(5, t * 0.12)}px ${CONTORNO}`, paintOrder: "stroke fill" as const, textShadow: "0 4px 0 rgba(10,8,14,0.85)" });
  return (
    <div style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-100%) scale(${e})`, transformOrigin: "50% 100%", opacity: o, textAlign: "center", fontFamily: F_HUD, whiteSpace: "nowrap", pointerEvents: "none", ...(fondo ? { background: "rgba(27,34,51,0.9)", padding: `${tam * 0.18}px ${tam * 0.4}px ${tam * 0.22}px`, borderRadius: tam * 0.3, border: "3px solid rgba(255,207,110,0.55)" } : {}) }}>
      <div style={{ fontWeight: 700, fontSize: tam, lineHeight: 1, color, ...st(tam) }}>{numero}</div>
      <div style={{ fontWeight: 600, fontSize: Math.max(40, tam * 0.5), letterSpacing: 3, color, marginTop: 2, ...st(tam * 0.5) }}>{rotulo}</div>
    </div>
  );
};

// ---------- bocadillo colgado de un punto del mundo (sigue a la cámara) ----------
export const GloboEn: React.FC<{ claves: Clave[]; X: number; Y: number; texto: string; desde: number; hasta: number; cola?: "izq" | "der" | "abajo"; tam?: number }> = ({ claves, X, Y, texto, desde, hasta, cola = "abajo", tam = 56 }) => {
  const f = useF();
  const s = enPantalla(claves, f, 30, X, Y);
  return <Globo texto={texto} x={s.x} y={s.y} desde={desde} hasta={hasta} cola={cola} tam={tam} />;
};

// ---------- pantalla verde de la radio con texto OSCURO (contraste alto), cubre la del set ----------
export const PantallaRadio: React.FC<{ valor: string; on?: boolean }> = ({ valor, on = true }) => (
  <g>
    <rect x={452} y={332} width={536} height={216} rx={12} fill="#1a1a1e" />
    <rect x={460} y={340} width={520} height={200} rx={10} fill={on ? "#7fe39a" : "#4a8a5c"} />
    <rect x={470} y={350} width={500} height={60} rx={8} fill="#ffffff" opacity={0.12} />
    <text x={720} y={468} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={104} fill="#0b1f12">{valor}</text>
  </g>
);

// ---------- cartel CANAL PARK en el edificio de Gus: borra el texto chico del set y pone un cartel a la altura de las ventanas del 3er piso ----------
export const CartelCanal: React.FC<{ y?: number; tam?: number }> = ({ y = 505, tam = 44 }) => (
  <g>
    <rect x={340} y={744} width={140} height={44} fill="#5a2e2a" />
    <rect x={364} y={704} width={92} height={102} fill="#3e1e1c" />
    <rect x={370} y={710} width={80} height={90} fill="#221c2a" />
    <rect x={282} y={y} width={256} height={74} rx={10} fill="#1d1a22" stroke="#e8d9b5" strokeWidth={4} />
    <text x={410} y={y + 52} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={tam} fill="#f6ecd2" letterSpacing={2}>CANAL PARK</text>
  </g>
);

// ---------- llamarada extra en la boca de la caldera (salta de escala al entrar un mueble) ----------
export const Llamarada: React.FC<{ x: number; y: number; t0: number; dur?: number; amp?: number }> = ({ x, y, t0, dur = 14, amp = 0.3 }) => {
  const f = useF();
  const u = (f - t0) / dur;
  if (u < 0 || u > 1) return null;
  const s = 1 + amp * Math.sin(Math.PI * u);
  return (
    <g transform={`translate(${x},${y}) scale(${s},${s * (1 + 0.5 * Math.sin(Math.PI * u))})`} opacity={1 - u * 0.5}>
      {[-90, -45, 0, 45, 90].map((dx, i) => <path key={i} d={`M${dx - 22},0 Q${dx - 10},${-110 - (i % 2) * 40} ${dx + 6},${-150 + (i % 2) * 20} Q${dx + 22},${-90} ${dx + 22},0 Z`} fill={i % 2 ? "#ffcf6e" : "#ff7a2a"} />)}
    </g>
  );
};

// ---------- casa chica de Theo en la colina (destino de la línea de visión) ----------
export const CasaTheo: React.FC<{ x: number; y: number; luz?: number; rotulo?: boolean }> = ({ x, y, luz = 0.8, rotulo = true }) => (
  <g>
    <path d={`M${x - 560},910 Q${x - 330},${y + 14} ${x},${y + 14} Q${x + 330},${y + 14} ${x + 560},910 Z`} fill="#e4e9f6" />
    <rect x={x - 90} y={y - 120} width={180} height={130} fill="#6a4a3a" />
    <path d={`M${x - 112},${y - 120} L${x},${y - 200} L${x + 112},${y - 120} Z`} fill="#2a1e22" />
    <path d={`M${x - 112},${y - 120} L${x},${y - 200} L${x + 112},${y - 120} L${x + 100},${y - 124} L${x},${y - 188} L${x - 100},${y - 124} Z`} fill="#eef2fa" />
    <rect x={x - 70} y={y - 92} width={60} height={56} fill="#3e2a22" />
    <rect x={x - 64} y={y - 86} width={48} height={44} fill={luz > 0.1 ? "#ffd27a" : "#221c2a"} opacity={0.5 + 0.5 * luz} />
    <rect x={x + 20} y={y - 70} width={42} height={80} fill="#3a2a22" />
    {rotulo && <text x={x} y={y + 84} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill="#f6ecd2" stroke="#0e0a12" strokeWidth={6} paintOrder="stroke">THEO'S HOUSE</text>}
  </g>
);

// ---------- SET «contraplano»: los 10 de frente en la cima, cámara baja mirando hacia arriba; abajo, los techos de la ciudad con ventanas que se apagan ----------
export const Contra: React.FC<any> = ({ capa, f, apagadas = 0 }) => {
  if (capa === "lejos") {
    return (
      <g>
        <defs><linearGradient id="cnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#120f2c" /><stop offset="0.5" stopColor="#38285a" /><stop offset="0.8" stopColor="#8a4a62" /><stop offset="1" stopColor="#f08a44" /></linearGradient></defs>
        <rect x={-2400} y={-1400} width={7000} height={2500} fill="url(#cnSky)" />
        {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={-1200 + ((i * 197) % 3400)} cy={-500 + ((i * 89) % 900)} r={1.6 + (i % 3)} fill="#f6ecd2" opacity={0.35 + 0.35 * Math.sin(f / 20 + i)} />)}
      </g>
    );
  }
  if (capa === "frente") {
    return <g><Halo x={960} y={1120} r={1100} color="#ff9a4a" fuerza={0.34} /></g>;
  }
  const W = [[40, 1010, 520, 420], [620, 960, 420, 470], [1080, 1030, 460, 400], [1580, 990, 520, 440]];
  let n = 0;
  return (
    <g>
      <path d="M-800,880 Q300,800 960,826 T2800,860 L2800,1400 L-800,1400 Z" fill="#8c82a8" />
      <path d="M-800,880 Q300,800 960,826 T2800,860" stroke="#ffb46a" strokeWidth={8} fill="none" opacity={0.8} />
      <path d="M-800,980 Q500,930 1300,960 T2800,990 L2800,1400 L-800,1400 Z" fill="#6c6288" />
      {W.map(([x, y, w, h], b) => (
        <g key={b}>
          <rect x={x} y={y} width={w} height={h} fill="#201a30" />
          <rect x={x - 6} y={y - 14} width={w + 12} height={18} fill="#2c2440" />
          {[0, 1].map((r) => [0, 1, 2].map((c) => {
            const i = n++;
            const lit = i >= apagadas;
            const wx = x + 40 + c * ((w - 80) / 3), ww = ((w - 80) / 3) - 30;
            return <g key={`${r}${c}`}><rect x={wx} y={y + 36 + r * 114} width={ww} height={74} fill={lit ? "#ffcf6e" : "#171221"} opacity={lit ? 0.85 + 0.15 * Math.sin(f / 7 + i) : 1} />{lit && r === 0 && <Halo x={wx + ww / 2} y={y + 70} r={110} color="#ffb04a" fuerza={0.35} />}</g>;
          }))}
        </g>
      ))}
    </g>
  );
};

// =====================================================================================================
// VUELTA 3 (director creativo): piezas nuevas. Todo vector.
// =====================================================================================================

// ---------- Ore de espaldas que LEVANTA la cabeza (alza 0..1) ----------
export const OreEspaldasAlza: React.FC<{ x: number; y: number; s?: number; f: number; alza?: number }> = ({ x, y, s = 1, f, alza = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-40,0 L40,0 L110,200 L-110,200 Z" fill="#0b0810" opacity={0.42} />
    <path d={`M30,-14 q${50 + Math.sin(f / 4) * 14},-6 ${60 + Math.sin(f / 4) * 20},-40`} stroke="#17131a" strokeWidth={16} strokeLinecap="round" fill="none" />
    <ellipse cx={0} cy={-56} rx={52} ry={60} fill="#17131a" />
    <g transform={`translate(${alza * 8},${-alza * 34}) rotate(${alza * 10} 0 -130)`}>
      <rect x={-14} y={-130} width={28} height={40 + alza * 34} fill="#17131a" />
      <rect x={-34} y={-136} width={68} height={22} rx={8} fill="#c0352c" />
      <ellipse cx={0} cy={-150} rx={38} ry={32} fill="#17131a" />
      <path d="M-36,-164 Q-56,-150 -46,-118 Q-34,-124 -30,-150 Z M36,-164 Q56,-150 46,-118 Q34,-124 30,-150 Z" fill="#241e28" />
      <path d="M-26,-176 A38,32 0 0 1 26,-176" stroke="#ffcf6e" strokeWidth={4} fill="none" opacity={0.7} />
      {alza > 0.3 && <ellipse cx={30} cy={-150} rx={16 * alza} ry={12} fill="#17131a" />}
    </g>
  </g>
);

// ---------- silla de madera reconocible (respaldo + asiento + 4 patas), ~160 de alto a s=1; origen = centro del asiento ----------
export const Silla: React.FC<{ s?: number; rot?: number; tinte?: string }> = ({ s = 1, rot = 0, tinte }) => {
  const c1 = tinte ?? "#8a5a34", c2 = tinte ?? "#6a4226", c3 = tinte ?? "#5a361e", c4 = tinte ?? "#7a4c2c", bo = tinte ? "#0e0a12" : "#3a2214";
  return (
    <g transform={`scale(${s}) rotate(${rot})`}>
      <rect x={-50} y={-14} width={100} height={18} rx={4} fill={c1} stroke={bo} strokeWidth={4} />
      <rect x={-48} y={-96} width={14} height={86} rx={3} fill={c2} stroke={bo} strokeWidth={3} />
      <rect x={-48} y={-90} width={46} height={12} rx={3} fill={c4} stroke={bo} strokeWidth={3} />
      <rect x={-48} y={-60} width={46} height={10} rx={3} fill={c4} stroke={bo} strokeWidth={3} />
      {[-46, -26, 22, 38].map((lx, i) => <rect key={i} x={lx} y={2} width={10} height={62} rx={3} fill={i % 2 ? c3 : c2} stroke={bo} strokeWidth={3} />)}
      <rect x={-44} y={36} width={88} height={7} fill={c3} />
    </g>
  );
};

// ---------- HUD: «BURNING FURNITURE» + íconos de silla que se van tachando (sin cifra) ----------
export const SillasTachadas: React.FC<{ x: number; y: number; tiempos: number[]; desde: number; hasta?: number }> = ({ x, y, tiempos, desde, hasta }) => {
  const f = useF();
  if (f < desde) return null;
  const o = Math.min(cl(f, desde, desde + 8), hasta ? cl(f, hasta - 10, hasta, 1, 0) : 1);
  const n = tiempos.length;
  const W = 140;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", opacity: o, textAlign: "center", fontFamily: F_HUD, background: "rgba(16,12,22,0.82)", padding: "12px 30px 14px", borderRadius: 24 }}>
      <div style={{ fontWeight: 600, fontSize: 44, letterSpacing: 3, color: "#ffffff", WebkitTextStroke: `4px ${CONTORNO}`, paintOrder: "stroke fill" }}>BURNING FURNITURE</div>
      <svg width={n * W} height={150} viewBox={`0 0 ${n * W} 150`} style={{ display: "block", margin: "6px auto 0" }}>
        {tiempos.map((t, i) => {
          const e = f >= t ? popDe(f - t) : 0;
          const tx = cl(f, t + 4, t + 12);
          return (
            <g key={i} transform={`translate(${i * W + W / 2},92) scale(${0.72 * (f >= t ? e : 1)})`} opacity={f >= t ? 1 : 0.6}>
              <Silla tinte="#f0d9a0" />
              {tx > 0 && <path d={`M-70,-100 L${-70 + 140 * tx},${-100 + 170 * tx} M70,-100 L${70 - 140 * Math.max(0, tx * 2 - 1)},${-100 + 170 * Math.max(0, tx * 2 - 1)}`} stroke="#e23a2e" strokeWidth={16} strokeLinecap="round" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ---------- pastilla HUD de texto blanco sobre fondo oscuro ----------
export const Pastilla: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string }> = ({ texto, x, y, desde, hasta, tam = 36, color = "#ffffff" }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const o = Math.min(cl(f, desde, desde + 6), hasta ? cl(f, hasta - 8, hasta, 1, 0) : 1);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${popDe(f - desde)})`, opacity: o, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 2, color, background: "rgba(27,34,51,0.88)", padding: `${tam * 0.25}px ${tam * 0.6}px`, borderRadius: tam * 0.5, whiteSpace: "nowrap" }}>{texto}</div>;
};

// ---------- tapa la vitrina del set Visitantes con la MISMA pared (mismo orden de capas que el set: pared → listones → zócalo → halo del ventanal),
// así no queda un rectángulo de otro tono; después rehace el borde derecho de la pizarra del set (x 846..914) ----------
export const TapaVitrina: React.FC<{ hora?: Hora; pizarra?: boolean }> = ({ hora = "dia", pizarra = true }) => {
  const P = 900, pared = "#2f3a48";
  const x0 = 840, x1 = 1080, y0 = P - 370;
  return (
    <g>
      <defs><clipPath id="tapavit"><path clipRule="evenodd" d={`M${x0},${y0} H${x1} V${P} H${x0} Z M${x0},${y0} H914 V684 H${x0} Z`} /></clipPath></defs>
      <g clipPath="url(#tapavit)">
        <rect x={x0} y={y0} width={x1 - x0} height={P - y0} fill={pared} />
        {[880, 1000].map((x) => <rect key={x} x={x} y={y0} width={3} height={P - y0} fill={osc(pared, 0.85)} />)}
        <rect x={x0} y={P - 160} width={x1 - x0} height={160} fill={osc(pared, 0.8)} />
        <Halo x={1700} y={450} r={1200} color={LUCES[hora].sol} fuerza={0.22} />
      </g>
      {pizarra && <>
        <rect x={846} y={536} width={914 - 846} height={684 - 536} fill="#a9b0ba" />
        <rect x={846} y={536} width={900 - 846} height={670 - 536} fill="#f4f6f6" />
        <rect x={846} y={670} width={900 - 846} height={14} fill="#8a909a" />
      </>}
    </g>
  );
};

// ---------- pared lisa del set Visitantes sobre un rectángulo cualquiera (mismas capas que el set) ----------
export const TapaPared: React.FC<{ x0: number; y0: number; x1: number; y1: number; hora?: Hora; id: string }> = ({ x0, y0, x1, y1, hora = "dia", id }) => {
  const pared = "#2f3a48";
  return (
    <g>
      <defs><clipPath id={id}><rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={pared} />
        {Array.from({ length: 40 }).map((_, i) => -800 + i * 120).filter((x) => x > x0 - 4 && x < x1).map((x) => <rect key={x} x={x} y={y0} width={3} height={y1 - y0} fill={osc(pared, 0.85)} />)}
        <Halo x={1700} y={450} r={1200} color={LUCES[hora].sol} fuerza={0.22} />
      </g>
    </g>
  );
};
