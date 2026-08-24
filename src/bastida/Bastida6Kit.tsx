/**
 * Bastida6Kit — piezas propias del video #6 "3 Semillas que Elevan su Creatinina (y 3 que la Bajan)".
 *
 * ★ La idea de embudo del video: las láminas explicativas se presentan como PÁGINAS DE LA GUÍA
 *   (feedback_laminas_como_paginas_de_la_guia). Por eso todo lo explicativo vive dentro de <GuiaPage>,
 *   que pone el papel, la profundidad y el sello de esquina "PÁGINA · LA GUÍA COMPLETA".
 *
 * Estándar obligado (references/microescenas_2_5d.md): material protagonista, profundidad real
 * (perspective + translateZ), luz de producto, entrada narrativa y UNA cámara que revela.
 * ⛔ NADA de backdrop-filter (×5 el render).
 */
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, FONT_HAND, rgba} from './theme';

const sf = (p: string) => staticFile(p);
const ease = (f: number, fps: number, delay = 0, damping = 150, mass = 0.9) =>
  spring({frame: f - delay, fps, config: {damping, mass}});

/* ============================================================ GuiaPage
 * La hoja de la guía: papel cálido con grano, canto grueso, sombra larga sobre el navy,
 * inclinación 3D que se endereza y un barrido de luz. El sello de esquina es lo que
 * convierte una lámina linda en "esto es de la guía".
 */
export const GuiaPage: React.FC<{
  title: string;
  kicker?: string;
  dur?: number;
  tag?: string;
  children?: React.ReactNode;
}> = ({title, kicker, dur = 180, tag = 'PÁGINA · LA GUÍA COMPLETA', children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = ease(f, fps, 0, 160, 1);
  // cámara: entra inclinada y se endereza, con deriva lenta (nunca queda quieta)
  const rotX = interpolate(p, [0, 1], [10, 1.2]);
  const rotY = interpolate(p, [0, 1], [-13, -1.6]);
  const z = interpolate(p, [0, 1], [-320, 0]);
  const drift = Math.sin(f / fps / 2.6) * 7;
  const scale = interpolate(f, [0, dur], [1, 1.045], {extrapolateRight: 'clamp'});
  const sweep = interpolate(f, [10, 62], [-40, 140], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const tagIn = ease(f, fps, 26, 140);

  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 50% 42%, ${BAS.bgPanel}, ${BAS.bgEdge} 78%)`}}>
      <AbsoluteFill style={{perspective: 1700, alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 1560,
            height: 858,
            transformStyle: 'preserve-3d',
            transform: `translateZ(${z}px) rotateX(${rotX}deg) rotateY(${rotY + drift * 0.14}deg) scale(${scale})`,
            opacity: p,
          }}
        >
          {/* canto: copia detrás = grosor real del papel, sin backdrop-filter */}
          <div style={{position: 'absolute', inset: 0, borderRadius: 10, background: '#CFC7B4', transform: 'translateZ(-14px) translate(9px, 11px)', boxShadow: CARD_SHADOW}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 10,
              background: `linear-gradient(160deg, #FBF8F1 0%, ${BAS.card} 46%, #EDE7DA 100%)`,
              boxShadow: `${CARD_SHADOW}, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -22px 44px rgba(120,105,80,0.09)`,
              overflow: 'hidden',
              padding: '46px 58px',
            }}
          >
            {/* grano del papel */}
            <div style={{position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(rgba(60,45,20,0.9) 1px, transparent 1px)', backgroundSize: '3px 3px', pointerEvents: 'none'}} />
            {/* barrido de luz al entrar */}
            <div style={{position: 'absolute', top: 0, bottom: 0, width: 340, left: `${sweep}%`, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.68), transparent)', pointerEvents: 'none'}} />

            {/* encabezado */}
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `3px solid ${rgba(BAS.brand, 0.18)}`, paddingBottom: 16}}>
              <div>
                {kicker && <div style={{fontFamily: FONT_SANS, fontSize: 22, fontWeight: 800, letterSpacing: 4, color: rgba(BAS.brand, 0.62)}}>{kicker.toUpperCase()}</div>}
                <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 800, color: BAS.ink, lineHeight: 1.04, marginTop: 4}}>{title}</div>
              </div>
              <div style={{fontFamily: FONT_HAND, fontSize: 34, color: rgba(BAS.brand, 0.5), transform: 'rotate(-3deg)', whiteSpace: 'nowrap'}}>Dr. Bastida</div>
            </div>

            <div style={{position: 'relative', height: 640, marginTop: 26}}>{children}</div>
          </div>

          {/* SELLO DE ESQUINA — lo que dice que esto es la guía */}
          <div
            style={{
              position: 'absolute',
              right: -14,
              bottom: 40,
              transform: `translateZ(26px) translateX(${interpolate(tagIn, [0, 1], [60, 0])}px)`,
              opacity: tagIn,
              background: BAS.aqua,
              color: BAS.onAqua,
              fontFamily: FONT_SANS,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 3,
              padding: '12px 26px',
              borderRadius: 6,
              boxShadow: `0 16px 34px ${rgba('#000', 0.45)}`,
            }}
          >
            {tag}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================ LaminaSeguras
 * Página 1: las tres seguras, con foto, preparación y PORCIÓN exacta.
 */
