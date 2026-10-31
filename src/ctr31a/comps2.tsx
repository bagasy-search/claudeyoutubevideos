// ctr31a · PIEZAS 2 (6:40 → 16:50). Cada una vive sobre su Stage, todo es f(t), los momentos internos llegan por m (de at()).
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import * as THREE from "three";
import { W, V3 } from "./casa";
import { Mesa, Frasco, Linterna, CanoVidrio, Union, Regla, Bx, drop, orbit, win } from "./mesa3d";
import { Stage, Rot } from "./base";
import { FONT, P, e, spr, extrude } from "./lib";

const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const k1 = (t: number, a: number, s = 1) => Math.min(1.06, spr(t, a, s));
// página real del libro que llega volando y se queda flotando (nunca quieta)
const Pagina: React.FC<{ t: number; at: number; out: number; page: string; x: number; y: number; w?: number; rot?: number }> = ({ t, at: a, out, page, x, y, w = 470, rot = -5 }) => {
  const k = k1(t, a, 0.8), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.33, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) translateY(${(1 - k) * 380}px) rotateY(${(1 - k) * -55 + 5 * Math.sin(t * 0.4)}deg) rotateZ(${rot * k + 1.5 * Math.sin(t * 0.3)}deg)`, background: "#f6f1e6", borderRadius: 6, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.08)" }}>
      <Img src={staticFile(P + "libro/" + page + ".png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "linear-gradient(120deg,rgba(255,255,255,.18),transparent 45%)" }} />
    </div>
  );
};
// pelo + jabón: trenza gris ondulada que cuelga (TubeGeometry, f(len))
const Trenza: React.FC<{ len: number; t: number; p: V3; r?: number }> = ({ len, t, p, r = 0.018 }) => {
  const g = useMemo(() => {
    const pts = Array.from({ length: 14 }, (_, i) => new THREE.Vector3(0.025 * Math.sin(i * 1.7), -i / 13, 0.025 * Math.cos(i * 1.3)));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, r, 10, false);
  }, [r]);
  if (len <= 0.01) return null;
  return <mesh geometry={g} position={p} scale={[1, len, 1]} rotation={[0.05 * Math.sin(t * 1.1), 0, 0.06 * Math.sin(t * 0.9)]} castShadow><meshStandardMaterial color="#6f6a62" roughness={0.95} /></mesh>;
};

// ---------- 6:40 EL LADRILLO: una cucharada de borra por día → la pila se vuelve un ladrillo; al lado, un caño del ancho del pulgar ----------
export const Ladrillo: React.FC<{ t: number; a: number; b: number; m: { cuch: number; ladrillo: number; cuenta: number; pulgar: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.12, 0.5, 0.98], l: [0.06, 0.14, 0], fov: 31 });
  const pile = e(t, a, m.ladrillo), brick = Math.min(1.04, spr(t, m.ladrillo, 0.8));
  const tip = Math.max(0, Math.sin(((t - a) / 1.1) * Math.PI * 2)) * (1 - e(t, m.ladrillo - 0.3, m.ladrillo));
  const n = Math.round(1 + 364 * e(t, m.cuenta, m.cuenta + 3.2));
  return (
    <Stage t={t} a={a} b={b} tint="#ffc890">
      <Mesa cam={cam} floor="mueble">
        {/* cuchara que vuelca borra una y otra vez */}
        <group position={[-0.12, 0.32, 0.02]} rotation={[0, 0, -0.2 - 1.1 * tip]}>
          <Bx p={[-0.2, 0, 0]} s={[0.36, 0.014, 0.03]} c="#c9cdd2" m={0.9} ro={0.25} />
          <mesh scale={[0.07, 0.025, 0.05]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#c9cdd2" metalness={0.95} roughness={0.2} /></mesh>
          <mesh position={[0, 0.012, 0]} scale={[0.055, 0.016 * (1 - tip), 0.04]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#3a2516" roughness={0.95} /></mesh>
        </group>
        {/* granos cayendo (posición = f(t)) */}
        {t < m.ladrillo && Array.from({ length: 22 }, (_, i) => { const ph = ((t - a) * 0.9 + rnd(i)) % 1; return <mesh key={i} position={[-0.08 + 0.06 * rnd(i, 2), 0.33 - ph * 0.33, -0.04 + 0.08 * rnd(i, 3)]} scale={0.008 + 0.006 * rnd(i, 4)}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#2b1a0f" roughness={0.9} /></mesh>; })}
        {/* la pila → el ladrillo */}
        <mesh position={[0, 0.06 * pile * (1 - brick), 0]} scale={[0.22 * pile * (1 - brick), 0.13 * pile * (1 - brick), 0.22 * pile * (1 - brick)]}><coneGeometry args={[1, 1, 32]} /><meshStandardMaterial color="#3a2516" roughness={0.98} /></mesh>
        {brick > 0.01 && <Bx p={[0, 0.065 * brick, 0]} s={[0.46 * brick, 0.13 * brick, 0.22 * brick]} c="#3b2818" ro={0.97} r={0.012} />}
        {/* el caño del ancho del pulgar */}
        {t > m.pulgar - 0.3 && <group position={[0.36, 0.05 + drop(t, m.pulgar, 0.5), 0.12]}><CanoVidrio p={[0, 0, 0]} len={0.3} r={0.035} /></group>}
      </Mesa>
      <Rot t={t} at={m.ladrillo} out={b - 0.3} text="UN LADRILLO POR AÑO" x={W / 2} y={150} size={76} />
      {t > m.cuenta && <div style={{ position: "absolute", left: 1500, top: 470, transform: `translate(-50%,-50%) scale(${k1(t, m.cuenta)})`, textAlign: "center", fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow: extrude(6, "rgba(0,0,0,.6)") }}>
        <div style={{ fontSize: 150, lineHeight: 1 }}>{n}</div><div style={{ fontSize: 58, color: "#ffd9a8" }}>CUCHARADAS</div>
      </div>}
    </Stage>
  );
};

// ---------- 7:00 LA COLADERA: malla fina vs plástico de agujeros grandes; después el edificio de 12 pisos y la mitad de las llamadas ----------
export const Coladera: React.FC<{ t: number; a: number; b: number; m: { malla: number; plastico: number; edificio: number; mitad: number } }> = ({ t, a, b, m }) => {
  const bld = e(t, m.edificio - 0.2, m.edificio + 0.8);
  const disc = (mesh: boolean, x: number) => {
    const k = k1(t, a + (mesh ? 0.35 : 0.15), 0.8);
    return (
      <div style={{ position: "absolute", left: x, top: 560, width: 600, height: 600, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 400}px) rotateX(46deg) rotateZ(${(t - a) * (mesh ? 4 : -4)}deg)`, borderRadius: "50%", boxShadow: "0 40px 60px rgba(0,0,0,.6)", background: mesh ? "repeating-linear-gradient(0deg,#5d636a 0 2px,transparent 2px 9px), repeating-linear-gradient(90deg,#5d636a 0 2px,transparent 2px 9px), radial-gradient(circle,#c9d0d6,#8d959c)" : "radial-gradient(circle at 50% 50%, #e8e2d2 0%, #d6cfbd 100%)", border: "16px solid " + (mesh ? "#cfd5da" : "#e9e3d4") }}>
        {!mesh && Array.from({ length: 19 }, (_, i) => { const r = i ? (i < 7 ? 120 : 210) : 0, an = (i < 7 ? i : i - 6) * (i < 7 ? 60 : 30); return <div key={i} style={{ position: "absolute", left: 284 + r * Math.cos(an * Math.PI / 180) - 22, top: 284 + r * Math.sin(an * Math.PI / 180) - 22, width: 44, height: 44, borderRadius: "50%", background: "#1b1714" }} />; })}
      </div>
    );
  };
  // granos que caen: en el de plástico se pierden por los agujeros, en la malla se juntan
  const grains = (mesh: boolean, x: number) => Array.from({ length: 26 }, (_, i) => {
    const t0 = a + 0.8 + rnd(i, mesh ? 5 : 6) * 4, u = (t - t0) / 0.7;
    if (u < 0) return null;
    const land = 520 + 90 * (rnd(i, 7) - 0.5), gx = x + 300 * (rnd(i, 8) - 0.5);
    const y = mesh ? Math.min(land, -60 + u * u * 700) : -60 + u * u * 700;
    const o = mesh ? 1 : 1 - e(y, land, land + 160);
    return <div key={(mesh ? "m" : "p") + i} style={{ position: "absolute", left: gx, top: y, width: 14, height: 11, borderRadius: "40%", background: i % 3 ? "#3a2516" : "#e9dfc6", opacity: o }} />;
  });
  return (
    <Stage t={t} a={a} b={b} tint="#cfe0ea">
      <AbsoluteFill style={{ opacity: 1 - bld, transform: `scale(${1 - 0.2 * bld})` }}>
        {disc(false, 620)}{disc(true, 1300)}
        {grains(false, 620)}{grains(true, 1300)}
        {t > m.plastico && <div style={{ position: "absolute", left: 620, top: 560, transform: `translate(-50%,-50%) scale(${k1(t, m.plastico)}) rotate(-8deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 260, color: "#e0261a", textShadow: extrude(6, "rgba(0,0,0,.5)") }}>✕</div>}
        <Rot t={t} at={m.malla} out={m.edificio} text="DE MALLA FINA" x={1300} y={170} size={72} />
      </AbsoluteFill>
      {/* el edificio de 12 pisos: cada cocina llama (rojo); con la malla la mitad se apaga */}
      {bld > 0.01 && <div style={{ position: "absolute", left: W / 2, top: 600, transform: `translate(-50%,-50%) perspective(1800px) rotateY(${-18 + 6 * Math.sin(t * 0.3)}deg) translateY(${(1 - k1(t, m.edificio, 0.7)) * 500}px)`, opacity: bld }}>
        <div style={{ width: 460, padding: 20, background: "linear-gradient(90deg,#3c3833,#2a2723)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 0 0 4px #4a453f", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {Array.from({ length: 48 }, (_, i) => { const off = rnd(i, 9) < 0.5 && t > m.mitad + 0.3 + rnd(i, 10) * 1.2; const ring = !off && Math.sin(t * 7 + i) > 0.2 && t > m.edificio + 0.6 + rnd(i, 11) * 1.4; return <div key={i} style={{ height: 40, borderRadius: 4, background: off ? "#2a4a33" : ring ? "#e8402c" : "#7a6b52", boxShadow: ring ? "0 0 22px #ff5a3c" : off ? "0 0 10px #4fd27a55" : "none" }} />; })}
        </div>
      </div>}
      <Rot t={t} at={m.mitad} out={b - 0.3} text="LA MITAD" x={W / 2 + 470} y={600} size={110} col="#ffb257" />
    </Stage>
  );
};

// ---------- 7:50 EL ÚLTIMO ENJUAGUE: la ola de agua fría congela la grasa que venía tibia; la tetera hirviendo, también mal ----------
export const Enjuague: React.FC<{ t: number; a: number; b: number; m: { frio: number; tetera: number; mal: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.0, 1.0, 2.6], l: [0, 0.36, 0], fov: 34 }, 0.8);
  const front = -1.3 + 2.6 * e(t, m.frio, m.frio + 2.6); // frente de agua fría que avanza por el caño
  const n = 24;
  return (
    <Stage t={t} a={a} b={b} tint="#bcdcff">
      <Mesa cam={cam} floor="mueble" bloom={0.55}>
        <CanoVidrio p={[0, 0.32, 0]} len={2.6} r={0.13}>
          {/* el agua fría: un manguito azul que avanza */}
          {t > m.frio && <mesh rotation={[0, 0, Math.PI / 2]} position={[(front - 1.3) / 2, 0, 0]} scale={[1, Math.max(0.001, front + 1.3), 1]}><cylinderGeometry args={[0.122, 0.122, 1, 40, 1, true]} /><meshPhysicalMaterial color="#5fb4ff" transparent opacity={0.28} roughness={0.1} side={2} emissive="#2a7fff" emissiveIntensity={0.25} /></mesh>}
          {Array.from({ length: n }, (_, i) => {
            const base = -1.25 + ((i / n + (t - a) * 0.1) % 1) * 2.5;
            const frozenAt = m.frio + ((base + 1.3) / 2.6) * 2.6;      // cuando el frente lo alcanza
            const fz = t > frozenAt ? e(t, frozenAt, frozenAt + 0.4) : 0;
            const x = fz > 0 ? -1.25 + ((i / n + (frozenAt - a) * 0.1) % 1) * 2.5 : base;
            return <mesh key={i} position={[x, -0.1 + 0.2 * fz * (rnd(i) > 0.5 ? 1 : 0.4) * 0.5, 0.05 * Math.sin(i * 3)]} scale={[0.055, 0.022 + 0.01 * fz, 0.05]}><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color={fz > 0.5 ? "#f1ece0" : "#f0b048"} roughness={0.2 + 0.7 * fz} emissive="#ff9a20" emissiveIntensity={0.35 * (1 - fz)} /></mesh>;
          })}
        </CanoVidrio>
        {/* la tetera hirviendo a la derecha (vuelca y echa vapor) */}
        {t > m.tetera - 0.4 && <group position={[0.78, 0.66 + drop(t, m.tetera, 0.4), 0.1]} rotation={[0, 0, 0.7 * win(t, m.tetera + 0.4, m.tetera + 1.2)]}>
          <mesh castShadow scale={[1, 0.8, 1]}><sphereGeometry args={[0.16, 32, 20]} /><meshStandardMaterial color="#c8ccd0" metalness={0.9} roughness={0.22} /></mesh>
          <mesh position={[-0.17, 0.02, 0]} rotation={[0, 0, 1.0]}><cylinderGeometry args={[0.018, 0.028, 0.16, 16]} /><meshStandardMaterial color="#c8ccd0" metalness={0.9} roughness={0.22} /></mesh>
          {Array.from({ length: 6 }, (_, i) => { const ph = ((t - m.tetera) * 0.6 + i / 6) % 1; return <mesh key={i} position={[-0.25 - ph * 0.1, 0.1 + ph * 0.4, 0]} scale={0.03 + ph * 0.06}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#fff" transparent opacity={0.2 * (1 - ph)} depthWrite={false} /></mesh>; })}
        </group>}
      </Mesa>
      <Rot t={t} at={m.frio} out={m.tetera - 0.2} text="EL ENJUAGUE FRÍO" x={W / 2} y={160} size={72} col="#cfe6ff" />
      <Rot t={t} at={m.tetera} out={b - 0.3} text="NI HIRVIENDO" x={W / 2} y={160} size={72} col="#ffd9a8" />
      <Rot t={t} at={m.mal} out={b - 0.3} text="LAS DOS, MAL" x={W / 2} y={900} size={84} col="#ff6a50" />
    </Stage>
  );
};

// ---------- 8:25 UN MINUTO DE AGUA CALIENTE / EL HERVOR ABLANDA EL PVC: cronómetro que da la vuelta; la unión se comba y gotea ----------
export const Minuto: React.FC<{ t: number; a: number; b: number; m: { minuto: number; hirv: number; ablanda: number; meses: number; mano: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.1, 0.45, 1.7], l: [0, 0.32, 0], fov: 30 }, 0.7);
  const hot = e(t, m.hirv, m.hirv + 1.2) * (1 - e(t, m.mano, m.mano + 1)), warp = e(t, m.ablanda, m.meses + 1.5), drip = e(t, m.meses, m.meses + 0.5);
  const sweep = e(t, m.minuto + 0.3, m.minuto + 4.3);
  const watch = 1 - e(t, m.hirv - 0.6, m.hirv);
  return (
    <Stage t={t} a={a} b={b} tint="#ffcfa0">
      <Mesa cam={cam} floor="mueble">
        <Union p={[0, 0.32, 0]} warp={warp} drip={drip} t={t} hot={hot} />
        {/* vapor del agua hirviendo */}
        {hot > 0.02 && Array.from({ length: 10 }, (_, i) => { const ph = ((t - m.hirv) * 0.5 + i / 10) % 1; return <mesh key={i} position={[-0.4 + 0.8 * rnd(i), 0.42 + ph * 0.6, 0.05 * rnd(i, 2)]} scale={0.04 + ph * 0.08}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#fff" transparent opacity={0.22 * (1 - ph) * hot} depthWrite={false} /></mesh>; })}
      </Mesa>
      {/* el cronómetro de un minuto */}
      {watch > 0.01 && t > m.minuto - 0.2 && <div style={{ position: "absolute", left: 1560, top: 330, width: 260, height: 260, transform: `translate(-50%,-50%) scale(${k1(t, m.minuto) * (0.6 + 0.4 * watch)})`, opacity: watch }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(#ff8a3c ${sweep * 360}deg, rgba(255,255,255,.12) 0)`, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }} />
        <div style={{ position: "absolute", inset: 26, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#2e2a26,#16130f)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 88, color: "#fff" }}>{Math.round(sweep * 60)}"</div>
      </div>}
      <Rot t={t} at={m.minuto} out={m.hirv - 0.3} text="UN MINUTO, BIEN CALIENTE" x={W / 2} y={160} size={68} />
      <Rot t={t} at={m.hirv} out={m.ablanda - 0.1} text="HIRVIENDO, NUNCA" x={W / 2} y={160} size={78} col="#ff6a50" />
      <Rot t={t} at={m.ablanda} out={b - 0.3} text="SE ABLANDA" x={W / 2} y={160} size={84} col="#ffd9a8" />
    </Stage>
  );
};

// ---------- 9:05 EL SHOW DEL BICARBONATO: la espuma sube por el agujero y el tapón de grasa de abajo ni se entera ----------
export const Espuma: React.FC<{ t: number; a: number; b: number; m: { show: number; sal: number; nada: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.0, 1.45, 2.2], l: [0, 0.62, 0], fov: 34 }, 0.7);
  const foam = e(t, a + 0.4, m.show + 1.5) * (1 - e(t, m.sal, m.sal + 1.6));
  const hit = e(t, m.nada, m.nada + 0.3);
  return (
    <Stage t={t} a={a} b={b} tint="#e6f0ff">
      <Mesa cam={cam} floor="mueble">
        {/* pileta (tapa con agujero) y el caño de vidrio que baja */}
        <Bx p={[0, 0.9, 0]} s={[1.1, 0.04, 0.6]} c="#9aa0a6" m={0.9} ro={0.25} />
        <group position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}><CanoVidrio p={[0, 0, 0]} len={0.8} r={0.08}>
          {/* el tapón de grasa: gris amarillento, quieto; late en rojo cuando «no le hace nada» */}
          <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.074, 0.074, 0.22, 32]} /><meshStandardMaterial color="#cbbd8a" roughness={0.9} emissive="#ff2a1a" emissiveIntensity={0.5 * hit * (0.6 + 0.4 * Math.sin(t * 6))} /></mesh>
        </CanoVidrio></group>
        {/* la espuma: burbujas que suben y rebalsan sobre la pileta */}
        {Array.from({ length: 70 }, (_, i) => { const ph = ((t - a) * 0.35 + rnd(i)) % 1, r = 0.22 * Math.sqrt(rnd(i, 2)) * foam, an = rnd(i, 3) * 6.28; return <mesh key={i} position={[r * Math.cos(an), 0.92 + 0.1 * foam + ph * 0.18 * foam, r * Math.sin(an) * 0.7]} scale={(0.02 + 0.03 * rnd(i, 4)) * foam}><sphereGeometry args={[1, 12, 10]} /><meshPhysicalMaterial color="#ffffff" roughness={0.15} transmission={0.4} thickness={0.01} clearcoat={1} /></mesh>; })}
      </Mesa>
      <Rot t={t} at={m.show} out={m.nada - 0.2} text="ES UN SHOW" x={W / 2} y={920} size={84} />
      <Rot t={t} at={m.nada} out={b - 0.3} text="AL TAPÓN, NADA" x={W / 2} y={920} size={84} col="#ff6a50" />
    </Stage>
  );
};

