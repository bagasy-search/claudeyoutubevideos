import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, SPRING_SNAPPY, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// VsCard — comparación "esto SÍ / eso NO" en DOS paneles lado a lado, claros al
// instante: ganador con borde verde + ✓, perdedor con borde terracota + ✗, y un
// disco "VS" al medio. Reemplaza al gráfico de barras cuando la comparación es
// cualitativa ("piedra vs aire", "100 años vs 5 años") — se lee sin pensar.
export type VsSide = {
  label: string;   // arriba, chico (ej "Con cal")
  value: string;   // el dato grande (ej "100 años" / "llena de piedra")
  sub?: string;    // pie chico opcional
  good?: boolean;  // true = ganador (verde ✓); false/undef = perdedor (rojo ✗)
};

const BOX_W = 1560;
const BOX_H = 820;

const Panel: React.FC<{ side: VsSide; enter: number; fromLeft: boolean; pulse: number }> = ({ side, enter, fromLeft, pulse }) => {
  const good = !!side.good;
  const edge = good ? COLORS.good : COLORS.danger;
  const dx = (1 - enter) * (fromLeft ? -120 : 120);
  return (
    <div style={{
      width: 640, minHeight: 470, boxSizing: "border-box",
      background: COLORS.bg2, border: `5px solid ${edge}`, borderRadius: 34,
      padding: "44px 40px 40px", position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: enter, transform: `translateX(${dx}px)`,
      boxShadow: `0 24px 60px rgba(0,0,0,0.18), 0 0 ${34 + 40 * (good ? pulse : 0)}px ${edge}${good ? "44" : "22"}`,
      fontFamily: FONT_STACK,
    }}>
      {/* sello ✓ / ✗ arriba */}
      <div style={{
        position: "absolute", top: -34, left: "50%", transform: "translateX(-50%)",
        width: 70, height: 70, borderRadius: "50%", background: edge, color: COLORS.bg0,
        display: "grid", placeItems: "center", fontSize: 42, fontWeight: 900,
        boxShadow: `0 8px 22px ${edge}66`,
      }}>{good ? "✓" : "✗"}</div>

      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 1, color: COLORS.textSoft, textTransform: "uppercase", textAlign: "center" }}>{side.label}</div>
      <div style={{ fontSize: 64, fontWeight: 900, color: edge, lineHeight: 1.08, marginTop: 16, textAlign: "center", textShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>{side.value}</div>
      {side.sub && <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.textDim, marginTop: 18, textAlign: "center" }}>{side.sub}</div>}
    </div>
  );
};

export const VsCard: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  left: VsSide;
  right: VsSide;
  hue?: "blue" | "cold" | "amber" | "red";
}> = ({ durationInFrames, eyebrow, title, left, right, hue = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });
  const enterL = spring({ frame: frame - sec(0.4), fps, config: SPRING_SNAPPY });
  const enterR = spring({ frame: frame - sec(0.7), fps, config: SPRING_SNAPPY });
  const vsPop = spring({ frame: frame - sec(1.0), fps, config: { damping: 12, stiffness: 180, mass: 0.7 } });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 22);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={42} drift={0.5}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={sec(0.1)} src={SFX.transition} volume={0.4} />
        <SfxCue at={sec(0.4)} src={SFX.barGrow} volume={0.35} />
        <SfxCue at={sec(0.7)} src={SFX.barGrow} volume={0.35} />
        <SfxCue at={sec(1.0)} src={SFX.barLand} volume={0.45} />

        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", opacity: head, transform: `translateY(${(1 - head) * -14}px)` }}>
            {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
            {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>}
          </div>
        )}

        {/* paneles */}
        <div style={{ position: "absolute", top: title || eyebrow ? 200 : 120, left: 40, right: 40, display: "flex", justifyContent: "space-between", alignItems: "stretch", gap: 40 }}>
          <Panel side={left} enter={enterL} fromLeft pulse={pulse} />
          <Panel side={right} enter={enterR} fromLeft={false} pulse={pulse} />
        </div>

        {/* disco VS al medio */}
        <div style={{
          position: "absolute", top: title || eyebrow ? 200 + 235 : 120 + 235, left: "50%",
          transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * vsPop}) rotate(${(1 - vsPop) * -30}deg)`,
          width: 118, height: 118, borderRadius: "50%",
          background: COLORS.text, color: COLORS.bg0, display: "grid", placeItems: "center",
          fontSize: 44, fontWeight: 900, letterSpacing: 1, fontFamily: FONT_STACK,
          boxShadow: "0 12px 34px rgba(0,0,0,0.35)", border: `4px solid ${COLORS.bg0}`, opacity: vsPop, zIndex: 6,
        }}>VS</div>
      </div>
    </SceneFrame>
  );
};
