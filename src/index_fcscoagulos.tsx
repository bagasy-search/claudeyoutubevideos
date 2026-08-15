import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcscoagulos, TOTAL_FRAMES_FCSCOAGULOS } from "./_fed6/VideoEdit/Main_fcscoagulos";

// Entry propio del video "La Fruta que limpia los Coágulos de las Piernas" (canal Federer) para el farm.
const RootFcscoagulos: React.FC = () => (
  <>
    <Composition
      id="Fcscoagulos"
      component={MainFcscoagulos}
      durationInFrames={TOTAL_FRAMES_FCSCOAGULOS}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcscoagulos);
