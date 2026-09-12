// Entry de prueba de las 4 escenas bespoke. Uso: ENTRY=src/index_scenetest.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { SceneTest, TOTAL_FRAMES_SCENETEST } from "./_fed6/VideoEdit/SceneTest";

const SceneTestRoot: React.FC = () => (
  <Composition id="SceneTest" component={SceneTest} durationInFrames={TOTAL_FRAMES_SCENETEST} fps={30} width={1920} height={1080} />
);
registerRoot(SceneTestRoot);
