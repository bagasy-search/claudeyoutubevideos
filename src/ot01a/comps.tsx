// ot01a · LOS COMPONENTES de Vittorio. Hilo: el estuche de terciopelo de 6 lugares (5 relojes que gritan + el lugar de Giuseppe).
// Cada pieza es un objeto físico del taller de Corso Magenta; el texto vive DENTRO del objeto (tiza, regla, etiqueta, libreta).
import React from "react";
import * as THREE from "three";
import { Stage } from "./base";
import { Blob, Esc, HAND, M, RBox, Sombra, camA, canv, cl, handCard, lerp, printTex, rn, spr, win, type Pose } from "./k3d";
import { Brazo, EH, EnMuneca, Estuche, EnCojin, Mesa, Reloj, TizaX, chalkTex, flannelTex, piel, slotX, type Tipo } from "./reloj";

export type Fi = { id: string; a: number; b: number; wow?: number | null; n?: number; k?: number; mo?: Record<string, number> };
type CP = { t: number; f: Fi };
const W = (f: Fi) => f.wow ?? f.a + 0.5;

// ============ HILO · el estuche ============
const ORDEN: Tipo[] = ["diver", "cockpit", "smart", "sopra", "oro"];
export const EstucheFX: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, n = f.n ?? 0, w = W(f), intro = n === 0, fin = n === 6;
  const arr = intro ? spr(t, a + 0.02, 0.8, 1.6) : 1, open = intro ? spr(t, a + 0.45, 0.9, 1.7) : 1;
  const sx = n >= 1 && n <= 6 ? slotX(n - 1) : 0;
  const cam: Pose = intro ? camA(t, a, b, { p: [0.05, 0.42, 0.5], l: [0, 0.03, 0], fov: 30 }, { p: [0.0, 0.3, 0.36], l: [0, 0.035, 0], fov: 32 })
    : camA(t, a, b, { p: [sx + 0.1, 0.26, 0.26], l: [sx, 0.06, 0], fov: 30 }, { p: [sx + 0.03, 0.18, 0.2], l: [sx, 0.08, 0.0], fov: 32 });
  const tg = intro ? "#ffd9a8" : "#ffe3c0";
  return <Stage t={t} a={a} b={b} dim={0.55} tint={tg}>
    <Esc cam={cam} key1={[-0.6, 1.1, 0.7]} exposure={1.05}>
      <group position={[0, (1 - arr) * 0.1, (1 - arr) * -1.2]} rotation={[0, (1 - arr) * 0.7, 0]}>
        <Mesa w={1.1} d={0.7} />
        <Blob w={0.6} d={0.22} o={0.55} />
        <Estuche open={open}>
          {ORDEN.map((k, i) => {
            const slot = i + 1;
            // intro: caen uno por uno al cojín; hilo: el del número n se levanta, gira hacia cámara y recibe la X; los anteriores ya llevan X
            const drop = intro ? 1 - spr(t, a + 0.9 + i * 0.22, 1.1, 1.5) : 0;
            if (fin) return null;   // en el de Giuseppe ya no están
            const me = slot === n, up = me ? spr(t, w, 0.9, 1.4) * (1 - win(t, w + 2.4, w + 3.0)) : 0;
            const crossed = slot < n || (me && t > w + 0.9);
            return <group key={k}>
              <EnCojin i={i} k={k} lift={Math.max(0, drop) * 0.12 + up * 0.05} rz={up * 0.0} sp={k === "oro" ? cl((t - a) / 3) : 0} glow={k === "smart" ? 0.4 + 0.6 * (me ? win(t, w + 0.2, w + 0.5) : 0) : 0} />
              {crossed && <group position={[slotX(i), EH + 0.044 + up * 0.05, 0.022]} rotation={[-Math.PI / 2 + 0.6, 0, 0]}>
                <TizaX k={slot < n ? 1 : win(t, w + 0.9, w + 1.35)} s={0.06} col="#f4f1e8" />
              </group>}
            </group>;
          })}
          {/* lugar 6: vacío y apenas iluminado hasta Giuseppe */}
          {fin && <group>
            <EnCojin i={5} k="giuseppe" lift={(1 - spr(t, w - 0.3, 0.8, 1.6)) * 0.14} />
            <group position={[slotX(5) - 0.002, EH + 0.002, 0.075]} rotation={[-Math.PI / 2, 0, 0.08]}>
              <mesh><planeGeometry args={[0.05, 0.024]} /><meshStandardMaterial map={handCard("1976", win(t, w + 0.6, w + 1.4), 256, 120, { size: 86, line: false })} roughness={0.9} /></mesh>
            </group>
          </group>}
          {!fin && <pointLight position={[slotX(5), EH + 0.05, 0.03]} intensity={0.04 + 0.03 * Math.sin(t * 2)} distance={0.12} color="#ffe0b0" />}
        </Estuche>
      </group>
    </Esc>
  </Stage>;
};

