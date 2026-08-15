import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcsjapon, TOTAL_FRAMES_FCSJAPON } from "./_fed6/VideoEdit/Main_fcsjapon";

// Entry propio del video "La Fruta que limpia los Coágulos de las Piernas" (canal Federer) para el farm.
const RootFcsjapon: React.FC = () => (
  <>
    <Composition
      id="Fcsjapon"
      component={MainFcsjapon}
      durationInFrames={TOTAL_FRAMES_FCSJAPON}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcsjapon);
