// ════════════════════════════════════════════════════════════════════════════════════════════
//  MovCaso35 — El Constructor Libre (`clembudo`) · 1518 frames @30fps (489,4 s → 540,0 s)
//  EL REMATE EMOCIONAL DEL VIDEO. Eje dramático: 35 CONTRA 200.
//  El 200 es visiblemente MÁS GRANDE y es el que se rechaza; se pudre en pantalla y queda de
//  fondo, gris, mientras el 35 entra chiquito pero LIMPIO y ENCENDIDO adelante.
//
//  ── TABLA DE HANDOFF ───────────────────────────────────────────────────────────────────────
//  A1  LA FUGA                f0    → f203   (204f · 6,8 s)   [avatar VISIBLE]
//      enterFrom  cam {z 1.020, panX +26, ry +5.0}  luz 0.500  materia: —(entra del mov. previo)
//      exitTo     cam {z 1.045, panX +14, ry +3.6}  luz 0.494  materia: LA FICHA DEL CAÑO (vidrio
//                 del tercio derecho con el macro del caño goteando)
//      ── FRONTERA 1 · f204 · ZOOM-THROUGH ─────────────────────────────────────────────────────
//      La cámara ENTRA en la ficha del caño: la ficha crece de 480×600 a pantalla completa y
//      sale del otro lado convertida en el plate del acto 2. No hay fade: hay un objeto que
//      se come el cuadro.
//
//  A2  LOS 200 QUE SE PUDREN  f204  → f579   (376f · 12,5 s)  [cobertura total]
//      enterFrom  cam {z 1.045, panX +14, ry +3.6}  luz 0.494  materia: la ficha del caño, ya
//                 full-bleed, que se vuelve la pared del cliente
//      exitTo     cam {z 1.070, panX  -4, ry +1.1}  luz 0.455  materia: LA LOSA DEL 200, podrida
//                 por la mancha, girada y apagada
//      ── FRONTERA 2 · f580 · OCLUSIÓN ─────────────────────────────────────────────────────────
//      Cruza el CUERO DEL DELANTAL de Claudio (#6E4A2C, con su costura y sus remaches): es un
//      objeto de la escena, NO el color del fondo. Tapa el 100% ~7 frames. Cambio de tema fuerte
//      (de lo que no tomé a lo que sí cobré) → pide oclusión.
//
//  A3  LOS 35                 f580  → f811   (232f · 7,7 s)   [cobertura total]
//      enterFrom  cam {z 1.045, panX  -8, ry +0.6}  luz 0.455  materia: LA LOSA DEL 200 (heredada,
//                 ahora gris, empujada a z −520: enorme al fondo y muerta)
//      exitTo     cam {z 1.062, panX -14, ry -0.3}  luz 0.428  materia: LA FICHA DEL 35 (vidrio
//                 560×420 con el clip del apretón de manos)
//      ── FRONTERA 3 · f812 · MATCH-SHAPE ──────────────────────────────────────────────────────
//      La ficha del 35 (rectángulo) gira sobre Y y se AGRANDA hasta ser el panel de la pared del
//      acto 4: el mismo elemento, mismos bordes, misma sombra, interpolado. El material de adentro
//      conmuta en f828, cuando la ficha ya tapa >70% del cuadro y el swap queda enmascarado.
//
//  A4  LA CAUSA CORTADA · 260 f812  → f1169  (358f · 11,9 s)  [cobertura total]
//      enterFrom  cam {z 1.062, panX -14, ry -0.3}  luz 0.428  materia: la ficha del 35 ya
//                 convertida en PANEL DE PARED
//      exitTo     cam {z 1.058, panX -104, ry -2.6} luz 0.379  materia: EL PANEL DE PARED, que ya
//                 viene viajando a la izquierda con la cámara paneando
//      SALTO TEMPORAL DE 3 SEMANAS: se resuelve con LA LUZ y LA PARED, no con un cartel.
//      La mancha húmeda sobre el panel se SECA (multiply 0.62 → 0) entre f880 y f1000 mientras
//      un haz rasante barre la pared de izquierda a derecha (f880→f975): el sol se movió.
//      ── FRONTERA 4 · f1170 · MATCH-MOVE ──────────────────────────────────────────────────────
//      La cámara ya viene paneando a la derecha desde f1000. En f1170 el panel de pared sigue su
//      vector y se va por izquierda a 2,4× la velocidad de la cámara; detrás, ya montada desde
//      f1160, está la vereda con los dos vecinos. Se revela por paralaje, no por fundido.
//
//  A5  LOS DOS VECINOS        f1170 → f1364  (195f · 6,5 s)   [cobertura total]
//      enterFrom  cam {z 1.058, panX -104, ry -2.6} luz 0.379  materia: el panel saliendo + la
//                 jamba oscura del primer término que queda de la pared anterior
//      exitTo     cam {z 1.064, panX -120, ry -3.2} luz 0.366  materia: LA VEREDA (clip de los dos
//                 vecinos) que se hunde a z −700 y se apaga para volverse la cama de la frase
//      ── FRONTERA 5 · f1365 · CORTE EN EL BEAT ────────────────────────────────────────────────
//      Corte seco EXACTO en «Les contó…». Plano general → MACRO tipográfico: escala claramente
//      distinta (no hay salto de eje), la luz aterriza en el mismo valor a los dos lados y el
//      material de la vereda sigue ahí atrás, sólo que lejos y hundido.
//
//  A6  LA FRASE (TEXTUAL)     f1365 → f1517  (153f · 5,1 s)   [cobertura total]
//      enterFrom  cam {z 1.064, panX -120, ry -3.2} luz 0.366  materia: la vereda hundida
//      exitTo     cam {z 1.115, panX  -60, ry -4.0} luz 0.350  materia: LA FRASE a medio escribir
//                 + las dos fichas de los vecinos encendidas → se la entrega a MovCierre
//      La frase se escribe a 9 frames por palabra (el ritmo real del habla): el movimiento
//      TERMINA con la cita todavía escribiéndose. Eso es el handoff.
//
//  ── ASSETS (verificados en disco) ──────────────────────────────────────────────────────────
//  img : s405 s409 s410 s411 s412 s413 s414 s415 s416 s435 s436   (todas verificadas en disco)
//  clip: s405 s409 s410 s411 s412 s413 s414 s416
//  ⚠️ s415 y s435 NO tienen .mp4 en disco (el json los lista, el disco no): van SÓLO como foto.
// ════════════════════════════════════════════════════════════════════════════════════════════
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing,
} from "remotion";
import { C, FONT, cam, camStyle, luz, Atmos, Glass, Head, Kick, Occluder, rampIn, rng } from "./Stage";

