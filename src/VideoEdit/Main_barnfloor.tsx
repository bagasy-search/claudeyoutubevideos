import { AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_barnfloor.gen";
import { AVATAR_WINDOWS, TOTAL_BARNFLOOR } from "./avatar_barnfloor.gen";

// ── "Stop Paying to Fix Barn Floor Cracks — Do It the Cheap Amish Way" — Claudio Yoder (EN) ──
// Avatar de 10:01 EN BUCLE (horneado en barnfloor_opt.mp4 junto al master de audio de 20:38).
// El lipsync es exacto en los primeros 601,13s: ahí vive casi todo el tiempo de presentador.
// Después del bucle sólo hay respiros cortos. B-roll agnes + fotos de respaldo + 13 hero
// gpt-image-2 (ref del avatar) + kit premium THEME_EARTH con labels en INGLÉS.
export const TOTAL_FRAMES_BARNFLOOR = Math.round(TOTAL_BARNFLOOR * 30);

const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 12, 26, 32, TOTAL_BARNFLOOR - 8, TOTAL_BARNFLOOR],
    [0.05, 0.13, 0.16, 0.16, 0.09, 0.09, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("barnfloor_music.mp3")} loop volume={vol} />;
};

// ── QR de la guía en una esquina, SÓLO durante las menciones a "The Plain Almanac" ──
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

// ventanas (en segundos) donde se menciona la guía
const QR_WINDOWS: [number, number][] = [
  [484.5, 512.0],    // CTA sembrada: "there is an older couple over in Lancaster…"
  [1167.0, 1186.0],  // CTA de cierre: "the Plain Almanac has all of it… link above the description"
];

export const MainBarnfloor: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="barnfloor_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
          <MusicBed />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
