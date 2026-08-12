/**
 * COMPONENTES FIRMA (bespoke) — replican las refs del usuario, adaptados al canal.
 * PALETA: ROJO / NEGRO / BLANCO (premium editorial, pega con las miniaturas).
 *   blanco = vidrio/estela · negro = fondo cine · rojo = acento (#N, énfasis, ON).
 *
 *   • LightTrailCards — baraja de vidrio en ABANICO 3D REAL (perspectiva + rotateY,
 *     nace de a una desde el centro con motion-blur, cámara que orbita/push) sobre
 *     una ESTELA de luz en S con chevrons + "#N" + caption serif-itálica. (ref V1)
 *   • NodeRingToggle  — nodos que BROTAN → ANILLO orbital + TOGGLE off→on. (ref V2)
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from 'remotion';
import {F_PLAYFAIR, F_INTER} from '../VideoEdit/kit/premium/theme';
import {SfxCue, SFX} from '../VideoEdit/components/Sfx';
import {PeroxideBottle} from './PeroxideKit';

const RED = '#E4322A';
const REDLITE = '#FF5A4E';
const WHITE = '#FFFFFF';
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* Caption cinético: eyebrow sans + frase serif con *palabra* en itálica (multi-palabra), palabra x palabra. */
const KineticCaption: React.FC<{
  eyebrow?: string;
  phrase: string;
  frame: number;
  at?: number;
  x?: number;
  y?: number;
  align?: 'left' | 'center';
  accent?: string;
}> = ({eyebrow, phrase, frame, at = 0, x = 130, y = 96, align = 'left', accent = RED}) => {
  const words: {w: string; ital: boolean}[] = [];
  phrase.split('*').forEach((part, pi) => {
    const ital = pi % 2 === 1;
    part.split(/\s+/).filter(Boolean).forEach((w) => words.push({w, ital}));
  });
  const MAXW = 1500;
  const left = align === 'center' ? (1920 - MAXW) / 2 : x;
  const ebOp = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  return (
    <div style={{position: 'absolute', left, top: y, width: MAXW, textAlign: align}}>
      {eyebrow && (
        <div style={{fontFamily: F_INTER, fontWeight: 700, letterSpacing: 4, fontSize: 22, textTransform: 'uppercase', color: accent, opacity: ebOp, marginBottom: 12}}>
          {eyebrow}
        </div>
      )}
      <div style={{fontFamily: F_INTER, fontSize: 48, fontWeight: 600, lineHeight: 1.14, color: WHITE}}>
        {words.map(({w: word, ital}, i) => {
          const wa = at + 6 + i * 4;
          const op = interpolate(frame, [wa, wa + 7], [0, 1], CLAMP);
          const dy = interpolate(frame, [wa, wa + 7], [10, 0], CLAMP);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: 13,
                opacity: op,
                transform: `translateY(${dy}px)`,
                fontFamily: ital ? F_PLAYFAIR : F_INTER,
                fontStyle: ital ? 'italic' : 'normal',
                fontWeight: ital ? 500 : 600,
                color: ital ? WHITE : 'rgba(255,255,255,0.86)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* Una carta de vidrio blanca frosted. Con `image` (opcional) muestra la foto del truco
   tratada al palette (B&N desaturado, tinte rojo sutil) viéndose a través del vidrio. */
const GlassFace: React.FC<{w: number; h: number; front?: boolean; number?: string; image?: string}> = ({w, h, front, number, image}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 20,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.12))',
      border: '1.5px solid rgba(255,255,255,0.7)',
      boxShadow: front
        ? `0 0 46px rgba(255,255,255,0.35), 0 0 90px ${RED}55, inset 0 1px 0 rgba(255,255,255,0.7)`
        : `0 0 26px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.5)`,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* foto del truco, tratada al palette rojo/negro/blanco */}
    {image && (
      <>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${staticFile(image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(1) contrast(1.08) brightness(0.9)',
            opacity: front ? 0.6 : 0.42,
          }}
        />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(228,50,42,0.10), rgba(0,0,0,0.5))`, mixBlendMode: 'multiply'}} />
      </>
    )}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.08))'}} />
    <div style={{position: 'absolute', left: '10%', right: '10%', top: '42%', height: 1.5, background: 'rgba(255,255,255,0.5)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.22) 50%, transparent 58%)'}} />
    {number && (
      <div style={{position: 'absolute', left: 24, bottom: 18, fontFamily: F_INTER, fontWeight: 800, fontSize: 46, color: WHITE, textShadow: `0 0 20px ${RED}, 0 2px 8px #000`}}>
        {number}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   1) LIGHT TRAIL CARDS — baraja de vidrio en ABANICO 3D sobre estela de luz. (ref V1)
   ══════════════════════════════════════════════════════════════════════ */
export const LightTrailCards: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  phrase?: string;
  number?: string;
  cards?: number;
  images?: string[]; // 1 foto por carta (opcional), tratada B&N — la del truco correspondiente
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = '9 trucos con agua oxigenada', phrase = 'que los profesionales *no* te cuentan', number = '#1', cards = 9, images, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const prog = frame / durationInFrames;

  // estela: se dibuja
  const draw = interpolate(frame, [8, 50], [1, 0], CLAMP);
  const trailPath = 'M 120 780 C 480 740, 720 540, 1040 580 S 1560 620, 1880 300';

  // CÁMARA: orbita lenta + push-in (nunca queda quieta)
  const camY = interpolate(prog, [0, 1], [-13, 9], CLAMP);
  const push = interpolate(prog, [0, 1], [0.96, 1.08], CLAMP);
  const camX = interpolate(prog, [0, 1], [3, -4], CLAMP);

  const W = 300;
  const H = 210;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(130% 130% at 50% 34%, #16171A 0%, #070708 55%, #000 100%)'}}>
      {/* "#N" gigante fantasma detrás de la baraja */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
        <div style={{fontFamily: F_INTER, fontWeight: 900, fontSize: 620, color: 'rgba(255,255,255,0.035)', marginTop: 40, letterSpacing: -10}}>{number}</div>
      </div>

      {/* estela de luz (glow blanco + core) */}
      <svg style={{position: 'absolute', inset: 0}} width="1920" height="1080" viewBox="0 0 1920 1080">
        <path d={trailPath} fill="none" stroke={WHITE} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} style={{filter: 'blur(15px)', opacity: 0.55}} />
        <path d={trailPath} fill="none" stroke={REDLITE} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} style={{filter: 'blur(24px)', opacity: 0.28}} />
        <path d={trailPath} fill="none" stroke={WHITE} strokeWidth={3.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} style={{filter: `drop-shadow(0 0 7px ${WHITE})`}} />
        {['M 1770 350 l 44 -32 l -28 48', 'M 300 712 l -44 24 l 46 28'].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={WHITE} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(frame, [34, 48], [0, 0.9], CLAMP)} />
        ))}
      </svg>

      {/* BARAJA 3D — perspectiva + cámara */}
      <div style={{position: 'absolute', inset: 0, perspective: 1500, perspectiveOrigin: '50% 46%'}}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '54%',
            transformStyle: 'preserve-3d',
            transform: `translate(-50%,-50%) rotateX(9deg) rotateY(${camY}deg) rotateZ(${camX}deg) scale(${push})`,
          }}
        >
          {Array.from({length: cards}).map((_, i) => {
            const appear = spring({frame: frame - (10 + i * 4.5), fps, config: {damping: 15, mass: 0.85, stiffness: 150}});
            // slot final del abanico (recede a la derecha, cada vez más de canto)
            const fanX = -230 + i * 62;
            const fanY = -i * 5;
            const fanZ = -i * 34;
            const fanRot = -34 - i * 3.2; // rotateY: más de canto cuanto más atrás
            // entrada: nace face-on en el centro y rota/desliza a su slot (riffle)
            const x = lerp(0, fanX, appear);
            const y = lerp(0, fanY, appear);
            const z = lerp(120, fanZ, appear);
            const rot = lerp(0, fanRot, appear);
            const mb = (1 - appear) * 34;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: -W / 2,
                  top: -H / 2,
                  width: W,
                  height: H,
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rot}deg)`,
                  opacity: appear,
                  filter: mb > 0.6 ? `blur(${mb * 0.32}px)` : undefined,
                  zIndex: 100 - i,
                }}
              >
                <GlassFace w={W} h={H} front={i === 0} number={i === 0 ? number : undefined} image={images?.[i]} />
              </div>
            );
          })}
        </div>
      </div>

      <KineticCaption eyebrow={eyebrow} phrase={phrase} frame={frame} at={4} x={140} y={116} />

      {sfx && <SfxCue at={10} src={SFX.whoosh} volume={0.4} />}
      {sfx && Array.from({length: cards}).map((_, i) => <SfxCue key={i} at={12 + i * 4} src={SFX.pop1} volume={0.22} />)}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   2) NODE RING + TOGGLE — nodos que brotan y arman anillo + toggle off→on. (ref V2)
   Rojo/negro/blanco: nodos blancos, toggle OFF=rojo (sucio) → ON=blanco brillante (limpio).
   ══════════════════════════════════════════════════════════════════════ */
export const NodeRingToggle: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  phrase?: string;
  nodes?: number;
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = 'Antes y después', phrase = 'cómo lo sucio *se limpia*', nodes = 8, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cx = 960;
  const cy = 480;
  const R = 250;

  const toggleStart = Math.round(fps * 1.9);
  const flip = spring({frame: frame - toggleStart, fps, config: {damping: 15, mass: 0.9, stiffness: 120}}); // 0=rojo/off 1=blanco/on
  const ringOut = interpolate(frame, [toggleStart - 6, toggleStart + 12], [1, 0.14], CLAMP);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(130% 130% at 50% 36%, #161719 0%, #070708 55%, #000 100%)'}}>
      {/* bloom central */}
      <div style={{position: 'absolute', left: cx, top: cy, width: 4, height: 4, transform: 'translate(-50%,-50%)'}}>
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 320, height: 320, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${WHITE} 0%, transparent 62%)`, opacity: interpolate(frame, [0, 8, 24], [0.9, 0.6, 0], CLAMP), filter: 'blur(8px)'}} />
      </div>

      {/* NODOS → ANILLO */}
      {Array.from({length: nodes}).map((_, i) => {
        const ang = (i / nodes) * Math.PI * 2 - Math.PI / 2;
        const s = spring({frame: frame - (6 + i * 3), fps, config: {damping: 17, mass: 0.9, stiffness: 130}});
        const rad = R * s;
        const x = cx + Math.cos(ang) * rad;
        const y = cy + Math.sin(ang) * rad;
        const pulse = 0.6 + 0.4 * Math.sin(frame / 7 + i);
        const sz = 46;
        const on = flip > 0.5;
        const col = on ? WHITE : REDLITE;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: sz,
              height: sz,
              transform: `translate(-50%,-50%) scale(${s})`,
              opacity: s * ringOut,
              borderRadius: 12,
              border: `2px solid ${col}`,
              background: on ? 'rgba(255,255,255,0.08)' : 'rgba(228,50,42,0.08)',
              boxShadow: `0 0 ${14 + pulse * 16}px ${col}, inset 0 0 12px ${col}`,
            }}
          />
        );
      })}

      {frame >= toggleStart - 8 && <Toggle cx={cx} cy={cy} flip={flip} />}

      <KineticCaption eyebrow={eyebrow} phrase={phrase} frame={frame} at={Math.round(fps * 0.9)} align="center" y={150} />

      {sfx && <SfxCue at={6} src={SFX.whoosh} volume={0.35} />}
      {sfx && <SfxCue at={toggleStart} src={SFX.capPop} volume={0.5} />}
      {sfx && <SfxCue at={toggleStart + 4} src={SFX.sparkleClean} volume={0.45} />}
    </AbsoluteFill>
  );
};

