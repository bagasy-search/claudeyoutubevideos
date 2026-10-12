import { Composition, registerRoot } from "remotion";
import { Pasada2 } from "./suprecio/Pasada2";
const RootPasada2: React.FC = () => (
  <Composition id="Pasada2" component={Pasada2} durationInFrames={28773} fps={30} width={1920} height={1080} />
);
registerRoot(RootPasada2);
