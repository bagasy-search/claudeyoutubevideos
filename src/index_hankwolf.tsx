// Entry MÍNIMO solo-hankwolf (farm). Uso: ENTRY=src/index_hankwolf.tsx
import { registerRoot, Composition } from "remotion";
import { MainHankwolf, TOTAL_FRAMES_HANKWOLF } from "./hankwolf/Main_hankwolf";

const Root = () => (
  <>
    <Composition id="Hankwolf" component={MainHankwolf} durationInFrames={TOTAL_FRAMES_HANKWOLF} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
