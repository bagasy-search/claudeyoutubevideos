// lin01a · LOTE D: errores (14:05, 6 tramos) · ruedo (16:23) · perfume (17:30) · gatecheck (18:57). Mismas reglas: objeto físico
// con material real y sombra de contacto, el clip del momento hundido detrás (Stage), cámara en curva, golpe en la palabra exacta.
import React from "react";
import * as THREE from "three";
import { Stage, at } from "./base";
import { Esc, M, RBox, camA, canv, cl, edgeAlpha, fabricTex, geo, lerp, printTex, rn, spr, tubeG, Blob, Sombra } from "./k3d";
import { Calzado } from "./comps_a";
import { ribTex } from "./comps_b";
import { Caida, Lentes } from "./comps_c";
import type { Fi } from "./valija";

// ═════════ ERRORES: el carril de la puerta de embarque. Dos postes cromados con la cinta azul; el cartel del poste gira y
// cae de canto en la palabra (número rojo + 2-3 palabras), y el objeto del error cae en el carril. k=0 tiende la cinta. ═════════
const alfombra = () => canv("alfGate", 512, 512, (g) => {
  g.fillStyle = "#283550"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) for (let x = (y / 32) % 2 ? 16 : 0; x < 512; x += 32) { g.fillStyle = "#33436a"; g.beginPath(); g.moveTo(x + 16, y + 6); g.lineTo(x + 26, y + 16); g.lineTo(x + 16, y + 26); g.lineTo(x + 6, y + 16); g.fill(); }
  for (let i = 0; i < 14000; i++) { g.fillStyle = rn(i, 1) > 0.5 ? `rgba(160,180,220,${0.07 * rn(i, 2)})` : `rgba(5,8,20,${0.2 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 1.5, 1.5); }
  for (let i = 0; i < 26; i++) { const x = rn(i, 7) * 512, y = rn(i, 8) * 512, R = 40 + 90 * rn(i, 9), gr = g.createRadialGradient(x, y, 4, x, y, R); gr.addColorStop(0, `rgba(${rn(i, 10) > 0.5 ? '10,14,30' : '120,140,180'},${0.16 * rn(i, 11)})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - R, y - R, 2 * R, 2 * R); }
}, [6, 4.4]);
const Poste: React.FC<{ x: number }> = ({ x }) => <group position={[x, 0, 0]}>
  <mesh position={[0, 0.008, 0]} castShadow receiveShadow><cylinderGeometry args={[0.085, 0.09, 0.016, 40]} />{M.chrome()}</mesh>
  <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.016, 0.016, 0.48, 24]} />{M.chrome()}</mesh>
  <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.027, 0.024, 0.055, 24]} />{M.chrome()}</mesh>
</group>;
const cinta = () => canv("cinta", 256, 32, (g) => { g.fillStyle = "#1f3c8a"; g.fillRect(0, 0, 256, 32); g.fillStyle = "#3a5cb0"; g.fillRect(0, 2, 256, 3); g.fillRect(0, 27, 256, 3); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${0.12 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 32, 2, 1); } }, [6, 1]);
const ERR: [string, string, string][] = [["5", "MISTAKES", "AT THE GATE"], ["1", "BOTH HANDS", "FULL"], ["2", "BIG", "SUN HAT"], ["3", "BACKPACK", "SWING"], ["4", "HEAVY COAT", "OVERHEAD"], ["5", "LONG", "DANGLING"]];
const cartel = (k: number) => printTex("errC" + k, 600, 400, "#f6f2ea", [[ERR[k][1], 206, 160, ERR[k][1].length > 7 ? 50 : 70, "#1b2438", "900"], [ERR[k][2], 206, 252, ERR[k][2].length > 9 ? 46 : 58, "#1b2438", "800"]], (g) => {
  g.fillStyle = "#1f3c8a"; g.fillRect(0, 0, 600, 34); g.fillRect(0, 366, 600, 34);
  g.fillStyle = "#c62a22"; g.beginPath(); g.arc(108, 200, 78, 0, 6.3); g.fill();
  g.fillStyle = "#fff"; g.font = "900 112px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ERR[k][0], 108, 206); g.textAlign = "start";
});
const strawTex = () => canv("paja", 256, 256, (g) => {
  g.fillStyle = "#d9b779"; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 8) for (let x = 0; x < 256; x += 8) { g.fillStyle = (x / 8 + y / 8) % 2 ? "#c49e5c" : "#e8cc92"; g.fillRect(x + 1, y + 1, 6, 6); }
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(90,60,20,${0.15 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 256, 3, 1); }
}, [8, 3]);
const Sombrero: React.FC = () => {
  const g = geo("sombrero2", () => new THREE.LatheGeometry([[0.001, 0.12], [0.06, 0.118], [0.085, 0.1], [0.092, 0.03], [0.1, 0.012], [0.19, 0.006], [0.215, 0.0], [0.216, -0.006], [0.19, 0.0], [0.1, 0.006], [0.09, 0.022]].map(([x, y]) => new THREE.Vector2(x, y)), 72));
  return <group><mesh geometry={g} castShadow receiveShadow><meshStandardMaterial map={strawTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.042, 0]}><cylinderGeometry args={[0.0935, 0.0945, 0.026, 64, 1, true]} /><meshStandardMaterial color="#1b1b1f" roughness={0.6} side={THREE.DoubleSide} /></mesh></group>;
};
const Mochila: React.FC = () => <group>
  <RBox s={[0.26, 0.32, 0.13]} r={0.05} p={[0, 0.16, 0]}><meshStandardMaterial map={fabricTex("navy", [1.4, 1.6])} color="#3c5b8c" roughness={0.85} /></RBox>
  <RBox s={[0.2, 0.13, 0.05]} r={0.03} p={[0, 0.1, 0.075]}><meshStandardMaterial map={fabricTex("navy", [1, 0.7])} color="#2f4a75" roughness={0.85} /></RBox>
  <mesh position={[0, 0.168, 0.1]}><boxGeometry args={[0.17, 0.006, 0.004]} />{M.steel({ col: "#9aa2aa" })}</mesh>
  <mesh position={[0.07, 0.168, 0.103]}><boxGeometry args={[0.016, 0.022, 0.006]} />{M.steel()}</mesh>
  <mesh geometry={tubeG("mochA", [[-0.07, 0.3, -0.06], [-0.09, 0.2, -0.1], [-0.08, 0.04, -0.07]], 0.012, 40, 10)} castShadow><meshStandardMaterial color="#1c2942" roughness={0.8} /></mesh>
  <mesh geometry={tubeG("mochB", [[0.07, 0.3, -0.06], [0.09, 0.2, -0.1], [0.08, 0.04, -0.07]], 0.012, 40, 10)} castShadow><meshStandardMaterial color="#1c2942" roughness={0.8} /></mesh>
  <mesh position={[0, 0.33, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.025, 0.006, 8, 24, Math.PI]} /><meshStandardMaterial color="#1c2942" roughness={0.8} /></mesh>
