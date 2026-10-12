// fhkitchen · línea v2: el video es el Player de lkit sobre edl.json (sin código de componentes propio).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./fhkitchen/edl.json";
import AV from "./fhkitchen/avwin.json";
setKit({ imgDir: "img/fhkitchen", grain: "img/fhkitchen/grain.png", qr: "qr.jpg", cover: "book_cover.png", av: (AV as any).win, avLead: 0.2 });
const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end;
registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
