// clducha · EL MUNDO: la ducha de un cuarto de hotel en corte de casa de muñecas (frente abierto), con azulejos crema de 15 cm
// y JUNTAS de verdad (hundidas entre los azulejos) que se ponen negras desde abajo. Al lado, el pasillo del hotel con el carrito
// y LA GUÍA. Y lejos, a escala gigante, LA JUNTA EN CORTE: los azulejos son manzanas, las juntas son CALLES y el moho son RAÍCES
// que bajan dentro de la pastina (el cloro se queda arriba; el agua oxigenada baja por los agujeritos). UNA escena y UNA cámara.
// Todo lo que cambia (negro de las juntas, pasta, burbujas, gota, sellador) viene de estado.ts (segundos globales). Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { P } from "./lib";
import { camAt, W, H } from "./camara";
import { stateAt, St } from "./estado";

type V3 = [number, number, number];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- medidas de la ducha ----------------
export const PITCH = 0.156, TILE = 0.15, GR = PITCH - TILE; // azulejo 15 cm + junta de 6 mm
export const X0 = -1.0, Z0 = -1.0, TRAY = 0.06, COLS = 10, ROWS = 13;
// la CIUDAD (la junta en corte, escala gigante): centro de la manzana del medio
export const G: V3 = [12, 0, 0];
export const CB = 1.0, CS = 0.16, CT = 0.12, CF = 1.62; // manzana (azulejo) 1 m, calle (junta) 16 cm, espesor del azulejo, frente del corte (z)
export const PT = {
  low: [-0.2, TRAY + PITCH, Z0 + 0.01] as V3,         // junta de la fila de abajo (a la altura de los pies)
  low2: [-0.5, TRAY + PITCH * 2, Z0 + 0.01] as V3,
  mid: [-0.2, 1.1, Z0 + 0.01] as V3,
  head: [0.32, 1.72, Z0 + 0.06] as V3,
  corner: [X0 + 0.01, TRAY + 0.03, Z0 + 0.01] as V3,
  window: [X0 + 0.01, 1.85, -0.35] as V3,
  // la ciudad
  street: [G[0] + 0.5 * (CB + CS), G[1] - 0.01, G[2] + CF - 0.05] as V3,     // la calle que llega al corte
  root: [G[0] + 0.5 * (CB + CS), G[1] - 0.07, G[2] + CF] as V3,                 // las raíces en el corte
  crust: [G[0] + 0.5 * (CB + CS), G[1] - 0.008, G[2] + CF] as V3,
  backing: [G[0], G[1] - 0.24, G[2] + CF] as V3,
  book: [3.3, 0.965, 0.3] as V3,
  cart: [3.3, 0.6, 0.3] as V3,
};

