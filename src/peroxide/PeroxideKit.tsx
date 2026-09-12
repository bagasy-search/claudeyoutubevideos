/**
 * KIT DE COMPONENTES — nicho AGUA OXIGENADA / HYDROGEN PEROXIDE TRICKS.
 * Reusable por TEMA (canal EN + canal ES con otros avatares). Todo sale del theme.
 *
 * Componentes firma:
 *   • PeroxideBottle  — el prop héroe (botella ámbar, etiqueta, tapa azul). Parametrizable.
 *   • BottleUncap     — la tapa se destapa y salta con "pop" + vapor. Abre un truco.
 *   • GluGluPour      — la botella se inclina y vierte con glú-glú a un vaso/superficie.
 *   • FoamClean       — se echa peróxido, la espuma CRECE y limpia la mugre + sello "LIMPIO".
 *   • TrickCard       — tarjeta "TRUCO #N" con la botella, número gigante y titular.
 *
 * Reglas: motion con spring/interpolate, SFX vía SfxCue (roles capPop/gluglu/fizz),
 * alto contraste, nada de texto quemado en campos de imagen.
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import {SfxCue, SFX} from '../VideoEdit/components/Sfx';
import {
  PX,
  FONT_DISPLAY,
  FONT_SANS,
  FONT_HAND,
  CLAMP,
  spr,
  rgba,
  shade,
  TileBg,
  SparkleLayer,
  cleanBg,
  CARD_SHADOW,
  BLUE_GLOW,
} from './theme';

/* ────────────────────────────────────────────────────────────────────────
   PROP HÉROE — La botella de agua oxigenada (SVG, parametrizable)
   capLift   : 0..1  cuánto se separó la tapa (para el destape)
   capSpin   : grados que gira la tapa al saltar
   fill      : 0..1  nivel de líquido dentro
   labelText : texto de la etiqueta chica (default "H₂O₂")
   ──────────────────────────────────────────────────────────────────────── */
