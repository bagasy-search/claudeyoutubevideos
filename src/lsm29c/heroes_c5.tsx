// lsm29c · componentes únicos 25-29 (el regalo que no se compra, la tradición viaja, la caja con la carta, a las siete, lo que recuerdan).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Candle, Table, paperTex } from "./tg";
import { Envelope, Manger, Pine, Sheep, SnowGround, Suitcase, XSky, YellowPhone } from "./xg";

const PI = Math.PI;
const clockFace = () => tex.text("xclk5", 256, 256, (g) => { g.fillStyle = "#f6f1e4"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill(); g.fillStyle = "#2b2420"; g.font = "700 30px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; for (let i = 1; i <= 12; i++) g.fillText(String(i), 128 + 96 * Math.sin(i * PI / 6), 128 - 96 * Math.cos(i * PI / 6)); });

// ---- 20:55 · EL REGALO QUE NO SE COMPRA: la caja con moño se abre sola y adentro no hay un objeto: hay un reloj de bolsillo que late, con la tarjeta «your time» ----
export const HTimegift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.55}
  cam={{ at: [0, 0.12, 0], at1: [0.04, 0.22, 0.05], az: [-0.25, 0.05], el: [0.42, 0.3], r: [0.95, 0.7], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="TIME · NOBODY CAN BUY IT" col={AMB} size={44} />}>{(tt) => {
  const lid = eio(tt, 0.6, 1.5), rise = eio(tt, 1.4, 2.4);
  return <>
    <Table w={1.6} d={1.0} top={0.003} />
    {/* la caja: cuatro lados y la tapa que sube y se va hacia atrás */}
    <RBox s={[0.24, 0.13, 0.24]} r={0.004} p={[0, 0.065, 0]}><meshStandardMaterial color="#b52a22" roughness={0.5} side={THREE.DoubleSide} /></RBox>
    <mesh position={[0, 0.131, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.226, 0.226]} /><meshStandardMaterial color="#efe6d2" roughness={0.95} /></mesh>
    <group position={[0, 0.14 + 0.18 * lid, -0.18 * lid]} rotation={[-0.9 * lid, 0, 0.2 * lid]}>
      <RBox s={[0.25, 0.03, 0.25]} r={0.004}><meshStandardMaterial color="#b52a22" roughness={0.5} /></RBox>
      <RBox s={[0.03, 0.032, 0.252]} r={0.003}>{M.brass()}</RBox><RBox s={[0.252, 0.032, 0.03]} r={0.003}>{M.brass()}</RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.035, 0.03, 0]} rotation={[PI / 2, k * 0.5, 0]} scale={[1, 1, 0.5]}><torusGeometry args={[0.035, 0.01, 10, 24]} />{M.brass()}</mesh>)}
    </group>
    {/* el reloj de bolsillo que sube del papel de seda, con la cadena */}
    <group position={[0, 0.14 + 0.13 * rise, 0.0]} rotation={[-0.25 * rise, 0, 0]} scale={1 + 0.8 * rise} visible={lid > 0.3}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.016, 40]} />{M.brass()}</mesh>
      <mesh position={[0, 0, 0.0085]}><circleGeometry args={[0.052, 40]} /><meshStandardMaterial map={clockFace()} roughness={0.5} /></mesh>
      <group position={[0, 0, 0.01]} rotation={[0, 0, -tt * 1.2]}><RBox s={[0.003, 0.045, 0.002]} r={0.001} p={[0, 0.02, 0]}><meshStandardMaterial color="#1b1b1b" /></RBox></group>
      <group position={[0, 0, 0.011]} rotation={[0, 0, -tt * 0.1 - 1]}><RBox s={[0.005, 0.03, 0.002]} r={0.001} p={[0, 0.013, 0]}><meshStandardMaterial color="#1b1b1b" /></RBox></group>
      <mesh position={[0, 0.07, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.004, 8, 16]} />{M.brass()}</mesh>
    </group>
    <mesh position={[0, 0.25, 0]} visible={rise > 0.05}><sphereGeometry args={[0.12, 18, 12]} />{M.glow({ col: "#ffcf7a", op: 0.06 * rise })}</mesh>
    <mesh position={[0.19, 0.24, 0.0]} rotation={[-0.2, -0.3, 0]} scale={Math.max(0.01, phys(tt, 2.6, 6, 0.5))} visible={tt > 2.6}><planeGeometry args={[0.16, 0.088]} /><meshStandardMaterial map={paperTex("xyour", ["your time"], { w: 360, h: 200 })} roughness={0.85} /></mesh>
  </>; }}</Scene3D>;

