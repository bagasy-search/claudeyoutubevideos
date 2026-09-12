// Entry propio de ValeriaNariz. Uso: npx remotion studio src/index_valerianariz.tsx
// Existe porque src/index.ts es COMPARTIDO y otros agentes lo pisan: el render del farm
// cayo a ese entry y solo veia la composicion de otro video.
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainValeriaNariz, TOTAL_FRAMES } from "./valeria/Main_valerianariz";

const ValeriaNarizRoot: React.FC = () => (
  <Composition
    id="ValeriaNariz"
    component={MainValeriaNariz}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(ValeriaNarizRoot);
