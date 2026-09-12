/**
 * Main_bastidarenal15 — MONTAJE del video #15 "Sus Riñones Pueden Perder el 60% Sin que Sienta Nada:
 * las Señales que lo Salvan de la Diálisis". AVATAR PARCIAL: el creador grabó la 1ª parte
 * (12:09 → renal/avatar15.mp4, 30fps CFR, cubre hook→mecanismo→mito→don Baltasar→8 señales→regla de
 * las dos manos). La cola (medirse/regla de oro/foto de la mañana/cierre del loop nicturia/CTA/guía/
 * QR/testimonial/cierre) se locutó con Fish clonando la voz del PROPIO avatar; ahí el avatar queda EN
 * BUCLE (mudo). El AUDIO FINAL es un solo master (public/bastidarenal15.wav = avatar real + cola) que
 * se muxea en la ENTREGA → el avatar va MUDO en la comp y NO hay tags de Audio/SFX. Anclado al ms con
 * _bastidarenal15_wordms.json (scripts/anchor_bas15.mjs). Clon del molde #16 (video hermano).
 */
import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, BRoll, SideIllustration, PresenterIntro} from './BastidaFX';
import {RenalLowerThird} from './BastidaKit';
import {CreatininaScene} from './CreatininaScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {QrCtaScene} from './QrCtaScene';
import {TestimonialScene} from './TestimonialScene';
import {GuidePageScene} from './scenes7/GuidePageScene';
import {FilterMechanismScene} from './scenes7/FilterMechanismScene';
import {RuleScene} from './scenes7/RuleScene';
import {MatchWhip, WhipDir} from './MatchWhip';

export const TOTAL_R15 = 32775; // 1092.5s × 30
const AVATAR_FRAMES = 21880;    // 729.32s × 30 (tramo 1, su propio lipsync — mudo, audio del master)
const LOOP_FROM = 6000;         // el bucle arranca en un tramo neutro del avatar (doctor hablando calmo)

/* ================= inline components ================= */

