// Motor de Boone's Dog Yard largo: el video es una Series de segmentos (toma suelta | raza) armada desde plan_<slug>.json.
// Raza: t1 campo → t2 abre la PUERTA DE LUZ al Corral (número detrás del perro + fichas) → t3 Corral (la trampa)
//       → [t5 campo] → t4 campo (anécdota) con la etiqueta EASE x/5 cayendo cuando la nombra. La voz de Boone nunca se corta.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, Series, staticFile, useCurrentFrame} from 'remotion';
import {Capsula, Etiqueta, Ficha, Fichas, FilaT, FPS, Grano, Insignia, LuzPuerta, Numero, Rotulo, Tablero, kf, puerta, sfx, sonidosFichas} from './kit';

export type Toma = {id: string; clip: string; ini: number; dur: number};
export type Ov =
  | {tipo: 'capsula'; at: number}
  | {tipo: 'tablero'; at: number; dur: number; filas: FilaT[]; activa?: string; lado?: 'der' | 'centro'}
  | {tipo: 'etiqueta'; at: number; dur: number; nota: string}
  | {tipo: 'rotulo'; at: number; dur: number; arriba: string; txt: string}
  | {tipo: 'fichas'; at: number; dur: number; items: Ficha[]};
export type SegToma = {tipo: 'toma'; t: Toma; ovs?: Ov[]};
export type Corral = {clip: string; corte?: string; ini?: number};
export type SegRaza = {tipo: 'raza'; n: number; nombre: string; tier: string; ease: number; ficha: Record<string, string>;
  t1: Toma; t2: Toma; t3: Toma; t5?: Toma; t4: Toma; corral: Corral[]; tagAt: number; bt?: number};
export type Seg = SegToma | SegRaza;
export type Plan = {slug: string; segs: Seg[]};

export const durSeg = (s: Seg) => s.tipo === 'toma' ? s.t.dur : s.t1.dur + s.t2.dur + s.t3.dur + (s.t5?.dur ?? 0) + s.t4.dur;
export const durPlan = (p: Plan) => p.segs.reduce((a, s) => a + durSeg(s), 0);
const fr = (s: number) => Math.round(s * FPS);
const src = (c: string) => staticFile(c);

const Clip: React.FC<{t: Toma; from: number; dur?: number; muted?: boolean; extra?: number}> = ({t, from, dur, muted, extra = 0}) => (
  <Sequence from={from} durationInFrames={dur ?? t.dur}>
    <OffthreadVideo src={src(t.clip)} trimBefore={fr(t.ini) + extra} muted={muted} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  </Sequence>
);
const Voz: React.FC<{t: Toma; from: number}> = ({t, from}) => (
  <Sequence from={from} durationInFrames={t.dur}><Audio src={src(t.clip)} trimBefore={fr(t.ini)} /></Sequence>
);

const Overlays: React.FC<{ovs: Ov[]}> = ({ovs}) => (
  <>
    {ovs.map((o, i) => {
      const from = fr(o.at);
      if (o.tipo === 'capsula') return <Sequence key={i} from={from} durationInFrames={fr(4)}><Capsula /></Sequence>;
      if (o.tipo === 'tablero') return <Sequence key={i} from={from} durationInFrames={fr(o.dur)}><Tablero filas={o.filas} activa={o.activa} dur={fr(o.dur)} lado={o.lado} /></Sequence>;
      if (o.tipo === 'etiqueta') return <Sequence key={i} from={from} durationInFrames={fr(o.dur)}><Etiqueta nota={o.nota} dur={fr(o.dur)} /></Sequence>;
      if (o.tipo === 'rotulo') return <Sequence key={i} from={from} durationInFrames={fr(o.dur)}><Rotulo arriba={o.arriba} txt={o.txt} dur={fr(o.dur)} /></Sequence>;
      if (o.tipo === 'fichas') return <Sequence key={i} from={from} durationInFrames={fr(o.dur)}><FichasSeq items={o.items} dur={fr(o.dur)} /></Sequence>;
      return null;
    })}
  </>
);
const FichasSeq: React.FC<{items: Ficha[]; dur: number}> = ({items, dur}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill><Fichas items={items} t={f / FPS} dur={dur / FPS} />{sonidosFichas(items)}</AbsoluteFill>;
};

export const SegTomaC: React.FC<{s: SegToma}> = ({s}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Clip t={s.t} from={0} muted />
    <Voz t={s.t} from={0} />
    <Overlays ovs={s.ovs ?? []} />
  </AbsoluteFill>
);

