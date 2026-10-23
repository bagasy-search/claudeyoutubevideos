// cerpapeles · DESARROLLO + CIERRE (151,2-863,5 s). Mismo hilo que el minuto 1: la maqueta 3D es el mapa de la casa y
// cada lugar se visita con la cámara (vuela de un cuarto a otro, nunca corta en seco), las fotos de cada frase entran con
// barridos, el avatar entra por portales. Todo clavado a la voz con at(). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, makeCam, type Key, type WorldState } from "./casa3d";
import { Avatar, Desc, DocList, GoodRing, MIN1_END, Shot, Stamp, Stopwatch, Subscribe, Swipe, ThermHud, WIN, at } from "./Min1";
import { BigNum, COL, FONT, P, Portal, Tag, e, ei, extrude, spr } from "./lib";

export const END = 863.5;
const a = (ph: string, after = 151) => at(ph, after);

// ---------------- ventanas del avatar de esta parte (las pagó el /run) ----------------
const RW = WIN.filter((w) => w.ms >= MIN1_END - 0.2).map((w) => [w.ms, w.me] as [number, number]);
const winAt = (t: number) => RW.findIndex(([s0, e0]) => t >= s0 && t < e0);

// ---------------- poses de cámara por lugar ----------------
type Pose = { p: [number, number, number]; l: [number, number, number]; fov: number };
const over = (x: number): Pose => ({ p: [x, 4.6, 2.9], l: [x, 0.3, -1.6], fov: 50 });
const POSE: Record<string, Pose> = {
  desk: { p: [3.6, 1.45, 0.25], l: [2.85, 0.7, -1.55], fov: 36 },
  deskTop: { p: [3.25, 1.95, -0.55], l: [2.97, 0.62, -1.48], fov: 32 },
  cabinet: { p: [4.7, 1.75, 0.7], l: [3.95, 1.05, -1.6], fov: 36 },
  cabLock: { p: [4.3, 1.45, -0.75], l: [3.95, 1.2, -1.6], fov: 30 },
  box: { p: [5.9, 1.35, 0.9], l: [6.35, 0.3, -1.8], fov: 38 },
  freezer: { p: [-2.7, 2.3, 1.5], l: [-3.9, 1.15, -1.8], fov: 40 },
  freezerIn: { p: [-4.0, 2.25, -0.35], l: [-4.3, 1.3, -1.6], fov: 34 },
  garage: { p: [-7.2, 3.0, 2.6], l: [-7.2, 0.6, -1.2], fov: 48 },
  car: { p: [-6.0, 1.6, 1.2], l: [-7.05, 0.78, -0.35], fov: 40 },
  mail: { p: [0.6, 1.5, 0.6], l: [-0.2, 0.78, -1.7], fov: 36 },
  closetWide: { p: [7.4, 3.0, 3.2], l: [9.1, 0.9, -1.8], fov: 40 },
  closet: { p: [9.1, 2.05, 0.9], l: [9.22, 1.35, -1.9], fov: 42 },
  safe: { p: [8.6, 1.0, 0.4], l: [9.2, 0.3, -2.0], fov: 36 },
  over0: over(0), over2: over(2.5), over4: over(4.5), overG: over(-3.5),
};
const push = (q: Pose, k = 0.12): Pose => ({ p: q.p.map((v, i) => v + (q.l[i] - v) * k) as Pose["p"], l: q.l, fov: q.fov - 2 });

// ---------------- el guion visual: cada frase con SU imagen o SU lugar de la maqueta ----------------
// v = "img:<clave>" (foto/clip a cuadro completo) · "w:<pose>" (la maqueta) · "wd:<pose>" (maqueta oscurecida, para gráficos)
const B: { a: number; v: string }[] = [
  { a: MIN1_END, v: "w:desk" },
  { a: a("la comoda del pasillo"), v: "img:r_comoda" },
  { a: 168.4, v: "w:deskTop" },
  { a: a("lo mete en la bolsa"), v: "img:r_saca" },
  { a: a("lo que hace casi todo el mundo"), v: "img:r_cuentas" },
  { a: 183.0, v: "img:c_carpetas" },
  { a: a("lo que yo hago"), v: "w:deskTop" },
  { a: 201.3, v: "img:r_libreta" },
  { a: a("pegada debajo del teclado"), v: "img:r_teclado" },
  { a: 218.3, v: "img:r_billetera" },
  { a: a("con la tarjeta la clave"), v: "wd:desk" },
  { a: 234.4, v: "w:desk" },
  { a: a("si necesitas anotarlas"), v: "img:c_hoja" },
  { a: a("lugar numero 2"), v: "w:cabinet" },
  { a: 250.6, v: "img:r_mueble_llave" },
  { a: a("todos creen que"), v: "img:r_archivador" },
  { a: a("te lo digo como cerrajero"), v: "w:cabLock" },
  { a: 265.8, v: "img:c_destornillador" },
  { a: a("y se mete la mano"), v: "img:r_hueco" },
  { a: a("yo las abro todas"), v: "img:c_cafe" },
  { a: 285.3, v: "w:cabLock" },
  { a: a("en el portalapices", 280), v: "img:r_portalapices" },
  { a: a("colgada de un clavito"), v: "img:r_clavito" },
  { a: a("la taza de los botones"), v: "img:r_taza_botones" },
  { a: 304.0, v: "img:r_llavero_cocina" },
  { a: a("lo que yo hago", 305), v: "w:cabinet" },
  { a: 318.2, v: "img:c_facturas" },
  { a: a("lugar numero 3"), v: "w:box" },
  { a: 334.5, v: "img:r_caja_gris" },
  { a: a("la agarra de la manija"), v: "img:r_manija" },
  { a: 351.6, v: "w:box" },
  { a: a("con una barreta"), v: "img:r_barreta" },
  { a: a("confundir contra el fuego"), v: "wd:box" },
  { a: 368.5, v: "wd:box" },
  { a: 387.9, v: "img:r_senora" },
  { a: a("atornillada al piso"), v: "img:c_atornillar" },
  { a: 404.6, v: "img:r_bolsa_cierre" },
  { a: a("lugar numero 4"), v: "w:freezer" },
  { a: a("en una bolsa adentro"), v: "img:r_freezer_bolsa" },
  { a: 421.5, v: "w:freezerIn" },
  { a: a("mete la mano entre"), v: "img:r_mano_freezer" },
  { a: 437.7, v: "w:freezer" },
  { a: a("cuando se corta la luz"), v: "img:r_descongela" },
  { a: 453.9, v: "img:c_caja_vieja" },
  { a: a("estaba pegada al hielo"), v: "img:r_escritura_hielo" },
  { a: a("los papeles quieren"), v: "wd:freezer" },
  { a: 486.2, v: "wd:over0" },
  { a: a("el lugar que nadie piensa"), v: "w:garage" },
  { a: 501.9, v: "img:r_guantera" },
  { a: a("colgado del parasol"), v: "img:r_parasol" },
  { a: a("el ladron rompe el vidrio"), v: "img:r_vidrio" },
  { a: 519.2, v: "w:car" },
  { a: 534.4, v: "w:car" },
  { a: a("el control del porton no va"), v: "img:c_llavero" },
  { a: a("un ultimo lugar"), v: "w:mail" },
  { a: 551.5, v: "img:r_cartas" },
  { a: a("se tiran enteros"), v: "img:r_basura" },
  { a: a("o quedan apilados"), v: "w:mail" },
  { a: 568.7, v: "w:overG" },
  { a: a("y ahora te digo donde"), v: "w:closetWide" },
  { a: 582.9, v: "w:closet" },
  { a: 599.8, v: "w:closet" },
  { a: a("una carpeta gorda"), v: "img:c_manuales" },
  { a: 614.7, v: "img:r_manuales" },
  { a: a("ningun ladron se lleva"), v: "w:closetWide" },
  { a: 631.6, v: "img:r_baul" },
  { a: a("nadie se pone a mover"), v: "w:safe" },
  { a: a("adentro los papeles en una carpeta"), v: "img:c_indice" },
  { a: 649.0, v: "img:r_alcanza" },
  { a: a("un lugar que te cuesta"), v: "w:closet" },
  { a: 662.7, v: "wd:over4" },
  { a: 679.5, v: "img:c_fotos" },
  { a: a("y una copia en un pendrive"), v: "img:r_pendrive" },
  { a: 694.8, v: "wd:over2" },
  { a: a("y en el cajon del escritorio donde"), v: "img:r_senuelo" },
  { a: 709.8, v: "wd:over0" },
  { a: a("ni al vecino"), v: "img:r_vecino" },
  { a: 726.7, v: "img:c_hoja_familia" },
  { a: a("esa hoja tambien"), v: "w:desk" },
  { a: 743.8, v: "w:over2" },
  { a: a("en manos de tu escribano"), v: "img:r_escribano" },
  { a: 760.7, v: "img:r_banco_caja" },
  { a: a("te lo repito rapido"), v: "w:overG" },
  { a: 778.0, v: "w:over2" },
  { a: a("donde los guardo yo", 780), v: "w:closetWide" },
  { a: 793.2, v: "wd:over4" },
  { a: a("y ahora te pregunto"), v: "wd:over0" },
  { a: a("todo esto lo escribi"), v: "wd:over2" },
  { a: 826.6, v: "wd:over2" },
  { a: 841.4, v: "wd:over4" },
  { a: a("en el proximo te muestro"), v: "img:r_caja_fuerte" },
  { a: 856.9, v: "w:over2" },
].sort((x, y) => x.a - y.a);
const beatAt = (t: number) => { let i = 0; while (i < B.length - 1 && B[i + 1].a <= t) i++; return i; };

