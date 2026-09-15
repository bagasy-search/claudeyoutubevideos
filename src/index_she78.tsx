// Entry solo-She78 para el FARM. Uso: ENTRY=src/index_she78.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainShe78, TOTAL_FRAMES_SHE78 } from "./she78/Main_she78";

const She78Root: React.FC = () => (
  <Composition id="She78" component={MainShe78} durationInFrames={TOTAL_FRAMES_SHE78} fps={30} width={1920} height={1080} />
);

registerRoot(She78Root);

