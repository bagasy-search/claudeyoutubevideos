// MovBiofilm.tsx — MOVIMIENTO 4 del video `mddrain` · 1257 frames (41,9 s) @30fps
// Canal Mike Dalton (EN) · look THEME_PEROXIDE (negro + rojo #E4322A + blanco).
//
// LA IDEA: el olor no es mugre — la mugre no huele. Es una COLONIA viviendo dentro de una capa
// de su propia baba, pegada a la pared del caño, comiendo lo que enjuagás de los platos. Abajo,
// adentro de esa capa, no hay oxígeno: ahí respiran AZUFRE, y lo que exhalan es sulfuro de
// hidrógeno. Tu nariz lo caza a MEDIA PARTE POR MIL MILLONES — por eso una mancha del tamaño de
// una moneda te toma la cocina entera.
//
// MATERIA QUE CRUZA TODAS LAS FRONTERAS: **la capa** (la película negra). Entra como la raspadura
// sobre el papel (acto 1), es la pared viva del caño (acto 2), se abre en secciones (acto 3), es
// el fondo sin oxígeno del que suben las moléculas (acto 4) y es la mancha del tamaño de la
// moneda sobre la mesada (acto 5).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
//                                  T A B L A   D E   H A N D O F F
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–244 · "DIRT DOESN'T SMELL"
//   enterFrom  cám z −130, plano medio, luz FRÍA arriba-izquierda (key .20) — engancha con el
//              b-roll macro de la película raspada sobre papel: la cama ES esa misma foto.
//   exitTo     cám z −10 empujando; la mancha negra de la tarjeta llena el cuadro.
//   materia    la raspadura: CLIP h39_scrapefilm dentro de vidrio, que FLIPEA a la foto h40.
//   ── FRONTERA A @f230–252 · ZOOM-THROUGH ── la cámara entra EN la mancha (escala ×12, tapa
//      100% ~6 frames) y sale del otro lado adentro de la capa. Profundidad extrema, sin corte.
//
// ACTO 2 · f244–520 · "IT'S A COLONY"
//   enterFrom  cám z +620 (recién atravesada la mancha) desacelerando a +60: emerger.
//   exitTo     cám z +40, luz virando apenas al rojo (key .38).
//   materia    la pared del caño en corte (PipeWall) + ojo de buey con CLIP h40_lookinpipe +
//              tarjeta ancha con CLIP h03_pipesection, que es la que cruza la frontera.
//   ── FRONTERA B @f508–526 · OCLUSIÓN ── la tarjeta del tramo de caño se pone de canto (rotateY
//      −84°) mientras el Occluder barre el cuadro entero: detrás ya está armada la estratigrafía.
//
// ACTO 3 · f520–830 · "FOUR LAYERS, ONE STENCH"
//   enterFrom  cám z +40 abriendo hacia atrás; la tarjeta ancha ya es el panel de secciones.
//   exitTo     cám z −20, panel completo, la banda de abajo encendida en rojo.
//   materia    4 capas, cada una con su VENTANITA de material real (fotos h39/h48/h03/h40) y un
//              foco que viaja: la capa activa cambia su ventana por el CLIP vivo.
//   ── FRONTERA C @f814–840 · WIPE POR MATERIA ── la marea anaeróbica (rojo-negro con burbujas)
//      sube desde la capa de abajo, tapa de punta a punta y se lleva el panel.
//
// ACTO 4 · f830–1060 · "SO THEY BREATHE SULFUR"
//   enterFrom  cám z −20 → +55, luz ROJA de alerta (key .58), cama = h01_smellnight_blur.
//   exitTo     cám z +55; la columna de moléculas sigue subiendo, una se separa del grupo.
//   materia    las moléculas dibujadas suben Y ENTRAN en la tarjeta del CLIP h10_smelltowel.
//   ── FRONTERA D @f1030–1078 · MATCH-SHAPE ── la molécula elegida vuela, encoge y ATERRIZA como
//      el punto decimal de "0.5". El número nace de la escena, no aparece de la nada.
//
// ACTO 5 · f1060–1257 · "HALF A PART PER BILLION"
//   enterFrom  cám z +55 → −120 (dolly-out a escala de cocina), luz roja → CÁLIDA NORMAL con un
//              bloom motivado ("se prende la luz de la cocina") entre f1058 y f1086.
//   exitTo     tarjeta con CLIP h41_quarter creciendo hacia cámara, luz de cocina normal,
//              cám z −120 abierta → CORTE EN EL BEAT al b-roll del bicarbonato en la pileta.
//   materia    la moneda al lado de la mancha: la capa, otra vez, ahora medida.
//
// COSTURAS: A ZOOM-THROUGH · B OCLUSIÓN · C WIPE POR MATERIA · D MATCH-SHAPE · salida CORTE EN
// EL BEAT. Ninguna se repite en fronteras seguidas. ⛔ Ningún fade.
//
// PLANOS CON PARALLAX PROPIO (7): cama borrosa · aire/polvo · estructura del caño · tarjetas de
// material real · partículas y moléculas · tipografía · suciedad de primer plano.
import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import {
  MD,
  rgba,
  clamp01,
  lerp,
  rnd,
  light,
  Atmos,
  Occluder,
  Sheen,
  glassStyle,
  F_SANS,
  Kicker,
  Title,
  Em,
  TextBed,
} from "../mdmold/Stage";
import { DR, PipeWall } from "./Pipe";

const A2 = 244, A3 = 520, A4 = 830, A5 = 1060, END = 1257;

const CLIPSRC = (n: string) => `broll/mddrain_${n}.mp4`;
const IMGSRC = (n: string) => `img/mddrain_${n}.jpg`;
const BLURSRC = (n: string) => `img/mddrain_${n}_blur.jpg`;

