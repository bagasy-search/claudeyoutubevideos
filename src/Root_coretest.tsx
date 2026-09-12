import { AbsoluteFill, Composition, Sequence } from "remotion";
import { RawShot } from "./VideoEdit/scenes/RawShot";
import { AudioBed, SfxRail } from "./VideoEdit/components/AudioBed";

// Smoke-test del CORE nuevo (jul 2026): anti-congelado (clipDur << beat → loop),
// Ken-Burns por duración, trans (fade de sección), grade (normalización), kbPhase,
// AudioBed (ducking) y SfxRail. Solo para stills de verificación — no es un video.
const CoreTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* beat 20s con clip de ~6s → rate clamp + LOOP (antes: frame congelado 14s) */}
    <Sequence from={0} durationInFrames={600}>
      <RawShot
        durationInFrames={600}
        src="broll/vt_hot_night_no_sleep.mp4"
        clipDur={6}
        grade="brightness(1.05) saturate(0.95)"
        trans={9}
        darken={0}
      />
    </Sequence>
    {/* imagen con kbPhase (split B) y focus */}
    <Sequence from={600} durationInFrames={240}>
      <RawShot
        durationInFrames={240}
        src="real/vt_fan_blowing_warm_air.png"
        kbPhase={2}
        focus="62% 40%"
        darken={0}
      />
    </Sequence>
    <AudioBed
      src="sfx/amb_campo.mp3"
      activity={[[0.5, 3.2], [4.0, 8.5], [10.2, 14.0]]}
      totalSec={28}
    />
    <SfxRail cues={[{ at: 0.3, role: "transition" }, { at: 20.1, role: "popUp" }]} />
  </AbsoluteFill>
);

export const RootCoreTest: React.FC = () => (
  <Composition id="CoreTest" component={CoreTest} durationInFrames={840} fps={30} width={1920} height={1080} />
);
