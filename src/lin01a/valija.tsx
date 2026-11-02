// lin01a · EL HILO «La valija abierta». Valija de mano de cuero tostado gastado, cierres y esquineros de bronce, forro escocés,
// sobre la colcha de crochet de Carol. valija0 (0:27) = se arma desde la profundidad y la etiqueta escribe «11».
// hilo1-10 = la cámara baja a la valija: la prenda equivocada cae, se marca con tiza roja y sale volando al placard;
// la correcta cae y se dobla sola; la etiqueta escribe «n/11». recap = se cierra con el conjunto (comps aparte).
import React from "react";
import * as THREE from "three";
import { BgCtx, Stage } from "./base";
import { geo, Blob, Esc, M, RBox, Ready, camA, cl, handCard, leatherRough, leatherTex, lerp, spr, tartanTex, tubeG, useImg, win, type Pose, type V3 } from "./k3d";

export const VW = 0.56, VD = 0.38, VH = 0.16, LH = 0.06, TH = 0.014;
const leather = (k = "", base?: number[]) => <meshPhysicalMaterial map={leatherTex(base, k)} roughnessMap={leatherRough()} roughness={0.78} clearcoat={0.18} clearcoatRoughness={0.5} sheen={0.4} sheenColor={"#e8b98a"} />;

// bandeja abierta (base o tapa): piso + 4 paredes de cuero, forro escocés por dentro, ribete oscuro en el borde
const Tray: React.FC<{ h: number; id: string }> = ({ h, id }) => {
  const w = VW, d = VD, t = TH;
  return <group>
    <RBox s={[w, t, d]} r={0.006} p={[0, t / 2, 0]}>{leather(id + "b")}</RBox>
    <RBox s={[w, h, t]} r={0.006} p={[0, h / 2, d / 2 - t / 2]}>{leather(id + "f")}</RBox>
    <RBox s={[w, h, t]} r={0.006} p={[0, h / 2, -d / 2 + t / 2]}>{leather(id + "k")}</RBox>
    <RBox s={[t, h, d - 2 * t]} r={0.005} p={[w / 2 - t / 2, h / 2, 0]}>{leather(id + "r")}</RBox>
    <RBox s={[t, h, d - 2 * t]} r={0.005} p={[-w / 2 + t / 2, h / 2, 0]}>{leather(id + "l")}</RBox>
    {/* forro */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, t + 0.0012, 0]} receiveShadow><planeGeometry args={[w - 2 * t, d - 2 * t]} /><meshStandardMaterial map={tartanTex([3, 2])} roughness={0.85} /></mesh>
    {[[0, d / 2 - t - 0.0012, 0, w - 2 * t], [0, -d / 2 + t + 0.0012, Math.PI, w - 2 * t]].map(([x, z, ry, ww], i) =>
      <mesh key={i} position={[x, h / 2 + t / 2, z]} rotation={[0, ry + Math.PI, 0]} receiveShadow><planeGeometry args={[ww, h - t]} /><meshStandardMaterial map={tartanTex([3, 0.6])} roughness={0.85} side={THREE.DoubleSide} /></mesh>)}
    {[1, -1].map((sx) => <mesh key={sx} position={[sx * (w / 2 - t - 0.0012), h / 2 + t / 2, 0]} rotation={[0, -sx * Math.PI / 2, 0]} receiveShadow><planeGeometry args={[d - 2 * t, h - t]} /><meshStandardMaterial map={tartanTex([2, 0.6])} roughness={0.85} side={THREE.DoubleSide} /></mesh>)}
    {/* ribete del borde */}
    {[[0, d / 2 - t / 2, w, 0], [0, -d / 2 + t / 2, w, 0], [w / 2 - t / 2, 0, d, 1], [-w / 2 + t / 2, 0, d, 1]].map(([x, z, L, rot], i) =>
      <mesh key={"p" + i} position={[x, h, z]} rotation={[0, rot ? Math.PI / 2 : 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.0042, 0.0042, L, 10]} />{leather("rib", [92, 52, 26])}</mesh>)}
    {/* esquineros de bronce */}
    {[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sz], i) => <RBox key={"c" + i} s={[0.024, 0.03, 0.024]} r={0.007} p={[sx * (w / 2 - 0.0015), 0.014, sz * (d / 2 - 0.0015)]}>{M.brass({ col: "#c9963f" })}</RBox>)}
  </group>;
};

