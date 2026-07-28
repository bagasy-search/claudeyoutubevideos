import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { COLORS } from "../theme";

// ── PeroxideSplit ─────────────────────────────────────────────────────────────
// Componente PROPIO de "25 usos del agua oxigenada" (Levi Lapp Jardín).
// Muestra el mecanismo que sostiene TODO el video: H₂O₂ suelta el átomo de oxígeno
// mal pegado, ese átomo oxida lo que tenga enfrente, y lo que queda es agua común.
// Nada de brillo especular ni bokeh: pergamino, serif terroso y fade largo (marca Amish).
//
//   fase "suelta" → el átomo se despega y sube
//   fase "oxida"  → el átomo choca contra la mancha y la apaga
//   fase "agua"   → queda H₂O, sin residuo

const SERIF = "'EB Garamond', 'Georgia', serif";

const Atom: React.FC<{ x: number; y: number; r: number; label: string; tone: string; op?: number }> = ({
  x, y, r, label, tone, op = 1,
}) => (
  <div
    style={{
      position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2,
      borderRadius: "50%", background: tone, opacity: op,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "rgba(28,24,18,0.9)", fontFamily: SERIF, fontSize: r * 0.95, fontWeight: 600,
      boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
      border: "2px solid rgba(28,24,18,0.28)",
    }}
  >
    {label}
  </div>
);

export const PeroxideSplit: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  phase?: "suelta" | "oxida" | "agua";
  targetLabel?: string;
}> = ({ durationInFrames, eyebrow = "El mecanismo", title = "El átomo que se suelta", phase = "suelta", targetLabel = "hongo" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // entrada por FADE LARGO (marca del canal — nada de springs con rebote)
  const inOp = interpolate(frame, [0, 26], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inOp, outOp);

  const t = spring({ frame: frame - 14, fps, config: { damping: 26, mass: 1.1 } });
  const travel = interpolate(t, [0, 1], [0, 1], { easing: Easing.inOut(Easing.ease) });

  const cx = 760, cy = 560;
  const freeX = phase === "agua" ? cx + 190 : cx + 190 + travel * 330;
  const freeY = phase === "agua" ? cy - 110 : cy - 110 - travel * 90;
  const freeOp = phase === "agua" ? 1 - travel : 1;
  const hitOp = phase === "oxida" ? travel : 0;

  const AMBER = "rgba(226,178,96,0.95)";
  const PALE = "rgba(238,231,214,0.95)";

  return (
    <AbsoluteFill style={{ background: COLORS.bg0, opacity: op }}>
      {/* pergamino */}
      <AbsoluteFill
        style={{
          margin: 64, borderRadius: 10,
          background: "linear-gradient(150deg, #efe6d2 0%, #e6dac1 48%, #dccfb2 100%)",
          boxShadow: "0 40px 110px rgba(0,0,0,0.55), inset 0 0 160px rgba(120,96,60,0.20)",
        }}
      />
      <div style={{ position: "absolute", left: 132, top: 128, opacity: op }}>
        <div style={{ fontFamily: SERIF, fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "rgba(96,78,52,0.85)" }}>
          {eyebrow}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 74, color: "rgba(38,31,22,0.94)", marginTop: 10, maxWidth: 1180, lineHeight: 1.06 }}>
          {title}
        </div>
      </div>

      {/* molécula: O-O con dos H */}
      <Atom x={cx - 190} y={cy} r={74} label="O" tone={PALE} />
      <Atom x={cx - 330} y={cy + 96} r={46} label="H" tone={PALE} />
      <div style={{ position: "absolute", left: cx - 190, top: cy - 5, width: 190, height: 10, background: "rgba(80,64,40,0.5)" }} />
      <Atom x={cx + 190} y={cy} r={74} label="O" tone={phase === "agua" ? PALE : AMBER} op={phase === "agua" ? 1 : 0.35} />
      <Atom x={cx + 330} y={cy + 96} r={46} label="H" tone={PALE} />

      {/* el átomo flojo que viaja */}
      {phase !== "agua" && <Atom x={freeX} y={freeY} r={74} label="O" tone={AMBER} op={freeOp} />}

      {/* el blanco que se apaga */}
      {phase === "oxida" && (
        <div
          style={{
            position: "absolute", left: cx + 640, top: cy - 200, width: 300, height: 300, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(120,140,90,${0.75 - hitOp * 0.7}) 0%, rgba(90,110,70,${0.5 - hitOp * 0.5}) 70%, transparent 72%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: SERIF, fontSize: 40, color: `rgba(40,34,24,${0.9 - hitOp * 0.8})`,
          }}
        >
          {targetLabel}
        </div>
      )}

      <div
        style={{
          position: "absolute", left: 132, bottom: 132, fontFamily: SERIF, fontSize: 44,
          color: "rgba(58,48,34,0.92)", maxWidth: 1400, lineHeight: 1.25,
        }}
      >
        {phase === "suelta" && "Está mal pegado. Se suelta al primer golpe de luz, calor o materia viva."}
        {phase === "oxida" && `Oxida lo que tenga enfrente y lo apaga.`}
        {phase === "agua" && "Y lo que queda es agua común. Sin residuo, sin sal, sin veneno."}
      </div>

      {/* desgaste de película — la firma del canal */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.42) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};
