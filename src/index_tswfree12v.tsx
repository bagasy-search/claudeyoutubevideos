// tswfree12v · entry Remotion (The Scrap WorkShop, estufa de aceite usado con ventilador 12V). Kit lkit + edl del plan.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import { C } from "./lkit/core";
import EDL from "./tswfree12v/edl.json";
import AV from "./tswfree12v/avwin.json";

// grain.png es transparente: el canal va sin grano ni filtros (regla del creador)
setKit({ imgDir: "img/tswfree12v", grain: "img/tswfree12v/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/tswfree12v", av: (AV as any).win });
// acento del taller: rojo óxido en vez del lila de Loretta
Object.assign(C, { lilac: "#D9A08F", lilacDeep: "#A3281E" });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
