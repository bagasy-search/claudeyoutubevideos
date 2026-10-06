// Rulebook3D — el manual del alumno de 1956 en 3D real (three.js), héroe del video de reglas.
// Tapa de tela gastada con escudo del distrito (inventado), esquinas dobladas, polvo en el haz de luz.
// Las hojas pasan con curvatura real hasta "RULE n"; la regla se TIPEA a máquina sobre la página y el sello de goma
// del veredicto CAE con peso: bloque de goma que baja acelerando, tinta con desgaste y corrimiento, rebote de cámara
// y una nube de polvo/partículas. `angle` 0..3 cambia el encuadre en cada regla (como ExamRoom3D).
// Base técnica de las hojas: LorCookbook3D (lorpies).
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SERIF, TYPE, SANS, YC, clamp, ease, rnd } from "./theme";

export type Verdict = "ILLEGAL" | "BANNED" | "POLICY" | "GONE";
export const VERDICT: Record<Verdict, { ink: string; word: string; weight: number }> = {
  ILLEGAL: { ink: "#B3122A", word: "ILLEGAL", weight: 1 },
  BANNED: { ink: "#C2491A", word: "BANNED", weight: 0.9 },
  POLICY: { ink: "#1F3F8C", word: "AGAINST POLICY", weight: 0.75 },
  GONE: { ink: "#3B3833", word: "JUST GONE", weight: 0.6 },
};

const W = 1.5, H = 2.0, SEG = 28;
const CW = 1024, CH = 1365;
const DISTRICT = "MAPLE GROVE PUBLIC SCHOOLS";

// ─── texturas ────────────────────────────────────────────────────────────────
const tex = (c: HTMLCanvasElement) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const canvas = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

