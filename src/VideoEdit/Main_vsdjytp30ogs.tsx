/**
 * Main_vsdjytp30ogs — "ADIÓS MANOS ENVEJECIDAS"
 * Canal: Federer Archivos · Kit: federer-fluid (Dr. Federer — Fluid, cinematográfico)
 *
 * ARQUITECTURA (clonada de src/FedererFluid.tsx, el esqueleto del kit):
 *   L0 · UN solo <OffthreadVideo> del avatar, PERSISTENTE, corriendo continuo abajo
 *        → el audio nunca se corta y el labial nunca se desincroniza.
 *   L1 · encima flotan las escenas del FedererKit y las tomas full (b-roll / imagen IA),
 *        cada una en su <Sequence>, con el TransitionShell propio del kit.
 *   Los beats con kind 'avatar' NO montan nada encima: se ve la cara a pantalla completa.
 *   Donde no hay beat visual, tampoco hay fondo pelado: siempre está el avatar debajo (gap-fill natural).
 */
import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  CLAMP,
  FedBeforeAfter,
  FedChapter,
  FedChecklist,
  FedCta,
  FedFullShot,
  FedHero,
  FedLowerThird,
  FedMolecule,
  FedQuote,
  FedStat,
  FedStep,
  GrainOverlay,
  MotesLayer,
  makeMotes,
  rgba,
} from '../FedererKit';
import {BEATS, TOTAL_FRAMES, ACCENT} from './beats_vsdjytp30ogs';

/* ====================== CAPA AVATAR (video persistente) ================== */

const AvatarLayer: React.FC<{src: string; accent: string; cuts: number[]}> = ({
  src,
  accent,
  cuts,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;

  // bump de latigazo en cada corte de escena
  let act = 0;
  for (let i = 0; i < cuts.length; i++) {
    const d = Math.abs(t - cuts[i]);
    const b = interpolate(d, [0, 0.5], [1, 0], CLAMP);
    if (b > act) act = b;
  }

  const push = interpolate(frame, [0, durationInFrames], [1, 1.055], CLAMP);
  const handX =
    Math.sin(frame * 0.05) * width * 0.0012 + Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const handY = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;
  const x = handX - act * width * 0.022;
  const blur = act * 8;
  const scale = push * (1 + act * 0.018);

  const dust = React.useMemo(
    () => makeMotes(7, 'avatar-dust', 2, 5, 0.008, 0.02, 0.05, 0.13),
    []
  );

  return (
    <>
      <AbsoluteFill
        style={{
          transform: `translate(${x}px, ${handY}px) scale(${scale})`,
          filter: `blur(${blur}px)`,
          willChange: 'transform, filter',
        }}
      >
        <OffthreadVideo src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `linear-gradient(160deg, ${rgba(
              accent,
              0.05
            )}, transparent 38%, transparent 68%, rgba(2, 6, 14, 0.28))`,
          }}
        />
      </AbsoluteFill>
      <MotesLayer motes={dust} blur={1.2} scale={height / 1080} tint="235, 205, 150" />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 42%, transparent 62%, rgba(2, 5, 12, 0.42) 100%)',
        }}
      />
    </>
  );
};

/* ============================== DESPACHO ================================= */

const KIT: Record<string, React.FC<any>> = {
  FedChapter,
  FedHero,
  FedStat,
  FedQuote,
  FedMolecule,
  FedStep,
  FedBeforeAfter,
  FedLowerThird,
  FedChecklist,
  FedCta,
  FedFullShot,
};

