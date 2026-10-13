// alpintura · entrada de Remotion (composición "Full", 1920x1080, 30 fps)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { FullA, TOTAL_FRAMES } from "./alpintura/FullA";

const Root: React.FC = () => <Composition id="Full" component={FullA} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
