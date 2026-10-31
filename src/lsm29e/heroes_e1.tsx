// lsm29e · componentes únicos 1-7 (los moños en los bancos, cuarenta años del mismo álbum, los cisnes de servilleta, la foto que lo blanquea todo, el ojo que se va a ella, la cola de la madre del novio, el vestido azul de 22 bodas).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Candle } from "./tg";
import { Pew, Person } from "./xg";

const PI = Math.PI;
type V = [number, number, number];
export const mix = (a: string, b: string, k: number) => "#" + new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getHexString();

// moño de raso blanco: dos lazos, nudo y dos colas
export const Bow: React.FC<{ p?: V; s?: number; col?: string; ry?: number }> = ({ p = [0, 0, 0], s = 1, col = "#f7f4ee", ry = 0 }) => <group position={p} scale={s} rotation={[0, ry, 0]}>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.034, 0.01, 0]} rotation={[0, 0, k * 0.38]} scale={[1.55, 0.95, 0.55]}><sphereGeometry args={[0.024, 20, 14]} /><meshPhysicalMaterial color={col} roughness={0.32} sheen={1} sheenColor="#ffffff" clearcoat={0.4} /></mesh>)}
  <mesh scale={[1, 1.1, 0.8]}><sphereGeometry args={[0.015, 16, 12]} /><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.4} /></mesh>
  {[-1, 1].map((k) => <group key={"c" + k} position={[k * 0.012, -0.012, 0.006]} rotation={[0, 0, k * 0.42]}>
    <mesh position={[0, -0.05, 0]}><planeGeometry args={[0.02, 0.1]} /><meshPhysicalMaterial color={col} roughness={0.35} side={THREE.DoubleSide} sheen={1} /></mesh>
    {[-1, 1].map((j) => <mesh key={j} position={[j * 0.005, -0.1, 0]} rotation={[0, 0, j * 0.6]}><planeGeometry args={[0.01, 0.014]} /><meshPhysicalMaterial color={col} roughness={0.35} side={THREE.DoubleSide} /></mesh>)}
  </group>)}
</group>;

// vestido en percha: percha de madera, cuerpo y falda acampanada
export const Dress: React.FC<{ p?: V; col: string; s?: number; collar?: string; skirt?: number; jacket?: string; dots?: string; ry?: number }> = ({ p = [0, 0, 0], col, s = 1, collar, skirt = 1, jacket, dots, ry = 0 }) => <group position={p} scale={s} rotation={[0, ry, 0]}>
  <mesh position={[0, 0.06, 0]}><torusGeometry args={[0.025, 0.004, 8, 20, PI * 1.4]} />{M.steel()}</mesh>
  <mesh position={[0, 0.0, 0]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.008, 0.3, 6, 10]} />{M.wood({ base: [150, 100, 58] })}</mesh>
  <mesh position={[0, -0.13, 0]} castShadow><cylinderGeometry args={[0.1, 0.085, 0.26, 32]} /><meshPhysicalMaterial color={col} roughness={0.55} sheen={0.6} /></mesh>
  <mesh position={[0, -0.02, 0]}><sphereGeometry args={[0.1, 32, 12, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color={col} roughness={0.55} sheen={0.6} /></mesh>
  <mesh position={[0, -0.26 - 0.2 * skirt, 0]} castShadow><cylinderGeometry args={[0.085, 0.2 * skirt + 0.06, 0.4 * skirt, 40, 1, true]} /><meshPhysicalMaterial color={col} roughness={0.55} sheen={0.6} side={THREE.DoubleSide} /></mesh>
  {dots && Array.from({ length: 22 }, (_, i) => { const a = rn(i, 1) * PI * 2, y = rn(i, 2), r = 0.09 + y * (0.2 * skirt - 0.03);
    return <mesh key={i} position={[Math.cos(a) * (r + 0.004), -0.27 - y * 0.38 * skirt, Math.sin(a) * (r + 0.004)]} rotation={[0, -a + PI / 2, 0]}><circleGeometry args={[0.012, 10]} /><meshStandardMaterial color={dots} roughness={0.6} side={THREE.DoubleSide} /></mesh>; })}
  {collar && <mesh position={[0, 0.07, 0.0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.016, 10, 30]} /><meshStandardMaterial color={collar} roughness={0.6} /></mesh>}
  {jacket && <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.112, 0.105, 0.2, 32, 1, true, -PI * 0.85, PI * 1.7]} /><meshStandardMaterial color={jacket} roughness={0.7} transparent opacity={0.92} side={THREE.DoubleSide} /></mesh>}
