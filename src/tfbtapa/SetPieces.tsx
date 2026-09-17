// SetPieces.tsx — tfbtapa (El Constructor Libre): marca TALLER + set-pieces propios.
//   THEME_TALLER · TalkOverlay (ficha de taller sobre el avatar) · LaminaZoom (la ficha, zoom punto por punto)
//   · CtaColeccion (portada 2.5D + páginas reales + QR REAL + constructorlibre.com)
// ⛔ Ningún texto por default: todo llega por props (el build valida que no falte nada).
import React from 'react';
import {AbsoluteFill, Img, Sequence, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {THEME_EARTH, type Theme} from '../VideoEdit/kit/premium';

export const TALLER = {paper: '#F1E4C9', paper2: '#E7D5B1', ink: '#2B1E16', ink2: '#5A4636', rust: '#8B2D22', gold: '#B1832F', wood: '#6B4A2F'};
export const THEME_TALLER: Theme = {
  ...THEME_EARTH,
  name: 'taller',
  color: {...THEME_EARTH.color, bg0: TALLER.paper, bg1: '#EADBBD', bg2: TALLER.paper2, surface: 'rgba(241,228,201,0.94)', surfaceStrong: TALLER.paper,
    text: TALLER.ink, textSoft: 'rgba(43,30,22,0.72)', textDim: 'rgba(43,30,22,0.45)', accent: TALLER.rust, accentSoft: '#C07A6E', accent2: TALLER.wood,
    gold: TALLER.gold, danger: TALLER.rust, good: '#5E7A3A', ink: TALLER.ink, line: 'rgba(43,30,22,0.18)', glow: 'rgba(177,131,47,0.45)', shadow: 'rgba(43,30,22,0.25)', onAccent: TALLER.paper},
};
const SERIF = THEME_EARTH.fontDisplay;
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sfx = (f: string) => staticFile(`sfx/${f}`);

// ── frase de taller encima del avatar (tira de papel crema con cinta, palabra caliente en óxido) ──
export const TalkOverlay: React.FC<{kicker: string; title: string; hot?: string[]}> = ({kicker, title, hot = []}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const inS = spring({frame: frame - 6, fps, config: {damping: 18, stiffness: 110}});
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], CL);
  const words = title.split(/\s+/);
  const isHot = (w: string) => hot.some((h) => h.split(/\s+/).some((x) => w.replace(/[.,:;¿?¡!]/g, '').toLowerCase() === x.toLowerCase()));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 90, bottom: 96, maxWidth: 900, transform: `translateX(${(1 - inS) * -60}px) rotate(${-1.2 + inS * 0.4}deg)`, opacity: inS}}>
        <div style={{display: 'inline-block', background: TALLER.rust, color: TALLER.paper, fontFamily: SERIF, fontSize: 30, letterSpacing: 3, textTransform: 'uppercase', padding: '6px 18px', marginBottom: 10, boxShadow: '0 6px 16px rgba(0,0,0,0.3)'}}>{kicker}</div>
        <div style={{background: TALLER.paper, padding: '18px 30px 22px', boxShadow: '0 14px 34px rgba(0,0,0,0.35)', borderLeft: `10px solid ${TALLER.gold}`, backgroundImage: 'repeating-linear-gradient(0deg, rgba(43,30,22,0.05) 0 1px, transparent 1px 34px)'}}>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 62, lineHeight: 1.08, color: TALLER.ink}}>
            {words.map((w, i) => {
              const s = spring({frame: frame - 12 - i * 4, fps, config: {damping: 16, stiffness: 140}});
              return <span key={i} style={{display: 'inline-block', marginRight: 16, opacity: s, transform: `translateY(${(1 - s) * 22}px)`, color: isHot(w) ? TALLER.rust : TALLER.ink, textDecoration: isHot(w) ? `underline ${TALLER.gold} 6px` : 'none', textUnderlineOffset: 10}}>{w}</span>;
            })}
          </div>
        </div>
      </div>
      <Sequence from={4} durationInFrames={30}><Audio src={sfx('sfx_paper_tick.mp3')} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

