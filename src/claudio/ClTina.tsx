// Kit del video cons6na (la línea AMARILLA de la tina). Un componente ÚNICO por minuto, ninguno repetido, sin rótulos de esquina.
//   TbTub3D       la tina acrílica en 3D vista de 3/4: mitad izquierda con el cerco amarillo, mitad derecha blanca (cuadro 0 = miniatura)
//   TbLayers3D    corte de la pared de la tina: grasa / jabón / sarro se despegan en el aire; el sarro se tiñe de hierro
//   TbLedger412   la libreta del gerente: «cambio de tina, suite 412» se escribe, se tacha y entra el sello «SE SALVÓ»
//   TbKnock       los nudillos golpean dos bordes en corte: acrílica hueca (onda ancha) vs esmaltada llena (onda corta)
//   TbCotton      el algodón frota la línea, y dos algodones contra la ventana: amarillo = sale · limpio = es el material
//   TbHeatJar     la taza medidora con vinagre: el termómetro sube a «caliente, sin hervir», las moléculas se aceleran, vapor
//   TbSprayFill   el rociador en corte se llena mitad vinagre / mitad detergente y se gira despacio (sacudir = espuma ✗)
//   TbHourglass   reloj de arena de 30 min: arena amarilla arriba, cae BLANCA abajo; la taza de café humea al lado
//   TbCompress3D  la pared curva de la tina: tiras de papel caen con peso, se pegan a la curva, se mojan y el film las tapa
//   TbScratchLens la lupa recorre el acrílico: frotado con polvo = rayas con mugre · compresa quieta = liso
//   TbBookTub     el libro baja sobre el borde de la tina y se abre en la página REAL; QR al costado
//   TbEnamelRust  el esmalte bajo la llave: mancha naranja de óxido, pasta de bicarbonato en círculos, la pómez mojada
//   TbSpongeScale la balanza: esponja verde + polvo + lana de acero contra esponja blanca + microfibra → se inclina a «no raya»
//   TbFiveKeys    cinco llaveros de habitación en el tablero de conserjería; se dan vuelta los errores
//   TbRoutine     la hoja de servicio del carrito con los 6 pasos y su tiempo; el reloj suma «una tarde»
//   TbNeverPour   la botella de cloro se inclina hacia el vinagre y la mano de guante azul la frena: NUNCA
//   TbWipeTimer   la tina vista desde arriba: el trapo recorre la línea del agua mientras el arco de 30 s se cierra
//   TbTileFlip    repaso: azulejos amarillentos que giran uno a uno a blanco, cada uno con su paso
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Contact, RoomLight, Stamp, Card, KeyTag, Tape, lin, pop, useOut } from "./ClParts";
import { manoCam } from "../kits/camara/CamaraMano";

