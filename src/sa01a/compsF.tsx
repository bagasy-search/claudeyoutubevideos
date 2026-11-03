// sa01a · COMPONENTES CON FOTO (ola2). La mesa de corte de Arthur en Londres: papel de molde sobre madera gastada, la
// libreta de cortador abierta, tiza de sastre y cinta. Cada prenda es una foto cenital recortada (public/sa01a/objs) con su
// sombra real. La TIZA marca la tela (como hace un sastre); el LÁPIZ escribe sobre el papel y la libreta.
import React from "react";
import { Stage } from "./base";
import { Esc, HAND, camA, cl, lerp, rn, spr, win, type Pose, type V3 } from "./k3d";
import { Destello, Fondo, Obj, Polvo, Tinta, arrow, escribir, pathP, ring, tinta } from "./foto";

export type Fi = { id: string; a: number; b: number; wow?: number | null; n?: number; k?: number; mo?: Record<string, number> };
type CP = { t: number; f: Fi };
const W = (f: Fi) => f.wow ?? f.a + 0.5;
const top = (t: number, a: number, b: number, x0: number, z0: number, h0: number, x1: number, z1: number, h1: number, fov = 30): Pose =>
  camA(t, a, b, { p: [x0, h0, z0 + h0 * 0.32], l: [x0, 0, z0], fov }, { p: [x1, h1, z1 + h1 * 0.26], l: [x1, 0, z1], fov }, 0.6);
const caer = (t: number, t0: number, H = 0.22, k = 1.1) => Math.max(0, 1 - spr(t, t0, k, 2.3)) * H;
const aparece = (t: number, t0: number) => win(t, t0 - 0.06, t0 + 0.12);
const Escena: React.FC<{ cam: Pose; children: React.ReactNode }> = ({ cam, children }) => <Esc cam={cam} key1={[-0.55, 1.05, 0.3]} warm={0.35} exposure={1} cool={0.9}>{children}</Esc>;
const Mesa = () => <Fondo id="f_mesa" w={2.5} o={0.55} />;
// texto escrito (tiza sobre tela / lápiz sobre papel)
const Esc2: React.FC<{ k: string; txt: string; p: number; at: V3; w: number; kind?: "tiza" | "lapiz" | "pluma"; r?: number }> = ({ k, txt, p, at, w, kind = "lapiz", r = 0 }) => {
  const size = 150, W2 = Math.max(400, txt.length * size * 0.6), H2 = size * 1.6;
  const tex = tinta(k, W2, H2, p, kind, (g, q) => escribir(g, txt, W2 / 2, H2 / 2, size, q, HAND));
  return <Tinta tex={tex} w={w} h={w * H2 / W2} p={at} r={[0, r, 0]} />;
};
// X de tiza sobre la tela
const XT: React.FC<{ k: string; p: number; s: number; at: V3 }> = ({ k, p, s, at }) => {
  const tex = tinta("xt" + k, 400, 400, p, "tiza", (g, q) => { g.lineWidth = 18; pathP(g, [[50, 60], [350, 340]], cl(q * 2)); if (q > 0.5) pathP(g, [[345, 55], [55, 345]], cl(q * 2 - 1)); });
  return <Tinta tex={tex} w={s} h={s} p={at} />;
};

