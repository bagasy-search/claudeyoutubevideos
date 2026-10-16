// ctecsecad · entry Remotion (Claudio el Técnico: las 4 secadoras que compraría). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./ctecsecad/edl.json";
import AV from "./ctecsecad/avwin.json";
import * as H from "./ctecsecad/heroes";

setKit({ imgDir: "img/ctecsecad", ext: "png", clipDir: "broll/ctecsecad", avDir: "av/ctecsecad", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