export const PeroxideBottle: React.FC<{
  width?: number;
  capLift?: number; // 0 = cerrada, 1 = tapa despegada ~120px arriba
  capSpin?: number;
  capOpacity?: number;
  fill?: number;
  labelText?: string;
  shine?: boolean;
}> = ({width = 240, capLift = 0, capSpin = 0, capOpacity = 1, fill = 0.82, labelText = 'H₂O₂', shine = true}) => {
  const W = 200;
  const H = 380;
  const bodyTop = 118; // donde empieza el cuerpo ámbar
  const bodyBot = 356;
  const bodyH = bodyBot - bodyTop;
  const liquidTop = bodyBot - bodyH * Math.max(0.06, Math.min(1, fill));
  const capY = -capLift * 118;

  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', display: 'block'}}>
      <defs>
        <linearGradient id="pxGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PX.amberLo} />
          <stop offset="0.22" stopColor={PX.amber} />
          <stop offset="0.5" stopColor={PX.amberHi} />
          <stop offset="0.72" stopColor={PX.amber} />
          <stop offset="1" stopColor={PX.amberLo} />
        </linearGradient>
        <linearGradient id="pxCap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={shade(PX.blueDeep, -0.1)} />
          <stop offset="0.5" stopColor={PX.blue} />
          <stop offset="1" stopColor={PX.blueDeep} />
        </linearGradient>
        <linearGradient id="pxLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(PX.liquid, 0.95)} />
          <stop offset="1" stopColor={rgba('#EDE7D2', 0.98)} />
        </linearGradient>
        <clipPath id="pxBodyClip">
          <path d={bodyPath(W, bodyTop, bodyBot)} />
        </clipPath>
      </defs>

      {/* sombra al piso */}
      <ellipse cx={W / 2} cy={bodyBot + 12} rx={72} ry={12} fill={rgba('#0E2A31', 0.16)} />

      {/* CUERPO ámbar translúcido */}
      <path d={bodyPath(W, bodyTop, bodyBot)} fill="url(#pxGlass)" stroke={PX.amberLo} strokeWidth={2} />
      {/* líquido dentro (clip al cuerpo) */}
      <g clipPath="url(#pxBodyClip)">
        <rect x={0} y={liquidTop} width={W} height={bodyBot - liquidTop + 4} fill="url(#pxLiquid)" opacity={0.9} />
        <rect x={0} y={liquidTop - 3} width={W} height={6} fill={rgba('#FFFFFF', 0.5)} />
      </g>
      {/* brillo del vidrio */}
      {shine && (
        <rect x={44} y={bodyTop + 14} width={16} height={bodyH - 40} rx={8} fill={rgba('#FFFFFF', 0.32)} clipPath="url(#pxBodyClip)" />
      )}

      {/* ETIQUETA blanca */}
      <g>
        <rect x={38} y={196} width={124} height={118} rx={10} fill={PX.foam} stroke={PX.line} strokeWidth={1.5} />
        <rect x={38} y={196} width={124} height={26} rx={10} fill={PX.blue} />
        <rect x={38} y={214} width={124} height={8} fill={PX.blueDeep} opacity={0.4} />
        {/* símbolo peróxido */}
        <text x={W / 2} y={266} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={40} fill={PX.ink} letterSpacing={1}>
          {labelText}
        </text>
        <rect x={54} y={286} width={92} height={7} rx={3.5} fill={PX.lime} />
        <rect x={62} y={300} width={76} height={5} rx={2.5} fill={PX.line} />
      </g>

      {/* CUELLO */}
      <rect x={W / 2 - 22} y={96} width={44} height={30} rx={4} fill={shade(PX.amber, 0.06)} stroke={PX.amberLo} strokeWidth={1.5} />

      {/* TAPA azul (se despega con capLift) */}
      <g transform={`translate(0 ${capY}) rotate(${capSpin} ${W / 2} 70)`} opacity={capOpacity}>
        <rect x={W / 2 - 30} y={44} width={60} height={58} rx={9} fill="url(#pxCap)" stroke={PX.blueDeep} strokeWidth={2} />
        {/* estrías de la tapa */}
        {Array.from({length: 7}).map((_, i) => (
          <rect key={i} x={W / 2 - 26 + i * 8} y={48} width={3} height={50} rx={1.5} fill={rgba('#FFFFFF', 0.18)} />
        ))}
        <rect x={W / 2 - 30} y={44} width={60} height={12} rx={9} fill={rgba('#FFFFFF', 0.25)} />
      </g>
    </svg>
  );
};

function bodyPath(W: number, top: number, bot: number): string {
  const cx = W / 2;
  const halfW = 74;
  const sh = 16; // hombro
  return [
    `M ${cx - 24} ${top - 2}`,
    `C ${cx - halfW + 4} ${top + sh}, ${cx - halfW} ${top + sh + 6}, ${cx - halfW} ${top + sh + 26}`,
    `L ${cx - halfW} ${bot - 20}`,
    `Q ${cx - halfW} ${bot}, ${cx - halfW + 20} ${bot}`,
    `L ${cx + halfW - 20} ${bot}`,
    `Q ${cx + halfW} ${bot}, ${cx + halfW} ${bot - 20}`,
    `L ${cx + halfW} ${top + sh + 26}`,
    `C ${cx + halfW} ${top + sh + 6}, ${cx + halfW - 4} ${top + sh}, ${cx + 24} ${top - 2}`,
    'Z',
  ].join(' ');
}

/* ────────────────────────────────────────────────────────────────────────
   Capa de burbujas — crece con `progress` (0..1) dentro de un área.
   ──────────────────────────────────────────────────────────────────────── */
