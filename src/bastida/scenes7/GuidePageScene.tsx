/**
 * GuidePageScene — LA LÁMINA (microescena 2.5D, familia "editorial / macro impresa").
 *
 * Idea visual: una PÁGINA FÍSICA de la guía del Dr. Bastida — papel clínico real, con canto,
 * sombra de contacto y fotos pegadas como copias impresas — que ATERRIZA en el espacio delante
 * del espectador. No es un panel: es una hoja que cae, se apoya y se queda quieta para que el
 * paciente la lea (y le saque una foto).
 *
 * Material protagonista: PAPEL (tooth + grano + canto + reflejo especular que barre una sola vez).
 * Profundidad (5 planos): fondo navy · halo aqua · canto del papel (−Z) · superficie · fotos (+Z).
 * Cámara: dolly-in lentísimo + drift senoidal mínimo. Es una página para LEER.
 *
 * Se usa 3 veces en el video: A "Las 3 seguras" (3 ítems), C "El semáforo de las proteínas"
 * (6 ítems, 3×2) y el recap final.
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, GrainOverlay, rgba, shade} from './../theme';

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.42, 0, 0.2, 1);

/* ─────────────────────────── contrato ─────────────────────────── */

export type GuideItem = {
  img: string;
  name: string;
  line1: string;
  line2?: string;
  verdict?: 'si' | 'medio' | 'no';
};

export type GuidePageSceneProps = {
  title: string;
  kicker?: string;
  items: GuideItem[];
  columns?: number;
  footer?: string;
  tag?: string;
  page?: string;
};

/* ─────────────────────────── coreografía ─────────────────────────── */

const F_SHEET = 0; // la hoja entra
const F_KICKER = 10;
const F_TITLE = 15;
const F_TAG = 20;
const F_RULE = 24; // el filete se dibuja
const F_CARD0 = 32; // primera foto
const D_CARD = 9; // desfase entre fotos

/* ─────────────────────────── helpers ─────────────────────────── */

/** Acepta 'bas7_clara.jpg' o 'img/bas7_clara.jpg'. */
const assetPath = (p: string): string => (p.includes('/') ? p : `img/${p}`);

const VERDICT: Record<'si' | 'medio' | 'no', {label: string; bg: string; ink: string; edge: string}> = {
  si: {label: 'SÍ', bg: BAS.si, ink: BAS.onSi, edge: BAS.siDark},
  medio: {label: 'CON MEDIDA', bg: BAS.amber, ink: BAS.onAmber, edge: BAS.amberDark},
  no: {label: 'NO', bg: BAS.no, ink: BAS.onNo, edge: BAS.noDark},
};

/** Marca de corte de imprenta (esquina). */
const CropMark: React.FC<{corner: 'tl' | 'tr' | 'bl' | 'br'; opacity: number}> = ({corner, opacity}) => {
  const top = corner === 'tl' || corner === 'tr';
  const left = corner === 'tl' || corner === 'bl';
  const line = rgba(BAS.inkSoft, 0.55);
  return (
    <div
      style={{
        position: 'absolute',
        [top ? 'top' : 'bottom']: 22,
        [left ? 'left' : 'right']: 22,
        width: 26,
        height: 26,
        opacity,
        pointerEvents: 'none',
        [top ? 'borderTop' : 'borderBottom']: `1.5px solid ${line}`,
        [left ? 'borderLeft' : 'borderRight']: `1.5px solid ${line}`,
      } as React.CSSProperties}
    />
  );
};

/* ─────────────────────────── escena ─────────────────────────── */

