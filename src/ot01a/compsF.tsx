// ot01a · COMPONENTES CON FOTO (ola2). Cada pieza es un objeto REAL del taller de Corso Magenta: foto cenital recortada
// (public/ot01a/objs) apoyada sobre otra foto a sangre (mesa de nogal, paño de corte, estuche de terciopelo), con sombra real
// y luz de la ventana de la izquierda. El texto vive dentro de la escena: tiza sobre el paño, pluma sobre la etiqueta.
import React from "react";
import { Stage } from "./base";
import { Esc, HAND, camA, cl, lerp, rn, spr, win, type Pose, type V3 } from "./k3d";
import { Destello, Fondo, Obj, Polvo, Tinta, arrow, escribir, pathP, ring, tinta } from "./foto";
import type { Fi } from "./comps";

type CP = { t: number; f: Fi };
const W = (f: Fi) => f.wow ?? f.a + 0.5;
// cámara cenital levemente inclinada (la mesa se ve desde el ojo del sastre): de (x0,z0,h0) a (x1,z1,h1)
const top = (t: number, a: number, b: number, x0: number, z0: number, h0: number, x1: number, z1: number, h1: number, fov = 30): Pose =>
  camA(t, a, b, { p: [x0, h0, z0 + h0 * 0.32], l: [x0, 0, z0], fov }, { p: [x1, h1, z1 + h1 * 0.26], l: [x1, 0, z1], fov }, 0.6);
// caída con peso: alto → apoyado (rebota apenas, nunca atraviesa la mesa)
const caer = (t: number, t0: number, H = 0.22, k = 1.1) => Math.max(0, 1 - spr(t, t0, k, 2.3)) * H;
const aparece = (t: number, t0: number) => win(t, t0 - 0.06, t0 + 0.12);
const Escena: React.FC<{ cam: Pose; children: React.ReactNode }> = ({ cam, children }) => <Esc cam={cam} key1={[-0.55, 1.05, 0.25]} warm={0.55} exposure={1}>{children}</Esc>;

// ============ HILO · el estuche de seis lugares ============
// centros de las seis almohadillas sobre la foto o_estuche (u,v desde arriba-izquierda), medidos sobre la foto
const EST_W = 0.86, EST_AR = 16 / 9;
const SLOT_U = [0.174, 0.303, 0.434, 0.564, 0.694, 0.825], SLOT_V = 0.72;
const slot = (i: number): [number, number] => [(SLOT_U[i] - 0.5) * EST_W, (SLOT_V - 0.5) * (EST_W / EST_AR)];
const ORDEN = ["o_diver", "o_cockpit", "o_smart", "o_dress", "o_oro"];
// las fotos vienen acostadas o paradas: en el estuche cada reloj va a lo largo de su almohadilla (eje z)
const VERT: Record<string, number> = { o_diver: Math.PI / 2, o_cockpit: 0, o_smart: 0, o_dress: Math.PI / 2, o_oro: Math.PI / 2, o_giuseppe: Math.PI / 2 };
const XTiza: React.FC<{ k: number; s: number; key2: string }> = ({ k, s, key2 }) => {
  const tex = tinta("x" + key2, 256, 256, k, "tiza", (g, p) => { g.lineWidth = 24; pathP(g, [[40, 40], [216, 216]], cl(p * 2)); if (p > 0.5) pathP(g, [[216, 40], [40, 216]], cl(p * 2 - 1)); });
  return <Tinta tex={tex} w={s} h={s} />;
};
export const EstucheF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, n = f.n ?? 0, w = W(f), intro = n === 0, fin = n === 6;
  const [sx, sz] = n >= 1 ? slot(Math.min(5, n - 1)) : [0, 0];
  const cam = intro ? top(t, a, b, 0, 0.06, 0.7, 0, 0.11, 0.5) : fin ? top(t, a, b, 0, 0.1, 0.6, sx, sz - 0.01, 0.32) : top(t, a, b, sx * 0.5, sz, 0.42, sx, sz, 0.26);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_estuche" w={EST_W} o={0.55} />
      {ORDEN.map((id, i) => {
        const [x, z] = slot(i), me = i + 1 === n;
        const t0 = intro ? a + 0.2 + i * 0.3 : a - 9;
        const lift = intro ? caer(t, t0, 0.2) : me ? 0.05 * spr(t, w, 0.9, 1.4) * (1 - win(t, w + 2.2, w + 2.8)) : 0;
        const crossed = i + 1 < n || (me && t > w + 0.8);
        return <group key={id}>
          <Obj id={id} L={0.2} p={[x, lift, z]} r={[0, VERT[id] + (me ? 0.06 * win(t, w, w + 0.5) : 0), 0]} op={intro ? aparece(t, t0) : 1} />
          {crossed && <group position={[x, 0.012 + lift, z]}><XTiza k={i + 1 < n ? 1 : win(t, w + 0.8, w + 1.3)} s={0.1} key2={id} /></group>}
          {me && <Polvo t={t} t0={w + 0.85} p={[x, 0.02, z]} />}
        </group>;
      })}
      {fin && (() => {
        const [x, z] = slot(5), t0 = a + 0.35;
        const tag = tinta("t1976", 512, 300, win(t, w + 0.4, w + 1.3), "pluma", (g, p) => escribir(g, "1976", 256, 150, 150, p, HAND));
        return <group>
          <Obj id="o_giuseppe" L={0.2} p={[x, caer(t, t0, 0.16, 0.8) + 0.03 * spr(t, w, 0.9, 1.4), z]} r={[0, VERT.o_giuseppe, 0]} op={aparece(t, t0)} />
          <Destello p={[x, 0.05, z]} s={0.06} k={win(t, w - 0.1, w + 0.3) * (1 - win(t, w + 0.8, w + 1.5))} />
          <Obj id="o_tag" L={0.07} p={[x + 0.058, caer(t, w + 0.1, 0.08) + 0.012, z + 0.03]} r={[0, -0.25, 0]} op={aparece(t, w + 0.1)}>
            <group position={[0.004, 0.006, 0]} rotation={[0, 0, 0]}><Tinta tex={tag} w={0.05} h={0.03} /></group>
          </Obj>
        </group>;
      })()}
    </Escena>
  </Stage>;
};

