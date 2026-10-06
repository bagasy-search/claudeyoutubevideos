import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcshigado, TOTAL_FRAMES_FCSHIGADO } from "./_fed6/VideoEdit/Main_fcshigado";

// Entry PROPIO del video "5 SEÑALES de que tu HÍGADO está Fallando" (Federer Consejos Salud).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el
// chunk muere con "Could not find composition with ID Fcshigado".
const RootFcshigado: React.FC = () => (
  <>
    <Composition
      id="Fcshigado"
      component={MainFcshigado}
      durationInFrames={TOTAL_FRAMES_FCSHIGADO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcshigado);
