// MovDryTrap.tsx — MOVIMIENTO 6 del video `mddrain` (canal Mike Dalton, EN).
// 1383 frames = 46,1 s @30fps.
//
// EL CASO DEL TRAPO LIMPIO: no hay película y sin embargo huele. Lo único que separa tu casa de
// la cloaca son dos pulgadas de agua sentadas en el codo en U. En un baño de visitas, una rejilla
// de sótano o una boca de lavarropas que no se usa, esa agua se evapora en dos a cuatro semanas —
// y el caño queda siendo una PUERTA ABIERTA. Se arregla con una taza de agua una vez por mes; y en
// el desagüe que de verdad nunca usás, la taza MÁS una cucharada de aceite encima.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-228     EL TRAPO LIMPIO   cámara: z≈-30, casi frontal, hereda el encuadre del b-roll.
//                                      luz:    linterna dura y baja, fría, encierro de mueble.
//                                      materia:CLIP h59 a sangre → se contrae en TARJETA.
//                                      exitTo: la tarjeta h63 ocupa el centro y se come el cuadro.
// acto 2  f228-486   EL SELLO          cámara: sigue empujando (z≈+35), sin volver a 0.
//                                      luz:    la misma linterna, ahora rebotando en el panel.
//                                      materia:PANEL de vidrio con cama h64_blur + VENTANA-CORTE
//                                              (TrapSeal) + tarjeta CLIP h64 al lado.
//                                      exitTo: la tarjeta h60 (foto) ya montada en el slot derecho.
// acto 3  f486-780   LA EVAPORACIÓN    cámara: hereda y sigue, deriva a la izquierda.
//                                      luz:    fría, empieza a calentarse por abajo (rojo lejano).
//                                      materia:el NIVEL baja continuo + riel de semanas + abanico
//                                              3D de 3 desagües (h60 foto, h62 CLIP, h59 foto).
//                                      exitTo: sifón SECO, la boca vacía, la tarjeta h60 vuela.
// acto 4  f780-1020  LA PUERTA ABIERTA cámara: hereda; el panel se hunde y la boca crece.
//                                      luz:    ROJA de alerta (la Atmos vira, no salta).
//                                      materia:la boca del sifón ES la puerta; adentro CLIP h65.
//                                      exitTo: gas lleno, umbral rojo, cae la columna de agua.
// acto 5  f1020-1230 LA TAZA           cámara: hereda; se abre un poco para la tarjeta grande.
//                                      luz:    CÁLIDA de resuelto (rojo → warm).
//                                      materia:CLIP h60 (la taza en la rejilla) + el sello repuesto
//                                              en el panel chico, dockeado a la derecha.
//                                      exitTo: sello lleno, quieto, listo para el corte en el beat.
// acto 6  f1230-1383 EL ACEITE         cámara: hereda, empuje final y se cierra a negro.
//                                      luz:    cálida que se apaga; queda sólo el oro.
//                                      materia:CLIP h61 (la cucharada de aceite) protagonista +
//                                              la película dorada flotando sobre el sello.
//                                      exitTo: NEGRO con el aceite dorado como última materia viva
//                                              → entrega al overlay CtaCard.
//
// ── COSTURAS (una distinta por frontera, ⛔ nunca un fade) ───────────────────────────────────
// 1→2  f196-232   ZOOM-THROUGH  la cámara se mete DENTRO de la tarjeta h63 hasta atravesarla;
//                               detrás ya está el panel del sello, montado mientras estaba tapado.
// 2→3  f470-500   MATCH-MOVE    no hay corte: la tarjeta h60 sigue su trayecto del slot al abanico
//                               y la cámara la acompaña mientras el nivel empieza a caer.
// 3→4  f764-834   MATCH-SHAPE   la ventana-corte del sifón (500×420) se estira y se vuelve la
//                               PUERTA (430×716, arco arriba). Es el MISMO elemento morfando.
// 4→5  f1008-1044 OCLUSIÓN      la columna de agua cae, tapa el 100% ~10 frames, y al despejar el
//                               sello está repuesto y la puerta volvió a ser corte.
// 5→6  f1230      CORTE EN EL BEAT  corte seco con destello dorado de 3 frames y snap de escala.
//
// ── MATERIAL REAL DENTRO DE VIDRIO ──────────────────────────────────────────────────────────
// h59_hoseloop   CLIP f0-142    (tarjeta hero acto 1) · foto en el abanico del acto 3
// h63_listen     CLIP f104-234  (tarjeta hero acto 1, la que se atraviesa)
// h64_strap      CLIP f234-364  (tarjeta del acto 2) · su _blur es la cama del panel y del cuarto
// h62_standpipe  CLIP f548-678  (carta central del abanico del acto 3)
// h65_roofvent   CLIP f828-958  (ventana dentro de la puerta, acto 4) · su _blur, el fondo
// h60_floordrain FOTO f350-780  (slot derecho → abanico) · CLIP f1028-1158 (hero acto 5)
// h61_oilspoon   CLIP f1230-1362 (tarjeta hero acto 6, el último material vivo)
//
// ⛔ Todo es función pura de useCurrentFrame() (rnd()), sin backdrop-filter, sin blur grande sobre
//    imagen full-screen (se usan los `_blur.jpg` horneados), sin Easing.quint.
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
  cam,
  light,
  Atmos,
  Sheen,
  glassStyle,
  Kicker,
  Title,
  Em,
  TextBed,
} from "../mdmold/Stage";
import { TrapSeal, Foam, DR } from "./Pipe";

const A2 = 228, A3 = 486, A4 = 780, A5 = 1020, A6 = 1230;

const GOLD = "#E8C27A";
const GOLD_HI = "#F6E0AE";

const FILL: React.CSSProperties = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };
const IMGSRC = (b: string, blur?: boolean) => staticFile(`img/${b}${blur ? "_blur" : ""}.jpg`);
const VIDSRC = (b: string) => staticFile(`broll/${b}.mp4`);

