// Entry MÍNIMO solo-ollarder2 (farm). Uso: ENTRY=src/index_ollarder2.tsx
import { registerRoot, Composition } from "remotion";
import { MainOllarder2, TOTAL_FRAMES_OLLARDER2 } from "./ollarder2/Main_ollarder2";

const Root = () => (
  <>
    <Composition id="Ollarder2" component={MainOllarder2} durationInFrames={TOTAL_FRAMES_OLLARDER2} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