// ============ ronchi · la regla del Maestro cae sobre la mesa y la tiza escribe la ley ============
export const RonchiF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), t0 = a + 0.15, hit = t0 + 0.28;
  const shake = 0.004 * Math.exp(-Math.max(0, t - hit) * 9) * Math.sin((t - hit) * 70) * (t > hit ? 1 : 0);
  const cam = top(t, a, b, 0, 0.0, 0.46, 0, 0.02, 0.36);
  cam.p = [cam.p[0] + shake, cam.p[1], cam.p[2]];
  const txt = tinta("ronchi", 1400, 300, win(t, w, w + 0.9), "tiza", (g, p) => { escribir(g, "whisper.", 700, 95, 170, cl(p * 1.8), HAND); escribir(g, "never shout.", 700, 215, 120, cl(p * 1.8 - 0.8), HAND); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_corte" w={1.3} o={0.6} />
      <Obj id="o_regla" L={0.3} sombra p={[0, Math.max(0, 1 - spr(t, t0, 1.7, 2.6)) * 0.3, -0.035]} r={[0, 0.03 + 0.25 * (1 - win(t, t0, hit)), 0]} op={aparece(t, t0)} />
      <Polvo t={t} t0={hit} p={[0.1, 0.01, -0.03]} n={26} />
      <Polvo t={t} t0={hit + 0.04} p={[-0.13, 0.01, -0.04]} n={18} />
      <Tinta tex={txt} w={0.3} h={0.064} p={[0, 0.003, 0.055]} op={1} />
    </Escena>
  </Stage>;
};

// ============ puno · el puño de la camisa tapa el reloj fino; el grande lo levanta como una carpa ============
export const PunoF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), q = f.mo?.q ?? a + 4, big = f.mo?.big ?? a + 9;
  const dressOut = win(t, big - 0.2, big + 0.6), diverIn = spr(t, big + 0.35, 0.9, 1.6);
  const tent = win(t, w - 0.5, w + 0.3);
  const cam = top(t, a, b, -0.02, 0.0, 0.42, 0.01, 0.01, 0.3);
  const mark = tinta("cuarto", 700, 300, win(t, q - 0.1, q + 1.2), "tiza", (g, p) => {
    g.lineWidth = 9; pathP(g, [[60, 230], [60, 70]], cl(p * 3)); pathP(g, [[160, 230], [160, 70]], cl(p * 3 - 1));
    if (p > 0.66) pathP(g, arrow(60, 150, 160, 150, 26), cl(p * 3 - 2));
    escribir(g, "1/4 in", 330, 150, 120, cl(p * 2 - 0.8), HAND, "left");
  });
  const tentL = tinta("carpa", 600, 400, win(t, w - 0.1, w + 0.7), "tiza", (g, p) => { g.lineWidth = 10; pathP(g, [[40, 360], [300, 60], [560, 360]], p); });
  // el borde del puño queda en x≈0.02: la esfera de cada reloj va justo debajo (la mitad tapada)
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_corte" w={1.2} o={0.55} />
      <Obj id="o_dress" L={0.2} p={[0.0 + dressOut * 0.3, 0, 0.012]} r={[0, 0.05, 0]} op={1 - win(t, big + 0.3, big + 0.6)} />
      <Obj id="o_diver" L={0.22} p={[0.0 + (1 - Math.min(1, diverIn)) * 0.32, 0, 0.012]} r={[0, 0.05, 0]} op={win(t, big + 0.3, big + 0.5)} />
      <group position={[-0.07, 0.006 + 0.022 * tent, 0]} rotation={[0, 0, -0.16 * tent]}>
        <Obj id="o_puno" L={0.3} p={[0, 0, 0]} r={[0, 0.05, 0]} />
      </group>
      <Tinta tex={mark} w={0.14} h={0.06} p={[0.06, 0.003, -0.05]} />
      <Tinta tex={tentL} w={0.1} h={0.067} p={[0.03, 0.03, 0.05]} />
    </Escena>
  </Stage>;
};

