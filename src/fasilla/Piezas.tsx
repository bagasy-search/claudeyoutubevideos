// Piezas.tsx — primitivas del video `faarroz` (Federer Archivos · VLOG CASERO).
// Escritas para ESTE video a propósito: el kit compartido tiene ~190 componentes cuyos contratos de
// props ya costaron varios renders (un componente que se ve LLENO y está vacío pasa todas las
// compuertas). Acá no hay contrato que adivinar.
//
// ⛔ OffthreadVideo, NUNCA <Video>: en el render `<Video>` busca por TIEMPO y devuelve cuadros
//    equivocados de forma irregular. Es la causa #1 del "se ve todo lageado".
import React from "react";
import {
  AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";

// hash entero determinista. ⛔ NUNCA Math.random (el farm rinde en 60 chunks y cada uno tiene que
// dar lo MISMO), y ⛔ nunca el truco de Math.sin(seed*12.9898): con seeds grandes pierde precisión
// y se correlaciona (medido: racha de 11 y reparto 43/57 donde el azar justo da 8 y 47/53).
const rnd = (a: number, b: number) => {
  let x = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (b | 0) ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};

/**
 * Ken-Burns con TODO sorteado por plano: sentido, cantidad, foco y deriva.
 * ⛔ Regla dura del creador, cross-nicho: "todos los zooms en imágenes son IDÉNTICOS, algunos deben
 *    ser zoom out no todos zoom in hacia el centro, y AL AZAR — no siempre out luego in luego out
 *    perfecto sino al azar". Alternar prolijito es tan mecánico como que sean todos iguales.
 * ⛔ Y el paneo va atado a la ESCALA, no al tiempo, para que nunca asome el fondo.
 */
const useKenBurns = (seed: number, piso: number, ampMin: number, ampMax: number, pan: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r = (o: number) => rnd(seed, o);
  const amp = (ampMin + (ampMax - ampMin) * r(7)) / 100;
  const acerca = r(2) > 0.5;
  const lo = piso, hi = piso + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 32 + 36 * r(13), oy = 32 + 36 * r(21);
  // margen disponible al zoom MÁS CHICO; la deriva nunca puede pasarlo
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(pan, Math.max(0, techo));
  const ang = r(31) * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    width: "100%", height: "100%", objectFit: "cover" as const,
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
    <Img src={staticFile(src)} style={useKenBurns(seed, 1.06, 3, 9, 1.3)} />
  </AbsoluteFill>
);

/**
 * ⛔ `loop` NO es una prop de OffthreadVideo: compila, renderiza y se ignora en silencio, y el
 *    último cuadro se CONGELA el resto del slot. Va <Loop> con los cuadros REALES del archivo.
 * ⛔ `speed` por defecto en el kit es 0.6 (cámara lenta + judder). Acá no hay speed: se reproduce 1:1.
 */
export const Clip: React.FC<{ src: string; seed: number; frames: number }> = ({ src, seed, frames }) => {
  const est = useKenBurns(seed, 1.03, 1.5, 4, 0.6);
  const v = <OffthreadVideo src={staticFile(src)} muted style={est} />;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      {frames > 1 ? <Loop durationInFrames={frames}>{v}</Loop> : v}
    </AbsoluteFill>
  );
};

// ── paleta, la misma de la lámina ────────────────────────────────────────────────
const CREMA = "#F6F1E3", VERDE = "#1E3D24", AMBAR = "#E8A93C", TINTA = "#23261F";
const SOMBRA = "0 3px 10px rgba(0,0,0,.55), 0 6px 34px rgba(0,0,0,.7)";