const Bubbles: React.FC<{
  progress: number;
  cx: number;
  cy: number;
  spread: number;
  count?: number;
  frame: number;
  shadow?: boolean; // sombra + borde para que la espuma BLANCA lea sobre superficie clara
}> = ({progress, cx, cy, spread, count = 46, frame, shadow = false}) => (
  <g>
    {Array.from({length: count}).map((_, i) => {
      const seed = (i * 61.71) % 100;
      const ang = (seed / 100) * Math.PI * 2;
      const rad = (0.25 + (seed % 40) / 40) * spread;
      const appear = (i / count) * 0.7; // stagger
      const p = Math.max(0, Math.min(1, (progress - appear) / (1 - appear + 0.001)));
      const wob = Math.sin((frame / 8) + i) * 3;
      const r = (4 + (seed % 12)) * p;
      const x = cx + Math.cos(ang) * rad * (0.4 + 0.6 * p) + wob;
      const y = cy + Math.sin(ang) * rad * 0.62 * (0.4 + 0.6 * p) - p * 8;
      if (p <= 0) return null;
      return (
        <g key={i}>
          {shadow && <circle cx={x + 1.5} cy={y + 2.5} r={r} fill={rgba('#0E2A31', 0.12)} />}
          <circle cx={x} cy={y} r={r} fill={PX.foam} opacity={0.95} />
          <circle cx={x} cy={y} r={r} fill="none" stroke={shadow ? rgba(PX.blue, 0.28) : PX.foamShade} strokeWidth={shadow ? 1.6 : 1} opacity={shadow ? 0.7 : 0.5} />
          <circle cx={x - r * 0.3} cy={y - r * 0.32} r={r * 0.34} fill="#FFFFFF" opacity={0.95} />
        </g>
      );
    })}
  </g>
);

/* Titular chico reutilizable (eyebrow + título) */
const Heading: React.FC<{eyebrow?: string; title?: string; frame: number; fps: number; y?: number}> = ({
  eyebrow,
  title,
  frame,
  fps,
  y = 92,
}) => {
  const inn = spring({frame: frame - 4, fps, config: spr});
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', opacity: inn, transform: `translateY(${(1 - inn) * 22}px)`}}>
      {eyebrow && (
        <div style={{fontFamily: FONT_SANS, fontWeight: 800, letterSpacing: 3, fontSize: 24, textTransform: 'uppercase', color: PX.blueDeep, marginBottom: 10}}>
          {eyebrow}
        </div>
      )}
      {title && (
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, lineHeight: 1, color: PX.ink, textTransform: 'uppercase', padding: '0 80px'}}>
          {title}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   1) BOTTLE UNCAP — la tapa se destapa y salta con "pop" + vapor. Abre un truco.
   ══════════════════════════════════════════════════════════════════════ */
export const BottleUncap: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = 'Agua oxigenada', title = 'El truco que nadie te contó', sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const POP = Math.round(fps * 0.9); // frame del pop
  const enter = spring({frame, fps, config: spr});
  // tapa: se afloja (temblor) y salta en POP
  const jitter = frame < POP ? Math.sin(frame * 1.6) * (interpolate(frame, [0, POP], [0, 4], CLAMP)) : 0;
  const lift = spring({frame: frame - POP, fps, config: {damping: 9, mass: 0.6, stiffness: 170}});
  const capLift = interpolate(lift, [0, 1], [0, 1.15], CLAMP);
  const capSpin = jitter + lift * 34;
  const capOpacity = interpolate(frame, [POP + 10, POP + 26], [1, 0], CLAMP);
  const vapor = interpolate(frame, [POP, POP + 30], [0, 1], CLAMP);
  const bob = Math.sin(frame / 14) * 5;

  return (
    <AbsoluteFill style={{background: cleanBg()}}>
      <TileBg opacity={0.5} />
      <SparkleLayer frame={frame} fps={fps} count={10} />
      <Heading eyebrow={eyebrow} title={title} frame={frame} fps={fps} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '56%',
          transform: `translate(-50%,-50%) translateY(${bob + (1 - enter) * 40}px) scale(${0.9 + enter * 0.1})`,
          opacity: enter,
        }}
      >
        {/* vapor / puff al destapar */}
        <div style={{position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', pointerEvents: 'none'}}>
          {Array.from({length: 5}).map((_, i) => {
            const pp = Math.max(0, vapor - i * 0.12);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: (i - 2) * 20,
                  top: -pp * 90,
                  width: 34 + i * 6,
                  height: 34 + i * 6,
                  borderRadius: '50%',
                  background: rgba('#FFFFFF', 0.5 * (1 - pp)),
                  filter: 'blur(6px)',
                }}
              />
            );
          })}
        </div>
        <PeroxideBottle width={260} capLift={capLift} capSpin={capSpin} capOpacity={capOpacity} />
      </div>

      {sfx && <SfxCue at={POP} src={SFX.capPop} volume={0.8} />}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   2) GLU-GLU POUR — la botella se inclina y vierte con glú-glú a un vaso.
   ══════════════════════════════════════════════════════════════════════ */
