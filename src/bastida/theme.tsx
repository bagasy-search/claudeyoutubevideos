/**
 * SISTEMA DE MARCA — Canal "Dr. Bastida · Salud Renal" (nefrología / riñones-creatinina +60)
 * Look: DARK-CINEMATIC NAVY DE HIDRATACIÓN + TARJETA CLÍNICA CLARA.
 * Hermano de Federer pero NO gemelo:
 *   - Ambiente OSCURO azul-navy (Federer es teal-verde). Marca = azul renal.
 *   - Acento AQUA (#34C6E0, agua/riñón) + ÁMBAR (#F2A23C, alerta creatinina) — reemplazan el DORADO de Federer.
 *   - Sistema SÍ verde / NO rojo = ADN del canal (todo el catálogo es "X que protegen / X que dañan").
 *   - Tarjeta = papel clínico CLARO con tinta oscura (alto contraste OBLIGATORIO para +60: presbicia/catarata).
 * Fuente de verdad de la marca — TODO color/fuente del kit sale de acá, nada hardcodeado en los componentes.
 */
import React from 'react';
import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadManrope} from '@remotion/google-fonts/Manrope';
import {loadFont as loadNewsreader} from '@remotion/google-fonts/Newsreader';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';

const {fontFamily: FRAUNCES} = loadFraunces();
const {fontFamily: MANROPE} = loadManrope();
const {fontFamily: NEWSREADER} = loadNewsreader();
const {fontFamily: CAVEAT} = loadCaveat();

/** Títulos y números grandes — serif editorial-clínico de alto contraste. */
export const FONT_DISPLAY = `${FRAUNCES}, Georgia, 'Times New Roman', serif`;
/** Cuerpo / citas — serif legible (presbicia-friendly). */
export const FONT_SERIF = `${NEWSREADER}, Georgia, serif`;
/** Kickers / etiquetas / small-caps / datos — sans limpia y firme. */
export const FONT_SANS = `${MANROPE}, 'Helvetica Neue', Arial, sans-serif`;
/** Números grandes (creatinina, "3 frutas") — misma sans, peso alto. */
export const FONT_NUM = `${MANROPE}, 'Helvetica Neue', Arial, sans-serif`;
/** Anotaciones "a mano" (subrayados, notas al margen). */
export const FONT_HAND = `${CAVEAT}, 'Segoe Script', cursive`;

/** Paleta — navy de hidratación (oscuro) + papel clínico claro + aqua/ámbar + veredicto SÍ/NO. */
export const BAS = {
  // --- ambiente OSCURO (nunca negro puro: navy de hidratación) ---
  bg: '#0A2536', // fondo base navy
  bgPanel: '#123449', // panel / gradiente medio
  bgDeep: '#06202F', // fondo de escenas de profundidad (más profundo)
  bgEdge: '#041721', // borde de viñeta
  // --- marca + acentos ---
  brand: '#0E3A5B', // azul renal — marca / tinta del nombre sobre papel
  brandLite: '#1E5C86', // azul renal claro
  aqua: '#34C6E0', // acento agua / hidratación (reemplaza el dorado)
  aquaLite: '#7FE0F0', // brillo aqua
  aquaDark: '#0E7F97', // aqua profundo (sombra del acento)
  amber: '#F2A23C', // ALERTA creatinina / urgencia
  amberDark: '#B96E14', // ámbar profundo
  // --- veredicto SÍ / NO (el sistema firma del canal) ---
  si: '#2FA96B', // verde — PROTEGE / ✓
  siDark: '#1C7A4A',
  no: '#D64541', // rojo — DAÑA / ✕
  noDark: '#9E2C29',
  // --- tarjeta clínica CLARA (alto contraste +60) ---
  card: '#F4F1E9', // papel clínico
  cardWarm: '#EDE8DB', // papel un punto más profundo
  cardEdge: '#DCD7C9', // borde de tarjeta
  ink: '#10202B', // tinta principal — azul-tinta casi negro (texto sobre papel)
  ink2: '#3D5866', // tinta secundaria
  inkSoft: '#6B8592', // tinta apagada / metadatos
  // --- tintas sobre acento ---
  onAqua: '#06303B', // tinta sobre aqua (casi negra azulada)
  onAmber: '#4A2A05', // tinta sobre ámbar
  onSi: '#EAFFF4', // tinta sobre verde
  onNo: '#FFECEA', // tinta sobre rojo
  onDark: '#CFE8F2', // texto claro sobre el navy (nunca blanco puro)
  line: '#264658', // hairline sobre oscuro
} as const;

