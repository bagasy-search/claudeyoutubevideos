// rosa29e · bloque 4 en 3D: los cortes baratos, el colágeno que se funde, la carne que no necesita cuchillo, la olla volcán, el fuego de sonrisa, la plancha y las verduras por tiempos.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, cl } from "./hkit";
import { C3, Stage3, Kitchen, Cam, orbit, Pot, Lid, Spoon, Meat, Steam, Bubbles, Plate, M, T, V, ease, ramp, spr, rnd, lerp, rbox } from "./k3d";
import { Burner } from "./h3d2";

type P = { t: number; h: H };
const mtex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const lv3 = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
// etiqueta de carnicería escrita a mano, centrada (una palabra)
const tagTex = (s: string, ink = "#2b2118") => mtex(512, 256, (g) => {
  g.fillStyle = "#f4ead0"; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(140,110,60,${0.07 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 256, 3, 2); }
  g.strokeStyle = "rgba(90,60,30,.5)"; g.lineWidth = 6; g.strokeRect(12, 12, 488, 232);
  g.fillStyle = ink; g.font = "italic 700 118px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 256, 132);
});
const Tag: React.FC<{ tx: THREE.Texture; p: V; r?: V; s?: number }> = ({ tx, p, r = [0, 0, 0], s = 1 }) => (
  <group position={p} rotation={r} scale={s}>
    <mesh castShadow><boxGeometry args={[0.24, 0.12, 0.004]} /><meshStandardMaterial map={tx} roughness={0.85} /></mesh>
    {/* el palillo que la clava */}
    <mesh position={[0, -0.1, -0.004]} material={M.wood("#d8b98a")}><cylinderGeometry args={[0.004, 0.004, 0.12, 6]} /></mesh>
  </group>
);

// ───────── 1 · LOS CORTES BARATOS: sobre el papel de carnicería entran la paleta, la falda y el morcillo con su etiqueta; el lomo caro se va del cuadro
export const CowChart3: React.FC<P> = ({ t, h }) => {
  const tx = useMemo(() => ["Paleta", "Falda", "Morcillo", "Lomo"].map((s) => tagTex(s)), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const ins = [spr(tt, 0.1, 8, 0.6), spr(tt, 1.3, 8, 0.6), spr(tt, 2.5, 8, 0.6)], gone = ramp(tt, 3.7, 4.8);
    const c = orbit(tt, [0.2, 0.95, 1.2], [0.2, 0.08, 0.05], 0.1, 0.01);
    return <C3 bloom={0.12}><Cam p={c.p} l={c.l} fov={50} /><Kitchen wall={false} />
      {/* papel de carnicería sobre la mesa */}
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0.04]} receiveShadow><planeGeometry args={[1.9, 0.95]} /><meshStandardMaterial map={T.paper()} color="#f2ece0" roughness={0.9} /></mesh>
      {/* los tres cortes baratos: entran deslizando desde la derecha, de a uno */}
      {[[-0.2, 3, 1.15, "#a8322c"], [0.22, 7, 1.05, "#b23a30"], [0.62, 11, 0.95, "#9c2c26"]].map(([x, seed, s, col], i) => {
        const k = ins[i] as number, xx = lerp(1.4, x as number, k);
        if (k < 0.002) return null;
        return <group key={i}>
          <Meat p={[xx, 0.07, 0.05]} s={s as number} seed={seed as number} col={col as string} shine={0.55} r={[0, rnd(i, 3) * 2, 0]} />
          {/* la grasa blanca del borde: es lo que en la olla se vuelve sabor */}
          <mesh position={[xx + 0.12, 0.07, 0.15]} scale={[0.6, 0.25, 0.35]}><sphereGeometry args={[0.12, 20, 12]} /><meshPhysicalMaterial color="#f0e2cc" roughness={0.45} clearcoat={0.4} /></mesh>
          <Tag tx={tx[i]} p={[xx, 0.26, 0.3]} r={[-0.45, 0, 0]} s={1.05} />
        </group>;
      })}
      {/* el lomo caro: ya está a la izquierda y se va del cuadro */}
      {gone < 1 && <group position={[lerp(-0.6, -2.0, gone), 0, 0.02]}>
        <mesh position={[0, 0.06, 0]} rotation={[0, 0.1, 0]} scale={[1.8, 0.7, 0.7]} castShadow><capsuleGeometry args={[0.07, 0.16, 8, 20]} /><meshPhysicalMaterial color="#b0322e" map={T.meat(1)} roughness={0.5} clearcoat={0.3} /></mesh>
        <Tag tx={tx[3]} p={[0, 0.24, 0.25]} r={[-0.45, 0, 0]} s={1.05} />
      </group>}
    </C3>;
  }}</Stage3>;
};

