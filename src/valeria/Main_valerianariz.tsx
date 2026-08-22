// Main_valerianariz.tsx — Doctora Valeria Alcazar · pastillas para la tension
// Clon del motor de valeriavaselina con DOS cambios obligatorios:
//  1) el avatar dura 9:44 sobre 31:20 -> va en <Loop> y MUTEADO
//  2) el audio real es <Audio> del master (avatar + Fish clonada)
/**
 * ============================================================================
 * Main_valeriavaselina — Doctora Valeria Alcázar · "VASELINA + vitamina E"
 * Kit valeria-vintage (editorial claro). Motor data-driven:
 *   L0 = avatar persistente (un solo <OffthreadVideo>, audio continuo).
 *   L1 = escenas Val* OPACAS encima (cubren su slot; si no hay, se ve el avatar
 *        FULL → anti-hueco gratis).
 * Los beats salen de ./cues_valerianariz.gen (los genera build_valeriavaselina.mjs,
 * anclado al ms de Whisper). NO editar los beats acá.
 * Comp 1080p30.
 * ============================================================================
 */
import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Loop,
  Audio,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  VAL,
  FONT_SERIF_FINE,
  CLAMP,
  rgba,
  PaperGrain,
  WarmVignette,
  ValMood,
} from './theme';
import {
  MotesLayer,
  makeMotes,
  Kicker,
  Words,
  ValChapter,
  ValHero,
  ValStat,
  ValQuote,
  ValMolecule,
  ValStep,
  ValBeforeAfter,
  ValChecklist,
  ValCta,
  ValFullShot,
  ValOilCarousel,
  ValLowerThird,
  ValCarouselCard,
} from './ValeriaKit';
import {BEATS, TOTAL_FRAMES_VN, AVATAR_END_F, type Cue} from './cues_valerianariz.gen';

