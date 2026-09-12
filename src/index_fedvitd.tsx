// Entry solo-fedvitd para Remotion (Studio + farm). ENTRY=src/index_fedvitd.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFedvitd, TOTAL_FRAMES_FEDVITD } from "./_fed6/VideoEdit/Main_fedvitd";

const FedvitdRoot: React.FC = () => (
  <Composition id="FedVitD" component={MainFedvitd} durationInFrames={TOTAL_FRAMES_FEDVITD} fps={30} width={1920} height={1080} />
);

registerRoot(FedvitdRoot);