// ───────── 2 · EL COLÁGENO: un trozo de carne en el caldo con sus hebras blancas; con el tiempo las hebras se vuelven gelatina brillante y gotean
export const YarnMelt3: React.FC<P> = ({ t, h }) => {
  const curves = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const pts = Array.from({ length: 9 }, (_, j) => new THREE.Vector3(-0.22 + j * 0.055, 0.0 + Math.sin(j * 1.3 + i) * 0.012, -0.12 + i * 0.04 + Math.sin(j * 0.9 + i * 2) * 0.012));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.014, 10, false);
  }), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const melt = ramp(tt, 0.8, 4.2);
    const col = new THREE.Color("#f2ece2").lerp(new THREE.Color("#d9a24e"), melt);
    const c = orbit(tt, [0.2, 0.34, 0.45], [0, 0.12, 0.05], 0.15, 0.01);
    return <C3 bloom={0.12}><Cam p={c.p} l={c.l} fov={40} /><Kitchen wall={false} />
      {/* el caldo en una fuente honda de barro */}
      <mesh position={[0, 0.0, 0]} material={M.clay("#8a4a2a")} castShadow receiveShadow><cylinderGeometry args={[0.52, 0.44, 0.1, 48]} /></mesh>
      <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.48, 48]} /><meshPhysicalMaterial color="#6a3416" roughness={0.12} clearcoat={1} /></mesh>
      <group position={[0, 0.055, 0]}><Bubbles tt={tt} R={0.4} n={7} size={0.018} rate={0.6} col="#8a4a20" /></group>
      {/* la carne cocida: un bloque con fibra */}
      <Meat p={[0, 0.07, 0]} r={[0, 0.15, 0]} s={1.45} seed={3} col="#7a4632" shine={0.7} />
      {/* las hebras de colágeno: blancas y opacas → ámbar, brillantes, se aflojan */}
      {curves.map((g, i) => <mesh key={i} geometry={g} position={[0, 0.2 - melt * 0.02, 0]} scale={[1, 1 - melt * 0.55, 1 + melt * 0.35]}>
        <meshPhysicalMaterial color={col} roughness={lerp(0.6, 0.05, melt)} clearcoat={melt} transparent opacity={lerp(1, 0.78, melt)} />
      </mesh>)}
      {/* la gelatina que gotea por el costado */}
      {melt > 0.3 && Array.from({ length: 6 }, (_, i) => {
        const k = ((tt - 1.8) * 0.5 + rnd(i, 1)) % 1; if (k < 0) return null;
        return <mesh key={i} position={[-0.2 + i * 0.08, lerp(0.15, 0.06, k), 0.2]} scale={[0.7, 2.6 + 2 * k, 0.5]}><sphereGeometry args={[0.012 * melt, 12, 8]} /><meshPhysicalMaterial color="#d9a24e" roughness={0.04} clearcoat={1} transparent opacity={0.85} /></mesh>;
      })}
    </C3>;
  }}</Stage3>;
};

