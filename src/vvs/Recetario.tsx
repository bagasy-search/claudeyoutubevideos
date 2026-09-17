// Recetario.tsx — valvaselina15: CTA con QR REAL (página real de la guía + QR + url legible) y la LÁMINA a pantalla completa.
// Marca Valeria: papel crema, tinta espresso, latón. El QR NO se mueve una vez asentado (se tiene que poder escanear).
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {VAL, FONT_DISPLAY, FONT_SERIF_FINE, FONT_SANS, FONT_HAND, CLAMP, rgba, CARD_SHADOW, PaperGrain, WarmVignette} from '../valeria/theme';

const sf = (p: string) => (/^https?:/.test(p) ? p : staticFile(p));

export const RecetarioQR: React.FC<{kicker: string; title: string; sub: string; pageImg: string; qrImg: string; url: string; dur: number}> = ({kicker, title, sub, pageImg, qrImg, url, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (d: number, damping = 18) => spring({frame: f - d, fps, config: {damping, stiffness: 90, mass: 0.9}});
  const page = sp(2);
  const card = sp(10, 22);
  const txt = interpolate(f, [16, 30], [0, 1], CLAMP);
  const out = interpolate(f, [dur - 10, dur], [0, 1], CLAMP);
  const float = Math.sin(f / 38) * 6;
  const arrow = interpolate(f, [34, 60], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 90% at 30% 40%, ${VAL.card} 0%, ${VAL.paper} 55%, ${VAL.paperWarm} 100%)`, opacity: 1 - out}}>
      <PaperGrain opacity={0.07} />
      {/* ramita latón decorativa */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.35}}>
        <path d="M 60 1010 C 260 900 420 930 600 1040" stroke={VAL.gold} strokeWidth={2} fill="none" strokeDasharray={900} strokeDashoffset={900 * (1 - txt)} />
        <path d="M 1860 70 C 1700 140 1560 110 1420 40" stroke={VAL.gold} strokeWidth={2} fill="none" strokeDasharray={700} strokeDashoffset={700 * (1 - txt)} />
      </svg>
      {/* página real de la guía, en 3D */}
      <div style={{position: 'absolute', left: 150, top: 120 + float, width: 600, height: 840, transform: `perspective(1800px) rotateY(${(14 - 6 * page).toFixed(2)}deg) rotateZ(${(-3 * page).toFixed(2)}deg) translateX(${((1 - page) * -260).toFixed(1)}px)`, opacity: page, boxShadow: CARD_SHADOW, borderRadius: 6, overflow: 'hidden', border: `10px solid ${VAL.card}`}}>
        <Img src={sf(pageImg)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      {/* texto */}
      <div style={{position: 'absolute', left: 860, top: 110, width: 960, opacity: txt, transform: `translateY(${((1 - txt) * 20).toFixed(1)}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 56, height: 3, background: VAL.gold}} />
          <div style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', color: VAL.goldDark}}>{kicker}</div>
        </div>
        <div style={{fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 76, lineHeight: 1.05, color: VAL.ink, marginTop: 18}}>{title}</div>
      </div>
      {/* QR grande, fondo blanco, quieto una vez asentado */}
      <div style={{position: 'absolute', left: 900, top: 380, display: 'flex', alignItems: 'center', gap: 44, opacity: card, transform: `scale(${interpolate(card, [0, 1], [0.92, 1]).toFixed(4)})`, transformOrigin: '0% 50%'}}>
        <div style={{background: '#FFFFFF', padding: 26, borderRadius: 18, boxShadow: CARD_SHADOW, border: `3px solid ${VAL.gold}`}}>
          <Img src={sf(qrImg)} style={{width: 440, height: 440, display: 'block', imageRendering: 'pixelated'}} />
        </div>
        <div style={{width: 440}}>
          <div style={{fontFamily: FONT_HAND, fontSize: 52, color: VAL.goldDark, lineHeight: 1.1, transform: `rotate(-3deg)`}}>en el televisor, escanee con su teléfono</div>
          <svg width={180} height={90} style={{marginTop: 6, opacity: arrow}}>
            <path d="M 170 20 C 110 10 50 30 18 70" stroke={VAL.goldDark} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - arrow)} />
            <path d="M 18 70 L 20 48 M 18 70 L 40 64" stroke={VAL.goldDark} strokeWidth={4} fill="none" strokeLinecap="round" opacity={arrow > 0.95 ? 1 : 0} />
          </svg>
          <div style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, color: VAL.ink, marginTop: 18, letterSpacing: 0.5}}>{url}</div>
          <div style={{fontFamily: FONT_SERIF_FINE, fontStyle: 'italic', fontSize: 30, color: VAL.ink2, marginTop: 14, lineHeight: 1.25}}>en el teléfono: el enlace está abajo, en la descripción</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 900, top: 900, width: 900, fontFamily: FONT_SERIF_FINE, fontSize: 30, color: VAL.inkSoft, opacity: interpolate(f, [40, 56], [0, 1], CLAMP)}}>{sub}</div>
      <WarmVignette strength={0.22} />
    </AbsoluteFill>
  );
};

// LÁMINA: la página a pantalla completa, con cámara que recorre punto por punto (part 0 = arriba/cantidades · part 1 = pie).
// stops = [{t (seg), x, y (centro 0..1), z}] — interpolado con easing, sin cortes.
export type LaminaStop = {t: number; x: number; y: number; z: number};
export const Lamina: React.FC<{image: string; stops: LaminaStop[]; dur: number}> = ({image, stops, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const S = stops.length ? stops : [{t: 0, x: 0.5, y: 0.5, z: 1}];
  let x = S[0].x, y = S[0].y, z = S[0].z;
  for (let i = 0; i < S.length - 1; i++) {
    const a = S[i], b = S[i + 1];
    if (t >= a.t && t <= b.t) {
      const k = Easing.inOut(Easing.cubic)((t - a.t) / Math.max(0.01, b.t - a.t));
      x = a.x + (b.x - a.x) * k; y = a.y + (b.y - a.y) * k; z = a.z + (b.z - a.z) * k;
    } else if (t > b.t) { x = b.x; y = b.y; z = b.z; }
  }
  const inn = interpolate(f, [0, 12], [0, 1], CLAMP);
  const out = interpolate(f, [dur - 8, dur], [0, 1], CLAMP);
  // el punto (x,y) de la imagen queda en el centro de la pantalla, sin mostrar bordes vacíos
  const W = 1920, H = 1080;
  const tx = Math.min(0, Math.max(W - W * z, W / 2 - x * W * z));
  const ty = Math.min(0, Math.max(H - H * z, H / 2 - y * H * z));
  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden', opacity: Math.min(inn, 1 - out * 0.9)}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${z.toFixed(4)})`}}>
        <Img src={sf(image)} style={{width: W, height: H, objectFit: 'cover'}} />
      </div>
      <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 120px ${rgba(VAL.paperEdge, 0.5)}`}} />
    </AbsoluteFill>
  );
};
