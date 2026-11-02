// lin01a · LOTE A: pin (0:157) · lupa (3:06) · tobogán (4:11) · escalera (6:14) · pie (7:55). Cada uno: objeto físico con material
// de verdad, el clip del momento hundido detrás (Stage), cámara en curva, el golpe en la palabra exacta (f.wow / at()).
import React from "react";
import * as THREE from "three";
import { Stage, at } from "./base";
import { HAND, Esc, M, RBox, camA, canv, cl, edgeAlpha, extr, fabricTex, flecos, Sombra, geo, useImg, Ready, handCard, lerp, printTex, rn, spr, tubeG, win, Blob, type V3 } from "./k3d";
import type { Fi } from "./valija";

// mesa de madera finita, fundida en el borde (lo de atrás es el clip)
export const Mesa: React.FC<{ w?: number; d?: number; col?: number[] }> = ({ w = 2.4, d = 1.6, col = [118, 78, 46] }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} />
    <meshStandardMaterial map={canv("mesa" + col.join(","), 512, 512, (g) => {
      g.fillStyle = `rgb(${col.join(",")})`; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 120; i++) { g.strokeStyle = `rgba(50,26,10,${0.05 + 0.12 * rn(i, 3)})`; g.lineWidth = 1 + 3 * rn(i, 4); g.beginPath(); const y = rn(i, 5) * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + 10 * rn(i, 6), 340, y - 10 * rn(i, 7), 512, y + 6 * rn(i, 8)); g.stroke(); }
      for (let k = 1; k < 4; k++) { g.fillStyle = "rgba(30,14,4,.5)"; g.fillRect(0, k * 128, 512, 2); }
    }, [2, 2])} roughness={0.62} alphaMap={edgeAlpha()} transparent />
  </mesh>
);
const tela = (k: string, w: number, d: number) => geo("tela" + k + w + d, () => {
  const g = new THREE.PlaneGeometry(w, d, 40, 40), p = g.attributes.position as THREE.BufferAttribute, s = k.length * 1.7;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); const q = (x * 0.8 + y * 0.6) / w; p.setZ(i, 0.007 * Math.sin(x * 19 + s) * Math.cos(y * 15 - s) + 0.003 * Math.sin((x + y) * 31) + 0.022 * Math.exp(-Math.pow((q - 0.08 * Math.sin(s)) / 0.06, 2)) + 0.05 * Math.pow(Math.max(0, (x - y) / w - 0.35), 2) * 4); }
  g.computeVertexNormals(); return g;
});

