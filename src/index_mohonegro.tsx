import { Composition, registerRoot } from "remotion";
import { MainMohonegro, TOTAL_FRAMES_MOHONEGRO } from "./VideoEdit/Main_mohonegro";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Mohonegro".
export const MohonegroRoot: React.FC = () => (
  <>
    <Composition
      id="Mohonegro"
      component={MainMohonegro}
      durationInFrames={TOTAL_FRAMES_MOHONEGRO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(MohonegroRoot);
