// lu01a · COMPONENTES CON FOTO (ola2). La boutique de Lucia en Milán: el mostrador de nogal lustrado, la bandeja de
// terciopelo bordó de las joyas, el mantel de lino del restaurante. Cada prenda es una foto cenital recortada
// (public/lu01a/objs) con su sombra real. Lo que no va recibe el SELLO rojo «NO» del negocio; Lucia escribe con PLUMA
// sobre las tarjetitas de la tienda.
import React from "react";
import { Stage } from "./base";
import { Esc, HAND, camA, canv, cl, lerp, rn, spr, win, type Pose, type V3 } from "./k3d";
import { Destello, Fondo, Obj, Tinta, arrow, escribir, pathP, ring, tinta } from "./foto";

export type Fi = { id: string; a: number; b: number; wow?: number | null; n?: number; k?: number; mo?: Record<string, number> };
type CP = { t: number; f: Fi };
const W = (f: Fi) => f.wow ?? f.a + 0.5;
const top = (t: number, a: number, b: number, x0: number, z0: number, h0: number, x1: number, z1: number, h1: number, fov = 30): Pose =>
  camA(t, a, b, { p: [x0, h0, z0 + h0 * 0.3], l: [x0, 0, z0], fov }, { p: [x1, h1, z1 + h1 * 0.24], l: [x1, 0, z1], fov }, 0.6);
