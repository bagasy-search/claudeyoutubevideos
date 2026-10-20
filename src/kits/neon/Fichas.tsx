// nx-fichas-casino — enumerar 2-4 ingredientes: fichas de casino doradas en 3D esperan girando abajo; cuando se dice
// cada ítem, su ficha vuela girando hasta su renglón, aterriza con un clic y deja la frase al lado.
import React from "react";
import { easeOut, lerp, N, SANS, SERIF, pop, ramp, useSvgId, useT, vis } from "./base";
import { LineaTitulo } from "./Titulo";

// ficha 3D: dos caras SVG + canto armado con discos apilados (se ve el grosor cuando gira)
export const Ficha3D: React.FC<{ d: number; n?: string | number; ry: number; rx?: number }> = ({ d, n, ry, rx = 0 }) => {
  const g = useSvgId("fg"), g2 = useSvgId("fg2");
  const grosor = d * 0.085, capas = 9;
  const luz = 0.72 + 0.28 * Math.abs(Math.cos((ry * Math.PI) / 180));
  const cara = (atras: boolean) => (
    <svg viewBox="0 0 100 100" width={d} height={d} style={{ position: "absolute", inset: 0, transform: `${atras ? "rotateY(180deg) " : ""}translateZ(${grosor / 2}px)`, backfaceVisibility: "hidden", filter: `brightness(${luz})` }}>
      <defs>
        <radialGradient id={g} cx="36%" cy="32%" r="75%"><stop offset="0" stopColor={N.oroClaro} /><stop offset="0.45" stopColor={N.oro} /><stop offset="1" stopColor={N.oroHondo} /></radialGradient>
        <radialGradient id={g2} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#3a2c0e" /><stop offset="1" stopColor="#120c03" /></radialGradient>
      </defs>
      <circle cx={50} cy={50} r={49} fill={`url(#${g})`} />
      <circle cx={50} cy={50} r={42.5} fill="none" stroke={N.oroNegro} strokeWidth={9} strokeDasharray="16.69 16.69" transform="rotate(11 50 50)" />
      <circle cx={50} cy={50} r={36} fill="none" stroke="#ffe7a0" strokeWidth={1.4} />
      <circle cx={50} cy={50} r={31} fill={`url(#${g2})`} />
      <circle cx={50} cy={50} r={27} fill="none" stroke={N.oro} strokeWidth={1.3} />
      {n !== undefined && <text x={50} y={61} textAnchor="middle" fontFamily={SERIF} fontSize={32} fill={N.oro}>{n}</text>}
      <ellipse cx={36} cy={28} rx={22} ry={9} fill="#fff" opacity={0.22} transform="rotate(-28 36 28)" />
    </svg>
  );
  return (
    <div style={{ position: "relative", width: d, height: d, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
      {Array.from({ length: capas }).map((_, i) => (
        <div key={i} style={{ position: "absolute", inset: d * 0.01, borderRadius: "50%", background: i % 2 ? "#5e3f07" : "#8a5d0c", transform: `translateZ(${-grosor / 2 + (i / (capas - 1)) * grosor}px)` }} />
      ))}
      {cara(false)}
      {cara(true)}
    </div>
  );
};

export type ItemFicha = { texto: string; t: number };
// (x, y) = centro del bloque en el MUNDO. items[i].t = cuando se DICE ese ítem. extra = fichas de adorno que esperan (0 por defecto: si sobran fichas parece que falta un ítem).
export const FichasCasino: React.FC<{ x: number; y: number; t0: number; t1?: number; titulo?: string; items: ItemFicha[]; extra?: number; d?: number; filaH?: number }> = ({ x, y, t0, t1 = Infinity, titulo, items, extra = 0, d = 112, filaH = 150 }) => {
  const t = useT();
  if (!vis(t, t0, t1)) return null;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const n = items.length + extra;
  const y0 = y - ((items.length - 1) * filaH) / 2 - 30;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - sal }}>
      {titulo && (
        <div style={{ position: "absolute", left: x - 700, top: y0 - 230, width: 1400 }}><LineaTitulo texto={titulo} t0={t0} size={66} /></div>
      )}
      {Array.from({ length: n }).map((_, i) => {
        const it = items[i];
        const ti = t0 + 0.1 + i * 0.12;
        if (t < ti - 0.05) return null;
        // lugar de espera (abajo, girando) y renglón final
        const wx = x - 60 + (i - (n - 1) / 2) * 190 + 120, wy = y + ((items.length - 1) * filaH) / 2 + 190;
        const rx_ = x - 330, ry_ = y0 + i * filaH;
        const ent = pop(t, ti, 12);
        const idle = (tt: number) => (tt - ti) * 75 + i * 55;
        let px = wx, py = wy + (1 - ent) * 200 + Math.sin(t * 2 + i) * 6, rotY = idle(t), sc = 0.78 * ent, rotX = 18;
        if (it && t >= it.t) {
          const k = ramp(t, it.t, 0.55, easeOut);
          const base = (((idle(it.t) % 360) + 360) % 360) + 1080;
          px = lerp(wx, rx_, k);
          py = lerp(wy, ry_, k) - Math.sin(Math.PI * k) * 120;
          rotY = base * (1 - k);
          rotX = lerp(18, 0, k);
          sc = lerp(0.78, 1, k);
          const tau = t - (it.t + 0.55);
          if (tau > 0) { rotY = 14 * Math.exp(-6 * tau) * Math.sin(16 * tau); sc = 1 + 0.08 * Math.exp(-7 * tau) * Math.sin(18 * tau); }
        }
        return (
          <div key={i} style={{ position: "absolute", left: px - d / 2, top: py - d / 2, width: d, height: d, perspective: 700, transform: `scale(${sc})`, filter: "drop-shadow(0 14px 18px rgba(0,0,0,.6)) drop-shadow(0 0 16px rgba(244,194,74,.28))" }}>
            <Ficha3D d={d} n={i + 1} ry={rotY} rx={rotX} />
          </div>
        );
      })}
      {items.map((it, i) => {
        if (t < it.t + 0.4) return null;
        const words = it.texto.split(/\s+/);
        return (
          <div key={"tx" + i} style={{ position: "absolute", left: x - 250, top: y0 + i * filaH, transform: "translateY(-50%)", width: 640, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: "#fff", lineHeight: 1.08, letterSpacing: -0.6, textShadow: "0 4px 18px rgba(0,0,0,.7)" }}>
            {words.map((w, j) => {
              const k = ramp(t, it.t + 0.4 + j * 0.05, 0.3, easeOut);
              return <span key={j} style={{ display: "inline-block", marginRight: 12, opacity: k, filter: `blur(${(1 - k) * 10}px)`, transform: `translateX(${(1 - k) * -14}px)` }}>{w}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};
