import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  FedChapter,
  FedCta,
  FedQuote,
} from '../FedererKit';

export const TOTAL_FRAMES_VBB0RDKRFDUO = 45713;

const FPS = 30;
const INK = '#071014';
const IVORY = '#F4EFE4';
const TEAL = '#83C7B1';
const GOLD = '#D4AF63';
const RED = '#D76E5F';
const BLUE = '#7AB6D9';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

type MediaSpec = {
  src: string;
  type: 'image' | 'video';
  startFrom?: number;
  position?: string;
};

type SceneKind =
  | 'image'
  | 'montage'
  | 'chapter'
  | 'checklist'
  | 'step'
  | 'promise'
  | 'mechanism'
  | 'triptych'
  | 'alert'
  | 'calendar'
  | 'error'
  | 'compare'
  | 'quote'
  | 'cta';

type SceneSpec = {
  id: string;
  start: number;
  end: number;
  kind: SceneKind;
  kicker: string;
  title: string;
  subtitle?: string;
  items?: string[];
  labels?: string[];
  media?: MediaSpec[];
  accent?: string;
  step?: number;
  total?: number;
};

const img = (name: string, position = '50% 50%'): MediaSpec => ({
  src: `img/${name}.png`,
  type: 'image',
  position,
});

const stock = (name: string, startFrom = 0.5, position = '50% 50%'): MediaSpec => ({
  src: `broll/${name}.mp4`,
  type: 'video',
  startFrom,
  position,
});

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const afterOpening = Math.max(0, frame - 84);
  const cycle = afterOpening % secondsToFrames(18);
  const cycleIndex = Math.floor(afterOpening / secondsToFrames(18));
  const scale = frame < 84
    ? 1
    : interpolate(cycle, [0, secondsToFrames(18)], cycleIndex % 2 === 0 ? [1.005, 1.027] : [1.027, 1.006], clamp);
  const drift = frame < 84 ? 0 : Math.sin(frame / 260) * 0.22;

  return (
    <AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile('vbb0rdkrfduo_opt.mp4')}
        volume={1}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          transformOrigin: '50% 42%',
          transform: `scale(${scale}) translateX(${drift}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const MediaLayer: React.FC<{media: MediaSpec; duration: number; index?: number}> = ({media, duration, index = 0}) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [0, Math.max(1, duration - 1)], [0, 1], clamp);
  const scale = 1.018 + move * 0.055;
  const direction = index % 2 === 0 ? 1 : -1;
  const x = interpolate(move, [0, 1], [-0.55 * direction, 0.55 * direction], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
      {media.type === 'video' ? (
        <OffthreadVideo
          src={staticFile(media.src)}
          muted
          startFrom={secondsToFrames(media.startFrom ?? 0)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: media.position ?? '50% 50%',
            transform: `scale(${scale}) translateX(${x}%)`,
          }}
        />
      ) : (
        <Img
          src={staticFile(media.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: media.position ?? '50% 50%',
            transform: `scale(${scale}) translateX(${x}%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const EditorialHeader: React.FC<{
  kicker: string;
  title: string;
  subtitle?: string;
  accent: string;
  align?: 'left' | 'center';
}> = ({kicker, title, subtitle, accent, align = 'left'}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: FPS, config: {damping: 18, stiffness: 115, mass: 0.8}});
  const y = interpolate(enter, [0, 1], [42, 0], clamp);
  const centered = align === 'center';
  return (
    <div
      style={{
        position: 'absolute',
        left: centered ? 280 : 92,
        right: centered ? 280 : 620,
        bottom: 78,
        zIndex: 8,
        textAlign: centered ? 'center' : 'left',
        color: IVORY,
        fontFamily: 'Arial, Helvetica, sans-serif',
        transform: `translateY(${y}px)`,
        opacity: enter,
      }}
    >
      <div style={{fontSize: 19, letterSpacing: 4.2, fontWeight: 900, color: accent, marginBottom: 14}}>{kicker}</div>
      <div style={{fontSize: centered ? 66 : 72, lineHeight: 0.98, letterSpacing: -2.4, fontWeight: 900, textWrap: 'balance'}}>{title}</div>
      {subtitle ? <div style={{fontSize: 29, lineHeight: 1.22, color: '#DCE6E2', marginTop: 18, maxWidth: 1100}}>{subtitle}</div> : null}
    </div>
  );
};

const ImageStory: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const media = scene.media?.[0];
  if (!media) return null;
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <MediaLayer media={media} duration={duration} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(4,11,14,.88) 0%, rgba(4,11,14,.34) 52%, rgba(4,11,14,.05) 100%)'}} />
      <EditorialHeader kicker={scene.kicker} title={scene.title} subtitle={scene.subtitle} accent={scene.accent ?? TEAL} />
    </AbsoluteFill>
  );
};

const MontageScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const media = scene.media ?? [];
  if (!media.length) return null;
  const base = Math.floor(duration / media.length);
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      {media.map((asset, index) => {
        const from = index * base;
        const shotDuration = index === media.length - 1 ? duration - from : base;
        const label = scene.labels?.[index] ?? scene.title;
        return (
          <Sequence key={`${scene.id}-${asset.src}`} from={from} durationInFrames={shotDuration} premountFor={15}>
            <MediaLayer media={asset} duration={shotDuration} index={index} />
            <AbsoluteFill style={{background: index % 2 === 0 ? 'linear-gradient(90deg, rgba(4,11,14,.82), transparent 64%)' : 'linear-gradient(270deg, rgba(4,11,14,.82), transparent 64%)'}} />
            <EditorialHeader kicker={scene.kicker} title={label} subtitle={index === media.length - 1 ? scene.subtitle : undefined} accent={scene.accent ?? TEAL} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const ComponentBackdrop: React.FC<{accent: string; children: React.ReactNode}> = ({accent, children}) => {
  const frame = useCurrentFrame();
  const glowX = 35 + Math.sin(frame / 95) * 8;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${glowX}% 35%, ${accent}24 0%, transparent 35%), linear-gradient(135deg, #071014 0%, #0B1D22 58%, #071014 100%)`,
        color: IVORY,
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', inset: 42, border: `1px solid ${accent}36`, borderRadius: 34}} />
      {children}
    </AbsoluteFill>
  );
};

const ChecklistScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const frame = useCurrentFrame();
  const accent = scene.accent ?? TEAL;
  const items = scene.items ?? [];
  const revealEvery = Math.max(18, Math.floor((duration - 35) / Math.max(1, items.length)));
  const media = scene.media?.[0];
  return (
    <ComponentBackdrop accent={accent}>
      {media ? (
        <div style={{position: 'absolute', right: 64, top: 82, bottom: 82, width: 730, borderRadius: 28, overflow: 'hidden'}}>
          <MediaLayer media={media} duration={duration} />
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(7,16,20,.5), transparent 40%)'}} />
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 100, top: 96, width: media ? 950 : 1500}}>
        <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 4, color: accent, marginBottom: 14}}>{scene.kicker}</div>
        <div style={{fontSize: 68, lineHeight: 0.98, fontWeight: 900, letterSpacing: -2.2, maxWidth: 1080}}>{scene.title}</div>
        {scene.subtitle ? <div style={{fontSize: 27, lineHeight: 1.3, color: '#C9D8D3', marginTop: 18, maxWidth: 940}}>{scene.subtitle}</div> : null}
        <div style={{display: 'grid', gridTemplateColumns: media ? '1fr' : '1fr 1fr', gap: 14, marginTop: 34, maxWidth: media ? 900 : 1450}}>
          {items.map((item, index) => {
            const local = frame - 14 - index * revealEvery;
            const enter = spring({frame: local, fps: FPS, config: {damping: 18, stiffness: 120}});
            return (
              <div
                key={item}
                style={{
                  minHeight: 68,
                  borderRadius: 17,
                  padding: '15px 20px',
                  border: `1px solid ${accent}48`,
                  background: 'rgba(255,255,255,.055)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: enter,
                  transform: `translateX(${interpolate(enter, [0, 1], [34, 0], clamp)}px)`,
                  fontSize: 27,
                  fontWeight: 760,
                }}
              >
                <div style={{width: 30, height: 30, borderRadius: 99, backgroundColor: accent, color: INK, display: 'grid', placeItems: 'center', fontSize: 17, fontWeight: 950}}>{index + 1}</div>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </ComponentBackdrop>
  );
};

const RecipeStepScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const frame = useCurrentFrame();
  const accent = scene.accent ?? GOLD;
  const media = scene.media?.[0];
  const titleEnter = spring({frame, fps: FPS, config: {damping: 18, stiffness: 100}});
  const items = scene.items ?? [];
  return (
    <AbsoluteFill style={{backgroundColor: INK, color: IVORY, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      {media ? <MediaLayer media={media} duration={duration} /> : null}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(4,10,13,.96) 0%, rgba(4,10,13,.78) 42%, rgba(4,10,13,.12) 78%, rgba(4,10,13,.06) 100%)'}} />
      <div style={{position: 'absolute', left: 90, top: 70, width: 1040, opacity: titleEnter, transform: `translateX(${interpolate(titleEnter, [0, 1], [-55, 0], clamp)}px)`}}>
        <div style={{fontSize: 19, letterSpacing: 4.2, fontWeight: 900, color: accent}}>{scene.kicker}</div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 28, marginTop: 14}}>
          <div style={{fontSize: 158, lineHeight: 0.78, fontWeight: 950, color: accent}}>{String(scene.step ?? 1).padStart(2, '0')}</div>
          <div style={{fontSize: 64, lineHeight: 0.98, fontWeight: 900, letterSpacing: -2, paddingBottom: 4}}>{scene.title}</div>
        </div>
        {scene.subtitle ? <div style={{fontSize: 29, lineHeight: 1.28, color: '#D2DEDA', marginTop: 24, maxWidth: 940}}>{scene.subtitle}</div> : null}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32}}>
          {items.map((item, index) => {
            const enter = spring({frame: frame - 16 - index * Math.max(16, Math.floor(duration / Math.max(2, items.length + 1))), fps: FPS, config: {damping: 18, stiffness: 120}});
            return <div key={item} style={{padding: '14px 20px', borderRadius: 99, backgroundColor: `${accent}E8`, color: INK, fontSize: 24, fontWeight: 900, opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [24, 0], clamp)}px)`}}>{item}</div>;
          })}
        </div>
      </div>
      <div style={{position: 'absolute', right: 84, bottom: 64, fontSize: 20, fontWeight: 900, letterSpacing: 3, color: accent}}>PASO {scene.step ?? 1} / {scene.total ?? 8}</div>
    </AbsoluteFill>
  );
};

const PromiseScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const frame = useCurrentFrame();
  const accent = scene.accent ?? RED;
  const media = scene.media?.[0];
  const split = interpolate(frame, [0, Math.min(35, duration * 0.18), Math.min(70, duration * 0.42)], [0, 0.48, 1], clamp);
  return (
    <ComponentBackdrop accent={accent}>
      {media ? <div style={{position: 'absolute', right: 60, top: 60, bottom: 60, width: 760, borderRadius: 30, overflow: 'hidden'}}><MediaLayer media={media} duration={duration} /><AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(7,16,20,.42), transparent)'}} /></div> : null}
      <div style={{position: 'absolute', left: 98, top: 86, width: 1030}}>
        <div style={{fontSize: 20, letterSpacing: 4, color: accent, fontWeight: 950}}>{scene.kicker}</div>
        <div style={{fontSize: 70, lineHeight: 0.98, fontWeight: 930, letterSpacing: -2.4, marginTop: 18}}>{scene.title}</div>
        <div style={{height: 4, width: `${split * 760}px`, backgroundColor: accent, marginTop: 30}} />
        <div style={{fontSize: 38, lineHeight: 1.12, fontWeight: 850, color: split > 0.72 ? IVORY : '#81918C', marginTop: 28, maxWidth: 920}}>{scene.subtitle}</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30}}>
          {(scene.items ?? []).map((item, index) => {
            const enter = spring({frame: frame - 45 - index * 22, fps: FPS, config: {damping: 19, stiffness: 115}});
            return <div key={item} style={{padding: '13px 18px', borderRadius: 14, border: `1px solid ${accent}66`, background: 'rgba(255,255,255,.055)', fontSize: 23, fontWeight: 800, opacity: enter}}>{item}</div>;
          })}
        </div>
      </div>
    </ComponentBackdrop>
  );
};

const MechanismScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const frame = useCurrentFrame();
  const accent = scene.accent ?? BLUE;
  const items = scene.items ?? [];
  const media = scene.media?.[0];
  return (
    <ComponentBackdrop accent={accent}>
      <div style={{position: 'absolute', left: 96, right: 96, top: 72}}>
        <div style={{fontSize: 19, letterSpacing: 4.2, fontWeight: 900, color: accent}}>{scene.kicker}</div>
        <div style={{fontSize: 65, lineHeight: 1, fontWeight: 920, marginTop: 14, letterSpacing: -2}}>{scene.title}</div>
        {scene.subtitle ? <div style={{fontSize: 27, color: '#CCD9D5', marginTop: 16}}>{scene.subtitle}</div> : null}
      </div>
      {media ? <div style={{position: 'absolute', left: 110, bottom: 78, width: 620, height: 610, borderRadius: 30, overflow: 'hidden'}}><MediaLayer media={media} duration={duration} /></div> : null}
      <div style={{position: 'absolute', left: media ? 790 : 170, right: 100, bottom: 90, height: 610, display: 'grid', gridTemplateColumns: items.length > 4 ? '1fr 1fr' : '1fr', gap: 14, alignContent: 'center'}}>
        {items.map((item, index) => {
          const enter = spring({frame: frame - 12 - index * Math.max(20, Math.floor((duration - 24) / Math.max(1, items.length))), fps: FPS, config: {damping: 18, stiffness: 100}});
          return (
            <div key={item} style={{position: 'relative', minHeight: 90, borderRadius: 24, background: 'rgba(255,255,255,.06)', border: `1px solid ${accent}55`, display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [45, 0], clamp)}px)`}}>
              <div style={{width: 46, height: 46, borderRadius: 99, backgroundColor: accent, boxShadow: `0 0 34px ${accent}77`}} />
              <div style={{fontSize: 28, lineHeight: 1.12, fontWeight: 820}}>{item}</div>
            </div>
          );
        })}
      </div>
    </ComponentBackdrop>
  );
};

const TriptychScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const frame = useCurrentFrame();
  const accent = scene.accent ?? GOLD;
  const items = scene.items ?? [];
  const media = scene.media ?? [];
  return (
    <ComponentBackdrop accent={accent}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 68, textAlign: 'center'}}>
        <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 4.2, color: accent}}>{scene.kicker}</div>
        <div style={{fontSize: 60, lineHeight: 1, fontWeight: 920, marginTop: 12}}>{scene.title}</div>
      </div>
      <div style={{position: 'absolute', left: 76, right: 76, bottom: 74, top: 270, display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, items.length)}, 1fr)`, gap: 18}}>
        {items.map((item, index) => {
          const enter = spring({frame: frame - 8 - index * Math.max(18, Math.floor(duration / Math.max(2, items.length + 1))), fps: FPS, config: {damping: 18, stiffness: 105}});
          const asset = media[index] ?? media[0];
          return (
            <div key={item} style={{position: 'relative', borderRadius: 26, overflow: 'hidden', border: `1px solid ${accent}55`, background: '#102329', opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [48, 0], clamp)}px)`}}>
              {asset ? <MediaLayer media={asset} duration={duration} index={index} /> : null}
              <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(5,12,15,.92), rgba(5,12,15,.08) 68%)'}} />
              <div style={{position: 'absolute', left: 26, right: 26, bottom: 28, fontSize: 28, lineHeight: 1.08, fontWeight: 900, color: IVORY}}>{item}</div>
            </div>
          );
        })}
      </div>
    </ComponentBackdrop>
  );
};

const AlertScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const frame = useCurrentFrame();
  const accent = scene.accent ?? RED;
  const items = scene.items ?? [];
  const media = scene.media?.[0];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(125deg, #150B0D 0%, #071014 66%)', color: IVORY, fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden'}}>
      {media ? <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 850}}><MediaLayer media={media} duration={duration} /><AbsoluteFill style={{background: 'linear-gradient(90deg, #071014 0%, rgba(7,16,20,.18) 62%)'}} /></div> : null}
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, backgroundColor: accent}} />
      <div style={{position: 'absolute', left: 100, top: 86, width: media ? 1030 : 1500}}>
        <div style={{fontSize: 20, letterSpacing: 4.5, fontWeight: 950, color: accent}}>{scene.kicker}</div>
        <div style={{fontSize: 72, lineHeight: 0.98, letterSpacing: -2.2, fontWeight: 940, marginTop: 16}}>{scene.title}</div>
        {scene.subtitle ? <div style={{fontSize: 30, lineHeight: 1.28, color: '#E5CECD', marginTop: 22, maxWidth: 980}}>{scene.subtitle}</div> : null}
        <div style={{display: 'grid', gridTemplateColumns: items.length > 4 ? '1fr 1fr' : '1fr', gap: 12, marginTop: 34}}>
          {items.map((item, index) => {
            const enter = spring({frame: frame - 16 - index * Math.max(18, Math.floor((duration - 25) / Math.max(1, items.length))), fps: FPS, config: {damping: 20, stiffness: 120}});
            return <div key={item} style={{padding: '15px 20px', borderRadius: 15, background: `${accent}19`, border: `1px solid ${accent}55`, fontSize: 27, fontWeight: 820, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [-30, 0], clamp)}px)`}}>{item}</div>;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CalendarScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const frame = useCurrentFrame();
  const accent = scene.accent ?? GOLD;
  const active = Math.floor(interpolate(frame, [8, Math.max(9, duration - 15)], [0, 14], clamp));
  return (
    <ComponentBackdrop accent={accent}>
      <div style={{position: 'absolute', left: 94, right: 94, top: 72}}>
        <div style={{fontSize: 19, letterSpacing: 4.2, color: accent, fontWeight: 900}}>{scene.kicker}</div>
        <div style={{fontSize: 68, fontWeight: 940, letterSpacing: -2.2, marginTop: 12}}>{scene.title}</div>
        {scene.subtitle ? <div style={{fontSize: 28, color: '#D1DEDA', marginTop: 12}}>{scene.subtitle}</div> : null}
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, bottom: 100, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14}}>
        {Array.from({length: 15}).map((_, index) => {
          const on = index <= active;
          return (
            <div key={index} style={{height: 145, borderRadius: 24, background: on ? `${accent}E8` : 'rgba(255,255,255,.055)', border: `1px solid ${on ? accent : `${accent}33`}`, color: on ? INK : '#84948F', display: 'grid', placeItems: 'center', fontSize: 44, fontWeight: 950, transform: `translateY(${on ? -5 : 0}px)`, boxShadow: on ? `0 18px 42px ${accent}22` : 'none'}}>{index}</div>
          );
        })}
      </div>
    </ComponentBackdrop>
  );
};

const ErrorScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const frame = useCurrentFrame();
  const accent = scene.accent ?? RED;
  const media = scene.media?.[0];
  const slash = interpolate(frame, [5, Math.min(28, duration * 0.35)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{backgroundColor: INK, color: IVORY, fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden'}}>
      {media ? <MediaLayer media={media} duration={duration} /> : null}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(7,16,20,.96) 0%, rgba(7,16,20,.74) 58%, rgba(7,16,20,.2) 100%)'}} />
      <div style={{position: 'absolute', left: 86, top: 74, fontSize: 190, lineHeight: 0.8, fontWeight: 950, color: accent, opacity: 0.92}}>{String(scene.step ?? 1).padStart(2, '0')}</div>
      <div style={{position: 'absolute', left: 90, top: 330, width: 1160}}>
        <div style={{fontSize: 20, fontWeight: 950, color: accent, letterSpacing: 4.4}}>{scene.kicker}</div>
        <div style={{fontSize: 66, lineHeight: 1, fontWeight: 930, letterSpacing: -2.2, marginTop: 14}}>{scene.title}</div>
        {scene.subtitle ? <div style={{fontSize: 30, color: '#E3D1CF', marginTop: 22, maxWidth: 1080}}>{scene.subtitle}</div> : null}
      </div>
      <div style={{position: 'absolute', right: 98, top: 86, width: 14, height: `${slash * 850}px`, backgroundColor: accent, transform: 'rotate(16deg)', transformOrigin: 'top center', boxShadow: `0 0 24px ${accent}88`}} />
    </AbsoluteFill>
  );
};

const CompareScene: React.FC<{scene: SceneSpec; duration: number}> = ({scene, duration}) => {
  const media = scene.media ?? [];
  const labels = scene.labels ?? ['UNO', 'OTRO'];
  const accent = scene.accent ?? GOLD;
  return (
    <AbsoluteFill style={{backgroundColor: INK, color: IVORY, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      {[0, 1].map((index) => {
        const asset = media[index];
        return (
          <div key={labels[index] ?? index} style={{position: 'absolute', left: index === 0 ? 0 : '50%', top: 0, bottom: 0, width: '50%', overflow: 'hidden'}}>
            {asset ? <MediaLayer media={asset} duration={duration} index={index} /> : null}
            <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(7,16,20,.9), rgba(7,16,20,.05) 70%)'}} />
            <div style={{position: 'absolute', left: 54, right: 54, bottom: 74, fontSize: 44, lineHeight: 1.02, fontWeight: 930}}>{labels[index]}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 5, backgroundColor: accent}} />
      <div style={{position: 'absolute', left: 720, right: 720, top: 60, textAlign: 'center', fontSize: 20, fontWeight: 950, letterSpacing: 4, color: accent}}>{scene.kicker}</div>
      <div style={{position: 'absolute', left: 310, right: 310, top: 106, textAlign: 'center', fontSize: 58, lineHeight: 1, fontWeight: 940, textShadow: '0 6px 24px rgba(0,0,0,.7)'}}>{scene.title}</div>
      <div style={{position: 'absolute', left: '50%', top: 475, transform: 'translate(-50%, -50%)', width: 112, height: 112, borderRadius: 99, backgroundColor: accent, color: INK, display: 'grid', placeItems: 'center', fontSize: 62, fontWeight: 950}}>≠</div>
    </AbsoluteFill>
  );
};

const renderScene = (scene: SceneSpec, duration: number) => {
  if (scene.kind === 'image') return <ImageStory scene={scene} duration={duration} />;
  if (scene.kind === 'montage') return <MontageScene scene={scene} duration={duration} />;
  if (scene.kind === 'checklist') return <ChecklistScene scene={scene} duration={duration} />;
  if (scene.kind === 'step') return <RecipeStepScene scene={scene} duration={duration} />;
  if (scene.kind === 'promise') return <PromiseScene scene={scene} duration={duration} />;
  if (scene.kind === 'mechanism') return <MechanismScene scene={scene} duration={duration} />;
  if (scene.kind === 'triptych') return <TriptychScene scene={scene} duration={duration} />;
  if (scene.kind === 'alert') return <AlertScene scene={scene} duration={duration} />;
  if (scene.kind === 'calendar') return <CalendarScene scene={scene} duration={duration} />;
  if (scene.kind === 'error') return <ErrorScene scene={scene} duration={duration} />;
  if (scene.kind === 'compare') return <CompareScene scene={scene} duration={duration} />;
  if (scene.kind === 'chapter') return <FedChapter kicker={scene.kicker} index={String(scene.step ?? '01').padStart(2, '0')} title={scene.title} sub={scene.subtitle ?? ''} accent={scene.accent ?? GOLD} mood="gold" />;
  if (scene.kind === 'quote') return <FedQuote kicker={scene.kicker} quote={scene.title} author="Dr. Valler" role={scene.subtitle ?? ''} image={staticFile(scene.media?.[0]?.src ?? 'img/vbb_rosemary_macro.png')} accent={scene.accent ?? GOLD} mood="warmdark" />;
  return <FedCta kicker={scene.kicker} title={scene.title} hot={['ROMERO']} sub={scene.subtitle ?? ''} buttonLabel="ESCRIBÍ ROMERO" image={staticFile(scene.media?.[0]?.src ?? 'img/vbb_rosemary_macro.png')} accent={scene.accent ?? GOLD} mood="gold" />;
};

const SCENES: SceneSpec[] = [
  {id: 'fm02', start: 2.8, end: 6.16, kind: 'image', kicker: 'RECREACIÓN ARTÍSTICA', title: 'Isabel de Polonia', subtitle: 'Un pequeño frasco aromático quedó unido a su leyenda.', media: [img('vbb_new_isabel_poland')], accent: GOLD},
  {id: 'fm03', start: 6.16, end: 9.14, kind: 'image', kicker: 'EUROPA MEDIEVAL', title: 'Agua de Hungría', media: [img('vbb_new_hungary_water')], accent: GOLD},
  {id: 'fm04', start: 9.34, end: 12.9, kind: 'image', kicker: 'SIGLOS DESPUÉS', title: 'La historia creció', media: [img('vbb_new_medieval_manuscript')], accent: GOLD},
  {id: 'fm05', start: 12.98, end: 19.72, kind: 'triptych', kicker: 'LA LEYENDA DECÍA…', title: 'Romero, más de 70 años y una propuesta real', items: ['ROMERO', 'MÁS DE 70', 'UN REY QUISO CASARSE'], media: [img('vbb_rosemary_macro'), img('vbb_new_isabel_poland'), img('vbb_new_mother_son_royal')], accent: GOLD},
  {id: 'fm07', start: 23.48, end: 26.46, kind: 'image', kicker: 'EL DETALLE OMITIDO', title: 'Era su propio hijo', media: [img('vbb_new_mother_son_royal')], accent: RED},
  {id: 'fm08', start: 26.66, end: 29.78, kind: 'compare', kicker: 'LEYENDA ≠ EVIDENCIA', title: 'No es historia comprobada', labels: ['RELATO ROMÁNTICO', 'DOCUMENTO HISTÓRICO'], media: [img('vbb_new_isabel_poland'), img('vbb_new_medieval_manuscript')], accent: RED},
  {id: 'fm0910', start: 29.78, end: 36.56, kind: 'compare', kicker: 'LA CORRECCIÓN HISTÓRICA', title: 'Destilado ≠ pomada verde', labels: ['PERFUME / DESTILADO', 'POMADA DE INTERNET'], media: [img('vbb_new_hungary_water'), img('vbb_new_distillate_not_balm')], accent: GOLD},
  {id: 'fm12', start: 41.72, end: 47.2, kind: 'checklist', kicker: 'NO HACE TODO A LA VEZ', title: 'Cuatro promesas que vamos a revisar', items: ['No borra venitas', 'No desinfla ojeras', 'No tensa la piel', 'No cura articulaciones'], accent: RED},
  {id: 'fm14', start: 50.22, end: 52.66, kind: 'image', kicker: 'LO QUE SÍ PUEDE SER', title: 'Un bálsamo corporal', media: [img('vbb_new_jars_cooling')], accent: TEAL},
  {id: 'fm15', start: 52.66, end: 56.6, kind: 'triptych', kicker: 'TRES USOS REALISTAS', title: 'Una tarea concreta, no cinco curaciones', items: ['PIEL SECA', 'PIERNAS CANSADAS', 'MOLESTIA MUSCULAR LEVE'], media: [img('vbb_mature_hands_history'), img('vbb_new_spider_veins'), img('vbb_new_joint_relief')], accent: TEAL},
  {id: 'roadmap', start: 70, end: 89.5, kind: 'checklist', kicker: 'HOY VAS A APRENDER', title: 'Prepararla sin convertir tu piel en un laboratorio', items: ['Medidas y temperatura exactas', 'Textura y prueba de parche', 'Tres formas de usarla', 'Cinco promesas bajo la lupa', 'Plan prudente de 14 días'], media: [img('vbb_new_recipe_ingredients')], accent: GOLD},
  {id: 'longevity', start: 116.16, end: 151, kind: 'montage', kicker: 'NO HAY UNA SOLA HOJITA MÁGICA', title: 'La piel acumula décadas', labels: ['GENÉTICA Y DÉCADAS', 'EXPOSICIÓN SOLAR', 'TABACO', 'MOVIMIENTO', 'DESCANSO', 'CUIDADOS ACUMULADOS'], media: [stock('vbb_dyn_outdoor_years'), stock('vbb_dyn_sun_face'), stock('vbb_dyn_smoking'), stock('vbb_dyn_night_routine'), stock('vbb_dyn_sleep'), stock('vbb_dyn_morning_routine')], accent: GOLD},
  {id: 'extracts', start: 173.2, end: 204, kind: 'mechanism', kicker: 'NO SON CUATRO VERSIONES IGUALES', title: 'Agua, alcohol, grasa y fórmula controlada', subtitle: 'Cambian la concentración, la estabilidad y el contacto con la piel.', items: ['Extracto acuoso', 'Destilado alcohólico', 'Aceite macerado', 'Aceite esencial', 'Crema formulada'], media: [img('vbb_new_distillate_not_balm')], accent: BLUE},
  {id: 'barrier', start: 219, end: 242, kind: 'mechanism', kicker: 'LA PIEL NO ES UNA ESPONJA', title: 'La barrera limita el paso', subtitle: 'Algunas moléculas quedan en superficie; otras pueden irritar antes de ayudar.', items: ['SUPERFICIE', 'BARRERA CUTÁNEA', 'PASO LIMITADO', 'IRRITACIÓN POSIBLE'], media: [img('vbb_new_skin_barrier')], accent: BLUE},
  {id: 'why_oil', start: 247.9, end: 273, kind: 'checklist', kicker: 'UNA TAREA RAZONABLE', title: '¿Por qué una base aceitosa?', items: ['Reduce pérdida de agua en piel seca', 'Permite masaje con menos fricción', 'Aporta aroma y tradición corporal', 'Solo para molestias leves', 'No regenera cartílago ni abre venas'], media: [img('vbb_new_skin_barrier')], accent: TEAL},
  {id: 'recipe_chapter', start: 278.38, end: 287.64, kind: 'chapter', kicker: 'RECETA BASE', title: 'Poca cantidad, medidas exactas', subtitle: 'Sin guardar meses un cosmético casero.', step: 1, accent: GOLD},
  {id: 'oil_ingredient', start: 287.64, end: 317.74, kind: 'checklist', kicker: 'INGREDIENTE 1', title: '120 ml de aceite', subtitle: 'Oliva o girasol alto oleico para el cuerpo; una base ligera solo si ya la toleras.', items: ['MEDIA TAZA · 120 ML', 'Aceite fresco, sin olor rancio', 'No usar una base deteriorada', 'La base es casi toda la fórmula'], media: [img('vbb_new_oil_measure')], accent: GOLD},
  {id: 'rosemary_ingredient', start: 317.74, end: 347.04, kind: 'checklist', kicker: 'INGREDIENTE 2', title: 'Dos cucharadas rasas de romero seco', subtitle: 'Seco, culinario y revisado bajo buena luz.', items: ['NO recién cortado y húmedo', 'Sin polvo extraño ni moho', 'No hace falta pulverizar', 'Menos residuos rozando la piel'], media: [img('vbb_new_dry_rosemary')], accent: TEAL},
  {id: 'beeswax_ingredient', start: 347.04, end: 377.98, kind: 'checklist', kicker: 'INGREDIENTE 3 · OPCIONAL', title: '10 gramos de cera de abejas', subtitle: 'La balanza es más confiable que una cucharada.', items: ['10 G = BÁLSAMO BLANDO', '12 G solo en un próximo lote cálido', 'Esperar a que enfríe por completo', 'No corregir a ciegas'], media: [img('vbb_new_beeswax_scale')], accent: GOLD},
  {id: 'wash_tools', start: 377.98, end: 391.5, kind: 'montage', kicker: 'ANTES DE EMPEZAR', title: 'Lavar, enjuagar y secar', labels: ['UTENSILIOS LIMPIOS', 'FRASCOS COMPLETAMENTE SECOS'], media: [stock('vbb3_washing_tools'), stock('vbb_dyn_clean_jar')], accent: TEAL},
  {id: 'tools', start: 391.5, end: 411.7, kind: 'checklist', kicker: 'EQUIPO NECESARIO', title: 'Todo limpio. Todo seco.', items: ['Recipiente resistente al calor', 'Olla para baño María', 'Cuchara y colador fino', 'Tela limpia y seca', 'Frascos pequeños con tapa', 'Ni una gota escondida'], media: [img('vbb_new_tools_overhead')], accent: TEAL},
  {id: 'step1', start: 411.7, end: 423.9, kind: 'step', kicker: 'BAÑO MARÍA', title: 'Calor indirecto', subtitle: 'El agua rodea el recipiente; nunca entra en el aceite.', items: ['3 CM DE AGUA', '120 ML DE ACEITE', 'SIN CONTACTO CON AGUA'], media: [stock('vbb3_double_boiler')], step: 1, total: 8, accent: GOLD},
  {id: 'step2', start: 423.9, end: 446.46, kind: 'step', kicker: 'TEMPERATURA', title: 'Tibio, no fritura', subtitle: 'Vapor suave y burbujas pequeñas en el agua; el aceite jamás humea.', items: ['45–60 °C', 'FUEGO MÍNIMO', 'ACEITE SIN HUMO'], media: [img('vbb_new_thermometer_oil')], step: 2, total: 8, accent: GOLD},
  {id: 'step3', start: 446.46, end: 465.34, kind: 'montage', kicker: 'PASO 03 / 08', title: 'Romero cubierto y calor bajo', labels: ['2 CUCHARADAS RASAS', '30 MINUTOS · MOVER CADA 10'], media: [img('vbb_new_add_rosemary'), img('vbb_new_low_heat_stir')], accent: TEAL},
  {id: 'step4', start: 465.34, end: 482.58, kind: 'step', kicker: 'REPOSO', title: 'Apagar y esperar', subtitle: 'El color puede cambiar, pero no mide la potencia.', items: ['15 MINUTOS', 'AMARILLO VERDOSO ≠ MÁS FUERTE'], media: [img('vbb_new_rest_15')], step: 4, total: 8, accent: GOLD},
  {id: 'step5', start: 482.58, end: 499.54, kind: 'step', kicker: 'FILTRADO', title: 'Colar lentamente', subtitle: 'Sin exprimir la tela con las manos; repetir si quedan partículas.', items: ['ACEITE TIBIO', 'SIN EXPRIMIR', 'SEGUNDA PASADA SI HACE FALTA'], media: [img('vbb_new_strain_oil')], step: 5, total: 8, accent: TEAL},
  {id: 'oil_done', start: 499.54, end: 512.36, kind: 'image', kicker: 'DOS CAMINOS', title: 'Aceite corporal o pomada', subtitle: 'Si prefieres textura líquida, aquí puedes detenerte.', media: [img('vbb_new_dark_bottle')], accent: TEAL},
  {id: 'step6', start: 512.36, end: 527.42, kind: 'step', kicker: 'CONVERTIR EN POMADA', title: 'Derretir la cera', subtitle: 'En cuanto se vea uniforme, retirar del calor.', items: ['10 G DE CERA', 'FUEGO MÍNIMO', 'NO COCINAR OTROS 30 MIN'], media: [img('vbb_new_melt_beeswax')], step: 6, total: 8, accent: GOLD},
  {id: 'step7', start: 527.42, end: 545.98, kind: 'step', kicker: 'PRUEBA DE TEXTURA', title: 'Una cucharadita en plato frío', subtitle: 'Ajustes pequeños, de a uno.', items: ['ESPERAR 2 MIN', 'MUY DURA → POCO ACEITE', 'MUY LÍQUIDA → 1–2 G CERA'], media: [img('vbb_new_cold_plate_test')], step: 7, total: 8, accent: GOLD},
  {id: 'step8', start: 545.98, end: 558.8, kind: 'step', kicker: 'ENVASADO', title: 'Frascos pequeños y abiertos', subtitle: 'Cerrar solo cuando estén completamente fríos.', items: ['LUGAR LIMPIO', 'LEJOS DE NIÑOS Y MASCOTAS', 'ESCRIBIR LA FECHA'], media: [img('vbb_new_jars_cooling')], step: 8, total: 8, accent: TEAL},
  {id: 'no_water', start: 558.8, end: 570.08, kind: 'alert', kicker: 'NO LO MEZCLES', title: 'Agua + aceite sin conservante = producto inestable', items: ['Sin té de romero', 'Sin aloe fresco', 'Sin jugo de limón', 'Sin agua dentro del frasco'], accent: RED},
  {id: 'storage', start: 570.08, end: 595.1, kind: 'montage', kicker: 'CONSERVACIÓN PRUDENTE', title: 'Un lote pequeño y vigilado', labels: ['FECHAR EL FRASCO', 'MANOS Y ESPÁTULA SECAS', 'SI CAMBIA: DESCARTAR'], media: [img('vbb_new_date_label'), stock('vbb_dyn_simple_products'), img('vbb_new_discard_contaminated')], accent: TEAL},
  {id: 'patch_video', start: 595.1, end: 603.4, kind: 'image', kicker: 'ANTES DEL PRIMER USO', title: 'Prueba en el antebrazo', media: [stock('vbb2dyn_patch')], accent: GOLD},
  {id: 'patch_rules', start: 603.4, end: 629.38, kind: 'checklist', kicker: 'PRUEBA DE PARCHE', title: 'Una zona pequeña durante 48 horas', items: ['Medio grano de arroz', 'Área de 2 centímetros', 'Sin cubrir con plástico', 'Ardor, picazón o ronchas → lavar y suspender', 'La alergia puede aparecer al repetir'], media: [img('vbb_patch_test')], accent: GOLD},
  {id: 'essential_compare', start: 629.38, end: 642.5, kind: 'compare', kicker: 'NATURAL NO SIGNIFICA SUAVE', title: 'Macerado ≠ aceite esencial', labels: ['HOJAS SECAS MACERADAS', 'ACEITE ESENCIAL CONCENTRADO'], media: [img('vbb_new_dark_bottle'), img('vbb_infusion_vs_oil')], accent: RED},
  {id: 'essential_warn', start: 642.5, end: 651.5, kind: 'image', kicker: 'NO LO HAGAS “MÁS FUERTE”', title: 'Nunca puro sobre la piel', media: [stock('vbb_dyn_dropper')], accent: RED},
  {id: 'promise1', start: 659.5, end: 681, kind: 'promise', kicker: 'PROMESA 01 / 05', title: '“Borra venitas y barre sangre estancada”', subtitle: 'NO. Una pomada no reconstruye válvulas ni elimina una vena visible.', items: ['Masaje suave: sensación agradable', 'Mover tobillos', 'Caminar', 'Elevar las piernas'], media: [img('vbb_new_spider_veins')], accent: RED},
  {id: 'carmen', start: 696.74, end: 726.2, kind: 'montage', kicker: 'EL CASO DE CARMEN', title: 'Alivio de cansancio ≠ vena borrada', labels: ['SEIS HORAS DE PIE', 'MASAJE MUY SUAVE · 3 MIN', 'MISMA LUZ PARA COMPARAR'], media: [stock('vbb3_older_standing_legs', 1.2), stock('vbb3_leg_massage', 1.4), stock('vbb_dyn_phone_photo')], accent: TEAL},
  {id: 'leg_alert', start: 726.2, end: 750.1, kind: 'alert', kicker: 'NO MASAJEAR', title: 'Una sola pierna cambia de repente', subtitle: 'La promesa de circulación nunca debe retrasar una evaluación.', items: ['Hinchazón unilateral', 'Calor y enrojecimiento', 'Dolor intenso', 'Falta de aire o dolor de pecho → urgencia', 'Úlcera, piel abierta o secreción'], accent: RED},
  {id: 'promise2', start: 750.1, end: 779.46, kind: 'promise', kicker: 'PROMESA 02 / 05', title: '“Estimula colágeno como toxina botulínica”', subtitle: 'NO. Un aceite vegetal no bloquea la comunicación entre nervio y músculo.', items: ['Antioxidante en laboratorio ≠ efecto clínico', 'No plancha una arruga profunda', 'Hidratación sí puede suavizar líneas finas'], media: [img('vbb_wrinkle_macro')], accent: RED},
  {id: 'occlusion', start: 779.46, end: 801.56, kind: 'mechanism', kicker: 'LO QUE SÍ PUEDE PASAR', title: 'Menos pérdida de agua', subtitle: 'La luz cambia y la piel se siente más flexible durante unas horas.', items: ['PELÍCULA ACEITOSA', 'MENOS EVAPORACIÓN', 'MÁS FLEXIBILIDAD', 'NO REJUVENECIMIENTO DE 20 AÑOS'], media: [img('vbb_new_skin_barrier')], accent: TEAL},
  {id: 'dry_skin_use', start: 801.56, end: 823.5, kind: 'montage', kicker: 'PARA PIEL SECA', title: 'Poca cantidad sobre piel apenas húmeda', labels: ['AGUA TIBIA', 'PELÍCULA FINA', 'UNA CAPA GRUESA NO HACE 10 VECES MÁS'], media: [stock('vbb_dyn_water'), stock('vbb_dyn_moisturizer'), stock('vbb_dyn_calm_skin')], accent: TEAL},
  {id: 'spots', start: 834.78, end: 847.5, kind: 'montage', kicker: 'LAS MANCHAS', title: 'Irritar puede oscurecer', labels: ['NO SE ACLARAN CON ACEITE', 'PROTECCIÓN SOLAR DIARIA'], media: [stock('vbb_dyn_age_spots'), stock('vbb_dyn_sunscreen')], accent: RED},
  {id: 'lesion_alert', start: 847.5, end: 865.82, kind: 'alert', kicker: 'UNA MANCHA QUE CAMBIA', title: 'No se trata con pomada', items: ['Forma o color nuevos', 'Aumento de tamaño', 'Sangrado', 'No cicatriza', 'Revisión profesional'], media: [img('vbb_dermatologist_consult')], accent: RED},
  {id: 'under_eye_alert', start: 875, end: 888.94, kind: 'alert', kicker: 'PROMESA 03 / 05', title: 'No coloques romero bajo los ojos', subtitle: 'El producto puede migrar y causar irritación junto al ojo.', items: ['Párpado muy fino', 'Riesgo de hinchazón', 'Ardor periocular', 'Suspender de inmediato'], accent: RED},
  {id: 'dark_circle_causes', start: 888.94, end: 905.18, kind: 'mechanism', kicker: 'OJERAS ≠ UNA SOLA CAUSA', title: 'Una receta única no puede borrarlas todas', items: ['Pigmento', 'Vasos visibles', 'Anatomía del surco', 'Alergia y frotamiento', 'Retención de líquido', 'Falta de sueño'], accent: BLUE},
  {id: 'cold_compress', start: 905.18, end: 925.5, kind: 'step', kicker: 'ALTERNATIVA CASERA SEGURA', title: 'Dos gasas con agua fría', subtitle: 'Ojos cerrados, cinco minutos y sin frotar.', items: ['AGUA FRÍA', '5 MINUTOS', 'SIN HIELO DIRECTO', 'SIN LIMÓN NI ACEITES'], media: [img('vbb_new_under_eye_safe')], step: 1, total: 1, accent: TEAL},
  {id: 'eye_alert', start: 925.5, end: 940.8, kind: 'alert', kicker: 'CONSULTAR', title: 'Cuando una bolsa no es solo cansancio', items: ['Persiste', 'Aparece de un solo lado', 'Duele o afecta la visión', 'Falta de aire o hinchazón general'], accent: RED},
  {id: 'promise4', start: 940.8, end: 967.86, kind: 'promise', kicker: 'PROMESA 04 / 05', title: '“Bloquea dolor y desinflama cartílago”', subtitle: 'Puede aliviar una molestia leve; no llega al hueso ni repara cartílago.', items: ['Calor y aroma', 'Masaje', 'Descanso', 'Alivio temporal'], media: [img('vbb_new_joint_relief')], accent: RED},
  {id: 'shoulder_use', start: 967.86, end: 981.2, kind: 'image', kicker: 'MOLESTIA LEVE', title: 'Capa fina · 3 a 5 minutos', subtitle: 'Una vez al día al principio.', media: [stock('vbb3_shoulder_massage', 1.1)], accent: TEAL},
  {id: 'no_heat', start: 981.2, end: 989.82, kind: 'alert', kicker: 'NO AUMENTES EL CALOR', title: 'Sin plástico, venda apretada ni almohadilla caliente', accent: RED},
  {id: 'joint_alert', start: 989.82, end: 1015.18, kind: 'alert', kicker: 'NO LO TRATES COMO CONTRACTURA', title: 'Una articulación puede necesitar diagnóstico', items: ['Muy roja o caliente', 'Hinchada o deformada', 'Después de una caída', 'Dolor nocturno persistente', 'Fiebre, debilidad o pérdida de sensibilidad'], accent: RED},
  {id: 'jose', start: 1015.18, end: 1026, kind: 'image', kicker: 'EL CASO DE JOSÉ', title: 'Hombro tenso después del jardín', subtitle: 'Bálsamo, masaje suave y descanso pueden acompañar.', media: [img('vbb_new_joint_relief')], accent: TEAL},
  {id: 'chest_alert', start: 1026, end: 1039.94, kind: 'alert', kicker: 'EL CONTEXTO CAMBIA TODO', title: 'Dolor al brazo + presión en pecho = pedir ayuda', items: ['Sudor frío', 'Falta de aire', 'No buscar primero el frasco'], accent: RED},
  {id: 'promise5', start: 1039.94, end: 1068.9, kind: 'promise', kicker: 'PROMESA 05 / 05', title: '“Mata hongos, cierra grietas y cura heridas”', subtitle: 'NO. Actividad experimental no convierte una pomada artesanal en antifúngico estéril.', items: ['Uña engrosada: varias causas', 'Grieta profunda: puede infectarse', 'Pie diabético: no esperar'], media: [img('vbb_new_closed_heel')], accent: RED},
  {id: 'wound_alert', start: 1068.9, end: 1099.72, kind: 'alert', kicker: 'SOLO PIEL INTACTA', title: 'Nunca sobre una herida o infección', items: ['No en quemadura o ampolla rota', 'No en úlcera, pus o secreción', 'No entre dedos húmedos del pie', 'Talón seco y cerrado: capa fina', 'Diabetes o enrojecimiento que avanza → consultar'], media: [img('vbb_new_closed_heel')], accent: RED},
  {id: 'three_uses_chapter', start: 1123.86, end: 1127.28, kind: 'chapter', kicker: 'UNA MISMA PREPARACIÓN', title: 'Tres usos concretos', subtitle: 'Sin prometer cinco curaciones.', step: 3, accent: GOLD},
  {id: 'hands_use', start: 1127.28, end: 1157.26, kind: 'montage', kicker: 'MANERA 01 / 03', title: 'Manos y codos secos', labels: ['LAVAR CON AGUA TIBIA', 'SECAR SIN FROTAR', 'PELÍCULA FINA', 'ALGODÓN HOLGADO SOLO SI YA TOLERÓ'], media: [stock('vbb2dyn_face_wash'), stock('vbb_dyn_hands_history'), stock('vbb_stock_moisturize'), img('vbb_mature_hands_history')], accent: TEAL},
  {id: 'massage_use', start: 1157.26, end: 1185.54, kind: 'montage', kicker: 'MANERA 02 / 03', title: 'Masaje corporal', labels: ['MEDIA A UNA CUCHARADITA', '10 MOVIMIENTOS DE TOBILLO', 'CAMINATA BREVE', 'PIERNAS ELEVADAS'], media: [stock('vbb2dyn_age_spots'), stock('vbb3_ankle_exercise'), stock('vbb3_walking_senior'), stock('vbb3_legs_elevated')], accent: TEAL},
  {id: 'legs_use', start: 1185.54, end: 1208.44, kind: 'montage', kicker: 'MANERA 03 / 03', title: 'Piel seca de las piernas', labels: ['DESPUÉS DE LA DUCHA', 'CAPA FINA SOBRE PIEL HÚMEDA', 'NO ANTES DEL SOL'], media: [stock('vbb2dyn_water'), stock('vbb_stock_sunscreen'), stock('vbb2dyn_sun_face')], accent: GOLD},
  {id: 'face_caution', start: 1217, end: 1240.86, kind: 'checklist', kicker: 'SI AUN ASÍ QUIERES PROBAR EN EL ROSTRO', title: 'Un punto junto a la mandíbula', items: ['Nunca párpado ni contorno de ojos', 'Cantidad casi invisible', 'Una sola noche', 'Observar durante dos días', 'Sin retinoides, ácidos, exfoliantes ni perfumes'], media: [img('vbb_patch_test')], accent: RED},
  {id: 'plan_title', start: 1240.86, end: 1242.88, kind: 'chapter', kicker: 'SEGUIMIENTO REALISTA', title: 'Plan de 14 días', subtitle: 'Una variable a la vez.', step: 14, accent: GOLD},
  {id: 'day0', start: 1242.88, end: 1252.36, kind: 'calendar', kicker: 'DÍA 0', title: 'Prueba de parche', subtitle: 'Comer romero no predice cómo reaccionará tu piel.', accent: GOLD},
  {id: 'days13', start: 1252.36, end: 1268.96, kind: 'checklist', kicker: 'DÍAS 1 · 2 · 3', title: 'Una sola zona pequeña', items: ['Un codo o dorso de una mano', 'Una aplicación diaria', 'No cambiar jabón, perfume y crema juntos'], accent: TEAL},
  {id: 'days47', start: 1268.96, end: 1285.2, kind: 'checklist', kicker: 'DÍAS 4 A 7', title: 'Medir comodidad, no juventud', items: ['Tirantez', 'Picazón', 'Comodidad', 'Escala de 0 a 10'], media: [stock('vbb3_calendar_journal', 1.1)], accent: TEAL},
  {id: 'day7photo', start: 1285.2, end: 1302.68, kind: 'compare', kicker: 'DÍA 7 · FOTO COMPARABLE', title: 'Misma luz, distancia y postura', labels: ['SIN FILTRO NI ACEITE', 'MISMA CONDICIÓN'], media: [stock('vbb_stock_phone'), img('vbb_new_same_light_photos')], accent: GOLD},
  {id: 'week2', start: 1302.68, end: 1322.8, kind: 'checklist', kicker: 'SEGUNDA SEMANA', title: 'Mantener la misma cantidad', items: ['No duplicar porque “ya me acostumbré”', 'Registrar cuánto dura el alivio', 'No ocultar un dolor que empeora'], media: [img('vbb_new_symptom_journal')], accent: TEAL},
  {id: 'day14', start: 1322.8, end: 1347.44, kind: 'checklist', kicker: 'DÍA 14', title: 'Tres preguntas honestas', items: ['¿La piel está más cómoda?', '¿Apareció irritación?', '¿El ritual ayuda sin reemplazar algo importante?', 'Si no aporta: no concentrar ni duplicar'], accent: GOLD},
  {id: 'errors_title', start: 1347.44, end: 1352.16, kind: 'chapter', kicker: 'LA PARTE QUE SALVA EL RESULTADO', title: 'Siete errores', subtitle: 'Y cómo evitarlos.', step: 7, accent: RED},
  {id: 'error1', start: 1352.16, end: 1360.26, kind: 'error', kicker: 'ERROR 01 / 07', title: 'Romero fresco mojado + meses guardado', subtitle: 'Humedad y tiempo vuelven la conservación impredecible.', media: [img('vbb2_wash_sprig')], step: 1, accent: RED},
  {id: 'error2', start: 1360.26, end: 1367.72, kind: 'error', kicker: 'ERROR 02 / 07', title: 'Freír las hojas', subtitle: 'El humo degrada el aceite; no concentra beneficios.', media: [stock('vbb_dyn_kettle')], step: 2, accent: RED},
  {id: 'error3', start: 1367.72, end: 1377.08, kind: 'error', kicker: 'ERROR 03 / 07', title: 'Agregar esencia “a ojo”', subtitle: 'Más concentrado puede ser más irritante.', media: [stock('vbb_dyn_cosmetic_shelf')], step: 3, accent: RED},
  {id: 'error4', start: 1377.08, end: 1387.22, kind: 'montage', kicker: 'ERROR 04 / 07', title: 'La mezcla que puede quemar', labels: ['LIMÓN', 'BICARBONATO', 'MEZCLA IMPROVISADA'], media: [stock('vbb_dyn_lemon'), stock('vbb_dyn_baking_soda'), stock('vbb_dyn_kitchen_mix')], accent: RED},
  {id: 'error5', start: 1387.22, end: 1392.3, kind: 'error', kicker: 'ERROR 05 / 07', title: 'Cerca de ojos o mucosas', media: [stock('vbb_dyn_cotton_rub')], step: 5, accent: RED},
  {id: 'error6', start: 1392.3, end: 1399.02, kind: 'error', kicker: 'ERROR 06 / 07', title: 'Sobre herida, hongo o infección', subtitle: 'No sustituye un tratamiento.', media: [stock('vbb2dyn_derm_consult')], step: 6, accent: RED},
  {id: 'error7', start: 1399.02, end: 1409.48, kind: 'error', kicker: 'ERROR 07 / 07', title: 'Creer que arder significa funcionar', subtitle: 'La piel no aplaude: pide que la retires.', media: [stock('vbb_dyn_red_skin')], step: 7, accent: RED},
  {id: 'reaction', start: 1409.48, end: 1430.12, kind: 'alert', kicker: 'SI OCURRE UNA REACCIÓN', title: 'Retirar, lavar y no neutralizar', items: ['Agua + limpiador ya tolerado', 'No agregar otra mezcla casera', 'Ampollas o hinchazón importante → ayuda', 'En el ojo: abundante agua limpia'], media: [stock('vbb_dyn_face_rinse')], accent: RED},
  {id: 'recipe_recap', start: 1451.76, end: 1470.7, kind: 'mechanism', kicker: 'LA RECETA COMPLETA', title: 'No son solo dos ingredientes', items: ['ROMERO SECO', 'CALOR SUAVE', 'UTENSILIOS SIN AGUA', 'LOTE PEQUEÑO', 'PRUEBA DE PARCHE', 'EXPECTATIVAS HONESTAS'], media: [img('vbb_new_recipe_ingredients')], accent: GOLD},
];

const usedVideos = SCENES.flatMap((scene) => scene.media ?? []).filter((media) => media.type === 'video').map((media) => media.src);
if (new Set(usedVideos).size !== usedVideos.length) {
  const duplicate = usedVideos.find((value, index) => usedVideos.indexOf(value) !== index);
  throw new Error(`Clip repetido en el plan: ${duplicate}`);
}

export const MainVbb0rdkrfduo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <AvatarBase />
      <Audio
        src={staticFile('sfx/music_federer.mp3')}
        loop
        volume={(frame) => interpolate(frame, [0, fps * 2, TOTAL_FRAMES_VBB0RDKRFDUO - fps * 3, TOTAL_FRAMES_VBB0RDKRFDUO], [0, 0.022, 0.022, 0], clamp)}
      />
      {SCENES.map((scene) => {
        const from = secondsToFrames(scene.start);
        const duration = Math.max(1, secondsToFrames(scene.end) - from);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration} premountFor={fps}>
            {renderScene(scene, duration)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