// ---------- 9:38 MEDIA TAZA DE BICARBONATO SIN VINAGRE + agua caliente; una vez por mes (se guarda para el truco del viejo) ----------
export const MediaTaza: React.FC<{ t: number; a: number; b: number; m: { caliente: number; mes: number; guarda: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.8), tilt = win(t, a + 1.0, a + 2.0) * (1 - win(t, m.caliente, m.caliente + 0.6));
  const pour = e(t, a + 1.6, a + 3.2), water = e(t, m.caliente, m.caliente + 0.6) * (1 - e(t, m.mes - 0.4, m.mes));
  const pocket = e(t, m.guarda, m.guarda + 1.0);
  return (
    <Stage t={t} a={a} b={b} tint="#ffe6c4">
      {/* el desagüe visto de arriba */}
      <div style={{ position: "absolute", left: W / 2, top: 760, width: 560, height: 220, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%,#0c0a08 0%,#0c0a08 22%,#8a9096 24%,#c4cad0 48%,#6b7178 70%)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
        {water > 0.01 && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 120 + i * 80, height: 50 + i * 30, marginLeft: -(60 + i * 40), marginTop: -(25 + i * 15), borderRadius: "50%", border: "4px solid rgba(255,170,90,.6)", borderLeftColor: "transparent", transform: `rotate(${t * 260 * (1 - i * 0.12)}deg)`, opacity: water }} />)}
      </div>
      {/* el chorro de polvo */}
      {pour > 0.01 && pour < 0.999 && <div style={{ position: "absolute", left: W / 2 - 10, top: 470, width: 26, height: 290, background: "linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,255,255,.4))", filter: "blur(2px)", borderRadius: 12 }} />}
      {/* la taza medidora con la línea de ½ */}
      <div style={{ position: "absolute", left: W / 2 + 180 - 260 * pocket, top: 380 - 150 * pocket, width: 260, height: 300, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -500}px) rotate(${-112 * tilt}deg) scale(${1 - 0.55 * pocket})`, transformOrigin: "20% 20%" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "16px 16px 40px 40px", background: "linear-gradient(90deg,rgba(255,255,255,.35),rgba(255,255,255,.1) 40%,rgba(255,255,255,.3))", boxShadow: "0 0 0 5px rgba(230,240,245,.85), 0 30px 60px rgba(0,0,0,.5)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${50 * (1 - pour)}%`, background: "linear-gradient(180deg,#ffffff,#e7e4dc)" }} />
          <div style={{ position: "absolute", left: 20, top: "50%", width: 70, height: 4, background: "#d23a2a" }} />
          <div style={{ position: "absolute", left: 100, top: "44%", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#d23a2a" }}>½</div>
        </div>
      </div>
      {/* el calendario: un día marcado por mes */}
      {t > m.mes - 0.2 && <div style={{ position: "absolute", left: 1500, top: 470, width: 300, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${-16 + 4 * Math.sin(t * 0.5)}deg) scale(${k1(t, m.mes)})`, background: "#f6f1e6", borderRadius: 14, boxShadow: "0 40px 70px rgba(0,0,0,.55)", overflow: "hidden" }}>
        <div style={{ height: 60, background: "#c0392b" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, padding: 16 }}>{Array.from({ length: 28 }, (_, i) => <div key={i} style={{ height: 26, borderRadius: "50%", background: i === 2 ? "#ffd27a" : "#e2dccd", boxShadow: i === 2 ? `0 0 0 ${4 * k1(t, m.mes + 0.5)}px #c0392b` : "none" }} />)}</div>
      </div>}
      <Rot t={t} at={a + 0.5} out={m.caliente - 0.2} text="MEDIA TAZA, SIN VINAGRE" x={W / 2} y={150} size={70} />
      <Rot t={t} at={m.caliente} out={m.mes - 0.2} text="Y AGUA CALIENTE" x={W / 2} y={150} size={74} col="#ffcf9a" />
      <Rot t={t} at={m.mes} out={b - 0.3} text="UNA VEZ POR MES" x={W / 2 - 160} y={150} size={74} />
    </Stage>
  );
};

// ---------- 10:28 LA BOTELLA MARRÓN SOBRE LA BABA: media taza, diez minutos, chisporroteo; la prueba de la página 6 ----------
export const Chispas: React.FC<{ t: number; a: number; b: number; m: { media: number; diez: number; chis: number; cal: number; p6: number; espuma: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.05, 1.0, 2.35], l: [0, 0.5, 0], fov: 33 }, 0.7);
  const pour = win(t, m.media, m.media + 0.6) * (1 - win(t, m.diez, m.diez + 0.6));
  const clean = e(t, m.chis, m.cal + 2.5);
  const clock = Math.max(0, 600 - 600 * e(t, m.diez, m.cal));
  return (
    <Stage t={t} a={a} b={b} tint="#ffcf9a">
      <Mesa cam={cam} floor="mueble" bloom={0.6}>
        <CanoVidrio p={[0, 0.3, 0]} len={1.9} r={0.13}>
          {/* la baba en la pared del caño (verde grisácea), se va con el agua oxigenada */}
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.124, 0.124, 1.7, 48, 1, true]} /><meshStandardMaterial color="#6f7a58" roughness={0.6} transparent opacity={0.85 * (1 - clean)} side={2} /></mesh>
          {/* chisporroteo: burbujitas que nacen sobre la baba */}
          {t > m.chis - 0.5 && Array.from({ length: 40 }, (_, i) => { const ph = ((t - m.chis) * 1.6 + rnd(i)) % 1, an = rnd(i, 2) * 6.28; return <mesh key={i} position={[-0.8 + 1.6 * rnd(i, 3), 0.11 * Math.cos(an), 0.11 * Math.sin(an)]} scale={0.006 + 0.012 * ph}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={(1 - ph) * (1 - clean * 0.7)} toneMapped={false} /></mesh>; })}
        </CanoVidrio>
        <group position={[-0.25, 0.75 + drop(t, a + 0.2, 0.6), 0]} rotation={[0, 0, -1.9 * pour]}><Frasco p={[0, 0, 0]} s={1.3} level={0.7 - 0.25 * e(t, m.media, m.diez)} /></group>
        {pour > 0.05 && <mesh position={[-0.1, 0.62, 0]}><cylinderGeometry args={[0.012, 0.016, 0.3, 12]} /><meshPhysicalMaterial color="#e9f4f8" transmission={0.8} roughness={0.05} transparent opacity={0.8 * pour} /></mesh>}
      </Mesa>
      {t > m.diez - 0.2 && t < m.p6 && <div style={{ position: "absolute", left: 1520, top: 330, transform: `translate(-50%,-50%) scale(${k1(t, m.diez)})`, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#fff", textShadow: extrude(6, "rgba(0,0,0,.6)") }}>{`${Math.floor(clock / 60)}:${String(Math.floor(clock % 60)).padStart(2, "0")}`}</div>}
      <Rot t={t} at={m.media} out={m.diez - 0.2} text="MEDIA TAZA, DIRECTO" x={W / 2} y={930} size={70} col="#ffcf9a" />
      <Rot t={t} at={m.diez} out={m.chis - 0.2} text="10 MINUTOS SIN ABRIR" x={W / 2} y={930} size={70} />
      <Rot t={t} at={m.chis} out={m.p6 - 0.2} text="CHISPORROTEA" x={W / 2} y={930} size={80} />
      <Pagina t={t} at={m.p6} out={b - 0.3} page="p6" x={1480} y={500} w={370} />
      <Rot t={t} at={m.espuma} out={b - 0.3} text="SI HACE ESPUMA, SIRVE" x={W / 2 - 200} y={950} size={66} col="#ffd9a8" />
    </Stage>
  );
};

// ---------- 11:24 LA CUCHARA DEL 2003: el sifón de vidrio con una cucharita envuelta en baba gris del grosor de un dedo ----------
export const Cuchara: React.FC<{ t: number; a: number; b: number; m: { cuch: number; dedo: number; saca: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.0, 0.5, 1.6], l: [0, 0.22, 0], fov: 32 }, 0.7);
  const g = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[-0.55, 0.5, 0], [-0.25, 0.5, 0], [-0.22, 0.12, 0], [0, 0.0, 0], [0.22, 0.12, 0], [0.25, 0.42, 0], [0.6, 0.42, 0]].map((v) => new THREE.Vector3(...(v as V3))), false, "centripetal"), 120, 0.075, 32, false), []);
  const slime = e(t, m.cuch, m.dedo + 1.2) * (1 - e(t, m.saca + 0.4, m.saca + 1.6)), lift = e(t, m.saca, m.saca + 1.2);
  return (
    <Stage t={t} a={a} b={b} tint="#d8e2c8">
      <Mesa cam={cam} floor="mueble" bloom={0.5}>
        <mesh geometry={g}><meshPhysicalMaterial color="#e6f2f7" roughness={0.04} transmission={0.9} thickness={0.02} clearcoat={1} transparent opacity={0.35} side={2} depthWrite={false} /></mesh>
        <group position={[0, 0.03 + lift * 0.22, 0.05]} rotation={[0, 0.4, 0.5 - lift * 0.5]} scale={1.9}>
          <Bx p={[0.07, 0, 0]} s={[0.16, 0.008, 0.02]} c="#c9cdd2" m={0.9} ro={0.25} />
          <mesh position={[-0.04, 0, 0]} scale={[0.035, 0.012, 0.025]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#c9cdd2" metalness={0.95} roughness={0.2} /></mesh>
          {/* la capa de baba gris que se juntó alrededor */}
          {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-0.06 + 0.17 * rnd(i), 0.01 * (rnd(i, 2) - 0.5), 0.02 * (rnd(i, 3) - 0.5)]} scale={(0.022 + 0.02 * rnd(i, 4)) * slime}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#7d8079" roughness={0.45} /></mesh>)}
        </group>
      </Mesa>
      {/* el sello de fecha */}
      <div style={{ position: "absolute", left: 1640, top: 560, transform: `translate(-50%,-50%) rotate(-12deg) scale(${1.5 - 0.5 * Math.min(1, spr(t, a + 0.2, 1.2))})`, opacity: e(t, a + 0.2, a + 0.3), border: "8px solid #c0392b", borderRadius: 14, padding: "6px 26px", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#c0392b", letterSpacing: 6 }}>2003</div>
      <Rot t={t} at={m.cuch} out={m.dedo - 0.2} text="UNA CUCHARA DE TÉ" x={W / 2} y={975} size={70} />
      <Rot t={t} at={m.dedo} out={b - 0.3} text="EL GROSOR DE UN DEDO" x={W / 2} y={975} size={64} col="#d8e2c8" />
    </Stage>
  );
};

// ---------- 12:24 EL TAPÓN DEL LAVAMANOS EN DESPIECE: tuerca, varilla, el tapón sube con la trenza; la tira dentada ----------
export const Palanca: React.FC<{ t: number; a: number; b: number; m: { tuerca: number; varilla: number; sale: number; trenza: number; tira: number; rosado: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.32, 0.98, 1.2], l: [0.12, 0.74, 0], fov: 36 }, 0.7);
  const nut = e(t, m.tuerca, m.tuerca + 1.2), rod = e(t, m.varilla, m.varilla + 1.0), up = Math.min(1.04, spr(t, m.sale, 0.7));
  const tira = t > m.tira ? Math.sin(Math.min(1, (t - m.tira) / 3.4) * Math.PI) : 0;
  return (
    <Stage t={t} a={a} b={b} tint="#e4ecf2">
      <Mesa cam={cam} floor="mueble">
        {/* el caño de vidrio del desagüe (vertical) */}
        <group position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}><CanoVidrio p={[0, 0, 0]} len={0.8} r={0.06} /></group>
        {/* tapón + su vástago: sube cuando sale la varilla */}
        <group position={[0, 0.8 + up * 0.45 * (t > m.sale ? 1 : 0), 0]}>
          <mesh castShadow><cylinderGeometry args={[0.07, 0.065, 0.025, 36]} /><meshStandardMaterial color="#d6dadf" metalness={0.95} roughness={0.15} /></mesh>
          <mesh position={[0, -0.16, 0]}><cylinderGeometry args={[0.008, 0.008, 0.3, 12]} /><meshStandardMaterial color="#b9bec4" metalness={0.9} roughness={0.25} /></mesh>
          <Trenza p={[0.005, -0.06, 0]} len={0.32 * e(t, m.sale, m.trenza + 0.5)} t={t} r={0.02} />
        </group>
        {/* la varilla horizontal y la tuerca */}
        <Bx p={[0.25 + rod * 0.6, 0.55, 0]} s={[0.5, 0.012, 0.012]} c="#b9bec4" m={0.9} ro={0.25} />
        <mesh position={[0.08 + nut * 0.25, 0.55, 0]} rotation={[nut * 9, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.03, 6]} /><meshStandardMaterial color="#c9a24a" metalness={0.85} roughness={0.3} /></mesh>
        {/* la tira dentada: baja por el caño y vuelve a subir */}
        {tira > 0.01 && <group position={[0.015, 0.95 - tira * 0.55, 0]}>
          <Bx p={[0, 0, 0]} s={[0.012, 0.5, 0.004]} c="#2a2a2a" ro={0.5} />
          {Array.from({ length: 12 }, (_, i) => <Bx key={i} p={[0.012, -0.22 + i * 0.04, 0]} s={[0.014, 0.01, 0.004]} c="#2a2a2a" ro={0.5} rot={[0, 0, -0.6]} />)}
        </group>}
        {/* anillo rosado */}
        {t > m.rosado - 0.3 && <mesh position={[0, 0.81, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.085, 0.012, 12, 48]} /><meshStandardMaterial color="#f08aa8" emissive="#ff5a8a" emissiveIntensity={0.6 * e(t, m.rosado, m.rosado + 0.5)} roughness={0.5} /></mesh>}
      </Mesa>
      <Rot t={t} at={m.tuerca} out={m.sale - 0.2} text="AFLOJAS LA TUERCA" x={W / 2} y={150} size={72} />
      <Rot t={t} at={m.trenza} out={m.tira - 0.2} text="LA TRENZA DE PELO" x={W / 2} y={150} size={72} col="#ddd6c8" />
      <Rot t={t} at={m.tira} out={m.rosado - 0.2} text="TIRA DENTADA" x={W / 2} y={150} size={78} />
      <Rot t={t} at={m.rosado} out={b - 0.3} text="ANILLO ROSADO" x={W / 2} y={150} size={78} col="#ffb3c8" />
    </Stage>
  );
};