// ============ 1 · ronchi: la regla de madera del Maestro golpea la mesa; la frase se graba a fuego ============
const regla = (p: number) => canv("regla" + Math.round(p * 20), 1024, 96, (g) => {
  g.fillStyle = "#c79a5c"; g.fillRect(0, 0, 1024, 96);
  for (let y = 0; y < 96; y++) { g.fillStyle = `rgba(110,70,30,${0.08 + 0.08 * Math.sin(y * 0.6 + Math.sin(y * 0.1) * 4)})`; g.fillRect(0, y, 1024, 1); }
  g.fillStyle = "#2b1a0c"; for (let i = 0; i <= 100; i++) { const x = 12 + i * 10; g.fillRect(x, 0, 2, i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 12); }
  const txt = "WHISPER. NEVER SHOUT.", q = Math.round(p * 20) / 20;
  g.font = "700 40px Georgia, serif"; g.textBaseline = "middle"; const m = g.measureText(txt), x0 = 512 - m.width / 2;
  g.save(); g.beginPath(); g.rect(0, 0, x0 + m.width * q, 96); g.clip();
  g.shadowColor = "rgba(255,140,40,.9)"; g.shadowBlur = 10 * (1 - q) + 2; g.fillStyle = "#3a1d08"; g.fillText(txt, x0, 62); g.restore();
  if (q > 0 && q < 1) { g.fillStyle = "rgba(255,170,60,.9)"; g.beginPath(); g.arc(x0 + m.width * q, 62, 6, 0, 6.3); g.fill(); }
});
export const Ronchi: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const fall = 1 - spr(t, a + 0.1, 1.4, 2.4), burn = win(t, w - 0.1, w + 1.5);
  const cam = camA(t, a, b, { p: [0.05, 0.42, 0.38], l: [0, 0, 0.02], fov: 30 }, { p: [-0.02, 0.32, 0.26], l: [0.0, 0.0, 0.01], fov: 30 });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-0.5, 1.0, 0.5]}>
      <Mesa w={1} d={0.7} />
      {/* tela gris de fondo con una línea de tiza */}
      <mesh rotation={[-Math.PI / 2, 0, 0.1]} position={[0.05, 0.002, -0.08]} receiveShadow><planeGeometry args={[0.5, 0.3]} /><meshPhysicalMaterial map={flannelTex()} roughness={0.95} /></mesh>
      <group position={[0, 0.006 + fall * 0.18, 0.05]} rotation={[-Math.PI / 2 + fall * 0.9, 0, 0.04]}>
        <RBox s={[0.42, 0.04, 0.005]} r={0.0015}><meshStandardMaterial map={regla(burn)} roughness={0.6} /></RBox>
        {burn > 0 && burn < 1 && <pointLight position={[lerp(-0.12, 0.13, burn), 0.0, 0.02]} intensity={0.08} distance={0.08} color="#ff9a3c" />}
      </group>
      <Blob w={0.5} d={0.08} o={0.45 * (1 - fall)} y={0.003} />
    </Esc>
  </Stage>;
};

