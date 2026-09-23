// Entry MÍNIMO solo-faperejil (farm). Uso: ENTRY=src/index_faperejil.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFaperejil, TOTAL_FRAMES_FAPEREJIL } from "./faperejil/Main_faperejil";

const Root = () => (
  <Composition id="Faperejil" component={MainFaperejil} durationInFrames={TOTAL_FRAMES_FAPEREJIL} fps={30} width={1920} height={1080} />
);

registerRoot(Root);
