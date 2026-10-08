// Entry MÍNIMO solo-mecbebe (farm). Uso: ENTRY=src/index_mecbebe.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClMain } from "./claudio/ClMain";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./mecbebe/timeline.gen";

const Main: React.FC = () => <ClMain TL={TL} OV={OV} AUDIO={AUDIO} />;
const Root = () => <Composition id="Mecbebe" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
