/**
 * Main_bastidarenal7 — MONTAJE del video #7 "¿Creatinina Alta? 3 Proteínas Seguras (y 3 Peores)".
 *
 * AVATAR PARCIAL: el creador grabó 15:46 (dos fragmentos concatenados → renal/avatar7.mp4, 30fps CFR).
 * El audio del tramo 1 es el DEL PROPIO MP4 (lipsync perfecto). La cola (5:34) se locutó con Fish
 * clonando la voz del propio avatar (renal/bastida7_cola.m4a) y ahí el avatar queda EN BUCLE (mudo),
 * arrancando desde un tramo neutro para que no se note la repetición del arranque.
 *
 * Anclado al ms con captions_bastidarenal7.json + captions_bastidarenal7cola.json (scripts/anchor7r.mjs).
 * Villano = LA CENIZA (la proteína es la leña; no toda deja la misma ceniza). Giro = el BATIDO DE PROTEÍNA.
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, BRoll, SideIllustration} from './BastidaFX';
import {RenalLowerThird} from './BastidaKit';
import {ChapterScene} from './ChapterScene';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {QrCtaScene} from './QrCtaScene';
import {TestimonialScene} from './TestimonialScene';
import {MatchWhip, WhipDir} from './MatchWhip';
import {BotiquinPage} from './Scenes7';
import {MethodStackScene} from './scenes7/MethodStackScene';
import {AshFurnaceScene} from './scenes7/AshFurnaceScene';
import {AshTriadScene} from './scenes7/AshTriadScene';
import {FilterMechanismScene} from './scenes7/FilterMechanismScene';
import {ShakeRevealScene} from './scenes7/ShakeRevealScene';
import {SplitFoodScene} from './scenes7/SplitFoodScene';
import {RuleScene} from './scenes7/RuleScene';
import {GuidePageScene} from './scenes7/GuidePageScene';

export const TOTAL_R7 = 38460;
const AVATAR_FRAMES = 28375; // 945.826s × 30
const COLA_START = 28384; // + 0.3s de aire
const LOOP_FROM = 9000; // el bucle arranca en un tramo neutro del avatar

/* ---------------- datos del video ---------------- */
const CARDS = [
  {name: 'Clara de huevo', img: 'img/bas7_clara.jpg', tint: '#2FA96B'},
  {name: 'Pescado blanco', img: 'img/bas7_pescado.jpg', tint: '#2FA96B'},
  {name: 'Lentejas', img: 'img/bas7_lentejas.jpg', tint: '#2FA96B'},
  {name: 'Fiambre', img: 'img/bas7_fiambre.jpg', tint: '#D64541'},
  {name: 'Carne roja', img: 'img/bas7_carne.jpg', tint: '#D64541'},
  {name: 'Batido de proteína', img: 'img/bas7_batido.jpg', tint: '#D64541'},
];
const VERD: ('si' | 'no')[] = ['si', 'si', 'si', 'no', 'no', 'no'];
const GOOD = [
  {img: 'img/ill/bas7_ill_clara.png', name: 'Clara de huevo'},
  {img: 'img/ill/bas7_ill_pescado.png', name: 'Pescado blanco'},
  {img: 'img/ill/bas7_ill_lentejas.png', name: 'Lentejas remojadas'},
];
const BAD = [
  {img: 'img/ill/bas7_ill_fiambre.png', name: 'Fiambre'},
  {img: 'img/ill/bas7_ill_carne.png', name: 'Carne roja a diario'},
  {img: 'img/ill/bas7_ill_batido.png', name: 'Batido de proteína'},
];
const CH_CLARA = {
  number: '1', unit: 'CLARA', subtitle: 'de huevo · la leña que arde limpia',
  hero: 'img/ill/bas7_ill_clara.png', heroSide: 'right' as const,
  accent: '#3FA96B', accentDeep: '#1E6B43', ambient: 'rgba(63,169,107,0.14)', flourish: 'droplets' as const,
};
const CH_PESCADO = {
  number: '2', unit: 'PESCADO', subtitle: 'blanco · menos ceniza ácida',
  hero: 'img/ill/bas7_ill_pescado.png', heroSide: 'left' as const,
  accent: '#34C6E0', accentDeep: '#0E7F97', ambient: 'rgba(52,198,224,0.14)', flourish: 'droplets' as const,
};
const CH_LENTEJAS = {
  number: '3', unit: 'LENTEJAS', subtitle: 'remojadas · el fósforo entra a la mitad',
  hero: 'img/ill/bas7_ill_lentejas.png', heroSide: 'right' as const,
  accent: '#C9A56A', accentDeep: '#7A5A2E', ambient: 'rgba(201,165,106,0.14)', flourish: 'grains' as const,
};
const sfxf = (n: string) => staticFile(`renal/sfx/bas_sfx_${n}.mp3`);

