// Entry MÍNIMO — componentes firma (abanico+estela, anillo+toggle, botella héroe) del canal Agua Oxigenada.
// + VsDuel (2 imágenes), TypeCardBeside (tipeo al lado del avatar), GlitchCut (transición glitch suave).
// Uso: npx remotion studio src/index_pxhero.tsx
import './index.css';
import {registerRoot, Composition, Series, AbsoluteFill} from 'remotion';
import {LightTrailCards, NodeRingToggle, BottleHero, ChapterTrailCard, TypeCardBeside, GlitchCut} from './peroxide/PeroxideHero';
import {VsDuel, THEME_PEROXIDE} from './VideoEdit/kit/premium';

const SEG = 150;
const TIPS = ['img/tip1.png', 'img/tip2.png', 'img/tip3.png', 'img/tip4.png', 'img/tip5.png', 'img/tip6.png', 'img/tip7.png', 'img/tip8.png', 'img/tip9.png'];

// fondo simulado (video del avatar) para ver los overlays transparentes en contexto
const FakeStage: React.FC<{avatarSide?: 'left' | 'right'; children?: React.ReactNode}> = ({avatarSide = 'left', children}) => (
  <AbsoluteFill style={{background: 'radial-gradient(120% 120% at 50% 40%, #201013 0%, #0A0708 55%, #000 100%)'}}>
    {/* bloque que hace de avatar visible */}
    <div style={{position: 'absolute', bottom: 0, [avatarSide]: 80, width: 520, height: 760, borderRadius: '40% 40% 0 0', background: 'linear-gradient(180deg, #3a2b2b, #171012)', opacity: 0.9}} />
    {children}
  </AbsoluteFill>
);

const Show: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={SEG}>
        <LightTrailCards durationInFrames={SEG} number="#5" images={TIPS} goldCard={4} goldAt={78} eyebrow="9 trucos con agua oxigenada" phrase="y sobre todo *el número 5*" />
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
      <Series.Sequence durationInFrames={SEG}>
        <VsDuel
          durationInFrames={SEG}
          theme={THEME_PEROXIDE}
          eyebrow="Frente a frente"
          title="¿Cuál conviene de verdad?"
          left={{label: 'Lavandina', sub: 'mancha y decolora', image: 'img/pxwash_bleach.png', good: false}}
          right={{label: 'Agua oxigenada', sub: 'limpia sin manchar', image: 'img/pxwash_oxygen.png', good: true}}
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <FakeStage avatarSide="left">
          <TypeCardBeside durationInFrames={SEG} side="right" title="Agua oxigenada" lines={['3% · la de farmacia', 'Barata y sin cloro', 'Limpia sin manchar']} />
        </FakeStage>
      </Series.Sequence>
      <Series.Sequence durationInFrames={60}>
        <FakeStage avatarSide="right">
          <GlitchCut durationInFrames={12} />
        </FakeStage>
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

const TOTAL = SEG * 8 + 60;
const Root: React.FC = () => (
  <Composition id="PeroxideHero" component={Show} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