/** BClip — clip i2v (agnes) a pantalla completa, mudo, con grade navy + caption documental. */
const BClip: React.FC<{clip: string; caption?: string; dur: number}> = ({clip, caption, dur}) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const out = interpolate(f, [dur - 8, dur], [1, 0], {extrapolateLeft: 'clamp'});
  const k = 1 + (f / dur) * 0.05;
  return (
    <AbsoluteFill style={{opacity: Math.min(inn, out)}}>
      <OffthreadVideo src={staticFile(`broll/${clip}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${k})`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${rgba(BAS.bgDeep, 0.15)}, ${rgba(BAS.bgDeep, 0.42)})`, mixBlendMode: 'multiply'}} />
      {caption && (
        <div style={{position: 'absolute', left: 60, bottom: 70, background: rgba('#04121A', 0.72), borderRadius: 12, padding: '12px 26px', borderLeft: `5px solid ${BAS.aqua}`, fontFamily: FONT_SANS, fontSize: 38, fontWeight: 700, color: '#F4F1E9', boxShadow: CARD_SHADOW, maxWidth: 900, opacity: Math.min(inn, out)}}>{caption}</div>
      )}
    </AbsoluteFill>
  );
};

/** SignalCard — el reveal firma de cada SEÑAL: número acrílico ámbar + tarjeta de vidrio con la foto
 * real + rótulo "SEÑAL Nº X" + nombre + el porqué. 2.5D con push-in. (ámbar = alerta, no "daña".) */
const SignalCard: React.FC<{n: string; name: string; why: string; img: string}> = ({n, name, why, img}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130, mass: 0.9}});
  const card = spring({frame: f - 10, fps, config: {damping: 140}});
  const txt = spring({frame: f - 30, fps, config: {damping: 130}});
  const ring = 0.5 + Math.sin((f / fps) * Math.PI * 2) * 0.5;
  const push = 1 + p * 0.04;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 34% 30%, ${rgba(BAS.bgPanel, 0.9)}, ${rgba(BAS.bgDeep, 0.98)})`, perspective: 1200}}>
      <div style={{position: 'absolute', left: '4%', top: '50%', transform: `translateY(-50%) translateZ(-140px) scale(${interpolate(p, [0, 1], [0.85, 1])})`, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 560, lineHeight: 0.8, color: rgba(BAS.amber, 0.16), textShadow: `0 0 80px ${rgba(BAS.amber, 0.2)}`, opacity: p}}>{n}</div>
      <div style={{position: 'absolute', right: '8%', top: '50%', width: 760, height: 500, transform: `translateY(-50%) translateZ(60px) scale(${interpolate(card, [0, 1], [0.9, 1]) * push}) rotate(${interpolate(card, [0, 1], [3, 1.5])}deg)`, borderRadius: 26, overflow: 'hidden', border: `1px solid ${rgba('#ffffff', 0.14)}`, boxShadow: `0 40px 90px rgba(0,0,0,0.6), inset 0 1px 0 ${rgba('#ffffff', 0.18)}`, opacity: card}}>
        <img src={staticFile(`img/${img}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + f / 400})`}} />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(150deg, transparent 40%, ${rgba(BAS.amber, 0.24)} 100%)`}} />
      </div>
      <div style={{position: 'absolute', left: '7%', bottom: '16%', opacity: txt, transform: `translateY(${interpolate(txt, [0, 1], [30, 0])}px)`, maxWidth: 740}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
          <div style={{width: 64, height: 64, borderRadius: '50%', background: BAS.amber, color: BAS.onAmber, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, boxShadow: `0 0 ${16 + ring * 26}px ${rgba(BAS.amber, 0.6)}`}}>⚠</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 800, letterSpacing: 4, color: BAS.amber}}>SEÑAL Nº {n}</div>
        </div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 76, fontWeight: 800, color: '#F4F1E9', lineHeight: 1.02, textShadow: '0 6px 26px rgba(0,0,0,0.6)'}}>{name}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 38, fontWeight: 700, color: rgba('#FBE7C6', 0.95), marginTop: 8}}>{why}</div>
      </div>
    </AbsoluteFill>
  );
};

/** TrapReveal — el CIERRE DEL LOOP: la señal engañosa (levantarse de noche) que se festeja como buena
 * noticia y es la más peligrosa. Un tilde verde que se voltea a alerta ámbar. */
const TrapReveal: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 140, mass: 0.9}});
  const flip = spring({frame: f - 60, fps, config: {damping: 120, mass: 1}});
  const warnGlow = 0.4 + Math.sin((f / fps) * Math.PI * 2) * 0.4;
  const isWarn = flip > 0.5;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 50% 40%, ${rgba(BAS.bgPanel, 0.92)}, ${rgba(BAS.bgDeep, 0.99)})`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`, maxWidth: 1300}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 800, letterSpacing: 5, color: isWarn ? BAS.amber : BAS.si, marginBottom: 22}}>{isWarn ? 'LA MÁS PELIGROSA DE TODAS' : 'LA QUE SE FESTEJA'}</div>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 26}}>
          <div style={{width: 96, height: 96, borderRadius: '50%', background: isWarn ? BAS.amber : BAS.si, color: isWarn ? BAS.onAmber : BAS.onSi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, boxShadow: isWarn ? `0 0 ${20 + warnGlow * 40}px ${rgba(BAS.amber, 0.7)}` : `0 0 20px ${rgba(BAS.si, 0.5)}`, transform: `rotateY(${interpolate(flip, [0, 1], [0, 360])}deg)`}}>{isWarn ? '!' : '✓'}</div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 84, fontWeight: 800, color: '#F4F1E9', lineHeight: 1.04, textShadow: '0 6px 26px rgba(0,0,0,0.6)', textAlign: 'left'}}>“Tomo mucha agua,<br/>me estoy limpiando.”</div>
        </div>
        <div style={{marginTop: 34, fontFamily: FONT_SANS, fontSize: 46, fontWeight: 700, color: isWarn ? rgba('#FBE7C6', 0.96) : rgba('#EAF2F4', 0.7), opacity: flip}}>El riñón que ya no concentra la orina de noche lo despierta.</div>
      </div>
    </AbsoluteFill>
  );
};

const KeyWord: React.FC<{word: string; sub?: string; color?: string}> = ({word, sub, color = BAS.amber}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 120, mass: 0.8}});
  const glow = 0.4 + Math.sin((f / fps) * Math.PI * 2) * 0.3;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.82, 1])})`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 128, fontWeight: 800, letterSpacing: 3, color, textShadow: `0 0 ${30 + glow * 40}px ${rgba(color, 0.6)}, 0 8px 30px rgba(0,0,0,0.65)`}}>{word}</div>
        {sub && <div style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, color: '#EAF2F4', marginTop: 6, textShadow: '0 3px 14px rgba(0,0,0,0.75)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

const Lower: React.FC<{y?: number; k?: number; children: React.ReactNode}> = ({y = 120, k = 0.86, children}) => (
  <AbsoluteFill style={{transform: `translateY(${y}px) scale(${k})`, transformOrigin: '50% 100%'}}>{children}</AbsoluteFill>
);

const StatTag: React.FC<{a: string; b: string; note?: string}> = ({a, b, note}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  const bIn = spring({frame: f - 14, fps, config: {damping: 120}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 104, fontWeight: 800, color: BAS.amber, textShadow: '0 6px 24px rgba(0,0,0,0.65)'}}>{a}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 60, fontWeight: 800, color: '#EAF2F4'}}>→</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 104, fontWeight: 800, color: BAS.amber, textShadow: `0 0 30px ${rgba(BAS.amber, 0.5)}, 0 6px 24px rgba(0,0,0,0.65)`, transform: `scale(${interpolate(bIn, [0, 1], [0.7, 1])})`, opacity: bIn}}>{b}</div>
      </div>
      {note && <div style={{position: 'absolute', bottom: '28%', background: rgba('#04121A', 0.82), borderRadius: 999, padding: '10px 28px', border: `1px solid ${rgba(BAS.aqua, 0.35)}`, fontFamily: FONT_SANS, fontSize: 36, fontWeight: 800, letterSpacing: 2, color: '#F4F1E9', opacity: bIn, boxShadow: '0 14px 30px rgba(0,0,0,0.5)'}}>{note.toUpperCase()}</div>}
    </AbsoluteFill>
  );
};

