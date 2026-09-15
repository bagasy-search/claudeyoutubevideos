import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdGutter, TOTAL_FRAMES_MDGUTTER } from "./mdgutter/Main_mdgutter";

registerRoot(() => (
  <Composition id="MdGutter" component={MainMdGutter} durationInFrames={TOTAL_FRAMES_MDGUTTER} fps={30} width={1920} height={1080} />
));
