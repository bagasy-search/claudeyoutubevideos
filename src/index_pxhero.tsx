// Entry MÍNIMO — componentes firma (abanico+estela, anillo+toggle, botella héroe) del canal Agua Oxigenada.
// Uso: npx remotion studio src/index_pxhero.tsx
import './index.css';
import {registerRoot, Composition, Series, AbsoluteFill} from 'remotion';
import {LightTrailCards, NodeRingToggle, BottleHero, ChapterTrailCard} from './peroxide/PeroxideHero';

const SEG = 150;
const TIPS = ['img/tip1.png', 'img/tip2.png', 'img/tip3.png', 'img/tip4.png', 'img/tip5.png', 'img/tip6.png', 'img/tip7.png', 'img/tip8.png', 'img/tip9.png'];

const Show: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={SEG}>
        <LightTrailCards durationInFrames={SEG} number="#1" images={TIPS} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <LightTrailCards
          durationInFrames={SEG}
          eyebrow="Truco #5 — el de $400"
          phrase="las rayas del techo *desaparecen*"
          number="#5"
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <NodeRingToggle durationInFrames={SEG} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <BottleHero durationInFrames={SEG} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <ChapterTrailCard durationInFrames={SEG} number="#5" title="Roof streaks vanish" sub="the $400 one" />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <Composition id="PeroxideHero" component={Show} durationInFrames={SEG * 5} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
