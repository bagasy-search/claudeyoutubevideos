import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainValmaicena, TOTAL_FRAMES_VALMAICENA } from "./valmaicena/Main_valmaicena";

const RootValmaicena: React.FC = () => (
  <Composition id="Valmaicena" component={MainValmaicena} durationInFrames={TOTAL_FRAMES_VALMAICENA} fps={30} width={1920} height={1080} />
);
registerRoot(RootValmaicena);
