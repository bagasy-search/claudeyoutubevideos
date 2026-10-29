// lou29a · componentes en 3D (vuelta 2) 1/5: c00-c07. Cada uno es utilería del diner que HACE la idea de ese segundo.
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { H } from "./hkit";
import { preload, usePhoto, Bench, Cam, Clock, Coin, Food, G, Glass, Jar, Label3, Plate, Pot, Pour, Sheet, Skillet, Steam3, Std, Tool, ez, lerp, rnd, sp, useTex, V3 } from "./props3d";
import { FONT } from "./lib";
import { HAND, MARK } from "./hkit";

preload(["la_n15a", "la_n13a", "la_n14a"]);   // fotos de platos que van ADENTRO de las piezas (más las de fondo, abajo)
// envoltura: monta el Bench sólo en su tramo; entra con fundido corto (la cámara ya entra desde atrás) y se va fundiéndose
export const R3: React.FC<{ t: number; h: H; cam: Cam; cam2?: Cam; top?: "formica" | "steel" | "wood"; f: (tt: number, dur: number) => React.ReactNode; over?: (tt: number, dur: number) => React.ReactNode }> = ({ t, h, cam, cam2, top, f, over }) => {
  if (t < h.at - 0.05 || t > h.out + 0.8) return null;
  const tt = t - h.at, dur = h.out - h.at, o = ez(tt, -0.05, 0.4) * (1 - ez(tt, dur + 0.05, dur + 0.75));
  // encuadre seguro: plano un 10 % más abierto y la 2ª cámara sólo se acerca sobre el MISMO centro (nada se corta por el borde)
  const wide = (c: Cam): Cam => ({ ...c, p: [c.l[0] + (c.p[0] - c.l[0]) * 1.22, c.l[1] + (c.p[1] - c.l[1]) * 1.22, c.l[2] + (c.p[2] - c.l[2]) * 1.22] });
  const c1 = wide(cam), c2: Cam = { ...c1, p: [lerp(c1.p[0], c1.l[0], 0.12), lerp(c1.p[1], c1.l[1], 0.12), lerp(c1.p[2], c1.l[2], 0.12)] };
  return <AbsoluteFill style={{ opacity: o }}>
    <Bench tt={tt} dur={dur} bg={h.bg} cam={c1} cam2={cam2 ? c2 : c2} top={top}>{f(tt, dur)}</Bench>
    {over && <AbsoluteFill style={{ fontFamily: FONT }}>{over(tt, dur)}</AbsoluteFill>}
  </AbsoluteFill>;
};
// rótulo HTML grande (≤3 palabras) que cae con peso; sólo donde el 3D no lo puede llevar
export const Cap: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; col?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, txt, col = "#f7f4ee", size = 64, hand }) => {
  const s = sp(tt, at, 7, 0.5); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -50}px) scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 2), fontFamily: hand ? HAND : FONT, fontWeight: 900, fontSize: Math.max(size, 62), color: hand ? col : "#fffaf0", letterSpacing: hand ? 0 : 3, whiteSpace: "nowrap", padding: hand ? 0 : "10px 30px 12px", background: hand ? "none" : "rgba(24,16,12,.78)", borderLeft: hand ? "none" : `10px solid ${col === "#f7f4ee" ? "#e4572e" : col}`, borderRadius: 8, boxShadow: hand ? "none" : "0 14px 40px rgba(0,0,0,.45)", textShadow: hand ? "0 4px 18px rgba(0,0,0,.6)" : "none" }}>{txt}</div>;
};
// vapor (HTML, desenfocado de verdad) sobre el punto de pantalla de la olla/plato
export const Vapor: React.FC<{ tt: number; x: number; y: number; w?: number; n?: number; a?: number }> = ({ tt, x, y, w = 260, n = 6, a = 1 }) => <>{Array.from({ length: n }, (_, i) => {
  const ph = (tt * 0.32 + i / n) % 1;
  return <div key={i} style={{ position: "absolute", left: x - w / 2 + (i + 0.5) * (w / n) + 22 * Math.sin(tt * 0.9 + i * 2), top: y - ph * 300, width: 70, height: 130, borderRadius: "50%", background: "rgba(255,246,232,.55)", filter: "blur(22px)", opacity: a * Math.sin(ph * Math.PI) * 0.5, transform: `translate(-50%,-50%) scale(${0.6 + ph})` }} />;
})}</>;
export const drop = (tt: number, at: number, h0 = 1.2) => { const k = sp(tt, at, 9, 0.38); return { y: h0 * (1 - k), sq: 1 - 0.12 * Math.max(0, Math.sin(Math.min(1, (tt - at) * 3) * Math.PI)) * (tt > at ? 1 : 0), on: tt > at - 0.02 }; };

