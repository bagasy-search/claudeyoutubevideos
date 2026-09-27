// index_olebreakfast.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOlebreakfast, TOTAL_FRAMES_OLEBREAKFAST } from "./olebreakfast/Main_olebreakfast";

const Root: React.FC = () => (
  <Composition id="Olebreakfast" component={MainOlebreakfast}
    durationInFrames={TOTAL_FRAMES_OLEBREAKFAST} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