// ── CÁMARA ÚNICA ────────────────────────────────────────────────────────────────────────────
// Función del frame GLOBAL. Nunca vuelve a cero: cada acto hereda posición, zoom e inercia.
const CAMERA = (f: number) => {
  const z =
    f < 230 ? lerp(-130, -10, clamp01(f / 230)) :
    f < 252 ? lerp(-10, 620, clamp01((f - 230) / 22)) :            // ZOOM-THROUGH
    f < 300 ? lerp(620, 60, clamp01((f - 252) / 48)) :             // emerger del otro lado
    f < A3 ? lerp(60, 40, clamp01((f - 300) / (A3 - 300))) :
    f < 814 ? lerp(40, -20, clamp01((f - A3) / (814 - A3))) :
    f < 1030 ? lerp(-20, 55, clamp01((f - 814) / (1030 - 814))) :
    lerp(55, -120, clamp01((f - 1030) / (END - 1030)));
  const panX =
    f < 252 ? lerp(0, -30, clamp01(f / 252)) :
    f < A3 ? lerp(-30, 34, clamp01((f - 252) / (A3 - 252))) :
    f < A4 ? lerp(34, -26, clamp01((f - A3) / (A4 - A3))) :
    lerp(-26, 30, clamp01((f - A4) / (END - A4)));
  const panY =
    f < A3 ? lerp(14, -8, clamp01(f / A3)) : lerp(-8, 18, clamp01((f - A3) / (END - A3)));
  const ry = f < 252 ? lerp(3.2, 0, clamp01(f / 252)) : lerp(0, -4.4, clamp01((f - 252) / 900));
  const rx = lerp(2.6, -1.8, clamp01(f / 1150));
  const bx = Math.sin(f / 49) * 2.4 + Math.sin(f / 117) * 1.5;     // deriva viva, nunca quieto
  const by = Math.cos(f / 67) * 1.9;
  return (
    `perspective(1500px) translateZ(${z.toFixed(2)}px) ` +
    `translate3d(${(panX + bx).toFixed(2)}px, ${(panY + by).toFixed(2)}px, 0) ` +
    `rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)`
  );
};

// La luz VIAJA: fría → roja de alerta → cálida normal de cocina en el remate.
const TINT = (f: number) => {
  if (f < A3) return light(clamp01(f / A3) * 0.34, "cold", "red");
  if (f < A4 + 110) return light(0.34 + 0.66 * clamp01((f - A3) / (A4 + 110 - A3)), "cold", "red");
  return light(clamp01((f - (A4 + 110)) / (END - (A4 + 110))), "red", "warm");
};

// ── UTILIDADES DE ESCENA ────────────────────────────────────────────────────────────────────
const rise = (f: number, at: number, dur = 22, dy = 26): React.CSSProperties => {
  const p = clamp01((f - at) / dur);
  const e = interpolate(p, [0, 1], [0, 1], { easing: Easing.bezier(0.16, 0.84, 0.24, 1) });
  return { opacity: e, transform: `translateY(${((1 - e) * dy).toFixed(2)}px)` };
};

// Plano con parallax propio: cada capa tiene su Z y su factor de deriva.
const Plane: React.FC<{
  pz: number; px?: number; f: number; op?: number; sc?: number; children?: React.ReactNode;
}> = ({ pz, px = 1, f, op = 1, sc = 1, children }) => (
  <AbsoluteFill
    style={{
      opacity: op,
      transform: `translateZ(${pz}px) scale(${sc}) translate3d(${(Math.sin(f / 53) * 4 * px).toFixed(2)}px, ${(Math.cos(f / 79) * 3 * px).toFixed(2)}px, 0)`,
      transformStyle: "preserve-3d",
    }}
  >
    {children}
  </AbsoluteFill>
);

// Grade del canal sobre cualquier material real.
const Grade: React.FC<{ d?: number; red?: number; vig?: number }> = ({ d = 0.12, red = 0.05, vig = 0.46 }) => (
  <React.Fragment>
    <AbsoluteFill style={{ background: `rgba(228,50,42,${red})`, mixBlendMode: "soft-light" }} />
    <AbsoluteFill style={{ background: `rgba(0,0,0,${d})` }} />
    <AbsoluteFill
      style={{ background: `radial-gradient(86% 74% at 50% 44%, rgba(0,0,0,0) 44%, rgba(0,0,0,${vig}) 100%)` }}
    />
  </React.Fragment>
);

// CLIP real dentro de una tarjeta. El <Sequence> le da tiempo LOCAL al video: así el `startFrom`
// en frames de 24 fps nunca se pasa de los 121 que dura el asset.
const ClipIn: React.FC<{
  from: number; dur: number; name: string; startFrom?: number;
  pos?: string; sc?: number; d?: number;
}> = ({ from, dur, name, startFrom = 0, pos = "50% 50%", sc = 1.05, d = 0.12 }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(CLIPSRC(name))}
        muted
        startFrom={startFrom}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${sc})` }}
      />
      <Grade d={d} />
    </div>
  </Sequence>
);

// FOTO real dentro de una tarjeta (o de una ventanita de la estratigrafía).
const PhotoIn: React.FC<{ name: string; pos?: string; sc?: number; d?: number }> = ({
  name, pos = "50% 50%", sc = 1.06, d = 0.14,
}) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden" }}>
    <Img
      src={staticFile(IMGSRC(name))}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${sc})` }}
    />
    <Grade d={d} />
  </div>
);

