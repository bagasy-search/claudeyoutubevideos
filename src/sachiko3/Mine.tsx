import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

// Archive clip at FULL FRAME (16:9 cover), no frame, no bars (LECCIONES rule 22).
export const ArcFull: React.FC<{ src: string; a?: number; d?: number }> = ({ src }) => (
  <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
    <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

export const MINE = { ArcFull };
