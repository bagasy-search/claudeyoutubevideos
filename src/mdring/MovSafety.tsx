// MovSafety.tsx — MIKE DALTON · `mdring` · MOVIMIENTO 7 · BLOQUE DE SEGURIDAD
// 840 frames @ 30 fps (28 s). UN SOLO MOVIMIENTO CONTINUO, no cuatro tarjetas.
//
// LA IDEA: el accidente real no es volcar dos botellas a propósito. Es limpiar con un gel, que no
// funcione, NO DESCARGAR, y echar lejía encima. La materia que cruza todo el movimiento es EL VAPOR:
// nace del gel (f104), vira a verde-amarillo cuando cae la lejía (f150+), LO BARRE LA DESCARGA
// (f246-316) y vuelve como un hilo punzante del frasco bajo la pileta (f516-700).
//
// ⛔ ESTE MOVIMIENTO NO HACE CHISTES VISUALES. Las advertencias van derechas y legibles: cada regla
//    entra entera, se sostiene el tiempo de leerla, y no se superpone con la siguiente.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────────
// ENTRA (del MovCta) { cam: z −160 · lavadero · luz FRÍA · nada de rojo todavía }
//
// ACTO 1 · f0–190 · "NEVER MIX"                              material: h64 (video) × h66/h68/h65
//   enterFrom { cam z≈−160, luz cold, materia: aire limpio }
//   f0    dos MediaCards nacen JUNTAS en el centro y SE SEPARAN en 3D (h64 izq · el par prohibido der)
//   f18   la X ROJA nace en el hueco entre las dos y crece
//   f60   el slot derecho se REMODELA por barrido: AMMONIA → GLASS CLEANER  (video h68, la ventana)
//   f104  ⭐ NACE EL VAPOR del borde inferior del slot derecho (frío, tenue)
//   f131  el slot derecho vuelve a barrer: → URINE (foto h65, la taza sin descargar)
//   f150  el vapor vira a VERDE-AMARILLO · la luz empieza a virar a ROJO
//   exitTo { cam sigue subiendo · luz cold→red 0.72 · materia: el vapor ya cruzó el cuadro y la
//            tarjeta derecha quedó CONGELADA en la taza }
//   ── COSTURA A @186 · MATCH-SHAPE ──────────────────────────────────────────────────────────────
//     La tarjeta derecha (FOTO img/mdring_h65) y la primera del acto 2 (VIDEO broll/mdring_h65)
//     comparten rect EXACTO (cx1440 cy520 560×330, ry −6) y son la MISMA toma: la foto se pone viva.
//     Sin fundido: no hay nada que fundir, es el mismo objeto que empieza a moverse.
//
// ACTO 2 · f186–360 · "FLUSH BEFORE THE BLEACH"              material: h65 (video, protagonista)
//   enterFrom { cam en curva · luz red 0.72 · materia: el vapor migra al interior de la taza }
//   f186  la tarjeta viaja al centro y crece a 968×500 (MATCH-MOVE interno del propio objeto)
//   f206  cae la LEJÍA (arco vector desde arriba-derecha) sobre la taza sin descargar
//   f246  ⭐ pico ROJO · el vapor a máxima densidad, verde-amarillo con rojo
//   f250  LA DESCARGA: lámina de agua dentro de la tarjeta · el vapor EMPIEZA A SER BARRIDO
//   exitTo { luz red→cold (la descarga limpia el aire) · materia: el agua sale de la tarjeta y se
//            vuelve la lámina que barre el cuadro entero }
//   ── COSTURA B @322–356 · WIPE POR MATERIA (SeamWipeMatter + lámina de agua) ────────────────────
//     El agua de la descarga barre de izq→der; detrás de la lámina ya está montado el acto 3.
//
// ACTO 3A · f322–520 · "NEVER IN ONE BOTTLE"                 material: h66 (video) · h64 · h65
//   enterFrom { cam en curva · luz COLD otra vez · materia: aire limpio, sin vapor }
//   f334  PEROXIDE (izq) y VINEGAR (der) SUBEN desde abajo (entrada distinta a la del acto 1)
//   f356  convergen hasta casi tocarse · f366 la X roja nace ENTRE ellas · f380 pico rojo corto
//   f398  se separan a las estaciones del RIEL y entra la tercera tarjeta: RINSE (video h65)
//   f430  la cabeza del riel recorre PEROXIDE → RINSE → VINEGAR (la secuencia SÍ permitida)
//   f496  la tarjeta RINSE cae fuera del riel: queda el HUECO entre las dos prohibidas
//   ── COSTURA C @500–518 · ZOOM-THROUGH ─────────────────────────────────────────────────────────
//     Atravesamos ese hueco (escala 1→5.6 con origen en 960/605) y salimos bajo la pileta.
//
// ACTO 3B · f504–678 · "IT MAKES PERACETIC ACID"             material: h64 (foto) → h67 (video)
//   enterFrom { escala 0.4→1 · luz cold→red · materia: el hilo de vapor punzante NACE del frasco }
//   f520  UN frasco alto bajo la pileta · empieza a CORROERSE (picaduras + línea de líquido roja)
//   f610  ⛔ COSTURA D · MATCH-MOVE: el frasco se va por el vector (down-left, rotando) y el GUANTE
//         (video h67) entra por el MISMO vector desde arriba-derecha y aterriza donde estaba
//   f622  chip "THAT IS A REAL BURN" (rojo, bajo el guante)
//   exitTo { cam z≈+120 · luz roja apagándose · materia: el vapor se adelgaza }
//   ── COSTURA E @666 · OCLUSIÓN (SeamOcclude + canto iluminado = la puerta del mueble) ───────────
//     La hoja tapa el 100% durante ~6 frames; detrás ya está montado el acto 4.
//
// ACTO 4 · f664–840 · "THREE PERCENT" + LAS 4 REGLAS         material: h66 (video) · lam_nevermix
//   enterFrom { cam z≈+130 · luz FRÍA con llave cálida local · materia: vapor casi muerto }
//   f670  titular "THREE PERCENT" · frasco marrón a contraluz (video h66) en la columna derecha
//   f690  ⭐ empiezan a APILARSE LAS 4 REGLAS a la izquierda (una cada 22 f) — nunca se superponen
//   f710  la LÁMINA REAL DE LA GUÍA (img/mdring_lam_nevermix.jpg) sube como página, el frasco
//         marrón se retira detrás y arriba (profundidad, no reemplazo)
//   f783  ⛔ COSTURA F · CORTE EN EL BEAT (SeamFlash + reencuadre duro de 1 frame + relight):
//         entra la tarjeta del 35% con la X roja encima
//   f776–840  HOLD LARGO: las 4 reglas quietas y legibles (46 px, cama oscura) mientras el único
//             movimiento del cuadro es el hilo de vapor a la derecha.
//
// SALE (al avatar) { cam z +180 · las 4 reglas legibles · hold largo · luz fría }
//
// ⛔ Sin Math.random/Date · sin backdrop-filter · sin blur grande full-screen · Easing.poly(5).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  RING, F_SANS, rgba, lerp, clamp01, rnd, gcam, light,
  RingAtmos, Layers, Plane, MediaCard, PhotoPlane,
  SeamOcclude, SeamWipeMatter, SeamFlash,
  Kick, Head, Em, Bed,
} from "./RingStage";