</group>;
const Campera: React.FC<{ sq?: number }> = ({ sq = 0 }) => <group scale={[1 + 0.08 * sq, 1 - 0.14 * sq, 1 + 0.05 * sq]}>
  {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0.03 + i * 0.048, 0.012 * (i % 2)]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow><capsuleGeometry args={[0.03, 0.28, 8, 20]} /><meshStandardMaterial color="#4a5236" roughness={0.45} metalness={0.05} /></mesh>)}
  <mesh position={[0.0, 0.215, -0.02]} rotation={[0.3, 0, Math.PI / 2]}><capsuleGeometry args={[0.022, 0.16, 6, 16]} /><meshStandardMaterial color="#5a4a36" roughness={0.95} /></mesh>
</group>;
const Manos: React.FC = () => <group>
  {/* la cartera (foto recortada con espesor) a la izquierda, el café a la derecha, separados; la campera va colgada de la cinta */}
  <group position={[-0.17, 0.0, -0.06]} rotation={[1.3, 0.25, 0]}><Blob w={0.34} d={0.16} o={0.6} y={0.001} /><Calzado img="g10b_bolso" L={0.36} capas={8} esp={0.004} suela="#3a2416" /></group>
  <group position={[0.24, 0, 0.04]}><Blob w={0.13} d={0.13} o={0.65} />
    <mesh position={[0, 0.075, 0]} castShadow><cylinderGeometry args={[0.048, 0.038, 0.15, 32]} />{M.porcelain({ col: "#efe6d6" })}</mesh>
    <mesh position={[0, 0.155, 0]}><cylinderGeometry args={[0.051, 0.051, 0.014, 32]} />{M.plastic({ col: "#2b2b2f" })}</mesh>
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.0485, 0.044, 0.045, 32, 1, true]} /><meshStandardMaterial color="#8a5a34" roughness={0.9} /></mesh>
  </group>
