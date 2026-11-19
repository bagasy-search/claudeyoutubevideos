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
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing, spring } from "remotion";
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
  const sA = Math.exp(Math.log(1.25) + (Math.log(16) - Math.log(1.25)) * Easing.in(Easing.quad)(kin));
  // olivas: arranca con la misma escala aparente y abre hasta 1.04
  const sB0 = 16 * (OA.r / OB.r);
  const kout = Math.max(0, Math.min(1, (f - fSwap) / Math.max(1, Math.min(dur - fSwap - 10, 70))));
  const sB = Math.exp(Math.log(sB0) + (Math.log(1.04) - Math.log(sB0)) * Easing.out(Easing.cubic)(kout));
  const bx = OB.x + (960 - OB.x) * Easing.out(Easing.cubic)(kout) * 0.4, by = OB.y + (540 - OB.y) * Easing.out(Easing.cubic)(kout) * 0.4;
  const op = interpolate(f, [fSwap - 3, fSwap + 4], [0, 1], CLX);
  const libre = (px: number, py: number, s: number) => ({ transform: `translate(${960 - px * s}px, ${540 - py * s}px) scale(${s})`, transformOrigin: "0 0" } as React.CSSProperties);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {op < 1 && <AbsoluteFill style={f < fIn ? camara(x, y, 1.25) : libre(x, y, sA)}><Img src={staticFile(a)} style={FOTO} /></AbsoluteFill>}
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

// ======================= lcf11e (ideas en D:/rtmp/lcf11e/esc/ideas.md) =======================
// coordenadas en px del cuadro 1920x1080 (fotos 1088x608 estiradas con 'fill')

