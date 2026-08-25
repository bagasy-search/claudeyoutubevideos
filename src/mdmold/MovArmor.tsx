/**
 * MovArmor.tsx — mdmold · MOVIMIENTO CONTINUO de 51,6 s (1548f @ 30 fps).
 * Canal "Mike Dalton" (EN). Negro cinematografico · acento ROJO · vidrio BLANCO.
 *
 * EL VIAJE DE ESCALA es la columna vertebral:
 *   junta del bano -> refugio del reactor -> orbita -> granulo de pigmento.
 * Una sola Atmos (montada UNA vez, props que evolucionan), una sola camara funcion del
 * frame GLOBAL (cam() de Stage + articulacion keyframeada; NUNCA reinicia en 0), y una
 * luz que viaja FRIO-VERDOSO -> VERDE-CIAN irradiado -> ROJO tenue sobre negro.
 *
 * -- TABLA DE HANDOFF ---------------------------------------------------------------------
 * ACTO 1 · f0 — "the one in your bathroom is a cladosporium"
 *   enterFrom { cam: z-70 rx+6 (macro, picado sobre la junta) · luz #7E9AA2 frio-humedo ·
 *               materia: — (arranque del movimiento) }
 *   exitTo    { cam: z+240 (empuje DENTRO de la mancha) · luz #6F8E86 ·
 *               materia: LA MANCHA NEGRA, que crece hasta llenar cuadro con el MISMO ink0 }
 *   -- FRONTERA 1 @196-250 · ZOOM-THROUGH (tapa 100% desde 226; swap en 228) --  atravesamos la mancha; su nucleo es MD.ink0
 *      exacto y el fondo del acto 2 es MD.ink0 exacto: no hay corte, hay travesia.
 *
 * ACTO 2 · f228 — "late 90s... into the shelter around the ruined reactor"
 *   enterFrom { cam: z+240 saliendo hacia atras (el negro se ABRE a escala arquitectonica) ·
 *               luz #6F8E86 · materia: el negro de la mancha = la oscuridad del refugio }
 *   exitTo    { cam: z+30 rx+2 · luz #7FA98F · materia: EL HAZ de la linterna (mismo angulo,
 *               mismo polvo, misma posicion) y el HORMIGON (<Concrete/>, mismo componente) }
 *   -- FRONTERA 2 @543-583 · OCLUSION (<SlabPass/> + <Occluder/>) --  una losa de hormigon
 *      cruza y tapa el 100% en 557-559 (medido); el swap cae en 558. Detras, el mismo muro
 *      2,2x mas cerca, con el haz clavado exactamente donde quedo.
 *
 * ACTO 3 · f556 — "black fungus on the walls, growing toward the radiation"
 *   enterFrom { cam: z+30 · luz #7FA98F · materia: hormigon + haz del acto 2 }
 *   exitTo    { cam: z+120 · luz #6FD0B4 irradiado · materia: EL DISCO de la fuente }
  *   -- FRONTERA 3 @694-796 · MATCH-SHAPE (cobertura medida 718-748; swap en 742) --  el disco rojo-caliente NO se funde: es el mismo
 *      circulo que crece hasta tragarse el cuadro (nos metemos EN la radiacion) y al retroceder
 *      ya es el limbo de la Tierra. UN SOLO objeto atraviesa la frontera.
 *
 * ACTO 4 · f700 — "2020 · ISS · 26 days · could it shield astronauts"
 *   enterFrom { cam: z-60 ry+4 (salimos a orbita) · luz #7FC6D8 · materia: el circulo = Tierra }
 *   exitTo    { cam: z+70 · luz #8FBFD0 · materia: LA PLACA, trucando a la izquierda a
 *               velocidad constante (~-9 px/f) + el mismo cielo (<SpaceBack/> no se remonta) }
 *   -- FRONTERA 4 @1080-1130 · MATCH-MOVE --  la placa sale de cuadro con su velocidad; la
 *      barra negra del acto 5 ENTRA con esa MISMA velocidad y frena con inercia. El fondo
 *      (estrellas + Tierra) nunca se corta: es literalmente el mismo plano.
 *
 * ACTO 5 · f1090 — "it grew about 20% faster than the control"
 *   enterFrom { cam: z+70 · luz #8FBFD0 · materia: cielo/Tierra + barra que llega trucando }
 *   exitTo    { cam: z+190 · luz #B87A5E virando a rojo · materia: la barra negra se DESHACE
 *               en granulos que viajan hacia la camara }
 *   -- FRONTERA 5 @1255-1283 · WIPE POR MATERIA (<SporeWipe/> + <VaporWipe/>) --  el enjambre
 *      de esporas cruza, tapa el 100% en 1265-1268 (medido) y el swap cae en 1265. Detras ya
 *      estamos en el macro del pigmento: son LOS MISMOS granulos que salieron de la barra.
 *
 * ACTO 6 · f1268 — "the pigment is melanin... that's not dirt. that's armor."
 *   enterFrom { cam: z+190 · luz #B87A5E · materia: granulos del acto 5 }
 *   exitTo    { cam: z+400 rx+1 · luz #E4322A tenue sobre negro · materia: la coraza }
 *   -- CORTE EN EL BEAT @1518 --  los granulos se traban en placas, la luz rasante roja entra
 *      de golpe y los fotones REBOTAN. "That's armor."
 * -----------------------------------------------------------------------------------------
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import {
  MD,
  F_SANS,
  F_SERIF,
  rgba,
  lerp,
  clamp01,
  eio,
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

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const seg = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
const vis = (f: number, a: number, b: number) => f >= a && f < b;
const cyc = (x: number) => {
  const m = x % 1;
  return m < 0 ? m + 1 : m;
};
const EZ_IN = Easing.bezier(0.55, 0, 0.95, 0.42);
const EZ_OUT = Easing.bezier(0.16, 0.84, 0.24, 1);
const EZ_IO = Easing.bezier(0.36, 0, 0.24, 1);

/* -- la luz del movimiento, en hex (Atmos parsea hex) ---------------------------------- */
const hx = (h: string) => {
  const x = parseInt(h.replace("#", ""), 16);
  return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
};
const pad2 = (s: string) => (s.length < 2 ? "0" + s : s);
const mixHex = (a: string, b: string, k: number) => {
  const A = hx(a);
  const B = hx(b);
  const c = (i: number) => pad2(Math.round(lerp(A[i], B[i], clamp01(k))).toString(16));
  return "#" + c(0) + c(1) + c(2);
};
const TINT_F = [0, 228, 470, 620, 700, 900, 1120, 1268, 1400, 1548];
const TINT_C = [
  "#7E9AA2", "#6F8E86", "#7FA98F", "#79C39C", "#6FD0B4",
  "#7FC6D8", "#8FBFD0", "#B87A5E", "#E4322A", "#E4322A",
];
const tintAt = (f: number) => {
  for (let i = 0; i < TINT_F.length - 1; i++) {
    if (f < TINT_F[i + 1] || i === TINT_F.length - 2) {
      return mixHex(TINT_C[i], TINT_C[i + 1], seg(f, TINT_F[i], TINT_F[i + 1]));
    }
  }
  return TINT_C[0];
};

/* -- articulacion de la camara (se SUMA a cam(); jamas vuelve a 0) --------------------- */
const RIG_F = [0, 228, 400, 556, 700, 760, 900, 1090, 1268, 1400, 1548];
const RIG_X = [30, -70, 80, -60, 10, 60, -40, -90, 50, -20, -70];
const RIG_Y = [16, -28, 12, 24, -16, 20, 8, 14, -16, 8, -6];
const RIG_Z = [-60, 90, -30, 20, 70, -40, 10, 50, 110, 160, 200];
const RIG_RY = [-5, 1, 6, -3, -6, 4, 3, -4, 2, -1, -4];
const RIG_RX = [6, 1, -3, 2, -1, -2, 2, 1, -2, 0, 1];
const rigAt = (f: number, out: number[]) => interpolate(f, RIG_F, out, { easing: EZ_IO, ...CL });

