/**
 * ValOverlays — overlays del kit Valeria (editorial vintage claro) que van ENCIMA del avatar sin
 * taparle la cara. Nacieron para la fábrica (factory/styles/premium-valeria): el kit Val* original
 * son todas escenas de pantalla completa, y el canal necesita remates y recetas SOBRE la doctora.
 *
 *  · ValTalk          — kicker + frase palabra por palabra, abajo a la izquierda, velo crema.
 *  · ValRecipeCard    — tarjeta de receta de pergamino (cantidad a mano + ingrediente), a la derecha.
 *  · ValNightTracker  — "Noche N de 5" arriba a la izquierda, con 5 lunas; la actual se enciende.
 *
 * Todas reciben `durationInFrames` (lo pasa Comp.tsx) para salir a tiempo, y ninguna usa assets.
 */
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {VAL, FONT_DISPLAY, FONT_SERIF, FONT_SERIF_FINE, FONT_HAND, FONT_SANS, CLAMP, rgba, CARD_SHADOW} from './theme';
import {Kicker, Words} from './ValeriaKit';

const useOut = (durationInFrames?: number, outS = 0.45) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames: dv} = useVideoConfig();
  const d = durationInFrames || dv;
  return interpolate(frame, [d - Math.round(outS * fps), d - 1], [0, 1], CLAMP);
};

/* ────────────────────────────── ValTalk ────────────────────────────── */

