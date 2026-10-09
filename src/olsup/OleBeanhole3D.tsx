// OleBeanhole3D — CORTE TRANSVERSAL del pozo de frijoles ("beanhole beans").
// Nieve arriba, tierra en capas, cama de brasas, olla de hierro con tapa (vista interior: frijoles, salt pork, cebolla).
// Secuencia (7 etapas, una por rótulo): cavar 3 ft → encender fuego → brasas → entra la olla → tapar (brasas + tierra)
// → pasa la noche (sol/luna/reloj, vapor) → desenterrar la olla humeante. Todo por useCurrentFrame.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { HAND, OLE, SLAB, rnd } from "./OleSupTheme";
import { CamRig, Motes, Steam, V3, blobs, canvasTex, clamp01, dots, ease, flameTex, flick, softTex } from "./Ole3DKit";

export type OleBeanhole3DProps = {
  /** rótulos cortos (≤ 5 palabras), uno por etapa. Por defecto los 7 de abajo */
  steps?: string[];
  /** frames por etapa (default 80) */
  stepEvery?: number;
  /** etapa (0-6) en la que arranca; las anteriores ya están completadas (pozo, brasas, olla...) (default 0) */
  startStep?: number;
  /** mostrar la cota de profundidad (default FALSE: dato sin verificar) */
  showDepth?: boolean;
  /** texto de la cota */
  depthLabel?: string;
};
export const BEANHOLE_STEPS = ["Dig the hole", "Build the fire", "Coals for a bed", "Pot goes in", "Bury it", "Wait all night", "Dig it up"];
export const beanholeFrames = (stepEvery = 80, startStep = 0) => Math.round(stepEvery * (7 - startStep)) + 50;

// ─── geometría (1 unidad = 1 pie) ───
const XW = 7.5, BOT = 4.8, PW = 2.4, PD = 3.0, ZB = 1.5, ZPIT = 0.7;
const SC = 128; // px por pie en la textura del corte
const CW = XW * 2 * SC, CH = BOT * SC;
const px = (x: number) => (x + XW) * SC, py = (y: number) => -y * SC;
const POT_R = 0.58, POT_H = 1.0, BED_TOP0 = -PD;

// capas del terreno (y descendente)
const LAYERS: [number, number, string, string][] = [
  [0, -0.32, "#DCE6F0", "#B9CADB"],   // nieve
  [-0.32, -0.7, "#8C8E92", "#6E7176"],  // costra helada
  [-0.7, -1.75, "#43301F", "#2E2015"],  // tierra negra
  [-1.75, -3.35, "#7B5636", "#5E4028"], // subsuelo
  [-3.35, -BOT, "#94795A", "#6F583F"],  // arcilla y piedras
];

