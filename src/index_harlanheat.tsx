// Prueba del kit HarlanHeat (OutletDangerBoard). Uso:
//   npx remotion render src/index_harlanheat.tsx OutletDangerBoard out.mp4 --browser-executable=...
//   npx remotion still src/index_harlanheat.tsx OutletDangerBoardDefaults hoja.jpg --frame=170
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { OutletDangerBoard } from "./VideoEdit/scenes/HarlanHeat";

// props como las escribiría el DIRECTOR de la fábrica en `"k": {"kind": …, "props": {…}}`
const PROPS = {
  title: "NEVER PLUG A HEATER HERE",
  eyebrow: "SPACE HEATER · SHOP BOARD",
  sub: "Straight into the wall. Nothing in between.",
  stamp: "NEVER",
  items: [
    { label: "POWER STRIP", note: "Rated for lamps, not for heat", icon: "strip" },
    { label: "THREE-PRONG ADAPTER", note: "No path to ground", icon: "adapter" },
    { label: "THIN EXTENSION CORD", note: "Light cord cooks at 1500 watts", icon: "cord" },
    { label: "LOOSE OR WARM OUTLET", note: "Warm plate means a loose terminal", icon: "outlet" },
    { label: "SHARED KITCHEN CIRCUIT", note: "Fridge and microwave already live there", icon: "kitchen" },
  ],
};

const Root: React.FC = () => (
  <>
    <Composition id="OutletDangerBoard" component={OutletDangerBoard} durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 180, ...PROPS }} />
    {/* sin props: los 5 lugares que trae el componente por default */}
    <Composition id="OutletDangerBoardDefaults" component={OutletDangerBoard} durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 180 }} />
  </>
);
registerRoot(Root);
