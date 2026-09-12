import "./index.css";
import { Composition } from "remotion";
import { MainAceite, TOTAL_FRAMES_ACEITE } from "./VideoEdit/Main_aceite";

// Root MÍNIMO — solo el video "aceite penetrante". Aísla del Root completo.
export const RootAceite: React.FC = () => (
  <>
    <Composition id="Aceite" component={MainAceite} durationInFrames={TOTAL_FRAMES_ACEITE} fps={30} width={1920} height={1080} />
  </>
);