// ============ HILO · la libreta de cortador: cada error cae sobre el papel, la tiza lo tacha, el lápiz lo anota ============
const LIB_L = 0.4, LIB_AR = 841 / 592, LIB: V3 = [-0.36, 0, 0.0];
const LISTA = ["cap + jacket", "short sleeves + tie", "cargo shorts", "team jacket", "fleece waistcoat", "two sizes too big", "foam soles"];
const ERR: { id: string; L: number; dx?: number; dz?: number; r?: number }[][] = [
  [{ id: "s_tweed", L: 0.62 }, { id: "s_gorra", L: 0.2, dx: 0.0, dz: -0.24, r: 0.3 }],
  [{ id: "s_camisa_corta", L: 0.56 }],
  [{ id: "s_cargo", L: 0.52 }],
  [{ id: "s_campera_club", L: 0.6 }],
  [{ id: "s_chaleco", L: 0.5 }],
  [{ id: "s_traje_grande", L: 0.7 }],
  [{ id: "s_zapato_foam", L: 0.34 }],
];
// la lista de corte, escrita con lápiz de sastre directo sobre el papel de molde (al costado de la prenda)
const Pagina: React.FC<{ n: number; p: number; at: V3 }> = ({ n, p, at }) => {
  const pw = 0.3, ph = 0.45;
  const tex = tinta("pag" + n, 600, 900, p, "lapiz", (g, q) => {
    escribir(g, "never", 40, 80, 110, 1, HAND, "left");
    for (let i = 0; i < Math.min(n, 7) - 1; i++) {
      const y = 170 + i * 52; escribir(g, `${i + 1}. ${LISTA[i]}`, 40, y, 44, 1, HAND, "left"); g.lineWidth = 3; pathP(g, [[36, y + 2], [520, y - 2]], 1);
    }
    const y = 210 + (n - 1) * 52, lab = `${n}. ${LISTA[n - 1]}`;
    escribir(g, lab, 40, y, lab.length > 14 ? 76 : 96, cl(q * 1.3), HAND, "left");
  });
  return <Tinta tex={tex} w={pw} h={ph} p={at} />;
};
export const LibretaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, n = f.n ?? 0, w = W(f);
  const pag: V3 = [LIB[0] + LIB_L * 0.24, 0.006, LIB[2] + 0.004];
  if (n === 0) {
    const cam = top(t, a, b, -0.1, 0, 1.1, -0.26, 0.0, 0.62);
    const siete = tinta("siete", 600, 400, win(t, w, w + 0.9), "lapiz", (g, p) => { escribir(g, "7", 300, 210, 300, p, HAND); });
    return <Stage t={t} a={a} b={b} dim={0.6}>
      <Escena cam={cam}>
        <Mesa />
        <Obj id="s_libreta" L={LIB_L} p={[LIB[0], caer(t, a + 0.1, 0.2), LIB[2]]} op={aparece(t, a + 0.1)} />
        <Obj id="s_cinta" L={0.15} p={[-0.07, caer(t, a + 0.6, 0.2), -0.15]} r={[0, 0.4, 0]} op={aparece(t, a + 0.6)} />
        <Obj id="s_tiza" L={0.06} p={[-0.02, caer(t, a + 0.9, 0.15), -0.01]} r={[0, 0.7, 0]} op={aparece(t, a + 0.9)} />
        <Obj id="s_tijeras" L={0.22} p={[-0.06, caer(t, a + 1.2, 0.2), 0.13]} r={[0, -0.5, 0]} op={aparece(t, a + 1.2)} />
        <Esc2 k="never0" txt="never" p={win(t, w - 1.2, w - 0.3)} at={[pag[0], 0.008, pag[2] - 0.07]} w={0.13} kind="pluma" />
        <Tinta tex={siete} w={0.12} h={0.08} p={[pag[0], 0.008, pag[2] + 0.03]} />
      </Escena>
    </Stage>;
  }
  const ps = ERR[n - 1], t0 = a + 0.3;
  const cam = top(t, a, b, 0.1, 0.0, 1.0, -0.04, 0.0, 0.85);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Pagina n={n} p={win(t, w + 0.9, b - 0.5)} at={[-0.28, 0.003, 0.0]} />
      {ps.map((o, i) => <Obj key={o.id} id={o.id} L={o.L * 0.75} p={[0.14 + (o.dx ?? 0) * 0.75 + 0.04 * (1 - win(t, t0, w + 0.4)), caer(t, t0 + i * 0.3, 0.45, 0.75), (o.dz ?? 0.02) * 0.75]} r={[0, (o.r ?? 0.03 * (n % 2 ? 1 : -1)) + 0.12 * (1 - win(t, t0, w + 0.4)), 0]} op={aparece(t, t0 + i * 0.3)} />)}
      <XT k={String(n)} p={win(t, w + 0.05, w + 0.75)} s={Math.min(0.22, ps[0].L * 0.33)} at={[0.14, 0.03, 0.02]} />
      <Polvo t={t} t0={w + 0.75} p={[0.24, 0.03, 0.1]} />
    </Escena>
  </Stage>;
};

