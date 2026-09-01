/**
 * Main_bastida8 — MONTAJE del video #8 (19:56), Dr. Bastida.
 * "Riñones en Riesgo: 4 Verduras que Debe Comer y 4 que Jamás Debe Tocar"
 * AVATAR PARCIAL: tramo1 real (0..17608 = 586.9s, corta en la papa "No se despegue"),
 * tramo2 BUCLE (17608..fin, tapado por b-roll) = cola con voz Fish `bastida8`.
 * Audio: UN <Audio> master (public/bastidarenal8.wav = avatar + aire + cola). Avatar MUTEADO (OffthreadVideo).
 * Anclado al ms del guion vía _bastidarenal8_frames.json (alineación global). Data-driven.
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Loop,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, HandUnderline, PresenterIntro, BRoll, SideIllustration} from './BastidaFX';
import {ChapterScene, CHAPTER_CONFIGS} from './ChapterScene';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {QrCtaScene} from './QrCtaScene';
import {TestimonialScene} from './TestimonialScene';
import {EsponjaScene} from './EsponjaScene';
import {DosAguasScene} from './DosAguasScene';
import {FilterMechanismScene} from './scenes7/FilterMechanismScene';
import {SplitFoodScene} from './scenes7/SplitFoodScene';
import {RuleScene} from './scenes7/RuleScene';
import {GuidePageScene} from './scenes7/GuidePageScene';
import {SemaforoScene} from './Bastida6Kit';
import bas8clips from './bas8_clips.json';

const CLIPS = bas8clips as {from: number; dur: number; clip: string; caption?: string; kb?: number}[];

export const TOTAL_FRAMES_8 = 35880;
const AVATAR_END = 17608; // 586.933s * 30 — el avatar real corta acá (entre "papa" y "tomate")
const COLA_START = 17620; // AVATAR_END + 0.4s de aire → arranca la cola (voz Fish bastida8)

const sfxf = (n: string) => staticFile(`renal/sfx/bas_sfx_${n}.mp3`);

// 8 verduras — carrusel HERO (open loop): 4 SÍ (verde) + 4 NO (rojo), remolacha (idx7) = el misterio
const CARDS = [
  {name: 'Repollo', img: 'img/bas8_repollo.png'},
  {name: 'Pimiento rojo', img: 'img/bas8_pimiento_rojo.png'},
  {name: 'Coliflor', img: 'img/bas8_coliflor.png'},
  {name: 'Cebolla', img: 'img/bas8_cebolla.png'},
  {name: 'Espinaca', img: 'img/bas8_espinaca_cruda.png'},
  {name: 'Papa', img: 'img/bas8_papa.png'},
  {name: 'Tomate', img: 'img/bas8_tomate_salsa.png'},
  {name: 'Remolacha', img: 'img/bas8_remolacha_jugo.png'},
];
const VERD: ('si' | 'no')[] = ['si', 'si', 'si', 'si', 'no', 'no', 'no', 'no'];

/* ---- helpers ---- */
const Whip: React.FC<{dur: number; children: React.ReactNode; flash?: boolean}> = ({dur, children, flash = true}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 5, dur - 7, dur - 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fl = flash ? interpolate(f, [0, 7], [0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  return (
    <AbsoluteFill style={{opacity: op}}>
      {children}
      {flash && <AbsoluteFill style={{background: rgba(BAS.aquaLite, fl), pointerEvents: 'none'}} />}
    </AbsoluteFill>
  );
};

const CautionChip: React.FC<{text?: string; accent?: string}> = ({text = 'Consulte a su médico', accent = BAS.amber}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 140}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 96}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: BAS.card, borderRadius: 999, padding: '14px 30px', borderLeft: `6px solid ${accent}`, boxShadow: '0 22px 46px rgba(0,0,0,0.45)', opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`}}>
        <span style={{fontSize: 30, color: accent}}>⚠</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: BAS.brand}}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

/* Lower — envuelve un componente para NO taparle la boca al doctor (gotcha #7) */
const Lower: React.FC<{y?: number; k?: number; children: React.ReactNode}> = ({y = 130, k = 0.86, children}) => (
  <AbsoluteFill style={{transform: `translateY(${y}px) scale(${k})`, transformOrigin: 'center 60%'}}>{children}</AbsoluteFill>
);

/* Endcard de cierre (suscribirse) — marca propia */
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 150}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 22, fontWeight: 800, letterSpacing: 4, color: BAS.aqua}}>DR. BASTIDA · SALUD RENAL</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 700, color: '#F4F1E9', marginTop: 14, lineHeight: 1.1}}>Cuide su filtro.</div>
        <div style={{marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 14, background: BAS.no, borderRadius: 999, padding: '18px 40px', boxShadow: '0 22px 50px rgba(0,0,0,0.5)'}}>
          <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 800, color: '#fff'}}>▶ Suscríbase</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* clip real de agnes full-bleed con grade navy + caption + push leve (audio del clip muteado) */
const Clip: React.FC<{clip: string; dur: number; caption?: string; kb?: number}> = ({clip, dur, caption, kb = 1}) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, dur], [1.05, 1.11 + 0.02 * kb], {extrapolateRight: 'clamp'});
  const capP = interpolate(f, [6, 18, dur - 12, dur - 2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#05161f', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        <OffthreadVideo src={staticFile(clip)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(160deg, ${rgba(BAS.bgPanel, 0.28)}, ${rgba(BAS.bgDeep, 0.36)})`, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 46%, transparent 52%, ${rgba(BAS.bgEdge, 0.55)} 100%)`, pointerEvents: 'none'}} />
      {caption && (
        <div style={{position: 'absolute', left: 60, bottom: 74, opacity: capP, transform: `translateY(${interpolate(capP, [0, 1], [14, 0])}px)`}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: rgba('#05161f', 0.5), borderLeft: `4px solid ${BAS.aqua}`, padding: '10px 22px', borderRadius: 6}}>
            <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: '#F4F1E9', letterSpacing: 0.3}}>{caption}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ============================ BEATS (frames del guion anclado) ============================ */
const DEPTH: {from: number; dur: number; node: React.ReactNode; flash?: boolean}[] = [
  // HOOK — carrusel de 8 (4 SÍ / 4 NO), remolacha (idx7) locked = el misterio (open loop)
  {from: 2, dur: 640, node: <RenalCarousel cards={CARDS} verdicts={VERD} splitAt={4} reveals={[70, 100, 130, 160, 300, 340, 380, 100000]} teaseIndex={7} introDur={42} title="4 que debe comer · 4 que jamás debe tocar" kicker="Salud renal · 60+" />},
  // PRESENTACIÓN
  {from: 1368, dur: 150, node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Su médico de confianza" img="renal/bastida_cutout.png" />},
  // MIEDO → CALMA (diálisis)
  {from: 2105, dur: 340, node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={160} />},
  // VILLANO — la verdura = esponja de minerales (escena 130f)
  {from: 4135, dur: 150, node: <EsponjaScene />},
  // MECANISMO — el riñón colador que se tapa
  {from: 6161, dur: 300, node: <FilterMechanismScene kidneyImg="img/bas8_rinon_filtro.png" bloodImg="img/bas8_analisis_sangre.png" title="Su riñón es un colador finísimo" timesLabel="veces por día le filtra la sangre" times={30} ashLabel="Lo que no filtra, se junta: potasio y oxalato" />},
  // doña CRISTINA — la creatinina que sube
  {from: 7742, dur: 220, node: <CreatininaScene from={1.3} to={2.2} caption="Creatinina" subcaption="no bajaba, subía" />},
  // 4 VERDURAS SÍ — openers microescena 2.5D
  {from: 9408, dur: 100, node: <ChapterScene {...CHAPTER_CONFIGS.repollo} number="1" />},
  {from: 10430, dur: 100, node: <ChapterScene {...CHAPTER_CONFIGS.pimiento} number="2" />},
  {from: 11587, dur: 100, node: <ChapterScene {...CHAPTER_CONFIGS.coliflor} number="3" />},
  {from: 12718, dur: 100, node: <ChapterScene {...CHAPTER_CONFIGS.cebolla} number="4" />},
  // RECAP SÍ — las 4 amigas
  {from: 14093, dur: 230, node: <FoodVerdictScene title="Sus 4 verduras amigas" good={[{img: 'img/bas8_repollo.png', name: 'Repollo'}, {img: 'img/bas8_pimiento_rojo.png', name: 'Pimiento rojo'}, {img: 'img/bas8_coliflor.png', name: 'Coliflor'}, {img: 'img/bas8_cebolla.png', name: 'Cebolla'}]} bad={[]} />},
  // ===== TRAMO 2 (bucle, tapado por b-roll) =====
  // TOMATE — fresco vs concentrado
  {from: 17640, dur: 260, node: <SplitFoodScene wholeImg="img/bas8_tomate_salsa.png" goodImg="img/bas8_tomate_salsa.png" badImg="img/bas8_tomate_salsa.png" goodLabel="EL FRESCO" goodSub="una rodaja, con medida" badLabel="EL CONCENTRADO" badSub="salsa, pasta, kétchup: potasio apretado" punchline="El frasco, no la rodaja" cutAt={70} />},
  // REMOLACHA — el GIRO: el carrusel cierra el loop (remolacha se revela)
  {from: 19331, dur: 300, node: <RenalCarousel cards={CARDS} verdicts={VERD} splitAt={4} reveals={[10, 30, 50, 70, 90, 110, 130, 150]} introDur={26} title="La que creía la más sana… la peor" kicker="El jugo detox de doña Cristina" />},
  // LAS DOS AGUAS — la firma del video (escena 150f)
  {from: 21470, dur: 170, node: <DosAguasScene />},
  // REGLA DE ORO
  {from: 23608, dur: 240, node: <RuleScene kicker="La regla de oro" question="¿Cruda y oscura, o hervida y colada?" answer="Lo que es agua, se tira" note="El color oscuro es un aviso, no un premio" img="img/bas8_dos_aguas.png" />},
  // ALIVIO — la creatinina baja (control)
  {from: 25571, dur: 230, node: <CreatininaScene from={2.2} to={1.3} caption="Creatinina" subcaption="usted tiene el control" />},
  // CTA — El Semáforo Renal (las 8 verduras ordenadas)
  {from: 28698, dur: 250, node: <SemaforoScene verde={[{img: 'img/bas8_repollo.png', name: 'Repollo', note: 'libre'}, {img: 'img/bas8_pimiento_rojo.png', name: 'Pimiento rojo', note: 'libre'}, {img: 'img/bas8_coliflor.png', name: 'Coliflor', note: 'libre'}, {img: 'img/bas8_cebolla.png', name: 'Cebolla', note: 'libre'}]} amarillo={[{img: 'img/bas8_papa.png', name: 'Papa', note: 'dos aguas'}, {img: 'img/bas8_tomate_salsa.png', name: 'Tomate', note: 'fresco, medido'}]} rojo={[{img: 'img/bas8_espinaca_cruda.png', name: 'Espinaca cruda', note: 'hervir y colar'}, {img: 'img/bas8_remolacha_jugo.png', name: 'Remolacha en jugo', note: 'evitar cruda'}]} />},
  // CTA — 90 días + Análisis Traducido (lámina)
  {from: 29399, dur: 230, node: <GuidePageScene title="90 días, día por día" kicker="Hasta su próximo análisis" items={[{img: 'img/bas8_analisis_sangre.png', name: 'Su Análisis Traducido', line1: 'Qué es la creatinina', line2: 'Qué preguntarle a su médico'}, {img: 'img/bas8_repollo.png', name: 'El Semáforo Renal', line1: '~300 alimentos', line2: 'Con porción exacta'}]} columns={2} tag="LA GUÍA COMPLETA" page="PLAN" />},
  // CTA — QR (en Lower para no tapar la boca)
  {from: 30666, dur: 320, node: <Lower y={140} k={0.84}><QrCtaScene qr="renal/bas_qr_bastida.png" kicker="Su método renal, paso a paso" title="La guía completa del Dr. Bastida" steps={['Abra la cámara del teléfono', 'Apunte al código y espere', 'Toque el cartelito que aparece']} note="También en el primer enlace de la descripción" /></Lower>},
  // TESTIMONIAL — Teresa de Monterrey
  {from: 31979, dur: 250, node: <TestimonialScene img="img/bas8_teresa_portrait.png" name="Teresa" place="Monterrey" quote="Aprendí lo de las dos aguas y cambié el jugo de remolacha. Mi número se quedó quieto." tag="★★★★★" />},
  // RECAP FINAL — 4 SÍ / 4 NO
  {from: 33518, dur: 230, node: <FoodVerdictScene title="Recuerde" good={[{img: 'img/bas8_repollo.png', name: 'Repollo'}, {img: 'img/bas8_pimiento_rojo.png', name: 'Pimiento rojo'}, {img: 'img/bas8_coliflor.png', name: 'Coliflor'}, {img: 'img/bas8_cebolla.png', name: 'Cebolla'}]} bad={[{img: 'img/bas8_espinaca_cruda.png', name: 'Espinaca'}, {img: 'img/bas8_papa.png', name: 'Papa'}, {img: 'img/bas8_tomate_salsa.png', name: 'Tomate concentrado'}, {img: 'img/bas8_remolacha_jugo.png', name: 'Remolacha'}]} />},
  // CIERRE
  {from: 35380, dur: 500, node: <EndCard />},
];

/* B-ROLL fotos (BRoll Ken-Burns). Los CLIPS de agnes se suman en CLIPS[] (movimiento). */
const BROLL: {from: number; dur: number; img: string; caption?: string; kb?: number}[] = [
  {from: 1518, dur: 120, img: 'bas8_verduras_oscuras', caption: '"Es verdura, es sana"', kb: 1},
  {from: 3211, dur: 130, img: 'bas8_verduras_oscuras', caption: 'La trampa', kb: -1},
  {from: 4714, dur: 130, img: 'bas8_esponja_empapada', caption: 'Potasio + oxalato', kb: 1},
  {from: 7188, dur: 130, img: 'bas8_oxalato_piedra', caption: 'Piedras en el riñón', kb: -1},
  {from: 8362, dur: 150, img: 'bas8_cristina_jugo', caption: 'Jugo de remolacha, en ayunas', kb: 1},
  {from: 9700, dur: 130, img: 'bas8_dr_repollo', caption: 'El repollo', kb: -1},
  {from: 10720, dur: 130, img: 'bas8_dr_pimiento', caption: 'El pimiento rojo', kb: 1},
  {from: 11880, dur: 130, img: 'bas8_dr_coliflor', caption: 'La coliflor', kb: -1},
  {from: 13010, dur: 130, img: 'bas8_dr_cebolla', caption: 'La cebolla', kb: 1},
  {from: 15233, dur: 160, img: 'bas8_espinaca_cruda', caption: 'Espinaca cruda: cuidado', kb: -1},
  {from: 16423, dur: 170, img: 'bas8_papa', caption: 'La papa: mucho potasio', kb: 1},
  {from: 18100, dur: 150, img: 'bas8_tomate_salsa', caption: 'El concentrado', kb: -1},
  {from: 20000, dur: 160, img: 'bas8_remolacha_jugo', caption: 'La del jugo detox', kb: 1},
  {from: 22648, dur: 150, img: 'bas8_dr_olla', caption: 'Hierva y tire el agua', kb: -1},
  {from: 24856, dur: 150, img: 'bas8_dr_repollo', caption: 'Coma con cabeza, no con miedo', kb: 1},
  {from: 26400, dur: 150, img: 'bas8_analisis_sangre', caption: 'El órgano más callado', kb: -1},
  {from: 32400, dur: 150, img: 'bas8_teresa_kitchen', caption: 'Teresa, tirando el agua', kb: 1},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 5164, dur: 150, node: <SideIllustration img="img/bas8_esponja_empapada.png" side="right" caption="Esponja empapada" dur={150} size={420} />},
  {from: 15233, dur: 150, node: <CautionChip text="Cruda y en jugo: potasio + oxalato" />},
  {from: 16423, dur: 150, node: <CautionChip text="En porción grande: mucho potasio" />},
  {from: 23697, dur: 150, node: <HandUnderline phrase="lo que es agua, se tira" note="se tira" />},
  {from: 27500, dur: 150, node: <CautionChip text="Etapa avanzada: cada gramo cuenta. Consulte" />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 6, name: 'carousel_whoosh'}, {at: 23, name: 'carousel_fanout'}, {at: 33, name: 'carousel_lock', vol: 0.5},
  {at: 1368, name: 'carousel_whoosh', vol: 0.5}, {at: 1384, name: 'note_sparkle', vol: 0.6},
  {at: 2105, name: 'fear_drone', vol: 0.6}, {at: 2265, name: 'fear_impact'}, {at: 2315, name: 'fear_shatter'},
  {at: 4135, name: 'note_sparkle', vol: 0.5},
  {at: 7742, name: 'note_sparkle', vol: 0.5},
  {at: 9408, name: 'carousel_whoosh', vol: 0.5}, {at: 10430, name: 'carousel_whoosh', vol: 0.5}, {at: 11587, name: 'carousel_whoosh', vol: 0.5}, {at: 12718, name: 'carousel_whoosh', vol: 0.5},
  {at: 14093, name: 'carousel_fanout', vol: 0.5},
  {at: 19331, name: 'carousel_fanout', vol: 0.5}, {at: 19361, name: 'carousel_lock', vol: 0.5},
  {at: 21470, name: 'note_sparkle', vol: 0.5},
  {at: 25571, name: 'note_sparkle', vol: 0.5},
  {at: 30666, name: 'note_sparkle', vol: 0.5},
  {at: 35380, name: 'carousel_fanout', vol: 0.5},
];

export const MainBastida8: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR — tramo1 real (CON su audio propio → lipsync exacto) */}
      <Sequence from={0} durationInFrames={AVATAR_END}>
        <OffthreadVideo src={staticFile('renal/avatar8.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Sequence>
      {/* AVATAR — tramo2 BUCLE de un tramo neutro (muteado; tapado por b-roll) */}
      <Sequence from={AVATAR_END} durationInFrames={TOTAL_FRAMES_8 - AVATAR_END}>
        <Loop durationInFrames={AVATAR_END - 3000}>
          <OffthreadVideo src={staticFile('renal/avatar8.mp4')} startFrom={3000} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Loop>
      </Sequence>

      {/* grade teal-navy sobre el avatar */}
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

      {/* B-ROLL fotos */}
      {BROLL.map((b, i) => (
        <Sequence key={`br${i}`} from={b.from} durationInFrames={b.dur}>
          <BRoll img={b.img} caption={b.caption} dur={b.dur} kb={b.kb ?? 1} />
        </Sequence>
      ))}

      {/* CLIPS agnes (movimiento) — se completa desde el manifiesto */}
      {CLIPS.map((c, i) => (
        <Sequence key={`cl${i}`} from={c.from} durationInFrames={c.dur}>
          <Clip clip={c.clip} dur={c.dur} caption={c.caption} kb={c.kb} />
        </Sequence>
      ))}

      {/* ESCENAS DE PROFUNDIDAD / COMPONENTES */}
      {DEPTH.map((d, i) => (
        <Sequence key={`dp${i}`} from={d.from} durationInFrames={d.dur}>
          <Whip dur={d.dur} flash={d.flash}>{d.node}</Whip>
        </Sequence>
      ))}

      {/* OVERLAYS sobre el avatar */}
      {OVERLAY.map((o, i) => (
        <Sequence key={`ov${i}`} from={o.from} durationInFrames={o.dur}>
          {o.node}
        </Sequence>
      ))}

      {/* COLA (voz Fish bastida8) — tramo2, desde COLA_START */}
      <Sequence from={COLA_START} durationInFrames={TOTAL_FRAMES_8 - COLA_START}>
        <Audio src={staticFile('renal/bastida8_cola.m4a')} />
      </Sequence>

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
