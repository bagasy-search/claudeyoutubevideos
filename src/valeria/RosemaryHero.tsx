/**
 * RosemaryHero — secuencia premium de motion-design de belleza (canal Dra. Valeria Alcázar).
 * v2 — DINÁMICA: cámara en movimiento continuo, romero que rota/deriva, glass cards que entran
 * con fuerza y flotan con parallax, bokeh de primer plano, rayos de luz que barren, energía
 * salvia→oro que fluye. Paleta CREMA del canal (papel · tinta espresso · latón). Sin texto-IA.
 *
 * Autocontenida: sólo depende de src/valeria/theme.tsx + 4 assets en public/img/
 *   rosemary_hero_sprig.png · rosemary_hero_card_1..3.jpg
 * Composición limpia en src/index_rosemaryhero.tsx → "Val-RosemaryHero".
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
  Easing,
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

const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const CX = 960;
const CY = 540;

// ── Cámara global: push + drift + arco, con un empujón al clímax ──────────────
const useCamera = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const basePush = interpolate(frame, [0, durationInFrames], [1.02, 1.09], CLAMP);
  const climaxPush = interpolate(frame, [230, 300], [0, 0.05], CLAMP);
  const push = basePush + climaxPush;
  const x = Math.sin(frame / 62) * 46 + Math.sin(frame / 23) * 10;
  const y = Math.cos(frame / 78) * 26;
  const rot = Math.sin(frame / 96) * 1.4;
  return {push, x, y, rot};
};

// ── Partículas de polvo doradas en planos de parallax ─────────────────────────
const Particles: React.FC<{count: number; plane: number; cam: {x: number; y: number}}> = ({
  count,
  plane,
  cam,
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
        r: 1.4 + rnd() * (plane === 2 ? 9 : plane === 1 ? 3.4 : 1.8),
        sp: 10 + rnd() * 22 + plane * 12,
        drift: (rnd() - 0.5) * 90,
        a: 0.12 + rnd() * (plane === 2 ? 0.55 : 0.3),
        ph: rnd() * Math.PI * 2,
      });
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, plane]);
  const par = (plane + 1) * 0.7;
  return (
    <AbsoluteFill style={{transform: `translate(${cam.x * par}px, ${cam.y * par}px)`}}>
      {items.map((p, i) => {
        const y =
          ((p.y0 - (frame * p.sp) / 30) % (height + 120) + height + 120) % (height + 120) - 60;
        const x = p.x + Math.sin(frame / 34 + p.ph) * p.drift;
        const tw = 0.55 + 0.45 * Math.sin(frame / 14 + p.ph);
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
              filter: plane === 2 ? 'blur(6px)' : plane === 0 ? 'blur(2px)' : 'none',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── Rayo de luz cálido que barre lento ────────────────────────────────────────
const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = interpolate(frame, [0, 300], [-18, 22], CLAMP);
  const op = 0.14 + 0.06 * Math.sin(frame / 40);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <div
        style={{
          position: 'absolute',
          left: CX - 200,
          top: -400,
          width: 400,
          height: 2000,
          transformOrigin: 'top center',
          transform: `rotate(${rot}deg)`,
          background: `linear-gradient(90deg, ${rgba(VAL.goldLite, 0)} 0%, ${rgba(
            VAL.goldLite,
            op,
          )} 50%, ${rgba(VAL.goldLite, 0)} 100%)`,
          filter: 'blur(24px)',
        }}
      />
    </AbsoluteFill>
  );
};

// ── Ramita botánica de línea dorada (flourish de esquina) ─────────────────────
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

// ── Glass card frosted 3D con imagen de belleza (grade cálido que unifica) ─────
type CardDef = {
  img: string;
  label?: string;
  sub?: string;
  tx: number;
  ty: number;
  scale: number;
  fromScale: number;
  inS: number;
  rot: number;
  hoverAmp: number;
  hoverPh: number;
  small?: boolean;
};

const GlassCard: React.FC<{def: CardDef; cam: {x: number; y: number}}> = ({def, cam}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // entrada dramática desde profundidad con overshoot
  const s = spring({frame: frame - def.inS, fps, config: {damping: 13, mass: 0.8, stiffness: 90}});
  const sc = interpolate(s, [0, 1], [def.fromScale, def.scale]);
  const rotY = interpolate(s, [0, 1], [def.rot * 3.4, def.rot]);
  const op = interpolate(frame, [def.inS, def.inS + 12], [0, 1], CLAMP);
  const hover = Math.sin(frame / 30 + def.hoverPh) * def.hoverAmp;
  const wob = Math.sin(frame / 44 + def.hoverPh) * 2.4;
  const par = def.scale;
  const sheen = interpolate((frame + def.hoverPh * 30) % 150, [0, 150], [-140, 260]);
  const W = def.small ? 190 : 300;
  const H = def.small ? 236 : 372;
  return (
    <div
      style={{
        position: 'absolute',
        left: CX - W / 2 + def.tx + cam.x * 0.14 * par,
        top: CY - H / 2 + def.ty + hover + cam.y * 0.14 * par,
        width: W,
        height: H,
        opacity: op,
        transform: `perspective(1300px) scale(${sc}) rotateY(${rotY + wob - cam.x * 0.02}deg) rotateX(${
          -cam.y * 0.02
        }deg)`,
        transformStyle: 'preserve-3d',
        borderRadius: 24,
        background: `linear-gradient(150deg, ${rgba(VAL.card, 0.9)} 0%, ${rgba(
          VAL.paperWarm,
          0.74,
        )} 100%)`,
        backdropFilter: 'blur(9px)',
        WebkitBackdropFilter: 'blur(9px)',
        border: `1.5px solid ${rgba(VAL.onAccent, 0.85)}`,
        boxShadow: `0 40px 80px ${rgba(VAL.ink, 0.3)}, 0 8px 22px ${rgba(
          VAL.ink,
          0.18,
        )}, inset 0 1.5px 0 ${rgba(VAL.onAccent, 0.95)}, inset 0 0 0 1px ${rgba(VAL.gold, 0.16)}`,
        overflow: 'hidden',
        padding: def.small ? 10 : 15,
        display: 'flex',
        flexDirection: 'column',
        gap: def.small ? 0 : 10,
      }}
    >
      {/* sheen que se mueve (reflejo de vidrio) */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          bottom: -40,
          left: sheen,
          width: 120,
          background: `linear-gradient(105deg, ${rgba(VAL.onAccent, 0)} 0%, ${rgba(
            VAL.onAccent,
            0.5,
          )} 50%, ${rgba(VAL.onAccent, 0)} 100%)`,
          transform: 'skewX(-14deg)',
          pointerEvents: 'none',
        }}
      />
      {/* ventana de imagen (piel) recortada al ras + grade cálido que MATA el fondo frío */}
      <div
        style={{
          position: 'relative',
          height: def.small ? '100%' : 232,
          borderRadius: 15,
          overflow: 'hidden',
          boxShadow: `inset 0 0 0 1px ${rgba(VAL.gold, 0.24)}`,
        }}
      >
        <Img
          src={staticFile(def.img)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 32%',
            transform: 'scale(1.55)',
            filter: 'saturate(0.7) contrast(1.04) brightness(1.02)',
          }}
        />
        {/* recolor cálido total (blend 'color') → unifica cualquier fondo a la paleta */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'color',
            background: rgba(VAL.gold, 0.45),
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'multiply',
            background: `linear-gradient(160deg, ${rgba(VAL.gold, 0.22)}, ${rgba(
              VAL.paperDeep,
              0.3,
            )})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, transparent 52%, ${rgba(VAL.card, 0.6)} 100%)`,
          }}
        />
      </div>
      {def.label && (
        <div style={{paddingLeft: 4}}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 26,
              fontWeight: 600,
              color: VAL.ink,
              lineHeight: 1.04,
            }}
          >
            {def.label}
          </div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 15,
              color: VAL.ink2,
              marginTop: 4,
              lineHeight: 1.26,
            }}
          >
            {def.sub}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Energía salvia→oro que fluye del romero hacia las tarjetas ────────────────