</group>;

// ---- 0:04 · LOS MOÑOS EN LOS BANCOS: la cámara avanza por el pasillo de la iglesia; a cada banco le cae su moño blanco con su ramito, y al fondo se prenden las velas ----
export const HPewbows: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#2a2420" warm={0.75} key1={[0.6, 3.0, 1.0]}
  cam={{ at: [0, 0.6, -1.2], at1: [0, 0.7, -2.6], az: [0.12, -0.08], el: [0.16, 0.12], r: [2.6, 1.7], fov: 38 }}>{(tt) => {
  const lit = eio(tt, 3.6, 4.8);
  return <>
    {/* el pasillo: alfombra crema */}
    <mesh position={[0, 0.003, -1.5]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 6]} /><meshStandardMaterial color="#e8dcc4" roughness={0.95} /></mesh>
    {[0, 1, 2, 3, 4, 5].map((r) => [-1, 1].map((k) => { const z = 0.8 - r * 0.62, i = r * 2 + (k > 0 ? 1 : 0), b = phys(tt, 0.3 + r * 0.42 + (k > 0 ? 0.18 : 0), 7, 0.5);
      return <group key={r + "_" + k}>
        <Pew p={[k * 1.1, 0, z]} w={1.4} />
        <group visible={b > 0.01}>
          <Bow p={[k * 0.37, 0.9 + 0.25 * (1 - cl(b)), z + 0.02]} s={0.95 * Math.max(0.05, b)} ry={-k * 0.7} />
          {[-1, 0, 1].map((j) => <mesh key={"l" + j} position={[k * 0.37 + j * 0.028, 0.75 - Math.abs(j) * 0.01, z + 0.035]} rotation={[0, -k * 0.7, j * 0.8]} scale={[0.45 * Math.max(0.05, cl(b)), 1.5 * Math.max(0.05, cl(b)), 0.3 * Math.max(0.05, cl(b))]}><sphereGeometry args={[0.03, 12, 8]} /><meshStandardMaterial color="#4f8a36" roughness={0.6} /></mesh>)}
          {[0, 1, 2, 3].map((j) => <mesh key={j} position={[k * 0.37 + (j - 1.5) * 0.02, 0.8 + (j % 2) * 0.012, z + 0.045]} scale={Math.max(0.05, cl(b))}><sphereGeometry args={[0.017, 12, 10]} /><meshStandardMaterial color={["#f6f2ea", "#e8a6b4", "#f4ecd8", "#df93a6"][(i + j) % 4]} roughness={0.7} /></mesh>)}
          <mesh position={[k * 0.37, 0.72, z + 0.03]} scale={Math.max(0.05, cl(b))}><cylinderGeometry args={[0.004, 0.004, 0.12, 6]} /><meshStandardMaterial color="#4a6a3a" /></mesh>
        </group>
      </group>; }))}
    {/* el altar al fondo con sus velas */}
    <RBox s={[1.4, 0.9, 0.5]} r={0.02} p={[0, 0.45, -3.4]}>{M.wood({ base: [118, 76, 42] })}</RBox>
    <mesh position={[0, 0.905, -3.4]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.42, 0.52]} /><meshStandardMaterial color="#f4f0e6" roughness={0.9} /></mesh>
    {[-0.5, -0.3, 0.3, 0.5].map((x, i) => <Candle key={x} p={[x, 0.91, -3.4]} tt={tt + i} on={cl(lit * 4 - i * 0.6)} h={0.22} />)}
    <mesh position={[0, 1.6, -3.9]}><planeGeometry args={[3.6, 2.6]} /><meshStandardMaterial color="#d8cdb8" roughness={0.9} /></mesh>
    {/* la ventana alta con su luz */}
    <mesh position={[0, 1.9, -3.88]}><planeGeometry args={[0.5, 0.9]} />{M.glow({ col: "#fff1d0", op: 0.85 })}</mesh>
    <pointLight position={[0, 1.4, -3.1]} intensity={0.6 + 2.0 * lit} distance={3} color="#ffd8a0" />
  </>; }}</Scene3D>;

