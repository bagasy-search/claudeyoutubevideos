// he01a · COMPONENTES CON FOTO (ola2). El departamento de Hélène en París: parquet de espiga color miel, la mesita de
// mármol del café, y la caja de mudanza abierta donde va todo lo que «nunca más». Cada prenda es una foto cenital recortada
// (public/he01a/objs) con su sombra real. Se escribe con LABIAL ROJO (el de Madame Lefort) y, para subrayar, con PLUMÓN.
import React from "react";
import { Stage } from "./base";
import { Esc, HAND, camA, cl, lerp, rn, spr, win, type Pose, type V3 } from "./k3d";
import { Destello, Fondo, Obj, Tinta, arrow, brocha, escribir, pathP, ring, tinta } from "./foto";

export type Fi = { id: string; a: number; b: number; wow?: number | null; n?: number; k?: number; mo?: Record<string, number> };
type CP = { t: number; f: Fi };
const W = (f: Fi) => f.wow ?? f.a + 0.5;
const top = (t: number, a: number, b: number, x0: number, z0: number, h0: number, x1: number, z1: number, h1: number, fov = 30): Pose =>
  camA(t, a, b, { p: [x0, h0, z0 + h0 * 0.3], l: [x0, 0, z0], fov }, { p: [x1, h1, z1 + h1 * 0.24], l: [x1, 0, z1], fov }, 0.6);
const caer = (t: number, t0: number, H = 0.22, k = 1.1) => Math.max(0, 1 - spr(t, t0, k, 2.3)) * H;
const aparece = (t: number, t0: number) => win(t, t0 - 0.06, t0 + 0.12);
// momento de la voz si cae dentro del tramo; si no, el respaldo
const M = (f: Fi, k: string, alt: number) => { const v = f.mo?.[k]; return v != null && v > f.a && v < f.b ? v : alt; };
const Escena: React.FC<{ cam: Pose; children: React.ReactNode }> = ({ cam, children }) => <Esc cam={cam} key1={[-0.5, 1.05, 0.35]} warm={0.6} exposure={1} cool={0.6}>{children}</Esc>;
const Piso = () => <Fondo id="f_parquet" w={2.2} o={0.7} />;
// labial / plumón: texto escrito sobre la superficie
const Lab: React.FC<{ k: string; txt: string; p: number; at: V3; w: number; kind?: "labial" | "pincel"; r?: number }> = ({ k, txt, p, at, w, kind = "labial", r = 0 }) => {
  const size = 160, W2 = Math.max(400, txt.length * size * 0.6), H2 = size * 1.6;
  const tex = tinta(k, W2, H2, p, kind, (g, q) => escribir(g, txt, W2 / 2, H2 / 2, size, q, HAND));
  return <Tinta tex={tex} w={w} h={w * H2 / W2} p={at} r={[0, r, 0]} />;
};

