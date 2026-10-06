import { Composition, registerRoot } from "remotion";
import { MainChapapintar, TOTAL_FRAMES_CHAPAPINTAR } from "./VideoEdit/Main_chapapintar";
import { LaminaChapa } from "./chapapintar/LaminaChapa";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Chapapintar".
export const ChapapintarRoot: React.FC = () => (
  <>
    <Composition
      id="Chapapintar"
      component={MainChapapintar}
      durationInFrames={TOTAL_FRAMES_CHAPAPINTAR}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="LaminaChapa"
      component={LaminaChapa}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(ChapapintarRoot);
