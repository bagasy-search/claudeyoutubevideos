import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionStinger } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { CUES } from "./cues_maderarest.gen";

// ── EL CONSTRUCTOR LIBRE · subnicho MADERA ──────────────────────────────────
// "Oculta Desde 1932: La Mezcla De $1 Que Deja La Madera Vieja COMO NUEVA".
// Avatar "Tomás" (maderarest_opt.mp4 provee el audio de toda la narración) +
// flujo denso de imágenes/clips + diagramas. Paleta terrosa. ~11.7 min.
// SIN SectionGrade ni filtros de color (regla dura). CUES desde el beatsheet.

const VIDEO_END = Math.max(...CUES.map((c) => c.start + c.dur)) + 1.5;
export const TOTAL_FRAMES_MR = Math.round(VIDEO_END * 30);

// ── Ventanas del avatar derivadas de los CUES (variedad de posiciones) ──
const HIDE = new Set(["impact", "diagram", "journey", "infzoom", "rule", "headline", "aged", "bars", "cross", "process", "checklist", "splitlist", "costtally", "callout", "annotated"]);
const VIS = new Set(["raw", "quote", "chips", "stat"]);
// secciones donde el avatar va a PANTALLA COMPLETA cuando habla (personales)
const FULL_SECS = new Set(["ident", "cierre", "coment", "dudas"]);
const sectionOf = (key: string) => key.replace(/_\d+$/, "");

function buildWindows(): AvatarWindow[] {
  const w: AvatarWindow[] = [{ start: 0, mode: "full" }]; // ★ abre a pantalla completa ≥1s
  let last = "full";
  let visIdx = 0;
  const rotation: AvatarWindow["mode"][] = ["cornerTR", "cornerTR", "right", "cornerTR", "left"];
  for (const c of CUES) {
    let mode: AvatarWindow["mode"];
    if (c.kind === "half") mode = "halfL";        // imagen mitad derecha → avatar mitad izquierda, al ras
    else if (c.kind === "float") mode = "full";
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

// stingers/swells en fronteras de sección mayores (primer beat "_0" de estas secciones)
const STINGER_SECS = ["gris", "tres", "vinagre", "linaza", "trementina", "proporciones", "dudas", "aplicacion", "ocultaron", "cta2", "cierre"];
const SECTION_KEYS = new Set(CUES.filter((c) => /_0$/.test(c.key) && STINGER_SECS.includes(sectionOf(c.key))).map((c) => c.key));

export const MainMaderaRest: React.FC = () => {
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
          {/* AVATAR encima del b-roll — provee el audio de la narración SIEMPRE */}
          <AvatarLayer src="maderarest_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* HOOK: texto SOBRE el avatar vivo oscurecido; el macro del líquido entra en CUES[0] */}
          {(() => {
            const hookEnd = CUES[0].start - 0.3;
            const from = 1.4, dur = Math.max(2, hookEnd - from);
            return (
              <Sequence from={sec(from)} durationInFrames={sec(dur)} layout="none">
                <AvatarScrimText durationInFrames={sec(dur)} setup="La madera vieja, gris y muerta" impact="COMO NUEVA" impactAccent="amber" fontSize={140} />
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
