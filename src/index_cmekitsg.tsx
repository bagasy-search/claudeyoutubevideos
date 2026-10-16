// cmekitsg · entry Remotion (Claudio Mendoza Constructor). Kit lkit + edl del plan (sin héroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./cmekitsg/edl.json";
import AV from "./cmekitsg/avwin.json";

setKit({ imgDir: "img/cmekitsg", ext: "png", grain: "img/cmekitsg/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/cmekitsg", avDir: "av/cmekitsg", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
