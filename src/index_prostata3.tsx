// Entry aislado para renderizar Prostata3 en el farm.
// ⛔ Va por ENTRY=src/index_prostata3.tsx — el index por defecto es COMPARTIDO entre sesiones.
import { Composition, registerRoot } from "remotion";
import { MainProstata3, TOTAL_FRAMES_PROSTATA3 } from "./_fed6/VideoEdit/Main_prostata3";
const Root = () => (
  <Composition id="Prostata3" component={MainProstata3} durationInFrames={TOTAL_FRAMES_PROSTATA3} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
