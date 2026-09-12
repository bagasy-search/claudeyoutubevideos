/**
 * MovOxygen.tsx — MOVIMIENTO "OXYGEN" del video `mdmold` (canal Mike Dalton, EN).
 * 738 frames @ 30 fps (24,6 s). UN SOLO MOVIMIENTO: 4 actos que se FUNDEN.
 *
 * ── LA IDEA ──────────────────────────────────────────────────────────────────────────────────
 * El agua es H₂O. El peróxido es esa misma agua con UN OXÍGENO DE MÁS, mal agarrado, que se
 * quiere ir. Cuando se va, rompe la pared de la célula del moho. Y como es fino como el agua,
 * BAJA a donde el cloro nunca llega. Remate: "Bleach kills what it can touch. Peroxide kills
 * what it can reach."
 *
 * ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
 * (cam = rig() continuo sobre el frame GLOBAL; NUNCA se reinicia · luz = light(t,"red","cold"))
 *
 * ACTO 1 · LA BOTELLA · f0
 *   enterFrom  cam  {z 0, ry 0, rx +1.2} — hereda la posición del movimiento anterior, arranca quieta
 *              luz  ROJO de alerta (t=0) + lavado rojo residual que se retira en 170f
 *              mat  MOTES en z+300 ya están en pantalla desde el frame 0 (no nacen nunca)
 *   exitTo     cam  {z 92, ry −1.6} viajando; el ZOOM no lo hace la cámara, lo hace la MATERIA
 *              luz  t≈0.22 (rojo→frío empezado)
 *              mat  el LÍQUIDO ámbar de la botella crece hasta tapar el cuadro + burbujas en fuga
 *
 * ACTO 2 · LA MOLÉCULA · f232   [FRONTERA 1 = ZOOM-THROUGH por el líquido]
 *   enterFrom  cam  {z 92, ry −1.6} EXACTOS los del acto 1 (misma función, sin corte)
 *              luz  t≈0.22
 *              mat  entramos DENTRO del líquido: la molécula nace a escala 3.4 (estamos adentro)
 *                   y la ÚLTIMA BURBUJA de la botella vuela y se ACOPLA como el oxígeno de más
 *   exitTo     cam  {z 54, ry +3.0}
 *              luz  t≈0.35
 *              mat  el átomo O extra, vibrando al límite, con el enlace al rojo vivo
 *
 * ACTO 3 · LA PARED · f382      [FRONTERA 2 = MATCH-MOVE sobre el átomo]
 *   enterFrom  cam  {z 54, ry +3.0} + INERCIA de impacto (oscilación amortiguada en f448)
 *              luz  t≈0.35
 *              mat  el MISMO átomo queda CLAVADO en (1330,520) mientras el mundo cambia detrás:
 *                   la molécula se va en profundidad y la pared celular llega desde z −1180
 *   exitTo     cam  {z 96, ry −2.1}
 *              luz  t≈0.72 (ya casi frío)
 *              mat  el líquido que se derrama de la célula rota CAE por x≈1300
 *
 * ACTO 4 · EL PORO · f544       [FRONTERA 3 = WIPE POR MATERIA (<VaporWipe/>)]
 *   enterFrom  cam  {z 96, ry −2.1} sin salto
 *              luz  t≈0.72 → BLANCO FRÍO en la frase de oro
 *              mat  ese mismo chorro entra por la boca del poro en x≈1300 y sigue bajando
 *   exitTo     — (fin del movimiento) cam {z 196}, luz FRÍA, el hilo late en la raíz
 *
 * FRONTERA INTERNA · f≈650      [CORTE EN EL BEAT (<Occluder/>) entre "touch" y "reach"]
 *
 * ⛔ CONTRATO: nada de Math.random / Date · sin backdrop-filter · sin blur grande a pantalla
 *    completa · sin Easing.quint · sin fade global · imports sólo remotion/react/./Stage.
 */

import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import {
  MD,
  F_SANS,
  rgba,
  lerp,
  clamp01,
  rnd,
  cam,
  light,
  Atmos,
  glassStyle,
  Sheen,
  Occluder,
  VaporWipe,
  Kicker,
  Title,
  Em,
  TextBed,
} from "./Stage";

/* ════════════════════════════════════════════════════════════════════════════════════════════
   ANCLAS · el guion, al frame
   ════════════════════════════════════════════════════════════════════════════════════════════ */
const A2 = 232; // "Peroxide is water with one extra oxygen atom stuck on it."  (240)
const A3 = 382; // "That oxygen is desperate to leave... tears the cell walls apart." (360)
const A4 = 544; // "thin like water... down to the roots." (520)

// punto de inmersión: la ventana de líquido de la botella. Es el ORIGEN de todo el zoom-through.
const DX = 620;
const DY = 556;

// molécula derecha (la que se vuelve peróxido) y posición del oxígeno de más
const RX = 1290;
const RY = 560;
const OBX = RX + 80;
const OBY = RY - 8;

// el átomo, ya suelto, queda CLAVADO acá (match-move)
const LOCKX = 1330;
const LOCKY = 520;

// célula del moho
const CELLX = 1150;
const CELLY = 700;
const CELLR = 248;

// columna de fragua (acto 4)
const COLX = 1270; // centro de la columna
const COLW = 300;
const SURF = 214; // y de la superficie

/* ════════════════════════════════════════════════════════════════════════════════════════════
   UTILIDADES puras
   ════════════════════════════════════════════════════════════════════════════════════════════ */