const AVATAR = staticFile('valerianariz_opt.mp4');
const sf = (p?: string): string | undefined => (p ? (/^https?:|^\//.test(p) ? p : staticFile(p)) : undefined);

/* ============================ AVATAR PERSISTENTE ========================= */

const AvatarLayer: React.FC<{cuts: number[]}> = ({cuts}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  let act = 0;
  for (let i = 0; i < cuts.length; i++) {
    const b = interpolate(Math.abs(t - cuts[i]), [0, 0.5], [1, 0], CLAMP);
    if (b > act) act = b;
  }
  const push = interpolate(frame, [0, durationInFrames], [1, 1.055], CLAMP);
  const handX = Math.sin(frame * 0.05) * width * 0.0012 + Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const handY = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;
  const x = handX - act * width * 0.02;
  const blur = act * 7;
  const scale = push * (1 + act * 0.016);
  const dust = React.useMemo(() => makeMotes(7, 'vn-dust', 2, 5, 0.008, 0.02, 0.05, 0.12), []);
  return (
    <>
      <AbsoluteFill
        style={{
          transform: `translate(${x}px, ${handY}px) scale(${scale})`,
          filter: `blur(${blur}px)`,
          willChange: 'transform, filter',
        }}
      >
        <Loop durationInFrames={AVATAR_END_F} layout="none">
          <OffthreadVideo src={AVATAR} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Loop>
        <AbsoluteFill
          style={{pointerEvents: 'none', background: `linear-gradient(160deg, ${rgba(VAL.gold, 0.06)}, transparent 40%)`}}
        />
      </AbsoluteFill>
      <MotesLayer motes={dust} blur={1.2} scale={height / 1080} />
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <WarmVignette strength={0.2} />
      </AbsoluteFill>
    </>
  );
};

/* ===================== OVERLAY DE TEXTO SOBRE EL AVATAR =================== */

const TalkOverlay: React.FC<{cue: Cue; beatF: number}> = ({cue, beatF}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const accent = cue.accent || VAL.gold;
  const words = (cue.title ?? '').trim().split(/\s+/).filter(Boolean);
  const stagger = words.length > 1 ? Math.min(0.24, Math.max(0.09, 2.2 / words.length)) : 0;
  const subStart = 0.55 + stagger * Math.max(0, words.length - 1) + 0.35;
  const OUT = 0.45;
  const out = interpolate(frame, [beatF - Math.round(OUT * fps), beatF - 2], [0, 1], CLAMP);
  const driftY = Math.sin(frame * 0.045) * height * 0.0022;
  const k = spring({frame: frame - Math.round(0.22 * fps), fps, config: {damping: 20, stiffness: 100, mass: 0.8}});
  const scrimO = interpolate(k, [0, 1], [0, 1], CLAMP) * (1 - out);
  const fontSize = Math.round(Math.min(width * 0.033, height * 0.052));
  if (!cue.title && !cue.kicker) return null;
  return (
    <>
      <AbsoluteFill
        style={{
          opacity: 0.9 * scrimO,
          pointerEvents: 'none',
          background: `linear-gradient(to top, ${rgba(VAL.paper, 0.82)} 0%, ${rgba(VAL.paper, 0.3)} 26%, transparent 52%), radial-gradient(75% 65% at 16% 84%, ${rgba(VAL.paper, 0.5)}, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '7%',
          bottom: '10.5%',
          width: '58%',
          opacity: 1 - out,
          filter: `blur(${out * 9}px)`,
          transform: `translateY(${driftY + out * 26}px)`,
          transformOrigin: '0% 100%',
        }}
      >
        {cue.kicker ? <Kicker text={cue.kicker} accent={accent} startSec={0.24} /> : null}
        {cue.title ? (
          <div style={{marginTop: height * 0.02}}>
            <Words text={cue.title} hot={cue.hot} accent={accent} startSec={0.5} size={fontSize} staggerSec={stagger} uppercase={false} />
          </div>
        ) : null}
        {cue.sub ? (
          <div
            style={{
              marginTop: height * 0.02,
              paddingLeft: 16,
              borderLeft: `2px solid ${accent}`,
              fontFamily: FONT_SERIF_FINE,
              fontStyle: 'italic',
              fontSize: Math.round(fontSize * 0.5),
              color: VAL.ink2,
              opacity: interpolate(frame, [Math.round(subStart * fps), Math.round((subStart + 0.5) * fps)], [0, 1], CLAMP),
            }}
          >
            {cue.sub}
          </div>
        ) : null}
      </div>
    </>
  );
};

/* ============================ RENDER DE UNA CUE ========================== */

const CueScene: React.FC<{cue: Cue; totalF: number}> = ({cue, totalF}) => {
  const accent = cue.accent || VAL.gold;
  const mood = (cue.mood || 'gold') as ValMood;
  const variant = cue.variant || 'whip';
  switch (cue.kind) {
    case 'full':
      return (
        <ValFullShot
          variant={variant}
          totalF={totalF}
          src={sf(cue.src)}
          video={cue.video}
          caption={cue.caption}
          kicker={cue.kicker}
          accent={accent}
          mood={mood}
          ken={cue.ken || 'in'}
        />
      );
    case 'chapter':
      return <ValChapter variant={variant} totalF={totalF} kicker={cue.kicker} index={cue.index} title={cue.title} sub={cue.sub} accent={accent} mood={mood} />;
    case 'hero':
      return <ValHero variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} side={cue.side || 'left'} />;
    case 'stat':
      return <ValStat variant={variant} totalF={totalF} kicker={cue.kicker} value={cue.value} suffix={cue.suffix} prefix={cue.prefix} decimals={cue.decimals} label={cue.label} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'quote':
      return <ValQuote variant={variant} totalF={totalF} kicker={cue.kicker} quote={cue.quote} author={cue.author} role={cue.role} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'molecule':
      return <ValMolecule variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} centerLabel={cue.centerLabel} image={sf(cue.image)} nodes={cue.nodes} accent={accent} mood={mood} />;
    case 'step':
      return <ValStep variant={variant} totalF={totalF} step={cue.step} total={cue.total} title={cue.title} hot={cue.hot} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'beforeafter':
      return <ValBeforeAfter variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} imageA={sf(cue.imageA)} imageB={sf(cue.imageB)} labelA={cue.labelA} labelB={cue.labelB} accent={accent} mood={mood} />;
    case 'checklist':
      return <ValChecklist variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} items={cue.items} accent={accent} mood={mood} />;
    case 'cta':
      return <ValCta variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} buttonLabel={cue.buttonLabel} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'lowerthird':
      return <ValLowerThird variant={variant} totalF={totalF} name={cue.name} role={cue.role} topic={cue.topic} accent={accent} avatarSrc={AVATAR} />;
    case 'carousel':
      // ⚠ las cards se dibujan con <Img src={card.image}> CRUDO dentro de CarouselCard → hay que
      // pasar la ruta ya resuelta con staticFile(), si no da 404 en el render (era la causa de que
      // fallaran los chunks del carrusel). El resto de las imágenes ya pasan por sf().
      return (
        <ValOilCarousel
          cards={(cue.cards || []).map((c) => ({...c, image: sf(c.image) as string})) as ValCarouselCard[]}
          focus={cue.focus}
          kicker={cue.kicker}
          accent={accent}
          intro={cue.intro}
        />
      );
    default:
      return null;
  }
};

/* ================================ MAIN ================================== */

export const MainValeriaNariz: React.FC = () => {
  const {fps} = useVideoConfig();
  const cuts = React.useMemo(() => BEATS.filter((b) => b.kind !== 'talk').map((b) => b.start), []);
  const fadeIn = interpolate(useCurrentFrame(), [0, 12], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
      <Audio src={staticFile('valerianariz.wav')} />
      <AvatarLayer cuts={cuts} />
      {BEATS.map((cue) => {
        const from = Math.round(cue.start * fps);
        const df = Math.max(1, Math.round(cue.dur * fps));
        return (
          <Sequence key={cue.id} from={from} durationInFrames={df} premountFor={20} name={`${cue.kind} · ${cue.id}`}>
            {cue.kind === 'talk' ? <TalkOverlay cue={cue} beatF={df} /> : <CueScene cue={cue} totalF={df} />}
          </Sequence>
        );
      })}
      <PaperGrain />
      <AbsoluteFill style={{zIndex: 50, background: VAL.paper, opacity: fadeIn, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = TOTAL_FRAMES_VN;
export default MainValeriaNariz;
