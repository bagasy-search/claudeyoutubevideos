/**
 * Main_vucm3bvd4u3k — "Si Sentís HORMIGUEO en los Pies de Noche" · Federer Archivos
 *
 * ARQUITECTURA: copia del esqueleto src/FedererFluid.tsx adaptada a este guion.
 *   · UN solo <OffthreadVideo> del avatar, PERSISTENTE, corriendo abajo de todo
 *     desde el frame 0 hasta el final → el audio nunca se corta ni se desincroniza.
 *   · Encima flotan las escenas (CUES), cada una en su <Sequence> anclada al ms
 *     exacto de Whisper. Los componentes salen TAL CUAL de src/FedererKit.tsx.
 *   · Avatar FULL o visual FULL, alternados. CERO PiP, cero recuadro, cero split.
 *   · Sin fade-in: el frame 0 es la cara del médico hablando (regla del canal).
 *
 * Los CUES viven en cues_vucm3bvd4u3k.gen.tsx (generado por
 * scripts/gen_cues_vucm3bvd4u3k.mjs a partir de _v3/plan_vucm3bvd4u3k.json).
 */

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {GrainOverlay, rgba} from '../FedererKit';
import {CUES, TOTAL_FRAMES_VUCM3BVD4U3K} from './cues_vucm3bvd4u3k.gen';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ACCENT_VUCM = '#E9B44C';
export const AVATAR_VUCM = 'avatar_vucm3bvd4u3k.mp4';

/* ============== CAPA AVATAR — video persistente (nunca se desmonta) ============== */
/* Copiada de FedererFluid.AvatarLayer: push Ken-Burns lento + micro handheld
   contenido + latigazo/blur en cada corte, para que el avatar respire con la
   edición sin cortarse en pedazos. objectFit cover resuelve el 1082→1080. */
const AvatarLayer: React.FC<{src: string; accent: string; cuts: number[]}> = ({
  src,
  accent,
  cuts,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;

  // actividad de corte: bump en cada boundary de cue cercano
  let act = 0;
  for (let i = 0; i < cuts.length; i++) {
    const d = Math.abs(t - cuts[i]);
    if (d > 0.5) continue;
    const b = interpolate(d, [0, 0.5], [1, 0], CLAMP);
    if (b > act) act = b;
  }

  const push = interpolate(frame, [0, durationInFrames], [1, 1.055], CLAMP);
  const handX =
    Math.sin(frame * 0.05) * width * 0.0012 +
    Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const handY = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;
  const x = handX - act * width * 0.022;
  const blur = act * 8;
  const scale = push * (1 + act * 0.018);

  return (
    <>
      <AbsoluteFill
        style={{
          transform: `translate(${x.toFixed(1)}px, ${handY.toFixed(1)}px) scale(${scale.toFixed(4)})`,
          filter: `blur(${blur.toFixed(2)}px)`,
          willChange: 'transform, filter',
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `linear-gradient(160deg, ${rgba(accent, 0.05)}, transparent 38%, transparent 68%, rgba(2, 6, 14, 0.28))`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 42%, transparent 62%, rgba(2, 5, 12, 0.42) 100%)',
        }}
      />
    </>
  );
};

/* ================================ COMPOSICIÓN ================================ */

export type MainVucmProps = {avatarSrc?: string; accent?: string};

export const Main_vucm3bvd4u3k: React.FC<MainVucmProps> = ({
  avatarSrc = AVATAR_VUCM,
  accent = ACCENT_VUCM,
}) => {
  const {fps} = useVideoConfig();

  // los cortes que hacen respirar al avatar = el arranque de cada cue de visual
  const cuts = React.useMemo(
    () => CUES.filter((c) => !c.avatar).map((c) => c.start),
    []
  );

  return (
    <AbsoluteFill style={{background: '#020409', overflow: 'hidden'}}>
      {/* L0 · avatar persistente — arranca en el frame 0, cara hablando */}
      <AvatarLayer src={avatarSrc} accent={accent} cuts={cuts} />

      {/* L1 · escenas ancladas al ms de Whisper */}
      {CUES.map((c, i) => {
        const from = Math.round(c.start * fps);
        const durF = Math.max(2, Math.round(c.dur * fps));
        return (
          <Sequence
            key={`${c.id}-${i}`}
            from={from}
            durationInFrames={durF}
            name={`${c.avatar ? 'AV' : 'VIS'} · ${c.id}`}
            layout="none"
          >
            {c.node}
          </Sequence>
        );
      })}

      {/* grade global suave que unifica avatar y escenas */}
      <AbsoluteFill
        style={{
          zIndex: 30,
          pointerEvents: 'none',
          background:
            'radial-gradient(125% 105% at 50% 46%, transparent 62%, rgba(1, 3, 8, 0.32) 100%)',
        }}
      />
      <GrainOverlay />
      {/* SIN fade-in (fadeIn = 0): el frame 0 tiene que ser la cara del médico.
          El esqueleto original traía 0,5 s de negro y la cuadrícula del auditor
          lo cazó en el video anterior de este kit. Sólo queda el fade de salida. */}
      <FadeOutOnly />
    </AbsoluteFill>
  );
};

const FadeOutOnly: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const foS = Math.max(0, durationInFrames - Math.round(0.6 * fps));
  const o = interpolate(frame, [foS, Math.max(foS + 1, durationInFrames - 1)], [0, 1], CLAMP);
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill style={{zIndex: 50, background: '#020409', opacity: o, pointerEvents: 'none'}} />
  );
};

export const TOTAL_FRAMES = TOTAL_FRAMES_VUCM3BVD4U3K;
export default Main_vucm3bvd4u3k;
