import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Particles} from '../components/Particles';
import {lin, eo, jr} from '../lib/anim';
import {DISPLAY, UI} from '../fonts';
import {COLORS, S} from '../config';
import {useBrand} from '../lib/Brand';

const CLICK = 86;
const BELL = 94;

export const Scene7Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {channelName, accent} = useBrand();
  const d = S.S7;

  const logoS = spring({frame: Math.max(0, f - 8), fps, config: {damping: 12, stiffness: 140}});
  const tagP = eo(f, 46, 60);
  const subP = eo(f, 60, 72);
  const clicked = f >= CLICK;
  const btnScale = f >= CLICK && f < CLICK + 4 ? 0.88 : 1;
  const bellS = spring({frame: Math.max(0, f - BELL), fps, config: {damping: 8, stiffness: 200}});
  const bellW = f >= BELL && f < BELL + 22 ? Math.sin((f - BELL) / 1.6) * (1 - (f - BELL) / 22) * 22 : 0;

  // cursor
  const curP = eo(f, 68, CLICK);
  const curX = (1 - curP) * 340;
  const curY = (1 - curP) * 260;
  const curOp = f >= 64 ? lin(f, 100, 110, 1, 0) : 0;

  // glitch final del logo
  const glitching = f >= 164 && f <= 168;
  const gx = glitching ? (jr('ogx', f) - 0.5) * 18 : 0;
  const fadeOut = lin(f, d - 10, d, 0, 1);
  const pulse = ((f - 10) % 40 + 40) % 40;

  const handle = '@' + channelName.toLowerCase().replace(/\s/g, '');

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a0a12, #050507)', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      <Particles count={20} seed="s7" color={`${accent}66`} />
      <AbsoluteFill style={{background: '#fff', opacity: lin(f, 0, 7, 0.9, 0)}} />

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, transform: `translateX(${gx}px)`}}>
        {/* logo + pulso */}
        <div style={{position: 'relative', transform: `scale(${logoS}) rotate(${(1 - logoS) * -30}deg)`}}>
          <div
            style={{
              position: 'absolute', inset: -14, borderRadius: 200,
              border: `3px solid ${accent}`,
              transform: `scale(${1 + pulse * 0.02})`, opacity: Math.max(0, 0.6 - pulse * 0.015),
            }}
          />
          <svg width="150" height="150" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={accent} />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="47" fill="url(#lg)" />
            <path d="M40 32 L70 50 L40 68 Z" fill="#0b0e14" />
          </svg>
        </div>

        {/* nombre letra por letra */}
        <div style={{display: 'flex', fontFamily: DISPLAY, fontSize: 92, color: COLORS.ink}}>
          {channelName.split('').map((ch, i) => {
            const p = spring({frame: Math.max(0, f - (20 + i * 2)), fps, config: {damping: 13}});
            return (
              <span key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 36}px)`, whiteSpace: 'pre'}}>
                {ch}
              </span>
            );
          })}
        </div>

        <div style={{fontFamily: UI, fontSize: 26, letterSpacing: '0.45em', color: COLORS.dim, opacity: tagP, transform: `translateY(${(1 - tagP) * 20}px)`}}>
          NUEVOS VIDEOS CADA SEMANA
        </div>

        {/* botón suscribirse + cursor */}
        <div style={{position: 'relative', marginTop: 26, opacity: subP, transform: `translateY(${(1 - subP) * 50}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div
              style={{
                width: 330, height: 90, borderRadius: 45,
                background: clicked ? '#2a2a33' : '#ff2d55',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontFamily: DISPLAY, fontSize: 32, color: '#fff',
                transform: `scale(${btnScale})`, transition: 'background 0.1s',
                boxShadow: clicked ? 'none' : '0 14px 50px rgba(255,45,85,0.4)',
              }}
            >
              {clicked ? 'SUSCRITO ✓' : 'SUSCRIBIRSE'}
            </div>
            {f >= BELL && (
              <div style={{transform: `scale(${bellS}) rotate(${bellW}deg)`, transformOrigin: 'top center'}}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill={accent}>
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </div>
            )}
          </div>

          {/* cursor */}
          {curOp > 0 && (
            <div style={{position: 'absolute', left: 165 + curX, top: 45 + curY, opacity: curOp, transform: `scale(${f >= CLICK && f < CLICK + 4 ? 0.8 : 1})`, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.5))'}}>
              <svg width="52" height="52" viewBox="0 0 24 32">
                <path d="M4 2 L4 26 L10 20 L14 30 L17 28 L13 18 L21 18 Z" fill="#fff" stroke="#0b0e14" strokeWidth="1.6" />
              </svg>
            </div>
          )}
        </div>

        {/* handles */}
        <div style={{display: 'flex', gap: 16, marginTop: 34}}>
          {[handle, 'youtube.com' + handle.slice(0), 'discord.gg/' + handle.slice(1)].map((h, i) => {
            const p = eo(f, 108 + i * 6, 122 + i * 6);
            return (
              <div
                key={i}
                style={{
                  fontFamily: UI, fontSize: 22, color: COLORS.ink,
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: 30,
                  padding: '12px 26px', opacity: p, transform: `translateY(${(1 - p) * 26}px)`,
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                {h}
              </div>
            );
          })}
        </div>
      </div>

      <Particles mode="burst" count={16} seed="confetti" color={accent} start={CLICK} life={50} gravity={0.3} origin={{x: 960, y: 668}} />

      <div style={{position: 'absolute', bottom: 40, fontFamily: UI, fontSize: 18, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)'}}>
        HECHO CON REMOTION
      </div>

      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
