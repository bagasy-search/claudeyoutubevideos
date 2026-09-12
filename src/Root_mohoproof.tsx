import "./index.css";
import { Composition } from "remotion";
import { MohoProof, PROOF_FRAMES } from "./VideoEdit/MohoProof";

export const RootMohoProof: React.FC = () => (
  <Composition id="MohoProof" component={MohoProof} durationInFrames={PROOF_FRAMES}
    fps={30} width={1920} height={1080} />
);
