import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFcsmusculo, TOTAL_FRAMES_FCSMUSCULO } from "./_fed6/VideoEdit/Main_fcsmusculo";

// Entry PROPIO del video "7 Alimentos Que Ganan Músculo Mientras Duermes" (Federer Consejos Salud).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el chunk
// muere con "Could not find composition with ID Fcsmusculo".
const RootFcsmusculo: React.FC = () => (
  <>
    <Composition
      id="Fcsmusculo"
      component={MainFcsmusculo}
      durationInFrames={TOTAL_FRAMES_FCSMUSCULO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFcsmusculo);
