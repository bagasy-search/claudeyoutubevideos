// OlcPanCross3D — el hierro fundido "bajo el microscopio", en 3D real (three.js por useCurrentFrame, nada de useFrame).
// Un bloque de hierro cortado: la superficie tiene poros y valles; cada capa fina de aceite polimerizado se agarra
// y va alisando los valles ("como capas de barniz en un bote"). Al final: la capa gruesa (la de la tienda) queda
// blanda por dentro, se levanta y se pela.
// mode "seasoning": zambullida a los poros → 4 capas finas → comparación fino vs grueso.
// mode "thick":     sólo la capa gruesa que queda blanda debajo y se pela.
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { CamRig, smooth, clamp01 } from "./OleDutchOven3D";
import { OLE, LABEL, HAND, SERIF, rnd, hexA } from "./OleTheme";
import { ramp, useT, useIO, Kicker } from "./OlcKit";

const NX = 220, XW = 3.0; // muestras y semiancho del bloque
const xs = Array.from({ length: NX + 1 }, (_, i) => -XW + (2 * XW * i) / NX);
const gauss = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));
// superficie del hierro: valles/poros angostos + rugosidad fina
const PITS = Array.from({ length: 26 }, (_, i) => ({ c: -2.85 + (5.7 * i) / 25 + (rnd(i + 3) - 0.5) * 0.12, w: 0.035 + rnd(i + 9) * 0.075, a: 0.07 + rnd(i + 17) * 0.17 }));
const iron0 = xs.map((x) => -PITS.reduce((s, p) => s + p.a * gauss(x, p.c, p.w), 0) + (rnd(Math.round((x + 4) * 90)) - 0.5) * 0.018);
const blur = (a: number[], k: number) => a.map((_, i) => { let s = 0, n = 0; for (let j = -k; j <= k; j++) { const q = a[Math.min(a.length - 1, Math.max(0, i + j))]; s += q; n++; } return s / n; });

/** capas finas: cada una rellena un poco los valles (alisa) y suma un espesor parejo */
function thinSurface(k: number, grow: number): number[] {
  // k = nº de capas completas, grow = avance (0-1) de la capa k+1
  let s = iron0.slice();
  const total = k + grow;
  const steps = Math.ceil(total);
  for (let i = 0; i < steps; i++) {
    const f = i + 1 <= k ? 1 : grow;
    const sm = blur(s, 5 + i * 2);
    s = s.map((v, j) => v + (sm[j] - v) * 0.6 * f + 0.075 * f);
  }
  return s;
}
/** capa gruesa: tapa los valles y queda plana y alta */
function thickSurface(grow: number): number[] { const top = 0.62; return iron0.map((v) => v + (Math.max(v, top * 0.9) - v) * grow + top * 0.2 * grow); }

