import "./index.css";
import { Composition } from "remotion";
import { MainGencoche, TOTAL_FRAMES_GENCOCHE } from "./VideoEdit/Main_gencoche";

// Root MÍNIMO — solo el video "gencoche". Aísla del Root completo (evita bundle roto en el farm).
export const RootGencoche: React.FC = () => (
  <>
    <Composition id="Gencoche" component={MainGencoche} durationInFrames={TOTAL_FRAMES_GENCOCHE} fps={30} width={1920} height={1080} />
  </>
);