/* == CAMPOS DETERMINISTICOS (rnd de Stage) ============================================= */
const MOTES = Array.from({ length: 46 }, (_, i) => ({
  x: rnd(i * 1.31) * 100,
  y: rnd(i * 2.77 + 3) * 100,
  s: 1.2 + rnd(i * 3.91) * 3.4,
  sp: 0.16 + rnd(i * 5.13) * 0.5,
  ph: rnd(i * 7.37) * 100,
}));
const COLONY = Array.from({ length: 56 }, (_, i) => ({
  x: 12 + rnd(i * 2.11) * 78,
  y: 50 + (rnd(i * 3.71) - 0.5) * 44,
  s: 14 + rnd(i * 5.33) * 66,
  d: rnd(i * 7.13),
  b: 1.6 + rnd(i * 9.71) * 5,
}));
const CRACKS = Array.from({ length: 17 }, (_, i) => ({
  x: rnd(i * 1.93) * 100,
  y: rnd(i * 4.21) * 100,
  w: 90 + rnd(i * 6.11) * 430,
  r: -74 + rnd(i * 8.31) * 148,
  o: 0.22 + rnd(i * 2.71) * 0.46,
}));
const STAINS = Array.from({ length: 13 }, (_, i) => ({
  x: rnd(i * 3.31) * 100,
  y: rnd(i * 5.51) * 100,
  w: 18 + rnd(i * 7.71) * 44,
  h: 12 + rnd(i * 9.11) * 36,
  o: 0.14 + rnd(i * 2.23) * 0.3,
}));
const STARS = Array.from({ length: 108 }, (_, i) => ({
  x: rnd(i * 1.77) * 100,
  y: rnd(i * 2.39 + 5) * 100,
  s: 0.7 + rnd(i * 3.17) * 1.9,
  o: 0.22 + rnd(i * 4.79) * 0.62,
  ph: rnd(i * 5.91) * 60,
  d: 0.3 + rnd(i * 6.53) * 0.7,
}));
const GRAINS = Array.from({ length: 70 }, (_, i) => ({
  x: rnd(i * 1.61) * 100,
  y: rnd(i * 2.93) * 100,
  z: -320 + rnd(i * 4.07) * 700,
  s: 24 + rnd(i * 5.71) * 74,
  ph: rnd(i * 7.29) * 80,
}));

