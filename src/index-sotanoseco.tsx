import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainSotanoseco, TOTAL_FRAMES_SOTANOSECO } from "./VideoEdit/Main_sotanoseco";

// Entry AISLADO del video "sótano seco" — registra SOLO su composición.
const RootSotanoseco: React.FC = () => (
  <>
    <Composition
      id="Sotanoseco"
      component={MainSotanoseco}
      durationInFrames={TOTAL_FRAMES_SOTANOSECO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(RootSotanoseco);