// ============ 2 · puño: ¼ de pulgada para que el reloj entre; el buzo lo monta «como una carpa» ============
export const Puno: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), q = f.mo?.q ?? a + 1, big = f.mo?.big ?? w - 1.5;
  const sw = win(t, big - 0.2, big + 0.3), k: Tipo = sw > 0.5 ? "diver" : "steel36";
  // reloj chico: el puño se desliza por encima (¼" de holgura); buzo: el puño intenta, se trepa y queda montado «como una carpa»
  const slideA = win(t, q + 0.3, q + 1.4), slideB = win(t, big + 0.5, w - 0.1), tent = spr(t, w - 0.35, 0.9, 1.5) * (t > big ? 1 : 0);
  const cuff = sw > 0.5 ? lerp(-0.04, -0.016, slideB) : lerp(-0.04, 0.004, slideA);
  const drop = sw > 0.5 ? 1 - spr(t, big + 0.05, 1.1, 1.6) : 0;
  const cam = camA(t, a, b, { p: [0.0, 0.13, 0.27], l: [-0.03, 0.012, 0], fov: 26 }, { p: [0.03, 0.09, 0.22], l: [-0.025, 0.02, 0], fov: 24 });
  const tick = win(t, q, q + 0.5) * (1 - win(t, big - 0.3, big));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-0.4, 0.6, 0.5]}>
      <group rotation={[0, -0.35, 0]}>
        <Brazo cuff={cuff} sleeve={cuff - 0.012 - 0.03 * tent} lift={0.013 * tent} tent={tent} />
        <EnMuneca k={k} up={drop * 0.08} />
        {tick > 0.01 && <group position={[-0.012, 0.062, 0.03]}>
          <mesh position={[0, 0, 0]} scale={[tick, 1, 1]}><planeGeometry args={[0.012, 0.0014]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.9} /></mesh>
          <mesh position={[0.0, 0.012, 0]}><planeGeometry args={[0.044, 0.022]} /><meshBasicMaterial map={handCard("¼ inch", tick, 256, 128, { bg: "rgba(0,0,0,0)", ink: "#fff6dc", size: 92, line: false })} transparent opacity={tick} /></mesh>
        </group>}
      </group>
    </Esc>
  </Stage>;
};

// ============ 3 · periódico: la esfera del cockpit se despliega en un diario de columnas ============
const diario = () => canv("diario", 1024, 640, (g) => {
  g.fillStyle = "#ece6d6"; g.fillRect(0, 0, 1024, 640);
  g.fillStyle = "#1a1a1a"; g.font = "900 60px Georgia, serif"; g.textAlign = "center"; g.fillText("THE DAILY DIAL", 512, 74);
  g.fillRect(40, 96, 944, 3); g.fillRect(40, 104, 944, 1);
  g.font = "800 30px Georgia, serif"; g.textAlign = "left";
  const heads = ["TACHYMETER 400", "SUBDIAL 30 MIN", "CHRONO PUSHER"];
  for (let c = 0; c < 4; c++) { const x = 44 + c * 236; if (c < 3) { g.fillText(heads[c], x, 148); }
    g.font = "500 15px Georgia"; for (let l = 0; l < 26; l++) { let s = ""; for (let k = 0; k < 6; k++) s += String(Math.floor(rn(c * 99 + l * 7 + k, 2) * 9999)) + " "; g.fillText(s, x, 180 + l * 17 + (c === 3 ? -30 : 0)); }
    g.font = "800 30px Georgia, serif"; }
});
export const Periodico: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), unf = spr(t, w - 0.15, 0.8, 1.5);
  const cam = camA(t, a, b, { p: [0, 0.0, 0.14], l: [0, 0, 0], fov: 28 }, { p: [0, 0.02, 0.36], l: [0, 0, 0], fov: 30 });
  return <Stage t={t} a={a} b={b} dim={0.65}>
    <Esc cam={cam} key1={[-0.3, 0.5, 0.6]}>
      <group rotation={[0, 0.25 * (1 - unf), 0]}><Reloj k="cockpit" h={10} m={9} sec={(t - a) * 6} strap={0.06} /></group>
      {/* el diario se abre detrás, en dos hojas, y queda chico el reloj */}
      {unf > 0.01 && <group position={[0, 0, -0.03]} scale={0.6 + 0.4 * cl(unf)}>
        {[-1, 1].map((sx) => <group key={sx} rotation={[0, sx * (1 - cl(unf)) * 1.4, 0]}>
          <mesh position={[sx * 0.1, 0, 0]}><planeGeometry args={[0.2, 0.25]} /><meshStandardMaterial map={(() => { const tx = diario().clone(); tx.repeat.set(0.5, 1); tx.offset.set(sx < 0 ? 0 : 0.5, 0); tx.needsUpdate = true; return tx; })()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>)}
      </group>}
    </Esc>
  </Stage>;
};

