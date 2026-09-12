import { registerRoot, Composition } from "remotion";
import { MainEstoalos70, TOTAL_FRAMES_ESTOALOS70 } from "./_fed6/VideoEdit/Main_estoalos70";

// Entry MINIMO y PROPIO de este video. El farm se dispara con ENTRY=src/index_estoalos70.tsx:
// sin esto usa src/index.tsx, que es COMPARTIDO y otra sesion lo deja apuntando a otro video.
registerRoot(() => (
  <Composition
    id="Estoalos70"
    component={MainEstoalos70}
    durationInFrames={TOTAL_FRAMES_ESTOALOS70}
    fps={30}
    width={1920}
    height={1080}
  />
));
