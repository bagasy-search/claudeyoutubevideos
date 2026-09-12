// Entry MÍNIMO solo-Madera para Remotion Studio. Uso: npx remotion studio src/index_madera.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainMadera, TOTAL_FRAMES_MADERA } from "./VideoEdit/Main_madera";

const MaderaRoot: React.FC = () => (
  <Composition id="Madera" component={MainMadera} durationInFrames={TOTAL_FRAMES_MADERA} fps={30} width={1920} height={1080} />
);

registerRoot(MaderaRoot);