// spot con su target metido en la escena (si no, apunta al origen)
const SpotT: React.FC<{ to: V3 } & Record<string, unknown>> = ({ to, ...props }) => {
  const o = useMemo(() => new THREE.Object3D(), []);
  o.position.set(to[0], to[1], to[2]); o.updateMatrixWorld();
  return <><primitive object={o} /><spotLight {...props} target={o} /></>;
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera, gl } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  gl.localClippingEnabled = true;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.004; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- páginas REALES de la guía (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [ready, bump] = useState(0);
  const r = useMemo(() => {
    const L = new THREE.TextureLoader();
    const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas guia");
    let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (tt) => { flip.image = tt.image; flip.needsUpdate = true; if (--n === 0) bump(h); }, undefined, () => { if (--n === 0) bump(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
  return { pg: r, ready };
};
// dentro del lienzo: cuando llegan las páginas redibuja ESTE cuadro (ThreeCanvas sólo avanza al cambiar de cuadro) y recién ahí suelta el render
const Kick: React.FC<{ h: number }> = ({ h }) => {
  const { advance } = useThree();
  React.useLayoutEffect(() => { if (!h) return; advance(performance.now()); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); }, [h]);
  return null;
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useDuchaTex = () => useMemo(() => {
  // máscara del moho en la pared: (COLS x ROWS) con más negro abajo y en el rincón; en blanco = transparente
  const mold = (side: number) => mk(COLS * 64, ROWS * 64, (g) => {
    g.fillStyle = "#000"; g.fillRect(0, 0, COLS * 64, ROWS * 64);
    for (let i = 0; i < 2600; i++) {
      const u = rnd(i + side * 9000, 1), v = Math.pow(rnd(i + side * 9000, 2), 2.6); // v=0 abajo
      const corner = side === 0 ? 1 - u : u;                                           // más en el rincón
      const a = Math.min(1, (1 - v) * (0.55 + 0.6 * corner * corner));
      const x = u * COLS * 64, y = ROWS * 64 - v * ROWS * 64;
      g.fillStyle = `rgba(255,255,255,${0.12 * a})`; g.beginPath(); g.arc(x, y, 6 + 18 * rnd(i, 3), 0, 6.3); g.fill();
    }
  });
  // la pastina en corte: arena + cemento con agujeritos
  const grout = mk(256, 256, (g) => {
    g.fillStyle = "#cfcac0"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) { const v = 150 + rnd(i, 1) * 90; g.fillStyle = `rgb(${v},${v - 4},${v - 12})`; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 256, 0.8 + rnd(i, 4) * 2.4, 0, 6.3); g.fill(); }
    for (let i = 0; i < 420; i++) { g.fillStyle = `rgba(40,36,30,${0.35 + 0.4 * rnd(i, 5)})`; g.beginPath(); g.ellipse(rnd(i, 6) * 256, rnd(i, 7) * 256, 1 + rnd(i, 8) * 3.2, 0.8 + rnd(i, 9) * 2, rnd(i, 10) * 3, 0, 6.3); g.fill(); }
  }, [3, 2]);
  // el bizcocho del azulejo (canto rojizo) y la cola de pegar (gris)
  const biscuit = mk(256, 64, (g) => { g.fillStyle = "#c9a58a"; g.fillRect(0, 0, 256, 64); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(120,80,55,${0.25 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 64, 2, 2); } g.fillStyle = "#f3ead8"; g.fillRect(0, 0, 256, 7); }, [4, 1]);
  const mortar = mk(256, 128, (g) => { g.fillStyle = "#8d8b86"; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 1400; i++) { const v = 100 + rnd(i, 1) * 70; g.fillStyle = `rgba(${v},${v},${v - 4},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 128, 2, 2); } }, [6, 1]);
  const carpet = mk(256, 256, (g) => {
    g.fillStyle = "#6b2230"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#c9a35a"; g.lineWidth = 3;
    for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(k * 64 + 32, 8); g.lineTo(k * 64 + 56, 32); g.lineTo(k * 64 + 32, 56); g.lineTo(k * 64 + 8, 32); g.closePath(); g.stroke(); }
  }, [4, 3]);
  const floor = mk(256, 256, (g) => {
    g.fillStyle = "#1c1d20"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 4; c2++) { const cx = c2 * 64 + 32, cy = r * 64 + 32, R = 30, k = R * 0.42; g.fillStyle = "#ecebe6"; g.beginPath(); g.moveTo(cx - k, cy - R); g.lineTo(cx + k, cy - R); g.lineTo(cx + R, cy - k); g.lineTo(cx + R, cy + k); g.lineTo(cx + k, cy + R); g.lineTo(cx - k, cy + R); g.lineTo(cx - R, cy + k); g.lineTo(cx - R, cy - k); g.closePath(); g.fill(); }
  }, [10, 7]);
  const paper = mk(256, 256, (g) => { g.fillStyle = "#e9dcc0"; g.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(150,120,70,.16)"; g.fillRect(x, 0, 12, 256); } }, [4, 2]);
  const sky = mk(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0d1117"); gr.addColorStop(0.5, "#2a3442"); gr.addColorStop(1, "#0b0e12"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); });
  return { moldBack: mold(0), moldSide: mold(1), grout, biscuit, mortar, carpet, floor, paper, sky };
}, []);

type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const CHROME = { color: "#eef1f3", metalness: 1, roughness: 0.1 };

// ---------------- LA PARED DE AZULEJOS (una cara) ----------------
// La junta es la pared de atrás (pastina blanca) + una capa de MOHO encima (máscara de manchas) que se recorta con un plano
// de corte (wipe) cuando pasa la esponja. Los azulejos son cajitas redondeadas que sobresalen 8 mm: la junta queda HUNDIDA.
const Wall: React.FC<{ side: 0 | 1; st: St; tex: ReturnType<typeof useDuchaTex> }> = ({ side, st, tex }) => {
  const Wd = COLS * PITCH, Hd = ROWS * PITCH;
  const wipe = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), []);
  // en la cara de atrás: lo limpio queda a la izquierda de la esponja (x < wipeX) → el moho sólo se dibuja a la derecha
  wipe.normal.set(side === 0 ? 1 : 0, 0, side === 0 ? 0 : -1); wipe.constant = side === 0 ? -st.wipeX : st.wipeX;
  const tiles = useMemo(() => {
    const o: { x: number; y: number; k: number }[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) o.push({ x: c * PITCH + PITCH / 2, y: TRAY + r * PITCH + PITCH / 2, k: r * COLS + c });
    return o;
  }, []);
  // tramos de junta: horizontales (entre filas) y verticales (entre columnas), cada uno con su oscuridad d
  const segs = useMemo(() => {
    const o: { x: number; y: number; w: number; h: number; d: number }[] = [];
    const dark = (r: number, c: number) => { const u = c / COLS, corner = side === 0 ? 1 - u : u; return Math.max(0, Math.min(1, 1.15 - r / ROWS * 1.9 + 0.25 * corner + 0.15 * (rnd(r * 31 + c, side + 3) - 0.5))); };
    for (let r = 0; r <= ROWS; r++) for (let c = 0; c < COLS; c++) o.push({ x: c * PITCH + PITCH / 2, y: TRAY + r * PITCH, w: PITCH, h: GR * 2.2, d: dark(r - 0.5, c) });
    for (let r = 0; r < ROWS; r++) for (let c = 0; c <= COLS; c++) o.push({ x: c * PITCH, y: TRAY + r * PITCH + PITCH / 2, w: GR * 2.2, h: PITCH, d: dark(r, c) });
    return o.filter((q) => q.d > 0.03);
  }, [side]);
  const grp = side === 0 ? { position: [X0, 0, Z0] as V3, rotation: [0, 0, 0] as V3 } : { position: [X0, 0, Z0 + Wd] as V3, rotation: [0, Math.PI / 2, 0] as V3 };
  const black = new THREE.Color("#000000").lerp(new THREE.Color("#d9d6cd"), st.bleach);
  return (
    <group position={grp.position} rotation={grp.rotation}>
      {/* pastina (blanca de verdad) */}
      <mesh position={[Wd / 2, TRAY + Hd / 2, 0.0]} receiveShadow><planeGeometry args={[Wd, Hd]} /><meshStandardMaterial color={new THREE.Color("#ece9e1").lerp(new THREE.Color("#a7a299"), st.grey)} roughness={0.95} /></mesh>
      {/* el moho: una tira oscura por cada tramo de junta, más negra abajo y hacia el rincón */}
      {st.black > 0.01 && segs.map((g, i) => (
        <mesh key={"m" + i} position={[g.x, g.y, 0.0012]}><planeGeometry args={[g.w, g.h]} />
          <meshStandardMaterial color={black} transparent opacity={Math.min(1, st.black * g.d)} roughness={1} metalness={0} envMapIntensity={0} depthWrite={false} clippingPlanes={st.wipeX > -9 && side === 0 ? [wipe] : []} /></mesh>))}
      {/* la pasta blanca sobre las juntas de abajo */}
      {st.paste > 0.01 && side === 0 && Array.from({ length: 3 }, (_, r) => (
        <mesh key={r} position={[Wd * st.paste / 2, TRAY + (r + 1) * PITCH, 0.0095]}><boxGeometry args={[Wd * st.paste, GR * 2.2, 0.003]} /><meshStandardMaterial color={new THREE.Color("#f7f5ef").lerp(new THREE.Color("#b9b5ad"), st.pasteGrey)} roughness={0.85} /></mesh>))}
      {/* sellador: una película que brilla sobre la junta */}
      {st.seal > 0.01 && side === 0 && <mesh position={[Wd / 2, TRAY + Hd / 2, 0.0012]}><planeGeometry args={[Wd, Hd]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.12 * st.seal} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>}
      {tiles.map((q) => (
        <mesh key={q.k} position={[q.x, q.y, 0.004]} castShadow receiveShadow geometry={rbox(TILE, TILE, 0.008, 0.003)}>
          <meshPhysicalMaterial color={["#efe4cf", "#ece0ca", "#f1e7d3"][q.k % 3]} roughness={0.12} clearcoat={0.9} clearcoatRoughness={0.06} />
        </mesh>))}
    </group>
  );
};

// la ducha de mano con su manguera y soporte
const Shower: React.FC<{ on: number; t: number }> = ({ on, t }) => {
  const hose = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v3([0.32, 0.95, Z0 + 0.03]), v3([0.38, 1.1, Z0 + 0.12]), v3([0.36, 1.45, Z0 + 0.1]), v3([0.33, 1.63, Z0 + 0.06])]), 60, 0.009, 10, false), []);
  return (
    <group>
      <mesh position={[0.32, 0.95, Z0 + 0.025]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.03, 24]} /><meshStandardMaterial {...CHROME} /></mesh>
      <mesh geometry={hose}><meshStandardMaterial {...CHROME} roughness={0.22} /></mesh>
      <group position={PT.head} rotation={[0.55, 0, 0]}>
        <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.013, 0.016, 0.16, 20]} /><meshStandardMaterial {...CHROME} /></mesh>
        <mesh position={[0, 0.0, 0.0]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.045, 0.03, 0.03, 32]} /><meshStandardMaterial {...CHROME} /></mesh>
        <mesh position={[0, -0.016, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.041, 32]} /><meshStandardMaterial color="#d7dadc" metalness={0.6} roughness={0.3} /></mesh>
      </group>
      {on > 0.01 && Array.from({ length: 90 }, (_, i) => {
        const ph = (t * 1.8 + rnd(i, 1)) % 1, a = rnd(i, 2) * 6.28, rr = 0.03 * rnd(i, 3);
        const x = PT.head[0] + Math.cos(a) * rr + ph * 0.02, y = PT.head[1] - 0.04 - ph * (PT.head[1] - TRAY - 0.05), z = PT.head[2] + 0.04 + Math.sin(a) * rr + ph * 0.25;
        return <mesh key={i} position={[x, y, z]} scale={[1, 4, 1]}><sphereGeometry args={[0.0032, 6, 4]} /><meshPhysicalMaterial color="#dff1ff" transparent opacity={0.55 * on} roughness={0.02} /></mesh>;
      })}
    </group>
  );
};

// ======================= LA CIUDAD: la junta en corte, gigante =======================
// raíces del moho: curvas que bajan dentro de la calle (pastina), dibujadas en la cara del corte
const ROOTS = (() => {
  const out: THREE.TubeGeometry[] = [];
  for (const sx of [-1.5, -0.5, 0.5, 1.5]) for (let k = 0; k < 5; k++) {
    const x0 = G[0] + sx * (CB + CS) + (rnd(k + sx * 7, 1) - 0.5) * CS * 0.5, z = G[2] + CF + 0.003;
    const pts: THREE.Vector3[] = [];
    let x = x0, y = G[1] - 0.004;
    const depth = CT * (0.55 + 0.4 * rnd(k, 2));
    for (let j = 0; j <= 8; j++) { pts.push(new THREE.Vector3(x, y, z)); y -= depth / 8; x += (rnd(k * 9 + j, 3) - 0.5) * 0.03; x = Math.max(x0 - CS * 0.42, Math.min(x0 + CS * 0.42, x)); }
    out.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0035 + 0.003 * rnd(k, 4), 6, false));
  }
  return out;
})();
const City: React.FC<{ st: St; t: number; tex: ReturnType<typeof useDuchaTex> }> = ({ st, t, tex }) => {
  const blocks: [number, number][] = [];
  for (const i of [-1, 0, 1]) for (const j of [-1, 0]) blocks.push([i, j]);
  const crustCol = new THREE.Color("#121110").lerp(new THREE.Color("#e9e6dd"), st.cbleach);
  const rootCol = new THREE.Color("#0d0c0b").lerp(new THREE.Color("#3f3a33"), st.dis);
  return (
    <group>
      {/* la cola de pegar (abajo de todo) y el revoque */}
      <mesh position={[G[0], G[1] - CT - 0.11, G[2] + CF / 2 - 0.9]} receiveShadow geometry={rbox(3 * CB + 3 * CS + 0.4, 0.22, CF + 1.8, 0.01)}><meshStandardMaterial map={tex.mortar} roughness={0.95} /></mesh>
      {/* las manzanas: azulejos gigantes (esmalte brillante + bizcocho en el canto) */}
      {blocks.map(([i, j]) => (
        <group key={i + "_" + j} position={[G[0] + i * (CB + CS), G[1] - CT / 2, G[2] + CF - CB / 2 + j * (CB + CS)]}>
          <mesh castShadow receiveShadow geometry={rbox(CB, CT, CB, 0.012)}><meshStandardMaterial map={tex.biscuit} roughness={0.8} /></mesh>
          <mesh position={[0, CT / 2 - 0.004, 0]} geometry={rbox(CB - 0.004, 0.012, CB - 0.004, 0.006)}><meshPhysicalMaterial color="#efe4cf" roughness={0.08} clearcoat={1} clearcoatRoughness={0.04} /></mesh>
        </group>))}
      {/* las calles: la pastina llena de agujeritos (hundida 1 cm bajo el esmalte) */}
      {[-0.5, 0.5].map((sx, i) => (
        <mesh key={"cz" + i} position={[G[0] + sx * (CB + CS) * 1, G[1] - CT / 2 - 0.006, G[2] + CF / 2 - (CB + CS) / 2]} receiveShadow geometry={rbox(CS, CT - 0.012, CF + CB + CS, 0.004)}><meshStandardMaterial map={tex.grout} roughness={0.97} /></mesh>))}
      {[-1.5, 1.5].map((sx, i) => (
        <mesh key={"cz2" + i} position={[G[0] + sx * (CB + CS), G[1] - CT / 2 - 0.006, G[2] + CF / 2 - (CB + CS) / 2]} receiveShadow geometry={rbox(CS, CT - 0.012, CF + CB + CS, 0.004)}><meshStandardMaterial map={tex.grout} roughness={0.97} /></mesh>))}
      <mesh position={[G[0], G[1] - CT / 2 - 0.006, G[2] + CF - CB - CS / 2]} receiveShadow geometry={rbox(3 * CB + 3 * CS, CT - 0.012, CS, 0.004)}><meshStandardMaterial map={tex.grout} roughness={0.97} /></mesh>
      {/* la costra negra arriba de cada calle (cloro = se pone blanca arriba, pero abajo sigue) */}
      {st.cityCrust > 0.01 && [-1.5, -0.5, 0.5, 1.5].map((sx, i) => (
        <mesh key={"k" + i} position={[G[0] + sx * (CB + CS), G[1] - 0.009, G[2] + CF / 2 - (CB + CS) / 2]} geometry={rbox(CS * 0.98, 0.006 + 0.004 * st.cityCrust, CF + CB + CS, 0.002)}><meshStandardMaterial color={crustCol} roughness={1} transparent opacity={st.cityCrust * (1 - st.dis * 0.95)} /></mesh>))}
      {/* pelusa del moho (bolitas oscuras sobre la calle) */}
      {st.cityCrust > 0.01 && st.dis < 0.95 && Array.from({ length: 140 }, (_, i) => {
        const sx = [-1.5, -0.5, 0.5, 1.5][i % 4], x = G[0] + sx * (CB + CS) + (rnd(i, 1) - 0.5) * CS * 0.9, z = G[2] + CF - rnd(i, 2) * (CF + CB);
        return <mesh key={"f" + i} position={[x, G[1] - 0.004, z]} scale={(0.5 + rnd(i, 3)) * (1 - st.dis)}><sphereGeometry args={[0.009, 6, 5]} /><meshStandardMaterial color={crustCol} roughness={1} /></mesh>;
      })}
      {/* las RAÍCES en la cara del corte */}
      {st.roots > 0.01 && ROOTS.map((g, i) => <mesh key={"r" + i} geometry={g} scale={[1, 1, 1]}><meshStandardMaterial color={rootCol} roughness={0.9} emissive="#2a0f05" emissiveIntensity={st.rootGlow * 0.6} transparent opacity={st.roots * (1 - st.dis)} /></mesh>)}
      {/* cloro: llovizna blanca que se queda ARRIBA */}
      {st.cloroRain > 0.01 && Array.from({ length: 80 }, (_, i) => {
        const ph = (t * 0.9 + rnd(i, 1)) % 1, sx = [-0.5, 0.5][i % 2];
        const x = G[0] + sx * (CB + CS) + (rnd(i, 2) - 0.5) * 0.5, z = G[2] + CF - 0.05 - rnd(i, 3) * 0.6;
        const y = G[1] + 0.6 - ph * 0.6;
        return <mesh key={"c" + i} position={[x, Math.max(G[1] - 0.004, y), z]} scale={[1, ph < 0.98 ? 2.2 : 0.4, 1]}><sphereGeometry args={[0.005, 6, 4]} /><meshStandardMaterial color="#f4fbff" emissive="#ffffff" emissiveIntensity={0.3} transparent opacity={st.cloroRain * 0.8} /></mesh>;
      })}
      {/* agua oxigenada: burbujitas que BAJAN por los agujeritos hasta las raíces */}
      {st.oxBubbles > 0.01 && Array.from({ length: 120 }, (_, i) => {
        const g = ROOTS[i % ROOTS.length], path = (g.parameters as { path: THREE.Curve<THREE.Vector3> }).path;
        const u = (t * 0.25 + rnd(i, 1)) % 1, q = path.getPointAt(u);
        return <mesh key={"b" + i} position={[q.x + (rnd(i, 2) - 0.5) * 0.02, q.y, q.z + 0.006]} scale={0.6 + 0.8 * rnd(i, 3)}><sphereGeometry args={[0.0065, 8, 6]} /><meshPhysicalMaterial color="#cfeaff" emissive="#8fd6ff" emissiveIntensity={0.55} transparent opacity={0.85 * st.oxBubbles} roughness={0.05} /></mesh>;
      })}
      {/* la pasta: capa blanca espesa arriba de la calle del frente */}
      {st.cityPaste > 0.01 && [-0.5, 0.5].map((sx, i) => (
        <mesh key={"p" + i} position={[G[0] + sx * (CB + CS), G[1] + 0.012, G[2] + CF / 2 - (CB + CS) / 2]} geometry={rbox(CS * 1.4, 0.03 * st.cityPaste, CF + CB + CS, 0.012)}><meshStandardMaterial color="#f8f6f0" roughness={0.8} /></mesh>))}
      {/* la gota de agua (prueba uno): se queda redonda si está sellada; si no, se hunde y oscurece */}
      {st.drop > 0.01 && (() => {
        const sink = st.sealCity > 0.5 ? 0 : st.dropSink;
        const x = G[0] + 0.5 * (CB + CS), z = G[2] + CF - 0.35;
        return (<group>
          <mesh position={[x, G[1] - 0.006 + 0.03 * (1 - sink) * st.drop, z]} scale={[1, 0.75 * (1 - sink * 0.92), 1]}><sphereGeometry args={[0.045 * st.drop, 32, 20]} /><meshPhysicalMaterial color="#e6f5ff" transmission={0.9} thickness={0.05} roughness={0.02} clearcoat={1} transparent opacity={0.9} /></mesh>
          {sink > 0.02 && <mesh position={[x, G[1] - 0.0055, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.04 + 0.06 * sink, 32]} /><meshStandardMaterial color="#5d584f" transparent opacity={0.6 * sink} roughness={1} /></mesh>}
        </group>);
      })()}
      {/* sellador en la ciudad: película transparente que brilla arriba de las calles */}
      {st.sealCity > 0.01 && [-0.5, 0.5].map((sx, i) => (
        <mesh key={"s" + i} position={[G[0] + sx * (CB + CS), G[1] - 0.005, G[2] + CF / 2 - (CB + CS) / 2]} geometry={rbox(CS, 0.004, (CF + CB + CS) * st.sealCity, 0.002)}><meshPhysicalMaterial color="#ffffff" roughness={0.02} clearcoat={1} transparent opacity={0.35} /></mesh>))}
    </group>
  );
};

// carrito de limpieza del hotel (estante, toallas, rociadores)
const Cart: React.FC = () => (
  <group position={[3.3, 0, 0.3]}>
    {[0.08, 0.48, 0.9].map((y) => <Box key={y} p={[0, y, 0]} s={[0.9, 0.035, 0.52]} c="#3b4148" r={0.5} m={0.3} rad={0.01} />)}
    {[[-0.43, -0.24], [0.43, -0.24], [-0.43, 0.24], [0.43, 0.24]].map(([x, z], i) => <mesh key={i} position={[x, 0.48, z]}><cylinderGeometry args={[0.012, 0.012, 0.86, 8]} /><meshStandardMaterial {...CHROME} roughness={0.2} /></mesh>)}
    {[[-0.43, -0.24], [0.43, -0.24], [-0.43, 0.24], [0.43, 0.24]].map(([x, z], i) => <mesh key={"w" + i} position={[x, 0.035, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.025, 16]} /><meshStandardMaterial color="#141414" roughness={0.6} /></mesh>)}
    {[0, 1, 2, 3].map((k) => <Box key={k} p={[-0.22, 0.53 + k * 0.05, 0]} s={[0.3, 0.045, 0.24]} c="#f4f2ec" r={0.98} rad={0.02} />)}
    {[0, 1, 2].map((k) => <Box key={"b" + k} p={[0.2, 0.13 + k * 0.05, 0.02]} s={[0.32, 0.045, 0.26]} c="#f2efe7" r={0.98} rad={0.02} />)}
    {/* el frasco marrón y el balde */}
    <group position={[0.22, 0.5, -0.1]}>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.035, 0.038, 0.18, 20]} /><meshPhysicalMaterial color="#5a2e12" roughness={0.25} clearcoat={0.8} /></mesh>
      <mesh position={[0, 0.1, 0.034]}><planeGeometry args={[0.05, 0.07]} /><meshStandardMaterial color="#f4f1e8" roughness={0.8} /></mesh>
      <Box p={[0, 0.21, 0.01]} s={[0.04, 0.06, 0.07]} c="#f0f0ea" r={0.4} rad={0.008} />
    </group>
    <mesh position={[0.25, 0.6, 0.12]}><cylinderGeometry args={[0.09, 0.07, 0.17, 24, 1, true]} /><meshStandardMaterial color="#2d6fb3" roughness={0.5} side={THREE.DoubleSide} /></mesh>
    <Box p={[0.46, 0.75, 0.05]} s={[0.012, 0.22, 0.16]} c="#e8c33a" r={0.95} rad={0.004} />
  </group>
);

const PAPER = "#cfc9be";
const Leaf: React.FC<{ ang: number; w: number; d: number; front?: THREE.Texture; back?: THREE.Texture; y: number }> = ({ ang, w, d, front, back, y }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) { const k = i % (N + 1), row = Math.floor(i / (N + 1)); pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group position={[0, y, 0]}>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color={PAPER} roughness={0.92} map={back} envMapIntensity={0.2} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color={PAPER} roughness={0.92} map={front} envMapIntensity={0.2} /></mesh>
    </group>
  );
};
// LA GUÍA (proporción real de la página 1700x2200); hijos = coordenadas de la página derecha
export const BW = 0.3, BD = BW * 2200 / 1700;
const Book: React.FC<{ p: V3; open: number; cover: THREE.Texture; inside: THREE.Texture; right: THREE.Texture; spine: string; children?: React.ReactNode }> = ({ p, open, cover, inside, right, spine, children }) => {
  const w = BW, d = BD, th = 0.03, ang = Math.PI * ease(open);
  return (
    <group position={p}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#d8d0bf" roughness={0.95} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[w / 2 + 0.0025, 0.009 + i * (th / 8), 0]}><boxGeometry args={[0.001, 0.0012, d - 0.01]} /><meshBasicMaterial color="#bfb39a" /></mesh>)}
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
      <group position={[0.004, 0.0065 + th, 0]}>{children}</group>
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.4} metalness={0.03} color="#e2ddd4" /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
};
export const Marker: React.FC<{ t: number; at: number; out?: number; box: [number, number, number, number]; col?: string }> = ({ t, at, out = 1e9, box, col = "#ffd60a" }) => {
  const a = ease((t - at) / 0.4), o = 1 - cl((t - out) / 0.3);
  if (a <= 0.01 || o <= 0.01) return null;
  const pw = BW - 0.01, pd = BD - 0.012;
  const [x0, y0, x1, y1] = box, ww = (x1 - x0) * pw * a, hh = (y1 - y0) * pd;
  return <mesh position={[(x0 - 0.5) * pw + ww / 2, 0.0009, (y0 - 0.5) * pd + hh / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[ww, hh]} /><meshBasicMaterial color={col} transparent opacity={0.6 * o} depthWrite={false} polygonOffset polygonOffsetFactor={-2} /></mesh>;
};
export const pagePt = (u: number, v: number): V3 => [PT.book[0] + 0.004 + (u - 0.5) * (BW - 0.01), PT.book[1] + 0.037, PT.book[2] + (v - 0.5) * (BD - 0.012)];

// la pantalla dentro del mundo: un azulejo grande de la pared que se vuelve video (lo pone Min1 encima con screenOf de sus 4 esquinas)
export const SCREEN = { c: [-0.2, 1.05, Z0 + 0.012] as V3, w: 0.6, h: 0.34 };

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  const dt = useDuchaTex();
  const { pg, ready } = useImgTex(["p001", "p018", "p019", "p052", "p053"]);
  const st = stateAt(t);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Kick h={ready} />
      <Post bloom={0.28} threshold={0.93} exposure={st.night ? 0.8 : 0.85} env={st.night ? 0.02 : 0.32} />
      <color attach="background" args={["#141a23"]} />
      <mesh><sphereGeometry args={[80, 32, 16]} /><meshBasicMaterial map={dt.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xdfe8f5, 0x2a2622, st.night ? 0.03 : 0.45]} />
      <directionalLight position={[4, 9, 7]} intensity={st.night ? 0.04 : 1.4} color="#fff3e2" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0003} />
      <pointLight position={[0.2, 2.25, -0.3]} intensity={st.night ? 0 : 2.2} distance={5} color="#ffe6c4" castShadow />
      <SpotT to={[-0.2, 0.4, -0.9]} position={[-0.95, 1.9, -0.35]} angle={0.9} penumbra={0.9} intensity={st.night ? 0.08 : 4} distance={4} color="#eef4ff" />
      {/* la LINTERNA del conserje (de noche) */}
      {st.night && <SpotT to={[-0.3 + 0.22 * Math.sin(t * 0.6), TRAY + 0.2, Z0]} position={[0.25, 0.45, 0.25]} angle={0.2} penumbra={0.5} intensity={5} distance={4} decay={1.2} color="#fff4dc" castShadow />}
      {/* rasante para la macro de la junta */}
      <SpotT to={PT.low} position={[0.3, TRAY + 0.3, Z0 + 0.4]} angle={0.5} penumbra={1} intensity={st.night ? 0.15 : 1.4} distance={1.2} color="#fff6e8" />

      {/* ===== EL BAÑO (frente abierto) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.002, 0]} receiveShadow><planeGeometry args={[3.2, 2.4]} /><meshStandardMaterial map={dt.floor} roughness={0.35} /></mesh>
      <Box p={[0.5, -0.1, 0]} s={[3.3, 0.2, 2.5]} c="#77787a" r={0.9} map={tx.concrete} rad={0.01} />
      <Box p={[(X0 + 0.56) / 2, TRAY / 2, (Z0 + 0.56) / 2]} s={[1.56, TRAY, 1.56]} c="#f7f6f2" r={0.2} rad={0.015} />
      <mesh position={[-0.22, TRAY + 0.001, -0.22]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.04, 32]} /><meshStandardMaterial {...CHROME} roughness={0.25} /></mesh>
      <Wall side={0} st={st} tex={dt} />
      <Wall side={1} st={st} tex={dt} />
      {/* resto de la pared del baño (pintada) a la derecha de la ducha */}
      <Box p={[1.33, 1.2, Z0 - 0.04]} s={[1.5, 2.4, 0.06]} c="#e8e2d6" r={0.9} rad={0.01} />
      <Box p={[2.05, 1.2, 0.3]} s={[0.08, 2.4, 0.6]} c="#e8e2d6" r={0.9} rad={0.01} />
      <Box p={[2.05, 1.2, -0.75]} s={[0.08, 2.4, 0.5]} c="#e8e2d6" r={0.9} rad={0.01} />
      {/* ventana esmerilada arriba */}
      <mesh position={[X0 + 0.012, 1.85, -0.3]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.42, 0.3]} /><meshStandardMaterial color="#f4f8ff" emissive="#eaf2ff" emissiveIntensity={st.night ? 0.05 : 0.9} roughness={0.9} /></mesh>
      <Shower on={st.water} t={t} />
      {/* el borde de silicona entre la pared y el plato */}
      <mesh position={[(X0 + 0.56) / 2, TRAY + 0.004, Z0 + 0.006]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.006, 0.006, 1.56, 8]} /><meshStandardMaterial color={new THREE.Color("#f2f1ec").lerp(new THREE.Color("#3a3832"), st.sil)} roughness={0.5} /></mesh>
      {/* el bol con la pasta y el cepillo en el borde del plato */}
      {st.bowl > 0.01 && <group position={[0.45, TRAY, 0.4]} scale={st.bowl}>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.07, 0.045, 0.06, 32, 1, true]} /><meshPhysicalMaterial color="#f6f5f1" roughness={0.15} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.062, 32]} /><meshStandardMaterial color="#faf8f2" roughness={0.85} /></mesh>
        <Box p={[0.1, 0.008, 0.02]} s={[0.16, 0.012, 0.016]} c="#3c8ed8" r={0.4} rad={0.005} rot={[0, 0.5, 0]} />
      </group>}

      {/* ===== LA CIUDAD: la junta en corte ===== */}
      <City st={st} t={t} tex={dt} />
      <SpotT to={[G[0], G[1] - 0.1, G[2] + CF - 0.4]} position={[G[0] + 1.5, G[1] + 2.6, G[2] + CF + 2.4]} angle={0.7} penumbra={0.8} intensity={14} distance={9} color="#fff4e4" castShadow />
      <pointLight position={[G[0] - 1.2, G[1] + 0.4, G[2] + CF + 1.0]} intensity={2.2} distance={5} color="#9fc8ff" />

      {/* ===== EL PASILLO del hotel con el carrito y LA GUÍA ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.4, 0.002, -0.1]} receiveShadow><planeGeometry args={[2.7, 3.4]} /><meshStandardMaterial map={dt.carpet} roughness={0.95} /></mesh>
      <Box p={[3.4, 1.3, -1.65]} s={[2.7, 2.6, 0.1]} c="#e9dcc0" r={0.9} map={dt.paper} rad={0.01} />
      <Box p={[3.4, 0.5, -1.59]} s={[2.7, 1.0, 0.03]} c="#5a3a26" r={0.6} rad={0.006} />
      <Box p={[4.2, 1.05, -1.585]} s={[0.9, 2.1, 0.05]} c="#6b432b" r={0.55} rad={0.01} />
      <Box p={[4.2, 1.75, -1.555]} s={[0.22, 0.09, 0.01]} c="#c9a35a" m={0.8} r={0.3} rad={0.003} />
      <pointLight position={[3.2, 2.1, -1.2]} intensity={2.6} distance={4} color="#ffd6a0" />
      <Cart />
      <SpotT to={PT.book} position={[3.3, 2.2, 0.9]} angle={0.5} penumbra={0.8} intensity={1.6} distance={4} color="#fff2dc" />
      <Book p={PT.book} open={st.bookOpen} cover={pg.p001} inside={st.p53 ? pg.p052_r : pg.p018_r} right={st.p53 ? pg.p053 : pg.p019} spine="#5b3920">
        {st.marks.map((m, i) => <Marker key={i} t={t} at={m.at} out={m.out} box={m.box} col={m.col} />)}
      </Book>
    </ThreeCanvas>
  );
};
void rbox;
