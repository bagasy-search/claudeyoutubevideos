import React from 'react';
import {AbsoluteFill, Series, Sequence, Audio, staticFile, interpolate} from 'remotion';
import {EpicVideoProps} from './schema';
import {BrandContext} from './lib/Brand';
import {S, CUT, TOTAL, ENABLE_AUDIO} from './config';
import {UI} from './fonts';
import {CLAMP} from './lib/anim';
import {Scene1ColdOpen} from './scenes/Scene1ColdOpen';
import {Scene2AvatarIntro} from './scenes/Scene2AvatarIntro';
import {Scene3Manifesto} from './scenes/Scene3Manifesto';
import {Scene4Stats} from './scenes/Scene4Stats';
import {Scene5Montage} from './scenes/Scene5Montage';
import {Scene6Climax} from './scenes/Scene6Climax';
import {Scene7Outro} from './scenes/Scene7Outro';
import {HitLayer} from './components/HitLayer';
import {ProgressBar} from './components/ProgressBar';
import {FilmGrain} from './components/FilmGrain';
import {Vignette} from './components/Vignette';

export const EpicVideo: React.FC<EpicVideoProps> = (props) => {
  const brand = {channelName: props.channelName, avatarName: props.avatarName, accent: props.accentColor};
  return (
    <BrandContext.Provider value={brand}>
      <AbsoluteFill style={{background: '#050507', fontFamily: UI, color: '#f4f4f6'}}>
        <Series>
          <Series.Sequence durationInFrames={S.S1}><Scene1ColdOpen /></Series.Sequence>
          <Series.Sequence durationInFrames={S.S2}><Scene2AvatarIntro /></Series.Sequence>
          <Series.Sequence durationInFrames={S.S3}><Scene3Manifesto /></Series.Sequence>
          <Series.Sequence durationInFrames={S.S4}><Scene4Stats /></Series.Sequence>
          <Series.Sequence durationInFrames={S.S5}><Scene5Montage /></Series.Sequence>
          <Series.Sequence durationInFrames={S.S6}><Scene6Climax /></Series.Sequence>
          <Series.Sequence durationInFrames={S.S7}><Scene7Outro /></Series.Sequence>
        </Series>

        {/* capas globales de acabado (adjustment layers) */}
        <HitLayer />
        <ProgressBar />
        <FilmGrain opacity={0.08} />
        <Vignette strength={0.5} />

        {ENABLE_AUDIO && <AudioLayer />}
      </AbsoluteFill>
    </BrandContext.Provider>
  );
};

const sfx = (n: string) => staticFile(`audio/sfx/${n}.mp3`);

const musicVol = (f: number) => {
  if (f < 24) return interpolate(f, [0, 24], [0, 0.9], CLAMP);
  if (f >= 1382 && f < 1410) return 0.07; // silencio pre-drop
  if (f >= 1410 && f < 1418) return interpolate(f, [1410, 1418], [0.07, 1], CLAMP);
  if (f >= 1752) return interpolate(f, [1752, 1794], [1, 0], CLAMP);
  return 0.9;
};

const AudioLayer: React.FC = () => (
  <>
    {/* cama musical: 120 BPM, épica */}
    <Sequence from={0} durationInFrames={TOTAL}>
      <Audio src={staticFile('audio/music.mp3')} volume={musicVol} />
    </Sequence>

    {/* S1 */}
    <Sequence from={0} durationInFrames={88}><Audio src={sfx('glitch')} volume={0.45} /></Sequence>
    <Sequence from={76}><Audio src={sfx('subdrop')} volume={0.9} /></Sequence>

    {/* transiciones: whooshes 2 frames antes del corte */}
    {[CUT.C1, CUT.C2, CUT.C3, CUT.C4].map((c, i) => (
      <Sequence key={i} from={c - 2}><Audio src={sfx('whoosh')} volume={0.7} /></Sequence>
    ))}

    {/* S2: avatar */}
    <Sequence from={105}><Audio src={sfx('pop')} volume={0.8} /></Sequence>
    <Sequence from={150}><Audio src={sfx('pop')} volume={0.5} /></Sequence>

    {/* S3: impacts ON BEAT (270/360/450/540 = beats 18/24/30/36) */}
    {[270, 360, 450, 540].map((b, i) => (
      <Sequence key={i} from={b}><Audio src={sfx('impact')} volume={0.65} /></Sequence>
    ))}

    {/* S5: card final aterriza en beat 86 */}
    <Sequence from={1290}><Audio src={sfx('impact')} volume={0.55} /></Sequence>

    {/* S6: riser → silencio → DROP */}
    <Sequence from={1350} durationInFrames={60}>
      <Audio src={sfx('riser')} volume={(f) => Math.min(1, f / 50)} />
    </Sequence>
    <Sequence from={1410}><Audio src={sfx('impact')} volume={1} /></Sequence>
    <Sequence from={1410}><Audio src={sfx('subdrop')} volume={1} /></Sequence>

    {/* S7: UI */}
    <Sequence from={CUT.C6 + 86}><Audio src={sfx('click')} volume={0.8} /></Sequence>
    <Sequence from={CUT.C6 + 94}><Audio src={sfx('bell')} volume={0.8} /></Sequence>
  </>
);