// la foto de grupo de la boda (para el álbum): escalinata, figuras de colores y UNA de marfil
const groupTex = (yr: number) => tex.text("ealb" + yr, 512, 360, (g) => {
  const sep = yr % 2 ? "#cdb894" : "#c8b28c";
  g.fillStyle = sep; g.fillRect(0, 0, 512, 360);
  g.fillStyle = "#9a8664"; g.fillRect(0, 230, 512, 130);
  for (let s = 0; s < 3; s++) { g.fillStyle = `rgba(90,72,50,${0.25 + s * 0.08})`; g.fillRect(0, 250 + s * 36, 512, 4); }
  const cols = ["#4a3a30", "#3a4048", "#5a4a3a", "#2e2e34", "#6a5a48", "#3e3a34", "#504438", "#383c44", "#5a5048"];
  for (let i = 0; i < 9; i++) {
    const x = 40 + i * 54, row = i % 2, y = 140 + row * 30, ivory = i === 7, bride = i === 4;
    g.fillStyle = bride || ivory ? "#fbf7ec" : cols[i]; g.beginPath(); g.moveTo(x - 18, y + 120); g.lineTo(x + 18, y + 120); g.lineTo(x + 11, y + 20); g.lineTo(x - 11, y + 20); g.fill();
    g.fillStyle = "#e7c9a8"; g.beginPath(); g.arc(x, y + 8, 11, 0, 7); g.fill();
    if (ivory) { const gr = g.createRadialGradient(x, y + 60, 10, x, y + 60, 70); gr.addColorStop(0, "rgba(255,214,110,.55)"); gr.addColorStop(1, "rgba(255,214,110,0)"); g.fillStyle = gr; g.fillRect(x - 70, y - 10, 140, 150); g.fillStyle = "#fbf7ec"; g.beginPath(); g.moveTo(x - 18, y + 120); g.lineTo(x + 18, y + 120); g.lineTo(x + 11, y + 20); g.lineTo(x - 11, y + 20); g.fill(); g.fillStyle = "#e7c9a8"; g.beginPath(); g.arc(x, y + 8, 11, 0, 7); g.fill(); g.strokeStyle = "#e0a828"; g.lineWidth = 6; g.beginPath(); g.ellipse(x, y + 60, 30, 78, 0, 0, 7); g.stroke(); }
  }
  g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(0, 0, 512, 360);
});
// ---- 0:24 · CUARENTA AÑOS DEL MISMO ÁLBUM: las hojas del álbum pasan solas, año tras año, y en cada foto la de marfil sigue ahí; el número del año corre de 1973 a 2013 ----
export const HAlbum40: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" warm={0.7}
  cam={{ at: [0, 0.03, 0], at1: [0.02, 0.03, 0.02], az: [-0.18, 0.12], el: [0.72, 0.6], r: [1.05, 0.85], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="40 YEARS OF THE SAME PICTURE" col={AMB} size={40} />}>{(tt) => {
  const fl = eio(tt, 0.6, 4.6) * 6, yr = 1973 + Math.round(fl / 6 * 40);
  return <>
    {/* tapas del álbum, blancas acolchadas */}
    <RBox s={[0.62, 0.02, 0.42]} r={0.01} p={[0, 0.01, 0]}><meshPhysicalMaterial color="#efe8da" roughness={0.6} sheen={0.5} /></RBox>
    <RBox s={[0.31, 0.012, 0.4]} r={0.004} p={[0.155, 0.026, 0]}><meshStandardMaterial color="#f6f1e6" roughness={0.9} /></RBox>
    <mesh position={[0.155, 0.033, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.24, 0.17]} /><meshStandardMaterial map={groupTex(1973 + 8 * Math.min(5, Math.floor(fl) + 1))} roughness={0.7} /></mesh>
    <RBox s={[0.31, 0.012, 0.4]} r={0.004} p={[-0.155, 0.026, 0]}><meshStandardMaterial color="#f6f1e6" roughness={0.9} /></RBox>
    <mesh position={[-0.155, 0.033, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.28, 0.2]} /><meshStandardMaterial map={groupTex(1973 + 8 * Math.floor(fl))} roughness={0.7} /></mesh>
    {/* la hoja que da vuelta (bisagra en el lomo) */}
    {(() => { const k = fl - Math.floor(fl), n = Math.floor(fl), a = eio(k, 0.1, 0.9), curl = Math.sin(PI * a) * 0.32, N = 10, w = 0.3 / N;
      // la hoja en 10 tiras encadenadas: cada una dobla un poco más, así la hoja se curva al pasar
      const strip = (j: number): React.ReactNode => j >= N ? null : <group position={[j ? w : 0, 0, 0]} rotation={[0, 0, j ? -curl / N * 2 : 0]}>
        <mesh position={[w / 2, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w * 1.02, 0.39]} /><meshStandardMaterial color={j % 2 ? "#f3eee2" : "#f6f1e6"} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        {strip(j + 1)}
      </group>;
      return <group position={[0, 0.036, 0]} rotation={[0, 0, -PI * a + curl * 0.5]} visible={n < 6}>{strip(0)}</group>; })()}
    {/* el año, en una tarjetita de cartón al costado */}
    <mesh position={[0, 0.012, -0.3]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.22, 0.1]} /><meshStandardMaterial map={tex.text("eyr" + yr, 256, 128, (g) => { g.fillStyle = "#f3ead6"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#3a2a1e"; g.font = "900 84px Georgia"; g.textAlign = "center"; g.fillText(String(yr), 128, 100); })} roughness={0.85} /></mesh>
    <pointLight position={[0.0, 0.5, 0.3]} intensity={1.2} distance={1.6} color="#ffe2b8" />
  </>; }}</Scene3D>;

// cisne de servilleta: cuerpo, cola y cuello plegado
const neck = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.04, 0.02, 0), new THREE.Vector3(0.07, 0.07, 0), new THREE.Vector3(0.06, 0.13, 0), new THREE.Vector3(0.085, 0.15, 0)]), 20, 0.009, 8, false);
const Swan: React.FC<{ p: V; s: number; ry?: number }> = ({ p, s, ry = 0 }) => <group position={p} scale={s} rotation={[0, ry, 0]}>
  <mesh position={[0, 0.03, 0]} scale={[1.3, 0.7, 0.8]} castShadow><sphereGeometry args={[0.05, 20, 14]} /><meshStandardMaterial color="#fbf9f4" roughness={0.85} /></mesh>
  <mesh position={[-0.06, 0.05, 0]} rotation={[0, 0, 0.9]}><coneGeometry args={[0.03, 0.07, 4]} /><meshStandardMaterial color="#f6f3ec" roughness={0.85} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[0, 0.045, k * 0.028]} rotation={[k * 0.5, 0, 0.3]} scale={[1.4, 0.4, 0.6]}><sphereGeometry args={[0.035, 14, 10]} /><meshStandardMaterial color="#f2eee6" roughness={0.85} /></mesh>)}
  <mesh geometry={neck} castShadow><meshStandardMaterial color="#fbf9f4" roughness={0.85} /></mesh>
