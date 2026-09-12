import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  ParticleField,
  DepthShadow,
  RimLight,
  GodRays,
  PaperGrain,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ── PIEZA ÚNICA (video AGUA OXIGENADA) — momento: "más NO es mejor" ───────────
// Una balanza de MADERA de dos platos. El brazo se inclina con física de resorte:
//  · plato IZQUIERDO = "la dosis justa" — sube, queda en verde, equilibrado, un
//    pequeño frasco medido, la raíz de ese lado respira sana (brillo verde).
//  · plato DERECHO = "de más" — se HUNDE con el peso de un frasco desbordado; el
//    exceso QUEMA los pelitos de la raíz: brasas suben (ParticleField embers),
//    la raíz se dora/chamusca. RimLight cálido + DepthShadow levantan la escena.
// Marca terrosa-vintage: madera sepia, verde huerta, brasas óxido. Serif de theme.
// Esquina inf-derecha LIBRE para el avatar PiP.
// RENDER-SAFE: todo deriva de useCurrentFrame(); azar determinístico por índice.

const WOOD = "#6E4A2B"; // madera sepia oscura
const WOOD_LT = "#8A6034"; // veta clara
const BRASS = COLORS.amber; // herrajes / cadenas
const GREEN = COLORS.good; // dosis sana
const EMBER = COLORS.danger; // brasa / quemadura
const ROOT = "#EDE4CE"; // raíz blanca-crema
const CHAR = "#3A2416"; // raíz chamuscada

