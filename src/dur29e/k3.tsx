// dur29 · puente entre los componentes únicos (d en cuadros, beats p.at en cuadros) y el kit 3D (h3d, tiempo en segundos).
// U3: la foto del momento queda DETRÁS como telón desenfocado (textura con blur, dentro de la escena 3D) y también debajo del
// iris, así la entrada nace de la foto. La salida se funde en los últimos 0,8 s del plano.
import React from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Cam, Floor, Scene3D, rn, tex } from "./h3d";

const IMG = new Map<string, THREE.Texture | "wait">();
// textura de una imagen de public/ (blur en px del lienzo de 1024). Bloquea el render hasta que carga.
export const useImg = (src?: string, blur = 0) => {
  const key = (src ?? "") + "|" + blur;
  const [, set] = React.useState(0);
  // el delayRender va en el inicializador (durante el render), no en un efecto: si no, el cuadro sale antes de que cargue
  const [h] = React.useState(() => (src && !(IMG.get(key) instanceof THREE.Texture) ? delayRender("img3d " + src) : null));
  React.useEffect(() => {
    const done = () => { if (h !== null) continueRender(h); };
    if (!src) return;
    const v = IMG.get(key); if (v instanceof THREE.Texture) { set((x) => x + 1); done(); return; }
    const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => {
      if (!(IMG.get(key) instanceof THREE.Texture)) {
        const w = 1024, hh = Math.round(1024 * im.height / im.width), cv = document.createElement("canvas"); cv.width = w; cv.height = hh;
        const g = cv.getContext("2d")!; if (blur) { g.filter = `blur(${blur}px)`; g.drawImage(im, -blur * 2, -blur * 2, w + blur * 4, hh + blur * 4); } else g.drawImage(im, 0, 0, w, hh);
        const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; IMG.set(key, t);
      }
      set((x) => x + 1); done();
    };
    im.onerror = done;
    im.src = staticFile(src);
  }, [key]);
  const v = IMG.get(key); return v instanceof THREE.Texture ? v : null;
};
export const dirtT = (b: number[]) => { const t = tex.text("dirt" + b.join(","), 512, 512, (g) => {
  g.fillStyle = `rgb(${b.join(",")})`; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 3000; i++) { const v = (rn(i, 1) - 0.5) * 50; g.fillStyle = `rgba(${b[0] + v},${b[1] + v * 0.85},${b[2] + v * 0.7},.55)`; const r = 1 + rn(i, 2) * 4; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, r, r); }
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(40,25,15,${0.08 + 0.1 * rn(i, 5)})`; g.beginPath(); g.ellipse(rn(i, 6) * 512, rn(i, 7) * 512, 6 + 20 * rn(i, 8), 3 + 8 * rn(i, 9), rn(i, 10) * 3, 0, 7); g.fill(); }
}); t.repeat.set(8, 8); return t; };
export const sec = (p: any, k: string, def: number) => (p && p.at && typeof p.at[k] === "number" ? p.at[k] / 30 : def);

export const U3: React.FC<{ d: number; bg?: string; cam: Cam; mode?: "iris" | "wipe" | "split" | "drop"; floor?: Floor; wall?: "tile" | "dark" | "wood" | "none";
  sky?: string; ground?: number[] | null; key1?: number[]; warm?: number; lamp?: number[]; backZ?: number; backW?: number; backDim?: number; children: (tt: number) => React.ReactNode; over?: (tt: number) => React.ReactNode }> =
  ({ d, bg, cam, mode = "iris", floor = "none", wall = "none", sky = "#15110e", ground = [128, 92, 62], key1, warm, lamp, backZ, backW = 9, backDim = 0.55, children, over }) => {
  const f = useCurrentFrame(), t = f / 30, out = Math.max(1, d / 30 - 0.8);
  const tx = useImg(bg, 14);
  const gr = ground ? <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 14]} /><meshStandardMaterial map={dirtT(ground)} roughness={1} /></mesh> : null;
  // sin backZ: telón cilíndrico alrededor de la escena (la foto en espejo) para que ningún ángulo de cámara vea el negro detrás del piso
  const txC = React.useMemo(() => { if (!tx) return null; const c = tx.clone(); c.wrapS = THREE.MirroredRepeatWrapping; c.repeat.set(4, 1); c.needsUpdate = true; return c; }, [tx]);
  const back = backZ === undefined ? (txC ? <mesh position={[0, 2.2, 0]}><cylinderGeometry args={[6.5, 6.5, 5.4, 64, 1, true]} /><meshBasicMaterial map={txC} side={THREE.BackSide} color={new THREE.Color(backDim, backDim * 0.97, backDim * 0.94)} toneMapped={false} fog={false} /></mesh> : null)
    : tx ? <mesh position={[0, backW * 0.28 - 0.2, backZ]}><planeGeometry args={[backW, backW * 9 / 16]} /><meshBasicMaterial map={tx} color={new THREE.Color(backDim, backDim * 0.97, backDim * 0.94)} toneMapped={false} fog={false} /></mesh> : null;
  return <AbsoluteFill style={{ background: "#0c0a09" }}>
    {bg && <AbsoluteFill style={{ filter: "blur(10px) brightness(.6)", transform: "scale(1.08)" }}><Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>}
    <Scene3D t={t} h={{ k: "", at: 0, out }} cam={cam} mode={mode} floor={floor} wall={wall} bg={sky} back={<>{back}{gr}</>} key1={key1} warm={warm} lamp={lamp} over={over}>{children}</Scene3D>
  </AbsoluteFill>;
};
