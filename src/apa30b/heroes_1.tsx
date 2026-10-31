// apa30b · componentes únicos, minutos 0-7 (kit h3d + farmkit + bkit: objeto real con material, luz con motivo, cámara en curva).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, DigitDrum, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Rodent, Board, barnT, grassT } from "./farmkit";
import { TBucket, SodaCan, Ramp, MicePile, Bird, RIM, BR } from "./bkit";

const PI = Math.PI;

// ---- 0:04 · TREINTA Y UNO: miramos desde arriba el fondo del balde; los ratones aparecen de a uno y el tambor cuenta hasta 31 ----
export const HTally31: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#120f0b" key1={[-0.6, 1.8, 0.8]}
  cam={{ at: [0.06, 0.1, 0.04], az: [0.3, -0.1], el: [1.15, 0.95], r: [1.1, 0.9], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={940} txt="31 · ONE NIGHT · ALL ALIVE" col={AMB} />}>{(tt) => {
  const n = 31 * eio(tt, 0.4, 3.4);
  return <>
    <TBucket op={0.32} />
    <MicePile n={n} tt={tt} />
    <group position={[0.24, 0.36, 0.16]} rotation={[-1.1, 0, 0]}><DigitDrum v={Math.floor(n)} r={0.04} w={0.045} /></group>
    <pointLight position={[0, 0.7, 0.1]} intensity={1.4} distance={1.4} color="#ffe2b0" />
  </>;
}}</Scene3D>;

// ---- 0:21 · TODO EL EQUIPO: sobre el piso del granero llegan de a uno el balde, la lata, el rollo de alambre, la tabla y la cucharada ----
export const HKitList: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1.2, 2, 1.2]}
  cam={{ at: [0, 0.1, 0], az: [-0.25, 0.2], el: [0.55, 0.45], r: [1.75, 1.5], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={150} txt="THAT IS THE WHOLE KIT" col={TX} />}>{(tt) => {
  const d = (i: number) => (1 - cl(phys(tt, 0.3 + i * 0.45, 7, 0.45))) * 0.5;
  return <>
    <group position={[-0.45, d(0), -0.05]}><TBucket s={0.8} /></group>
    <group position={[-0.18, 0.035 + d(1), 0.05]}><SodaCan y={0} wire={false} /></group>
    <group position={[0.1, 0.01 + d(2), 0.05]}>{[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05 - i * 0.004, 0.0016, 6, 40]} />{M.steel()}</mesh>)}</group>
    <group position={[0.36, d(3), 0.1]}><Board s={[0.3, 0.02, 0.08]} p={[0, 0.01, 0]} rot={[0, 0.4, 0]} /></group>
    <group position={[0.5, 0.012 + d(4), 0.12]} scale={1.5}>
      <RBox s={[0.12, 0.008, 0.025]} p={[0.04, 0, 0]} r={0.004}>{M.steel()}</RBox>
      <mesh position={[-0.03, 0.006, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.028, 20, 12]} /><meshPhysicalMaterial color="#a8692e" roughness={0.55} clearcoat={0.3} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 2:18 · LA PARED DE 15 PULGADAS: el ratón salta pegado a la pared lisa, toca 12 pulgadas en la regla y vuelve a caer ----
export const HSmoothWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#14110d" key1={[-0.8, 1.4, 1.2]}
  cam={{ at: [0, 0.18, 0], az: [0.15, -0.15], el: [0.12, 0.08], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.8} x={560} y={930} txt="HE JUMPS 12 IN" col={TX} /><Tag tt={tt} at={3.0} x={1360} y={930} txt="THE WALL IS 15 IN" col={GRN} /></>}>{(tt) => {
  const jp = (tt * 0.9) % 1.6, up = jp < 1 ? Math.sin(jp * PI) : 0, jy = 0.27 * up * cl(tt - 0.6);
  return <>
    <TBucket op={0.28} />
    {/* regla de madera al costado, en pulgadas */}
    <RBox s={[0.03, RIM, 0.006]} p={[BR + 0.05, RIM / 2, 0.02]} r={0.002}><meshStandardMaterial map={tex.wood(1, 1, [214, 180, 110])} roughness={0.7} /></RBox>
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[BR + 0.04, i * RIM / 15, 0.024]}><boxGeometry args={[i % 3 === 0 ? 0.02 : 0.01, 0.002, 0.001]} /><meshBasicMaterial color="#2a1a0c" /></mesh>)}
    <mesh position={[0, 0.27, 0]}><boxGeometry args={[0.32, 0.002, 0.002]} /><meshBasicMaterial color="#ff8a5a" transparent opacity={0.7 * cl(tt - 1.6)} /></mesh>
    <Rodent p={[0.02, 0.006 + jy, 0]} rot={[-0.6 * up, PI / 2, 0]} s={0.7} walk={tt} />
  </>;
}}</Scene3D>;

