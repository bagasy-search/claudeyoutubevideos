/**
 * Main_limonayunas — "Esto le Hace el Limón a sus Riñones si lo Toma en Ayunas Cada Mañana" (Dr. Bastida).
 *
 * AVATAR PARCIAL: el creador grabó 627.8s (hook → mecanismo → por qué en ayunas). Master de audio único:
 * public/limonayunas.wav = audio del avatar (tramo1, lipsync real) + 0.35s + cola locutada con Fish
 * (voz clonada del propio avatar). Avatar en BUCLE y MUDO (limonayunas_opt.mp4, 1255s cubre 33139f).
 * Anclado al ms con captions_limonayunas.json → src/bastida/limonayunas_frames.ts (F).
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
import {ChapterAguaLimon} from './ChapterAguaLimon';
import {GuideCTAScene} from './GuideCTAScene';
import {F} from './limonayunas_frames';

export const TOTAL_L = 33139;
const AVATAR_LOOP = 'limonayunas_opt.mp4';

/* ---------------- datos ---------------- */
const BENEF_CARDS = [
  {name: 'El citrato', img: 'img/li_calculos.jpg', tint: '#34C6E0'},
  {name: 'El agua', img: 'img/li_agua_vaso.jpg', tint: '#34C6E0'},
  {name: 'Antioxidantes', img: 'img/li_limon_corte.jpg', tint: '#34C6E0'},
];

const sfxf = (n: string) => staticFile(`sfx/${n}`);

/* ---------------- CLIP (stock/agnes full-screen, mudo) ---------------- */
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

const NumTag: React.FC<{n: string; label: string; color?: string}> = ({n, label, color = BAS.aqua}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  return (
    <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 0 96px 80px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`}}>
        <div style={{width: 104, height: 104, borderRadius: '50%', background: color, color: '#04121A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 900, boxShadow: `0 14px 34px ${rgba(color, 0.5)}`}}>{n}</div>
        <div style={{background: rgba('#04121A', 0.8), borderRadius: 16, padding: '16px 30px', borderLeft: `6px solid ${color}`, boxShadow: '0 20px 44px rgba(0,0,0,0.5)'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 50, fontWeight: 700, color: '#F4F1E9'}}>{label}</div>
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
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: BAS.aqua, borderRadius: 16, padding: '18px 40px', boxShadow: `0 20px 50px ${rgba(BAS.aqua, 0.5)}`, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${pulse})`}}>
        <span style={{fontSize: 40, color: '#04121A'}}>▶</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 800, color: '#04121A', letterSpacing: 1}}>SUSCRÍBASE AL CANAL</span>
      </div>
    </AbsoluteFill>
  );
};

