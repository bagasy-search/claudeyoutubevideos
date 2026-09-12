import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  ParticleField,
  GodRays,
  PaperGrain,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ── PIEZA ÚNICA (video AGUA OXIGENADA) — momento: la prueba "¿sigue viva?" ─────
// Un chorrito de agua oxigenada cae desde un frasco a una BACHA de metal.
//  · alive=true  → ERUPCIONA en espuma blanca burbujeante; el medidor lateral
//    "REACCIÓN" trepa al máximo (verde) y un cartel confirma "¡Todavía sirve!".
//  · alive=false → el chorro cae y queda PLANO, un charco quieto; el medidor no
//    se mueve (rojo abajo), cartel "Ya no reacciona".
// Metal con RimLight frío-cálido + reflejo, borde de agua ondulado con SvgFilters.
// Marca terrosa-vintage: bacha peltre sepia, espuma crema, verde/óxido de estado.
// Esquina inf-derecha LIBRE para PiP.
// RENDER-SAFE: todo por useCurrentFrame(); azar determinístico por índice.

const METAL = "#8C8A82"; // peltre / estaño
const METAL_LT = "#C9C6BC";
const METAL_DK = "#5C5A54";
const FOAM = "#F3ECDD"; // espuma crema
const GREEN = COLORS.good;
const EMBER = COLORS.danger;
const LIQ = COLORS.cold; // agua/eucalipto

