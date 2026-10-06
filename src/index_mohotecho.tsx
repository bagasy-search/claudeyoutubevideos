import { Composition, registerRoot } from "remotion";
import { MainMohotecho, TOTAL_FRAMES_MOHOTECHO } from "./VideoEdit/Main_mohotecho";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Mohotecho".
export const MohotechoRoot: React.FC = () => (
  <>
    <Composition
      id="Mohotecho"
      component={MainMohotecho}
      durationInFrames={TOTAL_FRAMES_MOHOTECHO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(MohotechoRoot);
