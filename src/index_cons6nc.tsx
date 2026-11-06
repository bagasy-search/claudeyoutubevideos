// Entry MÍNIMO solo-cons6nc (farm). Uso: ENTRY=src/index_cons6nc.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClMain } from "./claudio/ClMain";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./cons6nc/timeline.gen";

const Main: React.FC = () => <ClMain TL={TL} OV={OV} AUDIO={AUDIO} />;
const Root = () => <Composition id="Cons6nc" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
