// mk01a · COMPONENTES CON FOTO (ola2). La casa de Michiko en Kyoto: tatami con el furoshiki índigo abierto, la mesa baja
// de madera oscura, la grava rastrillada del templo. Cada objeto es una foto cenital recortada (public/mk01a/objs) con su
// sombra real; la tinta es SUMI con pincel (negro que se abre al final del trazo) y, para la etiqueta, pluma.
import React from "react";
import { Stage } from "./base";
import { Esc, HAND, camA, cl, lerp, rn, spr, win, type Pose, type V3 } from "./k3d";
import { Destello, Fondo, Obj, Tinta, arrow, brocha, escribir, pathP, ring, tinta } from "./foto";

export type Fi = { id: string; a: number; b: number; wow?: number | null; n?: number; k?: number; mo?: Record<string, number> };
type CP = { t: number; f: Fi };
const W = (f: Fi) => f.wow ?? f.a + 0.5;
// cámara cenital apenas inclinada (los ojos de quien está arrodillada frente a la tela)
const top = (t: number, a: number, b: number, x0: number, z0: number, h0: number, x1: number, z1: number, h1: number, fov = 30): Pose =>
  camA(t, a, b, { p: [x0, h0, z0 + h0 * 0.3], l: [x0, 0, z0], fov }, { p: [x1, h1, z1 + h1 * 0.24], l: [x1, 0, z1], fov }, 0.6);
const caer = (t: number, t0: number, H = 0.22, k = 1.1) => Math.max(0, 1 - spr(t, t0, k, 2.3)) * H;
const aparece = (t: number, t0: number) => win(t, t0 - 0.06, t0 + 0.12);
const Escena: React.FC<{ cam: Pose; children: React.ReactNode }> = ({ cam, children }) => <Esc cam={cam} key1={[-0.6, 1.05, 0.2]} warm={0.4} exposure={1} cool={0.8}>{children}</Esc>;
// texto a pincel sobre la superficie (ancho w en metros, alto proporcional)
const Pincel: React.FC<{ k: string; txt: string; p: number; at: V3; w: number; size?: number; kind?: "pincel" | "pluma" | "labial" | "tiza" }> = ({ k, txt, p, at, w, size = 170, kind = "pincel" }) => {
  const W2 = Math.max(400, txt.length * size * 0.62), H2 = size * 1.6;
  const tex = tinta(k, W2, H2, p, kind, (g, q) => escribir(g, txt, W2 / 2, H2 / 2, size, q, HAND));
  return <Tinta tex={tex} w={w} h={w * H2 / W2} p={at} />;
};
// trazo de pincel diagonal (tachar): avanza con p; el último 15% se abre (pincel seco)
const Tacha: React.FC<{ k: string; p: number; s: number; at: V3; op?: number; kind?: "pincel" | "tiza" }> = ({ k, p, s, at, op = 1, kind = "pincel" }) => {
  const tex = tinta("tacha" + k + kind, 512, 512, p, kind, (g, q) => brocha(g, [[50, 70], [150, 200], [300, 330], [470, 455]], q, 92, k.length + 3));
  return <Tinta tex={tex} w={s} h={s} p={at} op={op} />;
};

// hoja de washi (foto) bajo la tinta cuando el fondo es madera oscura: el pincel escribe sobre papel, como en casa
const Washi: React.FC<{ at: V3; L: number; r?: number; t: number; t0: number }> = ({ at, L, r = 0, t, t0 }) => <Obj id="m_washi" L={L} capas={2} p={[at[0], at[1] + caer(t, t0, 0.08), at[2]]} r={[0, r, 0]} op={aparece(t, t0)} />;
const SOBRE = 0.0062; // alto de la hoja: la tinta va encima

