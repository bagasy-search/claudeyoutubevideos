/**
 * CreatininaScene — CreatininaMeter al ESTÁNDAR (microescena 2.5D dirigida).
 * Metáfora: un INSTRUMENTO DE LABORATORIO real. Dial de vidrio con arco de zonas (verde/ámbar/rojo),
 * marcas metálicas, AGUJA metálica con sombra que BAJA físicamente de rojo(alto) a verde(bajo)
 * = la acción semántica "baja". Número acrílico grande que cuenta con la aguja. Cámara dolly-in +
 * leve órbita que revela el grosor del dial y los reflejos. Materiales: vidrio + metal + acrílico.
 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, FONT_NUM, rgba, shade} from './theme';

const easeIO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type CreatininaSceneProps = {from?: number; to?: number; caption?: string; subcaption?: string};

export const CreatininaScene: React.FC<CreatininaSceneProps> = ({from = 2.4, to = 1.3, caption = 'Creatinina', subcaption = 'se estabilizó'}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // cámara
  const camP = interpolate(frame, [0, 55], [0, 1], {...clamp, easing: easeIO});
  const ry = interpolate(camP, [0, 1], [-6, -1.5]) + Math.sin(frame / fps * 0.5) * 0.3;
  const rx = interpolate(camP, [0, 1], [-3.5, -1]);
  const dolly = interpolate(camP, [0, 1], [0.965, 1.02]) + interpolate(frame, [55, 120], [0, 0.004], clamp);
  const panX = interpolate(camP, [0, 1], [14, 0]) + Math.sin(frame / fps * 0.4) * 2;

  // valor: sostiene en `from` (~1s) y BAJA a `to` con inercia
  const drop = spring({frame: frame - fps * 0.9, fps, config: {damping: 60, mass: 1.5}});
  const value = interpolate(drop, [0, 1], [from, to], clamp);
  const vmin = 0.6, vmax = 3.0;
  const norm = interpolate(value, [vmin, vmax], [0, 1], clamp);
  const angle = interpolate(norm, [0, 1], [-120, 120]);
  const zoneColor = norm < 0.42 ? BAS.si : norm < 0.68 ? BAS.amber : BAS.no;

  const plateIn = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: easeIO});
  const dialIn = spring({frame: frame - 6, fps, config: {damping: 140}});
  const numIn = interpolate(frame, [16, 30], [0, 1], {...clamp, easing: easeIO});
  const capIn = interpolate(frame, [24, 40], [0, 1], clamp);

  const cx = width / 2, cy = height * 0.5;
  const Layer: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z, children, style}) => (
    <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) translateZ(${z}px)`, transformStyle: 'preserve-3d', ...style}}>{children}</div>
  );

  // geometría del dial (SVG)
  const R = 250, C = 300;
  const polar = (deg: number, r: number) => ({x: C + r * Math.cos((deg - 90) * Math.PI / 180), y: C + r * Math.sin((deg - 90) * Math.PI / 180)});
  const arc = (a0: number, a1: number, r: number) => {
    const s = polar(a0, r), e = polar(a1, r);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
  };
  const tip = polar(angle, R - 34);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(80% 90% at 42% 42%, #0C1B27 0%, #071019 55%, #03080C 100%)', perspective: 1500, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(40% 46% at 38% 42%, ${rgba(zoneColor, 0.13)} 0%, transparent 70%)`}} />
      {Array.from({length: 12}).map((_, i) => {
        const s = (i * 61.3) % 100; const dz = ((frame / fps) * (4 + s % 4) + s * 3) % 130 - 15;
        return <div key={i} style={{position: 'absolute', left: `${s}%`, top: `${(100 + dz) % 115 - 8}%`, width: 2, height: 2, borderRadius: '50%', background: 'rgba(180,220,235,0.5)', opacity: 0.2}} />;
      })}

      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateX(${panX}px) scale(${dolly})`, transformOrigin: '48% 50%'}}>

        {/* DIAL DE VIDRIO */}
        <Layer z={0} style={{opacity: plateIn}}>
          <div style={{position: 'absolute', left: -720, top: -300, width: 600, height: 600, borderRadius: '50%',
            transform: `scale(${interpolate(dialIn, [0, 1], [0.9, 1])})`,
            background: 'radial-gradient(circle at 40% 32%, rgba(20,28,36,0.9), rgba(4,8,12,0.96))',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.14), inset 0 -6px 18px rgba(0,0,0,0.7), inset 0 0 80px rgba(0,0,0,0.6), 0 60px 120px rgba(0,0,0,0.6)'}}>
            <svg width={600} height={600} viewBox="0 0 600 600">
              {/* pista */}
              <path d={arc(-120, 120, R)} fill="none" stroke={rgba('#ffffff', 0.08)} strokeWidth={30} strokeLinecap="round" />
              {/* zonas */}
              <path d={arc(-120, -18, R)} fill="none" stroke={BAS.si} strokeWidth={30} strokeLinecap="round" opacity={0.9} />
              <path d={arc(-18, 46, R)} fill="none" stroke={BAS.amber} strokeWidth={30} opacity={0.9} />
              <path d={arc(46, 120, R)} fill="none" stroke={BAS.no} strokeWidth={30} strokeLinecap="round" opacity={0.9} />
              {/* marcas metálicas */}
              {Array.from({length: 13}).map((_, i) => {
                const a = -120 + i * 20; const o = polar(a, R - 52), t2 = polar(a, R - 70);
                return <line key={i} x1={o.x} y1={o.y} x2={t2.x} y2={t2.y} stroke="rgba(200,220,230,0.5)" strokeWidth={i % 3 === 0 ? 4 : 2} />;
              })}
              {/* AGUJA metálica */}
              <g style={{filter: `drop-shadow(0 6px 8px rgba(0,0,0,0.6))`}}>
                <line x1={C} y1={C} x2={tip.x} y2={tip.y} stroke="url(#needle)" strokeWidth={11} strokeLinecap="round" />
                <line x1={C} y1={C} x2={polar(angle + 180, 46).x} y2={polar(angle + 180, 46).y} stroke="#4A5A66" strokeWidth={9} strokeLinecap="round" />
              </g>
              {/* hub */}
              <circle cx={C} cy={C} r={30} fill="url(#hub)" stroke={rgba(zoneColor, 0.9)} strokeWidth={3} />
              <circle cx={C} cy={C} r={12} fill="#0B1218" />
              <defs>
                <linearGradient id="needle" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#EAF2F6" /><stop offset="0.5" stopColor={shade(zoneColor, 0.2)} /><stop offset="1" stopColor={shade(zoneColor, -0.2)} />
                </linearGradient>
                <radialGradient id="hub" cx="40%" cy="35%" r="65%">
                  <stop offset="0" stopColor="#D8E2E8" /><stop offset="0.5" stopColor="#7C8B96" /><stop offset="1" stopColor="#2A343C" />
                </radialGradient>
              </defs>
            </svg>
            {/* reflejo de vidrio del dial */}
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%)', pointerEvents: 'none'}} />
          </div>
        </Layer>

        {/* LECTURA — número acrílico + etiquetas (lado derecho) */}
        <Layer z={40} style={{opacity: numIn}}>
          <div style={{position: 'absolute', left: 20, top: -150, transform: `translateY(${interpolate(numIn, [0, 1], [24, 0])}px)`}}>
            <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: zoneColor, textShadow: `0 0 18px ${rgba(zoneColor, 0.5)}`}}>{caption}</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 4}}>
              <span style={{fontFamily: FONT_NUM, fontSize: 210, fontWeight: 800, lineHeight: 0.9, backgroundImage: `linear-gradient(150deg, ${shade(zoneColor, 0.4)}, ${zoneColor} 55%, ${shade(zoneColor, -0.2)})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 26px ${rgba(zoneColor, 0.35)})`}}>{value.toFixed(1)}</span>
              <span style={{fontFamily: FONT_SANS, fontSize: 40, color: BAS.inkSoft}}>mg/dL</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, opacity: capIn}}>
              <span style={{fontSize: 40, color: to < from ? BAS.si : BAS.no, transform: `rotate(${to < from ? 0 : 180}deg)`}}>▼</span>
              <span style={{fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 700, color: to < from ? BAS.si : BAS.no}}>{to < from ? 'baja' : 'sube'}</span>
              <span style={{fontFamily: FONT_SANS, fontSize: 30, color: BAS.onDark, opacity: 0.75, marginLeft: 8}}>{subcaption}</span>
            </div>
          </div>
        </Layer>
      </AbsoluteFill>

      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 115% at 44% 46%, transparent 52%, rgba(2,7,11,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};
