import { AbsoluteFill, Sequence, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_amishdolly.gen";
import { AVATAR_WINDOWS, TOTAL_AMISHDOLLY, QR_WINDOWS } from "./avatar_amishdolly.gen";

export const TOTAL_FRAMES_AMISHDOLLY = Math.round(TOTAL_AMISHDOLLY * 30);

// ── QR del almanaque: aparece en una esquina durante las CTAs; más grande en el cierre ──
const QrCorner: React.FC<{ start: number; end: number; big: boolean }> = ({ start, end, big }) => {
  const f = useCurrentFrame();
  const t = f / 30 + start; // Sequence-relative → absoluto
  const fadeIn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const durF = (end - start) * 30;
  const fadeOut = interpolate(f, [durF - 12, durF], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(fadeIn, fadeOut);
  const size = big ? 230 : 150;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 54, bottom: big ? 96 : 84, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ padding: big ? 16 : 12, background: "#F4ECD8", borderRadius: 14, boxShadow: "0 10px 34px rgba(0,0,0,0.45)", border: "3px solid #6B4E2E" }}>
          <Img src={staticFile("img/amishdolly/qr_almanac.png")} style={{ width: size, height: size, display: "block", borderRadius: 4 }} />
        </div>
        <div style={{ fontFamily: "Georgia, 'EB Garamond', serif", fontWeight: 700, fontSize: big ? 30 : 22, color: "#F4ECD8", letterSpacing: 0.4, textShadow: "0 2px 10px rgba(0,0,0,0.85)", background: "rgba(40,28,16,0.72)", padding: big ? "7px 18px" : "5px 13px", borderRadius: 999 }}>
          {big ? "Scan for the guide" : "Free guide ↓"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MainAmishdolly: React.FC = () => {
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
          <AvatarLayer src="amishdolly_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {QR_WINDOWS.map((q, i) => (
            <Sequence key={`qr${i}`} from={sec(q.start)} durationInFrames={sec(q.end - q.start)}>
              <QrCorner start={q.start} end={q.end} big={q.big} />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