// ── TARJETA DE MATERIAL ─────────────────────────────────────────────────────────────────────
// Vidrio + marco + bisel + SOMBRA DE CONTACTO que aterriza. Adentro va SIEMPRE material real.
const MatCard: React.FC<{
  w: number; h: number; left: number; top: number;
  rotY?: number; rotZ?: number; rotX?: number; pz?: number;
  op?: number; sc?: number; radius?: number; lit?: number;
  caption?: string; tag?: string; sheenAt?: number; back?: boolean; hot?: number;
  children?: React.ReactNode;
}> = ({
  w, h, left, top, rotY = 0, rotZ = 0, rotX = 0, pz = 0, op = 1, sc = 1,
  radius = 18, lit = 1, caption, tag, sheenAt, back = false, hot = 0, children,
}) => {
  if (op <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute", left, top, width: w, height: h, opacity: op,
        transform: `translateZ(${pz}px) scale(${sc.toFixed(4)}) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* SOMBRA DE CONTACTO: la tarjeta aterriza, no flota en el vacío */}
      <div
        style={{
          position: "absolute", left: w * 0.05, top: h - 10, width: w * 0.9, height: 52,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 74%)",
          filter: "blur(15px)",
        }}
      />
      <div
        style={{
          position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
          boxSizing: "border-box", padding: 11,
          ...glassStyle({ radius, lit }),
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "relative", width: "100%", height: "100%",
            borderRadius: Math.max(2, radius - 7), overflow: "hidden",
            backgroundColor: MD.ink0,
            boxShadow: `inset 0 0 0 1px ${rgba(MD.white, 0.15)}, inset 0 16px 44px rgba(0,0,0,0.55)`,
            transform: back ? "rotateY(180deg)" : undefined,
          }}
        >
          {children}
          {hot > 0.01 && (
            <AbsoluteFill
              style={{
                boxShadow: `inset 0 0 0 2px ${rgba(MD.red, 0.75 * hot)}, inset 0 0 60px ${rgba(MD.redHot, 0.34 * hot)}`,
              }}
            />
          )}
          {/* rim de luz superior: iluminación de producto */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(184deg, ${rgba(MD.white, 0.16 * lit)} 0%, rgba(255,255,255,0) 26%)`,
              pointerEvents: "none",
            }}
          />
          {sheenAt !== undefined && <Sheen at={sheenAt} dur={30} angle={16} />}
          {tag && (
            <div
              style={{
                position: "absolute", left: 14, top: 14, padding: "6px 12px", borderRadius: 4,
                background: rgba(MD.red, 0.92),
                fontFamily: F_SANS, fontWeight: 800, fontSize: 22, letterSpacing: 2.2,
                color: MD.white, textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
          )}
          {caption && (
            <div
              style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "34px 20px 15px",
                background: "linear-gradient(180deg, rgba(6,6,8,0) 0%, rgba(6,6,8,0.88) 52%)",
                fontFamily: F_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 1.4,
                color: rgba(MD.white, 0.94), textTransform: "uppercase",
              }}
            >
              {caption}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── AIRE DEL CUARTO (plano 2) y SUCIEDAD DE PRIMER PLANO (plano 7) ──────────────────────────
const Motes: React.FC<{ f: number; n?: number; big?: boolean }> = ({ f, n = 26, big = false }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const s = rnd(i * 3.3);
      const s2 = rnd(i * 8.9);
      const y = (f / (620 + s * 900) + s2) % 1;
      const r = big ? 5 + s * 16 : 1.6 + s * 3.4;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(s2 * 100).toFixed(2)}%`,
            top: `${((1 - y) * 108 - 4).toFixed(2)}%`,
            width: r, height: r, borderRadius: "50%",
            background: rgba(MD.white, big ? 0.05 + s * 0.05 : 0.1 + s * 0.22),
            filter: big ? "blur(5px)" : undefined,
            transform: `translateX(${(Math.sin(f / (30 + s * 40) + i) * (big ? 16 : 7)).toFixed(2)}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── LA COLONIA (capa gráfica: bacterias que se dividen sobre la pared) ──────────────────────
const Colony: React.FC<{ f: number; at: number; n?: number; alive?: number }> = ({ f, at, n = 40, alive = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const s = rnd(i * 6.1);
      const s2 = rnd(i * 2.7);
      const a = clamp01((f - at - i * 5) / 26) * alive;
      if (a <= 0) return null;
      const pulse = 0.82 + Math.sin(f / (17 + s * 22) + i * 1.3) * 0.18;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${8 + s2 * 62}%`,
            top: `${12 + s * 74}%`,
            width: (5 + s * 9) * pulse,
            height: (3 + s2 * 5) * pulse,
            borderRadius: "50%",
            background: rgba(MD.redHot, 0.46 * a),
            boxShadow: `0 0 ${13 * a}px ${rgba(MD.red, 0.55 * a)}`,
            transform: `rotate(${(s2 * 180).toFixed(1)}deg)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── LA MOLÉCULA (H₂S dibujada: bola de azufre + dos hidrógenos) ─────────────────────────────
const Molecule: React.FC<{ size: number; hot?: number; spin?: number }> = ({ size, hot = 1, spin = 0 }) => (
  <div style={{ position: "relative", width: size, height: size, transform: `rotate(${spin.toFixed(1)}deg)` }}>
    <div
      style={{
        position: "absolute", left: size * 0.24, top: size * 0.24, width: size * 0.52, height: size * 0.52,
        borderRadius: "50%",
        background: `radial-gradient(circle at 34% 30%, #FFD48A 0%, ${MD.redHot} 44%, ${MD.red} 78%, #6B140F 100%)`,
        boxShadow: `0 0 ${size * 0.5}px ${rgba(MD.red, 0.5 * hot)}`,
      }}
    />
    {[0, 1].map((k) => (
      <div
        key={k}
        style={{
          position: "absolute",
          left: k === 0 ? 0 : size * 0.72,
          top: k === 0 ? size * 0.6 : size * 0.62,
          width: size * 0.28, height: size * 0.28, borderRadius: "50%",
          background: `radial-gradient(circle at 36% 32%, #FFFFFF 0%, ${rgba(MD.cold, 0.9)} 56%, ${rgba(MD.cold, 0.3)} 100%)`,
        }}
      />
    ))}
  </div>
);

// ══ ACTO 1 ══════════════════════════════════════════════════════════════════════════════════
const Act1: React.FC<{ f: number; op: number }> = ({ f, op }) => {
  const inn = clamp01((f - 6) / 48);
  const innE = interpolate(inn, [0, 1], [0, 1], { easing: Easing.bezier(0.16, 0.92, 0.24, 1) });
  const flip = interpolate(f, [150, 174], [0, 180], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.18, 1),
  });
  const back = flip >= 90;
  const line = clamp01((f - 196) / 44);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* plano 1 · la cama: la MISMA foto macro con la que entra el b-roll */}
      <Plane pz={-150} px={0.16} f={f} sc={1.3}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile(BLURSRC("h39_scrapefilm"))}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${(1.14 + f * 0.00034).toFixed(4)})`,
              filter: "brightness(0.36) saturate(0.66)",
            }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(78% 66% at 40% 44%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%)" }} />
        </AbsoluteFill>
      </Plane>

      {/* plano 4 · el protagonista: material real dentro de vidrio */}
      <Plane pz={70} px={1} f={f}>
        <MatCard
          w={880} h={496} left={628} top={244}
          rotY={-9 + flip} rotZ={lerp(2.4, -0.8, innE)}
          sc={lerp(0.9, 1, innE)} op={innE} back={back}
          sheenAt={126}
          caption={back ? "AND IT LINES THE WHOLE PIPE" : "SCRAPED OFF A SIX-INCH LINE"}
          tag={back ? undefined : "REAL"}
        >
          {back ? (
            <PhotoIn name="h40_lookinpipe" pos="52% 44%" sc={1.1} d={0.16} />
          ) : (
            <React.Fragment>
              <PhotoIn name="h39_scrapefilm" pos="50% 56%" sc={1.14} d={0.14} />
              <ClipIn from={10} dur={142} name="h39_scrapefilm" startFrom={4} pos="50% 52%" sc={1.06} d={0.11} />
            </React.Fragment>
          )}
        </MatCard>
      </Plane>

      {/* plano 6 · la tipografía */}
      <Plane pz={40} px={0.6} f={f}>
        <div style={{ position: "absolute", left: 150, top: 318, width: 460 }}>
          <div style={rise(f, 18)}>
            <Kicker>THE SMELL ISN&apos;T DIRT</Kicker>
          </div>
          <div style={{ marginTop: 16, ...rise(f, 40, 24, 32) }}>
            <Title size={78}>Dirt doesn&apos;t</Title>
          </div>
          <div style={{ marginTop: -4, ...rise(f, 66, 24, 32) }}>
            <Title size={96}>
              <Em>smell</Em>.
            </Title>
          </div>
          <div
            style={{
              marginTop: 18, height: 3, width: `${(line * 74).toFixed(1)}%`,
              background: `linear-gradient(90deg, ${MD.red}, ${rgba(MD.redHot, 0)})`,
              boxShadow: `0 0 20px ${rgba(MD.red, 0.7)}`,
            }}
          />
          <div style={{ marginTop: 26, ...rise(f, 112, 26, 22) }}>
            <TextBed w={440} pad={22}>
              <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 31, lineHeight: 1.34, color: rgba(MD.white, 0.9) }}>
                Mud on your boots is silent. Whatever is in that pipe is not mud.
              </div>
            </TextBed>
          </div>
        </div>
      </Plane>
    </AbsoluteFill>
  );
};

// ══ ACTO 2 ══════════════════════════════════════════════════════════════════════════════════
const Act2: React.FC<{ f: number; op: number }> = ({ f, op }) => {
  const wide = clamp01((f - 392) / 54);
  const wideE = interpolate(wide, [0, 1], [0, 1], { easing: Easing.bezier(0.14, 0.86, 0.22, 1) });
  // la tarjeta ancha se pone de canto en la frontera B: ELLA es la oclusión
  const edge = clamp01((f - 496) / 22);
  const port = clamp01((f - A2 - 12) / 46);
  const portE = interpolate(port, [0, 1], [0, 1], { easing: Easing.bezier(0.18, 0.88, 0.24, 1) });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* plano 1 · cama macro real: la capa levantándose de la pared */}
      <Plane pz={-150} px={0.16} f={f} sc={1.3}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile(BLURSRC("h48_liftlayer"))}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${(1.2 + (f - A2) * 0.00028).toFixed(4)})`,
              filter: "brightness(0.32) saturate(0.6)",
            }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(76% 66% at 56% 46%, rgba(0,0,0,0) 26%, rgba(0,0,0,0.84) 100%)" }} />
        </AbsoluteFill>
      </Plane>

      {/* plano 3 · estructura: la pared del caño en corte, con la película entera */}
      <Plane pz={-70} px={0.44} f={f} op={clamp01((f - A2 - 4) / 34) * 0.92}>
        <div
          style={{
            position: "absolute", left: 720, top: -60,
            transform: `rotateY(${lerp(14, 4, clamp01((f - A2) / 260)).toFixed(2)}deg) rotateZ(-2.4deg) scale(${lerp(1.24, 1.05, clamp01((f - A2) / 260)).toFixed(3)})`,
            transformStyle: "preserve-3d",
          }}
        >
          <PipeWall w={520} h={1220} filmT={1} lit={0.66} />
        </div>
      </Plane>

      {/* plano 5 · la colonia viva sobre la pared */}
      <Plane pz={60} px={1.32} f={f}>
        <div style={{ position: "absolute", left: 700, top: 60, width: 620, height: 940 }}>
          <Colony f={f} at={A2 + 40} n={44} alive={0.9} />
        </div>
      </Plane>

      {/* plano 4a · OJO DE BUEY: mirar adentro del caño, CLIP real */}
      <Plane pz={70} px={1.1} f={f}>
        <MatCard
          w={470} h={470} left={210} top={424} radius={235}
          rotZ={lerp(-6, -1.4, portE)} sc={lerp(0.84, 1, portE)} op={portE}
          sheenAt={A2 + 96}
        >
          <PhotoIn name="h40_lookinpipe" pos="50% 46%" sc={1.16} d={0.18} />
          <ClipIn from={268} dur={138} name="h40_lookinpipe" startFrom={6} pos="50% 46%" sc={1.1} d={0.13} />
          {/* bisel metálico del borescopio */}
          <AbsoluteFill
            style={{
              borderRadius: "50%",
              boxShadow: `inset 0 0 0 8px ${rgba(MD.ink2, 0.9)}, inset 0 0 0 10px ${rgba(MD.white, 0.22)}, inset 0 34px 70px rgba(0,0,0,0.6)`,
            }}
          />
        </MatCard>
        {/* el rótulo va FUERA del ojo de buey: adentro lo cortaría el círculo */}
        <div
          style={{
            position: "absolute", left: 214, top: 906, padding: "11px 20px", borderRadius: 5,
            opacity: portE,
            transform: `translateY(${((1 - portE) * 16).toFixed(1)}px)`,
            background: "linear-gradient(180deg, rgba(8,8,10,0.9) 0%, rgba(8,8,10,0.7) 100%)",
            boxShadow: `0 14px 34px rgba(0,0,0,0.7), inset 0 0 0 1px ${rgba(MD.white, 0.16)}`,
            fontFamily: F_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 1.6,
            color: rgba(MD.white, 0.94), textTransform: "uppercase",
          }}
        >
          LOOK IN ANY OLD LINE
        </div>
      </Plane>

      {/* plano 4b · LA TARJETA QUE CRUZA LA FRONTERA: el tramo de caño cortado */}
      <Plane pz={90} px={1.18} f={f}>
        <MatCard
          w={720} h={380} left={950} top={540}
          rotY={lerp(-12, -84, edge)} rotZ={lerp(3.6, 0.6, wideE)}
          sc={lerp(0.88, 1, wideE) * (1 + edge * 0.5)} op={wideE}
          sheenAt={452} caption="HE CUT ONE OPEN"
        >
          <PhotoIn name="h03_pipesection" pos="50% 50%" sc={1.12} d={0.16} />
          <ClipIn from={396} dur={132} name="h03_pipesection" startFrom={10} pos="50% 50%" sc={1.06} d={0.12} />
        </MatCard>
      </Plane>

      {/* plano 6 · tipografía */}
      <Plane pz={40} px={0.6} f={f}>
        <div style={{ position: "absolute", left: 950, top: 120, width: 760 }}>
          <div style={rise(f, A2 + 24)}>
            <Kicker>SO WHAT IS ACTUALLY IN THERE</Kicker>
          </div>
          <div style={{ marginTop: 16, ...rise(f, A2 + 48, 24, 32) }}>
            <Title size={72}>
              It&apos;s a <Em>colony</Em>,
            </Title>
          </div>
          <div style={{ marginTop: -2, ...rise(f, A2 + 74, 24, 32) }}>
            <Title size={72}>living in slime.</Title>
          </div>
          <div style={{ marginTop: 24, ...rise(f, A2 + 118, 26, 22) }}>
            <TextBed w={660} pad={22}>
              <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 31, lineHeight: 1.32, color: rgba(MD.white, 0.9) }}>
                Bacteria glue themselves to the wall and eat whatever you rinse off the plates.
              </div>
            </TextBed>
          </div>
        </div>
      </Plane>
    </AbsoluteFill>
  );
};

