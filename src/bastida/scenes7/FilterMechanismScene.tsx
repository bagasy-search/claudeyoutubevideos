/**
 * FilterMechanismScene — MICROESCENA 2.5D DIRIGIDA: EL MECANISMO DEL RIÑÓN.
 *
 * Idea visual: un CIRCUITO DE LABORATORIO real, visto de costado, con vidrio y líquido.
 * La sangre entra POR IZQUIERDA (tubo de vidrio con foto real), atraviesa una TRAMPA DE
 * SEDIMENTO (vaso de vidrio donde debería quedar la ceniza), pasa por los DOS RIÑONES
 * (fotos reales en marco de vidrio, que LATEN) y sale LIMPIA por derecha (partículas aqua).
 * Lo barrido cae por una canaleta hacia abajo y se va.
 *
 * Acción semántica (lo que hace ENTENDER): a partir del frame 150 el filtro se cansa y
 * parte de la ceniza YA NO PASA: se queda del lado de la sangre y se ACUMULA en la trampa,
 * que se llena de desecho (foto real) y se tiñe de ámbar. Ese residuo acumulado = creatinina.
 *
 * Materiales: vidrio ahumado + metal + acrílico + líquido. Nada de íconos planos.
 * Determinismo total (el farm rinde en chunks): cero Math.random / Date.
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BAS,
  CARD_SHADOW,
  FONT_DISPLAY,
  FONT_HAND,
  FONT_NUM,
  FONT_SANS,
  GrainOverlay,
  WaterMotes,
  rgba,
  shade,
} from './../theme';

/* ─────────────────────────── contrato ─────────────────────────── */

export type FilterMechanismSceneProps = {
  kidneyImg?: string; // 'img/bas6_p_rinon_filtro.jpg'
  bloodImg?: string; // 'img/bas6_p_sangre_tubo.jpg'
  title?: string; // 'Dos filtros del tamaño de su puño'
  timesLabel?: string; // 'veces por día le limpian toda la sangre'
  times?: number; // 30
  ashLabel?: string; // 'Lo que queda sin barrer es su creatinina'
};

/* ─────────────────────── constantes de puesta ─────────────────── */

const ASH_IMG = 'img/bas6_p_basura_desecho.jpg'; // el desecho que se acumula (sedimento real)
const KIDNEY2_IMG = 'img/bas6_broll_kidney.jpg'; // el SEGUNDO riñón, detrás (son dos)

const PERSP = 1700;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeIO = Easing.bezier(0.16, 1, 0.3, 1);
const easeOut = Easing.out(Easing.cubic);

// eje del circuito
const FLOW_Y = 482; // sangre sucia (entrada)
const CLEAN_Y = 536; // sangre limpia (salida)

// tubo de entrada (foto sangre)
const TUBE_X = 168;
const TUBE_Y = 300;
const TUBE_W = 250;
const TUBE_H = 360;

// trampa de sedimento
const TRAP_X = 540;
const TRAP_Y = 292;
const TRAP_W = 234;
const TRAP_H = 402;

// riñón hero (foto filtro)
const KID_X = 828;
const KID_Y = 248;
const KID_W = 470;
const KID_H = 470;
const KID_CX = KID_X + KID_W / 2;

// segundo riñón (detrás, arriba-derecha)
const K2_X = 1246;
const K2_Y = 176;
const K2_W = 300;
const K2_H = 300;

const FAIL_START = 150; // el filtro empieza a cansarse
const STUCK_N = 22; // partículas que se quedan
const STUCK_EVERY = 6.5; // frames entre una y otra

/** pseudo-aleatorio DETERMINÍSTICO (mismo resultado en cualquier chunk del farm) */
const h = (i: number, s = 1): number => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** latido cardíaco real (lub-dub), no un seno tonto */
const heartbeat = (t: number): number => {
  const p = (t * 1.05) % 1;
  const g = (c: number, w: number) => Math.exp(-((p - c) * (p - c)) / (2 * w * w));
  return g(0.02, 0.042) + 0.55 * g(0.17, 0.05);
};

/* ───────────────────────── piezas de vidrio ───────────────────── */