/* ============================ BEATS (anclados al ms via F) ============================ */
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  {from: F.hook_heladera, dur: 210, dir: 'in', node: <ChapterAguaLimon />},
  {from: F.dializar, dur: 250, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'Vamos por partes.']} breakAt={100} />},
  {from: F.cuento_paciente, dur: 470, dir: 'left', node: <TestimonialScene img="img/li_paciente.jpg" name="Un paciente" place="jubilado, 70 años" quote={'"Doctor, ¿me voy a tener que dializar?" Casi no tomaba agua y comía todo salado. Un plan simple, y a los tres meses volvió distinto.'} tag="Historia real" />},
  {from: F.afloja_numero, dur: 250, dir: 'in', node: <CreatininaScene from={1.7} to={1.3} caption="Creatinina" subcaption="cuando el riñón recibe ayuda, muchas veces afloja" />},
  {from: F.mito_acido, dur: 430, dir: 'left', node: <RuleScene kicker="El mito del ácido" question="¿El limón le acidifica el riñón?" answer="Adentro deja una ceniza alcalina" note="Queda citrato: un alcalinizante suave que protege" img="img/li_limon_corte.jpg" imgSide="right" accent={BAS.aqua} />},
  {from: F.tres_cosas, dur: 250, dir: 'in', node: <RenalCarousel cards={BENEF_CARDS} reveals={[24, 84, 144]} introDur={40} kicker="Lo que hace de verdad" title="3 cosas" />},
  {from: F.calculos_renales, dur: 430, dir: 'in', node: <RuleScene kicker="El citrato" question="¿Por qué se forman las piedras?" answer="El calcio se pega y se cristaliza" note="El citrato lo envuelve y no lo deja endurecer" img="img/li_pava_sarro.jpg" imgSide="left" accent={BAS.aqua} />},
  {from: F.filtro_barro, dur: 380, dir: 'right', node: <RuleScene kicker="La hidratación" question="¿Qué pasa con poca agua?" answer="El riñón filtra barro espeso en vez de agua clara" note="El limón lo convence de tomar su vaso" img="img/li_filtro.jpg" imgSide="right" accent={BAS.aqua} />},
  {from: F.millon_filtritos, dur: 470, dir: 'left', node: <FilterMechanismScene />},
  {from: F.por_eso_ayunas, dur: 400, dir: 'in', node: <RuleScene kicker="Por qué en ayunas" question="¿Por qué apenas se levanta?" answer="La orina viene concentrada de toda la noche" note="El primer vaso rompe la concentración y arranca a diluir" img="img/li_orina_manana.jpg" imgSide="left" accent={BAS.aqua} />},
  // ── TRAMO 2 (Fish) ──
  {from: F.no_para_todos, dur: 760, dir: 'up', node: <AlertSignalsScene title="¿Para quién NO es tan buena idea?" signals={['Estómago delicado: gastritis, reflujo o úlcera', 'Riñón muy avanzado, con el potasio bajo control médico', 'Cuide el esmalte: tómelo con pajita y no se cepille justo después']} footer="Ante la duda, consúltelo primero con su médico" />},
  {from: F.baja_creatinina, dur: 420, dir: 'left', node: <RuleScene kicker="Mentira número uno" question="¿Le baja la creatinina?" answer="No como quien aprieta un botón" note="Acompaña; no reemplaza a su tratamiento" img="img/li_analisis.jpg" imgSide="right" accent={BAS.amber} />},
  {from: F.cinco_limones, dur: 420, dir: 'in', node: <RuleScene kicker="Mentira número dos" question="¿Cinco limones es mejor?" answer="Más no es mejor, casi nunca" note="El exceso de vitamina C puede volverse oxalato, que forma piedras" img="img/li_limones_pila.jpg" imgSide="left" accent={BAS.no} />},
  {from: F.guia_descripcion, dur: 320, dir: 'up', node: <GuideCTAScene kicker="Gratis · en la descripción" title="La guía del limón en ayunas" subtitle="Cuánto limón · en cuánta agua · para quién sí y para quién no" thumbs={['img/li_limon_vaso.jpg', 'img/li_agua_tibia.jpg', 'img/li_pajita.jpg']} />},
  {from: F.que_esperar, dur: 400, dir: 'in', node: <RuleScene kicker="Qué va a sentir" question="¿En cuánto tiempo?" answer="Semanas, no minutos" note="Orina más clara, menos hinchazón, y después la energía" img="img/li_calendario.jpg" imgSide="right" accent={BAS.si} />},
  {from: F.no_pide_sacrificios, dur: 300, dir: 'up', node: <FoodVerdictScene title="Su riñón le pide poco: SÍ / NO" good={[{img: 'img/li_agua_vaso.jpg', name: 'Su vaso de agua'}, {img: 'img/li_limon_corte.jpg', name: 'Un limón, moderado'}, {img: 'img/li_caminar_persona.jpg', name: 'Una caminata'}]} bad={[{img: 'img/li_sal_paquetes.jpg', name: 'Sal escondida'}, {img: 'img/li_pastillas_vitc.jpg', name: 'Megadosis de vitamina C'}, {img: 'img/li_limones_pila.jpg', name: 'Pasarse de rosca'}]} />},

  // ── RenalItemCard: 3 beneficios ──
  {from: F.primera_citrato, dur: 100, dir: 'in', node: <RenalItemCard n="1" name="El citrato" note="pelea contra las piedras" img="img/li_calculos.jpg" accent={BAS.aqua} side="right" />},
  {from: F.segunda_agua, dur: 100, dir: 'in', node: <RenalItemCard n="2" name="El agua" note="el limón lo ayuda a tomarla" img="img/li_agua_vaso.jpg" accent={BAS.aqua} side="left" />},
  {from: F.tercera_antiox, dur: 100, dir: 'in', node: <RenalItemCard n="3" name="Antioxidantes" note="aflojan el desgaste" img="img/li_limon_corte.jpg" accent={BAS.aqua} side="right" />},
  // ── RenalItemCard: 3 costumbres ──
  {from: F.agua_del_dia, dur: 100, dir: 'in', node: <RenalItemCard n="1" name="Agua todo el día" note="repartida, nunca en seco" img="img/li_agua_vaso.jpg" accent={BAS.si} side="right" />},
  {from: F.cuidado_sal, dur: 100, dir: 'in', node: <RenalItemCard n="2" name="Menos sal" note="el enemigo escondido del paquete" img="img/li_sal_paquetes.jpg" accent={BAS.si} side="left" />},
  {from: F.muevase, dur: 100, dir: 'in', node: <RenalItemCard n="3" name="Muévase" note="una caminata alcanza" img="img/li_caminar_persona.jpg" accent={BAS.si} side="right" />},
];

