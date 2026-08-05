/**
 * RosemaryHero — secuencia premium de motion-design de belleza (canal Dra. Valeria Alcázar).
 * Reimaginación EN NUESTRA PALETA (papel crema · tinta espresso · latón/oro · energía salvia)
 * del trailer "liquid-glass" del romero: 6-9 capas de profundidad, haze volumétrico, partículas,
 * parallax, glass cards frosted 3D, cámara lenta (push/drift/arco) y transiciones fundidas (sin cortes duros).
 *
 * Autocontenida: sólo depende de src/valeria/theme.tsx + 4 assets en public/img/
 *   rosemary_hero_sprig.png · rosemary_hero_card_1..3.jpg
 *
 * Composición limpia registrada en src/index_rosemaryhero.tsx → "Val-RosemaryHero".
 */
import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';
import {
  VAL,
  rgba,
  shade,
  CLAMP,
  FONT_DISPLAY,
  FONT_SERIF,
  FONT_SERIF_FINE,
  FONT_SANS,
  PaperGrain,
  WarmVignette,
} from './theme';

// ── PRNG determinista (sin Math.random para render reproducible) ──────────────
const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const CENTER = {x: 960, y: 540};

// blur-in helper: opacidad + desenfoque de entrada/salida en una ventana [in..hold..out]
const reveal = (
  frame: number,
  inS: number,
  inE: number,
  outS: number,
  outE: number,
) => {
  const o = interpolate(frame, [inS, inE, outS, outE], [0, 1, 1, 0], CLAMP);
  const blur = interpolate(frame, [inS, inE, outS, outE], [10, 0, 0, 10], CLAMP);
  const y = interpolate(frame, [inS, inE], [16, 0], CLAMP);
  return {opacity: o, filter: `blur(${blur}px)`, transform: `translateY(${y}px)`};
};