/* == POLVO EN EL AIRE — montado UNA vez, vive los 1548 frames ========================= */
const Motes: React.FC<{ f: number; tint: string; amt: number }> = ({ f, tint, amt }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {MOTES.map((m, i) => {
      const y = (m.y - f * m.sp * 0.12) % 100;
      const yy = y < 0 ? y + 100 : y;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin((f + m.ph) / (14 + (i % 7))));
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(m.x + Math.sin((f + m.ph) / 63) * 1.6).toFixed(2)}%`,
            top: `${yy.toFixed(2)}%`,
            width: m.s,
            height: m.s,
            borderRadius: "50%",
            background: rgba(tint, 0.5),
            boxShadow: `0 0 ${(m.s * 3).toFixed(1)}px ${rgba(tint, 0.32)}`,
            opacity: tw * amt,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

/* == HORMIGON — el MISMO muro en el acto 2 y en el 3 (materia que cruza) ============== */
const Concrete: React.FC<{ scale: number; tint: string; ox?: number }> = ({ scale, tint, ox = 62 }) => (
  <div
    style={{
      position: "absolute",
      inset: "-38%",
      transform: `scale(${scale.toFixed(3)})`,
      transformOrigin: `${ox}% 52%`,
    }}
  >
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(176deg,#14151A 0%,#0D0E12 58%,#08090B 100%)" }} />
    {[0, 1, 2, 3].map((i) => (
      <div
        key={"j" + i}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${13 + i * 23}%`,
          height: 3,
          background: "rgba(0,0,0,0.6)",
          boxShadow: "0 2px 0 rgba(255,255,255,0.05)",
        }}
      />
    ))}
    {STAINS.map((s, i) => (
      <div
        key={"s" + i}
        style={{
          position: "absolute",
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: `${s.w}%`,
          height: `${s.h}%`,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(tint, s.o * 0.24)} 0%, rgba(0,0,0,0) 68%)`,
        }}
      />
    ))}
    {CRACKS.map((c, i) => (
      <div
        key={"c" + i}
        style={{
          position: "absolute",
          left: `${c.x}%`,
          top: `${c.y}%`,
          width: c.w,
          height: 2.2,
          transform: `translate(-50%,-50%) rotate(${c.r}deg)`,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.92) 22%, rgba(0,0,0,0.92) 78%, rgba(0,0,0,0) 100%)",
          boxShadow: "0 1.4px 0 rgba(255,255,255,0.055)",
          opacity: c.o,
        }}
      />
    ))}
  </div>
);

/* == EL CIELO — compartido por el acto 4 y el 5: NO se remonta en la frontera 4 ======= */
const SpaceBack: React.FC<{ f: number; dim: number }> = ({ f, dim }) => (
  <AbsoluteFill style={{ backgroundColor: MD.ink0 }}>
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 26% 8%, #0F1420 0%, #060709 58%, #030405 100%)" }} />
    {STARS.map((s, i) => {
      const tw = 0.45 + 0.55 * Math.abs(Math.sin((f + s.ph) / (17 + (i % 9))));
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(s.x + Math.sin(f / 200) * 0.5 * s.d).toFixed(2)}%`,
            top: `${(s.y + Math.cos(f / 240) * 0.4 * s.d).toFixed(2)}%`,
            width: s.s,
            height: s.s,
            borderRadius: "50%",
            background: "#EAF2F6",
            opacity: s.o * tw * dim,
            boxShadow: s.s > 2 ? `0 0 ${(s.s * 3).toFixed(1)}px rgba(190,220,235,0.7)` : undefined,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

/* == LOS DOS DATOS — viven FUERA de la camara: el dolly de cam() agranda por perspectiva
      y contra el borde derecho los recortaria. Aca el safe area de 60px es exacto. ==== */
const DaysCounter: React.FC<{ f: number; keyHex: string }> = ({ f, keyHex }) => {
  const op = seg(f, 812, 834) * (1 - seg(f, 1062, 1090));
  if (op <= 0.005) return null;
  const days = Math.round(interpolate(f, [820, 1010], [0, 26], { easing: Easing.out(Easing.cubic), ...CL }));
  return (
    <div
      style={{
        position: "absolute",
        right: 92,
        top: 244,
        textAlign: "right",
        opacity: op,
        transform: `translateX(${interpolate(seg(f, 1062, 1090), [0, 1], [0, 110], CL).toFixed(1)}px)`,
      }}
    >
      <div
        style={{
          fontFamily: F_SANS,
          fontWeight: 900,
          fontSize: 210,
          lineHeight: 0.9,
          letterSpacing: -6,
          color: MD.white,
          textShadow: `0 0 60px ${rgba(keyHex, 0.35)}, 0 10px 40px rgba(0,0,0,0.95)`,
        }}
      >
        {days}
      </div>
      <div
        style={{
          fontFamily: F_SANS,
          fontWeight: 800,
          fontSize: 38,
          letterSpacing: 8,
          color: MD.bone,
          textShadow: "0 4px 18px rgba(0,0,0,0.9)",
        }}
      >
        DAYS
      </div>
      <div style={{ width: 190, height: 3, background: MD.red, marginLeft: "auto", marginTop: 14, boxShadow: `0 0 16px ${MD.red}` }} />
    </div>
  );
};

const PctNumber: React.FC<{ f: number }> = ({ f }) => {
  const op = seg(f, 1166, 1184) * (1 - seg(f, 1250, 1264));
  if (op <= 0.005) return null;
  const pct = Math.round(interpolate(f, [1168, 1214], [0, 20], { easing: Easing.out(Easing.poly(4)), ...CL }));
  const breath = 0.86 + 0.14 * Math.sin(f / 11);
  return (
    <div
      style={{
        position: "absolute",
        right: 84,
        top: 190,
        textAlign: "right",
        opacity: op,
        transform: `scale(${(0.93 + 0.07 * seg(f, 1166, 1204)).toFixed(3)})`,
        transformOrigin: "100% 50%",
      }}
    >
      <div
        style={{
          fontFamily: F_SANS,
          fontWeight: 900,
          fontSize: 250,
          lineHeight: 0.86,
          letterSpacing: -10,
          color: MD.white,
          textShadow: `0 0 70px ${rgba(MD.red, 0.4 * breath)}, 0 12px 44px rgba(0,0,0,0.95)`,
        }}
      >
        +{pct}%
      </div>
      <div
        style={{
          fontFamily: F_SANS,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: 10,
          color: MD.redHot,
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
        }}
      >
        FASTER
      </div>
    </div>
  );
};

/* == COSTURAS DE MATERIA (cobertura garantizada; Stage monta el acento encima) ======== */
/* FRONTERA 2 — una losa de hormigon cruza el haz. Tapa el 100% durante ~5 frames. */
const SlabPass: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = seg(f, at, at + dur);
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [128, -128], { easing: Easing.bezier(0.42, 0, 0.24, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: "-40% -60%",
          transform: `translateX(${x.toFixed(2)}%) rotate(6deg)`,
          background: "linear-gradient(96deg,#0A0B0E 0%,#171A1F 22%,#0D0F13 52%,#15181D 78%,#080A0D 100%)",
          boxShadow: `0 0 160px rgba(0,0,0,0.95), inset 0 3px 0 ${rgba(MD.bone, 0.14)}`,
        }}
      />
    </AbsoluteFill>
  );
};

/* FRONTERA 5 — el enjambre de esporas/granulos que salio de la barra cruza el cuadro. */
const SporeWipe: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = seg(f, at, at + dur);
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [128, -128], { easing: Easing.bezier(0.4, 0, 0.26, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: `${(x - 70).toFixed(2)}%`,
          top: "-24%",
          width: "240%",
          height: "148%",
          background: `radial-gradient(ellipse at 50% 50%, ${MD.ink0} 0%, ${MD.ink0} 72%, rgba(8,9,11,0.7) 86%, rgba(8,9,11,0) 88%)`,
        }}
      />
      {Array.from({ length: 30 }, (_, i) => {
        const sz = 190 + rnd(i * 2.71) * 430;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(x + rnd(i * 3.91) * 140 - 20).toFixed(2)}%`,
              top: `${(-22 + rnd(i * 5.13) * 136).toFixed(2)}%`,
              width: sz,
              height: sz * (0.8 + rnd(i * 7.31) * 0.4),
              marginLeft: -sz / 2,
              marginTop: -sz / 2,
              borderRadius: "50%",
              background: `radial-gradient(circle at 42% 36%, #14181A 0%, ${MD.ink0} 44%, rgba(8,9,11,0.7) 68%, rgba(8,9,11,0) 86%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* == TIPOGRAFIA DEL MOVIMIENTO ======================================================== */
const Caption: React.FC<{
  f: number;
  at: number;
  until: number;
  kicker?: string;
  kColor?: string;
  size?: number;
  w?: number;
  children: React.ReactNode;
}> = ({ f, at, until, kicker, kColor = MD.red, size = 62, w = 1040, children }) => {
  const inn = interpolate(seg(f, at, at + 13), [0, 1], [0, 1], { easing: EZ_OUT });
  const out = seg(f, until - 14, until);
  const op = inn * (1 - out);
  if (op <= 0.005) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 76,
        bottom: 92,
        width: w,
        opacity: op,
        transform: `translateY(${(lerp(26, 0, inn) + out * 22).toFixed(2)}px)`,
      }}
    >
      <TextBed pad={26} w="fit-content">
        {kicker ? <Kicker color={kColor}>{kicker}</Kicker> : null}
        <div style={{ marginTop: kicker ? 12 : 0 }}>
          <Title size={size}>{children}</Title>
        </div>
      </TextBed>
    </div>
  );
};

/* Sello de esquina (fecha / lugar) — anclado por right/top, dentro del safe area. */
const Stamp: React.FC<{
  f: number;
  at: number;
  until: number;
  label: string;
  tone?: string;
  side?: "left" | "right";
}> = ({ f, at, until, label, tone = MD.red, side = "right" }) => {
  const inn = interpolate(seg(f, at, at + 12), [0, 1], [0, 1], { easing: EZ_OUT });
  const out = seg(f, until - 12, until);
  const op = inn * (1 - out);
  if (op <= 0.005) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? 76 : undefined,
        right: side === "right" ? 76 : undefined,
        top: 74,
        opacity: op,
        transform: `translateX(${((1 - inn) * (side === "left" ? -26 : 26)).toFixed(2)}px)`,
        display: "flex",
        flexDirection: side === "left" ? "row-reverse" : "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div style={{ width: interpolate(inn, [0, 1], [0, 54], CL), height: 3, background: tone, boxShadow: `0 0 14px ${tone}` }} />
      <div
        style={{
          fontFamily: F_SANS,
          fontWeight: 800,
          fontSize: 32,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: MD.bone,
          textShadow: "0 4px 18px rgba(0,0,0,0.95)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ====================================================================================
   ACTO 1 · f0-228 — LA JUNTA DE TU BANO. Macro. La mancha tiene nombre.
   ==================================================================================== */
const Act1: React.FC<{ f: number }> = ({ f }) => {
  const push = interpolate(f, [0, 228], [1, 1.42], { easing: EZ_IN, ...CL });
  const tilt = interpolate(f, [0, 228], [56, 44], { easing: EZ_IO, ...CL });
  const grow = seg(f, 6, 150);
  // el goteo: nace, corre por la junta, deja la estela humeda
  const drip = seg(f, 116, 176);
  const dripY = interpolate(drip, [0, 1], [130, 900], { easing: Easing.bezier(0.4, 0, 0.7, 1) });
  // ZOOM-THROUGH: la mancha protagonista se traga el cuadro con el MISMO ink0 del acto 2
  const swallow = interpolate(f, [196, 214, 226, 250], [1, 8, 26, 96], { easing: EZ_IN, ...CL });

  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      {/* plano lejano: pared humeda fuera de foco */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(90% 70% at 30% 22%, #1A1D20 0%, #0C0D10 60%, #07080A 100%)",
          transform: `translateZ(-360px) scale(${(1 + (push - 1) * 0.25).toFixed(3)})`,
        }}
      />
      {/* PLANO DE AZULEJOS (3D real) */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "54%",
            width: 2660,
            height: 1320,
            marginLeft: -1330,
            marginTop: -660,
            transformStyle: "preserve-3d",
            transform: `translateZ(-90px) rotateX(${tilt.toFixed(2)}deg) rotateZ(-6deg) scale(${push.toFixed(3)})`,
            background: "linear-gradient(180deg,#2B2C28 0%,#212320 100%)",
            boxShadow: "inset 0 0 220px rgba(0,0,0,0.85)",
          }}
        >
          {Array.from({ length: 18 }, (_, i) => {
            const c = i % 6;
            const r = Math.floor(i / 6);
            const n = rnd(i * 1.37);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: c * 446,
                  top: r * 446,
                  width: 420,
                  height: 420,
                  background: `linear-gradient(158deg, ${mixHex("#2A2E33", "#191C20", n)} 0%, #14171A 62%, #101215 100%)`,
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.09), inset 0 -3px 8px rgba(0,0,0,0.7), 0 6px 18px rgba(0,0,0,0.6)",
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 4,
                    background: `linear-gradient(${(120 + n * 40).toFixed(0)}deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 42%)`,
                  }}
                />
              </div>
            );
          })}
          {/* LA COLONIA, dentro del canal de junta */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 400, height: 112 }}>
            {COLONY.map((b, i) => {
              const g = clamp01((grow - b.d * 0.55) / 0.45);
              if (g <= 0) return null;
              const s = b.s * (0.24 + 0.76 * g);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: s,
                    height: s * (0.7 + rnd(i * 11.3) * 0.5),
                    marginLeft: -s / 2,
                    marginTop: -s / 2,
                    borderRadius: "48% 52% 55% 45%",
                    background: `radial-gradient(circle at 42% 38%, #101414 0%, ${MD.ink0} 52%, rgba(6,8,7,0) 82%)`,
                    filter: `blur(${b.b.toFixed(1)}px)`,
                    opacity: 0.62 + 0.38 * g,
                  }}
                />
              );
            })}
            {/* pelusa: hifas cortas saliendo del canal */}
            {Array.from({ length: 22 }, (_, i) => {
              const g = clamp01((grow - rnd(i * 4.4) * 0.6) / 0.4);
              if (g <= 0) return null;
              const rot = -80 + rnd(i * 6.6) * 160;
              return (
                <div
                  key={"h" + i}
                  style={{
                    position: "absolute",
                    left: `${14 + rnd(i * 8.8) * 72}%`,
                    top: "50%",
                    width: (18 + rnd(i * 2.2) * 46) * g,
                    height: 2,
                    transformOrigin: "0% 50%",
                    transform: `rotate(${rot.toFixed(1)}deg)`,
                    background: "linear-gradient(90deg, rgba(10,12,12,0.95), rgba(10,12,12,0))",
                    filter: "blur(1.2px)",
                  }}
                />
              );
            })}
          </div>
          {/* estela humeda del goteo */}
          {drip > 0 && (
            <div
              style={{
                position: "absolute",
                left: 1520,
                top: 130,
                width: 16,
                height: Math.max(0, dripY - 130),
                background: "linear-gradient(180deg, rgba(150,180,190,0.02), rgba(150,180,190,0.16))",
                borderRadius: 8,
              }}
            />
          )}
          {drip > 0 && drip < 1 && (
            <div
              style={{
                position: "absolute",
                left: 1512,
                top: dripY,
                width: 30,
                height: 40,
                borderRadius: "50% 50% 55% 45%",
                background: `radial-gradient(circle at 38% 30%, rgba(255,255,255,0.75), ${rgba(MD.cold, 0.28)} 55%, rgba(255,255,255,0.06) 80%)`,
                boxShadow: `0 0 18px ${rgba(MD.cold, 0.35)}`,
              }}
            />
          )}
          <Sheen at={84} dur={34} angle={22} />
        </div>
      </div>

      {/* FOREGROUND fuera de foco: canto del azulejo mas cercano */}
      <div
        style={{
          position: "absolute",
          left: -100,
          right: -100,
          bottom: -60,
          height: 230,
          transform: `translateZ(300px) translateY(${(Math.sin(f / 74) * 6).toFixed(2)}px)`,
          background: "linear-gradient(180deg, rgba(8,9,11,0) 0%, rgba(8,9,11,0.86) 46%, #06070A 100%)",
          filter: "blur(7px)",
        }}
      />
      {/* condensacion sobre la "lente" */}
      {Array.from({ length: 7 }, (_, i) => {
        const s = 10 + rnd(i * 13.1) * 26;
        return (
          <div
            key={"d" + i}
            style={{
              position: "absolute",
              left: `${8 + rnd(i * 3.3) * 84}%`,
              top: `${10 + rnd(i * 5.5) * 78}%`,
              width: s,
              height: s * 1.15,
              borderRadius: "50%",
              transform: `translateZ(430px) translateY(${(Math.sin(f / 40 + i) * 3).toFixed(2)}px)`,
              background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,0.30), rgba(255,255,255,0.04) 62%, rgba(255,255,255,0) 78%)`,
              filter: "blur(2.4px)",
              opacity: 0.55,
            }}
          />
        );
      })}

      {/* ZOOM-THROUGH: la mancha protagonista. Su nucleo es MD.ink0 = el fondo del acto 2. */}
      <div
        style={{
          position: "absolute",
          left: "47%",
          top: "48%",
          width: 210,
          height: 158,
          marginLeft: -105,
          marginTop: -79,
          borderRadius: "50% 46% 52% 48%",
          background: `radial-gradient(circle at 46% 42%, ${MD.ink0} 0%, ${MD.ink0} 46%, rgba(10,10,12,0.86) 66%, rgba(10,10,12,0) 82%)`,
          transform: `scale(${swallow.toFixed(3)})`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ====================================================================================
   ACTO 2 · f228-556 — EL REFUGIO. Oscuridad total y una linterna que barre hormigon.
   ==================================================================================== */
const beamXAt = (f: number) =>
  interpolate(
    f,
    [244, 292, 330, 372, 408, 448, 486, 520, 556],
    [10, 27, 23, 45, 41, 60, 55, 71, 71],
    { easing: EZ_IO, ...CL }
  );
const beamYAt = (f: number) =>
  interpolate(f, [244, 330, 408, 486, 556], [36, 52, 40, 55, 53], { easing: EZ_IO, ...CL });

const Act2: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  // salimos del zoom-through: el negro se ABRE hacia atras
  const pull = interpolate(f, [228, 322], [3.4, 1], { easing: EZ_OUT, ...CL });
  const bx = beamXAt(f);
  const by = beamYAt(f);
  const lock = seg(f, 512, 534); // el haz se clava: "and they found it"
  const flick = 0.86 + 0.14 * Math.sin(f / 5.3) + 0.05 * Math.sin(f / 1.9);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, transformStyle: "preserve-3d" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `scale(${pull.toFixed(3)})`,
          transformOrigin: "47% 48%",
        }}
      >
        {/* plano lejano: profundidad de la nave, pilares */}
        <div style={{ position: "absolute", inset: 0, transform: "translateZ(-460px) scale(1.18)" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${8 + i * 33}%`,
                top: "-10%",
                width: 120 + i * 30,
                height: "130%",
                background: "linear-gradient(90deg, rgba(0,0,0,0.9), rgba(14,16,18,0.94), rgba(0,0,0,0.9))",
                filter: "blur(3px)",
                opacity: 0.9,
              }}
            />
          ))}
        </div>
        {/* EL MURO (mismo componente que el acto 3) */}
        <div style={{ position: "absolute", inset: 0, transform: "translateZ(-120px)" }}>
          <Concrete scale={1.06} tint={tint} ox={62} />
        </div>
        {/* hierros retorcidos + viga caida (plano medio) */}
        <div style={{ position: "absolute", inset: 0, transform: "translateZ(60px)" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${22 + i * 21}%`,
                top: `${18 + i * 9}%`,
                width: 5,
                height: `${28 + i * 12}%`,
                transform: `rotate(${(-14 + i * 11).toFixed(1)}deg)`,
                background: `linear-gradient(90deg, #000, ${rgba(MD.bone, 0.24)} 40%, #000)`,
                opacity: 0.75,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: "-6%",
              top: "68%",
              width: "62%",
              height: 34,
              transform: "rotate(-9deg)",
              background: "linear-gradient(180deg,#1A1C20 0%,#0A0B0D 55%,#050607 100%)",
              boxShadow: `inset 0 2px 0 ${rgba(MD.bone, 0.16)}, 0 22px 50px rgba(0,0,0,0.8)`,
            }}
          />
        </div>
        {/* LA MANCHA en el muro — se descubre cuando el haz la encuentra */}
        <div
          style={{
            position: "absolute",
            left: "71%",
            top: "53%",
            width: 430,
            height: 250,
            marginLeft: -215,
            marginTop: -125,
            transform: "translateZ(62px)",
          }}
        >
          {COLONY.slice(0, 34).map((b, i) => {
            const s = b.s * 1.5;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: s,
                  height: s * 0.82,
                  marginLeft: -s / 2,
                  marginTop: -s / 2,
                  borderRadius: "48% 52% 55% 45%",
                  background: `radial-gradient(circle at 42% 38%, #0A0D0C 0%, #030504 58%, rgba(3,5,4,0) 82%)`,
                  filter: `blur(${(b.b * 1.1).toFixed(1)}px)`,
                }}
              />
            );
          })}
          {/* reticula roja tenue cuando el haz se clava */}
          {lock > 0 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 300 * (1.5 - lock * 0.5),
                height: 300 * (1.5 - lock * 0.5),
                marginLeft: -150 * (1.5 - lock * 0.5),
                marginTop: -150 * (1.5 - lock * 0.5),
                borderRadius: "50%",
                border: `2px solid ${rgba(MD.red, 0.5 * lock)}`,
                boxShadow: `0 0 26px ${rgba(MD.red, 0.28 * lock)}`,
              }}
            />
          )}
        </div>
      </div>

      {/* EL HAZ: cono desde la camara + punto caliente sobre el muro (blend screen) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${bx.toFixed(2)}% ${by.toFixed(2)}%, ${rgba(
            "#DCE6DA",
            0.5 * flick
          )} 0%, ${rgba("#B9C9BE", 0.2 * flick)} 12%, rgba(0,0,0,0) 30%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `conic-gradient(from ${(198 + (bx - 40) * 0.5).toFixed(2)}deg at 4% 112%, rgba(0,0,0,0) 0deg, ${rgba(
            "#CFE0D4",
            0.075 * flick
          )} 5deg, ${rgba("#CFE0D4", 0.02)} 12deg, rgba(0,0,0,0) 18deg)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      {/* polvo denso DENTRO del haz */}
      {Array.from({ length: 26 }, (_, i) => {
        const t = cyc((f * 0.004 + rnd(i * 2.9)) * 1);
        const r = 3 + rnd(i * 4.7) * 11;
        const a = (rnd(i * 6.1) - 0.5) * 26;
        const x = bx + Math.cos((a * Math.PI) / 180) * (r * (0.4 + t)) * 1.4;
        const y = by + Math.sin((a * Math.PI) / 180) * (r * (0.4 + t)) * 0.9 + (t - 0.5) * 6;
        return (
          <div
            key={"bd" + i}
            style={{
              position: "absolute",
              left: `${x.toFixed(2)}%`,
              top: `${y.toFixed(2)}%`,
              width: 2 + rnd(i * 8.3) * 3,
              height: 2 + rnd(i * 8.3) * 3,
              borderRadius: "50%",
              background: "rgba(224,235,222,0.85)",
              boxShadow: "0 0 10px rgba(224,235,222,0.6)",
              opacity: (1 - Math.abs(t - 0.5) * 2) * 0.75 * flick,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ====================================================================================
   ACTO 3 · f556-742 — EL HALLAZGO. Crece HACIA la fuente. Direccion, no adorno.
   ==================================================================================== */
const Act3: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const push = interpolate(f, [556, 742], [2.2, 2.72], { easing: EZ_IO, ...CL });
  const grow = seg(f, 566, 690);
  const bx = beamXAt(f); // el haz sigue clavado donde quedo: materia que cruza la frontera
  const by = beamYAt(f);
  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", inset: 0, transform: "translateZ(-120px)" }}>
        <Concrete scale={push} tint={tint} ox={30} />
      </div>
      {/* luz de la fuente lamiendo el muro desde la derecha */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 90% at 108% 44%, ${rgba(MD.red, 0.2)} 0%, ${rgba("#79C39C", 0.09)} 34%, rgba(0,0,0,0) 62%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* resto del haz de la linterna (continuidad con el acto 2) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${(bx - 26).toFixed(2)}% ${by.toFixed(2)}%, ${rgba("#DCE6DA", 0.26)} 0%, rgba(0,0,0,0) 34%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* LA COLONIA (izquierda) y sus HIFAS estirandose a la derecha */}
      <div style={{ position: "absolute", left: 120, top: 300, width: 560, height: 480, transform: "translateZ(40px)" }}>
        {COLONY.map((b, i) => {
          const s = b.s * 2.1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${b.x * 0.72}%`,
                top: `${b.y}%`,
                width: s,
                height: s * 0.86,
                marginLeft: -s / 2,
                marginTop: -s / 2,
                borderRadius: "48% 52% 55% 45%",
                background: "radial-gradient(circle at 42% 36%, #0C0F0E 0%, #020403 58%, rgba(2,4,3,0) 82%)",
                filter: `blur(${(b.b * 1.5).toFixed(1)}px)`,
              }}
            />
          );
        })}
      </div>
      <svg
        style={{ position: "absolute", inset: 0, transform: "translateZ(48px)" }}
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
      >
        {Array.from({ length: 11 }, (_, i) => {
          const y0 = 340 + i * 42 + rnd(i * 3.3) * 26;
          const y1 = 430 + (i - 5) * 22;
          const d = `M ${300 + rnd(i * 5.1) * 90} ${y0} C ${640} ${y0 - 40 + rnd(i * 7.7) * 80}, ${960} ${y1 + 60}, ${1230} ${470 + (i - 5) * 14}`;
          const g = clamp01((grow - i * 0.045) / 0.5);
          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={rgba(MD.ink0, 0.95)}
                strokeWidth={6.5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - g}
              />
              <path
                d={d}
                fill="none"
                stroke={rgba(MD.moldLit, 0.36)}
                strokeWidth={1.6}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - g}
              />
            </g>
          );
        })}
        {/* EL VECTOR: la direccion del crecimiento, legible */}
        {[0, 1, 2].map((i) => {
          const a = seg(f, 606 + i * 16, 648 + i * 16);
          const y = 392 + i * 78;
          const x1 = 700 + a * 380;
          return (
            <g key={"v" + i} opacity={a * 0.9}>
              <line x1={700} y1={y} x2={x1} y2={y} stroke={rgba(MD.red, 0.75)} strokeWidth={3} strokeLinecap="round" />
              <path
                d={`M ${x1} ${y} l -24 -13 l 0 26 z`}
                fill={MD.redHot}
                opacity={0.9}
              />
            </g>
          );
        })}
      </svg>
      {/* hierro fuera de foco, primer plano */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          top: "-14%",
          width: 26,
          height: "132%",
          transform: `translateZ(300px) rotate(${(7 + Math.sin(f / 88) * 0.6).toFixed(2)}deg)`,
          background: `linear-gradient(90deg,#000, ${rgba(MD.bone, 0.2)} 45%, #000)`,
          filter: "blur(5px)",
          opacity: 0.85,
        }}
      />
    </AbsoluteFill>
  );
};

/* ====================================================================================
   EL CIRCULO — disco de radiacion (acto 3) que ES la Tierra (acto 4). MATCH-SHAPE.
   ==================================================================================== */
const HotCircle: React.FC<{ f: number }> = ({ f }) => {
  const r = interpolate(f, [556, 694, 708, 722, 734, 796, 1100, 1267], [168, 176, 560, 1720, 1720, 630, 596, 566], {
    easing: EZ_IO,
    ...CL,
  });
  const cx = interpolate(f, [556, 694, 734, 796, 1267], [1330, 1330, 1330, 1636, 1690], { easing: EZ_IO, ...CL });
  const cy = interpolate(f, [556, 694, 734, 796, 1267], [468, 468, 468, 1120, 1176], { easing: EZ_IO, ...CL });
  const earth = seg(f, 700, 758); // el interior cambia MIENTRAS tapa: nadie ve un fundido
  const pulse = 0.82 + 0.18 * Math.sin(f / 9);
  const hot = 1 - earth;

  const fill = earth < 0.5
    ? `radial-gradient(circle at 50% 50%, ${rgba("#FFE7D8", 0.95 * hot)} 0%, ${rgba(MD.redHot, 0.9 * hot)} 22%, ${rgba(
        MD.red,
        0.72 * hot
      )} 46%, ${rgba("#3A1410", 0.9 * hot)} 74%, ${rgba("#120607", 0.95)} 100%)`
    : `radial-gradient(circle at 34% 30%, #24506B 0%, #14324A 34%, #08192A 62%, #03080E 86%, #010406 100%)`;

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: r * 2,
        height: r * 2,
        marginLeft: -r,
        marginTop: -r,
        borderRadius: "50%",
        background: fill,
        boxShadow:
          earth < 0.5
            ? `0 0 ${(120 * pulse).toFixed(0)}px ${rgba(MD.red, 0.55 * hot)}, 0 0 ${(320 * pulse).toFixed(0)}px ${rgba(MD.red, 0.24 * hot)}`
            : `0 0 90px rgba(90,170,210,0.20), inset -30px -20px 120px rgba(0,0,0,0.7)`,
        overflow: "hidden",
      }}
    >
      {/* anillos concentricos de la fuente (acto 3) */}
      {earth < 0.55 &&
        [0, 1, 2, 3].map((i) => {
          const t = cyc((f + i * 14) / 56);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${(20 + t * 130).toFixed(1)}%`,
                height: `${(20 + t * 130).toFixed(1)}%`,
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                border: `2px solid ${rgba("#FFD9C8", (1 - t) * 0.5 * hot)}`,
              }}
            />
          );
        })}
      {/* limbo atmosferico + bandas de nube (acto 4) */}
      {earth > 0.4 && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              boxShadow: `inset 0 0 ${(r * 0.16).toFixed(0)}px ${rgba("#7FC6D8", 0.42)}`,
            }}
          />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={"cl" + i}
              style={{
                position: "absolute",
                left: `${(-20 + ((f * 0.06 + i * 34) % 150)).toFixed(2)}%`,
                top: `${16 + i * 19}%`,
                width: "48%",
                height: `${5 + i * 2}%`,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(210,230,240,0.16), rgba(210,230,240,0) 70%)",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "linear-gradient(112deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.94) 100%)",
            }}
          />
        </>
      )}
    </div>
  );
};

/* ====================================================================================
   ACTO 4 · f700-1102 — 2020, LA ISS. Una capa como blindaje. 26 dias.
   La placa lleva la velocidad que el acto 5 hereda (MATCH-MOVE).
   ==================================================================================== */
const plateXAt = (f: number) => interpolate(f, [780, 850, 910, 1030], [1180, 420, 40, -60], { easing: EZ_IO, ...CL });
/* La salida: rampa cuadratica hasta 34 px/f y despues velocidad CONSTANTE. Es EXACTAMENTE
   la velocidad con la que entra la barra del acto 5 -> el ojo no ve un corte, ve un traveling. */
const PLATE_V = 34;
const plateExit = (f: number) => {
  if (f < 1030) return plateXAt(f);
  const u = f - 1030;
  return u <= PLATE_V ? -60 - (u * u) / 2 : -60 - (PLATE_V * PLATE_V) / 2 - PLATE_V * (u - PLATE_V);
};

const Act4: React.FC<{ f: number; keyHex: string }> = ({ f, keyHex }) => {
  const px = plateExit(f);
  const py = interpolate(f, [780, 910, 1060, 1124], [110, 0, 10, 52], { easing: EZ_IO, ...CL });
  const pry = interpolate(f, [780, 910, 1062, 1124], [-38, -14, -20, -48], { easing: EZ_IO, ...CL });
  const prx = interpolate(f, [780, 950, 1124], [17, 7, 13], { easing: EZ_IO, ...CL });
  const ps = interpolate(f, [780, 910, 1062, 1124], [0.7, 1, 0.98, 0.7], { easing: EZ_IO, ...CL });
  const dose = seg(f, 910, 1062);
  const flux = seg(f, 866, 910);
  // la estructura de la estacion ENTRA deslizando (no aparece de la nada) cuando el
  // circulo termina de retroceder; antes de 780 el disco todavia tapa el cuadro.
  // entran deslizando y SALEN con el mismo traveling: nada aparece ni desaparece de la nada
  const truss = interpolate(f, [786, 856, 1058, 1106], [-130, 0, 0, -160], { easing: EZ_IO, ...CL });
  const rail = interpolate(f, [802, 872, 1064, 1110], [180, 0, 0, 200], { easing: EZ_IO, ...CL });
  const W = 560;
  const H = 300;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", transformStyle: "preserve-3d" }}>
      {/* estructura de la estacion — plano medio-lejano */}
      <div style={{ position: "absolute", inset: 0, transform: `translateZ(-260px) translateX(${truss.toFixed(1)}%)` }}>
        <div
          style={{
            position: "absolute",
            left: "-8%",
            top: "4%",
            width: "42%",
            height: 26,
            transform: "rotate(-13deg)",
            background: `linear-gradient(180deg, ${rgba(MD.bone, 0.22)}, rgba(20,22,26,0.9) 46%, rgba(4,5,7,0.95))`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.8)",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-14%",
            top: "9%",
            width: "26%",
            height: "26%",
            transform: "rotate(-13deg) skewX(-8deg)",
            background: "repeating-linear-gradient(96deg, rgba(30,44,60,0.55) 0 12px, rgba(8,12,18,0.7) 12px 26px)",
            border: `1px solid ${rgba(MD.bone, 0.14)}`,
            opacity: 0.7,
          }}
        />
      </div>

      {/* LA PLACA — vidrio de Stage, dos pocillos: control (pálido) y hongo (negro) */}
      <div
        style={{
          position: "absolute",
          left: 960 + px,
          top: 500 + py,
          transformStyle: "preserve-3d",
          transform: `translate(-50%,-50%) translateZ(60px) rotateX(${prx.toFixed(2)}deg) rotateY(${pry.toFixed(2)}deg) scale(${ps.toFixed(3)})`,
        }}
      >
        <div style={{ position: "relative", width: W, height: H, ...glassStyle({ radius: 16, lit: 1.1 }) }}>
          {/* pocillo CONTROL */}
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 46,
              width: 216,
              height: 208,
              borderRadius: 10,
              background: "linear-gradient(160deg,#D8D2C8 0%,#A9A399 58%,#7E7A72 100%)",
              boxShadow: "inset 0 3px 0 rgba(255,255,255,0.5), inset 0 -8px 18px rgba(0,0,0,0.35)",
            }}
          />
          {/* pocillo con la CAPA NEGRA */}
          <div
            style={{
              position: "absolute",
              left: 310,
              top: 46,
              width: 216,
              height: 208,
              borderRadius: 10,
              background: `linear-gradient(160deg,#141719 0%,${MD.ink0} 46%,#000 100%)`,
              boxShadow: `inset 0 3px 0 ${rgba(MD.bone, 0.22)}, inset 0 -10px 22px rgba(0,0,0,0.9), 0 0 26px ${rgba(MD.red, 0.16 * dose)}`,
              overflow: "hidden",
            }}
          >
            {COLONY.slice(0, 26).map((b, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: b.s * 0.52,
                  height: b.s * 0.46,
                  marginLeft: -b.s * 0.26,
                  marginTop: -b.s * 0.23,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 40% 34%, #1A1F1E, #030504 62%, rgba(3,5,4,0) 84%)",
                  filter: "blur(2px)",
                }}
              />
            ))}
          </div>
          <Sheen at={968} dur={30} angle={16} />
          {/* etiquetas de la placa (>=30px) */}
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 262,
              fontFamily: F_SANS,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: 2.6,
              color: rgba(MD.bone, 0.72),
            }}
          >
            CONTROL
          </div>
          <div
            style={{
              position: "absolute",
              left: 310,
              top: 262,
              fontFamily: F_SANS,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: 2.6,
              color: MD.redHot,
            }}
          >
            FUNGUS LAYER
          </div>

          {/* FLUJO: rayos que caen. Sobre el control PASAN; sobre la capa negra se FRENAN. */}
          {Array.from({ length: 20 }, (_, i) => {
            const lane = i / 19;
            const x = 20 + lane * 520;
            const t = cyc((f - 866) / 34 + rnd(i * 2.3));
            const blocked = x > 300;
            const yEnd = blocked ? 54 : 340;
            const y = -120 + t * (yEnd + 130);
            const hit = blocked && y > 30;
            return (
              <div key={"r" + i}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: Math.min(y, yEnd),
                    width: 2,
                    height: 54,
                    transform: "translateZ(52px) rotate(9deg)",
                    background: `linear-gradient(180deg, rgba(255,255,255,0), ${rgba("#BFE6F2", 0.9)})`,
                    opacity: flux * (hit ? 0.2 : 0.85),
                  }}
                />
                {hit && (
                  <div
                    style={{
                      position: "absolute",
                      left: x - 13,
                      top: yEnd - 8,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      transform: "translateZ(54px)",
                      background: `radial-gradient(circle, ${rgba(MD.redHot, 0.75)}, rgba(0,0,0,0) 68%)`,
                      opacity: flux * (1 - Math.abs(t - 0.55) * 2.2),
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* TIRA DE DOSIS bajo la placa: se enciende solo del lado sin blindaje */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 336,
              width: W - 40,
              height: 16,
              borderRadius: 8,
              transform: "translateZ(-30px)",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${rgba(MD.bone, 0.16)}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${(52 * dose).toFixed(1)}%`,
                background: `linear-gradient(90deg, ${MD.red}, ${MD.redHot})`,
                boxShadow: `0 0 22px ${rgba(MD.red, 0.7)}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* pasamanos de la estacion, primer plano fuera de foco */}
      <div
        style={{
          position: "absolute",
          left: -80,
          right: -80,
          bottom: -34,
          height: 120,
          transform: `translateZ(340px) translateY(${rail.toFixed(1)}px) rotate(${(-2.4 + Math.sin(f / 96) * 0.25).toFixed(2)}deg)`,
          background: `linear-gradient(180deg, rgba(6,7,10,0) 0%, ${rgba(MD.bone, 0.1)} 26%, rgba(6,7,10,0.94) 62%, #040507 100%)`,
          filter: "blur(6px)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ====================================================================================
   ACTO 5 · f1078-1267 — EL NUMERO. +20% mas rapido que el control.
   Hereda el fondo (SpaceBack + Tierra: el MISMO plano, no se remonta) Y la velocidad de
   la placa: la barra negra ENTRA desde fuera de cuadro a los mismos 34 px/f con los que
   la placa acaba de salir. Eso es el MATCH-MOVE.
   ==================================================================================== */
const Act5: React.FC<{ f: number }> = ({ f }) => {
  const arrive =
    f < 1122
      ? 1740 - (f - 1078) * PLATE_V // identico vector de salida de la placa
      : interpolate(f, [1122, 1152, 1172], [244, -18, 0], { easing: EZ_OUT, ...CL });
  const L0 = 530;
  const ctrl = L0 * eio(0, 1, seg(f, 1118, 1160)); // el control crece DESPUES: es la referencia
  const surge = seg(f, 1163, 1218);
  const iss = L0 * (1 + 0.2 * interpolate(surge, [0, 0.68, 1], [0, 1.08, 1], CL));
  const bracket = seg(f, 1198, 1228);
  const breath = 0.86 + 0.14 * Math.sin(f / 11);
  const X0 = 280;
  const Y_ISS = 392;
  const Y_CTL = 552;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", transformStyle: "preserve-3d" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translateX(${arrive.toFixed(2)}px) translateZ(70px)`,
        }}
      >
        {/* la linea de base VIAJA con la barra: llega clavada, no aparece de la nada */}
        <div
          style={{
            position: "absolute",
            left: X0 - 26,
            top: Y_ISS - 34,
            width: 4,
            height: 322,
            background: `linear-gradient(180deg, rgba(255,255,255,0.05), ${rgba(MD.bone, 0.42)}, rgba(255,255,255,0.05))`,
          }}
        />
        {/* BARRA ISS — la negra. Llega ENTERA y despues se dispara. */}
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y_ISS,
            width: iss,
            height: 100,
            borderRadius: 10,
            background: `linear-gradient(160deg,#16191B 0%,${MD.ink0} 44%,#000 100%)`,
            border: `1px solid ${rgba(MD.red, 0.2 + 0.3 * surge)}`,
            boxShadow: `inset 0 2px 0 ${rgba(MD.bone, 0.16)}, 0 26px 60px rgba(0,0,0,0.72), 0 0 ${(
              44 * breath * surge
            ).toFixed(0)}px ${rgba(MD.red, 0.3 * surge)}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(100deg, rgba(255,255,255,0) 38%, ${rgba(MD.redHot, 0.14)} 52%, rgba(255,255,255,0) 66%)`,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y_ISS - 44,
            fontFamily: F_SANS,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 4,
            color: MD.redHot,
            textShadow: "0 3px 16px rgba(0,0,0,0.9)",
          }}
        >
          ISS · 26 DAYS
        </div>

        {/* BARRA CONTROL — vidrio de Stage, crece desde la misma base */}
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y_CTL,
            width: Math.max(2, ctrl),
            height: 100,
            ...glassStyle({ radius: 10, lit: 1.25 }),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y_CTL + 114,
            fontFamily: F_SANS,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 4,
            color: rgba(MD.bone, 0.82),
            opacity: seg(f, 1122, 1140),
            textShadow: "0 3px 16px rgba(0,0,0,0.9)",
          }}
        >
          CONTROL · EARTH
        </div>

        {/* la marca del control y el delta: de ahi sale el numero */}
        <div
          style={{
            position: "absolute",
            left: X0 + ctrl,
            top: Y_ISS - 20,
            width: 2,
            height: 300,
            background: `repeating-linear-gradient(180deg, ${rgba(MD.bone, 0.6)} 0 10px, rgba(0,0,0,0) 10px 20px)`,
            opacity: seg(f, 1140, 1160),
          }}
        />
        {bracket > 0 && (
          <div>
            <div
              style={{
                position: "absolute",
                left: X0 + ctrl,
                top: Y_ISS + 118,
                width: Math.max(0, iss - ctrl) * bracket,
                height: 3,
                background: MD.redHot,
                boxShadow: `0 0 18px ${MD.red}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: X0 + iss - 2,
                top: Y_ISS + 100,
                width: 2,
                height: 38 * bracket,
                background: MD.redHot,
              }}
            />
          </div>
        )}

        {/* los GRANULOS ya se desprenden de la barra: son los que cruzan la frontera 5 */}
        {Array.from({ length: 30 }, (_, i) => {
          const t = seg(f, 1234 + rnd(i * 3.11) * 20, 1288);
          if (t <= 0) return null;
          const sz = 8 + rnd(i * 5.71) * 24;
          return (
            <div
              key={"g" + i}
              style={{
                position: "absolute",
                left: X0 + rnd(i * 2.73) * iss,
                top: Y_ISS + rnd(i * 4.31) * 100,
                width: sz,
                height: sz,
                borderRadius: "50%",
                background: "radial-gradient(circle at 38% 32%, #23282A, #050708 60%, rgba(5,7,8,0) 84%)",
                transform: `translate(${(-t * (70 + rnd(i * 6.91) * 280)).toFixed(1)}px, ${(
                  t * (30 + rnd(i * 8.13) * 220)
                ).toFixed(1)}px) scale(${(1 + t * 4.2).toFixed(2)})`,
                opacity: 1 - t * 0.25,
                filter: "blur(1.6px)",
              }}
            />
          );
        })}
      </div>

    </AbsoluteFill>
  );
};

/* ====================================================================================
   ACTO 6 · f1268-fin — MELANINA. El negro no es mugre. Es armadura.
   ==================================================================================== */
const Act6: React.FC<{ f: number; keyHex: string; rake: string }> = ({ f, keyHex, rake: rakeCol }) => {
  const dive = interpolate(f, [1268, 1400, 1548], [1, 1.5, 1.86], { easing: EZ_IO, ...CL });
  const lock = seg(f, 1330, 1428); // los granulos se traban en placas
  const rake = seg(f, 1416, 1462); // luz rasante roja
  const armor = seg(f, 1512, 1542); // el beat de "armor"
  const breath = 0.88 + 0.12 * Math.sin(f / 13);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, pointerEvents: "none", transformStyle: "preserve-3d" }}>
      <AbsoluteFill style={{ background: "radial-gradient(110% 90% at 74% 26%, #16090A 0%, #080607 52%, #030304 100%)" }} />
      {/* luz rasante: el viaje de la luz aterriza en ROJO sobre el negro */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(104deg, rgba(0,0,0,0) 38%, ${rakeCol} 62%, rgba(0,0,0,0) 84%)`,
          opacity: 0.1 + 0.16 * rake,
          mixBlendMode: "screen",
        }}
      />

      {/* CORAZA: placas lamelares que se traban donde estaban los granulos */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translateZ(40px) scale(${dive.toFixed(3)}) rotateX(${(6 - rake * 3).toFixed(2)}deg)`,
        }}
      >
        {Array.from({ length: 54 }, (_, i) => {
          const c = i % 9;
          const r = Math.floor(i / 9);
          const jitter = rnd(i * 3.13);
          const k = clamp01((lock - jitter * 0.4) / 0.6);
          if (k <= 0) return null;
          const x = -132 + c * 230 + (r % 2) * 115;
          const y = -66 + r * 200;
          const z = -60 + jitter * 120;
          return (
            <div
              key={"hx" + i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 252,
                height: 220,
                transform: `translateZ(${(z * k).toFixed(1)}px) scale(${(0.24 + 0.76 * k).toFixed(3)}) rotate(${((1 - k) * (jitter - 0.5) * 40).toFixed(2)}deg)`,
                clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                background: `linear-gradient(${(126 + jitter * 30).toFixed(0)}deg, #191D1F 0%, #0A0C0D 42%, #000 100%)`,
                boxShadow: `0 26px 46px rgba(0,0,0,0.8)`,
                opacity: k,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(112deg, rgba(255,255,255,0) 44%, ${rgba(keyHex, 0.16 + 0.34 * rake)} 56%, rgba(255,255,255,0) 70%)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 10,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(MD.red, (0.2 + 0.6 * rake) * breath)})`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* GRANULOS de melanina: los que vinieron del acto 5, antes de trabarse */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
        {GRAINS.map((g, i) => {
          const k = clamp01((lock - rnd(i * 3.13) * 0.4) / 0.6);
          const alive = 1 - k;
          if (alive <= 0.02) return null;
          const zz = g.z + ((((f - 1268) * 2.1) % 700) + 700) % 700;
          const s = g.s * (0.6 + zz / 900);
          return (
            <div
              key={"gr" + i}
              style={{
                position: "absolute",
                left: `${(g.x + Math.sin((f + g.ph) / 52) * 1.4).toFixed(2)}%`,
                top: `${(g.y + Math.cos((f + g.ph) / 61) * 1.2).toFixed(2)}%`,
                width: s,
                height: s,
                marginLeft: -s / 2,
                marginTop: -s / 2,
                borderRadius: "50%",
                background: `radial-gradient(circle at 34% 28%, #2A2F31 0%, #0B0D0E 46%, #000 78%)`,
                boxShadow: `inset -6px -8px 16px rgba(0,0,0,0.9), 0 0 ${(s * 0.4).toFixed(0)}px ${rgba(keyHex, 0.18)}`,
                opacity: alive,
                filter: s > 90 ? "blur(3px)" : undefined,
              }}
            />
          );
        })}
      </div>

      {/* LOS FOTONES REBOTAN — la armadura, literal */}
      {armor > 0 &&
        Array.from({ length: 14 }, (_, i) => {
          const t = cyc((f - 1500) / 26 + rnd(i * 2.9));
          const x0 = 6 + rnd(i * 4.1) * 88;
          const hitT = 0.5;
          const inb = t < hitT;
          const p = inb ? t / hitT : (t - hitT) / (1 - hitT);
          const x = inb ? x0 + p * 9 : x0 + 9 + p * 16;
          const y = inb ? -8 + p * 62 : 54 - p * 44;
          return (
            <div
              key={"ph" + i}
              style={{
                position: "absolute",
                left: `${x.toFixed(2)}%`,
                top: `${y.toFixed(2)}%`,
                width: 3,
                height: 46,
                transform: `rotate(${inb ? 16 : -34}deg)`,
                background: `linear-gradient(180deg, rgba(255,255,255,0), ${rgba(inb ? "#CFE6F2" : MD.redHot, 0.95)})`,
                opacity: armor * (inb ? 0.9 : 0.75) * (1 - Math.abs(p - 0.5) * 0.6),
              }}
            />
          );
        })}

      {/* destello de contacto en el beat */}
      {armor > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(70% 50% at 62% 48%, ${rgba(MD.red, 0.24 * (1 - armor) + 0.06)} 0%, rgba(0,0,0,0) 62%)`,
            mixBlendMode: "screen",
          }}
        />
      )}
      <Sheen at={1424} dur={30} angle={12} />
    </AbsoluteFill>
  );
};

/* ====================================================================================
   EL MOVIMIENTO
   ==================================================================================== */
export const MovArmor: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = Math.max(60, durationInFrames);
  const f = frame;

  // — LUZ: un solo viaje frio-verdoso -> verde-cian irradiado -> rojo tenue —
  const tint = tintAt(f);
  const keyHex = mixHex("#9FB6C8", MD.red, seg(f, 700, 1500));
  const rakeCol = light(seg(f, 1268, 1548), "warm", "red");
  const keyFrom = interpolate(f, [0, 228, 420, 556, 760, 1090, 1268, 1548], [0.22, 0.3, 0.66, 0.72, 0.3, 0.4, 0.72, 0.78], {
    easing: EZ_IO,
    ...CL,
  });
  const intens = interpolate(f, [0, 228, 300, 520, 700, 800, 1100, 1268, 1548], [1, 0.7, 0.42, 0.5, 0.9, 1.05, 0.95, 0.7, 0.6], {
    easing: EZ_IO,
    ...CL,
  });
  const moteAmt = interpolate(f, [0, 240, 520, 720, 1090, 1268, 1548], [0.6, 0.95, 1, 0.5, 0.4, 0.7, 0.85], { easing: EZ_IO, ...CL });

  // — CAMARA: cam() de Stage sobre el frame GLOBAL + articulacion keyframeada —
  const c = cam(f, { z0: -40, z1: 210, panX: -46, panY: 14, ry: 3, rx: -1, dur: 1548 });
  const rx = rigAt(f, RIG_X);
  const ry = rigAt(f, RIG_Y);
  const rz = rigAt(f, RIG_Z);
  const rry = rigAt(f, RIG_RY);
  const rrx = rigAt(f, RIG_RX);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* LA ATMOSFERA — montada UNA sola vez para los 1548 frames */}
      <Atmos tint={tint} keyFrom={keyFrom} intensity={intens} floor={f < 726 || f > 1266} />

      {/* EL MUNDO, bajo una sola camara */}
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform:
            c.transform +
            ` translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, ${rz.toFixed(2)}px) rotateY(${rry.toFixed(3)}deg) rotateX(${rrx.toFixed(3)}deg)`,
        }}
      >
       {/* el ESPACIO del mundo: sin esta perspectiva CSS los translateZ de los planos
           se aplanan y no hay parallax. cam() aporta el dolly; esto, la profundidad. */}
       <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 46%" }}>
        {/* 1 · la junta del bano (hasta 232: para entonces la mancha ya llena el cuadro) */}
        {vis(f, 0, 232) && <Act1 f={f} />}
        {/* 2 · el refugio — entra a f228 con el MISMO ink0 que el nucleo de la mancha */}
        {vis(f, 228, 559) && <Act2 f={f} tint={tint} />}
        {/* el cielo se monta bajo el acto 3 (tapado) y sirve al 4 Y al 5: nunca se remonta */}
        {vis(f, 716, 1267) && <SpaceBack f={f} dim={interpolate(f, [716, 780, 1240, 1267], [0.5, 1, 1, 0.72], CL)} />}
        {/* 3 · el hallazgo — swap dentro de la losa (cobertura 556-561) */}
        {vis(f, 558, 742) && <Act3 f={f} tint={tint} />}
        {/* EL CIRCULO: fuente de radiacion -> Tierra. Un solo objeto cruza la frontera 3. */}
        {vis(f, 556, 1267) && <HotCircle f={f} />}
        {/* 4 · la ISS — monta a 744, con el disco tapando el 100%; su materia entra a 780+ */}
        {vis(f, 744, 1112) && <Act4 f={f} keyHex={keyHex} />}
        {/* 5 · el numero — entra trucando con la velocidad de salida de la placa */}
        {vis(f, 1078, 1267) && <Act5 f={f} />}
        {/* 6 · la melanina — swap dentro del enjambre de esporas (cobertura 1264-1268) */}
        {f >= 1265 && <Act6 f={f} keyHex={keyHex} rake={rakeCol} />}
       </AbsoluteFill>
      </AbsoluteFill>

      {/* POLVO — la misma aire para todo el movimiento */}
      <Motes f={f} tint={tint} amt={moteAmt} />

      {/* COSTURAS — una distinta por frontera, ninguna es un fundido.
          B1 ZOOM-THROUGH (dentro del acto 1) · B2 OCLUSION · B3 MATCH-SHAPE (HotCircle)
          B4 MATCH-MOVE (velocidad heredada) · B5 WIPE POR MATERIA · beat final @1518 */}
      <SlabPass f={f} at={543} dur={40} />
      <Occluder at={547} dur={22} color="#12151A" angle={7} />
      <SporeWipe f={f} at={1255} dur={28} />
      <VaporWipe at={1259} dur={26} />

      {/* vinieta viva — va DEBAJO del texto para no ensuciar la legibilidad */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(92% 74% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,${(
            0.2 +
            0.07 * Math.sin(f / 57)
          ).toFixed(3)}) 100%)`,
          opacity: 0.55 + 0.45 * clamp01((f - D + 260) / 260),
        }}
      />

      {/* LOS DATOS y EL TEXTO — una idea por acto, <=7 palabras */}
      <DaysCounter f={f} keyHex={keyHex} />
      <PctNumber f={f} />
      <Caption f={f} at={44} until={222} kicker="MOST COMMON INDOOR MOLD" size={62}>
        The one in <Em>your</Em> bathroom.
      </Caption>
      <Stamp f={f} at={186} until={226} label="Cladosporium" side="left" />
      <Stamp f={f} at={252} until={548} label="Late 1990s" />
      <Caption f={f} at={470} until={546} kicker="CHERNOBYL · INSIDE THE SHELTER" size={58}>
        Anything <Em>alive</Em> in there?
      </Caption>
      <Caption f={f} at={584} until={690} kicker="ON THE WALLS" size={58}>
        Growing <Em>toward</Em> the radiation.
      </Caption>
      <Stamp f={f} at={800} until={1074} label="2020 · ISS" />
      <Caption f={f} at={1024} until={1078} kicker="A 1.7 MM LAYER" size={58}>
        Could it <Em>shield</Em> astronauts?
      </Caption>
      <Caption f={f} at={1100} until={1158} kicker="TWENTY-SIX DAYS LATER" size={58}>
        It didn&rsquo;t just <Em>survive</Em>.
      </Caption>
      <Caption f={f} at={1292} until={1452} kicker="THE PIGMENT" size={64}>
        <span style={{ fontFamily: F_SANS }}>Melanin.</span>
      </Caption>

      {/* CIERRE — dos beats de una sola idea */}
      {f >= 1458 && (
        <div
          style={{
            position: "absolute",
            left: 76,
            bottom: 92,
            opacity: seg(f, 1458, 1470) * (1 - seg(f, 1508, 1520) * 0.55),
            transform: `translateY(${(lerp(20, 0, seg(f, 1458, 1472))).toFixed(1)}px)`,
          }}
        >
          <TextBed pad={26} w="fit-content">
            <div
              style={{
                fontFamily: F_SERIF,
                fontStyle: "italic",
                fontSize: 44,
                color: rgba(MD.bone, 0.82),
                textShadow: "0 4px 22px rgba(0,0,0,0.9)",
              }}
            >
              That&rsquo;s not dirt sitting on it.
            </div>
            {f >= 1514 && (
              <div
                style={{
                  marginTop: 16,
                  opacity: seg(f, 1514, 1524),
                  transform: `translateY(${(lerp(24, 0, seg(f, 1514, 1528))).toFixed(1)}px) scale(${(0.96 + 0.04 * seg(f, 1514, 1534)).toFixed(3)})`,
                  transformOrigin: "0% 50%",
                }}
              >
                <Title size={96}>
                  That&rsquo;s <Em>armor</Em>.
                </Title>
              </div>
            )}
          </TextBed>
        </div>
      )}

    </AbsoluteFill>
  );
};
