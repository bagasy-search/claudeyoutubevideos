import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec, glass } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  DepthShadow,
  Odometer,
  InkDraw,
  WaxSeal,
  Frame3D,
  SvgFilters,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// IngredientsCardKit — ficha de RECETA/almanaque: encabezado ("Necesitás") y una
// lista de insumos con su cantidad. Cada renglón entra escalonado, con una
// viñeta de tinta dibujada, la cantidad rodando en un mini-odómetro y una regla
// de tinta que subraya el título. La tarjeta se asienta en 3D sobre el papel.
// PROP-DRIVEN — sirve a los 3 nichos:
//   huerta:      "Necesitás → Compost 2 kg · Semillas 1 sobre · Agua 5 L"
//   reparación:  "Materiales → Masilla 200 g · Lija N°120 · Barniz 250 ml"
//   amish:       "Para el pan → Harina 1 kg · Levadura 10 g · Sal 15 g"
// Determinístico. Esquina inf-der libre para el avatar PiP.
// ═══════════════════════════════════════════════════════════════════════════

type Ingredient = { name: string; amount?: string };

const DEFAULT_INGREDIENTS: Ingredient[] = [
  { name: "Compost maduro", amount: "2 kg" },
  { name: "Semillas", amount: "1 sobre" },
  { name: "Ceniza de leña", amount: "1 taza" },
  { name: "Agua de lluvia", amount: "5 L" },
];

// Separa "12 kg" → { num: 12, tail: " kg" } para rodar solo la parte numérica.
const splitAmount = (a?: string): { num: number | null; head: string; tail: string } => {
  if (!a) return { num: null, head: "", tail: "" };
  const m = a.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return { num: null, head: a, tail: "" };
  const num = parseFloat(m[2].replace(",", "."));
  return { num: Number.isFinite(num) ? num : null, head: m[1], tail: m[3] };
};

