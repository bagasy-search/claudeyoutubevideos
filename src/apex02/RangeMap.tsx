// RangeMap.tsx — EE.UU. sur (de California a Luisiana) en relieve real (geo/terrain_us.py), misma maqueta de arena que DesertMap.
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H, k01, lerp, ease, easeOut, interp, SANS, shadow } from "./lib";

const L = -125, R = -82, T = 42, B = 24, K = 1.2;             // mismos límites que D:/rtmp/apex/apex02/geo/terrain_us.py
const LON0 = (L + R) / 2, LAT0 = (T + B) / 2;
export const ll = (lon: number, lat: number): [number, number] => [(lon - LON0) * K, -(lat - LAT0) * K];
const DISP = 1.6;

const useTex = (src: string, color = false) => {
  const [h] = useState(() => delayRender("tex " + src));
  const [tx, setTx] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    new THREE.TextureLoader().load(staticFile(src), (x) => { if (color) x.colorSpace = THREE.SRGBColorSpace; x.anisotropy = 8; setTx(x); }, undefined, () => continueRender(h));
  }, [src]);
  useEffect(() => { if (tx) requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h)))); }, [tx]);
  return tx;
};
// color: tierra arcilla clara, mar arcilla celeste (sale de la máscara de tierra)
const useLandColor = () => {
  const [h] = useState(() => delayRender("land"));
  const [tx, setTx] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const im = new Image(), ih = new Image(); let n = 0; im.src = staticFile("apex02/map/us_land.png"); ih.src = staticFile("apex02/map/us_h.png");
    const go = () => {
      if (++n < 2) return;
      const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const g = c.getContext("2d")!;
      g.drawImage(ih, 0, 0); const hd = g.getImageData(0, 0, c.width, c.height).data;
      g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const a = d.data[i] / 255, e = hd[i] / 255, r = lerp(233, 150, e), gg = lerp(196, 92, e), b = lerp(138, 60, e);
        d.data[i] = lerp(38, r, a); d.data[i + 1] = lerp(78, gg, a); d.data[i + 2] = lerp(104, b, a);
      }
      g.putImageData(d, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; setTx(t);
    };
    im.onload = go; ih.onload = go;
    im.onerror = () => continueRender(h); ih.onerror = () => continueRender(h);
  }, []);
  useEffect(() => { if (tx) requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h)))); }, [tx]);
  return tx;
};
const GX = 1376, GZ = 576;
const useHeights = () => {
  const [h] = useState(() => delayRender("heights"));
  const [hs, setHs] = useState<Float32Array | null>(null);
  useEffect(() => {
    const im = new Image(); im.src = staticFile("apex02/map/us_h.png");
    im.onload = () => {
      const c = document.createElement("canvas"); c.width = GX; c.height = GZ; const g = c.getContext("2d")!;
      g.drawImage(im, 0, 0, GX, GZ); const d = g.getImageData(0, 0, GX, GZ).data, a = new Float32Array(GX * GZ);
      for (let i = 0; i < a.length; i++) a[i] = d[i * 4] / 255;
      setHs(a); continueRender(h);
    };
    im.onerror = () => continueRender(h);
  }, []);
  return hs;
};
const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(pos); c.lookAt(look); if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  return null;
};
const Relief: React.FC<{ hs: Float32Array; col: THREE.Texture }> = ({ hs, col }) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry((R - L) * K, (T - B) * K, GX - 1, GZ - 1); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const v = hs[i]; p.setY(i, v > 0.004 ? 0.08 + v * DISP : -0.04); }
    g.computeVertexNormals(); return g;
  }, [hs]);
  return <mesh geometry={geo} receiveShadow castShadow>
    <meshStandardMaterial map={col} roughness={1} metalness={0} />
  </mesh>;
};

