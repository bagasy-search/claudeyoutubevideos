// Entry AISLADO del video vdjso9de381j — registra SOLO esta composición.
// ⛔ NO tocar src/Root.tsx (compartido con los otros agentes).
import { Composition, registerRoot } from "remotion";
import { MainVdj, TOTAL_FRAMES_VDJ } from "./_fed6/VideoEdit/Main_vdjso9de381j";

const RootVdj: React.FC = () => (
  <>
    <Composition
      id="FedVdj"
      component={MainVdj}
      durationInFrames={TOTAL_FRAMES_VDJ}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootVdj);
