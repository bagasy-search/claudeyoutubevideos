// MovSafety.tsx — MIKE DALTON · BLOQUE DE SEGURIDAD · 1788 frames @ 30fps (59,6 s)
//
// UN SOLO MOVIMIENTO. No hay cinco tarjetas: hay CINCO ACTOS que se funden, con
// la misma atmósfera montada UNA vez, una cámara que es función del frame GLOBAL
// (nunca vuelve a cero) y DOS ENVASES que cruzan todas las fronteras.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// ACTO 1 · f0–130 · "SAFETY"
//   enterFrom { cam: z≈-240 (lejos, frío), luz: cold 100%, materia: UN envase sombra al fondo (z-680) }
//   exitTo    { cam: empuja y panea a la izquierda, luz: cold→red 45%, materia: ese envase VIAJA
//               al slot derecho a tamaño real; el bidón de lejía entra por izquierda en el MISMO vector }
//   COSTURA 130 → MATCH-MOVE (el envase semilla es el mismo objeto, sólo llegó)
//
// ACTO 2 · f130–545 · REGLA UNO · CHLORINE GAS
//   enterFrom { cam: z≈-120, luz: cold→red, materia: lejía(izq) + peróxido(der) separados 330px }
//   f214      → MATCH-SHAPE interno: el envase derecho SE REMODELA peróxido→vinagre en el mismo sitio
//   exitTo    { cam: el plano se lanza contra el lente (sc 1→6.2 con origen en el HUECO), luz: rojo duro,
//               materia: la nube de cloro llena el cuadro y se convierte en el aire húmedo del baño }
//   COSTURA 505–558 → ZOOM-THROUGH (atravesamos el hueco entre los dos envases)
//
// ACTO 3 · f545–884 · EL PEOR CUARTO DE LA CASA
//   enterFrom { cam: sigue su curva, luz: rojo duro→rojo apagado, materia: la nube = vapor estancado,
//               los dos envases ya están sobre la repisa (s 0.5) }
//   exitTo    { cam: leve retroceso óptico, luz: rojo apagado, materia: la PUERTA que cerramos en f577
//               cruza el lente; detrás ya está montado el acto 4 }
//   COSTURA 876–892 → OCLUSIÓN (<Occluder/> = la hoja de la puerta, con su canto iluminado)
//
// ACTO 4 · f884–1400 · REGLA DOS · PERACETIC ACID
//   enterFrom { cam: z≈+80, luz: rojo apagado, materia: el slot izquierdo cambió de contenido
//               (se fue la lejía, quedó el peróxido) — mismo lugar, otra materia }
//   exitTo    { cam: se abre, luz: rojo→ámbar 30%, materia: el ENJUAGUE del riel se vuelve la lámina
//               de agua que barre el cuadro }
//   COSTURA 1392–1424 → WIPE POR MATERIA (<VaporWipe/> + lámina de agua con borde vivo)
//
// ACTO 5 · f1400–1788 · REGLA TRES · 3% ONLY
//   enterFrom { cam: z≈+130, luz: ámbar sobrio, materia: queda UN solo envase, el correcto }
//   f1520     → CORTE EN EL BEAT: reencuadre duro de un frame + relight local; entra el bidón del 35%
//   exitTo    { el bidón retrocede en Z y se apaga, el "3" que viaja desde f107 abandona su esquina
//               y ATERRIZA dentro del sello 3% ONLY }
//
// Ninguna frontera repite dispositivo y ninguna es un fundido.
// ⛔ Sin Math.random / Date. ⛔ Sin backdrop-filter. ⛔ Sin blur grande a pantalla completa.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import {
  MD, F_SANS, rgba, lerp, clamp01, rnd, cam, light,
  Atmos, glassStyle, Sheen, Occluder, VaporWipe,
  Kicker, Title, Em, TextBed,
} from "./Stage";

const W = 1920;
const H = 1080;
const FLOOR = 812;

type Ease = (t: number) => number;

const E = {
  soft: Easing.bezier(0.22, 0.61, 0.28, 1) as Ease,
  out: Easing.out(Easing.cubic) as Ease,
  inc: Easing.in(Easing.cubic) as Ease,
  inOut: Easing.inOut(Easing.cubic) as Ease,
  snap: Easing.bezier(0.86, 0.02, 0.12, 1) as Ease,
  glide: Easing.out(Easing.poly(5)) as Ease,
  back: Easing.out(Easing.back(1.4)) as Ease,
  lin: Easing.linear as Ease,
};

// keyframes con easing PROPIO por tramo (el easing nunca es constante en toda la pieza)
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
// mezcla de colores que SIEMPRE devuelve hex (para que rgba() de Stage siga funcionando)
const mixH = (a: string, b: string, k: number) => {
  const A = parts(a);
  const B = parts(b);
  const t = clamp01(k);
  return "#" + hex2(lerp(A[0], B[0], t)) + hex2(lerp(A[1], B[1], t)) + hex2(lerp(A[2], B[2], t));
};

// ── EL ENVASE (la materia que cruza toda la pieza) ──────────────────────────────────────────
type VP = {
  w: number; h: number; nw: number; nh: number; rt: number; rb: number; capH: number;
  body: string; hi: string; dark: string; liq: string; fill: number; cap: string; alpha: number;
  label: string; sub: string; labelBg: string; labelInk: string; labelA: number;
};

const V_BLEACH: VP = {
  w: 208, h: 322, nw: 76, nh: 50, rt: 46, rb: 16, capH: 34,
  body: "#DCD7CE", hi: "#FFFFFF", dark: "#6E6C67", liq: "#F2F0EB", fill: 0.8, cap: "#E4322A", alpha: 0.98,
  label: "BLEACH", sub: "SODIUM HYPOCHLORITE", labelBg: "#141518", labelInk: "#FFFFFF", labelA: 0.92,
};
const V_PEROX: VP = {
  w: 152, h: 296, nw: 56, nh: 54, rt: 26, rb: 12, capH: 30,
  body: "#5A3A1C", hi: "#B27C40", dark: "#20140A", liq: "#8A5A24", fill: 0.74, cap: "#EDE9E2", alpha: 0.94,
  label: "3%", sub: "HYDROGEN PEROXIDE", labelBg: "#EDE9E2", labelInk: "#141518", labelA: 0.94,
};
const V_VINEGAR: VP = {
  w: 160, h: 316, nw: 50, nh: 76, rt: 18, rb: 10, capH: 26,
  body: "#A9B2AA", hi: "#E8EFE7", dark: "#1B1F1C", liq: "#D6CFA6", fill: 0.66, cap: "#EDE9E2", alpha: 0.6,
  label: "VINEGAR", sub: "ACETIC ACID 5%", labelBg: "#EDE9E2", labelInk: "#141518", labelA: 0.9,
};
const V_EMPTY: VP = {
  w: 156, h: 300, nw: 54, nh: 62, rt: 22, rb: 12, capH: 28,
  body: "#8E979C", hi: "#DDE6EA", dark: "#161A1D", liq: "#B9C2BE", fill: 0.0, cap: "#9AA2A6", alpha: 0.5,
  label: "ONE BOTTLE", sub: "", labelBg: "#0E0F12", labelInk: "#FFFFFF", labelA: 0.7,
};
const V_DRUM: VP = {
  w: 306, h: 426, nw: 92, nh: 46, rt: 30, rb: 14, capH: 40,
  body: "#23272D", hi: "#5E6772", dark: "#090B0D", liq: "#D9E2E8", fill: 0.86, cap: "#E4322A", alpha: 0.97,
  label: "35%", sub: "FOOD GRADE", labelBg: "#E4322A", labelInk: "#FFFFFF", labelA: 0.95,
};

const mixVP = (a: VP, b: VP, k: number): VP => ({
  w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), nw: lerp(a.nw, b.nw, k), nh: lerp(a.nh, b.nh, k),
  rt: lerp(a.rt, b.rt, k), rb: lerp(a.rb, b.rb, k), capH: lerp(a.capH, b.capH, k),
  body: mixH(a.body, b.body, k), hi: mixH(a.hi, b.hi, k), dark: mixH(a.dark, b.dark, k),
  liq: mixH(a.liq, b.liq, k), fill: lerp(a.fill, b.fill, k), cap: mixH(a.cap, b.cap, k),
  alpha: lerp(a.alpha, b.alpha, k),
  label: k < 0.5 ? a.label : b.label, sub: k < 0.5 ? a.sub : b.sub,
  labelBg: mixH(a.labelBg, b.labelBg, k), labelInk: mixH(a.labelInk, b.labelInk, k),
  labelA: lerp(a.labelA, b.labelA, k),
});

