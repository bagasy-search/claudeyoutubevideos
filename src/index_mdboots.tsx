import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdBoots, TOTAL_FRAMES_MDBOOTS } from "./VideoEdit/Main_mdboots";

const RootMdBoots: React.FC = () => (
  <>
    <Composition
      id="MdBoots"
      component={MainMdBoots}
      durationInFrames={TOTAL_FRAMES_MDBOOTS}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdBoots);
