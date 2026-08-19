import { AbsoluteFill, Sequence } from "remotion";
import { RaisinReframe } from "./scenes/RaisinReframe";
import { IngredientDuo } from "./scenes/IngredientDuo";
import { FloodSealScene } from "./scenes/FloodSealScene";
import { WhyNightScene } from "./scenes/WhyNightScene";

// Test: las 4 escenas bespoke encadenadas (9s c/u @30fps = 270f) para validar el render.
const D = 270;
export const TOTAL_FRAMES_SCENETEST = D * 4;
export const SceneTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1D23" }}>
    <Sequence from={0} durationInFrames={D} layout="none"><RaisinReframe durationInFrames={D} /></Sequence>
    <Sequence from={D} durationInFrames={D} layout="none"><IngredientDuo durationInFrames={D} leftImg="img/nightserum_aloe.png" rightImg="img/nightserum_oil.png" /></Sequence>
    <Sequence from={D * 2} durationInFrames={D} layout="none"><FloodSealScene durationInFrames={D} aloeImg="img/nightserum_aloe.png" oilImg="img/nightserum_oil.png" /></Sequence>
    <Sequence from={D * 3} durationInFrames={D} layout="none"><WhyNightScene durationInFrames={D} /></Sequence>
  </AbsoluteFill>
);
