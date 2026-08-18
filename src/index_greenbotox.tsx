// Entry solo-GreenBotox para el FARM. Uso: ENTRY=src/index_greenbotox.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainGreenbotox, TOTAL_FRAMES_GB } from "./_fed6/VideoEdit/Main_greenbotox";

const GreenbotoxRoot: React.FC = () => (
  <Composition id="GreenBotox" component={MainGreenbotox} durationInFrames={TOTAL_FRAMES_GB} fps={30} width={1920} height={1080} />
);

registerRoot(GreenbotoxRoot);
