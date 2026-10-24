// ojos · EL MAPA DEL OJO: la foto frontal del ojo cerrado de Reiko (f01) y encima, dibujado a mano en ámbar, por dónde va el aceite.
// Etapas: map (el anillo de hueso) · no (párpado y adentro del ojo: nunca) · bajo (toquecitos sobre el hueso de abajo, de adentro
// hacia afuera) · ceja (sobre el hueso de la ceja) · esquina (sostener la esquina de afuera, 3 respiraciones) · cejas (lo que
// sobra va a las cejas y a las puntas de las pestañas). Coordenadas medidas sobre f01 a 1920x1080 (ojo IZQUIERDO: la esquina de
// afuera está a la IZQUIERDA de la imagen, la nariz a la derecha).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P, e, spr, FONT, HAND } from "./lib";
import { J, washi } from "./kit";

type Pt = [number, number];
const BAJO: Pt[] = [[1520, 800], [1300, 925], [1060, 950], [820, 905], [600, 820]];   // de adentro (nariz) hacia afuera
const CEJA: Pt[] = [[1500, 330], [1280, 290], [1060, 300], [860, 350], [700, 420]];
const ESQ: Pt = [520, 640];
const LID = { x: 1100, y: 590, rx: 310, ry: 105 };
const LASH: Pt[] = [[880, 755], [1000, 740], [1140, 725], [1280, 708], [1400, 692]];
const BROW: Pt[] = [[720, 300], [860, 230], [1020, 190], [1200, 180], [1380, 200], [1520, 240]];

// polilínea suave (Catmull-Rom → Bézier) y su largo aproximado
const curve = (p: Pt[]) => {
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], q = p[Math.min(p.length - 1, i + 2)];
    d += ` C ${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6}, ${c[0] - (q[0] - b[0]) / 6} ${c[1] - (q[1] - b[1]) / 6}, ${c[0]} ${c[1]}`;
  }
  return d;
};
const len = (p: Pt[]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0) * 1.05;
const along = (p: Pt[], u: number): Pt => {
  const L = len(p) / 1.05; let r = Math.max(0, Math.min(1, u)) * L;
  for (let i = 0; i < p.length - 1; i++) { const l = Math.hypot(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]); if (r <= l) { const k = r / l; return [p[i][0] + (p[i + 1][0] - p[i][0]) * k, p[i][1] + (p[i + 1][1] - p[i][1]) * k]; } r -= l; }
  return p[p.length - 1];
};
const glow = `drop-shadow(0 0 10px ${J.amber}) drop-shadow(0 2px 4px rgba(0,0,0,.6))`;

// trazo que se dibuja (dash) con puntitos de toque que van quedando
const Trazo: React.FC<{ p: Pt[]; u: number; taps?: number; col?: string; w?: number; dash?: string }> = ({ p, u, taps = 0, col = J.amber, w = 9, dash }) => {
  const L = len(p);
  return <g style={{ filter: glow }}>
    <path d={curve(p)} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ?? `${L * u} ${L}`} opacity={dash ? Math.min(1, u * 3) : 1} />
    {Array.from({ length: taps }, (_, i) => { const k = (i + 0.5) / taps; if (k > u) return null; const [x, y] = along(p, k), pop = Math.min(1, (u - k) * 8);
      return <circle key={i} cx={x} cy={y} r={15 * pop} fill={J.amber2} opacity={0.9} />; })}
  </g>;
};

// la yema del anular: un óvalo de luz que hace tac-tac sobre el recorrido
const Yema: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const tac = Math.abs(Math.sin(t * 9));
  return <g style={{ filter: `drop-shadow(0 0 16px ${J.amber2})` }}><ellipse cx={x} cy={y - 6 * tac} rx={34 - 6 * tac} ry={26 - 5 * tac} fill="rgba(255,226,170,.55)" stroke={J.cream} strokeWidth={4} /></g>;
};