const LabelFace: React.FC<{ v: VP; burn: number }> = ({ v, burn }) => (
  <div
    style={{
      position: "absolute", inset: 0, borderRadius: 5, overflow: "hidden",
      background: rgba(v.labelBg, v.labelA),
      boxShadow: `inset 0 0 12px rgba(0,0,0,0.45), 0 1px 0 ${rgba(MD.white, 0.1)}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      clipPath: `inset(0% ${(burn * 100).toFixed(1)}% 0% 0%)`,
    }}
  >
    <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 30, letterSpacing: 1.2, color: v.labelInk, lineHeight: 1 }}>
      {v.label}
    </div>
    {v.sub ? (
      <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 11, letterSpacing: 1.6, marginTop: 5, color: rgba(v.labelInk, 0.6) }}>
        {v.sub}
      </div>
    ) : null}
  </div>
);

const Vessel: React.FC<{
  frame: number; p: VP; p2?: VP; t?: number; x: number; base?: number; s?: number;
  tilt?: number; dim?: number; corrode?: number; rim?: string; zi?: number;
}> = ({ frame, p, p2, t = 0, x, base = FLOOR, s = 1, tilt = 0, dim = 1, corrode = 0, rim = MD.cold, zi = 0 }) => {
  const v = p2 ? mixVP(p, p2, clamp01(t)) : p;
  const total = v.h + v.nh + v.capH * 0.7;
  const breath = 1 + Math.sin(frame / 53 + x * 0.007) * 0.004;
  const cyl = `linear-gradient(96deg, ${v.dark} 0%, ${v.body} 24%, ${v.hi} 43%, ${v.body} 63%, ${v.dark} 100%)`;
  const swapping = !!p2 && t > 0.03 && t < 0.97;
  const flip = clamp01(t);
  const pit = corrode;
  return (
    <div
      style={{
        position: "absolute", left: x, top: base, width: v.w, height: total,
        transform: `translate(-50%,-100%) translateZ(${zi}px) scale(${(s * breath).toFixed(4)}) rotate(${tilt}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      {/* sombra de contacto que ATERRIZA */}
      <div
        style={{
          position: "absolute", left: "50%", bottom: -12, width: v.w * 1.9, height: 42,
          transform: "translateX(-50%)", borderRadius: "50%",
          background: `radial-gradient(closest-side, rgba(0,0,0,${0.78 * dim}) 0%, rgba(0,0,0,${0.34 * dim}) 52%, rgba(0,0,0,0) 78%)`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, opacity: dim }}>
        {/* cuello */}
        <div
          style={{
            position: "absolute", left: (v.w - v.nw) / 2, bottom: v.h - 6, width: v.nw, height: v.nh + 6,
            background: cyl, opacity: v.alpha, borderRadius: "7px 7px 0 0",
          }}
        />
        {/* tapa */}
        <div
          style={{
            position: "absolute", left: (v.w - v.nw * 1.26) / 2, bottom: v.h + v.nh - 4,
            width: v.nw * 1.26, height: v.capH, borderRadius: 5,
            background: `linear-gradient(96deg, rgba(0,0,0,0.55) 0%, ${v.cap} 30%, ${rgba(MD.white, 0.55)} 46%, ${v.cap} 66%, rgba(0,0,0,0.5) 100%)`,
            boxShadow: `inset 0 -3px 6px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            style={{
              position: "absolute", inset: 0, borderRadius: 5, opacity: 0.35,
              background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 2px, rgba(255,255,255,0.06) 2px 6px)",
            }}
          />
        </div>
        {/* cuerpo */}
        <div
          style={{
            position: "absolute", left: 0, bottom: 0, width: v.w, height: v.h, overflow: "hidden",
            borderRadius: `${v.rt}px ${v.rt}px ${v.rb}px ${v.rb}px`,
            background: cyl, opacity: v.alpha,
            boxShadow: `inset 0 -18px 26px rgba(0,0,0,0.45), inset 0 8px 18px ${rgba(MD.white, 0.1)}, 0 22px 44px rgba(0,0,0,0.55)`,
          }}
        >
          {/* líquido */}
          {v.fill > 0.02 && (
            <div
              style={{
                position: "absolute", left: 0, right: 0, bottom: 0, height: v.h * v.fill,
                background: `linear-gradient(92deg, rgba(0,0,0,0.42) 0%, ${v.liq} 34%, ${mixH(v.liq, "#FFFFFF", 0.25)} 52%, ${v.liq} 70%, rgba(0,0,0,0.4) 100%)`,
              }}
            >
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 5, background: `linear-gradient(180deg, ${rgba(MD.white, 0.4)}, rgba(255,255,255,0))` }} />
              {/* la línea del líquido enciende en rojo cuando el envase se corroe */}
              {pit > 0.01 && (
                <div
                  style={{
                    position: "absolute", left: -4, right: -4, top: -6, height: 16,
                    background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(MD.redHot, 0.75 * pit * (0.6 + 0.4 * Math.sin(frame / 7)))} 55%, rgba(255,255,255,0) 100%)`,
                  }}
                />
              )}
            </div>
          )}
          {/* specular */}
          <div
            style={{
              position: "absolute", left: v.w * 0.15, top: 10, width: v.w * 0.1, bottom: 14, borderRadius: 999,
              background: `linear-gradient(180deg, ${rgba(MD.white, 0.55)} 0%, ${rgba(MD.white, 0.12)} 45%, rgba(255,255,255,0) 100%)`,
            }}
          />
          {/* rim light del lado de la fuente */}
          <div
            style={{
              position: "absolute", right: 2, top: 12, width: 3, bottom: 16, borderRadius: 999,
              background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(rim, 0.55)} 40%, rgba(255,255,255,0) 100%)`,
            }}
          />
          {/* vidrio escarchado + picaduras (corrosión) */}
          {pit > 0.01 && (
            <>
              <div
                style={{
                  position: "absolute", inset: 0, opacity: 0.5 * pit, mixBlendMode: "screen",
                  background: "repeating-linear-gradient(118deg, rgba(255,255,255,0.11) 0 2px, rgba(255,255,255,0) 2px 6px)",
                }}
              />
              {Array.from({ length: 16 }, (_, i) => {
                const a = rnd(i * 2.3);
                const b = rnd(i * 5.9);
                if (a > pit * 1.25) return null;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute", left: `${8 + b * 82}%`, top: `${12 + a * 70}%`,
                      width: 3 + a * 6, height: 3 + a * 6, borderRadius: "50%",
                      background: `radial-gradient(circle, rgba(0,0,0,0.8) 0%, ${rgba(MD.red, 0.35)} 70%, rgba(0,0,0,0) 100%)`,
                    }}
                  />
                );
              })}
            </>
          )}
        </div>
        {/* etiqueta (en el morph GIRA sobre el eje del envase — no hay fundido) */}
        <div
          style={{
            position: "absolute", left: v.w * 0.09, bottom: v.h * 0.2, width: v.w * 0.82, height: v.h * 0.34,
            perspective: "520px",
          }}
        >
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            {swapping ? (
              <>
                <div style={{ position: "absolute", inset: 0, transform: `rotateY(${(-96 * flip).toFixed(2)}deg)`, backfaceVisibility: "hidden" }}>
                  <LabelFace v={p} burn={0} />
                </div>
                <div style={{ position: "absolute", inset: 0, transform: `rotateY(${(96 - 96 * flip).toFixed(2)}deg)`, backfaceVisibility: "hidden" }}>
                  <LabelFace v={p2 as VP} burn={0} />
                </div>
              </>
            ) : (
              <LabelFace v={v} burn={clamp01(pit * 1.35)} />
            )}
            {/* canto quemado de la etiqueta */}
            {pit > 0.02 && !swapping && (
              <div
                style={{
                  position: "absolute", top: 0, bottom: 0, width: 14,
                  left: `${Math.max(0, 100 - clamp01(pit * 1.35) * 100 - 1)}%`,
                  background: `linear-gradient(90deg, rgba(0,0,0,0.9) 0%, ${rgba(MD.red, 0.55)} 60%, rgba(0,0,0,0) 100%)`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── TIPOGRAFÍA DEL BLOQUE ───────────────────────────────────────────────────────────────────
// Entra por REVELADO (barrido de clip + palabras que suben). Sale por clip + desplazamiento.
// Nunca por opacity 0→1 global.
const Caption: React.FC<{
  frame: number; at: number; out?: number; kicker?: string; title: string;
  detail?: string; x: number; y: number; w?: number; size?: number; accent?: string;
}> = ({ frame, at, out, kicker, title, detail, x, y, w = 840, size = 74, accent = MD.red }) => {
  const p = clamp01((frame - at) / 14);
  if (p <= 0) return null;
  const o = out === undefined ? 0 : clamp01((frame - out) / 16);
  if (o >= 1) return null;
  const seg = title.split("*");
  let wi = 0;
  const float = Math.sin((frame - at) / 46) * 2.4;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w,
        transform: `translate(${(-o * 90).toFixed(1)}px, ${(float - o * 26).toFixed(1)}px)`,
        clipPath: `inset(0% ${((1 - E.glide(p)) * 100).toFixed(1)}% ${(o * 100).toFixed(1)}% 0%)`,
      }}
    >
      <TextBed pad={26} w="100%">
        {kicker ? (
          <div style={{ marginBottom: 12, transform: `translateY(${((1 - p) * 14).toFixed(1)}px)` }}>
            <Kicker color={accent}>{kicker}</Kicker>
          </div>
        ) : null}
        <Title size={size}>
          {seg.map((s, si) => {
            const words = s.split(" ").filter((k) => k.length > 0);
            return (
              <React.Fragment key={si}>
                {words.map((word, k) => {
                  const d = at + 4 + wi * 3;
                  wi += 1;
                  const q = clamp01((frame - d) / 12);
                  return (
                    <span
                      key={si + "-" + k}
                      style={{
                        display: "inline-block", marginRight: 16,
                        transform: `translateY(${((1 - E.out(q)) * 30).toFixed(1)}px)`,
                      }}
                    >
                      {si % 2 === 1 ? <Em>{word}</Em> : word}
                    </span>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Title>
        {detail ? (
          <div
            style={{
              marginTop: 16, fontFamily: F_SANS, fontWeight: 700, fontSize: 34, letterSpacing: 1.2,
              color: MD.bone, textShadow: "0 3px 14px rgba(0,0,0,0.85)",
              clipPath: `inset(0% ${((1 - clamp01((frame - at - 12) / 14)) * 100).toFixed(1)}% 0% 0%)`,
            }}
          >
            {detail}
          </div>
        ) : null}
      </TextBed>
    </div>
  );
};

// Chip de vidrio: dato corto anclado a un objeto. Entra por barrido, sale por barrido.
const Chip: React.FC<{
  frame: number; at: number; out?: number; text: string; x: number; y: number;
  accent?: string; strike?: number; big?: boolean;
}> = ({ frame, at, out, text, x, y, accent = MD.bone, strike = 0, big }) => {
  const p = clamp01((frame - at) / 12);
  if (p <= 0) return null;
  const o = out === undefined ? 0 : clamp01((frame - out) / 14);
  if (o >= 1) return null;
  const fs = big ? 34 : 30;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y,
        transform: `translate(-50%,-50%) translateX(${((1 - E.out(p)) * -28 + o * 34).toFixed(1)}px)`,
        clipPath: `inset(0% ${((1 - E.out(p)) * 100).toFixed(1)}% 0% ${(o * 100).toFixed(1)}%)`,
      }}
    >
      <div
        style={{
          ...glassStyle({ radius: 10, lit: 1 }),
          position: "relative", overflow: "hidden",
          padding: "12px 20px",
          background: "linear-gradient(180deg, rgba(8,8,10,0.9), rgba(8,8,10,0.72))",
          borderLeft: `3px solid ${accent}`,
        }}
      >
        <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: fs, letterSpacing: 1.6, color: MD.white, whiteSpace: "nowrap" }}>
          {text}
        </div>
        {strike > 0 && (
          <div
            style={{
              position: "absolute", left: 12, top: "50%", height: 4, width: `${(strike * 88).toFixed(1)}%`,
              background: MD.red, boxShadow: `0 0 14px ${MD.red}`, transform: "translateY(-2px) rotate(-2deg)",
            }}
          />
        )}
        <Sheen at={at + 16} dur={22} />
      </div>
    </div>
  );
};

// Vapor / gas / aire: la MISMA materia con distinta densidad en cada acto.
const Plume: React.FC<{
  frame: number; at: number; x: number; y: number; spread: number; rise: number;
  n: number; color: string; op: number; speed: number; sag?: number;
}> = ({ frame, at, x, y, spread, rise, n, color, op, speed, sag = 0 }) => {
  if (frame < at || op <= 0.002) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const s1 = rnd(i * 3.11);
        const s2 = rnd(i * 7.77 + 1.3);
        const s3 = rnd(i * 1.91 + 4.1);
        const cyc = (((frame - at) * speed * (0.55 + s1 * 0.75)) / 100 + s2) % 1;
        const ph = cyc < 0 ? cyc + 1 : cyc;
        const py = y - ph * rise + sag * ph * ph * rise * 0.8;
        const px = x + (s3 - 0.5) * spread * (0.35 + ph * 1.1) + Math.sin(frame / (34 + s1 * 26) + i) * 16 * ph;
        const sz = 40 + s1 * 120 + ph * 190;
        const a = Math.sin(ph * Math.PI) * op * (0.45 + s2 * 0.75);
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: px, top: py, width: sz, height: sz * (0.8 + s2 * 0.5),
              transform: "translate(-50%,-50%)", borderRadius: "50%",
              background: `radial-gradient(circle at 42% 40%, ${rgba(color, a)} 0%, ${rgba(color, a * 0.35)} 46%, rgba(0,0,0,0) 72%)`,
            }}
          />
        );
      })}
    </div>
  );
};

// Riel de secuencia: estaciones con HUECO real entre ellas (el hueco ES la idea).
const Rail: React.FC<{
  frame: number; at: number; x: number; y: number; w: number;
  stations: string[]; head: number; accent?: string; gapNote?: string;
}> = ({ frame, at, x, y, w, stations, head, accent = MD.bone, gapNote }) => {
  const p = clamp01((frame - at) / 20);
  if (p <= 0) return null;
  const n = stations.length;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: rgba(MD.white, 0.14), overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: `${(E.glide(p) * 100).toFixed(1)}%`,
            background: `linear-gradient(90deg, ${rgba(accent, 0.5)}, ${rgba(accent, 0.9)})`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute", left: `${(clamp01(head) * 100).toFixed(2)}%`, top: -9,
          width: 22, height: 22, marginLeft: -11, borderRadius: "50%",
          background: `radial-gradient(circle at 36% 32%, ${MD.white}, ${accent})`,
          boxShadow: `0 0 22px ${rgba(accent, 0.8)}, 0 3px 8px rgba(0,0,0,0.6)`,
          opacity: p,
        }}
      />
      {stations.map((s, i) => {
        const sx = (i / (n - 1)) * 100;
        const live = clamp01(1 - Math.abs(head - i / (n - 1)) * (n - 1) * 1.6);
        return (
          <div key={i} style={{ position: "absolute", left: `${sx}%`, top: -22, transform: "translateX(-50%)", textAlign: "center" }}>
            <div
              style={{
                width: 16, height: 16, margin: "0 auto", borderRadius: "50%",
                border: `3px solid ${live > 0.4 ? accent : rgba(MD.white, 0.35)}`,
                background: live > 0.4 ? rgba(accent, 0.35) : "rgba(0,0,0,0.4)",
                boxShadow: live > 0.4 ? `0 0 18px ${rgba(accent, 0.7)}` : "none",
                transform: `scale(${(1 + live * 0.35).toFixed(3)})`,
              }}
            />
            <div
              style={{
                marginTop: 14, fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 1.4,
                color: live > 0.4 ? MD.white : rgba(MD.bone, 0.5), whiteSpace: "nowrap",
                textShadow: "0 3px 12px rgba(0,0,0,0.9)",
              }}
            >
              {s}
            </div>
          </div>
        );
      })}
      {gapNote && n === 3 && (
        <div style={{ position: "absolute", left: "50%", top: 40, transform: "translateX(-50%)", textAlign: "center", opacity: clamp01((frame - at - 22) / 16) }}>
          <div style={{ width: 230, height: 12, borderLeft: `2px solid ${rgba(MD.bone, 0.5)}`, borderRight: `2px solid ${rgba(MD.bone, 0.5)}`, borderBottom: `2px solid ${rgba(MD.bone, 0.5)}` }} />
          <div style={{ marginTop: 8, fontFamily: F_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: MD.bone, whiteSpace: "nowrap" }}>{gapNote}</div>
        </div>
      )}
    </div>
  );
};

// Plano de azulejos (paredes/piso del baño). Se usa 5 veces con distinta luz.
const TilePlane: React.FC<{
  w: number; h: number; lit: number; tint: string; grid?: number; style?: React.CSSProperties;
}> = ({ w, h, lit, tint, grid = 104, style }) => (
  <div
    style={{
      position: "absolute", width: w, height: h,
      background: [
        `linear-gradient(170deg, ${rgba(tint, 0.16 * lit)} 0%, rgba(0,0,0,0) 46%)`,
        `repeating-linear-gradient(90deg, rgba(6,6,8,0.9) 0 3px, rgba(0,0,0,0) 3px ${grid}px)`,
        `repeating-linear-gradient(0deg, rgba(6,6,8,0.9) 0 3px, rgba(0,0,0,0) 3px ${grid}px)`,
        `linear-gradient(160deg, ${mixH(MD.ink2, tint, 0.18 * lit)} 0%, ${MD.ink1} 52%, ${MD.ink0} 100%)`,
      ].join(", "),
      boxShadow: `inset 0 0 140px rgba(0,0,0,0.75)`,
      ...style,
    }}
  />
);

// ── EL NÚMERO QUE VIAJA ─────────────────────────────────────────────────────────────────────
// Nace en f107 revelado por un barrido de luz, gira como un odómetro en cada regla (1→2→3) y
// en el cierre ABANDONA su esquina para aterrizar dentro del sello "3% ONLY".
// No es una tarjeta nueva por regla: es SIEMPRE el mismo elemento.
const Numeral: React.FC<{
  frame: number; from: string; to: string; t: number; cx: number; cy: number;
  size: number; birth: number; ghost?: boolean;
}> = ({ frame, from, to, t, cx, cy, size, birth, ghost }) => {
  if (birth <= 0.001) return null;
  const k = clamp01(t);
  const showTo = k >= 0.5;
  const rot = showTo ? lerp(96, 0, E.out(clamp01((k - 0.5) / 0.5))) : lerp(0, -96, E.inc(clamp01(k / 0.5)));
  const edge = Math.sin(clamp01(k) * Math.PI);
  const bob = Math.sin(frame / 58) * (ghost ? 5 : 2.2);
  return (
    <div
      style={{
        position: "absolute", left: cx, top: cy + bob, transform: "translate(-50%,-50%)",
        perspective: "900px",
      }}
    >
      <div
        style={{
          position: "relative",
          transform: `rotateX(${rot.toFixed(2)}deg)`,
          transformStyle: "preserve-3d",
          clipPath: `inset(${((1 - E.glide(birth)) * 100).toFixed(1)}% 0% 0% 0%)`,
        }}
      >
        <div
          style={{
            fontFamily: F_SANS, fontWeight: 900, fontSize: size, lineHeight: 0.86,
            letterSpacing: -size * 0.04,
            color: ghost ? rgba(MD.white, 0.032) : MD.white,
            textShadow: ghost ? "none" : `0 10px 40px rgba(0,0,0,0.9), 0 0 ${size * 0.16}px ${rgba(MD.cold, 0.28)}`,
          }}
        >
          {showTo ? to : from}
        </div>
        {/* canto metálico del giro */}
        {!ghost && edge > 0.02 && (
          <div
            style={{
              position: "absolute", left: -size * 0.06, right: -size * 0.06, top: "48%", height: 3,
              background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.9 * edge)} 50%, rgba(255,255,255,0) 100%)`,
              boxShadow: `0 0 ${18 * edge}px ${rgba(MD.white, 0.6 * edge)}`,
            }}
          />
        )}
      </div>
      {!ghost && (
        <div
          style={{
            position: "absolute", left: "50%", top: size * 0.52, width: size * 1.5, height: 2,
            transform: "translateX(-50%)",
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.bone, 0.5 * birth)} 40%, ${rgba(MD.bone, 0.18 * birth)} 100%)`,
          }}
        />
      )}
    </div>
  );
};

// ── ACTO 1 · f0–130 · "SAFETY" ──────────────────────────────────────────────────────────────
// El tono cambia: el cuarto se enfría y se queda quieto. UNA palabra, con aire.
// Sale por MATCH-MOVE: las letras se van por el mismo vector que trae al segundo envase.
const Act1: React.FC<{ f: number }> = ({ f }) => {
  // rampa de entrada ≤15f: la rendija ABRE (⛔ no es un fundido). Arranca ya entreabierta:
  // el frame 0 nunca es un frame muerto en negro.
  const open = kf(f, [0, 14], [0.86, 0], [E.glide]);
  const letters = "SAFETY".split("");
  const tight = kf(f, [22, 49, 70], [26, 15, 13], [E.out, E.soft]); // en "Straight." la palabra SE ASIENTA
  const keyline = kf(f, [49, 66], [0, 1], [E.snap]);
  return (
    // La pared del fondo NO se dibuja acá: es la del acto 2, que ya está montada desde el
    // frame 0. Este acto aporta el haz, el espejo y LA PALABRA, por delante de ese mismo cuarto.
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      {/* plano -520: el haz de la ventanita */}
      <div
        style={{
          position: "absolute", left: 120, top: -180, width: 560, height: 1200,
          transform: `translateZ(-520px) rotate(16deg) translateY(${kf(f, [0, 40, 128, 158], [-90, 0, 0, 940], [E.out, E.lin, E.inc])}px)`,
          background: `linear-gradient(180deg, ${rgba(MD.cold, 0.16)} 0%, ${rgba(MD.cold, 0.05)} 46%, rgba(0,0,0,0) 84%)`,
        }}
      />
      {/* plano -300: el espejo del botiquín, apenas insinuado */}
      <div
        style={{
          position: "absolute", left: 1424, top: 178, width: 420, height: 360,
          transform: `translateZ(-300px) translateX(${kf(f, [124, 158], [0, 760], [E.inc])}px)`,
          borderRadius: 8,
          background: `linear-gradient(150deg, ${rgba(MD.cold, 0.07)} 0%, rgba(0,0,0,0) 60%)`,
          boxShadow: `inset 0 0 0 2px ${rgba(MD.white, 0.06)}, inset 0 40px 90px rgba(0,0,0,0.7)`,
        }}
      />
      {/* plano 0: LA PALABRA */}
      <div style={{ position: "absolute", left: 150, top: 372 }}>
        <div style={{ display: "flex" }}>
          {letters.map((ch, i) => {
            const inp = clamp01((f - (22 + i * 4)) / 16);
            const dx = kf(f, [126 + i * 3, 154 + i * 3], [0, -1560], [E.inc]);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: F_SANS, fontWeight: 900, fontSize: 168, lineHeight: 1,
                  letterSpacing: tight, color: MD.white,
                  textShadow: "0 12px 50px rgba(0,0,0,0.95)",
                  transform: `translate(${dx.toFixed(1)}px, ${((1 - E.out(inp)) * 46).toFixed(1)}px)`,
                  clipPath: `inset(${((1 - E.out(inp)) * 100).toFixed(1)}% 0% 0% 0%)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        {/* la keyline que en f130 se estira y se vuelve la línea del piso del acto 2 */}
        <div
          style={{
            marginTop: 18, height: 4, width: kf(f, [49, 66, 126, 150], [0, 620, 640, 1760], [E.snap, E.lin, E.inc]),
            background: `linear-gradient(90deg, ${MD.red} 0%, ${rgba(MD.red, 0.15)} 100%)`,
            boxShadow: `0 0 22px ${rgba(MD.red, 0.55 * keyline)}`,
          }}
        />
        <div
          style={{
            marginTop: 26, fontFamily: F_SANS, fontWeight: 700, fontSize: 36, letterSpacing: 5,
            color: MD.bone, textShadow: "0 3px 16px rgba(0,0,0,0.9)",
            clipPath: `inset(0% ${((1 - clamp01((f - 67) / 18)) * 100).toFixed(1)}% 0% 0%)`,
            transform: `translateX(${kf(f, [126, 152], [0, -900], [E.inc]).toFixed(1)}px)`,
          }}
        >
          NO JOKES IN THIS PART.
        </div>
      </div>
      {/* plano +260: polvo en suspensión (hold vivo) */}
      <Plume frame={f} at={0} x={960} y={980} spread={1500} rise={900} n={9} color={MD.cold} op={0.05} speed={0.9} />
      {/* la rendija de apertura: dos hojas opacas que se retiran (cubre el avatar desde el frame 0) */}
      {open > 0.001 && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${(open * 50).toFixed(2)}%`, background: MD.ink0 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: rgba(MD.bone, 0.55 * open), boxShadow: `0 0 20px ${rgba(MD.cold, 0.5 * open)}` }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(open * 50).toFixed(2)}%`, background: MD.ink0 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: rgba(MD.bone, 0.55 * open), boxShadow: `0 0 20px ${rgba(MD.cold, 0.5 * open)}` }} />
          </div>
        </>
      )}
    </div>
  );
};

