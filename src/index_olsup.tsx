// Entry MÍNIMO solo-olsup (farm). Uso: ENTRY=src/index_olsup.tsx
import { registerRoot, Composition } from "remotion";
import { MainOlsup, TOTAL_FRAMES_OLSUP } from "./olsup/Main_olsup";

const Root = () => (
  <>
    <Composition id="Olsup" component={MainOlsup} durationInFrames={TOTAL_FRAMES_OLSUP} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
