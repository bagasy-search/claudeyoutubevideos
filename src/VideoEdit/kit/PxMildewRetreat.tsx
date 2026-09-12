import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  GodRays,
  RimLight,
  DepthShadow,
  InkDraw,
  SvgFilters,
  PaperGrain,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxMildewRetreat — PIEZA ÚNICA (video AGUA OXIGENADA · truco 4).
// MOMENTO: "el hongo retrocede". Una hoja verde ocupa el centro; el OÍDIO
// (mildiu polvoriento blanco) avanza desde el borde como una mancha de
// feTurbulence cuya cobertura crece. Entonces llega la PULVERIZACIÓN de peróxido
// (abanico de gotitas) y el hongo se DISUELVE: la máscara de turbulencia se
// retrae hacia el borde y la hoja recupera su verde. La niebla del spray flota.
// PISO SUPERADO: PeroxidoDiagram. Acá el hongo es una máscara real de turbulencia
// (no círculos), avanza y se retira, y el spray es un abanico con física.
// RENDER-SAFE: cero Date.now/Math.random/new Date. Todo desde useCurrentFrame();
// azar determinístico por índice. Esquina inf-der libre para el avatar PiP.
// ═══════════════════════════════════════════════════════════════════════════

const LEAF_DK = "#3d5a2a";
const LEAF_MD = COLORS.good;
const LEAF_LT = "#8FAE63";
const VEIN = "#2b3f1c";
const MILDEW = "#EDE7DA"; // polvo blanco-crema del oídio
const SPRAY = "#DCEFE6"; // peróxido pulverizado