type Seg = {img: string; name: string; prep: string; dose: string};
export const LaminaSeguras: React.FC<{items?: Seg[]; dur?: number}> = ({
  items = [
    {img: 'img/bas6_lino.png', name: 'Lino', prep: 'MOLIDO — en el yogur', dose: '1 cucharada al día'},
    {img: 'img/bas6_chia.png', name: 'Chía', prep: 'REMOJADA 20 min', dose: '1 cucharada al día'},
    {img: 'img/bas6_cilantro.png', name: 'Cilantro', prep: 'EN INFUSIÓN, 10 min', dose: '1 cucharadita por taza'},
  ],
  dur = 200,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <GuiaPage kicker="Las que aligeran el filtro" title="Las 3 semillas seguras" dur={dur}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 34, height: '100%'}}>
        {items.map((it, i) => {
          const p = ease(f, fps, 22 + i * 13, 150, 0.85);
          return (
            <div key={it.name} style={{opacity: p, transform: `translateY(${interpolate(p, [0, 1], [46, 0])}px)`, display: 'flex', flexDirection: 'column'}}>
              <div style={{position: 'relative', height: 330, borderRadius: 8, overflow: 'hidden', boxShadow: `0 16px 32px ${rgba('#3A3020', 0.34)}`, border: `1px solid ${rgba(BAS.brand, 0.14)}`}}>
                <Img src={sf(it.img)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, dur], [1.04, 1.13], {extrapolateRight: 'clamp'})})`}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(30,24,12,0.5))'}} />
                <div style={{position: 'absolute', left: 16, bottom: 12, width: 46, height: 46, borderRadius: '50%', background: BAS.si, color: BAS.onSi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_SANS, fontSize: 26, fontWeight: 900}}>{i + 1}</div>
              </div>
              <div style={{fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 800, color: BAS.ink, marginTop: 16}}>{it.name}</div>
              <div style={{fontFamily: FONT_SANS, fontSize: 25, fontWeight: 800, letterSpacing: 1.4, color: rgba(BAS.brand, 0.72), marginTop: 2}}>{it.prep}</div>
              <div style={{marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 12, background: rgba(BAS.si, 0.14), border: `2px solid ${rgba(BAS.si, 0.5)}`, borderRadius: 999, padding: '12px 20px'}}>
                <span style={{color: BAS.si, fontSize: 26, fontWeight: 900}}>✓</span>
                <span style={{fontFamily: FONT_SANS, fontSize: 27, fontWeight: 800, color: BAS.ink}}>{it.dose}</span>
              </div>
            </div>
          );
        })}
      </div>
    </GuiaPage>
  );
};

/* ============================================================ SemaforoScene
 * Página 2 — EL SEMÁFORO. Es el formato literal del producto: verde / amarillo / rojo.
 * Hold largo (el guion dice "sáquele una foto a la pantalla").
 */
type SemItem = {img: string; name: string; note: string};
export const SemaforoScene: React.FC<{
  verde?: SemItem[];
  amarillo?: SemItem[];
  rojo?: SemItem[];
  dur?: number;
}> = ({
  verde = [
    {img: 'img/bas6_lino.png', name: 'Lino molido', note: '1 cda/día'},
    {img: 'img/bas6_chia.png', name: 'Chía remojada', note: '1 cda/día'},
    {img: 'img/bas6_cilantro.png', name: 'Cilantro en agua', note: '1 cdita/taza'},
  ],
  amarillo = [
    {img: 'img/bas6_zapallo.png', name: 'Zapallo', note: '1 cdita, medido'},
    {img: 'img/bas6_sesamo.png', name: 'Sésamo / tahini', note: 'ojo si tuvo piedras'},
  ],
  rojo = [{img: 'img/bas6_girasol.png', name: 'Girasol salado', note: 'la bolsita de picar'}],
  dur = 260,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const BANDS: {items: SemItem[]; color: string; ink: string; label: string; sub: string}[] = [
    {items: verde, color: BAS.si, ink: BAS.onSi, label: 'VERDE', sub: 'coma tranquilo'},
    {items: amarillo, color: BAS.amber, ink: BAS.onAmber, label: 'AMARILLO', sub: 'coma, pero medido'},
    {items: rojo, color: BAS.no, ink: BAS.onNo, label: 'ROJO', sub: 'para una ocasión'},
  ];
  let n = 0;
  return (
    <GuiaPage kicker="Así lo ordeno en el consultorio" title="El semáforo de las semillas" dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, height: '100%'}}>
        {BANDS.map((b, bi) => {
          const bp = ease(f, fps, 20 + bi * 16, 150, 0.85);
          return (
            <div
              key={b.label}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                borderRadius: 10,
                padding: '10px 20px',
                background: `linear-gradient(90deg, ${rgba(b.color, 0.2)}, ${rgba(b.color, 0.07)})`,
                borderLeft: `12px solid ${b.color}`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6), 0 10px 22px ${rgba('#3A3020', 0.2)}`,
                opacity: bp,
                transform: `translateX(${interpolate(bp, [0, 1], [-70, 0])}px)`,
              }}
            >
              <div style={{width: 268, flexShrink: 0}}>
                {/* la columna tiene que aguantar la palabra mas larga (AMARILLO) sin pisar la 1a tarjeta */}
                <div style={{fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 900, color: b.color, letterSpacing: 0, whiteSpace: 'nowrap'}}>{b.label}</div>
                <div style={{fontFamily: FONT_SANS, fontSize: 23, fontWeight: 700, color: rgba(BAS.brand, 0.7)}}>{b.sub}</div>
              </div>
              <div style={{display: 'flex', gap: 18, flex: 1}}>
                {b.items.map((it) => {
                  n += 1;
                  const ip = ease(f, fps, 44 + n * 9, 140, 0.8);
                  return (
                    <div key={it.name} style={{display: 'flex', alignItems: 'center', gap: 12, background: '#FFFDF8', border: `1px solid ${rgba(BAS.brand, 0.15)}`, borderRadius: 8, padding: '8px 16px 8px 8px', boxShadow: `0 8px 18px ${rgba('#3A3020', 0.2)}`, opacity: ip, transform: `scale(${interpolate(ip, [0, 1], [0.86, 1])})`}}>
                      <div style={{width: 74, height: 74, borderRadius: 6, overflow: 'hidden', flexShrink: 0}}>
                        <Img src={sf(it.img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      </div>
                      <div>
                        <div style={{fontFamily: FONT_SANS, fontSize: 28, fontWeight: 800, color: BAS.ink, whiteSpace: 'nowrap'}}>{it.name}</div>
                        <div style={{fontFamily: FONT_SANS, fontSize: 21, fontWeight: 700, color: rgba(BAS.brand, 0.62), whiteSpace: 'nowrap'}}>{it.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </GuiaPage>
  );
};

/* ============================================================ ManoVsCuchara
 * La pieza FIRMA del video: el puñado contra la cucharada. Dos tarjetas de vidrio con FOTO REAL,
 * la de la mano se hunde en rojo y la de la cuchara se afirma en verde.
 */
export const ManoVsCuchara: React.FC<{
  left?: {img: string; title: string; note: string};
  right?: {img: string; title: string; note: string};
  verdict?: string;
  dur?: number;
}> = ({
  left = {img: 'img/bas6_zapallo.png', title: 'EL PUÑADO', note: 'nunca se mide'},
  right = {img: 'img/bas6_broll_cuchara.png', title: 'LA CUCHARADA', note: 'siempre se mide'},
  verdict = '¿Con cuchara, o con la mano?',
  dur = 220,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pL = ease(f, fps, 8, 150, 0.9);
  const pR = ease(f, fps, 30, 150, 0.9);
  const pV = ease(f, fps, 62, 150, 0.9);
  const cam = interpolate(f, [0, dur], [0, 1], {extrapolateRight: 'clamp'});

  const Card: React.FC<{d: {img: string; title: string; note: string}; color: string; p: number; dir: number}> = ({d, color, p, dir}) => (
    <div
      style={{
        width: 620,
        transformStyle: 'preserve-3d',
        transform: `translateZ(${interpolate(p, [0, 1], [-260, 0])}px) rotateY(${interpolate(p, [0, 1], [dir * 22, dir * 5])}deg) translateY(${interpolate(p, [0, 1], [70, 0])}px)`,
        opacity: p,
      }}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 20, background: rgba('#000', 0.5), transform: 'translateZ(-16px) translate(6px,14px)', filter: 'blur(2px)'}} />
      <div style={{position: 'relative', borderRadius: 20, overflow: 'hidden', border: `1px solid ${rgba('#fff', 0.16)}`, boxShadow: `${CARD_SHADOW}, inset 0 1px 0 rgba(255,255,255,0.28)`}}>
        <div style={{height: 420, overflow: 'hidden'}}>
          <Img src={sf(d.img)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.06 + cam * 0.08})`}} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(color, 0.1)} 0%, transparent 40%, ${rgba('#04141d', 0.9)} 100%)`}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 28px 26px', borderBottom: `8px solid ${color}`}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 58, fontWeight: 900, color: '#F6FAFB', letterSpacing: 1, textShadow: '0 6px 22px rgba(0,0,0,0.7)'}}>{d.title}</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, color: rgba('#EAF2F4', 0.92)}}>{d.note}</div>
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 50% 46%, ${BAS.bgPanel}, ${BAS.bgEdge} 76%)`}}>
      <AbsoluteFill style={{perspective: 1800, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', gap: 60, alignItems: 'center', transform: `scale(${1 - cam * 0.03})`}}>
          <Card d={left} color={BAS.no} p={pL} dir={1} />
          <Card d={right} color={BAS.si} p={pR} dir={-1} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 74, pointerEvents: 'none'}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 800, color: '#F4F1E9', opacity: pV, transform: `translateY(${interpolate(pV, [0, 1], [-28, 0])}px)`, textShadow: '0 8px 30px rgba(0,0,0,0.75)'}}>{verdict}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================ OxalatoScene
 * El sésamo: cristales que crecen y se vuelven piedra. Alerta ámbar, foto real de la piedra.
 */
export const OxalatoScene: React.FC<{dur?: number; img?: string; crystal?: string}> = ({
  dur = 200,
  img = 'img/bas6_broll_piedra.png',
  crystal = 'img/bas6_broll_sarro.png',
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = ease(f, fps, 6, 150, 0.9);
  const grow = interpolate(f, [24, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pStone = ease(f, fps, 96, 140, 0.9);
  const pulse = 0.5 + Math.sin((f / fps) * Math.PI * 2.2) * 0.5;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 50% 44%, ${BAS.bgPanel}, ${BAS.bgEdge} 76%)`}}>
      <AbsoluteFill style={{perspective: 1600, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 1180, height: 620, transformStyle: 'preserve-3d', opacity: p, transform: `translateZ(${interpolate(p, [0, 1], [-240, 0])}px)`}}>
          {/* capa de fondo: cristales creciendo */}
          <div style={{position: 'absolute', left: 0, top: 40, width: 620, height: 520, borderRadius: 18, overflow: 'hidden', transform: `translateZ(-90px) scale(${0.94 + grow * 0.08})`, filter: `blur(${(1 - grow) * 6}px)`, boxShadow: CARD_SHADOW}}>
            <Img src={sf(crystal)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(BAS.amber, 0.16)}, ${rgba('#04141d', 0.72)})`}} />
          </div>
          {/* capa hero: la piedra */}
          <div style={{position: 'absolute', right: 0, top: 0, width: 660, height: 600, borderRadius: 20, overflow: 'hidden', transform: `translateZ(60px) translateX(${interpolate(pStone, [0, 1], [80, 0])}px) rotateY(${interpolate(pStone, [0, 1], [-16, -4])}deg)`, opacity: pStone, border: `1px solid ${rgba(BAS.amber, 0.35)}`, boxShadow: `${CARD_SHADOW}, 0 0 ${30 + pulse * 40}px ${rgba(BAS.amber, 0.32)}`}}>
            <Img src={sf(img)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.05 + grow * 0.06})`}} />
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 45%, ${rgba('#04141d', 0.86)})`}} />
          </div>
          {/* rótulos */}
          <div style={{position: 'absolute', left: 20, bottom: -6, transform: 'translateZ(110px)'}}>
            <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 900, letterSpacing: 4, color: BAS.amber}}>OXALATO</div>
            <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 800, color: '#F4F1E9', lineHeight: 1.05, textShadow: '0 8px 28px rgba(0,0,0,0.7)'}}>Cristales que se<br />vuelven piedra</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================ SemillaDespensa
 * La analogía madre: la semilla es una despensa apretada. Macro que se abre en capas.
 */
export const SemillaDespensa: React.FC<{dur?: number; img?: string}> = ({dur = 190, img = 'img/bas6_lino.png'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = ease(f, fps, 4, 150, 0.9);
  const open = interpolate(f, [30, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cam = interpolate(f, [0, dur], [1.02, 1.12], {extrapolateRight: 'clamp'});
  const CH = [
    {label: 'FÓSFORO', color: BAS.amber, d: 0},
    {label: 'POTASIO', color: BAS.aqua, d: 12},
    {label: 'PROTEÍNA', color: BAS.si, d: 24},
  ];
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 50% 46%, ${BAS.bgPanel}, ${BAS.bgEdge} 78%)`}}>
      <AbsoluteFill>
        <Img src={sf(img)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 * p, transform: `scale(${cam})`}} />
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${rgba(BAS.bgDeep, 0.6)}, ${rgba(BAS.bgEdge, 0.9)})`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', opacity: p}}>
          <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 900, letterSpacing: 5, color: BAS.aqua}}>UNA SEMILLA ES</div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 800, color: '#F4F1E9', lineHeight: 1.02, marginTop: 6, textShadow: '0 10px 34px rgba(0,0,0,0.7)'}}>una despensa entera<br />apretada en un grano</div>
          <div style={{display: 'flex', gap: 22, justifyContent: 'center', marginTop: 44}}>
            {CH.map((c, i) => {
              const cp = ease(f, fps, 40 + c.d, 140, 0.8);
              return (
                <div key={c.label} style={{opacity: cp * open, transform: `translateY(${interpolate(cp, [0, 1], [34, 0])}px) scale(${interpolate(cp, [0, 1], [0.85, 1])})`, background: rgba(c.color, 0.16), border: `2px solid ${rgba(c.color, 0.6)}`, borderRadius: 999, padding: '14px 34px', boxShadow: `0 0 26px ${rgba(c.color, 0.28)}`}}>
                  <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 900, letterSpacing: 2, color: c.color}}>{c.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
