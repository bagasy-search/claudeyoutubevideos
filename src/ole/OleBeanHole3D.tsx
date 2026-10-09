// OleBeanHole3D — corte transversal del pozo de "bean-hole beans" en un claro nevado del bosque del norte.
// Capas de suelo (nieve, tierra negra, tierra parda, arcilla), pozo forrado de piedras, fuego → brasas que laten,
// la olla de hierro que baja con un gancho (tapa sellada con pasta de harina), arpillera mojada, tierra que la tapa,
// la noche con estrellas y un reloj que avanza (ondas de calor de las piedras a la olla) y el desentierro al amanecer.
// Todo animado por useCurrentFrame; texturas y partículas deterministas (rnd). Cámara que baja del suelo al corte.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { OLE, LABEL, HAND, rnd, hexA, kraftBg } from "./OleTheme";
import {
  clamp01, ease, smooth, noise1, canvasTex, dots, softTex, CamRig, projectTo, RIM, BODY_PROFILE, LID_PROFILE,
  makeIronMats, usePotGeoms, IronPot, bailGeom, rockGeom, tube,
} from "./OleDutchOven3D";

export type BeanHoleStage = "dig" | "fire" | "coals" | "pot" | "bury" | "night" | "dig-up";
const ORDER: BeanHoleStage[] = ["dig", "fire", "coals", "pot", "bury", "night", "dig-up"];
export type BeanHoleTarget = "depth" | "stones" | "fire" | "coals" | "pot" | "seam" | "burlap" | "dirt" | "none";

// ── geometría del pozo (1 unidad = 1 pie) ──
const PIT_D = 3.4;
const W_TOP = 1.78, W_BOT = 1.58;
const wAt = (y: number) => W_TOP + (clamp01(-y / PIT_D)) * (W_BOT - W_TOP);
const POT_S = 1.12;
const POT_REST = -2.6;          // fondo de la olla asentada en las brasas
const COAL_SIDE = -1.95;        // brasas paleadas alrededor de la olla
const LID_TOP = POT_REST + (RIM + 0.155) * POT_S;
const BURLAP_Y = LID_TOP + 0.05;

const TARGETS: Record<Exclude<BeanHoleTarget, "none" | "depth">, [number, number, number]> = {
  stones: [-1.6, -1.2, 0.1], fire: [0.2, -1.6, -0.4], coals: [1.3, -3.05, 0.02], pot: [0.5, POT_REST + 0.45 * POT_S, 0.02],
  seam: [-0.83, POT_REST + RIM * POT_S, 0.83], burlap: [-0.7, BURLAP_Y + 0.02, 0.7], dirt: [-0.9, -0.6, 0.6],
};

