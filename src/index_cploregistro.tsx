// cploregistro · entry Remotion (Claudio el Plomero: destapar el registro con una manguera). Kit lkit en español + edl del plan.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./cploregistro/edl.json";
import AV from "./cploregistro/avwin.json";

setKit({
  imgDir: "img/cploregistro", grain: "img/cploregistro/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/cploregistro", av: (AV as any).win,
  tx: { of: "DE", instead: "EN VEZ DE ESO:", realVid: "VIDEO REAL", realPhoto: "FOTO REAL", coming: "YA VIENE", mistake: "EL ERROR", chapter: "CAPÍTULO", swapHead: "LO QUE SÍ SIRVE", swapOld: "LO QUE HACE TODO EL MUNDO", item: "PASO", step: "PASO", addComment: "AGREGA UN COMENTARIO…" },
  colors: { lilac: "#8FA9C8", lilacDeep: "#23395B" },
});
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
