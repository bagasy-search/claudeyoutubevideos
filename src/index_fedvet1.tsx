import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFedvet1, TOTAL_FRAMES_FEDVET1 } from "./fedvet1/Main_fedvet1";

const RootFedvet1: React.FC = () => (
  <Composition id="Fedvet1" component={MainFedvet1} durationInFrames={TOTAL_FRAMES_FEDVET1} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvet1);
