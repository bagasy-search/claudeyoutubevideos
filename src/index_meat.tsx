// Entry solo-Meat para Remotion Studio / farm. Uso: ENTRY=src/index_meat.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainMeat, TOTAL_FRAMES_MEAT } from "./VideoEdit/Main_meat";

const MeatRoot: React.FC = () => (
  <Composition id="Meat" component={MainMeat} durationInFrames={TOTAL_FRAMES_MEAT} fps={30} width={1920} height={1080} />
);

registerRoot(MeatRoot);
