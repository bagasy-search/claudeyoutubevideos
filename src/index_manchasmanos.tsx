// Entry aislado para renderizar Manchasmanos en el farm.
// ⛔ SIN ENTRY PROPIO el render usa src/index.tsx COMPARTIDO (otra sesion lo deja apuntando a otro
//    video) y los 60 chunks mueren con "Could not find composition with ID Manchasmanos".
import { Composition, registerRoot } from "remotion";
import { MainManchasmanos, TOTAL_FRAMES_MANCHASMANOS } from "./_fed6/VideoEdit/Main_manchasmanos";
const Root = () => (
  <Composition id="Manchasmanos" component={MainManchasmanos} durationInFrames={TOTAL_FRAMES_MANCHASMANOS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
