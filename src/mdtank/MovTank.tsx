// MovTank.tsx — MOVIMIENTO "THE TANK" · 1722 frames @30fps (57,4 s) · canal Mike Dalton (EN)
//
// UN SOLO PLANO SECUENCIA. Una atmósfera montada una vez (<Atmos/>), una cámara `CAMERA(frame)`
// que es función del frame GLOBAL y NUNCA vuelve a cero, una luz que viaja CIAN-FRÍO → ROJO →
// ROJO BAJO, y una MATERIA que cruza todas las fronteras: EL AGUA TEÑIDA DE AZUL del tanque.
// Esa misma agua es la que moja la etiqueta (acto 2), la que corroe la goma (acto 3), la que
// gotea al piso (acto 4) y la que baja por los rim jets y pinta la taza (acto 5).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0-410 · "THE STICKER" (protagonista: la advertencia pegada adentro del tanque)
//   enterFrom  cam {z -360, panY -320, ry +7, rx -6 — hundidos y mirando hacia arriba}
//              luz {CIAN-FRÍO, key 0.20, intensidad 1.0}
//              materia {agua teñida de azul: cáusticas + burbujas que suben + motas}
//   exitTo     cam {z +190 → +560, panX +470 — clavados en la banda del Fluidmaster}
//              luz {CIAN-FRÍO, key 0.30}
//              materia {la mancha de agua azul ya moja el borde superior del papel}
//   ── FRONTERA A @396-424 ····· ZOOM-THROUGH (la cámara se mete en la letra chica) ──
//
// ACTO 2 · f410-730 · "THE FINE PRINT" (protagonista: el texto — el texto ES el objeto)
//   enterFrom  cam {z +560, panX +470, ry -9 — dentro del papel}
//              luz {CIAN-FRÍO rasante, key 0.30, intensidad 0.85}
//              materia {mancha + gota de agua azul que corre por el papel}
//   exitTo     cam {z +640, panY -200 — leímos hasta el pie de página}
//              luz {arranca el viraje: 8% de rojo}
//              materia {el agua SUBE y ahoga la hoja}
//   ── FRONTERA B @700-746 ····· WIPE POR MATERIA (<VaporWipe/> + inundación) ──
//
// ACTO 3 · f730-1100 · "THE BLUE TABLET" (protagonista: el disco azul disolviéndose)
//   enterFrom  cam {z +110, panY -30 — de vuelta adentro, agua hasta el techo}
//              luz {CIAN-FRÍO → empieza a virar, key 0.42}
//              materia {la misma agua, ahora saturada de azul por la pastilla}
//   exitTo     cam {z +180, panY +40 — macro sobre el disco}
//              luz {ROJO 70%, key 0.58}
//              materia {EL DISCO: el mismo elemento sigue en pantalla, cambia de material}
//   ── FRONTERA C @1090-1136 ··· MATCH-SHAPE (el disco azul ES el flapper negro) ──
//
// ACTO 4 · f1100-1460 · "THE PRICE" (protagonista: la goma muerta → la gotera)
//   enterFrom  cam {z +180 → +40, panY +40 → +10 — el agua se drena hacia abajo}
//              luz {ROJO, key 0.58, intensidad 0.95}
//              materia {la gelatina negra que se desprende y cae}
//   exitTo     cam {z +150, panY +40, rx +5 — la cámara ya está bajando}
//              luz {ROJO, intensidad 0.8}
//              materia {la gota que cae y el charco}
//   ── FRONTERA D @1452-1476 ··· OCLUSIÓN (<Occluder/> color hueso = el labio de porcelana) ──
//
// ACTO 5 · f1460-1722 · "UNDER THE RIM" (protagonista: el canal oculto con los rim jets)
//   enterFrom  cam {z +30, panY -30, rx -6 — pasamos por debajo del labio}
//              luz {ROJO BAJO, key 0.78, intensidad 0.72}
//              materia {la película de baba: el agua sucia pegada a la porcelana}
//   exitTo     cam {z +210 — sigue avanzando, el plano no se cierra}
//              luz {ROJO BAJO}
//              materia {la descarga: la MISMA agua azulada baja por los jets y pinta la taza}
//
// ⛔ Cero Math.random / Date · cero backdrop-filter · cero fade a negro · cero opacity 0→1 global.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import {
  MD, F_SANS, F_SERIF, rgba, lerp, clamp01, eio, rnd,
  cam, light, Atmos, glassStyle, Sheen, Occluder, VaporWipe,
  Kicker, Title, Em, TextBed,
} from "./Stage";

/* ── anclas del guion (frames absolutos, el audio manda) ─────────────────────────────────── */
const K = {
  kohler: 0, fluid: 218, donot: 412, damage: 562, flood: 623,
  tablet: 734, told: 781, glued: 867, jelly: 1107, every: 1207,
  trade: 1303, notTank: 1462, realThing: 1540, phone: 1583,
};
const A1 = 0, A2 = 410, A3 = 730, A4 = 1100, A5 = 1460;

const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.14, 0.86, 0.22, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  drop: Easing.bezier(0.72, 0.0, 0.62, 1),
  lin: (t: number) => t,
};
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** rampa multi-key con easing POR SEGMENTO (el easing nunca es constante en toda la pieza) */
const keyed = (
  f: number, ks: number[], vs: number[],
  e: ((t: number) => number) | ((t: number) => number)[] = EZ.glide,
): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const t = clamp01((f - ks[i]) / (ks[i + 1] - ks[i]));
  const ef = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

