import React from "react";
import {Composition} from "remotion";
import {DIYHydrogenOxygen} from "./Video";

export const FPS = 30;
export const DURATION_SECONDS = 1148.46;

export const Root: React.FC = () => {
  return (
    <Composition
      id="DIYHydrogenOxygen"
      component={DIYHydrogenOxygen}
      durationInFrames={Math.ceil(DURATION_SECONDS * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
