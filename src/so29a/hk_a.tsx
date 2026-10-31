// so29a · los componentes ÚNICOS del video del salmón barato (uno por minuto; ninguno se repite en la tanda so29).
// Maqueta sobre la mesada (hk.tsx) con Blanquito-Sachiko haciendo lo que ella cuenta. Cada uno = UNA idea con un objeto.
import React, { useMemo } from "react";
import * as THREE from "three";
import { F, Hero, C, S, it, lerp, pop, Pop, Ink, cardTex, useKT, Fillet, PickCard, IceTray, Sign, Pan, Steam, Ring, Coin, Bill, Dial, Bowl, Sticks, Fish, Freezer,
  cl, phys, eio, sv, orbita, Sachi, PZ, secuencia, Box, Cyl, POSES, AMB, V } from "./hk";
import { mk } from "./casa3d";

const RED = "#d62828";
const P0 = POSES.parado;

// 0:05 · DOS BANDEJAS: el mismo filete naranja dos veces; caen los cartelitos 9.99 y 24.00 y la balanza de precio se va al costado caro
export const A_trays: F = ({ t, h }) => {
  const c1 = useMemo(() => cardTex(["$9.99", "per lb"]), []), c2 = useMemo(() => cardTex(["$24.00", "SUSHI GRADE"], { band: RED }), []);
  const a = it(h, 0, 2.2), b = it(h, 1, 4.4);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.5, 2.6], [0, 0.25, 0]), C([0.5, 1.2, 2.4], [0.1, 0.3, 0]), 9)}
    set={(tt: number) => ({ spot: [0.6, 0, 0] as V, spotK: cl((tt - b) * 1.5) })}
    scene={(tt) => <>
      <IceTray p={[0, 0, 0]} w={2.2} d={0.9} />
      <Fillet p={[-0.6, 0.11, 0.05]} rotY={0.05} />
      <Fillet p={[0.6, 0.11, 0.05]} rotY={-0.05} glint={(tt - b) * 0.6} />
      <Pop k={pop(tt, a)} p={[-0.6, 0.15, -0.1]}><PickCard p={[0, 0, 0]} map={c1} s={1.3} /></Pop>
      <Pop k={pop(tt, b)} p={[0.6, 0.15, -0.1]}><PickCard p={[0, 0, 0]} map={c2} s={1.3} tilt={0.06 * Math.sin(tt * 2) * Math.exp(-(tt - b))} /></Pop>
      <Ring p={[0.6, 0.11, 0.05]} r={0.5} k={cl((tt - b) * 1.2)} />
      <Sachi p={secuencia([[0, P0], [b + 0.3, POSES.pensar]], tt)} t={tt} x={0} z={0.55} s={S * 0.9} expr={tt > b ? "sorprendido" : "neutral"} />
    </>}
    over={(tt) => <Ink tt={tt} at={b + 0.6} txt="SAME FISH" col={AMB} />} />;
};

// 0:50 · EL MOSTRADOR TIENE SECRETOS: la vitrina con un candado de bronce que se abre y de adentro salen 9 tarjetas numeradas en abanico
export const A_secrets: F = ({ t, h }) => {
  const nums = useMemo(() => Array.from({ length: 9 }, (_, i) => cardTex([String(i + 1)], { bg: "#fbf3df", fg: "#7a1f1a", w: 256, h: 320 })), []);
  const open = it(h, 0, 3.0);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0.2, 1.25, 2.5], [0, 0.55, 0]), C([-0.35, 1.4, 2.3], [0, 0.6, 0]), 9)}
    set={(tt: number) => ({ spot: [0, 0.4, 0] as V, spotK: 0.3 + 0.4 * cl((tt - open) * 1.2) })}
    scene={(tt) => { const ul = eio(tt, open - 0.8, open - 0.2), lid = eio(tt, open - 0.2, open + 0.6);
      return <>
        <Box p={[0, 0.25, 0]} s={[1.3, 0.5, 0.7]} c="#7a1f1a" r={0.45} rad={0.03} />
        <Box p={[0, 0.49, 0]} s={[1.2, 0.02, 0.6]} c="#2a1208" r={0.9} rad={0.005} e="#ffb347" ei={1.2 * lid} />
        <pointLight position={[0, 0.7, 0]} intensity={0.05 + 1.6 * lid} distance={2.2} color="#ffc070" />
        <group position={[0, 0.5, -0.35]} rotation={[-1.9 * lid, 0, 0]}><Box p={[0, 0.02, 0.35]} s={[1.32, 0.05, 0.72]} c="#8a2a22" r={0.45} rad={0.025} /></group>
        <group position={[0, 0.36, 0.37]} scale={1.6}>
          <Box p={[0, 0, 0]} s={[0.2, 0.17, 0.07]} c="#c9a24a" m={0.85} r={0.25} rad={0.03} />
          <mesh position={[0.05 * ul, 0.11 + 0.05 * ul, 0]} rotation={[0, 0, 0.6 * ul]}><torusGeometry args={[0.065, 0.016, 12, 24, Math.PI]} /><meshStandardMaterial color="#9aa0a6" metalness={0.9} roughness={0.2} /></mesh>
        </group>
        {nums.map((m, i) => { const k = eio(tt, open + 0.3 + 0.12 * i, open + 1.1 + 0.12 * i); if (k < 0.02) return null; const a = (i - 4) * 0.2;
          return <group key={i} position={[Math.sin(a) * 1.0 * k, 0.45 + (0.35 + Math.cos(a) * 0.28) * k, -0.05]} rotation={[0, 0, -a * k]} scale={0.5 + 0.5 * k}>
            <Box p={[0, 0, -0.01]} s={[0.24, 0.3, 0.015]} c="#fbf3df" r={0.6} rad={0.01} /><mesh position={[0, 0, 0.0]}><planeGeometry args={[0.23, 0.29]} /><meshStandardMaterial map={m} roughness={0.6} /></mesh></group>; })}
        <Sachi p={secuencia([[0, P0], [open - 0.4, POSES.pensar]], tt)} t={tt} x={-0.95} z={0.35} rotY={25} s={S} expr="guino" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={open + 1.8} txt="9 SECRETS" col={AMB} />} />;
};

// 2:26 · EL MARCADOR: un marcador negro gigante escribe SUSHI GRADE en la tarjeta, trazo por trazo; el vendedor (Blanquito con gorro) guiña
export const A_marker: F = ({ t, h }) => {
  const a = it(h, 0, 1.0);
  const cards = useMemo(() => Array.from({ length: 25 }, (_, i) => { const w = i / 24; return mk(512, 320, (g) => { g.fillStyle = "#fbf8f1"; g.fillRect(0, 0, 512, 320); g.save(); g.beginPath(); g.rect(0, 0, 40 + 440 * w, 320); g.clip(); g.fillStyle = "#111"; g.font = "900 92px 'Permanent Marker', Arial"; g.textAlign = "center"; g.fillText("SUSHI", 256, 140); g.fillText("GRADE", 256, 250); g.restore(); }); }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 0.95, 1.85], [0, 0.5, 0]), C([0.3, 0.85, 1.7], [0, 0.5, 0]), 9)}
    set={{ spot: [0, 0.4, 0] as V, spotK: 0.7 }}
    scene={(tt) => { const w = eio(tt, a, a + 2.4);
      const card = cards[Math.round(w * 24)];
      return <>
        <IceTray p={[0, 0, 0]} w={1.6} d={0.8} />
        <Fillet p={[0, 0.11, 0.1]} s={1.2} />
        <group position={[0, 0.55, -0.05]}><Box p={[0, 0, -0.01]} s={[1.1, 0.7, 0.02]} c="#ffffff" r={0.7} rad={0.01} /><mesh position={[0, 0, 0.002]}><planeGeometry args={[1.08, 0.68]} /><meshStandardMaterial map={card} roughness={0.7} /></mesh></group>
        <group position={[-0.38 + 0.95 * w, 0.62 + 0.06 * Math.sin(tt * 14) * (w > 0 && w < 1 ? 1 : 0), 0.12]} rotation={[0.3, 0, -0.7]}>
          <Cyl p={[0, 0, 0]} r={0.05} h={0.5} c="#111111" rough={0.35} /><Cyl p={[0, -0.27, 0]} r={0.05} r2={0.02} h={0.06} c="#222" /><Cyl p={[0, 0.27, 0]} r={0.053} h={0.08} c="#d62828" />
        </group>
        <Sachi p={secuencia([[0, P0], [a + 2.6, POSES.pensar]], tt)} t={tt} x={0.95} z={0.35} rotY={-25} s={S} expr={tt > a + 2.6 ? "guino" : "neutral"} color="#f4f1ea" />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 2.8} txt="JUST A WORD" col={AMB} />} />;
};