const W = 1920;
const H = 1080;

// ── TIEMPOS (anclados al guion) ─────────────────────────────────────────────────────────────────
const A2 = 186;          // MATCH-SHAPE
const WIPE_AT = 322;     // WIPE POR MATERIA (agua)
const WIPE_DUR = 34;
const ZOOM_AT = 500;     // ZOOM-THROUGH
const A3B = 504;
const MOVE_AT = 610;     // MATCH-MOVE
const OCC_AT = 666;      // OCLUSIÓN
const A4 = 664;
const CUT_AT = 783;      // CORTE EN EL BEAT

export const MOVSAFETY_FRAMES = 840;

// ── EASINGS + KEYFRAMES CON EASING PROPIO POR TRAMO ─────────────────────────────────────────────
type Ease = (t: number) => number;
const E = {
  soft: Easing.bezier(0.22, 0.61, 0.28, 1) as Ease,
  out: Easing.out(Easing.cubic) as Ease,
  inc: Easing.in(Easing.cubic) as Ease,
  inOut: Easing.inOut(Easing.cubic) as Ease,
  snap: Easing.bezier(0.86, 0.02, 0.12, 1) as Ease,
  glide: Easing.out(Easing.poly(5)) as Ease,   // ⛔ Easing.quint NO existe
  lin: Easing.linear as Ease,
};

const kf = (f: number, ts: number[], vs: number[], es?: Ease[]): number => {
  if (f <= ts[0]) return vs[0];
  const n = ts.length;
  for (let i = 0; i < n - 1; i++) {
    if (f <= ts[i + 1]) {
      const span = Math.max(0.0001, ts[i + 1] - ts[i]);
      const t = clamp01((f - ts[i]) / span);
      return lerp(vs[i], vs[i + 1], es && es[i] ? es[i](t) : t);
    }
  }
  return vs[n - 1];
};

const hex2 = (n: number) => {
  const s = Math.max(0, Math.min(255, Math.round(n))).toString(16);
  return s.length < 2 ? "0" + s : s;
};
const parts = (h: string) => {
  const x = parseInt(h.replace("#", ""), 16);
  return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
};
const mixH = (a: string, b: string, k: number) => {
  const A = parts(a);
  const B = parts(b);
  const t = clamp01(k);
  return "#" + hex2(lerp(A[0], B[0], t)) + hex2(lerp(A[1], B[1], t)) + hex2(lerp(A[2], B[2], t));
};

const GAS = "#C4CE4A";   // cloro/cloramina: verde-amarillo enfermo

