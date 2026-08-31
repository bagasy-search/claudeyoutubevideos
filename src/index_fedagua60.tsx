import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFedagua60, TOTAL_FRAMES_FEDAGUA60 } from "./_fed6/VideoEdit/Main_fedagua60";

// Entry PROPIO del video "Mayores de 60: Agrega ESTO al Agua…" (Federer Consejos Salud).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el chunk
// muere con "Could not find composition with ID Fedagua60".
const RootFedagua60: React.FC = () => (
  <>
    <Composition
      id="Fedagua60"
      component={MainFedagua60}
      durationInFrames={TOTAL_FRAMES_FEDAGUA60}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFedagua60);
