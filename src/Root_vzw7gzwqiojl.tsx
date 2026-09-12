import "./index.css";
import { Composition } from "remotion";
import { MainVzw, TOTAL_FRAMES_VZW7GZWQIOJL } from "./VideoEdit/Main_vzw7gzwqiojl";

// Root MÍNIMO — solo el video de impermeabilización (The Free Builder). Aísla del Root completo.
export const RootVzw: React.FC = () => (
  <>
    <Composition id="Imper" component={MainVzw} durationInFrames={TOTAL_FRAMES_VZW7GZWQIOJL} fps={30} width={1920} height={1080} />
  </>
);
