import { Composition, Series, registerRoot } from "remotion";
import { SeasonDial, StarchToSugar, VernalizationClock, SoilFridge } from "./VideoEdit/scenes/CropMechanisms";

const SEG = 200;
const F = SEG * 4;

const Demo: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={SEG}><SeasonDial durationInFrames={SEG} /></Series.Sequence>
    <Series.Sequence durationInFrames={SEG}><StarchToSugar durationInFrames={SEG} /></Series.Sequence>
    <Series.Sequence durationInFrames={SEG}><VernalizationClock durationInFrames={SEG} /></Series.Sequence>
    <Series.Sequence durationInFrames={SEG}><SoilFridge durationInFrames={SEG} /></Series.Sequence>
  </Series>
);

export const MechRoot: React.FC = () => (
  <Composition id="MechDemo" component={Demo} durationInFrames={F} fps={30} width={1920} height={1080} />
);

registerRoot(MechRoot);
