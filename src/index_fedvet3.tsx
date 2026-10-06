import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFedvet3, TOTAL_FRAMES_FEDVET3 } from "./fedvet3/Main_fedvet3";

const RootFedvet3: React.FC = () => (
  <Composition id="Fedvet3" component={MainFedvet3} durationInFrames={TOTAL_FRAMES_FEDVET3} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvet3);