const CautionChip: React.FC<{text?: string}> = ({text = 'Consulte a su médico'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 140}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 96}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: BAS.card, borderRadius: 999, padding: '14px 30px', borderLeft: `6px solid ${BAS.amber}`, boxShadow: CARD_SHADOW, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`}}>
        <span style={{fontSize: 30, color: BAS.amber}}>⚠</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: BAS.brand}}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

const SubscribeCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 150}});
  const pulse = 1 + Math.sin((f / fps) * Math.PI * 2) * 0.03;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 90}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: BAS.aqua, borderRadius: 16, padding: '18px 40px', boxShadow: `0 20px 50px ${rgba(BAS.aqua, 0.5)}`, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${pulse})`}}>
        <span style={{fontSize: 40, color: '#04121A'}}>▶</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 800, color: '#04121A', letterSpacing: 1}}>SUSCRÍBASE AL CANAL</span>
      </div>
    </AbsoluteFill>
  );
};

/* ================= datos ================= */
const SIGNALS = [
  {n: '1', name: 'Hinchazón', why: 'Tobillos, párpados y la cara al despertar', img: 'bas15_s1_tobillo', at: 11198},
  {n: '2', name: 'Espuma en la orina', why: 'Proteína que se escapa por el filtro', img: 'bas15_s2_espuma', at: 12713},
  {n: '3', name: 'Cambios al orinar', why: 'Color, cantidad y vueltas de noche', img: 'bas15_s3_noche', at: 14143},
  {n: '4', name: 'Cansancio y aire corto', why: 'Menos glóbulos rojos: anemia renal', img: 'bas15_s4_escalera', at: 15106},
  {n: '5', name: 'Picazón que no cede', why: 'Fósforo y toxinas irritan la piel', img: 'bas15_s5_picazon', at: 16454},
  {n: '6', name: 'Sabor a metal, sin hambre', why: 'La urea se acumula en la sangre', img: 'bas15_s6_sabor', at: 17282},
  {n: '7', name: 'Calambres de noche', why: 'Los minerales se desafinan', img: 'bas15_s7_calambre', at: 18338},
  {n: '8', name: 'Presión que no baja', why: 'Riñón y presión se muerden la cola', img: 'bas15_s8_presion', at: 19351},
];

const GUIDE_ITEMS = [
  {img: 'bas15_analisis.png', name: 'Su Análisis Traducido', line1: 'Ese papel de números', line2: 'explicado en palabras', verdict: 'si' as const},
  {img: 'bas15_guia.png', name: 'El Semáforo Renal', line1: 'Casi 300 alimentos', line2: 'con su porción exacta', verdict: 'si' as const},
  {img: 'bas15_gota.png', name: '90 días para bajar', line1: 'Un plan día por día', line2: 'hasta su próximo análisis', verdict: 'si' as const},
];