// ============ 4 · cajón: el reloj del padre ya está en la casa; la etiqueta dice $0 ============
export const Cajon: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), out = spr(t, a + 0.15, 0.7, 1.6), tag = win(t, w - 0.1, w + 0.8);
  const cam = camA(t, a, b, { p: [0.0, 0.3, 0.42], l: [0, 0.0, 0.08], fov: 30 }, { p: [0.02, 0.24, 0.3], l: [0, 0.0, 0.1], fov: 30 });
  const z = 0.16 * out;
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-0.5, 0.9, 0.7]}>
      {/* cómoda: frente de madera con el cajón */}
      <RBox s={[0.6, 0.3, 0.02]} r={0.004} p={[0, -0.16, -0.01]}>{M.wood({ base: [96, 60, 34] })}</RBox>
      <group position={[0, -0.03, z]}>
        <RBox s={[0.36, 0.012, 0.3]} r={0.002} p={[0, -0.03, -0.15]}>{M.wood({ base: [180, 140, 96] })}</RBox>
        {[-1, 1].map((sx) => <RBox key={sx} s={[0.012, 0.06, 0.3]} r={0.002} p={[sx * 0.174, 0, -0.15]}>{M.wood({ base: [180, 140, 96] })}</RBox>)}
        <RBox s={[0.4, 0.08, 0.018]} r={0.004} p={[0, 0, 0.01]}>{M.wood({ base: [104, 64, 36] })}</RBox>
        <mesh position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.011, 0.012, 20]} />{M.brass()}</mesh>
        {/* adentro: pañuelo doblado, gemelos y el reloj del padre */}
        <RBox s={[0.12, 0.006, 0.1]} r={0.002} p={[-0.1, -0.021, -0.12]}><meshPhysicalMaterial color="#e8e2d4" roughness={0.8} sheen={0.6} /></RBox>
        {[0, 1].map((i) => <mesh key={i} position={[0.12 + i * 0.022, -0.02, -0.08]}><sphereGeometry args={[0.007, 16, 12]} />{M.brass()}</mesh>)}
        <group position={[0.02, -0.014, -0.13]} rotation={[-Math.PI / 2, 0, 0.3]}><Reloj k="steel36" strap={0.05} /></group>
        {/* etiqueta de cartón atada al cajón: da vuelta y muestra $0 a mano */}
        <group position={[0.12, 0.0, 0.03]} rotation={[0, (1 - tag) * Math.PI, 0.1 * Math.sin((t - w) * 4) * Math.exp(-(t - w))]}>
          <mesh position={[0, -0.03, 0.002]}><planeGeometry args={[0.06, 0.035]} /><meshStandardMaterial map={handCard("$0", tag, 256, 150, { size: 110, ink: "#7a1a14" })} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>
      <pointLight position={[0, 0.06, 0.05]} intensity={0.25 * out} distance={0.4} color="#ffe2b8" />
    </Esc>
  </Stage>;
};

// ============ 5 · secreto: al levantar la copa, el puño corre y el reloj asoma un segundo, con destello ============
export const Secreto: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), s0 = f.mo?.sale ?? a + 1.5;
  const lift = win(t, s0 - 0.3, s0 + 0.4) * (1 - win(t, w + 0.1, w + 0.8));
  const cam = camA(t, a, b, { p: [0.0, 0.11, 0.26], l: [-0.03, 0.02, 0], fov: 26 }, { p: [0.01, 0.08, 0.21], l: [-0.025, 0.025, 0], fov: 24 });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-0.3, 0.5, 0.5]}>
      <group rotation={[0, -0.3, 0.3 * lift]}>
        <Brazo cuff={lerp(0.006, -0.03, lift)} sleeve={lerp(-0.004, -0.045, lift)} />
        <EnMuneca k="steel36" />
      </group>
      <pointLight position={[0.0, 0.07, 0.06]} intensity={0.25 * lift * (0.6 + 0.4 * Math.sin(t * 9))} distance={0.15} color="#fff" />
    </Esc>
  </Stage>;
};

