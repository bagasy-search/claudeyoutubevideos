// Entry del Kit Fauna para Remotion Studio. Uso: npx remotion studio src/index_faunakit.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import {
  MainFaunaKit, TOTAL_FRAMES_FAUNAKIT,
  RangeMapMorph, TrophicWeb, PopulationOdometer, TravelingTimeline, EcosystemSplitWipe,
  FieldGuideCallout, MigrationArc, CascadeDominoes, SeasonsVignette, AuthorityQuote,
} from "./VideoEdit/FaunaKit";

const C = (id: string, comp: React.FC<any>, dur = 150) => (
  <Composition id={id} component={comp} durationInFrames={dur} fps={30} width={1920} height={1080} />
);

const KitRoot: React.FC = () => (
  <>
    {C("00-Showcase", MainFaunaKit, TOTAL_FRAMES_FAUNAKIT)}
    {C("01-RangeMapMorph", RangeMapMorph)}
    {C("02-TrophicWeb", TrophicWeb, 320)}
    {C("03-PopulationOdometer", PopulationOdometer)}
    {C("04-TravelingTimeline", TravelingTimeline, 285)}
    {C("05-EcosystemSplitWipe", EcosystemSplitWipe)}
    {C("06-FieldGuideCallout", FieldGuideCallout)}
    {C("07-MigrationArc", MigrationArc, 170)}
    {C("08-CascadeDominoes", CascadeDominoes, 300)}
    {C("09-SeasonsVignette", SeasonsVignette)}
    {C("10-AuthorityQuote", AuthorityQuote)}
  </>
);

registerRoot(KitRoot);
