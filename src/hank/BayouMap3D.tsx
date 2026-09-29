// BayouMap3D — la costa de Luisiana en 3D real (three.js) con imagen satelital MODIS (NASA, dominio público):
// relieve leve de la tierra, agua con reflejo que se mueve, y los "eat-outs" (marisma comida por nutrias) como manchas
// de barro que crecen o se achican según la serie de datos por año. La cámara vuela en picada desde la vista aérea
// hasta la franja de marisma; contador de año y acres dañados; pines de parroquias.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SANS, SERIF, MONO, HK, clamp, ease, easeInOut, lerp, rnd } from "./theme";

// bbox de la imagen: lon -94.1..-88.75, lat 28.85..31.1  (3600 x 1514 px)
const LON0 = -94.1, LON1 = -88.75, LAT0 = 28.85, LAT1 = 31.1;
const PW = 16, PH = PW * (LAT1 - LAT0) / (LON1 - LON0) * 1.14; // 1.14 ≈ corrección de latitud (cos 30°)
export const geo = (lon: number, lat: number): [number, number] => [(lon - LON0) / (LON1 - LON0) * PW - PW / 2, -((lat - LAT0) / (LAT1 - LAT0) * PH - PH / 2)];

export type DamagePoint = { year: number; acres: number };
export type Pin = { name: string; lon: number; lat: number };
export type CamKey = { t: number; pos: [number, number, number]; look: [number, number, number] };

// focos de eat-out: se eligen SOBRE la marisma real (tierra de la máscara, cerca del agua, franja costera)
function pickHots(mask: HTMLImageElement): [number, number, number][] {
  const c = document.createElement("canvas"); c.width = 900; c.height = 379;
  const g = c.getContext("2d")!; g.drawImage(mask, 0, 0, c.width, c.height);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const water = (x: number, y: number) => d[(y * c.width + x) * 4] > 128;
  const out: [number, number, number][] = [];
  for (let i = 0; out.length < 260 && i < 20000; i++) {
    const lon = lerp(-93.9, -89.2, rnd(i + 7)), lat = lerp(29.1, 30.05, rnd(i + 3));
    const x = Math.floor((lon - LON0) / (LON1 - LON0) * c.width), y = Math.floor((1 - (lat - LAT0) / (LAT1 - LAT0)) * c.height);
    if (x < 3 || y < 3 || x >= c.width - 3 || y >= c.height - 3 || water(x, y)) continue;
    let near = 0; for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) if (water(x + dx, y + dy)) near++;
    if (near < 1 && rnd(i + 99) > 0.35) continue; // prefiero tierra pegada al agua (marisma), algo tierra adentro también
    out.push([lon, lat, 0.4 + rnd(i + 11) * 0.8]);
  }
  return out;
}

const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.lookAt(look);
  const c = camera as THREE.PerspectiveCamera; if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  return null;
};

const useTex = (src: string) => {
  const [h] = useState(() => delayRender("tex " + src));
  const [t, setT] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    new THREE.TextureLoader().load(staticFile(src), (tx) => { tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; setT(tx); continueRender(h); }, undefined, () => continueRender(h));
  }, [src, h]);
  return t;
};

