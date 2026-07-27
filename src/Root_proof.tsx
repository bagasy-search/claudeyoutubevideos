import "./index.css";
import { Composition } from "remotion";
import { StageProof, PROOF_FRAMES } from "./VideoEdit/kit/premium/StageProof";

// Root MÍNIMO para el banco de pruebas del kit premium (componentes EN USO REAL,
// con plate de b-roll detrás y el wrapper del video). Aislado del Root principal.
export const RootProof: React.FC = () => (
  <>
    <Composition
      id="StageProof"
      component={StageProof}
      durationInFrames={PROOF_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
