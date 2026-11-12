// Escenas sobre fotos · ck11d (ideas.md en D:/rtmp/ck11d). Cada una con un truco distinto, hechas con la foto real.
// Fotos a pantalla completa 1920x1080 con objectFit 'fill' (coordenadas exactas de la rejilla).
// 1 EscCristales: reacción en cadena por celdas hexagonales de g0400 (azúcar) a g0430 (fudge granuloso).
// 2 EscManteles: rótulos a mano sobre el mantel de papel de cada mesa, en su perspectiva (matrix3d).
// 3 EscRevelado: la copia de 1969 se revela persona por persona (brillo 3,2 → 1, por zonas).
// 4 EscEntrega: la copia de 1988 se levanta de la mesa y se le entrega al espectador (esquinas → rectángulo).
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Kalam";

const { fontFamily: MANO } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const CLX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = (t: number) => Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, t)));
const FOTO: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
type P2 = [number, number];

// cámara: punto (px,py) de la foto al centro del cuadro, escala s; limita para no dejar bordes
const camara = (px: number, py: number, s: number) => {
  let tx = 960 - px * s, ty = 540 - py * s;
  tx = Math.min(0, Math.max(1920 - 1920 * s, tx));
  ty = Math.min(0, Math.max(1080 - 1080 * s, ty));
  return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" } as React.CSSProperties;
};

