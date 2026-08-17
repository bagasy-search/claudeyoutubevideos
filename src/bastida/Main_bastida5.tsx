/**
 * Main_bastida5 — MONTAJE del video #5 "Top 3 Leches para Bajar la Creatinina (y 3 que Debe Evitar)".
 * Avatar renal/avatar5.mp4 (OffthreadVideo persistente, audio continuo) + grade teal-navy + marca Bastida
 * (tapa watermark Federer). Data-driven anclado al ms de Whisper (public/captions_bastidarenal5.json).
 * Villano = FÓSFORO / fosfatos añadidos (AbsorbBar 50% vs 100%). Giro = SOJA "la más sana"=peor (carousel split).
 * Kit: RenalCarousel (6 leches + split SÍ/NO), ChapterScene (openers SÍ almendras/arroz/avena), FearToCalm,
 * PresenterIntro, CreatininaScene, FoodVerdictScene, AlertSignalsScene, QrCtaScene, TestimonialScene (Marta).
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, PresenterIntro, BRoll, BClip, SideIllustration} from './BastidaFX';
import {ChapterScene, CHAPTER_CONFIGS} from './ChapterScene';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {QrCtaScene} from './QrCtaScene';
import {TestimonialScene} from './TestimonialScene';
import {MatchWhip, WhipDir} from './MatchWhip';

export const TOTAL_5 = 33949;

const CARDS = [
  {name: 'Almendras', img: 'img/bas5_almendras.png', tint: '#2FA96B'},
  {name: 'Arroz', img: 'img/bas5_arroz.png', tint: '#2FA96B'},
  {name: 'Avena', img: 'img/bas5_avena.png', tint: '#2FA96B'},
  {name: 'Vaca entera', img: 'img/bas5_vaca.png', tint: '#D64541'},
  {name: 'Condensada', img: 'img/bas5_condensada.png', tint: '#D64541'},
  {name: 'Soja', img: 'img/bas5_soja.png', tint: '#D64541'},
];
const VERD: ('si' | 'no')[] = ['si', 'si', 'si', 'no', 'no', 'no'];
const GOOD = [
  {img: 'img/bas5_ill_almendras.png', name: 'Almendras'},
  {img: 'img/bas5_ill_arroz.png', name: 'Arroz'},
  {img: 'img/bas5_ill_avena.png', name: 'Avena'},
];
const BAD = [
  {img: 'img/bas5_ill_vaca.png', name: 'Vaca entera'},
  {img: 'img/bas5_ill_condensada.png', name: 'Condensada'},
  {img: 'img/bas5_ill_soja.png', name: 'Soja'},
];
const sfxf = (n: string) => staticFile(`renal/sfx/bas_sfx_${n}.mp3`);

/* ---- helpers inline ---- */
const CautionChip: React.FC<{text?: string}> = ({text = 'Consulte a su médico'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 140}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 96}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: BAS.card, borderRadius: 999, padding: '14px 30px', borderLeft: `6px solid ${BAS.amber}`, boxShadow: '0 22px 46px rgba(0,0,0,0.45)', opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`}}>
        <span style={{fontSize: 30, color: BAS.amber}}>⚠</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: BAS.brand}}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

/** KeyWord — palabra clave que golpea (FÓSFORO). */
const KeyWord: React.FC<{word: string; sub?: string}> = ({word, sub}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 120, mass: 0.8}});
  const glow = 0.4 + Math.sin(f / fps * Math.PI * 2) * 0.3;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 168, fontWeight: 800, letterSpacing: 4, color: BAS.amber, textShadow: `0 0 ${30 + glow * 40}px ${rgba(BAS.amber, 0.6)}, 0 8px 30px rgba(0,0,0,0.6)`}}>{word}</div>
        {sub && <div style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 600, color: '#EAF2F4', marginTop: 4, textShadow: '0 3px 14px rgba(0,0,0,0.7)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

/** AbsorbBar — el twist del fósforo: natural ~50% vs AÑADIDO ~100% de absorción (dos barras que crecen). */
const AbsorbBar: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 150, mass: 0.9}});
  const natW = interpolate(spring({frame: f - 10, fps, config: {damping: 120}}), [0, 1], [0, 50]);
  const addW = interpolate(spring({frame: f - 40, fps, config: {damping: 120}}), [0, 1], [0, 100]);
  const Row: React.FC<{label: string; pct: number; w: number; color: string}> = ({label, pct, w, color}) => (
    <div style={{marginBottom: 34}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10}}>
        <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: '#EAF2F4'}}>{label}</span>
        <span style={{fontFamily: FONT_DISPLAY, fontSize: 56, fontWeight: 800, color}}>{Math.round(w)}%</span>
      </div>
      <div style={{height: 40, borderRadius: 999, background: rgba('#ffffff', 0.08), overflow: 'hidden', border: `1px solid ${rgba('#ffffff', 0.12)}`}}>
        <div style={{width: `${w}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${rgba(color, 0.75)}, ${color})`, boxShadow: `0 0 24px ${rgba(color, 0.5)}`}} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 1120, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 58, fontWeight: 800, color: '#F4F1E9', marginBottom: 40, textAlign: 'center', textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>¿Cuánto fósforo absorbe su cuerpo?</div>
        <Row label="Fósforo NATURAL (del alimento)" pct={50} w={natW} color={BAS.si} />
        <Row label="Fósforo AÑADIDO (de fábrica)" pct={100} w={addW} color={BAS.no} />
        <div style={{marginTop: 18, textAlign: 'center', fontFamily: FONT_SANS, fontSize: 34, fontWeight: 600, color: rgba('#EAF2F4', 0.9)}}>El añadido entra casi entero — la puerta abierta de par en par.</div>
      </div>
    </AbsoluteFill>
  );
};

/** TraidoraTag — sello rojo ✕ para las leches que NO. */
const TraidoraTag: React.FC<{name: string; reason: string}> = ({name, reason}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  const stamp = spring({frame: f - 6, fps, config: {damping: 90, mass: 0.6}});
  return (
    <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 0 96px 80px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`}}>
        <div style={{width: 96, height: 96, borderRadius: '50%', background: BAS.no, color: BAS.onNo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, boxShadow: `0 14px 34px ${rgba(BAS.no, 0.5)}`, transform: `scale(${interpolate(stamp, [0, 1], [1.6, 1])}) rotate(${interpolate(stamp, [0, 1], [-14, -6])}deg)`}}>✕</div>
        <div style={{background: rgba('#1a0b0b', 0.72), borderRadius: 18, padding: '16px 30px', borderLeft: `6px solid ${BAS.no}`, boxShadow: '0 20px 44px rgba(0,0,0,0.5)'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 54, fontWeight: 700, color: '#FFF1F0'}}>{name}</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 600, color: rgba('#FFD9D6', 0.9)}}>{reason}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** StatTag — el golpe "Soja ≈ Vaca de fósforo". */