// ── Partículas de polvo teñidas de oro, en 3 planos de parallax ───────────────
const Particles: React.FC<{count: number; plane: number; camX: number; camY: number}> = ({
  count,
  plane,
  camX,
  camY,
}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const rnd = mulberry32(1000 + plane * 97);
  const items = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rnd() * 1920,
        y0: rnd() * 1080,
        r: 1.4 + rnd() * (plane === 2 ? 5 : plane === 1 ? 3 : 1.8),
        sp: 6 + rnd() * 16 + plane * 6,
        drift: (rnd() - 0.5) * 40,
        a: 0.12 + rnd() * (plane === 2 ? 0.5 : 0.28),
        ph: rnd() * Math.PI * 2,
      });
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, plane]);
  const par = (plane + 1) * 0.5;
  return (
    <AbsoluteFill style={{transform: `translate(${camX * par}px, ${camY * par}px)`}}>
      {items.map((p, i) => {
        const y = ((p.y0 - (frame * p.sp) / 30) % (height + 80) + height + 80) % (height + 80) - 40;
        const x = p.x + Math.sin(frame / 40 + p.ph) * p.drift;
        const tw = 0.6 + 0.4 * Math.sin(frame / 18 + p.ph);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${rgba(VAL.goldLite, p.a * tw)} 0%, ${rgba(
                VAL.gold,
                0,
              )} 70%)`,
              filter: plane === 0 ? 'blur(2px)' : 'none',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── Ramita botánica de línea fina dorada (flourish de esquina) ────────────────
const Sprig: React.FC<{style?: React.CSSProperties; flip?: boolean}> = ({style, flip}) => (
  <svg
    width="360"
    height="140"
    viewBox="0 0 360 140"
    style={{...style, transform: `${style?.transform ?? ''} ${flip ? 'scaleX(-1)' : ''}`}}
  >
    <g fill="none" stroke={rgba(VAL.gold, 0.5)} strokeWidth="1.6" strokeLinecap="round">
      <path d="M10 70 C 120 55, 240 60, 350 40" />
      {Array.from({length: 12}).map((_, i) => {
        const t = i / 11;
        const x = 20 + t * 320;
        const y = 68 - t * 26 + Math.sin(t * 6) * 2;
        const up = i % 2 === 0 ? -1 : 1;
        return <path key={i} d={`M${x} ${y} q ${10 * up} ${18 * up}, ${22 * up} ${24 * up}`} />;
      })}
    </g>
  </svg>
);

// ── Glass card frosted 3D con imagen de belleza + rótulo ──────────────────────
type CardDef = {
  img: string;
  label: string;
  sub: string;
  tx: number; // posición X objetivo (rel. centro)
  ty: number;
  scale: number;
  fromX: number; // origen de entrada (plano de profundidad)
  fromY: number;
  fromZ: number; // escala inicial (más chico = más lejos)
  inS: number;
  rot: number;
};

const GlassCard: React.FC<{def: CardDef; camX: number; camY: number}> = ({def, camX, camY}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - def.inS, fps, config: {damping: 200, mass: 1.1}});
  const x = interpolate(s, [0, 1], [def.fromX, def.tx]);
  const y = interpolate(s, [0, 1], [def.fromY, def.ty]);
  const sc = interpolate(s, [0, 1], [def.fromZ, def.scale]) * (1 + camX * 0.00004);
  const op = interpolate(frame, [def.inS, def.inS + 14], [0, 1], CLAMP);
  // hover suave + micro-rotación (parallax de profundidad con la cámara)
  const hoverY = Math.sin(frame / 34 + def.tx) * 7;
  const par = def.scale; // cards más grandes = más cerca = más parallax
  const W = 300;
  const H = 372;
  return (
    <div
      style={{
        position: 'absolute',
        left: CENTER.x - W / 2 + x + camX * 0.12 * par,
        top: CENTER.y - H / 2 + y + hoverY + camY * 0.12 * par,
        width: W,
        height: H,
        opacity: op,
        transform: `perspective(1400px) scale(${sc}) rotateY(${def.rot - camX * 0.02}deg) rotateX(${
          camY * 0.015
        }deg)`,
        transformStyle: 'preserve-3d',
        borderRadius: 26,
        background: `linear-gradient(150deg, ${rgba(VAL.card, 0.82)} 0%, ${rgba(
          VAL.paperWarm,
          0.66,
        )} 100%)`,
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        border: `1.5px solid ${rgba(VAL.onAccent, 0.75)}`,
        boxShadow: `0 34px 70px ${rgba(VAL.ink, 0.26)}, 0 6px 18px ${rgba(
          VAL.ink,
          0.16,
        )}, inset 0 1px 0 ${rgba(VAL.onAccent, 0.9)}, inset 0 0 0 1px ${rgba(VAL.gold, 0.12)}`,
        overflow: 'hidden',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* sheen diagonal (reflejo de vidrio) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(115deg, ${rgba(VAL.onAccent, 0.5)} 0%, ${rgba(
            VAL.onAccent,
            0,
          )} 26%, ${rgba(VAL.onAccent, 0)} 70%, ${rgba(VAL.onAccent, 0.22)} 100%)`,
          pointerEvents: 'none',
        }}
      />
      {/* ventana de imagen (piel), recorte al ras + grade cálido */}
      <div
        style={{
          position: 'relative',
          height: 232,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: `inset 0 0 0 1px ${rgba(VAL.gold, 0.22)}`,
        }}
      >
        <Img
          src={staticFile(def.img)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.35)',
            filter: 'saturate(0.82) contrast(1.02)',
          }}
        />
        {/* multiply cálido para unir a la paleta */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'multiply',
            background: `linear-gradient(160deg, ${rgba(VAL.gold, 0.28)}, ${rgba(
              VAL.paperDeep,
              0.34,
            )})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, transparent 55%, ${rgba(VAL.card, 0.55)} 100%)`,
          }}
        />
      </div>
      <div style={{paddingLeft: 4}}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 27,
            fontWeight: 600,
            color: VAL.ink,
            lineHeight: 1.05,
          }}
        >
          {def.label}
        </div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 15.5,
            color: VAL.ink2,
            marginTop: 5,
            lineHeight: 1.28,
          }}
        >
          {def.sub}
        </div>
      </div>
    </div>
  );
};