</group>;
const Saco: React.FC = () => {
  // la campera colgada sobre la cinta: dos paños que caen a cada lado, con cuello y botones
  const mat = <meshStandardMaterial map={fabricTex("lino", [0.8, 1.2])} color="#8d7a5c" roughness={0.92} side={THREE.DoubleSide} />;
  return <group position={[0.02, 0, 0]}>
    <mesh castShadow geometry={cintaG("sacoA", [[0, 0.5, 0], [0, 0.47, 0.04], [0, 0.32, 0.07], [0, 0.16, 0.08]], 0.24)}>{mat}</mesh>
    <mesh castShadow geometry={cintaG("sacoB", [[0, 0.5, 0], [0, 0.47, -0.04], [0, 0.34, -0.06], [0, 0.22, -0.06]], 0.24)}>{mat}</mesh>
    {[0.38, 0.3, 0.22].map((y) => <mesh key={y} position={[0.06, y, 0.075 + 0.004 * (0.4 - y) * 10]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.009, 0.005, 16]} /><meshStandardMaterial color="#3a2a1a" roughness={0.5} /></mesh>)}
    <mesh position={[0, 0.505, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.014, 0.22, 6, 12]} /><meshStandardMaterial color="#6e5e45" roughness={0.9} /></mesh>
  </group>;
};
// cinta de tela que sigue una curva (bufanda): ancho w a lo largo de x local
const cintaG = (key: string, pts: number[][], w: number) => geo("cintaG" + key, () => {
  const c = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z))), n = 60, P: number[] = [], U: number[] = [], I: number[] = [];
  for (let i = 0; i <= n; i++) { const q = c.getPoint(i / n), tg = c.getTangent(i / n), side = new THREE.Vector3(0, 0, 1).cross(tg).normalize().multiplyScalar(w / 2); P.push(q.x - side.x, q.y - side.y, q.z - side.z, q.x + side.x, q.y + side.y, q.z + side.z); U.push(0, i / n * 6, 1, i / n * 6); if (i < n) { const k = i * 2; I.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I); g.computeVertexNormals(); return g;
});
const Bufanda: React.FC<{ t: number }> = ({ t }) => {
  // la bufanda larga colgada de la cinta: dos puntas con ondas de pliegue que se balancean y casi barren la alfombra
  const sw = 0.05 * Math.sin(t * 2.2), q = Math.round(sw * 300);
  const mat = <meshStandardMaterial map={fabricTex("lana", [0.4, 2])} color="#b3392f" roughness={0.95} side={THREE.DoubleSide} />;
  const pts = (sg: number, L: number) => Array.from({ length: 9 }, (_, i) => { const u = i / 8; return [0.012 * Math.sin(u * 14 + sg) + sw * u * u * (sg > 0 ? 1 : 1.3), 0.5 - L * u, sg * (0.012 + 0.05 * Math.sin(u * 2.2)) + 0.008 * Math.sin(u * 11)]; });
  const eA = pts(1, 0.42)[8], eB = pts(-1, 0.34)[8];
  return <group>
    <mesh castShadow geometry={cintaG("bA" + q, pts(1, 0.42), 0.1)}>{mat}</mesh>
    <mesh castShadow geometry={cintaG("bB" + q, pts(-1, 0.34), 0.1)}>{mat}</mesh>
    {[eA, eB].map((e, i) => <group key={i} position={e as [number, number, number]}>{Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[-0.045 + j * 0.011, -0.025, 0]}><cylinderGeometry args={[0.0016, 0.0016, 0.05, 5]} /><meshStandardMaterial color="#8f2a22" roughness={1} /></mesh>)}</group>)}
  </group>;
};
export const Errores: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, k = f.k ?? 0;
  const belt = k === 0 ? spr(t, a + 0.1, 0.7, 1.5) : 1, flip = spr(t, wow - 0.08, 1.2, 1.25), drop = a + 0.75;
  const sq = k === 4 ? Math.max(0, Math.sin(cl((t - drop - 0.2) / 0.35) * Math.PI)) : 0;
  const sw = k === 3 ? Math.exp(-Math.max(0, t - drop) * 1.6) * Math.sin(Math.max(0, t - drop) * 7) : 0;
  const cam = camA(t, a, b, { p: [-0.46 + 0.06 * k, 0.86, 1.86], l: [0.06, 0.4, 0], fov: 33 }, { p: [0.3 - 0.05 * k, 0.74, 1.66], l: [0.08, 0.4, 0], fov: 33 });
  return <Stage t={t} a={a} b={b} dim={0.68} tint="#cfe0ff">
    <Esc cam={cam} key1={[-1.1, 2.0, 1.4]} warm={1.05} cool={1.1}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4.4, 3.2]} /><meshStandardMaterial map={alfombra()} roughness={0.96} alphaMap={edgeAlpha()} transparent /></mesh>
      <Poste x={-0.42} /><Poste x={0.42} />
      {belt > 0.02 && <mesh castShadow geometry={cintaG("belt" + Math.round(belt * 40), Array.from({ length: 9 }, (_, i) => { const u = i / 8, x = -0.405 + 0.81 * belt * u; return [x, 0.49 - 0.035 * belt * Math.sin(Math.PI * u), 0]; }), 0.045)}><meshStandardMaterial map={cinta()} roughness={0.55} side={THREE.DoubleSide} /></mesh>}
      {/* el cartel: un marco cromado sobre el poste de la derecha, gira desde plano y cae de canto en la palabra */}
      <group position={[0.42, 0.53, 0.0]}>
        <group rotation={[-(1 - flip) * 1.45, -0.18, 0]}>
          <RBox s={[0.33, 0.225, 0.012]} r={0.005} p={[0, 0.12, 0]}>{M.chrome()}</RBox>
          <mesh position={[0, 0.12, 0.0065]}><planeGeometry args={[0.3, 0.2]} /><meshStandardMaterial map={cartel(k)} roughness={0.7} /></mesh>
        </group>
      </group>
      {/* el error, en el carril */}
      <group position={[0.0, 0, 0.16]}>
        {k === 0 && <group>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[-0.3 + i * 0.15, 0.003, 0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={spr(t, wow + 0.15 * i, 1.4, 1.3)}><circleGeometry args={[0.045, 40]} /><meshStandardMaterial map={printTex("piso" + i, 128, 128, "#c62a22", [[String(i + 1), 40, 70, 80, "#fff", "900"]])} roughness={0.6} /></mesh>)}</group>}
        {k === 1 && <><Caida t={t} t0={drop} p={[0, 0, 0.06]} r={[0, 0.0, 0]} sc={1.1}><Manos /></Caida>{t > drop + 0.15 && <group position={[0, 0.5 * (1 - spr(t, drop + 0.15, 1, 1.4)), -0.16]}><Saco /></group>}</>}
        {k === 2 && <Caida t={t} t0={drop} p={[-0.04, 0, 0]} r={[0.05, 0, 0.04]} h={0.6} sc={1.15}><Blob w={0.5} d={0.5} o={0.5} /><Sombrero /></Caida>}
        {k === 3 && <Caida t={t} t0={drop} p={[-0.04, 0, 0]} r={[0, 0.4, 0]} sc={1.1}><group rotation={[0, sw * 0.9, sw * 0.18]}><Blob w={0.35} d={0.22} o={0.6} /><Mochila /></group></Caida>}
        {k === 4 && <Caida t={t} t0={drop} p={[-0.04, 0, 0]} r={[0, 0.25, 0]} h={0.7} sc={1.15}><Blob w={0.42} d={0.22} o={0.65} /><Campera sq={sq} /></Caida>}
        {k === 5 && t > drop - 0.3 && <group position={[0.0, 0.4 * (1 - spr(t, drop - 0.3, 1, 1.4)), -0.16]}><Blob w={0.2} d={0.16} o={0.4} y={-0.4 * (1 - spr(t, drop - 0.3, 1, 1.4)) + 0.001} /><Bufanda t={t} /></group>}
      </group>
      <Sombra w={2.4} d={1.5} o={0.35} y={0.001} />
    </Esc>
  </Stage>;
};