</group>;
// ---- 0:52 · MÁS CISNES DE LOS QUE PUEDO CONTAR: una servilleta cuadrada se dobla en triángulo y se vuelve cisne; detrás aparecen fila tras fila hasta perderse ----
export const HSwans: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2e2a26" warm={0.8}
  cam={{ at: [0, 0.05, 0], at1: [0, 0.05, -0.8], az: [0.3, 0.12], el: [0.34, 0.3], r: [0.65, 2.1], fov: 34 }}>{(tt) => {
  const fold = eio(tt, 0.4, 1.4), turn = eio(tt, 1.4, 2.0), rows = eio(tt, 2.2, 5.6);
  return <>
    {/* el mantel largo */}
    <mesh position={[0, 0, -1.5]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.6, 4.4]} /><meshStandardMaterial color="#f1ece2" roughness={0.9} /></mesh>
    {/* la primera: cuadrado → triángulo → cisne */}
    <group visible={turn < 0.98}>
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, PI / 4]}><planeGeometry args={[0.16, 0.16]} /><meshStandardMaterial color="#fbf9f4" roughness={0.85} side={THREE.DoubleSide} transparent opacity={1 - turn} /></mesh>
      <group position={[0, 0.003, 0]} rotation={[0, PI / 4, 0]}>
        <mesh position={[0, 0, 0]} rotation={[-PI / 2 + PI * fold, 0, 0]}><shapeGeometry args={[new THREE.Shape([new THREE.Vector2(-0.08, 0), new THREE.Vector2(0.08, 0), new THREE.Vector2(0.08, 0.16)])]} /><meshStandardMaterial color="#f4f1ea" roughness={0.85} side={THREE.DoubleSide} transparent opacity={1 - turn} /></mesh>
      </group>
    </group>
    <group visible={turn > 0.02}><Swan p={[0, 0, 0]} s={Math.max(0.05, phys(tt, 1.5, 6, 0.5)) * 1.1} ry={-0.4} /></group>
    {/* las filas que siguen */}
    {Array.from({ length: 40 }, (_, i) => { const r = Math.floor(i / 5), c = i % 5, k = phys(tt, 2.2 + r * 0.42 + c * 0.05, 7, 0.5);
      return <group key={i} visible={k > 0.01 && rows > 0}><Swan p={[(c - 2) * 0.24, 0, -0.32 - r * 0.32]} s={Math.max(0.05, k)} ry={-0.4} /></group>; })}
    <pointLight position={[0.2, 0.6, 0.3]} intensity={1.4} distance={2.4} color="#ffe6c4" />
  </>; }}</Scene3D>;

