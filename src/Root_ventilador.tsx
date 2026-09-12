import "./index.css";
import { Composition } from "remotion";
import { MainVentilador, TOTAL_FRAMES_VENTILADOR } from "./VideoEdit/Main_ventilador";

// Root MÍNIMO — solo el video "ventilador → aire acondicionado". Aísla del Root completo
// (que importa comps rotos pre-existentes como dulcesv3 → rompe el bundle).
export const RootVentilador: React.FC = () => (
  <>
    <Composition id="Ventilador" component={MainVentilador} durationInFrames={TOTAL_FRAMES_VENTILADOR} fps={30} width={1920} height={1080} />
  </>
);
