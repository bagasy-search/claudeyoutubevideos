import { Composition, registerRoot } from "remotion";
import { Tz01, TZ01_FRAMES, PruebaTz01 } from "./tz01/Completo";

const Root = () => (
  <>
    <Composition id="Tz01" component={Tz01 as any} durationInFrames={TZ01_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Tz01Mudo" component={Tz01 as any} durationInFrames={TZ01_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
    <Composition id="PruebaTz01" component={PruebaTz01 as any} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ n: "P01Mini" }} />
  </>
);
registerRoot(Root);
