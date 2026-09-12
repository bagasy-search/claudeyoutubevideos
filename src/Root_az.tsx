import "./index.css";
import { Composition } from "remotion";
import { MainAzotea, TOTAL_FRAMES_AZ } from "./VideoEdit/Main_azotea";

export const RootAZ: React.FC = () => (
  <>
    <Composition id="Azotea" component={MainAzotea} durationInFrames={TOTAL_FRAMES_AZ} fps={30} width={1920} height={1080} />
  </>
);