function useBeanTex() {
  return useMemo(() => {
    const sec = canvasTex((c, W, H) => {
      LAYERS.forEach(([y0, y1, a, b], i) => {
        const g = c.createLinearGradient(0, py(y0), 0, py(y1)); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g;
        c.beginPath(); c.moveTo(0, py(y0)); for (let x = 0; x <= W; x += 32) c.lineTo(x, py(y0) + (i ? Math.sin(x * 0.011 + i * 3) * 5 + (rnd(x + i * 999) - 0.5) * 4 : 0)); c.lineTo(W, py(y1)); c.lineTo(0, py(y1)); c.closePath(); c.fill();
      });
      // nieve: destellos y sombras azules
      dots(c, W, H, 3, 700, "#FFFFFF", 1, 3, 0.7); dots(c, W, H, 4, 300, "#9FB6CE", 2, 6, 0.35);
      // costra helada
      dots(c, W, H, 5, 500, "#B7C4D2", 1, 3, 0.4); dots(c, W, H, 6, 500, "#4C4E52", 1, 4, 0.35);
      // tierra negra: grumos y raíces
      dots(c, W, H, 7, 2600, "#1F150D", 1, 5, 0.5); dots(c, W, H, 8, 1600, "#5C432B", 1, 4, 0.4);
      c.strokeStyle = "rgba(160,120,80,0.5)"; c.lineWidth = 2;
      for (let i = 0; i < 46; i++) { let x = rnd(i * 7) * W, y = py(-0.75 - rnd(i * 7 + 1) * 0.9); c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (rnd(i * 13 + k) - 0.5) * 34; y += rnd(i * 17 + k) * 16; c.lineTo(x, y); } c.stroke(); }
      // subsuelo
      dots(c, W, H, 9, 2600, "#4A301B", 1, 5, 0.45); dots(c, W, H, 10, 1800, "#9A7550", 1, 4, 0.4);
      // arcilla y piedras
      dots(c, W, H, 11, 1500, "#5C472F", 1, 5, 0.5);
      blobs(c, 500, 60, W / 2, py(-4.05), W * 0.5, ["#8B8F93", "#6E7175", "#A29E96", "#57595D"], 7, 20, 0.7);
      // congelamiento: filo de escarcha en el borde superior
      c.fillStyle = "rgba(255,255,255,0.65)"; c.fillRect(0, 0, W, 3);
    }, CW, CH);
    const earth = canvasTex((c, W) => { c.fillStyle = "#4A311E"; c.fillRect(0, 0, W, W); dots(c, W, W, 5, 800, "#2A1A0F", 1, 6, 0.6); dots(c, W, W, 6, 500, "#7B5636", 1, 5, 0.5); }, 256, 256, [2, 4]);
    const snowTop = canvasTex((c, W) => { const g = c.createLinearGradient(0, 0, W, W); g.addColorStop(0, "#EAF2FA"); g.addColorStop(1, "#C9D8E8"); c.fillStyle = g; c.fillRect(0, 0, W, W); dots(c, W, W, 3, 600, "#FFFFFF", 1, 4, 0.8); dots(c, W, W, 4, 200, "#9DB4CC", 2, 8, 0.3); }, 512, 512, [6, 1]);
    const mound = canvasTex((c, W) => { c.fillStyle = "#4A311E"; c.fillRect(0, 0, W, W); dots(c, W, W, 5, 700, "#2A1A0F", 1, 6, 0.6); dots(c, W, W, 6, 500, "#87603C", 1, 5, 0.5); dots(c, W, W, 7, 150, "#DCE6F0", 2, 6, 0.6); }, 256);
    const beans = canvasTex((c, W, H) => {
      c.fillStyle = "#3A1C0B"; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 700; i++) { const x = rnd(i * 3) * W, y = rnd(i * 3 + 1) * H; c.save(); c.translate(x, y); c.rotate(rnd(i + 4) * 6.3); c.fillStyle = ["#7A4420", "#69381A", "#8A5128", "#55290F", "#94592B"][i % 5]; c.beginPath(); c.ellipse(0, 0, 13, 8, 0, 0, 6.3); c.fill(); c.fillStyle = "rgba(255,210,150,0.4)"; c.beginPath(); c.ellipse(-3, -2, 5, 2.4, 0, 0, 6.3); c.fill(); c.restore(); }
      // salt pork: tocino con vetas
      c.save(); c.translate(W * 0.55, H * 0.22); c.rotate(-0.12); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#F0D2C0" : "#B0554A"; c.fillRect(-48, -20 + i * 7, 96, 7); } c.strokeStyle = "#5A2A20"; c.lineWidth = 3; c.strokeRect(-48, -20, 96, 42); c.restore();
      // cebolla: aros
      c.save(); c.translate(W * 0.2, H * 0.3); c.strokeStyle = "#F4E6B0"; c.lineWidth = 6; for (let r = 30; r > 6; r -= 9) { c.beginPath(); c.arc(0, 0, r, 0, 6.3); c.stroke(); } c.restore();
      blobs(c, 900, 4, W * 0.5, H * 0.65, W * 0.3, ["#F3E3A6"], 12, 18, 0.5);
      c.fillStyle = "rgba(255,190,110,0.12)"; c.fillRect(0, 0, W, 6);
    }, 320, 256);
    const beanTop = canvasTex((c, W) => { c.fillStyle = "#3A1C0B"; c.fillRect(0, 0, W, W); for (let i = 0; i < 260; i++) { c.save(); c.translate(rnd(i * 3) * W, rnd(i * 3 + 1) * W); c.rotate(rnd(i + 4) * 6.3); c.fillStyle = ["#7A4420", "#69381A", "#8A5128", "#55290F"][i % 4]; c.beginPath(); c.ellipse(0, 0, 12, 7, 0, 0, 6.3); c.fill(); c.restore(); } blobs(c, 950, 3, W * 0.5, W * 0.5, W * 0.25, ["#E2BFA8"], 16, 24, 0.6); }, 256);
    const sky = canvasTex((c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7E8A9C"); g.addColorStop(1, "#FFFFFF"); c.fillStyle = g; c.fillRect(0, 0, W, H); }, 16, 256);
    const moon = canvasTex((c, W) => { c.fillStyle = "#E8ECF2"; c.beginPath(); c.arc(W / 2, W / 2, W / 2 - 2, 0, 6.3); c.fill(); dots(c, W, W, 5, 14, "#B3BAC6", 3, 12, 0.55); }, 128);
    const iron = canvasTex((c, W, H) => { c.fillStyle = "#302C29"; c.fillRect(0, 0, W, H); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,255,255,${0.03 + rnd(i) * 0.05})`; c.fillRect(0, rnd(i + 2) * H, W, 1 + rnd(i + 4) * 5); } dots(c, W, H, 11, 500, "#5A544E", 0.6, 2, 0.6); dots(c, W, H, 12, 300, "#0F0D0B", 0.6, 3, 0.7); }, 256);
    return { sec, earth, snowTop, mound, beans, beanTop, sky, moon, iron };
  }, []);
}

// ─── el corte: se redibuja por cuadro ───
type SecState = { digD: number; bedH: number; coverTop: number; earthTop: number; potBottom: number; glow: number; frame: number; potIn: boolean };
function drawSection(c: CanvasRenderingContext2D, base: any, S: SecState) {
  c.globalCompositeOperation = "source-over"; c.clearRect(0, 0, CW, CH);
  c.drawImage(base.image, 0, 0);
  const x0 = px(-PW / 2), x1 = px(PW / 2);
  // pozo abierto
  if (S.digD > 0.01) {
    c.globalCompositeOperation = "destination-out"; c.fillStyle = "#000";
    const yb = py(-S.digD);
    c.beginPath(); c.moveTo(x0, -2); c.lineTo(x1, -2); c.lineTo(x1, yb - 8); c.quadraticCurveTo(x1, yb, x1 - 8, yb); c.lineTo(x0 + 8, yb); c.quadraticCurveTo(x0, yb, x0, yb - 8); c.closePath(); c.fill();
    c.globalCompositeOperation = "source-over";
  }
  const potTop = S.potBottom + POT_H + 0.15;
  const fillRect = (yTop: number, yBot: number, draw: (yt: number, yb: number) => void) => { if (yTop > yBot + 0.005) draw(py(yTop), py(yBot)); };
  const glowA = S.glow;
  const coalDraw = (yt: number, yb: number, seed: number, dens: number) => {
    const h = yb - yt;
    const g = c.createLinearGradient(0, yt, 0, yb); g.addColorStop(0, `rgb(${Math.round(90 + 90 * glowA)},${Math.round(28 + 26 * glowA)},10)`); g.addColorStop(1, `rgb(${Math.round(60 + 60 * glowA)},18,8)`);
    c.fillStyle = g; c.fillRect(x0, yt, x1 - x0, h);
    const n = Math.round(((x1 - x0) * h) / 420 * dens);
    for (let i = 0; i < n; i++) {
      const x = x0 + 6 + rnd(seed + i * 3) * (x1 - x0 - 12), y = yt + rnd(seed + i * 3 + 1) * h, r = 8 + rnd(seed + i * 3 + 2) * 12;
      const fl = 0.55 + 0.45 * Math.sin(S.frame * 0.35 + i * 1.7) * Math.sin(S.frame * 0.13 + i);
      const gg = c.createRadialGradient(x, y, 1, x, y, r * 1.5); gg.addColorStop(0, `rgba(255,${Math.round(150 + 80 * glowA * fl)},50,${0.55 * glowA})`); gg.addColorStop(1, "rgba(200,40,0,0)");
      c.fillStyle = gg; c.fillRect(x - r * 1.5, y - r * 1.5, r * 3, r * 3);
      c.fillStyle = rnd(seed + i) > 0.5 ? "#1E0F0A" : "#2C1610"; c.beginPath(); c.ellipse(x, y, r, r * 0.72, rnd(seed + i * 7) * 3, 0, 6.3); c.fill();
      c.strokeStyle = `rgba(255,${Math.round(120 + 100 * fl)},40,${(0.35 + 0.5 * fl) * glowA})`; c.lineWidth = 2; c.beginPath(); c.moveTo(x - r * 0.6, y); c.lineTo(x + r * 0.1, y - r * 0.4); c.lineTo(x + r * 0.55, y + r * 0.15); c.stroke();
    }
  };
  // cama de brasas
  if (S.bedH > 0.01) fillRect(BED_TOP0 + S.bedH, BED_TOP0 - 0.02, (yt, yb) => coalDraw(yt, yb, 100, 1));
  const bedTop = BED_TOP0 + S.bedH;
  // brasas sobre la olla (cobertura)
  if (S.coverTop > bedTop + 0.02) fillRect(S.coverTop, bedTop, (yt, yb) => coalDraw(yt, yb, 700, 1.1));
  // tierra encima
  if (S.earthTop > S.coverTop + 0.01) {
    fillRect(S.earthTop, Math.max(S.coverTop, bedTop), (yt, yb) => {
      const g = c.createLinearGradient(0, yt, 0, yb); g.addColorStop(0, "#6E4C2E"); g.addColorStop(1, "#4A3220"); c.fillStyle = g; c.fillRect(x0, yt, x1 - x0, yb - yt);
      c.save(); c.beginPath(); c.rect(x0, yt, x1 - x0, yb - yt); c.clip();
      dots(c, CW, CH, 300, 1400, "#2A1A0F", 2, 7, 0.55); dots(c, CW, CH, 301, 1000, "#9A7048", 2, 6, 0.5);
      c.restore();
    });
  }
  // sombra de las paredes del pozo
  if (S.digD > 0.01) {
    const yb = py(-S.digD);
    const gl = c.createLinearGradient(x0 - 22, 0, x0 + 4, 0); gl.addColorStop(0, "rgba(0,0,0,0)"); gl.addColorStop(1, "rgba(0,0,0,0.5)"); c.fillStyle = gl; c.fillRect(x0 - 22, 0, 26, yb);
    const gr = c.createLinearGradient(x1 - 4, 0, x1 + 22, 0); gr.addColorStop(0, "rgba(0,0,0,0.5)"); gr.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = gr; c.fillRect(x1 - 4, 0, 26, yb);
  }
  // ventana a la olla (siluetas: cuerpo + tapa)
  if (S.potIn) {
    c.globalCompositeOperation = "destination-out"; c.fillStyle = "#000";
    const pw = POT_R + 0.03;
    c.fillRect(px(-pw), py(potTop + 0.02), pw * 2 * SC, (potTop - S.potBottom + 0.05) * SC);
    c.globalCompositeOperation = "source-over";
  }
}


export const OleBeanhole3D: React.FC<OleBeanhole3DProps> = ({ steps = BEANHOLE_STEPS, stepEvery = 80, startStep = 0, showDepth = false, depthLabel = "about 3 ft" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const st = startStep + frame / stepEvery;
  const TX = useBeanTex();
  const M = useMemo(() => ({
    earth: new THREE.MeshStandardMaterial({ map: TX.earth, roughness: 1 }),
    snow: new THREE.MeshStandardMaterial({ map: TX.snowTop, roughness: 0.9 }),
    backWall: new THREE.MeshStandardMaterial({ map: TX.earth, roughness: 1, color: "#B8A898", emissive: "#4A3020", emissiveIntensity: 0.55 }),
    mound: new THREE.MeshStandardMaterial({ map: TX.mound, roughness: 1 }),
    iron: new THREE.MeshStandardMaterial({ map: TX.iron, color: "#B0A9A0", roughness: 0.5, metalness: 0.35, side: THREE.DoubleSide }),
    ironDark: new THREE.MeshStandardMaterial({ color: "#1c1917", roughness: 0.55, metalness: 0.4 }),
    beanCut: new THREE.MeshBasicMaterial({ map: TX.beans, color: "#C8AA96", toneMapped: false }),
    beanTop: new THREE.MeshBasicMaterial({ map: TX.beanTop, color: "#C8AA96", toneMapped: false }),
    beanSide: new THREE.MeshStandardMaterial({ color: "#4A2410", roughness: 0.4, side: THREE.DoubleSide }),
    log: new THREE.MeshStandardMaterial({ color: "#6B4526", roughness: 0.95 }),
    shovel: new THREE.MeshStandardMaterial({ color: "#8E979E", roughness: 0.4, metalness: 0.6 }),
    handle: new THREE.MeshStandardMaterial({ color: "#A9793F", roughness: 0.8 }),
  }), [TX]);

  // ── línea de tiempo ──
  const digD = PD * ease(st / 0.95);
  const dug = digD > 0.02;
  const fireI = ease((st - 1.05) / 0.4) * (1 - ease((st - 1.95) / 0.5));
  const burn = clamp01((st - 1.4) / 1.0);
  const bedH = 0.42 * ease((st - 1.6) / 1.3);
  const potRest = BED_TOP0 + 0.42;
  const dropP = ease((st - 3.05) / 0.5);
  const lift = ease((st - 6.62) / 0.38);
  let bounce = 0; { const bt = (st - 3.55) / 0.2; if (bt > 0 && bt < 1) bounce = Math.sin(bt * Math.PI) * 0.06; }
  const potBottom = st < 3.05 ? potRest + 7 : potRest + (1 - dropP) * 7 + lift * 2.85 + bounce;
  const potIn = st >= 3.02;
  const lidOff = (1 - ease((st - 3.55) / 0.22)) * 1.0;
  const coverTop = st < 4.6 ? BED_TOP0 + bedH + (-1.15 - (BED_TOP0 + bedH)) * ease((st - 4.05) / 0.45) : st < 6.0 ? -1.15 : (-1.15 + (BED_TOP0 + bedH + 1.15) * ease((st - 6.35) / 0.25));
  const earthTop = st < 4.5 ? coverTop : st < 6.0 ? -1.15 + 1.13 * ease((st - 4.5) / 0.45) : -0.02 + (-1.13) * ease((st - 6.0) / 0.35);
  const nightP = st < 5 ? 0 : st < 5.28 ? (st - 5) / 0.28 : st < 5.78 ? 1 : st < 6.1 ? 1 - (st - 5.78) / 0.32 : 0;
  const glow = clamp01(0.35 + 0.65 * (st < 2.6 ? ease((st - 1.6) / 1.0) : 1) * (st > 4.5 && st < 6 ? 0.75 - 0.3 * clamp01((st - 5) / 0.8) : 1)) * flick(frame, 5, 0.6);
  const fillProg = ease((st - 4.5) / 0.45) - ease((st - 6.0) / 0.35);
  const moundS = ease(st / 0.95) * (1 - fillProg);
  const potY = potBottom;

  // canvas del corte
  const secCanvas = TX.sec.image as HTMLCanvasElement;
  const baseImg = useMemo(() => { const cv = document.createElement("canvas"); cv.width = CW; cv.height = CH; cv.getContext("2d")!.drawImage(secCanvas, 0, 0); return cv; }, [TX]);
  {
    const c = secCanvas.getContext("2d")!;
    drawSection(c, { image: baseImg }, { digD, bedH, coverTop, earthTop, potBottom: potY, glow: Math.min(1.2, glow), frame, potIn });
    TX.sec.needsUpdate = true;
  }

  // cámara
  const camPos: V3 = [Math.sin(t * 0.5) * 0.18, 0.0 + Math.sin(t * 0.35) * 0.04, 8.4 - clamp01(st / 7) * 0.5];
  const camLook: V3 = [0, -1.155, 0];
  const FOV = 44;

  // partículas de tierra / brasas (palada)
  const dirtOps: { x: number; y: number; z: number; s: number; c: string; e: string }[] = [];
  const pours: [number, number, string, string, number][] = [[0.05, 0.95, "#4A311E", "#000", 1], [4.05, 4.5, "#E9601C", "#FF7A22", -1], [4.5, 4.95, "#5A3F27", "#000", -1], [6.0, 6.35, "#5A3F27", "#000", 1]];
  pours.forEach(([a, b, col, em, dir], pi) => {
    if (st < a || st > b) return;
    const N = 12, dur = 0.75;
    for (let i = 0; i < N; i++) {
      const ph = (((st - a) * stepEvery / fps * 1.7 + i / N) % 1 + 1) % 1;
      const side = (i % 2 ? 1 : -1);
      const x0 = dir > 0 ? (rnd(pi * 30 + i) - 0.5) * 1.2 : side * (1.6 + rnd(pi * 30 + i) * 0.5);
      const x1 = dir > 0 ? side * (1.9 + rnd(i + 5) * 0.7) : (rnd(pi * 30 + i + 9) - 0.5) * 1.3;
      const y0 = dir > 0 ? -0.5 : 0.9, y1 = dir > 0 ? 0.2 : -0.8;
      const yy = y0 + (y1 - y0) * ph + (dir > 0 ? 1.7 * Math.sin(Math.PI * ph) : 0.5 * Math.sin(Math.PI * ph));
      const xx = x0 + (x1 - x0) * ph;
      dirtOps.push({ x: xx, y: yy, z: -0.25, s: 0.09 + rnd(i + 3) * 0.06, c: col, e: em });
    }
  });
  const shovelActive = (st < 0.98 && st > 0.02) || (st > 4.05 && st < 4.95) || (st > 6.0 && st < 6.35);
  const shovelPh = (st * 5.5) % 1;
  const shovelX = st < 3 ? 1.9 + Math.sin(shovelPh * Math.PI * 2) * 0.5 : 2.0 + Math.sin(shovelPh * Math.PI * 2) * 0.4;
  const shovelY = 0.35 + Math.abs(Math.sin(shovelPh * Math.PI)) * 0.9;

  // sol / luna / cielo
  const dayCol = new THREE.Color("#B8CADC"), nightCol = new THREE.Color("#0E1830");
  const skyCol = dayCol.clone().lerp(nightCol, nightP);
  const sunPos: V3 = st < 5 ? [-3.4 + st * 0.55, 1.35, -4] : st < 5.3 ? [-0.65 + ((st - 5) / 0.3) * 4.5, 1.35 - ((st - 5) / 0.3) * 2.6, -4] : st < 5.8 ? [9, -4, -4] : [-4.6 + clamp01((st - 5.8) / 0.4) * 2.6, -1.2 + clamp01((st - 5.8) / 0.4) * 2.6, -4];
  const moonU = clamp01((st - 5.15) / 0.75);
  const moonPos: V3 = [-4.6 + moonU * 9.2, 0.35 + Math.sin(Math.PI * moonU) * 1.2, -4];
  const showMoon = st > 5.12 && st < 5.95;
  const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => [(rnd(i * 5) - 0.5) * 22, 0.4 + rnd(i * 5 + 1) * 3.3, -4.5] as V3), []);

  // luz del pozo
  const pitLight = (fireI * 36 + glow * 5) * (st > 1.05 ? 1 : 0);
  const flames = [0, 1, 2, 3, 4, 5, 6];
  const ftex = flameTex();
  const soft = softTex();
  const steamGround = ease((st - 5.35) / 0.4) * (1 - ease((st - 6.0) / 0.2));
  const steamPot = ease((st - 6.6) / 0.35);

  // ── proyección para las cotas SVG ──
  const proj = (x: number, y: number, z = 0) => {
    const cam = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
    cam.position.set(camPos[0], camPos[1], camPos[2]); cam.lookAt(camLook[0], camLook[1], camLook[2]); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const v = new THREE.Vector3(x, y, z).project(cam);
    return [(v.x * 0.5 + 0.5) * width, (-v.y * 0.5 + 0.5) * height] as [number, number];
  };
  const [dxA, dyA] = proj(1.85, 0, 0.02), [dxB, dyB] = proj(1.85, -PD, 0.02);
  const depthA = showDepth ? ease((st - 0.72) / 0.28) * (1 - ease((st - 3.0) / 0.4)) : 0;
  const shownStep = Math.min(steps.length - 1, Math.floor(Math.min(st, 6.999)));
  const within = st - Math.floor(Math.min(st, 6.999));
  const labOp = st > 7 ? clamp01(1 - (st - 7.4) / 0.4) : clamp01(within / 0.12) * clamp01((1 - within) / 0.1);
  const clockOn = st > 4.95 && st < 6.2;
  const clockA = ease((st - 4.95) / 0.15) * (1 - ease((st - 6.0) / 0.2));
  const clockAng = ((st - 5.0) / 1.0) * Math.PI * 2 * 0.9 + Math.PI * 1.4;

  return (
    <AbsoluteFill style={{ background: "#0B1220" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: FOV, position: camPos, near: 0.1, far: 80 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={camPos} look={camLook} />
        <color attach="background" args={["#0B1220"]} />
        <ambientLight intensity={0.5 + 0.5 * (1 - nightP)} color={nightP > 0.5 ? "#6F86B8" : "#DCE6F2"} />
        <directionalLight position={[-3, 5, 8]} intensity={0.8 * (1 - nightP * 0.7)} color={nightP > 0.5 ? "#9DB4E8" : "#FFF0DA"} />
        <pointLight position={[0, -1.8, 1.2]} color="#FF8A34" intensity={pitLight} distance={7} decay={1.4} />

        {/* cielo */}
        <mesh position={[0, 0.5, -5]} scale={[1, 1, 1]}><planeGeometry args={[40, 12]} /><meshBasicMaterial map={TX.sky} color={skyCol} toneMapped={false} /></mesh>
        {nightP > 0.05 ? stars.map((p, i) => <mesh key={i} position={p} scale={0.03 + rnd(i) * 0.03}><circleGeometry args={[1, 5]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={nightP * (0.4 + 0.5 * rnd(i + 3))} /></mesh>) : null}
        <group position={sunPos}>
          <mesh><circleGeometry args={[0.42, 24]} /><meshBasicMaterial color="#FFE9A8" toneMapped={false} /></mesh>
          <sprite position={[0, 0, -0.3]} scale={[3.2, 3.2, 1]}><spriteMaterial map={soft} color="#FFD58A" transparent opacity={0.5 * (1 - nightP)} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
        </group>
        {showMoon ? <group position={moonPos}>
          <mesh><circleGeometry args={[0.36, 24]} /><meshBasicMaterial map={TX.moon} toneMapped={false} /></mesh>
          <sprite position={[0, 0, -0.3]} scale={[2.4, 2.4, 1]}><spriteMaterial map={soft} color="#AFC6FF" transparent opacity={0.35 * nightP} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
        </group> : null}

        {/* terreno: corte frontal + tapa de nieve + paredes del pozo */}
        <mesh position={[0, -BOT / 2, 0]}>
          <planeGeometry args={[XW * 2, BOT]} />
          <meshBasicMaterial map={TX.sec} alphaTest={0.5} transparent={false} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#5A6C96"), nightP * 0.7)} toneMapped={false} />
        </mesh>
        {/* cara superior: nieve */}
        {[[-(XW + PW / 2) / 2 - 0.0, 0, (XW - PW / 2), ZB], [(XW + PW / 2) / 2, 0, (XW - PW / 2), ZB]].map(([x, , w, d], i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, -d / 2]} material={M.snow}><planeGeometry args={[w, d]} /></mesh>
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -(ZPIT + ZB) / 2]} material={M.snow}><planeGeometry args={[PW, ZB - ZPIT]} /></mesh>
        {!dug ? <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -ZPIT / 2]} material={M.snow}><planeGeometry args={[PW, ZPIT]} /></mesh> : null}
        {/* costados y fondo del bloque */}
        <mesh position={[0, -BOT / 2, -ZB]} material={M.earth}><planeGeometry args={[XW * 2, BOT]} /></mesh>
        <mesh position={[-XW, -BOT / 2, -ZB / 2]} rotation={[0, Math.PI / 2, 0]} material={M.earth}><planeGeometry args={[ZB, BOT]} /></mesh>
        <mesh position={[XW, -BOT / 2, -ZB / 2]} rotation={[0, -Math.PI / 2, 0]} material={M.earth}><planeGeometry args={[ZB, BOT]} /></mesh>
        {/* interior del pozo */}
        {dug ? <>
          <mesh position={[0, -digD / 2, -ZPIT]} scale={[1, digD, 1]} material={M.backWall}><planeGeometry args={[PW, 1]} /></mesh>
          <mesh position={[-PW / 2, -digD / 2, -ZPIT / 2]} rotation={[0, Math.PI / 2, 0]} scale={[1, digD, 1]} material={M.backWall}><planeGeometry args={[ZPIT, 1]} /></mesh>
          <mesh position={[PW / 2, -digD / 2, -ZPIT / 2]} rotation={[0, -Math.PI / 2, 0]} scale={[1, digD, 1]} material={M.backWall}><planeGeometry args={[ZPIT, 1]} /></mesh>
          <mesh position={[0, -digD, -ZPIT / 2]} rotation={[-Math.PI / 2, 0, 0]} material={M.ironDark}><planeGeometry args={[PW, ZPIT]} /></mesh>
        </> : null}
        {/* montículos de tierra sacada */}
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[sd * 2.05, 0, -0.55]} scale={[1.05 * moundS + 0.001, 0.62 * moundS + 0.001, 0.62 * moundS + 0.001]} material={M.mound}><sphereGeometry args={[1, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
        ))}

        {/* leña que arde + llamas */}
        {dug && st > 1.0 && st < 3.02 ? <group position={[0, BED_TOP0, -0.3]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[(i - 2) * 0.12, 0.1 + (i % 2) * 0.16, (i % 3 - 1) * 0.05]} rotation={[0, 0, (i % 2 ? 1 : -1) * (0.12 + i * 0.08) + (i > 2 ? Math.PI / 2 - 0.3 : 0)]} scale={[1, 1 - burn * 0.5, 1]}>
              <cylinderGeometry args={[0.085, 0.085, 1.5, 8]} />
              <meshStandardMaterial color={new THREE.Color("#6B4526").lerp(new THREE.Color("#120A06"), burn)} emissive={new THREE.Color("#FF5A10")} emissiveIntensity={0.9 * (0.3 + fireI) * (1 - burn * 0.4)} roughness={0.95} />
            </mesh>
          ))}
          {fireI > 0.02 ? flames.map((i) => {
            const fl = flick(frame, i * 3 + 1, 1.2);
            const h = (0.9 + 0.7 * rnd(i + 3)) * fireI * fl, w = (0.55 + 0.35 * rnd(i + 8)) * (0.6 + 0.4 * fireI);
            return <sprite key={i} position={[(i - 3) * 0.24 + Math.sin(frame * 0.4 + i) * 0.04, 0.25 + h * 0.5, 0.05 + (i % 2) * 0.05]} scale={[w, h, 1]}>
              <spriteMaterial map={ftex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.95} toneMapped={false} />
            </sprite>;
          }) : null}
          {fireI > 0.02 ? <sprite position={[0, 0.5, 0.2]} scale={[3.4 * fireI, 3.4 * fireI, 1]}><spriteMaterial map={soft} color="#FF8A34" transparent opacity={0.55 * fireI} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite> : null}
        </group> : null}
        {dug && st > 1.05 && st < 3 ? <Motes frame={frame} center={[0, BED_TOP0 + 0.5, -0.2]} span={[1.6, 3.2, 0.6]} n={30} vy={0.5} size={0.06} color="#FFB060" opacity={0.9 * fireI} seed={12} /> : null}
        {glow > 0.3 && dug ? <sprite position={[0, BED_TOP0 + 0.3, -0.5]} scale={[3.2, 1.6, 1]}><spriteMaterial map={soft} color="#FF6A1A" transparent opacity={Math.min(0.55, glow * 0.4) * (st > 6.05 && st < 6.4 ? 1 : st > 4.9 ? 0.5 : 1)} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite> : null}

        {/* la olla: mitad trasera abierta hacia la cámara (vista interior) */}
        {potIn ? <group position={[0, potY, -0.06]}>
          <mesh position={[0, POT_H / 2, 0]} material={M.iron}><cylinderGeometry args={[POT_R, POT_R * 0.93, POT_H, 32, 1, true, Math.PI / 2, Math.PI]} /></mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.ironDark}><circleGeometry args={[POT_R * 0.93, 32, 0, Math.PI]} /></mesh>
          <mesh position={[0, POT_H - 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.ironDark}><torusGeometry args={[POT_R, 0.035, 6, 28, Math.PI]} /></mesh>
          {/* corte de los frijoles */}
          <mesh position={[0, 0.06 + 0.4, 0.0]} material={M.beanCut}><planeGeometry args={[POT_R * 2 * 0.93, 0.8]} /></mesh>
          <mesh position={[0, 0.86, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.beanTop}><circleGeometry args={[POT_R * 0.93, 24, 0, Math.PI]} /></mesh>
          <mesh position={[0, 0.06 + 0.4, 0]} material={M.beanSide}><cylinderGeometry args={[POT_R * 0.93, POT_R * 0.9, 0.8, 24, 1, true, Math.PI / 2, Math.PI]} /></mesh>
          {/* patitas */}
          {[-0.3, 0.3].map((x, i) => <mesh key={i} position={[x, -0.03, -0.12]} material={M.ironDark}><cylinderGeometry args={[0.04, 0.05, 0.08, 8]} /></mesh>)}
          {/* asa (bail): se acuesta al taparla */}
          <group position={[0, POT_H + 0.02, 0]} rotation={[coverTop > -1.5 && st > 3.6 && st < 6.5 ? -Math.PI / 2 : 0.0, 0, 0]}>
            <mesh material={M.ironDark} rotation={[0, 0, 0]}><torusGeometry args={[POT_R + 0.02, 0.028, 6, 26, Math.PI]} /></mesh>
          </group>
          {/* tapa */}
          <group position={[0, POT_H + lidOff, 0]}>
            <mesh scale={[1, 0.28, 1]} material={M.iron}><sphereGeometry args={[POT_R * 1.05, 28, 8, Math.PI, Math.PI, 0, Math.PI / 2]} /></mesh>
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.ironDark}><torusGeometry args={[POT_R * 1.04, 0.03, 6, 28, Math.PI]} /></mesh>
            <mesh position={[0, 0.16, -0.02]} material={M.ironDark}><sphereGeometry args={[0.05, 8, 6]} /></mesh>
          </group>
          <Steam pos={[0, POT_H + 0.25, -0.1]} frame={frame} fps={fps} n={5} size={0.32} rise={1.8} amt={0.95 * steamPot} seed={81} speed={0.5} />
          {st > 3.0 && st < 3.6 ? <Steam pos={[0, POT_H - 0.05, -0.1]} frame={frame} fps={fps} n={3} size={0.22} rise={1.0} amt={0.6} seed={83} /> : null}
        </group> : null}
        {/* gancho para sacar la olla */}
        {lift > 0.02 ? <mesh position={[0, potY + POT_H + 1.8, -0.06]} material={M.ironDark}><cylinderGeometry args={[0.012, 0.012, 3.4, 5]} /></mesh> : null}

        {/* pala */}
        {shovelActive ? <group position={[shovelX, shovelY, 0.25]} rotation={[0, 0, st < 3 ? -0.5 : 0.4]}>
          <mesh position={[0, 0.7, 0]} material={M.handle}><cylinderGeometry args={[0.03, 0.03, 1.6, 6]} /></mesh>
          <mesh position={[0, -0.2, 0]} material={M.shovel}><boxGeometry args={[0.32, 0.4, 0.03]} /></mesh>
        </group> : null}

        {/* tierra / brasas volando */}
        {dirtOps.map((d, i) => <mesh key={i} position={[d.x, d.y, d.z]} scale={d.s}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={d.c} emissive={d.e === "#000" ? "#3A2412" : d.e} emissiveIntensity={d.e === "#000" ? 0.9 : 1.2} roughness={1} flatShading /></mesh>)}

        {/* vapor de la tierra durante la noche */}
        {steamGround > 0.02 ? [-0.5, 0.0, 0.5].map((x, i) => <Steam key={i} pos={[x, 0.05, -0.2]} frame={frame} fps={fps} n={3} size={0.28} rise={1.5} amt={0.5 * steamGround} seed={90 + i} speed={0.25} color="#DCE6F2" />) : null}

        {/* nevada */}
        <Motes frame={frame} center={[0, 0, 2]} span={[14, 5, 6]} n={70} size={0.06} color="#FFFFFF" opacity={0.75} vy={-0.06} seed={21} />
      </ThreeCanvas>

      {/* cota "about 3 ft" */}
      {depthA > 0.01 ? (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: depthA, pointerEvents: "none" }}>
          <g stroke={OLE.lanternSoft} strokeWidth={5} strokeLinecap="round" fill="none" filter="drop-shadow(0 3px 3px rgba(0,0,0,0.6))">
            <line x1={dxA} y1={dyA} x2={dxB} y2={dyB} />
            <line x1={dxA - 26} y1={dyA} x2={dxA + 26} y2={dyA} />
            <line x1={dxB - 26} y1={dyB} x2={dxB + 26} y2={dyB} />
            <path d={`M ${dxA} ${dyA + 8} l -12 26 l 24 0 z`} fill={OLE.lanternSoft} />
            <path d={`M ${dxB} ${dyB - 8} l -12 -26 l 24 0 z`} fill={OLE.lanternSoft} />
          </g>
          <text x={dxA + 46} y={(dyA + dyB) / 2 + 20} fontFamily={HAND} fontWeight={700} fontSize={88} fill={OLE.cream} stroke="#1B120A" strokeWidth={6} paintOrder="stroke" transform={`rotate(-4 ${dxA + 46} ${(dyA + dyB) / 2})`}>{depthLabel}</text>
        </svg>
      ) : null}

      {/* rótulo de la etapa */}
      {steps[shownStep] && labOp > 0.01 ? (
        <div style={{ position: "absolute", left: 70, top: 56, display: "flex", alignItems: "center", gap: 22, opacity: labOp, transform: `translateX(${(1 - labOp) * -30}px)` }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: OLE.plaid, border: `5px solid ${OLE.cream}`, color: OLE.cream, fontFamily: SLAB, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 0 rgba(0,0,0,0.4)" }}>{shownStep + 1}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 104, color: OLE.cream, lineHeight: 1, textShadow: "0 4px 0 rgba(0,0,0,0.55), 0 0 26px rgba(0,0,0,0.6)" }}>{steps[shownStep]}</div>
        </div>
      ) : null}

      {/* reloj de la noche */}
      {clockOn ? (
        <svg width={230} height={230} viewBox="-115 -115 230 230" style={{ position: "absolute", right: 90, top: 60, opacity: clockA }}>
          <circle r={104} fill="#EFEBDD" stroke="#2B1A0E" strokeWidth={9} />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-90} x2={0} y2={i % 3 === 0 ? -72 : -80} stroke="#2A2018" strokeWidth={i % 3 === 0 ? 6 : 3} transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={8} x2={0} y2={-56} stroke="#2A2018" strokeWidth={9} strokeLinecap="round" transform={`rotate(${(clockAng * 180 / Math.PI)})`} />
          <line x1={0} y1={14} x2={0} y2={-80} stroke={OLE.plaid} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(clockAng * 180 / Math.PI) * 12})`} />
          <circle r={9} fill="#2A2018" />
        </svg>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(4,6,12,0.5) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
