import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV4dt, TOTAL_FRAMES_V4DTVGRN83QY7 } from "./VideoEdit/Main_v4dtvgrn83qy7";

// Entry AISLADO — solo la composición "MiniCalefactor" (The Free Builder · calefactor de macetas).
const RootV4dt: React.FC = () => (
  <>
    <Composition
      id="MiniCalefactor"
      component={MainV4dt}
      durationInFrames={TOTAL_FRAMES_V4DTVGRN83QY7}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(RootV4dt);
