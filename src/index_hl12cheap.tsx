// index_hl12cheap.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHl12cheap, TOTAL_FRAMES_HL12CHEAP } from "./hl12cheap/Main_hl12cheap";

const Root: React.FC = () => (
  <Composition id="Hl12cheap" component={MainHl12cheap}
    durationInFrames={TOTAL_FRAMES_HL12CHEAP} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
