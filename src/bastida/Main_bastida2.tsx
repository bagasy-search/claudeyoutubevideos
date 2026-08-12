/**
 * Main_bastida2 — MONTAJE del Video #2 "La mejor fruta antes de dormir" (arándanos).
 * Mismo motor que Main_bastida (avatar OffthreadVideo persistente + grade + marca + arrays data-driven),
 * avatar2 + beats ANCLADOS a la transcripción `avatar2.json`. Reusa TODO el kit + NightShift/Oxidation.
 * Render: --public-dir=public_bastida
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {FearToCalm, HandUnderline, PresenterIntro, BRoll, BClip, SideIllustration} from './BastidaFX';
import {ChapterScene, CHAPTER_CONFIGS} from './ChapterScene';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {GuideCTAScene} from './GuideCTAScene';
import {NightShiftScene, OxidationScene} from './VideoScenes2';

export const TOTAL_2 = 31270;
const sfxf = (n: string) => staticFile(`renal/sfx/bas_sfx_${n}.mp3`);

const Whip: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 5, dur - 7, dur - 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fl = interpolate(f, [0, 7], [0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: op}}>{children}<AbsoluteFill style={{background: rgba(BAS.aquaLite, fl), pointerEvents: 'none'}} /></AbsoluteFill>;
};
const CautionChip: React.FC<{text?: string}> = ({text = 'Consulte a su médico'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
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

const FRUIT_GOOD = [
  {img: 'img/ill/bas_ill_blueberries.png', name: 'Arándanos'},
  {img: 'img/ill/bas_ill_strawberry.png', name: 'Frutilla'},
  {img: 'img/ill/bas_ill_apple.png', name: 'Manzana'},
];
const FRUIT_BAD = [
  {img: 'img/ill/bas_ill_banana.png', name: 'Banana'},
  {img: 'img/ill/bas_ill_orange.png', name: 'Naranja'},
  {img: 'img/ill/bas_ill_dates.png', name: 'Dátiles'},
];

const DEPTH: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 1340, dur: 300, node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={80} />},
  {from: 1723, dur: 150, node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Su médico de confianza" img="renal/bastida_cutout.png" />},
  {from: 2166, dur: 320, node: <NightShiftScene />},
  {from: 6148, dur: 100, node: <ChapterScene {...CHAPTER_CONFIGS.arandanos} />},
  {from: 7980, dur: 340, node: <OxidationScene breakAt={200} />},
  {from: 20071, dur: 190, node: <CreatininaScene from={2.4} to={1.3} caption="Creatinina" subcaption="se estabilizó en 3 meses" />},
  {from: 22100, dur: 330, node: <FoodVerdictScene title="Frutas de noche: sí vs no" good={FRUIT_GOOD} bad={FRUIT_BAD} />},
  {from: 26123, dur: 240, node: <AlertSignalsScene />},
];

// clip → mp4 (stock fruta_* o H3 bas_*, movimiento real). img → foto quieta.
const BROLL: {from: number; dur: number; clip?: string; img?: string; caption?: string; kb?: number}[] = [
  // ── PRIMER MINUTO: cold open real + cortes densos ──
  {from: 8, dur: 150, clip: 'fruta_handful_berries', caption: 'Una sola fruta'},           // "Hay una fruta, una sola fruta…"
  {from: 200, dur: 120, clip: 'fruta_sleeping_senior', caption: 'Mientras usted duerme'},  // "trabaja mientras usted duerme"
  {from: 340, dur: 120, clip: 'fruta_blueberries_night'},                                    // "limpiando sus filtros"
  {from: 500, dur: 120, clip: 'fruta_apple_browning', caption: 'No todas ayudan'},          // "no todas las frutas son amigas"
  {from: 860, dur: 110, clip: 'fruta_night_sky', caption: 'La noche es la clave'},          // "la noche es el momento clave"
  {from: 1000, dur: 105, clip: 'bas_labreport', caption: 'Creatinina alta'},                // "creatinina alta"
  {from: 1115, dur: 115, clip: 'bas_worried_senior', caption: 'Miles de pacientes'},        // "miles de pacientes"
  // ── CUERPO (en huecos entre escenas DEPTH) ──
  {from: 2520, dur: 150, clip: 'fruta_bedroom_moonlight', caption: 'Modo reparación'},      // "de noche, modo reparación"
  {from: 2900, dur: 130, clip: 'fruta_blueberries_night'},                                  // "lo que le da antes de dormir"
  {from: 3480, dur: 120, clip: 'bas_blood_pressure', caption: 'La presión, el azúcar'},     // "presión, azúcar, sal, medicamentos"
  {from: 3760, dur: 120, clip: 'fruta_sugar_spoon'},
  {from: 3900, dur: 130, clip: 'bas_pill_bottle_decline', caption: 'Los medicamentos'},
  {from: 4250, dur: 140, clip: 'bas_filter_clog', caption: 'El colador se tapa'},           // "colador finísimo"
  {from: 4680, dur: 140, img: 'bas_broll_kidney_anatomy', caption: 'Millones de agujeritos', kb: 1},
  {from: 5150, dur: 130, clip: 'fruta_apple_browning', caption: '¿Destapa o tapa?'},        // "algo que destape o tape"
  {from: 5560, dur: 130, clip: 'fruta_sugar_spoon', caption: 'Muy dulce = azúcar'},         // "fruta muy dulce dispara azúcar"
  {from: 6300, dur: 150, clip: 'fruta_handful_berries', caption: 'Arándanos'},            // "arándanos, frutos azul oscuro"
  {from: 7000, dur: 140, clip: 'fruta_blueberries_night', caption: 'Antocianinas'},          // "antocianinas, color azul"
  {from: 7420, dur: 140, clip: 'fruta_rust_metal', caption: 'Óxido interno'},               // "óxido interno, metal con el tiempo"
  {from: 8400, dur: 150, clip: 'fruta_lemon_squeeze_food', caption: 'Como limón en la palta'}, // "gotas de limón en la palta"
  {from: 9200, dur: 130, clip: 'fruta_handful_berries'},                                    // "el óxido avanza más despacio"
  {from: 9820, dur: 130, clip: 'fruta_handful_berries', caption: 'Bajo en potasio'},        // "poco en potasio"
  {from: 10200, dur: 150, img: 'bas_broll_kidney_anatomy', caption: 'Los riñones filtran', kb: -1},
  {from: 11150, dur: 150, clip: 'fruta_blueberries_night', caption: 'La mejor fruta de la noche'}, // "mejor fruta de la noche"
  {from: 12000, dur: 140, clip: 'fruta_handful_berries'},
  {from: 12720, dur: 130, clip: 'bas_pill_bottle_decline', caption: 'Gana al frasco'},      // "gana al frasco"
  {from: 13300, dur: 130, clip: 'fruta_handful_berries', caption: 'Cuesta monedas'},
  {from: 13850, dur: 140, clip: 'fruta_water_pour_glass', caption: 'Vías urinarias limpias'}, // "vías urinarias limpias"
  {from: 14700, dur: 140, clip: 'fruta_handful_berries', caption: 'Un puñado chico'},        // "puñado chico alcanza"
  {from: 15020, dur: 140, clip: 'fruta_frozen_berries', caption: 'Frescos o congelados'},    // "freezer, sin azúcar"
  {from: 15850, dur: 150, clip: 'fruta_frozen_berries', caption: 'Un postre helado'},        // "congelados son un postre"
  {from: 16250, dur: 140, clip: 'fruta_yogurt_berries', caption: 'Con yogur natural'},
  {from: 16650, dur: 150, clip: 'fruta_water_pour_glass', caption: 'Orina clara = hidratado'}, // "hidratado, orina clara"
  {from: 18500, dur: 140, clip: 'bas_worried_senior', caption: 'Don Aníbal, 74'},            // "atendía un señor, don Aníbal"
  {from: 18720, dur: 140, clip: 'bas_hands_report_carmen'},
  {from: 19000, dur: 150, clip: 'fruta_old_man_kitchen_night', caption: 'En vez del alfajor'}, // "un puñadito en vez del alfajor"
  {from: 19900, dur: 130, clip: 'fruta_blueberries_night'},                                   // "tres meses después"
  {from: 20900, dur: 150, clip: 'fruta_handful_berries', caption: 'Todas las noches'},        // "su puñadito, todas las noches"
  {from: 21550, dur: 140, clip: 'fruta_fruit_market'},
  // ── TERCIO FINAL (variedad inmersiva, sin caption) ──
  {from: 22600, dur: 140, clip: 'fruta_handful_berries'},
  {from: 23200, dur: 150, clip: 'fruta_yogurt_berries'},
  {from: 24000, dur: 150, clip: 'fruta_night_sky'},
  {from: 25000, dur: 150, clip: 'fruta_handful_berries'},
  {from: 27000, dur: 150, clip: 'fruta_blueberries_night'},
  {from: 28500, dur: 150, clip: 'fruta_fruit_market'},
  {from: 29200, dur: 150, clip: 'fruta_frozen_berries'},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 680, dur: 140, node: <SideIllustration img="img/ill/bas_ill_banana.png" side="left" caption="No todas ayudan" dur={140} size={380} />},
  {from: 3300, dur: 150, node: <SideIllustration img="img/ill/bas_ill_kidney.png" side="right" caption="El filtro +60" dur={150} size={420} />},
  {from: 6820, dur: 150, node: <SideIllustration img="img/ill/bas_ill_blueberries.png" side="right" caption="Antioxidantes" dur={150} size={400} />},
  {from: 9600, dur: 150, node: <SideIllustration img="img/ill/bas_ill_banana.png" side="left" caption="Mucho potasio" dur={150} size={380} />},
  {from: 12500, dur: 150, node: <SideIllustration img="img/ill/bas_ill_pills.png" side="left" caption="No es una pastilla" dur={150} size={380} />},
  {from: 15650, dur: 150, node: <SideIllustration img="img/ill/bas_ill_yogurt.png" side="right" caption="Con yogur natural" dur={150} size={400} />},
  {from: 17400, dur: 170, node: <CautionChip text="¿Enfermedad renal avanzada? Consulte" />},
  {from: 18163, dur: 110, node: <HandUnderline phrase="todavía está a tiempo" note="a tiempo!" />},
  {from: 24560, dur: 180, node: <SideIllustration img="img/ill/bas_ill_moon.png" side="right" caption="Cena liviana · poca sal · agua" dur={180} size={360} />},
  {from: 29948, dur: 260, node: <GuideCTAScene kicker="Gratis · en la descripción" title="La guía completa de los arándanos" subtitle="Cuántos · a qué hora · frescos o congelados" thumbs={['img/ill/bas_ill_blueberries.png', 'img/ill/bas_ill_yogurt.png', 'img/ill/bas_ill_moon.png']} />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 1340, name: 'fear_drone', vol: 0.6}, {at: 1394, name: 'fear_impact'}, {at: 1420, name: 'fear_shatter'},
  {at: 1723, name: 'carousel_whoosh', vol: 0.5}, {at: 1739, name: 'note_sparkle', vol: 0.6},
  {at: 2166, name: 'carousel_whoosh', vol: 0.4},
  {at: 6148, name: 'carousel_whoosh', vol: 0.5}, {at: 6170, name: 'note_sparkle', vol: 0.5},
  {at: 7980, name: 'carousel_whoosh', vol: 0.4},
  {at: 20071, name: 'note_sparkle', vol: 0.5},
  {at: 22100, name: 'carousel_fanout', vol: 0.5},
  {at: 26123, name: 'fear_impact', vol: 0.4},
  {at: 680, name: 'carousel_whoosh', vol: 0.3}, {at: 3300, name: 'carousel_whoosh', vol: 0.3},
  {at: 6820, name: 'carousel_whoosh', vol: 0.3}, {at: 15650, name: 'carousel_whoosh', vol: 0.3},
  {at: 18227, name: 'underline_draw', vol: 0.6},
];

export const MainBastida2: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      <OffthreadVideo src={staticFile('renal/avatar2.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: `linear-gradient(160deg, ${rgba(BAS.bgPanel, 0.42)}, ${rgba(BAS.bgDeep, 0.5)})`, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 44%, transparent 55%, ${rgba(BAS.bgEdge, 0.5)} 100%)`, pointerEvents: 'none'}} />
      {/* marca Bastida (tapa watermark del avatar) */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div style={{position: 'absolute', top: 0, right: 0, width: 680, height: 300, background: `radial-gradient(130% 130% at 100% 0%, ${rgba('#05161f', 0.99)} 46%, ${rgba('#05161f', 0.85)} 62%, transparent 84%)`}} />
        <div style={{position: 'absolute', top: 34, right: 44, textAlign: 'right'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: '#F4F1E9', lineHeight: 1}}>Dr. Bastida</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 17, fontWeight: 700, letterSpacing: 3, color: BAS.aqua, marginTop: 4}}>SALUD RENAL</div>
        </div>
        <div style={{position: 'absolute', bottom: 0, right: 0, width: 220, height: 200, background: `radial-gradient(120% 120% at 100% 100%, ${rgba('#05161f', 0.95)} 28%, transparent 70%)`}} />
        <div style={{position: 'absolute', bottom: 40, right: 46, width: 56, height: 56, borderRadius: '50%', border: `2px solid ${rgba(BAS.aqua, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: BAS.aquaLite}}>B</div>
      </AbsoluteFill>

      {BROLL.map((b, i) => (
        <Sequence key={`br${i}`} from={b.from} durationInFrames={b.dur}>
          {b.clip ? (
            <BClip clip={b.clip} caption={b.caption} dur={b.dur} vol={0} />
          ) : (
            <BRoll img={b.img} caption={b.caption} dur={b.dur} kb={b.kb ?? 1} />
          )}
        </Sequence>
      ))}
      {DEPTH.map((d, i) => (
        <Sequence key={`dp${i}`} from={d.from} durationInFrames={d.dur}><Whip dur={d.dur}>{d.node}</Whip></Sequence>
      ))}
      {OVERLAY.map((o, i) => (
        <Sequence key={`ov${i}`} from={o.from} durationInFrames={o.dur}>{o.node}</Sequence>
      ))}
      <Audio src={staticFile('renal/music/bas_music_quiet_pulse_bed_a.mp3')} volume={0.12} loop />
      {SFX.map((s, i) => (
        <Sequence key={`sf${i}`} from={s.at} durationInFrames={90}><Audio src={sfxf(s.name)} volume={s.vol ?? 0.7} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
