import { Composition, registerRoot } from "remotion";
import { LaminaChapa } from "./chapapintar/LaminaChapa";

export const LaminaRoot: React.FC = () => (
  <Composition id="LaminaChapa" component={LaminaChapa} durationInFrames={180} fps={30} width={1920} height={1080} />
);
registerRoot(LaminaRoot);
