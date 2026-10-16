// ctecestufas · entry Remotion (Claudio el Técnico). Kit lkit + edl del plan, sin héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./ctecestufas/edl.json";
import AV from "./ctecestufas/avwin.json";

setKit({ imgDir: "img/ctecestufas", grain: "img/ctecestufas/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/ctecestufas", av: (AV as any).win });
export const Full = makePlayer(EDL as any, {} as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
