import { Composition } from "remotion";
import { MainArtefactos, TOTAL_FRAMES_ART } from "./VideoEdit/Main_artefactos";

// Root MÍNIMO — solo la comp Artefactos, para revisar en Studio sin OOM.
export const RootArtefactos: React.FC = () => {
  return (
    <Composition
      id="Artefactos"
      component={MainArtefactos}
      durationInFrames={TOTAL_FRAMES_ART}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
