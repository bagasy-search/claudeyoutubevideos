import "./index.css";
import { Composition } from "remotion";
import { MainFederer14, TOTAL_FRAMES_FED14 } from "./_fed6/VideoEdit/Main_federer14";

export const RootFederer14: React.FC = () => (
  <>
    <Composition id="Federer14" component={MainFederer14} durationInFrames={TOTAL_FRAMES_FED14} fps={30} width={1920} height={1080} />
  </>
);