export const ValTalk: React.FC<{
  kicker?: string;
  title: string;
  hot?: string[];
  sub?: string;
  side?: 'left' | 'right';
  durationInFrames?: number;
}> = ({kicker, title, hot, sub, side = 'left', durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const accent = VAL.gold;
  const out = useOut(durationInFrames);
  const words = (title ?? '').trim().split(/\s+/).filter(Boolean);
  const stagger = words.length > 1 ? Math.min(0.22, Math.max(0.08, 2.0 / words.length)) : 0;
  const subStart = 0.5 + stagger * Math.max(0, words.length - 1) + 0.3;
  const k = spring({frame: frame - Math.round(0.15 * fps), fps, config: {damping: 20, stiffness: 100, mass: 0.8}});
  const scrimO = interpolate(k, [0, 1], [0, 1], CLAMP) * (1 - out);
  const driftY = Math.sin(frame * 0.045) * height * 0.002;
  const fontSize = Math.round(Math.min(width * 0.034, height * 0.056));
  const subK = spring({frame: frame - Math.round(subStart * fps), fps, config: {damping: 22, stiffness: 110}});
  const L = side === 'left';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          opacity: 0.92 * scrimO,
          background: `linear-gradient(to top, ${rgba(VAL.paper, 0.86)} 0%, ${rgba(VAL.paper, 0.34)} 28%, transparent 52%), radial-gradient(70% 60% at ${L ? 16 : 84}% 86%, ${rgba(VAL.paper, 0.55)}, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          [L ? 'left' : 'right']: '6.5%',
          bottom: '9.5%',
          width: '56%',
          textAlign: L ? 'left' : 'right',
          opacity: 1 - out,
          filter: `blur(${out * 8}px)`,
          transform: `translateY(${driftY + out * 24}px)`,
        }}
      >
        {kicker ? <Kicker text={kicker} accent={accent} startSec={0.18} /> : null}
        <div style={{marginTop: height * 0.016}}>
          <Words text={title} hot={hot} accent={accent} startSec={0.42} size={fontSize} staggerSec={stagger} uppercase={false} />
        </div>
        {sub ? (
          <div
            style={{
              marginTop: height * 0.018,
              [L ? 'paddingLeft' : 'paddingRight']: 16,
              [L ? 'borderLeft' : 'borderRight']: `2px solid ${accent}`,
              fontFamily: FONT_SERIF_FINE,
              fontStyle: 'italic',
              fontSize: Math.round(fontSize * 0.52),
              color: VAL.ink2,
              opacity: subK,
              transform: `translateY(${(1 - subK) * 14}px)`,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────────────────── ValRecipeCard ─────────────────────────── */

export type ValRecipeItem = {qty?: string; text: string};

export const ValRecipeCard: React.FC<{
  kicker?: string;
  title: string;
  items: ValRecipeItem[];
  note?: string;
  side?: 'left' | 'right';
  startAt?: number;
  stagger?: number;
  durationInFrames?: number;
}> = ({kicker = 'La receta', title, items, note, side = 'right', startAt = 14, stagger = 16, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const out = useOut(durationInFrames, 0.5);
  const R = side === 'right';
  const enter = spring({frame, fps, config: {damping: 17, stiffness: 90, mass: 0.9}});
  const cardW = width * 0.33;
  const tilt = (R ? 1 : -1) * interpolate(enter, [0, 1], [7, 1.6]);
  const x = interpolate(enter, [0, 1], [R ? width * 0.42 : -width * 0.42, 0]);
  const floatY = Math.sin(frame * 0.04) * height * 0.004;
  const list = (items || []).slice(0, 6);
  const baseF = Math.max(8, startAt);
  const noteK = spring({frame: frame - (baseF + stagger * list.length + 6), fps, config: {damping: 20, stiffness: 110}});
  const fs = Math.round(height * 0.03);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          opacity: 0.55 * enter * (1 - out),
          background: `radial-gradient(60% 80% at ${R ? 88 : 12}% 50%, ${rgba(VAL.ink, 0.28)}, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          [R ? 'right' : 'left']: width * 0.045,
          width: cardW,
          transform: `translate(${x + (R ? 1 : -1) * out * width * 0.3}px, calc(-50% + ${floatY}px)) rotate(${tilt}deg)`,
          opacity: 1 - out * 0.9,
          background: VAL.card,
          borderRadius: 6,
          boxShadow: CARD_SHADOW,
          padding: `${height * 0.034}px ${width * 0.022}px ${height * 0.03}px`,
          border: `1px solid ${VAL.cardEdge}`,
        }}
      >
        {/* doble filete de etiqueta antigua */}
        <div style={{position: 'absolute', inset: 10, border: `1.5px solid ${rgba(VAL.gold, 0.7)}`, borderRadius: 3}} />
        <div style={{position: 'absolute', inset: 15, border: `0.8px solid ${rgba(VAL.gold, 0.45)}`, borderRadius: 2}} />
        {/* chinche de latón */}
        <div
          style={{
            position: 'absolute', top: -10, left: '50%', width: 22, height: 22, marginLeft: -11, borderRadius: 11,
            background: `radial-gradient(circle at 35% 35%, ${VAL.goldLite}, ${VAL.goldDark})`,
            boxShadow: `0 3px 6px ${rgba(VAL.ink, 0.35)}`,
          }}
        />
        <div style={{position: 'relative', textAlign: 'center'}}>
          <div style={{fontFamily: FONT_SANS, fontSize: Math.round(height * 0.016), letterSpacing: '0.28em', textTransform: 'uppercase', color: VAL.gold, fontWeight: 600}}>
            {kicker}
          </div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: Math.round(height * 0.042), color: VAL.ink, lineHeight: 1.08, marginTop: height * 0.01, fontWeight: 700}}>
            {title}
          </div>
          <div style={{height: 1.5, background: rgba(VAL.gold, 0.6), margin: `${height * 0.018}px auto`, width: interpolate(enter, [0, 1], [0, cardW * 0.55])}} />
        </div>
        <div style={{position: 'relative'}}>
          {list.map((it, i) => {
            const k = spring({frame: frame - (baseF + i * stagger), fps, config: {damping: 18, stiffness: 120}});
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: width * 0.01, marginTop: height * 0.012,
                  opacity: k, transform: `translateX(${(1 - k) * 26}px)`,
                  borderBottom: i < list.length - 1 ? `1px dashed ${rgba(VAL.line, 0.8)}` : 'none', paddingBottom: height * 0.008,
                }}
              >
                {it.qty ? (
                  <div style={{fontFamily: FONT_HAND, fontSize: Math.round(fs * 1.25), color: VAL.terracotta, minWidth: cardW * 0.3, lineHeight: 1}}>
                    {it.qty}
                  </div>
                ) : (
                  <div style={{color: VAL.gold, fontSize: fs, minWidth: 22}}>✦</div>
                )}
                <div style={{fontFamily: FONT_SERIF, fontSize: fs, color: VAL.ink, lineHeight: 1.15}}>{it.text}</div>
              </div>
            );
          })}
          {note ? (
            <div
              style={{
                marginTop: height * 0.02, textAlign: 'center', fontFamily: FONT_HAND, fontSize: Math.round(fs * 1.1), color: VAL.ink2,
                opacity: noteK, transform: `rotate(-1.5deg) translateY(${(1 - noteK) * 10}px)`,
              }}
            >
              {note}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── ValNightTracker ────────────────────────── */

const Moon: React.FC<{on: number; done: boolean; size: number}> = ({on, done, size}) => (
  <div
    style={{
      width: size, height: size, borderRadius: size / 2, position: 'relative',
      border: `2px solid ${done || on > 0.5 ? VAL.gold : rgba(VAL.ink, 0.35)}`,
      background: done ? rgba(VAL.gold, 0.85) : `radial-gradient(circle at 38% 38%, ${rgba(VAL.goldLite, on)}, ${rgba(VAL.gold, on * 0.9)})`,
      boxShadow: on > 0 ? `0 0 ${18 * on}px ${rgba(VAL.goldLite, 0.8 * on)}` : 'none',
      transform: `scale(${1 + on * 0.18})`,
    }}
  />
);

export const ValNightTracker: React.FC<{
  night: number;
  total?: number;
  label?: string;
  durationInFrames?: number;
}> = ({night, total = 5, label, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const out = useOut(durationInFrames);
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 100}});
  const on = spring({frame: frame - Math.round(0.55 * fps), fps, config: {damping: 12, stiffness: 90}});
  const n = Math.max(1, Math.min(total, Math.round(night)));
  const size = Math.round(height * 0.03);
  const underline = interpolate(frame, [Math.round(0.8 * fps), Math.round(1.4 * fps)], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute', left: width * 0.045, top: height * 0.07,
          opacity: enter * (1 - out), transform: `translateY(${(1 - enter) * -20 - out * 16}px)`,
          background: rgba(VAL.card, 0.94), border: `1px solid ${VAL.cardEdge}`, borderRadius: 8,
          padding: `${height * 0.018}px ${width * 0.018}px`, boxShadow: CARD_SHADOW,
        }}
      >
        <div style={{fontFamily: FONT_SANS, fontSize: Math.round(height * 0.015), letterSpacing: '0.3em', textTransform: 'uppercase', color: VAL.gold, fontWeight: 600}}>
          El ritual de la papa
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: width * 0.008, marginTop: height * 0.006}}>
          <span style={{fontFamily: FONT_DISPLAY, fontSize: Math.round(height * 0.05), color: VAL.ink, fontWeight: 700}}>Noche {n}</span>
          <span style={{fontFamily: FONT_SERIF_FINE, fontStyle: 'italic', fontSize: Math.round(height * 0.03), color: VAL.ink2}}>de {total}</span>
        </div>
        <div style={{height: 2, background: VAL.terracotta, width: `${underline * 100}%`, marginTop: 2, borderRadius: 2}} />
        <div style={{display: 'flex', gap: size * 0.55, marginTop: height * 0.016}}>
          {Array.from({length: total}, (_, i) => (
            <Moon key={i} size={size} done={i < n - 1} on={i === n - 1 ? on : 0} />
          ))}
        </div>
        {label ? (
          <div style={{fontFamily: FONT_HAND, fontSize: Math.round(height * 0.034), color: VAL.terracotta, marginTop: height * 0.01}}>{label}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
