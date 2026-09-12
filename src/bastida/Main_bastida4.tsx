/**
 * Main_bastida4 — MONTAJE del video #4 "Creatinina Alta: 3 Frutas que Puede Comer Sin Riesgo (y 3 que la Disparan)".
 * Avatar renal/avatar4.mp4 (OffthreadVideo persistente, audio continuo) + grade teal-navy + marca Bastida
 * (tapa watermark Federer). Data-driven anclado al ms de Whisper (public/captions_bastidarenal4.json).
 * Unión SIN CORTES: cada escena de profundidad va envuelta en MatchWhip (vector compartido + motion-blur
 * + estela de luz que cruza el límite). Kit: RenalCarousel (6 frutas + split SÍ/NO), ChapterScene (openers
 * SÍ), FearToCalm, PresenterIntro, CreatininaScene, AlertSignalsScene, QrCtaScene, TestimonialScene.
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, PresenterIntro, BRoll, BClip, SideIllustration} from './BastidaFX';
import {ChapterScene, CHAPTER_CONFIGS} from './ChapterScene';
import {CreatininaScene} from './CreatininaScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {QrCtaScene} from './QrCtaScene';
import {TestimonialScene} from './TestimonialScene';
import {MatchWhip, WhipDir} from './MatchWhip';

export const TOTAL_4 = 31920;

const CARDS = [
  {name: 'Manzana', img: 'img/bas4_manzana.png', tint: '#2FA96B'},
  {name: 'Frutillas', img: 'img/bas4_frutillas.png', tint: '#2FA96B'},
  {name: 'Piña', img: 'img/bas4_pina.png', tint: '#2FA96B'},
  {name: 'Banana', img: 'img/bas4_banana.png', tint: '#D64541'},
  {name: 'Naranja', img: 'img/bas4_naranja.png', tint: '#D64541'},
  {name: 'Palta', img: 'img/bas4_palta.png', tint: '#D64541'},
];
const VERD: ('si' | 'no')[] = ['si', 'si', 'si', 'no', 'no', 'no'];
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

/** KeyWord — palabra clave que golpea (POTASIO). */
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

/** TraidoraTag — sello rojo ✕ para las frutas que NO (banana/naranja/palta). */
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

