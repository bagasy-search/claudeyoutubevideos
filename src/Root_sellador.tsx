import "./index.css";
import { Composition } from "remotion";
import { MainSellador, TOTAL_FRAMES_SELLADOR } from "./VideoEdit/Main_sellador";

// Root MÍNIMO — solo el video "sellador penetrante". Aísla del Root completo.
export const RootSellador: React.FC = () => (
  <>
    <Composition id="Sellador" component={MainSellador} durationInFrames={TOTAL_FRAMES_SELLADOR} fps={30} width={1920} height={1080} />
  </>
);
