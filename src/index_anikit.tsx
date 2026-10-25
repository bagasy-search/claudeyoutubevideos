import React from "react";
import { Composition, registerRoot } from "remotion";
import { Muestrario } from "./anikit/Muestrario";
import { PruebaSets } from "./anikit/Sets";
import { ClipA } from "./anikit/clips/ClipA";
import { ClipB } from "./anikit/clips/ClipB";
import { ClipC } from "./anikit/clips/ClipC";
import { ClipD } from "./anikit/clips/ClipD";

const Root = () => (
  <>
    <Composition id="Sets" component={PruebaSets as any} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ set: "calle", x: 400, y: 0, zoom: 1, paleta: "awaken" }} />
    <Composition id="Muestrario" component={Muestrario} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="ClipA" component={ClipA} durationInFrames={900} fps={30} width={1920} height={1080} />
    <Composition id="ClipB" component={ClipB} durationInFrames={900} fps={30} width={1920} height={1080} />
    <Composition id="ClipC" component={ClipC} durationInFrames={900} fps={30} width={1920} height={1080} />
    <Composition id="ClipD" component={ClipD} durationInFrames={900} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
