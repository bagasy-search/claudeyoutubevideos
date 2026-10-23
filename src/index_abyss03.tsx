import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, FULL_FRAMES } from "./abyss03/Full";
import { Scene } from "./abyss03/Escenas";
// AB3SC = una escena ilustrada sola (para stills de revisión): props {name, d}
const Sc: React.FC<{ name: string; d: number }> = ({ name, d }) => <Scene name={name} d={d} />;
const Root = () => (
  <>
    <Composition id="AB3FULL" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AB3SC" component={Sc} durationInFrames={900} fps={30} width={1920} height={1080} defaultProps={{ name: "overboard", d: 450 }} />
  </>
);
registerRoot(Root);
