// Entry solo-v8v252t7cjxe para Remotion (farm). ENTRY=src/index_v8v252t7cjxe.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV8, TOTAL_FRAMES_V8 } from "./_fed6/VideoEdit/Main_v8v252t7cjxe";

const V8Root: React.FC = () => (
  <Composition id="FedManana" component={MainV8} durationInFrames={TOTAL_FRAMES_V8} fps={30} width={1920} height={1080} />
);

registerRoot(V8Root);
