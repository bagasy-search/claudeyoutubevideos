// Escenas sobre fotos · swl11a (ideas.md en D:/rtmp/swl11a). Cada una con un truco distinto, hechas con la foto real.
// Fotos a pantalla completa 1920x1080 con objectFit 'fill' (coordenadas exactas de la rejilla).
//
// 1 EscMonedas (siete.png) · LA IDEA: cada plato nombrado se da vuelta como una moneda y en el reverso queda su precio.
//   MATERIAL: siete.png. CAPAS: foto base; por plato, un disco recortado (clip-path polygon 24 puntos, 6 px hacia adentro)
//   con dos caras (frente = la loza; reverso = la misma loza tapada en tinta oscura con aro dorado y el precio).
//   ELEMENTOS: pavo 720,300 r225 · relleno 1080,240 r135 · arándanos 960,540 r120 · tarta 1275,810 r150 ·
//   batata 915,885 r180 · chauchas 555,705 r225 · puré 1350,465 r190.
//   TIEMPO: giro de 16 cuadros que arranca 3 cuadros antes de la palabra; la moneda queda. CÁMARA: escala 1.04→1.10 con el
//   centro corriéndose 25 % hacia el plato que se nombra (sigue el orden de la cuenta). PROHIBIDO: marcos, dibujos, otras fotos.
//   SONIDO: el ambiente de la mezcla, nada extra.
// 2 EscAceituna (relish.png → olivas.png) · LA IDEA: la aceituna de la fuente es la misma forma que la aceituna de la yema.
//   CÁMARA: pepinillos 490,560 → aceitunas 1020,560 → apio 1470,450 (a cada palabra), luego entra en la aceituna 900,555 (r45)
//   hasta que su negro llena el centro (escala 16, interpolada en log). Cambio a olivas.png a la misma escala aparente:
//   la aceituna 1110,457 (r65) queda en el mismo lugar y del mismo tamaño; la cámara sale hasta escala 1.04 con la mano entera.
//   Los bordes: el traslado se limita para que la foto cubra siempre el cuadro.
// 3 EscPorche (ent1955.png + ent_hoy.png) · LA IDEA: una sola tira alta; las tablas del porche (abajo de 1955) siguen en la
//   madera de la mesa (arriba de hoy). ent_hoy va 300 px solapada debajo, con máscara en degradé en sus primeros 300 px.
//   CÁMARA: escala 1.12 sobre la madre (760,470) → baja por las tablas → manos de Loretta (900,520 de hoy = 900,1300 en la tira).
//   El viaje empieza 1,4 s antes del final de la frase de la madre y dura 2,6 s. Texto: dos renglones a mano, chicos.
// 4 EscEscarcha (freezerlist.png + g5900.png) · LA IDEA: la escarcha crece desde el fondo del freezer y tapa las etiquetas;
//   la textura es la del pote de g5900. Máscara: 5 manchas radiales que crecen con desfase desde 1460,620.
//   CÁMARA: 1.0 centrada 1100,540 → 1.75 sobre 1470,600. Al final, g5900 entra a la misma escala aparente y abre a 1.02.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Kalam";

