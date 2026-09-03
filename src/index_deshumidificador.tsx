import { Composition, registerRoot } from "remotion";
import { MainDeshumidificador, TOTAL_FRAMES_DESHUMIDIFICADOR } from "./VideoEdit/Main_deshumidificador";

// Entry AISLADO para el farm. ⛔ Sin esto el render usa src/index.tsx compartido, que otra sesión
// deja apuntando a otro video y los 60 chunks mueren con "Could not find composition Deshumidificador".
export const DeshumidificadorRoot: React.FC = () => (
  <>
    <Composition
      id="Deshumidificador"
      component={MainDeshumidificador}
      durationInFrames={TOTAL_FRAMES_DESHUMIDIFICADOR}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(DeshumidificadorRoot);
