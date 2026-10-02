// Helpers 3D compartidos por los componentes de huevo (LorEgg3D, LorDevilTray3D). Texturas procedurales en canvas,
// PRNG determinista (nunca Math.random: el farm rinde en chunks). Reusable por el canal.
import * as THREE from "three";
import { rnd } from "./LorTheme";

export function canvasTex(draw: (c: CanvasRenderingContext2D, S: number) => void, S = 512, repeat = 1) {
  const cv = document.createElement("canvas"); cv.width = cv.height = S;
  const c = cv.getContext("2d")!; draw(c, S);
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat);
  t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function dots(c: CanvasRenderingContext2D, S: number, seed: number, n: number, col: string, rMin: number, rMax: number, alpha = 1) {
  c.fillStyle = col; c.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const x = rnd(seed + i * 3) * S, y = rnd(seed + i * 3 + 1) * S, r = rMin + rnd(seed + i * 3 + 2) * (rMax - rMin);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = 1;
}
// perfil de un huevo (radio en función de la altura normalizada t∈[0,1], 0 = punta fina, 1 = base ancha)
export const eggR = (t: number, a = 0.62) => a * Math.pow(Math.sin(Math.PI * t), 0.52) * (0.82 + 0.26 * t);
// puntos del contorno de la mitad derecha del huevo (para LatheGeometry y ShapeGeometry)
export function eggProfile(n = 40, a = 0.62, h = 1.6): any[] {
  const pts: any[] = [];
  for (let i = 0; i <= n; i++) { const t = i / n; pts.push(new THREE.Vector2(Math.max(0.0001, eggR(t, a)), h * (0.5 - t))); }
  return pts;
}
export const ease = (x: number) => x * x * (3 - 2 * x);
