import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcscanela, TOTAL_FRAMES_FCSCANELA } from "./_fed6/VideoEdit/Main_fcscanela";

// Entry propio del video "La Fruta que limpia los Coágulos de las Piernas" (canal Federer) para el farm.
const RootFcscanela: React.FC = () => (
  <>
    <Composition
      id="Fcscanela"
      component={MainFcscanela}
      durationInFrames={TOTAL_FRAMES_FCSCANELA}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcscanela);
