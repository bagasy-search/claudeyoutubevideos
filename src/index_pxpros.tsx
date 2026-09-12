import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxpros, TOTAL_FRAMES_PXPROS } from "./VideoEdit/Main_pxpros";

const RootPxpros: React.FC = () => (
  <>
    <Composition id="PxPros" component={MainPxpros} durationInFrames={TOTAL_FRAMES_PXPROS} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxpros);