// 2:50 · NO HAY LEY: el libro de reglas se abre y la página de «sushi grade» está en blanco; un sello rojo cae: NO RULE
export const A_nolaw: F = ({ t, h }) => {
  const a = it(h, 0, 2.6);
  const page = useMemo(() => mk(512, 640, (g) => { g.fillStyle = "#ece2cb"; g.fillRect(0, 0, 512, 640); g.fillStyle = "#2a1d12"; g.font = "900 64px Georgia"; g.textAlign = "center"; g.fillText("SUSHI", 256, 110); g.fillText("GRADE", 256, 180); g.fillStyle = "rgba(60,50,40,.35)"; g.font = "italic 30px Georgia"; g.fillText("(official rule)", 256, 230); g.strokeStyle = "rgba(60,50,40,.18)"; for (let y = 290; y < 600; y += 38) { g.beginPath(); g.moveTo(50, y); g.lineTo(462, y); g.stroke(); } }), []);
  const left = useMemo(() => mk(512, 640, (g) => { g.fillStyle = "#ece2cb"; g.fillRect(0, 0, 512, 640); g.fillStyle = "rgba(40,30,20,.55)"; for (let y = 60; y < 600; y += 30) for (let x = 50; x < 462; x += 9) if (Math.random() > 0.3) g.fillRect(x, y, 7, 4); }), []);
  const stamp = useMemo(() => mk(256, 256, (g) => { g.strokeStyle = RED; g.lineWidth = 14; g.beginPath(); g.arc(128, 128, 110, 0, 7); g.stroke(); g.fillStyle = RED; g.font = "900 60px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NO", 128, 100); g.fillText("RULE", 128, 165); }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 2.0, 1.45], [0, 0.1, 0.05]), C([0.35, 1.85, 1.3], [0, 0.1, 0.05]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.1, warm: 0.4 }}
    scene={(tt) => { const op = eio(tt, 0.4, 1.6), st = pop(tt, a, 9, 0.35);
      return <>
        <Box p={[0, 0.03, 0]} s={[1.78, 0.06, 1.14]} c="#5a1712" r={0.6} rad={0.02} />
        <Box p={[-0.42, 0.075, 0]} s={[0.82, 0.03, 1.06]} c="#e3d7bd" r={0.95} rad={0.01} />
        <group position={[0, 0.09, 0]} rotation={[0, 0, -Math.PI * (1 - op)]}><group position={[0.42, 0, 0]}><Box p={[0, 0, 0]} s={[0.82, 0.012, 1.06]} c="#e3d7bd" r={0.95} rad={0.004} />
          <mesh position={[0, 0.0075, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.8, 1.0]} /><meshStandardMaterial map={page} roughness={0.95} /></mesh></group></group>
        <mesh position={[-0.42, 0.092, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.8, 1.0]} /><meshStandardMaterial map={left} roughness={0.95} /></mesh>
        {st > 0.02 && <mesh position={[0.42, 0.11 + 0.6 * (1 - Math.min(1, st)), 0.22]} rotation={[-Math.PI / 2, 0, -0.25]} scale={1 + 0.3 * (1 - Math.min(1, st))}><planeGeometry args={[0.45, 0.45]} /><meshBasicMaterial map={stamp} transparent toneMapped={false} depthWrite={false} /></mesh>}
        <Sachi p={P0} t={tt} x={-1.15} z={0.25} rotY={35} s={S} expr={tt > a ? "sorprendido" : "pensativo"} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 0.6} txt="NO INSPECTOR" col={AMB} />} />;
};

// 4:05 · EL FRÍO MATA: un termómetro de dial gigante baja a -4 °F mientras la escarcha trepa por el filete; un taco de 7 hojas se arranca
export const A_cold: F = ({ t, h }) => {
  const face = useMemo(() => mk(256, 256, (g) => { g.fillStyle = "#f6f1e7"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#222"; g.font = "bold 22px Arial"; g.textAlign = "center"; ["40", "20", "0", "-20", "-40"].forEach((v, i) => { const a = -2.2 + i * 1.1; g.fillText(v, 128 + Math.sin(a) * 88, 136 - Math.cos(a) * 88); }); g.fillStyle = "#2a6fdb"; g.font = "bold 26px Arial"; g.fillText("°F", 128, 190); }), []);
  const a = it(h, 0, 3.0);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0.1, 1.2, 2.5], [0, 0.4, 0.1]), C([-0.25, 1.05, 2.35], [0, 0.4, 0.1]), 9)}
    set={(tt: number) => ({ spot: [0.4, 0.2, 0.3] as V, spotK: 0.3 + 0.3 * cl(tt - 1), warm: 0 })}
    scene={(tt) => { const k = eio(tt, 0.8, Math.min(a, 6)), ang = lerp(-1.1, 0.22, k), fr = eio(tt, 1.5, Math.min(a, 6) + 1);
      return <>
        <Dial p={[-0.55, 0.5, -0.3]} ang={ang} face={face} s={0.95} />
        <Fillet p={[0.3, 0.0, 0.3]} s={1.25} rotY={-0.25} />
        <mesh position={[0.3, 0.105, 0.3]} rotation={[-Math.PI / 2, 0, 0.25]}><planeGeometry args={[0.86, 0.36]} /><meshStandardMaterial color="#cfe9ff" transparent opacity={0.45 * fr} roughness={0.2} depthWrite={false} /></mesh>
        {fr > 0.05 && Array.from({ length: 26 }, (_, i) => { const u = (i * 0.37) % 1, show = cl(fr * 1.4 - u); return show < 0.02 ? null : <mesh key={i} position={[-0.05 + 0.7 * ((i * 0.61) % 1), 0.12, 0.18 + 0.26 * ((i * 0.83) % 1)]} rotation={[0, i, 0]} scale={show}><octahedronGeometry args={[0.04, 0]} /><meshStandardMaterial color="#bfe3ff" roughness={0.1} transparent opacity={0.9} /></mesh>; })}
        <Sachi p={secuencia([[0, P0], [a, POSES.temblando]], tt)} t={tt} x={1.15} z={0.55} rotY={-30} s={S} expr={tt > a ? "asustado" : "neutral"} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a} txt="-4°F · 7 DAYS" col="#9fd4ff" />} />;
};

// 5:00 · TU FREEZER NO ALCANZA: dos freezers cortados lado a lado; en el de casa el hielo no llega a la línea, en el profesional sí
export const A_twofreezers: F = ({ t, h }) => {
  const l1 = useMemo(() => cardTex(["0°F", "HOME"], { bg: "#fbf8f1" }), []), l2 = useMemo(() => cardTex(["-31°F", "PRO"], { bg: "#e6f2ff", fg: "#173a6b" }), []);
  const a = it(h, 0, 2.5);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 1.5, 3.5], [0, 0.7, 0]), C([0.3, 1.3, 3.3], [0, 0.7, 0]), 9)}
    set={(tt: number) => ({ spot: [0.7, 0.5, 0] as V, spotK: cl(tt - a) })}
    scene={(tt) => { const g1 = eio(tt, 0.5, 2.5) * 0.45, g2 = eio(tt, a, a + 2.2);
      return <>
        <Freezer p={[-0.7, 0, 0]} frost={g1} />
        <Freezer p={[0.7, 0, 0]} frost={g2} c="#dfe4ea" />
        <Sign p={[-0.7, 1.05, 0.2]} map={l1} w={0.7} h={0.42} /><Fillet p={[-0.7, 0.05, 0]} s={0.7} /><Fillet p={[0.7, 0.05, 0]} s={0.7} />
        <Sign p={[0.7, 1.05, 0.2]} map={l2} w={0.7} h={0.42} glow={g2} />
        <Box p={[-0.7, 0.04 + 0.45 * g1, 0.2]} s={[0.12, 0.9 * g1 + 0.01, 0.04]} c="#7fb4e8" r={0.3} rad={0.01} />
        <Box p={[0.7, 0.04 + 0.45 * g2, 0.2]} s={[0.12, 0.9 * g2 + 0.01, 0.04]} c="#2a6fdb" r={0.3} rad={0.01} e="#2a6fdb" ei={0.3} />
        <Sachi p={P0} t={tt} x={0} z={0.6} s={S} expr={tt > a + 1 ? "decidido" : "pensativo"} />
      </>; }} />;
};

