import "./index.css";
import { Composition } from "remotion";
import { Main_moho2, TOTAL_MOHO2, FPS } from "./VideoEdit/Main_moho2";

export const RootMoho2: React.FC = () => (
  <Composition id="Moho2" component={Main_moho2} durationInFrames={TOTAL_MOHO2} fps={FPS} width={1920} height={1080} />
);