export const PxFizzTest: React.FC<{
  durationInFrames: number;
  alive?: boolean;
  title?: string;
}> = ({ durationInFrames, alive = true, title = "¿Todavía sirve?" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // el chorro empieza a caer ~0.6s
  const pourStart = sec(0.6);
  const impact = sec(1.4); // toca la bacha
  const pour = interpolate(frame - pourStart, [0, sec(0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // reacción: sólo si alive; sube con rebote tras el impacto
  const reactRaw = spring({ frame: frame - impact, fps, config: { damping: 11, mass: 0.9, stiffness: 90 } });
  const react = alive ? reactRaw : reactRaw * 0.06; // muerta = casi plano

  // geometría bacha
  const bx = 800;
  const bTop = 560;
  const bW = 620;
  const bH = 210;

  // medidor
  const gaugeX = 1320;
  const gaugeY = 300;
  const gaugeH = 420;
  const level = react; // 0..1
  const gaugeCol = alive ? (level > 0.6 ? GREEN : COLORS.amber) : EMBER;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="fizz" />
      <GodRays x={40} y={-12} angle={20} color="rgba(169,121,74,0.14)" intensity={0.85} rays={6} />
      <PaperGrain opacity={0.1} scale={0.9} />

      {title && (
        <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", opacity: lab(0.2), transform: `translateY(${(1 - lab(0.2)) * -14}px)` }}>
          <div style={{ fontSize: 62, fontWeight: 800, color: COLORS.text }}>{title}</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: COLORS.textSoft, marginTop: 2 }}>
            la prueba de la bacha
          </div>
        </div>
      )}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "94%", maxWidth: 1680, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)` }}>
          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            {/* ── FRASCO que vierte (arriba-izq) ── */}
            <g opacity={lab(0.2)} transform="translate(470 150) rotate(30)">
              <rect x={-42} y={-6} width={84} height={150} rx={16} fill="#c9d6cf" opacity={0.45} stroke={LIQ} strokeWidth={3.5} />
              <rect x={-42} y={70} width={84} height={74} rx={14} fill={LIQ} opacity={0.34} />
              <rect x={-22} y={-30} width={44} height={30} rx={7} fill={COLORS.amber} />
              {/* cuello/pico */}
              <path d="M 42 20 L 78 -6 L 92 8 L 54 40 Z" fill="#c9d6cf" opacity={0.5} stroke={LIQ} strokeWidth={3} />
            </g>

            {/* ── CHORRO cayendo ── */}
            {pour > 0 && (
              <g opacity={lab(0.4)}>
                <path
                  d={`M 566 200 C 600 320, 720 420, ${bx - 40} ${bTop - 6}`}
                  stroke={LIQ}
                  strokeWidth={interpolate(pour, [0, 1], [3, 11])}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.55}
                  style={{ filter: "url(#fizz-ripple)" }}
                />
                {/* gotas discretas por el chorro */}
                {Array.from({ length: 6 }, (_, i) => {
                  const span = 30;
                  const p = ((frame + rand(i, 4) * span) % span) / span;
                  const t = p;
                  const dx = interpolate(t, [0, 1], [566, bx - 40]) + wobble(i, frame, 2) * 6;
                  const dy = interpolate(t, [0, 1], [200, bTop - 6]) + Math.sin(t * Math.PI) * -20;
                  return <circle key={"d" + i} cx={dx} cy={dy} r={4 + (i % 2) * 2} fill={LIQ} opacity={0.5 * pour} />;
                })}
              </g>
            )}

            {/* ── BACHA de metal ── */}
            <g opacity={enter}>
              {/* sombra */}
              <ellipse cx={bx} cy={bTop + bH + 20} rx={bW / 2 + 20} ry={40} fill="#000" opacity={0.14} />
              {/* cuerpo */}
              <defs>
                <linearGradient id="metalBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={METAL_LT} />
                  <stop offset="45%" stopColor={METAL} />
                  <stop offset="100%" stopColor={METAL_DK} />
                </linearGradient>
                <radialGradient id="metalInner" cx="50%" cy="30%">
                  <stop offset="0%" stopColor={METAL_DK} />
                  <stop offset="100%" stopColor="#3f3e3a" />
                </radialGradient>
              </defs>
              <path
                d={`M ${bx - bW / 2} ${bTop} L ${bx - bW / 2 + 40} ${bTop + bH} L ${bx + bW / 2 - 40} ${bTop + bH} L ${bx + bW / 2} ${bTop} Z`}
                fill="url(#metalBody)"
              />
              {/* boca elíptica interior */}
              <ellipse cx={bx} cy={bTop} rx={bW / 2} ry={54} fill="url(#metalInner)" />
              <ellipse cx={bx} cy={bTop} rx={bW / 2} ry={54} fill="none" stroke={METAL_LT} strokeWidth={5} opacity={0.8} />
              {/* reflejo del borde */}
              <path d={`M ${bx - bW / 2 + 30} ${bTop - 8} A ${bW / 2 - 30} 48 0 0 1 ${bx + 40} ${bTop - 46}`} stroke={METAL_LT} strokeWidth={6} fill="none" opacity={0.7} strokeLinecap="round" />
            </g>

            {/* ── LÍQUIDO / ESPUMA dentro de la bacha ── */}
            {(() => {
              // nivel del líquido base
              const baseLvl = bTop + 30;
              // altura de espuma según reacción
              const foamH = alive ? interpolate(react, [0, 1], [0, 150]) : 6;
              const surfaceY = baseLvl - foamH * 0.4;
              // superficie ondulada
              const waves = Array.from({ length: 9 }, (_, i) => {
                const wx = bx - bW / 2 + 40 + (i / 8) * (bW - 80);
                const wy = surfaceY + Math.sin(frame / 8 + i) * (alive ? 6 * react : 1.5);
                return `${i === 0 ? "M" : "L"} ${wx} ${wy}`;
              }).join(" ");
              return (
                <g opacity={lab(0.5)} clipPath="none">
                  {/* charco base */}
                  <path
                    d={`${waves} L ${bx + bW / 2 - 42} ${bTop + bH - 6} L ${bx - bW / 2 + 42} ${bTop + bH - 6} Z`}
                    fill={LIQ}
                    opacity={0.4}
                    style={{ filter: "url(#fizz-ripple)" }}
                  />
                  {/* ESPUMA (solo viva): montículo de burbujas que erupciona */}
                  {alive && react > 0.02 && (
                    <g>
                      {/* domo de espuma */}
                      <ellipse cx={bx} cy={surfaceY} rx={interpolate(react, [0, 1], [80, bW / 2 - 60])} ry={interpolate(react, [0, 1], [10, foamH])} fill={FOAM} opacity={0.9} />
                      {/* burbujas de espuma apiladas (determinístico) */}
                      {Array.from({ length: 46 }, (_, i) => {
                        const span = 60 + Math.floor(rand(i, 1) * 40);
                        const p = ((frame + rand(i, 2) * span) % span) / span;
                        const spread = interpolate(react, [0, 1], [60, bW / 2 - 70]);
                        const fx = bx + (rand(i, 6) - 0.5) * 2 * spread + wobble(i, frame, 1.6) * 8;
                        const rise = p * foamH * (0.7 + rand(i, 8) * 0.9);
                        const fy = surfaceY - rise;
                        const fr = (3 + rand(i, 4) * 9) * Math.min(1, react * 1.2);
                        const op = Math.sin(p * Math.PI) * 0.9 * react;
                        return (
                          <g key={"f" + i} opacity={op}>
                            <circle cx={fx} cy={fy} r={fr} fill={FOAM} opacity={0.85} />
                            <ellipse cx={fx - fr * 0.3} cy={fy - fr * 0.3} rx={fr * 0.35} ry={fr * 0.25} fill="#fff" opacity={0.7} />
                          </g>
                        );
                      })}
                      {/* chisporroteo de O₂ saltando por encima */}
                      {Array.from({ length: 14 }, (_, i) => {
                        const span = 46;
                        const p = ((frame + rand(i, 9) * span) % span) / span;
                        const jx = bx + (rand(i, 3) - 0.5) * 2 * (bW / 2 - 90);
                        const jy = surfaceY - p * (60 + rand(i, 5) * 90) * react;
                        const jr = 3 + (i % 3) * 2;
                        const op = Math.sin(p * Math.PI) * 0.8 * react;
                        return (
                          <g key={"j" + i} opacity={op}>
                            <circle cx={jx} cy={jy} r={jr} fill={LIQ} opacity={0.55} />
                            <circle cx={jx} cy={jy} r={jr} fill="none" stroke={LIQ} strokeWidth={1.5} />
                          </g>
                        );
                      })}
                    </g>
                  )}
                  {/* muerta: superficie quieta, un par de motas hundidas, cero acción */}
                  {!alive && (
                    <g opacity={0.6}>
                      <ellipse cx={bx} cy={surfaceY} rx={bW / 2 - 80} ry={7} fill={FOAM} opacity={0.18} />
                      {Array.from({ length: 5 }, (_, i) => (
                        <circle key={"dead" + i} cx={bx - 160 + i * 80} cy={surfaceY + 4} r={4} fill={METAL_DK} opacity={0.4} />
                      ))}
                    </g>
                  )}
                </g>
              );
            })()}

            {/* ── MEDIDOR de REACCIÓN (lateral) ── */}
            <g opacity={lab(0.8)}>
              {/* carcasa */}
              <rect x={gaugeX - 6} y={gaugeY - 6} width={72} height={gaugeH + 12} rx={20} fill={COLORS.bg2} />
              <rect x={gaugeX} y={gaugeY} width={60} height={gaugeH} rx={16} fill="#2a2620" opacity={0.16} />
              {/* relleno desde abajo */}
              <rect
                x={gaugeX}
                y={gaugeY + gaugeH - gaugeH * level}
                width={60}
                height={gaugeH * level}
                rx={16}
                fill={gaugeCol}
                opacity={0.85}
              />
              {/* marcas */}
              {Array.from({ length: 6 }, (_, i) => {
                const y = gaugeY + (i / 5) * gaugeH;
                return <line key={"tk" + i} x1={gaugeX - 14} y1={y} x2={gaugeX} y2={y} stroke={COLORS.textDim} strokeWidth={3} />;
              })}
              {/* aguja de tope */}
              <g transform={`translate(${gaugeX + 30} ${gaugeY + gaugeH - gaugeH * level})`}>
                <polygon points="-46,0 -22,-11 -22,11" fill={gaugeCol} />
              </g>
              {/* etiqueta del medidor */}
              <text x={gaugeX + 30} y={gaugeY - 22} fontSize={30} fontWeight={900} fill={COLORS.text} fontFamily={FONT_STACK} textAnchor="middle">
                REACCIÓN
              </text>
            </g>

            {/* ── CARTEL de veredicto ── */}
            <g opacity={lab(alive ? 1.7 : 1.5)} transform={`translate(${bx} ${bTop + bH + 100})`} textAnchor="middle">
              <rect x={-260} y={-46} width={520} height={76} rx={20} fill={alive ? GREEN : EMBER} opacity={0.16} />
              <text y={6} fontSize={46} fontWeight={900} fill={alive ? GREEN : EMBER} fontFamily={FONT_STACK}>
                {alive ? "¡Todavía sirve!" : "Ya no reacciona"}
              </text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      {/* niebla de micro-gotas sobre la bacha cuando erupciona (atmósfera) */}
      {alive && (
        <div style={{ position: "absolute", left: "34%", top: "42%", width: "36%", height: "30%", opacity: 0.6 * react, pointerEvents: "none" }}>
          <ParticleField count={20} kind="bubbles" rise drift={30} width={600} height={400} opacity={0.7} />
        </div>
      )}
    </AbsoluteFill>
  );
};

export default PxFizzTest;
