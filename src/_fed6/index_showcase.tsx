// Entry aislado para renderizar el showcase del kit federer-video en el farm.
import { Composition, registerRoot } from "remotion";
import { Fed6Showcase, FED6_SHOWCASE_FRAMES } from "./VideoEdit/Fed6Showcase";

const Root = () => (
  <Composition
    id="Fed6Showcase"
    component={Fed6Showcase}
    durationInFrames={FED6_SHOWCASE_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);
registerRoot(Root);