// ============ 6 · grita: el oro con brillantes encendido; la etiqueta del precio sube a los gritos ============
const precioTex = (v: number) => canv("precio" + v, 512, 200, (g) => {
  g.fillStyle = "#f3ede0"; g.fillRect(0, 0, 512, 200); g.strokeStyle = "#a31d16"; g.lineWidth = 6; g.strokeRect(10, 10, 492, 180);
  g.fillStyle = "#a31d16"; g.font = "900 110px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$" + v.toLocaleString("en-US"), 256, 104);
});
export const Grita: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), sh = win(t, w - 0.2, w + 1.6), v = Math.round(48000 * Math.pow(sh, 0.7) / 500) * 500;
  const cam = camA(t, a, b, { p: [0.0, 0.18, 0.24], l: [0, 0.02, 0], fov: 30 }, { p: [0.0, 0.12, 0.18], l: [0, 0.025, 0], fov: 32 });
  const pul = 1 + 0.08 * sh * Math.abs(Math.sin((t - w) * 9)) * Math.exp(-Math.max(0, t - w - 1.2));
  return <Stage t={t} a={a} b={b} dim={0.65} tint="#ffd27a">
    <Esc cam={cam} key1={[-0.4, 0.7, 0.5]} exposure={1.05}>
      <Mesa w={0.9} d={0.6} />
      <RBox s={[0.12, 0.03, 0.1]} r={0.006} p={[0, 0.015, -0.01]}>{piel("cajaoro", [30, 20, 18])}</RBox>
      <RBox s={[0.105, 0.004, 0.086]} r={0.002} p={[0, 0.031, -0.01]}><meshPhysicalMaterial color="#efe6d2" roughness={0.4} sheen={1} /></RBox>
      <group position={[0, 0.045, 0]} rotation={[-Math.PI / 2 + 0.5, 0, 0]} scale={pul}><Reloj k="oro" sp={sh} strap={0.04} bend={0.8} /></group>
      {/* ondas del grito: anillos dorados que salen del reloj */}
      {[0, 1, 2].map((i) => { const u = ((t - w) * 0.9 + i / 3) % 1; return t > w && <mesh key={i} position={[0, 0.05, 0.01]} rotation={[-Math.PI / 2 + 0.5, 0, 0]}><ringGeometry args={[0.03 + u * 0.12, 0.032 + u * 0.12, 64]} /><meshBasicMaterial color="#ffd27a" transparent opacity={(1 - u) * 0.5 * sh} /></mesh>; })}
      {/* etiqueta del precio colgando de un hilo */}
      <group position={[0.07, 0.09 + 0.03 * sh, 0.03]} rotation={[0, -0.3, 0.12 * Math.sin((t - w) * 3) * Math.exp(-Math.max(0, t - w))]} scale={0.6 + 0.6 * spr(t, w - 0.1, 1, 1.4)}>
        <mesh><planeGeometry args={[0.075, 0.03]} /><meshStandardMaterial map={precioTex(v)} roughness={0.8} side={THREE.DoubleSide} /></mesh>
        <mesh position={[-0.04, 0.02, 0]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.0004, 0.0004, 0.05, 6]} /><meshBasicMaterial color="#e8e0cc" /></mesh>
      </group>
      <pointLight position={[0, 0.12, 0.08]} intensity={0.6 * sh} distance={0.4} color="#ffe2a0" />
    </Esc>
  </Stage>;
};

