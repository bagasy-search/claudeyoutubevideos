import React from "react";
import { AbsoluteFill, Composition, OffthreadVideo, registerRoot, staticFile } from "remotion";
import { CamaraMano } from "./kits/camara/CamaraMano";

// Prueba de 8 s de la cámara a mano sobre un avatar
const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <CamaraMano>
      <OffthreadVideo src={staticFile("camtest01/av.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </CamaraMano>
  </AbsoluteFill>
);

const Root = () => <Composition id="Full" component={Full} durationInFrames={240} fps={30} width={1920} height={1080} />;
registerRoot(Root);
