import { Composition, registerRoot } from "remotion";
import { MainJabonpolvo, TOTAL_FRAMES_JABONPOLVO } from "./VideoEdit/Main_jabonpolvo";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Jabonpolvo".
export const JabonpolvoRoot: React.FC = () => (
  <>
    <Composition
      id="Jabonpolvo"
      component={MainJabonpolvo}
      durationInFrames={TOTAL_FRAMES_JABONPOLVO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(JabonpolvoRoot);
