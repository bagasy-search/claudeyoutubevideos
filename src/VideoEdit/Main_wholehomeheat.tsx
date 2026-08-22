import { AbsoluteFill, Sequence, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_wholehomeheat.gen";
import { AVATAR_WINDOWS, TOTAL_WHOLEHOMEHEAT } from "./avatar_wholehomeheat.gen";

export const TOTAL_FRAMES_WHOLEHOMEHEAT = Math.round(TOTAL_WHOLEHOMEHEAT * 30);

// ── QR de la guía en una esquina, durante las menciones a "The Plain Almanac" ──
// La voz nunca dice precio ni URL: el QR (theplainalmanac.vercel.app) y el "scan"
// viven EN PANTALLA. 300px — a 132px el creador lo rechazó porque no se escanea.
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

// Ventanas (segundos) donde la narración menciona la guía → se muestra el QR.
// Coinciden con las dos CtaCard del beatsheet, arrancando un pelo antes y quedándose
// después para que dé tiempo de sacar el teléfono.
const QR_WINDOWS: [number, number][] = [
  [695.0, 716.0],    // "there is a guide… the heating section has the sealing work"
  [1068.0, 1092.0],  // cierre: "the heating section… about ninety other household methods"
];

export const MainWholehomeheat: React.FC = () => {
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
          <AvatarLayer src="wholehomeheat_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