// c00 · la servilleta del mostrador: la birome dibuja la US 30 (Chicago → Pittsburgh) y un alfiler rojo se clava en el Blue Moon
const NAP_PTS: V3[] = [[-1.05, 0, 0.12], [-0.6, 0, -0.05], [-0.2, 0, 0.12], [0.15, 0, 0.0], [0.55, 0, -0.12], [1.05, 0, 0.05]];
export const RNapkin: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(NAP_PTS.map((p) => new THREE.Vector3(...p))), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 160, 0.014, 8, false), [curve]);
  return <R3 t={t} h={h} cam={{ p: [0, 2.3, 1.7], l: [0, 0, -0.1], fov: 36 }} cam2={{ p: [0.15, 1.7, 1.25], l: [0.1, 0, -0.05], fov: 34 }} f={(tt) => {
    const d = ez(tt, 0.9, 4.2), pin = sp(tt, 4.4, 8, 0.4); tube.setDrawRange(0, Math.floor(d * 160) * 8 * 6);
    const pen = curve.getPoint(Math.max(0.001, d));
    return <>
      <Sheet id="napkin" w={2.5} h={1.5} th={0.004} r={[-Math.PI / 2, 0, 0.05]} p={[0, 0.003, 0]} draw={(g, w, hh) => {
        g.fillStyle = "#f7f3ea"; g.fillRect(0, 0, w, hh); g.strokeStyle = "rgba(150,130,100,.22)"; g.lineWidth = 3; g.setLineDash([10, 8]); g.strokeRect(40, 40, w - 80, hh - 80); g.setLineDash([]);
        for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(200,185,160,${0.12 * rnd(i, 3)})`; g.fillRect(rnd(i, 1) * w, rnd(i, 2) * hh, 3, 3); }
        g.fillStyle = "#1d3f9e"; g.font = `700 64px ${HAND}`; g.fillText("Chicago", 40, hh * 0.62); g.fillText("Pittsburgh", w - 300, hh * 0.58); g.font = `400 70px ${MARK}`; g.fillText("US 30", w * 0.42, hh * 0.2);
      }} />
      <mesh geometry={tube} position={[0, 0.012, 0]}><meshStandardMaterial color="#1d3f9e" roughness={0.4} /></mesh>
      {/* la birome que dibuja */}
      <G p={[pen.x + 0.06, 0.2 + 0.25 * ez(tt, 4.0, 4.6), pen.z + 0.04]} r={[0.5, 0.3, -0.5]}><mesh castShadow><cylinderGeometry args={[0.022, 0.022, 0.42, 16]} /><Std c="#e8e3d8" r={0.3} cc={1} /></mesh><mesh position={[0, -0.23, 0]}><coneGeometry args={[0.022, 0.05, 16]} /><Std c="#2a2a2a" m={0.8} r={0.3} /></mesh><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.024, 0.024, 0.06, 16]} /><Std c="#1d3f9e" /></mesh></G>
      {/* alfiler rojo en el Blue Moon (Van Wert) */}
      <G p={[0.15, 0.09 + 0.7 * (1 - pin), 0.0]}><mesh castShadow><sphereGeometry args={[0.05, 24, 16]} /><Std c="#d42a1e" r={0.25} cc={1} /></mesh><mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.005, 0.005, 0.1, 8]} /><Std c="#ccc" m={1} r={0.2} /></mesh></G>
      <Label3 txt="BLUE MOON" col="#b3241b" font="mark" w={0.7} p={[0.18, 0.006, 0.24]} r={[-Math.PI / 2, 0, 0]} s={Math.min(1, pin * 1.2)} />
      <G p={[-1.55, 0, -0.55]}><Pot rad={0.17} h={0.2} fill="#2b1608" handles={false} /></G>
    </>;
  }} />;
};

// c01 · el cuentakilómetros del Kenworth: tambores mecánicos que ruedan +40 millas mientras el camioncito rojo cruza la ruta
const DrumTex = () => useTex("drum", 2560, 256, (g, w, hh) => {
  g.fillStyle = "#151311"; g.fillRect(0, 0, w, hh); g.fillStyle = "#f2ede2"; g.font = `900 190px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i < 10; i++) { g.save(); g.translate(i * 256 + 128, hh / 2); g.rotate(Math.PI / 2); g.fillText(String(i), 0, 8); g.restore(); }
});
export const ROdometer: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const tex = DrumTex();
  return <R3 t={t} h={h} cam={{ p: [0, 1.35, 2.7], l: [0, 0.3, -0.3], fov: 34 }} cam2={{ p: [0.3, 1.1, 2.1], l: [0, 0.28, -0.2], fov: 32 }} f={(tt) => {
    const v = 40 * ez(tt, 0.8, 4.4), truck = ez(tt, 0.3, 5.8);
    const vals = [1, 2, 3, Math.floor(v / 10), v % 10];   // 123|00 → 123|40 millas
    return <>
      {/* ruta de asfalto sobre la mesada y el camioncito rojo */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, -0.85]} receiveShadow><planeGeometry args={[6, 0.45]} /><Std c="#2c2c2e" r={0.85} /></mesh>
      {[...Array(9)].map((_, i) => <mesh key={i} rotation-x={-Math.PI / 2} position={[-2.8 + i * 0.7, 0.004, -0.85]}><planeGeometry args={[0.3, 0.035]} /><Std c="#e8c95a" /></mesh>)}
      <G p={[lerp(-2.6, 2.6, truck), 0, -0.85]} s={0.5}>
        <mesh position={[-0.42, 0.28, 0]} castShadow><boxGeometry args={[0.42, 0.42, 0.36]} /><Std c="#c62a1e" r={0.3} cc={1} /></mesh>
        <mesh position={[0.32, 0.32, 0]} castShadow><boxGeometry args={[1.0, 0.48, 0.38]} /><Std c="#e9e5dc" r={0.5} /></mesh>
        {[-0.5, -0.1, 0.5].map((x) => [-0.19, 0.19].map((z) => <mesh key={x + "" + z} position={[x, 0.08, z]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.08, 0.08, 0.06, 20]} /><Std c="#151515" r={0.8} /></mesh>))}
      </G>
      {/* caja del odómetro: cromo + ventana + 5 tambores */}
      <G p={[0, 0.24, 0.35]}>
        <mesh castShadow><boxGeometry args={[1.5, 0.48, 0.4]} /><meshStandardMaterial color="#dfe3e8" metalness={1} roughness={0.2} /></mesh>
        <mesh position={[0, 0, 0.18]}><boxGeometry args={[1.3, 0.3, 0.06]} /><Std c="#0b0a09" r={0.9} /></mesh>
        {vals.map((val, i) => <mesh key={i} position={[-0.5 + i * 0.25, 0, 0.13]} rotation={[(val - 9.5) * (Math.PI / 5), 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.2, 40, 1, true]} /><meshStandardMaterial map={tex ?? undefined} color={i === 4 ? "#fff" : "#ddd"} roughness={0.5} /></mesh>)}
        <mesh position={[0, 0, 0.215]}><planeGeometry args={[1.3, 0.3]} /><meshPhysicalMaterial transparent opacity={0.12} roughness={0.05} clearcoat={1} /></mesh>
      </G>
    </>;
  }} over={(tt) => <Cap tt={tt} at={4.4} x={960} y={190} txt="+40 MILES · EVERY WEEK" col="#ffb257" size={58} />} />;
};

