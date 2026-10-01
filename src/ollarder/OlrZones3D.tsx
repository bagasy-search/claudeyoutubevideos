// OlrZones3D — el campamento en CORTE, en 3D real: cook shack + dingle (anexo con lado sin calefacción y lado calefaccionado) +
// bodega bajo tierra. Las TRES ZONAS se iluminan una por una: ZONA 1 el lado frío (carne congelada a propósito), ZONA 2 el
// sótano (frío que no congela), ZONA 3 el lado seco junto a la estufa. three.js por useCurrentFrame (nada de useFrame).
// mode: "tease" (3,5 s, barrido) · "full" (recorrido de las 3 zonas) · "dingle" (el anexo partido en dos) · "dry" (lado seco).
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { CamRig, projectTo } from "./OleDutchOven3D";
import { OLE, LABEL, HAND, SERIF, hexA, rnd } from "./OleTheme";
import { ramp, useT, useIO, Kicker } from "./OlrKit";
import { ev } from "./OlrCards";
import { Box, Barrel, Crate, Sack, Potatoes, Apples, Cabbages, OnionBraid, Carrots, Jar, BeefQuarter, Lantern3D, Thermo3D, Room, useTex, camAt, Tex } from "./OlrWorld3D";

const Z = { z1: "#4B93C9", z2: "#2F9A6A", z3: "#F08A2E" };
const Glow: React.FC<{ x0: number; x1: number; y: number; z0: number; z1: number; c: string; a: number }> = ({ x0, x1, y, z0, z1, c, a }) => (
  <mesh position={[(x0 + x1) / 2, y, (z0 + z1) / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[x1 - x0, z1 - z0]} /><meshBasicMaterial color={c} transparent opacity={a} depthWrite={false} /></mesh>
);

const Camp: React.FC<{ tex: Tex; t: number; hl: { z1: number; z2: number; z3: number }; flick: number }> = ({ tex, t, hl, flick }) => {
  const frost = Array.from({ length: 26 }, (_, i) => ({ x: -6.0 + rnd(i + 1) * 1.6, y: 0.2 + rnd(i + 30) * 1.5, z: -1.9 + rnd(i + 60) * 3.0, s: 0.012 + rnd(i + 90) * 0.02, sp: 0.1 + rnd(i + 5) * 0.2 }));
  return (
    <group>
      {/* nieve */}
      <Box p={[0, -0.02, -2.75]} s={[30, 0.04, 8.5]} c="#F2F6FA" map={tex.snow} />
      {/* tierra en corte: izquierda, derecha y base; el hueco del sótano queda entre -1.2 y 2.8 */}
      <Box p={[-8.1, -1.3, -0.4]} s={[13.8, 2.6, 3.8]} c="#6A4A2C" map={tex.earth} />
      <Box p={[8.4, -1.3, -0.4]} s={[11.2, 2.6, 3.8]} c="#6A4A2C" map={tex.earth} />
      <Box p={[1, -2.3, -0.4]} s={[4.0, 0.7, 3.8]} c="#5B4026" map={tex.earth} />
      <Box p={[1, -1.15, -2.3]} s={[4.0, 2.3, 0.2]} c="#4B341E" map={tex.earth} />
      {/* piso del sótano + suelo del cook shack sobre el hueco */}
      <Box p={[1, -1.97, -0.4]} s={[4.0, 0.06, 3.7]} c="#7A5A38" map={tex.wood} />
      <Box p={[1, -0.05, -0.4]} s={[4.0, 0.1, 3.7]} c="#B88E58" map={tex.wood} />
      {/* cook shack (frente abierto) */}
      <Room x0={-2.6} x1={3.4} h={2.3} z0={-2.2} z1={1.4} tex={tex} />
      <Box p={[0.4, 2.36, -2.1]} s={[6.2, 0.1, 0.5]} c="#6B4A26" map={tex.log} />
      {/* dingle: anexo con pared divisoria */}
      <Room x0={-6.2} x1={-2.6} h={1.8} z0={-2.2} z1={1.4} tex={tex} wall="#8F6438" />
      <Box p={[-4.4, 0.9, -0.4]} s={[0.1, 1.8, 3.6]} c="#8A5E34" map={tex.log} />
      <Box p={[-4.4, 1.86, -0.4]} s={[3.9, 0.08, 3.8]} c="#E9EEF2" map={tex.snow} />
      {/* ZONA 1 — lado frío: reses congeladas, nieve entrando */}
      {[0, 1, 2].map((i) => <BeefQuarter key={i} p={[-5.7 + i * 0.5, 0.35 + (i % 2) * 0.05, -1.2 + (i % 2) * 0.4]} rot={i} />)}
      <Box p={[-5.2, 0.12, -0.6]} s={[1.4, 0.24, 1.8]} c="#CFE3F1" o={0.9} />
      {frost.map((f, i) => <mesh key={i} position={[f.x + Math.sin(t * f.sp + i) * 0.1, ((f.y - t * f.sp * 0.4) % 1.7 + 1.7) % 1.7 + 0.1, f.z]}><sphereGeometry args={[f.s, 5, 5]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} /></mesh>)}
      <Thermo3D p={[-6.0, 0.9, 0.6]} lvl={0.06} color="#4B93C9" s={1.3} />
      {/* dingle lado calefaccionado: cajones de papas y frascos + estufita */}
      <Crate p={[-3.5, 0.28, -1.4]} map={tex.wood} s={[0.9, 0.5, 0.7]}><Potatoes p={[0, 0.2, 0]} n={14} seed={4} /></Crate>
      <Crate p={[-3.4, 0.28, -0.3]} map={tex.wood} s={[0.9, 0.5, 0.7]}><Cabbages p={[0, 0.2, 0]} n={3} /></Crate>
      {[0, 1, 2, 3].map((i) => <Jar key={i} p={[-5.0 + i * 0.19, 0.5, -2.0]} s={1.3} fill={i % 2 ? "#E8C26A" : "#C9503A"} />)}
      <Box p={[-4.9, 0.25, -1.95]} s={[1.1, 0.5, 0.3]} c="#8A5E34" map={tex.wood} />
      <Thermo3D p={[-3.0, 0.9, 0.8]} lvl={0.4} color="#F08A2E" s={1.3} />
      {/* ZONA 2 — sótano: papas, manzanas lejos, cebollas colgadas, repollos, zanahorias */}
      <Box p={[1, -1.2, -2.0]} s={[3.6, 0.07, 0.5]} c="#9A6C3E" map={tex.wood} />
      <Box p={[1, -0.55, -2.0]} s={[3.6, 0.07, 0.5]} c="#9A6C3E" map={tex.wood} />
      <Crate p={[-0.2, -1.65, -1.2]} map={tex.wood} s={[0.9, 0.5, 0.7]}><Potatoes p={[0, 0.2, 0]} n={16} seed={9} /></Crate>
      <Crate p={[0.8, -1.65, -1.2]} map={tex.wood} s={[0.9, 0.5, 0.7]}><Potatoes p={[0, 0.2, 0]} n={16} seed={19} /></Crate>
      <Crate p={[2.2, -1.65, -1.1]} map={tex.wood} s={[0.9, 0.5, 0.7]}><Apples p={[0, 0.2, 0]} n={14} /></Crate>
      <Cabbages p={[0.2, -1.1, -2.0]} n={3} /><Carrots p={[1.7, -1.14, -2.0]} n={9} />
      <OnionBraid p={[0.5, -0.12, -1.4]} /><OnionBraid p={[0.9, -0.12, -1.4]} n={6} />
      <Thermo3D p={[-0.95, -1.2, -0.2]} lvl={0.38} color="#2F9A6A" s={1.3} />
      <Lantern3D p={[1.1, -0.35, -0.6]} flick={flick} />
      {/* ZONA 3 — lado seco junto a la estufa */}
      <Box p={[2.5, 0.55, -1.5]} s={[0.9, 1.1, 0.8]} c="#232220" r={0.5} />
      <Box p={[2.5, 1.6, -1.5]} s={[0.16, 1.1, 0.16]} c="#3A3733" />
      <mesh position={[2.5, 0.45, -1.1]}><boxGeometry args={[0.35, 0.28, 0.02]} /><meshStandardMaterial color="#FF7A2C" emissive="#FF5A10" emissiveIntensity={1.6 * flick} /></mesh>
      <pointLight position={[2.5, 0.55, -0.9]} intensity={3.2 * flick} distance={4.5} decay={1.7} color="#FF8A3C" />
      <Barrel p={[0.6, 0, -1.8]} map={tex.wood} /><Barrel p={[1.15, 0, -1.9]} map={tex.wood} s={0.9} />
      <Sack p={[0.55, 0, -0.9]} map={tex.burlap} s={1} color="#F0E6CF" /><Sack p={[1.15, 0, -0.9]} map={tex.burlap} s={1} color="#F0E6CF" /><Sack p={[1.7, 0, -1.2]} map={tex.burlap} s={0.9} />
      <Box p={[1.6, 1.1, -2.05]} s={[1.9, 0.06, 0.4]} c="#9A6C3E" map={tex.wood} />
      {[0, 1, 2, 3, 4].map((i) => <Jar key={i} p={[0.8 + i * 0.22, 1.13, -2.05]} s={1.3} fill={["#E8C26A", "#C9503A", "#F4EBD6", "#8A5A2A", "#E8C26A"][i]} />)}
      <Thermo3D p={[3.2, 1.0, 0.6]} lvl={0.7} color="#F08A2E" s={1.3} />
      <Lantern3D p={[3.0, 1.6, 0.3]} flick={flick} />
      {/* brillo por zona */}
      <Glow x0={-6.1} x1={-4.5} y={0.02} z0={-2.1} z1={1.3} c={Z.z1} a={0.5 * hl.z1} />
      <Glow x0={-1.1} x1={3.3} y={-1.93} z0={-2.1} z1={1.3} c={Z.z2} a={0.5 * hl.z2} />
      <Glow x0={0.2} x1={3.3} y={0.05} z0={-2.1} z1={1.3} c={Z.z3} a={0.5 * hl.z3} />
    </group>
  );
};

const Pill: React.FC<{ x: number; y: number; k: string; s: string; c: string; p: number }> = ({ x, y, k, s, c, p }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, ${-100 + (1 - p) * 30}%) scale(${0.8 + 0.2 * p})`, opacity: p, textAlign: "center", pointerEvents: "none" }}>
    <div style={{ background: c, color: "#fff", fontFamily: LABEL, fontWeight: 700, letterSpacing: 5, fontSize: 30, padding: "8px 22px", borderRadius: 6, boxShadow: "0 8px 20px rgba(0,0,0,.4)", whiteSpace: "nowrap" }}>{k}</div>
    <div style={{ background: OLE.paper, fontFamily: HAND, fontWeight: 700, fontSize: 34, color: OLE.pencil, padding: "6px 18px", marginTop: 4, borderRadius: 4, boxShadow: "0 8px 18px rgba(0,0,0,.3)", whiteSpace: "nowrap" }}>{s}</div>
  </div>
);

export const OlrZones3D: React.FC<{ mode?: "tease" | "full" | "dingle" | "dry"; at?: any }> = ({ mode = "full", at }) => {
  const { t, dur } = useT(); const io = useIO(0.25, 0.3);
  const tex = useTex();
  const tz1 = ev(at, "z1", 3), tz2 = ev(at, "z2", 9), tz3 = ev(at, "z3", 16), tbed = ev(at, "bed", 24);
  let keys: { t: number; pos: [number, number, number]; tgt: [number, number, number] }[];
  let hl = { z1: 0, z2: 0, z3: 0 };
  const pills: { w: [number, number, number]; k: string; s: string; c: string; a: number }[] = [];
  if (mode === "tease") {
    keys = [{ t: 0, pos: [-4.2, 2.0, 7.8], tgt: [-3.6, 0.6, 0] }, { t: dur * 0.45, pos: [0.4, 0.6, 7.2], tgt: [0.6, -0.5, 0] }, { t: Math.max(1.6, dur), pos: [3.6, 2.4, 8.4], tgt: [1.8, 0.7, 0] }];
    const p1 = ramp(t, dur * 0.04, dur * 0.22), p2 = ramp(t, dur * 0.34, dur * 0.52), p3 = ramp(t, dur * 0.62, dur * 0.8);
    hl = { z1: p1, z2: p2, z3: p3 };
    pills.push({ w: [-5.2, 1.9, -0.4], k: "ZONE 1", s: "frozen", c: Z.z1, a: p1 }, { w: [1, -0.1, -0.4], k: "ZONE 2", s: "cellar", c: Z.z2, a: p2 }, { w: [2.0, 2.45, -0.4], k: "ZONE 3", s: "dry side", c: Z.z3, a: p3 });
  } else if (mode === "full") {
    keys = [
      { t: 0, pos: [0.2, 2.8, 11.6], tgt: [-0.4, 0.0, -0.3] },
      { t: tz1 - 0.6, pos: [0.2, 2.8, 11.6], tgt: [-0.4, -0.1, -0.3] },
      { t: tz1 + 0.8, pos: [-5.2, 1.3, 5.4], tgt: [-5.2, 0.7, -0.6] },
      { t: tz2 - 0.4, pos: [-5.0, 1.3, 5.6], tgt: [-5.1, 0.7, -0.6] },
      { t: tz2 + 1.0, pos: [1.0, -0.6, 5.6], tgt: [1.0, -0.9, -0.8] },
      { t: tz3 - 0.4, pos: [1.0, -0.6, 5.8], tgt: [1.0, -0.9, -0.8] },
      { t: tz3 + 1.0, pos: [2.0, 1.5, 5.4], tgt: [1.9, 0.7, -0.8] },
      { t: tbed - 0.2, pos: [2.0, 1.5, 5.6], tgt: [1.9, 0.7, -0.8] },
      { t: tbed + 2.6, pos: [0.2, 3.0, 11.6], tgt: [-0.4, 0.0, -0.3] },
    ];
    const f = (a: number) => ramp(t, a, a + 0.8);
    hl = { z1: f(tz1) * (1 - 0.6 * f(tz2)), z2: f(tz2) * (1 - 0.6 * f(tz3)), z3: f(tz3) };
    if (t >= tbed) hl = { z1: 0.6, z2: 0.6, z3: 0.6 };
    const fin = ramp(t, tbed, tbed + 0.6);
    pills.push({ w: [-5.2, 1.95, -0.4], k: "ZONE 1 · THE COLD SIDE", s: "frozen on purpose", c: Z.z1, a: Math.max(f(tz1) * (1 - f(tz2)), fin) }, { w: [1, -0.05, -0.4], k: "ZONE 2 · THE CELLAR", s: "cold but never freezing", c: Z.z2, a: Math.max(f(tz2) * (1 - f(tz3)), fin) }, { w: [2.0, 2.5, -0.4], k: "ZONE 3 · THE DRY SIDE", s: "up by the stove", c: Z.z3, a: Math.max(f(tz3) * (1 - fin), fin) });
  } else if (mode === "dingle") {
    const tc = ev(at, "cold", 2), tw = ev(at, "warm", 8), twall = ev(at, "wall", 15);
    keys = [{ t: 0, pos: [-3.2, 2.4, 9.0], tgt: [-4.4, 0.8, -0.4] }, { t: tc, pos: [-5.6, 1.2, 5.2], tgt: [-5.4, 0.7, -0.6] }, { t: tw, pos: [-3.2, 1.2, 5.2], tgt: [-3.3, 0.7, -0.6] }, { t: twall, pos: [-4.4, 1.5, 6.4], tgt: [-4.4, 0.8, -0.5] }, { t: Math.max(twall + 3, dur), pos: [-4.2, 2.2, 8.6], tgt: [-4.2, 0.8, -0.4] }];
    const a = ramp(t, tc, tc + 0.7), b = ramp(t, tw, tw + 0.7);
    hl = { z1: a * (1 - 0.7 * b), z2: b, z3: 0 };
    pills.push({ w: [-5.3, 1.9, -0.4], k: "UNHEATED", s: "stays frozen · for the meat", c: Z.z1, a }, { w: [-3.5, 1.9, -0.4], k: "HEATED JUST ENOUGH", s: "vegetables & cans won't freeze", c: Z.z3, a: b });
  } else {
    keys = [{ t: 0, pos: [0.2, 2.6, 9.6], tgt: [1.9, 0.7, -0.8] }, { t: 2.2, pos: [1.9, 1.5, 5.4], tgt: [1.9, 0.7, -0.8] }, { t: Math.max(6, dur), pos: [2.3, 1.3, 5.0], tgt: [1.9, 0.7, -0.8] }];
    const a = ramp(t, 0.4, 1.2); hl = { z1: 0, z2: 0, z3: a };
    pills.push({ w: [2.0, 2.45, -0.4], k: "ZONE 3 · THE DRY SIDE", s: "flour · sugar · molasses · baking soda · tea · coffee", c: Z.z3, a: ramp(t, ev(at, "go", 1.2), ev(at, "go", 1.2) + 0.6) });
  }
  const cam = camAt(keys, t);
  const flick = 0.85 + 0.15 * Math.sin(t * 9) + 0.05 * Math.sin(t * 23);
  return (
    <AbsoluteFill style={{ backgroundColor: "#CFE0EC" }}>
      <AbsoluteFill style={{ opacity: io }}>
        <ThreeCanvas width={1920} height={1080} camera={{ fov: 36, position: cam.pos, near: 0.05, far: 80 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamRig pos={cam.pos} target={cam.tgt} fov={36} />
          <color attach="background" args={["#CFE0EC"]} />
          <hemisphereLight args={["#FFFFFF", "#B9A58C", 1.7]} />
          <directionalLight position={[-6, 8, 8]} intensity={2.6} color="#FFF0D6" />
          <directionalLight position={[6, 3, 5]} intensity={0.7} color="#BFD4EC" />
          <Camp tex={tex} t={t} hl={hl} flick={flick} />
        </ThreeCanvas>
        {pills.map((p, i) => { const [x, y0] = projectTo(p.w, cam.pos, cam.tgt, 36, 1920, 1080); const y = Math.max(y0, 200); return p.a > 0.02 ? <Pill key={i} x={x} y={y} k={p.k} s={p.s} c={p.c} p={p.a} /> : null; })}
        <div style={{ position: "absolute", left: 80, top: 56, opacity: ramp(t, 0.1, 0.7) * (mode === "tease" ? 0 : 1) }}><Kicker>THE CAMP, IN CUTAWAY</Kicker></div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