const seg = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
const ez = (p: number, easing: (x: number) => number) =>
  interpolate(p, [0, 1], [0, 1], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const E_OUT = Easing.out(Easing.cubic);
const E_SOFT = Easing.inOut(Easing.quad);
const E_SNAP = Easing.out(Easing.back(1.7));
const E_DIVE = Easing.in(Easing.cubic);

const wrap = (x: number, m: number) => ((x % m) + m) % m;

// De coordenada APARENTE (lo que ve el ojo) a coordenada local de un plano en z.
// Sirve para que un objeto de un plano ATERRICE exacto sobre un objeto de otro plano.
const unproj = (x: number, y: number, z: number) => {
  const k = (1600 - z) / 1600;
  return { x: 960 + (x - 960) * k, y: 497 + (y - 497) * k };
};

// El canal del poro, evaluado de verdad: la cabeza del hilo VA por la curva, no al lado.
const SEGS: number[][][] = [
  [[1300, 214], [1268, 300], [1332, 350], [1294, 428]],
  [[1294, 428], [1256, 506], [1226, 548], [1258, 638]],
  [[1258, 638], [1290, 728], [1300, 792], [1266, 872]],
];
const SEGW = [0.325, 0.325, 0.35];
const onChannel = (t: number) => {
  let r = clamp01(t);
  let i = 0;
  while (i < 2 && r > SEGW[i]) {
    r -= SEGW[i];
    i += 1;
  }
  const u = clamp01(r / SEGW[i]);
  const m = 1 - u;
  const w = [m * m * m, 3 * m * m * u, 3 * m * u * u, u * u * u];
  const P = SEGS[i];
  return {
    x: w[0] * P[0][0] + w[1] * P[1][0] + w[2] * P[2][0] + w[3] * P[3][0],
    y: w[0] * P[0][1] + w[1] * P[1][1] + w[2] * P[2][1] + w[3] * P[3][1],
  };
};

// oscilación amortiguada — la inercia después de un golpe
const shockWave = (f: number, at: number, amp: number, dur: number, w = 2.6) => {
  if (f < at) return 0;
  const k = clamp01((f - at) / dur);
  return Math.sin((f - at) / w) * amp * (1 - k) * (1 - k);
};

/* ── LA CÁMARA ───────────────────────────────────────────────────────────────────────────────
   UNA función del frame GLOBAL. Sin ramas por acto: el acto 3 hereda literalmente el valor con
   el que terminó el 2 porque es la MISMA curva. Encima corre cam() de Stage (el cuerpo/respiración
   compartido del video) — las dos son puras y ninguna vuelve a cero.                            */
const rig = (f: number) => {
  const z = interpolate(
    f,
    [0, 120, 232, 300, 382, 448, 520, 600, 738],
    [0, 34, 92, 70, 54, 116, 96, 132, 196],
    { easing: E_SOFT, ...CL },
  );
  const ry = interpolate(f, [0, 110, 232, 300, 448, 544, 660, 738], [0, -5.2, -1.6, 3.0, 1.1, -2.1, -0.5, 0.9], {
    easing: E_SOFT,
    ...CL,
  });
  const rx = interpolate(f, [0, 232, 448, 544, 738], [1.2, -0.6, 1.6, -0.4, 0.6], { easing: E_SOFT, ...CL });
  const px = interpolate(f, [0, 232, 448, 544, 738], [0, -26, 18, -14, 10], { easing: E_SOFT, ...CL });
  const py = interpolate(f, [0, 232, 448, 544, 738], [0, 12, -8, 6, -12], { easing: E_SOFT, ...CL });
  const kick = shockWave(f, 448, 10, 46); // la cámara SIENTE el impacto del acto 3
  return {
    transform:
      `translate3d(${(px + kick).toFixed(2)}px, ${(py + kick * 0.45).toFixed(2)}px, ${z.toFixed(2)}px) ` +
      `rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)`,
  };
};

// escala de la molécula: nacemos ADENTRO (3.4) y salimos a tamaño real
const molScale = (f: number) => interpolate(f, [224, 284], [3.4, 1], { easing: E_OUT, ...CL });

/* ════════════════════════════════════════════════════════════════════════════════════════════
   PIEZAS
   ════════════════════════════════════════════════════════════════════════════════════════════ */

/** Plano de profundidad: cada uno con su propio translateZ → parallax real, no simulado. */
const Plane: React.FC<{ z: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  z,
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transformStyle: "preserve-3d",
      transform: `translateZ(${z.toFixed(2)}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Revelado por máscara (NO por opacidad): el texto se descubre de abajo hacia arriba. */
const Rise: React.FC<{ at: number; dur?: number; dy?: number; children: React.ReactNode }> = ({
  at,
  dur = 13,
  dy = 30,
  children,
}) => {
  const f = useCurrentFrame();
  const e = ez(seg(f, at, at + dur), E_OUT);
  return (
    <div
      style={{
        transform: `translateY(${((1 - e) * dy).toFixed(2)}px)`,
        clipPath: `inset(${((1 - e) * 108).toFixed(2)}% -14% -18% -14%)`,
      }}
    >
      {children}
    </div>
  );
};

/** Motas / micro-gotas fuera de foco. Montadas UNA vez, viven los 738 frames: el pegamento. */
const Motes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const a = rnd(i * 1.7);
        const b = rnd(i * 3.1 + 9);
        const c = rnd(i * 5.3 + 21);
        const s = 5 + c * 16;
        const x = wrap(a * 118 + Math.sin(f / (54 + b * 40) + i) * 2.4, 118) - 9;
        const y = wrap(b * 118 + f * (0.035 + c * 0.05), 118) - 9;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: s,
              height: s,
              borderRadius: "50%",
              background: `radial-gradient(circle at 36% 30%, ${rgba(MD.white, 0.5)} 0%, ${rgba(MD.white, 0.1)} 55%, rgba(255,255,255,0) 72%)`,
              opacity: 0.1 + c * 0.2,
              filter: c > 0.6 ? `blur(${(1.4 + c * 2.6).toFixed(1)}px)` : undefined,
            }}
          />
        );
      })}
    </>
  );
};

/* ── ACTO 1 ─────────────────────────────────────────────────────────────────────────────────── */

/** Pared de azulejos al fondo (plano lejano). */
const TileWall: React.FC<{ tint: string }> = ({ tint }) => (
  <div style={{ position: "absolute", inset: "-24%" }}>
    {Array.from({ length: 40 }, (_, i) => {
      const cx = i % 8;
      const cy = Math.floor(i / 8);
      const g = rnd(i * 2.9);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${cx * 12.5}%`,
            top: `${cy * 20}%`,
            width: "12.5%",
            height: "20%",
            boxSizing: "border-box",
            border: `4px solid ${rgba("#000000", 0.85)}`,
            background: `linear-gradient(148deg, ${rgba(tint, 0.05 + g * 0.035)} 0%, rgba(10,10,12,0.9) 62%, rgba(4,4,6,0.95) 100%)`,
            boxShadow: `inset 1px 1px 0 ${rgba(MD.white, 0.05)}`,
          }}
        />
      );
    })}
  </div>
);