/** StatTag — el golpe "1 palta = 2 bananas de potasio". */
const StatTag: React.FC<{a: string; b: string; note?: string}> = ({a, b, note}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  const bIn = spring({frame: f - 14, fps, config: {damping: 120}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 100, fontWeight: 800, color: BAS.si, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>{a}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 70, fontWeight: 800, color: '#EAF2F4'}}>=</div>
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

/* ============================ BEATS (anclados a captions_bastidarenal4.json) ============================ */
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  // COLD OPEN — carrusel escenario: 6 frutas bloqueadas → se abre en dos arcos SÍ/NO (f761)
  {from: 0, dur: 1080, dir: 'in', node: <RenalCarousel cards={CARDS} reveals={[]} verdicts={VERD} splitAt={761} introDur={40} kicker="Creatinina · Salud renal" title="6 frutas · 2 bandos" />},
  // DIÁLISIS → respire
  {from: 2135, dur: 300, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={110} />},
  // Presentación
  {from: 2916, dur: 210, dir: 'left', node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Su médico de confianza" img="renal/bastida_cutout.png" />},
  // Creatinina = desecho que se queda → la aguja SUBE
  {from: 3496, dur: 220, dir: 'in', node: <CreatininaScene from={1.1} to={2.7} caption="Creatinina" subcaption="se queda en la sangre" />},
  // FRUTAS SÍ — openers 2.5D
  {from: 6926, dur: 110, dir: 'right', node: <ChapterScene {...CHAPTER_CONFIGS.manzana} />},
  {from: 8394, dur: 110, dir: 'left', node: <ChapterScene {...CHAPTER_CONFIGS.frutillas} />},
  {from: 10500, dur: 110, dir: 'right', node: <ChapterScene {...CHAPTER_CONFIGS.pina} />},
  // DOÑA MARTA: la creatinina se ESTABILIZA → la aguja BAJA (pago emocional miedo→alivio)
  {from: 23216, dur: 210, dir: 'in', node: <CreatininaScene from={2.6} to={1.4} caption="Creatinina" subcaption="estable en 3 meses" />},
  // SEÑALES DE ALERTA (4 pistas)
  {from: 25340, dur: 240, dir: 'up', node: <AlertSignalsScene />},
  // CTA QR
  {from: 28393, dur: 1090, dir: 'in', node: <QrCtaScene />},
  // TESTIMONIAL Rosa
  {from: 29538, dur: 980, dir: 'left', node: <TestimonialScene img="img/bas4_rosa_kitchen.png" name="Rosa" place="Guadalajara" />},
];

// clip → BClip (mp4 real, mute) · img → BRoll (foto Ken-Burns)
const BROLL: {from: number; dur: number; clip?: string; img?: string; caption?: string; kb?: number}[] = [
  {from: 1042, dur: 120, clip: 'bas_worried_senior', caption: 'Miles de pacientes'},
  {from: 2074, dur: 90, clip: 'bas_labreport', caption: 'Creatinina alta'},
  {from: 3900, dur: 130, clip: 'bas_filter_clog', caption: 'El colador se tapa'},
  {from: 5300, dur: 130, clip: 'bas_blood_pressure', caption: 'Potasio y corazón'},
  // manzana
  {from: 7405, dur: 140, img: 'bas4_manzana', caption: 'Fibra pectina'},
  // frutillas / oxidación
  {from: 8850, dur: 150, clip: 'fruta_apple_browning', caption: 'Estrés oxidativo'},
  {from: 9700, dur: 130, img: 'bas4_frutillas', caption: 'Antioxidantes'},
  // piña
  {from: 10950, dur: 140, img: 'bas4_pina', caption: 'Bromelina · desinflama'},
  {from: 11550, dur: 120, clip: 'fruta_sugar_spoon', caption: 'Almíbar = azúcar pura'},
  // recap 3 seguras + reglas de comer
  {from: 12000, dur: 130, clip: 'fruta_fruit_market', caption: 'Sus tres seguras'},
  {from: 12620, dur: 140, img: 'bas4_naranja', caption: 'Entera, nunca en jugo'},
  {from: 13720, dur: 150, img: 'bas4_frutillas', caption: 'Con yogur natural'},
  // traidoras (foto full-bleed; el TraidoraTag va como overlay encima)
  {from: 15286, dur: 150, img: 'bas4_banana'},
  {from: 16439, dur: 150, img: 'bas4_naranja'},
  {from: 17893, dur: 150, img: 'bas4_palta'},
  // recap traidoras + regla de oro
  {from: 19850, dur: 140, clip: 'fruta_fruit_market', caption: 'Las tres: con respeto'},
  {from: 20740, dur: 140, img: 'bas4_manzana', caption: 'Livianas = amables'},
  {from: 20960, dur: 150, img: 'bas4_palta', caption: 'Densas = de cuidado'},
  // doña Marta
  {from: 21573, dur: 150, clip: 'bas_worried_senior', caption: 'Doña Marta, 68'},
  {from: 22898, dur: 150, img: 'bas4_manzana', caption: 'Jugo → manzana'},
  // ladrillo
  {from: 24075, dur: 130, img: 'bas_broll_kidney', caption: 'Un ladrillo por día', kb: 1},
  {from: 25159, dur: 130, img: 'bas_broll_kidney_anatomy', caption: 'El riñón no duele', kb: -1},
  // señales
  {from: 25900, dur: 130, clip: 'bas_swollen_ankles', caption: 'Hinchazón'},
  {from: 26450, dur: 130, clip: 'bas_tired_senior', caption: 'Cansancio raro'},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  // POTASIO — la palabra que decide todo
  {from: 4955, dur: 180, node: <KeyWord word="POTASIO" sub="el mineral que lo decide" />},
  // SideIllustrations flotando cuando nombra cada fruta SÍ
  {from: 7100, dur: 150, node: <SideIllustration img="img/ill/bas4_ill_manzana.png" side="right" caption="Baja en potasio" dur={150} size={380} />},
  {from: 9750, dur: 150, node: <SideIllustration img="img/ill/bas4_ill_frutillas.png" side="left" caption="Antioxidantes" dur={150} size={360} />},
  {from: 11000, dur: 150, node: <SideIllustration img="img/ill/bas4_ill_pina.png" side="right" caption="Poco potasio" dur={150} size={380} />},
  // traidoras — sellos rojos
  {from: 15286, dur: 160, node: <TraidoraTag name="Banana" reason="De las más altas en potasio" />},
  {from: 16439, dur: 160, node: <TraidoraTag name="Naranja y su jugo" reason="Potasio + azúcar concentrada" />},
  {from: 17893, dur: 160, node: <TraidoraTag name="Palta" reason="La más alta en potasio" />},
  // el golpe estadístico de la palta (cubre hasta el remate "Dos. Bananas." f18732)
  {from: 18420, dur: 330, node: <StatTag a="1 palta" b="2 bananas" note="de potasio" />},
  // cuidado avanzado
  {from: 27050, dur: 170, node: <CautionChip text="¿Enfermedad renal avanzada? Consulte a su médico" />},
  // suscríbase (cierre)
  {from: 30587, dur: 1300, node: <SubscribeCard />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 6, name: 'carousel_whoosh'}, {at: 40, name: 'carousel_fanout', vol: 0.5}, {at: 761, name: 'carousel_whoosh', vol: 0.5}, {at: 790, name: 'carousel_lock', vol: 0.5},
  {at: 2135, name: 'fear_drone', vol: 0.6}, {at: 2245, name: 'fear_impact'}, {at: 2300, name: 'fear_shatter'},
  {at: 2916, name: 'carousel_whoosh', vol: 0.5}, {at: 2932, name: 'note_sparkle', vol: 0.6},
  {at: 3496, name: 'note_sparkle', vol: 0.5}, {at: 4955, name: 'fear_impact', vol: 0.4},
  {at: 6926, name: 'carousel_whoosh', vol: 0.5}, {at: 8394, name: 'carousel_whoosh', vol: 0.5}, {at: 10500, name: 'carousel_whoosh', vol: 0.5},
  {at: 15286, name: 'chip_strike', vol: 0.5}, {at: 16439, name: 'chip_strike', vol: 0.5}, {at: 17893, name: 'chip_strike', vol: 0.6}, {at: 18420, name: 'fear_impact', vol: 0.5},
  {at: 25340, name: 'fear_impact', vol: 0.4}, {at: 28393, name: 'note_sparkle', vol: 0.5}, {at: 29538, name: 'carousel_whoosh', vol: 0.4},
];

export const MainBastida4: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      <OffthreadVideo src={staticFile('renal/avatar4.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
