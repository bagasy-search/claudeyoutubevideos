import { Composition, registerRoot } from "remotion";
import { MainFbmoscas, TOTAL_FRAMES_FBMOSCAS } from "./VideoEdit/Main_fbmoscas";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Fbmoscas".
export const FbmoscasRoot: React.FC = () => (
  <>
    <Composition
      id="Fbmoscas"
      component={MainFbmoscas}
      durationInFrames={TOTAL_FRAMES_FBMOSCAS}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(FbmoscasRoot);
