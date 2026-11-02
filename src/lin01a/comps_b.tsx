// lin01a · LOTE B: cintura (9:25) · bandeja (10:15) · cartera (11:24) · capas (13:26). Mismas reglas que el lote A: objeto
// físico con material de verdad y sombra de contacto, el clip del momento hundido detrás (Stage), cámara en curva, todo
// dentro del cuadro con margen, el golpe en la palabra exacta (f.wow / at()), texto ≤5 palabras DENTRO del objeto.
import React from "react";
import * as THREE from "three";
import { Stage, at } from "./base";
import { Esc, M, RBox, camA, canv, cl, extr, fabricTex, geo, lerp, printTex, rn, spr, tubeG, win, Blob, Sombra, type V3 } from "./k3d";
import { Calzado } from "./comps_a";
import type { Fi } from "./valija";

// ═════════ CINTURA: dos pretinas paradas como anillos sobre el asiento. El jean, rígido: al «sit» se aplasta, se le marca
// el botón y se enrojece. El elástico gris respira (se estira y vuelve). En «gray» cae el jogger gris delante. ═════════
const denimTex = () => canv("denim", 256, 256, (g) => {
  g.fillStyle = "#34507c"; g.fillRect(0, 0, 256, 256);
  for (let i = -256; i < 512; i += 3) { g.strokeStyle = `rgba(${i % 2 ? "190,210,240" : "10,20,40"},${0.22 + 0.1 * rn(i, 1)})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); }
  for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(255,255,255,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 1.5, 1.5); }
}, [6, 1]);
export const ribTex = () => canv("rib", 256, 64, (g) => {
  g.fillStyle = "#8d8f93"; g.fillRect(0, 0, 256, 64);
  for (let x = 0; x < 256; x += 8) { const gr = g.createLinearGradient(x, 0, x + 8, 0); gr.addColorStop(0, "#6c6e72"); gr.addColorStop(0.5, "#b4b6ba"); gr.addColorStop(1, "#6c6e72"); g.fillStyle = gr; g.fillRect(x, 0, 8, 64); }
  for (let i = 0; i < 800; i++) { g.fillStyle = `rgba(0,0,0,${0.08 * rn(i, 5)})`; g.fillRect(rn(i, 6) * 256, rn(i, 7) * 64, 1.5, 1.5); }
}, [10, 1]);
// banda (cilindro abierto) con radio que varía por ángulo: squash(θ) devuelve el factor de radio
const banda = (k: string, R: number, H: number, sq: (q: number) => number) => {
  const g = new THREE.CylinderGeometry(R, R, H, 96, 4, true), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), q = Math.atan2(z, x), f = sq(q); p.setX(i, x * f); p.setZ(i, z * f); }
  g.computeVertexNormals(); return g;
};
const jerseyGris = () => canv("jerseyG", 256, 256, (g) => {
  g.fillStyle = "#9a9ca0"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) { g.fillStyle = rn(i, 1) > 0.5 ? `rgba(235,235,238,${0.2 * rn(i, 2)})` : `rgba(40,40,46,${0.22 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 1.2 + rn(i, 5) * 1.6, 1.2); }
}, [3, 3]);
// jogger gris doblado: piernas plegadas (pliegue al medio), pretina acanalada atrás con el moño del cordón, puños al frente
const Jogger: React.FC = () => { const m = () => <meshStandardMaterial map={jerseyGris()} color="#8c8e93" roughness={0.97} />, rib = () => <meshStandardMaterial map={ribTex()} color="#a7a9ad" roughness={0.97} />; return <group>
  <RBox s={[0.3, 0.045, 0.2]} r={0.018} p={[0, 0.0225, 0]}>{m()}</RBox>
  <mesh position={[0, 0.0456, 0.015]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.004, 0.16]} /><meshStandardMaterial color="#56585c" roughness={0.9} /></mesh>
  <RBox s={[0.302, 0.054, 0.036]} r={0.016} p={[0, 0.027, -0.09]}>{rib()}</RBox>
  {[-0.072, 0.072].map((x) => <RBox key={x} s={[0.135, 0.005, 0.036]} r={0.002} p={[x, 0.046, 0.078]}>{rib()}</RBox>)}
  {[-1, 1].map((sg) => <mesh key={sg} position={[sg * 0.014, 0.056, -0.07]} rotation={[-Math.PI / 2 + 0.3, 0, sg * 0.5]}><torusGeometry args={[0.012, 0.0028, 8, 24]} /><meshStandardMaterial color="#f1eee8" roughness={0.8} /></mesh>)}
  <mesh castShadow geometry={tubeG("jcord5", [[0, 0.055, -0.072], [-0.012, 0.05, -0.045], [-0.02, 0.047, -0.02]], 0.003, 30, 8)}><meshStandardMaterial color="#f1eee8" roughness={0.8} /></mesh>
  <mesh castShadow geometry={tubeG("jcord6", [[0, 0.055, -0.072], [0.014, 0.05, -0.048], [0.026, 0.047, -0.028]], 0.003, 30, 8)}><meshStandardMaterial color="#f1eee8" roughness={0.8} /></mesh>
  {[[-0.02, 0.047, -0.02], [0.026, 0.047, -0.028]].map((q, i) => <mesh key={i} position={q as V3} rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.0036, 0.01, 4, 10]} />{M.chrome()}</mesh>)}
