// Entry mínimo del banco de prueba 3D del kit olsup. Uso: npx remotion still src/index_olsup_kit3d.tsx OleKitTest3D out.png --frame=N
import { registerRoot, Composition } from "remotion";
import { OleKitTest3D, KIT3D_FRAMES } from "./olsup/OleKitTest3D";

const Root = () => (
  <Composition id="OleKitTest3D" component={OleKitTest3D} durationInFrames={KIT3D_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
