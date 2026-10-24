// toallaeyes · el video entero desde el EDL de su idioma (media compartida EN+ES en public/reikoeyes). Render SÓLO en el farm.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { setP } from "./ojos/lib";
import { makeMain } from "./ojos/Main";
import EDL from "./toallaeyes/edl.json";
import AV from "./toallaeyes/avwin.json";
import AVAIL from "./toallaeyes/avail.json";
setP("reikoeyes/");
const { Main, frames } = makeMain({ slug: "toallaeyes", edl: EDL as any, av: AV as any, avail: AVAIL as any });
registerRoot(() => <Composition id="Full" component={Main} durationInFrames={frames} fps={30} width={1920} height={1080} />);
