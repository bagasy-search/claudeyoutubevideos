// Entry MÍNIMO solo-opaldozen (farm). Uso: ENTRY=src/index_opaldozen.tsx
import { registerRoot, Composition } from "remotion";
import { MainOpaldozen, TOTAL_FRAMES_OPALDOZEN } from "./opaldozen/Main_opaldozen";
import { OpDozenTest, DOZEN_TEST_FRAMES } from "./opal/OpDozenTest";

const Root = () => (
  <>
    <Composition id="Opaldozen" component={MainOpaldozen} durationInFrames={TOTAL_FRAMES_OPALDOZEN} fps={30} width={1920} height={1080} />
    <Composition id="OpDozenTest" component={OpDozenTest} durationInFrames={DOZEN_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
