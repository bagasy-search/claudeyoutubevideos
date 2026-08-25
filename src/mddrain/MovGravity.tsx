// MovGravity.tsx — MOVIMIENTO 3 del video `mddrain` (canal Mike Dalton, EN).
// 1833 frames · 61,1 s @30fps · ES EL ARGUMENTO CENTRAL DEL VIDEO.
//
// La idea: no es la química, es EL RELOJ. Un desagüe es un caño VERTICAL y la gravedad no es
// opcional: lo que volcás toca la pared medio segundo y ya está en el sifón. El gel espeso te
// compra dos o tres segundos — eso es literalmente lo que pagás de más. Un dólar de peróxido
// RETENIDO veinte minutos le gana a doce dólares de cualquier cosa que se cayó.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-300     LA MARCA ROJA     enterFrom  cámara: heredada del Mov 2 (negro, encuadre plano, z bajo).
//                                                 luz:    NEGRO con una brasa ROJA viva (la marca del Mov 2).
//                                                 materia: el SUBRAYADO ROJO que dejó MovTowelman.
//                                      exitTo     cámara: ya viajando a la derecha, ry +2°, z +90.
//                                                 luz:    fría de cocina, key desplazándose a la derecha.
//                                                 materia: la tarjeta-FOTO de `h34_pourstraight` en el plano medio.
// acto 2  f300-620   MEDIO SEGUNDO     enterFrom  cámara: continúa (nunca vuelve a 0), z +90 → +150.
//                                                 luz:    fría.
//                                                 materia: esa MISMA foto, que COBRA VIDA como clip.
//                                      exitTo     cámara: empuje frontal fuerte hacia la boca negra del desagüe.
//                                                 luz:    fría con brasa roja en el centro.
//                                                 materia: la boca oscura del caño (se la traga el cuadro).
// acto 3  f620-960   LO QUE SE CAE     enterFrom  cámara: salimos DENTRO del caño, z +150 → +200, ry +4°.
//                                                 luz:    fría-neutra, key al centro.
//                                                 materia: el abanico 3D de 5 cartas con material real.
//                                      exitTo     cámara: sigue, sin corte.
//                                                 luz:    virando a neutra-cálida.
//                                                 materia: la carta de `h37_pushaside` SOBREVIVE la frontera.
// acto 4  f960-1290  QUE SE QUEDE      enterFrom  cámara: heredada; la oclusión tapa el cambio de decorado.
//                                                 luz:    neutra-cálida.
//                                                 materia: la carta pushaside (sigue viva 32 frames más).
//                                      exitTo     cámara: retrocede un poco (z 200 → 235) y abre plano.
//                                                 luz:    cálida (lámpara del pasillo).
//                                                 materia: el reloj chico ya corriendo (14,0 s).
// acto 5  f1290-1560 EL RELOJ          enterFrom  cámara: continúa; la espuma barre el cuadro.
//                                                 luz:    cálida.
//                                                 materia: el NÚMERO del reloj chico → reloj GIGANTE.
//                                      exitTo     cámara: sigue; el bloque tipográfico se aplasta.
//                                                 luz:    cálida alta.
//                                                 materia: el reloj gigante APLASTADO = la primera barra.
// acto 6  f1560-1833 UN DÓLAR          enterFrom  cámara: heredada, z 235 → 300, panX final.
//                                                 luz:    cálida → DÍA ABIERTO (se levantan los negros).
//                                                 materia: las tres barras + la tarjeta de `h38_jetter`.
//                                      exitTo     b-roll de la hidrolavadora en una entrada de coches,
//                                                 día abierto y luz plana: el clip `h38_jetter` YA está
//                                                 en pantalla, casi a sangre, con la luz ya abierta.
//
// ── COSTURAS (una distinta por frontera, ⛔ nunca un fade) ───────────────────────────────────
//  entrada (Mov2→f0)  MATCH-SHAPE  · el subrayado rojo gira 90° y se vuelve la costura del caño.
//  1→2  (f300)        MATCH-MOVE   · la FOTO de la botella marrón sigue su trayectoria y COBRA VIDA
//                                    (mismo encuadre, misma velocidad: la quieta se vuelve clip).
//  2→3  (f620)        ZOOM-THROUGH · la boca negra del desagüe se traga el cuadro y salimos adentro.
//  3→4  (f960)        OCLUSIÓN     · la carta pushaside cruza y tapa el 100% 6 frames.
//  4→5  (f1290)       WIPE POR MATERIA · la espuma del peróxido sube y barre; detrás ya está el reloj.
//  5→6  (f1560)       MATCH-SHAPE  · el reloj gigante se aplasta y ATERRIZA como la primera barra.
//
// ── MATERIAL REAL DENTRO DE VIDRIO (regla dura del creador) ─────────────────────────────────
//  acto 1  clip h35_clearpipe (tarjeta vertical) + foto h34_pourstraight (plano medio)
//  acto 2  clip h34_pourstraight (héroe) + clip h35_clearpipe 2ª pasada (satélite)
//  acto 3  abanico: clips h36_gelbottle / h27_bottlebrush / h37_pushaside al frente
//                   + fotos h19_soakwad / h20_packwad esperando del lado "lo que se queda"
//  acto 4  clip h19_soakwad (cara A) / clip h20_packwad (cara B de la misma carta que gira)
//  acto 5  clip h25_timer + foto h20_packwad
//  acto 6  clip h38_jetter (crece hasta casi sangre y entrega al b-roll)
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
  F_SANS,
  rgba,
  lerp,
  clamp01,
  rnd,
  cam,
  Atmos,
  Occluder,
  Sheen,
  glassStyle,
  Kicker,
  Title,
  Em,
  TextBed,
} from "../mdmold/Stage";
import { PipeWall, ContactClock, CompareBar, Foam, DR } from "./Pipe";

// ── FRONTERAS ───────────────────────────────────────────────────────────────────────────────
const A1 = 0, A2 = 300, A3 = 620, A4 = 960, A5 = 1290, A6 = 1560;

const DAY = "#CFE0EA";
const GEL = "#56A6D6";