const caer = (t: number, t0: number, H = 0.22, k = 1.1) => Math.max(0, 1 - spr(t, t0, k, 2.3)) * H;
const aparece = (t: number, t0: number) => win(t, t0 - 0.06, t0 + 0.12);
const M = (f: Fi, k: string, alt: number) => { const v = f.mo?.[k]; return v != null && v > f.a && v < f.b ? v : alt; };
const Escena: React.FC<{ cam: Pose; children: React.ReactNode }> = ({ cam, children }) => <Esc cam={cam} key1={[-0.5, 1.05, 0.3]} warm={0.65} exposure={1} cool={0.55}>{children}</Esc>;
const Banco = ({ w = 1.9 }: { w?: number }) => <group position={[0.32, 0, 0]}><Fondo id="f_banco" w={w + 0.4} o={0.72} /></group>;
// tarjetita de la tienda con lo escrito a pluma (cae y se escribe)
const Tarjeta: React.FC<{ k: string; txt: string; t: number; t0: number; tw: number; at: V3; r?: number; L?: number; size?: number }> = ({ k, txt, t, t0, tw, at, r = 0, L = 0.12, size = 110 }) => {
  const W2 = 512, H2 = 300, sz = Math.min(size * 1.6, 470 / (txt.length * 0.44));
  const tex = tinta("tj" + k, W2, H2, win(t, tw, tw + 0.25 + txt.length * 0.05), "pluma", (g, p) => escribir(g, txt, W2 / 2, H2 / 2, sz, p, HAND));
  return <Obj id="l_tarjeta" L={L} capas={3} p={[at[0], at[1] + caer(t, t0, 0.12), at[2]]} r={[0, r, 0]} op={aparece(t, t0)}>
    <group position={[-0.2 * L, 0.0062, 0.1 * L]}><Tinta tex={tex} w={L * 0.44} h={L * 0.44 * H2 / W2} p={[0, 0, 0]} /></group>
  </Obj>;
};
// el SELLO: la estampilla de goma baja, golpea, sube; queda la marca roja «NO» (tinta irregular, bordes de goma)
const Sello: React.FC<{ k: string; t: number; t0: number; at: V3; s?: number; r?: number }> = ({ k, t, t0, at, s = 0.16, r = -0.18 }) => {
  const baja = win(t, t0 - 0.35, t0), sube = win(t, t0 + 0.12, t0 + 0.5), y = 0.25 * (1 - baja) + 0.25 * sube;
  const marca = tinta("sello" + k, 600, 340, t > t0 ? 1 : 0, "labial", (g) => {
    g.lineWidth = 22; g.strokeRect(30, 30, 540, 280); g.font = `900 210px "Arial Black", Impact, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NO", 300, 180);
    g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 900; i++) { g.globalAlpha = 0.3 + 0.7 * rn(i, 11); g.fillRect(rn(i, 12) * 600, rn(i, 13) * 340, 2 + 5 * rn(i, 14), 1 + 3 * rn(i, 15)); }
    g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  });
  return <group position={at} rotation={[0, r, 0]}>
    <Tinta tex={marca} w={s} h={s * 340 / 600} p={[0, 0, 0]} op={0.88} />
    {t > t0 - 0.4 && t < t0 + 0.55 && <Obj id="l_sello" L={0.13} p={[0, 0.02 + y, 0]} r={[0, 0.4, 0]} sombra />}
  </group>;
};
const golpe = (t: number, t0: number, A = 0.004) => (t > t0 ? A * Math.exp(-(t - t0) * 10) * Math.sin((t - t0) * 80) : 0);

// ============ HILO · el mostrador: la prenda cae, el sello rojo dice NO ============
const ROPA: { id: string; L: number; dx?: number; dz?: number; r?: number }[][] = [
  [{ id: "l_leggings", L: 0.5 }],
  [{ id: "l_sneakers", L: 0.34 }],
  [{ id: "l_bolsa_grande", L: 0.5 }],
  [{ id: "l_vestido_negro", L: 0.55 }],
  [{ id: "l_collares", L: 0.32 }],
  [{ id: "l_cinturon", L: 0.4 }],
  [{ id: "l_rinonera", L: 0.32 }],
  [{ id: "l_blusas_baratas", L: 0.42 }],
  [{ id: "l_falda", L: 0.5 }],
  [{ id: "l_hoodie", L: 0.55 }],
];
const BUENO = [{ id: "l_cashmere", L: 0.3, x: -0.02, z: 0.02, r: 0.1 }, { id: "l_blusa_buena", L: 0.3, x: 0.26, z: -0.04, r: -0.12 }, { id: "l_cadena", L: 0.16, x: 0.12, z: 0.22, r: 0.3 }];
export const BorsaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, n = f.n ?? 0, w = W(f);
  if (n === 0) {
    const cam = top(t, a, b, -0.05, -0.06, 1.2, 0.02, -0.06, 1.08);
    return <Stage t={t} a={a} b={b} dim={0.6}>
      <Escena cam={cam}>
        <Banco />
        <Obj id="l_borsa" L={0.42} p={[-0.3, caer(t, a, 0.3, 0.9), -0.02]} r={[0, Math.PI / 2 - 0.15, 0]} op={aparece(t, a)} />
        {BUENO.map((o, i) => { const k = win(t, w - 0.1 + i * 0.9, w + 0.6 + i * 0.9); return <Obj key={o.id} id={o.id} L={o.L} p={[lerp(-0.28, o.x, k), 0.01 + 0.06 * Math.sin(Math.PI * k), lerp(0.0, i === 2 ? 0.13 : o.z, k)]} r={[0, o.r * k, 0]} op={win(t, w - 0.15 + i * 0.9, w + i * 0.9)} />; })}
        <Tarjeta k="giovane" txt="-10 years" t={t} t0={b - 3.2} tw={b - 2.8} at={[0.33, 0.004, 0.14]} r={0.08} L={0.34} size={130} />
      </Escena>
    </Stage>;
  }
  // la prenda cae con peso; al lado cae la etiqueta blanca grande de la tienda: el número a pluma arriba y el sello «NO» encima
  const ps = ROPA[n - 1], t0 = a + 0.02, ct = a + 0.45, st = w + 0.9, CX = 0.25, TL = 0.36;
  const cam = top(t, a, b, 0, 0.0, 1.05, 0.02, 0.0, 0.92);
  const sh = golpe(t, st);
  cam.p = [cam.p[0], cam.p[1] + sh, cam.p[2]];
  const num = tinta("hn" + n, 600, 300, win(t, w - 0.05, w + 0.35), "pluma", (g, p) => escribir(g, `n. ${n}`, 300, 150, 270, p, HAND));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      {ps.map((o, i) => <Obj key={o.id} id={o.id} L={o.L} luz={n === 3 ? 1.6 : 1.25} p={[(o.dx ?? 0) - 0.14, caer(t, t0 + i * 0.2, 0.32), o.dz ?? 0]} r={[0, (o.r ?? 0) + 0.05 * (n % 2 ? 1 : -1), 0]} op={aparece(t, t0 + i * 0.2)} />)}
      <Obj id="l_tarjeta" L={TL} capas={3} p={[CX, caer(t, ct, 0.14), 0.0]} op={aparece(t, ct)}>
        <group position={[-0.2 * TL, 0.0062, 0.02 * TL]}><Tinta tex={num} w={0.4 * TL} h={0.2 * TL} p={[0, 0, 0]} /></group>
      </Obj>
      <Sello k={String(n)} t={t} t0={st} at={[CX - 0.2 * TL, 0.014, 0.24 * TL]} s={0.36 * TL} r={-0.08 + 0.05 * (n % 3)} />
    </Escena>
  </Stage>;
};

// ============ strada · los leggings brillan como una calle mojada: un reflejo largo los recorre ============
export const StradaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0.0, 0.95, 0.03, 0.0, 0.85);
  // dos pasadas de luz recorren el cuero como los faros sobre el asfalto mojado
  const k = (t - (w - 1.6)) / 1.4, k2 = (t - (w + 0.1)) / 1.4;
  const brillo = canvBrillo();
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      <Obj id="l_leggings" L={0.5} luz={1.2} p={[-0.04, caer(t, a, 0.25), 0]} r={[0, Math.PI / 2 - 0.1, 0]} op={aparece(t, a)} />
      {[k, k2].map((q, i) => q > 0 && q < 1 && <mesh key={i} position={[lerp(-0.34, 0.3, q), 0.012, 0]} rotation={[-Math.PI / 2, 0, 0.5]}><planeGeometry args={[0.09, 0.55]} /><meshBasicMaterial map={brillo} transparent opacity={0.7 * Math.sin(Math.PI * q)} blending={2} depthWrite={false} toneMapped={false} /></mesh>)}
      <Tarjeta k="strada" txt="wet road." t={t} t0={w + 0.1} tw={w + 0.4} at={[0.3, 0.004, 0.04]} r={0.1} L={0.38} size={130} />
    </Escena>
  </Stage>;
};
const canvBrillo = () => canv("brillo-strada", 64, 256, (g) => { const gr = g.createLinearGradient(0, 0, 64, 0); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); });

// ============ matita · el taco fino es un lápiz; el ancho, dos pulgadas, camina Brera como una reina ============
export const MatitaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), lp = M(f, "lapiz", a + 2.3);
  // el fino (con su lápiz) queda a la izquierda y la tiza lo tacha; el ancho entra a la derecha y se mide: 2 in
  const cam = top(t, a, b, -0.16, -0.06, 0.62, 0.03, -0.06, 0.92);
  const cruz = tinta("cruzfino", 600, 400, win(t, w + 0.05, w + 0.55), "tiza", (g, p) => { g.lineWidth = 16; pathP(g, [[60, 50], [540, 350]], cl(p * 2)); pathP(g, [[540, 50], [60, 350]], cl(p * 2 - 1)); });
  const med = tinta("dos", 500, 520, win(t, w + 0.7, w + 1.5), "tiza", (g, p) => { g.lineWidth = 10; pathP(g, [[70, 40], [110, 40], [110, 480], [70, 480]], cl(p * 2)); escribir(g, "2 in", 300, 280, 150, cl(p * 2 - 1), HAND); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      <Obj id="l_tacon_fino" L={0.26} p={[-0.2, caer(t, a + 0.05, 0.2), -0.03]} op={aparece(t, a + 0.05)} capas={7} esp={0.0026} />
      <Obj id="l_lapiz" L={0.2} p={[-0.2, 0.004 + caer(t, lp, 0.2), 0.1]} r={[0, 0.0, 0]} op={aparece(t, lp)} />
      <Tinta tex={cruz} w={0.3} h={0.2} p={[-0.2, 0.03, 0.02]} />
      <Obj id="l_tacon_ancho" L={0.26} p={[lerp(0.45, 0.08, spr(t, w - 0.3, 0.9, 1.7)), 0, -0.02]} op={aparece(t, w - 0.3)} capas={7} esp={0.0026} />
      <Tinta tex={med} w={0.2} h={0.208} p={[0.27, 0.004, -0.01]} />
    </Escena>
  </Stage>;
};

// ============ boom · la bolsa enorme se inclina como la torre de Pisa… y cae sobre el mostrador: BOOM ============
export const BoomF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const sh = golpe(t, w, 0.03);
  const cam = top(t, a, b, 0, 0, 1.1, 0.0, 0.02, 0.9);
  cam.p = [cam.p[0] + sh, cam.p[1], cam.p[2]];
  const lean = 0.35 * win(t, a + 0.5, w - 1.5);
  const cosas: [string, number, number, number][] = [["l_paraguas", 0.26, -0.3, 0.14], ["l_labiales", 0.12, 0.27, 0.16], ["l_sandwich", 0.18, 0.28, -0.12], ["l_botella", 0.24, -0.27, -0.16]];
  const tilt = (t < w - 0.4 ? lean : 0);
  const pisa = tinta("pisa", 600, 600, win(t, a + 1.5, a + 3.5), "tiza", (g, p) => { g.lineWidth = 6; g.setLineDash([16, 12]); pathP(g, [[300, 560], [300, 60]], cl(p * 2)); g.setLineDash([]); pathP(g, [[300, 560], [480, 90]], cl(p * 2 - 1)); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      {t < w - 0.4 && <group position={[0, 0, 0]} rotation={[0, -tilt, 0]}><Obj id="l_bolsa_grande" L={0.5} p={[0, 0, 0]} /></group>}
      {t < w - 0.4 && <Tinta tex={pisa} w={0.22} h={0.22} p={[0.32, 0.004, 0.0]} />}
      {t >= w - 0.4 && <Obj id="l_bolsa_grande" L={0.55} p={[0, Math.max(0, 1 - win(t, w - 0.4, w)) ** 2 * 0.14, 0]} r={[0, -0.05 - 0.3 * (1 - win(t, w - 0.4, w)), 0]} />}
      {cosas.map(([id, L, x, z], i) => { const k = spr(t, w + 0.02 + i * 0.04, 1.2, 1.5); return t < w ? null : <Obj key={id} id={id} L={L} p={[x * cl(k), 0.02 + 0.05 * Math.sin(Math.PI * cl(k)), z * cl(k)]} r={[0, (i - 1.5) * 0.8 * cl(k), 0]} />; })}
      <Polvo t={t} t0={w} p={[0, 0.01, 0]} n={40} />
    </Escena>
  </Stage>;
};

// ============ vedova · el mismo vestido en azul, oliva, bordó. El azul es chic y lo perdona todo ============
export const VedovaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), ol = M(f, "oliva", a + 1.0), bo = M(f, "bordo", a + 2.0), ch = M(f, "chic", a + 3.0);
  const gana = win(t, ch, ch + 0.8);
  const cam = top(t, a, b, 0, 0, 1.25, 0.0, 0.0, 1.12);
  const V: [string, number, number, number][] = [["l_vestido_oliva", ol, -0.32, -0.1], ["l_vestido_bordo", bo, 0.32, -0.1], ["l_vestido_navy", a, 0, 0.0]];
  const aro = tinta("navyaro", 700, 900, win(t, ch - 0.1, ch + 0.7), "labial", (g, p) => { g.lineWidth = 9; pathP(g, ring(350, 450, 320, 420, 3), p); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco w={2.2} />
      {V.map(([id, t0, x, z], i) => { const nv = i === 2; return <Obj key={id} id={id} L={0.42} sc={nv ? 1 + 0.08 * gana : 1 - 0.08 * gana} luz={nv ? 1 : 1 - 0.35 * gana} p={[x, (nv ? 0.012 : 0) + caer(t, t0, 0.28), z]} r={[0, (i - 1) * 0.12, 0]} op={aparece(t, t0)} />; })}
      <Tinta tex={aro} w={0.4} h={0.51} p={[0, 0.03, 0.0]} />
      <Tarjeta k="chic" txt="navy." t={t} t0={ch + 0.4} tw={ch + 0.7} at={[0.17, 0.03, 0.14]} r={0.1} L={0.36} size={130} />
    </Escena>
  </Stage>;
};

// ============ frutta · clic, clic, clic: pulseras, collares, aros saltan con cada clic. Un puesto de fruta ============
export const FruttaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.95, 0.02, 0.02, 0.85);
  // cada «click» suelta una pieza que salta sobre el nogal, con su «click» escrito a pluma
  const C: [string, number, number, number][] = [["l_pulseras", 0.22, -0.22, 0.02], ["l_collares", 0.28, 0.03, -0.04], ["l_aros_grandes", 0.16, 0.24, 0.06]];
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      {C.map(([id, L, x, z], i) => { const tc = a + 0.08 + i * 0.5; const hop = t > tc ? Math.abs(Math.sin((t - tc) * 9)) * Math.exp(-(t - tc) * 4) * 0.05 : 0; return <Obj key={id} id={id} L={L} p={[x, hop + caer(t, tc - 0.05, 0.15), z]} r={[0, (i - 1) * 0.3, 0]} op={aparece(t, tc - 0.05)} />; })}
      {C.map(([, , x, z], i) => { const tc = a + 0.08 + i * 0.5; return <Tinta key={"c" + i} tex={tinta("click" + i, 500, 200, win(t, tc, tc + 0.2), "tiza", (g, p) => escribir(g, "click", 250, 100, 130, p, HAND))} w={0.12} h={0.048} p={[x, 0.004, z - 0.15]} />; })}
      <Tarjeta k="frutta" txt="fruit market." t={t} t0={w - 0.3} tw={w} at={[0.0, 0.004, 0.12]} r={-0.05} L={0.38} size={120} />
    </Escena>
  </Stage>;
};

// ============ una · una sola cosa buena: la cadena fina sobre el terciopelo; si amás tus pulseras, una sola pila ============
export const UnaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), ar = M(f, "aros", a + 4), st = M(f, "stack", a + 9.5), qu = M(f, "quiet", a + 12.2);
  const cam = top(t, a, b, 0, 0, 0.75, 0.03, 0.0, 0.66);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_terciopelo" w={1.4} o={0.55} luz={1 - 0.18 * win(t, qu, qu + 1.2)} />
      <Obj id="l_cadena" L={0.24} sc={1.15} p={[-0.07, caer(t, a, 0.18), -0.02]} op={aparece(t, a)} />
      <Destello p={[-0.04, 0.02, -0.04]} s={0.09} k={win(t, w, w + 0.25) * (1 - win(t, w + 0.6, w + 1.2))} />
      <Obj id="l_aros_perla" L={0.11} p={[0.14, caer(t, ar, 0.15), -0.08]} op={aparece(t, ar)} />
      <Obj id="l_pulseras" L={0.14} sc={0.85} p={[0.16, caer(t, st, 0.15), 0.03]} op={aparece(t, st)} />
      <Tinta tex={tinta("one", 512, 260, win(t, st + 0.8, st + 1.3), "tiza", (g, p) => escribir(g, "one.", 256, 130, 190, p, HAND))} w={0.13} h={0.066} p={[-0.07, 0.004, -0.02]} />
    </Escena>
  </Stage>;
};

// ============ canguro · la riñonera dibuja un círculo justo donde no querés que nadie mire ============
export const CanguroF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.85, 0.06, 0.0, 0.75);
  const blanco = tinta("blanco", 900, 900, win(t, w - 0.1, w + 1.6), "labial", (g, p) => { g.lineWidth = 24; pathP(g, ring(450, 450, 400, 330, 2), cl(p * 2)); pathP(g, ring(450, 450, 250, 200, 5), cl(p * 2 - 1)); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      <Obj id="l_rinonera" L={0.38} luz={1.2} p={[-0.06, caer(t, a, 0.25), 0]} op={aparece(t, a)} />
      <Tinta tex={blanco} w={0.5} h={0.5} p={[-0.06, 0.03, 0]} />
      <Obj id="l_labiales" L={0.12} p={[-0.24, caer(t, w - 0.3, 0.15), 0.1]} r={[0, 0.6, 0]} op={aparece(t, w - 0.3)} />
      <Obj id="l_bandolera" L={0.24} p={[lerp(0.7, 0.26, win(t, b - 1.4, b - 0.6)), 0.01, -0.06]} r={[0, -0.3, 0]} op={aparece(t, b - 1.4)} />
    </Escena>
  </Stage>;
};

// ============ dieci · una blusa buena vive más que diez baratas ============
export const DieciF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 1.05, 0.0, 0.02, 0.88);
  // la blusa buena sola contra el montón de diez baratas que cae con peso; la pluma escribe «>» grande entre las dos
  const mayor = tinta("mayor", 300, 300, win(t, w + 0.1, w + 0.6), "tiza", (g, p) => { g.lineWidth = 26; pathP(g, [[70, 50], [240, 150], [70, 250]], p); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      <Obj id="l_blusa_buena" L={0.32} p={[-0.27, caer(t, a, 0.22), -0.02]} op={aparece(t, a)} />
      <Obj id="l_blusas_baratas" L={0.3} p={[0.24, caer(t, w - 1.6, 0.45, 0.85), -0.02]} op={aparece(t, w - 1.6)} />
      <Tinta tex={mayor} w={0.16} h={0.16} p={[0, 0.004, -0.02]} />
      <Tarjeta k="uno" txt="1" t={t} t0={w - 0.8} tw={w - 0.6} at={[-0.27, 0.004, 0.13]} L={0.22} size={160} />
      <Tarjeta k="diez" txt="10" t={t} t0={w - 0.6} tw={w - 0.4} at={[0.24, 0.004, 0.14]} L={0.22} size={160} />
    </Escena>
  </Stage>;
};

// ============ pollice · la regla de la tienda: una pulgada debajo de la rodilla, o largo al tobillo; chato o taco de dos ============
export const PolliceF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), to = M(f, "tobillo", a + 4.5), ch = M(f, "chato", a + 11.5), ta = M(f, "taco", a + 13);
  const cam = top(t, a, b, 0, -0.05, 0.9, 0.0, 0.06, 1.45);
  const pul = tinta("pulgada", 900, 300, win(t, w - 0.1, w + 1.2), "tiza", (g, p) => { g.lineWidth = 10; g.setLineDash([26, 16]); pathP(g, [[30, 70], [870, 70]], cl(p * 2)); g.setLineDash([]); pathP(g, arrow(800, 70, 800, 190, 30), cl(p * 3 - 1.5)); escribir(g, "1 in", 600, 220, 130, cl(p * 2 - 1), HAND); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      <Obj id="l_falda" L={0.5} p={[-0.06, caer(t, a + 0.05, 0.2), -0.03]} op={aparece(t, a + 0.05)} capas={7} esp={0.0026} />
      <Obj id="l_cinta" L={0.2} p={[0.4, caer(t, a + 0.6, 0.15), -0.2]} r={[0, 0.5, 0]} op={aparece(t, a + 0.6)} />
      <Tinta tex={pul} w={0.66} h={0.22} p={[-0.06, 0.012, 0.27]} />
      <Obj id="l_tacon_ancho" L={0.27} p={[0.44, caer(t, ta, 0.2), 0.28]} op={aparece(t, ta)} capas={7} esp={0.0026} />
      <Obj id="l_chatas" L={0.25} p={[-0.43, caer(t, ch, 0.2), 0.28]} op={aparece(t, ch)} capas={7} esp={0.0026} />
    </Escena>
  </Stage>;
};

// ============ cucina · el mozo ve el buzo antes que a vos: la mesa al lado de la cocina ============
export const CucinaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 1.0, 0.04, 0.02, 0.8);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      <Obj id="l_hoodie" L={0.5} p={[-0.12, caer(t, a, 0.25), 0.02]} r={[0, 0.15, 0]} op={aparece(t, a)} />
      <Tarjeta k="cucina" txt="kitchen" t={t} t0={w - 0.25} tw={w + 0.05} at={[0.28, 0.004, -0.02]} r={-0.05} L={0.4} size={130} />
      <Sello k="cucina" t={t} t0={w + 1.6} at={[-0.1, 0.03, 0.04]} s={0.2} r={-0.04} />
    </Escena>
  </Stage>;
};

// ============ solange · la chaqueta oliva: se la puso, se miró un largo rato. «No está mal», en francés ============
export const SolangeF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 1.25, 0.1, 0.02, 1.35);
  // la tiza escribe grande, despacito, lo que dijo Madame Solange junto a la solapa
  const pm = tinta("pasmal2", 900, 300, win(t, w - 0.9, w + 0.3), "tiza", (g, p) => escribir(g, "pas mal.", 450, 170, 170, p, HAND));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Banco />
      <Obj id="l_chaqueta_oliva" L={0.56} p={[-0.1, caer(t, a, 0.2), 0.02]} op={aparece(t, a)} capas={7} esp={0.0026} />
      <Tinta tex={tinta("espejo", 1024, 1024, win(t, a + 1.0, w - 1.0), "tiza", (g, p) => { g.lineWidth = 12; pathP(g, ring(512, 512, 470, 480, 0), p); })} w={0.74} h={0.78} p={[-0.1, 0.006, 0.02]} />
      <Tinta tex={pm} w={0.6} h={0.2} p={[0.44, 0.04, 0.04]} r={[0, 0.12, 0]} />
      <Destello p={[0.0, 0.03, -0.1]} s={0.06} k={win(t, w - 0.1, w + 0.1) * (1 - win(t, w + 0.4, w + 0.8)) * 0.5} />
    </Escena>
  </Stage>;
};

export const _keep = { rn, ring };
