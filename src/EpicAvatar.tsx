/**
 * ============================================================
 *  EPIC AVATAR REVEAL — Remotion 4.x (React + TypeScript)
 * ============================================================
 *  Archivos necesarios en /public:
 *    - bg.jpg      → fondo épico (nebulosa, ciudad, montañas…)
 *    - avatar.png  → idealmente cuadrado
 *    - logo.png    → PNG con transparencia
 *    - poster.jpg  → imagen vertical (3:4 aprox)
 *
 *  Registrar en Root.tsx:
 *  <Composition
 *    id="EpicAvatar"
 *    component={EpicAvatar}
 *    durationInFrames={300}
 *    fps={30}
 *    width={1920}
 *    height={1080}
 *  />
 * ============================================================
 */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ------------------------------------------------------------
// UTILIDADES
// ------------------------------------------------------------
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const FONT = `'Arial Black', 'Helvetica Neue', Arial, sans-serif`;
const MONO = `'Courier New', Courier, monospace`;

// Spring seguro: 0 antes del frame de inicio
const spr = (
  frame: number,
  start: number,
  fps: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {}
) =>
  frame < start
    ? 0
    : spring({
        frame: frame - start,
        fps,
        config: { damping: 12, stiffness: 160, mass: 0.9, ...config },
      });

const pad2 = (n: number) => String(n).padStart(2, '0');

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ------------------------------------------------------------
// TIMELINE (segundos)
// ------------------------------------------------------------
const BEATS = {
  bg: 0.15,
  grid: 0.4,
  rays: 0.7,
  impact: 1.0, // 💥 avatar
  ring: 1.3,
  hud: 1.45,
  kicker: 1.55,
  title: 1.7,
  badge: 2.35,
  logo: 2.6,
  poster: 3.2,
  embers: 3.8,
  meta: 4.2,
};

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------
export interface EpicAvatarProps {
  avatarSrc?: string;
  logoSrc?: string;
  bgSrc?: string;
  posterSrc?: string;
  title?: string;
  kicker?: string;
  subtitle?: string;
  accent?: string;
  accent2?: string;
}

// ------------------------------------------------------------
// CAPA 1 — Fondo: gradiente + imagen blur (rack focus) + grade
// ------------------------------------------------------------
const Backdrop: React.FC<{
  frame: number; fps: number; dur: number; src: string; impactF: number; accent: string;
}> = ({ frame, fps, dur, src, impactF, accent }) => {
  const fade = interpolate(frame, [Math.round(BEATS.bg * fps), Math.round(1.1 * fps)], [0, 1], CLAMP);
  const kb = interpolate(frame, [0, dur], [1.08, 1.32], CLAMP); // ken burns
  const panX = interpolate(frame, [0, dur], [-24, 24], CLAMP);
  const blur = interpolate(frame, [0, impactF, impactF + 20], [30, 26, 11], CLAMP); // focus pull
  const bright = interpolate(frame, [0, impactF + 20], [0.75, 1], CLAMP);

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(120% 120% at 50% 35%, #141824 0%, #05060a 70%)' }}>
      <Img
        src={src}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          opacity: fade,
          filter: `blur(${blur}px) brightness(${bright}) saturate(1.15)`,
          transform: `scale(${kb}) translateX(${panX}px)`,
        }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(20,40,80,.35) 0%, transparent 40%, rgba(120,50,10,.28) 100%)', mixBlendMode: 'soft-light' }} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 45% at 50% 42%, ${accent}22 0%, transparent 70%)` }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------
