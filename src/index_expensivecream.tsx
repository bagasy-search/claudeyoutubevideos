// Entry solo-Expensivecream para el FARM. Uso: ENTRY=src/index_expensivecream.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainExpensivecream, TOTAL_FRAMES_EXPENSIVECREAM } from "./_fed6/VideoEdit/Main_expensivecream";

const ExpensivecreamRoot: React.FC = () => (
  <Composition id="Expensivecream" component={MainExpensivecream} durationInFrames={TOTAL_FRAMES_EXPENSIVECREAM} fps={30} width={1920} height={1080} />
);

registerRoot(ExpensivecreamRoot);