/* ================= DEPTH (escenas de profundidad ancladas al ms) ================= */
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  // HOOK — las señales, bloqueadas en un anillo, con una MISTERIO (la que se festeja) = open loop
  {from: 2, dur: 900, dir: 'in', node: <RenalCarousel cards={[{name: 'Tobillos hinchados', img: 'img/bas15_s1_tobillo.png', tint: '#F2A23C'}, {name: 'Orina con espuma', img: 'img/bas15_s2_espuma.png', tint: '#F2A23C'}, {name: 'Cansancio', img: 'img/bas15_s4_escalera.png', tint: '#F2A23C'}, {name: 'Picazón', img: 'img/bas15_s5_picazon.png', tint: '#F2A23C'}, {name: 'La que se festeja', img: 'img/bas15_s3_noche.png', tint: '#34C6E0'}]} reveals={[80, 170, 260, 350]} teaseIndex={4} introDur={44} kicker="Salud renal · las señales" title="¿Su cuerpo ya le está avisando?" />},
  // INTRO — presentación del doctor (sobre la honestidad "le voy a ser honesto")
  {from: 1589, dur: 300, dir: 'up', node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Una vida cuidando riñones" img="renal/bastida_cutout.png" />},
  // RESPIRO — miedo diálisis → calma
  {from: 2542, dur: 300, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={110} />},
  // MECANISMO — el riñón es un colador de un millón de filtros que se tapa en silencio
  {from: 4102, dur: 520, dir: 'left', node: <FilterMechanismScene />},
  // MITO — "si me siento bien, estoy bien" = la luz de la gasolina tapada
  {from: 8894, dur: 420, dir: 'in', node: <RuleScene kicker="El mito más peligroso" question="“Si me siento bien, estoy bien.”" answer="EL RIÑÓN SE CALLA HASTA EL FINAL" note="Sentirse bien no prueba que el riñón esté bien." img="img/bas15_auto_tanque.png" imgSide="right" accent={BAS.amber} />},
  // 8 SEÑALES
  ...SIGNALS.map((s, i) => ({from: s.at, dur: 240, dir: (i % 2 ? 'left' : 'right') as WhipDir, node: <SignalCard n={s.n} name={s.name} why={s.why} img={s.img} />})),
  // REGLA DE LAS DOS MANOS — recap de señales antes de la costura (fin del tramo avatar real)
  {from: 21353, dur: 480, dir: 'up', node: <AlertSignalsScene title="La regla de las dos manos" signals={['Hinchazón: tobillos, párpados, la cara', 'Espuma en la orina que no se va', 'Cambios al orinar · vueltas de noche', 'Cansancio y falta de aire', 'Picazón · sabor a metal · sin hambre', 'Calambres · presión que no baja']} footer="Si reconoce 2 o más, consulte a su médico" />},
  // --- desde acá: avatar en BUCLE (cola Fish) ---
  // MEDIRSE — la aguja como metáfora: no se SIENTE, se MIDE
  {from: 22015, dur: 340, dir: 'left', node: <CreatininaScene from={2.4} to={1.3} caption="No se siente" subcaption="pero sí se mide: creatinina y filtrado" />},
  // REGLA DE ORO — lo que no se siente, se mide
  {from: 23095, dur: 380, dir: 'in', node: <RuleScene kicker="Su regla de oro" question="¿Cómo cuido lo que no siento?" answer="CREATININA Y FILTRADO, 1 VEZ AL AÑO" note="Un pinchazo. Una gota de sangre." img="img/bas15_analisis.png" imgSide="left" accent={BAS.aqua} />},
  // EL CIERRE DEL LOOP — la señal que se festeja (nicturia)
  {from: 25524, dur: 360, dir: 'in', node: <TrapReveal />},
  // LA GUÍA
  {from: 27317, dur: 760, dir: 'in', node: <GuidePageScene title="Su guía renal completa" kicker="Todo junto, ordenado" tag="La guía" page="doctorbastida.com" items={GUIDE_ITEMS} columns={3} footer="Del papel del análisis a qué poner en el plato" />},
  // CTA — el QR y cómo escanearlo (bajado para no tapar la boca)
  {from: 28853, dur: 1180, dir: 'up', node: <Lower y={130} k={0.86}><QrCtaScene qr="renal/bas_qr_bastida.png" kicker="Dr. Bastida · Salud renal" title="Su guía renal completa" steps={['Abra la cámara de su teléfono', 'Apunte al código de la pantalla', 'Toque el aviso que aparece arriba']} note="También en la descripción, es el primer enlace" /></Lower>},
  // TESTIMONIAL — Amparo de Cali
  {from: 30117, dur: 940, dir: 'left', node: <TestimonialScene img="img/bas15_amparo_cocina.png" name="Amparo" place="Cali" quote="“Vi la espuma y la cara hinchada, fui a mi médico a tiempo y le bajé la creatinina.”" tag="Historia real" />},
];

