// Entry MÍNIMO solo-faoliva (farm). Uso: ENTRY=src/index_faoliva.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFaoliva, TOTAL_FRAMES_FAOLIVA } from "./faoliva/Main_faoliva";

const Root = () => (
  <Composition id="Faoliva" component={MainFaoliva} durationInFrames={TOTAL_FRAMES_FAOLIVA} fps={30} width={1920} height={1080} />
);

registerRoot(Root);
