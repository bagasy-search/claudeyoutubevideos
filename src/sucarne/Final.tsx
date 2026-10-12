// sucarne · Root final (60-961 s + apertura opcional). aperturaClip = clip hablado del gancho (lo arma otro agente);
// offset = segundos que se corre TODO el video (la apertura va antes). Sin aperturaClip y offset 0 = igual que R6b.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { fr } from "./Base";
import { Full961b } from "./Full961b";

export const FinalRoot: React.FC<{ aperturaClip?: string; offset?: number }> = ({ aperturaClip, offset = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {aperturaClip ? (
      <Sequence from={0} durationInFrames={fr(offset)}>
        <AbsoluteFill><OffthreadVideo src={staticFile(aperturaClip)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      </Sequence>
    ) : null}
    <Sequence from={fr(offset)}><Full961b /></Sequence>
  </AbsoluteFill>
);
