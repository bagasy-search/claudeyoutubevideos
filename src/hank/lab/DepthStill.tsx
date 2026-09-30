// DepthStill — foto con parallax 2.5D real: un shader desplaza cada píxel según su profundidad (mapa de
// Depth Anything, `<foto>_depth.png`, 1 = cerca). La "cámara" hace dolly / travelling / grúa y el frente se
// mueve más que el fondo, como un plano filmado. Reemplaza al Ken-Burns plano en las fotos del video.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { easeInOut } from "../theme";

export type DepthMove = "dolly" | "pullback" | "truckL" | "truckR" | "craneUp" | "craneDown" | "orbitL" | "orbitR";

const tex = (src: string, onDone: () => void) => {
  const t = new THREE.TextureLoader().load(staticFile(src), () => onDone(), undefined, () => onDone());
  t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
};

const FRAG = /* glsl */ `
uniform sampler2D tColor; uniform sampler2D tDepth;
uniform vec2 uOff; uniform float uZoom; uniform float uScale; uniform float uFocus; uniform vec2 uCover;
varying vec2 vUv;
void main() {
  vec2 c = vec2(0.5);
  vec2 uv0 = c + (vUv - c) * uCover / uScale;          // cover + zoom base
  // parallax occlusion: se recorre el rayo desde el plano más cercano hacia el fondo y se toma la PRIMERA
  // superficie que lo corta → el frente tapa al fondo (sin fantasmas duplicados en los bordes)
  const int N = 28;
  float hPrev = 1.0 - uFocus, dPrev = texture2D(tDepth, c + (uv0 - c) / (1.0 + uZoom * hPrev) + uOff * hPrev).r - uFocus;
  vec2 uv = uv0; float hHit = -uFocus;
  for (int i = 1; i <= N; i++) {
    float h = (1.0 - uFocus) - float(i) / float(N);
    vec2 u = c + (uv0 - c) / (1.0 + uZoom * h) + uOff * h;
    float d = texture2D(tDepth, u).r - uFocus;
    if (d >= h) {                                    // cruce entre hPrev y h: interpolación lineal
      float a = (dPrev - hPrev) / ((dPrev - hPrev) - (d - h));
      hHit = mix(hPrev, h, clamp(a, 0.0, 1.0));
      break;
    }
    hPrev = h; dPrev = d;
  }
  uv = c + (uv0 - c) / (1.0 + uZoom * hHit) + uOff * hHit;
  uv = clamp(uv, vec2(0.002), vec2(0.998));
  gl_FragColor = texture2D(tColor, uv);
  #include <colorspace_fragment>
}`;
const VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export const DepthStill: React.FC<{ src: string; depth?: string; move?: DepthMove; amount?: number; imgAspect?: number }> = ({
  src, depth, move = "dolly", amount = 0.8, imgAspect = 1088 / 608,
}) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const dsrc = depth ?? src.replace(/\.(jpe?g|png|webp)$/i, "_depth.png");
  const [h] = useState(() => delayRender("depth " + src));
  const [ready, setReady] = useState(0);
  const [color, dmap] = useMemo(() => {
    let n = 0; const done = () => { n++; if (n === 2) { setReady(1); continueRender(h); } };
    const c = tex(src, done); c.colorSpace = THREE.SRGBColorSpace;
    return [c, tex(dsrc, done)];
  }, [src, dsrc, h]);
  useEffect(() => () => { color.dispose(); dmap.dispose(); }, [color, dmap]);

  // cover: la foto llena el cuadro sin deformarse
  const scr = width / height;
  const cover = imgAspect > scr ? new THREE.Vector2(scr / imgAspect, 1) : new THREE.Vector2(1, imgAspect / scr);
  const t = easeInOut(f / Math.max(1, durationInFrames - 1));
  const A = amount;
  let off = [0, 0], zoom = 0, scale = 1.06;
  switch (move) {
    case "dolly": zoom = 0.22 * t * A; scale = 1.06 + 0.06 * t * A; break;
    case "pullback": zoom = 0.22 * (1 - t) * A; scale = 1.12 - 0.06 * t * A; break;
    case "truckL": off = [(0.035 - 0.07 * t) * A, 0]; scale = 1.1; break;
    case "truckR": off = [(-0.035 + 0.07 * t) * A, 0]; scale = 1.1; break;
    case "craneUp": off = [0, (-0.03 + 0.06 * t) * A]; scale = 1.1; zoom = 0.05 * t * A; break;
    case "craneDown": off = [0, (0.03 - 0.06 * t) * A]; scale = 1.1; break;
    case "orbitL": off = [(0.03 - 0.06 * t) * A, 0.008 * A]; zoom = 0.1 * t * A; scale = 1.1; break;
    case "orbitR": off = [(-0.03 + 0.06 * t) * A, 0.008 * A]; zoom = 0.1 * t * A; scale = 1.1; break;
  }
  const uniforms = useMemo(() => ({
    tColor: { value: color }, tDepth: { value: dmap }, uOff: { value: new THREE.Vector2() }, uZoom: { value: 0 },
    uScale: { value: 1 }, uFocus: { value: 0.35 }, uCover: { value: new THREE.Vector2(1, 1) },
  }), [color, dmap]);
  uniforms.uOff.value.set(off[0], off[1]); uniforms.uZoom.value = zoom; uniforms.uScale.value = scale; uniforms.uCover.value.copy(cover);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {ready ? (
        <ThreeCanvas width={width} height={height} gl={{ antialias: false, preserveDrawingBuffer: true }} camera={{ position: [0, 0, 1] }}>
          <mesh frustumCulled={false}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial key={f} uniforms={{ ...uniforms, uOff: { value: uniforms.uOff.value.clone() }, uCover: { value: uniforms.uCover.value.clone() }, uZoom: { value: zoom }, uScale: { value: scale } }} vertexShader={VERT} fragmentShader={FRAG} depthTest={false} />
          </mesh>
        </ThreeCanvas>
      ) : null}
    </AbsoluteFill>
  );
};
