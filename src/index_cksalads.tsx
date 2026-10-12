// cksalads · entrada de Remotion (Loretta's Church Kitchen, 7 salads). Por ahora sólo el minuto 1 para stills.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Min1 } from "./cksalads/Min1";
import { Block7 } from "./cksalads/Block7";
import { Block6 } from "./cksalads/Block6";
import { Full } from "./cksalads/Full";
import { Block1 } from "./cksalads/Block1";
import { Block2 } from "./cksalads/Block2";
import { Block3 } from "./cksalads/Block3";
import { Block4 } from "./cksalads/Block4";
import { Block5 } from "./cksalads/Block5";
registerRoot(() => (
  <>
  <Composition id="Min1" component={Min1} durationInFrames={Math.round(62 * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Block7" component={Block7} durationInFrames={Math.round(198 * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Block6" component={Block6} durationInFrames={Math.round(325 * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Block5" component={Block5} durationInFrames={Math.round(484 * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Block4" component={Block4} durationInFrames={Math.round(630 * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Block3" component={Block3} durationInFrames={Math.round(759 * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Block2" component={Block2} durationInFrames={Math.round(888 * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Block1" component={Block1} durationInFrames={Math.round(1052 * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Full" component={Full} durationInFrames={Math.round(1090 * 30)} fps={30} width={1920} height={1080} />
  </>
));
