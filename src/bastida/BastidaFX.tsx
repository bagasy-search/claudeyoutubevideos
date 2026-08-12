/**
 * BastidaFX — set-pieces cinematográficos del canal Dr. Bastida (nivel HERO).
 *
 * FearToCalm — el beat emocional del minuto 1: la palabra del MIEDO (ej "DIÁLISIS")
 * se agiganta fría, con latido rojo y temblor; en el cue se QUIEBRA en tajadas que caen
 * como gotas, y emerge sereno el mensaje de CALMA ("Respire." / "No estamos ahí.") en aqua,
 * mientras el fondo pasa de rojo-tenso a navy-calmo. Cuenta la historia sin una sola palabra extra.
 *
 * Props: word, calm[], breakAt (frame del quiebre).
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {spring, Img, staticFile, OffthreadVideo} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, FONT_HAND, FONT_SERIF, rgba, GrainOverlay} from './theme';

const easeIn = Easing.in(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);

export type FearToCalmProps = {
  word?: string;
  calm?: string[];
  breakAt?: number;
};

export const FearToCalm: React.FC<FearToCalmProps> = ({
  word = 'DIÁLISIS',
  calm = ['Respire.', 'No estamos ahí.'],
  breakAt = 96,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // fase 1 (miedo): 0 → breakAt ; fase 2 (calma): breakAt → +
  const enter = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const brk = interpolate(frame, [breakAt, breakAt + fps * 0.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // latido rojo + temblor mientras está intacta
  const beat = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 3.2);
  const preBreak = 1 - interpolate(frame, [breakAt - 6, breakAt], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tremorX = Math.sin(frame * 1.7) * 2.2 * preBreak;
  const tremorY = Math.cos(frame * 2.1) * 1.8 * preBreak;

  // fondo: rojo-tenso → navy-calmo
  const redGlow = (0.22 + beat * 0.12) * (1 - brk);
  const aquaCalm = brk;

  // tajadas del quiebre
  const SLICES = 16;
  const boxW = Math.min(1500, width * 0.82);
  const boxH = 260;
  const sliceW = boxW / SLICES;

  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 50% 46%, ${BAS.bgPanel} 0%, ${BAS.bg} 55%, ${BAS.bgDeep} 100%)`}}>
      {/* halo rojo del miedo (se apaga al quebrar) */}
      <AbsoluteFill style={{background: `radial-gradient(60% 50% at 50% 44%, ${rgba('#D64541', redGlow)} 0%, transparent 70%)`}} />
      {/* halo aqua de la calma (crece al quebrar) */}
      <AbsoluteFill style={{background: `radial-gradient(70% 60% at 50% 52%, ${rgba(BAS.aqua, aquaCalm * 0.28)} 0%, transparent 72%)`}} />

      {/* LA PALABRA — en tajadas que caen */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '38%',
          width: boxW,
          height: boxH,
          transform: `translate(-50%,-50%) translate(${tremorX}px, ${tremorY}px) scale(${interpolate(enter, [0, 1], [0.86, 1]) * (1 + beat * 0.012 * preBreak)})`,
          opacity: enter,
        }}
      >
        {Array.from({length: SLICES}).map((_, i) => {
          const delay = i * 1.4 + (i % 3) * 2;
          const p = interpolate(frame, [breakAt + delay, breakAt + delay + fps * 0.8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: easeIn,
          });
          const fall = p * p * (height * 0.7);
          const drift = (i % 2 ? 1 : -1) * p * 40;
          const rot = (i % 2 ? 1 : -1) * p * 16;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i * sliceW,
                top: 0,
                width: sliceW,
                height: boxH,
                overflow: 'hidden',
                transform: `translate(${drift}px, ${fall}px) rotate(${rot}deg)`,
                opacity: 1 - p,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -i * sliceW,
                  top: 0,
                  width: boxW,
                  height: boxH,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_SANS,
                  fontSize: 168,
                  fontWeight: 800,
                  letterSpacing: 6,
                  color: '#E8F0F2',
                  textShadow: `0 0 ${18 + beat * 14}px ${rgba('#D64541', 0.5 * (1 - brk))}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {word}
              </div>
            </div>
          );
        })}
        {/* subrayado rojo con latido (desaparece al quebrar) */}
        <div
          style={{
            position: 'absolute',
            left: '18%',
            right: '18%',
            bottom: 44,
            height: 6,
            borderRadius: 3,
            background: BAS.no,
            opacity: (0.5 + beat * 0.5) * (1 - interpolate(frame, [breakAt, breakAt + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})),
            boxShadow: `0 0 20px ${rgba(BAS.no, 0.8)}`,
          }}
        />
      </div>

      {/* gotas que caen al quebrar */}
      {brk > 0 &&
        Array.from({length: 22}).map((_, i) => {
          const seed = (i * 53.7) % 100;
          const dp = interpolate(frame, [breakAt + (seed % 12), breakAt + (seed % 12) + fps * 1.1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: easeIn,
          });
          const x = 26 + (seed / 100) * 48;
          const y = 30 + dp * 45;
          const sz = 3 + (seed % 4);
          return (
            <div
              key={`d${i}`}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: sz,
                height: sz * 1.6,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background: BAS.aquaLite,
                opacity: (1 - dp) * 0.8,
                boxShadow: `0 0 ${sz * 3}px ${rgba(BAS.aqua, 0.7)}`,
              }}
            />
          );
        })}

      {/* mensaje de CALMA */}
      <div style={{position: 'absolute', left: 0, right: 0, top: '52%', textAlign: 'center'}}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 128,
            fontWeight: 700,
            color: BAS.aquaLite,
            opacity: interpolate(frame, [breakAt + 10, breakAt + 32], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut}),
            transform: `translateY(${interpolate(brk, [0, 1], [24, 0])}px)`,
            textShadow: `0 0 40px ${rgba(BAS.aqua, 0.5)}`,
          }}
        >
          {calm[0]}
        </div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 46,
            fontWeight: 500,
            letterSpacing: 2,
            color: BAS.onDark,
            marginTop: 10,
            opacity: interpolate(frame, [breakAt + 24, breakAt + 46], [0, 0.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut}),
          }}
        >
          {calm[1]}
        </div>
      </div>

      {/* viñeta: fuerte (miedo) → suave (calma) */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(125% 115% at 50% 42%, transparent ${interpolate(brk, [0, 1], [40, 58])}%, ${rgba(BAS.bgEdge, interpolate(brk, [0, 1], [0.72, 0.4]))} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- StrikeChips */
/**
 * StrikeChips — chips premium que materializan y se TACHAN (para "sin farmacia / sin gastar…").
 * Cada chip: vidrio claro, ícono + label, pop-in con spring, y una tachadura roja que se DIBUJA.
 * bg transparente por defecto (va sobre el avatar); `bg` para previsualizar aislado.
 */
export type StrikeChip = {label: string; icon?: 'cross' | 'money'};
export type StrikeChipsProps = {items?: StrikeChip[]; bg?: string};

const ChipIcon: React.FC<{kind: StrikeChip['icon']}> = ({kind}) => {
  if (kind === 'money') {
    return (
      <span style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 800, color: BAS.si}}>$</span>
    );
  }
  // cruz de farmacia
  return (
    <svg width={38} height={38} viewBox="0 0 38 38">
      <rect x="15" y="5" width="8" height="28" rx="2" fill={BAS.si} />
      <rect x="5" y="15" width="28" height="8" rx="2" fill={BAS.si} />
    </svg>
  );
};

export const StrikeChips: React.FC<StrikeChipsProps> = ({
  items = [
    {label: 'Sin farmacia', icon: 'cross'},
    {label: 'Sin gastar una fortuna', icon: 'money'},
  ],
  bg = 'transparent',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', gap: 40}}>
        {items.map((it, i) => {
          const delay = i * 12;
          const pop = spring({frame: frame - delay, fps, config: {damping: 140, mass: 0.7}});
          const strike = interpolate(frame, [delay + 16, delay + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
          const shake = strike > 0 && strike < 1 ? Math.sin(frame * 2.4) * 2 : 0;
          const desat = interpolate(strike, [0, 1], [1, 0.55]);
          return (
            <div
              key={i}
              style={{
                position: 'relative',
                transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])}) translateX(${shake}px)`,
                opacity: pop,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: BAS.card,
                  border: `1px solid ${rgba('#ffffff', 0.7)}`,
                  borderRadius: 999,
                  padding: '18px 34px',
                  boxShadow: `0 24px 50px ${rgba('#06202f', 0.4)}, 0 4px 12px ${rgba('#06202f', 0.3)}`,
                  filter: `saturate(${desat})`,
                }}
              >
                <ChipIcon kind={it.icon} />
                <span style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, color: BAS.brand, whiteSpace: 'nowrap'}}>{it.label}</span>
              </div>
              {/* tachadura roja que se dibuja */}
              <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
                <line
                  x1="6%" y1="82%" x2="94%" y2="20%"
                  stroke={BAS.no} strokeWidth={7} strokeLinecap="round"
                  pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike}
                  style={{filter: `drop-shadow(0 0 8px ${rgba(BAS.no, 0.7)})`}}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- HandUnderline */
