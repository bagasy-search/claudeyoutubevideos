/**
 * Main_bastida — MONTAJE COMPLETO del video #1 (16:45), Dr. Bastida.
 * Avatar <OffthreadVideo> persistente (audio continuo) + grade teal-navy + marca propia,
 * y ENCIMA escenas de profundidad / componentes + b-roll en su Sequence al frame anclado
 * (transcripción Whisper: public/renal/avatar_full.json). Data-driven (arrays DEPTH/BROLL/SFX).
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
import {BenefitScene} from './BenefitScene';
import {FearToCalm, HandUnderline, PresenterIntro, BRoll, BClip, SideIllustration} from './BastidaFX';
import {ChapterAguaLimon} from './ChapterAguaLimon';
import {ChapterScene, CHAPTER_CONFIGS} from './ChapterScene';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {GuideCTAScene} from './GuideCTAScene';

export const TOTAL_MIN1 = 30160;

const CARDS = [
  {name: 'Agua con limón', img: 'img/bas_agua_limon.png'},
  {name: 'Agua de cebada', img: 'img/bas_cebada.png'},
  {name: 'Jengibre', img: 'img/bas_jengibre.png'},
  {name: 'Hibisco', img: 'img/bas_hibisco.png'},
  {name: 'Agua', img: 'img/bas_agua.png'},
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

/* ---- mini componentes ---- */
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
const GuideCTA: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 140}});
  const arrow = 6 + Math.sin(f / fps * Math.PI * 2) * 6;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70}}>
      <div style={{textAlign: 'center', opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`}}>
        <div style={{background: BAS.card, borderRadius: 20, padding: '20px 40px', boxShadow: '0 26px 54px rgba(0,0,0,0.5)', borderTop: `5px solid ${BAS.aqua}`}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 700, color: BAS.brand}}>La guía completa está en la descripción</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 26, color: BAS.ink2, marginTop: 4}}>Las 5 bebidas · cantidades exactas · gratis</div>
        </div>
        <div style={{fontSize: 60, color: BAS.aqua, transform: `translateY(${arrow}px)`, marginTop: 8}}>▾</div>
      </div>
    </AbsoluteFill>
  );
};

/* ============================ BEATS (frames de la transcripción) ============================ */
const DEPTH: {from: number; dur: number; node: React.ReactNode; flash?: boolean}[] = [
  // --- MINUTO 1 ---
  {from: 156, dur: 150, node: <RenalCarousel cards={CARDS} reveals={[]} introDur={30} title="5 bebidas que sus riñones necesitan" />},
  {from: 560, dur: 125, node: <RenalCarousel cards={CARDS} reveals={[]} teaseIndex={2} introDur={30} title="Una de estas cinco…" />},
  {from: 690, dur: 68, node: <BenefitScene variant="farmacia" />},
  {from: 758, dur: 66, node: <BenefitScene variant="fortuna" />},
  {from: 1246, dur: 274, node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={203} />},
  {from: 1785, dur: 150, node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Su médico de confianza" img="renal/bastida_cutout.png" />},
  // --- ANALOGÍA DEL FILTRO ---
  {from: 3155, dur: 200, node: <CreatininaScene from={1.2} to={2.6} caption="Creatinina" subcaption="el filtro pide ayuda" />},
  // --- DOÑA CARMEN: la creatinina se estabiliza ---
  {from: 7142, dur: 190, node: <CreatininaScene from={2.4} to={1.3} caption="Creatinina" subcaption="se estabilizó en 3 meses" />},
  // --- BEBIDAS: openers = microescenas 2.5D dirigidas (nuevo estándar) ---
  {from: 8095, dur: 95, node: <ChapterAguaLimon />},
  {from: 10181, dur: 95, node: <ChapterScene {...CHAPTER_CONFIGS.cebada} />},
  {from: 12023, dur: 95, node: <ChapterScene {...CHAPTER_CONFIGS.jengibre} />},
  {from: 14092, dur: 95, node: <ChapterScene {...CHAPTER_CONFIGS.hibisco} />},
  {from: 17761, dur: 100, node: <ChapterScene {...CHAPTER_CONFIGS.agua} />},
  // --- SEÑALES DE ALERTA ---
  {from: 22455, dur: 210, node: <AlertSignalsScene />},
  // --- SÍ vs NO (recap) ---
  {from: 24720, dur: 220, node: <FoodVerdictScene />},
];

// clip → clip H3 (mp4 en public/broll/, movimiento real). img → foto quieta (BRoll Ken-Burns).
const BROLL: {from: number; dur: number; clip?: string; img?: string; caption?: string; kb?: number}[] = [
  // ── PRIMER MINUTO: cold open real + cortes densos ──
  {from: 6, dur: 150, clip: 'bas_kitchen_5drinks_pan', caption: '5 bebidas comunes'},   // "cinco bebidas que tiene en la cocina"
  {from: 300, dur: 120, clip: 'bas_hand_lemon_water', caption: 'Casi nadie las toma bien'}, // "las toma mal"
  {from: 470, dur: 82, img: 'bas_broll_glass_water_hero', kb: 1},                         // "una de estas cinco…" (foto: clip preemptado por spot)
  {from: 900, dur: 105, clip: 'bas_labreport', caption: 'Creatinina alta'},              // "creatinina alta"
  {from: 1010, dur: 96, clip: 'bas_worried_senior', caption: 'Miles de pacientes'},      // "en la cara de miles de pacientes"
  // ── RESTO: fotos → clips reales ──
  {from: 2100, dur: 120, img: 'bas_broll_kidney_anatomy', caption: 'Dos filtros', kb: 1},         // diagrama → foto
  {from: 2690, dur: 130, clip: 'bas_filter_clog', caption: 'Se va tapando'},
  {from: 4160, dur: 110, clip: 'bas_blood_pressure', caption: 'La presión, el azúcar…'},
  {from: 5540, dur: 150, clip: 'bas_hands_report_carmen', caption: 'Doña Carmen, 72'},
  {from: 5960, dur: 120, clip: 'bas_dialysis_machine', caption: 'Diálisis'},
  {from: 8540, dur: 150, clip: 'bas_lemon_squeeze', caption: 'Citrato'},
  {from: 10340, dur: 150, img: 'bas_broll_barley_grains', caption: 'Agua de cebada', kb: 1},
  {from: 12320, dur: 150, clip: 'bas_ginger_root', caption: 'Antiinflamatorio'},
  {from: 14540, dur: 140, clip: 'bas_blood_pressure', caption: 'El enemigo: la presión'},
  {from: 15400, dur: 150, clip: 'bas_hibiscus_tea', caption: 'Hibisco'},
  {from: 18140, dur: 150, img: 'bas_broll_glass_water_hero', caption: 'Agua', kb: -1},
  {from: 19850, dur: 160, img: 'bas_broll_urine_chart', caption: 'El semáforo del cuerpo', kb: -1}, // gráfico → foto
  {from: 23060, dur: 150, clip: 'bas_swollen_ankles', caption: 'Hinchazón'},
  {from: 23510, dur: 150, clip: 'bas_tired_senior', caption: 'Cansancio'},
  {from: 25040, dur: 120, img: 'bas_broll_cola', caption: 'Refrescos de cola', kb: 1},
  {from: 25450, dur: 130, img: 'bas_broll_coffee_excess', caption: 'Exceso de café', kb: -1},
  {from: 28690, dur: 150, clip: 'bas_hands_report_carmen', caption: 'Doña Carmen'},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 1600, dur: 110, node: <HandUnderline phrase="todavía está a tiempo" note="a tiempo!" />},
  // SideIllustrations: ilustración PNG flotando al costado del avatar cuando menciona algo
  {from: 3420, dur: 150, node: <SideIllustration img="img/ill/bas_ill_kidney.png" side="right" caption="El filtro" dur={150} size={420} />},
  {from: 4360, dur: 130, node: <SideIllustration img="img/ill/bas_ill_pills.png" side="left" caption="Los medicamentos" dur={130} size={380} />},
  {from: 26380, dur: 150, node: <SideIllustration img="img/ill/bas_ill_water_drop.png" side="right" caption="Empiece por el vaso" dur={150} size={400} />},
  {from: 9783, dur: 120, node: <CautionChip text="Reflujo o anticoagulantes: consulte antes" />},
  {from: 21440, dur: 150, node: <CautionChip text="¿Diálisis o límite de líquido? Respételo" />},
  {from: 29075, dur: 240, node: <GuideCTAScene title="La guía completa de las 5 bebidas" thumbs={['img/ill/bas_ill_lemon_water.png', 'img/ill/bas_ill_barley.png', 'img/ill/bas_ill_ginger.png', 'img/ill/bas_ill_hibiscus.png', 'img/ill/bas_ill_water_drop.png']} />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 6, name: 'carousel_whoosh', vol: 0.4}, {at: 300, name: 'carousel_whoosh', vol: 0.35}, {at: 470, name: 'carousel_whoosh', vol: 0.3},
  {at: 156, name: 'carousel_whoosh'}, {at: 173, name: 'carousel_fanout'}, {at: 183, name: 'carousel_lock', vol: 0.5},
  {at: 566, name: 'note_sparkle', vol: 0.5},
  {at: 690, name: 'chip_pop'}, {at: 720, name: 'chip_strike'}, {at: 758, name: 'chip_pop'}, {at: 788, name: 'chip_strike'},
  {at: 892, name: 'carousel_whoosh', vol: 0.35}, {at: 1006, name: 'carousel_whoosh', vol: 0.35},
  {at: 1246, name: 'fear_drone', vol: 0.6}, {at: 1395, name: 'fear_impact'}, {at: 1449, name: 'fear_shatter'},
  {at: 1614, name: 'underline_draw', vol: 0.6}, {at: 1785, name: 'carousel_whoosh', vol: 0.5}, {at: 1801, name: 'note_sparkle', vol: 0.6},
  {at: 3155, name: 'note_sparkle', vol: 0.5}, {at: 7142, name: 'note_sparkle', vol: 0.5},
  {at: 8095, name: 'carousel_whoosh', vol: 0.5}, {at: 10181, name: 'carousel_whoosh', vol: 0.5}, {at: 12023, name: 'carousel_whoosh', vol: 0.5},
  {at: 14092, name: 'carousel_whoosh', vol: 0.5}, {at: 17761, name: 'carousel_whoosh', vol: 0.5},
  {at: 22455, name: 'fear_impact', vol: 0.4}, {at: 24720, name: 'carousel_fanout', vol: 0.5},
];

export const MainBastida: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      <OffthreadVideo src={staticFile('renal/avatar.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
          {b.clip ? (
            <BClip clip={b.clip} caption={b.caption} dur={b.dur} />
          ) : (
            <BRoll img={b.img} caption={b.caption} dur={b.dur} kb={b.kb ?? 1} />
          )}
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