// 5:30 · EL VIAJE DEL SALMÓN AL SUSHI: un mapa sobre la mesada; un avioncito sale de Noruega (1980s) y deja un rastro hasta Japón, donde aparece un nigiri
export const A_norway: F = ({ t, h }) => {
  const KT = useKT();
  const map = useMemo(() => mk(1024, 512, (g) => { g.fillStyle = "#5a8fae"; g.fillRect(0, 0, 1024, 512);
    g.fillStyle = "#d7b980"; g.strokeStyle = "#8a6a3a"; g.lineWidth = 3;
    const poly = (pts: number[][]) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); g.stroke(); };
    poly([[60, 470], [40, 380], [70, 300], [120, 220], [170, 150], [230, 90], [300, 50], [360, 40], [330, 80], [270, 140], [230, 210], [200, 290], [180, 370], [150, 440], [110, 480]]);
    poly([[380, 40], [520, 60], [700, 70], [820, 120], [760, 180], [640, 230], [520, 250], [420, 230], [360, 170], [330, 100]]);
    poly([[900, 120], [930, 160], [915, 230], [880, 300], [840, 360], [800, 400], [770, 390], [810, 340], [850, 280], [880, 200]]);
    poly([[910, 70], [960, 80], [950, 115], [905, 105]]); poly([[760, 410], [790, 420], [770, 450], [745, 440]]);
    g.fillStyle = "#1b1b1b"; g.font = "900 44px Arial"; g.fillText("NORWAY", 150, 300); g.fillText("JAPAN", 720, 470); }), []);
  const a = it(h, 0, 1.5), b = it(h, 1, 5.5);
  const P = (u: number): V => [lerp(-0.95, 0.85, u), 0.09 + 0.12 * Math.sin(Math.PI * u), lerp(0.05, 0.1, u) - 0.4 * Math.sin(Math.PI * u)];
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 2.3, 1.7], [0, 0, 0]), C([0.3, 2.1, 1.6], [0.1, 0, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.15 }}
    scene={(tt) => { const k = eio(tt, a, b), q = P(k), q2 = P(Math.min(1, k + 0.02));
      return <>
        <Box p={[0, 0.02, 0]} s={[2.7, 0.04, 1.4]} c="#6b4a2c" r={0.7} rad={0.01} />
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.6, 1.3]} /><meshStandardMaterial map={map} roughness={0.9} /></mesh>
        {Array.from({ length: 30 }, (_, i) => { const u = i / 29; if (u > k) return null; const pp = P(u); return <mesh key={i} position={[pp[0], 0.055, pp[2]]}><boxGeometry args={[0.035, 0.008, 0.012]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>; })}
        <group position={q} rotation={[0, -Math.atan2(q2[2] - q[2], q2[0] - q[0]), 0]} scale={1.3}>
          <Cyl p={[0, 0, 0]} r={0.035} h={0.3} c="#f4f4f4" rot={[0, 0, Math.PI / 2]} rough={0.3} />
          <Box p={[0.02, 0, 0]} s={[0.07, 0.01, 0.34]} c="#d62828" r={0.4} rad={0.004} />
          <Box p={[-0.13, 0.035, 0]} s={[0.04, 0.07, 0.01]} c="#d62828" r={0.4} rad={0.004} />
          <Box p={[-0.13, 0.0, 0]} s={[0.035, 0.008, 0.12]} c="#d62828" r={0.4} rad={0.004} />
        </group>
        <Pop k={pop(tt, b)} p={[0.85, 0.05, 0.1]} s={1.4}><Box p={[0, 0.03, 0]} s={[0.22, 0.06, 0.1]} c="#f7f5ee" r={0.6} rad={0.03} /><Box p={[0, 0.075, 0]} s={[0.24, 0.03, 0.11]} c="#ffffff" map={KT.salmon} r={0.3} rad={0.012} /></Pop>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="1980s" col={AMB} y={160} /><Ink tt={tt} at={b + 0.3} txt="SALMON SUSHI IS NEW" col={AMB} /></>} />;
};

// 6:05 · LA JAULA DEL CRIADERO: un corral redondo flotando; caen pellets, los salmones suben a comer; el gusanito (parásito) se tacha
export const A_farm: F = ({ t, h }) => {
  const a = it(h, 0, 3.5);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0, 1.8, 2.4], [0, 0, 0]), C([0.6, 1.5, 2.2], [0, 0.05, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.4, warm: 0 }}
    scene={(tt) => <>
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.6, 64]} /><meshStandardMaterial color="#2f5e78" roughness={0.15} metalness={0.2} /></mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.9, 0.05, 12, 64]} /><meshStandardMaterial color="#3a3a3a" roughness={0.5} /></mesh>
      {Array.from({ length: 7 }, (_, i) => { const an = i * 0.9 + tt * 0.5, r = 0.5 + 0.15 * Math.sin(i), up = eio(tt, 1.5 + i * 0.1, 2.3 + i * 0.1);
        return <group key={i} position={[Math.cos(an) * r, 0.03 + 0.06 * up, Math.sin(an) * r]} rotation={[0, -an, 0]} scale={0.45}><Fish p={[0, -0.18, 0]} /></group>; })}
      {Array.from({ length: 18 }, (_, i) => { const d = 0.8 + i * 0.08, y = 1.3 - (tt - d) * 1.6; if (tt < d || y < 0.05) return null; return <mesh key={i} position={[Math.sin(i * 2.3) * 0.4, y, Math.cos(i * 1.7) * 0.4]}><sphereGeometry args={[0.035, 8, 6]} /><meshStandardMaterial color="#7a5434" roughness={0.8} /></mesh>; })}
      <group position={[0.8, 0.35, 0.75]}>
        <mesh rotation={[0, 0, 0.3]}><torusGeometry args={[0.1, 0.025, 8, 24, Math.PI * 1.4]} /><meshStandardMaterial color="#e7c9b0" roughness={0.6} /></mesh>
        {tt > a && <group rotation={[0, 0, 0.78]} scale={Math.min(1, pop(tt, a))}><Box p={[0, 0, 0.05]} s={[0.4, 0.05, 0.02]} c={RED} r={0.4} e={RED} ei={0.4} /></group>}
        {tt > a && <group rotation={[0, 0, -0.78]} scale={Math.min(1, pop(tt, a + 0.1))}><Box p={[0, 0, 0.05]} s={[0.4, 0.05, 0.02]} c={RED} r={0.4} e={RED} ei={0.4} /></group>}
      </group>
    </>}
    over={(tt) => <Ink tt={tt} at={a + 0.4} txt="ALMOST NO PARASITES" col={AMB} />} />;
};

// 6:35 · «LE FALTA SAL»: Blanquito-mamá prueba el nigiri, arruga la cara; el salero gigante salta y espolvorea
export const A_needsalt: F = ({ t, h }) => {
  const KT = useKT();
  const a = it(h, 0, 3.0);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 0.95, 2.05], [0.0, 0.38, 0]), C([0.3, 0.88, 1.9], [0.0, 0.38, 0]), 9)}
    set={(tt: number) => ({ spot: [0, 0.2, 0] as V, spotK: 0.3 + 0.3 * cl(tt - a), warm: 0.5 })}
    scene={(tt) => { const tilt = eio(tt, a + 0.4, a + 0.9) * (1 - eio(tt, a + 2.2, a + 2.6)), bite = eio(tt, 1.0, 2.0);
      return <>
        <Box p={[0, 0.03, 0.1]} s={[0.7, 0.06, 0.34]} c="#3a2a1c" r={0.5} rad={0.02} />
        <group position={[0, 0.06, 0.1]} scale={1.7}>
          <Box p={[0, 0.03, 0]} s={[0.22, 0.06, 0.1]} c="#f7f5ee" r={0.6} rad={0.03} />
          <Box p={[0, 0.072, 0]} s={[0.24 - 0.06 * bite, 0.025, 0.11]} c="#ffffff" map={KT.salmon} r={0.3} rad={0.01} />
        </group>
        <Sachi p={secuencia([[0, P0], [1.0, POSES.pensar], [a, POSES.cabizbajo]], tt)} t={tt} x={-0.48} z={0.25} rotY={30} s={S} expr={tt < 1.0 ? "neutral" : tt < a ? "pensativo" : "asqueado"} />
        <group position={[0.42, 0, 0]}>
          <group rotation={[0, 0, 1.9 * tilt]} position={[0, 0.22 + 0.25 * tilt, 0]}>
            <Cyl p={[0, 0, 0]} r={0.1} r2={0.12} h={0.38} c="#f4f6fb" rough={0.15} op={0.55} />
            <Cyl p={[0, -0.05, 0]} r={0.09} r2={0.11} h={0.26} c="#ffffff" rough={0.8} />
            <Cyl p={[0, 0.23, 0]} r={0.105} h={0.08} c="#c9ccd0" m={0.85} rough={0.3} />
          </group>
          {tilt > 0.5 && Array.from({ length: 18 }, (_, i) => { const u = ((tt * 1.3 + i / 18) % 1); return <mesh key={i} position={[-0.42 + 0.06 * Math.sin(i), 0.48 - u * 0.36, 0.1 + 0.05 * Math.cos(i * 2)]}><boxGeometry args={[0.014, 0.014, 0.014]} /><meshStandardMaterial color="#ffffff" /></mesh>; })}
        </group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 0.5} txt="«NEEDS SALT»" col={AMB} />} />;
};

// 7:05 · LA BALANZA DEL PRECIO: platillo con el salmón salvaje rojo vs el de criadero; las monedas apiladas hacen bajar el caro al doble
export const A_double: F = ({ t, h }) => {
  const a = it(h, 0, 2.0);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 1.4, 2.7], [0, 0.7, 0]), C([-0.4, 1.2, 2.5], [0, 0.7, 0]), 9)}
    set={{ spot: [0, 0.7, 0] as V, spotK: 0.6 }}
    scene={(tt) => { const n = Math.floor(cl((tt - a) / 2.5) * 10), tilt = 0.18 * eio(tt, a, a + 2.8);
      return <>
        <Cyl p={[0, 0.5, 0]} r={0.05} h={1.0} c="#b08a3e" m={0.8} rough={0.3} />
        <Box p={[0, 0.03, 0]} s={[0.5, 0.06, 0.4]} c="#6b4a2c" r={0.5} rad={0.02} />
        <group position={[0, 1.0, 0]} rotation={[0, 0, -tilt]}>
          <Box p={[0, 0, 0]} s={[1.8, 0.04, 0.05]} c="#b08a3e" m={0.85} r={0.25} rad={0.01} />
          {[-1, 1].map((k) => <group key={k} position={[k * 0.85, 0, 0]} rotation={[0, 0, tilt]}>
            <Cyl p={[0, -0.32, 0]} r={0.004} h={0.6} c="#555" />
            <Cyl p={[0, -0.62, 0]} r={0.32} r2={0.28} h={0.03} c="#c9a24a" m={0.85} rough={0.25} />
            <Fillet p={[0, -0.6, 0]} s={0.6} kind={k < 0 ? "wild" : "farm"} />
            {k < 0 && Array.from({ length: n }, (_, i) => <Coin key={i} p={[0.12, -0.53 + i * 0.02, 0.15]} />)}
          </group>)}
        </group>
        <Sachi p={P0} t={tt} x={0} z={0.75} s={S} expr={tt > a + 2 ? "sorprendido" : "neutral"} />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.6} txt="WILD = COOK IT" col="#ffb4a8" y={150} /><Ink tt={tt} at={a + 2.6} txt="2× THE PRICE" col={AMB} /></>} />;
};

