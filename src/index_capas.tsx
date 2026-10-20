import React from "react";
import { Composition, registerRoot } from "remotion";
import { ProyectorVivo, TOTAL_FRAMES_PROYECTOR } from "./capas/ProyectorVivo";

const Root: React.FC = () => (
  <Composition id="ProyectorVivo" component={ProyectorVivo}
    durationInFrames={TOTAL_FRAMES_PROYECTOR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
