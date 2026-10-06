import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFedvetmemoria, TOTAL_FRAMES_FEDVETMEMORIA } from "./fedvetmemoria/Main_fedvetmemoria";

const RootFedvetmemoria: React.FC = () => (
  <Composition id="Fedvetmemoria" component={MainFedvetmemoria} durationInFrames={TOTAL_FRAMES_FEDVETMEMORIA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvetmemoria);
