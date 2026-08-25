import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdToilet, TOTAL_FRAMES_MDTOILET } from "./VideoEdit/Main_mdtoilet";

const RootMdToilet: React.FC = () => (
  <>
    <Composition
      id="MdToilet"
      component={MainMdToilet}
      durationInFrames={TOTAL_FRAMES_MDTOILET}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdToilet);