// 7:30 · EL COLOR VIENE DE LA COMIDA: el krill rosado cae a un filete gris que se va tiñendo de naranja; al costado, el abanico de muestras de color
export const A_krill: F = ({ t, h }) => {
  const a = Math.min(it(h, 0, 4.0), 0.5 * (h.out - h.at));
  const fan = useMemo(() => ["#f6c7a8", "#f3a97f", "#f2894f", "#ee6f35", "#e2541f"].map((c) => mk(64, 256, (g) => { g.fillStyle = "#fff"; g.fillRect(0, 0, 64, 256); g.fillStyle = c; g.fillRect(4, 4, 56, 200); })), []);
  const Krill: React.FC<{ p: V; r: number }> = ({ p, r }) => <group position={p} rotation={[0, r, 0.4]}>
    {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.03 * i - 0.06, 0.012 * Math.sin(i * 0.8), 0]} scale={[1, 1 - 0.12 * i, 1 - 0.12 * i]}><sphereGeometry args={[0.03, 12, 8]} /><meshStandardMaterial color="#ff7b6b" roughness={0.35} /></mesh>)}
    <mesh position={[-0.085, 0.01, 0.012]}><sphereGeometry args={[0.007, 8, 6]} /><meshStandardMaterial color="#111" /></mesh></group>;
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 1.1, 2.0], [0, 0.3, 0]), C([0.3, 1.0, 1.85], [0, 0.3, 0]), 9)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const tint = eio(tt, 0.6, a + 1);
      return <>
        <Bowl p={[-0.55, 0, 0.1]} s={1.5} c="#2c4a8a" fill="#ff8f7f" />
        {Array.from({ length: 9 }, (_, i) => <Krill key={i} p={[-0.55 + 0.18 * Math.sin(i * 2.1), 0.2 + 0.03 * (i % 3), 0.1 + 0.15 * Math.cos(i * 1.7)]} r={i * 0.9} />)}
        {Array.from({ length: 8 }, (_, i) => { const u = ((tt * 0.5 + i / 8) % 1); return <Krill key={"f" + i} p={[lerp(-0.45, 0.05, u) + 0.05 * Math.sin(i), 0.7 - 0.55 * u + 0.12 * Math.sin(Math.PI * u), 0.05 * Math.cos(i)]} r={tt + i} />; })}
        <Fillet p={[0.2, 0, 0.1]} s={1.05} rotY={-0.15} />
        <mesh position={[0.2, 0.087, 0.1]} rotation={[-Math.PI / 2, 0, 0.15]}><planeGeometry args={[0.74, 0.32]} /><meshStandardMaterial color="#b9b4ad" transparent opacity={0.92 * (1 - tint)} roughness={0.6} depthWrite={false} /></mesh>
        {fan.map((m, i) => { const k = pop(tt, a + 0.1 * i); if (k < 0.02) return null; const an = (i - 2) * 0.22 * Math.min(1, k);
          return <group key={i} position={[0.9, 0.05, 0.05]} rotation={[0, -0.3, -an]}><mesh position={[0, 0.32, 0.002 * i]}><planeGeometry args={[0.12, 0.5]} /><meshStandardMaterial map={m} roughness={0.7} side={THREE.DoubleSide} /></mesh></group>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 0.6} txt="THEY CHOOSE THE ORANGE" col={AMB} />} />;
};

// 8:25 · LOS TRES SENTIDOS: brillo (un destello barre el filete), dedo que aprieta y el hoyito vuelve, nariz que huele (ondas)
export const A_senses: F = ({ t, h }) => {
  const a = it(h, 0, 0.6), b = it(h, 1, 3.4), c = it(h, 2, 6.0);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.0, 1.9], [0, 0.15, 0]), C([0.3, 0.9, 1.8], [0, 0.15, 0]), 10)}
    set={(tt: number) => ({ spot: [0, 0, 0] as V, spotK: 0.6 })}
    scene={(tt) => { const press = eio(tt, b + 0.3, b + 0.7) * (1 - eio(tt, b + 0.9, b + 1.5)), dent = eio(tt, b + 0.4, b + 0.7) * (1 - eio(tt, b + 1.0, b + 2.0));
      return <>
        <Fillet p={[0, 0, 0]} s={1.3} glint={(tt - a) / 1.4} dent={dent} />
        <Pop k={pop(tt, a)} p={[-0.55, 0.32, 0.05]}><mesh scale={[1, 0.8, 0.6]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#fbfaf5" roughness={0.3} /></mesh><mesh position={[0, 0, 0.061]}><circleGeometry args={[0.042, 24]} /><meshStandardMaterial color="#3a6fb0" /></mesh><mesh position={[0, 0, 0.062]}><circleGeometry args={[0.02, 16]} /><meshStandardMaterial color="#111" /></mesh></Pop>
        {tt > b - 0.3 && tt < c && <group position={[0.07, 0.12 + 0.5 * (1 - press) + 0.4 * (1 - eio(tt, b - 0.3, b + 0.3)), 0.03]}>
          <Cyl p={[0, 0.12, 0]} r={0.035} h={0.22} c="#f1ede6" rough={0.7} /><mesh><sphereGeometry args={[0.036, 16, 10]} /><meshStandardMaterial color="#f1ede6" roughness={0.7} /></mesh><mesh position={[-0.05, 0.3, 0]} scale={[1.2, 0.8, 0.9]}><sphereGeometry args={[0.1, 20, 14]} /><meshStandardMaterial color="#f1ede6" roughness={0.7} /></mesh>{[-0.1, -0.13, -0.15].map((x, i) => <Cyl key={i} p={[x, 0.22 - 0.02 * i, 0.03 * (i - 1)]} r={0.028} h={0.12} c="#f1ede6" rough={0.7} rot={[0, 0, 0.5]} />)}</group>}
        {tt > c && <Pop k={pop(tt, c)} p={[0.55, 0.42, 0.1]}><mesh rotation={[0, 0, Math.PI / 2 + 0.3]} scale={[1, 1, 0.8]}><coneGeometry args={[0.07, 0.2, 20]} /><meshStandardMaterial color="#f1ede6" roughness={0.6} /></mesh>{[-1, 1].map((k) => <mesh key={k} position={[-0.07, -0.06, 0.035 * k]}><sphereGeometry args={[0.04, 14, 10]} /><meshStandardMaterial color="#f1ede6" roughness={0.6} /></mesh>)}</Pop>}
        {tt > c && [0, 1, 2, 3].map((i) => { const u = ((tt - c) * 0.5 + i / 4) % 1; return <mesh key={i} position={[lerp(0.15, 0.48, u), 0.12 + 0.25 * u + 0.03 * Math.sin(u * 12 + i), 0.1]}><sphereGeometry args={[0.02, 8, 6]} /><meshBasicMaterial color="#9fd4ff" transparent opacity={0.8 * Math.sin(Math.PI * u)} toneMapped={false} /></mesh>; })}
        <Sachi p={secuencia([[0, P0], [b, POSES.pensar], [c, POSES.ref ?? P0]], tt)} t={tt} x={-1.05} z={0.3} rotY={40} s={S} expr={tt > c ? "feliz" : "pensativo"} />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={a + 0.2} txt="SHINE" x={520} y={900} /><Ink tt={tt} at={b + 0.2} txt="PRESS" x={960} y={900} /><Ink tt={tt} at={c + 0.2} txt="SMELL" x={1400} y={900} col="#9fd4ff" /></>} />;
};

// 9:45 · FRESCO VS CONGELADO: el «fresco» viaja en un camioncito y un contador de días gira (3, 4, 5…); el congelado lleva un copo y un reloj de 2 horas
export const A_coldchain: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  const lab = useMemo(() => Array.from({ length: 8 }, (_, i) => cardTex([`DAY ${i + 1}`], { bg: "#fbf8f1", w: 256, h: 128 })), []);
  const fz = useMemo(() => cardTex(["FROZEN", "IN HOURS"], { bg: "#e6f2ff", fg: "#173a6b", w: 512, h: 256 }), []);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0.2, 1.15, 2.2], [0.2, 0.3, 0]), C([0.45, 1.05, 2.05], [0.2, 0.3, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.5 }}
    scene={(tt) => { const x = lerp(-1.4, -0.2, eio(tt, 0.3, a)), d = Math.min(7, Math.floor(cl((tt - 0.3) / (a - 0.3)) * 7));
      return <>
        <Box p={[-0.7, 0.005, 0.0]} s={[1.8, 0.01, 0.4]} c="#5c5c5c" r={0.9} rad={0.002} />
        <group position={[x, 0, 0]}>
          <Box p={[0, 0.22, 0]} s={[0.5, 0.32, 0.3]} c="#f4f4f4" r={0.4} rad={0.03} />
          <Box p={[0.32, 0.16, 0]} s={[0.16, 0.22, 0.28]} c="#d62828" r={0.4} rad={0.03} />
          {[-0.15, 0.15, 0.32].map((xx, i) => [-0.15, 0.15].map((zz) => <Cyl key={i + "_" + zz} p={[xx, 0.06, zz]} r={0.055} h={0.04} c="#222" rot={[Math.PI / 2, 0, 0]} />))}
          <mesh position={[0, 0.25, 0.152]}><planeGeometry args={[0.36, 0.18]} /><meshStandardMaterial map={lab[d]} /></mesh>
        </group>
        <group position={[0.85, 0, 0]}>
          <Box p={[0, 0.12, 0]} s={[0.55, 0.22, 0.3]} c="#e6f2ff" r={0.3} rad={0.02} />
          <Pop k={pop(tt, 1.2)} p={[0, 0.45, 0]}>{[0, 1, 2].map((i) => <Box key={i} p={[0, 0, 0]} s={[0.36, 0.035, 0.035]} rot={[0, 0, i * Math.PI / 3 + tt * 0.3]} c="#cfe9ff" r={0.1} e="#9fd4ff" ei={0.4} />)}</Pop>
          <mesh position={[0, 0.13, 0.152]}><planeGeometry args={[0.5, 0.2]} /><meshStandardMaterial map={fz} /></mesh>
        </group>
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 0.4} txt="FROZEN = OFTEN FRESHER" col={AMB} />} />;
};

