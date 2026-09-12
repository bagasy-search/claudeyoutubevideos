/**
 * Main_quesosrenal — "Salud Renal Después de los 60: 4 Quesos que Dañan sus Riñones y 5 que los Protegen".
 *
 * AVATAR PARCIAL: el creador grabó 7:14 (434.363s → primer tercio: hook + mecanismo + 4 quesos malos).
 * Arquitectura de UN SOLO master de audio: public/quesosrenal.wav = audio del avatar (tramo 1, lipsync
 * real) + 0.35s + cola locutada con Fish (voz clonada del propio avatar). El avatar va en BUCLE y MUDO
 * (quesosrenal_avatarloop.mp4, 1035s): su primer play (0-434s) ES el avatar real, después loopea.
 * Anclado al ms con captions_quesosrenal.json (scripts/anchor_quesos.mjs).
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

export const TOTAL_Q = 31031;
const AVATAR_LOOP = 'quesosrenal_opt.mp4';

/* ---------------- datos: quesos ---------------- */
const BAD_CARDS = [
  {name: 'Procesado en fetas', img: 'img/qr_procesado.jpg', tint: '#D64541'},
  {name: 'Queso azul', img: 'img/qr_azul.jpg', tint: '#D64541'},
  {name: 'Estacionado duro', img: 'img/qr_parmesano.jpg', tint: '#D64541'},
  {name: 'En salmuera', img: 'img/qr_feta.jpg', tint: '#D64541'},
];
const GOOD_CARDS = [
  {name: 'Ricota fresca', img: 'img/qr_ricota.jpg', tint: '#2FA96B'},
  {name: 'Mozzarella fresca', img: 'img/qr_mozzarella.jpg', tint: '#2FA96B'},
  {name: 'Queso suizo', img: 'img/qr_suizo.jpg', tint: '#2FA96B'},
  {name: 'Cabra fresco', img: 'img/qr_cabra.jpg', tint: '#2FA96B'},
  {name: 'Requesón sin sal', img: 'img/qr_requeson.jpg', tint: '#2FA96B'},
];
const GOOD_V = [
  {img: 'img/qr_ricota.jpg', name: 'Ricota fresca'},
  {img: 'img/qr_mozzarella.jpg', name: 'Mozzarella fresca'},
  {img: 'img/qr_suizo.jpg', name: 'Queso suizo'},
  {img: 'img/qr_cabra.jpg', name: 'Cabra fresco'},
  {img: 'img/qr_requeson.jpg', name: 'Requesón sin sal'},
];
const BAD_V = [
  {img: 'img/qr_procesado.jpg', name: 'Procesado en fetas'},
  {img: 'img/qr_azul.jpg', name: 'Queso azul'},
  {img: 'img/qr_parmesano.jpg', name: 'Estacionado duro'},
  {img: 'img/qr_feta.jpg', name: 'En salmuera'},
];

const sfxf = (n: string) => staticFile(`sfx/${n}`);