const E_OUT = Easing.bezier(0.16, 0.84, 0.24, 1);
const E_IO = Easing.bezier(0.42, 0, 0.22, 1);
const E_IN = Easing.bezier(0.6, 0, 0.9, 0.4);

// rampa 0→1 con easing; el inputRange nunca puede dejar de ser creciente (mata el chunk)
const ramp = (f: number, a: number, len: number, easing = E_OUT) =>
  interpolate(f, [a, Math.max(a + 1, a + len)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// ── EL CLIP REAL ────────────────────────────────────────────────────────────────────────────
// Va SIEMPRE dentro de una <Sequence>: si no, pasado el frame 121 el clip se acabó y el vidrio
// queda negro. El clip mide 121 frames @24fps → startFrom + ceil(len*24/30) + 2 ≤ 121.
const RealClip: React.FC<{ base: string; from: number; len: number; startFrom?: number }> = ({
  base,
  from,
  len,
  startFrom = 0,
}) => (
  <Sequence from={from} durationInFrames={len} layout="none">
    <OffthreadVideo
      muted
      src={VIDSRC(base)}
      startFrom={startFrom}
      style={{ ...FILL, width: "100%", height: "100%", objectFit: "cover" }}
    />
  </Sequence>
);

// ── LA TARJETA DE MATERIAL REAL ─────────────────────────────────────────────────────────────
// Marco de vidrio + sombra de contacto que ATERRIZA + cama de FOTO real debajo del clip (así el
// vidrio nunca se queda vacío cuando la Sequence se termina) + grade del canal + bisel + rim.
// ⛔ Ninguna tarjeta de este movimiento es forma+texto: todas llevan materia real adentro.
const MediaCard: React.FC<{
  w: number;
  h: number;
  base: string;
  clip?: { from: number; len: number; startFrom?: number };
  radius?: number;
  lit?: number;
  dark?: number;
  red?: number;
  kb?: number;
  sheenAt?: number;
  chip?: string;
  chipColor?: string;
}> = ({
  w,
  h,
  base,
  clip,
  radius = 14,
  lit = 1,
  dark = 0.12,
  red = 0.06,
  kb = 0.09,
  sheenAt,
  chip,
  chipColor = MD.white,
}) => {
  const frame = useCurrentFrame();
  const s = 1.05 + kb * clamp01(frame / 1383);
  const drift = Math.sin(frame / 96) * 0.6;
  return (
    <div style={{ position: "relative", width: w, height: h, transformStyle: "preserve-3d" }}>
      {/* sombra de contacto: el objeto aterriza, no está pegado con cinta */}
      <div
        style={{
          position: "absolute",
          left: "-7%",
          right: "-7%",
          bottom: -Math.round(h * 0.075),
          height: Math.round(h * 0.19),
          background:
            "radial-gradient(50% 50% at 50% 45%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.34) 46%, rgba(0,0,0,0) 74%)",
        }}
      />
      <div style={{ ...FILL, overflow: "hidden", ...glassStyle({ radius, lit }) }}>
        {/* cama de foto real: si el clip se termina, abajo sigue habiendo materia */}
        <Img
          src={IMGSRC(base)}
          style={{
            ...FILL,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${s.toFixed(4)}) translate(${drift.toFixed(2)}%, 0)`,
          }}
        />
        {clip ? <RealClip base={base} from={clip.from} len={clip.len} startFrom={clip.startFrom} /> : null}
        {/* grade del canal: negro levantado + viraje rojo muy leve */}
        <div style={{ ...FILL, background: `rgba(228,50,42,${red})`, mixBlendMode: "soft-light" }} />
        <div style={{ ...FILL, background: `rgba(0,0,0,${dark})` }} />
        <div
          style={{ ...FILL, background: "radial-gradient(88% 76% at 50% 42%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.56) 100%)" }}
        />
        {/* key + rim: la linterna pega arriba-izquierda, el canto derecho devuelve */}
        <div
          style={{
            ...FILL,
            background:
              `linear-gradient(128deg, ${rgba(MD.cold, 0.16 * lit)} 0%, rgba(0,0,0,0) 42%), ` +
              `linear-gradient(300deg, ${rgba(MD.white, 0.1 * lit)} 0%, rgba(0,0,0,0) 30%)`,
          }}
        />
        <div
          style={{
            ...FILL,
            borderRadius: radius,
            boxShadow:
              `inset 0 1px 0 ${rgba(MD.white, 0.34 * lit)}, ` +
              `inset 0 0 0 1px ${rgba(MD.white, 0.1 * lit)}, ` +
              `inset 0 -2px 14px rgba(0,0,0,0.5)`,
          }}
        />
        {sheenAt === undefined ? null : <Sheen at={sheenAt} dur={30} angle={16} />}
        {chip ? (
          <div
            style={{
              position: "absolute",
              left: 18,
              bottom: 16,
              padding: "8px 16px",
              borderRadius: 8,
              background: "linear-gradient(180deg, rgba(6,6,8,0.88) 0%, rgba(6,6,8,0.66) 100%)",
              boxShadow: "0 10px 26px rgba(0,0,0,0.6)",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: chipColor,
              whiteSpace: "nowrap",
            }}
          >
            {chip}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ── LA COLUMNA DE AGUA (costura 4→5, OCLUSIÓN vertical) ─────────────────────────────────────
// Misma lógica que el <Occluder> del Stage, pero vertical y con materia de agua: la banda mide
// 190% de la PANTALLA y baja en coordenadas de pantalla, así que hay ~10 frames de cobertura
// TOTAL. Esos frames tapados son donde el sifón seco vuelve a estar lleno.
const WaterColumn: React.FC<{ at: number; dur?: number }> = ({ at, dur = 36 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const H = 190;
  const top = interpolate(p, [0, 1], [-(H + 12), 112], { easing: Easing.bezier(0.34, 0, 0.2, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "-12%",
          width: "124%",
          top: `${top.toFixed(2)}%`,
          height: `${H}%`,
          background:
            `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(DR.water, 0.9)} 3%, ${DR.water} 18%, ` +
            `#23383E 62%, ${rgba(DR.waterLit, 0.92)} 95%, ${rgba(MD.white, 0.85)} 100%)`,
          boxShadow: `0 0 140px 50px ${rgba(DR.water, 0.6)}`,
        }}
      >
        {/* estrías: el agua tiene fibra, no es un rectángulo */}
        {Array.from({ length: 22 }, (_, i) => {
          const s = rnd(i * 5.3);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(s * 100).toFixed(2)}%`,
                top: `${(rnd(i * 2.1) * 20).toFixed(1)}%`,
                width: 2 + s * 7,
                height: "86%",
                background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.16 + s * 0.2)} 40%, rgba(255,255,255,0) 100%)`,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -18,
            height: 46,
            background: `linear-gradient(180deg, ${rgba(MD.white, 0.9)} 0%, rgba(255,255,255,0) 100%)`,
            filter: "blur(6px)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── EL RIEL DE SEMANAS ──────────────────────────────────────────────────────────────────────
// El calendario NO salta de semana en semana: la cinta se desliza continua por delante de un
// cabezal fijo y el contador de días corre número a número.
const WeekRail: React.FC<{ weeks: number; op: number }> = ({ weeks, op }) => {
  const frame = useCurrentFrame();
  const SP = 106;
  const day = Math.round(clamp01(weeks / 4) * 28);
  const dayTxt = day < 10 ? `DAY 0${day}` : `DAY ${day}`;
  return (
    <div
      style={{
        position: "relative",
        width: 210,
        height: 520,
        opacity: op,
        overflow: "hidden",
        ...glassStyle({ radius: 12, lit: 0.7 }),
      }}
    >
      <div
        style={{
          ...FILL,
          background: "linear-gradient(180deg, rgba(6,7,9,0.88) 0%, rgba(6,7,9,0.58) 50%, rgba(6,7,9,0.88) 100%)",
        }}
      />
      {Array.from({ length: 5 }, (_, i) => {
        const y = 250 + (i - weeks) * SP;
        const near = clamp01(1 - Math.abs(i - weeks) / 1.15);
        if (y < -90 || y > 610) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: y - 28,
              textAlign: "center",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 30 + near * 20,
              letterSpacing: 2.6,
              color: rgba(i === 0 ? MD.white : MD.redHot, 0.16 + near * 0.82),
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            }}
          >
            {i === 0 ? "DAY 0" : `WEEK ${i}`}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          top: 250,
          height: 2,
          background: rgba(MD.redHot, 0.9),
          boxShadow: `0 0 22px ${rgba(MD.redHot, 0.8)}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 20,
          textAlign: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: -1,
          color: MD.white,
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          opacity: 0.88 + Math.sin(frame / 14) * 0.1,
        }}
      >
        {dayTxt}
      </div>
    </div>
  );
};

// ── POLVO ───────────────────────────────────────────────────────────────────────────────────
const Motes: React.FC<{ n: number; seed: number; tint: string; size: number; speed: number; op: number }> = ({
  n,
  seed,
  tint,
  size,
  speed,
  op,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {Array.from({ length: n }, (_, i) => {
        const s = rnd(i * 3.3 + seed);
        const s2 = rnd(i * 8.9 + seed);
        const t = ((frame * speed) / (900 + s * 700) + s2) % 1;
        const r = size * (0.4 + s2 * 1.2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(s * 100).toFixed(2)}%`,
              top: `${((1 - t) * 106 - 3).toFixed(2)}%`,
              width: r,
              height: r,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(tint, 0.85)} 0%, rgba(255,255,255,0) 72%)`,
              transform: `translateX(${(Math.sin(frame / (46 + s * 60) + i) * 16).toFixed(2)}px)`,
              opacity: 0.18 + Math.sin(t * Math.PI) * 0.7,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const MovDryTrap: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;
  const END = Math.max(A6 + 90, D);

  // ── UNA cámara para los seis actos. Nunca vuelve a 0. ─────────────────────────────────────
  const c = cam(frame, { z0: -30, z1: 170, panX: -34, panY: -22, ry: -4, rx: 1.4, dur: END });

  // parallax global: cada plano lo multiplica por su profundidad
  const px = Math.sin(frame / 97) * 26 + Math.sin(frame / 41) * 8;
  const py = Math.cos(frame / 113) * 15 + Math.sin(frame / 57) * 5;
  const plane = (depth: number, x = 0, y = 0, extra = ""): React.CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    transform:
      `translate(-50%,-50%) translate3d(${(x + px * depth).toFixed(2)}px, ${(y + py * depth).toFixed(2)}px, ` +
      `${(depth * 60).toFixed(1)}px) ${extra}`,
    transformStyle: "preserve-3d",
  });

  // ── LA LUZ: linterna fría y dura → roja de alerta → cálida de resuelto. Nunca salta. ──────
  const tCR = clamp01((frame - 700) / 220); // 700→920  fría → roja
  const tRW = clamp01((frame - 990) / 210); // 990→1200 roja → cálida
  const tint = frame < 990 ? light(tCR, "cold", "red") : light(tRW, "red", "warm");
  const keyFrom = interpolate(frame, [0, A4, END], [0.2, 0.5, 0.74], { extrapolateRight: "clamp" });
  const atmosI = interpolate(frame, [0, A2, A3, A4 + 120, A5 + 120, END], [0.72, 0.8, 0.86, 1.05, 0.96, 0.62], {
    extrapolateRight: "clamp",
  });

  // ── EL NIVEL DEL SELLO: continuo, sin un solo salto ───────────────────────────────────────
  const level =
    frame < 500
      ? 1
      : frame < 765
      ? interpolate(frame, [500, 765], [1, 0], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.36, 0.02, 0.62, 1),
        })
      : frame < 1016
      ? 0
      : frame < 1064
      ? interpolate(frame, [1016, 1064], [0, 1], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.18, 0.86, 0.28, 1),
        })
      : 1;

  const weeks = interpolate(frame, [500, 765], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const railOp = interpolate(frame, [496, 526, 748, 776], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── BOCA → PUERTA → BOCA (costuras 3→4 MATCH-SHAPE y 4→5 OCLUSIÓN) ────────────────────────
  const m =
    frame < 764
      ? 0
      : frame < 834
      ? ramp(frame, 764, 70, E_IO)
      : frame < 1004
      ? 1
      : frame < 1044
      ? 1 - ramp(frame, 1004, 40, E_IO)
      : 0;
  const dock = ramp(frame, 1030, 74, E_OUT);
  const cut6 = frame >= A6;

  const baseX = lerp(-352, 0, m);
  const baseY = lerp(14, -16, m);
  const baseW = lerp(500, 430, m);
  const baseH = lerp(420, 716, m);
  const recX = cut6 ? 556 : lerp(baseX, 520, dock);
  const recY = cut6 ? 262 : lerp(baseY, 44, dock);
  const recW = cut6 ? 296 : lerp(baseW, 330, dock);
  const recH = cut6 ? 208 : lerp(baseH, 268, dock);
  const recRad = lerp(18, 214, m);
  const sealW = cut6 ? 244 : lerp(430, 268, dock);
  const sealH = cut6 ? 172 : lerp(300, 190, dock);

  // el gas: sube cuando el sello se fue, muere cuando cae el agua
  const gas = interpolate(frame, [778, 862, 1004, 1038], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── ACTO 1 ────────────────────────────────────────────────────────────────────────────────
  const openT = ramp(frame, 58, 42, E_IO); // a sangre → tarjeta
  const exitA = ramp(frame, 116, 26, E_IN);
  // arranca MÁS GRANDE que la pantalla: con la cámara en z=-30 un 1920 exacto dejaría filo negro
  const cardAW = lerp(2180, 1180, openT);
  const cardAH = lerp(1226, 664, openT);
  const inB = ramp(frame, 104, 36);
  const heroB = ramp(frame, 150, 42, E_IO);
  const dive = ramp(frame, 196, 36, E_IN); // ZOOM-THROUGH

  // ── ACTO 2 ────────────────────────────────────────────────────────────────────────────────
  const panIn = ramp(frame, 206, 46, E_OUT);
  const panOut = ramp(frame, 770, 78, E_IO);
  const inC = ramp(frame, 234, 32);
  const sinkC = ramp(frame, 352, 28, E_IO); // la tarjeta C se hunde DETRÁS de la D
  const inD = ramp(frame, 350, 40);
  const toFan = ramp(frame, 486, 76, E_IO); // MATCH-MOVE: la D viaja al abanico

  // ── ACTO 3 ────────────────────────────────────────────────────────────────────────────────
  const inBack = ramp(frame, 512, 44);
  const inMid = ramp(frame, 544, 34);
  const outMid = ramp(frame, 652, 32, E_IN);
  const outBack = ramp(frame, 700, 48, E_IN);
  const flyFront = ramp(frame, 720, 60, E_IN); // la delantera pasa por delante de la cámara

  // ── ACTO 4 ────────────────────────────────────────────────────────────────────────────────
  const doorIn = ramp(frame, 786, 54);
  const ventIn = ramp(frame, 824, 34);
  const ventBack = ramp(frame, 940, 54, E_IO);

  // ── ACTO 5 ────────────────────────────────────────────────────────────────────────────────
  const inHero5 = ramp(frame, 1022, 34, E_OUT);
  const out5 = ramp(frame, 1150, 48, E_IO);
  const splash = interpolate(frame, [1024, 1052, 1092, 1122], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── ACTO 6 ────────────────────────────────────────────────────────────────────────────────
  const snap6 = ramp(frame, A6, 16, E_OUT);
  const oilFilm = ramp(frame, 1248, 62, E_OUT);
  const endT = ramp(frame, 1326, 50, E_IO);
  const flash6 = interpolate(frame, [A6, A6 + 4], [0.34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const txt = (a: number, b: number) =>
    interpolate(frame, [a, a + 16, Math.max(a + 17, b - 16), Math.max(a + 18, b)], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const t1 = txt(34, 200);
  const t2 = txt(252, 462);
  const t3 = txt(512, 758);
  const t4 = txt(852, 1004);
  const t5 = txt(1062, 1216);
  const t6 = txt(1244, 1374);

  return (
    <AbsoluteFill>
      {/* LA ATMÓSFERA — se monta UNA vez y NUNCA se remonta entre actos */}
      <Atmos tint={tint} keyFrom={keyFrom} intensity={atmosI} />

      {/* ── PLANO 1 (el más lejano): la pared del cuarto, foto real ya horneada en blur ───── */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={IMGSRC("mddrain_h64_strap", true)}
          style={{
            ...FILL,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.3) saturate(0.5)",
            opacity: (1 - ramp(frame, 1016, 18)) * 0.9,
            transform: `scale(${(1.16 + px * 0.0016).toFixed(4)}) translate(${(px * 0.05).toFixed(2)}px, ${(py * 0.05).toFixed(2)}px)`,
          }}
        />
        <Img
          src={IMGSRC("mddrain_h60_floordrain", true)}
          style={{
            ...FILL,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.34) saturate(0.6)",
            opacity: ramp(frame, 1018, 16) * 0.9,
            transform: `scale(${(1.18 - px * 0.0014).toFixed(4)}) translate(${(px * -0.05).toFixed(2)}px, ${(py * 0.05).toFixed(2)}px)`,
          }}
        />
        <AbsoluteFill
          style={{ background: "radial-gradient(80% 66% at 50% 46%, rgba(0,0,0,0.34) 30%, rgba(0,0,0,0.86) 100%)" }}
        />
      </AbsoluteFill>

      {/* ── PLANO 2: el haz de la linterna, duro y bajo; evoluciona con la luz ───────────── */}
      <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: `${(-16 + keyFrom * 26).toFixed(1)}%`,
            bottom: "-26%",
            width: "86%",
            height: "128%",
            background: `conic-gradient(from ${(150 + Math.sin(frame / 130) * 4).toFixed(2)}deg at 12% 96%, rgba(0,0,0,0) 0deg, ${rgba(tint, 0.16)} 14deg, ${rgba(tint, 0.03)} 30deg, rgba(0,0,0,0) 44deg)`,
            opacity: interpolate(frame, [0, A4, END], [1, 0.62, 0.34], { extrapolateRight: "clamp" }),
          }}
        />
      </AbsoluteFill>

      {/* ── PLANO 3: polvo lejano flotando en el haz ─────────────────────────────────────── */}
      <Motes n={26} seed={3} tint={tint} size={5} speed={0.55} op={0.4} />

      {/* ═══════════════════ LA ESCENA (una sola cámara para todo) ═══════════════════════ */}
      <AbsoluteFill style={{ transform: c.transform, transformStyle: "preserve-3d" }}>
        {/* ── PLANO 4: EL PANEL DEL SELLO (actos 2-3): vidrio con cama de foto real ─────── */}
        {frame > 190 && frame < 852 ? (
          <div
            style={{
              ...plane(
                -0.18,
                0,
                0,
                `scale(${(lerp(0.72, 1, panIn) * lerp(1, 0.6, panOut)).toFixed(3)}) translateZ(${(lerp(-680, 0, panIn) - panOut * 560).toFixed(1)}px) rotateY(${(-2 + px * 0.02).toFixed(2)}deg)`,
              ),
              width: 1300,
              height: 712,
              opacity: panIn * (1 - panOut),
            }}
          >
            <div style={{ ...FILL, overflow: "hidden", ...glassStyle({ radius: 20, lit: 0.9 }) }}>
              <Img
                src={IMGSRC("mddrain_h64_strap", true)}
                style={{
                  ...FILL,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.42) saturate(0.62)",
                  transform: `scale(${(1.1 + panIn * 0.05).toFixed(4)})`,
                }}
              />
              <div
                style={{
                  ...FILL,
                  background:
                    "linear-gradient(160deg, rgba(8,9,11,0.42) 0%, rgba(8,9,11,0.8) 62%, rgba(8,9,11,0.92) 100%)",
                }}
              />
              <div
                style={{
                  ...FILL,
                  borderRadius: 20,
                  boxShadow: `inset 0 1px 0 ${rgba(MD.white, 0.3)}, inset 0 0 90px rgba(0,0,0,0.7)`,
                }}
              />
              <Sheen at={250} dur={34} angle={14} />
              <Sheen at={604} dur={40} angle={14} />
              <div style={{ position: "absolute", left: 34, top: 26 }}>
                <Kicker color={rgba(MD.white, 0.5)}>Under the sink · cutaway</Kicker>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── PLANO 5a: LA VENTANA-CORTE que se vuelve PUERTA y vuelve a ser corte ──────── */}
        {frame > 214 ? (
          <div
            style={{
              ...plane(0.06, recX, recY, `rotateY(${(m * 1.5 - 1.2).toFixed(2)}deg)`),
              width: recW,
              height: recH,
              opacity: interpolate(frame, [214, 244], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "-8%",
                right: "-8%",
                bottom: -Math.round(recH * 0.07),
                height: Math.round(recH * 0.18),
                background: "radial-gradient(50% 50% at 50% 44%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 74%)",
              }}
            />
            {/* la jamba: marco biselado, más grueso cuando es puerta */}
            <div
              style={{
                ...FILL,
                borderRadius: `${recRad}px ${recRad}px 10px 10px`,
                background: `linear-gradient(150deg, ${DR.pvc} 0%, ${DR.pvcDark} 44%, #6E6B64 100%)`,
                boxShadow: `0 30px 70px rgba(0,0,0,0.8), inset 0 1px 0 ${rgba(MD.white, 0.5)}`,
                padding: lerp(14, 22, m),
              }}
            >
              {/* el interior hundido */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: `${(recRad * 0.86).toFixed(1)}px ${(recRad * 0.86).toFixed(1)}px 4px 4px`,
                  overflow: "hidden",
                  background: "#07080A",
                  boxShadow: `inset 0 6px 26px rgba(0,0,0,0.95), inset 0 0 0 2px ${rgba(MD.white, 0.14)}`,
                }}
              >
                {/* interior A · el diagrama del sifón con el agua adentro */}
                <div
                  style={{
                    ...FILL,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    opacity: clamp01(1 - m / 0.45),
                  }}
                >
                  <div style={{ position: "relative", paddingBottom: lerp(30, 18, dock) }}>
                    <TrapSeal w={sealW} h={sealH} level={level} gas={0} />
                    {/* el calibre: DOS PULGADAS, lo único que te separa de la cloaca */}
                    <div
                      style={{
                        position: "absolute",
                        left: -58,
                        bottom: 0,
                        width: 44,
                        height: Math.max(2, sealH * 0.42 * clamp01(level)),
                        borderTop: `2px solid ${rgba(MD.redHot, 0.95)}`,
                        borderBottom: `2px solid ${rgba(MD.redHot, 0.95)}`,
                        borderLeft: `2px solid ${rgba(MD.redHot, 0.7)}`,
                        opacity:
                          clamp01(level) *
                          (1 - dock) *
                          interpolate(frame, [292, 322], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                          }),
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: -76,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontFamily: "Inter, system-ui, sans-serif",
                          fontWeight: 800,
                          fontSize: 32,
                          letterSpacing: 1,
                          color: MD.redHot,
                          textShadow: "0 4px 18px rgba(0,0,0,0.95)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        2 IN
                      </div>
                    </div>
                    {/* la película dorada del aceite, flotando SOBRE el agua (acto 6) */}
                    {oilFilm > 0.01 ? (
                      <div
                        style={{
                          position: "absolute",
                          left: "9%",
                          right: "9%",
                          bottom: lerp(30, 18, dock) + sealH * 0.42 - 6,
                          height: 10,
                          borderRadius: 6,
                          background: `linear-gradient(90deg, ${rgba(GOLD, 0.5)} 0%, ${GOLD_HI} ${(34 + Math.sin(frame / 26) * 16).toFixed(1)}%, ${rgba(GOLD, 0.55)} 100%)`,
                          boxShadow: `0 0 30px ${rgba(GOLD, 0.85)}, 0 0 70px ${rgba(GOLD, 0.4)}`,
                          opacity: oilFilm,
                        }}
                      />
                    ) : null}
                  </div>
                </div>

                {/* interior B · LA PUERTA: el caño abierto a la cloaca */}
                <div style={{ ...FILL, opacity: clamp01((m - 0.3) / 0.5) }}>
                  <Img
                    src={IMGSRC("mddrain_h65_roofvent", true)}
                    style={{
                      ...FILL,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.3) saturate(0.5)",
                      transform: `scale(${(1.2 + doorIn * 0.08).toFixed(3)})`,
                    }}
                  />
                  <div
                    style={{
                      ...FILL,
                      background: `linear-gradient(0deg, ${rgba(MD.red, 0.5)} 0%, ${rgba(MD.red, 0.14)} 46%, rgba(0,0,0,0.7) 100%)`,
                    }}
                  />
                  {/* la ventana de MATERIAL REAL dentro de la puerta */}
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "52%",
                      width: 300,
                      height: 400,
                      transform: `translate(-50%,-50%) scale(${(lerp(0.5, 1, ventIn) * lerp(1, 0.62, ventBack)).toFixed(3)}) translateY(${(ventBack * 40).toFixed(1)}px)`,
                      opacity: ventIn * (1 - ventBack * 0.55),
                    }}
                  >
                    <MediaCard
                      w={300}
                      h={400}
                      base="mddrain_h65_roofvent"
                      clip={{ from: 828, len: 130, startFrom: 6 }}
                      radius={10}
                      lit={0.6}
                      dark={0.3}
                      red={0.16}
                      kb={0.06}
                      chip="THE VENT STACK"
                      chipColor={MD.redHot}
                    />
                  </div>
                  {/* el gas que sube por la puerta */}
                  {Array.from({ length: 14 }, (_, i) => {
                    const s = rnd(i * 6.3);
                    const p = (frame / (86 + s * 70) + s) % 1;
                    return (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          left: `${(6 + s * 84).toFixed(1)}%`,
                          bottom: `${(p * 108 - 8).toFixed(1)}%`,
                          width: 10 + s * 34,
                          height: 90 + s * 150,
                          borderRadius: "50%",
                          background: `radial-gradient(circle, ${rgba(MD.redHot, 0.3 * gas)} 0%, rgba(0,0,0,0) 70%)`,
                          opacity: (1 - p) * gas,
                        }}
                      />
                    );
                  })}
                  {/* el umbral: la línea que se cruza */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 6,
                      background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${MD.redHot} 20%, ${MD.redHot} 80%, rgba(0,0,0,0) 100%)`,
                      boxShadow: `0 0 40px ${rgba(MD.redHot, 0.9)}`,
                      opacity: m,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* el derrame rojo en el piso delante de la puerta: la puerta EXISTE en el cuarto */}
        {m > 0.2 ? (
          <div
            style={{
              ...plane(-0.05, 0, 470),
              width: 1200,
              height: 300,
              background: `radial-gradient(60% 100% at 50% 0%, ${rgba(MD.red, 0.34 * m * gas)} 0%, rgba(0,0,0,0) 72%)`,
            }}
          />
        ) : null}

        {/* ── PLANO 5b: ABANICO 3D DE LOS DESAGÜES QUE NUNCA USÁS (acto 3) ──────────────── */}
        {frame > 500 && frame < 762 ? (
          <div
            style={{
              ...plane(
                0.32,
                300 - outBack * 260,
                -70 - outBack * 150,
                `scale(${(lerp(0.5, 0.78, inBack) * lerp(1, 0.72, outBack)).toFixed(3)}) rotateY(9deg) rotateZ(-6deg)`,
              ),
              opacity: inBack * (1 - outBack),
            }}
          >
            <MediaCard
              w={430}
              h={318}
              base="mddrain_h59_hoseloop"
              radius={12}
              lit={0.72}
              dark={0.26}
              kb={0.05}
              chip="DISHWASHER LINE"
            />
          </div>
        ) : null}

        {frame > 540 && frame < 690 ? (
          <div
            style={{
              ...plane(
                0.52,
                lerp(660, 430, inMid) + outMid * 520,
                lerp(60, 12, inMid) + outMid * 90,
                `scale(${(lerp(0.72, 0.9, inMid) * lerp(1, 0.82, outMid)).toFixed(3)}) rotateY(3deg) rotateZ(-2deg)`,
              ),
              opacity: inMid * (1 - outMid),
            }}
          >
            <MediaCard
              w={430}
              h={318}
              base="mddrain_h62_standpipe"
              clip={{ from: 548, len: 130, startFrom: 4 }}
              radius={12}
              lit={0.86}
              dark={0.16}
              kb={0.05}
              sheenAt={576}
              chip="LAUNDRY STANDPIPE"
            />
          </div>
        ) : null}

        {/* ── PLANO 5c: LA TARJETA QUE CRUZA LA FRONTERA — h60, slot → frente del abanico ── */}
        {frame > 344 && frame < 784 ? (
          <div
            style={{
              ...plane(
                0.78,
                lerp(318, 560, toFan),
                lerp(16, 96, toFan),
                `scale(${(lerp(0.82, 1, inD) * lerp(1, 1.02, toFan) * lerp(1, 1.6, flyFront)).toFixed(3)}) translateZ(${(flyFront * 520).toFixed(1)}px) rotateY(${lerp(6, 4, inD).toFixed(2)}deg) rotateZ(${lerp(3, 4, toFan).toFixed(2)}deg)`,
              ),
              opacity: inD * (1 - clamp01((flyFront - 0.62) / 0.38)),
            }}
          >
            <MediaCard
              w={lerp(588, 430, toFan)}
              h={lerp(452, 318, toFan)}
              base="mddrain_h60_floordrain"
              radius={13}
              lit={0.95}
              dark={0.14}
              kb={0.07}
              sheenAt={402}
              chip="BASEMENT FLOOR DRAIN"
            />
          </div>
        ) : null}

        {/* ── PLANO 5d: LA TARJETA DEL SIFÓN REAL (acto 2) — se hunde DETRÁS de la h60 ──── */}
        {frame > 228 && frame < 384 ? (
          <div
            style={{
              ...plane(
                0.66,
                lerp(520, 318, inC),
                lerp(70, 16, inC),
                `scale(${(lerp(0.8, 1, inC) * lerp(1, 0.86, sinkC)).toFixed(3)}) translateZ(${(sinkC * -190).toFixed(1)}px) rotateY(7deg) rotateZ(2deg)`,
              ),
              opacity: inC * (1 - sinkC),
            }}
          >
            <MediaCard
              w={560}
              h={430}
              base="mddrain_h64_strap"
              clip={{ from: 234, len: 130, startFrom: 8 }}
              radius={13}
              lit={1}
              dark={0.12}
              kb={0.06}
              sheenAt={268}
              chip="THE S-TRAP"
            />
          </div>
        ) : null}

        {/* ── PLANO 5e: EL RIEL DE SEMANAS (acto 3) ─────────────────────────────────────── */}
        {railOp > 0.01 ? (
          <div style={{ ...plane(0.2, 96, -8, "rotateY(-6deg)") }}>
            <WeekRail weeks={weeks} op={railOp} />
          </div>
        ) : null}

        {/* ── ACTO 1 · tarjeta B (h63): la que la cámara ATRAVIESA (costura 1→2) ────────── */}
        {frame > 100 && frame < 236 ? (
          <div
            style={{
              ...plane(
                0.9,
                lerp(1180, 150, inB) * (1 - heroB) - heroB * 30,
                lerp(150, 24, inB) * (1 - heroB) + heroB * 8,
                `scale(${(lerp(0.6, 0.92, inB) * lerp(1, 1.06, heroB) * lerp(1, 1.9, dive)).toFixed(3)}) translateZ(${(dive * 760).toFixed(1)}px) rotateY(${lerp(-9, -1, heroB).toFixed(2)}deg)`,
              ),
              opacity: 1 - clamp01((dive - 0.84) / 0.16),
            }}
          >
            <MediaCard
              w={1080}
              h={608}
              base="mddrain_h63_listen"
              clip={{ from: 104, len: 130, startFrom: 6 }}
              radius={lerp(16, 0, dive)}
              lit={1}
              dark={0.1}
              kb={0.05}
              sheenAt={158}
            />
          </div>
        ) : null}

        {/* ── ACTO 1 · tarjeta A (h59): arranca A SANGRE, hereda el b-roll de entrada ───── */}
        {frame < 148 ? (
          <div
            style={{
              ...plane(
                0.55 * openT, // a sangre no hay parallax: el plano ES la pantalla
                lerp(0, -60, openT) - exitA * 980,
                exitA * 190,
                `scale(${(1 - exitA * 0.26).toFixed(3)}) rotateZ(${(exitA * -7).toFixed(2)}deg) rotateY(${(openT * -3).toFixed(2)}deg)`,
              ),
            }}
          >
            <MediaCard
              w={cardAW}
              h={cardAH}
              base="mddrain_h59_hoseloop"
              clip={{ from: 0, len: 142, startFrom: 0 }}
              radius={lerp(0, 16, openT)}
              lit={lerp(0.2, 1, openT)}
              dark={0.1}
              kb={0.04}
              sheenAt={106}
            />
          </div>
        ) : null}

        {/* ── ACTO 5 · LA TAZA: el clip real es el protagonista ─────────────────────────── */}
        {frame > 1014 && frame < 1208 ? (
          <div
            style={{
              ...plane(
                0.7,
                lerp(-150, -190, inHero5) - out5 * 300,
                lerp(30, 0, inHero5) + out5 * 130,
                `scale(${(lerp(0.9, 1, inHero5) * lerp(1, 0.72, out5)).toFixed(3)}) rotateY(${lerp(5, 2, inHero5).toFixed(2)}deg) rotateZ(${(-1.4 - out5 * 3).toFixed(2)}deg)`,
              ),
              opacity: inHero5 * (1 - out5 * 0.9),
            }}
          >
            <MediaCard
              w={1040}
              h={586}
              base="mddrain_h60_floordrain"
              clip={{ from: 1028, len: 130, startFrom: 2 }}
              radius={14}
              lit={1}
              dark={0.1}
              red={0.03}
              kb={0.06}
              sheenAt={1074}
              chip="ONE CUP · ONCE A MONTH"
              chipColor={GOLD_HI}
            />
          </div>
        ) : null}

        {/* la salpicadura del agua entrando al sello */}
        {splash > 0.02 ? (
          <div style={{ ...plane(0.3, 520, 60), width: 420, height: 260, opacity: splash * 0.8 }}>
            <Foam p={splash} count={30} x={50} spread={44} />
          </div>
        ) : null}

        {/* ── ACTO 6 · EL ACEITE: la última materia viva ────────────────────────────────── */}
        {frame >= A6 ? (
          <div
            style={{
              ...plane(
                0.62,
                lerp(-40, -70, endT),
                lerp(0, 46, endT),
                `scale(${(lerp(1.07, 1, snap6) * lerp(1, 0.8, endT)).toFixed(3)}) rotateY(${(2 - endT * 3).toFixed(2)}deg)`,
              ),
              opacity: 1 - endT * 0.86,
            }}
          >
            <MediaCard
              w={1240}
              h={700}
              base="mddrain_h61_oilspoon"
              clip={{ from: 1230, len: 132, startFrom: 0 }}
              radius={14}
              lit={1}
              dark={0.08}
              red={0.02}
              kb={0.06}
              sheenAt={1266}
              chip="ONE SPOON OF COOKING OIL"
              chipColor={GOLD_HI}
            />
          </div>
        ) : null}

        {/* ── PLANO 6 (delantero): el canto desenfocado del mueble ──────────────────────── */}
        <div
          style={{
            ...plane(1.5, -880, 240, "rotateZ(-4deg)"),
            width: 520,
            height: 900,
            background: "linear-gradient(90deg, rgba(4,4,6,0.94) 0%, rgba(4,4,6,0.6) 62%, rgba(4,4,6,0) 100%)",
            opacity: interpolate(frame, [0, A3, A5], [0.9, 0.45, 0.18], { extrapolateRight: "clamp" }),
          }}
        />
      </AbsoluteFill>

      {/* motas cercanas: hold vivo, nada queda perfectamente quieto */}
      <Motes n={18} seed={19} tint={frame > A5 ? GOLD : tint} size={9} speed={1.25} op={0.32} />

      {/* la película de aceite final: lo último encendido sobre el negro */}
      {endT > 0.02 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: "22%",
              right: "22%",
              top: "56%",
              height: 16,
              borderRadius: 10,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(GOLD, 0.75)} 12%, ${GOLD_HI} ${(46 + Math.sin(frame / 22) * 14).toFixed(1)}%, ${rgba(GOLD, 0.8)} 88%, rgba(0,0,0,0) 100%)`,
              boxShadow: `0 0 60px ${rgba(GOLD, 0.9)}, 0 0 160px ${rgba(GOLD, 0.5)}`,
              opacity: endT,
              transform: `scaleX(${(0.7 + endT * 0.3).toFixed(3)})`,
            }}
          />
          {Array.from({ length: 12 }, (_, i) => {
            const s = rnd(i * 4.7 + 91);
            const p = ((frame - 1326) / (120 + s * 90) + s) % 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(26 + s * 48).toFixed(1)}%`,
                  top: `${(56 - p * 14).toFixed(2)}%`,
                  width: 4 + s * 9,
                  height: 4 + s * 9,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${GOLD_HI} 0%, ${rgba(GOLD, 0)} 70%)`,
                  opacity: endT * (1 - p) * 0.9,
                }}
              />
            );
          })}
          {/* el cuarto se apaga alrededor del oro */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(${(58 - endT * 26).toFixed(1)}% ${(50 - endT * 24).toFixed(1)}% at 50% 52%, rgba(0,0,0,0) 20%, rgba(0,0,0,${(0.55 + endT * 0.45).toFixed(3)}) 100%)`,
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* ═══════════════════════════ COSTURAS ═══════════════════════════ */}
      {/* 4→5 · OCLUSIÓN: la columna de agua tapa el 100% y detrás el sello ya está repuesto */}
      <WaterColumn at={1008} dur={36} />
      {/* 5→6 · CORTE EN EL BEAT: destello dorado de 3 frames */}
      {flash6 > 0.001 ? <AbsoluteFill style={{ background: rgba(GOLD_HI, flash6), pointerEvents: "none" }} /> : null}

      {/* ═══════════════════ UNA IDEA DE TEXTO POR ACTO ═══════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {t1 > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 118,
              maxWidth: 900,
              opacity: t1,
              transform: `translateY(${((1 - t1) * 18).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>The rag came out clean</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                No film. It still <Em>stinks</Em>
              </Title>
            </TextBed>
          </div>
        ) : null}

        {t2 > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 104,
              maxWidth: 880,
              opacity: t2,
              transform: `translateY(${((1 - t2) * -18).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>All that stands between you and the sewer</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                Two inches of <Em>water</Em>
              </Title>
            </TextBed>
          </div>
        ) : null}

        {t3 > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 118,
              maxWidth: 880,
              opacity: t3,
              transform: `translateY(${((1 - t3) * 18).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>The drains you never run</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                Two to four weeks. <Em>Gone</Em>
              </Title>
            </TextBed>
          </div>
        ) : null}

        {t4 > 0.01 ? (
          <div
            style={{
              position: "absolute",
              right: 96,
              bottom: 124,
              maxWidth: 880,
              textAlign: "right",
              opacity: t4,
              transform: `translateY(${((1 - t4) * 18).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>Everyone calls it a plumbing problem</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                Now it&apos;s <Em>an open door</Em>
              </Title>
            </TextBed>
          </div>
        ) : null}

        {t5 > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 118,
              maxWidth: 900,
              opacity: t5,
              transform: `translateY(${((1 - t5) * 18).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>Every drain you never use</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                One cup of <Em>water</Em>
              </Title>
            </TextBed>
          </div>
        ) : null}

        {t6 > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 128,
              maxWidth: 940,
              opacity: t6,
              transform: `translateY(${((1 - t6) * 18).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>Big buildings have done this forever</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                A spoon of <Em>oil</Em> on top
              </Title>
            </TextBed>
          </div>
        ) : null}
      </AbsoluteFill>

      {/* alerta: el cuarto entero se tiñe mientras la puerta está abierta */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 60% at 50% 48%, ${rgba(MD.red, 0.15 * gas)} 0%, rgba(0,0,0,0) 74%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
