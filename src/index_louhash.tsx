// index_louhash.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainLouhash, TOTAL_FRAMES_LOUHASH } from "./louhash/Main_louhash";

const Root: React.FC = () => (
  <Composition id="Louhash" component={MainLouhash}
    durationInFrames={TOTAL_FRAMES_LOUHASH} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
