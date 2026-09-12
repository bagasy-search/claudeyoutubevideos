import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParticleField,
  GodRays,
  DepthShadow,
  WaxSeal,
  RimLight,
  PaperGrain,
  SvgFilters,
  InkDraw,
  rand,
  wobble,
} from "./depth";

// ─────────────────────────────────────────────────────────────────────────────
// PxMythStamp — PIEZA ÚNICA para el momento "los 3 mitos" del agua oxigenada.
// Tres afirmaciones escritas a pluma (InkDraw las subraya) sobre una hoja de
// pergamino; una por una baja un SELLO DE LACRE (WaxSeal) que IMPACTA con rebote y
// estampa "MITO" en tinta rugosa con relieve/emboss, mientras salta polvo del golpe.
// Secuencial y escalonado: mito 1 → 2 → 3, con THUMP en cada estampa.
//
// Marca terrosa-vintage: pergamino, serif, lacre terracota, sepia. Esquina inf-der libre.
// PROFUNDIDAD: DepthShadow bajo la hoja, GodRays, PaperGrain, lacre con emboss +
// rim-light, ParticleField + burst de polvo por estampa. RENDER-SAFE: todo desde
// useCurrentFrame() (spring/interpolate). Azar determinístico por índice (rand/wobble).
// ─────────────────────────────────────────────────────────────────────────────

const SEAL = COLORS.danger; // lacre = terracota faded
const INK = COLORS.ink;

