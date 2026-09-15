// Entry solo-Legsswellcold para el FARM. Uso: ENTRY=src/index_legsswellcold.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainLegsswellcold, TOTAL_FRAMES_LEGSSWELLCOLD } from "./legsswellcold/Main_legsswellcold";

const LegsswellcoldRoot: React.FC = () => (
  <Composition id="Legsswellcold" component={MainLegsswellcold} durationInFrames={TOTAL_FRAMES_LEGSSWELLCOLD} fps={30} width={1920} height={1080} />
);

registerRoot(LegsswellcoldRoot);