/** El frasco marrón de farmacia. Luz de producto: key izquierda, rim frío derecha, sombra que aterriza. */
const AmberBottle: React.FC<{ f: number; tilt: number; capLift: number; reveal: number; squeeze: number }> = ({
  f,
  tilt,
  capLift,
  reveal,
  squeeze,
}) => {
  const BW = 200;
  const bob = Math.sin(f / 26) * 4.5;
  return (
    <div
      style={{
        position: "absolute",
        left: DX,
        top: DY + 60,
        width: BW,
        height: 420,
        transform: `translate(-50%,-50%) translateY(${bob.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg) scaleX(${(1 + squeeze * 0.04).toFixed(3)}) scaleY(${(1 - squeeze * 0.03).toFixed(3)})`,
        transformOrigin: "50% 88%",
        transformStyle: "preserve-3d",
      }}
    >
      {/* sombra de contacto que ATERRIZA */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 388,
          width: 300,
          height: 46,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 46%, rgba(0,0,0,0) 74%)",
          filter: "blur(4px)",
        }}
      />
      {/* halo de key detrás del vidrio ámbar */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 210,
          width: 420,
          height: 430,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(MD.warm, 0.2)} 0%, ${rgba(MD.warm, 0.06)} 44%, rgba(0,0,0,0) 70%)`,
          filter: "blur(6px)",
        }}
      />

      {/* TAPA */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -6 - capLift * 74,
          width: 96,
          height: 56,
          transform: `translateX(-50%) rotate(${(capLift * 26).toFixed(1)}deg)`,
          borderRadius: 7,
          background:
            "linear-gradient(96deg, #05060700 0%, #1B1D21 12%, #34383E 34%, #15171A 62%, #050607 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 3px, rgba(0,0,0,0.3) 3px 6px)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.22), 0 10px 20px rgba(0,0,0,0.6)",
        }}
      />
      {/* cuello */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 44,
          width: 70,
          height: 34,
          transform: "translateX(-50%)",
          background: "linear-gradient(96deg, #170C05 0%, #6B3A1C 30%, #A2622F 48%, #4A2712 78%, #150B04 100%)",
          borderRadius: 4,
        }}
      />
      {/* hombro + cuerpo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 74,
          width: BW,
          height: 300,
          transform: "translateX(-50%)",
          borderRadius: "56px 56px 26px 26px",
          background:
            "linear-gradient(96deg, #120903 0%, #4C2911 13%, #93521F 33%, #C07B37 44%, #7B4520 62%, #35190A 84%, #0D0602 100%)",
          boxShadow: "inset 0 -26px 40px rgba(0,0,0,0.62), 0 26px 54px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}
      >
        {/* rim frío de la ventanita, borde derecho */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 16,
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.cold, 0.5)} 100%)`,
          }}
        />
        {/* key specular izquierda */}
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 16,
            width: 22,
            height: 250,
            borderRadius: 12,
            background: `linear-gradient(180deg, ${rgba(MD.white, 0.55)} 0%, ${rgba(MD.white, 0.12)} 60%, rgba(255,255,255,0) 100%)`,
            filter: "blur(3px)",
          }}
        />
        {/* VENTANA DE LÍQUIDO — el agujero por el que la cámara va a entrar */}
        <div
          style={{
            position: "absolute",
            left: 58,
            top: 96,
            width: 86,
            height: 130,
            borderRadius: 10,
            overflow: "hidden",
            background: "linear-gradient(180deg, #C98A3E 0%, #8A4E1C 62%, #3A1E09 100%)",
            boxShadow: "inset 0 0 18px rgba(0,0,0,0.6)",
          }}
        >
          {Array.from({ length: 9 }, (_, i) => {
            const s = rnd(i * 4.4);
            const sz = 5 + s * 9;
            const y = 128 - ((f * (0.5 + s * 0.9) + s * 130) % 138);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 6 + s * 68,
                  top: y,
                  width: sz,
                  height: sz,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 34% 30%, ${rgba(MD.white, 0.8)} 0%, ${rgba(MD.white, 0.16)} 58%, rgba(255,255,255,0) 74%)`,
                  opacity: 0.7,
                }}
              />
            );
          })}
        </div>
        {/* ETIQUETA */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 104,
            height: 118,
            background: "linear-gradient(180deg, #F2EDE4 0%, #D8D1C4 78%, #B9B2A4 100%)",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -3px 8px rgba(0,0,0,0.28)",
            clipPath: "polygon(0 0, 34% 0, 34% 100%, 0 100%)",
          }}
        />
        <div style={{ position: "absolute", left: 0, top: 108, width: 62, textAlign: "center" }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 9, letterSpacing: 1.1, color: "#2A2622" }}>
            HYDROGEN
          </div>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 9, letterSpacing: 1.1, color: "#2A2622" }}>
            PEROXIDE
          </div>
          <div style={{ height: 2, margin: "5px 12px", background: MD.red }} />
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 34, lineHeight: 1, color: MD.red }}>3%</div>
        </div>
      </div>

      {/* velo de oscuridad que se retira: el KEY BARRE la botella (revelado por luz, no por opacidad) */}
      <div
        style={{
          position: "absolute",
          left: -60,
          right: -60,
          top: -90,
          bottom: -40,
          pointerEvents: "none",
          background: `linear-gradient(102deg, rgba(4,4,6,0) 0%, rgba(4,4,6,0.94) 22%, rgba(4,4,6,0.94) 100%)`,
          transform: `translateX(${(reveal * 150 - 6).toFixed(1)}%)`,
          opacity: reveal > 0.99 ? 0 : 1,
        }}
      />
    </div>
  );
};

/** El chorro que sale del frasco y moja la junta. */
const Spray: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0) return null;
  const ox = DX + 88;
  const oy = DY - 6;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: 30 }, (_, i) => {
        const s = rnd(i * 2.3);
        const s2 = rnd(i * 6.7 + 3);
        const delay = s * 0.35;
        const q = clamp01((p - delay) / (0.55 + s2 * 0.3));
        if (q <= 0) return null;
        const ang = -0.52 + s2 * 0.62; // abanico hacia abajo-derecha
        const dist = ez(q, E_OUT) * (520 + s * 330);
        const x = ox + Math.cos(ang) * dist;
        const y = oy + Math.sin(ang) * dist + q * q * 210;
        const sz = 5 + s2 * 13;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz * (1 + q * 0.5),
              borderRadius: "50%",
              background: `radial-gradient(circle at 36% 28%, ${rgba(MD.white, 0.9)} 0%, ${rgba(MD.cold, 0.34)} 55%, rgba(255,255,255,0) 76%)`,
              opacity: (1 - q) * 0.85,
            }}
          />
        );
      })}
      {/* cono de niebla */}
      <div
        style={{
          position: "absolute",
          left: ox,
          top: oy - 40,
          width: 700 * clamp01(p * 1.4),
          height: 420,
          transformOrigin: "0 20%",
          transform: `rotate(16deg)`,
          clipPath: "polygon(0 42%, 100% 0, 100% 100%, 0 58%)",
          background: `linear-gradient(92deg, ${rgba(MD.white, 0.16)} 0%, ${rgba(MD.cold, 0.07)} 45%, rgba(255,255,255,0) 92%)`,
          opacity: Math.sin(clamp01(p) * Math.PI) * 0.9,
          filter: "blur(6px)",
        }}
      />
      {/* la junta mojada, oscureciéndose */}
      <div
        style={{
          position: "absolute",
          left: 1170,
          top: 792,
          width: 620,
          height: 26,
          transform: "rotate(6deg)",
          borderRadius: 6,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(MD.mold, 0.9)} 12%, ${rgba(MD.mold, 0.9)} 88%, rgba(0,0,0,0) 100%)`,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1170,
          top: 790,
          width: 620 * clamp01((p - 0.25) / 0.5),
          height: 30,
          transform: "rotate(6deg)",
          borderRadius: 6,
          background: `linear-gradient(90deg, ${rgba(MD.cold, 0.5)} 0%, ${rgba(MD.white, 0.28)} 60%, rgba(255,255,255,0.05) 100%)`,
          boxShadow: `0 0 22px ${rgba(MD.cold, 0.4)}`,
          filter: "blur(1px)",
        }}
      />
    </div>
  );
};