// ═════════ PIN: las alas doradas giran y se enfocan; detrás se abren 35 tarjetas de embarque; la 35 recibe el sello ═════════
const ALA = [[0.018, 0.012], [0.05, 0.03], [0.1, 0.042], [0.15, 0.04], [0.175, 0.032], [0.178, 0.024], [0.16, 0.02], [0.163, 0.013], [0.14, 0.008], [0.14, 0.0], [0.115, -0.003], [0.112, -0.011], [0.088, -0.011], [0.082, -0.019], [0.058, -0.017], [0.05, -0.022], [0.03, -0.017], [0.018, -0.012]];
const pase = (i: number, stamp = 0) => stamp >= 0 && i === 34 ? pase35(stamp) : printTex(`pase${i % 6}`, 640, 256, "#f4f0e6", [
  ["BOARDING PASS", 28, 34, 26, "#33415c"], ["SEAT", 28, 104, 18, "#7a8496", "700"], [`${8 + (i * 7) % 24}${"ABCDEF"[i % 6]}`, 28, 140, 44, "#1d2430"],
  ["GATE", 200, 104, 18, "#7a8496", "700"], [`${"ABCD"[i % 4]}${3 + (i * 5) % 19}`, 200, 140, 44, "#1d2430"], ["ROW", 360, 104, 18, "#7a8496", "700"], [`${8 + (i * 7) % 24}`, 360, 140, 44, "#1d2430"],
], (g) => {
  g.fillStyle = "#33415c"; g.fillRect(0, 0, 640, 12); g.fillStyle = "#d9a84a"; g.fillRect(0, 244, 640, 12);
  g.setLineDash([6, 8]); g.strokeStyle = "rgba(60,60,60,.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(480, 20); g.lineTo(480, 236); g.stroke(); g.setLineDash([]);
  for (let k = 0; k < 26; k++) { g.fillStyle = "#1d2430"; g.fillRect(500 + k * 4.6, 60, 1 + (rn(k + i, 1) * 3 | 0), 150); }
  if (stamp > 0) { g.save(); g.translate(250, 175); g.rotate(-0.16); g.globalAlpha = 0.88 * Math.min(1, stamp * 1.4); g.strokeStyle = "#c62a22"; g.lineWidth = 7; g.strokeRect(-150, -46, 300, 92); g.fillStyle = "#c62a22"; g.font = "900 64px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("35 YEARS", 0, 4); g.restore(); }
});
const pase35 = (stamp: number) => printTex(`pase35|${Math.round(stamp * 12)}`, 640, 256, "#f6f2e8", [["BOARDING PASS", 28, 34, 26, "#33415c"]], (g) => {
  g.fillStyle = "#33415c"; g.fillRect(0, 0, 640, 12); g.fillStyle = "#d9a84a"; g.fillRect(0, 244, 640, 12);
  g.setLineDash([6, 8]); g.strokeStyle = "rgba(60,60,60,.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(520, 20); g.lineTo(520, 236); g.stroke(); g.setLineDash([]);
  for (let k = 0; k < 20; k++) { g.fillStyle = "#1d2430"; g.fillRect(540 + k * 4.6, 60, 1 + (rn(k, 1) * 3 | 0), 150); }
  if (stamp > 0) { const k = Math.min(1, stamp * 1.4); g.save(); g.translate(260, 142); g.rotate(-0.12); g.scale(1.25 - 0.25 * k, 1.25 - 0.25 * k); g.globalAlpha = 0.9 * k; g.strokeStyle = "#c62a22"; g.lineWidth = 9; g.strokeRect(-200, -58, 400, 116); g.fillStyle = "#c62a22"; g.font = "900 76px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("35 YEARS", 0, 6); g.restore(); }
});
export const Pin: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, op = a + 0.25;
  const spin = 1 - spr(t, op, 0.42, 1.4), turn = spin * Math.PI * 3.2;
  const cam = camA(t, a, b, { p: [0.25, 0.03, 1.45], l: [0, 0.0, 0], fov: 32 }, { p: [-0.12, 0.05, 1.75], l: [0, -0.01, -0.05], fov: 32 });
  const N = 35, fan0 = a + 0.6, fan1 = wow - 0.2;
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#ffd98a">
    <Esc cam={cam} key1={[-0.8, 1.4, 1.6]} warm={0.7}>
      {/* el abanico de tarjetas: semicírculo arriba del pin, pivote abajo; cada una llega a su ángulo con resorte */}
      <group position={[0, -0.21, -0.25]}>
        {Array.from({ length: N - 1 }, (_, i) => {
          const ti = lerp(fan0, fan1, i / (N - 2)), k = spr(t, ti, 1.1, 1.6);
          if (t < ti - 0.02) return null;
          const ang = lerp(1.5, -1.5, i / (N - 2));
          return <group key={i} rotation={[0, 0, ang * k]} position={[0, 0, i * 0.0016]}>
            <mesh position={[0, 0.36, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow><planeGeometry args={[0.24, 0.096]} /><meshStandardMaterial map={pase(i)} roughness={0.55} side={THREE.DoubleSide} /></mesh>
          </group>;
        })}
      </group>
      {/* la 35: sale al frente, abajo del pin, y recibe el sello en el golpe */}
      {t > wow - 0.4 && <group position={[0, -0.285 + 0.25 * (1 - spr(t, wow - 0.4, 1, 1.5)), 0.2]} rotation={[-0.12, 0, 0.04 * (1 - spr(t, wow - 0.4, 1, 1.5))]}>
        <mesh castShadow><planeGeometry args={[0.34, 0.136]} /><meshStandardMaterial map={pase35(win(t, wow, wow + 0.12))} roughness={0.5} /></mesh>
      </group>}
      {/* el pin: dos alas con bisel + escudo central con estrella, bronce dorado pulido */}
      <group rotation={[0.06 * Math.sin(t * 0.8), turn + 0.18 * Math.sin((t - a) * 0.6), 0.03 * Math.sin(t)]} scale={1.1 + 0.3 * spr(t, a, 0.6)}>
        {[1, -1].map((sx) => <mesh key={sx} scale={[sx, 1, 1]} geometry={extr("ala2", ALA, 0.007, 0.0045)} castShadow><meshPhysicalMaterial color="#f2c75e" metalness={1} roughness={0.09} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={2.4} side={THREE.DoubleSide} /></mesh>)}
        {[0.03, 0.06, 0.09, 0.12].map((x) => [1, -1].map((sx) => <mesh key={x + "" + sx} position={[sx * x, 0.008 - x * 0.08, 0.0055]} rotation={[0, 0, sx * -0.35]}><boxGeometry args={[0.0015, 0.028, 0.002]} /><meshStandardMaterial color="#9a7426" metalness={1} roughness={0.35} /></mesh>))}
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.012, 48]} /><meshStandardMaterial color="#e9b94e" metalness={1} roughness={0.1} envMapIntensity={1.6} /></mesh>
        <mesh position={[0, 0, 0.0065]} geometry={extr("estrella", Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 0.008 : 0.019, q = i / 10 * Math.PI * 2 + Math.PI / 2; return [Math.cos(q) * r, Math.sin(q) * r]; }), 0.003, 0.001)}><meshStandardMaterial color="#f4d27a" metalness={1} roughness={0.12} /></mesh>
        <mesh position={[0, 0, -0.012]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.016, 12]} />{M.steel()}</mesh>
      </group>
    </Esc>
  </Stage>;
};

// ═════════ LUPA: la lupa de bronce recorre algodón, lino y lana (dentro del vidrio, la trama ×3); las etiquetas se dan vuelta ═════════
const TELAS: { k: "jersey" | "lino" | "lana"; x: number; word: string; label: string }[] = [
  { k: "jersey", x: -0.37, word: "cotton t-shirt", label: "100% COTTON" }, { k: "lino", x: 0, word: "or linen", label: "100% LINEN" }, { k: "lana", x: 0.37, word: "soft knit", label: "COTTON + WOOL" }];