</group>; };
export const Cintura: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, sit = at("when you sit", a) + 0.25, room = at("room", a);
  // el jean se aplasta al sentarse (la pretina se achata a la mitad y el botón se hunde); el elástico se estira y vuelve
  const press = spr(t, sit, 1.3, 1.1) * (1 - 0.15 * win(t, wow, wow + 1)), pc = cl(press);
  const sqJ = Math.round(pc * 24) / 24, breathe = 0.05 * Math.sin((t - a) * 2.4) * (1 - 0.5 * pc) + 0.08 * win(t, room - 0.1, room + 0.4) * (1 - win(t, room + 0.4, room + 1.2));
  const drop = Math.max(0, 1 - spr(t, wow - 0.05, 1.1, 1.5)), tag = spr(t, room - 0.3, 1.1, 1.6);
  const cam = camA(t, a, b, { p: [-0.48, 0.56, 1.42], l: [0, 0.06, 0.03], fov: 32 }, { p: [0.26, 0.92, 1.18], l: [0.02, 0.04, 0.08], fov: 32 });
  const jeanG = geo("jeanB3" + sqJ, () => banda("j", 0.15, 0.1, (q) => 1 - 0.18 * sqJ * Math.pow(Math.max(0, Math.sin(q)), 3) + 0.06 * sqJ * Math.pow(Math.cos(q), 2)));
  const ribG = geo("ribB2", () => banda("r", 0.15, 0.12, () => 1));
  const piel = new THREE.Color("#e2cdb4").lerp(new THREE.Color("#c8402c"), 0.85 * pc), zB = 0.15 * (1 - 0.18 * sqJ);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-1.1, 1.7, 1.3]}>
      {/* el asiento: almohadón de cabina con ribete */}
      <RBox s={[0.92, 0.08, 0.58]} r={0.04} p={[0, -0.04, 0.02]}><meshStandardMaterial map={fabricTex("navy", [3, 2])} roughness={0.9} /></RBox>
      {[0.31, -0.27].map((z) => <mesh key={z} position={[0, -0.002, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.007, 0.007, 0.86, 12]} /><meshStandardMaterial color="#2c3b63" roughness={0.8} /></mesh>)}
      <group position={[0, -0.04, -0.3]} rotation={[-0.16, 0, 0]}>
        <RBox s={[0.92, 0.24, 0.09]} r={0.04} p={[0, 0.12, 0]}><meshStandardMaterial map={fabricTex("navy", [3, 1.2])} roughness={0.9} /></RBox>
      </group>
      <Blob w={1.2} d={0.8} o={0.5} y={-0.08} />
      {/* JEAN (izq): al sentarse se achata a la mitad, el botón se hunde y la piel de adentro se pone roja */}
      <group position={[-0.24, 0.05 - 0.02 * pc, -0.02]} scale={[1 + 0.08 * pc, 1 - 0.45 * pc, 1 - 0.06 * pc]}>
        <mesh geometry={jeanG} scale={[0.96, 1, 0.96]}><meshStandardMaterial color={piel} roughness={0.7} side={THREE.BackSide} emissive="#a01c10" emissiveIntensity={0.25 * pc} /></mesh>
        <mesh geometry={jeanG} castShadow receiveShadow><meshStandardMaterial map={denimTex()} roughness={0.85} side={THREE.DoubleSide} /></mesh>
        {[0.05, -0.05].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1 + 0.06 * sqJ, 1 - 0.18 * sqJ, 1]}><torusGeometry args={[0.15, 0.0035, 8, 96]} /><meshStandardMaterial color="#c78a3c" roughness={0.6} /></mesh>)}
        <mesh position={[0, 0, zB + 0.0015]}><circleGeometry args={[0.03, 32]} /><meshBasicMaterial map={canv("hueco", 64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 14, 32, 32, 32); gr.addColorStop(0, "rgba(5,10,25,.75)"); gr.addColorStop(1, "rgba(5,10,25,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); })} transparent opacity={pc} depthWrite={false} /></mesh>
        <group position={[0, 0, zB + 0.004 - 0.008 * pc]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.018, 0.018, 0.009, 32]} />{M.chrome({ col: "#c9c3b4" })}</mesh>
          <mesh position={[0, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.013, 0.002, 8, 32]} />{M.brass({ col: "#9c8a6a" })}</mesh>
        </group>
        {/* pliegues de tensión a los lados del botón */}
        {pc > 0.05 && [-1, 1].flatMap((sg) => [0.025, 0, -0.025].map((y, k) => <mesh key={sg + "_" + k} position={[sg * (0.045 + 0.01 * k), y, zB - 0.004]} rotation={[0, sg * -0.3, Math.PI / 2 + sg * 0.25]} scale={[1, pc, 1]}><capsuleGeometry args={[0.0042, 0.05 - 0.01 * k, 4, 8]} /><meshStandardMaterial color="#1a2c4d" roughness={0.9} /></mesh>))}
        {[0.6, -0.6].map((q) => <mesh key={q} position={[Math.sin(q) * 0.153, 0.012, Math.cos(q) * 0.153]} rotation={[Math.PI / 2, 0, -q]}><cylinderGeometry args={[0.005, 0.005, 0.006, 16]} />{M.brass({ col: "#b8743a" })}</mesh>)}
        {[0.35, 1.2, 2.2, -0.35, -1.2, -2.2].map((q) => <RBox key={q} s={[0.016, 0.104, 0.006]} r={0.002} p={[Math.sin(q) * 0.156, 0, Math.cos(q) * 0.156]} rot={[0, q, 0]}><meshStandardMaterial map={denimTex()} roughness={0.85} /></RBox>)}
      </group>
      {/* ELÁSTICO (der): pretina acanalada gris con cordón y la etiqueta tejida al frente; respira */}
      <group position={[0.24, 0.06, -0.02]} scale={[1 + breathe, 1, 1 + breathe]}>
        <mesh geometry={ribG} scale={[0.96, 1, 0.96]}><meshStandardMaterial color="#77797d" roughness={0.95} side={THREE.BackSide} /></mesh>
        <mesh geometry={ribG} castShadow receiveShadow><meshStandardMaterial map={ribTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        {[0.06, -0.06].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.005, 10, 96]} /><meshStandardMaterial color="#7d7f83" roughness={0.95} /></mesh>)}
        <mesh castShadow geometry={tubeG("cordon3", [[-0.02, -0.012, 0.153], [-0.03, -0.055, 0.165], [-0.024, -0.1, 0.17]], 0.003, 30, 8)}><meshStandardMaterial color="#e9e6df" roughness={0.8} /></mesh>
        <mesh castShadow geometry={tubeG("cordon4", [[0.02, -0.012, 0.153], [0.034, -0.05, 0.165], [0.03, -0.09, 0.172]], 0.003, 30, 8)}><meshStandardMaterial color="#e9e6df" roughness={0.8} /></mesh>
        {/* «room»: la etiqueta tejida se despliega al frente (cosida arriba, con costura punteada) */}
        <group position={[0, 0.026, 0]} scale={[1, Math.max(0.001, cl(tag)), 1]}>
          <mesh><cylinderGeometry args={[0.1535, 0.1535, 0.058, 48, 1, true, -0.58, 1.16]} /><meshStandardMaterial map={printTex("roomTag4", 640, 220, "#f1ead9", [["ROOM TO SIT", 50, 118, 84, "#1f2a40", "900"]], (g) => { for (let y = 0; y < 220; y += 4) { g.fillStyle = "rgba(120,100,70,.08)"; g.fillRect(0, y, 640, 2); } g.strokeStyle = "#b3261e"; g.lineWidth = 7; g.setLineDash([16, 10]); g.strokeRect(16, 16, 608, 188); })} roughness={0.75} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>
      {/* «gray»: el jogger gris cae doblado al frente */}
      {t > wow - 0.08 && <group position={[0.02, 0.002 + drop * 0.5, 0.2]} rotation={[0.3 * drop, -0.06 + 0.3 * drop, 0]}>
        <Blob w={0.42} d={0.36} o={0.85 * (1 - cl(drop * 3))} y={-0.001} />
        {/* la foto recortada del jogger doblado, con espesor, inclinada hacia cámara (apoya el borde de atrás en el elástico) */}
        <group position={[0, 0.07, -0.05]} rotation={[0.42, 0, 0]}><Calzado img="g05b_joggers" L={0.34} capas={8} esp={0.003} suela="#5d5f63" /></group>
      </group>}
    </Esc>
  </Stage>;
};

