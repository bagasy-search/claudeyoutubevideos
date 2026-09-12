import "./index.css";
import { Composition } from "remotion";
import { MainFederer18, TOTAL_FRAMES_FED18 } from "./_fed6/VideoEdit/Main_federer18";

export const RootFederer18: React.FC = () => (
  <>
    <Composition id="Federer18" component={MainFederer18} durationInFrames={TOTAL_FRAMES_FED18} fps={30} width={1920} height={1080} />
  </>
);
