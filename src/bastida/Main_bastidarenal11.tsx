/**
 * Main_bastidarenal11 — MONTAJE del video #11 "Nefrólogo Revela: 10 Alimentos Comunes que
 * Destruyen sus Riñones". AVATAR PARCIAL: el creador grabó la 1ª parte (10:24 → renal/avatar11.mp4,
 * 30fps CFR, cubre hook→mecanismo→#10-#4). La cola (#3→cierre) se locutó con Fish clonando la voz
 * del PROPIO avatar; ahí el avatar queda EN BUCLE (mudo). El AUDIO FINAL es un solo master
 * (public/bastidarenal11_fish.wav = avatar real + cola + bed) que el FARM muxea sobre el video →
 * el avatar va MUDO en la comp y NO hay tags de Audio/SFX (el stitch descarta el audio de los chunks).
 * Anclado al ms con captions_bastidarenal11.json (_v3/anchor_bas11.py → _v3/bas11_frames.json).
 * Cuenta regresiva 10→1 de alimentos que DAÑAN: lado NO/rojo domina, cierre verde-esperanza.
 */
import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, BRoll, SideIllustration, PresenterIntro} from './BastidaFX';
import {RenalLowerThird} from './BastidaKit';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {QrCtaScene} from './QrCtaScene';
import {FilterMechanismScene} from './scenes7/FilterMechanismScene';
import {RuleScene} from './scenes7/RuleScene';
import {MatchWhip, WhipDir} from './MatchWhip';

export const TOTAL_R11 = 31479; // 1049.298s × 30
const AVATAR_FRAMES = 18723;    // 624.085s × 30 (tramo 1, su propio lipsync — mudo, audio del master)
const LOOP_FROM = 9000;         // el bucle arranca en un tramo neutro del avatar

/* ================= inline components (clonados/adaptados del kit del canal) ================= */

