import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdBootsRt, TOTAL_FRAMES_MDBOOTSRT } from "./VideoEdit/Main_mdbootsrt";

const RootMdBootsRt: React.FC = () => (
  <>
    <Composition
      id="MdBootsRt"
      component={MainMdBootsRt}
      durationInFrames={TOTAL_FRAMES_MDBOOTSRT}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdBootsRt);