// entrada/salida suaves. `sinSalida` para el cierre: el fade de salida del último componente se
// come el CTA y lo entrega a medio transparente justo en el cuadro que más importa.
const useBeat = (sinSalida?: boolean) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const inn = interpolate(f, [-1, 0, 8], [0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = sinSalida ? 1 : interpolate(f, [d - 9, d], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(inn, out);
};

// ⛔ El velo NUNCA baja su opacity (backdrop-filter se anula si un ancestro tiene opacity<1): lo que
//    se anima es el alfa del color. Y 0,80 de alfa deja el b-roll en NEGRO: 0,58 es el máximo.
const Velo: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (
  <AbsoluteFill style={{ backgroundColor: `rgba(20,18,15,${(0.58 * o).toFixed(3)})`, backdropFilter: `blur(${(12 * o).toFixed(1)}px) saturate(0.72)` }}>
    {children}
  </AbsoluteFill>
);

/** Rótulo inferior: overlay puro, no tapa el b-roll ni le roba tiempo a nadie. */
export const Rotulo: React.FC<{ titulo: string; sub?: string }> = ({ titulo, sub }) => {
  const o = useBeat();
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 96px 88px", opacity: o }}>
      <div style={{ borderLeft: `10px solid ${AMBAR}`, padding: "14px 30px", backgroundColor: "rgba(20,18,15,0.50)", maxWidth: 1180 }}>
        <div style={{ font: "700 54px/1.12 Inter, system-ui, sans-serif", color: CREMA, textShadow: SOMBRA }}>{titulo}</div>
        {sub ? <div style={{ font: "500 34px/1.25 Inter, system-ui, sans-serif", color: "#E6DFCC", marginTop: 8, textShadow: SOMBRA }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/** Una cifra grande y su unidad. Para los datos duros (1 g/kg, 6 g el huevo, 40 grados). */
export const Cifra: React.FC<{ cifra: string; unidad?: string; pie?: string }> = ({ cifra, unidad, pie }) => {
  const o = useBeat();
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Velo o={o}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <div style={{ font: "800 260px/0.92 Inter, system-ui, sans-serif", color: AMBAR, textShadow: SOMBRA }}>{cifra}</div>
            {unidad ? <div style={{ font: "700 84px/1 Inter, system-ui, sans-serif", color: CREMA, textShadow: SOMBRA }}>{unidad}</div> : null}
          </div>
          {pie ? <div style={{ font: "500 44px/1.3 Inter, system-ui, sans-serif", color: CREMA, marginTop: 26, maxWidth: 1250, textAlign: "center", textShadow: SOMBRA }}>{pie}</div> : null}
        </AbsoluteFill>
      </Velo>
    </AbsoluteFill>
  );
};

/** Dos lados enfrentados (grupo 1 / grupo 2 · integral / blanco · fábrica / destrucción). */
export const Compara: React.FC<{ izqT: string; izq: string; derT: string; der: string }> = ({ izqT, izq, derT, der }) => {
  const o = useBeat();
  const col = (t: string, s: string, c: string) => (
    <div style={{ flex: 1, padding: "0 56px", textAlign: "center" }}>
      <div style={{ font: "800 64px/1.1 Inter, system-ui, sans-serif", color: c, textShadow: SOMBRA }}>{t}</div>
      <div style={{ font: "500 42px/1.32 Inter, system-ui, sans-serif", color: CREMA, marginTop: 22, textShadow: SOMBRA }}>{s}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Velo o={o}>
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center" }}>
          {col(izqT, izq, AMBAR)}
          <div style={{ width: 4, height: "46%", backgroundColor: "rgba(246,241,227,0.35)" }} />
          {col(derT, der, CREMA)}
        </AbsoluteFill>
      </Velo>
    </AbsoluteFill>
  );
};

/** Línea de tiempo horizontal: los hitos aparecen escalonados, escalados AL HUECO REAL. */
export const Linea: React.FC<{ hitos: { etiqueta: string; nota: string }[]; titulo?: string }> = ({ hitos, titulo }) => {
  const o = useBeat();
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  // ⛔ Los staggers FIJOS hacen que en un momento corto el componente se vea a medio dibujar y
  //    ninguna compuerta lo ve. El escalonado se escala al hueco: todo aparece antes del 62%.
  const paso = Math.max(2, Math.floor((d * 0.62) / Math.max(1, hitos.length)));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Velo o={o}>
        <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px" }}>
          {titulo ? <div style={{ font: "800 58px/1.1 Inter, system-ui, sans-serif", color: CREMA, marginBottom: 46, textShadow: SOMBRA }}>{titulo}</div> : null}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            {hitos.map((h, i) => {
              const a = interpolate(f, [i * paso, i * paso + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{ flex: 1, opacity: a, transform: `translateY(${((1 - a) * 16).toFixed(1)}px)` }}>
                  <div style={{ height: 8, backgroundColor: AMBAR, borderRadius: 4 }} />
                  <div style={{ font: "800 40px/1.15 Inter, system-ui, sans-serif", color: AMBAR, marginTop: 20, textShadow: SOMBRA }}>{h.etiqueta}</div>
                  <div style={{ font: "500 32px/1.28 Inter, system-ui, sans-serif", color: CREMA, marginTop: 10, textShadow: SOMBRA }}>{h.nota}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Velo>
    </AbsoluteFill>
  );
};

/** Lista de ítems (los 3 errores, las señales de alarma, lo que NO hace). */
export const Lista: React.FC<{ titulo: string; items: string[]; tono?: "neutro" | "alerta" }> = ({ titulo, items, tono }) => {
  const o = useBeat();
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const paso = Math.max(2, Math.floor((d * 0.6) / Math.max(1, items.length)));
  const acento = tono === "alerta" ? AMBAR : VERDE;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Velo o={o}>
        <AbsoluteFill style={{ justifyContent: "center", padding: "0 140px" }}>
          <div style={{ font: "800 62px/1.12 Inter, system-ui, sans-serif", color: CREMA, textShadow: SOMBRA }}>{titulo}</div>
          <div style={{ width: 190, height: 7, backgroundColor: AMBAR, margin: "26px 0 40px" }} />
          {items.map((t, i) => {
            const a = interpolate(f, [i * paso, i * paso + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ display: "flex", gap: 26, alignItems: "flex-start", marginBottom: 26, opacity: a, transform: `translateX(${((1 - a) * -18).toFixed(1)}px)` }}>
                <div style={{ width: 26, height: 26, marginTop: 14, backgroundColor: AMBAR, borderRadius: 5, border: `3px solid ${acento}` }} />
                <div style={{ font: "600 46px/1.3 Inter, system-ui, sans-serif", color: CREMA, textShadow: SOMBRA, flex: 1 }}>{t}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      </Velo>
    </AbsoluteFill>
  );
};

/** Aviso corto y fuerte ("escuche esto bien"). Overlay, sin velo: no tapa lo que se está viendo. */
export const Aviso: React.FC<{ texto: string }> = ({ texto }) => {
  const o = useBeat();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ backgroundColor: AMBAR, padding: "26px 64px", transform: `scale(${(0.97 + 0.03 * o).toFixed(3)})` }}>
        <div style={{ font: "800 76px/1.06 Inter, system-ui, sans-serif", color: TINTA, letterSpacing: "0.01em" }}>{texto}</div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * CTA. ⛔ Vive en la capa `over`, NUNCA adentro de un componente de escena (en otro video el QR se
 * fue con el componente al cambiar el montaje y el video se entregó sin CTA, con todas las
 * compuertas en verde). Y el QR se dibuja en un slot CUADRADO: el `objectFit:cover` de un slot
 * rectangular le come filas de módulos y deja de decodificar aunque se vea nítido.
 */
export const Cta: React.FC<{ qr: string; dominio: string; sinSalida?: boolean }> = ({ qr, dominio, sinSalida }) => {
  const o = useBeat(sinSalida);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Velo o={o}>
        <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 74 }}>
          <div style={{ width: 460, height: 460, backgroundColor: "#FFFFFF", padding: 26, borderRadius: 18, display: "flex" }}>
            <Img src={staticFile(qr)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ maxWidth: 760 }}>
            <div style={{ font: "800 74px/1.1 Inter, system-ui, sans-serif", color: CREMA, textShadow: SOMBRA }}>La guía completa</div>
            <div style={{ font: "500 44px/1.3 Inter, system-ui, sans-serif", color: "#E6DFCC", marginTop: 22, textShadow: SOMBRA }}>
              Esta hoja es una de sus páginas.
            </div>
            <div style={{ font: "700 52px/1.2 Inter, system-ui, sans-serif", color: AMBAR, marginTop: 34, textShadow: SOMBRA }}>{dominio}</div>
            <div style={{ font: "500 36px/1.3 Inter, system-ui, sans-serif", color: "#D9D2BE", marginTop: 14, textShadow: SOMBRA }}>
              En el televisor, escanee el código. En el teléfono, el enlace está abajo.
            </div>
          </div>
        </AbsoluteFill>
      </Velo>
    </AbsoluteFill>
  );
};
