import React, {useId} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {CountUp} from '../components/CountUp';
import {lin, eo} from '../lib/anim';
import {DISPLAY, UI} from '../fonts';
import {COLORS, S} from '../config';
import {useBrand} from '../lib/Brand';

const PTS = [0.25, 0.45, 0.38, 0.6, 0.55, 0.78, 0.7, 0.92];

export const Scene4Stats: React.FC = () => {
  const f = useCurrentFrame();
  const {accent} = useBrand();
  const d = S.S4;
  const out = lin(f, d - 6, d, 0, 1);
  const title = eo(f, 2, 16);

  return (
    <AbsoluteFill
      style={{
        background: '#08080d', overflow: 'hidden', padding: '70px 90px 110px',
        transform: `translateX(${out * -160}px)`,
        filter: out > 0 ? `blur(${out * 9}px)` : 'none',
        opacity: 1 - out,
      }}
    >
      <AbsoluteFill style={{background: `radial-gradient(circle at 85% 110%, ${accent}0f, transparent 50%)`}} />

      {/* título */}
      <div style={{opacity: title, transform: `translateY(${(1 - title) * 40}px)`, marginBottom: 34}}>
        <div style={{fontFamily: UI, fontSize: 22, letterSpacing: '0.4em', color: accent}}>TEMPORADA 01</div>
        <div style={{fontFamily: DISPLAY, fontSize: 72, color: COLORS.ink, marginTop: 8}}>UN AÑO EN NÚMEROS</div>
      </div>

      {/* bento grid */}
      <div style={{display: 'grid', gridTemplateColumns: '1.15fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 18, height: 620}}>
        <Card i={0} label="VIDEOS">
          <Big><CountUp to={120} from={18} />+</Big>
        </Card>
        <Card i={1} label="VISTAS">
          <Big><CountUp to={1.2} from={26} format={(v) => v.toFixed(1) + 'M'} /></Big>
        </Card>
        <Card i={2} label="HORAS EDITADAS">
          <Big><CountUp to={4800} from={34} /></Big>
        </Card>
        <Card i={3} label="CAFÉS (APROX)">
          <Big style={{color: accent}}>∞</Big>
        </Card>
        <Card i={4} label="RETENCIÓN POR VIDEO" span={2}>
          <Sparkline start={60} />
        </Card>
        <Card i={5} label="RETENCIÓN MEDIA">
          <Big><CountUp to={91} from={70} />%</Big>
        </Card>
        <Card i={6} label="SIGUIENTE META">
          <div style={{fontFamily: DISPLAY, fontSize: 40, color: COLORS.ink}}>1M SUBS</div>
          <div style={{marginTop: 14, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${eo(f, 80, 120) * 62}%`, background: `linear-gradient(90deg, ${accent}, #2ee6ff)`, borderRadius: 5}} />
          </div>
          <div style={{fontFamily: UI, fontSize: 18, color: COLORS.dim, marginTop: 8}}>62%</div>
        </Card>
      </div>

      {/* marquee */}
      <div style={{position: 'absolute', bottom: 26, left: 0, right: 0, overflow: 'hidden', opacity: 0.16}}>
        <div style={{fontFamily: DISPLAY, fontSize: 42, whiteSpace: 'nowrap', color: '#fff', transform: `translateX(${-(f * 3) % 900}px)`}}>
          {'RENDER · EDITAR · PUBLICAR · REPETIR · '.repeat(8)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Big: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: DISPLAY, fontSize: 92, color: COLORS.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...style}}>
    {children}
  </div>
);

const Card: React.FC<{i: number; label: string; span?: number; children: React.ReactNode}> = ({i, label, span = 1, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {accent} = useBrand();
  const s = spring({frame: Math.max(0, f - (10 + i * 8)), fps, config: {damping: 14, stiffness: 120}});
  return (
    <div
      style={{
        gridColumn: `span ${span}`, opacity: s,
        transform: `translateY(${(1 - s) * 70}px) scale(${0.92 + 0.08 * s})`,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 26, padding: '26px 30px', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)`}} />
      <div style={{fontFamily: UI, fontSize: 20, letterSpacing: '0.22em', color: COLORS.dim}}>{label}</div>
      <div style={{marginTop: 16}}>{children}</div>
    </div>
  );
};

const Sparkline: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const id = useId();
  const {accent} = useBrand();
  const p = eo(f, start, start + 45);
  const path = PTS.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (PTS.length - 1)) * 200} ${58 - v * 52}`).join(' ');
  return (
    <svg viewBox="0 0 200 60" width="100%" height="150" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.35" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L 200 60 L 0 60 Z`} fill={`url(#${id})`} opacity={p} />
      <path d={path} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {PTS.map((v, i) => (
        <circle key={i} cx={(i / (PTS.length - 1)) * 200} cy={58 - v * 52} r={p > i / PTS.length ? 3.5 : 0} fill="#fff" />
      ))}
    </svg>
  );
};
