import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionStinger } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { CUES } from "./cues_quebracho.gen";

// ── EL CONSTRUCTOR LIBRE · MADERA #2 ─────────────────────────────────────────
// "La Madera Que Rompe El Hacha: 100 Años Sin Pudrirse" (quebracho · especie/historia).
// Avatar "Tomás" (quebracho_opt.mp4). ~23 min. Avatar OCULTO en demos/ScrollDocs.
// Documental pausado (historia/especie): hue terroso, SIN filtros de color.

const VIDEO_END = Math.max(...CUES.map((c) => c.start + c.dur)) + 1.5;
export const TOTAL_FRAMES_QB = Math.round(VIDEO_END * 30);

const HIDE = new Set(["raw", "scrolldoc", "diagram", "avpizarra", "journey", "infzoom", "headline", "aged", "bars", "cross", "process", "checklist", "splitlist", "callout", "annotated", "rule", "impact"]);
const VIS = new Set(["quote", "chips", "stat"]);
const FULL_SECS = new Set(["coment", "cierre"]);
const sectionOf = (key: string) => key.replace(/_\d+$/, "");

function buildWindows(): AvatarWindow[] {
  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  let visIdx = 0;
  const rotation: AvatarWindow["mode"][] = ["cornerTR", "cornerBR", "cornerTR", "cornerBL"];
  for (const c of CUES) {
    let mode: AvatarWindow["mode"];
    if (c.kind === "half") mode = "halfL";
    else if (HIDE.has(c.kind)) mode = "hidden";
    else if (VIS.has(c.kind)) {
      mode = FULL_SECS.has(sectionOf(c.key)) ? "full" : rotation[visIdx % rotation.length];
      visIdx++;
    } else mode = "hidden";
    if (mode !== last) { w.push({ start: c.start, mode }); last = mode; }
  }
  return w;
}
const AVATAR_WINDOWS = buildWindows();

const STINGER_SECS = ["ciencia", "dureza", "especies", "historia", "borrar", "usos", "faq", "caveat", "cta", "cierre"];
const SECTION_KEYS = new Set(CUES.filter((c) => /_0$/.test(c.key) && STINGER_SECS.includes(sectionOf(c.key))).map((c) => c.key));

export const MainQuebracho: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="quebracho_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {(() => {
            const hookEnd = CUES[0].start - 0.3;
            const from = 1.4, dur = Math.max(2, hookEnd - from);
            return (
              <Sequence from={sec(from)} durationInFrames={sec(dur)} layout="none">
                <AvatarScrimText durationInFrames={sec(dur)} setup="La madera que rompe el hacha" impact="100 AÑOS" impactAccent="amber" fontSize={160} />
              </Sequence>
            );
          })()}
          {[...SECTION_KEYS].map((k) => {
            const c = CUES.find((x) => x.key === k)!;
            return (
              <Sequence key={"stg" + k} from={sec(c.start) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
                <SectionStinger />
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </CinematicWrap>
      {[...SECTION_KEYS].map((k) => {
        const c = CUES.find((x) => x.key === k)!;
        return <SfxCue key={"sw" + k} at={sec(c.start) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />;
      })}
      {[...SECTION_KEYS].map((k) => {
        const c = CUES.find((x) => x.key === k)!;
        return <SfxCue key={"st" + k} at={sec(c.start)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />;
      })}
    </AbsoluteFill>
  );
};
