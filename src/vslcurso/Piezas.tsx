// Piezas.tsx — kit del VSL de constructorlibre.com/curso.
//
// ⛔ POR QUÉ ESTE KIT EXISTE Y NO SE USA EL `kit/premium` DEL CANAL:
// el creador rechazó el primer montaje con estas palabras: *"más gráficos y edición estilo
// Remotion falta, limpia, moderna, es horrenda actualmente... debe ser limpia, muy limpia"*.
// Medido sobre el render rechazado: el kit premium dibuja tarjetas CREMA sobre fondo CREMA
// (≈2 % de diferencia de luminancia), con serif chico y mucho contenido por lámina — sobre
// b-roll oscuro se lee como un borrón beige. Esto es lo contrario: pocas piezas, blanco puro
// sobre un velo oscuro, Inter pesada, tipografía GRANDE, mucho aire y un solo acento.
//
// ⛔⛔ TODO video va con `OffthreadVideo`, NUNCA con `<Video>` (causa #1 del "se ve lageado").
// ⛔ Nada de `Math.random`: el farm rinde en 60 chunks y cada uno tiene que dar lo mismo.
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, Easing, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: INTER } = loadInter();
const FF = `${INTER}, "Segoe UI", system-ui, sans-serif`;

// ── PALETA ────────────────────────────────────────────────────────────────────────────────────
// Limpia y moderna, pero cálida: sigue siendo un canal de obra, no una fintech.
export const INK = "#14120F";      // negro cálido (fondo de velo, tinta sobre blanco)
export const PAPER = "#FFFFFF";
export const SOFT = "#F5F2EC";     // gris papel para superficies secundarias
export const LINE = "#E4DFD5";
export const MUTE = "#79726A";
export const ACC = "#E0922C";      // ámbar de obra — el ÚNICO acento
export const GOOD = "#2E7D57";
export const BAD = "#C1442F";

// ── MOTOR DE ENTRADA/SALIDA ───────────────────────────────────────────────────────────────────
/** Entra con un spring corto y sale con un fade rápido. Un solo gesto para todo el kit:
 *  la sensación de "limpio" sale de que TODAS las piezas se muevan igual. */
const useBeat = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.55 }, durationInFrames: 15 });
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return { p, a: p * out, y: (1 - p) * 26 };
};

/** rnd determinista (hash entero). ⛔ NO `Math.sin(seed*12.9898)`: con seeds grandes —y el seed es
 *  el frame de arranque del plano— pierde precisión y los sorteos se CORRELACIONAN (medido en
 *  `pinluz`: racha de 11 planos con el mismo sentido y reparto 43/57). Con `Math.imul` da 47/53. */
const rnd = (seed: number) => {
  let h = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

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

/** CLIP real a sangre. `Loop` con los cuadros REALES del archivo — ⛔ `loop` NO es una prop de
 *  `OffthreadVideo` (cae en `...props` y se ignora en silencio); acá el plano nunca pasa la
 *  duración real del clip, así que no hace falta ni loop ni congelamiento. */
export const Clip: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.02, 0.055);   // el clip ya se mueve solo: recorrido corto
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

/** FOTO a sangre con Ken-Burns. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.05, 0.11);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

// ── PRIMITIVAS DE TIPOGRAFÍA / SUPERFICIE ─────────────────────────────────────────────────────
/** VELO: oscurece y desenfoca el fondo para que la tipografía blanca se lea.
 *  ⛔ `backdrop-filter` se anula si un ancestro tiene `opacity < 1` (crea un *backdrop root*),
 *  así que este div NUNCA baja su opacidad: lo que se anima es el blur y el alfa del color. */
const Velo: React.FC<{ p: number; fuerza?: number }> = ({ p, fuerza = 1 }) => (
  <AbsoluteFill
    style={{
      backgroundColor: `rgba(20,18,15,${(0.58 * fuerza * p).toFixed(3)})`,
      backdropFilter: `blur(${(12 * fuerza * p).toFixed(1)}px) saturate(${(1 - 0.28 * p).toFixed(2)})`,
    }}
  />
);