// ═════════ RUEDO: el piso del baño del avión, mojado. Una pierna de pantalón ancho arrastra el ruedo y el agua le sube
// por la tela; entra la del jogger con el puño elástico, que queda en el aire. En «touch that floor» la escuadra roja
// mide el hueco y se lee «NEVER TOUCHES». ═════════
const pisoBano = () => canv("pisoBano", 512, 512, (g) => {
  g.fillStyle = "#9ea4a8"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 128) for (let x = 0; x < 512; x += 128) { g.fillStyle = (x + y) / 128 % 2 ? "#a7adb1" : "#959b9f"; g.fillRect(x + 2, y + 2, 124, 124); }
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(40,45,50,${0.1 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 512, rn(i, 3) * 512, 1.5, 1.5); }
  const gr = g.createRadialGradient(190, 290, 10, 190, 290, 170); gr.addColorStop(0, "rgba(60,70,80,.55)"); gr.addColorStop(1, "rgba(60,70,80,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
}, [1, 1]);
const charco = () => canv("charcoR", 256, 256, (g) => { g.fillStyle = "#000"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#fff"; g.beginPath(); for (let i = 0; i <= 40; i++) { const an = i / 40 * 6.283, r = 90 + 22 * Math.sin(an * 3 + 1) + 10 * Math.sin(an * 7); g.lineTo(128 + r * Math.cos(an), 128 + r * 0.8 * Math.sin(an)); } g.fill(); }, [1, 1], false);
// mojado: alfa en degradé con borde irregular (la tela chupa el agua desde el ruedo); lv 0..12
const wetA = (lv: number) => canv("wetA" + lv, 64, 256, (g) => {
  g.fillStyle = "#000"; g.fillRect(0, 0, 64, 256); const h = 256 * (0.03 + 0.2 * lv / 12);
  // borde suave (degradé largo, ondulación leve): tela que chupa agua, no pintura
  for (let x = 0; x < 64; x++) { const top = 256 - h * (0.94 + 0.04 * Math.sin(x / 64 * 6.283 * 2 + 0.7)), gr = g.createLinearGradient(0, top - 46, 0, 256); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.45, "rgba(255,255,255,.7)"); gr.addColorStop(1, "#fff"); g.fillStyle = gr; g.fillRect(x, top - 46, 1, 256 - top + 46); }
}, [3, 1], false);
// charco: reflejo del techo claro (azul gris) con brillo especular y borde que relumbra
const charcoMap = () => canv("charcoMap2", 256, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#dfe7ee"); gr.addColorStop(0.55, "#9fb0bf"); gr.addColorStop(1, "#6f8193"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = "rgba(255,255,255,.75)"; g.beginPath(); g.ellipse(110, 96, 70, 9, -0.25, 0, 6.3); g.fill();
  g.fillStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.ellipse(150, 140, 40, 5, -0.25, 0, 6.3); g.fill();
  g.strokeStyle = "rgba(255,255,255,.45)"; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 40; i++) { const an = i / 40 * 6.283, r = 88 + 22 * Math.sin(an * 3 + 1) + 10 * Math.sin(an * 7); g.lineTo(128 + r * Math.cos(an), 128 + r * 0.8 * Math.sin(an)); } g.stroke();
});
const Charco: React.FC<{ w: number; d: number }> = ({ w, d }) => <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, d]} /><meshPhysicalMaterial map={charcoMap()} roughness={0.02} metalness={0.25} clearcoat={1} clearcoatRoughness={0} envMapIntensity={2.2} alphaMap={charco()} transparent depthWrite={false} /></mesh>;
const khakiTex = () => canv("khaki", 256, 256, (g) => { g.fillStyle = "#c2ab84"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 256; i += 3) { g.fillStyle = `rgba(90,70,40,${0.08 + 0.05 * rn(i, 1)})`; g.fillRect(0, i, 256, 1); } for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(255,240,210,${0.08 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 1, 2); } }, [3, 2]);
const ruedoG = () => geo("ruedoArr", () => {   // ruedo ancho que se apoya y se arruga contra el piso
  const g = new THREE.CylinderGeometry(0.1, 0.13, 0.62, 64, 24, true), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) + 0.31, an = Math.atan2(p.getZ(i), p.getX(i)), lo = Math.max(0, (0.32 - y) / 0.32);
    let k = 1 + (0.05 + 0.07 * lo) * Math.sin(an * 6 + 0.6) + 0.025 * Math.sin(an * 13 + y * 9);          // pliegues verticales que se abren abajo
    if (y < 0.08) { const w = (0.08 - y) / 0.08; k += 0.12 * w + 0.04 * Math.sin(an * 9) * w; p.setY(i, p.getY(i) - 0.012 * w * (1 + Math.sin(an * 5))); }
    p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k);
  }
  g.computeVertexNormals(); return g;
});
export const Ruedo: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, jog = at("Joggers with an elastic", a);
  const wet = cl((t - a - 0.3) / 3.2), jIn = spr(t, jog - 0.2, 0.9, 1.5), mk = spr(t, wow - 0.1, 1.3, 1.3);
  const cam = camA(t, a, b, { p: [-0.5, 0.5, 1.5], l: [0.06, 0.2, 0], fov: 32 }, { p: [0.4, 0.34, 1.3], l: [0.14, 0.13, 0], fov: 32 });
  return <Stage t={t} a={a} b={b} dim={0.7} tint="#d8e6f0">
    <Esc cam={cam} key1={[-0.6, 1.9, 1.1]} warm={0.95} cool={1.25}>
      {/* piso mojado: semitransparente para que se vea el reflejo de la pierna ancha debajo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3.4, 2.4]} /><meshPhysicalMaterial map={pisoBano()} roughness={0.22} clearcoat={0.9} clearcoatRoughness={0.1} alphaMap={edgeAlpha()} transparent opacity={0.86} depthWrite={false} /></mesh>
      <group position={[-0.17, -0.31, 0.02]} scale={[1, -1, 1]}>
        <mesh geometry={ruedoG()}><meshStandardMaterial map={khakiTex()} color="#8a8580" roughness={0.6} side={THREE.DoubleSide} transparent opacity={0.55} /></mesh>
      </group>
      {/* los charcos: espejos de agua (reflejo claro, brillo y borde), lejos de la sombra de la zapatilla */}
      <group position={[-0.19, 0.0015, 0.06]}><Charco w={0.66} d={0.52} /></group>
      <group position={[-0.5, 0.0012, 0.32]} rotation={[0, 0.7, 0]}><Charco w={0.22} d={0.15} /></group>
      {/* gotas que caen del ruedo al charco, y las ondas que abren al tocar */}
      {[0, 1, 2].map((i) => { const ph = ((t - a) * 0.8 + i / 3) % 1, x = -0.17 + 0.13 * Math.cos(i * 2.1 + 0.5), z = 0.02 + 0.13 * Math.sin(i * 2.1 + 0.5); return <group key={i}>
        <mesh position={[x, 0.03 * (1 - ph), z]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.004, 10, 8]} />{M.water({ op: 0.8 * (1 - ph) })}</mesh>
        {[0, 0.35].map((dl) => { const q = ((ph + 1 - dl) % 1); return <mesh key={dl} position={[x, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]} scale={0.006 + 0.07 * q}><ringGeometry args={[0.85, 1, 40]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.55 * (1 - q)} depthWrite={false} toneMapped={false} /></mesh>; })}
      </group>; })}
      {/* pierna ancha: pantalón de verdad (raya, costura, dobladillo); el agua sube por la tela (la misma tela, más oscura) */}
      <group position={[-0.17, 0.31, 0.02]}>
        <mesh geometry={ruedoG()} castShadow receiveShadow><meshStandardMaterial map={khakiTex()} roughness={0.92} side={THREE.DoubleSide} /></mesh>
        <mesh geometry={ruedoG()} scale={[1.006, 1, 1.006]}><meshPhysicalMaterial map={khakiTex()} color="#8a8580" roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.25} alphaMap={wetA(Math.round(wet * 12))} transparent depthWrite={false} side={THREE.DoubleSide} /></mesh>
        {/* costura del costado y raya planchada del frente */}
        <mesh position={[0.118, -0.02, 0.0]} rotation={[0, 0, 0.05]}><boxGeometry args={[0.003, 0.56, 0.003]} /><meshStandardMaterial color="#8f7a56" roughness={0.9} /></mesh>
        <mesh position={[0.0, 0.0, 0.112]} rotation={[0.05, 0, 0]}><boxGeometry args={[0.004, 0.5, 0.004]} /><meshStandardMaterial color="#d6c39e" roughness={0.8} /></mesh>
        {/* pespunte del dobladillo */}
        <mesh position={[0, -0.255, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.14, 0.0018, 6, 64]} /><meshStandardMaterial color="#6d5d44" roughness={0.9} /></mesh>
      </group>
      {/* pierna del jogger: puño elástico acanalado, la zapatilla debajo, el ruedo NUNCA llega al piso */}
      <group position={[0.2, 0.0, 0.04 - 0.9 * (1 - jIn)]}>
        <group position={[0, 0.12, 0]}>
                    <mesh position={[0, 0.27, 0]} castShadow><cylinderGeometry args={[0.085, 0.06, 0.5, 48, 1, true]} /><meshStandardMaterial map={fabricTex("jersey", [1.5, 2])} color="#8d9095" roughness={0.97} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.0, 0]} castShadow><cylinderGeometry args={[0.064, 0.054, 0.075, 48, 1, true]} /><meshStandardMaterial map={ribTex()} color="#b0b2b6" roughness={0.97} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, -0.037, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.054, 0.006, 8, 48]} /><meshStandardMaterial color="#7f8186" roughness={0.97} /></mesh>
        </group>
        <group position={[0, 0.0, 0.03]} rotation={[0, 0.25, 0]}><Blob w={0.16} d={0.32} o={0.65} />
          <RBox s={[0.1, 0.028, 0.27]} r={0.012} p={[0, 0.014, 0.03]}>{M.rubber({ col: "#ece8df" })}</RBox>
          <mesh position={[0, 0.006, 0.03]}><boxGeometry args={[0.102, 0.004, 0.272]} /><meshStandardMaterial color="#9a958c" roughness={0.9} /></mesh>
          <mesh position={[0, 0.045, 0.14]} castShadow><sphereGeometry args={[0.047, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e9e5dc" roughness={0.6} /></mesh>
          {[-1, 1].map((sg) => <mesh key={sg} position={[sg * 0.047, 0.05, 0.03]} rotation={[0, sg * Math.PI / 2, -0.25]}><planeGeometry args={[0.14, 0.012]} /><meshStandardMaterial color="#e9e5dc" roughness={0.6} side={THREE.DoubleSide} /></mesh>)}
          <RBox s={[0.03, 0.04, 0.012]} r={0.005} p={[0, 0.09, -0.1]}>{M.rubber({ col: "#2a3346" })}</RBox>
          <mesh position={[0, 0.05, 0.035]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.045, 0.16, 8, 20]} /><meshStandardMaterial map={fabricTex("jersey", [1, 1])} color="#6f7f99" roughness={0.8} /></mesh>
          {[0.06, 0.085, 0.11].map((z) => <mesh key={z} position={[0, 0.093, z]}><boxGeometry args={[0.05, 0.004, 0.006]} /><meshStandardMaterial color="#f4f1ea" roughness={0.8} /></mesh>)}
          <mesh position={[0, 0.07, -0.06]}><cylinderGeometry args={[0.046, 0.05, 0.06, 32]} /><meshStandardMaterial color="#d9c6ad" roughness={0.6} /></mesh>
        </group>
      </group>
      {/* la escuadra que mide el hueco: puño → piso, gruesa, al costado de la pierna */}
      {mk > 0.01 && <group position={[0.31, 0, 0.06 - 0.9 * (1 - jIn)]} scale={[1, mk, 1]}>
        <mesh position={[0, 0.042, 0]}><boxGeometry args={[0.012, 0.084, 0.012]} />{M.glow({ col: "#ff3b2e" })}</mesh>
        {[0.004, 0.081].map((y) => <mesh key={y} position={[-0.03, y, 0]}><boxGeometry args={[0.07, 0.01, 0.01]} />{M.glow({ col: "#ff3b2e" })}</mesh>)}
        {/* regla: marcas de medida a lo largo del hueco */}
        {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0.011, 0.0115 + i * 0.0115, 0]}><boxGeometry args={[i % 2 ? 0.01 : 0.018, 0.0025, 0.004]} />{M.glow({ col: "#ffd3cf" })}</mesh>)}
      </group>}
      {/* contraste: en la pierna ancha no hay hueco — una raya roja tachada donde la tela pisa el piso */}
      {mk > 0.01 && <mesh position={[-0.17, 0.004, 0.2]} rotation={[-Math.PI / 2, 0, 0]} scale={[mk, 1, 1]}><planeGeometry args={[0.3, 0.008]} />{M.glow({ col: "#ff3b2e" })}</mesh>}
      {/* el cartel parado al lado de la escuadra, de frente a cámara */}
      {mk > 0.01 && <group position={[0.46, 0.075 + 0.03 * (1 - mk), 0.1 - 0.9 * (1 - jIn)]} rotation={[0, -0.3, 0]} scale={lerp(0.6, 1, mk)}>
        <Blob w={0.26} d={0.06} o={0.5} y={-0.074} />
        <RBox s={[0.27, 0.085, 0.01]} r={0.005} p={[0, 0, 0]}>{M.porcelain({ col: "#f6f2ea" })}</RBox>
        <mesh position={[0, 0, 0.0055]}><planeGeometry args={[0.256, 0.074]} /><meshStandardMaterial map={printTex("never2", 560, 162, "#f6f2ea", [["NEVER TOUCHES", 30, 84, 50, "#c62a22", "900"]])} roughness={0.7} /></mesh>
        <mesh position={[-0.11, -0.06, 0]}><boxGeometry args={[0.006, 0.03, 0.006]} />{M.chrome()}</mesh><mesh position={[0.11, -0.06, 0]}><boxGeometry args={[0.006, 0.03, 0.006]} />{M.chrome()}</mesh>
      </group>}
    </Esc>
  </Stage>;
};

