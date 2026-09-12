import { Composition, registerRoot } from "remotion";
import { MainCanelavinagre, TOTAL_FRAMES_CANELAVINAGRE } from "./VideoEdit/Main_canelavinagre";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Canelavinagre".
export const CanelavinagreRoot: React.FC = () => (
  <>
    <Composition
      id="Canelavinagre"
      component={MainCanelavinagre}
      durationInFrames={TOTAL_FRAMES_CANELAVINAGRE}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(CanelavinagreRoot);
