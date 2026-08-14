import "./index.css";
import { Composition } from "remotion";
import { MainFederer16, TOTAL_FRAMES_FED16 } from "./_fed6/VideoEdit/Main_federer16";

export const RootFederer16: React.FC = () => (
  <>
    <Composition id="Federer16" component={MainFederer16} durationInFrames={TOTAL_FRAMES_FED16} fps={30} width={1920} height={1080} />
  </>
);
