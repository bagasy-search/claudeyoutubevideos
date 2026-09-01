/**
 * Main_bastidates — "Los 3 Tés de la Mañana que Limpian sus Riñones (y 3 que Debe Evitar)".
 *
 * AVATAR PARCIAL: el creador grabó 6:18 (378.17s → hook + presentación + mecanismo + doña Marta +
 * jengibre + hibisco). Master de audio único: public/bastidates.wav = audio del avatar (tramo 1,
 * lipsync real) + 0.35s + cola locutada con Fish (voz clonada del PROPIO avatar). El avatar va en
 * BUCLE y MUDO (bastidates_opt.mp4, 985s): su primer play (0-378s) ES el avatar real, después loopea.
 * Anclado al ms con captions_bastidates.json (scripts/anchor_bastidates.mjs → bastidates_anchors.json).
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
import {ChapterScene, CHAPTER_CONFIGS} from './ChapterScene';
import {GuideCTAScene} from './GuideCTAScene';
import {RenalItemCard} from './RenalItemCard';
import {MatchWhip, WhipDir} from './MatchWhip';
import {FilterMechanismScene} from './scenes7/FilterMechanismScene';
import AJ from './bastidates_anchors.json';
import beats from './bastidates_beats.json';

export const TOTAL_BAS = 29562;
const AVATAR_LOOP = 'bastidates_opt.mp4';
const A = (k: string): number => (AJ as Record<string, {frame: number} | null>)[k]?.frame ?? 0;
const AC: Record<string, string> = {no: BAS.no, amber: BAS.amber, aqua: BAS.aqua, si: BAS.si};

/* ---------------- datos ---------------- */
const GOOD_CARDS = [
  {name: 'Jengibre', img: 'img/bas_jengibre_rodajas.jpg', tint: '#2FA96B'},
  {name: 'Hibisco', img: 'img/bas_hibisco_infusion.jpg', tint: '#2FA96B'},
  {name: 'Agua de cebada', img: 'img/bas_cebada_agua.jpg', tint: '#2FA96B'},
];
const GOOD_V = [
  {img: 'img/bas_jengibre_rodajas.jpg', name: 'Jengibre'},
  {img: 'img/bas_hibisco_infusion.jpg', name: 'Hibisco'},
  {img: 'img/bas_cebada_agua.jpg', name: 'Agua de cebada'},
];
const BAD_V = [
  {img: 'img/bas_botella_helado.jpg', name: 'Té helado en botella'},
  {img: 'img/bas_saquito.jpg', name: 'Té de sobre dulce'},
  {img: 'img/bas_detox_caja.jpg', name: 'Té detox'},
];
const THUMBS = ['img/bas_jengibre_rodajas.jpg', 'img/bas_hibisco_infusion.jpg', 'img/bas_cebada_agua.jpg'];

const sfxf = (n: string) => staticFile(`sfx/${n}`);

/* ---------------- CLIP (b-roll fullscreen, mudo) ---------------- */
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
  {from: A('dialisis'), dur: 300, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'Hoy no estamos ahí.']} breakAt={110} />},
  {from: A('mecanismo'), dur: 430, dir: 'left', node: <FilterMechanismScene />},
  {from: A('buenos'), dur: 420, dir: 'in', node: <RenalCarousel cards={GOOD_CARDS} reveals={[24, 130, 240]} introDur={40} kicker="En ayunas, sin azúcar" title="3 tés de la mañana" />},
  {from: A('ch_jengibre'), dur: 150, dir: 'in', node: <ChapterScene {...CHAPTER_CONFIGS.jengibre} number="1" hero="img/bas_jengibre_raiz.jpg" subtitle="desinflama y mejora la circulación" />},
  {from: A('ch_hibisco'), dur: 150, dir: 'in', node: <ChapterScene {...CHAPTER_CONFIGS.hibisco} number="2" hero="img/bas_hibisco_flores.jpg" subtitle="la flor que acompaña la presión" />},
  {from: A('ch_cebada'), dur: 150, dir: 'in', node: <ChapterScene {...CHAPTER_CONFIGS.cebada} number="3" hero="img/bas_cebada_granos.jpg" subtitle="el diurético suave de la abuela" />},
  {from: A('malo_helado'), dur: 130, dir: 'in', node: <RenalItemCard n="1" name="Té helado en botella" note="Azúcar con gusto a té" img="img/bas_botella_helado.jpg" accent={BAS.no} side="right" />},
  {from: A('malo_sobre'), dur: 130, dir: 'in', node: <RenalItemCard n="2" name="Té de sobre azucarado" note="La misma trampa, casera" img="img/bas_saquito.jpg" accent={BAS.no} side="left" />},
  {from: A('malo_detox'), dur: 130, dir: 'in', node: <RenalItemCard n="3" name="Té detox / adelgazante" note="Deshidrata y castiga el riñón" img="img/bas_detox_caja.jpg" accent={BAS.no} side="right" />},
  {from: A('regla'), dur: 520, dir: 'up', node: <AlertSignalsScene title="Antes de tomar cualquier infusión" signals={['¿Tiene azúcar agregada, y mucha?', '¿Promete milagros en tres días?', '¿La puedo hacer yo con algo que reconozco?']} footer="Si duda, mejor un vaso de agua simple" />},
  {from: A('creatinina'), dur: 300, dir: 'in', node: <CreatininaScene from={1.5} to={1.1} caption="Creatinina" subcaption="un semáforo en amarillo, no en rojo" />},
  {from: A('repaso'), dur: 520, dir: 'up', node: <FoodVerdictScene title="Sus riñones cada mañana" good={GOOD_V} bad={BAD_V} />},
  {from: A('cta_guide'), dur: 360, dir: 'in', node: <GuideCTAScene kicker="Su rutina de la mañana" title="Las medidas y la guía" subtitle="se las dejo en la descripción" thumbs={THUMBS} />},
];