// ============ HILO · la caja de mudanza «nunca más»: cada prenda cae adentro y el labial suma una raya en la solapa ============
const CAJA_W = 1.8, CAJA_H = CAJA_W * 756 / 1344;
// medidos sobre f_caja: interior centrado en (u .52, v .49); solapa de abajo en v .82
const DENTRO: V3 = [(0.52 - 0.5) * CAJA_W, 0, (0.49 - 0.5) * CAJA_H], SOLAPA = (0.82 - 0.5) * CAJA_H;
const PRENDAS: { id: string; L: number; dx?: number; dz?: number; r?: number }[][] = [
  [{ id: "h_blusa_flores", L: 0.5 }],
  [{ id: "h_anteojos_negros", L: 0.4 }],
  [{ id: "h_cuello_negro", L: 0.46 }],
  [{ id: "h_collar_dorado", L: 0.26, dx: -0.16, dz: -0.02 }, { id: "h_aros", L: 0.2, dx: 0.16, dz: -0.08 }, { id: "h_panuelo", L: 0.3, dx: 0.08, dz: 0.08 }],
  [{ id: "h_cartera_lisa", L: 0.44 }],
  [{ id: "h_calzas", L: 0.5, r: 1.5708 }],
  [{ id: "h_zapatillas", L: 0.46 }],
  [{ id: "h_tunica", L: 0.5 }, { id: "h_cinturon", L: 0.44, dz: -0.02, r: 0 }],
  [{ id: "h_puffer", L: 0.58 }],
  [{ id: "h_jeans", L: 0.44, dx: -0.1 }, { id: "h_falda", L: 0.44, dx: 0.1, r: -0.15 }],
];
// rayitas de conteo en la solapa de abajo (de a cinco, la quinta cruzada)
const Rayas: React.FC<{ n: number; p: number }> = ({ n, p }) => {
  const tex = tinta("rayas" + n, 900, 260, p, "labial", (g, q) => {
    g.lineWidth = 14;
    for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), j = i % 5, x = 60 + grp * 330 + j * 52, last = i === n - 1, k = last ? q : 1;
      if (j === 4) pathP(g, [[x - 230, 200], [x + 10, 60]], k); else pathP(g, [[x, 40], [x - 6, 220]], k); }
  });
  return <Tinta tex={tex} w={0.38} h={0.11} p={[0.2, 0.004, SOLAPA]} r={[0, 0.02, 0]} />;
};
// armario0: las 10 caen de a una dentro de la caja y el labial las cuenta con rayas
const DIEZ: [string, number, number, number, number][] = [["h_anteojos_negros", 0.13, 0, 0, 0.1], ["h_cuello_negro", 0.16, 0, 0, -0.1], ["h_collar_dorado", 0.12, 0, 0, 0.3],
  ["h_cartera_lisa", 0.15, 0, 0, 0.1], ["h_calzas", 0.17, 0, 0, 0.2], ["h_zapatillas", 0.15, 0, 0, -0.2], ["h_tunica", 0.17, 0, 0, 0.1], ["h_aros", 0.09, 0, 0, 0],
  ["h_puffer", 0.17, 0, 0, -0.1], ["h_jeans", 0.17, 0, 0, 0.15]].map(([id, L, , , r], i) => [id, L, (i % 5 - 2) * 0.125, (Math.floor(i / 5) - 0.5) * 0.18, r] as [string, number, number, number, number]);
export const ArmarioF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, n = f.n ?? 0, w = W(f);
  if (n === 0) {
    const cam = top(t, a, b, 0.02, 0.04, 1.15, 0.02, 0.1, 0.98);
    const T0 = (i: number) => w - 0.35 + i * 0.42, cuenta = DIEZ.filter((_, i) => t > T0(i) + 0.2).length;
    return <Stage t={t} a={a} b={b} dim={0.6}>
      <Escena cam={cam}>
        <Fondo id="f_caja" w={CAJA_W} o={0.5} />
        {DIEZ.map(([id, L, x, z, r], i) => <Obj key={id} id={id} L={L} p={[DENTRO[0] + x, caer(t, T0(i), 0.5, 1.0), DENTRO[2] + 0.02 + z]} r={[0, r, 0]} op={aparece(t, T0(i))} />)}
        {cuenta > 0 && <Rayas n={cuenta} p={win(t, T0(cuenta - 1) + 0.2, T0(cuenta - 1) + 0.4)} />}
        <Lab k="nunca" txt="nunca más" p={win(t, T0(9) + 0.5, T0(9) + 1.4)} at={[-0.15, 0.004, SOLAPA]} w={0.46} />
      </Escena>
    </Stage>;
  }
  // la prenda entra flotando cerca de la cámara (grande, se mece) y en el número CAE a la caja: golpe, sombra, rótulo y raya
  const ps = PRENDAS[n - 1], t0 = a + 0.05, td = w - 0.2, golpe = 0.012 * Math.exp(-(t - td - 0.35) * 9) * Math.sin((t - td - 0.35) * 40) * (t > td + 0.35 ? 1 : 0);
  const cam0 = top(t, a, b, 0.02, 0.04, 1.3, 0.02, 0.05, 1.24), cam: Pose = { ...cam0, p: [cam0.p[0], cam0.p[1] + golpe, cam0.p[2]] as V3 };
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <group position={[0, -0.003, 0]}><Fondo id="f_parquet" w={6} o={0} /></group>
      <Fondo id="f_caja" w={CAJA_W} o={0.72} />
      {/* la prenda entra desde arriba a la caja, ya con su número: cae, se asienta, la sombra la ancla adentro */}
      {ps.map((o, i) => { const ti = td + i * 0.12, sway = 0.06 * Math.sin((t - t0) * 2.2 + i) * (t < ti ? 1 : 0);
        return <Obj key={o.id} id={o.id} L={o.L} p={[DENTRO[0] + (o.dx ?? 0), caer(t, ti, 0.16, 1.3) + 0.004 * i, DENTRO[2] + (o.dz ?? 0)]} r={[0, (o.r ?? 0) + 0.05 * (n % 2 ? 1 : -1) + sway, 0]} op={aparece(t, t0 + i * 0.1)} capas={8} esp={0.0028} luz={/negr|cuello|calzas|puffer/.test(o.id) ? 1.35 : 1.08} />; })}
      {n === 5 && <Tinta tex={tinta("logo5", 1024, 1024, win(t, w + 0.2, w + 1.5), "labial", (g, p) => { g.lineWidth = 26; pathP(g, ring(512, 512, 330, 250, 5), p); })} w={0.56} h={0.56} p={[DENTRO[0], 0.03, DENTRO[2]]} />}
      <Lab k={"num" + n} txt={`Nº ${n}`} p={win(t, w + 0.05, w + 0.55)} at={[-0.17, 0.004, SOLAPA - 0.02]} w={0.3} />
      <Rayas n={n} p={win(t, w + 0.75, w + 1.25)} />
    </Escena>
  </Stage>;
};