/* ================= BROLL (cutaways: fotos + algunos clips i2v, anclados a sub-beats) ================= */
type Cut = {from: number; dur: number; asset: string; caption?: string; clip?: boolean};
const BROLL: Cut[] = [
  // hook / honestidad / mecanismo
  {from: 950, dur: 150, asset: 'bas15_analisis', caption: 'Un papel que no esperaba'},
  {from: 1250, dur: 160, asset: 'bas15_doc_hook', caption: 'Lo veo todas las semanas', clip: false},
  {from: 3100, dur: 160, asset: 'bas15_st_dialisis', caption: 'De cómo esquivarla', clip: true},
  {from: 4320, dur: 170, asset: 'bas15_colador', caption: 'Un colador finísimo', clip: true},
  {from: 4700, dur: 170, asset: 'bas6_broll_kidney.jpg', caption: 'Un millón de filtros diminutos'},
  {from: 5300, dur: 160, asset: 'bas15_doc_colador', caption: 'Pierde soldados en silencio'},
  // villano / mito
  {from: 5900, dur: 160, asset: 'bas15_auto_tanque', caption: 'El silencio es la trampa', clip: true},
  {from: 9500, dur: 170, asset: 'bas15_auto_tanque', caption: 'La luz de la gasolina tapada', clip: true},
  // don Baltasar
  {from: 6600, dur: 190, asset: 'bas15_baltasar_nietos', caption: 'Don Baltasar, 70 años', clip: true},
  {from: 7100, dur: 170, asset: 'bas15_baltasar_analisis', caption: '“Me siento de maravilla”', clip: true},
  {from: 7650, dur: 170, asset: 'bas6_broll_kidney.jpg', caption: 'A un 32% de su función'},
  // señal 1 hinchazón
  {from: 11600, dur: 170, asset: 'bas15_s1_parpados', caption: 'Párpados hinchados al despertar'},
  {from: 12050, dur: 170, asset: 'bas15_doc_pulgar', caption: 'Apriete la espinilla', clip: true},
  // señal 2 espuma
  {from: 13100, dur: 170, asset: 'bas15_s2_espuma', caption: 'Espuma que tarda en irse', clip: true},
  {from: 13600, dur: 150, asset: 'bas15_analisis', caption: 'Proteína que se escapa'},
  // señal 3 orinar
  {from: 14550, dur: 170, asset: 'bas15_s3_noche', caption: 'Dos, tres veces por noche', clip: true},
  // señal 4 cansancio
  {from: 15500, dur: 170, asset: 'bas15_s4_escalera', caption: 'Sin aire en la escalera', clip: true},
  {from: 16000, dur: 150, asset: 'bas15_st_labsangre', caption: 'Menos glóbulos rojos', clip: true},
  // señal 5 picazón
  {from: 16850, dur: 170, asset: 'bas15_s5_picazon', caption: 'Pica sin sarpullido', clip: true},
  // señal 6 sabor
  {from: 17700, dur: 170, asset: 'bas15_s6_sabor', caption: 'La comida ya no sabe igual', clip: true},
  // señal 7 calambres
  {from: 18750, dur: 170, asset: 'bas15_s7_calambre', caption: 'Calambres que despiertan', clip: true},
  // señal 8 presión
  {from: 19750, dur: 170, asset: 'bas15_s8_presion', caption: 'Una pastilla, y otra, y otra', clip: true},
  {from: 20300, dur: 160, asset: 'bas15_st_presion', caption: 'La presión que no se deja domar', clip: true},
  // --- loop tramo (cola) ---
  {from: 22450, dur: 160, asset: 'bas15_analisis', caption: 'Dos números que dicen todo', clip: true},
  {from: 23600, dur: 170, asset: 'bas15_gota', caption: 'Una gota de sangre', clip: true},
  {from: 24000, dur: 170, asset: 'bas15_doc_analisis', caption: 'Pídalo una vez al año'},
  {from: 24744, dur: 190, asset: 'bas15_s1_parpados', caption: 'La foto de la mañana'},
  {from: 25150, dur: 160, asset: 'bas15_s1_tobillo', caption: 'Mírese los tobillos'},
  {from: 26100, dur: 170, asset: 'bas15_s3_noche', caption: 'Se disfraza de buena noticia', clip: true},
  {from: 26600, dur: 150, asset: 'bas15_colador', caption: 'El filtro que ya no descansa', clip: true},
  {from: 30500, dur: 170, asset: 'bas15_amparo_cocina', caption: 'Amparo, hoy', clip: true},
  {from: 31200, dur: 190, asset: 'bas15_doc_cierre', caption: 'No espere a sentir algo'},
];