const { fontFamily: MANO } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const CLX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = (t: number) => Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, t)));
const FOTO: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// cámara: punto (px,py) de la foto al centro del cuadro, escala s; limita para no dejar bordes
const camara = (px: number, py: number, s: number, W = 1920, H = 1080) => {
  let tx = 960 - px * s, ty = 540 - py * s;
  tx = Math.min(0, Math.max(1920 - W * s, tx));
  ty = Math.min(0, Math.max(1080 - H * s, ty));
  return { transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" } as React.CSSProperties;
};
const circulo = (cx: number, cy: number, r: number, n = 24) =>
  `polygon(${Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `${(cx + Math.cos(a) * r).toFixed(1)}px ${(cy + Math.sin(a) * r).toFixed(1)}px`; }).join(", ")})`;

// ---------------- 1 · monedas
const PLATOS = [
  { cx: 720, cy: 300, r: 225 }, { cx: 1080, cy: 240, r: 135 }, { cx: 960, cy: 540, r: 120 }, { cx: 1275, cy: 810, r: 150 },
  { cx: 915, cy: 885, r: 180 }, { cx: 555, cy: 705, r: 225 }, { cx: 1350, cy: 465, r: 190 },
];
export const EscMonedas: React.FC<{ src: string; marks: number[]; prices: string[]; dur: number }> = ({ src, marks, prices, dur }) => {
  const f = useCurrentFrame();
  const act = marks.reduce((a, m, i) => (f >= m - 6 ? i : a), -1);
  const foco = act >= 0 ? PLATOS[act] : { cx: 960, cy: 560 };
  const k = suave(f / Math.max(1, dur));
  const s = 1.04 + 0.06 * k;
  // centro de cámara: se corre hacia el plato activo, suavizado entre marcas
  const mix = (i: number) => (i < 0 ? { x: 960, y: 560 } : { x: 960 + (PLATOS[i].cx - 960) * 0.25, y: 560 + (PLATOS[i].cy - 560) * 0.25 });
  const t0 = act >= 0 ? marks[act] - 6 : 0;
  const a = mix(act - 1), b = mix(act), w = suave((f - t0) / 24);
  const px = a.x + (b.x - a.x) * w, py = a.y + (b.y - a.y) * w;
  void foco;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={camara(px, py, s)}>
        <Img src={staticFile(src)} style={FOTO} />
        {PLATOS.map((p, i) => {
          const g = interpolate(f, [marks[i] - 3, marks[i] + 13], [0, 180], { ...CLX, easing: Easing.inOut(Easing.quad) });
          if (g <= 0) return null;
          const lift = Math.sin((g / 180) * Math.PI) * 0.12;
          const clip = circulo(p.cx, p.cy, p.r - 6);
          const cara: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: clip, backfaceVisibility: "hidden" };
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformStyle: "preserve-3d", transformOrigin: `${p.cx}px ${p.cy}px`,
              transform: `perspective(1600px) rotateY(${g}deg) scale(${1 + lift})`, filter: `drop-shadow(0 ${10 + lift * 120}px ${14 + lift * 80}px rgba(0,0,0,0.5))` }}>
              <div style={cara}><Img src={staticFile(src)} style={FOTO} /></div>
              <div style={{ ...cara, transform: "rotateY(180deg)", transformOrigin: `${p.cx}px ${p.cy}px` }}>
                <Img src={staticFile(src)} style={FOTO} />
                <div style={{ position: "absolute", left: p.cx - p.r, top: p.cy - p.r, width: p.r * 2, height: p.r * 2, borderRadius: "50%", background: "rgba(34,24,14,0.80)", boxShadow: `inset 0 0 0 ${Math.max(6, p.r * 0.06)}px rgba(214,170,84,0.95)`,
                  display: "flex", alignItems: "center", justifyContent: "center", transform: "scaleX(-1)" }}>
                  <span style={{ fontFamily: MANO, fontWeight: 700, fontSize: Math.max(54, p.r * 0.62), color: "#F1CF7E", lineHeight: 1 }}>{prices[i]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- 2 · aceituna
export const EscAceituna: React.FC<{ a: string; b: string; fOl: number; fCel: number; fIn: number; fSwap: number; dur: number }> = ({ a, b, fOl, fCel, fIn, fSwap, dur }) => {
  const f = useCurrentFrame();
  const OA = { x: 900, y: 555, r: 45 }, OB = { x: 1110, y: 457, r: 65 };
  // tramo 1: recorrido por la fuente (escala 1.25)
  const p1 = suave((f - (fOl - 8)) / 18), p2 = suave((f - (fCel - 8)) / 18), p3 = suave((f - (fIn - 6)) / 16);
  let x = 490 + (1020 - 490) * p1 + (1470 - 1020) * p2, y = 560 + (450 - 560) * p2;
  x = x + (OA.x - x) * p3; y = y + (OA.y - y) * p3;
  // entrada en la aceituna: escala en log desde 1.25 hasta 16 al llegar a fSwap
  const kin = Math.max(0, Math.min(1, (f - fIn) / Math.max(1, fSwap - fIn)));
  const sPre = 1.25 + 0.08 * Math.min(1, f / Math.max(1, fIn));
  const sA = Math.exp(Math.log(1.33) + (Math.log(16) - Math.log(1.33)) * Easing.in(Easing.quad)(kin));
  // olivas: arranca con la misma escala aparente y abre hasta 1.04
  const sB0 = 16 * (OA.r / OB.r);
  const kout = Math.max(0, Math.min(1, (f - fSwap) / Math.max(1, Math.min(dur - fSwap - 10, 70))));
  const sB = Math.exp(Math.log(sB0) + (Math.log(1.04) - Math.log(sB0)) * Easing.out(Easing.cubic)(kout));
  const bx = OB.x + (960 - OB.x) * Easing.out(Easing.cubic)(kout) * 0.4, by = OB.y + (540 - OB.y) * Easing.out(Easing.cubic)(kout) * 0.4;
  const op = interpolate(f, [fSwap - 3, fSwap + 4], [0, 1], CLX);
  const libre = (px: number, py: number, s: number) => ({ transform: `translate(${960 - px * s}px, ${540 - py * s}px) scale(${s})`, transformOrigin: "0 0" } as React.CSSProperties);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {op < 1 && <AbsoluteFill style={f < fIn ? camara(x, y, sPre) : libre(x, y, sA)}><Img src={staticFile(a)} style={FOTO} /></AbsoluteFill>}
      {op > 0 && <AbsoluteFill style={{ opacity: op, ...(kout < 0.999 ? libre(bx, by, sB) : camara(bx, by, sB)) }}><Img src={staticFile(b)} style={FOTO} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------------- 3 · porche → mesa
export const EscPorche: React.FC<{ a: string; b: string; fBaja: number; fHora: number; fMin: number; dur: number }> = ({ a, b, fBaja, fHora, fMin, dur }) => {
  const f = useCurrentFrame();
  const SOL = 300, OFF = 1080 - SOL; // ent_hoy arranca en y=780 de la tira
  const k = suave((f - fBaja) / 78);
  const px = 760 + (900 - 760) * k, py = 470 + (OFF + 520 - 470) * k;
  const s = 1.12 + 0.04 * Math.sin(k * Math.PI) - 0.02 * suave(f / Math.max(1, dur));
  const ty = Math.min(0, Math.max(1080 - (OFF + 1080) * s, 540 - py * s)), tx = Math.min(0, Math.max(1920 - 1920 * s, 960 - px * s));
  const r1 = interpolate(f, [fHora, fHora + 10, fBaja + 20, fBaja + 30], [0, 1, 1, 0], CLX);
  const r2 = interpolate(f, [fMin, fMin + 10, dur - 8, dur], [0, 1, 1, 0], CLX);
  const renglon = (t: string, o: number, top: number): React.ReactNode => (
    <div style={{ position: "absolute", left: 120, top, opacity: o, fontFamily: MANO, fontWeight: 700, fontSize: 64, color: "#FFF6E2", textShadow: "0 2px 14px rgba(0,0,0,0.7)", transform: `translateY(${(1 - o) * 14}px)` }}>{t}</div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: OFF + 1080, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }}>
        <Img src={staticFile(a)} style={FOTO} />
        <Img src={staticFile(b)} style={{ ...FOTO, top: OFF, WebkitMaskImage: `linear-gradient(180deg, transparent 0px, #000 ${SOL}px)`, maskImage: `linear-gradient(180deg, transparent 0px, #000 ${SOL}px)` }} />
      </div>
      {renglon("1955 · the porch steps, an hour", r1, 120)}
      {renglon("today · my table, two minutes", r2, 880)}
    </AbsoluteFill>
  );
};

// ---------------- 4 · escarcha
export const EscEscarcha: React.FC<{ a: string; b: string; fCubre: number; fSwap: number; dur: number }> = ({ a, b, fCubre, fSwap, dur }) => {
  const f = useCurrentFrame();
  const k = suave(f / Math.max(1, fSwap));
  const s = 1 + 0.75 * k, px = 1100 + (1470 - 1100) * k, py = 540 + (600 - 540) * k;
  const MANCHAS = [[1460, 620, 0], [1300, 420, 10], [1620, 760, 18], [1330, 880, 26], [1600, 330, 32]];
  const g = (d: number) => interpolate(f, [d + 4, fCubre + d * 0.4], [0, 340], { ...CLX, easing: Easing.out(Easing.quad) });
  const mask = MANCHAS.map(([x, y, d]) => `radial-gradient(circle at ${x}px ${y}px, #000 ${g(d)}px, transparent ${g(d) + 90}px)`).join(", ");
  const op = interpolate(f, [fSwap - 4, fSwap + 6], [0, 1], CLX);
  const kb = suave((f - fSwap) / Math.max(1, dur - fSwap));
  const sB = 1.6 - 0.56 * kb;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {op < 1 && (
        <AbsoluteFill style={camara(px, py, s)}>
          <Img src={staticFile(a)} style={FOTO} />
          <div style={{ position: "absolute", left: 1185, top: 270, width: 560, height: 705, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask, WebkitMaskOrigin: "border-box" as any,
            maskPosition: "-1185px -270px", WebkitMaskPosition: "-1185px -270px", maskSize: "1920px 1080px", WebkitMaskSize: "1920px 1080px", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", opacity: 0.94 }}>
            <Img src={staticFile(b)} style={{ position: "absolute", left: -1150, top: -820, width: 3840 * 0.9, height: 2160 * 0.9, objectFit: "fill" }} />
          </div>
        </AbsoluteFill>
      )}
      {op > 0 && <AbsoluteFill style={{ opacity: op, ...camara(1060, 600, sB) }}><Img src={staticFile(b)} style={FOTO} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