const DUR = 1518;
// fronteras de acto (frame GLOBAL del movimiento)
const A2 = 204, A3 = 580, A4 = 812, A5 = 1170, A6 = 1365;

const IMG = (n: string) => staticFile(`img/clembudo/${n}.png`);
const CLIP = (n: string) => staticFile(`broll/clembudo/${n}.mp4`);

const ez = Easing.inOut(Easing.cubic);
const ramp = (f: number, a: number, b: number, va: number, vb: number, e = ez) =>
  interpolate(f, [a, b], [va, vb], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// ── MATERIAL REAL ────────────────────────────────────────────────────────────────────────────
// ⛔ `OffthreadVideo`, NUNCA `<Video>`. Y `loop` no es prop suyo: los clips duran 5,04 s (151 f),
// así que cada ventana de clip se monta ≤146 frames con su Sequence propia (para que el clip
// arranque en su segundo 0) y SIEMPRE con una <Img> debajo: si el clip no está montado, no hay hueco.
const ClipWin: React.FC<{ name: string; from: number; dur: number; pos?: string }> = ({ name, from, dur, pos = "50% 50%" }) => (
  <Sequence from={from} durationInFrames={Math.min(dur, 146)} layout="none">
    <OffthreadVideo
      src={CLIP(name)}
      muted
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }}
    />
  </Sequence>
);

// foto base + ventanas de clip encima, con Ken-Burns propio (hold VIVO)
const Mat: React.FC<{
  img: string; wins?: { name: string; from: number; dur: number }[];
  kb?: number; pos?: string; f: number; grade?: string;
}> = ({ img, wins = [], kb = 0.05, pos = "50% 50%", f, grade }) => {
  const s = 1 + kb * (0.5 + 0.5 * Math.sin(f / 210));
  const dx = Math.sin(f / 168) * 10 * (kb > 0 ? 1 : 0);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx}px) scale(${s})`, willChange: "transform" }}>
        <Img src={IMG(img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
        {wins.map((w) => (
          <ClipWin key={w.name + w.from} name={w.name} from={w.from} dur={w.dur} pos={pos} />
        ))}
      </div>
      {grade ? <div style={{ position: "absolute", inset: 0, background: grade }} /> : null}
    </div>
  );
};

// ── PLANO DE PROFUNDIDAD (cada capa con su PARALAJE propio) ─────────────────────────────────
const Plane: React.FC<{ z: number; par?: number; children: React.ReactNode; style?: React.CSSProperties }> =
  ({ z, par = 1, children, style }) => {
    const f = useCurrentFrame();
    const dx = Math.sin(f / 88) * 7 * par + Math.sin(f / 157) * 3.4 * par;
    const dy = Math.cos(f / 109) * 4.6 * par;
    return (
      <div
        style={{
          position: "absolute", inset: 0,
          transform: `translate3d(${dx}px, ${dy}px, ${z}px)`,
          transformStyle: "preserve-3d", willChange: "transform", ...style,
        }}
      >
        {children}
      </div>
    );
  };

// texto que entra con barrido + subida (⛔ nunca un fade del cuadro entero)
const Reveal: React.FC<{ at: number; children: React.ReactNode; len?: number }> = ({ at, children, len = 13 }) => {
  const f = useCurrentFrame();
  if (f < at - 2) return null;
  const k = ramp(f, at, at + len, 0, 1, Easing.out(Easing.cubic));
  return (
    <div
      style={{
        transform: `translateY(${(1 - k) * 22}px)`,
        opacity: k,
        clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`,
      }}
    >
      {children}
    </div>
  );
};