// la foto revelada: los tres vestidos salen igual de blancos
const whitePhoto = tex.text("ewhitephoto", 512, 600, (g) => {
  g.fillStyle = "#f4f2ec"; g.fillRect(0, 0, 512, 600);
  g.fillStyle = "#6a625a"; g.fillRect(28, 28, 456, 456);
  g.fillStyle = "#857a6c"; g.fillRect(28, 380, 456, 104);
  for (let i = 0; i < 3; i++) { const x = 110 + i * 146; g.fillStyle = "#fffefa"; g.beginPath(); g.moveTo(x - 46, 400); g.lineTo(x + 46, 400); g.lineTo(x + 22, 170); g.lineTo(x - 22, 170); g.fill(); g.fillStyle = "#e9c8a6"; g.beginPath(); g.arc(x, 150, 22, 0, 7); g.fill();
    g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.arc(x, 290, 70, 0, 7); g.fill(); }
});
// ---- 2:03 · EN LA FOTO TODO CUENTA: el perchero con los tres «no cuenta» (crema, blanco con flores azules, saco de encaje sobre negro) y al lado la foto que se revela: salen los tres blancos ----
export const HFlashwhite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.7}
  cam={{ at: [0.15, 0.95, 0], at1: [0.35, 0.95, 0], az: [-0.2, 0.08], el: [0.06, 0.04], r: [2.1, 1.85], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="IN THE PICTURES IT ALL COUNTS" col={AMB} size={40} />}>{(tt) => {
  const dev = eio(tt, 1.6, 4.0), slide = eio(tt, 0.8, 1.6);
  return <>
    {/* el perchero */}
    <mesh position={[-0.3, 1.42, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 1.1, 12]} />{M.chrome()}</mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[-0.3 + k * 0.55, 0.71, 0]}><cylinderGeometry args={[0.012, 0.012, 1.42, 12]} />{M.chrome()}</mesh>)}
    <Dress p={[-0.66, 1.4, 0]} col="#efe4cc" s={1.15} />
    <Dress p={[-0.3, 1.4, 0]} col="#fbfaf6" s={1.15} dots="#5a7ab8" />
    <Dress p={[0.06, 1.4, 0]} col="#121216" s={1.15} jacket="#f6f2ea" />
    {/* la foto que se revela al lado */}
    <group position={[lerp(0.9, 0.62, slide), 0.95, 0.2]} rotation={[0, -0.25, 0.05]}>
      <RBox s={[0.36, 0.42, 0.006]} r={0.002}><meshStandardMaterial color="#f4f2ec" roughness={0.8} /></RBox>
      <mesh position={[0, 0, 0.0035]}><planeGeometry args={[0.36, 0.42]} /><meshStandardMaterial map={whitePhoto} roughness={0.7} transparent opacity={dev} /></mesh>
      <mesh position={[0, 0.03, 0.0032]}><planeGeometry args={[0.32, 0.32]} /><meshStandardMaterial color="#2a2826" roughness={0.6} transparent opacity={0.9 * (1 - dev)} /></mesh>
    </group>
    <spotLight position={[0.6, 2.2, 1.4]} target-position={[0.62, 0.95, 0.2]} angle={0.3} penumbra={0.8} intensity={4} distance={4} color="#fff2dc" />
  </>; }}</Scene3D>;

