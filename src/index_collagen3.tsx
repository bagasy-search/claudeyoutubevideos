// Entry solo-Collagen3 para el FARM. Uso: ENTRY=src/index_collagen3.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainCollagen3, TOTAL_FRAMES_GB } from "./_fed6/VideoEdit/Main_collagen3";

const Collagen3Root: React.FC = () => (
  <Composition id="Collagen3" component={MainCollagen3} durationInFrames={TOTAL_FRAMES_GB} fps={30} width={1920} height={1080} />
);

registerRoot(Collagen3Root);
