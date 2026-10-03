// Entry MÍNIMO solo-hankaxis (farm). Uso: ENTRY=src/index_hankaxis.tsx
import { registerRoot, Composition } from "remotion";
import { MainHankaxis, TOTAL_FRAMES_HANKAXIS } from "./hankaxis/Main_hankaxis";

const Root = () => (
  <>
    <Composition id="Hankaxis" component={MainHankaxis} durationInFrames={TOTAL_FRAMES_HANKAXIS} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