// ── LA FICHA: pantalla completa, cámara que viaja de recuadro en recuadro (hits anclados a la frase) ──
const BOX: Record<string, [number, number, number, number]> = {
  full: [0, 0, 1, 1], materiales: [0.02, 0.17, 0.34, 0.84], pasos: [0.34, 0.17, 0.67, 0.84],
  etiqueta: [0.66, 0.17, 0.98, 0.57], errores: [0.66, 0.56, 0.98, 0.85], tecnico: [0.0, 0.84, 1.0, 1.0],
};
export const LaminaZoom: React.FC<{img: string; hits: {p: number; box: string}[]}> = ({img, hits}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width: W, height: H} = useVideoConfig();
  // la lámina ocupa el cuadro con margen (proporción 3:2)
  const lw = 1540, lh = lw / 1.5, lx = (W - lw) / 2, ly = (H - lh) / 2;
  const keys = [{f: 0, box: 'full'}, ...hits.map((h) => ({f: Math.round(h.p * durationInFrames), box: h.box}))];
  const cam = (box: string) => {
    const [x0, y0, x1, y1] = BOX[box] || BOX.full;
    const bw = (x1 - x0) * lw, bh = (y1 - y0) * lh;
    const s = box === 'full' ? 1 : Math.min(2.7, Math.min((W * 0.9) / bw, (H * 0.86) / bh));
    const cx = lx + ((x0 + x1) / 2) * lw, cy = ly + ((y0 + y1) / 2) * lh;
    return {s, tx: W / 2 - cx * s, ty: H / 2 - cy * s};
  };
  let k = 0; while (k + 1 < keys.length && frame >= keys[k + 1].f) k++;
  const a = cam(keys[Math.max(0, k - 1)].box), b = cam(keys[k].box);
  const t = k === 0 ? 1 : interpolate(frame, [keys[k].f, keys[k].f + 22], [0, 1], {...CL, easing: Easing.bezier(0.65, 0, 0.35, 1)});
  const s = a.s + (b.s - a.s) * t, tx = a.tx + (b.tx - a.tx) * t, ty = a.ty + (b.ty - a.ty) * t;
  const drift = Math.sin(frame / 40) * 4;
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 90}});
  const cur = keys[k].box;
  const [bx0, by0, bx1, by1] = BOX[cur] || BOX.full;
  const draw = interpolate(frame, [keys[k].f + 20, keys[k].f + 44], [0, 1], CL);
  const per = 2 * ((bx1 - bx0) * lw + (by1 - by0) * lh);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #7a5a3c 0%, #4a3322 70%, #2e2016 100%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${tx}px, ${ty + drift}px) scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: lx, top: ly, width: lw, height: lh, transform: `scale(${0.92 + enter * 0.08})`, boxShadow: '0 40px 90px rgba(0,0,0,0.55)'}}>
          <Img src={staticFile(img)} style={{width: '100%', height: '100%', display: 'block'}} />
          {cur !== 'full' && (
            <svg width={lw} height={lh} style={{position: 'absolute', left: 0, top: 0}}>
              <rect x={bx0 * lw + 6} y={by0 * lh + 6} width={(bx1 - bx0) * lw - 12} height={(by1 - by0) * lh - 12} rx={18} fill="none" stroke={TALLER.rust} strokeWidth={7 / Math.max(1, s * 0.8)} strokeDasharray={per} strokeDashoffset={per * (1 - draw)} strokeLinecap="round" />
            </svg>
          )}
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 40, bottom: 30, background: TALLER.rust, color: TALLER.paper, fontFamily: SERIF, fontSize: 28, letterSpacing: 3, padding: '8px 20px', opacity: interpolate(frame, [10, 24], [0, 0.95], CL), transform: 'rotate(2deg)'}}>PAUSA · SÁCALE FOTO</div>
      {keys.map((kk, i) => <Sequence key={i} from={kk.f} durationInFrames={30}><Audio src={sfx(i === 0 ? 'sfx_trans4.mp3' : 'sfx_whoosh_soft.mp3')} volume={0.3} /></Sequence>)}
    </AbsoluteFill>
  );
};

