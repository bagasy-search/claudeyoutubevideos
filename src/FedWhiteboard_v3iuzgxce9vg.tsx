/**
 * ============================================================================
 * FedWhiteboard v3 — "La pizarra del Dr. Federer"
 * ----------------------------------------------------------------------------
 * DOS TEMAS (prop `theme`):
 *   · 'white' (default) → pizarra BLANCA real. Texto negro legible, algunos
 *      resaltados en amarillo (highlighter), y callouts de FONDO ROJO con
 *      texto BLANCO. Marcadores rojo/negro/azul en la bandeja.
 *   · 'dark' → pizarrón oscuro tiza+dorado (look anterior).
 *
 * Pizarra CASI full-frame; el avatar queda como un PiP CHICO en la esquina.
 *
 * Realismo: todo trazo pasa por filtro rugoso (mano), marcador doble trazo,
 * manuscrita palabra-x-palabra con jitter, superficie con smudges/fantasmas,
 * marco + bandeja, cámara que enfoca lo activo.
 *
 * DATA-DRIVEN: editás SCENE.elements. Coords x,y = CENTRO en % de la pizarra.
 * Preview:  npx remotion studio src/FedWhiteboard.tsx
 *
 * ─────────────────────────── KIT DE PRIMITIVOS (reutilizable) ────────────────
 * Componés la pizarra combinando estos elementos (todos con `start` en seg):
 *   · title  — encabezado manuscrito + subrayado.
 *   · card   — MÓDULO ORDENADO: imagen enmarcada + título + mini-descripción.
 *              Úsalo para flujos limpios en grilla (station 1 → 2 → 3).
 *   · pair   — fila "imagen–texto" chica. Apilá varias para armar una LISTA.
 *   · lasso  — círculo/óvalo a mano que ENCIERRA una zona (x,y centro, w,h).
 *              Patrón humano: apilás pairs → los encerrás con un lasso →
 *              una `arrow` sale del lasso y apunta a una card/imagen.
 *   · note   — texto suelto. Variantes: highlight (amarillo), fill (rojo+blanco),
 *              accent (color marcador), bullet, box.
 *   · image  — foto suelta (con cinta/duotono). `cutout:true` = PNG sin fondo.
 *   · arrow  — flecha a mano (from→to en %, curve). Conecta cosas con sentido.
 *   · video  — clip en monitor sobre la pizarra.
 *
 * CÁMARA: definí `scene.cameras` (keyframes {time,fx,fy,z}) para un recorrido
 * suave que CONSTRUYE el diagrama por zonas y abre al final. El MARCO está
 * anclado al lienzo: al hacer zoom los bordes se van de pantalla.
 *
 * TEMAS: prop `theme` = 'white' (pizarra blanca) | 'dark' (pizarrón dorado).
 * Para un video real: sincronizá cada `start` (y cameras) a los timestamps de
 * Whisper del avatar, y usá el audio del avatar como pista maestra.
 * ============================================================================
 */

import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';
import {loadFont as loadKalam} from '@remotion/google-fonts/Kalam';
import {loadFont as loadPatrick} from '@remotion/google-fonts/PatrickHand';

