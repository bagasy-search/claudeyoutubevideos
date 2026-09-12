import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcssenales, TOTAL_FRAMES_FCSSENALES } from "./_fed6/VideoEdit/Main_fcssenales";

// Entry PROPIO del video "MANCHAS Sin Razón: Tu Cuerpo Te Grita Algo Grave" (Federer Consejos Salud).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el chunk
// muere con "Could not find composition with ID Fcssenales".
const RootFcssenales: React.FC = () => (
  <>
    <Composition
      id="Fcssenales"
      component={MainFcssenales}
      durationInFrames={TOTAL_FRAMES_FCSSENALES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcssenales);
