/**
 * Scenes7 — microescenas 2.5D propias del video #7 "3 Proteínas Seguras (y 3 Peores)".
 * Estándar del canal: material protagonista + profundidad real (perspective/translateZ) +
 * cámara viva + foto REAL dentro de vidrio (nunca vectores planos). Sin backdrop-filter.
 */
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, GrainOverlay, rgba} from './theme';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sf = (p: string) => staticFile(p);

/** Fondo navy común de las escenas de profundidad (con cámara viva). */
const DepthBg: React.FC<{tint?: string}> = ({tint = BAS.aqua}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <AbsoluteFill style={{background: `linear-gradient(155deg, ${BAS.bgPanel}, ${BAS.bgDeep} 62%, ${BAS.bgEdge})`}} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 52% at ${50 + Math.sin(f / fps * 0.35) * 4}% 40%, ${rgba(tint, 0.2)}, transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{background: `radial-gradient(125% 118% at 50% 46%, transparent 48%, ${rgba(BAS.bgEdge, 0.72)} 100%)`}} />
      <GrainOverlay opacity={0.06} />
    </>
  );
};

/** Tarjeta de vidrio con FOTO real adentro (el idioma visual del canal). */
const GlassPhoto: React.FC<{
  img: string;
  w: number;
  h: number;
  z?: number;
  delay?: number;
  accent?: string;
  label?: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
}> = ({img, w, h, z = 0, delay = 0, accent = BAS.aqua, label, sub, badge, badgeColor}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - delay, fps, config: {damping: 140, mass: 0.9}});
  const float = Math.sin((f - delay) / fps * 0.9) * 5;
  return (
    <div
      style={{
        width: w,
        transform: `translateZ(${z}px) translateY(${interpolate(p, [0, 1], [70, 0]) + float}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        opacity: p,
      }}
    >
      <div
        style={{
          position: 'relative',
          height: h,
          borderRadius: 26,
          overflow: 'hidden',
          border: `1px solid ${rgba('#ffffff', 0.22)}`,
          boxShadow: `${CARD_SHADOW}, 0 0 34px ${rgba(accent, 0.28)}`,
          background: rgba('#ffffff', 0.06),
        }}
      >
        <Img src={sf(`img/${img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${rgba('#ffffff', 0.16)}, transparent 34%, ${rgba(BAS.bgEdge, 0.55)})`}} />
        <AbsoluteFill style={{boxShadow: `inset 0 1px 0 ${rgba('#ffffff', 0.35)}, inset 0 -40px 60px ${rgba(BAS.bgEdge, 0.4)}`}} />
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: badgeColor ?? accent,
              color: badgeColor === BAS.no ? BAS.onNo : badgeColor === BAS.si ? BAS.onSi : BAS.onAqua,
              fontFamily: FONT_SANS,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 1,
              padding: '8px 20px',
              borderRadius: 999,
              boxShadow: `0 10px 26px ${rgba('#000', 0.45)}`,
            }}
          >
            {badge}
          </div>
        )}
      </div>
      {label && (
        <div style={{marginTop: 16, textAlign: 'center'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 700, color: '#F4F1E9', textShadow: '0 4px 18px rgba(0,0,0,0.6)'}}>{label}</div>
          {sub && <div style={{fontFamily: FONT_SANS, fontSize: 28, fontWeight: 600, color: rgba('#EAF2F4', 0.86), marginTop: 4}}>{sub}</div>}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * ASH SCENE — "no toda la leña deja la misma ceniza": dos hogares enfrentados.
 * ========================================================================== */
export const AshScene: React.FC<{
  leftImg?: string;
  rightImg?: string;
  title?: string;
}> = ({leftImg = 'bas7_broll_lena_limpia.jpg', rightImg = 'bas7_broll_hollin.jpg', title = 'La misma leña… no la misma ceniza'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = interpolate(f, [0, 70], [0, 1], {...CLAMP, easing: easeIO});
  const dolly = interpolate(cam, [0, 1], [0.94, 1.02]);
  const ry = interpolate(cam, [0, 1], [6, 1]) + Math.sin(f / fps * 0.4) * 0.4;
  const titleP = interpolate(f, [4, 24], [0, 1], {...CLAMP, easing: easeOut});
  return (
    <AbsoluteFill>
      <DepthBg tint={BAS.amber} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1500}}>
        <div style={{transform: `scale(${dolly}) rotateY(${ry}deg)`, transformStyle: 'preserve-3d', textAlign: 'center'}}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 62,
              fontWeight: 800,
              color: '#F4F1E9',
              marginBottom: 34,
              opacity: titleP,
              transform: `translateY(${interpolate(titleP, [0, 1], [20, 0])}px)`,
              textShadow: '0 6px 26px rgba(0,0,0,0.65)',
            }}
          >
            {title}
          </div>
          <div style={{display: 'flex', gap: 56, alignItems: 'flex-start'}}>
            <GlassPhoto img={leftImg} w={620} h={430} z={30} delay={10} accent={BAS.si} label="Arde limpia" sub="deja el hogar casi vacío" badge="✓" badgeColor={BAS.si} />
            <GlassPhoto img={rightImg} w={620} h={430} z={-20} delay={26} accent={BAS.no} label="Deja hollín" sub="tapa el tiraje" badge="✕" badgeColor={BAS.no} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================================
 * ASH TRIAD — la ceniza son tres cosas: fósforo · sal · acidez.
 * ========================================================================== */
export const AshTriad: React.FC<{items?: {img: string; name: string; sub: string}[]}> = ({
  items = [
    {img: 'bas6_broll_sarro.jpg', name: 'FÓSFORO', sub: 'sarro en sus arterias'},
    {img: 'bas6_p_tensiometro.jpg', name: 'SAL', sub: 'retiene agua, sube la presión'},
    {img: 'bas6_p_rinon_filtro.jpg', name: 'ACIDEZ', sub: 'el filtro compensando todo el día'},
  ],
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = interpolate(f, [0, 80], [0, 1], {...CLAMP, easing: easeIO});
  const dolly = interpolate(cam, [0, 1], [0.95, 1.03]);
  const drift = Math.sin(f / fps * 0.35) * 8;
  const titleP = interpolate(f, [2, 20], [0, 1], {...CLAMP, easing: easeOut});
  return (
    <AbsoluteFill>
      <DepthBg tint={BAS.amber} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1600}}>
        <div style={{transform: `scale(${dolly}) translateX(${drift}px)`, transformStyle: 'preserve-3d', textAlign: 'center'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 58, fontWeight: 800, color: '#F4F1E9', marginBottom: 30, opacity: titleP, textShadow: '0 6px 26px rgba(0,0,0,0.6)'}}>
            ¿Qué es esa ceniza?
          </div>
          <div style={{display: 'flex', gap: 40}}>
            {items.map((it, i) => (
              <GlassPhoto key={it.name} img={it.img} w={430} h={330} z={i === 1 ? 40 : -10} delay={12 + i * 16} accent={BAS.amber} label={it.name} sub={it.sub} />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================================
 * RULE CARD — la regla de oro (una pregunta grande + foto de apoyo).
 * ========================================================================== */
export const RuleCard: React.FC<{
  kicker?: string;
  question: string;
  answer: string;
  note?: string;
  img?: string;
  accent?: string;
}> = ({kicker = 'La regla de oro', question, answer, note, img = 'bas7_broll_palma.jpg', accent = BAS.aqua}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = interpolate(f, [0, 70], [0, 1], {...CLAMP, easing: easeIO});
  const p = spring({frame: f, fps, config: {damping: 150, mass: 0.9}});
  const ansP = spring({frame: f - 30, fps, config: {damping: 130}});
  const noteP = spring({frame: f - 52, fps, config: {damping: 130}});
  return (
    <AbsoluteFill>
      <DepthBg tint={accent} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1500}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 56, transform: `scale(${interpolate(cam, [0, 1], [0.95, 1.02])})`, transformStyle: 'preserve-3d'}}>
          <GlassPhoto img={img} w={560} h={460} z={20} delay={8} accent={accent} />
          <div style={{width: 720, textAlign: 'left'}}>
            <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 800, letterSpacing: 4, color: accent, opacity: p, marginBottom: 14}}>{kicker.toUpperCase()}</div>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 62,
                fontWeight: 800,
                color: '#F4F1E9',
                lineHeight: 1.12,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
                textShadow: '0 6px 26px rgba(0,0,0,0.6)',
              }}
            >
              {question}
            </div>
            <div
              style={{
                marginTop: 26,
                display: 'inline-block',
                background: BAS.card,
                color: BAS.ink,
                borderRadius: 18,
                padding: '18px 32px',
                borderLeft: `8px solid ${accent}`,
                boxShadow: CARD_SHADOW,
                fontFamily: FONT_SANS,
                fontSize: 46,
                fontWeight: 800,
                opacity: ansP,
                transform: `translateY(${interpolate(ansP, [0, 1], [22, 0])}px)`,
              }}
            >
              {answer}
            </div>
            {note && (
              <div style={{marginTop: 22, fontFamily: FONT_SANS, fontSize: 32, fontWeight: 600, color: rgba('#EAF2F4', 0.9), opacity: noteP}}>{note}</div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================================
 * GUIDE PAGE — la LÁMINA: una página de la guía, grilla de FOTOS + textos.
 * Es la técnica de oro del canal: se muestra y se dice "esto es la guía".
 * ========================================================================== */
export type GuideItem = {img: string; name: string; line1: string; line2?: string; verdict?: 'si' | 'medio' | 'no'};

const VCOLOR: Record<string, string> = {si: BAS.si, medio: BAS.amber, no: BAS.no};
const VLABEL: Record<string, string> = {si: 'SÍ', medio: 'CON MEDIDA', no: 'NO'};

export const GuidePage: React.FC<{
  title: string;
  kicker?: string;
  items: GuideItem[];
  columns?: number;
  footer?: string;
  tag?: string;
}> = ({title, kicker = 'Página · La guía completa', items, columns = 3, footer, tag}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = interpolate(f, [0, 90], [0, 1], {...CLAMP, easing: easeIO});
  const paperP = spring({frame: f, fps, config: {damping: 150, mass: 1}});
  const titleP = interpolate(f, [8, 26], [0, 1], {...CLAMP, easing: easeOut});
  const footP = interpolate(f, [40, 62], [0, 1], {...CLAMP, easing: easeOut});
  const cardW = columns >= 3 ? 500 : 660;
  const imgH = columns >= 3 ? 300 : 360;
  return (
    <AbsoluteFill>
      <DepthBg tint={BAS.aqua} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1800}}>
        <div
          style={{
            width: 1720,
            padding: '46px 54px 40px',
            borderRadius: 30,
            background: `linear-gradient(160deg, ${BAS.card}, ${BAS.cardWarm})`,
            border: `1px solid ${BAS.cardEdge}`,
            boxShadow: CARD_SHADOW,
            transform: `scale(${interpolate(cam, [0, 1], [0.94, 1.0])}) rotateX(${interpolate(cam, [0, 1], [4, 0.6])}deg) translateY(${interpolate(paperP, [0, 1], [60, 0])}px)`,
            opacity: paperP,
            transformStyle: 'preserve-3d',
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, opacity: titleP}}>
            <div>
              <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 800, letterSpacing: 4, color: BAS.brandLite}}>{kicker.toUpperCase()}</div>
              <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 800, color: BAS.ink, lineHeight: 1.05, marginTop: 6}}>{title}</div>
            </div>
            {tag && (
              <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 800, letterSpacing: 2, color: BAS.onAqua, background: BAS.aqua, borderRadius: 999, padding: '10px 22px'}}>{tag}</div>
            )}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(${columns}, ${cardW}px)`, gap: 30, justifyContent: 'center'}}>
            {items.map((it, i) => {
              const ip = spring({frame: f - 18 - i * 9, fps, config: {damping: 140, mass: 0.85}});
              const col = it.verdict ? VCOLOR[it.verdict] : BAS.brandLite;
              return (
                <div
                  key={it.name}
                  style={{
                    background: '#FFFDF7',
                    borderRadius: 22,
                    overflow: 'hidden',
                    border: `1px solid ${BAS.cardEdge}`,
                    borderTop: `8px solid ${col}`,
                    boxShadow: `0 18px 36px ${rgba('#000', 0.18)}`,
                    opacity: ip,
                    transform: `translateY(${interpolate(ip, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div style={{position: 'relative', height: imgH}}>
                    <Img src={sf(`img/${it.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    {it.verdict && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          background: col,
                          color: it.verdict === 'no' ? BAS.onNo : it.verdict === 'si' ? BAS.onSi : BAS.onAmber,
                          fontFamily: FONT_SANS,
                          fontWeight: 800,
                          fontSize: 26,
                          letterSpacing: 1,
                          padding: '8px 18px',
                          borderRadius: 999,
                        }}
                      >
                        {VLABEL[it.verdict]}
                      </div>
                    )}
                  </div>
                  <div style={{padding: '18px 24px 22px'}}>
                    <div style={{fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 800, color: BAS.ink, lineHeight: 1.05}}>{it.name}</div>
                    <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, color: BAS.ink2, marginTop: 8}}>{it.line1}</div>
                    {it.line2 && <div style={{fontFamily: FONT_SANS, fontSize: 28, fontWeight: 600, color: BAS.inkSoft, marginTop: 4}}>{it.line2}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {footer && (
            <div style={{marginTop: 26, textAlign: 'center', fontFamily: FONT_SANS, fontSize: 32, fontWeight: 700, color: BAS.ink2, opacity: footP}}>{footer}</div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================================
 * BOTIQUIN PAGE — la lámina de los 27 productos (foto real de fondo + panel).
 * ========================================================================== */
export const BotiquinPage: React.FC<{img?: string; title?: string; bullets?: string[]; count?: string}> = ({
  img = 'bas7_lamina_b.jpg',
  title = 'El botiquín traicionero',
  bullets = ['Pastillas de venta libre', 'Hierbas y "naturales"', 'Suplementos y polvos'],
  count = '27',
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = interpolate(f, [0, 260], [1.06, 1.14], CLAMP);
  const panelP = spring({frame: f - 12, fps, config: {damping: 150, mass: 0.95}});
  const numP = spring({frame: f - 26, fps, config: {damping: 120, mass: 0.8}});
  return (
    <AbsoluteFill style={{background: BAS.bgDeep}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img src={sf(`img/${img}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(100deg, ${rgba(BAS.bgEdge, 0.92)} 30%, ${rgba(BAS.bgDeep, 0.55)} 62%, transparent)`}} />
      <GrainOverlay opacity={0.06} />
      <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'center', padding: '0 0 0 110px'}}>
        <div style={{width: 760, opacity: panelP, transform: `translateX(${interpolate(panelP, [0, 1], [-50, 0])}px)`}}>
          <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 800, letterSpacing: 4, color: BAS.amber}}>PÁGINA · LA GUÍA COMPLETA</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 10}}>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 190,
                fontWeight: 800,
                color: BAS.amber,
                lineHeight: 0.9,
                textShadow: `0 0 40px ${rgba(BAS.amber, 0.45)}, 0 10px 30px rgba(0,0,0,0.6)`,
                transform: `scale(${interpolate(numP, [0, 1], [0.7, 1])})`,
                opacity: numP,
              }}
            >
              {count}
            </div>
            <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 800, color: '#F4F1E9', textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>{title}</div>
          </div>
          <div style={{marginTop: 30}}>
            {bullets.map((b, i) => {
              const bp = spring({frame: f - 40 - i * 12, fps, config: {damping: 140}});
              return (
                <div
                  key={b}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    background: BAS.card,
                    borderRadius: 16,
                    padding: '16px 26px',
                    marginBottom: 14,
                    borderLeft: `7px solid ${BAS.amber}`,
                    boxShadow: CARD_SHADOW,
                    opacity: bp,
                    transform: `translateY(${interpolate(bp, [0, 1], [24, 0])}px)`,
                  }}
                >
                  <span style={{fontFamily: FONT_SANS, fontSize: 36, fontWeight: 800, color: BAS.ink}}>{b}</span>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 20, fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, color: rgba('#EAF2F4', 0.92)}}>
            Uno por uno, y qué le hace a un riñón cansado.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================================
 * METHOD SCENE — qué hay adentro de la guía (cierre del círculo del CTA).
 * ========================================================================== */
export const MethodScene: React.FC<{rows?: {img: string; title: string; sub: string}[]}> = ({
  rows = [
    {img: 'bas7_lamina_c.jpg', title: 'El semáforo renal', sub: 'casi 300 alimentos · porción exacta'},
    {img: 'bas6_p_calendario_pared.jpg', title: '90 días, día por día', sub: 'hasta su próximo análisis'},
    {img: 'bas7_lamina_b.jpg', title: 'El botiquín traicionero', sub: '27 pastillas y suplementos'},
    {img: 'bas6_p_analisis_comparar.jpg', title: 'Su análisis traducido', sub: 'qué dice cada sigla del papel'},
  ],
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = interpolate(f, [0, 120], [0, 1], {...CLAMP, easing: easeIO});
  const titleP = spring({frame: f, fps, config: {damping: 150}});
  return (
    <AbsoluteFill>
      <DepthBg tint={BAS.aqua} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1700}}>
        <div style={{transform: `scale(${interpolate(cam, [0, 1], [0.96, 1.02])})`, transformStyle: 'preserve-3d'}}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 60,
              fontWeight: 800,
              color: '#F4F1E9',
              textAlign: 'center',
              marginBottom: 30,
              opacity: titleP,
              textShadow: '0 6px 26px rgba(0,0,0,0.6)',
            }}
          >
            Lo que hay adentro de la guía
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 780px)', gap: 26}}>
            {rows.map((r, i) => {
              const p = spring({frame: f - 16 - i * 14, fps, config: {damping: 140, mass: 0.9}});
              return (
                <div
                  key={r.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    background: BAS.card,
                    borderRadius: 22,
                    padding: 18,
                    boxShadow: CARD_SHADOW,
                    borderLeft: `8px solid ${BAS.aqua}`,
                    opacity: p,
                    transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px)`,
                  }}
                >
                  <div style={{width: 200, height: 150, borderRadius: 14, overflow: 'hidden', flexShrink: 0, boxShadow: `0 10px 24px ${rgba('#000', 0.25)}`}}>
                    <Img src={sf(`img/${r.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                  <div>
                    <div style={{fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 800, color: BAS.ink, lineHeight: 1.05}}>{r.title}</div>
                    <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, color: BAS.ink2, marginTop: 6}}>{r.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
