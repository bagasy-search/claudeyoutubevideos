import { Composition, registerRoot } from "remotion";
import { MainRomerovinagre, TOTAL_FRAMES_ROMEROVINAGRE } from "./VideoEdit/Main_romerovinagre";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Romerovinagre".
export const RomerovinagreRoot: React.FC = () => (
  <>
    <Composition
      id="Romerovinagre"
      component={MainRomerovinagre}
      durationInFrames={TOTAL_FRAMES_ROMEROVINAGRE}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(RomerovinagreRoot);
