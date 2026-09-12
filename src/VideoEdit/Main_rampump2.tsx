import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_rampump2.gen";
import { AVATAR_WINDOWS, TOTAL_RAMPUMP2 } from "./avatar_rampump2.gen";

// ── "Build This Amish Water Pump That Runs Forever on No Power ($40)" ──
// REMAKE mejor+más largo del ariete (hit 2.4K) · canal claudio yoder · HOW-TO.
// clips-first + componentes a medida (RamPumpCycle) + PASADA 3 de OVERLAYS densos
// (data tags, partes, frases, 3 menciones de guía) ENCIMA del footage.
// Capas: fondo → clips/componentes (CUES) → avatar PiP (cornerBR quieto) → OVERLAYS.
export const TOTAL_FRAMES_RAMPUMP2 = Math.round(TOTAL_RAMPUMP2 * 30);

export const MainRampump2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="cold" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="rampump2_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* ★ OVERLAYS — tags/datos/frases + menciones de guía ENCIMA de clips y avatar */}
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
