import "./index.css";
import { Composition } from "remotion";
import { MainQuebracho, TOTAL_FRAMES_QB } from "./VideoEdit/Main_quebracho";

export const RootQB: React.FC = () => (
  <>
    <Composition id="Quebracho" component={MainQuebracho} durationInFrames={TOTAL_FRAMES_QB} fps={30} width={1920} height={1080} />
  </>
);
