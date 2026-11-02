// wm01a · componentes 3D puros: recibos (veinte años de boletas clavadas en el pincho) · marcador (las chapas giran a 2 y 0)
// · navaja (la maquinita de afeitar abre las puertitas como mariposa, gira el mango, cae la hoja) · calendario (15 de mayo:
// el canotier baja al gancho; lo voltean de un manotazo; 15 de septiembre: vuelve el fieltro). Todo es f(t), sin rótulos.
import React from "react";
import * as THREE from "three";
import { Stage, at } from "./base";
import { Blob, Cuarto, Esc, HAND, M, RBox, Ready, Sombra, camA, canv, cl, edgeAlpha, extr, lerp, rn, spr, tubeG, useImg, win, type V3 } from "./k3d";
import type { Fi } from "./perchero";
import { estrella } from "./comps_a";

const madera = (k: string, base = "#4a2c17", rep: [number, number] = [1, 1]) => canv("mad" + k, 512, 512, (g) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 120; i++) { g.strokeStyle = `rgba(${rn(i, 1) > 0.6 ? "160,110,64" : "25,12,4"},${0.08 + 0.15 * rn(i, 2)})`; g.lineWidth = 1 + 2.5 * rn(i, 3); g.beginPath(); const y = rn(i, 4) * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + 14 * rn(i, 5) - 7, 340, y - 10 * rn(i, 6) + 5, 512, y + 8 * rn(i, 7) - 4); g.stroke(); }
}, rep);
const Mesa: React.FC<{ w?: number; d?: number; base?: string }> = ({ w = 1.4, d = 0.9, base }) =>
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshPhysicalMaterial map={madera("m" + base, base)} roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.3} alphaMap={edgeAlpha()} transparent /></mesh>;
const ready = () => typeof document !== "undefined" && document.fonts.check(`700 40px "${HAND}"`);

// ================= RECIBOS: veinte años del señor Abramowitz, boleta sobre boleta en el pincho del mostrador =================
const boleta = (y: number) => canv(`bol|${y}|${ready()}`, 256, 360, (g) => {
  g.fillStyle = "#f1e9d6"; g.fillRect(0, 0, 256, 360);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(130,105,70,${0.06 * rn(i + y, 2)})`; g.fillRect(rn(i + y, 3) * 256, rn(i + y, 4) * 360, 2, 2); }
  g.strokeStyle = "rgba(150,60,50,.45)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 70); g.lineTo(256, 70); g.stroke();
  g.strokeStyle = "rgba(110,130,170,.35)"; for (let k = 110; k < 340; k += 36) { g.beginPath(); g.moveTo(12, k); g.lineTo(244, k); g.stroke(); }
  // el año como sello de goma rojo, grande y torcido (lo único que hay que ver)
  g.save(); g.translate(128, 200); g.rotate(-0.12 + 0.2 * (rn(y, 9) - 0.5)); g.textAlign = "center"; g.textBaseline = "middle";
  g.strokeStyle = "rgba(170,35,30,.85)"; g.lineWidth = 7; g.strokeRect(-112, -62, 224, 124);
  g.fillStyle = "rgba(175,32,28,.9)"; g.font = "900 96px Georgia, serif"; g.fillText(String(y), 0, 6);
  g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(0,0,0,${0.5 * rn(i + y, 7)})`; g.fillRect(rn(i + y, 5) * 240 - 120, rn(i + y, 6) * 130 - 65, 3, 2); }
  g.restore();
});
export const RecibosFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, t0 = at("paid", a - 0.5), t20 = at("20 years", wow + 0.5);
  // 21 boletas: 1955…1975. La primera cae al decir «paid»; las demás se aceleran hasta «20 years»
  const N = 21, tk = (i: number) => (i === 0 ? t0 + 0.15 : lerp(t0 + 1.4, wow - 0.05, Math.pow((i - 1) / (N - 2), 0.62)));
  const c0 = camA(t, a, wow, { p: [0.3, 0.32, 0.42], l: [0, 0.06, 0], fov: 30 }, { p: [0.2, 0.26, 0.3], l: [0, 0.07, 0], fov: 30 }), sube = win(t, wow + 0.3, t20 + 0.6);
  const cam = { p: [lerp(c0.p[0], 0.2, sube), lerp(c0.p[1], 0.075, sube), lerp(c0.p[2], 0.26, sube)] as V3, l: [0, lerp(c0.l[1], 0.075, sube), 0] as V3, fov: 30 };
  const destello = win(t, wow, wow + 0.25) * (1 - win(t, wow + 0.5, wow + 1.1)) + win(t, t20, t20 + 0.2) * (1 - win(t, t20 + 0.4, t20 + 0.9));
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#ffe2bd">
    <Esc cam={cam} key1={[-0.8, 1.3, 0.7]} warm={1.0}>
      <Cuarto z={-0.8} y={0.3} col="#5e4a38" />
      <Mesa w={2} d={1.4} />
      {/* el pincho: base de bronce y la aguja */}
      <mesh position={[0, 0.008, 0]} castShadow><cylinderGeometry args={[0.045, 0.05, 0.016, 48]} />{M.brass({ col: "#b8873a" })}</mesh>
      <mesh position={[0, 0.11, 0]} castShadow><cylinderGeometry args={[0.0018, 0.003, 0.2, 12]} />{M.steel()}</mesh>
      {Array.from({ length: N }, (_, i) => {
        const k = spr(t, tk(i), 1.4, 2.2); if (t < tk(i) - 0.2) return null;
        const yb = 0.018 + i * 0.0055, rz = (rn(i, 3) - 0.5) * 0.5, caida = 1 - cl(k);
        return <group key={i} position={[0.006 * (rn(i, 1) - 0.5), yb + caida * 0.22, 0.006 * (rn(i, 2) - 0.5)]} rotation={[-Math.PI / 2 + 0.05 * (rn(i, 5) - 0.5), 0, rz + caida * 0.6]}>
          <mesh castShadow receiveShadow position={[0, -0.03, 0]}><planeGeometry args={[0.1, 0.14]} /><meshStandardMaterial map={boleta(1955 + i)} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>;
      })}
      <Blob w={0.4} d={0.4} o={0.35} />
    </Esc>
  </Stage>;
};

