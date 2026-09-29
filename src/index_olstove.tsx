// Entry MÍNIMO solo-olstove (farm). Uso: ENTRY=src/index_olstove.tsx
import { registerRoot, Composition } from "remotion";
import { MainOlstove, TOTAL_FRAMES_OLSTOVE } from "./olstove/Main_olstove";

const Root = () => (
  <>
    <Composition id="Olstove" component={MainOlstove} durationInFrames={TOTAL_FRAMES_OLSTOVE} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
