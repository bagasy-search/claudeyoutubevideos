// Globe3D — la Tierra en 3D real (three.js) con Blue Marble (día) y Black Marble (luces de noche, NASA, dominio público).
// La línea del atardecer (terminador) barre Europa; las luces de HOY se apagan y quedan unas pocas brasas: los fuegos
// de campamento de hace ~40.000 años (ILUSTRACIÓN, no mapa de sitios). La cámara baja hasta el valle del capítulo.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AH, BIG, MONO, SANS, TSH, clamp, ease, easeInOut, lerp, rnd } from "./theme";

const P = (lat: number, lon: number, r = 1) => {
  const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180;
  return new THREE.Vector3(r * Math.cos(la) * Math.cos(lo), r * Math.sin(la), -r * Math.cos(la) * Math.sin(lo));
};
// sitios auriñacienses/paleolíticos conocidos (sólo para ubicar brasas ilustrativas)
const SITES: [number, number][] = [[44.39, 4.42], [44.9, 1.0], [48.37, 9.75], [43.38, -4.12], [48.32, 15.4], [51.4, 39.0], [43.0, 25.4], [44.4, 4.8], [43.36, -1.2], [48.55, 10.2], [45.0, 21.8], [44.2, 40.0], [47.1, 2.3], [49.9, 17.1], [41.6, 2.2], [42.1, 12.9], [46.3, 30.5], [50.1, 19.8]];

const useTex = (src: string) => {
  const [t, setT] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const h = delayRender("tex " + src);
    new THREE.TextureLoader().load(staticFile(src), (tx) => { tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; setT(tx); continueRender(h); }, undefined, () => continueRender(h));
  }, [src]);
  return t;
};
// el lienzo 3D se monta recién con las dos texturas; el cuadro se libera después de 3 dibujos (si no, sale negro)
const useSettle = (ready: boolean) => {
  const [h] = useState(() => delayRender("globe settle"));
  useEffect(() => {
    if (!ready) return;
    let n = 0, id = 0;
    const step = () => { if (++n >= 3) continueRender(h); else id = requestAnimationFrame(step); };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [ready, h]);
};

const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3 }> = ({ pos, look }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.up.set(0, 1, 0); camera.lookAt(look);
  return null;
};

