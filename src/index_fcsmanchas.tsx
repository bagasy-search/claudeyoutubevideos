import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcsmanchas, TOTAL_FRAMES_FCSMANCHAS } from "./_fed6/VideoEdit/Main_fcsmanchas";

// Entry propio del video "Manchas en la cara" (canal Federer) para el farm.
const RootFcsmanchas: React.FC = () => (
  <>
    <Composition
      id="Fcsmanchas"
      component={MainFcsmanchas}
      durationInFrames={TOTAL_FRAMES_FCSMANCHAS}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcsmanchas);
