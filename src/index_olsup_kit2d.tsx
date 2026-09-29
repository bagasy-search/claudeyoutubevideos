// Entry de prueba del kit 2D de Ole. Uso: npx remotion still src/index_olsup_kit2d.tsx OleKitTest2D out.png --frame=N
import { registerRoot, Composition } from "remotion";
import { OleKitTest2D, KIT2D_FRAMES } from "./olsup/OleKitTest2D";

const Root = () => <Composition id="OleKitTest2D" component={OleKitTest2D} durationInFrames={KIT2D_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