// CAPA 2 — Piso de grilla en perspectiva + horizonte
// ------------------------------------------------------------
const GridFloor: React.FC<{ frame: number; fps: number; width: number; height: number; accent: string }> = ({
  frame, fps, width, height, accent,
}) => {
  const o = interpolate(frame, [Math.round(BEATS.grid * fps), Math.round(1.2 * fps)], [0, 0.5], CLAMP);
  const horizon = height * 0.6;
  return (
    <AbsoluteFill style={{ opacity: o, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '-60%', width: '220%', top: horizon, height: height * 0.75, perspective: 700 }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            transform: 'rotateX(64deg)', transformOrigin: 'top center',
            backgroundImage: `linear-gradient(transparent 93%, ${accent}55 100%), linear-gradient(90deg, transparent 93%, ${accent}55 100%)`,
            backgroundSize: '90px 90px',
            backgroundPosition: `0px ${frame * 2.2}px, 0px 0px`,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 100%)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: horizon - 1, height: 2,
          background: accent, opacity: 0.5 + 0.2 * Math.sin(frame * 0.08),
          boxShadow: `0 0 24px 4px ${accent}88`,
        }}
      />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------
// CAPA 3 — Rayos de luz contrarrotando (god rays)
// ------------------------------------------------------------
const LightRays: React.FC<{
  frame: number; fps: number; cx: number; cy: number; size: number; accent: string; accent2: string;
}> = ({ frame, fps, cx, cy, size, accent, accent2 }) => {
  const o = interpolate(frame, [Math.round(BEATS.rays * fps), Math.round(1.6 * fps)], [0, 1], CLAMP);
  const breathe = 0.75 + 0.25 * Math.sin(frame * 0.05);
  const base: React.CSSProperties = {
    position: 'absolute', left: cx - size / 2, top: cy - size / 2,
    width: size, height: size, borderRadius: '50%',
    WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 62%)',
    maskImage: 'radial-gradient(circle, black 0%, transparent 62%)',
    mixBlendMode: 'screen',
  };
  return (
    <>
      <div style={{ ...base, background: `repeating-conic-gradient(from 0deg, ${accent}1f 0deg 4deg, transparent 4deg 16deg)`, transform: `rotate(${frame * 0.22}deg)`, opacity: o * breathe }} />
      <div style={{ ...base, background: `repeating-conic-gradient(from 2deg, ${accent2}14 0deg 3deg, transparent 3deg 22deg)`, transform: `rotate(${-frame * 0.35}deg) scale(1.25)`, opacity: o * (1 - breathe * 0.5) }} />
    </>
  );
};

