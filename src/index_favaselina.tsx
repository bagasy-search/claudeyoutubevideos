import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainFavaselina, TOTAL_FRAMES_FAVASELINA } from "./favaselina/Main_favaselina";

const RootFavaselina: React.FC = () => (
  <Composition id="Favaselina" component={MainFavaselina} durationInFrames={TOTAL_FRAMES_FAVASELINA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFavaselina);