export const GuidePageScene: React.FC<GuidePageSceneProps> = ({
  title,
  kicker = 'Página · La guía completa',
  items,
  columns = 3,
  footer,
  tag,
  page,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;

  const cols = Math.max(1, Math.min(columns, items.length));
  const rows = Math.max(1, Math.ceil(items.length / cols));
  const hasLine2 = items.some((it) => Boolean(it.line2));

  /* ── métrica de la página (todo respira: márgenes generosos) ── */
  const PAPER_W = 1700;
  const PAD_X = 62;
  const PAD_TOP = 46;
  const PAD_BOTTOM = 40;
  const HEAD_H = 186;
  const FOOT_H = 62;
  const GRID_GAP = 28;

  const photoH = rows === 1 ? (hasLine2 ? 330 : 362) : hasLine2 ? 136 : 166;
  const nameSize = rows === 1 ? 54 : 44; // ≥ 42px (regla +60)
  const lineSize = rows === 1 ? 33 : 29; // ≥ 28px
  const cardPad = rows === 1 ? 18 : 14;
  const cardH =
    cardPad * 2 +
    photoH +
    (rows === 1 ? 18 : 12) +
    Math.round(nameSize * 1.06) +
    8 +
    Math.round(lineSize * 1.3) +
    (hasLine2 ? Math.round(lineSize * 1.25) + 4 : 0);

  const gridH = rows * cardH + (rows - 1) * GRID_GAP;
  const PAPER_H = PAD_TOP + HEAD_H + gridH + FOOT_H + PAD_BOTTOM;

  /* ── acto 1 · la hoja aterriza ── */
  const land = spring({frame: frame - F_SHEET, fps, config: {damping: 200, mass: 1.15, stiffness: 78}});
  const rotX = interpolate(land, [0, 1], [6.2, 0.6]);
  const sheetY = interpolate(land, [0, 1], [54, 0]);
  const sheetScale = interpolate(land, [0, 1], [0.976, 1]);
  const sheetOp = interpolate(frame, [F_SHEET, F_SHEET + 10], [0, 1], CL);

  // sombras: una difusa grande + una de CONTACTO corta, ambas se cierran al apoyar
  const diffY = interpolate(land, [0, 1], [78, 30]);
  const diffB = interpolate(land, [0, 1], [140, 74]);
  const diffA = interpolate(land, [0, 1], [0.3, 0.5]);
  const contY = interpolate(land, [0, 1], [34, 9]);
  const contB = interpolate(land, [0, 1], [52, 16]);
  const contA = interpolate(land, [0, 1], [0.16, 0.46]);

  /* ── cámara: push-in lentísimo + drift senoidal mínimo ── */
  const camA = interpolate(frame, [0, 100], [0, 1], {...CL, easing: easeOut});
  const dolly = interpolate(camA, [0, 1], [0.962, 1.006]) + interpolate(frame, [100, 1200], [0, 0.016], CL);
  const breath = 1 + Math.sin(t * 0.42) * 0.0022; // respiración < 0.5 %
  const driftX = Math.sin(t * 0.31) * 3.0;
  const driftY = Math.cos(t * 0.24) * 1.8;
  const camRotY = Math.sin(t * 0.19) * 0.32; // grados — apenas insinuado

  /* ── encabezado ── */
  const kickP = interpolate(frame, [F_KICKER, F_KICKER + 12], [0, 1], {...CL, easing: easeOut});
  const titleP = interpolate(frame, [F_TITLE, F_TITLE + 16], [0, 1], {...CL, easing: easeOut});
  const tagS = spring({frame: frame - F_TAG, fps, config: {damping: 15, stiffness: 130, mass: 0.7}});
  const ruleP = interpolate(frame, [F_RULE, F_RULE + 22], [0, 1], {...CL, easing: easeInOut});

  /* ── pie + folio (últimos en entrar) ── */
  const F_FOOT = F_CARD0 + items.length * D_CARD + 12;
  const footP = interpolate(frame, [F_FOOT, F_FOOT + 16], [0, 1], {...CL, easing: easeOut});
  const pageP = interpolate(frame, [F_FOOT + 6, F_FOOT + 22], [0, 1], {...CL, easing: easeOut});

  /* ── brillo especular: barre el papel UNA sola vez y no vuelve ── */
  const F_SHEEN = F_FOOT + 40;
  const sheenP = interpolate(frame, [F_SHEEN, F_SHEEN + 80], [0, 1], {...CL, easing: easeInOut});
  const sheenOp = interpolate(sheenP, [0, 0.16, 0.84, 1], [0, 0.5, 0.5, 0], CL);

  const cx = width / 2;
  const cy = height / 2 + 4;

  /* ── una foto impresa de la guía ── */
  const Card: React.FC<{it: GuideItem; i: number}> = ({it, i}) => {
    const s = spring({
      frame: frame - (F_CARD0 + i * D_CARD),
      fps,
      config: {damping: 18, stiffness: 108, mass: 0.9}, // overshoot corto, sin rebote infantil
    });
    const app = interpolate(frame, [F_CARD0 + i * D_CARD, F_CARD0 + i * D_CARD + 9], [0, 1], CL);
    const ty = interpolate(s, [0, 1], [36, 0]);
    const sc = interpolate(s, [0, 1], [0.93, 1]);
    const rx = interpolate(s, [0, 1], [5, 0]);
    // parallax propio respecto del papel (2–4 px) — el hold nunca queda congelado
    const px = Math.sin(t * 0.46 + i * 1.13) * 2.4;
    const py = Math.cos(t * 0.37 + i * 0.79) * 1.6;
    const shA = interpolate(s, [0, 1], [0.1, 0.26]);
    const v = it.verdict ? VERDICT[it.verdict] : null;
    const chip = spring({
      frame: frame - (F_CARD0 + i * D_CARD + 10),
      fps,
      config: {damping: 14, stiffness: 150, mass: 0.6},
    });

    return (
      <div
        style={{
          position: 'relative',
          height: cardH,
          opacity: app,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${14 + (i % 2) * 3}px) translate3d(${px}px, ${ty + py}px, 0) rotateX(${rx}deg) scale(${sc})`,
        }}
      >
        {/* cuerpo de la ficha: papel un punto más profundo, pegado sobre la página */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            background: `linear-gradient(168deg, ${shade(BAS.card, 0.35)} 0%, ${BAS.cardWarm} 100%)`,
            border: `1px solid ${BAS.cardEdge}`,
            boxShadow: `0 ${Math.round(14 * s + 3)}px ${Math.round(26 * s + 8)}px ${rgba('#1B2A33', shA)}, 0 2px 4px ${rgba('#1B2A33', shA * 0.7)}, inset 0 1px 0 ${rgba('#FFFFFF', 0.8)}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: cardPad,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* la copia impresa */}
          <div
            style={{
              position: 'relative',
              height: photoH,
              borderRadius: 5,
              overflow: 'hidden',
              background: shade(BAS.ink, 0.2),
              boxShadow: `inset 0 0 0 1px ${rgba(BAS.ink, 0.22)}, inset 0 -14px 26px ${rgba(BAS.ink, 0.2)}`,
            }}
          >
            <Img
              src={staticFile(assetPath(it.img))}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'saturate(1.02) contrast(1.04)',
              }}
            />
            {/* tinta de imprenta: leve viñeta cálida sobre la foto */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(120% 100% at 50% 30%, transparent 52%, ${rgba('#2A1E10', 0.26)} 100%)`,
              }}
            />
            {/* reflejo de la hoja sobre el papel fotográfico */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(118deg, ${rgba('#FFFFFF', 0.16)} 0%, transparent 34%)`,
              }}
            />
            {/* chip de veredicto */}
            {v ? (
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  bottom: 12,
                  padding: rows === 1 ? '9px 20px' : '7px 15px',
                  borderRadius: 999,
                  background: v.bg,
                  border: `1.5px solid ${rgba('#FFFFFF', 0.35)}`,
                  boxShadow: `0 6px 14px ${rgba(v.edge, 0.55)}, inset 0 1px 0 ${rgba('#FFFFFF', 0.4)}`,
                  transform: `scale(${interpolate(chip, [0, 1], [0.7, 1])})`,
                  transformOrigin: 'left bottom',
                  opacity: chip,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: rows === 1 ? 27 : 23,
                    fontWeight: 800,
                    letterSpacing: 1.6,
                    color: v.ink,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {v.label}
                </span>
              </div>
            ) : null}
          </div>

          {/* nombre del ítem */}
          <div
            style={{
              marginTop: rows === 1 ? 18 : 12,
              fontFamily: FONT_DISPLAY,
              fontSize: nameSize,
              lineHeight: 1.06,
              fontWeight: 700,
              color: BAS.ink,
              letterSpacing: -0.3,
            }}
          >
            {it.name}
          </div>

          {/* detalle: preparación / porción */}
          <div
            style={{
              marginTop: 8,
              fontFamily: FONT_SANS,
              fontSize: lineSize,
              lineHeight: 1.28,
              fontWeight: 600,
              color: BAS.ink2,
            }}
          >
            {it.line1}
          </div>
          {it.line2 ? (
            <div
              style={{
                marginTop: 4,
                fontFamily: FONT_SANS,
                fontSize: lineSize,
                lineHeight: 1.24,
                fontWeight: 500,
                color: BAS.inkSoft,
              }}
            >
              {it.line2}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{background: BAS.bgDeep, overflow: 'hidden'}}>
      {/* fondo: navy de hidratación + halo aqua detrás de la página */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(115% 105% at 50% 34%, ${BAS.bgPanel} 0%, ${BAS.bg} 46%, ${BAS.bgDeep} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(48% 40% at 50% 42%, ${rgba(BAS.aqua, 0.14)} 0%, transparent 72%)`,
          opacity: interpolate(frame, [0, 26], [0.4, 1], CL),
        }}
      />

      {/* escena 3D */}
      <AbsoluteFill style={{perspective: 1800, perspectiveOrigin: '50% 46%'}}>
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: cy,
            width: PAPER_W,
            height: PAPER_H,
            marginLeft: -PAPER_W / 2,
            marginTop: -PAPER_H / 2,
            transformStyle: 'preserve-3d',
            opacity: sheetOp,
            transform: `translate3d(${driftX}px, ${sheetY + driftY}px, 0) rotateX(${rotX}deg) rotateY(${camRotY}deg) scale(${sheetScale * dolly * breath})`,
          }}
        >
          {/* CANTO: capa detrás desplazada = grosor real de la hoja */}
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 4,
              right: -4,
              bottom: -4,
              borderRadius: 10,
              background: `linear-gradient(160deg, ${shade(BAS.cardEdge, -0.42)} 0%, ${shade(BAS.cardEdge, -0.62)} 100%)`,
              transform: 'translateZ(-7px)',
            }}
          />

          {/* SUPERFICIE del papel (capa plana: textura + grano + brillo) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 10,
              overflow: 'hidden',
              background: `
                radial-gradient(120% 90% at 22% 6%, ${shade(BAS.card, 0.55)} 0%, transparent 58%),
                radial-gradient(100% 110% at 88% 104%, ${shade(BAS.cardWarm, -0.1)} 0%, transparent 62%),
                linear-gradient(163deg, ${BAS.card} 0%, ${BAS.card} 42%, ${BAS.cardWarm} 100%)
              `,
              boxShadow: `
                0 ${diffY}px ${diffB}px ${rgba('#000000', diffA)},
                0 ${contY}px ${contB}px ${rgba('#000814', contA)},
                inset 0 1px 0 ${rgba('#FFFFFF', 0.85)},
                inset 0 -2px 0 ${rgba(BAS.cardEdge, 0.9)},
                inset 0 0 0 1px ${rgba(BAS.cardEdge, 0.8)}
              `,
            }}
          >
            {/* tooth del papel */}
            <GrainOverlay opacity={0.07} />
            {/* barrido especular — una sola vez */}
            <div
              style={{
                position: 'absolute',
                top: -60,
                bottom: -60,
                left: 0,
                width: '46%',
                opacity: sheenOp,
                background: `linear-gradient(104deg, transparent 0%, ${rgba('#FFFFFF', 0.62)} 46%, ${rgba('#FFFFFF', 0.9)} 52%, transparent 100%)`,
                transform: `translateX(${interpolate(sheenP, [0, 1], [-620, PAPER_W + 120])}px) skewX(-8deg)`,
                pointerEvents: 'none',
              }}
            />
            {/* pliegue tenue de imprenta al pie */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 120,
                background: `linear-gradient(180deg, transparent 0%, ${rgba(BAS.cardEdge, 0.55)} 100%)`,
                pointerEvents: 'none',
              }}
            />
            {/* marcas de corte */}
            <CropMark corner="tl" opacity={kickP * 0.9} />
            <CropMark corner="tr" opacity={kickP * 0.9} />
            <CropMark corner="bl" opacity={footP * 0.9} />
            <CropMark corner="br" opacity={footP * 0.9} />
          </div>

          {/* CONTENIDO (preserve-3d, sin clip → parallax real de las fotos) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px`,
              display: 'flex',
              flexDirection: 'column',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* ── encabezado ── */}
            <div style={{height: HEAD_H, flexShrink: 0, position: 'relative', transformStyle: 'preserve-3d'}}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 24,
                  transform: 'translateZ(6px)',
                }}
              >
                {/* rótulo de esquina */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: kickP,
                    transform: `translateX(${interpolate(kickP, [0, 1], [-14, 0])}px)`,
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 3,
                      background: BAS.aquaDark,
                      borderRadius: 2,
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 24,
                      fontWeight: 800,
                      letterSpacing: 4.4,
                      textTransform: 'uppercase',
                      color: BAS.brand,
                    }}
                  >
                    {kicker}
                  </span>
                </div>

                {/* chip "Sáquele una foto" */}
                {tag ? (
                  <div
                    style={{
                      padding: '11px 24px',
                      borderRadius: 999,
                      background: BAS.amber,
                      border: `1.5px solid ${rgba(BAS.amberDark, 0.55)}`,
                      boxShadow: `0 8px 18px ${rgba(BAS.amberDark, 0.36)}, inset 0 1px 0 ${rgba('#FFFFFF', 0.45)}`,
                      opacity: tagS,
                      transform: `scale(${interpolate(tagS, [0, 1], [0.72, 1])}) rotate(${interpolate(tagS, [0, 1], [-3.2, -1.1])}deg)`,
                      transformOrigin: 'right center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 27,
                        fontWeight: 800,
                        letterSpacing: 1.4,
                        color: BAS.onAmber,
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* título */}
              <div
                style={{
                  marginTop: 16,
                  fontFamily: FONT_DISPLAY,
                  fontSize: title.length > 34 ? 58 : 68,
                  lineHeight: 1.04,
                  fontWeight: 700,
                  color: BAS.ink,
                  letterSpacing: -0.8,
                  opacity: titleP,
                  transform: `translateZ(9px) translateY(${interpolate(titleP, [0, 1], [16, 0])}px)`,
                }}
              >
                {title}
              </div>

              {/* filete bajo el título */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 26,
                  height: 5,
                  width: `${interpolate(ruleP, [0, 1], [0, 100])}%`,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${BAS.brand} 0%, ${BAS.aquaDark} 34%, ${rgba(BAS.aquaDark, 0)} 100%)`,
                  transform: 'translateZ(5px)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 20,
                  height: 1,
                  width: `${interpolate(ruleP, [0, 1], [0, 100])}%`,
                  background: rgba(BAS.ink, 0.16),
                  transform: 'translateZ(5px)',
                }}
              />
            </div>

            {/* ── grilla de fotos ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridAutoRows: `${cardH}px`,
                flexShrink: 0,
                columnGap: 30,
                rowGap: GRID_GAP,
                transformStyle: 'preserve-3d',
              }}
            >
              {items.map((it, i) => (
                <Card key={`${it.name}-${i}`} it={it} i={i} />
              ))}
            </div>

            {/* ── pie de página ── */}
            <div
              style={{
                marginTop: 'auto',
                height: FOOT_H,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 30,
                transform: 'translateZ(4px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: footP,
                  transform: `translateY(${interpolate(footP, [0, 1], [12, 0])}px)`,
                  minHeight: 40,
                }}
              >
                {footer ? (
                  <>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: BAS.aquaDark,
                        display: 'inline-block',
                        boxShadow: `0 0 0 4px ${rgba(BAS.aquaDark, 0.16)}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 30,
                        fontWeight: 600,
                        color: BAS.ink2,
                        letterSpacing: 0.2,
                      }}
                    >
                      {footer}
                    </span>
                  </>
                ) : null}
              </div>

              {/* folio */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: pageP * 0.95,
                }}
              >
                <span style={{width: 44, height: 1, background: rgba(BAS.ink, 0.22), display: 'inline-block'}} />
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: 2.4,
                    color: BAS.inkSoft,
                  }}
                >
                  {page ? page : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* viñeta fría — cierra el encuadre sobre el papel */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(126% 112% at 50% 46%, transparent 54%, ${rgba(BAS.bgEdge, 0.6)} 100%)`,
        }}
      />
      <GrainOverlay opacity={0.045} />
    </AbsoluteFill>
  );
};

export default GuidePageScene;