// ═════════ BANDEJA: la bandeja gris del control rueda sobre los rodillos; en «watch» caen reloj y joyas; en «ring» el dedo
// con la alianza; en «swollen» el dedo se hincha y el anillo queda trabado en el nudillo (se enrojece). ═════════
const Bin: React.FC = () => { const W = 0.42, D = 0.3, H = 0.075, th = 0.014, mat = () => <meshPhysicalMaterial color="#474c54" roughness={0.38} clearcoat={0.45} clearcoatRoughness={0.4} />; return <group>
  <RBox s={[W, th, D]} r={0.006} p={[0, th / 2, 0]}>{mat()}</RBox>
  {[D / 2 - th / 2, -D / 2 + th / 2].map((z) => <RBox key={z} s={[W, H, th]} r={0.005} p={[0, H / 2, z]}>{mat()}</RBox>)}
  {[W / 2 - th / 2, -W / 2 + th / 2].map((x) => <RBox key={x} s={[th, H, D]} r={0.005} p={[x, H / 2, 0]}>{mat()}</RBox>)}
  {/* labio redondeado arriba y las agarraderas hundidas de los lados cortos */}
  {[D / 2 - th / 2, -D / 2 + th / 2].map((z) => <mesh key={z} position={[0, H, z]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.0095, W - 0.02, 4, 12]} />{mat()}</mesh>)}
  {[W / 2 - th / 2, -W / 2 + th / 2].map((x) => <mesh key={x} position={[x, H, 0]} rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.0095, D - 0.02, 4, 12]} />{mat()}</mesh>)}
  {[W / 2 + 0.0005, -W / 2 - 0.0005].map((x) => <mesh key={x} position={[x, H * 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.35]}><capsuleGeometry args={[0.011, 0.07, 4, 12]} /><meshStandardMaterial color="#25282c" roughness={0.6} /></mesh>)}