const EnergyFlow: React.FC<{targets: {x: number; y: number}[]; cam: {x: number; y: number}}> = ({
  targets,
  cam,
}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [150, 196], [0, 1], CLAMP);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);
  if (appear <= 0) return null;
  return (
    <AbsoluteFill style={{transform: `translate(${cam.x * 0.9}px, ${cam.y * 0.9}px)`}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="rh-energy" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={rgba(VAL.sage, 0)} />
            <stop offset="40%" stopColor={rgba(shade(VAL.sage, 0.25), 0.9 * appear)} />
            <stop offset="100%" stopColor={rgba(VAL.goldLite, 0.98 * appear)} />
          </linearGradient>
          <filter id="rh-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {targets.map((t, i) => {
          const ex = CX + t.x;
          const ey = CY + t.y;
          const mx = (CX + ex) / 2 + Math.sin(frame / 18 + i) * 60;
          const my = (CY + ey) / 2 - 100 - i * 22;
          const dash = 24 + pulse * 12;
          return (
            <path
              key={i}
              d={`M${CX} ${CY} Q ${mx} ${my}, ${ex} ${ey}`}
              fill="none"
              stroke="url(#rh-energy)"
              strokeWidth={2.6 + pulse * 1.8}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${dash}`}
              strokeDashoffset={-frame * 5}
              filter="url(#rh-glow)"
              opacity={appear}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ── HERO rosemary sprig: rota, deriva, respira, con halo pulsante ─────────────
const Hero: React.FC<{cam: {x: number; y: number}}> = ({cam}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 2, fps, config: {damping: 40, mass: 1.6, stiffness: 60}});
  const inScale = interpolate(s, [0, 1], [0.7, 1]);
  const spin = -8 + Math.sin(frame / 55) * 6 + frame * 0.05; // deriva rotacional continua
  const bob = Math.sin(frame / 32) * 20;
  const driftX = Math.sin(frame / 70) * 30;
  const breathe = 1 + Math.sin(frame / 46) * 0.03;
  const glow = 0.6 + 0.4 * Math.sin(frame / 22);
  const climax = interpolate(frame, [244, 300], [1, 0.9], CLAMP);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${cam.x * 0.55 + driftX}px, ${cam.y * 0.55 + bob}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${rgba(shade(VAL.sage, 0.42), 0.3 * glow)} 0%, ${rgba(
            VAL.goldLite,
            0.16 * glow,
          )} 32%, ${rgba(VAL.paper, 0)} 64%)`,
          filter: 'blur(10px)',
        }}
      />
      <Img
        src={staticFile('img/rosemary_hero_sprig.png')}
        style={{
          width: 820,
          transform: `scale(${inScale * breathe * climax}) rotate(${spin}deg)`,
          opacity: interpolate(frame, [0, 16], [0, 1], CLAMP),
          filter: `drop-shadow(0 26px 48px ${rgba(VAL.ink, 0.36)}) drop-shadow(0 0 30px ${rgba(
            VAL.sage,
            0.28 * glow,
          )})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Texto central kinético (slide + blur + scale) ─────────────────────────────
const KineticText: React.FC<{
  text: string;
  inS: number;
  outS: number;
  size: number;
  font: string;
  color?: string;
  italic?: boolean;
  y?: number;
}> = ({text, inS, outS, size, font, color = VAL.ink, italic, y = 300}) => {
  const frame = useCurrentFrame();
  const inO = interpolate(frame, [inS, inS + 16], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const outO = interpolate(frame, [outS, outS + 16], [1, 0], CLAMP);
  const op = Math.min(inO, outO);
  if (op <= 0.001) return null;
  const slide = interpolate(frame, [inS, inS + 16], [40, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const blur = interpolate(frame, [inS, inS + 16], [12, 0], CLAMP);
  const sc = interpolate(frame, [inS, inS + 16], [0.94, 1], CLAMP);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center'}}>
      <div
        style={{
          marginTop: y,
          opacity: op,
          filter: `blur(${blur}px)`,
          transform: `translateY(${slide}px) scale(${sc})`,
          fontFamily: font,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: size,
          fontWeight: 600,
          color,
          textShadow: `0 2px 14px ${rgba(VAL.paper, 0.85)}`,
          letterSpacing: 0.3,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const RosemaryHero: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCamera();

  const cards: CardDef[] = [
    // 3 tarjetas con rótulo — rodean al romero
    {img: 'img/rosemary_hero_card_1.jpg', label: 'Brillo natural', sub: 'La piel refleja la luz, luminosa y descansada.', tx: -560, ty: -40, scale: 1.0, fromScale: 0.35, inS: 78, rot: 12, hoverAmp: 14, hoverPh: 0.5},
    {img: 'img/rosemary_hero_card_2.jpg', label: 'Textura más suave', sub: 'El cutis se siente terso, parejo y pulido.', tx: 560, ty: -120, scale: 0.95, fromScale: 0.32, inS: 108, rot: -12, hoverAmp: 16, hoverPh: 2.1},
    {img: 'img/rosemary_hero_card_3.jpg', label: 'Apariencia más firme', sub: 'El contorno se ve sostenido, con mejor tono.', tx: 520, ty: 210, scale: 1.02, fromScale: 0.34, inS: 138, rot: -9, hoverAmp: 15, hoverPh: 3.6},
    // 2 satélites chicas (solo imagen) para densidad alrededor
    {img: 'img/rosemary_hero_card_2.jpg', tx: -470, ty: 250, scale: 0.9, fromScale: 0.3, inS: 122, rot: 9, hoverAmp: 18, hoverPh: 4.4, small: true},
    {img: 'img/rosemary_hero_card_3.jpg', tx: 300, ty: -300, scale: 0.82, fromScale: 0.28, inS: 152, rot: -8, hoverAmp: 20, hoverPh: 1.2, small: true},
  ];
  const energyTargets = cards.map((c) => ({x: c.tx, y: c.ty}));

  const cardsFade = interpolate(frame, [252, 292], [1, 0], CLAMP);
  const fadeIn = interpolate(frame, [0, 16], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: VAL.paper}}>
      {/* CAPA 1 · fondo crema + haze volumétrico en movimiento */}
      <AbsoluteFill
        style={{
          transform: `scale(${cam.push}) translate(${cam.x * 0.25}px, ${cam.y * 0.25}px) rotate(${
            cam.rot * 0.2
          }deg)`,
          background: `radial-gradient(125% 120% at 50% 34%, ${VAL.card} 0%, ${VAL.paperWarm} 46%, ${VAL.paperDeep} 100%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 1300,
            height: 1300,
            left: 60 + Math.sin(frame / 50) * 40,
            top: -300 + Math.cos(frame / 60) * 30,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(VAL.goldLite, 0.22)} 0%, ${rgba(
              VAL.gold,
              0,
            )} 62%)`,
            filter: 'blur(26px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 1100,
            height: 1100,
            right: -40 - Math.sin(frame / 55) * 40,
            bottom: -240,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(shade(VAL.sage, 0.35), 0.18)} 0%, ${rgba(
              VAL.sage,
              0,
            )} 60%)`,
            filter: 'blur(28px)',
          }}
        />
      </AbsoluteFill>

      <LightSweep />

      {/* flourishes botánicos */}
      <AbsoluteFill style={{opacity: 0.65 * fadeIn}}>
        <Sprig style={{position: 'absolute', left: -20, top: 30, transform: 'rotate(-6deg)'}} />
        <Sprig flip style={{position: 'absolute', right: -20, bottom: 30, transform: 'rotate(-6deg)'}} />
      </AbsoluteFill>

      {/* CAPA 2 · partículas lejanas */}
      <Particles count={30} plane={0} cam={cam} />

      {/* CAPA 3 · energía (detrás del héroe) */}
      <EnergyFlow targets={energyTargets} cam={cam} />

      {/* CAPA 4 · HERO */}
      <Hero cam={cam} />

      {/* CAPA 5 · partículas medias */}
      <Particles count={22} plane={1} cam={cam} />

      {/* CAPA 6 · glass cards */}
      <AbsoluteFill style={{opacity: cardsFade}}>
        {cards.map((c, i) => (
          <GlassCard key={i} def={c} cam={cam} />
        ))}
      </AbsoluteFill>

      {/* CAPA 7 · bokeh cercano grande (fuerte parallax = sensación de movimiento) */}
      <Particles count={8} plane={2} cam={cam} />

      {/* CAPA 8 · textos kinéticos */}
      <KineticText text="El romero…" inS={8} outS={52} size={64} font={FONT_DISPLAY} y={286} />
      <KineticText text="puede hacerte ver" inS={62} outS={110} size={52} font={FONT_SERIF_FINE} color={VAL.ink2} italic y={308} />
      <KineticText text="más luminosa" inS={120} outS={196} size={76} font={FONT_DISPLAY} color={VAL.gold} y={288} />

      {/* FRAME HÉROE FINAL */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            marginTop: 250,
            textAlign: 'center',
            opacity: interpolate(frame, [254, 280], [0, 1], CLAMP),
            transform: `translateY(${interpolate(frame, [254, 280], [24, 0], CLAMP)}px)`,
          }}
        >
          <div style={{fontFamily: FONT_SANS, fontSize: 17, letterSpacing: 9, color: VAL.gold, textTransform: 'uppercase', marginBottom: 6}}>
            Dra. Valeria Alcázar
          </div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 98, fontWeight: 700, letterSpacing: 14, color: VAL.ink, lineHeight: 1}}>
            ROMERO
          </div>
          <div style={{width: 230, height: 1, background: rgba(VAL.gold, 0.6), margin: '18px auto'}} />
          <div style={{fontFamily: FONT_SERIF_FINE, fontStyle: 'italic', fontSize: 30, color: VAL.ink2}}>
            el secreto botánico de una piel luminosa
          </div>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.05} />
      <WarmVignette strength={0.24} />
    </AbsoluteFill>
  );
};

export default RosemaryHero;
