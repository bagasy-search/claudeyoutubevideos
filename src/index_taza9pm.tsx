import { Composition, registerRoot } from "remotion";
import { MainTaza9pm, TOTAL_FRAMES_TAZA9PM } from "./_fed6/VideoEdit/Main_taza9pm";

export const Taza9pmRoot: React.FC = () => (
  <>
    <Composition id="Taza9pm" component={MainTaza9pm} durationInFrames={TOTAL_FRAMES_TAZA9PM} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Taza9pmRoot);