// papel envejecido: tono, fibras, foxing, bordes tostados
function paperBase(g: CanvasRenderingContext2D, seed: number, mirror = false) {
  g.fillStyle = "#EFE4C8"; g.fillRect(0, 0, CW, CH);
  for (let i = 0; i < 7; i++) {
    const x = rnd(seed + i) * CW, y = rnd(seed + i + 40) * CH, r = 40 + rnd(seed + i + 80) * 160;
    const gr = g.createRadialGradient(x, y, r * 0.1, x, y, r);
    gr.addColorStop(0, "rgba(170,120,60,0.13)"); gr.addColorStop(1, "rgba(170,120,60,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(90,60,30,${rnd(seed + i * 3) * 0.06})`; g.fillRect(rnd(seed + i) * CW, rnd(seed + i + 9) * CH, 1 + rnd(i) * 2, 1); }
  const e = g.createLinearGradient(0, 0, CW, 0);
  const inner = mirror ? 1 : 0;
  e.addColorStop(inner, "rgba(120,85,40,0.28)"); e.addColorStop(inner ? 0.9 : 0.1, "rgba(120,85,40,0)");
  e.addColorStop(inner ? 0.04 : 0.96, "rgba(120,85,40,0)"); e.addColorStop(inner ? 0 : 1, "rgba(120,85,40,0.18)");
  g.fillStyle = e; g.fillRect(0, 0, CW, CH);
  const v = g.createLinearGradient(0, 0, 0, CH); v.addColorStop(0, "rgba(120,85,40,0.16)"); v.addColorStop(0.06, "rgba(120,85,40,0)"); v.addColorStop(0.94, "rgba(120,85,40,0)"); v.addColorStop(1, "rgba(120,85,40,0.2)");
  g.fillStyle = v; g.fillRect(0, 0, CW, CH);
}
function header(g: CanvasRenderingContext2D, page: number, mirror: boolean) {
  g.fillStyle = "rgba(40,30,20,0.75)"; g.font = `400 26px "${TYPE}"`; g.textBaseline = "alphabetic";
  const txt = `PUPIL HANDBOOK · ${DISTRICT} · 1956`;
  g.textAlign = mirror ? "left" : "right"; g.fillText(txt, mirror ? 90 : CW - 90, 80);
  g.textAlign = mirror ? "right" : "left"; g.fillText(String(page), mirror ? CW - 90 : 90, 80);
  g.textAlign = "left";
  g.strokeStyle = "rgba(40,30,20,0.4)"; g.lineWidth = 2; g.beginPath(); g.moveTo(90, 98); g.lineTo(CW - 90, 98); g.stroke();
}
// texto de relleno impreso (reglas de otras páginas): líneas reales, gris tinta de imprenta
const FILLER = [
  "Pupils shall enter the building quietly and proceed directly to their rooms.",
  "No pupil shall leave the school grounds during the day without written permission.",
  "Pupils shall address teachers as Mr., Mrs., or Miss at all times.",
  "Running, shouting and whistling in corridors are forbidden.",
  "Every pupil is expected to be neat and clean in person and dress.",
  "Books damaged through carelessness must be paid for by the pupil.",
  "Tardiness without a written excuse will be reported to the principal.",
  "Pupils shall rise when a visitor or the principal enters the room.",
];
function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" "); const out: string[] = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur); return out;
}
function printedPage(g: CanvasRenderingContext2D, seed: number, ruleNo: number, mirror: boolean) {
  paperBase(g, seed, mirror); header(g, 10 + ruleNo, mirror);
  let y = 190;
  for (let k = 0; k < 3; k++) {
    const no = ruleNo + k;
    g.fillStyle = "#2A1F16"; g.font = `400 58px "${SERIF}"`; g.fillText(`Rule ${no}.`, 110, y); y += 70;
    g.font = `400 34px "${TYPE}"`; g.fillStyle = "rgba(35,28,20,0.85)";
    for (const l of wrap(g, FILLER[(seed + k) % FILLER.length], CW - 230)) { g.fillText(l, 110, y); y += 46; }
    y += 50;
  }
}
// página final: cabecera "RULE n" impresa + regla tipeada hasta `chars`
function rulePage(g: CanvasRenderingContext2D, n: number, rule: string, chars: number, caret: boolean) {
  paperBase(g, 700 + n, false); header(g, 40 + n, false);
  g.fillStyle = "#1E1611"; g.textAlign = "center";
  g.font = `400 40px "${SANS}"`; g.fillText("SECTION IV  ·  CONDUCT & DISCIPLINE", CW / 2, 175);
  g.font = `400 150px "${SERIF}"`; g.fillText(`RULE ${n}`, CW / 2, 350);
  g.strokeStyle = "#1E1611"; g.lineWidth = 3; g.beginPath(); g.moveTo(CW / 2 - 150, 390); g.lineTo(CW / 2 + 150, 390); g.stroke();
  g.textAlign = "left";
  // tipeo: cinta con tinta desigual (cada letra con su opacidad y un pelo de corrimiento)
  g.font = `400 58px "${TYPE}"`;
  const lines = wrap(g, rule, CW - 220);
  let used = 0, y = 500;
  let lastX = 110, lastY = y;
  for (const l of lines) {
    let x = 110;
    for (let k = 0; k < l.length; k++) {
      if (used + k >= chars) break;
      const ch = l[k];
      g.fillStyle = `rgba(20,16,12,${0.72 + rnd(used + k) * 0.26})`;
      g.fillText(ch, x + (rnd(used + k + 3) - 0.5) * 1.5, y + (rnd(used + k + 5) - 0.5) * 2);
      x += g.measureText(ch).width; lastX = x; lastY = y;
    }
    used += l.length + 1; y += 78;
    if (used > chars) break;
  }
  if (caret) { g.fillStyle = "rgba(20,16,12,0.8)"; g.fillRect(lastX + 4, lastY + 10, 34, 5); }
}
// máscara de desgaste de la goma (determinista, se calcula una vez)
let _wear: HTMLCanvasElement | null = null;
function wearMask() {
  if (_wear) return _wear;
  const c = canvas(512, 256); const g = c.getContext("2d")!;
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(0,0,0,${0.25 + rnd(i + 1) * 0.75})`; const s = 1 + rnd(i + 2) * 3.5; g.fillRect(rnd(i + 3) * 512, rnd(i + 4) * 256, s, s * (0.6 + rnd(i) * 0.8)); }
  for (let i = 0; i < 14; i++) { g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.ellipse(rnd(i + 90) * 512, rnd(i + 91) * 256, 8 + rnd(i + 92) * 30, 2 + rnd(i + 93) * 6, rnd(i) * 3, 0, 7); g.fill(); }
  _wear = c; return c;
}
// dibuja la tinta del sello centrada en (cx, cy) con escala y "corrimiento" (bleed) de impacto
function inkStamp(g: CanvasRenderingContext2D, v: Verdict, line2: string | undefined, cx: number, cy: number, rot: number, s: number, bleed: number) {
  const V = VERDICT[v];
  const sw = 760, sh = line2 ? 300 : 230;
  const c = canvas(sw + 40, sh + 40); const k = c.getContext("2d")!;
  k.translate(20, 20);
  k.strokeStyle = V.ink; k.fillStyle = V.ink;
  k.lineWidth = 16; k.strokeRect(8, 8, sw - 16, sh - 16);
  k.lineWidth = 5; k.strokeRect(30, 30, sw - 60, sh - 60);
  k.textAlign = "center"; k.textBaseline = "middle";
  const big = V.word.length > 9 ? 104 : 140;
  k.font = `700 ${big}px "${SANS}"`;
  k.fillText(V.word, sw / 2, line2 ? sh * 0.4 : sh / 2 + 6, sw - 90);
  if (line2) { k.font = `600 52px "${SANS}"`; k.fillText(line2, sw / 2, sh * 0.76, sw - 100); }
  // desgaste: la goma no carga tinta pareja
  k.globalCompositeOperation = "destination-out";
  k.drawImage(wearMask(), -20, -20, sw + 40, sh + 40);
  g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(s, s * (1 - bleed * 0.04));
  g.globalAlpha = 0.18 * bleed; g.drawImage(c, -sw / 2 - 20 + 3, -sh / 2 - 20 + 3); // corrimiento de tinta
  g.globalAlpha = 0.86; g.globalCompositeOperation = "multiply"; g.drawImage(c, -sw / 2 - 20, -sh / 2 - 20);
  g.restore();
}
function coverTex(worn: number) {
  const c = canvas(1024, 1365); const g = c.getContext("2d")!;
  g.fillStyle = "#23403A"; g.fillRect(0, 0, 1024, 1365);
  // trama de tela
  for (let y = 0; y < 1365; y += 3) { g.fillStyle = `rgba(0,0,0,${0.05 + rnd(y) * 0.05})`; g.fillRect(0, y, 1024, 1); }
  for (let x = 0; x < 1024; x += 3) { g.fillStyle = `rgba(255,255,255,${0.02 + rnd(x + 5) * 0.03})`; g.fillRect(x, 0, 1, 1365); }
  // gastado en bordes y esquinas (tela pelada que deja ver el cartón)
  for (let i = 0; i < 260; i++) {
    const side = i % 4; const t = rnd(i + 3);
    const x = side === 0 ? t * 1024 : side === 1 ? 1024 - rnd(i) * 26 : side === 2 ? t * 1024 : rnd(i) * 26;
    const y = side === 0 ? rnd(i) * 26 : side === 1 ? t * 1365 : side === 2 ? 1365 - rnd(i) * 26 : t * 1365;
    g.fillStyle = `rgba(190,170,130,${0.15 + rnd(i + 7) * 0.3 * worn})`; g.beginPath(); g.arc(x, y, 3 + rnd(i + 8) * 10, 0, 7); g.fill();
  }
  for (const [x, y] of [[0, 0], [1024, 0], [0, 1365], [1024, 1365]]) {
    const gr = g.createRadialGradient(x, y, 0, x, y, 140); gr.addColorStop(0, "rgba(200,180,140,0.55)"); gr.addColorStop(1, "rgba(200,180,140,0)"); g.fillStyle = gr; g.fillRect(x - 140, y - 140, 280, 280);
  }
  // escudo estampado en oro gastado
  const gold = "rgba(214,178,98,0.92)";
  g.strokeStyle = gold; g.fillStyle = gold; g.lineWidth = 6;
  g.strokeRect(70, 70, 1024 - 140, 1365 - 140); g.lineWidth = 2; g.strokeRect(88, 88, 1024 - 176, 1365 - 176);
  g.textAlign = "center";
  g.font = `400 54px "${SANS}"`; g.fillText(DISTRICT, 512, 250);
  // escudo: blasón con libro abierto, lámpara y bellota
  g.save(); g.translate(512, 560);
  g.beginPath(); g.moveTo(-170, -190); g.lineTo(170, -190); g.lineTo(170, 20); g.quadraticCurveTo(170, 170, 0, 230); g.quadraticCurveTo(-170, 170, -170, 20); g.closePath(); g.lineWidth = 8; g.stroke();
  g.beginPath(); g.moveTo(-110, -40); g.quadraticCurveTo(-55, -70, 0, -40); g.quadraticCurveTo(55, -70, 110, -40); g.lineTo(110, 50); g.quadraticCurveTo(55, 20, 0, 50); g.quadraticCurveTo(-55, 20, -110, 50); g.closePath(); g.lineWidth = 5; g.stroke();
  g.beginPath(); g.moveTo(0, -40); g.lineTo(0, 50); g.stroke();
  g.beginPath(); g.ellipse(0, -120, 26, 34, 0, 0, 7); g.fill();
  g.font = `400 34px "${SERIF}"`; g.fillText("EST. 1911", 0, 140);
  g.restore();
  g.font = `400 120px "${SERIF}"`; g.fillText("Pupil", 512, 960); g.fillText("Handbook", 512, 1085);
  g.font = `400 46px "${SANS}"`; g.fillText("RULES OF CONDUCT  ·  1956 – 1957", 512, 1190);
  // oro descascarado
  g.globalCompositeOperation = "destination-over";
  g.globalCompositeOperation = "source-over";
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(35,64,58,${0.5 + rnd(i) * 0.5})`; g.fillRect(rnd(i + 11) * 1024, rnd(i + 12) * 1365, 2 + rnd(i) * 5, 1 + rnd(i + 1) * 3); }
  return tex(c);
}
const woodTex = (() => { let t: THREE.Texture | null = null; return () => {
  if (t) return t; const c = canvas(1024, 1024); const g = c.getContext("2d")!;
  for (let i = 0; i < 8; i++) { g.fillStyle = `hsl(24, ${40 + rnd(i) * 10}%, ${24 + rnd(i + 3) * 8}%)`; g.fillRect(0, i * 128, 1024, 128); g.fillStyle = "rgba(0,0,0,0.4)"; g.fillRect(0, i * 128, 1024, 3); }
  for (let i = 0; i < 700; i++) { g.strokeStyle = `rgba(0,0,0,${0.04 + rnd(i) * 0.08})`; g.lineWidth = 1 + rnd(i + 2) * 2; g.beginPath(); const y = rnd(i + 5) * 1024; g.moveTo(0, y); g.bezierCurveTo(300, y + 10 * rnd(i), 700, y - 10, 1024, y + 5); g.stroke(); }
  t = tex(c); t.anisotropy = 16; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); return t; }; })();