// ═════════ PERFUME: tres filas de asientos en corte. El atomizador del pasillo dispara; la nube rosada viaja hacia atrás,
// fila por fila: cada fila que alcanza enciende su número. En «three rows» la placa «3 ROWS» salta sobre la última. ═════════
const nube = () => canv("nube4", 128, 128, (g) => { for (let i = 0; i < 7; i++) { const x = 64 + 26 * Math.cos(i * 0.9) * (i ? 1 : 0), y = 64 + 18 * Math.sin(i * 0.9) * (i ? 1 : 0), R = i ? 26 : 34, gr = g.createRadialGradient(x, y, 2, x, y, R); gr.addColorStop(0, "rgba(255,186,214,.85)"); gr.addColorStop(0.6, "rgba(248,170,204,.4)"); gr.addColorStop(1, "rgba(245,165,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); } });
const Asiento: React.FC = () => <group>
  <RBox s={[0.2, 0.055, 0.19]} r={0.022} p={[0, 0.2, 0]}><meshStandardMaterial map={fabricTex("navy", [1, 1])} color="#6a86b8" roughness={0.9} /></RBox>
  <RBox s={[0.2, 0.32, 0.06]} r={0.028} p={[0, 0.37, -0.1]} rot={[-0.12, 0, 0]}><meshStandardMaterial map={fabricTex("navy", [1, 1.4])} color="#6a86b8" roughness={0.9} /></RBox>
  {/* costuras del respaldo y del almohadón */}
  {[0.3, 0.42].map((y) => <mesh key={y} position={[0, y, -0.065 + (y - 0.37) * 0.12]} rotation={[-0.12, 0, 0]}><boxGeometry args={[0.18, 0.003, 0.003]} /><meshStandardMaterial color="#38507e" roughness={0.9} /></mesh>)}
  <RBox s={[0.17, 0.075, 0.016]} r={0.006} p={[0, 0.49, -0.064]} rot={[-0.12, 0, 0]}><meshStandardMaterial color="#ece7dd" roughness={0.85} /></RBox>
  <RBox s={[0.14, 0.09, 0.012]} r={0.004} p={[0, 0.3, -0.135]} rot={[-0.12, 0, 0]}><meshStandardMaterial color="#2c3a58" roughness={0.9} /></RBox>
  <mesh position={[0, 0.09, -0.02]}><boxGeometry args={[0.02, 0.18, 0.02]} />{M.steel({ col: "#7d848c" })}</mesh>
</group>;
const FILAS = [0.32, -0.08, -0.48];
// boquilla (mundo) y dirección del chorro: hacia la fila 2, a ras de respaldo
const NZ = [0.05 - 0.0185 * Math.sin(0.5), 0.276 + 0.172, 0.36 - 0.0185 * Math.cos(0.5)], SD = (() => { const v = [-0.25 - NZ[0], 0.47 - NZ[1], -0.05 - NZ[2]], n = Math.hypot(...v); return v.map((x) => x / n); })();
// neblina del cono: densa en la boquilla, se abre y se pierde (gradiente a lo largo del eje, vetas)
const conoTex = () => canv("cono2", 64, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(255,240,246,.9)"); gr.addColorStop(0.55, "rgba(255,232,242,.5)"); gr.addColorStop(1, "rgba(255,230,240,.08)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${0.12 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 64, 0, 1.5, 256); } });
export const Perfume: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, sp = a + 0.15;
  const puff = spr(t, sp, 1.6, 1.2) * Math.max(0, 1 - (t - sp) * 0.55);
  const front = (t - sp) * 0.34;   // frente de la nube (m hacia atrás)
  const cam = camA(t, a, b, { p: [0.98, 0.98, 1.68], l: [-0.14, 0.28, -0.1], fov: 34 }, { p: [0.84, 0.92, 1.5], l: [-0.18, 0.3, -0.16], fov: 34 });
  const P = Array.from({ length: 70 }, (_, i) => {
    const t0 = sp + i * 0.04; if (t < t0) return null;
    const u = t - t0, z = 0.3 - Math.min(u * 0.4 + 0.05, 0.92) + (rn(i, 1) - 0.5) * 0.12, y = 0.47 + 0.05 * (rn(i, 2) - 0.5), x = -0.2 + (rn(i, 3) - 0.5) * (0.1 + 0.16 * Math.min(u, 1.5)), s = 0.11 + 0.08 * Math.min(u, 1.6);
    return <mesh key={i} position={[x, y, z]} scale={s}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={nube()} transparent opacity={0.85 * Math.min(1, u * 3) * Math.max(0, 1 - u / 7)} depthWrite={false} toneMapped={false} /></mesh>;
  });
  return <Stage t={t} a={a} b={b} dim={1.15} tint="#ffd6e6">
    <Esc cam={cam} key1={[0.9, 2.0, 1.2]} warm={1.05} cool={1}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.1]} receiveShadow><planeGeometry args={[4, 3.4]} /><meshStandardMaterial map={alfombra()} roughness={0.96} alphaMap={edgeAlpha()} transparent /></mesh>
      {FILAS.map((z, r) => {
        const lit = cl((front - (0.36 - z) + 0.15) / 0.2);
        return <group key={r} position={[0, 0, z]}>
          {[-0.33, -0.12].map((x) => <group key={x} position={[x, 0, 0]}><Blob w={0.26} d={0.26} o={0.5} /><Asiento /></group>)}
          {/* número de fila en el apoyabrazos del pasillo: se enciende cuando llega la nube */}
          <RBox s={[0.03, 0.03, 0.2]} r={0.008} p={[0.0, 0.26, 0]}>{M.plastic({ col: "#3a3f48" })}</RBox>
          {/* número de fila grande en el canto del respaldo del pasillo: se enciende rosa cuando llega la nube */}
          <group position={[0.005, 0.44, -0.08]} rotation={[0, Math.PI / 2 - 0.25, 0]}>
            <RBox s={[0.1, 0.1, 0.01]} r={0.008} p={[0, 0, 0]}>{M.plastic({ col: "#1d222b" })}</RBox>
            <mesh position={[0, 0, 0.0056]}><planeGeometry args={[0.088, 0.088]} /><meshStandardMaterial map={printTex("fila2" + r, 128, 128, "#1d222b", [[String(r + 1), 40, 70, 96, "#ffe3ef", "900"]])} emissive="#ff4f9a" emissiveIntensity={1.6 * lit} emissiveMap={printTex("fila2" + r, 128, 128, "#1d222b", [[String(r + 1), 40, 70, 96, "#ffe3ef", "900"]])} roughness={0.5} /></mesh>
          </group>
        </group>;
      })}
      {/* el atomizador sobre el apoyabrazos de la fila 1: frasco de vidrio con líquido, collar dorado, botón y boquilla */}
      <group position={[0.05, 0.276, 0.36]} rotation={[0, Math.PI + 0.5, 0]} scale={1.95}>
        <Blob w={0.08} d={0.05} o={0.6} y={0.001} />
        <RBox s={[0.055, 0.07, 0.032]} r={0.008} p={[0, 0.035, 0]}><meshPhysicalMaterial color="#ffe6f0" roughness={0.03} transmission={0.85} thickness={0.03} ior={1.5} clearcoat={1} /></RBox>
        <RBox s={[0.047, 0.045, 0.024]} r={0.006} p={[0, 0.026, 0]}><meshPhysicalMaterial color="#f29abf" roughness={0.1} transmission={0.4} thickness={0.02} /></RBox>
        <mesh position={[0, 0.076, 0]}><cylinderGeometry args={[0.011, 0.012, 0.012, 24]} />{M.brass()}</mesh>
        <mesh position={[0, 0.088 - 0.005 * puff, 0]}><cylinderGeometry args={[0.0095, 0.0095, 0.014, 24]} />{M.brass({ col: "#e8c27a" })}</mesh>
        <mesh position={[0, 0.088 - 0.005 * puff, 0.0095]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0018, 0.0018, 0.004, 8]} /><meshStandardMaterial color="#222" /></mesh>
      </group>
      {/* el chorro: gotitas finas en cono, sólo mientras dura el disparo */}
      {puff > 0.02 && <group position={[NZ[0] + SD[0] * 0.18, NZ[1] + SD[1] * 0.18, NZ[2] + SD[2] * 0.18]} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-SD[0], -SD[1], -SD[2]))}>
        <mesh><coneGeometry args={[0.1, 0.36, 32, 1, true]} /><meshBasicMaterial map={conoTex()} color="#ffe2ee" transparent opacity={0.95 * puff} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
      </group>}
      {puff > 0.02 && Array.from({ length: 60 }, (_, i) => { const u = ((t - sp) * 2.2 + rn(i, 4)) % 1, d = 0.02 + u * 0.36, sp2 = d * 0.2; return <mesh key={"c" + i} position={[NZ[0] + SD[0] * d + (rn(i, 5) - 0.5) * sp2, NZ[1] + SD[1] * d + (rn(i, 6) - 0.5) * sp2, NZ[2] + SD[2] * d + (rn(i, 7) - 0.5) * sp2]}><sphereGeometry args={[0.0036, 6, 4]} /><meshBasicMaterial color="#ffd6e8" transparent opacity={0.9 * puff * (1 - u)} toneMapped={false} /></mesh>; })}
      {P}
      {t > wow - 0.12 && <group position={[-0.225, 0.565 + 0.25 * (1 - spr(t, wow - 0.12, 1.3, 1.25)), -0.555]} rotation={[-0.12, 0, 0]}>
        <RBox s={[0.24, 0.09, 0.012]} r={0.006} p={[0, 0, 0]}>{M.porcelain({ col: "#fbf4f7" })}</RBox>
        <mesh position={[0, 0, 0.0065]}><planeGeometry args={[0.226, 0.078]} /><meshStandardMaterial map={printTex("tresf", 520, 180, "#fbf4f7", [["3 ROWS", 70, 98, 92, "#b51d5c", "900"]])} roughness={0.6} /></mesh>
      </group>}
      <Sombra w={1.8} d={1.8} o={0.3} y={0.001} />
    </Esc>
  </Stage>;
};

