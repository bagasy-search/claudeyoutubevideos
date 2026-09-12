import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT_STACK } from "../theme";
import { TechBackground } from "./TechBackground";
import { ImageBackdrop, PlainBackdrop } from "./Backdrops";
import { kenBurns } from "../lib/anim";

// Opaque full-screen scene wrapper. Covers the avatar, paints the background,
// and guarantees constant motion: a permanent Ken-Burns camera zoom (Rule 10A)
// plus a fluid zoom-blur enter/exit (Rule 6 #1 — no hard cuts).
// Rule 12 — `bg` varies the base so we don't always use the navy grid:
//   "grid"  (default) navy + white dots
//   "image" full-screen blurred+darkened photo (pass `image`)
//   "black" / "white" plain tone + subtle dots
export const SceneFrame: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  hue?: "blue" | "cold" | "amber" | "red";
  glowX?: number;
  glowY?: number;
  zoom?: [number, number];
  drift?: number;
  contentStyle?: React.CSSProperties;
  bg?: "grid" | "image" | "black" | "white";
  image?: string; // staticFile path when bg="image"
  imageBlur?: number;
  imageDarken?: number;
  imageTint?: string;
  imageFit?: "cover" | "blur"; // "blur" = blur-fill para clips verticales/baja-res
  noReveal?: boolean; // RawShot: HARD-CUT, sin fade/blur de entrada NI salida (regla del nicho)
  camOrigin?: string; // origen del Ken-Burns (varía el "punto" del zoom/pan). def centro
  clipDur?: number; // duración real del mp4 (s) → anti-congelado (Media)
  beatDur?: number; // duración del beat en timeline (s)
  grade?: string; // normalización por clip (probe_grade) — no es un look
  // ★ TRANSICIÓN DE SECCIÓN (opt-in): N frames de fade-in SOLO cuando el build lo pide
  // (primer beat de un capítulo). Los cortes internos siguen siendo secos (regla del
  // nicho); esto es el "respiro" entre bloques, tasteful, no un crossfade en cada beat.
  fadeIn?: number;
}> = ({
  durationInFrames,
  children,
  hue = "blue",
  glowX = 50,
  glowY = 42,
  zoom = [1.04, 1.12],
  drift = 0.7,
  contentStyle,
  bg = "grid",
  image,
  imageBlur,
  imageDarken,
  imageTint,
  imageFit = "cover",
  noReveal = false,
  camOrigin = "center center",
  clipDur,
  beatDur,
  grade,
  fadeIn = 0,
}) => {
  const frame = useCurrentFrame();
  // ★ CORTE LIMPIO UNIVERSAL (feedback usuario jun 2026: "los cambios de un frame a otro
  // no deben tener animaciones... que quede limpio"). NADA de fade/scale/blur de entrada o
  // salida en NINGUNA escena — cada beat es un corte seco. Se conserva SOLO el Ken-Burns
  // interno (cam) y el fadeIn OPT-IN de cambio de sección.
  void noReveal;
  const opacity = fadeIn > 0
    ? Math.min(1, Math.max(0, frame / fadeIn))
    : 1;
  const scale = 1;
  const blur = 0;
  const cam = kenBurns(frame, durationInFrames, zoom[0], zoom[1]);

  // parallax 2.5D: deriva de perspectiva muy sutil → la foto se siente con profundidad
  const pRotY = Math.sin(frame / 115) * 1.1;
  const pRotX = Math.cos(frame / 137) * 0.7;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, opacity }}>
      {/* background gets its own slightly stronger parallax zoom + perspective for depth */}
      <AbsoluteFill style={{ transform: `perspective(1800px) rotateY(${pRotY}deg) rotateX(${pRotX}deg) scale(${cam * 1.06})`, transformOrigin: camOrigin }}>
        {bg === "image" && image ? (
          <ImageBackdrop
            src={image}
            blur={imageBlur}
            darken={imageDarken}
            tint={imageTint}
            fit={imageFit}
            durationInFrames={durationInFrames}
            clipDur={clipDur}
            beatDur={beatDur}
            grade={grade}
          />
        ) : bg === "black" || bg === "white" ? (
          <PlainBackdrop
            tone={bg}
            glowHue={hue === "amber" || hue === "red" ? hue : "blue"}
            glowY={glowY}
          />
        ) : (
          <TechBackground glowX={glowX} glowY={glowY} hue={hue} drift={drift} />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          transform: `scale(${scale * cam})`,
          transformOrigin: camOrigin,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform, filter",
          ...contentStyle,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
