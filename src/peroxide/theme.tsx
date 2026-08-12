/**
 * SISTEMA DE MARCA — Nicho "AGUA OXIGENADA / HYDROGEN PEROXIDE TRICKS"
 * Reusable por TEMA (no por canal): sirve al canal EN inglés y al ES con otros avatares.
 *
 * Look: LIMPIO + SATISFACTORIO. Baño/electrodoméstico brillante, azulejo blanco,
 *   frescura menta-aqua, y el HÉROE de la marca = la BOTELLA ámbar de agua oxigenada
 *   (cuerpo marrón translúcido, etiqueta blanca, tapa azul) — igual al producto real
 *   de las miniaturas. Acento AZUL clínico (#1FA9E0) + LIMA "verificado/limpio".
 *   Espuma BLANCA que crece = el gesto firma del nicho.
 *
 * Fuente de verdad: TODO color/fuente/SFX del kit sale de acá. Nada hardcodeado suelto.
 */
import React from 'react';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadManrope} from '@remotion/google-fonts/Manrope';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';

const {fontFamily: ANTON} = loadAnton();
const {fontFamily: MANROPE} = loadManrope();
const {fontFamily: CAVEAT} = loadCaveat();

/** Titulares / "TRUCO #3" / números gigantes — grotesca condensada de alto impacto. */
export const FONT_DISPLAY = `${ANTON}, 'Arial Narrow', Impact, sans-serif`;
/** Cuerpo, etiquetas, sub — sans limpia y firme. */
export const FONT_SANS = `${MANROPE}, 'Helvetica Neue', Arial, sans-serif`;
/** Anotaciones "a mano" (flechas, "¡mirá!"). */
export const FONT_HAND = `${CAVEAT}, 'Segoe Script', cursive`;

/** Paleta — limpio brillante + botella ámbar + azul clínico + lima verificado + espuma. */
export const PX = {
  // --- ambiente CLARO limpio (baño/azulejo/electrodoméstico) ---
  bg: '#EAF4F4', // fondo base menta-hielo muy claro
  bgHi: '#F7FCFB', // brillo superior (gradiente)
  bgLo: '#CFE4E6', // sombra inferior (gradiente)
  tile: '#FFFFFF', // azulejo / superficie limpia
  tileLine: '#D3E3E4', // junta de azulejo
  // --- azul clínico (tapa / acento / "peróxido") ---
  blue: '#1FA9E0',
  blueDeep: '#0E7CB0',
  blueLite: '#8FD8F2',
  // --- lima "verificado / limpio / funciona" ---
  lime: '#8BD450',
  limeDeep: '#5AA82A',
  // --- alerta "sucio / NO / mancha" ---
  warn: '#E86A3A',
  warnDeep: '#B44518',
  // --- botella ámbar (producto real) ---
  amber: '#7A3B12', // cuerpo de la botella (marrón translúcido)
  amberHi: '#B4692E', // brillo del vidrio
  amberLo: '#4A2109', // sombra del vidrio
  liquid: '#F4F0E2', // líquido peróxido dentro (casi transparente cálido)
  // --- espuma ---
  foam: '#FFFFFF',
  foamShade: '#E7F2F0',
  // --- tinta ---
  ink: '#122A31', // texto principal
  ink2: '#3C5964', // secundario
  inkSoft: '#6E8B93', // metadatos
  onBlue: '#F2FBFF',
  onLime: '#0F2A05',
  line: '#C4DADC',
} as const;

/** Roles SFX del nicho (foley real CC0 de Freesound; definidos en VideoEdit/components/Sfx.tsx). */
export const PX_SFX = {
  capPop: 'capPop', // tapa que se destapa
  gluglu: 'gluglu', // glú-glú al verter
  fizz: 'fizz', // espuma que crece
  spray: 'spray', // rociador
  bubble: 'bubble', // burbujitas
  wipe: 'wipe', // paño al frotar
  sparkleClean: 'sparkleClean', // sello ¡LIMPIO!
} as const;

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const spr = {damping: 16, mass: 0.8, stiffness: 140} as const; // resorte estándar del kit
export const sec = (s: number, fps = 30) => Math.round(s * fps);

/** hex → rgba */
export const rgba = (hex: string, a: number): string => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/** aclara (f>0) u oscurece (f<0) un hex — f en [-1,1] */
export const shade = (hex: string, f: number): string => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/** Fondo estándar del nicho: limpio menta-hielo con leve viñeta cálida. */
export const cleanBg = (): string =>
  `radial-gradient(120% 100% at 50% 0%, ${PX.bgHi} 0%, ${PX.bg} 52%, ${PX.bgLo} 100%)`;

export const CARD_SHADOW = `0 22px 54px ${rgba('#0E2A31', 0.18)}, 0 4px 14px ${rgba('#0E2A31', 0.12)}`;
export const CARD_SHADOW_SOFT = `0 12px 30px ${rgba('#0E2A31', 0.14)}`;
export const BLUE_GLOW = `0 0 26px ${rgba(PX.blue, 0.5)}`;

/** Azulejo de baño sutil (superficie limpia por defecto). */
export const TileBg: React.FC<{size?: number; opacity?: number}> = ({size = 96, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity,
      background: cleanBg(),
      backgroundImage:
        `linear-gradient(${PX.tileLine} 1px, transparent 1px), linear-gradient(90deg, ${PX.tileLine} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px, ${size}px ${size}px`,
      backgroundPosition: 'center',
    }}
  />
);

/** Motas / gotitas de brillo flotando (frescura). Decorativa. */
export const SparkleLayer: React.FC<{count?: number; frame: number; fps: number}> = ({count = 12, frame, fps}) => {
  const t = frame / fps;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const seed = (i * 97.13) % 100;
        const x = (seed / 100) * 100;
        const speed = 5 + (seed % 5);
        const y = (100 + ((t * speed + seed * 3) % 130)) % 130 - 15;
        const size = 3 + (seed % 4);
        const op = 0.1 + ((seed % 30) / 100) * 0.35;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: PX.blueLite,
              opacity: op,
              boxShadow: `0 0 ${size * 3}px ${rgba(PX.blue, 0.6)}`,
            }}
          />
        );
      })}
    </div>
  );
};
