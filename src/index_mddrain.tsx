import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdDrain, TOTAL_FRAMES_MDDRAIN } from "./VideoEdit/Main_mddrain";

const RootMdDrain: React.FC = () => (
  <>
    <Composition
      id="MdDrain"
      component={MainMdDrain}
      durationInFrames={TOTAL_FRAMES_MDDRAIN}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdDrain);