/** BClip — clip i2v (agnes) a pantalla completa, mudo, con grade navy + caption documental. */
const BClip: React.FC<{clip: string; caption?: string; dur: number}> = ({clip, caption, dur}) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const out = interpolate(f, [dur - 8, dur], [1, 0], {extrapolateLeft: 'clamp'});
  const k = 1 + (f / dur) * 0.05;
  return (
    <AbsoluteFill style={{opacity: Math.min(inn, out)}}>
      <OffthreadVideo src={staticFile(`broll/${clip}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${k})`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${rgba(BAS.bgDeep, 0.15)}, ${rgba(BAS.bgDeep, 0.42)})`, mixBlendMode: 'multiply'}} />
      {caption && (
        <div style={{position: 'absolute', left: 60, bottom: 70, background: rgba('#04121A', 0.72), borderRadius: 12, padding: '12px 26px', borderLeft: `5px solid ${BAS.aqua}`, fontFamily: FONT_SANS, fontSize: 38, fontWeight: 700, color: '#F4F1E9', boxShadow: CARD_SHADOW, maxWidth: 900, opacity: Math.min(inn, out)}}>{caption}</div>
      )}
    </AbsoluteFill>
  );
};

/** FoodStrike — el reveal firma de cada alimento que DAÑA: número acrílico + tarjeta de vidrio con
 * la foto real + tachado rojo diagonal + nombre y el porqué. 2.5D con push-in. */
const FoodStrike: React.FC<{n: string; name: string; harm: string; img: string}> = ({n, name, harm, img}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130, mass: 0.9}});
  const card = spring({frame: f - 10, fps, config: {damping: 140}});
  const slash = spring({frame: f - 26, fps, config: {damping: 60, mass: 0.6}});
  const txt = spring({frame: f - 34, fps, config: {damping: 130}});
  const push = 1 + p * 0.04;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 34% 30%, ${rgba(BAS.bgPanel, 0.9)}, ${rgba(BAS.bgDeep, 0.98)})`, perspective: 1200}}>
      {/* número acrílico gigante detrás */}
      <div style={{position: 'absolute', left: '4%', top: '50%', transform: `translateY(-50%) translateZ(-140px) scale(${interpolate(p, [0, 1], [0.85, 1])})`, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 560, lineHeight: 0.8, color: rgba(BAS.no, 0.16), textShadow: `0 0 80px ${rgba(BAS.no, 0.2)}`, opacity: p}}>{n}</div>
      {/* tarjeta de vidrio con la foto */}
      <div style={{position: 'absolute', right: '8%', top: '50%', width: 760, height: 500, transform: `translateY(-50%) translateZ(60px) scale(${interpolate(card, [0, 1], [0.9, 1]) * push}) rotate(${interpolate(card, [0, 1], [3, 1.5])}deg)`, borderRadius: 26, overflow: 'hidden', border: `1px solid ${rgba('#ffffff', 0.14)}`, boxShadow: `0 40px 90px rgba(0,0,0,0.6), inset 0 1px 0 ${rgba('#ffffff', 0.18)}`, opacity: card}}>
        <img src={staticFile(`img/${img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + f / 400})`}} />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(150deg, transparent 40%, ${rgba(BAS.no, 0.28)} 100%)`}} />
        {/* tachado rojo diagonal */}
        <div style={{position: 'absolute', left: '-6%', top: '48%', width: '112%', height: 14, background: BAS.no, transformOrigin: 'center', transform: `rotate(-16deg) scaleX(${slash})`, boxShadow: `0 0 26px ${rgba(BAS.no, 0.7)}`, borderRadius: 8}} />
      </div>
      {/* nombre + porqué */}
      <div style={{position: 'absolute', left: '7%', bottom: '16%', opacity: txt, transform: `translateY(${interpolate(txt, [0, 1], [30, 0])}px)`, maxWidth: 720}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
          <div style={{width: 64, height: 64, borderRadius: '50%', background: BAS.no, color: BAS.onNo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, boxShadow: `0 12px 30px ${rgba(BAS.no, 0.5)}`}}>✕</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 800, letterSpacing: 4, color: BAS.no}}>Nº {n} · DAÑA SUS RIÑONES</div>
        </div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 78, fontWeight: 800, color: '#F4F1E9', lineHeight: 1.02, textShadow: '0 6px 26px rgba(0,0,0,0.6)'}}>{name}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, color: rgba('#FFD9D6', 0.94), marginTop: 8}}>{harm}</div>
      </div>
    </AbsoluteFill>
  );
};

const KeyWord: React.FC<{word: string; sub?: string; color?: string}> = ({word, sub, color = BAS.amber}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 120, mass: 0.8}});
  const glow = 0.4 + Math.sin((f / fps) * Math.PI * 2) * 0.3;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.82, 1])})`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 132, fontWeight: 800, letterSpacing: 3, color, textShadow: `0 0 ${30 + glow * 40}px ${rgba(color, 0.6)}, 0 8px 30px rgba(0,0,0,0.65)`}}>{word}</div>
        {sub && <div style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, color: '#EAF2F4', marginTop: 6, textShadow: '0 3px 14px rgba(0,0,0,0.75)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

const Lower: React.FC<{y?: number; k?: number; children: React.ReactNode}> = ({y = 120, k = 0.86, children}) => (
  <AbsoluteFill style={{transform: `translateY(${y}px) scale(${k})`, transformOrigin: '50% 100%'}}>{children}</AbsoluteFill>
);

const StatTag: React.FC<{a: string; b: string; note?: string}> = ({a, b, note}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  const bIn = spring({frame: f - 14, fps, config: {damping: 120}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 108, fontWeight: 800, color: BAS.no, textShadow: '0 6px 24px rgba(0,0,0,0.65)'}}>{a}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 60, fontWeight: 800, color: '#EAF2F4'}}>→</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 108, fontWeight: 800, color: BAS.no, textShadow: `0 0 30px ${rgba(BAS.no, 0.5)}, 0 6px 24px rgba(0,0,0,0.65)`, transform: `scale(${interpolate(bIn, [0, 1], [0.7, 1])})`, opacity: bIn}}>{b}</div>
      </div>
      {note && <div style={{position: 'absolute', bottom: '28%', background: rgba('#04121A', 0.82), borderRadius: 999, padding: '10px 28px', border: `1px solid ${rgba(BAS.aqua, 0.35)}`, fontFamily: FONT_SANS, fontSize: 36, fontWeight: 800, letterSpacing: 2, color: '#F4F1E9', opacity: bIn, boxShadow: '0 14px 30px rgba(0,0,0,0.5)'}}>{note.toUpperCase()}</div>}
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

