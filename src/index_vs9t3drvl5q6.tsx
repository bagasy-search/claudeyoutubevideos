// Entry solo-vs9t3drvl5q6 para Remotion (farm). ENTRY=src/index_vs9t3drvl5q6.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVs9, TOTAL_FRAMES_VS9 } from "./_fed6/VideoEdit/Main_vs9t3drvl5q6";

const Vs9Root: React.FC = () => (
  <Composition id="FedUnas" component={MainVs9} durationInFrames={TOTAL_FRAMES_VS9} fps={30} width={1920} height={1080} />
);

registerRoot(Vs9Root);
