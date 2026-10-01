// OlrCellar3D — la bodega por dentro, en 3D real.
//  mode "earth":    la tierra sostiene una temperatura pareja mientras el aire de arriba se sacude (gráfico aire vs. sótano).
//  mode "sides":    lado HÚMEDO (papas, zanahorias en arena mojada, repollo) y lado SECO (cebollas trenzadas), mismo frío distinto aire.
//  mode "ethylene": manzanas junto a papas: el gas invisible hace brotar las papas y amarga las zanahorias (PAGO del gancho).
// three.js por useCurrentFrame, nada de Math.random.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CamRig, projectTo } from "./OleDutchOven3D";
import { OLE, LABEL, HAND, SERIF, rnd } from "./OleTheme";
import { ramp, useT, useIO, Kicker, cl } from "./OlrKit";
import { ev } from "./OlrCards";
import { IcoDrop } from "./OlrIcons";
import { Box, Barrel, Crate, Sack, Potatoes, Apples, Cabbages, OnionBraid, Carrots, Jar, Lantern3D, Thermo3D, useTex, camAt, Tex } from "./OlrWorld3D";

const Cellar: React.FC<{ tex: Tex; t: number; mode: string; sprout: number; bitter: number; gas: number; flick: number; apart: number; showEarth: number }> = ({ tex, t, mode, sprout, bitter, gas, flick, apart, showEarth }) => {
  const puffs = Array.from({ length: 30 }, (_, i) => ({ k: rnd(i + 1), y: rnd(i + 40), z: rnd(i + 80), s: 0.05 + rnd(i + 120) * 0.06 }));
  const ax = -0.5 - 2.4 * apart; // las manzanas se van al otro lado cuando "apart"=1
  return (
    <group>
      {/* sala del sótano: tierra al fondo y a los lados, piso de tablas */}
      <Box p={[0, -0.05, 0]} s={[9.4, 0.1, 5.4]} c="#7A5A38" map={tex.wood} />
      <Box p={[0, 1.6, -2.7]} s={[9.4, 3.3, 0.2]} c="#5B4026" map={tex.earth} />
      <Box p={[-4.7, 1.6, 0]} s={[0.2, 3.3, 5.4]} c="#5B4026" map={tex.earth} />
      <Box p={[4.7, 1.6, 0]} s={[0.2, 3.3, 5.4]} c="#5B4026" map={tex.earth} />
      <Box p={[0, 3.3, 0]} s={[9.4, 0.14, 5.4]} c="#6B4A26" map={tex.log} o={mode === "earth" ? 0.0 : 1} />
      {/* vigas */}
      {[-3, -1, 1, 3].map((x) => <Box key={x} p={[x, 3.15, 0]} s={[0.22, 0.22, 5.4]} c="#8A5E34" map={tex.log} />)}
      {/* estantes del fondo */}
      <Box p={[0, 0.9, -2.45]} s={[8.6, 0.07, 0.5]} c="#9A6C3E" map={tex.wood} />
      <Box p={[0, 1.75, -2.45]} s={[8.6, 0.07, 0.5]} c="#9A6C3E" map={tex.wood} />
      {mode === "sides" ? <Box p={[0.2, 0.9, 0.2]} s={[0.1, 1.8, 3.8]} c="#8A5E34" map={tex.wood} /> : null}
      {/* ── lado HÚMEDO (izquierda): papas, zanahorias en arena, repollos */}
      <Crate p={[-3.2, 0.28, -1.2]} map={tex.wood} s={[1.2, 0.55, 0.8]}><Potatoes p={[0, 0.22, 0]} n={22} seed={7} w={0.95} d={0.6} /></Crate>
      <Crate p={[-1.8, 0.28, -1.2]} map={tex.wood} s={[1.2, 0.55, 0.8]}><Potatoes p={[0, 0.22, 0]} n={22} seed={37} w={0.95} d={0.6} sprout={mode === "ethylene" ? sprout : 0} /></Crate>
      <mesh position={[-3.4, 0.3, 0.6]}><cylinderGeometry args={[0.32, 0.27, 0.6, 16]} /><meshStandardMaterial color="#6C5A3C" roughness={1} /></mesh>
      <Carrots p={[-3.4, 0.62, 0.6]} n={9} bitter={bitter} />
      <Cabbages p={[-2.7, 0.88, -2.4]} n={3} />
      {/* ── lado SECO (derecha): cebollas trenzadas, bolsa de malla, frascos */}
      {[1.6, 2.2, 3.0].map((x, i) => <OnionBraid key={i} p={[x, 3.1, -1.3 + (i % 2) * 0.4]} n={7 - (i % 2)} />)}
      <Sack p={[3.6, 0, -1.4]} map={tex.burlap} s={1.1} color="#D9C79A" />
      {[0, 1, 2, 3].map((i) => <Jar key={i} p={[2.2 + i * 0.3, 1.78, -2.45]} s={1.4} fill={["#E8C26A", "#C9503A", "#F4EBD6", "#8A5A2A"][i]} />)}
      <Barrel p={[3.2, 0, -2.0]} map={tex.wood} s={1.1} />
      {/* ── manzanas (ejemplo del gas): cajón que se desplaza al otro lado en "apart" */}
      {mode === "ethylene" ? <Crate p={[ax + 1.9, 0.28, -1.0]} map={tex.wood} s={[1.1, 0.55, 0.8]}><Apples p={[0, 0.22, 0]} n={18} w={0.9} d={0.6} /></Crate> : null}
      {/* partículas del gas: salen del cajón de manzanas hacia papas y zanahorias */}
      {mode === "ethylene" && gas > 0.02 ? puffs.map((p, i) => {
        const u = ((t * 0.32 + p.k * 3) % 1);
        const x0 = ax + 1.9 + (p.z - 0.5) * 0.7, x1 = -1.9 - 0.4 - p.k * 1.3 + 2.3 * apart;
        return <mesh key={i} position={[x0 + (x1 - x0) * u * (1 - apart * 0.8), 0.8 + p.y * 0.9 + Math.sin(u * 6 + i) * 0.1, -1.0 + (p.z - 0.5) * 1.0]} scale={p.s * (0.7 + u)}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#B5E86A" transparent opacity={0.5 * gas * (1 - u) * (1 - apart)} depthWrite={false} /></mesh>;
      }) : null}
      {/* gotas en el lado húmedo (sides) */}
      <Thermo3D p={[0.2, 1.9, 0.9]} lvl={0.4} color="#2F9A6A" s={1.5} />
      <Lantern3D p={[0.2, 2.6, 0.2]} flick={flick} />
      {mode === "earth" ? <Box p={[0, 4.4, 0]} s={[9.4, 2.2, 5.4]} c="#6A4A2C" map={tex.earth} o={showEarth} /> : null}
    </group>
  );
};

