// chen29a · «Todo lo que Gasto en Una Semana»: componentes 3D únicos (1 por minuto, ninguno repetido en la tanda chen29).
// v2 (vuelta 1 del EVALUADOR, 29-oct): cámara más cerca, objetos grandes y reconocibles, nada cortado por el borde,
// la acción repartida en toda la duración (D) y un momento «wow» en la palabra clave. Render SÓLO en el farm.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Llama, Olla, Plato } from "./kit3d";
import { Billete, Lapiz, Lata, Libreta, Moneda, Pila, Sobre, Tambo } from "./kit29";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const sombraTexA = () => ctex("sombraRA", 128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(0,0,0,.6)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
const SombraA: React.FC<{ p: V3; r: number; o?: number }> = ({ p, r, o = 1 }) => <mesh position={[p[0], 0.004, p[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={sombraTexA()} transparent opacity={o} depthWrite={false} /></mesh>;
const nubeTexA = () => ctex("nubeA", 64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.5, "rgba(255,255,255,.45)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
const llamaGeoA = lathe([[0.001, 0], [0.05, 0.025], [0.065, 0.075], [0.05, 0.14], [0.025, 0.2], [0.001, 0.25]], 28);
const arrugaGeoA = (() => { const g = new THREE.PlaneGeometry(0.5, 1.05, 10, 20), a = g.attributes.position; for (let i = 0; i < a.count; i++) { const x = a.getX(i), y = a.getY(i); a.setZ(i, 0.012 * Math.sin(x * 31 + y * 7) + 0.01 * Math.sin(y * 23 - x * 11)); } g.computeVertexNormals(); return g; })();
const dur = (h: H) => Math.max(3, h.out - h.at);
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const FNT = `Caveat, "Segoe Script", cursive`;
// etiqueta de papel: pocas palabras, letra GRANDE (se lee en el celular)
const etqTex = (txt: string, w: number, h: number, bg: string, ink: string) => ctex(`etq2:${txt}|${w}|${h}|${bg}|${ink}`, 512, Math.round(512 * h / w), (g) => {
  const W = 512, Hh = Math.round(512 * h / w); g.fillStyle = bg; g.fillRect(0, 0, W, Hh);
  for (let i = 0; i < 200; i++) { g.fillStyle = `rgba(120,90,50,${0.05 * rn(i, 7)})`; g.fillRect(rn(i, 2) * W, rn(i, 3) * Hh, 3, 3); }
  let sz = Math.round(Hh * 0.78); g.font = `700 ${sz}px ${FNT}`; while (g.measureText(txt).width > W * 0.88 && sz > 20) { sz -= 4; g.font = `700 ${sz}px ${FNT}`; }
  g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, W / 2, Hh / 2 + sz * 0.04);
});
const Etq: React.FC<{ p: V3; rot?: V3; txt: string; w?: number; h?: number; bg?: string; ink?: string; s?: number }> = ({ p, rot = [0, 0, 0], txt, w = 0.6, h = 0.26, bg = "#f1ead6", ink = "#2a1c12", s = 1 }) =>
  <mesh position={p} rotation={rot} scale={Math.max(0.001, s)} castShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={etqTex(txt, w, h, bg, ink)} roughness={0.9} side={THREE.DoubleSide} /></mesh>;
const tortGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.012, 40);
const Tortilla: React.FC<{ p: V3; rot?: V3; c?: string }> = ({ p, rot, c = "#e8cf8c" }) => <mesh position={p} rotation={rot} geometry={tortGeo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={0.85} /></mesh>;
const Gota: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => <mesh position={p} scale={[0.02 * s + 0.0001, 0.026 * s + 0.0001, 0.02 * s + 0.0001]}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#e8f4f8" roughness={0.02} transparent opacity={0.75} clearcoat={1} /></mesh>;
// tejido de palma / mimbre
const tejido = (c1: string, c2: string) => ctex("tej" + c1 + c2, 256, 256, (g) => {
  g.fillStyle = c2; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) for (let x = 0; x < 256; x += 16) { const o = ((x + y) / 16) % 2; g.fillStyle = c1; g.fillRect(x + (o ? 1 : 3), y + (o ? 3 : 1), o ? 14 : 10, o ? 10 : 14); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(x, y + 14, 16, 2); }
});
// hoja de libreta que se va escribiendo letra por letra (k 0..1); devuelve la textura y la punta del lápiz (u,v)
type Fila = { c: string[]; ink?: string };
const escritoLay = (rows: Fila[], cols: number[], W: number, Hh: number, y0: number, dy: number, size: number) => {
  const cells: { x: number; y: number; s: string; ink: string }[] = [];
  rows.forEach((r, i) => r.c.forEach((s, j) => { if (s) cells.push({ x: cols[j] * W, y: y0 + i * dy, s, ink: r.ink ?? "#1d2c5a" }); }));
  const tot = cells.reduce((a, c) => a + c.s.length, 0);
  return { cells, tot, size, W, Hh };
};
const escrito = (key: string, rows: Fila[], k: number, cols: number[], o: { W?: number; Hh?: number; y0?: number; dy?: number; size?: number } = {}) => {
  const L = escritoLay(rows, cols, o.W ?? 1024, o.Hh ?? 732, o.y0 ?? 150, o.dy ?? 118, o.size ?? 96);
  const shown = Math.floor(cl(k) * L.tot);
  let left = shown, pen: [number, number] = [L.cells[0]?.x ?? 0, L.cells[0]?.y ?? 0];
  for (const c of L.cells) { if (left <= 0) break; const n = Math.min(c.s.length, left); pen = [c.x + n * L.size * 0.4, c.y]; left -= n; }
  const tex = ctex(`esc:${key}:${shown}`, L.W, L.Hh, (g) => {
    g.fillStyle = "#f3ecd8"; g.fillRect(0, 0, L.W, L.Hh);
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(120,90,50,${0.05 * rn(i, 7)})`; g.fillRect(rn(i, 2) * L.W, rn(i, 3) * L.Hh, 3, 3); }
    g.strokeStyle = "rgba(80,110,160,.35)"; g.lineWidth = 3; for (let y = (o.y0 ?? 150) + 40; y < L.Hh; y += (o.dy ?? 118)) { g.beginPath(); g.moveTo(0, y); g.lineTo(L.W, y); g.stroke(); }
    g.strokeStyle = "rgba(200,60,60,.45)"; g.beginPath(); g.moveTo(84, 0); g.lineTo(84, L.Hh); g.stroke();
    g.textBaseline = "middle"; g.textAlign = "left"; g.font = `700 ${L.size}px ${FNT}`;
    let rest = shown; for (const c of L.cells) { if (rest <= 0) break; const n = Math.min(c.s.length, rest); g.fillStyle = c.ink; g.fillText(c.s.slice(0, n), c.x, c.y); rest -= n; }
  });
  return { tex, u: pen[0] / L.W, v: pen[1] / L.Hh, done: shown >= L.tot };
};
// lápiz con la punta en el origen del grupo
const LapizEn: React.FC<{ p: V3; t: number }> = ({ p, t }) => <group position={[p[0], p[1] + 0.012 + 0.006 * Math.abs(Math.sin(t * 14)), p[2]]} rotation={[0, 0.55, 0.5]}><Lapiz p={[0.36, 0, 0]} s={1} /></group>;

// ── 1 · GANABA MÁS (0:27): dos frascos sobre dos tarimas: a la ciudad le caen más monedas pero se le escapan por un hoyo; el del pueblo se llena
const frascoGeo = lathe([[0, 0], [0.32, 0], [0.36, 0.05], [0.36, 0.9], [0.3, 0.98], [0.3, 1.04]]);
const H1Frascos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const D = dur(h), fuga = eio(tt, 0.15 * D, 0.3 * D);
  const nP = Math.min(24, Math.floor(Math.max(0, tt - 0.5) * 24 / (D * 0.75)));
  return <Estudio t={tt} cam={[0, 1.35, 4.3]} look={[0, 0.75, 0.4]} orbit={0.1}>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.75, 0, 0]}>
      <RBox p={[0, 0.15, 0]} s={[0.86, 0.3, 0.86]} r={0.03}>{M.madera("#6a4428")}</RBox>
      <Etq p={[0, 0.16, 0.44]} txt={sd < 0 ? "ciudad" : "pueblo"} w={0.7} h={0.24} bg={sd < 0 ? "#d9d4c8" : "#e9d9b0"} />
      <group position={[0, 0.3, 0]}>
        <mesh geometry={frascoGeo} castShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 1.04, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.3, 0.014, 10, 40]} /><meshPhysicalMaterial color="#ffffff" roughness={0.02} clearcoat={1} transparent opacity={0.7} /></mesh>
        <group scale={2}><Pila p={[0, 0.0, 0]} n={sd < 0 ? 3 : nP} t={99} a={0} /></group>
        {/* lo que entra: la ciudad recibe el doble */}
        {Array.from({ length: sd < 0 ? 8 : 4 }, (_, i) => { const k = ((tt * (sd < 0 ? 1.6 : 0.8)) + i / (sd < 0 ? 8 : 4)) % 1; return tt < 0.1 ? null : <Moneda key={i} p={[(rn(i, sd + 3) - 0.5) * 0.25, 1.3 - k * 1.15, 0]} rot={[k * 9, 0, i]} s={1.7} />; })}
        {sd < 0 && <>
          {/* el hoyo: se marca rojo y las monedas se salen por el frente */}
          <mesh position={[0, 0.07, 0.36]}><torusGeometry args={[0.1, 0.028, 12, 32]} />{M.cromo("#d8b060")}</mesh>
          <mesh position={[0, 0.07, 0.355]} scale={0.001 + fuga}><circleGeometry args={[0.085, 24]} /><meshStandardMaterial color="#120a06" roughness={0.9} /></mesh>
          <mesh position={[0, 0.07, 0.364]}><ringGeometry args={[0.07, 0.07 + 0.03 * fuga, 24]} /><meshBasicMaterial color="#ff4a2a" transparent opacity={fuga * (0.6 + 0.4 * Math.sin(tt * 8))} toneMapped={false} /></mesh>
          {Array.from({ length: 7 }, (_, i) => { const u = ((tt * 1.3) + i / 7) % 1; if (fuga < 0.05) return null;
            const z = 0.36 + u * 0.75, y = Math.max(-0.29, 0.07 - 0.36 * cl((u - 0.12) / 0.4) ** 2);
            return <Moneda key={"f" + i} p={[0.05 * Math.sin(i * 3), y, z]} rot={[u * 12, i, 0]} s={2 * fuga} />; })}
          <Plato p={[0, -0.3, 1.12]} s={0.55} c="#e9e1cf" />
          <group position={[0, -0.28, 1.12]} scale={1.8}><Pila p={[0, 0, 0]} n={Math.floor(fuga * 4 + cl((tt - 0.42 * D) / (0.5 * D)) * 14)} t={99} a={0} /></group>
        </>}
      </group>
    </group>)}
  </Estudio>;
}}</Stage>;

// ── 2 · LA LATA (1:01): salta la tapa de la lata de café y suben los sobres en abanico, de uno en uno; el último, el rojo con «?», arriba al centro
const SOB = ["tortilla", "gas", "luz", "tianguis", "tienda", "pasaje"], NUM = ["1", "2", "3", "4", "5", "6"];
const H2Lata: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const tapa = phys(tt, 0.05, 6, 0.5), slots = [0, 1, 2, 4, 5, 6];
  const sobre = (slot: number, st: number, txt: string, rojo: boolean, j: number) => {
    const k = phys(tt, st, 5.5, 0.5), a = (slot - 3) * 0.4 + 0.03 * Math.sin(tt * 1.4 + j) * cl(k), R = 0.8;
    if (k <= 0.001) return null;
    return <group key={txt} position={[Math.sin(a) * R * k, 0.35 + (0.35 + Math.cos(a) * R * 0.75) * k, -0.1 + 0.2 * k]} rotation={[0, 0, -a * k]} scale={(rojo ? 1.0 : 0.9) * (0.45 + 0.55 * cl(k))}>
      <group rotation={[P2 * cl(k * 1.2), 0, 0]}><Sobre txt={txt} rojo={rojo} /></group></group>;
  };
  return <Estudio t={tt} cam={[0, 1.15, 3.7]} look={[0, 0.8, 0]} orbit={0.1}>
    <Lata p={[0, 0, -0.1]} tapa={9} s={1.0} />
    <group position={[lerp(0, 0.75, cl(tapa)), 0.02 + Math.max(0, Math.sin(cl(tt / 0.7) * P)) * 0.5 * (1 - cl(tapa)) + Math.abs(Math.sin(tt * 9)) * 0.04 * Math.exp(-Math.max(0, tt - 0.7) * 4), lerp(-0.1, 0.35, cl(tapa))]} rotation={[lerp(0, 0.05, cl(tapa)), 0, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.3, 0.3, 0.05, 40]} />{M.cromo("#b08a4a")}</mesh></group>
    
    {slots.map((sl, i) => sobre(sl, 0.35 + i * 0.25, NUM[i], false, i))}
    {sobre(3, 0.35 + 6 * 0.25 + 0.15, "?", true, 7)}
  </Estudio>;
}}</Stage>;

// ── 3 · EL REPARTO (2:38): todo en la mesa: el fajo al fondo suelta un billete por vez, en arco, a cada uno de los 7 sobres; cada sobre se cierra al recibir
const H3Reparto: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), step = Math.min(0.62, (D - 1.4) / 7);
  const pos = (i: number): V3 => i < 4 ? [-0.96 + i * 0.64, 0.015, -0.42] : [-0.96 + (i - 4) * 0.64, 0.015, 0.2];
  const st = (i: number) => 0.45 + i * step, salidos = Array.from({ length: 7 }, (_, i) => tt > st(i)).filter(Boolean).length;
  const F: V3 = [0.98, 0, 0.32], nF = 3 * (7 - salidos) + 8;
  return <Estudio t={tt} cam={[0.05, 1.95, 1.55]} look={[0, 0, -0.08]} orbit={0.05} fov={38}>
    {Array.from({ length: 7 }, (_, i) => { const sol = 0.8 * (1 - phys(tt, st(i) + 0.62, 7, 0.4)), q = pos(i);
      return <group key={i}><Sobre p={q} txt={i === 6 ? "?" : String(i + 1)} rojo={i === 6} s={0.74} solapa={Math.max(0, sol)} /><SombraA p={q} r={0.36} o={0.55} /></group>; })}
    {Array.from({ length: 7 }, (_, i) => { const k = eio(tt, st(i), st(i) + 0.62); if (k <= 0 || k >= 0.999) return null; const q = pos(i), mete = cl((k - 0.82) / 0.18);
      const x = lerp(F[0], q[0], k), z = lerp(F[2], q[2] + 0.03, k), y = lerp(0.12 + nF * 0.011, 0.04, k) + Math.sin(k * P) * 0.5;
      return <group key={i}><Billete p={[x, y, z]} rot={[-P2 + Math.sin(k * P) * 0.4, (1 - k) * 1.2, 0]} v={["200", "100", "50", "500", "20", "200", "100"][i]} s={1.05 - 0.3 * mete} />
        <SombraA p={[x, 0, z]} r={0.18 + 0.12 * (1 - Math.sin(k * P))} o={0.35 + 0.4 * (1 - Math.sin(k * P))} /></group>; })}
    <group position={F}>{Array.from({ length: nF }, (_, j) => <Billete key={j} p={[0.004 * Math.sin(j * 2.1), 0.006 + j * 0.011, 0.004 * Math.cos(j)]} rot={[-P2, 0.25, (rn(j, 7) - 0.5) * 0.08]} v={["200", "100", "500"][j % 3]} s={1.25} />)}
      <mesh position={[0, 0.006 + nF * 0.0055, 0]} rotation={[0, 0.25, 0]}><boxGeometry args={[0.13, nF * 0.011 + 0.014, 0.42]} /><meshStandardMaterial color="#c9a24a" roughness={0.6} /></mesh></group>
    <SombraA p={F} r={0.5} o={0.7} />
  </Estudio>;
}}</Stage>;

// ── 4 · LA LIBRETA (3:18): libreta de espiral de cerca; el lápiz escribe «fecha · qué · cuánto» y abajo «lunes · tortilla · 26», letra por letra
const H4Libreta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const D = dur(h), k = cl((tt - 0.15) / (D * 0.5));
  const e = escrito("lib5", [{ c: ["fecha", "qué", "cuánto"], ink: "#2a1c12" }, { c: ["lunes", "tortilla", "26"] }], k, [0.09, 0.34, 0.6], { size: 96, y0: 200, dy: 210 });
  const PW = 1.4, PH = 1.0;
  return <Estudio t={tt} cam={[0, 1.95, 1.75]} look={[0, 0, 0.05]} orbit={0.06} fov={36}>
    <RBox p={[0, 0.03, 0]} s={[PW + 0.06, 0.06, PH + 0.06]} r={0.015}><meshStandardMaterial color="#2f4f6e" roughness={0.8} /></RBox>
    <mesh position={[0.025, 0.062, 0.02]} rotation={[-P2, 0, 0.035]} receiveShadow><planeGeometry args={[PW, PH]} /><meshStandardMaterial color="#e9e0c8" roughness={0.95} /></mesh>
    <mesh position={[0, 0.066, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[PW, PH]} /><meshStandardMaterial map={e.tex} roughness={0.9} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.65 + i * 0.1, 0.075, -PH / 2 + 0.02]} rotation={[0, P2, 0]} castShadow><torusGeometry args={[0.045, 0.011, 10, 24]} />{M.cromo("#b8bbc0")}</mesh>)}
    <LapizEn p={[Math.min(0.45, (e.u - 0.5) * PW), 0.066 + (e.done ? 0.04 : 0), (e.v - 0.5) * PH]} t={e.done ? 0 : tt} />
  </Estudio>;
}}</Stage>;

// ── 5 · LA TORTILLA (3:30): cae el kilo de tortillas en un plato de la báscula y se va abajo; del otro lado caen monedas hasta equilibrar: 26
const H5Tortilla: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const D = dur(h), ft = cl((tt - 0.3) / 1.2), nT = Math.floor(ft * 12);
  const c0 = 1.4, c1 = Math.min(D - 1.6, c0 + 3.0), nC = Math.floor(cl((tt - c0) / (c1 - c0)) * 26);
  const wob = tt > c1 ? 0.14 * Math.sin((tt - c1) * 8) * Math.exp(-(tt - c1) * 2.2) : 0;
  const inc = Math.max(-1, Math.min(1, nC / 26 - ft)) + wob, ok = phys(tt, c1 + 0.1, 6, 0.45);
  return <Estudio t={tt} cam={[-0.1, 1.2, 3.9]} look={[-0.1, 0.72, 0]} orbit={0.1}>
    <mesh position={[0, 0.98, 0.09]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.06, 6]} />{M.cromo("#d8b060")}</mesh>
    <Bascula inc={inc} izq={<group>{Array.from({ length: nT }, (_, i) => <Tortilla key={i} p={[0.01 * Math.sin(i * 2), 0.01 + i * 0.013 + fall(tt, 0.3 + i * 0.1, 0.5), 0]} c={i % 3 ? "#e9d18f" : "#dcc07a"} />)}</group>}
      der={<group scale={1.2}><Pila p={[0, 0, 0]} n={nC} t={99} a={0} /></group>} />
    {nC < 26 && tt > c0 && <Moneda p={[0.88, 0.75 + ((tt * 3) % 1) * 0.6, 0]} rot={[tt * 9, 0, 0]} s={1.5} />}
    <Etq p={[-0.88, 0.2, 0.45]} rot={[-0.3, 0, 0]} txt="1 kilo" w={0.66} h={0.3} s={phys(tt, 0.6, 6, 0.5)} />
    <Etq p={[0.8, 0.2, 0.45]} rot={[-0.3, 0, 0]} txt="$26" w={0.56} h={0.28} bg="#e9d9b0" ink="#7a2a14" s={ok} />
  </Estudio>;
}}</Stage>;
// báscula de dos platos (copia local: inc -1 = izquierda abajo … 1 = derecha abajo)
const Bascula: React.FC<{ inc: number; izq?: React.ReactNode; der?: React.ReactNode }> = ({ inc, izq, der }) => {
  const a = inc * 0.22, L = 0.88;
  return <group>
    <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.3, 0.36, 0.06, 32]} />{M.cromo("#b08a4a")}</mesh>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.035, 0.05, 0.95, 16]} />{M.cromo("#b08a4a")}</mesh>
    <mesh position={[0, 0.98, 0.03]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.08, 20]} />{M.cromo("#8a6a3a")}</mesh>
    <group position={[0, 0.98, 0]} rotation={[0, 0, a]}>
      <mesh rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.025, 0.025, L * 2, 12]} />{M.cromo("#c9a24a")}</mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * L, 0, 0]} rotation={[0, 0, -a]}>
        <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.006, 0.006, 0.5, 6]} />{M.cromo()}</mesh>
        <group position={[0, -0.52, 0]}><mesh geometry={lathe([[0, 0], [0.36, 0.02], [0.42, 0.07]])} castShadow receiveShadow>{M.cromo("#c9a24a")}</mesh>
          <group position={[0, 0.03, 0]}>{sd < 0 ? izq : der}</group></group>
      </group>)}
    </group>
  </group>;
};

// ── 6 · LA BOLSA QUE SUDA (4:38): la bolsa de plástico cae sobre las tortillas calientes, se empaña, chorrea y les sale moho; el tortillero de palma con su servilleta, sano
// bolsa arrugada: esfera con ruido por posición (los vértices repetidos se mueven igual: sin grietas)
const bolsaGeo = (() => { const g = new THREE.IcosahedronGeometry(1, 5), q = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < q.count; i++) { const x = q.getX(i), y = q.getY(i), z = q.getZ(i), n = 1 + 0.07 * Math.sin(x * 11 + y * 7) * Math.cos(z * 13 - x * 5) + 0.05 * Math.sin(y * 23 + z * 17);
    q.setXYZ(i, x * n, Math.max(-0.15, y) * n, z * n); }
  g.computeVertexNormals(); return g; })();
const H6Bolsa: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const D = dur(h), cae = fall(tt, -0.25, 0.6), sudor = eio(tt, 0.4, 0.45 * D), moho = eio(tt, 0.35 * D, 0.8 * D), apl = tt > 0.6 ? Math.exp(-(tt - 0.6) * 6) * 0.25 : 0;
  return <Estudio t={tt} cam={[-0.05, 1.05, 1.6]} look={[-0.05, 0.12, 0]} orbit={0.08}>
    <group position={[-0.55, 0, 0]}>
      {Array.from({ length: 9 }, (_, i) => <Tortilla key={i} p={[0, 0.02 + i * 0.014, 0]} c={col("#e9d18f", "#c4b98a", moho * 0.6)} />)}
      {Array.from({ length: 14 }, (_, i) => <mesh key={"m" + i} position={[(rn(i, 1) - 0.5) * 0.42, 0.148, (rn(i, 2) - 0.5) * 0.42]} scale={[0.001 + 0.07 * moho * (0.5 + rn(i, 3)), 0.001 + 0.025 * moho, 0.001 + 0.07 * moho * (0.5 + rn(i, 3))]}><sphereGeometry args={[1, 14, 8]} /><meshStandardMaterial color={i % 3 ? "#2f6a2a" : "#1a3a1c"} roughness={1} /></mesh>)}
      <group position={[0, cae, 0]}>
        <mesh geometry={bolsaGeo} position={[0, 0.09, 0]} scale={[0.38 * (1 + apl), 0.13 * (1 - apl), 0.36 * (1 + apl)]}><meshPhysicalMaterial color={col("#ffffff", "#e6eef0", sudor)} roughness={0.08 + 0.3 * sudor} clearcoat={1} clearcoatRoughness={0.08} transmission={0} transparent opacity={0.28 + 0.22 * sudor} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        <mesh position={[0.4, 0.1, 0]} rotation={[0, 0, -1.2]} scale={[1, 1.6, 1]}><coneGeometry args={[0.05, 0.16, 10]} /><meshPhysicalMaterial color="#f4f6f6" roughness={0.2} clearcoat={1} transparent opacity={0.6} /></mesh>
        <mesh position={[0.36, 0.1, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.03, 0.012, 8, 16]} /><meshPhysicalMaterial color="#eef2f2" roughness={0.25} clearcoat={1} /></mesh>
        {Array.from({ length: 40 }, (_, i) => { const a = rn(i, 4) * 6.28, e = 0.15 + rn(i, 5) * 1.2, slide = ((tt * 0.25 + rn(i, 8)) % 1) * sudor * 0.5;
          return <Gota key={i} p={[Math.cos(a) * 0.38 * Math.cos(e - slide), 0.09 + 0.13 * Math.sin(e - slide), Math.sin(a) * 0.36 * Math.cos(e - slide)]} s={sudor * (0.8 + rn(i, 6))} />; })}
      </group>
      <Vapor t={tt} p={[0, 0.2, 0]} o={0.3 * (1 - sudor)} h={0.5} s={0.2} />
    </group>
    <group position={[0.58, 0, 0]} scale={1.15}>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow><cylinderGeometry args={[0.4, 0.34, 0.18, 40, 1, true]} /><meshStandardMaterial map={tejido("#d8b86a", "#9a7a3e")} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.34, 32]} /><meshStandardMaterial map={tejido("#d8b86a", "#9a7a3e")} roughness={0.95} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <Tortilla key={i} p={[0, 0.03 + i * 0.014, 0]} />)}
      <mesh position={[0.02, 0.17 + 0.006 * Math.sin(tt * 1.5), 0.02]} rotation={[-P2 + 0.12, 0, 0.3]}><planeGeometry args={[0.86, 0.6, 8, 4]} /><meshStandardMaterial map={servilleta()} roughness={1} side={THREE.DoubleSide} /></mesh>
      <Vapor t={tt} p={[0, 0.22, 0]} o={0.25} h={0.45} s={0.18} />
    </group>
  </Estudio>;
}}</Stage>;
const servilleta = () => ctex("servi", 512, 360, (g) => {
  g.fillStyle = "#f4efe4"; g.fillRect(0, 0, 512, 360);
  const cs = ["#c0392b", "#2e86c1", "#f1c40f", "#27ae60", "#8e44ad"];
  for (let i = 0; i < 26; i++) { const x = 20 + i * 18.6; [16, 336].forEach((y) => { g.fillStyle = cs[i % 5]; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }); }
  for (let i = 0; i < 18; i++) { const y = 34 + i * 16.4; [16, 496].forEach((x) => { g.fillStyle = cs[(i + 2) % 5]; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }); }
  for (let a = 0; a < 8; a++) { g.fillStyle = cs[a % 5]; g.beginPath(); g.ellipse(256 + Math.cos(a * 0.785) * 34, 180 + Math.sin(a * 0.785) * 34, 22, 10, a * 0.785, 0, 7); g.fill(); }
  g.fillStyle = "#f1c40f"; g.beginPath(); g.arc(256, 180, 16, 0, 7); g.fill();
});

// ── 7 · 200 CONTRA 80 (5:10): dos torres de monedas que suben a la par; la de 80 se para y la de 200 sigue; lo que sobra late en rojo
const H7Torres: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), dt = Math.min(0.055, (D - 1.4) / 40), fin = 0.2 + 40 * dt, glow = eio(tt, fin, fin + 0.4);
  return <Estudio t={tt} cam={[0, 1.0, 3.3]} look={[0, 0.78, 0]} orbit={0.12}>
    <group position={[-0.55, 0, 0]} scale={1.6}><Pila p={[0, 0, 0]} n={40} t={tt} a={0.2} dt={dt} /></group>
    <group position={[0.55, 0, 0]} scale={1.6}><Pila p={[0, 0, 0]} n={16} t={tt} a={0.2} dt={dt} /></group>
    <mesh position={[-0.55, (0.49 + 1.24) / 2, 0]}><cylinderGeometry args={[0.25, 0.25, 0.75, 32, 1, true]} /><meshPhysicalMaterial color="#ff5a3a" transparent opacity={0.001 + glow * 0.16} roughness={0.05} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {[0.49, 1.24].map((y) => <mesh key={y} position={[-0.55, y, 0]} rotation={[P2, 0, 0]} scale={Math.max(0.001, glow)}><torusGeometry args={[0.25, 0.012, 8, 40]} /><meshBasicMaterial color="#ff4a2a" toneMapped={false} /></mesh>)}
    <pointLight position={[-0.55, 1.2, 0.5]} intensity={0.01 + 1.6 * glow} distance={2.5} color="#ff5a3a" />
    <Etq p={[-0.55, 1.45, 0]} txt="200" w={0.5} h={0.28} bg="#d9d4c8" ink="#7a2a14" s={phys(tt, fin, 6, 0.5)} />
    <Etq p={[0.55, 0.72, 0]} txt="80" w={0.5} h={0.28} s={phys(tt, 0.2 + 16 * dt, 6, 0.5)} />
  </Estudio>;
}}</Stage>;

// ── 8 · EL CILINDRO (5:48): el cilindro con su reloj de presión al frente; el calendario arranca 10 semanas y la aguja casi no se mueve
const dialTex = () => ctex("dialgas2", 256, 256, (g) => { g.fillStyle = "#f4f1ea"; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.lineWidth = 26; g.strokeStyle = "#c0392b"; g.beginPath(); g.arc(128, 128, 90, P * 0.75, P * 1.05); g.stroke(); g.strokeStyle = "#3f9a4a"; g.beginPath(); g.arc(128, 128, 90, P * 1.05, P * 2.25); g.stroke();
  g.fillStyle = "#222"; g.beginPath(); g.arc(128, 128, 12, 0, 7); g.fill(); });
const calTex = (i: number) => ctex("cal" + i, 512, 480, (g) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 512, 480); g.fillStyle = "#c0392b"; g.fillRect(0, 0, 512, 110);
  g.fillStyle = i < 10 ? "#2a1c12" : "#a0201a"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `700 ${i < 10 ? 230 : 200}px ${FNT}`; g.fillText(i < 10 ? String(i + 1) : "10", 256, i < 10 ? 290 : 260);
  g.font = `700 ${i < 10 ? 70 : 74}px ${FNT}`; g.fillText(i < 10 ? "semana" : "semanas", 256, i < 10 ? 160 : 420); });
const garrafaGeo = lathe([[0, 0.02], [0.3, 0.02], [0.35, 0.08], [0.37, 0.2], [0.37, 0.95], [0.34, 1.07], [0.24, 1.17], [0.11, 1.22], [0.09, 1.24]], 48);
const H8Cilindro: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), st = Math.min(0.3, (D - 1.2) / 10), sem = cl((tt - 0.4) / (st * 10)), th = lerp(2.2, 1.55, sem) * P;
  return <Estudio t={tt} cam={[0, 1.0, 3.0]} look={[0, 0.75, 0]} orbit={0.1}>
    <group position={[-0.6, 0, 0]}>
      <mesh geometry={garrafaGeo} castShadow receiveShadow><meshStandardMaterial color="#b9bdb8" roughness={0.42} metalness={0.55} /></mesh>
      <mesh position={[0, 1.24, 0]}><cylinderGeometry args={[0.09, 0.11, 0.14, 20]} /><meshStandardMaterial color="#9aa0a6" roughness={0.35} metalness={0.7} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.2, 1.27, 0]} rotation={[0, 0, sd * 0.15]}><boxGeometry args={[0.04, 0.22, 0.12]} /><meshStandardMaterial color="#9aa0a6" roughness={0.35} metalness={0.7} /></mesh>)}
      <mesh position={[0, 1.38, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.22, 0.03, 10, 40, P]} /><meshStandardMaterial color="#9aa0a6" roughness={0.35} metalness={0.7} /></mesh>
      <mesh position={[0, 1.36, 0]}><cylinderGeometry args={[0.045, 0.05, 0.12, 14]} />{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0, 1.43, 0]}><cylinderGeometry args={[0.07, 0.07, 0.025, 6]} />{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0, 1.36, 0.08]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.14, 10]} />{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0, 0.02, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.36, 0.03, 10, 40]} /><meshStandardMaterial color="#7a8086" roughness={0.4} metalness={0.7} /></mesh>
      <group position={[0, 1.36, 0.2]} scale={0.85}>
        <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.06, 40]} />{M.cromo()}</mesh>
        <mesh position={[0, 0, 0.032]}><circleGeometry args={[0.18, 40]} /><meshStandardMaterial map={dialTex()} /></mesh>
        <group position={[0, 0, 0.036]} rotation={[0, 0, -th - P2]}><mesh position={[0, 0.07, 0]}><planeGeometry args={[0.016, 0.15]} /><meshBasicMaterial color="#111" side={THREE.DoubleSide} /></mesh></group>
      </group>
    </group>
    <group position={[0.62, 0.02, 0]} rotation={[-0.12, -0.15, 0]}>
      <RBox p={[0, 0.42, -0.03]} s={[0.8, 0.84, 0.05]} r={0.02}>{M.madera("#5a3a22")}</RBox>
      <mesh position={[0, 0.42, 0.0]}><planeGeometry args={[0.72, 0.68]} /><meshStandardMaterial map={calTex(10)} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const k = eio(tt, 0.4 + i * st, 0.4 + i * st + 0.45); if (k >= 0.999) return null;
        return <group key={i} position={[-0.9 * k, 0.76 + 0.7 * k, 0.004 + (10 - i) * 0.002 + 0.3 * k]} rotation={[-k * 2.4, 0, 0.6 * k]}>
          <mesh position={[0, -0.34, 0]}><planeGeometry args={[0.72, 0.68]} /><meshStandardMaterial map={calTex(i)} transparent opacity={k < 0.75 ? 1 : 1 - (k - 0.75) * 4} side={THREE.DoubleSide} /></mesh></group>; })}
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.3 + i * 0.12, 0.79, 0.01]} rotation={[0, P2, 0]}><torusGeometry args={[0.03, 0.006, 8, 16]} />{M.cromo()}</mesh>)}
    </group>
  </Estudio>;
}}</Stage>;

// ── 9 · LA OLLA TAPADA (6:27): dos ollas en la estufa; la tapa cae en una (destello) y su llama baja a la mitad; la otra sigue a todo fuego echando vapor
const H9Ollas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const D = dur(h), tapa = phys(tt, 0.25, 7, 0.32), baja = eio(tt, 0.9, Math.min(D - 0.8, 2.0)), pulso = tt > 0.62 ? Math.exp(-(tt - 0.62) * 4) : 0;
  return <Estudio t={tt} cam={[0, 1.45, 2.7]} look={[0, 0.42, 0]} orbit={0.1}>
    <RBox p={[0, 0.06, 0]} s={[2.4, 0.12, 1.1]} r={0.03}>{M.hierro()}</RBox>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.62, 0.12, 0]}>
      <Llama p={[0, 0.01, 0]} f={sd < 0 ? 1.5 : lerp(0.95, 0.2, baja)} t={tt} />
      <Olla p={[0, 0.08, 0]} mat="peltre" nivel={0.8} caldo="#9ab8c8" hervor={sd < 0 ? 1 : 0.6 * (1 - baja) + 0.2} t={tt} s={0.6} />
      {sd > 0 && <group position={[lerp(0.35, 0, cl(tapa)), 0.6 + lerp(0.5, 0, cl(tapa)), 0]} rotation={[0, 0, lerp(-0.6, 0, cl(tapa))]}>
        <mesh castShadow><cylinderGeometry args={[0.43, 0.41, 0.03, 40]} /><meshPhysicalMaterial color="#2c4a6e" roughness={0.25} clearcoat={1} /></mesh>
        <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.05, 16, 10]} />{M.hierro()}</mesh></group>}
      <Vapor t={tt} p={[0, 0.58, 0]} n={sd < 0 ? 34 : 8} o={sd < 0 ? 1 : 0.3 * (1 - cl(tapa))} h={1.5} s={sd < 0 ? 1.0 : 0.4} spread={0.5} />
      {sd < 0 && <pointLight position={[0, 0.15, 0.35]} intensity={2.2} distance={1.4} color="#ffb040" />}
      <mesh position={[0, -0.02, 0.56]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.05, 20]} />{M.cromo("#c9c9c4")}</mesh>
    </group>)}
    <pointLight position={[0.62, 0.9, 0.5]} intensity={0.01 + 7 * pulso} distance={2.2} color="#dbe8ff" />
    <mesh position={[0.62, 0.72, 0.3]} scale={0.001 + 0.5 * pulso}><circleGeometry args={[1, 32]} /><meshBasicMaterial color="#fff6e0" transparent opacity={0.5 * pulso} depthWrite={false} toneMapped={false} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 10 · LA MANGUERA NEGRA (6:47): en el techo de lámina, la espiral de manguera; sale el sol, la espiral se pone al rojo y el tambo de al lado echa vapor
const curve = (() => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 360; i++) { const a = i * 0.09, r = 0.06 + a * 0.021; pts.push(new THREE.Vector3(Math.cos(a) * r, 0.03, Math.sin(a) * r)); } return new THREE.CatmullRomCurve3(pts); })();
const laminaTex = () => ctex("lamina", 512, 512, (g) => { for (let x = 0; x < 512; x++) { const v = 0.5 + 0.5 * Math.sin(x / 512 * P * 2 * 18); g.fillStyle = `rgb(${120 + v * 70},${122 + v * 70},${126 + v * 70})`; g.fillRect(x, 0, 1, 512); }
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(110,60,30,${0.12 * rn(i, 3)})`; g.fillRect(rn(i, 1) * 512, rn(i, 2) * 512, 4 + rn(i, 4) * 10, 3); } });
const laminaGeo = (() => { const g = new THREE.PlaneGeometry(5, 3.2, 240, 4), q = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < q.count; i++) q.setZ(i, 0.035 * Math.sin(q.getX(i) * P * 2 * 9)); g.computeVertexNormals(); return g; })();
const H10Manguera: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const D = dur(h), sol = eio(tt, 0.3, 0.45 * D), calor = eio(tt, 0.3 * D, 0.8 * D);
  return <Estudio t={tt} cam={[0.15, 1.5, 3.0]} look={[0.15, 0.35, 0]} orbit={0.1} mesa={false}>
    <mesh geometry={laminaGeo} rotation={[-P2 + 0.06, 0, 0]} position={[0, -0.03, 0]} receiveShadow><meshStandardMaterial map={laminaTex()} roughness={0.42} metalness={0.6} /></mesh>
    <mesh position={[-0.35, 0.02, 0.15]} castShadow receiveShadow><tubeGeometry args={[curve, 600, 0.03, 8, false]} /><meshStandardMaterial color={col("#141414", "#5a1a08", calor)} roughness={0.45} emissive="#ff4a1a" emissiveIntensity={0.05 + 0.9 * calor} /></mesh>
    <Tambo p={[1.2, 0, -0.05]} nivel={0.8} t={tt} s={0.72} />
    <mesh position={[0.45, 0.1, 0.1]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.75, 10]} /><meshStandardMaterial color="#151515" roughness={0.5} /></mesh>
    <mesh position={[1.05, lerp(-0.35, 0.95, sol), -2.3]}><sphereGeometry args={[0.32, 32, 20]} /><meshBasicMaterial color={col("#ff9a3a", "#fff0b0", sol)} toneMapped={false} /></mesh>
    <directionalLight position={[1.05, 1.5, -2.3]} intensity={0.01 + 3.2 * sol} color="#ffd27a" castShadow />
    <Vapor t={tt} p={[1.2, 0.7, -0.05]} n={18} o={0.9 * calor} h={1.0} s={0.36} />
    <Etq p={[-0.35, 0.55, -0.8]} rot={[-0.2, 0, 0]} txt="$200 · 4 años" w={0.9} h={0.26} s={phys(tt, 0.5 * D, 6, 0.5)} />
  </Estudio>;
}}</Stage>;