// ---- 21:13 · LA TRADICIÓN VIAJA: la valija vieja se abre, adentro entran el pesebre, el cortante de galletas y el cuento; se cierra y arranca por la ruta nevada ----
export const HSuitcase: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2a2638" warm={0.85}
  cam={{ at: [0.05, 0.16, 0], at1: [0.4, 0.16, -0.36], az: [-0.2, 0.25], el: [0.6, 0.36], r: [1.45, 1.6], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="A TRADITION TRAVELS JUST FINE" col={AMB} size={42} />}>{(tt) => {
  const open = eio(tt, 0.2, 0.8) * (1 - eio(tt, 2.6, 3.1)), pack = cl((tt - 0.8) / 1.6), go = eio(tt, 3.2, 5.0);
  const it = (i: number) => eio(pack * 3 - i, 0, 1);
  return <>
    <XSky z={-5} y={1.0} />
    {/* el trineo de madera que la lleva por la ruta */}
    <group position={[lerp(0, 0.6, go), 0, lerp(0, -0.55, go)]} rotation={[0, -0.35 * go, 0]} scale={1.4}>
      {[-1, 1].map((k) => <RBox key={k} s={[0.62, 0.02, 0.02]} r={0.008} p={[0, 0.01, k * 0.16]}>{M.steel({ col: "#8a8f96" })}</RBox>)}
    </group>
    <SnowGround w={14} d={10} />
    {/* la ruta de campo con dos huellas de rueda */}
    <mesh position={[0, 0.006, -0.4]} rotation={[-PI / 2, 0, 0.35]}><planeGeometry args={[0.6, 9]} /><meshStandardMaterial color="#bfc7cf" roughness={0.9} /></mesh>
    {[-2.2, -1.5, 1.8, 2.6].map((x, i) => <Pine key={i} p={[x, 0, -1.4 - i * 0.3]} s={1.4} snow={1} />)}
    <group position={[lerp(0, 0.6, go), 0, lerp(0, -0.55, go)]} rotation={[0, -0.35 * go, 0]} scale={1.4}>
      <Suitcase p={[0, 0, 0]} open={open} />
      {/* lo que se lleva: el pesebre, el cortante de estrella y el libro de cuentos */}
      <group position={[-0.13, 0.1 + 0.3 * (1 - it(0)), 0]} visible={it(0) > 0.01 && open > 0.02}><Manger s={1.1} /></group>
      <mesh position={[0.02, 0.105 + 0.3 * (1 - it(1)), 0.04]} rotation={[-PI / 2, 0, 0]} visible={it(1) > 0.01 && open > 0.02}><torusGeometry args={[0.035, 0.004, 4, 5]} />{M.steel()}</mesh>
      <group position={[0.14, 0.11 + 0.3 * (1 - it(2)), -0.02]} visible={it(2) > 0.01 && open > 0.02}><RBox s={[0.13, 0.02, 0.17]} r={0.004}><meshStandardMaterial color="#2f5a3a" roughness={0.6} /></RBox><RBox s={[0.1, 0.003, 0.03]} r={0.001} p={[0, 0.011, -0.05]}>{M.brass()}</RBox></group>
    </group>
  </>; }}</Scene3D>;

// ---- 21:45 · LA CAJA CON LA CARTA: una sola caja de cartón; la carta sale, se despliega la historia de 1965 y los sobres salen volando, uno a cada nieto ----
const letterTex = () => tex.text("xletter", 512, 640, (g) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 512, 640); g.fillStyle = "#2b2a5a"; g.font = "italic 700 40px Georgia"; g.textAlign = "left";
  ["My dears,", "the night your", "grandpa asked me", "it was snowing on", "the church steps.", "December, 1965.", "", "Love, Grandma"].forEach((l, i) => g.fillText(l, 40, 80 + i * 70)); });
