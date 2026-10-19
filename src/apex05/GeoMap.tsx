// GeoMap.tsx — apex05: relieve real (Terrarium) del mundo, India y Japón con los lagos de verdad (copiado de apex04).
// Paleta "expediente": tierra oliva-barro, agua negra-verde, pines rojos. Coordenadas: x = (lon - LON0) * K, z = -(lat - LAT0) * K.
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H, k01, lerp, ease, easeOut, interp, COND, SANS, RED, shadow } from "./lib";

// mismos límites que D:/rtmp/apex/apex05/geo/terrain.py
export const MAPS = {
  wd: { L: -170, R: 180, T: 78, B: -58, K: 0.2, GX: 1750, GZ: 680, DISP: 1.0 },
  in: { L: 66, R: 92, T: 32, B: 6, K: 2.5, GX: 780, GZ: 780, DISP: 2.2 },
  jp: { L: 128, R: 146, T: 46, B: 30, K: 3.6, GX: 720, GZ: 640, DISP: 2.2 },
} as const;
export type MK = keyof typeof MAPS;
export const llm = (m: MK, lon: number, lat: number): [number, number] => { const g = MAPS[m]; return [(lon - (g.L + g.R) / 2) * g.K, -(lat - (g.T + g.B) / 2) * g.K]; };

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
const useLandColor = (m: MK) => {
  const [h] = useState(() => delayRender("land"));
  const [tx, setTx] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const im = new Image(), ih = new Image(); let n = 0;
    const go = () => {
      if (++n < 2) return;
      const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const g = c.getContext("2d")!;
      g.drawImage(ih, 0, 0, c.width, c.height); const hd = g.getImageData(0, 0, c.width, c.height).data;
      g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const a = d.data[i] / 255, e = hd[i] / 255;
        // tierra: verde oliva en lo bajo -> ocre -> piedra clara arriba; agua: verde-negro
        const lo = e < 0.45, q = lo ? e / 0.45 : (e - 0.45) / 0.55;
        const lr = lo ? lerp(70, 128, q) : lerp(128, 196, q), lg = lo ? lerp(82, 112, q) : lerp(112, 182, q), lb = lo ? lerp(46, 70, q) : lerp(70, 160, q);
        d.data[i] = lerp(14, lr, a); d.data[i + 1] = lerp(32, lg, a); d.data[i + 2] = lerp(38, lb, a);
      }
      g.putImageData(d, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; setTx(t);
    };
    im.onload = go; ih.onload = go; im.src = staticFile(`apex05/map/${m}_land.png`); ih.src = staticFile(`apex05/map/${m}_h.png`);
    im.onerror = () => continueRender(h);
  }, []);
  useEffect(() => { if (tx) requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h)))); }, [tx]);
  return tx;
};
const useHeights = (m: MK) => {
  const { GX, GZ } = MAPS[m];
  const [h] = useState(() => delayRender("heights"));
  const [hs, setHs] = useState<Float32Array | null>(null);
  useEffect(() => {
    const im = new Image(); im.src = staticFile(`apex05/map/${m}_h.png`);
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
// nubes: ruido fractal en canvas (determinístico), plano semitransparente que deriva sobre el relieve
const useClouds = () => useMemo(() => {
  const w = 1024, h = 512, c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!;
  const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 3.1) * 43758.5453; return x - Math.floor(x); };
  const oct = (sz: number, seed: number) => { const nx = Math.ceil(w / sz) + 1, ny = Math.ceil(h / sz) + 1, v: number[] = []; for (let i = 0; i < nx * ny; i++) v.push(rnd(i + seed));
    return (x: number, y: number) => { const gx = x / sz, gy = y / sz, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const at = (i: number, j: number) => v[(j % ny) * nx + (i % nx)]; return lerp(lerp(at(x0, y0), at(x0 + 1, y0), sx), lerp(at(x0, y0 + 1), at(x0 + 1, y0 + 1), sx), sy); }; };
  const O = [oct(64, 1), oct(32, 700), oct(16, 1900), oct(8, 4100)], d = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = O[0](x, y) * 0.5 + O[1](x, y) * 0.27 + O[2](x, y) * 0.15 + O[3](x, y) * 0.08, a = Math.max(0, Math.min(1, (n - 0.6) / 0.14)), ex = Math.min(1, x / 90, (w - x) / 90, y / 90, (h - y) / 90);
    const i = (y * w + x) * 4; d.data[i] = 245; d.data[i + 1] = 247; d.data[i + 2] = 250; d.data[i + 3] = a * a * 230 * Math.max(0, ex);
  }
  g.putImageData(d, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);
const Clouds: React.FC<{ m: MK; t: number }> = ({ m, t }) => {
  const { L, R, T, B, K, DISP } = MAPS[m], tex = useClouds();
  tex.offset.set(t * 0.012, t * 0.004); tex.repeat.set(1, 1);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, DISP + 1.6, 0]}><planeGeometry args={[(R - L) * K * 1.2, (T - B) * K * 1.2]} />
    <meshBasicMaterial map={tex} transparent opacity={0.5} depthWrite={false} fog={false} /></mesh>;
};
const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(pos); c.lookAt(look); if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  return null;
};
const Relief: React.FC<{ m: MK; hs: Float32Array; col: THREE.Texture }> = ({ m, hs, col }) => {
  const { L, R, T, B, K, GX, GZ, DISP } = MAPS[m];
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
export type CRoute = { at: number; from: [number, number]; to: [number, number]; d?: number };
export type CLine = { at: number; pts: [number, number][]; d?: number; color?: string; w?: number };
// área de la especie: se derrama desde su centro y queda latiendo (polígono lon/lat aproximado, ilustrativo)
export type CRange = { at: number; pts: [number, number][]; color?: string; d?: number };
export const GeoMap: React.FC<{ m: MK; t0: number; keys: CKey[]; pins?: CPin[]; routes?: CRoute[]; lines?: CLine[]; ranges?: CRange[]; dark?: (t: number) => number; orbit?: number }> = ({ m, t0, keys, pins = [], routes = [], lines = [], ranges = [], dark, orbit }) => {
  const ll = (lon: number, lat: number) => llm(m, lon, lat);
  const f = useCurrentFrame(), t = f / FPS - t0;
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1].at) i++;
  const A = keys[i], Bk = keys[Math.min(i + 1, keys.length - 1)];
  const u = ease(k01(t, A.at, Bk.at));
  const cam = useMemo(() => new THREE.PerspectiveCamera(32, W / H, 0.05, 400), []);
  cam.fov = lerp(A.fov ?? 32, Bk.fov ?? 32, u);
  const P = new THREE.Vector3(...(A.pos.map((v, n) => lerp(v, Bk.pos[n], u)) as [number, number, number]));
  const LK = new THREE.Vector3(...(A.look.map((v, n) => lerp(v, Bk.look[n], u)) as [number, number, number]));
  // la cámara nunca queda quieta: órbita lenta alrededor del punto mirado (sentido y velocidad por mapa)
  const orb = (orbit ?? (Math.sin(t0 * 7.3) > 0 ? 1 : -1)) * 0.035 * t, rx = P.x - LK.x, rz = P.z - LK.z;
  P.x = LK.x + rx * Math.cos(orb) - rz * Math.sin(orb); P.z = LK.z + rx * Math.sin(orb) + rz * Math.cos(orb);
  cam.position.copy(P); cam.lookAt(LK);
  cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const dk = dark ? dark(t) : 0;
  const hs = useHeights(m), col = useTex(`apex05/map/${m}_sat.jpg`, true);
  const scr = (lon: number, lat: number, y = 0.3) => { const [x, z] = ll(lon, lat), v = new THREE.Vector3(x, y, z).project(cam); return [(v.x * 0.5 + 0.5) * W, (-v.y * 0.5 + 0.5) * H]; };
  const band = (top: boolean, px: number, h: number, from: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, [top ? "top" : "bottom"]: 0, height: h, backdropFilter: `blur(${px}px)`, WebkitBackdropFilter: `blur(${px}px)`,
      maskImage: `linear-gradient(${top ? "to bottom" : "to top"}, black ${from}%, transparent 100%)`, WebkitMaskImage: `linear-gradient(${top ? "to bottom" : "to top"}, black ${from}%, transparent 100%)` }} />
  );
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {hs && col && <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 32, position: [0, 60, 40], near: 0.05, far: 400 }}>
        <Cam pos={P} look={LK} fov={cam.fov} />
        <color attach="background" args={["#0a1622"]} />
        <fog attach="fog" args={["#1a2c3e", 55, 140]} />
        <hemisphereLight args={["#dfe9f5", "#1d2430", 1.15 * (1 - dk * 0.6)]} />
        <ambientLight color="#ffffff" intensity={0.35 * (1 - dk * 0.6)} />
        <directionalLight position={[-40, 18, 14]} intensity={2.6 * (1 - dk * 0.75)} color="#ffd6a0" castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096}
          shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0004} />
        <Relief m={m} hs={hs} col={col} />
        <Clouds m={m} t={t + t0} />
      </ThreeCanvas>}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {ranges.map((r, n) => {
          const p = easeOut(k01(t, r.at, r.at + (r.d ?? 1.4))); if (p <= 0) return null;
          const P2 = r.pts.map(([lo, la]) => scr(lo, la)), cx = P2.reduce((a, q) => a + q[0], 0) / P2.length, cy = P2.reduce((a, q) => a + q[1], 0) / P2.length;
          const R0 = Math.max(...P2.map((q) => Math.hypot(q[0] - cx, q[1] - cy))) * 1.05, col = r.color ?? "#ffb347", id = `rg${n}`, beat = 0.85 + 0.15 * Math.sin(t * 3.2);
          const nP = P2.length, d = "M" + P2[0][0].toFixed(1) + "," + P2[0][1].toFixed(1) + P2.map((_, j) => {
            const p0 = P2[(j - 1 + nP) % nP], p1 = P2[j], p2 = P2[(j + 1) % nP], p3 = P2[(j + 2) % nP];
            return `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
          }).join("") + "Z";
          return <g key={"r" + n}>
            <defs><mask id={id}><circle cx={cx} cy={cy} r={R0 * p} fill="#fff" /></mask>
              <pattern id={id + "h"} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1={0} y1={0} x2={0} y2={14} stroke={col} strokeWidth={3} strokeOpacity={0.55} /></pattern></defs>
            <g mask={`url(#${id})`}>
              <path d={d} fill={col} fillOpacity={0.3 * beat} stroke="none" />
              <path d={d} fill={`url(#${id}h)`} stroke={col} strokeWidth={4} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} />
            </g>
            {p < 1 && <circle cx={cx} cy={cy} r={R0 * p} fill="none" stroke={col} strokeWidth={3} strokeOpacity={1 - p} />}
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
        {lines.map((r, n) => {
          const p = ease(k01(t, r.at, r.at + (r.d ?? 1.0))); if (p <= 0) return null;
          const M = r.pts.length - 1, fp = M * p, N = Math.floor(fp), pts: string[] = [];
          const push = (lo: number, la: number) => { const [x, z] = ll(lo, la), v = new THREE.Vector3(x, 0.3, z).project(cam); pts.push(`${((v.x * 0.5 + 0.5) * W).toFixed(1)},${((-v.y * 0.5 + 0.5) * H).toFixed(1)}`); };
          for (let i = 0; i <= N; i++) push(...r.pts[i]);
          if (N < M) { const a = r.pts[N], b = r.pts[N + 1], f = fp - N; push(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); }
          return <polyline key={"l" + n} points={pts.join(" ")} fill="none" stroke={r.color ?? "#c8a26a"} strokeWidth={r.w ?? 7} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${r.color ?? "#c8a26a"})` }} />;
        })}
      </svg>
      {pins.map((p, n) => {
        const a = interp(t, [p.at, p.at + 0.3, (p.out ?? 99) - 0.3, p.out ?? 99], [0, 1, 1, 0]); if (a <= 0) return null;
        const [x, z] = ll(p.lon, p.lat), c = new THREE.Vector3(x, 0.6, z).project(cam);
        const sx = (c.x * 0.5 + 0.5) * W, sy = (-c.y * 0.5 + 0.5) * H, g = easeOut(k01(t, p.at, p.at + 0.5)), pulse = 1 + 0.08 * Math.sin(t * 5);
        return <div key={n} style={{ position: "absolute", left: 0, top: 0, opacity: a }}>
          {p.ring !== false && <svg width={W} height={H} style={{ position: "absolute" }}>
            <ellipse cx={sx} cy={sy} rx={70 * g * pulse} ry={38 * g * pulse} fill="none" stroke={RED} strokeWidth={5} style={{ filter: `drop-shadow(0 0 12px ${RED})` }} />
            <ellipse cx={sx} cy={sy} rx={96 * g} ry={52 * g} fill="none" stroke="rgba(255,90,80,.5)" strokeWidth={2} strokeDasharray="10 12" />
            <circle cx={sx} cy={sy} r={7} fill="#fff" />
          </svg>}
          {p.ring === false && <div style={{ position: "absolute", left: sx - 9 * g, top: sy - 9 * g, width: 18 * g, height: 18 * g, borderRadius: 9, background: RED, border: "3px solid #fff", boxShadow: `0 0 16px ${RED}` }} />}
          <div style={{ position: "absolute", left: sx + (p.ring === false ? 22 : 120), top: sy - (p.ring === false ? 22 : 44), color: "#fff", textShadow: shadow, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: COND, fontWeight: 700, fontSize: p.ring === false ? 34 : 52, letterSpacing: p.ring === false ? 4 : 6 }}>{p.label.slice(0, Math.ceil(p.label.length * k01(t, p.at, p.at + 0.45)))}</div>
            {p.sub && <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 28, opacity: k01(t, p.at + 0.3, p.at + 0.6) }}>{p.sub}</div>}
          </div>
        </div>;
      })}
      {band(true, 5, 380, 20)}{band(true, 12, 220, 30)}{band(false, 5, 380, 20)}{band(false, 12, 220, 30)}
      {dk > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(6,8,8,${dk * 0.55})` }} />}
    </div>
  );
};