// ------------------------------------------------------------
// CAPA 4 — Polvo en suspensión: 3 planos de profundidad
// ------------------------------------------------------------
const DustField: React.FC<{ frame: number; fps: number; width: number; height: number }> = ({
  frame, fps, width, height,
}) => {
  const gate = interpolate(frame, [0, Math.round(0.9 * fps)], [0, 1], CLAMP);
  const layers = [
    { n: 18, min: 1, max: 2.5, spd: 0.12, blur: 0, op: 0.55 },
    { n: 14, min: 2.5, max: 5, spd: 0.3, blur: 1.5, op: 0.4 },
    { n: 9, min: 5, max: 9, spd: 0.6, blur: 3.5, op: 0.28 },
  ];
  return (
    <AbsoluteFill style={{ opacity: gate }}>
      {layers.flatMap((L, li) =>
        new Array(L.n).fill(0).map((_, i) => {
          const k = `d${li}-${i}`;
          const size = L.min + random(`sz${k}`) * (L.max - L.min);
          const x0 = random(`x${k}`) * width;
          const off = random(`o${k}`) * (height + 120);
          const phase = random(`p${k}`) * Math.PI * 2;
          const p = (frame * L.spd * (fps / 30) + off) % (height + 120);
          const y = height + 60 - p;
          const x = x0 + Math.sin(frame * 0.02 + phase) * 26;
          const tw = 0.45 + 0.55 * Math.sin(frame * 0.09 + phase * 3);
          return (
            <div
              key={k}
              style={{
                position: 'absolute', left: x, top: y, width: size, height: size,
                borderRadius: '50%', background: '#fff',
                opacity: L.op * tw,
                filter: L.blur ? `blur(${L.blur}px)` : undefined,
                boxShadow: '0 0 8px rgba(255,255,255,.7)',
              }}
            />
          );
        })
      )}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------
// CAPA 5 — Ondas expansivas en el impacto
// ------------------------------------------------------------
const Shockwaves: React.FC<{
  frame: number; impactF: number; cx: number; cy: number; r0: number; accent: string;
}> = ({ frame, impactF, cx, cy, r0, accent }) => (
  <>
    {[0, 4, 9].map((off) => {
      const f = frame - (impactF + off);
      if (f < 0) return null;
      const r = interpolate(f, [0, 26], [r0 * 0.5, r0 * 4.2], { ...CLAMP, easing: Easing.out(Easing.cubic) });
      const o = interpolate(f, [0, 26], [0.85, 0], CLAMP);
      const w = interpolate(f, [0, 26], [6, 1], CLAMP);
      return (
        <div
          key={off}
          style={{
            position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2,
            borderRadius: '50%', border: `${w}px solid ${accent}`,
            boxShadow: `0 0 30px ${accent}88, inset 0 0 30px ${accent}44`,
            opacity: o,
          }}
        />
      );
    })}
  </>
);

// ------------------------------------------------------------
// CAPA 6 — EL AVATAR: glow, RGB split, borde cónico, anillos,
// texto orbital y esquinas HUD
// ------------------------------------------------------------
const AvatarRig: React.FC<{
  frame: number; fps: number; impactF: number; ringF: number; hudF: number;
  cx: number; cy: number; size: number; src: string; accent: string; accent2: string;
}> = ({ frame, fps, impactF, ringF, hudF, cx, cy, size, src, accent, accent2 }) => {
  const enter = spr(frame, impactF - 5, fps, { damping: 11, stiffness: 150, mass: 0.9 });
  const oEnter = Math.min(1, enter * 3);
  const floatY = Math.sin((frame - impactF) * 0.05) * 10 * oEnter;
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.07);
  const split = interpolate(frame, [impactF, impactF + 14], [24, 0], CLAMP);
  const ringDraw = interpolate(frame, [ringF, ringF + 18], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  const R1 = size * 0.62;
  const R2 = size * 0.74;
  const RT = size * 0.85;
  const C1 = 2 * Math.PI * R1;
  const svgSize = size * 1.9;
  const c = svgSize / 2;

  const avatarImg = <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const orbitText = 'EPIC ✦ LEGEND ✦ AVATAR ✦ REVEAL ✦ '.repeat(3);

  return (
    <AbsoluteFill>
      {/* Orbe de glow */}
      <div
        style={{
          position: 'absolute', left: cx - size, top: cy - size, width: size * 2, height: size * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}40 0%, transparent 62%)`,
          opacity: (0.55 + 0.3 * pulse) * oEnter,
          transform: `scale(${0.9 + 0.12 * pulse})`,
        }}
      />

      {/* RGB split en el impacto */}
      {frame >= impactF && split > 0.6 && (
        <>
          <div style={{ position: 'absolute', left: cx - size / 2 - split, top: cy - size / 2 + floatY, width: size, height: size, borderRadius: '50%', overflow: 'hidden', opacity: (split / 24) * 0.7, mixBlendMode: 'screen', filter: 'saturate(4) hue-rotate(-50deg)', transform: `scale(${enter})` }}>{avatarImg}</div>
          <div style={{ position: 'absolute', left: cx - size / 2 + split, top: cy - size / 2 + floatY, width: size, height: size, borderRadius: '50%', overflow: 'hidden', opacity: (split / 24) * 0.7, mixBlendMode: 'screen', filter: 'saturate(4) hue-rotate(140deg)', transform: `scale(${enter})` }}>{avatarImg}</div>
        </>
      )}

      {/* Avatar + borde cónico rotando */}
      <div
        style={{
          position: 'absolute', left: cx - size / 2, top: cy - size / 2 + floatY,
          width: size, height: size,
          transform: `scale(${enter})`,
          opacity: oEnter,
          borderRadius: '50%',
          padding: size * 0.02,
          background: `conic-gradient(from ${frame * 2.4}deg, ${accent} 0%, transparent 22%, ${accent2} 50%, transparent 78%, ${accent} 100%)`,
          boxShadow: `0 0 ${50 + 40 * pulse}px ${accent}66, 0 30px 80px rgba(0,0,0,.6)`,
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#0a0c12' }}>
          {avatarImg}
        </div>
      </div>

      {/* Anillo 1: se dibuja y rota */}
      <svg width={svgSize} height={svgSize} style={{ position: 'absolute', left: cx - c, top: cy - c + floatY, opacity: oEnter, transform: `rotate(${frame * 0.35}deg)`, overflow: 'visible' }}>
        <circle cx={c} cy={c} r={R1} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={C1} strokeDashoffset={C1 * (1 - ringDraw)}
          style={{ filter: `drop-shadow(0 0 6px ${accent})` }} />
      </svg>

      {/* Anillo 2: dashed contrarrotando + ticks */}
      <svg width={svgSize} height={svgSize} style={{ position: 'absolute', left: cx - c, top: cy - c + floatY, transform: `rotate(${-frame * 0.7}deg)`, opacity: oEnter * 0.6, overflow: 'visible' }}>
        <circle cx={c} cy={c} r={R2} fill="none" stroke={accent2} strokeWidth={1.5} strokeDasharray="4 16"
          opacity={interpolate(frame, [ringF + 6, ringF + 20], [0, 1], CLAMP)} />
        {new Array(12).fill(0).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const rr1 = R2 + 10;
          const rr2 = R2 + (i % 3 === 0 ? 26 : 18);
          return <line key={i} x1={c + Math.cos(a) * rr1} y1={c + Math.sin(a) * rr1} x2={c + Math.cos(a) * rr2} y2={c + Math.sin(a) * rr2} stroke={accent2} strokeWidth={1.5} opacity={0.7} />;
        })}
      </svg>

      {/* Texto orbital */}
      <svg width={svgSize} height={svgSize} style={{ position: 'absolute', left: cx - c, top: cy - c + floatY, transform: `rotate(${frame * 0.18}deg)`, opacity: interpolate(frame, [ringF + 10, ringF + 26], [0, 0.85], CLAMP), overflow: 'visible' }}>
        <defs>
          <path id="orbitPath" d={`M ${c - RT} ${c} a ${RT} ${RT} 0 1 1 ${RT * 2} 0 a ${RT} ${RT} 0 1 1 ${-RT * 2} 0`} fill="none" />
        </defs>
        <text fill={accent2} fontSize={size * 0.052} letterSpacing={size * 0.02} fontFamily={MONO} fontWeight="700">
          <textPath href="#orbitPath">{orbitText}</textPath>
        </text>
      </svg>

      {/* Esquinas HUD */}
      {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).map(([sx, sy], i) => {
        const p = spr(frame, hudF + i * 2, fps, { damping: 16, stiffness: 200 });
        const m = size * 0.62 + 26;
        const breathe2 = 1 + 0.02 * Math.sin(frame * 0.06 + i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: cx + sx * m - 22, top: cy + sy * m - 22 + floatY,
              width: 44, height: 44,
              borderTop: sy === -1 ? `3px solid ${accent}` : 'none',
              borderBottom: sy === 1 ? `3px solid ${accent}` : 'none',
              borderLeft: sx === -1 ? `3px solid ${accent}` : 'none',
              borderRight: sx === 1 ? `3px solid ${accent}` : 'none',
              opacity: p,
              transform: `scale(${(2 - p) * breathe2})`,
              filter: `drop-shadow(0 0 6px ${accent})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------
// CAPA 7 — Poster secundario con tilt + gloss sweep
// ------------------------------------------------------------
const PosterCard: React.FC<{
  frame: number; fps: number; startF: number; src: string; width: number; height: number; accent: string;
}> = ({ frame, fps, startF, src, width, height, accent }) => {
  const p = spr(frame, startF, fps, { damping: 14, stiffness: 120 });
  const f = Math.max(0, frame - startF);
  const x = (1 - p) * -width * 0.3;
  const rot = (1 - p) * -20 - 6 + Math.sin(f * 0.05) * 1.5 * p;
  const y = Math.sin(f * 0.06 + 1) * 10 * p;
  const w = width * 0.185;
  const cyc = frame - (startF + 14);
  const local = ((cyc % 140) + 140) % 140;
  const glossX = interpolate(local, [0, 30], [-140, 140], { ...CLAMP, easing: Easing.inOut(Easing.quad) });
  const glossOn = cyc >= 0 && local <= 30;

  return (
    <div
      style={{
        position: 'absolute', left: width * 0.065, top: height * 0.2, width: w, height: w * 1.42,
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
        opacity: Math.min(1, p * 2),
        borderRadius: 18, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,.28)',
        boxShadow: '0 40px 90px rgba(0,0,0,.65), 0 0 0 6px rgba(255,255,255,.06)',
      }}
    >
      <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 32%, rgba(255,255,255,.4) 50%, transparent 68%)', transform: `translateX(${glossX}%)`, opacity: glossOn ? 1 : 0, mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', top: 12, left: 12, padding: '5px 12px', background: accent, borderRadius: 6, color: '#111', fontSize: width * 0.008, fontWeight: 900, letterSpacing: '0.18em', fontFamily: FONT, boxShadow: `0 4px 14px ${accent}88` }}>NUEVO</div>
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 -60px 60px rgba(0,0,0,.45)' }} />
    </div>
  );
};

