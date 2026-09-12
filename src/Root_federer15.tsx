import "./index.css";
import { Composition } from "remotion";
import { MainFederer15, TOTAL_FRAMES_FED15 } from "./_fed6/VideoEdit/Main_federer15";

export const RootFederer15: React.FC = () => (
  <>
    <Composition id="Federer15" component={MainFederer15} durationInFrames={TOTAL_FRAMES_FED15} fps={30} width={1920} height={1080} />
  </>
);