const hx = (h: string) => {
  const x = parseInt(h.replace("#", ""), 16);
  return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
};
/** mezcla de dos hex — para que un MATERIAL se transforme en otro sin recurrir a un fundido */
const mix = (a: string, b: string, k: number) => {
  const p = hx(a), q = hx(b), t = clamp01(k);
  return `rgb(${Math.round(lerp(p[0], q[0], t))},${Math.round(lerp(p[1], q[1], t))},${Math.round(lerp(p[2], q[2], t))})`;
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   LA CÁMARA — UNA sola, función del frame GLOBAL. Nunca reinicia. `cam()` de Stage aporta
   la perspectiva, la deriva viva y la respiración; acá le sumo el recorrido dramático.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const CAM_K  = [0,   210,  300,  396,  424,  560,  700,  762,  880, 1000, 1090, 1136, 1210, 1300, 1372, 1452, 1476, 1545, 1620, 1690, 1780];
const CAM_Z  = [-360, -40,   20,  190,  300,  318,  340,  110,   40,  -30,  180,   40,   70,   20,   90,  150,   30,   90,  140,  180,  215];
const CAM_X  = [ 140, -180, -190,  470,  480,  466,  452,   60,   20,  -10,    0,  -12,  -30,   20,   10,    0,  -22,   10,  -10,  -20,  -30];
const CAM_Y  = [-320,    0,   10,  -50,  -60, -120, -200,  -30,  -10,   20,   40,   10,  -10,    0,   10,   40,  -30,  -10,   10,   20,   30];
const CAM_RY = [   7,    1,    0,   -8,   -9,   -6,   -5,    3,    2,   -1,   -3,    1,    2,   -1,    0,   -2,    3,    1,   -1,   -2,   -2];
const CAM_RX = [  -6,   -1,    0,    2,    2,    1,    0,   -2,   -1,    1,    3,    1,    0,    1,    2,    5,   -6,   -3,   -1,    0,    0];
const CAM_E: ((t: number) => number)[] = [
  EZ.glide, EZ.soft, EZ.push, EZ.push, EZ.soft, EZ.lin, EZ.drop, EZ.glide, EZ.soft, EZ.push,
  EZ.snap, EZ.soft, EZ.glide, EZ.soft, EZ.push, EZ.snap, EZ.glide, EZ.soft, EZ.glide, EZ.soft,
];

const CAMERA = (f: number) => {
  const base = cam(f, { z0: 0, z1: 0, dur: 1722 }); // sólo por la deriva/respiración compartida
  const z = keyed(f, CAM_K, CAM_Z, CAM_E);
  const px = keyed(f, CAM_K, CAM_X, CAM_E);
  const py = keyed(f, CAM_K, CAM_Y, CAM_E);
  const ry = keyed(f, CAM_K, CAM_RY, CAM_E);
  const rx = keyed(f, CAM_K, CAM_RX, CAM_E);
  const bx = Math.sin(f / 47) * 2.2 + Math.sin(f / 111) * 1.4;
  const by = Math.cos(f / 61) * 1.8;
  return {
    z, px, py,
    transform:
      `perspective(1400px) translateZ(${z.toFixed(2)}px) ` +
      `translate3d(${(px + bx).toFixed(2)}px, ${(py + by).toFixed(2)}px, 0) ` +
      `rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)`,
    drift: base.e,
  };
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   MATERIA COMPARTIDA — EL AGUA. Se usa en los actos 1, 3 y 5: es literalmente la misma.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Caustics: React.FC<{ f: number; tint: string; op: number; sc?: number }> = ({ f, tint, op, sc = 1 }) => {
  const wob = 1 + Math.sin(f / 41) * 0.07;
  const band = (deg: number, sh: number, o: number, w: number): React.CSSProperties => ({
    position: "absolute", inset: "-38%",
    transform: `translate3d(${sh.toFixed(1)}px, ${(sh * 0.42).toFixed(1)}px, 0) scale(${(wob * sc).toFixed(3)})`,
    background:
      `repeating-linear-gradient(${deg}deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${w}px, ` +
      `${rgba(tint, o * 0.5)} ${w + 8}px, ${rgba(tint, o)} ${w + 15}px, ${rgba(tint, o * 0.4)} ${w + 23}px, ` +
      `rgba(0,0,0,0) ${w + 34}px, rgba(0,0,0,0) ${w + 72}px)`,
    mixBlendMode: "screen",
  });
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <div style={band(103, (f / 2.6) % 260, 0.085, 30)} />
      <div style={band(69, (-f / 3.9) % 260, 0.07, 44)} />
      <div style={band(94, (f / 6.1) % 260, 0.05, 62)} />
    </AbsoluteFill>
  );
};

const Bubbles: React.FC<{
  f: number; n?: number; seed?: number; speed?: number; size?: number; op?: number; z?: number; spread?: number;
}> = ({ f, n = 26, seed = 3, speed = 1, size = 1, op = 1, z = 0, spread = 100 }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translateZ(${z}px)`, pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(seed + i * 1.73), b = rnd(seed + i * 3.31), c = rnd(seed + i * 7.11);
      const sp = (0.9 + b * 2.4) * speed;
      const y = ((a * 1600 - f * sp) % 1600 + 1600) % 1600;
      const d = (4 + c * 15) * size;
      const wob = Math.sin(f / (11 + b * 9) + i) * (5 + c * 12);
      return (
        <div key={i} style={{
          position: "absolute",
          left: `${(50 - spread / 2) + a * spread}%`,
          top: 1240 - y,
          width: d, height: d, borderRadius: "50%",
          transform: `translateX(${wob.toFixed(1)}px)`,
          background: `radial-gradient(circle at 34% 30%, ${rgba(MD.white, 0.5)} 0%, ${rgba(MD.white, 0.06)} 44%, rgba(255,255,255,0) 70%)`,
          boxShadow: `inset 0 0 ${d * 0.5}px ${rgba(MD.white, 0.42)}`,
          opacity: (0.28 + c * 0.6) * op,
        }} />
      );
    })}
  </div>
);

const Motes: React.FC<{ f: number; n?: number; seed?: number; tint?: string; op?: number; z?: number }> =
  ({ f, n = 34, seed = 11, tint = MD.cold, op = 0.5, z = 0 }) => (
    <div style={{ position: "absolute", inset: 0, transform: `translateZ(${z}px)`, pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(seed + i * 2.17), b = rnd(seed + i * 5.03);
        const x = a * 100 + Math.sin(f / (70 + b * 60) + i) * 2.4;
        const y = ((b * 1200 - f * (0.16 + a * 0.4)) % 1200 + 1200) % 1200;
        const d = 1.6 + b * 3.4;
        return <div key={i} style={{
          position: "absolute", left: `${x}%`, top: 1180 - y, width: d, height: d, borderRadius: "50%",
          background: rgba(tint, 0.9), opacity: (0.16 + a * 0.5) * op,
        }} />;
      })}
    </div>
  );

/** revelado por palabra: cada palabra tiene SU entrada (no es un opacity global) */
const Words: React.FC<{
  text: string; f: number; at: number; step?: number; size: number;
  weight?: number; color?: string; emFrom?: number; lh?: number;
}> = ({ text, f, at, step = 4, size, weight = 800, color = MD.white, emFrom = -1, lh = 1.05 }) => {
  const ws = text.split(" ");
  return (
    <div style={{ fontFamily: F_SANS, fontWeight: weight, fontSize: size, lineHeight: lh, color }}>
      {ws.map((w, i) => {
        const p = clamp01((f - (at + i * step)) / 11);
        const e = EZ.snap(p);
        const isEm = emFrom >= 0 && i >= emFrom;
        return (
          <span key={i} style={{
            display: "inline-block", marginRight: size * 0.24,
            transform: `translateY(${((1 - e) * size * 0.42).toFixed(2)}px) scale(${(0.93 + e * 0.07).toFixed(3)})`,
            opacity: p, filter: p < 1 ? `blur(${((1 - p) * 4).toFixed(2)}px)` : undefined,
            fontFamily: isEm ? F_SERIF : F_SANS,
            fontStyle: isEm ? "italic" : "normal",
            fontWeight: isEm ? 500 : weight,
            color: isEm ? MD.redHot : color,
            textShadow: "0 6px 30px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8)",
          }}>{w}</span>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 1 — DENTRO DEL TANQUE. La cámara sube por el agua y encuentra la etiqueta.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const WarningLabel: React.FC<{ f: number }> = ({ f }) => {
  const born = clamp01((f - 92) / 34);
  const peel = keyed(f, [150, 300], [0, 1], EZ.soft);
  const breathe = Math.sin(f / 63) * 1.1;
  const W = 720, H = 392;
  return (
    <div style={{
      position: "absolute", left: 1180 - W / 2, top: 430 - H / 2, width: W, height: H,
      transform: `translateZ(6px) rotateY(-13deg) rotateX(${(2 + breathe * 0.4).toFixed(2)}deg) translateY(${breathe.toFixed(2)}px)`,
      transformStyle: "preserve-3d",
    }}>
      {/* sombra de contacto — la etiqueta está PEGADA a la porcelana */}
      <div style={{
        position: "absolute", inset: "6% -3% -8% 3%", borderRadius: 8,
        boxShadow: `0 26px 44px rgba(0,0,0,0.72), 0 6px 10px rgba(0,0,0,0.6)`,
        background: "rgba(0,0,0,0.42)", boxShadow: `0 30px 60px 18px rgba(0,0,0,0.7)`,
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 6, overflow: "hidden",
        background: `linear-gradient(158deg, ${MD.bone} 0%, #DAD4C7 46%, #C7C0B2 100%)`,
        boxShadow: `inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -3px 10px rgba(0,0,0,0.25)`,
        transform: `scaleY(${(0.82 + born * 0.18).toFixed(3)})`, transformOrigin: "50% 100%",
      }}>
        {/* manchas de agua — YA está mojada, es la materia que va a cruzar a la hoja */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(60% 40% at 84% 8%, ${rgba(MD.cold, 0.34)} 0%, rgba(0,0,0,0) 62%), radial-gradient(45% 55% at 8% 92%, ${rgba(MD.cold, 0.22)} 0%, rgba(0,0,0,0) 60%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.5,
          background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.035) 0 1px, rgba(0,0,0,0) 1px 4px)",
        }} />
        {/* banda roja superior */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, height: 74,
          background: `linear-gradient(180deg, ${MD.red} 0%, #B8241E 100%)`,
          transform: `scaleX(${clamp01((f - 100) / 22).toFixed(3)})`, transformOrigin: "0% 50%",
          display: "flex", alignItems: "center", paddingLeft: 30, gap: 20,
        }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 34, letterSpacing: 7, color: MD.white, opacity: clamp01((f - 116) / 16) }}>WARNING</div>
        </div>
        {/* marca, tipografiada — sin logo */}
        <div style={{
          position: "absolute", left: 30, top: 96, fontFamily: F_SANS, fontWeight: 700, fontSize: 34,
          letterSpacing: 11, color: "#4A4438", opacity: clamp01((f - K.kohler - 24) / 20),
        }}>KOHLER</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 146 }}>
          <Words text="IN-TANK CLEANERS" f={f} at={132} step={5} size={54} color="#141210" />
          <Words text="VOID THE WARRANTY" f={f} at={150} step={5} size={54} color="#141210" />
        </div>
        <div style={{
          position: "absolute", left: 30, right: 30, bottom: 26, fontFamily: F_SANS, fontWeight: 600,
          fontSize: 32, letterSpacing: 1.2, color: "#5A5245", opacity: clamp01((f - 176) / 24),
        }}>THEY DESTROY PARTS AND CAUSE LEAKS</div>
      </div>
      {/* esquina despegada */}
      <div style={{
        position: "absolute", right: -2, bottom: -2, width: 96, height: 96,
        transform: `rotate(${(peel * -16).toFixed(2)}deg) translate(${(peel * 8).toFixed(1)}px, ${(peel * 6).toFixed(1)}px)`,
        transformOrigin: "100% 100%",
        background: `linear-gradient(315deg, #9C948A 0%, ${MD.bone} 60%)`,
        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        boxShadow: "-6px -6px 14px rgba(0,0,0,0.5)", opacity: peel,
      }} />
    </div>
  );
};

