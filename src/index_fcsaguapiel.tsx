import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcsaguapiel, TOTAL_FRAMES_FCSAGUAPIEL } from "./_fed6/VideoEdit/Main_fcsaguapiel";

// Entry PROPIO del video "Mayores de 60: Agrega ESTO al Agua…" (Federer Consejos Salud).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el chunk
// muere con "Could not find composition with ID Fcsaguapiel".
const RootFcsaguapiel: React.FC = () => (
  <>
    <Composition
      id="Fcsaguapiel"
      component={MainFcsaguapiel}
      durationInFrames={TOTAL_FRAMES_FCSAGUAPIEL}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcsaguapiel);
