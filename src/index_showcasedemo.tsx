import { Composition, staticFile, registerRoot } from "remotion";
import CropShowcase from "./VideoEdit/scenes/CropShowcase";

const F = 580;
const imgs = [
  staticFile("broll/cultivosep/reel_kale.jpg"),
  staticFile("broll/cultivosep/reel_acelga.jpg"),
  staticFile("broll/cultivosep/reel_zanahoria.jpg"),
  staticFile("broll/cultivosep/reel_puerro.jpg"),
  staticFile("broll/cultivosep/reel_ajo.jpg"),
];

const Demo: React.FC = () => (
  <CropShowcase
    durationInFrames={F}
    images={imgs}
    focus={0}
    number="1"
    name="Col rizada"
    description="Con la primera helada convierte su almidón en azúcar: se vuelve más tierna y dulce."
    months={[7, 8, 9]}
    tip="Cosecha de abajo hacia arriba y te da hojas nuevas todo el invierno."
  />
);

export const ShowcaseRoot: React.FC = () => (
  <Composition id="ShowcaseDemo" component={Demo} durationInFrames={F} fps={30} width={1920} height={1080} />
);

registerRoot(ShowcaseRoot);
