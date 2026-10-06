import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdPlumb, TOTAL_FRAMES_MDPLUMB } from "./VideoEdit/Main_mdplumb";

const RootMdPlumb: React.FC = () => (
  <>
    <Composition
      id="MdPlumb"
      component={MainMdPlumb}
      durationInFrames={TOTAL_FRAMES_MDPLUMB}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdPlumb);
