// dur29a · componentes únicos en 3D, bloque B: los cinco sacos, la semana en la mina, el mercurio, la pierna de cebo,
// el tirón contra la uña y el cuadro de Repin.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { useCurrentFrame } from "remotion";
import { U3, dirtT, sec, useImg } from "./k3";
import { Drums } from "./u3a";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const burlap = (n: string) => tex.text("saco" + n, 256, 256, (g) => {
  g.fillStyle = n ? "rgba(0,0,0,0)" : "#b8935c"; g.clearRect(0, 0, 256, 256); g.fillRect(0, 0, 256, 256);
  if (!n) for (let i = 0; i < 256; i += 4) { g.fillStyle = `rgba(90,60,25,${0.12 + 0.08 * rn(i, 1)})`; g.fillRect(i, 0, 2, 256); g.fillRect(0, i, 256, 2); }
  if (n) { g.font = "900 200px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(110,25,15,.9)"; g.fillText(n, 128, 136); }
});
const plaque = (t: string, hot = false) => tex.text("pl" + t + hot, 256, 110, (g) => {
  g.fillStyle = hot ? "#e9c062" : "#6a4526"; g.fillRect(0, 0, 256, 110);
  for (let i = 0; i < 30; i++) { g.strokeStyle = `rgba(40,20,5,${0.1 + 0.1 * rn(i, 1)})`; g.beginPath(); g.moveTo(0, rn(i, 2) * 110); g.lineTo(256, rn(i, 3) * 110); g.stroke(); }
  g.font = "900 70px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = hot ? "#3a1a05" : "#f1e2c2"; g.fillText(t, 128, 60);
});

// ---- CincoSacos · «Número cinco… cuatro… tres: el techo… dos… y número uno»: el cargador de arcilla de perfil; cada cosa que te
// aplasta es un saco de arpillera con su número estampado que cae sobre la espalda; con cada uno se dobla más ----
export const CincoSacos3D: React.FC<UP> = ({ d, p }) => {
  const T = [0.5, 1.6, sec(p, "s3", 3), sec(p, "s2", 5), sec(p, "s1", 7)];
  return <U3 d={d} bg={p.bg} ground={[118, 96, 72]} mode="drop" key1={[-1.6, 2.6, 1.4]}
    cam={{ at: [-0.12, 0.8, 0], az: [0.3, -0.05], el: [0.12, 0.06], r: [3.7, 3.3], fov: 32 }}>{(tt) => {
    const k = T.map((a) => cl(phys(tt, a, 8, 0.38))), n = k.reduce((s, v) => s + v, 0), bend = 0.1 + 0.07 * n;
    return <>
      <group position={[-0.05, 0, 0]} rotation={[0, 0, 0]}>
        <group rotation={[0, 0, -bend * 0.5]}>
          <Stickman escala={0.26} rotY={90} guion={[{ t: 0, accion: "cargar_caja", expr: n > 3.5 ? "triste" : "nervioso" }]} semilla={7} contacto={0.6} colorContacto="#2a1a10" />
        </group>
        {/* los sacos se apilan sobre la espalda, cada uno cae desde arriba con peso; con cada uno el cargador se dobla más */}
        <group rotation={[0, 0, -bend * 0.5]}>
        {T.map((a, i) => { const kk = k[i], y = 0.5 + i * 0.135 + (1 - kk) * 1.6, x = -0.22 - i * 0.012;
          return kk > 0.002 ? <group key={i} position={[x, y, 0]} rotation={[0, 0, 0.12 * (rn(i, 3) - 0.5)]}>
            <RBox s={[0.34, 0.13, 0.24]} r={0.05}><meshStandardMaterial map={burlap("")} roughness={0.95} /></RBox>
            <mesh position={[0, 0.066, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.008]} /><meshStandardMaterial color="#6a4a26" /></mesh>
            <mesh position={[0.17, 0.01, 0]} rotation={[0, 0, -PI / 2]} castShadow><coneGeometry args={[0.035, 0.06, 12]} /><meshStandardMaterial map={burlap("")} roughness={0.95} /></mesh>
            <mesh position={[0.15, 0.01, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.03, 0.007, 8, 20]} /><meshStandardMaterial color="#5a3a1e" roughness={0.8} /></mesh>
            <mesh position={[0, 0.0, 0.122]}><planeGeometry args={[0.2, 0.2]} /><meshStandardMaterial map={burlap(String(5 - i))} transparent roughness={0.95} /></mesh>
          </group> : null; })}
        </group>
      </group>
      {/* el camino que sube */}
      <mesh position={[0.9, 0.0, -0.3]} rotation={[0, 0, 0.18]}><boxGeometry args={[1.4, 0.05, 1.2]} /><meshStandardMaterial map={dirtT([126, 100, 74])} roughness={1} /></mesh>
    </>;
  }}</U3>;
};

