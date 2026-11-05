import React from "react";
import { Composition, registerRoot } from "remotion";
import { DiaD2, LARGO_DD2 } from "./kits/tomaclips/DiaD2";

const Raiz: React.FC = () => (
  <Composition id="DiaD2" component={DiaD2} durationInFrames={LARGO_DD2} fps={24} width={1920} height={1080} />
);
registerRoot(Raiz);
