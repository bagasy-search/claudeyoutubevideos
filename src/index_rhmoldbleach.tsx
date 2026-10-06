// Entry MÍNIMO solo-rhmoldbleach (farm). Uso: ENTRY=src/index_rhmoldbleach.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { RhMain } from "./rhonda/RhMain";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./rhmoldbleach/timeline.gen";

const Main: React.FC = () => <RhMain TL={TL} OV={OV} AUDIO={AUDIO} />;
const Root = () => <Composition id="Rhmoldbleach" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