// ================= MARCADOR: el tablero de chapas; giran al 2 y al 0 =================
const chapa = (n: string) => canv(`chapa|${n}`, 256, 320, (g) => {
  g.fillStyle = "#f2efe6"; g.fillRect(0, 0, 256, 320);
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(90,80,60,${0.07 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 320, 2, 2); }
  g.fillStyle = "#1a1d1f"; g.font = "900 250px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, 128, 172);
  g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 6; g.strokeRect(3, 3, 250, 314);
});
const verde = () => canv("verdeTab", 256, 256, (g) => {
  g.fillStyle = "#1f4a35"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "60,110,80" : "8,25,15"},${0.15 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2, 1); }
}, [2, 1]);
// el hueco: la chapa vieja cuelga quieta; la nueva baja girando desde arriba sobre la bisagra y la tapa
const Placa: React.FC<{ n: string }> = ({ n }) => <mesh position={[0, -0.11, 0]} castShadow receiveShadow><boxGeometry args={[0.17, 0.215, 0.005]} />
  <meshStandardMaterial attach="material-0" color="#cfcabe" /><meshStandardMaterial attach="material-1" color="#cfcabe" />
  <meshStandardMaterial attach="material-2" color="#cfcabe" /><meshStandardMaterial attach="material-3" color="#cfcabe" />
  <meshStandardMaterial attach="material-4" map={chapa(n)} roughness={0.55} metalness={0.1} /><meshStandardMaterial attach="material-5" color="#d9d4c8" /></mesh>;
const Chapa: React.FC<{ de: string; a: string; k: number; p: V3 }> = ({ de, a, k, p }) => <group position={p}>
  <mesh position={[0, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.2, 12]} />{M.steel()}</mesh>
  <group position={[0, 0, 0.004]}><Placa n={de} /></group>
  {k > 0.001 && <group position={[0, 0, 0.01]} rotation={[-Math.PI * (1 - cl(k)) - (k > 1 ? 0.06 * (k - 1) : 0), 0, 0]}><Placa n={a} /></group>}
