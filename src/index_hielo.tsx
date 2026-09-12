// Entry MÍNIMO solo-Hielo para Remotion Studio/render (bundle liviano, sin OOM en Node 24).
// Uso: npx remotion render src/index_hielo.tsx Hielo out/hielo_hook.mp4 --frames=0-4274
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainHielo, TOTAL_FRAMES_HIELO } from "./VideoEdit/Main_hielo";

const HieloRoot: React.FC = () => (
  <Composition
    id="Hielo"
    component={MainHielo}
    durationInFrames={TOTAL_FRAMES_HIELO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(HieloRoot);
