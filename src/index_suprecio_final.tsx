import { Composition, registerRoot } from "remotion";
import { FinalPrecio } from "./suprecio/FinalPrecio";
const RootFinal: React.FC = () => (
  <Composition id="FinalPrecio" component={FinalPrecio} durationInFrames={28452} fps={30} width={1920} height={1080} />
);
registerRoot(RootFinal);
