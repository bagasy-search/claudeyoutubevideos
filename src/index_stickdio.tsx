import { registerRoot, Composition } from "remotion";
import { Dio, DUR } from "./stickdio/Dio";

const Root = () => <Composition id="Dio" component={Dio} durationInFrames={DUR} fps={30} width={1920} height={1080} />;

registerRoot(Root);