const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = ACC }) => (
  <div style={{ fontFamily: FF, fontSize: 25, fontWeight: 800, letterSpacing: "0.17em", textTransform: "uppercase", color, marginBottom: 22 }}>
    {children}
  </div>
);

const SOMBRA_TARJETA = "0 34px 90px rgba(0,0,0,.48), 0 6px 18px rgba(0,0,0,.30)";

/** Tarjeta blanca flotando sobre el fondo. Sin marcos crema, sin bordes de vidrio. */
const Tarjeta: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: PAPER, borderRadius: 22, boxShadow: SOMBRA_TARJETA, padding: 56, ...style }}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 1 · COMENTARIO — el comentario REAL de YouTube. Solo el texto, sin nombre ni foto de perfil
//     (son personas reales; el plan del director lo pide explícito).
//     ⛔ Los comentarios están verificados contra 1.770 comentarios scrapeados. Cero inventados.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Comentario: React.FC<{ texto: string; resalta?: string; fuente: string }> = ({ texto, resalta, fuente }) => {
  const { p, a, y } = useBeat();
  const frame = useCurrentFrame();
  // el fragmento clave se enciende un poco después de que la tarjeta aterriza
  const hl = interpolate(frame, [22, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const partes = resalta && texto.includes(resalta) ? texto.split(resalta) : null;

  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 150px" }}>
        <div style={{ width: "100%", maxWidth: 1520, opacity: a, transform: `translateY(${y.toFixed(1)}px)` }}>
          <Tarjeta style={{ padding: "62px 72px" }}>
            <Eyebrow>Comentario real · YouTube</Eyebrow>
            <div style={{ fontFamily: FF, fontSize: 64, lineHeight: 1.24, fontWeight: 600, color: INK, letterSpacing: "-0.015em" }}>
              {partes ? (
                <>
                  {partes[0]}
                  <span
                    style={{
                      background: `linear-gradient(to top, rgba(224,146,44,${(0.42 * hl).toFixed(2)}) 0 42%, transparent 42%)`,
                      boxShadow: `inset 0 -3px 0 rgba(224,146,44,${hl.toFixed(2)})`,
                    }}
                  >
                    {resalta}
                  </span>
                  {partes.slice(1).join(resalta)}
                </>
              ) : (
                texto
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 34 }}>
              <div style={{ width: 44, height: 3, background: ACC, borderRadius: 2 }} />
              <div style={{ fontFamily: FF, fontSize: 26, fontWeight: 500, color: MUTE }}>{fuente}</div>
            </div>
          </Tarjeta>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 2 · FRASE — remate cinético. Líneas que entran de a una; la última va en caja de acento.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Frase: React.FC<{ lineas: string[]; cada?: number }> = ({ lineas, cada = 9 }) => {
  const { p } = useBeat();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Velo p={p} fuerza={1.06} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 150px" }}>
        <div style={{ textAlign: "center", opacity: out }}>
          {lineas.map((l, i) => {
            const q = interpolate(frame, [i * cada, i * cada + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            const ultima = i === lineas.length - 1;
            return (
              <div key={i} style={{ opacity: q, transform: `translateY(${((1 - q) * 22).toFixed(1)}px)`, marginTop: i ? 16 : 0 }}>
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: FF,
                    fontSize: ultima ? 98 : 80,
                    fontWeight: ultima ? 800 : 600,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.12,
                    color: ultima ? INK : PAPER,
                    background: ultima ? ACC : "transparent",
                    padding: ultima ? "10px 30px 16px" : 0,
                    borderRadius: ultima ? 14 : 0,
                    textShadow: ultima ? "none" : "0 3px 12px rgba(0,0,0,.6), 0 7px 38px rgba(0,0,0,.78)",
                  }}
                >
                  {l}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 3 · CIFRA — un número grande que cuenta. Una sola idea por lámina.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Cifra: React.FC<{ eyebrow: string; valor: number; prefijo?: string; sufijo?: string; apoyo?: string }> = ({
  eyebrow, valor, prefijo = "", sufijo = "", apoyo,
}) => {
  const { p, a, y } = useBeat();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [6, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const n = Math.round(valor * k);
  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 150px" }}>
        <div style={{ textAlign: "center", opacity: a, transform: `translateY(${y.toFixed(1)}px)` }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div
            style={{
              fontFamily: FF, fontSize: 250, fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.045em",
              color: PAPER, textShadow: "0 4px 14px rgba(0,0,0,.6), 0 10px 50px rgba(0,0,0,.8)", fontVariantNumeric: "tabular-nums",
            }}
          >
            {prefijo}
            {n.toLocaleString("es-MX")}
            <span style={{ fontSize: 82, fontWeight: 700, letterSpacing: "-0.02em", marginLeft: 16, color: ACC }}>{sufijo}</span>
          </div>
          {apoyo && (
            <div style={{ fontFamily: FF, fontSize: 34, fontWeight: 500, color: "rgba(255,255,255,.82)", marginTop: 30, maxWidth: 1120, lineHeight: 1.4 }}>
              {apoyo}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 4 · ESCALERA — cifras que entran de a una, EN SINCRO con la voz (80 · 150 · 300).
//     `enAlSeg` = el frame (relativo al cue) en el que cada chip tiene que aparecer.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Escalera: React.FC<{ eyebrow: string; items: { valor: string; nota: string }[]; en: number[] }> = ({ eyebrow, items, en }) => {
  const { p } = useBeat();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eb = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 130px" }}>
        <div style={{ opacity: out, width: "100%", textAlign: "center" }}>
          <div style={{ opacity: eb }}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <div style={{ display: "flex", gap: 34, justifyContent: "center", alignItems: "flex-end", marginTop: 26 }}>
            {items.map((it, i) => {
              const q = interpolate(frame, [en[i] ?? i * 12, (en[i] ?? i * 12) + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              const alto = 250 + i * 58;   // escalera real: cada chip un poco más alto
              return (
                <div
                  key={i}
                  style={{
                    width: 470, height: alto, background: i === items.length - 1 ? ACC : PAPER, borderRadius: 20,
                    boxShadow: SOMBRA_TARJETA, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: q, transform: `translateY(${((1 - q) * 34).toFixed(1)}px) scale(${(0.94 + 0.06 * q).toFixed(3)})`,
                  }}
                >
                  <div style={{ fontFamily: FF, fontSize: 112, fontWeight: 800, letterSpacing: "-0.04em", color: INK, fontVariantNumeric: "tabular-nums" }}>
                    {it.valor}
                  </div>
                  <div style={{ fontFamily: FF, fontSize: 27, fontWeight: 600, color: i === items.length - 1 ? "rgba(20,18,15,.72)" : MUTE }}>{it.nota}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 5 · CUENTA — la matemática, fila por fila, en sincro con la voz.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Cuenta: React.FC<{ eyebrow: string; titulo: string; filas: { trabajo: string; total: string }[]; en: number[] }> = ({
  eyebrow, titulo, filas, en,
}) => {
  const { p } = useBeat();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eb = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 150px" }}>
        <div style={{ width: "100%", maxWidth: 1560, opacity: out }}>
          <div style={{ opacity: eb, transform: `translateY(${((1 - eb) * 20).toFixed(1)}px)` }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <div style={{ fontFamily: FF, fontSize: 66, fontWeight: 700, color: PAPER, letterSpacing: "-0.028em", marginBottom: 40, textShadow: "0 3px 10px rgba(0,0,0,.55), 0 6px 34px rgba(0,0,0,.7)" }}>
              {titulo}
            </div>
          </div>
          {filas.map((f, i) => {
            const d = en[i] ?? i * 16;
            const q = interpolate(frame, [d, d + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40,
                  background: PAPER, borderRadius: 18, boxShadow: SOMBRA_TARJETA,
                  padding: "30px 44px", marginBottom: 20,
                  opacity: q, transform: `translateX(${((1 - q) * -40).toFixed(1)}px)`,
                }}
              >
                <div style={{ fontFamily: FF, fontSize: 46, fontWeight: 600, color: INK, letterSpacing: "-0.015em" }}>{f.trabajo}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                  <div style={{ width: 46, height: 3, background: LINE, borderRadius: 2 }} />
                  <div style={{ fontFamily: FF, fontSize: 66, fontWeight: 800, color: ACC, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                    {f.total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 6 · DUELO — dos lados con foto REAL. ⛔ Siempre con imagen: el slot vacío se ve como asset roto.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Duelo: React.FC<{
  eyebrow: string; titulo: string;
  izq: { rotulo: string; sub: string; img: string };
  der: { rotulo: string; sub: string; img: string };
}> = ({ eyebrow, titulo, izq, der }) => {
  const { p } = useBeat();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cab = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Lado: React.FC<{ d: typeof izq; bien: boolean; delay: number }> = ({ d, bien, delay }) => {
    const q = interpolate(frame, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    return (
      <div
        style={{
          flex: 1, background: PAPER, borderRadius: 22, overflow: "hidden", boxShadow: SOMBRA_TARJETA,
          opacity: q, transform: `translateY(${((1 - q) * 30).toFixed(1)}px)`,
        }}
      >
        <div style={{ position: "relative", height: 392, background: SOFT }}>
          <Img src={staticFile(d.img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: bien ? "none" : "saturate(.6)" }} />
          <div
            style={{
              position: "absolute", top: 20, left: 20, width: 56, height: 56, borderRadius: 28,
              background: bien ? GOOD : BAD, color: PAPER, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FF, fontSize: 34, fontWeight: 800, boxShadow: "0 8px 24px rgba(0,0,0,.4)",
            }}
          >
            {bien ? "✓" : "✕"}
          </div>
        </div>
        <div style={{ padding: "30px 38px 38px" }}>
          <div style={{ fontFamily: FF, fontSize: 50, fontWeight: 700, color: INK, letterSpacing: "-0.022em", lineHeight: 1.14 }}>{d.rotulo}</div>
          <div style={{ fontFamily: FF, fontSize: 29, fontWeight: 500, color: MUTE, marginTop: 12, lineHeight: 1.34 }}>{d.sub}</div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 130px" }}>
        <div style={{ width: "100%", maxWidth: 1640, opacity: out }}>
          <div style={{ textAlign: "center", opacity: cab, transform: `translateY(${((1 - cab) * 18).toFixed(1)}px)`, marginBottom: 34 }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <div style={{ fontFamily: FF, fontSize: 62, fontWeight: 700, color: PAPER, letterSpacing: "-0.028em", textShadow: "0 3px 10px rgba(0,0,0,.55), 0 6px 34px rgba(0,0,0,.7)" }}>
              {titulo}
            </div>
          </div>
          <div style={{ display: "flex", gap: 34, alignItems: "stretch" }}>
            <Lado d={izq} bien={false} delay={12} />
            <Lado d={der} bien delay={22} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 7 · TARJETAS — 3-4 tarjetas con foto real, reveladas EN SINCRO con la voz.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Tarjetas: React.FC<{ eyebrow: string; titulo: string; items: { rotulo: string; sub: string; img: string }[]; en: number[] }> = ({
  eyebrow, titulo, items, en,
}) => {
  const { p } = useBeat();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cab = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 110px" }}>
        <div style={{ width: "100%", opacity: out }}>
          <div style={{ textAlign: "center", opacity: cab, transform: `translateY(${((1 - cab) * 18).toFixed(1)}px)`, marginBottom: 36 }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <div style={{ fontFamily: FF, fontSize: 62, fontWeight: 700, color: PAPER, letterSpacing: "-0.028em", textShadow: "0 3px 10px rgba(0,0,0,.55), 0 6px 34px rgba(0,0,0,.7)" }}>
              {titulo}
            </div>
          </div>
          <div style={{ display: "flex", gap: 28, justifyContent: "center", alignItems: "stretch" }}>
            {items.map((it, i) => {
              const d = en[i] ?? i * 12;
              const q = interpolate(frame, [d, d + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              return (
                <div
                  key={i}
                  style={{
                    flex: 1, maxWidth: 500, background: PAPER, borderRadius: 20, overflow: "hidden", boxShadow: SOMBRA_TARJETA,
                    opacity: q, transform: `translateY(${((1 - q) * 32).toFixed(1)}px)`,
                  }}
                >
                  <div style={{ height: 300, background: SOFT }}>
                    <Img src={staticFile(it.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "26px 30px 32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 15, background: ACC, color: INK, fontFamily: FF, fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {i + 1}
                      </div>
                      <div style={{ fontFamily: FF, fontSize: 44, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>{it.rotulo}</div>
                    </div>
                    <div style={{ fontFamily: FF, fontSize: 27, fontWeight: 500, color: MUTE, marginTop: 12, lineHeight: 1.34 }}>{it.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 8 · PASOS — la secuencia del oficio, en una línea horizontal con íconos.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Pasos: React.FC<{ eyebrow: string; titulo: string; pasos: { rotulo: string; sub: string; img?: string }[]; en: number[] }> = ({
  eyebrow, titulo, pasos, en,
}) => {
  const { p } = useBeat();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cab = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 110px" }}>
        <div style={{ width: "100%", opacity: out }}>
          <div style={{ textAlign: "center", opacity: cab, transform: `translateY(${((1 - cab) * 18).toFixed(1)}px)`, marginBottom: 42 }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <div style={{ fontFamily: FF, fontSize: 62, fontWeight: 700, color: PAPER, letterSpacing: "-0.028em", textShadow: "0 3px 10px rgba(0,0,0,.55), 0 6px 34px rgba(0,0,0,.7)" }}>
              {titulo}
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, justifyContent: "center", alignItems: "stretch" }}>
            {pasos.map((s, i) => {
              const d = en[i] ?? i * 12;
              const q = interpolate(frame, [d, d + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              return (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div style={{ alignSelf: "center", width: 40, height: 4, borderRadius: 2, background: ACC, opacity: q * 0.9 }} />
                  )}
                  <div
                    style={{
                      width: 372, background: PAPER, borderRadius: 20, boxShadow: SOMBRA_TARJETA, padding: "30px 30px 34px",
                      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                      opacity: q, transform: `translateY(${((1 - q) * 28).toFixed(1)}px)`,
                    }}
                  >
                    <div style={{ width: 46, height: 46, borderRadius: 23, background: INK, color: PAPER, fontFamily: FF, fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 9 · LISTA — checklist. Columna de papel a la izquierda, el b-roll respira a la derecha.
//     Los ítems entran EN SINCRO con la voz (`en` en frames relativos al cue).
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Lista: React.FC<{ eyebrow: string; titulo: string; items: string[]; en: number[] }> = ({ eyebrow, titulo, items, en }) => {
  const { p } = useBeat();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cab = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Velo p={p} fuerza={0.72} />
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 120px" }}>
        <div style={{ width: 1200, marginTop: 0, height: "100%", display: "flex", alignItems: "center", opacity: out }}>
          <div style={{ width: "100%" }}>
            <div style={{ opacity: cab, transform: `translateY(${((1 - cab) * 18).toFixed(1)}px)`, marginBottom: 32 }}>
              <Eyebrow>{eyebrow}</Eyebrow>
              <div style={{ fontFamily: FF, fontSize: 64, fontWeight: 700, color: PAPER, letterSpacing: "-0.028em", lineHeight: 1.1, textShadow: "0 3px 10px rgba(0,0,0,.6), 0 6px 34px rgba(0,0,0,.75)" }}>
                {titulo}
              </div>
            </div>
            {items.map((it, i) => {
              const d = en[i] ?? i * 14;
              const q = interpolate(frame, [d, d + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: 22, background: PAPER, borderRadius: 16,
                    boxShadow: SOMBRA_TARJETA, padding: "22px 32px", marginBottom: 16,
                    opacity: q, transform: `translateX(${((1 - q) * -34).toFixed(1)}px)`,
                  }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 19, background: GOOD, color: PAPER, fontFamily: FF, fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    ✓
                  </div>
                  <div style={{ fontFamily: FF, fontSize: 40, fontWeight: 600, color: INK, letterSpacing: "-0.015em", lineHeight: 1.2 }}>{it}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 10 · ANTES/DESPUÉS — la misma pared, con una cortinilla limpia.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const AntesDespues: React.FC<{ eyebrow: string; titulo: string; antes: string; despues: string }> = ({ eyebrow, titulo, antes, despues }) => {
  const { p } = useBeat();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cab = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = interpolate(frame, [26, 58], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  const Rotulo: React.FC<{ t: string; der?: boolean; color: string }> = ({ t, der, color }) => (
    <div
      style={{
        position: "absolute", bottom: 26, [der ? "right" : "left"]: 26, background: color, color: PAPER,
        fontFamily: FF, fontSize: 26, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
        padding: "10px 20px", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.4)",
      } as React.CSSProperties}
    >
      {t}
    </div>
  );

  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 150px" }}>
        <div style={{ width: "100%", maxWidth: 1420, opacity: out }}>
          <div style={{ textAlign: "center", opacity: cab, transform: `translateY(${((1 - cab) * 18).toFixed(1)}px)`, marginBottom: 30 }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <div style={{ fontFamily: FF, fontSize: 60, fontWeight: 700, color: PAPER, letterSpacing: "-0.028em", textShadow: "0 3px 10px rgba(0,0,0,.55), 0 6px 34px rgba(0,0,0,.7)" }}>
              {titulo}
            </div>
          </div>
          <div style={{ position: "relative", width: "100%", height: 620, borderRadius: 22, overflow: "hidden", boxShadow: SOMBRA_TARJETA, background: INK }}>
            <Img src={staticFile(antes)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <Rotulo t="Antes" color={BAD} />
            <div style={{ position: "absolute", inset: 0, width: `${w.toFixed(2)}%`, overflow: "hidden" }}>
              <Img src={staticFile(despues)} style={{ position: "absolute", left: 0, top: 0, width: 1420, height: 620, objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${w.toFixed(2)}%`, width: 5, background: ACC, boxShadow: "0 0 26px rgba(224,146,44,.8)" }} />
            {w > 55 && <Rotulo t="Después" der color={GOOD} />}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 11 · SELLO — la garantía. Una sola pieza, centrada, sin adornos.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Sello: React.FC<{ dias: number; titulo: string; apoyo: string }> = ({ dias, titulo, apoyo }) => {
  const { p, a, y } = useBeat();
  const frame = useCurrentFrame();
  const anillo = interpolate(frame, [8, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const R = 152, C = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <Velo p={p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 150px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 76, opacity: a, transform: `translateY(${y.toFixed(1)}px)` }}>
          <div style={{ position: "relative", width: 356, height: 356, flexShrink: 0 }}>
            <svg width={356} height={356} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
              <circle cx={178} cy={178} r={R} fill="none" stroke="rgba(255,255,255,.20)" strokeWidth={12} />
              <circle cx={178} cy={178} r={R} fill="none" stroke={ACC} strokeWidth={12} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - anillo)} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: FF, fontSize: 152, fontWeight: 800, color: PAPER, lineHeight: 0.9, letterSpacing: "-0.05em" }}>{dias}</div>
              <div style={{ fontFamily: FF, fontSize: 30, fontWeight: 700, color: ACC, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 6 }}>días</div>
            </div>
          </div>
          <div style={{ maxWidth: 780 }}>
            <div style={{ fontFamily: FF, fontSize: 82, fontWeight: 800, color: PAPER, letterSpacing: "-0.032em", lineHeight: 1.06, textShadow: "0 3px 10px rgba(0,0,0,.55), 0 6px 34px rgba(0,0,0,.7)" }}>
              {titulo}
            </div>
            <div style={{ fontFamily: FF, fontSize: 34, fontWeight: 500, color: "rgba(255,255,255,.84)", marginTop: 20, lineHeight: 1.38 }}>{apoyo}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 12 · ROTULO — rótulo chico, abajo. La única pieza que va ENCIMA del presentador hablando:
//      ocupa la franja inferior y NUNCA le tapa la cara.
//      ⛔ Sin precio, nunca (regla dura del canal): sólo señala el botón de la landing.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Rotulo: React.FC<{ texto: string; nota?: string; flecha?: boolean }> = ({ texto, nota, flecha = false }) => {
  const { a, y } = useBeat();
  const frame = useCurrentFrame();
  const bob = flecha ? Math.sin(frame / 7) * 6 : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", left: 120, bottom: 96, display: "flex", alignItems: "center", gap: 20,
          background: PAPER, borderRadius: 16, padding: "20px 30px", boxShadow: SOMBRA_TARJETA,
          opacity: a, transform: `translateY(${y.toFixed(1)}px)`, maxWidth: 1180,
        }}
      >
        {flecha && (
          <div
            style={{
              width: 56, height: 56, borderRadius: 28, background: ACC, color: INK, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FF, fontSize: 34, fontWeight: 800, transform: `translateY(${bob.toFixed(1)}px)`,
            }}
          >
            ↓
          </div>
        )}
        <div>
          <div style={{ fontFamily: FF, fontSize: 38, fontWeight: 700, color: INK, letterSpacing: "-0.018em", lineHeight: 1.16 }}>{texto}</div>
          {nota && <div style={{ fontFamily: FF, fontSize: 25, fontWeight: 500, color: MUTE, marginTop: 6 }}>{nota}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// 13 · CIERRE — el CTA. Tarjeta flotando A UN COSTADO mientras el presentador habla FULL detrás.
//      ⛔ Vive en su propia capa `over`, NUNCA adentro de un componente de escena (en `cmetemu`
//      el CTA se fue con el componente al cambiar de modo y el video se entregó sin él).
//      ⛔ Sin precio y sin URL leída en voz: el botón de la landing está justo debajo del video.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const Cierre: React.FC<{ eyebrow: string; titulo: string; bullet: string; cta: string; img: string }> = ({
  eyebrow, titulo, bullet, cta, img,
}) => {
  const { a, y } = useBeat();
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 7) * 5;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", right: 104, top: 132, width: 690,
          background: PAPER, borderRadius: 24, overflow: "hidden", boxShadow: "0 44px 110px rgba(0,0,0,.62), 0 8px 22px rgba(0,0,0,.34)",
          opacity: a, transform: `translateY(${y.toFixed(1)}px)`,
        }}
      >
        <div style={{ height: 300, background: SOFT }}>
          <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "32px 40px 40px" }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div style={{ fontFamily: FF, fontSize: 58, fontWeight: 800, color: INK, letterSpacing: "-0.032em", lineHeight: 1.06 }}>{titulo}</div>
          <div style={{ fontFamily: FF, fontSize: 27, fontWeight: 500, color: MUTE, marginTop: 16, lineHeight: 1.36 }}>{bullet}</div>
          <div
            style={{
              marginTop: 28, background: ACC, borderRadius: 14, padding: "22px 26px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
            }}
          >
            <div style={{ fontFamily: FF, fontSize: 31, fontWeight: 800, color: INK, letterSpacing: "0.01em", textAlign: "center" }}>{cta}</div>
            <div style={{ fontFamily: FF, fontSize: 34, fontWeight: 800, color: INK, transform: `translateY(${bob.toFixed(1)}px)` }}>↓</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