// Los componentes del kit meten su `image`/`src` DIRECTO en <Img>/<Media>: esperan una ruta ya
// resuelta (sus propios defaults son staticFile('med/…')). Pasarles "img/x.jpg" crudo funciona en
// el preview pero en el BUNDLE se resuelve relativo y da 404 → el chunk muere. Se envuelve acá.
const ASSET_PROPS = ['src', 'image', 'imageA', 'imageB', 'clip', 'video', 'bg', 'poster'] as const;
const resolveAssets = (props: Record<string, any> = {}): Record<string, any> => {
  const out: Record<string, any> = {...props};
  for (const k of ASSET_PROPS) {
    const v = out[k];
    if (typeof v === 'string' && /^(img|broll|real|med|vid|sfx)\//.test(v)) out[k] = staticFile(v);
  }
  return out;
};

export const Main_vsdjytp30ogs: React.FC = () => {
  const {fps} = useVideoConfig();

  const cuts = React.useMemo(
    () => BEATS.filter((b) => b.kind !== 'avatar').map((b) => b.start / fps),
    [fps]
  );

  return (
    <AbsoluteFill style={{background: '#020409', overflow: 'hidden'}}>
      {/* L0 · avatar persistente — NUNCA se desmonta */}
      <AvatarLayer src={staticFile('vsdjytp30ogs_opt.mp4')} accent={ACCENT} cuts={cuts} />

      {/* L1 · escenas flotando encima */}
      {BEATS.filter((b) => b.kind !== 'avatar').map((b) => {
        const Comp = KIT[b.comp ?? 'FedFullShot'];
        if (!Comp) return null;
        // corte SECO: montamos el shell ya asentado (from negativo) y estiramos totalF,
        // así la escena entra y sale sin transición. La mitad de los cortes va seca.
        const pad = b.cut ? 12 : 0;
        return (
          <Sequence
            key={b.id}
            from={b.start}
            durationInFrames={Math.max(2, b.dur)}
            name={`${b.comp ?? 'shot'} · ${b.id}`}
          >
            <Sequence from={-pad} durationInFrames={b.dur + pad * 2}>
              <Comp
                {...resolveAssets(b.props)}
                totalF={b.dur + pad * 2}
                variant={b.variant ?? 'whip'}
                accent={b.props?.accent ?? ACCENT}
              />
            </Sequence>
          </Sequence>
        );
      })}

      <AbsoluteFill
        style={{
          zIndex: 30,
          pointerEvents: 'none',
          background:
            'radial-gradient(125% 105% at 50% 46%, transparent 62%, rgba(1, 3, 8, 0.32) 100%)',
        }}
      />
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default Main_vsdjytp30ogs;
export {TOTAL_FRAMES};

/* === MANIFIESTO vsdjytp30ogs (density_gate) — ORDEN CRONOLÓGICO, generado ===
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d000.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_001.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_002.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d003.mp4"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d004.mp4"
  <FedStat/> "img/vsdjytp30ogs_002.jpg"
  <FedQuote/> "img/vsdjytp30ogs_002.jpg"
  <FedAvatarFull/>
  <FedBeforeAfter/> "img/vsdjytp30ogs_006.jpg"
  <FedHero/> "img/vsdjytp30ogs_005.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_006.jpg"
  <FedAvatarFull/>
  <FedChapter/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d007.mp4"
  <FedHero/> "img/vsdjytp30ogs_008.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d009.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_010.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_011.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_012.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_013.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_014.jpg"
  <FedStat/> "img/vsdjytp30ogs_014.jpg"
  <FedQuote/> "img/vsdjytp30ogs_014.jpg"
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_014.jpg"
  <FedLowerThird/>
  <FedStat/> "img/vsdjytp30ogs_014.jpg"
  <FedAvatarFull/>
  <FedMolecule/> "img/vsdjytp30ogs_017.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d015.mp4"
  <FedAvatarFull/>
  <FedStat/> "img/vsdjytp30ogs_017.jpg"
  <FedChecklist/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d016.mp4"
  <FedHero/> "img/vsdjytp30ogs_017.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_017.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_018.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d019.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_020.jpg"
  <FedQuote/> "img/vsdjytp30ogs_020.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d021.mp4"
  <FedAvatarFull/>
  <FedStat/> "img/vsdjytp30ogs_023.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d022.mp4"
  <FedBeforeAfter/> "img/vsdjytp30ogs_023.jpg"
  <FedStat/> "img/vsdjytp30ogs_023.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_023.jpg"
  <FedAvatarFull/>
  <FedBeforeAfter/> "img/vsdjytp30ogs_024.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_024.jpg"
  <FedAvatarFull/>
  <FedChecklist/>
  <FedHero/> "img/vsdjytp30ogs_025.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_026.jpg"
  <FedHero/> "img/vsdjytp30ogs_026.jpg"
  <FedAvatarFull/>
  <FedQuote/> "img/vsdjytp30ogs_026.jpg"
  <FedMolecule/> "img/vsdjytp30ogs_029.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d027.mp4"
  <FedQuote/> "img/vsdjytp30ogs_029.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d028.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_029.jpg"
  <FedHero/> "broll/vsdjytp30ogs/d030.mp4"
  <FedStat/> "img/vsdjytp30ogs_029.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d031.mp4"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d032.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_033.jpg"
  <FedHero/> "broll/vsdjytp30ogs/d034.mp4"
  <FedHero/> "img/vsdjytp30ogs_033.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d035.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_036.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_037.jpg"
  <FedBeforeAfter/> "img/vsdjytp30ogs_038.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_038.jpg"
  <FedStat/> "img/vsdjytp30ogs_038.jpg"
  <FedAvatarFull/>
  <FedStep/> "img/vsdjytp30ogs_038.jpg"
  <FedHero/> "broll/vsdjytp30ogs/d039.mp4"
  <FedStep/> "img/vsdjytp30ogs_038.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d040.mp4"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d041.mp4"
  <FedMolecule/> "img/vsdjytp30ogs_044.jpg"
  <FedHero/> "img/vsdjytp30ogs_042.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d043.mp4"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_044.jpg"
  <FedStat/> "img/vsdjytp30ogs_044.jpg"
  <FedHero/> "img/vsdjytp30ogs_045.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d046.mp4"
  <FedStat/> "img/vsdjytp30ogs_044.jpg"
  <FedChecklist/>
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_047.jpg"
  <FedAvatarFull/>
  <FedQuote/> "img/vsdjytp30ogs_050.jpg"
  <FedAvatarFull/>
  <FedStat/> "img/vsdjytp30ogs_050.jpg"
  <FedHero/> "broll/vsdjytp30ogs/d048.mp4"
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d049.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_050.jpg"
  <FedChecklist/>
  <FedHero/> "img/vsdjytp30ogs_051.jpg"
  <FedStat/> "img/vsdjytp30ogs_050.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d052.mp4"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_053.jpg"
  <FedQuote/> "img/vsdjytp30ogs_053.jpg"
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_054.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_054.jpg"
  <FedChapter/>
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d055.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_056.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d057.mp4"
  <FedMolecule/> "img/vsdjytp30ogs_056.jpg"
  <FedHero/> "img/vsdjytp30ogs_058.jpg"
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_059.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_059.jpg"
  <FedStat/> "img/vsdjytp30ogs_059.jpg"
  <FedAvatarFull/>
  <FedChecklist/>
  <FedStat/> "img/vsdjytp30ogs_060.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_060.jpg"
  <FedBeforeAfter/> "img/vsdjytp30ogs_060.jpg"
  <FedAvatarFull/>
  <FedStep/> "img/vsdjytp30ogs_062.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d061.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_062.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d063.mp4"
  <FedMolecule/> "img/vsdjytp30ogs_062.jpg"
  <FedAvatarFull/>
  <FedQuote/> "img/vsdjytp30ogs_067.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d064.mp4"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d065.mp4"
  <FedHero/> "img/vsdjytp30ogs_066.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_067.jpg"
  <FedHero/> "img/vsdjytp30ogs_067.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d068.mp4"
  <FedHero/> "img/vsdjytp30ogs_069.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_070.jpg"
  <FedStat/> "img/vsdjytp30ogs_070.jpg"
  <FedStep/> "img/vsdjytp30ogs_070.jpg"
  <FedHero/> "broll/vsdjytp30ogs/d071.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_070.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d073.mp4"
  <FedAvatarFull/>
  <FedChecklist/>
  <FedHero/> "img/vsdjytp30ogs_074.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d075.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_076.jpg"
  <FedStat/> "img/vsdjytp30ogs_076.jpg"
  <FedStep/> "img/vsdjytp30ogs_076.jpg"
  <FedHero/> "broll/vsdjytp30ogs/d077.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_078.jpg"
  <FedAvatarFull/>
  <FedQuote/> "img/vsdjytp30ogs_078.jpg"
  <FedStat/> "img/vsdjytp30ogs_078.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d079.mp4"
  <FedBeforeAfter/> "img/vsdjytp30ogs_080.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_080.jpg"
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_081.jpg"
  <FedAvatarFull/>
  <FedStat/> "img/vsdjytp30ogs_080.jpg"
  <FedChecklist/>
  <FedAvatarFull/>
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d082.mp4"
  <FedHero/> "img/vsdjytp30ogs_080.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d083.mp4"
  <FedStat/> "img/vsdjytp30ogs_080.jpg"
  <FedAvatarFull/>
  <FedMolecule/> "img/vsdjytp30ogs_090.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d084.mp4"
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d085.mp4"
  <FedHero/> "img/vsdjytp30ogs_086.jpg"
  <FedStat/> "img/vsdjytp30ogs_090.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d087.mp4"
  <FedQuote/> "img/vsdjytp30ogs_090.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d088.mp4"
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_090.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d089.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_090.jpg"
  <FedMolecule/> "img/vsdjytp30ogs_090.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d091.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_092.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d093.mp4"
  <FedAvatarFull/>
  <FedStat/> "img/vsdjytp30ogs_092.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d094.mp4"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d095.mp4"
  <FedAvatarFull/>
  <FedStep/> "img/vsdjytp30ogs_096.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_096.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_097.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_098.jpg"
  <FedAvatarFull/>
  <FedChapter/>
  <FedFullShot/> "img/vsdjytp30ogs_099.jpg"
  <FedStat/> "img/vsdjytp30ogs_099.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d100.mp4"
  <FedHero/> "img/vsdjytp30ogs_102.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d101.mp4"
  <FedQuote/> "img/vsdjytp30ogs_102.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_102.jpg"
  <FedAvatarFull/>
  <FedBeforeAfter/> "img/vsdjytp30ogs_102.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_103.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d104.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_105.jpg"
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_106.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_106.jpg"
  <FedMolecule/> "img/vsdjytp30ogs_106.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_107.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_108.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d109.mp4"
  <FedQuote/> "img/vsdjytp30ogs_110.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_110.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d111.mp4"
  <FedChecklist/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d112.mp4"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_113.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_114.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d115.mp4"
  <FedStat/> "img/vsdjytp30ogs_114.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d116.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_117.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d118.mp4"
  <FedAvatarFull/>
  <FedChecklist/>
  <FedMolecule/> "img/vsdjytp30ogs_120.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d119.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_120.jpg"
  <FedQuote/> "img/vsdjytp30ogs_121.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_121.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_122.jpg"
  <FedChecklist/>
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_123.jpg"
  <FedStat/> "img/vsdjytp30ogs_124.jpg"
  <FedQuote/> "img/vsdjytp30ogs_124.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_124.jpg"
  <FedChecklist/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d125.mp4"
  <FedAvatarFull/>
  <FedBeforeAfter/> "img/vsdjytp30ogs_126.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_126.jpg"
  <FedHero/> "broll/vsdjytp30ogs/d127.mp4"
  <FedAvatarFull/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d128.mp4"
  <FedAvatarFull/>
  <FedQuote/> "img/vsdjytp30ogs_129.jpg"
  <FedChapter/>
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_129.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d130.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_129.jpg"
  <FedStat/> "img/vsdjytp30ogs_129.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d132.mp4"
  <FedAvatarFull/>
  <FedChecklist/>
  <FedFullShot/> "broll/vsdjytp30ogs_s/d133.mp4"
  <FedStat/> "img/vsdjytp30ogs_135.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d134.mp4"
  <FedBeforeAfter/> "img/vsdjytp30ogs_135.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_135.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d136.mp4"
  <FedHero/> "img/vsdjytp30ogs_137.jpg"
  <FedStat/> "img/vsdjytp30ogs_139.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d138.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_139.jpg"
  <FedStat/> "img/vsdjytp30ogs_139.jpg"
  <FedHero/> "img/vsdjytp30ogs_140.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_141.jpg"
  <FedStep/> "img/vsdjytp30ogs_141.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d142.mp4"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_fill_d143.jpg"
  <FedStat/> "img/vsdjytp30ogs_144.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_144.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_fill_d145.jpg"
  <FedHero/> "img/vsdjytp30ogs_146.jpg"
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_144.jpg"
  <FedBeforeAfter/> "img/vsdjytp30ogs_144.jpg"
  <FedStep/> "img/vsdjytp30ogs_144.jpg"
  <FedStep/> "img/vsdjytp30ogs_144.jpg"
  <FedStep/> "img/vsdjytp30ogs_144.jpg"
  <FedStep/> "img/vsdjytp30ogs_144.jpg"
  <FedStep/> "img/vsdjytp30ogs_148.jpg"
  <FedStat/> "img/vsdjytp30ogs_148.jpg"
  <FedAvatarFull/>
  <FedBeforeAfter/> "img/vsdjytp30ogs_148.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d147.mp4"
  <FedAvatarFull/>
  <FedQuote/> "img/vsdjytp30ogs_148.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_148.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_149.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d150.mp4"
  <FedHero/> "img/vsdjytp30ogs_149.jpg"
  <FedStat/> "img/vsdjytp30ogs_149.jpg"
  <FedChecklist/>
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_fill_d151.jpg"
  <FedAvatarFull/>
  <FedChecklist/>
  <FedAvatarFull/>
  <FedHero/> "img/vsdjytp30ogs_152.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_152.jpg"
  <FedStat/> "img/vsdjytp30ogs_152.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_fill_d153.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_154.jpg"
  <FedQuote/> "img/vsdjytp30ogs_154.jpg"
  <FedStat/> "img/vsdjytp30ogs_154.jpg"
  <FedCta/> "img/vsdjytp30ogs_155.jpg"
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_155.jpg"
  <FedStat/> "img/vsdjytp30ogs_155.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_fill_d156.jpg"
  <FedHero/> "img/vsdjytp30ogs_157.jpg"
  <FedChecklist/>
  <FedAvatarFull/>
  <FedFullShot/> "img/vsdjytp30ogs_158.jpg"
  <FedFullShot/> "img/vsdjytp30ogs_159.jpg"
  <FedFullShot/> "broll/vsdjytp30ogs_s/d160.mp4"
  <FedFullShot/> "img/vsdjytp30ogs_161.jpg"
  <FedQuote/> "img/vsdjytp30ogs_161.jpg"
  <FedAvatarFull/>
=== FIN MANIFIESTO === */