// ═════════ GATECHECK: la valija de mano se va al fondo con la etiqueta amarilla «GATE CHECK» (con todo adentro); queda
// la riñonera cruzada con su cierre. En «Inside» el cierre corre, y salen por la boca los remedios, el ID y los anteojos. ═════════
const Carry: React.FC<{ tag: number }> = ({ tag }) => <group>
  <RBox s={[0.34, 0.46, 0.2]} r={0.04} p={[0, 0.25, 0]}>{M.plastic({ col: "#3a3f47" })}</RBox>
  {[-0.1, 0, 0.1].map((x) => <mesh key={x} position={[x, 0.25, 0.101]}><boxGeometry args={[0.016, 0.4, 0.004]} />{M.plastic({ col: "#4a505a" })}</mesh>)}
  {[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.68, -0.07]}><cylinderGeometry args={[0.008, 0.008, 0.4, 12]} />{M.chrome()}</mesh>)}
  <RBox s={[0.27, 0.025, 0.03]} r={0.01} p={[0, 0.88, -0.07]}>{M.rubber({ col: "#15181d" })}</RBox>
  {[-0.13, 0.13].map((x) => <mesh key={x} position={[x, 0.025, -0.07]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.02, 24]} />{M.rubber({ col: "#15181d" })}</mesh>)}
  <group position={[0.06, 0.47, 0.11]} rotation={[0, 0, 0.1 + 0.25 * Math.sin(tag * 8) * Math.exp(-tag * 3)]}>
    <mesh position={[0, -0.075, 0]}><planeGeometry args={[0.12, 0.15]} /><meshStandardMaterial map={printTex("gchk", 240, 300, "#f4c430", [["GATE", 54, 128, 56, "#1b1d20", "900"], ["CHECK", 34, 200, 56, "#1b1d20", "900"]], (g) => { g.fillStyle = "#1b1d20"; g.beginPath(); g.arc(120, 34, 13, 0, 6.3); g.fill(); })} roughness={0.7} side={THREE.DoubleSide} /></mesh>
  </group>
