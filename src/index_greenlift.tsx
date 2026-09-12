// Entry solo-GreenLift para el FARM. Uso: ENTRY=src/index_greenlift.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainGreenlift, TOTAL_FRAMES_GB } from "./_fed6/VideoEdit/Main_greenlift";

const GreenliftRoot: React.FC = () => (
  <Composition id="GreenLift" component={MainGreenlift} durationInFrames={TOTAL_FRAMES_GB} fps={30} width={1920} height={1080} />
);

registerRoot(GreenliftRoot);