// ════════════════════════════════════════════════════════════════════════════════════════════════
// LA MATERIA QUE CRUZA — EL VAPOR. Se monta UNA sola vez, a nivel movimiento, y nunca se remonta.
// Fase 1: nace del gel bajo el borde, vira a gas, LA DESCARGA LO BARRE.
// Fase 2: hilo punzante del frasco bajo la pileta.
// Ambiente: una bruma mínima que nunca se apaga (hold VIVO: nada queda quieto).
// ⛔ sin filter:blur — todo con radial-gradients (barato y sin riesgo de render).
// ════════════════════════════════════════════════════════════════════════════════════════════════
const puffs = (
  f: number, n: number, seed: number, sx: number, sy: number, spread: number,
  rise: number, op: number, color: string, speed: number, sweep: number, sag: number,
) =>
  Array.from({ length: n }, (_, i) => {
    const o = rnd(i * 3.1 + seed);
    const o2 = rnd(i * 7.7 + seed);
    const o3 = rnd(i * 11.9 + seed);
    const cycle = 132 + o * 96;
    const age = ((f * speed + o * cycle * 1.7) % cycle) / cycle;
    const life = Math.sin(age * Math.PI);
    if (life <= 0.004 || op <= 0.002) return null;
    const size = 128 + o2 * 210 + age * 190;
    const x = sx + (o - 0.5) * spread + Math.sin(age * 3.4 + o3 * 6.28) * 46 + sweep * (300 + o2 * 560) * age;
    const y = sy - rise * age * (0.66 + o3 * 0.6) + sag * 120 * age * age + sweep * 70 * age;
    const a = op * life * (0.46 + o2 * 0.54);
    return (
      <div
        key={i}
        style={{
          position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(color, a)} 0%, ${rgba(color, a * 0.42)} 34%, rgba(0,0,0,0) 70%)`,
        }}
      />
    );
  });

const VaporField: React.FC<{ f: number }> = ({ f }) => {
  // FASE 1 — del gel bajo el borde (acto 1) → dentro de la taza (acto 2) → BARRIDA por la descarga
  const sx1 = kf(f, [104, 186, 202, 320], [1424, 1436, 1006, 1010], [E.lin, E.soft, E.lin]);
  const sy1 = kf(f, [104, 186, 202, 320], [676, 676, 700, 700], [E.lin, E.soft, E.lin]);
  const op1 = kf(
    f, [100, 138, 172, 246, 262, 300, 320],
    [0, 0.085, 0.19, 0.28, 0.26, 0.05, 0],
    [E.out, E.soft, E.soft, E.lin, E.inc, E.lin],
  );
  const gas1 = kf(f, [126, 176, 220], [0, 0.45, 1], [E.out, E.soft]);
  const hot1 = kf(f, [198, 254], [0, 0.32], [E.soft]);
  const sweep1 = kf(f, [246, 266, 318], [0, 0.2, 1], [E.out, E.inc]);
  const c1 = mixH(mixH(RING.bone, GAS, gas1), RING.red, hot1);

  // FASE 2 — el hilo punzante del frasco bajo la pileta (acto 3B) que muere sobre las reglas
  const sx2 = kf(f, [516, 606, 700, 840], [1358, 1358, 1310, 1268], [E.lin, E.soft, E.lin]);
  const sy2 = kf(f, [516, 606, 700], [740, 740, 700], [E.lin, E.soft]);
  const op2 = kf(
    f, [512, 552, 606, 648, 700, 772, 840],
    [0, 0.15, 0.21, 0.17, 0.09, 0.055, 0.05],
    [E.out, E.soft, E.soft, E.inc, E.soft, E.lin],
  );
  const c2 = mixH(RING.bone, RING.red, 0.34);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {/* bruma ambiente: NUNCA se apaga */}
      {puffs(f, 6, 91.3, 960, 1160, 1740, 980, 0.038, RING.bone, 0.42, 0, 0)}
      {op1 > 0.002 && puffs(f, 13, 4.7, sx1, sy1, 240, 470, op1, c1, 1.05, sweep1, 0.18)}
      {op2 > 0.002 && puffs(f, 9, 23.9, sx2, sy2, 150, 520, op2, c2, 1.22, 0, 0.1)}
    </AbsoluteFill>
  );
};

// ── LA PARED DEL FONDO (plano más lejano, parallax propio) ──────────────────────────────────────
const Wall: React.FC<{ tint: string }> = ({ tint }) => (
  <div
    style={{
      position: "absolute", inset: 0,
      background:
        `linear-gradient(176deg, ${rgba(tint, 0.11)} 0%, rgba(8,8,10,0) 48%), ` +
        `linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.58) 100%)`,
    }}
  >
    <div
      style={{
        position: "absolute", inset: 0, opacity: 0.15,
        background:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 2px, rgba(0,0,0,0) 2px 122px)," +
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0 2px, rgba(0,0,0,0) 2px 122px)",
      }}
    />
  </div>
);

// ── FONDO DE ACTO (foto real a sangre, muy apagada: es ENTORNO, no contenido) ────────────────────
const Backdrop: React.FC<{ src: string; dim: number; clip?: string }> = ({ src, dim, clip }) => (
  <div style={{ position: "absolute", inset: 0, perspective: "1500px", overflow: "hidden", clipPath: clip }}>
    <PhotoPlane src={src} z={-620} scale={1.34} dim={dim} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════════════════════
// TIPOGRAFÍA — titular ≥48px, detalle ≥30px, SIEMPRE con cama oscura. Entra y sale por CLIP,
// nunca por opacity global (no hay fundidos en esta pieza).
// ════════════════════════════════════════════════════════════════════════════════════════════════
const titleNodes = (t: string) =>
  t.split("*").map((s, i) =>
    i % 2 === 1 ? <Em key={i}>{s}</Em> : <React.Fragment key={i}>{s}</React.Fragment>,
  );

const Caption: React.FC<{
  f: number; at: number; out?: number; kicker: string; title: string;
  x: number; y: number; w: number; size?: number;
}> = ({ f, at, out, kicker, title, x, y, w, size = 64 }) => {
  const p = clamp01((f - at) / 15);
  if (p <= 0) return null;
  const o = out === undefined ? 0 : clamp01((f - out) / 16);
  if (o >= 1) return null;
  const float = Math.sin((f - at) / 47) * 2.2;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w,
        transform: `translate(${(-o * 84).toFixed(1)}px, ${(float - o * 18).toFixed(1)}px)`,
        clipPath: `inset(0% ${((1 - E.glide(p)) * 100).toFixed(1)}% ${(o * 100).toFixed(1)}% 0%)`,
      }}
    >
      <Bed pad={26} w={w}>
        <Kick>{kicker}</Kick>
        <div style={{ height: 12 }} />
        <Head size={size}>{titleNodes(title)}</Head>
      </Bed>
    </div>
  );
};

// rótulo de tarjeta: 34px (los labels de 22px de MediaCard no se leen en un teléfono)
const Tag: React.FC<{
  f: number; at: number; out?: number; cx: number; cy: number; text: string;
  accent?: string; strike?: number;
}> = ({ f, at, out, cx, cy, text, accent = RING.red, strike = 0 }) => {
  const p = clamp01((f - at) / 13);
  if (p <= 0) return null;
  const o = out === undefined ? 0 : clamp01((f - out) / 14);
  if (o >= 1) return null;
  return (
    <div
      style={{
        position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)",
        clipPath: `inset(0% ${((1 - E.out(p)) * 100 + o * 100).toFixed(1)}% 0% 0%)`,
      }}
    >
      <div
        style={{
          position: "relative", display: "flex", alignItems: "center", gap: 14,
          padding: "12px 22px 12px 18px", borderRadius: 10,
          background: "linear-gradient(180deg, rgba(6,6,8,0.94) 0%, rgba(6,6,8,0.8) 100%)",
          boxShadow: `0 16px 38px rgba(0,0,0,0.66), inset 0 1px 0 ${rgba(RING.white, 0.09)}`,
          borderLeft: `5px solid ${accent}`,
        }}
      >
        <div
          style={{
            fontFamily: F_SANS, fontWeight: 900, fontSize: 34, letterSpacing: 2.2,
            textTransform: "uppercase", color: RING.white, whiteSpace: "nowrap", lineHeight: 1.05,
          }}
        >
          {text}
        </div>
        {strike > 0.01 && (
          <div
            style={{
              position: "absolute", left: 14, right: 14, top: "52%", height: 5, borderRadius: 3,
              background: accent, boxShadow: `0 0 18px ${rgba(accent, 0.8)}`,
              transform: `scaleX(${E.out(clamp01(strike)).toFixed(3)})`, transformOrigin: "0% 50%",
            }}
          />
        )}
      </div>
    </div>
  );
};

// chip corto de alarma
const Chip: React.FC<{ f: number; at: number; out?: number; cx: number; cy: number; text: string; accent?: string }> = ({
  f, at, out, cx, cy, text, accent = RING.red,
}) => {
  const p = clamp01((f - at) / 14);
  if (p <= 0) return null;
  const o = out === undefined ? 0 : clamp01((f - out) / 14);
  if (o >= 1) return null;
  const puls = 0.72 + 0.28 * Math.sin(f / 9);
  return (
    <div
      style={{
        position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) translateY(${((1 - E.out(p)) * 22).toFixed(1)}px)`,
        clipPath: `inset(0% ${((1 - E.out(p)) * 100 + o * 100).toFixed(1)}% 0% 0%)`,
        padding: "16px 30px", borderRadius: 12,
        background: `linear-gradient(180deg, ${rgba(accent, 0.94)} 0%, ${rgba(accent, 0.76)} 100%)`,
        boxShadow: `0 18px 48px rgba(0,0,0,0.6), 0 0 ${(30 * puls).toFixed(0)}px ${rgba(accent, 0.42 * puls)}`,
      }}
    >
      <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: RING.white, whiteSpace: "nowrap", lineHeight: 1 }}>
        {text}
      </div>
    </div>
  );
};