/** Plano a profundidad Z con compensación de escala: parallax real, tamaño de diseño intacto. */
const Plane: React.FC<{z: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  z,
  style,
  children,
}) => (
  <AbsoluteFill
    style={{
      transformStyle: 'preserve-3d',
      transform: `translateZ(${z}px) scale(${(PERSP - z) / PERSP})`,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Marco de vidrio ahumado con GROSOR (copia atrás), bisel, viñeta interna y barrido especular. */
const GlassPhoto: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  hgt: number;
  radius?: number;
  accent?: string;
  scale?: number;
  rot?: number;
  opacity?: number;
  dim?: number;
  glow?: number;
  sweep?: number;
  children?: React.ReactNode;
}> = ({src, x, y, w, hgt, radius = 26, accent = BAS.aqua, scale = 1, rot = 0, opacity = 1, dim = 0, glow = 0, sweep = 0, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: hgt,
      opacity,
      transformStyle: 'preserve-3d',
      transform: `rotateY(${rot}deg) scale(${scale})`,
    }}
  >
    {/* grosor del vidrio (copia detrás, desplazada) */}
    <div
      style={{
        position: 'absolute',
        inset: -8,
        borderRadius: radius + 8,
        transform: 'translateZ(-16px) translate(10px, 12px)',
        background: `linear-gradient(160deg, ${rgba(BAS.bgPanel, 0.95)}, ${rgba('#020A10', 0.98)})`,
        boxShadow: `0 46px 96px ${rgba('#000000', 0.62)}`,
      }}
    />
    {/* halo de acento (respira) */}
    <div
      style={{
        position: 'absolute',
        inset: -26,
        borderRadius: radius + 26,
        background: `radial-gradient(60% 60% at 50% 50%, ${rgba(accent, 0.3 * glow)} 0%, transparent 72%)`,
        filter: 'blur(10px)',
      }}
    />
    {/* cuerpo */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        overflow: 'hidden',
        border: `1px solid ${rgba('#FFFFFF', 0.1)}`,
        boxShadow: `inset 0 3px 0 ${rgba('#FFFFFF', 0.16)}, inset 0 -10px 26px ${rgba('#000000', 0.72)}, inset 0 0 90px ${rgba('#000000', 0.5)}, 0 28px 62px ${rgba('#000000', 0.52)}`,
        background: `linear-gradient(150deg, ${rgba(BAS.bgPanel, 0.9)}, ${rgba('#03121B', 0.96)})`,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: `saturate(0.86) contrast(1.06) brightness(${0.98 - dim})`,
        }}
      />
      {/* tinte de marca + viñeta interna (la foto nunca queda "cruda") */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(78% 74% at 42% 34%, transparent 34%, ${rgba(BAS.bgDeep, 0.72)} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(200deg, ${rgba(accent, 0.16)} 0%, transparent 48%, ${rgba(BAS.bgDeep, 0.44)} 100%)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* barrido especular del vidrio */}
      <div
        style={{
          position: 'absolute',
          top: -hgt,
          left: -w * 0.4 + sweep * (w * 1.8),
          width: w * 0.34,
          height: hgt * 3,
          transform: 'rotate(18deg)',
          background: `linear-gradient(90deg, transparent, ${rgba('#FFFFFF', 0.1)}, transparent)`,
        }}
      />
      {children}
    </div>
    {/* reflejo superior del cristal */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        pointerEvents: 'none',
        background: `linear-gradient(142deg, ${rgba('#FFFFFF', 0.14)} 0%, transparent 34%)`,
      }}
    />
  </div>
);

/* ──────────────────────────── escena ──────────────────────────── */

