import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdToiletMold, TOTAL_FRAMES_MDTOILETMOLD } from "./VideoEdit/Main_mdtoiletmold";

const RootMdToiletMold: React.FC = () => (
  <>
    <Composition
      id="MdToiletMold"
      component={MainMdToiletMold}
      durationInFrames={TOTAL_FRAMES_MDTOILETMOLD}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdToiletMold);
