import "react";
import { Composition, registerRoot } from "remotion";
import { Tz03, TZ03_DUR } from "./tz03/tz03";

const Root = () => (
  <>
    <Composition id="Tz03" component={Tz03} durationInFrames={TZ03_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Tz03S" component={Tz03} durationInFrames={TZ03_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
  </>
);
registerRoot(Root);
