import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVxsag, TOTAL_FRAMES_VXSAG } from "./VideoEdit/Main_vxsag2ipph2js";

// Entry AISLADO: registra SOLO la composición de este video. No toca src/Root.tsx
// (compartido con los otros agentes) ni src/index.ts.
const RootVxsag: React.FC = () => (
  <>
    <Composition
      id="Vxsag"
      component={MainVxsag}
      durationInFrames={TOTAL_FRAMES_VXSAG}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootVxsag);
