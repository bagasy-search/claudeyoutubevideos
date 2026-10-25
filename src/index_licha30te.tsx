import React from "react";
import { Composition, registerRoot } from "remotion";
import { makeLargo, Plan } from "./licha30/Largo";
import PL from "./licha30te/plan.json";
import AVW from "./licha30te/avwin.json";
import AV from "./licha30te/avail.json";
const { Largo, frames } = makeLargo(PL as unknown as Plan, AVW as never, AV);
const Root = () => <Composition id="Full" component={Largo} durationInFrames={frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
