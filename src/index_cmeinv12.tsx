// cmeinv12 · entry Remotion (Claudio Mendoza Constructor). Kit lkit + edl del plan (sin héroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./cmeinv12/edl.json";
import AV from "./cmeinv12/avwin.json";

setKit({ imgDir: "img/cmeinv12", ext: "png", grain: "img/cmeinv12/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/cmeinv12", avDir: "av/cmeinv12", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
