/* ============================================================================
 * Main_vucm3bvd869j — "Si sentís hormigueo en los pies de noche" · Dr. Federer
 * ----------------------------------------------------------------------------
 * ESQUELETO = src/FedererFluid.tsx (edición fluida A/B), adaptado a un video
 * largo data-driven:
 *   L0 · AVATAR PERSISTENTE: UN solo <OffthreadVideo> que corre continuo de
 *        principio a fin (nunca se desmonta → audio y sync perfectos), con
 *        push-in Ken-Burns lento, handheld muy sutil y una reacción de whip
 *        en cada corte.
 *   L1 · CUES: las escenas de contenido flotan ENCIMA a pantalla completa
 *        (cada componente trae su propio TransitionShell → whip, sin cortes
 *        secos). Los HUECOS entre cues son avatar FULL.
 * Cero PiP, cero split: o cara o visual, como manda el canal.
 * Los cues salen de cues_vucm3bvd869j.gen.tsx (los genera scripts/gen_…mjs
 * desde las captions de Whisper: cada corte cae en un límite de frase).
 * ========================================================================== */

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {GrainOverlay} from '../FedererKit';
import {CUES, TOTAL_VUCM3BVD869J} from './cues_vucm3bvd869j.gen';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ACCENT = '#E9B44C';
// _opt.mp4 = la copia comprimida que viaja en el tarball del farm (el master pesa 887 MB)
export const AVATAR_SRC = 'vucm3bvd869j_opt.mp4';
export const TOTAL_FRAMES_VUCM = Math.round(TOTAL_VUCM3BVD869J * 30);

/* ───────────────────────── avatar persistente (L0) ─────────────────────── */

const AvatarLayer: React.FC<{src: string; cuts: number[]}> = ({src, cuts}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;

  // reacción de cámara en el corte más cercano (empuje + desenfoque cortito)
  let act = 0;
  for (const c of cuts) {
    const d = t - c;
    if (d > -0.18 && d < 0.42) act = Math.max(act, Math.sin(((d + 0.18) / 0.6) * Math.PI));
  }

  // push-in MUY lento, reseteado por tramos para que no se vaya de escala en 27 min
  const seg = Math.floor(frame / (90 * fps));
  const local = frame - seg * 90 * fps;
  const push = interpolate(local, [0, 90 * fps], [1.02, 1.075], CLAMP);
  const handX =
    Math.sin(frame * 0.021 + random('h1') * 6) * width * 0.0013 +
    Math.sin(frame * 0.0071) * width * 0.0016;
  const handY = Math.cos(frame * 0.018) * height * 0.0012;

  // SIN fade-in: el video abre con la cara hablando, no con negro (regla del canal;
  // además un frame 0 negro lo caza el blackdetect del chequeo técnico del farm).
  const fadeIn = 0;
  const foS = Math.max(0, durationInFrames - Math.round(0.8 * fps));
  const fadeOut = interpolate(frame, [foS, durationInFrames - 1], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${(handX - act * width * 0.016).toFixed(1)}px, ${handY.toFixed(
            1
          )}px) scale(${(push * (1 + act * 0.014)).toFixed(4)})`,
          filter: act > 0.02 ? `blur(${(act * 5).toFixed(2)}px)` : undefined,
          willChange: 'transform, filter',
        }}
      >
        <OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>

      {/* grade + viñeta muy suaves: unifican la cara con las escenas oscuras */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: [
            'radial-gradient(120% 100% at 50% 44%, transparent 56%, rgba(2, 5, 11, 0.5) 100%)',
            'linear-gradient(to bottom, rgba(3,6,13,0.22), transparent 20%, transparent 78%, rgba(3,6,13,0.38))',
          ].join(', '),
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: 0.1,
          mixBlendMode: 'soft-light',
          background: `linear-gradient(150deg, ${ACCENT} 0%, transparent 45%, rgba(20,70,80,0.5) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{background: '#04060c', opacity: Math.max(fadeIn, fadeOut), pointerEvents: 'none', zIndex: 60}}
      />
    </AbsoluteFill>
  );
};

/* ─────────────────────────────── composición ───────────────────────────── */

export const Main_vucm3bvd869j: React.FC = () => {
  const {fps} = useVideoConfig();
  const cuts = React.useMemo(() => CUES.map((c) => c.start), []);

  return (
    <AbsoluteFill style={{background: '#04060c'}}>
      <AvatarLayer src={AVATAR_SRC} cuts={cuts} />

      {CUES.map((c, k) => {
        const from = Math.round(c.start * fps);
        const dur = Math.max(2, Math.round(c.dur * fps));
        return (
          <Sequence key={k} from={from} durationInFrames={dur} name={`cue ${k} · ${c.start.toFixed(1)}s`}>
            {c.node}
          </Sequence>
        );
      })}

      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default Main_vucm3bvd869j;
