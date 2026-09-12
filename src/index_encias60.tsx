import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainEncias60, TOTAL_FRAMES_ENCIAS60 } from "./_fed6/VideoEdit/Main_encias60";

// Entry PROPIO del video "Encías Retraídas +60" (Federer - Más Salud, Más Vida).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el
// chunk muere con "Could not find composition with ID Encias60".
const RootEncias60: React.FC = () => (
  <>
    <Composition
      id="Encias60"
      component={MainEncias60}
      durationInFrames={TOTAL_FRAMES_ENCIAS60}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootEncias60);
