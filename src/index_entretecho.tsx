import { Composition, registerRoot } from "remotion";
import { MainEntretecho, TOTAL_FRAMES_ENTRETECHO } from "./VideoEdit/Main_entretecho";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Entretecho".
export const EntretechoRoot: React.FC = () => (
  <>
    <Composition
      id="Entretecho"
      component={MainEntretecho}
      durationInFrames={TOTAL_FRAMES_ENTRETECHO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(EntretechoRoot);
