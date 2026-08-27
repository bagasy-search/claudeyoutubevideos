import { Composition, registerRoot } from "remotion";
import { MainParedhidro, TOTAL_FRAMES_PAREDHIDRO } from "./VideoEdit/Main_paredhidro";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Paredhidro".
export const ParedhidroRoot: React.FC = () => (
  <>
    <Composition
      id="Paredhidro"
      component={MainParedhidro}
      durationInFrames={TOTAL_FRAMES_PAREDHIDRO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(ParedhidroRoot);