/* ================= datos ================= */
const FOODS = [
  {n: '10', name: 'Fiambres y embutidos', harm: 'Sodio + fósforo AÑADIDO', img: 'bas11_fiambre_platter', at: 5563},
  {n: '9', name: 'Gaseosas oscuras', harm: 'Ácido fosfórico líquido', img: 'bas11_cola_glass', at: 7613},
  {n: '8', name: 'Caldo en cubito', harm: 'Medio día de sal en uno solo', img: 'bas11_cubito_pot', at: 9403},
  {n: '7', name: 'Quesos duros', harm: 'Concentra sodio y fósforo', img: 'bas11_queso_rallado', at: 12055},
  {n: '6', name: 'Carne roja en exceso', harm: 'Urea que agota el filtro', img: 'bas11_carne_asado', at: 13230},
  {n: '5', name: 'Enlatados y conservas', harm: 'Salmuera: pura sal', img: 'bas11_enlatados_row', at: 15247},
  {n: '4', name: 'Pan blanco y azúcar', harm: 'El camino a la diabetes', img: 'bas11_pan_facturas', at: 16961},
  {n: '3', name: 'Snacks salados', harm: 'Sal + grasa que inflama', img: 'bas11_snacks_bowl', at: 18842},
  {n: '2', name: 'Alcohol', harm: 'Deshidrata y sube la presión', img: 'bas11_alcohol_mesa', at: 20563},
  {n: '1', name: 'La sal escondida', harm: 'El 80% viene escondida', img: 'bas11_salero', at: 22342},
];

const GOOD_RECAP = [
  {img: 'img/bas11_especias_board.jpg', name: 'Hierbas y especias'},
  {img: 'img/bas11_frutos_secos.jpg', name: 'Frutos secos sin sal'},
  {img: 'img/bas11_vaso_agua.jpg', name: 'Agua, siempre agua'},
];
const BAD_RECAP = [
  {img: 'img/bas11_salero.jpg', name: 'La sal escondida'},
  {img: 'img/bas11_cola_glass.jpg', name: 'Gaseosa oscura'},
  {img: 'img/bas11_cubito_pot.jpg', name: 'Caldo en cubito'},
];