// ══ ACTO 3 · LA ESTRATIGRAFÍA ═══════════════════════════════════════════════════════════════
type LayerDef = {
  label: string;
  sub: string;
  color: string;
  h: number;
  img: string;
  pos: string;
  clipFrom: number;
  clipStart: number;
};

const LAYERS: LayerDef[] = [
  { label: "WHAT YOU RINSE OFF PLATES", sub: "grease · soap · milk · coffee", color: "#7A6E56", h: 136, img: "h39_scrapefilm", pos: "50% 54%", clipFrom: 556, clipStart: 30 },
  { label: "SLIME THEY BUILT THEMSELVES", sub: "the matrix that holds it on", color: "#56604A", h: 149, img: "h48_liftlayer", pos: "50% 50%", clipFrom: 626, clipStart: 14 },
  { label: "THE COLONY", sub: "millions of them, layered", color: "#3B4531", h: 161, img: "h03_pipesection", pos: "50% 48%", clipFrom: 696, clipStart: 40 },
  { label: "NO OXYGEN DOWN HERE", sub: "and this is where it starts", color: "#1B1E16", h: 174, img: "h40_lookinpipe", pos: "50% 46%", clipFrom: 766, clipStart: 52 },
];

const LayerBand: React.FC<{ f: number; i: number; d: LayerDef; top: number }> = ({ f, i, d, top }) => {
  const at = A3 + 8 + i * 20;
  const open = clamp01((f - at) / 34);
  const openE = interpolate(open, [0, 1], [0, 1], { easing: Easing.bezier(0.16, 0.86, 0.22, 1) });
  const active = clamp01((f - d.clipFrom + 10) / 16) * (1 - clamp01((f - (d.clipFrom + 62)) / 16));
  const live = f >= d.clipFrom && f < d.clipFrom + 62;
  const winH = d.h - 26;
  return (
    <div
      style={{
        position: "absolute", left: 0, top: lerp(280 - i * 6, top, openE), width: 1080, height: d.h,
        opacity: openE,
        transform: `translateZ(${(active * 46).toFixed(1)}px) translateX(${((1 - openE) * (i % 2 === 0 ? -70 : 70)).toFixed(1)}px) scaleY(${lerp(0.36, 1, openE).toFixed(3)})`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* cuerpo de la capa */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
          background: `linear-gradient(180deg, ${rgba(d.color, 0.96)} 0%, ${rgba(d.color, 0.72)} 46%, rgba(10,10,12,0.9) 100%)`,
          boxShadow: `inset 0 1px 0 ${rgba(MD.white, 0.16 + active * 0.2)}, inset 0 -14px 30px rgba(0,0,0,0.6), 0 ${10 + active * 14}px ${26 + active * 30}px rgba(0,0,0,${0.5 + active * 0.2})`,
          borderLeft: `3px solid ${rgba(MD.red, 0.15 + active * 0.85)}`,
        }}
      />
      {/* grumos: la capa tiene materia, no es una banda plana */}
      {Array.from({ length: 14 }, (_, k) => {
        const s = rnd(i * 31.7 + k * 4.3);
        const s2 = rnd(i * 12.1 + k * 9.1);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: `${28 + s2 * 68}%`,
              top: `${8 + s * 74}%`,
              width: 8 + s * 34, height: 5 + s2 * 16,
              borderRadius: "46%",
              background: rgba(k % 3 === 0 ? MD.white : "#000000", 0.05 + s * 0.09),
              filter: "blur(1.4px)",
              transform: `translateY(${(Math.sin(f / (34 + s * 30) + k) * 2.4).toFixed(2)}px)`,
            }}
          />
        );
      })}
      {/* LA VENTANITA: material real adentro de cada capa */}
      <div
        style={{
          position: "absolute", left: 16, top: 13, width: 300, height: winH,
          borderRadius: 8, overflow: "hidden",
          boxShadow: `inset 0 0 0 1px ${rgba(MD.white, 0.2 + active * 0.4)}, 0 12px 26px rgba(0,0,0,0.65), 0 0 ${active * 34}px ${rgba(MD.red, active * 0.5)}`,
          backgroundColor: MD.ink0,
        }}
      >
        <PhotoIn name={d.img} pos={d.pos} sc={1.2} d={lerp(0.42, 0.06, active)} />
        {live && <ClipIn from={d.clipFrom} dur={62} name={d.img} startFrom={d.clipStart} pos={d.pos} sc={1.12} d={0.08} />}
        <AbsoluteFill
          style={{ background: `linear-gradient(180deg, ${rgba(MD.white, 0.1)} 0%, rgba(255,255,255,0) 30%)`, pointerEvents: "none" }}
        />
      </div>
      {/* rótulo */}
      <div style={{ position: "absolute", left: 344, top: 14, width: 660 }}>
        <div
          style={{
            fontFamily: F_SANS, fontWeight: 800,
            fontSize: d.h > 155 ? 36 : 32, letterSpacing: 1.4,
            color: active > 0.4 ? MD.white : rgba(MD.white, 0.7),
            textShadow: "0 3px 16px rgba(0,0,0,0.9)",
          }}
        >
          {d.label}
        </div>
        <div
          style={{
            marginTop: 5, fontFamily: F_SANS, fontWeight: 600, fontSize: 30, letterSpacing: 0.4,
            color: rgba(active > 0.4 ? MD.redHot : MD.white, 0.62 + active * 0.32),
          }}
        >
          {d.sub}
        </div>
      </div>
      {/* marca de profundidad a la derecha */}
      <div
        style={{
          position: "absolute", right: 18, top: 14,
          fontFamily: F_SANS, fontWeight: 800, fontSize: 28, letterSpacing: 2,
          color: rgba(MD.white, 0.26 + active * 0.5),
        }}
      >
        {`0${i + 1}`}
      </div>
    </div>
  );
};