// ============ HILO · el furoshiki índigo: lo que ya no uso cae sobre la tela, el pincel lo tacha y sale ============
const PIEZAS: { id: string; L: number; dx?: number; dz?: number; r?: number; tint?: string }[][] = [
  [{ id: "m_blusa", L: 0.34 }],
  [{ id: "m_zapatos", L: 0.36 }],
  [{ id: "m_swatch_blanco", L: 0.17, dx: -0.15, r: 0.1, tint: "#c8b394" }, { id: "m_swatch_gris", L: 0.17, dx: 0.0, dz: -0.02, r: -0.06 }, { id: "m_swatch_blanco", L: 0.17, dx: 0.15, r: 0.14, tint: "#7d6a58" }],
  [{ id: "m_fleece", L: 0.38 }],
  [{ id: "m_tunica", L: 0.56 }],
  [{ id: "m_pulseras", L: 0.34 }],
  [{ id: "m_bolsa", L: 0.42 }],
  [{ id: "m_traje", L: 0.58 }],
  [{ id: "m_cartera", L: 0.4 }],
  [{ id: "m_leopardo", L: 0.44 }],
];
const BUENAS = [{ id: "m_camisa", L: 0.28, x: -0.3, z: 0.0, r: 0.04 }, { id: "m_lana", L: 0.28, x: 0.0, z: 0.0, r: -0.03 }, { id: "m_cuello", L: 0.24, x: 0.29, z: 0.0, r: 0.05 }];
export const FuroF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, n = f.n ?? 0, w = W(f);
  if (n === 0) {
    const cam = top(t, a, b, 0, 0, 1.55, 0, 0.02, 1.05);
    return <Stage t={t} a={a} b={b} dim={0.6}>
      <Escena cam={cam}>
        <Fondo id="f_tatami" w={2.0} o={0.5} />
        {BUENAS.map((o, i) => { const t0 = a + 0.02 + i * 0.6; return <Obj key={o.id} id={o.id} L={o.L} p={[o.x, caer(t, t0, 0.45, 0.8), o.z]} r={[0, o.r, 0]} op={aparece(t, t0)} />; })}
      </Escena>
    </Stage>;
  }
  const ps = PIEZAS[n - 1], duda = n === 10;
  const t0 = duda ? a - 0.12 : a + 0.06, H = duda ? 0.28 : n >= 8 ? 0.26 : 0.5, out = win(t, b - 0.55, b - 0.05);
  // el 10 es el que casi me quedo: el pincel se frena a mitad de camino, duda, y termina
  const tp = duda ? (t < w + 1.8 ? 0.5 * win(t, w + 1.3, w + 1.8) : t < w + 2.8 ? 0.5 : 0.5 + 0.5 * win(t, w + 2.8, w + 3.1)) : win(t, w + 1.3, w + 2.1);
  const cam = top(t, a, b, 0, 0.0, n >= 8 ? 1.25 : 1.05, 0.02, 0.0, 0.9);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_tatami" w={2.0} o={0.5} />
      <group position={[0.06, out * 0.35, 0]}>
        {ps.map((o, i) => t < t0 + i * 0.25 - 0.06 ? null : <Obj key={i} id={o.id} L={o.L} tint={o.tint} p={[o.dx ?? 0, caer(t, t0 + i * 0.25, H, 0.8), o.dz ?? 0]} r={[0, o.r ?? 0.04 * (n % 2 ? 1 : -1), 0]} op={aparece(t, t0 + i * 0.25) * (1 - out)} capas={n >= 8 ? 7 : 4} esp={n >= 8 ? 0.0026 : 0.0018} />)}
        <Tacha k={String(n)} p={tp} s={Math.min(0.46, ps.length > 1 ? 0.46 : ps[0].L * 1.05)} at={[0, 0.04, 0]} op={1 - out} kind={n === 5 || n === 8 || n === 9 ? "tiza" : "pincel"} />
      </group>
      <Washi at={[-0.33, 0, -0.02]} L={n >= 8 ? 0.3 : 0.3} r={0.06} t={t} t0={a + 0.15} />
      <Pincel k={"num" + n} txt={`${n}`} p={win(t, w - 0.05, w + 0.45)} at={[-0.33, SOBRE, -0.02]} w={n >= 8 ? 0.26 : 0.22} size={300} />
      {n === 8 && [-1, 1].map((sg) => <Tinta key={sg} tex={tinta("hombro" + sg, 512, 512, win(t, w + 0.35 + (sg + 1) * 0.15, w + 0.85 + (sg + 1) * 0.15), "tiza", (g, p) => { g.lineWidth = 16; pathP(g, ring(256, 256, 210, 190, sg + 3), p); })} w={0.17} h={0.17} p={[0.06 + sg * 0.19, 0.04, -0.19]} op={1 - out} />)}
      {n === 9 && <Pincel k="zips8" txt="8 zips" kind="tiza" p={win(t, w + 0.3, w + 1.0)} at={[-0.33, 0.004, 0.15]} w={0.26} />}
    </Escena>
  </Stage>;
};