// ───────── 3 · SIN CUCHILLO: el cuchillo se va del cuadro; la cuchara de madera apoya y la carne se desarma sola en hebras
export const NoKnife3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const away = ramp(tt, 0.3, 1.1), down = ramp(tt, 1.4, 2.2), split = spr(tt, 2.3, 6, 0.7);
    const c = orbit(tt, [0.2, 0.7, 0.7], [0, 0.1, 0], 0.12, 0.01);
    return <C3 bloom={0.08} exposure={0.8}><Cam p={c.p} l={c.l} fov={42} /><Kitchen wall={false} />
      <mesh position={[0, 0.02, 0]} geometry={rbox(1.3, 0.04, 0.8, 0.02)} material={M.wood("#a87a4c")} castShadow receiveShadow />
      <Plate p={[0, 0.04, 0]} s={1.5} col="#5a2a14" />
      {/* el cuchillo que no hace falta: se desliza fuera de cuadro */}
      <group position={[lerp(0.45, 1.6, away), 0.06, 0.2]} rotation={[0, 0.25, 0]}>
        <mesh position={[0.12, 0, 0]} material={M.chrome()} castShadow><boxGeometry args={[0.28, 0.006, 0.05]} /></mesh>
        <mesh position={[-0.08, 0, 0]} material={M.wood("#4a2c18")} castShadow><boxGeometry args={[0.14, 0.022, 0.034]} /></mesh>
      </group>
      {/* la carne: entera, y cuando la cuchara apoya se separa en trozos */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = i / 6 * 6.28 + 0.3, d = 0.07 * split;
        return <Meat key={i} p={[Math.cos(a) * d * 1.6, 0.13 - 0.02 * split, Math.sin(a) * d * 1.6]} s={0.8} seed={20 + i} col="#5a2c18" shine={0.75} r={[0, a, 0]} />;
      })}
      {/* el jugo que se abre en el plato */}
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.1 + 0.18 * split}><circleGeometry args={[1, 40]} /><meshPhysicalMaterial color="#4a1e0c" roughness={0.05} clearcoat={1} transparent opacity={0.8 * split} /></mesh>
      <group position={[0.1, lerp(0.5, 0.24, down) + 0.03 * Math.sin(Math.min(1, split) * 3.14), 0.2]} rotation={[0.55, 0.5, 0]}><Spoon s={0.8} c="#b9824c" /></group>
      <Steam tt={tt} p={[0, 0.15, 0]} o={0.25} n={8} h={0.6} w={0.2} />
    </C3>;
  }}</Stage3>;
};

// ───────── 4 · EL VOLCÁN: fuego alto, la olla hierve con furia, la tapa salta y la espuma se derrama por el costado
export const Volcano3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const boil = ramp(tt, 0.0, 0.8), jump = Math.max(0, tt - 1.0), foam = ramp(tt, 0.8, 2.6);
    const lidY = 0.12 * Math.abs(Math.sin(jump * 7)) * Math.exp(-jump * 0.5) * (jump > 0 ? 1 : 0) + 0.15 * foam;
    const c = orbit(tt, [0.2, 1.0, 1.75], [0, 0.55, 0], 0.1, 0.012);
    const S = 0.75, rim = 0.17 + 0.55 * S;
    return <C3 bloom={0.12}><Cam p={c.p} l={c.l} fov={42} /><Kitchen wall={false} />
      <mesh position={[0, 1.6, -1.875]}><planeGeometry args={[14, 5]} /><meshStandardMaterial map={T.planks()} color="#8a6a4a" roughness={0.9} /></mesh>
      <Burner tt={tt} k={1} p={[0, 0, 0]} r={0.28} />
      <group position={[0, 0.17, 0]}>
        <Pot s={S} fill={0.92} col="#7a3a1c" lidOff content={<Bubbles tt={tt * 2} R={0.4} n={16} size={0.05} rate={1.2} col="#c89a6a" />} />
      </group>
      <Lid p={[0.04 * Math.sin(tt * 6) * boil, rim + lidY, 0]} r={[0.05 * Math.sin(tt * 5), 0, 0.18 * foam + 0.05 * Math.sin(tt * 7) * boil]} s={S} />
      {/* espuma que sube por el borde y chorrea */}
      {Array.from({ length: 90 }, (_, i) => {
        const a = rnd(i, 7) * 6.28, r = Math.sqrt(rnd(i, 8)) * 0.4 * S, y = rim - 0.06 + 0.07 * foam * (1 - r / (0.4 * S)) + rnd(i, 9) * 0.02;
        return <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} scale={(0.012 + 0.02 * rnd(i, 2)) * (0.4 + foam)}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#d9c29a" roughness={0.25} clearcoat={0.6} transparent opacity={0.9} /></mesh>;
      })}
      {false && [0.4, 1.3, 2.4, 3.9, 5.1].map((a, i) => {
        const k = cl((tt - 1.8 - i * 0.25) / 2.2); if (k <= 0) return null;
        return <mesh key={'d' + i} position={[Math.cos(a) * 0.55 * S, rim - k * 0.4, Math.sin(a) * 0.55 * S]} scale={[1.4, 1.6 + 3 * k, 1]}><sphereGeometry args={[0.03, 12, 8]} /><meshPhysicalMaterial color="#d9c29a" roughness={0.2} clearcoat={0.8} /></mesh>;
      })}
      <Steam tt={tt} p={[0, rim + 0.05, 0]} o={0.55 * boil} n={14} h={1.1} w={0.3} />
    </C3>;
  }}</Stage3>;
};

