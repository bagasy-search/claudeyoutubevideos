import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdTank, TOTAL_FRAMES_MDTANK } from "./VideoEdit/Main_mdtank";

const RootMdTank: React.FC = () => (
  <>
    <Composition
      id="MdTank"
      component={MainMdTank}
      durationInFrames={TOTAL_FRAMES_MDTANK}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdTank);