// ---------------- tramos en VISTA TÉRMICA (lo que ve el ladrón) ----------------
const THERM: [number, number][] = [[568.7, a("y ahora te digo donde")], [743.8, a("en manos de tu escribano")], [a("te lo repito rapido"), a("donde los guardo yo", 780)]];
const thermAt = (t: number) => THERM.some(([x, y]) => t >= x && t < y);

// ---------------- la cámara: vuela de pose en pose (si viene de otra toma de la maqueta) y empuja despacio ----------------
const KEYS: Key[] = [];
{
  let prev: Pose | null = null;
  B.forEach((b, i) => {
    const end = i < B.length - 1 ? B[i + 1].a : END;
    if (!b.v.startsWith("w")) { prev = null; return; }
    const q = POSE[b.v.split(":")[1]];
    const fly = prev && end - b.a > 2.2 ? 1.1 : 0;
    if (prev) KEYS.push({ t: b.a, ...prev });
    KEYS.push({ t: b.a + fly, ...q, arc: 0.03 });
    prev = push(q, 0.1 + Math.min(0.12, (end - b.a) * 0.01));
    KEYS.push({ t: end - 0.01, ...prev });
  });
}
const CAM = makeCam(KEYS);
const { screenOf } = CAM;

// ---------------- estado del mundo por tramo ----------------
const on = (t: number, x: number, y = 1e9, f = 0.4) => e(t, x, x + f) * (1 - e(t, y, y + f));
const S = { l1: MIN1_END, l2: a("lugar numero 2"), l3: a("lugar numero 3"), l4: a("lugar numero 4"), l5: a("lugar numero 5"), n6: a("numero 6"), n7: a("numero 7") };
const stAt = (t: number): WorldState => {
  const th = thermAt(t), recap = t >= 563 && t < S.n6 || t >= 765 && t < 793;
  return {
    lamps: th ? 0.05 : 1,
    drawer: on(t, S.l1, S.l2), pry: on(t, a("se fuerza el cajon"), S.l3), wardrobe: on(t, S.l3 - 0.5, S.l4) + on(t, 620, S.n7), lift: 0,
    freezer: on(t, S.l4 + 0.5, 486), glove: on(t, S.l5, 563), trunk: on(t, a("nadie se pone a mover"), S.n7, 1.0),
    trail: recap ? e(t, 568.7, 576) : 0, flash: 0, flashAt: PT.desk, flashFrom: [3.45, 1.55, -0.35],
    hot: th ? "#ffffff" : "#ff3a2a",
    heat: recap ? { desk: 1, cabinet: 1, box: 1, freezer: 1, glove: 1 } : {
      desk: on(t, S.l1 + 0.5, S.l2), cabinet: on(t, S.l2 + 0.5, S.l3), box: on(t, S.l3 + 0.5, S.l4), freezer: on(t, S.l4 + 0.5, 486), glove: on(t, S.l5, 563) },
    good: on(t, a("y ahora te digo donde"), S.n7) + on(t, a("donde los guardo yo", 780), 793),
  };
};

const WorldR: React.FC<{ t: number; dim?: number }> = ({ t, dim = 0 }) => {
  const th = thermAt(t);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="thermR" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.35 0.55 0.1 0 0  0.35 0.55 0.1 0 0  0.35 0.55 0.1 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.01 0.12 0.42 0.82 1 1 1" />
            <feFuncG type="table" tableValues="0.01 0.03 0.04 0.16 0.5 0.85 1" />
            <feFuncB type="table" tableValues="0.1 0.42 0.62 0.42 0.08 0.15 0.9" />
          </feComponentTransfer>
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: [th ? "url(#thermR)" : "", dim > 0 ? `brightness(${1 - dim})` : ""].join(" ").trim() || undefined }}><WorldRaw t={t} camAt={CAM.camAt} st={stAt(t)} /></AbsoluteFill>
      {th && <ThermHud t={t} />}
    </AbsoluteFill>
  );
};

// una toma del guion (foto con Ken Burns o la maqueta), dibujada en el segundo t
const Visual: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const b = B[i], end = i < B.length - 1 ? B[i + 1].a : END, [kind, k] = b.v.split(":");
  if (kind === "img") {
    const zin = i % 2 === 0;
    return <Shot k={k} t={t} a={b.a} dur={end - b.a + 0.6} z={zin ? [1.03, 1.13] : [1.13, 1.03]} ox={(i % 3 - 1) * 24} oy={zin ? -10 : 10} />;
  }
  return <WorldR t={t} dim={kind === "wd" ? 0.5 : 0} />;
};

