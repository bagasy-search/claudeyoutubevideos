import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Avatar} from '../components/Avatar';
import {GridBG} from '../components/GridBG';
import {Particles} from '../components/Particles';
import {WhipStreaks} from '../components/WhipStreaks';
import {lin, back, tc} from '../lib/anim';
import {DISPLAY, UI} from '../fonts';
import {COLORS, CUT} from '../config';
import {useBrand} from '../lib/Brand';

export const Scene2AvatarIntro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {avatarName, accent} = useBrand();

  // entrada del avatar: beat 7 global (frame 105)
  const sIn = spring({frame: Math.max(0, f - 15), fps, config: {damping: 11, stiffness: 130}});
  const lt = back(f, 30, 48); // lower third
  const bub = spring({frame: Math.max(0, f - 60), fps, config: {damping: 10, stiffness: 160}});
  const bubOut = lin(f, 104, 112, 1, 0);
  const out = lin(f, 170, 180, 0, 1); // zoom punch hacia S3

  const speaking = f >= 34 && f <= 100;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #0b0f1c 0%, #050507 60%)',
        overflow: 'hidden',
        transform: `scale(${1 + out * 0.25})`,
        filter: out > 0 ? `blur(${out * 6}px)` : 'none',
      }}
    >
      <GridBG />
      <Particles count={26} seed="s2" color="rgba(46,230,255,0.5)" />
      <AbsoluteFill style={{background: `radial-gradient(circle at 78% 20%, ${accent}14, transparent 45%)`}} />

      {/* HUD viewfinder */}
      <HUD f={f} globalFrame={CUT.C1 + f} accent={accent} />

      {/* polvo al aterrizar */}
      <Particles mode="burst" count={18} seed="dust" color="#7f8598" start={17} life={40} gravity={0.35} origin={{x: 960, y: 700}} />

      {/* AVATAR */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{transform: `scale(${sIn}) rotate(${(1 - sIn) * -25}deg)`, opacity: sIn}}>
          <Avatar size={430} speaking={speaking} mood={f > 60 ? 'excited' : 'idle'} src="avatar/idle.png" />
        </div>
      </AbsoluteFill>

      {/* speech bubble */}
      {f >= 58 && f < 112 && (
        <div
          style={{
            position: 'absolute', left: '57%', top: '20%',
            transform: `scale(${bub * bubOut})`, transformOrigin: 'bottom left',
            background: '#fff', color: '#0b0e14', padding: '16px 26px',
            borderRadius: 22, borderBottomLeftRadius: 4,
            fontFamily: DISPLAY, fontSize: 34, boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
          }}
        >
          VAMOS ALLÁ →
        </div>
      )}

      {/* lower third */}
      <div
        style={{
          position: 'absolute', left: 90, bottom: 120,
          transform: `translateX(${(1 - lt) * -420}px) skewX(${(1 - lt) * -12}deg)`,
          opacity: lt,
        }}
      >
        <div style={{width: 90, height: 7, background: accent, marginBottom: 14}} />
        <div style={{fontFamily: DISPLAY, fontSize: 74, color: COLORS.ink, lineHeight: 1}}>{avatarName}</div>
        <div style={{fontFamily: UI, fontSize: 24, letterSpacing: '0.3em', color: COLORS.dim, marginTop: 10}}>
          EDITOR · DIRECTOR · BOT
        </div>
      </div>

      <WhipStreaks dur={8} />
    </AbsoluteFill>
  );
};

const HUD: React.FC<{f: number; globalFrame: number; accent: string}> = ({f, globalFrame, accent}) => (
  <>
    <div style={{position: 'absolute', top: 46, left: 60, fontFamily: UI, fontSize: 24, color: '#fff', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.9}}>
      <div style={{width: 16, height: 16, borderRadius: 8, background: '#ff2d55', opacity: Math.floor(f / 15) % 2 === 0 ? 1 : 0.25}} />
      REC <span style={{color: '#8a8a99'}}>· A-CAM</span>
    </div>
    <div style={{position: 'absolute', top: 46, right: 60, fontFamily: UI, fontSize: 24, color: '#fff', opacity: 0.85, fontVariantNumeric: 'tabular-nums'}}>
      TC {tc(globalFrame)}
    </div>
    <div style={{position: 'absolute', bottom: 46, right: 60, fontFamily: UI, fontSize: 20, letterSpacing: '0.2em', color: '#8a8a99'}}>
      4K · 30FPS · <span style={{color: accent}}>RAW</span>
    </div>
    {[
      {top: 110, left: 110, bt: true, bl: true},
      {top: 110, right: 110, bt: true, br: true},
      {bottom: 110, left: 110, bb: true, bl: true},
      {bottom: 110, right: 110, bb: true, br: true},
    ].map((c, i) => (
      <div
        key={i}
        style={{
          position: 'absolute', width: 44, height: 44, opacity: 0.5,
          top: c.top, left: c.left, right: c.right, bottom: c.bottom,
          borderTop: c.bt ? '3px solid #fff' : 'none',
          borderBottom: c.bb ? '3px solid #fff' : 'none',
          borderLeft: c.bl ? '3px solid #fff' : 'none',
          borderRight: c.br ? '3px solid #fff' : 'none',
        }}
      />
    ))}
  </>
);
