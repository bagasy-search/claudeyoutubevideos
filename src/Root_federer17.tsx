import "./index.css";
import { Composition } from "remotion";
import { MainFederer17, TOTAL_FRAMES_FED17 } from "./_fed6/VideoEdit/Main_federer17";

export const RootFederer17: React.FC = () => (
  <>
    <Composition id="Federer17" component={MainFederer17} durationInFrames={TOTAL_FRAMES_FED17} fps={30} width={1920} height={1080} />
  </>
);