// ── ACTO 2 · f130–545 · REGLA UNO · CHLORINE GAS ────────────────────────────────────────────
// El envase semilla del acto 1 ATERRIZA en el slot derecho (match-move) y la lejía entra por
// el mismo vector. La tensión es la DISTANCIA: el hueco se cierra y se pone rojo.
// f214: MATCH-SHAPE — el envase derecho se remodela peróxido→vinagre SIN irse del sitio.
const Act2: React.FC<{ f: number }> = ({ f }) => {
  const gap = kf(f, [130, 214, 286, 400, 505], [332, 300, 206, 170, 142], [E.soft, E.out, E.inOut, E.inOut]);
  const seedT = clamp01((f - 88) / 62);
  const seedX = lerp(1186, 960 + gap, E.soft(seedT));
  const seedS = kf(f, [0, 70, 156], [0.3, 0.42, 1], [E.lin, E.soft]);
  const seedZ = kf(f, [0, 70, 156], [-690, -560, 0], [E.lin, E.soft]);
  const jugT = clamp01((f - 122) / 44);
  const jugX = lerp(-330, 960 - gap, E.soft(jugT));
  const morph = clamp01((f - 214) / 26);                    // peróxido → vinagre, en el mismo lugar
  const redK = kf(f, [200, 286, 360, 505], [0, 0.34, 0.62, 0.78], [E.out, E.inOut, E.soft]);
  const pulse = 0.72 + 0.28 * Math.sin(f / 9);
  const gasOp = kf(f, [286, 330, 470, 545], [0, 0.5, 0.62, 0.78], [E.out, E.soft, E.out]);
  const measure = kf(f, [150, 176, 272, 292], [0, 1, 1, 0], [E.out, E.lin, E.inc]);
  const wallPar = kf(f, [0, 130, 545], [-26, 6, 54], [E.soft, E.soft]);
  const shimmer = Math.sin(f / 5) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      {/* LA PARED DEL CUARTO — montada desde el frame 0: es el mismo espacio del acto 1 */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateZ(-900px) translateX(${wallPar}px) scale(1.9)`, transformOrigin: "50% 40%" }}>
        <TilePlane w={W} h={H} lit={0.56} tint={MD.cold} grid={118} />
      </div>
      {/* la repisa: la keyline del acto 1 ya estirada */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: FLOOR + 2, height: 3,
          transform: "translateZ(-120px)",
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(MD.bone, 0.28)} 22%, ${rgba(MD.bone, 0.34)} 74%, rgba(0,0,0,0) 100%)`,
          opacity: clamp01((f - 138) / 20),
        }}
      />
      {/* EL HUECO: la columna que se calienta entre los dos envases */}
      <div
        style={{
          position: "absolute", left: 960, top: 330, width: Math.max(60, gap * 1.65), height: 520,
          transform: `translate(-50%,0) translateZ(-40px)`, overflow: "hidden", borderRadius: 8,
          background: `radial-gradient(ellipse at 50% 62%, ${rgba(MD.red, 0.5 * redK * pulse)} 0%, ${rgba(MD.red, 0.2 * redK)} 42%, rgba(0,0,0,0) 74%)`,
        }}
      >
        <div
          style={{
            position: "absolute", inset: -20, opacity: 0.32 * redK,
            transform: `translateX(${shimmer.toFixed(2)}px)`,
            background: `repeating-linear-gradient(90deg, ${rgba(MD.redHot, 0.14)} 0 3px, rgba(0,0,0,0) 3px 14px)`,
          }}
        />
      </div>
      {/* LOS DOS ENVASES */}
      <Vessel frame={f} p={V_BLEACH} x={jugX} base={FLOOR} s={1} rim={MD.cold} />
      <Vessel frame={f} p={V_PEROX} p2={V_VINEGAR} t={morph} x={seedX} base={FLOOR} s={seedS} zi={seedZ} rim={MD.cold} />
      {/* la MEDIDA del hueco: lo que importa es la distancia */}
      {measure > 0.01 && (
        <div style={{ position: "absolute", left: 960, top: 556, width: gap * 2 - 210, transform: "translateX(-50%)", opacity: measure }}>
          <div style={{ position: "relative", height: 2, background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(MD.bone, 0.55)} 12%, ${rgba(MD.bone, 0.55)} 88%, rgba(0,0,0,0) 100%)` }}>
            <div style={{ position: "absolute", left: 0, top: -9, width: 2, height: 20, background: rgba(MD.bone, 0.6) }} />
            <div style={{ position: "absolute", right: 0, top: -9, width: 2, height: 20, background: rgba(MD.bone, 0.6) }} />
          </div>
        </div>
      )}
      {/* EL GAS: la materia que después se vuelve el aire del baño */}
      <Plume frame={f} at={286} x={960} y={FLOOR - 40} spread={Math.max(90, gap * 1.2)} rise={640} n={16} color={MD.moldLit} op={gasOp} speed={1.5} />
      <Plume frame={f} at={300} x={960} y={FLOOR - 60} spread={Math.max(70, gap)} rise={480} n={9} color={MD.redHot} op={gasOp * 0.4} speed={1.9} />
      {/* núcleo del gas: lo que nos traga en el zoom-through */}
      <div
        style={{
          position: "absolute", left: 960, top: 600, width: 460, height: 460, transform: "translate(-50%,-50%)",
          borderRadius: "50%", opacity: kf(f, [420, 505, 545], [0, 0.35, 0.95], [E.inc, E.out]),
          background: `radial-gradient(circle, ${rgba(MD.moldLit, 0.5)} 0%, ${rgba(MD.red, 0.22)} 46%, rgba(0,0,0,0) 76%)`,
        }}
      />
      {/* el gas SE COME EL LENTE: es la materia que entrega el acto (no un fundido a negro) */}
      {f >= 528 && (
        <AbsoluteFill
          style={{
            transform: `scale(${(1 + clamp01((f - 528) / 30) * 0.5).toFixed(3)})`,
            background: `radial-gradient(120% 112% at 50% 58%, ${rgba(MD.moldLit, 0.96 * clamp01((f - 530) / 26))} 0%, ${rgba(MD.moldLit, 0.86 * clamp01((f - 530) / 26))} 42%, ${rgba(MD.red, 0.6 * clamp01((f - 530) / 26))} 74%, ${rgba(MD.ink1, 0.82 * clamp01((f - 530) / 26))} 100%)`,
          }}
        />
      )}
      <Chip frame={f} at={138} out={272} text="NEVER MIX" x={960} y={300} accent={MD.red} />
      <Caption
        frame={f} at={292} kicker="RULE ONE" title="CHLORINE *GAS*"
        x={96} y={132} w={880} size={92} accent={MD.red}
      />
      <Chip frame={f} at={356} out={386} text="THAT IS REAL." x={430} y={946} accent={MD.bone} big />
      <Chip frame={f} at={390} text="HOSPITAL. EVERY YEAR." x={470} y={946} accent={MD.red} big />
    </div>
  );
};

// ── ACTO 3 · f545–884 · EL PEOR CUARTO DE LA CASA ───────────────────────────────────────────
// Salimos del gas y ya estamos DENTRO del baño. El cuarto se COMPRIME alrededor del espectador:
// las paredes entran, la puerta se cierra, el extractor se traba y el aire se estanca.
const Act3: React.FC<{ f: number }> = ({ f }) => {
  const wallX = kf(f, [545, 566, 700, 830, 884], [1180, 1040, 566, 524, 512], [E.out, E.inOut, E.soft, E.lin]) + Math.sin(f / 37) * 4;
  const doorRot = kf(f, [577, 604], [-74, 0], [E.snap]);
  const doorSeal = clamp01((f - 602) / 14);
  const fanRot = kf(f, [610, 622, 628, 640, 648, 700], [0, 26, 27, 38, 39, 41], [E.out, E.lin, E.out, E.lin, E.soft]);
  const fanJit = f > 648 ? Math.sin(f / 3.1) * 0.5 : 0;
  const air = kf(f, [545, 620, 700], [0.5, 0.26, 0.14], [E.out, E.soft]);   // el aire se estanca
  // secuencia lejía → enjuague → seco, sobre el mismo azulejo
  const sprayed = clamp01((f - 664) / 26);
  const rinse = clamp01((f - 706) / 40);
  const dry = clamp01((f - 752) / 46);
  const railHead = kf(f, [664, 700, 712, 748, 760, 800], [0, 0, 0.5, 0.5, 1, 1], [E.lin, E.inOut, E.lin, E.inOut]);
  const stepIn = clamp01((f - 800) / 30);
  const slab = clamp01((f - 834) / 30);
  const dim3 = 1 - slab * 0.45;
  const words = ["DON'T", "LAYER", "CHEMICALS"];
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1400px", transformStyle: "preserve-3d" }}>
      {/* pared del fondo */}
      <div style={{ position: "absolute", left: 960 - wallX, top: -60, transform: "translateZ(-880px)", transformStyle: "preserve-3d", opacity: dim3 }}>
        <TilePlane w={wallX * 2} h={1200} lit={0.42} tint={MD.cold} grid={96} />
      </div>
      {/* pared IZQUIERDA (aquí pasa la secuencia enjuague/seco) */}
      <div
        style={{
          position: "absolute", left: 960 - wallX - 880, top: -60, width: 880, height: 1200,
          transformOrigin: "right center", transform: "rotateY(-90deg)", transformStyle: "preserve-3d", opacity: dim3,
        }}
      >
        <TilePlane w={880} h={1200} lit={0.6} tint={MD.cold} grid={96} />
        {/* el paño de azulejo del ejemplo */}
        <div style={{ position: "absolute", left: 470, top: 330, width: 330, height: 330, overflow: "hidden", borderRadius: 4 }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(150deg, ${rgba(MD.bone, 0.14 * sprayed * (1 - rinse))} 0%, ${rgba(MD.white, 0.05 * sprayed * (1 - rinse))} 100%)` }} />
          {/* la lámina de agua que enjuaga, de arriba a abajo */}
          {rinse > 0 && rinse < 1 && (
            <div
              style={{
                position: "absolute", left: 0, right: 0, top: `${(rinse * 118 - 22).toFixed(1)}%`, height: "26%",
                background: `linear-gradient(180deg, ${rgba(MD.cold, 0.05)} 0%, ${rgba(MD.white, 0.3)} 46%, ${rgba(MD.cold, 0.08)} 100%)`,
              }}
            />
          )}
          {/* gotas que se secan de a una */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = rnd(i * 4.7);
            const b = rnd(i * 9.3);
            const gone = clamp01((dry - a * 0.8) * 4);
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: `${8 + b * 80}%`, top: `${10 + a * 76}%`,
                  width: (7 + a * 9) * (1 - gone), height: (7 + a * 9) * (1 - gone), borderRadius: "50%",
                  background: `radial-gradient(circle at 34% 30%, ${rgba(MD.white, 0.55)} 0%, ${rgba(MD.cold, 0.16)} 70%, rgba(0,0,0,0) 100%)`,
                  opacity: clamp01(rinse * 2) * (1 - gone),
                }}
              />
            );
          })}
          <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${rgba(MD.white, 0.08)}` }} />
        </div>
      </div>
      {/* pared DERECHA con la PUERTA que se cierra */}
      <div
        style={{
          position: "absolute", left: 960 + wallX, top: -60, width: 880, height: 1200,
          transformOrigin: "left center", transform: "rotateY(90deg)", transformStyle: "preserve-3d", opacity: dim3,
        }}
      >
        <TilePlane w={880} h={1200} lit={0.3} tint={MD.warm} grid={96} />
        <div
          style={{
            position: "absolute", left: 150, top: 150, width: 430, height: 940,
            transformOrigin: "left center", transform: `rotateY(${doorRot.toFixed(2)}deg)`,
            background: `linear-gradient(100deg, ${MD.ink2} 0%, ${MD.ink1} 44%, ${MD.ink0} 100%)`,
            boxShadow: `0 0 70px rgba(0,0,0,0.8), inset 0 0 0 3px ${rgba(MD.white, 0.05)}`,
          }}
        >
          <div style={{ position: "absolute", inset: 26, boxShadow: `inset 0 0 0 2px ${rgba(MD.white, 0.05)}` }} />
          <div style={{ position: "absolute", right: 26, top: "50%", width: 16, height: 60, borderRadius: 8, background: `linear-gradient(180deg, ${MD.bone}, ${MD.ink2})`, boxShadow: "0 3px 10px rgba(0,0,0,0.7)" }} />
          {/* el canto que atrapa la luz al cerrar */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: rgba(MD.cold, 0.35 + 0.4 * (1 - doorSeal)) }} />
        </div>
        {/* sello rojo: ya no entra ni sale aire */}
        <div style={{ position: "absolute", left: 146, top: 150, width: 5, height: 940, background: rgba(MD.red, 0.75 * doorSeal), boxShadow: `0 0 24px ${rgba(MD.red, 0.6 * doorSeal)}` }} />
      </div>
      {/* TECHO con el extractor que NO anda */}
      <div
        style={{
          position: "absolute", left: 960 - wallX, top: -520, width: wallX * 2, height: 620,
          transformOrigin: "50% 100%", transform: "rotateX(72deg)", transformStyle: "preserve-3d", opacity: dim3,
        }}
      >
        <TilePlane w={wallX * 2} h={620} lit={0.22} tint={MD.cold} grid={140} />
        <div
          style={{
            position: "absolute", left: "50%", top: 190, width: 300, height: 300, marginLeft: -150,
            borderRadius: 10, background: "radial-gradient(circle, #16181C 0%, #0A0B0D 74%)",
            boxShadow: `inset 0 0 0 4px ${rgba(MD.white, 0.07)}, inset 0 0 50px rgba(0,0,0,0.9)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${(fanRot + fanJit).toFixed(2)}deg)` }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute", left: "50%", top: "50%", width: 128, height: 34, marginTop: -17,
                  transformOrigin: "0% 50%", transform: `rotate(${i * 90}deg)`,
                  background: `linear-gradient(90deg, ${MD.ink2} 0%, ${rgba(MD.cold, 0.18)} 60%, ${MD.ink1} 100%)`,
                  borderRadius: "4px 18px 18px 4px",
                }}
              />
            ))}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 5px, rgba(0,0,0,0) 5px 26px)" }} />
        </div>
      </div>
      {/* piso */}
      <div
        style={{
          position: "absolute", left: 960 - wallX, top: FLOOR + 30, width: wallX * 2, height: 760,
          transformOrigin: "50% 0%", transform: "rotateX(74deg)", opacity: dim3,
        }}
      >
        <TilePlane w={wallX * 2} h={760} lit={0.16} tint={MD.warm} grid={132} />
      </div>
      {/* LOS MISMOS DOS ENVASES, ahora sobre la repisa */}
      <div style={{ opacity: dim3 }}>
        <Vessel frame={f} p={V_BLEACH} x={1156} base={FLOOR - 6} s={0.5} dim={0.72} rim={MD.warm} />
        <Vessel frame={f} p={V_VINEGAR} x={1330} base={FLOOR - 6} s={0.5} dim={0.7} rim={MD.warm} />
        {stepIn > 0.001 && (
          <Vessel frame={f} p={V_PEROX} x={lerp(1620, 1466, E.out(stepIn))} base={FLOOR + 26} s={lerp(0.46, 0.66, E.out(stepIn))} dim={0.5 + 0.5 * stepIn} rim={MD.warm} />
        )}
      </div>
      {/* el aire ESTANCADO (la misma materia del gas, ya sin fuerza: cae) */}
      <Plume frame={f} at={545} x={960} y={FLOOR - 120} spread={900} rise={520} n={13} color={MD.moldLit} op={air} speed={0.62} sag={0.85} />
      {/* la misma nube que nos tragó, ya adentro del cuarto, disipándose */}
      {f < 616 && (
        <AbsoluteFill
          style={{
            transform: `scale(${(1.5 - clamp01((f - 556) / 60) * 0.5).toFixed(3)})`,
            background: `radial-gradient(120% 112% at 50% 58%, ${rgba(MD.moldLit, 0.9 * (1 - clamp01((f - 556) / 58)))} 0%, ${rgba(MD.moldLit, 0.72 * (1 - clamp01((f - 552) / 54)))} 42%, ${rgba(MD.red, 0.4 * (1 - clamp01((f - 552) / 48)))} 74%, ${rgba(MD.ink1, 0.6 * (1 - clamp01((f - 552) / 44)))} 100%)`,
          }}
        />
      )}
      <Caption frame={f} at={548} out={652} kicker="WHY THE BATHROOM" title="THE WORST *ROOM*" x={96} y={126} w={720} size={84} accent={MD.red} />
      <Chip frame={f} at={552} out={648} text="SMALL" x={430} y={430} accent={MD.bone} />
      <Chip frame={f} at={580} out={648} text="DOOR SHUT" x={1476} y={496} accent={MD.red} />
      <Chip frame={f} at={614} out={648} text="FAN: NOT WORKING" x={1180} y={214} accent={MD.red} />
      {/* la SECUENCIA sobre el azulejo */}
      {f >= 660 && f < 884 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${kf(f, [838, 868], [0, 280], [E.inc]).toFixed(1)}px)` }}>
          <Rail frame={f} at={664} x={300} y={946} w={760} stations={["SPRAYED", "RINSE", "LET IT DRY"]} head={railHead} accent={MD.cold} />
        </div>
      )}
      {/* CIERRE DEL ACTO: tres losas apiladas que se SEPARAN */}
      {slab > 0.001 &&
        words.map((wd, i) => {
          const sep = kf(f, [838 + i * 5, 872 + i * 5], [0, 1], [E.back]);
          const y = 470 + i * 104 + (i - 1) * sep * 42;
          const inp = clamp01((f - (834 + i * 6)) / 18);
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: 820, top: y, width: 640, height: 92, marginLeft: -320,
                ...glassStyle({ radius: 8, lit: 1 }),
                background: `linear-gradient(120deg, rgba(14,15,18,0.94), rgba(8,8,10,0.86))`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transform: `translateX(${((1 - E.out(inp)) * (i % 2 === 0 ? -70 : 70)).toFixed(1)}px)`,
                clipPath: `inset(0% ${((1 - E.out(inp)) * 100).toFixed(1)}% 0% 0%)`,
                overflow: "hidden",
              }}
            >
              <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 58, letterSpacing: 4, color: MD.white }}>{wd}</div>
              {i > 0 && (
                <div style={{ position: "absolute", left: 0, right: 0, top: -3, height: 3, background: rgba(MD.red, 0.8 * sep), boxShadow: `0 0 18px ${rgba(MD.red, 0.6 * sep)}` }} />
              )}
              <Sheen at={846 + i * 6} dur={26} />
            </div>
          );
        })}
    </div>
  );
};