// ============ periodico · el lápiz cuenta las esferas del cronógrafo: demasiado para leer ============
const SUB: [number, number, number][] = [[-0.006, -0.0104, 0.0062], [0.005, 0.0006, 0.0062], [-0.005, 0.0116, 0.0062], [-0.006, 0.0016, 0.031]];
export const PeriodicoF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.36, 0, 0, 0.22);
  const ink = tinta("diario", 1024, 1024, win(t, a + 0.4, w - 0.2), "tiza", (g, p) => {
    g.lineWidth = 8;
    SUB.forEach(([x, y, r], i) => { const k = cl(p * SUB.length - i); if (k <= 0) return; pathP(g, ring(512 + x * 4600, 512 + y * 4600, r * 4600 * 1.15, r * 4600 * 1.15, i), k); if (k > 0.7) escribir(g, String(i + 1), 512 + x * 4600 + r * 4600 * 0.8 + 40, 512 + y * 4600 - r * 4600 * 0.8 - 20, 110, 1, HAND); });
  });
  const tag = tinta("demasiado", 512, 300, win(t, w - 0.45, w + 0.4), "pluma", (g, p) => escribir(g, "too much", 256, 150, 110, p, HAND));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_mesa" w={1.2} o={0.55} />
      <Obj id="o_cockpit" L={0.34} p={[0, caer(t, a + 0.05, 0.08, 1.4), 0]} r={[0, Math.PI / 2, 0]} op={aparece(t, a + 0.05)} />
      <Tinta tex={ink} w={0.22} h={0.22} p={[0, 0.014, 0]} />
      <Obj id="o_tag" L={0.065} p={[0.07, caer(t, w - 0.6, 0.1), 0.062]} r={[0, -0.3, 0]} op={aparece(t, w - 0.6)}>
        <group position={[0.004, 0.006, 0]}><Tinta tex={tag} w={0.055} h={0.032} /></group>
      </Obj>
    </Escena>
  </Stage>;
};