// ---- SemanaMina · «el lunes bajas… recién el sábado»: el socavón en perspectiva; cada día se prende una vela con su tablita (LUN…VIE)
// y se va gastando; recién el sábado la boca del fondo se abre en luz de día ----
export const SemanaMina3D: React.FC<UP> = ({ d, p }) => {
  const fr = useCurrentFrame();
  const D = d / 30, aL = Math.min(sec(p, "lunes", 0.8), 1.2), aS = Math.max(D - 3.4, aL + 3), DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE"], step = (aS - aL - 0.4) / 5;
  return <U3 d={d} bg={p.bg} backZ={20} backDim={0.04 + 0.9 * eio(fr / 30, d / 30 - 3.6, d / 30 - 2.2)} ground={[84, 60, 44]} sky="#070504" mode="iris" warm={0.25} key1={[0, 2, 1]}
    cam={{ at: [0, 0.4, -2.2], at1: [0, 0.4, -3.4], az: [0.12, -0.05], el: [0.06, 0.04], r: [3.2, 2.8], fov: 40 }}>{(tt) => {
    const sun = eio(tt, aS - 0.2, aS + 1.2);
    return <>
      {/* el túnel: paredes y techo de roca a lo largo de -z */}
      {[-0.82, 0.82].map((x, i) => <mesh key={i} position={[x, 0.45, -3]} rotation={[0, i ? -PI / 2 : PI / 2, 0]}><planeGeometry args={[7.5, 1.2]} /><meshStandardMaterial map={dirtT([92, 58, 40])} roughness={1} side={THREE.DoubleSide} /></mesh>)}
      <mesh position={[0, 0.84, -3]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[1.7, 7.5]} /><meshStandardMaterial map={dirtT([70, 46, 32])} roughness={1} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <group key={i} position={[0, 0, 0.2 - i * 1.15]}>
        {[-0.7, 0.7].map((x, j) => <mesh key={j} position={[x, 0.36, 0]} castShadow><boxGeometry args={[0.07, 0.72, 0.07]} /><meshStandardMaterial map={tex.wood(1, 2, [110, 74, 44])} roughness={0.8} /></mesh>)}
        <mesh position={[0, 0.74, 0]} castShadow><boxGeometry args={[1.5, 0.08, 0.08]} /><meshStandardMaterial map={tex.wood(2, 1, [110, 74, 44])} roughness={0.8} /></mesh>
      </group>)}
      {/* las velas de la semana, con su tablita; cada una se prende en su día y se va consumiendo */}
      {DAYS.map((dd, i) => { const a = aL + i * step, on = cl((tt - a) / 0.4), z = -0.2 - i * 1.0, burn = cl((tt - a) / (aS - a + 1)) * 0.55, hgt = 0.3 * (1 - burn), fl = 0.06 * Math.sin(tt * 2 * PI * 1.2 + i);
        return <group key={i} position={[-0.42, 0, z]}>
          <mesh position={[0, hgt / 2, 0]} castShadow><cylinderGeometry args={[0.045, 0.05, Math.max(0.01, hgt), 20]} />{M.porcelain({ col: "#efe1c0" })}</mesh>
          <mesh position={[0, hgt + 0.025, 0]} scale={[on, on * (1 + fl), on]}><sphereGeometry args={[0.03, 12, 10]} />{M.glow({ col: "#ffc46a" })}</mesh>
          <pointLight position={[0, hgt + 0.08, 0.05]} intensity={1.4 * on * (1 + fl)} distance={1.4} color="#ffad55" />
        </group>; })}
      {/* la boca del fondo: el sábado se abre en luz de día */}
      <mesh position={[0, 0.45, -6.7]}><planeGeometry args={[1.8, 1.0]} /><meshBasicMaterial color="#0b0807" transparent opacity={1 - sun} /></mesh>
      <mesh position={[0, 0.42, -6.6]} scale={[1, 0.6, 1]}><circleGeometry args={[0.8, 48]} />{M.glow({ col: "#ffdca0", op: 0.5 * sun })}</mesh>
      <mesh position={[0, 0.006, -5.0]} rotation={[-PI / 2, 0, 0]} scale={[1, 2.4, 1]}><circleGeometry args={[0.5, 40]} />{M.glow({ col: "#ffe7b8", op: 0.35 * sun })}</mesh>
      {/* el haz de luz del sábado y el polvo flotando adentro */}
      
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.1, 0.1 + rn(i, 2) * 0.7 + 0.04 * Math.sin(tt * 0.8 + i), -6.2 + rn(i, 3) * 3.4]}><sphereGeometry args={[0.006, 6, 5]} />{M.glow({ col: "#fff2d2", op: 0.8 * sun })}</mesh>)}
      <spotLight position={[0, 0.8, -6.2]} target-position={[0, 0, -1]} angle={0.6} penumbra={1} intensity={26 * sun} distance={8} color="#fff1d6" />
      <mesh position={[0.4, 0.22, -5.2]} rotation={[-0.12, -0.3, 0]}><planeGeometry args={[0.42, 0.18]} /><meshStandardMaterial map={plaque("SÁB", true)} roughness={0.6} emissive="#ffffff" emissiveMap={plaque("SÁB", true)} emissiveIntensity={0.6 * sun} /></mesh>
    </>;
  }}</U3>;
};

