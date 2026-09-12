import { AbsoluteFill, Sequence, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_waterwell.gen";
import { AVATAR_WINDOWS, TOTAL_WATERWELL } from "./avatar_waterwell.gen";

export const TOTAL_FRAMES_WATERWELL = Math.round(TOTAL_WATERWELL * 30);

// ── QR de la guía en una esquina, durante las menciones a "The Plain Almanac" ──
// Voz calma, sin precio/URL hablado: el QR (theplainalmanac.vercel.app) + "scan" viven EN PANTALLA.
const QrCorner: React.FC<{ durF: number }> = ({ durF }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(f, [durF - 12, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(fadeIn, fadeOut);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", right: 54, bottom: 54, opacity: op,
        display: "flex", alignItems: "center", gap: 26,
        background: "rgba(244,238,224,0.97)", border: "3px solid #6b4f2a",
        borderRadius: 24, padding: "26px 30px",
        boxShadow: "0 14px 44px rgba(40,26,10,0.42)",
        transform: `translateY(${(1 - op) * 16}px)`,
      }}>
        <Img src={staticFile("qr_almanac.png")} style={{ width: 300, height: 300, borderRadius: 12, background: "#fff", padding: 14 }} />
        <div style={{ maxWidth: 300, fontFamily: "Georgia, 'EB Garamond', serif", color: "#3a2a14" }}>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.08, letterSpacing: 0.2 }}>The Plain Almanac</div>
          <div style={{ fontSize: 30, marginTop: 12, color: "#6b4f2a", fontStyle: "italic" }}>Scan for the free guide</div>
          <div style={{ fontSize: 22, marginTop: 8, color: "#7c6a4c" }}>— or the link in the description</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ventanas (en segundos) donde se menciona la guía → mostrar QR
const QR_WINDOWS: [number, number][] = [
  [903.0, 936.0],    // CTA #1 teaser (tras el ariete: "Amos & Rebecca laid the whole thing out")
  [1150.0, 1240.0],  // recap → CTA principal (+ "a little square you can scan")
];

export const MainWaterwell: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="waterwell_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {QR_WINDOWS.map(([s, e], i) => (
            <Sequence key={`qr${i}`} from={sec(s)} durationInFrames={sec(e - s)}>
              <QrCorner durF={sec(e - s)} />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
