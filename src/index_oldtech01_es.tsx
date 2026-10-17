import { Composition, registerRoot } from "remotion";
import { OT } from "./oldtech01_es/OT";
const Root = () => <Composition id="OldTech01Es" component={OT} durationInFrames={22912} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />;
registerRoot(Root);