export const IngredientsCardKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  ingredients?: Ingredient[];
  heading?: string;
}> = ({
  durationInFrames,
  title = "Receta del bancal",
  subtitle,
  accent = COLORS.amber,
  ingredients = DEFAULT_INGREDIENTS,
  heading = "Necesitás",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const outFade = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rows = ingredients.slice(0, 7);
  const rowStart = 0.7;
  const rowGap = 0.34;

  const Row: React.FC<{ ing: Ingredient; i: number }> = ({ ing, i }) => {
    const at = rowStart + i * rowGap;
    const s = spring({ frame: frame - sec(at), fps, config: { damping: 16, mass: 0.8, stiffness: 150 } });
    const { num, head, tail } = splitAmount(ing.amount);
    const drift = wobble(i, frame, 0.6) * 1.5;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: s,
          transform: `translateX(${(1 - s) * -34}px) translateY(${drift}px)`,
          padding: "14px 8px",
          borderBottom: i < rows.length - 1 ? `1.5px dashed ${COLORS.textDim}` : "none",
        }}
      >
        {/* viñeta de tinta dibujada (aro + tilde) */}
        <svg viewBox="0 0 56 56" width={56} height={56} style={{ flexShrink: 0 }}>
          <circle cx={28} cy={28} r={24} fill={`${accent}22`} />
          <InkDraw
            d="M 28 6 C 12 8, 6 26, 12 40 C 22 54, 44 52, 50 36 C 54 20, 44 6, 28 6"
            at={sec(at)}
            duration={16}
            color={accent}
            width={4}
            length={150}
          />
          <InkDraw d="M 18 29 L 25 37 L 40 20" at={sec(at + 0.14)} duration={12} color={COLORS.good} width={5} length={60} />
        </svg>

        {/* nombre del insumo */}
        <div style={{ flex: 1, fontFamily: FONT_STACK, fontSize: 40, fontWeight: 700, color: COLORS.text, letterSpacing: 0.2 }}>
          {ing.name}
        </div>

        {/* cantidad — número rueda en odómetro, resto en texto */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            fontFamily: FONT_STACK,
            fontWeight: 800,
            color: accent,
            background: `${COLORS.bg2}`,
            border: `1.5px solid ${accent}66`,
            borderRadius: 14,
            padding: "6px 18px",
            boxShadow: "inset 0 2px 6px rgba(42,38,32,0.10)",
            minWidth: 120,
            justifyContent: "flex-end",
          }}
        >
          {ing.amount ? (
            num !== null ? (
              <>
                {head && <span style={{ fontSize: 32 }}>{head}</span>}
                <Odometer
                  value={num}
                  digits={String(Math.floor(num)).length}
                  durationInFrames={sec(0.9)}
                  size={38}
                  color={accent}
                />
                <span style={{ fontSize: 30 }}>{tail}</span>
              </>
            ) : (
              <span style={{ fontSize: 32 }}>{ing.amount}</span>
            )
          ) : (
            <span style={{ fontSize: 30, opacity: 0.7 }}>a gusto</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, opacity: outFade }}>
      <SvgFilters prefix="ing" />
      <TechBackground glowX={44} glowY={34} hue="amber" drift={0.3} />
      <ParallaxLayer depth={0.3} driftY={12}>
        <GodRays x={30} y={-14} angle={18} intensity={0.85} rays={6} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.85} driftY={22}>
        <ParticleField count={16} kind="spores" rise drift={22} opacity={0.4} />
      </ParallaxLayer>

      <SfxCue at={sec(0.4)} src={SFX.whoosh} volume={0.35} />
      {rows.map((_, i) => (
        <SfxCue key={i} at={sec(rowStart + i * rowGap)} src={SFX.click} volume={0.35} />
      ))}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <Frame3D at={0.2} rotateY={9} rotateX={4} depth={46} perspective={1600} style={{ width: "100%", maxWidth: 1120 }}>
          <DepthShadow
            layers={7}
            distance={54}
            radius={30}
            color="rgba(42,38,32,0.22)"
            style={{ ...glass("light"), borderRadius: 30, position: "relative", overflow: "hidden" }}
          >
            {/* textura y luz interna de la ficha */}
            <PaperGrain opacity={0.14} scale={1.1} seed={9} />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "40%",
                background: "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0))",
                pointerEvents: "none",
              }}
            />
            {/* franja lateral de "cuaderno" (agujeros) */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 44, width: 2, background: COLORS.danger, opacity: 0.35 }} />
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 22,
                  top: 70 + i * 88,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: COLORS.bg0,
                  boxShadow: "inset 0 2px 4px rgba(42,38,32,0.35)",
                }}
              />
            ))}

            <div style={{ padding: "48px 64px 54px 92px", position: "relative" }}>
              {/* encabezado */}
              <div style={{ marginBottom: 8, opacity: enter, transform: `translateY(${(1 - enter) * -14}px)` }}>
                {title && <div style={{ fontFamily: FONT_STACK, fontSize: 30, fontWeight: 600, color: COLORS.textSoft, letterSpacing: 3, textTransform: "uppercase" }}>{title}</div>}
                <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                  <div style={{ fontFamily: FONT_STACK, fontSize: 66, fontWeight: 800, color: COLORS.text, letterSpacing: 0.4 }}>{heading}</div>
                  <div style={{ fontFamily: FONT_STACK, fontSize: 30, fontWeight: 700, color: accent }}>{rows.length} insumos</div>
                </div>
                <svg viewBox="0 0 620 26" width={620} height={26} style={{ display: "block", marginTop: 2 }}>
                  <InkDraw d="M 8 16 C 200 5, 440 5, 612 15" at={sec(0.4)} duration={26} color={accent} width={6} length={640} />
                </svg>
                {subtitle && <div style={{ fontFamily: FONT_STACK, fontSize: 26, fontWeight: 600, color: COLORS.textSoft, marginTop: 10 }}>{subtitle}</div>}
              </div>

              {/* renglones */}
              <div style={{ marginTop: 22 }}>
                {rows.map((ing, i) => (
                  <Row key={i} ing={ing} i={i} />
                ))}
              </div>
            </div>

            {/* sello de "aprobado" en esquina superior derecha (lejos del avatar) */}
            <div style={{ position: "absolute", top: 30, right: 40, transform: "rotate(9deg)" }}>
              <WaxSeal at={sec(rowStart + rows.length * rowGap + 0.3)} size={116} color={COLORS.danger} initials="✓" />
            </div>
          </DepthShadow>
        </Frame3D>
      </AbsoluteFill>

      <PaperGrain opacity={0.08} scale={0.8} seed={3} />
    </AbsoluteFill>
  );
};

export default IngredientsCardKit;
