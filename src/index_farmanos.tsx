// Entry aislado para renderizar Farmanos en el farm.
// ⛔ SIN ENTRY PROPIO el render usa src/index.tsx COMPARTIDO (otra sesion lo deja apuntando a otro
//    video) y los 60 chunks mueren con "Could not find composition with ID Farmanos".
import { Composition, registerRoot } from "remotion";
import { MainFarmanos, TOTAL_FRAMES_FARMANOS } from "./_fed6/VideoEdit/Main_farmanos";
const Root = () => (
  <Composition id="Farmanos" component={MainFarmanos} durationInFrames={TOTAL_FRAMES_FARMANOS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