const lensTex = (k: "jersey" | "lino" | "lana", u: number, v: number, mag: number, frac: number) => {
  const base = fabricTex(k), key = `lens${k}`;
  let t = (lensTex as unknown as Record<string, THREE.Texture>)[key];
  if (!t) { t = base.clone(); t.needsUpdate = true; (lensTex as unknown as Record<string, THREE.Texture>)[key] = t; }
  const r = frac / mag; t.repeat.set(r, r); t.offset.set(u - r / 2, v - r / 2); return t;
};
export const Lupa: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, S = 0.3, LR = 0.1;
  const ts = TELAS.map((x) => at(x.word, a - 0.6)), flip = at("three of them", a);
  // posición de la lupa: visita cada tela en su palabra; entre una y otra sube
  let lx = TELAS[0].x, lift = 0.25 * (1 - spr(t, ts[0] - 0.5, 0.8));
  for (let i = 1; i < 3; i++) { const k = win(t, ts[i] - 0.55, ts[i] - 0.05); lx = lerp(lx, TELAS[i].x, k); lift += 0.06 * Math.sin(Math.PI * k); }
  const out = spr(t, flip - 0.35, 1.4, 1.2); lift += 0.05 * Math.sin(Math.PI * cl(out));
  const lz = lerp(0.02 + 0.03 * Math.sin((t - a) * 0.9), -0.26, out), cur = lx < -0.18 ? 0 : lx < 0.18 ? 1 : 2, tx = TELAS[cur];
  const u = 0.5 + (lx - tx.x) / S, v = 0.5 - (lz - 0) / S, ly = 0.08 + lift;
  const cam0 = camA(t, a, b, { p: [-0.28, 0.6, 0.58], l: [-0.3, 0, 0.02], fov: 36 }, { p: [0.03, 0.82, 1.02], l: [0.01, 0, 0.06], fov: 38 });
  const dx = 0.35 * (lx + 0.3) * (1 - cl(out)), cam = { ...cam0, p: [cam0.p[0] + dx, cam0.p[1], cam0.p[2]] as V3, l: [cam0.l[0] + dx, cam0.l[1], cam0.l[2]] as V3 };
  return <Stage t={t} a={a} b={b} dim={0.55}>
    <Esc cam={cam} key1={[-1.2, 1.8, 0.9]}>
      <Sombra o={0.45} />
      {TELAS.map((x, i) => {
        const fk = spr(t, flip + i * 0.28, 1.2, 1.5);
        return <group key={x.k} position={[x.x, 0.013 + 0.002 * i, 0]} rotation={[0, 0.05 * (i - 1), 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow geometry={tela(x.k, S, S)}><meshPhysicalMaterial map={fabricTex(x.k)} bumpMap={fabricTex(x.k)} bumpScale={2.5} alphaMap={flecos()} alphaTest={0.4} transparent roughness={0.95} sheen={1} sheenColor="#ffffff" sheenRoughness={0.5} side={THREE.DoubleSide} /></mesh>
          {/* etiqueta de composición cosida al borde: boca abajo → se da vuelta */}
          <group position={[0.06, -0.009, S / 2 - 0.02]} rotation={[0, 0, 0]}>
            <group rotation={[-Math.PI * (1 - fk) * 0.98, 0, 0]}>
              <mesh position={[0, 0, 0.088]} rotation={[-Math.PI / 2, 0, 0]} castShadow={fk > 0.5}><planeGeometry args={[0.14, 0.175]} /><meshStandardMaterial map={printTex("lab" + x.label, 256, 320, "#f7f5f0", [[x.label.split(" ")[0], 22, 140, x.label.length > 11 ? 50 : 62, "#24324e"], [x.label.split(" ").slice(1).join(" "), 22, 210, 44, "#24324e"]], (g) => { g.strokeStyle = "#c9c2b5"; g.lineWidth = 6; g.strokeRect(10, 10, 236, 300); })} roughness={0.4} /></mesh>
              <mesh position={[0, -0.0005, 0.088]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.14, 0.175]} /><meshStandardMaterial color="#ece8df" roughness={0.5} /></mesh>
            </group>
          </group>
        </group>;
      })}
      {/* lupa */}
      <group position={[lx, ly, lz]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[LR, 0.008, 20, 72]} /><meshStandardMaterial color="#c8973c" metalness={1} roughness={0.22} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}><circleGeometry args={[LR, 64]} /><meshBasicMaterial map={lensTex(tx.k, u, v, 2.3, (2 * LR) / S)} toneMapped={false} color="#f4efe6" /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}><circleGeometry args={[LR, 64]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0} clearcoat={1} metalness={0.2} /></mesh>
        <mesh position={[LR + 0.07, 0, 0.03]} rotation={[0, -0.4, Math.PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.015, 0.13, 24]} />{M.wood({ base: [80, 40, 20] })}</mesh>
        <mesh position={[LR + 0.012, 0, 0.004]} rotation={[0, -0.4, Math.PI / 2]}><cylinderGeometry args={[0.013, 0.013, 0.03, 24]} />{M.brass()}</mesh>
      </group>
    </Esc>
  </Stage>;
};

// calzado de foto (Nano Banana → rembg, visto desde arriba) apoyado: capas apiladas que oscurecen hacia abajo = la suela con espesor
export const Calzado: React.FC<{ img: string; L: number; capas?: number; esp?: number; suela?: string }> = ({ img, L, capas = 6, esp = 0.0025, suela = "#3a2a20" }) => {
  const [tex, done] = useImg("lin01a/prendas/" + img + ".png");
  const ar = tex?.image ? (tex.image as HTMLImageElement).width / (tex.image as HTMLImageElement).height : 0.4, W = L * ar;
  if (!tex) return null;
  return <group>
    <Ready dep={tex} done={done} />
    {Array.from({ length: capas }, (_, i) => { const top = i === capas - 1; return <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, (i + 1) * esp, 0]} castShadow={i === 0} receiveShadow={top}>
      <planeGeometry args={[W, L]} />
      {top ? <meshPhysicalMaterial map={tex} transparent alphaTest={0.4} roughness={0.5} clearcoat={0.3} /> : <meshStandardMaterial map={tex} color={suela} transparent alphaTest={0.4} roughness={0.8} />}
    </mesh>; })}
  </group>;
};