// la valija: open 0 cerrada → 1 abierta (≈108°); latch 0 → 1 los cierres saltan
export const Valija: React.FC<{ open: number; latch?: number }> = ({ open, latch = 1 }) => {
  const ang = 1.88 * open;
  return <group>
    <Tray h={VH} id="base" />
    {/* manija de cuero y cierres de bronce al frente */}
    <mesh castShadow geometry={tubeG("manija", [[-0.07, VH - 0.035, VD / 2 + 0.004], [-0.06, VH - 0.01, VD / 2 + 0.035], [0, VH, VD / 2 + 0.046], [0.06, VH - 0.01, VD / 2 + 0.035], [0.07, VH - 0.035, VD / 2 + 0.004]], 0.0085, 60, 14)}>{leather("man", [120, 70, 36])}</mesh>
    {[-1, 1].map((sx) => <group key={sx} position={[sx * 0.075, VH - 0.035, VD / 2 + 0.002]}><RBox s={[0.022, 0.03, 0.008]} r={0.004}>{M.brass()}</RBox></group>)}
    {[-0.17, 0.17].map((x) => <group key={x} position={[x, VH - 0.02, VD / 2 + 0.004]}>
      <RBox s={[0.05, 0.034, 0.01]} r={0.004}>{M.brass()}</RBox>
      <mesh position={[0, 0.004, 0.006]} rotation={[-0.9 * latch, 0, 0]}><boxGeometry args={[0.03, 0.03, 0.004]} />{M.brass({ col: "#e0b45a" })}</mesh>
    </group>)}
    {/* la tapa gira en la bisagra de atrás */}
    <group position={[0, VH, -VD / 2]} rotation={[-ang, 0, 0]}>
      <group position={[0, LH, VD / 2]} rotation={[Math.PI, 0, 0]}><Tray h={LH} id="tapa" /></group>
      {[-0.17, 0.17].map((x) => <RBox key={x} s={[0.044, 0.012, 0.016]} r={0.004} p={[x, LH - 0.012, VD + 0.002]}>{M.brass()}</RBox>)}
    </group>
  </group>;
};

// etiqueta de cuero colgada de la manija con una correa; la tarjeta se escribe a mano (p 0..1)
export const Etiqueta: React.FC<{ txt: string; p: number; swing: number; sub?: string }> = ({ txt, p, swing, sub }) => {
  const hx = 0.06, hy = VH - 0.01, hz = VD / 2 + 0.042;
  const tx = 0.2 + 0.015 * Math.sin(swing * 3), tz = VD / 2 + 0.2;
  return <group>
    <mesh castShadow geometry={tubeG(`correa${Math.round(swing * 30)}`, [[hx, hy, hz], [hx + 0.04, 0.05, hz + 0.05], [tx - 0.09, 0.03, tz - 0.08]], 0.0035, 40, 8)}>{leather("cor", [96, 54, 26])}</mesh>
    <group position={[tx, 0.035, tz]} scale={1.6} rotation={[-Math.PI / 2 + 0.42, 0, -0.18 + 0.12 * Math.sin(swing * 2.3) * Math.exp(-swing * 0.6)]}>
      <RBox s={[0.17, 0.11, 0.008]} r={0.004}>{leather("tag", [138, 82, 42])}</RBox>
      {/* ventanita con la tarjeta y la costura alrededor */}
      <mesh position={[0, -0.006, 0.0042]}><planeGeometry args={[0.135, 0.07]} /><meshStandardMaterial map={handCard(txt, p, 512, 266, { sub, size: 200 })} roughness={0.85} /></mesh>
      <mesh position={[0.068, 0.04, 0.005]}><torusGeometry args={[0.008, 0.0024, 10, 24]} />{M.brass()}</mesh>
    </group>
  </group>;
};

