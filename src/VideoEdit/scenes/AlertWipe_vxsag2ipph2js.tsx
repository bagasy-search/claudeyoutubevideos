import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { COLORS } from "../theme";

const { fontFamily: IMPACT } = loadFont();

// ── ALERT WIPE (variante de vxsag2ipph2js) ────────────────────────────────────
// El AlertWipe compartido es una TRANSICIÓN de ~0.8s pensada para una palabra
// ("ATENCIÓN"): repite el texto tres veces en marquesina con `nowrap` a 112px, así
// que una advertencia de verdad ("Esa carga es de las que matan") se sale de la
// banda por la derecha y se lee cortada.
// Esta variante conserva el barrido y el rojo, pero: una sola copia del texto,
// tamaño auto-ajustado al largo, partido en hasta dos líneas, y un tramo de REPOSO
// en el medio para que dé tiempo de leerlo. NO se toca el componente compartido.
export const AlertWipeVx: React.FC<{
  durationInFrames: number;
  text?: string;
  accent?: "danger" | "amber";
}> = ({ durationInFrames, text = "ATENCIÓN", accent = "danger" }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const C = accent === "amber" ? COLORS.amber : COLORS.danger;
  const DARK = "#15120E";
  const p = frame / durationInFrames;

  // entra (0→22%) · REPOSA (22→74%) · sale (74→100%)
  const enter = interpolate(p, [0, 0.22], [-1.25, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const exit = interpolate(p, [0.74, 1], [0, 1.45], { extrapolateLeft: "clamp", easing: Easing.in(Easing.cubic) });
  const tx = (enter + exit) * width;
  const textO = interpolate(p, [0.14, 0.26, 0.7, 0.8], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // auto-fit: la banda útil son ~1640px; Anton mide ~0.46em por carácter
  const words = text.trim().split(/\s+/);
  const twoLines = text.length > 26;
  const longest = twoLines
    ? Math.max(
        words.slice(0, Math.ceil(words.length / 2)).join(" ").length,
        words.slice(Math.ceil(words.length / 2)).join(" ").length
      )
    : text.length;
  const fontSize = Math.max(38, Math.min(106, Math.floor(1640 / (longest * 0.47))));
  const line1 = twoLines ? words.slice(0, Math.ceil(words.length / 2)).join(" ") : text;
  const line2 = twoLines ? words.slice(Math.ceil(words.length / 2)).join(" ") : "";

  return (
    <AbsoluteFill style={{ justifyContent: "center", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", top: twoLines ? "31%" : "35%", height: twoLines ? "38%" : "30%",
          left: 0, right: 0, background: C,
          transform: `translateX(${tx}px) skewX(-8deg)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            fontFamily: IMPACT, color: DARK, fontSize, lineHeight: 1.02, letterSpacing: 3,
            opacity: textO, transform: "skewX(8deg)", textAlign: "center",
            maxWidth: 1640, padding: "0 40px",
          }}
        >
          <div>{line1}</div>
          {line2 ? <div>{line2}</div> : null}
        </div>
      </div>
      <div
        style={{
          position: "absolute", top: twoLines ? "31%" : "35%", height: twoLines ? "38%" : "30%",
          width: 10, left: 0, background: DARK,
          transform: `translateX(${tx + width * 0.5 + 6}px)`, opacity: 0.9,
        }}
      />
    </AbsoluteFill>
  );
};
