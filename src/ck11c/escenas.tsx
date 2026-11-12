// ck11c · escenas sobre fotos (ideas en D:/rtmp/ck11c/ideas.md). Coordenadas en 1920x1080; T = segundo absoluto del video.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { cl, eOut, eIO, lerp, sf, HAND } from "./look";

const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const pts = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
// cámara: escala s centrada en (cx,cy), sin dejar bordes vacíos
const cam = (s: number, cx: number, cy: number) => {
  const tx = Math.min(0, Math.max(1920 - 1920 * s, 960 - cx * s));
  const ty = Math.min(0, Math.max(1080 - 1080 * s, 540 - cy * s));
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};
const path = (T: number, keys: [number, number, number, number][]) => {
  // keys: [t, s, cx, cy]; interpolación suave entre claves
  if (T <= keys[0][0]) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const [t1] = keys[i], [t0] = keys[i - 1];
    if (T <= t1) { const k = eIO(T, t0, t1); return keys[i - 1].map((v, j) => lerp(v, keys[i][j], k)) as any; }
  }
  return keys[keys.length - 1];
};

// 1 · las dos fuentes: la aguada se corre por su propio borde de metal y la buena entra pegada a ese borde
const Pans: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const [, sc, cx, cy] = path(T, [[7.2, 1.04, 1000, 560], [7.9, 1.2, 800, 860], [9.3, 1.2, 1050, 720], [11.3, 1.14, 900, 840], [12.6, 1.14, 900, 840], [13.3, 1.0, 960, 540]]);
  const k = eIO(T, 12.88, 13.6);
  const shiftBad = -890 * k;            // borde derecho real (x≈1780) termina en x≈890
  const shiftGood = lerp(1920, 420, k); // borde izquierdo real de g0060 (x≈470) termina en x≈890
  const hold = eOut(T, 13.6, 14.6);
  return (
    <AbsoluteFill style={{ background: "#3a3a38", overflow: "hidden" }}>
      <AbsoluteFill style={{ overflow: "hidden", transform: `translateX(${shiftBad}px)` }}>
        <AbsoluteFill style={{ transform: cam(sc, cx, cy), transformOrigin: "0 0" }}>
          <Img src={sf(s.src)} style={FULL} />
        </AbsoluteFill>
      </AbsoluteFill>
      {k > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", transform: `translateX(${shiftGood}px)`, clipPath: "inset(0 0 0 470px)", boxShadow: "-24px 0 30px rgba(0,0,0,.35)" }}>
          <Img src={sf("ck11c/g/g0060.png")} style={{ ...FULL, transform: `scale(${1 + 0.02 * hold})`, transformOrigin: "60% 60%" }} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// 2 · las batatas: la del medio se agranda sobre su lugar; las de los costados pierden la forma (puré) mientras la grande queda firme
const P1 = [[445, 268], [520, 290], [600, 320], [668, 345], [710, 390], [728, 480], [732, 570], [725, 680], [705, 780], [690, 860], [672, 905], [640, 912], [585, 880], [520, 830], [470, 760], [440, 675], [430, 585], [442, 480], [468, 390], [455, 320]];
const P2 = [[960, 186], [995, 225], [1025, 315], [1040, 450], [1043, 600], [1032, 705], [1003, 795], [962, 855], [915, 885], [880, 880], [840, 860], [800, 810], [765, 735], [742, 630], [740, 510], [752, 390], [785, 300], [840, 235], [905, 198]];
const P3 = [[1150, 230], [1230, 258], [1290, 325], [1335, 420], [1357, 525], [1365, 645], [1356, 750], [1333, 830], [1295, 880], [1250, 875], [1200, 840], [1148, 750], [1102, 645], [1072, 525], [1062, 390], [1068, 300], [1095, 248]];
const box = (p: number[][]) => { const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
const Cut: React.FC<{ src: string; poly: number[][]; tf: string; origin: string; filter?: string }> = ({ src, poly, tf, origin, filter }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: pts(poly), transform: tf, transformOrigin: origin, filter: `drop-shadow(0 10px 14px rgba(0,0,0,.25)) ${filter || ""}` }}>
    <Img src={sf(src)} style={FULL} />
  </div>
);
const Papas: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const big = eOut(T, 277.3, 278.1);                 // "great big one"
  const mush = eIO(T, 280.3, 281.1);                 // "mush"
  const firm = eOut(T, 281.5, 282.2);                // "the big one's done"
  const [, sc, cx, cy] = path(T, [[272.5, 1.0, 900, 560], [276.8, 1.05, 900, 560], [279.2, 1.05, 900, 560], [281.0, 1.1, 900, 600], [283.2, 1.16, 890, 560]]);
  const sag = (poly: number[][]) => { const [x0, , x1, y1] = box(poly); return { origin: `${(x0 + x1) / 2}px ${y1}px`, tf: `scale(${lerp(1, 1.14, mush)}, ${lerp(1, 0.8, mush)})` }; };
  const patch = (poly: number[][]) => <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: pts(poly), background: "linear-gradient(180deg,#cfd0c8,#b4aea3)", filter: "blur(10px)", transform: "scale(1.04)", transformOrigin: `${(box(poly)[0] + box(poly)[2]) / 2}px ${(box(poly)[1] + box(poly)[3]) / 2}px` }} />;
  const s1 = sag(P1), s3 = sag(P3), [bx0, by0, bx1, by1] = box(P2);
  const mf = `brightness(${lerp(1, 0.8, mush)}) saturate(${lerp(1, 1.25, mush)}) blur(${lerp(0, 2.2, mush)}px)`;
  return (
    <AbsoluteFill style={{ background: "#c9c9c1", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: cam(sc, cx, cy), transformOrigin: "0 0" }}>
        <Img src={sf(s.src)} style={FULL} />
        {mush > 0 && patch(P1)}{mush > 0 && patch(P3)}
        {mush > 0 && <Cut src={s.src} poly={P1} tf={s1.tf} origin={s1.origin} filter={mf} />}
        {mush > 0 && <Cut src={s.src} poly={P3} tf={s3.tf} origin={s3.origin} filter={mf} />}
        {big > 0 && <Cut src={s.src} poly={P2} tf={`scale(${lerp(1, 1.24, big) * lerp(1, 1.02, firm)})`} origin={`${(bx0 + bx1) / 2}px ${(by0 + by1) / 2 + 40}px`} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 3 · la planilla: los renglones vacíos reales se llenan con lápiz al nombrar cada sección; postres de golpe, guarniciones casi vacía
type Sec = { t: number; x: number; ys: number[]; e: string[] };
const SECS: Sec[] = [
  { t: 1203.8, x: 470, ys: [222, 253, 285], e: ["Ham — Olsons", "Turkey — church", "Meatballs — Dahl"] },
  { t: 1204.76, x: 725, ys: [222], e: ["Sweet potatoes — L."] },
  { t: 1205.74, x: 479, ys: [445, 477], e: ["Jello salad — Ruth", "Coleslaw — Pete"] },
  { t: 1206.58, x: 770, ys: [445, 477, 508, 540, 571], e: ["Pumpkin pie", "Apple pie", "Brownies", "Lemon bars", "Pecan pie"] },
  { t: 1207.22, x: 602, ys: [645], e: ["Dinner rolls — Bev"] },
];
const Planilla: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const [, sc, cx, cy] = path(T, [[1203.8, 1.5, 560, 290], [1204.7, 1.5, 560, 290], [1205.3, 1.5, 800, 290], [1205.9, 1.5, 560, 500], [1206.6, 1.5, 830, 510], [1207.3, 1.45, 690, 690], [1208.1, 1.45, 690, 690], [1209.06, 1.6, 830, 520]]);
  return (
    <AbsoluteFill style={{ background: "#7a5a3a", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: cam(sc, cx, cy), transformOrigin: "0 0" }}>
        <Img src={sf(s.src)} style={FULL} />
        {SECS.map((sec, i) => sec.e.map((txt, j) => {
          const a = sec.t + (sec.e.length > 3 ? j * 0.11 : j * 0.22);
          const w = cl((T - a) / 0.45);
          if (w <= 0) return null;
          return <div key={i + "-" + j} style={{ position: "absolute", left: sec.x, top: sec.ys[j] - 29, fontFamily: HAND, fontSize: 25, lineHeight: "30px", color: "#4d4a46", whiteSpace: "nowrap",
            clipPath: `inset(-6px ${100 - 100 * w}% -6px 0)`, transform: `rotate(${(j % 2 ? -0.6 : 0.4)}deg)`, opacity: 0.88 }}>{txt}</div>;
        }))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Escena: React.FC<{ name: string; s: any }> = ({ name, s }) => {
  const f = useCurrentFrame();
  const T = (s.from + f) / 30;
  if (name === "pans") return <Pans s={s} T={T} />;
  if (name === "papas") return <Papas s={s} T={T} />;
  if (name === "planilla") return <Planilla s={s} T={T} />;
  return <AbsoluteFill><Img src={sf(s.src)} style={FULL} /></AbsoluteFill>;
};