// ============ odile · todo, todo encima: perlas, collar dorado, aros, pañuelo, blusa, cinturón… se apilan ============
export const OdileF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const T = ["perlas", "dorado", "aros", "panuelo", "blusa", "cinturon"].map((k, i) => i === 0 ? a - 0.4 : M(f, k, a + 0.3 + i * 1.4));
  // cada pieza cae en su palabra alrededor de la blusa (sin taparla); la cámara arranca pegada a las perlas y se abre a «todo.»
  const P: [string, number, number, number, number][] = [["h_blusa_flores", 0.5, 0, 0.0, 0], ["h_perlas", 0.26, -0.33, -0.08, 0.2], ["h_collar_dorado", 0.24, 0.33, -0.1, -0.3], ["h_aros", 0.18, -0.34, 0.2, 0], ["h_panuelo", 0.3, 0.35, 0.16, 0.5], ["h_cinturon", 0.42, 0, 0.26, 0]];
  const ord = [1, 2, 3, 4, 0, 5];
  const cam = top(t, a, b, -0.3, -0.06, 0.62, 0, 0.03, 1.6);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Piso />
      {P.map(([id, L, x, z, r], i) => { const t0 = T[ord.indexOf(i)]; return <Obj key={id} id={id} L={L} p={[x, 0.004 * (i + 1) + caer(t, t0, 0.25), z]} r={[0, r, 0]} op={aparece(t, t0)} capas={7} esp={0.0026} />; })}
      <Lab k="todo" txt="todo." p={win(t, w - 0.1, w + 0.5)} at={[0, 0.03, -0.26]} w={0.56} />
    </Escena>
  </Stage>;
};

// ============ plumón · los anteojos negros gruesos subrayan cada línea de la cara: el plumón tacha fuerte ============
export const PlumonF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, -0.02, 0.0, 0.75, 0.0, 0.0, 0.62);
  // lo que no quieres que lean, a lápiz; el plumón lo subraya grueso, una palabra tras otra
  const PAL: [string, number, number][] = [["ojeras", -0.2, a + 1.6], ["arrugas", 0.0, a + 2.6], ["todo", 0.2, a + 3.6]];
  const sp = win(t, w - 0.15, w + 1.65) * 3, seg = Math.min(2, Math.floor(sp)), q = sp - seg;
  const sub = tinta("subraya", 1200, 160, sp / 3, "pincel", (g) => { PAL.forEach(([, x], i) => { const x0 = (x + 0.3 - 0.09) / 0.6 * 1200, x1 = (x + 0.3 + 0.09) / 0.6 * 1200; brocha(g, [[x0, 80], [x1, 76]], cl(sp - i), 46, i + 2); }); });
  const px = PAL[seg][1] - 0.09 + 0.18 * cl(q), act = win(t, w - 0.5, w - 0.15) * (1 - win(t, w + 1.7, w + 2.1));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_cafe" w={1.3} o={0.5} />
      <Obj id="h_anteojos_negros" L={0.22} p={[-0.02, caer(t, a + 0.35, 0.22), -0.06]} r={[0, 0.05, 0]} op={aparece(t, a + 0.35)} />
      {PAL.map(([txt, x, t0]) => <Tinta key={txt} tex={tinta("pal" + txt, 700, 220, win(t, t0, t0 + 0.6), "lapiz", (g, p) => escribir(g, txt, 350, 120, 130, p, HAND))} w={0.2} h={0.063} p={[x, 0.004, 0.05]} />)}
      <Tinta tex={sub} w={0.6} h={0.08} p={[0, 0.005, 0.1]} />
      <Obj id="h_plumon" L={0.15} p={[px + 0.06, 0.02 + 0.04 * (1 - act), 0.128]} r={[0, 0.6, 0]} op={act} />
    </Escena>
  </Stage>;
};

