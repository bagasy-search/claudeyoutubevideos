// Escenas sobre las fotos reales de cl19e (ideas en D:/rtmp/cl19e/ideas.md). Solo DOM/CSS, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const FPS = 30;
const P = (n: string) => staticFile(`cl19e/g/${n}.png`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const poly = (pts: number[][]) => `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(",")})`;

// ── Escena 1 · contraluz por los poros (g2070) ───────────────────────────
// t0 = 864.41 s. "bates" +0.48 · "aire" +1.36 · "crece" +2.70 · "mezcla" +3.22 · fin +4.26
const BLQ_IZQ = poly([[44, 448], [62, 422], [180, 416], [300, 410], [420, 405], [440, 430], [446, 470], [448, 560], [448, 650], [436, 742], [300, 750], [160, 756], [80, 758], [50, 720], [44, 600], [42, 520]]);
const BLQ_MED = poly([[530, 432], [536, 404], [640, 398], [760, 392], [866, 388], [876, 420], [879, 500], [879, 600], [874, 664], [840, 684], [720, 688], [600, 693], [540, 676], [528, 600], [526, 520]]);
const BLQ_DER = poly([[992, 380], [1010, 352], [1060, 336], [1130, 324], [1200, 316], [1222, 330], [1226, 400], [1228, 470], [1236, 540], [1236, 596], [1160, 606], [1060, 612], [1004, 598], [990, 540], [988, 460]]);
// cada bloque: [contorno, momento en que se enciende (s), brillo final]
const POROS: [string, number, number][] = [[BLQ_IZQ, 1.30, 0.38], [BLQ_MED, 2.62, 0.72], [BLQ_DER, 3.16, 1.0]];

export const Poros: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const apaga = interpolate(t, [0.25, 1.1], [1, 0.42], { ...cl, easing: ease });
  // cámara: un solo paseo de izquierda a derecha, siguiendo el orden en que se encienden
  const k = interpolate(t, [0, 4.26], [0, 1], { ...cl, easing: Easing.inOut(Easing.sin) });
  const cam: React.CSSProperties = { transform: `translateX(${3.2 - 6.4 * k}%) scale(${1.1 + 0.03 * k})`, transformOrigin: "50% 55%" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120d09" }}>
      <AbsoluteFill style={cam}>
        <Img src={P("g2070")} style={{ ...full, filter: `brightness(${apaga}) saturate(${0.6 + 0.4 * apaga})` }} />
        {POROS.map(([cp, at, top], i) => {
          const g = interpolate(t, [at, at + 0.55], [0, top], { ...cl, easing: ease });
          if (g <= 0) return null;
          return (
            <React.Fragment key={i}>
              {/* el bloque vuelve a su luz real */}
              <Img src={P("g2070")} style={{ ...full, clipPath: cp, opacity: Math.min(1, g * 1.4), filter: "brightness(0.9)" }} />
              {/* sus agujeros reales dejan pasar luz: lo oscuro de los poros se invierte en luz cálida */}
              <Img src={P("g2070")} style={{ ...full, clipPath: cp, mixBlendMode: "screen", opacity: 0.32 * g, filter: "invert(1) contrast(1.6) brightness(0.7) sepia(0.6) saturate(1.3)" }} />
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 3 · espejismo de calor dentro de la caja (e_cajafoco) ────────
// t0 = 1478.12 s. "adentro" +1.64 · "foco" +2.58 · "calientan" +4.62 · fin +5.68
const HUECO = { x0: 735, x1: 1225, y0: 515, y1: 830 };
const FRANJAS = 35;
export const CajaCalor: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  // cámara: quieta hasta "adentro", después se acerca en curva al foco
  const k = interpolate(t, [1.64, 5.68], [0, 1], { ...cl, easing: Easing.inOut(Easing.sin) });
  const cam: React.CSSProperties = { transform: `scale(${1.04 + 0.1 * k}) translate(${-1.2 * k}%, ${-0.8 * k}%)`, transformOrigin: "1148px 600px" };
  // el aire empieza a ondular en "calientan", más fuerte cerca del foco
  const amp = interpolate(t, [4.62, 5.1], [0, 1], { ...cl, easing: ease });
  const h = (HUECO.y1 - HUECO.y0) / FRANJAS;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1a120c" }}>
      <AbsoluteFill style={cam}>
        <Img src={P("e_cajafoco")} style={full} />
        {amp > 0 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(${HUECO.y0}px ${1920 - HUECO.x1}px ${1080 - HUECO.y1}px ${HUECO.x0}px)` }}>
            {Array.from({ length: FRANJAS }, (_, i) => {
              const y = HUECO.y0 + i * h;
              const cerca = 1 - Math.min(1, Math.abs(y - 600) / 260);
              const dx = amp * (4 + 9 * cerca) * Math.sin(t * 9.5 + i * 0.62) + amp * 2.5 * Math.sin(t * 4.1 - i * 0.31);
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: y, width: 1920, height: h + 1, overflow: "hidden" }}>
                  <Img src={P("e_cajafoco")} style={{ ...full, top: -y, transform: `translateX(${dx}px)` }} />
                </div>
              );
            })}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 2 · la mezcla real sube hasta cada raya del balde (e_balde3b) ─
// t0 = 933.37 s. "abajo" +3.08 · "fuerte" +3.70 · "medio" +4.88 · "bloque" +5.76 · "arriba" +6.84 · "aislante" +7.68 · fin +8.64
const NIVELES: [number, number, number][] = [[3.08, 3.7, 604], [4.88, 5.76, 414], [6.84, 7.68, 184]]; // [empieza, llega, y de la raya]
const MEZCLA = { x: 335, y: 776, w: 724, h: 230 }; // superficie real de la mezcla en e_cremosa
export const BaldeRayas: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  let nivel = 900; let llego = -1;
  for (const [a, b, y] of NIVELES) {
    if (t >= a) { nivel = interpolate(t, [a, b], [nivel, y], { ...cl, easing: Easing.out(Easing.cubic) }); if (t >= b) llego = b; }
  }
  const tiembla = llego > 0 ? 3 * Math.exp(-(t - llego) * 2.2) * Math.sin((t - llego) * 16) : 0;
  const y = nivel + tiembla;
  const k = interpolate(t, [0, 8.64], [0, 1], { ...cl, easing: Easing.inOut(Easing.sin) });
  const cam: React.CSSProperties = { transform: `scale(${1.05 + 0.05 * k}) translateY(${1.5 - 3 * k}%)`, transformOrigin: "875px 430px" };
  // la textura de la mezcla, estirada para cubrir el interior del balde
  const sx = 900 / MEZCLA.w, sy = 900 / MEZCLA.h;
  const mezcla: React.CSSProperties = { position: "absolute", left: 440 - MEZCLA.x * sx, top: -MEZCLA.y * sy, width: 1920 * sx, height: 1080 * sy, objectFit: "fill", filter: "brightness(1.05)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a211a" }}>
      <AbsoluteFill style={cam}>
        <Img src={P("e_balde3b")} style={full} />
        {y < 880 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "ellipse(428px 440px at 875px 425px)" }}>
            <div style={{ position: "absolute", left: 0, top: y, width: 1920, height: 1080 - y, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: -y + (y - 184) * 0.15, width: 1920, height: 1080 }}>
                <Img src={P("e_cremosa")} style={mezcla} />
              </div>
              {/* borde de la superficie: la misma mezcla, un poco más oscura, como el menisco contra el plástico */}
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 14, overflow: "hidden", filter: "brightness(0.78)" }}>
                <Img src={P("e_cremosa")} style={{ ...mezcla, top: mezcla.top as number - 40 }} />
              </div>
            </div>
          </div>
        )}
        {/* las rayas reales quedan por encima de la mezcla: se ven a través, como marcadas en el plástico */}
        {NIVELES.map(([, , ly], i) => (
          <Img key={i} src={P("e_balde3b")} style={{ ...full, clipPath: `inset(${ly - 30}px 820px ${1080 - ly - 30}px 660px)`, mixBlendMode: "darken", opacity: y < ly + 20 ? 1 : 0 }} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
