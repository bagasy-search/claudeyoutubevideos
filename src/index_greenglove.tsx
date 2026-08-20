// Entry solo-GreenGlove para el FARM. Uso: ENTRY=src/index_greenglove.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainGreenglove, TOTAL_FRAMES_GG } from "./_fed6/VideoEdit/Main_greenglove";

const GreengloveRoot: React.FC = () => (
  <Composition id="GreenGlove" component={MainGreenglove} durationInFrames={TOTAL_FRAMES_GG} fps={30} width={1920} height={1080} />
);

registerRoot(GreengloveRoot);
