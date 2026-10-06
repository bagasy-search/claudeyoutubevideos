// Piezas.tsx — las piezas SUELTAS del VSL (el tejido entre los 6 movimientos).
//
// Los 6 momentos grandes del video son MOVIMIENTOS continuos de 4-6 actos (`Mov1..Mov6`). Estas
// piezas cubren el resto, y tienen que vivir en EL MISMO ESCENARIO: si la mitad del video tiene
// profundidad y la otra mitad son tarjetas blancas planas, el salto se nota más que antes.
//
// ⛔ Todo lo visual sale de `./Escenario`: la paleta, la cámara continua, el velo con el hermano
// `_blur.jpg`, la tarjeta de materia, la sombra de contacto, el tilt 3D y la tipografía.
// ⛔ CERO `backdrop-filter` (×5 el render) y CERO `Math.random` (el farm rinde en 50 chunks).
import React from "react";
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, interpolate,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import {
  ACC, BAD, Chip, Contacto, FF, GOOD, Grade, INK, Kicker, MUTE, PAPER, SOFT, SOMBRA_TEXTO,
  Tarjeta, Titular, VSL, rnd, useCam, useEntra,
} from "./Escenario";
import { slabShadow, specular, tilt3d, useKeyLight } from "../VideoEdit/kit/premium/stagecraft";

export { INK } from "./Escenario";

// ── FONDO ─────────────────────────────────────────────────────────────────────────────────────
/** KEN-BURNS VARIADO — ⛔ REGLA DURA CROSS-NICHO (feedback del creador, sep-2026):
 *  *"todos los zooms en imágenes son IDÉNTICOS, algunos deben ser zoom out no todos zoom in hacia
 *  el centro, y al azar — no siempre zoom out luego in luego out perfecto sino al azar"*.
 *  Varían POR PLANO y del mismo seed: sentido (50/50, NO alternado), recorrido, origen y deriva.
 *  COBERTURA: con `objectFit:"cover"` y escala ≥1 el cuadro queda cubierto desde cualquier origen;
 *  lo que puede destapar un borde es la DERIVA → |d| ≤ min(o,100−o)·(escalaMIN−1). */