// ------------------------------------------------------------
// CAPA 8 — Logo PNG flotando en 3D
// ------------------------------------------------------------
const FloatingLogo: React.FC<{
  frame: number; fps: number; startF: number; src: string; width: number; height: number; accent2: string;
}> = ({ frame, fps, startF, src, width, height, accent2 }) => {
  const p = spr(frame, startF, fps, { damping: 13, stiffness: 110, mass: 1 });
  const f = Math.max(0, frame - startF);
  const y = (1 - p) * -260 + Math.sin(f * 0.055) * 14 * p;
  const rotZ = (1 - p) * -26 + Math.sin(f * 0.04) * 4 * p;
  const rotY = Math.sin(f * 0.05) * 16 * p;
  const w = width * 0.15;

  return (
    <div style={{ position: 'absolute', left: width * 0.76, top: height * 0.13, width: w, opacity: Math.min(1, p * 2) }}>
      <Img
        src={src}
        style={{
          width: '100%',
          transform: `perspective(900px) translateY(${y}px) rotateZ(${rotZ}deg) rotateY(${rotY}deg)`,
          filter: `drop-shadow(0 22px 34px rgba(0,0,0,.6)) drop-shadow(0 0 26px ${accent2}55)`,
        }}
      />
      <div style={{ margin: '0 auto', marginTop: height * 0.02, width: w * (0.7 + 0.1 * Math.sin(f * 0.055)), height: 14, borderRadius: '50%', background: accent2, filter: 'blur(14px)', opacity: 0.35 * p }} />
    </div>
  );
};

