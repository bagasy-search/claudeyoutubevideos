import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_ventilador.gen";
import { AVATAR_WINDOWS, TOTAL_VENTILADOR } from "./avatar_ventilador.gen";

// ── "Convertí un ventilador viejo en aire acondicionado con 2 botellas congeladas" —
// Constructor Libre · Tomás ── CLIPS-FIRST: 30 clips reales + 76 imágenes reales, cada
// asset usado una sola vez. Componentes hero VentiladorKit (22 overlays a medida:
// eyebrowkicker, frictioncard, secretsealcard, promisechecklist, fanfailproof,
// evaporationphysics, fanbottleassembly, wrongvsrightplacement, bottlesizegauge,
// saltphysicsdiagram, stepbystepbuild, driptraycallout, rotationcyclediagram,
// oldtimersstamp, mythbustercard, costvscard, distancelimitwarning, threelegsdiagram,
// nightdaycycle, recapnumberedlist, manualctacard, nextvideoteaser).
export const TOTAL_FRAMES_VENTILADOR = Math.round(TOTAL_VENTILADOR * 30);

export const MainVentilador: React.FC = () => {
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
          <AvatarLayer src="ventilador_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