const Rotulo: React.FC<{ x: number; y: number; txt: string; k: number; col?: string }> = ({ x, y, txt, k, col = J.amber }) => k > 0.01 ? (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.1, k)}) rotate(-1.5deg)` }}>
    <div style={{ ...washi(), padding: "10px 28px", fontFamily: FONT, fontWeight: 900, fontSize: 38, letterSpacing: 1.5, color: J.sumi, whiteSpace: "nowrap", borderBottom: `6px solid ${col}` }}>{txt}</div>
  </div>) : null;

const TXT: Record<string, [string, string]> = {
  map: ["THE BONE AROUND YOUR EYE", "EL HUESO ALREDEDOR DEL OJO"],
  no: ["NOT ON THE LID · NEVER INSIDE", "NI EN EL PÁRPADO · NUNCA ADENTRO"],
  bajo: ["PAT · INNER → OUTER", "TOQUECITOS · DE ADENTRO HACIA AFUERA"],
  ceja: ["ALONG THE BROW BONE", "SOBRE EL HUESO DE LA CEJA"],
  esquina: ["HOLD · 3 BREATHS", "SOSTENER · 3 RESPIRACIONES"],
  cejas: ["WHAT'S LEFT → BROWS & LASH TIPS", "LO QUE SOBRA → CEJAS Y PUNTAS"],
};

export const EyeMap: React.FC<{ t: number; a: number; b: number; stage: string; lang: string; idx: number }> = ({ t, a, b, stage, lang, idx }) => {
  const u = t - a, d = b - a, L = lang === "es" ? 1 : 0;
  // empuje lento hacia la zona de la etapa
  const foco: Record<string, Pt> = { map: [1040, 560], no: [1100, 640], bajo: [1060, 820], ceja: [1100, 340], esquina: [620, 660], cejas: [1100, 420] };
  const [fx, fy] = foco[stage] ?? [960, 540];
  const z0 = stage === "map" ? 1.0 : 1.08, z1 = z0 + 0.1;
  const z = z0 + (z1 - z0) * Math.min(1, u / Math.max(1, d));
  const rk = spr(t, a + 0.35);
  let svg: React.ReactNode = null, rot: [number, number] = [960, 980];
  if (stage === "map") {
    const k = e(t, a + 0.2, a + 1.6), k2 = e(t, a + 0.9, a + 2.3);
    svg = <><Trazo p={BAJO} u={k} w={8} dash="2 22" /><Trazo p={CEJA} u={k2} w={8} dash="2 22" /><Trazo p={BAJO} u={k} w={5} /><Trazo p={CEJA} u={k2} w={5} />
      <circle cx={ESQ[0]} cy={ESQ[1]} r={16 * e(t, a + 1.8, a + 2.2)} fill={J.amber2} style={{ filter: glow }} /></>;
    rot = [1060, 1000];
  } else if (stage === "no") {
    const k = e(t, a + 0.15, a + 0.6), x = e(t, a + 0.6, a + 1.0);
    svg = <g opacity={k}>
      <defs><pattern id={`rayas${idx}`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="22" height="22" fill="rgba(192,57,43,.16)" /><rect width="7" height="22" fill="rgba(192,57,43,.38)" /></pattern></defs>
      <ellipse cx={LID.x} cy={LID.y} rx={LID.rx} ry={LID.ry} fill={`url(#rayas${idx})`} stroke={J.hanko} strokeWidth={8} strokeDasharray="26 14" />
      <path d={curve(LASH)} fill="none" stroke={J.hanko} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
      <g transform={`translate(${LID.x} ${LID.y}) scale(${x})`} style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.6))" }}>
        <circle r={58} fill={J.hanko} /><path d="M -24 -24 L 24 24 M 24 -24 L -24 24" stroke="#fff" strokeWidth={12} strokeLinecap="round" /></g>
    </g>;
    rot = [1100, 380];
  } else if (stage === "bajo" || stage === "ceja") {
    const p = stage === "bajo" ? BAJO : CEJA, k = e(t, a + 0.25, a + Math.min(d - 0.3, 3.2));
    const [yx, yy] = along(p, k);
    svg = <><Trazo p={p} u={1} w={4} dash="2 18" /><Trazo p={p} u={k} taps={7} /><Yema x={yx} y={yy} t={u} />
      {/* flecha de sentido */}
      <g opacity={e(t, a + 0.3, a + 0.7)} style={{ filter: glow }}><path d={`M ${p[0][0] + 10} ${p[0][1] + (stage === "bajo" ? 70 : -70)} l -90 0 m 24 -18 l -24 18 l 24 18`} fill="none" stroke={J.cream} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></g></>;
    rot = stage === "bajo" ? [1060, 1010] : [1100, 120];
  } else if (stage === "esquina") {
    const br = Math.floor(Math.max(0, u - 0.5) / 1.4), ph = ((Math.max(0, u - 0.5)) % 1.4) / 1.4;
    svg = <g style={{ filter: glow }}>
      {[0, 1, 2].map((i) => <circle key={i} cx={ESQ[0]} cy={ESQ[1]} r={60 + 26 * i + 18 * Math.sin(ph * Math.PI)} fill="none" stroke={J.amber} strokeWidth={5} opacity={i < br + 1 ? 0.85 - i * 0.2 : 0.12} />)}
      <Yema x={ESQ[0]} y={ESQ[1]} t={0} />
      {[0, 1, 2].map((i) => <circle key={`b${i}`} cx={ESQ[0] - 50 + i * 50} cy={ESQ[1] + 180} r={16} fill={i < Math.min(3, br + (ph > 0.5 ? 1 : 0)) ? J.amber2 : "rgba(255,255,255,.25)"} stroke={J.cream} strokeWidth={3} />)}
    </g>;
    rot = [700, 950];
  } else if (stage === "cejas") {
    const k = e(t, a + 0.2, a + 1.6), k2 = e(t, a + 1.2, a + 2.6);
    svg = <><Trazo p={BROW} u={k} w={24} col="rgba(240,168,58,.55)" />
      {LASH.map(([x, y], i) => { const on = e(t, a + 1.2 + i * 0.18, a + 1.4 + i * 0.18); return <circle key={i} cx={x} cy={y + 40} r={11 * on} fill={J.amber2} style={{ filter: glow }} />; })}
      <path d={curve(LASH.map(([x, y]) => [x, y + 40] as Pt))} fill="none" stroke={J.amber2} strokeWidth={3} strokeDasharray="4 12" opacity={k2} /></>;
    rot = [1100, 100];
  }
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${(fx / 1920) * 100}% ${(fy / 1080) * 100}%` }}>
      <Img src={staticFile(P + "img_f01_ojo_textura.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: stage === "no" ? "brightness(.92)" : undefined }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{svg}</svg>
    </AbsoluteFill>
    <Rotulo x={rot[0]} y={rot[1]} txt={(TXT[stage] ?? TXT.map)[L]} k={rk} col={stage === "no" ? J.hanko : J.amber} />
  </AbsoluteFill>;
};
