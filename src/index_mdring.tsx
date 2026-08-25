import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdRing, TOTAL_FRAMES_MDRING } from "./VideoEdit/Main_mdring";

const RootMdRing: React.FC = () => (
  <>
    <Composition
      id="MdRing"
      component={MainMdRing}
      durationInFrames={TOTAL_FRAMES_MDRING}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdRing);
