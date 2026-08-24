/**
 * Main_bastida6 — MONTAJE del video #6 "3 Semillas que Elevan su Creatinina Sin que lo Sepa (y 3 que la Bajan)".
 *
 * ⚠️ AVATAR PARCIAL: el creador grabó 9:16.6 (16.697 frames) de un guion de 22:50. El master de audio es
 * `public/bastidarenal6.wav` = audio real del avatar + cola clonada en Fish (voz `bastida6`, referencia
 * sacada del propio avatar en 8:15). Por eso, igual que en valeriapresion:
 *    · el avatar va en <Loop> y MUTEADO  · el audio sale de un <Audio> aparte
 * El lipsync calza hasta la costura; de ahí en más el avatar es el fondo garantizado (regla anti-hueco)
 * y la pantalla la llevan los componentes, las láminas y el b-roll.
 *
 * Villano = LA CONCENTRACIÓN Y EL PUÑADO ("una semilla es una despensa apretada en un grano").
 * Giro = ZAPALLO/pepitas, "la de la próstata", top mundial en fósforo (cierra el loop del cold-open).
 * Embudo = las láminas se presentan como PÁGINAS DE LA GUÍA (doctorbastida.com, QR en pantalla).
 *
 * Anclado al ms con public/captions_bastidarenal6.json. B-roll generado por scripts/build_bastida6.mjs.
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Loop, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';
import {RenalCarousel} from './BastidaCarousel';
import {FearToCalm, BRoll, BClip, SideIllustration} from './BastidaFX';
import {ChapterScene, CHAPTER_CONFIGS} from './ChapterScene';
import {CreatininaScene} from './CreatininaScene';
import {FoodVerdictScene} from './FoodVerdictScene';
import {AlertSignalsScene} from './AlertSignalsScene';
import {QrCtaScene} from './QrCtaScene';
import {TestimonialScene} from './TestimonialScene';
import {MatchWhip, WhipDir} from './MatchWhip';
import {LaminaSeguras, SemaforoScene, ManoVsCuchara, OxalatoScene, SemillaDespensa} from './Bastida6Kit';
import BEATS6 from './beats6.json';

export const TOTAL_6 = 41115;
export const SEAM_6 = 16697; // fin del avatar real (9:16.6)

const CARDS = [
  {name: 'Lino', img: 'img/bas6_lino.png', tint: '#2FA96B'},
  {name: 'Chía', img: 'img/bas6_chia.png', tint: '#2FA96B'},
  {name: 'Cilantro', img: 'img/bas6_cilantro.png', tint: '#2FA96B'},
  {name: 'Girasol', img: 'img/bas6_girasol.png', tint: '#D64541'},
  {name: 'Sésamo', img: 'img/bas6_sesamo.png', tint: '#D64541'},
  {name: 'Zapallo', img: 'img/bas6_zapallo.png', tint: '#D64541'},
];
const VERD: ('si' | 'no')[] = ['si', 'si', 'si', 'no', 'no', 'no'];
const GOOD = [
  {img: 'img/bas6_lino.png', name: 'Lino molido'},
  {img: 'img/bas6_chia.png', name: 'Chía remojada'},
  {img: 'img/bas6_cilantro.png', name: 'Agua de cilantro'},
];
const BAD = [
  {img: 'img/bas6_girasol.png', name: 'Girasol salado'},
  {img: 'img/bas6_sesamo.png', name: 'Sésamo / tahini'},
  {img: 'img/bas6_zapallo.png', name: 'Zapallo (pepitas)'},
];
const sfxf = (n: string) => staticFile(`renal/sfx/bas_sfx_${n}.mp3`);

/* ---------------- helpers inline (mismos que #4/#5, sin dependencias nuevas) ---------------- */
const CautionChip: React.FC<{text?: string}> = ({text = 'Consulte a su médico'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 140}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 96}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: BAS.card, borderRadius: 999, padding: '14px 30px', borderLeft: `6px solid ${BAS.amber}`, boxShadow: '0 22px 46px rgba(0,0,0,0.45)', opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`}}>
        <span style={{fontSize: 30, color: BAS.amber}}>⚠</span>
        <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: BAS.brand}}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

const KeyWord: React.FC<{word: string; sub?: string}> = ({word, sub}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 120, mass: 0.8}});
  const glow = 0.4 + Math.sin((f / fps) * Math.PI * 2) * 0.3;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 168, fontWeight: 800, letterSpacing: 4, color: BAS.amber, textShadow: `0 0 ${30 + glow * 40}px ${rgba(BAS.amber, 0.6)}, 0 8px 30px rgba(0,0,0,0.6)`}}>{word}</div>
        {sub && <div style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 600, color: '#EAF2F4', marginTop: 4, textShadow: '0 3px 14px rgba(0,0,0,0.7)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

const TraidoraTag: React.FC<{name: string; reason: string}> = ({name, reason}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  const stamp = spring({frame: f - 6, fps, config: {damping: 90, mass: 0.6}});
  return (
    <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 0 96px 80px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`}}>
        <div style={{width: 96, height: 96, borderRadius: '50%', background: BAS.no, color: BAS.onNo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, boxShadow: `0 14px 34px ${rgba(BAS.no, 0.5)}`, transform: `scale(${interpolate(stamp, [0, 1], [1.6, 1])}) rotate(${interpolate(stamp, [0, 1], [-14, -6])}deg)`}}>✕</div>
        <div style={{background: rgba('#1a0b0b', 0.72), borderRadius: 18, padding: '16px 30px', borderLeft: `6px solid ${BAS.no}`, boxShadow: '0 20px 44px rgba(0,0,0,0.5)'}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 54, fontWeight: 700, color: '#FFF1F0'}}>{name}</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 600, color: rgba('#FFD9D6', 0.9)}}>{reason}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const StatTag: React.FC<{a: string; b: string; note?: string}> = ({a, b, note}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 130}});
  const bIn = spring({frame: f - 14, fps, config: {damping: 120}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 92, fontWeight: 800, color: BAS.no, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>{a}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 70, fontWeight: 800, color: '#EAF2F4'}}>≈</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 92, fontWeight: 800, color: BAS.no, textShadow: `0 0 30px ${rgba(BAS.no, 0.5)}, 0 6px 24px rgba(0,0,0,0.6)`, transform: `scale(${interpolate(bIn, [0, 1], [0.7, 1])})`, opacity: bIn}}>{b}</div>
      </div>
      {note && <div style={{position: 'absolute', bottom: '32%', fontFamily: FONT_SANS, fontSize: 38, fontWeight: 700, letterSpacing: 2, color: rgba('#EAF2F4', 0.85), opacity: bIn, textAlign: 'center'}}>{note.toUpperCase()}</div>}
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

