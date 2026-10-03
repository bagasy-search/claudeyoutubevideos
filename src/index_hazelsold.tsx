// Entry MÍNIMO solo-hazelsold (farm). Uso: ENTRY=src/index_hazelsold.tsx
import { registerRoot, Composition } from "remotion";
import { MainHazelsold, TOTAL_FRAMES_HAZELSOLD } from "./hazelsold/Main_hazelsold";

const Root = () => (
  <>
    <Composition id="Hazelsold" component={MainHazelsold} durationInFrames={TOTAL_FRAMES_HAZELSOLD} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
