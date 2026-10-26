import { Composition, registerRoot } from "remotion";
import { Tz02, TZ02_FRAMES, PruebaTz02 } from "./tz02/Completo";

const Root = () => (
  <>
    <Composition id="Tz02" component={Tz02 as any} durationInFrames={TZ02_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Tz02Mudo" component={Tz02 as any} durationInFrames={TZ02_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
    <Composition id="PruebaTz02" component={PruebaTz02 as any} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ n: "Q01Mini" }} />
  </>
);
registerRoot(Root);