/* ===================== ESCENAS DE PROFUNDIDAD (mismos frames que _v3/bastidarenal6_depth.json) ===================== */
const DEPTH: {from: number; dur: number; dir?: WhipDir; node: React.ReactNode}[] = [
  // COLD OPEN — 6 semillas bloqueadas; el zapallo pulsa: ¿cuál es la peor?
  {from: 0, dur: 1000, dir: 'in', node: <RenalCarousel cards={CARDS} reveals={[]} teaseIndex={5} introDur={40} kicker="Creatinina · Salud renal" title="6 semillas · ¿cuál es la peor?" />},
  // "aparece una palabra, y es fea: DIÁLISIS" → respire
  {from: 2537, dur: 320, dir: 'up', node: <FearToCalm word="DIÁLISIS" calm={['Respire.', 'No estamos ahí.']} breakAt={110} />},
  // creatinina = basura que se queda → la aguja SUBE
  {from: 4134, dur: 210, dir: 'in', node: <CreatininaScene from={1.1} to={2.5} caption="Creatinina" subcaption="el desecho que no sale" />},
  // ★ LA ANALOGÍA MADRE: una semilla es una despensa apretada
  {from: 5306, dur: 280, dir: 'in', node: <SemillaDespensa img="img/bas6_lino.png" dur={280} />},
  // LAS 3 SEGURAS — openers 2.5D
  {from: 9116, dur: 130, dir: 'right', node: <ChapterScene {...CHAPTER_CONFIGS.lino} />},
  {from: 10775, dur: 130, dir: 'left', node: <ChapterScene {...CHAPTER_CONFIGS.chia} />},
  {from: 12316, dur: 130, dir: 'right', node: <ChapterScene {...CHAPTER_CONFIGS.cilantro} />},
  // ★ LÁMINA A — "esto es una página de la guía" (hold largo, el guion lo pide)
  {from: 15605, dur: 660, dir: 'up', node: <LaminaSeguras dur={660} />},
  // EL GIRO — el anillo se abre en SÍ/NO
  {from: 17579, dur: 500, dir: 'in', node: <RenalCarousel cards={CARDS} reveals={[]} verdicts={VERD} splitAt={60} introDur={40} kicker="El veredicto" title="3 aliadas · 3 traidoras" />},
  // SÉSAMO → oxalato → piedra
  {from: 20527, dur: 280, dir: 'in', node: <OxalatoScene dur={280} />},
  // recap de las traidoras
  {from: 24319, dur: 520, dir: 'up', node: <FoodVerdictScene title="Semillas: las que alivian y las que cargan" good={GOOD} bad={BAD} />},
  // ★ LA PIEZA FIRMA — el puñado contra la cucharada
  {from: 25298, dur: 400, dir: 'left', node: <ManoVsCuchara dur={400} />},
  // ★ LÁMINA B — EL SEMÁFORO (hold largo: "sáquele una foto a la pantalla")
  {from: 26479, dur: 1000, dir: 'up', node: <SemaforoScene dur={1000} />},
  // don Ramón: la creatinina se estabiliza → la aguja BAJA (pago emocional)
  {from: 29758, dur: 210, dir: 'in', node: <CreatininaScene from={2.4} to={1.5} caption="Creatinina" subcaption="estable en 3 meses" />},
  // las 4 señales
  {from: 32004, dur: 480, dir: 'up', node: <AlertSignalsScene />},
  // cierre del círculo: "esas láminas son páginas de la guía"
  {from: 34586, dur: 320, dir: 'left', node: <LaminaSeguras dur={320} />},
  {from: 34910, dur: 340, dir: 'right', node: <SemaforoScene dur={340} />},
  // CTA — QR a la guía (landing propia del canal)
  {from: 36347, dur: 1440, dir: 'in', node: <QrCtaScene qr="renal/bas_qr_bastida.png" kicker="Dr. Bastida · Salud renal" title="Su guía de las semillas" steps={['Abra la cámara de su teléfono', 'Apunte al código de la pantalla', 'Toque el aviso que aparece arriba']} note="También acá abajo, en la descripción" />},
  // testimonial Elena de Medellín
  {from: 37957, dur: 1150, dir: 'left', node: <TestimonialScene img="img/bas6_elena_kitchen.png" name="Elena" place="Medellín" quote={'“Cambié el puñado por una cucharada, siete días seguidos… a la semana ya me sentía menos hinchada.”'} tag="El reto de la cuchara" />},
  // recap final SÍ / NO
  {from: 39155, dur: 520, dir: 'up', node: <FoodVerdictScene title="Sus tres · y las tres que cargan" good={GOOD} bad={BAD} />},
  // recall del QR
  {from: 40163, dur: 330, dir: 'in', node: <QrCtaScene qr="renal/bas_qr_bastida.png" kicker="El mapa entero" title="El semáforo completo" steps={['Abra la cámara', 'Apunte al código', 'Toque el aviso']} note="También en la descripción" />},
];

