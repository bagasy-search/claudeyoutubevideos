// Piezas.tsx — primitivas del montaje VLOG CASERO de `fasenales17` (Federer Archivos).
//
// La vara del video la fijó el creador: vlog casero, un plano por paso, cocina/baño reales con
// desorden normal. NADA DE CINE: sin fondo negro, sin grading naranja, sin viñeta. Los pocos
// componentes que hay son SOBREIMPRESOS sobre metraje real, en la paleta de la guía (papel crema,
// verde bosque, ámbar), con tipografía grande porque el público tiene más de 60.
//
// ⛔⛔ TODO video va con `OffthreadVideo`, NUNCA con `<Video>`. Al RENDERIZAR, `<Video>` monta un
// elemento HTML que busca POR TIEMPO y no acierta el cuadro exacto: repite y saltea cuadros de
// forma IRREGULAR, y eso se lee como TIRÓN. Es la causa #1 del "se ve todo lageado".
import React from "react";
import {
  AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

const CREMA = "#F6F1E3";
const VERDE = "#1E4632";
const AMBAR = "#E8A33D";
const TINTA = "#14170F";

// ── azar determinista ────────────────────────────────────────────────────────────────────────
// ⛔ Nunca `Math.random`: el farm rinde en 60 chunks separados y cada uno tiene que dar EXACTAMENTE
//    lo mismo. Y ⛔ nunca `Math.sin(seed*12.9898)*43758.5453`: con seeds grandes (el seed es el
//    cuadro de arranque del plano) pierde precisión y se CORRELACIONA — medido en `pinluz`, dio
//    racha de 11 planos con el mismo sentido y reparto 43/57. Con un hash entero da racha 8 y 47/53,
//    que es la mediana exacta del azar.
const rnd = (seed: number) => {
  let t = (Math.imul(seed | 0, 0x6d2b79f5) + 0x9e3779b9) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * KEN-BURNS — regla dura del creador (sep-2026, TODOS los nichos, PARA SIEMPRE):
 *   "todos los zooms en imágenes son IDÉNTICOS, algunos deben ser zoom out no todos zoom in hacia
 *    el centro, y al azar — no siempre zoom out luego in luego out perfecto sino al azar".
 * El helper viejo recibía `from`/`to` CONSTANTES: todas las fotos hacían el MISMO zoom in, a la
 * MISMA velocidad, hacia el MISMO centro. Acá varían POR PLANO y todas sorteadas del mismo seed:
 *   · sentido  — acerca o aleja, ~50/50, AL AZAR (⛔ alternar in/out/in/out es otro metrónomo)
 *   · amplitud — un rango, no un valor fijo (1,5 %/s se lee como foto quieta)
 *   · foco     — `transformOrigin` sorteado, el zoom NO va siempre al centro
 *   · deriva   — ángulo propio, atada a la ESCALA para que nunca destape el fondo
 */
const useKenBurns = (seed: number, piso: number, ampMin: number, ampMax: number, pan: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r = (o: number) => rnd(seed * 7919 + o);
  const amp = (ampMin + (ampMax - ampMin) * r(7)) / 100;
  const acerca = r(0) > 0.5;
  const lo = piso, hi = piso + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 32 + 36 * r(13), oy = 32 + 36 * r(21);
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  // COBERTURA: el traslado máximo tiene que coincidir con la escala MÍNIMA, no con el tiempo.
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const d = Math.min(pan, Math.max(0, techo));
  const ang = r(31) * Math.PI * 2;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * d * k).toFixed(3)}%, ${(Math.sin(ang) * d * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

const LLENA: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

/**
 * CLIP animado (agnes i2v).
 * ⛔ `loop` NO es una prop de `OffthreadVideo`: cae en el `...props` y se IGNORA en silencio. El
 *    clip dura ~5 s y el plano puede durar 9, así que el último cuadro se CONGELA el resto del
 *    slot — el "plano muerto" que el creador marca. Va `<Loop durationInFrames={frames}>` con los
 *    cuadros REALES del archivo, medidos por el build con ffprobe.
 * Los clips ya se mueven solos, así que su Ken-Burns es la mitad del de una foto.
 */
export const Clip: React.FC<{ src: string; seed?: number; frames?: number }> = ({ src, seed = 1, frames }) => {
  const t = useKenBurns(seed, 1.03, 1.5, 4, 0.6);
  const v = <OffthreadVideo src={staticFile(src)} muted style={{ ...LLENA, ...t }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: TINTA, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{v}</Loop> : v}
    </AbsoluteFill>
  );
};

/** FOTO quieta con Ken-Burns. Sólo para los planos cuyo clip rechazó el auditor. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.06, 3, 9, 1.3);
  return (
    <AbsoluteFill style={{ backgroundColor: TINTA, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ ...LLENA, ...t }} />
    </AbsoluteFill>
  );
};

/** LÁMINA de la guía a pantalla completa, con acercamiento lento a la zona que él está nombrando.
 *  Es EL MOMENTO del video: queremos que el espectador le saque una foto. */
const ZONAS: Record<string, [number, number, number]> = {
  completa: [50, 50, 1.0],
  chequeo: [30, 30, 1.55],
  cuerpo: [50, 60, 1.45],
  errores: [80, 80, 1.7],
  plazo: [50, 95, 1.6],
  salero: [20, 80, 1.7],
};
export const Lamina: React.FC<{ src: string; zoom?: string }> = ({ src, zoom = "completa" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [ox, oy, z] = ZONAS[zoom] || ZONAS.completa;
  const s = interpolate(frame, [0, durationInFrames], [z * 0.97, z * 1.03], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: CREMA, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ ...LLENA, objectFit: "contain", transform: `scale(${s.toFixed(4)})`, transformOrigin: `${ox}% ${oy}%` }}
      />
    </AbsoluteFill>
  );
};

// ── COMPONENTES SOBREIMPRESOS ────────────────────────────────────────────────────────────────
// Van ENCIMA del metraje real, nunca en lugar de él.
// ⛔ El velo no puede pasar de ~0,58 de alfa: con 0,80 el b-roll desaparece y el componente queda
//    sobre pantalla NEGRA — se lee como "presentador / negro con cartel / presentador", y ninguna
//    compuerta lo ve (hay imagen, blackdetect no dispara, el texto es legible).
// ⛔ El div del velo NUNCA baja su `opacity`: `backdrop-filter` se anula si un ancestro tiene
//    opacity<1. Lo que se anima es el alfa del color.
const useAparecer = (sinSalida = false) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [-1, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // ⛔ El fade de salida del ÚLTIMO componente se come el CTA: con `sinSalida` se entrega opaco.
  const out = sinSalida ? 1 : interpolate(frame, [Math.max(12, durationInFrames - 10), durationInFrames], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(inP, out);
};

const SOMBRA = "0 3px 10px rgba(0,0,0,.55), 0 6px 34px rgba(0,0,0,.7)";
const SANS = "Oswald, Impact, Haettenschweiler, system-ui, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

const Velo: React.FC<{ a: number; children: React.ReactNode }> = ({ a, children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: `rgba(20,23,15,${(0.58 * a).toFixed(3)})`, backdropFilter: `blur(${(12 * a).toFixed(1)}px) saturate(0.72)` }} />
    {children}
  </AbsoluteFill>
);

/** 1 — el número grande de la señal. */
export const NumeroSenal: React.FC<{ n?: string; titulo?: string }> = ({ n = "", titulo = "" }) => {
  const a = useAparecer();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: a }}>
      <div style={{ position: "absolute", left: 110, bottom: 150, display: "flex", alignItems: "flex-end", gap: 28 }}>
        <div style={{ fontFamily: SANS, fontSize: 250, lineHeight: 0.82, color: AMBAR, textShadow: SOMBRA }}>{n}</div>
        <div style={{ paddingBottom: 22 }}>
          <div style={{ fontFamily: SANS, fontSize: 34, letterSpacing: "0.18em", color: CREMA, textShadow: SOMBRA }}>SEÑAL</div>
          <div style={{ fontFamily: SANS, fontSize: 78, lineHeight: 1.02, color: "#FFFFFF", textShadow: SOMBRA, maxWidth: 1080 }}>{titulo}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 2 — lista numerada (los 3 errores, los 4 pasos del chequeo). */
