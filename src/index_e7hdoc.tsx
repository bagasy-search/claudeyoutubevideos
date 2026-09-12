// Entry solo-E7hdoc para el farm. Uso: npx remotion compositions src/index_e7hdoc.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainE7hdoc, TOTAL_FRAMES_E7HDOC } from "./VideoEdit/Main_e7hdoc";

const Root: React.FC = () => (
  <Composition id="E7hdoc" component={MainE7hdoc} durationInFrames={TOTAL_FRAMES_E7HDOC}
    fps={30} width={1920} height={1080} />
);
registerRoot(Root);
