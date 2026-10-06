// Entry MÍNIMO solo-lorroast (farm). Uso: ENTRY=src/index_lorroast.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { LorMain } from "./loretta/LorMain";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./lorroast/timeline.gen";

const Main: React.FC = () => <LorMain TL={TL} OV={OV} AUDIO={AUDIO} />;
const Root = () => <Composition id="Lorroast" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
