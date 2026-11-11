import React from "react";
import { AbsoluteFill, Img, interpolate, Easing, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PermanentMarker";

const { fontFamily: MARKER } = loadFont();
const W = 1920, H = 1080;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.45, 0, 0.2, 1);

// cámara continua: centro (cx, cy) y escala s, sin dejar bordes vacíos
const cam = (cx: number, cy: number, s: number): React.CSSProperties => {
  const L = Math.min(0, Math.max(W - W * s, W / 2 - cx * s));
  const T = Math.min(0, Math.max(H - H * s, H / 2 - cy * s));
  return { position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${L}px, ${T}px) scale(${s})` };
};
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "fill" };

// ─────────────────────────────────────────────────────────────
// Escena 1 · g0320 · "Never more than two on one outlet, and never on the same plug as the coffee urn."
// Una tercera olla (recorte de la olla izquierda) entra por el frente de la mesada buscando enchufe;
// la foto entera parpadea dos veces como un bajón de luz; la intrusa se va; la cámara sigue hasta la cafetera.
const OLLA = "195px 518px,210px 503px,300px 477px,368px 468px,375px 447px,447px 447px,453px 468px,540px 477px,608px 503px,615px 558px,648px 564px,648px 593px,608px 600px,600px 705px,570px 750px,450px 768px,300px 765px,248px 743px,225px 705px,222px 593px,177px 588px,172px 567px,203px 558px";
export const EscIntrusa: React.FC<{ dur: number; src?: string; fIn?: number; fOut?: number; fUrn?: number }> = ({ dur, src = "ck11b/g/g0320.png", fIn = 42, fOut = 84, fUrn = 100 }) => {
  const f = useCurrentFrame();
  // intrusa: entra (fIn→fIn+24), queda, parpadeo, se retira (fOut→fOut+20)
  const tx = f < fOut
    ? interpolate(f, [fIn, fIn + 24], [-900, 150], { ...cl, easing: Easing.out(Easing.cubic) })
    : interpolate(f, [fOut, fOut + 20], [150, -900], { ...cl, easing: Easing.in(Easing.cubic) });
  const showI = f >= fIn && f < fOut + 20;
  // bajón de luz: dos parpadeos apenas la intrusa se asienta
  const b0 = fIn + 26, b1 = fIn + 34;
  const dip = (a: number) => interpolate(f, [a, a + 2, a + 4, a + 6], [1, 0.32, 0.38, 1], cl);
  const luz = Math.min(dip(b0), dip(b1));
  // cámara: leve acercamiento al enchufe, después viaje hasta la cafetera
  const s = interpolate(f, [0, fUrn, fUrn + 60, dur], [1.0, 1.05, 1.55, 1.6], { ...cl, easing: ease });
  const cx = interpolate(f, [0, fUrn, fUrn + 60], [780, 820, 1518], { ...cl, easing: ease });
  const cy = interpolate(f, [0, fUrn, fUrn + 60], [400, 470, 520], { ...cl, easing: ease });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...cam(cx, cy, s), filter: `brightness(${luz})` }}>
        <Img src={staticFile(src)} style={full} />
        {showI && (
          <div style={{ ...full, transformOrigin: "410px 610px", transform: `translate(${tx}px, 230px) scale(1.12)`, filter: "drop-shadow(0 26px 22px rgba(0,0,0,0.45))" }}>
            <Img src={staticFile(src)} style={{ ...full, clipPath: `polygon(${OLLA})` }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Escena 2 · g0400 · "The other three belong to Bernice, to Dorothy, and to the church closet."
// Una sola cámara viaja de cinta en cinta y el nombre de cada dueña se escribe con marcador sobre la cinta real, en su palabra.
const CINTAS = [
  { x0: 190, x1: 368, y0: 592, y1: 615, txt: "BERNICE", rot: -0.6 },
  { x0: 790, x1: 972, y0: 582, y1: 603, txt: "DOROTHY", rot: -0.4 },
  { x0: 1302, x1: 1495, y0: 570, y1: 594, txt: "CHURCH CLOSET", rot: -0.8 },
];
export const EscCintas: React.FC<{ dur: number; src?: string; w?: number[] }> = ({ dur, src = "ck11b/g/g0400.png", w = [42, 68, 104] }) => {
  const f = useCurrentFrame();
  const c = CINTAS.map((t) => [(t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2]);
  // claves de cámara: llega a cada cinta 6 cuadros antes de su palabra; al final se abre para ver las tres
  const k = [0, w[0] - 6, w[0] + 16, w[1] - 6, w[1] + 18, w[2] - 6, w[2] + 22, dur];
  const xs = [960, c[0][0], c[0][0], c[1][0], c[1][0], c[2][0], c[2][0], 900];
  const ys = [640, c[0][1], c[0][1], c[1][1], c[1][1], c[2][1], c[2][1], 640];
  const ss = [1.15, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 1.12];
  const o = { ...cl, easing: ease };
  const cx = interpolate(f, k, xs, o), cy = interpolate(f, k, ys, o), s = interpolate(f, k, ss, o);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={full} />
        {CINTAS.map((t, i) => {
          if (f < w[i]) return null;
          const wTape = t.x1 - t.x0, h = t.y1 - t.y0;
          const len = t.txt.length;
          const p = interpolate(f, [w[i], w[i] + 4 + len * 1.6], [0, 100], cl); // trazo de izquierda a derecha
          const fs = Math.min(h * 0.92, (wTape * 0.9) / (len * 0.62));
          return (
            <div key={i} style={{ position: "absolute", left: t.x0, top: t.y0, width: wTape, height: h, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${t.rot}deg)`, clipPath: `inset(0 ${100 - p}% 0 0)` }}>
              <span style={{ fontFamily: MARKER, fontSize: fs, lineHeight: 1, color: "#1b1b1f", opacity: 0.88, mixBlendMode: "multiply", letterSpacing: 0.4, whiteSpace: "nowrap" }}>{t.txt}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
