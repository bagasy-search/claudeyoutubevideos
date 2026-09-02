import { Composition, registerRoot } from "remotion";
import { MainSalitre3, TOTAL_FRAMES_SALITRE3 } from "./VideoEdit/Main_salitre3";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Salitre3".
export const Salitre3Root: React.FC = () => (
  <>
    <Composition
      id="Salitre3"
      component={MainSalitre3}
      durationInFrames={TOTAL_FRAMES_SALITRE3}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(Salitre3Root);
