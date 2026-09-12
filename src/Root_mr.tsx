import "./index.css";
import { Composition } from "remotion";
import { MainMaderaRest, TOTAL_FRAMES_MR } from "./VideoEdit/Main_maderarest";

// Root MÍNIMO — solo el video de MADERA (El Constructor Libre · restauración).
// Para abrir Studio / render sin bundlear los 7+ videos del Root principal.
export const RootMR: React.FC = () => (
  <>
    <Composition id="MaderaRest" component={MainMaderaRest} durationInFrames={TOTAL_FRAMES_MR} fps={30} width={1920} height={1080} />
  </>
);
