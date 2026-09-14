import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdVent, TOTAL_FRAMES_MDVENT } from "./VideoEdit/Main_mdvent";

const RootMdVent: React.FC = () => (
  <Composition id="MdVent" component={MainMdVent} durationInFrames={TOTAL_FRAMES_MDVENT} fps={30} width={1920} height={1080} />
);

registerRoot(RootMdVent);
