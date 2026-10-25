import { registerRoot, Composition } from "remotion";
import { Mundo3, DUR3 } from "./soot03/Mundo3";

const Root = () => (
  <>
    <Composition id="Soot03" component={Mundo3} durationInFrames={DUR3} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
