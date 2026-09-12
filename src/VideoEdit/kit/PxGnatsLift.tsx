import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  RimLight,
  DepthShadow,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxGnatsLift — PIEZA ÚNICA · truco 6 del video de AGUA OXIGENADA en la huerta:
// "el problema está ABAJO". La costra de tierra se levanta como una TAPA (peel 3D
// vía Frame3D con bisagra a la izquierda) y revela el mundo subterráneo: larvas
// de mosquito del sustrato (fungus gnats) retorciéndose entre las raíces. Cae el
// empape de peróxido (burbujas de O₂ subiendo) y la NUBE de mosquitos que revolotea
// arriba se ADELGAZA hasta casi desaparecer, mientras las larvas se disuelven.
//
// PROFUNDIDAD REAL: 3 planos con parallax (nube lejana · tapa que se pela · cámara
// subterránea), god-rays cálidos de taller, rim-light en la tapa levantada,
// partículas de esporas/polvo, refracción SVG del empape, física de resorte en el
// peel y en el asentado de la costra. Esquina inf-derecha libre para el avatar PiP.
//
// RENDER-SAFE: cero Date.now / Math.random / new Date. Todo deriva de
// useCurrentFrame(); el "azar" es determinístico por índice (rand/wobble).
// 1920×1080. Texto ES por props con DEFAULT.
// ═══════════════════════════════════════════════════════════════════════════

const SOIL_TOP = "#4a3826";
const SOIL_DEEP = "#2a1e12";
const SOIL_FACE = "#3a2b1c";
const ROOT = "#EDE4CE";
const LARVA = "#C7B98F";
const O2 = COLORS.cold;
const GNAT = "#2A2620";

