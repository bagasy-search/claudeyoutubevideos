import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdDrainRt, TOTAL_FRAMES_MDDRAINRT } from "./VideoEdit/Main_mddrainrt";

const RootMdDrainRt: React.FC = () => (
  <>
    <Composition
      id="MdDrainRt"
      component={MainMdDrainRt}
      durationInFrames={TOTAL_FRAMES_MDDRAINRT}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdDrainRt);
