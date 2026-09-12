// Entry mínimo solo-v8c55b7vy74c para Remotion (bundle liviano, aislado del Root compartido).
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV8c55b7vy74c, TOTAL_FRAMES_V8C55B7VY74C } from "./VideoEdit/Main_v8c55b7vy74c";

const V8c55b7vy74cRoot: React.FC = () => (
  <Composition
    id="V8c55b7vy74c"
    component={MainV8c55b7vy74c}
    durationInFrames={TOTAL_FRAMES_V8C55B7VY74C}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(V8c55b7vy74cRoot);
