// Entry solo-Crackpowder. El farm DEBE recibir ENTRY=src/index_crackpowder.tsx:
// sin eso usa src/index.tsx (compartido entre sesiones) y los chunks mueren con
// "Could not find composition with ID Crackpowder".
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainCrackpowder, TOTAL_FRAMES_CP } from "./VideoEdit/Main_crackpowder";

const CrackpowderRoot: React.FC = () => (
  <Composition id="Crackpowder" component={MainCrackpowder} durationInFrames={TOTAL_FRAMES_CP} fps={30} width={1920} height={1080} />
);

registerRoot(CrackpowderRoot);