const Act3: React.FC<{ f: number; op: number }> = ({ f, op }) => {
  const tops = [0, 136, 285, 446];
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* plano 1 · el panel vive sobre una FOTO MACRO REAL, no sobre fondo plano */}
      <Plane pz={-150} px={0.16} f={f} sc={1.3}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile(BLURSRC("h48_liftlayer"))}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${(1.3 - (f - A3) * 0.00022).toFixed(4)})`,
              filter: "brightness(0.3) saturate(0.58)",
            }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(80% 70% at 62% 48%, rgba(0,0,0,0) 24%, rgba(0,0,0,0.86) 100%)" }} />
        </AbsoluteFill>
      </Plane>

      {/* plano 4 · LA ESTRATIGRAFÍA */}
      <Plane pz={60} px={1.05} f={f}>
        <div
          style={{
            position: "absolute", left: 640, top: 228, width: 1080, height: 620,
            transformStyle: "preserve-3d",
            transform: `rotateY(${lerp(-9, -3.4, clamp01((f - A3) / 260)).toFixed(2)}deg) rotateX(${lerp(5, 1.2, clamp01((f - A3) / 260)).toFixed(2)}deg)`,
          }}
        >
          {LAYERS.map((d, i) => (
            <LayerBand key={i} f={f} i={i} d={d} top={tops[i]} />
          ))}
          {/* la línea de corte: lo que hace que se lea como una SECCIÓN */}
          <div
            style={{
              position: "absolute", left: -26, top: 0, width: 3,
              height: `${(clamp01((f - A3 - 14) / 60) * 100).toFixed(1)}%`,
              background: `linear-gradient(180deg, ${rgba(MD.white, 0.5)}, ${rgba(MD.red, 0.9)})`,
            }}
          />
        </div>
      </Plane>

      {/* plano 6 · tipografía */}
      <Plane pz={40} px={0.6} f={f}>
        <div style={{ position: "absolute", left: 150, top: 300, width: 460 }}>
          <div style={rise(f, A3 + 16)}>
            <Kicker>CUT THE PIPE OPEN</Kicker>
          </div>
          <div style={{ marginTop: 16, ...rise(f, A3 + 40, 24, 32) }}>
            <Title size={74}>Four layers.</Title>
          </div>
          <div style={{ marginTop: -2, ...rise(f, A3 + 66, 24, 32) }}>
            <Title size={80}>
              One <Em>stench</Em>.
            </Title>
          </div>
          <div style={{ marginTop: 26, ...rise(f, A3 + 120, 26, 22) }}>
            <TextBed w={444} pad={22}>
              <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 31, lineHeight: 1.32, color: rgba(MD.white, 0.9) }}>
                Top to bottom: the food, the slime, the colony — and then the dark.
              </div>
            </TextBed>
          </div>
        </div>
      </Plane>
    </AbsoluteFill>
  );
};

// ══ ACTO 4 · EL SULFURO ═════════════════════════════════════════════════════════════════════
const COUSINS = [
  { at: A4 + 130, x: 742, y: 214, t1: "SOUR MILK", t2: "methanethiol" },
  { at: A4 + 164, x: 660, y: 752, t1: "OLD SOCKS", t2: "dimethyl sulfide" },
];

const Act4: React.FC<{ f: number; op: number }> = ({ f, op }) => {
  const t = f - A4;
  const card = clamp01((t - 50) / 52);
  const cardE = interpolate(card, [0, 1], [0, 1], { easing: Easing.bezier(0.16, 0.86, 0.22, 1) });
  const out = clamp01((f - 1036) / 52);            // sale por MOVIMIENTO, no por fade
  const bloom = clamp01((f - 1058) / 28);          // se prende la luz de la cocina
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* plano 1 · la cocina de noche, real */}
      <Plane pz={-150} px={0.16} f={f} sc={1.3}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile(BLURSRC("h01_smellnight"))}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${(1.16 + t * 0.0003).toFixed(4)})`,
              filter: `brightness(${(0.3 + bloom * 0.5).toFixed(2)}) saturate(0.62)`,
            }}
          />
          <AbsoluteFill style={{ background: `rgba(228,50,42,${(0.14 * (1 - bloom)).toFixed(3)})`, mixBlendMode: "soft-light" }} />
          <AbsoluteFill style={{ background: "radial-gradient(78% 68% at 46% 48%, rgba(0,0,0,0) 26%, rgba(0,0,0,0.84) 100%)" }} />
        </AbsoluteFill>
      </Plane>

      {/* plano 3 · el fondo sin oxígeno del que salen */}
      <Plane pz={-90} px={0.42} f={f}>
        <div
          style={{
            position: "absolute", left: -40, right: -40, bottom: -30, height: 300,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba("#1B0906", 0.86)} 44%, #0C0403 100%)`,
            boxShadow: `inset 0 26px 60px ${rgba(MD.red, 0.2)}`,
          }}
        />
      </Plane>

      {/* plano 5 · LA COLUMNA DE MOLÉCULAS que sube y entra en la tarjeta */}
      <Plane pz={60} px={1.4} f={f}>
        {Array.from({ length: 15 }, (_, i) => {
          const s = rnd(i * 5.7);
          const s2 = rnd(i * 13.1);
          const born = 18 + i * 11;
          const a = clamp01((t - born) / 24) * (1 - out * 0.85);
          if (a <= 0) return null;
          const cyc = ((t - born) / (150 + s * 90)) % 1;
          const y = 92 - cyc * 108;
          const x = 30 + s2 * 22 + Math.sin((t - born) / (26 + s * 22)) * 3.4;
          const size = 40 + s * 52;
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
                opacity: a * (0.34 + (1 - cyc) * 0.66),
              }}
            >
              <Molecule size={size} hot={1} spin={(t + i * 40) * 0.5} />
            </div>
          );
        })}
      </Plane>

      {/* plano 4 · la tarjeta real: huele el papel y echa la cabeza atrás */}
      <Plane pz={90} px={1.16} f={f}>
        <MatCard
          w={680} h={440} left={lerp(1010, 1960, out)} top={lerp(302, 272, cardE)}
          rotY={lerp(-14, -6, cardE) - out * 16} rotZ={lerp(3.2, 0.8, cardE)}
          sc={lerp(0.86, 1, cardE)} op={cardE}
          hot={clamp01((t - 120) / 40) * (1 - out)}
          sheenAt={A4 + 150} caption="ROTTEN EGG. THAT'S HYDROGEN SULFIDE."
        >
          <PhotoIn name="h10_smelltowel" pos="50% 42%" sc={1.14} d={0.16} />
          <ClipIn from={892} dur={140} name="h10_smelltowel" startFrom={4} pos="50% 42%" sc={1.06} d={0.12} />
        </MatCard>
      </Plane>

      {/* plano 5b · los dos primos, rotulados sobre sus estelas */}
      {COUSINS.map((c, i) => (
        <Plane pz={60} px={1.24} f={f} key={i} op={1 - out}>
          <div style={{ position: "absolute", left: c.x, top: c.y, ...rise(f, c.at, 24, 18) }}>
            <div
              style={{
                padding: "10px 16px", borderRadius: 6,
                background: "linear-gradient(180deg, rgba(8,6,6,0.9) 0%, rgba(8,6,6,0.72) 100%)",
                boxShadow: `0 12px 34px rgba(0,0,0,0.7), inset 0 0 0 1px ${rgba(MD.red, 0.5)}`,
              }}
            >
              <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 27, letterSpacing: 2.2, color: MD.white }}>{c.t1}</div>
              <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 26, letterSpacing: 1, color: rgba(MD.redHot, 0.85) }}>{c.t2}</div>
            </div>
          </div>
        </Plane>
      ))}

      {/* plano 6 · tipografía */}
      <Plane pz={40} px={0.6} f={f} op={1 - clamp01((f - 1030) / 40)}>
        <div style={{ position: "absolute", left: 150, top: 292, width: 460 }}>
          <div style={rise(f, A4 + 18)}>
            <Kicker>AT THE BOTTOM, NO OXYGEN</Kicker>
          </div>
          <div style={{ marginTop: 16, ...rise(f, A4 + 42, 24, 32) }}>
            <Title size={74}>So they breathe</Title>
          </div>
          <div style={{ marginTop: -2, ...rise(f, A4 + 68, 24, 32) }}>
            <Title size={98}>
              <Em>sulfur</Em>.
            </Title>
          </div>
          <div style={{ marginTop: 26, ...rise(f, A4 + 116, 26, 22) }}>
            <TextBed w={444} pad={22}>
              <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 31, lineHeight: 1.32, color: rgba(MD.white, 0.9) }}>
                They exhale hydrogen sulfide — plus two cousins you already know.
              </div>
            </TextBed>
          </div>
        </div>
      </Plane>

      {/* la luz de la cocina que se prende: motiva el cambio de acto */}
      {bloom > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(70% 60% at 66% 12%, ${rgba(MD.warm, 0.3 * bloom)} 0%, rgba(0,0,0,0) 64%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ══ ACTO 5 · EL NÚMERO ══════════════════════════════════════════════════════════════════════
const Act5: React.FC<{ f: number }> = ({ f }) => {
  // MATCH-SHAPE: la molécula vuela desde la columna del acto 4 y aterriza como el punto decimal
  const dp = clamp01((f - 1030) / 48);
  const dpE = interpolate(dp, [0, 1], [0, 1], { easing: Easing.bezier(0.3, 0, 0.16, 1) });
  const solid = clamp01((f - 1064) / 22);
  const bed = clamp01((f - 1046) / 46);
  const card = clamp01((f - 1112) / 54);
  const cardE = interpolate(card, [0, 1], [0, 1], { easing: Easing.bezier(0.16, 0.86, 0.22, 1) });
  const push = clamp01((f - 1196) / 58);                // la tarjeta viene hacia cámara
  const pushE = interpolate(push, [0, 1], [0, 1], { easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const numFade = 1 - clamp01((f - 1200) / 46) * 0.72;
  return (
    <AbsoluteFill>
      {/* plano 1 · la cocina, luz normal: ya estamos donde arranca el b-roll siguiente */}
      <Plane pz={-150} px={0.16} f={f} op={bed} sc={1.3}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile(BLURSRC("h41_quarter"))}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${(1.24 - (f - A5) * 0.00042).toFixed(4)})`,
              filter: "brightness(0.5) saturate(0.78)",
            }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(84% 72% at 50% 46%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.7) 100%)" }} />
        </AbsoluteFill>
      </Plane>

      {/* plano 6 · EL NÚMERO, enorme, con el punto que llegó volando */}
      <Plane pz={20} px={0.68} f={f} op={numFade}>
        <div style={{ position: "absolute", left: 150, top: 214, width: 700, ...rise(f, 1054, 22, 16) }}>
          <Kicker color={MD.white}>WHAT YOUR NOSE CAN CATCH</Kicker>
        </div>
        <div
          style={{
            position: "absolute", left: 150, top: 268,
            display: "flex", alignItems: "flex-end",
            transform: `scale(${lerp(1, 0.82, pushE).toFixed(3)})`,
            transformOrigin: "left bottom",
          }}
        >
          <div
            style={{
              fontFamily: F_SANS, fontWeight: 800, fontSize: 300, lineHeight: 0.86, letterSpacing: -12,
              color: MD.white, fontVariantNumeric: "tabular-nums",
              textShadow: "0 10px 50px rgba(0,0,0,0.92)",
              ...rise(f, 1046, 22, 24),
            }}
          >
            0
          </div>
          {/* EL PUNTO DECIMAL = la molécula que venía subiendo */}
          <div style={{ position: "relative", width: 74, height: 258 }}>
            <div
              style={{
                position: "absolute", left: 10, bottom: 16, width: 46, height: 46,
                transform: `translate(${lerp(560, 0, dpE).toFixed(1)}px, ${lerp(-352, 0, dpE).toFixed(1)}px) scale(${lerp(2.4, 1, dpE).toFixed(3)})`,
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - solid }}>
                <Molecule size={46} hot={1} spin={f * 0.6} />
              </div>
              <div
                style={{
                  position: "absolute", left: 0, top: 0, width: 46, height: 46, borderRadius: "50%",
                  background: MD.white, opacity: solid,
                  boxShadow: `0 0 ${(28 * (1 - solid * 0.6)).toFixed(1)}px ${rgba(MD.red, 0.6 * (1 - solid * 0.5))}`,
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontFamily: F_SANS, fontWeight: 800, fontSize: 300, lineHeight: 0.86, letterSpacing: -12,
              color: MD.white, fontVariantNumeric: "tabular-nums",
              textShadow: "0 10px 50px rgba(0,0,0,0.92)",
              ...rise(f, 1058, 22, 24),
            }}
          >
            5
          </div>
        </div>
        <div style={{ position: "absolute", left: 156, top: 548, ...rise(f, 1092, 26, 20) }}>
          <div
            style={{
              fontFamily: F_SANS, fontWeight: 800, fontSize: 46, letterSpacing: 9,
              color: MD.redHot, textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            }}
          >
            PARTS PER BILLION
          </div>
        </div>
        <div style={{ position: "absolute", left: 156, top: 630, width: 600, ...rise(f, 1120, 26, 22) }}>
          <Title size={62}>
            Your nose finds it <Em>first</Em>.
          </Title>
          <div style={{ marginTop: 20 }}>
            <TextBed w={580} pad={20}>
              <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 31, lineHeight: 1.3, color: rgba(MD.white, 0.9) }}>
                For this one molecule you beat most lab gear on the planet.
              </div>
            </TextBed>
          </div>
        </div>
      </Plane>

      {/* plano 4 · la moneda al lado de la mancha: material real que se lleva el cuadro */}
      <Plane pz={90} px={1.2} f={f}>
        <MatCard
          w={640} h={380}
          left={lerp(1090, 690, pushE)} top={lerp(560, 336, pushE)}
          rotY={lerp(-13, -3, cardE) + pushE * 2} rotZ={lerp(3, 0.6, cardE)}
          sc={lerp(0.86, 1, cardE) * lerp(1, 1.58, pushE)} op={cardE}
          sheenAt={1168} caption="COIN-SIZED PATCH. WHOLE KITCHEN."
        >
          <PhotoIn name="h41_quarter" pos="50% 52%" sc={1.12} d={0.12} />
          <ClipIn from={1112} dur={140} name="h41_quarter" startFrom={6} pos="50% 52%" sc={1.05} d={0.08} />
        </MatCard>
      </Plane>
    </AbsoluteFill>
  );
};

// ══ COSTURAS ════════════════════════════════════════════════════════════════════════════════
// FRONTERA A · ZOOM-THROUGH: la cámara entra EN la mancha de la tarjeta. La mancha crece hasta
// tapar el 100% ~6 frames — ahí se cambia de acto — y del otro lado ya estamos adentro.
const ZoomThrough: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const s = interpolate(p, [0, 0.55, 0.8, 1], [0.2, 4.8, 7.6, 12], { easing: Easing.bezier(0.4, 0, 0.9, 0.4) });
  const o = interpolate(p, [0, 0.3, 0.55, 0.84, 1], [0, 0.86, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", left: "58%", top: "46%",
          width: 540, height: 320, marginLeft: -270, marginTop: -160,
          borderRadius: "48% 52% 46% 54%",
          background: `radial-gradient(ellipse at 44% 40%, ${DR.filmLit} 0%, ${DR.film} 34%, #100F0D 72%, #080807 100%)`,
          transform: `scale(${s.toFixed(3)}) rotate(${(p * 9).toFixed(2)}deg)`,
          opacity: o,
        }}
      />
    </AbsoluteFill>
  );
};

// FRONTERA C · WIPE POR MATERIA: la marea anaeróbica sube y se lleva el panel.
const Tide: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const y = interpolate(p, [0, 1], [116, -128], { easing: Easing.bezier(0.42, 0, 0.3, 1) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", left: "-10%", right: "-10%", top: `${y.toFixed(2)}%`, height: "172%",
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba("#3A0D09", 0.55)} 3%, #1A0705 11%, #090302 44%, #1A0705 90%, rgba(0,0,0,0) 100%)`,
        }}
      >
        {/* la cresta: burbujas del frente, para que se lea como MATERIA y no como una cortina */}
        {Array.from({ length: 22 }, (_, i) => {
          const s = rnd(i * 4.9);
          const s2 = rnd(i * 11.3);
          const r = 12 + s * 62;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(s2 * 100).toFixed(2)}%`,
                top: `${(1.4 + s * 3.6).toFixed(2)}%`,
                width: r, height: r * (0.5 + s2 * 0.5), borderRadius: "50%",
                background: `radial-gradient(circle at 40% 34%, ${rgba(MD.redHot, 0.4)} 0%, ${rgba("#3A0D09", 0.7)} 60%, rgba(0,0,0,0) 100%)`,
                transform: `translateY(${(Math.sin(f / 9 + i) * 8).toFixed(1)}px)`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ══ EL MOVIMIENTO ═══════════════════════════════════════════════════════════════════════════
export const MovBiofilm: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END - 1);
  const t = clamp01(f / END);

  // envolventes por acto: sólo se mueven MIENTRAS algo tapa (nunca un fade a la vista)
  const a1 = 1 - clamp01((f - 240) / 8);
  const a2 = clamp01((f - 240) / 8) * (1 - clamp01((f - 512) / 8));
  const a3 = clamp01((f - 512) / 8) * (1 - clamp01((f - 824) / 8));
  const a4 = clamp01((f - 824) / 8);

  const ramp = clamp01(frame / 12);                     // rampa de entrada ≤15 frames
  const beat =
    clamp01((frame - (durationInFrames - 7)) / 3) * (1 - clamp01((frame - (durationInFrames - 3)) / 3));

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* LA ATMÓSFERA: se monta UNA vez y no se remonta nunca entre actos */}
      <Atmos
        tint={TINT(f)}
        keyFrom={lerp(0.2, 0.7, t)}
        intensity={lerp(0.9, 1.22, clamp01((f - A3) / (END - A3))) * ramp}
      />

      {/* UNA cámara global para todo el movimiento */}
      <AbsoluteFill style={{ transform: CAMERA(f), transformStyle: "preserve-3d", opacity: ramp }}>
        {f < 250 && <Act1 f={f} op={a1} />}
        {f >= 238 && f < 522 && <Act2 f={f} op={a2} />}
        {f >= 510 && f < 836 && <Act3 f={f} op={a3} />}
        {f >= 822 && f < 1094 && <Act4 f={f} op={a4} />}
        {f >= 1026 && <Act5 f={f} />}

        {/* plano 2 · el aire del cuarto, siempre vivo sobre todos los actos */}
        <Plane pz={-110} px={0.26} f={f} op={0.9} sc={1.24}>
          <Motes f={f} n={24} />
        </Plane>
        {/* plano 7 · suciedad de primer plano, fuera de foco */}
        <Plane pz={120} px={1.9} f={f} op={0.7}>
          <Motes f={f * 1.6} n={9} big />
        </Plane>
      </AbsoluteFill>

      {/* COSTURAS */}
      <ZoomThrough f={f} at={230} dur={22} />
      <Occluder at={508} dur={18} color={DR.film} angle={-7} />
      <Tide f={f} at={814} dur={26} />

      {/* CORTE EN EL BEAT hacia el b-roll del bicarbonato: golpe de luz de mesada, sin fade */}
      {beat > 0 && <AbsoluteFill style={{ background: rgba(MD.white, 0.16 * beat) }} />}
    </AbsoluteFill>
  );
};
