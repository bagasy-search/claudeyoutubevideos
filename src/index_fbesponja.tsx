import { Composition, registerRoot } from "remotion";
import { MainFbesponja, TOTAL_FRAMES_FBESPONJA } from "./VideoEdit/Main_fbesponja";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Fbesponja".
export const FbesponjaRoot: React.FC = () => (
  <>
    <Composition
      id="Fbesponja"
      component={MainFbesponja}
      durationInFrames={TOTAL_FRAMES_FBESPONJA}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(FbesponjaRoot);
