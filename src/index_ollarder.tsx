// Entry MÍNIMO solo-ollarder (farm). Uso: ENTRY=src/index_ollarder.tsx
import { registerRoot, Composition } from "remotion";
import { MainOllarder, TOTAL_FRAMES_OLLARDER } from "./ollarder/Main_ollarder";

const Root = () => (
  <>
    <Composition id="Ollarder" component={MainOllarder} durationInFrames={TOTAL_FRAMES_OLLARDER} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
