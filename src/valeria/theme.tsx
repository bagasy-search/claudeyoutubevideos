/**
 * SISTEMA DE MARCA — Canal "Doctora Valeria Alcázar" (Medicina Estética Avanzada)
 * Look: EDITORIAL VINTAGE CLARO — papel crema, tinta espresso, latón/oro, anotaciones a mano.
 * Es el OPUESTO del Federer oscuro-cinematográfico: acá el fondo es CLARO (crema pergamino),
 * la tinta es MARRÓN OSCURO (alto contraste para público adulto mayor), y el acento es ORO CÁLIDO.
 * Fuente de verdad de la marca — TODO color/fuente del kit sale de acá, nada hardcodeado en los componentes.
 */
import React from 'react';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadGaramond} from '@remotion/google-fonts/EBGaramond';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';
import {loadFont as loadArchivo} from '@remotion/google-fonts/Archivo';

const {fontFamily: PLAYFAIR} = loadPlayfair();
const {fontFamily: GARAMOND} = loadGaramond();
const {fontFamily: CORMORANT} = loadCormorant();
const {fontFamily: CAVEAT} = loadCaveat();
const {fontFamily: ARCHIVO} = loadArchivo();

/** Títulos y números grandes — serif de alto contraste, elegante. */
export const FONT_DISPLAY = `${PLAYFAIR}, Georgia, 'Times New Roman', serif`;
/** Cuerpo/citas — serif legible y cálida (presbicia-friendly). */
export const FONT_SERIF = `${GARAMOND}, Georgia, serif`;
/** Serif alternativa fina para sub-líneas elegantes. */
export const FONT_SERIF_FINE = `${CORMORANT}, Georgia, serif`;
/** Anotaciones "escritas a mano" (como las de la miniatura). */
export const FONT_HAND = `${CAVEAT}, 'Segoe Script', cursive`;
/** Kickers / etiquetas / small-caps de apoyo. */
export const FONT_SANS = `${ARCHIVO}, 'Helvetica Neue', Arial, sans-serif`;

/** Paleta — papel cálido + tinta espresso + latón. */
export const VAL = {
  paper: '#F4EBD9', // fondo base crema pergamino
  paperWarm: '#EFE3CC', // crema un punto más profundo
  paperDeep: '#E7D7B8', // fondo de escenas de profundidad (NUNCA negro)
  paperEdge: '#D9C39C', // borde de viñeta / bordes suaves
  card: '#FBF5E8', // superficie de tarjeta (más clara que la página)
  cardEdge: '#E4D2AC', // borde de tarjeta
  ink: '#33251A', // tinta principal — espresso (texto)
  ink2: '#5E4A34', // tinta secundaria
  inkSoft: '#8A7355', // tinta apagada / metadatos
  gold: '#B9894A', // acento latón
  goldLite: '#D0A45E', // brillo latón
  goldDark: '#8A6636', // latón profundo (sombra del acento)
  terracotta: '#A8492E', // alerta / "atención" (chip de color)
  sage: '#5F6E42', // positivo / ✓
  onAccent: '#FBF4E6', // tinta sobre acento (oro/terracota) — crema casi blanca
  line: '#C8B085', // hairline
} as const;

export type ValMood = 'cool' | 'gold' | 'warmdark' | 'science';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** hex → rgba */
export const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/** aclara (f>0) u oscurece (f<0) un hex — f en [-1,1] */
export const shade = (hex: string, f: number): string => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const t = f < 0 ? 0 : 255;
  const p = Math.abs(f);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Fondo de escena de profundidad según el "mood" — SIEMPRE crema cálida,
 * cada mood con un tinte distinto (blush / latón / tostado / salvia). Nunca oscuro.
 */
export const moodBg = (mood: ValMood): string => {
  switch (mood) {
    case 'gold':
      return `radial-gradient(120% 120% at 50% 12%, ${shade(VAL.gold, 0.72)} 0%, ${VAL.paperWarm} 46%, ${VAL.paperDeep} 100%)`;
    case 'warmdark':
      return `radial-gradient(120% 120% at 50% 12%, ${shade(VAL.terracotta, 0.78)} 0%, ${VAL.paperWarm} 48%, ${VAL.paperDeep} 100%)`;
    case 'science':
      return `radial-gradient(120% 120% at 50% 12%, ${shade(VAL.sage, 0.8)} 0%, ${VAL.paperWarm} 48%, ${VAL.paperDeep} 100%)`;
    case 'cool':
    default:
      return `radial-gradient(120% 120% at 50% 12%, ${VAL.card} 0%, ${VAL.paperWarm} 50%, ${VAL.paperDeep} 100%)`;
  }
};

/** Sombra cálida estándar para despegar una tarjeta clara del fondo crema (necesita MÁS sombra que una oscura). */
export const CARD_SHADOW = `0 24px 60px ${rgba(VAL.ink, 0.22)}, 0 4px 14px ${rgba(VAL.ink, 0.14)}`;
export const CARD_SHADOW_SOFT = `0 16px 40px ${rgba(VAL.ink, 0.16)}`;

/** Textura de papel (grano cálido, sutil) — va como overlay a baja opacidad. */
export const PaperGrain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      mixBlendMode: 'multiply',
      opacity,
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      backgroundSize: '180px 180px',
    }}
  />
);

/** Viñeta cálida — oscurece apenas los bordes con marrón, en vez de negro. */
export const WarmVignette: React.FC<{strength?: number}> = ({strength = 0.28}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: `radial-gradient(130% 115% at 50% 42%, transparent 55%, ${rgba(VAL.ink, strength)} 100%)`,
    }}
  />
);
