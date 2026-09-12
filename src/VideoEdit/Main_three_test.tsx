import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { City3D, Globe3D, Number3D } from "./three/Scene3D";

export const TOTAL_FRAMES_3DTEST = 360; // 12s @30

export const MainThreeTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#05070d" }}>
    <Sequence from={0} durationInFrames={120} name="city"><City3D /></Sequence>
    <Sequence from={120} durationInFrames={120} name="globe"><Globe3D /></Sequence>
    <Sequence from={240} durationInFrames={120} name="number"><Number3D num="04" country="THAILAND" accent="#FFC400" /></Sequence>
  </AbsoluteFill>
);

export default MainThreeTest;
