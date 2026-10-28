// v6b · vuelta 6 de lc01 (P09, P10, P15, P16, P18, P19, P21, P24, P25, P29): piezas nuevas (sólo las usa lc01_planos1).
// - VidrioAutoV6 (P16): SIN reflejo ni palma en el vidrio. La mano de la vara (manga naranja con puño y pliegues) entra
//   en arco, ALCANZA el puño de la manga de la campera que cuelga del asiento, la agarra (pinza) y la levanta: la manga
//   gira desde el hombro siguiendo a la mano; al final la baja un poco y la sostiene.
// - CuadernoHoyV6 (P21): la mano con DEDOS ABIERTOS (palma) y manga azul con puño claro y 2 pliegues, más grande, pasa la hoja.
// - ListaV6 (P18): la lista de lugares grande en una franja de papel, cada casilla entra con resorte y la cruz pega un pop.
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_MANO } from "../../anikit/pantalla";
import { F_MONO } from "../hud";
import { rampa } from "./lc01_planos1_comp";
import { ManoV3 } from "./v3b_v3";

const seno = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.sin) };

// ---------------------------------------------------------------------------------------------------------------
// 16 · la mano alcanza y agarra la manga de la campera (pantalla, encima de InteriorAutoV3 con el mismo empuje)
export const VidrioAutoV6: React.FC<{ e0: number; llega: number; agarra: number; suelta: number }> = ({ e0, llega, agarra, suelta }) => {
  const f = useF();
  const z = 1 + rampa(f, e0, e0 + 200, false) * 0.1;
  // levantar: 0 → 1 al agarrar, baja a 0,55 en «stepped out of it»
  const lev = interpolate(f, [agarra + 2, agarra + 26, suelta, suelta + 26], [0, 1, 1, 0.7], seno);
  const a = 58 * lev; // giro de la manga desde el hombro (grados, antihorario)
  // la manga cuelga en translate(600,770) rotate(-4); hombro local (150,40), puño local (214,213)
  const rad = (-a * Math.PI) / 180;
  const pl = { x: 150 + (214 - 150) * Math.cos(rad) - (213 - 40) * Math.sin(rad), y: 40 + (214 - 150) * Math.sin(rad) + (213 - 40) * Math.cos(rad) };
  const r4 = (-4 * Math.PI) / 180;
  const puno = { x: 600 + pl.x * Math.cos(r4) - pl.y * Math.sin(r4), y: 770 + pl.x * Math.sin(r4) + pl.y * Math.cos(r4) };
  // la mano: llega en arco desde abajo a la derecha (24 cuadros, seno) y se queda en el puño
  const u = interpolate(f, [llega, agarra], [0, 1], seno);
  const hx = puno.x + 30 + (1 - u) * 760 - Math.sin(u * Math.PI) * 40;
  const hy = puno.y + 10 + (1 - u) * 260 - Math.sin(u * Math.PI) * 140;
  const cierra = f >= agarra - 2;
  const grupo = `translate(600,770) rotate(-4) rotate(${-a} 150 40)`;
  // apretón: la mano se achica un pelo al cerrar
  const apr = f < agarra - 2 ? 1 : 1 - 0.05 * Math.exp(-(f - agarra + 2) / 5);
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "900px 600px" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* la manga derecha de la campera, colgando del borde del asiento; gira desde el hombro cuando la levantan */}
        <g transform={grupo}>
          <path d="M150,30 Q236,40 250,110 L262,210 Q200,226 168,214 L160,120 Q150,70 110,62 Z" fill="#5a6c42" stroke="#4a5838" strokeWidth={4} />
          <path d="M176,80 q30,8 56,2 M184,140 q30,8 60,0" stroke="#4a5838" strokeWidth={4} fill="none" />
          <rect x={164} y={196} width={100} height={34} rx={10} fill="#3e4a30" transform="rotate(-6 214 213)" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={176 + i * 22} y={200} width={5} height={26} fill="#2f3824" transform="rotate(-6 214 213)" />)}
        </g>
        {/* sombra de la manga levantada sobre el asiento */}
        {lev > 0.02 && <ellipse cx={puno.x - 20} cy={1000} rx={90} ry={16} fill="#000" opacity={0.18 * lev} />}
        {f >= llega && <g transform={`translate(${hx},${hy}) scale(${apr}) translate(${-hx},${-hy})`}>
          <ManoV3 x={hx} y={hy} ang={-22} manga="#c8582b" puno="#efe3c8" gesto={cierra ? "puno" : "palma"} s={1.05} />
        </g>}
        {/* al cerrar: el puño de la manga queda ENTRE los dedos (la tela por encima de la palma, los dedos por encima de la tela) */}
        {cierra && f >= llega && <g transform={grupo}>
          <rect x={164} y={196} width={100} height={34} rx={10} fill="#3e4a30" transform="rotate(-6 214 213)" />
          <g transform="rotate(-6 214 213)">{[184, 208, 232].map((x) => <path key={x} d={`M${x},186 L${x - 4},236`} stroke="#17100d" strokeWidth={22} strokeLinecap="round" />)}</g>
        </g>}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 21 · cuaderno hoy (v6): mano con dedos abiertos + manga azul con puño claro y 2 pliegues; pasa la hoja