export const ListaNumerada: React.FC<{ titulo?: string; items?: string[] }> = ({ titulo = "", items = [] }) => {
  const a = useAparecer();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // ⛔ Los escalonados FIJOS revelan a medio dibujar cuando el momento es corto: se escala al hueco.
  const paso = Math.max(4, Math.min(12, Math.floor((durationInFrames - 16) / Math.max(1, items.length))));
  return (
    <Velo a={a}>
      <div style={{ position: "absolute", left: 140, top: 190, right: 140, opacity: a }}>
        <div style={{ fontFamily: SANS, fontSize: 62, color: AMBAR, textShadow: SOMBRA, marginBottom: 34 }}>{titulo}</div>
        {items.map((t, i) => {
          const p = interpolate(frame, [10 + i * paso, 10 + i * paso + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", gap: 26, alignItems: "flex-start", marginBottom: 26, opacity: p, transform: `translateX(${((1 - p) * 26).toFixed(1)}px)` }}>
              <div style={{ fontFamily: SANS, fontSize: 66, lineHeight: 1, color: AMBAR, minWidth: 58, textShadow: SOMBRA }}>{i + 1}</div>
              <div style={{ fontFamily: SERIF, fontSize: 52, lineHeight: 1.22, color: "#FFFFFF", textShadow: SOMBRA }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Velo>
  );
};

/** 3 — comparación de dos lados (sal común vs sal dietética, espuma normal vs densa). */
export const DosLados: React.FC<{ izqTitulo?: string; izq?: string; derTitulo?: string; der?: string }> = ({
  izqTitulo = "", izq = "", derTitulo = "", der = "",
}) => {
  const a = useAparecer();
  const Col: React.FC<{ t: string; s: string; c: string; x: number }> = ({ t, s, c, x }) => (
    <div style={{ flex: 1, padding: "38px 34px", background: "rgba(246,241,227,.94)", borderTop: `12px solid ${c}`, borderRadius: 8, transform: `translateX(${x}px)` }}>
      <div style={{ fontFamily: SANS, fontSize: 50, color: c, marginBottom: 14 }}>{t}</div>
      <div style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1.22, color: TINTA }}>{s}</div>
    </div>
  );
  return (
    <Velo a={a}>
      <div style={{ position: "absolute", left: 140, right: 140, top: 300, display: "flex", gap: 40, opacity: a }}>
        <Col t={izqTitulo} s={izq} c={VERDE} x={(1 - a) * -30} />
        <Col t={derTitulo} s={der} c="#B3402C" x={(1 - a) * 30} />
      </div>
    </Velo>
  );
};

/** 4 — el plazo (día 14 / semana 4 / cada 6 meses). */
export const Plazo: React.FC<{ titulo?: string; hitos?: { cuando: string; que: string }[] }> = ({ titulo = "", hitos = [] }) => {
  const a = useAparecer();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const paso = Math.max(4, Math.min(14, Math.floor((durationInFrames - 16) / Math.max(1, hitos.length))));
  return (
    <Velo a={a}>
      <div style={{ position: "absolute", left: 140, right: 140, top: 260, opacity: a }}>
        <div style={{ fontFamily: SANS, fontSize: 58, color: AMBAR, textShadow: SOMBRA, marginBottom: 40 }}>{titulo}</div>
        <div style={{ display: "flex", gap: 30 }}>
          {hitos.map((h, i) => {
            const p = interpolate(frame, [10 + i * paso, 10 + i * paso + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ flex: 1, opacity: p, transform: `translateY(${((1 - p) * 20).toFixed(1)}px)` }}>
                <div style={{ height: 10, background: AMBAR, borderRadius: 5, marginBottom: 22 }} />
                <div style={{ fontFamily: SANS, fontSize: 62, color: "#FFFFFF", textShadow: SOMBRA }}>{h.cuando}</div>
                <div style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1.2, color: CREMA, textShadow: SOMBRA, marginTop: 8 }}>{h.que}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Velo>
  );
};

/** 5 — un dato grande con su unidad (el filtrado glomerular, la creatinina). */
export const DatoGrande: React.FC<{ valor?: string; unidad?: string; pie?: string }> = ({ valor = "", unidad = "", pie = "" }) => {
  const a = useAparecer();
  return (
    <Velo a={a}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: a }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <div style={{ fontFamily: SANS, fontSize: 300, lineHeight: 0.85, color: "#FFFFFF", textShadow: SOMBRA }}>{valor}</div>
          <div style={{ fontFamily: SANS, fontSize: 90, color: AMBAR, textShadow: SOMBRA }}>{unidad}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 52, color: CREMA, textShadow: SOMBRA, marginTop: 26, maxWidth: 1400, textAlign: "center" }}>{pie}</div>
      </div>
    </Velo>
  );
};

/** 6 — checklist (cómo se lee el papel con los números anotados). */
export const Checklist: React.FC<{ titulo?: string; items?: string[] }> = ({ titulo = "", items = [] }) => {
  const a = useAparecer();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const paso = Math.max(4, Math.min(12, Math.floor((durationInFrames - 16) / Math.max(1, items.length))));
  return (
    <Velo a={a}>
      <div style={{ position: "absolute", left: 150, right: 150, top: 240, opacity: a }}>
        <div style={{ fontFamily: SANS, fontSize: 58, color: AMBAR, textShadow: SOMBRA, marginBottom: 32 }}>{titulo}</div>
        {items.map((t, i) => {
          const p = interpolate(frame, [10 + i * paso, 10 + i * paso + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 24, opacity: p }}>
              <div style={{ width: 40, height: 40, borderRadius: 6, background: AMBAR, transform: `scale(${(0.6 + 0.4 * p).toFixed(2)})` }} />
              <div style={{ fontFamily: SERIF, fontSize: 50, lineHeight: 1.2, color: "#FFFFFF", textShadow: SOMBRA }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Velo>
  );
};

/** 7 — CTA: QR + dominio, en la capa `over`.
 *  ⛔ El CTA NUNCA vive adentro de un componente de escena: en `cmetemu` el QR estaba hardcodeado
 *  dentro de un `Mov*`, al pasar el video a modo VLOG se fue con él, el video salió SIN CTA y
 *  ninguna compuerta lo vio. Va suelto, en su propia capa, atado al ms de la frase.
 *  ⛔ Y el QR va sobre BLANCO con zona de silencio: sin padding no decodifica del render. */
export const Cta: React.FC<{ qr: string; dominio: string; sinSalida?: boolean }> = ({ qr, dominio, sinSalida }) => {
  const a = useAparecer(sinSalida);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", right: 96, bottom: 150,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        opacity: a, transform: `translateY(${((1 - a) * 22).toFixed(1)}px)`,
      }}>
        <div style={{ background: "#FFFFFF", padding: 22, borderRadius: 10, boxShadow: "0 18px 50px rgba(0,0,0,.65)" }}>
          <Img src={staticFile(qr)} style={{ width: 300, height: 300, display: "block", imageRendering: "pixelated" }} />
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 40, letterSpacing: "0.01em", color: "#FFFFFF",
          background: "rgba(20,23,15,.86)", padding: "8px 20px", borderRadius: 6, textShadow: SOMBRA,
        }}>{dominio}</div>
      </div>
    </AbsoluteFill>
  );
};