export type CKey = { at: number; pos: [number, number, number]; look: [number, number, number]; fov?: number };
export type CPin = { at: number; out?: number; lon: number; lat: number; label: string; sub?: string; ring?: boolean };
export type CRegion = { at: number; out?: number; poly: [number, number][] };
export type CRoute = { at: number; from: [number, number]; to: [number, number]; d?: number };
export const RangeMap: React.FC<{ t0: number; keys: CKey[]; pins?: CPin[]; routes?: CRoute[]; regions?: CRegion[]; dark?: (t: number) => number }> = ({ t0, keys, pins = [], routes = [], regions = [], dark }) => {
  const f = useCurrentFrame(), t = f / FPS - t0;
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1].at) i++;
  const A = keys[i], Bk = keys[Math.min(i + 1, keys.length - 1)];
  const u = ease(k01(t, A.at, Bk.at));
  const cam = useMemo(() => new THREE.PerspectiveCamera(32, W / H, 0.05, 400), []);
  cam.fov = lerp(A.fov ?? 32, Bk.fov ?? 32, u);
  const P = new THREE.Vector3(...(A.pos.map((v, n) => lerp(v, Bk.pos[n], u)) as [number, number, number]));
  const LK = new THREE.Vector3(...(A.look.map((v, n) => lerp(v, Bk.look[n], u)) as [number, number, number]));
  cam.position.copy(P); cam.lookAt(LK);
  cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const dk = dark ? dark(t) : 0;
  const hs = useHeights(), col = useLandColor();
  const band = (top: boolean, px: number, h: number, from: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, [top ? "top" : "bottom"]: 0, height: h, backdropFilter: `blur(${px}px)`, WebkitBackdropFilter: `blur(${px}px)`,
      maskImage: `linear-gradient(${top ? "to bottom" : "to top"}, black ${from}%, transparent 100%)`, WebkitMaskImage: `linear-gradient(${top ? "to bottom" : "to top"}, black ${from}%, transparent 100%)` }} />
  );
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {hs && col && <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 32, position: [0, 60, 40], near: 0.05, far: 400 }}>
        <Cam pos={P} look={LK} fov={cam.fov} />
        <color attach="background" args={["#1d2b38"]} />
        <fog attach="fog" args={["#3a3a44", 60, 150]} />
        <hemisphereLight args={["#9fb8d0", "#6b4a2e", 0.9 * (1 - dk * 0.6)]} />
        <ambientLight color="#c9a07a" intensity={0.3 * (1 - dk * 0.6)} />
        <directionalLight position={[-40, 16, 14]} intensity={3.6 * (1 - dk * 0.75)} color="#ffc58a" castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096}
          shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0004} />
        <Relief hs={hs} col={col} />
      </ThreeCanvas>}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {regions.map((r, n) => {
          const p = ease(k01(t, r.at, r.at + 1.0)), o = interp(t, [r.at, r.at + 0.2, (r.out ?? 99) - 0.3, r.out ?? 99], [0, 1, 1, 0]); if (o <= 0) return null;
          const pts = r.poly.map(([lo, la]) => { const [x, z] = ll(lo, la), v = new THREE.Vector3(x, 1.2, z).project(cam); return `${((v.x * 0.5 + 0.5) * W).toFixed(1)},${((-v.y * 0.5 + 0.5) * H).toFixed(1)}`; }).join(" ");
          return <g key={n} opacity={o}>
            <polygon points={pts} fill={`rgba(227,32,46,${0.22 * k01(t, r.at + 0.8, r.at + 1.3)})`} stroke="none" />
            <polygon points={pts} fill="none" stroke="#E3202E" strokeWidth={5} pathLength={1} strokeDasharray={`${p} 1`} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px #ff4a4a)" }} />
          </g>;
        })}
        {routes.map((r, n) => {
          const p = ease(k01(t, r.at, r.at + (r.d ?? 0.7))); if (p <= 0) return null;
          const pts: string[] = [];
          for (let i = 0; i <= 24; i++) {
            const u = (i / 24) * p, [x0, z0] = ll(...r.from), [x1, z1] = ll(...r.to);
            const v = new THREE.Vector3(lerp(x0, x1, u), 0.6 + Math.sin(Math.PI * u) * Math.hypot(x1 - x0, z1 - z0) * 0.18, lerp(z0, z1, u)).project(cam);
            pts.push(`${((v.x * 0.5 + 0.5) * W).toFixed(1)},${((-v.y * 0.5 + 0.5) * H).toFixed(1)}`);
          }
          return <polyline key={n} points={pts.join(" ")} fill="none" stroke="#fff4ea" strokeWidth={3.5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #ff9a5a)" }} />;
        })}
      </svg>
      {pins.map((p, n) => {
        const a = interp(t, [p.at, p.at + 0.3, (p.out ?? 99) - 0.3, p.out ?? 99], [0, 1, 1, 0]); if (a <= 0) return null;
        const [x, z] = ll(p.lon, p.lat), c = new THREE.Vector3(x, 0.6, z).project(cam);
        const sx = (c.x * 0.5 + 0.5) * W, sy = (-c.y * 0.5 + 0.5) * H, g = easeOut(k01(t, p.at, p.at + 0.5)), pulse = 1 + 0.08 * Math.sin(t * 5);
        return <div key={n} style={{ position: "absolute", left: 0, top: 0, opacity: a }}>
          {p.ring !== false && <svg width={W} height={H} style={{ position: "absolute" }}>
            <ellipse cx={sx} cy={sy} rx={70 * g * pulse} ry={38 * g * pulse} fill="none" stroke="#eaf7ff" strokeWidth={4} style={{ filter: "drop-shadow(0 0 10px #7fd0ff)" }} />
            <ellipse cx={sx} cy={sy} rx={96 * g} ry={52 * g} fill="none" stroke="rgba(234,247,255,.45)" strokeWidth={2} strokeDasharray="10 12" />
            <circle cx={sx} cy={sy} r={7} fill="#fff" />
          </svg>}
          {p.ring === false && <div style={{ position: "absolute", left: sx - 9 * g, top: sy - 9 * g, width: 18 * g, height: 18 * g, borderRadius: 9, background: "#ff8a2b", border: "3px solid #fff", boxShadow: "0 0 16px #ff8a2b" }} />}
          <div style={{ position: "absolute", left: sx + (p.ring === false ? 22 : 120), top: sy - (p.ring === false ? 22 : 44), color: "#fff", textShadow: shadow, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: p.ring === false ? 30 : 44, letterSpacing: p.ring === false ? 4 : 7 }}>{p.label.slice(0, Math.ceil(p.label.length * k01(t, p.at, p.at + 0.45)))}</div>
            {p.sub && <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 28, opacity: k01(t, p.at + 0.3, p.at + 0.6) }}>{p.sub}</div>}
          </div>
        </div>;
      })}
      {band(true, 5, 380, 20)}{band(true, 12, 220, 30)}{band(false, 5, 380, 20)}{band(false, 12, 220, 30)}
      {dk > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(10,14,22,${dk * 0.55})` }} />}
    </div>
  );
};
