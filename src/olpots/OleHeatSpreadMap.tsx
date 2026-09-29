// OleHeatSpreadMap — mapa 3D real de cómo la base de una olla reparte el calor de la llama.
// Cada olla = un disco (el fondo visto desde arriba, inclinado) cuyo color por vértice es la temperatura calculada en cada cuadro:
// un punto caliente sobre la llama que se ensancha con el tiempo según lo bien que la base conduce (spread) y cuánto pica (peak).
// Debajo, el corte de la base con sus capas (props). Sin useFrame: todo función del cuadro. Textos por props.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { OLE, LABEL, HAND, SERIF, hexA } from "./OleTheme";
import { CamRig, clamp01, easeOut, smooth, projectTo } from "./OleDutchOven3D";

export type BaseLayer = { name: string; color: string; thick: number };
export type HeatPot = {
  label: string; sub?: string;
  layers: BaseLayer[];
  /** ancho final del calor (0.2 punto chico … 1.6 parejo) */
  spread: number;
  /** cuánto sube el punto caliente sobre el resto (0…1) */
  peak: number;
  /** segundos que tarda en ensancharse */
  slow?: number;
  /** "ok" | "bad" para la marca de color del rótulo */
  verdict?: "ok" | "bad";
  note?: string;
};
export type OleHeatSpreadMapProps = { pots: HeatPot[]; at?: number; kicker?: string; footer?: string; tilt?: number };

const ramp = (v: number): [number, number, number] => {
  const st: [number, [number, number, number]][] = [[0, [0.16, 0.22, 0.32]], [0.28, [0.2, 0.42, 0.62]], [0.5, [0.95, 0.85, 0.35]], [0.75, [0.95, 0.5, 0.15]], [1, [0.82, 0.12, 0.08]]];
  v = clamp01(v);
  for (let i = 1; i < st.length; i++) if (v <= st[i][0]) { const [a, ca] = st[i - 1], [b, cb] = st[i]; const u = (v - a) / (b - a); return [ca[0] + (cb[0] - ca[0]) * u, ca[1] + (cb[1] - ca[1]) * u, ca[2] + (cb[2] - ca[2]) * u]; }
  return st[st.length - 1][1];
};

export const tempAt = (r: number, t: number, p: HeatPot) => {
  const grow = smooth(t / (p.slow ?? 3.2));
  const sigma = 0.16 + (p.spread - 0.16) * grow;
  const heat = smooth(t / 1.4); // la olla se calienta
  const hot = Math.exp(-(r * r) / (2 * sigma * sigma));
  const sn = Math.min(1, p.spread / 1.3) * (1 - p.peak * 0.3);
  const edge = 0.3 + 0.34 * sn * grow;         // el borde sube sólo si la base reparte
  const centre = 1.0 - 0.36 * sn * grow;       // el centro baja a medida que reparte
  return clamp01((edge + (centre - edge) * hot) * heat + 0.1);
};