// ───────── 5 · EL FUEGO DE SONRISA: fuego mínimo, el guiso apenas tiembla; tres burbujas grandes y lentas suben en curva y revientan con un soplo de vapor
export const SmileBubbles3: React.FC<P> = ({ t, h }) => {
  const bits = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ a: rnd(i, 1) * 6.28, d: 0.1 + rnd(i, 2) * 0.3, kind: i % 3 })), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const c = orbit(tt, [0.0, 1.15, 0.9], [0, 0.45, 0.05], 0.15, 0.01);
    const B = [[-0.2, 0.08, 0.6], [0.0, 0.17, 1.56], [0.2, 0.08, 2.52]];
    return <C3><Cam p={c.p} l={c.l} fov={40} /><Kitchen wall={false} />
      <Burner tt={tt} k={0.15} p={[0, 0, 0]} r={0.24} />
      <group position={[0, 0.17, 0]}>
        <Pot s={0.8} fill={0.8} col="#7a3a1a" lidOff content={<>
          {bits.map((b, i) => b.kind === 0
            ? <Meat key={i} p={[Math.cos(b.a) * b.d, 0.01, Math.sin(b.a) * b.d]} s={0.32} seed={40 + i} col="#5a2c16" shine={0.8} />
            : <mesh key={i} position={[Math.cos(b.a) * b.d, 0.012, Math.sin(b.a) * b.d]} rotation={[0.2, b.a, 0]}><cylinderGeometry args={[0.035, 0.035, 0.015, 20]} /><meshPhysicalMaterial color={b.kind === 1 ? "#e07a2a" : "#e8cf8e"} roughness={0.3} clearcoat={0.7} /></mesh>)}
          {/* las tres burbujas de la sonrisa */}
          {B.map(([x, z, t0], i) => {
            const k = (tt - t0) / 0.9; if (k < 0 || k > 1.25) return null;
            const s = k <= 1 ? 0.07 * Math.sin(k * Math.PI / 2) : 0.07 * (1.25 - k) * 4;
            return <mesh key={'b' + i} position={[x, s * 0.4, z]} scale={[s, s * 0.75, s]}><sphereGeometry args={[1, 24, 14]} /><meshPhysicalMaterial color="#c88a52" roughness={0.02} clearcoat={1} transparent opacity={0.8} /></mesh>;
          })}
        </>} />
      </group>
      {[[-0.2, 0.08, 0.6], [0.0, 0.17, 1.56], [0.2, 0.08, 2.52]].map(([x, z, t0], i) => tt > t0 + 0.9 && <Steam key={i} tt={tt - t0} p={[x * 0.8, 0.17 + 0.7 * 0.8 * 0.6, z * 0.8]} o={0.35 * Math.max(0, 1 - (tt - t0 - 0.9) / 2)} n={4} h={0.5} w={0.08} />)}
    </C3>;
  }}</Stage3>;
};

