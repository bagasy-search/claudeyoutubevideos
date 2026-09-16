// Entry solo-rfbluebottle para el FARM. Uso: ENTRY=src/index_rfbluebottle.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRfbluebottle, TOTAL_FRAMES_RFBLUEBOTTLE } from "./rfbluebottle/Main_rfbluebottle";

const RfbluebottleRoot: React.FC = () => (
  <Composition id="Rfbluebottle" component={MainRfbluebottle} durationInFrames={TOTAL_FRAMES_RFBLUEBOTTLE} fps={30} width={1920} height={1080} />
);

registerRoot(RfbluebottleRoot);
