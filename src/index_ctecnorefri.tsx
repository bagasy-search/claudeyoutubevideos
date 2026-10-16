// ctecnorefri · entry Remotion (Claudio el Técnico: refrigeradores que nunca compraría). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./ctecnorefri/edl.json";
import AV from "./ctecnorefri/avwin.json";
import * as H from "./ctecnorefri/heroes";

setKit({ imgDir: "img/ctecnorefri", ext: "png", clipDir: "broll/ctecnorefri", avDir: "av/ctecnorefri", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
