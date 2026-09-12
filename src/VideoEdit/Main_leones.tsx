import { AbsoluteFill, Sequence, Audio, staticFile, Loop, useCurrentFrame, interpolate } from "remotion";
import { sec } from "./theme";

// cross-dissolve sutil entre tomas (estética documental NatGeo, no corte duro seco)
const DIS = 10; // ~0.33s
const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, DIS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_leones.gen";

// ── SERENGETI (prueba 1 min) — documental FACELESS de fauna, voz clonada ──
// Clips reales distintos (public/broll/le_*), ordenados a la curva teaser→establishing.
// SIN filtros de color (grain 0, vignette 0). Cross-dissolves suaves. Música baja + SFX puntual.
const INTRO = 4.0; // cold-open teaser antes de la narración (todo corre +INTRO)
const SECONDS = 64.5;
export const TOTAL_FRAMES_LEO = Math.round(SECONDS * 30);

export const MainLeones: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* SIN filtros: grano 0, viñeta 0 — colores 100% naturales */}
      <CinematicWrap handheld={0} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.4} />
          {CUES.map((cue, i) => {
            const from = i === 0 ? sec(cue.start) : sec(cue.start) - DIS;
            const dur = i === 0 ? sec(cue.dur) : sec(cue.dur) + DIS;
            return (
              <Sequence key={cue.key} from={from} durationInFrames={dur}>
                <FadeIn on={i !== 0}>{cue.el(dur)}</FadeIn>
              </Sequence>
            );
          })}
          {/* CAPA DE OVERLAYS: componentes ENCIMA del clip */}
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>

      {/* NARRACIÓN: voz clonada, arranca después del cold-open teaser (+INTRO) */}
      <Sequence from={sec(INTRO)}>
        <Audio src={staticFile("leones.wav")} />
      </Sequence>

      {/* MÚSICA: score de fauna en loop a volumen BAJO bajo toda la narración */}
      <Loop durationInFrames={Math.round(120 * 30)}>
        <Audio src={staticFile("castores_music.mp3")} volume={0.12} />
      </Loop>

      {/* SFX puntuales: swell al entrar la narración + booms en el clímax de la caza */}
      <SfxCue at={sec(INTRO) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      <SfxCue at={sec(4.0)} src={SFX.whoosh} volume={0.2} durationInFrames={sec(1.2)} />
      {/* clímax "El primer salto falla. El segundo, no." */}
      <SfxCue at={sec(49.65)} src={SFX.boom1} volume={0.32} durationInFrames={sec(1.4)} />
      <SfxCue at={sec(51.8)} src={SFX.boom2} volume={0.4} durationInFrames={sec(1.6)} />
      {/* número rodando en la cifra 40°C */}
      <SfxCue at={sec(28.2)} src={SFX.numberRoll} volume={0.24} durationInFrames={sec(1.4)} />
    </AbsoluteFill>
  );
};
