/**
 * Main_aguaayunas60 — "Lo que el Agua en Ayunas le Hace a sus Riñones Después de los 60".
 *
 * AVATAR PARCIAL: el creador grabó 9:51 (590.733s → hook + miedo + presentación + Don Alberto +
 * mecanismo del colador + el problema de la mañana + los 3 beneficios + recap + limón + reserva).
 * Master ÚNICO de audio: public/aguaayunas60.wav = audio del avatar (tramo 1, lipsync real) + 0.35s +
 * cola locutada con Fish (voz clonada del propio avatar, desde "Empecemos por lo que SÍ"). El avatar va
 * en BUCLE y MUDO (aguaayunas60_opt.mp4, 1030s): su primer play (0-590.7s) ES el avatar real.
 * Anclado al ms con captions_aguaayunas60.json (scripts/anchor_aguaayunas60.mjs).
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, BRoll, PresenterIntro, HandUnderline} from './BastidaFX';
import {BRollCard} from './BRollCard';
import {RenalLowerThird} from './BastidaKit';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {TestimonialScene} from './TestimonialScene';
import {RenalItemCard} from './RenalItemCard';
import {GuideCTAScene} from './GuideCTAScene';
import {MatchWhip, WhipDir} from './MatchWhip';
import {FilterMechanismScene} from './scenes7/FilterMechanismScene';
import {RuleScene} from './scenes7/RuleScene';

export const TOTAL_AA = 30722;
const AVATAR_LOOP = 'aguaayunas60_opt.mp4';

/* ---------------- datos ---------------- */
const RECAP_CARDS = [
  {name: 'Diluye la sangre', img: 'img/ag_sangre_espesa.jpg', tint: '#34C6E0'},
  {name: 'Barre la orina', img: 'img/ag_canilla.jpg', tint: '#34C6E0'},
  {name: 'Afloja la presión', img: 'img/ag_tensiometro.jpg', tint: '#34C6E0'},
];
const GOOD_V = [
  {img: 'img/ag_vaso_llena.jpg', name: 'Del tiempo, no helada'},
  {img: 'img/ag_dr_sorbo.jpg', name: 'De a sorbos, con calma'},
  {img: 'img/ag_dr_hook.jpg', name: 'Lo primero del día'},
  {img: 'img/ag_vaso_noche.jpg', name: 'Todos los días, un hábito'},
];
const BAD_V = [
  {img: 'img/ag_alim_no.jpg', name: 'Litros de golpe'},
  {img: 'img/ag_vaso_cafe.jpg', name: 'Cambiarla por café o jugo'},
  {img: 'img/ag_sal_bicarb.jpg', name: 'Agregarle sal o bicarbonato'},
];

const sfxf = (n: string) => staticFile(`sfx/${n}`);