// ------------------------------------------------------------
// CAPA 9 — Embers ascendiendo (additive)
// ------------------------------------------------------------
const Embers: React.FC<{
  frame: number; fps: number; startF: number; width: number; height: number; accent: string;
}> = ({ frame, fps, startF, width, height, accent }) => {
  const gate = interpolate(frame, [startF, startF + 24], [0, 1], CLAMP);
  if (gate <= 0) return null;
  const colors = [accent, '#FF6B35', '#FFD166'];
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: gate }}>
      {new Array(34).fill(0).map((_, i) => {
        const x0 = random(`ex${i}`) * width;
        const spd = (1.6 + random(`es${i}`) * 2.6) * (fps / 30);
        const size = 2 + random(`esz${i}`) * 4.5;
        const phase = random(`eph${i}`) * Math.PI * 2;
        const sway = 18 + random(`esw${i}`) * 42;
        const off = random(`eoff${i}`) * (height + 200);
        const ci = Math.floor(random(`ec${i}`) * 3);
        const p = (frame * spd + off) % (height + 200);
        const y = height + 100 - p;
        const x = x0 + Math.sin(frame * 0.06 + phase) * sway;
        const edge = interpolate(p, [0, 60, height + 120, height + 200], [0, 1, 1, 0], CLAMP);
        const flick = 0.55 + 0.45 * Math.sin(frame * 0.35 + i * 1.7);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: colors[ci], opacity: edge * flick, boxShadow: `0 0 ${size * 2.4}px ${colors[ci]}` }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------
// CAPA 10 — Tipografía: kicker, título stagger, barra, badge
// ------------------------------------------------------------
const TitleBlock: React.FC<{
  frame: number; fps: number; width: number; height: number;
  kickerF: number; titleF: number; badgeF: number;
  title: string; kicker: string; subtitle: string; accent: string;
}> = ({ frame, fps, width, height, kickerF, titleF, badgeF, title, kicker, subtitle, accent }) => {
  const letters = title.split('');
  const kp = spr(frame, kickerF, fps, { damping: 16, stiffness: 140 });
  const bp = spr(frame, badgeF, fps, { damping: 14, stiffness: 130 });
  const barP = spr(frame, titleF + letters.length * 2 + 4, fps, { damping: 18, stiffness: 120 });
  const tracking = interpolate(frame, [titleF, titleF + 30], [0.45, 0.14], CLAMP);
  const glowPulse = 22 + 10 * Math.sin(frame * 0.1);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: height * 0.135 }}>
      {/* Kicker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: kp, transform: `translateY(${(1 - kp) * 20}px)`, marginBottom: height * 0.02 }}>
        <div style={{ width: 70 * kp, height: 1, background: accent }} />
        <div style={{ color: accent, fontSize: width * 0.011, letterSpacing: '0.42em', fontFamily: FONT, fontWeight: 700 }}>{kicker}</div>
        <div style={{ width: 70 * kp, height: 1, background: accent }} />
      </div>

      {/* Título letra por letra */}
      <div style={{ whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 900, fontSize: width * 0.068, letterSpacing: `${tracking}em`, color: '#fff', textShadow: `0 0 ${glowPulse}px ${accent}99, 0 6px 24px rgba(0,0,0,.6)`, display: 'flex' }}>
        {letters.map((ch, i) => {
          const p = spr(frame, titleF + i * 2, fps, { damping: 13, stiffness: 170 });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: Math.min(1, p * 2),
                transform: `translateY(${(1 - p) * 90}px) rotate(${(1 - p) * 12}deg) scale(${0.5 + 0.5 * p})`,
                filter: `blur(${(1 - p) * 12}px)`,
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          );
        })}
      </div>

      {/* Barra acento */}
      <div style={{ marginTop: height * 0.018, width: width * 0.22, height: 4, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, transform: `scaleX(${barP})`, boxShadow: `0 0 16px ${accent}` }} />

      {/* Badge */}
      <div style={{ marginTop: height * 0.022, opacity: bp, transform: `translateY(${(1 - bp) * 26}px) scale(${0.7 + 0.3 * bp})`, display: 'flex', alignItems: 'center', gap: 12, padding: `${height * 0.008}px ${width * 0.014}px`, border: `1px solid ${accent}88`, borderRadius: 999, background: 'rgba(0,0,0,.35)', boxShadow: `0 0 ${14 + 8 * Math.sin(frame * 0.12)}px ${accent}44, inset 0 0 18px rgba(0,0,0,.5)` }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 10px ${accent}`, opacity: 0.6 + 0.4 * Math.sin(frame * 0.2) }} />
        <div style={{ color: '#fff', fontSize: width * 0.0115, letterSpacing: '0.3em', fontFamily: FONT, fontWeight: 700 }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------
// OVERLAYS DE PANTALLA (fuera de la cámara)
// ------------------------------------------------------------
const LensFlare: React.FC<{ frame: number; width: number; height: number; accent: string }> = ({ frame, width, height, accent }) => {
  const PERIOD = 170, WIN = 36, OFF = 135;
  if (frame < OFF) return null;
  const local = (frame - OFF) % PERIOD;
  if (local > WIN) return null;
  const prog = interpolate(local, [0, WIN], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const x = -width * 0.25 + prog * width * 1.5;
  const env = Math.sin(Math.PI * prog);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: env, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -height * 0.2, height: height * 1.4, width: 180, left: x, transform: 'rotate(16deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.16) 50%, transparent)' }} />
      <div style={{ position: 'absolute', left: x + 60, top: height * 0.3, width: 130, height: 130, marginLeft: -65, marginTop: -65, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,.9) 0%, ${accent}55 35%, transparent 70%)` }} />
      <div style={{ position: 'absolute', left: x + 60, top: height * 0.3, width: 260, height: 2, marginLeft: -130, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent)' }} />
    </AbsoluteFill>
  );
};