const ValveBand: React.FC<{ f: number }> = ({ f }) => {
  const on = clamp01((f - 8) / 26); // la banda ya está ahí: en f218 llega la CÁMARA, no el objeto
  const bob = Math.sin(f / 55) * 1.6;
  return (
    <div style={{ position: "absolute", left: 420 - 200, top: 0, width: 400, height: 1080, transformStyle: "preserve-3d" }}>
      {/* la torre de la válvula: cilindro de plástico */}
      <div style={{
        position: "absolute", left: 108, top: -220, width: 184, height: 1160,
        transform: `translateZ(-40px) translateY(${bob.toFixed(2)}px)`, borderRadius: "18px 18px 6px 6px",
        background: `linear-gradient(90deg, #101216 0%, #2B3038 22%, #454C57 44%, #22262C 70%, #0C0E11 100%)`,
        boxShadow: `0 30px 70px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.5)`,
      }} />
      {/* la copa flotante */}
      <div style={{
        position: "absolute", left: 62, top: 596, width: 278, height: 172,
        transform: `translateZ(-24px) translateY(${(bob * 1.6).toFixed(2)}px)`, borderRadius: "12px 12px 26px 26px",
        background: `linear-gradient(96deg, #14171B 0%, #363C45 40%, #1A1D22 100%)`,
        boxShadow: `0 22px 50px rgba(0,0,0,0.7), inset 0 2px 0 ${rgba(MD.cold, 0.24)}`,
      }} />
      {/* LA BANDA IMPRESA — el objetivo del zoom-through */}
      <div style={{
        position: "absolute", left: 96, top: 480, width: 208, height: 122,
        transform: `translateZ(-30px) translateY(${bob.toFixed(2)}px)`, borderRadius: 5, overflow: "hidden",
        background: `linear-gradient(92deg, #6E675C 0%, ${MD.bone} 26%, #E9E4D9 52%, #A9A196 82%, #55504A 100%)`,
        boxShadow: `0 10px 22px rgba(0,0,0,0.66), inset 0 0 18px rgba(0,0,0,0.28)`,
        opacity: on,
      }}>
        <div style={{
          position: "absolute", left: 12, top: 14, fontFamily: F_SANS, fontWeight: 800, fontSize: 21,
          letterSpacing: 3.6, color: "#1C1A17", transform: `scaleX(${(0.86 + 0.14 * on).toFixed(3)})`, transformOrigin: "0 50%",
        }}>FLUIDMASTER</div>
        {/* la letra chica que nadie leyó — de acá salimos disparados al acto 2 */}
        <div style={{ position: "absolute", left: 12, right: 10, top: 46 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{
              height: 5, marginBottom: 7, width: `${94 - i * 9}%`, borderRadius: 1,
              background: "rgba(20,18,16,0.82)",
              transform: `scaleX(${clamp01((f - K.fluid - i * 7) / 22).toFixed(3)})`, transformOrigin: "0 50%",
            }} />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(102deg, rgba(255,255,255,0) 40%, ${rgba(MD.white, 0.2)} 50%, rgba(255,255,255,0) 60%)`, transform: `translateX(${(((f - K.fluid) * 2.4) % 420 - 210).toFixed(1)}%)` }} />
      </div>
    </div>
  );
};

const Act1: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const surf = keyed(f, [0, 220, 410], [0, 1, 1.2], EZ.soft);
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      {/* z -560 · pared de porcelana del fondo */}
      <div style={{
        position: "absolute", inset: "-45%", transform: "translateZ(-560px)",
        background:
          `linear-gradient(178deg, ${rgba(MD.cold, 0.16)} 0%, #1A2026 26%, #0C1015 66%, #06080A 100%),` +
          `radial-gradient(50% 34% at 22% 18%, rgba(255,255,255,0.055) 0%, rgba(0,0,0,0) 70%)`,
      }} />
      {/* z -430 · columna de luz que entra desde arriba (la tapa entreabierta) */}
      <div style={{
        position: "absolute", inset: "-30%", transform: "translateZ(-430px)",
        background: `linear-gradient(184deg, ${rgba(tint, 0.3 * surf)} 0%, ${rgba(tint, 0.08)} 26%, rgba(0,0,0,0) 58%)`,
        mixBlendMode: "screen",
      }} />
      {/* z -350 · cáusticas lejanas */}
      <div style={{ position: "absolute", inset: 0, transform: "translateZ(-350px)" }}>
        <Caustics f={f} tint={tint} op={0.5} sc={1.5} />
      </div>
      {/* z -160 · el tubo rebosadero, al fondo derecha */}
      <div style={{
        position: "absolute", left: 1610, top: 180, width: 92, height: 900, transform: "translateZ(-160px)",
        borderRadius: "10px 10px 0 0",
        background: `linear-gradient(90deg, #0A0C0F 0%, #2E343C 40%, #12151A 100%)`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.7), inset 0 2px 0 ${rgba(MD.cold, 0.2)}`,
      }} />
      <ValveBand f={f} />
      <WarningLabel f={f} />
      {/* z +120 / +300 · agua delante de la cámara */}
      <Bubbles f={f} n={22} seed={3} speed={1} size={1} op={0.9} z={110} spread={120} />
      <div style={{ position: "absolute", inset: 0, transform: "translateZ(210px)" }}>
        <Caustics f={f} tint={tint} op={0.42} sc={0.8} />
      </div>
      <Bubbles f={f} n={7} seed={19} speed={1.7} size={3.4} op={0.34} z={330} spread={140} />
      <Motes f={f} n={30} seed={41} tint={tint} op={0.55} z={60} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 2 — LA LETRA CHICA. El texto ES el objeto. Zoom-through desde la banda del acto 1.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Stamp: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const p = clamp01((f - at) / 16);
  const e = EZ.snap(p);
  return (
    <div style={{
      position: "absolute", right: 100, top: 900,
      transform: `rotate(-11deg) scale(${(2.1 - e * 1.1).toFixed(3)})`, opacity: p > 0 ? Math.min(1, p * 3) : 0,
      border: `7px solid ${rgba(MD.red, 0.82)}`, borderRadius: 10, padding: "12px 30px",
      color: rgba(MD.red, 0.86), fontFamily: F_SANS, fontWeight: 900, fontSize: 74, letterSpacing: 8,
      boxShadow: `inset 0 0 18px ${rgba(MD.red, 0.2)}`,
    }}>VOID</div>
  );
};

const Act2: React.FC<{ f: number }> = ({ f }) => {
  // ── COSTURA A: ZOOM-THROUGH. La hoja nace EXACTAMENTE sobre la banda del Fluidmaster
  // (world 420,540 · grupo anclado en 460,-150 → local -40,690) y se abre hasta pantalla llena.
  const dive = clamp01((f - 396) / 30);
  const de = EZ.push(dive);
  const sc = lerp(0.10, 1, de);                        // arranca del tamaño de la banda impresa
  const tx = lerp(-80, 0, de), ty = lerp(-149, 0, de); // aterriza sobre world (420,541) = la banda
  const spin = lerp(-9, 0, de);
  // inundación: el agua sube y ahoga la hoja (materia que cruza a la frontera B)
  const fl = clamp01((f - 698) / 46);
  const flood = EZ.push(fl);
  const buckle = 1 - flood * 0.06;
  const W = 1560, H = 1240;

  const line = (t: string, at: number, size: number, step = 5) => (
    <div style={{ marginBottom: size * 0.1 }}>
      <Words text={t} f={f} at={at} step={step} size={size} weight={900} color="#0B0A09" lh={1.02} />
    </div>
  );

  return (
    <div style={{
      position: "absolute", left: 960 - W / 2, top: 540 - H / 2, width: W, height: H,
      transform: `translateZ(0px) translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${sc.toFixed(4)}) rotateY(${spin.toFixed(2)}deg) scaleY(${buckle.toFixed(3)})`,
      transformOrigin: "50% 50%", transformStyle: "preserve-3d",
    }}>
      {/* sombra: la hoja tiene cuerpo */}
      <div style={{ position: "absolute", inset: "2% -2% -3% -2%", boxShadow: "0 50px 130px 44px rgba(0,0,0,0.82)" }} />
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", borderRadius: 4,
        background:
          `radial-gradient(88% 70% at 50% 34%, #EFEAE0 0%, #E0DACE 58%, #C6BFB1 100%)`,
        boxShadow: "inset 0 0 90px rgba(60,50,36,0.28)",
      }}>
        {/* fibra del papel + trama de impresión */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, background: "repeating-linear-gradient(90deg, rgba(90,80,60,0.05) 0 1px, rgba(0,0,0,0) 1px 5px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.35, background: "repeating-radial-gradient(circle at 0 0, rgba(40,34,26,0.09) 0 1px, rgba(0,0,0,0) 1px 4px)" }} />
        {/* la mancha de AGUA AZUL que traíamos del tanque + la gota que corre */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(46% 24% at 88% -3%, ${rgba(MD.cold, 0.42)} 0%, ${rgba(MD.cold, 0.1)} 52%, rgba(0,0,0,0) 76%)`,
        }} />
        <div style={{
          position: "absolute", left: 1298, top: 40, width: 15, height: 34, borderRadius: "50% 50% 46% 46%",
          background: rgba(MD.cold, 0.5), boxShadow: `0 0 16px ${rgba(MD.cold, 0.4)}`,
          transform: `translateY(${keyed(f, [430, 690], [0, 700], EZ.drop).toFixed(1)}px) scaleY(${(1 + keyed(f, [430, 690], [0, 1.6], EZ.lin)).toFixed(2)})`,
        }} />

        {/* atribución tipográfica — sin identidad visual de marca */}
        <div style={{
          position: "absolute", left: 84, top: 64, fontFamily: F_SANS, fontWeight: 700, fontSize: 30,
          letterSpacing: 8, color: "#6B6355",
        }}>FLUIDMASTER · PRINTED ON THE VALVE</div>
        <div style={{
          position: "absolute", left: 84, top: 112, width: keyed(f, [402, 470], [0, 1392], EZ.push), height: 9,
          background: MD.red,
        }} />

        <div style={{ position: "absolute", left: 84, right: 84, top: 160 }}>
          {line("DO NOT USE IN-TANK", K.donot, 112)}
          {line("DROP-INS CONTAINING", K.donot + 26, 112)}
          {line("BLEACH OR CHLORINE", K.donot + 54, 112)}
        </div>

        <div style={{ position: "absolute", left: 84, right: 84, top: 556 }}>
          <div style={{ width: keyed(f, [K.damage - 8, K.damage + 30], [0, 1392], EZ.soft), height: 3, background: "#8B8375", marginBottom: 34 }} />
          {line("IT WILL DAMAGE TANK COMPONENTS", K.damage, 62, 3)}
        </div>
        <div style={{ position: "absolute", left: 84, right: 84, top: 700 }}>
          {line("IT MAY CAUSE FLOODING", K.flood, 62, 3)}
          {line("AND IT VOIDS THE WARRANTY", K.flood + 42, 62, 3)}
        </div>
        <Stamp f={f} at={K.flood + 44} />

        {/* pie: numeración de la letra chica, para que la hoja se sienta real */}
        <div style={{ position: "absolute", left: 84, top: 880, fontFamily: F_SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: "#7A7264" }}>
          400CRP14 · WARNINGS · 3 OF 3
        </div>

        {/* ── COSTURA B (1/2): EL AGUA SUBE Y AHOGA LA HOJA ── */}
        <div style={{
          position: "absolute", left: -40, right: -40, bottom: 0, height: `${(flood * 128).toFixed(1)}%`,
          background: `linear-gradient(180deg, ${rgba(MD.cold, 0.0)} 0%, ${rgba(MD.cold, 0.5)} 6%, rgba(12,20,28,0.86) 40%, rgba(6,10,14,0.97) 100%)`,
          boxShadow: `0 -12px 40px ${rgba(MD.cold, 0.35)}`,
        }}>
          <div style={{
            position: "absolute", left: 0, right: 0, top: -14, height: 30,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(MD.cold, 0.6)} 60%, rgba(0,0,0,0) 100%)`,
            transform: `scaleY(${(1 + Math.sin(f / 7) * 0.3).toFixed(2)})`,
          }} />
        </div>
        {/* el papel se satura donde se moja */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: `${(flood * 132).toFixed(1)}%`,
          background: rgba(MD.cold, 0.14), mixBlendMode: "multiply",
        }} />
      </div>
      {/* barrido especular sobre el papel satinado (hold vivo) */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Sheen at={498} dur={54} angle={12} />
        <Sheen at={646} dur={44} angle={-8} />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL DISCO — LA MATERIA QUE CRUZA LA FRONTERA C.
   El MISMO elemento es la pastilla azul (mat 0) y el flapper de goma (mat 1). No hay
   fundido cruzado: el material se transforma mientras la forma se sostiene en su lugar.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const CRACKS = [
  "M100 100 L142 46 L166 30", "M100 100 L54 58 L28 50", "M100 100 L120 168 L138 190",
  "M100 100 L38 128 L14 148", "M100 100 L176 118 L196 128", "M100 100 L74 34 L66 12",
];
const Disc: React.FC<{ f: number; size: number; mat: number; erode: number; crack: number; broken: number }> =
  ({ f, size, mat, erode, crack, broken }) => {
    const core = mix("#3F80D8", "#191A1D", mat);
    const hi = mix("#A8CEF2", "#4A4B50", mat);
    const edge = mix("#245495", "#08090B", mat);
    const spin = Math.sin(f / 74) * 3.2;
    return (
      <div style={{
        position: "relative", width: size, height: size,
        transform: `rotateX(${(16 + mat * 10).toFixed(1)}deg) rotateZ(${spin.toFixed(2)}deg)`, transformStyle: "preserve-3d",
      }}>
        {/* sombra de contacto */}
        <div style={{
          position: "absolute", left: "6%", top: "72%", width: "88%", height: "34%", borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.42) 56%, rgba(0,0,0,0) 100%)",
        }} />
        {/* canto */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", transform: "translateY(3.5%) translateZ(-8px)",
          background: edge, boxShadow: `0 10px 26px rgba(0,0,0,0.7)`,
        }} />
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
          background: `radial-gradient(circle at 34% 26%, ${hi} 0%, ${core} 46%, ${edge} 100%)`,
          boxShadow: `inset 0 ${size * 0.02}px 0 ${rgba(MD.white, 0.24 * (1 - mat * 0.7))}, inset 0 -${size * 0.03}px ${size * 0.09}px rgba(0,0,0,0.55)`,
        }}>
          {/* textura: tiza (azul) → goma mate (negro) */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.36 * (1 - mat),
            background: "repeating-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.14) 0 2px, rgba(0,0,0,0) 2px 7px)",
          }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.5 * mat,
            background: "repeating-linear-gradient(38deg, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0.16) 2px 6px)",
          }} />
          {/* anillo grabado (la pastilla lo trae; el flapper lo hereda como su sello) */}
          <div style={{
            position: "absolute", inset: "18%", borderRadius: "50%",
            border: `${(size * 0.012).toFixed(1)}px solid ${rgba(mat > 0.5 ? MD.white : "#1E3F6E", 0.16)}`,
          }} />
          {/* el agujero del flapper aparece cuando la goma toma el mando */}
          <div style={{
            position: "absolute", left: "38%", top: "38%", width: "24%", height: "24%", borderRadius: "50%",
            background: `radial-gradient(circle, #000 0%, ${rgba("#000000", 0.6)} 70%, rgba(0,0,0,0) 100%)`,
            opacity: clamp01((mat - 0.45) / 0.4),
            boxShadow: `inset 0 2px 6px rgba(255,255,255,0.14)`,
          }} />
          {/* mordidas: la pastilla se come sus propios bordes */}
          {Array.from({ length: 9 }, (_, i) => {
            const a = rnd(i * 4.1) * Math.PI * 2, r = 46 + rnd(i * 9.3) * 5;
            const d = (6 + rnd(i * 2.7) * 12) * (size / 420) * erode;
            return <div key={i} style={{
              position: "absolute", left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%`,
              width: d, height: d, borderRadius: "50%", transform: "translate(-50%,-50%)",
              background: "rgba(4,6,10,0.92)", opacity: erode,
            }} />;
          })}
          {/* GRIETAS — el cloro endurece y parte la goma */}
          <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {CRACKS.map((d, i) => {
              const p = clamp01((crack - i * 0.09) / 0.42);
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={rgba(MD.redHot, 0.5 * p)} strokeWidth={3.4} strokeLinecap="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                  <path d={d} fill="none" stroke={`rgba(2,3,5,${0.9 * p})`} strokeWidth={1.9} strokeLinecap="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                </g>
              );
            })}
          </svg>
          {/* la goma se abre: cuña que se separa */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: `conic-gradient(from 18deg, rgba(0,0,0,0) 0deg, rgba(0,0,0,${0.9 * broken}) ${(2 + broken * 44).toFixed(0)}deg, rgba(0,0,0,0) ${(6 + broken * 52).toFixed(0)}deg)`,
          }} />
        </div>
        {/* especular húmedo */}
        <div style={{
          position: "absolute", left: "16%", top: "12%", width: "42%", height: "26%", borderRadius: "50%",
          background: `radial-gradient(circle at 40% 40%, ${rgba(MD.white, 0.3 - mat * 0.15)} 0%, rgba(255,255,255,0) 70%)`,
          transform: `rotate(${(-18 + Math.sin(f / 40) * 4).toFixed(1)}deg)`,
        }} />
      </div>
    );
  };

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 3 — LA PASTILLA AZUL. El agua se satura, la pluma baja y se come la goma.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Plume: React.FC<{ f: number; born: number }> = ({ f, born }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 500, height: 700, pointerEvents: "none", transform: "translateZ(-40px)" }}>
    {Array.from({ length: 16 }, (_, i) => {
      const a = rnd(i * 1.9), b = rnd(i * 6.7);
      const t = clamp01((born - i * 0.028) / 0.5);
      const drop = t * (300 + b * 330);
      const sway = Math.sin(f / (16 + b * 12) + i * 1.7) * (18 + a * 26);
      return (
        <div key={i} style={{
          position: "absolute", left: `${44 + a * 14}%`, top: 0,
          width: 20 + b * 44, height: 130 + a * 250, borderRadius: "50%",
          transform: `translate(${sway.toFixed(1)}px, ${drop.toFixed(1)}px) scaleY(${(0.5 + t * 1.4).toFixed(2)})`,
          background: `radial-gradient(50% 50% at 50% 20%, ${rgba("#4A8EE0", 0.34)} 0%, ${rgba("#2C63AE", 0.13)} 48%, rgba(0,0,0,0) 78%)`,
          opacity: t * (1 - t * 0.35),
        }} />
      );
    })}
  </div>
);

const GhostLabel: React.FC<{ f: number }> = ({ f }) => {
  const on = clamp01((f - K.glued) / 26);
  const strike = keyed(f, [K.glued + 40, K.glued + 96], [0, 1], EZ.push);
  const fog = keyed(f, [K.glued + 118, K.glued + 190], [0, 1], EZ.soft);
  return (
    <div style={{
      position: "absolute", left: 1240, top: 250, width: 520, height: 268, transform: "translateZ(-470px) rotateY(-16deg)",
      opacity: on * 0.9, overflow: "hidden", borderRadius: 5,
      background: `linear-gradient(160deg, ${rgba(MD.bone, 0.5)} 0%, ${rgba(MD.bone, 0.24)} 100%)`,
      boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
    }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 46, background: rgba(MD.red, 0.55) }} />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", left: 26, top: 82 + i * 34, height: 12, width: `${74 - i * 8}%`,
          background: "rgba(16,16,18,0.42)", borderRadius: 2,
        }} />
      ))}
      <div style={{
        position: "absolute", left: 26, top: 150, height: 7, width: `${(strike * 84).toFixed(1)}%`,
        background: MD.redHot, boxShadow: `0 0 18px ${MD.redHot}`,
      }} />
      {/* "and nobody ever read it" — se empaña */}
      <div style={{ position: "absolute", inset: 0, background: rgba(MD.cold, 0.5 * fog) }} />
    </div>
  );
};

const Act3: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const sat = clamp01((f - K.tablet) / 150);           // el agua se pone azul
  const drain = keyed(f, [1086, 1146], [0, 1500], EZ.push); // ── COSTURA C: el agua se DRENA
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateY(${drain.toFixed(1)}px)` }}>
      <div style={{
        position: "absolute", inset: "-45%", transform: "translateZ(-560px)",
        background: `linear-gradient(176deg, ${rgba(tint, 0.14)} 0%, #141A20 30%, #090C10 74%, #05070A 100%)`,
      }} />
      <GhostLabel f={f} />
      <div style={{ position: "absolute", inset: 0, transform: "translateZ(-330px)" }}>
        <Caustics f={f} tint={tint} op={0.55} sc={1.4} />
      </div>
      {/* el agua teñida: la MISMA del acto 1, ahora cargada de azul */}
      <div style={{
        position: "absolute", inset: "-20%", transform: "translateZ(-200px)",
        background: `radial-gradient(70% 60% at 50% 28%, ${rgba("#2F6BC0", 0.3 * sat)} 0%, ${rgba("#17335C", 0.16 * sat)} 52%, rgba(0,0,0,0) 82%)`,
        mixBlendMode: "screen",
      }} />
      <Plume f={f} born={clamp01((f - K.told) / 240)} />
      {/* el fondo del tanque + el asiento del flapper esperando abajo */}
      <div style={{
        position: "absolute", left: 560, top: 902, width: 800, height: 260, transform: "translateZ(-90px) rotateX(62deg)",
        borderRadius: "50%",
        background: `radial-gradient(60% 60% at 50% 34%, #1C2126 0%, #0B0E12 62%, #05070A 100%)`,
        boxShadow: `inset 0 0 60px rgba(0,0,0,0.8), 0 -10px 40px ${rgba(tint, 0.12)}`,
        opacity: clamp01((f - 940) / 90),
      }} />
      <Bubbles f={f} n={20} seed={5} speed={1.1} op={0.8} z={120} spread={130} />
      <Bubbles f={f} n={6} seed={23} speed={1.9} size={3.6} op={0.3} z={340} spread={150} />
      <Motes f={f} n={30} seed={47} tint="#6FA6E8" op={0.7} z={40} />
      <div style={{ position: "absolute", inset: 0, transform: "translateZ(230px)" }}>
        <Caustics f={f} tint={tint} op={0.4} sc={0.75} />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 4 — EL PRECIO. La goma se deshace en los dedos y el trueque queda a la vista.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Fingers: React.FC<{ f: number }> = ({ f }) => {
  const inn = keyed(f, [1104, 1146], [520, 0], EZ.snap);
  const squeeze = Math.sin(clamp01((f - 1150) / 120) * Math.PI) * 26;
  const F = (x: number, y: number, w: number, h: number, rot: number, d: number) => (
    <div style={{
      position: "absolute", left: x, top: y + inn * (1 + d * 0.2), width: w, height: h,
      transform: `rotate(${rot + squeeze * d * 0.14}deg) translateZ(${d * 40}px)`,
      borderRadius: `${w * 0.48}px ${w * 0.48}px ${w * 0.36}px ${w * 0.36}px`,
      background: `linear-gradient(96deg, #05060800 0%, #0B0D10 18%, #23262B 46%, #101317 74%, #06070A 100%)`,
      boxShadow: `inset 2px 0 0 ${rgba(MD.redHot, 0.34)}, inset -2px 0 0 ${rgba(MD.cold, 0.14)}, 0 -18px 50px rgba(0,0,0,0.8)`,
    }} />
  );
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", pointerEvents: "none" }}>
      {F(470, 690, 168, 620, 13, 1)}
      {F(632, 742, 152, 560, 7, 0.6)}
      {F(1230, 704, 168, 600, -12, 1)}
      {F(1092, 756, 150, 540, -6, 0.6)}
    </div>
  );
};

const Jelly: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: 9 }, (_, i) => {
      const a = rnd(i * 3.3), b = rnd(i * 8.1);
      const t = clamp01((f - (at + i * 9)) / 120);
      if (t <= 0) return null;
      const g = EZ.drop(t);
      const y = g * (420 + b * 300);
      const x = (a - 0.5) * 200 * t;
      const w = 46 + b * 74, h = (34 + a * 50) * (1 + g * 1.5);
      const wob = Math.sin(f / 9 + i) * 6;
      return (
        <div key={i} style={{
          position: "absolute", left: 960 + x - w / 2, top: 520 + y, width: w, height: h,
          borderRadius: `${52 + wob}% ${48 - wob}% ${44 + wob}% ${56 - wob}% / ${60 + wob}% ${64 - wob}% ${38 + wob}% ${36 - wob}%`,
          background: `radial-gradient(45% 40% at 38% 26%, #34363C 0%, #131417 46%, #050608 100%)`,
          boxShadow: `inset 0 2px 0 ${rgba(MD.redHot, 0.2)}, 0 12px 26px rgba(0,0,0,0.7)`,
          opacity: 1 - clamp01((t - 0.78) / 0.22),
          transform: `rotate(${(a * 60 - 30 + g * 40).toFixed(1)}deg)`,
        }} />
      );
    })}
  </div>
);