// c02 · la olla de 20 cuartos que nunca se lavó: el chili hierve, el reloj llega a medianoche y los codos caen adentro
export const RPot20: React.FC<{ t: number; h: H }> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.6, 2.4], l: [0, 0.4, 0], fov: 34 }} cam2={{ p: [-0.3, 1.9, 1.6], l: [0, 0.5, 0], fov: 32 }} f={(tt, dur) => {
  const clk = 10 + 2 * ez(tt, 0.8, 5.5), mac = ez(tt, 5.6, 8.5);
  return <>
    <Pot rad={0.62} h={0.72} photo="la_n15a" level={0.9} p={[0, 0, 0]} />
    <Clock hour={clk} rad={0.36} p={[1.35, 1.05, -0.9]} r={[0, -0.35, 0]} />
    {[...Array(14)].map((_, i) => { const a = 5.6 + i * 0.18, k = ez(tt, a, a + 0.5); return tt > a ? <mesh key={i} position={[0.35 * (rnd(i, 1) - 0.5), 1.5 - k * 0.8, 0.35 * (rnd(i, 2) - 0.5)]} rotation={[rnd(i, 3) * 6, rnd(i, 4) * 6, 0]} scale={k > 0.98 ? 0 : 1}><torusGeometry args={[0.035, 0.014, 8, 16, Math.PI * 0.9]} /><Std c="#f0d48a" r={0.5} /></mesh> : null; })}
    <Label3 txt="20 QT" col="#2b2f35" w={0.5} font="mark" p={[0, 0.38, 0.625]} />
  </>;
}} over={(tt) => <><Vapor tt={tt} x={960} y={430} w={420} /><Cap tt={tt} at={0.9} x={420} y={200} txt="SINCE 1978" col="#ffb257" size={56} /><Cap tt={tt} at={5.6} x={1500} y={880} txt="MIDNIGHT = CHILI MAC" size={50} /></>} />;

