// repkit · entrada de Remotion: composición "Demo" (todo el kit, 120 s) para revisar y copiar ejemplos.
import { registerRoot, Composition } from "remotion";
import { Demo, DEMO_TOTAL_S } from "./repkit/Demo";
registerRoot(() => (
  <Composition id="Demo" component={Demo} durationInFrames={Math.round(DEMO_TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