</group>;
export const MarcadorFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, tGan = at("won", a - 1), tNada = at("nothing", wow);
  // la chapa de la izquierda pasa 0 → 1 → 2 (dos golpes), la derecha se queda en 0 y da un golpecito en «nothing»
  const k1 = spr(t, tGan, 0.6, 2.2), k2 = spr(t, wow - 0.05, 0.6, 2.2), kR = 0.12 * Math.sin(Math.PI * win(t, tNada, tNada + 0.35));
  const L = k2 > 0 ? { de: "1", a: "2", k: k2 } : { de: "0", a: "1", k: k1 };   // k del resorte pasa de 1: rebota
  const cam = camA(t, a, b, { p: [0.2, 0.06, 1.05], l: [0, 0.02, 0], fov: 32 }, { p: [-0.06, 0.03, 0.82], l: [-0.04, 0.0, 0], fov: 32 });
  const entra = spr(t, a - 0.1, 0.7, 2.0);
  const tiembla = 0.004 * Math.sin(t * 61) * win(t, wow, wow + 0.2) * (1 - win(t, wow + 1.2, wow + 2.2));
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#ffe6c4">
    <Esc cam={cam} key1={[-0.9, 1.2, 1.4]} warm={1.0}>
      <Cuarto z={-0.4} y={0} col="#4a3a2c" />
      <group position={[tiembla, -0.6 * (1 - cl(entra)), 0]} rotation={[0.5 * (1 - cl(entra)), 0, 0]}>
        {/* el tablero: madera pintada de verde con marco */}
        <mesh position={[0, 0.02, -0.01]} receiveShadow><boxGeometry args={[0.74, 0.46, 0.02]} /><meshStandardMaterial map={verde()} roughness={0.8} /></mesh>
        {[[0, 0.255, 0.78, 0.04], [0, -0.215, 0.78, 0.04]].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, 0.0]} castShadow><boxGeometry args={[w, h, 0.04]} /><meshStandardMaterial map={madera("marco")} roughness={0.6} /></mesh>)}
        {[-0.37, 0.37].map((x) => <mesh key={x} position={[x, 0.02, 0.0]} castShadow><boxGeometry args={[0.04, 0.5, 0.04]} /><meshStandardMaterial map={madera("marco")} roughness={0.6} /></mesh>)}
        {/* los dos huecos y sus chapas; en el medio, dos clavos de guion */}
        {[-0.14, 0.14].map((x) => <mesh key={x} position={[x, 0.005, 0.001]}><planeGeometry args={[0.2, 0.25]} /><meshStandardMaterial color="#0d1f16" roughness={0.9} /></mesh>)}
        <Chapa de={L.de} a={L.a} k={L.k} p={[-0.14, 0.13, 0]} />
        <group position={[0.14, 0.13, 0]} rotation={[kR, 0, 0]}><Chapa de="0" a="0" k={0} p={[0, 0, 0]} /></group>
        <mesh position={[0, 0.005, 0.012]}><boxGeometry args={[0.04, 0.012, 0.004]} /><meshStandardMaterial color="#e9e4d6" /></mesh>
        {/* cuatro bombitas arriba que se encienden en la victoria */}
        {[-0.24, -0.08, 0.08, 0.24].map((x, i) => { const on = win(t, wow + 0.1 * i, wow + 0.1 * i + 0.15); return <mesh key={x} position={[x, 0.2, 0.02]}><sphereGeometry args={[0.014, 16, 12]} />
          <meshStandardMaterial color="#fff2cc" emissive="#ffc96b" emissiveIntensity={0.1 + 3.5 * on * (0.75 + 0.25 * Math.sin(t * 18 + i))} />
          {on > 0.02 && <pointLight intensity={0.5 * on} distance={0.35} color="#ffcf80" />}</mesh>; })}
      </group>
      <pointLight position={[0, 0.25, 0.25]} intensity={1.6 * win(t, wow, wow + 0.3)} distance={1.2} color="#ffd38a" />
    </Esc>
  </Stage>;
};