// ============ mitad · arriba la cancha, abajo un caballero: la tiza corta al hombre al medio ============
export const MitadF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), bj = f.mo?.bajo ?? a + 3.3;
  const cam = top(t, a, b, 0, -0.14, 1.1, 0, 0.12, 1.15);
  const corte = tinta("corte", 1600, 120, win(t, w - 0.1, w + 0.6), "tiza", (g, p) => { g.lineWidth = 14; g.setLineDash([46, 24]); pathP(g, [[30, 60], [1570, 64]], p); g.setLineDash([]); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_gorra" L={0.22} p={[0, caer(t, a + 0.1, 0.2), -0.36]} op={aparece(t, a + 0.1)} />
      <Obj id="s_saco_navy" L={0.5} p={[0, caer(t, a + 0.3, 0.2), -0.1]} op={aparece(t, a + 0.3)} />
      <Tinta tex={corte} w={0.7} h={0.052} p={[0, 0.03, 0.12]} />
      <Obj id="s_pantalon_navy" L={0.58} p={[0, caer(t, bj - 0.1, 0.25), 0.44]} op={aparece(t, bj - 0.1)} />
      <Esc2 k="ballpark" txt="ballpark" p={win(t, a + 0.4, a + 1.4)} at={[-0.38, 0.004, -0.3]} w={0.28} r={0.05} />
      <Esc2 k="gentleman" txt="gentleman" p={win(t, bj + 0.3, bj + 1.3)} at={[-0.38, 0.004, 0.36]} w={0.3} r={-0.04} />
    </Escena>
  </Stage>;
};

// ============ punto · el puño es el punto final: media pulgada de blanco; la tiza mide y pone el punto ============
export const PuntoF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.6, 0.06, 0.02, 0.44);
  const med = tinta("media", 800, 400, win(t, a + 2.6, a + 4.2), "tiza", (g, p) => {
    g.lineWidth = 9; pathP(g, [[120, 330], [120, 70]], cl(p * 3)); pathP(g, [[250, 330], [250, 70]], cl(p * 3 - 1));
    if (p > 0.66) { pathP(g, arrow(120, 200, 250, 200, 22), cl(p * 3 - 2)); escribir(g, "1/2 in", 450, 200, 110, cl(p * 2 - 0.9), HAND, "left"); }
  });
  const punto = tinta("punto", 300, 300, win(t, w - 0.05, w + 0.25), "tiza", (g, p) => { g.beginPath(); g.arc(150, 150, 70 * p, 0, Math.PI * 2); g.fill(); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_manga" L={0.5} p={[0, caer(t, a + 0.05, 0.15), 0]} op={aparece(t, a + 0.05)} />
      <Tinta tex={med} w={0.24} h={0.12} p={[0.08, 0.012, 0.08]} />
      <Esc2 k="fullstop" txt="the full stop" p={win(t, w - 0.6, w + 0.2)} at={[0.0, 0.03, -0.05]} w={0.26} kind="tiza" />
      <Tinta tex={punto} w={0.06} h={0.06} p={[0.15, 0.031, -0.043]} />
    </Escena>
  </Stage>;
};

// ============ bolsillos · siete bolsillos en un saco y nadie ve ninguno; la tiza los cuenta ============
const BOLS: [number, number, boolean][] = [[-0.125, 0.078, false], [0.13, 0.073, false], [-0.125, -0.092, true], [0.12, -0.092, true], [-0.09, 0.0, true], [0.09, 0.0, true], [0.145, 0.135, true]];
export const BolsillosF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.95, 0.06, 0.0, 0.72);
  const aros = tinta("bols", 1024, 1024, win(t, w + 0.6, w + 7.5), "tiza", (g, p) => {
    BOLS.forEach(([x, z, dentro], i) => { const k = cl(p * 7 - i); if (k <= 0) return; g.lineWidth = 8; if (dentro) g.setLineDash([18, 14]); pathP(g, ring(512 + x * 1700, 512 + z * 1700, 60, 36, i), k); g.setLineDash([]); if (k > 0.6) escribir(g, String(i + 1), 512 + x * 1700 + 78, 512 + z * 1700 - 42, 112, 1, HAND); });
  });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_saco_navy" L={0.6} p={[0, caer(t, a + 0.05, 0.2), 0]} op={aparece(t, a + 0.05)} />
      <Tinta tex={aros} w={0.6} h={0.6} p={[0, 0.03, 0]} />
    </Escena>
  </Stage>;
};