/** franja (frente + tapa) entre dos perfiles */
function band(lower: number[], upper: number[], zf: number, zb: number): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const n = xs.length;
  for (let i = 0; i < n; i++) { pos.push(xs[i], lower[i], zf, xs[i], upper[i], zf); }
  for (let i = 0; i < n; i++) { pos.push(xs[i], upper[i], zf, xs[i], upper[i], zb); }
  for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const o = n * 2;
  for (let i = 0; i < n - 1; i++) { const a = o + i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
const flat = (v: number) => xs.map(() => v);

const Block: React.FC<{ x: number; t: number; thin?: { at: number[] }; thick?: { at: number; peelAt: number }; showLabels?: boolean }> = ({ x, t, thin, thick }) => {
  const ZF = 0.32, ZB = -0.32, BASE = -1.0;
  const layers = useMemo(() => [] as number[], []);
  const parts: React.ReactNode[] = [];
  let top = iron0;
  if (thin) {
    const done = thin.at.filter((a) => t >= a + 1.1).length;
    const cur = thin.at.findIndex((a) => t >= a && t < a + 1.1);
    const grow = cur >= 0 ? smooth((t - thin.at[cur]) / 1.1) : 0;
    const prev = thinSurface(done, 0);
    const now = thinSurface(done, grow);
    // cada capa completa como una franja oscura y brillante, la que crece con un poco más de brillo
    for (let k = 0; k < done + (cur >= 0 ? 1 : 0); k++) {
      const lo = thinSurface(k, 0), hi = thinSurface(k + 1, k === done ? grow : 1);
      const lowEff = k === done ? lo : lo;
      parts.push(<mesh key={"L" + k} geometry={band(lowEff.map((v) => v - 0.001), hi, ZF + 0.002 * (k + 1), ZB)}>
        <meshStandardMaterial color={k % 2 ? "#181A20" : "#20232B"} roughness={0.22} metalness={0.3} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-1 - k} />
      </mesh>);
    }
    top = done + (cur >= 0 ? 1 : 0) > 0 ? thinSurface(done, grow) : iron0;
    void prev; void now;
  }
  if (thick) {
    const g = smooth((t - thick.at) / 1.6);
    const peel = smooth((t - thick.peelAt) / 2.6);
    const skin = thickSurface(g);
    // el pelado: el borde derecho de la capa se levanta y se enrosca
    const lift = xs.map((xx) => { const u = clamp01((xx - 0.6) / 2.3); return peel * (u ** 2.2) * 0.9; });
    const upperSkin = skin.map((v, i) => v + lift[i]);
    const lowerSoft = iron0.map((v, i) => v + lift[i] * 0.85);
    // núcleo blando (amarillo, brillante) debajo de una cáscara oscura y dura
    const mid = upperSkin.map((v, i) => lowerSoft[i] + (v - lowerSoft[i]) * 0.72);
    parts.push(<mesh key="soft" geometry={band(lowerSoft, mid, ZF + 0.002, ZB)}><meshStandardMaterial color="#B98A2C" roughness={0.28} metalness={0.05} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-1} /></mesh>);
    parts.push(<mesh key="skin" geometry={band(mid, upperSkin, ZF + 0.003, ZB)}><meshStandardMaterial color="#231607" roughness={0.55} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-2} /></mesh>);
    top = upperSkin;
    void top;
  }
  return (
    <group position={[x, 0, 0]}>
      <mesh geometry={band(flat(BASE), iron0, ZF, ZB)}><meshStandardMaterial color="#8B867F" roughness={0.75} metalness={0.3} side={THREE.DoubleSide} /></mesh>
      {parts}
    </group>
  );
};