// homografía de 4 puntos a 4 puntos (Gauss 8x8) y su matrix3d de CSS (origen 0 0)
const homografia = (a: P2[], b: P2[]) => {
  const M: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = a[i], [u, v] = b[i];
    M.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    M.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 8; r++) if (r !== c) { const k = M[r][c] / M[c][c]; for (let q = c; q < 9; q++) M[r][q] -= k * M[c][q]; }
  }
  return [...M.map((r, i) => r[8] / r[i]), 1];
};
const aplicar = (h: number[], [x, y]: P2): P2 => { const w = h[6] * x + h[7] * y + 1; return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w]; };
const m3d = (h: number[]) => `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;

// ---------------- 1 · cristales
const HR = 64, DX = HR * Math.sqrt(3), DY = HR * 1.5;
const CELDAS = (() => {
  const c: { x: number; y: number }[] = [];
  for (let j = 0; j * DY < 1080 + 2 * HR; j++) for (let i = 0; i * DX < 1920 + 2 * DX; i++) c.push({ x: -DX / 2 + i * DX + (j % 2 ? DX / 2 : 0), y: -HR / 2 + j * DY });
  // pasos de vecino (BFS) desde la celda más cercana al grano 900,442
  let s = 0; c.forEach((q, k) => { if (Math.hypot(q.x - 900, q.y - 442) < Math.hypot(c[s].x - 900, c[s].y - 442)) s = k; });
  const d = c.map(() => -1); d[s] = 0; const cola = [s];
  while (cola.length) { const k = cola.shift()!; c.forEach((q, n) => { if (d[n] < 0 && Math.hypot(q.x - c[k].x, q.y - c[k].y) < DX * 1.05) { d[n] = d[k] + 1; cola.push(n); } }); }
  return c.map((q, k) => ({ ...q, d: d[k] <= 2 ? d[k] : d[k] + Math.sin(k * 12.9898) * 0.35 }));
})();
const DMAX = Math.max(...CELDAS.map((q) => q.d));
const hexPath = (x: number, y: number, r: number) => Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 6 + (k * Math.PI) / 3; return `${k ? "L" : "M"}${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`; }).join(" ") + " Z";

export const EscCristales: React.FC<{ a: string; b: string; f0: number; f1: number; f2: number; f3: number; fFin: number; dur: number }> = ({ a, b, f0, f1, f2, f3, fFin }) => {
  const f = useCurrentFrame();
  const cuando = (d: number) => (d === 0 ? f0 : d <= 1 ? f1 : d <= 2 ? f2 : f3 + (fFin - f3) * Math.pow(Math.max(0, d - 2) / (DMAX - 2), 0.55));
  const POP = 6;
  const quietas: string[] = [], pop: { x: number; y: number; t: number }[] = [];
  for (const q of CELDAS) { const t = (f - cuando(q.d)) / POP; if (t >= 1) quietas.push(hexPath(q.x, q.y, HR + 0.8)); else if (t >= 0) pop.push({ x: q.x, y: q.y, t }); }
  const todas = quietas.length === CELDAS.length;
  const k = suave((f - f1) / (fFin + 6 - f1));
  const cam = camara(900 + (960 - 900) * k, 442 + (540 - 442) * k, 2.3 + (1.0 - 2.3) * k);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={cam}>
        {!todas && <Img src={a} style={FOTO} />}
        {todas ? <Img src={b} style={FOTO} /> : quietas.length > 0 && (
          <div style={{ position: "absolute", inset: 0, clipPath: `path('${quietas.join(" ")}')` }}><Img src={b} style={FOTO} /></div>
        )}
        {!todas && pop.map((q, n) => {
          const s = 0.82 + 0.18 * suave(q.t);
          return (
            <div key={n} style={{ position: "absolute", inset: 0, clipPath: `path('${hexPath(q.x, q.y, HR * s + 0.8)}')`, filter: `brightness(${(1.25 - 0.25 * q.t).toFixed(3)})` }}>
              <Img src={b} style={FOTO} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 2 · manteles
const renglon = (txt: string, w: number, h: number, quad: P2[], f: number, fa: number, size: number) => {
  const t = interpolate(f, [fa, fa + 14], [0, 1], CLX);
  if (t <= 0) return null;
  const h3 = homografia([[0, 0], [w, 0], [w, h], [0, h]], quad);
  return (
    <div key={txt} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "0 0", transform: m3d(h3), clipPath: `inset(0 ${((1 - t) * 100).toFixed(1)}% 0 0)`, mixBlendMode: "multiply", opacity: 0.85 }}>
      <div style={{ width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MANO, fontWeight: 700, fontSize: size, color: "#2b2622", whiteSpace: "nowrap" }}>{txt}</div>
    </div>
  );
};
export const EscManteles: React.FC<{ src: string; fQ: number; fA: number; fJ: number; fP: number; fB: number; fU: number; dur: number }> = ({ src, fQ, fA, fJ, fP, fB, fU }) => {
  const f = useCurrentFrame();
  const k = suave(f / fU), k2 = suave((f - fU) / 300);
  const cam = camara(780 + 180 * k - 20 * k2, 760 - 220 * k - 40 * k2, 1.14 - 0.14 * k + 0.05 * k2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={cam}>
        <Img src={src} style={FOTO} />
        {renglon("quilts", 450, 120, [[120, 570], [410, 463], [455, 516], [150, 654]], f, fQ, 96)}
        {renglon("& angels", 450, 120, [[410, 463], [700, 356], [760, 377], [455, 516]], f, fA, 96)}
        {renglon("jams", 450, 120, [[1265, 560], [1545, 565], [1565, 655], [1255, 650]], f, fJ, 96)}
        {renglon("& pickles", 450, 120, [[1255, 655], [1565, 660], [1595, 770], [1245, 765]], f, fP, 96)}
        {renglon("bake sale", 600, 80, [[725, 338], [1125, 355], [1118, 385], [750, 370]], f, fB, 64)}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 3 · revelado
const ZONAS = [{ x: 440, y: 260, r: 330 }, { x: 850, y: 300, r: 330 }, { x: 1650, y: 350, r: 350 }, { x: 600, y: 820, r: 600 }];
export const EscRevelado: React.FC<{ src: string; fz: number[]; fG0: number; fG1: number; dur: number }> = ({ src, fz, fG0, fG1, dur }) => {
  const f = useCurrentFrame();
  const p0 = interpolate(f, [0, 105, fG0, fG1], [0, 0.22, 0.22, 1], CLX);
  const br = (p: number) => `brightness(${(1 + 2.2 * (1 - p)).toFixed(3)})`;
  // cámara: 25 % hacia la persona nombrada; vuelve al centro cuando se revela todo
  let cx = 960, cy = 540;
  ZONAS.forEach((z, i) => { const t = suave((f - fz[i]) / 48); cx += (960 + (z.x - 960) * 0.25 - cx) * t; cy += (540 + (z.y - 540) * 0.25 - cy) * t; });
  const tv = suave((f - fG0) / 90); cx += (960 - cx) * tv; cy += (540 - cy) * tv;
  const s = interpolate(f, [0, dur], [1.0, 1.1], CLX);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={camara(cx, cy, s)}>
        <Img src={src} style={{ ...FOTO, filter: br(p0) }} />
        {ZONAS.map((z, i) => {
          const p = interpolate(f, [fz[i], fz[i] + 48], [0, 1], CLX);
          if (p <= p0) return null;
          const m = `radial-gradient(circle ${z.r}px at ${z.x}px ${z.y}px, #000 0px, #000 120px, transparent ${z.r}px)`;
          return <Img key={i} src={src} style={{ ...FOTO, filter: br(p), WebkitMaskImage: m, maskImage: m }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 4 · entrega
const PAPEL: P2[] = [[240, 22], [1658, 8], [1743, 1035], [165, 1058]];
const INTER: P2[] = [[285, 70], [1610, 55], [1680, 990], [235, 1000]];
const HFIN = homografia(INTER, [[-30, -20], [1950, -20], [1950, 1100], [-30, 1100]]);
const DESTINO = PAPEL.map((p) => aplicar(HFIN, p));
export const EscEntrega: React.FC<{ src: string; fUp: number; fFin: number; dur: number }> = ({ src, fUp, fFin, dur }) => {
  const f = useCurrentFrame();
  const t = suave((f - fUp) / (fFin - fUp));
  const quad = PAPEL.map((p, i) => [p[0] + (DESTINO[i][0] - p[0]) * t, p[1] + (DESTINO[i][1] - p[1]) * t] as P2);
  const h = homografia(PAPEL, quad);
  const pre = suave(f / fUp) * (1 - t), post = suave((f - fFin) / (dur - fFin));
  const cam = camara(960 - 260 * pre, 540 + 20 * pre, 1 + 0.08 * pre);
  const clip = `polygon(${PAPEL.map((p) => `${p[0]}px ${p[1]}px`).join(", ")})`;
  // acercamiento final sobre la imagen ya derecha, hacia la señora (1240,420 de la copia)
  const [sx, sy] = aplicar(HFIN, [1240, 420]);
  const sF = 1 + 0.05 * post;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={cam}>
        <Img src={src} style={FOTO} />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${((1 - sF) * sx).toFixed(1)}px, ${((1 - sF) * sy).toFixed(1)}px) scale(${sF})`, transformOrigin: "0 0", filter: `drop-shadow(0 ${(24 * t).toFixed(1)}px ${(40 * t).toFixed(1)}px rgba(0,0,0,${(0.55 * t).toFixed(2)}))` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: m3d(h) }}>
            <Img src={src} style={{ ...FOTO, clipPath: clip }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