// ============ 7 · diez: el espejo de tres hojas; la tiza marca los diez segundos de Harlan, palito por palito ============
export const Diez: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), n = Math.max(0, Math.min(10, Math.floor((t - w) / 0.95) + 1));
  const cam = camA(t, a, b, { p: [0.6, 1.5, 1.55], l: [-0.05, 1.3, 0], fov: 32 }, { p: [0.45, 1.42, 1.15], l: [-0.05, 1.32, 0], fov: 32 });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-1.2, 2.4, 1.4]}>
      {[-1, 0, 1].map((i) => <group key={i} position={[i * 0.52 * Math.cos(i * 0.5), 1.1, -Math.abs(i) * 0.2]} rotation={[0, -i * 0.5, 0]}>
        <RBox s={[0.54, 1.62, 0.04]} r={0.01}>{M.wood({ base: [70, 42, 22] })}</RBox>
        <mesh position={[0, 0, 0.021]}><planeGeometry args={[0.46, 1.52]} /><meshPhysicalMaterial color="#c9ced4" metalness={1} roughness={0.07} envMapIntensity={1.4} /></mesh>
      </group>)}
      {/* palitos de tiza sobre la hoja del medio: IIII̸ IIII̸ */}
      <group position={[0, 1.42, 0.065]}>
        {Array.from({ length: n }, (_, i) => { const g = Math.floor(i / 5), j = i % 5, k = cl((t - w - i * 0.95) / 0.25);
          return j < 4 ? <mesh key={i} position={[-0.16 + g * 0.2 + j * 0.032, 0, 0]} scale={[1, k, 1]}><planeGeometry args={[0.011, 0.11]} /><meshStandardMaterial map={chalkTex()} transparent alphaTest={0.05} roughness={1} /></mesh>
            : <mesh key={i} position={[-0.16 + g * 0.2 + 0.048, 0, 0.001]} rotation={[0, 0, 1.0]} scale={[k, 1, 1]}><planeGeometry args={[0.16, 0.011]} /><meshStandardMaterial map={chalkTex()} transparent alphaTest={0.05} roughness={1} /></mesh>; })}
      </group>
      {/* el hombre de espaldas: silueta gris de saco */}
      <group position={[-0.32, 0, 0.45]}>
        <mesh position={[0, 1.12, 0]} scale={[1, 1, 0.55]}><capsuleGeometry args={[0.2, 0.45, 8, 24]} /><meshPhysicalMaterial map={flannelTex()} roughness={0.95} /></mesh>
        <mesh position={[0, 1.6, 0]}><sphereGeometry args={[0.1, 24, 18]} /><meshStandardMaterial color="#8a6a52" roughness={0.7} /></mesh>
      </group>
      <Sombra w={3} d={2} o={0.3} />
    </Esc>
  </Stage>;
};

