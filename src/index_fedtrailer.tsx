// Entry solo-Trailer para Remotion. Uso: npx remotion render src/index_fedtrailer.tsx FedererTrailer out.mp4
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFedtrailer, TOTAL_FRAMES_FEDTRAILER } from "./VideoEdit/Main_fedtrailer";

const TrailerRoot: React.FC = () => (
  <Composition id="FedererTrailer" component={MainFedtrailer} durationInFrames={TOTAL_FRAMES_FEDTRAILER} fps={30} width={1920} height={1080} />
);

registerRoot(TrailerRoot);
