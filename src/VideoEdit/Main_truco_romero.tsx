/**
 * ============================================================================
 * MAIN · "25 Secretos de Belleza de 1960" — Dra. Valeria Alcázar (18:46)
 * ----------------------------------------------------------------------------
 * BUILD data-driven (Fase 7). Un ÚNICO OffthreadVideo persistente al fondo
 * (avatar + audio, montado una sola vez, cubre TODA la composición). Encima,
 * cada beat del plan se renderiza como un <Sequence> anclado al ms de whisper:
 *   avatar      → nada opaco (deja ver a la doctora); overlay sutil si hay payload
 *   broll       → OffthreadVideo full-bleed (Ken-Burns) sobre crema
 *   presenterAI → <Img> full-bleed (Ken-Burns) sobre crema
 *   component   → componente del ValKit (trae su propia TransitionShell)
 *   carousel    → ValOilCarousel con las 25 tarjetas
 * Marca: SOLO desde src/valeria/theme + ValeriaKit (papel crema, tinta espresso,
 * latón/oro, serif). Comp 1920×1080 @ 30fps.
 * ============================================================================
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  VAL,
  FONT_DISPLAY,
  FONT_SANS,
  FONT_SERIF_FINE,
  CLAMP,
  rgba,
} from '../valeria/theme';
import {
  TransitionShell,
  ValHero,
  ValStat,
  ValQuote,
  ValMolecule,
  ValStep,
  ValBeforeAfter,
  ValChecklist,
  ValCta,
  ValLowerThird,
  ValOilCarousel,
  VAL_ASSETS,
  type ValCarouselCard,
} from '../valeria/ValeriaKit';
import planData from '../../_v3/truco-romero-joven_plan.build.json';

const FPS = 30;
const BASE_VIDEO = 'truco-romero-joven_opt.mp4';
const MUSIC_BED = 'music/truco-romero-joven_bed_mix.mp3';
const ACCENT = VAL.gold;

/* ---- ms → frame (contrato del plan) ---- */
const msToF = (ms: number): number => Math.round((ms / 1000) * FPS);

export const TOTAL_FRAMES_ROMERO = 38463; // ceil(1281100/1000*30)+30 (colchón)
const TOTAL_FRAMES_SECRETOS = TOTAL_FRAMES_ROMERO;

/* ============================ TIPOS DEL PLAN ============================= */

type CarouselCardPlan = {index: string; name: string; query?: string; image?: string};

type Beat = {
  role: 'avatar' | 'broll' | 'presenterAI' | 'component' | 'carousel';
  startMs: number;
  endMs: number;
  kind?: string;
  asset?: string;
  dice?: string;
  focus?: number;
  intro?: boolean;
  payload?: Record<string, any>;
};

const CAROUSEL_CARDS = (planData as any).carouselCards as CarouselCardPlan[];
const BEATS = (planData as any).beats as Beat[];

/* ==================== RESOLUCIÓN DE ASSETS (robusta) ==================== */
// Los componentes del ValKit hacen <Img src={image}/> SIN staticFile: esperan
// una URL ya resuelta. Acá resolvemos SOLO rutas locales reales; una "query"
// (texto de búsqueda todavía sin bajar) devuelve undefined → el componente usa
// su asset por defecto (existe en public/med/) y nunca rompe el render.
const isLocalAsset = (v: string): boolean =>
  /^(img|broll|med|sfx|clips)\//i.test(v) ||
  /\.(mp4|mov|webm|m4v|png|jpe?g|webp|gif|avif)$/i.test(v);

const resolveMedia = (v?: string | null): string | undefined =>
  v && isLocalAsset(v) ? staticFile(v) : undefined;

// Fallback de imagen (para que un <Img> nunca quede sin src mientras baja el asset).
const FALLBACK_IMAGES = Object.values(VAL_ASSETS);
const fallbackImg = (i: number): string => FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

// Resuelve los campos de imagen de un payload de componente.
const resolvePayload = (
  kind: string | undefined,
  payload: Record<string, any> = {}
): Record<string, any> => {
  const out: Record<string, any> = {...payload};
  for (const k of ['image', 'imageA', 'imageB']) {
    if (typeof out[k] === 'string') out[k] = resolveMedia(out[k]);
  }
  // ValStat.value es numérico; el plan puede traerlo como string ("10").
  if (kind === 'ValStat' && out.value != null) {
    const n = Number(out.value);
    out.value = Number.isFinite(n) ? n : 0;
  }
  return out;
};