// ═════════ TOBOGÁN: se infla; el taco baja, se clava, la goma se rasga en rojo; el de atrás no puede bajar ═════════
const SL = { w: 0.7, L: 2.5 };
const slideY = (s: number, x = 0) => 0.08 + 1.05 * Math.pow(1 - s, 1.35) + 0.05 * Math.pow(x / 0.35, 2);
const slideZ = (s: number) => -1.25 + 2.3 * s;
const slideG = (inf: number) => geo("slide" + Math.round(inf * 40), () => {
  const g = new THREE.PlaneGeometry(SL.w, 1, 24, 90), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), s = 0.5 - p.getY(i); p.setXYZ(i, x, 0.02 + (slideY(s, x) - 0.02) * (0.25 + 0.75 * inf), slideZ(s)); }
  g.computeVertexNormals(); return g;
});
const slideTex = () => canv("slideT", 256, 512, (g) => {
  g.fillStyle = "#f3c21a"; g.fillRect(0, 0, 256, 512);
  for (let y = 0; y < 512; y += 64) { g.fillStyle = "rgba(150,100,0,.28)"; g.fillRect(0, y, 256, 3); g.fillStyle = "rgba(255,240,170,.35)"; g.fillRect(0, y + 4, 256, 2); }
  for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(120,80,0,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 512, 2, 2); }
});
const cartelG = (inf: number) => geo("cartel" + Math.round(inf * 40), () => {
  const g = new THREE.PlaneGeometry(0.6, 0.16, 40, 6), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const s = 0.47 - p.getX(i) / 2.3, x = 0.2 - p.getY(i); p.setXYZ(i, x, 0.02 + (slideY(s, x) - 0.02) * (0.25 + 0.75 * inf) + 0.004, slideZ(s)); }
  g.computeVertexNormals(); return g;
});
const slideAt = (s: number, x = 0): { p: V3; ang: number } => {
  const y = slideY(s, x), dy = slideY(s + 0.01, x) - y, dz = slideZ(s + 0.01) - slideZ(s);
  return { p: [x, y, slideZ(s)], ang: Math.atan2(-dy, dz) };
};
// zapato de taco: perfil lateral extruido (charol rojo) + taco aguja
const TACO = [[0.12, 0], [0.125, 0.018], [0.09, 0.04], [0.04, 0.05], [-0.02, 0.055], [-0.07, 0.085], [-0.105, 0.095], [-0.112, 0.08], [-0.1, 0.07], [-0.05, 0.035], [0.02, 0.008], [0.06, 0]];
export const Taco: React.FC<{ col?: string }> = ({ col = "#b3161c" }) => <group>
  <mesh rotation={[0, Math.PI / 2, 0]} geometry={extr("taco", TACO, 0.062, 0.008)} castShadow><meshPhysicalMaterial color={col} roughness={0.18} clearcoat={1} clearcoatRoughness={0.05} /></mesh>
  <mesh position={[0, 0.045, 0.1]} rotation={[0.08, 0, 0]} castShadow><cylinderGeometry args={[0.005, 0.0035, 0.09, 12]} /><meshPhysicalMaterial color={col} roughness={0.2} clearcoat={1} /></mesh>
</group>;
const Zapatilla: React.FC = () => <group>
  <RBox s={[0.085, 0.022, 0.25]} r={0.01} p={[0, 0.011, 0]}><meshStandardMaterial color="#e9e6df" roughness={0.7} /></RBox>
  <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0.02, 0]} geometry={extr("zap", [[0.12, 0], [0.1, 0.04], [0.02, 0.07], [-0.06, 0.08], [-0.12, 0.085], [-0.125, 0], [0.12, 0]], 0.07, 0.012)} castShadow><meshStandardMaterial color="#f5f3ee" roughness={0.85} /></mesh>
