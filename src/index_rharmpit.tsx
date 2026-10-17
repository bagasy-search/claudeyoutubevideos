// rharmpit · entry Remotion (Rhonda the Cleaning Lady). Kit lkit + edl del plan, acento azul del canal.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { C } from "./lkit/core";
import { makePlayer } from "./lkit/Player";
import EDL from "./rharmpit/edl.json";
import AV from "./rharmpit/avwin.json";
import * as H from "./rharmpit/heroes";

Object.assign(C, { lilac: "#2F6FA8", lilacDeep: "#1D3E66", sage: "#3C7A8C", tape: "#F2C230" });
setKit({ imgDir: "img/rharmpit", ext: "png", clipDir: "broll/rharmpit", avDir: "av/rharmpit", av: (AV as any).win, qr: "qr.jpg", cover: "book_cover.jpg" });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
