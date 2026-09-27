// index_ctec4lav.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCtec4lav, TOTAL_FRAMES_CTEC4LAV } from "./ctec4lav/Main_ctec4lav";

const Root: React.FC = () => (
  <Composition id="Ctec4lav" component={MainCtec4lav}
    durationInFrames={TOTAL_FRAMES_CTEC4LAV} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