// 5 EscCorona · el plato recortado por su borde sube de la mesa y queda colgado en la puerta de la cocina como corona, balanceándose en el clavo
export const EscCorona: React.FC<{ a: string; b: string; fRing: number; fWreath: number; fHot: number; dur: number }> = ({ a, b, fRing, fWreath, fHot, dur }) => {
  const f = useCurrentFrame();
  const CX = 902, CY = 508, R = 488;               // plato en esc_corona_a
  const HX = 1075, HY = 470, HS = 0.5;              // punto del clavo en la puerta (esc_corona_b) y escala de la corona colgada
  const lift = suave((f - fWreath + 14) / 26);       // el plato sube y viaja a la puerta
  const dark = interpolate(f, [fRing - 4, fRing + 10], [0, 0.55], CLX) * (1 - lift);
  const door = interpolate(lift, [0.25, 0.75], [0, 1], CLX);
  const x = CX + (HX - CX) * lift, y = CY + (HY - CY) * lift, s = 1 + (HS - 1) * lift;
  const settle = Math.max(0, f - (fWreath + 12));
  const swing = lift >= 1 ? 6 * Math.exp(-settle / 14) * Math.sin(settle / 4.2) : (1 - lift) * 0 + lift * 9;
  const cam = 1.02 + 0.05 * (f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <Img src={staticFile(a)} style={{ ...FOTO, opacity: 1 - door }} />
        <Img src={staticFile(b)} style={{ ...FOTO, opacity: door }} />
        <AbsoluteFill style={{ background: `rgba(10,8,6,${dark})` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${CX}px ${CY - R}px`,
          transform: `translate(${x - CX}px, ${y - CY}px) scale(${s}) rotate(${swing}deg)`,
          filter: `drop-shadow(0 ${10 + 30 * lift}px ${16 + 30 * lift}px rgba(0,0,0,${0.35 + 0.25 * lift}))`, opacity: f < fRing - 4 ? 0 : 1 }}>
          <Img src={staticFile(a)} style={{ ...FOTO, clipPath: circulo(CX, CY, R, 48) }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 6 EscHielo · la humedad baja del cubo: el arroz arranca seco y opaco y desde el cubo hacia abajo recupera el brillo
export const EscHielo: React.FC<{ src: string; fMelt: number; fTop: number; dur: number }> = ({ src, fMelt, fTop, dur }) => {
  const f = useCurrentFrame();
  const CX = 960, CY = 515;                           // cubo de hielo en g1050
  const t = suave((f - fMelt) / Math.max(20, fTop + 30 - fMelt));
  const rx = 40 + 420 * t, ry = 30 + 620 * t;          // la mancha se alarga hacia abajo más rápido
  const k = 1.08 + 0.32 * suave(f / Math.max(1, dur * 0.7));
  const cam = camara(CX, CY + 60, k);
  const mask = `radial-gradient(ellipse ${rx}px ${ry}px at ${CX}px ${CY - 10}px, #000 70%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...cam }}>
        <Img src={staticFile(src)} style={{ ...FOTO, filter: "saturate(0.55) brightness(1.1) contrast(0.82)" }} />
        <div style={{ ...FOTO, WebkitMaskImage: mask, maskImage: mask } as React.CSSProperties}>
          <Img src={staticFile(src)} style={{ ...FOTO, filter: "saturate(1.08) contrast(1.06)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 7 EscAire · una banda de aire caliente (la propia foto ondulada) da la vuelta a la presa: arriba, y en "underneath" por debajo de la rejilla
export const EscAire: React.FC<{ src: string; fAround: number; fUnder: number; fSoggy: number; dur: number }> = ({ src, fAround, fUnder, fSoggy, dur }) => {
  const f = useCurrentFrame();
  // recorrido: arriba de izquierda a derecha (y 330), baja por la derecha, por debajo de la rejilla de derecha a izquierda (y 590)
  const p1 = suave((f - fAround + 6) / Math.max(18, fUnder - fAround));
  const p2 = suave((f - fUnder + 4) / 34);
  let px: number, py: number;
  if (p2 <= 0) { px = 200 + 1520 * p1; py = 330 + 60 * Math.sin(p1 * Math.PI) * -0.4; }
  else { px = 1720 - 1520 * p2; py = 330 + 260 * Math.min(1, p2 * 4); }
  const on = interpolate(f, [fAround - 8, fAround + 2], [0, 1], CLX) * interpolate(f, [fSoggy + 10, fSoggy + 30], [1, 0], CLX);
  const mask = `radial-gradient(ellipse 300px 120px at ${px}px ${py}px, #000 45%, transparent 100%)`;
  const seed = Math.floor(f / 2) % 50;
  const cam = 1.03 + 0.06 * (f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="lcfAire"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="2" seed={seed} /><feDisplacementMap in="SourceGraphic" scale={26} /></filter>
      </svg>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <Img src={staticFile(src)} style={FOTO} />
        <div style={{ ...FOTO, opacity: on, WebkitMaskImage: mask, maskImage: mask } as React.CSSProperties}>
          <Img src={staticFile(src)} style={{ ...FOTO, filter: "url(#lcfAire) brightness(1.12) saturate(1.15)" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 8 EscLibros · la bolsa plana de la bandeja gira sobre su canto, se para de perfil y entra como un libro en el hueco de la fila del freezer
export const EscLibros: React.FC<{ a: string; b: string; fStand: number; fBooks: number; fSee: number; dur: number }> = ({ a, b, fStand, fBooks, fSee, dur }) => {
  const f = useCurrentFrame();
  const BX = 1133, BY = 718, BW = 500, BH = 486;     // bolsa en d23 (centro y tamaño)
  const GX = 980, GY = 465;                            // hueco en esc_libros
  const st = suave((f - fStand + 4) / 22);             // gira a vertical y se pone de canto
  const mv = suave((f - fBooks + 10) / 24);            // viaja al hueco
  const bgx = interpolate(mv, [0.1, 0.6], [0, 1], CLX);
  const x = BX + (GX - BX) * mv, y = BY + (GY - BY) * mv;
  const s = 1 + (1.1 - 1) * mv;
  const pan = suave((f - fSee) / 50);
  const zoom = 1 + 0.18 * pan;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", perspective: 1600 }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${-pan * 60}px)` }}>
        <Img src={staticFile(a)} style={{ ...FOTO, opacity: 1 - bgx, transform: `scale(${1.02 + 0.04 * (f / Math.max(1, dur))})` }} />
        <Img src={staticFile(b)} style={{ ...FOTO, opacity: bgx }} />
        {f < fBooks + 40 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${BX}px ${BY}px`,
            transform: `translate(${x - BX}px, ${y - BY}px) scale(${s}) rotate(${-90 * st}deg) rotateX(${78 * st}deg)`,
            opacity: interpolate(f, [fBooks + 20, fBooks + 36], [1, 0], CLX), filter: `drop-shadow(0 18px 24px rgba(0,0,0,${0.45 * (1 - bgx)}))` }}>
            <Img src={staticFile(a)} style={{ ...FOTO, clipPath: `inset(${BY - BH / 2}px ${1920 - BX - BW / 2}px ${1080 - BY - BH / 2}px ${BX - BW / 2}px round 10px)` }} />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 9 EscVentaja · la foto de 1945 resulta ser el reflejo en el costado cromado de la tostadora de hoy; en "just me" el reflejo vuelve a ser la ventana
export const EscVentaja: React.FC<{ a: string; b: string; fHead: number; fMe: number; dur: number }> = ({ a, b, fHead, fMe, dur }) => {
  const f = useCurrentFrame();
  const L = 270, T = 195, W = 1265, H = 720;           // costado cromado en esc_tost
  const out = suave((f - fHead + 6) / 40);              // la cámara se aleja del reflejo
  const s0 = 1920 / W * 1.04;
  const s = (s0 + (1.03 - s0) * out) * (1 + 0.05 * f / Math.max(1, dur));   // sigue moviéndose lento: sin tramo quieto
  const cx = L + W / 2, cy = T + H / 2;
  const tx = 960 - cx * s, ty = 540 - cy * s;
  const refl = interpolate(f, [fMe - 4, fMe + 18], [1, 0], CLX);
  const blend = interpolate(out, [0, 0.6], [0, 1], CLX);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }}>
        <Img src={staticFile(b)} style={FOTO} />
        <div style={{ position: "absolute", left: L, top: T, width: W, height: H, borderRadius: "140px 140px 30px 30px", overflow: "hidden", opacity: refl * (1 - 0.45 * blend), mixBlendMode: blend > 0.5 ? "screen" : "normal" }}>
          <Img src={staticFile(a)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scaleX(${1 + 0.06 * blend}) scaleY(${1 - 0.03 * blend})`, filter: `sepia(${0.25 * blend}) contrast(${1 - 0.15 * blend})` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- lcf15b · bol y monedas (g0010) · LA IDEA: las tres monedas reales de la mesada se deslizan por la madera
//   una tras otra (resorte con peso) y quedan apiladas contra el pie del bol: "thirty-eight cents a bowl".
//   Donde estaban queda la madera (parche de la misma foto, 70 px más abajo). En la 2ª "thirty-eight" la cámara entra al bol.
//   Encuadre: escala ≥1.11 anclada a la izquierda (tapa la estrellita de la esquina inferior derecha).
const MONEDAS = [
  { cx: 1211, cy: 884, rx: 42, ry: 25, to: [1158, 912], sx: 0, sy: -50 },
  { cx: 1324, cy: 900, rx: 38, ry: 22, to: [1160, 901], sx: 95, sy: 0 },
  { cx: 1288, cy: 934, rx: 35, ry: 21, to: [1162, 890], sx: 0, sy: 58 },
];
export const EscBolMonedas: React.FC<{ src: string; coins: number[]; dur: number }> = ({ src, coins, dur }) => {
  const f = useCurrentFrame();
  const { fps } = { fps: 30 };
  const [m0, m1] = [coins[0] ?? 10, coins[1] ?? Math.round(dur * 0.55)];
  const push = suave((f - (m1 - 6)) / 42);
  const drift = suave(f / Math.max(1, m1));
  const s = 1.11 + 0.04 * drift + 0.30 * push;
  const px = 865 + 60 * drift + 75 * push, py = 540 + 120 * drift + 200 * push;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={camara(px, py, s)}>
        <Img src={staticFile(src)} style={FOTO} />
        {MONEDAS.map((c, i) => {
          const k = spring({ frame: f - (m0 + i * 6), fps, config: { damping: 14, mass: 1.1, stiffness: 90 } });
          const dx = (c.to[0] - c.cx) * k, dy = (c.to[1] - c.cy) * k;
          const clip = `ellipse(${c.rx}px ${c.ry}px at ${c.cx}px ${c.cy}px)`;
          const maskP = `radial-gradient(ellipse ${c.rx + 14}px ${c.ry + 12}px at ${c.cx}px ${c.cy}px, #000 50%, transparent 100%)`;
          return (
            <React.Fragment key={i}>
              {k > 0.01 && (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, WebkitMaskImage: maskP, maskImage: maskP, opacity: Math.min(1, k * 3) }}>
                  <Img src={staticFile(src)} style={{ ...FOTO, left: -c.sx, top: -c.sy }} />
                </div>
              )}
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${dx}px, ${dy}px)`, filter: `drop-shadow(3px 5px 4px rgba(40,25,10,${0.25 + 0.25 * k}))` }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: clip }}>
                  <Img src={staticFile(src)} style={FOTO} />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 11 EscAmanece · "In the morning, they've doubled in size." (g0830 noche → g0860 mañana): arranca en el frasco de la noche
//   (la foto de la frase 083); la luz del amanecer entra barriendo en diagonal desde la ventana y del otro lado del barrido
//   ya es la mañana, con los porotos al doble; en "doubled" la cámara se arrima al frasco lleno.
export const EscAmanece: React.FC<{ a: string; b: string; fDawn: number; fGrow: number; dur: number }> = ({ a, b, fDawn, fGrow, dur }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [fDawn + 4, fDawn + 30], [0, 1], { ...CLX, easing: Easing.inOut(Easing.cubic) });
  const barre = `linear-gradient(235deg, #000 ${-12 + 130 * w}%, transparent ${0 + 130 * w}%)`;
  const brillo = `linear-gradient(235deg, transparent ${-20 + 130 * w}%, rgba(255,236,190,0.7) ${-6 + 130 * w}%, transparent ${4 + 130 * w}%)`;
  const kA = suave(f / 30), sA = 1.10 + 0.04 * kA;
  const kB = suave((f - fGrow + 6) / 50), sB = 1.10 + 0.14 * kB;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {w < 1 && <AbsoluteFill style={camara(1450, 600, sA)}><Img src={staticFile(a)} style={FOTO} /></AbsoluteFill>}
      <AbsoluteFill style={{ WebkitMaskImage: barre, maskImage: barre }}>
        <AbsoluteFill style={camara(860 + 10 * kB, 620 - 10 * kB, sB)}><Img src={staticFile(b)} style={FOTO} /></AbsoluteFill>
      </AbsoluteFill>
      {w > 0 && w < 1 && <AbsoluteFill style={{ background: brillo, mixBlendMode: "screen" }} />}
    </AbsoluteFill>
  );
};

// 12 EscTapa · "the lid rattling just a bit, the window steaming up" (g1840): la tapa, recortada, tiembla en ráfagas cortas
//   (se levanta 3-5 px de un costado y cae); en "steaming" el vidrio de la ventana se empaña de abajo hacia arriba.
export const EscTapa: React.FC<{ src: string; fRattle: number; fSteam: number; dur: number }> = ({ src, fRattle, fSteam, dur }) => {
  const f = useCurrentFrame();
  const LID = { cx: 776, cy: 530, rx: 136, ry: 58 };
  const d = f - fRattle;
  const rafaga = d < 0 ? 0 : (Math.sin(d / 9) > 0.15 ? 1 : 0) * Math.max(0, 1 - d / 160) + (d >= 0 && d < 40 ? 0.6 : 0);
  const tilt = rafaga * (Math.sin(d * 2.3) * 1.6), lift = rafaga * (2 + 2.5 * Math.abs(Math.sin(d * 1.7)));
  const steam = interpolate(f, [fSteam - 6, fSteam + 60], [0, 1], { ...CLX, easing: Easing.out(Easing.quad) });
  const vapor = `linear-gradient(0deg, #000 ${-20 + 120 * steam}%, transparent ${20 + 120 * steam}%)`;
  const k = suave(f / Math.max(1, dur));
  const s = 1.12 + 0.07 * k, px = 800 + 60 * k, py = 470 - 40 * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={camara(px, py, s)}>
        <Img src={staticFile(src)} style={FOTO} />
        {/* vidrio de la ventana: misma foto, desenfocada y más clara, sólo en el vidrio */}
        <div style={{ position: "absolute", left: 668, top: 84, width: 442, height: 378, overflow: "hidden", WebkitMaskImage: vapor, maskImage: vapor, opacity: 0.9 }}>
          <Img src={staticFile(src)} style={{ ...FOTO, left: -668, top: -84, filter: "blur(9px) brightness(1.18) contrast(0.8)" }} />
        </div>
        {lift > 0.2 && (
          <div style={{ position: "absolute", left: LID.cx - LID.rx, top: LID.cy + LID.ry * 0.35, width: LID.rx * 2, height: 10, borderRadius: "50%", background: "rgba(25,20,18,0.55)", filter: "blur(3px)" }} />
        )}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${LID.cx - LID.rx}px ${LID.cy + 20}px`,
          transform: `translateY(${-lift}px) rotate(${-Math.abs(tilt)}deg)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `ellipse(${LID.rx}px ${LID.ry}px at ${LID.cx}px ${LID.cy}px)` }}>
            <Img src={staticFile(src)} style={FOTO} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ================= lcf15c (las tartitas de la madre) =================
// 13 EscTarjeta · "the butter stain right in the middle, and her handwriting, a little shaky at the end" (g0060): una luz por
//   DETRÁS del papel atraviesa sólo la mancha de manteca (papel engrasado = translúcido) y la deja dorada; el resto del cuadro
//   baja un punto. En "handwriting" la cámara se desliza lento por el último renglón.
export const EscTarjeta: React.FC<{ src: string; fStain: number; fHand: number; dur: number }> = ({ src, fStain, fHand, dur }) => {
  const f = useCurrentFrame();
  const ST = { cx: 962, cy: 508, rx: 88, ry: 82 };
  const luz = interpolate(f, [fStain - 4, fStain + 26], [0, 1], { ...CLX, easing: Easing.out(Easing.cubic) });
  const latido = 1 + 0.04 * Math.sin(f / 11);
  const k0 = suave(f / 40), k1 = suave((f - fHand + 4) / Math.max(30, dur - fHand - 8));
  const s = 1.18 + 0.22 * k0 + 0.22 * k1;
  const px = 900 + 160 * suave((f - fHand - 10) / Math.max(30, dur - fHand - 10)), py = 520 + 120 * k1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={camara(px, py, s)}>
        <Img src={staticFile(src)} style={{ ...FOTO, filter: `brightness(${1 - 0.18 * luz})` }} />
        {/* el papel, apenas más claro: la luz de atrás lo atraviesa */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "polygon(722px 344px, 1238px 410px, 1222px 690px, 702px 628px)", opacity: luz }}>
          <Img src={staticFile(src)} style={{ ...FOTO, filter: "brightness(1.08)" }} />
        </div>
        {/* la mancha: translúcida y dorada, con halo que respira */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `ellipse(${ST.rx}px ${ST.ry}px at ${ST.cx}px ${ST.cy}px)`, opacity: luz }}>
          <Img src={staticFile(src)} style={{ ...FOTO, filter: "brightness(1.28) sepia(0.35) saturate(1.3)" }} />
        </div>
        <div style={{ position: "absolute", left: ST.cx - ST.rx * 1.6, top: ST.cy - ST.ry * 1.6, width: ST.rx * 3.2, height: ST.ry * 3.2, borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,214,140,0.28), rgba(255,200,120,0.08) 55%, transparent)", mixBlendMode: "screen", opacity: luz * latido }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 14 EscHueco · "the apples shrink down to nothing and you've got a cup of air with a lid on it" (g1830): el hueco real bajo la
//   tapa arranca LLENO de manzana (la textura del relleno de la misma foto, estirada hasta la tapa); en "shrink" el relleno se
//   encoge hacia el fondo y destapa el hueco oscuro real; en "air" la cámara entra despacio en el hueco.
export const EscHueco: React.FC<{ src: string; fShrink: number; fAir: number; dur: number }> = ({ src, fShrink, fAir, dur }) => {
  const f = useCurrentFrame();
  const CAV = "polygon(700px 598px, 860px 584px, 1040px 590px, 1210px 606px, 1250px 640px, 1236px 712px, 1120px 742px, 900px 744px, 742px 726px, 690px 664px)";
  const baja = interpolate(f, [fShrink - 2, fShrink + 34], [1, 0], { ...CLX, easing: Easing.inOut(Easing.cubic) });
  const k = suave((f - fAir + 4) / Math.max(30, dur - fAir));
  const s = 1.15 + 0.03 * suave(f / 40) + 0.75 * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={camara(975, 610 + 50 * k, s)}>
        <Img src={staticFile(src)} style={FOTO} />
        {baja > 0.06 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: CAV }}>
            {/* relleno: la franja de manzana del fondo del hueco, estirada hacia arriba hasta la tapa */}
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 744px",
              transform: `scaleY(${0.02 + 0.98 * baja})` }}>
              <div style={{ position: "absolute", left: 680, top: 584, width: 580, height: 160, overflow: "hidden" }}>
                <Img src={staticFile(src)} style={{ position: "absolute", left: -1720 * 2.9, top: -800 * 1.34, width: 1920 * 2.9, height: 1080 * 1.34, objectFit: "fill", filter: "brightness(0.9) saturate(1.1)" }} />
              </div>
              <div style={{ position: "absolute", left: 680, top: 584, width: 580, height: 30, background: "linear-gradient(180deg, rgba(20,10,5,0.55), transparent)" }} />
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 15 EscLuna · "they looked like the moon" (g2650): una tartita hundida (recorte redondo) sube de su hueco del molde mientras
//   el cuadro se oscurece a noche azul; arriba queda como luna llena, pálida y con sus cráteres, con un halo frío.
export const EscLuna: React.FC<{ src: string; fMoon: number; dur: number }> = ({ src, fMoon, dur }) => {
  const f = useCurrentFrame();
  const P = { cx: 998, cy: 776, rx: 96, ry: 40 };
  const sube = spring({ frame: f - fMoon + 6, fps: 30, config: { damping: 18, stiffness: 60, mass: 1.4 } });
  const noche = interpolate(f, [fMoon - 6, fMoon + 30], [0, 1], { ...CLX, easing: Easing.inOut(Easing.quad) });
  const ty = -360 * sube, sc = 1 + 1.0 * sube, sq = 1 + 0.4 * sube; // de óvalo en perspectiva a círculo
  const k = suave(f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={camara(1000, 600 - 60 * sube, 1.12 + 0.05 * k)}>
        <Img src={staticFile(src)} style={{ ...FOTO, filter: `brightness(${1 - 0.5 * noche}) saturate(${1 - 0.5 * noche}) hue-rotate(${-12 * noche}deg)` }} />
        <AbsoluteFill style={{ background: "rgba(18,32,70,1)", mixBlendMode: "multiply", opacity: 0.55 * noche }} />
        {/* el hueco que deja en el molde */}
        <div style={{ position: "absolute", left: P.cx - P.rx, top: P.cy - P.ry, width: P.rx * 2, height: P.ry * 2, borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(8,6,6,0.92), rgba(20,14,10,0.7) 75%, transparent)", opacity: Math.min(1, sube * 3) }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${P.cx}px ${P.cy}px`,
          transform: `translateY(${ty}px) scale(${sc}, ${sc * sq})` }}>
          <div style={{ position: "absolute", left: P.cx - P.rx * 1.9, top: P.cy - P.ry * 1.9, width: P.rx * 3.8, height: P.ry * 3.8, borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(220,232,255,0.5), rgba(170,195,255,0.15) 60%, transparent)", mixBlendMode: "screen", opacity: noche }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, WebkitMaskImage: `radial-gradient(ellipse ${P.rx}px ${P.ry}px at ${P.cx}px ${P.cy}px, #000 82%, transparent 100%)`, maskImage: `radial-gradient(ellipse ${P.rx}px ${P.ry}px at ${P.cx}px ${P.cy}px, #000 82%, transparent 100%)`,
            filter: `grayscale(${0.2 * noche}) sepia(${0.25 * noche}) brightness(${1 + 0.18 * noche}) contrast(${1 + 0.1 * noche})` }}>
            <Img src={staticFile(src)} style={FOTO} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