export const OlcPanCross3D: React.FC<{ mode?: "seasoning" | "thick"; events?: { pits?: number; layers?: number[]; thick?: number; soft?: number } }> = ({ mode = "seasoning", events = {} }) => {
  const { t, dur } = useT(); const io = useIO(0.4, 0.3);
  const ev = { pits: 2, layers: [8.8, 10.4, 12, 13.6], thick: 17.2, soft: 6, ...events };
  // cámara por fases
  const CAMS: { t: number; pos: [number, number, number]; tgt: [number, number, number] }[] = mode === "seasoning" ? [
    { t: 0, pos: [-2.2, 1.6, 6.8], tgt: [0, -0.3, 0] },
    { t: ev.pits - 0.2, pos: [-2.2, 1.6, 6.8], tgt: [0, -0.3, 0] },
    { t: ev.pits + 2.2, pos: [-0.7, 0.12, 2.5], tgt: [-0.7, -0.12, 0] },
    { t: ev.layers[0] - 0.5, pos: [-0.6, 0.15, 2.0], tgt: [-0.6, -0.08, 0] },
    { t: ev.layers[3] + 2, pos: [0.1, 0.3, 3.4], tgt: [0, -0.1, 0] },
    { t: ev.thick, pos: [0.1, 0.3, 3.4], tgt: [0, -0.1, 0] },
    { t: ev.thick + 2.4, pos: [0, 0.5, 6.4], tgt: [0, -0.15, 0] },
  ] : [
    { t: 0, pos: [-1.2, 0.9, 6.0], tgt: [0, -0.1, 0] },
    { t: ev.soft, pos: [-0.2, 0.4, 4.0], tgt: [0.3, 0, 0] },
    { t: dur, pos: [0.6, 0.5, 3.6], tgt: [0.9, 0.1, 0] },
  ];
  let ci = 0; for (let i = 0; i < CAMS.length - 1; i++) if (t >= CAMS[i].t) ci = i;
  const A = CAMS[ci], B = CAMS[Math.min(ci + 1, CAMS.length - 1)];
  const u = A === B ? 0 : smooth((t - A.t) / Math.max(0.01, B.t - A.t));
  const L = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] - v) * u) as [number, number, number];
  const pos = L(A.pos, B.pos), tgt = L(A.tgt, B.tgt);
  const both = mode === "seasoning" && t >= ev.thick;
  const compare = mode === "seasoning" ? smooth((t - ev.thick) / 1.5) : 0;
  // rótulos
  const labels: { at: number; end: number; k: string; s: string }[] = mode === "seasoning" ? [
    { at: 0.4, end: ev.pits, k: "CAST IRON", s: "looks smooth. It isn't." },
    { at: ev.pits, end: ev.layers[0] - 0.3, k: "UNDER A MICROSCOPE", s: "tiny pits and valleys, like a plowed field" },
    { at: ev.layers[0], end: ev.layers[1], k: "COAT 1", s: "oil baked hard sinks into the pits" },
    { at: ev.layers[1], end: ev.layers[2], k: "COAT 2", s: "another thin layer grabs the first" },
    { at: ev.layers[2], end: ev.layers[3], k: "COAT 3", s: "the valleys fill in" },
    { at: ev.layers[3], end: ev.thick, k: "COAT 4", s: "coats of varnish on a boat" },
    { at: ev.thick + 1.5, end: 99, k: "THIN GRABS · THICK PEELS", s: "same iron, same oil, one coat too many" },
  ] : [
    { at: 0.3, end: ev.soft, k: "THE STORE WAY", s: "one thick coat of oil, baked once" },
    { at: ev.soft, end: 99, k: "SOFT UNDERNEATH", s: "like a puddle of syrup that got baked" },
  ];
  const lab = labels.find((l) => t >= l.at && t < l.end);
  const labP = lab ? Math.min(ramp(t, lab.at, lab.at + 0.4), 1 - ramp(t, lab.end - 0.3, lab.end)) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a2f27" }}>
      <AbsoluteFill style={{ opacity: io }}>
        <ThreeCanvas width={1920} height={1080} camera={{ fov: 32, position: pos, near: 0.05, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamRig pos={pos} target={tgt} fov={32} />
          <color attach="background" args={["#3a2f27"]} />
          <hemisphereLight args={["#FFF1DA", "#5a4632", 0.95]} />
          <directionalLight position={[-4, 5, 5]} intensity={2.0} color="#FFE6C2" />
          <directionalLight position={[5, 2, 3]} intensity={0.9} color="#B7CCE6" />
          <pointLight position={[1.5, 2.2, 3]} intensity={9} distance={0} decay={1.5} color="#FFB45E" />
          {mode === "seasoning" ? (
            <>
              <group scale={[1 - 0.42 * compare, 1 - 0.42 * compare, 1 - 0.42 * compare]} position={[both ? -1.9 * compare : 0, 0, 0]}><Block x={0} t={t} thin={{ at: ev.layers }} /></group>
              {both ? <group scale={[0.58, 0.58, 0.58]} position={[1.9 * compare + (1 - compare) * 6, 0, 0]}><Block x={0} t={t} thick={{ at: ev.thick + 0.5, peelAt: ev.thick + 2.6 }} /></group> : null}
            </>
          ) : (
            <Block x={0} t={t} thick={{ at: 0.4, peelAt: ev.soft + 1.5 }} />
          )}
        </ThreeCanvas>
        {lab ? (
          <div style={{ position: "absolute", left: 96, bottom: 84, opacity: labP, transform: `translateY(${(1 - labP) * 26}px)`, background: OLE.paper, padding: "22px 40px 26px", borderRadius: 3, boxShadow: `0 18px 40px rgba(0,0,0,0.45)`, maxWidth: 1000 }}>
            <Kicker>{lab.k}</Kicker>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 56, color: OLE.forest, marginTop: 10, lineHeight: 1.05 }}>{lab.s}</div>
          </div>
        ) : null}
        {both && compare > 0.9 ? (<>
          <div style={{ position: "absolute", left: 250, top: 150, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#9be7a8", opacity: ramp(t, ev.thick + 1.6, ev.thick + 2.2), textShadow: "0 3px 12px #000" }}>THIN · bonded</div>
          <div style={{ position: "absolute", right: 250, top: 150, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#ff8f7a", opacity: ramp(t, ev.thick + 1.6, ev.thick + 2.2), textShadow: "0 3px 12px #000" }}>THICK · peels</div>
        </>) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
