// index_fbrefrac.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFbrefrac, TOTAL_FRAMES_FBREFRAC } from "./fbrefrac/Main_fbrefrac";

const Root: React.FC = () => (
  <Composition id="Fbrefrac" component={MainFbrefrac}
    durationInFrames={TOTAL_FRAMES_FBREFRAC} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