const TradeScene: React.FC<{ f: number }> = ({ f }) => {
  const on = clamp01((f - K.trade) / 18);
  const e = EZ.snap(on);
  const drips = Math.floor(clamp01((f - K.trade) / 150) * 6);
  const pool = eio(0.05, 1, clamp01((f - K.trade - 30) / 130));
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      {/* IZQUIERDA · el aro en la taza (lo que creías estar comprando) */}
      <div style={{
        position: "absolute", left: 190, top: 330, width: 620, height: 420,
        transform: `translateZ(${(-60 + e * 60).toFixed(0)}px) rotateX(58deg) rotateZ(${(-6 + e * 6).toFixed(1)}deg) scale(${(0.82 + e * 0.18).toFixed(3)})`,
        opacity: on,
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(58% 58% at 46% 34%, #2A3138 0%, #171B20 54%, #090B0E 100%)`,
          boxShadow: `inset 0 10px 40px rgba(0,0,0,0.8), 0 0 60px ${rgba(MD.cold, 0.1)}`,
          border: `12px solid #22272D`,
        }} />
        <div style={{
          position: "absolute", inset: "20%", borderRadius: "50%",
          border: `13px solid ${rgba("#7A5B3E", 0.5)}`, filter: "blur(2.4px)",
          opacity: 0.5 + Math.sin(f / 26) * 0.12,
        }} />
      </div>
      {/* DERECHA · el inodoro que gotea (lo que estás pagando) */}
      <div style={{
        position: "absolute", right: 210, top: 250, width: 400, height: 560,
        transform: `translateZ(${(-30 + e * 30).toFixed(0)}px) scale(${(0.86 + e * 0.14).toFixed(3)})`, opacity: on,
      }}>
        <div style={{
          position: "absolute", left: 40, top: 0, width: 320, height: 400, borderRadius: "18px 18px 60px 60px",
          background: `linear-gradient(96deg, #0A0C0F 0%, #262B32 34%, #3A4048 52%, #15181D 78%, #06080A 100%)`,
          boxShadow: `0 40px 90px rgba(0,0,0,0.8), inset 0 2px 0 ${rgba(MD.cold, 0.2)}`,
        }} />
        {/* las gotas */}
        {Array.from({ length: 6 }, (_, i) => {
          const st = K.trade + 22 + i * 26;
          const t = clamp01((f - st) / 26);
          if (t <= 0 || i > drips) return null;
          return <div key={i} style={{
            position: "absolute", left: 176, top: 388 + EZ.drop(t) * 150, width: 13, height: 13 + t * 16,
            borderRadius: "50% 50% 46% 46%", background: rgba(MD.redHot, 0.7),
            boxShadow: `0 0 16px ${rgba(MD.redHot, 0.6)}`, opacity: 1 - clamp01((t - 0.86) / 0.14),
          }} />;
        })}
        {/* el charco */}
        <div style={{
          position: "absolute", left: 200, top: 542, width: 300, height: 74,
          transform: `translate(-50%,0) scale(${(0.2 + pool * 1).toFixed(3)}, ${(0.3 + pool).toFixed(3)})`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(MD.red, 0.42)} 0%, ${rgba("#3A0D0A", 0.7)} 56%, rgba(0,0,0,0) 100%)`,
          boxShadow: `0 0 50px ${rgba(MD.red, 0.34)}`,
        }} />
      </div>
      {/* el glifo del trueque */}
      <svg viewBox="0 0 200 120" style={{ position: "absolute", left: 860, top: 470, width: 200, height: 120, opacity: clamp01((f - K.trade - 14) / 20) }}>
        <path d="M18 42 H150 l-22 -20 M182 78 H50 l22 20" fill="none" stroke={MD.redHot} strokeWidth={7}
          strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - keyed(f, [K.trade + 14, K.trade + 54], [0, 1], EZ.push)}
          style={{ filter: `drop-shadow(0 0 10px ${MD.red})` }} />
      </svg>
    </div>
  );
};

const Act4: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
    {/* el cuarto rojo: piso mojado que refleja */}
    <div style={{
      position: "absolute", inset: "-40%", transform: "translateZ(-520px)",
      background: `radial-gradient(70% 54% at 50% 30%, ${rgba(MD.red, 0.13)} 0%, rgba(0,0,0,0) 66%), linear-gradient(180deg, #0B0C0E 0%, #050607 100%)`,
    }} />
    {f < K.trade + 6 && <Fingers f={f} />}
    {f >= K.jelly && f < K.trade + 10 && <Jelly f={f} at={K.jelly + 22} />}
    {/* "every day there is a tablet in that tank": tres pastillas caen y cada una pudre un poco más */}
    {f >= K.every - 10 && f < K.trade && Array.from({ length: 3 }, (_, i) => {
      const st = K.every + i * 30;
      const t = clamp01((f - st) / 34);
      if (t <= 0) return null;
      return <div key={i} style={{
        position: "absolute", left: 700 + i * 250, top: -140 + EZ.drop(t) * 940, width: 96, height: 96,
        borderRadius: "50%", transform: `translateZ(-260px) rotate(${(t * 120).toFixed(0)}deg)`,
        background: `radial-gradient(circle at 34% 28%, ${rgba("#5A96E4", 0.5)} 0%, ${rgba("#20447A", 0.3)} 60%, rgba(0,0,0,0) 100%)`,
        opacity: (1 - clamp01((t - 0.6) / 0.4)) * 0.85,
      }} />;
    })}
    {f >= K.trade - 4 && <TradeScene f={f} />}
    <Motes f={f} n={22} seed={71} tint={MD.redHot} op={0.4} z={90} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 5 — DEBAJO DEL BORDE. El canal escondido, los rim jets y la baba que pinta la taza.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const RimChannel: React.FC<{ f: number }> = ({ f }) => {
  const open = clamp01((f - A5) / 30);
  const jets = 9;
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      {/* fondo de la taza, muy abajo y lejos */}
      <div style={{
        position: "absolute", inset: "-40%", transform: "translateZ(-540px)",
        background: `radial-gradient(60% 50% at 50% 90%, #14171B 0%, #08090C 58%, #040507 100%)`,
      }} />
      {/* la pared interior de porcelana, curvada */}
      <div style={{
        position: "absolute", left: -260, right: -260, top: -300, height: 1160,
        transform: "translateZ(-260px)", borderRadius: "50% 50% 44% 44% / 62% 62% 30% 30%",
        background: `linear-gradient(180deg, #2B3138 0%, #1B2026 26%, #0E1114 62%, #07090B 100%)`,
        boxShadow: `inset 0 -60px 120px rgba(0,0,0,0.8)`,
      }} />
      {/* EL LABIO: la cara de abajo del borde. Acá vive el canal. */}
      <div style={{
        position: "absolute", left: -200, right: -200, top: -180 + (1 - EZ.snap(open)) * -70, height: 620,
        transform: "translateZ(-60px)", borderRadius: "0 0 50% 50% / 0 0 42% 42%", overflow: "hidden",
        background: `linear-gradient(180deg, #3A424A 0%, #2A3138 22%, #1A1F25 52%, #10141A 76%, #090C10 100%)`,
        boxShadow: `0 40px 100px rgba(0,0,0,0.85), inset 0 -20px 60px rgba(0,0,0,0.7)`,
      }}>
        {/* luz fría rasante desde la izquierda (entra por la taza) */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(60% 70% at 8% 90%, ${rgba(MD.cold, 0.14)} 0%, rgba(0,0,0,0) 62%)`,
        }} />
        {/* la película de baba, continua, con brillo húmedo */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: 330,
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(MD.mold, 0.34)} 34%, ${rgba(MD.mold, 0.62)} 70%, rgba(10,12,10,0.9) 100%)`,
        }} />
        {Array.from({ length: 14 }, (_, i) => {
          const a = rnd(i * 2.9), b = rnd(i * 6.3);
          const w = 90 + a * 210;
          return <div key={i} style={{
            position: "absolute", left: `${(i / 14) * 108 - 4 + b * 3}%`, bottom: 120 + a * 120,
            width: w, height: 60 + b * 80, borderRadius: "48% 52% 60% 40% / 40% 44% 56% 60%",
            background: `radial-gradient(50% 50% at 40% 34%, ${rgba(MD.moldLit, 0.4)} 0%, ${rgba(MD.mold, 0.5)} 52%, rgba(0,0,0,0) 88%)`,
            transform: `scaleY(${(1 + Math.sin(f / 44 + i) * 0.06).toFixed(3)})`,
          }} />;
        })}
        {/* LOS RIM JETS: los agujeros del canal */}
        {Array.from({ length: jets }, (_, i) => {
          const x = 6 + (i / (jets - 1)) * 88;
          const y = 388 + Math.sin((i / (jets - 1)) * Math.PI) * -54;
          const born = clamp01((f - A5 - 10 - i * 5) / 22);
          const wet = 0.5 + Math.sin(f / 21 + i * 1.3) * 0.2;
          return (
            <div key={i} style={{ position: "absolute", left: `${x}%`, top: y, transform: `translate(-50%,-50%) scale(${(0.6 + born * 0.4).toFixed(3)})`, opacity: born }}>
              {/* collar de baba */}
              <div style={{
                position: "absolute", left: "50%", top: "50%", width: 132, height: 96, transform: "translate(-50%,-50%)",
                borderRadius: "50%", background: `radial-gradient(circle, ${rgba(MD.mold, 0.72)} 0%, ${rgba(MD.mold, 0.28)} 58%, rgba(0,0,0,0) 82%)`,
              }} />
              <div style={{
                width: 68, height: 46, borderRadius: "50%",
                background: `radial-gradient(circle at 50% 34%, #000 0%, #05070A 60%, #0D1116 100%)`,
                boxShadow: `inset 0 4px 8px rgba(0,0,0,0.9), 0 0 ${(10 + wet * 14).toFixed(0)}px ${rgba(MD.moldLit, 0.34)}, 0 3px 0 ${rgba(MD.white, 0.1)}`,
              }} />
              {/* hilo que cuelga */}
              <div style={{
                position: "absolute", left: "50%", top: 40, width: 7,
                height: 22 + rnd(i * 5.5) * 44 + Math.sin(f / 33 + i) * 5,
                transform: "translateX(-50%)", borderRadius: "0 0 50% 50%",
                background: `linear-gradient(180deg, ${rgba(MD.mold, 0.85)} 0%, ${rgba(MD.mold, 0.2)} 100%)`,
              }} />
            </div>
          );
        })}
        {/* LA DESCARGA: la MISMA agua azulada del acto 1 baja por los jets y pinta la taza */}
        {f > 1648 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 360, height: 320, overflow: "hidden" }}>
            {Array.from({ length: 22 }, (_, i) => {
              const a = rnd(i * 3.7), b = rnd(i * 8.9);
              const y = ((f - 1648) * (7 + b * 9) + a * 300) % 340;
              return <div key={i} style={{
                position: "absolute", left: `${a * 100}%`, top: y, width: 3 + b * 4, height: 40 + b * 90,
                background: `linear-gradient(180deg, ${rgba(MD.cold, 0.5)} 0%, ${rgba(MD.mold, 0.3)} 100%)`,
                opacity: 0.5,
              }} />;
            })}
          </div>
        )}
      </div>
      {/* borde exterior de porcelana, delante y desenfocado por cercanía */}
      <div style={{
        position: "absolute", left: -300, right: -300, top: -420, height: 470, transform: "translateZ(190px)",
        borderRadius: "0 0 46% 46% / 0 0 40% 40%",
        background: `linear-gradient(180deg, #10141A 0%, #1E242B 60%, #0A0D11 100%)`,
        boxShadow: `0 30px 70px rgba(0,0,0,0.9)`,
      }} />
      <Motes f={f} n={18} seed={91} tint={MD.moldLit} op={0.4} z={120} />
    </div>
  );
};