/* ================= DEPTH (escenas de profundidad ancladas al ms) ================= */
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  // HOOK — los peores alimentos, bloqueados en un anillo: ¿cuáles son?
  {from: 2, dur: 780, dir: 'in', node: <RenalCarousel cards={[{name: 'Fiambre', img: 'img/bas11_fiambre_platter.jpg', tint: '#D64541'}, {name: 'Gaseosa', img: 'img/bas11_cola_glass.jpg', tint: '#D64541'}, {name: 'Caldo en cubito', img: 'img/bas11_cubito_pot.jpg', tint: '#D64541'}, {name: 'Snacks', img: 'img/bas11_snacks_bowl.jpg', tint: '#D64541'}, {name: 'La sal', img: 'img/bas11_salero.jpg', tint: '#D64541'}]} reveals={[70, 150, 230, 310]} teaseIndex={4} introDur={40} kicker="Salud renal · 10 alimentos" title="¿Cuáles destruyen sus riñones?" />},
  // INTRO — presentación del doctor
  {from: 833, dur: 300, dir: 'up', node: <PresenterIntro name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" kicker="30 años cuidando riñones" img="renal/bastida_cutout.png" />},
  // MECANISMO — el riñón es un colador que se tapa
  {from: 2750, dur: 470, dir: 'left', node: <FilterMechanismScene />},
  // 10 → 1 alimentos que DAÑAN
  ...FOODS.map((fd, i) => ({from: fd.at, dur: 200, dir: (i % 2 ? 'left' : 'right') as WhipDir, node: <FoodStrike n={fd.n} name={fd.name} harm={fd.harm} img={fd.img} />})),
  // #8 — las especias reemplazan al cubito (lado POSITIVO, verde)
  {from: 11455, dur: 260, dir: 'in', node: <RuleScene kicker="En vez del cubito" question="¿Cómo le doy gusto sin sal?" answer="Ajo, cebolla, pimentón, laurel" note="La cocina de la abuela cuidaba el riñón sin saberlo." img="img/bas11_especias_board.jpg" imgSide="left" accent={BAS.si} />},
  // #6 — la regla de la palma
  {from: 15108, dur: 250, dir: 'right', node: <RuleScene kicker="La regla de oro" question="¿Cuánta carne por vez?" answer="LA PALMA, NO EL PLATO" note="Del tamaño de su palma, y no todos los días." img="img/bas11_carne_palm.jpg" imgSide="right" accent={BAS.amber} />},
  // #4 — el azúcar quema el filtro → diabetes → diálisis
  {from: 17863, dur: 240, dir: 'in', node: <CreatininaScene from={1.0} to={2.4} caption="Azúcar alta, sostenida" subcaption="quema los filtros desde adentro" />},
  // RESPIRO — miedo → calma
  {from: 24864, dur: 300, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={110} />},
  // SEÑALES — las 5 señales de alerta
  {from: 25908, dur: 760, dir: 'up', node: <AlertSignalsScene title="¿Sus riñones ya piden ayuda?" signals={['Hinchazón: tobillos, párpados, el anillo', 'Orina espumosa que tarda en irse', 'Cansancio que no se arregla durmiendo', 'Orinar mucho de noche', 'Picazón en la piel, con mal aliento metálico']} footer="Si reconoce 2 o más, pídale a su médico creatinina y orina" />},
  // ESPERANZA — la aguja de creatinina AFLOJA (pago emocional)
  {from: 29105, dur: 300, dir: 'in', node: <CreatininaScene from={2.3} to={1.4} caption="Creatinina" subcaption="se estabiliza cuando le saca el peso" />},
  // CTA — el QR y cómo escanearlo (bajado para no tapar la boca)
  {from: 29928, dur: 700, dir: 'up', node: <Lower y={130} k={0.86}><QrCtaScene qr="renal/bas_qr_bastida.png" kicker="Dr. Bastida · Salud renal" title="Su guía renal completa" steps={['Abra la cámara de su teléfono', 'Apunte al código de la pantalla', 'Toque el aviso que aparece arriba']} note="También en la descripción, es el primer enlace" /></Lower>},
  // RECAP SÍ / NO
  {from: 30300, dur: 450, dir: 'left', node: <FoodVerdictScene title="Su riñón: cámbielo por esto" good={GOOD_RECAP} bad={BAD_RECAP} />},
];