// ---------- 13:17 EL CANAL OCULTO DEL REBOSADERO: corte del lavamanos, el tubo negro escondido, la linterna y la media taza ----------
export const Rebosadero: React.FC<{ t: number; a: number; b: number; m: { agujero: number; tubo: number; linterna: number; pico: number; p22: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7), dark = e(t, m.tubo, m.tubo + 0.8), beam = e(t, m.linterna, m.linterna + 0.5), wash = e(t, m.pico + 0.4, m.pico + 3.5);
  const channel = `rgb(${Math.round(20 + 170 * wash)},${Math.round(18 + 170 * wash)},${Math.round(16 + 160 * wash)})`;
  return (
    <Stage t={t} a={a} b={b} tint="#e6eef4">
      <div style={{ position: "absolute", left: W / 2 - 160 * e(t, m.p22, m.p22 + 0.8), top: 560, transform: `translate(-50%,-50%) perspective(1800px) rotateY(${-10 + 5 * Math.sin(t * 0.3)}deg) translateY(${(1 - Math.min(1, k)) * 500}px)` }}>
        <svg width={1000} height={620} viewBox="0 0 1000 620">
          <defs><linearGradient id="por" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f4f2ec" /><stop offset="1" stopColor="#cfccc4" /></linearGradient></defs>
          {/* corte de la loza */}
          <path d="M80 80 H920 V140 Q900 420 560 450 H440 Q100 420 80 140 Z" fill="url(#por)" stroke="#9c988f" strokeWidth={4} />
          <path d="M150 140 H850 Q830 380 540 400 H460 Q170 380 150 140 Z" fill="#dfe8ee" />
          {/* el canal escondido: del agujerito de arriba hasta el desagüe */}
          <path d="M830 150 Q860 300 700 420 Q600 480 540 470" fill="none" stroke={channel} strokeWidth={34} strokeLinecap="round" opacity={0.35 + 0.65 * dark} />
          <circle cx={830} cy={150} r={20} fill="#1a1612" stroke="#7a766e" strokeWidth={4} />
          <rect x={470} y={400} width={60} height={220} fill="#9aa0a6" />
          {/* lo que entra al agujerito: gotas de agua y pasta */}
          {Array.from({ length: 8 }, (_, i) => { const ph = ((t - m.agujero) * 0.7 + i / 8) % 1; if (t < m.agujero) return null; return <circle key={i} cx={760 + 70 * ph} cy={110 + 40 * ph} r={7} fill={i % 2 ? "#9fd0ee" : "#f2f2f2"} opacity={1 - ph} />; })}
          {/* la linterna alumbra adentro */}
          {beam > 0.01 && <path d="M990 40 L840 135 L835 170 Z" fill="#fff3c8" opacity={0.55 * beam} />}
          {/* el agua oxigenada que baja limpiando */}
          {wash > 0.01 && wash < 0.98 && Array.from({ length: 10 }, (_, i) => { const u = (wash * 1.6 - i * 0.06); if (u < 0 || u > 1) return null; const x = 830 + (540 - 830) * u, y = 150 + 320 * Math.sin(u * Math.PI / 2); return <circle key={"w" + i} cx={x} cy={y} r={10} fill="#e9f6ff" opacity={0.85} />; })}
        </svg>
      </div>
      <Rot t={t} at={m.agujero} out={m.linterna - 0.2} text="EL AGUJERITO DE ARRIBA" x={W / 2} y={140} size={70} />
      <Rot t={t} at={m.linterna} out={m.pico - 0.2} text="NEGRO = TU OLOR" x={W / 2} y={140} size={76} col="#ffd9a8" />
      <Rot t={t} at={m.pico} out={m.p22 - 0.2} text="MEDIA TAZA ADENTRO" x={W / 2} y={140} size={72} />
      <Pagina t={t} at={m.p22} out={b - 0.3} page="p22" x={1460} y={560} w={380} rot={4} />
    </Stage>
  );
};

