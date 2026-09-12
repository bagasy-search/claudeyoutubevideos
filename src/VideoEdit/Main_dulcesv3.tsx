import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES, OVERLAYS } from "./cues_dulcesv3.gen";

// ── DULCES v3 — hook corregido + matcheo "editado a mano" (match_v3: autoría
// transcript-first + juez/verificador Haiku). 263 beats anclados al ms real de la
// narración v3 + componentes bespoke encima. Canal Abuela Rosa. Voz clonada anciana.
const SECONDS = 1604;
export const TOTAL_FRAMES_DULV3 = Math.round(SECONDS * 30); // 48120

// Inicios de sección (starts v3) → grade + stingers.
const ACTS = [0, 78.91, 140.33, 219.75, 277.16, 340.94, 399.73, 463.06, 521.33, 587.34, 642.64, 712.84, 785.96, 846.29, 911.88, 974.73, 1037.02, 1104.45, 1164.34, 1229.12, 1291.39, 1349.6, 1479.65];

const TINTS = ["#A9794A", "#6F8478", "#6E8B47", "#C8904A"];
const EMOTIONAL = new Set([21, 22]); // extras + cierre
const GRADE: GradeRange[] = ACTS.map((from, i) => ({
  from,
  to: ACTS[i + 1] ?? SECONDS,
  tint: EMOTIONAL.has(i) ? "#6F8478" : TINTS[i % TINTS.length],
  strength: EMOTIONAL.has(i) ? 0.08 : 0.06,
}));

export const MainDulcesV3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {/* capa 1 — clips/fotos pegados a cada frase */}
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* capa 2 — componentes bespoke encima en los momentos clave */}
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <SectionGrade ranges={GRADE} />
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      <Audio src={staticFile("dulcesv3.wav")} />
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