// cama oscura bajo el texto (legibilidad +60 sobre b-roll y sobre el avatar)
const Bed: React.FC<{ children: React.ReactNode; w?: number }> = ({ children, w = 1180 }) => (
  <div
    style={{
      width: w, padding: "22px 34px 26px 30px",
      background: "linear-gradient(92deg, rgba(26,22,17,0.78) 0%, rgba(26,22,17,0.58) 62%, rgba(26,22,17,0) 100%)",
      borderLeft: `4px solid ${C.gold}`,
    }}
  >
    {children}
  </div>
);

// numeral protagonista, SIEMPRE montado sobre material real (nunca forma + texto solos)
const Numeral: React.FC<{ v: string; size: number; color: string; dead?: number }> = ({ v, size, color, dead = 0 }) => (
  <div
    style={{
      fontFamily: FONT, fontSize: size, lineHeight: 0.86, fontWeight: 800,
      color, letterSpacing: -size * 0.03,
      textShadow: dead > 0.4
        ? "0 3px 0 rgba(20,18,14,0.5), 0 16px 46px rgba(20,18,14,0.62)"
        : `0 2px 0 rgba(20,18,14,0.55), 0 0 ${size * 0.22}px rgba(255,236,196,0.34), 0 18px 52px rgba(20,18,14,0.62)`,
    }}
  >
    {v}
  </div>
);

// ── EL DELANTAL DE CUERO QUE CRUZA (costura de OCLUSIÓN, frontera 2) ────────────────────────
// ⛔⛔ El color NO puede ser el del fondo: eso hace un fundido a negro y se ve un flash.
// Esta banda ES el cuero del delantal de Claudio: #6E4A2C, con su costura clara y sus remaches.
const LEATHER = "#6E4A2C";
const StrapDetail: React.FC<{ at: number; len: number; angle: number }> = ({ at, len, angle }) => {
  const f = useCurrentFrame();
  if (f < at - len || f > at + len) return null;
  const k = interpolate(f, [at - len, at + len], [-140, 140], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute", left: `${k}%`, top: "-30%", width: "150%", height: "160%",
        transform: `rotate(${angle}deg)`, pointerEvents: "none",
      }}
    >
      {/* costura clara del delantal */}
      <div style={{ position: "absolute", left: "16%", right: "16%", top: "27%", height: 3, background: "rgba(226,203,160,0.55)" }} />
      <div style={{ position: "absolute", left: "16%", right: "16%", bottom: "27%", height: 3, background: "rgba(226,203,160,0.42)" }} />
      {/* volumen del cuero */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,235,200,0.16) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0.30) 78%, rgba(0,0,0,0.46) 100%)" }} />
      {/* remaches */}
      {[0.24, 0.38, 0.52, 0.66, 0.8].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: `${p * 100}%`, top: "48%", width: 15, height: 15, borderRadius: "50%",
            background: "radial-gradient(60% 60% at 36% 32%, #E3CDA4 0%, #9A7B4E 55%, #4A341F 100%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        />
      ))}
    </div>
  );
};

