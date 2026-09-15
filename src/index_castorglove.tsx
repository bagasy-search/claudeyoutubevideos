// Entry solo-Castorglove para el FARM. Uso: ENTRY=src/index_castorglove.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainCastorglove, TOTAL_FRAMES_CASTORGLOVE } from "./castorglove/Main_castorglove";

const CastorgloveRoot: React.FC = () => (
  <Composition id="Castorglove" component={MainCastorglove} durationInFrames={TOTAL_FRAMES_CASTORGLOVE} fps={30} width={1920} height={1080} />
);

registerRoot(CastorgloveRoot);

