import { Composition, staticFile, registerRoot } from "remotion";
import CropReel3D from "./VideoEdit/scenes/CropReel3D";

const F = 250;

const Demo: React.FC = () => (
  <CropReel3D
    durationInFrames={F}
    images={[
      staticFile("broll/cultivosep/reel_kale.jpg"),
      staticFile("broll/cultivosep/reel_acelga.jpg"),
      staticFile("broll/cultivosep/reel_zanahoria.jpg"),
      staticFile("broll/cultivosep/reel_puerro.jpg"),
      staticFile("broll/cultivosep/reel_ajo.jpg"),
    ]}
    labels={["Col rizada", "Acelga", "Zanahoria", "Puerro", "Ajo"]}
    numbers={["1", "2", "3", "4", "5"]}
    reveals={[66, 106, 146, 186, 222]}
  />
);

export const CropReelRoot: React.FC = () => (
  <Composition
    id="CropReelDemo"
    component={Demo}
    durationInFrames={F}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(CropReelRoot);