export const PxDoseScale: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "La dosis justa" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // entrada general
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // El brazo empieza equilibrado y el lado "de más" se HUNDE con rebote (spring).
  const tipT = spring({ frame: frame - sec(1.1), fps, config: { damping: 12, mass: 1.1, stiffness: 60 } });
  // clímax: a los ~2.4s un golpe de brasas más fuerte
  const climax = spring({ frame: frame - sec(2.4), fps, config: { damping: 14, mass: 0.8, stiffness: 120 } });

  // idle: micro-oscilación viva de la balanza (determinística)
  const idleTilt = Math.sin(frame / 26) * 0.7 * enter;
  const tiltDeg = idleTilt + tipT * 11; // + = lado derecho (exceso) baja

  // geometría del fulcro
  const fx = 800;
  const fy = 360;
  const armLen = 520;
  const rad = (tiltDeg * Math.PI) / 180;
  const lx = fx - Math.cos(rad) * armLen;
  const ly = fy + Math.sin(rad) * armLen;
  const rx = fx + Math.cos(rad) * armLen;
  const ry = fy - Math.sin(rad) * armLen;

  // los platos cuelgan (siempre verticales) — largo de cadena
  const chain = 150;
  const lpy = ly + chain;
  const rpy = ry + chain;

  // Plato de madera reutilizable
  const Pan: React.FC<{ cx: number; cy: number; ok: boolean }> = ({ cx, cy, ok }) => (
    <g>
      {/* cadenas */}
      <line x1={cx - 88} y1={cy - chain} x2={cx - 70} y2={cy} stroke={BRASS} strokeWidth={3.5} opacity={0.8} />
      <line x1={cx + 88} y1={cy - chain} x2={cx + 70} y2={cy} stroke={BRASS} strokeWidth={3.5} opacity={0.8} />
      <line x1={cx} y1={cy - chain} x2={cx} y2={cy - 6} stroke={BRASS} strokeWidth={2.5} opacity={0.5} />
      {/* punto de anclaje al brazo */}
      <circle cx={cx} cy={cy - chain} r={7} fill={BRASS} />
      {/* plato */}
      <ellipse cx={cx} cy={cy + 14} rx={118} ry={26} fill="#000" opacity={0.16} />
      <ellipse cx={cx} cy={cy} rx={118} ry={30} fill={WOOD} />
      <ellipse cx={cx} cy={cy - 6} rx={118} ry={30} fill={WOOD_LT} />
      <ellipse cx={cx} cy={cy - 8} rx={100} ry={22} fill={WOOD} opacity={0.5} />
      <ellipse cx={cx} cy={cy - 8} rx={118} ry={30} fill="none" stroke="#2a1a0e" strokeWidth={2} opacity={0.4} />
      <circle cx={cx} cy={cy - 8} r={3} fill={ok ? GREEN : EMBER} opacity={0.9} />
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="dose" />
      {/* luz cálida de taller cayendo sobre la balanza */}
      <GodRays x={54} y={-12} angle={18} color="rgba(169,121,74,0.16)" intensity={0.9} rays={6} />
      <PaperGrain opacity={0.1} scale={0.9} />

      {/* título */}
      {title && (
        <div
          style={{
            position: "absolute",
            top: 64,
            width: "100%",
            textAlign: "center",
            opacity: lab(0.2),
            transform: `translateY(${(1 - lab(0.2)) * -14}px)`,
          }}
        >
          <div style={{ fontSize: 62, fontWeight: 800, color: COLORS.text, letterSpacing: 0.5 }}>{title}</div>
          <div style={{ fontSize: 34, fontWeight: 600, color: COLORS.textSoft, marginTop: 2 }}>
            más NO es mejor
          </div>
        </div>
      )}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "94%", maxWidth: 1680, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)` }}>
          <RimLight color={COLORS.amber} spread={22} x={0.62} y={0.28}>
            <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
              {/* ── PIE / COLUMNA de la balanza ── */}
              <g opacity={enter}>
                {/* base */}
                <ellipse cx={fx} cy={800} rx={190} ry={40} fill="#000" opacity={0.14} />
                <ellipse cx={fx} cy={786} rx={180} ry={38} fill={WOOD} />
                <ellipse cx={fx} cy={776} rx={180} ry={38} fill={WOOD_LT} />
                {/* columna */}
                <rect x={fx - 26} y={fy + 8} width={52} height={780 - fy - 8 + 30} rx={14} fill={WOOD} />
                <rect x={fx - 26} y={fy + 8} width={20} height={780 - fy - 8 + 30} rx={10} fill={WOOD_LT} opacity={0.7} />
                {/* veta */}
                <path d={`M ${fx - 8} ${fy + 40} q 6 200 -2 380`} stroke="#2a1a0e" strokeWidth={2} fill="none" opacity={0.3} />
              </g>

              {/* ── BRAZO de la balanza (gira sobre el fulcro) ── */}
              <g style={{ transform: `rotate(${tiltDeg}deg)`, transformOrigin: `${fx}px ${fy}px` }}>
                {/* sombra del brazo */}
                <rect x={fx - armLen} y={fy + 10} width={armLen * 2} height={16} rx={8} fill="#000" opacity={0.12} />
                <rect x={fx - armLen} y={fy - 9} width={armLen * 2} height={18} rx={9} fill={WOOD} />
                <rect x={fx - armLen} y={fy - 9} width={armLen * 2} height={7} rx={4} fill={WOOD_LT} opacity={0.8} />
                {/* topes en las puntas */}
                <circle cx={fx - armLen} cy={fy} r={11} fill={BRASS} />
                <circle cx={fx + armLen} cy={fy} r={11} fill={BRASS} />
                {/* aguja indicadora hacia arriba */}
                <line x1={fx} y1={fy} x2={fx} y2={fy - 92} stroke={BRASS} strokeWidth={5} />
                <polygon points={`${fx - 9},${fy - 88} ${fx + 9},${fy - 88} ${fx},${fy - 108}`} fill={BRASS} />
              </g>

              {/* fulcro (pivote) por encima del brazo */}
              <circle cx={fx} cy={fy} r={20} fill={WOOD_LT} />
              <circle cx={fx} cy={fy} r={20} fill="none" stroke="#2a1a0e" strokeWidth={2} opacity={0.4} />
              <circle cx={fx} cy={fy} r={7} fill={BRASS} />

              {/* escala del indicador: verde a la izquierda, rojo a la derecha */}
              <g opacity={0.55 * enter}>
                <path d={`M ${fx - 70} ${fy - 118} A 100 100 0 0 1 ${fx} ${fy - 138}`} stroke={GREEN} strokeWidth={7} fill="none" strokeLinecap="round" />
                <path d={`M ${fx} ${fy - 138} A 100 100 0 0 1 ${fx + 70} ${fy - 118}`} stroke={EMBER} strokeWidth={7} fill="none" strokeLinecap="round" />
              </g>

              {/* ══════════ PLATO IZQUIERDO — DOSIS JUSTA (sana, verde) ══════════ */}
              <g>
                <Pan cx={lx} cy={lpy} ok />
                {/* frasco medido, chico, tapado — cantidad justa */}
                <g opacity={lab(0.6)} transform={`translate(${lx} ${lpy - 20})`}>
                  <rect x={-26} y={-70} width={52} height={78} rx={10} fill="#cfe0c2" opacity={0.5} stroke={GREEN} strokeWidth={3} />
                  <rect x={-26} y={-30} width={52} height={38} rx={8} fill={GREEN} opacity={0.32} />
                  <rect x={-14} y={-86} width={28} height={20} rx={5} fill={WOOD} />
                  {/* marca de nivel "justo" */}
                  <line x1={-26} y1={-30} x2={26} y2={-30} stroke={GREEN} strokeWidth={2} strokeDasharray="4 4" />
                </g>
                {/* raíz sana de ese lado, respira: burbujitas verdes suaves */}
                <g opacity={lab(0.9)} fill="none" stroke={ROOT} strokeLinecap="round">
                  <path d={`M ${lx} ${lpy + 30} C ${lx - 14} ${lpy + 90}, ${lx - 30} ${lpy + 140}, ${lx - 22} ${lpy + 200}`} strokeWidth={7} />
                  <path d={`M ${lx} ${lpy + 40} C ${lx + 16} ${lpy + 100}, ${lx + 26} ${lpy + 150}, ${lx + 18} ${lpy + 205}`} strokeWidth={6} />
                  <path d={`M ${lx - 12} ${lpy + 130} C ${lx - 34} ${lpy + 156}, ${lx - 42} ${lpy + 184}, ${lx - 40} ${lpy + 214}`} strokeWidth={3.5} opacity={0.85} />
                </g>
                {/* halo verde de vitalidad */}
                <circle cx={lx} cy={lpy + 130} r={70 + Math.sin(frame / 20) * 6} fill={GREEN} opacity={0.08 * lab(0.9)} />
                {/* burbujas de O₂ sanas que suben */}
                {Array.from({ length: 6 }, (_, i) => {
                  const span = 120;
                  const p = ((frame * 1.4 + rand(i, 3) * span) % span) / span;
                  const bx = lx - 40 + rand(i) * 80 + wobble(i, frame, 1.1) * 8;
                  const by = lpy + 200 - p * 150;
                  const br = 6 + (i % 3) * 3;
                  const op = Math.sin(p * Math.PI) * 0.7 * lab(0.9);
                  return (
                    <g key={"lb" + i} opacity={op}>
                      <circle cx={bx} cy={by} r={br} fill={COLORS.cold} opacity={0.5} />
                      <circle cx={bx} cy={by} r={br} fill="none" stroke={COLORS.cold} strokeWidth={2} />
                    </g>
                  );
                })}
              </g>

              {/* ══════════ PLATO DERECHO — DE MÁS (quema, brasas) ══════════ */}
              <g>
                <Pan cx={rx} cy={rpy} ok={false} />
                {/* frasco DESBORDADO — chorrea de más */}
                <g opacity={lab(0.6)} transform={`translate(${rx} ${rpy - 20})`}>
                  <rect x={-30} y={-84} width={60} height={92} rx={10} fill="#e4c7b2" opacity={0.5} stroke={EMBER} strokeWidth={3} />
                  <rect x={-30} y={-58} width={60} height={66} rx={8} fill={EMBER} opacity={0.4} />
                  <rect x={-16} y={-102} width={32} height={22} rx={5} fill={WOOD} />
                  {/* desborde chorreando por el borde */}
                  <path d={`M 30 ${-72} C 42 ${-60}, 44 ${-30}, 40 ${10 + tipT * 20}`} stroke={EMBER} strokeWidth={5} fill="none" opacity={0.7 * tipT} strokeLinecap="round" />
                  <path d={`M -30 ${-72} C -42 ${-58}, -44 ${-26}, -38 ${8 + tipT * 20}`} stroke={EMBER} strokeWidth={4} fill="none" opacity={0.6 * tipT} strokeLinecap="round" />
                </g>
                {/* raíz de ese lado: los pelitos se CHAMUSCAN (interpolan a char) */}
                {(() => {
                  const burn = interpolate(tipT, [0, 1], [0, 1]);
                  const rootCol = interpolateColor(ROOT, CHAR, burn);
                  return (
                    <g opacity={lab(0.9)} fill="none" stroke={rootCol} strokeLinecap="round">
                      <path d={`M ${rx} ${rpy + 30} C ${rx + 14} ${rpy + 90}, ${rx + 30} ${rpy + 140}, ${rx + 22} ${rpy + 200}`} strokeWidth={7} />
                      <path d={`M ${rx} ${rpy + 40} C ${rx - 16} ${rpy + 100}, ${rx - 26} ${rpy + 150}, ${rx - 18} ${rpy + 205}`} strokeWidth={6} />
                      {/* pelitos radiculares que se retuercen/queman */}
                      {Array.from({ length: 7 }, (_, i) => {
                        const ang = -0.7 + i * 0.2;
                        const px = rx - 30 + i * 10;
                        const py = rpy + 120 + (i % 3) * 22;
                        const curl = burn * (6 + (i % 2) * 5) * Math.sin(frame / 8 + i);
                        return (
                          <path
                            key={"hair" + i}
                            d={`M ${px} ${py} q ${Math.cos(ang) * 20 + curl} ${18} ${Math.cos(ang) * 30} ${34}`}
                            strokeWidth={2.5}
                            opacity={0.85 - burn * 0.3}
                          />
                        );
                      })}
                    </g>
                  );
                })()}
                {/* resplandor de quemadura + brasas subiendo (embers) */}
                <circle cx={rx} cy={rpy + 130} r={60 + climax * 40 + Math.sin(frame / 9) * 8} fill={EMBER} opacity={(0.1 + climax * 0.12) * lab(0.9)} />
                <g opacity={0.9 * lab(1.0)}>
                  <ParticleFieldLocal cx={rx} cy={rpy + 160} intensity={0.6 + tipT + climax * 0.8} frame={frame} />
                </g>
                {/* humo tenue subiendo del daño */}
                {Array.from({ length: 5 }, (_, i) => {
                  const span = 150;
                  const p = ((frame + rand(i, 7) * span) % span) / span;
                  const sx = rx - 20 + rand(i, 2) * 40 + wobble(i, frame, 0.7) * 22;
                  const sy = rpy + 120 - p * 220;
                  const sr = 14 + p * 40;
                  const op = Math.sin(p * Math.PI) * 0.16 * tipT;
                  return <circle key={"sm" + i} cx={sx} cy={sy} r={sr} fill="#5a4636" opacity={op} />;
                })}
              </g>

              {/* ══════════ ETIQUETAS ══════════ */}
              <g opacity={lab(1.3)} transform={`translate(${lx} ${lpy + 250})`} textAnchor="middle">
                <rect x={-140} y={-42} width={280} height={62} rx={16} fill={GREEN} opacity={0.14} />
                <text y={0} fontSize={40} fontWeight={900} fill={GREEN} fontFamily={FONT_STACK}>Dosis justa</text>
              </g>
              <g opacity={lab(1.6)} transform={`translate(${rx} ${rpy + 250})`} textAnchor="middle">
                <rect x={-120} y={-42} width={240} height={62} rx={16} fill={EMBER} opacity={0.16} />
                <text y={0} fontSize={40} fontWeight={900} fill={EMBER} fontFamily={FONT_STACK}>De más = quema</text>
              </g>
            </svg>
          </RimLight>

          {/* refuerzo de sombra bajo toda la escena para despegarla del papel */}
          <DepthShadow layers={4} distance={30} radius={0} style={{ height: 0 }}>
            <span />
          </DepthShadow>
        </div>
      </AbsoluteFill>

      {/* brasas globales muy sutiles del lado derecho para atmósfera cálida */}
      <div style={{ position: "absolute", left: "52%", top: "40%", width: "34%", height: "48%", opacity: 0.5 * lab(1.0), pointerEvents: "none" }}>
        <ParticleField count={14} kind="embers" rise drift={26} width={600} height={500} opacity={0.7} />
      </div>
    </AbsoluteFill>
  );
};

// ── brasas locales concentradas bajo la raíz quemada (SVG inline, determinístico)
const ParticleFieldLocal: React.FC<{ cx: number; cy: number; intensity: number; frame: number }> = ({ cx, cy, intensity, frame }) => (
  <g>
    {Array.from({ length: 16 }, (_, i) => {
      const span = 90 + Math.floor(rand(i, 1) * 60);
      const p = ((frame + rand(i, 2) * span) % span) / span;
      const bx = cx - 70 + rand(i) * 140 + wobble(i, frame, 1.4) * 18;
      const by = cy - p * 190;
      const r = 3 + rand(i, 4) * 5 * Math.min(1, intensity);
      const life = Math.sin(p * Math.PI) * Math.min(1, intensity);
      return (
        <g key={i} opacity={life * (0.5 + rand(i, 5) * 0.5)}>
          <circle cx={bx} cy={by} r={r} fill={EMBER} opacity={0.7} />
          <circle cx={bx} cy={by} r={r} fill="none" stroke="#E8A15C" strokeWidth={1.5} opacity={0.8} />
        </g>
      );
    })}
  </g>
);

// interpolación de color hex determinística (para el chamuscado de la raíz)
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

export default PxDoseScale;