// clips full-screen (stock 30 CFR, mudo)
const CLIPS: {from: number; dur: number; name: string; kb?: number}[] = [
  {from: F.hook_pastilla, dur: 130, name: 'limonayunas_stock/ls_lemon_squeeze_c30'},
  {from: F.que_es_creatinina, dur: 140, name: 'limonayunas_stock/ls_kidney_c30'},
  {from: F.en_la_boca, dur: 130, name: 'limonayunas_stock/ls_lemons_tree_c30'},
  {from: F.segunda_agua + 120, dur: 140, name: 'limonayunas_stock/ls_water_pour_c30'},
  {from: F.mientras_duerme, dur: 140, name: 'limonayunas_stock/ls_morning_kitchen_c30'},
  {from: F.muevase + 120, dur: 150, name: 'limonayunas_stock/ls_walking_morning_c30'},
  // agnes i2v (fotos animadas, motion leve) en beats hoy solo-avatar
  {from: F.citrato_guarde + 200, dur: 118, name: 'li_limon_corte'},
  {from: F.poco_citrato, dur: 118, name: 'li_calculos'},
  {from: F.agua_aburre, dur: 118, name: 'li_agua_vaso'},
  {from: F.antioxido, dur: 118, name: 'li_oxido'},
  {from: F.esas_tres, dur: 118, name: 'li_rinon_modelo'},
  {from: F.casi_marron, dur: 118, name: 'li_orina_manana'},
  {from: F.mas_no_mejor, dur: 118, name: 'li_pastillas_vitc'},
  {from: F.primer_si, dur: 118, name: 'li_limon_heladera'},
];