// ---- MercurioGotas · «se usaba mercurio… sus vapores»: gotas de mercurio ruedan por el piso de piedra del patio y se juntan en una
// bola de cromo; de la bola sube un vapor verdoso que llega a la cara del trabajador ----
export const MercurioGotas3D: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "mercurio", 0.6), aV = sec(p, "vapores", 4);
  return <U3 d={d} bg={p.bg} ground={[112, 106, 98]} mode="wipe" key1={[-1.2, 2.2, 1.6]}
    cam={{ at: [0.3, 0.36, 0], az: [-0.25, 0.12], el: [0.26, 0.14], r: [2.1, 1.8], fov: 32 }}>{(tt) => {
    const aV2 = Math.min(aV, d / 30 * 0.42), merge = eio(tt, aM + 0.4, aV2 - 0.4), R = 0.05 + 0.13 * merge, vap = cl((tt - aV2) / 2.0);
    return <>
      {/* las losas del patio */}
      {Array.from({ length: 12 }, (_, i) => <RBox key={i} s={[0.58, 0.04, 0.58]} r={0.01} p={[-1.2 + (i % 4) * 0.6, 0.02, -0.6 + Math.floor(i / 4) * 0.6]}><meshStandardMaterial map={dirtT([104 + 10 * rn(i, 1), 98, 90])} roughness={0.85} /></RBox>)}
      {/* las gotas: ruedan hacia el centro y se funden en la bola */}
      {Array.from({ length: 14 }, (_, i) => { const a = rn(i, 2) * PI * 2, r0 = 0.35 + rn(i, 3) * 0.55, k = eio(tt, aM + 0.2 + rn(i, 4) * 0.6, aM + 1.2 + rn(i, 5) * (aV - aM - 1.6)), r = r0 * (1 - k);
        return k < 0.995 ? <mesh key={i} position={[Math.cos(a) * r, 0.04 + 0.012, Math.sin(a) * r]} scale={[1, 0.7, 1]} castShadow><sphereGeometry args={[0.03 + 0.02 * rn(i, 6), 24, 16]} />{M.chrome()}</mesh> : null; })}
      <mesh position={[0, 0.04 + R * 0.75, 0]} scale={[1, 0.78, 1]} castShadow><sphereGeometry args={[R, 48, 32]} />{M.chrome()}</mesh>
      {/* el vapor verdoso: nubes que suben y se van hacia la cara */}
      {Array.from({ length: 30 }, (_, i) => { const k = ((tt - aV2) * 0.35 + i / 30) % 1, on = cl((tt - aV2 - i * 0.03) / 0.5); const x = lerp(0, 0.66, cl(k * 1.4)), y = 0.15 + k * 0.62; return on > 0 ? <mesh key={i} position={[x + 0.04 * Math.sin(tt + i), y, 0.03 * Math.cos(tt * 1.3 + i)]} scale={0.06 + 0.12 * k}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#8fd06a" emissive="#4f9a2a" emissiveIntensity={0.6} roughness={1} transparent opacity={Math.min(0.6, 0.55 * on * Math.sin(PI * k) * vap * 2)} depthWrite={false} /></mesh> : null; })}
      <pointLight position={[0.25, 0.35, 0.1]} intensity={2.2 * vap} distance={1.4} color="#9be070" />
      {/* el trabajador de arcilla, agachado al lado, respira el vapor */}
      <group position={[0.7, 0, 0.05]}>
        <Stickman escala={0.2} rotY={-90} guion={[{ t: 0, accion: "pensar", expr: "neutral" }, { t: aV2 + 1.6, accion: "asustarse", expr: "asqueado" }]} semilla={11} contacto={0.5} colorContacto="#3a3530" />
      </group>
    </>;
  }}</U3>;
};

// ---- PiernaCebo · «Te metes en el agua… sienten el movimiento… el pellizco… en el frasco»: tu pierna en el estanque; las sanguijuelas
// llegan nadando y se prenden de a una; el frasco de la orilla se va llenando ----
const leechG = (k: string, len: number) => tubeG("leech" + k + len, Array.from({ length: 7 }, (_, i) => [-len / 2 + len * i / 6, len * 0.06 * Math.sin(i * 1.3), 0]), (u) => len * (0.06 + 0.13 * Math.sin(PI * Math.min(1, u * 1.05))), 30, 12);
const LEG = new Map<string, THREE.LatheGeometry>();
const legG = () => { let g = LEG.get("l"); if (!g) { const P = [[0.0, 0.0], [0.045, 0.02], [0.048, 0.08], [0.056, 0.2], [0.075, 0.36], [0.078, 0.44], [0.068, 0.56], [0.07, 0.62], [0.085, 0.75], [0.1, 0.9], [0.105, 1.0], [0.0, 1.0]];
  g = new THREE.LatheGeometry(P.map(([r, y]) => new THREE.Vector2(r, y)), 40); LEG.set("l", g); } return g; };
export const PiernaCebo3D: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "siente", 1.2), aP = sec(p, "pellizco", 3.5), aF = sec(p, "frasco", 6), N = 6;
  return <U3 d={d} bg={p.bg} ground={[70, 62, 44]} mode="drop" key1={[-1.4, 2.4, 1.2]}
    over={(tt) => { let n = 0; for (let i = 0; i < N; i++) if (tt > aS + i * ((aF - aS - 0.4) / N) + 1.0) n++; return <Drums v={n} n={1} x={1460} y={150} s={1.7} />; }}
    cam={{ at: [0.15, 0.5, 0], az: [-0.5, 0.05], el: [0.2, 0.12], r: [2.0, 1.7], fov: 34 }}>{(tt) => {
    const tw = tt > aP && tt < aP + 0.5 ? 0.04 * Math.sin((tt - aP) * 40) * (1 - (tt - aP) / 0.5) : 0, jar = Math.min(N, Math.floor(cl((tt - aF + 0.3) / 1.8) * (N + 1)));
    return <>
      {/* el agua turbia del estanque, con juncos */}
      <mesh position={[0, 0.3, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[4, 3]} /><meshPhysicalMaterial color="#5d6b4a" roughness={0.38} transparent opacity={0.62} depthWrite={false} side={THREE.DoubleSide} emissive="#1a2414" emissiveIntensity={0.3} /></mesh>
      {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-1.2 + rn(i, 1) * 2.6, 0.45, -0.7 - rn(i, 2) * 0.6]} rotation={[0, 0, (rn(i, 3) - 0.5) * 0.3]}><cylinderGeometry args={[0.006, 0.008, 0.9, 6]} />{M.matte({ col: "#4f6b32" })}</mesh>)}
      {/* la pierna: pantorrilla, rodilla y pie, con tono de piel; tiembla con el pellizco */}
      <group position={[tw, 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow geometry={legG()}><meshPhysicalMaterial color="#d6a283" roughness={0.48} clearcoat={0.3} /></mesh>
        <mesh position={[0.07, 0.035, 0]} scale={[1.9, 0.5, 0.95]} castShadow><sphereGeometry args={[0.06, 24, 18]} /><meshPhysicalMaterial color="#d6a283" roughness={0.5} /></mesh>
        <mesh position={[0, 0.98, 0]} castShadow><cylinderGeometry args={[0.105, 0.1, 0.14, 32]} /><meshStandardMaterial color="#5b4a36" roughness={0.9} /></mesh>
        {/* las sanguijuelas: nadan desde los costados y se prenden en espiral */}
        {Array.from({ length: N }, (_, i) => { const a = aS + i * ((aF - aS - 0.4) / N), k = eio(tt, a, a + 1.0), ang = i * 1.1 + 0.4, y = 0.16 + i * 0.065;
          const sx = Math.cos(ang) * (0.085 + (1 - k) * 0.9), sz = Math.sin(ang) * (0.085 + (1 - k) * 0.9), wig = (1 - k) * 0.12 * Math.sin(tt * 7 + i);
          const inJar = i < jar; if (inJar || tt < a - 0.6) return null;
          return <mesh key={i} geometry={leechG(String(i % 3) + "d", 0.3 + 0.04 * (i % 3))} position={[sx, y + (1 - k) * 0.06, sz]} rotation={[0, -ang + PI / 2 + wig, k * PI / 2]} castShadow><meshPhysicalMaterial color="#3b3a1c" roughness={0.22} clearcoat={1} sheen={0.6} sheenColor="#c8b060" /></mesh>; })}
      </group>
      {/* el frasco en la orilla: las sanguijuelas aparecen adentro de a una */}
      <group position={[0.48, 0.3, 0.38]}>
        <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.1, 0.1, 0.26, 32, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.095, 0.095, 0.12, 32]} />{M.water({ col: "#6e7a58", op: 0.6 })}</mesh>
        <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.105, 0.105, 0.03, 32]} />{M.matte({ col: "#7a5a3a" })}</mesh>
        {Array.from({ length: jar }, (_, i) => <mesh key={i} geometry={leechG(String(i % 3), 0.09)} position={[(rn(i, 5) - 0.5) * 0.1, 0.04 + 0.02 * i, (rn(i, 6) - 0.5) * 0.08]} rotation={[0, rn(i, 7) * 6, 0.3]}><meshPhysicalMaterial color="#3b3a1c" roughness={0.22} clearcoat={1} sheen={0.6} sheenColor="#c8b060" /></mesh>)}
        <mesh position={[0, -0.04, 0]} scale={[1.4, 0.5, 1.2]}><dodecahedronGeometry args={[0.16, 1]} /><meshStandardMaterial color="#6a6458" roughness={0.95} /></mesh>
      </group>
      {/* anillos en el agua cuando llegan */}
      {[0, 1, 2].map((i) => { const k = ((tt * 0.6 + i / 3) % 1); return <mesh key={i} position={[0, 0.302, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.09 + 0.4 * k, 0.1 + 0.4 * k, 48]} /><meshBasicMaterial color="#cfd8c0" transparent opacity={0.25 * (1 - k) * cl(tt - aS)} depthWrite={false} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- TironUna · «de un tirón… con la uña»: dos antebrazos sobre el mostrador. Izquierda: la mano tira, la piel se estira y queda una
// gota de sangre. Derecha: la uña entra por el costado, la sanguijuela se suelta sola y cae en el frasco ----
const skin = <meshPhysicalMaterial color="#d9a585" roughness={0.5} clearcoat={0.25} />;
export const TironUna3D: React.FC<UP> = ({ d, p }) => {
  const aT = sec(p, "tiron", 1), aU = sec(p, "una", 4.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="split" key1={[0, 2.4, 1.2]}
    cam={{ at: [-0.3, 0.12, 0.05], at1: [0.42, 0.12, 0.1], az: [-0.15, 0.15], el: [0.62, 0.52], r: [1.35, 1.15], fov: 34 }}>{(tt) => {
    const pull = eio(tt, aT + 0.1, aT + 0.7), snap = tt > aT + 0.7, fly = cl((tt - aT - 0.7) / 0.5), drop = eio(tt, aT + 0.8, aT + 1.6);
    const nail = eio(tt, aU, aU + 0.7), fall = eio(tt, aU + 0.8, aU + 1.6), litL = 1 - 0.6 * eio(tt, aU - 0.4, aU), litR = 0.4 + 0.6 * eio(tt, aU - 0.4, aU);
    return <>
      {[-0.45, 0.45].map((x, i) => <group key={i} position={[x, 0.07, 0]}>
        <mesh position={[0, 0, 0.15]} rotation={[PI / 2, 0, 0]} scale={[1.15, 1, 0.85]} castShadow><capsuleGeometry args={[0.07, 0.62, 10, 24]} />{skin}</mesh>
        {/* la mano (dorso hacia arriba) y los dedos apuntando al fondo */}
        <mesh position={[0, 0.0, -0.3]} scale={[1, 0.45, 1.05]} castShadow><sphereGeometry args={[0.085, 24, 18]} />{skin}</mesh>
        {[-0.05, -0.017, 0.017, 0.05].map((fx, j) => <mesh key={j} position={[fx, -0.005, -0.42 + Math.abs(fx) * 0.5]} rotation={[PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.016, 0.1, 8, 12]} />{skin}</mesh>)}
        <mesh position={[i ? -0.085 : 0.085, -0.005, -0.3]} rotation={[PI / 2, 0, i ? 0.6 : -0.6]} castShadow><capsuleGeometry args={[0.018, 0.07, 8, 12]} />{skin}</mesh>
      </group>)}
      {/* izquierda: la sanguijuela estirada y arrancada, la gota de sangre que queda */}
      <group position={[-0.45, 0.14, 0.05]}>
        {!snap ? <mesh geometry={leechG("t", 0.2)} position={[0, 0.0 + pull * 0.08, 0]} rotation={[0, 0, PI / 2 * 0.0]} scale={[1, 1 + pull * 1.6, 1]} castShadow><meshPhysicalMaterial color="#3b3a1c" roughness={0.22} clearcoat={1} sheen={0.6} sheenColor="#c8b060" /></mesh>
          : <mesh geometry={leechG("t", 0.2)} position={[-0.1 * fly, 0.12 + 0.3 * fly, 0.1 * fly]} rotation={[fly * 3, 0, fly * 2]}><meshPhysicalMaterial color="#3b3a1c" roughness={0.22} clearcoat={1} sheen={0.6} sheenColor="#c8b060" /></mesh>}
        {/* la pinza de los dedos que tira */}
        <group position={[0, 0.06 + pull * 0.16 + (snap ? 0.16 * fly : 0), 0]}>
          {[-1, 1].map((s) => <mesh key={s} position={[s * 0.022, 0.05, 0]} rotation={[0, 0, -s * 0.15]} castShadow><capsuleGeometry args={[0.018, 0.08, 8, 16]} />{skin}</mesh>)}
          <mesh position={[0, 0.13, -0.04]} scale={[1, 0.6, 1.1]} castShadow><sphereGeometry args={[0.065, 20, 16]} />{skin}</mesh>
          <mesh position={[0, 0.28, -0.32]} rotation={[-1.05, 0, 0]} castShadow><capsuleGeometry args={[0.06, 0.5, 10, 20]} />{skin}</mesh>
        </group>
        <mesh position={[0, -0.062, 0.0]} rotation={[-PI / 2, 0, 0]} scale={[1.6, 1, 1]}><ringGeometry args={[0.02 * (snap ? 1 : 0.001), 0.04 * (snap ? 1 : 0.001), 24]} /><meshStandardMaterial color="#b8323a" roughness={0.5} /></mesh>
        <mesh position={[0, 0.0, 0.015]} scale={[1, 1 + 1.5 * drop, 1]}><sphereGeometry args={[0.028 * (snap ? 1 : 0.001), 16, 12]} /><meshPhysicalMaterial color="#9a0f12" roughness={0.15} clearcoat={1} /></mesh>
        <mesh position={[0.0, -0.005 - 0.05 * drop, 0.06]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.6 + drop * 2, 1]}><circleGeometry args={[0.012 * (snap ? 1 : 0.001), 16]} /><meshPhysicalMaterial color="#9a0f12" roughness={0.15} clearcoat={1} /></mesh>
      </group>
      {/* derecha: el dedo con la uña entra por el costado; la sanguijuela se suelta sola y cae al frasco */}
      <group position={[0.45, 0.14, 0.05]}>
        {fall < 0.999 && <mesh geometry={leechG("u", 0.2)} position={[lerp(0, 0.28, fall), lerp(0.0, 0.05, fall) + (fall > 0 ? -0.0 : 0), lerp(0, 0.22, fall)]} rotation={[0, 0, PI / 2 * 0.0 + fall * 1.2]} castShadow><meshPhysicalMaterial color="#3b3a1c" roughness={0.22} clearcoat={1} sheen={0.6} sheenColor="#c8b060" /></mesh>}
        <group position={[lerp(-0.3, -0.06, nail), 0.02, 0]} rotation={[0, 0, -0.15]}>
          <mesh rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.02, 0.18, 8, 16]} />{skin}</mesh>
          <mesh position={[-0.15, 0.02, -0.03]} scale={[1.1, 0.55, 1]} castShadow><sphereGeometry args={[0.07, 20, 16]} />{skin}</mesh>
          <mesh position={[-0.3, 0.14, -0.3]} rotation={[-0.9, 0, 0.5]} castShadow><capsuleGeometry args={[0.06, 0.5, 10, 20]} />{skin}</mesh>
          <mesh position={[0.1, 0.012, 0]} rotation={[0, 0, -0.1]}><boxGeometry args={[0.03, 0.006, 0.03]} /><meshPhysicalMaterial color="#f3d6c8" roughness={0.2} clearcoat={1} /></mesh>
        </group>
      </group>
      <group position={[0.66, 0, 0.32]}>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.09, 0.09, 0.24, 32, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.085, 0.085, 0.1, 32]} />{M.water({ col: "#6e7a58", op: 0.55 })}</mesh>
        {fall > 0.999 && <mesh geometry={leechG("u", 0.2)} position={[0, 0.07, 0]} rotation={[0.2 * Math.sin(tt * 5), 1 + 0.4 * Math.sin(tt * 3), 0.3]}><meshPhysicalMaterial color="#3b3a1c" roughness={0.22} clearcoat={1} sheen={0.6} sheenColor="#c8b060" /></mesh>}
      </group>
      {/* la luz va de un lado al otro (siempre montadas, en rampa) */}
      <spotLight position={[-0.45, 1.3, 0.5]} target-position={[-0.45, 0.1, 0]} angle={0.3} penumbra={0.8} intensity={9 * litL} distance={3} color="#fff0dc" />
      <spotLight position={[0.55, 1.3, 0.5]} target-position={[0.55, 0.1, 0]} angle={0.32} penumbra={0.8} intensity={9 * litR} distance={3} color="#fff0dc" />
    </>;
  }}</U3>;
};