// ── 11 · EL PILOTO (7:18): tanque de vidrio grande en tres tercios; la llamita del piloto se chupa el gas por un tubo y el tercio de arriba se vacía solo
const H11Piloto: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), baja = cl(phys(tt, 0.7, 2.2, 0.55) * eio(tt, 0.7, 0.72 * D)), fluye = baja > 0.02 && baja < 0.98 ? 1 : 0, ola = 0.012 * Math.sin(tt * 6) * fluye;
  const tubo = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.28, 1.27, 0), new THREE.Vector3(-0.05, 1.5, 0.05), new THREE.Vector3(0.35, 1.25, 0.1), new THREE.Vector3(0.55, 0.7, 0.12), new THREE.Vector3(0.62, 0.32, 0.12)]);
  const fl = 1 + 0.08 * Math.sin(tt * 2 * P * 1.6);
  return <Estudio t={tt} cam={[0.05, 1.0, 3.0]} look={[0.12, 0.68, 0]} orbit={0.08}>
    <group position={[-0.28, 0, 0]}>
      {[0, 1, 2].map((i) => { const lv = i === 2 ? 1 - baja : 1; return <mesh key={i} position={[0, 0.06 + i * 0.4 + 0.18 * lv + (i === 2 ? ola : 0), 0]}><cylinderGeometry args={[0.4, 0.4, 0.36 * lv + 0.001, 40]} />{M.liquido(i === 2 ? "#3f8ad8" : "#2f6fb8", 0.78)}</mesh>; })}
      <mesh position={[0, 0.63, 0]}><cylinderGeometry args={[0.44, 0.44, 1.26, 40, 1, true]} />{M.vidrio()}</mesh>
      {[0.04, 0.44, 0.84, 1.24].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.445, 0.018, 8, 48]} />{M.cromo("#c9a24a")}</mesh>)}
      <SombraA p={[0, 0, 0]} r={0.6} o={0.6} />
    </group>
    <mesh><tubeGeometry args={[tubo, 60, 0.03, 10, false]} /><meshStandardMaterial color="#2a2a2a" roughness={0.55} /></mesh>
    {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.7 + i / 10) % 1, q = tubo.getPoint(u); return <mesh key={i} position={[q.x, q.y + 0.04, q.z + 0.03]} scale={Math.max(0.001, 0.035 * fluye)}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#9ac4ff" transparent opacity={0.9} toneMapped={false} /></mesh>; })}
    <group position={[0.62, 0, 0.12]}>
      <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.13, 0.17, 0.24, 24]} />{M.cromo("#9a9da2")}</mesh>
      <mesh position={[0, 0.25, 0]} scale={[1.5 * fl, 1.9 * fl, 1.5 * fl]} geometry={llamaGeoA}><meshBasicMaterial color="#3f7cff" transparent opacity={0.75} depthWrite={false} toneMapped={false} /></mesh>
      <mesh position={[0, 0.25, 0]} scale={[0.75, 0.9 * fl, 0.75]} geometry={llamaGeoA}><meshBasicMaterial color="#dff0ff" transparent opacity={0.9} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight position={[0, 0.5, 0.25]} intensity={1.6} distance={1.6} color="#7ab0ff" />
      <SombraA p={[0, 0, 0]} r={0.26} o={0.6} />
    </group>
  </Estudio>;
}}</Stage>;

