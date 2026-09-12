import { Composition } from "remotion";
import { MainLeones, TOTAL_FRAMES_LEO } from "./VideoEdit/Main_leones";

// Root MÍNIMO — solo la comp Leones (prueba 1 min).
export const RootLeones: React.FC = () => {
  return (
    <Composition
      id="Leones"
      component={MainLeones}
      durationInFrames={TOTAL_FRAMES_LEO}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