/* ---------------- CLIP (b-roll animado, pantalla completa, mudo) ---------------- */
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
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 112, fontWeight: 800, letterSpacing: 2, color, textShadow: `0 0 ${28 + glow * 36}px ${rgba(color, 0.6)}, 0 8px 30px rgba(0,0,0,0.7)`}}>{word}</div>
        {sub && <div style={{fontFamily: FONT_SANS, fontSize: 38, fontWeight: 700, color: '#EAF2F4', marginTop: 4, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>{sub}</div>}
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

/* ============================ BEATS (anclados al ms) ============================ */
// escenas HERO de profundidad y componentes (avatar oculto)
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  {from: 860, dur: 320, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'Hoy no estamos ahí.']} breakAt={120} />},
  {from: 1493, dur: 300, dir: 'in', node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="Su médico de confianza" />},
  {from: 2544, dur: 560, dir: 'left', node: <TestimonialScene img="img/ag_senor_camina.jpg" name="Don Alberto" place="72 años" quote={'"La verdad, doctor, casi no tomaba agua, no me daba sed. Empecé por la mañana… y la creatinina volvió a su lugar."'} tag="Un solo cambio" />},
  {from: 4300, dur: 300, dir: 'in', node: <CreatininaScene from={1.5} to={1.1} caption="Creatinina" subcaption="volvió a su lugar en tres meses" />},
  {from: 4830, dur: 520, dir: 'left', node: <FilterMechanismScene />},
  {from: 7250, dur: 430, dir: 'in', node: <RuleScene kicker="La sed se apaga" question="¿Por qué a los 60?" answer="El cuerpo deja de avisarle" note="Deshidratado sin sentir nada de sed" img="img/ag_senor_camina.jpg" imgSide="right" accent={BAS.amber} />},
  {from: 11720, dur: 430, dir: 'left', node: <RuleScene kicker="La presión alta" question="¿El segundo enemigo del riñón?" answer="Después de la diabetes, la presión" note="Cierra los agujeritos, año tras año" img="img/ag_tensiometro.jpg" imgSide="left" accent={BAS.amber} />},
  {from: 13013, dur: 470, dir: 'in', node: <RenalCarousel cards={RECAP_CARDS} reveals={[26, 92, 158]} introDur={40} kicker="Con un solo vaso" title="Las 3 cosas" />},
  {from: 14503, dur: 250, dir: 'up', node: <HandUnderline phrase="el agua, no el limón" note="el agua hace el trabajo" />},
  {from: 15600, dur: 470, dir: 'right', node: <RuleScene kicker="Después de los 60" question="¿Por qué ahora sí importa?" answer="La reserva del riñón ya se gastó" note="Cada cuidado, a esta edad, pesa el doble" img="img/ag_dr_rinon.jpg" imgSide="right" accent={BAS.aqua} />},
  {from: 21870, dur: 560, dir: 'up', node: <FoodVerdictScene title="El agua en ayunas: SÍ / NO" good={GOOD_V} bad={BAD_V} />},
  {from: 23056, dur: 470, dir: 'in', node: <RuleScene kicker="¿Ya tiene la creatinina alta?" question="¿Cuánta agua debo tomar?" answer="Eso lo decide su nefrólogo" note="Con sus análisis en la mano, no este video" img="img/ag_dr_analisis.jpg" imgSide="left" accent={BAS.amber} />},
  {from: 27088, dur: 820, dir: 'up', node: <AlertSignalsScene title="¿Su riñón le pide ayuda?" signals={['Orina oscura como el té a media mañana', 'Cansancio y cabeza pesada al levantarse', 'Tobillos o pies hinchados al final del día', 'Mucha espuma en la orina que tarda en irse', 'Levantarse muchas veces a orinar de noche']} footer="Si reconoce 2 o más, pídale a su médico un análisis con creatinina" />},
  {from: 29732, dur: 560, dir: 'up', node: <GuideCTAScene kicker="Gratis · en la descripción" title="La guía del agua para sus riñones" subtitle="Cantidades por peso · el mejor momento · alimentos SÍ y NO" thumbs={['img/ag_vaso_llena.jpg', 'img/ag_rinon_modelo.jpg', 'img/ag_sandia_pepino.jpg', 'img/ag_guia.jpg']} />},
  // OPENERS 2.5D — los 3 beneficios (número grande + foto)
  {from: 8832, dur: 120, dir: 'in', node: <RenalItemCard n="1" name="Diluye la sangre" note="La filtración mejora casi al toque" img="img/ag_sangre_espesa.jpg" accent={BAS.aqua} side="right" />},
  {from: 10049, dur: 120, dir: 'in', node: <RenalItemCard n="2" name="Barre la orina" note="Menos piedras, menos infecciones" img="img/ag_canilla.jpg" accent={BAS.aqua} side="left" />},
  {from: 11246, dur: 120, dir: 'in', node: <RenalItemCard n="3" name="Afloja la presión" img="img/ag_tensiometro.jpg" note="La presión es el 2º enemigo del riñón" accent={BAS.aqua} side="right" />},
  // OPENERS 2.5D — SÍ / NO (durante la sección)
  {from: 17797, dur: 120, dir: 'in', node: <RenalItemCard n="SÍ" name="Del tiempo, no helada" note="Se absorbe sin cimbronazo" img="img/ag_vaso_llena.jpg" accent={BAS.si} side="right" />},
  {from: 19288, dur: 120, dir: 'in', node: <RenalItemCard n="SÍ" name="De a sorbos" note="No un litro de golpe" img="img/ag_dr_sorbo.jpg" accent={BAS.si} side="left" />},
  {from: 20166, dur: 120, dir: 'in', node: <RenalItemCard n="NO" name="Litros de más" note="Puede bajar el sodio: hiponatremia" img="img/ag_vaso_llena.jpg" accent={BAS.no} side="right" />},
  {from: 21246, dur: 120, dir: 'in', node: <RenalItemCard n="NO" name="Jugo o gaseosa" note="Azúcar y fósforo, justo lo contrario" img="img/ag_alim_no.jpg" accent={BAS.no} side="left" />},
];