// ── 12 · EL RECIBO (7:58): cae pesado el recibo rojo de $700; después, livianito, el de $96; encima cae un foco LED y se prende
const reciboTex = (key: string, city: string, amt: string, ink: string) => ctex("rec" + key, 400, 840, (g) => {
  g.fillStyle = "#f6f4ee"; g.fillRect(0, 0, 400, 840);
  for (let i = 0; i < 9; i++) { g.fillStyle = "rgba(60,60,60,.16)"; g.fillRect(40, 300 + i * 26, 120 + rn(i, 3) * 200, 10); }
  g.fillStyle = ink; g.fillRect(0, 0, 400, 26); g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `700 64px ${FNT}`; g.fillText(city, 200, 110); g.font = `900 150px Montserrat, Arial`; g.fillText(amt, 200, 640);
  for (let x = 0; x < 400; x += 20) { g.fillStyle = "#e6e2d8"; g.beginPath(); g.moveTo(x, 840); g.lineTo(x + 10, 828); g.lineTo(x + 20, 840); g.fill(); }
});
const H12Recibo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), ya = fall(tt, 0.05, 0.75), b = eio(tt, 0.7, 1.6), f0 = Math.min(2.0, 0.42 * D), fo = fall(tt, f0, 0.7), on = eio(tt, f0 + 0.4, f0 + 0.8);
  const osc = (1 - on * 0.65);
  return <Estudio t={tt} cam={[0.1, 2.3, 2.0]} look={[0.12, 0, 0.0]} orbit={0.06} fov={38}>
    <group position={[-0.5, 0.02 + ya, 0.05]} rotation={[-P2, 0, 0.1 + ya * 0.8]}>
      <mesh geometry={arrugaGeoA} castShadow receiveShadow><meshStandardMaterial map={reciboTex("gdl5", "", "$700", "#b3201a")} color={new THREE.Color(osc, osc, osc)} side={THREE.DoubleSide} roughness={0.9} /></mesh></group>
    <SombraA p={[-0.5, 0, 0.05]} r={0.5 + ya * 0.3} o={0.6 - ya * 0.4} />
    <group position={[0.22 + 0.25 * (1 - b), 0.016 + (1 - b) * 0.5, 0.05]} rotation={[-P2 + 0.4 * Math.sin(b * P * 2) * (1 - b), 0.5 * (1 - b), -0.08 + 0.9 * (1 - b)]}>
      <mesh castShadow><planeGeometry args={[0.5, 1.05]} /><meshStandardMaterial map={reciboTex("pue5", "", "$96", "#2e6a2a")} side={THREE.DoubleSide} emissive="#ffe2a0" emissiveIntensity={0.25 * on} /></mesh></group>
    <SombraA p={[0.22, 0, 0.05]} r={0.45} o={0.2 + 0.4 * b} />
    <group position={[0.62, 0.1 + fo, 0.45]} rotation={[0, 0.4, P2 * 0.92]} scale={1.5}>
      <mesh position={[0, 0.11, 0]}><sphereGeometry args={[0.1, 32, 20]} /><meshPhysicalMaterial color="#f4f6f8" emissive="#ffe08a" emissiveIntensity={0.05 + 3 * on} roughness={0.2} transparent opacity={0.95} /></mesh>
      <mesh position={[0, -0.02, 0]} castShadow><cylinderGeometry args={[0.045, 0.04, 0.1, 20]} />{M.cromo("#a9acb2")}</mesh>
    </group>
    <SombraA p={[0.62, 0, 0.45]} r={0.22} o={0.6} />
    <pointLight position={[0.45, 0.45, 0.35]} intensity={0.01 + 3.5 * on} distance={1.8} color="#ffd98a" />
    <sprite position={[0.5, 0.2, 0.42]} scale={[Math.max(0.001, 1.3 * on), Math.max(0.001, 1.3 * on), 1]}><spriteMaterial map={nubeTexA()} color="#ffe08a" transparent opacity={0.55 * on} depthWrite={false} toneMapped={false} /></sprite>
  </Estudio>;
}}</Stage>;