// c03 · la caja de codos dice 10 minutos: el marcador la tacha y escribe 8; la olla hierve al lado
export const RMacTimer: React.FC<{ t: number; h: H }> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.1, 2.3], l: [0, 0.45, 0], fov: 34 }} cam2={{ p: [-0.25, 0.95, 1.7], l: [-0.2, 0.5, 0], fov: 32 }} f={(tt) => {
  const strike = ez(tt, 1.6, 2.3), eight = sp(tt, 2.6, 8, 0.45), pour = ez(tt, 5.5, 7.5);
  return <>
    <G p={[-0.45, 0, 0]} r={[0, 0.25, 0]}>
      <Sheet id="elbowbox" w={0.7} h={0.95} th={0.25} p={[0, 0.475, 0]} draw={(g, w, hh) => {
        g.fillStyle = "#1d47a8"; g.fillRect(0, 0, w, hh); g.fillStyle = "#f2c230"; g.fillRect(0, hh * 0.08, w, hh * 0.22);
        g.fillStyle = "#b3241b"; g.font = `900 100px ${FONT}`; g.textAlign = "center"; g.fillText("ELBOWS", w / 2, hh * 0.24);
        g.fillStyle = "#fff"; g.font = `900 60px ${FONT}`; g.fillText("COOK", w / 2, hh * 0.5); g.font = `900 230px ${FONT}`; g.fillText("10", w / 2, hh * 0.76); g.font = `900 60px ${FONT}`; g.fillText("MINUTES", w / 2, hh * 0.88);
      }} />
      {/* tachadura de marcador rojo y el 8 escrito a mano, pegados a la cara de la caja */}
      <mesh position={[-0.2 + 0.2 * strike, 0.25, 0.128]} rotation-z={0.25}><planeGeometry args={[0.4 * strike + 0.001, 0.05]} /><meshStandardMaterial color="#e3261a" roughness={0.6} /></mesh>
      <Label3 txt="8" col="#ffde3a" font="hand" w={1.0} p={[0.26, 0.3, 0.13]} s={eight} />
    </G>
    <Pot rad={0.42} h={0.48} fill="#d9c9a0" level={0.8} p={[0.65, 0, 0.1]} />
    {[...Array(12)].map((_, i) => { const a = 3.4 + i * 0.12, k = ez(tt, a, a + 0.45); return tt > a && k < 0.98 ? <mesh key={i} position={[0.65 + 0.3 * (rnd(i, 5) - 0.5), 1.2 - k * 0.8, 0.1 + 0.3 * (rnd(i, 6) - 0.5)]} rotation={[rnd(i, 3) * 6, rnd(i, 4) * 6, 0]}><torusGeometry args={[0.03, 0.012, 8, 16, Math.PI * 0.9]} /><Std c="#f0d48a" r={0.5} /></mesh> : null; })}
  </>;
}} over={(tt) => <><Vapor tt={tt} x={1250} y={560} w={300} /><Cap tt={tt} at={2.8} x={960} y={170} txt="BOX TIME MINUS 2" col="#ffb257" size={56} /></>} />;
// col="#ffb257" size={56} />} />;

