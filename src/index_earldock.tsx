// Entry MÍNIMO solo-earldock (farm). Uso: ENTRY=src/index_earldock.tsx
import { registerRoot, Composition } from "remotion";
import { MainEarldock, TOTAL_FRAMES_EARLDOCK } from "./earldock/Main_earldock";

const Root = () => (
  <>
    <Composition id="Earldock" component={MainEarldock} durationInFrames={TOTAL_FRAMES_EARLDOCK} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
