import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdGrout, TOTAL_FRAMES_MDGROUT } from "./VideoEdit/Main_mdgrout";

const RootMdGrout: React.FC = () => (
  <Composition id="MdGrout" component={MainMdGrout} durationInFrames={TOTAL_FRAMES_MDGROUT} fps={30} width={1920} height={1080} />
);

registerRoot(RootMdGrout);