// ── 13 · EL BILLETE EN EL EMPAQUE (8:43): de cerca, la puerta del refri se cierra sobre un billete de 20; el billete se sale solito y por la rendija cae el frío
const H13Empaque: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const D = dur(h), cierra = eio(tt, 0.1, 0.75), suelta = eio(tt, 0.35 * D, 0.5 * D), cae = Math.max(0, tt - 0.5 * D), frio = eio(tt, 0.38 * D, 0.6 * D);
  const ang = lerp(0.85, 0.02 + 0.05 * suelta, cierra), byB = 0.82 - (cae > 0 ? Math.min(0.7, 4.9 * cae * cae) : 0) - 0.08 * suelta;
  const blanco = <meshPhysicalMaterial color="#f3f4f1" roughness={0.26} clearcoat={0.7} />, goma = <meshStandardMaterial color="#141416" roughness={0.8} />;
  return <Estudio t={tt} cam={[0.75, 1.0, 1.75]} look={[0.02, 0.66, 0.1]} orbit={0.04} mesa="sombra">
    <RBox p={[0, 0.66, -0.36]} s={[1.5, 1.32, 0.04]} r={0.02}><meshStandardMaterial color="#9ec8ee" emissive="#6aa8e0" emissiveIntensity={0.7} /></RBox>
    <pointLight position={[0, 0.7, -0.2]} intensity={2.2 * (0.4 + 0.6 * (1 - cierra))} distance={1.5} color="#bfe0ff" />
    <RBox p={[0, 0.02, -0.15]} s={[1.56, 0.04, 0.45]} r={0.01}>{blanco}</RBox>
    <RBox p={[0, 1.33, -0.15]} s={[1.56, 0.04, 0.45]} r={0.01}>{blanco}</RBox>
    <group position={[-0.02, 0.675, 0.08]}>
      <RBox p={[-0.37, 0, 0]} s={[0.72, 1.27, 0.09]} r={0.03}>{blanco}</RBox>
      <mesh position={[0, 0, -0.01]}><capsuleGeometry args={[0.028, 1.18, 6, 12]} />{goma}</mesh>
      <RBox p={[-0.09, 0.1, 0.07]} s={[0.035, 0.5, 0.035]} r={0.015}>{M.cromo()}</RBox></group>
    <group position={[0.74, 0.675, 0.08]} rotation={[0, -ang, 0]}>
      <RBox p={[-0.37, 0, 0]} s={[0.72, 1.27, 0.09]} r={0.03}>{blanco}</RBox>
      <mesh position={[-0.715, 0, -0.01]}><capsuleGeometry args={[0.028, 1.18, 6, 12]} />{goma}</mesh>
      <RBox p={[-0.63, 0.1, 0.07]} s={[0.035, 0.5, 0.035]} r={0.015}>{M.cromo()}</RBox></group>
    <group position={[0.0, byB, 0.2 + 0.08 * suelta]} rotation={[-cl(cae * 2.5) * 1.1, -0.55, -0.08 * suelta]}><Billete p={[0, 0, 0]} v="20" s={1.25} /></group>
    {cae > 0 && <SombraA p={[0.05, 0, 0.35]} r={0.25} o={cl(cae * 3)} />}
    {Array.from({ length: 26 }, (_, i) => { const u = (tt * 0.35 + i / 26) % 1, y = lerp(1.15 - rn(i, 1) * 0.8, 0.02, u * u), x = (rn(i, 2) - 0.5) * 0.1 + u * 0.25 * (rn(i, 4) - 0.4), z = 0.18 + u * 0.45 * rn(i, 3);
      const sc = Math.max(0.001, (0.18 + 0.34 * u) * frio); return <sprite key={i} position={[x, y, z]} scale={[sc, sc, 1]}><spriteMaterial map={nubeTexA()} color="#bfe2ff" transparent opacity={0.4 * (1 - u) * frio} depthWrite={false} /></sprite>; })}
  </Estudio>;
}}</Stage>;

// ── 14 · EL TERMOSTATO (9:00): la perilla enorme gira del 5 al 3 con su clic; la cámara se abre y el refri se separa una cuarta de la pared
const perillaTex = () => ctex("perilla2", 512, 512, (g) => { g.fillStyle = "#f2f2ee"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.fillStyle = "#222"; g.font = "900 84px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 1; i <= 5; i++) { const a = -P * 0.75 + (i - 1) * P * 0.375; g.fillText(String(i), 256 + Math.cos(a) * 185, 256 + Math.sin(a) * 185); }
  g.strokeStyle = "#bbb"; g.lineWidth = 6; g.beginPath(); g.arc(256, 256, 120, 0, 7); g.stroke(); });