/* ============ AVATAR BASE — un solo video persistente, al fondo ========= */

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TOTAL_FRAMES_SECRETOS - 1], [0, 1], CLAMP);
  const microX = Math.sin(frame / 260) * 4;
  const microY = Math.cos(frame / 310) * 2;
  return (
    <AbsoluteFill style={{background: VAL.paperDeep, overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(BASE_VIDEO)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate3d(${microX}px,${microY}px,0) scale(${(1.006 + progress * 0.024).toFixed(4)})`,
          transformOrigin: '50% 38%',
        }}
      />
      {/* viñeta cálida sutil (nunca a negro) para asentar a la doctora */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(120% 100% at 50% 40%, transparent 58%, ${rgba(VAL.ink, 0.16)} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ============ HELPERS FULL-BLEED (mirror de valler, piel Valeria) ======== */

const BottomScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `linear-gradient(to top, ${rgba(VAL.ink, 0.62)} 0%, ${rgba(
        VAL.ink,
        0.22
      )} 22%, transparent 46%)`,
    }}
  />
);

const OverlayText: React.FC<{kicker?: string; title?: string; sub?: string}> = ({
  kicker,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const inO = interpolate(frame, [4, 18], [0, 1], CLAMP);
  const inY = interpolate(frame, [4, 18], [24, 0], CLAMP);
  if (!kicker && !title && !sub) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: width * 0.07,
        right: width * 0.07,
        bottom: height * 0.1,
        opacity: inO,
        transform: `translateY(${inY.toFixed(1)}px)`,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: FONT_SANS,
            fontWeight: 700,
            fontSize: Math.round(height * 0.02),
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: ACCENT,
            textShadow: `0 2px 12px ${rgba(VAL.ink, 0.7)}`,
            marginBottom: 14,
          }}
        >
          {kicker}
        </div>
      ) : null}
      {title ? (
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: Math.round(Math.min(width * 0.03, height * 0.052)),
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: VAL.onAccent,
            textShadow: `0 4px 22px ${rgba(VAL.ink, 0.8)}`,
            maxWidth: '74%',
          }}
        >
          {title}
        </div>
      ) : null}
      {sub ? (
        <div
          style={{
            marginTop: 12,
            fontFamily: FONT_SERIF_FINE,
            fontStyle: 'italic',
            fontSize: Math.round(height * 0.028),
            color: rgba(VAL.onAccent, 0.92),
            textShadow: `0 2px 14px ${rgba(VAL.ink, 0.8)}`,
            maxWidth: '68%',
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

const CreamFallback: React.FC<{title?: string}> = ({title}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: VAL.paper,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 12%',
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: Math.round(Math.min(width * 0.034, height * 0.058)),
          lineHeight: 1.14,
          textAlign: 'center',
          color: VAL.ink,
        }}
      >
        {title || ''}
      </div>
    </AbsoluteFill>
  );
};

// FullBleedBroll — clip de stock a pantalla completa con Ken-Burns lento.
const FullBleedBroll: React.FC<{
  src?: string;
  title?: string;
  sub?: string;
  kicker?: string;
  seed?: number;
}> = ({src, title, sub, kicker, seed = 0}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  if (!src) return <CreamFallback title={title} />;
  const dir = seed % 2 === 0 ? 1 : -1;
  const p = interpolate(frame, [0, 240], [0, 1], CLAMP);
  const zoom = 1.04 + 0.09 * p;
  const tx = dir * width * 0.016 * p;
  const ty = -height * 0.01 * p;
  return (
    <AbsoluteFill style={{background: VAL.paperDeep, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${zoom.toFixed(4)})`,
          willChange: 'transform',
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
      <BottomScrim />
      <OverlayText kicker={kicker} title={title} sub={sub} />
    </AbsoluteFill>
  );
};

// KenBurnsImage — imagen fija a pantalla completa (presentadora IA) con push.
const KenBurnsImage: React.FC<{
  src?: string;
  title?: string;
  sub?: string;
  kicker?: string;
  seed?: number;
}> = ({src, title, sub, kicker, seed = 0}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  if (!src) return <CreamFallback title={title} />;
  const dir = seed % 2 === 0 ? 1 : -1;
  const p = interpolate(frame, [0, 240], [0, 1], CLAMP);
  const zoom = 1.05 + 0.1 * p;
  const tx = dir * width * 0.014 * p;
  const ty = -height * 0.012 * p;
  return (
    <AbsoluteFill style={{background: VAL.paperDeep, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${zoom.toFixed(4)})`,
          willChange: 'transform',
        }}
      >
        <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <BottomScrim />
      <OverlayText kicker={kicker} title={title} sub={sub} />
    </AbsoluteFill>
  );
};

/* ==================== MAPA DE COMPONENTES DEL KIT ======================= */

const COMPONENT_MAP: Record<string, React.FC<any>> = {
  ValHero,
  ValStat,
  ValQuote,
  ValMolecule,
  ValStep,
  ValBeforeAfter,
  ValChecklist,
  ValCta,
};

/* ==================== TARJETAS DEL CARRUSEL (las 25) ==================== */

const CAROUSEL_ALL: ValCarouselCard[] = CAROUSEL_CARDS.map((c, i) => ({
  index: c.index,
  name: c.name,
  image: resolveMedia(c.image) ?? fallbackImg(i),
}));

/* ============================ RENDER DE UN BEAT ========================= */

const BeatNode: React.FC<{beat: Beat; dur: number; idx: number}> = ({beat, dur, idx}) => {
  const p = beat.payload ?? {};

  switch (beat.role) {
    case 'avatar': {
      // Nada opaco: dejamos ver a la doctora. Overlay sutil SOLO si hay payload.
      if (!p.kicker && !p.title && !p.sub) return null;
      return (
        <ValLowerThird
          totalF={dur}
          avatarSrc={null}
          name={p.title ?? ''}
          role={p.sub ?? ''}
          topic={p.kicker ?? ''}
          accent={ACCENT}
        />
      );
    }

    case 'broll':
      return (
        <TransitionShell accent={ACCENT} totalF={dur} variant="whip">
          <FullBleedBroll
            src={resolveMedia(beat.asset)}
            kicker={p.kicker}
            title={p.title ?? beat.dice}
            sub={p.sub}
            seed={idx}
          />
        </TransitionShell>
      );

    case 'presenterAI':
      return (
        <TransitionShell accent={ACCENT} totalF={dur} variant="whip">
          <KenBurnsImage
            src={resolveMedia(beat.asset)}
            kicker={p.kicker}
            title={p.title}
            sub={p.sub}
            seed={idx}
          />
        </TransitionShell>
      );

    case 'component': {
      const Comp = beat.kind ? COMPONENT_MAP[beat.kind] : undefined;
      if (!Comp) return <CreamFallback title={p.title ?? beat.dice} />;
      const props = resolvePayload(beat.kind, p);
      return <Comp totalF={dur} accent={ACCENT} {...props} />;
    }

    case 'carousel':
      return (
        <TransitionShell accent={ACCENT} totalF={dur} variant="whip">
          <ValOilCarousel
            cards={CAROUSEL_ALL}
            focus={typeof beat.focus === 'number' ? beat.focus - 1 : -1}
            intro={beat.intro === true}
            accent={ACCENT}
          />
        </TransitionShell>
      );

    default:
      return null;
  }
};

/* ============================ MÚSICA DE FONDO =========================== */
// Voz SIEMPRE adelante: bed a volumen bajo (ya EQ+loudnorm horneado a −22 LUFS).
// Sube suave en beats de componente/carrusel (aparición de tarjetas/transiciones),
// baja bajo la voz el resto. Graves ya limpios en el bake.
const RAISE_RANGES: Array<[number, number]> = (BEATS as Beat[])
  .filter((b) => b.role === 'component' || b.role === 'carousel')
  .map((b) => [msToF(b.startMs), msToF(b.endMs)] as [number, number]);

const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();
  const raised = RAISE_RANGES.some(([a, b]) => frame >= a && frame < b);
  const base = raised ? 0.26 : 0.15; // ~3–5 dB de ducking bajo la voz
  const fadeIn = interpolate(frame, [0, 30], [0, 1], CLAMP);
  const foS = TOTAL_FRAMES_ROMERO - 45;
  const fadeOut = interpolate(frame, [foS, TOTAL_FRAMES_ROMERO - 1], [1, 0], CLAMP);
  return <Audio src={staticFile(MUSIC_BED)} volume={base * fadeIn * fadeOut} loop />;
};

/* ================================ MAIN ================================== */

export const MainRomero: React.FC = () => {
  return (
    <AbsoluteFill style={{background: VAL.paperDeep, overflow: 'hidden'}}>
      {/* Fuente ÚNICA de video + audio: montada una sola vez, span completo. */}
      <AvatarBase />
      <MusicBed />

      {BEATS.map((beat, i) => {
        const from = msToF(beat.startMs);
        const dur = Math.max(1, msToF(beat.endMs) - from);
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={dur}
            premountFor={Math.min(30, dur - 1)}
            name={`${String(i + 1).padStart(3, '0')} · ${beat.role}${
              beat.kind ? ` · ${beat.kind}` : ''
            }`}
          >
            <BeatNode beat={beat} dur={dur} idx={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
