// GlobeDive3D — picada tipo Google Earth: la Tierra entera (NASA Blue Marble) → el Golfo → la costa de Luisiana
// → la parroquia. Sobre el globo va un PARCHE en alta resolución de la costa (la misma imagen MODIS del mapa),
// así la picada sigue nítida hasta el final sin fundido. Atmósfera (fresnel), estrellas, pin + rótulo al llegar.
import React, { useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { SANS, MONO, HK, clamp, ease, easeInOut, lerp, rnd } from "../theme";

const D2R = Math.PI / 180;
// misma parametrización que SphereGeometry: u = (lon+180)/360 → phi
const onSphere = (lat: number, lon: number, r = 1) => {
  const phi = (lon + 180) * D2R, th = (90 - lat) * D2R;
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(th), r * Math.cos(th), r * Math.sin(phi) * Math.sin(th));
};
// bbox de la imagen de la costa (yc/hank/color_graded.jpg)
const BB = { lon0: -94.1, lon1: -88.75, lat0: 28.85, lat1: 31.1 };

const useTexs = (srcs: string[]) => {
  const [h] = useState(() => delayRender("globe tex"));
  const [n, setN] = useState(0);
  const texs = useMemo(() => {
    let k = 0;
    return srcs.map((s) => {
      const t = new THREE.TextureLoader().load(staticFile(s), () => { k++; setN(k); if (k === srcs.length) continueRender(h); }, undefined, () => { k++; if (k === srcs.length) continueRender(h); });
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcs.join("|"), h]);
  return { texs, ready: n >= srcs.length };
};

const ATMO_V = `varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vec4 p = modelViewMatrix*vec4(position,1.0); vP = p.xyz; gl_Position = projectionMatrix*p; }`;
const ATMO_F = `varying vec3 vN; varying vec3 vP; uniform float uI; void main(){ float f = pow(1.0 - abs(dot(normalize(-vP), vN)), 2.6); gl_FragColor = vec4(vec3(0.35,0.62,1.0)*f*uI, f*uI); }`;
// parche con borde difuminado (no se ve la costura con el Blue Marble)
const PATCH_F = `uniform sampler2D map; uniform float uA; varying vec2 vUv; void main(){ vec4 c = texture2D(map, vUv);
  float e = smoothstep(0.0,0.22,vUv.x)*smoothstep(0.0,0.22,1.0-vUv.x)*smoothstep(0.0,0.3,vUv.y)*smoothstep(0.0,0.25,1.0-vUv.y);
  gl_FragColor = vec4(c.rgb, e * uA);
  #include <colorspace_fragment>
}`;
const PATCH_V = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;

export const GlobeDive3D: React.FC<{
  lat: number; lon: number; label: string; sub?: string; from?: { lat: number; lon: number }; endDist?: number; hires?: boolean; kicker?: string;
}> = ({ lat, lon, label, sub, from = { lat: 18, lon: -45 }, endDist = 1.045, hires = true, kicker }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const { texs, ready } = useTexs(hires ? ["yc/hank/earth_5400.jpg", "yc/hank/color_graded.jpg"] : ["yc/hank/earth_5400.jpg"]);
  const t = clamp(f / Math.max(1, D - 1));

  // picada: distancia exponencial (se siente como caída libre que frena), dirección llega antes que la distancia
  const td = easeInOut(clamp(t / 0.82));
  const dist = Math.exp(lerp(Math.log(4.8), Math.log(endDist), Math.pow(td, 1.15)));
  const ta = ease(clamp(t / 0.62));
  const cLat = lerp(from.lat, lat - 0.9 * clamp((t - 0.45) / 0.5), ta), cLon = lerp(from.lon, lon, ta);
  const camPos = onSphere(cLat, cLon, dist);
  const look = onSphere(lat, lon, 1).multiplyScalar(lerp(0, 1, clamp((t - 0.35) / 0.5)));
  const drift = Math.sin(f / 50) * 0.002;
  camPos.x += drift;

  const stars = useMemo(() => {
    const g = new THREE.BufferGeometry(); const n = 1400; const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const v = new THREE.Vector3(rnd(i) - 0.5, rnd(i + 99) - 0.5, rnd(i + 377) - 0.5).normalize().multiplyScalar(60); p.set([v.x, v.y, v.z], i * 3); }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3)); return g;
  }, []);

  // pin + rótulo: proyección de la posición a pantalla
  const cam = useMemo(() => new THREE.PerspectiveCamera(35, width / height, 0.001, 200), [width, height]);
  cam.position.copy(camPos); cam.up.set(0, 1, 0); cam.lookAt(look); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const pin = onSphere(lat, lon, 1.0015).project(cam);
  const pinOn = ease(clamp((t - 0.8) / 0.08));
  const px = (pin.x * 0.5 + 0.5) * width, py = (-pin.y * 0.5 + 0.5) * height;

  const patch = useMemo(() => hires ? new THREE.SphereGeometry(1.0008, 96, 48, (BB.lon0 + 180) * D2R, (BB.lon1 - BB.lon0) * D2R, (90 - BB.lat1) * D2R, (BB.lat1 - BB.lat0) * D2R) : null, [hires]);
  // velo del parche: aparece cuando ya estamos cerca (lejos el Blue Marble alcanza)
  const patchA = clamp((1.45 - dist) / 0.3);
  // material creado a mano: r3f no aplicaba `transparent` al shaderMaterial declarativo (el parche salía opaco)
  // material nuevo en cada cuadro (mismo shader → programa reutilizado): r3f no propaga mutaciones de uniformes
  const patchMat = texs[1] ? new THREE.ShaderMaterial({ vertexShader: PATCH_V, fragmentShader: PATCH_F, uniforms: { map: { value: texs[1] }, uA: { value: patchA } }, transparent: true, depthWrite: false, blending: THREE.NormalBlending }) : null;

  return (
    <AbsoluteFill style={{ background: "#01040A" }}>
      {ready ? (
        <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 35, near: 0.001, far: 200, position: [0, 0, 5] }}>
          <CamRig pos={camPos} look={look} />
          <points geometry={stars}><pointsMaterial color="#cfd8ff" size={0.12} sizeAttenuation transparent opacity={0.8 * clamp((dist - 1.6) / 1.5)} /></points>
          <ambientLight intensity={0.35} />
          <directionalLight position={[-3, 2.5, 4]} intensity={2.4} color="#fff4e2" />
          <mesh><sphereGeometry args={[1, 160, 120]} /><meshStandardMaterial map={texs[0]} roughness={0.95} metalness={0} /></mesh>
          {patch && texs[1] ? (
            <mesh geometry={patch} material={patchMat!} renderOrder={2} />
          ) : null}
          <mesh scale={1.035}><sphereGeometry args={[1, 96, 64]} /><shaderMaterial key={f} vertexShader={ATMO_V} fragmentShader={ATMO_F} uniforms={{ uI: { value: clamp((dist - 1.05) / 0.8) * 1.2 } }} transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
        </ThreeCanvas>
      ) : null}
      {/* grano + viñeta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      {kicker ? <div style={{ position: "absolute", left: 80, top: 64, fontFamily: SANS, fontSize: 30, letterSpacing: 10, color: HK.bone, opacity: ease(f / 14) * (1 - clamp((t - 0.55) / 0.1)) }}>{kicker}</div> : null}
      {/* coordenadas que corren como un instrumento */}
      <div style={{ position: "absolute", right: 80, top: 64, fontFamily: MONO, fontSize: 24, color: HK.bone, opacity: 0.8 * ease(f / 14), textAlign: "right" }}>
        {`${Math.abs(cLat).toFixed(3)}° ${cLat >= 0 ? "N" : "S"}  ${Math.abs(cLon).toFixed(3)}° ${cLon >= 0 ? "E" : "W"}`}<br />
        {`ALT ${Math.round((dist - 1) * 6371).toLocaleString("en-US")} KM`}
      </div>
      {pinOn > 0 ? (
        <div style={{ position: "absolute", left: px, top: py, transform: "translate(-50%, -100%)", opacity: pinOn }}>
          <div style={{ position: "absolute", left: "50%", bottom: 0, width: 26, height: 26, marginLeft: -13, marginBottom: -13, borderRadius: 13, border: `3px solid ${HK.orange}`, transform: `scale(${1 + 0.6 * ((f / 20) % 1)})`, opacity: 1 - ((f / 20) % 1) }} />
          <div style={{ position: "absolute", left: "50%", bottom: 0, width: 12, height: 12, marginLeft: -6, marginBottom: -6, borderRadius: 6, background: HK.orange, boxShadow: `0 0 18px ${HK.orange}` }} />
          <div style={{ position: "absolute", left: "50%", bottom: 10, width: 3, height: 90 * pinOn, marginLeft: -1.5, background: HK.orange }} />
          <div style={{ position: "absolute", left: 24, bottom: 70, whiteSpace: "nowrap", transform: `translateY(${(1 - pinOn) * 20}px)` }}>
            <div style={{ fontFamily: SANS, fontSize: 44, letterSpacing: 8, color: HK.bone, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{label}</div>
            {sub ? <div style={{ fontFamily: MONO, fontSize: 24, color: HK.orange, marginTop: 4, textShadow: "0 3px 12px rgba(0,0,0,0.9)" }}>{sub}</div> : null}
          </div>
        </div>
      ) : null}
      <AbsoluteFill style={{ opacity: 1 - clamp((f - (D - 10)) / 10) === 1 ? 0 : clamp((f - (D - 10)) / 10), background: "#000" }} />
    </AbsoluteFill>
  );
};

// la cámara del ThreeCanvas se mueve desde adentro (useThree)
import { useThree } from "@react-three/fiber";
const CamRig: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3 }> = ({ pos, look }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.up.set(0, 1, 0); camera.lookAt(look);
  (camera as THREE.PerspectiveCamera).near = 0.001; (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  return null;
};
