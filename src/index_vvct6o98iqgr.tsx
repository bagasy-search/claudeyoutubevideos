import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVvct6, TOTAL_FRAMES_VVCT6O98IQGR } from "./VideoEdit/Main_vvct6o98iqgr";

// Entry AISLADO — solo la composición "SalEpsom" (Levi Lapp Jardín · sal de Epsom / magnesio).
const RootVvct6: React.FC = () => (
  <>
    <Composition
      id="SalEpsom"
      component={MainVvct6}
      durationInFrames={TOTAL_FRAMES_VVCT6O98IQGR}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(RootVvct6);
