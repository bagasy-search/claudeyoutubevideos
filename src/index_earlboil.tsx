// Entry MÍNIMO solo-earlboil (farm). Uso: ENTRY=src/index_earlboil.tsx
import { registerRoot, Composition } from "remotion";
import { MainEarlboil, TOTAL_FRAMES_EARLBOIL } from "./earlboil/Main_earlboil";

const Root = () => (
  <>
    <Composition id="Earlboil" component={MainEarlboil} durationInFrames={TOTAL_FRAMES_EARLBOIL} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
