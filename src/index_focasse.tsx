// Entry MÍNIMO solo-focasse (farm). Uso: ENTRY=src/index_focasse.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { LorMain } from "./loretta/LorMain";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./focasse/timeline.gen";

const Main: React.FC = () => <LorMain TL={TL} OV={OV} AUDIO={AUDIO} />;
const Root = () => <Composition id="Focasse" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