/**
 * HandUnderline — subrayado "a mano" aqua que se DIBUJA bajo una frase clave (ej "a tiempo"),
 * con una notita Caveat opcional. Va sobre el avatar (lower-emphasis). bg para previsualizar.
 */
export type HandUnderlineProps = {phrase?: string; note?: string; bg?: string};

export const HandUnderline: React.FC<HandUnderlineProps> = ({
  phrase = 'todavía está a tiempo',
  note = 'a tiempo!',
  bg = 'transparent',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 160, mass: 0.8}});
  const draw = interpolate(frame, [14, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const noteIn = interpolate(frame, [34, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  return (
    <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`, opacity: enter}}>
        <span style={{fontFamily: FONT_SERIF, fontSize: 92, fontWeight: 600, color: BAS.onDark}}>{phrase}</span>
        {/* subrayado a mano (path irregular) */}
        <svg style={{position: 'absolute', left: -10, right: -10, bottom: -26, width: 'calc(100% + 20px)', height: 60, overflow: 'visible'}} viewBox="0 0 600 60" preserveAspectRatio="none">
          <path
            d="M8 34 C 130 46, 250 20, 360 32 S 540 44, 592 26"
            fill="none" stroke={BAS.aqua} strokeWidth={9} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}
            style={{filter: `drop-shadow(0 0 10px ${rgba(BAS.aqua, 0.6)})`}}
          />
        </svg>
        {/* notita a mano */}
        <span
          style={{
            position: 'absolute',
            right: -30,
            top: -54,
            fontFamily: FONT_HAND,
            fontSize: 56,
            color: BAS.aqua,
            transform: `rotate(-8deg) scale(${noteIn})`,
            opacity: noteIn,
          }}
        >
          {note}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- PresenterIntro */
/**
 * PresenterIntro — la presentación del doctor ("Soy el doctor Bastida…").
 * Bloque premium NEGRO con nombre en DORADO que tiene un brillo que BARRE (adinerado),
 * y el doctor (PNG sin fondo) SALE desde abajo SUPERPUESTO sobre el bloque, con punto verde "en línea".
 * Coreografía: (1) el bloque entra deslizando, (2) el doctor sube superpuesto, (3) el nombre dorado se
 * revela con un barrido de luz. Fondo negro con leve halo dorado (lujo).
 */
export type PresenterIntroProps = {
  name?: string;
  role?: string;
  kicker?: string;
  img?: string;
};

export const PresenterIntro: React.FC<PresenterIntroProps> = ({
  name = 'Dr. Emilio Bastida',
  role = 'Nefrólogo · Salud Renal',
  kicker = 'Su médico de confianza',
  img = 'renal/bastida_cutout.png',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardIn = spring({frame, fps, config: {damping: 150, mass: 0.8}});
  const docIn = spring({frame: frame - 8, fps, config: {damping: 150, mass: 0.9}});
  const nameWipe = interpolate(frame, [16, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const roleIn = interpolate(frame, [34, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const dotPulse = 0.6 + 0.4 * Math.sin((frame / fps) * Math.PI * 3);

  // barrido de brillo dorado (loop) — "adinerado"
  const shine = ((frame % 96) / 96) * 140 - 20; // -20 .. 120 (%)

  const GOLD_BASE = 'linear-gradient(100deg, #8A6A2E 0%, #E8C874 34%, #FBEFC2 50%, #E8C874 66%, #8A6A2E 100%)';
  const GOLD_SHINE = `linear-gradient(100deg, transparent ${shine - 16}%, rgba(255,251,232,0.95) ${shine}%, transparent ${shine + 16}%)`;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(80% 90% at 30% 45%, #14110A 0%, #0A0A0C 55%, #050506 100%)'}}>
      {/* halo dorado tenue */}
      <AbsoluteFill style={{background: 'radial-gradient(48% 55% at 40% 52%, rgba(232,200,116,0.12) 0%, transparent 70%)'}} />

      {/* BLOQUE + DOCTOR, centrados */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 1480, height: 380}}>
          {/* bloque negro premium */}
          <div
            style={{
              position: 'absolute',
              left: 300,
              right: 0,
              top: 40,
              bottom: 40,
              background: 'linear-gradient(145deg, #16191E 0%, #0B0D10 100%)',
              borderRadius: 28,
              border: '1px solid rgba(232,200,116,0.28)',
              boxShadow: '0 50px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
              transform: `translateX(${interpolate(cardIn, [0, 1], [80, 0])}px)`,
              opacity: cardIn,
              overflow: 'hidden',
            }}
          >
            {/* filo dorado superior */}
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: GOLD_BASE, opacity: 0.7}} />
            <div style={{position: 'absolute', left: 360, top: '50%', transform: 'translateY(-50%)'}}>
              <div style={{fontFamily: FONT_SANS, fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#C9A24B', opacity: interpolate(nameWipe, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'})}}>
                {kicker}
              </div>
              {/* nombre dorado con barrido */}
              <div style={{position: 'relative', marginTop: 8, height: 86, clipPath: `inset(0 ${(1 - nameWipe) * 100}% 0 0)`}}>
                <div style={{fontFamily: FONT_DISPLAY, fontSize: 66, fontWeight: 700, letterSpacing: 1, backgroundImage: GOLD_BASE, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', whiteSpace: 'nowrap'}}>
                  {name}
                </div>
                <div style={{position: 'absolute', inset: 0, fontFamily: FONT_DISPLAY, fontSize: 66, fontWeight: 700, letterSpacing: 1, backgroundImage: GOLD_SHINE, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', whiteSpace: 'nowrap'}}>
                  {name}
                </div>
              </div>
              <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 500, letterSpacing: 1, color: '#D8DEE3', marginTop: 6, opacity: roleIn, transform: `translateY(${interpolate(roleIn, [0, 1], [10, 0])}px)`}}>
                {role}
              </div>
            </div>
          </div>

          {/* doctor superpuesto, sube desde abajo — más grande, cabeza por ENCIMA del bloque, apoyado */}
          <div
            style={{
              position: 'absolute',
              left: 84,
              bottom: -46,
              width: 500,
              height: 660,
              transform: `translateY(${interpolate(docIn, [0, 1], [240, 0])}px)`,
              opacity: docIn,
              filter: 'drop-shadow(0 30px 46px rgba(0,0,0,0.6))',
            }}
          >
            <Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom'}} />
            {/* punto verde "en línea" */}
            <div
              style={{
                position: 'absolute',
                left: 118,
                bottom: 236,
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: '#35D07F',
                border: '4px solid #0B0D10',
                boxShadow: `0 0 ${10 + dotPulse * 14}px rgba(53,208,127,${0.5 + dotPulse * 0.4})`,
                opacity: docIn,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- BRoll (documental) */
/**
 * BRoll — plano de b-roll full-bleed (foto real) con Ken Burns lento + grade navy + grano + caption.
 * Cutaway sobre el avatar para ilustrar lo que dice (creatinina, riñón, pacientes…). Estilo documental.
 */
export type BRollProps = {img?: string; caption?: string; dur?: number; kb?: number};
/* BClip — reproduce un clip H3 (mp4) a pantalla completa con micro-punch de entrada,
 * mismo grade navy + caption que BRoll, y audio ambiente NATIVO duckeado (vol). Reemplaza
 * las fotos quietas: el movimiento propio del clip da el "vlog ultra-real". */
export const BClip: React.FC<{clip: string; caption?: string; dur?: number; vol?: number; punch?: boolean}> = ({
  clip,
  caption,
  dur = 90,
  vol = 0.18,
  punch = true,
}) => {
  const frame = useCurrentFrame();
  const scale = punch ? interpolate(frame, [0, 12], [1.09, 1.0], {extrapolateRight: 'clamp', easing: easeOut}) : 1;
  const op = interpolate(frame, [0, 6, dur - 6, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const capIn = interpolate(frame, [8, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  return (
    <AbsoluteFill style={{opacity: op, background: '#05161f'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <OffthreadVideo
          src={staticFile(`broll/${clip}.mp4`)}
          volume={vol}
          style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(150deg, ${rgba(BAS.bgPanel, 0.36)}, ${rgba(BAS.bgDeep, 0.5)})`, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 46%, transparent 54%, ${rgba(BAS.bgEdge, 0.58)} 100%)`}} />
      <GrainOverlay opacity={0.05} />
      {caption && (
        <div style={{position: 'absolute', left: 70, bottom: 80, display: 'flex', alignItems: 'center', gap: 16, opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [16, 0])}px)`}}>
          <span style={{width: 6, height: 46, background: BAS.aqua, boxShadow: `0 0 16px ${rgba(BAS.aqua, 0.7)}`}} />
          <span style={{fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 700, color: '#F4F1E9', textShadow: '0 4px 20px rgba(0,0,0,0.6)'}}>{caption}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const BRoll: React.FC<BRollProps> = ({img = 'bas_broll_labreport', caption, dur = 90, kb = 1}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, dur], [1.05, 1.16], {extrapolateRight: 'clamp'});
  const px = interpolate(frame, [0, dur], [kb * -18, kb * 18], {extrapolateRight: 'clamp'});
  const op = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const capIn = interpolate(frame, [10, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  return (
    <AbsoluteFill style={{opacity: op, background: '#05161f'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img src={staticFile(`img/${img}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${px}px)`}} />
      </AbsoluteFill>
      {/* grade navy + viñeta + grano (documental) */}
      <AbsoluteFill style={{background: `linear-gradient(150deg, ${rgba(BAS.bgPanel, 0.4)}, ${rgba(BAS.bgDeep, 0.55)})`, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 115% at 50% 46%, transparent 52%, ${rgba(BAS.bgEdge, 0.6)} 100%)`}} />
      <GrainOverlay opacity={0.06} />
      {caption && (
        <div style={{position: 'absolute', left: 70, bottom: 80, display: 'flex', alignItems: 'center', gap: 16, opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [16, 0])}px)`}}>
          <span style={{width: 6, height: 46, background: BAS.aqua, boxShadow: `0 0 16px ${rgba(BAS.aqua, 0.7)}`}} />
          <span style={{fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 700, color: '#F4F1E9', textShadow: '0 4px 20px rgba(0,0,0,0.6)'}}>{caption}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- SideIllustration */
/**
 * SideIllustration — ilustración PNG transparente (Vecteezy) que FLOTA a un costado sobre el avatar
 * cuando menciona algo. Sombra suave + flotación + leve rotación + entrada + caption opcional.
 * bg transparente (overlay). Props: img (ruta en public), side, caption, dur.
 */
export type SideIllustrationProps = {img?: string; side?: 'left' | 'right'; caption?: string; dur?: number; size?: number};
export const SideIllustration: React.FC<SideIllustrationProps> = ({img = 'img/ill/bas_ill_lemon_water.png', side = 'right', caption, dur = 120, size = 460}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame, fps, config: {damping: 150, mass: 0.9}});
  const out = interpolate(frame, [dur - 12, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bob = Math.sin(frame / fps * 1.2) * 9;
  const rot = Math.sin(frame / fps * 0.8) * 2;
  const dir = side === 'right' ? 1 : -1;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: '50%', [side]: 90, transform: `translateY(-50%) translateY(${bob}px) translateX(${interpolate(inP, [0, 1], [dir * 80, 0])}px) rotate(${rot}deg) scale(${interpolate(inP, [0, 1], [0.8, 1])})`, opacity: inP, width: size, height: size, filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))'}}>
        {/* halo aqua suave detrás para integrarla al navy */}
        <div style={{position: 'absolute', inset: '10%', borderRadius: '50%', background: `radial-gradient(closest-side, ${rgba(BAS.aqua, 0.22)}, transparent 72%)`, filter: 'blur(30px)'}} />
        <Img src={staticFile(img)} style={{position: 'relative', width: '100%', height: '100%', objectFit: 'contain'}} />
      </div>
      {caption && (
        <div style={{position: 'absolute', top: '50%', [side]: 90 + size + 10, transform: 'translateY(-50%)', opacity: inP, [side === 'right' ? 'right' : 'left']: undefined}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 14}}>
            <span style={{width: 6, height: 44, background: BAS.aqua, boxShadow: `0 0 16px ${rgba(BAS.aqua, 0.7)}`}} />
            <span style={{fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 700, color: '#F4F1E9', textShadow: '0 4px 18px rgba(0,0,0,0.6)'}}>{caption}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
