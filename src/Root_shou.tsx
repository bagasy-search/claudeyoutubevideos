import "./index.css";
import { Composition } from "remotion";
import { MainShou, TOTAL_FRAMES_SHOU } from "./VideoEdit/Main_shou";

// Root MÍNIMO — solo el video "shou penetrante". Aísla del Root completo.
export const RootShou: React.FC = () => (
  <>
    <Composition id="Shou" component={MainShou} durationInFrames={TOTAL_FRAMES_SHOU} fps={30} width={1920} height={1080} />
  </>
);
