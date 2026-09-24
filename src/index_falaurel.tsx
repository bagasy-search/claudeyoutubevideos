// Entry MÍNIMO solo-falaurel (farm). Uso: ENTRY=src/index_falaurel.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFalaurel, TOTAL_FRAMES_FALAUREL } from "./falaurel/Main_falaurel";

const Root = () => (
  <Composition id="Falaurel" component={MainFalaurel} durationInFrames={TOTAL_FRAMES_FALAUREL} fps={30} width={1920} height={1080} />
);

registerRoot(Root);
