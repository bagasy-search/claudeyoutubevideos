/**
 * MatchWhip — sistema de UNIÓN SIN CORTES para el canal Dr. Bastida.
 *
 * Problema que resuelve: el `Whip` viejo hacía un fade de opacidad + flash. Eso se LEE como
 * "una escena termina y empieza otra" (diapositivas). El creador pidió que los componentes se
 * sientan UNO SOLO, un plano continuo — no un corte.
 *
 * Cómo lo logra (3 principios de continuidad de cámara):
 *  1) VECTOR COMPARTIDO: la escena que sale se va por un vector (ej. hacia la izquierda) y la que
 *     entra llega por el MISMO vector. El ojo sigue el movimiento; el cerebro lo interpreta como
 *     UN paneo de cámara, no como dos escenas. Si escenas consecutivas usan el mismo `dir`, la
 *     cámara "viaja" en línea recta por todo el tramo.
 *  2) MOTION-BLUR en el pico: en el instante del cambio hay un pico de blur + estiramiento
 *     (whip-pan). Nadie ve el frame exacto del corte porque está barrido.
 *  3) LUZ PERSISTENTE: una estela aqua barre el cuadro cruzando el límite. La misma luz que apaga
 *     la escena A enciende la B → un elemento sobrevive al corte.
 *
 * El FONDO navy de hidratación es COMPARTIDO por todas las escenas (se dibuja en el Main, debajo),
 * así que el "mundo" nunca cambia: cambian los objetos dentro de él.
 *
 * Uso (drop-in del Whip viejo, por escena):
 *   <MatchWhip dur={d.dur} dir={d.dir} lead>{d.node}</MatchWhip>
 * Para continuidad de paneo, pasar el MISMO `dir` a escenas consecutivas del tramo.
 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, rgba} from './theme';

export type WhipDir = 'left' | 'right' | 'up' | 'down' | 'in' | 'out';

const easeIO = Easing.bezier(0.4, 0, 0.2, 1);

/** vector unitario (en px de desplazamiento máximo) por dirección. */
const vec = (dir: WhipDir, w: number, h: number): {x: number; y: number; s: number} => {
  const A = Math.round(w * 0.16); // amplitud del paneo
  switch (dir) {
    case 'left': return {x: -A, y: 0, s: 1};
    case 'right': return {x: A, y: 0, s: 1};
    case 'up': return {x: 0, y: -Math.round(h * 0.22), s: 1};
    case 'down': return {x: 0, y: Math.round(h * 0.22), s: 1};
    case 'in': return {x: 0, y: 0, s: 1.14};   // la cámara empuja hacia adentro
    case 'out': return {x: 0, y: 0, s: 0.9};   // la cámara retrocede
    default: return {x: -A, y: 0, s: 1};
  }
};

