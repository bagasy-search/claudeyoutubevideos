/**
 * Main_baspescados — "5 Pescados para Proteger los Riñones y Bajar la Creatinina" (Dr. Bastida).
 *
 * AVATAR PARCIAL: el creador grabó 7:39 (459.07s → hook + mecanismo + omega + sardina/salmón + media caballa).
 * UN SOLO master de audio: public/baspescados.wav = audio del avatar (tramo 1, lipsync real) + 0.35s + cola
 * locutada con Fish (voz clonada del propio avatar). El avatar va en BUCLE y MUDO (baspescados_avatarloop.mp4,
 * 971s): su primer play (0-459s) ES el avatar real, después loopea. Anclado al ms con captions_baspescados.json.
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, BRoll} from './BastidaFX';
import {BRollCard} from './BRollCard';
import {RenalLowerThird} from './BastidaKit';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {TestimonialScene} from './TestimonialScene';
import {RenalItemCard} from './RenalItemCard';
import {MatchWhip, WhipDir} from './MatchWhip';
import {FilterMechanismScene} from './scenes7/FilterMechanismScene';
import {RuleScene} from './scenes7/RuleScene';

export const TOTAL_BP = 29136;
const AVATAR_LOOP = 'baspescados_opt.mp4';

/* ---------------- datos: los 5 pescados ---------------- */
const FISH_CARDS = [
  {name: 'Sardina', img: 'img/bp_sardinas_frescas_hielo.jpg', tint: '#34C6E0'},
  {name: 'Salmón', img: 'img/bp_salmon_filete_fresco.jpg', tint: '#34C6E0'},
  {name: 'Caballa', img: 'img/bp_caballa_fresca_entera.jpg', tint: '#34C6E0'},
  {name: 'Trucha', img: 'img/bp_trucha_fresca.jpg', tint: '#34C6E0'},
  {name: 'Anchoa', img: 'img/bp_boquerones_frescos.jpg', tint: '#34C6E0'},
];
const GOOD_V = [
  {img: 'img/bp_sardinas_horno_limon.jpg', name: 'Sardina al horno'},
  {img: 'img/bp_salmon_horno_hierbas.jpg', name: 'Salmón al horno'},
  {img: 'img/bp_boquerones_frescos.jpg', name: 'Boquerón fresco'},
  {img: 'img/bp_caballa_parrilla.jpg', name: 'Caballa a la parrilla'},
];
const BAD_V = [
  {img: 'img/bp_salmon_ahumado_paquete.jpg', name: 'Salmón ahumado'},
  {img: 'img/bp_anchoa_salazon_frasco.jpg', name: 'Anchoa en salazón'},
  {img: 'img/bp_pescado_frito_no.jpg', name: 'Pescado frito'},
  {img: 'img/bp_sardinas_lata_abierta.jpg', name: 'Lata en salmuera'},
];

const sfxf = (n: string) => staticFile(`sfx/${n}`);