// ---------- 14:14 LA LIBRETA DEL VIEJO: páginas que pasan; la palabra que más se repite es DUCHA ----------
const ENTR = ["fregadero · grasa", "ducha · pelo", "inodoro · toallita", "ducha · jabón", "lavamanos · pasta", "ducha · trenza", "fregadero · café", "ducha · rejilla"];
export const Libreta: React.FC<{ t: number; a: number; b: number; m: { hered: number; palabra: number; ducha: number; vamos: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7), flip = Math.max(0, Math.min(5, (t - a - 1.2) / 0.9));
  const bars = e(t, m.palabra, m.ducha + 0.3), big = Math.min(1.08, spr(t, m.ducha, 0.9)), dive = e(t, m.vamos, m.vamos + 1.6);
  const cnt: [string, number][] = [["FREGADERO", 0.62], ["INODORO", 0.55], ["DUCHA", 1]];
  return (
    <Stage t={t} a={a} b={b} tint="#ffd9a8">
      <AbsoluteFill style={{ transform: `scale(${1 + 2.2 * dive * dive})`, opacity: 1 - e(t, m.vamos + 1.0, m.vamos + 1.6) }}>
        <div style={{ position: "absolute", left: 660, top: 560, width: 760, height: 520, transform: `translate(-50%,-50%) scale(1.42) perspective(2000px) rotateX(${24 - 4 * Math.sin(t * 0.3)}deg) rotateZ(-4deg) translateY(${(1 - Math.min(1, k)) * 600}px)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: -14, borderRadius: 12, background: "linear-gradient(135deg,#5a3a22,#3a2414)", boxShadow: "0 50px 90px rgba(0,0,0,.65)" }} />
          {[0, 1].map((side) => <div key={side} style={{ position: "absolute", left: side * 380, top: 0, width: 380, height: 520, background: "repeating-linear-gradient(180deg,#efe6cf 0 38px,#c9d6e2 38px 40px)", boxShadow: side ? "inset 16px 0 26px rgba(0,0,0,.15)" : "inset -16px 0 26px rgba(0,0,0,.15)", padding: "30px 26px", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 26, lineHeight: "40px", color: "#2b3a55" }}>
            {ENTR.slice(side * 4, side * 4 + 4).map((s, i) => <div key={i} style={{ opacity: e(t, a + 0.6 + (side * 4 + i) * 0.25, a + 0.8 + (side * 4 + i) * 0.25) }}>{`${3 + i * 7 + side}/${(i * 5 + side * 3) % 12 + 1} · ${s}`}</div>)}
          </div>)}
          {/* hojas que pasan */}
          {Array.from({ length: 5 }, (_, i) => { const p = Math.max(0, Math.min(1, flip - i)); if (p <= 0 || p >= 1) return null; return <div key={i} style={{ position: "absolute", left: 380, top: 0, width: 380, height: 520, transformOrigin: "0 50%", transform: `rotateY(${-180 * p}deg)`, background: "repeating-linear-gradient(180deg,#f3ead4 0 38px,#c9d6e2 38px 40px)", boxShadow: "0 10px 30px rgba(0,0,0,.3)", backfaceVisibility: "visible" }} />; })}
        </div>
        {/* el conteo: barras que crecen, ducha gana */}
        {bars > 0.01 && <div style={{ position: "absolute", left: 1180, top: 380, width: 700, transform: "scale(1.2)", transformOrigin: "0 0" }}>
          {cnt.map(([w, v], i) => <div key={w} style={{ display: "flex", alignItems: "center", marginBottom: 34, opacity: e(t, m.palabra + i * 0.3, m.palabra + i * 0.3 + 0.2) }}>
            <div style={{ width: 230, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: w === "DUCHA" ? "#ffd27a" : "#f6efe2", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>{w}</div>
            <div style={{ height: 46, width: 360 * v * bars * (w === "DUCHA" ? 0.62 + 0.38 * Math.min(1, big) : 1), borderRadius: 10, background: w === "DUCHA" ? "linear-gradient(90deg,#ffb84a,#ff7a2c)" : "linear-gradient(90deg,#8d8579,#6b655b)", boxShadow: w === "DUCHA" ? `0 0 ${30 * Math.min(1, big)}px #ff9a3c` : "none" }} />
          </div>)}
        </div>}
      </AbsoluteFill>
      {t > m.ducha && <div style={{ position: "absolute", left: W / 2, top: 820, transform: `translate(-50%,-50%) scale(${big}) rotate(-3deg)`, opacity: 1 - e(t, m.vamos + 0.6, m.vamos + 1.2), fontFamily: FONT, fontWeight: 900, fontSize: 200, color: "#ffd27a", textShadow: extrude(9, "rgba(0,0,0,.6)") }}>DUCHA</div>}
      <Rot t={t} at={m.hered} out={m.palabra - 0.2} text="ME LA HEREDÉ" x={W / 2} y={150} size={72} col="#ffd9a8" />
    </Stage>
  );
};

