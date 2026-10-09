// Entry MÍNIMO solo-olwinter2 (farm). Uso: ENTRY=src/index_olwinter2.tsx
import { registerRoot, Composition } from "remotion";
import { MainOlwinter2, TOTAL_FRAMES_OLWINTER2 } from "./olwinter2/Main_olwinter2";

const Root = () => (
  <>
    <Composition id="Olwinter2" component={MainOlwinter2} durationInFrames={TOTAL_FRAMES_OLWINTER2} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