// ============ cajon · el cajón del padre: el reloj chico ya estaba ahí. Costo cero ============
export const CajonF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0.0, 0.62, 0.06, 0.02, 0.3);
  const tag = tinta("cero", 512, 300, win(t, w + 0.1, w + 0.9), "pluma", (g, p) => escribir(g, "$0", 256, 150, 170, p, HAND));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_cajon" w={1.0} o={0.4} />
      <Obj id="o_tag" L={0.08} p={[0.0, caer(t, w - 0.1, 0.12), 0.075]} r={[0, 0.4, 0]} op={aparece(t, w - 0.1)}>
        <group position={[0.004, 0.006, 0]}><Tinta tex={tag} w={0.055} h={0.032} /></group>
      </Obj>
      <Destello p={[0.15, 0.02, 0.04]} s={0.05} k={win(t, w - 0.3, w) * (1 - win(t, w + 0.4, w + 1))} />
    </Escena>
  </Stage>;
};

// ============ secreto · la manga se corre apenas y el reloj asoma, como un secreto ============
export const SecretoF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), sale = f.mo?.sale ?? a + 3;
  // la manga tapa el reloj; se corre 3 cm (asoma media esfera) y vuelve a taparlo: un secreto
  const slide = (win(t, sale - 0.2, sale + 1.0) - win(t, w + 1.0, w + 1.8)) * 0.03;
  const cam = top(t, a, b, 0.02, 0, 0.38, 0.05, 0.005, 0.26);
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_corte" w={1.2} o={0.55} />
      <Obj id="o_dress" L={0.2} p={[0.06, 0, 0.01]} r={[0, 0.05, 0]} />
      <group position={[0.0 - slide, 0.006, 0]}><Obj id="o_puno" L={0.32} p={[0, 0, 0]} r={[0, 0.05, 0]} /></group>
      <Destello p={[0.07, 0.02, 0.005]} s={0.05} k={win(t, w - 0.2, w + 0.15) * (1 - win(t, w + 0.5, w + 1.0))} />
    </Escena>
  </Stage>;
};

// ============ grita · el de oro con brillantes sale de su caja y destella: grita el precio ============
export const GritaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const up = spr(t, a + 0.6, 0.8, 1.6), cam = top(t, a, b, 0, 0.0, 0.5, 0.02, 0.0, 0.3);
  const tag = tinta("precio", 600, 300, win(t, w + 0.05, w + 0.8), "labial", (g, p) => { escribir(g, "$$$$$", 300, 150, 150, p, HAND); });
  const bling = (i: number) => win(t, w - 0.1 + i * 0.12, w + 0.1 + i * 0.12) * (1 - win(t, w + 0.6 + i * 0.12, w + 1.1 + i * 0.12));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_mesa" w={1.2} o={0.55} />
      <Obj id="o_cajaoro" L={0.26} p={[-0.06, 0, -0.01]} op={aparece(t, a + 0.05)} />
      <Obj id="o_oro" L={0.22} p={[lerp(-0.06, 0.03, Math.min(1, up)), 0.02 + 0.04 * Math.min(1, up), 0.02]} r={[0, 0.12, 0]} op={aparece(t, a + 0.1)} />
      {[[-0.01, 0.006], [0.025, -0.012], [0.05, 0.012], [0.02, 0.028], [0.005, -0.02]].map(([x, z], i) => <Destello key={i} p={[0.03 + x, 0.075, 0.02 + z]} s={0.05 + 0.02 * rn(i, 3)} k={bling(i)} />)}
      <Obj id="o_tag" L={0.11} p={[0.1, caer(t, w - 0.1, 0.14), 0.035]} r={[0, -0.35, 0]} op={aparece(t, w - 0.1)}>
        <group position={[0.005, 0.006, 0]}><Tinta tex={tag} w={0.076} h={0.038} /></group>
      </Obj>
    </Escena>
  </Stage>;
};

