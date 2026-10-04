// Entry MÍNIMO solo-hazeljewel (farm). Uso: ENTRY=src/index_hazeljewel.tsx
import { registerRoot, Composition } from "remotion";
import { MainHazeljewel, TOTAL_FRAMES_HAZELJEWEL } from "./hazeljewel/Main_hazeljewel";

const Root = () => (
  <>
    <Composition id="Hazeljewel" component={MainHazeljewel} durationInFrames={TOTAL_FRAMES_HAZELJEWEL} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