/** Reloj de espera: 10 → 15 min. */
const TimerRing: React.FC<{ p: number; lit: string }> = ({ p, lit }) => {
  const R = 62;
  const C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", left: 1560, top: 700, width: 160, height: 160, transform: "translate(-50%,-50%)" }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={80} cy={80} r={R} fill="none" stroke={rgba(MD.white, 0.14)} strokeWidth={8} />
        <circle
          cx={80}
          cy={80}
          r={R}
          fill="none"
          stroke={lit}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - clamp01(p))}
          transform="rotate(-90 80 80)"
          style={{ filter: `drop-shadow(0 0 8px ${rgba(MD.white, 0.5)})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 34, color: MD.white, lineHeight: 1 }}>
          {String(Math.round(lerp(10, 15, clamp01(p))))}
        </div>
        <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 13, letterSpacing: 2.4, color: rgba(MD.white, 0.6) }}>
          MIN
        </div>
      </div>
    </div>
  );
};

/* ── ACTO 2 ─────────────────────────────────────────────────────────────────────────────────── */

const Atom: React.FC<{ x: number; y: number; r: number; core: string; glow: number; halo?: number }> = ({
  x,
  y,
  r,
  core,
  glow,
  halo = 0,
}) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
    {halo > 0 && (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: r * 4.4,
          height: r * 4.4,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(MD.red, 0.34 * halo)} 0%, rgba(0,0,0,0) 62%)`,
          filter: "blur(6px)",
        }}
      />
    )}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: `radial-gradient(circle at 33% 26%, ${rgba(MD.white, 0.96)} 0%, ${core} 26%, ${rgba(core, 0.62)} 60%, rgba(7,8,10,0.96) 100%)`,
        boxShadow: `inset -${(r * 0.14).toFixed(1)}px -${(r * 0.18).toFixed(1)}px ${(r * 0.4).toFixed(1)}px rgba(0,0,0,0.6), 0 0 ${glow}px ${rgba(core, 0.55)}, 0 ${(r * 0.3).toFixed(0)}px ${(r * 0.6).toFixed(0)}px rgba(0,0,0,0.55)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: `${r * 0.52}px`,
        top: `${r * 0.36}px`,
        width: r * 0.42,
        height: r * 0.3,
        borderRadius: "50%",
        background: rgba(MD.white, 0.85),
        filter: "blur(2px)",
      }}
    />
  </div>
);

const Bond: React.FC<{ x1: number; y1: number; x2: number; y2: number; w: number; c: string; glow: number }> = ({
  x1,
  y1,
  x2,
  y2,
  w,
  c,
  glow,
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y1 - w / 2,
        width: len,
        height: w,
        transformOrigin: "0 50%",
        transform: `rotate(${ang.toFixed(3)}deg)`,
        borderRadius: w / 2,
        background: `linear-gradient(180deg, ${rgba(c, 0.9)} 0%, ${rgba(c, 0.32)} 48%, ${rgba(c, 0.72)} 100%)`,
        boxShadow: `0 0 ${glow}px ${rgba(c, 0.6)}`,
      }}
    />
  );
};

/** Etiqueta de molécula: "H₂O · WATER" que rueda a "H₂O₂ · PEROXIDE". */
const MolLabel: React.FC<{ x: number; y: number; morph: number }> = ({ x, y, morph }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", textAlign: "center" }}>
    <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 46, color: MD.white, letterSpacing: 1.5 }}>
      H<span style={{ fontSize: 30 }}>2</span>O
      <span
        style={{
          display: "inline-block",
          fontSize: 30,
          color: MD.redHot,
          width: morph > 0 ? undefined : 0,
          transform: `scale(${morph.toFixed(3)})`,
          opacity: morph,
        }}
      >
        2
      </span>
    </div>
    <div style={{ height: 34, overflow: "hidden", marginTop: 2 }}>
      <div style={{ transform: `translateY(${(-34 * morph).toFixed(1)}px)` }}>
        <div style={{ height: 34, fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: rgba(MD.white, 0.62) }}>
          WATER
        </div>
        <div style={{ height: 34, fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: MD.redHot }}>
          PEROXIDE
        </div>
      </div>
    </div>
  </div>
);

/* ── ACTO 3 ─────────────────────────────────────────────────────────────────────────────────── */

/** La célula del moho: pared de fibras, interior vivo. Se rompe DONDE la tocan. */
const MoldCell: React.FC<{ f: number; hit: number; tear: number; drain: number }> = ({ f, hit, tear, drain }) => {
  const HITA = -0.7854; // -45°: por donde entra el átomo
  const wallCol = interpolateColors(drain, [0, 1], [MD.moldLit, "#3E4340"]);
  const inner = interpolateColors(drain, [0, 1], [MD.mold, "#26282A"]);
  const squash = 1 - drain * 0.14 + shockWave(f, 448, 0.05, 30, 3.1);
  return (
    <div
      style={{
        position: "absolute",
        left: CELLX,
        top: CELLY,
        width: 0,
        height: 0,
        transform: `scale(${squash.toFixed(3)}) rotate(${(drain * -6).toFixed(2)}deg)`,
      }}
    >
      {/* interior vivo */}
      <div
        style={{
          position: "absolute",
          left: -CELLR + 18,
          top: -CELLR + 18,
          width: (CELLR - 18) * 2,
          height: (CELLR - 18) * 2,
          borderRadius: `${52 - drain * 8}% ${48 + drain * 6}% ${50 - drain * 10}% ${50 + drain * 4}% / ${48 + drain * 5}% ${52 - drain * 7}% ${50}% ${50}%`,
          background: `radial-gradient(circle at 38% 32%, ${rgba(MD.moldLit, 0.9)} 0%, ${inner} 46%, rgba(9,11,10,0.98) 100%)`,
          boxShadow: `inset -18px -22px 48px rgba(0,0,0,0.6), inset 12px 14px 30px ${rgba(MD.moldLit, 0.28)}`,
        }}
      />
      {/* núcleo + gránulos (hold vivo) */}
      <div
        style={{
          position: "absolute",
          left: -66,
          top: -30,
          width: 132,
          height: 112,
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 34%, ${rgba(MD.mold, 0.95)} 0%, rgba(10,12,11,0.9) 70%)`,
          transform: `scale(${(1 - drain * 0.5).toFixed(3)})`,
          opacity: 1 - drain * 0.7,
        }}
      />
      {Array.from({ length: 10 }, (_, i) => {
        const s = rnd(i * 7.1);
        const a = s * Math.PI * 2 + f / 90;
        const rr = 60 + s * 130;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.cos(a) * rr,
              top: Math.sin(a) * rr * 0.9,
              width: 8 + s * 12,
              height: 8 + s * 12,
              borderRadius: "50%",
              background: rgba(MD.moldLit, 0.5),
              opacity: (0.4 + s * 0.4) * (1 - drain * 0.8),
              filter: "blur(1px)",
            }}
          />
        );
      })}
      {/* PARED: 34 fibras. Las que están en el punto de contacto se DESGARRAN. */}
      {Array.from({ length: 34 }, (_, i) => {
        const a = (i / 34) * Math.PI * 2 - Math.PI;
        let d = a - HITA;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        const near = clamp01(1 - Math.abs(d) / 0.62); // 1 en el impacto, 0 lejos
        const t = clamp01((tear - near * 0.15) * near * 1.5);
        const push = ez(t, E_OUT) * (44 + rnd(i * 3.3) * 90);
        const spin = ez(t, E_OUT) * (rnd(i * 9.1) - 0.5) * 130;
        const rr = CELLR + push;
        const s = rnd(i * 2.1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.cos(a) * rr,
              top: Math.sin(a) * rr,
              width: 30 + s * 10,
              height: 52 + s * 14,
              marginLeft: -(15 + s * 5),
              marginTop: -(26 + s * 7),
              borderRadius: 10,
              transform: `rotate(${((a * 180) / Math.PI + 90 + spin).toFixed(1)}deg)`,
              background: `linear-gradient(180deg, ${rgba(wallCol, 0.95)} 0%, ${rgba(wallCol, 0.5)} 58%, rgba(8,10,9,0.9) 100%)`,
              boxShadow: `inset 0 2px 0 ${rgba(MD.white, 0.16)}, 0 6px 14px rgba(0,0,0,0.6)`,
              opacity: 1 - t * 0.75,
            }}
          />
        );
      })}
      {/* anillo de choque en el punto de contacto */}
      {hit > 0 && hit < 1 && (
        <div
          style={{
            position: "absolute",
            left: Math.cos(HITA) * CELLR,
            top: Math.sin(HITA) * CELLR,
            width: 60 + ez(hit, E_OUT) * 420,
            height: 60 + ez(hit, E_OUT) * 420,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            border: `${(7 * (1 - hit)).toFixed(1)}px solid ${MD.white}`,
            boxShadow: `0 0 40px ${rgba(MD.white, 0.6)}`,
            opacity: 1 - hit,
          }}
        />
      )}
      {/* la BOQUERA: el agujero real, oscuro, con labios levantados */}
      {tear > 0.02 && (
        <div
          style={{
            position: "absolute",
            left: Math.cos(HITA) * (CELLR - 26),
            top: Math.sin(HITA) * (CELLR - 26),
            width: 60 + tear * 210,
            height: 44 + tear * 150,
            transform: `translate(-50%,-50%) rotate(${((HITA * 180) / Math.PI + 90).toFixed(1)}deg)`,
            borderRadius: "50% 50% 46% 54% / 60% 60% 40% 40%",
            background: `radial-gradient(circle at 50% 40%, rgba(3,4,4,0.98) 0%, rgba(6,8,7,0.9) 62%, rgba(0,0,0,0) 88%)`,
            boxShadow: `inset 0 0 30px rgba(0,0,0,0.9), 0 0 26px ${rgba(MD.white, 0.18 * (1 - tear))}`,
          }}
        />
      )}
    </div>
  );
};

