import React from "react"; import { registerRoot, Composition } from "remotion"; import { setKit } from "./lkit"; import { makePlayer } from "./lkit/Player";
import EDL from "./cfllina/edl.json"; import AV from "./cfllina/avwin.json";
setKit({ imgDir: "img/cfllina", grain: "img/cfllina/grain.png", qr: "qr.jpg", cover: "landing.jpg", clipDir: "clips/cfllina", av: (AV as any).win });
export const Full = makePlayer(EDL as any, {} as any); const TOTAL_S = (EDL as any).end as number;
registerRoot(() => (<Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />));