// ============ susurro · lana contra poliéster: la lana susurra (onda), el poliéster no respira (línea muerta) ============
export const SusurroF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0.02, 0.95, 0, 0.0, 0.78);
  const onda = tinta("onda", 1024, 256, win(t, w - 0.35, w + 1.3), "tiza", (g, p) => { g.lineWidth = 11; g.lineWidth = 26; pathP(g, Array.from({ length: 120 }, (_, i) => [40 + i * 8, 128 + Math.sin(i * 0.35) * (34 + 16 * Math.sin(i * 0.07))]), p); });
  const muerta = tinta("muerta", 1024, 256, win(t, w + 1.6, w + 2.3), "tiza", (g, p) => { g.lineWidth = 26; pathP(g, [[60, 128], [900, 128]], p); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_mesa" w={1.6} o={0.5} />
      <Obj id="m_lana" L={0.3} p={[-0.18, caer(t, a, 0.2), 0.02]} r={[0, 0.06, 0]} op={aparece(t, a)} />
      <Obj id="m_blusa" L={0.3} p={[0.18, caer(t, a + 0.5, 0.2), 0.02]} r={[0, -0.05, 0]} op={aparece(t, a + 0.5)} />
      <Tinta tex={onda} w={0.3} h={0.075} p={[-0.18, 0.004, -0.125]} />
      <Tinta tex={muerta} w={0.3} h={0.075} p={[0.18, 0.004, -0.125]} />
    </Escena>
  </Stage>;
};

// ============ pan · las zapatillas gordas se arrastran sobre la grava rastrillada: dejan surco. shoo, shoo, shoo ============
export const PanF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), sh = f.mo?.shoo ?? w + 1.3;
  const x = lerp(-0.42, 0.34, win(t, a + 1.2, b - 0.4));
  const cam = top(t, a, b, -0.3, 0.0, 0.9, 0.26, 0.0, 0.75);
  // surcos: dos rayas que se dibujan detrás del zapato (siguen su borde trasero)
  const k = cl((x + 0.42) / 0.76);
  const surco = tinta("surco", 1400, 300, k, "lapiz", (g, p) => { g.lineWidth = 14; g.globalAlpha = 0.55; pathP(g, [[20, 100], [1380, 104]], p); pathP(g, [[20, 200], [1380, 196]], p); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_grava" w={2.0} o={0.55} />
      <Tinta tex={surco} w={0.76} h={0.16} p={[-0.42 + 0.38 - 0.16, 0.002, 0.0]} op={0.75} />
      <Obj id="m_zapatos" L={0.34} p={[x, caer(t, a + 0.15, 0.2), 0]} r={[0, -Math.PI / 2 + 0.02 * Math.sin(t * 7), 0]} op={aparece(t, a + 0.15)} />
      {["shoo,", "shoo,", "shoo."].map((s, i) => <Pincel key={i} k={"shoo" + i} txt={s} p={win(t, sh + i * 0.45, sh + i * 0.45 + 0.35)} at={[x - 0.22 + i * 0.13, 0.003, 0.15 + (i % 2) * 0.03]} w={0.12} />)}
    </Escena>
  </Stage>;
};

// ============ menton · bajo la cara: blanco suave, un poco de coral, un poco de índigo. La cara se despierta ============
export const MentonF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), co = f.mo?.coral ?? a + 2.3, ind = f.mo?.indigo ?? a + 3.6;
  const cam = top(t, a, b, 0, -0.02, 0.7, 0, 0.0, 0.58);
  const cara = tinta("cara", 800, 800, win(t, a + 0.05, a + 1.2), "pincel", (g, p) => { brocha(g, ring(400, 380, 230, 300, 3).slice(8, 60), p, 22, 3); });
  const rayos = tinta("rayos", 1000, 800, win(t, w - 0.1, w + 0.6), "pincel", (g, p) => {
    g.lineWidth = 14; [[-1, -0.6], [-1, 0], [-1, 0.6], [1, -0.6], [1, 0], [1, 0.6]].forEach(([s, d], i) => pathP(g, [[500 + s * 330, 400 + d * 260], [500 + s * 420, 400 + d * 330]], cl(p * 6 - i)));
  });
  const SW: [string, number, string | undefined, number][] = [["m_swatch_blanco", a + 0.6, undefined, -0.13], ["m_swatch_blanco", co, "#ee8f76", 0], ["m_swatch_navy", ind, undefined, 0.13]];
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_mesa" w={1.4} o={0.5} />
      <Washi at={[0, 0, -0.02]} L={0.46} t={t} t0={a - 1} />
      <Tinta tex={cara} w={0.2} h={0.2} p={[0, SOBRE, -0.09]} />
      <Tinta tex={rayos} w={0.25} h={0.2} p={[0, SOBRE, -0.09]} />
      {SW.map(([id, t0, tint, x], i) => <Obj key={i} id={id} L={0.11} tint={tint} p={[x, SOBRE + caer(t, t0, 0.15), 0.08]} r={[0, 0.2 * (i - 1), 0]} op={aparece(t, t0)} />)}
      <Destello p={[0.06, 0.02, -0.15]} s={0.07} k={win(t, w - 0.1, w + 0.2) * (1 - win(t, w + 0.6, w + 1.2))} />
    </Escena>
  </Stage>;
};