// ---- 3:06 · DEL TRONCO A LA LATA: el viejo tronco con eje sobre el balde se achica y en su lugar queda la lata de gaseosa ----
export const HLogAxle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.3, 0], az: [0.55, 0.2], el: [0.4, 0.3], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={150} txt="A LOG ON AN AXLE → A SODA CAN" col={AMB} />}>{(tt) => {
  const m = eio(tt, 1.6, 2.8), spin = tt * 0.35;
  return <>
    <TBucket />
    {m < 1 && <group position={[0, RIM + 0.02, 0]} rotation={[spin * 2 * PI, 0, 0]} scale={1 - m}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.06, 0.3, 24]} /><meshStandardMaterial map={barnT()} color="#8a6440" roughness={1} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.151, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.002, 24]} /><meshStandardMaterial color="#c9a26a" roughness={0.9} /></mesh>)}
    </group>}
    <mesh position={[0, RIM + 0.02 - 0.044 * m, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.36, 8]} />{M.steel()}</mesh>
    {m > 0 && <group scale={m}><SodaCan spin={spin} wire={false} /></group>}
  </>;
}}</Scene3D>;

// ---- 3:24 · DOS AGUJEROS: la mecha entra por la pared del balde a una pulgada del borde, de un lado y del otro; el alambre los cruza ----
export const HDrillHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16120d" key1={[-0.6, 1.2, 1.4]}
  cam={{ at: [0, RIM - 0.04, 0], az: [-0.25, 0.25], el: [0.25, 0.18], r: [0.75, 0.6], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={930} txt="1 INCH BELOW THE RIM · DEAD ACROSS" col={TX} />}>{(tt) => {
  const d1 = eio(tt, 0.4, 1.2), d2 = eio(tt, 1.6, 2.4), w = eio(tt, 2.6, 3.6), y = RIM - 0.024;
  const bit = tt < 1.5 ? [-BR - 0.12 + 0.11 * d1, -1] : [BR + 0.12 - 0.11 * d2, 1];
  return <>
    <TBucket />
    {[d1, d2].map((d, i) => d > 0.6 && <mesh key={i} position={[(i ? 1 : -1) * (BR + 0.001), y, 0]} rotation={[0, 0, PI / 2]}><circleGeometry args={[0.004, 12]} /><meshBasicMaterial color="#000" side={THREE.DoubleSide} /></mesh>)}
    {tt < 2.6 && <group position={[bit[0], y, 0]} rotation={[0, 0, PI / 2]}>
      <mesh position={[0, -bit[1] * 0.06, 0]}><cylinderGeometry args={[0.004, 0.004, 0.12, 8]} />{M.chrome()}</mesh>
      <RBox s={[0.05, 0.12, 0.08]} p={[0, -bit[1] * 0.18, 0]} r={0.012}>{M.plastic({ col: "#d6a21a" })}</RBox>
    </group>}
    <mesh position={[0, y, 0]} rotation={[0, 0, PI / 2]} scale={[1, w, 1]}><cylinderGeometry args={[0.0016, 0.0016, 2 * BR + 0.03, 6]} />{M.steel()}</mesh>
    {/* marca de una pulgada con dos topes */}
    <mesh position={[-BR - 0.012, y + 0.012, 0.02]}><boxGeometry args={[0.002, 0.024, 0.002]} /><meshBasicMaterial color="#ff8a5a" transparent opacity={cl(tt - 0.8)} /></mesh>
  </>;
}}</Scene3D>;

// ---- 3:42 · UN SOLO TOQUE: el dedo roza la lata y gira suelta, con el brillo corriendo por el aluminio ----
export const HSpinTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#110f0c" key1={[-0.5, 1, 1.2]}
  cam={{ at: [0, RIM - 0.03, 0], az: [0.6, 0.35], el: [0.3, 0.2], r: [0.55, 0.45], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={930} txt="ONE TOUCH · IT SPINS FREE" col={GRN} />}>{(tt) => {
  const touch = eio(tt, 0.6, 1.0) * (1 - eio(tt, 1.1, 1.5)), sp = tt < 1 ? 0 : (1 - Math.exp(-(tt - 1) * 0.6)) * 3.2;
  return <>
    <TBucket />
    <SodaCan spin={sp} />
    <group position={[0.02, RIM + 0.06 - 0.025 * touch, 0.05]} rotation={[0.4, 0, 0]}>
      <mesh scale={[0.012, 0.045, 0.012]}><capsuleGeometry args={[1, 1, 6, 12]} /><meshStandardMaterial color="#d9a888" roughness={0.6} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 4:11 · UNA LÍNEA FINITA EN EL MEDIO: la manteca de maní se pinta en una banda en el centro; las puntas quedan limpias ----
export const HSmear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#15110c" key1={[-0.6, 1.2, 1.2]}
  cam={{ at: [0, RIM - 0.03, 0], az: [-0.4, -0.15], el: [0.32, 0.22], r: [0.5, 0.42], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={930} txt="THIN · RIGHT IN THE CENTER" col={AMB} />}>{(tt) => {
  const pb = eio(tt, 0.5, 2.2);
  return <>
    <TBucket />
    <SodaCan spin={0.08 * Math.sin(tt * 0.8)} pb={pb} />
    {/* cuchillo de untar que va y viene sobre la lata */}
    {tt < 2.5 && <group position={[0.02 * Math.sin(tt * 5), RIM + 0.02, 0.03]} rotation={[0.3, 0, 0.1]}>
      <RBox s={[0.02, 0.003, 0.11]} p={[0, 0, 0.05]} r={0.0015}>{M.steel()}</RBox>
      <RBox s={[0.022, 0.014, 0.08]} p={[0, 0.004, 0.14]} r={0.005}>{M.wood({ base: [120, 80, 46] })}</RBox>
    </group>}
  </>;
}}</Scene3D>;

// ---- 4:32 · LA RAMPA: la tabla rústica se apoya contra el borde y el ratón sube por ella hasta la lata ----
export const HRamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1, 1.8, 1.2]}
  cam={{ at: [0.15, 0.18, 0], az: [0.9, 0.55], el: [0.28, 0.2], r: [1.05, 0.88], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="ROUGH LUMBER · UP TO THE RIM" col={TX} />}>{(tt) => {
  const r = phys(tt, 0.3, 6, 0.5), up = eio(tt, 1.4, 3.6), len = 0.5, ang = 0.75;
  const x = BR + 0.36 - up * 0.36 * Math.cos(ang), y = up * 0.36 * Math.sin(ang);
  return <>
    <TBucket />
    <SodaCan pb={1} />
    <Ramp p={[BR + 0.37, 0, 0]} ang={ang} len={len} show={cl(r)} />
    {tt > 1.2 && <group position={[x, y + 0.012, 0]} rotation={[0, 0, -ang]}><Rodent rot={[0, -PI / 2, 0]} s={0.6} walk={tt * 1.2} /></group>}
  </>;
}}</Scene3D>;

// ---- 5:00 · UNA CONTRA MUCHAS: a la izquierda la trampa de resorte con su una sola presa por noche; a la derecha el balde que sigue juntando ----
export const HManyVsOne: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#12100c" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.1, 0], az: [0.1, -0.1], el: [0.75, 0.6], r: [1.25, 1.05], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.4} x={520} y={930} txt="1 A NIGHT" col={RED} /><Tag tt={tt} at={2.4} x={1400} y={930} txt="AS MANY AS COME" col={GRN} /></>}>{(tt) => {
  const snap = phys(tt, 0.8, 9, 0.4);
  return <>
    <group position={[-0.38, 0, 0]}>
      <RBox s={[0.09, 0.012, 0.2]} p={[0, 0.006, 0]} r={0.003}>{M.wood({ base: [190, 150, 96] })}</RBox>
      <mesh position={[0, 0.016, -0.03 + 0.06 * cl(snap)]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.035, 0.0018, 6, 30, PI]} />{M.steel()}</mesh>
      <mesh position={[0, 0.014, 0.05]}><boxGeometry args={[0.03, 0.004, 0.02]} /><meshStandardMaterial color="#d8c04a" metalness={0.6} roughness={0.4} /></mesh>
    </group>
    <group position={[0.32, 0, 0]}><TBucket op={0.32} s={0.95} /><MicePile n={4 + 20 * eio(tt, 1.0, 4.0)} tt={tt} /><SodaCan pb={0.8} spin={tt * 0.3} /></group>
  </>;
}}</Scene3D>;

// ---- 5:19 · SECO, NUNCA CON AGUA: el balde partido al medio; la mitad seca tiene paja y un ratón vivo, la mitad con agua se apaga ----
export const HDryWet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#101114" key1={[-0.7, 1.5, 1.2]}
  cam={{ at: [0, 0.14, 0], az: [0.05, -0.05], el: [0.45, 0.35], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.6} x={600} y={930} txt="DRY · ALIVE AT SUNUP" col={GRN} /><Tag tt={tt} at={2.6} x={1340} y={930} txt="NOT WATER" col={RED} /></>}>{(tt) => {
  const off = eio(tt, 2.4, 3.4);
  return <>
    <group position={[-0.21, 0, 0]}><TBucket op={0.3} s={0.85} />
      {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.18, 0.012 + rn(i, 2) * 0.012, (rn(i, 3) - 0.5) * 0.18]} rotation={[0, rn(i, 4) * PI, PI / 2]}><cylinderGeometry args={[0.0015, 0.0015, 0.06, 4]} /><meshStandardMaterial color="#d9bd72" roughness={1} /></mesh>)}
      <Rodent p={[0, 0.02, 0]} rot={[0, tt * 0.6, 0]} s={0.6} walk={tt} />
    </group>
    <group position={[0.21, 0, 0]}><TBucket op={0.3} s={0.85} />
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.11, 0.105, 0.11, 40]} />{M.water({ op: 0.5 - 0.3 * off })}</mesh>
    </group>
    <pointLight position={[-0.21, 0.5, 0.2]} intensity={1.2} distance={0.9} color="#ffd8a0" />
  </>;
}}</Scene3D>;