// 10:10 · DOS PIEZAS ARRIBA DE UN LAVADERO: el edificito de 1970 con los lavarropas girando abajo y su ventana encendida arriba
export const A_laundro: F = ({ t, h }) => {
  const sign = useMemo(() => cardTex(["LAUNDROMAT"], { bg: "#2a6f8f", fg: "#ffffff", w: 512, h: 96 }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.4, 1.3, 2.9], [0, 0.75, 0]), C([-0.4, 1.1, 2.6], [0, 0.75, 0]), 10)}
    set={{ spot: [0, 1.1, 0] as V, spotK: 0.7, warm: 0.6 }}
    scene={(tt) => <>
      <Box p={[0, 0.7, -0.2]} s={[1.5, 1.4, 0.6]} c="#b5654a" r={0.85} rad={0.02} />
      <group position={[0, 0.78, 0.2]} rotation={[0.5, 0, 0]}><Box p={[0, 0, 0]} s={[1.5, 0.02, 0.3]} c="#2a6f8f" r={0.8} rad={0.004} /></group>
      <mesh position={[0, 0.62, 0.105]}><planeGeometry args={[1.0, 0.18]} /><meshStandardMaterial map={sign} emissive="#ffffff" emissiveMap={sign} emissiveIntensity={0.3} /></mesh>
      <Box p={[0, 0.27, 0.1]} s={[1.3, 0.42, 0.02]} c="#cfe2ee" r={0.1} op={0.5} rad={0.005} />
      {[-0.45, -0.15, 0.15, 0.45].map((x, i) => <group key={i} position={[x, 0.26, 0.0]}>
        <Box p={[0, 0, 0]} s={[0.26, 0.36, 0.2]} c="#f2f2f2" r={0.4} rad={0.02} />
        <group position={[0, 0.0, 0.105]} rotation={[0, 0, tt * 3 + i]}><mesh><circleGeometry args={[0.09, 24]} /><meshStandardMaterial color="#5d7ea8" roughness={0.2} /></mesh><Box p={[0.04, 0, 0.002]} s={[0.05, 0.02, 0.004]} c="#e7d2b0" /></group>
      </group>)}
      {[-0.4, 0.4].map((x, i) => <group key={i}><Box p={[x, 1.08, 0.105]} s={[0.36, 0.34, 0.02]} c={i === 0 ? "#f2c46a" : "#e6d2a0"} e="#ffcf7a" ei={i === 0 ? 0.35 : 0.15} r={0.5} rad={0.005} /><Box p={[x, 1.08, 0.12]} s={[0.02, 0.34, 0.02]} c="#5a3d22" r={0.6} rad={0.003} /><Box p={[x, 0.9, 0.14]} s={[0.42, 0.04, 0.08]} c="#7a4a32" r={0.7} rad={0.01} /></group>)}
      <Sachi p={P0} t={tt} x={0.95} z={0.35} rotY={-20} s={S} expr="feliz" />
    </>}
    over={(tt) => <Ink tt={tt} at={1.2} txt="1970 · NO MONEY AT ALL" col={AMB} />} />;
};

// 10:30 · DESCONGELAR: la luna sobre la heladera (toda la noche) vs el bol de agua fría con un reloj que da una vuelta (1 hora)
export const A_thaw: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 1.4, 2.7], [0, 0.55, 0]), C([0.3, 1.2, 2.5], [0, 0.55, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.5, warm: 0.2 }}
    scene={(tt) => { const moon = eio(tt, 0.3, 2.5), hand = eio(tt, a, a + 3) * Math.PI * 2;
      return <>
        <group position={[-0.7, 0, 0]}>
          <Freezer p={[0, 0, 0]} s={0.8} c="#ecebe7" />
          <mesh position={[lerp(-0.4, 0.35, moon), 1.08 + 0.1 * Math.sin(Math.PI * moon), 0.1]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#fff6d8" emissive="#fff0b0" emissiveIntensity={0.6} /></mesh>
          <Fillet p={[0, 0.3, 0.02]} s={0.75} />
        </group>
        <group position={[0.7, 0, 0.1]}>
          <Bowl p={[0, 0, 0]} s={1.6} c="#dff0f5" fill="#bfe0ee" />
          <Box p={[0, 0.22, 0]} s={[0.36, 0.05, 0.2]} c="#e6f2ff" r={0.1} op={0.7} rad={0.02} />
          <group position={[0, 0.75, -0.1]}><Dial p={[0, 0, 0]} ang={hand} s={0.7} /></group>
        </group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="OVERNIGHT" x={560} y={160} /><Ink tt={tt} at={a + 0.3} txt="1 HOUR" x={1360} y={160} col="#9fd4ff" /></>} />;
};

// 11:15 · LA KAMA: un salmón entero; el collar (detrás de la cabeza) se ilumina, se levanta y queda flotando, con el precio que baja
export const A_kama: F = ({ t, h }) => {
  const a = it(h, 0, 2.0);
  const p1 = useMemo(() => cardTex(["$2-3", "a pound"], { band: "#2a9d8f" }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.0, 2.4], [0.1, 0.3, 0]), C([0.8, 0.9, 2.0], [0.3, 0.35, 0]), 10)}
    set={(tt: number) => ({ spot: [0.3, 0.3, 0] as V, spotK: cl(tt - a) })}
    scene={(tt) => { const c = eio(tt, a, a + 1), l = eio(tt, a + 1.2, a + 2.4);
      return <>
        <Box p={[0, 0.02, 0]} s={[2.0, 0.04, 0.8]} c="#efe6d2" r={0.9} rad={0.01} />
        <Fish p={[0, 0.04, 0]} s={1.15} collar={c} lift={l} />
        <Ring p={[0.35, 0.06, 0.02]} r={0.42} k={c} col="#ffc04a" />
        <Ring p={[0.35, 0.065, 0.02]} r={0.36} k={c} col="#ffe2a0" />
        <Pop k={pop(tt, a + 0.8)} p={[0.95, 0.04, 0.2]}><PickCard p={[0, 0, 0]} map={p1} s={1.5} /></Pop>
        <Sachi p={secuencia([[0, P0], [a, POSES.pensar]], tt)} t={tt} x={-1.15} z={0.45} rotY={30} s={S} expr={tt > a + 1 ? "enamorado" : "neutral"} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.4} txt="KAMA · THE COLLAR" col={AMB} />} />;
};