export const MatchWhip: React.FC<{
  dur: number;
  dir?: WhipDir;
  children: React.ReactNode;
  /** frames del whip de entrada/salida (default 9). */
  ramp?: number;
  /** estela de luz aqua que cruza el límite (default true). */
  sweep?: boolean;
  /** blur máximo del pico (default 22). */
  maxBlur?: number;
}> = ({dur, dir = 'left', children, ramp = 9, sweep = true, maxBlur = 22}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const v = vec(dir, width, height);

  // ── ENTRADA: llega por el vector, con blur que se disuelve ──
  const inP = interpolate(f, [0, ramp], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeIO});
  // ── SALIDA: se va por el MISMO vector (sentido de continuidad de paneo) ──
  const outP = interpolate(f, [dur - ramp, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeIO});

  // desplazamiento: entra desde +v → 0 → sale hacia -v (paneo continuo en el mismo eje)
  const tx = interpolate(inP, [0, 1], [v.x, 0]) + interpolate(outP, [0, 1], [0, -v.x]);
  const ty = interpolate(inP, [0, 1], [v.y, 0]) + interpolate(outP, [0, 1], [0, -v.y]);
  // escala: para 'in'/'out' el push de cámara se mantiene entre escenas
  const scEnter = interpolate(inP, [0, 1], [dir === 'in' ? 1.14 : dir === 'out' ? 0.9 : 1.05, 1]);
  const scExit = interpolate(outP, [0, 1], [1, dir === 'in' ? 1.08 : dir === 'out' ? 0.94 : 0.98]);
  const scale = scEnter * scExit;

  // blur: pico en los bordes (whip), 0 en el centro de la escena
  const blur = Math.max(interpolate(inP, [0, 1], [maxBlur, 0]), interpolate(outP, [0, 1], [0, maxBlur]));

  // la escena está a full opacidad casi todo el tiempo; solo se apaga en el último tramo del whip
  const op = interpolate(outP, [0.55, 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: op}}>
      <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${scale})`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        {children}
      </AbsoluteFill>
      {sweep && <LightSweep dur={dur} ramp={ramp} dir={dir} />}
    </AbsoluteFill>
  );
};

/**
 * LightSweep — estela aqua que barre el cuadro en los bordes de la escena. Colocada por MatchWhip
 * al inicio (enciende) y al final (apaga); como dos escenas consecutivas comparten el instante del
 * límite, la estela de salida de A y la de entrada de B se encadenan → una sola luz que cruza.
 */
export const LightSweep: React.FC<{dur: number; ramp: number; dir: WhipDir}> = ({dur, ramp, dir}) => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  const horizontal = dir === 'left' || dir === 'right' || dir === 'in' || dir === 'out';
  const sign = dir === 'right' || dir === 'down' ? 1 : -1;

  // dos barridos: uno al entrar (0..ramp) y uno al salir (dur-ramp..dur)
  const enter = interpolate(f, [0, ramp * 1.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exit = interpolate(f, [dur - ramp, dur + ramp * 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const active = f < ramp * 1.4 ? enter : f > dur - ramp ? exit : -1;
  if (active < 0) return null;

  const pos = (active * 160 - 30) * sign; // -30%..130% cruzando el cuadro
  const band = width * 0.5;
  const alpha = Math.sin(active * Math.PI) * 0.5;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          bottom: '-20%',
          left: horizontal ? `${pos}%` : 0,
          right: horizontal ? undefined : 0,
          width: horizontal ? band : '100%',
          height: horizontal ? undefined : band,
          transform: horizontal ? 'skewX(-12deg)' : 'skewY(-12deg)',
          background: `linear-gradient(${horizontal ? '90deg' : '180deg'}, transparent, ${rgba(BAS.aquaLite ?? BAS.aqua, alpha)}, ${rgba('#ffffff', alpha * 0.7)}, ${rgba(BAS.aquaLite ?? BAS.aqua, alpha)}, transparent)`,
          filter: 'blur(14px)',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * CardMorph — el movimiento "la tarjeta del carrusel SE CONVIERTE en la próxima escena" (y vuelve).
 * Toma una imagen (la fruta enfocada) y la agranda desde su posición en el anillo hasta llenar la
 * pantalla; adentro se revela el contenido de la escena siguiente. Cero corte: es la misma tarjeta
 * que crece. `phase`: 'grow' (carrusel→fullscreen) | 'shrink' (fullscreen→carrusel).
 */
export const CardMorph: React.FC<{
  img?: string;
  tint?: string;
  dur: number;
  phase?: 'grow' | 'shrink';
  fromRect?: {x: number; y: number; w: number; h: number}; // posición de la tarjeta en el anillo (px)
  children?: React.ReactNode;
}> = ({img, tint = BAS.aqua, dur, phase = 'grow', fromRect, children}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const p0 = interpolate(f, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeIO});
  const p = phase === 'grow' ? p0 : 1 - p0;

  const start = fromRect ?? {x: width / 2, y: height * 0.54, w: 360, h: 460};
  const x = interpolate(p, [0, 1], [start.x, width / 2]);
  const y = interpolate(p, [0, 1], [start.y, height / 2]);
  const w = interpolate(p, [0, 1], [start.w, width]);
  const h = interpolate(p, [0, 1], [start.h, height]);
  const radius = interpolate(p, [0, 1], [30, 0]);
  const contentOp = interpolate(p, [0.55, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          transform: 'translate(-50%,-50%)',
          borderRadius: radius,
          overflow: 'hidden',
          boxShadow: `0 40px 90px ${rgba('#0a2230', 0.5)}`,
          background: img ? `#0b1f2b url(${img})` : tint,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* el contenido de la escena entra cuando la tarjeta ya casi llenó la pantalla */}
        <AbsoluteFill style={{opacity: contentOp}}>{children}</AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