const Phone: React.FC<{ f: number }> = ({ f }) => {
  const rise = keyed(f, [K.phone, K.phone + 34], [640, 0], EZ.snap);
  const tilt = keyed(f, [K.phone, K.phone + 40, K.phone + 120], [16, -3, -6], EZ.soft);
  const shot = K.phone + 56;
  const flash = clamp01(1 - Math.abs(f - shot) / 6);
  const shown = f > shot + 4;
  return (
    <div style={{
      position: "absolute", left: 960 - 210, bottom: 96, width: 420, height: 660,
      transform: `translateY(${rise.toFixed(1)}px) rotateX(${tilt.toFixed(2)}deg) rotateZ(${(Math.sin(f / 37) * 1.1).toFixed(2)}deg) translateZ(150px)`,
      transformStyle: "preserve-3d",
    }}>
      <div style={{ position: "absolute", inset: 0, ...glassStyle({ radius: 34 }), overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 12, borderRadius: 26, overflow: "hidden",
          background: shown
            ? `radial-gradient(70% 60% at 50% 40%, ${rgba(MD.moldLit, 0.4)} 0%, #0C0F0C 62%, #050706 100%)`
            : `radial-gradient(70% 60% at 50% 40%, ${rgba(MD.mold, 0.24)} 0%, #08090B 66%, #050607 100%)`,
        }}>
          {/* lo que ve la cámara del teléfono: el canal, desde abajo */}
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} style={{
              position: "absolute", left: `${10 + i * 20}%`, top: `${34 + Math.sin(i) * 5}%`,
              width: 46, height: 30, borderRadius: "50%", transform: "translate(-50%,-50%)",
              background: "#020304", boxShadow: `0 0 14px ${rgba(MD.moldLit, 0.5)}, 0 0 0 9px ${rgba(MD.mold, 0.4)}`,
            }} />
          ))}
          {/* HUD */}
          <div style={{ position: "absolute", left: 22, top: 22, width: 44, height: 44, borderLeft: `3px solid ${rgba(MD.white, 0.7)}`, borderTop: `3px solid ${rgba(MD.white, 0.7)}` }} />
          <div style={{ position: "absolute", right: 22, bottom: 22, width: 44, height: 44, borderRight: `3px solid ${rgba(MD.white, 0.7)}`, borderBottom: `3px solid ${rgba(MD.white, 0.7)}` }} />
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center",
            fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: shown ? MD.white : rgba(MD.white, 0.6),
          }}>{shown ? "GOT IT" : "SHOOT UP"}</div>
          {/* obturador */}
          {flash > 0 && <div style={{ position: "absolute", inset: 0, background: MD.white, opacity: flash * 0.85 }} />}
        </div>
        <Sheen at={K.phone + 74} dur={40} angle={22} />
      </div>
      {/* el flash pinta el canal de arriba */}
      {flash > 0 && (
        <div style={{
          position: "absolute", left: "50%", top: -520, width: 1500, height: 700, transform: "translateX(-50%)",
          background: `radial-gradient(50% 50% at 50% 100%, ${rgba(MD.white, 0.42 * flash)} 0%, rgba(255,255,255,0) 70%)`,
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
};

/* ── COSTURA D · OCLUSIÓN ──────────────────────────────────────────────────────────────────
   El <Occluder/> de Stage sólo tapa el 100% de la pantalla durante ~1 frame (su banda mide
   180% y el barrido es largo), así que el corte se escaparía. Acá va el objeto REAL que ocluye:
   el LABIO de porcelana del borde de la taza, 260% de ancho, que cruza y nos deja debajo.
   Tapa entero entre f≈1462 y f≈1472; el cambio de acto cae en el medio (f 1466). */
const RimLip: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const x = lerp(-290, 130, EZ.push(p));
  const tilt = lerp(-7, 5, p);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: `${x.toFixed(2)}%`, top: "-46%", width: "260%", height: "192%",
        transform: `rotate(${tilt.toFixed(2)}deg)`,
        borderRadius: "0 0 34% 34% / 0 0 26% 26%",
        background:
          `linear-gradient(180deg, #05070A 0%, #0E1218 34%, #333A43 62%, #4A535E 74%, #262C34 84%, #0A0D11 100%)`,
        boxShadow: `0 60px 140px rgba(0,0,0,0.95)`,
      }}>
        {/* especular húmedo del canto de porcelana */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "72%", height: "5%",
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(MD.bone, 0.4)} 50%, rgba(0,0,0,0) 100%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(50% 40% at ${(28 - p * 20).toFixed(0)}% 68%, ${rgba(MD.cold, 0.1)} 0%, rgba(0,0,0,0) 62%)`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovTank: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const f = useCurrentFrame();
  const D = durationInFrames;
  const c = CAMERA(f);

  // ── LA LUZ VIAJA: cian-frío → rojo de alerta → rojo bajo bajo el borde ──
  const redMix = keyed(f, [0, 900, 1010, 1160, 1460, 1722], [0, 0.06, 0.42, 1, 1, 1], [EZ.lin, EZ.soft, EZ.push, EZ.lin, EZ.lin]);
  const tint = light(redMix, "cold", "red");
  const keyTravel = keyed(f, [0, 410, 730, 1100, 1460, 1722], [0.2, 0.3, 0.42, 0.58, 0.78, 0.86], EZ.soft);
  const intensity = keyed(f, [0, 410, 700, 1100, 1460, 1600, 1722], [1, 0.86, 1.02, 0.95, 0.72, 0.78, 0.7], EZ.soft);

  // ventanas de montaje: cada acto se apaga sólo cuando su costura ya lo tapó
  const showA1 = f < 430;             // sus burbujas de primer plano cruzan hacia el papel
  const showA2 = f > 392 && f < 738;   // se apaga en el PICO del VaporWipe
  const showA3 = f > 737 && f < 1150; // ni un frame antes: su agua de primer plano taparía la hoja
  const showA4 = f > 1096 && f < 1470;
  const showA5 = f > 1466;             // el labio de porcelana tapa entero de 1462 a 1472

  // EL DISCO vive por encima de los actos 3 y 4: es el mismo objeto en los dos.
  const showDisc = f > 737 && f < K.trade + 4; // nace DETRÁS del VaporWipe, nunca sobre la hoja
  const discMat = keyed(f, [1078, 1126], [0, 1], EZ.push);              // pastilla → goma
  const discErode = keyed(f, [K.told, 1000, 1090], [0, 0.55, 1], EZ.lin);
  const discCrack = keyed(f, [995, 1090, 1180], [0, 0.35, 1], EZ.soft);
  const discBroken = keyed(f, [K.jelly + 10, K.jelly + 70], [0, 1], EZ.push);
  const discSize = keyed(f, [K.tablet - 16, K.tablet + 40, 1000, 1090, 1140, K.trade], [120, 330, 300, 470, 430, 300], EZ.soft);
  const discX = keyed(f, [K.tablet - 16, K.tablet + 40, 1000, 1090, 1200, K.trade], [960, 1010, 985, 960, 960, 960], EZ.soft);
  const discY = keyed(f, [K.tablet - 16, K.tablet + 40, 900, 1000, 1090, 1150, K.jelly + 80, K.trade],
    [300, 372, 470, 640, 540, 540, 610, 700], EZ.soft);
  const discFall = f > K.jelly + 40 ? EZ.drop(clamp01((f - K.jelly - 40) / 120)) * 620 : 0;

  // texto: una idea por acto (el acto 2 es la excepción: el texto ES el objeto)
  const t3 = f > 995 && f < 1104;
  const t4 = f > K.trade + 30 && f < 1470;
  const t5 = f > K.realThing - 22 && f <= D;

  const paraX = -c.px * 0.035, paraY = -c.py * 0.03; // el texto respira con la cámara

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* ATMÓSFERA — montada UNA vez para los 1722 frames. Nunca se remonta. */}
      <Atmos tint={tint} keyFrom={keyTravel} intensity={intensity} floor />

      {/* EL MUNDO, bajo UNA sola cámara */}
      <AbsoluteFill style={{ transform: c.transform, transformStyle: "preserve-3d" }}>
        {showA1 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            <Act1 f={f} tint={tint} />
          </div>
        )}
        {showA2 && (
          <div style={{ position: "absolute", inset: 0, transform: "translate(-460px, 150px)", transformStyle: "preserve-3d" }}>
            <Act2 f={f} />
          </div>
        )}
        {showA3 && (
          <div style={{ position: "absolute", inset: 0, transform: "translate(-30px, 10px)", transformStyle: "preserve-3d" }}>
            <Act3 f={f} tint={tint} />
          </div>
        )}
        {showA4 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            <Act4 f={f} />
          </div>
        )}
        {showA5 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            <RimChannel f={f} />
            {f > K.phone - 6 && <Phone f={f} />}
            {/* el tanque queda arriba, tachado: el aro no venía de ahí */}
            <div style={{
              position: "absolute", left: 96, top: 108, width: 250, height: 168, transform: "translateZ(60px)",
              opacity: clamp01((f - K.notTank) / 20) * (1 - clamp01((f - K.realThing) / 40)),
            }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 8, border: `4px solid ${rgba(MD.cold, 0.4)}`, background: rgba(MD.cold, 0.05) }} />
              <div style={{ position: "absolute", left: 14, right: 14, top: 26, height: 8, background: rgba(MD.cold, 0.28) }} />
              <div style={{
                position: "absolute", left: -14, top: 78, height: 8, background: MD.redHot, borderRadius: 4,
                width: keyed(f, [K.notTank + 8, K.notTank + 44], [0, 282], EZ.snap),
                transform: "rotate(-17deg)", transformOrigin: "0 50%", boxShadow: `0 0 20px ${MD.red}`,
              }} />
            </div>
          </div>
        )}

        {/* ── LA MATERIA QUE CRUZA LA FRONTERA C ── el MISMO disco: pastilla y flapper */}
        {showDisc && (
          <div style={{
            position: "absolute", left: discX - discSize / 2, top: discY - discSize / 2 + discFall,
            transform: `translateZ(${(60 + discMat * 60).toFixed(0)}px)`, transformStyle: "preserve-3d",
            opacity: 1 - clamp01((f - (K.trade - 22)) / 22),
          }}>
            <Disc f={f} size={discSize} mat={discMat} erode={discErode} crack={discCrack} broken={discBroken} />
          </div>
        )}
      </AbsoluteFill>

      {/* ── CAPA DE TEXTO — una idea por acto, dentro de la safe area de 60px ── */}
      {t3 && (
        <div style={{
          position: "absolute", left: 96, bottom: 120,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
          opacity: 1 - clamp01((f - 1078) / 26),
        }}>
          <TextBed pad={30}>
            <Kicker color={MD.redHot}>CHLORINE + RUBBER</Kicker>
            <div style={{ height: 12 }} />
            <Words text="IT EATS THE RUBBER" f={f} at={1002} step={5} size={86} emFrom={1} />
          </TextBed>
        </div>
      )}
      {t4 && (
        <div style={{
          position: "absolute", left: 96, bottom: 108,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
          opacity: 1 - clamp01((f - 1436) / 24),
        }}>
          <TextBed pad={30} w={1340}>
            <Kicker>YOU'RE TRADING A RING FOR THIS</Kicker>
            <div style={{ height: 14 }} />
            <Words text="A YEAR, YEAR AND A HALF" f={f} at={K.trade + 36} step={6} size={80} emFrom={2} />
          </TextBed>
        </div>
      )}
      {t5 && (
        <div style={{
          position: "absolute", right: 96, top: 120, textAlign: "right",
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
        }}>
          <TextBed pad={30}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Kicker>WHERE THE RING COMES FROM</Kicker>
            </div>
            <div style={{ height: 12 }} />
            <Title size={88}>UNDER THE <Em>RIM</Em></Title>
          </TextBed>
        </div>
      )}

      {/* ══ LAS COSTURAS ══ una distinta por frontera, ninguna es un fundido ══════════════ */}
      {/* A @396-424 · ZOOM-THROUGH: lo resuelve la escala de la hoja + el push de cámara.
          Le sumo un destello de refracción en el momento de atravesar el papel. */}
      {f > 404 && f < 430 && (
        <AbsoluteFill style={{
          pointerEvents: "none",
          background: `radial-gradient(60% 50% at 50% 46%, ${rgba(MD.bone, 0.34 * Math.sin(clamp01((f - 404) / 26) * Math.PI))} 0%, rgba(0,0,0,0) 72%)`,
        }} />
      )}
      {/* B @700-746 · WIPE POR MATERIA: el agua sube y el vapor cruza */}
      <VaporWipe at={718} dur={34} />
      {/* C @1090-1136 · MATCH-SHAPE: el agua se drena, el disco se queda. Sin ayuda óptica. */}
      {/* D @1450-1480 · OCLUSIÓN: el labio de porcelana cruza y ya estamos DEBAJO del borde */}
      <Occluder at={1448} dur={26} color={"#2A3138"} angle={-7} />
      <RimLip f={f} at={1450} dur={30} />

      {/* respiración final: el plano no cierra, sigue avanzando */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(88% 72% at 50% 50%, rgba(0,0,0,0) 46%, rgba(0,0,0,${(0.2 + clamp01((f - (D - 60)) / 60) * 0.12).toFixed(3)}) 100%)`,
      }} />
      {/* aberración cromática sutil en los picos de energía (no es un blur global) */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: interpolate(f, [K.jelly, K.jelly + 40, K.trade, K.trade + 30], [0, 0.1, 0.1, 0], C),
        background: `linear-gradient(90deg, ${rgba(MD.red, 0.2)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(MD.cold, 0.16)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