// ============ diez · diez segundos de reloj: la aguja del cronómetro avanza tic a tic ============
export const DiezF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, t0 = a + 0.5, secs = Math.min(10, Math.max(0, Math.floor(t - t0)) + spr(t, t0 + Math.floor(Math.max(0, t - t0)), 3, 2.4));
  const ang = -(secs / 60) * Math.PI * 2, cam = top(t, a, b, 0, 0.0, 0.4, 0, 0.0, 0.32);
  const R = 0.062;   // radio de la esfera dentro de la foto (L=0.2)
  const arc = tinta("diez", 512, 512, secs / 10, "labial", (g, p) => {
    g.globalAlpha = 0.55; g.beginPath(); g.moveTo(256, 256); g.arc(256, 256, 230, -Math.PI / 2, -Math.PI / 2 + (p * 10 / 60) * Math.PI * 2); g.closePath(); g.fill(); g.globalAlpha = 1;
  });
  const diezL = tinta("diezs", 400, 200, win(t, a + 10.4, a + 11.0), "labial", (g, p) => escribir(g, "10 s", 200, 100, 120, p, HAND));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_mesa" w={1.2} o={0.55} />
      <Obj id="o_cronometro" L={0.2} p={[0, caer(t, a + 0.05, 0.08, 1.4), 0.012]} op={aparece(t, a + 0.05)} />
      <Tinta tex={arc} w={R * 2} h={R * 2} p={[0, 0.021, 0.02]} op={0.85} />
      <Tinta tex={diezL} w={0.07} h={0.035} p={[0.115, 0.004, 0.045]} />
      <group position={[0, 0.023, 0.02]} rotation={[0, ang, 0]}>
        <mesh position={[0, 0, -R * 0.42]} castShadow><boxGeometry args={[0.0022, 0.0012, R * 1.15]} /><meshStandardMaterial color="#141414" roughness={0.4} metalness={0.6} /></mesh>
        <mesh><cylinderGeometry args={[0.004, 0.004, 0.002, 20]} /><meshStandardMaterial color="#141414" metalness={0.7} roughness={0.3} /></mesh>
      </group>
    </Escena>
  </Stage>;
};

// ============ contraste · esfera blanca y agujas negras contra la pantalla negra: gana el contraste ============
export const ContrasteF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f), dim = win(t, w - 0.3, w + 0.5);
  const cam = top(t, a, b, 0, 0.0, 0.42, 0.0, -0.015, 0.34);
  const ink = tinta("contraste", 512, 512, win(t, w + 0.2, w + 1.0), "tiza", (g, p) => { g.lineWidth = 12; pathP(g, ring(256, 256, 200, 200, 2), p); });
  const gana = tinta("gana", 700, 200, win(t, w + 0.8, w + 1.6), "tiza", (g, p) => escribir(g, "contrast, not size", 350, 100, 80, p, HAND));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_mesa" w={1.2} o={0.55} luz={1 - 0.4 * dim} />
      <Obj id="o_blanco" L={0.2} p={[-0.05, caer(t, a + 0.1, 0.1), 0]} op={aparece(t, a + 0.1)} />
      <Obj id="o_smart" L={0.2} p={[0.05, caer(t, a + 0.5, 0.1), 0]} luz={1.35 - 0.75 * dim} op={aparece(t, a + 0.5)} />
      <Tinta tex={ink} w={0.075} h={0.075} p={[-0.05, 0.012, 0]} />
      <Tinta tex={gana} w={0.24} h={0.069} p={[0, 0.03, -0.075]} />
    </Escena>
  </Stage>;
};

// ============ hueso · la tiza dibuja la muñeca; el reloj va contra el hueso, no sobre la mano ============
export const HuesoF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  // la manga (puño de camisa) es el brazo; el reloj fino cae justo en el borde, contra el hueso: ✓. Más allá, la mano: ✗
  const cam = top(t, a, b, 0, 0, 0.42, 0.02, 0, 0.32);
  const si = tinta("hueso", 600, 600, win(t, w - 0.1, w + 0.6), "tiza", (g, p) => { g.lineWidth = 10; pathP(g, ring(300, 300, 230, 200, 3), cl(p * 1.3)); });
  const lb = tinta("bone", 600, 200, win(t, w + 0.3, w + 1.0), "tiza", (g, p) => escribir(g, "bone", 300, 100, 110, p, HAND));
  const no = tinta("nomano", 512, 512, win(t, w + 0.8, w + 1.3), "labial", (g, p) => { g.lineWidth = 22; pathP(g, [[90, 90], [420, 420]], cl(p * 2)); if (p > 0.5) pathP(g, [[420, 90], [90, 420]], cl(p * 2 - 1)); });
  const lh = tinta("hand", 600, 200, win(t, w + 1.1, w + 1.7), "labial", (g, p) => escribir(g, "hand", 300, 100, 110, p, HAND));
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_corte" w={1.2} o={0.55} />
      <Obj id="o_dress" L={0.2} p={[0.0, caer(t, w - 0.5, 0.12, 1.2), 0.0]} r={[0, 0.03, 0]} op={aparece(t, w - 0.5)} />
      <group position={[-0.1, 0.006, 0]}><Obj id="o_puno" L={0.3} p={[0, 0, 0]} r={[0, 0.05, 0]} /></group>
      <Tinta tex={si} w={0.07} h={0.07} p={[0.012, 0.016, 0.0]} />
      <Tinta tex={lb} w={0.09} h={0.03} p={[0.012, 0.004, -0.055]} />
      <Tinta tex={no} w={0.045} h={0.045} p={[0.13, 0.004, 0.0]} />
      <Tinta tex={lh} w={0.09} h={0.03} p={[0.13, 0.004, -0.045]} />
    </Escena>
  </Stage>;
};

