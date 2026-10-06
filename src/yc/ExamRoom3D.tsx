// ExamRoom3D — el aula de 1962 en 3D real (three.js), set persistente del video-examen.
// La pregunta se escribe con TIZA en el pizarrón al ritmo del narrador (líneas con cuadro de inicio/fin),
// el reloj de pared marca la cuenta regresiva, y la respuesta se revela con un círculo de tiza y tachones.
// Luz de tarde por las ventanas (haces volumétricos), pupitres, bandera, globo, manzana, hoja de examen.
// angle 0..3 = encuadres distintos para que cada pregunta se vea nueva.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { loadFont } from "@remotion/google-fonts/Caveat";
import { SANS, YC, clamp, ease, easeInOut, rnd } from "./theme";

const CHALK = loadFont().fontFamily;

export type BoardLine = { text: string; from: number; to: number; kind?: "q" | "opt" | "head" };

const BW = 2048, BH = 1024;
function boardCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = BW; c.height = BH; return c;
}
// fondo de pizarrón con borrones de tiza vieja (determinista)
function paintBoardBg(g: CanvasRenderingContext2D) {
  g.fillStyle = "#1F3A2C"; g.fillRect(0, 0, BW, BH);
  for (let i = 0; i < 90; i++) {
    const x = rnd(i) * BW, y = rnd(i + 7) * BH, r = 60 + rnd(i + 3) * 260;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(230,235,225,${0.025 + rnd(i + 9) * 0.035})`); gr.addColorStop(1, "rgba(230,235,225,0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(255,255,255,${rnd(i + 11) * 0.05})`; g.fillRect(rnd(i + 13) * BW, rnd(i + 17) * BH, 2, 2); }
}
function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" "); const lines: string[] = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}

const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.lookAt(look);
  const c = camera as THREE.PerspectiveCamera; if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  return null;
};

let _glow: THREE.Texture | null = null;
const glow = () => {
  if (_glow) return _glow;
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,240,210,1)"); gr.addColorStop(1, "rgba(255,220,160,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); _glow = new THREE.CanvasTexture(c); return _glow;
};
const woodTex = (() => { let t: THREE.Texture | null = null; return () => {
  if (t) return t; const c = document.createElement("canvas"); c.width = 1024; c.height = 1024; const g = c.getContext("2d")!;
  for (let i = 0; i < 16; i++) { g.fillStyle = `hsl(28, ${38 + rnd(i) * 10}%, ${30 + rnd(i + 3) * 10}%)`; g.fillRect(0, i * 64, 1024, 64); g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(0, i * 64, 1024, 3); }
  for (let i = 0; i < 400; i++) { g.strokeStyle = `rgba(0,0,0,${0.05 + rnd(i) * 0.08})`; g.beginPath(); const y = rnd(i + 5) * 1024; g.moveTo(0, y); g.bezierCurveTo(300, y + 8, 700, y - 8, 1024, y + 4); g.stroke(); }
  t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 4); t.colorSpace = THREE.SRGBColorSpace; return t; }; })();

