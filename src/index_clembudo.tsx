import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainClEmbudo, TOTAL_FRAMES_CLEMBUDO } from "./VideoEdit/Main_clembudo";

const RootClEmbudo: React.FC = () => (
  <Composition
    id="ClEmbudo"
    component={MainClEmbudo}
    durationInFrames={TOTAL_FRAMES_CLEMBUDO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootClEmbudo);