// ============ una · antes de salir, sacate una cosa: el pañuelo se va del conjunto. −1 ============
export const UnaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), sale = win(t, w + 0.1, w + 0.9);
  const cam = top(t, a, b, 0, 0.04, 1.4, 0.02, 0.04, 1.65);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Piso />
      <Obj id="h_camisa_blanca" L={0.38} p={[-0.02, 0, -0.12]} />
      <Obj id="h_pantalon_recto" L={0.5} p={[-0.02, 0.002, 0.18]} />
      <Obj id="h_bailarinas" L={0.18} p={[0.27, 0, 0.33]} r={[0, 0.2, 0]} />
      <Obj id="h_perlas" L={0.17} p={[0.25, 0.004, -0.24]} />
      {/* el pañuelo se levanta y sale volando en curva por la derecha; el labial anota «-1» donde estaba */}
      <Obj id="h_panuelo" L={0.24} p={[-0.02 + sale * sale * 0.95, 0.012 + 0.22 * Math.sin(Math.PI * Math.min(1, sale * 1.3)), -0.24 - sale * 0.1]} r={[0, sale * 2.2, 0]} op={1 - win(t, w + 0.75, w + 0.9)} />
      <Lab k="menos1" txt="-1" p={win(t, w + 0.5, w + 1.0)} at={[-0.02, 0.03, -0.2]} w={0.62} />
    </Escena>
  </Stage>;
};

// ============ lefort · el pan, pantalón recto al tobillo, chatos, labial rojo. 84 años ============
export const LefortF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), pa = M(f, "pantalon", a + 2.8), ch = M(f, "chatos", a + 5.6), y84 = M(f, "y84", w + 0.2);
  const cam = top(t, a, b, 0, 0, 1.25, 0.03, 0.0, 1.1);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Piso />
      <Obj id="h_baguette" L={0.46} p={[-0.32, caer(t, a + 0.35, 0.22), 0.0]} r={[0, 1.2, 0]} op={aparece(t, a + 0.35)} />
      <Obj id="h_pantalon_recto" L={0.6} p={[0.0, caer(t, pa, 0.25), 0.0]} op={aparece(t, pa)} />
      <Obj id="h_bailarinas" L={0.18} p={[0.27, caer(t, ch, 0.22), 0.15]} r={[0, 0.25, 0]} op={aparece(t, ch)} />
      <Obj id="h_labial" L={0.12} p={[0.42, caer(t, w - 0.6, 0.2), -0.04]} r={[0, -0.6, 0]} op={aparece(t, w - 0.6)} />
      <Lab k="y84" txt="84" p={win(t, y84, y84 + 0.8)} at={[0.27, 0.004, -0.16]} w={0.34} />
    </Escena>
  </Stage>;
};

