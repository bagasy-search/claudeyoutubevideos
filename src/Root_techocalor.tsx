import "./index.css";
import { Composition } from "remotion";
import { MainTechocalor, TOTAL_FRAMES_TECHOCALOR } from "./VideoEdit/Main_techocalor";

// Root MÍNIMO — solo el video "techo trampa $7 / la barrera radiante". Aísla del
// Root completo (que importa comps rotos pre-existentes) — mismo patrón que
// Root_ventilador / Root_madera.
export const RootTechocalor: React.FC = () => (
  <>
    <Composition id="Techocalor" component={MainTechocalor} durationInFrames={TOTAL_FRAMES_TECHOCALOR} fps={30} width={1920} height={1080} />
  </>
);
