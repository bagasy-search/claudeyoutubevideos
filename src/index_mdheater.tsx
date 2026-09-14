import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdHeater, TOTAL_FRAMES_MDHEATER } from "./VideoEdit/Main_mdheater";

const RootMdHeater: React.FC = () => (
  <Composition id="MdHeater" component={MainMdHeater} durationInFrames={TOTAL_FRAMES_MDHEATER} fps={30} width={1920} height={1080} />
);
registerRoot(RootMdHeater);