// ============ barcos · las zapatillas de suela gorda: dos barcos. El labial les dibuja el mar ============
export const BarcosF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.85, 0, 0.0, 0.78);
  // el mar a labial rodea las zapatillas, que se mecen como dos barcos
  const mar = tinta("mar", 1400, 700, win(t, a + 0.2, w + 0.5), "labial", (g, p) => { g.lineWidth = 13; [110, 590].forEach((y, j) => pathP(g, Array.from({ length: 70 }, (_, i) => [30 + i * 19.6, y + Math.sin(i * 0.55 + j * 2) * 26]), cl(p * 1.6 - j * 0.5))); });
  const bob = Math.sin((t - a) * 3.0);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Piso />
      <Tinta tex={mar} w={0.62} h={0.31} p={[0, 0.002, 0.0]} />
      <group rotation={[0, 0, bob * 0.05]}><Obj id="h_zapatillas" L={0.24} p={[0, 0.008 + Math.abs(bob) * 0.006 + caer(t, a + 0.35, 0.2), 0]} r={[0, bob * 0.05, 0]} op={aparece(t, a + 0.35)} /></group>
      <Lab k="barcos" txt="dos barcos." p={win(t, w - 0.2, w + 0.5)} at={[0.22, 0.004, -0.17]} w={0.32} />
    </Escena>
  </Stage>;
};

