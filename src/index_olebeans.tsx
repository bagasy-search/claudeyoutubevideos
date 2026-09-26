// index_olebeans.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOlebeans, TOTAL_FRAMES_OLEBEANS } from "./olebeans/Main_olebeans";

const Root: React.FC = () => (
  <Composition id="Olebeans" component={MainOlebeans}
    durationInFrames={TOTAL_FRAMES_OLEBEANS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