// ---- 5:41 · SE PUEDE SOLTAR: el balde se acuesta en el pasto y el gorrión que cayó de noche sale caminando y se va volando ----
export const HLetGo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f130d" key1={[-1.2, 2, 1]}
  cam={{ at: [0.1, 0.1, 0], az: [0.95, 0.6], el: [0.36, 0.28], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="SOMETHING ELSE FELL IN? LET IT GO" col={GRN} />}>{(tt) => {
  const tip = eio(tt, 0.3, 1.2), out = eio(tt, 1.4, 2.4), fly = cl((tt - 2.5) / 1.5);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
    <group rotation={[0, 0, -PI / 2 * tip]} position={[0, BR * tip, 0]}><TBucket /></group>
    <Bird p={[0.1 + 0.32 * out + 0.6 * fly, 0.0 + 0.05 * (1 - tip) + 0.6 * fly * fly, 0.0]} rot={[0, PI / 2, 0]} s={2.1} flap={fly > 0 ? 0.5 + 0.5 * Math.sin(tt * 30) : 0} />
  </>;
}}</Scene3D>;

// ---- 6:24 · SI TE VAS, SE DESARMA: la rampa se retira, la lata se saca del alambre y el balde queda boca abajo contra la pared ----
export const HAwayDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.2, 0], az: [-0.5, -0.2], el: [0.35, 0.28], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={150} txt="GONE A FEW DAYS? TAKE IT DOWN" col={AMB} />}>{(tt) => {
  const rp = eio(tt, 0.4, 1.2), cn = eio(tt, 1.3, 2.0), fl = eio(tt, 2.2, 3.2);
  return <>
    <group position={[0, RIM * fl * 1.02, 0]} rotation={[PI * fl, 0, 0]}><TBucket /></group>
    {cn < 1 && <group position={[0, 0.25 * cn, 0.2 * cn]}><SodaCan pb={1} /></group>}
    <group position={[0.2 * rp, 0, 0.3 * rp]}><Ramp p={[BR + 0.37, 0, 0]} ang={0.75 * (1 - rp)} /></group>
  </>;
}}</Scene3D>;
