import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  GodRays,
  PaperGrain,
  ParticleField,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ── PIEZA ÚNICA (video AGUA OXIGENADA) — momento: "se degrada con la luz" ──────
// Dos botellas bajo un mismo haz de luz (GodRays):
//  · IZQ = botella TRANSPARENTE (clara): la luz la atraviesa; su contenido se
//    DESATURA con el tiempo (interpolación de saturación) — pierde el burbujeo,
//    su medidor de "potencia" cae: el peróxido se volvió agua.
//  · DER = botella ÁMBAR (oscura): el vidrio bloquea la luz; adentro sigue VIVA,
//    burbujas de O₂ activas, medidor arriba.
// GodRays + motas de polvo en el haz + DepthShadow + RimLight. Serif de theme.
// Marca terrosa-vintage: vidrio ámbar sepia, verde de vida, óxido de decaimiento.
// Esquina inf-derecha LIBRE para PiP.
// RENDER-SAFE: todo por useCurrentFrame(); azar determinístico por índice.

const AMBER = COLORS.amber; // vidrio ámbar / sepia
const GREEN = COLORS.good;
const EMBER = COLORS.danger;
const LIQ = COLORS.cold; // líquido vivo (eucalipto)

export const PxAmberDecay: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "Por qué botella oscura" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // decaimiento de la botella clara: 0 (viva) → 1 (agua muerta), tras 1s
  const decay = interpolate(frame - sec(1.0), [0, sec(2.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // clímax: destello del haz a ~1s marcando que la luz "ataca"
  const beam = spring({ frame: frame - sec(0.9), fps, config: { damping: 16, mass: 0.8, stiffness: 90 } });

  // saturación del líquido claro (satura→gris) e intensidad de vida
  const clearLife = 1 - decay;
  const clearCol = interpolateColor(LIQ, "#B9BEB6", decay); // de eucalipto a agua grisácea
  const clearGauge = clearLife;
  const amberGauge = 0.92 + Math.sin(frame / 30) * 0.03; // se mantiene arriba

  // geometría botellas
  const clearX = 560;
  const amberX = 1080;
  const bY = 340; // tope del cuerpo
  const bW = 190;
  const bH = 380;

  // Botella genérica
  const Bottle: React.FC<{
    cx: number;
    glassFill: string;
    glassOp: number;
    liquidCol: string;
    liquidOp: number;
    stroke: string;
    life: number;
    dark: boolean;
    at: number;
  }> = ({ cx, glassFill, glassOp, liquidCol, liquidOp, stroke, life, dark, at }) => {
    const s = lab(at);
    const liqTop = bY + 70; // nivel del líquido
    return (
      <g opacity={s} transform={`translate(0 ${(1 - s) * 20})`}>
        {/* sombra al piso */}
        <ellipse cx={cx} cy={bY + bH + 30} rx={bW / 2 + 18} ry={30} fill="#000" opacity={0.14} />
        {/* líquido dentro (detrás del vidrio) */}
        <path
          d={`M ${cx - bW / 2 + 14} ${liqTop} L ${cx - bW / 2 + 14} ${bY + bH - 18} Q ${cx - bW / 2 + 14} ${bY + bH} ${cx - bW / 2 + 34} ${bY + bH} L ${cx + bW / 2 - 34} ${bY + bH} Q ${cx + bW / 2 - 14} ${bY + bH} ${cx + bW / 2 - 14} ${bY + bH - 18} L ${cx + bW / 2 - 14} ${liqTop} Z`}
          fill={liquidCol}
          opacity={liquidOp}
        />
        {/* superficie ondulada del líquido */}
        <path
          d={Array.from({ length: 7 }, (_, i) => {
            const wx = cx - bW / 2 + 14 + (i / 6) * (bW - 28);
            const wy = liqTop + Math.sin(frame / 10 + i) * (2 + life * 3);
            return `${i === 0 ? "M" : "L"} ${wx} ${wy}`;
          }).join(" ")}
          stroke={liquidCol}
          strokeWidth={4}
          fill="none"
          opacity={liquidOp + 0.2}
        />
        {/* burbujas internas de O₂ (vivas => muchas; muertas => casi ninguna) */}
        {Array.from({ length: 12 }, (_, i) => {
          const span = 90 + Math.floor(rand(i, 1) * 50);
          const p = ((frame + rand(i, 2) * span) % span) / span;
          const bx = cx - bW / 2 + 30 + rand(i) * (bW - 60) + wobble(i, frame, 1.2) * 6;
          const by = bY + bH - 20 - p * (bH - 110);
          const br = 3 + rand(i, 4) * 5;
          const op = Math.sin(p * Math.PI) * 0.75 * life;
          return (
            <g key={"ib" + i} opacity={op}>
              <circle cx={bx} cy={by} r={br} fill={dark ? LIQ : liquidCol} opacity={0.6} />
              <circle cx={bx} cy={by} r={br} fill="none" stroke={dark ? LIQ : liquidCol} strokeWidth={1.5} />
            </g>
          );
        })}
        {/* VIDRIO (por encima, semitransparente) */}
        <path
          d={`M ${cx - bW / 2} ${bY} L ${cx - bW / 2} ${bY + bH - 24} Q ${cx - bW / 2} ${bY + bH} ${cx - bW / 2 + 30} ${bY + bH} L ${cx + bW / 2 - 30} ${bY + bH} Q ${cx + bW / 2} ${bY + bH} ${cx + bW / 2} ${bY + bH - 24} L ${cx + bW / 2} ${bY} Z`}
          fill={glassFill}
          opacity={glassOp}
          stroke={stroke}
          strokeWidth={4}
        />
        {/* hombro + cuello */}
        <path d={`M ${cx - bW / 2} ${bY} Q ${cx - 40} ${bY - 40} ${cx - 34} ${bY - 74} L ${cx + 34} ${bY - 74} Q ${cx + 40} ${bY - 40} ${cx + bW / 2} ${bY} Z`} fill={glassFill} opacity={glassOp} stroke={stroke} strokeWidth={4} />
        <rect x={cx - 36} y={bY - 100} width={72} height={30} rx={6} fill={glassFill} opacity={glassOp + 0.1} stroke={stroke} strokeWidth={4} />
        {/* tapa */}
        <rect x={cx - 40} y={bY - 118} width={80} height={26} rx={7} fill={dark ? "#3a2a1a" : AMBER} />
        {/* reflejo especular vertical del vidrio */}
        <rect x={cx - bW / 2 + 18} y={bY + 8} width={16} height={bH - 60} rx={8} fill="#fff" opacity={dark ? 0.1 : 0.22} />
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="amber" />
      <PaperGrain opacity={0.1} scale={0.9} />

      {/* ── EL HAZ DE LUZ que baja sobre AMBAS botellas ── */}
      <GodRays x={46} y={-14} angle={10} color={`rgba(214,178,102,${0.16 + beam * 0.12})`} intensity={0.9 + beam * 0.3} rays={7} />

      {title && (
        <div style={{ position: "absolute", top: 58, width: "100%", textAlign: "center", opacity: lab(0.2), transform: `translateY(${(1 - lab(0.2)) * -14}px)` }}>
          <div style={{ fontSize: 60, fontWeight: 800, color: COLORS.text }}>{title}</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: COLORS.textSoft, marginTop: 2 }}>
            la luz la degrada
          </div>
        </div>
      )}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "94%", maxWidth: 1680, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)` }}>
          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            {/* haz concentrado como cono SVG que ilumina la botella clara y muere en la ámbar */}
            <defs>
              <linearGradient id="lightCone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4E2B0" stopOpacity={0.5 * (0.6 + beam * 0.5)} />
                <stop offset="100%" stopColor="#F4E2B0" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* cono de luz sobre la clara (la atraviesa) */}
            <polygon points={`${clearX - 20},60 ${clearX + 40},60 ${clearX + 150},${bY + bH} ${clearX - 130},${bY + bH}`} fill="url(#lightCone)" opacity={enter} />
            {/* cono sobre la ámbar (se corta: sombra debajo) */}
            <polygon points={`${amberX - 20},60 ${amberX + 40},60 ${amberX + 60},${bY - 30} ${amberX - 40},${bY - 30}`} fill="url(#lightCone)" opacity={0.7 * enter} />
            {/* sombra proyectada bajo la ámbar (bloqueó la luz) */}
            <ellipse cx={amberX + 30} cy={bY + bH + 30} rx={130} ry={26} fill="#2a2620" opacity={0.12 * beam} />

            {/* motas de polvo suspendidas EN el haz (determinístico) */}
            {Array.from({ length: 30 }, (_, i) => {
              const span = 200 + Math.floor(rand(i, 1) * 160);
              const p = ((frame + rand(i, 2) * span) % span) / span;
              const mx = clearX - 130 + rand(i) * 280 + wobble(i, frame, 0.5) * 20;
              const my = 80 + p * (bY + bH - 80);
              const mr = 1.5 + rand(i, 4) * 2.5;
              const op = Math.sin(p * Math.PI) * 0.35 * enter;
              return <circle key={"mote" + i} cx={mx} cy={my} r={mr} fill="#F0DBA6" opacity={op} />;
            })}

            {/* ── BOTELLA CLARA (izq) — se apaga ── */}
            <RimLightSvg cx={clearX} cy={bY + bH / 2} on={clearLife > 0.3}>
              <Bottle
                cx={clearX}
                glassFill="#EAF1EC"
                glassOp={0.28}
                liquidCol={clearCol}
                liquidOp={interpolate(decay, [0, 1], [0.5, 0.28])}
                stroke="rgba(120,140,130,0.7)"
                life={clearLife}
                dark={false}
                at={0.5}
              />
            </RimLightSvg>
            {/* aura de vida que se apaga */}
            <circle cx={clearX} cy={bY + bH / 2} r={130} fill={GREEN} opacity={0.08 * clearLife} />

            {/* ── BOTELLA ÁMBAR (der) — sigue viva ── */}
            <RimLightSvg cx={amberX} cy={bY + bH / 2} on>
              <Bottle
                cx={amberX}
                glassFill={AMBER}
                glassOp={0.62}
                liquidCol={LIQ}
                liquidOp={0.5}
                stroke="rgba(90,60,30,0.8)"
                life={1}
                dark
                at={0.9}
              />
            </RimLightSvg>
            <circle cx={amberX} cy={bY + bH / 2} r={120 + Math.sin(frame / 22) * 8} fill={LIQ} opacity={0.07} />

            {/* ── MEDIDORES de POTENCIA sobre cada botella ── */}
            <PotGauge x={clearX} y={bY - 150} level={clearGauge} col={clearGauge > 0.5 ? COLORS.amber : EMBER} enter={lab(1.4)} />
            <PotGauge x={amberX} y={bY - 150} level={amberGauge} col={GREEN} enter={lab(1.4)} />

            {/* ── ETIQUETAS ── */}
            <g opacity={lab(1.6)} transform={`translate(${clearX} ${bY + bH + 90})`} textAnchor="middle">
              <rect x={-200} y={-42} width={400} height={64} rx={16} fill={EMBER} opacity={0.14} />
              <text y={4} fontSize={38} fontWeight={900} fill={EMBER} fontFamily={FONT_STACK}>Vidrio claro: se apaga</text>
            </g>
            <g opacity={lab(1.9)} transform={`translate(${amberX} ${bY + bH + 90})`} textAnchor="middle">
              <rect x={-200} y={-42} width={400} height={64} rx={16} fill={GREEN} opacity={0.14} />
              <text y={4} fontSize={38} fontWeight={900} fill={GREEN} fontFamily={FONT_STACK}>Ámbar: sigue viva</text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      {/* motas globales cálidas flotando en el aire del taller */}
      <div style={{ position: "absolute", left: "24%", top: "10%", width: "34%", height: "70%", opacity: 0.5 * enter, pointerEvents: "none" }}>
        <ParticleField count={16} kind="dust" rise={false} drift={18} color="#EAD6A0" width={520} height={620} opacity={0.6} />
      </div>
    </AbsoluteFill>
  );
};

// ── RimLight en contexto SVG (drop-shadow cálido via filtro CSS sobre <g>) ─────
const RimLightSvg: React.FC<{ cx: number; cy: number; on: boolean; children: React.ReactNode }> = ({ on, children }) => (
  <g style={{ filter: on ? `drop-shadow(6px 4px 16px ${COLORS.amber})` : "none" }}>{children}</g>
);

// ── Medidor de "potencia" tipo dial de aguja compacto ─────────────────────────
const PotGauge: React.FC<{ x: number; y: number; level: number; col: string; enter: number }> = ({ x, y, level, col, enter }) => {
  const a = interpolate(level, [0, 1], [-120, 120]); // grados de aguja
  const rad = (a * Math.PI) / 180;
  const len = 42;
  return (
    <g opacity={enter} transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={0} r={56} fill={COLORS.bg2} />
      <circle cx={0} cy={0} r={56} fill="none" stroke="#2a2620" strokeWidth={2} opacity={0.2} />
      {/* arco de escala */}
      <path d={`M ${Math.cos(((-120) * Math.PI) / 180) * 44} ${Math.sin(((-120) * Math.PI) / 180) * 44} A 44 44 0 1 1 ${Math.cos((120 * Math.PI) / 180) * 44} ${Math.sin((120 * Math.PI) / 180) * 44}`} fill="none" stroke={col} strokeWidth={5} opacity={0.5} strokeLinecap="round" />
      {/* aguja */}
      <line x1={0} y1={0} x2={Math.sin(rad) * len} y2={-Math.cos(rad) * len} stroke={col} strokeWidth={5} strokeLinecap="round" />
      <circle cx={0} cy={0} r={7} fill={col} />
      <text x={0} y={44} fontSize={17} fontWeight={900} fill={COLORS.textSoft} fontFamily={FONT_STACK} textAnchor="middle">POTENCIA</text>
    </g>
  );
};

// interpolación de color hex determinística
function interpolateColor(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hexToRgb(h: string): [number, number, number] {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

export default PxAmberDecay;