// clips animados (pantalla completa, avatar oculto)
const CLIPS: {from: number; dur: number; name: string; kb?: number}[] = [
  {from: 360, dur: 168, name: 'ag_vaso_llena'},
  {from: 620, dur: 150, name: 'aguaayunas60_stock/agst_pour_water_glass'},
  {from: 1180, dur: 150, name: 'aguaayunas60_stock/agst_morning_kitchen'},
  {from: 3180, dur: 170, name: 'ag_dos_cafes'},
  {from: 3560, dur: 150, name: 'aguaayunas60_stock/agst_senior_walk'},
  {from: 5400, dur: 160, name: 'aguaayunas60_stock/agst_kidney_medical'},
  {from: 5720, dur: 168, name: 'ag_colador_agua'},
  {from: 6250, dur: 170, name: 'ag_durmiendo'},
  {from: 6720, dur: 170, name: 'ag_sangre_espesa'},
  {from: 8138, dur: 168, name: 'ag_vaso_cafe'},
  {from: 9260, dur: 150, name: 'aguaayunas60_stock/agst_water_drops'},
  {from: 10600, dur: 168, name: 'ag_canilla'},
  {from: 12300, dur: 150, name: 'aguaayunas60_stock/agst_drinking_water'},
  {from: 13620, dur: 168, name: 'ag_agua_limon'},
  {from: 18120, dur: 168, name: 'ag_dr_sirve'},
  {from: 19420, dur: 168, name: 'ag_dr_sorbo'},
  {from: 24560, dur: 168, name: 'ag_orina_oscura'},
  {from: 28020, dur: 168, name: 'ag_dr_ventana'},
  {from: 30470, dur: 170, name: 'ag_dr_cuidese'},
];