/* ---------------- overlays chicos (clonados del kit del canal) ---------------- */
const KeyWord: React.FC<{word: string; sub?: string; color?: string}> = ({word, sub, color = BAS.amber}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 120, mass: 0.8}});
  const glow = 0.4 + Math.sin((f / fps) * Math.PI * 2) * 0.3;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.82, 1])})`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 140, fontWeight: 800, letterSpacing: 3, color, textShadow: `0 0 ${30 + glow * 40}px ${rgba(color, 0.6)}, 0 8px 30px rgba(0,0,0,0.65)`}}>{word}</div>
        {sub && <div style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, color: '#EAF2F4', marginTop: 6, textShadow: '0 3px 14px rgba(0,0,0,0.75)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

/** Lower — baja y achica una escena overlay para que no le tape la cara al doctor. */
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
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 800, color: BAS.no, textShadow: '0 6px 24px rgba(0,0,0,0.65)'}}>{a}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 66, fontWeight: 800, color: '#EAF2F4'}}>≈</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 800, color: BAS.no, textShadow: `0 0 30px ${rgba(BAS.no, 0.5)}, 0 6px 24px rgba(0,0,0,0.65)`, transform: `scale(${interpolate(bIn, [0, 1], [0.7, 1])})`, opacity: bIn}}>{b}</div>
      </div>
      {note && <div style={{position: 'absolute', bottom: '30%', background: rgba('#04121A', 0.82), borderRadius: 999, padding: '10px 28px', border: `1px solid ${rgba(BAS.aqua, 0.35)}`, fontFamily: FONT_SANS, fontSize: 38, fontWeight: 800, letterSpacing: 2, color: '#F4F1E9', opacity: bIn, boxShadow: '0 14px 30px rgba(0,0,0,0.5)'}}>{note.toUpperCase()}</div>}
    </AbsoluteFill>
  );
};

const TraidoraTag: React.FC<{name: string; reason: string}> = ({name, reason}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  const stamp = spring({frame: f - 6, fps, config: {damping: 90, mass: 0.6}});
  return (
    <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 0 96px 80px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`}}>
        <div style={{width: 96, height: 96, borderRadius: '50%', background: BAS.no, color: BAS.onNo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, boxShadow: `0 14px 34px ${rgba(BAS.no, 0.5)}`, transform: `scale(${interpolate(stamp, [0, 1], [1.6, 1])}) rotate(${interpolate(stamp, [0, 1], [-14, -6])}deg)`}}>✕</div>
        <div style={{background: rgba('#1a0b0b', 0.74), borderRadius: 18, padding: '16px 30px', borderLeft: `6px solid ${BAS.no}`, boxShadow: '0 20px 44px rgba(0,0,0,0.5)'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 54, fontWeight: 700, color: '#FFF1F0'}}>{name}</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 600, color: rgba('#FFD9D6', 0.9)}}>{reason}</div>
        </div>
      </div>
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
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: BAS.no, borderRadius: 16, padding: '18px 40px', boxShadow: `0 20px 50px ${rgba(BAS.no, 0.5)}`, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${pulse})`}}>
        <span style={{fontSize: 40, color: '#fff'}}>▶</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: 1}}>SUSCRÍBASE AL CANAL</span>
      </div>
    </AbsoluteFill>
  );
};

/* ============================ BEATS (anclados al ms) ============================ */
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  // COLD OPEN — las 6 proteínas bloqueadas; el batido pulsa: ¿cuál es la peor?
  {from: 0, dur: 900, dir: 'in', node: <RenalCarousel cards={CARDS} reveals={[70, 170, 270, 370, 470]} teaseIndex={5} introDur={40} kicker="Creatinina · Salud renal" title="¿Cuál es la peor?" />},
  // DIÁLISIS → respire
  {from: 2402, dur: 300, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={110} />},
  // la creatinina es CENIZA → la aguja sube
  {from: 3925, dur: 260, dir: 'in', node: <CreatininaScene from={1.1} to={2.5} caption="Creatinina" subcaption="la ceniza que quedó sin barrer" />},
  // EL MECANISMO: dos filtros del tamaño de su puño, 30 veces por día, y la ceniza que se acumula
  {from: 4380, dur: 420, dir: 'left', node: <FilterMechanismScene />},
  // LA IDEA: la leña que arde limpia vs la que deja hollín
  {from: 5393, dur: 430, dir: 'right', node: <AshFurnaceScene />},
  // ¿qué es esa ceniza? fósforo · sal · acidez
  {from: 6290, dur: 640, dir: 'in', node: <AshTriadScene />},
  // el error más peligroso: dejar la proteína
  {from: 8252, dur: 400, dir: 'left', node: <RuleScene kicker="El error más peligroso" question="Si deja la proteína, el cuerpo se come su propio músculo." answer="Y eso manda MÁS ceniza a la sangre" note="No es la cantidad: es el apellido de esa proteína." img="img/bas7_broll_brazo_flaco.jpg" imgSide="left" accent={BAS.no} />},
  // el dato regalado: la carne de anoche aparece en el análisis de hoy
  {from: 9150, dur: 470, dir: 'in', node: <RuleScene kicker="Antes de un análisis" question="¿Cenó carne anoche?" answer="El número le va a dar más alto" note="La noche antes: cena liviana, sin carne y sin caldo." img="img/bas6_p_extraccion_sangre.jpg" imgSide="right" accent={BAS.amber} />},
  // REGLA DE ORO 1 — la palma
  {from: 10700, dur: 500, dir: 'right', node: <RuleScene kicker="La regla de oro" question="¿Entra en la palma de mi mano?" answer="LA PALMA, NO EL PLATO" note="Sin los dedos, y del grosor de su dedo meñique." img="img/bas7_broll_palma.jpg" imgSide="left" />},
  // REGLA DE ORO 2 — la heladera
  {from: 11254, dur: 540, dir: 'left', node: <RuleScene kicker="La segunda pregunta" question="¿Se echaría a perder en tres días?" answer="Si no se pudre, no es comida fresca" note="Es un paquete de fósforo con sabor a jamón." img="img/bas7_fiambre.jpg" imgSide="right" accent={BAS.no} />},
  // LAS 3 SEGURAS — openers 2.5D
  {from: 12470, dur: 130, dir: 'right', node: <ChapterScene {...CH_CLARA} />},
  // el huevo son DOS alimentos: la clara (limpia) y la yema (el hollín)
  {from: 12850, dur: 480, dir: 'in', node: <SplitFoodScene />},
  {from: 14110, dur: 130, dir: 'left', node: <ChapterScene {...CH_PESCADO} />},
  {from: 15650, dur: 130, dir: 'right', node: <ChapterScene {...CH_LENTEJAS} />},
  // LÁMINA A — página de la guía: las 3 seguras con preparación y porción
  {from: 17511, dur: 620, dir: 'up', node: (
    <GuidePageScene
      title="Las 3 seguras"
      tag="Porción exacta"
      items={[
        {img: 'bas7_clara.jpg', name: 'Clara de huevo', line1: '2 o 3 claras revueltas', line2: 'De yemas: una, o día por medio', verdict: 'si'},
        {img: 'bas7_pescado.jpg', name: 'Pescado blanco', line1: 'Al horno, hervido o a la plancha', line2: '2 o 3 veces por semana · su palma', verdict: 'si'},
        {img: 'bas7_lentejas.jpg', name: 'Lentejas', line1: 'Remojo de 8 h · se tira esa agua', line2: 'Media taza servida, en guiso', verdict: 'si'},
      ]}
      footer="Esta lámina no la armé para el video: es una página de la guía."
    />
  )},
  // EL GIRO — el anillo se abre en SÍ / NO y el batido cae al bando rojo (cierra el loop)
  {from: 21391, dur: 400, dir: 'in', node: <RenalCarousel cards={CARDS} reveals={[16, 56, 96, 136, 176, 216]} verdicts={VERD} splitAt={60} introDur={40} kicker="El veredicto" title="3 · 3" />},
  // EL REVEAL DEL BATIDO — la carga de dos bifes de golpe (clímax)
  {from: 21900, dur: 560, dir: 'up', node: <ShakeRevealScene />},
  // LÁMINA B — el botiquín traicionero (27 productos) = puente al método
  {from: 23760, dur: 940, dir: 'left', node: <BotiquinPage />},
  // LÁMINA C — el semáforo de las 6
  {from: 24917, dur: 1140, dir: 'up', node: (
    <GuidePageScene
      title="El semáforo de las proteínas"
      tag="Sáquele una foto"
      items={[
        {img: 'bas7_clara.jpg', name: 'Clara de huevo', line1: 'Coma tranquilo', verdict: 'si'},
        {img: 'bas7_pescado.jpg', name: 'Pescado blanco', line1: '2-3 veces por semana', verdict: 'si'},
        {img: 'bas7_lentejas.jpg', name: 'Lentejas remojadas', line1: 'Media taza, en guiso', verdict: 'si'},
        {img: 'bas7_carne.jpg', name: 'Carne roja', line1: 'Dos veces por semana', line2: 'Del tamaño de su palma', verdict: 'medio'},
        {img: 'bas7_fiambre.jpg', name: 'Fiambre', line1: 'Fuera de la costumbre diaria', verdict: 'no'},
        {img: 'bas7_batido.jpg', name: 'Batido de proteína', line1: 'Consúltelo con su médico', verdict: 'no'},
      ]}
      footer="Verde, amarillo y rojo: a la hora de comer, nadie se acuerda de un número."
    />
  )},
  // DON ANÍBAL — la creatinina afloja (pago emocional)
  {from: 27932, dur: 250, dir: 'in', node: <CreatininaScene from={2.4} to={1.5} caption="Creatinina" subcaption="aflojó en el control siguiente" />},
  /* ---------- COSTURA: acá arranca la cola locutada (avatar en bucle) ---------- */
  // LAS 4 SEÑALES
  {from: 28509, dur: 700, dir: 'up', node: <AlertSignalsScene title="¿Sus riñones ya piden ayuda?" signals={['Orina espumosa que no se va', 'Hinchazón: tobillos, párpados, el anillo', 'Cansancio que no se arregla durmiendo', 'Picazón en la piel, sobre todo de noche']} footer="Si reconoce 2 o más, pídale a su médico un análisis" />},
  // QUÉ HAY ADENTRO DE LA GUÍA
  {from: 31983, dur: 1660, dir: 'in', node: <MethodStackScene rows={[
    {img: 'img/bas7_lamina_c.jpg', title: 'El semáforo renal', sub: 'casi 300 alimentos, de la A a la Z', stat: '300', statLabel: 'alimentos con su porción'},
    {img: 'img/bas6_p_calendario_pared.jpg', title: '90 días para bajar la creatinina', sub: 'día por día, hasta su próximo análisis', stat: '90', statLabel: 'días'},
    {img: 'img/bas7_lamina_b.jpg', title: 'El botiquín traicionero', sub: 'pastillas, hierbas y suplementos', stat: '27', statLabel: 'revisados uno por uno'},
    {img: 'img/bas7_broll_analisis.jpg', title: 'Su análisis traducido', sub: 'qué le dice cada sigla del papel'},
  ]} />},
  // CTA — el QR y cómo escanearlo
  {from: 33900, dur: 1290, dir: 'up', node: <Lower y={130} k={0.86}><QrCtaScene qr="renal/bas_qr_bastida.png" kicker="Dr. Bastida · Salud renal" title="La guía completa del riñón" steps={['Abra la cámara de su teléfono', 'Apunte al código de la pantalla', 'Toque el aviso que aparece arriba']} note="También en la descripción, es el primer enlace" /></Lower>},
  // TESTIMONIAL Norma
  {from: 35639, dur: 900, dir: 'left', node: <TestimonialScene img="img/bas7_norma_kitchen.jpg" name="Norma" place="Puebla" quote={'“Siete días midiendo con la palma y cambiando el fiambre de la noche… dormía mejor y se me bajó la hinchazón.”'} tag="El reto de la palma" />},
  // RECAP SÍ / NO
  {from: 36608, dur: 640, dir: 'up', node: <FoodVerdictScene title="Proteínas para su riñón: SÍ / NO" good={GOOD} bad={BAD} />},
  // reprise del QR sobre el cierre
  {from: 37596, dur: 300, dir: 'in', node: <Lower y={130} k={0.86}><QrCtaScene qr="renal/bas_qr_bastida.png" kicker="El mapa entero" title="El semáforo de todos los alimentos" steps={['Cámara del teléfono', 'Apunte al código', 'Toque el aviso']} note="O el enlace de aquí abajo" /></Lower>},
];

const BROLL: {from: number; dur: number; img: string; caption?: string; kb?: number}[] = [
  {from: 1080, dur: 150, img: 'bas6_p_farmacia_estante.jpg', caption: 'La que toma todos los días'},
  {from: 1445, dur: 150, img: 'bas6_p_dietetica_estante.jpg', caption: 'El pote a precio de oro'},
  {from: 2000, dur: 150, img: 'bas6_p_paciente_asustado.jpg', caption: 'Un número en un papel'},
  {from: 2760, dur: 150, img: 'bas6_p_respirar_ventana.jpg', caption: 'Respire'},
  {from: 3520, dur: 150, img: 'bas6_p_bife_plato.jpg', caption: 'Lo que pone en el plato'},
  {from: 4200, dur: 160, img: 'bas6_p_basura_desecho.jpg', caption: 'Un resto que va a la sangre'},
  {from: 5000, dur: 160, img: 'bas6_broll_lab.jpg', caption: 'Lo que mide el análisis'},
  {from: 6000, dur: 150, img: 'bas7_carne.jpg', caption: '¿Qué deja atrás cada una?'},
  {from: 6960, dur: 160, img: 'bas6_broll_huesos.jpg', caption: 'Se lo roba de sus huesos'},
  {from: 7150, dur: 160, img: 'bas6_p_caneria_sarro.jpg', caption: 'Como sarro en la cañería'},
  {from: 7480, dur: 170, img: 'bas6_p_paciente_asustado.jpg', caption: 'Se asusta y deja la proteína'},
  {from: 7934, dur: 170, img: 'bas7_broll_sopita.jpg', caption: 'Sopita, té y galletitas'},
  {from: 8700, dur: 160, img: 'bas6_p_cansancio_cama.jpg', caption: 'Más flaco, más débil'},
  {from: 9078, dur: 70, img: 'bas6_p_bife_plato.jpg', caption: 'El plato de anoche'},
  {from: 9700, dur: 170, img: 'bas6_broll_lab.jpg', caption: 'Y el número de hoy'},
  {from: 9900, dur: 150, img: 'bas6_p_lab_lupa.jpg', caption: 'Un número que no miente… si lo miden bien'},
  {from: 10255, dur: 160, img: 'bas7_broll_platon.jpg', caption: 'El plato del restaurante'},
  {from: 10430, dur: 150, img: 'bas7_carne.jpg', caption: 'Su porción, no la del vecino'},
  {from: 11850, dur: 160, img: 'bas6_p_frasco_heladera.jpg', caption: '¿Cuánto le dura?'},
  {from: 12100, dur: 150, img: 'bas7_fiambre.jpg', caption: 'Tres meses en la góndola'},
  {from: 12616, dur: 160, img: 'bas7_clara.jpg', caption: 'La leña que arde limpia'},
  {from: 13400, dur: 160, img: 'bas6_p_desayuno_manana.jpg', caption: 'Dos o tres claras revueltas'},
  {from: 14250, dur: 170, img: 'bas7_pescado.jpg', caption: 'Merluza, lenguado, pescadilla'},
  {from: 14600, dur: 160, img: 'bas6_broll_kidney.jpg', caption: 'Un ovillo de arterias chiquitas'},
  {from: 15032, dur: 170, img: 'bas7_pescado.jpg', caption: 'Ni rebozado ni en bastoncitos'},
  {from: 15300, dur: 150, img: 'bas7_pescado.jpg', caption: 'Del tamaño de su palma'},
  {from: 16000, dur: 170, img: 'bas7_lentejas.jpg', caption: 'El guiso de siempre'},
  {from: 16400, dur: 150, img: 'bas6_p_almacen_barrio.jpg', caption: 'La más barata de las tres'},
  {from: 16684, dur: 170, img: 'bas7_broll_remojo.jpg', caption: 'Ocho horas en remojo'},
  {from: 17000, dur: 160, img: 'bas6_p_colador_agua.jpg', caption: 'Y esa agua se tira'},
  {from: 18422, dur: 180, img: 'bas7_fiambre.jpg'},
  {from: 19308, dur: 170, img: 'bas7_fiambre.jpg', caption: 'Si dura tres meses…'},
  {from: 19628, dur: 180, img: 'bas7_carne.jpg'},
  {from: 20000, dur: 160, img: 'bas6_p_bife_plato.jpg', caption: 'Carne al mediodía y a la noche'},
  {from: 20473, dur: 170, img: 'bas7_carne.jpg', caption: 'Cuanto más cocida, más ceniza'},
  {from: 21098, dur: 180, img: 'bas7_broll_caldo.jpg', caption: 'El caldo… tírelo'},
  {from: 22700, dur: 160, img: 'bas7_batido.jpg', caption: 'La etiqueta linda'},
  {from: 23200, dur: 160, img: 'bas6_p_farmacia_estante.jpg', caption: 'Lo que se vende suelto'},
  {from: 26150, dur: 160, img: 'bas6_p_semaforo_calle.jpg', caption: 'Verde, amarillo, rojo'},
  {from: 26581, dur: 180, img: 'bas7_anibal_consultorio.jpg', caption: 'Don Aníbal, 71'},
  {from: 27000, dur: 160, img: 'bas7_batido.jpg', caption: 'Un batido cada mañana'},
  {from: 27250, dur: 150, img: 'bas7_fiambre.jpg', caption: 'Y el sánguche de la noche'},
  {from: 27530, dur: 180, img: 'bas7_anibal_desayuno.jpg', caption: 'Dos claras y una tostada'},
  {from: 28230, dur: 300, img: 'bas7_anibal_desayuno.jpg', caption: 'Cambió el desayuno y la cena'},
  /* ---- cola ---- */
  {from: 29215, dur: 165, img: 'bas6_broll_tobillos.jpg', caption: 'Hinchazón en los tobillos'},
  {from: 29385, dur: 160, img: 'bas6_p_cansancio_cama.jpg', caption: 'Un cansancio que no se va'},
  {from: 29550, dur: 145, img: 'bas6_broll_picazon.jpg', caption: 'Picazón de noche'},
  {from: 29700, dur: 170, img: 'bas6_broll_lab.jpg', caption: 'Un análisis simple'},
  {from: 30008, dur: 170, img: 'bas6_p_consulta_medico.jpg', caption: 'Yo no le miento nunca'},
  {from: 30400, dur: 160, img: 'bas6_p_nefrologo_control.jpg', caption: 'Su médico ajusta sus números'},
  {from: 30700, dur: 160, img: 'bas7_lentejas.jpg', caption: '¿Potasio alto? que lo autorice él'},
  {from: 31275, dur: 170, img: 'bas7_lamina_a.jpg', caption: 'Las láminas de hoy'},
  {from: 31500, dur: 170, img: 'bas7_lamina_d.jpg', caption: 'Páginas de la guía'},
  {from: 35250, dur: 160, img: 'bas6_p_nieto_ayuda.jpg', caption: 'Pídale a un hijo o a un nieto'},
  {from: 37300, dur: 170, img: 'bas6_p_cocina_manana.jpg', caption: 'Esta noche, en la cena'},
  {from: 37860, dur: 140, img: 'bas6_broll_kidney.jpg', caption: 'El riñón agradece en silencio'},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 1339, dur: 190, node: <KeyWord word="LA MÁS “SANA”" sub="…y la peor de todas" color={BAS.no} />},
  {from: 3253, dur: 230, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: 6127, dur: 150, node: <SideIllustration img="img/ill/bas7_ill_carne.png" side="right" caption="La misma leña" dur={150} size={360} />},
  {from: 8814, dur: 210, node: <KeyWord word="EL APELLIDO" sub="no la cantidad de proteína" />},
  {from: 9822, dur: 210, node: <KeyWord word="CENA LIVIANA" sub="la noche antes del análisis" />},
  {from: 11896, dur: 210, node: <KeyWord word="SI NO SE PUDRE" sub="no es comida fresca" color={BAS.no} />},
  {from: 13892, dur: 220, node: <KeyWord word="MUCHAS CLARAS" sub="poca yema" color={BAS.si} />},
  {from: 16840, dur: 200, node: <KeyWord word="TIRE ESA AGUA" sub="y hierva en agua limpia" color={BAS.si} />},
  {from: 18248, dur: 160, node: <KeyWord word="LAS 3 QUE CARGAN" sub="el filtro, sin que usted se entere" color={BAS.no} />},
  {from: 18422, dur: 200, node: <TraidoraTag name="Fiambre" reason="Sal + fósforo AÑADIDO" />},
  {from: 18852, dur: 260, node: <StatTag a="1 feta" b="3 bifes" note="de sal" />},
  {from: 19628, dur: 210, node: <TraidoraTag name="Carne roja a diario" reason="La leña que más ceniza ácida deja" />},
  {from: 20800, dur: 230, node: <KeyWord word="EL CALDO" sub="creatinina casi pura, servida en cuchara" color={BAS.no} />},
  {from: 23643, dur: 200, node: <CautionChip text="Llévele el pote a su médico, con la etiqueta" />},
  {from: 26322, dur: 260, node: <StatTag a="6" b="300" note="alimentos en el semáforo completo" />},
  {from: 29635, dur: 230, node: <CautionChip text="¿Dos o más señales? pida un análisis" />},
  {from: 30190, dur: 230, node: <CautionChip text="¿Enfermedad renal avanzada? su médico manda" />},
  {from: 37222, dur: 240, node: <KeyWord word="EL BATIDO" sub="era la trampa" color={BAS.no} />},
  {from: 38000, dur: 460, node: <SubscribeCard />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 6, name: 'carousel_whoosh'}, {at: 40, name: 'carousel_fanout', vol: 0.5}, {at: 640, name: 'carousel_lock', vol: 0.5},
  {at: 2402, name: 'fear_drone', vol: 0.6}, {at: 2512, name: 'fear_impact'}, {at: 2566, name: 'fear_shatter'},
  {at: 3253, name: 'note_sparkle', vol: 0.5}, {at: 3925, name: 'note_sparkle', vol: 0.5},
  {at: 5393, name: 'carousel_whoosh', vol: 0.5}, {at: 6290, name: 'note_sparkle', vol: 0.5},
  {at: 8252, name: 'fear_impact', vol: 0.4}, {at: 10700, name: 'note_sparkle', vol: 0.5},
  {at: 11254, name: 'chip_strike', vol: 0.45},
  {at: 12470, name: 'carousel_whoosh', vol: 0.5}, {at: 14110, name: 'carousel_whoosh', vol: 0.5}, {at: 15650, name: 'carousel_whoosh', vol: 0.5},
  {at: 17511, name: 'page_turn', vol: 0.6},
  {at: 18422, name: 'chip_strike', vol: 0.5}, {at: 19628, name: 'chip_strike', vol: 0.5}, {at: 21960, name: 'chip_strike', vol: 0.6},
  {at: 21391, name: 'carousel_whoosh', vol: 0.5}, {at: 21451, name: 'carousel_lock', vol: 0.5},
  {at: 22042, name: 'fear_impact', vol: 0.45},
  {at: 23760, name: 'page_turn', vol: 0.6}, {at: 24917, name: 'page_turn', vol: 0.6},
  {at: 27932, name: 'note_sparkle', vol: 0.5},
  {at: 28509, name: 'fear_impact', vol: 0.4},
  {at: 31983, name: 'page_turn', vol: 0.55}, {at: 33900, name: 'note_sparkle', vol: 0.5},
  {at: 35639, name: 'carousel_whoosh', vol: 0.4}, {at: 36608, name: 'note_sparkle', vol: 0.5},
];

export const MainBastidaRenal7: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR — tramo 1 con su propio audio (lipsync real) */}
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile('renal/avatar7.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Sequence>
      {/* AVATAR — tramo 2 EN BUCLE y MUDO (la voz la pone la cola locutada) */}
      <Sequence from={AVATAR_FRAMES} durationInFrames={TOTAL_R7 - AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile('renal/avatar7.mp4')} startFrom={LOOP_FROM} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Sequence>
      {/* COLA LOCUTADA (Fish, voz clonada del propio avatar) */}
      <Sequence from={COLA_START}>
        <Audio src={staticFile('renal/bastida7_cola.m4a')} />
      </Sequence>

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
          <BRoll img={b.img} caption={b.caption} dur={b.dur} kb={b.kb ?? 1} />
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

      {/* MÚSICA bed */}
      <Audio src={staticFile('renal/music/bas_music_quiet_pulse_bed_a.mp3')} volume={0.1} loop />

      {/* SFX */}
      {SFX.map((s, i) => (
        <Sequence key={`sf${i}`} from={s.at} durationInFrames={90}>
          <Audio src={sfxf(s.name)} volume={s.vol ?? 0.7} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
