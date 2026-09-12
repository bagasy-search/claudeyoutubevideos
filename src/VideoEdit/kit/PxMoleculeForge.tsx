import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParticleField,
  GodRays,
  RimLight,
  PaperGrain,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ─────────────────────────────────────────────────────────────────────────────
// PxMoleculeForge — PIEZA ÚNICA para el momento "un oxígeno de más" (extremo).
// Muestra H₂O y H₂O₂ como moléculas 3D ball-and-stick giratorias. El oxígeno EXTRA
// del H₂O₂ cuelga de un enlace-RESORTE que vibra cada vez más fuerte hasta que SE
// ROMPE (spring snap), y el átomo estalla en un BURST de burbujas de O₂ con un
// destello (bloom). Luego el ciclo se re-arma (loop) para que idle y clímax convivan.
//
// Marca terrosa-vintage: parchment, serif, óxido (O) + sepia (H) + eucalipto (O₂).
// PROFUNDIDAD REAL: perspective 3D + rotateY/rotateX vivos, esferas con specular +
// rim-light, DepthShadow implícita, ParticleField de burbujas, GodRays, filtros SVG.
// RENDER-SAFE: cero Date.now/Math.random/new Date. Todo desde useCurrentFrame();
// azar determinístico por índice (rand/wobble). Esquina inf-derecha libre (PiP).
// ─────────────────────────────────────────────────────────────────────────────

const OXY = COLORS.danger; // oxígeno = óxido / terracota
const HYD = COLORS.amber; // hidrógeno = sepia
const O2 = COLORS.cold; // O₂ liberado = eucalipto
const BOND = "#7a5a36"; // enlace = madera / tinta sepia

// Esfera 3D estilo ball-and-stick: base radial + highlight specular + aro de tinta.
const Sphere: React.FC<{
  cx: number;
  cy: number;
  r: number;
  fill: string;
  label?: string;
  op?: number;
  id: string;
}> = ({ cx, cy, r, fill, label, op = 1, id }) => (
  <g opacity={op}>
    <defs>
      <radialGradient id={id} cx="36%" cy="30%">
        <stop offset="0%" stopColor="#fff" stopOpacity={0.9} />
        <stop offset="26%" stopColor={fill} stopOpacity={1} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.5} />
      </radialGradient>
    </defs>
    <ellipse cx={cx} cy={cy + r * 0.9} rx={r * 0.8} ry={r * 0.22} fill="#000" opacity={0.16} />
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#241d15" strokeWidth={2.5} opacity={0.3} />
    <ellipse cx={cx - r * 0.34} cy={cy - r * 0.38} rx={r * 0.34} ry={r * 0.22} fill="#fff" opacity={0.6} />
    {label && (
      <text x={cx} y={cy + r * 0.34} fontSize={r * 0.86} fontWeight={900} fill="#fff" fontFamily={FONT_STACK} textAnchor="middle" opacity={0.9}>
        {label}
      </text>
    )}
  </g>
);

// Enlace cilíndrico con leve grosor (dos trazos apilados) para look 3D.
const Bond: React.FC<{ x1: number; y1: number; x2: number; y2: number; w?: number; op?: number; color?: string }> = ({ x1, y1, x2, y2, w = 16, op = 1, color = BOND }) => (
  <g opacity={op} strokeLinecap="round">
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth={w} opacity={0.18} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w * 0.72} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={w * 0.22} opacity={0.3} />
  </g>
);