</group>;
const cueroBolso = () => canv("cueroBolso", 256, 256, (g) => { g.fillStyle = "#5a2f1a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 9000; i++) { g.fillStyle = rn(i, 1) > 0.5 ? `rgba(255,200,150,${0.06 * rn(i, 2)})` : `rgba(20,8,2,${0.16 * rn(i, 2)})`; g.beginPath(); g.arc(rn(i, 3) * 256, rn(i, 4) * 256, 0.6 + 1.4 * rn(i, 5), 0, 6.3); g.fill(); } }, [1.5, 1]);
const Pastillero: React.FC = () => <group>
  <RBox s={[0.14, 0.022, 0.04]} r={0.006} p={[0, 0.011, 0]}>{M.plastic({ col: "#f2f0ea" })}</RBox>
  {["#e85a4f", "#f2a93b", "#f6d743", "#6cc070", "#4fa3e0", "#7b6fd6", "#d66fb0"].map((c, i) => <RBox key={i} s={[0.017, 0.006, 0.036]} r={0.002} p={[-0.06 + i * 0.02, 0.024, 0]}>{M.plastic({ col: c })}</RBox>)}
</group>;
export const Gatecheck: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, med = at("your medicines", a), id = at("your ID", a), gl = at("your glasses", a);
  const away = cl((t - a - 1.6) / 1.6), zip = spr(t, wow - 0.15, 0.9, 1.5), zx = lerp(-0.11, 0.11, zip);
  const up = (t0: number) => spr(t, t0 - 0.1, 1.1, 1.35);
  const cam = camA(t, a, b, { p: [-0.32, 0.62, 1.28], l: [0.04, 0.2, -0.1], fov: 33 }, { p: [0.22, 0.5, 0.82], l: [0.02, 0.14, 0], fov: 33 });
  return <Stage t={t} a={a} b={b} dim={0.68} tint="#ffe2b8">
    <Esc cam={cam} key1={[-1.0, 2.0, 1.4]} warm={1.1}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4.4, 3.2]} /><meshStandardMaterial map={alfombra()} roughness={0.96} alphaMap={edgeAlpha()} transparent /></mesh>
      {/* la valija se va rodando hacia el fondo (la manga), con la etiqueta amarilla bamboleando */}
      <group position={[0.32 + 1.3 * away * away, 0, -0.3 - 0.5 * away]} rotation={[0, -0.4 - 0.5 * away, 0]}>
        <Blob w={0.45} d={0.3} o={0.55 * (1 - away)} /><Carry tag={Math.max(0, t - a - 1.6)} />
      </group>
      {/* la riñonera cruzada */}
      <group position={[-0.05, 0, 0.12]} rotation={[0, 0.18, 0]}>
        <Blob w={0.4} d={0.2} o={0.6} />
        <RBox s={[0.3, 0.16, 0.08]} r={0.035} p={[0, 0.08, 0]}><meshPhysicalMaterial map={cueroBolso()} roughness={0.55} clearcoat={0.35} /></RBox>
        {/* el cierre: dientes de metal; la parte abierta se ensancha detrás del cursor */}
        {Array.from({ length: 40 }, (_, i) => { const x = -0.13 + i * 0.0066, op = x < zx ? 1 : 0; return <mesh key={i} position={[x, 0.161, (i % 2 ? 0.004 : -0.004) * (1 + 3 * op)]}><boxGeometry args={[0.004, 0.003, 0.005]} />{M.brass({ col: "#c9a24a" })}</mesh>; })}
        <mesh position={[0, 0.156, 0]} scale={[1, 1, 0.01 + zip]}><boxGeometry args={[0.26 * zip, 0.006, 0.03]} /><meshStandardMaterial color="#120a06" roughness={1} /></mesh>
        <RBox s={[0.02, 0.012, 0.02]} r={0.004} p={[zx, 0.168, 0]}>{M.brass()}</RBox>
        <RBox s={[0.008, 0.03, 0.004]} r={0.002} p={[zx + 0.012, 0.15, 0.012]}>{M.brass()}</RBox>
        {/* parche de cuero repujado */}
        <mesh position={[0, 0.075, 0.041]}><planeGeometry args={[0.15, 0.05]} /><meshStandardMaterial map={printTex("staysOn", 450, 150, "#7a4a2c", [["STAYS ON YOU", 34, 82, 48, "#f3dfc0", "900"]], (g) => { g.strokeStyle = "#e9cfa6"; g.setLineDash([10, 8]); g.lineWidth = 4; g.strokeRect(10, 10, 430, 130); })} roughness={0.7} /></mesh>
        {/* la correa cruzada: sube y sale de cuadro (va al cuerpo) */}
        <mesh geometry={tubeG("correa", [[-0.15, 0.12, 0], [-0.26, 0.3, -0.04], [-0.42, 0.62, -0.12], [-0.7, 1.05, -0.2]], 0.009, 60, 8)} castShadow><meshStandardMaterial color="#3d1f10" roughness={0.6} /></mesh>
        <mesh geometry={tubeG("correaB", [[0.15, 0.12, 0], [0.1, 0.36, -0.08], [-0.2, 0.7, -0.16], [-0.62, 1.08, -0.22]], 0.009, 60, 8)} castShadow><meshStandardMaterial color="#3d1f10" roughness={0.6} /></mesh>
        {/* salen por la boca, en su palabra */}
        {t > med - 0.15 && <group position={[-0.09, 0.17 + 0.12 * up(med), 0.0]} rotation={[0.5 * up(med), 0.3, 0.1]}><Pastillero /></group>}
        {t > id - 0.15 && <group position={[0.0, 0.17 + 0.17 * up(id), 0.01]} rotation={[1.25 * up(id), -0.1, 0]}>
          <RBox s={[0.086, 0.003, 0.054]} r={0.002} p={[0, 0, 0]}>{M.plastic({ col: "#dfe7ee" })}</RBox>
          <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.082, 0.05]} /><meshStandardMaterial map={printTex("idc2", 256, 160, "#dfe7ee", [["ID", 128, 70, 64, "#1d2a4a", "900"]], (g) => { g.fillStyle = "#9aa9b8"; g.fillRect(18, 30, 86, 104); g.fillStyle = "#1d2a4a"; g.fillRect(128, 112, 108, 8); g.fillRect(128, 128, 80, 8); })} roughness={0.4} /></mesh>
        </group>}
        {t > gl - 0.15 && <group position={[0.1, 0.17 + 0.13 * up(gl), 0.02]} rotation={[1.1 * up(gl), -0.2, 0]} scale={1.2}><Lentes /></group>}
      </group>
      <Sombra w={2.2} d={1.6} o={0.35} y={0.001} />
    </Esc>
  </Stage>;
};
