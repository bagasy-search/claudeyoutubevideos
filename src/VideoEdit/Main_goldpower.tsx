import { AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_goldpower.gen";
import { AVATAR_WINDOWS, TOTAL_GOLDPOWER } from "./avatar_goldpower.gen";

// ── "7 Cheap Amish Items Worth More Than Gold When the Power Goes Out" — Claudio Yoder (EN) ──
// Avatar EN BUCLE (10:10 ×2.05) como fondo garantizado + b-roll real (Pexels) + imágenes
// gpt-image-2 low (presentador con ref del avatar) + kit premium THEME_EARTH (labels en inglés).
// ⛔ El mp4 del avatar se encodeó SIN AUDIO a propósito (su audio sólo cubriría los primeros
//    10:10 y se repetiría mal en la 2ª vuelta). La voz viene del master completo goldpower.wav.
export const TOTAL_FRAMES_GOLDPOWER = Math.round(TOTAL_GOLDPOWER * 30);

const Narration: React.FC = () => <Audio src={staticFile("goldpower.wav")} />;

const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 10, 24, 30, TOTAL_GOLDPOWER - 8, TOTAL_GOLDPOWER],
    [0.05, 0.11, 0.14, 0.14, 0.09, 0.09, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("goldpower_music.mp3")} loop volume={vol} />;
};

// QR a la landing de la guía — SOLO en las ventanas donde la voz menciona el almanaque.
// Tamaño grande a propósito: a 132px el creador lo rechazó porque no se escanea en el celular.
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
          <div style={{ fontSize: 30, marginTop: 12, color: "#6b4f2a", fontStyle: "italic" }}>Scan for the guide</div>
          <div style={{ fontSize: 22, marginTop: 8, color: "#7c6a4c" }}>— or the link in the description</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ventanas (en segundos) donde la voz menciona la guía → mostrar QR
const QR_WINDOWS: [number, number][] = [
  [610.3, 645.0],    // CTA #1 — "where to write all this down" (sección del agua)
  [1104.0, 1140.0],  // CTA #2 — "if you want the whole thing written down"
];

export const MainGoldpower: React.FC = () => {
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
          <AvatarLayer src="goldpower_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {QR_WINDOWS.map(([s, e], i) => (
            <Sequence key={`qr${i}`} from={sec(s)} durationInFrames={sec(e - s)}>
              <QrCorner durF={sec(e - s)} />
            </Sequence>
          ))}
          <Narration />
          <MusicBed />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