// ============ entradas · «¿cortar tela o vender entradas?»: la entrada cae sobre el escudo; las tijeras esperan ============
export const EntradasF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.95, 0.04, -0.03, 0.62);
  const preg = tinta("preg", 300, 400, win(t, w + 0.2, w + 0.8), "lapiz", (g, p) => escribir(g, "?", 150, 210, 300, p, HAND));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_campera_club" L={0.6} p={[0, caer(t, a + 0.05, 0.2), 0]} op={aparece(t, a + 0.05)} />
      <Obj id="s_tijeras" L={0.3} p={[-0.32, caer(t, w - 1.6, 0.2), 0.12]} r={[0, 0.9, 0]} op={aparece(t, w - 1.6)} />
      <Obj id="s_ticket" L={0.17} p={[0.07, 0.03 + caer(t, w - 0.3, 0.3, 0.9), -0.08]} r={[0, -0.35, 0]} op={aparece(t, w - 0.3)}>
        <group position={[-0.01, 0.009, 0]}><Esc2 k="admit" txt="ADMIT ONE" p={win(t, w + 0.1, w + 0.8)} at={[0, 0, 0]} w={0.11} kind="pluma" /></group>
      </Obj>
      <Tinta tex={preg} w={0.08} h={0.106} p={[0.36, 0.004, 0.1]} />
    </Escena>
  </Stage>;
};

// ============ hombros · una bolsa de dormir sin mangas al lado de un saco de verdad: la tiza marca el hombro que le falta ============
export const HombrosF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), entra = spr(t, w - 0.9, 0.8, 1.6);
  const cam = top(t, a, b, 0, -0.02, 0.95, 0.02, -0.04, 0.82);
  // hombro armado del saco (línea llena) contra el chaleco (línea punteada que cae)
  const saco = tinta("hsaco", 1000, 400, win(t, w - 0.2, w + 0.5), "tiza", (g, p) => { g.lineWidth = 28; pathP(g, [[60, 300], [300, 110], [500, 70], [700, 110], [940, 300]], p); });
  const chal = tinta("hchal", 1000, 400, win(t, w + 0.4, w + 1.1), "tiza", (g, p) => { g.lineWidth = 28; g.setLineDash([34, 22]); pathP(g, [[60, 380], [300, 150], [500, 90], [700, 150], [940, 380]], p); g.setLineDash([]); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_chaleco" L={0.44} p={[-0.18, caer(t, a + 0.05, 0.2), 0.02]} op={aparece(t, a + 0.05)} />
      <Obj id="s_saco_gris" L={0.5} p={[lerp(0.75, 0.23, Math.min(1, entra)), caer(t, w - 0.9, 0.12), 0.02]} r={[0, 0.03, 0]} op={aparece(t, w - 0.9)} />
      <Tinta tex={saco} w={0.32} h={0.128} p={[0.23, 0.03, -0.16]} />
      <Tinta tex={chal} w={0.26} h={0.104} p={[-0.18, 0.03, -0.15]} />
      <Esc2 k="noshoulders" txt="no shoulders" p={win(t, w + 1.0, w + 1.9)} at={[-0.18, 0.004, 0.3]} w={0.26} />
    </Escena>
  </Stage>;
};

// ============ acordeón · dos talles de más: el pantalón se amontona en zigzag como un acordeón cansado ============
export const AcordeonF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, -0.05, 1.05, 0.03, 0.12, 0.85);
  const zz = tinta("zz", 900, 300, win(t, w - 0.6, w + 0.5), "tiza", (g, p) => { g.lineWidth = 10; [70, 520].forEach((x0, j) => pathP(g, Array.from({ length: 9 }, (_, i) => [x0 + i * 40, 150 + (i % 2 ? -70 : 70)]), cl(p * 2 - j))); });
  const sq = 1 - 0.07 * win(t, w - 0.3, w + 0.4);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <group scale={[1, 1, sq]}><Obj id="s_traje_grande" L={0.75} p={[0, caer(t, a + 0.05, 0.2), 0]} op={aparece(t, a + 0.05)} /></group>
      <Tinta tex={zz} w={0.3} h={0.1} p={[0.02, 0.03, 0.31]} />
      <Esc2 k="accordion" txt="accordion" p={win(t, w + 0.1, w + 1.0)} at={[-0.33, 0.004, 0.36]} w={0.22} />
    </Escena>
  </Stage>;
};