const StatTag: React.FC<{a: string; b: string; note?: string}> = ({a, b, note}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  const bIn = spring({frame: f - 14, fps, config: {damping: 120}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 100, fontWeight: 800, color: BAS.no, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>{a}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 70, fontWeight: 800, color: '#EAF2F4'}}>≈</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 100, fontWeight: 800, color: BAS.no, textShadow: `0 0 30px ${rgba(BAS.no, 0.5)}, 0 6px 24px rgba(0,0,0,0.6)`, transform: `scale(${interpolate(bIn, [0, 1], [0.7, 1])})`, opacity: bIn}}>{b}</div>
      </div>
      {note && <div style={{position: 'absolute', bottom: '34%', fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, letterSpacing: 2, color: rgba('#EAF2F4', 0.85), opacity: bIn}}>{note.toUpperCase()}</div>}
    </AbsoluteFill>
  );
};

/** SubscribeCard — cierre. */
const SubscribeCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 150}});
  const pulse = 1 + Math.sin(f / fps * Math.PI * 2) * 0.03;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 90}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: BAS.no, borderRadius: 16, padding: '18px 40px', boxShadow: `0 20px 50px ${rgba(BAS.no, 0.5)}`, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${pulse})`}}>
        <span style={{fontSize: 40, color: '#fff'}}>▶</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: 1}}>SUSCRÍBASE AL CANAL</span>
      </div>
    </AbsoluteFill>
  );
};

/* ============================ BEATS (anclados a captions_bastidarenal5.json) ============================ */
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  // COLD OPEN — 6 leches bloqueadas con candado; soja pulsa (loop): ¿cuál es la peor?
  {from: 0, dur: 1120, dir: 'in', node: <RenalCarousel cards={CARDS} reveals={[]} teaseIndex={5} introDur={40} kicker="Creatinina · Salud renal" title="6 leches · ¿cuál es la peor?" />},
  // DIÁLISIS → respire
  {from: 2455, dur: 300, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={110} />},
  // Presentación
  {from: 3296, dur: 220, dir: 'left', node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Su médico de confianza" img="renal/bastida_cutout.png" />},
  // Creatinina = desecho que se queda → la aguja SUBE
  {from: 3998, dur: 210, dir: 'in', node: <CreatininaScene from={1.1} to={2.6} caption="Creatinina" subcaption="se queda en la sangre" />},
  // EL TWIST DEL FÓSFORO: natural 50% vs añadido 100%
  {from: 6905, dur: 320, dir: 'in', node: <AbsorbBar />},
  // LECHES SÍ — openers 2.5D
  {from: 8803, dur: 120, dir: 'right', node: <ChapterScene {...CHAPTER_CONFIGS.almendras} />},
  {from: 10235, dur: 120, dir: 'left', node: <ChapterScene {...CHAPTER_CONFIGS.arroz} />},
  {from: 11512, dur: 120, dir: 'right', node: <ChapterScene {...CHAPTER_CONFIGS.avena} />},
  // EL GIRO — carrusel se abre en dos arcos SÍ/NO: la soja cae al bando rojo (cierra el loop)
  {from: 19400, dur: 660, dir: 'in', node: <RenalCarousel cards={CARDS} reveals={[]} verdicts={VERD} splitAt={60} introDur={40} kicker="El veredicto" title="3 aliadas · 3 traidoras" />},
  // RECAP completo SÍ verde / NO rojo
  {from: 21523, dur: 540, dir: 'up', node: <FoodVerdictScene title="Leches para el riñón: SÍ / NO" good={GOOD} bad={BAD} />},
  // ALFREDO: la creatinina se ESTABILIZA → la aguja BAJA (pago emocional)
  {from: 24600, dur: 210, dir: 'in', node: <CreatininaScene from={2.5} to={1.4} caption="Creatinina" subcaption="estable en 3 meses" />},
  // SEÑALES DE ALERTA (4 pistas)
  {from: 26905, dur: 320, dir: 'up', node: <AlertSignalsScene />},
  // CTA QR
  {from: 30041, dur: 1150, dir: 'in', node: <QrCtaScene kicker="Dr. Bastida · Salud renal" title="Su guía de las leches" />},
  // TESTIMONIAL Marta
  {from: 31259, dur: 1000, dir: 'left', node: <TestimonialScene img="img/bas5_marta_kitchen.png" name="Marta" place="México" quote={'“Cambié mi leche de todas las mañanas por la segura… a la semana ya me sentía más liviana y menos hinchada.”'} tag="Reto de 7 días" />},
];

// clip → BClip (mp4 real, mute) · img → BRoll (foto Ken-Burns)
const BROLL: {from: number; dur: number; clip?: string; img?: string; caption?: string; kb?: number}[] = [
  {from: 212, dur: 150, img: 'bas5_broll_sarro', caption: 'Como sarro en la cañería'},
  {from: 1988, dur: 150, img: 'bas5_broll_etiqueta', caption: 'Esa letra chiquita'},
  // mecanismo: proteína / arterias / huesos
  {from: 4626, dur: 150, img: 'bas5_vaca', caption: 'Un camión de proteína'},
  {from: 6247, dur: 150, img: 'bas5_broll_arteria', caption: 'Se pega en las arterias'},
  {from: 6502, dur: 150, img: 'bas5_broll_huesos', caption: 'Roba calcio de los huesos'},
  // SÍ #1 almendras
  {from: 9250, dur: 150, img: 'bas5_almendras', caption: 'Casi sin proteína'},
  {from: 9687, dur: 140, img: 'bas5_broll_etiqueta', caption: '"Enriquecida" = ojo'},
  // SÍ #2 arroz
  {from: 10553, dur: 150, img: 'bas5_arroz', caption: 'Casi agua con sabor'},
  {from: 10960, dur: 140, clip: 'bas_blood_pressure', caption: 'Ojo si hay azúcar alta'},
  // SÍ #3 avena
  {from: 11642, dur: 150, img: 'bas5_avena', caption: 'Espumita en el café'},
  {from: 12300, dur: 140, img: 'bas_broll_kidney', caption: 'Menos carga al filtro'},
  // recap seguras + reglas
  {from: 13086, dur: 150, img: 'bas5_broll_breakfast', caption: 'Sus tres seguras'},
  {from: 13409, dur: 150, img: 'bas5_broll_etiqueta', caption: 'Dé vuelta el envase'},
  {from: 14659, dur: 160, img: 'bas5_broll_breakfast', caption: 'Mitad avena, mitad almendras'},
  // NO #1 vaca
  {from: 16009, dur: 170, img: 'bas5_vaca'},
  {from: 16676, dur: 130, clip: 'bas_blood_pressure', caption: 'Grasa + trabajo'},
  // NO #2 condensada
  {from: 17678, dur: 180, img: 'bas5_condensada'},
  // NO #3 soja (tras el carrusel del giro)
  {from: 20200, dur: 180, img: 'bas5_soja', caption: 'Más fósforo que la de vaca'},
  // Alfredo
  {from: 23123, dur: 160, clip: 'bas_worried_senior', caption: 'Don Alfredo, 70'},
  {from: 23577, dur: 150, img: 'bas5_soja', caption: 'La "sana" que le hacía mal'},
  {from: 24075, dur: 150, img: 'bas5_avena', caption: 'Soja → avena'},
  // ladrillo
  {from: 25667, dur: 150, img: 'bas_broll_kidney', caption: 'Un ladrillo por día'},
  // señales (tras AlertSignals depth)
  {from: 27300, dur: 120, clip: 'bas_swollen_ankles', caption: 'Hinchazón'},
  {from: 27430, dur: 120, clip: 'bas_tired_senior', caption: 'Cansancio raro'},
  {from: 27560, dur: 120, img: 'bas_broll_urine_chart', caption: 'Orina espumosa · picazón'},
  {from: 27885, dur: 140, clip: 'bas_labreport', caption: 'Un análisis simple'},
  // ERC
  {from: 28331, dur: 150, img: 'bas_broll_kidney_anatomy', caption: 'Riñón delicado: su médico'},
  // --- rellenos anti-hueco (tramos largos de avatar-solo) ---
  {from: 1300, dur: 160, img: 'bas5_soja', caption: '"Saludable", "con calcio"…'},
  {from: 5050, dur: 150, img: 'bas_broll_kidney', caption: 'Un filtro cansado'},
  {from: 7400, dur: 150, img: 'bas5_broll_etiqueta', caption: 'Fósforo de fábrica'},
  {from: 12550, dur: 150, img: 'bas5_avena', caption: 'Reemplaza a la de vaca'},
  {from: 13900, dur: 150, clip: 'fruta_sugar_spoon', caption: 'Sin azúcar agregada'},
  {from: 17100, dur: 150, img: 'bas5_vaca', caption: 'Por vasos, todos los días'},
  {from: 18440, dur: 150, img: 'bas5_condensada', caption: 'Un postre disfrazado'},
  {from: 20900, dur: 150, img: 'bas5_soja', caption: 'Mírela con lupa'},
  {from: 22600, dur: 150, img: 'bas5_broll_etiqueta', caption: 'Lista corta, sin fosfato'},
  {from: 25100, dur: 150, img: 'bas5_avena', caption: 'Un cambio de envase'},
  {from: 26200, dur: 150, img: 'bas_broll_kidney_anatomy', caption: 'El riñón no duele'},
  {from: 29200, dur: 160, img: 'bas5_broll_breakfast', caption: 'Todo, en una guía'},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  // FÓSFORO — la palabra que decide
  {from: 5470, dur: 190, node: <KeyWord word="FÓSFORO" sub="el mineral que lo decide" />},
  {from: 7994, dur: 160, node: <KeyWord word="FOSFATOS" sub="añadidos: se absorben casi al 100%" />},
  // SideIllustrations cuando nombra cada leche SÍ
  {from: 9060, dur: 150, node: <SideIllustration img="img/bas5_ill_almendras.png" side="right" caption="Poco fósforo" dur={150} size={380} />},
  {from: 10380, dur: 150, node: <SideIllustration img="img/bas5_ill_arroz.png" side="left" caption="La más baja" dur={150} size={360} />},
  {from: 11690, dur: 150, node: <SideIllustration img="img/bas5_ill_avena.png" side="right" caption="Beta-glucano" dur={150} size={380} />},
  // regla de oro — palabra a evitar
  {from: 22275, dur: 200, node: <KeyWord word="FOSFATO" sub="si aparece en la etiqueta, suéltela" />},
  // traidoras — sellos rojos
  {from: 16009, dur: 170, node: <TraidoraTag name="Leche de vaca entera" reason="Fósforo + proteína + grasa" />},
  {from: 17678, dur: 170, node: <TraidoraTag name="Condensada / evaporada" reason="Todo concentrado + azúcar" />},
  {from: 20200, dur: 200, node: <TraidoraTag name="Leche de soja" reason='La "más sana"… la más pesada' />},
  // el golpe: soja ≈ vaca de fósforo
  {from: 20450, dur: 300, node: <StatTag a="Soja" b="≈ Vaca" note="de fósforo" />},
  // cuidado avanzado
  {from: 28600, dur: 180, node: <CautionChip text="¿Enfermedad renal avanzada? Consulte a su médico" />},
  // divisores de capítulo (SÍ / NO)
  {from: 8395, dur: 170, node: <KeyWord word="LAS 3 QUE SÍ" sub="aliadas de su filtro" />},
  {from: 15379, dur: 180, node: <KeyWord word="LAS 3 TRAIDORAS" sub="las que la sobrecargan" />},
  // teaser de la soja antes del giro
  {from: 18950, dur: 200, node: <SideIllustration img="img/bas5_ill_soja.png" side="right" caption='La "reina" de las sanas…' dur={200} size={380} />},
  // callback final: la soja era la trampa (cierra el loop del cold-open)
  {from: 32903, dur: 220, node: <KeyWord word="SOJA" sub='la "más sana"… era la trampa' />},
  // suscríbase (cierre)
  {from: 33200, dur: 749, node: <SubscribeCard />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 6, name: 'carousel_whoosh'}, {at: 40, name: 'carousel_fanout', vol: 0.5}, {at: 700, name: 'carousel_lock', vol: 0.5},
  {at: 2455, name: 'fear_drone', vol: 0.6}, {at: 2565, name: 'fear_impact'}, {at: 2620, name: 'fear_shatter'},
  {at: 3296, name: 'carousel_whoosh', vol: 0.5}, {at: 3312, name: 'note_sparkle', vol: 0.6},
  {at: 3998, name: 'note_sparkle', vol: 0.5}, {at: 5470, name: 'fear_impact', vol: 0.4},
  {at: 6905, name: 'note_sparkle', vol: 0.5},
  {at: 8803, name: 'carousel_whoosh', vol: 0.5}, {at: 10235, name: 'carousel_whoosh', vol: 0.5}, {at: 11512, name: 'carousel_whoosh', vol: 0.5},
  {at: 16009, name: 'chip_strike', vol: 0.5}, {at: 17678, name: 'chip_strike', vol: 0.5}, {at: 20200, name: 'chip_strike', vol: 0.6},
  {at: 19400, name: 'carousel_whoosh', vol: 0.5}, {at: 19460, name: 'carousel_lock', vol: 0.5}, {at: 20450, name: 'fear_impact', vol: 0.5},
  {at: 21523, name: 'note_sparkle', vol: 0.5}, {at: 26905, name: 'fear_impact', vol: 0.4},
  {at: 30041, name: 'note_sparkle', vol: 0.5}, {at: 31259, name: 'carousel_whoosh', vol: 0.4},
];

export const MainBastida5: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      <OffthreadVideo src={staticFile('renal/avatar5.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: `linear-gradient(160deg, ${rgba(BAS.bgPanel, 0.42)}, ${rgba(BAS.bgDeep, 0.5)})`, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 44%, transparent 55%, ${rgba(BAS.bgEdge, 0.5)} 100%)`, pointerEvents: 'none'}} />

      {/* MARCA BASTIDA (tapa watermark Federer del avatar) */}
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
          {b.clip ? <BClip clip={b.clip} caption={b.caption} dur={b.dur} /> : <BRoll img={b.img} caption={b.caption} dur={b.dur} kb={b.kb ?? 1} />}
        </Sequence>
      ))}

      {/* ESCENAS DE PROFUNDIDAD (MatchWhip = unión sin cortes) */}
      {DEPTH.map((d, i) => (
        <Sequence key={`dp${i}`} from={d.from} durationInFrames={d.dur}>
          <MatchWhip dur={d.dur} dir={d.dir}>{d.node}</MatchWhip>
        </Sequence>
      ))}

      {/* OVERLAYS (bg transparente sobre avatar/b-roll) */}
      {OVERLAY.map((o, i) => (
        <Sequence key={`ov${i}`} from={o.from} durationInFrames={o.dur}>{o.node}</Sequence>
      ))}

      {/* MÚSICA bed */}
      <Audio src={staticFile('renal/music/bas_music_quiet_pulse_bed_a.mp3')} volume={0.12} loop />

      {/* SFX */}
      {SFX.map((s, i) => (
        <Sequence key={`sf${i}`} from={s.at} durationInFrames={90}>
          <Audio src={sfxf(s.name)} volume={s.vol ?? 0.7} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
