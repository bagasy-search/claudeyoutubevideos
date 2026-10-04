// Entry MÍNIMO solo-hlpower (farm). Uso: ENTRY=src/index_hlpower.tsx
import { registerRoot, Composition } from "remotion";
import { MainHlpower, TOTAL_FRAMES_HLPOWER } from "./hlpower/Main_hlpower";

const Root = () => (
  <>
    <Composition id="Hlpower" component={MainHlpower} durationInFrames={TOTAL_FRAMES_HLPOWER} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
