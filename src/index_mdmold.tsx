import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdMold, TOTAL_FRAMES_MDMOLD } from "./VideoEdit/Main_mdmold";

const RootMdMold: React.FC = () => (
  <>
    <Composition
      id="MdMold"
      component={MainMdMold}
      durationInFrames={TOTAL_FRAMES_MDMOLD}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdMold);
