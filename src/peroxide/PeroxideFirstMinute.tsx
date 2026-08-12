/**
 * PRIMER MINUTO — canal Agua Oxigenada, video pxwash.
 * Objetivo: locura de dinamismo + nivel premium de las refs del usuario, usando
 * el KIT PREMIUM themeado a PEROXIDE (motor stagecraft: fondo cine, glow, blur,
 * motion-blur, key-light). Cada beat está anclado a una frase REAL del hook.
 *
 * NOTA: esto es la maqueta de calidad (avatar pendiente). Cuando llegue el MP4,
 * estos beats se re-anclan al ms de Whisper dentro del build_pxwash y se
 * intercalan con el avatar full + b-roll real. Los componentes/props NO cambian.
 *
 * Preview:  npx remotion studio src/index_pxfirst.tsx   → comp "PeroxideFirstMinute"
 */
import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {
  ThemeProvider,
  THEME_PEROXIDE,
  HookCaption,
  BigStatReveal,
  BulletCascade,
  MythTruth,
  HighlightSweep,
  FloatingCutout,
} from '../VideoEdit/kit/premium';
import {PremiumOverlay} from '../VideoEdit/scenes/PremiumOverlay';

const PX = THEME_PEROXIDE;
const SEG = 135; // 4.5s @30
export const TOTAL_FRAMES_PXFIRST = SEG * 8;

const Beat: React.FC<{zone?: 'topLeft' | 'left' | 'top' | 'full' | 'center'; children: React.ReactNode}> = ({
  zone = 'topLeft',
  children,
}) => (
  <AbsoluteFill style={{backgroundColor: '#04121A'}}>
    <PremiumOverlay durationInFrames={SEG} zone={zone as never} theme={PX}>
      {children}
    </PremiumOverlay>
  </AbsoluteFill>
);

export const PeroxideFirstMinute: React.FC = () => (
  <ThemeProvider theme={PX}>
    <Series>
      {/* 1 · "this little brown bottle... costs, what, a dollar?" */}
      <Series.Sequence durationInFrames={SEG}>
        <Beat zone="center">
          <HookCaption
            durationInFrames={SEG}
            words={[
              {text: 'This little brown bottle'},
              {text: 'costs'},
              {text: 'a DOLLAR', boxed: true},
            ]}
            sub="…and it does what the pros charge a fortune for"
          />
        </Beat>
      </Series.Sequence>

      {/* 2 · "the average homeowner will pay... three, four hundred dollars" */}
      <Series.Sequence durationInFrames={SEG}>
        <Beat zone="topLeft">
          <BigStatReveal
            durationInFrames={SEG}
            eyebrow="What a pressure-washing company charges"
            value={400}
            prefix="$"
            support="to clean what this $1 bottle handles"
            source="average exterior service call"
          />
        </Beat>
      </Series.Sequence>

      {/* 3 · "the green stuff on your siding. the black streaks on your roof. the slippery film on your deck." */}
      <Series.Sequence durationInFrames={SEG}>
        <Beat zone="left">
          <BulletCascade
            durationInFrames={SEG}
            eyebrow="They charge for all of this"
            bullets={[
              {pre: 'The green film on your ', key: 'siding'},
              {pre: 'The black streaks on your ', key: 'roof'},
              {pre: 'The slippery film on your ', key: 'deck'},
            ]}
          />
        </Beat>
      </Series.Sequence>

      {/* 4 · "most people think it's just the thing you pour on a scraped knee" */}
      <Series.Sequence durationInFrames={SEG}>
        <Beat zone="top">
          <MythTruth
            durationInFrames={SEG}
            myth="Just for a scraped knee"
            truth="It kills algae, mold & mildew"
            mythLabel="Myth"
            truthLabel="Truth"
          />
        </Beat>
      </Series.Sequence>

      {/* 5 · el objeto héroe: la botella */}
      <Series.Sequence durationInFrames={SEG}>
        <Beat zone="topLeft">
          <FloatingCutout
            durationInFrames={SEG}
            label="Hydrogen peroxide"
            sub="3% — the standard brown bottle"
          />
        </Beat>
      </Series.Sequence>

      {/* 6 · "a buddy of mine... they quote him two-forty" */}
      <Series.Sequence durationInFrames={SEG}>
        <Beat zone="top">
          <HighlightSweep
            durationInFrames={SEG}
            pre="A company quoted him "
            highlight="$240 to spray the side of a house"
            post=""
            note="…for something a $1 bottle kills in minutes"
          />
        </Beat>
      </Series.Sequence>

      {/* 7 · open loop del #5 */}
      <Series.Sequence durationInFrames={SEG}>
        <Beat zone="topLeft">
          <BigStatReveal
            durationInFrames={SEG}
            eyebrow="Trick #5 has saved people"
            value={400}
            prefix="$"
            support="in a single afternoon — stick around for it"
            source="the roof-streak trick"
          />
        </Beat>
      </Series.Sequence>

      {/* 8 · "so, let's get into it." */}
      <Series.Sequence durationInFrames={SEG}>
        <Beat zone="center">
          <HookCaption
            durationInFrames={SEG}
            words={[{text: 'So —'}, {text: "let's", boxed: true}, {text: 'get into it'}]}
            sub="9 tricks the pros won't tell you"
          />
        </Beat>
      </Series.Sequence>
    </Series>
  </ThemeProvider>
);
