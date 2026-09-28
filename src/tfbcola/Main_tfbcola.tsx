// Main_tfbcola.tsx — montaje VLOG de tfbcola: los mp4 continuos por escena (agnes-video-2.5-flash) como base, dentro
// de la cámara virtual (TfbCamera), la ficha a pantalla completa, y encima la capa de motion graphics `src/tfb/Tfb*`.
// Todo lo específico del video vive en timeline.gen.ts (lo genera vlog/tfbcola/montaje.mjs).
// ⛔ OffthreadVideo siempre (nunca <Video>). ⛔ El QR va SIN Ken-Burns, sobre blanco, en la capa de arriba.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile } from "remotion";
import { TfbCamera, TfbFlash } from "../tfb/TfbCamera";
import { TfbTitleSlam } from "../tfb/TfbTitleSlam";
import { TfbMagnifier } from "../tfb/TfbMagnifier";
import { TfbScribble } from "../tfb/TfbScribble";
import { TfbStepCounter } from "../tfb/TfbStepCounter";
import { TfbRecipeFlow } from "../tfb/TfbRecipeFlow";
import { TfbForceGauge } from "../tfb/TfbForceGauge";
import { TfbGlueSection } from "../tfb/TfbGlueSection";
import { TfbWipeCompare } from "../tfb/TfbWipeCompare";
import { TfbFreeze } from "../tfb/TfbFreeze";
import { TfbWarning, TfbTimerChip, TfbTag, TfbChecklist } from "../tfb/TfbBadges";
import { TfbLamina, TfbQrCard } from "../tfb/TfbLamina";
import { SEGS, CAM, CUES, SFX, MUSIC, VOICE, AMB, TOTAL_FRAMES_TFBCOLA } from "./timeline.gen";
export { TOTAL_FRAMES_TFBCOLA };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REG: Record<string, React.FC<any>> = { TfbTitleSlam, TfbMagnifier, TfbScribble, TfbStepCounter, TfbRecipeFlow, TfbForceGauge, TfbGlueSection,
  TfbWipeCompare, TfbFreeze, TfbWarning, TfbTimerChip, TfbTag, TfbChecklist, TfbLamina, TfbQrCard, TfbFlash };

export const MainTfbcola: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <TfbCamera events={CAM}>
      {SEGS.map((s) => (
        <Sequence key={s.key} from={s.from} durationInFrames={s.dur} layout="none">
          {s.kind === "video" ? (
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </AbsoluteFill>
          ) : (
            <TfbLamina src={s.src} dur={s.dur} stops={s.stops ?? [{ f: 0, x: 50, y: 50, z: 1 }]} />
          )}
        </Sequence>
      ))}
    </TfbCamera>
    {CUES.map((c) => {
      const C = REG[c.kind];
      return (
        <Sequence key={c.key} from={c.from} durationInFrames={c.dur} layout="none">
          <C {...c.props} dur={c.dur} />
        </Sequence>
      );
    })}
    <Audio src={staticFile(VOICE)} />
    {AMB && <Audio src={staticFile(AMB.src)} loop volume={AMB.vol} />}
    {MUSIC.map((m) => (
      <Sequence key={m.key} from={m.from} durationInFrames={m.dur} layout="none">
        <Audio src={staticFile(m.src)} loop startFrom={m.startFrom ?? 0}
          volume={(f) => interpolate(f, [0, m.fadeIn, m.dur - m.fadeOut, m.dur], [0, m.vol, m.vol, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
    ))}
    {SFX.map((s) => (
      <Sequence key={s.key} from={s.from} durationInFrames={s.dur} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
