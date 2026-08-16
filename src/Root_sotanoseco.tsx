import "./index.css";
import { Composition } from "remotion";
import { MainSotanoseco, TOTAL_FRAMES_SOTANOSECO } from "./VideoEdit/Main_sotanoseco";

// Root MÍNIMO — solo el video "sótano seco". Aísla del Root completo (evita 404 del farm).
export const RootSotanoseco: React.FC = () => (
  <>
    <Composition id="Sotanoseco" component={MainSotanoseco} durationInFrames={TOTAL_FRAMES_SOTANOSECO} fps={30} width={1920} height={1080} />
  </>
);