// ============ 8 · contraste: baja la luz; la esfera blanca chica se sigue leyendo, la negra grande se apaga ============
export const Contraste: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), dim = win(t, w - 0.6, w + 0.6);
  const cam = camA(t, a, b, { p: [0, 0.18, 0.22], l: [0, 0, 0], fov: 30 }, { p: [0, 0.15, 0.18], l: [0, 0, 0], fov: 30 });
  return <Stage t={t} a={a} b={b} dim={0.6 + 0.3 * dim}>
    <Esc cam={cam} key1={[-0.4, 0.6, 0.5]} warm={1 - 0.75 * dim} env={0.55 - 0.4 * dim} exposure={1 - 0.3 * dim}>
      <Mesa w={0.8} d={0.5} />
      <group position={[-0.055, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}><Reloj k="diver" strap={0.06} /></group>
      <group position={[0.06, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><Reloj k="steel36" strap={0.06} /></group>
      {/* la lámpara de lectura sólo sobre la blanca: se lee sola */}
      <spotLight position={[0.06, 0.2, 0.05]} angle={0.25} penumbra={0.8} intensity={1.5 * dim} distance={0.5} color="#fff4e2" target-position={[0.06, 0, 0]} />
      <group position={[0.06, 0.011, 0.042]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh><ringGeometry args={[0.024, 0.026, 64]} /><meshBasicMaterial map={chalkTex()} transparent opacity={win(t, w, w + 0.4)} /></mesh>
      </group>
    </Esc>
  </Stage>;
};

// ============ 9 · hueso: la piel se vuelve transparente; el reloj baja de la mano al hueso de la muñeca ============
export const Hueso: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), xr = win(t, a + 0.3, a + 1.2), slide = win(t, w - 0.5, w + 0.3);
  const cam = camA(t, a, b, { p: [-0.03, 0.17, 0.22], l: [-0.03, 0, 0], fov: 28 }, { p: [-0.04, 0.13, 0.18], l: [-0.03, 0.005, 0], fov: 28 });
  return <Stage t={t} a={a} b={b} dim={0.65} tint="#bfe0ff">
    <Esc cam={cam} key1={[-0.3, 0.6, 0.5]} cool={1.4}>
      {/* antebrazo traslúcido + radio/cúbito + apófisis */}
      <Brazo cuff={-0.11} sleeve={-0.12} band={false} skinOp={1 - 0.72 * xr} />
      {[0.01, -0.01].map((z, i) => <mesh key={i} rotation={[0, 0, Math.PI / 2]} position={[-0.1, -0.004, z]}><cylinderGeometry args={[0.0055, 0.0065, 0.2, 16]} /><meshStandardMaterial color="#f0ead8" emissive="#bcd8ff" emissiveIntensity={0.35 * xr} roughness={0.5} /></mesh>)}
      <mesh position={[-0.012, 0.012, -0.012]}><sphereGeometry args={[0.009, 20, 16]} /><meshStandardMaterial color="#f0ead8" emissive="#bcd8ff" emissiveIntensity={0.6 * xr} roughness={0.5} /></mesh>
      {/* el reloj y su correa: de la mano (x=0.035) al hueso (x=-0.012) */}
      <group position={[lerp(0.047, 0, slide), 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.012, 0, 0]}><cylinderGeometry args={[0.0262, 0.0262, 0.017, 40, 1, true]} />{piel("banda", [86, 50, 26])}</mesh>
        <EnMuneca k="steel36" />
      </group>
      {/* flecha de tiza al hueso */}
      <group position={[-0.012, 0.085, 0]} rotation={[0, 0, 0]}>
        <mesh scale={[1, win(t, w, w + 0.4), 1]} position={[0, 0, 0]}><planeGeometry args={[0.003, 0.04]} /><meshBasicMaterial map={chalkTex()} transparent /></mesh>
        <mesh position={[0, -0.022, 0]} rotation={[0, 0, Math.PI]} scale={win(t, w + 0.3, w + 0.5)}><coneGeometry args={[0.006, 0.01, 3]} /><meshBasicMaterial color="#f4f1e8" /></mesh>
      </group>
    </Esc>
  </Stage>;
};

// ============ 10 · cajita: el padre tranviario en la vereda; la cajita de cartón con el boleto del 16 ============
const boleto = () => printTex("boleto16", 384, 160, "#e9dcb6", [["LINEA 16", 24, 52, 46, "#2c2a24", "900"], ["CORSA SEMPLICE · 1976", 24, 112, 26, "#2c2a24", "700"]], (g) => { g.strokeStyle = "#a33"; g.lineWidth = 4; g.strokeRect(6, 6, 372, 148); });
export const Cajita: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), arr = spr(t, a + 0.1, 0.7, 1.6), lid = spr(t, w + 0.1, 0.7, 1.4);
  const cam = camA(t, a, b, { p: [0.0, 0.28, 0.3], l: [0, 0.02, 0], fov: 30 }, { p: [0.02, 0.22, 0.2], l: [0, 0.03, 0], fov: 30 });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-0.5, 0.8, 0.5]}>
      <Mesa w={0.9} d={0.6} />
      <group position={[0, 0, (1 - arr) * 0.4]} rotation={[0, (1 - arr) * 0.6, 0]}>
        <Blob w={0.14} d={0.12} o={0.5} />
        <RBox s={[0.08, 0.035, 0.07]} r={0.002} p={[0, 0.0175, 0]}><meshStandardMaterial color="#b89a72" roughness={0.9} /></RBox>
        {/* cinta y boleto doblado bajo la cinta */}
        <group position={[0, 0.0352 + lid * 0.022, -lid * 0.03]} rotation={[-lid * 0.45, 0, lid * 0.1]}>
          <RBox s={[0.084, 0.012, 0.074]} r={0.002}><meshStandardMaterial color="#c4a77e" roughness={0.9} /></RBox>
          <mesh position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.012, 0.074]} /><meshStandardMaterial color="#7a1d1d" roughness={0.6} /></mesh>
          <mesh position={[0.012, 0.0068, 0.01]} rotation={[-Math.PI / 2, 0, 0.25]}><planeGeometry args={[0.048, 0.02]} /><meshStandardMaterial map={boleto()} roughness={0.9} /></mesh>
        </group>
        {/* luz cálida desde adentro cuando se levanta la tapa */}
        <pointLight position={[0, 0.03, 0]} intensity={0.4 * lid} distance={0.15} color="#ffd9a0" />
        <mesh position={[0, 0.0356, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.07, 0.06]} /><meshBasicMaterial color="#ffe6bb" transparent opacity={0.5 * lid} /></mesh>
      </group>
    </Esc>
  </Stage>;
};

