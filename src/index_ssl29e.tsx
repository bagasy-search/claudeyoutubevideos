import React from "react";
import { Composition, registerRoot } from "remotion";
import { Body, END } from "./ssl29e/Body";
import { PoseLab } from "./ssl29e/set3d";
import { HeroLab } from "./ssl29e/Body";
import { Probe } from "./ssl29e/mv";
const Root = () => (
  <>
    <Composition id="Full" component={Body} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="HeroLab" component={HeroLab} durationInFrames={170} fps={30} width={1920} height={1080} />
    <Composition id="Probe" component={Probe} durationInFrames={20} fps={30} width={1920} height={1080} />
    <Composition id="PoseLab" component={PoseLab} durationInFrames={28} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
