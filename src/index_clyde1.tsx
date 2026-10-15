// clyde1 · entry Remotion (Clyde's Smokehouse, ribs 1958). Kit lkit + edl del plan; paleta de ahumadero (cuero/nogal) en vez de la lila de Loretta.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { C } from "./lkit/core";
import { makePlayer } from "./lkit/Player";
import EDL from "./clyde1/edl.json";
import AV from "./clyde1/avwin.json";

Object.assign(C, { lilac: "#D9B27C", lilacDeep: "#7A3E1C", sage: "#5E6B34" });
setKit({ imgDir: "img/clyde1", grain: "img/clyde1/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/clyde1", avDir: "av/clyde1", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