/* ---------------- CLIP (b-roll animado con agnes, pantalla completa, mudo) ---------------- */
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
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 118, fontWeight: 800, letterSpacing: 2, color, textShadow: `0 0 ${28 + glow * 36}px ${rgba(color, 0.6)}, 0 8px 30px rgba(0,0,0,0.7)`}}>{word}</div>
        {sub && <div style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, color: '#EAF2F4', marginTop: 4, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

const NumTag: React.FC<{n: string; label: string; color?: string}> = ({n, label, color = BAS.no}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  return (
    <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 0 96px 80px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`}}>
        <div style={{width: 104, height: 104, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 900, boxShadow: `0 14px 34px ${rgba(color, 0.5)}`}}>{n}</div>
        <div style={{background: rgba('#04121A', 0.8), borderRadius: 16, padding: '16px 30px', borderLeft: `6px solid ${color}`, boxShadow: '0 20px 44px rgba(0,0,0,0.5)'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 700, color: '#F4F1E9'}}>{label}</div>
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
// escenas HERO de profundidad (avatar oculto)
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  {from: 1886, dur: 300, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={110} />},
  {from: 3338, dur: 470, dir: 'left', node: <FilterMechanismScene />},
  {from: 6499, dur: 430, dir: 'in', node: <RuleScene kicker="El fósforo de más" question="¿A dónde va ese fósforo?" answer="Le roba el calcio a los huesos" note="Y ese calcio endurece las arterias" img="img/qr_huesos.jpg" imgSide="right" accent={BAS.amber} />},
  {from: 7054, dur: 380, dir: 'left', node: <RuleScene kicker="Dos tipos de fósforo" question="El natural vs. el agregado" answer="El agregado se absorbe casi entero" note="Busque la palabra 'fosfato' en la etiqueta" img="img/qr_dr_etiqueta.jpg" imgSide="left" accent={BAS.amber} />},
  {from: 8237, dur: 430, dir: 'in', node: <RenalCarousel cards={BAD_CARDS} reveals={[24, 74, 124, 174]} introDur={40} kicker="Con cuidado" title="4 que dañan" />},
  {from: 14160, dur: 620, dir: 'left', node: <TestimonialScene img="img/qr_desayuno_feta.jpg" name="Don Alberto" place="72 años" quote={'"Todas las mañanas, dos tostadas con tres fetas de queso amarillo. Cambió eso por queso suizo… y la creatinina bajó."'} tag="Un solo cambio" />},
  {from: 15521, dur: 260, dir: 'in', node: <CreatininaScene from={1.8} to={1.4} caption="Creatinina" subcaption="aflojó en el control siguiente" />},
  {from: 16085, dur: 430, dir: 'in', node: <RenalCarousel cards={GOOD_CARDS} reveals={[20, 60, 100, 140, 180]} introDur={40} kicker="Con más paz" title="5 que protegen" />},
  {from: 21091, dur: 520, dir: 'up', node: <FoodVerdictScene title="Quesos y sus riñones: SÍ / NO" good={GOOD_V} bad={BAD_V} />},
  {from: 23016, dur: 380, dir: 'right', node: <RuleScene kicker="La porción justa" question="¿Entra en dos dedos?" answer="Del tamaño de una cajita de fósforos" note="Un poquito del bueno, no una montaña" img="img/qr_dr_porcion.jpg" imgSide="left" accent={BAS.aqua} />},
  {from: 26863, dur: 760, dir: 'up', node: <AlertSignalsScene title="¿Sus riñones ya piden ayuda?" signals={['Tobillos o pies hinchados al final del día', 'Cansancio que no se arregla durmiendo', 'Cambios en el color o la cantidad de orina', 'Picazón en la piel, o un gusto metálico']} footer="Si reconoce 2 o más, pídale a su médico un análisis con creatinina" />},
  // OPENERS 2.5D por queso (tarjeta de vidrio flotante con foto + número acrílico + profundidad)
  {from: 8654, dur: 100, dir: 'in', node: <RenalItemCard n="1" name="Procesado en fetas" note="Sal + fosfato agregado" img="img/qr_procesado.jpg" accent={BAS.no} side="right" />},
  {from: 9888, dur: 100, dir: 'in', node: <RenalItemCard n="2" name="Queso azul" note="De los más salados que hay" img="img/qr_azul.jpg" accent={BAS.no} side="left" />},
  {from: 11095, dur: 100, dir: 'in', node: <RenalItemCard n="3" name="Estacionado duro" note="Sal y fósforo concentrados" img="img/qr_parmesano.jpg" accent={BAS.no} side="right" />},
  {from: 12295, dur: 100, dir: 'in', node: <RenalItemCard n="4" name="En salmuera" note="Una esponja de sodio" img="img/qr_feta.jpg" accent={BAS.no} side="left" />},
  {from: 16462, dur: 100, dir: 'in', node: <RenalItemCard n="1" name="Ricota fresca" note="Baja en sodio, proteína suave" img="img/qr_ricota.jpg" accent={BAS.si} side="right" />},
  {from: 17486, dur: 100, dir: 'in', node: <RenalItemCard n="2" name="Mozzarella fresca" note="Poca industria encima" img="img/qr_mozzarella.jpg" accent={BAS.si} side="left" />},
  {from: 18526, dur: 100, dir: 'in', node: <RenalItemCard n="3" name="Queso suizo" note="De los más bajos en sodio" img="img/qr_suizo.jpg" accent={BAS.si} side="right" />},
  {from: 19610, dur: 100, dir: 'in', node: <RenalItemCard n="4" name="Cabra fresco" note="Suave, menos sodio" img="img/qr_cabra.jpg" accent={BAS.si} side="left" />},
  {from: 20227, dur: 100, dir: 'in', node: <RenalItemCard n="5" name="Requesón sin sal" note="Proteína suave, poca sal" img="img/qr_requeson.jpg" accent={BAS.si} side="right" />},
];

// clips animados con agnes (pantalla completa, avatar oculto)
const CLIPS: {from: number; dur: number; name: string; kb?: number}[] = [
  // stock real (Pexels, 30fps CFR)
  {from: 660, dur: 148, name: 'quesosrenal_stock/qs_cheese_board_c30'},
  {from: 4400, dur: 148, name: 'quesosrenal_stock/qs_salt_c30'},
  {from: 6280, dur: 148, name: 'quesosrenal_stock/qs_kidney_c30'},
  {from: 13700, dur: 148, name: 'quesosrenal_stock/qs_cheese_cut_c30'},
  {from: 22150, dur: 148, name: 'quesosrenal_stock/qs_dairy_aisle_c30'},
  {from: 25180, dur: 148, name: 'quesosrenal_stock/qs_water_pour_c30'},
  {from: 27900, dur: 148, name: 'quesosrenal_stock/qs_bloodtest_c30'},
  // clips agnes (animados de las fotos)
  {from: 3900, dur: 150, name: 'qr_colador'},
  {from: 8720, dur: 168, name: 'qr_procesado', kb: 2},
  {from: 9950, dur: 172, name: 'qr_azul'},
  {from: 11160, dur: 172, name: 'qr_parmesano'},
  {from: 12360, dur: 172, name: 'qr_feta'},
  {from: 13400, dur: 150, name: 'qr_desayuno_feta'},
  {from: 16560, dur: 190, name: 'qr_ricota'},
  {from: 17590, dur: 190, name: 'qr_mozzarella'},
  {from: 18640, dur: 190, name: 'qr_suizo'},
  {from: 19720, dur: 190, name: 'qr_cabra'},
  {from: 20340, dur: 172, name: 'qr_requeson'},
  {from: 23900, dur: 172, name: 'qr_enjuague'},
  {from: 24420, dur: 180, name: 'qr_plato_verdura'},
];

// fotos b-roll: `card` = tarjeta de vidrio flotante 2.5D (objetos); sin card = full-bleed (planos del doctor)
const BROLL: {from: number; dur: number; img: string; caption?: string; kb?: number; card?: boolean; side?: 'left' | 'right'; accent?: string}[] = [
  {from: 520, dur: 172, img: 'qr_procesado.jpg', caption: 'Cuatro que están en su heladera', card: true, side: 'right', accent: BAS.no},
  {from: 2560, dur: 156, img: 'qr_dr_hook.jpg', caption: 'No le vengo a vender un milagro'},
  {from: 4720, dur: 160, img: 'qr_dr_sal.jpg', caption: 'La sal retiene agua'},
  {from: 5560, dur: 156, img: 'qr_analisis.jpg', caption: '"Baje la sal"', card: true, side: 'left', accent: BAS.aqua},
  {from: 6000, dur: 156, img: 'qr_huesos.jpg', caption: 'El fósforo de más', card: true, side: 'right', accent: BAS.amber},
  {from: 7480, dur: 168, img: 'qr_dr_etiqueta.jpg', caption: "Busque 'fosfato' en la etiqueta"},
  {from: 9060, dur: 168, img: 'qr_dr_procesado.jpg', caption: 'No es un queso: es un producto'},
  {from: 9400, dur: 156, img: 'qr_desayuno_feta.jpg', caption: 'La feta de cada mañana', card: true, side: 'left', accent: BAS.no},
  {from: 10380, dur: 156, img: 'qr_azul.jpg', caption: 'De los más salados que hay', card: true, side: 'right', accent: BAS.no},
  {from: 11600, dur: 156, img: 'qr_parmesano.jpg', caption: 'Sal y fósforo concentrados', card: true, side: 'left', accent: BAS.no},
  {from: 12800, dur: 156, img: 'qr_feta.jpg', caption: 'Una esponja de sodio', card: true, side: 'right', accent: BAS.no},
  {from: 13850, dur: 160, img: 'qr_plato_verdura.jpg', caption: 'No le dije "nunca más"', card: true, side: 'left', accent: BAS.aqua},
  {from: 14900, dur: 168, img: 'qr_dr_analisis.jpg', caption: 'Le pregunté por el desayuno'},
  {from: 16900, dur: 168, img: 'qr_dr_ricota.jpg', caption: 'Ricota en la tostada'},
  {from: 17150, dur: 156, img: 'qr_ricota.jpg', caption: 'Baja en sodio, proteína suave', card: true, side: 'left', accent: BAS.si},
  {from: 18040, dur: 160, img: 'qr_mozzarella.jpg', caption: 'Fresca, con pocas manos de industria', card: true, side: 'right', accent: BAS.si},
  {from: 19060, dur: 170, img: 'qr_dr_suizo.jpg', caption: 'De los más bajos en sodio'},
  {from: 19300, dur: 156, img: 'qr_suizo.jpg', caption: 'El secreto del nefrólogo', card: true, side: 'left', accent: BAS.si},
  {from: 20620, dur: 160, img: 'qr_cabra.jpg', caption: 'Suave, menos sodio', card: true, side: 'right', accent: BAS.si},
  {from: 21980, dur: 160, img: 'qr_dr_etiqueta.jpg', caption: 'Dele vuelta el paquete'},
  {from: 22450, dur: 156, img: 'qr_procesado.jpg', caption: 'Si la lista parece un shampoo…', card: true, side: 'right', accent: BAS.no},
  {from: 24750, dur: 168, img: 'qr_dr_plato.jpg', caption: 'Acompáñelo con verduras'},
  {from: 25920, dur: 168, img: 'qr_dr_analisis.jpg', caption: 'Acompaña a su médico, no lo reemplaza'},
  {from: 28260, dur: 168, img: 'qr_rinon_modelo.jpg', caption: 'De a poquito, en silencio', card: true, side: 'left', accent: BAS.aqua},
  {from: 28820, dur: 156, img: 'qr_suizo.jpg', caption: 'Cada feta que cambia por suizo', card: true, side: 'right', accent: BAS.si},
  {from: 29320, dur: 156, img: 'qr_plato_verdura.jpg', caption: 'Cada comida buena que elige', card: true, side: 'left', accent: BAS.si},
  {from: 29900, dur: 150, img: 'qr_dr_plato.jpg', caption: 'Coma rico, pero coma despierto'},
  {from: 30450, dur: 160, img: 'qr_ricota.jpg', caption: 'La guía, en la descripción', card: true, side: 'right', accent: BAS.aqua},
  {from: 30760, dur: 230, img: 'qr_rinon_modelo.jpg', caption: 'Cuide ese filtro maravilloso', card: true, side: 'left', accent: BAS.aqua},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 413, dur: 190, node: <KeyWord word="4 DAÑAN · 5 PROTEGEN" sub="después de los 60" color={BAS.aqua} />},
  {from: 1560, dur: 230, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: 4358, dur: 200, node: <KeyWord word="SODIO" sub="retiene agua, sube la presión" color={BAS.no} />},
  {from: 5976, dur: 200, node: <KeyWord word="FÓSFORO" sub="el que casi nadie nombra" color={BAS.amber} />},
  {from: 13954, dur: 200, node: <KeyWord word="EL GOTEO CONSTANTE" sub="no el gusto de una vez" color={BAS.amber} />},
  {from: 22368, dur: 220, node: <KeyWord word="BUSQUE: FOSFATO" sub="si está, déjelo en la góndola" color={BAS.no} />},
  {from: 23900, dur: 190, node: <KeyWord word="ENJUÁGUELO" sub="le saca la sal de la superficie" color={BAS.aqua} />},
  {from: 25126, dur: 210, node: <KeyWord word="Y TOME SU AGUA" sub="la mejor amiga del riñón" color={BAS.aqua} />},
  {from: 25850, dur: 240, node: <CautionChip text="Todo esto acompaña a su médico, no lo reemplaza" />},
  {from: 27514, dur: 240, node: <CautionChip text="¿Dos o más señales? pida un análisis" />},
  {from: 28188, dur: 220, node: <KeyWord word="DE A POQUITO" sub="pero cada elección suma a su favor" color={BAS.aqua} />},
  {from: 29964, dur: 520, node: <SubscribeCard />},
  {from: 30341, dur: 300, node: <KeyWord word="LA GUÍA · EN LA DESCRIPCIÓN" sub="con las porciones y la lista completa" color={BAS.aqua} />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 1886, name: 'deep-cinematic-impact-1.mp3', vol: 0.5},
  {at: 3338, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: 8237, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: 8720, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 9950, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 11160, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 12360, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 15521, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 16085, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: 16560, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 17590, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 18640, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 19720, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 20340, name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: 21091, name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.45},
  {at: 26863, name: 'deep-cinematic-impact-2.mp3', vol: 0.4},
  {at: 29964, name: 'px_sparkleClean.mp3', vol: 0.5},
];

export const MainQuesosRenal: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR — un solo OffthreadVideo en bucle y MUDO; el audio sale del master */}
      <OffthreadVideo src={staticFile(AVATAR_LOOP)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />

      {/* MASTER de audio (tramo1 = audio del avatar → lipsync real; después, cola Fish) */}
      <Audio src={staticFile('quesosrenal.wav')} />

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
