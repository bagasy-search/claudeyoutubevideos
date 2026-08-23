// Entry aislado para renderizar GrBanana (BANANA PEEL ON YOUR WRINKLES · canal "Golden
// Remedies", EN) en el farm. ⛔ SIN este entry propio el farm cae al src/index.tsx COMPARTIDO,
// que otra sesion deja apuntando a otro video → "Could not find composition with ID GrBanana".
import { Composition, registerRoot } from "remotion";
import { MainGrbanana, TOTAL_FRAMES_GRBANANA } from "./_fed6/VideoEdit/Main_grbanana";
const Root = () => (
  <Composition id="GrBanana" component={MainGrbanana} durationInFrames={TOTAL_FRAMES_GRBANANA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
