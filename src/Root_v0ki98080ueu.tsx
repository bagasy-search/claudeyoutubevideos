import "./index.css";
import { Composition } from "remotion";
import { MainV0ki, TOTAL_FRAMES_V0KI } from "./VideoEdit/Main_v0ki98080ueu";

// Root MÍNIMO — solo el video "humedad $2" (Constructor Libre). Aísla del Root completo.
export const RootV0ki: React.FC = () => (
  <>
    <Composition id="Humedad" component={MainV0ki} durationInFrames={TOTAL_FRAMES_V0KI} fps={30} width={1920} height={1080} />
  </>
);
