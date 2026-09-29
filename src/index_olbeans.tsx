// Entry MÍNIMO solo-olbeans (farm). Uso: ENTRY=src/index_olbeans.tsx
import { registerRoot, Composition } from "remotion";
import { MainOlbeans, TOTAL_FRAMES_OLBEANS } from "./olbeans/Main_olbeans";

const Root = () => (
  <>
    <Composition id="Olbeans" component={MainOlbeans} durationInFrames={TOTAL_FRAMES_OLBEANS} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