/* ================= BROLL (cutaways: clips i2v + fotos, anclados a sub-beats) ================= */
type Cut = {from: number; dur: number; asset: string; caption?: string; clip?: boolean};
const BROLL: Cut[] = [
  // mecanismo / órgano
  {from: 1733, dur: 150, asset: 'bas11_kidney_hero', caption: 'Dos filtros del tamaño de un puño', clip: true},
  {from: 2000, dur: 150, asset: 'bas11_doc_intro', caption: 'Un análisis que no esperaba'},
  {from: 3200, dur: 160, asset: 'bas11_colador_filter', caption: 'Un colador que se tapa', clip: true},
  {from: 3600, dur: 150, asset: 'bas11_blood_filter', caption: 'Toda su sangre, muchas veces por día', clip: true},
  {from: 4262, dur: 170, asset: 'bas11_doc_kidney', caption: 'No es un detalle: es la base'},
  {from: 4700, dur: 160, asset: 'bas11_kidney_hero', caption: 'Calladitos, sin pedir nada'},
  // #10 fiambre
  {from: 5850, dur: 170, asset: 'bas11_doc_fiambre', caption: 'La fetita del sándwich'},
  {from: 6730, dur: 160, asset: 'bas11_fosfatos_label', caption: '“Fosfatos”: casi nadie lo lee'},
  {from: 7116, dur: 170, asset: 'bas11_huesos_frag', caption: 'Se lo roba a sus huesos'},
  // #9 cola
  {from: 7900, dur: 160, asset: 'bas11_doc_cola', caption: '¿La light me salva?'},
  {from: 8230, dur: 170, asset: 'bas11_cola_bottles', caption: 'El mismo ácido fosfórico'},
  // #8 cubito
  {from: 9650, dur: 160, asset: 'bas11_doc_cubito', caption: 'Un cubito, medio día de sal'},
  {from: 10778, dur: 170, asset: 'bas11_presion_arm', caption: 'Le sube la presión'},
  {from: 10200, dur: 150, asset: 'bas11_sopa_sobre', caption: 'Sopas de sobre'},
  {from: 11720, dur: 160, asset: 'bas11_doc_herbs', caption: 'Ajo, cebolla, laurel'},
  // #7 queso
  {from: 12300, dur: 160, asset: 'bas11_doc_queso', caption: 'A quién no le gusta el queso'},
  {from: 12700, dur: 160, asset: 'bas11_queso_wheel', caption: 'Cuanto más duro, más concentra'},
  // #6 carne
  {from: 13500, dur: 160, asset: 'bas11_doc_carne', caption: 'La palma, no el plato'},
  {from: 13231, dur: 150, asset: 'bas11_carne_asado', caption: 'El plato desbordado'},
  // #5 enlatados
  {from: 15450, dur: 160, asset: 'bas11_doc_lata', caption: 'Enjuáguelo bajo la canilla', clip: true},
  {from: 16392, dur: 170, asset: 'bas11_rinse_can', caption: 'Le saca parte del sodio', clip: true},
  {from: 15800, dur: 150, asset: 'bas11_pickles_jar', caption: 'Todo lo que dura meses'},
  // #4 pan / azúcar
  {from: 17200, dur: 160, asset: 'bas11_doc_pan', caption: 'Azúcar disfrazada'},
  {from: 17500, dur: 160, asset: 'bas11_azucar_spoon', caption: 'La glucosa se dispara', clip: true},
  {from: 18300, dur: 170, asset: 'bas11_diabetes_glucose', caption: 'La causa Nº1 de diálisis: la diabetes'},
  // #3 snacks (COLA — avatar en bucle)
  {from: 19150, dur: 160, asset: 'bas11_doc_snacks', caption: 'Nadie come una sola papita'},
  {from: 19600, dur: 160, asset: 'bas11_arteria_inflamada', caption: 'Arterias que se inflaman'},
  {from: 20405, dur: 170, asset: 'bas11_frutos_secos', caption: 'Cámbielo por frutos secos sin sal'},
  // #2 alcohol
  {from: 20850, dur: 160, asset: 'bas11_doc_alcohol', caption: 'El hábito de todos los días'},
  {from: 21859, dur: 170, asset: 'bas11_deshidratacion', caption: 'Le saca el balde de agua', clip: true},
  // #1 sal
  {from: 22627, dur: 170, asset: 'bas11_doc_sal', caption: 'El rey silencioso'},
  {from: 23200, dur: 200, asset: 'bas11_sal_escondida', caption: 'El 80% ya venía adentro'},
  // señales
  {from: 26311, dur: 165, asset: 'bas11_tobillos_hinchados', caption: 'Hinchazón en los tobillos'},
  {from: 26630, dur: 160, asset: 'bas11_orina_espuma', caption: 'Espuma que tarda en irse'},
  {from: 26964, dur: 160, asset: 'bas11_cansancio_senior', caption: 'Un cansancio que no se va', clip: true},
  {from: 27400, dur: 150, asset: 'bas11_orinar_noche', caption: 'Levantarse dos, tres veces'},
  {from: 27700, dur: 150, asset: 'bas11_picazon_piel', caption: 'Picazón sin motivo', clip: true},
  {from: 28087, dur: 170, asset: 'bas11_doc_analisis', caption: 'Creatinina y orina completa'},
  {from: 28500, dur: 160, asset: 'bas11_lab_mejor', caption: 'A tiempo, casi todo se frena'},
  // esperanza / cierre
  {from: 28778, dur: 170, asset: 'bas11_senior_caminando', caption: 'El riñón es agradecido', clip: true},
  {from: 29500, dur: 150, asset: 'bas11_vaso_agua', caption: 'Empiece por el vaso de agua', clip: true},
  {from: 30820, dur: 200, asset: 'bas11_doc_close', caption: 'Cuídelos: son los únicos dos que tiene'},
];

