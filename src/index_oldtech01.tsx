import { Composition, registerRoot } from "remotion";
import { OT } from "./oldtech01/OT";
const Root = () => <Composition id="OldTech01" component={OT} durationInFrames={20360} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />;
registerRoot(Root);
