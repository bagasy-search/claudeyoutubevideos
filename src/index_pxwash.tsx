import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxwash, TOTAL_FRAMES_PXWASH } from "./VideoEdit/Main_pxwash";

// Entry propio del video "9 Hydrogen Peroxide Tricks" (canal Agua Oxigenada) para el farm.
const RootPxwash: React.FC = () => (
  <>
    <Composition
      id="PxWash"
      component={MainPxwash}
      durationInFrames={TOTAL_FRAMES_PXWASH}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootPxwash);
