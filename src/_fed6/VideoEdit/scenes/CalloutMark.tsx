import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Caveat";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { F_INTER } from "../kit/premium/theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";
import { Media } from "../components/Media";

const { fontFamily: HAND } = loadFont();

// GENERIC handwritten number/date CALLOUT over a vintage photo. Topic-agnostic —
// pass the figure (a year "1903", a count, a price) + caption + optional photo.
// Rule 14: the photo Ken-Burns-zooms, the figure WRITES itself on (clip wipe +
// settle), a hand-drawn CIRCLE and UNDERLINE draw themselves around it, the caption
// rises — each beat staggered, each with its own SFX (whoosh, pencil scratches).
const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

const BOX_W = 1520;
const BOX_H = 820;

export const CalloutMark: React.FC<{
  durationInFrames: number;
  figure: string; // the big handwritten thing, e.g. "1903"
  eyebrow?: string;
  caption?: string; // small printed caption under the figure
  image?: string; // staticFile path; falls back to a sepia wash
  accent?: keyof typeof TONES;
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  medico?: boolean; // acento teal clínico + tipografía Inter (canal Dr. Federer)
}> = ({
  durationInFrames,
  figure,
  eyebrow,
  caption,
  image,
  accent = "accent",
  hue = "amber",
  startAt = sec(0.5),
  medico = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = medico ? "#12B3AE" : TONES[accent];
  const FONT = medico ? F_INTER : FONT_STACK;
  const FIG_FONT = medico ? F_INTER : HAND;

  // photo Ken Burns (always running) + fade-in
  const photoIn = interpolate(frame, [0, sec(0.8)], [0, 1], { extrapolateRight: "clamp" });
  const kb = 1.08 + (frame / Math.max(1, durationInFrames)) * 0.12;

  // figure "writes on": clip-path wipe left→right + settle
  const writeStart = startAt;
  const write = spring({ frame: frame - writeStart, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const figSettle = spring({ frame: frame - writeStart, fps, config: SPRING_SOFT });
  const wipe = interpolate(write, [0, 1], [0, 100]);

  // hand-drawn circle draws on after the figure
  const circleStart = writeStart + sec(0.8);
  const circle = spring({ frame: frame - circleStart, fps, config: { damping: 200, mass: 1, stiffness: 55 } });

  // underline draws on
  const ulStart = circleStart + sec(0.4);
  const ul = spring({ frame: frame - ulStart, fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // caption rises last
  const capStart = ulStart + sec(0.35);
  const cap = spring({ frame: frame - capStart, fps, config: SPRING_SOFT });

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} bg={medico ? "white" : "grid"} glowY={50} drift={0.4}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT, overflow: "hidden", borderRadius: 26 }}>
        {/* vintage photo background (or sepia fallback) with Ken Burns */}
        <div style={{ position: "absolute", inset: 0, transform: `scale(${kb})`, opacity: photoIn }}>
          {image ? (
            <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.86)" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "radial-gradient(120% 120% at 30% 20%, #6b5836, #2a2118 70%, #161109)" }} />
          )}
        </div>
        {/* darkening + vignette so the handwriting reads */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,0.15), rgba(0,0,0,0.62) 100%)" }} />
        {/* warm film grain-ish wash */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C}11, transparent 40%, rgba(0,0,0,0.3))`, mixBlendMode: "multiply" }} />

        {eyebrow && (
          <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", letterSpacing: 6, fontSize: 20, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.8)", opacity: photoIn }}>
            {eyebrow}
          </div>
        )}

        {/* the handwritten figure, centered, writing on via clip wipe */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", transform: `rotate(-3deg) scale(${0.9 + figSettle * 0.1})` }}>
            <div
              style={{
                fontFamily: FIG_FONT,
                // ⛔ `fontSize: 280` fijo se diseñó para un año ("1903"): con una figure de 12+
                //    caracteres el texto SE SALE DEL CUADRO y sale cortado a los dos lados
                //    ("UN CHARQUITO" -> "N CHARQUIT", "POCO VOLUMEN" -> "POCO VOLUI").
                //    Ninguna compuerta lo ve (la prop existe y el componente "se ve lleno").
                fontSize: Math.max(88, Math.min(280, Math.floor(1280 / (0.66 * Math.max(1, String(figure).length))))),
                whiteSpace: "nowrap",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1,
                textShadow: `0 6px 30px rgba(0,0,0,0.6), 0 0 40px ${C}55`,
                clipPath: `inset(0 ${100 - wipe}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - wipe}% 0 0)`,
              }}
            >
              {figure}
            </div>

            {/* hand-drawn circle around the figure (SVG stroke draws on) */}
            <svg viewBox="0 0 600 320" style={{ position: "absolute", left: "50%", top: "50%", width: 680, height: 360, transform: "translate(-50%,-50%)", overflow: "visible" }}>
              <path
                d="M 300 30 C 470 20, 580 90, 560 165 C 540 250, 380 300, 230 290 C 90 280, 20 210, 45 135 C 68 65, 180 35, 300 30 Z"
                fill="none"
                stroke={C}
                strokeWidth={10}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - circle}
                style={{ filter: `drop-shadow(0 0 10px ${C}88)` }}
              />
            </svg>

            {/* underline scribble */}
            <svg viewBox="0 0 600 60" style={{ position: "absolute", left: "50%", top: "100%", width: 560, height: 60, transform: "translate(-50%, 8px)", overflow: "visible" }}>
              <path
                d="M 20 30 C 160 8, 300 50, 440 22 C 500 10, 560 28, 580 34"
                fill="none"
                stroke={C}
                strokeWidth={9}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ul}
                style={{ filter: `drop-shadow(0 0 8px ${C}88)` }}
              />
            </svg>
          </div>

          {caption && (
            <div
              style={{
                marginTop: 96,
                fontSize: 30,
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                letterSpacing: 1,
                opacity: cap,
                transform: `translateY(${(1 - cap) * 18}px)`,
                textShadow: "0 2px 14px rgba(0,0,0,0.6)",
              }}
            >
              {caption}
            </div>
          )}
        </div>

        {/* SFX: whoosh as the photo pushes in; pencil scratches on each drawn stroke */}
        <SfxCue at={0} src={SFX.whoosh} volume={0.42} />
        <SfxCue at={writeStart} src={SFX.ui6} volume={0.5} durationInFrames={sec(0.9)} />
        <SfxCue at={circleStart} src={SFX.ui2} volume={0.5} />
        <SfxCue at={ulStart} src={SFX.ui4} volume={0.45} />
        {caption && <SfxCue at={capStart} src={SFX.click} volume={0.35} />}
      </div>
    </SceneFrame>
  );
};
