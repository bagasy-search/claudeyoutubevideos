// Entry aislado para renderizar GrCoffee (I RUBBED COFFEE ON MY FACE FOR 7 DAYS · canal "Golden
// Remedies", EN) en el farm. ⛔ SIN este entry propio el farm cae al src/index.tsx COMPARTIDO,
// que otra sesion deja apuntando a otro video → "Could not find composition with ID GrCoffee".
import { Composition, registerRoot } from "remotion";
import { MainGrcoffee, TOTAL_FRAMES_GRCOFFEE } from "./_fed6/VideoEdit/Main_grcoffee";
const Root = () => (
  <Composition id="GrCoffee" component={MainGrcoffee} durationInFrames={TOTAL_FRAMES_GRCOFFEE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