// ── COLOR: la luz VIAJA por 5 estados y nunca salta ──────────────────────────────────────────
const parseC = (c: string): [number, number, number] => {
  const m = c.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (m) return [+m[1], +m[2], +m[3]];
  const h = c.replace("#", "");
  const s = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mixC = (a: string, b: string, k: number) => {
  const A = parseC(a);
  const B = parseC(b);
  const t = clamp01(k);
  return `rgb(${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))})`;
};
const STOPS: Array<[number, string]> = [
  [0.0, MD.red],      // la brasa que traemos del Mov 2
  [0.06, MD.cold],    // cocina de noche
  [0.34, MD.cold],
  [0.5, "#8E9AA6"],   // neutra (dentro del caño)
  [0.72, MD.warm],    // cálida: la solución
  [0.9, MD.warm],
  [1.0, DAY],         // día abierto: la entrada de coches
];
const tintAt = (t: number) => {
  let i = 0;
  for (let k = 0; k < STOPS.length - 1; k++) if (t >= STOPS[k][0]) i = k;
  const a = STOPS[i];
  const b = STOPS[Math.min(STOPS.length - 1, i + 1)];
  const span = Math.max(0.0001, b[0] - a[0]);
  return mixC(a[1], b[1], (t - a[0]) / span);
};

// ── UBICAR UNA PLACA EN EL ESPACIO ──────────────────────────────────────────────────────────
const plate = (o: {
  x: number; y: number; z: number;
  ry?: number; rx?: number; rz?: number; s?: number; op?: number;
}): React.CSSProperties => ({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform:
    `translate(-50%,-50%) translate3d(${o.x.toFixed(1)}px,${o.y.toFixed(1)}px,${o.z.toFixed(1)}px) ` +
    `rotateY(${(o.ry ?? 0).toFixed(2)}deg) rotateX(${(o.rx ?? 0).toFixed(2)}deg) ` +
    `rotateZ(${(o.rz ?? 0).toFixed(2)}deg) scale(${(o.s ?? 1).toFixed(4)})`,
  transformStyle: "preserve-3d",
  opacity: clamp01(o.op ?? 1),
});

// ── CLIP REAL, con su tiempo remapeado ──────────────────────────────────────────────────────
// El clip dura 121 frames @24fps. Cada ventana se monta en su propia <Sequence> para que el
// video arranque en 0 aunque la tarjeta viva en el frame 1700 del movimiento.
const ClipBody: React.FC<{ src: string; startFrom: number; len: number; push: number }> = ({
  src, startFrom, len, push,
}) => {
  const f = useCurrentFrame();
  const s = 1.03 + push * interpolate(f, [0, Math.max(2, len)], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const fade = interpolate(f, [0, 5, Math.max(6, len - 6), Math.max(7, len - 1)], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        startFrom={startFrom}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }}
      />
    </AbsoluteFill>
  );
};

const ClipIn: React.FC<{ at: number; len: number; src: string; startFrom?: number; push?: number }> = ({
  at, len, src, startFrom = 0, push = 0.05,
}) => (
  <Sequence from={at} durationInFrames={Math.max(2, len)} layout="none">
    <ClipBody src={src} startFrom={startFrom} len={Math.max(2, len)} push={push} />
  </Sequence>
);

// ── LA TARJETA: material REAL dentro de vidrio, con marco, bisel y sombra de contacto ───────
type Tone = "neutral" | "red" | "gel" | "cold" | "warm";
const TONE: Record<Tone, string> = {
  neutral: MD.white,
  red: MD.redHot,
  gel: GEL,
  cold: MD.cold,
  warm: MD.warm,
};

