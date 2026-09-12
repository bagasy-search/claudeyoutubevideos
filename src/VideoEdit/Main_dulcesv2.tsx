import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES, OVERLAYS } from "./cues_dulcesv2.gen";

// ── DULCES v2 — clips pegados a cada frase (252 beats anclados al ms real de la
// narración) + componentes bespoke encima (OVERLAYS: topdulce/fichadulce/cita…).
// Reusa audio, kit y componentes de v1. Canal Abuela Rosa. Voz clonada anciana.
const SECONDS = 1605;
export const TOTAL_FRAMES_DULV2 = Math.round(SECONDS * 30); // 48150

// Inicios de sección (firstMs de cada dulce en match_dulcesv2.json) → grade + stingers.
const ACTS = [0, 84.31, 144.82, 224.64, 280.43, 341.56, 400.3, 466.21, 522.74, 584.94, 647.12, 711.04, 790.0, 845.61, 908.05, 971.49, 1034.81, 1098.9, 1162.58, 1229.01, 1292.6, 1357.11, 1486.35];

const TINTS = ["#A9794A", "#6F8478", "#6E8B47", "#C8904A"];
const EMOTIONAL = new Set([21, 22]); // extras + cierre
const GRADE: GradeRange[] = ACTS.map((from, i) => ({
  from,
  to: ACTS[i + 1] ?? SECONDS,
  tint: EMOTIONAL.has(i) ? "#6F8478" : TINTS[i % TINTS.length],
  strength: EMOTIONAL.has(i) ? 0.08 : 0.06,
}));

export const MainDulcesV2: React.FC = () => {
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
      <Audio src={staticFile("dulces.wav")} />
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