</group>;
export const Tobogan: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const T = { infl: at("command we're trained", a) - 0.2, tear: at("a heel can tear", a), catch_: at("catch in it", a), behind: at("the person behind", a) };
  const inf = spr(t, T.infl, 0.7, 2.2);
  // el taco: cae arriba en el golpe, baja acelerando, se clava al «tear», se frena del todo en «catch»
  const s0 = 0.06, sDig = 0.48, sStop = 0.53;
  const s = t < wow ? s0 : t < T.tear ? lerp(s0, sDig, Math.pow(cl((t - wow) / (T.tear - wow)), 1.8)) : lerp(sDig, sStop, 1 - Math.exp(-(t - T.tear) * 2.2));
  const dig = win(t, T.tear, T.tear + 0.5), drop = (1 - spr(t, wow, 1.1, 1.4)) * 0.4;
  const h = slideAt(s, -0.04), gash = win(t, T.tear + 0.05, T.catch_ + 0.4);
  const zs = t < T.behind ? 0.02 : Math.min(sStop - 0.27, lerp(0.02, sStop - 0.27, Math.pow(cl((t - T.behind) / 0.9), 1.6))), z2 = slideAt(zs, 0.08);
  const bump = t > T.behind + 0.9 ? Math.exp(-(t - T.behind - 0.9) * 5) * Math.sin((t - T.behind - 0.9) * 30) : 0;
  const cam = camA(t, a, b, { p: [2.1, 1.5, 1.9], l: [0, 0.5, -0.1], fov: 34 }, { p: [0.75, slideY(sDig) + 0.45, slideZ(sDig) + 0.6], l: [-0.02, slideY(sDig), slideZ(sDig) - 0.05], fov: 32 });
  const hp = slideAt(sStop - 0.12, -0.04);
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#fff2b0">
    <Esc cam={cam} key1={[-1.4, 2.6, 1.2]} exposure={1.05}>
      <Sombra w={4} d={4} o={0.5} />
      {/* la puerta (maqueta): marco blanco arriba del tobogán */}
      <RBox s={[1.0, 1.1, 0.12]} r={0.03} p={[0, 1.55 * (0.25 + 0.75 * inf), -1.32]}><meshStandardMaterial color="#e8e8e4" roughness={0.5} /></RBox>
      {/* «TAKE THEM OFF» pintado a lo largo de la goma (sigue la curva), se lee subiendo en diagonal */}
      {t > wow - 0.1 && <mesh geometry={cartelG(inf)}><meshStandardMaterial map={printTex("takeoff5", 800, 214, "rgba(0,0,0,0)", [["TAKE THEM OFF", 30, 112, 82, "#c62a22", "900"]])} transparent opacity={cl((t - wow + 0.1) * 4)} roughness={0.5} depthWrite={false} polygonOffset polygonOffsetFactor={-4} polygonOffsetUnits={-4} /></mesh>}
      <mesh geometry={slideG(inf)} receiveShadow castShadow><meshPhysicalMaterial map={slideTex()} roughness={0.32} clearcoat={0.7} clearcoatRoughness={0.25} side={THREE.DoubleSide} emissive="#3a2400" emissiveIntensity={0.15} /></mesh>
      {[-1, 1].map((sx) => <mesh key={sx} castShadow geometry={tubeG("rail" + sx + Math.round(inf * 40), Array.from({ length: 12 }, (_, i) => { const q = i / 11; return [sx * 0.41, 0.02 + (slideY(q, 0.35) + 0.06 - 0.02) * (0.25 + 0.75 * inf), slideZ(q)]; }), 0.075 * (0.4 + 0.6 * inf), 80, 24)}><meshPhysicalMaterial color="#f2b812" roughness={0.3} clearcoat={0.8} /></mesh>)}

      {t > wow - 0.05 && <group position={[h.p[0], h.p[1] + 0.003 + drop, h.p[2]]} rotation={[h.ang, 0.25, 0]}>
        <group rotation={[-0.35 * dig, 0, 0]}><group rotation={[0, Math.PI, 0]}><Calzado img="g02_plataforma_L" L={0.52} capas={12} esp={0.004} suela="#5a3d24" /></group></group>
        {/* la rasgadura: nace en el talón y se abre hacia arriba; tajo con resplandor rojo */}
        {gash > 0.01 && <group position={[0, 0.012 - drop, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -0.13 - 0.26 * gash]} scale={[1, gash, 1]}><planeGeometry args={[0.36, 0.72]} /><meshBasicMaterial map={canv("glowR", 128, 256, (g) => { const gr = g.createRadialGradient(64, 128, 4, 64, 128, 64); gr.addColorStop(0, "rgba(255,70,30,1)"); gr.addColorStop(1, "rgba(255,40,20,0)"); g.setTransform(1, 0, 0, 2, 0, -128); g.fillStyle = gr; g.fillRect(0, 0, 128, 256); })} transparent opacity={0.85 * (0.75 + 0.25 * Math.sin(t * 9))} toneMapped={false} depthWrite={false} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} /></mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -0.13 - 0.26 * gash]} scale={[1, gash, 1]}><planeGeometry args={[0.13, 0.52]} /><meshBasicMaterial map={canv("tajo3", 96, 256, (g) => {
            const lens = (k: number) => { g.beginPath(); g.moveTo(48, 2); g.quadraticCurveTo(48 + 46 * k, 128, 48, 254); g.quadraticCurveTo(48 - 46 * k, 128, 48, 2); };
            g.lineJoin = "round"; lens(1); g.lineWidth = 9; g.strokeStyle = "#fff0a0"; g.stroke();
            lens(0.92); const gr = g.createLinearGradient(8, 0, 88, 0); gr.addColorStop(0, "#3a1606"); gr.addColorStop(0.5, "#0c0402"); gr.addColorStop(1, "#5a2408"); g.fillStyle = gr; g.fill();
            g.save(); lens(0.92); g.clip(); g.lineWidth = 7; g.strokeStyle = "rgba(150,90,0,.9)"; g.beginPath(); g.moveTo(48, 2); g.quadraticCurveTo(48 - 42, 128, 48, 254); g.stroke(); g.restore();
            g.fillStyle = "#c98f10"; for (let y = 24; y < 232; y += 16) { const w = 42 * Math.sin(y / 256 * Math.PI); g.fillRect(48 + w - 2, y, 7, 2); g.fillRect(48 - w - 5, y + 8, 7, 2); }
          })} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-8} polygonOffsetUnits={-8} /></mesh>
        </group>}
      </group>}
      {t > T.behind - 0.05 && <group position={[z2.p[0], z2.p[1] + 0.003, z2.p[2] + 0.01 * bump]} rotation={[z2.ang, -0.15, 0]} ><group rotation={[0, Math.PI, 0]}><Calzado img="g02b_zapatillas_L" L={0.5} capas={8} esp={0.004} suela="#bdb8ae" /></group></group>}
    </Esc>
  </Stage>;
};

