// index_mdbleach.tsx — entry propio del slug.
// ⛔ `src/index.tsx` es COMPARTIDO entre sesiones: otra sesión lo deja apuntando a OTRO video y
//    los chunks mueren con "Could not find composition".
import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdBleach, TOTAL_FRAMES_MDBLEACH } from "./VideoEdit/Main_mdbleach";

const RootMdBleach: React.FC = () => (
  <>
    <Composition
      id="MdBleach"
      component={MainMdBleach}
      durationInFrames={TOTAL_FRAMES_MDBLEACH}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootMdBleach);