// ---------------- piezas de esta parte ----------------
const PlaceTitle: React.FC<{ t: number; at: number; out: number; n: string; name: string; good?: boolean }> = ({ t, at: a0, out, n, name, good }) => {
  const k = Math.min(1.12, spr(t, a0, 0.85)), o = e(t, a0, a0 + 0.12) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const c = good ? "#7dffb4" : "#ff8a7a", edge = good ? "#0b3a22" : "#4a0c08";
  return (
    <div style={{ position: "absolute", left: 90, top: 110, opacity: o, fontFamily: FONT, perspective: 1200 }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70}deg)`, transformOrigin: "0 50%" }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: COL.ink, letterSpacing: 10, textShadow: "0 3px 12px #000" }}>{good ? "NÚMERO" : "LUGAR"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: c, textShadow: extrude(10, edge) }}>{n}</div>
          <div style={{ fontWeight: 900, fontSize: 62, lineHeight: 1.05, color: "#fff", maxWidth: 720, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.7)"), clipPath: `inset(0 ${100 - 100 * e(t, a0 + 0.25, a0 + 0.7)}% 0 0)` }}>{name}</div>
        </div>
      </div>
    </div>
  );
};

// pastilla arriba: ✗ LO QUE HACE CASI TODO EL MUNDO / ✓ LO QUE YO HAGO
const Chip: React.FC<{ t: number; at: number; out: number; good?: boolean; text?: string }> = ({ t, at: a0, out, good, text }) => {
  const k = Math.min(1.1, spr(t, a0)), o = e(t, a0, a0 + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `translateY(${(1 - Math.min(1, k)) * -90}px)`, display: "flex", alignItems: "center", gap: 18, padding: "14px 36px", borderRadius: 50, fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: "#fff",
        background: good ? "linear-gradient(180deg,#1f7a4d,#13452c)" : "linear-gradient(180deg,#a3221b,#5e0f0b)", boxShadow: `0 24px 50px rgba(0,0,0,.55), 0 0 30px ${good ? "rgba(63,224,138,.45)" : "rgba(255,60,40,.45)"}` }}>
        <span style={{ fontSize: 46 }}>{good ? "✓" : "✗"}</span>{text ?? (good ? "LO QUE YO HAGO" : "LO QUE HACE CASI TODO EL MUNDO")}
      </div>
    </div>
  );
};

// filas de verdad/mentira (✓ / ✗) que entran con su frase
const Rows: React.FC<{ t: number; out: number; y?: number; items: { at: number; tx: string; ok: boolean }[] }> = ({ t, out, y = 300, items }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, fontFamily: FONT }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at, 0.9)), o = e(t, it.at, it.at + 0.12) * (1 - e(t, out, out + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 300 : -300)}px)`, display: "flex", alignItems: "center", gap: 26, padding: "16px 44px", borderRadius: 22,
          background: "rgba(10,14,22,.86)", boxShadow: `0 0 0 4px ${it.ok ? "#3fe08a" : COL.red}, 0 30px 60px rgba(0,0,0,.55)` }}>
          <span style={{ fontWeight: 900, fontSize: 70, color: it.ok ? "#7dffb4" : "#ff6b5e" }}>{it.ok ? "✓" : "✗"}</span>
          <span style={{ fontWeight: 900, fontSize: 60, color: "#fff", letterSpacing: 2 }}>{it.tx}</span>
        </div>
      );
    })}
  </div>
);

// tarjeta + clave + documento = te roba desde el teléfono
const Equation: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a0, out }) => {
  const parts = [{ ic: "💳", tx: "TARJETA" }, { ic: "🔢", tx: "CLAVE" }, { ic: "🪪", tx: "DOCUMENTO" }, { ic: "📱", tx: "TE ROBA DESDE EL TELÉFONO" }];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, fontFamily: FONT }}>
      {parts.map((p, i) => {
        const ai = a0 + i * 0.55, k = Math.min(1.1, spr(t, ai, 0.9)), o = e(t, ai, ai + 0.12) * (1 - e(t, out, out + 0.3)), last = i === 3;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ opacity: o, fontWeight: 900, fontSize: 80, color: COL.dim }}>{last ? "=" : "+"}</span>}
            <div style={{ opacity: o, transform: `scale(${0.5 + 0.5 * Math.min(1, k)})`, minWidth: last ? 420 : 250, padding: "24px 18px 18px", borderRadius: 26, textAlign: "center",
              background: last ? "linear-gradient(180deg,#a3221b,#5e0f0b)" : "linear-gradient(180deg,rgba(250,248,242,.97),rgba(226,222,212,.97))", boxShadow: "0 36px 70px rgba(0,0,0,.6)" }}>
              <div style={{ fontSize: 110, lineHeight: 1.1 }}>{p.ic}</div>
              <div style={{ fontWeight: 900, fontSize: last ? 34 : 36, color: last ? "#fff" : "#1d2733", letterSpacing: 2, marginTop: 8, padding: "0 14px" }}>{p.tx}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// las tres copias: tres tarjetas que se paran en fila
const Copies: React.FC<{ t: number; ats: [number, number, number]; out: number; y?: number }> = ({ t, ats, out, y = 560 }) => {
  const c = [{ ic: "📁", tx: "EL ORIGINAL", sub: "MANUALES O CAJA ATORNILLADA" }, { ic: "☁️", tx: "FOTO + NUBE", sub: "CELULAR CON CLAVE" }, { ic: "🏡", tx: "UNA COPIA AFUERA", sub: "EN CASA DE UN FAMILIAR" }];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, perspective: 1300, fontFamily: FONT }}>
      {c.map((it, i) => {
        const k = Math.min(1.1, spr(t, ats[i], 0.9)), o = e(t, ats[i], ats[i] + 0.12) * (1 - e(t, out, out + 0.3));
        return (
          <div key={i} style={{ opacity: o, transform: `rotateX(${(1 - Math.min(1, k)) * 80}deg) translateY(${Math.sin(t * 1.5 + i) * 5}px)`, transformOrigin: "50% 100%", width: 440, padding: "20px 0 18px", borderRadius: 24, textAlign: "center",
            background: "linear-gradient(180deg,#1f6b45,#13452c)", boxShadow: "0 36px 70px rgba(0,0,0,.6), 0 0 0 3px rgba(125,255,180,.5)" }}>
            <div style={{ fontWeight: 900, fontSize: 46, color: "#bfffd9" }}>{i + 1}</div>
            <div style={{ fontSize: 90, lineHeight: 1.1 }}>{it.ic}</div>
            <div style={{ fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: 2, marginTop: 6 }}>{it.tx}</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: "rgba(255,255,255,.75)", letterSpacing: 2, marginTop: 4 }}>{it.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

// la ruta del ladrón (repaso): las 5 paradas nacen con su frase
const Route2: React.FC<{ t: number; ats: number[]; out: number; y?: number; good?: number }> = ({ t, ats, out, y = 880, good }) => {
  const items = ["ESCRITORIO", "CAJÓN CON LLAVE", "CAJA ANTIFUEGO", "CONGELADOR", "EL AUTO"];
  const g = good ?? 1e9, gk = Math.min(1.1, spr(t, g)), go = e(t, g, g + 0.1) * (1 - e(t, out, out + 0.3));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 16, perspective: 1200, fontFamily: FONT }}>
      {items.map((tx, i) => {
        const k = Math.min(1.1, spr(t, ats[i])), o = e(t, ats[i], ats[i] + 0.1) * (1 - e(t, out, out + 0.3));
        return (
          <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, width: 262, padding: "12px 0 10px", borderRadius: 16, textAlign: "center",
            background: "linear-gradient(180deg, rgba(60,10,12,.95), rgba(26,6,8,.95))", boxShadow: `0 22px 44px rgba(0,0,0,.6), 0 0 0 2px ${COL.red}aa` }}>
            <div style={{ fontWeight: 900, fontSize: 58, color: "#ff8a7a", lineHeight: 1, textShadow: extrude(5, "#3a0505") }}>{i + 1}</div>
            <div style={{ fontWeight: 800, fontSize: 25, color: COL.ink, letterSpacing: 2, marginTop: 6 }}>{tx}</div>
          </div>
        );
      })}
      {good !== undefined && <div style={{ opacity: go, transform: `translateY(${(1 - Math.min(1, gk)) * 120}px)`, width: 300, padding: "12px 0 10px", borderRadius: 16, textAlign: "center",
        background: "linear-gradient(180deg,#1f6b45,#13452c)", boxShadow: "0 22px 44px rgba(0,0,0,.6), 0 0 30px rgba(63,224,138,.5)" }}>
        <div style={{ fontWeight: 900, fontSize: 58, color: "#bfffd9", lineHeight: 1 }}>✓</div>
        <div style={{ fontWeight: 800, fontSize: 25, color: "#fff", letterSpacing: 2, marginTop: 6 }}>EL DEL CERRAJERO</div>
      </div>}
    </div>
  );
};

