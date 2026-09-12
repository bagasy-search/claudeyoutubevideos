// Entry propio de ValeriaPresion. Uso: npx remotion studio src/index_valeriapresion.tsx
// Existe porque src/index.ts es COMPARTIDO y otros agentes lo pisan: el render del farm
// cayo a ese entry y solo veia la composicion de otro video.
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainValeriaPresion, TOTAL_FRAMES } from "./valeria/Main_valeriapresion";

const ValeriaPresionRoot: React.FC = () => (
  <Composition
    id="ValeriaPresion"
    component={MainValeriaPresion}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(ValeriaPresionRoot);