const VS = `varying vec2 vUv; varying vec3 vN; void main(){ vUv = uv; vN = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const FS = `uniform sampler2D day; uniform sampler2D night; uniform vec3 sun; uniform float lights; uniform sampler2D ice; uniform float iceAmt; varying vec2 vUv; varying vec3 vN;
void main(){
  float d = dot(normalize(vN), normalize(sun));
  float k = smoothstep(-0.08, 0.12, d);
  vec3 dc = texture2D(day, vUv).rgb;
  vec3 nc = texture2D(night, vUv).rgb;
  vec3 moon = dc * vec3(0.62, 0.72, 0.95);
  vec3 nightCol = moon + nc * lights * 1.25;
  vec3 dusk = vec3(1.0, 0.45, 0.15) * max(0.0, 1.0 - abs(d + 0.02) * 40.0) * 0.09;
  vec3 col = mix(nightCol, dc, k) + max(dusk, 0.0);
  float ia = texture2D(ice, vUv).a * iceAmt;
  vec3 iceCol = mix(vec3(0.55, 0.66, 0.82), vec3(0.95, 0.97, 1.0), k);
  gl_FragColor = vec4(mix(col, iceCol, ia * 0.85), 1.0);
}`;

const ICE: [number, number][][] = [
  [[4, 60], [6, 62.5], [10, 65], [13, 68], [17, 70], [24, 71], [30, 70.5], [33, 68], [32, 65], [30, 62.5], [27, 61], [23, 60.3], [19, 59.2], [14, 58.4], [9, 58.6]],
  [[-7.5, 56], [-6, 58.6], [-3.5, 58.7], [-2.2, 57.2], [-3.2, 55.6], [-5.5, 55.2]],
  [[5.8, 45.6], [7.5, 46.9], [10, 47.4], [13.5, 47.3], [15.8, 46.8], [14, 46], [11, 45.9], [8, 45.3]],
];
const useIceTex = () => useMemo(() => {
  const c = document.createElement("canvas"); c.width = 2048; c.height = 1024; const g = c.getContext("2d")!;
  g.filter = "blur(10px)"; g.fillStyle = "#fff";
  for (const poly of ICE) { g.beginPath(); poly.forEach(([lo, la], i) => { const x = (lo + 180) / 360 * 2048, y = (90 - la) / 180 * 1024; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.fill(); }
  const t = new THREE.CanvasTexture(c); return t;
}, []);

export const Globe3D: React.FC<{ from?: [number, number, number]; to?: [number, number, number]; label0?: string; label1?: string; pin?: string; pinAt?: [number, number]; sub?: string }> =
  ({ from = [28, 12, 3.4], to = [44.4, 4.4, 1.55], label0 = "EUROPE · TONIGHT", label1 = "EUROPE · 38,000 BC", pin = "THE ARDÈCHE VALLEY", pinAt = [44.39, 4.42], sub }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const t = clamp(f / (D - 1));
  const day = useTex("ah/geo/bm4k.jpg");
  const night = useTex("ah/geo/night4k.jpg");
  useSettle(!!(day && night));
  const iceTex = useIceTex();
  const tc = easeInOut(clamp((t - 0.05) / 0.85));
  const la = lerp(from[0], to[0], tc), lo = lerp(from[1], to[1], tc), dist = lerp(from[2], to[2], tc);
  const camPos = P(la, lo, dist);
  const look = P(lerp(la, to[0], 0.5) * 0.2, lo, 0).multiplyScalar(0);
  // sol: el terminador barre de este a oeste sobre Europa
  const sunLon = lerp(-40, -95, easeInOut(clamp(t / 0.7)));
  const sun = P(4, sunLon, 1);
  const lights = 1 - easeInOut(clamp((t - 0.38) / 0.2)); // las luces de hoy se apagan
  const ember = easeInOut(clamp((t - 0.55) / 0.15));
  const mat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: { day: { value: null }, night: { value: null }, sun: { value: new THREE.Vector3() }, lights: { value: 1 }, ice: { value: null }, iceAmt: { value: 0 } } }), []);
  if (day && mat.uniforms.day.value !== day) { mat.uniforms.day.value = day; mat.needsUpdate = true; }
  if (night && mat.uniforms.night.value !== night) { mat.uniforms.night.value = night; mat.needsUpdate = true; }
  mat.uniforms.sun.value.copy(sun);
  mat.uniforms.lights.value = lights;
  mat.uniforms.ice.value = iceTex;
  mat.uniforms.iceAmt.value = easeInOut(clamp((t - 0.45) / 0.18));
  const embers = useMemo(() => {
    const out: [number, number, number][] = [];
    SITES.forEach(([a, b], i) => { for (let k = 0; k < 2; k++) out.push([a + (rnd(i * 7 + k) - 0.5) * 2.2, b + (rnd(i * 11 + k + 3) - 0.5) * 3, rnd(i + k * 5)]); });
    return out;
  }, []);
  const pinP = P(pinAt[0], pinAt[1], 1.003);
  // proyección del pin a pantalla (para el rótulo HTML)
  const cam = new THREE.PerspectiveCamera(35, width / height, 0.01, 100);
  cam.position.copy(camPos); cam.up.set(0, 1, 0); cam.lookAt(look); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const sp = pinP.clone().project(cam);
  const px = (sp.x * 0.5 + 0.5) * width, py = (-sp.y * 0.5 + 0.5) * height;
  const pinK = ease(clamp((t - 0.8) / 0.1));
  const lab = t < 0.47 ? label0 : label1;
  const labK = t < 0.47 ? ease(clamp((t - 0.03) / 0.06)) * (1 - ease(clamp((t - 0.41) / 0.06))) : ease(clamp((t - 0.5) / 0.06));
  return (
    <AbsoluteFill style={{ background: "#020308" }}>
      {Array.from({ length: 140 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * width, top: rnd(i + 99) * height, width: 1.5 + rnd(i + 5) * 2, height: 1.5 + rnd(i + 5) * 2, borderRadius: 3, background: "#fff", opacity: 0.25 + 0.5 * rnd(i + 7) }} />)}
      {day && night ? <ThreeCanvas width={width} height={height} camera={{ fov: 35, near: 0.01, far: 100 }}>
        <Cam pos={camPos} look={look} />
        <mesh material={mat}><sphereGeometry args={[1, 160, 120]} /></mesh>
      </ThreeCanvas> : null}
      {ember > 0 ? embers.map(([a, b, r], i) => {
        const q = P(a, b, 1.002).project(cam); const x = (q.x * 0.5 + 0.5) * width, y = (-q.y * 0.5 + 0.5) * height;
        const facing = P(a, b, 1).dot(camPos.clone().normalize()) > 0.2;
        if (!facing) return null;
        return <div key={i} style={{ position: "absolute", left: x - 11, top: y - 11, width: 22, height: 22, borderRadius: 11, background: "radial-gradient(circle, rgba(255,200,120,0.95), rgba(255,138,42,0.35) 40%, rgba(255,138,42,0) 70%)", opacity: ember * (0.6 + 0.4 * Math.sin(f / (3 + r * 4) + i)) }} />;
      }) : null}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 12, color: t < 0.47 ? AH.moon : AH.flame, textShadow: TSH, opacity: labK }}>{lab}</div>
      {pinK > 0 ? <div style={{ position: "absolute", left: px, top: py, opacity: pinK }}>
        <div style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: 22, border: `3px solid ${AH.flame}`, transform: `scale(${1 + 0.25 * Math.sin(f / 5)})` }} />
        <div style={{ position: "absolute", left: 34, top: -58, whiteSpace: "nowrap", background: "rgba(12,9,6,0.8)", borderLeft: `5px solid ${AH.ember}`, padding: "8px 18px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 4, color: AH.bone }}>{pin}</div>
          {sub ? <div style={{ fontFamily: MONO, fontSize: 22, color: AH.amber }}>{sub}</div> : null}
        </div>
      </div> : null}
      {ember > 0 ? <div style={{ position: "absolute", left: 60, bottom: 40, fontFamily: MONO, fontSize: 18, color: AH.boneDim, opacity: ember * 0.8 }}>ICE AND CAMPFIRES: ILLUSTRATION</div> : null}
      {void BIG}
    </AbsoluteFill>
  );
};