const ctex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
let _flag: THREE.Texture | null = null, _abc: THREE.Texture | null = null, _map: THREE.Texture | null = null;
const flagTex = () => _flag ?? (_flag = ctex(380, 200, (g) => {
  for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? "#F4F0E6" : "#B22234"; g.fillRect(0, (i * 200) / 13, 380, 200 / 13 + 1); }
  g.fillStyle = "#3C3B6E"; g.fillRect(0, 0, 152, 108);
  g.fillStyle = "#F4F0E6"; for (let r = 0; r < 9; r++) for (let c = 0; c < (r % 2 ? 5 : 6); c++) { g.beginPath(); g.arc(12 + c * 25 + (r % 2 ? 12 : 0), 8 + r * 11.5, 3, 0, 7); g.fill(); }
}));
const abcTex = (font: string) => _abc ?? (_abc = ctex(4096, 256, (g) => {
  g.fillStyle = "#F3ECD8"; g.fillRect(0, 0, 4096, 256); g.strokeStyle = "#2E6A3A"; g.lineWidth = 6; g.strokeRect(3, 3, 4090, 250);
  g.strokeStyle = "rgba(200,40,40,0.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 170); g.lineTo(4096, 170); g.stroke();
  g.fillStyle = "#1A2A55"; g.font = `600 150px "${font}"`; g.textBaseline = "alphabetic";
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 26; i++) { g.fillText(L[i] + L[i].toLowerCase(), 30 + i * 156, 175); }
}));
const mapTex = () => _map ?? (_map = ctex(512, 360, (g) => {
  g.fillStyle = "#E9E0C4"; g.fillRect(0, 0, 512, 360);
  g.fillStyle = "#9BB7C9"; g.fillRect(0, 0, 512, 360);
  g.fillStyle = "#D9C98E"; g.beginPath(); g.moveTo(60, 120); g.bezierCurveTo(140, 60, 330, 70, 450, 110); g.bezierCurveTo(470, 180, 430, 250, 380, 290); g.bezierCurveTo(300, 270, 180, 300, 90, 250); g.closePath(); g.fill();
  g.strokeStyle = "rgba(120,80,40,0.5)"; g.lineWidth = 1.5; for (let i = 0; i < 18; i++) { g.beginPath(); g.moveTo(80 + i * 20, 100); g.lineTo(90 + i * 19, 280); g.stroke(); }
}));

const Desk: React.FC<{ x: number; z: number; paper?: boolean }> = ({ x, z, paper }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.74, 0]}><boxGeometry args={[0.72, 0.04, 0.52]} /><meshStandardMaterial color="#8A5A34" roughness={0.6} /></mesh>
    {[[-0.32, -0.22], [0.32, -0.22], [-0.32, 0.22], [0.32, 0.22]].map(([a, b], i) => (
      <mesh key={i} position={[a, 0.37, b]}><cylinderGeometry args={[0.015, 0.015, 0.74, 6]} /><meshStandardMaterial color="#2C2C2C" metalness={0.7} roughness={0.4} /></mesh>
    ))}
    <mesh position={[0, 0.46, 0.42]}><boxGeometry args={[0.44, 0.03, 0.4]} /><meshStandardMaterial color="#8A5A34" roughness={0.6} /></mesh>
    <mesh position={[0, 0.72, 0.62]}><boxGeometry args={[0.44, 0.5, 0.03]} /><meshStandardMaterial color="#7A4E2C" roughness={0.6} /></mesh>
    {paper ? <mesh position={[0.05, 0.765, -0.02]} rotation={[-Math.PI / 2, 0, 0.12]}><planeGeometry args={[0.3, 0.4]} /><meshStandardMaterial color="#F4EEDD" roughness={0.9} /></mesh> : null}
  </group>
);

