// index_goldpower.tsx — entry MÍNIMO para el farm (evita el OOM del Root grande y el gotcha
// del entry compartido src/index.tsx, que otra sesión suele dejar apuntando a otro video).
import { Composition, registerRoot } from "remotion";
import { MainGoldpower, TOTAL_FRAMES_GOLDPOWER } from "./VideoEdit/Main_goldpower";

const Root: React.FC = () => (
  <>
    <Composition
      id="Goldpower"
      component={MainGoldpower}
      durationInFrames={TOTAL_FRAMES_GOLDPOWER}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