/* ================= OVERLAY (palabras clave + tags sobre el avatar) ================= */
const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 300, dur: 220, node: <KeyWord word="60%" sub="se pierde sin sentir nada" color={BAS.amber} />},
  {from: 1589, dur: 230, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: 2909, dur: 210, node: <KeyWord word="UNA SE DISFRAZA" sub="de buena noticia" color={BAS.aqua} />},
  {from: 5292, dur: 210, node: <KeyWord word="EN SILENCIO" sub="el riñón no se queja" color={BAS.amber} />},
  {from: 16850, dur: 190, node: <SideIllustration img="img/bas6_broll_kidney.jpg" side="right" caption="La sangre irrita la piel" dur={190} size={360} />},
  {from: 21353, dur: 230, node: <CautionChip text="¿Dos o más señales? pida un análisis" />},
  {from: 23095, dur: 200, node: <KeyWord word="LO QUE NO SE SIENTE" sub="se mide" color={BAS.aqua} />},
  {from: 32069, dur: 640, node: <SubscribeCard />},
];

export const MainBastidaRenal15: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR tramo 1 — mudo (el audio lo pone el master) */}
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile('renal/avatar15.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Sequence>
      {/* AVATAR tramo 2 — EN BUCLE y mudo (arranca en un tramo neutro) */}
      <Sequence from={AVATAR_FRAMES} durationInFrames={TOTAL_R15 - AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile('renal/avatar15.mp4')} startFrom={LOOP_FROM} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Sequence>

      {/* grade teal-navy + viñeta fría sobre el avatar */}
      <AbsoluteFill style={{background: `linear-gradient(160deg, ${rgba(BAS.bgPanel, 0.42)}, ${rgba(BAS.bgDeep, 0.5)})`, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 44%, transparent 55%, ${rgba(BAS.bgEdge, 0.5)} 100%)`, pointerEvents: 'none'}} />

      {/* MARCA BASTIDA (tapa cualquier watermark del avatar) */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div style={{position: 'absolute', top: 0, right: 0, width: 680, height: 300, background: `radial-gradient(130% 130% at 100% 0%, ${rgba('#05161f', 0.99)} 46%, ${rgba('#05161f', 0.85)} 62%, transparent 84%)`}} />
        <div style={{position: 'absolute', top: 34, right: 44, textAlign: 'right'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: '#F4F1E9', lineHeight: 1}}>Dr. Bastida</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 17, fontWeight: 700, letterSpacing: 3, color: BAS.aqua, marginTop: 4}}>SALUD RENAL</div>
        </div>
        <div style={{position: 'absolute', bottom: 0, right: 0, width: 220, height: 200, background: `radial-gradient(120% 120% at 100% 100%, ${rgba('#05161f', 0.95)} 28%, transparent 70%)`}} />
        <div style={{position: 'absolute', bottom: 40, right: 46, width: 56, height: 56, borderRadius: '50%', border: `2px solid ${rgba(BAS.aqua, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: BAS.aquaLite}}>B</div>
      </AbsoluteFill>

      {/* B-ROLL */}
      {BROLL.map((b, i) => (
        <Sequence key={`br${i}`} from={b.from} durationInFrames={b.dur}>
          {b.clip ? <BClip clip={b.asset} caption={b.caption} dur={b.dur} /> : <BRoll img={b.asset} caption={b.caption} dur={b.dur} kb={1} />}
        </Sequence>
      ))}

      {/* ESCENAS DE PROFUNDIDAD */}
      {DEPTH.map((d, i) => (
        <Sequence key={`dp${i}`} from={d.from} durationInFrames={d.dur}>
          <MatchWhip dur={d.dur} dir={d.dir}>{d.node}</MatchWhip>
        </Sequence>
      ))}

      {/* OVERLAYS */}
      {OVERLAY.map((o, i) => (
        <Sequence key={`ov${i}`} from={o.from} durationInFrames={o.dur}>{o.node}</Sequence>
      ))}
    </AbsoluteFill>
  );
};
