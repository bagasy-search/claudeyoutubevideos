import { registerRoot, Composition } from "remotion";
import { Piloto, PILOTO_DUR } from "./soot3/Piloto";

const Root = () => <Composition id="Soot3Piloto" component={Piloto} durationInFrames={PILOTO_DUR} fps={30} width={1920} height={1080} />;

registerRoot(Root);