const Vignette: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(0,0,0,.62) 100%)', opacity: 0.9 + 0.1 * Math.sin(frame * 0.03) }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.45) 0%, transparent 18%, transparent 82%, rgba(0,0,0,.5) 100%)' }} />
  </>
);

const Flash: React.FC<{ frame: number; impactF: number; accent: string; cx: number; cy: number; width: number; height: number }> = ({
  frame, impactF, accent, cx, cy, width, height,
}) => {
  const o = interpolate(frame, [impactF - 1, impactF, impactF + 8], [0, 0.8, 0], CLAMP);
  const o2 = interpolate(frame, [impactF - 1, impactF, impactF + 16], [0, 0.9, 0], CLAMP);
  if (o <= 0 && o2 <= 0) return null;
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(45% 45% at ${(cx / width) * 100}% ${(cy / height) * 100}%, ${accent}cc 0%, transparent 70%)`, opacity: o2, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: '#fff', opacity: o }} />
    </>
  );
};

const Grain: React.FC<{ frame: number }> = ({ frame }) => {
  const jumps: [number, number][] = [[0, 0], [-46, 22], [34, -52], [-62, -28], [52, 44], [-24, 62], [64, -14], [12, -42]];
  const [jx, jy] = jumps[frame % jumps.length];
  return <AbsoluteFill style={{ backgroundImage: NOISE, opacity: 0.07, mixBlendMode: 'overlay', transform: `translate(${jx}px, ${jy}px) scale(1.1)` }} />;
};

const HudMeta: React.FC<{ frame: number; fps: number; width: number; height: number; startF: number; accent: string }> = ({
  frame, fps, width, height, startF, accent,
}) => {
  const o = interpolate(frame, [startF, startF + 16], [0, 0.75], CLAMP);
  if (o <= 0) return null;
  const ss = Math.floor(frame / fps);
  const tc = `00:${pad2(Math.floor(ss / 60))}:${pad2(ss % 60)}:${pad2(frame % fps)}`;
  const blink = Math.sin(frame * 0.25) > 0 ? 1 : 0.25;
  return (
    <>
      <div style={{ position: 'absolute', top: height * 0.085 + 12, left: width * 0.03, opacity: o, display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, color: '#fff', fontSize: width * 0.009, letterSpacing: '0.2em' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff2d2d', boxShadow: '0 0 10px #ff2d2d', opacity: blink }} />
        REC · 4K · {fps}FPS
      </div>
      <div style={{ position: 'absolute', bottom: height * 0.085 + 12, right: width * 0.03, opacity: o, fontFamily: MONO, color: accent, fontSize: width * 0.01, letterSpacing: '0.24em', textShadow: `0 0 12px ${accent}66` }}>
        TC {tc}
      </div>
    </>
  );
};

const Letterbox: React.FC<{ frame: number; fps: number; height: number }> = ({ frame, fps, height }) => {
  const h = interpolate(frame, [0, Math.round(0.8 * fps)], [0, height * 0.075], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: h, background: '#000', zIndex: 50 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: h, background: '#000', zIndex: 50 }} />
    </>
  );
};

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
export const EpicAvatar: React.FC<EpicAvatarProps> = ({
  avatarSrc = staticFile('avatar.png'),
  logoSrc = staticFile('logo.png'),
  bgSrc = staticFile('bg.jpg'),
  posterSrc = staticFile('poster.jpg'),
  title = 'LEYENDA',
  kicker = 'TEMPORADA 01 — EL DESPERTAR',
  subtitle = 'EL JUEGO EMPIEZA AHORA',
  accent = '#FFB84D',
  accent2 = '#38E1FF',
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const F = (sec: number) => Math.round(sec * fps);
  const impactF = F(BEATS.impact);

  // CÁMARA: push-in lento + shake en el impacto + handheld sutil
  const push = interpolate(frame, [0, durationInFrames], [1.03, 1.14], CLAMP);
  const shakeT = frame - impactF;
  const shakeAmp = shakeT < 0 ? 0 : 18 * Math.exp(-shakeT / 8);
  const shX = shakeAmp * Math.sin(shakeT * 1.9) + Math.sin(frame * 0.02) * 1.6;
  const shY = shakeAmp * Math.cos(shakeT * 2.6) * 0.7 + Math.cos(frame * 0.016) * 1.2;
  const shR = shakeAmp * 0.06 * Math.sin(shakeT * 1.4);

  const cx = width / 2;
  const cy = height * 0.42;
  const avatarSize = Math.min(width, height) * 0.34;

  return (
    <AbsoluteFill style={{ background: '#05060a', overflow: 'hidden' }}>
      {/* ESCENARIO (afectado por la cámara) */}
      <AbsoluteFill style={{ transform: `scale(${push}) translate(${shX}px, ${shY}px) rotate(${shR}deg)` }}>
        <Backdrop frame={frame} fps={fps} dur={durationInFrames} src={bgSrc} impactF={impactF} accent={accent} />
        <GridFloor frame={frame} fps={fps} width={width} height={height} accent={accent} />
        <LightRays frame={frame} fps={fps} cx={cx} cy={cy} size={height * 1.5} accent={accent} accent2={accent2} />
        <DustField frame={frame} fps={fps} width={width} height={height} />
        <Shockwaves frame={frame} impactF={impactF} cx={cx} cy={cy} r0={avatarSize / 2} accent={accent} />
        <AvatarRig frame={frame} fps={fps} impactF={impactF} ringF={F(BEATS.ring)} hudF={F(BEATS.hud)} cx={cx} cy={cy} size={avatarSize} src={avatarSrc} accent={accent} accent2={accent2} />
        <PosterCard frame={frame} fps={fps} startF={F(BEATS.poster)} src={posterSrc} width={width} height={height} accent={accent} />
        <FloatingLogo frame={frame} fps={fps} startF={F(BEATS.logo)} src={logoSrc} width={width} height={height} accent2={accent2} />
        <Embers frame={frame} fps={fps} startF={F(BEATS.embers)} width={width} height={height} accent={accent} />
        <TitleBlock frame={frame} fps={fps} width={width} height={height} kickerF={F(BEATS.kicker)} titleF={F(BEATS.title)} badgeF={F(BEATS.badge)} title={title} kicker={kicker} subtitle={subtitle} accent={accent} />
      </AbsoluteFill>

      {/* OVERLAYS DE PANTALLA */}
      <LensFlare frame={frame} width={width} height={height} accent={accent} />
      <Vignette frame={frame} />
      <Flash frame={frame} impactF={impactF} accent={accent} cx={cx} cy={cy} width={width} height={height} />
      <Grain frame={frame} />
      <HudMeta frame={frame} fps={fps} width={width} height={height} startF={F(BEATS.meta)} accent={accent} />
      <Letterbox frame={frame} fps={fps} height={height} />
    </AbsoluteFill>
  );
};

export default EpicAvatar;