// c04 · el plato hondo de chili mac: el cheddar rallado cae en hebras y la cebolla cruda en cubitos, de a uno
export const RCheddar: React.FC<{ t: number; h: H }> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.9, 1.5], l: [0, 0.05, 0], fov: 34 }} cam2={{ p: [0.25, 1.4, 1.05], l: [0, 0.05, 0], fov: 32 }} f={(tt) => <>
  <Plate deep rad={0.6} photo="la_n15a" zoom={1.9} />
  {[...Array(40)].map((_, i) => { const a = 0.9 + i * 0.05, k = ez(tt, a, a + 0.5); return tt > a ? <mesh key={i} position={[0.42 * (rnd(i, 1) - 0.5), 0.07 + 1.1 * (1 - k), 0.42 * (rnd(i, 2) - 0.5)]} rotation={[Math.PI / 2, 0, rnd(i, 3) * 6]}><boxGeometry args={[0.012, 0.11, 0.006]} /><Std c="#f2a531" r={0.5} /></mesh> : null; })}
  {[...Array(16)].map((_, i) => { const a = 3.4 + i * 0.09, k = ez(tt, a, a + 0.45); return tt > a ? <mesh key={i} position={[0.36 * (rnd(i, 7) - 0.5), 0.08 + 1.1 * (1 - k), 0.36 * (rnd(i, 8) - 0.5)]} rotation={[rnd(i, 9), rnd(i, 10), 0]}><boxGeometry args={[0.028, 0.028, 0.028]} /><Std c="#f4f1ea" r={0.3} cc={0.8} /></mesh> : null; })}
  <Tool kind="spoon" p={[0.75, 0.02, 0.2]} r={[0, -0.6, 0]} />
</>} over={(tt) => <><Vapor tt={tt} x={960} y={420} w={360} a={0.7} /><Cap tt={tt} at={1.0} x={360} y={300} txt="SHARP CHEDDAR" col="#ffb257" size={54} /><Cap tt={tt} at={3.5} x={1560} y={300} txt="RAW ONION" size={54} /></>} />;

// c05 · el hoyuelo del pulgar: una bola alta y otra que un pulgar hunde en el centro (así no se infla en la plancha)
export const RThumbPatty: React.FC<{ t: number; h: H }> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.0, 1.9], l: [0, 0.1, 0], fov: 33 }} cam2={{ p: [0.15, 0.85, 1.6], l: [0.05, 0.08, 0], fov: 32 }} f={(tt) => {
  const press = ez(tt, 2.2, 3.0) * (1 - ez(tt, 3.6, 4.4)), dent = ez(tt, 2.6, 3.0), dA = drop(tt, 0.4, 1.0), dB = drop(tt, 0.9, 1.0);
  return <>
    <Sheet w={2.3} h={1.1} th={0.004} id="wax" draw={(g, w, hh) => { g.fillStyle = "#f3eee2"; g.fillRect(0, 0, w, hh); g.strokeStyle = "rgba(160,140,110,.25)"; for (let i = 0; i < 30; i++) { g.beginPath(); g.moveTo(rnd(i, 1) * w, 0); g.lineTo(rnd(i, 2) * w, hh); g.stroke(); } }} p={[0, 0.003, 0]} r={[-Math.PI / 2, 0, 0.03]} />
    <G p={[-0.55, dA.y, 0]} s={[1, dA.sq, 1]}><Food kind="ball" tex="beef" s={[2.3, 1.45, 2.3]} /></G>
    <G p={[0.55, dB.y, 0]}>
      <Food kind="ball" tex="beef" s={[2.9, 0.8, 2.9]} />
      <mesh position={[0, 0.095 - 0.02 * dent, 0]} scale={[1, 0.25 * dent + 0.001, 1]}><sphereGeometry args={[0.1, 32, 16]} /><Std c="#5e2a20" r={0.9} /></mesh>
    </G>
    {/* el pulgar: cápsula color piel que baja y presiona */}
    <G p={[0.55, 0.16 + 0.9 * (1 - press) + 0.6 * ez(tt, 3.6, 4.4), 0]} r={[0, 0, 0.15]}><mesh castShadow><capsuleGeometry args={[0.075, 0.45, 8, 24]} /><Std c="#d9a184" r={0.55} /></mesh></G>
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.6} x={600} y={820} txt="PUFFS UP" col="#ff5a4a" size={54} /><Cap tt={tt} at={3.0} x={1330} y={820} txt="STAYS FLAT" col="#ffb257" size={54} /></>} />;

