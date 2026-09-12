import React from "react";
import {Composition} from "remotion";
import {MainFederer886, TOTAL_FRAMES_FED886} from "./VideoEdit/Main_federer886";
import {
  FloatingAdvice3D,
  FLOATING_ADVICE_3D_FRAMES,
} from "./VideoEdit/FloatingAdvice3D";
import {
  DrVallerQuote,
  DR_VALLER_QUOTE_FRAMES,
} from "./VideoEdit/DrVallerQuote";

export const Federer886Root: React.FC = () => (
  <>
    <Composition
      id="Federer886"
      component={MainFederer886}
      durationInFrames={TOTAL_FRAMES_FED886}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="FedAdviceCards3D"
      component={FloatingAdvice3D}
      durationInFrames={FLOATING_ADVICE_3D_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="FedVallerQuote"
      component={DrVallerQuote}
      durationInFrames={DR_VALLER_QUOTE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
