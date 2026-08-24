import "./index.css";
import { Composition } from "remotion";
import { Main_moho, TOTAL_MOHO, FPS } from "./VideoEdit/Main_moho";

export const RootMoho: React.FC = () => (
  <Composition id="Moho" component={Main_moho} durationInFrames={TOTAL_MOHO} fps={FPS} width={1920} height={1080} />
);