// ============ arreglo · acortado a un quiebre leve: la tiza marca, la tijera corta, 50-60 dólares parecen el doble ============
export const ArregloF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), c0 = f.mo?.corto ?? a + 0.6;
  const linea = tinta("dobladillo", 900, 80, win(t, c0, c0 + 0.8), "tiza", (g, p) => { g.lineWidth = 12; pathP(g, [[20, 40], [880, 40]], p); });
  const cut = win(t, c0 + 1.0, c0 + 1.8);
  const cam = top(t, a, b, 0, 0.12, 0.8, -0.08, 0.16, 0.7);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_pantalon_navy" L={0.62} p={[0, 0, 0]} />
      <Tinta tex={linea} w={0.3} h={0.027} p={[0, 0.012, 0.2]} />
      <Obj id="s_tijeras" L={0.28} p={[lerp(0.45, 0.12, win(t, c0 + 0.6, c0 + 1.0)) + 0.02 * Math.sin(t * 30) * cut * (1 - win(t, c0 + 1.8, c0 + 2)), 0.02, 0.21]} r={[0, Math.PI, 0]} op={aparece(t, c0 + 0.5)} />
      <Esc2 k="5060" txt="$50-60" p={win(t, w - 1.6, w - 0.8)} at={[-0.25, 0.004, 0.04]} w={0.22} />
          </Escena>
  </Stage>;
};

// ============ coronel · el mismo traje de franela gris por 41 años: se da vuelta y aparece el forro ============
export const CoronelF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), y41 = f.mo?.y41 ?? a + 4.4;
  const flip = win(t, w - 1.0, w + 0.6), ang = Math.PI * flip;
  const cam = top(t, a, b, 0, 0, 1.0, 0.0, 0.02, 0.78);
  const anos = tinta("anos", 900, 300, win(t, y41, y41 + 1.0), "lapiz", (g, p) => { for (let i = 0; i < 8; i++) { g.lineWidth = 6; pathP(g, i % 5 === 4 ? [[40 + (i - 4) * 50, 120], [40 + i * 50, 60]] : [[40 + i * 50, 40], [40 + i * 50, 140]], cl(p * 8 - i)); } escribir(g, "41 yrs", 640, 100, 120, cl(p * 2 - 1), HAND); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <group position={[0, 0.02 + 0.2 * Math.sin(Math.PI * flip), 0]} rotation={[0, 0, ang]}>
        <Obj id={flip < 0.5 ? "s_saco_gris" : "s_saco_forro"} L={0.6} p={[0, 0, 0]} r={flip < 0.5 ? [0, 0, 0] : [0, 0, Math.PI]} />
      </group>
      <Tinta tex={anos} w={0.4} h={0.133} p={[-0.3, 0.004, -0.24]} />
      <Esc2 k="twice" txt="twice." p={win(t, b - 1.4, b - 0.6)} at={[0.32, 0.004, 0.28]} w={0.15} kind="pluma" />
    </Escena>
  </Stage>;
};

// ============ pan · la suela de goma con forma de pan: la tiza dibuja la hogaza alrededor ============
export const PanF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), entra = spr(t, w - 0.5, 0.8, 1.6);
  const cam = top(t, a, b, 0.0, 0, 0.78, 0.02, 0.02, 0.7);
  const igual = tinta("igual2", 300, 200, win(t, w + 0.4, w + 1.0), "pluma", (g, p) => { g.lineWidth = 26; pathP(g, [[50, 70], [250, 70]], cl(p * 2)); pathP(g, [[50, 130], [250, 130]], cl(p * 2 - 1)); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_zapato_foam" L={0.28} p={[-0.17, caer(t, a - 0.3, 0.1), 0.0]} op={aparece(t, a - 0.3)} />
      <Obj id="s_pan" L={0.23} p={[lerp(0.6, 0.18, Math.min(1, entra)), caer(t, w - 0.5, 0.1), 0.0]} r={[0, Math.PI / 2, 0]} op={aparece(t, w - 0.5)} />
      <Tinta tex={igual} w={0.1} h={0.067} p={[0.0, 0.004, 0.0]} />
      <Esc2 k="bread" txt="bread." p={win(t, w + 0.9, w + 1.6)} at={[0.17, 0.004, 0.13]} w={0.38} />
    </Escena>
  </Stage>;
};

// ============ támesis · de noche, desde el puente: los zapatos caen uno tras otro al agua negra ============
const Onda: React.FC<{ t: number; t0: number; p: V3 }> = ({ t, t0, p }) => {
  const d = t - t0; if (d < 0 || d > 2.4) return null;
  return <group position={p}>{[0, 0.25, 0.5].map((o, i) => { const k = d - o; if (k < 0) return null; const r = 0.05 + k * 0.28; return <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}><ringGeometry args={[r, r + 0.008, 64]} /><meshBasicMaterial color="#cfd6d2" transparent opacity={0.45 * (1 - k / 2.4)} toneMapped={false} /></mesh>; })}</group>;
};
export const TamesisF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 1.3, 0, 0, 1.05, 34);
  // cae desde la baranda (fuera de cuadro), toca el agua y se hunde: gira, se oscurece y desaparece
  const zap = (t0: number, x: number, z: number, s: number) => { const k = cl((t - t0) / 1.0); const hund = cl((t - t0 - 1.0) / 0.7); return { y: lerp(0.5, 0.0, k * k) - 0.05 * hund, op: 1 - hund, luz: 1 - 0.6 * hund, k, x, z, s, t0 }; };
  const Z = [zap(a + 0.15, -0.14, 0.04, 1), zap(w - 0.4, 0.15, -0.05, -1)];
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_agua" w={3.2} o={0.3} luz={1.25} />
      {Z.map((z, i) => <group key={i}>
        {z.op > 0.01 && t > z.t0 - 0.05 && <Obj id="s_zapato_suelto" L={0.42} p={[z.x, z.y, z.z]} r={[0, z.k * 2.0 * z.s, 0]} luz={z.luz * 1.4} op={z.op} sombra={false} />}
        <Onda t={t} t0={z.t0 + 1.0} p={[z.x, 0, z.z]} />
        <Polvo t={t} t0={z.t0 + 1.0} p={[z.x, 0.02, z.z]} n={45} />
      </group>)}
    </Escena>
  </Stage>;
};