// ── utilidades de escena ──
function stageTimes(stages: { at: number; stage: BeanHoleStage }[], dur: number) {
  const st = [...stages].sort((a, b) => a.at - b.at);
  const map = new Map<BeanHoleStage, [number, number]>();
  st.forEach((s, i) => map.set(s.stage, [s.at, st[i + 1]?.at ?? dur]));
  const first = st[0]?.at ?? 0;
  return (t: number, s: BeanHoleStage): number => {
    const r = map.get(s);
    if (r) return clamp01((t - r[0]) / Math.max(0.01, r[1] - r[0]));
    const oi = ORDER.indexOf(s);
    const later = st.filter((x) => ORDER.indexOf(x.stage) > oi);
    return later.some((x) => x.at <= Math.max(t, first)) ? 1 : 0;
  };
}
function parseClock(s: string) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const m = /([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i.exec(s);
  if (!m) return 0;
  const d = Math.max(0, days.indexOf(m[1].toUpperCase()));
  let h = parseInt(m[2], 10) % 12; if (m[4].toUpperCase() === "PM") h += 12;
  return d * 24 + h + (m[3] ? parseInt(m[3], 10) / 60 : 0);
}
function fmtClock(hrs: number) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const hh = ((hrs % 168) + 168) % 168; const d = Math.floor(hh / 24), h = Math.floor(hh % 24);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${days[d]} ${h12} ${h < 12 ? "AM" : "PM"}`;
}

function strata(c: CanvasRenderingContext2D, W: number, H: number, y0: number, y1: number, seed: number, dark = 0, snowT = 0.33) {
  // y0 = y del borde de arriba del canvas, y1 = y del de abajo (en pies)
  const Y = (y: number) => ((y0 - y) / (y0 - y1)) * H;
  const band = (top: (x: number) => number, bot: (x: number) => number, col: string) => {
    c.fillStyle = col; c.beginPath(); c.moveTo(0, Y(top(0)));
    for (let x = 0; x <= W; x += 8) c.lineTo(x, Y(top(x / W)));
    for (let x = W; x >= 0; x -= 8) c.lineTo(x, Y(bot(x / W)));
    c.closePath(); c.fill();
  };
  const wav = (base: number, amp: number, k: number) => (u: number) => base + amp * (Math.sin(u * 17 + k) * 0.6 + Math.sin(u * 41 + k * 2) * 0.4);
  const top = () => y0 + 1;
  band(top, wav(-snowT, 0.04, 1), "#F3F6F8");
  band(wav(-snowT, 0.04, 1), wav(-1.3, 0.1, 2), "#5E4432");
  band(wav(-1.3, 0.1, 2), wav(-2.3, 0.14, 3), "#86603E");
  band(wav(-2.3, 0.14, 3), () => y1 - 1, "#B3804F");
  // sombra fría bajo la nieve
  c.fillStyle = "rgba(120,150,190,0.35)"; c.fillRect(0, Y(-0.3), W, Math.max(2, Y(-0.36) - Y(-0.3)));
  // raíces en la tierra negra
  c.lineCap = "round";
  for (let i = 0; i < 26; i++) {
    let x = rnd(seed + i * 7) * W, y = Y(-0.4 - rnd(seed + i * 7 + 1) * 0.3);
    c.strokeStyle = `rgba(${150 + rnd(i) * 40 | 0},${110 + rnd(i + 1) * 30 | 0},70,0.55)`; c.lineWidth = 1 + rnd(i + 2) * 2;
    c.beginPath(); c.moveTo(x, y);
    for (let k = 0; k < 5; k++) { x += (rnd(seed + i * 11 + k) - 0.5) * 30; y += rnd(seed + i * 13 + k) * (H * 0.05); c.lineTo(x, y); }
    c.stroke();
  }
  // grumos, piedritas
  const pebble = (yA: number, yB: number, n: number, col: string, r0: number, r1: number, s2: number) => {
    for (let i = 0; i < n; i++) {
      const x = rnd(s2 + i * 3) * W, y = Y(yA + (yB - yA) * rnd(s2 + i * 3 + 1)), r = r0 + rnd(s2 + i * 3 + 2) * (r1 - r0);
      c.fillStyle = col; c.beginPath(); c.ellipse(x, y, r * 1.3, r, rnd(i) * 3, 0, 6.28); c.fill();
    }
  };
  pebble(-0.4, -1.25, 380, "rgba(40,28,20,0.35)", 1, 3, seed + 100);
  pebble(-1.35, -2.25, 300, "rgba(60,40,24,0.3)", 1, 3.5, seed + 200);
  pebble(-1.4, -2.2, 22, "#8E877C", 3, 7, seed + 250);
  pebble(-2.4, y1, 420, "rgba(130,85,45,0.35)", 1, 4, seed + 300);
  pebble(-2.5, y1, 30, "#9B948A", 3, 8, seed + 350);
  dots(c, W, H, seed + 400, 700, "rgba(255,255,255,0.10)", 0.5, 1.5, 1);
  if (dark) { c.fillStyle = `rgba(30,18,10,${dark})`; c.fillRect(0, 0, W, H); }
}

function shapeGeo(pts: [number, number][], z = 0) {
  const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ShapeGeometry(sh);
  g.translate(0, 0, z);
  return g;
}
/** UV en coordenadas de mundo para las tapas del corte (x∈[-10,10], y∈[-6,0]) */
function worldUV(g: any, x0 = -10, x1 = 10, y0 = 0, y1 = -6) {
  const p = g.attributes.position as any; const uv: number[] = [];
  for (let i = 0; i < p.count; i++) uv.push((p.getX(i) - x0) / (x1 - x0), 1 - (p.getY(i) - y0) / (y1 - y0));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  return g;
}
/** línea de la arpillera en el corte: baja por los costados hasta las brasas y cubre la tapa */
function burlapLine(dy = 0): [number, number][] {
  const out: [number, number][] = [];
  const px = 1.035 * POT_S;
  const xs = [-wAt(COAL_SIDE) + 0.02, -px - 0.18, -px - 0.02, -px + 0.1, -0.6, -0.3, 0, 0.3, 0.6, px - 0.1, px + 0.02, px + 0.18, wAt(COAL_SIDE) - 0.02];
  for (const x of xs) {
    const ax = Math.abs(x);
    let y: number;
    if (ax > px + 0.1) y = COAL_SIDE + 0.02;
    else if (ax > px - 0.12) y = POT_REST + (RIM + 0.02) * POT_S + (ax > px ? -0.12 * (ax - px) / 0.1 : 0);
    else y = LID_TOP + 0.01 - 0.1 * (ax / px) ** 2;
    out.push([x, y + dy]);
  }
  return out;
}
const trap = (yA: number, yB: number): [number, number][] => [[-wAt(yA), yA], [wAt(yA), yA], [wAt(yB), yB], [-wAt(yB), yB]];

// ───────────────────────── componente ─────────────────────────
export type OleBeanHole3DProps = {
  stages?: { at: number; stage: BeanHoleStage }[];
  camera?: "descend" | "static";
  labels?: { at: number; text: string; target?: BeanHoleTarget; dur?: number }[];
  clockFrom?: string; clockTo?: string;
  clockLabel?: string;
};

export const OleBeanHole3D: React.FC<OleBeanHole3DProps> = ({ stages, camera = "descend", labels, clockFrom = "Sat 9 PM", clockTo = "Sun 6 AM", clockLabel }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, dur = durationInFrames / fps;

  const stg = stages && stages.length ? stages : (() => {
    const k = dur / 20;
    return [{ at: 0, stage: "dig" }, { at: 2.2 * k, stage: "fire" }, { at: 4.6 * k, stage: "coals" }, { at: 7 * k, stage: "pot" }, { at: 9.6 * k, stage: "bury" }, { at: 12.2 * k, stage: "night" }, { at: 16.4 * k, stage: "dig-up" }] as { at: number; stage: BeanHoleStage }[];
  })();
  const P = stageTimes(stg, dur);
  const pDig = P(t, "dig"), pFire = P(t, "fire"), pCoals = P(t, "coals"), pPot = P(t, "pot"), pBury = P(t, "bury"), pNight = P(t, "night"), pUp = P(t, "dig-up");
  const has = (s: BeanHoleStage) => stg.some((x) => x.stage === s);
  const startOf = (s: BeanHoleStage) => stg.find((x) => x.stage === s)?.at;

  // ── estado derivado ──
  const fireAmt = has("fire") ? smooth(pFire * 5) * (1 - smooth(pCoals * 1.7)) : 0;
  const logsAmt = has("fire") ? (pFire > 0 ? 1 - smooth(pCoals * 1.4) : 0) : 0;
  const bedH = 1.1 * (has("fire") ? smooth((pFire - 0.45) / 0.55) * 0.35 + smooth(pCoals / 0.75) * 0.65 : smooth(pCoals / 0.6));
  const bedTop = -PIT_D + Math.max(0.02, bedH);
  const potIn = interpolate(pPot, [0, 0.62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const potUp = interpolate(pUp, [0.42, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const potVisible = pPot > 0 || pBury > 0;
  const potY = POT_REST + (1 - potIn) * 7 + potUp * (0.15 - POT_REST);
  const sideP = smooth((pPot - 0.72) / 0.28) * (1 - smooth(pUp / 0.4));
  const coalTop = bedTop + (COAL_SIDE - bedTop) * sideP * (bedTop < COAL_SIDE ? 1 : 0);
  const coalGlow = (has("coals") || has("fire") ? smooth(pCoals * 3 + pFire * 0.8) : 1) * (1 - 0.3 * pNight) * (1 - 0.45 * smooth(pUp * 2));
  const burlapDrop = interpolate(pBury, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const burlapLift = interpolate(pUp, [0.26, 0.42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const burlapOn = burlapDrop > 0 && burlapLift < 1;
  const fillFrac = interpolate(pBury, [0.2, 0.95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }) * (1 - interpolate(pUp, [0, 0.28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }));
  const fillTop = BURLAP_Y + 0.02 + (0.0 - (BURLAP_Y + 0.02)) * fillFrac;
  const nightIn = smooth(pNight / 0.25);
  const dawn = smooth(pUp / 0.4);
  const night = nightIn * (1 - dawn);
  const heat = smooth((pNight - 0.1) / 0.15) * (1 - smooth(pUp / 0.3));
  const hookDown = (pPot > 0 && pPot < 0.86) ? 1 - smooth((pPot - 0.62) / 0.24) : pUp > 0.3 ? smooth((pUp - 0.3) / 0.12) : 0;
  const bail = hookDown > 0.02 ? 0 : 1.25;
  const moundS = has("dig") ? 0.55 + 0.45 * smooth(pDig * 1.5) : 1;
  const moundAmt = moundS * (1 - 0.8 * fillFrac);

  // ── cámara ──
  const camP = camera === "descend" ? interpolate(t, [0, Math.min(4.5, dur * 0.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }) : 1;
  const drift = t * 0.012;
  const lift = potUp * 2.1;
  const pos: [number, number, number] = [
    interpolate(camP, [0, 1], [4.4, 2.5]) - drift, interpolate(camP, [0, 1], [2.6, -0.25]) + lift, interpolate(camP, [0, 1], [7.6, 5.7]) - drift * 3,
  ];
  const target: [number, number, number] = [interpolate(camP, [0, 1], [1.3, 0.15]), interpolate(camP, [0, 1], [-0.2, -1.78]) + lift, interpolate(camP, [0, 1], [-1.6, 0])];
  const FOV = 38;

  // ── materiales y geometría fija ──
  const R = useMemo(() => {
    const clip = [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)];
    const quad = [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)];
    const faceTex = canvasTex((c, W, H) => strata(c, W, H, 0, -6, 11), 2048, 640);
    const wallTex = canvasTex((c, W, H) => strata(c, W, H, 0, -PIT_D, 23, 0.18, -0.2), 1024, 512, 1, 1);
    const snowTex = canvasTex((c, W, H) => { c.fillStyle = "#F4F7F9"; c.fillRect(0, 0, W, H); dots(c, W, H, 3, 900, "#DCE5EE", 1, 5, 0.6); dots(c, W, H, 5, 500, "#FFFFFF", 0.5, 1.5, 0.9); }, 512, 512, 10, 10);
    const dirtTex = canvasTex((c, W, H) => { c.fillStyle = "#6E4F35"; c.fillRect(0, 0, W, H); dots(c, W, H, 3, 2200, "#4E3624", 1, 4, 0.55); dots(c, W, H, 5, 1400, "#8F6C4B", 1, 3, 0.5); dots(c, W, H, 9, 60, "#8E877C", 3, 7, 0.8); }, 512, 512, 4, 4);
    const dirtFaceTex = canvasTex((c, W, H) => { c.fillStyle = "#735237"; c.fillRect(0, 0, W, H); dots(c, W, H, 13, 5000, "#553A26", 1, 4, 0.55); dots(c, W, H, 15, 3000, "#98734F", 1, 3, 0.45); dots(c, W, H, 17, 60, "#908A80", 3, 8, 0.8); }, 1024, 320);
    const coalFaceTex = canvasTex((c, W, H) => {
      // brasas: fondo rojo que arde, trozos de carbon con borde encendido, ceniza gris, pocas chispas
      const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#B23C18"); bg.addColorStop(1, "#8C2A12"); c.fillStyle = bg; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 520; i++) {
        const x = rnd(i * 3) * W, y = rnd(i * 3 + 1) * H, r = 11 + rnd(i * 3 + 2) * 15, k = rnd(i + 999);
        c.beginPath(); const nk = 5 + Math.floor(rnd(i + 7) * 3);
        for (let j = 0; j < nk; j++) { const an = j / nk * 6.28 + rnd(i * 5 + j) * 0.5, rr = r * (0.65 + rnd(i * 7 + j) * 0.45); if (j === 0) c.moveTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.8); else c.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.8); }
        c.closePath();
        c.fillStyle = k > 0.94 ? "#F08A3A" : k > 0.8 ? "#D2582A" : k > 0.62 ? "#9A948C" : k > 0.3 ? "#3A2A24" : "#5A2A1C"; c.fill();
        c.lineWidth = 2.5; c.strokeStyle = k > 0.62 && k <= 0.8 ? "rgba(70,60,55,0.5)" : "rgba(255,120,50,0.7)"; c.stroke();
      }
      dots(c, W, H, 71, 220, "rgba(200,195,188,0.6)", 1, 3, 1); // ceniza
      dots(c, W, H, 73, 40, "#FFC06A", 1, 2, 0.8);
    }, 1024, 256);
    coalFaceTex.wrapS = coalFaceTex.wrapT = THREE.RepeatWrapping;
    dirtFaceTex.wrapS = dirtFaceTex.wrapT = THREE.RepeatWrapping;
    const coalCrack = canvasTex((c, W, H) => {
      c.fillStyle = "#000"; c.fillRect(0, 0, W, H); c.strokeStyle = "#FF7A2A"; c.lineCap = "round";
      for (let i = 0; i < 70; i++) { let x = rnd(i * 3) * W, y = rnd(i * 3 + 1) * H; c.lineWidth = 1 + rnd(i) * 3; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rnd(i * 9 + k) - 0.5) * 50; y += (rnd(i * 7 + k) - 0.5) * 50; c.lineTo(x, y); } c.stroke(); }
      dots(c, W, H, 99, 90, "#FFB25A", 3, 10, 0.7);
    }, 256);
    const beansFaceTex = canvasTex((c, W, H) => {
      c.fillStyle = "#6B2F17"; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 260; i++) { const x = rnd(i * 5) * W, y = rnd(i * 5 + 1) * H, r = 10 + rnd(i * 5 + 2) * 5;
        c.fillStyle = `rgb(${150 + rnd(i) * 40 | 0},${80 + rnd(i + 1) * 30 | 0},${48 + rnd(i + 2) * 20 | 0})`; c.beginPath(); c.ellipse(x, y, r * 1.5, r * 0.85, rnd(i + 3) * 3, 0, 6.28); c.fill();
        c.fillStyle = "rgba(255,230,200,0.35)"; c.beginPath(); c.ellipse(x - r * 0.4, y - r * 0.3, r * 0.5, r * 0.2, rnd(i + 3) * 3, 0, 6.28); c.fill(); }
      c.fillStyle = "rgba(90,35,15,0.25)"; c.fillRect(0, 0, W, H);
    }, 512, 256);
    const burlapTex = canvasTex((c, W, H) => {
      c.fillStyle = "#8C6B45"; c.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 6) { c.fillStyle = `rgba(${60 + rnd(x) * 30 | 0},40,20,0.35)`; c.fillRect(x, 0, 2, H); }
      for (let y = 0; y < H; y += 6) { c.fillStyle = `rgba(200,170,120,${0.18 + rnd(y + 5) * 0.12})`; c.fillRect(0, y, W, 2); }
      dots(c, W, H, 7, 50, "rgba(40,25,12,0.35)", 12, 40, 1); // manchas de humedad
    }, 512, 512, 3, 3);
    const skyDay = canvasTex((c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#9FBCD8"); g.addColorStop(0.6, "#DCE7F0"); g.addColorStop(1, "#F2F1EA"); c.fillStyle = g; c.fillRect(0, 0, W, H); }, 64, 256);
    const skyNight = canvasTex((c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#15213D"); g.addColorStop(0.65, "#2B3E63"); g.addColorStop(1, "#4A5E82"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 420; i++) { const x = rnd(i * 3 + 5000) * W, y = rnd(i * 3 + 5001) * H * 0.75, r = 0.5 + rnd(i * 3 + 5002) ** 3 * 2.4; c.fillStyle = `rgba(255,250,235,${0.5 + rnd(i) * 0.5})`; c.beginPath(); c.arc(x, y, r, 0, 6.28); c.fill(); }
      const mx = W * 0.78, my = H * 0.2; const mg = c.createRadialGradient(mx, my, 0, mx, my, 70); mg.addColorStop(0, "rgba(255,248,225,0.55)"); mg.addColorStop(1, "rgba(255,248,225,0)"); c.fillStyle = mg; c.fillRect(mx - 70, my - 70, 140, 140);
      c.fillStyle = "#FFF6DC"; c.beginPath(); c.arc(mx, my, 22, 0, 6.28); c.fill();
    }, 1024, 512);
    const skyDawn = canvasTex((c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7E93B8"); g.addColorStop(0.5, "#E9B9A4"); g.addColorStop(0.85, "#F6CF96"); g.addColorStop(1, "#F8E3BE"); c.fillStyle = g; c.fillRect(0, 0, W, H); }, 64, 256);
    const flameTex = canvasTex((c, W, H) => {
      const g = c.createRadialGradient(W / 2, H * 0.72, 2, W / 2, H * 0.62, W * 0.5);
      g.addColorStop(0, "rgba(255,245,200,1)"); g.addColorStop(0.25, "rgba(255,190,80,0.95)"); g.addColorStop(0.6, "rgba(235,90,25,0.55)"); g.addColorStop(1, "rgba(200,40,10,0)");
      c.fillStyle = g; c.beginPath(); c.moveTo(W / 2, 0); c.bezierCurveTo(W * 0.95, H * 0.45, W * 0.95, H, W / 2, H); c.bezierCurveTo(W * 0.05, H, W * 0.05, H * 0.45, W / 2, 0); c.fill();
    }, 128, 256);
    const waveTex = canvasTex((c, W, H) => {
      c.strokeStyle = "rgba(255,236,170,1)"; c.lineCap = "round";
      for (let k = 0; k < 3; k++) { c.lineWidth = 13 - k * 3; c.globalAlpha = 1 - k * 0.28; c.beginPath(); c.arc(W * (0.1 + k * 0.28) - W * 0.6, H / 2, W * 0.75, -0.55, 0.55); c.stroke(); }
    }, 256, 256);
    const steamTex = softTex("rgba(255,255,255,0.9)");

    const M = {
      face: new THREE.MeshStandardMaterial({ map: faceTex, roughness: 1 }),
      floor: new THREE.MeshStandardMaterial({ color: "#7E5A3A", roughness: 1, clippingPlanes: clip }),
      wall: new THREE.MeshStandardMaterial({ map: wallTex, roughness: 1, side: THREE.BackSide, clippingPlanes: clip }),
      snow: new THREE.MeshStandardMaterial({ map: snowTex, roughness: 0.9, emissive: "#AEB8C2", emissiveIntensity: 0.3, side: THREE.DoubleSide }),
      dirt: new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 1, clippingPlanes: quad, clipIntersection: true, transparent: true, opacity: 0.85 }),
      dirtFace: new THREE.MeshStandardMaterial({ map: dirtFaceTex, roughness: 1 }),
      mound: new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 1 }),
      coalFace: new THREE.MeshStandardMaterial({ map: coalFaceTex, emissiveMap: coalFaceTex, emissive: "#ffffff", emissiveIntensity: 0.6, roughness: 1 }),
      coalTop: new THREE.MeshStandardMaterial({ map: coalFaceTex, emissiveMap: coalFaceTex, emissive: "#ffffff", emissiveIntensity: 0.5, roughness: 1, clippingPlanes: quad, clipIntersection: true }),
      coalGhost: new THREE.MeshStandardMaterial({ map: coalFaceTex, emissiveMap: coalFaceTex, emissive: "#ffffff", emissiveIntensity: 0.5, roughness: 1, clippingPlanes: quad, clipIntersection: true, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide }),
      dirtGhost: new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 1, clippingPlanes: quad, clipIntersection: true, transparent: true, opacity: 0.38, depthWrite: false, side: THREE.DoubleSide }),
      coal: new THREE.MeshStandardMaterial({ color: "#3A302B", roughness: 0.9, emissive: "#FF4A14", emissiveMap: coalCrack, emissiveIntensity: 1.1, clippingPlanes: quad, clipIntersection: true }),
      rock: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85, emissive: "#FF6A2A", emissiveIntensity: 0 }),
      log: new THREE.MeshStandardMaterial({ color: "#6B4A2E", roughness: 0.9, emissive: "#FF5A1A", emissiveIntensity: 0, clippingPlanes: clip }),
      beansFace: new THREE.MeshStandardMaterial({ map: beansFaceTex, roughness: 0.45, side: THREE.DoubleSide }),
      ironFace: new THREE.MeshStandardMaterial({ color: "#55504A", roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide }),
      paste: new THREE.MeshStandardMaterial({ color: "#F3E7CC", roughness: 0.9, clippingPlanes: quad, clipIntersection: true }),
      pasteFace: new THREE.MeshStandardMaterial({ color: "#EDE0C4", roughness: 0.9 }),
      burlap: new THREE.MeshStandardMaterial({ map: burlapTex, color: "#E8D2AA", roughness: 1, side: THREE.DoubleSide, clippingPlanes: quad, clipIntersection: true, transparent: true }),
      burlapFace: new THREE.MeshStandardMaterial({ map: burlapTex, color: "#F2DDB4", roughness: 1, transparent: true, emissive: "#5A4222", emissiveIntensity: 0.5 }),
      tree: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9 }),
      treeSnow: new THREE.MeshStandardMaterial({ color: "#F2F5F8", roughness: 0.9 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#5A3F2A", roughness: 1 }),
      skyDay: new THREE.MeshBasicMaterial({ map: skyDay, depthWrite: false }),
      skyNight: new THREE.MeshBasicMaterial({ map: skyNight, transparent: true, depthWrite: false }),
      skyDawn: new THREE.MeshBasicMaterial({ map: skyDawn, transparent: true, depthWrite: false }),
      hook: new THREE.MeshStandardMaterial({ color: "#3A3733", roughness: 0.4, metalness: 0.7 }),
      handle: new THREE.MeshStandardMaterial({ color: "#B08556", roughness: 0.7 }),
    };
    const iron = makeIronMats(quad);
    Object.values(iron).forEach((m: any) => { m.clipIntersection = true; });

    // cara del corte con el hueco del pozo
    const hole: [number, number][] = [[-W_TOP, 0], [-W_BOT, -PIT_D + 0.15], [-W_BOT + 0.15, -PIT_D], [W_BOT - 0.15, -PIT_D], [W_BOT, -PIT_D + 0.15], [W_TOP, 0]];
    const faceShape = new THREE.Shape([new THREE.Vector2(-10, -14), new THREE.Vector2(10, -14), new THREE.Vector2(10, 0), ...hole.slice().reverse().map(([x, y]) => new THREE.Vector2(x, y)), new THREE.Vector2(-10, 0)]);
    const faceGeo = worldUV(new THREE.ShapeGeometry(faceShape));
    faceTex.wrapT = THREE.MirroredRepeatWrapping;
    // superficie de nieve con la muesca del pozo (plano XZ, frente en z=0)
    const sn = new THREE.Shape();
    sn.moveTo(-40, 0); sn.lineTo(-W_TOP, 0); sn.absarc(0, 0, W_TOP, Math.PI, 0, true); sn.lineTo(40, 0); sn.lineTo(40, 60); sn.lineTo(-40, 60); sn.lineTo(-40, 0);
    const snowGeo = new THREE.ShapeGeometry(sn, 48); snowGeo.rotateX(-Math.PI / 2);
    { const p = snowGeo.attributes.position as any; const uv: number[] = []; for (let i = 0; i < p.count; i++) uv.push(p.getX(i) / 8, p.getZ(i) / 8); snowGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); }
    // pared del pozo: medio cono truncado (mitad de atrás), visto de adentro
    const wallGeo = new THREE.CylinderGeometry(W_TOP, W_BOT, PIT_D, 48, 6, true);
    const floorGeo = new THREE.CircleGeometry(W_BOT, 40); floorGeo.rotateX(-Math.PI / 2);

    // piedras que forran el pozo
    const rockG = rockGeom(31, 2);
    const rocks: { p: [number, number, number]; s: [number, number, number]; r: [number, number, number]; c: string; edge: boolean }[] = [];
    for (let y = -PIT_D + 0.16; y < -0.5; y += 0.36) {
      const r = wAt(y) - 0.04; const n = Math.round((Math.PI * r) / 0.42);
      for (let k = 0; k <= n; k++) {
        const th = Math.PI / 2 + (k / n) * Math.PI + (rnd(rocks.length * 3 + 1) - 0.5) * 0.08;
        const sc = 0.16 + rnd(rocks.length * 3 + 2) * 0.05;
        const edge = k === 0 || k === n;
        rocks.push({ p: [Math.sin(th) * r, y + (rnd(rocks.length + 7) - 0.5) * 0.06, edge ? 0.02 : Math.cos(th) * r], s: [sc * 1.25, sc * 0.95, sc], r: [rnd(rocks.length) * 3, rnd(rocks.length + 1) * 3, rnd(rocks.length + 2) * 3], c: `hsl(${26 + rnd(rocks.length + 3) * 16},${4 + rnd(rocks.length + 4) * 6}%,${50 + rnd(rocks.length + 5) * 16}%)`, edge });
      }
    }
    for (let i = 0; i < 26; i++) { // fondo
      const x = (rnd(i + 800) - 0.5) * 2 * (W_BOT - 0.2), z = -rnd(i + 810) * (W_BOT - 0.2); const sc = 0.17 + rnd(i + 820) * 0.08;
      rocks.push({ p: [x, -PIT_D + 0.1, z], s: [sc * 1.3, sc * 0.7, sc], r: [0, rnd(i) * 3, 0], c: `hsl(28,8%,${45 + rnd(i + 830) * 18}%)`, edge: false });
    }
    const rockIM = new THREE.InstancedMesh(rockG, M.rock, rocks.length);
    { const m = new THREE.Matrix4(); rocks.forEach((k, i) => { m.compose(new THREE.Vector3(...k.p), new THREE.Quaternion().setFromEuler(new THREE.Euler(...k.r)), new THREE.Vector3(...k.s)); rockIM.setMatrixAt(i, m); rockIM.setColorAt(i, new THREE.Color(k.c)); }); }

    // brasas (trozos sobre el lecho y sobre la tapa)
    const coalG = rockGeom(5, 0);
    const NC = 170;
    const coalIM = new THREE.InstancedMesh(coalG, M.coal, NC);
    const coalData = Array.from({ length: NC }, (_, i) => ({ x: (rnd(i * 3 + 1) - 0.5) * 2 * 1.75, z: (rnd(i * 3 + 2) - 0.5) * 2 * 1.75, s: 0.07 + rnd(i * 3 + 3) * 0.07, r: rnd(i + 44) * 6, dy: rnd(i + 55) * 0.05 }));

    // troncos del fuego
    const logs = Array.from({ length: 7 }, (_, i) => ({ x: (rnd(i + 70) - 0.5) * 1.2, y: -PIT_D + 0.25 + (i % 3) * 0.2, z: -0.45 - rnd(i + 71) * 0.8, ry: (rnd(i + 72) - 0.5) * 1.6, rz: (rnd(i + 73) - 0.5) * 0.35, len: 1.6 + rnd(i + 74) * 0.8 }));

    // llamas, vapor, tierra que cae
    const flames = Array.from({ length: 22 }, () => new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })));
    const steams = Array.from({ length: 26 }, () => new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0 })));
    const clodG = rockGeom(77, 0);
    const clods = new THREE.InstancedMesh(clodG, M.mound, 70);
    const waves = Array.from({ length: 9 }, () => new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshBasicMaterial({ map: waveTex, transparent: true, depthWrite: false, opacity: 0 })));

    // bosque: telón pintado en 3 capas (lejos brumoso → cerca con nieve) + pinos 3D finos delante
    const forestTex = canvasTex((c, W, H) => {
      c.clearRect(0, 0, W, H);
      const pine = (x: number, base: number, h: number, col: string, snow: number, seed: number) => {
        const tiers = 7; const w0 = h * 0.2;
        c.fillStyle = col;
        for (let k = 0; k < tiers; k++) {
          const ty = base - h * (k / tiers) * 0.92, tw = w0 * (1 - k / tiers) + 3, th = h * 0.26;
          c.beginPath(); c.moveTo(x - tw, ty); c.lineTo(x, ty - th); c.lineTo(x + tw, ty);
          c.quadraticCurveTo(x, ty - th * 0.2 + (rnd(seed + k) - 0.5) * 4, x - tw, ty); c.fill();
          if (snow > 0 && rnd(seed * 3 + k) < snow) { c.fillStyle = "rgba(245,248,250,0.9)"; c.beginPath(); c.ellipse(x - tw * 0.25, ty - th * 0.28, tw * 0.45, th * 0.07, -0.25, 0, 6.28); c.fill(); c.fillStyle = col; }
        }
        c.fillRect(x - 1.5, base - 2, 3, h * 0.08);
      };
      const layers: [number, string, number, number, number][] = [[0.66, "#AFC2CB", 150, 60, 0.0], [0.72, "#7F9B98", 110, 95, 0.35], [0.78, "#4C6C5E", 70, 135, 0.6]];
      layers.forEach(([baseF, col, n, h, snow], L) => {
        for (let i = 0; i < n; i++) { const x = rnd(L * 1000 + i) * W, hh = h * (0.7 + rnd(L * 1000 + i + 500) * 0.6); pine(x, H * baseF + rnd(L * 77 + i) * 8, hh, col, snow, L * 3000 + i * 11); }
        c.fillStyle = col; c.fillRect(0, H * baseF, W, H * (1 - baseF));
      });
    }, 2048, 512);
    const forestMat = new THREE.MeshBasicMaterial({ map: forestTex, transparent: true, depthWrite: false });
    const trees = Array.from({ length: 30 }, (_, i) => ({ x: (rnd(i + 1200) - 0.5) * 50, z: -9 - rnd(i + 1201) * 14, s: 1.3 + rnd(i + 1202) * 1.1, c: rnd(i + 1203) })).filter((k) => Math.abs(k.x) > 3 || k.z < -12);
    const TIERS = 5;
    const treeCone = new THREE.ConeGeometry(1, 1.5, 9);
    const tIM = new THREE.InstancedMesh(treeCone, M.tree, trees.length * TIERS);
    const sIM = new THREE.InstancedMesh(treeCone, M.treeSnow, trees.length * TIERS);
    const trIM = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.05, 0.08, 1.2, 6), M.trunk, trees.length);
    { const m = new THREE.Matrix4(), q = new THREE.Quaternion();
      trees.forEach((k, i) => {
        m.compose(new THREE.Vector3(k.x, 0.6 * k.s, k.z), q, new THREE.Vector3(k.s, k.s, k.s)); trIM.setMatrixAt(i, m);
        for (let j = 0; j < TIERS; j++) {
          const w = (0.62 - j * 0.1) * k.s, y = (1.0 + j * 0.72) * k.s;
          m.compose(new THREE.Vector3(k.x, y, k.z), q, new THREE.Vector3(w, k.s * 0.75, w)); tIM.setMatrixAt(i * TIERS + j, m);
          tIM.setColorAt(i * TIERS + j, new THREE.Color().setHSL(0.4 + k.c * 0.04, 0.32, 0.13 + k.c * 0.06 + j * 0.01));
          const sn = rnd(i * 7 + j) < 0.6 ? 1 : 0;
          m.compose(new THREE.Vector3(k.x + 0.05 * k.s, y + 0.12 * k.s, k.z + 0.08), q, new THREE.Vector3(w * 0.72 * sn + 1e-5, k.s * 0.22 * sn + 1e-5, w * 0.72 * sn + 1e-5)); sIM.setMatrixAt(i * TIERS + j, m);
        }
      }); }
    // nieve con espesor y borde irregular sobre el pozo (cornisa) + montoncitos
    const lipGeo = new THREE.CylinderGeometry(W_TOP - 0.05, W_TOP - 0.05, 0.34, 96, 2, true, Math.PI / 2, Math.PI);
    { const p = lipGeo.attributes.position as any; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const a = Math.atan2(x, z) * 3;
      const k = 1 - 0.03 * noise1(a * 2, 3);
      p.setXYZ(i, x * k, y < -0.01 ? y - 0.01 - 0.05 * noise1(a, 7) : y > 0.01 ? y + 0.03 * noise1(a * 1.5, 9) : y - 0.015 * noise1(a, 7), z * k); } lipGeo.computeVertexNormals(); }
    const lumps = Array.from({ length: 16 }, (_, i) => { const a = Math.PI / 2 + (i / 15) * Math.PI; const r = W_TOP + 0.12 + rnd(i + 60) * 0.12; return { x: Math.sin(a) * r, z: Math.min(-0.02, Math.cos(a) * r), s: 0.22 + rnd(i + 61) * 0.18 }; });

    // piezas de la olla para el corte
    const mirror = (pts: [number, number][], sx: number) => pts.map(([x, y]) => [x * sx * POT_S, y * POT_S] as [number, number]);
    const bodyCapR = shapeGeo(mirror(BODY_PROFILE, 1), 0.004), bodyCapL = shapeGeo(mirror(BODY_PROFILE, -1).reverse(), 0.004);
    const lidCapR = shapeGeo(mirror(LID_PROFILE, 1), 0.004), lidCapL = shapeGeo(mirror(LID_PROFILE, -1).reverse(), 0.004);
    const beansCap = shapeGeo([[0, 0.08 * POT_S], [0.93 * POT_S - 0.01, 0.08 * POT_S], [0.93 * POT_S - 0.01, 0.76 * POT_S], [0, 0.76 * POT_S]], 0.004);
    { const p = beansCap.attributes.position as any; const uv: number[] = []; for (let i = 0; i < p.count; i++) uv.push(p.getX(i) / 1.1, p.getY(i) / 0.9); beansCap.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); }
    const seamGeo = new THREE.TorusGeometry(1.045, 0.04, 8, 64); seamGeo.rotateX(Math.PI / 2);
    const seamCapGeo = new THREE.CircleGeometry(0.045 * POT_S, 12);
    const bailG = bailGeom();
    const hookG = tube([[0, 0, 0], [0.12, -0.05, 0], [0.14, -0.2, 0], [0.02, -0.26, 0], [-0.06, -0.16, 0]], 0.03, 24);

    return { forestMat, lipGeo, lumps, M, iron, faceGeo, snowGeo, wallGeo, floorGeo, rockIM, coalIM, coalData, logs, flames, steams, clods, waves, tIM, sIM, trIM, bodyCapR, bodyCapL, lidCapR, lidCapL, beansCap, seamGeo, seamCapGeo, bailG, hookG, clip };
  }, []);
  const geo = usePotGeoms();

  // ── actualizaciones por cuadro ──
  const pulse = 1 + 0.1 * Math.sin(t * 1.9) + 0.04 * Math.sin(t * 4.3 + 1);
  R.M.coal.emissiveIntensity = 1.35 * coalGlow * pulse;
  R.M.coalFace.emissiveIntensity = 0.55 * coalGlow * pulse; R.M.coalGhost.emissiveIntensity = 0.5 * coalGlow * pulse;
  R.M.coalTop.emissiveIntensity = 0.6 * coalGlow * pulse;
  R.M.rock.emissiveIntensity = 0.45 * heat * (0.8 + 0.2 * Math.sin(t * 2.2)) + 0.05 * fireAmt;
  R.M.log.emissiveIntensity = logsAmt * (0.25 + 0.6 * smooth(pCoals * 2)) * pulse;
  R.M.log.color.set("#6B4A2E").lerp(new THREE.Color("#2A2220"), smooth(pCoals * 1.5));
  R.M.skyNight.opacity = night; R.M.skyDawn.opacity = dawn; R.forestMat.color.set("#ffffff").lerp(new THREE.Color("#55648A"), night);
  R.M.burlap.opacity = 1 - burlapLift; R.M.burlapFace.opacity = 1 - burlapLift;

  // brasas: sobre el lecho (visibles por arriba) + unas sobre la tapa
  {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    R.coalData.forEach((c, i) => {
      let x = c.x, z = c.z, y = bedTop + c.dy - 0.03, s = c.s * (bedH > 0.05 ? 1 : 0);
      const onLid = i < 16;
      if (onLid) { const a = (i / 16) * Math.PI * 2 + 0.1, r = (0.25 + (i % 3) * 0.22) * POT_S; x = Math.cos(a) * r; z = Math.sin(a) * r; y = LID_TOP - 0.02 + (1 - Math.min(1, r)) * 0.05 + potY - POT_REST; s = c.s * smooth((pPot - 0.8) / 0.15) * (1 - burlapLift) * (potVisible ? 1 : 0); }
      else if (Math.hypot(x, z) < 0.95 * POT_S + 0.1 && potVisible && potIn > 0.9) { y = coalTop - 0.03; }
      else y = coalTop + c.dy - 0.03;
      if (!onLid && Math.hypot(x, z) > wAt(y) - 0.1) s = 0;
      e.set(c.r, c.r * 1.3, c.r * 0.7); q.setFromEuler(e);
      m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s + 1e-5, s * 0.7 + 1e-5, s + 1e-5)); R.coalIM.setMatrixAt(i, m);
    });
    R.coalIM.instanceMatrix.needsUpdate = true;
  }
  // llamas
  R.flames.forEach((f, i) => {
    const per = 0.55 + rnd(i + 3) * 0.4, ph = rnd(i + 4) * per, lt = ((t + ph) % per) / per, cyc = Math.floor((t + ph) / per);
    const x = (rnd(i * 7 + cyc) - 0.5) * 2.2, z = -0.25 - rnd(i * 5 + cyc) * 1.1;
    const h = (0.9 + rnd(i + 20) * 1.1) * (0.6 + 0.4 * fireAmt);
    f.position.set(x * (1 - lt * 0.3), bedTop + 0.1 + lt * h * 1.3, z);
    const sc = (1 - lt * 0.5) * (0.8 + rnd(i + 30) * 0.6);
    f.scale.set(sc * 0.8, sc * 2.1, 1);
    (f.material as any).opacity = fireAmt * Math.sin(lt * Math.PI) ** 0.7 * 0.9;
    f.visible = (f.material as any).opacity > 0.01;
  });
  // vapor: al desenterrar sube de la tierra y de la olla
  const steamAmt = smooth((pUp - 0.1) / 0.2) * (1 - smooth((pUp - 0.97) / 0.03) * 0.3);
  R.steams.forEach((sp, i) => {
    const per = 2.2 + rnd(i + 50) * 1.4, ph = rnd(i + 60) * per, lt = ((t + ph) % per) / per, cyc = Math.floor((t + ph) / per);
    const fromPot = potUp > 0.05;
    const x0 = (rnd(i * 3 + cyc) - 0.5) * (fromPot ? 1.7 : 3), z0 = -0.2 - rnd(i * 5 + cyc) * 0.8;
    const y0 = fromPot ? potY + RIM * POT_S : fillTop;
    sp.position.set(x0 + (noise1(t * 0.5 + i, i) - 0.5) * 0.6 * lt + lt * 0.4, y0 + lt * (2 + rnd(i + 70)), z0);
    const sc = 0.4 + lt * 1.5; sp.scale.set(sc, sc, 1);
    (sp.material as any).opacity = steamAmt * Math.sin(lt * Math.PI) ** 1.2 * 0.5;
    sp.visible = (sp.material as any).opacity > 0.01;
  });
  // terrones que caen (tapar) o suben (destapar)
  {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion();
    const falling = pBury > 0.18 && pBury < 0.97 ? 1 : 0, rising = pUp > 0.0 && pUp < 0.3 ? 1 : 0;
    for (let i = 0; i < 70; i++) {
      const per = 0.7 + rnd(i + 90) * 0.4, ph = rnd(i + 91) * per, lt = ((t + ph) % per) / per, cyc = Math.floor((t + ph) / per);
      const x1 = (rnd(i * 3 + cyc) - 0.5) * 2.6, z1 = -0.15 - rnd(i * 5 + cyc) * 1.2;
      let x: number, y: number, z = z1;
      if (falling) { x = 3.2 + (x1 - 3.2) * lt; y = 1.3 + (fillTop - 1.3) * lt * lt + Math.sin(lt * Math.PI) * 0.5; }
      else { x = x1 + (3.2 - x1) * lt; y = fillTop + (1.4 - fillTop) * lt + Math.sin(lt * Math.PI) * 0.6; }
      const s = (falling || rising) ? 0.05 + rnd(i + 92) * 0.06 : 0;
      m.compose(new THREE.Vector3(x, y, z), q.setFromEuler(new THREE.Euler(lt * 6 + i, i, 0)), new THREE.Vector3(s + 1e-5, s + 1e-5, s + 1e-5)); R.clods.setMatrixAt(i, m);
    }
    R.clods.instanceMatrix.needsUpdate = true;
  }
  // ondas de calor: de las piedras hacia la olla (delante del corte)
  R.waves.forEach((w, i) => {
    const side = i % 3; // 0 izq, 1 der, 2 abajo
    const per = 1.8, lt = ((t + (Math.floor(i / 3) * per) / 3) % per) / per;
    const potMid = POT_REST + 0.42;
    const yRow = potMid + (Math.floor(i / 3) - 1) * 0.3;
    if (side === 0) { w.position.set(-wAt(yRow) + 0.25 + lt * (wAt(yRow) - 0.25 - 1.04 * POT_S - 0.02), yRow, 0.06); w.rotation.set(0, 0, 0); }
    else if (side === 1) { w.position.set(wAt(yRow) - 0.25 - lt * (wAt(yRow) - 0.25 - 1.04 * POT_S - 0.02), yRow, 0.06); w.rotation.set(0, 0, Math.PI); }
    else { w.position.set((Math.floor(i / 3) - 1) * 0.5, -PIT_D + 0.25 + lt * (POT_REST + PIT_D - 0.3), 0.06); w.rotation.set(0, 0, Math.PI / 2); }
    const sc = side === 2 ? 0.8 : 1.0; w.scale.set(sc, sc, 1);
    (w.material as any).opacity = heat * Math.sin(lt * Math.PI) * 0.95;
    w.visible = (w.material as any).opacity > 0.01;
  });

  // tapas del corte (se rehacen con los niveles)
  const q2 = (x: number) => Math.round(x * 200) / 200;
  const cT = q2(coalTop), pB = q2(potY), fT = q2(fillTop), bT = q2(bedTop);
  const coalCap = useMemo(() => {
    const top = Math.max(-PIT_D + 0.02, cT);
    const potBot = pB, potTopY = pB + (RIM + 0.155) * POT_S;
    const px = 1.035 * POT_S;
    let pts: [number, number][];
    void potBot; void potTopY; void px;
    pts = trap(-PIT_D, top);
    return worldUV(shapeGeo(pts, 0.002), -2, 2, 0, -1);
  }, [cT, pB, potVisible]);
  const dirtCap = useMemo(() => {
    if (fillFrac < 0.002) return null;
    const bl = burlapLine(0.185 + (pB - POT_REST));
    const top = [...bl].reverse().map(([x, y]) => [Math.sign(x) * wAt(fT) * Math.min(1, Math.abs(x) / Math.max(0.01, wAt(COAL_SIDE) - 0.02)), Math.max(fT, y + 0.001)] as [number, number]);
    return worldUV(shapeGeo([...bl, ...top], 0.003), -2, 2, 0, -1);
  }, [fT, pB, fillFrac < 0.002]);
  const burlapCap = useMemo(() => {
    const bl = burlapLine(0.19), lo = burlapLine(-0.005).reverse();
    return worldUV(shapeGeo([...bl, ...lo], 0.0045), -2, 2, 0, -1);
  }, []);
  const burlapGeo = useMemo(() => {
    const g = new THREE.RingGeometry(0.001, wAt(COAL_SIDE) - 0.03, 64, 16); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as any;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z);
      const k = smooth((r - 1.0 * POT_S) / 0.28);
      const y = (LID_TOP + 0.05 - 0.12 * (r / (1.04 * POT_S)) ** 2) * (1 - k) + (COAL_SIDE + 0.06) * k + 0.02 * Math.sin(x * 9 + z * 7);
      p.setY(i, y);
    }
    g.computeVertexNormals(); return g;
  }, []);
  void bT;

  // luz
  const sunCol = new THREE.Color("#FFF1D8").lerp(new THREE.Color("#9FB4E0"), night).lerp(new THREE.Color("#FFC08A"), dawn * (1 - night) * 0.8);
  const hemiSky = new THREE.Color("#EAF1FA").lerp(new THREE.Color("#8A9CC4"), night);
  const pitLight = (fireAmt * 12 + coalGlow * 6 * (has("coals") || has("fire") ? smooth(pCoals * 2 + pFire) : 1)) * (1 - fillFrac) * (burlapOn ? 0.4 : 1);
  const flick = 1 + 0.15 * Math.sin(t * 13) + 0.1 * Math.sin(t * 29);

  // ── rótulos (HTML) ──
  const lbls: { at: number; text: string; target?: BeanHoleTarget; dur?: number }[] = labels ?? (() => {
    const L: { at: number; text: string; target?: BeanHoleTarget; dur?: number }[] = [];
    const s = (x: BeanHoleStage) => startOf(x);
    if (s("dig") != null) L.push({ at: s("dig")! + 0.5, text: "3 feet deep", target: "depth" }, { at: s("dig")! + Math.min(1.3, ((s("fire") ?? dur) - s("dig")!) * 0.55), text: "Lined with stones", target: "stones" });
    if (s("fire") != null) L.push({ at: s("fire")! + 0.4, text: "Hardwood fire", target: "fire" });
    if (s("coals") != null) L.push({ at: s("coals")! + 0.6, text: "2 feet of coals", target: "coals" });
    if (s("pot") != null) L.push({ at: s("pot")! + 1.2, text: "Sealed with flour paste", target: "seam" });
    if (s("bury") != null) L.push({ at: s("bury")! + 0.3, text: "Wet burlap", target: "burlap" }, { at: s("bury")! + 1.4, text: "Then dirt", target: "dirt" });
    if (s("night") != null) L.push({ at: s("night")! + 0.6, text: "Hot stones", target: "stones" });
    if (s("dig-up") != null) L.push({ at: s("dig-up")! + 0.8, text: "Sunday breakfast", target: "pot" });
    return L;
  })();
  const sorted = [...lbls].sort((a, b) => a.at - b.at);
  const clockOn = interpolate(pNight, [0.02, 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - smooth((pUp - 0.85) / 0.15));
  const hrs = parseClock(clockFrom), hrsTo0 = parseClock(clockTo); const hrsTo = hrsTo0 < hrs ? hrsTo0 + 168 : hrsTo0;
  const clockNow = hrs + (hrsTo - hrs) * (pUp > 0 ? 1 : interpolate(pNight, [0.12, 0.95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#DCE7F0" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: FOV, position: pos, near: 0.1, far: 200 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={pos} target={target} fov={FOV} clip />
        <hemisphereLight args={[hemiSky, "#7A5A3C", 1.05 - 0.2 * night]} />
        <directionalLight position={[-4, 7, 6]} intensity={2.0 - 0.6 * night} color={sunCol} />
        {/* luz de relleno frontal: el corte siempre legible, también de noche */}
        <directionalLight position={[1, 0.5, 10]} intensity={0.85 + 0.25 * night} color="#FFF4E4" />
        <pointLight position={[0, -2.2, -0.4]} intensity={pitLight * flick} distance={0} decay={1.4} color="#FF7A2E" />

        {/* cielo, bosque y nieve */}
        <mesh position={[0, 18, -60]} material={R.M.skyDay}><planeGeometry args={[260, 80]} /></mesh>
        <mesh position={[0, 18, -59.9]} material={R.M.skyNight}><planeGeometry args={[260, 80]} /></mesh>
        <mesh position={[0, 18, -59.8]} material={R.M.skyDawn}><planeGeometry args={[260, 80]} /></mesh>
        <mesh geometry={R.snowGeo} material={R.M.snow} />
        <mesh material={R.forestMat} position={[0, 6, -38]}><planeGeometry args={[150, 32]} /></mesh>
        <primitive object={R.trIM} />
        <primitive object={R.tIM} />
        <primitive object={R.sIM} />
        {/* montículo de la tierra sacada + pala */}
        <mesh material={R.M.mound} position={[3.35, 0, -1.5]} scale={[1.35, 0.75 * moundAmt + 0.02, 1.0]}><sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
        <group position={[4.1, 0.25, -1.2]} rotation={[0.1, 0.4, -0.35]}>
          <mesh material={R.M.handle} position={[0, 1.0, 0]}><cylinderGeometry args={[0.045, 0.045, 2.2, 8]} /></mesh>
          <mesh material={R.M.hook} position={[0, -0.12, 0]}><boxGeometry args={[0.42, 0.5, 0.04]} /></mesh>
        </group>

        <mesh geometry={R.lipGeo} material={R.M.snow} position={[0, -0.14, 0]} />
        {R.lumps.map((l, i) => <mesh key={i} material={R.M.snow} position={[l.x, 0, l.z]} scale={[l.s * 1.2, l.s * 0.32, l.s * 0.9]}><sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>)}
        {/* el corte */}
        <mesh geometry={R.faceGeo} material={R.M.face} />
        <mesh geometry={R.wallGeo} material={R.M.wall} position={[0, -PIT_D / 2, 0]} />
        <mesh geometry={R.floorGeo} material={R.M.floor} position={[0, -PIT_D, 0]} />
        <primitive object={R.rockIM} />

        {/* fuego */}
        {logsAmt > 0.01 ? R.logs.map((l, i) => (
          <mesh key={i} material={R.M.log} position={[l.x, l.y, l.z]} rotation={[0, l.ry, Math.PI / 2 + l.rz]} scale={[0.4 + 0.6 * logsAmt, 0.3 + 0.7 * logsAmt, 0.4 + 0.6 * logsAmt]}><cylinderGeometry args={[0.13, 0.13, l.len, 10]} /></mesh>
        )) : null}
        {R.flames.map((f, i) => <primitive key={i} object={f} />)}

        {/* brasas: lecho (tapa del corte + superficie) */}
        {bedH > 0.03 ? (
          <>
            <mesh geometry={coalCap} material={R.M.coalFace} />
            <mesh material={R.M.coalTop} position={[0, coalTop - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[wAt(coalTop) - 0.02, 48]} /></mesh>

          </>
        ) : null}
        <primitive object={R.coalIM} />

        {/* la olla, cortada al medio */}
        {potVisible ? (
          <group position={[0, potY, 0]}>
            <group scale={[POT_S, POT_S, POT_S]}>
              <IronPot mats={R.iron} geo={geo} lid={{ y: 0 }} bail={bail} bailGeo={R.bailG}>
                <mesh geometry={R.seamGeo} material={R.M.paste} position={[0, RIM + 0.005, 0]} />
              </IronPot>
            </group>
            {/* cuarto cortado: cara z=0 (x>0) y cara x=0 (z>0) */}
            {[0, 1].map((k) => (
              <group key={k} rotation={[0, k ? -Math.PI / 2 : 0, 0]}>
                <mesh geometry={R.bodyCapR} material={R.M.ironFace} position={[0, 0, k ? 0.002 : 0]} />
                <mesh geometry={R.beansCap} material={R.M.beansFace} position={[0, 0, k ? 0.002 : 0]} />
                <group position={[0, RIM * POT_S, k ? 0.002 : 0]}><mesh geometry={R.lidCapR} material={R.M.ironFace} /></group>
                <mesh geometry={R.seamCapGeo} material={R.M.pasteFace} position={[1.045 * POT_S, (RIM + 0.005) * POT_S, 0.008]} />
              </group>
            ))}
            {/* gancho y vara */}
            {hookDown > 0.01 ? (
              <group position={[0, 0.7 * POT_S + 0.95 * POT_S + (1 - hookDown) * 5, 0]}>
                <mesh geometry={R.hookG} material={R.M.hook} position={[0, 0.2, 0]} />
                <mesh material={R.M.hook} position={[0, 3.2, 0]}><cylinderGeometry args={[0.035, 0.035, 6, 8]} /></mesh>
              </group>
            ) : null}
          </group>
        ) : null}

        {/* arpillera mojada y tierra */}
        {burlapOn ? <mesh geometry={burlapGeo} material={R.M.burlap} position={[0, (1 - burlapDrop) * 2.5 + burlapLift * 4 + (potY - POT_REST), 0]} /> : null}
        {burlapOn ? <mesh geometry={burlapCap} material={R.M.burlapFace} position={[0, (1 - burlapDrop) * 2.5 + burlapLift * 4 + (potY - POT_REST), 0]} /> : null}
        {dirtCap && fillFrac >= 0.002 ? (
          <>
            <mesh geometry={dirtCap} material={R.M.dirtFace} />
            <mesh material={R.M.dirt} position={[0, fillTop, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[wAt(fillTop) - 0.02, 48]} /></mesh>
            <mesh material={R.M.dirtGhost} position={[0, (fillTop + COAL_SIDE) / 2, 0]}><cylinderGeometry args={[wAt(fillTop) - 0.02, wAt(COAL_SIDE) - 0.02, Math.max(0.01, fillTop - COAL_SIDE), 40, 1, true, -Math.PI / 2, Math.PI]} /></mesh>
          </>
        ) : null}
        <primitive object={R.clods} />
        {R.waves.map((w, i) => <primitive key={i} object={w} />)}
        {R.steams.map((s, i) => <primitive key={i} object={s} />)}
      </ThreeCanvas>

      {/* cota "3 FEET" */}
      <DepthLine pos={pos} target={target} fov={FOV} W={width} H={height} lbls={sorted} t={t} />
      {sorted.map((L, i) => {
        const next = sorted[i + 1]?.at ?? 1e9;
        const end = L.dur != null ? L.at + L.dur : next;
        const a = interpolate(t, [L.at, L.at + 0.45, end - 0.05, end + 0.3], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        if (a <= 0.001) return null;
        return <Callout key={i} text={L.text} target={L.target ?? "none"} a={a} pos={pos} tgt={target} fov={FOV} W={width} H={height} potY={potY} avoidTop={clockOn > 0.01} />;
      })}
      {clockOn > 0.01 ? <NightClock text={fmtClock(clockNow)} hrs={clockNow} a={clockOn} label={clockLabel} /> : null}
    </AbsoluteFill>
  );
};

const Callout: React.FC<{ text: string; target: BeanHoleTarget; a: number; pos: [number, number, number]; tgt: [number, number, number]; fov: number; W: number; H: number; potY: number; avoidTop?: boolean }> = ({ text, target, a, pos, tgt, fov, W, H, potY, avoidTop }) => {
  if (target === "depth") return null; // lo dibuja DepthLine
  let pt: [number, number] | null = null;
  if (target !== "none") {
    const w = TARGETS[target];
    const wp: [number, number, number] = target === "pot" || target === "seam" ? [w[0], w[1] - POT_REST + potY, w[2]] : w;
    pt = projectTo(wp, pos, tgt, fov, W, H);
  }
  const left = pt ? pt[0] < W / 2 : true;
  const boxW = 480;
  const bx = left ? 50 : W - 50 - boxW;
  const by = pt ? Math.max(!left && avoidTop ? 270 : 60, Math.min(H - 210, pt[1] - 150)) : 70;
  const anchor: [number, number] = [left ? bx + boxW - 30 : bx + 30, by + 62];
  const draw = clamp01((a - 0.3) / 0.7);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pt ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line x1={anchor[0]} y1={anchor[1]} x2={anchor[0] + (pt[0] - anchor[0]) * draw} y2={anchor[1] + (pt[1] - anchor[1]) * draw} stroke={OLE.paper} strokeWidth={9} strokeLinecap="round" opacity={a} />
          <line x1={anchor[0]} y1={anchor[1]} x2={anchor[0] + (pt[0] - anchor[0]) * draw} y2={anchor[1] + (pt[1] - anchor[1]) * draw} stroke={OLE.plaid} strokeWidth={4} strokeLinecap="round" opacity={a} />
          <circle cx={pt[0]} cy={pt[1]} r={14 * draw} fill={OLE.paper} opacity={a} />
          <circle cx={pt[0]} cy={pt[1]} r={8 * draw} fill={OLE.plaid} opacity={a} />
        </svg>
      ) : null}
      <div style={{ position: "absolute", left: bx, top: by, width: boxW, display: "flex", justifyContent: left ? "flex-start" : "flex-end", opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
        <div style={{ ...kraftBg(OLE.paper), padding: "22px 36px 20px", borderRadius: 6, border: `2px solid ${OLE.line}`, boxShadow: `0 12px 26px ${hexA(OLE.forest2, 0.3)}`, transform: `rotate(${left ? -1.5 : 1.5}deg)` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 54, letterSpacing: 3, color: OLE.forest, lineHeight: 1.05, textTransform: "uppercase", maxWidth: 400 }}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const DepthLine: React.FC<{ pos: [number, number, number]; target: [number, number, number]; fov: number; W: number; H: number; lbls: { at: number; text: string; target?: BeanHoleTarget; dur?: number }[]; t: number }> = ({ pos, target, fov, W, H, lbls, t }) => {
  const i = lbls.findIndex((l) => l.target === "depth");
  if (i < 0) return null;
  const L = lbls[i]; const next = lbls[i + 1]?.at ?? 1e9; const end = L.dur != null ? L.at + L.dur : next;
  const a = interpolate(t, [L.at, L.at + 0.45, end - 0.05, end + 0.3], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  if (a <= 0.001) return null;
  const top = projectTo([-W_TOP - 0.45, 0, 0.05], pos, target, fov, W, H), bot = projectTo([-W_TOP - 0.45, -PIT_D, 0.05], pos, target, fov, W, H);
  const d = clamp01((a - 0.1) / 0.9);
  const yb = top[1] + (bot[1] - top[1]) * d;
  const x = top[0];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g opacity={a} stroke={OLE.paper} strokeWidth={10} strokeLinecap="round"><line x1={x} y1={top[1]} x2={x} y2={yb} /><line x1={x - 26} y1={top[1]} x2={x + 26} y2={top[1]} /><line x1={x - 26} y1={yb} x2={x + 26} y2={yb} /></g>
        <g opacity={a} stroke={OLE.plaid} strokeWidth={5} strokeLinecap="round"><line x1={x} y1={top[1]} x2={x} y2={yb} /><line x1={x - 24} y1={top[1]} x2={x + 24} y2={top[1]} /><line x1={x - 24} y1={yb} x2={x + 24} y2={yb} /></g>
      </svg>
      <div style={{ position: "absolute", left: x - 40 - 520, top: (top[1] + bot[1]) / 2 - 60, width: 520, display: "flex", justifyContent: "flex-end", opacity: a }}>
        <div style={{ ...kraftBg(OLE.paper), padding: "22px 34px 20px", borderRadius: 6, border: `2px solid ${OLE.line}`, boxShadow: `0 12px 26px ${hexA(OLE.forest2, 0.3)}`, transform: "rotate(-1.5deg)" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 4, color: OLE.forest, lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{L.text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const NightClock: React.FC<{ text: string; hrs: number; a: number; label?: string }> = ({ text, hrs, a, label }) => {
  const h = hrs % 12, mAng = (hrs % 1) * 360, hAng = (h / 12) * 360;
  return (
    <div style={{ position: "absolute", right: 70, top: 60, opacity: a, transform: `translateY(${(1 - a) * -20}px)`, display: "flex", alignItems: "center", gap: 22, ...kraftBg(OLE.paper), padding: "18px 30px 18px 20px", borderRadius: 8, border: `2px solid ${OLE.line}`, boxShadow: `0 12px 26px ${hexA(OLE.forest2, 0.35)}` }}>
      <svg width={120} height={120} viewBox="-60 -60 120 120">
        <circle r={56} fill={OLE.forest} /><circle r={48} fill={OLE.cream} />
        {Array.from({ length: 12 }).map((_, i) => { const an = (i / 12) * Math.PI * 2; return <line key={i} x1={Math.sin(an) * 40} y1={-Math.cos(an) * 40} x2={Math.sin(an) * 46} y2={-Math.cos(an) * 46} stroke={OLE.pencil} strokeWidth={i % 3 === 0 ? 4 : 2} />; })}
        <g transform={`rotate(${hAng})`}><line x1={0} y1={6} x2={0} y2={-26} stroke={OLE.iron} strokeWidth={6} strokeLinecap="round" /></g>
        <g transform={`rotate(${mAng})`}><line x1={0} y1={8} x2={0} y2={-38} stroke={OLE.plaid} strokeWidth={4} strokeLinecap="round" /></g>
        <circle r={5} fill={OLE.iron} />
      </svg>
      <div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 66, letterSpacing: 4, color: OLE.forest, lineHeight: 1, whiteSpace: "nowrap" }}>{text}</div>
        {label ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: OLE.plaid, marginTop: 4 }}>{label}</div> : null}
      </div>
    </div>
  );
};
export default OleBeanHole3D;
