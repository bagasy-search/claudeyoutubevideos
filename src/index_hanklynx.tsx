// Entry MÍNIMO solo-hanklynx (farm). Uso: ENTRY=src/index_hanklynx.tsx
import { registerRoot, Composition } from "remotion";
import { MainHanklynx, TOTAL_FRAMES_HANKLYNX } from "./hanklynx/Main_hanklynx";

const Root = () => (
  <>
    <Composition id="Hanklynx" component={MainHanklynx} durationInFrames={TOTAL_FRAMES_HANKLYNX} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
