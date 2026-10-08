// index_ohfflame.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOhfflame, TOTAL_FRAMES_OHFFLAME } from "./ohfflame/Main_ohfflame";

const Root: React.FC = () => (
  <Composition id="Ohfflame" component={MainOhfflame}
    durationInFrames={TOTAL_FRAMES_OHFFLAME} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
