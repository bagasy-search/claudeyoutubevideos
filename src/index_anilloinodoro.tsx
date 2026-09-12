import { Composition, registerRoot } from "remotion";
import { MainAnilloinodoro, TOTAL_FRAMES_ANILLOINODORO } from "./VideoEdit/Main_anilloinodoro";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Anilloinodoro".
export const AnilloinodoroRoot: React.FC = () => (
  <>
    <Composition
      id="Anilloinodoro"
      component={MainAnilloinodoro}
      durationInFrames={TOTAL_FRAMES_ANILLOINODORO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(AnilloinodoroRoot);