// ── Energía salvia→oro que fluye del romero hacia las tarjetas ────────────────
const EnergyFlow: React.FC<{cards: CardDef[]; camX: number; camY: number}> = ({cards, camX, camY}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [188, 214], [0, 1], CLAMP);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 12);
  if (appear <= 0) return null;
  return (
    <AbsoluteFill style={{transform: `translate(${camX * 0.9}px, ${camY * 0.9}px)`}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="rh-energy" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={rgba(VAL.sage, 0)} />
            <stop offset="45%" stopColor={rgba(shade(VAL.sage, 0.25), 0.9 * appear)} />
            <stop offset="100%" stopColor={rgba(VAL.goldLite, 0.95 * appear)} />
          </linearGradient>
          <filter id="rh-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {cards.map((c, i) => {
          const ex = CENTER.x + c.tx;
          const ey = CENTER.y + c.ty;
          const mx = (CENTER.x + ex) / 2 + Math.sin(frame / 22 + i) * 40;
          const my = (CENTER.y + ey) / 2 - 90 - i * 26;
          const dash = 22 + pulse * 10;
          return (
            <path
              key={i}
              d={`M${CENTER.x} ${CENTER.y} Q ${mx} ${my}, ${ex} ${ey}`}
              fill="none"
              stroke="url(#rh-energy)"
              strokeWidth={2.4 + pulse * 1.6}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${dash * 0.9}`}
              strokeDashoffset={-frame * 3.2}
              filter="url(#rh-glow)"
              opacity={appear}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ── HERO rosemary sprig con halo ──────────────────────────────────────────────
const Hero: React.FC<{camX: number; camY: number}> = ({camX, camY}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 4, fps, config: {damping: 200, mass: 1.4}});
  const inScale = interpolate(s, [0, 1], [0.86, 1]);
  const float = Math.sin(frame / 40) * 12;
  const tilt = Math.sin(frame / 70) * 2.2;
  const glowPulse = 0.62 + 0.38 * Math.sin(frame / 26);
  // se encoge un toque hacia el frame final para dejar respirar el texto
  const climax = interpolate(frame, [250, 300], [1, 0.92], CLAMP);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${camX * 0.5}px, ${camY * 0.5 + float}px)`,
      }}
    >
      {/* halo salvia/oro */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${rgba(shade(VAL.sage, 0.4), 0.28 * glowPulse)} 0%, ${rgba(
            VAL.goldLite,
            0.14 * glowPulse,
          )} 34%, ${rgba(VAL.paper, 0)} 66%)`,
          filter: 'blur(8px)',
        }}
      />
      <Img
        src={staticFile('img/rosemary_hero_sprig.png')}
        style={{
          width: 760,
          transform: `scale(${inScale * climax}) rotate(${-8 + tilt}deg)`,
          opacity: interpolate(frame, [0, 20], [0, 1], CLAMP),
          filter: `drop-shadow(0 24px 44px ${rgba(VAL.ink, 0.34)}) drop-shadow(0 0 26px ${rgba(
            VAL.sage,
            0.24 * glowPulse,
          )})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Bloque de texto central (reveals progresivos) ─────────────────────────────
const CenterText: React.FC<{
  text: string;
  inS: number;
  inE: number;
  outS: number;
  outE: number;
  size: number;
  font: string;
  color?: string;
  italic?: boolean;
  y?: number;
}> = ({text, inS, inE, outS, outE, size, font, color = VAL.ink, italic, y = 360}) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, inS, inE, outS, outE);
  if (r.opacity <= 0.001) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center'}}>
      <div
        style={{
          marginTop: y,
          ...r,
          fontFamily: font,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: size,
          fontWeight: 600,
          color,
          textShadow: `0 2px 10px ${rgba(VAL.paper, 0.8)}`,
          letterSpacing: 0.3,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ── Escena completa ───────────────────────────────────────────────────────────
export const RosemaryHero: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Cámara: push-in lento + drift lateral + micro-arco (aplicada a fondo/midground)
  const push = interpolate(frame, [0, durationInFrames], [1.0, 1.06], CLAMP);
  const camX = Math.sin(frame / 90) * 26; // drift lateral
  const camY = Math.cos(frame / 120) * 14;

  const cards: CardDef[] = [
    {
      img: 'img/rosemary_hero_card_1.jpg',
      label: 'Brillo natural',
      sub: 'La piel refleja la luz, luminosa y descansada.',
      tx: -560,
      ty: -30,
      scale: 1.0,
      fromX: -820,
      fromY: 120,
      fromZ: 0.6,
      inS: 96,
      rot: 10,
    },
    {
      img: 'img/rosemary_hero_card_2.jpg',
      label: 'Textura más suave',
      sub: 'El cutis se siente terso, parejo y pulido.',
      tx: 560,
      ty: -110,
      scale: 0.94,
      fromX: 860,
      fromY: -60,
      fromZ: 0.55,
      inS: 132,
      rot: -11,
    },
    {
      img: 'img/rosemary_hero_card_3.jpg',
      label: 'Apariencia más firme',
      sub: 'El contorno se ve sostenido, con mejor tono.',
      tx: 500,
      ty: 200,
      scale: 1.02,
      fromX: 780,
      fromY: 360,
      fromZ: 0.6,
      inS: 166,
      rot: -8,
    },
  ];

  // Al clímax las tarjetas se atenúan para converger al frame héroe final
  const cardsFade = interpolate(frame, [252, 292], [1, 0], CLAMP);

  const fadeIn = interpolate(frame, [0, 18], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: VAL.paper}}>
      {/* CAPA 1 · fondo crema con haze volumétrico (parallax lento) */}
      <AbsoluteFill
        style={{
          transform: `scale(${push}) translate(${camX * 0.25}px, ${camY * 0.25}px)`,
          background: `radial-gradient(125% 120% at 50% 34%, ${VAL.card} 0%, ${VAL.paperWarm} 46%, ${VAL.paperDeep} 100%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 1200,
            height: 1200,
            left: 120,
            top: -260,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(VAL.goldLite, 0.2)} 0%, ${rgba(
              VAL.gold,
              0,
            )} 62%)`,
            filter: 'blur(24px)',
            transform: `translate(${camX * 0.6}px, ${camY * 0.6}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 1000,
            height: 1000,
            right: 40,
            bottom: -220,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(shade(VAL.sage, 0.35), 0.16)} 0%, ${rgba(
              VAL.sage,
              0,
            )} 60%)`,
            filter: 'blur(26px)',
            transform: `translate(${-camX * 0.5}px, ${-camY * 0.5}px)`,
          }}
        />
      </AbsoluteFill>

      {/* flourishes botánicos dorados en esquinas */}
      <AbsoluteFill style={{opacity: 0.7 * fadeIn}}>
        <Sprig style={{position: 'absolute', left: -20, top: 40, transform: 'rotate(-6deg)'}} />
        <Sprig
          flip
          style={{position: 'absolute', right: -20, bottom: 40, transform: 'rotate(-6deg)'}}
        />
      </AbsoluteFill>

      {/* CAPA 2 · partículas lejanas */}
      <Particles count={26} plane={0} camX={camX} camY={camY} />

      {/* CAPA 3 · tarjetas traseras (fuera de foco, sin rótulo) */}
      <AbsoluteFill style={{filter: 'blur(6px)', opacity: 0.5 * fadeIn * cardsFade}}>
        {[
          {x: -430, y: 250, s: 0.7, r: 8},
          {x: 610, y: 60, s: 0.66, r: -9},
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: CENTER.x - 150 + b.x + camX * 0.05,
              top: CENTER.y - 186 + b.y + Math.sin(frame / 40 + i) * 6,
              width: 300,
              height: 372,
              borderRadius: 26,
              transform: `scale(${b.s}) rotateY(${b.r}deg)`,
              background: `linear-gradient(150deg, ${rgba(VAL.card, 0.6)}, ${rgba(
                VAL.paperWarm,
                0.4,
              )})`,
              border: `1.5px solid ${rgba(VAL.onAccent, 0.5)}`,
              boxShadow: `0 30px 60px ${rgba(VAL.ink, 0.2)}`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* CAPA 4 · energía romero→tarjetas (detrás del héroe) */}
      <EnergyFlow cards={cards} camX={camX} camY={camY} />

      {/* CAPA 5 · HERO rosemary */}
      <Hero camX={camX} camY={camY} />

      {/* CAPA 6 · partículas medias (delante del héroe, parallax mayor) */}
      <Particles count={20} plane={1} camX={camX} camY={camY} />

      {/* CAPA 7 · glass cards con rótulo */}
      <AbsoluteFill style={{opacity: cardsFade}}>
        {cards.map((c, i) => (
          <GlassCard key={i} def={c} camX={camX} camY={camY} />
        ))}
      </AbsoluteFill>

      {/* CAPA 8 · partículas cercanas grandes (bokeh) */}
      <Particles count={9} plane={2} camX={camX} camY={camY} />

      {/* CAPA 9 · textos progresivos */}
      <CenterText
        text="El romero…"
        inS={10}
        inE={30}
        outS={54}
        outE={72}
        size={62}
        font={FONT_DISPLAY}
        y={300}
      />
      <CenterText
        text="puede hacerte ver"
        inS={72}
        inE={92}
        outS={116}
        outE={134}
        size={52}
        font={FONT_SERIF_FINE}
        color={VAL.ink2}
        italic
        y={318}
      />
      <CenterText
        text="más luminosa"
        inS={134}
        inE={156}
        outS={196}
        outE={216}
        size={72}
        font={FONT_DISPLAY}
        color={VAL.gold}
        y={300}
      />

      {/* FRAME HÉROE FINAL · "ROMERO" + tagline */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            marginTop: 250,
            textAlign: 'center',
            opacity: interpolate(frame, [256, 282], [0, 1], CLAMP),
            transform: `translateY(${interpolate(frame, [256, 282], [18, 0], CLAMP)}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 17,
              letterSpacing: 9,
              color: VAL.gold,
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Dra. Valeria Alcázar
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: 14,
              color: VAL.ink,
              lineHeight: 1,
            }}
          >
            ROMERO
          </div>
          <div style={{width: 220, height: 1, background: rgba(VAL.gold, 0.6), margin: '18px auto'}} />
          <div
            style={{
              fontFamily: FONT_SERIF_FINE,
              fontStyle: 'italic',
              fontSize: 30,
              color: VAL.ink2,
            }}
          >
            el secreto botánico de una piel luminosa
          </div>
        </div>
      </AbsoluteFill>

      {/* textura + viñeta cálida (encima de todo, sutil) */}
      <PaperGrain opacity={0.05} />
      <WarmVignette strength={0.24} />
    </AbsoluteFill>
  );
};

export default RosemaryHero;
