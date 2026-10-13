// index_cmv4lavadora.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmv4lavadora, TOTAL_FRAMES_CMV4LAVADORA } from "./cmv4lavadora/Main_cmv4lavadora";

const Root: React.FC = () => (
  <Composition id="Cmv4lavadora" component={MainCmv4lavadora}
    durationInFrames={TOTAL_FRAMES_CMV4LAVADORA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