// 12:00 · EL GRILL: horno en corte; una regla marca 6 pulgadas, el dial gira a 10-12 min y la piel del collar hace burbujas doradas
export const A_broiler: F = ({ t, h }) => {
  const a = it(h, 0, 4.0);
  const ruler = useMemo(() => mk(64, 512, (g) => { g.fillStyle = "#f2c94c"; g.fillRect(0, 0, 64, 512); g.fillStyle = "#222"; for (let i = 0; i <= 6; i++) { g.fillRect(0, 20 + i * 78, 40, 4); g.font = "bold 26px Arial"; g.fillText(String(6 - i), 42, 30 + i * 78); } }), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 1.0, 2.8], [0.1, 0.6, 0]), C([0.4, 0.95, 2.55], [0.1, 0.6, 0]), 10)}
    set={(tt: number) => ({ spot: [0, 0.6, 0] as V, spotK: 0.5 + 0.3 * Math.sin(tt) })}
    scene={(tt) => { const cook = eio(tt, a, a + 3);
      return <>
        <Box p={[0, 0.6, -0.3]} s={[1.5, 1.2, 0.08]} c="#2b2d31" r={0.4} m={0.3} rad={0.02} />
        {[-1, 1].map((k) => <Box key={k} p={[k * 0.72, 0.6, 0]} s={[0.06, 1.2, 0.6]} c="#2b2d31" r={0.4} m={0.3} rad={0.02} />)}
        <Box p={[0, 1.18, 0]} s={[1.5, 0.06, 0.6]} c="#2b2d31" r={0.4} m={0.3} rad={0.02} />
        <Box p={[0, 1.1, 0]} s={[1.2, 0.03, 0.4]} c="#ff6a2a" e="#ff5a1a" ei={0.6 + 0.5 * cook} r={0.4} rad={0.01} />
        <pointLight position={[0, 1.0, 0.1]} intensity={0.3 + 1.2 * cook} distance={2} color="#ff8a3d" />
        <Box p={[0, 0.5, 0]} s={[1.2, 0.02, 0.5]} c="#9a9ea4" m={0.85} r={0.3} rad={0.005} />
        <group position={[0, 0.52, 0]}>
          {[-0.25, 0.25].map((x) => <group key={x}><mesh position={[x, 0.07, 0]} scale={[1, 0.5, 0.8]}><sphereGeometry args={[0.18, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={new THREE.Color("#9fb0bf").lerp(new THREE.Color("#b5651d"), cook).getStyle()} roughness={0.35} metalness={0.2 * (1 - cook)} /></mesh>
            {cook > 0.3 && [0, 1, 2, 3].map((i) => { const u = ((tt * 0.8 + i / 4) % 1); return <mesh key={i} position={[x - 0.08 + 0.05 * i, 0.15 + 0.01 * Math.sin(u * 6), 0.05 * Math.cos(i)]} scale={0.4 + 0.6 * Math.sin(Math.PI * u)}><sphereGeometry args={[0.018, 10, 8]} /><meshStandardMaterial color="#e2a24a" roughness={0.2} /></mesh>; })}</group>)}
        </group>
        <mesh position={[0.62, 0.82, 0.2]}><planeGeometry args={[0.06, 0.55]} /><meshStandardMaterial map={ruler} /></mesh>
        <group position={[0.95, 0.9, 0.25]}><Dial p={[0, 0, 0]} ang={eio(tt, a, a + 3) * 4.4 - 2.2} s={0.28} /></group>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.0} txt="6 INCHES" x={560} y={170} /><Ink tt={tt} at={a + 0.4} txt="10-12 MIN" col={AMB} /></>} />;
};

// 13:10 · LA PANZA: el platito del restaurante a $12 se encoge y al lado la bandeja de recortes a $4 con 3 billetes que vuelan al bolsillo
export const A_belly: F = ({ t, h }) => {
  const KT = useKT();
  const a = it(h, 0, 3.0);
  const c12 = useMemo(() => cardTex(["$12", "RESTAURANT"], { band: RED }), []), c4 = useMemo(() => cardTex(["$4", "TRIMMINGS"], { band: "#2a9d8f" }), []);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.0, 1.85], [0, 0.22, 0]), C([0.35, 0.9, 1.7], [0, 0.22, 0]), 10)}
    set={{ spot: [0.6, 0, 0] as V, spotK: 0.3 }}
    scene={(tt) => { const sh = 1 - 0.35 * eio(tt, a, a + 1);
      return <>
        <group position={[-0.6, 0, 0]} scale={sh}>
          <Cyl p={[0, 0.03, 0]} r={0.38} h={0.04} c="#f4f1ea" rough={0.3} />
          {[0, 1].map((i) => <Box key={i} p={[-0.06 + 0.12 * i, 0.08, 0]} s={[0.08, 0.04, 0.32]} c="#c8732e" r={0.4} rad={0.015} />)}
          <Sign p={[0, 0.06, -0.3]} map={c12} w={0.56} h={0.35} />
        </group>
        <group position={[0.6, 0, 0]}>
          <Box p={[0, 0.03, 0]} s={[0.7, 0.04, 0.45]} c="#ffffff" r={0.3} rad={0.015} />
          {Array.from({ length: 5 }, (_, i) => <Box key={i} p={[-0.24 + 0.12 * i, 0.07, 0.03 * Math.sin(i * 2)]} s={[0.07, 0.035, 0.3]} c="#ffffff" map={KT.salmon} r={0.3} rad={0.012} rot={[0, 0.15 * Math.sin(i), 0]} />)}
          <Sign p={[0, 0.06, -0.3]} map={c4} w={0.56} h={0.35} glow={cl(tt - a)} />
        </group>
        {[0, 1].map((i) => { const k = eio(tt, a + 1 + 0.3 * i, a + 2.4 + 0.3 * i); return k < 0.02 ? null : <Bill key={i} p={[lerp(-0.6, 1.3, k), 0.2 + 0.6 * Math.sin(Math.PI * k), lerp(0, 0.4, k)]} rot={[0.3, k * 3, 0.2]} />; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.2} txt="THE RICHEST PART" col={AMB} />} />;
};

// 13:30 · LA GRASA DE ORO: sartén seca sin aceite; las tiras chisporrotean, el oro se junta y se vierte en un frasquito «for tomorrow's rice»
export const A_gold: F = ({ t, h }) => {
  const a = it(h, 0, 3.5);
  const lab = useMemo(() => cardTex(["RICE", "TOMORROW"], { w: 256, h: 160 }), []);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.1, 1.35, 2.0], [0.1, 0.15, 0]), C([0.4, 1.2, 1.85], [0.15, 0.18, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.3, warm: 0.4 }}
    scene={(tt) => { const pool = eio(tt, 0.8, a), pour = eio(tt, a, a + 1.0) * (1 - eio(tt, a + 2.4, a + 3.0)), jar = eio(tt, a + 0.5, a + 2.4);
      return <>
        <group position={[-0.25, 0, 0]} rotation={[0, 0, -0.22 * pour]}>
          <Pan p={[0, 0, 0]} heat={1 - pour} />
          {pool > 0.02 && <mesh position={[0, 0.086, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.33 * pool * (1 - 0.5 * jar), 40]} /><meshStandardMaterial color="#f0b43a" roughness={0.05} metalness={0.3} emissive="#c98a1a" emissiveIntensity={0.25} transparent opacity={0.9} /></mesh>}
          {[0, 1, 2].map((i) => <Box key={i} p={[-0.18 + 0.18 * i, 0.1, 0.02 * i]} s={[0.12, 0.03, 0.42]} c={new THREE.Color("#f2894f").lerp(new THREE.Color("#b85c22"), pool).getStyle()} r={0.4} rad={0.012} />)}
        </group>
        <Steam p={[-0.25, 0.1, 0]} t={tt} k={0.5 * (1 - pour)} s={0.6} />
        <group position={[0.55, 0, 0.1]}>
          <Cyl p={[0, 0.2, 0]} r={0.14} h={0.4} c="#e9f4f8" rough={0.05} op={0.3} />
          <Cyl p={[0, 0.41, 0]} r={0.145} h={0.03} c="#c9a24a" m={0.8} rough={0.3} />
          {jar > 0.02 && <Cyl p={[0, 0.02 + 0.14 * jar, 0]} r={0.13} h={0.28 * jar} c="#f0b43a" rough={0.05} e="#c98a1a" ei={0.3} />}
          <mesh position={[0, 0.2, 0.142]}><planeGeometry args={[0.2, 0.12]} /><meshStandardMaterial map={lab} /></mesh>
        </group>
        {pour > 0.3 && jar < 0.98 && <Cyl p={[0.42, 0.32, 0.1]} r={0.012} h={0.25} c="#f0b43a" e="#c98a1a" ei={0.3} rough={0.05} />}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.5} txt="NO OIL" col="#ffb4a8" y={160} /><Ink tt={tt} at={a + 1.5} txt="KEEP THE GOLD" col={AMB} /></>} />;
};

