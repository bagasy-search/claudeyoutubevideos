import React from "react";
import { Composition, registerRoot } from "remotion";
import {
  MainV7ior5j7vkw9,
  TOTAL_FRAMES_V7IOR5J7VKW9,
} from "./VideoEdit/Main_v7ior5j7vkw9";

const RootV7ior5j7vkw9: React.FC = () => (
  <Composition
    id="V7ior5j7vkw9"
    component={MainV7ior5j7vkw9}
    durationInFrames={TOTAL_FRAMES_V7IOR5J7VKW9}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootV7ior5j7vkw9);