const Card: React.FC<{
  w: number;
  h: number;
  photo: string;                 // foto REAL de base (siempre presente)
  clip?: { at: number; len: number; src: string; startFrom?: number };
  tone?: Tone;
  chip?: string;
  note?: string;
  lit?: number;
  sheenAt?: number;
  radius?: number;
  bright?: number;
}> = ({ w, h, photo, clip, tone = "neutral", chip, note, lit = 1, sheenAt, radius = 16, bright = 1 }) => {
  const f = useCurrentFrame();
  const rim = TONE[tone];
  const pad = Math.max(9, Math.round(w * 0.016));
  const pulse = 0.9 + Math.sin(f / 29) * 0.1;
  return (
    <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d" }}>
      {/* sombra de contacto: aterriza la tarjeta en el aire del cuarto */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          width: "88%",
          bottom: -Math.round(h * 0.09),
          height: Math.round(h * 0.16),
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 100%)",
          filter: "blur(14px)",
          transform: "translateZ(-40px)",
        }}
      />
      {/* el marco de vidrio */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: pad,
          ...glassStyle({ radius, lit }),
          boxShadow: [
            `inset 0 1px 0 ${rgba(MD.white, 0.32 * lit)}`,
            `inset 0 -1px 0 ${rgba(MD.white, 0.07 * lit)}`,
            `0 0 0 1px ${rgba(rim, tone === "neutral" ? 0.14 : 0.4 * pulse)}`,
            `0 30px 70px rgba(0,0,0,0.66)`,
            `0 0 60px ${rgba(rim, tone === "neutral" ? 0.06 : 0.2 * pulse)}`,
          ].join(", "),
        }}
      >
        {/* la ventana con el MATERIAL REAL */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: Math.max(4, radius - 6),
            overflow: "hidden",
            background: "#08080A",
          }}
        >
          <Img
            src={staticFile(photo)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `brightness(${(0.86 * bright).toFixed(2)}) saturate(0.82) contrast(1.06)`,
              transform: `scale(${(1.04 + Math.sin(f / 97) * 0.006).toFixed(4)})`,
            }}
          />
          {clip && (
            <ClipIn at={clip.at} len={clip.len} src={clip.src} startFrom={clip.startFrom ?? 0} />
          )}
          {/* grade del canal */}
          <AbsoluteFill style={{ background: "rgba(228,50,42,0.05)", mixBlendMode: "soft-light" }} />
          <AbsoluteFill
            style={{ background: "radial-gradient(90% 76% at 50% 44%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.58) 100%)" }}
          />
          {/* key + rim de producto sobre el vidrio */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(152deg, ${rgba(MD.white, 0.11 * lit)} 0%, rgba(255,255,255,0) 42%)`,
            }}
          />
          {tone !== "neutral" && (
            <AbsoluteFill
              style={{ background: `linear-gradient(0deg, ${rgba(rim, 0.16)} 0%, rgba(0,0,0,0) 46%)` }}
            />
          )}
          {sheenAt !== undefined && <Sheen at={sheenAt} dur={34} angle={16} />}
        </div>

        {/* chip de identidad, sobre cama oscura */}
        {chip && (
          <div
            style={{
              position: "absolute",
              left: pad + 14,
              bottom: pad + 14,
              padding: "9px 16px",
              borderRadius: 8,
              background: "linear-gradient(180deg, rgba(6,6,8,0.9) 0%, rgba(6,6,8,0.74) 100%)",
              boxShadow: `0 10px 30px rgba(0,0,0,0.7), inset 0 0 0 1px ${rgba(rim, 0.35)}`,
              fontFamily: F_SANS,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              color: tone === "neutral" ? MD.white : rim,
              whiteSpace: "nowrap",
            }}
          >
            {chip}
          </div>
        )}
        {note && (
          <div
            style={{
              position: "absolute",
              right: pad + 14,
              top: pad + 14,
              padding: "8px 14px",
              borderRadius: 8,
              background: "rgba(6,6,8,0.86)",
              fontFamily: F_SANS,
              fontWeight: 800,
              fontSize: 30,
              color: rim,
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

// ── EL RELOJ GIGANTE que se APLASTA hasta ser la primera barra (costura 5→6) ────────────────
const MegaClock: React.FC<{ seconds: number; morph: number; label: string }> = ({ seconds, morph, label }) => {
  const m = clamp01(morph);
  const txt =
    seconds >= 60
      ? `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60) < 10 ? "0" : ""}${Math.floor(seconds % 60)}`
      : `${seconds.toFixed(1)}s`;
  // destino EXACTO de la barra 1 de CompareBar: left 120 + label 300 + gap 22 = 442, top 430, 30x26
  const cx = lerp(960, 457, m);
  const cy = lerp(452, 443, m);
  const w = lerp(880, 30, m);
  const h = lerp(300, 26, m);
  const digits = clamp01(1 - (m - 0.28) / 0.34);
  const solid = clamp01((m - 0.42) / 0.42);
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: w,
        height: h,
        transform: "translate(-50%,-50%)",
        borderRadius: lerp(20, 4, m),
        background:
          solid > 0.01
            ? `linear-gradient(90deg, ${rgba(MD.white, 0.4 * solid)} 0%, ${rgba(MD.white, 0.62 * solid)} 100%)`
            : "none",
        boxShadow: solid > 0.01 ? `0 0 ${26 * solid}px ${rgba(MD.white, 0.3 * solid)}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: F_SANS,
          fontWeight: 800,
          fontSize: lerp(272, 30, m),
          lineHeight: 1,
          letterSpacing: lerp(-10, -1, m),
          color: MD.white,
          opacity: digits,
          transform: `scaleY(${lerp(1, 0.12, m).toFixed(3)})`,
          textShadow: `0 10px 60px rgba(0,0,0,0.95), 0 0 ${lerp(60, 0, m)}px ${rgba(MD.warm, 0.35)}`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {txt}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: lerp(-58, 0, m),
          textAlign: "center",
          fontFamily: F_SANS,
          fontWeight: 800,
          fontSize: 32,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: rgba(MD.white, 0.66 * digits),
          opacity: digits,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ── LA BARRA QUE CRUZA EL CUADRO ENTERO (la de 20 minutos) ─────────────────────────────────
