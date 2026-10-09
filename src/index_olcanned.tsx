// Entry MÍNIMO solo-olcanned (farm). Uso: ENTRY=src/index_olcanned.tsx
import { registerRoot, Composition } from "remotion";
import { MainOlcanned, TOTAL_FRAMES_OLCANNED } from "./olcanned/Main_olcanned";

const Root = () => (
  <>
    <Composition id="Olcanned" component={MainOlcanned} durationInFrames={TOTAL_FRAMES_OLCANNED} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
