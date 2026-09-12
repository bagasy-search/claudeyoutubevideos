/**
 * Main_bastida7 — MONTAJE COMPLETO del video #2 (16:47), Dr. Bastida.
 * "Las 7 Bebidas que Mantienen tus Riñones Sanos y Fuertes Después de los 60"
 * Avatar <OffthreadVideo> persistente (public/renal/avatar_7beb.mp4) + grade teal-navy + marca propia,
 * componentes/b-roll anclados al ms de Whisper (public/captions_bastida_7bebidas.json). Data-driven.
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
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
import {ChapterAguaLimon} from './ChapterAguaLimon';
import {ChapterScene, CHAPTER_CONFIGS} from './ChapterScene';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {GuideCTAScene} from './GuideCTAScene';

export const TOTAL_FRAMES_7BEB = 30240;

// 7 bebidas — carrusel HERO (open loop en el hook)
const CARDS = [
  {name: 'Agua', img: 'img/bas_agua.png'},
  {name: 'Agua con limón', img: 'img/bas_agua_limon.png'},
  {name: 'Hibisco', img: 'img/bas_hibisco.png'},
  {name: 'Agua de cebada', img: 'img/bas_cebada.png'},
  {name: 'Jengibre', img: 'img/bas_jengibre.png'},
  {name: 'Té verde', img: 'img/bas_greentea.png'},
  {name: 'Arándano', img: 'img/bas_cranberry.png'},
];
const sfxf = (n: string) => staticFile(`renal/sfx/bas_sfx_${n}.mp3`);

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

const CautionChip: React.FC<{text?: string}> = ({text = 'Consulte a su médico'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 140}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 90}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: BAS.card, borderRadius: 999, padding: '14px 30px', borderLeft: `6px solid ${BAS.amber}`, boxShadow: '0 22px 46px rgba(0,0,0,0.45)', opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`}}>
        <span style={{fontSize: 30, color: BAS.amber}}>⚠</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: BAS.brand}}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---- H3Cut: cutaway de clip real (H3) full-bleed con grade navy + caption + audio nativo duckeado ---- */
