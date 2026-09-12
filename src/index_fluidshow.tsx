// Entry aislado para renderizar el showcase del kit federer-fluid en el farm.
import { Composition, registerRoot } from "remotion";
import { FluidShowcase, FLUID_SHOWCASE_FRAMES } from "./FluidShowcase";

const Root = () => (
  <Composition
    id="FluidShowcase"
    component={FluidShowcase}
    durationInFrames={FLUID_SHOWCASE_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);
registerRoot(Root);
