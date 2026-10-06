import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFedcereal, TOTAL_FRAMES_FEDCEREAL } from "./_fed6/VideoEdit/Main_fedcereal";

// Entry PROPIO del video "¿Más de 60? Este CEREAL Olvidado Reconstruye tu Músculo" (Federer Archivos).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el chunk
// muere con "Could not find composition with ID Fedcereal".
const RootFedcereal: React.FC = () => (
  <>
    <Composition
      id="Fedcereal"
      component={MainFedcereal}
      durationInFrames={TOTAL_FRAMES_FEDCEREAL}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFedcereal);