export const BayouMap3D: React.FC<{
  series: DamagePoint[]; cams?: CamKey[]; pins?: Pin[]; title?: string; unit?: string; showYear?: boolean; maxAcres?: number;
}> = ({ series, cams, pins = [], title, unit = "ACRES OF MARSH EATEN", showYear = true, maxAcres }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const t = clamp(f / (D - 1));
  const color = useTex("yc/hank/color_graded.jpg");
  const mask = useTex("yc/hank/watermask.png");
  const HOTS = useMemo(() => (mask?.image ? pickHots(mask.image as HTMLImageElement) : []), [mask]);

  // interpolación de la serie en el tiempo del componente (la serie se recorre del 12 % al 88 %)
  const st = clamp((t - 0.12) / 0.76);
  const idx = st * (series.length - 1);
  const i0 = Math.floor(idx), i1 = Math.min(series.length - 1, i0 + 1), fr = idx - i0;
  const acres = lerp(series[i0].acres, series[i1].acres, easeInOut(fr));
  // el contador muestra SOLO años medidos (nunca una cifra interpolada que no existe): salta de dato en dato
  const shown = series[fr >= 0.5 ? i1 : i0];
  const year = shown.year;
  const maxA = maxAcres ?? Math.max(...series.map((s) => s.acres));   // escala fija (pico 1999) para que 3.854 no se pinte como el máximo
  const amount = acres / maxA;

  // capa de eat-outs: canvas redibujado por cuadro
  const cv = useMemo(() => { const c = document.createElement("canvas"); c.width = 1800; c.height = 757; return c; }, []);
  const overlay = useMemo(() => { const x = new THREE.CanvasTexture(cv); x.colorSpace = THREE.SRGBColorSpace; return x; }, [cv]);
  {
    const g = cv.getContext("2d")!;
    g.clearRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < HOTS.length; i++) {
      const [lon, lat, w] = HOTS[i];
      const x = (lon - LON0) / (LON1 - LON0) * cv.width, y = (1 - (lat - LAT0) / (LAT1 - LAT0)) * cv.height;
      const rank = rnd(i + 21); // cada mancha tiene su umbral: con el daño al 100 % están todas, al 4 % quedan pocas
      const on = clamp((amount - rank * 0.96) / 0.12);
      if (on <= 0) continue;
      const r = (3 + w * 9) * on;
      // mancha de barro irregular con un "ojo" de agua oscura adentro (la marisma comida se vuelve agua abierta)
      g.fillStyle = `rgba(150,98,48,${0.85 * on})`; g.beginPath();
      for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2, rr = r * (0.55 + rnd(i * 13 + k) * 0.7); k ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
      g.closePath(); g.fill();
      if (on > 0.5) { g.fillStyle = `rgba(28,52,50,${0.8 * (on - 0.5) * 2})`; g.beginPath(); g.arc(x + r * 0.15, y - r * 0.1, r * 0.4, 0, 7); g.fill(); }
    }
    overlay.needsUpdate = true;
  }

  // cámara por keyframes (por defecto: aérea alta → picada oblicua sobre la marisma)
  const K: CamKey[] = cams ?? [
    { t: 0, pos: [0, 8.5, 4.2], look: [0, 0, 0.6] },
    { t: 0.55, pos: [-1.2, 5.2, 4.6], look: [-0.4, 0, 1.4] },
    { t: 1, pos: [0.9, 3.6, 4.6], look: [0.6, 0, 1.6] },
  ];
  let a = K[0], b = K[K.length - 1];
  for (let k = 0; k < K.length - 1; k++) if (t >= K[k].t && t <= K[k + 1].t) { a = K[k]; b = K[k + 1]; }
  const ct = easeInOut(clamp((t - a.t) / Math.max(0.0001, b.t - a.t)));
  const pos = new THREE.Vector3(...a.pos).lerp(new THREE.Vector3(...b.pos), ct);
  const look = new THREE.Vector3(...a.look).lerp(new THREE.Vector3(...b.look), ct);
  pos.x += Math.sin(f / 70) * 0.05; pos.y += Math.sin(f / 53) * 0.03;

  const fade = clamp(f / 10) * (1 - clamp((f - (D - 10)) / 10));
  return (
    <AbsoluteFill style={{ background: "#07100F", opacity: fade }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 40, position: [0, 10, 6] }}>
        <Cam pos={pos} look={look} fov={40} />
        <color attach="background" args={["#1A2A28"]} />
        <fog attach="fog" args={["#1A2A28", 9, 20]} />
        <ambientLight intensity={1.6} />
        <directionalLight position={[-6, 8, 4]} intensity={2.4} color="#FFE9C8" />
        {color && mask ? (
          <>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[PW, PH, 512, 216]} />
              <meshStandardMaterial map={color} displacementMap={mask} displacementScale={-0.03} displacementBias={0.02} roughness={0.9} metalness={0} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.071, 0]}>
              <planeGeometry args={[PW, PH]} />
              <meshBasicMaterial map={overlay} transparent depthWrite={false} alphaMap={undefined} />
            </mesh>
            {/* agua: plano bajo con brillo que barre */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
              <planeGeometry args={[PW * 3, PH * 3]} />
              <meshStandardMaterial color="#123C44" roughness={0.2} metalness={0.5} transparent opacity={0.5} />
            </mesh>

          </>
        ) : null}
        {pins.map((p, i) => {
          const [x, z] = geo(p.lon, p.lat);
          const show = ease(clamp((t - 0.15 - i * 0.08) / 0.1));
          return (
            <group key={p.name} position={[x, 0.08, z]} scale={show}>
              <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.012, 0.012, 0.36, 8]} /><meshBasicMaterial color={HK.orange} /></mesh>
              <mesh position={[0, 0.38, 0]}><sphereGeometry args={[0.05, 16, 16]} /><meshBasicMaterial color={HK.orange} toneMapped={false} /></mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.09 + 0.05 * Math.sin(f / 8 + i), 32]} /><meshBasicMaterial color={HK.orange} transparent opacity={0.7} /></mesh>
            </group>
          );
        })}
      </ThreeCanvas>
      {/* etiquetas HTML de los pines (proyección simple por cámara) */}
      <PinLabels pins={pins} pos={pos} look={look} t={t} width={width} height={height} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%)" }} />
      {title ? <div style={{ position: "absolute", left: 80, top: 60, fontFamily: SANS, fontSize: 36, letterSpacing: 10, color: HK.bone, opacity: ease(f / 16), textShadow: "0 3px 14px rgba(0,0,0,0.8)" }}>{title}</div> : null}
      {showYear ? (
        <div style={{ position: "absolute", right: 80, bottom: 70, textAlign: "right", opacity: ease((f - 10) / 16) }}>
          <div style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 1, color: HK.bone, textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>{year}</div>
          <div style={{ fontFamily: MONO, fontSize: 40, color: HK.orange, marginTop: 6 }}>{Math.round(shown.acres).toLocaleString("en-US")}</div>
          <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: 6, color: HK.bone, opacity: 0.85 }}>{unit}</div>
          <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: HK.bone, opacity: 0.6, marginTop: 4 }}>LDWF AERIAL SURVEY ESTIMATE</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const PinLabels: React.FC<{ pins: Pin[]; pos: THREE.Vector3; look: THREE.Vector3; t: number; width: number; height: number }> = ({ pins, pos, look, t, width, height }) => {
  const cam = useMemo(() => new THREE.PerspectiveCamera(40, width / height, 0.1, 100), [width, height]);
  cam.position.copy(pos); cam.lookAt(look); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  return (
    <>
      {pins.map((p, i) => {
        const [x, z] = geo(p.lon, p.lat);
        const v = new THREE.Vector3(x, 0.5, z).project(cam);
        const show = ease(clamp((t - 0.18 - i * 0.08) / 0.1));
        return (
          <div key={p.name} style={{ position: "absolute", left: (v.x * 0.5 + 0.5) * width, top: (-v.y * 0.5 + 0.5) * height, transform: "translate(-50%, -120%)",
            fontFamily: SANS, fontSize: 26, letterSpacing: 4, color: HK.bone, background: "rgba(11,15,12,0.72)", padding: "4px 12px", borderLeft: `4px solid ${HK.orange}`, opacity: show, whiteSpace: "nowrap" }}>
            {p.name}
          </div>
        );
      })}
    </>
  );
};