// ============ cajita · Giuseppe esperó en la vereda con una cajita: el reloj entra y se tapa ============
export const CajitaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0, 0.5, 0.0, 0.0, 0.36);
  const into = spr(t, w - 2.2, 0.7, 1.5), tapa = win(t, w + 0.6, w + 1.4);
  // la cajita de cartón de 1976 (caja y tapa de la misma foto): el reloj hace el arco y entra; la tapa baja encima
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_mesa" w={1.2} o={0.55} />
      <Obj id="o_cajita_caja" L={0.16} p={[0, caer(t, a + 0.1, 0.1), 0]} capas={10} esp={0.003} op={aparece(t, a + 0.1)} />
      <Obj id="o_giuseppe" L={0.13} p={[lerp(0.15, 0.0, Math.min(1, into)), 0.034 + 0.08 * Math.sin(Math.PI * cl(into)), lerp(0.05, 0, cl(into))]} r={[0, Math.PI / 2 + 0.5 * (1 - cl(into)), 0]} op={aparece(t, w - 2.2)} />
      <Obj id="o_cajita_tapa" L={0.168} p={[lerp(-0.26, 0.0, tapa), 0.05 + 0.04 * (1 - win(t, w + 1.1, w + 1.4)), 0]} capas={4} esp={0.003} op={win(t, w + 0.55, w + 0.7)} />
    </Escena>
  </Stage>;
};

// ============ lista · diez renglones en papel crema; la pluma vuelve y encierra el número uno ============
export const ListaF: React.FC<CP> = ({ t, f }) => {
  const { a, b } = f, w = W(f);
  const cam = top(t, a, b, 0, 0.0, 0.5, -0.02, 0.0, 0.44);
  const ink = tinta("lista", 900, 1000, win(t, a + 0.3, w - 0.2), "pluma", (g, p) => {
    for (let i = 0; i < 10; i++) {
      const k = cl(p * 10 - i); if (k <= 0) break;
      const y = 90 + i * 88; escribir(g, `${i + 1}.`, 110, y, 64, 1, HAND, "right");
      if (i === 0) { escribir(g, "one watch. thin.", 160, y + 8, 62, k, HAND, "left"); continue; }
      g.lineWidth = 5; const L = 360 + 300 * rn(i, 4); const pts = Array.from({ length: 24 }, (_, j) => [150 + (L * j) / 23, y + 6 * Math.sin(j * 1.7 + i) + 4 * rn(i * 31 + j, 2)]);
      pathP(g, pts, k);
    }
  });
  const uno = tinta("uno", 900, 1000, win(t, w, w + 0.7), "labial", (g, p) => { g.lineWidth = 12; pathP(g, ring(330, 92, 290, 62, 5), p); });
  return <Stage t={t} a={a} b={b} dim={0.6}>
    <Escena cam={cam}>
      <Fondo id="o_mesa" w={1.2} o={0.55} />
      <group scale={[0.86, 0.86, 0.86]} position={[0, 0, 0.012]}>
        <Obj id="o_papel" L={0.3} p={[0, caer(t, a + 0.05, 0.06, 1.4), 0]} op={aparece(t, a + 0.05)} />
        <Tinta tex={ink} w={0.2} h={0.222} p={[0, 0.012, 0]} />
        <Tinta tex={uno} w={0.2} h={0.222} p={[0, 0.013, 0]} />
      </group>
    </Escena>
  </Stage>;
};