const useKenBurns = (seed: number, base: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r1 = rnd(seed * 1.7 + 11), r2 = rnd(seed * 3.1 + 37), r3 = rnd(seed * 5.3 + 71);
  const r4 = rnd(seed * 7.9 + 113), r5 = rnd(seed * 11.3 + 167);
  const acerca = r1 < 0.5;
  const amp = 0.045 + r2 * (ampMax - 0.045);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 30 + r3 * 40, oy = 30 + r4 * 40;
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(1.2, Math.max(0, techo));
  const ang = r5 * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** CLIP real a sangre. ⛔ `loop` NO es prop de `OffthreadVideo` (cae en `...props` y se ignora en
 *  silencio): el build nunca deja un plano más largo que la duración real del clip, así que no
 *  hace falta loop y no hay último cuadro congelado. */
export const Clip: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.02, 0.055);   // el clip ya se mueve solo: recorrido corto
  return (
    <AbsoluteFill style={{ backgroundColor: VSL.color.bg0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

/** FOTO a sangre con Ken-Burns. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.05, 0.11);
  return (
    <AbsoluteFill style={{ backgroundColor: VSL.color.bg0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

// ── EL VELO COMPARTIDO ────────────────────────────────────────────────────────────────────────
/** Todas las piezas apoyan sobre el mismo velo, y el desenfoque sale del hermano `_blur.jpg` del
 *  plano que tienen debajo (el build se lo pasa en `blurSrc`). ⛔ Nunca `backdrop-filter`.
 *  ⚠️ Calibrado: a 0,80 de alfa el b-roll DESAPARECE y cada gráfico queda sobre pantalla negra
 *  — el defecto que el creador vio como "horrenda". */
type Base = { blurSrc?: string; desde?: number };

const Escena: React.FC<Base & {
  children: React.ReactNode; fuerza?: number; lado?: "centro" | "derecha" | "izquierda";
}> = ({ blurSrc, desde = 0, children, fuerza = 1, lado = "centro" }) => {
  const e = useEntra(0);
  const cam = useCam(desde);
  return (
    <AbsoluteFill>
      <Grade p={e.s} blurSrc={blurSrc} fuerza={fuerza} lado={lado} />
      <AbsoluteFill style={{ transform: cam.css, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Centro: React.FC<{ children: React.ReactNode; pad?: number }> = ({ children, pad = 130 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: `0 ${pad}px` }}>{children}</AbsoluteFill>
);

const salida = (frame: number, durationInFrames: number) =>
  interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

// ═══ FRASE — remate cinético. Líneas que entran de a una; la última en chip de acento. ════════
export const Frase: React.FC<Base & { lineas: string[]; cada?: number }> = ({ lineas, cada = 9, blurSrc, desde }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <Escena blurSrc={blurSrc} desde={desde} fuerza={1.08}>
      <Centro>
        <div style={{ textAlign: "center", opacity: salida(frame, durationInFrames) }}>
          {lineas.map((l, i) => {
            const ultima = i === lineas.length - 1;
            return (
              <div key={i} style={{ marginTop: i ? 18 : 0 }}>
                {ultima
                  ? <Chip at={i * cada} size={98}>{l}</Chip>
                  : <Titular at={i * cada} size={80} z={30 + i * 14}>{l}</Titular>}
              </div>
            );
          })}
        </div>
      </Centro>
    </Escena>
  );
};

// ═══ CIFRA — un número grande que cuenta. Una sola idea por lámina. ═══════════════════════════
export const CifraGrande: React.FC<Base & { eyebrow: string; valor: number; sufijo?: string; apoyo?: string }> = ({
  eyebrow, valor, sufijo, apoyo, blurSrc, desde,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const e = useEntra(8);
  const k = interpolate(frame, [6, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <Escena blurSrc={blurSrc} desde={desde}>
      <Centro>
        <div style={{ textAlign: "center", opacity: salida(frame, durationInFrames) }}>
          <Kicker>{eyebrow}</Kicker>
          <div
            style={{
              marginTop: 16, fontFamily: FF, fontSize: 250, fontWeight: 800, lineHeight: 0.94,
              letterSpacing: "-0.045em", color: PAPER, fontVariantNumeric: "tabular-nums",
              textShadow: "0 4px 14px rgba(0,0,0,.6), 0 10px 50px rgba(0,0,0,.8)",
              transform: tilt3d({ amount: 0.24, seed: 3, frame, z: 70 }),
            }}
          >
            {Math.round(valor * k).toLocaleString("es-MX")}
            {sufijo && <span style={{ fontSize: 82, fontWeight: 700, marginLeft: 16, color: ACC }}>{sufijo}</span>}
          </div>
          {apoyo && (
            <div style={{
              fontFamily: FF, fontSize: 34, fontWeight: 500, color: "rgba(255,255,255,.86)",
              marginTop: 28, maxWidth: 1140, lineHeight: 1.4, textShadow: SOMBRA_TEXTO,
              opacity: e.a, transform: `translateY(${e.y.toFixed(1)}px)`,
            }}>{apoyo}</div>
          )}
        </div>
      </Centro>
    </Escena>
  );
};

// ═══ ESCALERA — cifras que entran de a una, en sincro con la voz, subiendo ════════════════════
export const Escalera: React.FC<Base & { eyebrow: string; items: { valor: string; nota: string }[]; en: number[] }> = ({
  eyebrow, items, en, blurSrc, desde,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const luz = useKeyLight("center");
  return (
    <Escena blurSrc={blurSrc} desde={desde}>
      <Centro pad={110}>
        <div style={{ width: "100%", textAlign: "center", opacity: salida(frame, durationInFrames) }}>
          <Kicker>{eyebrow}</Kicker>
          <div style={{ display: "flex", gap: 38, justifyContent: "center", alignItems: "flex-end", marginTop: 30 }}>
            {items.map((it, i) => {
              const d = en[i] ?? i * 12;
              const q = interpolate(frame, [d, d + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              const alto = 250 + i * 58;
              const ultimo = i === items.length - 1;
              return (
                <div key={i} style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 470, height: alto, background: ultimo ? ACC : PAPER, borderRadius: VSL.radius + 2,
                      boxShadow: slabShadow(luz, { lift: 1.2 + i * 0.2, edge: ultimo ? "rgba(120,74,18,0.6)" : "rgba(20,18,15,0.5)", tint: "rgba(0,0,0,0.5)" }),
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
                      opacity: q,
                      transform: `${tilt3d({ amount: 0.3, seed: i * 5 + 2, frame, z: i * 26 })} translateY(${((1 - q) * 40).toFixed(1)}px) scale(${(0.93 + 0.07 * q).toFixed(3)})`,
                      backgroundImage: ultimo ? undefined : `${specular(luz, 0.34)}, linear-gradient(${PAPER}, ${PAPER})`,
                    }}
                  >
                    <div style={{ fontFamily: FF, fontSize: 112, fontWeight: 800, letterSpacing: "-0.04em", color: INK, fontVariantNumeric: "tabular-nums" }}>
                      {it.valor}
                    </div>
                    <div style={{ fontFamily: FF, fontSize: 29, fontWeight: 600, color: ultimo ? "rgba(20,18,15,.74)" : MUTE }}>{it.nota}</div>
                  </div>
                  <Contacto w={470} y={alto + 6} op={0.5 * q} />
                </div>
              );
            })}
          </div>
        </div>
      </Centro>
    </Escena>
  );
};

// ═══ DUELO — dos lados con foto REAL, cada uno como objeto sólido en su plano ═════════════════
export const Duelo: React.FC<Base & {
  eyebrow: string; titulo: string;
  izq: { rotulo: string; sub: string; img: string };
  der: { rotulo: string; sub: string; img: string };
}> = ({ eyebrow, titulo, izq, der, blurSrc, desde }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <Escena blurSrc={blurSrc} desde={desde}>
      <Centro pad={110}>
        <div style={{ width: "100%", maxWidth: 1660, opacity: salida(frame, durationInFrames) }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Kicker>{eyebrow}</Kicker>
            <div style={{ marginTop: 12 }}><Titular size={62} z={24}>{titulo}</Titular></div>
          </div>
          <div style={{ display: "flex", gap: 38, alignItems: "stretch", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <Tarjeta src={izq.img} w={790} h={540} rotulo={izq.rotulo} sub={izq.sub} seed={4} z={0} at={12} marca="no" />
              <Contacto w={790} y={546} op={0.46} />
            </div>
            <div style={{ position: "relative" }}>
              <Tarjeta src={der.img} w={790} h={540} rotulo={der.rotulo} sub={der.sub} seed={11} z={34} at={22} marca="ok" />
              <Contacto w={790} y={546} op={0.52} />
            </div>
          </div>
        </div>
      </Centro>
    </Escena>
  );
};

// ═══ PASOS — la secuencia del oficio, con los íconos PNG como objetos de la escena ════════════
export const Pasos: React.FC<Base & {
  eyebrow: string; titulo: string; pasos: { rotulo: string; sub: string; img?: string }[]; en: number[];
}> = ({ eyebrow, titulo, pasos, en, blurSrc, desde }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const luz = useKeyLight("center");
  return (
    <Escena blurSrc={blurSrc} desde={desde}>
      <Centro pad={96}>
        <div style={{ width: "100%", opacity: salida(frame, durationInFrames) }}>
          <div style={{ textAlign: "center", marginBottom: 38 }}>
            <Kicker>{eyebrow}</Kicker>
            <div style={{ marginTop: 12 }}><Titular size={62} z={24}>{titulo}</Titular></div>
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "stretch" }}>
            {pasos.map((s, i) => {
              const d = en[i] ?? i * 12;
              const q = interpolate(frame, [d, d + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              return (
                <React.Fragment key={i}>
                  {i > 0 && <div style={{ alignSelf: "center", width: 42, height: 4, borderRadius: 2, background: ACC, opacity: q * 0.9 }} />}
                  <div
                    style={{
                      width: 372, background: PAPER, borderRadius: VSL.radius + 2, padding: "30px 28px 34px",
                      boxShadow: slabShadow(luz, { lift: 1.15, edge: "rgba(20,18,15,0.5)", tint: "rgba(0,0,0,0.48)" }),
                      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                      opacity: q,
                      transform: `${tilt3d({ amount: 0.32, seed: i * 9 + 1, frame, z: 12 + i * 10 })} translateY(${((1 - q) * 32).toFixed(1)}px)`,
                      backgroundImage: `${specular(luz, 0.3)}, linear-gradient(${PAPER}, ${PAPER})`,
                    }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 24, background: INK, color: PAPER, fontFamily: FF, fontSize: 25, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      {i + 1}
                    </div>
                    {s.img && <Img src={staticFile(s.img)} style={{ width: 126, height: 126, objectFit: "contain", marginBottom: 14 }} />}
                    <div style={{ fontFamily: FF, fontSize: 42, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>{s.rotulo}</div>
                    <div style={{ fontFamily: FF, fontSize: 25, fontWeight: 500, color: MUTE, marginTop: 10, lineHeight: 1.32 }}>{s.sub}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Centro>
    </Escena>
  );
};

// ═══ LISTA — checklist. Columna a la izquierda, el b-roll respira a la derecha. ═══════════════
export const Lista: React.FC<Base & { eyebrow: string; titulo: string; items: string[]; en: number[] }> = ({
  eyebrow, titulo, items, en, blurSrc, desde,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const luz = useKeyLight("left");
  return (
    <Escena blurSrc={blurSrc} desde={desde} fuerza={0.86} lado="izquierda">
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 120px" }}>
        <div style={{ width: 1200, opacity: salida(frame, durationInFrames) }}>
          <div style={{ marginBottom: 30 }}>
            <Kicker>{eyebrow}</Kicker>
            <div style={{ marginTop: 12 }}><Titular size={66} z={26}>{titulo}</Titular></div>
          </div>
          {items.map((it, i) => {
            const d = en[i] ?? i * 14;
            const q = interpolate(frame, [d, d + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 24, background: PAPER, borderRadius: 16,
                  padding: "22px 32px", marginBottom: 16, opacity: q,
                  boxShadow: slabShadow(luz, { lift: 1.0, edge: "rgba(20,18,15,0.46)", tint: "rgba(0,0,0,0.44)" }),
                  transform: `${tilt3d({ amount: 0.22, seed: i * 6 + 2, frame, z: 8 + i * 5 })} translateX(${((1 - q) * -38).toFixed(1)}px)`,
                  backgroundImage: `${specular(luz, 0.26)}, linear-gradient(${PAPER}, ${PAPER})`,
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 20, background: GOOD, color: PAPER, fontFamily: FF, fontSize: 23, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</div>
                <div style={{ fontFamily: FF, fontSize: 40, fontWeight: 600, color: INK, letterSpacing: "-0.015em", lineHeight: 1.2 }}>{it}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Escena>
  );
};

// ═══ ANTES/DESPUÉS — la misma pared, con una cortinilla que RECORRE el plano ══════════════════
export const AntesDespues: React.FC<Base & { eyebrow: string; titulo: string; antes: string; despues: string }> = ({
  eyebrow, titulo, antes, despues, blurSrc, desde,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const luz = useKeyLight("center");
  const W = 1420, H = 600;
  // ⚠️ la cortinilla RECORRE casi todo el beat: cerrarla en 1 s dejaba 4,3 s de imagen quieta y
  // el REVELADO es el contenido del plano, no un adorno.
  const w = interpolate(frame, [30, 120], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const Rot: React.FC<{ t: string; der?: boolean; color: string }> = ({ t, der, color }) => (
    <div style={{
      position: "absolute", bottom: 26, [der ? "right" : "left"]: 26, background: color, color: PAPER,
      fontFamily: FF, fontSize: 26, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
      padding: "10px 20px", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.45)",
    } as React.CSSProperties}>{t}</div>
  );
  return (
    <Escena blurSrc={blurSrc} desde={desde}>
      <Centro>
        <div style={{ opacity: salida(frame, durationInFrames) }}>
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <Kicker>{eyebrow}</Kicker>
            <div style={{ marginTop: 12 }}><Titular size={60} z={22}>{titulo}</Titular></div>
          </div>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "relative", width: W, height: H, borderRadius: VSL.radius + 2, overflow: "hidden",
                background: INK, boxShadow: slabShadow(luz, { lift: 1.5, edge: "rgba(20,18,15,0.55)", tint: "rgba(0,0,0,0.52)" }),
                transform: tilt3d({ amount: 0.26, seed: 8, frame, z: 30 }),
              }}
            >
              <Img src={staticFile(antes)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <Rot t="Antes" color={BAD} />
              <div style={{ position: "absolute", inset: 0, width: `${w.toFixed(2)}%`, overflow: "hidden" }}>
                <Img src={staticFile(despues)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: `${w.toFixed(2)}%`, width: 5, background: ACC, boxShadow: `0 0 30px ${VSL.color.glow}` }} />
              {w > 55 && <Rot t="Después" der color={GOOD} />}
              <div style={{ position: "absolute", inset: 0, background: specular(luz, 0.3), mixBlendMode: "screen", opacity: 0.38 }} />
            </div>
            <Contacto w={W} y={H + 10} op={0.5} />
          </div>
        </div>
      </Centro>
    </Escena>
  );
};

// ═══ ROTULO — la única pieza que va ENCIMA del presentador hablando ═══════════════════════════
/** Ocupa la franja inferior y NUNCA le tapa la cara. ⛔ Sin precio, nunca: sólo señala el botón
 *  de la landing, que está justo debajo del video. */
export const Rotulo: React.FC<{ texto: string; nota?: string; flecha?: boolean }> = ({ texto, nota, flecha = false }) => {
  const frame = useCurrentFrame();
  const e = useEntra(0, { rise: 22 });
  const luz = useKeyLight("center");
  const bob = flecha ? Math.sin(frame / 7) * 6 : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", left: 120, bottom: 96, display: "flex", alignItems: "center", gap: 22,
          background: PAPER, borderRadius: 16, padding: "20px 30px", maxWidth: 1180,
          boxShadow: slabShadow(luz, { lift: 1.1, edge: "rgba(20,18,15,0.5)", tint: "rgba(0,0,0,0.5)" }),
          opacity: e.a, transform: `${tilt3d({ amount: 0.2, seed: 13, frame, z: 40 })} translateY(${e.y.toFixed(1)}px)`,
          backgroundImage: `${specular(luz, 0.3)}, linear-gradient(${PAPER}, ${PAPER})`,
        }}
      >
        {flecha && (
          <div style={{
            width: 58, height: 58, borderRadius: 29, background: ACC, color: INK, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FF, fontSize: 35, fontWeight: 800, transform: `translateY(${bob.toFixed(1)}px)`,
          }}>↓</div>
        )}
        <div>
          <div style={{ fontFamily: FF, fontSize: 38, fontWeight: 700, color: INK, letterSpacing: "-0.018em", lineHeight: 1.16 }}>{texto}</div>
          {nota && <div style={{ fontFamily: FF, fontSize: 25, fontWeight: 500, color: MUTE, marginTop: 6 }}>{nota}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ CIERRE — el CTA, flotando al costado mientras el presentador habla FULL detrás ═══════════
/** ⛔ Vive en su propia capa, NUNCA adentro de un componente de escena (en `cmetemu` el CTA se fue
 *  con el componente al cambiar de modo y el video se entregó sin él).
 *  ⛔ Sin precio y sin URL: el botón de la landing está justo debajo del video.
 *  ⛔ Y SIN FADE DE SALIDA: esta pieza llega al último cuadro del VSL, y el fade dejaba la tarjeta
 *  a medio transparente sobre el presentador justo en el momento de la venta. */
export const Cierre: React.FC<{ eyebrow: string; titulo: string; bullet: string; cta: string; img: string }> = ({
  eyebrow, titulo, bullet, cta, img,
}) => {
  const frame = useCurrentFrame();
  const e = useEntra(0, { salida: false, rise: 30 });
  const luz = useKeyLight("center");
  const bob = Math.sin(frame / 7) * 5;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", right: 104, top: 132, width: 690,
          background: PAPER, borderRadius: VSL.radius + 4, overflow: "hidden",
          boxShadow: slabShadow(luz, { lift: 2.1, edge: "rgba(20,18,15,0.55)", tint: "rgba(0,0,0,0.56)" }),
          opacity: e.a, filter: e.blur,
          transform: `${tilt3d({ amount: 0.3, seed: 21, frame, z: 70 })} translateY(${e.y.toFixed(1)}px)`,
        }}
      >
        <div style={{ position: "relative", height: 300, background: SOFT }}>
          <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: specular(luz, 0.45), mixBlendMode: "screen", opacity: 0.5 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(255,255,255,0.6)" }} />
        </div>
        <div style={{ padding: "32px 40px 40px" }}>
          <div style={{ fontFamily: FF, fontSize: 25, fontWeight: 800, letterSpacing: "0.17em", textTransform: "uppercase", color: ACC, marginBottom: 18 }}>{eyebrow}</div>
          <div style={{ fontFamily: FF, fontSize: 58, fontWeight: 800, color: INK, letterSpacing: "-0.032em", lineHeight: 1.06 }}>{titulo}</div>
          <div style={{ fontFamily: FF, fontSize: 27, fontWeight: 500, color: MUTE, marginTop: 16, lineHeight: 1.36 }}>{bullet}</div>
          <div style={{
            marginTop: 28, background: ACC, borderRadius: 14, padding: "22px 26px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
            boxShadow: "inset 0 2px 0 rgba(255,255,255,.4), 0 10px 26px rgba(0,0,0,.3)",
          }}>
            <div style={{ fontFamily: FF, fontSize: 31, fontWeight: 800, color: INK, letterSpacing: "0.01em", textAlign: "center" }}>{cta}</div>
            <div style={{ fontFamily: FF, fontSize: 34, fontWeight: 800, color: INK, transform: `translateY(${bob.toFixed(1)}px)` }}>↓</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