export const GluGluPour: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = 'Cómo se aplica', title = 'Un chorrito basta', sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: spr});
  const START = Math.round(fps * 0.7); // empieza a inclinar
  const tilt = interpolate(spring({frame: frame - START, fps, config: {damping: 14, mass: 0.9, stiffness: 120}}), [0, 1], [0, 108], CLAMP);
  const pouring = tilt > 70;
  const pourP = interpolate(frame, [START + Math.round(fps * 0.5), durationInFrames - Math.round(fps * 0.4)], [0, 1], CLAMP);
  const streamOn = pouring ? interpolate(frame, [START + 12, START + 22], [0, 1], CLAMP) : 0;

  // vaso (beaker) — posición fija abajo-derecha; se llena con pourP
  const beakerX = 1180;
  const beakerY = 640;
  const beakerW = 220;
  const beakerH = 260;
  const liqH = beakerH * 0.9 * pourP;

  // punto de vertido (spout) tras la inclinación de la botella (aprox)
  const spoutX = 720;
  const spoutY = 470;

  return (
    <AbsoluteFill style={{background: cleanBg()}}>
      <TileBg opacity={0.5} />
      <SparkleLayer frame={frame} fps={fps} count={8} />
      <Heading eyebrow={eyebrow} title={title} frame={frame} fps={fps} />

      {/* BOTELLA inclinada (pivote en el cuello) */}
      <div
        style={{
          position: 'absolute',
          left: 470,
          top: 300,
          transformOrigin: '60% 22%',
          transform: `rotate(-${tilt}deg) scale(${0.9 + enter * 0.1})`,
          opacity: enter,
        }}
      >
        <PeroxideBottle width={230} fill={0.72 - pourP * 0.4} />
      </div>

      {/* CHORRO glú-glú (del spout al vaso) */}
      {streamOn > 0 && (
        <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
          <path
            d={streamPath(spoutX, spoutY, beakerX + beakerW / 2, beakerY + 30, frame)}
            fill="none"
            stroke={rgba(PX.liquid, 0.85)}
            strokeWidth={16 * streamOn}
            strokeLinecap="round"
          />
          {/* gotitas */}
          {Array.from({length: 4}).map((_, i) => {
            const gp = ((frame / 3 + i * 5) % 20) / 20;
            return <circle key={i} cx={spoutX + 20 + gp * (beakerX + beakerW / 2 - spoutX - 20)} cy={spoutY + gp * gp * (beakerY - spoutY)} r={6} fill={rgba(PX.liquid, 0.9)} />;
          })}
        </svg>
      )}

      {/* VASO / beaker */}
      <svg style={{position: 'absolute', left: beakerX, top: beakerY}} width={beakerW} height={beakerH + 20} viewBox={`0 0 ${beakerW} ${beakerH + 20}`}>
        <defs>
          <clipPath id="pxBeaker">
            <path d={`M 14 6 L ${beakerW - 14} 6 L ${beakerW - 30} ${beakerH} Q ${beakerW / 2} ${beakerH + 16} 30 ${beakerH} Z`} />
          </clipPath>
        </defs>
        <g clipPath="url(#pxBeaker)">
          <rect x={0} y={beakerH - liqH} width={beakerW} height={liqH + 20} fill={rgba(PX.blueLite, 0.55)} />
          <rect x={0} y={beakerH - liqH - 4} width={beakerW} height={8} fill={rgba('#FFFFFF', 0.7)} />
          {/* burbujitas en el vaso */}
          {pourP > 0.1 && <Bubbles progress={Math.min(1, pourP * 1.2)} cx={beakerW / 2} cy={beakerH - liqH * 0.5} spread={beakerW * 0.5} count={14} frame={frame} />}
        </g>
        <path d={`M 14 6 L ${beakerW - 14} 6 L ${beakerW - 30} ${beakerH} Q ${beakerW / 2} ${beakerH + 16} 30 ${beakerH} Z`} fill="none" stroke={rgba(PX.blueDeep, 0.5)} strokeWidth={4} />
        <rect x={8} y={2} width={beakerW - 16} height={10} rx={5} fill={rgba(PX.blueDeep, 0.3)} />
      </svg>

      {/* glú-glú: un cue por cada "glup" mientras vierte */}
      {sfx && pouring &&
        [0, 14, 28, 42].map((d) => <SfxCue key={d} at={START + 16 + d} src={SFX.gluglu} volume={0.5} durationInFrames={18} />)}
    </AbsoluteFill>
  );
};