/** Moods de escena de profundidad — SIEMPRE navy, cada uno con un tinte distinto. */
export type BasMood = 'water' | 'alert' | 'science' | 'calm';

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
 * Fondo de escena de profundidad según el "mood" — SIEMPRE navy de hidratación,
 * cada mood con su tinte (aqua / ámbar-alerta / aqua-ciencia / navy calmo). Nunca negro plano.
 */
export const moodBg = (mood: BasMood): string => {
  switch (mood) {
    case 'water':
      return `radial-gradient(120% 120% at 50% 10%, ${shade(BAS.aqua, -0.55)} 0%, ${BAS.bgPanel} 44%, ${BAS.bgDeep} 100%)`;
    case 'alert':
      return `radial-gradient(120% 120% at 50% 10%, ${shade(BAS.amber, -0.62)} 0%, ${BAS.bgPanel} 46%, ${BAS.bgDeep} 100%)`;
    case 'science':
      return `radial-gradient(120% 120% at 50% 10%, ${shade(BAS.brandLite, -0.35)} 0%, ${BAS.bgPanel} 48%, ${BAS.bgDeep} 100%)`;
    case 'calm':
    default:
      return `radial-gradient(120% 120% at 50% 12%, ${BAS.bgPanel} 0%, ${BAS.bg} 52%, ${BAS.bgDeep} 100%)`;
  }
};

/** Sombra estándar para despegar la tarjeta CLARA del fondo navy (una tarjeta clara necesita MÁS sombra). */
export const CARD_SHADOW = `0 26px 64px ${rgba('#000000', 0.5)}, 0 6px 18px ${rgba('#000000', 0.34)}`;
export const CARD_SHADOW_SOFT = `0 16px 40px ${rgba('#000000', 0.4)}`;
/** Glow aqua sutil para acentos activos (líneas de agua, medidor). */
export const AQUA_GLOW = `0 0 24px ${rgba(BAS.aqua, 0.5)}`;

/** Grano de película sutil (mismo idioma que Federer) — overlay a baja opacidad. */
export const GrainOverlay: React.FC<{opacity?: number}> = ({opacity = 0.05}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
      opacity,
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      backgroundSize: '180px 180px',
    }}
  />
);

/** Viñeta fría — oscurece los bordes con navy profundo (nunca negro plano). */
export const CoolVignette: React.FC<{strength?: number}> = ({strength = 0.42}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: `radial-gradient(130% 115% at 50% 40%, transparent 52%, ${rgba(BAS.bgEdge, strength)} 100%)`,
    }}
  />
);

/** Capa de "motas de agua" flotando (equivalente al MotesLayer de Federer, en aqua). Decorativa. */
export const WaterMotes: React.FC<{count?: number; frame: number; fps: number}> = ({count = 14, frame, fps}) => {
  const t = frame / fps;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const seed = (i * 97.13) % 100;
        const x = (seed / 100) * 100;
        const speed = 6 + (seed % 5);
        const y = (100 + ((t * speed + seed * 3) % 130)) % 130 - 15;
        const size = 2 + (seed % 4);
        const op = 0.12 + ((seed % 30) / 100) * 0.4;
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
              background: BAS.aquaLite,
              opacity: op,
              boxShadow: `0 0 ${size * 3}px ${rgba(BAS.aqua, 0.6)}`,
            }}
          />
        );
      })}
    </div>
  );
};