/* ---------------- CLIP (b-roll animado con agnes / stock, pantalla completa, mudo) ---------------- */
const Clip: React.FC<{name: string; dur: number; kb?: number}> = ({name, dur, kb = 1}) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, dur], [1.04, 1.10 + kb * 0.02]);
  return (
    <AbsoluteFill style={{background: '#05161f', overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(`broll/${name}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 44%, transparent 55%, ${rgba(BAS.bgEdge, 0.5)} 100%)`, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

/* ---------------- overlays chicos ---------------- */
const KeyWord: React.FC<{word: string; sub?: string; color?: string}> = ({word, sub, color = BAS.aqua}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 120, mass: 0.8}});
  const glow = 0.4 + Math.sin((f / fps) * Math.PI * 2) * 0.3;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 130}}>
      <div style={{textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.82, 1])})`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 108, fontWeight: 800, letterSpacing: 2, color, textShadow: `0 0 ${28 + glow * 36}px ${rgba(color, 0.6)}, 0 8px 30px rgba(0,0,0,0.7)`}}>{word}</div>
        {sub && <div style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, color: '#EAF2F4', marginTop: 4, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>{sub}</div>}
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
// escenas HERO de profundidad (avatar oculto)
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  {from: 943, dur: 320, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={120} />},
  {from: 2609, dur: 470, dir: 'left', node: <FilterMechanismScene />},
  {from: 4973, dur: 600, dir: 'left', node: <TestimonialScene img="img/bp_manos_mayor_preocupado.jpg" name="Don Alberto" place="72 años" quote={'"Se había puesto a comer casi nada, muerto de miedo. Le cambié la carne roja por pescado… y recuperó las fuerzas."'} tag="Un solo cambio" />},
  {from: 6012, dur: 260, dir: 'in', node: <CreatininaScene from={1.7} to={1.3} caption="Creatinina" subcaption="aflojó en el control siguiente" />},
  {from: 6847, dur: 430, dir: 'in', node: <RuleScene kicker="El omega-3" question="¿Qué hace esa grasa buena?" answer="Apaga la inflamación del filtro" note="Y cuida la presión, la peor enemiga del riñón" img="img/bp_omega_capsulas.jpg" imgSide="right" accent={BAS.aqua} />},
  {from: 7613, dur: 470, dir: 'in', node: <RenalCarousel cards={FISH_CARDS} reveals={[24, 66, 108, 150, 192]} introDur={44} kicker="En su pescadería" title="5 que protegen" />},
  // OPENERS 2.5D por pescado (tarjeta de vidrio flotante con foto + número acrílico + profundidad)
  {from: 8172, dur: 100, dir: 'in', node: <RenalItemCard n="1" name="Sardina" note="Omega-3 barato, casi sin mercurio" img="img/bp_sardinas_frescas_hielo.jpg" accent={BAS.si} side="right" />},
  {from: 10478, dur: 100, dir: 'in', node: <RenalItemCard n="2" name="Salmón" note="Omega-3 y vitamina D" img="img/bp_salmon_filete_fresco.jpg" accent={BAS.si} side="left" />},
  {from: 12562, dur: 100, dir: 'in', node: <RenalItemCard n="3" name="Caballa" note="Rendidor, protege corazón y riñón" img="img/bp_caballa_fresca_entera.jpg" accent={BAS.si} side="right" />},
  {from: 15110, dur: 100, dir: 'in', node: <RenalItemCard n="4" name="Trucha y blancos" note="Livianos en fósforo" img="img/bp_trucha_fresca.jpg" accent={BAS.si} side="left" />},
  {from: 17087, dur: 100, dir: 'in', node: <RenalItemCard n="5" name="Anchoa fresca" note="El más poderoso, y el más barato" img="img/bp_boquerones_frescos.jpg" accent={BAS.si} side="right" />},
  {from: 15666, dur: 400, dir: 'left', node: <RuleScene kicker="Fósforo y potasio" question="¿Y si el riñón está más avanzado?" answer="Los pescados blancos pesan menos" note="Merluza y bacalao: proteína con menos fósforo" img="img/bp_merluza_filetes.jpg" imgSide="left" accent={BAS.amber} />},
  {from: 18700, dur: 480, dir: 'up', node: <FoodVerdictScene title="El mismo pescado: SÍ / NO" good={GOOD_V} bad={BAD_V} />},
  {from: 21107, dur: 380, dir: 'in', node: <RuleScene kicker="Regla 1 · La sal" question="¿El enemigo número uno?" answer="La sal esconde en ahumados y latas" note="Cocine con limón, ajo, perejil y hierbas" img="img/bp_hierbas_limon_ajo.jpg" imgSide="right" accent={BAS.no} />},
  {from: 21990, dur: 380, dir: 'right', node: <RuleScene kicker="Regla 2 · Nada de frito" question="¿Por qué no freírlo?" answer="El aceite recalentado mata el omega-3" note="Al horno, plancha, vapor o parrilla" img="img/bp_pescado_frito_no.jpg" imgSide="left" accent={BAS.amber} />},
  {from: 22924, dur: 380, dir: 'left', node: <RuleScene kicker="Regla 3 · La porción" question="¿Cuánto es suficiente?" answer="Dos o tres veces por semana" note="Del tamaño de la palma de su mano" img="img/bp_porciones_semana.jpg" imgSide="right" accent={BAS.aqua} />},
  {from: 25950, dur: 540, dir: 'up', node: <AlertSignalsScene title="¿Sus riñones piden ayuda?" signals={['Se levanta más veces a la noche a orinar', 'Tobillos o pies hinchados al final del día', 'Cansancio que no se arregla durmiendo', 'Picazón en la piel o la orina espumosa']} footer="Si reconoce 2 o más, pídale a su médico un análisis de sangre y orina" />},
];

// clips animados con agnes (pantalla completa, avatar oculto) + stock 30fps CFR
const CLIPS: {from: number; dur: number; name: string; kb?: number}[] = [
  {from: 340, dur: 148, name: 'bpstock_fish_market_ice'},
  {from: 1780, dur: 150, name: 'bp_heladera_pescado'},
  {from: 3130, dur: 150, name: 'bp_colador_cocina'},
  {from: 4130, dur: 150, name: 'bp_carne_roja_plato'},
  {from: 5750, dur: 150, name: 'bp_pescado_horno_bandeja'},
  {from: 6320, dur: 148, name: 'bpstock_elderly_kitchen'},
  {from: 7300, dur: 148, name: 'bp_presion_tensiometro'},
  {from: 8290, dur: 150, name: 'bp_sardinas_frescas_hielo'},
  {from: 9485, dur: 150, name: 'bp_sardinas_lata_abierta'},
  {from: 10039, dur: 150, name: 'bp_sardinas_enjuague_canilla'},
  {from: 10600, dur: 150, name: 'bp_salmon_filete_fresco'},
  {from: 11150, dur: 148, name: 'bp_sol_vitamina_d'},
  {from: 11640, dur: 150, name: 'bp_salmon_ahumado_paquete'},
  {from: 12852, dur: 150, name: 'bp_caballa_fresca_entera'},
  {from: 13782, dur: 150, name: 'bp_caballa_parrilla'},
  {from: 13948, dur: 150, name: 'bp_pescaderia_ojos_agallas'},
  {from: 14650, dur: 148, name: 'bpstock_ocean_boat'},
  {from: 15230, dur: 150, name: 'bp_trucha_fresca'},
  {from: 16100, dur: 150, name: 'bp_bacalao_fresco'},
  {from: 16886, dur: 150, name: 'bp_pescado_sopa_liviana'},
  {from: 17291, dur: 150, name: 'bp_boquerones_frescos'},
  {from: 18150, dur: 150, name: 'bp_boquerones_plancha'},
  {from: 18390, dur: 150, name: 'bp_anchoa_salazon_frasco'},
  {from: 19650, dur: 150, name: 'bp_pescado_horno_bandeja'},
  {from: 21520, dur: 148, name: 'bpstock_lemon_herbs'},
  {from: 22400, dur: 150, name: 'bp_pescado_frito_no'},
  {from: 23350, dur: 150, name: 'bp_porciones_semana'},
  {from: 24450, dur: 148, name: 'bpstock_lab_blood'},
  {from: 25320, dur: 128, name: 'bp_bano_noche'},
  {from: 25580, dur: 130, name: 'bp_cansancio_sillon'},
  {from: 28941, dur: 150, name: 'bp_bebidas_creatinina_teaser'},
];

// fotos b-roll: `card` = tarjeta de vidrio flotante 2.5D (objetos) · sin card = full-bleed (planos del doctor)
const BROLL: {from: number; dur: number; img: string; caption?: string; kb?: number; card?: boolean; side?: 'left' | 'right'; accent?: string}[] = [
  {from: 560, dur: 168, img: 'bp_analisis_creatinina.jpg', caption: 'Esa palabra: creatinina', card: true, side: 'right', accent: BAS.amber},
  {from: 1300, dur: 160, img: 'bp_doc_tranquilo.jpg', caption: 'Respire. No estamos ahí'},
  {from: 2180, dur: 160, img: 'bp_doc_rinon.jpg', caption: 'Soy nefrólogo: me dedico a los riñones'},
  {from: 3350, dur: 168, img: 'bp_rinones_modelo.jpg', caption: 'El riñón, un colador finito', card: true, side: 'left', accent: BAS.aqua},
  {from: 4550, dur: 160, img: 'bp_salmon_filete_fresco.jpg', caption: 'Proteína buena, menos basura a filtrar', card: true, side: 'right', accent: BAS.si},
  {from: 8470, dur: 160, img: 'bp_doc_sardinas.jpg', caption: 'La humilde sardina'},
  {from: 8900, dur: 156, img: 'bp_sardina_espinas_calcio.jpg', caption: 'Con las espinitas: calcio', card: true, side: 'left', accent: BAS.si},
  {from: 10250, dur: 156, img: 'bp_sardinas_horno_limon.jpg', caption: 'Al horno con limón', card: true, side: 'right', accent: BAS.si},
  {from: 10850, dur: 160, img: 'bp_doc_salmon.jpg', caption: 'Cuando pueda, vale la pena'},
  {from: 11900, dur: 156, img: 'bp_salmon_horno_hierbas.jpg', caption: 'Fresco, al horno o al vapor', card: true, side: 'left', accent: BAS.si},
  {from: 12264, dur: 156, img: 'bp_salmon_porcion_palma.jpg', caption: 'La palma de su mano', card: true, side: 'right', accent: BAS.aqua},
  {from: 13050, dur: 160, img: 'bp_doc_caballa.jpg', caption: 'Mi preferida para el bolsillo justo'},
  {from: 13300, dur: 156, img: 'bp_caballa_carne_oscura.jpg', caption: 'Carne oscura, cargada de omega-3', card: true, side: 'left', accent: BAS.si},
  {from: 14400, dur: 156, img: 'bp_pescaderia_mostrador.jpg', caption: 'Ojos brillantes, agallas rojas', card: true, side: 'right', accent: BAS.aqua},
  {from: 16550, dur: 160, img: 'bp_doc_horno.jpg', caption: 'El de todos los días'},
  {from: 16300, dur: 156, img: 'bp_bacalao_fresco.jpg', caption: 'Merluza y bacalao: más livianos', card: true, side: 'left', accent: BAS.si},
  {from: 17600, dur: 160, img: 'bp_doc_anchoa.jpg', caption: 'El pescadito que casi nadie mira'},
  {from: 17900, dur: 156, img: 'bp_boquerones_limon_marinados.jpg', caption: 'Fresco: oro para sus riñones', card: true, side: 'right', accent: BAS.si},
  {from: 19950, dur: 156, img: 'bp_doc_pescaderia.jpg', caption: 'El pescado no es el enemigo'},
  {from: 20250, dur: 156, img: 'bp_porciones_semana.jpg', caption: 'En la porción justa', card: true, side: 'left', accent: BAS.aqua},
  {from: 21300, dur: 160, img: 'bp_doc_sal_no.jpg', caption: 'Nada de sal'},
  {from: 21750, dur: 156, img: 'bp_hierbas_limon_ajo.jpg', caption: 'Limón, ajo, perejil, hierbas', card: true, side: 'right', accent: BAS.si},
  {from: 22600, dur: 148, img: 'bp_pescado_horno_bandeja.jpg', caption: 'Al horno, no frito', card: true, side: 'left', accent: BAS.aqua},
  {from: 23656, dur: 168, img: 'bp_doc_analisis.jpg', caption: 'Esto acompaña a su médico'},
  {from: 24200, dur: 156, img: 'bp_doc_hierbas.jpg', caption: 'El traje a medida lo hace su médico'},
  {from: 25455, dur: 120, img: 'bp_tobillos_hinchados.jpg', caption: 'Tobillos hinchados', card: true, side: 'right', accent: BAS.amber},
  {from: 25720, dur: 130, img: 'bp_orina_frasco_espuma.jpg', caption: 'Orina espumosa', card: true, side: 'left', accent: BAS.amber},
  {from: 26531, dur: 168, img: 'bp_doc_tranquilo.jpg', caption: 'Hay mucho en sus manos'},
  {from: 26900, dur: 160, img: 'bp_doc_pescaderia.jpg', caption: 'Empiece esta misma semana'},
  {from: 27100, dur: 150, img: 'bp_sardinas_frescas_hielo.jpg', caption: 'En la próxima compra', card: true, side: 'right', accent: BAS.aqua},
  {from: 27700, dur: 160, img: 'bp_doc_guia.jpg', caption: 'La guía completa, abajo'},
  {from: 28250, dur: 200, img: 'bp_guia_pescados_papel.jpg', caption: 'Porciones y cómo cocinarlos', card: true, side: 'left', accent: BAS.aqua},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 120, dur: 200, node: <KeyWord word="5 PESCADOS" sub="para bajar la creatinina" color={BAS.aqua} />},
  {from: 1591, dur: 230, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: 4327, dur: 190, node: <KeyWord word="MENOS BASURA" sub="a filtrar que la carne roja" color={BAS.aqua} />},
  {from: 6600, dur: 200, node: <KeyWord word="OMEGA-3" sub="el bombero antiinflamatorio" color={BAS.aqua} />},
  {from: 8210, dur: 180, node: <KeyWord word="SARDINA" sub="omega-3 barato" color={BAS.si} />},
  {from: 9520, dur: 190, node: <KeyWord word="OJO: LA SAL" sub="escúrrala o enjuáguela" color={BAS.no} />},
  {from: 11670, dur: 190, node: <KeyWord word="AHUMADO = SAL" sub="mejor fresco al horno" color={BAS.no} />},
  {from: 14100, dur: 210, node: <KeyWord word="OJOS Y AGALLAS" sub="así elige el más fresco" color={BAS.aqua} />},
  {from: 17120, dur: 190, node: <KeyWord word="ANCHOA FRESCA" sub="el más poderoso" color={BAS.si} />},
  {from: 18420, dur: 200, node: <KeyWord word="EN SALAZÓN, NO" sub="pura sal para el riñón" color={BAS.no} />},
  {from: 19403, dur: 200, node: <KeyWord word="MITO" sub="el pescado no es el enemigo" color={BAS.aqua} />},
  {from: 20661, dur: 200, node: <KeyWord word="3 REGLAS DE ORO" sub="para no arruinarlo" color={BAS.aqua} />},
  {from: 23900, dur: 240, node: <CautionChip text="Acompaña a su médico, no lo reemplaza" />},
  {from: 27398, dur: 420, node: <SubscribeCard />},
  {from: 27921, dur: 300, node: <KeyWord word="LA GUÍA · EN LA DESCRIPCIÓN" sub="porciones y cómo cocinarlos" color={BAS.aqua} />},
  {from: 28960, dur: 176, node: <KeyWord word="PRÓXIMO: BEBIDAS" sub="que limpian mientras duerme" color={BAS.aqua} />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 943, name: 'deep-cinematic-impact-1.mp3', vol: 0.5},
  {at: 2609, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: 4973, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.45},
  {at: 6012, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 7613, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: 8172, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 10478, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 12562, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 15110, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 17087, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 18700, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.45},
  {at: 21107, name: 'px_sparkleClean.mp3', vol: 0.45},
  {at: 21990, name: 'px_sparkleClean.mp3', vol: 0.45},
  {at: 22924, name: 'px_sparkleClean.mp3', vol: 0.45},
  {at: 25950, name: 'deep-cinematic-impact-2.mp3', vol: 0.4},
  {at: 27398, name: 'px_sparkleClean.mp3', vol: 0.5},
];

export const MainBaspescados: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR — un solo OffthreadVideo en bucle y MUDO; el audio sale del master */}
      <OffthreadVideo src={staticFile(AVATAR_LOOP)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />

      {/* MASTER de audio (tramo1 = audio del avatar → lipsync real; después, cola Fish) */}
      <Audio src={staticFile('baspescados.wav')} />

      <AbsoluteFill style={{background: `linear-gradient(160deg, ${rgba(BAS.bgPanel, 0.42)}, ${rgba(BAS.bgDeep, 0.5)})`, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 44%, transparent 55%, ${rgba(BAS.bgEdge, 0.5)} 100%)`, pointerEvents: 'none'}} />

      {/* MARCA BASTIDA (tapa el watermark del avatar) */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div style={{position: 'absolute', top: 0, right: 0, width: 680, height: 300, background: `radial-gradient(130% 130% at 100% 0%, ${rgba('#05161f', 0.99)} 46%, ${rgba('#05161f', 0.85)} 62%, transparent 84%)`}} />
        <div style={{position: 'absolute', top: 34, right: 44, textAlign: 'right'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: '#F4F1E9', lineHeight: 1}}>Dr. Bastida</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 17, fontWeight: 700, letterSpacing: 3, color: BAS.aqua, marginTop: 4}}>SALUD RENAL</div>
        </div>
        <div style={{position: 'absolute', bottom: 0, right: 0, width: 220, height: 200, background: `radial-gradient(120% 120% at 100% 100%, ${rgba('#05161f', 0.95)} 28%, transparent 70%)`}} />
        <div style={{position: 'absolute', bottom: 40, right: 46, width: 56, height: 56, borderRadius: '50%', border: `2px solid ${rgba(BAS.aqua, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: BAS.aquaLite}}>B</div>
      </AbsoluteFill>

      {/* CLIPS animados */}
      {CLIPS.map((c, i) => (
        <Sequence key={`cl${i}`} from={c.from} durationInFrames={c.dur}>
          <MatchWhip dur={c.dur} dir="in"><Clip name={c.name} dur={c.dur} kb={c.kb} /></MatchWhip>
        </Sequence>
      ))}

      {/* B-ROLL: card = tarjeta 2.5D (objetos) · sin card = full-bleed (doctor) */}
      {BROLL.map((b, i) => (
        <Sequence key={`br${i}`} from={b.from} durationInFrames={b.dur}>
          {b.card ? (
            <MatchWhip dur={b.dur} dir={b.side === 'left' ? 'left' : 'right'}>
              <BRollCard img={b.img} caption={b.caption} dur={b.dur} side={b.side ?? 'right'} accent={b.accent ?? BAS.aqua} />
            </MatchWhip>
          ) : (
            <BRoll img={b.img} caption={b.caption} dur={b.dur} kb={b.kb ?? 1} />
          )}
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
      <Audio src={staticFile('sfx/ra_ambient_day.mp3')} volume={0.07} loop />

      {/* SFX */}
      {SFX.map((s, i) => (
        <Sequence key={`sf${i}`} from={s.at} durationInFrames={90}>
          <Audio src={sfxf(s.name)} volume={s.vol ?? 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