const Body: React.FC<Required<FilterMechanismSceneProps>> = ({
  kidneyImg,
  bloodImg,
  title,
  timesLabel,
  times,
  ashLabel,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  /* ── CÁMARA: dolly-in no lineal (dos tramos) + drift senoidal + micro rotateY ── */
  const camA = interpolate(frame, [0, 92], [0, 1], {...CLAMP, easing: easeIO});
  const camB = interpolate(frame, [150, 420], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const dolly = interpolate(camA, [0, 1], [0.932, 1.026]) + camB * 0.036;
  const ry = interpolate(camA, [0, 1], [-7.2, -1.4]) + Math.sin(t * 0.42) * 0.55;
  const rx = interpolate(camA, [0, 1], [-4.2, -0.9]) + Math.sin(t * 0.31) * 0.28;
  const panX = interpolate(camA, [0, 1], [30, 0]) - camB * 26 + Math.sin(t * 0.36) * 4.5;
  const panY = interpolate(camA, [0, 1], [12, 0]) + Math.sin(t * 0.27) * 3.2;

  /* ── entradas escalonadas (a → b → c → d → e → f → g) ── */
  const ambIn = interpolate(frame, [0, 22], [0, 1], {...CLAMP, easing: easeOut});
  const tubeIn = spring({frame: frame - 8, fps, config: {damping: 130, mass: 1.1}});
  const trapIn = spring({frame: frame - 20, fps, config: {damping: 140, mass: 1.05}});
  const kidIn = spring({frame: frame - 26, fps, config: {damping: 120, mass: 1.25}});
  const kid2In = spring({frame: frame - 40, fps, config: {damping: 150, mass: 1.1}});
  const titleIn = interpolate(frame, [44, 74], [0, 1], {...CLAMP, easing: easeIO});
  const titleBlur = interpolate(frame, [44, 78], [9, 0], {...CLAMP, easing: easeIO});
  const measureIn = interpolate(frame, [70, 100], [0, 1], {...CLAMP, easing: easeIO});
  const flowLblIn = interpolate(frame, [100, 128], [0, 1], CLAMP);
  const numIn = spring({frame: frame - 74, fps, config: {damping: 118, mass: 1.3}});

  /* ── CONTADOR: cuenta 0 → times ── */
  const counted = Math.round(interpolate(frame, [80, 152], [0, times], {...CLAMP, easing: easeOut}));

  /* ── latido de los riñones ── */
  const beat = heartbeat(t);
  const beatScale = 1 + beat * 0.019;
  const beat2 = heartbeat(t - 0.14);

  /* ── el filtro se cansa: fracción que ya NO pasa ── */
  const tired = interpolate(frame, [FAIL_START, 300], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const stuckCount = Math.max(0, Math.min(STUCK_N, Math.floor((frame - FAIL_START) / STUCK_EVERY) + 1));
  const fillP = interpolate(stuckCount, [0, STUCK_N], [0, 0.6], CLAMP);
  const fillH = TRAP_H * fillP * (1 + Math.sin(t * 1.1) * 0.006);
  const accent = stuckCount > 0 ? shade(BAS.aqua, -0.1 * tired) : BAS.aqua;
  const ashCardIn = spring({frame: frame - 205, fps, config: {damping: 122, mass: 1.2}});

  /* ── partículas: SANGRE SUCIA que entra ── */
  const blood = Array.from({length: 38}).map((_, i) => {
    const sp = 0.0062 + h(i, 1) * 0.0058;
    const p = (frame * sp + h(i, 2)) % 1;
    const x = -90 + p * (KID_X + 40);
    const y = FLOW_Y + Math.sin(p * Math.PI * 3.1 + i * 1.7) * 27 + Math.sin(t * 1.6 + i) * 3;
    const s = 5 + h(i, 3) * 6;
    const op = interpolate(p, [0, 0.06, 0.86, 1], [0, 1, 1, 0], CLAMP) * (0.5 + h(i, 4) * 0.5) * ambIn;
    return {x, y, s, op, i};
  });

  /* ── partículas: CENIZA que SÍ se barre (baja por la canaleta) ── */
  const swept = Array.from({length: 14}).map((_, i) => {
    const sp = 0.0056 + h(i, 11) * 0.0034;
    const p = (frame * sp + h(i, 12)) % 1;
    const inFilter = p > 0.7;
    const q = inFilter ? (p - 0.7) / 0.3 : 0;
    const x = inFilter ? KID_CX - 120 + q * 46 : -90 + (p / 0.7) * (KID_CX - 120 + 90);
    const y = inFilter ? KID_Y + KID_H - 40 + q * q * 470 : FLOW_Y + Math.sin(p * Math.PI * 2.6 + i * 2.3) * 22;
    const s = 6 + h(i, 13) * 5;
    const op =
      interpolate(p, [0, 0.05, 0.9, 1], [0, 1, 1, 0], CLAMP) * (1 - tired * 0.45) * ambIn;
    return {x, y, s, op, i};
  });

  /* ── partículas: CENIZA que YA NO PASA y se ACUMULA en la trampa ── */
  const stuck = Array.from({length: STUCK_N}).map((_, i) => {
    const born = FAIL_START + i * STUCK_EVERY;
    const a = interpolate(frame, [born, born + 22], [0, 1], {...CLAMP, easing: easeIO});
    const col = i % 6;
    const row = Math.floor(i / 6);
    const sx = TRAP_X + 26 + col * ((TRAP_W - 52) / 5) + (h(i, 21) - 0.5) * 14;
    const sy = TRAP_Y + TRAP_H - 46 - row * 34 - h(i, 22) * 12;
    const x = interpolate(a, [0, 1], [TRAP_X - 520, sx]);
    const y = interpolate(a, [0, 1], [FLOW_Y + Math.sin(i * 2.1) * 20, sy]) + (a > 0.98 ? Math.sin(t * 1.4 + i) * 1.6 : 0);
    const s = 8 + h(i, 23) * 7;
    return {x, y, s, op: a * 0.95, i};
  });

  /* ── partículas: SANGRE LIMPIA que sale ── */
  const clean = Array.from({length: 30}).map((_, i) => {
    const sp = 0.0068 + h(i, 31) * 0.0055;
    const p = (frame * sp + h(i, 32)) % 1;
    const x = KID_X + KID_W - 40 + p * 780;
    const y = CLEAN_Y + Math.sin(p * Math.PI * 2.4 + i * 1.3) * 24 + Math.sin(t * 1.3 + i) * 3;
    const s = 4 + h(i, 33) * 5;
    const op = interpolate(p, [0, 0.12, 0.82, 1], [0, 1, 1, 0], CLAMP) * (0.55 + h(i, 34) * 0.45) * flowLblIn;
    return {x, y, s, op, i};
  });

  const sweepPos = ((t * 0.28) % 1.6) - 0.3;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 118% at 46% 16%, ${shade(BAS.aqua, -0.62)} 0%, ${BAS.bgPanel} 42%, ${BAS.bgDeep} 100%)`,
        perspective: PERSP,
        perspectiveOrigin: '48% 46%',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) translate(${panX}px, ${panY}px) scale(${dolly})`,
          transformOrigin: '48% 48%',
        }}
      >
        {/* ── z −340 · ATMÓSFERA: el río de sangre de fondo, fuera de foco ── */}
        <Plane z={-340}>
          <div
            style={{
              position: 'absolute',
              left: -240,
              top: FLOW_Y - 210,
              width: 2500,
              height: 420,
              opacity: 0.5 * ambIn,
              filter: 'blur(46px)',
              background: `linear-gradient(90deg, ${rgba('#7E2A28', 0.75)} 0%, ${rgba('#8A3230', 0.55)} 38%, ${rgba(BAS.aquaDark, 0.5)} 64%, ${rgba(BAS.aqua, 0.42)} 100%)`,
              transform: `translateY(${Math.sin(t * 0.5) * 8}px)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.55 * ambIn,
              background: `radial-gradient(46% 42% at ${KID_CX / 19.2}% 44%, ${rgba(accent, 0.2)} 0%, transparent 70%)`,
            }}
          />
        </Plane>

        {/* ── z −200 · SEGUNDO RIÑÓN (son DOS) + resplandor de sala ── */}
        <Plane z={-200}>
          <div style={{opacity: kid2In * 0.92, filter: 'blur(1.6px)'}}>
            <GlassPhoto
              src={KIDNEY2_IMG}
              x={K2_X}
              y={K2_Y + interpolate(kid2In, [0, 1], [26, 0])}
              w={K2_W}
              hgt={K2_H}
              radius={22}
              accent={accent}
              rot={-9}
              dim={0.16}
              glow={0.5 + beat2 * 0.5}
              scale={1 + beat2 * 0.012}
              sweep={sweepPos - 0.5}
            />
          </div>
          {/* rótulo ARRIBA del segundo riñón: zona libre (el hero arranca en y≈248, el título termina en x≈1176) */}
          <div
            style={{
              position: 'absolute',
              left: K2_X + 6,
              top: K2_Y - 66,
              opacity: kid2In,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 3,
                color: rgba(BAS.onDark, 0.82),
                textShadow: `0 3px 16px ${rgba('#000000', 0.9)}`,
                whiteSpace: 'nowrap',
              }}
            >
              y el otro
            </span>
            <span
              style={{
                width: 46,
                height: 2,
                background: `linear-gradient(90deg, ${rgba(BAS.aqua, 0.75)}, transparent)`,
              }}
            />
          </div>
        </Plane>

        {/* ── z −110 · CAUDAL DE FONDO: la sangre sucia que entra ── */}
        <Plane z={-110}>
          {/* conducto de vidrio de la entrada */}
          <div
            style={{
              position: 'absolute',
              left: -60,
              top: FLOW_Y - 62,
              width: KID_X + 140,
              height: 124,
              borderRadius: 62,
              opacity: 0.85 * ambIn,
              background: `linear-gradient(180deg, ${rgba('#FFFFFF', 0.07)} 0%, ${rgba('#3A1211', 0.34)} 40%, ${rgba('#000000', 0.42)} 100%)`,
              boxShadow: `inset 0 2px 0 ${rgba('#FFFFFF', 0.14)}, inset 0 -8px 20px ${rgba('#000000', 0.6)}`,
              border: `1px solid ${rgba('#FFFFFF', 0.07)}`,
            }}
          />
          {blood.map((b) => (
            <div
              key={`bl${b.i}`}
              style={{
                position: 'absolute',
                left: b.x,
                top: b.y,
                width: b.s,
                height: b.s,
                borderRadius: '50%',
                opacity: b.op,
                background: `radial-gradient(circle at 34% 30%, #E08B84 0%, #B8453F 46%, #6E1D1B 100%)`,
                boxShadow: `0 0 ${b.s * 2}px ${rgba('#B8453F', 0.5)}`,
              }}
            />
          ))}
          {/* conducto limpio de salida */}
          <div
            style={{
              position: 'absolute',
              left: KID_X + KID_W - 70,
              top: CLEAN_Y - 56,
              width: 900,
              height: 112,
              borderRadius: 56,
              opacity: 0.9 * flowLblIn,
              background: `linear-gradient(180deg, ${rgba('#FFFFFF', 0.08)} 0%, ${rgba(BAS.aquaDark, 0.3)} 40%, ${rgba('#00131A', 0.44)} 100%)`,
              boxShadow: `inset 0 2px 0 ${rgba('#FFFFFF', 0.16)}, inset 0 -8px 20px ${rgba('#000000', 0.55)}`,
              border: `1px solid ${rgba(BAS.aqua, 0.16)}`,
            }}
          />
          {clean.map((c) => (
            <div
              key={`cl${c.i}`}
              style={{
                position: 'absolute',
                left: c.x,
                top: c.y,
                width: c.s,
                height: c.s,
                borderRadius: '50%',
                opacity: c.op,
                background: `radial-gradient(circle at 34% 30%, ${BAS.aquaLite} 0%, ${BAS.aqua} 52%, ${BAS.aquaDark} 100%)`,
                boxShadow: `0 0 ${c.s * 3}px ${rgba(BAS.aqua, 0.65)}`,
              }}
            />
          ))}
        </Plane>

        {/* ── z −40 · TUBO DE SANGRE (foto real) + TRAMPA DE SEDIMENTO ── */}
        <Plane z={-40}>
          <div style={{opacity: tubeIn}}>
            <GlassPhoto
              src={bloodImg}
              x={TUBE_X}
              y={TUBE_Y + interpolate(tubeIn, [0, 1], [40, 0])}
              w={TUBE_W}
              hgt={TUBE_H}
              radius={124}
              accent={'#C4534C'}
              rot={6}
              dim={0.06}
              glow={0.4}
              sweep={sweepPos}
              scale={interpolate(tubeIn, [0, 1], [0.9, 1])}
            />
          </div>

          {/* TRAMPA: vaso de vidrio donde se acumula lo que no se barre */}
          <div
            style={{
              position: 'absolute',
              left: TRAP_X,
              top: TRAP_Y,
              width: TRAP_W,
              height: TRAP_H,
              opacity: trapIn,
              transform: `translateY(${interpolate(trapIn, [0, 1], [34, 0])}px) scale(${interpolate(trapIn, [0, 1], [0.92, 1])})`,
              borderRadius: '18px 18px 42px 42px',
              overflow: 'hidden',
              border: `1px solid ${rgba('#FFFFFF', 0.13)}`,
              background: `linear-gradient(160deg, ${rgba('#FFFFFF', 0.06)}, ${rgba('#03121B', 0.5)})`,
              boxShadow: `inset 0 3px 0 ${rgba('#FFFFFF', 0.2)}, inset 0 -14px 34px ${rgba('#000000', 0.6)}, 0 30px 70px ${rgba('#000000', 0.5)}`,
            }}
          >
            {/* SEDIMENTO REAL que sube (foto de desecho, teñida de ámbar) */}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: fillH, overflow: 'hidden'}}>
              <Img
                src={staticFile(ASH_IMG)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 0,
                  width: TRAP_W * 1.7,
                  height: TRAP_H * 0.72,
                  transform: 'translateX(-50%)',
                  objectFit: 'cover',
                  filter: 'saturate(0.72) contrast(1.1) brightness(0.62)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, ${rgba(BAS.amber, 0.42)} 0%, ${rgba(BAS.amberDark, 0.36)} 58%, ${rgba('#160C02', 0.6)} 100%)`,
                }}
              />
              {/* línea de superficie del sedimento (viva) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 4,
                  background: `linear-gradient(90deg, transparent, ${BAS.amber}, transparent)`,
                  boxShadow: `0 0 22px ${rgba(BAS.amber, 0.75)}`,
                  transform: `translateY(${Math.sin(t * 1.5) * 2}px)`,
                }}
              />
            </div>
            {/* pared de vidrio con marcas de nivel */}
            {Array.from({length: 7}).map((_, i) => (
              <div
                key={`tk${i}`}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 34 + i * ((TRAP_H - 60) / 6),
                  width: i % 2 === 0 ? 26 : 14,
                  height: 2,
                  background: rgba('#CFE8F2', 0.28),
                }}
              />
            ))}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(140deg, ${rgba('#FFFFFF', 0.12)} 0%, transparent 32%)`,
              }}
            />
          </div>
        </Plane>

        {/* ── z 0 · RIÑÓN HERO (el filtro) — LATE ── */}
        <Plane z={0}>
          <div style={{opacity: kidIn}}>
            <GlassPhoto
              src={kidneyImg}
              x={KID_X}
              y={KID_Y + interpolate(kidIn, [0, 1], [46, 0])}
              w={KID_W}
              hgt={KID_H}
              radius={30}
              accent={accent}
              dim={0.02 + tired * 0.1}
              glow={0.6 + beat * 0.7}
              sweep={sweepPos}
              scale={interpolate(kidIn, [0, 1], [0.86, 1]) * beatScale}
              rot={interpolate(kidIn, [0, 1], [7, 0])}
            >
              {/* MEMBRANA: malla de filtrado sobre la foto (solo la cara de entrada) */}
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 96, opacity: 0.7}}>
                {Array.from({length: 16}).map((_, i) => (
                  <div
                    key={`mb${i}`}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: i * (KID_H / 16) + 6,
                      height: 2,
                      background: `linear-gradient(90deg, ${rgba(accent, 0.75 - tired * 0.45)}, transparent)`,
                      transform: `translateY(${Math.sin(t * 2.2 + i * 0.7) * 2}px)`,
                    }}
                  />
                ))}
              </div>
              {/* pulso de filtrado que recorre el riñón */}
              <div
                style={{
                  position: 'absolute',
                  left: -140 + ((t * 150) % (KID_W + 280)),
                  top: 0,
                  bottom: 0,
                  width: 140,
                  background: `linear-gradient(90deg, transparent, ${rgba(accent, 0.22)}, transparent)`,
                  mixBlendMode: 'screen',
                }}
              />
            </GlassPhoto>
          </div>

          {/* CANALETA de lo barrido (baja del riñón y se va del cuadro) */}
          <div
            style={{
              position: 'absolute',
              left: KID_CX - 132,
              top: KID_Y + KID_H - 26,
              width: 92,
              height: 420,
              opacity: 0.55 * kidIn * (1 - tired * 0.35),
              borderRadius: '0 0 46px 46px',
              background: `linear-gradient(180deg, ${rgba(BAS.amber, 0.2)} 0%, transparent 88%)`,
              border: `1px solid ${rgba(BAS.amber, 0.14)}`,
              borderTop: 'none',
            }}
          />
        </Plane>

        {/* ── z +60 · CENIZA (la que se barre y la que se QUEDA) ── */}
        <Plane z={60}>
          {swept.map((s) => (
            <div
              key={`sw${s.i}`}
              style={{
                position: 'absolute',
                left: s.x,
                top: s.y,
                width: s.s,
                height: s.s,
                borderRadius: '46%',
                opacity: s.op,
                background: `radial-gradient(circle at 32% 28%, ${shade(BAS.amber, 0.3)} 0%, ${BAS.amber} 48%, ${BAS.amberDark} 100%)`,
                boxShadow: `0 0 ${s.s * 2.2}px ${rgba(BAS.amber, 0.55)}`,
                transform: `rotate(${s.i * 37 + t * 40}deg)`,
              }}
            />
          ))}
          {stuck.map((s) => (
            <div
              key={`st${s.i}`}
              style={{
                position: 'absolute',
                left: s.x,
                top: s.y,
                width: s.s,
                height: s.s,
                borderRadius: '44%',
                opacity: s.op,
                background: `radial-gradient(circle at 32% 28%, ${shade(BAS.amber, 0.34)} 0%, ${BAS.amber} 44%, ${BAS.amberDark} 100%)`,
                boxShadow: `0 3px 10px ${rgba('#000000', 0.55)}, 0 0 ${s.s * 2.4}px ${rgba(BAS.amber, 0.6)}`,
                transform: `rotate(${s.i * 53 + Math.sin(t + s.i) * 6}deg)`,
              }}
            />
          ))}
        </Plane>

        {/* ── z +140 · RÓTULOS ── */}
        <Plane z={140}>
          {/* kicker + título */}
          <div style={{position: 'absolute', left: 96, top: 52, opacity: titleIn, filter: `blur(${titleBlur}px)`}}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontFamily: FONT_SANS,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 7,
                color: BAS.aqua,
                textShadow: `0 0 20px ${rgba(BAS.aqua, 0.5)}`,
              }}
            >
              <span style={{width: 54, height: 3, background: BAS.aqua, boxShadow: `0 0 16px ${rgba(BAS.aqua, 0.8)}`}} />
              EL MECANISMO
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: FONT_DISPLAY,
                fontSize: 62,
                fontWeight: 700,
                lineHeight: 1.06,
                color: '#F2FAFD',
                maxWidth: 1080,
                textShadow: `0 4px 22px ${rgba('#000000', 0.85)}, 0 1px 0 ${rgba('#000000', 0.6)}`,
                transform: `translateY(${interpolate(titleIn, [0, 1], [22, 0])}px)`,
              }}
            >
              {title}
            </div>
          </div>

          {/* rótulo ENTRA SUCIA — ARRIBA del tubo (abajo ahora vive la cifra) */}
          <div
            style={{
              position: 'absolute',
              left: TUBE_X - 10,
              top: 224,
              opacity: flowLblIn,
              fontFamily: FONT_SANS,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 2,
              color: '#F0C9C6',
              textShadow: `0 3px 16px ${rgba('#000000', 0.85)}`,
            }}
          >
            entra sucia
          </div>

          {/* rótulo SALE LIMPIA */}
          <div
            style={{
              position: 'absolute',
              left: KID_X + KID_W + 250,
              top: CLEAN_Y + 96,
              opacity: flowLblIn,
              fontFamily: FONT_SANS,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 2,
              color: BAS.aquaLite,
              textShadow: `0 3px 16px ${rgba('#000000', 0.85)}, 0 0 24px ${rgba(BAS.aqua, 0.45)}`,
            }}
          >
            sale limpia
          </div>

          {/* ACOTACIÓN "≈ su puño" bajo el riñón hero */}
          <div style={{position: 'absolute', left: KID_X, top: KID_Y + KID_H + 22, width: KID_W, opacity: measureIn}}>
            <svg width={KID_W} height={26} viewBox={`0 0 ${KID_W} 26`}>
              <line x1={2} y1={4} x2={2} y2={22} stroke={rgba(BAS.aqua, 0.85)} strokeWidth={3} />
              <line x1={KID_W - 2} y1={4} x2={KID_W - 2} y2={22} stroke={rgba(BAS.aqua, 0.85)} strokeWidth={3} />
              <line
                x1={2}
                y1={13}
                x2={KID_W - 2}
                y2={13}
                stroke={rgba(BAS.aqua, 0.75)}
                strokeWidth={2}
                strokeDasharray={KID_W}
                strokeDashoffset={interpolate(measureIn, [0, 1], [KID_W, 0])}
              />
            </svg>
            <div
              style={{
                textAlign: 'center',
                marginTop: 2,
                fontFamily: FONT_HAND,
                fontSize: 46,
                color: BAS.aquaLite,
                textShadow: `0 3px 14px ${rgba('#000000', 0.8)}`,
              }}
            >
              ≈ del tamaño de su puño
            </div>
          </div>

          {/* TARJETA CLÍNICA: lo que queda sin barrer = creatinina */}
          <div
            style={{
              position: 'absolute',
              left: 1040,
              bottom: 120,
              width: 770,
              opacity: ashCardIn,
              transformStyle: 'preserve-3d',
              transform: `translateY(${interpolate(ashCardIn, [0, 1], [46, 0])}px) rotateY(${interpolate(ashCardIn, [0, 1], [-9, 0])}deg)`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                borderRadius: 18,
                overflow: 'hidden',
                background: `linear-gradient(160deg, ${BAS.card}, ${BAS.cardWarm})`,
                border: `1px solid ${BAS.cardEdge}`,
                boxShadow: CARD_SHADOW,
              }}
            >
              <div
                style={{
                  width: 14,
                  background: `linear-gradient(180deg, ${BAS.amber}, ${BAS.amberDark})`,
                  boxShadow: `0 0 26px ${rgba(BAS.amber, 0.6)}`,
                }}
              />
              <div style={{padding: '22px 30px 24px 26px'}}>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: 4,
                    color: BAS.amberDark,
                  }}
                >
                  EN EL ANÁLISIS
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: FONT_DISPLAY,
                    fontSize: 44,
                    fontWeight: 700,
                    lineHeight: 1.14,
                    color: BAS.ink,
                  }}
                >
                  {ashLabel}
                </div>
              </div>
            </div>
          </div>
        </Plane>

        {/* ── z +170 · LA CIFRA AL FRENTE (anclada por ABAJO: la perspectiva la agranda) ── */}
        <Plane z={170}>
          <div
            style={{
              position: 'absolute',
              left: 150,
              bottom: 120,
              opacity: numIn,
              transform: `translateY(${interpolate(numIn, [0, 1], [40, 0])}px)`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
              {/* número acrílico: bloom + extrusión + cara con gradiente */}
              <div style={{position: 'relative'}}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    fontFamily: FONT_NUM,
                    fontSize: 186,
                    fontWeight: 800,
                    lineHeight: 0.88,
                    color: BAS.aqua,
                    filter: 'blur(26px)',
                    opacity: 0.55,
                  }}
                >
                  {counted}
                </div>
                {[6, 5, 4, 3, 2, 1].map((d) => (
                  <div
                    key={`ex${d}`}
                    style={{
                      position: 'absolute',
                      left: d * 1.6,
                      top: d * 2.2,
                      fontFamily: FONT_NUM,
                      fontSize: 186,
                      fontWeight: 800,
                      lineHeight: 0.88,
                      color: shade(BAS.aquaDark, -0.35 - d * 0.05),
                    }}
                  >
                    {counted}
                  </div>
                ))}
                <div
                  style={{
                    position: 'relative',
                    fontFamily: FONT_NUM,
                    fontSize: 186,
                    fontWeight: 800,
                    lineHeight: 0.88,
                    backgroundImage: `linear-gradient(150deg, ${BAS.aquaLite} 0%, ${BAS.aqua} 52%, ${shade(BAS.aquaDark, 0.1)} 100%)`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    filter: `drop-shadow(0 0 30px ${rgba(BAS.aqua, 0.4)})`,
                  }}
                >
                  {counted}
                </div>
              </div>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 46,
                  fontWeight: 700,
                  color: rgba(BAS.onDark, 0.8),
                  textShadow: `0 3px 14px ${rgba('#000000', 0.8)}`,
                }}
              >
                veces
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                width: interpolate(numIn, [0, 1], [0, 470]),
                height: 3,
                background: `linear-gradient(90deg, ${BAS.aqua}, transparent)`,
                boxShadow: `0 0 18px ${rgba(BAS.aqua, 0.7)}`,
              }}
            />
            <div
              style={{
                marginTop: 12,
                maxWidth: 640,
                fontFamily: FONT_SANS,
                fontSize: 36,
                fontWeight: 600,
                lineHeight: 1.24,
                color: '#DCEFF7',
                textShadow: `0 3px 16px ${rgba('#000000', 0.88)}`,
              }}
            >
              {timesLabel}
            </div>
          </div>
        </Plane>
      </AbsoluteFill>

      {/* atmósfera final */}
      <WaterMotes count={16} frame={frame} fps={fps} />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(128% 116% at 48% 44%, transparent 50%, ${rgba(BAS.bgEdge, 0.66)} 100%)`,
        }}
      />
      <GrainOverlay opacity={0.055} />
    </AbsoluteFill>
  );
};

export const FilterMechanismScene: React.FC<FilterMechanismSceneProps> = ({
  kidneyImg = 'img/bas6_p_rinon_filtro.jpg',
  bloodImg = 'img/bas6_p_sangre_tubo.jpg',
  title = 'Dos filtros del tamaño de su puño',
  timesLabel = 'veces por día le limpian toda la sangre',
  times = 30,
  ashLabel = 'Lo que queda sin barrer es su creatinina',
}) => (
  <Sequence durationInFrames={420}>
    <Body
      kidneyImg={kidneyImg}
      bloodImg={bloodImg}
      title={title}
      timesLabel={timesLabel}
      times={times}
      ashLabel={ashLabel}
    />
  </Sequence>
);

export default FilterMechanismScene;
