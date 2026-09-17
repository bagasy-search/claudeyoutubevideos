import { Composition, registerRoot } from "remotion";
import React from "react";
import { KitTest, KT_FRAMES } from "./valmaicena/KitTest";
registerRoot(() => <Composition id="VmzKitTest" component={KitTest} durationInFrames={KT_FRAMES} fps={30} width={1920} height={1080} />);
