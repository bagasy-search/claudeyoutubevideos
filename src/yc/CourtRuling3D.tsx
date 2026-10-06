// CourtRuling3D — el fallo o la ley como documento sobre el estrado (three.js, se PRE-RENDERIZA con GPU).
// Sala de madera oscura con haz de luz; el documento tiene el título del caso y el año en relieve (bumpMap),
// una línea se resalta con marcador, y el mazo golpea el taco con rebote de cámara y polvo.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SERIF, TYPE, SANS, YC, clamp, ease, rnd } from "./theme";

const DW = 1.1, DH = 1.42;               // documento
const TW = 1024, TH = 1320;
const canvas = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" "); const out: string[] = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur); return out;
}
// dibuja el documento; `hl` = progreso del resaltado (0..1) sobre la línea `highlight`
function drawDoc(g: CanvasRenderingContext2D, o: { court: string; caseName: string; cite: string; year: string; lines: string[]; highlight: number; hl: number }, bump = false) {
  g.fillStyle = bump ? "#808080" : "#F1E8D2"; g.fillRect(0, 0, TW, TH);
  if (!bump) {
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(90,60,30,${rnd(i * 3) * 0.05})`; g.fillRect(rnd(i) * TW, rnd(i + 9) * TH, 1 + rnd(i) * 2, 1); }
    const e = g.createRadialGradient(TW / 2, TH / 2, TH * 0.3, TW / 2, TH / 2, TH * 0.8); e.addColorStop(0, "rgba(120,85,40,0)"); e.addColorStop(1, "rgba(120,85,40,0.25)"); g.fillStyle = e; g.fillRect(0, 0, TW, TH);
  }
  const ink = bump ? "#FFFFFF" : "#1D1712";
  g.textAlign = "center"; g.fillStyle = ink;
  g.font = `600 36px "${SANS}"`; g.fillText(o.court, TW / 2, 110);
  g.fillRect(TW / 2 - 220, 135, 440, 3);
  g.font = `400 ${o.caseName.length > 22 ? 70 : 88}px "${SERIF}"`;
  const tl = wrap(g, o.caseName, TW - 160); tl.forEach((l, i) => g.fillText(l, TW / 2, 250 + i * 96));
  let y = 250 + tl.length * 96;
  g.font = `400 34px "${TYPE}"`; g.fillText(o.cite, TW / 2, y); y += 40;
  g.font = `400 170px "${SERIF}"`; g.fillText(o.year, TW / 2, y + 160); y += 230;
  g.fillRect(120, y, TW - 240, 2); y += 70;
  g.textAlign = "left"; g.font = `400 40px "${TYPE}"`;
  o.lines.forEach((L, i) => {
    const ls = wrap(g, L, TW - 240);
    if (i === o.highlight && !bump && o.hl > 0) {
      g.fillStyle = "rgba(255,214,60,0.62)";
      ls.forEach((_, k) => { const w = g.measureText(ls[k]).width; const p = clamp(o.hl * ls.length - k); if (p > 0) g.fillRect(112, y + k * 54 - 38, (w + 16) * p, 50); });
    }
    g.fillStyle = bump ? "#A0A0A0" : "rgba(29,23,18,0.9)";
    ls.forEach((l, k) => g.fillText(l, 120, y + k * 54));
    y += ls.length * 54 + 26;
  });
}
const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(look);
  const c = camera as THREE.PerspectiveCamera; if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); } return null;
};
let _glow: THREE.Texture | null = null;
const glow = () => { if (_glow) return _glow; const c = canvas(64, 64); const g = c.getContext("2d")!; const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,244,220,1)"); gr.addColorStop(1, "rgba(255,230,180,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); _glow = new THREE.CanvasTexture(c); return _glow; };
let _wood: THREE.Texture | null = null;
const wood = () => {
  if (_wood) return _wood; const c = canvas(512, 512); const g = c.getContext("2d")!;
  g.fillStyle = "#3A1F12"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 500; i++) { g.strokeStyle = `rgba(${rnd(i) > 0.5 ? "0,0,0" : "120,70,40"},${0.05 + rnd(i + 1) * 0.12})`; g.lineWidth = 1 + rnd(i + 2) * 2; g.beginPath(); const y = rnd(i + 3) * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + 6 * rnd(i), 340, y - 6, 512, y + 3); g.stroke(); }
  _wood = new THREE.CanvasTexture(c); _wood.colorSpace = THREE.SRGBColorSpace; _wood.wrapS = _wood.wrapT = THREE.RepeatWrapping; _wood.repeat.set(2, 2); _wood.anisotropy = 8; return _wood;
};

export const CourtRuling3D: React.FC<{
  caseName: string; cite: string; year: string; lines: string[]; highlight?: number; court?: string; hitAt?: number; angle?: number; caption?: string;
}> = ({ caseName, cite, year, lines, highlight = 0, court = "SUPREME COURT OF THE UNITED STATES", hitAt = 30, angle = 0, caption }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const [h] = useState(() => delayRender("fuentes del fallo"));
  const [ok, setOk] = useState(false);
  useEffect(() => { Promise.all([SERIF, TYPE, SANS].map((x) => document.fonts.load(`60px "${x}"`))).then(() => document.fonts.ready).then(() => { setOk(true); continueRender(h); }); }, [h]);
  const docC = useMemo(() => canvas(TW, TH), []);
  const docT = useMemo(() => { const t = new THREE.CanvasTexture(docC); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }, [docC]);
  const bumpT = useMemo(() => {
    if (!ok) return null; const c = canvas(TW, TH); drawDoc(c.getContext("2d")!, { court, caseName, cite, year, lines, highlight, hl: 0 }, true);
    return new THREE.CanvasTexture(c);
  }, [ok, court, caseName, cite, year, lines, highlight]);
  const hl = ease(clamp((f - hitAt - 12) / 26));
  if (ok) { drawDoc(docC.getContext("2d")!, { court, caseName, cite, year, lines, highlight, hl }); docT.needsUpdate = true; }

  // mazo: se levanta y golpea en hitAt; rebote chico
  const lift = interpolate(f, [0, hitAt - 10], [0.25, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const slam = interpolate(f, [hitAt - 7, hitAt], [1.05, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const bounce = f >= hitAt ? 0.12 * Math.exp(-(f - hitAt) / 4) * Math.abs(Math.sin((f - hitAt) * 0.9)) : 0;
  const gAng = f < hitAt - 7 ? lift : f < hitAt ? slam : bounce;
  const kick = f >= hitAt ? Math.exp(-(f - hitAt) / 5) : 0;
  const shake = kick * 0.03 * Math.sin((f - hitAt) * 2.4);

  const CAMS = [
    { p: [0.45, 1.9, 1.5], l: [0.12, 0.9, 0.08], fov: 40 },
    { p: [-0.35, 2.05, 1.45], l: [0.1, 0.9, 0.05], fov: 40 },
    { p: [0.25, 2.3, 0.75], l: [0.12, 0.9, 0.0], fov: 42 },
  ];
  const C = CAMS[angle % 3];
  const t = f / D;
  const look = new THREE.Vector3(...(C.l as [number, number, number]));
  const pos = new THREE.Vector3(...(C.p as [number, number, number]));
  pos.lerp(look, 0.06 + Math.min(1, f / 240) * 0.1 + ease(clamp((f - hitAt - 10) / 40)) * 0.06);
  pos.x += shake; pos.y += kick * 0.03;
  const burst = f >= hitAt && f < hitAt + 24 ? (f - hitAt) / 24 : -1;
  const fade = clamp(f / 8) * (1 - clamp((f - (D - 8)) / 8));
  const BY = 0.9; // altura del estrado
  const gx = 0.6, gz = 0.42; // taco

  return (
    <AbsoluteFill style={{ background: "#0B0705", opacity: fade }}>
      {ok && bumpT ? (
        <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 38, position: [0.55, 1.95, 1.35], near: 0.05, far: 40 }}>
          <Cam pos={pos} look={look} fov={C.fov} />
          <color attach="background" args={["#0D0806"]} />
          <fog attach="fog" args={["#0D0806", 3, 9]} />
          <ambientLight intensity={0.25} color="#FFE0B8" />
          <spotLight position={[0.4, 3.2, 1.2]} angle={0.5} penumbra={0.7} intensity={18} color="#FFE9CC" distance={8} />
          <directionalLight position={[-3, 3, -2]} intensity={1.2} color="#FFC98A" />
          <pointLight position={[1.0, 1.7, 1.3]} intensity={6} color="#FFD9A8" distance={4} />
          {/* estrado */}
          <mesh position={[0, BY / 2, -0.2]}><boxGeometry args={[3.4, BY, 1.4]} /><meshStandardMaterial map={wood()} roughness={0.35} metalness={0.05} /></mesh>
          <mesh position={[0, BY + 0.01, -0.2]}><boxGeometry args={[3.5, 0.03, 1.5]} /><meshStandardMaterial map={wood()} roughness={0.25} /></mesh>
          {/* paneles del fondo con columnas */}
          <mesh position={[0, 2, -2.6]}><planeGeometry args={[9, 5]} /><meshStandardMaterial map={wood()} color="#8A5A3A" roughness={0.6} /></mesh>
          {[-2.4, -0.8, 0.8, 2.4].map((x) => (<mesh key={x} position={[x, 2, -2.45]}><cylinderGeometry args={[0.16, 0.18, 4.5, 24]} /><meshStandardMaterial color="#D9CFBC" roughness={0.7} /></mesh>))}
          {/* documento con relieve */}
          <mesh position={[-0.15, BY + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0.06]}><planeGeometry args={[DW, DH]} /><meshStandardMaterial map={docT} bumpMap={bumpT} bumpScale={0.6} roughness={0.85} /></mesh>
          {/* hojas debajo, corridas */}
          <mesh position={[-0.12, BY + 0.02, 0.02]} rotation={[-Math.PI / 2, 0, 0.11]}><planeGeometry args={[DW, DH]} /><meshStandardMaterial color="#E4D8BC" roughness={0.9} /></mesh>
          {/* taco y mazo */}
          <mesh position={[gx, BY + 0.045, gz]}><cylinderGeometry args={[0.13, 0.14, 0.05, 40]} /><meshStandardMaterial map={wood()} color="#9A6A45" roughness={0.3} /></mesh>
          <group position={[gx + 0.42, BY + 0.175, gz]} rotation={[0, 0, -gAng]}>
            <mesh position={[-0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.022, 0.028, 0.44, 20]} /><meshStandardMaterial map={wood()} color="#C8925E" roughness={0.3} /></mesh>
            <group position={[-0.42, 0, 0]}>
              <mesh rotation={[0, 0, 0]}><cylinderGeometry args={[0.065, 0.065, 0.2, 32]} /><meshStandardMaterial map={wood()} color="#C08A58" roughness={0.25} /></mesh>
              {[-0.07, 0.07].map((y) => (<mesh key={y} position={[0, y, 0]}><torusGeometry args={[0.066, 0.006, 8, 32]} /><meshStandardMaterial color="#C9A55A" metalness={0.9} roughness={0.25} /></mesh>))}
            </group>
          </group>
          {burst >= 0 ? Array.from({ length: 50 }, (_, i) => {
            const a = rnd(i + 3) * Math.PI * 2, r = ease(burst) * (0.1 + rnd(i + 5) * 0.35);
            return (<sprite key={i} position={[gx + Math.cos(a) * (0.12 + r), BY + 0.06 + ease(burst) * rnd(i + 7) * 0.25, gz + Math.sin(a) * (0.12 + r)]} scale={[0.015 + rnd(i) * 0.02, 0.015 + rnd(i) * 0.02, 1]}>
              <spriteMaterial map={glow()} color="#F2E2C4" transparent opacity={0.85 * (1 - burst)} depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>);
          }) : null}
          {Array.from({ length: 60 }, (_, i) => (
            <sprite key={"d" + i} position={[-1.6 + rnd(i) * 3.2, 0.9 + ((rnd(i + 5) * 2 + f * 0.0014 * (0.4 + rnd(i + 9))) % 2), -1.5 + rnd(i + 2) * 2.6]} scale={[0.012, 0.012, 1]}>
              <spriteMaterial map={glow()} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>
          ))}
        </ThreeCanvas>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.65) 100%)" }} />
      <AbsoluteFill style={{ background: "#FFF1D8", opacity: f >= hitAt ? 0.2 * Math.exp(-(f - hitAt) / 3) : 0 }} />
      {caption ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: TYPE, fontSize: 42, color: YC.paper, textShadow: "0 4px 18px rgba(0,0,0,0.95)", opacity: ease(clamp((f - hitAt - 20) / 12)) }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};