</group>; };
const Reloj: React.FC = () => <group>
  <mesh castShadow><cylinderGeometry args={[0.032, 0.032, 0.01, 48]} />{M.chrome({ col: "#e8d39a" })}</mesh>
  <mesh position={[0, 0.0055, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.027, 48]} /><meshStandardMaterial map={canv("esfera", 128, 128, (g) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#2a2a2a"; for (let i = 0; i < 12; i++) { const q = i / 12 * Math.PI * 2; g.fillRect(64 + Math.cos(q) * 50 - 2, 64 + Math.sin(q) * 50 - 2, 4, 4); } g.strokeStyle = "#1d1d1d"; g.lineWidth = 4; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 30); g.moveTo(64, 64); g.lineTo(90, 70); g.stroke(); })} roughness={0.3} /></mesh>
  {[1, -1].map((s) => <RBox key={s} s={[0.026, 0.004, 0.07]} r={0.002} p={[0, -0.002, s * 0.065]}><meshStandardMaterial color="#5a3a22" roughness={0.6} /></RBox>)}
</group>;
// mandril de joyero: perfil torneado (fino arriba, grueso abajo) con talles grabados; «bul» hincha el tramo medio
const MY0 = -0.18, MY1 = 0.18, MB = 0.07;
const mR = (y: number, bul: number) => 0.012 + 0.022 * (MY1 - y) / (MY1 - MY0) + 0.012 * bul * Math.exp(-Math.pow((y - MB) / 0.032, 2));
const mandrilG = (bul: number, y0 = MY0, y1 = MY1, extra = 0) => { const pts: THREE.Vector2[] = [], n = 60; if (y0 === MY0) pts.push(new THREE.Vector2(0, y0)); for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n; pts.push(new THREE.Vector2(mR(y, bul) + extra, y)); } if (y1 === MY1) pts.push(new THREE.Vector2(0, y1)); return new THREE.LatheGeometry(pts, 64); };
const tallesTex = () => canv("talles2", 512, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 512, 0); gr.addColorStop(0, "#9aa0a6"); gr.addColorStop(0.5, "#e4e8ec"); gr.addColorStop(1, "#9aa0a6"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 7; i++) { const y = 60 + i * 64; g.fillStyle = "#2c3036"; g.fillRect(0, y, 512, 4);
    g.font = "900 40px Montserrat, Arial"; for (const x of [64, 192, 320, 448]) { g.save(); g.translate(x, y + 34); g.rotate(-Math.PI / 2); g.scale(1, -1); g.textAlign = "center"; g.fillText(String(11 - i), 0, -16); g.textAlign = "start"; g.restore(); } }
});
export const Bandeja: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, watch = at("for a watch", a) + 0.3, off = at("come off", a), nope = at("won't come off", a), sw = at("fingers", a) - 0.2;
  const a0 = Math.max(a, wow - 1.0), roll = 1 - spr(t, a0 - 0.05, 0.75, 1.5), dropW = Math.max(0, 1 - spr(t, watch - 0.25, 1.1, 1.4));
  const fin = spr(t, wow - 0.15, 1.2, 1.4), swell = cl((t - sw) / 0.8), stuck = cl((t - sw - 0.1) / 0.3) * (1 - cl((t - sw - 1.6) / 0.6));
  const bulQ = Math.round(swell * 16) / 16;
  // la alianza sube hacia la punta fina (sale)… hasta que el tramo hinchado la frena
  const yFree = lerp(-0.045, 0.2, cl((t - off) / 4)), yStop = lerp(0.2, MB - 0.042, cl(swell * 1.6)), yR = Math.min(yFree, yStop) + 0.0025 * Math.sin(t * 48) * stuck;
  const cam = camA(t, a0, b, { p: [0.42, 0.5, 0.6], l: [0, 0.03, 0], fov: 32 }, { p: [0.15, 0.33, 0.42], l: [0.04, 0.04, 0.0], fov: 32 });
  return <Stage t={t} a={a} b={b} dim={0.7} tint="#dfe8f2">
    <Esc cam={cam} key1={[-0.9, 1.8, 1.0]} warm={0.7} cool={1.3}>
      {/* la cinta de rodillos: bastidor oscuro, rieles y rodillos de acero entre los rieles */}
      <RBox s={[1.5, 0.05, 0.54]} r={0.01} p={[0, -0.065, 0]}>{M.matte({ col: "#1b1d20" })}</RBox>
      {[0.262, -0.262].map((z) => <mesh key={z} position={[0, -0.03, z]} rotation={[0, z > 0 ? 0 : Math.PI, 0]}><planeGeometry args={[1.5, 0.03]} /><meshStandardMaterial map={canv("cuidado", 256, 16, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 256, 16); g.fillStyle = "#1b1d20"; for (let x = -16; x < 256; x += 24) { g.beginPath(); g.moveTo(x, 16); g.lineTo(x + 12, 0); g.lineTo(x + 20, 0); g.lineTo(x + 8, 16); g.fill(); } }, [10, 1])} roughness={0.6} /></mesh>)}
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.66 + i * 0.12, -0.018, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow><cylinderGeometry args={[0.018, 0.018, 0.46, 24]} />{M.steel()}</mesh>)}
      {[0.245, -0.245].map((z) => <RBox key={z} s={[1.5, 0.05, 0.026]} r={0.008} p={[0, -0.02, z]}>{M.steel({ col: "#8b9299" })}</RBox>)}
      <Sombra w={2.2} d={1.2} o={0.4} y={-0.09} />
      <group position={[0.9 * roll, 0, 0]}>
        <Bin />
        {t > watch - 0.3 && <group position={[-0.13, 0.02 + dropW * 0.35, -0.01]} rotation={[0, 0.15, 0.3 * dropW]} scale={1.2}><Blob w={0.08} d={0.17} o={0.6} y={-0.004} /><Reloj /></group>}
        {t > watch - 0.2 && <group position={[0.05, 0.016 + Math.max(0, 1 - spr(t, watch - 0.1, 1.1, 1.4)) * 0.4, 0.05]} rotation={[0, -1.4, 0]} scale={1.15}><Blob w={0.16} d={0.12} o={0.6} y={0.015} /><Calzado img="g06_joyas" L={0.13} capas={3} esp={0.002} suela="#8a7a52" /></group>}
      </group>
      {/* «ring»: el mandril cae en la bandeja con la alianza puesta; «come off»: la alianza sube hacia la punta;
          «fingers have swollen»: el tramo medio se hincha al rojo y la alianza se traba ahí, temblando */}
      {t > wow - 0.25 && <group position={[0.05, 0.04 + Math.max(0, 1 - fin) * 0.4, -0.045]} rotation={[0, -0.12, Math.PI / 2 - 0.06]} scale={0.86}>
        <mesh castShadow geometry={geo("mandril3" + bulQ, () => mandrilG(bulQ))}><meshStandardMaterial map={tallesTex()} metalness={0.85} roughness={0.24} /></mesh>
        {bulQ > 0 && <mesh geometry={geo("mandrilR" + bulQ, () => mandrilG(bulQ, MB - 0.06, MB + 0.06, 0.0006))}><meshStandardMaterial map={canv("calor", 256, 256, (g) => { g.fillStyle = "#c8381a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2600; i++) { g.fillStyle = rn(i, 1) > 0.5 ? `rgba(255,190,90,${0.35 * rn(i, 2)})` : `rgba(90,10,0,${0.35 * rn(i, 2)})`; g.beginPath(); g.arc(rn(i, 3) * 256, rn(i, 4) * 256, 1 + 5 * rn(i, 5), 0, 6.3); g.fill(); } }, [3, 1])} emissive="#ff3a10" emissiveIntensity={0.55 * bulQ} roughness={0.4} metalness={0.55} transparent opacity={Math.min(1, 1.4 * bulQ)} /></mesh>}
        <mesh position={[0, yR, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.034, 0.0085, 24, 72]} /><meshPhysicalMaterial color="#f0c25a" metalness={1} roughness={0.1} clearcoat={1} envMapIntensity={2.2} /></mesh>
      </group>}
      {/* «won't come off»: el sello rojo se estampa en el frente de la bandeja */}
      {t > nope - 0.1 && <mesh position={[0.06 + 0.9 * roll, 0.036, 0.158]} renderOrder={5} rotation={[0, 0, -0.06]} scale={lerp(1.6, 1, cl(spr(t, nope - 0.1, 1.4, 1.2)))}><planeGeometry args={[0.13, 0.042]} /><meshStandardMaterial map={printTex("sello2", 520, 168, "#00000000", [["WON'T COME OFF", 36, 86, 41, "#c62a22", "900"]], (g) => { g.clearRect(0, 0, 520, 168); g.strokeStyle = "#c62a22"; g.lineWidth = 9; g.strokeRect(10, 14, 500, 140); })} transparent opacity={0.92 * cl((t - nope + 0.1) / 0.15)} roughness={0.8} depthWrite={false} /></mesh>}
    </Esc>
  </Stage>;
};
