import { Composition, registerRoot } from "remotion";
import { MainBarnfloor, TOTAL_FRAMES_BARNFLOOR } from "./VideoEdit/Main_barnfloor";

export const BarnfloorRoot: React.FC = () => (
  <>
    <Composition
      id="Barnfloor"
      component={MainBarnfloor}
      durationInFrames={TOTAL_FRAMES_BARNFLOOR}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(BarnfloorRoot);
