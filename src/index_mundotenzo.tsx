
import { Composition, registerRoot } from "remotion";
import { ElencoParabolas, ElencoTenzo, SetTenzo } from "./tenzo/MundoTenzo";

const Root = () => (
  <>
    <Composition id="SetTenzo" component={SetTenzo as any} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ set: "lavadero", x: 1500, y: 600, zoom: 0.6, pal: "noche" }} />
    <Composition id="ElencoTenzo" component={ElencoTenzo} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="ElencoParabolas" component={ElencoParabolas as any} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ cual: "vaishali" }} />
  </>
);
registerRoot(Root);
