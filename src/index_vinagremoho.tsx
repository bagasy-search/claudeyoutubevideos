import { Composition, registerRoot } from "remotion";
import { MainVinagremoho, TOTAL_FRAMES_VINAGREMOHO } from "./VideoEdit/Main_vinagremoho";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Vinagremoho".
export const VinagremohoRoot: React.FC = () => (
  <>
    <Composition
      id="Vinagremoho"
      component={MainVinagremoho}
      durationInFrames={TOTAL_FRAMES_VINAGREMOHO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(VinagremohoRoot);