// ============ bolitas · el polar se llena de bolitas y el pincel las rodea ============
export const BolitasF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.6, 0.04, 0.02, 0.32);
  const N = 60;
  const aros = tinta("aros", 1024, 1024, win(t, w + 1.2, w + 2.6), "pincel", (g, p) => { g.lineWidth = 9; [0, 7, 19].forEach((j, i) => { const x = 512 + (rn(j, 1) - 0.5) * 380, y = 512 + (rn(j, 2) - 0.5) * 380; pathP(g, ring(x, y, 70, 70, j), cl(p * 3 - i)); }); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_mesa" w={1.4} o={0.5} />
      <Obj id="m_fleece" L={0.4} p={[0, caer(t, a, 0.15), 0]} op={aparece(t, a)} />
      {Array.from({ length: N }, (_, i) => {
        const k = spr(t, w - 0.4 + rn(i, 9) * 1.4, 1.3, 2), r = 0.0035 + 0.004 * rn(i, 4);
        return k <= 0 ? null : <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.24, 0.012, (rn(i, 2) - 0.5) * 0.24]} scale={[k * (0.7 + 0.6 * rn(i, 6)), k * 0.7, k * (0.7 + 0.6 * rn(i, 7))]} castShadow>
          <sphereGeometry args={[r, 12, 8]} /><meshStandardMaterial color="#5c5e63" roughness={0.95} />
        </mesh>;
      })}
      <Tinta tex={tinta("olor", 512, 512, 1, "lapiz", (g) => { const gr = g.createRadialGradient(256, 256, 10, 256, 256, 250); gr.addColorStop(0, "rgba(40,40,44,.55)"); gr.addColorStop(1, "rgba(40,40,44,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); })} w={0.3} h={0.3} p={[0.03, 0.018, 0.02]} op={win(t, (f.mo?.smell ?? b - 3.2), (f.mo?.smell ?? b - 3.2) + 1.2) * 0.9} />
      <Tinta tex={aros} w={0.24 * 1024 / 600} h={0.24 * 1024 / 600} p={[0, 0.02, 0]} />
    </Escena>
  </Stage>;
};

// ============ cascada · camisa blanca + cárdigan abierto: dos líneas largas que bajan; el ojo cae como agua ============
export const CascadaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, -0.08, 1.0, 0, 0.06, 0.95);
  const lineas = tinta("lineas", 600, 1400, win(t, a + 0.8, a + 2.6), "pincel", (g, p) => { brocha(g, [[160, 40], [150, 700], [170, 1360]], p, 40, 2); brocha(g, [[440, 40], [450, 700], [430, 1360]], p, 40, 5); });
  const flechas = tinta("flechas", 400, 1400, win(t, w - 1.6, w + 0.4), "pincel", (g, p) => { g.lineWidth = 12; for (let i = 0; i < 4; i++) pathP(g, [[120, 180 + i * 300], [200, 280 + i * 300], [280, 180 + i * 300]], cl(p * 4 - i)); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_tatami" w={2.0} o={0.5} />
      <Obj id="m_camisa" L={0.34} p={[0, caer(t, a + 0.15, 0.2), -0.12]} op={aparece(t, a + 0.15)} />
      <Tinta tex={lineas} w={0.26} h={0.61} p={[0, 0.02, 0.06]} />
      <Tinta tex={flechas} w={0.08} h={0.28 * 1} p={[0.27, 0.003, 0.06]} />
      <Pincel k="linea" txt="only a line." p={win(t, b - 2.6, b - 1.6)} at={[-0.33, 0.003, 0.25]} w={0.26} />
    </Escena>
  </Stage>;
};

// ============ mercado · dos furoshiki llenos sobre la balanza; se van y la aguja vuelve a cero. Muy liviana ============
export const MercadoF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const fuera = win(t, w - 1.2, w - 0.3);
  const ang = lerp(-2.1, 0, spr(t, w - 0.5, 0.9, 2.2)) * (t > w - 0.5 ? 1 : 0) + (t > w - 0.5 ? 0 : -2.1 * win(t, a + 0.9, a + 1.6));
  const cam = top(t, a, b, 0, 0, 0.95, 0.03, 0.02, 0.78);
  const aguja = tinta("aguja", 512, 512, 1, "pincel", (g) => { g.lineWidth = 12; pathP(g, [[256, 256], [256, 70]], 1); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_mesa" w={1.6} o={0.5} />
      <Obj id="m_balanza" L={0.34} p={[0.14, 0, 0.02]} />
      <group position={[0.14, 0.03, 0.02]} rotation={[0, ang, 0]}><Tinta tex={aguja} w={0.11} h={0.11} p={[0, 0, 0]} /></group>
      {[[0.1, -0.02], [0.18, 0.05]].map(([x, z], i) => <Obj key={i} id="m_furo_atado" L={0.2} p={[x + fuera * 0.8, 0.05 + 0.03 * i + 0.08 * Math.sin(Math.PI * fuera) + caer(t, a + 0.05 + i * 0.35, 0.2), z]} r={[0, 0.3 * i, 0]} op={aparece(t, a + 0.05 + i * 0.35)} />)}
      <Washi at={[-0.24, 0, 0.06]} L={0.2} r={-0.04} t={t} t0={w - 0.6} />
      <Pincel k="liviana" txt="light." p={win(t, w - 0.4, w + 0.2)} at={[-0.24, SOBRE, 0.06]} w={0.15} />
    </Escena>
  </Stage>;
};

// ============ calendario · espero un mes: la luz de la ventana pasa treinta veces sobre lo que quiero; el pincel cuenta los
// días en la hoja de washi. Al «me olvidé», la cosa se desvanece y queda la mesa vacía ============
export const CalendarioF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), fg = f.mo?.forgot ?? b - 1.6;
  const t0 = a + 0.8, t1 = fg - 0.4, k = cl((t - t0) / (t1 - t0)), dia = Math.min(30, Math.floor(k * 30));
  const fase = (k * 30) % 1, luz = t > t0 && t < t1 ? 0.62 + 0.38 * Math.sin(Math.PI * fase) : 1;
  const cam = top(t, a, b, 0, 0, 0.8, 0, 0.01, 0.7);
  const rayas = tinta("dias" + dia, 1024, 400, 1, "pincel", (g) => { for (let i = 0; i < dia; i++) { const grp = Math.floor(i / 5), j = i % 5, x = 50 + grp * 160 + j * 24; if (j === 4) brocha(g, [[x - 110, 300], [x + 14, 110]], 1, 12, i); else brocha(g, [[x, 90], [x - 4, 320]], 1, 12, i); } });
  const se = win(t, fg + 0.2, fg + 1.4);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_mesa" w={1.4} o={0.5 * luz} luz={luz} />
      <Obj id="m_kokeshi" L={0.24} luz={Math.max(0.85, luz)} p={[-0.14, caer(t, a, 0.2), -0.06]} op={aparece(t, a) * (1 - se)} />
      <Washi at={[0.13, 0, -0.04]} L={0.34} r={0.04} t={t} t0={a} />
      <Tinta tex={rayas} w={0.21} h={0.082} p={[0.13, SOBRE, -0.07]} />
      <Pincel k="mes" txt="one month." p={win(t, w - 0.1, w + 0.9)} at={[0.13, SOBRE, 0.05]} w={0.2} />
      <Pincel k="olvido" txt="...forgot." kind="tiza" p={win(t, fg, fg + 0.8)} at={[-0.15, 0.003, 0.1]} w={0.26} />
    </Escena>
  </Stage>;
};

// ============ museo · el traje azul de 1994, perfecto, esperando "algún día": el pincel tacha SOMEDAY ============
export const MuseoF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), y = f.mo?.y94 ?? a + 2.6;
  const cam = top(t, a, b, 0, 0, 1.2, 0.04, 0.04, 1.4);
  const tag = tinta("y94", 512, 300, win(t, y, y + 0.7), "pluma", (g, p) => escribir(g, "1994", 256, 150, 190, p, HAND));
  // como pieza de museo: el pincel le dibuja un marco de vitrina… y en «not a museum» lo tacha con una cruz
  const marco = tinta("vitrina", 1000, 1000, win(t, w - 1.6, w - 0.4), "pincel", (g, p) => { g.lineWidth = 14; pathP(g, [[60, 60], [940, 60], [940, 940], [60, 940], [60, 60]], p); });
  const cruz = tinta("vitrina_x", 1000, 1000, win(t, w + 0.05, w + 0.6), "labial", (g, p) => { g.lineWidth = 24; pathP(g, [[90, 90], [910, 910]], cl(p * 2)); pathP(g, [[910, 90], [90, 910]], cl(p * 2 - 1)); });
  const tacha = tinta("someday_x", 1100, 260, win(t, w + 0.1, w + 0.6), "labial", (g, p) => { g.lineWidth = 20; pathP(g, [[40, 150], [1060, 120]], p); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_tatami" w={2.0} o={0.5} />
      <Obj id="m_traje" L={0.6} p={[0, caer(t, a - 0.3, 0.25), 0]} op={aparece(t, a - 0.3)} capas={7} esp={0.0026} />
      <Obj id="m_tag" L={0.27} p={[0.34, caer(t, y - 0.2, 0.1), 0.16]} r={[0, 0.3, 0]} op={aparece(t, y - 0.2)}>
        <group position={[0.006, 0.006, 0]}><Tinta tex={tag} w={0.18} h={0.105} /></group>
      </Obj>
      <Tinta tex={marco} w={0.72} h={0.72} p={[0, 0.03, 0]} />
      <Tinta tex={cruz} w={0.66} h={0.66} p={[0, 0.032, 0]} />
      
    </Escena>
  </Stage>;
};

// ============ nivel · la cartera pesada inclina el nivel de carpintero: la burbuja se va a un lado ============
export const NivelF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const pesa = spr(t, a + 1.25, 0.8, 1.6), tilt = -0.26 * pesa;
  const cam = top(t, a, b, 0, 0.04, 1.1, 0.04, 0.06, 1.25);
  const burb = cl(pesa) * 0.13;
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_mesa" w={1.6} o={0.5} />
      <group rotation={[0, 0, 0]} position={[0, 0.012, -0.02]}>
        <group rotation={[0, tilt, 0]}><Obj id="m_nivel" L={0.5} p={[0, 0, 0]} />
          <mesh position={[burb, 0.02, 0]}><sphereGeometry args={[0.016, 20, 12]} /><meshStandardMaterial color="#d8e86a" transparent opacity={0.85} roughness={0.1} emissive="#9aa82c" emissiveIntensity={0.4} /></mesh>
        </group>
      </group>
      {/* la cartera pesada cae sobre la punta derecha del nivel: el nivel se tuerce y la burbuja corre al otro extremo */}
      <group position={[0, 0.012, -0.02]} rotation={[0, tilt, 0]}>
        <Obj id="m_cartera" L={0.26} capas={7} esp={0.0026} p={[0.17, 0.03 + caer(t, a + 0.9, 0.3, 1.4), -0.04]} r={[0, 0.15, 0]} op={aparece(t, a + 0.9)} />
      </group>
      <Washi at={[-0.02, 0, 0.2]} L={0.46} t={t} t0={w - 0.3} />
      <Pincel k="standing2" txt="standing her." p={win(t, w, w + 1.0)} at={[-0.02, SOBRE, 0.2]} w={0.4} size={200} />
    </Escena>
  </Stage>;
};

// ============ caja · no la regalé: la blusa de leopardo entra en la caja de kiri y la tapa se cierra ============
export const CajaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const entra = win(t, a + 0.1, w + 0.1), tapa = win(t, w + 0.5, w + 1.1);
  const cam = top(t, a, b, 0, 0, 0.9, -0.04, 0, 0.82);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_tatami" w={2.0} o={0.5} />
      <Obj id="m_kiri_caja" L={0.3} p={[0.02, 0, -0.06]} capas={14} esp={0.004} />
      <Obj id="m_leopardo" L={0.24} sc={1 - 0.18 * entra} p={[lerp(-0.27, 0.02, entra), 0.062 + 0.14 * Math.sin(Math.PI * entra), lerp(0.06, -0.06, entra)]} r={[0, 0.3 * (1 - entra), 0]} op={t < w + 1.0 ? 1 : 0} />
      {/* la tapa de verdad (misma foto), dada vuelta, se desliza desde la derecha y baja sobre la caja */}
      <Obj id="m_kiri_tapa_arriba" L={0.33} p={[0.02, 0.075 + caer(t, w + 0.5, 0.32, 1.3), -0.06]} r={[0, Math.PI, 0]} capas={5} esp={0.003} op={aparece(t, w + 0.5)} />
    </Escena>
  </Stage>;
};

