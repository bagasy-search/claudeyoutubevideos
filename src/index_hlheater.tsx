// Entry MÍNIMO solo-hlheater (farm). Uso: ENTRY=src/index_hlheater.tsx
import { registerRoot, Composition } from "remotion";
import { MainHlheater, TOTAL_FRAMES_HLHEATER } from "./hlheater/Main_hlheater";

const Root = () => (
  <>
    <Composition id="Hlheater" component={MainHlheater} durationInFrames={TOTAL_FRAMES_HLHEATER} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
