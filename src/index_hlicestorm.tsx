// Entry MÍNIMO solo-hlicestorm (farm). Uso: ENTRY=src/index_hlicestorm.tsx
import { registerRoot, Composition } from "remotion";
import { MainHlicestorm, TOTAL_FRAMES_HLICESTORM } from "./hlicestorm/Main_hlicestorm";

const Root = () => (
  <>
    <Composition id="Hlicestorm" component={MainHlicestorm} durationInFrames={TOTAL_FRAMES_HLICESTORM} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
