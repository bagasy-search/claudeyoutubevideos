import "./index.css";
import { Composition } from "remotion";
import { MainFederer19, TOTAL_FRAMES_FED19 } from "./_fed6/VideoEdit/Main_federer19";

export const RootFederer19: React.FC = () => (
  <>
    <Composition id="Federer19" component={MainFederer19} durationInFrames={TOTAL_FRAMES_FED19} fps={30} width={1920} height={1080} />
  </>
);