const H14Termo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const D = dur(h), gst = 2 * cl((tt - 0.15) / Math.max(0.8, 0.4 * D)), abre = eio(tt, 0.55 * D, 0.72 * D), sep = eio(tt, 0.55 * D, 0.78 * D), ok = phys(tt, 0.8 * D, 6, 0.5);
  const fz = lerp(-0.55, -0.3, sep);
  const cam: V3 = [lerp(0.33, 2.3, abre), lerp(1.56, 1.55, abre), lerp(0.98 + fz, 3.5, abre)], look: V3 = [lerp(0.2, 0, abre), lerp(1.55, 0.85, abre), lerp(0.42 + fz, -0.3, abre)];
  const ang = -(4 - eio(gst, 0, 1) - eio(gst, 1, 2)) * P * 0.375 + P * 0.75;
  return <Estudio t={tt} cam={cam} look={look} orbit={0.06} mesa={false}>
    <mesh position={[0, 1.5, -1.0]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial color="#e9e2d2" roughness={0.95} /></mesh>
    <mesh rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#b0743e" roughness={0.9} /></mesh>
    <group position={[0, 0, fz]}>
      <RBox p={[0, 1.0, 0]} s={[0.9, 2.0, 0.8]} r={0.08}><meshPhysicalMaterial color="#eef0ee" roughness={0.3} clearcoat={0.6} /></RBox>
      <group position={[0.2, 1.55, 0.41]}>
        <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.02, 40]} /><meshStandardMaterial map={perillaTex()} /></mesh>
        <group rotation={[0, 0, ang]}><RBox p={[0, 0, 0.03]} s={[0.2, 0.045, 0.05]} r={0.015}><meshStandardMaterial color="#3a3a3a" roughness={0.4} /></RBox>
          <mesh position={[0.085, 0, 0.058]}><circleGeometry args={[0.012, 12]} /><meshBasicMaterial color="#c0392b" /></mesh></group>
        <mesh position={[0, 0, 0.07]} scale={0.001 + 0.3 * (gst >= 2 ? Math.exp(-(tt - 0.15 - Math.max(0.8, 0.4 * D)) * 5) : 0)}><ringGeometry args={[0.55, 0.62, 40]} /><meshBasicMaterial color="#ffe08a" transparent opacity={0.8} toneMapped={false} /></mesh>
      </group>
    </group>
    <mesh position={[0.3, 0.012, (-1.0 + fz - 0.4) / 2]} rotation={[-P2, 0, 0]} scale={[1, Math.max(0.001, sep), 1]}><planeGeometry args={[0.07, Math.abs(fz - 0.4 + 1.0)]} /><meshStandardMaterial color="#f2c230" roughness={0.6} /></mesh>
    <Etq p={[0.75, 0.6, -0.55]} rot={[0, -0.3, 0]} txt="una cuarta" w={0.6} h={0.24} s={ok} />
    {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.5 + i / 8) % 1; return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.7, 0.3 + u * 1.8, -0.82]} scale={0.001 + 0.05 * sep}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffd0a0" transparent opacity={0.45 * (1 - u)} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 16 · EL TAMBO DE LLUVIA (10:30): por el canal de lámina baja un chorro grueso al tambo de 200 litros; salpica y el agua sube raya por raya
