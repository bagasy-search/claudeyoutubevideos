// Entry solo-Lobos. Uso: npx remotion render src/index_lobos.tsx Lobos out.mp4
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainLobos, TOTAL_FRAMES_LOBOS } from "./VideoEdit/Main_lobos";

const LobosRoot: React.FC = () => (
  <Composition id="Lobos" component={MainLobos} durationInFrames={TOTAL_FRAMES_LOBOS} fps={30} width={1920} height={1080} />
);

registerRoot(LobosRoot);