export const MovCaso35: React.FC = () => {
  const f = useCurrentFrame();

  // ── UNA SOLA CÁMARA, función del frame GLOBAL. El acto N hereda del N−1. ────────────────────
  // Arco global con `cam()` de Stage + deltas por tramo con NUDOS COMPARTIDOS en las fronteras
  // (la suma es continua por construcción: ningún acto reinicia nada en 0).
  const base = cam(f, DUR,
    { z: 1.02, panX: 26, panY: 10, ry: 5.0, rx: -1.5 },
    { z: 1.10, panX: -34, panY: -12, ry: -4.0, rx: 1.2 });

  const dz = interpolate(
    f, [0, A2, 430, A3, 640, A4, 1000, A5, A6, 1440, DUR],
    [0, 0.018, 0.040, 0.008, -0.006, 0.004, 0.030, -0.012, -0.006, 0.030, 0.048],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });

  // MATCH-MOVE de la frontera 4: la cámara ya viene paneando a la derecha desde f1000
  const dpanX = interpolate(
    f, [0, A4, 1000, A5, 1260, A6, DUR],
    [0, 0, 0, -68, -112, -96, -34],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });

  const cm = { ...base, z: base.z + dz, panX: base.panX + dpanX };

  // ── UNA SOLA LUZ, que EVOLUCIONA 0.50 → 0.35 y nunca salta ─────────────────────────────────
  const t = luz(f, DUR, 0.50, 0.35);
  const entrada = rampIn(f, 14);

  // ── A1 · la ficha del caño (MATERIA que cruza la frontera 1 con ZOOM-THROUGH) ───────────────
  // Un ÚNICO elemento interpolado: ficha del tercio derecho → pantalla completa → plate del A2.
  const zt = ramp(f, 186, 246, 0, 1, Easing.bezier(0.62, 0.02, 0.2, 1)); // zoom-through
  const fichaX = ramp(zt, 0, 1, 1280, -300), fichaY = ramp(zt, 0, 1, 150, -180);
  const fichaW = ramp(zt, 0, 1, 480, 2520), fichaH = ramp(zt, 0, 1, 600, 1440);
  const fichaZ = ramp(zt, 0, 1, 70, -470), fichaRy = ramp(zt, 0, 1, -9, 0);
  const fichaVive = f < 586; // en A2 la ficha YA ES la pared; muere TAPADA por el cuero (f580)

  // ── A2 · la losa del 200 (MATERIA que cruza la frontera 2) ─────────────────────────────────
  const losaIn = ramp(f, 238, 254, 0, 1, Easing.out(Easing.poly(3)));
  const podrido = ramp(f, 340, 528, 0, 1);                 // se pudre: mancha + gris
  const losaX = ramp(f, 500, 660, 760, 470);               // y se va al fondo en A3
  const losaY = ramp(f, 500, 660, 246, 176);
  const losaW = ramp(f, 500, 660, 800, 980);
  const losaH = ramp(f, 500, 660, 580, 700);
  const losaZ = ramp(f, 500, 660, -30, -520);
  const losaRy = ramp(f, 320, 660, 0, 11);
  const losaRx = ramp(f, 332, 560, 0, 9);
  const losaVive = f < 880;

  // ── A3 · la ficha del 35 → (MATCH-SHAPE) → el panel de pared del A4 ────────────────────────
  const ms = ramp(f, 800, 858, 0, 1, Easing.bezier(0.58, 0.04, 0.18, 1));
  const panelSale = ramp(f, A5 - 6, 1272, 0, 1, Easing.inOut(Easing.poly(3))); // MATCH-MOVE
  const pnX = ramp(ms, 0, 1, 980, -300) - panelSale * 2760;
  const pnY = ramp(ms, 0, 1, 470, -180);
  const pnW = ramp(ms, 0, 1, 560, 2520);
  const pnH = ramp(ms, 0, 1, 420, 1440);
  const pnZ = ramp(ms, 0, 1, 140, -460);
  const pnRy = ramp(f, 806, 862, -8, 0);
  const treintaycinco = f >= 596 && f < 836;   // el numeral 35 vive mientras la ficha es ficha
  const panelVive = f < 1296;

  // el material de adentro conmuta cuando la ficha ya tapa >70% (swap enmascarado por el movimiento)
  const panelEtapa = f < 828 ? 0 : f < 968 ? 1 : 2;

  // secado de la pared (SALTO TEMPORAL DE 3 SEMANAS, con la luz y la pared)
  const humedad = ramp(f, 880, 1000, 0.62, 0);
  const rasante = ramp(f, 880, 975, -30, 130, Easing.inOut(Easing.sin));

  // ── A5 · la vereda ─────────────────────────────────────────────────────────────────────────
  const veredaZ = ramp(f, A6 - 4, A6 + 26, -540, -720);
  const veredaScrim = ramp(f, A6 - 4, A6 + 22, 0.12, 0.68);

  // ── A6 · la frase, protagonista tipográfica ────────────────────────────────────────────────
  const PALABRAS = ["Vino", "uno", "que", "me", "dijo", "que", "no", "era", "su", "trabajo."];
  const comillaIn = ramp(f, 1438, 1456, 0, 1, Easing.out(Easing.poly(4)));

  return (
    <AbsoluteFill style={{ opacity: entrada, fontFamily: FONT }}>
      {/* ════ EL ESPACIO ÚNICO. Una sola cámara, una sola atmósfera, nunca se remontan. ════ */}
      <AbsoluteFill style={camStyle(cm)}>

        {/* ── L0 · fondo lejano: la pared del cliente (sólo desde A2; en A1 se ve el avatar) ── */}
        {f >= 190 && f < A5 + 130 ? (
          <Plane z={-720} par={0.35}>
            <div style={{ position: "absolute", left: -320, top: -200, width: 2560, height: 1480, opacity: 0.85 }}>
              <Mat img="clembudo_s410" f={f} kb={0.03} grade="linear-gradient(180deg, rgba(20,17,13,0.52) 0%, rgba(20,17,13,0.72) 100%)" />
            </div>
          </Plane>
        ) : null}

        {/* ── L1 · A5: LA VEREDA con los dos vecinos (montada ANTES de la frontera 4: el panel
               la revela por paralaje, no por fundido) ─────────────────────────────────────── */}
        {f >= 1160 ? (
          <Plane z={f < A6 ? -540 : veredaZ} par={0.55}>
            <div style={{ position: "absolute", left: -300, top: -180, width: 2520, height: 1440 }}>
              {/* ⚠️ `clembudo_s415` NO tiene clip en disco (sólo foto): va como plate con
                  Ken-Burns fuerte, y el movimiento real del acto lo pone la ficha de al lado. */}
              <Mat
                img="clembudo_s415"
                f={f} kb={0.10}
                grade={`linear-gradient(180deg, rgba(22,19,14,${0.22 + veredaScrim * 0.5}) 0%, rgba(22,19,14,${0.40 + veredaScrim * 0.5}) 100%)`}
              />
            </div>
          </Plane>
        ) : null}

        {/* ── L2 · LA FICHA DEL CAÑO → (ZOOM-THROUGH) → el plate del acto 2 ────────────────── */}
        {fichaVive ? (
          <Plane z={0} par={zt > 0.5 ? 0.5 : 1.15}>
            <Glass x={fichaX} y={fichaY} w={fichaW} h={fichaH} z={fichaZ} ry={fichaRy} radius={zt > 0.86 ? 0 : 16} lift={1 - zt * 0.82}>
              <Mat
                img={f < 236 ? "clembudo_s410" : "clembudo_s409"}
                wins={f < 236
                  ? [{ name: "clembudo_s410", from: 10, dur: 146 }]
                  : [{ name: "clembudo_s409", from: 246, dur: 146 }, { name: "clembudo_s410", from: 396, dur: 146 }]}
                f={f} kb={0.06}
                grade={`linear-gradient(196deg, rgba(20,17,13,0.10) 0%, rgba(20,17,13,${0.30 + t * 0.26}) 100%)`}
              />
            </Glass>
          </Plane>
        ) : null}

        {/* ── L3 · EL AGUA QUE SIGUE ENTRANDO (mancha que crece sobre el plate) ───────────── */}
        {f >= 386 && f < 700 ? (
          <Plane z={-300} par={0.7} style={{ mixBlendMode: "multiply", opacity: ramp(f, 386, 470, 0, 0.58) * ramp(f, 640, 700, 1, 0) }}>
            <Img
              src={IMG("clembudo_s435")}
              style={{ position: "absolute", left: 40, top: -120, width: 1840, height: 1320, objectFit: "cover" }}
            />
          </Plane>
        ) : null}

        {/* ── ATMÓSFERA: montada UNA vez para todo el movimiento, jamás se remonta ────────── */}
        <Atmos t={t} dust={30} />

        {/* ── L4 · LA LOSA DEL 200: entra enorme, se pudre, y sobrevive a la frontera 2 ───── */}
        {losaVive && f >= 232 ? (
          <Plane z={0} par={losaZ < -300 ? 0.55 : 1.05}>
            <div style={{ transform: `translateY(${(1 - losaIn) * 46}px) scale(${0.9 + losaIn * 0.1})`, transformStyle: "preserve-3d", opacity: losaIn }}>
              <Glass x={losaX} y={losaY} w={losaW} h={losaH} z={losaZ} ry={losaRy} rx={losaRx} radius={14} lift={1.15 - podrido * 0.5}>
                <Mat
                  img="clembudo_s405"
                  wins={[{ name: "clembudo_s405", from: 252, dur: 132 }]}
                  f={f} kb={0.04}
                  grade={`linear-gradient(180deg, rgba(18,16,12,${0.26 + podrido * 0.30}) 0%, rgba(18,16,12,${0.52 + podrido * 0.30}) 100%)`}
                />
                {/* el moho que se la come — foto real, multiply */}
                <Img
                  src={IMG("clembudo_s435")}
                  style={{
                    position: "absolute", left: "-6%", top: "-10%", width: "118%", height: "126%",
                    objectFit: "cover", mixBlendMode: "multiply", opacity: podrido * 0.78,
                  }}
                />
                {/* gris de muerte */}
                <div style={{ position: "absolute", inset: 0, background: `rgba(64,62,54,${podrido * 0.42})` }} />
                {/* el numeral, sobre su material */}
                <div style={{ position: "absolute", left: 44, bottom: 40 }}>
                  <Numeral
                    v="200"
                    size={losaW * 0.44}
                    color={podrido > 0.5 ? `rgba(196,189,170,${1 - podrido * 0.42})` : "#F6E9C8"}
                    dead={podrido}
                  />
                  <div style={{ marginTop: 6, opacity: 0.9 - podrido * 0.4 }}>
                    <Kick size={26} color={podrido > 0.5 ? "rgba(206,198,176,0.7)" : C.accentSoft}>Lo que me ofrecían</Kick>
                  </div>
                </div>
                {/* la palma que lo frena: rim de luz que se apaga con el podrido */}
                <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${90}px rgba(255,232,186,${0.20 * (1 - podrido)})` }} />
              </Glass>
            </div>
          </Plane>
        ) : null}

        {/* ── L5 · LA FICHA DEL 35 → (MATCH-SHAPE) → EL PANEL DE PARED del acto 4 ─────────── */}
        {panelVive && f >= 574 ? (
          <Plane z={0} par={ms > 0.6 ? 0.5 : 1.25}>
            <Glass
              x={pnX} y={pnY} w={pnW} h={pnH} z={pnZ} ry={pnRy}
              radius={ms > 0.86 ? 0 : 16} lift={1.25 - ms * 1.0}
            >
              {panelEtapa === 0 ? (
                <Mat
                  img={f < 700 ? "clembudo_s411" : "clembudo_s412"}
                  wins={f < 700
                    ? [{ name: "clembudo_s411", from: 600, dur: 96 }]
                    : [{ name: "clembudo_s412", from: 702, dur: 124 }]}
                  f={f} kb={0.07}
                  grade="linear-gradient(184deg, rgba(20,17,13,0.06) 0%, rgba(20,17,13,0.46) 100%)"
                />
              ) : panelEtapa === 1 ? (
                <Mat
                  img="clembudo_s413"
                  wins={[{ name: "clembudo_s413", from: 830, dur: 136 }]}
                  f={f} kb={0.05}
                  grade="linear-gradient(180deg, rgba(20,17,13,0.30) 0%, rgba(20,17,13,0.58) 100%)"
                />
              ) : (
                <Mat
                  img="clembudo_s414"
                  wins={[{ name: "clembudo_s414", from: 972, dur: 146 }]}
                  f={f} kb={0.05}
                  grade="linear-gradient(180deg, rgba(20,17,13,0.20) 0%, rgba(20,17,13,0.50) 100%)"
                />
              )}

              {/* LA HUMEDAD QUE SE SECA — 3 semanas sin cartel: la pared se seca y el sol se mueve */}
              {f >= 828 && humedad > 0.002 ? (
                <Img
                  src={IMG("clembudo_s435")}
                  style={{
                    position: "absolute", left: "-4%", top: "-6%", width: "112%", height: "118%",
                    objectFit: "cover", mixBlendMode: "multiply", opacity: humedad,
                  }}
                />
              ) : null}
              {f >= 870 && f < 990 ? (
                <div
                  style={{
                    position: "absolute", inset: 0, mixBlendMode: "screen",
                    background: `linear-gradient(101deg, rgba(255,244,214,0) ${rasante - 22}%, rgba(255,244,214,0.30) ${rasante}%, rgba(255,244,214,0) ${rasante + 22}%)`,
                  }}
                />
              ) : null}

              {/* el 35: chiquito, pero LIMPIO y ENCENDIDO */}
              {treintaycinco ? (
                <div style={{ position: "absolute", left: 34, bottom: 30, opacity: ramp(f, 596, 612, 0, 1) * ramp(f, 826, 838, 1, 0) }}>
                  <Numeral v="35" size={168} color="#FFF3D4" />
                  <div style={{ marginTop: 2 }}>
                    <Kick size={24} color={C.accentSoft}>{f < 700 ? "Sólo el diagnóstico" : "Llamá a un plomero"}</Kick>
                  </div>
                </div>
              ) : null}
            </Glass>
          </Plane>
        ) : null}

        {/* ── L6 · LOS 260: sobre la pared ya seca, aceptados ─────────────────────────────── */}
        {f >= 946 && f < 1210 ? (
          <Plane z={0} par={1.3}>
            <div
              style={{
                opacity: ramp(f, 950, 964, 0, 1) * ramp(f, 1178, 1206, 1, 0),
                transform: `translateY(${ramp(f, 950, 970, 40, 0)}px) translateX(${ramp(f, 1120, 1206, 0, -210)}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <Glass x={1040} y={286} w={620} h={468} z={110} ry={-6} rx={2} radius={14} lift={1.3}>
                <Mat
                  img="clembudo_s405"
                  wins={[{ name: "clembudo_s405", from: 968, dur: 140 }]}
                  f={f} kb={0.05}
                  grade="linear-gradient(180deg, rgba(18,16,12,0.24) 0%, rgba(18,16,12,0.56) 100%)"
                />
                <div style={{ position: "absolute", left: 36, bottom: 34 }}>
                  <Numeral v="260" size={240} color="#FFF0CC" />
                  <div style={{ marginTop: 4 }}>
                    <Kick size={25} color={C.accentSoft}>Trabajo completo</Kick>
                  </div>
                </div>
                <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 110px rgba(255,232,186,0.22)" }} />
              </Glass>
            </div>
          </Plane>
        ) : null}

        {/* ── L7 · LA GARANTÍA FIRMADA (el papel que quedaba con mi firma) ────────────────── */}
        {f >= 522 && f < 596 ? (
          <Plane z={0} par={1.35}>
            <div style={{ opacity: ramp(f, 526, 540, 0, 1), transform: `rotate(${ramp(f, 526, 578, -5.4, -3.2)}deg) translateY(${ramp(f, 526, 544, 44, 0)}px)`, transformStyle: "preserve-3d" }}>
              <Glass x={1114} y={678} w={560} h={252} z={120} ry={-9} rx={4} radius={8} lift={1.35}>
                <Mat img="clembudo_s436" f={f} kb={0.03} grade="linear-gradient(180deg, rgba(20,17,13,0.10) 0%, rgba(20,17,13,0.42) 100%)" />
                <div style={{ position: "absolute", left: 26, bottom: 22, right: 26 }}>
                  <Kick size={23} color="#EFE2BF">Garantía firmada</Kick>
                  <div style={{ marginTop: 10, height: 2, background: "rgba(239,226,191,0.55)", width: `${ramp(f, 536, 566, 0, 88)}%` }} />
                </div>
              </Glass>
            </div>
          </Plane>
        ) : null}

        {/* ── L7b · A5: la ficha del vecino que ya llamó (el único clip vivo del acto) ───── */}
        {f >= 1228 && f < 1364 ? (
          <Plane z={0} par={1.3}>
            <div
              style={{
                opacity: ramp(f, 1232, 1248, 0, 1) * ramp(f, 1346, 1362, 1, 0),
                transform: `translateY(${ramp(f, 1232, 1252, 38, 0)}px) translateX(${ramp(f, 1232, 1360, 26, -54)}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <Glass x={1272} y={300} w={452} h={358} z={90} ry={-8} rx={2} radius={12} lift={1.3}>
                <Mat
                  img="clembudo_s416"
                  wins={[{ name: "clembudo_s416", from: 1234, dur: 124 }]}
                  f={f} kb={0.05}
                  grade="linear-gradient(180deg, rgba(20,17,13,0.14) 0%, rgba(20,17,13,0.50) 100%)"
                />
                <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 80px rgba(255,226,170,0.20)" }} />
              </Glass>
            </div>
          </Plane>
        ) : null}

        {/* ── L8 · A6: LAS DOS FICHAS QUE SE ENCIENDEN — el oficio multiplicándose ────────── */}
        {f >= 1462 ? (
          <Plane z={0} par={1.2}>
            {[
              { img: "clembudo_s415", x: 1120, at: 1470 },
              { img: "clembudo_s416", x: 1436, at: 1490 },
            ].map((v, i) => {
              const k = ramp(f, v.at, v.at + 16, 0, 1, Easing.out(Easing.poly(3)));
              const pulso = 0.5 + 0.5 * Math.sin((f - v.at) / 6);
              return (
                <div key={i} style={{ opacity: k, transform: `translateY(${(1 - k) * 28}px)`, transformStyle: "preserve-3d" }}>
                  <Glass x={v.x} y={806} w={286} h={182} z={100} ry={i === 0 ? 7 : -7} radius={10} lift={1.2}>
                    <Mat img={v.img} f={f} kb={0.04} grade="linear-gradient(180deg, rgba(20,17,13,0.16) 0%, rgba(20,17,13,0.52) 100%)" />
                    <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 70px rgba(255,214,140,${0.18 + pulso * 0.26})` }} />
                    <div style={{ position: "absolute", left: 16, bottom: 12 }}>
                      <Kick size={19} color="#F0DDB4">{i === 0 ? "Vecino 1" : "Vecina 2"}</Kick>
                    </div>
                  </Glass>
                </div>
              );
            })}
          </Plane>
        ) : null}

        {/* ── L9 · TIPOGRAFÍA (una idea por acto, ≤7 palabras) ────────────────────────────── */}
        <Plane z={150} par={1.5}>
          {/* A1 — el avatar se VE: todo va en el tercio inferior/izquierdo, nunca en la boca */}
          {f < 214 ? (
            <div style={{ position: "absolute", left: 250, bottom: 118, opacity: ramp(f, 196, 212, 1, 0) }}>
              <Reveal at={30}>
                <Bed w={980}>
                  <Kick size={27}>La causa</Kick>
                  <div style={{ height: 12 }} />
                  <Head size={82}>No es mi trabajo.</Head>
                </Bed>
              </Reveal>
            </div>
          ) : null}

          {/* A2 — la tentación */}
          {f >= 330 && f < 592 ? (
            <div style={{ position: "absolute", left: 250, bottom: 132, opacity: ramp(f, 564, 584, 1, 0) }}>
              <Reveal at={336}>
                <Bed w={880}>
                  <Kick size={27}>La tentación</Kick>
                  <div style={{ height: 12 }} />
                  <Head size={78}>Tomarlos era fracasar.</Head>
                </Bed>
              </Reveal>
            </div>
          ) : null}

          {/* A3 — lo que cobré */}
          {f >= 620 && f < 828 ? (
            <div style={{ position: "absolute", left: 250, bottom: 128, opacity: ramp(f, 800, 824, 1, 0) }}>
              <Reveal at={626}>
                <Bed w={900}>
                  <Kick size={27}>Lo que cobré</Kick>
                  <div style={{ height: 12 }} />
                  <Head size={76}>Treinta y cinco dólares.</Head>
                </Bed>
              </Reveal>
            </div>
          ) : null}

          {/* A4 — la causa cortada */}
          {f >= 1086 && f < 1196 ? (
            <div style={{ position: "absolute", left: 250, bottom: 130, opacity: ramp(f, 1168, 1192, 1, 0) }}>
              <Reveal at={1092}>
                <Bed w={980}>
                  <Kick size={27}>Salió perfecto</Kick>
                  <div style={{ height: 12 }} />
                  <Head size={78}>Ahora la causa estaba cortada.</Head>
                </Bed>
              </Reveal>
            </div>
          ) : null}

          {/* A5 — lo mejor */}
          {f >= 1228 && f < A6 ? (
            <div style={{ position: "absolute", left: 250, bottom: 126 }}>
              <Reveal at={1234}>
                <Bed w={1010}>
                  <Kick size={27}>Lo mejor no fue el trabajo</Kick>
                  <div style={{ height: 12 }} />
                  <Head size={76}>Se lo contó a dos vecinos.</Head>
                </Bed>
              </Reveal>
            </div>
          ) : null}
        </Plane>

        {/* ── L10 · A6 — LA FRASE. Acá la tipografía ES el protagonista y el material va atrás. */}
        {f >= A6 ? (
          <Plane z={200} par={1.7}>
            {/* la comilla, en cuero, tratada como objeto de la escena */}
            <div
              style={{
                position: "absolute", left: 214, top: 176,
                fontFamily: FONT, fontSize: 430, lineHeight: 0.6, color: C.gold,
                opacity: comillaIn * 0.85,
                transform: `translateY(${(1 - comillaIn) * 40}px) scale(${0.86 + comillaIn * 0.14})`,
                textShadow: "0 10px 44px rgba(18,15,11,0.7)",
              }}
            >
              &ldquo;
            </div>

            <div style={{ position: "absolute", left: 268, top: 330, width: 1400 }}>
              <div style={{ opacity: ramp(f, A6 + 2, A6 + 16, 0, 1) }}>
                <Kick size={28} color={C.accentSoft}>Textual</Kick>
              </div>
              <div style={{ height: 26 }} />
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {PALABRAS.map((w, i) => {
                  const at = 1464 + i * 9;
                  const k = ramp(f, at, at + 11, 0, 1, Easing.out(Easing.poly(4)));
                  if (k <= 0.001) return null;
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: k,
                        transform: `translateY(${(1 - k) * 26}px)`,
                        marginRight: 24, marginBottom: 6,
                      }}
                    >
                      <Head size={96} color="#FBF2DC">{w}</Head>
                    </div>
                  );
                })}
                {/* cursor de la cita: sigue escribiéndose cuando el movimiento termina (handoff) */}
                <div
                  style={{
                    width: 8, height: 92, marginTop: 6,
                    background: C.gold,
                    opacity: f >= 1470 ? (Math.floor(f / 9) % 2 === 0 ? 0.9 : 0.25) : 0,
                  }}
                />
              </div>
            </div>
          </Plane>
        ) : null}

        {/* ── L11 · PRIMER TÉRMINO: la jamba de la puerta (profundidad real, no decoración) ── */}
        <Plane z={300} par={2.1}>
          <div
            style={{
              position: "absolute", left: -30, top: -120, width: ramp(f, A5, 1280, 130, 210), height: 1340,
              background: "linear-gradient(90deg, rgba(18,15,11,0.86) 0%, rgba(18,15,11,0.52) 62%, rgba(18,15,11,0) 100%)",
              opacity: f < 210 ? 0.22 : 0.5,
            }}
          />
          <div
            style={{
              position: "absolute", right: -30, top: -120, width: 170, height: 1340,
              background: "linear-gradient(270deg, rgba(18,15,11,0.80) 0%, rgba(18,15,11,0.44) 62%, rgba(18,15,11,0) 100%)",
              opacity: f < 210 ? 0.18 : 0.46,
            }}
          />
          {/* mota gorda de polvo del primer término (hold VIVO, determinística) */}
          {new Array(9).fill(0).map((_, i) => {
            const sx = rng(303, i), sy = rng(407, i), sp = 0.3 + rng(509, i) * 0.7;
            const y = ((sy * 1200 + f * sp * 9) % 1320) - 120;
            const x = sx * 1920 + Math.sin((f + i * 53) / 64) * 52;
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: x, top: y,
                  width: 4 + rng(601, i) * 6, height: 4 + rng(601, i) * 6, borderRadius: "50%",
                  background: "#FFF4DC", opacity: 0.07 + rng(701, i) * 0.10,
                }}
              />
            );
          })}
        </Plane>
      </AbsoluteFill>

      {/* ════ COSTURA · FRONTERA 2 (f580) · OCLUSIÓN con EL CUERO DEL DELANTAL ════
          ⛔⛔ Jamás el color del fondo: eso es un fundido a negro y se ve el flash.
          La banda ES el delantal de Claudio (#6E4A2C) con su costura y sus remaches.
          Va FUERA de la cámara: tiene que tapar el 100% del cuadro pase lo que pase. */}
      <Occluder at={A3} len={11} color={LEATHER} angle={-7} />
      <StrapDetail at={A3} len={11} angle={-7} />

      {/* lente: viñeta fija a nivel óptico (no es atmósfera, no se remonta nada) */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(134% 94% at 50% 48%, rgba(0,0,0,0) 54%, rgba(20,17,12,0.34) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