// fila de regla del cierre: 46px, cama oscura, barra roja. Tienen que leerse en un teléfono.
const RuleRow: React.FC<{ f: number; at: number; n: number; text: string; x: number; y: number; w: number }> = ({
  f, at, n, text, x, y, w,
}) => {
  const p = clamp01((f - at) / 17);
  if (p <= 0) return null;
  const e = E.out(p);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w,
        transform: `translateX(${((1 - e) * -30).toFixed(1)}px)`,
        clipPath: `inset(0% ${((1 - e) * 100).toFixed(1)}% 0% 0%)`,
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 22, padding: "16px 26px", borderRadius: 12,
          background: "linear-gradient(90deg, rgba(6,6,8,0.95) 0%, rgba(6,6,8,0.76) 100%)",
          boxShadow: `0 18px 44px rgba(0,0,0,0.62), inset 0 1px 0 ${rgba(RING.white, 0.08)}`,
          borderLeft: `6px solid ${RING.red}`,
        }}
      >
        <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 46, color: RING.red, width: 46, lineHeight: 1 }}>{n}</div>
        <div
          style={{
            fontFamily: F_SANS, fontWeight: 800, fontSize: 46, letterSpacing: 0.6, color: RING.white,
            lineHeight: 1.06, textShadow: "0 5px 22px rgba(0,0,0,0.92)", whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

// ── LA X ROJA (es un GRÁFICO, no un objeto: acá el vector SÍ va) ─────────────────────────────────
const XMark: React.FC<{ f: number; at: number; out?: number; cx: number; cy: number; size: number; power?: number }> = ({
  f, at, out, cx, cy, size, power = 1,
}) => {
  const p = clamp01((f - at) / 18);
  if (p <= 0) return null;
  const o = out === undefined ? 0 : clamp01((f - out) / 14);
  if (o >= 1) return null;
  const s = size * lerp(1, 0.6, E.inc(o)) * lerp(0.7, 1, E.glide(p));
  const puls = 0.7 + 0.3 * Math.sin(f / 7);
  const a = (1 - o) * power;
  const d1 = E.glide(clamp01((f - at) / 12));
  const d2 = E.glide(clamp01((f - at - 6) / 12));
  return (
    <svg
      width={s} height={s} viewBox="0 0 100 100"
      style={{
        position: "absolute", left: cx, top: cy, marginLeft: -s / 2, marginTop: -s / 2,
        filter: `drop-shadow(0 0 ${(22 * puls * a).toFixed(1)}px ${rgba(RING.red, 0.85 * a)}) drop-shadow(0 10px 24px rgba(0,0,0,0.8))`,
      }}
    >
      <line x1="14" y1="14" x2="86" y2="86" stroke={rgba(RING.red, 0.98 * a)} strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d1} />
      <line x1="86" y1="14" x2="14" y2="86" stroke={rgba(RING.redHot, 0.98 * a)} strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d2} />
    </svg>
  );
};

// ── SLOT QUE SE REMODELA POR BARRIDO (⛔ nunca por fundido) ──────────────────────────────────────
// El slot NO cambia de sitio: cambia LA MATERIA que tiene adentro, con un borde de luz que barre.
type Item = { src: string; kind: "video" | "photo"; startFrom?: number; at: number };

const SwapSlot: React.FC<{
  f: number; cx: number; cy: number; w: number; h: number; z?: number; ry?: number;
  items: Item[]; lit?: number; wipe?: number;
}> = ({ f, cx, cy, w, h, z = 0, ry = 0, items, lit = 1, wipe = 15 }) => {
  let idx = 0;
  for (let i = 0; i < items.length; i++) if (f >= items[i].at) idx = i;
  const cur = items[idx];
  const prev = idx > 0 ? items[idx - 1] : null;
  const p = clamp01((f - cur.at) / wipe);
  const left = cx - w / 2;
  const top = cy - h / 2;
  const PAD = 56;
  const edgeX = left + w * E.out(p);
  const band = (a: number, b: number) =>
    `inset(${(top - PAD).toFixed(0)}px ${(W - b).toFixed(0)}px ${(H - top - h - PAD).toFixed(0)}px ${a.toFixed(0)}px)`;
  const card = (it: Item, sheen: number) => (
    <MediaCard
      src={it.src} kind={it.kind} startFrom={it.startFrom}
      w={w} h={h} x={(cx / W) * 100} y={(cy / H) * 100} z={z} ry={ry} lit={lit} sheenAt={sheen}
    />
  );
  return (
    <>
      {prev && p < 1 && (
        <div style={{ position: "absolute", inset: 0, clipPath: band(left - PAD, left + w + PAD) }}>
          {card(prev, -999)}
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, clipPath: band(left - PAD, p >= 1 ? left + w + PAD : edgeX) }}>
        {card(cur, cur.at + 8)}
      </div>
      {p > 0 && p < 1 && (
        <div
          style={{
            position: "absolute", left: edgeX - 3, top: top - 8, width: 6, height: h + 16, borderRadius: 3,
            background: `linear-gradient(180deg, rgba(255,255,255,0), ${rgba(RING.white, 0.9)} 40%, ${rgba(RING.cold, 0.9)} 62%, rgba(255,255,255,0))`,
            boxShadow: `0 0 28px ${rgba(RING.cold, 0.85)}`,
          }}
        />
      )}
    </>
  );
};

