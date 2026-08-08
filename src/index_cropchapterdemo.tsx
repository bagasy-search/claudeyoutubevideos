import { Composition, staticFile, registerRoot } from "remotion";
import CropChapter3D from "./VideoEdit/scenes/CropChapter3D";

const F = 440;

const Demo: React.FC = () => (
  <CropChapter3D
    durationInFrames={F}
    image={staticFile("broll/cultivosep/reel_ajo.jpg")}
    number="5"
    name="Ajo"
    description="Plántalo en otoño o pierdes el año entero: el frío es lo que lo hace dividirse en dientes."
    months={[9, 10, 11]}
    tip="Un solo diente se convierte en una cabeza entera de ocho a doce dientes."
  />
);

export const CropChapterRoot: React.FC = () => (
  <Composition id="CropChapterDemo" component={Demo} durationInFrames={F} fps={30} width={1920} height={1080} />
);

registerRoot(CropChapterRoot);
