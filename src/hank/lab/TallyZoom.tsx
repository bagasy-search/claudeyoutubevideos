// TallyZoom — "potencias de diez" de un número enorme: arranca en UN punto (una cola = $6) y la cámara se
// aleja exponencialmente hasta que los puntos son una textura: millones. Grilla procedural en shader (escala
// infinita, sin instancias). El contador sube con la escala y termina en el número exacto (prop `total`).
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { SANS, SERIF, MONO, HK, clamp, ease, easeInOut } from "../theme";

const FRAG = /* glsl */ `
uniform vec2 uRes; uniform float uCell; uniform float uGlow; uniform vec3 uCol; uniform vec3 uHot;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
void main(){
  vec2 px = (vUv - 0.5) * uRes;                 // píxeles desde el centro
  vec2 g = px / uCell + 0.5;                     // celda 0 centrada
  vec2 id = floor(g), f = fract(g) - 0.5;
  float r = 0.28;
  float aa = 1.2 / uCell;                        // antialias en unidades de celda
  float d = length(f);
  float dotM = 1.0 - smoothstep(r - aa, r + aa, d);
  // cuando la celda es menor a ~3 px el punto se vuelve textura: promedio de cobertura
  float cov = 3.14159 * r * r;
  float m = mix(cov, dotM, smoothstep(2.0, 6.0, uCell));
  float flick = 0.75 + 0.25 * hash(id);
  vec3 col = uCol * flick;
  bool center = (id.x == 0.0 && id.y == 0.0);
  if (center) col = uHot;
  float glow = uGlow * exp(-length(px) / (uCell * 0.9));
  vec3 bg = vec3(0.035, 0.05, 0.045) + 0.04 * vec3(1.0 - length(vUv - 0.5));
  gl_FragColor = vec4(bg + col * m + uHot * glow, 1.0);
}`;
const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export const TallyZoom: React.FC<{ total: number; unitLabel?: string; perUnit?: string; finalLabel?: string; money?: string }> = ({
  total, unitLabel = "ONE TAIL", perUnit = "= $6", finalLabel = "TAILS PAID SINCE 2002", money,
}) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const t = clamp(f / Math.max(1, D - 1));
  // fase 1 (0-18 %): un punto grande, respira; fase 2 (18-82 %): alejamiento exponencial; fase 3: se queda
  const z = easeInOut(clamp((t - 0.18) / 0.64));
  // 1 punto = 1 cola hasta ~0,5; después se reagrupa a 1 punto = `group` colas (si no, los puntos quedan bajo el píxel)
  const group = 100, zs = 0.55;
  const cellA = 520, cellMid = Math.sqrt((width * height) / 20000), cellEnd = Math.sqrt((width * height) / (total / group));
  const cell = z < zs ? Math.exp(Math.log(cellA) + (Math.log(cellMid) - Math.log(cellA)) * (z / zs))
    : Math.exp(Math.log(cellMid * Math.sqrt(group)) + (Math.log(cellEnd) - Math.log(cellMid * Math.sqrt(group))) * ((z - zs) / (1 - zs)));
  const perDot = z < zs ? 1 : group;
  const count = Math.round((width / cell) * (height / cell)) * perDot;
  const shown = z >= 0.999 ? total : Math.max(1, Math.min(total, count));
  const flash = z >= zs ? 1 - clamp((z - zs) / 0.04) : 0;
  // uniformes NUEVOS en cada cuadro + key={f}: r3f no propagaba la mutación en render continuo (quedaba el cuadro 0).
  // Recrear el material es barato: three reutiliza el programa compilado (mismo código de shader).
  const uniforms = { uRes: { value: new THREE.Vector2(width, height) }, uCell: { value: cell }, uGlow: { value: 1 - z }, uCol: { value: new THREE.Color("#E9DCC0") }, uHot: { value: new THREE.Color(HK.orange) } };

  return (
    <AbsoluteFill style={{ background: "#060908" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: false, preserveDrawingBuffer: true }} camera={{ position: [0, 0, 1] }}>
        <mesh frustumCulled={false}><planeGeometry args={[2, 2]} /><shaderMaterial key={f} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} depthTest={false} /></mesh>
      </ThreeCanvas>
      {/* escala de la grilla */}
      <div style={{ position: "absolute", right: 70, top: 60, fontFamily: MONO, fontSize: 30, color: perDot > 1 ? HK.orange : HK.bone, background: "rgba(6,9,8,0.75)", padding: "8px 18px", opacity: ease(clamp((t - 0.2) / 0.05)), transform: `scale(${1 + 0.25 * flash})`, transformOrigin: "right top" }}>{perDot > 1 ? `1 DOT = ${group} TAILS` : "1 DOT = 1 TAIL"}</div>
      <AbsoluteFill style={{ background: HK.bone, opacity: 0.25 * flash, pointerEvents: "none" }} />
      {/* el reagrupamiento se ANUNCIA (si no, parece que la cámara volvió para atrás) */}
      {z >= zs && z < zs + 0.22 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ textAlign: "center", opacity: ease(clamp((z - zs) / 0.03)) * (1 - clamp((z - zs - 0.15) / 0.07)), transform: `scale(${1.25 - 0.25 * ease(clamp((z - zs) / 0.05))})`, background: "rgba(6,9,8,0.82)", padding: "18px 50px", border: `3px solid ${HK.orange}` }}>
            <div style={{ fontFamily: SERIF, fontSize: 130, color: HK.orange, lineHeight: 1 }}>×{group}</div>
            <div style={{ fontFamily: SANS, fontSize: 40, letterSpacing: 10, color: HK.bone, marginTop: 6 }}>1 DOT = {group} TAILS</div>
          </div>
        </AbsoluteFill>
      ) : null}
      {/* rótulo del primer punto */}
      <div style={{ position: "absolute", left: width / 2 + 170, top: height / 2 - 60, opacity: ease(f / 12) * (1 - clamp(z * 6)), fontFamily: SANS, color: HK.bone }}>
        <div style={{ fontSize: 46, letterSpacing: 10 }}>{unitLabel}</div>
        <div style={{ fontFamily: SERIF, fontSize: 90, color: HK.orange, lineHeight: 1 }}>{perUnit}</div>
      </div>
      {/* contador */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", opacity: ease(clamp((t - 0.16) / 0.06)) }}>
        <div style={{ display: "inline-block", padding: "18px 44px", background: "rgba(6,9,8,0.78)", borderTop: `3px solid ${HK.orange}` }}>
          <div style={{ fontFamily: SERIF, fontSize: 150, color: HK.bone, lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: `scale(${z >= 0.999 ? 1 + 0.06 * (1 - ease(clamp((t - 0.82) / 0.05))) : 1})` }}>{shown.toLocaleString("en-US")}</div>
          <div style={{ fontFamily: SANS, fontSize: 34, letterSpacing: 10, color: HK.bone, opacity: 0.9, marginTop: 6 }}>{finalLabel}</div>
          {money ? <div style={{ fontFamily: MONO, fontSize: 40, color: HK.orange, marginTop: 8, opacity: ease(clamp((t - 0.84) / 0.06)) }}>{money}</div> : null}
        </div>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: clamp((f - (D - 10)) / 10) }} />
    </AbsoluteFill>
  );
};
