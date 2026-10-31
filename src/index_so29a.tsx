import React from "react";
import { Composition, registerRoot } from "remotion";
import { Body, END } from "./so29a/Body";
import { PoseLab } from "./so29a/set3d";
import { HeroLab } from "./so29a/Body";
const Root = () => (
  <>
    <Composition id="Full" component={Body} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="HeroLab" component={HeroLab} durationInFrames={160} fps={30} width={1920} height={1080} />
    <Composition id="PoseLab" component={PoseLab} durationInFrames={28} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