// ============ 11 · lista: la hoja de pedido del Dottore, 10 renglones; el 1 queda tapado por una muestra de tela ============
const hoja = (p: number) => canv("hojaD" + Math.round(p * 10), 600, 800, (g) => {
  g.fillStyle = "#f1ead8"; g.fillRect(0, 0, 600, 800);
  g.strokeStyle = "rgba(90,120,170,.35)"; g.lineWidth = 2; for (let y = 120; y < 800; y += 62) { g.beginPath(); g.moveTo(30, y); g.lineTo(570, y); g.stroke(); }
  g.fillStyle = "#1d2a4a"; g.font = `700 54px "${HAND}"`; g.fillText("Dott. Pellegatta", 40, 80);
  const n = Math.round(p * 10);
  for (let i = 0; i < n; i++) { g.font = `700 46px "${HAND}"`; g.fillText(`${i + 1}.`, 40, 166 + i * 62); g.fillStyle = "rgba(29,42,74,.55)"; g.fillRect(100, 150 + i * 62, 200 + 220 * rn(i, 3), 8); g.fillStyle = "#1d2a4a"; }
});
export const Lista: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), wr = win(t, a + 0.1, w - 0.4), cov = spr(t, w, 0.9, 1.5), ring = win(t, w + 0.3, w + 1.1);
  const cam = camA(t, a, b, { p: [0.0, 0.42, 0.18], l: [0, 0, 0], fov: 32 }, { p: [-0.02, 0.3, 0.1], l: [-0.03, 0, -0.04], fov: 30 });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-0.5, 1, 0.5]}>
      <Mesa w={1} d={0.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0.05]} position={[0, 0.002, 0]} receiveShadow><planeGeometry args={[0.21, 0.28]} /><meshStandardMaterial map={hoja(wr)} roughness={0.9} /></mesh>
      {/* muestra de franela que cae sobre el renglón 1 */}
      <group position={[-0.02, 0.004 + (1 - cl(cov)) * 0.12, -0.072]} rotation={[-Math.PI / 2, 0, 0.12 + (1 - cl(cov)) * 0.8]}>
        <mesh castShadow><planeGeometry args={[0.13, 0.04]} /><meshPhysicalMaterial map={flannelTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      </group>
      {/* el alfiler la clava + círculo de tiza roja alrededor del 1 */}
      <mesh position={[0.04, 0.012, -0.072]} rotation={[0.4, 0, 0]} scale={win(t, w + 0.2, w + 0.35)}><sphereGeometry args={[0.004, 16, 12]} /><meshStandardMaterial color="#c22" roughness={0.3} /></mesh>
      <mesh position={[-0.085, 0.004, -0.072]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.012, 0.0145, 48, 1, 0, 6.283 * ring]} /><meshBasicMaterial map={chalkTex("#d8342b")} transparent /></mesh>
    </Esc>
  </Stage>;
};
