/**
 * Main_bastidarenal16 — MONTAJE del video #16 "Si Tiene Estas Señales, sus Riñones ya Están en
 * Peligro". AVATAR PARCIAL: el creador grabó la 1ª parte (13:52 → renal/avatar16.mp4, 30fps CFR,
 * cubre hook→mecanismo→8 señales→prueba del pulgar→don Genaro→giro→esperanza). La cola (CTA/guía/
 * QR/testimonial/cierre) se locutó con Fish clonando la voz del PROPIO avatar; ahí el avatar queda
 * EN BUCLE (mudo). El AUDIO FINAL es un solo master (public/bastidarenal16.wav = avatar real + cola)
 * que el FARM muxea → el avatar va MUDO en la comp y NO hay tags de Audio/SFX (el stitch descarta el
 * audio de los chunks). Anclado al ms con _bastidarenal16_wordms.json (scripts/anchor_bas16.mjs).
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

export const TOTAL_R16 = 31866; // 1062.2s × 30
const AVATAR_FRAMES = 24968;    // 832.27s × 30 (tramo 1, su propio lipsync — mudo, audio del master)
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
      {/* número acrílico gigante detrás (ámbar) */}
      <div style={{position: 'absolute', left: '4%', top: '50%', transform: `translateY(-50%) translateZ(-140px) scale(${interpolate(p, [0, 1], [0.85, 1])})`, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 560, lineHeight: 0.8, color: rgba(BAS.amber, 0.16), textShadow: `0 0 80px ${rgba(BAS.amber, 0.2)}`, opacity: p}}>{n}</div>
      {/* tarjeta de vidrio con la foto */}
      <div style={{position: 'absolute', right: '8%', top: '50%', width: 760, height: 500, transform: `translateY(-50%) translateZ(60px) scale(${interpolate(card, [0, 1], [0.9, 1]) * push}) rotate(${interpolate(card, [0, 1], [3, 1.5])}deg)`, borderRadius: 26, overflow: 'hidden', border: `1px solid ${rgba('#ffffff', 0.14)}`, boxShadow: `0 40px 90px rgba(0,0,0,0.6), inset 0 1px 0 ${rgba('#ffffff', 0.18)}`, opacity: card}}>
        <img src={staticFile(`img/${img}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + f / 400})`}} />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(150deg, transparent 40%, ${rgba(BAS.amber, 0.24)} 100%)`}} />
      </div>
      {/* nombre + porqué */}
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

/** TrapReveal — el GIRO: una frase de celebración con un tilde verde que se transforma en alerta
 * ámbar. "La señal que se festeja y es la más peligrosa." */
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
        <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 800, letterSpacing: 5, color: isWarn ? BAS.amber : BAS.si, marginBottom: 22}}>{isWarn ? 'LA MÁS PELIGROSA DE TODAS' : 'LA SEÑAL QUE SE FESTEJA'}</div>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 26}}>
          <div style={{width: 96, height: 96, borderRadius: '50%', background: isWarn ? BAS.amber : BAS.si, color: isWarn ? BAS.onAmber : BAS.onSi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, boxShadow: isWarn ? `0 0 ${20 + warnGlow * 40}px ${rgba(BAS.amber, 0.7)}` : `0 0 20px ${rgba(BAS.si, 0.5)}`, transform: `rotateY(${interpolate(flip, [0, 1], [0, 360])}deg)`}}>{isWarn ? '!' : '✓'}</div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 92, fontWeight: 800, color: '#F4F1E9', lineHeight: 1.04, textShadow: '0 6px 26px rgba(0,0,0,0.6)', textAlign: 'left'}}>“¡Ya no me<br/>levanto de noche!”</div>
        </div>
        <div style={{marginTop: 34, fontFamily: FONT_SANS, fontSize: 46, fontWeight: 700, color: isWarn ? rgba('#FBE7C6', 0.96) : rgba('#EAF2F4', 0.7), opacity: flip}}>A veces el riñón no se curó: dejó de fabricar orina.</div>
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
  {n: '1', name: 'Hinchazón', why: 'Tobillos, párpados y el anillo apretado', img: 'bas16_s1_tobillo', at: 5582},
  {n: '2', name: 'Espuma en la orina', why: 'Proteína que se escapa por el filtro', img: 'bas16_s2_espuma', at: 7116},
  {n: '3', name: 'Se levanta de noche', why: 'El riñón ya no concentra la orina', img: 'bas16_s3_noche', at: 8731},
  {n: '4', name: 'Cansancio y aire corto', why: 'Menos glóbulos rojos: anemia renal', img: 'bas16_s4_escalera', at: 10042},
  {n: '5', name: 'Picazón sin ronchas', why: 'Fósforo y toxinas irritan la piel', img: 'bas16_s5_picazon', at: 11606},
  {n: '6', name: 'Calambres de noche', why: 'Los minerales se desafinan', img: 'bas16_s6_calambre', at: 13147},
  {n: '7', name: 'Sabor a metal, sin hambre', why: 'La urea se acumula en la sangre', img: 'bas16_s7_comida', at: 14690},
  {n: '8', name: 'Presión que no baja', why: 'Riñón y presión se muerden la cola', img: 'bas16_s8_presion', at: 16130},
];

const GUIDE_ITEMS = [
  {img: 'bas16_s2_espuma', name: 'El Semáforo Renal', line1: 'Casi 300 alimentos', line2: 'con su porción exacta', verdict: 'si' as const},
  {img: 'bas16_agua', name: '90 días para bajar', line1: 'Un plan semana a semana', line2: 'hasta su próximo análisis', verdict: 'si' as const},
  {img: 'bas16_analisis', name: 'Su Análisis Traducido', line1: 'Ese papel de números', line2: 'explicado en palabras', verdict: 'si' as const},
];

/* ================= DEPTH (escenas de profundidad ancladas al ms) ================= */
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  // HOOK — las señales, bloqueadas en un anillo, con una MISTERIO (la que se festeja) = open loop
  {from: 2, dur: 760, dir: 'in', node: <RenalCarousel cards={[{name: 'Tobillos hinchados', img: 'img/bas16_s1_tobillo.png', tint: '#F2A23C'}, {name: 'Orina con espuma', img: 'img/bas16_s2_espuma.png', tint: '#F2A23C'}, {name: 'Vueltas de noche', img: 'img/bas16_s3_noche.png', tint: '#F2A23C'}, {name: 'Cansancio', img: 'img/bas16_s4_escalera.png', tint: '#F2A23C'}, {name: 'La que se festeja', img: 'img/bas16_s8_presion.png', tint: '#34C6E0'}]} reveals={[70, 150, 230, 310]} teaseIndex={4} introDur={40} kicker="Salud renal · las señales" title="¿Su cuerpo ya le está avisando?" />},
  // RESPIRO — miedo diálisis → calma
  {from: 1663, dur: 250, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={95} />},
  // INTRO — presentación del doctor
  {from: 3271, dur: 300, dir: 'up', node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Una vida cuidando riñones" img="renal/bastida_cutout.png" />},
  // MECANISMO — el riñón es un colador que se tapa en silencio
  {from: 4340, dur: 470, dir: 'left', node: <FilterMechanismScene />},
  // 8 SEÑALES
  ...SIGNALS.map((s, i) => ({from: s.at, dur: 210, dir: (i % 2 ? 'left' : 'right') as WhipDir, node: <SignalCard n={s.n} name={s.name} why={s.why} img={s.img} />})),
  // PRUEBA DEL PULGAR — la regla de oro accionable
  {from: 17794, dur: 340, dir: 'in', node: <RuleScene kicker="La prueba del pulgar" question="¿Cómo sé si retengo líquido?" answer="APRIETE LA ESPINILLA 5 SEGUNDOS" note="Si le queda el hoyito, hay retención." img="img/bas16_pulgar_dedo.png" imgSide="right" accent={BAS.aqua} />},
  // EL GIRO — la señal que se festeja
  {from: 21830, dur: 340, dir: 'in', node: <TrapReveal />},
  // ESPERANZA — la aguja de creatinina AFLOJA (pago emocional)
  {from: 24353, dur: 300, dir: 'up', node: <CreatininaScene from={2.4} to={1.3} caption="Creatinina" subcaption="se frena cuando usted actúa a tiempo" />},
  // --- desde acá: avatar en BUCLE (cola Fish) ---
  // LOS 3 PEDIDOS
  {from: 25363, dur: 300, dir: 'left', node: <RuleScene kicker="Lo que le pido hoy" question="¿Qué le pido a su médico?" answer="Creatinina · Filtrado · Proteína en orina" note="Baratos, y dicen muchísimo." img="img/bas16_analisis.png" imgSide="left" accent={BAS.aqua} />},
  // LA GUÍA
  {from: 26566, dur: 820, dir: 'in', node: <GuidePageScene title="Su guía renal completa" kicker="Todo junto, ordenado" tag="La guía" page="doctorbastida.com" items={GUIDE_ITEMS} columns={3} footer="Del papel del análisis a qué poner en el plato" />},
  // CTA — el QR y cómo escanearlo (bajado para no tapar la boca)
  {from: 27699, dur: 1360, dir: 'up', node: <Lower y={130} k={0.86}><QrCtaScene qr="renal/bas_qr_bastida.png" kicker="Dr. Bastida · Salud renal" title="Su guía renal completa" steps={['Abra la cámara de su teléfono', 'Apunte al código de la pantalla', 'Toque el aviso que aparece arriba']} note="También en la descripción, es el primer enlace" /></Lower>},
  // TESTIMONIAL — Mercedes de Cali
  {from: 29158, dur: 900, dir: 'left', node: <TestimonialScene img="img/bas16_mercedes_cocina.png" name="Mercedes" place="Cali" quote="“Hice la lista de las señales, me reconocí en cuatro y fui a mi médico a tiempo, sabiendo qué preguntar.”" tag="Historia real" />},
  // RECAP — las 8 señales
  {from: 30243, dur: 820, dir: 'up', node: <AlertSignalsScene title="Las señales, en una lista" signals={['Hinchazón: tobillos, párpados, el anillo', 'Espuma en la orina que no se va', 'Levantarse a orinar de noche', 'Cansancio y falta de aire', 'Picazón sin ronchas · sabor a metal', 'Calambres de noche · presión que no baja']} footer="Si reconoce 2 o más, consulte a su médico" />},
];

/* ================= BROLL (cutaways: fotos + algunos clips i2v, anclados a sub-beats) ================= */
type Cut = {from: number; dur: number; asset: string; caption?: string; clip?: boolean};
const BROLL: Cut[] = [
  // hook / mecanismo
  {from: 900, dur: 150, asset: 'bas16_analisis', caption: 'Un papel que no esperaba'},
  {from: 2200, dur: 160, asset: 'bas16_colador', caption: 'Dos coladores que se tapan', clip: true},
  {from: 4560, dur: 170, asset: 'bas6_broll_kidney.jpg', caption: 'Sin dolor, por dentro no avisa'},
  {from: 5000, dur: 150, asset: 'bas16_colador', caption: 'Le avisa por afuera', clip: true},
  // señal 1 hinchazón
  {from: 6000, dur: 160, asset: 'bas16_s1_parpados', caption: 'Párpados hinchados al despertar'},
  {from: 6500, dur: 160, asset: 'bas16_s1_anillo', caption: 'El anillo que ya no gira'},
  // señal 2 espuma
  {from: 7550, dur: 170, asset: 'bas16_s2_espuma', caption: 'Espuma que tarda en irse', clip: true},
  {from: 8100, dur: 150, asset: 'bas16_analisis', caption: 'Proteína que se escapa'},
  // señal 3 noche
  {from: 9150, dur: 170, asset: 'bas16_s3_noche', caption: 'Dos, tres veces por noche', clip: true},
  {from: 9700, dur: 150, asset: 'bas16_s8_presion', caption: 'Dormir mal sube la presión'},
  // señal 4 cansancio
  {from: 10500, dur: 170, asset: 'bas16_s4_escalera', caption: 'Sin aire en la escalera', clip: true},
  {from: 11050, dur: 150, asset: 'bas16_analisis', caption: 'Menos glóbulos rojos'},
  // señal 5 picazón
  {from: 12050, dur: 170, asset: 'bas16_s5_picazon', caption: 'Pica sin sarpullido', clip: true},
  {from: 12600, dur: 150, asset: 'bas6_broll_kidney.jpg', caption: 'La sangre queda sucia'},
  // señal 6 calambres
  {from: 13560, dur: 160, asset: 'bas16_s6_calambre', caption: 'Calambres que despiertan', clip: true},
  {from: 14100, dur: 150, asset: 'bas16_s6_calambre', caption: 'Los minerales se desafinan'},
  // señal 7 sabor
  {from: 15150, dur: 160, asset: 'bas16_s7_comida', caption: 'La comida ya no sabe igual'},
  {from: 15650, dur: 160, asset: 'bas16_s7_comida', caption: 'Se le va el hambre'},
  // señal 8 presión
  {from: 16560, dur: 170, asset: 'bas16_s8_presion', caption: 'Una pastilla, y otra, y otra'},
  {from: 17100, dur: 150, asset: 'bas16_s8_presion', caption: 'La presión que no se deja domar'},
  // prueba del pulgar
  {from: 18400, dur: 170, asset: 'bas16_pulgar_dedo', caption: 'Cinco segundos apretando', clip: true},
  {from: 18950, dur: 160, asset: 'bas16_doc_pulgar', caption: 'Hágala esta noche'},
  // don Genaro
  {from: 19640, dur: 180, asset: 'bas16_genaro_jardin', caption: 'Don Genaro, jardinero'},
  {from: 20300, dur: 170, asset: 'bas16_s1_tobillo', caption: 'Tobillos como globos'},
  {from: 20900, dur: 170, asset: 'bas16_genaro_sano', caption: 'Dos años después, sigue podando', clip: true},
  // giro
  {from: 22600, dur: 170, asset: 'bas16_s3_noche', caption: 'Orinar mucho menos', clip: true},
  {from: 23200, dur: 160, asset: 'bas16_colador', caption: 'El filtro que se cierra'},
  // esperanza
  {from: 23786, dur: 160, asset: 'bas16_agua', caption: 'Bájele la sal, cuide la presión', clip: true},
  {from: 24700, dur: 150, asset: 'bas16_creatinina_tubo', caption: 'El número que se frena'},
  // --- loop tramo (cola) ---
  {from: 25000, dur: 160, asset: 'bas16_agua', caption: 'El agua justa', clip: true},
  {from: 26000, dur: 160, asset: 'bas16_analisis', caption: 'Cene liviano la noche antes'},
  {from: 28300, dur: 160, asset: 'bas16_doc_cta', caption: 'Llame a un hijo si le cuesta'},
  {from: 29700, dur: 160, asset: 'bas16_mercedes_portrait', caption: 'Mercedes, 66 años'},
  {from: 31100, dur: 200, asset: 'bas16_doc_present', caption: 'No espere a que griten'},
];

/* ================= OVERLAY (palabras clave + tags sobre el avatar) ================= */
const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 1180, dur: 210, node: <KeyWord word="EN SILENCIO" sub="el riñón no se queja" color={BAS.amber} />},
  {from: 2544, dur: 200, node: <KeyWord word="UNA SE FESTEJA" sub="y es la más peligrosa" color={BAS.aqua} />},
  {from: 3300, dur: 230, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: 4700, dur: 200, node: <StatTag a="50%" b="70%" note="se pierde sin sentir nada" />},
  {from: 12200, dur: 190, node: <SideIllustration img="img/bas6_broll_kidney.jpg" side="right" caption="La sangre irrita la piel" dur={190} size={360} />},
  {from: 17250, dur: 200, node: <KeyWord word="¿ORINA MENOS?" sub="no siempre es buena noticia" color={BAS.amber} />},
  {from: 19000, dur: 210, node: <KeyWord word="LA PRUEBA DEL PULGAR" sub="la espinilla, 5 segundos" color={BAS.aqua} />},
  {from: 25650, dur: 210, node: <CautionChip text="¿Dos o más señales? pida un análisis" />},
  {from: 31300, dur: 560, node: <SubscribeCard />},
];

export const MainBastidaRenal16: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR tramo 1 — mudo (el audio lo pone el master que muxea el farm) */}
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile('renal/avatar16.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Sequence>
      {/* AVATAR tramo 2 — EN BUCLE y mudo (arranca en un tramo neutro) */}
      <Sequence from={AVATAR_FRAMES} durationInFrames={TOTAL_R16 - AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile('renal/avatar16.mp4')} startFrom={LOOP_FROM} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