// ═════════ ESCALERA: escalón de aluminio mojado bajo la lluvia; la ojota se desliza y cae por el borde, el zapato cerrado queda ═════════
const OJOTA = Array.from({ length: 24 }, (_, i) => { const q = i / 24 * Math.PI * 2; const w = 0.045 + 0.012 * Math.cos(q) + 0.006 * Math.cos(2 * q); return [Math.sin(q) * w * (q < Math.PI ? 1 : 0.95), -Math.cos(q) * 0.125]; });
const Ojota: React.FC = () => <group>
  <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={extr("ojota", OJOTA, 0.016, 0.004)} castShadow position={[0, 0.008, 0]}><meshPhysicalMaterial color="#7fb4d9" roughness={0.55} clearcoat={0.3} /></mesh>
  <mesh castShadow geometry={tubeG("tira", [[-0.042, 0.016, 0.0], [-0.025, 0.04, -0.045], [0, 0.03, -0.085], [0.025, 0.04, -0.045], [0.042, 0.016, 0.0]], 0.006, 50, 10)}><meshStandardMaterial color="#2f6f9c" roughness={0.5} /></mesh>
</group>;
const Chata: React.FC = () => <mesh rotation={[0, Math.PI / 2, 0]} geometry={extr("chata", [[0.125, 0], [0.12, 0.025], [0.07, 0.045], [0.0, 0.055], [-0.08, 0.06], [-0.125, 0.055], [-0.128, 0]], 0.08, 0.012)} castShadow><meshPhysicalMaterial color="#6b4127" roughness={0.45} clearcoat={0.4} /></mesh>;
const stepTex = () => canv("step", 256, 256, (g) => { g.fillStyle = "#9da3a8"; g.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(255,255,255,.16)"; g.fillRect(x, 0, 8, 256); g.fillStyle = "rgba(0,0,0,.14)"; g.fillRect(x + 10, 0, 8, 256); } }, [2, 1]);
export const Escalera: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, out = at("right out", a);
  const slide = win(t, wow, out) * 0.09, tip = spr(t, out, 0.9, 1.3), fallK = cl((t - out - 0.12) / 0.5);
  const cam = camA(t, a, b, { p: [0.62, 0.72, 0.42], l: [0.02, 0.38, -0.45], fov: 32 }, { p: [0.34, 1.62, 1.12], l: [0.04, 0.26, -0.33], fov: 34 });
  const stepH = 0.2, stepD = 0.28;
  return <Stage t={t} a={a} b={b} dim={0.5} tint="#cfe3ff">
    <Esc cam={cam} key1={[-1.0, 2.2, 1.6]} warm={0.6} cool={1.6} exposure={0.95}>
      {[0, 1, 2].map((i) => <group key={i} position={[0, i * stepH, -i * stepD]}>
        <RBox s={[0.95, 0.04, stepD + 0.02]} r={0.008} p={[0, 0.02, 0]}><meshPhysicalMaterial map={stepTex()} metalness={0.85} roughness={0.32} clearcoat={1} clearcoatRoughness={0.08} /></RBox>
        {Array.from({ length: 40 }, (_, k) => <mesh key={k} position={[(rn(k + i * 30, 1) - 0.5) * 0.85, 0.041, (rn(k + i * 30, 2) - 0.5) * 0.25]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.0015 + 0.0025 * rn(k, 3), 10, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transmission={0.9} transparent opacity={0.55} clearcoat={1} /></mesh>)}
      </group>)}
      {[-1, 1].map((sx) => <group key={sx}>
        <mesh position={[sx * 0.49, 0.18, -0.28]} rotation={[Math.atan2(0.6, 0.84) - Math.PI / 2 + Math.PI / 2, 0, 0]} castShadow><boxGeometry args={[0.03, 0.12, 1.1]} />{M.steel({ col: "#b8bec4" })}</mesh>
        <mesh castShadow geometry={tubeG("bar" + sx, [[sx * 0.5, 0.95, -0.8], [sx * 0.5, 0.75, -0.3], [sx * 0.5, 0.55, 0.2]], 0.014, 30, 12)}>{M.chrome()}</mesh>
        {[-0.6, -0.1].map((z) => <mesh key={z} position={[sx * 0.5, 0.5 + (-z - 0.1) * 0.6, z]}><cylinderGeometry args={[0.009, 0.009, 0.42, 12]} />{M.chrome()}</mesh>)}
      </group>)}
      {/* lluvia: hilos que caen y anillos en el aluminio */}
      {Array.from({ length: 70 }, (_, k) => { const x = (rn(k, 4) - 0.5) * 1.6, z = (rn(k, 5) - 0.6) * 1.4, y = 1.6 - ((t * 2.6 + rn(k, 6) * 1.6) % 1.6); return <mesh key={"r" + k} position={[x, y, z]}><cylinderGeometry args={[0.0012, 0.0012, 0.09, 4]} /><meshBasicMaterial color="#dceeff" transparent opacity={0.45} depthWrite={false} /></mesh>; })}
      {Array.from({ length: 10 }, (_, k) => { const ph = (t * 1.3 + rn(k, 7)) % 1; return <mesh key={"a" + k} position={[(rn(k, 8) - 0.5) * 0.8, 2 * stepH + 0.045, -2 * stepD + (rn(k, 9) - 0.5) * 0.24]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.004 + ph * 0.03, 0.006 + ph * 0.03, 32]} /><meshBasicMaterial color="#e6f4ff" transparent opacity={0.6 * (1 - ph)} depthWrite={false} /></mesh>; })}
      {/* zapato cerrado: firme en el escalón de arriba */}
      <group position={[-0.2, 2 * stepH + 0.042, -2 * stepD + 0.02]} rotation={[0, 0.15, 0]} ><Blob w={0.2} d={0.46} o={0.5} y={0.001} /><Calzado img="g03b_chatas_L" L={0.42} capas={7} esp={0.003} suela="#4a2c1a" /></group>
      {/* «THE HEEL»: tiza roja sobre el escalón, nace en la palabra */}
      {t > wow - 0.05 && <mesh position={[-0.12, stepH + 0.0415, -stepD + 0.01]} rotation={[-Math.PI / 2, 0, 0.05]} scale={0.7 + 0.3 * spr(t, wow - 0.05, 1.4, 1.4)}><planeGeometry args={[0.32, 0.096]} /><meshBasicMaterial map={printTex("heel2", 600, 180, "rgba(0,0,0,0)", [["THE HEEL", 30, 96, 104, "#d8352b", "900"]])} transparent opacity={cl((t - wow + 0.05) * 5)} depthWrite={false} polygonOffset polygonOffsetFactor={-4} polygonOffsetUnits={-4} /></mesh>}
      {/* la ojota: el talón se va hacia el borde, se inclina y cae al escalón de abajo */}
      <group position={[0.16, 2 * stepH + 0.042 - fallK * fallK * stepH * 1.0 + (fallK >= 1 ? 0.01 * Math.exp(-(t - out - 0.62) * 6) : 0), -2 * stepD + 0.02 + slide + fallK * 0.2]} rotation={[0.9 * tip * (1 - cl(fallK * 1.4)), -0.25 + 0.4 * fallK, 0]}><Blob w={0.2} d={0.46} o={0.5 * (1 - cl(tip * 3)) + 0.5 * cl((fallK - 0.9) * 10)} y={0.001} /><Calzado img="g03_ojotas_L" L={0.42} capas={5} esp={0.003} suela="#5f8fb3" /></group>
    </Esc>
  </Stage>;
};

// ═════════ PIE: mocasín de cuero; la horma de madera adentro se hincha con las horas (asoma por la boca, el cuero se tensa
// y se enrojece en el golpe); el contador de vuelo rueda 00 → 11; la etiqueta del talle: «size 8» → «feels 7» ═════════
const HUELLA = Array.from({ length: 160 }, (_, i) => { const q = i / 160 * Math.PI * 2, x = Math.cos(q) * 0.135; const w = (x > 0 ? 0.046 - 0.02 * Math.pow(x / 0.135, 4) : 0.036 + 0.006 * (1 + x / 0.135)); return [x, Math.sin(q) * w]; });
const capellada = () => geo("capelladaG", () => {
  const sh = new THREE.Shape(HUELLA.map(([x, y]) => new THREE.Vector2(x * 0.985, y * 0.96)));
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 8, curveSegments: 64 });
  g.translate(0, 0, -0.02); const P = g.attributes.position;
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), z = P.getZ(i); if (z < 0) { const u = (x + 0.135) / 0.27; P.setZ(i, z * (1.15 - 0.6 * Math.pow(u, 1.6))); } }
  g.computeVertexNormals(); return g;
});
const BOCA = Array.from({ length: 28 }, (_, i) => { const q = i / 28 * Math.PI * 2; return [-0.045 + Math.cos(q) * 0.068, Math.sin(q) * 0.03]; });
// contador mecánico: dos dígitos que ruedan (canvas por fracción cuantizada)
const rodillo = (v: number) => { const q = Math.round(v * 20) / 20; return canv("rod" + q, 256, 160, (g) => {
  g.fillStyle = "#16181d"; g.fillRect(0, 0, 256, 160);
  const dig = (d: number, x: number, frac: number) => { for (let k = -1; k <= 1; k++) { const n = ((d + k) % 10 + 10) % 10, y = 80 - (k - frac) * 120; g.fillStyle = "#f2ecdc"; g.fillRect(x - 52, y - 58, 104, 116); g.fillStyle = "#1d2430"; g.font = "900 100px Montserrat, Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), x, y + 4); } };
  const u = Math.floor(q) % 10, fu = q % 1, tens = Math.floor(q / 10), ft = u === 9 ? fu : 0;
  dig(tens, 66, ft); dig(u, 190, fu);
  const gr = g.createLinearGradient(0, 0, 0, 160); gr.addColorStop(0, "rgba(0,0,0,.75)"); gr.addColorStop(0.3, "rgba(0,0,0,0)"); gr.addColorStop(0.7, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,.75)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 160);
}); };
// etiqueta del talle: «size 8» impreso, tachado en el golpe, y abajo a mano en rojo «feels 7»
const talle = (k: number, w: number) => { const qk = Math.round(k * 12) / 12, qw = Math.round(w * 24) / 24; return canv(`talle${qk}|${qw}|${document.fonts.check(`700 40px "${HAND}"`)}`, 400, 310, (g) => {
  g.fillStyle = "#efe4c8"; g.fillRect(0, 0, 400, 310); g.fillStyle = "#3a2a1a"; g.beginPath(); g.arc(40, 40, 14, 0, 7); g.fill();
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#1d2430"; g.font = "800 92px Montserrat, Arial"; g.fillText("SIZE 8", 210, 95);
  if (qk > 0) { g.strokeStyle = "#c62a22"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(50, 110); g.lineTo(50 + 320 * qk, 80); g.stroke(); }
  if (qw > 0) { g.save(); g.beginPath(); g.rect(0, 150, 400 * qw, 160); g.clip(); g.fillStyle = "#c62a22"; g.font = `700 120px "${HAND}"`; g.fillText("feels 7", 200, 228); g.restore(); }
}); };
export const Pie: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, h0 = at("every long flight", a), h1 = wow - 0.15;
  const hrs = 11 * Math.pow(cl((t - h0) / (h1 - h0)), 1.15), sw = cl(hrs / 11), press = win(t, wow - 0.05, wow + 0.2) * (1 - 0.5 * win(t, b - 0.8, b)) * (0.7 + 0.3 * Math.sin((t - wow) * 9));
  const cam = camA(t, a, b, { p: [0.4, 0.33, 0.54], l: [0.05, 0.05, 0], fov: 30 }, { p: [0.15, 0.31, 0.6], l: [0.05, 0.045, 0], fov: 30 });
  const leatherM = <meshPhysicalMaterial color="#5c351f" roughness={0.38} clearcoat={0.6} clearcoatRoughness={0.3} emissive="#c81e0e" emissiveIntensity={0.3 * press} />;
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Esc cam={cam} key1={[-0.9, 1.6, 1.4]}>
      <Mesa w={1.6} d={1.1} col={[96, 62, 38]} />
      <group rotation={[0, -0.25, 0]}>
        {/* suela y capellada (la capellada se estira con la horma) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.009, 0]} geometry={extr("suela", HUELLA, 0.018, 0.003)} castShadow receiveShadow><meshStandardMaterial color="#2a1a10" roughness={0.75} /></mesh>
        <group position={[0, 0.018, 0]} scale={[1 + 0.02 * sw, 1 + 0.1 * sw, 1 + 0.09 * sw]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.026, 0]} geometry={capellada()} castShadow receiveShadow>{leatherM}</mesh>
          {/* costura del mocasín y antifaz */}
          <mesh position={[0.055, 0.067, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.033, 40, 1, -Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#d9b98a" roughness={0.8} /></mesh>
          <RBox s={[0.012, 0.006, 0.07]} r={0.002} p={[0.02, 0.066, 0]}><meshPhysicalMaterial color="#4a2a17" roughness={0.4} clearcoat={0.6} /></RBox>
          {/* arrugas que aparecen con la presión */}
          {[0.07, 0.085, 0.1].map((x, i) => <mesh key={x} position={[x, 0.06 - i * 0.004, 0]} rotation={[-Math.PI / 2, 0, 0.2 * (i - 1)]}><planeGeometry args={[0.004, 0.07]} /><meshBasicMaterial color="#2b170b" transparent opacity={0.55 * sw} depthWrite={false} /></mesh>)}
          {/* la boca: hueco oscuro */}
          <mesh position={[0, 0.0665, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={geo("bocaG", () => new THREE.ShapeGeometry(new THREE.Shape(BOCA.map(([x, y]) => new THREE.Vector2(x, y)))))}><meshStandardMaterial color="#1c1009" roughness={1} /></mesh>
        </group>
        {/* la horma de madera: asoma por la boca y crece */}
        <group position={[-0.055, 0.06 + 0.025 * sw, 0]} scale={[1 + 0.12 * sw, 1 + 0.25 * sw, 1 + 0.22 * sw]}>
          <mesh castShadow><capsuleGeometry args={[0.026, 0.06, 8, 32]} /><meshStandardMaterial map={canv("hormaT", 256, 256, (g) => { g.fillStyle = "#c79a64"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(110,64,28,${0.1 + 0.2 * rn(i, 2)})`; g.lineWidth = 2; g.beginPath(); g.moveTo(0, rn(i, 3) * 256); g.bezierCurveTo(90, rn(i, 4) * 256, 170, rn(i, 5) * 256, 256, rn(i, 6) * 256); g.stroke(); } })} roughness={0.5} /></mesh>
          <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.006, 0.006, 0.02, 16]} />{M.brass()}</mesh>
        </group>
        {/* etiqueta del talle colgada del talón */}
        <group position={[-0.08, 0.05, 0.115]} rotation={[0, 0.6, -0.1]}>
          <mesh castShadow><planeGeometry args={[0.09, 0.07]} /><meshStandardMaterial map={talle(win(t, wow - 0.05, wow + 0.1), win(t, wow + 0.1, wow + 0.6))} roughness={0.85} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>
      {/* el contador de horas de vuelo */}
      <group position={[0.2, 0.065, -0.1]} rotation={[0, -0.45, 0]}>
        <RBox s={[0.15, 0.12, 0.03]} r={0.008}>{M.brass({ col: "#b98c3e" })}</RBox>
        <mesh position={[0, 0.034, 0.0155]}><planeGeometry args={[0.13, 0.03]} /><meshStandardMaterial map={printTex("hrs", 512, 118, "#1c1f26", [["HOURS IN THE AIR", 30, 60, 50, "#e9d9a8"]])} roughness={0.6} /></mesh>
        <mesh position={[0, -0.014, 0.0156]}><planeGeometry args={[0.11, 0.0688]} /><meshStandardMaterial map={rodillo(hrs)} roughness={0.35} emissive="#000" /></mesh>
      </group>
    </Esc>
  </Stage>;
};
