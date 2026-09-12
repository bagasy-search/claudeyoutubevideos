// Entry MÍNIMO solo-Fuego (estufa de masa) para Remotion Studio/render.
// Uso: npx remotion render src/index_fuego.tsx Fuego out/fuego_hook.mp4 --frames=0-6911
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFuego, TOTAL_FRAMES_FUEGO } from "./VideoEdit/Main_fuego";

const FuegoRoot: React.FC = () => (
  <Composition
    id="Fuego"
    component={MainFuego}
    durationInFrames={TOTAL_FRAMES_FUEGO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(FuegoRoot);
