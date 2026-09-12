import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcskiwi, TOTAL_FRAMES_FCSKIWI } from "./_fed6/VideoEdit/Main_fcskiwi";

// Entry propio del video "La Fruta que limpia los Coágulos de las Piernas" (canal Federer) para el farm.
const RootFcskiwi: React.FC = () => (
  <>
    <Composition
      id="Fcskiwi"
      component={MainFcskiwi}
      durationInFrames={TOTAL_FRAMES_FCSKIWI}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcskiwi);