const Disc: React.FC<{ p: HeatPot; t: number; x: number }> = ({ p, t, x }) => {
  const geo = useMemo(() => {
    const g = new THREE.CircleGeometry(1, 96, 0, Math.PI * 2);
    // anillos: subdividir con un disco radial de 24 anillos
    const rings = 26, seg = 72; const pos: number[] = [], idx: number[] = [];
    pos.push(0, 0, 0);
    for (let r = 1; r <= rings; r++) for (let s = 0; s < seg; s++) { const a = (s / seg) * Math.PI * 2, rr = r / rings; pos.push(Math.cos(a) * rr, Math.sin(a) * rr, 0); }
    for (let s = 0; s < seg; s++) idx.push(0, 1 + s, 1 + ((s + 1) % seg));
    for (let r = 1; r < rings; r++) for (let s = 0; s < seg; s++) { const a = 1 + (r - 1) * seg + s, b = 1 + (r - 1) * seg + ((s + 1) % seg), c = 1 + r * seg + s, d = 1 + r * seg + ((s + 1) % seg); idx.push(a, c, b, b, c, d); }
    const gg = new THREE.BufferGeometry(); gg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); gg.setIndex(idx);
    gg.setAttribute("color", new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 3).fill(0), 3)); g.dispose();
    return gg;
  }, []);
  const col = geo.getAttribute("color") as any; const posA = geo.getAttribute("position") as any;
  for (let i = 0; i < col.count; i++) { const r = Math.hypot(posA.getX(i), posA.getY(i)); const c = ramp(tempAt(r, t, p)); col.setXYZ(i, c[0], c[1], c[2]); }
  col.needsUpdate = true;
  const total = p.layers.reduce((a, l) => a + l.thick, 0);
  let y = 0;
  return (
    <group position={[x, 0, 0]}>
      {/* corte de la base: capas apiladas bajo el disco */}
      {p.layers.slice().reverse().map((l, i) => { const h = l.thick; const yy = -(y += h) + h / 2; return (
        <mesh key={i} position={[0, yy - 0.02, 0]}><cylinderGeometry args={[1, 1, h, 64]} /><meshStandardMaterial color={l.color} roughness={0.4} metalness={0.7} /></mesh>
      ); })}
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}><meshBasicMaterial vertexColors side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -total - 0.55, 0]}><coneGeometry args={[0.3 + 0.08 * Math.sin(t * 18 + x), 0.55, 20]} /><meshBasicMaterial color="#ffb347" transparent opacity={0.85} /></mesh>
      <mesh position={[0, -total - 0.3, 0]}><sphereGeometry args={[0.16, 14, 10]} /><meshBasicMaterial color="#fff2c4" /></mesh>
    </group>
  );
};

export const OleHeatSpreadMap: React.FC<OleHeatSpreadMapProps> = ({ pots, at = 0, kicker, footer, tilt = 1 }) => {
  const f = useCurrentFrame(); const { fps, width, height } = useVideoConfig();
  const t = Math.max(0, f / fps - at);
  const n = pots.length; const gap = 2.7;
  const xs = pots.map((_, i) => (i - (n - 1) / 2) * gap);
  const camZ = 5.2 + n * 1.35;
  const pos: [number, number, number] = [0, 3.6 * tilt + 0.4, camZ]; const tgt: [number, number, number] = [0, -0.35, 0];
  const fov = 32;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #4a3320, #21150b 80%)` }}>
      <ThreeCanvas width={width} height={height} camera={{ position: pos, fov, near: 0.1, far: 80 }}>
        <CamRig pos={pos} target={tgt} fov={fov} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 6, 5]} intensity={1.5} />
        {pots.map((p, i) => <Disc key={i} p={p} t={t} x={xs[i]} />)}
      </ThreeCanvas>
      {kicker ? <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", fontFamily: LABEL, letterSpacing: 8, fontSize: 30, color: OLE.ember, fontWeight: 600, opacity: easeOut(clamp01(t / 0.6)) }}>{kicker}</div> : null}
      {pots.map((p, i) => {
        const [sx, sy] = projectTo([xs[i], -0.6, 1.2], pos, tgt, fov, width, height);
        const a = easeOut(clamp01((t - 0.4 - i * 0.25) / 0.6));
        const c = p.verdict === "bad" ? "#C0392B" : p.verdict === "ok" ? "#3E8E53" : OLE.kraftL;
        return (
          <div key={i} style={{ position: "absolute", left: sx, top: sy + 24, transform: "translate(-50%,0)", opacity: a, textAlign: "center", width: 480 }}>
            <div style={{ display: "inline-block", padding: "8px 22px", borderRadius: 6, background: hexA(OLE.cream, 0.95), border: `3px solid ${c}`, boxShadow: "0 8px 22px rgba(0,0,0,0.4)" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 38, color: OLE.forest, lineHeight: 1.05 }}>{p.label}</div>
              {p.sub ? <div style={{ fontFamily: HAND, fontSize: 28, color: OLE.pencil }}>{p.sub}</div> : null}
            </div>
            {p.note ? <div style={{ marginTop: 10, fontFamily: HAND, fontSize: 30, color: OLE.kraftL, textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>{p.note}</div> : null}
          </div>
        );
      })}
      {footer ? <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center", fontFamily: LABEL, fontSize: 21, letterSpacing: 3, color: hexA(OLE.kraftL, 0.85) }}>{footer}</div> : null}
    </AbsoluteFill>
  );
};
export default OleHeatSpreadMap;
