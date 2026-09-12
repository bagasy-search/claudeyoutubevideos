import { Composition, registerRoot } from "remotion";
import { MainSotanorico, TOTAL_FRAMES_SOTANORICO } from "./VideoEdit/Main_sotanorico";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Sotanorico".
export const SotanoricoRoot: React.FC = () => (
  <>
    <Composition
      id="Sotanorico"
      component={MainSotanorico}
      durationInFrames={TOTAL_FRAMES_SOTANORICO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(SotanoricoRoot);
