// Entry AISLADO para renderizar vyuc10j44snw (piernas fuertes a los 80) en el farm.
// NO toca src/Root.tsx — registra SOLO esta composición. ENTRY=src/index_vyuc10j44snw.tsx
import { Composition, registerRoot } from "remotion";
import { MainVYUC, TOTAL_FRAMES_VYUC } from "./_fed6/VideoEdit/Main_vyuc10j44snw";

const Root = () => (
  <Composition
    id="VYUC"
    component={MainVYUC}
    durationInFrames={TOTAL_FRAMES_VYUC}
    fps={30}
    width={1920}
    height={1080}
  />
);
registerRoot(Root);