export const CuadernoHoyV6: React.FC<{ pasa: number; zoom: number; marca: number }> = ({ pasa, zoom, marca }) => {
  const f = useF();
  const u = rampa(f, pasa, pasa + 30);
  const z = 1 + rampa(f, zoom, zoom + 60) * 0.35;
  const sx = Math.cos(u * Math.PI);
  const llega = rampa(f, pasa - 40, pasa - 6), va = rampa(f, pasa + 34, pasa + 70);
  const esq = { x: 1000 + 520 * sx, y: 830 - Math.sin(u * Math.PI) * 90 };
  const hx = esq.x + 40 + (1 - llega) * 800 + va * 1500, hy = esq.y + 20 + (1 - llega) * 560 + va * 900;
  const marcaO = rampa(f, marca, marca + 14);
  return (
    <AbsoluteFill style={{ background: "#14161e" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1010px 900px" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#3a3e48" />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={0} y={i * 96} width={1920} height={3} fill="#2c3038" />)}
          <path d="M0,0 L760,0 L1500,1080 L0,1080 Z" fill="#cfe0ff" opacity={0.1} />
          <g transform="translate(560,975) rotate(-5)"><rect x={-130} y={-40} width={260} height={80} rx={4} fill="#efe6cc" /><text x={0} y={10} textAnchor="middle" fontFamily={F_MONO} fontWeight={700} fontSize={26} fill="#3a3e48">ITEM 001</text></g>
          <g transform="rotate(-2 1000 560)">
            <rect x={460} y={262} width={1100} height={640} rx={12} fill="#000" opacity={0.4} />
            <rect x={440} y={240} width={540} height={640} rx={10} fill="#e6d8b0" />
            <rect x={1000} y={240} width={540} height={640} rx={10} fill="#e9dcb6" />
            {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1020} y={310 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
            {u > 0.5 && <path d="M1000,246 l22,30 -14,26 20,34 -16,30 18,44 -18,40 14,52 -16,44 18,54 -14,46 16,60 -18,56 12,96 -26,0 0,-632 Z" fill="#f1e6c4" stroke="#c9b88a" strokeWidth={3} />}
            <g transform={`translate(1000,0) scale(${sx},1) translate(-1000,0)`}>
              <rect x={1000} y={240} width={540} height={640} rx={10} fill={sx > 0 ? "#efe2c0" : "#e2d2a6"} />
              {sx > 0 && <>{Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1020} y={310 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
                <text x={1110} y={410} fontFamily={F_MANO} fontWeight={700} fontSize={92} fill="#2a3a7a" opacity={0.85}>CENSUS</text>
                <text x={1240} y={600} fontFamily={F_MANO} fontWeight={700} fontSize={150} fill="#2a3a7a" opacity={0.85}>1</text>
                <circle cx={1420} cy={790} r={56} fill="#a07a3a" opacity={0.15} /></>}
            </g>
            <rect x={992} y={236} width={16} height={648} rx={6} fill="#5a1a14" />
            {marcaO > 0 && <ellipse cx={1010} cy={575} rx={70} ry={275} fill="none" stroke="#d8382c" strokeWidth={8} strokeDasharray={2200} strokeDashoffset={2200 * (1 - marcaO)} opacity={0.9} />}
          </g>
          {Array.from({ length: 40 }).map((_, i) => { const x = random(`pv${i}`) * 900 + ((f * (0.3 + random(`pw${i}`) * 0.4)) % 300), y = (random(`py${i}`) * 1080 + f * (0.4 + random(`pz${i}`) * 0.5)) % 1080; return <circle key={i} cx={x + y * 0.4} cy={y} r={1.5 + random(`pr${i}`) * 2.5} fill="#e8f0ff" opacity={0.25 + 0.3 * Math.sin(f / 10 + i)} />; })}
          {llega > 0 && va < 1 && <ManoV3 x={hx} y={hy} ang={-30 + u * 12} manga="#33558e" puno="#f4ecd8" gesto="palma" s={1.3} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 18 · lista de lugares (pantalla): casillas de papel grandes; cada una entra con resorte y la cruz roja pega un pop
export const ListaV6: React.FC<{ cx: number; y: number; items: { t: string; f: number; x?: number }[]; tam?: number }> = ({ cx, y, items, tam = 64 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const caja = Math.round(tam * 0.72);
  return (
    <div style={{ position: "absolute", left: cx, top: y, transform: "translateX(-50%)", display: "flex", gap: 26 }}>
      {items.map((it, i) => {
        const vis = f >= it.f;
        const s = vis ? spring({ frame: f - it.f, fps, config: { damping: 12, stiffness: 140 } }) : 0;
        const o = vis ? Math.min(1, (f - it.f) / 8) : 0;
        const t = it.x !== undefined ? rampa(f, it.x, it.x + 10) : 0;
        const pop = it.x !== undefined && f >= it.x ? 1 + 0.12 * Math.sin(Math.min(1, (f - it.x) / 12) * Math.PI) : 1;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: o, transform: `translateY(${(1 - s) * 30}px) scale(${(0.8 + 0.2 * s) * pop})`, background: "#fdf6d8", borderRadius: 16, padding: `10px 28px`, boxShadow: "0 8px 20px rgba(0,0,0,0.45)", border: "4px solid #1d3a8a", fontFamily: F_MANO, fontWeight: 700, fontSize: tam, lineHeight: 1.1, color: "#1d3a8a", whiteSpace: "nowrap" }}>
            <div style={{ width: caja, height: caja, border: "6px solid #1d3a8a", borderRadius: 6, position: "relative", flex: "none" }}>
              {t > 0 && <svg width={caja + 24} height={caja + 24} style={{ position: "absolute", left: -18, top: -18 }}>
                <path d={`M8,8 L${8 + (caja + 8) * Math.min(1, t * 2)},${8 + (caja + 8) * Math.min(1, t * 2)}`} stroke="#d8382c" strokeWidth={10} strokeLinecap="round" />
                {t > 0.5 && <path d={`M${caja + 16},8 L${caja + 16 - (caja + 8) * (t * 2 - 1)},${8 + (caja + 8) * (t * 2 - 1)}`} stroke="#d8382c" strokeWidth={10} strokeLinecap="round" />}
              </svg>}
            </div>
            {it.t}
          </div>
        );
      })}
    </div>
  );
};