// ================= NAVAJA: la maquinita de afeitar del padre =================
const moleteado = () => canv("molet", 128, 256, (g) => {
  g.fillStyle = "#b9bec4"; g.fillRect(0, 0, 128, 256);
  for (let i = -256; i < 256; i += 8) { g.strokeStyle = "rgba(40,44,50,.55)"; g.lineWidth = 2; g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); g.beginPath(); g.moveTo(i + 256, 0); g.lineTo(i, 256); g.stroke(); }
}, [3, 4]);
const azulejo = () => canv("azulejoCuad", 256, 256, (g) => {
  g.fillStyle = "#e4ece4"; g.fillRect(0, 0, 256, 256);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = 10 * rn(r * 4 + c, 1); g.fillStyle = `rgb(${158 - v},${192 - v},${170 - v})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60);
    const gr = g.createLinearGradient(c * 64, r * 64, c * 64 + 64, r * 64 + 64); gr.addColorStop(0, "rgba(255,255,255,.18)"); gr.addColorStop(1, "rgba(0,0,0,.06)"); g.fillStyle = gr; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); }
}, [6, 3.4]);
export const NavajaFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, tGira = at("twisted", wow), tHoja = at("dropped", wow);
  // las puertitas: se abren en «butterfly», se cierran cuando la hoja ya cayó
  const abre = spr(t, wow - 0.25, 1.1, 2.0), cierra = spr(t, tHoja + 0.8, 1.2, 2.0), ab = cl(abre) * (1 - cl(cierra));
  const gira = win(t, tGira - 0.05, tGira + 0.7) * Math.PI * 1.5 - (1 - cl(abre)) * 0 ;
  const hoja = spr(t, tHoja, 0.7, 2.4);
  const cam = camA(t, a, b, { p: [0.3, 0.16, 0.22], l: [0, 0.085, 0], fov: 30 }, { p: [0.19, 0.17, 0.04], l: [0, 0.128, 0], fov: 30 });
  const R = 0.016, L = 0.062, YH = 0.13;
  const lid = (sg: number) => <group position={[0, YH, sg * R]} rotation={[sg * 1.35 * ab, 0, 0]}>
    <mesh position={[0, 0, -sg * R]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[R, R, L, 40, 1, true, sg > 0 ? 0 : Math.PI / 2, Math.PI / 2]} />
      <meshStandardMaterial color="#e2e6ea" metalness={1} roughness={0.14} side={THREE.DoubleSide} /></mesh>
  </group>;
  return <Stage t={t} a={a} b={b} dim={0.65} tint="#ffe6c4">
    <Esc cam={cam} key1={[-0.7, 1.1, 0.7]} warm={1.0} env={0.8}>
      <mesh position={[0, 0.3, -0.28]} receiveShadow><planeGeometry args={[3, 1.2]} /><meshStandardMaterial map={azulejo()} roughness={0.35} /></mesh>
      <mesh position={[-0.3, 0.3, 0.4]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[1.4, 1.2]} /><meshStandardMaterial map={azulejo()} roughness={0.35} /></mesh>
      {/* la repisa del lavabo: porcelana */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.6, 0.6]} /><meshPhysicalMaterial color="#f2efe8" roughness={0.15} clearcoat={1} /></mesh>
      <group position={[0, 0.0, 0]} rotation={[0, 0, 0]}>
        {/* el mango moleteado (gira) y la perilla */}
        <group rotation={[0, gira, 0]}>
          <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.0095, 0.0105, 0.11, 32]} /><meshStandardMaterial map={moleteado()} metalness={1} roughness={0.32} /></mesh>
          <mesh position={[0, 0.004, 0]} castShadow><sphereGeometry args={[0.009, 24, 16]} />{M.chrome()}</mesh>
          <mesh position={[0, 0.118, 0]} castShadow><cylinderGeometry args={[0.009, 0.0095, 0.012, 32]} />{M.chrome()}</mesh>
        </group>
        {/* la cabeza: la base curva (peine) y las dos puertitas como alas */}
        <mesh position={[0, YH - 0.004, 0]} castShadow><boxGeometry args={[L + 0.004, 0.006, 2 * R + 0.004]} />{M.chrome({ col: "#dfe3e7" })}</mesh>
        {lid(1)}{lid(-1)}
        {/* la hoja de doble filo: baja desde arriba al hueco */}
        {abre > 0.05 && <mesh position={[0, YH + 0.002 + (1 - cl(hoja)) * lerp(0.07, 0.035, win(t, wow, tHoja))  , 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow
          geometry={extr("hojaA", [[-0.03, -0.011], [0.03, -0.011], [0.03, 0.011], [-0.03, 0.011]], 0.0006, 0.0002, [[[-0.012, -0.002], [0.012, -0.002], [0.012, 0.002], [-0.012, 0.002]]])}>{M.steel({ col: "#d4d9de" })}</mesh>}
      </group>
      <group position={[-0.08, 0, -0.17]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.012, 0.014, 0.06, 20]} /><meshStandardMaterial color="#3a2414" roughness={0.4} /></mesh>
        <mesh position={[0, 0.075, 0]} castShadow><sphereGeometry args={[0.024, 20, 16]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} /></mesh>
      </group>
      <Blob w={0.18} d={0.18} o={0.35} />
    </Esc>
  </Stage>;
};

// ================= CALENDARIO: 15 de mayo baja el canotier; un manotazo lo vuela; 15 de septiembre, fieltro =================
const hoja = (mes: string, dia: string) => canv(`cal|${mes}|${dia}`, 320, 400, (g) => {
  g.fillStyle = "#f4efe3"; g.fillRect(0, 0, 320, 400);
  for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(120,100,70,${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 320, rn(i, 4) * 400, 2, 2); }
  g.fillStyle = "#a3281f"; g.fillRect(0, 0, 320, 92);
  g.fillStyle = "#f6efe0"; g.textAlign = "center"; g.textBaseline = "middle"; let fs = 58; do { g.font = `800 ${fs}px Georgia, serif`; fs -= 2; } while (g.measureText(mes).width > 280); g.fillText(mes, 160, 50);
  g.fillStyle = "#1a1714"; g.font = "900 220px Georgia, serif"; g.fillText(dia, 160, 250);
});
export const CalendarioFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, tSep = f.mo!.sep, tKnock = at("knock it off", a), tMay = at("15th of May", a), tFelt = at("felt again", tSep);
  const [paja, d1] = useImg("wm01a/kit/k_canotier.png"), [fiel, d2] = useImg("wm01a/kit/k_fedora.png");
  const asp = (x: THREE.Texture | null) => { const im = x?.image as HTMLImageElement | undefined; return im ? im.height / im.width : 1; };
  // páginas: la de mayo se ve desde el arranque; en «15th of September» se arranca (se levanta y cae)
  const arr = win(t, tSep - 0.05, tSep + 0.7);
  const baja = spr(t, wow - 0.15, 1.1, 2.0), vuela = win(t, tKnock, tKnock + 0.9), vuelve = spr(t, tFelt - 0.1, 1.1, 2.0);
  const cam = camA(t, a, b, { p: [0.18, 0.05, 1.05], l: [0.05, 0.0, 0], fov: 30 }, { p: [0.0, 0.02, 0.88], l: [0.08, -0.02, 0], fov: 28 });
  const sombrero = (tex: THREE.Texture | null, p: V3, rz: number, o: number) => tex && o > 0.01 ? <group position={p} rotation={[0, 0, rz]}>
    <mesh castShadow><planeGeometry args={[0.3, 0.3 * asp(tex)]} /><meshStandardMaterial map={tex} alphaTest={0.4} roughness={0.85} transparent opacity={o} side={THREE.DoubleSide} /></mesh>
  </group> : null;
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#ffe2bd">
    <Esc cam={cam} key1={[-1.0, 1.3, 1.5]} warm={1.0}>
      {paja && <Ready dep={paja} done={d1} />}{fiel && <Ready dep={fiel} done={d2} />}
      <mesh position={[0, 0, -0.05]} receiveShadow><planeGeometry args={[2, 1.3]} /><meshStandardMaterial color="#cdbd9c" roughness={0.95} alphaMap={edgeAlpha()} transparent /></mesh>
      {/* el calendario de la pared: taco con dos páginas; arriba la de mayo, abajo la de septiembre */}
      <group position={[-0.2, 0.0, -0.035]}>
        <mesh position={[0, 0.0, -0.004]} receiveShadow><planeGeometry args={[0.27, 0.34]} /><meshStandardMaterial map={hoja(t > tSep ? "SEPTEMBER" : "SEPTEMBER", "15")} roughness={0.9} /></mesh>
        {arr < 1 && <group position={[0, 0.17, 0.002]} rotation={[-arr * 2.6, 0, arr * 0.3]}>
          <mesh position={[0, -0.17, 0]} castShadow><planeGeometry args={[0.27, 0.34]} /><meshStandardMaterial map={hoja("MAY", "15")} roughness={0.9} side={THREE.DoubleSide} /></mesh></group>}
        <mesh position={[0, 0.175, 0.004]}><boxGeometry args={[0.28, 0.018, 0.01]} />{M.brass({ col: "#9c7a3c" })}</mesh>
      </group>
      {/* el gancho de los sombreros, a la derecha */}
      <mesh position={[0.24, 0.1, 0.0]} rotation={[Math.PI / 2 - 0.35, 0, 0]} castShadow><cylinderGeometry args={[0.01, 0.012, 0.09, 16]} />{M.brass({ col: "#b58a3e" })}</mesh>
      {/* canotier: baja al gancho en «Straw hat day»; el manotazo lo vuela fuera de cuadro */}
      {sombrero(paja, [0.24 + vuela * 0.7, 0.04 + (1 - cl(baja)) * 0.6 + vuela * 0.25, 0.04], vuela * -2.4, t > wow - 0.2 ? 1 : 0)}
      {/* fieltro: vuelve en «felt again» */}
      {sombrero(fiel, [0.24, 0.04 + (1 - cl(vuelve)) * 0.6, 0.045], 0, t > tFelt - 0.15 ? 1 : 0)}
    </Esc>
  </Stage>;
};