export const HLetterbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0.1, 0.18, 0.05], at1: [0.05, 0.22, 0], az: [-0.1, 0.12], el: [0.3, 0.3], r: [0.9, 1.15], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="EVERY ONE OF THEM READ IT" col={AMB} size={44} />}>{(tt) => {
  const up = eio(tt, 0.3, 1.3), fly = cl((tt - 1.8) / 2.4);
  const NAMES = ["Emily", "Daniel", "Sarah", "Ben", "Grace", "Luke"];
  return <>
    <Table w={1.8} d={1.0} top={0.003} />
    {/* la caja de cartón con las solapas abiertas */}
    <RBox s={[0.3, 0.16, 0.22]} r={0.004} p={[-0.1, 0.08, 0]}><meshStandardMaterial color="#b88d5c" roughness={0.95} side={THREE.DoubleSide} /></RBox>
    {[-1, 1].map((k) => <mesh key={k} position={[-0.1, 0.16, k * 0.11]} rotation={[k * -1.9, 0, 0]}><planeGeometry args={[0.3, 0.1]} /><meshStandardMaterial color="#a77b4c" roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
    {/* la carta: sale y se queda parada, legible */}
    <group position={[0.18, 0.03 + 0.24 * up, 0.08]} rotation={[-0.25 - (1 - up) * 1.3, -0.15, 0]}>
      <mesh><planeGeometry args={[0.34, 0.42]} /><meshStandardMaterial map={letterTex()} roughness={0.85} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* los sobres de cada nieto vuelan en abanico */}
    {NAMES.map((n, i) => { const g = eio(fly * 6 - i, 0, 1), a = -0.9 + i * 0.36;
      return <group key={i} visible={fly * 6 - i > 0.01}><Envelope p={[-0.1 + g * 0.65 * Math.sin(a), 0.12 + 0.3 * Math.sin(PI * g) + 0.02 * g, -0.1 * g - 0.25 * g * Math.cos(a)]} rot={[-PI / 2 + 0.6 * g, 0, a * g]} front={paperTex("xenv2" + n, [n], { w: 512, h: 224, font: "900" })} s={1.4} /></group>; })}
  </>; }}</Scene3D>;

// ---- 22:02 · A LAS SIETE: los escalones nevados de la iglesia bajo el farol; unas huellas suben solas hasta la puerta, y al lado aparece un segundo par, el del año que viene ----
export const HDoorseven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#141a2a" warm={0.35} key1={[0.6, 2.4, 1.6]}
  cam={{ at: [0, 0.3, 0.5], at1: [0, 0.45, 0.1], az: [0.3, 0.15], el: [0.5, 0.38], r: [1.65, 1.5], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="7:00 · SOMEBODY WILL COME NEXT YEAR" col={AMB} size={38} />}>{(tt) => {
  const s1 = cl((tt - 0.4) / 1.8), s2 = cl((tt - 2.4) / 1.8);
  const PTS: [number, number][] = [[0.014, 1.25], [0.014, 1.05], [0.014, 0.85], [0.014, 0.62], [0.166, 0.35], [0.326, 0.13], [0.486, -0.09]];
  const step = (i: number, side: number, k: number, pair: number) => k * 7 - i > 0 ? <group key={pair + "-" + i} position={[pair * 0.32, PTS[i][0], PTS[i][1]]}>{[-1, 1].map((f) => <group key={f} position={[f * 0.045, 0, f * 0.03]}><mesh position={[0, 0, -0.02]} rotation={[-PI / 2, 0, 0]} scale={[0.75, 1.25, 1]}><circleGeometry args={[0.03, 18]} /><meshStandardMaterial color="#2a3346" roughness={1} transparent opacity={cl((k * 7 - i) * 2)} /></mesh><mesh position={[0, 0, 0.032]} rotation={[-PI / 2, 0, 0]} scale={[0.75, 0.8, 1]}><circleGeometry args={[0.024, 16]} /><meshStandardMaterial color="#2a3346" roughness={1} transparent opacity={cl((k * 7 - i) * 2)} /></mesh></group>)}</group> : null;
  const li = Math.min(6, Math.floor(s2 * 7)), lp = PTS[li];
  return <>
    <mesh position={[0, 2, -3]}><planeGeometry args={[12, 6]} /><meshBasicMaterial color="#1c2440" /></mesh>
    <SnowGround w={10} d={8} />
    {/* la fachada blanca, la puerta roja con la corona y el farol */}
    <RBox s={[2.2, 1.6, 0.2]} r={0.01} p={[0, 0.8 + 0.48, -0.35]}><meshStandardMaterial color="#e8e6e0" roughness={0.8} /></RBox>
    <RBox s={[0.5, 0.8, 0.04]} r={0.01} p={[0, 0.48 + 0.4, -0.24]}><meshStandardMaterial color="#8f1d18" roughness={0.5} emissive="#2a0806" emissiveIntensity={0.3} /></RBox>
    <mesh position={[0, 1.08, -0.21]}><torusGeometry args={[0.08, 0.025, 10, 30]} /><meshStandardMaterial color="#2a5a3a" roughness={0.9} /></mesh>
    {[-0.55, 0.55].map((x) => <mesh key={x} position={[x, 1.1, -0.24]}><planeGeometry args={[0.24, 0.55]} />{M.glow({ col: "#ffcf7a", op: 0.2 + 0.75 * eio(tt, 2.6, 4.0) })}</mesh>)}
    {[-0.85, -0.3, 0.3, 0.85].map((x) => <mesh key={"u" + x} position={[x, 1.62, -0.24]}><planeGeometry args={[0.16, 0.3]} />{M.glow({ col: "#ffcf7a", op: 0.9 * eio(tt, 2.9 + Math.abs(x) * 0.6, 3.6 + Math.abs(x) * 0.6) })}</mesh>)}
    <pointLight position={[0, 1.0, 0.2]} intensity={0.2 + 1.6 * eio(tt, 2.6, 4.0)} distance={2.4} color="#ffc070" />
    {/* tres escalones nevados */}
    {[0, 1, 2].map((i) => <RBox key={i} s={[1.0, 0.16, 0.3 - i * 0.02]} r={0.01} p={[0, 0.08 + i * 0.16, 0.35 - i * 0.22]}><meshStandardMaterial color="#e9eef3" roughness={0.9} /></RBox>)}
    <group position={[0.9, 0, 0.3]}>
      <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.02, 0.025, 1.4, 10]} /><meshStandardMaterial color="#1b1b1b" roughness={0.5} /></mesh>
      <mesh position={[0, 1.45, 0]}><boxGeometry args={[0.12, 0.16, 0.12]} />{M.glow({ col: "#ffd890", op: 0.95 })}</mesh>
    </group>
    <pointLight position={[0.9, 1.4, 0.4]} intensity={1.4} distance={3} color="#ffd08a" />
    {/* el reloj de la torre en las siete */}
    <group position={[0, 1.85, -0.24]}>
      <mesh><circleGeometry args={[0.16, 40]} /><meshStandardMaterial map={clockFace()} roughness={0.6} emissive="#ffe0a0" emissiveIntensity={0.25} /></mesh>
      <RBox s={[0.012, 0.11, 0.004]} r={0.002} p={[0, 0.05, 0.005]}><meshStandardMaterial color="#1b1b1b" /></RBox>
      <group rotation={[0, 0, -PI * 2 * 7 / 12]}><RBox s={[0.016, 0.08, 0.004]} r={0.002} p={[0, 0.035, 0.006]}><meshStandardMaterial color="#1b1b1b" /></RBox></group>
    </group>
    {/* las huellas: un par solo, después el segundo */}
    {Array.from({ length: 7 }, (_, i) => step(i, 0, s1, -0.5))}
    {Array.from({ length: 7 }, (_, i) => step(i, 1, s2, 0.5))}
    {/* el farolito del segundo par, que acompaña la última huella */}
    <group position={[0.16 + 0.12, lp[0] + 0.32, lp[1] + 0.05]} visible={s2 > 0.02}>
      <mesh><boxGeometry args={[0.06, 0.09, 0.06]} />{M.glow({ col: "#ffd890", op: 0.95 * cl(s2 * 5) })}</mesh>
    </group>
    <pointLight position={[0.28, lp[0] + 0.4, lp[1] + 0.1]} intensity={1.6 * cl(s2 * 5)} distance={1.4} color="#ffd08a" />
    {/* copos lentos */}
    {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[-1.5 + 3 * rn(i, 2), 2.2 - ((tt * 0.25 + rn(i, 3)) % 1) * 2.2, -0.2 + 1.4 * rn(i, 4)]}><sphereGeometry args={[0.008, 6, 4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>)}
  </>; }}</Scene3D>;