const YEL = "#E2B33C", YELD = "#C98B2A", RUST = "#C8642A", ACR = "#FBFAF6";
const Cam: React.FC<{ pos: THREE.Vector3; target: THREE.Vector3; roll: number }> = ({ pos, target, roll }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.rotateZ(roll); camera.updateProjectionMatrix(); return null;
};
const Tag: React.FC<{ x: number; y: number; text: string; k: number; left?: boolean; color?: string; size?: number }> = ({ x, y, text, k, left, color = CL.navy, size = 40 }) => {
  const w = text.length * size * 0.56 + 50; const x0 = Math.max(50, Math.min(1870 - w, left ? x - w : x));
  return (
  <div style={{ position: "absolute", left: x0, top: y, translate: "0% -50%", opacity: clamp01(k), scale: String(0.85 + 0.15 * clamp01(k)), background: color, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: size, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${CL.shadow}`, borderBottom: `4px solid ${CL.yellow}` }}>{text}</div>
  );
};
const Tick: React.FC<{ ok: boolean; s?: number; k?: number }> = ({ ok, s = 70, k = 1 }) => (
  <svg width={s} height={s} viewBox="0 0 70 70" style={{ overflow: "visible" }}>
    {ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" strokeDasharray={90} strokeDashoffset={90 * (1 - clamp01(k))} />
      : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - clamp01(k))} />}
  </svg>
);
// cámara de mano 2.5D compartida (curva, nunca lineal): envuelve la escena
const Hand2D: React.FC<{ seed: number; children: React.ReactNode; push?: [number, number] }> = ({ seed, children, push = [1.0, 1.05] }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const m = manoCam(f / fps, 1, seed);
  const z = interpolate(f, [0, T], push, { easing: Easing.inOut(Easing.cubic), extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `translate(${m.x}px, ${m.y}px) rotate(${m.roll * 0.6}deg) scale(${z})` }}>{children}</AbsoluteFill>;
};

// ═════════════════════════════ 1 · la tina en 3D (cuadro 0)
const tubProfile = (rx = 1, depth = 0.62) => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 28; i++) { const t = i / 28; pts.push(new THREE.Vector2(0.02 + rx * Math.sin(t * Math.PI / 2) ** 0.55, -depth * Math.cos(t * Math.PI / 2) ** 0.8)); }
  pts.push(new THREE.Vector2(rx + 0.12, 0.0)); pts.push(new THREE.Vector2(rx + 0.12, -0.05));
  return pts;
};
const WATER_Y = -0.2;
// radio interior a la altura y (sigue el perfil)
const rAt = (y: number) => { const pr = tubProfile(); for (let i = 1; i < pr.length; i++) if (pr[i].y >= y) return pr[i].x; return 1; };
export const TbTub3D: React.FC<{ labels?: boolean; bed?: string; still?: boolean }> = ({ labels = false, bed, still = false }) => {
  const f = useCurrentFrame(); const { width, height, fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const m = manoCam(f / fps, still ? 0.4 : 1, 77);
  const target = new THREE.Vector3(0, -0.25, 0);
  const a = -0.55 + interpolate(f, [0, T], [0, 0.22], { easing: Easing.inOut(Easing.cubic) }) + (m.pan * Math.PI) / 180;
  const dist = interpolate(f, [0, T], [4.1, 3.6], { easing: Easing.inOut(Easing.sin) });
  const camPos = new THREE.Vector3(Math.sin(a) * dist, 2.35 + m.tilt * 0.02, Math.cos(a) * dist);
  const mats = useMemo(() => ({
    acr: new THREE.MeshPhysicalMaterial({ color: ACR, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.06, side: THREE.DoubleSide }),
    ring: new THREE.MeshStandardMaterial({ color: YEL, roughness: 0.75, transparent: true, opacity: 0.92, side: THREE.DoubleSide }),
    ring2: new THREE.MeshStandardMaterial({ color: YELD, roughness: 0.8, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
    tile: new THREE.MeshStandardMaterial({ color: "#EAE3D6", roughness: 0.5 }),
    grout: new THREE.MeshStandardMaterial({ color: "#CFC5B4", roughness: 0.9 }),
    floor: new THREE.MeshStandardMaterial({ color: "#D9D2C4", roughness: 0.7 }),
    chrome: new THREE.MeshPhysicalMaterial({ color: "#EEF2F6", metalness: 0.4, roughness: 0.15, clearcoat: 1 }),
    water: new THREE.MeshPhysicalMaterial({ color: "#CFE6EE", roughness: 0.05, transparent: true, opacity: 0.18 }),
  }), []);
  const shell = useMemo(() => new THREE.LatheGeometry(tubProfile(), 96), []);
  // cerco: banda angosta del perfil a la altura del agua · mitad IZQUIERDA (phi π→2π) amarilla
  const band = (h: number, th: number) => { const pts = [new THREE.Vector2(rAt(WATER_Y - th) - 0.004, WATER_Y - th), new THREE.Vector2(rAt(WATER_Y + h) - 0.004, WATER_Y + h)]; return pts; };
  const ringG = useMemo(() => new THREE.LatheGeometry(band(0.035, 0.03), 64, Math.PI, Math.PI), []);
  const haloG = useMemo(() => new THREE.LatheGeometry(band(0.075, 0.07), 64, Math.PI, Math.PI), []);
  const shine = ((f % 90) / 90) * 2.6 - 0.2;
  const proj = (v: THREE.Vector3) => { const c = new THREE.PerspectiveCamera(34, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height }; };
  const L = proj(new THREE.Vector3(-1.0 * 1.75, WATER_Y, 0.15)), R = proj(new THREE.Vector3(1.0 * 1.75, WATER_Y, 0.15));
  const kl = labels ? pop(f, fps, 14) : 0, kr = labels ? pop(f, fps, 34) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, backgroundColor: CL.white }}>
      {bed ? <Bed src={bed} seed={41} dim={0.4} /> : null}
      <div style={{ position: "absolute", inset: 0, translate: `${m.x}px ${m.y}px` }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
          <Cam pos={camPos} target={target} roll={(m.roll * Math.PI) / 180} />
          <ambientLight intensity={0.7} />
          <hemisphereLight args={["#FFFFFF", "#BFB39C", 0.6]} />
          <directionalLight position={[-3, 6, 3]} intensity={1.25} color="#FFF1DC" />
          <directionalLight position={[3, 2.5, 4]} intensity={0.4} />
          <pointLight position={[shine, 0.6, 0.6]} intensity={2.4} distance={1.8} color="#FFFFFF" />
          {/* piso y pared de azulejo */}
          <mesh material={mats.floor} position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[12, 12]} /></mesh>
          <mesh material={mats.tile} position={[0, 0.9, -1.25]}><boxGeometry args={[8, 3.4, 0.08]} /></mesh>
          {Array.from({ length: 9 }, (_, i) => <mesh key={"gv" + i} material={mats.grout} position={[-3.6 + i * 0.9, 0.9, -1.2]}><boxGeometry args={[0.02, 3.4, 0.01]} /></mesh>)}
          {Array.from({ length: 4 }, (_, i) => <mesh key={"gh" + i} material={mats.grout} position={[0, -0.3 + i * 0.9, -1.2]}><boxGeometry args={[8, 0.02, 0.01]} /></mesh>)}
          {/* faldón del frente */}
          <mesh material={mats.acr} position={[0, -0.36, 0.0]} scale={[1.75, 1, 1]}><cylinderGeometry args={[1.12, 1.12, 0.68, 96, 1, true]} /></mesh>
          <group scale={[1.75, 1, 1]}>
            <mesh geometry={shell} material={mats.acr} />
            <mesh geometry={haloG} material={mats.ring2} />
            <mesh geometry={ringG} material={mats.ring} />
            <mesh material={mats.water} position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.55, 48]} /></mesh>
          </group>
          {/* llave contra la pared */}
          <group position={[0, 0.25, -1.13]}>
            <mesh material={mats.chrome}><cylinderGeometry args={[0.07, 0.07, 0.18, 30]} /></mesh>
            <mesh material={mats.chrome} position={[0, 0.0, 0.18]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.05, 0.36, 24]} /></mesh>
          </group>
        </ThreeCanvas>
      </div>
      {labels ? <>
        <Tag x={L.x - 30} y={L.y - 150} text="así estaba" k={kl} left />
        <Tag x={R.x + 30} y={R.y - 150} text="así quedó" k={kr} />
      </> : null}
      <RoomLight k={0.8} />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 2 · las tres capas (3D)
export const TbLayers3D: React.FC<{ bed?: string; stage?: number }> = ({ bed, stage = 0 }) => {
  const f = useCurrentFrame(); const { width, height, fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const m = manoCam(f / fps, 0.8, 52);
  const target = new THREE.Vector3(0, 0.45, 0);
  const a = 0.55 - interpolate(f, [0, T], [0, 0.35], { easing: Easing.inOut(Easing.cubic) });
  const camPos = new THREE.Vector3(Math.sin(a) * 4.2, 2.3 + m.tilt * 0.02, Math.cos(a) * 4.2);
  // tiempos: grasa se levanta (T*0.12) · jabón (T*0.3) · sarro queda abajo y se tiñe (T*0.5→0.8)
  const lift = (at: number) => { const s = pop(f, fps, at, 11); return s; };
  const g = stage > 1 ? 1 : stage === 1 ? lift(14) : lift(Math.round(T * 0.1));
  const j = stage > 2 ? 1 : stage === 2 ? lift(12) : stage === 1 ? 0 : lift(Math.round(T * 0.28));
  const iron = stage === 3 ? ease(clamp01((f - 20) / (T * 0.5))) : stage ? 0 : ease(clamp01((f - T * 0.5) / (T * 0.3)));
  const kS = stage === 3 ? lin(f, 4, 14) : stage ? 0.35 : lin(f, T * 0.45, T * 0.55);
  const mats = useMemo(() => ({
    tub: new THREE.MeshPhysicalMaterial({ color: ACR, roughness: 0.18, clearcoat: 1 }),
    scale: new THREE.MeshStandardMaterial({ color: "#EFEBE0", roughness: 1 }),
    soap: new THREE.MeshPhysicalMaterial({ color: "#F4F1E6", roughness: 0.35, transparent: true, opacity: 0.62, clearcoat: 0.6 }),
    fat: new THREE.MeshPhysicalMaterial({ color: "#E7C66B", roughness: 0.08, transparent: true, opacity: 0.7, clearcoat: 1 }),
  }), []);
  (mats.scale.color as THREE.Color).set(new THREE.Color("#EFEBE0").lerp(new THREE.Color(YELD), iron * 0.85));
  const slab = (h: number) => new THREE.BoxGeometry(2.6, h, 1.4, 1, 1, 1);
  const gTub = useMemo(() => slab(0.45), []), gS = useMemo(() => slab(0.14), []), gJ = useMemo(() => slab(0.1), []), gG = useMemo(() => slab(0.08), []);
  // grumos del sarro (piedra) y gotitas de grasa
  const lumps = useMemo(() => Array.from({ length: 60 }, (_, i) => ({ x: (rnd(i) - 0.5) * 2.4, z: (rnd(i + 99) - 0.5) * 1.25, s: 0.04 + rnd(i + 7) * 0.05 })), []);
  const yS = 0.07 + 0.07, yJ = yS + 0.12 + j * 0.55, yG = yJ + 0.09 + g * 0.6 + j * 0.0;
  const proj = (v: THREE.Vector3) => { const c = new THREE.PerspectiveCamera(32, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height }; };
  const pG = proj(new THREE.Vector3(1.35, yG, 0)), pJ = proj(new THREE.Vector3(1.35, yJ, 0)), pS = proj(new THREE.Vector3(1.35, yS, 0)), pT = proj(new THREE.Vector3(-1.35, -0.2, 0));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={52} dim={0.5} />
      <div style={{ position: "absolute", inset: 0, translate: `${m.x}px ${m.y}px` }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
          <Cam pos={camPos} target={target} roll={(m.roll * Math.PI) / 180} />
          <ambientLight intensity={0.75} />
          <hemisphereLight args={["#FFFFFF", "#BDB29E", 0.55]} />
          <directionalLight position={[-2, 6, 4]} intensity={1.2} color="#FFF0D8" />
          <directionalLight position={[3, 2, 3]} intensity={0.5} />
          <mesh geometry={gTub} material={mats.tub} position={[0, -0.225, 0]} />
          <mesh geometry={gS} material={mats.scale} position={[0, 0.07, 0]} />
          {lumps.map((l, i) => <mesh key={i} material={mats.scale} position={[l.x, 0.15, l.z]} scale={[l.s * 1.4, l.s * 0.7, l.s * 1.4]}><sphereGeometry args={[1, 8, 6]} /></mesh>)}
          <mesh geometry={gJ} material={mats.soap} position={[0, yJ, 0]} />
          <mesh geometry={gG} material={mats.fat} position={[0, yG, 0]} />
        </ThreeCanvas>
      </div>
      <Tag x={pG.x + 40} y={pG.y} text="1 · grasa de la piel" k={g} color={YELD} />
      <Tag x={pJ.x + 40} y={pJ.y} text="2 · jabón" k={j} />
      <Tag x={pS.x + 40} y={pS.y + 10} text={iron > 0.5 ? "3 · sarro + hierro" : "3 · sarro (piedra)"} k={kS} color={iron > 0.5 ? RUST : CL.navy} />
      <Tag x={pT.x - 40} y={pT.y} text="la tina" k={lin(f, 4, 16)} left color={CL.inkSoft} size={34} />
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 3 · la libreta del gerente
export const TbLedger412: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const lines = ["Suite 412:", "cambio de tina", "romper revestimiento", "1 semana cerrada"];
  const wr = (i: number) => clamp01((f - 8 - i * 16) / 18); // escritura letra a letra
  const cross = ease(clamp01((f - T * 0.58) / 12));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={63} dim={0.3} />
      <Hand2D seed={63} push={[1.02, 1.08]}>
        <div style={{ position: "absolute", left: "50%", top: "52%", translate: `-50% ${-50 + (1 - p) * 60}%`, rotate: `${-4 + 2 * p}deg`, width: 1000, height: 760, transform: "perspective(1600px) rotateX(14deg)" }}>
          {/* tapa negra + hoja rayada */}
          <div style={{ position: "absolute", inset: -18, background: "#1D1E22", borderRadius: 18, boxShadow: `0 40px 80px ${CL.shadow}` }} />
          <div style={{ position: "absolute", inset: 0, background: "#FFFDF6", borderRadius: 6, backgroundImage: "repeating-linear-gradient(#FFFDF6 0 70px, #B9CBE4 70px 72px)", backgroundPosition: "0 40px" }} />
          <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, width: 3, background: "#E59A9A" }} />
          <div style={{ position: "absolute", left: 150, top: 72, fontFamily: HAND, fontSize: 70, color: "#23314F", lineHeight: "72px" }}>
            {lines.map((l, i) => {
              const n = Math.round(l.length * wr(i));
              return <div key={i} style={{ position: "relative", whiteSpace: "nowrap" }}>{l.slice(0, n)}
                {i === 1 && cross > 0 ? <svg style={{ position: "absolute", left: -10, top: 20, overflow: "visible" }} width={560} height={40}><path d="M0 22 C 120 8, 300 34, 540 14" stroke={CL.red} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - cross)} /></svg> : null}
              </div>;
            })}
          </div>
          <div style={{ position: "absolute", right: 60, bottom: 60, fontFamily: HAND, fontSize: 46, color: CL.inkSoft, opacity: lin(f, 30, 44) }}>1998</div>
        </div>
        <Stamp text="se salvó" at={Math.round(T * 0.72)} color={CL.navy} x="66%" y="64%" rot={-12} size={74} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 4 · los nudillos
export const TbKnock: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const side = (x: number, hollow: boolean, t0: number) => {
    const p = pop(f, fps, t0 - 10, 14);
    const hits = [t0, t0 + 14];
    const knuckle = hits.reduce((acc, h) => acc + Math.max(0, 1 - Math.abs(f - h) / 5), 0);
    const waves = hits.flatMap((h) => [0, 1, 2].map((k) => ({ h: h + k * (hollow ? 6 : 3), k })));
    const label = lin(f, t0 + 20, t0 + 32);
    return (
      <div key={x} style={{ position: "absolute", left: x, top: 220, width: 760, height: 640, opacity: p, translate: `0 ${(1 - p) * 40}px` }}>
        {/* corte del borde */}
        <svg width={760} height={520} viewBox="0 0 760 520" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id={`ed${x}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E4DED2" /></linearGradient>
            <linearGradient id={`fe${x}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6E737A" /><stop offset="1" stopColor="#3D4248" /></linearGradient>
          </defs>
          {hollow ? <>
            <path d="M120 120 Q120 60 200 60 L640 60 L640 92 L210 92 Q152 92 152 140 L152 480 L120 480 Z" fill={`url(#ed${x})`} stroke="#CFC8BA" strokeWidth={3} />
            <text x={400} y={300} textAnchor="middle" fontFamily={LABEL} fontSize={34} fill={CL.inkSoft} letterSpacing={3}>AIRE</text>
          </> : <>
            <path d="M120 120 Q120 60 200 60 L640 60 L640 92 L210 92 Q152 92 152 140 L152 480 L120 480 Z" fill="#FFFFFF" stroke="#CFC8BA" strokeWidth={3} />
            <path d="M152 140 Q152 92 210 92 L640 92 L640 200 L270 200 Q250 200 250 230 L250 480 L152 480 Z" fill={`url(#fe${x})`} />
          </>}
          {/* ondas de sonido */}
          {waves.map(({ h, k }, i) => {
            const t = (f - h) / (hollow ? 26 : 12); if (t < 0 || t > 1) return null;
            const r = (hollow ? 60 + 320 * t : 40 + 130 * t), wob = hollow ? Math.sin((f - h) * 0.9) * 10 : 0;
            return <ellipse key={i} cx={130} cy={120} rx={r + wob} ry={(r + wob) * 0.8} fill="none" stroke={hollow ? CL.nitrile : CL.navy} strokeWidth={hollow ? 7 - 4 * t : 9 - 6 * t} opacity={(1 - t) * (1 - k * 0.25)} />;
          })}
        </svg>
        {/* puño */}
        <div style={{ position: "absolute", left: -10, top: 0, translate: `${-30 + knuckle * 34}px ${-20 + knuckle * 30}px`, rotate: "-18deg", width: 120, height: 92, borderRadius: "46px 46px 40px 40px", background: `linear-gradient(160deg, #6FA3EA, ${CL.nitrile})`, boxShadow: `0 12px 24px ${CL.shadow}, inset 0 6px 0 rgba(255,255,255,0.35)` }}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 14 + i * 24, top: 52, width: 22, height: 30, borderRadius: 11, background: "rgba(0,0,0,0.12)" }} />)}
        </div>
        <div style={{ position: "absolute", left: 120, top: 540, opacity: label, display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>{hollow ? "Acrílica" : "Esmaltada"}</div>
          <div style={{ fontFamily: LABEL, fontSize: 34, color: hollow ? CL.nitrile : CL.navy, letterSpacing: 2 }}>{hollow ? "HUECA · TIBIA" : "LLENA · FRÍA"}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={74} dim={0.55} />
      <Hand2D seed={74}>
        {side(110, true, 18)}
        {side(1010, false, Math.round(T * 0.45))}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 5 · la prueba del algodón
const Cotton: React.FC<{ stain: number; size?: number }> = ({ stain, size = 300 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id={`ct${Math.round(stain * 100)}`} cx="0.45" cy="0.4" r="0.7"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E9E6DE" /></radialGradient>
      <filter id="cfz"><feTurbulence baseFrequency="0.6" numOctaves={2} seed={4} /><feDisplacementMap in="SourceGraphic" scale={4} /></filter>
    </defs>
    <circle cx={50} cy={50} r={44} fill={`url(#ct${Math.round(stain * 100)})`} filter="url(#cfz)" />
    <ellipse cx={46} cy={58} rx={30} ry={13} fill={YELD} opacity={0.75 * stain} filter="url(#cfz)" />
    <ellipse cx={50} cy={60} rx={20} ry={7} fill="#9B5A22" opacity={0.45 * stain} />
  </svg>
);
export const TbCotton: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const rubEnd = Math.round(T * 0.38);
  const rub = clamp01(f / rubEnd), sw = Math.sin(rub * Math.PI * 11);
  const lift = ease(clamp01((f - rubEnd) / 18));
  const glow = lin(f, rubEnd, rubEnd + 20);
  const sA = clamp01(rub * 1.1), kOk = lin(f, rubEnd + 26, rubEnd + 40), kNo = lin(f, rubEnd + 48, rubEnd + 62);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: "#F6F1E7" }}>
      <Bed src={bed} seed={85} dim={0.35} />
      {/* la ventana que se enciende detrás */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, rgba(255,250,232,${0.95 * glow}) 0%, rgba(255,250,232,${0.6 * glow}) 35%, rgba(255,250,232,0) 70%)` }} />
      <Hand2D seed={85} push={[1.0, 1.06]}>
        {/* la franja amarilla de la tina (abajo) */}
        <div style={{ position: "absolute", left: 160, right: 160, top: 760, height: 150, borderRadius: 30, background: ACR, boxShadow: "inset 0 -14px 28px rgba(0,0,0,0.06)", opacity: 1 - lift * 0.85 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 54, height: 34, background: `linear-gradient(90deg, ${hexA(YEL, 0.9)}, ${hexA(YELD, 0.85)}, ${hexA(YEL, 0.9)})`, filter: "blur(2px)" }} />
        </div>
        {/* algodón que frota → sube al centro izquierda */}
        <div style={{ position: "absolute", left: interpolate(lift, [0, 1], [860 + sw * 260, 470]), top: interpolate(lift, [0, 1], [700, 250]), translate: "-50% 0" }}>
          <Cotton stain={sA} />
          <div style={{ position: "absolute", left: 300, top: 110, opacity: kOk }}><Tick ok k={kOk} /></div>
          <div style={{ marginTop: 18, textAlign: "center", fontFamily: LABEL, fontSize: 40, color: CL.ink, letterSpacing: 2, opacity: kOk }}>AMARILLO = SALE</div>
        </div>
        {/* el segundo algodón (limpio) */}
        <div style={{ position: "absolute", left: 1450, top: interpolate(lift, [0, 1], [1200, 250]), translate: "-50% 0" }}>
          <Cotton stain={0} />
          <div style={{ position: "absolute", left: 300, top: 110, opacity: kNo }}><Tick ok={false} k={kNo} /></div>
          <div style={{ marginTop: 18, textAlign: "center", fontFamily: LABEL, fontSize: 40, color: CL.ink, letterSpacing: 2, opacity: kNo }}>LIMPIO = ES EL MATERIAL</div>
        </div>
        <div style={{ position: "absolute", left: "50%", top: 120, translate: "-50% 0", fontFamily: HAND, fontSize: 64, color: CL.navy, opacity: lin(f, 4, 16) * (1 - lift) }}>5 o 6 pasadas, fuerte</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 6 · el vinagre caliente
export const TbHeatJar: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const heat = ease(clamp01((f - 14) / (T * 0.5)));
  const temp = 20 + heat * 45; // nunca 100
  const mol = useMemo(() => Array.from({ length: 34 }, (_, i) => ({ x: rnd(i * 3), y: rnd(i * 3 + 1), ph: rnd(i * 3 + 2) * 6.28 })), []);
  const tt = f / fps; const sp = 0.4 + heat * 3.4;
  const thY = (t: number) => 600 - (t / 100) * 480;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={96} dim={0.38} />
      <Hand2D seed={96}>
        <Contact x={760} y={905} w={620} o={0.35} />
        <div style={{ position: "absolute", left: 470, top: 300, width: 520, height: 600, translate: `0 ${(1 - p) * 80}px`, opacity: p }}>
          <svg width={620} height={620} viewBox="0 0 620 620" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs>
              <linearGradient id="glass" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,0.75)" /><stop offset="0.2" stopColor="rgba(255,255,255,0.15)" /><stop offset="0.8" stopColor="rgba(255,255,255,0.08)" /><stop offset="1" stopColor="rgba(255,255,255,0.6)" /></linearGradient>
              <linearGradient id="vin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`rgba(244,226,180,${0.55 + 0.2 * heat})`} /><stop offset="1" stopColor={`rgba(225,196,140,${0.7 + 0.2 * heat})`} /></linearGradient>
              <clipPath id="liq"><path d="M70 250 L450 250 L430 590 Q260 610 90 590 Z" /></clipPath>
            </defs>
            <path d="M70 250 L450 250 L430 590 Q260 610 90 590 Z" fill="url(#vin)" />
            <g clipPath="url(#liq)">{mol.map((q, i) => {
              const x = 90 + 340 * ((q.x + Math.sin(tt * sp + q.ph) * 0.06 * sp) % 1 + 1) % 1, y = 270 + 300 * ((q.y + Math.cos(tt * sp * 0.8 + q.ph) * 0.05 * sp) % 1 + 1) % 1;
              return <circle key={i} cx={x} cy={y} r={7} fill={heat > 0.5 ? "#E07B39" : "#7FA6D6"} opacity={0.75} />;
            })}</g>
            <path d="M50 120 L470 120 L440 600 Q260 625 80 600 Z" fill="url(#glass)" stroke="rgba(120,130,140,0.6)" strokeWidth={4} />
            <path d="M470 180 Q560 200 550 330 Q540 420 450 430" fill="none" stroke="rgba(120,130,140,0.55)" strokeWidth={18} />
            {[0, 1, 2, 3].map((i) => <g key={i}><line x1={90} x2={140} y1={560 - i * 90} y2={560 - i * 90} stroke="#E25B4B" strokeWidth={4} /><text x={150} y={566 - i * 90} fontFamily={LABEL} fontSize={26} fill="#E25B4B">{`${i + 1}/4`}</text></g>)}
            {/* vapor */}
            {[0, 1, 2].map((i) => { const s = (tt * 0.7 + i / 3) % 1; return <path key={i} d={`M${200 + i * 70} 230 q 30 -40 0 -80 q -30 -40 0 -80`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={12} strokeLinecap="round" opacity={heat * (1 - s) * 0.85} transform={`translate(0 ${-s * 90})`} />; })}
          </svg>
        </div>
        {/* termómetro con la zona buena */}
        <div style={{ position: "absolute", left: 1220, top: 230, width: 300, height: 700, opacity: p }}>
          <svg width={300} height={700} viewBox="0 0 300 700" style={{ overflow: "visible" }}>
            <rect x={110} y={100} width={60} height={520} rx={30} fill="#FFFFFF" stroke="#BFC6CF" strokeWidth={5} />
            <rect x={116} y={thY(70)} width={48} height={thY(50) - thY(70)} fill={hexA(CL.yellow, 0.55)} />
            <rect x={116} y={thY(100) - 8} width={48} height={22} fill={hexA(CL.red, 0.35)} />
            <rect x={124} y={thY(temp)} width={32} height={620 - thY(temp)} rx={16} fill="#E25B4B" />
            <circle cx={140} cy={640} r={52} fill="#E25B4B" stroke="#BFC6CF" strokeWidth={5} />
            <text x={190} y={thY(60) + 12} fontFamily={LABEL} fontSize={34} fill={CL.ink}>CALIENTE</text>
            <text x={190} y={thY(100) + 12} fontFamily={LABEL} fontSize={34} fill={CL.red}>HIERVE ✗</text>
          </svg>
        </div>
        <div style={{ position: "absolute", left: 520, top: 170, fontFamily: HAND, fontSize: 66, color: CL.navy, opacity: lin(f, 10, 24) }}>1 minuto · microondas</div>
        <div style={{ position: "absolute", left: 470, top: 960, fontFamily: LABEL, fontSize: 40, letterSpacing: 2, color: CL.ink, opacity: lin(f, T * 0.6, T * 0.7) }}>CALIENTE DISUELVE LA PIEDRA EL DOBLE DE RÁPIDO</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 7 · el rociador mitad y mitad
export const TbSprayFill: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const a = ease(clamp01((f - 8) / (T * 0.25))), b = ease(clamp01((f - T * 0.3) / (T * 0.25)));
  const tilt = Math.sin(clamp01((f - T * 0.62) / (T * 0.3)) * Math.PI) * 28;
  const mix = clamp01((f - T * 0.66) / (T * 0.25));
  const H = 360, ya = 760 - H * 0.5 * a, yb = ya - H * 0.5 * b;
  const no = lin(f, T * 0.72, T * 0.8);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={107} dim={0.4} />
      <Hand2D seed={107}>
        <Contact x={760} y={800} w={460} />
        <div style={{ position: "absolute", left: 560, top: 180, width: 400, height: 640, rotate: `${tilt}deg`, transformOrigin: "50% 95%" }}>
          <svg width={400} height={640} viewBox="0 0 400 640" style={{ overflow: "visible" }}>
            <defs><clipPath id="bot"><path d="M90 300 Q90 250 140 250 L260 250 Q310 250 310 300 L310 600 Q310 620 290 620 L110 620 Q90 620 90 600 Z" /></clipPath></defs>
            <g clipPath="url(#bot)">
              <rect x={80} y={ya - 160} width={240} height={760} fill={mix > 0 ? `rgba(${Math.round(232 - 60 * mix)},${Math.round(214 + 10 * mix)},${Math.round(160 - 40 * mix)},0.75)` : "rgba(240,222,170,0.75)"} />
              {mix < 1 ? <rect x={80} y={yb - 160} width={240} height={ya - yb} fill="rgba(150,205,90,0.82)" opacity={1 - mix} transform={`translate(0 ${-160 + 160})`} /> : null}
            </g>
            <path d="M90 300 Q90 250 140 250 L260 250 Q310 250 310 300 L310 600 Q310 620 290 620 L110 620 Q90 620 90 600 Z" fill="rgba(255,255,255,0.18)" stroke="rgba(110,120,130,0.7)" strokeWidth={5} />
            <rect x={160} y={190} width={80} height={62} rx={8} fill="#F4F4F2" stroke="#9AA2AB" strokeWidth={4} />
            <path d="M150 120 L300 120 L320 160 L240 170 L240 190 L160 190 Z" fill="#FFFFFF" stroke="#9AA2AB" strokeWidth={4} />
            <path d="M210 190 L250 240 L232 250" fill="none" stroke="#9AA2AB" strokeWidth={8} strokeLinecap="round" />
            <line x1={100} x2={130} y1={435} y2={435} stroke={CL.navy} strokeWidth={4} /><text x={60} y={444} textAnchor="end" fontFamily={LABEL} fontSize={30} fill={CL.navy}>½</text>
          </svg>
        </div>
        <Tag x={1000} y={680} text="1 taza vinagre caliente" k={a} />
        <Tag x={1000} y={520} text="1 taza detergente" k={b} color="#3F7F2F" />
        <div style={{ position: "absolute", left: 1000, top: 760, opacity: no, display: "flex", alignItems: "center", gap: 18 }}>
          <Tick ok={false} s={60} k={no} /><span style={{ fontFamily: HAND, fontSize: 60, color: CL.red }}>sacudir = espuma</span>
        </div>
        <div style={{ position: "absolute", left: 1000, top: 860, opacity: lin(f, T * 0.66, T * 0.74), fontFamily: HAND, fontSize: 60, color: CL.navy }}>se da vuelta despacito</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 8 · el reloj de arena de 30 minutos
export const TbHourglass: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 13);
  const k = ease(clamp01((f - 6) / (T - 20)));
  const mins = Math.round(30 * k);
  const tt = f / fps;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={118} dim={0.4} />
      <Hand2D seed={118}>
        <Contact x={860} y={930} w={520} />
        <div style={{ position: "absolute", left: 640, top: 160, rotate: `${(1 - p) * -40}deg`, scale: String(0.8 + 0.2 * p), opacity: p }}>
          <svg width={440} height={780} viewBox="0 0 440 780">
            <defs>
              <clipPath id="top"><path d="M80 80 L360 80 Q360 260 236 380 L204 380 Q80 260 80 80 Z" /></clipPath>
              <clipPath id="bot2"><path d="M204 400 L236 400 Q360 520 360 700 L80 700 Q80 520 204 400 Z" /></clipPath>
            </defs>
            <rect x={40} y={40} width={360} height={40} rx={10} fill={CL.brass} /><rect x={40} y={700} width={360} height={40} rx={10} fill={CL.brass} />
            <g clipPath="url(#top)"><rect x={60} y={80 + 300 * k} width={320} height={320} fill={YEL} /></g>
            <g clipPath="url(#bot2)"><path d={`M80 700 L360 700 L360 ${700 - 230 * k} Q220 ${700 - 300 * k} 80 ${700 - 230 * k} Z`} fill="#FFFFFF" stroke="#E8E2D5" strokeWidth={2} /></g>
            {k < 0.99 ? <line x1={220} x2={220} y1={380} y2={700 - 280 * k} stroke={hexA(YEL, 0.9)} strokeWidth={6} strokeDasharray="10 8" strokeDashoffset={-tt * 120} /> : null}
            <path d="M80 80 L360 80 Q360 260 236 380 L236 400 Q360 520 360 700 L80 700 Q80 520 204 400 L204 380 Q80 260 80 80 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(120,130,140,0.7)" strokeWidth={5} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 1150, top: 330, fontFamily: SERIF, fontWeight: 900, fontSize: 210, color: CL.navy, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{mins}<span style={{ fontSize: 80 }}> min</span></div>
        <div style={{ position: "absolute", left: 1160, top: 590, fontFamily: HAND, fontSize: 62, color: CL.inkSoft, opacity: lin(f, 20, 34) }}>no haga nada · vaya por un café</div>
        {/* taza de café humeando */}
        <div style={{ position: "absolute", left: 1220, top: 700 }}>
          <svg width={220} height={200} viewBox="0 0 220 200" style={{ overflow: "visible" }}>
            {[0, 1].map((i) => { const s = (tt * 0.6 + i / 2) % 1; return <path key={i} d={`M${80 + i * 40} 60 q 20 -30 0 -60`} fill="none" stroke="rgba(160,160,160,0.7)" strokeWidth={8} strokeLinecap="round" opacity={1 - s} transform={`translate(0 ${-s * 40})`} />; })}
            <path d="M40 70 L170 70 L160 170 Q105 190 50 170 Z" fill="#FFFFFF" stroke="#C9C1B2" strokeWidth={4} />
            <path d="M168 95 Q215 100 200 140 Q190 160 162 150" fill="none" stroke="#C9C1B2" strokeWidth={10} />
            <ellipse cx={105} cy={72} rx={64} ry={10} fill="#5B3416" />
          </svg>
        </div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 9 · la compresa (pared curva de la tina en 2.5D)
export const TbCompress3D: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const N = 6;
  const curveY = (x: number) => 560 + 0.00016 * (x - 960) ** 2; // la línea amarilla sobre la pared cóncava
  const strips = Array.from({ length: N }, (_, i) => {
    const t0 = 6 + i * Math.round(T * 0.06);
    const s0 = pop(f, fps, t0, 9);
    const x = 470 + i * 196;
    return { s0, x, wet: clamp01((f - t0 - 8) / 26), rot: (1 - s0) * (i % 2 ? 14 : -14) + (x - 960) * 0.012 };
  });
  const film = ease(clamp01((f - T * 0.52) / (T * 0.26)));
  const clock = lin(f, T * 0.8, T * 0.9);
  const fx = 300 + film * 1320;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={121} dim={0.45} />
      <Hand2D seed={121} push={[1.0, 1.06]}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id="wallC" x1="0" x2="1"><stop offset="0" stopColor="#D9D4CA" /><stop offset="0.22" stopColor="#F7F5EF" /><stop offset="0.5" stopColor="#FFFFFF" /><stop offset="0.78" stopColor="#F7F5EF" /><stop offset="1" stopColor="#D9D4CA" /></linearGradient>
            <linearGradient id="filmG" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,0.15)" /><stop offset="0.45" stopColor="rgba(255,255,255,0.55)" /><stop offset="0.5" stopColor="rgba(255,255,255,0.15)" /><stop offset="1" stopColor="rgba(220,235,245,0.3)" /></linearGradient>
            <clipPath id="filmC"><rect x={0} y={0} width={fx} height={1080} /></clipPath>
          </defs>
          <path d="M120 250 Q960 150 1800 250 L1800 1080 L120 1080 Z" fill="url(#wallC)" />
          <path d="M120 250 Q960 150 1800 250" fill="none" stroke="#FFFFFF" strokeWidth={34} strokeLinecap="round" />
          <path d="M120 268 Q960 168 1800 268" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={4} />
          <path d={`M120 ${curveY(120) + 8} Q960 ${curveY(960) - 10} 1800 ${curveY(1800) + 8}`} fill="none" stroke={hexA(YEL, 0.9)} strokeWidth={34} />
          <path d={`M120 ${curveY(120) + 22} Q960 ${curveY(960) + 4} 1800 ${curveY(1800) + 22}`} fill="none" stroke={hexA(YELD, 0.5)} strokeWidth={14} />
          {strips.map((st, i) => {
            const y = curveY(st.x) - 70 - (1 - st.s0) * 520;
            const col = `rgb(${Math.round(255 - 26 * st.wet)},${Math.round(253 - 40 * st.wet)},${Math.round(247 - 70 * st.wet)})`;
            return <g key={i} transform={`translate(${st.x} ${y}) rotate(${st.rot})`} opacity={clamp01(st.s0 * 3)}>
              <rect x={-88} y={0} width={176} height={150} rx={6} fill={col} stroke="rgba(0,0,0,0.08)" strokeWidth={2} />
              {Array.from({ length: 6 }, (_, k) => <line key={k} x1={-80} x2={80} y1={18 + k * 22} y2={18 + k * 22} stroke={`rgba(0,0,0,${0.03 + 0.04 * st.wet})`} strokeWidth={2} />)}
              <rect x={-88} y={0} width={176} height={150} rx={6} fill={hexA(YEL, 0.25 * st.wet)} />
            </g>;
          })}
          {film > 0.01 ? <g clipPath="url(#filmC)">
            <path d={`M300 ${curveY(300) - 110} Q960 ${curveY(960) - 130} 1620 ${curveY(1620) - 110} L1620 ${curveY(1620) + 120} Q960 ${curveY(960) + 100} 300 ${curveY(300) + 120} Z`} fill="url(#filmG)" stroke="rgba(255,255,255,0.8)" strokeWidth={3} />
          </g> : null}
          {film > 0.01 && film < 0.99 ? <rect x={fx - 14} y={curveY(fx) - 130} width={28} height={260} rx={14} fill="#E9EEF3" stroke="#B9C3CC" strokeWidth={3} /> : null}
        </svg>
        <Tag x={260} y={120} text="papel + vinagre tibio + 3 gotas" k={lin(f, 8, 20)} />
        <Tag x={260} y={220} text="film encima" k={lin(f, T * 0.55, T * 0.62)} color={CL.inkSoft} />
        <div style={{ position: "absolute", left: 1420, top: 820, fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: CL.navy, opacity: clock, scale: String(0.8 + 0.2 * clock) }}>1 hora</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 10 · la lupa: frotar raya, el tiempo no
export const TbScratchLens: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const lx = interpolate(f, [0, T], [420, 1500], { easing: Easing.inOut(Easing.cubic) }), ly = 520 + Math.sin(f / 20) * 30;
  const scratches = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ x: 120 + rnd(i) * 720, y: 260 + rnd(i + 50) * 520, a: rnd(i + 9) * 3.14, l: 40 + rnd(i + 3) * 120 })), []);
  const surface = (zoom: number, clip?: string) => (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, clipPath: clip }}>
      <rect x={0} y={0} width={1920} height={1080} fill={ACR} />
      <rect x={960} y={0} width={960} height={1080} fill="#FFFFFF" />
      {scratches.filter((s) => zoom > 1 || s.x < 900).map((s, i) => <line key={i} x1={s.x} y1={s.y} x2={s.x + Math.cos(s.a) * s.l} y2={s.y + Math.sin(s.a) * s.l} stroke={i % 3 ? "rgba(140,105,55,0.75)" : "rgba(110,100,85,0.6)"} strokeWidth={zoom > 1 ? 4 : 1.6} />)}
      {zoom > 1 ? <ellipse cx={1450} cy={560} rx={300} ry={80} fill="rgba(255,255,255,0.7)" /> : null}
    </svg>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={132} dim={0.2} />
      <Hand2D seed={132} push={[1, 1.03]}>
        <AbsoluteFill style={{ opacity: 0.92 }}>{surface(1)}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `scale(1.0)` }}>{surface(2, `circle(210px at ${lx}px ${ly}px)`)}</AbsoluteFill>
        <div style={{ position: "absolute", left: lx - 220, top: ly - 220, width: 440, height: 440, borderRadius: "50%", border: `18px solid ${CL.navy}`, boxShadow: `0 30px 60px ${CL.shadow}, inset 0 0 40px rgba(255,255,255,0.6)` }} />
        <div style={{ position: "absolute", left: lx + 140, top: ly + 140, width: 46, height: 230, background: CL.navy, borderRadius: 20, rotate: "-40deg", transformOrigin: "50% 0" }} />
        <div style={{ position: "absolute", left: 140, top: 100, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>Frotar con polvo</div>
        <div style={{ position: "absolute", left: 140, top: 180, fontFamily: HAND, fontSize: 54, color: CL.red }}>rayitas · la mugre se agarra</div>
        <div style={{ position: "absolute", left: 1100, top: 100, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink, opacity: lin(f, T * 0.45, T * 0.6) }}>Compresa quieta</div>
        <div style={{ position: "absolute", left: 1100, top: 180, fontFamily: HAND, fontSize: 54, color: "#2F8F48", opacity: lin(f, T * 0.5, T * 0.65) }}>lo que hacía el brazo, lo hace el tiempo</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 11 · el libro sobre el borde de la tina (CTA)
export const TbBookTub: React.FC<{ page: string; cover: string; qr?: string; pageNo: number; bed?: string; skip?: number }> = ({ page, cover, qr, pageNo, bed, skip = 0 }) => {
  const f = useCurrentFrame() + skip; const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const drop = pop(f, fps, 2, 12);
  const open = ease(clamp01((f - 22) / 26));
  const kq = pop(f, fps, skip ? 0 : Math.round(T * 0.45), 13);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={143} dim={0.25} />
      <Hand2D seed={143} push={[1, 1.06]}>
        {/* borde de la tina en primer plano */}
        <div style={{ position: "absolute", left: -40, right: -40, top: 820, height: 320, background: `linear-gradient(180deg, #FFFFFF 0%, ${ACR} 40%, #E9E4DA 100%)`, borderRadius: "60px 60px 0 0", boxShadow: "0 -10px 40px rgba(0,0,0,0.1)" }} />
        <Contact x={820} y={850} w={1000} o={0.3} />
        <div style={{ position: "absolute", left: 820, top: 80 + (1 - drop) * -900, translate: "-50% 0", rotate: `${(1 - drop) * -12 - 2}deg`, perspective: 2000 }}>
          <div style={{ display: "flex", transform: "perspective(2200px) rotateX(18deg)" }}>
            <div style={{ width: 520, height: 680, transformOrigin: "100% 50%", transform: `perspective(2000px) rotateY(${-170 * open}deg)`, backfaceVisibility: "hidden", boxShadow: `0 30px 60px ${CL.shadow}` }}>
              <Img src={staticFile(cover)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
            </div>
            <div style={{ width: 520, height: 680, background: "#fff", boxShadow: `0 30px 60px ${CL.shadow}`, opacity: open > 0.4 ? 1 : 0 }}>
              <Img src={staticFile(page)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 1150, top: 120, opacity: lin(f, 40, 52) }}><Stamp text={`página ${pageNo}`} at={42} color={CL.navy} x={180} y={40} rot={-6} size={58} /></div>
        {qr ? <div style={{ position: "absolute", left: 1420, top: 360, scale: String(kq), rotate: `${(1 - kq) * 20 + 4}deg` }}>
          <Card style={{ padding: 22 }}><Img src={staticFile(qr)} style={{ width: 300, display: "block" }} /><div style={{ fontFamily: LABEL, fontSize: 28, textAlign: "center", marginTop: 10, color: CL.navy, letterSpacing: 2 }}>LINK EN LA DESCRIPCIÓN</div></Card>
          <Tape x={110} y={-16} rot={-5} />
        </div> : null}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 12 · el óxido de la esmaltada
export const TbEnamelRust: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const paste = pop(f, fps, Math.round(T * 0.2), 12);
  const scrub = clamp01((f - T * 0.3) / (T * 0.35));
  const shrink = 1 - 0.8 * ease(clamp01((f - T * 0.35) / (T * 0.45)));
  const stone = pop(f, fps, Math.round(T * 0.66), 13);
  const sx = 960 + Math.cos(scrub * 30) * 90 * (scrub > 0 && scrub < 1 ? 1 : 0), sy = 610 + Math.sin(scrub * 30) * 50 * (scrub > 0 && scrub < 1 ? 1 : 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={154} dim={0.3} />
      <Hand2D seed={154}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, #F2EEE6 55%, #DCD5C8 100%)" }} />
        {/* llave de cromo arriba con su gota */}
        <div style={{ position: "absolute", left: 830, top: 40, width: 260, height: 170, borderRadius: "0 0 60px 60px", background: "linear-gradient(90deg, #C9D0D8, #FFFFFF, #AEB6C0)", boxShadow: `0 20px 40px ${CL.shadow}` }} />
        <div style={{ position: "absolute", left: 948, top: 190 + ((f * 6) % 280), width: 24, height: 32, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(170,200,230,0.8)" }} />
        {/* mancha de óxido (gotea hacia abajo) */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><filter id="rz"><feTurbulence baseFrequency="0.035" numOctaves={3} seed={8} /><feDisplacementMap in="SourceGraphic" scale={40} /></filter></defs>
          <g filter="url(#rz)" opacity={0.9}><ellipse cx={960} cy={640} rx={230 * shrink} ry={360 * shrink} fill={RUST} opacity={0.8} /><ellipse cx={960} cy={560} rx={110 * shrink} ry={220 * shrink} fill="#9E4317" opacity={0.65} /></g>
          {paste > 0.01 ? <ellipse cx={960} cy={620} rx={170 * paste} ry={120 * paste} fill="#FFFFFF" opacity={0.85 * (1 - clamp01((f - T * 0.62) / 10))} /> : null}
        </svg>
        {/* esponja */}
        {scrub > 0 && scrub < 1 ? <div style={{ position: "absolute", left: sx - 110, top: sy - 60, width: 220, height: 120, borderRadius: 24, background: "linear-gradient(180deg, #FFFFFF, #E9E7E2)", boxShadow: `0 16px 30px ${CL.shadow}` }} /> : null}
        {/* piedra pómez mojada */}
        <div style={{ position: "absolute", left: 1350, top: 520, scale: String(stone), rotate: `${-14 + 6 * Math.sin(f / 10)}deg` }}>
          <div style={{ width: 260, height: 150, borderRadius: "40% 50% 45% 55%", background: "radial-gradient(circle at 30% 30%, #D8D3C8, #9A948A)", boxShadow: `0 20px 30px ${CL.shadow}`, backgroundImage: "radial-gradient(rgba(0,0,0,0.18) 2px, transparent 3px)", backgroundSize: "22px 18px" }} />
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 70, top: 140 + ((f * 3 + i * 20) % 60), width: 16, height: 22, borderRadius: "50%", background: "rgba(160,200,235,0.85)" }} />)}
        </div>
        <Tag x={1340} y={760} text="sólo esmaltada · siempre mojada" k={stone} />
        <Tag x={460} y={300} text="óxido del agua" k={lin(f, 6, 18)} color={RUST} />
        <Tag x={460} y={400} text="pasta de bicarbonato" k={paste} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 13 · la balanza de las esponjas
export const TbSpongeScale: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const items = [0, 1, 2].map((i) => pop(f, fps, 6 + i * 9, 11));
  const right = [0, 1].map((i) => pop(f, fps, Math.round(T * 0.35) + i * 9, 11));
  // la balanza: con el peso de lo que raya cae a la izquierda; al final un golpe la manda a «no raya»
  const verdict = pop(f, fps, Math.round(T * 0.62), 8);
  const ang = interpolate(items.reduce((a, b) => a + b, 0), [0, 3], [0, -9]) + verdict * 22;
  const rad = (ang * Math.PI) / 180;
  const pan = (side: -1 | 1) => ({ x: 960 + side * 430 * Math.cos(rad), y: 360 + side * 430 * Math.sin(rad) });
  const L = pan(-1), R = pan(1);
  const lbl = (txt: string, k: number, dx: number) => <div style={{ position: "absolute", left: dx, top: 0, opacity: k, translate: `0 ${(1 - k) * -60}px`, fontFamily: LABEL, fontSize: 30, color: CL.ink, background: "rgba(255,255,255,0.85)", padding: "4px 12px", borderRadius: 8, whiteSpace: "nowrap" }}>{txt}</div>;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={165} dim={0.4} />
      <Hand2D seed={165}>
        <Contact x={960} y={940} w={600} />
        <div style={{ position: "absolute", left: 930, top: 360, width: 60, height: 580, background: `linear-gradient(90deg, ${CL.brass}, ${CL.brassLight}, ${CL.brass})`, borderRadius: 20 }} />
        <div style={{ position: "absolute", left: 960 - 470, top: 360 - 14, width: 940, height: 28, background: `linear-gradient(180deg, ${CL.brassLight}, ${CL.brass})`, borderRadius: 14, rotate: `${ang}deg` }} />
        <div style={{ position: "absolute", left: 930, top: 330, width: 60, height: 60, borderRadius: "50%", background: CL.brass }} />
        {[[L, -1], [R, 1]].map(([p, s]: any) => (
          <div key={s} style={{ position: "absolute", left: p.x - 200, top: p.y + 160 }}>
            <svg width={400} height={60} style={{ position: "absolute", left: 0, top: -160, overflow: "visible" }}><line x1={200} y1={0} x2={30} y2={160} stroke={CL.brass} strokeWidth={4} /><line x1={200} y1={0} x2={370} y2={160} stroke={CL.brass} strokeWidth={4} /></svg>
            <div style={{ width: 400, height: 40, borderRadius: "0 0 200px 200px", background: `linear-gradient(180deg, ${CL.brassLight}, ${CL.brass})` }} />
            <div style={{ position: "absolute", left: 20, top: -110, width: 360, height: 110 }}>
              {s < 0 ? <>
                <div style={{ position: "absolute", left: 10, bottom: 0, width: 140, height: 60, borderRadius: 10, background: "#3A8A3A", translate: `0 ${(1 - items[0]) * -300}px`, opacity: items[0] }} />
                <div style={{ position: "absolute", left: 160, bottom: 0, width: 80, height: 100, borderRadius: 10, background: "#D8DCE0", border: "4px solid #8F98A2", translate: `0 ${(1 - items[1]) * -300}px`, opacity: items[1] }} />
                <div style={{ position: "absolute", left: 250, bottom: 0, width: 100, height: 50, borderRadius: "40%", background: "repeating-radial-gradient(#9AA0A6 0 3px, #6F757B 3px 6px)", translate: `0 ${(1 - items[2]) * -300}px`, opacity: items[2] }} />
                {lbl("esponja verde · polvo · lana de acero", items[2], -10)}
              </> : <>
                <div style={{ position: "absolute", left: 40, bottom: 0, width: 150, height: 66, borderRadius: 16, background: "#FFFFFF", boxShadow: "inset 0 -6px 0 #E3E0D8", translate: `0 ${(1 - right[0]) * -300}px`, opacity: right[0] }} />
                <div style={{ position: "absolute", left: 210, bottom: 0, width: 130, height: 46, borderRadius: 12, background: "#5D8FD8", translate: `0 ${(1 - right[1]) * -300}px`, opacity: right[1] }} />
                {lbl("esponja blanca · microfibra", right[1], 30)}
              </>}
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 960, top: 120, translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CL.navy, opacity: verdict, whiteSpace: "nowrap" }}>En acrílico: lo que no raya</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 14 · los cinco errores (llaveros del tablero)
export const TbFiveKeys: React.FC<{ hi?: number; bed?: string }> = ({ hi = 1, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const E = ["Cloro sobre el amarillo", "Polvo o esponja verde", "Vinagre toda la noche", "No enjuagar el detergente", "Frotar en seco"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={176} dim={0.35} />
      <Hand2D seed={176}>
        {/* tablero de madera con ganchos */}
        <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 840, borderRadius: 24, background: "linear-gradient(160deg, #8A5A34, #6B4325)", boxShadow: `0 40px 80px ${CL.shadow}, inset 0 3px 0 rgba(255,255,255,0.2)`, backgroundImage: "repeating-linear-gradient(95deg, rgba(0,0,0,0.05) 0 8px, rgba(255,255,255,0.03) 8px 18px)" }} />
        {E.map((e, i) => {
          const p = pop(f, fps, 4 + i * 6, 10);
          const flip = i + 1 === hi ? ease(clamp01((f - 34) / 16)) : 0;
          const sw = Math.sin(f / 9 + i) * 3 * (1 - flip);
          return (
            <div key={i} style={{ position: "absolute", left: 250 + i * 300, top: 180, transformOrigin: "50% 0", rotate: `${sw + (1 - p) * 30}deg`, opacity: p }}>
              <div style={{ position: "absolute", left: 120, top: -6, width: 24, height: 24, borderRadius: "50%", background: CL.brassLight }} />
              <div style={{ transform: `perspective(1200px) rotateY(${flip * 180}deg)`, transformStyle: "flat" }}>
                {flip < 0.5 ? <KeyTag num={i + 1} label="ERROR" w={260} /> : (
                  <div style={{ transform: "scaleX(-1)", width: 260, height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Card style={{ padding: 22, width: 240, textAlign: "center", border: `5px solid ${CL.red}` }}>
                      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CL.red, lineHeight: 1 }}>{i + 1}</div>
                      <div style={{ fontFamily: LABEL, fontSize: 36, color: CL.ink, marginTop: 10, lineHeight: 1.15 }}>{e}</div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 15 · la hoja de servicio con los tiempos
export const TbRoutine: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const S = [["Nudillos y algodón", 1], ["Vinagre caliente + detergente", 5], ["Rociar y esperar", 30], ["Esponja blanca y enjuague", 10], ["Compresa con film", 60], ["Bicarbonato y enjuague", 5]] as const;
  const p = pop(f, fps, 0, 15);
  const step = (i: number) => clamp01((f - 10 - i * (T * 0.13)) / 10);
  const sum = S.reduce((a, [, m], i) => a + m * step(i), 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={187} dim={0.3} />
      <Hand2D seed={187}>
        <div style={{ position: "absolute", left: 300, top: 70, rotate: `${-2 + (1 - p) * -8}deg`, translate: `0 ${(1 - p) * 900}px` }}>
          <div style={{ width: 880, height: 960, background: "#FFFDF6", borderRadius: 10, boxShadow: `0 40px 80px ${CL.shadow}`, padding: "120px 60px 40px" }}>
            <div style={{ position: "absolute", left: 340, top: -30, width: 200, height: 90, borderRadius: 14, background: `linear-gradient(180deg, #C9CED4, #8F98A2)` }} />
            <div style={{ fontFamily: LABEL, fontSize: 36, letterSpacing: 4, color: CL.inkSoft, marginBottom: 24 }}>HOJA DE SERVICIO · TINA</div>
            {S.map(([t, m], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 110, borderBottom: "2px solid #E3DCCF", opacity: 0.35 + 0.65 * step(i) }}>
                <div style={{ width: 56, height: 56, border: `5px solid ${CL.navy}`, borderRadius: 8, position: "relative" }}>{step(i) > 0.1 ? <div style={{ position: "absolute", left: -6, top: -18 }}><Tick ok s={64} k={step(i)} /></div> : null}</div>
                <div style={{ flex: 1, fontFamily: HAND, fontSize: 58, color: CL.ink }}>{t}</div>
                <div style={{ fontFamily: LABEL, fontSize: 40, color: i === 4 ? CL.brass : CL.navy, background: i === 4 ? hexA(CL.yellow, 0.25) : "transparent", padding: "2px 12px", borderRadius: 8 }}>{m >= 60 ? "1 h" : `${m} min`}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 1310, top: 330, opacity: p }}>
          <div style={{ fontFamily: LABEL, fontSize: 36, color: CL.inkSoft, letterSpacing: 3 }}>TOTAL</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: CL.navy, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{sum >= 60 ? `${Math.floor(sum / 60)} h ${String(Math.round(sum % 60)).padStart(2, "0")}` : `${Math.round(sum)} min`}</div>
          <div style={{ fontFamily: HAND, fontSize: 64, color: CL.ink, opacity: lin(f, T * 0.75, T * 0.85) }}>una tarde, y un vaso de vinagre</div>
        </div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 16 · nunca mezclar (la mano frena la botella)
export const TbNeverPour: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const tilt = interpolate(f, [6, T * 0.35], [0, 38], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const stop = pop(f, fps, Math.round(T * 0.35), 9);
  const ang = tilt * (1 - stop * 0.85);
  const handX = interpolate(stop, [0, 1], [1700, 1060]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={198} dim={0.35} />
      <Hand2D seed={198}>
        <Contact x={620} y={900} w={360} /><Contact x={980} y={900} w={360} />
        {/* vinagre */}
        <div style={{ position: "absolute", left: 500, top: 420 }}>
          <svg width={240} height={480} viewBox="0 0 240 480"><path d="M80 20 L160 20 L160 80 Q220 110 220 180 L220 450 Q220 470 200 470 L40 470 Q20 470 20 450 L20 180 Q20 110 80 80 Z" fill="rgba(240,236,224,0.85)" stroke="#B9B2A3" strokeWidth={4} /><rect x={70} y={0} width={100} height={30} rx={6} fill="#E8E2D4" /><rect x={40} y={240} width={160} height={110} rx={10} fill="#FFFFFF" /><text x={120} y={305} textAnchor="middle" fontFamily={LABEL} fontSize={30} fill={CL.ink}>VINAGRE</text></svg>
        </div>
        {/* cloro que se inclina */}
        <div style={{ position: "absolute", left: 860, top: 400, rotate: `${-ang}deg`, transformOrigin: "20% 100%" }}>
          <svg width={260} height={500} viewBox="0 0 260 500"><path d="M60 30 L140 30 L150 90 Q240 110 240 200 L240 470 Q240 490 220 490 L30 490 Q10 490 10 470 L10 200 Q10 110 60 90 Z" fill="#FFFFFF" stroke="#C9C1B2" strokeWidth={4} /><rect x={50} y={0} width={100} height={40} rx={8} fill={CL.red} /><path d="M160 130 Q230 140 220 230 L190 230 Q195 170 160 165 Z" fill="none" stroke="#C9C1B2" strokeWidth={10} /><rect x={30} y={270} width={190} height={120} rx={10} fill="#E7F0FA" /><text x={125} y={340} textAnchor="middle" fontFamily={LABEL} fontSize={34} fill={CL.ink}>CLORO</text></svg>
        </div>
        {/* mano con guante azul y manga marino */}
        <div style={{ position: "absolute", left: handX, top: 360, rotate: "-8deg" }}>
          <div style={{ position: "absolute", left: 120, top: 40, width: 700, height: 150, borderRadius: 40, background: CL.navy, boxShadow: `0 20px 40px ${CL.shadow}` }} />
          <div style={{ width: 200, height: 230, borderRadius: "90px 60px 60px 90px", background: `linear-gradient(160deg, #73A6EC, ${CL.nitrile})`, boxShadow: `inset 0 8px 0 rgba(255,255,255,0.3), 0 20px 40px ${CL.shadow}` }} />
        </div>
        <Stamp text="nunca" at={Math.round(T * 0.42)} color={CL.red} x="72%" y="22%" rot={-8} size={96} />
        <div style={{ position: "absolute", left: 960, top: 960, translate: "-50% 0", whiteSpace: "nowrap", fontFamily: HAND, fontSize: 66, color: CL.navy, opacity: lin(f, T * 0.55, T * 0.68) }}>ventana abierta · guantes puestos</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 17 · el trapo de 30 segundos
export const TbWipeTimer: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = ease(clamp01((f - 8) / (T - 24)));
  const secs = Math.round(30 * k);
  const cx = 960, cy = 560, rx = 640, ry = 300;
  const th = -Math.PI / 2 + k * Math.PI * 2;
  const wx = cx + Math.cos(th) * rx, wy = cy + Math.sin(th) * ry;
  const drops = useMemo(() => Array.from({ length: 90 }, (_, i) => { const a = (i / 90) * Math.PI * 2 - Math.PI / 2; return { a, x: cx + Math.cos(a) * rx * (0.99 + rnd(i) * 0.03), y: cy + Math.sin(a) * ry * (0.99 + rnd(i + 3) * 0.03), r: 4 + rnd(i + 7) * 7 }; }), []);
  const C = 2 * Math.PI * 120;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={209} dim={0.3} />
      <Hand2D seed={209} push={[1.04, 1.0]}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <ellipse cx={cx} cy={cy} rx={rx + 90} ry={ry + 70} fill="#FFFFFF" stroke="#E2DDD2" strokeWidth={6} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={ACR} stroke="#D9D3C6" strokeWidth={10} />
          <ellipse cx={cx} cy={cy + 40} rx={rx * 0.8} ry={ry * 0.75} fill="#F4F1EA" />
          <circle cx={cx + rx * 0.55} cy={cy + 80} r={30} fill="#C9CED4" />
          {drops.map((d, i) => { const passed = ((d.a + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2)) < k * Math.PI * 2; return passed ? null : <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="rgba(140,185,225,0.75)" />; })}
        </svg>
        {/* trapo gris de microfibra */}
        <div style={{ position: "absolute", left: wx - 120, top: wy - 70, width: 240, height: 140, borderRadius: 26, background: "linear-gradient(160deg, #A9AFB6, #7E858D)", rotate: `${(th * 180) / Math.PI + 90}deg`, boxShadow: `0 18px 30px ${CL.shadow}`, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 4px, transparent 4px 9px)" }} />
        {/* arco de 30 s */}
        <div style={{ position: "absolute", left: cx - 150, top: cy - 150 }}>
          <svg width={300} height={300} viewBox="0 0 300 300">
            <circle cx={150} cy={150} r={120} fill="rgba(255,255,255,0.9)" stroke="#E3DCCF" strokeWidth={22} />
            <circle cx={150} cy={150} r={120} fill="none" stroke={CL.navy} strokeWidth={22} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - k)} transform="rotate(-90 150 150)" />
            <text x={150} y={168} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={84} fill={CL.navy}>{secs}s</text>
          </svg>
        </div>
        <div style={{ position: "absolute", left: 960, top: 940, translate: "-50% 0", fontFamily: HAND, fontSize: 64, color: CL.navy, whiteSpace: "nowrap", opacity: lin(f, 12, 26) }}>después de cada baño, con la tina tibia</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 18 · repaso: azulejos que giran
export const TbTileFlip: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const W = ["3 capas", "el algodón", "1 + 1 caliente", "30 min", "compresa 1 h", "bicarbonato", "nunca polvo", "nunca + cloro", "trapo 30 s"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={220} dim={0.3} />
      <Hand2D seed={220}>
        <AbsoluteFill style={{ background: "#D8CFC1" }} />
        {W.map((w, i) => {
          const c = i % 3, r = Math.floor(i / 3);
          const t0 = 6 + i * ((T - 40) / W.length);
          const k = ease(clamp01((f - t0) / 14));
          const deg = 180 * k;
          const face = deg < 90;
          return (
            <div key={i} style={{ position: "absolute", left: 290 + c * 450, top: 70 + r * 320, width: 440, height: 310, transform: `perspective(1400px) rotateX(${deg}deg)` }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 8, background: face ? `radial-gradient(ellipse at ${30 + rnd(i) * 40}% 70%, ${hexA(YEL, 0.75)}, ${hexA(YELD, 0.5)} 40%, #EDE3CE 70%)` : "#FFFFFF", boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.05), 0 6px 12px rgba(0,0,0,0.1)", transform: face ? "none" : "rotateX(180deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {!face ? <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: CL.navy, textAlign: "center", padding: 20 }}><span style={{ fontFamily: LABEL, fontSize: 34, color: CL.brass, display: "block", letterSpacing: 3 }}>{i + 1}</span>{w}</div> : null}
              </div>
            </div>
          );
        })}
      </Hand2D>
      <RoomLight k={0.6} />
    </AbsoluteFill>
  );
};