function streamPath(x0: number, y0: number, x1: number, y1: number, frame: number): string {
  const midX = (x0 + x1) / 2 + Math.sin(frame / 5) * 10;
  const midY = (y0 + y1) / 2;
  return `M ${x0} ${y0} Q ${midX} ${midY} ${x1} ${y1}`;
}

/* ══════════════════════════════════════════════════════════════════════
   3) FOAM CLEAN — se echa peróxido, la ESPUMA crece y limpia la mugre.
   ══════════════════════════════════════════════════════════════════════ */
export const FoamClean: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  cleanLabel?: string;
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = 'Antes y después', title = 'La espuma hace el trabajo', cleanLabel = '¡LIMPIO!', sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: spr});
  const POUR = Math.round(fps * 0.8);
  const foamP = interpolate(frame, [POUR, POUR + Math.round(fps * 1.4)], [0, 1], CLAMP); // espuma crece
  const grime = interpolate(frame, [POUR + Math.round(fps * 0.9), POUR + Math.round(fps * 1.8)], [1, 0], CLAMP); // mugre desaparece
  const stampAt = POUR + Math.round(fps * 2.0);
  const stamp = spring({frame: frame - stampAt, fps, config: {damping: 8, mass: 0.7, stiffness: 180}});

  // panel de superficie
  const px = 360, py = 300, pw = 1200, ph = 470;
  const cx = px + pw / 2;
  const cy = py + ph / 2;

  return (
    <AbsoluteFill style={{background: cleanBg()}}>
      <TileBg opacity={0.5} />
      <Heading eyebrow={eyebrow} title={title} frame={frame} fps={fps} />

      <div style={{position: 'absolute', left: px, top: py, width: pw, height: ph, opacity: enter, transform: `translateY(${(1 - enter) * 30}px)`, borderRadius: 22, boxShadow: CARD_SHADOW, overflow: 'hidden', background: PX.tile}}>
        {/* superficie con juntas de azulejo */}
        <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${PX.tileLine} 2px, transparent 2px), linear-gradient(90deg, ${PX.tileLine} 2px, transparent 2px)`, backgroundSize: '120px 120px'}} />
        {/* MUGRE (manchas) — se desvanece */}
        <svg width={pw} height={ph} style={{position: 'absolute', inset: 0, opacity: grime}}>
          {Array.from({length: 18}).map((_, i) => {
            const s = (i * 53.3) % 100;
            const gx = (s / 100) * pw;
            const gy = ((s * 1.7) % 100) / 100 * ph;
            const r = 26 + (s % 40);
            return <circle key={i} cx={gx} cy={gy} r={r} fill={rgba(shade(PX.warnDeep, -0.2), 0.28)} />;
          })}
          {Array.from({length: 10}).map((_, i) => {
            const s = (i * 91.7) % 100;
            return <circle key={`d${i}`} cx={(s / 100) * pw} cy={((s * 2.3) % 100) / 100 * ph} r={8 + (s % 10)} fill={rgba('#3A2A16', 0.35)} />;
          })}
        </svg>
        {/* ESPUMA que crece y cubre */}
        <svg width={pw} height={ph} style={{position: 'absolute', inset: 0}}>
          <Bubbles progress={foamP} cx={pw / 2} cy={ph / 2} spread={pw * 0.62} count={70} frame={frame} />
        </svg>
        {/* sello LIMPIO */}
        {frame >= stampAt && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%,-50%) scale(${0.4 + stamp * 0.6}) rotate(${-8 + stamp * 8}deg)`,
              opacity: Math.min(1, stamp * 1.4),
              fontFamily: FONT_DISPLAY,
              fontSize: 96,
              color: PX.foam,
              background: PX.limeDeep,
              padding: '10px 42px',
              borderRadius: 18,
              border: `6px solid ${PX.foam}`,
              boxShadow: BLUE_GLOW,
              letterSpacing: 2,
            }}
          >
            {cleanLabel}
          </div>
        )}
      </div>

      {sfx && <SfxCue at={POUR} src={SFX.gluglu} volume={0.4} durationInFrames={20} />}
      {sfx && <SfxCue at={POUR} src={SFX.fizz} volume={0.6} durationInFrames={Math.round(fps * 2)} />}
      {sfx && <SfxCue at={stampAt} src={SFX.sparkleClean} volume={0.6} />}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   4) TRICK CARD — "TRUCO #N" con la botella, número gigante y titular.
   ══════════════════════════════════════════════════════════════════════ */