export const PxGnatsLift: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "El problema está abajo" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── fases temporizadas ─────────────────────────────────────────────────────
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  // el peel de la tapa: empieza a ~0.7s, bisagra a la izquierda
  const peel = spring({ frame: frame - sec(0.7), fps, config: { damping: 15, mass: 1.1, stiffness: 90 } });
  const peelAngle = interpolate(peel, [0, 1], [0, -74]); // grados hacia el observador
  // el empape (gota + burbujas) entra a ~2.2s → arranca el clímax
  const soak = spring({ frame: frame - sec(2.2), fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  // la nube de mosquitos se adelgaza conforme avanza el empape
  const gnatDensity = interpolate(soak, [0, 1], [1, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // las larvas se disuelven con el empape
  const larvaLife = interpolate(soak, [0.15, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  const groundY = 360; // línea donde se abre la tapa

  const Label: React.FC<{ x: number; y: number; text: string; at: number; color?: string; anchor?: "start" | "middle" | "end"; size?: number }> = ({ x, y, text, at, color = COLORS.text, anchor = "middle", size = 38 }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor}>
        <text fontSize={size} fontWeight={900} fill={color} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 7 }}>{text}</text>
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <SvgFilters prefix="gnats" />
      <TechBackground glowX={44} glowY={22} hue="amber" drift={0.35} />
      <GodRays x={64} y={-12} angle={20} intensity={0.9} rays={7} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
      <SfxCue at={sec(0.7)} src={SFX.popUp} volume={0.35} />
      <SfxCue at={sec(2.2)} src={SFX.whoosh} volume={0.3} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)`, fontFamily: FONT_STACK }}>
          {title && (
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 52, fontWeight: 800, color: COLORS.text }}>{title}</div>
            </div>
          )}

          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            {/* ═══ PLANO LEJANO · la NUBE de mosquitos revoloteando sobre la maceta ═══ */}
            <g opacity={enter}>
              {Array.from({ length: 34 }, (_, i) => {
                const alive = rand(i, 9) < gnatDensity; // se van adelgazando
                const fade = interpolate(gnatDensity, [0, 1], [0, 1]);
                const gx = 300 + rand(i) * 900 + wobble(i, frame, 2.4) * 26;
                const gy = 90 + rand(i, 2) * 200 + Math.cos(frame / 9 + i) * 18;
                const buzz = 3 + rand(i, 4) * 3;
                return (
                  <g key={"gn" + i} opacity={(alive ? 1 : 0) * fade * 0.85}>
                    <ellipse cx={gx} cy={gy} rx={buzz} ry={buzz * 0.5} fill={GNAT} opacity={0.8} transform={`rotate(${wobble(i, frame, 3) * 30} ${gx} ${gy})`} />
                    <line x1={gx - buzz} y1={gy} x2={gx - buzz * 2.4} y2={gy - buzz} stroke={GNAT} strokeWidth={1} opacity={0.4} />
                    <line x1={gx + buzz} y1={gy} x2={gx + buzz * 2.4} y2={gy - buzz} stroke={GNAT} strokeWidth={1} opacity={0.4} />
                  </g>
                );
              })}
            </g>

            {/* ═══ SUBSUELO REVELADO (bajo la tapa): raíces + larvas retorciéndose ═══ */}
            {/* solo visible una vez que la tapa empieza a pelarse */}
            <g opacity={interpolate(peel, [0, 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              {/* pared de tierra excavada */}
              <rect x={0} y={groundY} width={1600} height={900 - groundY} fill={SOIL_DEEP} />
              <rect x={0} y={groundY} width={1600} height={900 - groundY} fill={SOIL_FACE} opacity={0.5} filter="url(#gnats-rough)" />
              {/* granos de tierra determinísticos */}
              {Array.from({ length: 50 }, (_, i) => (
                <circle key={"gr" + i} cx={rand(i) * 1600} cy={groundY + 20 + rand(i, 3) * (860 - groundY)} r={2 + (i % 3)} fill="#1d160d" opacity={0.5} />
              ))}
              {/* raíces blancas que bajan */}
              <g fill="none" stroke={ROOT} strokeLinecap="round" opacity={0.9}>
                <path d={`M 640 ${groundY} C 620 ${groundY + 110}, 560 ${groundY + 190}, 520 ${groundY + 320}`} strokeWidth={9} />
                <path d={`M 780 ${groundY} C 800 ${groundY + 120}, 860 ${groundY + 200}, 900 ${groundY + 330}`} strokeWidth={9} />
                <path d={`M 710 ${groundY} C 710 ${groundY + 130}, 700 ${groundY + 240}, 706 ${groundY + 360}`} strokeWidth={8} />
                <path d={`M 560 ${groundY + 180} C 530 ${groundY + 210}, 512 ${groundY + 250}, 508 ${groundY + 300}`} strokeWidth={4} opacity={0.8} />
                <path d={`M 850 ${groundY + 190} C 882 ${groundY + 220}, 900 ${groundY + 262}, 902 ${groundY + 312}`} strokeWidth={4} opacity={0.8} />
              </g>

              {/* LARVAS de mosquito del sustrato — se retuercen y se disuelven con el empape */}
              {Array.from({ length: 9 }, (_, i) => {
                const lx = 420 + rand(i, 5) * 820;
                const ly = groundY + 120 + rand(i, 6) * 300;
                const squirm = wobble(i, frame, 3.2) * 10 * larvaLife;
                const len = 46 + rand(i, 7) * 22;
                const seg = 6;
                const pts = Array.from({ length: seg }, (_, k) => {
                  const t = k / (seg - 1);
                  const bx = lx + t * len;
                  const by = ly + Math.sin(t * Math.PI * 1.6 + frame / 6 + i) * (8 * larvaLife);
                  return `${k === 0 ? "M" : "L"} ${bx} ${by}`;
                }).join(" ");
                return (
                  <g key={"lv" + i} opacity={larvaLife} transform={`translate(${squirm} 0)`}>
                    <path d={pts} fill="none" stroke={LARVA} strokeWidth={11} strokeLinecap="round" opacity={0.9} />
                    <path d={pts} fill="none" stroke="#8a7a50" strokeWidth={4} strokeLinecap="round" opacity={0.5} />
                    <circle cx={lx} cy={ly + Math.sin(frame / 6 + i) * (8 * larvaLife)} r={7} fill={GNAT} opacity={0.75} />
                    {/* halo de "se disuelve" al final */}
                    {larvaLife < 0.6 && <circle cx={lx + len / 2} cy={ly} r={30 * (1 - larvaLife)} fill="none" stroke={O2} strokeWidth={3} opacity={(1 - larvaLife) * 0.6} />}
                  </g>
                );
              })}

              {/* EMPAPE de peróxido: burbujas de O₂ subiendo (clímax) — refracción SVG */}
              <g filter="url(#gnats-ripple)">
                {Array.from({ length: 22 }, (_, i) => {
                  const span = 120 + Math.floor(rand(i, 1) * 90);
                  const p = ((frame + rand(i, 2) * span) % span) / span;
                  const bx = 360 + rand(i) * 900 + wobble(i, frame, 1.4) * 14;
                  const baseY = groundY + 120 + rand(i, 3) * 340;
                  const by = baseY - p * 200 * soak;
                  const br = 6 + rand(i, 4) * 10;
                  const op = Math.sin(p * Math.PI) * 0.85 * soak;
                  return (
                    <g key={"o2" + i} opacity={op}>
                      <circle cx={bx} cy={by} r={br} fill={O2} opacity={0.45} />
                      <circle cx={bx} cy={by} r={br} fill="none" stroke={O2} strokeWidth={2.5} />
                      <ellipse cx={bx - br * 0.3} cy={by - br * 0.3} rx={br * 0.34} ry={br * 0.24} fill="#fff" opacity={0.5} />
                    </g>
                  );
                })}
              </g>
            </g>

            {/* ═══ ETIQUETAS del subsuelo ═══ */}
            <Label x={470} y={groundY + 90} text="Larvas en el sustrato" at={1.2} color={LARVA} anchor="start" size={38} />
            <Label x={430} y={840} text="El empape las elimina" at={2.6} color={O2} anchor="start" size={38} />
          </svg>
        </div>
      </AbsoluteFill>

      {/* ═══ LA TAPA que se PELA — plano frontal 3D, bisagra izquierda ═══ */}
      {/* Se coloca como capa HTML por encima del svg para el rotateX real con perspectiva. */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: "4%", right: "8%", top: "34%", height: "10%", perspective: 1400 }}>
          <RimLight color={COLORS.amber} spread={30} x={0.7} y={0.15}>
            <DepthShadow layers={5} distance={40} radius={8} color="rgba(20,14,8,0.5)">
              <div
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 8,
                  transformOrigin: "left center",
                  transform: `rotateX(${peelAngle}deg)`,
                  transformStyle: "preserve-3d",
                  background: `linear-gradient(160deg, ${SOIL_TOP} 0%, ${SOIL_FACE} 60%, ${SOIL_DEEP} 100%)`,
                  boxShadow: "inset 0 6px 14px rgba(255,255,255,0.06), inset 0 -10px 20px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                }}
              >
                {/* costra de tierra con grietas (determinística) */}
                <svg viewBox="0 0 1600 120" width="100%" height="100%" preserveAspectRatio="none">
                  {Array.from({ length: 60 }, (_, i) => (
                    <circle key={"c" + i} cx={rand(i) * 1600} cy={rand(i, 2) * 120} r={2 + (i % 4)} fill="#1d160d" opacity={0.4} />
                  ))}
                  {Array.from({ length: 6 }, (_, i) => {
                    const x0 = 120 + i * 250;
                    return <path key={"cr" + i} d={`M ${x0} 0 C ${x0 + 30} 40, ${x0 - 20} 70, ${x0 + 10} 120`} stroke="#140d06" strokeWidth={3} fill="none" opacity={0.5} />;
                  })}
                  {/* pastito seco en el borde superior de la tapa */}
                  {Array.from({ length: 40 }, (_, i) => {
                    const gx = 40 + rand(i, 5) * 1520;
                    return <line key={"bl" + i} x1={gx} y1={6} x2={gx + wobble(i, frame, 1.5) * 6} y2={-18} stroke={COLORS.good} strokeWidth={2.5} opacity={0.7} />;
                  })}
                </svg>
              </div>
            </DepthShadow>
          </RimLight>
        </div>
      </AbsoluteFill>

      {/* esporas/polvo cálido flotando en el aire para densidad atmosférica */}
      <ParallaxLayer depth={0.85} driftY={16} driftX={26}>
        <ParticleField count={16} kind="spores" rise={false} drift={26} opacity={0.4 * enter} />
      </ParallaxLayer>

      <PaperGrain opacity={0.1} />
    </AbsoluteFill>
  );
};

export default PxGnatsLift;