// ============ valija · lo bueno para Kero se junta sobre el furoshiki de mamá: blusas, cárdigan, cuello, la cosita que no
// hace ruido… y la tela se ata. «¡Ya está adentro!» ============
export const ValijaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), mo = f.mo ?? {};
  const furo = mo.furo ?? w - 9, ata = win(t, w - 1.0, w - 0.2);
  const ITEMS: [string, number, number, number, number, number][] = [
    ["m_camisa", mo.blusas ?? a + 3, 0.3, -0.16, -0.06, 0.05], ["m_camisa", (mo.blusas ?? a + 3) + 0.35, 0.3, -0.13, 0.0, -0.08],
    ["m_lana", mo.lana ?? a + 6, 0.3, 0.15, -0.05, 0.1], ["m_cuello", mo.cuello ?? a + 8, 0.24, 0.12, 0.1, -0.12], ["m_bolso_chico", mo.chico ?? a + 10, 0.18, -0.02, 0.15, 0.4],
  ];
  const cam = top(t, a, b, 0, 0, 1.15, 0, 0.01, lerp(1.1, 0.88, win(t, furo, w)));
    return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_tatami" w={2.0} o={0.5} />
      {ITEMS.map(([id, t0, L, x, z, r], i) => <Obj key={i} id={id} L={L} sc={1 - 0.5 * ata} p={[x * (1 - ata), 0.004 * i + caer(t, t0, 0.3), z * (1 - ata)]} r={[0, r, 0]} op={aparece(t, t0) * (1 - win(t, w - 0.5, w - 0.2))} />)}
      <Obj id="m_furo_atado" L={0.32} luz={1.35} p={[-0.1, caer(t, w - 0.45, 0.12, 1.4), 0.0]} op={aparece(t, w - 0.45)} />
      <Obj id="m_washi" L={0.3} capas={2} p={[0.22, caer(t, w - 0.1, 0.1), 0.02]} r={[0, 0.05, 0]} op={aparece(t, w - 0.1)} />
      <Pincel k="isin" txt="it is in!" p={win(t, w + 0.1, w + 0.8)} at={[0.22, SOBRE, 0.02]} w={0.36} />
    </Escena>
  </Stage>;
};

