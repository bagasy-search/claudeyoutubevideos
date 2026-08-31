import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFedguante, TOTAL_FRAMES_FEDGUANTE } from "./_fed6/VideoEdit/Main_fedguante";

// Entry PROPIO del video "Truco del GUANTE de Romero" (Federer Archivos).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (que otra sesión
// dejó apuntando a otro video) y los 60 chunks mueren con
// "Could not find composition with ID Fedguante".
const RootFedguante: React.FC = () => (
  <>
    <Composition
      id="Fedguante"
      component={MainFedguante}
      durationInFrames={TOTAL_FRAMES_FEDGUANTE}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootFedguante);