// 14:10 · LA ESPUMA BLANCA: la perilla del fuego sube y del filete brotan perlitas blancas (albúmina); vuelve a medio y el bol de salmuera las apaga
export const A_foam: F = ({ t, h }) => {
  const KT = useKT();
  const a = it(h, 0, 3.5);
  return <Hero t={t} h={h} mode="split" cam={(tt) => orbita(tt, C([0, 1.1, 1.8], [0, 0.15, 0]), C([0.35, 1.0, 1.6], [0, 0.15, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.5 }}
    scene={(tt) => { const heat = eio(tt, 0.4, 1.6) * (1 - eio(tt, a, a + 1)), beads = cl((tt - 1.2) * 0.7) * (1 - eio(tt, a + 0.5, a + 2));
      return <>
        <Pan p={[0, 0, 0]} s={0.9} heat={heat} />
        <group position={[0, 0.08, 0]}><Box p={[0, 0.03, 0]} s={[0.5, 0.06, 0.24]} c="#ffffff" map={KT.salmon} r={0.3} rad={0.02} /></group>
        {beads > 0.02 && Array.from({ length: 16 }, (_, i) => { const side = i % 2 ? 1 : -1; return <mesh key={i} position={[-0.23 + 0.46 * ((i * 0.37) % 1), 0.14 + 0.01 * Math.sin(i), side * 0.12]} scale={beads * (0.6 + 0.4 * ((i * 0.53) % 1))}><sphereGeometry args={[0.036, 12, 8]} /><meshStandardMaterial color="#fffaf0" roughness={0.6} /></mesh>; })}
        <group position={[-0.68, 0.3, 0.35]}><Dial p={[0, 0, 0]} ang={lerp(-1.8, 1.8, heat)} s={0.32} rim="#2b2d31" /></group>
        <Pop k={pop(tt, a)} p={[0.95, 0, 0.2]}><Bowl p={[0, 0, 0]} s={1.2} c="#e9f4f8" fill="#d6ecf5" /></Pop>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={1.4} txt="TOO HOT = WHITE FOAM" col="#ffb4a8" y={160} /><Ink tt={tt} at={a + 0.5} txt="BRINE + MEDIUM HEAT" col={AMB} /></>} />;
};

// 15:00 · EL TELÉFONO DE LINDA: el teléfono de pared beige suena (se sacude), el cable rulo se estira y sale el globo «IT WORKED!»
export const A_phone: F = ({ t, h }) => {
  const a = it(h, 0, 1.5);
  const bub = useMemo(() => cardTex(["IT WORKED!"], { bg: "#ffd27a", fg: "#2a1d12", w: 512, h: 200 }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0, 1.2, 2.2], [0, 0.95, -0.6]), C([0.3, 1.1, 2.0], [0, 0.95, -0.6]), 10)}
    set={{ spot: [0, 1, -0.6] as V, spotK: 0.6, warm: 0.5 }}
    scene={(tt) => { const ring = tt > a && tt < a + 2 ? Math.sin(tt * 40) * 0.05 : 0, lift = eio(tt, a + 2.1, a + 2.8);
      return <>
        <group position={[0, 1.0, -1.5]} rotation={[0, 0, ring]}>
          <Box p={[0, 0, 0]} s={[0.36, 0.5, 0.14]} c="#e4d6b8" r={0.4} rad={0.04} />
          <Box p={[0, 0.0, 0.1]} s={[0.12, 0.2, 0.04]} c="#d6c8a8" r={0.4} rad={0.02} />
        </group>
        <group position={[lerp(0, 0.6, lift), 1.12 + 0.1 * lift, lerp(-1.4, -0.9, lift)]} rotation={[0, 0, 1.5 + 0.3 * lift]}>
          <Box p={[0, 0, 0]} s={[0.42, 0.08, 0.1]} c="#e4d6b8" r={0.4} rad={0.035} />
        </group>
        {Array.from({ length: 16 }, (_, i) => { const u = i / 15; return <mesh key={i} position={[lerp(0, lerp(0, 0.6, lift), u), lerp(0.75, 1.0, u) - 0.25 * Math.sin(Math.PI * u), lerp(-1.42, lerp(-1.4, -0.9, lift), u)]}><torusGeometry args={[0.03, 0.008, 6, 12]} /><meshStandardMaterial color="#d6c8a8" /></mesh>; })}
        <Pop k={pop(tt, a + 2.8)} p={[-0.5, 1.3, -0.9]} s={1.5}><Box p={[0, 0, -0.01]} s={[0.8, 0.32, 0.02]} c="#ffd27a" r={0.6} rad={0.08} /><mesh position={[0, 0, 0.002]}><planeGeometry args={[0.78, 0.3]} /><meshStandardMaterial map={bub} /></mesh></Pop>
        <Sachi p={secuencia([[0, P0], [a + 2.8, POSES.ref ?? P0]], tt)} t={tt} x={0.45} z={-0.4} rotY={-30} s={S} expr={tt > a + 2.8 ? "carcajada" : "sorprendido"} />
      </>; }} />;
};

// 15:45 · NO LO LAVES: el chorro de la canilla rebota en el filete y salpica (cruz roja); la servilleta de papel baja y lo seca (tilde verde)
export const A_patdry: F = ({ t, h }) => {
  const a = it(h, 0, 3.0);
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.3, 2.0], [0, 0.3, 0]), C([0.35, 1.2, 1.8], [0, 0.3, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.15 }}
    scene={(tt) => { const water = tt < a ? 1 : 1 - eio(tt, a - 0.6, a), towel = eio(tt, a - 0.4, a + 0.3), pat = towel >= 1 ? Math.abs(Math.sin((tt - a - 1.0) * 5)) * 0.03 : 0;
      return <>
        <Fillet p={[0, 0, 0]} s={1.1} />
        <group position={[0, 1.15, -0.25]}><Cyl p={[0, 0, 0]} r={0.035} h={0.5} c="#d5d9dd" m={0.95} rough={0.15} rot={[Math.PI / 2, 0, 0]} /><Cyl p={[0, -0.05, 0.25]} r={0.03} h={0.1} c="#d5d9dd" m={0.95} rough={0.15} /></group>
        {water > 0.02 && <Cyl p={[0, 0.6, 0]} r={0.022} h={1.0} c="#cfe9ff" rough={0.05} op={0.55 * water} />}
        {water > 0.02 && Array.from({ length: 14 }, (_, i) => { const u = ((tt * 1.4 + i / 14) % 1), an = i * 0.45; return <mesh key={i} position={[Math.cos(an) * u * 0.6, 0.12 + Math.sin(Math.PI * u) * 0.3, Math.sin(an) * u * 0.6]}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#cfe9ff" transparent opacity={0.8 * water} roughness={0.05} /></mesh>; })}
        {towel > 0.02 && <group position={[0, 0.098 + 0.6 * (1 - towel) + pat, 0]} rotation={[0, 0.2, 0.05 * (1 - towel)]}>
          {[-1, 1].map((k) => <Box key={k} p={[k * 0.39, -0.035, 0]} s={[0.1, 0.014, 0.42]} c="#e2d4b8" r={1} rad={0.006} rot={[0, 0, k * -1.1]} />)}
          {[0, 1, 2, 3].map((i) => <Box key={i} p={[-0.27 + 0.18 * i, 0.004 * (i % 2), 0]} s={[0.19, 0.016, 0.42]} c="#e2d4b8" r={1} rad={0.006} rot={[0, 0, 0.04 * (i % 2 ? 1 : -1)]} />)}
          {[0, 1, 2].map((i) => <Box key={"d" + i} p={[-0.18 + 0.18 * i, 0.012, 0]} s={[0.006, 0.008, 0.4]} c="#c9b996" r={1} rad={0.002} />)}
          {towel >= 1 && <group position={[0.05, 0.06 + 2 * pat, 0]}><mesh scale={[1.3, 0.55, 1]}><sphereGeometry args={[0.1, 20, 14]} /><meshStandardMaterial color="#f1ede6" roughness={0.7} /></mesh>{[-0.06, -0.02, 0.02, 0.06].map((z) => <Cyl key={z} p={[0.13, -0.01, z]} r={0.022} h={0.11} c="#f1ede6" rough={0.7} rot={[0, 0, Math.PI / 2]} />)}<Cyl p={[-0.2, 0.08, 0]} r={0.04} h={0.3} c="#f1ede6" rough={0.7} rot={[0, 0, 1.0]} /></group>}
        </group>}
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.6} txt="✗ UNDER THE FAUCET" col="#ff8a7a" y={160} /><Ink tt={tt} at={a + 1.0} txt="✓ PAT IT DRY" col="#7fe0a0" /></>} />;
};

// 19:10 · COMO NIEVE: la sal cae desde 30 cm (un pie, la regla al lado) en copos lentos sobre los filetes en la rejilla; atrás, el techo con la primera nevada
export const A_snow: F = ({ t, h }) => {
  const a = it(h, 0, 3.0);
  const ft = useMemo(() => mk(64, 640, (g) => { g.fillStyle = "#f2c94c"; g.fillRect(0, 0, 64, 640); g.fillStyle = "#222"; for (let i = 0; i <= 12; i++) g.fillRect(0, 20 + i * 50, i % 6 ? 22 : 40, 4); g.save(); g.translate(48, 330); g.rotate(-Math.PI / 2); g.font = "900 34px Arial"; g.textAlign = "center"; g.fillText("1 FT", 0, 0); g.restore(); }), []);
  return <Hero t={t} h={h} mode="blinds" cam={(tt) => orbita(tt, C([0, 1.4, 2.4], [0, 0.45, 0]), C([0.4, 1.25, 2.2], [0, 0.45, 0]), 10)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.6, warm: 0, bg: "#dfe6ee" }}
    scene={(tt) => { const cover = eio(tt, 0.8, a + 2);
      return <>
        <Box p={[0, 0.04, 0]} s={[1.3, 0.02, 0.6]} c="#9a9ea4" m={0.85} r={0.3} rad={0.005} />
        {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[-0.6 + i * 0.15, 0.06, 0]} s={[0.01, 0.01, 0.6]} c="#b8bcc2" m={0.9} r={0.2} rad={0.002} />)}
        {[-0.3, 0.3].map((x) => <group key={x}><Fillet p={[x, 0.06, 0]} s={0.75} />
          {cover > 0.02 && Array.from({ length: 50 }, (_, i) => <mesh key={i} position={[x - 0.25 + 0.5 * ((i * 0.37) % 1), 0.13, -0.1 + 0.2 * ((i * 0.71) % 1)]} scale={cl(cover * 1.5 - (i % 10) / 10)}><boxGeometry args={[0.022, 0.014, 0.022]} /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>)}</group>)}
        {Array.from({ length: 70 }, (_, i) => { const u = ((tt * 0.35 + i / 70) % 1), y = 1.3 - u * 1.2; return <mesh key={i} position={[-0.55 + 1.1 * ((i * 0.37) % 1), y, -0.2 + 0.4 * ((i * 0.53) % 1)]} rotation={[tt + i, i, 0]}><boxGeometry args={[0.024, 0.024, 0.024]} /><meshStandardMaterial color="#ffffff" transparent opacity={Math.sin(Math.PI * u)} /></mesh>; })}
        <group position={[0, 1.38, 0]}><Cyl p={[0, 0, 0]} r={0.12} h={0.1} c="#f7f5ee" rough={0.6} /><Cyl p={[0, 0.06, 0]} r={0.13} h={0.03} c="#b08a3e" m={0.7} /></group>
        <mesh position={[0.68, 0.5, 0.1]}><planeGeometry args={[0.09, 0.95]} /><meshStandardMaterial map={ft} /></mesh>
        <Sachi p={P0} t={tt} x={-1.05} z={0.35} rotY={35} s={S} expr="feliz" />
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.8} txt="1 FOOT HIGH" x={1450} y={170} /><Ink tt={tt} at={a + 0.6} txt="LIKE THE FIRST SNOW" col={AMB} /></>} />;
};

