// Entry solo-Parpados60 para el FARM. Uso: ENTRY=src/index_parpados60.tsx
// ⛔ Sin entry propio el farm cae a src/index.tsx COMPARTIDO (que otra sesión deja apuntando a otro video).
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainParpados60, TOTAL_FRAMES_P60 } from "./_fed6/VideoEdit/Main_parpados60";

const Parpados60Root: React.FC = () => (
  <Composition
    id="Parpados60"
    component={MainParpados60}
    durationInFrames={TOTAL_FRAMES_P60}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Parpados60Root);