let _beam: THREE.Texture | null = null;
const beam = () => {
  if (_beam) return _beam;
  const c = canvas(64, 256); const g = c.getContext("2d")!;
  const h = g.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, "rgba(255,255,255,0)"); h.addColorStop(0.5, "rgba(255,255,255,1)"); h.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = h; g.fillRect(0, 0, 64, 256);
  g.globalCompositeOperation = "destination-in";
  const v = g.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(0.3, "rgba(0,0,0,1)"); v.addColorStop(0.75, "rgba(0,0,0,1)"); v.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = v; g.fillRect(0, 0, 64, 256); _beam = new THREE.CanvasTexture(c); return _beam;
};
let _glow: THREE.Texture | null = null;
const glow = () => {
  if (_glow) return _glow;
  const c = canvas(64, 64); const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,244,220,1)"); gr.addColorStop(1, "rgba(255,230,180,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); _glow = new THREE.CanvasTexture(c); return _glow;
};

// ─── geometría de hojas (curvatura acumulada a lo ancho, igual que LorCookbook3D) ───
function flatPage() { const g = new THREE.PlaneGeometry(W, H, SEG, 1); g.rotateX(-Math.PI / 2); g.translate(W / 2, 0, 0); return g; }
function setPage(g: THREE.BufferGeometry, p: number, lift: number) {
  const pos = g.attributes.position as THREE.BufferAttribute;
  const bend = Math.sin(p * Math.PI) * 1.1;
  const cols = SEG + 1; const xs = [0], ys = [0];
  for (let k = 1; k < cols; k++) { const s = (k - 0.5) / SEG; const a = p * Math.PI + bend * (s - 0.3) * (1 - p * 0.3); xs.push(xs[k - 1] + Math.cos(a) * (W / SEG)); ys.push(ys[k - 1] + Math.sin(a) * (W / SEG)); }
  for (let i = 0; i < pos.count; i++) { const k = i % cols; pos.setXYZ(i, xs[k], ys[k] + lift, pos.getZ(i)); }
  pos.needsUpdate = true; g.computeVertexNormals();
}