export const PxMildewRetreat: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
}> = ({
  durationInFrames,
  title = "El hongo retrocede",
  subtitle = "La pulverización disuelve el oídio",
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const acc = accent ?? COLORS.accent;

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) =>
    spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // ── timeline ──────────────────────────────────────────────────────────
  const F_SPREAD = sec(0.4); // el hongo empieza a avanzar
  const F_SPRAY = sec(2.2); // llega el spray
  const F_CLEAR = sec(2.6); // el hongo empieza a disolverse

  // avance del hongo: 0 → 1 (cobertura máxima) antes del spray
  const invade = interpolate(frame - F_SPREAD, [0, sec(1.8)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // retirada del hongo tras el spray: 1 → 0
  const retreat = spring({
    frame: frame - F_CLEAR,
    fps,
    config: { damping: 20, mass: 1, stiffness: 55 },
  });
  // cobertura efectiva del oídio (avanza y luego se retira)
  const coverage = invade * (1 - retreat);

  // fuerza del spray (abanico): pico al llegar, luego sostiene y baja
  const spray = interpolate(
    frame - F_SPRAY,
    [0, 8, 70, 110],
    [0, 1, 0.9, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // umbral de la máscara de turbulencia: coverage alto → deja pasar más "polvo"
  const maskThreshold = interpolate(coverage, [0, 1], [0.86, 0.32]);
  // semilla que corre (sin new Date) para que el polvo hierva sutil
  const turbSeed = 5 + (frame % 120);
  const cx = 640;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <SvgFilters prefix="pxmil" />

      {/* luz cálida suave arriba-izq */}
      <ParallaxLayer depth={0.22} driftY={12}>
        <GodRays x={26} y={-16} angle={18} color="rgba(124,138,90,0.14)" rays={6} intensity={0.85} />
      </ParallaxLayer>

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: "94%",
            maxWidth: 1680,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 26}px)`,
            fontFamily: FONT_STACK,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 54, fontWeight: 800, color: COLORS.text, letterSpacing: 0.3 }}>
              {title}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.textSoft, marginTop: 2 }}>
              {subtitle}
            </div>
          </div>

          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            <defs>
              <linearGradient id="pxmil-leaf" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={LEAF_LT} />
                <stop offset="50%" stopColor={LEAF_MD} />
                <stop offset="100%" stopColor={LEAF_DK} />
              </linearGradient>
              {/* máscara de HONGO: turbulencia recortada a la hoja; el umbral y la
                  amplitud del displacement crecen con la cobertura */}
              <filter id="pxmil-fungus" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={interpolate(coverage, [0, 1], [0.05, 0.022])}
                  numOctaves={4}
                  seed={turbSeed}
                  stitchTiles="stitch"
                  result="n"
                />
                <feColorMatrix
                  in="n"
                  type="matrix"
                  values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${18} ${-18 * maskThreshold}`}
                  result="mask"
                />
                <feComposite in="SourceGraphic" in2="mask" operator="in" />
              </filter>
              {/* niebla del spray */}
              <radialGradient id="pxmil-mist" cx="50%" cy="50%">
                <stop offset="0%" stopColor={SPRAY} stopOpacity={0.55} />
                <stop offset="100%" stopColor={SPRAY} stopOpacity={0} />
              </radialGradient>
              {/* silueta de la hoja como clip para el hongo */}
              <clipPath id="pxmil-leafclip">
                <path d={`M ${cx} 150 C ${cx + 300} 210, ${cx + 360} 520, ${cx + 120} 740 C ${cx + 40} 800, ${cx - 40} 800, ${cx - 120} 740 C ${cx - 360} 520, ${cx - 300} 210, ${cx} 150 Z`} />
              </clipPath>
            </defs>

            {/* ── HOJA verde con nervaduras ── */}
            <g opacity={lab(0.2)}>
              <RimLightSvg />
              <path
                d={`M ${cx} 150 C ${cx + 300} 210, ${cx + 360} 520, ${cx + 120} 740 C ${cx + 40} 800, ${cx - 40} 800, ${cx - 120} 740 C ${cx - 360} 520, ${cx - 300} 210, ${cx} 150 Z`}
                fill="url(#pxmil-leaf)"
                stroke={VEIN}
                strokeWidth={5}
              />
              {/* nervadura central + laterales */}
              <line x1={cx} y1={168} x2={cx} y2={760} stroke={VEIN} strokeWidth={7} opacity={0.7} />
              {Array.from({ length: 6 }, (_, i) => {
                const t = (i + 1) / 7;
                const y = 210 + t * 500;
                const spread = 220 * Math.sin(t * Math.PI);
                return (
                  <g key={"v" + i} stroke={VEIN} strokeWidth={4} opacity={0.5}>
                    <line x1={cx} y1={y} x2={cx - spread} y2={y - 44} />
                    <line x1={cx} y1={y} x2={cx + spread} y2={y - 44} />
                  </g>
                );
              })}
            </g>

            {/* ── HONGO (oídio) recortado a la hoja, con máscara de turbulencia ── */}
            <g clipPath="url(#pxmil-leafclip)" opacity={coverage > 0.001 ? 1 : 0}>
              {/* capa de polvo que llena la silueta; el filtro decide qué se ve */}
              <rect x={cx - 380} y={130} width={760} height={640} fill={MILDEW} filter="url(#pxmil-fungus)" opacity={0.92} />
              {/* frente de avance: pequeñas motas creciendo desde el borde inferior */}
              {Array.from({ length: 26 }, (_, i) => {
                const ang = rand(i, 2) * Math.PI * 2;
                const rad = 120 + rand(i, 3) * 230;
                const px = cx + Math.cos(ang) * rad * 0.9;
                const py = 470 + Math.sin(ang) * rad * 0.8;
                const grow = interpolate(coverage, [rand(i, 4) * 0.6, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const r = grow * (10 + rand(i, 5) * 22);
                return <circle key={"m" + i} cx={px} cy={py} r={r} fill={MILDEW} opacity={0.5 * grow} />;
              })}
            </g>

            {/* ── PULVERIZACIÓN: abanico de gotitas desde arriba-izq del PiP ── */}
            {frame >= F_SPRAY && (
              <g opacity={spray}>
                {/* boquilla (fuera del área del PiP: arriba-derecha) */}
                <g transform="translate(1300 250)">
                  <rect x={-14} y={-20} width={70} height={40} rx={8} fill={COLORS.amber} opacity={0.85} />
                  <rect x={-40} y={-9} width={30} height={18} rx={5} fill={COLORS.text} opacity={0.7} />
                </g>
                {/* cono/abanico de spray hacia la hoja */}
                {Array.from({ length: 46 }, (_, i) => {
                  const span = 26 + Math.floor(rand(i, 6) * 20);
                  const p = ((frame - F_SPRAY + rand(i, 7) * span) % span) / span;
                  // desde la boquilla (1300,250) hacia el centro de la hoja (640,470)
                  const spreadAng = (rand(i, 8) - 0.5) * 0.5;
                  const dirX = -0.72 + spreadAng;
                  const dirY = 0.34 + spreadAng * 0.4;
                  const dist = p * 760;
                  const dx = 1300 + dirX * dist + wobble(i, frame, 2) * 6;
                  const dy = 250 + dirY * dist;
                  const r = 3 + rand(i, 9) * 4;
                  const op = Math.sin(p * Math.PI) * spray * 0.8;
                  return <circle key={"sp" + i} cx={dx} cy={dy} r={r} fill={SPRAY} opacity={op} />;
                })}
                {/* niebla difusa sobre la hoja */}
                <ellipse cx={cx} cy={460} rx={340} ry={300} fill="url(#pxmil-mist)" opacity={spray * 0.7} />
              </g>
            )}

            {/* ── burbujitas donde el peróxido disuelve el hongo ── */}
            {frame >= F_CLEAR && (
              <g clipPath="url(#pxmil-leafclip)">
                {Array.from({ length: 16 }, (_, i) => {
                  const span = 70 + Math.floor(rand(i, 10) * 50);
                  const p = ((frame - F_CLEAR + rand(i, 11) * span) % span) / span;
                  const bx = cx + (rand(i, 12) - 0.5) * 460 + wobble(i, frame, 1.3) * 14;
                  const by = 300 + rand(i, 13) * 360 - p * 60;
                  const br = 5 + rand(i, 14) * 9;
                  const op = Math.sin(p * Math.PI) * retreat * 0.8;
                  return (
                    <g key={"cb" + i} opacity={op}>
                      <circle cx={bx} cy={by} r={br} fill={COLORS.cold} opacity={0.45} />
                      <circle cx={bx} cy={by} r={br} fill="none" stroke={COLORS.cold} strokeWidth={2} />
                    </g>
                  );
                })}
              </g>
            )}

            {/* ── ETIQUETAS ── */}
            <InkDraw
              d={`M 140 420 L 380 470`}
              at={F_SPREAD + 8}
              duration={22}
              color={COLORS.danger}
              width={3}
              length={280}
            />
            <g opacity={lab(0.9) * (1 - retreat * 0.7)} transform="translate(130 410)" textAnchor="end">
              <text fontSize={36} fontWeight={900} fill={COLORS.danger} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>
                Oídio (hongo blanco)
              </text>
            </g>
            <g opacity={lab(3.0) * retreat} transform="translate(1000 700)" textAnchor="middle">
              <text fontSize={40} fontWeight={900} fill={acc} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>
                Hoja limpia
              </text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      {/* ── indicador de cobertura del hongo (card, arriba-izq del PiP) ── */}
      <div style={{ position: "absolute", left: 84, bottom: 96 }}>
        <RimLight color={acc} spread={18} x={0.7} y={0.3}>
          <DepthShadow radius={20} distance={28} style={{ background: "rgba(239,231,211,0.94)", padding: "12px 22px", border: `1px solid ${COLORS.textDim}` }}>
            <div style={{ fontFamily: FONT_STACK, minWidth: 220 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.textSoft, marginBottom: 8 }}>
                Infección en la hoja
              </div>
              <div style={{ position: "relative", height: 16, borderRadius: 8, background: "rgba(42,38,32,0.12)", overflow: "hidden" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${Math.round(coverage * 100)}%`,
                    background: `linear-gradient(90deg, ${COLORS.danger}, ${MILDEW})`,
                    borderRadius: 8,
                    transition: "none",
                  }}
                />
              </div>
            </div>
          </DepthShadow>
        </RimLight>
      </div>

      {/* niebla del spray flotando (partículas) + grano de papel */}
      <ParallaxLayer depth={0.7} driftY={-14}>
        <ParticleField count={14} kind="dust" rise drift={30} opacity={0.35 * spray} color={SPRAY} />
      </ParallaxLayer>
      <PaperGrain opacity={0.1} scale={0.85} seed={13} />
    </AbsoluteFill>
  );
};

// pequeño realce interno de la hoja (highlight superior) — svg puro, sin deps
const RimLightSvg: React.FC = () => (
  <ellipse cx={560} cy={300} rx={140} ry={200} fill="#fff" opacity={0.08} />
);

export default PxMildewRetreat;
