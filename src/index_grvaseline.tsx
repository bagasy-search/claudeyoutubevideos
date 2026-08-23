// Entry aislado para renderizar GrVaseline (WHY DO DOCTORS NEVER TELL YOU TO RUB VASELINE HERE AT
// NIGHT · canal "Golden Remedies", EN) en el farm. SIN este entry propio el farm cae al
// src/index.tsx COMPARTIDO, que otra sesion deja apuntando a otro video.
import { Composition, registerRoot } from "remotion";
import { MainGrvaseline, TOTAL_FRAMES_GRVASELINE } from "./_fed6/VideoEdit/Main_grvaseline";
const Root = () => (
  <Composition id="GrVaseline" component={MainGrvaseline} durationInFrames={TOTAL_FRAMES_GRVASELINE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
