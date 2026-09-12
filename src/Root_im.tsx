import "./index.css";
import { Composition } from "remotion";
import { MainImpermeable, TOTAL_FRAMES_IM } from "./VideoEdit/Main_impermeable";

// Root MÍNIMO — solo el video IMPERMEABLE (El Constructor Libre · madera #3).
export const RootIM: React.FC = () => (
  <>
    <Composition id="Impermeable" component={MainImpermeable} durationInFrames={TOTAL_FRAMES_IM} fps={30} width={1920} height={1080} />
  </>
);
