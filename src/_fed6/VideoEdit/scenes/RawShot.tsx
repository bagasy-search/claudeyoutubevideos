import { COLORS, FONT_STACK, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

// RAW full-bleed real photo / clip. Topic-agnostic b-roll: shows the actual thing
// the narration is talking about, CLEAN — no darkening text card over it.
//
// ★ KEN-BURNS CON INTENCIÓN (fix del "zoom uniforme"):
//   · la MAGNITUD escala con la duración (velocidad de cámara ~constante): un beat de
//     2s se mueve poco; uno de 20s no queda clavado — antes era ±7% fijo, así que los
//     planos largos parecían pantalla congelada.
//   · los planos LARGOS los parte el AUTOSPLIT del beatsheet (maxRawDur) en tomas A/B
//     con kbPhase distinto — acá solo variamos magnitud/dirección/origen.
//   · `focus` ("x% y%") permite apuntar el origen del zoom al SUJETO de la foto
//     (lo puede emitir la autoría/QC); sin focus, hash del filename como siempre.
// ★ Anti-congelado: `clipDur` (dur real del mp4, medida por beatsheet.mjs) baja a
//   Media vía SceneFrame para adaptar playbackRate/loop.
// ★ `trans` (frames) = fade-in de cambio de SECCIÓN (opt-in del build; cortes internos
//   siguen secos). ★ `grade` = normalización de color por clip (probe_grade).
export const RawShot: React.FC<{
  durationInFrames: number;
  src: string; // "img/name.png" or "vid/name.mp4"
  hue?: "blue" | "cold" | "amber" | "red";
  darken?: number; // keep low: this is RAW. default 0.08
  blur?: number;
  zoom?: [number, number];
  kicker?: string; // optional small top-left tag; omit for fully raw
  accent?: string;
  // BUG 2: "blur" = clip vertical/baja-res → fondo blureado (cover) + clip real
  // centrado con object-fit:contain a su tamaño nativo (NO se estira → no pixela).
  fit?: "cover" | "blur";
  clipDur?: number;
  focus?: string; // "62% 40%" — origen del Ken-Burns apuntado al sujeto
  trans?: number; // frames de fade-in (cambio de sección)
  grade?: string;
  kbPhase?: number; // fuerza variante de Ken-Burns (para splits A/B del mismo asset)
}> = ({
  durationInFrames,
  src,
  hue = "amber",
  darken = 0.08,
  blur = 0,
  zoom,
  kicker,
  accent = COLORS.accent,
  fit = "cover",
  clipDur,
  focus,
  trans,
  grade,
  kbPhase,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kIn = spring({ frame: frame - sec(0.2), fps, config: { damping: 18, mass: 0.7 } });
  let seed = 0;
  for (let i = 0; i < src.length; i++) seed = (seed * 31 + src.charCodeAt(i)) >>> 0;
  if (kbPhase != null) seed = (seed + kbPhase * 7919) >>> 0;

  const durSec = durationInFrames / fps;
  // magnitud por duración: ~0.9%/s de zoom, clamp [2%, 10%] punta a punta.
  const span = Math.min(0.10, Math.max(0.02, 0.009 * durSec));
  const zoomIn = seed % 2 === 0; // dirección alternada estable por asset
  const base = 1.01 + ((seed >> 4) % 4) * 0.005; // punto de partida levemente variado
  const blurFill = fit === "blur";
  const motion: [number, number] = zoom ?? (blurFill
    ? [1.0, 1.02]
    : zoomIn ? [base, +(base + span).toFixed(3)] : [+(base + span).toFixed(3), base]);

  const ORIGINS = ["50% 50%", "32% 30%", "70% 38%", "38% 70%", "66% 62%", "30% 55%", "60% 30%", "50% 72%"];
  const camOrigin = focus || ORIGINS[(seed >> 3) % ORIGINS.length];

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      bg="image"
      image={src}
      imageBlur={blur}
      imageDarken={darken}
      imageFit={blurFill ? "blur" : "cover"}
      zoom={motion}
      camOrigin={camOrigin}
      noReveal
      clipDur={clipDur}
      beatDur={durSec}
      grade={grade}
      fadeIn={trans}
      contentStyle={{ alignItems: "flex-start", justifyContent: "flex-start" }}
    >
      {kicker && (
        <div
          style={{
            margin: "70px 0 0 80px",
            fontFamily: FONT_STACK,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: accent,
            opacity: kIn,
            transform: `translateY(${(1 - kIn) * 18}px)`,
            textShadow: "0 2px 18px rgba(0,0,0,0.7)",
          }}
        >
          {kicker}
        </div>
      )}
    </SceneFrame>
  );
};