// ============ medias · las medias siguen al pantalón: blancas cortan la pierna; azules la alargan ============
export const MediasF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), nv = f.mo?.navy ?? a + 5.5;
  const sw = win(t, nv - 0.2, nv + 0.4);
  const cam = top(t, a, b, 0, 0, 1.1, 0, 0.02, 0.95);
  const flecha = tinta("alto", 300, 1400, win(t, w - 0.3, w + 0.6), "tiza", (g, p) => { g.lineWidth = 34; pathP(g, arrow(150, 1350, 150, 60, 90), p); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_pantalon_navy" L={0.62} p={[0, 0, -0.16]} />
      <Obj id="s_media_blanca" L={0.22} p={[0.0 + sw * 0.6, 0.004, 0.2]} op={1 - sw} />
      <Obj id="s_media_navy" L={0.22} p={[0.0 - (1 - sw) * 0.6, 0.004, 0.2]} op={sw} />
      <Tinta tex={flecha} w={0.11} h={0.42} p={[0.25, 0.004, 0.0]} />
      <Esc2 k="taller" txt="taller. free." p={win(t, w + 0.2, w + 1.3)} at={[0.33, 0.004, -0.28]} w={0.24} />
    </Escena>
  </Stage>;
};

// ============ carta · la carta de Houston: sale del sobre; 74 años; «un último traje» — tijeras y cinta encima ============
export const CartaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), dl = f.mo?.dale ?? a + 3.2;
  const sale = win(t, a + 1.0, a + 2.0);
  const cam = top(t, a, b, 0, 0, 0.8, 0.02, 0.02, 0.6);
  const n74 = tinta("n74", 400, 300, win(t, dl + 0.6, dl + 1.4), "lapiz", (g, p) => { escribir(g, "74", 200, 150, 150, cl(p * 1.5), HAND); g.lineWidth = 6; pathP(g, ring(200, 150, 120, 90, 4), cl(p * 2 - 1)); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Mesa />
      <Obj id="s_sobre" L={0.26} p={[-0.12, caer(t, a + 0.1, 0.2), -0.04]} r={[0, 0.1, 0]} op={aparece(t, a + 0.1)} />
      <Obj id="s_carta" L={0.24} p={[lerp(-0.12, 0.13, sale), 0.006 + 0.01 * (1 - sale), lerp(-0.04, 0.03, sale)]} r={[0, lerp(0.1, -0.08, sale), 0]} op={win(t, a + 0.9, a + 1.1)} />
      <Tinta tex={n74} w={0.1} h={0.075} p={[-0.13, 0.004, 0.12]} />
      <Esc2 k="houston" txt="Houston, Texas" p={win(t, a + 0.4, a + 1.2)} at={[-0.12, 0.012, -0.03]} w={0.14} kind="pluma" r={0.1} />
    </Escena>
  </Stage>;
};

export const _keep = { rn };
