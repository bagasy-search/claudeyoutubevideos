// Entry MÍNIMO solo-hazelsinger (farm). Uso: ENTRY=src/index_hazelsinger.tsx
import { registerRoot, Composition } from "remotion";
import { MainHazelsinger, TOTAL_FRAMES_HAZELSINGER } from "./hazelsinger/Main_hazelsinger";

const Root = () => (
  <>
    <Composition id="Hazelsinger" component={MainHazelsinger} durationInFrames={TOTAL_FRAMES_HAZELSINGER} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
