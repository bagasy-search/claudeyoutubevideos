import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, Min1Body, MIN1_FRAMES, MIN1_END } from "./cmehel3d/Min1";
import { Rest, FULL_FRAMES } from "./cmehel3d/Rest";
// video entero: el minuto 1 hasta 65,6 s (entra el avatar del AV04) y desde ahí Rest
const Full = () => {
  const t = useCurrentFrame() / 30;
  return t < MIN1_END ? <Min1Body t={t} /> : <Rest />;
};
const Root = () => (
  <>
    <Composition id="CmeHel3dMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="CmeHel3dFull" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
