// mecnafta · entrada de Remotion (composición "Full")
import React from "react";
import { registerRoot, Composition } from "remotion";
import { FullM, TOTAL_FRAMES } from "./mecnafta/FullM";
const Root: React.FC = () => <Composition id="Full" component={FullM} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