const {fontFamily: CAVEAT} = loadCaveat();
const {fontFamily: KALAM} = loadKalam();
const {fontFamily: PATRICK} = loadPatrick();

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rgba = (hex: string, a: number): string => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = Number.parseInt(f, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ================================ TEMAS ================================= */

type ThemeKey = 'white' | 'dark';
type Theme = {
  key: ThemeKey;
  ink: string; // texto principal
  inkDim: string; // captions
  accent: string; // flechas, subrayado, círculo
  hi: string; // highlighter
  hiBlend: 'normal' | 'screen' | 'multiply';
  hiAlpha: number;
  fillBg: string; // callout sólido
  fillInk: string; // texto sobre callout
  bg: string; // fondo pantalla
  photoDuotone: boolean;
};

const THEME_WHITE: Theme = {
  key: 'white',
  ink: '#22262E',
  inkDim: 'rgba(40,46,56,0.5)',
  accent: '#E23B3B',
  hi: '#FFD21E',
  hiBlend: 'multiply',
  hiAlpha: 0.85,
  fillBg: '#E23B3B',
  fillInk: '#FFFFFF',
  bg: '#d9dbe0',
  photoDuotone: false,
};

const THEME_DARK: Theme = {
  key: 'dark',
  ink: '#EEF4EE',
  inkDim: 'rgba(223,233,226,0.6)',
  accent: '#EDB851',
  hi: '#F2C14E',
  hiBlend: 'screen',
  hiAlpha: 0.32,
  fillBg: '#EDB851',
  fillInk: '#20180a',
  bg: '#04070a',
  photoDuotone: true,
};

const ThemeCtx = React.createContext<Theme>(THEME_WHITE);

/* ================= GEOMETRÍA: pizarra grande + avatar PiP =============== */

const BOARD = {left: 0.02, top: 0.028, w: 0.96, h: 0.945};
const FRAME_PAD = 13;
const PIP = {w: 0.15, marginR: 0.022, marginB: 0.032}; // esquina inf. der., recorte 3:4
// Encuadre del avatar DENTRO del recuadro: el cover a 3:4 dejaba ver todo el set con la cara chica.
// PIP_ZOOM acerca a CABEZA/HOMBROS; PIP_FOCUS = origen del zoom (arriba-centro, donde está la cara).
// Subí PIP_ZOOM si el presentador queda chico; bajalo si le corta la cabeza.
// Encuadre del avatar en el recuadro. OJO: si el clip del avatar es un PLANO ABIERTO (presentador al
// costado de un set/pizarra grande), ningún valor lo vuelve un primer plano limpio → para el PiP más
// prolijo, alimentá la pizarra con un clip del avatar en plano CERRADO (cabeza y hombros).
const PIP_ZOOM = 1.7;
const PIP_FOCUS = '19% 24%'; // el presentador suele estar a la IZQUIERDA-ARRIBA del cuadro (no al centro)

const BoardCtx = React.createContext<{w: number; h: number}>({w: 1, h: 1});

/* =============================== TIPOS / DATA =========================== */

type BoardEl =
  | {t: 'title'; x: number; y: number; text: string; start: number; size?: number}
  | {
      t: 'note';
      x: number;
      y: number;
      text: string;
      start: number;
      w?: number;
      size?: number;
      accent?: boolean;
      highlight?: boolean; // resaltado amarillo (texto queda oscuro)
      fill?: boolean; // callout fondo rojo, texto blanco
      bullet?: boolean;
      box?: boolean;
      align?: 'left' | 'center';
    }
  | {
      t: 'image';
      x: number;
      y: number;
      w: number;
      src: string;
      start: number;
      caption?: string;
      circle?: boolean;
      cutout?: boolean;
      duotone?: boolean;
      rot?: number;
    }
  | {t: 'video'; x: number; y: number; w: number; src: string; start: number; caption?: string; rot?: number}
  // MÓDULO ORDENADO: imagen enmarcada + título + mini-descripción (una unidad)
  | {t: 'card'; x: number; y: number; w: number; src: string; label: string; caption: string; start: number; circle?: boolean}
  // FILA imagen–texto (para armar listas "hechas a mano")
  | {t: 'pair'; x: number; y: number; w: number; src: string; text: string; start: number; size?: number}
  // LAZO: círculo/óvalo a mano que ENCIERRA una zona (x,y centro · w,h tamaño en %)
  | {t: 'lasso'; x: number; y: number; w: number; h: number; start: number; rot?: number}
  | {t: 'arrow'; from: [number, number]; to: [number, number]; start: number; curve?: number};

type CamKf = {time: number; fx: number; fy: number; z: number};
type Scene = {avatarSrc: string; elements: BoardEl[]; cameras?: CamKf[]; muted?: boolean};

/* ------------- ESCENA SINCRONIZADA AL AVATAR (timestamps Whisper) --------
 * El contenido de la pizarra aparece cuando el doctor lo DICE. La cámara hace
 * zoom a cada zona con anticipación. Audio maestro = el propio avatar (PiP).
 * Anclas (s): cremas 2.49 · decepción 12.91 · dermatólogos 16.01 ·
 * cocina/jardín 27.2 · ROMERO 29.0 · ciencia 34.11 · sorprendente 37.26.
 * ---------------------------------------------------------------------- */
/* DISEÑO ORDENADO: un FLUJO horizontal de 4 tarjetas iguales (imagen+título+
 * mini-descripción), equiespaciadas en una grilla, conectadas por flechas que
 * significan "lleva a". Header arriba, conclusión abajo. La cámara construye el
 * diagrama de izquierda a derecha y al final abre para mostrarlo completo. */
export const SCENE_ROMERO: Scene = {
  avatarSrc: staticFile('med/avatar.mp4'),
  cameras: [
    {time: 0.0, fx: 30, fy: 13, z: 1.12}, // header
    {time: 2.3, fx: 17, fy: 42, z: 1.42}, // lista de problemas (izq)
    {time: 15.5, fx: 50, fy: 15, z: 1.3}, // beat "el secreto" (nota centrada)
    {time: 28.3, fx: 38, fy: 45, z: 1.35}, // reveal: lazo → flecha → ROMERO
    {time: 33.6, fx: 67, fy: 46, z: 1.5}, // Colágeno
    {time: 35.6, fx: 82, fy: 44, z: 1.5}, // Su piel
    // zoom-out DESPUÉS de que los últimos elementos ya están escritos, y HOLD
    // de ~3.5s mostrando el diagrama completo (nada aparece "durante" la salida)
    {time: 39.6, fx: 50, fy: 46, z: 1.0}, // recap (se mantiene hasta el final)
  ],
  elements: [
    // HEADER
    {t: 'title', x: 4, y: 6, text: 'Cómo el romero rejuvenece su piel', start: 0.5},

    // LISTA "hecha a mano": 3 filas imagen–texto (los problemas)
    {t: 'pair', x: 16, y: 30, w: 24, src: staticFile('med/crema.png'), text: 'Cremas caras', start: 2.5},
    {t: 'pair', x: 16, y: 42, w: 24, src: staticFile('med/vapor.png'), text: 'Promesas de humo', start: 8.0},
    {t: 'pair', x: 16, y: 54, w: 24, src: staticFile('med/antes_despues.png'), text: 'La misma piel', start: 12.5},
    // …y todo eso se ENCIERRA en un lazo
    {t: 'lasso', x: 15, y: 42, w: 30, h: 40, start: 13.8, rot: -3},

    // BEAT central "el secreto"
    {t: 'note', x: 50, y: 15, w: 26, text: 'Lo que los dermatólogos no le dicen', start: 15.9, fill: true, align: 'center'},

    // …una FLECHA sale del lazo y apunta a la solución
    {t: 'arrow', from: [30, 44], to: [39, 45], start: 28.4, curve: -0.3},

    // FLUJO de tarjetas: ROMERO → Colágeno → Su piel (grilla x = 47·67·86)
    {t: 'card', x: 47, y: 46, w: 15, src: staticFile('med/romero.png'), label: 'Romero', caption: 'Crece en su\ncocina o jardín', start: 29.0, circle: true},
    {t: 'card', x: 67, y: 46, w: 15, src: staticFile('med/colageno.png'), label: 'Colágeno', caption: 'La ciencia lo estudió\ndurante décadas', start: 34.0},
    {t: 'card', x: 82, y: 44, w: 15, src: staticFile('med/piel.png'), label: 'Su piel', caption: 'Más firme\ny elástica', start: 35.6},

    {t: 'arrow', from: [56, 41], to: [61, 41], start: 33.5, curve: -0.25},
    {t: 'arrow', from: [75, 39], to: [78, 39], start: 35.6, curve: -0.25},

    // CONCLUSIÓN (aparece antes del zoom-out para que se lea en el hold final)
    {t: 'note', x: 55, y: 74, w: 24, text: 'Piel visiblemente más joven', start: 36.8, highlight: true, align: 'center'},
  ],
};

// ── ESCENA "9 SEÑALES DE LA PIEL" (Dr. Federer · recap 24:38) ──────────────────
// Grilla 3×3 de MÓDULOS: cada señal = card (foto + nº + mini-desc), aparece anclada
// al ms de Whisper de cuando el doctor la nombra en el recap. La regla ABCDE va como
// nota lassada con una flecha que apunta a la card del lunar. Cámara por FILAS +
// zoom-out final que muestra las 9 ordenadas. Avatar PiP muted (audio = AvatarLayer).
const P = (n: string) => staticFile(`img/p_v3ffa7mrzcjw_${n}.png`);
export const SCENE_PIEL_9: Scene = {
  avatarSrc: staticFile('avatar_clips/v3z_recap.mp4'),
  muted: true,
  cameras: [
    {time: 0.0, fx: 50, fy: 30, z: 1.12},   // fila 1
    {time: 8.0, fx: 55, fy: 30, z: 1.14},
    {time: 17.5, fx: 50, fy: 44, z: 1.08},   // baja a fila 2
    {time: 19.5, fx: 50, fy: 58, z: 1.14},
    {time: 30.0, fx: 50, fy: 72, z: 1.08},   // baja a fila 3
    {time: 32.5, fx: 50, fy: 86, z: 1.14},
    {time: 42.0, fx: 50, fy: 57, z: 1.0},    // zoom-out: las 9 ordenadas (hold al final)
  ],
  elements: [
    {t: 'title', x: 4, y: 6, text: 'Las 9 señales de tu piel', start: 0.4},
    // REGLA ABCDE → lasso → flecha a la card del lunar (nº 1)
    {t: 'note', x: 50, y: 14, w: 20, text: 'Regla ABCDE', start: 2.6, highlight: true, align: 'center'},
    {t: 'lasso', x: 50, y: 14, w: 24, h: 12, start: 3.8, rot: -2},
    {t: 'arrow', from: [40, 16], to: [22, 27], start: 5.0, curve: -0.3},
    // FILA 1 — cards 1·2·3  (columnas 17·43·69: dejan libre la esquina inf-der del PiP)
    {t: 'card', x: 17, y: 30, w: 13, src: P('lunar_asimetrico'), label: '1 · Lunar que cambia', caption: 'La E de evolución', start: 0.8, circle: true},
    {t: 'card', x: 43, y: 30, w: 13, src: P('espalda_lunares_patito'), label: '2 · El patito feo', caption: 'El diferente', start: 12.1},
    {t: 'card', x: 69, y: 30, w: 13, src: P('llaga_nariz'), label: '3 · Llaga que no cierra', caption: 'Más de un mes', start: 15.7},
    // FILA 2 — cards 4·5·6
    {t: 'card', x: 17, y: 55, w: 13, src: P('cuello_aterciopelado'), label: '4 · Manchas oscuras', caption: 'En los pliegues', start: 19.6},
    {t: 'card', x: 43, y: 55, w: 13, src: P('verrugas_espalda'), label: '5 · Brote de manchitas', caption: 'La velocidad avisa', start: 22.7},
    {t: 'card', x: 69, y: 55, w: 13, src: P('rasca_brazo_noche'), label: '6 · Comezón terca', caption: 'Sin explicación', start: 28.5},
    // FILA 3 — cards 7·8·9
    {t: 'card', x: 17, y: 80, w: 13, src: P('ojos_amarillos'), label: '7 · Color amarillo', caption: 'Ojos y piel', start: 32.9},
    {t: 'card', x: 43, y: 80, w: 13, src: P('una_linea_oscura'), label: '8 · Rayita en la uña', caption: 'Oscura y nueva', start: 36.0},
    {t: 'card', x: 69, y: 80, w: 13, src: P('bulto_perlado_nariz'), label: '9 · Bultito perlado', caption: 'Brillante, no se va', start: 39.6},
  ],
};

/* ==================== FILTROS SVG (tinta a mano) ======================= */

const InkDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="ink-rough" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.024" numOctaves={2} seed={7} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={3.4} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="ink-rough-2" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves={2} seed={3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

/* ======================= PRIMITIVA: TRAZO MARCADOR ===================== */

const InkPath: React.FC<{d: string; draw: number; color: string; width?: number; rough?: string; glow?: boolean}> = ({
  d,
  draw,
  color,
  width = 4.2,
  rough = 'url(#ink-rough)',
  glow = false,
}) => (
  <g filter={rough}>
    <path d={d} fill="none" stroke={color} strokeWidth={width * 1.7} strokeLinecap="round" opacity={0.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={glow ? {filter: `drop-shadow(0 0 4px ${rgba(color, 0.35)})`} : undefined} />
  </g>
);

/* =============================== UTILIDADES ============================= */

const inSpring = (frame: number, startF: number, fps: number, cfg?: object) =>
  spring({frame: frame - startF, fps, config: {damping: 18, stiffness: 120, mass: 0.8, ...(cfg ?? {})}});

/* --------------------- HANDTEXT: palabra x palabra + jitter ------------- */

const HandText: React.FC<{text: string; startSec: number; size: number; color: string; font: string; weight?: number; align?: 'left' | 'center'; seed?: string; perWord?: number}> = ({
  text,
  startSec,
  size,
  color,
  font,
  weight = 400,
  align = 'left',
  seed = 't',
  perWord = 0.16, // seg por palabra (escritura más lenta / real)
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = React.useMemo(() => text.split('\n').map((l) => l.trim().split(/\s+/)), [text]);
  let wi = -1;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: size * 0.14}}>
      {lines.map((words, li) => (
        <div key={li} style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: `${size * 0.28}px`}}>
          {words.map((word, k) => {
            wi++;
            const s = `${seed}-${li}-${k}`;
            const delay = startSec + wi * perWord;
            // escritura lenta: cada palabra entra con settle largo (damping alto, stiffness bajo)
            const sp = spring({frame: frame - Math.round(delay * fps), fps, config: {damping: 20, stiffness: 85, mass: 0.9}});
            const o = interpolate(sp, [0, 0.5], [0, 1], CLAMP);
            const y = interpolate(sp, [0, 1], [12, 0], CLAMP);
            const b = Math.max(0, interpolate(sp, [0, 1], [9, 0], CLAMP));
            const rot = (random(s + 'r') - 0.5) * 3;
            const dy = (random(s + 'y') - 0.5) * size * 0.09;
            const sc = 0.97 + random(s + 's') * 0.06;
            return (
              <span
                key={k}
                style={{
                  display: 'inline-block',
                  fontFamily: font,
                  fontWeight: weight,
                  fontSize: size,
                  lineHeight: 1.1,
                  color,
                  opacity: o,
                  transform: `translateY(${y + dy}px) rotate(${rot}deg) scale(${sc})`,
                  filter: `blur(${b}px)`,
                  textShadow: `0 1px 0 rgba(0,0,0,0.12)`,
                  willChange: 'transform, opacity, filter',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ------------------------------ FLECHA A MANO --------------------------- */

const BoardArrow: React.FC<{el: Extract<BoardEl, {t: 'arrow'}>; seed: number}> = ({el, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {w: bw, h: bh} = React.useContext(BoardCtx);
  const theme = React.useContext(ThemeCtx);
  const startF = Math.round(el.start * fps);

  const x1 = (el.from[0] / 100) * bw;
  const y1 = (el.from[1] / 100) * bh;
  const x2 = (el.to[0] / 100) * bw;
  const y2 = (el.to[1] / 100) * bh;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const curve = (el.curve ?? 0.25) * len * 0.45;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;
  const shaft = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  const draw = interpolate(frame, [startF, startF + Math.round(0.5 * fps)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const headSp = spring({frame: frame - (startF + Math.round(0.42 * fps)), fps, config: {damping: 11, stiffness: 200, mass: 0.5}});
  const headP = interpolate(headSp, [0, 1], [0, 1], CLAMP);
  const tx = x2 - cx;
  const ty = y2 - cy;
  const tl = Math.hypot(tx, ty) || 1;
  const ux = tx / tl;
  const uy = ty / tl;
  const ah = 24 * headP;
  const sp2 = 0.52;
  const cos = Math.cos(sp2);
  const sin = Math.sin(sp2);
  const hA = `M ${x2} ${y2} L ${x2 - ah * (ux * cos - uy * sin)} ${y2 - ah * (uy * cos + ux * sin)}`;
  const hB = `M ${x2} ${y2} L ${x2 - ah * (ux * cos + uy * sin)} ${y2 - ah * (uy * cos - ux * sin)}`;
  const op = interpolate(frame, [startF, startF + 3], [0, 1], CLAMP);

  return (
    <svg width={bw} height={bh} viewBox={`0 0 ${bw} ${bh}`} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: op}}>
      <InkPath d={shaft} draw={draw} color={theme.accent} width={4.4} rough={seed % 2 ? 'url(#ink-rough)' : 'url(#ink-rough-2)'} />
      {headP > 0.02 ? (
        <g style={{transform: `scale(${lerp(1.25, 1, headP)})`, transformOrigin: `${x2}px ${y2}px`}}>
          <InkPath d={hA} draw={1} color={theme.accent} width={4.4} />
          <InkPath d={hB} draw={1} color={theme.accent} width={4.4} />
        </g>
      ) : null}
    </svg>
  );
};

/* ------------------------- TÍTULO (subrayado dibujado) ------------------ */

const BoardTitle: React.FC<{el: Extract<BoardEl, {t: 'title'}>}> = ({el}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const {w: bw} = React.useContext(BoardCtx);
  const theme = React.useContext(ThemeCtx);
  const startF = Math.round(el.start * fps);
  const under = interpolate(frame, [startF + 12, startF + Math.round(1.0 * fps)], [0, 1], CLAMP);
  const size = (el.size ?? 4.7) * (height / 100);
  return (
    <div style={{position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, transform: 'rotate(-0.4deg)'}}>
      <HandText text={el.text} startSec={el.start} size={size} color={theme.ink} font={CAVEAT} weight={700} seed="title" />
      <svg width={bw * 0.4} height={20} viewBox={`0 0 ${bw * 0.4} 20`} style={{overflow: 'visible', marginTop: size * 0.12}}>
        <InkPath d={`M 3 11 Q ${bw * 0.09} 4 ${bw * 0.19} 10 T ${bw * 0.39} 8`} draw={under} color={theme.accent} width={4.6} rough="url(#ink-rough-2)" />
      </svg>
    </div>
  );
};

/* --------------------------- NOTA MANUSCRITA --------------------------- */

const BoardNote: React.FC<{el: Extract<BoardEl, {t: 'note'}>}> = ({el}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const theme = React.useContext(ThemeCtx);
  const startF = Math.round(el.start * fps);
  const appear = interpolate(frame, [startF, startF + 3], [0, 1], CLAMP);
  const size = (el.size ?? 2.9) * (height / 100);
  const align = el.align ?? 'left';

  const isFill = !!el.fill;
  const textColor = isFill ? theme.fillInk : el.accent ? theme.accent : theme.ink;

  const boxP = el.box ? interpolate(frame, [startF + Math.round(0.5 * fps), startF + Math.round(1.4 * fps)], [0, 1], CLAMP) : 0;
  const hiP = el.highlight ? interpolate(frame, [startF + Math.round(0.3 * fps), startF + Math.round(1.0 * fps)], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}) : 0;
  const fillSp = isFill ? spring({frame: frame - (startF + Math.round(0.2 * fps)), fps, config: {damping: 13, stiffness: 150, mass: 0.7}}) : 0;
  const fillP = interpolate(fillSp, [0, 1], [0, 1], CLAMP);
  const bulletO = el.bullet ? interpolate(frame, [startF + 2, startF + 8], [0, 1], CLAMP) : 0;

  // El elemento se ANCLA POR SU CENTRO (translate -50%), pero la data se escribe como si `x` fuera
  // el borde izquierdo: una nota con {x:6, w:34} termina yendo de -11% a 23%, o sea arrancando
  // FUERA de la pizarra, y en pantalla se lee cortada por la mitad ("...já que le llega a tus
  // arterias"). Clampeo el centro para que la caja entre entera. No cambia nada de lo que ya
  // estaba bien colocado: sólo corrige lo que se salía.
  const wPct = el.w ?? 24;
  const cx = Math.min(Math.max(el.x, wPct / 2), 100 - wPct / 2);
  return (
    <div
      style={{
        position: 'absolute',
        left: `${cx}%`,
        top: `${el.y}%`,
        width: `${wPct}%`,
        transform: 'translate(-50%, -50%) rotate(-0.8deg)',
        opacity: appear,
        display: 'flex',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      {el.box ? (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: '-22% -8%', width: '116%', height: '144%', overflow: 'visible'}}>
          <g filter="url(#ink-rough-2)">
            <rect x="3" y="3" width="94" height="94" rx="7" fill="none" stroke={theme.accent} strokeWidth={1.5} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - boxP} />
          </g>
        </svg>
      ) : null}

      <div style={{display: 'flex', alignItems: 'flex-start', gap: size * 0.4}}>
        {el.bullet ? <span style={{marginTop: size * 0.42, width: size * 0.34, height: size * 0.34, borderRadius: '50%', background: theme.accent, flex: '0 0 auto', opacity: bulletO}} /> : null}
        <div style={{position: 'relative'}}>
          {/* callout fondo rojo */}
          {isFill ? (
            <div
              style={{
                position: 'absolute',
                inset: '-26% -11%',
                zIndex: 0,
                background: theme.fillBg,
                borderRadius: 12,
                transform: `scale(${lerp(0.9, 1, fillP)})`,
                opacity: fillP,
                filter: 'url(#ink-rough)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.22)',
              }}
            />
          ) : null}
          {/* highlighter amarillo */}
          {el.highlight ? (
            <div
              style={{
                position: 'absolute',
                inset: '4% -8%',
                zIndex: 0,
                transformOrigin: 'left center',
                transform: `skewX(-3deg) scaleX(${hiP})`,
                background: rgba(theme.hi, theme.hiAlpha),
                mixBlendMode: theme.hiBlend,
                borderRadius: 4,
                filter: 'url(#ink-rough)',
              }}
            />
          ) : null}
          <div style={{position: 'relative', zIndex: 1}}>
            <HandText text={el.text} startSec={el.start + 0.05} size={size} color={textColor} font={KALAM} align={align} seed={`n${el.x}${el.y}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- IMAGEN (foto impresa / cutout) ------------------ */

const BoardImage: React.FC<{el: Extract<BoardEl, {t: 'image'}>}> = ({el}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const theme = React.useContext(ThemeCtx);
  const startF = Math.round(el.start * fps);
  const s = inSpring(frame, startF, fps, {damping: 15, stiffness: 130});
  const o = interpolate(s, [0, 0.3], [0, 1], CLAMP);
  const sc = interpolate(s, [0, 1], [0.84, 1], CLAMP);
  const yIn = interpolate(s, [0, 1], [20, 0], CLAMP);
  const blur = Math.max(0, interpolate(s, [0, 1], [7, 0], CLAMP));
  const rot = el.rot ?? 0;
  const fs = random(el.src + el.x) * Math.PI * 2;
  const floatY = Math.sin(frame * 0.045 + fs) * (height * 0.0024);
  const duo = el.duotone ?? theme.photoDuotone;
  const circP = el.circle ? interpolate(frame, [startF + Math.round(0.4 * fps), startF + Math.round(1.25 * fps)], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}) : 0;
  const capO = el.caption ? interpolate(frame, [startF + Math.round(0.45 * fps), startF + Math.round(0.75 * fps)], [0, 1], CLAMP) : 0;

  return (
    <div style={{position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, width: `${el.w}%`, transform: `translate(-50%, -50%) translateY(${yIn + floatY}px) rotate(${rot}deg) scale(${sc})`, opacity: o, filter: `blur(${blur}px)`}}>
      <div style={{position: 'relative', width: '100%'}}>
        <div style={{position: 'absolute', left: '8%', right: '8%', bottom: '-7%', height: '15%', background: 'rgba(0,0,0,0.28)', filter: 'blur(9px)', borderRadius: '50%', zIndex: -2}} />
        {el.cutout ? (
          <Img src={el.src} style={{width: '100%', display: 'block', filter: `drop-shadow(0 ${height * 0.016}px ${height * 0.026}px rgba(0,0,0,0.4))`}} />
        ) : (
          <div style={{position: 'relative', padding: '4%', background: 'linear-gradient(160deg,#ffffff,#f0ece2)', borderRadius: 3, boxShadow: `0 ${height * 0.016}px ${height * 0.03}px rgba(0,0,0,0.32)`}}>
            <div style={{position: 'relative', width: '100%', aspectRatio: '3 / 2', overflow: 'hidden', borderRadius: 1, background: '#0a1310'}}>
              <Img src={el.src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: duo ? 'grayscale(1) contrast(1.08) brightness(0.98)' : 'contrast(1.03) saturate(1.02)'}} />
              {duo ? (
                <>
                  <AbsoluteFill style={{background: 'linear-gradient(150deg,#0c1f1a,#24402f 45%,#EDB851 105%)', mixBlendMode: 'overlay', opacity: 0.9}} />
                  <AbsoluteFill style={{background: '#EDB851', mixBlendMode: 'color', opacity: 0.22}} />
                </>
              ) : null}
              <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent 30%)', boxShadow: 'inset 0 0 26px rgba(0,0,0,0.25)'}} />
            </div>
            <div style={{position: 'absolute', top: '-5%', left: '50%', width: '30%', height: '12%', transform: 'translateX(-50%) rotate(-4deg)', background: 'linear-gradient(180deg, rgba(210,225,235,0.55), rgba(180,200,215,0.42))', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'}} />
          </div>
        )}
        {el.circle ? (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: '-16%', width: '132%', height: '132%', overflow: 'visible'}}>
            <g filter="url(#ink-rough-2)">
              <ellipse cx="50" cy="50" rx="47" ry="45" fill="none" stroke={theme.accent} strokeWidth={1.7} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circP} transform="rotate(-14 50 50)" />
            </g>
          </svg>
        ) : null}
      </div>
      {el.caption ? (
        <div style={{marginTop: height * 0.013, textAlign: 'center', opacity: capO, transform: `rotate(${-rot * 0.5}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
          <span style={{width: 14, height: 2, background: rgba(theme.accent, 0.7)}} />
          <span style={{fontFamily: PATRICK, fontSize: height * 0.025, color: theme.inkDim}}>{el.caption}</span>
        </div>
      ) : null}
    </div>
  );
};

/* ------------------ CARD: módulo ordenado (imagen+título+desc) ---------- */

const BoardCard: React.FC<{el: Extract<BoardEl, {t: 'card'}>}> = ({el}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const theme = React.useContext(ThemeCtx);
  const startF = Math.round(el.start * fps);
  const s = inSpring(frame, startF, fps, {damping: 16, stiffness: 120});
  const o = interpolate(s, [0, 0.3], [0, 1], CLAMP);
  const sc = interpolate(s, [0, 1], [0.9, 1], CLAMP);
  const yIn = interpolate(s, [0, 1], [16, 0], CLAMP);
  const circP = el.circle
    ? interpolate(frame, [startF + Math.round(0.4 * fps), startF + Math.round(1.3 * fps)], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)})
    : 0;
  const labelSize = height * 0.033;
  const capO = interpolate(frame, [startF + Math.round(0.9 * fps), startF + Math.round(1.3 * fps)], [0, 1], CLAMP);

  return (
    <div style={{position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, width: `${el.w}%`, transform: `translate(-50%,-50%) translateY(${yIn}px) scale(${sc})`, opacity: o, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {/* imagen enmarcada, limpia, 0° (módulo consistente) */}
      <div style={{position: 'relative', width: '100%'}}>
        <div style={{position: 'absolute', left: '8%', right: '8%', bottom: '-6%', height: '14%', background: 'rgba(0,0,0,0.2)', filter: 'blur(9px)', borderRadius: '50%'}} />
        <div style={{position: 'relative', padding: '5%', background: '#ffffff', borderRadius: 6, boxShadow: `0 ${height * 0.013}px ${height * 0.028}px rgba(0,0,0,0.2)`, border: '1px solid rgba(0,0,0,0.06)'}}>
          <div style={{position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', borderRadius: 3, background: '#0a1310'}}>
            <Img src={el.src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.03) saturate(1.03)'}} />
            <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 26%)', boxShadow: 'inset 0 0 22px rgba(0,0,0,0.22)'}} />
          </div>
        </div>
        {el.circle ? (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: '-15%', width: '130%', height: '130%', overflow: 'visible'}}>
            <g filter="url(#ink-rough-2)">
              <ellipse cx="50" cy="50" rx="47" ry="45" fill="none" stroke={theme.accent} strokeWidth={1.7} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circP} transform="rotate(-11 50 50)" />
            </g>
          </svg>
        ) : null}
      </div>
      {/* título (texto) */}
      <div style={{marginTop: height * 0.022}}>
        <HandText text={el.label} startSec={el.start + 0.45} size={labelSize} color={theme.ink} font={CAVEAT} weight={700} align="center" seed={`cl${el.x}${el.y}`} perWord={0.1} />
      </div>
      {/* mini-descripción */}
      <div style={{marginTop: height * 0.007, opacity: capO, fontFamily: KALAM, fontSize: height * 0.021, color: theme.inkDim, textAlign: 'center', lineHeight: 1.25, width: '116%'}}>{el.caption}</div>
    </div>
  );
};

/* --------------- PAIR: fila "imagen – texto" (para listas) ------------- */

const BoardPair: React.FC<{el: Extract<BoardEl, {t: 'pair'}>}> = ({el}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const theme = React.useContext(ThemeCtx);
  const startF = Math.round(el.start * fps);
  const s = inSpring(frame, startF, fps, {damping: 16, stiffness: 130});
  const o = interpolate(s, [0, 0.3], [0, 1], CLAMP);
  const xIn = interpolate(s, [0, 1], [-14, 0], CLAMP);
  const size = (el.size ?? 2.5) * (height / 100);

  return (
    <div style={{position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, width: `${el.w}%`, transform: `translate(-50%, -50%) translateX(${xIn}px)`, opacity: o, display: 'flex', alignItems: 'center', gap: size * 0.7}}>
      {/* thumb enmarcado */}
      <div style={{flex: '0 0 auto', width: size * 3.1, height: size * 2.3, padding: size * 0.16, background: '#fff', borderRadius: 4, boxShadow: '0 3px 8px rgba(0,0,0,0.2)', border: '1px solid rgba(0,0,0,0.06)'}}>
        <div style={{width: '100%', height: '100%', overflow: 'hidden', borderRadius: 2, background: '#0a1310'}}>
          <Img src={el.src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
        </div>
      </div>
      {/* guion + texto manuscrito */}
      <div style={{display: 'flex', alignItems: 'center', gap: size * 0.4, flex: 1}}>
        <span style={{width: size * 0.6, height: 3, background: theme.accent, borderRadius: 2, flex: '0 0 auto'}} />
        <HandText text={el.text} startSec={el.start + 0.2} size={size} color={theme.ink} font={KALAM} seed={`p${el.x}${el.y}`} perWord={0.11} />
      </div>
    </div>
  );
};

/* ---------------- LASSO: círculo/óvalo a mano que encierra --------------- */

const BoardLasso: React.FC<{el: Extract<BoardEl, {t: 'lasso'}>}> = ({el}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {w: bw, h: bh} = React.useContext(BoardCtx);
  const theme = React.useContext(ThemeCtx);
  const startF = Math.round(el.start * fps);
  const cx = (el.x / 100) * bw;
  const cy = (el.y / 100) * bh;
  const rx = (el.w / 2 / 100) * bw;
  const ry = (el.h / 2 / 100) * bh;
  const draw = interpolate(frame, [startF, startF + Math.round(1.25 * fps)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const op = interpolate(frame, [startF, startF + 4], [0, 1], CLAMP);
  // óvalo un poco "abierto" (empieza y termina desfasado) = trazo humano
  return (
    <svg width={bw} height={bh} viewBox={`0 0 ${bw} ${bh}`} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: op}}>
      <g filter="url(#ink-rough-2)" transform={`rotate(${el.rot ?? -3} ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={theme.accent} strokeWidth={3.4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw * 0.94} />
      </g>
    </svg>
  );
};

/* ------------------------- VIDEO EN LA PIZARRA -------------------------- */

const BoardVideo: React.FC<{el: Extract<BoardEl, {t: 'video'}>}> = ({el}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const theme = React.useContext(ThemeCtx);
  const startF = Math.round(el.start * fps);
  const s = inSpring(frame, startF, fps, {damping: 16, stiffness: 120});
  const o = interpolate(s, [0, 0.3], [0, 1], CLAMP);
  const sc = interpolate(s, [0, 1], [0.86, 1], CLAMP);
  const yIn = interpolate(s, [0, 1], [18, 0], CLAMP);
  const rot = el.rot ?? 0;
  const capO = interpolate(frame, [startF + Math.round(0.45 * fps), startF + Math.round(0.75 * fps)], [0, 1], CLAMP);
  return (
    <div style={{position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, width: `${el.w}%`, transform: `translate(-50%, -50%) translateY(${yIn}px) rotate(${rot}deg) scale(${sc})`, opacity: o}}>
      <div style={{position: 'absolute', left: '6%', right: '6%', bottom: '-6%', height: '13%', background: 'rgba(0,0,0,0.28)', filter: 'blur(8px)', borderRadius: '50%'}} />
      <div style={{position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 5, overflow: 'hidden', border: `3px solid #ffffff`, boxShadow: `0 ${height * 0.016}px ${height * 0.03}px rgba(0,0,0,0.35)`, background: '#04070c'}}>
        <OffthreadVideo src={el.src} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', top: '7%', right: '7%', width: height * 0.009, height: height * 0.009, borderRadius: '50%', background: '#ff5a5a', opacity: 0.5 + 0.5 * Math.sin(frame * 0.2), boxShadow: '0 0 8px #ff5a5a'}} />
      </div>
      {el.caption ? <div style={{marginTop: height * 0.013, textAlign: 'center', fontFamily: PATRICK, fontSize: height * 0.024, color: theme.inkDim}}>{el.caption}</div> : null}
    </div>
  );
};

/* ============================ FONDO DE PIZARRA ========================== */

const BoardSurface: React.FC = () => {
  const theme = React.useContext(ThemeCtx);
  const white = theme.key === 'white';
  const smudges = React.useMemo(
    () => new Array(9).fill(0).map((_, i) => ({x: random('sm-x-' + i) * 100, y: random('sm-y-' + i) * 100, w: 8 + random('sm-w-' + i) * 26, h: 5 + random('sm-h-' + i) * 16, r: random('sm-r-' + i) * 180, o: 0.02 + random('sm-o-' + i) * 0.05})),
    []
  );
  const smudgeTint = white ? '90, 96, 108' : '230, 240, 232';
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: white ? 'linear-gradient(158deg,#FDFDFC 0%,#F4F3EF 55%,#EBEAE4 100%)' : 'radial-gradient(130% 110% at 26% 12%, #1a2b24 0%, #101c17 40%, #0a1410 72%, #070d0b 100%)'}} />
      {white ? null : <AbsoluteFill style={{background: 'radial-gradient(70% 60% at 20% 6%, rgba(237,184,81,0.10) 0%, transparent 55%)'}} />}
      {smudges.map((m, i) => (
        <div key={i} style={{position: 'absolute', left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%`, transform: `translate(-50%,-50%) rotate(${m.r}deg)`, background: `radial-gradient(50% 50% at 50% 50%, rgba(${smudgeTint},${m.o}), transparent 70%)`, filter: 'blur(6px)'}} />
      ))}
      {/* fantasmas de borrado */}
      <div style={{position: 'absolute', left: '58%', top: '78%', width: '26%', height: '9%', transform: 'rotate(-3deg)', opacity: white ? 0.05 : 0.04, background: `repeating-linear-gradient(92deg, transparent 0 6px, rgba(${smudgeTint},0.9) 6px 9px, transparent 9px 22px)`, filter: 'blur(1.5px)'}} />
      {/* grano */}
      <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: white ? 0.03 : 0.05, mixBlendMode: white ? 'multiply' : 'overlay'}}>
        <filter id="wbGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#wbGrain)" />
      </svg>
      {/* viñeta */}
      <AbsoluteFill style={{background: white ? 'radial-gradient(125% 105% at 48% 42%, transparent 62%, rgba(60,60,70,0.10) 100%)' : 'radial-gradient(125% 105% at 48% 42%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      {/* brillo whiteboard */}
      {white ? <AbsoluteFill style={{background: 'linear-gradient(118deg, rgba(255,255,255,0.5) 0%, transparent 16%, transparent 84%, rgba(255,255,255,0.28) 100%)', mixBlendMode: 'screen', opacity: 0.5}} /> : null}
    </AbsoluteFill>
  );
};

/* ============================ MARCO + BANDEJA ========================== */

const Frame: React.FC<{children: React.ReactNode; outerH: number}> = ({children, outerH}) => {
  const theme = React.useContext(ThemeCtx);
  const white = theme.key === 'white';
  const frameBg = white ? 'linear-gradient(145deg,#e6e8ea 0%,#b9bdc2 45%,#8b9096 100%)' : 'linear-gradient(145deg,#40392c 0%,#221b12 45%,#100c07 100%)';
  const screwBg = white ? 'radial-gradient(circle at 35% 30%, #eef0f2, #6a6e73)' : 'radial-gradient(circle at 35% 30%, #6b5c40, #1c150c)';
  return (
    <div style={{position: 'relative', width: '100%', height: '100%', padding: FRAME_PAD, borderRadius: 16, background: frameBg, boxShadow: '0 50px 100px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.4)'}}>
      {[[11, 11], [-11, 11], [11, -11], [-11, -11]].map(([dx, dy], i) => (
        <div key={i} style={{position: 'absolute', [dx > 0 ? 'left' : 'right']: Math.abs(dx), [dy > 0 ? 'top' : 'bottom']: Math.abs(dy), width: 8, height: 8, borderRadius: '50%', background: screwBg, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25)'} as React.CSSProperties} />
      ))}
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 7, overflow: 'hidden', boxShadow: white ? 'inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 4px 20px rgba(0,0,0,0.08)' : 'inset 0 0 0 1px rgba(0,0,0,0.6), inset 0 6px 30px rgba(0,0,0,0.5)'}}>{children}</div>
      {/* bandeja */}
      <div style={{position: 'absolute', left: '4%', right: '4%', bottom: -outerH * 0.026, height: outerH * 0.046, borderRadius: 6, background: white ? 'linear-gradient(180deg,#d3d6da,#9a9ea3 55%,#74777c)' : 'linear-gradient(180deg,#2a231a,#171009 55%,#0c0805)', boxShadow: '0 8px 18px rgba(0,0,0,0.45), inset 0 2px 2px rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', paddingLeft: '5%', gap: outerH * 0.018}}>
        {(white ? ['#E23B3B', '#2C2F36', '#2B6CB0', '#FFD21E'] : ['#f0c463', '#f4f1e8']).map((c, i) => (
          <div key={i} style={{width: outerH * 0.14, height: outerH * 0.024, borderRadius: 4, background: `linear-gradient(180deg, ${c}, ${rgba('#000000', 0.35)})`, boxShadow: '0 2px 4px rgba(0,0,0,0.4)'}} />
        ))}
      </div>
    </div>
  );
};

/* ========================= AVATAR PiP (esquina) ======================== */

const AvatarPip: React.FC<{src: string; muted?: boolean}> = ({src, muted}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const theme = React.useContext(ThemeCtx);
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06], CLAMP);
  const enter = spring({frame, fps: 30, config: {damping: 20, stiffness: 90, mass: 1}});
  const o = interpolate(enter, [0, 0.5], [0, 1], CLAMP);
  const yIn = interpolate(enter, [0, 1], [30, 0], CLAMP);

  const w = PIP.w * width;
  const h = w * (4 / 3); // retrato 3:4 → el cover recorta los bordes vacíos
  const left = width - PIP.marginR * width - w;
  const top = height - PIP.marginB * height - h;

  return (
    <div style={{position: 'absolute', left, top, width: w, height: h, opacity: o, transform: `translateY(${yIn}px)`}}>
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 14, padding: 6, background: 'linear-gradient(150deg,#2a2e34,#0b0e12 60%,#05070a)', boxShadow: '0 22px 50px rgba(0,0,0,0.5)'}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 9, overflow: 'hidden', border: `2px solid ${rgba(theme.accent, 0.55)}`}}>
          {/* zoom base + foco arriba-centro → encuadra cabeza/hombros del presentador, no todo el set */}
          <AbsoluteFill style={{transform: `scale(${PIP_ZOOM * push})`, transformOrigin: PIP_FOCUS}}>
            <OffthreadVideo src={src} muted={muted} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </AbsoluteFill>
          <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(122deg, rgba(255,255,255,0.1) 0%, transparent 22%), linear-gradient(to bottom, transparent 60%, rgba(2,5,11,0.7))'}} />
          <div style={{position: 'absolute', left: '6%', bottom: '7%', display: 'flex', alignItems: 'center', gap: 7}}>
            <div style={{width: 18, height: 3, borderRadius: 2, background: theme.accent}} />
            <div style={{fontFamily: "'Archivo','Inter',sans-serif", fontWeight: 700, fontSize: h * 0.11, letterSpacing: '0.03em', color: '#fff', textShadow: '0 2px 6px rgba(0,0,0,0.7)'}}>Dr. Federer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ======================== CÁMARA: foco al activo ======================= */

const elCenter = (el: BoardEl): {x: number; y: number} | null => {
  if (el.t === 'arrow') return {x: (el.from[0] + el.to[0]) / 2, y: (el.from[1] + el.to[1]) / 2};
  if (el.t === 'title') return {x: el.x + 10, y: el.y + 4};
  return {x: (el as any).x, y: (el as any).y};
};

// zoom por tipo (agresivo). title/recap = amplio; resto = cerca.
const zoomFor = (el: BoardEl): number => {
  if (el.t === 'title') return 1.15;
  if (el.t === 'image') return 2.15;
  if (el.t === 'video') return 1.95;
  if (el.t === 'note') return 2.2;
  return 1.6;
};

type Kf = CamKf;

// keyframes: si la escena define `cameras`, se usan tal cual (control fino por
// ZONA). Si no, se derivan de los elementos (fallback).
const buildKeyframes = (scene: Scene): Kf[] => {
  if (scene.cameras && scene.cameras.length) return [...scene.cameras].sort((a, b) => a.time - b.time);
  const LEAD = 0.45;
  const kfs: Kf[] = [{time: 0, fx: 50, fy: 42, z: 1.06}];
  for (const el of scene.elements) {
    if (el.t === 'arrow') continue;
    const c = elCenter(el)!;
    kfs.push({time: Math.max(0.1, (el as any).start - LEAD), fx: c.x, fy: c.y, z: zoomFor(el)});
  }
  return kfs.sort((a, b) => a.time - b.time);
};

const cameraAt = (kfs: Kf[], t: number): {fx: number; fy: number; z: number} => {
  if (t <= kfs[0].time) return kfs[0];
  let i = 0;
  for (let k = 0; k < kfs.length - 1; k++) if (kfs[k].time <= t) i = k;
  const A = kfs[i];
  const B = kfs[i + 1];
  if (!B) return A;
  const gap = B.time - A.time;
  const transDur = Math.min(2.8, gap * 0.9); // movimiento LENTO y suave
  const moveStart = B.time - transDur;
  if (t < moveStart) return A;
  const p = interpolate(t, [moveStart, B.time], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  return {fx: lerp(A.fx, B.fx, p), fy: lerp(A.fy, B.fy, p), z: lerp(A.z, B.z, p)};
};

/* ============================ COMPONENTE PPAL ========================== */

export type FedWhiteboardUroProps = {scene?: Scene; theme?: ThemeKey};

export const FedWhiteboardUro: React.FC<FedWhiteboardUroProps> = ({scene = SCENE_ROMERO, theme: themeKey = 'white'}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const theme = themeKey === 'dark' ? THEME_DARK : THEME_WHITE;

  const outerW = BOARD.w * width;
  const outerH = BOARD.h * height;
  const outerLeft = BOARD.left * width;
  const outerTop = BOARD.top * height;
  const innerW = outerW - 2 * FRAME_PAD;
  const innerH = outerH - 2 * FRAME_PAD;

  // ----- CÁMARA (lienzo infinito): la transform se aplica a TODO el tablero,
  // MARCO INCLUIDO, en px de pantalla. Así los bordes están ANCLADOS: al hacer
  // zoom se van de pantalla (desaparecen), como en un iPad real. -----
  const kfs = React.useMemo(() => buildKeyframes(scene), [scene]);
  const camXform = (tt: number) => {
    const {fx, fy, z} = cameraAt(kfs, tt);
    // punto de foco en px de pantalla a z=1 (dentro del área interna del tablero)
    const focusX = outerLeft + FRAME_PAD + (fx / 100) * innerW;
    const focusY = outerTop + FRAME_PAD + (fy / 100) * innerH;
    const driftX = Math.sin(tt * 0.5) * width * 0.0018;
    const driftY = Math.cos(tt * 0.42) * height * 0.0018;
    // llevar el foco al centro de pantalla, escalado por z
    const tx = width / 2 - focusX * z + driftX;
    const ty = height / 2 - focusY * z + driftY;
    return {tx, ty, z};
  };
  const camNow = camXform(t);
  const camPrev = camXform(Math.max(0, t - 1 / fps));
  const vel = Math.hypot(camNow.tx - camPrev.tx, camNow.ty - camPrev.ty) + Math.abs(camNow.z - camPrev.z) * height;
  const camBlur = Math.min(2.0, vel * 0.05); // desenfoque de movimiento MUY sutil

  const fadeIn = interpolate(frame, [0, 12], [1, 0], CLAMP);
  const fadeOut = interpolate(frame, [durationInFrames - 16, durationInFrames - 1], [0, 1], CLAMP);
  let arrowSeed = 0;

  return (
    <ThemeCtx.Provider value={theme}>
      <AbsoluteFill style={{background: theme.bg}}>
        <InkDefs />
        {/* pared */}
        <AbsoluteFill style={{background: theme.key === 'white' ? 'radial-gradient(140% 120% at 18% -5%, #eef0f2 0%, #cfd2d7 55%, #b9bdc3 100%)' : 'radial-gradient(140% 120% at 18% -5%, #0e1519 0%, #070b0e 55%, #04070a 100%)'}} />

        {/* CÁMARA: envuelve TODO el tablero (marco incluido) → bordes anclados */}
        <AbsoluteFill style={{transform: `translate(${camNow.tx}px, ${camNow.ty}px) scale(${camNow.z})`, transformOrigin: '0% 0%', filter: camBlur > 0.3 ? `blur(${camBlur.toFixed(2)}px)` : undefined, willChange: 'transform, filter'}}>
          <div style={{position: 'absolute', left: outerLeft, top: outerTop, width: outerW, height: outerH}}>
            <Frame outerH={outerH}>
              <BoardSurface />
              <BoardCtx.Provider value={{w: innerW, h: innerH}}>
                {scene.elements.map((el, i) => (el.t === 'arrow' ? <BoardArrow key={i} el={el} seed={arrowSeed++} /> : null))}
                {scene.elements.map((el, i) => {
                  if (el.t === 'title') return <BoardTitle key={i} el={el} />;
                  if (el.t === 'note') return <BoardNote key={i} el={el} />;
                  if (el.t === 'image') return <BoardImage key={i} el={el} />;
                  if (el.t === 'card') return <BoardCard key={i} el={el} />;
                  if (el.t === 'lasso') return <BoardLasso key={i} el={el} />;
                  if (el.t === 'pair') return <BoardPair key={i} el={el} />;
                  if (el.t === 'video') return <BoardVideo key={i} el={el} />;
                  return null;
                })}
              </BoardCtx.Provider>
            </Frame>
          </div>
        </AbsoluteFill>

        {/* PiP REMOVIDO — este canal prohibe recuadro/PiP (memoria federer-archivos) */}

        {/* grade global sutil (solo dark refuerza; white lo dejamos limpio) */}
        {theme.key === 'dark' ? (
          <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'soft-light', opacity: 0.5, background: 'linear-gradient(160deg, rgba(237,184,81,0.18) 0%, transparent 45%, rgba(20,60,70,0.2) 100%)'}} />
        ) : null}
        <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: theme.key === 'white' ? 0.025 : 0.045, mixBlendMode: theme.key === 'white' ? 'multiply' : 'overlay', pointerEvents: 'none'}}>
          <filter id="gGrain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#gGrain)" />
        </svg>
        <AbsoluteFill style={{background: theme.bg, opacity: Math.max(fadeIn, fadeOut), pointerEvents: 'none'}} />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

export default FedWhiteboardUro;

/* ================================ ROOT ================================= */

