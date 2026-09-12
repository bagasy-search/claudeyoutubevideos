import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdPros, TOTAL_FRAMES_MDPROS } from "./VideoEdit/Main_mdpros";

const RootMdPros: React.FC = () => (
  <>
    <Composition
      id="MdPros"
      component={MainMdPros}
      durationInFrames={TOTAL_FRAMES_MDPROS}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdPros);