// ───────── 6 · LA PLANCHA: la plancha al rojo quema la camisa en un segundo; la plancha justa pasa con vapor y la tela queda lisa
export const Iron3: React.FC<P> = ({ t, h }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(1.2, 0.5, 90, 36), []);
  const base = useMemo(() => Float32Array.from((geo.attributes.position as THREE.BufferAttribute).array as Float32Array), [geo]);
  return <Stage3 t={t} h={h}>{(tt) => {
    const hot = ramp(tt, 0.1, 0.6) * (1 - ramp(tt, 1.6, 2.0)), burn = ramp(tt, 0.5, 1.3), glide = ramp(tt, 2.0, 4.6);
    const ix = tt < 1.8 ? -0.35 : lerp(-0.5, 0.5, glide), iy = tt < 1.8 ? lerp(0.25, 0.06, ramp(tt, 0.1, 0.5)) : (tt < 2.0 ? lerp(0.25, 0.06, ramp(tt, 1.8, 2.0)) : 0.06);
    // las arrugas: desaparecen por donde ya pasó la plancha justa
    const ps = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < ps.count; i++) {
      const x = base[i * 3], y = base[i * 3 + 1], flat = tt >= 2.0 && x < ix ? 0.08 : 1;
      ps.setZ(i, flat * 0.01 * (Math.sin(y * 26 + Math.sin(x * 4) * 2) + 0.4 * Math.sin(x * 9 + y * 3)));
    }
    ps.needsUpdate = true; geo.computeVertexNormals();
    const c = orbit(tt, [0.1, 0.62, 0.72], [0.0, 0.06, 0], 0.12, 0.01);
    const sole = new THREE.Color("#c8ccd2").lerp(new THREE.Color("#ff5a1a"), hot);
    return <C3 bloom={0.12}><Cam p={c.p} l={c.l} fov={42} /><Kitchen wall={false} />
      {/* la tabla de planchar con su funda */}
      <mesh position={[0, 0.0, 0]} geometry={rbox(1.5, 0.03, 0.6, 0.012)} castShadow receiveShadow><meshStandardMaterial color="#9aa8b4" roughness={0.95} /></mesh>
      {/* la camisa blanca */}
      <mesh geometry={geo} position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow><meshStandardMaterial color="#e2e6ea" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {/* la quemadura de la plancha al rojo */}
      <mesh position={[-0.35, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.62, 1]}><circleGeometry args={[0.12 * burn + 0.001, 3, -Math.PI / 2]} /><meshStandardMaterial color="#5a2e12" transparent opacity={0.85 * burn} roughness={1} /></mesh>
      {/* la plancha */}
      <group position={[ix, iy, 0]} scale={1.5}>
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} castShadow><circleGeometry args={[0.13, 3]} /><meshStandardMaterial color={sole} emissive="#ff4a10" emissiveIntensity={hot * 0.8} metalness={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>
        <mesh position={[-0.01, 0.05, 0]} scale={[1.3, 0.55, 0.85]} castShadow><sphereGeometry args={[0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#9a2a22" roughness={0.25} clearcoat={1} /></mesh>
        <mesh position={[-0.02, 0.13, 0]} rotation={[0, 0, Math.PI / 2]} material={M.matte("#1d1a18", 0.5)} castShadow><torusGeometry args={[0.06, 0.012, 10, 24, Math.PI]} /></mesh>
      </group>
      {/* humo de la quemadura / vapor de la plancha justa */}
      {tt < 2.2 && <Steam tt={tt} p={[-0.35, 0.05, 0]} col="#8a8078" o={0.4 * burn * (1 - ramp(tt, 1.6, 2.2))} n={6} h={0.5} w={0.1} />}
      {tt > 2.0 && <Steam tt={tt} p={[ix - 0.05, 0.05, 0]} o={0.4 * (1 - ramp(tt, 4.6, 5.2))} n={8} h={0.45} w={0.1} />}
    </C3>;
  }}</Stage3>;
};