// ── ACTO 4 · f884–1400 · REGLA DOS · PERACETIC ACID ─────────────────────────────────────────
// El slot izquierdo cambió de contenido detrás de la puerta: se fue la lejía, quedó el peróxido.
// Un tercer frasco sube al centro (el "one bottle"), los dos vierten dentro, y ese frasco se
// CORROE despacio. La solución no es un cartel: es una SECUENCIA con hueco.
const Act4: React.FC<{ f: number }> = ({ f }) => {
  const lx = kf(f, [884, 940, 1060, 1290, 1340], [560, 622, 596, 640, 560], [E.out, E.soft, E.soft, E.inOut]);
  const rx = kf(f, [884, 940, 1060, 1290, 1340], [1360, 1298, 1324, 1280, 1360], [E.out, E.soft, E.soft, E.inOut]);
  const centerIn = clamp01((f - 966) / 34);
  const centerOut = clamp01((f - 1288) / 30);
  const centerY = lerp(1290, FLOOR, E.out(centerIn)) + E.inc(centerOut) * 520;
  const pour = clamp01((f - 992) / 44);
  const pourEnd = clamp01((f - 1046) / 20);
  const tiltL = kf(f, [992, 1016, 1046, 1062], [0, 22, 22, 0], [E.out, E.lin, E.out]);
  const tiltR = kf(f, [998, 1022, 1046, 1062], [0, -22, -22, 0], [E.out, E.lin, E.out]);
  const corr = kf(f, [1062, 1140, 1240, 1288], [0, 0.42, 0.8, 0.9], [E.out, E.soft, E.lin]);
  const fill = kf(f, [1000, 1050], [0, 0.52], [E.out]);
  const head = kf(f, [1300, 1318, 1338, 1354, 1374, 1392], [0, 0, 0.5, 0.5, 1, 1], [E.lin, E.inOut, E.lin, E.inOut, E.lin]);
  const centerVP: VP = {
    ...V_EMPTY,
    fill,
    liq: mixH("#C9D2CE", MD.redHot, corr * 0.45),
    label: "ONE BOTTLE",
  };
  const wallPar = kf(f, [884, 1400], [-40, 40], [E.soft]);
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateZ(-820px) translateX(${wallPar}px) scale(1.8)`, transformOrigin: "50% 42%" }}>
        <TilePlane w={W} h={H} lit={0.36} tint={MD.warm} grid={110} />
      </div>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: FLOOR + 2, height: 3, transform: "translateZ(-120px)",
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(MD.bone, 0.3)} 22%, ${rgba(MD.bone, 0.34)} 74%, rgba(0,0,0,0) 100%)`,
        }}
      />
      {/* el aire de siempre, ya casi calmo */}
      <Plume frame={f} at={884} x={960} y={FLOOR - 60} spread={1100} rise={520} n={9} color={MD.cold} op={0.07} speed={0.7} sag={0.4} />
      {/* el frasco del centro */}
      {centerIn > 0.001 && centerOut < 0.999 && (
        <Vessel frame={f} p={centerVP} x={960} base={centerY} s={1} corrode={corr} rim={corr > 0.2 ? MD.redHot : MD.cold} />
      )}
      <Vessel frame={f} p={V_PEROX} x={lx} base={FLOOR} s={1} tilt={tiltL} rim={MD.warm} />
      <Vessel frame={f} p={V_VINEGAR} x={rx} base={FLOOR} s={1} tilt={tiltR} rim={MD.warm} />
      {/* los dos chorros que caen en el MISMO frasco */}
      {pour > 0 && pourEnd < 1 && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <path
            d={`M ${lx + 60} ${FLOOR - 300} C ${lx + 190} ${FLOOR - 250}, ${880} ${FLOOR - 230}, ${934} ${centerY - 300}`}
            fill="none" stroke={rgba("#8A5A24", 0.85 * (1 - pourEnd))} strokeWidth={11} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - E.out(pour)}
          />
          <path
            d={`M ${rx - 60} ${FLOOR - 310} C ${rx - 190} ${FLOOR - 260}, ${1040} ${FLOOR - 235}, ${986} ${centerY - 300}`}
            fill="none" stroke={rgba("#D6CFA6", 0.8 * (1 - pourEnd))} strokeWidth={9} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - E.out(pour)}
          />
        </svg>
      )}
      {/* vapor punzante que sube del frasco corroído */}
      <Plume frame={f} at={1080} x={960} y={centerY - 360} spread={130} rise={430} n={9} color={MD.bone} op={corr * 0.3} speed={1.15} />
      <Chip frame={f} at={972} out={1300} text="ONE BOTTLE" x={960} y={286} accent={MD.red} strike={clamp01((f - 1062) / 26)} />
      <Caption frame={f} at={892} out={1070} kicker="RULE TWO" title="PEROXIDE *AND* VINEGAR" x={96} y={128} w={840} size={78} accent={MD.red} />
      <Caption
        frame={f} at={1076} out={1286} kicker="IN ONE CONTAINER" title="PERACETIC *ACID*"
        detail={f >= 1150 ? "CORROSIVE. LUNGS. SKIN." : undefined}
        x={96} y={128} w={860} size={90} accent={MD.red}
      />
      <Caption frame={f} at={1296} kicker="THE RIGHT WAY" title="ONE. RINSE. *THEN* THE OTHER." x={96} y={128} w={900} size={72} accent={MD.bone} />
      {f >= 1288 && (
        <Rail frame={f} at={1292} x={430} y={912} w={1060} stations={["PEROXIDE", "RINSE", "VINEGAR"]} head={head} accent={MD.bone} gapNote="LET IT DRY" />
      )}
    </div>
  );
};

