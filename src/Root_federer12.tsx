import "./index.css";
import { Composition } from "remotion";
import { MainFederer12, TOTAL_FRAMES_FED12 } from "./_fed6/VideoEdit/Main_federer12";

export const RootFederer12: React.FC = () => (
  <>
    <Composition id="Federer12" component={MainFederer12} durationInFrames={TOTAL_FRAMES_FED12} fps={30} width={1920} height={1080} />
  </>
);
