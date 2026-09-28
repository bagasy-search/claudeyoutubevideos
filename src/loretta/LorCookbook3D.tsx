// LorCookbook3D — el cuaderno de recetas de la iglesia en 3D real (three.js): espiral, tapas gastadas y hojas que
// pasan con curvatura hasta detenerse en la receta pedida (manuscrita). Reusable: pages[] con título + renglones.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOR, SERIF, HAND, rnd, fontsReady } from "./LorTheme";

export type BookPage = { title: string; lines: string[]; note?: string };

const W = 1.5, H = 2.0; // página
const SEG = 24;

function pageTex(p: BookPage | null, seed: number, mirror: boolean) {
  const cw = 768, ch = 1024;
  const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
  const c = cv.getContext("2d")!;
  if (mirror) { c.translate(cw, 0); c.scale(-1, 1); }
  c.fillStyle = "#F7EFDC"; c.fillRect(0, 0, cw, ch);
  // manchas de uso (grasa, café) y bordes tostados
  for (let i = 0; i < 5; i++) { const x = rnd(seed + i) * cw, y = rnd(seed + i + 50) * ch, r = 30 + rnd(seed + i + 90) * 90;
    const g = c.createRadialGradient(x, y, r * 0.2, x, y, r); g.addColorStop(0, "rgba(190,140,70,0.16)"); g.addColorStop(0.8, "rgba(190,140,70,0.10)"); g.addColorStop(1, "rgba(160,110,50,0)"); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  const e = c.createLinearGradient(0, 0, cw, 0); e.addColorStop(0, "rgba(150,110,60,0.18)"); e.addColorStop(0.08, "rgba(150,110,60,0)"); e.addColorStop(0.92, "rgba(150,110,60,0)"); e.addColorStop(1, "rgba(150,110,60,0.22)"); c.fillStyle = e; c.fillRect(0, 0, cw, ch);
  // renglones y margen rojo
  c.strokeStyle = "rgba(90,130,190,0.35)"; c.lineWidth = 2;
  for (let y = 190; y < ch - 40; y += 52) { c.beginPath(); c.moveTo(40, y); c.lineTo(cw - 30, y); c.stroke(); }
  c.strokeStyle = "rgba(200,60,60,0.45)"; c.beginPath(); c.moveTo(110, 0); c.lineTo(110, ch); c.stroke();
  if (p) {
    c.fillStyle = "#2E2118"; c.font = `700 64px ${SERIF}`; c.fillText(p.title, 124, 130, cw - 160);
    c.fillStyle = "#2B3A6B"; c.font = `600 44px ${HAND}`;
    p.lines.forEach((l, i) => c.fillText(l, 124, 180 + (i + 1) * 52 - 10, cw - 160));
    if (p.note) { c.fillStyle = "#B0303A"; c.font = `700 46px ${HAND}`; c.save(); c.translate(cw * 0.55, ch - 90); c.rotate(-0.06); c.fillText(p.note, 0, 0); c.restore(); }
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

// hoja que gira alrededor del lomo (eje Z), con curvatura: ángulo acumulado a lo largo del ancho
function setPage(g: any, p: number, lift = 0.004) {
  const pos = g.attributes.position as any;
  const bend = Math.sin(p * Math.PI) * 0.9;
  const cols = SEG + 1;
  const xs: number[] = [0], ys: number[] = [0];
  for (let k = 1; k < cols; k++) { const s = (k - 0.5) / SEG; const a = p * Math.PI + bend * (s - 0.35) * (1 - p * 0.3); xs.push(xs[k - 1] + Math.cos(a) * (W / SEG)); ys.push(ys[k - 1] + Math.sin(a) * (W / SEG)); }
  for (let i = 0; i < pos.count; i++) { const k = i % cols; const z = pos.getZ(i); pos.setXYZ(i, xs[k], ys[k] + lift, z); }
  pos.needsUpdate = true; g.computeVertexNormals();
}

function flatPage() {
  const g = new THREE.PlaneGeometry(W, H, SEG, 1);
  // plano XY → acostado en XZ, con el lomo en x=0
  g.rotateX(-Math.PI / 2); g.translate(W / 2, 0, 0);
  // PlaneGeometry viene en filas de (SEG+1) vértices → el índice i % (SEG+1) es la columna (distancia al lomo)
  return g;
}

const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};

export const LorCookbook3D: React.FC<{ pages: BookPage[]; flips?: number; flipStart?: number; flipEvery?: number; cover?: string }> = ({ pages, flips, flipStart = 12, flipEvery = 14, cover = "Church Suppers" }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const [ready, setReady] = useState(false);
  const [h] = useState(() => delayRender("fonts cookbook"));
  useEffect(() => { fontsReady().then(() => { setReady(true); continueRender(h); }); }, [h]);
  const nF = Math.max(0, Math.min(flips ?? pages.length - 1, pages.length - 1));
  // hojas: la hoja j muestra de frente la página j (derecha) y de dorso la izquierda de la j+1
  const leaves = useMemo(() => {
    if (!ready) return [];
    return Array.from({ length: nF }).map((_, j) => ({
      geo: flatPage(),
      front: new THREE.MeshStandardMaterial({ map: pageTex(pages[j], 100 + j, false), roughness: 0.95, side: THREE.FrontSide }),
      back: new THREE.MeshStandardMaterial({ map: pageTex({ title: "", lines: [], note: undefined }, 300 + j, true), roughness: 0.95, side: THREE.BackSide }),
    }));
  }, [ready, pages, nF]);
  const finalRight = useMemo(() => ready ? new THREE.MeshStandardMaterial({ map: pageTex(pages[nF], 200 + nF, false), roughness: 0.95 }) : null, [ready, pages, nF]);
  const leftBlank = useMemo(() => ready ? new THREE.MeshStandardMaterial({ map: pageTex(null, 999, true), roughness: 0.95 }) : null, [ready]);
  const coverMat = useMemo(() => {
    if (!ready) return null;
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512; const c = cv.getContext("2d")!;
    c.fillStyle = "#7E2A2A"; c.fillRect(0, 0, 512, 512); for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(255,255,255,${rnd(i) * 0.06})`; c.fillRect(rnd(i + 7) * 512, rnd(i + 13) * 512, 2, 2); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 });
  }, [ready]);
  leaves.forEach((L, j) => {
    const p = interpolate(frame, [flipStart + j * flipEvery, flipStart + j * flipEvery + flipEvery * 1.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    setPage(L.geo, p, 0.004 + (nF - j) * 0.0015);
  });
  const endFlip = flipStart + nF * flipEvery + flipEvery;
  const push = interpolate(frame, [endFlip - 6, Math.max(endFlip + 10, durationInFrames - 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const camPos: [number, number, number] = [0.25 + push * 0.5, 3.3 - push * 0.45, 1.9 - push * 0.75];
  const target: [number, number, number] = [0.1 + push * 0.65, 0, 0.05];
  const coverTitleOp = interpolate(frame, [flipStart, flipStart + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#E9DCC0" }}>
      {ready && coverMat && finalRight && leftBlank ? (
        <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: camPos, near: 0.05, far: 40 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <Cam pos={camPos} target={target} />
          <color attach="background" args={["#E9DCC0"]} />
          <hemisphereLight args={["#FFF6E4", "#9C7650", 1.0]} />
          <directionalLight position={[-2, 4, 2]} intensity={1.9} color="#FFF0D8" />
          {/* mesa enharinada */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}><planeGeometry args={[12, 12]} /><meshStandardMaterial color="#C9A57A" roughness={0.95} /></mesh>
          {/* tapas */}
          <mesh position={[-W / 2 - 0.02, -0.018, 0]} material={coverMat}><boxGeometry args={[W + 0.08, 0.02, H + 0.08]} /></mesh>
          <mesh position={[W / 2 + 0.02, -0.018, 0]} material={coverMat}><boxGeometry args={[W + 0.08, 0.02, H + 0.08]} /></mesh>
          {/* bloque de hojas debajo */}
          <mesh position={[W / 2, -0.004, 0]}><boxGeometry args={[W, 0.02, H]} /><meshStandardMaterial color="#EFE4CA" roughness={1} /></mesh>
          <mesh position={[-W / 2, -0.004, 0]}><boxGeometry args={[W, 0.02, H]} /><meshStandardMaterial color="#EFE4CA" roughness={1} /></mesh>
          {/* página izquierda fija y derecha final */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-W / 2, 0.0065, 0]} material={leftBlank}><planeGeometry args={[W, H]} /></mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[W / 2, 0.0062, 0]} material={finalRight}><planeGeometry args={[W, H]} /></mesh>
          {/* espiral */}
          {Array.from({ length: 16 }).map((_, i) => (
            <mesh key={i} position={[0, 0.01, -H / 2 + 0.08 + i * ((H - 0.16) / 15)]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.045, 0.008, 6, 16]} /><meshStandardMaterial color="#2A2A2A" metalness={0.6} roughness={0.35} /></mesh>
          ))}
          {leaves.map((L, j) => (
            <group key={j}>
              <mesh geometry={L.geo} material={L.front} />
              <mesh geometry={L.geo} material={L.back} />
            </group>
          ))}
        </ThreeCanvas>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: coverTitleOp, fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: LOR.ink }}>{cover}</div>
    </AbsoluteFill>
  );
};
