// Main_tfbtanque.tsx — montaje del VLOG: el video base (todas las escenas agnes-2.5-flash pegadas, 30 fps CFR) bajo una
// cámara virtual, y encima la capa de motion graphics frame a frame de src/tfb/. Audio = UNA pista ya mezclada
// (voz máster + foley + música + SFX, medida con silencedetect antes del render).
// ⛔ OffthreadVideo siempre (nunca <Video>). ⛔ El QR va SIN Ken-Burns, sobre blanco (TfbCta).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";
import { TfbCamera } from "../tfb/TfbCamera";
import { TfbZoomCircle } from "../tfb/TfbZoomCircle";
import { TfbMark } from "../tfb/TfbMark";
import { TfbWord } from "../tfb/TfbWord";
import { TfbStep } from "../tfb/TfbStep";
import { TfbPlasticID } from "../tfb/TfbPlasticID";
import { TfbCrackStop } from "../tfb/TfbCrackStop";
import { TfbWeldSection } from "../tfb/TfbWeldSection";
import { TfbLeakTest } from "../tfb/TfbLeakTest";
import { TfbTriptych } from "../tfb/TfbTriptych";
import { TfbWipe } from "../tfb/TfbWipe";
import { TfbDropTest } from "../tfb/TfbDropTest";
import { TfbTeaser } from "../tfb/TfbTeaser";
import { TfbList } from "../tfb/TfbList";
import { TfbLamina } from "../tfb/TfbLamina";
import { TfbCta } from "../tfb/TfbCta";
import { TfbFlash } from "../tfb/TfbFlash";
import { BASE, AUDIO, CAM, OVER, TOTAL_FRAMES_TFBTANQUE } from "./timeline.gen";
export { TOTAL_FRAMES_TFBTANQUE };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KINDS: Record<string, React.FC<any>> = {
  zoom: TfbZoomCircle, mark: TfbMark, word: TfbWord, step: TfbStep, plastic: TfbPlasticID, crack: TfbCrackStop, weld: TfbWeldSection,
  leak: TfbLeakTest, triptych: TfbTriptych, wipe: TfbWipe, drop: TfbDropTest, teaser: TfbTeaser, list: TfbList, lamina: TfbLamina, cta: TfbCta, flash: TfbFlash,
};

export const MainTfbtanque: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <TfbCamera events={CAM}>
      <OffthreadVideo src={staticFile(BASE)} muted style={{ width: "100%", height: "100%" }} />
    </TfbCamera>
    {OVER.map((o, i) => {
      const K = KINDS[o.kind];
      if (!K) throw new Error("kind desconocido: " + o.kind);
      return (
        <Sequence key={i} from={o.from} durationInFrames={o.dur} layout="none">
          <K dur={o.dur} {...o.props} />
        </Sequence>
      );
    })}
    <Audio src={staticFile(AUDIO)} />
  </AbsoluteFill>
);