// media prenda con volumen: abombada al centro, cae en los bordes, un pliegue suave; el sombreado va horneado en colores de vértice
const medio = (w: number, h: number, top: boolean) => geo(`medio2${w.toFixed(3)}|${h.toFixed(3)}|${top}`, () => {
  const g = new THREE.PlaneGeometry(w, h / 2, 24, 14), uv = g.attributes.uv, P = g.attributes.position, col: number[] = [];
  for (let i = 0; i < uv.count; i++) {
    const vy = uv.getY(i) * 0.5 + (top ? 0.5 : 0); uv.setY(i, vy);
    const ux = uv.getX(i), bul = Math.pow(Math.sin(Math.PI * ux), 0.6) * Math.pow(Math.sin(Math.PI * vy), 0.6), fold = Math.exp(-Math.pow((ux - 0.62 + 0.15 * vy) / 0.05, 2));
    P.setZ(i, 0.022 * bul - 0.006 * fold + 0.003 * Math.sin(ux * 21 + vy * 9));
    const c = 0.62 + 0.42 * bul - 0.18 * fold + 0.08 * (1 - ux) * vy; col.push(c, c, c);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
});
const MIT = new Map<string, THREE.Texture>();
const mitad = (tex: THREE.Texture, top: boolean) => { const k = (tex.image as HTMLImageElement).src + top; let t = MIT.get(k); if (!t) { t = tex.clone(); t.colorSpace = THREE.SRGBColorSpace; t.repeat.set(1, 0.5); t.offset.set(0, top ? 0.5 : 0); t.needsUpdate = true; MIT.set(k, t); } return t; };
// prenda recortada (Nano Banana → rembg) como una tela que cae, con su sombra; fold 0..1 dobla la mitad de arriba
export const Prenda: React.FC<{ img: string; p: V3; w: number; rot?: number; fold?: number; lift?: number; spin?: number; fb?: string; sh?: number }> = ({ img, p, w, rot = 0, fold = 0, lift = 0, spin = 0, fb = "#d9d2c4", sh = 0.55 }) => {
  const [tex, done] = useImg("lin01a/prendas/" + img + ".png");
  const ar = tex?.image ? (tex.image as HTMLImageElement).height / (tex.image as HTMLImageElement).width : 0.8, h = w * ar;
  const half = (top: boolean) => {
    if (!tex) return <meshStandardMaterial color={fb} roughness={0.9} side={THREE.DoubleSide} />;
    return <meshBasicMaterial map={tex} color="#f4eee4" vertexColors transparent alphaTest={0.35} side={THREE.DoubleSide} />;
  };
  return <group position={[p[0], p[1] + lift, p[2]]} rotation={[0, rot, spin]}>
    {tex && <Ready dep={tex} done={done} />}
    {sh > 0.02 && <Blob w={w * 1.15} d={h * 1.1} o={sh} y={-0.003} />}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, h / 4]} receiveShadow><primitive object={medio(w, h, false)} attach="geometry" />{half(false)}</mesh>
    {/* mitad de arriba: gira sobre la línea del medio */}
    <group position={[0, 0.001, 0]} rotation={[Math.PI * 0.98 * fold, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -h / 4]} receiveShadow><primitive object={medio(w, h, true)} attach="geometry" />{half(true)}</mesh>
    </group>
  </group>;
};

// tiza roja de sastre: dos trazos en cruz que crecen
const Tiza: React.FC<{ p: V3; k: number; s?: number }> = ({ p, k, s = 0.2 }) => <group position={p}>
  {[0.7, -0.7].map((r, i) => { const kk = cl(k * 2 - i); return kk > 0.01 && <mesh key={i} rotation={[-Math.PI / 2, 0, r]} position={[0, 0.004 + i * 0.001, 0]} scale={[kk, 1, 1]}><planeGeometry args={[s, 0.014]} /><meshStandardMaterial color="#d8342b" roughness={1} emissive="#5a0d08" emissiveIntensity={0.25} /></mesh>; })}
</group>;

