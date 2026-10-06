import { Composition, registerRoot } from "remotion";
import { MainTfbmanguera, TOTAL_FRAMES_TFBMANGUERA } from "./VideoEdit/Main_tfbmanguera";

// Entry AISLADO para el farm. Sin esto el render usa src/index.tsx compartido, que otra sesion
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Tfbmanguera".
export const TfbmangueraRoot: React.FC = () => (
  <>
    <Composition
      id="Tfbmanguera"
      component={MainTfbmanguera}
      durationInFrames={TOTAL_FRAMES_TFBMANGUERA}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(TfbmangueraRoot);