// ============ flecha · el cinturón ancho sobre la túnica señala la panza: «aquí está» ============
export const FlechaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 1.0, 0.06, 0.0, 0.82);
  const fl = tinta("aqui", 900, 500, win(t, w - 0.3, w + 0.5), "labial", (g, p) => { g.lineWidth = 28; pathP(g, arrow(840, 70, 270, 390, 90), p); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Piso />
      <Obj id="h_tunica" L={0.6} p={[0, 0, 0]} />
      <Obj id="h_cinturon" L={0.36} p={[0, 0.02 + caer(t, a + 0.35, 0.22), 0.04]} op={aparece(t, a + 0.35)} />
      <Tinta tex={fl} w={0.45} h={0.25} p={[0.2, 0.03, -0.06]} />
      <Lab k="aquiesta" txt="la panza." p={win(t, w + 0.4, w + 1.1)} at={[0.3, 0.004, 0.17]} w={0.26} />
    </Escena>
  </Stage>;
};

// ============ once · once señoras con el mismo abrigo negro inflado. Once. Yo era la doce ============
export const OnceF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const G: [number, number][] = Array.from({ length: 12 }, (_, i) => [(i % 4 - 1.5) * 0.34, (Math.floor(i / 4) - 1) * 0.36]);
  const T0 = (i: number) => i < 11 ? a + 0.4 + i * ((w - 2.4 - a - 0.4) / 11) : w - 0.2;
  // plano fijo con las doce hasta «yo era la doce»; recién ahí la cámara baja a la doce
  const k = win(t, w + 0.4, b - 0.3), sk = k * k * (3 - 2 * k), h = lerp(2.25, 1.45, sk), cx = lerp(0, G[11][0], sk), cz = lerp(0, G[11][1], sk);
  const cam: Pose = { p: [cx, h, cz + h * 0.27], l: [cx, 0, cz], fov: 30 };
  const doce = tinta("doce", 600, 600, win(t, w + 0.1, w + 0.9), "labial", (g, p) => { g.lineWidth = 18; pathP(g, ring(300, 300, 250, 250, 7), cl(p * 1.4)); escribir(g, "yo", 300, 300, 170, cl(p * 2 - 0.9), HAND); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_parquet" w={3.4} o={0.5} />
      {G.map(([x, z], i) => <Obj key={i} id="h_puffer" L={0.3} luz={i === 11 ? 1 : 1 - 0.45 * sk} p={[x, caer(t, T0(i), 0.3), z]} r={[0, (rn(i, 3) - 0.5) * 0.12, 0]} op={aparece(t, T0(i))} />)}
      {G.slice(0, 11).map(([x, z], i) => <Lab key={i} k={"n" + i} txt={String(i + 1)} p={win(t, T0(i) + 0.15, T0(i) + 0.4)} at={[x, 0.004, z + 0.14]} w={0.18} />)}
      <Tinta tex={doce} w={0.42} h={0.42} p={[G[11][0], 0.03, G[11][1]]} />
    </Escena>
  </Stage>;
};

// ============ talla · los jeans de 1998 y la falda: «por si acaso». ¿Por si vuelvo a tener 40? A la caja ============
export const TallaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), fa = M(f, "falda", a + 3.4), ac = M(f, "acaso", a + 6.4);
  const cam = top(t, a, b, 0.02, 0.08, 1.25, 0.02, 0.12, 1.15);
  const tacha = tinta("t40", 600, 300, win(t, w - 0.3, w + 0.9), "labial", (g, p) => { escribir(g, "40", 300, 150, 210, cl(p * 2), HAND); g.lineWidth = 18; pathP(g, [[110, 230], [490, 70]], cl(p * 2 - 1)); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_caja" w={CAJA_W} o={0.5} />
      <Obj id="h_jeans" L={0.34} p={[DENTRO[0] - 0.14, caer(t, a + 0.35, 0.45), DENTRO[2]]} r={[0, 0.1, 0]} op={aparece(t, a + 0.35)} />
      <Obj id="h_falda" L={0.34} p={[DENTRO[0] + 0.14, 0.006 + caer(t, fa, 0.45), DENTRO[2] + 0.02]} r={[0, -0.25, 0]} op={aparece(t, fa)} />
      <Lab k="acaso" txt="por si acaso..." p={win(t, ac, ac + 1.1)} at={[-0.13, 0.004, SOLAPA]} w={0.5} />
      <Tinta tex={tacha} w={0.22} h={0.11} p={[0.27, 0.004, SOLAPA]} r={[0, 0.06, 0]} />
    </Escena>
  </Stage>;
};

// ============ nudo · doblado en tira, una vuelta, un nudo flojo al costado. Flojo ============
export const NudoF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.9, 0.03, 0.02, 0.78);
  // la tira se apoya cruzada sobre el cuello; el labial dibuja la vuelta y el nudo flojo al costado, con las dos puntas colgando
  const nudo = tinta("nudo", 900, 900, win(t, w - 0.9, w + 0.5), "labial", (g, p) => { g.lineWidth = 20; const k1 = cl(p * 2), k2 = cl(p * 2 - 1);
    pathP(g, ring(450, 330, 300, 140, 4).slice(4, 60), k1);
    pathP(g, [[700, 420], [660, 520], [560, 560], [520, 480], [600, 430], [690, 470], [720, 600], [740, 800]], k2); pathP(g, [[690, 470], [620, 640], [590, 820]], k2); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_cafe" w={1.4} o={0.5} />
      <Obj id="h_cuello_marfil" L={0.34} p={[-0.06, caer(t, a + 0.3, 0.18), 0.03]} op={aparece(t, a + 0.3)} />
      <Obj id="h_panuelo_tira" L={0.36} p={[-0.06, 0.02 + caer(t, a + 1.0, 0.18), -0.06]} r={[0, 1.57, 0]} op={aparece(t, a + 1.0)} />
      <Tinta tex={nudo} w={0.36} h={0.36} p={[-0.04, 0.03, 0.0]} />
      <Lab k="flojo" txt="flojo." p={win(t, w + 0.3, w + 1.0)} at={[-0.3, 0.004, 0.12]} w={0.2} />
    </Escena>
  </Stage>;
};

// ============ gabardina · la de mamá, 1972: puños gastados, un botón distinto. Todavía huele a ella ============
export const GabardinaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), pu = M(f, "punos", a + 6.4), bo = M(f, "boton", a + 8.4);
  const cam = top(t, a, b, 0, 0.0, 1.45, 0.0, 0.0, 1.3);
  // medidos sobre h_gabardina: puños (u .064 v .515) y (u .936 v .538); botón distinto (u .454 v .398)
  const marcas = tinta("gab", 1024, 1024, win(t, pu - 0.3, bo + 0.9), "labial", (g, p) => { g.lineWidth = 16; const k1 = cl(p * 2.2), k2 = cl(p * 2.2 - 1.2); pathP(g, ring(68, 526, 70, 90, 1), k1); pathP(g, ring(958, 548, 70, 90, 2), k1); pathP(g, ring(465, 417, 50, 50, 3), k2); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Piso />
      <Obj id="h_gabardina" L={0.8} p={[0, caer(t, a + 0.3, 0.22), 0]} op={aparece(t, a + 0.3)} />
      <Tinta tex={marcas} w={0.8} h={0.8} p={[0, 0.03, 0]} />
      <Lab k="y1972" txt="1972" p={win(t, w - 0.1, w + 0.7)} at={[0.4, 0.004, -0.25]} w={0.26} />
    </Escena>
  </Stage>;
};

export const _keep = { lerp, rn, Destello };
