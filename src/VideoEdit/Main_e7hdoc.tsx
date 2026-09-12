// Main_e7hdoc.tsx — documental completo "7 Construcciones Antiguas" (25 min).
// NO tiene tiempos escritos a mano: consume e7hdoc_timeline.gen.ts, que build_e7hdoc.mjs genera
// resolviendo cada ancla textual contra las captions reales de Whisper.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TIMELINE, TOTAL_FRAMES_E7HDOC, type Beat} from './e7hdoc_timeline.gen';
import {
  Scene, Seq, Bg, FilmOverlay, SUB, CREAM, GOLD, RED,
  TheoryCard, BlockCard, DeepTime, HumanScale, TheorySplit, Forensic, KnownUnknown,
  BigNumber, LowerLabel, Stamp, Kinetic, LevelBarD,
} from './e7hdoc_kit';

export {TOTAL_FRAMES_E7HDOC};

const COLORES: Record<string, string> = {SUB, CREAM, GOLD, RED};
const color = (c: any) => (typeof c === 'string' && COLORES[c]) ? COLORES[c] : c;

// mapea {c: 'Nombre', ...props} → el componente real del kit
const Overlay: React.FC<{o: any}> = ({o}) => {
  const p: any = {...o};
  delete p.c;
  if (p.color) p.color = color(p.color);
  if (p.lines) p.lines = p.lines.map((l: any) => ({...l, color: color(l.color)}));
  switch (o.c) {
    case 'TheoryCard':   return <TheoryCard {...p} />;
    case 'BlockCard':    return <BlockCard {...p} />;
    case 'DeepTime':     return <DeepTime {...p} />;
    case 'HumanScale':   return <HumanScale {...p} />;
    case 'TheorySplit':  return <TheorySplit {...p} />;
    case 'Forensic':     return <Forensic {...p} />;
    case 'KnownUnknown': return <KnownUnknown {...p} />;
    case 'BigNumber':    return <BigNumber {...p} />;
    case 'LowerLabel':   return <LowerLabel {...p} />;
    case 'Stamp':        return <Stamp {...p} />;
    case 'Kinetic':      return <Kinetic {...p} />;
    case 'LevelBarD':    return <LevelBarD {...p} />;
    default:             return null;
  }
};

// un overlay ocupa su plano entero salvo que pida menos (deja aire al final para que respire el corte)
const AIRE = 0.12;

export const MainE7hdoc: React.FC = () => (
  <AbsoluteFill style={{background: '#0b0b0c'}}>
    <Audio src={staticFile('e7hdoc_mix.wav')} />

    {TIMELINE.map((b: Beat, i: number) => (
      <Scene key={`bg${i}`} s={b.s} e={b.e} name={`${b.bloque}-${i}`}>
        <Bg {...b.bg} />
      </Scene>
    ))}

    {TIMELINE.map((b: Beat, i: number) =>
      (b.ov || []).map((o: any, j: number) => (
        <Seq key={`ov${i}_${j}`} s={b.s + (o.at || 0)} e={Math.max(b.s + 0.5, b.e - AIRE)} name={`${b.bloque}-${i}-${o.c}`}>
          <Overlay o={o} />
        </Seq>
      ))
    )}

    <FilmOverlay />
  </AbsoluteFill>
);