// ── EL RIEL (diagrama: la secuencia SÍ permitida) ────────────────────────────────────────────────
const Rail: React.FC<{
  f: number; at: number; x: number; y: number; w: number; stations: string[]; head: number; note?: string;
}> = ({ f, at, x, y, w, stations, head, note }) => {
  const p = clamp01((f - at) / 26);
  if (p <= 0) return null;
  const e = E.out(p);
  const n = stations.length;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 2 }}>
      <div
        style={{
          position: "absolute", left: 0, top: 0, height: 3, width: `${(e * 100).toFixed(1)}%`,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(RING.bone, 0.5)} 12%, ${rgba(RING.bone, 0.5)} 88%, rgba(0,0,0,0) 100%)`,
        }}
      />
      {stations.map((s, i) => {
        const sx = (w / (n - 1)) * i;
        const on = clamp01((head * (n - 1) - i) * 2.4 + 1);
        const lit = clamp01((f - at - 4 - i * 5) / 14);
        if (lit <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: sx, top: -13, transform: "translateX(-50%)" }}>
            <div
              style={{
                width: 26, height: 26, borderRadius: "50%",
                background: on > 0.5 ? RING.bone : "rgba(10,10,12,0.9)",
                border: `3px solid ${rgba(RING.bone, 0.75)}`,
                boxShadow: on > 0.5 ? `0 0 ${(24 * on).toFixed(0)}px ${rgba(RING.bone, 0.7)}` : "0 6px 16px rgba(0,0,0,0.7)",
                transform: `scale(${lerp(0.4, 1, E.out(lit)).toFixed(3)})`,
              }}
            />
            <div
              style={{
                position: "absolute", left: "50%", top: 40, transform: "translateX(-50%)",
                fontFamily: F_SANS, fontWeight: 800, fontSize: 32, letterSpacing: 2.4,
                color: on > 0.5 ? RING.white : rgba(RING.bone, 0.62), whiteSpace: "nowrap",
                textShadow: "0 4px 18px rgba(0,0,0,0.95)",
                clipPath: `inset(0% ${((1 - E.out(lit)) * 100).toFixed(1)}% 0% 0%)`,
              }}
            >
              {s}
            </div>
          </div>
        );
      })}
      {/* la cabeza que recorre el riel */}
      {head > 0.001 && head < 0.999 && (
        <div
          style={{
            position: "absolute", left: w * head, top: -7, width: 90, height: 14, marginLeft: -45, borderRadius: 8,
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${rgba(RING.white, 0.9)}, rgba(255,255,255,0))`,
            boxShadow: `0 0 30px ${rgba(RING.cold, 0.8)}`,
          }}
        />
      )}
      {note && (
        <div
          style={{
            position: "absolute", left: w / 2, top: 92, transform: "translateX(-50%)",
            fontFamily: F_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 3.2,
            color: rgba(RING.bone, 0.78), whiteSpace: "nowrap",
            padding: "10px 20px", borderRadius: 8, background: "rgba(6,6,8,0.82)",
            clipPath: `inset(0% ${((1 - clamp01((f - at - 34) / 16)) * 100).toFixed(1)}% 0% 0%)`,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
};

// ── CORROSIÓN sobre la tarjeta (acto 3B): picaduras + línea de líquido encendida ─────────────────
const Corrode: React.FC<{ f: number; cx: number; cy: number; w: number; h: number; k: number }> = ({ f, cx, cy, w, h, k }) => {
  if (k <= 0.01) return null;
  const puls = 0.6 + 0.4 * Math.sin(f / 7);
  return (
    <div
      style={{
        position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h,
        borderRadius: 14, overflow: "hidden", pointerEvents: "none",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: rgba(RING.red, 0.2 * k), mixBlendMode: "overlay" }} />
      <div
        style={{
          position: "absolute", left: -6, right: -6, top: `${lerp(74, 56, k).toFixed(1)}%`, height: 16,
          background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(RING.redHot, 0.8 * k * puls)} 55%, rgba(255,255,255,0) 100%)`,
        }}
      />
      {Array.from({ length: 18 }, (_, i) => {
        const a = rnd(i * 2.3);
        const b = rnd(i * 5.9);
        if (a > k * 1.2) return null;
        const d = 5 + a * 13;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${7 + b * 84}%`, top: `${10 + a * 74}%`, width: d, height: d,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(0,0,0,0.85) 0%, ${rgba(RING.red, 0.45)} 66%, rgba(0,0,0,0) 100%)`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute", inset: 0, opacity: 0.4 * k, mixBlendMode: "screen",
          background: "repeating-linear-gradient(118deg, rgba(255,255,255,0.1) 0 2px, rgba(255,255,255,0) 2px 7px)",
        }}
      />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–190 · NEVER MIX BLEACH WITH AMMONIA (y limpiavidrios, y orina)
// Dos MediaCards con su clip corriendo que SE SEPARAN en el espacio 3D, con la X roja naciendo
// entre ellas. El slot derecho se remodela dos veces por barrido, sin moverse de su sitio.
// ════════════════════════════════════════════════════════════════════════════════════════════════
const Act1: React.FC<{ f: number }> = ({ f }) => {
  const lx = kf(f, [0, 15, 70, 190], [872, 494, 500, 492], [E.glide, E.soft, E.soft]);
  const rx = kf(f, [0, 15, 70, 140], [1048, 1424, 1434, 1440], [E.glide, E.soft, E.soft]);
  const cw = kf(f, [0, 15, 190], [432, 560, 566], [E.glide, E.soft]);
  const ch = kf(f, [0, 15, 190], [254, 330, 334], [E.glide, E.soft]);
  const cy = 520;
  const xPower = kf(f, [18, 40, 58, 66, 128, 136, 190], [0, 1, 1, 1.25, 1.25, 1.4, 1.4], [E.out, E.lin, E.snap, E.lin, E.snap]);
  const xSize = kf(f, [18, 42, 62, 68, 130, 138], [0, 196, 196, 214, 214, 232], [E.glide, E.lin, E.out, E.lin, E.out]);
  // el rótulo del slot derecho cambia con el material
  const rTag = f >= 131 ? { t: "URINE", at: 131 } : f >= 60 ? { t: "GLASS CLEANER", at: 60 } : { t: "AMMONIA", at: 22 };
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      <MediaCard
        src="broll/mdring_h64_nevermix.mp4" kind="video" startFrom={6}
        w={cw} h={ch} x={(lx / W) * 100} y={(cy / H) * 100} z={0} ry={7} lit={0.95} sheenAt={22}
      />
      <SwapSlot
        f={f} cx={rx} cy={cy} w={cw} h={ch} z={0} ry={-6} lit={0.9}
        items={[
          { src: "img/mdring_h66_brownvsclear.jpg", kind: "photo", at: -1 },
          { src: "broll/mdring_h68_windowfan.mp4", kind: "video", startFrom: 10, at: 60 },
          { src: "img/mdring_h65_flushbetween.jpg", kind: "photo", at: 131 },
        ]}
      />
      <XMark f={f} at={18} cx={960} cy={cy} size={xSize} power={clamp01(xPower)} />
      <Tag f={f} at={26} cx={lx} cy={cy + ch / 2 + 46} text="BLEACH" />
      <Tag f={f} at={rTag.at} cx={rx} cy={cy + ch / 2 + 46} text={rTag.t} />
      <Caption f={f} at={8} kicker="RULE ONE" title="NEVER MIX BLEACH WITH *AMMONIA*" x={100} y={84} w={880} size={58} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 2 · f186–360 · FLUSH BEFORE THE BLEACH
// Un solo objeto protagonista: la MISMA tarjeta del acto 1, ahora viva y a tamaño de héroe.
// Cae la lejía sobre la taza sin descargar → el vapor explota → LA DESCARGA lo barre.
// ════════════════════════════════════════════════════════════════════════════════════════════════
const Act2: React.FC<{ f: number }> = ({ f }) => {
  // MATCH-SHAPE: en f186 el rect es EXACTAMENTE el del slot derecho del acto 1.
  const cx = kf(f, [A2, 242, 360], [1440, 960, 966], [E.soft, E.soft]);
  const cy = kf(f, [A2, 242, 360], [520, 596, 600], [E.soft, E.soft]);
  const w = kf(f, [A2, 246, 360], [560, 968, 980], [E.soft, E.soft]);
  const h = kf(f, [A2, 246, 360], [330, 500, 506], [E.soft, E.soft]);
  const ry = kf(f, [A2, 246], [-6, 0], [E.soft]);
  const pour = clamp01((f - 206) / 40);
  const pourEnd = clamp01((f - 250) / 22);
  const flush = clamp01((f - 250) / 58);
  const splash = clamp01((f - 246) / 20);
  const top = cy - h / 2;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      <MediaCard
        src="broll/mdring_h65_flushbetween.mp4" kind="video" startFrom={0}
        w={w} h={h} x={(cx / W) * 100} y={(cy / H) * 100} z={0} ry={ry} lit={1} sheenAt={214}
      />
      {/* la lejía que cae encima de lo que no se descargó */}
      {pour > 0 && pourEnd < 1 && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <path
            d={`M 1690 62 C 1520 176, 1216 206, ${(cx + 70).toFixed(0)} ${(top + 54).toFixed(0)}`}
            fill="none" stroke={rgba(RING.porcelain, 0.88 * (1 - pourEnd))} strokeWidth={13} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - E.out(pour)}
          />
          <path
            d={`M 1690 62 C 1520 176, 1216 206, ${(cx + 70).toFixed(0)} ${(top + 54).toFixed(0)}`}
            fill="none" stroke={rgba(RING.white, 0.5 * (1 - pourEnd))} strokeWidth={4} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - E.out(pour)}
          />
        </svg>
      )}
      {/* el impacto: la reacción arranca ahí */}
      {splash > 0.01 && (
        <div
          style={{
            position: "absolute", left: cx + 70, top: top + 60, width: 260 * splash, height: 90 * splash,
            transform: "translate(-50%,-50%)", borderRadius: "50%", pointerEvents: "none",
            background: `radial-gradient(closest-side, ${rgba(GAS, 0.5 * (1 - flush))} 0%, ${rgba(RING.red, 0.24 * (1 - flush))} 58%, rgba(0,0,0,0) 100%)`,
          }}
        />
      )}
      {/* ⭐ LA DESCARGA dentro de la tarjeta: la lámina de agua que barre el vapor */}
      {flush > 0.001 && flush < 1 && (
        <div
          style={{
            position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h,
            borderRadius: 14, overflow: "hidden", pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute", left: 0, right: 0, top: `${lerp(-78, 108, E.inOut(flush)).toFixed(1)}%`, height: "78%",
              background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(RING.white, 0.46)} 26%, ${rgba(RING.cold, 0.34)} 58%, rgba(255,255,255,0) 100%)`,
            }}
          />
          {Array.from({ length: 12 }, (_, i) => {
            const s = rnd(i * 6.3);
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: `${4 + s * 92}%`,
                  top: `${lerp(-30, 116, clamp01(E.inOut(flush) * 1.35 - s * 0.3)).toFixed(1)}%`,
                  width: 5, height: 34 + s * 54, borderRadius: 4,
                  background: `linear-gradient(180deg, ${rgba(RING.white, 0.6)}, rgba(255,255,255,0))`,
                }}
              />
            );
          })}
        </div>
      )}
      <Tag
        f={f} at={196} out={f >= 252 ? 252 : undefined} cx={cx} cy={cy + h / 2 + 48}
        text="IT WAS NEVER FLUSHED" strike={clamp01((f - 236) / 20)}
      />
      <Tag f={f} at={258} cx={cx} cy={cy + h / 2 + 48} text="FLUSH FIRST — THEN THE BLEACH" accent={RING.bone} />
      <Caption f={f} at={194} kicker="IF THE BOWL WASN'T FLUSHED" title="*FLUSH* BEFORE THE BLEACH" x={100} y={82} w={820} size={62} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 3A · f322–520 · NEVER IN ONE BOTTLE  →  ONE, RINSE, THEN THE OTHER
