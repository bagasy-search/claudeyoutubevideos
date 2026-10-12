// sucarne · entrada de Remotion. "Min1" = minuto 1 (0-60 s). "Rest400" = 0-400 s (R5).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Min1 } from "./sucarne/Min1";
import { Rest400 } from "./sucarne/Rest";
import { Full961 } from "./sucarne/Full961";
import { Full961b } from "./sucarne/Full961b";
import { FinalRoot } from "./sucarne/Final";
import { Pasada2 } from "./sucarne/Pasada2";
registerRoot(() => (
  <>
    <Composition id="Min1" component={Min1} durationInFrames={60 * 30} fps={30} width={1920} height={1080} />
    <Composition id="Rest400" component={Rest400} durationInFrames={400 * 30} fps={30} width={1920} height={1080} />
    <Composition id="Full961" component={Full961} durationInFrames={961 * 30} fps={30} width={1920} height={1080} />
    <Composition id="Full961b" component={Full961b} durationInFrames={961 * 30} fps={30} width={1920} height={1080} />
    <Composition id="Pasada2" component={Pasada2} durationInFrames={961 * 30} fps={30} width={1920} height={1080} />
    <Composition id="Final961" component={FinalRoot} durationInFrames={961 * 30} fps={30} width={1920} height={1080} defaultProps={{ aperturaClip: undefined, offset: 0 }} />
  </>
));
