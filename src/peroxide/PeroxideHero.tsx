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
const GOLD = '#F2C24E';
const GOLDLITE = '#FFE39A';
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
   tratada al palette (B&N desaturado, tinte rojo sutil) viéndose a través del vidrio.
   `gold` (0..1) la convierte en una carta DORADA que irradia luz (para "y el número 5"). */
const GlassFace: React.FC<{w: number; h: number; front?: boolean; number?: string; image?: string; gold?: number; goldGlow?: number}> = ({w, h, front, number, image, gold = 0, goldGlow = 0}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 20,
      background: gold > 0
        ? `linear-gradient(135deg, rgba(255,227,154,${0.30 + 0.22 * gold}), rgba(242,194,78,${0.10 + 0.12 * gold}) 55%, rgba(255,227,154,${0.18 + 0.12 * gold}))`
        : 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.12))',
      border: gold > 0.5 ? `2px solid ${GOLDLITE}` : '1.5px solid rgba(255,255,255,0.7)',
      boxShadow: gold > 0
        ? `0 0 ${50 + goldGlow * 90}px ${GOLD}${gold > 0.5 ? 'AA' : '66'}, 0 0 ${120 + goldGlow * 120}px ${GOLD}66, inset 0 1px 0 ${GOLDLITE}`
        : front
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
    {/* baño dorado que sube con `gold` */}
    {gold > 0 && (
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(255,227,154,${0.28 * gold}), rgba(242,194,78,${0.14 * gold}) 60%, rgba(242,194,78,${0.22 * gold}))`, mixBlendMode: 'screen'}} />
    )}
    {number && (
      <div style={{position: 'absolute', left: 24, bottom: 18, fontFamily: F_INTER, fontWeight: 800, fontSize: 46, color: gold > 0.5 ? GOLDLITE : WHITE, textShadow: gold > 0.5 ? `0 0 24px ${GOLD}, 0 2px 8px #000` : `0 0 20px ${RED}, 0 2px 8px #000`}}>
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
  goldCard?: number; // índice de la carta que SOBRESALE y se vuelve DORADA
  goldAt?: number; // frame en que empieza el reveal dorado
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = '9 trucos con agua oxigenada', phrase = 'que los profesionales *no* te cuentan', number = '#1', cards = 9, images, goldCard, goldAt = 40, sfx = true}) => {
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
            // slot final del abanico — MÁS ABIERTO y separado: se lee como baraja 3D
            // clara (antes step 62 → cartas encimadas). Ahora abren en arco amplio.
            const mid = (cards - 1) / 2;
            const off = i - mid; // centrado alrededor del medio
            const fanX = off * 118;
            const fanY = Math.abs(off) * 9 - 10; // leve V (las de los extremos caen)
            const fanZ = -Math.abs(off) * 30;
            const fanRot = off * 12; // abanico simétrico: giran hacia afuera
            // entrada: nace face-on en el centro y rota/desliza a su slot (riffle)
            const x = lerp(0, fanX, appear);
            const yBase = lerp(0, fanY, appear);
            const zBase = lerp(120, fanZ, appear);
            const rotBase = lerp(0, fanRot, appear);
            const mb = (1 - appear) * 34;

            // ── carta DORADA que sobresale del abanico y respira luz ──
            const isGold = goldCard != null && i === goldCard;
            const goldT = isGold ? interpolate(frame, [goldAt, goldAt + 16], [0, 1], CLAMP) : 0;
            const breath = 0.55 + 0.45 * Math.sin(frame / 9);
            const y = yBase - goldT * 150; // sube fuera del abanico
            const z = zBase + goldT * 220; // hacia la cámara
            const rot = lerp(rotBase, 0, goldT); // se endereza y encara
            const gscale = 1 + goldT * 0.14;

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
                  transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rot}deg) scale(${gscale})`,
                  opacity: appear,
                  filter: mb > 0.6 ? `blur(${mb * 0.32}px)` : undefined,
                  zIndex: isGold ? 999 : 100 - Math.abs(off),
                }}
              >
                <GlassFace w={W} h={H} front={i === 0} number={i === 0 ? number : undefined} image={images?.[i]} gold={goldT} goldGlow={goldT * breath} />
              </div>
            );
          })}
        </div>
      </div>

      <KineticCaption eyebrow={eyebrow} phrase={phrase} frame={frame} at={4} x={140} y={116} />

      {sfx && <SfxCue at={10} src={SFX.whoosh} volume={0.4} />}
      {sfx && Array.from({length: cards}).map((_, i) => <SfxCue key={i} at={12 + i * 4} src={SFX.pop1} volume={0.22} />)}
      {sfx && goldCard != null && <SfxCue at={goldAt} src={SFX.sparkleClean} volume={0.5} />}
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

/* ══════════════════════════════════════════════════════════════════════
   5) TYPE CARD BESIDE — tarjeta compacta que hace ZOOM-IN en una ZONA
      (izquierda o derecha) SOBRE el video, SIN oscurecer el fondo (fondo
      transparente, solo la tarjeta con su glow). Va al lado del avatar.
      El texto se revela con TIPEO (carácter por carácter) + SFX de tecla
      por golpe + un sparkleClean al terminar. Rojo/negro/blanco.
   ══════════════════════════════════════════════════════════════════════ */
export const TypeCardBeside: React.FC<{
  durationInFrames: number;
  side?: 'left' | 'right';
  title?: string;
  lines?: string[];
  typeStart?: number; // frame en que arranca el tipeo (tras el zoom-in)
  width?: number;
  sfx?: boolean;
}> = ({durationInFrames, side = 'right', title = 'AGUA OXIGENADA', lines = ['3% · la de farmacia', 'Barata y sin cloro', 'Limpia sin manchar'], typeStart = 12, width = 660, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ZOOM-IN de la tarjeta (con leve overshoot), sin tocar el fondo
  const pop = spring({frame, fps, config: {damping: 13, mass: 0.7, stiffness: 180}});
  const scale = interpolate(pop, [0, 1], [0.72, 1], CLAMP);
  const outFade = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], CLAMP);

  // TIPEO carácter por carácter, línea por línea
  const perChar = 1.6;
  const flat = lines.join('\n');
  const total = flat.length;
  const revealed = Math.max(0, Math.min(total, Math.floor((frame - typeStart) / perChar)));
  const typing = frame >= typeStart && revealed < total;
  const caret = typing && Math.floor(frame / 8) % 2 === 0;

  // reparte `revealed` sobre las líneas
  let acc = 0;
  const shown = lines.map((ln) => {
    const start = acc;
    acc += ln.length + 1; // +1 por el salto
    const take = Math.max(0, Math.min(ln.length, revealed - start));
    return {text: ln.slice(0, take), done: revealed - start >= ln.length};
  });

  // clicks de tecla (con stride para no crear demasiados nodos de audio)
  const stride = Math.max(1, Math.ceil(total / 40));
  const clickIdx: number[] = [];
  for (let i = 0; i < total; i += stride) if (flat[i] !== ' ') clickIdx.push(i);
  const doneAt = typeStart + total * perChar;

  const zoneStyle: React.CSSProperties = side === 'left' ? {left: 96} : {right: 96};

  return (
    <AbsoluteFill style={{background: 'transparent'}}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          ...zoneStyle,
          width,
          transform: `translateY(-50%) scale(${scale})`,
          transformOrigin: side === 'left' ? 'left center' : 'right center',
          opacity: pop * outFade,
        }}
      >
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(160deg, rgba(20,20,22,0.94), rgba(10,10,11,0.96))',
            border: `2px solid ${RED}`,
            borderRadius: 26,
            padding: '34px 40px',
            boxShadow: `0 30px 70px rgba(0,0,0,0.6), 0 0 60px ${RED}44, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* barra de acento roja arriba */}
          <div style={{position: 'absolute', left: 40, top: 22, width: 64, height: 5, borderRadius: 3, background: RED, boxShadow: `0 0 16px ${RED}`}} />
          <div style={{fontFamily: F_INTER, fontWeight: 800, letterSpacing: 3, fontSize: 30, textTransform: 'uppercase', color: WHITE, marginTop: 20, marginBottom: 18, textShadow: `0 0 18px ${RED}66`}}>
            {title}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {shown.map((s, i) => {
              const active = typing && !s.done && (i === 0 || shown[i - 1].done) && s.text.length >= 0 && frame >= typeStart;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, minHeight: 40}}>
                  <div style={{width: 12, height: 12, borderRadius: 3, background: REDLITE, flexShrink: 0, boxShadow: `0 0 12px ${RED}`, opacity: s.text.length > 0 ? 1 : 0.25}} />
                  <div style={{fontFamily: F_INTER, fontWeight: 600, fontSize: 34, color: 'rgba(255,255,255,0.92)', lineHeight: 1.1}}>
                    {s.text}
                    {active && caret && <span style={{display: 'inline-block', width: 3, height: 30, background: RED, marginLeft: 3, transform: 'translateY(4px)'}} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {sfx && clickIdx.map((i) => <SfxCue key={i} at={typeStart + i * perChar} src={SFX.click} volume={0.3} durationInFrames={8} />)}
      {sfx && <SfxCue at={Math.round(doneAt)} src={SFX.sparkleClean} volume={0.4} />}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   6) GLITCH CUT — overlay corto (~0.4s) de glitch SUAVE y elegante para
      cortar entre planos: RGB-split + desplazamiento de scanlines + un
      flash tenue. NO agresivo. Prop `durationInFrames`.
   ══════════════════════════════════════════════════════════════════════ */
export const GlitchCut: React.FC<{
  durationInFrames?: number;
  sfx?: boolean;
}> = ({durationInFrames = 12, sfx = true}) => {
  const frame = useCurrentFrame();
  const prog = Math.max(0, Math.min(1, frame / durationInFrames));
  const env = Math.sin(prog * Math.PI); // sube y baja suave (0→1→0)

  // slices horizontales que se desplazan (pseudo-aleatorio determinista)
  const SLICES = 9;
  const rnd = (k: number) => {
    const s = Math.sin(k * 12.9898 + Math.floor(frame / 2) * 4.1) * 43758.5453;
    return s - Math.floor(s);
  };

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {/* RGB-split: dos velos finos de color desplazados a los lados */}
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${RED}22, transparent 18%, transparent 82%, rgba(80,200,255,0.13))`, transform: `translateX(${env * 10}px)`, opacity: env}} />
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(80,200,255,0.12), transparent 20%, transparent 80%, ${RED}1F)`, transform: `translateX(${-env * 10}px)`, opacity: env}} />

      {/* slices que patinan lateralmente con leve tinte RGB */}
      {Array.from({length: SLICES}).map((_, k) => {
        const y = (k / SLICES) * 100;
        const h = 100 / SLICES;
        const dx = (rnd(k) - 0.5) * 90 * env;
        const on = rnd(k + 7) > 0.45;
        if (!on) return null;
        const tint = k % 2 === 0 ? `${RED}` : 'rgba(80,200,255,1)';
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${y}%`,
              height: `${h}%`,
              transform: `translateX(${dx}px)`,
              background: `linear-gradient(90deg, transparent, ${tint === RED ? 'rgba(228,50,42,0.10)' : 'rgba(80,200,255,0.08)'} 40%, transparent)`,
              opacity: env * 0.9,
              boxShadow: `inset 0 0 0 0.5px ${tint === RED ? 'rgba(228,50,42,0.18)' : 'rgba(80,200,255,0.14)'}`,
            }}
          />
        );
      })}

      {/* scanlines que se desplazan */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 2px, transparent 4px)',
          transform: `translateY(${(frame % 4) - 2}px)`,
          opacity: env * 0.6,
          mixBlendMode: 'screen',
        }}
      />

      {/* flash tenue en el pico */}
      <div style={{position: 'absolute', inset: 0, background: WHITE, opacity: Math.max(0, env - 0.55) * 0.4}} />

      {sfx && <SfxCue at={0} src={SFX.swish} volume={0.3} durationInFrames={durationInFrames + 6} />}
    </AbsoluteFill>
  );
};
