import "./index.css";
import { Composition } from "remotion";
import { MainFederer, TOTAL_FRAMES_FED } from "./VideoEdit/Main_federer";

// Root MÍNIMO — solo el video ROMERO (canal Dr. Federer). Para review/render sin
// bundlear los 7+ videos del Root principal (que hace OOM de V8).
export const RootFederer: React.FC = () => (
  <>
    <Composition id="Federer" component={MainFederer} durationInFrames={TOTAL_FRAMES_FED} fps={30} width={1920} height={1080} />
  </>
);