export const PxMoleculeForge: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "Un oxígeno de más" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const lab = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // ── ciclo determinístico: idle-vibra → ROMPE → burst → re-arma ──────────────
  const CYCLE = 168; // frames por ciclo
  const BREAK_AT = 96; // frame dentro del ciclo en que el enlace se rompe
  const cf = ((frame % CYCLE) + CYCLE) % CYCLE; // frame dentro del ciclo
  const sinceBreak = cf - BREAK_AT; // <0 antes de romper, ≥0 después

  // giro 3D vivo de las dos moléculas (leve, para dar volumen sin marear)
  const rotYcommon = Math.sin(frame / 60) * 16;
  const rotYperox = Math.sin(frame / 48 + 1.2) * 18;
  const rotX = Math.sin(frame / 90) * 6;

  // vibración del enlace-resorte: crece hasta el punto de ruptura
  const tension = interpolate(cf, [0, BREAK_AT], [0.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vib = cf < BREAK_AT ? Math.sin(cf / 2.3) * 10 * tension * tension : 0;

  // spring de RUPTURA: el O extra sale disparado hacia arriba (resorte liberado)
  const snap = spring({ frame: sinceBreak, fps, config: { damping: 12, mass: 0.5, stiffness: 220 } });
  const broken = sinceBreak >= 0;
  const flyY = broken ? interpolate(snap, [0, 1], [0, -300]) : 0;
  const flyX = broken ? interpolate(snap, [0, 1], [0, 60]) : 0;
  const extraOp = broken ? interpolate(sinceBreak, [0, 40, 60], [1, 1, 0], { extrapolateRight: "clamp" }) : 1;

  // destello (bloom) en el instante de la ruptura
  const flash = broken ? interpolate(sinceBreak, [-1, 0, 3, 12], [0, 1, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  // burst de burbujas de O₂ (progreso desde la ruptura)
  const burst = broken ? interpolate(sinceBreak, [0, 34], [0, 1], { extrapolateRight: "clamp" }) : 0;

  // el enlace débil O–O parpadea/tira antes de romper y desaparece al romper
  const bondOp = broken ? interpolate(sinceBreak, [0, 4], [0.7, 0], { extrapolateRight: "clamp" }) : interpolate(tension, [0.3, 1], [0.4, 0.85]);

  // anclas del O extra (der) — parte pegado al O base y luego vuela
  const baseOx = 1080;
  const baseOy = 452;
  const extraCx = baseOx + 6 + vib + flyX + wobble(0, frame, 1.4) * (broken ? 4 : 2);
  const extraCy = 300 - flyY - 152 + (broken ? 0 : Math.cos(cf / 3) * 6 * tension); // sits above base O when idle

  // SFX en cada ruptura del ciclo (frames absolutos determinísticos)
  const nBreaks = Math.floor(durationInFrames / CYCLE) + 1;
  const breakFrames = Array.from({ length: nBreaks }, (_, i) => i * CYCLE + BREAK_AT);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="forge" />
      <TechBackground glowX={54} glowY={30} hue="amber" drift={0.35} />
      <GodRays x={62} y={-14} angle={20} color="rgba(169,121,74,0.16)" intensity={1} rays={7} />
      <ParticleField count={14} kind="dust" rise drift={20} opacity={0.32} />
      <SfxCue at={2} src={SFX.whoosh} volume={0.32} />
      {breakFrames.map((bf, i) => (
        <React.Fragment key={"sfx" + i}>
          <SfxCue at={bf} src={SFX.boom1} volume={0.42} />
          <SfxCue at={bf + 2} src={SFX.popUp} volume={0.3} />
        </React.Fragment>
      ))}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 22}px)` }}>
          {/* título */}
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <div style={{ letterSpacing: 5, fontSize: 20, fontWeight: 700, textTransform: "uppercase", color: COLORS.amber }}>
              química simple
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: COLORS.text }}>{title}</div>
          </div>

          {/* escena 3D — perspective real; cada molécula gira en su propio plano */}
          <div style={{ perspective: 1400 }}>
            <svg viewBox="0 0 1600 820" width="100%" style={{ display: "block", overflow: "visible" }}>
              {/* ════════ AGUA COMÚN — H₂O (izquierda) ════════ */}
              <g
                opacity={lab(10)}
                style={{ transform: `rotateY(${rotYcommon}deg) rotateX(${rotX}deg)`, transformOrigin: "440px 452px", transformBox: "fill-box" as unknown as undefined }}
              >
                <Bond x1={440} y1={452} x2={330} y2={370} w={16} op={0.9} />
                <Bond x1={440} y1={452} x2={330} y2={534} w={16} op={0.9} />
                <Sphere id="c-h1" cx={330} cy={370} r={46} fill={HYD} label="H" />
                <Sphere id="c-h2" cx={330} cy={534} r={46} fill={HYD} label="H" />
                <Sphere id="c-o" cx={440} cy={452} r={78} fill={OXY} label="O" />
              </g>

              {/* ════════ AGUA OXIGENADA — H₂O₂ (derecha) ════════ */}
              <g
                opacity={lab(24)}
                style={{ transform: `rotateY(${rotYperox}deg) rotateX(${rotX}deg)`, transformOrigin: `${baseOx}px ${baseOy}px`, transformBox: "fill-box" as unknown as undefined }}
              >
                {/* enlaces H al O base */}
                <Bond x1={baseOx} y1={baseOy} x2={baseOx - 118} y2={baseOy - 78} w={16} op={0.9} />
                <Bond x1={baseOx} y1={baseOy} x2={baseOx - 118} y2={baseOy + 82} w={16} op={0.9} />
                {/* enlace-RESORTE débil O–O (bobina) que tiembla y se rompe */}
                <path
                  d={springCoil(baseOx, baseOy - 78, extraCx, extraCy + 78, broken ? 2 : 6)}
                  fill="none"
                  stroke={OXY}
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={bondOp}
                  filter="url(#forge-rough)"
                />
                <Sphere id="p-h1" cx={baseOx - 118} cy={baseOy - 78} r={46} fill={HYD} label="H" />
                <Sphere id="p-h2" cx={baseOx - 118} cy={baseOy + 82} r={46} fill={HYD} label="H" />
                <Sphere id="p-o" cx={baseOx} cy={baseOy} r={78} fill={OXY} label="O" />

                {/* el OXÍGENO "de más": vibra, se suelta y vuela */}
                <g opacity={extraOp}>
                  {/* halo de tensión creciente / liberación */}
                  <circle cx={extraCx} cy={extraCy} r={64 + (broken ? snap * 46 : tension * 14)} fill="none" stroke={O2} strokeWidth={4} opacity={broken ? 0.6 * (1 - snap) : 0.25 * tension} />
                  <Sphere id="p-oextra" cx={extraCx} cy={extraCy} r={62} fill={OXY} label="O" />
                  {/* etiqueta "de más" cuando idle */}
                  {!broken && (
                    <text x={extraCx + 84} y={extraCy + 8} fontSize={30} fontWeight={800} fill={OXY} fontFamily={FONT_STACK} opacity={0.9 * tension}>
                      de más
                    </text>
                  )}
                </g>
              </g>

              {/* ════════ DESTELLO (bloom) en la ruptura ════════ */}
              {flash > 0 && (
                <g opacity={flash}>
                  <circle cx={extraCx} cy={extraCy} r={150} fill="#fff" opacity={0.5} filter="url(#forge-soft)" />
                  {Array.from({ length: 10 }, (_, i) => {
                    const a = (i / 10) * Math.PI * 2;
                    return <line key={i} x1={extraCx} y1={extraCy} x2={extraCx + Math.cos(a) * 130} y2={extraCy + Math.sin(a) * 130} stroke={O2} strokeWidth={4} opacity={0.7} />;
                  })}
                </g>
              )}

              {/* ════════ BURST de burbujas de O₂ tras la ruptura ════════ */}
              {burst > 0 && Array.from({ length: 16 }, (_, i) => {
                const a = -Math.PI / 2 + (rand(i) - 0.5) * 1.6; // hacia arriba con abanico
                const dist = burst * (70 + rand(i, 1) * 260);
                const bx = extraCx + Math.cos(a) * dist + wobble(i, frame, 2) * 8;
                const by = extraCy + Math.sin(a) * dist - burst * 40;
                const br = 8 + rand(i, 2) * 14;
                const op = interpolate(burst, [0, 0.2, 1], [0, 0.9, 0]) * (0.5 + rand(i, 3) * 0.5);
                return (
                  <g key={"bb" + i} opacity={op}>
                    <circle cx={bx} cy={by} r={br} fill={O2} opacity={0.5} />
                    <circle cx={bx} cy={by} r={br} fill="none" stroke={O2} strokeWidth={2.5} />
                    <ellipse cx={bx - br * 0.3} cy={by - br * 0.3} rx={br * 0.35} ry={br * 0.25} fill="#fff" opacity={0.6} />
                  </g>
                );
              })}

              {/* símbolo O₂ ↑ arriba (adónde va el oxígeno liberado) */}
              <g opacity={lab(40)} transform="translate(1180 96)">
                <rect x={-96} y={-42} width={192} height={84} rx={42} fill={O2} opacity={0.16} />
                <text x={0} y={16} fontSize={48} fontWeight={900} fill={O2} fontFamily={FONT_STACK} textAnchor="middle">O₂ ↑</text>
              </g>

              {/* etiquetas de fórmula (esquina inf-der libre para PiP) */}
              <text x={440} y={700} fontSize={40} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK} textAnchor="middle" style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 } as React.CSSProperties} opacity={lab(16)}>
                Agua común · H₂O
              </text>
              <text x={980} y={700} fontSize={40} fontWeight={800} fill={OXY} fontFamily={FONT_STACK} textAnchor="middle" style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 } as React.CSSProperties} opacity={lab(30)}>
                Agua oxigenada · H₂O₂
              </text>
            </svg>
          </div>
        </div>
      </AbsoluteFill>

      {/* rim-light cálido sobre toda la escena para asentar el volumen */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <RimLight color="rgba(169,121,74,0.0)" spread={0} x={0.7} y={0.2}>
          <div />
        </RimLight>
      </AbsoluteFill>
      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

// bobina de resorte determinística entre dos puntos (n vueltas). Sin azar.
function springCoil(x1: number, y1: number, x2: number, y2: number, coils: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len;
  const ny = dy / len;
  const px = -ny; // perpendicular
  const py = nx;
  const amp = Math.min(16, len * 0.14);
  const steps = Math.max(8, coils * 4);
  let d = `M ${x1} ${y1}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const side = i % 2 === 0 ? 1 : -1;
    const along = t;
    const cx = x1 + dx * along + px * amp * side;
    const cy = y1 + dy * along + py * amp * side;
    d += ` L ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  d += ` L ${x2} ${y2}`;
  return d;
}

export default PxMoleculeForge;
