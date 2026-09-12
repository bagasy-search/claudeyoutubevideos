// Entry mínimo solo-Foods para Remotion Studio/render (bundle liviano).
// Uso: npx remotion studio src/index_foods.tsx  |  render Comp "Foods"
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFoods, TOTAL_FRAMES_FOODS } from "./VideoEdit/Main_foods";

const FoodsRoot: React.FC = () => (
  <Composition
    id="Foods"
    component={MainFoods}
    durationInFrames={TOTAL_FRAMES_FOODS}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(FoodsRoot);
