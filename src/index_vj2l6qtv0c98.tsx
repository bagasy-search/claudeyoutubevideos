// Entry solo-vj2l6qtv0c98 para el farm. Uso: ENTRY=src/index_vj2l6qtv0c98.tsx node scripts/farm.mjs ...
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVj2l6qtv0c98, TOTAL_FRAMES_VJ2L6QTV0C98 } from "./VideoEdit/Main_vj2l6qtv0c98";

const Vj2Root: React.FC = () => (
  <Composition id="Vj2l6qtv0c98" component={MainVj2l6qtv0c98} durationInFrames={TOTAL_FRAMES_VJ2L6QTV0C98} fps={30} width={1920} height={1080} />
);

registerRoot(Vj2Root);