// 19:35 · TODA LA NOCHE: la heladera abierta de perfil; el reloj gira 8 horas, el filete se oscurece y la piel se seca como papel (se riza)
export const A_overnight: F = ({ t, h }) => {
  const a = it(h, 0, 3.0);
  return <Hero t={t} h={h} mode="iris" cam={(tt) => orbita(tt, C([0.15, 1.2, 3.1], [0.2, 0.6, 0]), C([0.45, 1.1, 2.9], [0.2, 0.6, 0]), 10)}
    set={{ spot: [0, 0.6, 0] as V, spotK: 0.3, warm: 0.1, bg: "#cdd6e2" }}
    scene={(tt) => { const n = eio(tt, 0.5, a + 3);
      return <>
        <Freezer p={[-0.3, 0, 0]} s={1.2} c="#e8e7e2" />
        <group position={[-0.3, 0.55, 0]}>
          <Box p={[0, 0, 0]} s={[0.9, 0.015, 0.6]} c="#c9ced3" m={0.7} r={0.3} rad={0.004} />
          <Box p={[0, 0.07, 0]} s={[0.66, 0.05, 0.28]} c={new THREE.Color("#f2894f").lerp(new THREE.Color("#d2632e"), n).getStyle()} r={0.3 + 0.4 * n} rad={0.02} />
          <mesh position={[0, 0.1, -0.13]} rotation={[-0.8 * n, 0, 0]}><planeGeometry args={[0.64, 0.06]} /><meshStandardMaterial color="#b7bcc4" roughness={0.95} side={THREE.DoubleSide} /></mesh>
        </group>
        <group position={[0.8, 0.85, 0]}><Dial p={[0, 0, 0]} ang={n * Math.PI * 2 * (8 / 12)} s={0.5} /></group>
        <mesh position={[0.35, 1.05, -0.9]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#fff6d8" emissive="#fff0b0" emissiveIntensity={0.5} /></mesh>
      </>; }}
    over={(tt) => <><Ink tt={tt} at={0.9} txt="8 HOURS · UNCOVERED" col={AMB} y={160} /><Ink tt={tt} at={a + 1.5} txt="SKIN LIKE PAPER" /></>} />;
};

// 21:05 · UNA SEMANA CON 12 DÓLARES: un filete se parte en 4 y cada pieza salta a su día (LUN parrilla, MAR onigiri, MIÉ ochazuke, JUE furikake)
export const A_week: F = ({ t, h }) => {
  const KT = useKT();
  const days = ["MON", "TUE", "WED", "THU"];
  const dt = useMemo(() => days.map((d) => cardTex([d], { bg: "#fbf8f1", band: RED, w: 256, h: 256 })), []);
  const it0 = [it(h, 0, 2), it(h, 1, 4), it(h, 2, 6), it(h, 3, 8)];
  return <Hero t={t} h={h} mode="wipe" cam={(tt) => orbita(tt, C([0, 1.6, 2.6], [0, 0.3, 0]), C([0.3, 1.4, 2.4], [0, 0.3, 0]), 11)}
    set={{ spot: [0, 0, 0] as V, spotK: 0.5 }}
    scene={(tt) => { const cut = eio(tt, 0.5, 1.4);
      return <>
        {days.map((d, i) => { const k = pop(tt, it0[i] - 0.3), x = -1.05 + i * 0.7;
          return <group key={d}>
            <mesh position={[x, 0.75, -0.6]}><planeGeometry args={[0.42, 0.42]} /><meshStandardMaterial map={dt[i]} /></mesh>
            {k < 0.02 ? <Box p={[lerp(-0.3, 0.3, i / 3) * (1 + 0.4 * cut), 0.04, 0.2]} s={[0.16, 0.05, 0.28]} c="#ffffff" map={KT.salmon} r={0.3} rad={0.015} />
              : <Pop k={k} p={[x, 0, -0.1]} s={1.35}>
                {i === 0 && <><Cyl p={[0, 0.02, 0]} r={0.2} h={0.03} c="#f4f1ea" /><Box p={[0, 0.06, 0]} s={[0.2, 0.05, 0.12]} c="#c8732e" r={0.4} rad={0.02} /></>}
                {i === 1 && [-0.08, 0.08].map((xx) => <group key={xx} position={[xx, 0.08, 0]}><mesh scale={[1, 1.1, 0.7]}><coneGeometry args={[0.09, 0.15, 3]} /><meshStandardMaterial color="#fbfaf5" roughness={0.7} /></mesh><Box p={[0, -0.04, 0.05]} s={[0.12, 0.07, 0.01]} c="#1e2a1c" r={0.6} rad={0.003} /></group>)}
                {i === 2 && <><Bowl p={[0, 0, 0]} s={0.8} c="#7a5434" fill="#c9b27a" /><Steam p={[0, 0.15, 0]} t={tt} s={0.4} /></>}
                {i === 3 && <><Cyl p={[0, 0.1, 0]} r={0.08} h={0.2} c="#e9f4f8" op={0.4} rough={0.05} /><Cyl p={[0, 0.06, 0]} r={0.075} h={0.12} c="#d9a06a" rough={0.8} /></>}
              </Pop>}
          </group>; })}
      </>; }}
    over={(tt) => <Ink tt={tt} at={it0[3] + 0.6} txt="4 MEALS · $12" col={AMB} />} />;
};

// 22:25 · EL REGATEO DE MAMÁ: en el puesto de Kuromon, dos pescados; «este es el mejor» (la mano de mamá apunta al feo) y una moneda rueda a su lado: buen precio
export const A_haggle: F = ({ t, h }) => {
  const a = it(h, 0, 2.5);
  const lan = useMemo(() => mk(128, 256, (g) => { g.fillStyle = "#e9452f"; g.fillRect(0, 0, 128, 256); g.fillStyle = "#1a1a1a"; g.fillRect(0, 0, 128, 20); g.fillRect(0, 236, 128, 20); g.strokeStyle = "rgba(0,0,0,.25)"; for (let y = 30; y < 236; y += 18) { g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); } }), []);
  const awn = useMemo(() => mk(512, 64, (g) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#f4efe4" : "#2a5d8a"; g.fillRect(i * 32, 0, 32, 64); } }), []);
  return <Hero t={t} h={h} mode="drop" cam={(tt) => orbita(tt, C([0.3, 1.35, 3.1], [0.25, 0.8, 0]), C([0.6, 1.25, 2.9], [0.25, 0.8, 0]), 10)}
    set={{ spot: [0, 0.5, 0] as V, spotK: 0.3, warm: 0.7 }}
    scene={(tt) => { const pt = eio(tt, a - 0.6, a);
      return <>
        <Box p={[0.3, 0.25, -0.1]} s={[1.5, 0.5, 0.6]} c="#7a5634" r={0.7} rad={0.02} />
        <IceTray p={[0.3, 0.5, -0.1]} w={1.3} d={0.5} />
        <Fish p={[0.0, 0.58, -0.1]} s={0.5} rotY={0.15} />
        <Fish p={[0.65, 0.58, -0.1]} s={0.45} rotY={-0.15} />
        {[-0.4, 1.0].map((x) => <Box key={x} p={[x, 0.75, -0.35]} s={[0.04, 1.5, 0.04]} c="#5a3d22" r={0.7} rad={0.01} />)}
        <group position={[0.3, 1.45, -0.15]} rotation={[0.45, 0, 0]}><Box p={[0, 0, 0]} s={[1.6, 0.02, 0.55]} c="#ffffff" r={0.9} rad={0.005} map={awn} /></group>
        {[-0.2, 0.8].map((x) => <group key={x} position={[x, 1.18 + 0.02 * Math.sin(tt + x), 0.1]}><mesh scale={[1, 1.35, 1]}><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial map={lan} emissive="#ff6a3a" emissiveIntensity={0.5} roughness={0.8} /></mesh></group>)}
        <Sachi p={secuencia([[0, P0], [a - 0.6, POSES.pensar]], tt)} t={tt} x={-0.55} z={0.45} rotY={30} s={S * 1.1} expr={tt > a + 1 ? "carcajada" : "guino"} />
        <group position={[lerp(-0.4, -0.05, pt), 0.62, 0.15]} rotation={[0, 0, -0.2]}><Cyl p={[0, 0, 0]} r={0.025} h={0.22} c="#f1ede6" rot={[0, 0, Math.PI / 2]} rough={0.7} /></group>
        {tt > a + 0.8 && <Coin p={[lerp(0.65, -0.35, eio(tt, a + 0.8, a + 2.2)), 0.62, 0.2]} rot={[Math.PI / 2, 0, tt * 6]} s={1.4} />}
        {[0, 1, 2].map((i) => <Coin key={i} p={[-0.35, 0.53 + 0.02 * i, 0.2]} s={1.4} />)}
        <Sachi p={P0} t={tt} x={1.25} z={-0.25} rotY={-40} s={S * 1.1} color="#dcd6cc" expr={tt > a + 1 ? "carcajada" : "nervioso"} />
      </>; }}
    over={(tt) => <Ink tt={tt} at={a + 1.6} txt="ALWAYS THE GOOD PRICE" col={AMB} />} />;
};
