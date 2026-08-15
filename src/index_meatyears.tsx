import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainMeatyears, TOTAL_FRAMES_MEATYEARS } from "./VideoEdit/Main_meatyears";
const MeatyearsRoot: React.FC = () => (
  <Composition id="Meatyears" component={MainMeatyears} durationInFrames={TOTAL_FRAMES_MEATYEARS} fps={30} width={1920} height={1080} />
);
registerRoot(MeatyearsRoot);
