// Entry de arboles60 — explainer animado 2D (60 fps) «Hay más árboles que estrellas en la Vía Láctea».
import { registerRoot, Composition } from "remotion";
import React from "react";
import { Full } from "./arboles60/Full";
import { CharSheet } from "./arboles60/CharSheet";
import { END, FPS } from "./arboles60/lib";

const Root: React.FC = () => (
  <>
    <Composition id="Full" component={Full} durationInFrames={Math.ceil(END * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="CharSheet" component={CharSheet} durationInFrames={60} fps={FPS} width={1920} height={1080} />
  </>
);

registerRoot(Root);