// ============ ticket · ella hunde la nariz en el polar: «tres días» — tres trazos de pincel ============
export const TicketF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cierra = f.mo?.cierra ?? a + 2;
  const cam = top(t, a, b, 0, 0, 0.8, 0.02, 0.01, 0.62);
  const san = tinta("tres", 600, 600, win(t, w - 0.2, w + 0.7), "pincel", (g, p) => { [[150, 160, 450], [110, 300, 490], [60, 470, 540]].forEach(([x0, y, x1], i) => { brocha(g, [[x0, y], [x1, y + 6]], cl(p * 3 - i), 52 - i * 4, i + 2); }); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="f_mesa" w={1.6} o={0.5} />
      <Obj id="m_fleece" L={0.36} sc={1 - 0.07 * Math.sin(Math.PI * win(t, cierra, cierra + 0.9))} p={[-0.1, caer(t, a, 0.3, 0.8), 0]} op={aparece(t, a)} />
      <Obj id="m_washi" L={0.34} capas={2} p={[0.2, caer(t, w - 1.2, 0.22, 1.2), 0.02]} r={[0, 0.05, 0]} op={aparece(t, w - 1.2)} />
      <Tinta tex={san} w={0.22} h={0.22} p={[0.2, SOBRE, 0.04]} />
      <Pincel k="3d" txt="3 days" p={win(t, w - 0.4, w + 0.2)} at={[0.2, SOBRE, -0.09]} w={0.32} />
    </Escena>
  </Stage>;
};

export const _keep = { arrow, rn };