export const PxMythStamp: React.FC<{
  durationInFrames: number;
  myths?: [string, string, string] | string[];
  title?: string;
}> = ({
  durationInFrames,
  myths = [
    "Reemplaza el riego",
    "Sirve como fertilizante",
    "Cuanto más, mejor",
  ],
  title = "3 mitos",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const three = (myths.length >= 3 ? myths.slice(0, 3) : [...myths, "", ""].slice(0, 3)) as string[];

  // frames de estampado escalonados (determinísticos)
  const FIRST = 44;
  const GAP = 46;
  const stampAt = [FIRST, FIRST + GAP, FIRST + GAP * 2];

  const rowY = [190, 372, 554]; // y de cada fila dentro de la hoja SVG (viewBox 1200x760)

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="myth" />
      <TechBackground glowX={50} glowY={30} hue="red" drift={0.3} />
      <GodRays x={60} y={-16} angle={22} color="rgba(176,80,60,0.12)" intensity={1} rays={6} />
      <ParticleField count={14} kind="dust" rise drift={20} opacity={0.32} />
      <SfxCue at={2} src={SFX.whoosh} volume={0.3} />
      {stampAt.map((at, i) => (
        <React.Fragment key={"sfx" + i}>
          <SfxCue at={at} src={SFX.boom1} volume={0.42} />
          <SfxCue at={at + 1} src={SFX.textSlam} volume={0.3} />
        </React.Fragment>
      ))}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "80%", maxWidth: 1280, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)` }}>
          {/* título */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ letterSpacing: 6, fontSize: 21, fontWeight: 700, textTransform: "uppercase", color: SEAL }}>
              lo que NO hace el agua oxigenada
            </div>
            <div style={{ fontSize: 60, fontWeight: 800, color: COLORS.text, marginTop: 2 }}>{title}</div>
          </div>

          {/* ── HOJA DE PERGAMINO con las 3 afirmaciones ── */}
          <DepthShadow
            layers={6}
            distance={40}
            radius={22}
            color="rgba(42,38,32,0.16)"
            style={{
              background: "linear-gradient(160deg, #F4ECD6 0%, #E7DABC 100%)",
              border: "2px solid rgba(42,38,32,0.18)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* textura de líneas de renglón + grano dentro de la hoja */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "repeating-linear-gradient(0deg, rgba(42,38,32,0.04) 0 1px, transparent 1px 46px)",
                pointerEvents: "none",
              }}
            />

            <svg viewBox="0 0 1200 760" width="100%" style={{ display: "block", overflow: "visible" }}>
              {three.map((m, i) => {
                const at = stampAt[i];
                const y = rowY[i];
                const s = spring({ frame: frame - at, fps, config: { damping: 9, mass: 0.9, stiffness: 190 } });
                const appear = spring({ frame: frame - (at - 24), fps, config: { damping: 200, mass: 1, stiffness: 70 } });
                const rot = i % 2 === 0 ? -7 : 6; // inclinación del sello estampado
                const impact = interpolate(frame - at, [-2, 0, 4], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const squash = interpolate(frame - at, [0, 4, 12, 20], [0, 5, -2, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const burst = interpolate(frame - at, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const stamped = frame >= at;

                return (
                  <g key={i} transform={`translate(0 ${squash})`}>
                    {/* número de mito en círculo */}
                    <g opacity={appear}>
                      <circle cx={92} cy={y} r={34} fill={SEAL} opacity={0.14} />
                      <circle cx={92} cy={y} r={34} fill="none" stroke={SEAL} strokeWidth={3} opacity={0.7} />
                      <text x={92} y={y + 13} fontSize={40} fontWeight={900} fill={SEAL} fontFamily={FONT_STACK} textAnchor="middle">{i + 1}</text>
                    </g>

                    {/* afirmación escrita a pluma */}
                    <text
                      x={158}
                      y={y + 14}
                      fontSize={44}
                      fontWeight={700}
                      fill={INK}
                      fontFamily={FONT_STACK}
                      opacity={appear}
                      style={{
                        textDecoration: stamped ? "line-through" : "none",
                      } as React.CSSProperties}
                    >
                      «{m}»
                    </text>

                    {/* subrayado a pluma bajo la afirmación (InkDraw) */}
                    <InkDraw
                      d={`M 158 ${y + 30} C 400 ${y + 24}, 700 ${y + 36}, 920 ${y + 28}`}
                      at={at - 22}
                      duration={18}
                      color={INK}
                      width={3}
                      length={800}
                    />

                    {/* ── SELLO "MITO" estampado en tinta rugosa (rotado, emboss) ── */}
                    {stamped && (
                      <g
                        transform={`translate(760 ${y}) rotate(${rot}) scale(${0.55 + Math.min(1, s) * 0.45})`}
                        opacity={interpolate(s, [0, 0.15], [0, 1], { extrapolateRight: "clamp" })}
                      >
                        <rect x={-118} y={-46} width={236} height={92} rx={14} fill="none" stroke={SEAL} strokeWidth={7} filter="url(#myth-rough)" />
                        <rect x={-108} y={-38} width={216} height={76} rx={10} fill={SEAL} opacity={0.1} />
                        <text x={0} y={22} fontSize={62} fontWeight={900} fill={SEAL} fontFamily={FONT_STACK} textAnchor="middle" letterSpacing={4} filter="url(#myth-rough)">
                          MITO
                        </text>
                      </g>
                    )}

                    {/* halo de impacto */}
                    {impact > 0 && (
                      <circle cx={760} cy={y} r={90 + impact * 40} fill="none" stroke={SEAL} strokeWidth={4} opacity={impact * 0.6} />
                    )}

                    {/* burst de polvo/tinta del golpe (determinístico por índice) */}
                    {burst > 0 && Array.from({ length: 18 }, (_, k) => {
                      const idx = i * 20 + k;
                      const a = rand(idx) * Math.PI * 2;
                      const dist = burst * (50 + rand(idx, 1) * 190);
                      const ox = 760 + Math.cos(a) * dist + wobble(idx, frame, 2) * 5;
                      const oy = y + Math.sin(a) * dist * 0.7 + burst * burst * 46;
                      const r = 2 + rand(idx, 2) * 5;
                      const op = interpolate(burst, [0, 0.15, 1], [0, 0.7, 0]) * (0.5 + rand(idx, 3) * 0.5);
                      return <circle key={k} cx={ox} cy={oy} r={r} fill={k % 3 === 0 ? SEAL : COLORS.amber} opacity={op} />;
                    })}
                  </g>
                );
              })}
            </svg>
          </DepthShadow>
        </div>
      </AbsoluteFill>

      {/* ── el SELLO DE LACRE físico que baja e impacta (acompaña la última estampa) ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(180px, -30px)" }}>
          <RimLight color={SEAL} spread={20} x={0.6} y={0.2}>
            <WaxSeal at={stampAt[0]} size={132} color={SEAL} initials="✕" />
          </RimLight>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default PxMythStamp;
