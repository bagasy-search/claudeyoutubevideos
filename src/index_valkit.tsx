// Entry MÍNIMO para rendear el contact sheet del kit valeria-vintage en el farm
// (evita el OOM del Root.tsx grande). Comp: ValKitReel.
// Uso: npx remotion render src/index_valkit.tsx ValKitReel out.mp4
import "./index.css";
import {registerRoot, Composition} from "remotion";
import {ValKitReel, VAL_REEL_F} from "./valeria/ValeriaKit";

const ValKitRoot: React.FC = () => (
  <Composition
    id="ValKitReel"
    component={ValKitReel}
    durationInFrames={VAL_REEL_F}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(ValKitRoot);