const H3Cut: React.FC<{clip: string; dur: number; caption?: string; kb?: number}> = ({clip, dur, caption, kb = 1}) => {
  const f = useCurrentFrame();
  // push-in muy leve (el clip ya trae movimiento propio); corte limpio
  const scale = interpolate(f, [0, dur], [1.06, 1.12 + 0.02 * kb], {extrapolateRight: 'clamp'});
  const capP = interpolate(f, [6, 18, dur - 12, dur - 2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#05161f', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        <OffthreadVideo src={staticFile(clip)} volume={0.15} muted={false} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {/* grade navy de marca */}
      <AbsoluteFill style={{background: `linear-gradient(160deg, ${rgba(BAS.bgPanel, 0.28)}, ${rgba(BAS.bgDeep, 0.36)})`, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 46%, transparent 52%, ${rgba(BAS.bgEdge, 0.55)} 100%)`, pointerEvents: 'none'}} />
      {caption && (
        <div style={{position: 'absolute', left: 60, bottom: 70, opacity: capP, transform: `translateY(${interpolate(capP, [0, 1], [14, 0])}px)`}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: rgba('#05161f', 0.5), borderLeft: `4px solid ${BAS.aqua}`, padding: '10px 22px', borderRadius: 6}}>
            <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: '#F4F1E9', letterSpacing: 0.3}}>{caption}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ⚡ PRIMER MINUTO — cutaways H3 reales (corte denso, tajante). clip = broll/<slug>_<name>.mp4
const H1CLIPS: {from: number; dur: number; clip: string; caption?: string; kb?: number}[] = [
  {from: 277, dur: 95, clip: 'broll/bastida_7bebidas_h1_pour_water.mp4', caption: 'Su primera medicina', kb: 1},
  {from: 372, dur: 100, clip: 'broll/bastida_7bebidas_h1_pills_spill.mp4', caption: '…como una pastilla', kb: -1},
  {from: 472, dur: 88, clip: 'broll/bastida_7bebidas_h1_water_macro.mp4', kb: 1},
  {from: 560, dur: 140, clip: 'broll/bastida_7bebidas_h1_kidney_hold.mp4', caption: 'Un filtro que se puede ayudar', kb: -1},
  // 700-868 avatar full ("présteme atención, acá viene lo importante")
  {from: 868, dur: 97, clip: 'broll/bastida_7bebidas_h1_counter_drinks.mp4', caption: 'Comunes y baratas', kb: 1},
  {from: 965, dur: 95, clip: 'broll/bastida_7bebidas_h1_lemon_squeeze.mp4', kb: -1},
  {from: 1060, dur: 95, clip: 'broll/bastida_7bebidas_h1_ginger_slice.mp4', kb: 1},
  {from: 1155, dur: 125, clip: 'broll/bastida_7bebidas_h1_cola_pour.mp4', caption: 'La mayoría las toma mal', kb: -1},
  {from: 1280, dur: 80, clip: 'broll/bastida_7bebidas_h1_senior_mug.mp4', kb: 1},
  // 1360-1510 tease carousel (la número 7)
  {from: 1510, dur: 115, clip: 'broll/bastida_7bebidas_h1_cranberry_pour.mp4', caption: 'La número 7', kb: -1},
  {from: 1625, dur: 95, clip: 'broll/bastida_7bebidas_h1_sugar_spoon.mp4', caption: 'Pura azúcar', kb: 1},
  // 1720+ avatar ("pero vamos con orden") → PresenterIntro 1902
];

/* ============================ BEATS (frames de la transcripción) ============================ */
const DEPTH: {from: number; dur: number; node: React.ReactNode; flash?: boolean}[] = [
  // HOOK — carrusel de 7 con candado (open loop)
  {from: 0, dur: 262, node: <RenalCarousel cards={CARDS} reveals={[]} introDur={42} title="7 bebidas que sus riñones piden a gritos" kicker="Salud renal +60" />},
  // TEASE — "la número 7" (arándano, idx 6) pulsando
  {from: 1360, dur: 150, node: <RenalCarousel cards={CARDS} reveals={[]} teaseIndex={6} introDur={30} title="Una de estas siete…" />},
  // PRESENTACIÓN
  {from: 1902, dur: 150, node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Su médico de confianza" img="renal/bastida_cutout.png" />},
  // MIEDO → CALMA (diálisis)
  {from: 2600, dur: 320, node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={150} />},
  // ANALOGÍA — el filtro pide ayuda (la creatinina sube)
  {from: 4645, dur: 200, node: <CreatininaScene from={1.2} to={2.6} caption="Creatinina" subcaption="el filtro pide ayuda" />},
  // OPENERS — 7 bebidas (microescenas 2.5D)
  {from: 6985, dur: 95, node: <ChapterScene {...CHAPTER_CONFIGS.agua} number="1" unit="AGUA" subtitle="la reina, y la más simple" />},
  {from: 9806, dur: 95, node: <ChapterAguaLimon />},
  {from: 11324, dur: 95, node: <ChapterScene {...CHAPTER_CONFIGS.hibisco} number="3" />},
  {from: 13560, dur: 95, node: <ChapterScene {...CHAPTER_CONFIGS.cebada} number="4" />},
  {from: 16280, dur: 95, node: <ChapterScene {...CHAPTER_CONFIGS.jengibre} number="5" />},
  {from: 18469, dur: 95, node: <ChapterScene {...CHAPTER_CONFIGS.teverde} />},
  {from: 19850, dur: 100, node: <ChapterScene {...CHAPTER_CONFIGS.arandano} />},
  // CREATININA — el arco de alivio (rojo → verde)
  {from: 23360, dur: 230, node: <CreatininaScene from={2.5} to={1.2} caption="Creatinina" subcaption="del rojo, hacia el verde" />},
  // RITUAL — recap del carrusel (open loop cerrado, 7 desbloqueadas)
  {from: 24080, dur: 300, node: <RenalCarousel cards={CARDS} reveals={[8, 18, 28, 38, 48, 58, 68]} introDur={26} title="Su día, ordenado" kicker="Las 7, en su rutina" />},
  // SÍ / NO — lo que NO tomar
  {from: 26120, dur: 240, node: <FoodVerdictScene title="Lo que SÍ · lo que NO" good={[{img: 'img/ill/bas_ill_lemon_water.png', name: 'Agua + limón'}, {img: 'img/ill/bas_ill_hibiscus.png', name: 'Hibisco'}, {img: 'img/ill/bas_ill_ginger.png', name: 'Jengibre'}, {img: 'img/ill/bas_ill_barley.png', name: 'Cebada'}]} bad={[{img: 'img/ill/bas_ill_cola.png', name: 'Gaseosas cola'}, {img: 'img/ill/bas_ill_sugar.png', name: 'Azucaradas'}, {img: 'img/ill/bas_ill_coffee.png', name: 'Exceso de café'}, {img: 'img/ill/bas_ill_alcohol.png', name: 'Alcohol'}]} />},
  // SEÑALES DE ALERTA
  {from: 27500, dur: 320, node: <AlertSignalsScene signals={['Espuma abundante en la orina', 'Hinchazón en tobillos y párpados', 'Cansancio raro que no cede', 'Orinar varias veces de noche', 'Picazón en la piel sin causa']} footer="Si reconoce 2 o más, consulte a su médico" />},
];

const BROLL: {from: number; dur: number; img: string; caption?: string; kb?: number}[] = [
  {from: 2069, dur: 120, img: 'bas_broll_worried_senior', caption: 'Miles de pacientes', kb: -1},
  {from: 3681, dur: 130, img: 'bas_broll_kidney_anatomy', caption: 'Del tamaño de un puño', kb: 1},
  {from: 4339, dur: 130, img: 'bas_broll_filter', caption: 'Se va tapando', kb: -1},
  {from: 5164, dur: 150, img: 'bas_broll_worried_senior', caption: 'Don Ramón, 72', kb: 1},
  {from: 5820, dur: 120, img: 'bas_broll_cola', caption: 'Un litro de cola', kb: -1},
  {from: 6329, dur: 150, img: 'bas_broll_hands_report', caption: 'El número bajó', kb: 1},
  {from: 7280, dur: 130, img: 'bas_broll_glass_water_hero', caption: 'Agua pura', kb: -1},
  {from: 7786, dur: 150, img: 'bas_broll_urine_chart', caption: 'El semáforo del cuerpo', kb: 1},
  {from: 8677, dur: 150, img: 'bas_broll_water_pour', caption: 'La jarra a la vista', kb: -1},
  {from: 10156, dur: 150, img: 'bas_broll_lemon_squeeze', caption: 'El citrato', kb: 1},
  {from: 12060, dur: 150, img: 'bas_broll_hibiscus_flowers', caption: 'Antocianinas', kb: -1},
  {from: 12480, dur: 130, img: 'bas_broll_blood_pressure', caption: 'El enemigo: la presión', kb: 1},
  {from: 14090, dur: 150, img: 'bas_broll_barley_grains', caption: 'Agua de cebada', kb: -1},
  {from: 16820, dur: 150, img: 'bas_broll_ginger_root', caption: 'Los gingeroles', kb: 1},
  {from: 18600, dur: 150, img: 'bas_broll_greentea', caption: 'Catequinas', kb: -1},
  {from: 19050, dur: 120, img: 'bas_broll_blood_pressure', caption: 'Suave, no cargado', kb: 1},
  {from: 20130, dur: 150, img: 'bas_broll_cranberry', caption: 'Vías urinarias', kb: -1},
  {from: 21000, dur: 140, img: 'bas_broll_cola', caption: 'Cuidado: pura azúcar', kb: 1},
  {from: 22339, dur: 130, img: 'bas_broll_filter', caption: 'Destapar el filtro', kb: -1},
  {from: 26248, dur: 120, img: 'bas_broll_cola', caption: 'Gaseosas cola', kb: 1},
  {from: 27892, dur: 130, img: 'bas_broll_swollen_ankles', caption: 'Hinchazón', kb: -1},
  {from: 28004, dur: 130, img: 'bas_broll_tired_senior', caption: 'Cansancio', kb: 1},
  {from: 29060, dur: 150, img: 'bas_broll_hands_report', caption: 'A tiempo', kb: -1},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 3681, dur: 150, node: <SideIllustration img="img/ill/bas_ill_kidney.png" side="right" caption="El filtro" dur={150} size={420} />},
  {from: 8143, dur: 150, node: <SideIllustration img="img/ill/bas_ill_water_drop.png" side="left" caption="Empiece por el vaso" dur={150} size={400} />},
  {from: 12400, dur: 130, node: <CautionChip text="¿Toma pastillas para la presión? Consulte" />},
  {from: 14450, dur: 140, node: <CautionChip text="¿Potasio o creatinina alta? Consulte antes" />},
  {from: 18010, dur: 130, node: <CautionChip text="¿Toma anticoagulantes? Con medida" />},
  {from: 28816, dur: 120, node: <HandUnderline phrase="está a tiempo" note="a tiempo" />},
  {from: 29291, dur: 250, node: <GuideCTAScene title="La guía completa de las 7 bebidas" thumbs={['img/ill/bas_ill_lemon_water.png', 'img/ill/bas_ill_hibiscus.png', 'img/ill/bas_ill_barley.png', 'img/ill/bas_ill_ginger.png', 'img/ill/bas_ill_greentea.png', 'img/ill/bas_ill_cranberry.png', 'img/ill/bas_ill_water_drop.png']} />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 6, name: 'carousel_whoosh'}, {at: 23, name: 'carousel_fanout'}, {at: 33, name: 'carousel_lock', vol: 0.5},
  {at: 1366, name: 'note_sparkle', vol: 0.5},
  {at: 1902, name: 'carousel_whoosh', vol: 0.5}, {at: 1918, name: 'note_sparkle', vol: 0.6},
  {at: 2600, name: 'fear_drone', vol: 0.6}, {at: 2740, name: 'fear_impact'}, {at: 2790, name: 'fear_shatter'},
  {at: 4645, name: 'note_sparkle', vol: 0.5},
  {at: 6985, name: 'carousel_whoosh', vol: 0.5}, {at: 9806, name: 'carousel_whoosh', vol: 0.5}, {at: 11324, name: 'carousel_whoosh', vol: 0.5},
  {at: 13560, name: 'carousel_whoosh', vol: 0.5}, {at: 16280, name: 'carousel_whoosh', vol: 0.5}, {at: 18469, name: 'carousel_whoosh', vol: 0.5}, {at: 19850, name: 'carousel_whoosh', vol: 0.5},
  {at: 23360, name: 'note_sparkle', vol: 0.5}, {at: 24080, name: 'carousel_fanout', vol: 0.5},
  {at: 26120, name: 'carousel_fanout', vol: 0.5}, {at: 27500, name: 'fear_impact', vol: 0.4},
  {at: 28816, name: 'underline_draw', vol: 0.6},
];

export const MainBastida7: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      <OffthreadVideo src={staticFile('renal/avatar_7beb.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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

      {/* B-ROLL (cutaways) */}
      {BROLL.map((b, i) => (
        <Sequence key={`br${i}`} from={b.from} durationInFrames={b.dur}>
          <BRoll img={b.img} caption={b.caption} dur={b.dur} kb={b.kb ?? 1} />
        </Sequence>
      ))}

      {/* ⚡ PRIMER MINUTO — cutaways H3 reales (corte denso) */}
      {H1CLIPS.map((c, i) => (
        <Sequence key={`h1${i}`} from={c.from} durationInFrames={c.dur}>
          <H3Cut clip={c.clip} dur={c.dur} caption={c.caption} kb={c.kb} />
        </Sequence>
      ))}

      {/* ESCENAS DE PROFUNDIDAD / COMPONENTES */}
      {DEPTH.map((d, i) => (
        <Sequence key={`dp${i}`} from={d.from} durationInFrames={d.dur}>
          <Whip dur={d.dur} flash={d.flash}>{d.node}</Whip>
        </Sequence>
      ))}

      {/* OVERLAYS sobre el avatar (bg transparente) */}
      {OVERLAY.map((o, i) => (
        <Sequence key={`ov${i}`} from={o.from} durationInFrames={o.dur}>
          {o.node}
        </Sequence>
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