// fotos b-roll: card = tarjeta 2.5D (objetos) · sin card = full-bleed (doctor/personas)
const BROLL: {from: number; dur: number; img: string; caption?: string; kb?: number; card?: boolean; side?: 'left' | 'right'; accent?: string}[] = [
  {from: F.hook_open, dur: 120, img: 'li_dr_hook.jpg', caption: 'El limón en ayunas'},
  {from: F.hook_pastilla + 130, dur: 150, img: 'li_limon_vaso.jpg', caption: 'Un vaso apenas se levanta', card: true, side: 'right', accent: BAS.aqua},
  {from: F.acido_arruina, dur: 150, img: 'li_limon_corte.jpg', caption: '"¿Es ácido y le arruina los riñones?"', card: true, side: 'left', accent: BAS.amber},
  {from: F.present, dur: 190, img: 'li_dr_present.jpg', caption: 'Soy el doctor Emilio Bastida'},
  {from: F.basurita, dur: 160, img: 'li_analisis.jpg', caption: 'La creatinina: un desecho normal', card: true, side: 'right', accent: BAS.aqua},
  {from: F.blanco_papel, dur: 150, img: 'li_paciente.jpg', caption: 'Blanco como un papel'},
  {from: F.cuanta_agua, dur: 150, img: 'li_dr_creatinina.jpg', caption: '"¿Cuánta agua toma?"'},
  {from: F.fiambre_diario, dur: 150, img: 'li_sal_paquetes.jpg', caption: 'Fiambre y caldito a diario', card: true, side: 'left', accent: BAS.no},
  {from: F.volvio_distinto, dur: 150, img: 'li_paciente_alivio.jpg', caption: 'Volvió distinto'},
  {from: F.ceniza_alcalina, dur: 150, img: 'li_limon_corte.jpg', caption: 'Adentro juega para el otro lado', card: true, side: 'right', accent: BAS.aqua},
  {from: F.sarro_pava, dur: 160, img: 'li_pava_sarro.jpg', caption: 'Como el sarro de una pava vieja', card: true, side: 'left', accent: BAS.amber},
  {from: F.detergente, dur: 150, img: 'li_agua_vaso.jpg', caption: 'Mantiene el calcio disuelto', card: true, side: 'right', accent: BAS.aqua},
  {from: F.colico_renal, dur: 150, img: 'li_calculos.jpg', caption: 'El dolor de un cólico renal', card: true, side: 'left', accent: BAS.no},
  {from: F.deshidratacion, dur: 160, img: 'li_dr_agua.jpg', caption: 'La deshidratación de a poquito'},
  {from: F.amigo_convence, dur: 150, img: 'li_limon_vaso.jpg', caption: 'El amigo que lo convence de tomar agua', card: true, side: 'right', accent: BAS.aqua},
  {from: F.vitamina_flavonoides, dur: 160, img: 'li_limon_corte.jpg', caption: 'Vitamina C y flavonoides', card: true, side: 'left', accent: BAS.aqua},
  {from: F.oxida_fierro, dur: 160, img: 'li_oxido.jpg', caption: 'Como se oxida un fierro', card: true, side: 'right', accent: BAS.amber},
  {from: F.cuidar_filtritos, dur: 160, img: 'li_rinon_modelo.jpg', caption: 'Cuidar los filtritos que funcionan', card: true, side: 'left', accent: BAS.aqua},
  {from: F.orina_oscura, dur: 160, img: 'li_orina_manana.jpg', caption: 'La orina más concentrada del día', card: true, side: 'right', accent: BAS.amber},
  {from: F.agua_tibia, dur: 170, img: 'li_dr_tibia.jpg', caption: 'Tibia, no fría'},
  {from: F.para_banar_bebe, dur: 150, img: 'li_agua_tibia.jpg', caption: 'Como para bañar a un bebé', card: true, side: 'left', accent: BAS.aqua},
  {from: F.estomago_delicado, dur: 160, img: 'li_dr_precaucion.jpg', caption: 'El estómago delicado'},
  {from: F.los_dientes, dur: 150, img: 'li_pajita.jpg', caption: 'Tómelo con una pajita', card: true, side: 'right', accent: BAS.aqua},
  {from: F.megadosis, dur: 160, img: 'li_pastillas_vitc.jpg', caption: 'No las pastillas efervescentes', card: true, side: 'left', accent: BAS.no},
  {from: F.un_limon_uno, dur: 160, img: 'li_limon_corte.jpg', caption: 'Uno. La fruta, no la farmacia', card: true, side: 'right', accent: BAS.aqua},
  {from: F.enemigo_escondido, dur: 170, img: 'li_dr_sal.jpg', caption: 'El enemigo escondido: la sal'},
  {from: F.baje_sal, dur: 150, img: 'li_sal_paquetes.jpg', caption: 'Baje la sal, sin gastar un peso', card: true, side: 'left', accent: BAS.si},
  {from: F.circulacion, dur: 160, img: 'li_dr_caminar.jpg', caption: 'La circulación buena es riñón contento'},
  {from: F.primera_semana, dur: 160, img: 'li_calendario.jpg', caption: 'La primera semana', card: true, side: 'right', accent: BAS.si},
  {from: F.menos_hinchada, dur: 160, img: 'li_tobillos.jpg', caption: 'Menos hinchado de piernas y tobillos', card: true, side: 'left', accent: BAS.si},
  {from: F.no_pide_sacrificios + 300, dur: 190, img: 'li_dr_cierre.jpg', caption: 'No le pide grandes sacrificios'},
  {from: F.empieza_manana, dur: 160, img: 'li_limon_heladera.jpg', caption: 'El limón que ya tiene en la heladera', card: true, side: 'right', accent: BAS.aqua},
  {from: F.con_otra_cara, dur: 160, img: 'li_analisis.jpg', caption: 'Mirar ese número con otra cara', card: true, side: 'left', accent: BAS.si},
  {from: F.limon_esperando, dur: 160, img: 'li_limon_vaso.jpg', caption: 'Un limón esperándolo', card: true, side: 'right', accent: BAS.aqua},
  {from: F.cuidese_mucho, dur: 200, img: 'li_dr_cierre.jpg', caption: 'Cuídese mucho'},
  {from: F.filtro_maravilloso, dur: 90, img: 'li_rinon_modelo.jpg', caption: 'Ese filtro maravilloso', card: true, side: 'left', accent: BAS.aqua},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: F.hook_open + 4, dur: 170, node: <KeyWord word="EN AYUNAS" sub="lo que le hace a sus riñones" color={BAS.aqua} />},
  {from: F.porque_aca, dur: 220, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: F.mensajero, dur: 200, node: <KeyWord word="CREATININA" sub="es un mensajero, no un monstruo" color={BAS.amber} />},
  {from: F.citrato_guarde, dur: 200, node: <KeyWord word="CITRATO" sub="ahí está casi todo el secreto" color={BAS.aqua} />},
  {from: F.como_patada, dur: 210, node: <CautionChip text="Si le cae mal, hágale caso a su estómago" />},
  {from: F.su_medico, dur: 220, node: <CautionChip text="Riñón avanzado: hable primero con su médico" />},
  {from: F.oxalato, dur: 200, node: <KeyWord word="OXALATO" sub="el exceso arma el problema que evita" color={BAS.no} />},
  {from: F.aparece_energia, dur: 200, node: <KeyWord word="LA ENERGÍA" sub="al mes, se siente más liviano" color={BAS.si} />},
  {from: F.le_pide_atencion, dur: 220, node: <KeyWord word="LE PIDE ATENCIÓN" sub="no sacrificios" color={BAS.aqua} />},
  {from: F.suscribase, dur: 320, node: <SubscribeCard />},
  {from: F.guia_dejo, dur: 300, node: <KeyWord word="LA GUÍA · EN LA DESCRIPCIÓN" sub="las medidas y para quién sí y para quién no" color={BAS.aqua} />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: F.hook_heladera, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: F.dializar, name: 'deep-cinematic-impact-1.mp3', vol: 0.5},
  {at: F.afloja_numero, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: F.tres_cosas, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: F.primera_citrato, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: F.segunda_agua, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: F.tercera_antiox, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: F.millon_filtritos, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.45},
  {at: F.no_para_todos, name: 'deep-cinematic-impact-2.mp3', vol: 0.4},
  {at: F.guia_descripcion, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: F.agua_del_dia, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: F.cuidado_sal, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: F.muevase, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: F.suscribase, name: 'px_sparkleClean.mp3', vol: 0.5},
];

export const MainLimonAyunas: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR — un solo OffthreadVideo en bucle y MUDO; el audio sale del master */}
      <OffthreadVideo src={staticFile(AVATAR_LOOP)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />

      {/* MASTER de audio (tramo1 = audio del avatar → lipsync real; después, cola Fish) */}
      <Audio src={staticFile('limonayunas.wav')} />

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

      {/* CLIPS full-screen */}
      {CLIPS.map((c, i) => (
        <Sequence key={`cl${i}`} from={c.from} durationInFrames={c.dur}>
          <MatchWhip dur={c.dur} dir="in"><Clip name={c.name} dur={c.dur} kb={c.kb} /></MatchWhip>
        </Sequence>
      ))}

      {/* B-ROLL: card = tarjeta 2.5D (objetos) · sin card = full-bleed (doctor/personas) */}
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
