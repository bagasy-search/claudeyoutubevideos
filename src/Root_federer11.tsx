import "./index.css";
import { Composition } from "remotion";
import { MainFederer11, TOTAL_FRAMES_FED11 } from "./_fed6/VideoEdit/Main_federer11";

// Root MÍNIMO — solo el video PIERNAS HINCHADAS (canal Federer Archivos). Para review/render
// sin bundlear los 7+ videos del Root principal (que hace OOM de V8).
export const RootFederer11: React.FC = () => (
  <>
    <Composition id="Federer11" component={MainFederer11} durationInFrames={TOTAL_FRAMES_FED11} fps={30} width={1920} height={1080} />
  </>
);