// ---- 2:17 · EL OJO SE VA DIRECTO A ELLA: la foto de grupo en la escalinata de la iglesia; todos se apagan de a poco y la de marfil queda sola en la luz ----
export const HEyegoes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#8a96a6" warm={0.85} key1={[1.0, 3.0, 2.4]}
  cam={{ at: [0, 0.75, 0], at1: [0.48, 0.82, -0.2], az: [-0.1, 0.18], el: [0.12, 0.1], r: [2.9, 1.7], fov: 34 }}>{(tt) => {
  const dim = eio(tt, 1.2, 3.0);
  const COL = ["#3a4250", "#5a4436", "#2f3a46", "#6a5a48", "#46424a", "#3d4a3a", "#584a40", "#36404c"];
  return <>
    {/* la escalinata y la fachada blanca */}
    {[0, 1, 2].map((s) => <RBox key={s} s={[3.2, 0.12, 0.42]} r={0.01} p={[0, 0.06 + s * 0.12, -s * 0.36]}><meshStandardMaterial color={mix("#cfcbc2", "#2a2826", dim * 0.8)} roughness={0.9} /></RBox>)}
    <mesh position={[0, 1.4, -1.0]}><planeGeometry args={[3.6, 2.6]} /><meshStandardMaterial color={mix("#f1eee6", "#24221f", dim * 0.8)} roughness={0.9} /></mesh>
    <RBox s={[0.9, 1.5, 0.05]} r={0.02} p={[0, 0.98, -0.97]}>{M.wood({ base: [96, 60, 34] })}</RBox>
    {/* el grupo: los novios al centro (ella de blanco), la de marfil a un costado */}
    {COL.map((c, i) => { const x = -1.05 + i * 0.3, row = i % 2, z = -row * 0.36, y = row * 0.12;
      return <Person key={i} p={[x, 0.12 + y, z + 0.05]} s={0.78} coat={mix(c, "#0c0c0e", dim * 0.85)} hair={mix(["#3a2a22", "#d8d4cc", "#6a5a4a"][i % 3], "#121212", dim * 0.85)} />; })}
    <Person p={[-0.15, 0.12, 0.08]} s={0.8} coat={mix("#fbf8f0", "#3a3834", dim * 0.8)} hair="#7a5a3a" />
    <group position={[0.48, 0.24, -0.28]}>
      <Person s={0.78} coat="#f6eedb" hair="#b08a5a" />
      {/* el sombrerito con velo */}
      <mesh position={[0, 0.83, 0]}><cylinderGeometry args={[0.1, 0.1, 0.012, 24]} /><meshStandardMaterial color="#f6eedb" roughness={0.6} /></mesh>
      <mesh position={[0, 0.78, 0.02]}><sphereGeometry args={[0.09, 20, 12, 0, PI * 2, 0, PI * 0.5]} /><meshStandardMaterial color="#fffaf0" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
    </group>
    <mesh position={[0.48, 1.4, -0.28]}><coneGeometry args={[0.32, 2.4, 32, 1, true]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.1 * dim} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
    <mesh position={[0.48, 0.245, -0.28]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.3, 40]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.4 * dim} depthWrite={false} toneMapped={false} /></mesh>
    <pointLight position={[0.48, 1.1, 0.25]} intensity={0.2 + 2.6 * dim} distance={1.4} color="#fff2dc" />
  </>; }}</Scene3D>;