/** Lo que se derrama por la boquera y CAE — la materia que cruza a la frontera 3. */
const Spill: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0) return null;
  const ox = CELLX + Math.cos(-0.7854) * (CELLR - 14);
  const oy = CELLY + Math.sin(-0.7854) * (CELLR - 14);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: 16 }, (_, i) => {
        const s = rnd(i * 3.9);
        const s2 = rnd(i * 8.3 + 5);
        const life = ((f * (0.016 + s * 0.012) + s2) % 1) as number;
        const q = clamp01(life / 1);
        const grav = q * q * 640;
        const x = ox + (s - 0.5) * 130 + q * (108 + s2 * 70);
        const y = oy + grav - 40 * (1 - q);
        const sz = 8 + s2 * 15;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz * (1 + q * 1.1),
              borderRadius: "50%",
              background: `radial-gradient(circle at 36% 28%, ${rgba(MD.white, 0.85)} 0%, ${rgba(MD.cold, 0.42)} 52%, rgba(255,255,255,0) 76%)`,
              opacity: p * Math.sin(Math.PI * q) * 0.95,
            }}
          />
        );
      })}
      {/* la lengua de líquido pegada a la pared */}
      <div
        style={{
          position: "absolute",
          left: ox - 16,
          top: oy,
          width: 34,
          height: ez(p, E_OUT) * 430,
          borderRadius: 18,
          background: `linear-gradient(180deg, ${rgba(MD.white, 0.5)} 0%, ${rgba(MD.cold, 0.3)} 40%, rgba(255,255,255,0) 100%)`,
          transform: "rotate(-7deg)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
};

/* ── ACTO 4 ─────────────────────────────────────────────────────────────────────────────────── */

const CHANNEL =
  "M 1300 214 C 1268 300, 1332 350, 1294 428 C 1256 506, 1226 548, 1258 638 C 1290 728, 1300 792, 1266 872";

const PoreColumn: React.FC<{
  f: number;
  thread: number;
  bleach: number;
  blanch: number;
  ghost?: boolean;
  clipR?: number; // 0→1: lo va destapando el frente de vapor, de izquierda a derecha
}> = ({ f, thread, bleach, blanch, ghost = false, clipR = 1 }) => {
  const head = onChannel(thread);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: ghost ? 0.4 : 1,
        clipPath: clipR >= 1 ? undefined : `inset(-10% ${Math.max(0, (1 - clipR) * 100).toFixed(1)}% -10% -10%)`,
      }}
    >
      {/* cuerpo de la fragua */}
      <div
        style={{
          position: "absolute",
          left: COLX - COLW / 2,
          top: SURF,
          width: COLW,
          height: 1080 - SURF,
          background: `linear-gradient(96deg, #16130F 0%, #2C2722 26%, #383029 50%, #241F1A 78%, #100E0B 100%)`,
          boxShadow: "inset 0 14px 30px rgba(0,0,0,0.7), inset 0 0 60px rgba(0,0,0,0.5)",
        }}
      />
      {/* porosidad: granos que dejan pasar */}
      {Array.from({ length: 46 }, (_, i) => {
        const s = rnd(i * 5.7);
        const s2 = rnd(i * 2.3 + 11);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: COLX - COLW / 2 + 10 + s * (COLW - 26),
              top: SURF + 20 + s2 * (1040 - SURF),
              width: 6 + s * 20,
              height: 5 + s2 * 14,
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 34%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0) 100%)`,
              opacity: 0.8,
            }}
          />
        );
      })}
      {/* superficie (las dos caras de azulejo) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SURF - 96,
          height: 96,
          background: `linear-gradient(180deg, ${rgba(MD.cold, 0.16)} 0%, #1A1B1E 34%, #0C0D0F 100%)`,
          boxShadow: `inset 0 2px 0 ${rgba(MD.white, 0.22)}, 0 8px 24px rgba(0,0,0,0.7)`,
          clipPath: `polygon(0 0, ${COLX - COLW / 2}px 0, ${COLX - COLW / 2}px 100%, 0 100%, 0 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SURF - 96,
          height: 96,
          background: `linear-gradient(180deg, ${rgba(MD.cold, 0.16)} 0%, #1A1B1E 34%, #0C0D0F 100%)`,
          boxShadow: `inset 0 2px 0 ${rgba(MD.white, 0.22)}, 0 8px 24px rgba(0,0,0,0.7)`,
          clipPath: `polygon(${COLX + COLW / 2}px 0, 100% 0, 100% 100%, ${COLX + COLW / 2}px 100%)`,
        }}
      />

      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* el canal vacío */}
        <path d={CHANNEL} fill="none" stroke="#07080A" strokeWidth={30} strokeLinecap="round" />
        <path d={CHANNEL} fill="none" stroke={rgba(MD.white, 0.06)} strokeWidth={34} strokeLinecap="round" />
        {/* el HILO de peróxido bajando */}
        <path
          d={CHANNEL}
          fill="none"
          stroke={rgba(MD.cold, 0.4)}
          strokeWidth={26}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - clamp01(thread)}
          style={{ filter: "blur(5px)" }}
        />
        <path
          d={CHANNEL}
          fill="none"
          stroke={MD.white}
          strokeWidth={11}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - clamp01(thread)}
          style={{ filter: `drop-shadow(0 0 7px ${rgba(MD.white, 0.85)})`, opacity: 0.92 }}
        />
        {/* raíces del moho — se blanquean de abajo hacia arriba cuando el hilo llega */}
        {Array.from({ length: 11 }, (_, i) => {
          const s = rnd(i * 4.1);
          const a = -Math.PI * 0.5 + (i / 10 - 0.5) * 2.5;
          const L = 90 + s * 130;
          const x2 = 1266 + Math.cos(a) * L * 1.1;
          const y2 = 878 - Math.sin(a) * L * 0.55 + 120;
          const b = clamp01((blanch - i * 0.055) * 2.4);
          return (
            <path
              key={i}
              d={`M 1266 872 Q ${1266 + (x2 - 1266) * 0.5 + (s - 0.5) * 60} ${872 + (y2 - 872) * 0.5} ${x2} ${y2}`}
              fill="none"
              stroke={interpolateColors(b, [0, 1], [MD.mold, "#CFD6DA"])}
              strokeWidth={7 + s * 7}
              strokeLinecap="round"
              opacity={0.9 - b * 0.45}
            />
          );
        })}
      </svg>

      {/* la cabeza del hilo: la gota que avanza */}
      {thread > 0.02 && thread < 0.995 && (
        <div
          style={{
            position: "absolute",
            left: head.x - 14,
            top: head.y - 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: `radial-gradient(circle at 36% 30%, #FFFFFF 0%, ${rgba(MD.cold, 0.6)} 60%, rgba(255,255,255,0) 78%)`,
            boxShadow: `0 0 26px ${rgba(MD.white, 0.75)}`,
            transform: `scale(${(1 + Math.sin(f / 5) * 0.14).toFixed(3)})`,
          }}
        />
      )}

      {/* EL CLORO: aterriza arriba y NO PASA */}
      {bleach > 0.01 && (
        <>
          <div
            style={{
              position: "absolute",
              left: COLX - COLW / 2 - 40,
              top: SURF - 46 - (1 - ez(bleach, E_OUT)) * 220,
              width: COLW + 80,
              height: 48,
              borderRadius: "16px 16px 4px 4px",
              background: `linear-gradient(180deg, ${MD.redHot} 0%, ${MD.red} 55%, #7A140F 100%)`,
              boxShadow: `0 0 34px ${rgba(MD.red, 0.6)}, inset 0 2px 0 ${rgba(MD.white, 0.35)}`,
              opacity: Math.min(1, bleach * 3),
            }}
          />
          {Array.from({ length: 3 }, (_, i) => {
            const g = clamp01((bleach - 0.35 - i * 0.06) / 0.4);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: COLX - 70 + i * 66,
                  top: SURF - 2,
                  width: 16,
                  height: ez(g, E_OUT) * 58,
                  borderRadius: 8,
                  background: `linear-gradient(180deg, ${MD.red} 0%, ${rgba(MD.red, 0.1)} 100%)`,
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: COLX - COLW / 2 - 24,
              top: SURF + 62,
              width: COLW + 48,
              height: 3,
              background: `repeating-linear-gradient(90deg, ${MD.red} 0 14px, rgba(0,0,0,0) 14px 26px)`,
              opacity: clamp01((bleach - 0.55) / 0.3),
            }}
          />
        </>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ════════════════════════════════════════════════════════════════════════════════════════════ */
export const MovOxygen: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const f = useCurrentFrame();
  const D = durationInFrames;

  /* ── luz: arranca en el ROJO que dejó el movimiento anterior y vira a BLANCO FRÍO ── */
  const tLight = interpolate(f, [0, 300, 470, 620], [0, 0.28, 0.62, 1], { easing: E_SOFT, ...CL });
  const LIT = light(tLight, "red", "cold");
  const keyTravel = interpolate(f, [0, 380, D], [0.16, 0.44, 0.7], { easing: E_SOFT, ...CL });
  const alertWash = interpolate(f, [0, 60, 174], [0.5, 0.34, 0], { easing: E_OUT, ...CL });

  /* ── cámara: cuerpo compartido (Stage) + lente propia, ambas del frame GLOBAL ── */
  const body = cam(f, { z0: 0, z1: 64, panX: -14, panY: 8, ry: 0.9, dur: D });
  const lens = rig(f);

  /* ── ACTO 1 ── */
  const reveal = ez(seg(f, 0, 15), E_OUT); // el key BARRE la botella (revelado por luz)
  const capLift = ez(seg(f, 96, 118), E_SNAP);
  const squeeze = Math.sin(clamp01(seg(f, 100, 128)) * Math.PI) * 1;
  const tilt = interpolate(f, [0, 92, 116, 196], [-1.4, -1.4, 15, 11], { easing: E_SOFT, ...CL });
  const sprayP = seg(f, 106, 176);
  const waitP = seg(f, 126, 206);
  const dive = ez(seg(f, 196, 240), E_DIVE); // la MATERIA hace el zoom, no la cámara
  const act1Scale = 1 + dive * 8.4;
  const act1On = f < 262;

  /* ── FRONTERA 1 · ZOOM-THROUGH: el líquido tapa el cuadro y salimos adentro ── */
  const liqGrow = interpolate(f, [198, 236, 268], [0.6, 30, 84], { easing: E_DIVE, ...CL });
  const liqOn = interpolate(f, [200, 216, 244, 262], [0, 1, 1, 0], { easing: E_SOFT, ...CL });

  /* ── ACTO 2 ── */
  const mS = molScale(f);
  const act2On = f > 229 && f < 470; // no antes: hasta 232 el líquido no tapa el cuadro
  const dock = seg(f, 258, 292); // la última burbuja se ACOPLA: H2O + 1 O = H2O2
  const dockE = ez(dock, E_SNAP);
  const strain = interpolate(f, [292, 340, 372, 386], [0, 0.35, 0.9, 1], { easing: E_SOFT, ...CL });
  const vib = Math.sin(f * (0.55 + strain * 0.85)) * (2 + strain * 26);
  const vib2 = Math.cos(f * (0.72 + strain * 0.7)) * (1.5 + strain * 18);
  const snapF = 388;
  const bondCol = interpolateColors(strain, [0, 0.55, 1], [MD.cold, "#E8B27A", MD.redHot]);

  // el mundo molecular se va en profundidad mientras el átomo queda clavado
  const worldOut = ez(seg(f, snapF, 452), Easing.in(Easing.quad));
  const molX = -worldOut * 1500;
  const molZ = -worldOut * 900;

  // geometría de la molécula derecha (morph H2O → H2O2)
  const oaX = RX - dockE * 80;
  const oaY = RY + dockE * 8;
  const haA = Math.PI * (0.78 + dockE * 0.06);
  const hbA = -Math.PI * 0.22 + dockE * 0.16;
  const haX = oaX + Math.cos(haA) * 118;
  const haY = oaY + Math.sin(haA) * 118;
  const obLiveX = OBX + (f > 292 ? vib : 0);
  const obLiveY = OBY + (f > 292 ? vib2 : 0);
  const hbAnchorX = lerp(oaX, obLiveX, clamp01(dockE)); // handoff continuo, sin pop
  const hbAnchorY = lerp(oaY, obLiveY, clamp01(dockE));
  const hbX = hbAnchorX + Math.cos(hbA) * 118;
  const hbY = hbAnchorY + Math.sin(hbA) * 118;

  // burbuja que viaja desde el líquido y se convierte en el oxígeno de más
  const travel = seg(f, 228, 264);
  const travelE = ez(travel, Easing.bezier(0.3, 0, 0.2, 1));
  // destino = donde el ojo VE el oxígeno de más en ese mismo frame (escala viva de la molécula)
  const bubTarget = unproj(DX + (OBX - DX) * mS, DY + (OBY - DY) * mS, 70);
  const bubX = lerp(DX, bubTarget.x, travelE);
  const bubY = lerp(DY, bubTarget.y, travelE) - Math.sin(travelE * Math.PI) * 160;
  const bubR = lerp(16, 60, travelE);

  /* ── FRONTERA 2 · MATCH-MOVE: el átomo NO se mueve, se mueve el mundo ── */
  const freeX = interpolate(f, [snapF, 412], [OBX, LOCKX], { easing: E_OUT, ...CL });
  const freeY = interpolate(f, [snapF, 412], [OBY, LOCKY], { easing: E_OUT, ...CL });
  const atomFree = f >= snapF;
  const atomZ = interpolate(f, [snapF, snapF + 22], [0, 150], { easing: E_OUT, ...CL }); // sin salto de escala
  const atomEaten = clamp01((f - 448) / 26);

  /* ── ACTO 3 ── */
  const cellZ = interpolate(f, [396, 448, 522, 552], [-1180, 0, 40, 980], {
    easing: Easing.bezier(0.5, 0, 0.86, 0.72),
    ...CL,
  });
  const hit = seg(f, 448, 476);
  const tear = ez(seg(f, 450, 508), E_OUT);
  const drain = ez(seg(f, 470, 540), E_SOFT);
  const spill = seg(f, 476, 540);
  const act3On = f > 386 && f < 554;

  /* ── FRONTERA 3 · WIPE POR MATERIA ── */
  const WIPE = 530;

  /* ── ACTO 4 ── */
  const act4On = f > WIPE - 4;
  const poreReveal = clamp01(interpolate(f, [WIPE + 2, WIPE + 26], [0, 1.18], CL));
  const bleach = seg(f, 566, 626);
  const thread = ez(seg(f, 588, 664), Easing.bezier(0.42, 0, 0.34, 1));
  const blanch = seg(f, 656, 736);

  /* ── la frase de oro, en dos tiempos (robusta ante ±30 frames) ── */
  const L1 = Math.min(660, Math.max(560, D - 78));
  const L2 = Math.min(700, Math.max(L1 + 26, D - 38));
  const bedRise = ez(seg(f, L1 - 12, L1 + 10), E_OUT);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA · montada UNA sola vez, nunca se remonta ── */}
      <Atmos tint={LIT} keyFrom={keyTravel} intensity={1} />
      {/* rojo de alerta heredado del movimiento anterior, retirándose */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(78% 62% at 50% 54%, rgba(0,0,0,0) 30%, ${rgba(MD.red, 0.42)} 100%)`,
          opacity: alertWash,
        }}
      />

      {/* ── LA CÁMARA (cuerpo compartido) ── */}
      <AbsoluteFill style={{ transform: body.transform }}>
        {/* ── LA LENTE (profundidad real) ── */}
        <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 46%" }}>
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: lens.transform }}>
            {/* ▸ plano −520 · el cuarto */}
            <Plane z={-520}>
              {f < 300 ? <TileWall tint={LIT} /> : null}
              {act4On ? (
                <div
                  style={{
                    opacity: interpolate(f, [WIPE, WIPE + 26], [0, 1], CL),
                    transform: "translateX(-760px)",
                  }}
                >
                  <PoreColumn f={f} thread={0} bleach={0} blanch={0} ghost />
                </div>
              ) : null}
            </Plane>

            {/* ▸ plano −240 · haz frío de la ventanita (viaja con la cámara) */}
            <Plane z={-240}>
              <div
                style={{
                  position: "absolute",
                  left: -140,
                  top: -260,
                  width: 900,
                  height: 1500,
                  transform: `rotate(${(16 + keyTravel * 8).toFixed(1)}deg)`,
                  background: `linear-gradient(96deg, rgba(255,255,255,0) 0%, ${rgba(LIT, 0.1)} 40%, ${rgba(LIT, 0.02)} 70%, rgba(255,255,255,0) 100%)`,
                  filter: "blur(10px)",
                  opacity: 0.85,
                }}
              />
            </Plane>

            {/* ▸ plano −40 · ACTO 3 · la colonia de fondo (parallax propio) */}
            {act3On
              ? [0, 1, 2, 3].map((i) => {
                  const s = rnd(i * 6.1);
                  const zz = cellZ - 340 - i * 190;
                  const flinch = 1 + shockWave(f, 452 + i * 3, 0.06, 26, 3.4);
                  return (
                    <Plane key={i} z={zz}>
                      <div
                        style={{
                          position: "absolute",
                          left: 520 + s * 940,
                          top: 380 + rnd(i * 2.7) * 420,
                          width: 200 + s * 150,
                          height: 190 + s * 140,
                          transform: `translate(-50%,-50%) scale(${flinch.toFixed(3)})`,
                          borderRadius: "52% 48% 46% 54% / 50% 52% 48% 50%",
                          background: `radial-gradient(circle at 38% 32%, ${rgba(MD.moldLit, 0.5)} 0%, ${rgba(MD.mold, 0.8)} 52%, rgba(8,10,9,0.95) 100%)`,
                          boxShadow: `inset -14px -18px 34px rgba(0,0,0,0.6)`,
                          opacity: 0.5 - i * 0.07,
                          filter: `blur(${(1.2 + i * 1.1).toFixed(1)}px)`,
                        }}
                      />
                    </Plane>
                  );
                })
              : null}

            {/* ▸ plano 0 · ACTO 1 · la botella (todo el acto viaja junto hacia el lente) */}
            {act1On ? (
              <Plane z={0}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transformOrigin: `${DX}px ${DY}px`,
                    transform: `scale(${act1Scale.toFixed(3)})`,
                  }}
                >
                  {/* repisa */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 806,
                      height: 8,
                      background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(MD.cold, 0.3)} 26%, ${rgba(MD.warm, 0.24)} 74%, rgba(0,0,0,0) 100%)`,
                    }}
                  />
                  <AmberBottle f={f} tilt={tilt} capLift={capLift} reveal={reveal} squeeze={squeeze} />
                  <Spray f={f} p={sprayP} />
                </div>
              </Plane>
            ) : null}

            {/* ▸ plano 0 · ACTO 2 · la molécula (nace a escala 3.4: estamos ADENTRO) */}
            {act2On ? (
              <Plane z={0}>
                <div style={{ position: "absolute", inset: 0, transform: `translate3d(${molX.toFixed(1)}px,0,${molZ.toFixed(1)}px)`, transformStyle: "preserve-3d" }}>
                  <div style={{ position: "absolute", inset: 0, transformOrigin: `${DX}px ${DY}px`, transform: `scale(${mS.toFixed(3)})` }}>
                    {/* H₂O — el agua */}
                    <Bond x1={560} y1={560} x2={560 + Math.cos(Math.PI * 0.78) * 118} y2={560 + Math.sin(Math.PI * 0.78) * 118} w={17} c={MD.cold} glow={12} />
                    <Bond x1={560} y1={560} x2={560 + Math.cos(-Math.PI * 0.22) * 118} y2={560 + Math.sin(-Math.PI * 0.22) * 118} w={17} c={MD.cold} glow={12} />
                    <Atom x={560 + Math.cos(Math.PI * 0.78) * 118} y={560 + Math.sin(Math.PI * 0.78) * 118} r={34} core={MD.bone} glow={16} />
                    <Atom x={560 + Math.cos(-Math.PI * 0.22) * 118} y={560 + Math.sin(-Math.PI * 0.22) * 118} r={34} core={MD.bone} glow={16} />
                    <Atom x={560} y={560} r={64} core={MD.cold} glow={30} />
                    <MolLabel x={560} y={706} morph={0} />

                    {/* H₂O₂ — la misma agua, con uno de más */}
                    <Bond x1={oaX} y1={oaY} x2={haX} y2={haY} w={17} c={MD.cold} glow={12} />
                    {dock > 0.12 && !atomFree ? (
                      <Bond x1={oaX} y1={oaY} x2={obLiveX} y2={obLiveY} w={13 + strain * 5} c={bondCol} glow={10 + strain * 40} />
                    ) : null}
                    {!atomFree ? <Bond x1={hbAnchorX} y1={hbAnchorY} x2={hbX} y2={hbY} w={17} c={MD.cold} glow={12} /> : null}
                    <Atom x={haX} y={haY} r={34} core={MD.bone} glow={16} />
                    {!atomFree ? <Atom x={hbX} y={hbY} r={34} core={MD.bone} glow={16} /> : null}
                    <Atom x={oaX} y={oaY} r={64} core={MD.cold} glow={30} />
                    {dock > 0.18 && !atomFree ? (
                      <Atom x={obLiveX} y={obLiveY} r={64} core={MD.cold} glow={26 + strain * 46} halo={strain} />
                    ) : null}
                    <MolLabel x={RX} y={706} morph={dockE} />

                    {/* etiqueta del enlace débil */}
                    {strain > 0.18 && !atomFree ? (
                      <div
                        style={{
                          position: "absolute",
                          left: RX,
                          top: 434 - strain * 12,
                          transform: "translateX(-50%)",
                          fontFamily: F_SANS,
                          fontWeight: 900,
                          fontSize: 30,
                          letterSpacing: 3.6,
                          color: MD.redHot,
                          opacity: clamp01((strain - 0.18) * 3),
                          textShadow: `0 0 18px ${rgba(MD.red, 0.7)}`,
                        }}
                      >
                        BARELY HELD ON
                      </div>
                    ) : null}
                  </div>
                </div>
              </Plane>
            ) : null}

            {/* ▸ plano dinámico · ACTO 3 · la pared celular llega desde la profundidad */}
            {act3On ? (
              <Plane z={cellZ}>
                <MoldCell f={f} hit={hit} tear={tear} drain={drain} />
                <Spill f={f} p={spill} />
              </Plane>
            ) : null}

            {/* ▸ plano +30 · ACTO 4 · el poro en corte */}
            {act4On ? (
              <Plane z={30}>
                <PoreColumn f={f} thread={thread} bleach={bleach} blanch={blanch} clipR={poreReveal} />
                {/* rótulos de profundidad */}
                <div style={{ position: "absolute", right: 100, top: 300, textAlign: "right" }}>
                  <Rise at={WIPE + 16}>
                    <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: rgba(MD.white, 0.66) }}>
                      SURFACE
                    </div>
                  </Rise>
                </div>
                <div style={{ position: "absolute", right: 100, top: 902, textAlign: "right" }}>
                  <Rise at={624}>
                    <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: rgba(MD.white, 0.66) }}>
                      THE ROOTS
                    </div>
                  </Rise>
                </div>
                {bleach > 0.6 && f < L1 + 4 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 640,
                      top: SURF + 34,
                      textAlign: "right",
                      width: 400,
                      opacity: interpolate(f, [L1 - 12, L1 + 2], [1, 0], CL),
                      transform: `translateY(${(-ez(seg(f, L1 - 12, L1 + 4), E_OUT) * 34).toFixed(1)}px)`,
                    }}
                  >
                    <Rise at={606}>
                      <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 30, letterSpacing: 3.4, color: MD.redHot }}>
                        BLEACH STOPS HERE
                      </div>
                    </Rise>
                  </div>
                ) : null}
              </Plane>
            ) : null}

            {/* ▸ plano +150 · el ÁTOMO SUELTO — el único objeto que sobrevive la frontera 2 */}
            {atomFree && atomEaten < 1 ? (
              <Plane z={atomZ}>
                {/* estela del salto */}
                <div
                  style={{
                    position: "absolute",
                    left: freeX,
                    top: freeY,
                    width: 260 * (1 - clamp01((f - snapF) / 34)),
                    height: 10,
                    transform: "translate(-100%,-50%) rotate(6deg)",
                    borderRadius: 6,
                    background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.5)} 100%)`,
                    filter: "blur(3px)",
                  }}
                />
                <Atom
                  x={freeX + Math.sin(f / 3.4) * (5 * (1 - atomEaten))}
                  y={freeY + Math.cos(f / 4.1) * (4 * (1 - atomEaten))}
                  r={64 * (1 - atomEaten * 0.85)}
                  core={MD.white}
                  glow={44 + Math.sin(f / 6) * 14 + atomEaten * 90}
                  halo={0.5 + atomEaten * 0.5}
                />
              </Plane>
            ) : null}

            {/* ▸ plano +60 · FRONTERA 1 · el líquido que nos traga */}
            {liqOn > 0.001 ? (
              <Plane z={60}>
                <div
                  style={{
                    position: "absolute",
                    left: DX,
                    top: DY,
                    width: 92,
                    height: 136,
                    transform: `translate(-50%,-50%) scale(${liqGrow.toFixed(2)})`,
                    borderRadius: 12,
                    background: `radial-gradient(circle at 42% 38%, ${rgba("#E0A55C", 0.95)} 0%, ${rgba("#8A4E1C", 0.95)} 48%, rgba(30,16,6,0.98) 100%)`,
                    opacity: liqOn,
                  }}
                />
                {/* burbujas en fuga hacia el lente */}
                {Array.from({ length: 18 }, (_, i) => {
                  const s = rnd(i * 3.1);
                  const s2 = rnd(i * 7.9 + 2);
                  const q = clamp01((f - 200 - s * 30) / 46);
                  const a = s2 * Math.PI * 2;
                  const dd = ez(q, E_DIVE) * (900 + s * 700);
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: DX + Math.cos(a) * dd,
                        top: DY + Math.sin(a) * dd,
                        width: 14 + s * 40 + q * 90,
                        height: 14 + s * 40 + q * 90,
                        borderRadius: "50%",
                        transform: "translate(-50%,-50%)",
                        border: `2px solid ${rgba(MD.white, 0.4)}`,
                        background: `radial-gradient(circle at 34% 28%, ${rgba(MD.white, 0.4)} 0%, rgba(255,255,255,0.05) 56%, rgba(255,255,255,0) 74%)`,
                        opacity: liqOn * (1 - q) * 0.9,
                      }}
                    />
                  );
                })}
              </Plane>
            ) : null}

            {/* ▸ plano +70 · MATERIA QUE CRUZA LA FRONTERA 1: la última burbuja del frasco
                 vuela por delante del líquido y se ACOPLA como el oxígeno de más. */}
            {travel > 0 && travel < 1 ? (
              <Plane z={70}>
                <div
                  style={{
                    position: "absolute",
                    left: bubX,
                    top: bubY,
                    width: bubR * 2,
                    height: bubR * 2,
                    marginLeft: -bubR,
                    marginTop: -bubR,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 33% 26%, ${rgba(MD.white, 0.95)} 0%, ${rgba(MD.cold, 0.5)} 42%, rgba(255,255,255,0.06) 74%)`,
                    border: `2px solid ${rgba(MD.white, 0.5)}`,
                    boxShadow: `0 0 ${(20 + travelE * 40).toFixed(0)}px ${rgba(MD.white, 0.6)}`,
                  }}
                />
                {/* estela: viene DEL líquido */}
                <div
                  style={{
                    position: "absolute",
                    left: bubX,
                    top: bubY,
                    width: 220 * Math.sin(clamp01(travel) * Math.PI),
                    height: 8,
                    transform: "translate(-100%,-50%) rotate(-9deg)",
                    borderRadius: 4,
                    background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.45)} 100%)`,
                    filter: "blur(3px)",
                  }}
                />
              </Plane>
            ) : null}

            {/* ▸ plano +300 · foreground: motas fuera de foco. Presentes los 738 frames. */}
            <Plane z={300}>
              <Motes />
            </Plane>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── TEXTO · una idea por acto ─────────────────────────────────────────────────────── */}

      {/* ACTO 1 */}
      {f < 250 ? (
        <div
          style={{
            position: "absolute",
            right: 100,
            top: 210,
            width: 760,
            textAlign: "right",
            opacity: interpolate(f, [206, 230], [1, 0], CL),
            transform: `translateX(${(dive * 1150).toFixed(1)}px) scale(${(1 + dive * 0.5).toFixed(3)})`,
            transformOrigin: "100% 50%",
          }}
        >
          <Rise at={16}>
            <Kicker>THE FIX</Kicker>
          </Rise>
          <div style={{ height: 14 }} />
          <Rise at={24}>
            <Title size={78}>A dollar bottle of</Title>
          </Rise>
          <Rise at={36}>
            <Title size={78}>
              <Em>3% peroxide</Em>.
            </Title>
          </Rise>
          <div style={{ height: 26 }} />
          <Rise at={128}>
            <div style={{ display: "inline-block", padding: "14px 22px", ...glassStyle({ radius: 12 }) }}>
              <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2.6, color: rgba(MD.white, 0.9) }}>
                SPRAY IT STRAIGHT · THEN SCRUB
              </div>
            </div>
          </Rise>
        </div>
      ) : null}
      {f > 118 && f < 232 ? <TimerRing p={waitP} lit={LIT} /> : null}

      {/* ACTO 2 */}
      {f > 246 && f < 402 ? (
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 128,
            width: 900,
            opacity: interpolate(f, [382, 400], [1, 0], CL),
            transform: `translateX(${(-worldOut * 980).toFixed(1)}px)`,
          }}
        >
          <Rise at={250}>
            <Kicker color={rgba(MD.white, 0.72)}>WHAT IT ACTUALLY IS</Kicker>
          </Rise>
          <div style={{ height: 14 }} />
          <Rise at={258}>
            <Title size={76}>Water, plus one</Title>
          </Rise>
          <Rise at={278}>
            <Title size={76}>
              extra <Em>oxygen</Em>.
            </Title>
          </Rise>
        </div>
      ) : null}

      {/* ACTO 3 */}
      {f > 462 && f < 552 ? (
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 130,
            width: 820,
            transform: `translateX(${(-ez(seg(f, 526, 552), E_OUT) * 1060).toFixed(1)}px)`,
          }}
        >
          <TextBed w={820}>
            <Rise at={466}>
              <Kicker>WHEN IT LEAVES</Kicker>
            </Rise>
            <div style={{ height: 12 }} />
            <Rise at={474}>
              <Title size={72}>It tears the cell</Title>
            </Rise>
            <Rise at={492}>
              <Title size={72}>
                wall <Em>apart</Em>.
              </Title>
            </Rise>
          </TextBed>
        </div>
      ) : null}

      {/* ACTO 4 · LA FRASE DE ORO, en dos tiempos */}
      {f > L1 - 14 ? (
        <div
          style={{
            position: "absolute",
            left: 100,
            bottom: 96,
            width: 940,
            transform: `translateY(${((1 - bedRise) * 380).toFixed(1)}px)`,
          }}
        >
          <TextBed w={940} pad={34}>
            <Kicker>THE DIFFERENCE</Kicker>
            <div style={{ height: 16 }} />
            <div style={{ opacity: interpolate(f, [L2 - 13, L2 - 5], [1, 0.5], CL) }}>
              <Title size={66} color={rgba(MD.white, 0.95)}>
                Bleach kills what
              </Title>
              <Title size={66} color={rgba(MD.white, 0.95)}>
                it can <Em>touch</Em>.
              </Title>
            </div>
            <div style={{ height: 20 }} />
            <Rise at={L2 - 2} dur={12} dy={34}>
              <Title size={66}>Peroxide kills what</Title>
              <Title size={66}>
                it can <Em color={MD.cold}>reach</Em>.
              </Title>
            </Rise>
          </TextBed>
        </div>
      ) : null}

      {/* ── COSTURAS ──────────────────────────────────────────────────────────────────────── */}
      {/* FRONTERA 3 · wipe por materia: el vapor de la célula reventada cruza y detrás ya está el poro */}
      <VaporWipe at={WIPE} dur={26} />
      {/* FRONTERA INTERNA · corte en el beat entre "touch" y "reach" */}
      <Occluder at={L2 - 15} dur={16} color={MD.ink1} angle={-7} />

      {/* ── VIDA ÓPTICA (hold vivo) ── */}
      <Sheen at={92} dur={30} angle={14} />
      <Sheen at={312} dur={34} angle={22} />
      <Sheen at={L1 + 16} dur={36} angle={12} />

      {/* flash del SNAP del enlace — el único destello del movimiento */}
      {f >= snapF - 3 && f < snapF + 12 ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(38% 34% at ${((OBX / 1920) * 100).toFixed(1)}% ${((OBY / 1080) * 100).toFixed(1)}%, ${rgba(MD.white, 0.85)} 0%, ${rgba(MD.redHot, 0.24)} 44%, rgba(0,0,0,0) 74%)`,
            opacity: interpolate(f, [snapF - 3, snapF + 1, snapF + 12], [0, 0.9, 0], CL),
          }}
        />
      ) : null}

      {/* baño de luz global: la temperatura del movimiento, evolucionando */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "screen",
          background: `radial-gradient(120% 96% at ${(18 + keyTravel * 64).toFixed(0)}% -12%, ${rgba(LIT, 0.13)} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />
      {/* viñeta final para que el texto siempre gane */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(98% 84% at 52% 44%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
