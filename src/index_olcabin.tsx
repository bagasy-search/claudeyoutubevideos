// Entry MÍNIMO solo-olcabin (farm). Uso: ENTRY=src/index_olcabin.tsx
import { registerRoot, Composition } from "remotion";
import { MainOlcabin, TOTAL_FRAMES_OLCABIN } from "./olcabin/Main_olcabin";

const Root = () => (
  <>
    <Composition id="Olcabin" component={MainOlcabin} durationInFrames={TOTAL_FRAMES_OLCABIN} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