// c06 · la cebolla en la sartén de hierro: 15 minutos a fuego medio, del blanco al caramelo, con el reloj de pared corriendo
export const ROnionClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.5, 2.0], l: [0, 0.1, 0], fov: 34 }} cam2={{ p: [-0.3, 1.2, 1.5], l: [0, 0.15, 0], fov: 32 }} f={(tt, dur) => {
  const k = ez(tt, 0.6, dur - 1), c = new THREE.Color("#efe6c8").lerp(new THREE.Color("#8a4a17"), k);
  return <>
    <Skillet rad={0.62} inside="#3a2414" />
    {k < 0.98 && [...Array(46)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.48 * Math.sqrt(rnd(i, 2)); return <mesh key={i} position={[Math.cos(a) * r, 0.045, Math.sin(a) * r]} scale={[1, 1, 0.4]} rotation={[Math.PI / 2, 0, rnd(i, 3) * 6 + tt * 0.1 * (i % 3)]}><torusGeometry args={[0.06 + 0.03 * rnd(i, 4), 0.016, 8, 20, Math.PI * (0.7 + rnd(i, 5) * 0.5)]} /><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.7} transparent opacity={1 - ez(k, 0.45, 0.85)} /></mesh>; })}
    <OnionPhoto k={ez(k, 0.4, 0.85)} />
    <Clock hour={2 + (15 / 60) * ez(tt, 0.6, dur - 1)} rad={0.34} p={[1.25, 0.95, -1.0]} r={[0, -0.4, 0]} />
    <Tool kind="spatula" p={[-0.35 + 0.15 * Math.sin(tt * 1.4), 0.12, 0.1]} r={[0.2, 0.6, 0]} />
  </>;
}} over={(tt) => <><Vapor tt={tt} x={960} y={480} w={420} a={0.6} /><Cap tt={tt} at={0.8} x={420} y={210} txt="15 MIN · MEDIUM" col="#ffb257" size={54} /></>} />;

const OnionPhoto: React.FC<{ k: number }> = ({ k }) => { const ph = usePhoto("la_n14a", 0, 1, 2.6); return <mesh rotation-x={-Math.PI / 2} position={[0, 0.06, 0]}><circleGeometry args={[0.57, 64]} /><meshStandardMaterial key={ph ? "t" : "n"} map={ph ?? undefined} transparent opacity={k} roughness={0.35} /></mesh>; };

// c07 · la semana de los camioneros: siete hojas de almanaque; seis se caen hacia atrás y el JUEVES queda con el plato de spaghetti
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const RThursday: React.FC<{ t: number; h: H }> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.0, 2.9], l: [0, 0.45, 0], fov: 36 }} cam2={{ p: [0.1, 0.8, 2.0], l: [0.0, 0.4, 0], fov: 32 }} f={(tt) => <>
  {DAYS.map((d, i) => {
    const thu = i === 3, fall = thu ? 0 : ez(tt, 2.2 + Math.abs(i - 3) * 0.25, 2.9 + Math.abs(i - 3) * 0.25), up = sp(tt, 0.3 + i * 0.12, 8, 0.5);
    return <G key={d} p={[(i - 3) * 0.42, 0, -0.1]} r={[-fall * 1.45, 0, 0]}>
      <G p={[0, 0.3 * up, 0]} s={up}>
        <Sheet id={"day" + d} w={0.36} h={0.46} th={0.03} p={[0, 0.23, 0]} draw={(g, w, hh) => {
          g.fillStyle = "#f6f0e2"; g.fillRect(0, 0, w, hh); g.fillStyle = thu ? "#d42a1e" : "#3b4150"; g.fillRect(0, 0, w, hh * 0.28);
          g.fillStyle = "#fff"; g.font = `900 120px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(d, w / 2, hh * 0.15);
          g.fillStyle = thu ? "#d42a1e" : "#3b4150"; g.font = `900 300px ${FONT}`; g.fillText(String(i + 2), w / 2, hh * 0.65);
        }} />
      </G>
    </G>;
  })}
  <G p={[0, 0, 0.55 + 0.6 * (1 - sp(tt, 3.4, 6, 0.55))]}><Plate rad={0.34} photo="la_n13a" /></G>
</>} over={(tt) => <Cap tt={tt} at={3.6} x={960} y={170} txt="SPAGHETTI THURSDAY" col="#ffb257" size={58} />} />;

export const R3A: Record<string, React.FC<{ t: number; h: H }>> = { napkinMap: RNapkin, odometer: ROdometer, pot20: RPot20, macTimer: RMacTimer, cheddar: RCheddar, thumbPatty: RThumbPatty, onionClock: ROnionClock, thursday: RThursday };
