// Piezas.tsx — primitivas del montaje VLOG CRUDO de la FÁBRICA (estilo compartido, NO clonar por slug).
// Procedencia: src/tcbriquetas/Piezas.tsx (Taller de Claudio). El build la copia a src/<slug>/Piezas.tsx
// para que el árbol de imports del farm sea autocontenido; la fuente de verdad es ESTE archivo.
// cero componentes. Lo único encima es el CTA: texto + QR opcional. El QR necesita un cuadro quieto
// para poder escanearse, por eso es la ÚNICA composición que sobrevive al vlog crudo.
//
// ⛔⛔ TODO video va con `OffthreadVideo`, NUNCA con `<Video>` (busca por tiempo, repite y saltea
// cuadros de forma irregular = el "se ve lageado").
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#0A0B08";

/** rnd determinista con hash ENTERO. ⛔ `Math.sin(seed*12.9898)` con seeds grandes (el seed es el
 *  cuadro de arranque) pierde precisión y se correlaciona (medido en pinluz: racha 11, 43/57). */
const rnd = (seed: number, salt = 0) => {
  let h = Math.imul(((seed | 0) + salt * 7919) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

/** Ken-Burns por CSS (subpíxel), distinto en CADA plano y al AZAR (regla del creador, todos los
 *  nichos): sentido in/out sorteado, cantidad sorteada, origen sorteado en 30-70 % de los dos ejes y
 *  deriva en cualquier ángulo, atada a la escala para que nunca asome el borde. */
const useKenBurns = (seed: number, intensidad = 1): React.CSSProperties => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const t = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entra = rnd(seed, 1) > 0.5;
  const amp = (0.04 + rnd(seed, 2) * 0.08) * intensidad;
  const ang = rnd(seed, 3) * Math.PI * 2;
  const ox = 30 + rnd(seed, 4) * 40;
  const oy = 30 + rnd(seed, 5) * 40;
  const BASE = 1.045;
  const k = entra ? t : 1 - t;
  const z = BASE + amp * k;
  const margen = Math.min(ox, 100 - ox, oy, 100 - oy) * (BASE - 1);
  const dMax = Math.min(1.4, Math.max(0, margen));
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** CLIP a sangre. ⛔ `loop` NO es prop de OffthreadVideo (se ignora y el clip se CONGELA): va
 *  `<Loop durationInFrames={frames}>` con los cuadros REALES que midió el build. */
export const Clip: React.FC<{ src: string; seed?: number; frames?: number }> = ({ src, seed = 1, frames }) => {
  const t = useKenBurns(seed, 0.45);
  const video = <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns (red de seguridad cuando el clip de agnes no llega o se rechaza). */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

/** PISO del avatar: la PLACA de Claudio en su taller (la misma imagen que animó InfiniteTalk).
 *  Sólo se ve si un plano no llega a su ventana: nunca negro. Push lento, nunca estático. */
export const PlacaPiso: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.03 + Math.sin(f / 900) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

/** VENTANA del avatar (InfiniteTalk, lipsync real de ESA frase). Muteado: el audio sale del máster.
 *  El push es el MISMO que el de la placa (misma fórmula sobre el cuadro GLOBAL), así la entrada y la
 *  salida de la ventana no saltan de escala. */
export const AvatarVentana: React.FC<{ src: string; desde: number }> = ({ src, desde }) => {
  const f = useCurrentFrame() + desde;
  const s = 1.03 + Math.sin(f / 900) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

/** CTA DE CANAL — suscripción + lo que viene. OVERLAY en la esquina inferior, sin tarjeta a pantalla
 *  completa. ⛔ Va en la capa `over`, NUNCA como cue base (en dale1 dejó 13 s de negro). */
export const CtaFinal: React.FC<{ head: string; sub?: string; qr?: string }> = ({ head, sub, qr }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(16, durationInFrames - 10), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a = Math.min(inP, out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 64, bottom: 150, maxWidth: 1600, opacity: a, transform: `translateY(${((1 - inP) * 26).toFixed(1)}px)`, display: "flex", alignItems: "flex-end", gap: 20 }}>
        <div style={{ padding: "18px 30px 20px", background: "rgba(10,11,8,.74)", borderLeft: "6px solid #F2B233" }}>
          <div style={{ fontFamily: "Oswald, Impact, system-ui, sans-serif", fontSize: 72, lineHeight: 1.04, fontWeight: 800, textTransform: "uppercase", color: "#FFFFFF", textShadow: "0 4px 24px rgba(0,0,0,.95)" }}>{head}</div>
          {sub ? <div style={{ fontFamily: "Oswald, Impact, system-ui, sans-serif", fontSize: 42, lineHeight: 1.15, marginTop: 10, color: "#F2B233", textShadow: "0 4px 22px rgba(0,0,0,.95)" }}>{sub}</div> : null}
          </div>
          {qr ? (
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: 14, background: "#FFFFFF", borderLeft: "6px solid #F2B233" }}>
              <Img src={staticFile(qr)} style={{ width: 208, height: 208, display: "block", imageRendering: "pixelated" }} />
            </div>
          ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** APERTURA CON LA MINIATURA (truco del creador, 20-sep-2026): el primer fotograma del video ES la
 *  miniatura, animada apenas por agnes, y al segundo un corte glitch del que sale el presentador
 *  hablando. El que hace clic aterriza en la MISMA imagen que clickeó.
 *  ⛔ Sin Ken-Burns y con `scale(1)` EXACTO en el cuadro 0: cualquier zoom (Clip usa 1,045) rompe el
 *  calce con la miniatura y el truco deja de leerse. El push arranca DESPUÉS del cuadro 0. */
export const AperturaMiniatura: React.FC<{ src?: string; foto?: string; frames?: number }> = ({ src, foto, frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, Math.max(2, durationInFrames)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1 + 0.02 * t).toFixed(4)})` };
  const video = src ? <OffthreadVideo src={staticFile(src)} muted style={st} /> : null;
  // ⛔ El cuadro 0 tiene que ser la miniatura EXACTA, y agnes la re-genera con un leve zoom (medido:
  //    PSNR 20 dB contra la original, misma composición). Por eso la miniatura de verdad va ENCIMA y
  //    se funde al clip en 6 cuadros: el calce es exacto por construcción, no por suerte del modelo.
  const velo = !foto ? 0 : !src ? 1 : interpolate(frame, [4, 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {video && frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
      {foto && velo > 0 ? <Img src={staticFile(foto)} style={{ ...st, position: "absolute", inset: 0, opacity: velo }} /> : null}
    </AbsoluteFill>
  );
};

/** CORTE GLITCH neutro (sin marca): tajadas horizontales que patinan + separación RGB, sube y baja
 *  en `durationInFrames`. Va en la capa `over`, encima del cambio de la miniatura al presentador. */
export const GlitchCut: React.FC<{ durationInFrames?: number }> = ({ durationInFrames = 12 }) => {
  const frame = useCurrentFrame();
  const env = Math.sin(Math.max(0, Math.min(1, frame / durationInFrames)) * Math.PI);
  const SLICES = 9;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,60,60,0.13), transparent 18%, transparent 82%, rgba(80,200,255,0.13))", transform: `translateX(${(env * 10).toFixed(2)}px)`, opacity: env }} />
      {Array.from({ length: SLICES }).map((_, k) => {
        const on = rnd(k + 7, Math.floor(frame / 2)) > 0.45;
        if (!on) return null;
        const dx = (rnd(k, Math.floor(frame / 2)) - 0.5) * 90 * env;
        return (
          <div key={k} style={{
            position: "absolute", left: 0, right: 0, top: `${(k / SLICES) * 100}%`, height: `${100 / SLICES}%`,
            transform: `translateX(${dx.toFixed(2)}px)`, background: k % 2 === 0 ? "rgba(255,255,255,0.07)" : "rgba(80,200,255,0.06)",
            opacity: env,
          }} />
        );
      })}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: env * 0.12 }} />
    </AbsoluteFill>
  );
};

// ── GOLPES: los gráficos del HOOK ────────────────────────────────────────────────────────────────
// Pedido del creador (20-sep-2026): "después de la apertura, edición ultra atrapante, gráficos épicos".
// ⛔ Van en el HOOK y en los golpes, NO sobre el proceso: los 8 ganadores de este molde son cámara
//    fija, manos y CERO gráficos, y el formato crudo es lo que hace que el video calce con su
//    miniatura. Es la misma regla ya validada en Claudio Mendoza: primer minuto ultra agresivo, el
//    resto vlog crudo. Y [[feedback_edicion_limpia_no_sobrecargada]]: LIMPIO gana a denso.
// Todos entran rápido, se plantan y salen; ninguno tapa el cuadro con una placa.
const ROJO = "#E23A2E";
const SANS = '"Archivo Black", "Anton", Impact, system-ui, sans-serif';

/** entra de golpe (0-5), se planta, sale (últimos 6 cuadros) */
const useGolpe = (dur: number) => {
  const f = useCurrentFrame();
  const entra = interpolate(f, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sale = interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { f, op: Math.min(entra, sale), k: entra };
};
const SOMBRA = "0 6px 28px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.9)";

/** NÚMERO gigante que cae de golpe (temperaturas, litros, pesos, "3 vueltas"). */
export const NumeroGolpe: React.FC<{ n: string; sub?: string; dur: number }> = ({ n, sub, dur }) => {
  const { op, k } = useGolpe(dur);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{ transform: `scale(${(0.82 + 0.18 * k).toFixed(3)})`, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontSize: 250, lineHeight: 0.9, color: "#fff", textShadow: SOMBRA, letterSpacing: -6 }}>{n}</div>
        {sub ? <div style={{ fontFamily: SANS, fontSize: 64, color: ROJO, textShadow: SOMBRA, letterSpacing: 2, marginTop: 6 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/** SELLO estampado en diagonal ("NO LO TIRES", "OJO ACÁ"). Máximo 4 palabras. */
export const SelloGolpe: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const { op, k } = useGolpe(dur);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{
        transform: `rotate(-7deg) scale(${(1.25 - 0.25 * k).toFixed(3)})`, background: ROJO, color: "#fff",
        fontFamily: SANS, fontSize: 96, padding: "14px 44px", letterSpacing: 1, boxShadow: SOMBRA,
      }}>{texto.toUpperCase()}</div>
    </AbsoluteFill>
  );
};

/** ETIQUETA de esquina con barra roja: nombra el material o el paso sin tapar la acción. */
export const EtiquetaGolpe: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const { op, k } = useGolpe(dur);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: 96, bottom: 110, display: "flex", alignItems: "stretch", transform: `translateX(${((1 - k) * -40).toFixed(1)}px)` }}>
        <div style={{ width: 12, background: ROJO }} />
        <div style={{ background: "rgba(10,11,8,0.82)", color: "#fff", fontFamily: SANS, fontSize: 54, padding: "10px 26px", letterSpacing: 1 }}>{texto.toUpperCase()}</div>
      </div>
    </AbsoluteFill>
  );
};

/** FRASE golpe palabra por palabra en el tercio inferior. Máximo 8 palabras. */
export const FraseGolpe: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const { f, op } = useGolpe(dur);
  const pal = texto.toUpperCase().split(/\s+/).filter(Boolean);
  const porPal = Math.max(2, Math.floor((dur * 0.55) / Math.max(1, pal.length)));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 120, opacity: op }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 18px", justifyContent: "center", maxWidth: 1500 }}>
        {pal.map((p, i) => (
          <span key={i} style={{
            fontFamily: SANS, fontSize: 72, color: i === pal.length - 1 ? ROJO : "#fff", textShadow: SOMBRA,
            opacity: f >= i * porPal ? 1 : 0, transform: `translateY(${f >= i * porPal ? 0 : 14}px)`,
          }}>{p}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** MAPA de golpes: el cue trae `kind` y el build no importa cada componente por su nombre.
 *  ⛔ Si un kind no está acá llegaría `undefined` y React tira el #130 sin decir cuál: se avisa. */
export const Golpe: React.FC<{ kind: string; props: any; dur: number }> = ({ kind, props, dur }) => {
  const M: Record<string, React.FC<any>> = { numero: NumeroGolpe, sello: SelloGolpe, etiqueta: EtiquetaGolpe, frase: FraseGolpe };
  const C = M[kind];
  if (!C) return null;
  return <C {...props} dur={dur} />;
};