// ── ACTO 5 · f1400–1788 · REGLA TRES · 3% ONLY ──────────────────────────────────────────────
// Queda UN envase, el correcto. En f1520 hay un CORTE EN EL BEAT: reencuadre duro + relight
// local, y entra el bidón del 35%. La diferencia no es "más fuerte": es otra cosa.
const Act5: React.FC<{ f: number; end: number }> = ({ f, end }) => {
  const cut = f >= 1520;                                   // ⛔ sin transición: es un CORTE
  const bx = cut ? kf(f, [1520, 1600, 1700], [498, 512, 486], [E.soft, E.soft]) : kf(f, [1400, 1519], [846, 872], [E.soft]);
  const bs = cut ? 0.94 : kf(f, [1400, 1519], [1.2, 1.28], [E.soft]);
  const drumIn = clamp01((f - 1520) / 16);
  const back = clamp01((f - 1692) / 62);                   // el bidón retrocede y se apaga
  const drumS = lerp(1.06, 0.7, E.inOut(back)) * lerp(0.86, 1, E.out(drumIn));
  const drumX = lerp(1268, 1352, E.inOut(back));
  const drop = clamp01((f - 1556) / 42);
  const landed = clamp01((f - 1596) / 34);
  const ember = clamp01((f - 1632) / 40) * (0.62 + 0.38 * Math.sin(f / 11));
  const stamp = clamp01((f - 1712) / 22);
  const keyX = cut ? 72 : 26;                              // el relight del corte
  const wallPar = kf(f, [1400, end], [40, 96], [E.soft]);
  return (
    <div style={{ position: "absolute", inset: 0, perspective: "1500px", transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateZ(-840px) translateX(${wallPar}px) scale(1.8)`, transformOrigin: "50% 42%" }}>
        <TilePlane w={W} h={H} lit={0.3} tint={MD.warm} grid={110} />
      </div>
      {/* llave de producto: ámbar sobrio, cambia de lado EN el corte */}
      <div
        style={{
          position: "absolute", inset: 0, transform: "translateZ(-380px)",
          background: `radial-gradient(70% 60% at ${keyX}% 24%, ${rgba(MD.warm, 0.2)} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: FLOOR + 2, height: 3, transform: "translateZ(-120px)",
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(MD.warm, 0.34)} 26%, ${rgba(MD.bone, 0.3)} 76%, rgba(0,0,0,0) 100%)`,
        }}
      />
      {/* EL BIDÓN DEL 35% (entra en el corte, se va al final) */}
      {drumIn > 0.001 && (
        <div style={{ opacity: lerp(1, 0.42, E.inOut(back)) }}>
          <Vessel frame={f} p={V_DRUM} x={drumX} base={FLOOR + 22} s={drumS} dim={lerp(1, 0.5, back)} rim={MD.warm} />
        </div>
      )}
      {/* la gota que cae del pico y la quemadura donde aterriza */}
      {drop > 0 && drop < 1 && (
        <div
          style={{
            position: "absolute", left: drumX - 128, top: lerp(FLOOR - 350, FLOOR + 6, E.inc(drop)),
            width: 16, height: 26, borderRadius: "50% 50% 46% 46%", transform: "translate(-50%,-50%)",
            background: `linear-gradient(180deg, ${rgba(MD.white, 0.85)}, ${rgba(MD.cold, 0.5)})`,
            boxShadow: `0 0 14px ${rgba(MD.white, 0.5)}`,
          }}
        />
      )}
      {landed > 0.001 && (
        <div style={{ position: "absolute", left: drumX - 128, top: FLOOR + 10, transform: "translate(-50%,-50%)" }}>
          <div
            style={{
              width: 40 + landed * 110, height: (40 + landed * 110) * 0.3, borderRadius: "50%",
              background: `radial-gradient(closest-side, rgba(0,0,0,0.92) 0%, ${rgba(MD.red, 0.5)} 62%, rgba(0,0,0,0) 100%)`,
              boxShadow: `0 0 ${26 * landed}px ${rgba(MD.red, 0.45 * landed)}`,
            }}
          />
          {ember > 0.01 && (
            <div
              style={{
                position: "absolute", left: "50%", top: "50%", width: 96, height: 30, transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                background: `radial-gradient(closest-side, ${rgba(MD.warm, 0.85 * ember)} 0%, ${rgba(MD.red, 0.35 * ember)} 60%, rgba(0,0,0,0) 100%)`,
              }}
            />
          )}
        </div>
      )}
      {/* EL ENVASE CORRECTO */}
      <Vessel frame={f} p={V_PEROX} x={bx} base={FLOOR + 6} s={bs} rim={MD.warm} />
      {/* brillo de producto sobre el vidrio marrón */}
      <div style={{ position: "absolute", left: bx - 150, top: FLOOR - 430, width: 300, height: 430, overflow: "hidden", pointerEvents: "none" }}>
        <Sheen at={1436} dur={30} />
        <Sheen at={1664} dur={30} />
      </div>
      <Plume frame={f} at={1400} x={960} y={FLOOR - 40} spread={1000} rise={480} n={8} color={MD.warm} op={0.06} speed={0.62} sag={0.3} />
      <Caption frame={f} at={1408} out={1516} kicker="RULE THREE" title="THE *BROWN* BOTTLE" x={96} y={130} w={820} size={84} accent={MD.bone} />
      <Chip frame={f} at={1530} out={1650} text="35% — FOOD GRADE" x={1268} y={260} accent={MD.red} big />
      <Chip frame={f} at={1578} out={1652} text="BURNS SKIN ON CONTACT" x={520} y={950} accent={MD.red} big />
      <Chip frame={f} at={1662} text="WRONG MATERIAL — IT CAN START A FIRE" x={640} y={950} accent={MD.warm} big />
      {/* EL SELLO: el "3" que viene viajando desde f107 aterriza acá */}
      {stamp > 0.001 && (
        <div
          style={{
            position: "absolute", left: 1188, top: 508,
            clipPath: `inset(0% ${((1 - E.glide(stamp)) * 100).toFixed(1)}% 0% 0%)`,
            transform: `translateX(${((1 - E.out(stamp)) * -34).toFixed(1)}px)`,
          }}
        >
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 122, lineHeight: 0.9, color: MD.white, textShadow: "0 10px 40px rgba(0,0,0,0.9)" }}>
            % ONLY
          </div>
          <div style={{ marginTop: 14, height: 5, width: 430, background: `linear-gradient(90deg, ${MD.warm}, ${rgba(MD.warm, 0.1)})`, boxShadow: `0 0 22px ${rgba(MD.warm, 0.5)}` }} />
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
export const MovSafety: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const f = useCurrentFrame();
  const END = Math.max(1600, durationInFrames);

  // ── LA LUZ: rojo de alerta duro → rojo apagado → ámbar sobrio del frasco marrón ───────────
  const tint =
    f < 560
      ? light(kf(f, [34, 150, 300], [0, 0.42, 1], [E.soft, E.out]), "cold", "red")
      : light(kf(f, [560, 900, 1290, 1470, 1620], [0, 0.1, 0.3, 0.7, 1], [E.soft, E.lin, E.out, E.soft]), "red", "warm");
  const inten = kf(
    f, [0, 120, 300, 545, 700, 1100, 1500, 1620, END],
    [0.5, 0.82, 1.3, 1.5, 0.95, 0.84, 1.02, 1.18, 1.12],
    [E.out, E.soft, E.inOut, E.out, E.soft, E.soft, E.out, E.soft],
  );
  const keyF = kf(f, [0, 545, 1100, 1520, END], [0.2, 0.32, 0.58, 0.7, 0.8], [E.soft, E.soft, E.soft, E.lin]);
  const alert = kf(f, [270, 300, 545, 900, 1240, 1300, 1520, END], [0, 1, 0.92, 0.42, 0.5, 0.2, 0.26, 0.14], [E.out, E.lin, E.soft, E.soft, E.out, E.soft, E.soft]);
  const beat = 0.62 + 0.38 * Math.sin(f / (f < 560 ? 8.5 : 15));

  // ── LA CÁMARA: UNA sola, función del frame GLOBAL. Nunca vuelve a cero. ───────────────────
  const c = cam(f, { z0: -220, z1: 150, panX: -46, panY: -14, ry: 6, rx: -1.6, dur: 1788 });
  const zx = kf(
    f, [0, 130, 300, 470, 545, 660, 884, 1060, 1290, 1400, 1520, 1620, END],
    [-40, -8, 26, 88, 132, 54, 76, 124, 66, 38, 46, 104, 128],
    [E.soft, E.out, E.inOut, E.inc, E.out, E.soft, E.out, E.inOut, E.out, E.soft, E.snap, E.soft],
  );
  const camS = 1 + zx / 2600;

  // ── ESCALAS DE ACTO (el zoom-through y la llegada del cuarto) ─────────────────────────────
  const sc2 = kf(f, [130, 470, 505, 558], [1, 1.05, 1.22, 6.4], [E.soft, E.inOut, E.inc]);
  const sc3 = kf(f, [500, 545, 600, 884], [0.42, 0.64, 1, 1.05], [E.out, E.out, E.soft]);

  // ── COSTURA 4: el barrido POR MATERIA (borde de agua real, no un fundido) ─────────────────
  const we = kf(f, [1392, 1424], [-240, 2200], [E.inOut]);
  const weC = Math.max(0, Math.min(W, we));
  const wiping = f >= 1392 && f <= 1424;

  // ── EL NÚMERO QUE VIAJA (1 → 2 → 3 → dentro del sello) ────────────────────────────────────
  const birth = kf(f, [107, 126], [0, 1], [E.glide]);
  const nFrom = f < 1400 ? "1" : "2";
  const nTo = f < 884 ? "1" : f < 1400 ? "2" : "3";
  const nT = f < 884 ? 0 : f < 1400 ? clamp01((f - 884) / 18) : clamp01((f - 1400) / 18);
  const nX = kf(f, [1700, 1752], [1746, 1104], [E.inOut]);
  const nY = kf(f, [1700, 1752], [934, 586], [E.soft]);
  const nS = kf(f, [1700, 1752], [132, 200], [E.out]);

  // ── COSTURA 3: la hoja de la puerta cruza el lente ────────────────────────────────────────
  const ocEdge = interpolate(f, [876, 892], [-34, 132], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* LA ATMÓSFERA: se monta UNA vez y no se remonta nunca */}
      <Atmos tint={tint} keyFrom={keyF} intensity={inten} floor />

      {/* EL MUNDO, bajo la única cámara */}
      <AbsoluteFill style={{ transform: `${c.transform} scale(${camS.toFixed(4)})` }}>
        {/* El ORDEN importa en cada frontera: el acto que SE VA queda por delante mientras dura
            la costura (pasamos a través de SU materia), salvo en la oclusión, donde lo que entra
            ya está montado detrás de la hoja de la puerta. */}
        {f < 158 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 4 }}>
            <Act1 f={f} />
          </div>
        )}
        {f < 558 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 3, transform: `scale(${sc2.toFixed(4)})`, transformOrigin: "960px 640px" }}>
            <Act2 f={f} />
          </div>
        )}
        {f >= 500 && f < 892 && (
          <div style={{ position: "absolute", inset: 0, zIndex: f < 560 ? 2 : 4, transform: `scale(${sc3.toFixed(4)})`, transformOrigin: "960px 600px" }}>
            <Act3 f={f} />
          </div>
        )}
        {f >= 884 && f < 1426 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 5, clipPath: wiping ? `inset(0px 0px 0px ${weC.toFixed(0)}px)` : undefined }}>
            <Act4 f={f} />
          </div>
        )}
        {f >= 1392 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 6, clipPath: wiping ? `inset(0px ${(W - weC).toFixed(0)}px 0px 0px)` : undefined }}>
            <Act5 f={f} end={END} />
          </div>
        )}
      </AbsoluteFill>

      {/* COSTURA 4 (materia): la lámina de agua del enjuague + el vapor de Stage */}
      {wiping && (
        <>
          <div
            style={{
              position: "absolute", top: -40, bottom: -40, left: weC - 150, width: 300,
              background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.cold, 0.2)} 34%, ${rgba(MD.white, 0.5)} 62%, ${rgba(MD.bone, 0.16)} 78%, rgba(255,255,255,0) 100%)`,
              transform: "skewX(-5deg)",
            }}
          />
          {Array.from({ length: 10 }, (_, i) => {
            const s = rnd(i * 6.3);
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: weC - 40 + s * 90, top: `${4 + s * 88}%`,
                  width: 5, height: 26 + s * 40, borderRadius: 4,
                  background: `linear-gradient(180deg, ${rgba(MD.white, 0.55)}, rgba(255,255,255,0))`,
                }}
              />
            );
          })}
        </>
      )}
      <VaporWipe at={1392} dur={32} />

      {/* COSTURA 3 (oclusión): la puerta, con su canto iluminado por delante */}
      {f >= 874 && f <= 894 && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", top: "-20%", bottom: "-20%", left: `${ocEdge.toFixed(2)}%`, width: 8,
              background: `linear-gradient(90deg, ${rgba(MD.cold, 0.9)}, rgba(255,255,255,0))`,
              boxShadow: `0 0 40px ${rgba(MD.cold, 0.5)}`, transform: "rotate(4deg)",
            }}
          />
        </div>
      )}
      <Occluder at={876} dur={16} color={MD.ink2} angle={4} />

      {/* ALERTA: el latido rojo del cloro, que se va apagando con el bloque */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(88% 74% at 50% 54%, rgba(0,0,0,0) 46%, ${rgba(MD.red, 0.3 * alert * beat)} 100%)`,
        }}
      />
      {/* aire en suspensión delante de todo (nada queda quieto) */}
      <Plume frame={f} at={0} x={960} y={1140} spread={1780} rise={1180} n={7} color={MD.bone} op={0.045} speed={0.5} />

      {/* EL NÚMERO — fantasma al fondo y sólido en su repisa */}
      <Numeral frame={f} from={nFrom} to={nTo} t={nT} cx={1460} cy={520} size={700} birth={birth} ghost />
      <Numeral frame={f} from={nFrom} to={nTo} t={nT} cx={nX} cy={nY} size={nS} birth={birth} />
    </AbsoluteFill>
  );
};
