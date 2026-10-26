import "react";
import { Composition, registerRoot } from "remotion";
import { Tz04, TZ04_DUR } from "./tz04/tz04";

const Root = () => (
  <>
    <Composition id="Tz04" component={Tz04} durationInFrames={TZ04_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Tz04S" component={Tz04} durationInFrames={TZ04_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
  </>
);
registerRoot(Root);