// fotos b-roll: `card` = tarjeta de vidrio flotante 2.5D (objetos); sin card = full-bleed (planos del doctor)
const BROLL: {from: number; dur: number; img: string; caption?: string; kb?: number; card?: boolean; side?: 'left' | 'right'; accent?: string}[] = [
  // ── TRAMO 1 (avatar real, lipsync) — densifica los huecos largos, deja respirar al avatar ──
  {from: 1810, dur: 300, img: 'ag_dr_conversa.jpg', caption: 'Présteme atención un segundo'},
  {from: 2120, dur: 220, img: 'ag_vaso_cafe.jpg', caption: 'Sírvase un vaso, quédese conmigo', card: true, side: 'right', accent: BAS.aqua},
  {from: 2350, dur: 190, img: 'ag_dr_present.jpg', caption: 'Miles de pacientes como usted'},
  {from: 3360, dur: 200, img: 'ag_dos_cafes.jpg', caption: '"Casi nada, no me da sed"', card: true, side: 'left', accent: BAS.amber},
  {from: 3710, dur: 300, img: 'ag_dr_sirve.jpg', caption: 'Empezó la mañana con agua'},
  {from: 4020, dur: 280, img: 'ag_vaso_llena.jpg', caption: 'Le devolvimos el agua', card: true, side: 'right', accent: BAS.aqua},
  {from: 4600, dur: 230, img: 'ag_dr_colador.jpg', caption: 'El riñón es un colador'},
  {from: 5560, dur: 160, img: 'ag_rinon_modelo.jpg', caption: '180 litros por día', card: true, side: 'left', accent: BAS.aqua},
  {from: 5900, dur: 350, img: 'ag_dr_pizarra.jpg', caption: 'Los agujeritos se van cerrando'},
  {from: 6440, dur: 280, img: 'ag_manos_mesa.jpg', caption: '8 horas perdiendo líquido', card: true, side: 'right', accent: BAS.amber},
  {from: 6900, dur: 350, img: 'ag_sangre_espesa.jpg', caption: 'La sangre, más espesa', card: true, side: 'left', accent: BAS.amber},
  {from: 7700, dur: 300, img: 'ag_dr_conversa.jpg', caption: 'Deshidratados sin sentir sed'},
  {from: 8010, dur: 128, img: 'ag_vaso_cafe.jpg', caption: 'Café diurético, en ayunas', card: true, side: 'right', accent: BAS.amber},
  {from: 8360, dur: 300, img: 'ag_dr_sirve.jpg', caption: 'El primer vaso rescata al riñón'},
  {from: 8680, dur: 152, img: 'ag_vaso_llena.jpg', caption: 'Antes del café', card: true, side: 'right', accent: BAS.aqua},
  {from: 9000, dur: 260, img: 'ag_rinon_modelo.jpg', caption: 'La sangre vuelve a ser fluida', card: true, side: 'left', accent: BAS.aqua},
  {from: 9420, dur: 320, img: 'ag_dr_sirve.jpg', caption: 'Física pura: se cuela mejor'},
  {from: 9760, dur: 289, img: 'ag_vaso_llena.jpg', caption: 'Un fluido diluido pasa mejor', card: true, side: 'right', accent: BAS.aqua},
  {from: 10200, dur: 400, img: 'ag_dr_colador.jpg', caption: 'Toda la noche goteando'},
  {from: 10800, dur: 240, img: 'ag_piedra.jpg', caption: 'Arrastra lo estancado', card: true, side: 'left', accent: BAS.aqua},
  {from: 11050, dur: 196, img: 'ag_orina_oscura.jpg', caption: 'La orina se aclara', card: true, side: 'right', accent: BAS.aqua},
  {from: 11440, dur: 280, img: 'ag_tensiometro.jpg', caption: 'El cuerpo retiene, sube la presión', card: true, side: 'left', accent: BAS.amber},
  {from: 12500, dur: 500, img: 'ag_dr_tension.jpg', caption: 'El círculo se sostiene solo'},
  {from: 13900, dur: 300, img: 'ag_agua_limon.jpg', caption: 'Agua tibia con limón', card: true, side: 'right', accent: BAS.aqua},
  {from: 14210, dur: 290, img: 'ag_dr_conversa.jpg', caption: '¿Desintoxica el riñón?'},
  {from: 14760, dur: 240, img: 'ag_agua_limon.jpg', caption: 'El limón es la compañía', card: true, side: 'left', accent: BAS.aqua},
  {from: 15010, dur: 590, img: 'ag_dr_sorbo.jpg', caption: 'El agua sola hace lo mismo'},
  {from: 16120, dur: 360, img: 'ag_dr_rinon.jpg', caption: 'El riñón joven tiene reserva'},
  {from: 16500, dur: 340, img: 'ag_rinon_modelo.jpg', caption: 'A los 60 ya se gastó', card: true, side: 'right', accent: BAS.aqua},
  {from: 16860, dur: 420, img: 'ag_dr_pizarra.jpg', caption: 'Cada cuidado pesa el doble'},
  {from: 17290, dur: 442, img: 'ag_dr_conversa.jpg', caption: 'La diferencia hasta los 90'},
  // ── TRAMO 2 (avatar en bucle, desincronizado) — cobertura casi total ──
  {from: 17917, dur: 203, img: 'ag_vaso_llena.jpg', caption: 'Del tiempo, no helada', card: true, side: 'left', accent: BAS.si},
  {from: 18300, dur: 340, img: 'ag_dr_mesaluz.jpg', caption: 'Déjelo servido la noche anterior'},
  {from: 18650, dur: 300, img: 'ag_vaso_noche.jpg', caption: 'Al lado de la cafetera', card: true, side: 'right', accent: BAS.si},
  {from: 18960, dur: 328, img: 'ag_dr_conversa.jpg', caption: 'El vaso humilde de todos los días'},
  {from: 19600, dur: 300, img: 'ag_vaso_llena.jpg', caption: 'De a sorbos, con calma', card: true, side: 'left', accent: BAS.si},
  {from: 19910, dur: 256, img: 'ag_dr_sirve.jpg', caption: 'No un litro de golpe'},
  {from: 20300, dur: 300, img: 'ag_vaso_llena.jpg', caption: 'Más NO es mejor', card: true, side: 'right', accent: BAS.no},
  {from: 20620, dur: 300, img: 'ag_dr_analisis.jpg', caption: 'Diluye el sodio: hiponatremia'},
  {from: 20930, dur: 316, img: 'ag_guia.jpg', caption: 'Las medidas exactas, en la guía', card: true, side: 'left', accent: BAS.aqua},
  {from: 21380, dur: 250, img: 'ag_alim_no.jpg', caption: 'Ni jugo ni gaseosa', card: true, side: 'right', accent: BAS.no},
  {from: 21640, dur: 230, img: 'ag_sal_bicarb.jpg', caption: 'El azúcar, lo contrario del riñón', card: true, side: 'left', accent: BAS.no},
  {from: 22440, dur: 200, img: 'ag_sal_bicarb.jpg', caption: 'Ni sal ni bicarbonato', card: true, side: 'right', accent: BAS.no},
  {from: 22660, dur: 396, img: 'ag_dr_analisis.jpg', caption: 'El riñón sano ya desintoxica'},
  {from: 23600, dur: 300, img: 'ag_analisis.jpg', caption: 'Con sus análisis en la mano', card: true, side: 'left', accent: BAS.amber},
  {from: 23910, dur: 330, img: 'ag_dr_conversa.jpg', caption: 'El riñón es un órgano callado'},
  {from: 24250, dur: 310, img: 'ag_dr_pizarra.jpg', caption: 'Pero manda señales'},
  {from: 24728, dur: 300, img: 'ag_orina_oscura.jpg', caption: 'Orina oscura como el té', card: true, side: 'right', accent: BAS.amber},
  {from: 25040, dur: 300, img: 'ag_manos_mesa.jpg', caption: 'Cansancio, cabeza pesada', card: true, side: 'left', accent: BAS.amber},
  {from: 25350, dur: 300, img: 'ag_tobillos.jpg', caption: 'Tobillos o pies hinchados', card: true, side: 'right', accent: BAS.amber},
  {from: 25660, dur: 300, img: 'ag_orina_espuma.jpg', caption: 'Espuma que tarda en irse', card: true, side: 'left', accent: BAS.amber},
  {from: 25970, dur: 300, img: 'ag_vaso_noche.jpg', caption: 'Levantarse de noche a orinar', card: true, side: 'right', accent: BAS.amber},
  {from: 26280, dur: 380, img: 'ag_dr_conversa.jpg', caption: 'La gente lo vive al revés'},
  {from: 26670, dur: 418, img: 'ag_dr_mesaluz.jpg', caption: 'Hidratado temprano, mejor de noche'},
  {from: 28320, dur: 300, img: 'ag_vaso_llena.jpg', caption: 'Mañana, ese vaso, es lo primero', card: true, side: 'left', accent: BAS.aqua},
  {from: 28630, dur: 300, img: 'ag_sangre_espesa.jpg', caption: 'La sangre vuelve a fluir', card: true, side: 'right', accent: BAS.aqua},
  {from: 28940, dur: 300, img: 'ag_canilla.jpg', caption: 'El riñón cuela sin pelear', card: true, side: 'left', accent: BAS.aqua},
  {from: 29250, dur: 300, img: 'ag_tensiometro.jpg', caption: 'La presión afloja', card: true, side: 'right', accent: BAS.aqua},
  {from: 29560, dur: 172, img: 'ag_rinon_modelo.jpg', caption: 'La condición más básica', card: true, side: 'left', accent: BAS.aqua},
  {from: 30300, dur: 170, img: 'ag_guia.jpg', caption: 'La guía, en la descripción', card: true, side: 'right', accent: BAS.aqua},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 120, dur: 230, node: <KeyWord word="EL PRIMER VASO" sub="lo que le hace a sus riñones a los 60" color={BAS.aqua} />},
  {from: 1810, dur: 230, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: 6197, dur: 200, node: <KeyWord word="8 HORAS SIN AGUA" sub="la sangre, en su punto más espeso" color={BAS.amber} />},
  {from: 8539, dur: 190, node: <KeyWord word="EL RESCATE" sub="del peor momento del riñón" color={BAS.aqua} />},
  {from: 20617, dur: 210, node: <KeyWord word="HIPONATREMIA" sub="más agua NO es mejor" color={BAS.no} />},
  {from: 23056, dur: 240, node: <CautionChip text="La cantidad la decide su nefrólogo" />},
  {from: 27088, dur: 240, node: <CautionChip text="¿Dos o más señales? pida un análisis" />},
  {from: 30268, dur: 440, node: <SubscribeCard />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 860, name: 'deep-cinematic-impact-1.mp3', vol: 0.5},
  {at: 1493, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: 4300, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 4830, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: 8832, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 10049, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 11246, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 13013, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.45},
  {at: 17797, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 19288, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 20166, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 21246, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 21870, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.45},
  {at: 27088, name: 'deep-cinematic-impact-2.mp3', vol: 0.4},
  {at: 30268, name: 'px_sparkleClean.mp3', vol: 0.5},
];

export const MainAguaAyunas60: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR — un solo OffthreadVideo en bucle y MUDO; el audio sale del master */}
      <OffthreadVideo src={staticFile(AVATAR_LOOP)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />

      {/* MASTER de audio (tramo1 = audio del avatar → lipsync real; después, cola Fish).
          Nombre _fish.wav: el stitch del farm usa ESE archivo para el audio final sin deriva. */}
      <Audio src={staticFile('aguaayunas60_fish.wav')} />

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

      {/* ESCENAS DE PROFUNDIDAD / COMPONENTES */}
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
      <Audio src={staticFile('sfx/ra_ambient_day.mp3')} volume={0.06} loop />

      {/* SFX */}
      {SFX.map((s, i) => (
        <Sequence key={`sf${i}`} from={s.at} durationInFrames={90}>
          <Audio src={sfxf(s.name)} volume={s.vol ?? 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