/* ===================== OVERLAYS (fondo transparente, sobre avatar o b-roll) ===================== */
const OVERLAY: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 5997, dur: 200, node: <KeyWord word="FÓSFORO" sub="lo que más necesita una planta para nacer" />},
  {from: 6530, dur: 170, node: <SideIllustration img="img/ill/bas6_ill_lino.png" side="right" caption="Se pega como sarro" dur={170} size={360} />},
  {from: 7942, dur: 210, node: <KeyWord word="EL PUÑADO" sub="no es la semilla: es la cantidad" />},
  {from: 8731, dur: 170, node: <KeyWord word="LAS 3 QUE SÍ" sub="las que le dan un respiro al filtro" />},
  {from: 9400, dur: 150, node: <SideIllustration img="img/ill/bas6_ill_lino.png" side="right" caption="MOLIDA, siempre" dur={150} size={380} />},
  {from: 11050, dur: 150, node: <SideIllustration img="img/ill/bas6_ill_chia.png" side="left" caption="Remojada, 20 min" dur={150} size={360} />},
  {from: 12600, dur: 150, node: <SideIllustration img="img/ill/bas6_ill_cilantro.png" side="right" caption="En infusión, no masticada" dur={150} size={380} />},
  {from: 14710, dur: 190, node: <KeyWord word="LA CUCHARA" sub="no el puñado" />},
  {from: 17200, dur: 190, node: <KeyWord word="LAS 3 TRAIDORAS" sub="las que come creyendo que se cuida" />},
  {from: 18223, dur: 200, node: <TraidoraTag name="Semillas de girasol" reason="Fósforo + potasio + mucha sal" />},
  {from: 19906, dur: 200, node: <TraidoraTag name="Sésamo y tahini" reason="Invisible… y cargado de oxalato" />},
  {from: 21845, dur: 240, node: <TraidoraTag name="Semillas de zapallo" reason='La "de la próstata"… la más pesada' />},
  {from: 22652, dur: 300, node: <StatTag a="1 puñado" b="1½ vaso de leche" note="de fósforo, en cuarenta segundos" />},
  {from: 23600, dur: 200, node: <CautionChip text="Creatinina alta: una cucharadita, y consúltelo" />},
  {from: 30665, dur: 200, node: <KeyWord word="UNA COSTUMBRE" sub="no una hazaña de un día" />},
  {from: 33316, dur: 220, node: <CautionChip text="¿Enfermedad renal avanzada? Consulte a su nefrólogo" />},
  {from: 35306, dur: 200, node: <KeyWord word="300 ALIMENTOS" sub="cada uno con su color y su porción" />},
  {from: 39900, dur: 220, node: <KeyWord word="ZAPALLO" sub='la "más sana"… era la trampa' />},
  {from: 40501, dur: 614, node: <SubscribeCard />},
];