const PUERTA_INI = 0.35, PUERTA = 0.75;
export const SegRazaC: React.FC<{s: SegRaza}> = ({s}) => {
  const f = useCurrentFrame();
  const o2 = s.t1.dur, o3 = o2 + s.t2.dur, o5 = o3 + s.t3.dur, o4 = o5 + (s.t5?.dur ?? 0), fin = o4 + s.t4.dur;
  const fP = o2 + fr(PUERTA_INI);                     // arranca la puerta de luz
  const p = kf((f - fP) / FPS, [0, PUERTA], [0, 1]);
  const glow = Math.min(kf((f - fP) / FPS, [0, 0.2], [0, 1]), kf((f - fP) / FPS, [PUERTA - 0.05, PUERTA + 0.4], [1, 0]));
  const enCorral = f >= fP && f < o5;
  const tC = (f - fP) / FPS, durC = (o5 - fP) / FPS;   // segundos de Corral
  const salida = kf((f - o5) / FPS, [-0.15, 0, 0.3], [0, 1, 0]);
  const ff = s.ficha;
  const fichas: Ficha[] = [
    {lab: 'Weight', val: ff.peso, t: 1.6}, {lab: 'Lifespan', val: ff.anios, t: 3.0}, {lab: 'Walks', val: ff.paseo, t: 4.4},
    {lab: 'Coat', val: ff.pelo, t: (o3 - fP) / FPS + 0.4}, {lab: 'Vet', val: ff.vet, t: (o3 - fP) / FPS + 1.6},
    {lab: 'The catch', val: ff.trampa, t: (o3 - fP) / FPS + 2.8, fuerte: true},
  ];
  // Corral: k1 durante t2; t3 = k2 y k3 a medias (o entero el de bullet time)
  const mitad = o3 + Math.round(s.t3.dur / 2);
  const tramos: [number, number, Corral][] = [[fP, o3, s.corral[0]]];
  if (s.bt === 1) tramos.push([o3, o5, s.corral[1]]);
  else if (s.bt === 2) tramos.push([o3, o5, s.corral[2]]);
  else tramos.push([o3, mitad, s.corral[1]], [mitad, o5, s.corral[2] ?? s.corral[1]]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* campo */}
      <Clip t={s.t1} from={0} muted />
      <Clip t={s.t2} from={o2} dur={fP - o2 + fr(PUERTA) + 2} muted />
      {s.t5 && <Clip t={s.t5} from={o5} muted />}
      <Clip t={s.t4} from={o4} muted />
      {/* voz entera */}
      <Voz t={s.t1} from={0} /><Voz t={s.t2} from={o2} /><Voz t={s.t3} from={o3} />{s.t5 && <Voz t={s.t5} from={o5} />}<Voz t={s.t4} from={o4} />
      {/* Corral */}
      {tramos.map(([a, b, c], i) => (
        <Sequence key={'k' + i} from={a} durationInFrames={b - a}>
          <AbsoluteFill style={{clipPath: i === 0 && p < 1 ? puerta(p).clip : undefined}}>
            <OffthreadVideo src={src(c.clip)} trimBefore={fr(c.ini ?? 0.2)} volume={0.32} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            {i === 0 && <Numero n={s.n} nombre={s.nombre} tier={s.tier} t={tC} dur={(o3 - fP) / FPS} />}
            {i === 0 && c.corte && <OffthreadVideo src={src(c.corte)} transparent trimBefore={fr(c.ini ?? 0.2)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />}
          </AbsoluteFill>
        </Sequence>
      ))}
      {enCorral && <AbsoluteFill><Fichas items={fichas} t={tC} dur={durC} /></AbsoluteFill>}
      <Sequence from={fP}>{sonidosFichas(fichas)}</Sequence>
      <LuzPuerta p={p} fade={glow} />
      <Sequence from={fP - 4} durationInFrames={fr(2)}><Audio src={sfx('puerta_luz')} volume={0.5} /></Sequence>
      {/* vuelta al campo: destello corto */}
      {salida > 0 && <AbsoluteFill style={{background: `rgba(255,246,228,${salida * 0.85})`}} />}
      <Sequence from={o5 - 5} durationInFrames={fr(1.2)}><Audio src={sfx('puerta_luz')} volume={0.3} playbackRate={1.4} /></Sequence>
      {/* insignia de la cuenta regresiva en el campo */}
      {(f < fP || f >= o5) && f < fin && <Insignia n={s.n} tier={s.tier} />}
      {/* la etiqueta EASE cae cuando Boone dice el puntaje */}
      <Sequence from={o4 + fr(s.tagAt)} durationInFrames={fr(3.4)}><Etiqueta nota={`${s.ease}/5`} dur={fr(3.4)} /></Sequence>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{plan: Plan}> = ({plan}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Series>
      {plan.segs.map((s, i) => (
        <Series.Sequence key={i} durationInFrames={durSeg(s)}>
          {s.tipo === 'toma' ? <SegTomaC s={s} /> : <SegRazaC s={s} />}
        </Series.Sequence>
      ))}
    </Series>
    <Grano />
  </AbsoluteFill>
);