export const TrickCard: React.FC<{
  durationInFrames: number;
  n: number;
  title: string;
  sub?: string;
  kicker?: string;
  sfx?: boolean;
}> = ({n, title, sub, kicker = 'TRUCO', sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: spr});
  const numPop = spring({frame: frame - 6, fps, config: {damping: 9, mass: 0.7, stiffness: 170}});
  const bob = Math.sin(frame / 16) * 6;

  return (
    <AbsoluteFill style={{background: cleanBg()}}>
      <TileBg opacity={0.5} />
      <SparkleLayer frame={frame} fps={fps} count={10} />

      {/* botella a la izquierda */}
      <div style={{position: 'absolute', left: 210, top: '50%', transform: `translateY(-50%) translateY(${bob}px) translateX(${(1 - enter) * -60}px)`, opacity: enter}}>
        <PeroxideBottle width={300} />
      </div>

      {/* bloque de texto a la derecha */}
      <div style={{position: 'absolute', left: 720, top: '50%', transform: 'translateY(-50%)', width: 1020}}>
        <div style={{fontFamily: FONT_SANS, fontWeight: 800, letterSpacing: 6, fontSize: 34, color: PX.blueDeep, opacity: enter}}>
          {kicker}
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 260, lineHeight: 0.9, color: PX.blue, transform: `scale(${0.6 + numPop * 0.4})`, transformOrigin: 'left center', textShadow: BLUE_GLOW}}>
            #{n}
          </div>
        </div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 78, lineHeight: 1.02, color: PX.ink, textTransform: 'uppercase', marginTop: 6, opacity: enter, transform: `translateY(${(1 - enter) * 20}px)`}}>
          {title}
        </div>
        {sub && (
          <div style={{fontFamily: FONT_HAND, fontSize: 44, color: PX.limeDeep, marginTop: 14, opacity: interpolate(frame, [14, 26], [0, 1], CLAMP)}}>
            {sub}
          </div>
        )}
      </div>

      {sfx && <SfxCue at={6} src={SFX.pop1} volume={0.6} />}
    </AbsoluteFill>
  );
};
