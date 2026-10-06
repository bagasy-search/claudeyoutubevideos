import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcscolageno, TOTAL_FRAMES_FCSCOLAGENO } from "./_fed6/VideoEdit/Main_fcscolageno";

// Entry PROPIO del video "La CUCHARADA de $1 que DISPARA tu COLAGENO" (Federer Consejos Salud).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el chunk
// muere con "Could not find composition with ID Fcscolageno".
const RootFcscolageno: React.FC = () => (
  <>
    <Composition
      id="Fcscolageno"
      component={MainFcscolageno}
      durationInFrames={TOTAL_FRAMES_FCSCOLAGENO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcscolageno);