/* ================= OVERLAY (palabras clave + tags sobre el avatar) ================= */
const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 1100, dur: 200, node: <KeyWord word="EN SILENCIO" sub="el riñón no se queja" color={BAS.amber} />},
  {from: 3253, dur: 230, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: 6900, dur: 200, node: <SideIllustration img="img/bas11_huesos_frag.jpg" side="right" caption="Roba calcio del hueso" dur={200} size={360} />},
  {from: 10778, dur: 210, node: <StatTag a="1 cubito" b="½ día" note="de toda su sal" />},
  {from: 11455, dur: 210, node: <KeyWord word="ESPECIAS, NO SAL" sub="ajo, cebolla, laurel" color={BAS.si} />},
  {from: 15108, dur: 220, node: <KeyWord word="LA PALMA" sub="no el plato" color={BAS.amber} />},
  {from: 16392, dur: 200, node: <KeyWord word="ENJUÁGUELO" sub="le saca la sal de la superficie" color={BAS.si} />},
  {from: 17863, dur: 220, node: <KeyWord word="LA DIABETES" sub="la Nº1 que manda a diálisis" color={BAS.no} />},
  {from: 20405, dur: 210, node: <KeyWord word="FRUTOS SECOS" sub="sin sal, esos sí" color={BAS.si} />},
  {from: 22855, dur: 260, node: <StatTag a="20%" b="80%" note="la sal escondida que no puso usted" />},
  {from: 25258, dur: 220, node: <KeyWord word="PILOTO AUTOMÁTICO" sub="sáquelo de la costumbre" color={BAS.aqua} />},
  {from: 29635, dur: 230, node: <CautionChip text="¿Dos o más señales? pida un análisis" />},
  {from: 30980, dur: 460, node: <SubscribeCard />},
];

export const MainBastidaRenal11: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR tramo 1 — mudo (el audio lo pone el master que muxea el farm) */}
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile('renal/avatar11.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Sequence>
      {/* AVATAR tramo 2 — EN BUCLE y mudo (arranca en un tramo neutro) */}
      <Sequence from={AVATAR_FRAMES} durationInFrames={TOTAL_R11 - AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile('renal/avatar11.mp4')} startFrom={LOOP_FROM} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Sequence>

      {/* grade teal-navy + viñeta fría sobre el avatar */}
      <AbsoluteFill style={{background: `linear-gradient(160deg, ${rgba(BAS.bgPanel, 0.42)}, ${rgba(BAS.bgDeep, 0.5)})`, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 44%, transparent 55%, ${rgba(BAS.bgEdge, 0.5)} 100%)`, pointerEvents: 'none'}} />

      {/* MARCA BASTIDA (tapa cualquier watermark del avatar) */}
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
          {b.clip ? <BClip clip={b.asset} caption={b.caption} dur={b.dur} /> : <BRoll img={b.asset} caption={b.caption} dur={b.dur} kb={1} />}
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
    </AbsoluteFill>
  );
};
