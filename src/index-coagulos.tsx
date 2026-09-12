import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainCoagulos, TOTAL_FRAMES_COAG } from "./_fed6/VideoEdit/Main_coagulos";

const RootCoagulos: React.FC = () => (
  <Composition id="Coagulos" component={MainCoagulos} durationInFrames={TOTAL_FRAMES_COAG} fps={30} width={1920} height={1080} />
);
registerRoot(RootCoagulos);
