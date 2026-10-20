import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, FULL_FRAMES } from "./apex07/Full";
import { Scene } from "./apex07/Escenas";
// AP7SC = una escena ilustrada sola (para stills de revisión): props {name, d}
const Sc: React.FC<{ name: string; d: number }> = ({ name, d }) => <Scene name={name} d={d} />;
const Root = () => (
  <>
    <Composition id="AP7FULL" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP7SC" component={Sc} durationInFrames={900} fps={30} width={1920} height={1080} defaultProps={{ name: "dusk", d: 450 }} />
  </>
);
registerRoot(Root);