const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 120, dur: 200, node: <KeyWord word="3 LO LIMPIAN · 3 A EVITAR" sub="sus riñones, cada mañana" color={BAS.aqua} />},
  {from: A('present'), dur: 240, node: <RenalLowerThird name="Dr. Emilio Bastida" role="Nefrólogo · Salud Renal" tag="RIÑONES 60+" focusX={0.5} />},
  {from: A('malos_intro'), dur: 200, node: <KeyWord word="PARECEN SANOS" sub="y no lo son" color={BAS.no} />},
  {from: A('agua_reina'), dur: 210, node: <KeyWord word="EL AGUA ES LA REINA" sub="más que cualquier té" color={BAS.aqua} />},
  {from: A('creatinina') + 300, dur: 230, node: <CautionChip text="Acompaña a su médico, no lo reemplaza" />},
  {from: A('subscribe'), dur: 420, node: <SubscribeCard />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: A('dialisis'), name: 'deep-cinematic-impact-1.mp3', vol: 0.5},
  {at: A('mecanismo'), name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: A('buenos'), name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.5},
  {at: A('ch_jengibre'), name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: A('ch_hibisco'), name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: A('ch_cebada'), name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: A('malo_helado'), name: 'px_sparkleClean.mp3', vol: 0.45},
  {at: A('malo_sobre'), name: 'px_sparkleClean.mp3', vol: 0.45},
  {at: A('malo_detox'), name: 'deep-cinematic-impact-2.mp3', vol: 0.4},
  {at: A('regla'), name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.45},
  {at: A('creatinina'), name: 'px_sparkleClean.mp3', vol: 0.5},
  {at: A('repaso'), name: 'ksjsbwuil-whoosh3-481204.mp3', vol: 0.45},
  {at: A('subscribe'), name: 'px_sparkleClean.mp3', vol: 0.5},
];

export const MainBastidates: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR — un solo OffthreadVideo en bucle y MUDO; el audio sale del master */}
      <OffthreadVideo src={staticFile(AVATAR_LOOP)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />

      {/* MASTER de audio (tramo1 = audio del avatar → lipsync real; después, cola Fish) */}
      <Audio src={staticFile('bastidates.wav')} />

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

      {/* CLIPS animados (agnes + stock) */}
      {beats.clips.map((c, i) => (
        <Sequence key={`cl${i}`} from={c.from} durationInFrames={c.dur}>
          <MatchWhip dur={c.dur} dir="in"><Clip name={c.name} dur={c.dur} /></MatchWhip>
        </Sequence>
      ))}

      {/* B-ROLL: card = tarjeta 2.5D (objetos) · sin card = full-bleed (doctor/marta) */}
      {beats.broll.map((b, i) => (
        <Sequence key={`br${i}`} from={b.from} durationInFrames={b.dur}>
          {b.card ? (
            <MatchWhip dur={b.dur} dir={b.side === 'left' ? 'left' : 'right'}>
              <BRollCard img={b.img} dur={b.dur} side={(b.side as 'left' | 'right') ?? 'right'} accent={AC[b.accent] ?? BAS.aqua} />
            </MatchWhip>
          ) : (
            <BRoll img={b.img} dur={b.dur} kb={1} />
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
