// rhmoldcost · entry Remotion (Rhonda the Cleaning Lady). Kit lkit + edl del plan, acento azul del canal.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { C } from "./lkit/core";
import { makePlayer } from "./lkit/Player";
import EDL from "./rhmoldcost/edl.json";
import AV from "./rhmoldcost/avwin.json";
import * as H from "./rhmoldcost/heroes";

Object.assign(C, { lilac: "#2F6FA8", lilacDeep: "#1D3E66", sage: "#3C7A8C", tape: "#F2C230" });
setKit({ imgDir: "img/rhmoldcost", ext: "png", clipDir: "broll/rhmoldcost", avDir: "av/rhmoldcost", av: (AV as any).win, qr: "qr.jpg", cover: "book_cover.jpg" });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