const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.lookAt(look);
  const c = camera as THREE.PerspectiveCamera; if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  return null;
};

export const Rulebook3D: React.FC<{
  n: number; rule: string; verdict: Verdict; verdictText?: string; caption?: string;
  angle?: number; intro?: boolean; flips?: number; typeFrom?: number; typeTo?: number; stampAt?: number; stamp?: boolean; typed?: boolean;
}> = ({ n, rule, verdict, verdictText, caption, angle = 0, intro = false, flips: flips0 = 4, typeFrom, typeTo, stampAt, stamp = true, typed = false }) => {
  const flips = typed ? 0 : flips0;
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const [handle] = useState(() => delayRender("fuentes del reglamento"));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    Promise.all([`60px "${TYPE}"`, `60px "${SERIF}"`, `60px "${SANS}"`].map((x) => document.fonts.load(x))).then(() => document.fonts.ready).then(() => { setOk(true); continueRender(handle); });
  }, [handle]);

  // tiempos (en cuadros del componente)
  const coverEnd = intro ? 34 : 0;
  const flip0 = coverEnd + 4, every = 7;
  const flipsEnd = flip0 + flips * every + 8;
  const tA = typed ? -200 : typeFrom ?? flipsEnd + 2;
  const tB = typed ? -190 : Math.max(tA + 10, typeTo ?? tA + Math.min(70, rule.length * 1.6));
  const sAt = !stamp ? 1e6 : typed ? Math.max(8, stampAt ?? 20) : Math.max(tB + 4, stampAt ?? tB + 12);

  const leaves = useMemo(() => {
    if (!ok) return [];
    return Array.from({ length: flips }, (_, j) => {
      const fc = canvas(CW, CH); printedPage(fc.getContext("2d")!, 30 + j * 7, Math.max(1, n - 3 * (flips - j)), false);
      const tmp = canvas(CW, CH); printedPage(tmp.getContext("2d")!, 60 + j * 7, Math.max(1, n - 3 * (flips - j)) + 3, true);
      const bc = canvas(CW, CH); const bg = bc.getContext("2d")!; bg.translate(CW, 0); bg.scale(-1, 1); bg.drawImage(tmp, 0, 0);
      return {
        geo: flatPage(),
        front: new THREE.MeshStandardMaterial({ map: tex(fc), roughness: 0.92, side: THREE.FrontSide }),
        back: new THREE.MeshStandardMaterial({ map: tex(bc), roughness: 0.92, side: THREE.BackSide }),
      };
    });
  }, [ok, flips, n]);
  const leftMat = useMemo(() => {
    if (!ok) return null; const c = canvas(CW, CH); printedPage(c.getContext("2d")!, 999 + n, Math.max(1, n - 3), true);
    return new THREE.MeshStandardMaterial({ map: tex(c), roughness: 0.92 });
  }, [ok, n]);
  const rightCanvas = useMemo(() => canvas(CW, CH), []);
  const rightTex = useMemo(() => tex(rightCanvas), [rightCanvas]);
  const coverMat = useMemo(() => (ok ? new THREE.MeshStandardMaterial({ map: coverTex(1), roughness: 0.85, side: THREE.DoubleSide }) : null), [ok]);
  const clothMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1E3631", roughness: 0.9 }), []);

  // página derecha de este cuadro
  const stampP = clamp((f - sAt) / 5);
  if (ok) {
    const g = rightCanvas.getContext("2d")!;
    const chars = Math.floor(rule.length * clamp((f - tA) / Math.max(1, tB - tA)));
    rulePage(g, n, rule, chars, f >= tA && f < sAt && Math.floor(f / 8) % 2 === 0);
    if (f >= sAt) {
      const s = 1 + 0.08 * (1 - ease(stampP));
      inkStamp(g, verdict, verdictText, CW * 0.52, CH * 0.74, -0.1 + (n % 3) * 0.05, s * 0.95, 1 - stampP * 0.4);
    }
    rightTex.needsUpdate = true;
  }

  // hojas
  leaves.forEach((L, j) => {
    const p = interpolate(f, [flip0 + j * every, flip0 + j * every + every * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    setPage(L.geo, p, 0.006 + (flips - j) * 0.0016);
  });
  const coverA = intro ? interpolate(f, [2, coverEnd], [0, Math.PI], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : Math.PI;

  // sello 3D: baja acelerando, pega, se queda, sube y sale
  const down = interpolate(f, [sAt - 9, sAt], [1.4, 0.035], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const up = interpolate(f, [sAt + 5, sAt + 16], [0, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const squash = f >= sAt && f < sAt + 5 ? 1 - 0.12 * Math.sin(((f - sAt) / 5) * Math.PI) : 1;
  const stampX = W * 0.52, stampZ = -H / 2 + H * 0.74;
  const stampVisible = f >= sAt - 10 && f < sAt + 17;
  const V = VERDICT[verdict];

  // cámara: 4 encuadres + empuje hacia el sello + temblor de impacto
  const CAMS = [
    { p: [0.9, 2.5, 2.2], l: [0.75, 0, 0.2], fov: 36 },
    { p: [2.2, 1.3, 1.7], l: [0.7, 0, 0.1], fov: 34 },
    { p: [0.55, 3.3, 0.55], l: [0.62, 0, 0.05], fov: 38 },
    { p: [-0.9, 1.6, 2.4], l: [0.8, 0, 0.15], fov: 32 },
  ];
  const C = CAMS[angle % 4];
  const t = f / D;
  const push = typed ? 0.55 + 0.45 * ease(clamp(f / Math.max(20, sAt))) : !stamp ? ease(clamp((f - (tA - 10)) / Math.max(30, D - tA))) * 0.8 : ease(clamp((f - (tA - 10)) / Math.max(20, sAt - tA + 10)));
  const kick = f >= sAt ? Math.exp(-(f - sAt) / 5) * V.weight : 0;
  const shake = kick * 0.035 * Math.sin((f - sAt) * 2.3);
  const lp = new THREE.Vector3(...(C.l as [number, number, number]));
  const target = lp.clone().lerp(new THREE.Vector3(W * 0.5, 0, stamp ? 0.12 : -0.38), push * (stamp ? 0.7 : 0.85));
  const pos0 = new THREE.Vector3(...(C.p as [number, number, number]));
  const dir = pos0.clone().sub(target);
  const pos = target.clone().add(dir.multiplyScalar(1 - push * (stamp ? 0.22 : 0.42) - t * 0.05));
  pos.x += shake; pos.y += kick * 0.05 + Math.sin(f / 45) * 0.01; pos.z += shake * 0.6;
  // intro: arranca alto sobre la tapa cerrada
  if (intro && f < coverEnd + 10) { const k = 1 - ease(clamp(f / (coverEnd + 10))); pos.y += k * 0.8; pos.z += k * 0.5; }

  // partículas del impacto
  const burst = f >= sAt && f < sAt + 26 ? (f - sAt) / 26 : -1;
  const fade = clamp(f / 7) * (1 - clamp((f - (D - 7)) / 7));

  return (
    <AbsoluteFill style={{ background: "#0F0A06", opacity: fade }}>
      {ok && coverMat && leftMat ? (
        <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 36, position: [0.9, 2.5, 2.2], near: 0.05, far: 40 }}>
          <Cam pos={pos} look={target} fov={C.fov - push * 3} />
          <color attach="background" args={["#140E09"]} />
          <fog attach="fog" args={["#140E09", 4, 11]} />
          <ambientLight intensity={0.35} color="#FFE3C0" />
          <hemisphereLight args={["#FFE8C6", "#2A1C10", 0.45]} />
          <directionalLight position={[-3, 4.5, -1]} intensity={2.6} color="#FFD6A0" />
          <spotLight position={[1.2, 3.4, 1.8]} angle={0.55} penumbra={0.8} intensity={14} color="#FFF0DA" distance={9} />
          {/* escritorio */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]}><planeGeometry args={[10, 10]} /><meshStandardMaterial map={woodTex()} roughness={0.55} metalness={0.05} /></mesh>
          {/* tapa trasera (debajo de todo) y lomo */}
          <mesh position={[-W / 2 - 0.02, -0.022, 0]} material={clothMat}><boxGeometry args={[W + 0.07, 0.018, H + 0.08]} /></mesh>
          <mesh position={[W / 2 + 0.02, -0.022, 0]} material={clothMat}><boxGeometry args={[W + 0.07, 0.018, H + 0.08]} /></mesh>
          <mesh position={[0, -0.03, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, H + 0.08, 16, 1, true, 0, Math.PI]} /><meshStandardMaterial color="#1B302C" roughness={0.9} side={THREE.DoubleSide} /></mesh>
          {/* bloques de hojas con canto */}
          <mesh position={[W / 2, -0.007, 0]}><boxGeometry args={[W, 0.024, H]} /><meshStandardMaterial color="#E4D6B4" roughness={1} /></mesh>
          <mesh position={[-W / 2, -0.007, 0]}><boxGeometry args={[W, 0.024, H]} /><meshStandardMaterial color="#E4D6B4" roughness={1} /></mesh>
          {/* páginas fijas */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-W / 2, 0.0056, 0]} material={leftMat}><planeGeometry args={[W, H]} /></mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[W / 2, 0.0054, 0]}><planeGeometry args={[W, H]} /><meshStandardMaterial map={rightTex} roughness={0.9} /></mesh>
          {/* esquina doblada de la página izquierda */}
          <mesh position={[-W + 0.09, 0.012, H / 2 - 0.09]} rotation={[-Math.PI / 2 + 0.25, 0, Math.PI / 4]}><planeGeometry args={[0.13, 0.13]} /><meshStandardMaterial color="#D8C79F" roughness={1} side={THREE.DoubleSide} /></mesh>
          {/* hojas que pasan */}
          {leaves.map((L, j) => (<group key={j}><mesh geometry={L.geo} material={L.front} /><mesh geometry={L.geo} material={L.back} /></group>))}
          {/* tapa delantera: gira sobre el lomo (intro) y queda abierta a la izquierda, tela hacia abajo */}
          <group rotation={[0, 0, coverA]}>
            <mesh position={[W / 2 + 0.035, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]} material={coverMat}><planeGeometry args={[W + 0.07, H + 0.08]} /></mesh>
            <mesh position={[W / 2 + 0.035, 0.022, 0]}><boxGeometry args={[W + 0.07, 0.016, H + 0.08]} /><meshStandardMaterial color="#1E3631" roughness={0.9} /></mesh>
          </group>
          {/* objetos de escritorio: lápiz y anteojos */}
          <group position={[W + 0.35, 0.0, 0.5]} rotation={[0, 0.5, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.012, 0]}><cylinderGeometry args={[0.012, 0.012, 0.7, 6]} /><meshStandardMaterial color="#E8B21E" roughness={0.5} /></mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0.37, 0.012, 0]}><coneGeometry args={[0.012, 0.05, 6]} /><meshStandardMaterial color="#D9B98A" /></mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.37, 0.012, 0]}><cylinderGeometry args={[0.013, 0.013, 0.04, 8]} /><meshStandardMaterial color="#D86A7A" roughness={0.8} /></mesh>
          </group>
          <group position={[-W - 0.35, 0.02, -0.4]} rotation={[0, -0.4, 0]}>
            {[-0.09, 0.09].map((x) => (<mesh key={x} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.007, 8, 28]} /><meshStandardMaterial color="#2A1A10" metalness={0.3} roughness={0.4} /></mesh>))}
          </group>
          {/* sombra del sello: se oscurece y se achica a medida que baja */}
          {stampVisible ? (
            <sprite position={[stampX, 0.012, stampZ]} scale={[0.95 + (down + up) * 0.5, 0.5 + (down + up) * 0.3, 1]} rotation={[0, 0, 0]}>
              <spriteMaterial map={glow()} color="#000000" transparent opacity={0.55 * (1 - clamp((down + up) / 1.4))} depthWrite={false} />
            </sprite>
          ) : null}
          {/* sello de goma 3D: mango torneado, base de madera, chapa y goma entintada */}
          {stampVisible ? (
            <group position={[stampX, down + up, stampZ]} rotation={[(1 - clamp(1 - (down + up) / 1.4)) * 0.25, -0.1 + (n % 3) * 0.05, 0]} scale={[1, squash, 1]}>
              <mesh position={[0, 0.012, 0]}><boxGeometry args={[0.6, 0.022, 0.24]} /><meshStandardMaterial color="#2B1810" roughness={0.95} /></mesh>
              <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.58, 0.22]} /><meshStandardMaterial color={V.ink} roughness={0.6} /></mesh>
              <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.66, 0.055, 0.3]} /><meshStandardMaterial map={woodTex()} color="#B07A48" roughness={0.45} /></mesh>
              <mesh position={[0, 0.079, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.1]} /><meshStandardMaterial color="#C9A55A" metalness={0.85} roughness={0.3} /></mesh>
              <mesh position={[0, 0.08, 0]}><latheGeometry args={[[
                new THREE.Vector2(0.075, 0), new THREE.Vector2(0.06, 0.012), new THREE.Vector2(0.045, 0.04), new THREE.Vector2(0.036, 0.08), new THREE.Vector2(0.036, 0.11),
                new THREE.Vector2(0.044, 0.14), new THREE.Vector2(0.036, 0.17), new THREE.Vector2(0.034, 0.19), new THREE.Vector2(0.055, 0.215), new THREE.Vector2(0.078, 0.24),
                new THREE.Vector2(0.088, 0.265), new THREE.Vector2(0.082, 0.29), new THREE.Vector2(0.062, 0.315), new THREE.Vector2(0.032, 0.332), new THREE.Vector2(0.0, 0.338),
              ], 64]} /><meshStandardMaterial color="#5B2A18" roughness={0.28} metalness={0.05} /></mesh>
              <mesh position={[0, 0.115, 0]}><cylinderGeometry args={[0.042, 0.042, 0.02, 24]} /><meshStandardMaterial color="#C9A55A" metalness={0.9} roughness={0.25} /></mesh>
            </group>
          ) : null}
          {/* nube del impacto */}
          {burst >= 0 ? Array.from({ length: 70 }, (_, i) => {
            const a = rnd(i + 3) * Math.PI * 2, sp = 0.2 + rnd(i + 5) * 0.45;
            const r = ease(burst) * sp;
            return (
              <sprite key={"b" + i} position={[stampX + Math.cos(a) * (0.3 + r), 0.02 + ease(burst) * (0.05 + rnd(i + 7) * 0.2), stampZ + Math.sin(a) * (0.13 + r * 0.6)]} scale={[0.014 + rnd(i) * 0.02, 0.014 + rnd(i) * 0.02, 1]}>
                <spriteMaterial map={glow()} color="#F2E2C4" transparent opacity={0.8 * (1 - burst)} depthWrite={false} blending={THREE.AdditiveBlending} />
              </sprite>
            );
          }) : null}
          {/* haz de luz volumétrico + polvo */}
          <mesh position={[-0.6, 1.4, -0.9]} rotation={[0.2, 0.3, -0.62]}>
            <planeGeometry args={[1.3, 5]} />
            <meshBasicMaterial map={beam()} color="#FFD9A0" transparent opacity={0.16 + 0.03 * Math.sin(f / 30)} depthWrite={false} depthTest={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
          {Array.from({ length: 70 }, (_, i) => (
            <sprite key={"d" + i} position={[-1.5 + rnd(i) * 3.4, 0.15 + ((rnd(i + 5) * 2 + f * 0.0016 * (0.4 + rnd(i + 9))) % 2), -1.4 + rnd(i + 2) * 2.8]} scale={[0.012, 0.012, 1]}>
              <spriteMaterial map={glow()} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>
          ))}
        </ThreeCanvas>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      {/* destello cálido del golpe */}
      <AbsoluteFill style={{ background: "rgba(255,236,200,1)", opacity: f >= sAt ? 0.22 * Math.exp(-(f - sAt) / 3) * V.weight : 0 }} />
      {caption ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: TYPE, fontSize: 44, color: YC.paper,
          textShadow: "0 4px 20px rgba(0,0,0,0.95)", opacity: ease(clamp((f - sAt - 6) / 12)) }}>{caption}</div>
      ) : null}
    </AbsoluteFill>
  );
};
