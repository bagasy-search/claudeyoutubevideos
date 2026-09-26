// index_cploerror.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCploerror, TOTAL_FRAMES_CPLOERROR } from "./cploerror/Main_cploerror";

const Root: React.FC = () => (
  <Composition id="Cploerror" component={MainCploerror}
    durationInFrames={TOTAL_FRAMES_CPLOERROR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
