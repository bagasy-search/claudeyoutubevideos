import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdSmell, TOTAL_FRAMES_MDSMELL } from "./VideoEdit/Main_mdsmell";

const RootMdSmell: React.FC = () => (
  <Composition id="MdSmell" component={MainMdSmell} durationInFrames={TOTAL_FRAMES_MDSMELL} fps={30} width={1920} height={1080} />
);
registerRoot(RootMdSmell);
