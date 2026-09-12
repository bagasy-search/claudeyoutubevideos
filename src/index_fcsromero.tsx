import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcsromero, TOTAL_FRAMES_FCSROMERO } from "./_fed6/VideoEdit/Main_fcsromero";

// Entry propio del video "Aceite de romero antes de dormir" (canal Federer) para el farm.
const RootFcsromero: React.FC = () => (
  <>
    <Composition
      id="Fcsromero"
      component={MainFcsromero}
      durationInFrames={TOTAL_FRAMES_FCSROMERO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcsromero);
