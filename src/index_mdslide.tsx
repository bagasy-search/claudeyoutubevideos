import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdSlide, TOTAL_FRAMES_MDSLIDE } from "./VideoEdit/Main_mdslide";

const RootMdSlide: React.FC = () => (
  <Composition id="MdSlide" component={MainMdSlide} durationInFrames={TOTAL_FRAMES_MDSLIDE} fps={30} width={1920} height={1080} />
);
registerRoot(RootMdSlide);
