import "./index.css";
import { Composition } from "remotion";
import { MainFiltro, TOTAL_FRAMES_FILTRO } from "./VideoEdit/Main_filtro";

// Root MÍNIMO — solo el video "filtro de agua casero". Aísla del Root completo.
export const RootFiltro: React.FC = () => (
  <>
    <Composition id="Filtro" component={MainFiltro} durationInFrames={TOTAL_FRAMES_FILTRO} fps={30} width={1920} height={1080} />
  </>
);
