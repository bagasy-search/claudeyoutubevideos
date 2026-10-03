// Entry MÍNIMO solo-earlsoap (farm). Uso: ENTRY=src/index_earlsoap.tsx
import { registerRoot, Composition } from "remotion";
import { MainEarlsoap, TOTAL_FRAMES_EARLSOAP } from "./earlsoap/Main_earlsoap";

const Root = () => (
  <>
    <Composition id="Earlsoap" component={MainEarlsoap} durationInFrames={TOTAL_FRAMES_EARLSOAP} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
