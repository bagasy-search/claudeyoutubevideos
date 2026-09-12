import "./index.css";
import { Composition } from "remotion";
import { MainRestaura, TOTAL_FRAMES_RESTAURA } from "./VideoEdit/Main_restaura";

// Root MÍNIMO — solo el video "restaurar madera vieja y gris". Aísla del Root
// completo (que importa comps rotos pre-existentes) — mismo patrón que Root_techocalor.
export const RootRestaura: React.FC = () => (
  <>
    <Composition id="Restaura" component={MainRestaura} durationInFrames={TOTAL_FRAMES_RESTAURA} fps={30} width={1920} height={1080} />
  </>
);