const SFX: {at: number; name: string; vol?: number}[] = [
  {at: 6, name: 'carousel_whoosh'}, {at: 40, name: 'carousel_fanout', vol: 0.5}, {at: 640, name: 'carousel_lock', vol: 0.5},
  {at: 2537, name: 'fear_drone', vol: 0.55}, {at: 2647, name: 'fear_impact'}, {at: 2700, name: 'fear_shatter', vol: 0.6},
  {at: 4134, name: 'note_sparkle', vol: 0.5}, {at: 5306, name: 'note_sparkle', vol: 0.45},
  {at: 5997, name: 'fear_impact', vol: 0.4}, {at: 7942, name: 'chip_strike', vol: 0.45},
  {at: 9116, name: 'carousel_whoosh', vol: 0.5}, {at: 10775, name: 'carousel_whoosh', vol: 0.5}, {at: 12316, name: 'carousel_whoosh', vol: 0.5},
  {at: 15605, name: 'page_turn', vol: 0.6}, {at: 15640, name: 'note_sparkle', vol: 0.4},
  {at: 17579, name: 'carousel_whoosh', vol: 0.5}, {at: 17640, name: 'carousel_lock', vol: 0.5},
  {at: 18223, name: 'chip_strike', vol: 0.5}, {at: 19906, name: 'chip_strike', vol: 0.5}, {at: 21845, name: 'chip_strike', vol: 0.6},
  {at: 20527, name: 'fear_drone', vol: 0.45}, {at: 22652, name: 'fear_impact', vol: 0.5},
  {at: 24319, name: 'note_sparkle', vol: 0.5}, {at: 25298, name: 'carousel_whoosh', vol: 0.5},
  {at: 26479, name: 'page_turn', vol: 0.6}, {at: 26530, name: 'tick', vol: 0.35},
  {at: 29758, name: 'note_sparkle', vol: 0.5}, {at: 32004, name: 'fear_impact', vol: 0.4},
  {at: 34586, name: 'page_turn', vol: 0.5}, {at: 34910, name: 'page_turn', vol: 0.5},
  {at: 36347, name: 'note_sparkle', vol: 0.5}, {at: 37957, name: 'carousel_whoosh', vol: 0.4},
  {at: 39155, name: 'note_sparkle', vol: 0.5}, {at: 39900, name: 'fear_impact', vol: 0.45},
];

export const MainBastida6: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#05161f'}}>
      {/* AVATAR — parcial (9:16.6) en BUCLE y MUTEADO: el audio sale del master aparte */}
      <Loop durationInFrames={SEAM_6}>
        <OffthreadVideo src={staticFile('renal/avatar6.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Loop>
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

      {/* B-ROLL (generado: clip real si llegó, foto del mismo prompt si no) */}
      {(BEATS6 as {from: number; dur: number; clip?: string; img?: string; caption?: string}[]).map((b, i) => (
        <Sequence key={`br${i}`} from={b.from} durationInFrames={b.dur}>
          {b.clip ? <BClip clip={b.clip} caption={b.caption} dur={b.dur} /> : <BRoll img={b.img} caption={b.caption} dur={b.dur} kb={1} />}
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

      {/* AUDIO MASTER (avatar real + cola clonada en Fish, −14 LUFS) */}
      <Audio src={staticFile('bastidarenal6.mp3')} />

      {/* MÚSICA bed */}
      <Audio src={staticFile('renal/music/bas_music_quiet_pulse_bed_a.mp3')} volume={0.1} loop />

      {/* SFX */}
      {SFX.map((s, i) => (
        <Sequence key={`sf${i}`} from={s.at} durationInFrames={90}>
          <Audio src={sfxf(s.name)} volume={s.vol ?? 0.65} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