// El par prohibido converge (X roja) y después SE ABRE en un riel de tres estaciones: la secuencia
// permitida. Las tarjetas entran DESDE ABAJO (el acto 1 entró desde el centro): otra escala, otro
// gesto, mismo espacio.
// ════════════════════════════════════════════════════════════════════════════════════════════════
const Act3A: React.FC<{ f: number }> = ({ f }) => {
  const px = kf(f, [330, 350, 358, 392, 400, 428], [470, 470, 500, 700, 668, 422], [E.lin, E.out, E.soft, E.lin, E.inOut]);
  const vx = kf(f, [330, 350, 358, 392, 400, 428], [1450, 1450, 1420, 1220, 1252, 1498], [E.lin, E.out, E.soft, E.lin, E.inOut]);
  const py = kf(f, [330, 352], [1210, 605], [E.glide]);
  const vy = kf(f, [336, 358], [1210, 605], [E.glide]);
  const cw = kf(f, [330, 392, 428], [460, 460, 400], [E.lin, E.inOut]);
  const chh = kf(f, [330, 392, 428], [280, 280, 240], [E.lin, E.inOut]);
  // la tarjeta RINSE sube en f414 y se va en f496 (deja el HUECO por donde atravesamos)
  const rin = clamp01((f - 414) / 26);
  const rout = clamp01((f - 496) / 16);
  const ry_ = lerp(1210, 605, E.glide(rin)) + E.inc(rout) * 700;
  const head = kf(f, [430, 452, 458, 476], [0, 0.5, 0.5, 1], [E.inOut, E.lin, E.inOut]);
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      <MediaCard
        src="broll/mdring_h66_brownvsclear.mp4" kind="video" startFrom={4}
        w={cw} h={chh} x={(px / W) * 100} y={(py / H) * 100} z={20} ry={8} lit={0.94} sheenAt={356}
      />
      <MediaCard
        src="img/mdring_h64_nevermix.jpg" kind="photo"
        w={cw} h={chh} x={(vx / W) * 100} y={(vy / H) * 100} z={20} ry={-8} lit={0.9} sheenAt={362}
      />
      {rin > 0.001 && rout < 0.999 && (
        <MediaCard
          src="broll/mdring_h65_flushbetween.mp4" kind="video" startFrom={26}
          w={400} h={240} x={50} y={(ry_ / H) * 100} z={60} ry={0} lit={1} sheenAt={430}
        />
      )}
      <XMark f={f} at={366} out={398} cx={960} cy={600} size={172} power={1} />
      <Rail
        f={f} at={410} x={300} y={812} w={1320}
        stations={["PEROXIDE", "RINSE", "VINEGAR"]} head={head} note="AND LET IT DRY IN BETWEEN"
      />
      <Caption f={f} at={334} kicker="RULE TWO" title="NEVER IN *ONE* BOTTLE" x={100} y={92} w={780} size={66} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 3B · f504–678 · IT MAKES PERACETIC ACID → A REAL BURN
// Un solo frasco alto bajo la pileta que se CORROE. En f610 se va por un vector y el guante entra
// por el MISMO vector (MATCH-MOVE): el guante llega exactamente adonde estaba el frasco.
// ════════════════════════════════════════════════════════════════════════════════════════════════
const Act3B: React.FC<{ f: number }> = ({ f }) => {
  const bIn = clamp01((f - 508) / 26);
  const bOut = clamp01((f - MOVE_AT) / 22);
  const bx = lerp(1330, 1090, E.inc(bOut)) + (1 - E.glide(bIn)) * 90;
  const by = lerp(560, 1190, E.inc(bOut)) - (1 - E.glide(bIn)) * 40;
  const brot = E.inc(bOut) * -22;
  const corr = kf(f, [536, 576, 606, 620], [0, 0.42, 0.86, 0.92], [E.out, E.soft, E.lin]);
  // MATCH-MOVE: el guante entra por el MISMO vector, desde el otro extremo
  const gIn = clamp01((f - 612) / 24);
  const gx = lerp(1580, 1360, E.glide(gIn));
  const gy = lerp(-40, 560, E.glide(gIn));
  const grot = lerp(14, 0, E.glide(gIn));
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      {bOut < 0.999 && (
        <>
          <MediaCard
            src="img/mdring_h64_nevermix.jpg" kind="photo"
            w={460} h={620} x={(bx / W) * 100} y={(by / H) * 100} z={40} ry={-5} rot={brot} lit={0.92} sheenAt={528}
          />
          <Corrode f={f} cx={bx} cy={by} w={460} h={620} k={corr * (1 - bOut)} />
        </>
      )}
      {gIn > 0.001 && (
        <MediaCard
          src="broll/mdring_h67_gloves.mp4" kind="video" startFrom={12}
          w={620} h={380} x={(gx / W) * 100} y={(gy / H) * 100} z={70} ry={-4} rot={grot} lit={1} sheenAt={632}
        />
      )}
      {bOut < 0.6 && <Tag f={f} at={548} out={MOVE_AT} cx={bx} cy={by + 356} text="ONE BOTTLE, UNDER THE SINK" />}
      <Chip f={f} at={622} cx={1360} cy={832} text="THAT IS A REAL BURN" />
      <Caption f={f} at={522} kicker="STORED TOGETHER" title="IT MAKES *PERACETIC ACID*" x={100} y={92} w={820} size={68} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 4 · f664–840 · THREE PERCENT · THE BROWN BOTTLE · NOT 35%
// El cierre del bloque: la lámina real de la guía como PÁGINA dentro de una tarjeta, y a la
// izquierda las 4 reglas apiladas, quietas y legibles. Hold largo.
// ════════════════════════════════════════════════════════════════════════════════════════════════
const Act4: React.FC<{ f: number; end: number }> = ({ f, end }) => {
  const cut = f >= CUT_AT;
  const shift = cut ? kf(f, [CUT_AT, CUT_AT + 1, CUT_AT + 40], [0, -34, -26], [E.snap, E.soft]) : 0;
  const keyX = cut ? 78 : 26;
  // el frasco marrón: héroe, después se retira detrás y arriba de la página
  const demote = clamp01((f - 710) / 30);
  const bx = lerp(1420, 1656, E.inOut(demote));
  const by = lerp(500, 252, E.inOut(demote));
  const bw = lerp(640, 284, E.inOut(demote));
  const bh = lerp(400, 176, E.inOut(demote));
  const pIn = clamp01((f - 710) / 30);
  const py = lerp(1140, 498, E.glide(pIn));
  const drumIn = clamp01((f - CUT_AT) / 18);
  const hold = clamp01((f - 800) / (Math.max(820, end) - 800));
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      {/* llave cálida local del frasco marrón a contraluz — cambia de lado EN el corte */}
      <div
        style={{
          position: "absolute", inset: 0, transform: "translateZ(-320px)",
          background: `radial-gradient(64% 56% at ${keyX}% 26%, ${rgba(RING.warm, 0.17)} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shift.toFixed(1)}px)` }}>
        <MediaCard
          src="broll/mdring_h66_brownvsclear.mp4" kind="video" startFrom={8}
          w={bw} h={bh} x={(bx / W) * 100} y={(by / H) * 100} z={20} ry={-6} lit={lerp(1, 0.62, demote)}
          sheenAt={678} label={demote > 0.6 ? "3% — BROWN GLASS" : undefined}
        />
        {demote < 0.5 && <Tag f={f} at={686} out={710} cx={bx} cy={by + bh / 2 + 46} text="3% — BROWN GLASS" accent={RING.bone} />}
        {/* LA LÁMINA REAL DE LA GUÍA, como página dentro de una tarjeta */}
        {pIn > 0.001 && (
          <MediaCard
            src="img/mdring_lam_nevermix.jpg" kind="photo"
            w={430} h={596} x={74} y={(py / H) * 100} z={110} ry={-3} lit={1}
            sheenAt={744} grade={false} label="FROM THE GUIDE"
          />
        )}
        {/* EL 35% — entra EN EL CORTE, con la X encima */}
        {drumIn > 0.001 && (
          <>
            <MediaCard
              src="img/mdring_h66_brownvsclear.jpg" kind="photo"
              w={320} h={196} x={85.4} y={83.9} z={150}
              ry={-7} lit={lerp(0.5, 0.9, E.out(drumIn))} opacity={E.out(drumIn)} label="35% — NOT THIS ONE"
            />
            <XMark f={f} at={CUT_AT + 6} cx={1640} cy={906} size={150 * E.out(drumIn)} power={0.95} />
          </>
        )}
      </div>
      {/* EL TITULAR Y LAS 4 REGLAS — quietas, legibles, sin superponerse */}
      <Caption f={f} at={670} kicker="AND ONLY" title="*THREE PERCENT*" x={100} y={84} w={760} size={78} />
      <RuleRow f={f} at={690} n={1} text="NEVER BLEACH WITH AMMONIA" x={100} y={280} w={880} />
      <RuleRow f={f} at={712} n={2} text="FLUSH BEFORE THE BLEACH" x={100} y={392} w={880} />
      <RuleRow f={f} at={734} n={3} text="NEVER STORE THEM MIXED" x={100} y={504} w={880} />
      <RuleRow f={f} at={758} n={4} text="3% ONLY — THE BROWN BOTTLE" x={100} y={616} w={880} />
      {/* subrayado que sella el hold final */}
      <div
        style={{
          position: "absolute", left: 100, top: 724, height: 5, width: 880 * E.out(clamp01((f - 796) / 30)),
          background: `linear-gradient(90deg, ${RING.red}, ${rgba(RING.red, 0.05)})`,
          boxShadow: `0 0 24px ${rgba(RING.red, 0.45 * (1 - hold * 0.4))}`,
        }}
      />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════════
export const MovSafety: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const f = useCurrentFrame();
  const END = Math.max(720, durationInFrames);

  // ── LA LUZ: FRÍA → ROJA (el gas) → FRÍA (la descarga limpia el aire) → ROJA (el ácido) → FRÍA ──
  const red01 = kf(
    f, [0, 108, 196, 246, 264, 318, 356, 470, 520, 566, 612, 634, 668, 700, 762, 840],
    [0.02, 0.06, 0.7, 1, 0.94, 0.3, 0.09, 0.09, 0.3, 0.72, 0.96, 1, 0.5, 0.18, 0.1, 0.08],
    [E.lin, E.out, E.snap, E.lin, E.inc, E.out, E.lin, E.out, E.soft, E.out, E.lin, E.inc, E.out, E.soft, E.lin],
  );
  const tint = light(red01, "cold", "red");
  const inten = kf(
    f, [0, 60, 186, 250, 330, 430, 520, 620, 668, 700, 840],
    [0.55, 0.86, 1.06, 1.42, 0.92, 0.88, 1.0, 1.34, 1.0, 0.9, 0.88],
    [E.out, E.soft, E.out, E.inc, E.soft, E.soft, E.out, E.inc, E.soft, E.lin],
  );
  const keyF = kf(f, [0, 186, 322, 504, 664, 840], [0.2, 0.28, 0.42, 0.5, 0.66, 0.74], [E.soft, E.soft, E.soft, E.soft, E.lin]);
  const beat = 0.62 + 0.38 * Math.sin(f / (red01 > 0.5 ? 8.5 : 15));

  // ── LA CÁMARA: UNA sola llamada, función del frame GLOBAL. Nunca vuelve a 0, nunca retrocede ──
  const c = gcam(f, { z0: -160, z1: 180, panX: 44, panY: -20, ry: -5, rx: 1.5, dur: END });
  const camS = 1 + (c.z + 160) / 3400;

  // ── ESCALAS DE COSTURA (zoom-through) ────────────────────────────────────────────────────────
  const sc3a = kf(f, [322, 470, ZOOM_AT, 518], [1, 1.04, 1.14, 5.6], [E.soft, E.inOut, E.inc]);
  const sc3b = kf(f, [A3B, 524, 678], [0.4, 1, 1.04], [E.out, E.soft]);

  // ── COSTURA B: el borde del agua (wipe por materia) ──────────────────────────────────────────
  const wiping = f >= WIPE_AT && f <= WIPE_AT + WIPE_DUR;
  const we = kf(f, [WIPE_AT, WIPE_AT + WIPE_DUR], [-260, 2180], [E.inOut]);
  const weC = Math.max(0, Math.min(W, we));
  const clipNew = wiping ? `inset(0px ${(W - weC).toFixed(0)}px 0px 0px)` : undefined;   // lo que ENTRA (izq)
  const clipOld = wiping ? `inset(0px 0px 0px ${weC.toFixed(0)}px)` : undefined;         // lo que SE VA (der)

  // ── COSTURA E: el canto iluminado de la hoja (la puerta del mueble) ──────────────────────────
  const ocEdge = kf(f, [OCC_AT - 4, OCC_AT + 14], [-36, 134], [E.snap]);

  return (
    <AbsoluteFill style={{ backgroundColor: RING.ink0, overflow: "hidden" }}>
      {/* LA ATMÓSFERA: se monta UNA vez por movimiento y NO se remonta entre actos */}
      <RingAtmos tint={tint} keyFrom={keyF} intensity={inten} />

      {/* EL MUNDO, bajo la única cámara */}
      <Layers cam={`${c.transform} scale(${camS.toFixed(4)})`}>
        {/* plano 1 — la pared del fondo */}
        <Plane z={-900} style={{ transform: "translateZ(-900px) scale(1.62)", zIndex: 1 }}>
          <Wall tint={tint} />
        </Plane>

        {/* plano 2 — la foto real del entorno (cambia SÓLO bajo costura que tapa) */}
        {f < 360 && <Backdrop src="img/mdring_h64_nevermix.jpg" dim={0.6} clip={clipOld} />}
        {f >= WIPE_AT && f < 678 && <Backdrop src="img/mdring_h68_windowfan.jpg" dim={0.64} clip={clipNew} />}
        {f >= A4 && <Backdrop src="img/mdring_h67_gloves.jpg" dim={0.66} />}

        {/* plano 3 — el suelo negro reflectante donde aterrizan las sombras de contacto */}
        <Plane z={-300} style={{ transform: "translateZ(-300px) scale(1.21)", zIndex: 2 }}>
          <div
            style={{
              position: "absolute", left: 0, right: 0, top: 902, height: 3,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(tint, 0.3)} 24%, ${rgba(RING.bone, 0.26)} 74%, rgba(0,0,0,0) 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute", left: 0, right: 0, bottom: 0, height: 220,
              background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(RING.ink0, 0.72)} 100%)`,
            }}
          />
        </Plane>

        {/* plano 4 — LOS ACTOS */}
        {f < 190 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 4 }}>
            <Act1 f={f} />
          </div>
        )}
        {f >= A2 && f < 360 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 5, clipPath: clipOld }}>
            <Act2 f={f} />
          </div>
        )}
        {f >= WIPE_AT && f < 522 && (
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 6, clipPath: clipNew,
              transform: `scale(${sc3a.toFixed(4)})`, transformOrigin: "960px 605px",
            }}
          >
            <Act3A f={f} />
          </div>
        )}
        {f >= A3B && f < 678 && (
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 7,
              transform: `scale(${sc3b.toFixed(4)})`, transformOrigin: "960px 580px",
            }}
          >
            <Act3B f={f} />
          </div>
        )}
        {f >= A4 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 8 }}>
            <Act4 f={f} end={END} />
          </div>
        )}

        {/* plano 5 — ⭐ EL VAPOR: la materia que cruza las cuatro fronteras, montada UNA vez */}
        <Plane z={140} style={{ transform: "translateZ(140px) scale(0.907)", zIndex: 12 }}>
          <VaporField f={f} />
        </Plane>
      </Layers>

      {/* ── COSTURA B · WIPE POR MATERIA: la lámina de agua de la descarga ─────────────────────── */}
      {wiping && (
        <>
          <div
            style={{
              position: "absolute", top: -40, bottom: -40, left: weC - 160, width: 320, pointerEvents: "none",
              background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(RING.cold, 0.22)} 32%, ${rgba(RING.white, 0.52)} 60%, ${rgba(RING.bone, 0.18)} 78%, rgba(255,255,255,0) 100%)`,
              transform: "skewX(-5deg)",
            }}
          />
          {Array.from({ length: 11 }, (_, i) => {
            const s = rnd(i * 6.3);
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: weC - 46 + s * 96, top: `${3 + s * 88}%`,
                  width: 5, height: 28 + s * 44, borderRadius: 4, pointerEvents: "none",
                  background: `linear-gradient(180deg, ${rgba(RING.white, 0.58)}, rgba(255,255,255,0))`,
                }}
              />
            );
          })}
        </>
      )}
      <SeamWipeMatter at={WIPE_AT} dur={WIPE_DUR} tint={RING.cold} />

      {/* ── COSTURA E · OCLUSIÓN: la hoja del mueble con su canto iluminado ─────────────────────── */}
      {f >= OCC_AT - 6 && f <= OCC_AT + 16 && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", top: "-20%", bottom: "-20%", left: `${ocEdge.toFixed(2)}%`, width: 8,
              background: `linear-gradient(90deg, ${rgba(RING.cold, 0.92)}, rgba(255,255,255,0))`,
              boxShadow: `0 0 44px ${rgba(RING.cold, 0.55)}`, transform: "rotate(4deg)",
            }}
          />
        </div>
      )}
      <SeamOcclude at={OCC_AT} dur={16} color={RING.ink2} angle={5} />

      {/* ── COSTURA F · CORTE EN EL BEAT ───────────────────────────────────────────────────────── */}
      <SeamFlash at={CUT_AT} color={RING.redHot} dur={6} />

      {/* ALERTA: el latido rojo del gas, que se apaga cuando el bloque se resuelve */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(90% 76% at 50% 54%, rgba(0,0,0,0) 44%, ${rgba(RING.red, 0.3 * red01 * beat)} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