export const OlrCellar3D: React.FC<{ mode?: "earth" | "sides" | "ethylene"; at?: any }> = ({ mode = "sides", at }) => {
  const { t, dur } = useT(); const io = useIO(0.3, 0.3);
  const tex = useTex();
  const flick = 0.85 + 0.15 * Math.sin(t * 9) + 0.05 * Math.sin(t * 21);
  let keys: { t: number; pos: [number, number, number]; tgt: [number, number, number] }[];
  let sprout = 0, bitter = 0, gas = 0, apart = 0;
  const tags: { x: number; y: number; k: string; s: string; a: number; c: string }[] = [];
  const pills: { w: [number, number, number]; k: string; s: string; c: string; a: number }[] = [];
  if (mode === "earth") {
    keys = [{ t: 0, pos: [0.4, 2.2, 9.8], tgt: [0, 1.4, -0.5] }, { t: Math.max(4, dur), pos: [0.0, 1.8, 8.0], tgt: [0, 1.3, -0.5] }];
  } else if (mode === "sides") {
    const tw = ev(at, "wet", 0.4), td = ev(at, "dry", 11);
    keys = [{ t: 0, pos: [0.2, 2.0, 9.2], tgt: [0, 1.0, -0.6] }, { t: tw + 0.8, pos: [-2.6, 1.5, 5.2], tgt: [-2.6, 0.6, -0.8] }, { t: td - 0.4, pos: [-2.4, 1.5, 5.4], tgt: [-2.5, 0.7, -0.8] }, { t: td + 1.2, pos: [2.6, 1.8, 5.4], tgt: [2.6, 1.4, -1.0] }, { t: Math.max(td + 8, dur), pos: [0.2, 2.0, 8.6], tgt: [0, 1.0, -0.6] }];
    pills.push({ w: [-2.6, 1.6, 0], k: "WET SIDE", s: "potatoes · carrots in damp sand · cabbage", c: "#2F6E9A", a: ramp(t, tw + 0.4, tw + 1.0) }, { w: [2.8, 3.0, 0], k: "DRY SIDE", s: "onions · cured, in a braid", c: "#C77A1E", a: ramp(t, td + 0.2, td + 0.8) });
  } else {
    const tg = ev(at, "gas", 0.4), ts = ev(at, "sprout", 6), tb = ev(at, "bitter", 9.5), tw = ev(at, "whisk", 18);
    keys = [{ t: 0, pos: [-0.2, 1.8, 8.6], tgt: [-1.3, 0.6, -1.0] }, { t: tg + 1, pos: [-1.6, 1.6, 5.8], tgt: [-1.5, 0.6, -1.0] }, { t: ts + 1, pos: [-2.2, 1.2, 4.6], tgt: [-2.0, 0.5, -1.1] }, { t: tb + 1, pos: [-3.0, 1.2, 4.8], tgt: [-3.2, 0.6, -0.4] }, { t: Math.max(tw + 2, dur), pos: [-2.0, 1.5, 6.4], tgt: [-1.9, 0.6, -1.0] }];
    gas = ramp(t, tg, tg + 1.2); sprout = ramp(t, ts, ts + 7); bitter = ramp(t, tb, tb + 2);
    pills.push({ w: [-0.4, 1.35, -1.0], k: "APPLES", s: "give off a gas as they ripen", c: "#B02A24", a: ramp(t, tg + 0.2, tg + 0.8) * (1 - ramp(t, ts - 0.3, ts)) },
      { w: [-1.8, 1.4, -1.2], k: "POTATOES SPROUT", s: "you can't see it · you can't smell it", c: "#2F7A3E", a: ramp(t, ts + 0.5, ts + 1.1) * (1 - ramp(t, tb - 0.3, tb)) },
      { w: [-3.4, 1.3, 0.6], k: "CARROTS TURN BITTER", s: "same invisible gas", c: "#C77A1E", a: ramp(t, tb + 0.3, tb + 0.9) * (1 - ramp(t, tw - 0.4, tw)) },
      { w: [-1.8, 1.4, -1.2], k: "WHISKERS", s: "a month later", c: "#8E2B2B", a: ramp(t, tw, tw + 0.6) });
  }
  const cam = camAt(keys, t);
  // gráfico aire vs sótano (earth)
  const g = mode === "earth" ? (() => {
    const W = 760, H = 300; const n = 80; const tw = ev(at, "swing", 1), ts = ev(at, "steady", 6);
    const air = Array.from({ length: n }, (_, i) => { const x = i / (n - 1); const tt = x * 9 + t * 0.9; return 18 + 22 * Math.sin(tt * 1.3) + 9 * Math.sin(tt * 3.1 + 1) + 6 * Math.sin(tt * 7.3); });
    const ground = air.map((_, i) => 40 + 0.8 * Math.sin((i / 10) + t * 0.3));
    const Y = (v: number) => H - ((v + 10) / 70) * H;
    const path = (a: number[]) => "M " + a.map((v, i) => `${(i / (n - 1)) * W} ${Y(v)}`).join(" L ");
    return { W, H, air: path(air), gr: path(ground), pa: ramp(t, tw - 0.3, tw + 0.6), pg: ramp(t, ts - 0.3, ts + 0.6) };
  })() : null;
  return (
    <AbsoluteFill style={{ backgroundColor: "#2A1F16" }}>
      <AbsoluteFill style={{ opacity: io }}>
        <ThreeCanvas width={1920} height={1080} camera={{ fov: 36, position: cam.pos, near: 0.05, far: 80 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamRig pos={cam.pos} target={cam.tgt} fov={36} />
          <color attach="background" args={["#2A1F16"]} />
          <hemisphereLight args={["#FFF1DA", "#8A6A48", 1.6]} />
          <directionalLight position={[-4, 6, 8]} intensity={2.2} color="#FFE6C2" />
          <Cellar tex={tex} t={t} mode={mode} sprout={sprout} bitter={bitter} gas={gas} flick={flick} apart={apart} showEarth={0} />
        </ThreeCanvas>
        {pills.map((p, i) => { const [x, y0] = projectTo(p.w, cam.pos, cam.tgt, 36, 1920, 1080); const y = Math.max(y0, 200); return p.a > 0.02 ? (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, ${-100 + (1 - p.a) * 30}%)`, opacity: p.a, textAlign: "center" }}>
            <div style={{ background: p.c, color: "#fff", fontFamily: LABEL, fontWeight: 700, letterSpacing: 5, fontSize: 34, padding: "8px 24px", borderRadius: 6, boxShadow: "0 8px 20px rgba(0,0,0,.45)", whiteSpace: "nowrap" }}>{p.k}</div>
            <div style={{ background: OLE.paper, fontFamily: HAND, fontWeight: 700, fontSize: 36, color: OLE.pencil, padding: "6px 20px", marginTop: 4, borderRadius: 4, whiteSpace: "nowrap" }}>{p.s}</div>
          </div>) : null; })}
        {g ? (
          <div style={{ position: "absolute", right: 70, top: 90, width: g.W + 70, background: OLE.paper, borderRadius: 4, padding: "22px 34px 26px", boxShadow: "0 22px 44px rgba(0,0,0,.5)" }}>
            <Kicker>AIR ABOVE  vs  THE CELLAR</Kicker>
            <svg width={g.W} height={g.H + 20} style={{ marginTop: 14 }}>
              <path d={`M 0 ${g.H - (42 / 70) * g.H} H ${g.W}`} stroke="#B8D6EA" strokeWidth="2" strokeDasharray="8 8" />
              <text x={g.W - 4} y={g.H - (42 / 70) * g.H - 6} textAnchor="end" fontFamily={LABEL} fontSize="22" fill="#2F6E9A">32°F</text>
              <path d={g.air} stroke="#C9503A" strokeWidth="6" fill="none" strokeLinejoin="round" opacity={g.pa} />
              <path d={g.gr} stroke="#2F9A6A" strokeWidth="8" fill="none" strokeLinejoin="round" opacity={g.pg} />
            </svg>
            <div style={{ display: "flex", gap: 40, fontFamily: HAND, fontWeight: 700, fontSize: 36 }}><span style={{ color: "#C9503A", opacity: g.pa }}>● the air: all over the place</span><span style={{ color: "#2F9A6A", opacity: g.pg }}>● the earth: steady</span></div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
