import "./index.css";
import { Composition } from "remotion";
import { MainVxsag, TOTAL_FRAMES_VXSAG } from "./VideoEdit/Main_vxsag2ipph2js";

// Root MÍNIMO — solo este video. Aísla del Root completo (que importa TODOS los Main_*).
export const RootVxsag: React.FC = () => (
  <>
    <Composition
      id="Vxsag"
      component={MainVxsag}
      durationInFrames={TOTAL_FRAMES_VXSAG}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