// ───────── 7 · POR TIEMPOS: tres cuencos junto a la olla; se vuelcan de a uno —zanahoria, después papa, al final calabaza— y cada tanda cae al guiso
const VEG = [{ c: "#e0702a", g: "disc" }, { c: "#e8d49a", g: "cube" }, { c: "#e8922a", g: "cube" }];
export const Theater3: React.FC<P> = ({ t, h }) => {
  const tx = useMemo(() => ["primero", "después", "al final"].map((s) => tagTex(s)), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const T0 = [0.3, 1.9, 3.5];
    const c = orbit(tt, [0.0, 1.55, 1.85], [0, 0.12, 0.2], 0.1, 0.01);
    const S = 0.75, top = (0.08 + 0.75 * 0.42) * S;
    return <C3 bloom={0.08} exposure={0.82}><Cam p={c.p} l={c.l} fov={46} /><Kitchen wall={false} />
      <Pot s={S} fill={0.75} col="#7a3a1a" lidOff content={<Bubbles tt={tt} R={0.4} n={6} size={0.025} rate={0.6} col="#9a5a2a" />} />
      <Steam tt={tt} p={[0, 0.45, 0]} o={0.25} n={8} h={0.8} w={0.2} />
      {VEG.map((v, j) => {
        const rest: V = [-0.7 + j * 0.7, 0.0, 0.45], over: V = [lerp(-0.18, 0.18, j / 2), 0.62, 0.12];
        const go = ramp(tt, T0[j], T0[j] + 0.5), tip = ramp(tt, T0[j] + 0.45, T0[j] + 0.8), back = ramp(tt, T0[j] + 1.1, T0[j] + 1.5);
        const bp = lv3(rest, over, go * (1 - back));
        return <group key={j}>
          <group position={bp} rotation={[-tip * (1 - back) * 1.6, 0, 0]}>
            <Plate s={0.75} col="#e8e2d4" />
          </group>
          {(1 - go) > 0.02 && <Tag tx={tx[j]} p={[rest[0], 0.12, rest[2] + 0.28]} r={[-0.6, 0, 0]} s={1.5 * (1 - go)} />}
          {Array.from({ length: 16 }, (_, i) => {
            const rel = tt - (T0[j] + 0.6 + rnd(i, j + 1) * 0.25);
            const local: V = [(rnd(i, 1) - 0.5) * 0.24, 0.07, (rnd(i, 2) - 0.5) * 0.24];
            const land: V = [(rnd(i, 3) - 0.5) * 0.5, top, (rnd(i, 4) - 0.5) * 0.5];
            let pos: V;
            if (rel < 0) pos = [bp[0] + local[0], bp[1] + local[1], bp[2] + local[2]];
            else { const k = cl(rel / 0.45); pos = [lerp(over[0] + local[0], land[0], k), lerp(over[1], land[1], k) + 0.12 * Math.sin(k * Math.PI) - 0.0, lerp(over[2], land[2], k)]; }
            return <mesh key={i} position={pos} rotation={[rnd(i, 5) * 3, rnd(i, 6) * 3, 0]} castShadow>
              {v.g === "disc" ? <cylinderGeometry args={[0.035, 0.035, 0.018, 20]} /> : <boxGeometry args={[0.05, 0.05, 0.05]} />}
              <meshPhysicalMaterial color={v.c} roughness={0.45} clearcoat={0.4} />
            </mesh>;
          })}
        </group>;
      })}
    </C3>;
  }}</Stage3>;
};