export type Fi = { id: string; a: number; b: number; wow?: number | null; n?: number; k?: number; mo?: Record<string, number> };
// qué sale y qué entra en cada punto
export const PAR: Record<number, [string, string, number, number]> = {   // [equivocada, correcta, ancho m, ancho m]
  1: ["g01_blusa", "g01b_remera", 0.3, 0.28], 2: ["g02_plataforma", "g02b_zapatillas", 0.26, 0.26], 3: ["g03_ojotas", "g03b_chatas", 0.24, 0.24],
  4: ["g04_nuevos", "g04b_gastados", 0.25, 0.25], 5: ["g05_jeans", "g05b_joggers", 0.28, 0.28], 6: ["g06_joyas", "g06b_anillo", 0.26, 0.14],
  7: ["g07_fina", "g07b_capas", 0.28, 0.3], 8: ["g08_largos", "g05b_joggers", 0.34, 0.28], 9: ["g09_perfume", "g09b_vial", 0.16, 0.08], 10: ["g10_vestido", "g10b_bolso", 0.3, 0.26],
};
const P_ALTA: Pose = { p: [1.15, 1.2, 1.6], l: [0, 0.1, 0.05], fov: 30 };
const P_MEDIA: Pose = { p: [0.64, 0.94, 1.34], l: [0.05, 0.07, 0.12], fov: 35 };

export const ValijaFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, n = f.n ?? 0, wow = f.wow ?? a + 0.6;
  const intro = n === 0;
  // valija0: llega desde la profundidad girando y se abre de golpe; en el hilo ya está abierta y la cámara baja
  const arr = intro ? spr(t, a + 0.05, 0.75, 1.6) : 1;
  const open = intro ? spr(t, a + 0.55, 0.9, 1.7) : 1;
  const cam = intro ? camA(t, a, b, P_ALTA, P_MEDIA) : camA(t, a, b, { ...P_ALTA, p: [0.8, 1.6, 1.3] }, { p: [0.46, 1.48, 1.28], l: [0.05, 0.04, 0.14], fov: 36 });
  const txt = intro ? "11" : `${n}/11`, wp = win(t, wow - 0.05, wow + (intro ? 0.45 : 0.6));
  const par = PAR[n];
  // prenda equivocada: cae, tiza, sale volando a la derecha (al placard)
  const e0 = a + 0.2, mk = wow + 0.5, fly = Math.min(b - 1.9, wow + 1.35), in1 = fly + 0.35;
  const dropW = Math.max(0, 1 - spr(t, e0, 0.9, 1.5)), flyK = win(t, fly, fly + 0.55);
  const dropR = Math.max(0, 1 - spr(t, in1, 0.9, 1.5)), foldK = spr(t, in1 + 0.55, 0.85, 1.3);
  // el hilo vive siempre en el cuarto de Carol: de fondo, su cuarto (la colcha, el placard abierto)
  return <BgCtx.Provider value={{ id: "v001_hook_r01", o: 1.0, a }}><Stage t={t} a={a} b={b} dim={0.5}>
    <Esc cam={cam}>
      <group position={[0, (1 - arr) * 0.35, (1 - arr) * -3.2]} rotation={[0, (1 - arr) * 0.9, (1 - arr) * 0.25]} scale={0.84}>
      <Blob w={1.5} d={1.1} o={0.6} />
      <group position={[0, 0.026, 0]}>
        <Valija open={open} latch={intro ? spr(t, a + 0.35, 1.2) : 1} />
        <Etiqueta txt={txt} p={wp} swing={Math.max(0, t - (intro ? a + 0.5 : a))} />
        {par && <>
          {flyK < 0.99 && <Prenda img={par[0]} w={par[2]} p={[lerp(-0.06, 1.6, flyK), 0.022 + dropW * 0.55 + flyK * 0.5, lerp(0.02, -0.6, flyK)]} rot={0.08 + flyK * 1.5} spin={flyK * 0.6} sh={0.55 * (1 - cl(flyK * 3)) * (1 - cl(dropW * 4))} />}
          {t > mk - 0.05 && flyK < 0.99 && <Tiza p={[lerp(-0.06, 1.6, flyK), 0.03 + flyK * 0.5, lerp(0.02, -0.6, flyK)]} k={win(t, mk, mk + 0.4)} s={par[2] * 0.9} />}
          {t > in1 - 0.02 && <Prenda img={par[1]} w={par[3]} p={[0.04, 0.026 + dropR * 0.6, -0.01]} rot={-0.05 + 0.04 * foldK} sh={0.55 * (1 - cl(dropR * 4))} />}
        </>}
      </group>
      </group>
    </Esc>
  </Stage></BgCtx.Provider>;
};