// ---- 23:08 · LO QUE RECUERDAN: la casita de jengibre se apaga y se borra al fondo; adelante se encienden, de a uno, la vela pasada por el banco, el teléfono amarillo y la ovejita de la pata torcida ----
export const HRemember: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.5}
  cam={{ at: [0, 0.14, 0.05], at1: [0, 0.14, 0.1], az: [-0.1, 0.08], el: [0.3, 0.25], r: [1.25, 1.05], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="THE CANDLE · THE CALL · THE SHEEP" col={AMB} size={38} />}>{(tt) => {
  const fade = eio(tt, 0.6, 3.8), on = (i: number) => phys(tt, 1.2 + i * 0.9, 6, 0.5);
  return <>
    <Table w={2.0} d={1.0} top={0.003} />
    {/* la casita de jengibre, atrás, que se apaga (gris, transparente) */}
    <group position={[0, 0, -0.32]} visible={fade < 0.98} scale={1.5 * (1 - 0.25 * fade)}>
      <RBox s={[0.24, 0.14, 0.2]} r={0.004} p={[0, 0.07, 0]}><meshStandardMaterial color={new THREE.Color("#9c5a2c").lerp(new THREE.Color("#4a4440"), fade)} roughness={0.8} transparent opacity={1 - fade} /></RBox>
      {[-1, 1].map((k) => <RBox key={k} s={[0.26, 0.012, 0.15]} r={0.003} p={[0, 0.17, k * 0.05]} rot={[k * PI / 4, 0, 0]}><meshStandardMaterial color={new THREE.Color("#fbf7ee").lerp(new THREE.Color("#5a5450"), fade)} transparent opacity={1 - fade} /></RBox>)}
    </group>
    {/* 1. la vela con su protector de papel */}
    <group position={[-0.45, 0, 0.1]} scale={1.6 * (0.5 + 0.5 * cl(on(0)))}>
      <Candle p={[0, 0, 0]} tt={tt} on={cl(on(0))} h={0.16} />
      <mesh position={[0, 0.1, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 24]} /><meshStandardMaterial color="#f6f1e4" side={THREE.DoubleSide} /></mesh>
    </group>
    {/* 2. el teléfono amarillo, apoyado como recuerdo */}
    <group position={[0, 0.22, 0.08]} scale={0.95 * (0.5 + 0.5 * cl(on(1)))} rotation={[-0.25, 0, 0]}><YellowPhone p={[0, 0, 0]} lift={0} /></group>
    {/* 3. la ovejita de la pata torcida */}
    <group position={[0.45, 0, 0.12]} scale={0.5 + 0.5 * cl(on(2))}><Sheep s={3.4} ry={-0.5} crooked={0.5} /></group>
    {[-0.45, 0, 0.45].map((x, i) => <mesh key={i} position={[x, 0.007, 0.1]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.16, 32]} />{M.glow({ col: "#ffcf7a", op: 0.2 * cl(on(i)) })}</mesh>)}
    <pointLight position={[0, 0.5, 0.4]} intensity={0.5 + 1.5 * cl(on(2))} distance={2} color="#ffcf7a" />
  </>; }}</Scene3D>;