const Toggle: React.FC<{cx: number; cy: number; flip: number}> = ({cx, cy, flip}) => {
  const W = 300;
  const H = 132;
  const pad = 12;
  const knob = H - pad * 2;
  const on = flip > 0.5;
  const track = on ? WHITE : RED;
  const knobX = interpolate(flip, [0, 1], [pad, W - knob - pad], CLAMP);
  const glow = on ? WHITE : RED;
  return (
    <div style={{position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)'}}>
      <div
        style={{
          position: 'relative',
          width: W,
          height: H,
          borderRadius: H / 2,
          background: on ? 'rgba(255,255,255,0.14)' : 'rgba(228,50,42,0.16)',
          border: `3px solid ${track}`,
          boxShadow: `0 0 46px ${glow}, inset 0 0 30px rgba(0,0,0,0.45)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: pad,
            left: knobX,
            width: knob,
            height: knob,
            borderRadius: '50%',
            background: on ? 'radial-gradient(circle at 35% 30%, #FFFFFF, #C9C9C9)' : 'radial-gradient(circle at 35% 30%, #2A2E33, #0C0E10)',
            boxShadow: `0 6px 14px rgba(0,0,0,0.5), 0 0 22px ${glow}`,
            border: `2px solid ${track}`,
          }}
        />
      </div>
      <div style={{position: 'absolute', left: '50%', top: H + 26, width: W * 0.8, height: 20, transform: 'translateX(-50%)', borderRadius: '50%', background: `radial-gradient(ellipse, ${glow} 0%, transparent 70%)`, opacity: 0.5, filter: 'blur(6px)'}} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   3) BOTTLE HERO — la botella (SVG) en escena cine rojo/negro/blanco:
      rim-light + reflejo + flote + destape con pop. El objeto firma del nicho.
   ══════════════════════════════════════════════════════════════════════ */
export const BottleHero: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  phrase?: string;
  uncap?: boolean; // destapa con pop
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = 'La pieza clave', phrase = 'agua oxigenada al *3%*', uncap = true, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const prog = frame / durationInFrames;

  const enter = spring({frame, fps, config: {damping: 18, mass: 0.9, stiffness: 120}});
  const bob = Math.sin(frame / 22) * 10;
  const tilt = Math.sin(frame / 34) * 2.2;
  const push = interpolate(prog, [0, 1], [0.98, 1.05], CLAMP);

  // destape
  const POP = Math.round(fps * 1.1);
  const lift = uncap ? spring({frame: frame - POP, fps, config: {damping: 9, mass: 0.6, stiffness: 170}}) : 0;
  const capLift = interpolate(lift, [0, 1], [0, 1.1], CLAMP);
  const capSpin = lift * 30;
  const capOp = uncap ? interpolate(frame, [POP + 10, POP + 26], [1, 0], CLAMP) : 1;
  const vapor = uncap ? interpolate(frame, [POP, POP + 32], [0, 1], CLAMP) : 0;

  const BW = 360;
  const bx = 640;
  const by = 560;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 120% at 42% 44%, #1A1012 0%, #0A0708 46%, #000 100%)'}}>
      {/* key glow rojo detrás de la botella */}
      <div style={{position: 'absolute', left: bx, top: by - 30, width: 620, height: 620, transform: `translate(-50%,-50%) scale(${enter})`, borderRadius: '50%', background: `radial-gradient(circle, ${RED}44 0%, ${RED}18 34%, transparent 66%)`, filter: 'blur(6px)'}} />
      <div style={{position: 'absolute', left: bx, top: by - 60, width: 260, height: 520, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 62%)', filter: 'blur(10px)'}} />

      {/* contact shadow */}
      <div style={{position: 'absolute', left: bx, top: by + 210, width: 300, height: 40, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)', opacity: enter}} />

      {/* reflejo (botella espejada, se desvanece) */}
      <div
        style={{
          position: 'absolute',
          left: bx,
          top: by + 220,
          transform: `translate(-50%,0) scaleY(-1)`,
          opacity: enter * 0.22,
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 55%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 55%)',
          filter: 'blur(1.5px)',
        }}
      >
        <PeroxideBottle width={BW} />
      </div>

      {/* BOTELLA */}
      <div
        style={{
          position: 'absolute',
          left: bx,
          top: by,
          transform: `translate(-50%,-50%) translateY(${bob + (1 - enter) * 40}px) rotate(${tilt}deg) scale(${push * (0.9 + enter * 0.1)})`,
          opacity: enter,
          filter: `drop-shadow(0 0 26px ${RED}55) drop-shadow(0 18px 30px rgba(0,0,0,0.55))`,
        }}
      >
        {/* vapor al destapar */}
        <div style={{position: 'absolute', left: '50%', top: -30, transform: 'translateX(-50%)', pointerEvents: 'none'}}>
          {Array.from({length: 5}).map((_, i) => {
            const pp = Math.max(0, vapor - i * 0.12);
            return (
              <div key={i} style={{position: 'absolute', left: (i - 2) * 22, top: -pp * 100, width: 38 + i * 7, height: 38 + i * 7, borderRadius: '50%', background: `rgba(255,255,255,${0.4 * (1 - pp)})`, filter: 'blur(7px)'}} />
            );
          })}
        </div>
        <PeroxideBottle width={BW} capLift={capLift} capSpin={capSpin} capOpacity={capOp} />
      </div>

      <KineticCaption eyebrow={eyebrow} phrase={phrase} frame={frame} at={6} x={1120} y={430} />

      {sfx && uncap && <SfxCue at={POP} src={SFX.capPop} volume={0.8} />}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   4) CHAPTER TRAIL CARD — tarjeta "#N Título" que se dibuja sobre una estela
      de luz neón (ref V3, la del "#10"). Para los 9 capítulos/trucos.
   ══════════════════════════════════════════════════════════════════════ */
export const ChapterTrailCard: React.FC<{
  durationInFrames: number;
  number: string; // "#1"
  title: string;
  sub?: string;
  sfx?: boolean;
}> = ({durationInFrames, number, title, sub, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const prog = frame / durationInFrames;

  const draw = interpolate(frame, [6, 40], [1, 0], CLAMP); // estela
  const cardDraw = interpolate(frame, [16, 44], [1, 0], CLAMP); // borde de la tarjeta
  const push = interpolate(prog, [0, 1], [1.02, 1.07], CLAMP);
  const enter = spring({frame, fps, config: {damping: 18, mass: 0.9, stiffness: 120}});

  const CW = 1040;
  const CH = 300;
  const cx = 960;
  const cy = 540;
  const cardX = cx - CW / 2;
  const cardY = cy - CH / 2;
  const trailPath = 'M 60 700 C 520 660, 700 460, 1000 470 S 1560 500, 1880 250';
  const numPop = spring({frame: frame - 20, fps, config: {damping: 10, mass: 0.7, stiffness: 180}});

  return (
    <AbsoluteFill style={{background: 'radial-gradient(130% 130% at 50% 40%, #161012 0%, #070708 55%, #000 100%)'}}>
      {/* "#N" gigante fantasma */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
        <div style={{fontFamily: F_INTER, fontWeight: 900, fontSize: 640, color: 'rgba(255,255,255,0.03)', letterSpacing: -12}}>{number}</div>
      </div>

      {/* estela de luz */}
      <svg style={{position: 'absolute', inset: 0}} width="1920" height="1080" viewBox="0 0 1920 1080">
        <path d={trailPath} fill="none" stroke={REDLITE} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} style={{filter: 'blur(26px)', opacity: 0.3}} />
        <path d={trailPath} fill="none" stroke={WHITE} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} style={{filter: 'blur(13px)', opacity: 0.5}} />
        <path d={trailPath} fill="none" stroke={WHITE} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} style={{filter: `drop-shadow(0 0 7px ${WHITE})`}} />
      </svg>

      {/* TARJETA */}
      <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${push})`, width: CW, height: CH}}>
        {/* borde que se dibuja */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{position: 'absolute', inset: 0}}>
          <rect x={2} y={2} width={CW - 4} height={CH - 4} rx={28} fill="rgba(255,255,255,0.03)" stroke={rgbaW(0.6)} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={cardDraw} style={{filter: `drop-shadow(0 0 12px ${RED}66)`}} />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
          <div style={{fontFamily: F_INTER, fontWeight: 800, fontSize: 40, color: RED, letterSpacing: 2, transform: `scale(${0.6 + numPop * 0.4})`, textShadow: `0 0 20px ${RED}`}}>{number}</div>
          <div style={{fontFamily: F_INTER, fontWeight: 700, fontSize: 62, color: WHITE, textAlign: 'center', padding: '0 40px', opacity: enter, transform: `translateY(${(1 - enter) * 14}px)`}}>{title}</div>
          {sub && <div style={{fontFamily: F_PLAYFAIR, fontStyle: 'italic', fontSize: 34, color: 'rgba(255,255,255,0.7)', opacity: interpolate(frame, [26, 40], [0, 1], CLAMP)}}>{sub}</div>}
        </div>
      </div>

      {sfx && <SfxCue at={6} src={SFX.whoosh} volume={0.4} />}
      {sfx && <SfxCue at={20} src={SFX.pop1} volume={0.5} />}
    </AbsoluteFill>
  );
};

const rgbaW = (a: number) => `rgba(255,255,255,${a})`;