const RunBar: React.FC<{ p: number; y: number; label: string; value: string }> = ({ p, y, label, value }) => {
  const t = clamp01(p);
  const wpx = 4 + t * 1560; // 442 + 1564 = 2006 → se va del cuadro por la derecha
  const head = 442 + wpx;
  return (
    <div style={{ position: "absolute", left: 120, top: y, display: "flex", alignItems: "center", gap: 22 }}>
      <div
        style={{
          width: 300,
          textAlign: "right",
          fontFamily: F_SANS,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: rgba(MD.white, 0.9),
        }}
      >
        {label}
      </div>
      <div style={{ position: "relative", height: 34 }}>
        <div
          style={{
            width: wpx,
            height: 34,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${rgba(MD.red, 0.55)} 0%, ${MD.red} 62%, ${MD.redHot} 100%)`,
            boxShadow: `0 0 40px ${rgba(MD.red, 0.6)}`,
          }}
        />
        {/* la cabeza que se escapa del cuadro */}
        {t > 0.06 && head < 2200 && (
          <div
            style={{
              position: "absolute",
              left: wpx - 8,
              top: -13,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(MD.redHot, 0.8)} 0%, rgba(0,0,0,0) 70%)`,
            }}
          />
        )}
        {/* el valor viaja SOBRE la barra: nunca se sale del safe area */}
        {t > 0.16 && (
          <div
            style={{
              position: "absolute",
              left: Math.min(wpx - 210, 1240),
              top: 1,
              fontFamily: F_SANS,
              fontWeight: 800,
              fontSize: 32,
              color: MD.white,
              whiteSpace: "nowrap",
              textShadow: "0 2px 14px rgba(0,0,0,0.8)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

// ── UNA IDEA DE TEXTO POR ACTO ──────────────────────────────────────────────────────────────
const Beat: React.FC<{
  f: number; a: number; b: number;
  box: React.CSSProperties;
  kicker: string;
  size?: number;
  w?: number;
  children: React.ReactNode;
}> = ({ f, a, b, box, kicker, size = 66, w = 900, children }) => {
  const o = interpolate(f, [a, a + 14, Math.max(a + 15, b - 16), Math.max(a + 16, b)], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0.01) return null;
  const dy = interpolate(o, [0, 1], [18, 0]);
  return (
    <div style={{ ...box, opacity: o, transform: `translateY(${dy.toFixed(1)}px)`, maxWidth: w }}>
      <TextBed>
        <Kicker>{kicker}</Kicker>
        <div style={{ height: 12 }} />
        <Title size={size}>{children}</Title>
      </TextBed>
    </div>
  );
};

// ── EL ABANICO 3D ───────────────────────────────────────────────────────────────────────────
const FAN: Array<{ photo: string; clip?: string; chip: string; note: string; tone: Tone }> = [
  { photo: "img/mddrain_h36_gelbottle.jpg", clip: "broll/mddrain_h36_gelbottle.mp4", chip: "Thick gel", note: "3 s", tone: "gel" },
  { photo: "img/mddrain_h27_bottlebrush.jpg", clip: "broll/mddrain_h27_bottlebrush.mp4", chip: "Machine brush", note: "center only", tone: "red" },
  { photo: "img/mddrain_h37_pushaside.jpg", clip: "broll/mddrain_h37_pushaside.mp4", chip: "One dollar", note: "stays", tone: "warm" },
  { photo: "img/mddrain_h19_soakwad.jpg", chip: "Soaked wad", note: "20 min", tone: "neutral" },
  { photo: "img/mddrain_h20_packwad.jpg", chip: "Packed in", note: "20 min", tone: "neutral" },
];

export const MovGravity: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = Math.max(600, durationInFrames);
  const t = clamp01(frame / D);

  // ── UNA cámara para los seis actos: nunca vuelve a cero ─────────────────────────────────
  const c = cam(frame, { z0: -40, z1: 300, panX: -150, panY: -34, ry: 7, rx: -2.4, dur: D });
  // deriva por acto que ACUMULA (no resetea): el acto 4 hereda del 3
  const actPan = interpolate(
    frame,
    [A1, A2, A3, A4, A5, A6, D],
    [0, -46, -104, -142, -178, -212, -258],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.3, 1) },
  );
  const actLift = interpolate(
    frame,
    [A1, A3, A5, D],
    [26, -6, -30, -52],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.3, 1) },
  );
  const world: React.CSSProperties = {
    transform: `${c.transform} translate3d(${actPan.toFixed(1)}px, ${actLift.toFixed(1)}px, 0)`,
    transformStyle: "preserve-3d",
  };

  // ── LA LUZ: brasa roja → fría → neutra → cálida → día abierto ───────────────────────────
  const tint = tintAt(t);
  const amb = interpolate(frame, [0, 14, A3, A6, D], [0.1, 0.86, 1.0, 1.12, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const keyFrom = interpolate(frame, [A1, A3, D], [0.14, 0.5, 0.86], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const day = interpolate(frame, [A6 + 138, D - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.2, 1),
  });

  // ── ACTO 1 · la marca roja se vuelve el caño ────────────────────────────────────────────
  const seamRot = interpolate(frame, [26, 72], [0, -90], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.62, 0, 0.14, 1),
  });
  const seamX = interpolate(frame, [26, 78], [463, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.2, 1) });
  const seamY = interpolate(frame, [26, 78], [612, 540], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.2, 1) });
  const seamLen = interpolate(frame, [0, 26, 78], [666, 666, 856], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seamThick = interpolate(frame, [0, 40, 84, 128], [7, 11, 18, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seamOp = interpolate(frame, [0, 8, 108, 168], [0.55, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pipeOpen = interpolate(frame, [72, 128], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.18, 0.86, 0.2, 1),
  });

  // la gota roja que cae en el caño del acto 1 (gravedad real: t²)
  const dropRaw = interpolate(frame, [150, 214], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dropY = dropRaw * dropRaw;

  // ── ACTO 2 · medio segundo ──────────────────────────────────────────────────────────────
  // la foto del acto 1 sigue su trayectoria y COBRA VIDA en f300 (match-move)
  const heroTravel = interpolate(frame, [214, A2, A2 + 70], [0, 0.42, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 0, 0.22, 1),
  });
  const halfSec = interpolate(frame, [A2 + 96, A2 + 168], [0, 0.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.1, 0.9, 0.2, 1),
  });
  const gonePop = interpolate(frame, [A2 + 168, A2 + 182, A2 + 280, A2 + 300], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── COSTURA 2→3 · ZOOM-THROUGH por la boca del desagüe ──────────────────────────────────
  const mouth = interpolate(frame, [A3 - 46, A3 + 2, A3 + 40], [0.06, 3.4, 12], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.6, 0, 0.24, 1),
  });
  const mouthOp = interpolate(frame, [A3 - 46, A3 - 8, A3 + 6, A3 + 42], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── ACTO 3 · el abanico ─────────────────────────────────────────────────────────────────
  const rotAt = (ff: number) =>
    interpolate(ff, [740, 780], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.16, 1),
    }) +
    interpolate(ff, [862, 902], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.16, 1),
    });
  const rotNow = rotAt(frame);
  const fanIn = interpolate(frame, [A3 + 4, A3 + 54], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 0.84, 0.22, 1),
  });
  const fanOut = interpolate(frame, [A4 - 22, A4 - 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── ACTO 4 · que se quede ───────────────────────────────────────────────────────────────
  const flip = interpolate(frame, [1082, 1104], [0, 180], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.18, 1),
  });
  const plugIn = interpolate(frame, [1150, 1214], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.22, 1),
  });
  const smallSec = interpolate(frame, [1214, A5 + 10], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── COSTURA 4→5 · WIPE POR MATERIA (la espuma) ──────────────────────────────────────────
  const foamP = interpolate(frame, [A5 - 30, A5 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const foamY = interpolate(frame, [A5 - 30, A5 + 40], [130, -140], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 0, 0.22, 1),
  });

  // ── ACTO 5 · el reloj gigante ───────────────────────────────────────────────────────────
  const bigSec = interpolate(frame, [A5 + 12, A5 + 210], [14, 1200], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.06, 0.92, 0.16, 1),
  });
  const clockIn = interpolate(frame, [A5 - 4, A5 + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const morph = interpolate(frame, [1512, 1574], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.62, 0, 0.2, 1),
  });

  // ── ACTO 6 · las tres barras + el día abierto ───────────────────────────────────────────
  const bar1 = interpolate(frame, [1566, 1580], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar2 = interpolate(frame, [1592, 1664], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const bar3 = interpolate(frame, [1656, 1772], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.86, 0.02, 0.2, 1),
  });
  const barsOut = interpolate(frame, [1772, 1820], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jetAt = 1712;
  const jetLen = Math.max(24, Math.min(118, D - jetAt - 1));
  const jetIn = interpolate(frame, [jetAt, jetAt + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.24, 1) });
  const jetGrow = interpolate(frame, [1760, D - 4], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.18, 1),
  });

  // ── LA CAMA BORROSA (hermanos `_blur.jpg` ya horneados: blur 0 en render) ───────────────
  const beds: Array<[number, number, string]> = [
    [60, A2 + 40, "img/mddrain_h35_clearpipe_blur.jpg"],
    [A2 - 10, A3 + 40, "img/mddrain_h34_pourstraight_blur.jpg"],
    [A3 - 10, A4 + 40, "img/mddrain_h36_gelbottle_blur.jpg"],
    [A4 - 10, A5 + 40, "img/mddrain_h19_soakwad_blur.jpg"],
    [A5 - 10, A6 + 40, "img/mddrain_h25_timer_blur.jpg"],
    [A6 - 10, D, "img/mddrain_h38_jetter_blur.jpg"],
  ];

  const showAct1 = frame < A2 + 90;
  const showAct2 = frame > A2 - 120 && frame < A3 + 24;
  const showFan = frame > A3 - 20 && frame < A4 - 4;
  const showAct4 = frame > A4 - 24 && frame < A5 + 44;
  const showAct5 = frame > A5 - 40 && frame < A6 + 40;
  const showBars = frame > A6 - 60;

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca ── */}
      <Atmos tint={tint} keyFrom={keyFrom} intensity={amb} />

      {/* PLANO 0 (z −520): la cama borrosa horneada */}
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 46%" }}>
        <div style={{ ...world, position: "absolute", inset: 0 }}>
          {beds.map(([a, b, src], i) => {
            const o = interpolate(frame, [a, a + 26, Math.max(a + 27, b - 26), Math.max(a + 28, b)], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (o <= 0.012) return null;
            return (
              <div key={i} style={{ position: "absolute", inset: -90, opacity: o * 0.5, transform: "translateZ(-520px) scale(1.5)" }}>
                <Img
                  src={staticFile(src)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: `brightness(${(0.3 + day * 0.5).toFixed(2)}) saturate(0.6)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ── EL ESPACIO 3D: todo lo demás vive acá, con parallax por plano ── */}
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 46%", overflow: "hidden" }}>
        <div style={{ ...world, position: "absolute", inset: 0 }}>

          {/* PLANO 1 (z −380): la estructura del caño */}
          {(showAct1 || showAct4 || showAct5) && (
            <div
              style={plate({
                x: showAct1 ? -300 : -560,
                y: 0,
                z: -380,
                ry: showAct1 ? 5 : 11,
                s: showAct1 ? 0.92 * (0.2 + pipeOpen * 0.8) : 0.82,
                op: showAct1
                  ? interpolate(frame, [72, 116, A2 + 40, A2 + 96], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                  : interpolate(frame, [A4 + 120, A4 + 180, A6 - 20, A6 + 30], [0, 0.92, 0.92, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              })}
            >
              <div style={{ position: "relative" }}>
                <PipeWall
                  w={360}
                  h={856}
                  filmT={showAct1 ? 0.92 : 0.55}
                  lit={showAct1 ? 1 : 0.6}
                  redZone={showAct1 ? 0 : plugIn * 0.8}
                  zoneTop={4}
                  zoneH={30}
                />
                {/* acto 1: la gota que se cae y no vuelve */}
                {showAct1 && dropRaw > 0.001 && dropRaw < 0.999 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: `${(dropY * 96).toFixed(2)}%`,
                      transform: "translateX(-50%)",
                      width: 20,
                      height: 26 + dropY * 40,
                      borderRadius: "50% 50% 46% 46%",
                      background: `linear-gradient(180deg, ${rgba(MD.redHot, 0.95)} 0%, ${rgba(MD.red, 0.7)} 60%, rgba(255,255,255,0.5) 100%)`,
                      boxShadow: `0 0 26px ${rgba(MD.redHot, 0.7)}`,
                    }}
                  />
                )}
                {/* acto 4/5: el tapón de papel sellando la boca */}
                {!showAct1 && plugIn > 0.02 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: `${(2 + (1 - plugIn) * 10).toFixed(1)}%`,
                      height: "20%",
                      background: `linear-gradient(180deg, #EBE7DD 0%, ${DR.pvc} 58%, #9F9A8E 100%)`,
                      boxShadow: "inset 0 -12px 30px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.65)",
                      borderRadius: 8,
                      opacity: plugIn,
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── ACTO 1 · PLANO 3: la tarjeta vertical con el tubo transparente ── */}
          {showAct1 && (
            <>
              <div
                style={plate({
                  x: 300 + (1 - clamp01((frame - 84) / 40)) * 240,
                  y: -14 + Math.sin(frame / 63) * 8,
                  z: -30,
                  ry: -11 + Math.sin(frame / 88) * 1.2,
                  rx: 1.4,
                  s: 0.94 + clamp01((frame - 84) / 120) * 0.06,
                  op: interpolate(frame, [84, 114, 196, 232], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                })}
              >
                <Card
                  w={520}
                  h={742}
                  photo="img/mddrain_h35_clearpipe.jpg"
                  clip={{ at: 88, len: 116, src: "broll/mddrain_h35_clearpipe.mp4", startFrom: 4 }}
                  tone="cold"
                  chip="Clear pipe"
                  note="no brakes"
                  sheenAt={30}
                />
              </div>

              {/* PLANO 2: la FOTO de la botella marrón — la materia que cruza a f300 */}
              <div
                style={plate({
                  x: lerp(150, 250, heroTravel) + Math.sin(frame / 71) * 6,
                  y: lerp(258, -54, heroTravel),
                  z: lerp(-230, 30, heroTravel),
                  ry: lerp(15, -6, heroTravel),
                  s: lerp(0.72, 1, heroTravel),
                  op: interpolate(frame, [206, 236], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                })}
              >
                <Card
                  w={900}
                  h={520}
                  photo="img/mddrain_h34_pourstraight.jpg"
                  tone="neutral"
                  chip={heroTravel > 0.6 ? "Straight down" : undefined}
                  lit={0.8 + heroTravel * 0.2}
                  bright={0.86 + heroTravel * 0.22}
                />
              </div>
            </>
          )}

          {/* ── ACTO 2 · la MISMA tarjeta, ahora VIVA (match-move) ── */}
          {showAct2 && (
            <>
              <div
                style={plate({
                  x: 250 + Math.sin(frame / 74) * 7,
                  y: -54 + Math.sin(frame / 59) * 6,
                  z: 30 + interpolate(frame, [A2, A3], [0, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  ry: -6 + Math.sin(frame / 96) * 1.1,
                  rx: 1,
                  s: 1 + interpolate(frame, [A2, A3 - 30], [0, 0.07], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  op: interpolate(frame, [A2 - 2, A2 + 6, A3 - 46, A3 - 8], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                })}
              >
                <Card
                  w={900}
                  h={520}
                  photo="img/mddrain_h34_pourstraight.jpg"
                  clip={{ at: A2, len: 116, src: "broll/mddrain_h34_pourstraight.mp4", startFrom: 2 }}
                  tone={gonePop > 0.4 ? "red" : "neutral"}
                  chip="Straight down"
                  note={halfSec > 0.05 ? `${halfSec.toFixed(1)} s` : undefined}
                  sheenAt={A2 + 40}
                />
              </div>

              {/* PLANO 2: satélite — el tubo transparente, 2ª pasada, otro encuadre */}
              <div
                style={plate({
                  x: -452 + Math.sin(frame / 81) * 9,
                  y: 216 + Math.sin(frame / 67) * 7,
                  z: -246,
                  ry: 17,
                  rz: -1.6,
                  s: 0.96,
                  op: interpolate(frame, [A2 + 128, A2 + 158, A2 + 244, A2 + 268], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                })}
              >
                <Card
                  w={540}
                  h={312}
                  photo="img/mddrain_h35_clearpipe.jpg"
                  clip={{ at: A2 + 128, len: 114, src: "broll/mddrain_h35_clearpipe.mp4", startFrom: 14 }}
                  tone="cold"
                  chip="It never slows"
                />
              </div>
            </>
          )}

          {/* ── ACTO 3 · EL ABANICO 3D: lo que se cae vs lo que se queda ── */}
          {showFan && (
            <div style={plate({ x: 0, y: 6, z: -60, ry: 0, s: 0.9 + fanIn * 0.1, op: 1 - fanOut })}>
              <div style={{ position: "relative", width: 1, height: 1, transformStyle: "preserve-3d" }}>
                {FAN.map((card, i) => {
                  // DESFASE POR CARTA: la delantera se mueve primero; las traseras arrastran
                  const lag = 3 + Math.abs(i - rotNow) * 5.5;
                  const r = rotAt(frame - lag);
                  const ang = (i - r) * 16.5;
                  const rad = (ang * Math.PI) / 180;
                  const cosA = Math.cos(rad);
                  const x = Math.sin(rad) * 830;
                  const z = cosA * 300 - 300;
                  const s = (0.6 + 0.4 * Math.max(0, cosA)) * (0.86 + fanIn * 0.14);
                  const y = 24 + (1 - cosA) * 128 + Math.sin(frame / (58 + i * 11)) * 7;
                  const op = clamp01(0.18 + cosA * 1.1) * fanIn;
                  const isFront = Math.abs(i - rotNow) < 0.42;
                  const live =
                    card.clip && i === 0
                      ? { at: 636, len: 112, src: card.clip, startFrom: 6 }
                      : card.clip && i === 1
                        ? { at: 770, len: 116, src: card.clip, startFrom: 8 }
                        : card.clip && i === 2
                          ? { at: 890, len: 116, src: card.clip, startFrom: 4 }
                          : undefined;
                  return (
                    <div
                      key={i}
                      style={plate({
                        x,
                        y,
                        z,
                        ry: -ang * 0.86,
                        rz: ang * 0.06,
                        s,
                        op,
                      })}
                    >
                      <Card
                        w={452}
                        h={286}
                        photo={card.photo}
                        clip={live}
                        tone={card.tone}
                        chip={card.chip}
                        note={isFront ? card.note : undefined}
                        lit={0.5 + Math.max(0, cosA) * 0.6}
                        bright={0.68 + Math.max(0, cosA) * 0.42}
                      />
                    </div>
                  );
                })}

                {/* el eje del abanico: la línea que separa lo que se cae de lo que se queda */}
                <div
                  style={plate({
                    x: 452,
                    y: 20,
                    z: -170,
                    s: 1,
                    op: clamp01((fanIn - 0.4) * 2) * (1 - fanOut),
                  })}
                >
                  <div
                    style={{
                      width: 3,
                      height: 470,
                      background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(MD.white, 0.5)} 26%, ${rgba(MD.white, 0.5)} 74%, rgba(0,0,0,0) 100%)`,
                      boxShadow: `0 0 24px ${rgba(MD.white, 0.35)}`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── ACTO 4 · LA TARJETA QUE GIRA: empapar (cara A) → meter (cara B) ── */}
          {showAct4 && (
            <>
              {/* la carta pushaside SOBREVIVE la frontera y se va al plano medio izquierdo */}
              <div
                style={plate({
                  x: interpolate(frame, [A4 - 8, A4 + 66], [0, -486], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1) }),
                  y: 210 + Math.sin(frame / 69) * 7,
                  z: -258,
                  ry: 18,
                  s: 0.9,
                  op: interpolate(frame, [A4 - 8, A4 + 8, 1140, 1200], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                })}
              >
                <Card
                  w={452}
                  h={286}
                  photo="img/mddrain_h37_pushaside.jpg"
                  clip={{ at: 890, len: 116, src: "broll/mddrain_h37_pushaside.mp4", startFrom: 4 }}
                  tone="warm"
                  chip="One dollar"
                />
              </div>

              <div
                style={plate({
                  x: 196 + Math.sin(frame / 77) * 8,
                  y: -46 + Math.sin(frame / 61) * 7,
                  z: 48,
                  ry: -5 + flip,
                  rx: 1.2,
                  s: 0.94 + clamp01((frame - A4) / 200) * 0.06,
                  op: interpolate(frame, [A4 + 4, A4 + 26, A5 - 18, A5 + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                })}
              >
                <div style={{ position: "relative", width: 880, height: 520, transformStyle: "preserve-3d" }}>
                  {/* cara A: empapar el bollo */}
                  <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                    <Card
                      w={880}
                      h={520}
                      photo="img/mddrain_h19_soakwad.jpg"
                      clip={{ at: 966, len: 116, src: "broll/mddrain_h19_soakwad.mp4", startFrom: 6 }}
                      tone="warm"
                      chip="Soak it until it drips"
                      sheenAt={A4 + 44}
                    />
                  </div>
                  {/* cara B: meterlo en la boca del desagüe */}
                  <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <Card
                      w={880}
                      h={520}
                      photo="img/mddrain_h20_packwad.jpg"
                      clip={{ at: 1104, len: 116, src: "broll/mddrain_h20_packwad.mp4", startFrom: 4 }}
                      tone="warm"
                      chip="Pack it against the wall"
                      note={plugIn > 0.5 ? "sealed" : undefined}
                      sheenAt={40}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── ACTO 5 · los dos testigos reales alrededor del reloj ── */}
          {showAct5 && (
            <>
              <div
                style={plate({
                  x: 462 + Math.sin(frame / 73) * 8,
                  y: 268 + Math.sin(frame / 64) * 6,
                  z: -132,
                  ry: -13,
                  s: 0.96,
                  op: interpolate(frame, [A5 + 8, A5 + 34, A5 + 126, A5 + 152], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                })}
              >
                <Card
                  w={560}
                  h={330}
                  photo="img/mddrain_h25_timer.jpg"
                  clip={{ at: A5 + 10, len: 116, src: "broll/mddrain_h25_timer.mp4", startFrom: 6 }}
                  tone="warm"
                  chip="Set the timer"
                />
              </div>
              <div
                style={plate({
                  x: -486 + Math.sin(frame / 83) * 9,
                  y: 246 + Math.sin(frame / 58) * 7,
                  z: -272,
                  ry: 16,
                  s: 0.94,
                  op: interpolate(frame, [A5 + 132, A5 + 162, A6 - 30, A6 + 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                })}
              >
                <Card
                  w={470}
                  h={276}
                  photo="img/mddrain_h20_packwad.jpg"
                  tone="neutral"
                  chip="Still there"
                />
              </div>
            </>
          )}

          {/* ── ACTO 6 · la hidrolavadora: crece hasta casi sangre y entrega al b-roll ── */}
          {frame >= jetAt - 6 && (
            <div
              style={plate({
                x: lerp(360, 0, jetGrow) + Math.sin(frame / 79) * 4,
                y: lerp(230, 0, jetGrow),
                z: lerp(-300, 210, jetGrow),
                ry: lerp(-14, 0, jetGrow),
                s: lerp(0.9, 1.34, jetGrow),
                op: jetIn,
              })}
            >
              <Card
                w={lerp(620, 1560, jetGrow)}
                h={lerp(360, 880, jetGrow)}
                photo="img/mddrain_h38_jetter.jpg"
                clip={{ at: jetAt, len: jetLen, src: "broll/mddrain_h38_jetter.mp4", startFrom: 4 }}
                tone={jetGrow > 0.5 ? "neutral" : "warm"}
                chip={jetGrow < 0.45 ? "Twelve dollars" : undefined}
                lit={1 - jetGrow * 0.8}
                bright={0.9 + jetGrow * 0.5}
                radius={lerp(16, 4, jetGrow)}
                sheenAt={26}
              />
            </div>
          )}

          {/* PLANO 5 (z +260): mugre de primer plano fuera de foco — el hold vivo */}
          <AbsoluteFill style={{ pointerEvents: "none", transform: "translateZ(260px)" }}>
            {Array.from({ length: 16 }, (_, i) => {
              const s = rnd(i * 3.3);
              const s2 = rnd(i * 8.9);
              const sp = 0.16 + s * 0.5;
              const yy = ((frame * sp) / 90 + s2) % 1;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${(4 + s * 92).toFixed(1)}%`,
                    top: `${(102 - yy * 118).toFixed(1)}%`,
                    width: 3 + s2 * 7,
                    height: 3 + s2 * 7,
                    borderRadius: "50%",
                    background: rgba(MD.white, 0.3 + s * 0.3),
                    filter: "blur(3px)",
                    opacity: (0.1 + s2 * 0.2) * (0.4 + amb * 0.5),
                  }}
                />
              );
            })}
          </AbsoluteFill>

          {/* PLANO 6 (z +420): el borde de caño fuera de foco que enmarca el cuadro */}
          <AbsoluteFill style={{ pointerEvents: "none", transform: "translateZ(420px)" }}>
            <div
              style={{
                position: "absolute",
                top: "-14%",
                bottom: "-14%",
                left: `${interpolate(frame, [0, D], [-13, -3], { extrapolateRight: "clamp" }).toFixed(1)}%`,
                width: "16%",
                background: `linear-gradient(90deg, rgba(4,4,6,0.94) 0%, rgba(4,4,6,0.8) 54%, rgba(4,4,6,0) 100%)`,
                opacity: Math.max(0, 0.9 - day * 0.95),
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-14%",
                bottom: "-14%",
                right: `${interpolate(frame, [0, D], [-11, -2], { extrapolateRight: "clamp" }).toFixed(1)}%`,
                width: "13%",
                background: `linear-gradient(270deg, rgba(4,4,6,0.9) 0%, rgba(4,4,6,0.7) 56%, rgba(4,4,6,0) 100%)`,
                opacity: Math.max(0, 0.82 - day * 0.9),
              }}
            />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>

      {/* ══ COSTURA DE ENTRADA · la MARCA ROJA del Mov 2 gira y se vuelve la costura del caño ══ */}
      {frame < 178 && seamOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: seamX,
            top: seamY,
            width: seamLen,
            height: seamThick,
            transform: `translate(-50%,-50%) rotate(${seamRot.toFixed(2)}deg)`,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${MD.redHot} 0%, ${rgba(MD.red, 0.22)} 100%)`,
            boxShadow: `0 0 ${(30 + seamThick * 3).toFixed(0)}px ${rgba(MD.redHot, 0.75)}`,
            opacity: seamOp,
          }}
        />
      )}

      {/* ══ COSTURA 2→3 · ZOOM-THROUGH: la boca negra del desagüe se traga el cuadro ══ */}
      {mouthOp > 0.01 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "48%",
              width: 420,
              height: 420,
              marginLeft: -210,
              marginTop: -210,
              borderRadius: "50%",
              transform: `scale(${mouth.toFixed(3)})`,
              background: `radial-gradient(circle, #030304 0%, #030304 62%, ${rgba(MD.red, 0.5)} 74%, rgba(0,0,0,0) 100%)`,
              opacity: mouthOp,
            }}
          />
        </AbsoluteFill>
      )}

      {/* ══ COSTURA 3→4 · OCLUSIÓN: la carta cruza y tapa el cambio de decorado ══ */}
      <Occluder at={A4 - 12} dur={16} color="#0E0F12" angle={-7} />

      {/* ══ COSTURA 4→5 · WIPE POR MATERIA: la espuma del peróxido sube y barre ══ */}
      {foamP > 0.01 && foamP < 0.999 && (
        <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${foamY.toFixed(1)}%)` }}>
            <Foam p={1} count={70} x={50} spread={130} />
            <AbsoluteFill
              style={{
                background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(MD.bone, 0.2)} 40%, ${rgba(MD.bone, 0.32)} 100%)`,
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── EL RELOJ CHICO del acto 4: el número que cruza al acto 5 ── */}
      {frame > 1206 && frame < A5 + 16 && (
        <div
          style={{
            opacity: interpolate(frame, [1206, 1232, A5 - 6, A5 + 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <ContactClock seconds={smallSec} label="Contact time" color={MD.white} x="27%" y="80%" size={104} />
        </div>
      )}

      {/* ── EL RELOJ GIGANTE del acto 5 → se aplasta y ATERRIZA como la primera barra ── */}
      {frame > A5 - 6 && frame < A6 + 90 && (
        <div style={{ opacity: clockIn }}>
          <MegaClock seconds={bigSec} morph={morph} label="Contact time" />
        </div>
      )}

      {/* ── ACTO 2 · el medio segundo, crudo y tipográfico ── */}
      {frame > A2 + 88 && frame < A3 - 20 && (
        <div
          style={{
            opacity: interpolate(frame, [A2 + 88, A2 + 110, A3 - 56, A3 - 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <ContactClock
            seconds={halfSec}
            label="Contact time"
            color={gonePop > 0.4 ? MD.redHot : MD.white}
            x="23%"
            y="74%"
            size={132}
          />
          {gonePop > 0.02 && (
            <div
              style={{
                position: "absolute",
                left: "23%",
                top: "86%",
                transform: `translate(-50%,-50%) scale(${(0.9 + gonePop * 0.1).toFixed(3)})`,
                fontFamily: F_SANS,
                fontWeight: 800,
                fontSize: 44,
                letterSpacing: 8,
                color: MD.redHot,
                opacity: gonePop,
                textShadow: `0 0 30px ${rgba(MD.red, 0.7)}`,
              }}
            >
              GONE
            </div>
          )}
        </div>
      )}

      {/* ══ ACTO 6 · LAS TRES BARRAS ══ */}
      {showBars && (
        <div style={{ opacity: barsOut }}>
          {bar1 > 0.01 && (
            <div style={{ opacity: bar1 }}>
              <CompareBar p={1} w={30} color={rgba(MD.white, 0.6)} label="Poured straight down" value="0.5 s" y={430} />
            </div>
          )}
          {bar2 > 0.005 && <CompareBar p={bar2} w={112} color={GEL} label="Thick gel cleaner" value="3 s" y={530} />}
          {bar3 > 0.005 && <RunBar p={bar3} y={628} label="Peroxide poultice" value="20 minutes" />}
        </div>
      )}

      {/* ══ UNA IDEA DE TEXTO POR ACTO (titular ≤7 palabras, palabra emocional en serif) ══ */}
      <Beat f={frame} a={34} b={A2 - 26} box={{ position: "absolute", left: 110, bottom: 132 }} kicker="Gravity is not optional">
        A drain is a <Em>vertical</Em> pipe
      </Beat>

      <Beat f={frame} a={A2 + 34} b={A3 - 40} box={{ position: "absolute", left: 118, top: 118 }} kicker="Contact time on the wall" w={860}>
        Half a second, then it's <Em>gone</Em>
      </Beat>

      <Beat f={frame} a={A3 + 44} b={A4 - 34} box={{ position: "absolute", left: 110, bottom: 118 }} kicker="What falls vs what stays" w={840}>
        Gel doesn't hug. It <Em>falls</Em>
      </Beat>

      <Beat f={frame} a={A4 + 46} b={A5 - 44} box={{ position: "absolute", right: 96, bottom: 120 }} kicker="Twenty minutes of contact" w={720} size={62}>
        Make the dollar <Em>stay</Em> there
      </Beat>

      <Beat f={frame} a={A5 + 40} b={A6 - 60} box={{ position: "absolute", left: 110, bottom: 122 }} kicker="Held, not poured" w={820}>
        Twenty minutes against the <Em>wall</Em>
      </Beat>

      <Beat f={frame} a={A6 + 24} b={A6 + 210} box={{ position: "absolute", left: 118, top: 132 }} kicker="Contact time, not chemistry" w={820}>
        One dollar beats <Em>twelve</Em>
      </Beat>

      {/* ── el rebote cálido del acto 4-5 y la APERTURA AL DÍA del remate ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(64% 56% at 46% 50%, ${rgba(MD.warm, 0.12 * clamp01((t - 0.55) * 3))} 0%, rgba(0,0,0,0) 74%)`,
          pointerEvents: "none",
        }}
      />
      {day > 0.002 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${rgba(DAY, 0.5 * day)} 0%, ${rgba("#EAF2F6", 0.34 * day)} 60%, ${rgba(DAY, 0.42 * day)} 100%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