// ── CTA: portada real 2.5D + abanico de páginas reales + QR REAL grande sobre blanco ──
export const CtaColeccion: React.FC<{eyebrow: string; title: string; bullets: string[]; qrP: number; pages: string[]; cover: string; qr: string}> = ({eyebrow, title, bullets, qrP, pages, cover, qr}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 18, stiffness: 80}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [0, 1], CL);
  const qrF = Math.round(qrP * durationInFrames);
  const qrS = spring({frame: frame - qrF, fps, config: {damping: 14, stiffness: 120}});
  const tiltY = -18 + Math.sin(frame / 50) * 5, float = Math.sin(frame / 32) * 10;
  const fan = spring({frame: frame - 10, fps, config: {damping: 20, stiffness: 60}});
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 30% 50%, #F6ECD6 0%, ${TALLER.paper} 45%, #D9C29A 100%)`, opacity: 1 - out, overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(90deg, rgba(107,74,47,0.06) 0 2px, transparent 2px 120px)'}} />
      {/* abanico de páginas reales detrás de la portada */}
      <div style={{position: 'absolute', left: 110, top: 130, width: 640, height: 860, perspective: 1600}}>
        {pages.map((p, i) => {
          const ang = (i - (pages.length - 1) / 2) * 8 * fan;
          return <Img key={p} src={staticFile(p)} style={{position: 'absolute', left: 120, top: 60, width: 420, height: 752, objectFit: 'cover', transform: `translateX(${(i - (pages.length - 1) / 2) * 95 * fan}px) rotate(${ang}deg)`, transformOrigin: '50% 100%', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: `6px solid ${TALLER.paper}`}} />;
        })}
        <div style={{position: 'absolute', left: 50, top: 20, width: 580, height: 773, transform: `translateY(${(1 - inS) * 300 + float}px) rotateY(${tiltY}deg) rotateX(4deg)`, transformStyle: 'preserve-3d'}}>
          <Img src={staticFile(cover)} style={{width: 580, height: 773, objectFit: 'cover', boxShadow: '30px 40px 70px rgba(0,0,0,0.45)', borderRadius: 4}} />
          <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${100 + Math.sin(frame / 30) * 20}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.35) 48%, rgba(255,255,255,0) 62%)`}} />
        </div>
      </div>
      {/* texto */}
      <div style={{position: 'absolute', left: 860, top: 100, width: 980, opacity: inS, transform: `translateX(${(1 - inS) * 80}px)`}}>
        <div style={{fontFamily: SERIF, fontSize: 32, letterSpacing: 4, color: TALLER.rust, textTransform: 'uppercase'}}>{eyebrow}</div>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64, lineHeight: 1.08, color: TALLER.ink, marginTop: 10, maxWidth: 980}}>{title}</div>
        <div style={{width: 260 * inS, height: 6, background: TALLER.gold, margin: '18px 0 20px'}} />
        {bullets.map((b, i) => {
          const s = spring({frame: frame - 18 - i * 10, fps, config: {damping: 16}});
          return <div key={i} style={{fontFamily: SERIF, fontSize: 40, color: TALLER.ink2, margin: '8px 0', opacity: s, transform: `translateX(${(1 - s) * 40}px)`}}><span style={{color: TALLER.gold, marginRight: 14}}>✦</span>{b}</div>;
        })}
      </div>
      {/* QR REAL: blanco, grande, sin tapar */}
      <div style={{position: 'absolute', right: 110, bottom: 70, display: 'flex', alignItems: 'center', gap: 34, opacity: frame >= qrF ? 1 : 0, transform: `scale(${0.7 + 0.3 * qrS})`, transformOrigin: '100% 100%'}}>
        <div style={{fontFamily: SERIF, textAlign: 'right'}}>
          <div style={{fontSize: 34, color: TALLER.ink2}}>Apunta la cámara de tu teléfono</div>
          <div style={{fontSize: 30, color: TALLER.ink2, marginTop: 6}}>o busca el enlace en la descripción</div>
          <div style={{fontSize: 58, fontWeight: 700, color: TALLER.rust, marginTop: 10}}>constructorlibre.com</div>
        </div>
        <div style={{background: '#FFFFFF', padding: 26, borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
          <Img src={staticFile(qr)} style={{width: 400, height: 400, display: 'block', imageRendering: 'pixelated'}} />
        </div>
      </div>
      <Sequence from={0} durationInFrames={40}><Audio src={sfx('sfx_trans4.mp3')} volume={0.3} /></Sequence>
      <Sequence from={qrF} durationInFrames={30}><Audio src={sfx('sfx_pop.mp3')} volume={0.4} /></Sequence>
    </AbsoluteFill>
  );
};
