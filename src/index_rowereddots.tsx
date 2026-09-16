// Entry solo-rowereddots para el FARM. Uso: ENTRY=src/index_rowereddots.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRowereddots, TOTAL_FRAMES_ROWEREDDOTS } from "./rowereddots/Main_rowereddots";

const RowereddotsRoot: React.FC = () => (
  <Composition id="Rowereddots" component={MainRowereddots} durationInFrames={TOTAL_FRAMES_ROWEREDDOTS} fps={30} width={1920} height={1080} />
);

registerRoot(RowereddotsRoot);
