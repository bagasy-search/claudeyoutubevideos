// Entry MÍNIMO solo-olpots (farm). Uso: ENTRY=src/index_olpots.tsx
import { registerRoot, Composition } from "remotion";
import { OleCardsKitTest, CARDS_KIT_FRAMES } from "./olpots/OleCardsKitTest";
import { OlePotKitTest, POT_KIT_FRAMES, OleHeatKitTest, HEAT_KIT_FRAMES, OleCoalKitTest, COAL_KIT_FRAMES } from "./olpots/OlePotKitTest";

const Root = () => (
  <>
    <Composition id="OlePotKitTest" component={OlePotKitTest} durationInFrames={POT_KIT_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="OleHeatKitTest" component={OleHeatKitTest} durationInFrames={HEAT_KIT_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="OleCardsKitTest" component={OleCardsKitTest} durationInFrames={CARDS_KIT_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="OleCoalKitTest" component={OleCoalKitTest} durationInFrames={COAL_KIT_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
