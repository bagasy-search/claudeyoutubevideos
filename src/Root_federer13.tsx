import "./index.css";
import { Composition } from "remotion";
import { MainFederer13, TOTAL_FRAMES_FED13 } from "./_fed6/VideoEdit/Main_federer13";

export const RootFederer13: React.FC = () => (
  <>
    <Composition id="Federer13" component={MainFederer13} durationInFrames={TOTAL_FRAMES_FED13} fps={30} width={1920} height={1080} />
  </>
);