export const ExamRoom3D: React.FC<{
  n: number; lines: BoardLine[]; answer?: "A" | "B" | "C"; countFrom?: number; revealAt?: number; angle?: number; total?: number;
}> = ({ n, lines, answer, countFrom, revealAt, angle = 0, total = 25 }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const [handle] = useState(() => delayRender("fuente de tiza"));
  const [fontOk, setFontOk] = useState(false);
  useEffect(() => { document.fonts.load(`80px "${CHALK}"`).then(() => document.fonts.ready).then(() => { setFontOk(true); continueRender(handle); }); }, [handle]);

  const canvas = useMemo(() => boardCanvas(), []);
  const bgCache = useMemo(() => { const c = boardCanvas(); paintBoardBg(c.getContext("2d")!); return c; }, []);
  const tex = useMemo(() => { const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }, [canvas]);

  // dibujo del pizarrón para ESTE cuadro
  if (fontOk) {
    const g = canvas.getContext("2d")!;
    g.drawImage(bgCache, 0, 0);
    g.fillStyle = "rgba(245,241,230,0.92)"; g.textBaseline = "top";
    g.font = `600 70px "${CHALK}"`; g.fillText(`Question ${n} of ${total}`, 90, 40);
    // escala para que TODO entre en el pizarrón (preguntas largas)
    let sc = 1;
    for (; sc > 0.45; sc -= 0.05) {
      let yy = 140;
      for (const L of lines) {
        const isQ = L.kind !== "opt";
        g.font = isQ ? `700 ${148 * sc}px "${CHALK}"` : `600 ${126 * sc}px "${CHALK}"`;
        yy += wrap(g, L.text, BW - 180).length * (isQ ? 158 : 138) * sc + (isQ ? 30 : 8) * sc;
      }
      if (yy <= BH - 50) break;
    }
    let y = 140;
    const optY: Record<string, [number, number, number]> = {};
    for (const L of lines) {
      const isQ = L.kind !== "opt";
      g.font = isQ ? `700 ${148 * sc}px "${CHALK}"` : `600 ${126 * sc}px "${CHALK}"`;
      const wrapped = wrap(g, L.text, BW - 180);
      const total = L.text.length;
      const shown = Math.floor(total * clamp((f - L.from) / Math.max(1, L.to - L.from)));
      let used = 0;
      for (const w of wrapped) {
        const take = Math.max(0, Math.min(w.length, shown - used));
        if (take > 0) {
          // tiza: dos pasadas levemente corridas para la textura
          g.globalAlpha = 0.9; g.fillText(w.slice(0, take), isQ ? 90 : 150, y);
          g.globalAlpha = 0.25; g.fillText(w.slice(0, take), (isQ ? 90 : 150) + 2, y + 1); g.globalAlpha = 1;
        }
        if (!isQ) { const key = L.text.trim()[0]; optY[key] = [isQ ? 90 : 150, y, g.measureText(w).width]; }
        used += w.length + 1; y += (isQ ? 158 : 138) * sc;
      }
      if (!isQ) y += 8 * sc; else y += 30 * sc;
    }
    // revelación: círculo de tiza sobre la correcta, tachón en las otras
    if (answer && revealAt !== undefined && f >= revealAt) {
      const p = ease(clamp((f - revealAt) / 14));
      for (const k of Object.keys(optY)) {
        const [x0, y0, w] = optY[k];
        g.lineWidth = 10; g.lineCap = "round";
        if (k === answer) {
          g.strokeStyle = "rgba(242,183,5,0.95)"; g.beginPath();
          g.ellipse(x0 + w / 2, y0 + 68 * sc, w / 2 + 60 * sc, 88 * sc, -0.03, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); g.stroke();
        } else {
          g.strokeStyle = `rgba(245,241,230,${0.75 * p})`; g.beginPath(); g.moveTo(x0 - 10, y0 + 72 * sc); g.lineTo(x0 - 10 + (w + 20) * p, y0 + 64 * sc); g.stroke();
        }
      }
    }
    tex.needsUpdate = true;
  }

  // reloj: normal, y en la cuenta regresiva salta de a un segundo
  const secs = countFrom !== undefined && f >= countFrom && (revealAt === undefined || f < revealAt) ? Math.floor((f - countFrom) / 30) : Math.floor(f / 30);
  const secAng = -(secs % 60) / 60 * Math.PI * 2;
  const counting = countFrom !== undefined && f >= countFrom && (revealAt === undefined || f < revealAt);

  // cámaras
  const t = f / D;
  const push = revealAt !== undefined && f >= revealAt ? ease(clamp((f - revealAt) / 40)) : 0;
  const CAMS = [
    { p: [0, 1.55, 5.2], l: [0, 1.6, -3] },          // de frente, desde la mitad del aula
    { p: [-1.9, 1.2, 3.4], l: [0.3, 1.5, -3] },      // por sobre el hombro, desde un pupitre
    { p: [2.4, 1.0, 3.8], l: [-0.2, 1.7, -3] },      // bajo, desde la derecha
    { p: [0.6, 2.3, 6.4], l: [0, 1.4, -3] },         // alto, fondo del aula
  ];
  const C = CAMS[angle % 4];
  const pos = new THREE.Vector3(C.p[0] - t * 0.25 * (angle % 2 ? -1 : 1), C.p[1] + Math.sin(f / 70) * 0.02, C.p[2] - t * 0.7 - push * 1.6 - (counting ? ((f - (countFrom ?? 0)) / 150) * 0.5 : 0));
  const look = new THREE.Vector3(C.l[0] * (1 - push), C.l[1] + push * 0.05, C.l[2]);
  const fade = clamp(f / 8) * (1 - clamp((f - (D - 8)) / 8));
  const desks: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) desks.push([-2.4 + c * 1.2, 0.2 + r * 1.25]);

  return (
    <AbsoluteFill style={{ background: "#120C08", opacity: fade }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 42, position: [0, 1.5, 5] }}>
        <Cam pos={pos} look={look} fov={42 - push * 6} />
        <color attach="background" args={["#1B140E"]} />
        <fog attach="fog" args={["#2A1E14", 9, 22]} />
        <ambientLight intensity={0.55} color="#FFE6C8" />
        <hemisphereLight args={["#FFE9C8", "#3A2A1C", 0.5]} />
        <directionalLight position={[-6, 4, 2]} intensity={2.4} color="#FFD29A" />
        <pointLight position={[0, 2.8, 1]} intensity={6} color="#FFF1D8" distance={9} />
        {/* piso de madera */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]}><planeGeometry args={[9, 12]} /><meshStandardMaterial map={woodTex()} roughness={0.7} /></mesh>
        {/* paredes: frente (pizarrón), izquierda (ventanas), derecha */}
        <mesh position={[0, 1.8, -3.2]}><planeGeometry args={[9, 3.6]} /><meshStandardMaterial color="#E7DCC2" roughness={0.95} /></mesh>
        <mesh position={[0, 0.55, -3.19]}><planeGeometry args={[9, 1.1]} /><meshStandardMaterial color="#5E7A5E" roughness={0.9} /></mesh>
        <mesh position={[-4.5, 1.8, 2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[12, 3.6]} /><meshStandardMaterial color="#E4D8BD" roughness={0.95} /></mesh>
        <mesh position={[4.5, 1.8, 2]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[12, 3.6]} /><meshStandardMaterial color="#E4D8BD" roughness={0.95} /></mesh>
        <mesh position={[0, 3.6, 2]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[9, 12]} /><meshStandardMaterial color="#EDE4D0" roughness={1} /></mesh>
        {/* ventanas con luz */}
        {[-1.5, 1.2, 3.9].map((z, i) => (
          <group key={i} position={[-4.48, 1.9, z]} rotation={[0, Math.PI / 2, 0]}>
            <mesh><planeGeometry args={[1.6, 1.9]} /><meshBasicMaterial color="#FFE7B8" toneMapped={false} /></mesh>
            <mesh position={[0, 0, 0.01]}><boxGeometry args={[0.05, 1.9, 0.02]} /><meshStandardMaterial color="#6B4A30" /></mesh>
            <mesh position={[0, 0, 0.01]}><boxGeometry args={[1.6, 0.05, 0.02]} /><meshStandardMaterial color="#6B4A30" /></mesh>
          </group>
        ))}
        {[-1.5, 1.2, 3.9].map((z, i) => (
          <mesh key={"ray" + i} position={[-2.6, 1.3, z - 0.6]} rotation={[0, 0.45, -0.75]}>
            <planeGeometry args={[1.5, 6]} />
            <meshBasicMaterial color="#FFD9A0" transparent opacity={0.09 + 0.02 * Math.sin(f / 40 + i)} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* pizarrón con marco y bandeja de tiza */}
        <mesh position={[0, 1.75, -3.15]}><boxGeometry args={[4.5, 2.35, 0.06]} /><meshStandardMaterial color="#5A3A22" roughness={0.6} /></mesh>
        <mesh position={[0, 1.75, -3.11]}><planeGeometry args={[4.3, 2.15]} /><meshStandardMaterial map={tex} roughness={0.95} emissive="#FFFFFF" emissiveMap={tex} emissiveIntensity={0.18} /></mesh>
        <mesh position={[0, 0.6, -3.05]}><boxGeometry args={[4.4, 0.05, 0.14]} /><meshStandardMaterial color="#5A3A22" /></mesh>
        <mesh position={[-1.4, 0.64, -3.02]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.09, 8]} /><meshStandardMaterial color="#F5F1E6" /></mesh>
        <mesh position={[1.1, 0.64, -3.0]}><boxGeometry args={[0.16, 0.05, 0.06]} /><meshStandardMaterial color="#6B4A30" /></mesh>
        {/* reloj de pared */}
        <group position={[-2.55, 2.85, -3.12]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.28, 0.28, 0.05, 40]} /><meshStandardMaterial color="#1E1E1E" metalness={0.5} /></mesh>
          <mesh position={[0, 0, 0.03]}><circleGeometry args={[0.25, 40]} /><meshStandardMaterial color="#F6F1E4" /></mesh>
          {Array.from({ length: 12 }, (_, i) => (
            <mesh key={i} position={[Math.sin(i / 12 * Math.PI * 2) * 0.21, Math.cos(i / 12 * Math.PI * 2) * 0.21, 0.035]} rotation={[0, 0, -i / 12 * Math.PI * 2]}>
              <planeGeometry args={[0.015, 0.05]} /><meshBasicMaterial color="#222" />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.04]} rotation={[0, 0, -0.9]}><planeGeometry args={[0.02, 0.26]} /><meshBasicMaterial color="#222" /></mesh>
          <group position={[0, 0, 0.045]} rotation={[0, 0, secAng]}>
            <mesh position={[0, 0.09, 0]}><planeGeometry args={[0.008, 0.2]} /><meshBasicMaterial color={counting ? "#C8102E" : "#333"} /></mesh>
          </group>
          {counting ? <sprite position={[0, 0, 0.1]} scale={[1.1, 1.1, 1]}><spriteMaterial map={glow()} color="#FFB36B" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite> : null}
        </group>
        {/* bandera en asta + globo + escritorio de la maestra */}
        <mesh position={[3.6, 1.6, -2.6]}><cylinderGeometry args={[0.02, 0.02, 3.0, 8]} /><meshStandardMaterial color="#C9A55A" metalness={0.8} /></mesh>
        <mesh position={[3.23, 2.6, -2.6]} rotation={[0, 0.25, Math.sin(f / 50) * 0.02]}><planeGeometry args={[0.72, 0.38, 8, 1]} /><meshStandardMaterial map={flagTex()} side={THREE.DoubleSide} roughness={0.8} /></mesh>
        {/* tira del alfabeto en cursiva sobre el pizarrón */}
        {fontOk ? <mesh position={[0, 3.12 - 0.02, -3.14]}><planeGeometry args={[4.4, 0.28]} /><meshStandardMaterial map={abcTex(CHALK)} roughness={0.9} /></mesh> : null}
        {/* mapa enrollable a la derecha del pizarrón */}
        <group position={[2.85, 2.1, -3.13]}>
          <mesh position={[0, 0.62, 0.02]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.04, 1.0, 12]} /><meshStandardMaterial color="#6B4A30" /></mesh>
          <mesh><planeGeometry args={[0.95, 1.2]} /><meshStandardMaterial map={mapTex()} roughness={0.9} /></mesh>
        </group>
        {/* lámparas de globo colgantes */}
        {[[-1.5, 0.5], [1.5, 0.5], [-1.5, 3.5], [1.5, 3.5]].map(([x, z], i) => (
          <group key={"lamp" + i} position={[x, 3.0, z]}>
            <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.008, 0.008, 0.6, 5]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh><sphereGeometry args={[0.2, 20, 16]} /><meshBasicMaterial color="#FFF3DA" toneMapped={false} /></mesh>
            <sprite scale={[1.2, 1.2, 1]}><spriteMaterial map={glow()} color="#FFE1B0" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
          </group>
        ))}
        <group position={[2.6, 0, -2.2]}>
          <mesh position={[0, 0.76, 0]}><boxGeometry args={[1.5, 0.06, 0.8]} /><meshStandardMaterial color="#6E4426" roughness={0.6} /></mesh>
          <mesh position={[0, 0.38, 0]}><boxGeometry args={[1.4, 0.72, 0.7]} /><meshStandardMaterial color="#5E3A20" roughness={0.7} /></mesh>
          <mesh position={[-0.45, 0.88, 0.1]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#C8102E" roughness={0.35} /></mesh>
          <group position={[0.4, 0.95, 0]} rotation={[0, f * 0.01, 0.4]}>
            <mesh><sphereGeometry args={[0.16, 24, 16]} /><meshStandardMaterial color="#6E97B8" roughness={0.5} /></mesh>
            <mesh rotation={[0, 0, 0]}><torusGeometry args={[0.18, 0.008, 6, 32]} /><meshStandardMaterial color="#C9A55A" metalness={0.8} /></mesh>
          </group>
        </group>
        {desks.map(([x, z], i) => <Desk key={i} x={x} z={z} paper={rnd(i + 3) > 0.3} />)}
        {/* partículas de tiza/polvo en los haces */}
        {Array.from({ length: 60 }, (_, i) => (
          <sprite key={"d" + i} position={[-3.8 + rnd(i) * 3.2, 0.4 + ((rnd(i + 5) * 2.6 + f * 0.002 * (0.5 + rnd(i + 9))) % 2.6), -2.5 + rnd(i + 2) * 7]} scale={[0.02, 0.02, 1]}>
            <spriteMaterial map={glow()} transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        ))}
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)" }} />
      {/* cuenta regresiva grande */}
      {counting ? (
        <div style={{ position: "absolute", right: 80, bottom: 60, width: 230, height: 230, borderRadius: 230, border: "8px solid rgba(242,183,5,0.9)",
          background: "rgba(18,12,8,0.55)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(242,183,5,0.35)",
          transform: `scale(${1 + 0.1 * (1 - ((f - (countFrom ?? 0)) % 30) / 30)})` }}>
          <div style={{ fontFamily: SANS, fontSize: 150, color: YC.bus, lineHeight: 1 }}>{Math.max(1, 5 - Math.floor((f - (countFrom ?? 0)) / 30))}</div>
          <svg style={{ position: "absolute", inset: -8 }} viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="#F5F1E6" strokeWidth="3" pathLength={1}
            strokeDasharray={1} strokeDashoffset={((f - (countFrom ?? 0)) % 30) / 30} transform="rotate(-90 50 50)" /></svg>
        </div>
      ) : null}
      {/* barra de progreso del examen */}
      <div style={{ position: "absolute", left: 90, bottom: 60, width: 420, opacity: 0.9 }}>
        <div style={{ fontFamily: SANS, fontSize: 26, letterSpacing: 8, color: YC.paper }}>QUESTION {n} / {total}</div>
        <div style={{ marginTop: 10, height: 6, background: "rgba(255,255,255,0.18)" }}><div style={{ width: `${(n / total) * 100}%`, height: "100%", background: YC.bus }} /></div>
      </div>
      {void easeInOut}
    </AbsoluteFill>
  );
};