// ---- RepinRevelado · «El cuadro se llama Los sirgadores del Volga… once hombres… en el medio»: un telón de terciopelo se abre,
// la cámara entra al cuadro y una luz cálida encuentra al único que levanta la cabeza ----
export const RepinRevelado3D: React.FC<UP> = ({ d, p }) => {
  const paint = useImg(p.img, 0), aC = sec(p, "cuadro", 0.6), aO = sec(p, "once", 3), aM = sec(p, "medio", 5.5), W = 1.6, Hh = 0.84;
  const hx = -W / 2 + W * 0.47, hy = 0.9 + Hh / 2 - Hh * 0.38;
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" wall="dark" mode="iris" warm={0.55} key1={[-1.2, 2.2, 1.6]}
    cam={{ at: [0, 0.9, -1.55], at1: [hx * 0.9, hy, -1.55], az: [-0.12, 0.06], el: [0.02, 0.0], r: [2.6, 1.9], fov: 32 }}>{(tt) => {
    const open = eio(tt, 0.05, 1.0), spot = eio(tt, aM - 0.3, aM + 0.7), sweep = cl((tt - aO) / 2), dim = 1 - 0.6 * spot;
    const curtain = (s: number) => { const fr = Math.round(open * 50); return <mesh key={s} position={[s * (W / 4 + 0.05 + open * W * 0.42), 0.9, -1.48]} scale={[1 - 0.55 * open, 1, 1]}>
      <planeGeometry args={[W / 2 + 0.12, Hh + 0.3, 30, 1]} onUpdate={(g: THREE.PlaneGeometry) => { const pos = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setZ(i, 0.045 * Math.sin(pos.getX(i) * 34) + 0.02 * Math.sin(pos.getX(i) * 9)); pos.needsUpdate = true; g.computeVertexNormals(); }} />
      <meshPhysicalMaterial color="#6a121c" roughness={0.7} sheen={1} sheenColor="#ff8a8a" sheenRoughness={0.45} side={THREE.DoubleSide} /></mesh>; };
    return <>
      <group position={[0, 0.9, -1.56]}>
        {[[0, Hh / 2 + 0.05, W + 0.2, 0.1], [0, -Hh / 2 - 0.05, W + 0.2, 0.1], [-W / 2 - 0.05, 0, 0.1, Hh + 0.2], [W / 2 + 0.05, 0, 0.1, Hh + 0.2]].map(([x, y, w, h], i) => <RBox key={i} s={[w, h, 0.07]} r={0.02} p={[x, y, 0.03]}>{M.brass({ col: "#b98a3e" })}</RBox>)}
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[W, Hh]} />{paint ? <meshStandardMaterial map={paint} roughness={0.75} emissive="#ffffff" emissiveMap={paint} emissiveIntensity={0.42 * dim + 0.12 * Math.sin(PI * sweep)} /> : M.matte({ col: "#3a2a1a" })}</mesh>
      </group>
      {[-1, 1].map(curtain)}
      <mesh position={[hx, hy, -1.54]}><torusGeometry args={[0.075, 0.005, 8, 48]} />{M.glow({ col: "#ffd27a", op: spot })}</mesh>
      <mesh position={[hx, hy, -1.545]}><circleGeometry args={[0.075, 40]} />{M.glow({ col: "#ffe6b0", op: 0.18 * spot })}</mesh>
      {/* la luz que lo encuentra (siempre montada, en rampa) */}
      <spotLight position={[hx + 0.2, hy + 0.9, -0.6]} target-position={[hx, hy, -1.55]} angle={0.12} penumbra={0.5} intensity={70 * spot} distance={3} color="#ffd59a" />
    </>;
  }}</U3>;
};