// ---- 3:03 · LA COLA: la madre del novio baja por el pasillo y la cola champán se le desenrolla detrás, banco tras banco, hasta la puerta ----
export const HTrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#2c2622" warm={0.8} key1={[0.4, 3.0, 1.6]}
  cam={{ at: [0, 0.2, -1.6], at1: [0, 0.2, -1.35], az: [0.42, 0.5], el: [1.05, 0.95], r: [4.6, 4.2], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="A TRAIN… ON THE MOTHER OF THE GROOM" col={AMB} size={36} />}>{(tt) => {
  const walk = eio(tt, 0.3, 5.2), z = lerp(-2.2, -0.7, walk), len = Math.max(0.05, z + 2.85);
  return <>
    <mesh position={[0, 0.002, -1.0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 4.4]} /><meshStandardMaterial color="#7a2228" roughness={0.95} /></mesh>
    {[0, 1, 2, 3, 4, 5].map((r) => [-1, 1].map((k) => <Pew key={r + "_" + k} p={[k * 1.1, 0, 0.9 - r * 0.62]} w={1.4} />))}
    {/* la cola: un paño de raso que va desde ella hasta la puerta */}
    <mesh position={[0, 0.006, z - 0.08 - len / 2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.56, len, 1, 24]} /><meshPhysicalMaterial color="#b8925a" emissive="#8a6a3a" emissiveIntensity={0.2} roughness={0.28} sheen={1} sheenColor="#ffe6b0" clearcoat={0.6} /></mesh>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <mesh key={i} position={[0.0, 0.008, z - 0.2 - i * len / 8]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.014]} /><meshBasicMaterial color="#e8cc90" transparent opacity={0.55} /></mesh>)}
    <Person p={[0, 0.01 * Math.abs(Math.sin(tt * 3.4)), z]} s={1.15} coat="#f4ead6" hair="#a88458" />
    <pointLight position={[0, 1.2, z - 0.6]} intensity={1.8} distance={2.4} color="#ffe6c4" />
    <mesh position={[0, 0.3, z - 0.05]}><cylinderGeometry args={[0.15, 0.22, 0.6, 32, 1, true]} /><meshPhysicalMaterial color="#f4ead6" roughness={0.3} sheen={1} side={THREE.DoubleSide} /></mesh>
    {/* la puerta del fondo, abierta */}
    <mesh position={[0, 1.1, -3.0]}><planeGeometry args={[1.0, 2.2]} />{M.glow({ col: "#f6e8cc", op: 0.9 })}</mesh>
  </>; }}</Scene3D>;

// ---- 3:39 · VEINTIDÓS BODAS, UN VESTIDO: el vestido azul marino con cuello blanco en la percha; a su lado se apilan las invitaciones de 22 bodas, una por año ----
export const HNavydress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.75}
  cam={{ at: [0.1, 0.85, 0], at1: [0.2, 0.75, 0], az: [-0.32, -0.12], el: [0.08, 0.14], r: [1.7, 1.45], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="ONE NAVY DRESS · 22 WEDDINGS" col={AMB} size={40} />}>{(tt) => {
  const n = Math.round(22 * eio(tt, 0.8, 4.6));
  return <>
    {/* la puerta del ropero abierta y el vestido colgado */}
    <RBox s={[0.06, 1.9, 0.6]} r={0.01} p={[-0.6, 0.95, -0.1]}>{M.wood({ base: [140, 96, 56] })}</RBox>
    <mesh position={[-0.12, 1.55, -0.2]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 1.0, 12]} />{M.brass()}</mesh>
    <Dress p={[-0.12, 1.52, -0.2]} col="#1c2846" collar="#f7f4ee" s={1.6} />
    {/* la cómoda y las invitaciones que se apilan */}
    <RBox s={[0.6, 0.62, 0.4]} r={0.015} p={[0.55, 0.31, 0]}>{M.wood({ base: [124, 80, 44] })}</RBox>
    {Array.from({ length: 22 }, (_, i) => { const k = phys(tt, 0.8 + i * 0.17, 8, 0.5);
      return <group key={i} visible={i < n || k > 0.6}><RBox s={[0.2, 0.006, 0.14]} r={0.002} p={[0.55 + 0.012 * (rn(i, 1) - 0.5), 0.627 + i * 0.007 + 0.2 * (1 - cl(k)), 0.012 * (rn(i, 2) - 0.5)]} rot={[0, 0.15 * (rn(i, 3) - 0.5), 0]}><meshStandardMaterial color={i % 3 ? "#f6f1e4" : "#efe6d2"} roughness={0.85} /></RBox></group>; })}
    {/* la cinta de la de arriba y el contador */}
    <mesh position={[0.82, 0.64, 0.12]} rotation={[-PI / 2, 0, -0.2]}><planeGeometry args={[0.15, 0.08]} /><meshStandardMaterial map={tex.text("enavy" + n, 256, 128, (g) => { g.fillStyle = "#f3ead6"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#1c2846"; g.font = "900 80px Georgia"; g.textAlign = "center"; g.fillText(String(n), 128, 98); })} roughness={0.85} /></mesh>
    <pointLight position={[0.2, 1.4, 0.6]} intensity={1.4} distance={2.6} color="#ffe2b8" />
  </>; }}</Scene3D>;
