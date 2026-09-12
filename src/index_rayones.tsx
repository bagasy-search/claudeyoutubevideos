// Entry MÍNIMO solo-Rayones para Remotion Studio. Uso: npx remotion studio src/index_rayones.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRayones, TOTAL_FRAMES_RAYONES } from "./VideoEdit/Main_rayones";

const RayonesRoot: React.FC = () => (
  <Composition id="Rayones" component={MainRayones} durationInFrames={TOTAL_FRAMES_RAYONES} fps={30} width={1920} height={1080} />
);

registerRoot(RayonesRoot);
