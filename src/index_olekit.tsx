// Entry del banco de prueba del kit Ole* (local o farm). Uso: ENTRY=src/index_olekit.tsx
import { registerRoot, Composition } from "remotion";
import { OleKitTest, OLE_KIT_TEST_FRAMES, OleKitA, OleKitB, OleKitC, framesOf, ITEMS_A, ITEMS_B, ITEMS_C } from "./ole/OleKitTest";

const Root = () => (
  <>
    <Composition id="OleKitTest" component={OleKitTest} durationInFrames={OLE_KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="OleKitA" component={OleKitA} durationInFrames={framesOf(ITEMS_A)} fps={30} width={1920} height={1080} />
    <Composition id="OleKitB" component={OleKitB} durationInFrames={framesOf(ITEMS_B)} fps={30} width={1920} height={1080} />
    <Composition id="OleKitC" component={OleKitC} durationInFrames={framesOf(ITEMS_C)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
