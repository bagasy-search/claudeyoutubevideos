// Entry solo-E7h para el farm y el studio. Uso: npx remotion compositions src/index_e7h.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainE7h, TOTAL_FRAMES_E7H } from "./VideoEdit/Main_e7h";

const E7hRoot: React.FC = () => (
  <Composition id="E7h" component={MainE7h} durationInFrames={TOTAL_FRAMES_E7H} fps={30} width={1920} height={1080} />
);

registerRoot(E7hRoot);