// ---------- 14:38 LOS 5 ERRORES: carrusel de cartas, cada una entra en su palabra y recibe la cruz ----------
const ERR = ["ESPERAR AL TAPÓN", "QUÍMICO SOBRE QUÍMICO", "ALAMBRE A CIEGAS", "PINZA EN LA TUERCA", "PERFUME AL OLOR"];
export const Errores: React.FC<{ t: number; a: number; b: number; m: { e: number[]; hoy: number } }> = ({ t, a, b, m }) => {
  let cur = 0; m.e.forEach((x, i) => { if (t >= x - 0.2) cur = i; });
  // posición continua del carrusel con resorte hacia la carta vigente
  const prev = cur ? cur - 1 : 0, pos = prev + (cur - prev) * Math.min(1.05, spr(t, m.e[cur] - 0.2, 0.9));
  const ok = e(t, m.hoy, m.hoy + 0.6);
  return (
    <Stage t={t} a={a} b={b} tint="#ffd2b0">
      <div style={{ position: "absolute", left: W / 2, top: 590, perspective: 1800, transformStyle: "preserve-3d", transform: "scale(1.18)" }}>
        {ERR.map((s, i) => {
          const d = i - pos, ad = Math.abs(d), seen = t >= m.e[i] - 0.2;
          if (!seen && d > 0.6) return null;
          const x = d === 0 ? 0 : Math.sign(d) * (360 + 110 * (ad - 1)) * Math.min(1, ad), ry = -Math.sign(d) * 58 * Math.min(1, ad), z = -260 * Math.min(1, ad) - 40 * ad;
          const cross = e(t, m.e[i] + 1.0, m.e[i] + 1.2);
          return (
            <div key={s} style={{ position: "absolute", left: -230, top: -290, width: 460, height: 580, borderRadius: 26, transform: `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) translateY(${(1 - k1(t, m.e[i] - 0.2, 0.9)) * 600}px)`, background: "linear-gradient(160deg,#2e2924,#1a1714)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 3px #4a4239", zIndex: 10 - Math.round(ad), opacity: 1 - 0.35 * Math.min(1, ad) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 210, color: ok > 0.5 ? "#8fd0ff" : "#ffb257", lineHeight: 1 }}>{i + 1}</div>
              <div style={{ position: "absolute", left: 30, right: 30, top: 340, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, lineHeight: 1.05, color: "#f6efe2", opacity: Math.max(0, 1 - ad * 1.3) }}>{s}</div>
              {cross > 0.01 && <div style={{ position: "absolute", right: 24, top: 20, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#e0261a", transform: `scale(${Math.min(1.1, spr(t, m.e[i] + 1.0, 1.2))}) rotate(-10deg)` }}>{ok > 0.5 ? "✕" : "✕"}</div>}
            </div>
          );
        })}
      </div>
      <Rot t={t} at={a + 0.3} out={m.hoy - 0.2} text="LOS 5 ERRORES" x={W / 2} y={130} size={70} />
      <Rot t={t} at={m.hoy} out={b - 0.3} text="DESDE HOY, YA NO" x={W / 2} y={130} size={78} col="#8fd0ff" />
    </Stage>
  );
};

// ---------- 15:27 LA REJILLA DE LA DUCHA: la tapita se levanta y abajo cuelga la trenza; la regla la mide; malla encima ----------
export const Rejilla: React.FC<{ t: number; a: number; b: number; m: { debajo: number; levanta: number; sorpresa: number; tira: number; crece: number; rosado: number; p27: number; mallita: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.1, 0.5, 0.72], l: [0, 0.05, 0], fov: 38 }, 0.6);
  const open = Math.min(1.05, spr(t, m.levanta, 0.7)) * (t > m.levanta ? 1 : 0) * (1 - e(t, m.mallita - 0.6, m.mallita));
  const len = e(t, m.sorpresa, m.sorpresa + 1.2) * (1 - 0.0 * e(t, m.tira, m.tira + 2)), pull = e(t, m.tira, m.tira + 2.2);
  const grow = e(t, m.crece, m.crece + 2.5);
  const holes = useMemo(() => Array.from({ length: 36 }, (_, i) => [(i % 6) - 2.5, Math.floor(i / 6) - 2.5]), []);
  return (
    <Stage t={t} a={a} b={b} tint="#dfe8f0">
      <Mesa cam={cam} floor="mueble" bloom={0.5}>
        {/* el agujero y el caño de vidrio que baja (se ve el corte) */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.07, 32]} /><meshStandardMaterial color="#0d0b09" /></mesh>
        <group position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}><CanoVidrio p={[0, 0, 0]} len={0.6} r={0.07} /></group>
        {/* la trenza: cuelga hacia el caño; al tirar sube y sale */}
        <Trenza p={[0, 0.01 + pull * 0.45, 0]} len={(0.32 + 0.14 * grow) * len} t={t} r={0.022} />
        {/* la rejilla: placa de acero con agujeritos, bisagra en un borde */}
        <group position={[-0.1, 0.006, 0]} rotation={[0, 0, open * 1.75]}>
          <group position={[0.1, 0, 0]}>
            <Bx p={[0, 0.004, 0]} s={[0.2, 0.008, 0.2]} c="#c3c8cd" m={0.9} ro={0.25} />
            {holes.map(([x, z], i) => <mesh key={i} position={[x * 0.028, 0.0085, z * 0.028]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.007, 12]} /><meshStandardMaterial color="#1a1714" /></mesh>)}
          </group>
        </group>
        {/* la regla que la mide */}
        {t > m.crece - 0.3 && <group position={[0.16, 0.02 + pull * 0.45, 0.05]}><Regla p={[0, -0.2, 0]} len={0.6} rot={[Math.PI / 2, Math.PI / 2, 0]} /></group>}
        {/* anillo rosado */}
        {t > m.rosado - 0.3 && <mesh position={[0, 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.078, 0.01, 12, 48]} /><meshStandardMaterial color="#f08aa8" emissive="#ff5a8a" emissiveIntensity={0.6 * e(t, m.rosado, m.rosado + 0.5)} /></mesh>}
        {/* la rejillita de malla fina que se apoya encima */}
        {t > m.mallita - 0.4 && <group position={[0, 0.02 + drop(t, m.mallita, 0.6), 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.12, 40]} /><meshStandardMaterial color="#aeb5bb" metalness={0.8} roughness={0.35} wireframe /></mesh><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.12, 0.006, 8, 40]} /><meshStandardMaterial color="#d8dde1" metalness={0.9} roughness={0.2} /></mesh></group>}
      </Mesa>
      <Rot t={t} at={m.debajo} out={m.sorpresa - 0.2} text="DEBAJO DE LA REJILLA" x={W / 2} y={150} size={72} />
      <Rot t={t} at={m.sorpresa} out={m.crece - 0.2} text="DEL LARGO DE TU MANO" x={W / 2} y={150} size={70} col="#ddd6c8" />
      <Rot t={t} at={m.crece} out={m.rosado - 0.2} text="CENTÍMETROS POR MES" x={W / 2} y={150} size={72} />
      <Pagina t={t} at={m.p27} out={m.mallita - 0.2} page="p27" x={1520} y={540} w={420} />
      <Rot t={t} at={m.mallita} out={b - 0.3} text="MALLA FINA ENCIMA" x={W / 2} y={150} size={76} />
    </Stage>
  );
};