const H16Tambo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#141a20" mesa={false}>{(tt) => {
  const D = dur(h), lv = 0.08 + eio(tt, 0.4, D - 0.6) * 0.86, sup = 0.03 + 0.86 * lv * 1.1;
  return <Estudio t={tt} cam={[0.5, 1.25, 3.1]} look={[0.15, 0.68, 0]} orbit={0.1} mesa={false}>
    <mesh rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#5a4a3a" roughness={0.5} /></mesh>
        <group scale={1.1}><Tambo p={[0.15, 0, 0]} nivel={lv} t={tt} /></group>
    {[0.25, 0.5, 0.75, 1].map((y) => <mesh key={y} position={[0.15 * 1.1 + 0.33, 0.03 + 0.86 * y * 1.1, 0.27]} rotation={[0, 0.6, 0]}><boxGeometry args={[0.3, 0.03, 0.006]} /><meshBasicMaterial color={y === 1 ? "#ffd24a" : "#ffffff"} toneMapped={false} /></mesh>)}
    <group position={[-0.45, 1.55, -0.2]} rotation={[0, 0.25, -0.32]}>
      <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.2, 0.2, 1.5, 24, 1, true, 0, P]} /><meshStandardMaterial map={laminaTex()} metalness={0.6} roughness={0.35} side={THREE.DoubleSide} /></mesh>
    </group>
    <Chorro a={[0.17 + 0.02 * Math.sin(tt * 7), 1.33, 0.0]} b={[0.17, sup, 0.0]} r={0.085} c="#cfe8f2" o={0.8} />
    <Chorro a={[0.21, 1.33, 0.03]} b={[0.2 + 0.03 * Math.sin(tt * 11), sup, 0.04 * Math.cos(tt * 9)]} r={0.035} c="#e6f4fa" o={0.6} />
    <mesh position={[0.45, 0.004, 0.45]} rotation={[-P2, 0, 0]} scale={[0.001 + 0.7 * lv, 0.001 + 0.45 * lv, 1]}><circleGeometry args={[1, 32]} /><meshPhysicalMaterial color="#8aa4b0" roughness={0.02} metalness={0.2} transparent opacity={0.55} clearcoat={1} /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const u = (tt * 1.6 + i / 14) % 1, a = i * 2.4; return <mesh key={i} position={[0.17 + Math.cos(a) * u * 0.3, sup + Math.sin(u * P) * 0.18, Math.sin(a) * u * 0.3]} scale={0.022 * (1 - u) + 0.001}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#e6f4fa" transparent opacity={0.8} /></mesh>; })}
    {Array.from({ length: 40 }, (_, i) => { const u = (tt * 2.2 + rn(i, 1)) % 1; return <mesh key={"r" + i} position={[(rn(i, 2) - 0.5) * 4, 3 - u * 3, (rn(i, 3) - 0.5) * 2 - 0.5]} scale={[0.006, 0.08, 0.006]}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#cfe0ea" transparent opacity={0.4} /></mesh>; })}
    {[50, 100, 150, 200].map((v, i) => <Etq key={v} p={[0.15 * 1.1 + 0.62, 0.03 + 0.86 * (i + 1) / 4 * 1.1, 0.28]} rot={[0, -0.4, 0]} txt={String(v)} w={0.26} h={0.15} bg={v === 200 ? "#ffe08a" : "#e9e4d6"} s={phys(tt, 0.4 + (D - 1.0) * (i + 1) / 4, 6, 0.5)} />)}
  </Estudio>;
}}</Stage>;

// ── 17 · MEDIA SEMANA (11:41): tortilla, gas, foco y leña aparecen de a uno y sueltan sus monedas a una torre chica: 182; al lado sube la de la ciudad: 500
const H17Media: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), sc = Math.min(1, (D - 1.0) / 3.2), on = (i: number) => phys(tt, (0.0 + i * 0.25) * sc, 6, 0.5);
  const X = [-0.98, -0.5, -0.02, 0.46], ZO = -0.45, PL: V3 = [-0.25, 0, 0.55], PR: V3 = [0.95, 0, 0.2];
  const vuela = (i: number, j: number) => eio(tt, (0.1 + i * 0.4) * sc + 0.35 + j * 0.09, (0.1 + i * 0.4) * sc + 0.95 + j * 0.09);
  let nL = 0; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (vuela(i, j) >= 1) nL++;
  const nR = Math.min(42, Math.floor(cl((tt - 0.4 * sc) / (2.8 * sc)) * 42));
  return <Estudio t={tt} cam={[0.05, 1.45, 3.75]} look={[0, 0.5, 0]} orbit={0.08}>
    <group position={[X[0], 0, ZO]} scale={Math.max(0.001, on(0) * 1.2)}>{Array.from({ length: 6 }, (_, i) => <Tortilla key={i} p={[0, 0.01 + i * 0.013, 0]} />)}</group>
    <group position={[X[1], 0, ZO]} scale={Math.max(0.001, on(1) * 0.85)}><mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.24, 0.26, 0.8, 28]} /><meshStandardMaterial color="#9aa0a6" metalness={0.6} roughness={0.35} /></mesh><mesh position={[0, 0.85, 0]}><cylinderGeometry args={[0.05, 0.06, 0.12, 12]} />{M.cromo()}</mesh></group>
    <group position={[X[2], 0.24, ZO]} scale={Math.max(0.001, on(2) * 1.7)}><mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.13, 28, 18]} /><meshPhysicalMaterial color="#fff6dc" emissive="#ffcf7a" emissiveIntensity={0.8} roughness={0.2} /></mesh><mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.055, 0.05, 0.11, 16]} />{M.cromo("#a9acb2")}</mesh></group>
    <group position={[X[3], 0.16, ZO]} scale={Math.max(0.001, on(3) * 1.6)} rotation={[0, 0.3, P2]}><mesh castShadow><cylinderGeometry args={[0.09, 0.1, 0.45, 14]} /><meshStandardMaterial map={corteza()} roughness={0.95} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0, sd * 0.226, 0]} rotation={[sd * P2, 0, 0]}><circleGeometry args={[0.092, 20]} /><meshStandardMaterial map={anillos()} roughness={0.9} /></mesh>)}</group>
    {X.map((x, i) => Array.from({ length: 4 }, (_, j) => { const k = vuela(i, j); if (k <= 0 || k >= 1) return null;
      return <Moneda key={i + "-" + j} p={[lerp(x, PL[0], k), 0.35 + Math.sin(k * P) * 0.55 + lerp(0, 0.2, k), lerp(ZO, PL[2], k)]} rot={[k * 8, 0, j]} s={1.4} />; }))}
    <group position={PL} scale={1.5}><Pila p={[0, 0, 0]} n={nL} t={99} a={0} /></group>
    <group position={PR} scale={1.15}><Pila p={[0, 0, 0]} n={nR} t={99} a={0} /></group>
    <Etq p={[PL[0], 0.02, PL[2] + 0.3]} rot={[-P2 + 0.5, 0, 0]} txt="$182" w={0.5} h={0.24} />
    <Etq p={[PR[0], 0.02, PR[2] + 0.3]} rot={[-P2 + 0.5, 0, 0]} txt="$500" w={0.5} h={0.24} bg="#d9d4c8" ink="#7a2a14" />
  </Estudio>;
}}</Stage>;
const corteza = () => ctex("corteza", 256, 256, (g) => { g.fillStyle = "#5a3a20"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${20 + rn(i, 1) * 40},${12 + rn(i, 2) * 20},6,.7)`; g.fillRect(0, rn(i, 3) * 256, 256, 2 + rn(i, 4) * 5); } });
const anillos = () => ctex("anillos", 128, 128, (g) => { g.fillStyle = "#d9b07a"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "rgba(120,70,30,.6)"; g.lineWidth = 2; for (let r = 6; r < 64; r += 7) { g.beginPath(); g.arc(64, 64, r, 0, 7); g.stroke(); } });

// ── 18 · EL FIADO (12:56): la libreta de fiado se escribe sola renglón por renglón; por cada renglón cae un puño de billetes y la deuda crece más alta que la libreta
const H18Fiado: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), k = cl((tt - 0.05) / (D * 0.65));
  const rows: Fila[] = [{ c: ["refresco", "22"] }, { c: ["pan", "15"] }, { c: ["jabón", "24"] }, { c: ["debes", "$300"], ink: "#b3201a" }];
  const e = escrito("fia6", rows, k, [0.1, 0.58], { y0: 110, dy: 165, size: 170 });
  const nB = Math.floor(k * 30), PW = 1.0, PH = 0.73;
  return <Estudio t={tt} cam={[0.15, 1.1, 1.2]} look={[0.15, 0.1, 0]} orbit={0.06}>
    <group position={[-0.25, 0, 0]}>
      <RBox p={[0, 0.012, 0]} s={[PW + 0.04, 0.024, PH + 0.04]} r={0.01}><meshStandardMaterial color="#7a2a20" roughness={0.8} /></RBox>
      <mesh position={[0, 0.026, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[PW, PH]} /><meshStandardMaterial map={e.tex} roughness={0.9} /></mesh>
      {!e.done && <LapizEn p={[(e.u - 0.5) * PW, 0.026, (e.v - 0.5) * PH]} t={tt} />}
    </group>
    <group position={[0.75, 0, 0.0]}>{Array.from({ length: nB }, (_, i) => <Billete key={i} p={[0.03 * Math.sin(i * 1.7), 0.006 + i * 0.013 + fall(tt, 0.3 + (i / 30) * D * 0.72, 0.35), 0.03 * Math.cos(i * 2.3)]} rot={[-P2 + (rn(i, 4) - 0.5) * 0.12, 0, (rn(i, 3) - 0.5) * 0.7]} v="20" s={0.8} />)}</group>
  </Estudio>;
}}</Stage>;

// ── 19 · LA BOLSA DE COLORES (14:05): llueven bolsitas de botana brillantes; al lado la canasta con jitomate, cebolla y limón; al final se apagan las bolsas y se ilumina la canasta
const almoGeo = (() => { const g = new THREE.BoxGeometry(0.28, 0.12, 0.38, 10, 4, 12), q = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < q.count; i++) { const x = q.getX(i) / 0.14, z = q.getZ(i) / 0.19, f = (1 - x * x * 0.55) * (1 - z * z * 0.85); q.setY(i, q.getY(i) * Math.max(0.12, f)); }
  g.computeVertexNormals(); return g; })();
const selloGeo = new THREE.BoxGeometry(0.28, 0.01, 0.035);
const Bolsita: React.FC<{ p: V3; rot: V3; c: string }> = ({ p, rot, c }) => <group position={p} rotation={rot}>
  <mesh geometry={almoGeo} castShadow><meshPhysicalMaterial color={c} roughness={0.14} metalness={0.5} clearcoat={1} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0, sd * 0.2]} geometry={selloGeo}><meshStandardMaterial color={col(c, "#ffffff", 0.15)} metalness={0.55} roughness={0.3} /></mesh>)}
  <mesh position={[0, 0.036, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.07, 20]} /><meshBasicMaterial color={col(c, "#ffffff", 0.6)} /></mesh>
</group>;
const cebGeo = lathe([[0, 0], [0.08, 0.02], [0.11, 0.08], [0.08, 0.16], [0.02, 0.22], [0.005, 0.26]]);
const H19Colores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), COL = ["#e8392b", "#f5c400", "#1e88e5", "#8e24aa", "#ff7f00", "#00a65a"], apaga = eio(tt, 0.58 * D, 0.72 * D);
  return <Estudio t={tt} cam={[0, 1.45, 2.8]} look={[0, 0.35, 0]} orbit={0.1}>
    {Array.from({ length: 16 }, (_, i) => <Bolsita key={i} p={[-0.7 + (rn(i, 1) - 0.5) * 0.9, 0.05 + fall(tt, -0.2 + i * 0.12, 1.2) + (i % 4) * 0.08, (rn(i, 2) - 0.5) * 0.7]} rot={[rn(i, 3) * 0.5, rn(i, 4) * 3, rn(i, 5) * 0.5]} c={col(COL[i % 6], "#5a5856", apaga * 0.9)} />)}
    <group position={[0.55, 0, 0.1]} scale={1.35}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow><cylinderGeometry args={[0.48, 0.38, 0.4, 36, 1, true]} /><meshStandardMaterial map={tejido("#c9a060", "#8a6a36")} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.38, 32]} /><meshStandardMaterial map={tejido("#c9a060", "#8a6a36")} roughness={0.95} /></mesh>
      {[[-0.15, 0.36, 0.05], [0.12, 0.38, -0.08], [0.0, 0.42, 0.18]].map((q, i) => <group key={"j" + i} position={q as V3}>
        <mesh scale={[1, 0.85, 1]} castShadow><sphereGeometry args={[0.12, 24, 16]} /><meshPhysicalMaterial color="#c8281a" roughness={0.25} clearcoat={0.8} /></mesh>
        <mesh position={[0, 0.1, 0]}><coneGeometry args={[0.05, 0.03, 5]} /><meshStandardMaterial color="#3f7a2a" /></mesh></group>)}
      <mesh geometry={cebGeo} position={[0.2, 0.3, 0.14]} castShadow><meshPhysicalMaterial color="#8a2f6a" roughness={0.35} clearcoat={0.6} /></mesh>
      <mesh geometry={cebGeo} position={[-0.22, 0.3, -0.14]} rotation={[0.3, 0, 0.2]} castShadow><meshPhysicalMaterial color="#8a2f6a" roughness={0.35} clearcoat={0.6} /></mesh>
      {[[0.25, 0.42, -0.05], [-0.05, 0.47, -0.2], [-0.25, 0.44, 0.2]].map((q, i) => <mesh key={"l" + i} position={q as V3} rotation={[0, i, 0.4]} scale={[0.07, 0.065, 0.09]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshPhysicalMaterial color="#4f9a2a" roughness={0.3} clearcoat={0.6} /></mesh>)}
    </group>
    <spotLight position={[0.55, 2.2, 0.9]} angle={0.45} penumbra={0.6} intensity={0.01 + 11 * apaga} distance={5} color="#ffe2b0" />
    <pointLight position={[0.8, 0.8, 0.5]} intensity={0.01 + 2.5 * apaga} distance={1.8} color="#ffd9a0" />
  </Estudio>;
}}</Stage>;

// ── 20 · UN SOLO VIAJE (15:37): maqueta del pueblo a Pátzcuaro; la combi blanca va UNA vez; las otras tres vueltas, transparentes, se van borrando una por una
const ruta = new THREE.CatmullRomCurve3([new THREE.Vector3(-1.25, 0.02, 0.45), new THREE.Vector3(-0.55, 0.02, -0.15), new THREE.Vector3(0.15, 0.02, 0.3), new THREE.Vector3(0.85, 0.02, -0.2), new THREE.Vector3(1.3, 0.02, -0.45)]);
const Combi: React.FC<{ p: V3; ry: number; o?: number }> = ({ p, ry, o = 1 }) => { const fant = o < 1;
  const mat = (c: string) => fant ? <meshBasicMaterial color="#cfe0f0" wireframe transparent opacity={0.25 * o} depthWrite={false} /> : <meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.8} />;
  return <group position={p} rotation={[0, ry, 0]} visible={o > 0.02}>
    <RBox p={[0, 0.13, 0]} s={[0.22, 0.18, 0.44]} r={0.04}>{mat("#f4f4f0")}</RBox>
    {!fant && <>
      <RBox p={[0, 0.08, 0]} s={[0.225, 0.04, 0.445]} r={0.01}><meshStandardMaterial color="#2a6ab8" roughness={0.5} /></RBox>
      <RBox p={[0, 0.17, -0.01]} s={[0.228, 0.06, 0.36]} r={0.01}><meshPhysicalMaterial color="#1a2430" roughness={0.1} clearcoat={1} /></RBox>
      <RBox p={[0, 0.16, 0.215]} s={[0.18, 0.08, 0.02]} r={0.01}><meshPhysicalMaterial color="#1a2430" roughness={0.1} clearcoat={1} /></RBox>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.115, 0.045, z * 0.14]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.045, 0.045, 0.03, 16]} /><meshStandardMaterial color="#151515" roughness={0.7} /></mesh>)}
    </>}
  </group>; };
const H20Combi: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const D = dur(h), u = eio(tt, 0.15, 0.55 * D), at = (k: number) => { const q = ruta.getPoint(cl(k) * 0.999), g = ruta.getTangent(Math.min(0.999, cl(k) * 0.999)); return { q, ry: Math.atan2(g.x, g.z) }; };
  const me = at(u), pago = phys(tt, 0.56 * D, 6, 0.5);
  return <Estudio t={tt} cam={[0.1, 2.45, 2.75]} look={[0.1, 0, 0]} orbit={0.06}>
    <RBox p={[0, 0.03, 0]} s={[3.2, 0.06, 1.95]} r={0.03}><meshStandardMaterial color="#6d7f4a" roughness={0.95} /></RBox>
    <group position={[0, 0.06, 0]} scale={[0.9, 1, 0.9]}>
    <mesh><tubeGeometry args={[ruta, 120, 0.09, 6, false]} /><meshStandardMaterial color="#b9a888" roughness={0.9} /></mesh>
    {[-1, 1].map((sd) => <group key={sd} position={sd < 0 ? [-1.25, 0, 0.45] : [1.3, 0, -0.45]}>{Array.from({ length: sd < 0 ? 5 : 9 }, (_, i) => <RBox key={i} p={[(rn(i, sd + 4) - 0.5) * 0.55, 0.08, (rn(i, sd + 5) - 0.5) * 0.45 - 0.2]} s={[0.12, 0.16, 0.12]} r={0.02}><meshStandardMaterial color={i % 2 ? "#e9dcc4" : "#c25a3a"} roughness={0.8} /></RBox>)}</group>)}
    <Combi p={[me.q.x, 0.02, me.q.z]} ry={me.ry} />
    {[0, 1, 2].map((i) => { const g = at((tt * 0.22 + 0.2 + i * 0.27) % 1), o = 1 - eio(tt, (0.55 + i * 0.1) * D, (0.6 + i * 0.1) * D), xk = phys(tt, (0.5 + i * 0.1) * D, 8, 0.4) * o;
      return <group key={i}><Combi p={[g.q.x, 0.02, g.q.z]} ry={g.ry} o={0.99 * o} />
        {[-1, 1].map((sd) => <mesh key={sd} position={[g.q.x, 0.36, g.q.z]} rotation={[0, 0, sd * 0.78]} scale={Math.max(0.001, xk)}><boxGeometry args={[0.4, 0.05, 0.02]} /><meshBasicMaterial color="#ff3a2a" toneMapped={false} /></mesh>)}</group>; })}
    {Array.from({ length: 14 }, (_, i) => { const x = (rn(i, 11) - 0.5) * 3.8, z = (rn(i, 12) - 0.5) * 2.2; if (Math.abs(z - (0.45 - (x + 1.25) * 0.35)) < 0.3) return null;
      return <group key={"a" + i} position={[x, 0, z]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.015, 0.02, 0.12, 6]} /><meshStandardMaterial color="#5a3a22" /></mesh><mesh position={[0, 0.2, 0]} castShadow><coneGeometry args={[0.09, 0.24, 8]} /><meshStandardMaterial color={i % 2 ? "#3f6a2a" : "#4f7a34"} roughness={0.9} /></mesh></group>; })}
    {[[-0.3, -0.9, 0.7], [0.9, 0.85, 0.5], [-1.5, -0.6, 0.45]].map(([x, z, r], i) => <mesh key={"c" + i} position={[x, -0.02, z]} scale={[r, r * 0.3, r]}><sphereGeometry args={[1, 24, 12, 0, 6.29, 0, P2]} /><meshStandardMaterial color="#5f7340" roughness={0.95} /></mesh>)}
    <Etq p={[1.1, 0.32, -0.2]} rot={[-0.5, 0, 0]} txt="Pátzcuaro" w={0.62} h={0.22} />
    <Etq p={[-1.05, 0.32, 0.8]} rot={[-0.5, 0, 0]} txt="mi pueblo" w={0.6} h={0.22} />
    </group>
    <Etq p={[0.15, 0.55 + 0.3 * (1 - cl(pago)), 0.75]} rot={[-0.5, 0, 0]} txt="$44" w={0.45} h={0.26} bg="#e9d9b0" ink="#7a2a14" s={pago} />
  </Estudio>;
}}</Stage>;

// ── 21 · LA MEDICINA (16:31): dos cajas iguales de la misma pastilla; detrás de cada una sube su pila de monedas: la de la farmacia grande, el doble
const medTex = () => ctex("med2", 512, 256, (g) => { g.fillStyle = "#f6f6f2"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#1e9a5a"; g.fillRect(40, 98, 120, 40); g.fillRect(80, 58, 40, 120);
  g.fillStyle = "#2a6ab8"; g.fillRect(0, 210, 512, 46); for (let i = 0; i < 3; i++) { g.fillStyle = "rgba(40,40,40,.25)"; g.fillRect(200, 70 + i * 36, 240 - i * 50, 14); } });
const H21Medicina: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const D = dur(h), a = 0.25, b = Math.min(D - 0.9, 2.6), nL = Math.floor(cl((tt - a) / ((b - a) / 2)) * 10), nR = Math.floor(cl((tt - a) / (b - a)) * 20);
  const wob = tt > b ? 0.12 * Math.sin((tt - b) * 8) * Math.exp(-(tt - b) * 2.4) : 0, inc = (nR - nL) / 20 * 0.9 + wob;
  const caja = <group scale={0.62}><RBox p={[0, 0.13, 0]} s={[0.5, 0.26, 0.2]} r={0.015}><meshStandardMaterial color="#f6f6f2" roughness={0.5} /></RBox>
    <mesh position={[0, 0.13, 0.101]}><planeGeometry args={[0.48, 0.24]} /><meshStandardMaterial map={medTex()} roughness={0.5} /></mesh></group>;
  return <Estudio t={tt} cam={[0, 1.3, 3.35]} look={[0, 0.62, 0]} orbit={0.1}>
    <Bascula inc={inc} izq={<group>{caja}<group position={[0.2, 0, 0.05]} scale={1.1}><Pila p={[0, 0, 0]} n={nL} t={99} a={0} /></group></group>}
      der={<group>{caja}<group position={[0.2, 0, 0.05]} scale={1.1}><Pila p={[0, 0, 0]} n={nR} t={99} a={0} /></group></group>} />
    {[-1, 1].map((sd) => <Etq key={sd} p={[sd * 0.82, 0.12, 0.5]} rot={[-0.5, 0, 0]} txt={sd < 0 ? "similar" : "farmacia"} w={0.42} h={0.17} bg={sd < 0 ? "#e9d9b0" : "#d9d4c8"} />)}
  </Estudio>;
}}</Stage>;

// ── 22 · EL REFRESCO (17:18): botellas de dos litros caen en fila, una por día, hasta 30; adelante, la jarra de agua de limón del limonero
const petGeo = lathe([[0, 0], [0.1, 0], [0.11, 0.03], [0.11, 0.3], [0.08, 0.38], [0.035, 0.44], [0.035, 0.5]]);
const colaGeo = lathe([[0, 0.01], [0.095, 0.01], [0.103, 0.03], [0.103, 0.3], [0.075, 0.37], [0.02, 0.4]]);
const H22Refresco: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const D = dur(h), r = Math.min(10, 30 / (D * 0.62)), n = Math.min(30, Math.floor(Math.max(0, tt - 0.05) * r));
  return <Estudio t={tt} cam={[0.05, 1.35, 3.45]} look={[-0.1, 0.5, 0]} orbit={0.1}>
    {Array.from({ length: n }, (_, i) => <group key={i} position={[-0.55 + (i % 6) * 0.22, fall(tt, 0.05 + i / r, 0.7), -0.85 + Math.floor(i / 6) * 0.24]} scale={0.85}>
      <mesh geometry={colaGeo}><meshStandardMaterial color="#2a0f08" roughness={0.2} /></mesh>
      <mesh geometry={petGeo} castShadow><meshPhysicalMaterial color="#e8f0f2" roughness={0.05} transparent opacity={0.3} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.112, 0.112, 0.09, 24, 1, true]} /><meshStandardMaterial color="#c8281a" roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.51, 0]}><cylinderGeometry args={[0.04, 0.04, 0.04, 16]} /><meshStandardMaterial color="#d8281a" roughness={0.4} /></mesh>
    </group>)}
    <group position={[-0.3, 1.0, -0.8]} scale={1.1}><RBox p={[0, 0, -0.06]} s={[0.6, 0.42, 0.1]} r={0.03}><meshStandardMaterial color="#5a3a22" roughness={0.7} /></RBox>
      <Paleta p={[-0.12, 0, 0]} v={n / 10} /><Paleta p={[0.12, 0, 0]} v={n + cl((tt - 0.3) * r - n)} /></group>
    <group position={[-1.0, 0, 0.75]} scale={1.45}>
      <mesh geometry={lathe([[0, 0], [0.22, 0], [0.25, 0.4], [0.2, 0.6], [0.24, 0.66]])} castShadow>{M.vidrio()}</mesh>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.22, 0.21, 0.48, 32]} />{M.liquido("#d8e8a0", 0.55)}</mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[0.06 * Math.cos(i * 2), 0.32 + i * 0.07, 0.06 * Math.sin(i * 2)]} rotation={[0, i, 0.4]}><cylinderGeometry args={[0.06, 0.06, 0.012, 20]} /><meshStandardMaterial color="#8ac24a" roughness={0.5} /></mesh>)}
    </group>
  </Estudio>;
}}</Stage>;

// ── 23 · LA CONCHITA (17:36): la charola se llena de conchas (azúcar rayada); se apagan todas y una sola, la del domingo, sube a su plato con su luz
const conchaTex = (c: string) => ctex("concha" + c, 256, 128, (g) => { g.fillStyle = c; g.fillRect(0, 0, 256, 128); g.strokeStyle = "rgba(90,50,20,.45)"; g.lineWidth = 4;
  for (let x = 0; x < 256; x += 21) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke(); } for (let y = 14; y < 128; y += 18) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); } });
const Concha: React.FC<{ p: V3; c: string; dim?: number; s?: number }> = ({ p, c, dim = 0, s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.01, 0]} castShadow><cylinderGeometry args={[0.13, 0.12, 0.03, 24]} /><meshStandardMaterial color={col("#c98a4a", "#2a2018", dim)} roughness={0.7} /></mesh>
  <mesh position={[0, 0.025, 0]} scale={[0.13, 0.085, 0.13]} castShadow><sphereGeometry args={[1, 28, 12, 0, 6.29, 0, P2]} /><meshStandardMaterial map={conchaTex(c)} color={col("#ffffff", "#3a3a3a", dim)} roughness={0.8} /></mesh>
</group>;
const H23Conchas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const D = dur(h), n = Math.min(24, 6 + Math.floor(Math.max(0, tt) * 18 / (0.35 * D))), dim = eio(tt, 0.5 * D, 0.62 * D), sube = eio(tt, 0.58 * D, 0.78 * D);
  const CC = ["#f2b8c6", "#f4dc9a", "#7a4a2a"];
  return <Estudio t={tt} cam={[0, 1.6, 2.5]} look={[0, 0.12, 0.1]} orbit={0.1}>
    <RBox p={[0, 0.015, -0.2]} s={[2.4, 0.03, 1.1]} r={0.02}>{M.madera("#7a5230")}</RBox>
    {[[0, -0.75, 2.44, 0.04], [0, 0.35, 2.44, 0.04], [1.2, -0.2, 0.04, 1.14], [-1.2, -0.2, 0.04, 1.14]].map(([x, z, w, d], i) => <RBox key={"b" + i} p={[x, 0.06, z]} s={[w, 0.09, d]} r={0.01}>{M.madera("#5a3a20")}</RBox>)}
    {Array.from({ length: n }, (_, i) => i === 11 ? null : <Concha key={i} p={[-1.0 + (i % 8) * 0.285, 0.03 + fall(tt, i < 6 ? -1 : (i - 6) * 0.35 * D / 18, 0.5), -0.55 + Math.floor(i / 8) * 0.33]} c={CC[i % 3]} dim={dim} />)}
    <Concha p={[0, 0.04, 0.62]} c={CC[0]} s={1.35} dim={0.7 * (1 - sube)} />
    <Plato p={[0, 0.0, 0.62]} s={0.62} c="#e9e1cf" />
    <spotLight position={[0, 1.8, 1.3]} angle={0.3} penumbra={0.6} intensity={0.01 + 10 * sube} distance={4} color="#ffd9a0" />
    <mesh position={[0, 0.95, 0.62]}><coneGeometry args={[0.42, 1.8, 40, 1, true]} /><meshBasicMaterial color="#ffd9a0" transparent opacity={0.001 + 0.22 * sube} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 24 · LA CUENTA DEL DOMINGO (19:12): siete montoncitos de monedas, uno por día; vuelan todos a la vez a un contador de paletas que gira y para en 773; a un lado el café de olla
const digTex = (d: number) => ctex("dig" + d, 128, 180, (g) => { g.fillStyle = "#1c1814"; g.fillRect(0, 0, 128, 180); g.fillStyle = "#f4ead2"; g.font = "900 140px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(d), 64, 96);
  g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(0, 88, 128, 4); });
const Paleta: React.FC<{ p: V3; v: number }> = ({ p, v }) => { const d = ((Math.floor(v) % 10) + 10) % 10, f = cl((v - Math.floor(v) - 0.8) / 0.2), W = 0.2, Hh = 0.28;
  return <group position={p}>
    <RBox p={[0, 0, -0.03]} s={[W + 0.04, Hh + 0.04, 0.04]} r={0.01}>{M.hierro()}</RBox>
    <mesh position={[0, 0, 0]}><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={digTex((d + 1) % 10)} roughness={0.5} /></mesh>
    <group position={[0, 0, 0.004]} visible={f < 0.97}><group rotation={[f * P2, 0, 0]}><mesh position={[0, 0, 0]}><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={digTex(d)} roughness={0.5} /></mesh></group></group>
  </group>; };
const DIAS = ["L", "M", "M", "J", "V", "S", "D"], NDIA = [6, 5, 2, 3, 1, 2, 12];
const H24Domingo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = dur(h), vu = 0.42 * D, cu = (i: number, j: number) => eio(tt, vu + i * 0.1 + j * 0.03, vu + i * 0.1 + j * 0.03 + 0.6);
  const ro = (tgt: number, i: number) => (tgt + 10 * (2 + i)) * eio(tt, vu + 0.5 + i * 0.25, 0.86 * D + i * 0.12);
  return <Estudio t={tt} cam={[0, 1.2, 2.95]} look={[0, 0.45, 0]} orbit={0.1}>
    {DIAS.map((dd, i) => { const x = (i - 3) * 0.3, z = -0.1, on = phys(tt, 0.02 + i * 0.06, 6, 0.5);
      return <group key={i}>
        {Array.from({ length: NDIA[i] }, (_, j) => { const k = cu(i, j); if (k >= 0.999 || tt < 0.02 + i * 0.06 + j * 0.02) return null;
          return <Moneda key={j} p={[lerp(x, 0, k), 0.012 + j * 0.03 * (1 - k) + fall(tt, 0.02 + i * 0.06 + j * 0.02, 0.3) + Math.sin(k * P) * 0.3, lerp(z, 0.55, k)]} rot={[k * 6, 0, 0]} s={1.5} />; })}
        <RBox p={[x, 0.006, z]} s={[0.26, 0.012, 0.26]} r={0.01}>{M.madera("#8a6236")}</RBox>
        <Etq p={[x, 0.012, z + 0.22]} rot={[-P2 + 0.4, 0, 0]} txt={dd} w={0.2} h={0.16} bg="#e9d9b0" s={on} />
      </group>; })}
    <group position={[0, 0.12, 0.55]} scale={1.6}><Pila p={[0, 0, 0]} n={Math.min(20, Math.floor(eio(tt, vu + 0.4, vu + 1.6) * 20))} t={99} a={0} /></group>
    <group position={[0, 0.72, -0.55]}>
      <RBox p={[0, 0, -0.06]} s={[0.86, 0.42, 0.1]} r={0.03}><meshStandardMaterial color="#5a3a22" roughness={0.7} /></RBox>
      <Paleta p={[-0.25, 0, 0]} v={ro(7, 0)} /><Paleta p={[0, 0, 0]} v={ro(7, 1)} /><Paleta p={[0.25, 0, 0]} v={ro(3, 2)} />
    </group>
    <group position={[0.62, 0, -0.35]}>
      <mesh geometry={lathe([[0, 0], [0.11, 0], [0.14, 0.07], [0.13, 0.2], [0.15, 0.23]])} castShadow>{M.barro("#8a4426")}</mesh>
      <mesh position={[0.15, 0.12, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.05, 0.015, 8, 16, P]} />{M.barro("#8a4426")}</mesh>
      <mesh position={[0, 0.2, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.125, 24]} />{M.liquido("#3a1c0e", 0.98)}</mesh>
      <Vapor t={tt} p={[0, 0.24, 0]} o={0.35} h={0.6} s={0.15} />
    </group>
  </Estudio>;
}}</Stage>;

// ── 25 · LAS GALLINAS (20:42): huevos de rancho caen a la canasta de mimbre y por cada uno sube una moneda en la pila de al lado, hasta 30
const eggGeo = lathe([[0, 0], [0.045, 0.01], [0.06, 0.04], [0.058, 0.08], [0.04, 0.115], [0.001, 0.13]], 24);
const H25Huevos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = dur(h), sp = Math.min(2.4, D - 0.9), n = Math.min(30, Math.floor(cl((tt - 0.2) / sp) * 30)), ok = phys(tt, 0.2 + sp + 0.05, 6, 0.5);
  return <Estudio t={tt} cam={[0.15, 1.25, 2.9]} look={[0.15, 0.38, 0]} orbit={0.1}>
    <group position={[-0.45, -0.6 * (1 - phys(tt, 0, 6, 0.55)), 0]}>
      <mesh position={[0, 0.17, 0]} castShadow receiveShadow><cylinderGeometry args={[0.5, 0.4, 0.34, 36, 1, true]} /><meshStandardMaterial map={tejido("#c9a060", "#8a6a36")} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.4, 32]} /><meshStandardMaterial map={tejido("#c9a060", "#8a6a36")} roughness={0.95} /></mesh>
      <mesh position={[0, 0.34, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.5, 0.02, 8, 40, P]} /><meshStandardMaterial color="#8a6a36" roughness={0.9} /></mesh>
      {Array.from({ length: n }, (_, i) => { const a = i * 2.4, r = 0.25 * Math.sqrt(rn(i, 1)); return <mesh key={i} geometry={eggGeo} position={[Math.cos(a) * r, 0.04 + Math.floor(i / 12) * 0.08 + fall(tt, 0.2 + (i / 30) * sp, 0.6), Math.sin(a) * r]} rotation={[P2 + (rn(i, 2) - 0.5) * 0.6, rn(i, 3) * 3, 0]} castShadow>
        <meshStandardMaterial color={i % 3 ? "#c99a6a" : "#e4c8a0"} roughness={0.55} /></mesh>; })}
    </group>
    <group position={[0.4, 0, 0.2]} scale={0.8}><Pila p={[0, 0, 0]} n={n} t={99} a={0} /></group>
    <group position={[0.68, 0.72, -0.35]} rotation={[0, -0.25, 0]} scale={0.85}><RBox p={[0, 0, -0.06]} s={[0.82, 0.42, 0.1]} r={0.03}><meshStandardMaterial color="#5a3a22" roughness={0.7} /></RBox>
      <Paleta p={[-0.12, 0, 0]} v={n / 10} /><Paleta p={[0.12, 0, 0]} v={n} /></group>
  </Estudio>;
}}</Stage>;

// ── 26 · EL SOBRE SIETE (21:29): seis sobres caen en semicírculo; de cada uno saltan en arco sus monedas sobrantes al sobre ROJO del frente, que se cierra solo
const H26Siete: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = dur(h), c0 = 1.0, c1 = Math.min(D - 2.0, 5.0), cierra = phys(tt, c1 + 0.35, 6, 0.4);
  const sp = (i: number): V3 => { const a = (i - 2.5) * 0.42; return [Math.sin(a) * 1.0, 0.015, -Math.cos(a) * 0.5 + 0.12]; };
  return <Estudio t={tt} cam={[0, 2.7, 2.35]} look={[0, 0.0, -0.05]} orbit={0.06} fov={40}>
    {SOB.map((n, i) => { const q = sp(i), a = (i - 2.5) * 0.44; return tt < 0.02 + i * 0.12 ? null : <Sobre key={n} p={[q[0], q[1] + fall(tt, 0.02 + i * 0.12, 0.6), q[2]]} rot={[0, -a, 0]} txt={n} s={0.8} solapa={0.15} />; })}
    <Sobre p={[0, 0.02, 0.62]} txt="7" rojo solapa={Math.max(0, 1 - cierra)} s={1.05} />
    <pointLight position={[0, 0.5, 0.9]} intensity={0.01 + 1.8 * cl(cierra)} distance={1.6} color="#ff8a5a" />
    {Array.from({ length: 30 }, (_, j) => { const i = j % 6, q = sp(i), s0 = c0 + (j / 30) * (c1 - c0), k = eio(tt, s0, s0 + 0.6);
      return k <= 0 || k >= 1 ? null : <Moneda key={j} p={[lerp(q[0], 0, k), 0.05 + Math.sin(k * P) * 0.65, lerp(q[2], 0.62, k)]} rot={[k * 8, 0, j]} s={1.7} />; })}
    <group position={[0, 0.035, 0.66]} visible={cierra < 0.5}><group scale={1.3}><Pila p={[0, 0, 0]} n={Math.min(9, Math.floor(cl((tt - c0 - 0.6) / (c1 - c0)) * 9))} t={99} a={0} /></group></group>
  </Estudio>;
}}</Stage>;

// ── 27 · LA CAJA DE LÁMINA (22:15): se abre la caja de los ahorros; un billete sale volando, entra a la bomba de agua, la bomba arranca y echa su chorro
const oxido = () => ctex("oxido", 256, 256, (g) => { g.fillStyle = "#6f756e"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(${130 + rn(i, 1) * 50},${60 + rn(i, 2) * 30},20,${0.25 + 0.4 * rn(i, 3)})`; g.beginPath(); g.ellipse(rn(i, 4) * 256, rn(i, 5) * 256, 4 + rn(i, 6) * 18, 3 + rn(i, 7) * 10, rn(i, 8) * 3, 0, 7); g.fill(); } });
const H27Caja: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const D = dur(h), abre = phys(tt, 0.2, 6, 0.45), sale = eio(tt, 0.3 * D, 0.6 * D), arr = eio(tt, 0.6 * D, 0.6 * D + 0.4), agua = eio(tt, 0.64 * D, 0.74 * D);
  const A: V3 = [-0.6, 0.36, 0.05], B: V3 = [0.3, 0.97, 0.0];
  const bp: V3 = [lerp(A[0], B[0], sale), lerp(A[1], B[1], sale) + Math.sin(sale * P) * 0.32, lerp(A[2], B[2], sale)];
  const pal = arr * 0.35 * Math.sin(tt * 7), enrolla = cl((sale - 0.75) / 0.25);
  const cubeta = lathe([[0.13, 0], [0.16, 0.005], [0.2, 0.26], [0.205, 0.265]]);
  return <Estudio t={tt} cam={[0, 1.15, 2.25]} look={[0.0, 0.5, 0]} orbit={0.06}>
    <group position={[-0.6, 0, 0]}>
      <RBox p={[0, 0.15, 0]} s={[0.8, 0.3, 0.5]} r={0.03}><meshStandardMaterial map={oxido()} roughness={0.55} metalness={0.55} /></RBox>
      {[[0, 0.25, 0.82, 0.03], [0, -0.25, 0.82, 0.03], [0.4, 0, 0.03, 0.52], [-0.4, 0, 0.03, 0.52]].map(([x, z, w, d], i) => <RBox key={i} p={[x, 0.3, z]} s={[w, 0.025, d]} r={0.008}><meshStandardMaterial color="#5a5f59" roughness={0.5} metalness={0.6} /></RBox>)}
      <mesh position={[0, 0.296, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.77, 0.47]} /><meshStandardMaterial color="#2a2018" roughness={1} /></mesh>
      <RBox p={[0, 0.2, 0.255]} s={[0.1, 0.08, 0.02]} r={0.01}>{M.cromo("#c9a24a")}</RBox>
      {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, 0.3, -0.255]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.02, 0.02, 0.12, 12]} />{M.cromo("#9a9a92")}</mesh>)}
      <group position={[0, 0.3, -0.255]} rotation={[-cl(abre) * 1.92, 0, 0]}><RBox p={[0, 0.02, 0.26]} s={[0.82, 0.04, 0.52]} r={0.02}><meshStandardMaterial map={oxido()} roughness={0.55} metalness={0.55} /></RBox></group>
      {Array.from({ length: 12 }, (_, i) => <Billete key={i} p={[0.02 * Math.sin(i * 3), 0.3 + i * 0.006, 0.02 * Math.cos(i)]} rot={[-P2, 0, rn(i, 4) * 0.2]} v={["500", "200", "500", "100"][i % 4]} s={0.95} />)}
      <SombraA p={[0, 0, 0]} r={0.6} o={0.6} />
    </group>
    {sale > 0 && sale < 0.999 && <group position={bp} rotation={[-P2 + sale * 1.2, sale * 2.0, sale * 0.5]} scale={[1 - 0.75 * enrolla, 1, 1]}><Billete v="500" s={1.0 * (1 - 0.6 * enrolla)} /></group>}
    {sale > 0 && sale < 0.999 && <SombraA p={[bp[0], 0, bp[2]]} r={0.18} o={0.45} />}
    <group position={[0.3, 0, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.2, 0.24, 0.12, 28]} /><meshStandardMaterial color="#7a1a12" roughness={0.45} metalness={0.5} /></mesh>
      <mesh position={[0, 0.45, 0]} castShadow><cylinderGeometry args={[0.12, 0.13, 0.7, 28]} /><meshStandardMaterial color="#b8281e" roughness={0.4} metalness={0.45} /></mesh>
      <mesh position={[0, 0.88, 0]}><cylinderGeometry args={[0.13, 0.08, 0.16, 28, 1, true]} /><meshStandardMaterial color="#8a1e16" roughness={0.4} metalness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.96, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.13, 0.012, 8, 28]} />{M.cromo("#c9a24a")}</mesh>
      <mesh position={[0.2, 0.62, 0]} rotation={[0, 0, P2 - 0.25]}><cylinderGeometry args={[0.04, 0.05, 0.32, 14]} /><meshStandardMaterial color="#b8281e" roughness={0.4} metalness={0.45} /></mesh>
      <group position={[-0.06, 0.84, 0]} rotation={[0, 0, 0.35 + pal]}><mesh position={[-0.3, 0, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.022, 0.026, 0.62, 12]} />{M.hierro()}</mesh>
        <mesh position={[-0.6, 0, 0]}><sphereGeometry args={[0.04, 14, 10]} /><meshStandardMaterial color="#5a3a22" roughness={0.7} /></mesh></group>
      {agua > 0.01 && <Chorro a={[0.34, 0.56, 0]} b={[0.5, 0.26, 0.02]} r={0.06 * agua} c="#a8d8f0" o={0.5} />}
      <group position={[0.52, 0, 0.02]}><mesh geometry={cubeta} castShadow receiveShadow><meshStandardMaterial color="#a9adb2" roughness={0.35} metalness={0.8} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.03 + 0.18 * agua, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.15 + 0.04 * agua, 28]} />{M.liquido("#8ab8d0", 0.8)}</mesh></group>
      {Array.from({ length: 12 }, (_, i) => { const u = (tt * 1.6 + i / 12) % 1, a = i * 2.3; return <mesh key={i} position={[0.52 + Math.cos(a) * u * 0.2, 0.26 + Math.sin(u * P) * 0.14, 0.02 + Math.sin(a) * u * 0.2]} scale={0.001 + 0.016 * (1 - u) * agua}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#e6f4fa" transparent opacity={0.75} roughness={0.05} /></mesh>; })}
      <SombraA p={[0, 0, 0]} r={0.35} o={0.6} /><SombraA p={[0.52, 0, 0.02]} r={0.3} o={0.5} />
    </group>
  </Estudio>;
}}</Stage>;

// ── 28 · EL RESUMEN (24:09): los siete objetos de la semana caen de a uno en fila sobre la mesa (lata, libreta, tortillas, olla tapada, foco, tambo, sobre rojo) y una luz cálida los recorre
const H28Resumen: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const D = dur(h), st = Math.min(0.3, (D * 0.4) / 7), y = (i: number) => fall(tt, -0.1 + i * st, 0.7), X = (i: number) => (i - 3) * 0.36;
  const vis = (i: number) => tt > -0.1 + i * st, luz = eio(tt, 0.2 + 7 * st, D - 0.4);
  return <Estudio t={tt} cam={[0, 1.05, 3.05]} look={[0, 0.32, 0]} orbit={0.08}>
    <group scale={1.2}>
    <spotLight position={[lerp(-1.4, 1.4, luz), 1.6, 0.9]} angle={0.35} penumbra={0.5} intensity={0.01 + 6 * Math.sin(luz * P)} distance={4} color="#ffd9a0" />
    <group position={[X(0), y(0), 0]} visible={vis(0)}><Lata tapa={0} s={0.45} /></group>
    <group position={[X(1), y(1), 0]} visible={vis(1)} rotation={[0, 0.2, 0]}><Libreta k="res" izq={["lunes 80"]} der={["= 773"]} s={0.42} /></group>
    <group position={[X(2), y(2), 0]} visible={vis(2)} scale={0.75}>{Array.from({ length: 6 }, (_, i) => <Tortilla key={i} p={[0, 0.01 + i * 0.013, 0]} />)}</group>
    <group position={[X(3), y(3), 0]} visible={vis(3)}><Olla p={[0, 0, 0]} mat="peltre" s={0.32} /><mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.23, 0.22, 0.02, 30]} /><meshPhysicalMaterial color="#2c4a6e" clearcoat={1} roughness={0.25} /></mesh></group>
    <group position={[X(4), y(4) + 0.1, 0]} visible={vis(4)}><mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.13, 28, 18]} /><meshPhysicalMaterial color="#fff6dc" emissive="#ffcf7a" emissiveIntensity={0.3 + 1.2 * luz} roughness={0.2} /></mesh><mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.055, 0.05, 0.11, 16]} />{M.cromo("#a9acb2")}</mesh></group>
    <group position={[X(5), y(5), 0]} visible={vis(5)}><Tambo nivel={0.7} t={tt} s={0.4} /></group>
    <group position={[X(6) - 0.05, y(6), 0.05]} visible={vis(6)} rotation={[0, -0.3, 0]}><Sobre txt="7" rojo s={0.5} /></group>
    </group>
    <pointLight position={[lerp(-1.8, 1.8, luz), 0.9, 0.7]} intensity={0.01 + 2.2 * Math.sin(luz * P)} distance={2.4} color="#ffcf8a" />
    <mesh position={[lerp(-1.6, 1.6, luz), 0.9, 0.1]}><coneGeometry args={[0.28, 1.8, 32, 1, true]} /><meshBasicMaterial color="#ffd9a0" transparent opacity={0.001 + 0.1 * Math.sin(luz * P)} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  frascos: H1Frascos, lata: H2Lata, reparto: H3Reparto, libreta: H4Libreta, tortilla: H5Tortilla, bolsa: H6Bolsa, torres: H7Torres, cilindro: H8Cilindro,
  ollas: H9Ollas, manguera: H10Manguera, piloto: H11Piloto, recibo: H12Recibo, empaque: H13Empaque, termo: H14Termo, tambo: H16Tambo,
  media: H17Media, fiado: H18Fiado, colores: H19Colores, combi: H20Combi, medicina: H21Medicina, refresco: H22Refresco, conchas: H23Conchas, domingo: H24Domingo,
  huevos: H25Huevos, siete: H26Siete, caja: H27Caja, resumen: H28Resumen,
};