// frase grande en dos renglones, palabra por palabra
const Quote: React.FC<{ t: number; at: number; out: number; text: string; col?: string; y?: number; size?: number }> = ({ t, at: a0, out, text, col = "#fff", y = 400, size = 96 }) => {
  const w = text.split(" "), o = 1 - e(t, out, out + 0.3);
  if (t < a0 || o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.12, color: col, letterSpacing: 2, opacity: o }}>
      {w.map((x, i) => { const ai = a0 + i * 0.12, k = Math.min(1.1, spr(t, ai)); return <span key={i} style={{ display: "inline-block", margin: "0 14px", opacity: e(t, ai, ai + 0.08), transform: `translateY(${(1 - Math.min(1, k)) * 60}px)`, textShadow: extrude(7, "rgba(0,0,0,.65)") }}>{x}</span>; })}
    </div>
  );
};

// la pregunta para comentar (tarjeta tipo comentario, se escribe sola)
const Comment: React.FC<{ t: number; at: number; out: number; reply: number }> = ({ t, at: a0, out, reply }) => {
  const k = Math.min(1.1, spr(t, a0, 0.8)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const q = "¿Dónde tenía tu familia la escritura de la casa cuando eras chico?", n = Math.round(q.length * e(t, a0 + 0.3, a0 + 2.6));
  const rs = [{ f: "🇲🇽", tx: "en el congelador 😅" }, { f: "🇦🇷", tx: "debajo del colchón" }, { f: "🇨🇴", tx: "en el congelador, envuelta en papel" }];
  return (
    <div style={{ position: "absolute", left: 360, top: 170, width: 1200, opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, fontFamily: FONT }}>
      <div style={{ padding: "34px 44px", borderRadius: 28, background: "rgba(250,248,242,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontWeight: 900, fontSize: 30, color: "#b03a2e", letterSpacing: 3 }}>💬 ESCRÍBEMELO EN LOS COMENTARIOS</div>
        <div style={{ fontWeight: 800, fontSize: 52, color: "#1d2733", marginTop: 14, lineHeight: 1.2, minHeight: 130 }}>{q.slice(0, n)}<span style={{ opacity: Math.sin(t * 9) > 0 ? 1 : 0 }}>|</span></div>
      </div>
      {rs.map((r, i) => {
        const ai = reply + i * 0.6, kk = Math.min(1.1, spr(t, ai)), oo = e(t, ai, ai + 0.12);
        return <div key={i} style={{ opacity: oo, transform: `translateX(${(1 - Math.min(1, kk)) * 200}px)`, marginTop: 22, marginLeft: 80 + i * 30, display: "inline-flex", alignItems: "center", gap: 18, padding: "14px 30px", borderRadius: 40, background: "rgba(10,14,22,.9)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontWeight: 800, fontSize: 36, color: "#fff", marginRight: 1000 }}>
          <span style={{ fontSize: 44 }}>{r.f}</span>{r.tx}</div>;
      })}
    </div>
  );
};

// la guía: las 5 tapas en abanico, la 4 se adelanta
const Fan: React.FC<{ t: number; at: number; out: number; lift: number }> = ({ t, at: a0, out, lift }) => {
  const o = e(t, a0, a0 + 0.2) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const up = ei(t, lift, lift + 0.7);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1600 }}>
      {[1, 2, 3, 4, 5].map((n, i) => {
        const k = Math.min(1.1, spr(t, a0 + i * 0.12, 0.8)), ang = (i - 2) * 13 * Math.min(1, k), me = n === 4;
        const dy = me ? -70 * up : 40 * up, sc = me ? 1 + 0.18 * up : 1 - 0.08 * up;
        return <Img key={n} src={staticFile(P + `portada_l${n}.png`)} style={{ position: "absolute", left: 960 - 190, top: 250, width: 380, borderRadius: 10, transformOrigin: "50% 160%",
          transform: `rotate(${ang}deg) translateY(${(1 - Math.min(1, k)) * 400 + dy}px) scale(${sc})`, zIndex: me ? 10 : i, boxShadow: "0 40px 80px rgba(0,0,0,.6)", filter: me || up < 0.05 ? undefined : `brightness(${1 - 0.35 * up})` }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", letterSpacing: 4, textShadow: extrude(6, "rgba(0,0,0,.7)"), opacity: e(t, a0 + 0.4, a0 + 0.7) }}>EL MÉTODO DEL CERRAJERO</div>
    </AbsoluteFill>
  );
};

// una página REAL de la guía en 3D: entra girando, la cámara se acerca al título y lo subraya
const Page: React.FC<{ t: number; at: number; out: number; n: number; hl: string }> = ({ t, at: a0, out, n, hl }) => {
  const k = Math.min(1.08, spr(t, a0, 0.7)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const zoom = ei(t, a0 + 0.8, a0 + 3.5), mark = e(t, a0 + 1.4, a0 + 2.2);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1800 }}>
      <div style={{ position: "absolute", left: 960 - 330, top: 70, width: 660, transformOrigin: "50% 20%", transform: `rotateY(${(1 - Math.min(1, k)) * -80}deg) rotateX(${8 - 8 * zoom}deg) scale(${1 + 0.55 * zoom}) translateY(${120 * zoom}px)` }}>
        <Img src={staticFile(P + `pag${n}.png`)} style={{ width: 660, borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }} />
        <div style={{ position: "absolute", left: 60, top: 176, height: 70, width: 540 * mark, background: "rgba(255,214,10,.35)", mixBlendMode: "multiply", borderRadius: 6 }} />
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 90, fontFamily: FONT, opacity: e(t, a0 + 0.5, a0 + 0.8) }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: COL.amber, letterSpacing: 4, textShadow: "0 3px 10px #000" }}>LIBRO 4 · PÁGINA {n}</div>
        <div style={{ fontWeight: 900, fontSize: 52, color: "#fff", letterSpacing: 2, maxWidth: 560, textShadow: extrude(5, "rgba(0,0,0,.7)") }}>{hl}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- composición ----------------
export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  const wi = winAt(t), bi = beatAt(t);

  // ===== capa base: avatar / tomas / maqueta, con portales y barridos =====
  if (wi >= 0) {
    L.push(<Avatar key="av" t={t} />);
  } else {
    const prevW = RW.find(([, e0]) => t >= e0 && t < e0 + 0.38);
    const b = B[bi], startedInWin = winAt(b.a) >= 0 || RW.some(([, e0]) => Math.abs(e0 - b.a) < 0.4);
    if (prevW) L.push(<Swipe key="sx" t={t} a={prevW[1]} b={prevW[1] + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 3 === 0} from={<Avatar t={t} />} to={<Visual i={bi} t={t} />} />);
    else if (bi > 0 && t < b.a + 0.38 && !startedInWin && !(B[bi - 1].v.startsWith("w") && b.v.startsWith("w")))
      L.push(<Swipe key={"sb" + bi} t={t} a={b.a} b={b.a + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 4 === 1} from={<Visual i={bi - 1} t={t} />} to={<Visual i={bi} t={t} />} />);
    else L.push(<Visual key={"v" + bi} i={bi} t={t} />);
    const nextW = RW.find(([s0]) => t >= s0 - 0.35 && t < s0);
    if (nextW) L.push(<Portal key="pw" x={960} y={540} r={ei(t, nextW[0] - 0.35, nextW[0])}><Avatar t={t} /></Portal>);
  }

  // ===== LUGAR 1 · el escritorio =====
  L.push(<PlaceTitle key="t1" t={t} at={MIN1_END + 0.1} out={a("el que busca papeles") + 1.2} n="1" name="EL PRIMER CAJÓN DEL ESCRITORIO" />);
  if (t > 152 && t < 163) { const d = screenOf(t, PT.desk); L.push(<Tag key="dk" t={t} at={a("va derecho al escritorio")} x={d.x} y={d.y} dx={-320} dy={-180} text="DERECHO AL ESCRITORIO" col={COL.amber} out={a("la comoda del pasillo") - 0.2} size={50} />); }
  if (t > 168 && t < 176) { const d = screenOf(t, PT.folder); L.push(<Tag key="nl" t={t} at={a("no lo lee ahi")} x={d.x} y={d.y} dx={-330} dy={-200} text="NO LO LEE AHÍ" sub="LO LEE TRANQUILO EN OTRO LADO" col="#fff" out={a("lo mete en la bolsa") - 0.2} size={52} />); }
  L.push(<Chip key="m1" t={t} at={a("lo que hace casi todo el mundo") + 0.1} out={178.4} />);
  if (t > 183 && t < 192) L.push(<DocList key="dl1" t={t} out={a("le hiciste el trabajo") + 1.0} items={[{ at: a("que dice escrituras"), tx: "ESCRITURAS", ic: "🏠" }, { at: a("otra que dice banco"), tx: "BANCO", ic: "🏦" }, { at: a("otra que dice testamento"), tx: "TESTAMENTO", ic: "✒️" }]} />);
  L.push(<Stamp key="hic" t={t} at={a("le hiciste el trabajo")} text="LE HICISTE EL TRABAJO" x={760} y={560} out={a("lo que yo hago") - 0.1} size={84} />);
  L.push(<Chip key="b1" t={t} at={a("lo que yo hago")} out={195.0} good />);
  if (t > 191 && t < 195.5) { const d = screenOf(t, PT.folder); L.push(<Tag key="no" t={t} at={a("ningun original")} x={d.x} y={d.y} dx={-330} dy={-150} text="NI UN ORIGINAL" col="#7dffb4" out={195.0} size={56} />); }
  L.push(<BigNum key="lib" t={t} at={a("la libretita")} text="LA LIBRETITA" size={96} x={1560} y={200} out={201.0} col="#ffd60a" edge="#5a4500" />);
  if (t > 201 && t < 211) L.push(<DocList key="dl2" t={t} out={a("pegada debajo del teclado") - 0.3} items={[{ at: a("las claves del banco"), tx: "CLAVES DEL BANCO", ic: "🏦" }, { at: a("el numero de la tarjeta"), tx: "NÚMERO DE LA TARJETA", ic: "💳" }, { at: a("la contrasena del correo"), tx: "CLAVE DEL CORREO", ic: "📧" }]} />);
  L.push(<Tag key="tec" t={t} at={a("pegada debajo del teclado") + 0.3} x={900} y={560} dx={-300} dy={-220} text="DEBAJO DEL TECLADO" col={COL.amber} out={212.4} size={50} />);
  L.push(<Tag key="bil" t={t} at={218.6} x={1000} y={560} dx={-320} dy={-230} text="LA CLAVE JUNTO A LA TARJETA" col={COL.red} out={a("con la tarjeta la clave") - 0.1} size={48} />);
  L.push(<Equation key="eq" t={t} at={a("con la tarjeta la clave")} out={229.6} />);
  if (t > 234 && t < 237.5) { const d = screenOf(t, PT.desk); L.push(<Tag key="cl" t={t} at={234.6} x={d.x} y={d.y} dx={-330} dy={-180} text="✗ AL LADO DE LA COMPU" col={COL.red} out={a("si necesitas anotarlas") - 0.1} size={48} />); }
  L.push(<Tag key="ho" t={t} at={a("en otro cuarto") + 0.1} x={1000} y={600} dx={-330} dy={-250} text="OTRO CUARTO" sub="SIN DECIR DE QUÉ SON" col="#7dffb4" out={a("lugar numero 2") - 0.1} size={54} />);

  // ===== LUGAR 2 · el cajón con llavecita =====
  L.push(<PlaceTitle key="t2" t={t} at={S.l2 + 0.1} out={245.4} n="2" name="EL CAJÓN CON LLAVECITA" />);
  L.push(<Tag key="seg" t={t} at={a("todos creen que") + 0.2} x={960} y={520} dx={-320} dy={-200} text="“ESTÁ SEGURO”" col="#fff" out={a("te lo digo como cerrajero") - 0.1} size={58} />);
  if (t > 257 && t < 261.5) { const c = screenOf(t, [3.95, 1.27, -1.62]); L.push(<Tag key="nl2" t={t} at={a("no estan hechas para un ladron")} x={c.x} y={c.y} dx={-330} dy={-170} text="NO ES PARA UN LADRÓN" col={COL.red} out={261.2} size={52} />); }
  L.push(<BigNum key="nie" t={t} at={a("para que el nieto")} text="PARA QUE EL NIETO NO REVUELVA" size={64} x={1340} y={170} out={265.6} col="#fff" edge="#333" />);
  L.push(<Tag key="des" t={t} at={a("con un destornillador plano") + 0.2} x={980} y={560} dx={-330} dy={-230} text="UN DESTORNILLADOR" sub="Y UN GOLPE SECO" col={COL.amber} out={a("y se mete la mano") - 0.1} size={52} />);
  L.push(<BigNum key="caf" t={t} at={a("preparar un cafe")} text="☕ LO QUE TARDA UN CAFÉ" size={70} x={1300} y={190} out={279.0} col="#ffd60a" edge="#5a4500" />);
  L.push(<Stamp key="car" t={t} at={a("aqui hay algo que vale")} text="AQUÍ HAY ALGO QUE VALE" x={960} y={300} out={a("en el portalapices", 280) - 0.1} rot={-6} size={84} />);
  L.push(<Tag key="pl" t={t} at={a("en el portalapices", 280) + 0.2} x={980} y={560} dx={-330} dy={-220} text="EN EL PORTALÁPICES" col={COL.amber} out={a("colgada de un clavito") - 0.1} size={50} />);
  L.push(<Tag key="cv" t={t} at={a("colgada de un clavito") + 0.2} x={940} y={500} dx={330} dy={-200} text="EN UN CLAVITO AL LADO" col={COL.amber} out={a("la taza de los botones") - 0.1} size={50} />);
  L.push(<Tag key="tz" t={t} at={a("la taza de los botones") + 0.2} x={960} y={520} dx={-330} dy={-210} text="EN LA TAZA DE LOS BOTONES" col={COL.amber} out={298.4} size={48} />);
  L.push(<Tag key="et" t={t} at={304.3} x={980} y={560} dx={300} dy={-230} text="ETIQUETA: “ESCRITORIO”" sub="NO HACE FALTA NI FORZAR" col={COL.red} out={a("lo que yo hago", 305) - 0.1} size={48} />);
  L.push(<Chip key="b2" t={t} at={a("lo que yo hago", 305)} out={313.2} good />);
  if (t > 307 && t < 313.6) L.push(<Rows key="r2" t={t} out={313.2} y={330} items={[{ at: a("cosas que te molestaria"), tx: "LO QUE TE MOLESTARÍA PERDER", ok: true }, { at: a("no para cosas que no puedes"), tx: "LO QUE NO PUEDES REPONER", ok: false }]} />);
  L.push(<Tag key="or" t={t} at={318.5} x={980} y={580} dx={-330} dy={-240} text="LOS ORIGINALES" sub="VAN A OTRO LADO" col="#7dffb4" out={a("lugar numero 3") - 0.1} size={54} />);

  // ===== LUGAR 3 · la caja contra el fuego suelta =====
  L.push(<PlaceTitle key="t3" t={t} at={S.l3 + 0.1} out={330.2} n="3" name="LA CAJA CONTRA EL FUEGO, SUELTA" />);
  if (t > 324 && t < 330.6) { const bx = screenOf(t, PT.box); L.push(<Tag key="du" t={t} at={a("la que mas me duele")} x={bx.x} y={bx.y} dx={-330} dy={-200} text="LA COMPRA EL QUE SE PREOCUPA" col={COL.amber} out={330.2} size={46} />); }
  L.push(<Tag key="mj" t={t} at={a("preguntate para que")} x={960} y={420} dx={330} dy={-150} text="¿PARA QUÉ TIENE MANIJA?" col="#fff" out={a("la agarra de la manija") - 0.1} size={54} />);
  L.push(<Tag key="en" t={t} at={a("se la lleva entera")} x={960} y={520} dx={-330} dy={-220} text="SE LA LLEVA ENTERA" sub="SIN ABRIRLA" col={COL.red} out={345.6} size={56} />);
  if (t > 351 && t < 354) { const bx = screenOf(t, PT.box); L.push(<Tag key="sa" t={t} at={351.8} x={bx.x} y={bx.y} dx={-330} dy={-200} text="YA SABE QUÉ HAY ADENTRO" col="#fff" out={a("con una barreta") - 0.1} size={48} />); }
  if (t > 357 && t < 369) L.push(<Rows key="r3" t={t} out={a("y lo peor de esa caja") - 0.2} y={320} items={[{ at: a("confundir contra el fuego") + 0.3, tx: "CONTRA EL FUEGO", ok: true }, { at: a("con contra el robo"), tx: "CONTRA EL ROBO", ok: false }]} />);
  L.push(<BigNum key="jt" t={t} at={a("y lo peor de esa caja")} text="JUNTA TODO" size={100} x={560} y={200} out={381.6} col="#ff8a7a" edge="#4a0c08" />);
  if (t > 370 && t < 382) L.push(<DocList key="dl3" t={t} out={381.6} items={[{ at: a("la escritura", 370), tx: "LA ESCRITURA", ic: "🏠" }, { at: a("los pasaportes"), tx: "LOS PASAPORTES", ic: "🛂" }, { at: a("el testamento del marido"), tx: "EL TESTAMENTO", ic: "✒️" }, { at: a("las joyas de su mama"), tx: "LAS JOYAS", ic: "💍" }, { at: a("la llave de repuesto"), tx: "LA LLAVE DEL AUTO", ic: "🔑" }]} />);
  L.push(<Tag key="sv" t={t} at={388.2} x={960} y={560} dx={330} dy={-230} text="EN UN SOLO VIAJE" col={COL.red} out={a("atornillada al piso") - 0.1} size={56} />);
  L.push(<Chip key="b3" t={t} at={388.3} out={400.0} good />);
  L.push(<Tag key="at" t={t} at={a("atornillada al piso") + 0.2} x={960} y={600} dx={-330} dy={-250} text="ATORNILLADA, DESDE ADENTRO" sub="QUE NO SE VEA AL ABRIR" col="#7dffb4" out={400.0} size={48} />);
  L.push(<Tag key="bo" t={t} at={404.9} x={960} y={560} dx={330} dy={-230} text="BOLSA CON CIERRE" col="#7dffb4" out={a("lugar numero 4") - 0.1} size={54} />);

  // ===== LUGAR 4 · el congelador =====
  L.push(<PlaceTitle key="t4" t={t} at={S.l4 + 0.1} out={a("aqui hay un mito") + 1.2} n="4" name="EL CONGELADOR" />);
  L.push(<Stamp key="mi" t={t} at={a("un mito")} text="MITO" x={1450} y={330} out={417.6} rot={-12} size={150} />);
  if (t > 421 && t < 430) { const fz = screenOf(t, PT.freezer); L.push(<Tag key="fm" t={t} at={421.8} x={fz.x} y={fz.y} dx={330} dy={-150} text="EL ESCONDITE MÁS FAMOSO" col={COL.red} out={a("mete la mano entre") - 0.1} size={50} />); }
  L.push(<Tag key="ns" t={t} at={a("se nota en un segundo")} x={960} y={520} dx={-330} dy={-220} text="SE NOTA EN UN SEGUNDO" col="#fff" out={433.2} size={52} />);
  L.push(<Chip key="m4" t={t} at={437.9} out={a("cuando se corta la luz") - 0.1} text="“EL FRÍO PROTEGE”" />);
  L.push(<Tag key="ag" t={t} at={a("el agua entra en la bolsa")} x={960} y={600} dx={330} dy={-240} text="EL AGUA ENTRA EN LA BOLSA" col="#8fd6ff" out={448.8} size={50} />);
  L.push(<Tag key="cf" t={t} at={454.2} x={960} y={500} dx={330} dy={-200} text="UNA CAJA FUERTE VIEJA" sub="“LA ESCRITURA ESTÁ EN EL CONGELADOR”" col={COL.amber} out={a("estaba pegada al hielo") - 0.1} size={48} />);
  L.push(<Tag key="pa" t={t} at={a("se le partio en dos")} x={960} y={540} dx={-330} dy={-220} text="PARTIDA EN DOS" sub="EL SELLO CORRIDO" col={COL.red} out={466.4} size={56} />);
  L.push(<BigNum key="ms" t={t} at={a("le llevo meses")} text="MESES" sub="PARA UNA COPIA NUEVA" size={130} x={1400} y={220} out={a("los papeles quieren") - 0.1} col="#ff8a7a" edge="#4a0c08" />);
  if (t > 474 && t < 481) L.push(<Rows key="r4" t={t} out={480.6} y={250} items={[{ at: a("un lugar seco"), tx: "SECO", ok: false }, { at: a("fresco"), tx: "FRESCO", ok: false }, { at: a("y quieto"), tx: "QUIETO", ok: false }]} />);
  L.push(<Subscribe key="sub2" t={t} at={a("suscribete", 480)} out={a("el lugar que nadie piensa") - 0.2} />);

  // ===== LUGAR 5 · el auto + la pila de cartas =====
  L.push(<PlaceTitle key="t5" t={t} at={S.l5 + 0.1} out={a("con la direccion de tu casa", 500) - 0.2} n="5" name="LA GUANTERA DEL AUTO" />);
  L.push(<Tag key="dr" t={t} at={a("con la direccion de tu casa", 500)} x={960} y={560} dx={330} dy={-230} text="LA DIRECCIÓN DE TU CASA" col={COL.red} out={a("colgado del parasol") - 0.1} size={52} />);
  L.push(<Tag key="ct" t={t} at={a("colgado del parasol") + 0.2} x={960} y={420} dx={-330} dy={-150} text="EL CONTROL DEL PORTÓN" col={COL.red} out={a("el ladron rompe el vidrio") - 0.1} size={52} />);
  L.push(<BigNum key="ne" t={t} at={519.4} text="Y SABE QUE NO ESTÁS" sub="TU AUTO ESTÁ AHÍ" size={80} x={960} y={190} out={a("lo que hace casi todo el mundo", 524) - 0.1} col="#fff" edge="#333" />);
  L.push(<Chip key="m5" t={t} at={a("lo que hace casi todo el mundo", 524) + 0.1} out={529.8} />);
  if (t > 524 && t < 530) { const g = screenOf(t, PT.glove); L.push(<Tag key="tp" t={t} at={a("todos los papeles del auto")} x={g.x} y={g.y} dx={330} dy={-200} text="TODOS LOS PAPELES" col={COL.red} out={529.8} size={52} />); }
  L.push(<Chip key="b5" t={t} at={534.6} out={a("el control del porton no va") - 0.1} good />);
  if (t > 534 && t < 539.5) { const g = screenOf(t, PT.glove); L.push(<Tag key="ley" t={t} at={534.9} x={g.x} y={g.y} dx={330} dy={-200} text="SÓLO LO QUE PIDE LA LEY" sub="NADA CON TU DIRECCIÓN" col="#7dffb4" out={a("el control del porton no va") - 0.1} size={48} />); }
  L.push(<Tag key="lv5" t={t} at={a("va conmigo en el llavero")} x={960} y={540} dx={330} dy={-220} text="EN EL LLAVERO" col="#7dffb4" out={a("un ultimo lugar") - 0.1} size={56} />);
  // (la pila de cartas la dice el avatar: sin cartel encima de su ventana)
  L.push(<Tag key="ent" t={t} at={a("se tiran enteros") + 0.2} x={960} y={520} dx={-330} dy={-220} text="ENTEROS, SIN ROMPER" col={COL.red} out={a("o quedan apilados") - 0.1} size={52} />);
  if (t > 557 && t < 563.3) { const m = screenOf(t, PT.mail); L.push(<Tag key="vi" t={t} at={a("a la vista de cualquiera")} x={m.x} y={m.y} dx={330} dy={-200} text="A LA VISTA" col={COL.red} out={563.0} size={60} />); }

  // ===== repaso de los 5 (térmica) =====
  if (t > 563 && t < 580.5) L.push(<Route2 key="rt1" t={t} ats={[564.6, 565.4, 566.2, 567.0, 567.8]} out={a("y ahora te digo donde") + 1.5} good={a("y ahora te digo donde")} />);
  L.push(<BigNum key="es" t={t} at={a("esta semana los cambias")} text="ESTA SEMANA" sub="LOS CAMBIAS DE LUGAR" size={110} y={300} out={a("y ahora te digo donde") - 0.1} col="#ffd60a" edge="#5a4500" />);
  if (t > 577 && t < 580) { const mn = screenOf(t, PT.manuals); L.push(<GoodRing key="gr6" t={t} at={a("y ahora te digo donde") + 0.3} out={579.4} x={mn.x} y={mn.y} />); }

  // ===== NÚMERO 6 · dónde los guardo yo =====
  L.push(<PlaceTitle key="t6" t={t} at={S.n6 + 0.1} out={a("un papel se esconde") - 0.2} n="6" name="DÓNDE LOS GUARDO YO" good />);
  L.push(<Quote key="q6" t={t} at={a("un papel se esconde")} out={a("el ladron tiene pocos minutos") + 0.2} text="UN PAPEL SE ESCONDE ENTRE PAPELES" col="#bfffd9" y={330} size={100} />);
  L.push(<Stopwatch key="sw6" t={t} at={a("el ladron tiene pocos minutos") + 0.3} out={595.5} x={960} y={420} n={10} label="POCOS MINUTOS" />);
  if (t > 599 && t < 604) { const mn = screenOf(t, PT.manuals); L.push(<Tag key="man" t={t} at={600.0} x={mn.x} y={mn.y} dx={-330} dy={-180} text="PAPELES QUE NADIE QUIERE" sub="MANUALES VIEJOS · GARANTÍAS VENCIDAS" col="#7dffb4" out={a("una carpeta gorda") - 0.1} size={46} />); }
  L.push(<Tag key="gf" t={t} at={a("una carpeta gorda") + 0.2} x={960} y={500} dx={330} dy={-220} text="“MANUALES”" sub="GORDA Y FEA, A PROPÓSITO" col="#7dffb4" out={610.2} size={60} />);
  L.push(<BigNum key="40" t={t} at={a("40 manuales")} text="40 MANUALES" sub="UNO POR UNO" size={110} x={1400} y={210} out={a("ningun ladron se lleva") - 0.1} col="#bfffd9" edge="#0b3a22" />);
  if (t > 620 && t < 627.3) { const mn = screenOf(t, PT.manuals); L.push(<GoodRing key="gr7" t={t} at={a("ningun ladron se lleva") + 0.3} out={627.0} x={mn.x} y={mn.y} />); L.push(<Tag key="nl6" t={t} at={a("ningun ladron se lleva") + 0.6} x={mn.x} y={mn.y} dx={-380} dy={120} text="NADIE SE LA LLEVA" col="#7dffb4" out={627.0} size={52} />); }
  L.push(<Tag key="bl" t={t} at={631.9} x={960} y={560} dx={330} dy={-230} text="ALGO GRANDE Y PESADO ADELANTE" col={COL.amber} out={a("nadie se pone a mover") - 0.1} size={46} />);
  if (t > 637 && t < 642) { const sf = screenOf(t, PT.safe); L.push(<Tag key="sf" t={t} at={a("nadie se pone a mover") + 0.4} x={sf.x} y={sf.y} dx={-330} dy={-180} text="LA CAJA, ATORNILLADA" sub="NADIE LA MUEVE EN 10 MINUTOS" col="#7dffb4" out={a("adentro los papeles en una carpeta") - 0.1} size={46} />); }
  L.push(<Tag key="in" t={t} at={a("una hoja de indice")} x={960} y={520} dx={330} dy={-220} text="HOJA DE ÍNDICE + BOLSA" col="#7dffb4" out={643.7} size={52} />);
  L.push(<Tag key="al" t={t} at={649.3} x={960} y={500} dx={330} dy={-200} text="QUE LLEGUES TÚ" sub="SIN SILLA Y SIN AYUDA" col="#7dffb4" out={a("un lugar que te cuesta") - 0.1} size={56} />);
  L.push(<Quote key="q7" t={t} at={a("un lugar que te cuesta")} out={659.0} text="SI TE CUESTA ALCANZARLO, DEJAS DE REVISARLO" col="#fff" y={360} size={84} />);

  // ===== NÚMERO 7 · las tres copias =====
  L.push(<PlaceTitle key="t7" t={t} at={S.n7 + 0.1} out={662.5} n="7" name="LA REGLA DE LAS TRES COPIAS" good />);
  L.push(<BigNum key="ts" t={t} at={a("esta es la que de verdad")} text="LA QUE DE VERDAD TE SALVA" size={70} y={230} out={a("lo que hace casi todo el mundo", 664) - 0.1} col="#bfffd9" edge="#0b3a22" />);
  L.push(<Chip key="m7" t={t} at={a("lo que hace casi todo el mundo", 664) + 0.1} out={a("lo que yo hago es tener") - 0.1} text="UN SOLO JUEGO, EN UN SOLO LUGAR" />);
  L.push(<Stamp key="sp" t={t} at={a("se pierde todo")} text="SE PIERDE TODO" x={960} y={480} out={a("lo que yo hago es tener") - 0.1} size={110} />);
  if (t > 673 && t < 695) L.push(<Copies key="cp1" t={t} ats={[a("el original en la carpeta"), a("una foto nitida"), a("y una copia en un pendrive")]} out={694.6} y={t >= 675 && t < 679.5 || t >= 689.4 ? 600 : 560} />);
  L.push(<BigNum key="dm" t={t} at={694.9} text="EN DÍAS, NO EN MESES" size={96} y={300} out={a("y en el cajon del escritorio donde") - 0.1} col="#bfffd9" edge="#0b3a22" />);
  L.push(<Stamp key="snu" t={t} at={a("deja una carpeta que dice importante")} text="IMPORTANTE" x={1300} y={300} out={705.0} rot={-10} size={110} />);
  L.push(<Tag key="sn" t={t} at={a("y en el cajon del escritorio donde") + 0.3} x={960} y={600} dx={-330} dy={-240} text="LA CARPETA SEÑUELO" sub="FOTOCOPIAS VENCIDAS · CUENTAS PAGADAS" col={COL.amber} out={705.0} size={52} />);
  L.push(<BigNum key="bc" t={t} at={709.9} text="🤐 LA BOCA" size={120} y={300} out={a("ni al vecino") - 0.1} col="#fff" edge="#333" />);
  if (t > 715 && t < 722.6) L.push(<Rows key="r7" t={t} out={722.4} y={420} items={[{ at: a("ni al vecino") + 0.2, tx: "NI AL VECINO", ok: false }, { at: a("ni al que viene"), tx: "NI AL DEL CALEFÓN", ok: false }, { at: a("ni al que llama"), tx: "NI AL “DEL BANCO”", ok: false }]} />);
  L.push(<Tag key="hf" t={t} at={727.0} x={960} y={540} dx={330} dy={-220} text="UNA SOLA PERSONA" sub="UNA HOJA CON QUÉ HAY Y DÓNDE" col="#7dffb4" out={a("esa hoja tambien") - 0.1} size={52} />);
  if (t > 731 && t < 738) { const d = screenOf(t, PT.desk); L.push(<Tag key="ne7" t={t} at={a("esa hoja tambien") + 0.3} x={d.x} y={d.y} dx={-330} dy={-180} text="✗ NO EN EL ESCRITORIO" col={COL.red} out={737.7} size={52} />); }
  L.push(<Stopwatch key="sw7" t={t} at={a("el de 10 minutos")} out={a("en manos de tu escribano") - 0.2} x={480} y={330} n={10} label="EL APURADO" />);
  L.push(<Tag key="cs7" t={t} at={a("se vaya con la carpeta")} x={1150} y={560} dx={300} dy={-220} text="SE VA CON LAS FOTOCOPIAS" col="#fff" out={a("en manos de tu escribano") - 0.2} size={48} />);
  L.push(<Tag key="esc" t={t} at={a("en manos de tu escribano") + 0.2} x={960} y={560} dx={330} dy={-230} text="TU ESCRIBANO" col="#7dffb4" out={755.8} size={56} />);
  L.push(<Tag key="bco" t={t} at={760.9} x={960} y={540} dx={-330} dy={-230} text="CAJA DE SEGURIDAD DEL BANCO" sub="CON UNA COPIA EN CASA" col="#7dffb4" out={a("te lo repito rapido") - 0.1} size={46} />);

  // ===== repaso final =====
  if (t > 767 && t < 793.4) L.push(<Route2 key="rt2" t={t} ats={[a("el primer cajon del escritorio", 768), a("el cajon con llavecita", 768), a("la caja contra el fuego suelta"), a("el congelador", 775), a("y la guantera del auto", 775)]} out={793.0} good={a("donde los guardo yo", 780)} />);
  if (t > 783 && t < 789) { const mn = screenOf(t, PT.manuals), sf = screenOf(t, PT.safe); L.push(<GoodRing key="gr8" t={t} at={a("donde los guardo yo", 780) + 0.4} out={788.5} x={mn.x} y={mn.y} />); L.push(<GoodRing key="gr9" t={t} at={a("donde los guardo yo", 780) + 1.6} out={788.5} x={sf.x} y={sf.y} />); }
  if (t > 791 && t < 802.4) L.push(<Copies key="cp2" t={t} ats={[a("la regla de las tres copias", 790) + 0.3, a("la foto en el celular", 790), a("y una copia en casa", 790)]} out={a("y ahora te pregunto") - 0.2} y={300} />);
  L.push(<Tag key="sn2" t={t} at={a("la carpeta senuelo", 795)} x={960} y={860} dx={330} dy={-60} text="+ LA CARPETA SEÑUELO" col={COL.amber} out={a("y ahora te pregunto") - 0.2} size={48} />);
  L.push(<Comment key="cm" t={t} at={a("y ahora te pregunto")} out={a("todo esto lo escribi") - 0.2} reply={810.4} />);

  // ===== CTA final: la guía y sus páginas reales =====
  L.push(<Fan key="fan" t={t} at={a("todo esto lo escribi")} out={821.0} lift={a("el metodo del cerrajero", 815)} />);
  L.push(<Page key="p61" t={t} at={826.6} out={a("en la pagina 62") + 0.1} n={61} hl="LA CARPETA DE LOS PAPELES QUE NO SE REEMPLAZAN" />);
  L.push(<Page key="p62" t={t} at={a("en la pagina 62") + 0.1} out={836.7} n={62} hl="LAS FOTOS DE CADA PAPEL, PARA QUE SIRVAN" />);
  L.push(<BigNum key="ut" t={t} at={841.5} text="ESTO SE HACE EN UNA TARDE" size={80} y={250} out={a("el enlace esta en la primera") - 0.1} col="#ffd60a" edge="#5a4500" />);
  L.push(<Desc key="dsc" t={t} at={a("el enlace esta en la primera")} out={a("en el proximo te muestro") - 0.2} />);
  L.push(<Tag key="nx" t={t} at={a("en el proximo te muestro") + 0.3} x={960} y={560} dx={330} dy={-230} text="EN EL PRÓXIMO VIDEO" sub="QUE NO SE LA LLEVE NADIE" col={COL.amber} out={852.6} size={54} />);
  L.push(<Quote key="qf" t={t} at={a("y no se lo cuentes")} out={END} text="Y NO SE LO CUENTES A NADIE" col="#fff" y={330} size={100} />);
  L.push(<Stamp key="nam" t={t} at={a("ni a mi", 858)} text="NI A MÍ" x={960} y={620} out={END} rot={-8} size={120} />);
  const fade = e(t, END - 0.7, END);
  if (fade > 0) L.push(<AbsoluteFill key="fd" style={{ background: "#000", opacity: fade }} />);

  return <AbsoluteFill style={{ background: "#05070d" }}>{L}</AbsoluteFill>;
};
