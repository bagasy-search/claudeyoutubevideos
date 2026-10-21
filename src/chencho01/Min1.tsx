// chencho01 · MINUTO 1 (0-147,9 s). UNA sola toma: la calle empedrada del pueblo de Chencho es el mundo; todo entra y sale
// de ahí sin cortes secos: avatar → portal a la calle → "piedra por piedra" (la luz recorre el empedrado) → el CUADERNO DE CUENTAS
// en la banqueta se escribe solo → avatar "$3,000" → grúa sobre los techos → la ciudad se come el color (renta, refri, jitomate,
// camión, la cuenta que no sale) → combi de regreso con mapa vectorial → el portón → las barras de la pensión → avatar
// → el cuaderno renglón por renglón → avatar "sin redondear" → el medidor de luz → LO MALO → avatar Chencho → Chayo, la fábrica
// → vista aérea del pueblo con el pin → avatar → el portón de mezquite (capas de pintura) → CIERRE sin avatar (veto 21-oct):
// "suscríbase" en lámina → la campana del campanario suena → la plaza: "aquí $22, ¿y allá?" → la caja de comentario → vuelo.
// Todo clavado a la voz con at("frase"). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, NB, screenOf, camSpeed, setKeys, win } from "./pueblo3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, DrawX, Flash, FONT, HAND, LowerThird, P, Portal, SERIF, Tag, at, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
export const MIN1_END = 147.86;
export const MIN1_FRAMES = s(MIN1_END);
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < MIN1_END - 0.1);
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);
const av = (i: number) => AVS[i];

// ---------------- tiempos clavados a la voz ----------------
const T = {
  calle: at("mira nomas esta calle"), piedra: at("piedra por piedra"), fijate: at("fijate en esto"), cuaderno: at("mi cuaderno de cuentas"),
  peso: at("peso por peso"), estemes: at("y este mes"), tresmil: at("pesos", 17), mejor: at("como mejor que"), ciudad: at("vivia en la ciudad"),
  imagina: at("imaginate esto"), dia30: at("es dia 30"), depa: at("tu departamento"), renta: at("recibo de la renta"), renta$: at("pesos", 29.5),
  refri: at("abres el refri"), vacio: at("casi vacio"), faltan: at("faltan cuatro dias"), jitomate: at("jitomate que compraste"), aguado: at("se puso aguado"),
  sales: at("sales a la calle"), camion: at("va lleno"), hora: at("hora y media"), cuenta: at("haces la cuenta"), nosale: at("no te sale"), nunca: at("nunca te sale"),
  sigo: at("para que sigo aqui"), regrese: at("me regrese"), michoacan: at("en michoacan"), casa: at("la casa de mis papas"), pension: at("la pension que"),
  noalc: at("no me alcanzaba"), sobra: at("aqui me sobra"), cuestan: at("cuestan lo que"), abrir: at("abrir mi cuaderno"), renglon: at("renglon por renglon"),
  i_tia: at("en el tianguis", 66), i_tor: at("de tortillas"), i_gas: at("de gas"), i_luz: at("de luz", 70), i_agua: at("de agua", 70), i_combi: at("la combi", 70),
  i_tienda: at("la tiendita", 70), i_salud: at("la salud", 70), i_gusto: at("gustito"), redondear: at("sin redondear"), luz: at("el recibo de la", 84),
  coraje: at("coraje"), salud: at("gasto en salud"), aguantate: at("aguantate"), malo: at("lo malo", 90), rosa: at("color de rosa"),
  cres: at("crescencio"), anos69: at("tengo 69"), hermano: at("hermano de"), cocina: at("la de la cocina"), fabrica: at("en una fabrica"), gdl: at("en guadalajara", 108),
  pueblito: at("este pueblito"), patz: at("cerca de patzcuaro"), adobe: at("la casa es de adobe"), porton: at("el mismo porton"), verde: at("de verde cada"),
  rapidito: at("y rapidito", 120), vidap: at("esta vida de pueblo", 120), suscr: at("suscribase", 120), campana: at("la campanita", 120), cmes: at("de cada mes", 120),
  pregunta: at("una pregunta", 120), tortilla: at("el kilo de tortilla", 120), alla: at("alla donde", 120), escribe: at("escribamelo", 120), leo: at("los leo todos", 120),
  vamos: at("vamos a las cuentas", 120),
};

// ---------------- cámara del minuto 1 (una sola; las entradas/salidas son portales, barridos y fotos que cubren) ----------------
const BELL: [number, number, number] = [4.2, 13.3, -59.5]; // la campana del campanario
setKeys([
  { t: 0, p: [0.7, 1.62, 9.8], l: [-0.6, 1.9, -30], fov: 44 },
  { t: 4.5, p: [0.55, 1.55, 9.0], l: [-0.6, 1.8, -30], fov: 44 },
  { t: 7.0, p: [0.25, 0.62, 5.3], l: [-1.1, 0.22, -4], fov: 40 },               // vuelo bajo sobre el empedrado
  { t: 9.2, p: [-2.6, 0.98, 4.7], l: NB, fov: 34, arc: 0.25 },                  // gira a la banqueta: el cuaderno
  { t: 11.3, p: [-3.3, 0.6, 3.66], l: [NB[0], NB[1], NB[2] - 0.01], fov: 30 },
  { t: 14.6, p: [-3.35, 0.54, 3.58], l: [NB[0], NB[1], NB[2] - 0.01], fov: 29 },
  { t: 18.64, p: [-3.2, 0.78, 3.8], l: NB, fov: 30 },                          // (sale del avatar) y la grúa sube sobre los techos
  { t: 22.7, p: [1.3, 5.7, 11.2], l: [0, 2.2, -40], fov: 44, arc: 0.8 },
  { t: 23.4, p: [1.25, 5.75, 11.0], l: [0, 2.2, -40], fov: 44 },
  { t: 56.2, p: [0.7, 1.55, 4.8], l: [-4.3, 1.4, 1.8], fov: 40 },               // (detrás de la combi) llega a la casa de sus papás
  { t: 58.4, p: [0.95, 1.72, 6.4], l: [-3.2, 1.25, 2.4], fov: 42 },
  { t: 62.1, p: [1.05, 1.76, 6.7], l: [-3.2, 1.25, 2.4], fov: 42 },
  { t: 66.62, p: [-2.85, 0.92, 4.35], l: NB, fov: 33 },                        // (sale del avatar) el cuaderno se abre
  { t: 69.4, p: [-3.3, 0.6, 3.66], l: [NB[0], NB[1], NB[2] - 0.01], fov: 30 },
  { t: 80.2, p: [-3.35, 0.54, 3.58], l: [NB[0], NB[1], NB[2] - 0.01], fov: 29 },
  { t: 84.83, p: [-2.1, 1.62, 4.7], l: PT.recibo, fov: 34 },                   // el medidor de luz en la fachada
  { t: 88.6, p: [-2.45, 1.68, 4.25], l: PT.recibo, fov: 31 },
  { t: 91.4, p: [0.6, 1.72, 8.2], l: [-0.6, 1.85, -30], fov: 42, arc: 0.3 },   // sale a la calle: lo malo
  { t: 96.9, p: [0.35, 1.8, 5.0], l: [-0.6, 2.0, -30], fov: 42 },
  { t: 112.6, p: [7.5, 15.5, 14], l: [0, 0, -24], fov: 44 },                    // (detrás de la fábrica) vista aérea del pueblito
  { t: 114.35, p: [6.4, 14.2, 11.5], l: [0, 0, -24], fov: 44 },
  { t: 119.15, p: [-0.3, 1.45, 3.4], l: [-4.3, 1.3, 1.8], fov: 40 },            // (sale del avatar) el portón verde
  { t: 121.6, p: [-1.55, 1.42, 2.25], l: [-4.3, 1.3, 1.8], fov: 37 },
  { t: 123.7, p: [-0.4, 1.6, 4.4], l: [-2.6, 1.45, 1.4], fov: 40 },             // se aleja del portón a la calle
  { t: 126.4, p: [0.6, 1.75, 6.6], l: [0.8, 4.0, -40], fov: 44, arc: 0.2 },     // "esta vida de pueblo": la calle hasta la iglesia
  { t: 128.0, p: [0.7, 1.9, 5.6], l: [1.2, 5.0, -40], fov: 43 },
  { t: 129.1, p: [1.6, 8.5, -22], l: [3.6, 11.5, -55], fov: 40, arc: 1.2 },    // sube sobre los techos (sin rozarlos)
  { t: 130.0, p: [3.0, 12.6, -50.5], l: BELL, fov: 34 },              // vuela al campanario: la campanita
  { t: 133.2, p: [3.4, 13.3, -54.6], l: BELL, fov: 30 },
  { t: 134.6, p: [3.2, 8.4, -29.5], l: [1.4, 7.0, -56], fov: 40 },             // se aleja del campanario: la iglesia entera desde la plaza
  { t: 135.6, p: [2.4, 4.6, -31.5], l: [0, 1.0, -40], fov: 40 },      // baja a la plaza: el tianguis
  { t: 138.4, p: [0.9, 2.1, -34.6], l: [0, 1.0, -40], fov: 36 },
  { t: 144.3, p: [0.6, 1.9, -36.0], l: [0, 0.95, -40], fov: 34 },
  { t: 146.2, p: [1.4, 6.8, -25], l: [0, 1.2, -42], fov: 46, arc: 0.6 },        // "vamos a las cuentas": sube sobre la plaza
  { t: 147.86, p: [0.4, 5.2, -21], l: [0, 1.4, -42], fov: 44 },                 // y baja a la plaza: el tianguis
]);

// ---------------- estado del mundo por segundo ----------------
const ITEMS = [T.i_tia, T.i_tor, T.i_gas, T.i_luz, T.i_agua, T.i_combi, T.i_tienda, T.i_salud, T.i_gusto];
const worldAt = (t: number): WorldProps => {
  const hook = t < 30;
  const rowsHook = 11 * ei(t, T.peso, T.peso + 2.2);
  const rowsPromise = ITEMS.reduce((a, x) => a + win(t, x, x + 0.45), 0) + 2 * win(t, T.i_gusto + 0.3, T.i_gusto + 1.0);
  return {
    t,
    stones: t > 4.4 && t < 7.6 ? Math.min(0.999, Math.max(0.001, (t - 4.5) / 3.0)) : 0,
    nbOpen: hook ? 1 : 0.15 + 0.85 * ei(t, 66.7, 68.0),
    nbRows: hook ? rowsHook : rowsPromise,
    nbTotal: hook ? win(t, T.estemes - 0.2, T.estemes + 0.4) : 0,
    nbHide: 1,
    nbTitle: "Octubre",
    porton: win(t, 121.7, 123.5),
    books: 0,
    bell: t > T.campana - 0.1 ? 0.5 * Math.sin((t - T.campana + 0.1) * Math.PI * 1.3) * Math.exp(-Math.max(0, t - T.campana - 2.5) * 0.6) : 0,
    tianguis: 1,
    dusk: 0,
  };
};

const World: React.FC<{ t: number; over?: Partial<WorldProps>; gray?: number }> = ({ t, over, gray = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  const mb = v.bx + v.by > 0.6 ? `url(#${id})` : "";
  const g = gray > 0.01 ? `grayscale(${gray}) brightness(${1 - 0.25 * gray})` : "";
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: (mb + " " + g).trim() || undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- avatar (preroll de 10 cuadros por ventana) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// ---------------- toma real (clip LTX si ya llegó, si no la foto con empuje lento) ----------------
export const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number; rate?: number }> = ({ k, t, a, z = [1.03, 1.1], ox = 0, oy = 0, dur = 7, rate = 1 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
// deslizamiento lateral entre dos tomas con desenfoque de movimiento (cámara que barre)
export const Slide: React.FC<{ t: number; a: number; d?: number; A: React.ReactNode; B: React.ReactNode }> = ({ t, a, d = 0.5, A, B }) => {
  const sl = ei(t, a, a + d), mb = Math.sin(sl * Math.PI) * 34, f = mb > 1 ? `blur(${mb}px)` : undefined;
  return <>{sl < 1 && <AbsoluteFill style={{ transform: `translateX(${-sl * 1920}px)`, filter: f }}>{A}</AbsoluteFill>}
    {sl > 0 && <AbsoluteFill style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: f }}>{B}</AbsoluteFill>}</>;
};

// ================= PIEZAS NUEVAS del minuto 1 (todas a medida de Chencho) =================
export const oo = (t: number, a: number, out: number, fi = 0.12, fo = 0.3) => e(t, a, a + fi) * (1 - e(t, out, out + fo));

// monedas que caen sobre el cuaderno, una por renglón ("peso por peso")
const Monedas: React.FC<{ t: number; a: number; out: number; x: number; y: number; n?: number }> = ({ t, a, out, x, y, n = 9 }) => {
  const o = oo(t, a, out); if (o <= 0.01) return null;
  return <>{Array.from({ length: n }, (_, i) => {
    const t0 = a + i * 0.2, k = Math.min(1, Math.max(0, (t - t0) / 0.45)); if (k <= 0) return null;
    const bounce = k < 1 ? 1 - Math.pow(1 - k, 2) : 1 + 0.06 * Math.sin((t - t0 - 0.45) * 18) * Math.exp(-(t - t0) * 4);
    const xx = x + ((i * 97) % 300) - 150, yy = y - 520 * (1 - bounce) + (i % 3) * 14;
    return <div key={i} style={{ position: "absolute", left: xx, top: yy, opacity: o, transform: `translate(-50%,-50%) rotateX(${60 * (1 - k)}deg) rotate(${i * 37}deg)` }}>
      <div style={{ width: 92, height: 92, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff1b8, #e0b23c 45%, #9a6a12 100%)", boxShadow: "0 14px 22px rgba(0,0,0,.45), inset 0 0 0 6px rgba(120,80,10,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: "#6a4508" }}>$1</div>
    </div>;
  })}</>;
};

// sello de goma entintado (con textura de tinta irregular), distinto en cada uso
export const Sello: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string; sub?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -7, size = 110, col = "#c8321e", sub }) => {
  const k = spr(t, at, 1.4), o = oo(t, at, out, 0.05, 0.25); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * Math.min(1, k)})` }}>
    <div style={{ position: "relative", border: `9px double ${col}`, borderRadius: 10, padding: "6px 36px 8px", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 5, whiteSpace: "nowrap", lineHeight: 1.05, textAlign: "center",
      WebkitMaskImage: "repeating-radial-gradient(circle at 30% 40%, #000 0 7px, rgba(0,0,0,.72) 8px 10px)", background: "rgba(255,240,220,.06)" }}>
      {text}{sub && <div style={{ fontSize: size * 0.32, letterSpacing: 8 }}>{sub}</div>}
    </div>
  </div>;
};

// la ciudad se come el color: el pueblo pierde el color y una losa de concreto barre en diagonal
export const GrisWipe: React.FC<{ t: number; a: number; A: React.ReactNode; B: React.ReactNode }> = ({ t, a, A, B }) => {
  const k = ei(t, a + 0.25, a + 0.95), g = e(t, a - 0.2, a + 0.4);
  const p = -40 + 180 * k; // borde diagonal (en % del ancho)
  return <>
    {k < 1 && <AbsoluteFill style={{ filter: `grayscale(${g}) brightness(${1 - 0.3 * g})` }}>{A}</AbsoluteFill>}
    {k > 0 && <AbsoluteFill style={{ clipPath: `polygon(0 0, ${p}% 0, ${p - 30}% 100%, 0 100%)` }}>{B}</AbsoluteFill>}
    {k > 0 && k < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", clipPath: `polygon(${p}% 0, ${p + 3}% 0, ${p - 27}% 100%, ${p - 30}% 100%)`, background: "linear-gradient(90deg,#6d7175,#b9bcbf,#6d7175)" }} />}
  </>;
};
// y vuelve el color: la ciudad se despega como un cartel viejo y aparece el campo
export const ColorBack: React.FC<{ t: number; a: number; A: React.ReactNode; B: React.ReactNode }> = ({ t, a, A, B }) => {
  const k = ei(t, a, a + 0.8), R = k * 2300;
  return <>{k < 1 && <AbsoluteFill style={{ filter: `grayscale(${0.5 + 0.5 * k})` }}>{A}</AbsoluteFill>}
    {k > 0 && <AbsoluteFill style={{ clipPath: `circle(${R}px at 1600px 300px)`, filter: `saturate(${0.6 + 0.4 * k})` }}>{B}</AbsoluteFill>}</>;
};

// calendario de pared de hojas que se arrancan hasta el 30
const Calendario: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at - 0.6, out); if (o <= 0.01) return null;
  const days = [27, 28, 29, 30];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(3deg) scale(${0.85 + 0.15 * Math.min(1, spr(t, at - 0.6, 1))})`, perspective: 900 }}>
    <div style={{ position: "relative", width: 330, height: 380 }}>
      <div style={{ position: "absolute", inset: 0, background: "#f4f1ea", borderRadius: 12, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 90, background: "#b3261e", borderRadius: "12px 12px 0 0", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>OCTUBRE</div>
      {days.map((d, i) => {
        const tear = i < 3 ? ei(t, at - 0.55 + i * 0.17, at - 0.38 + i * 0.17) : 0;
        if (tear >= 1) return null;
        return <div key={d} style={{ position: "absolute", left: 0, top: 90, width: 330, height: 290, background: "#fbfaf6", borderRadius: "0 0 12px 12px", transformOrigin: "50% 0", transform: `rotateX(${tear * 110}deg) translateY(${tear * 40}px)`, zIndex: 10 - i, opacity: 1 - tear * 0.6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: d === 30 ? "#b3261e" : "#2a2a2a" }}>{d}</div>;
      })}
    </div>
  </div>;
};

// el recibo de la renta que sube de abajo, con el monto y el sello VENCE HOY
const ReciboRenta: React.FC<{ t: number; at: number; amtAt: number; out: number; x: number; y: number }> = ({ t, at, amtAt, out, x, y }) => {
  const k = Math.min(1.05, spr(t, at, 0.9)), o = oo(t, at, out); if (o <= 0.01) return null;
  const n = Math.round(6500 * e(t, amtAt - 0.4, amtAt + 0.3));
  return <div style={{ position: "absolute", left: x, top: y + (1 - Math.min(1, k)) * 700, opacity: o, transform: `translate(-50%,-50%) rotate(-4deg)` }}>
    <div style={{ width: 520, padding: "34px 40px 40px", background: "linear-gradient(180deg,#fdfcf8,#ecebe4)", boxShadow: "0 40px 70px rgba(0,0,0,.6)", fontFamily: FONT, color: "#333", clipPath: "polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)" }}>
      <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 6 }}>RECIBO DE RENTA</div>
      <div style={{ height: 3, background: "#999", margin: "14px 0 18px" }} />
      {["Depto. 4-B", "Periodo: octubre", "Mantenimiento incluido: no"].map((r) => <div key={r} style={{ fontWeight: 600, fontSize: 28, color: "#666", marginBottom: 6 }}>{r}</div>)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 20 }}>
        <span style={{ fontWeight: 800, fontSize: 34 }}>TOTAL</span>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#1c1c1c" }}>${n.toLocaleString("en-US")}</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 70 }}><Sello t={t} at={amtAt + 0.45} text="VENCE HOY" x={0} y={0} size={56} rot={-14} /></div>
  </div>;
};

// polaroid que entra girando a un costado (lo que cuenta mientras habla)
export const Polaroid: React.FC<{ t: number; at: number; out: number; img: string; x: number; y: number; cap: string; rot?: number; w?: number }> = ({ t, at, out, img, x, y, cap, rot = 5, w = 520 }) => {
  const k = Math.min(1.08, spr(t, at, 0.9)), o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateX(${(1 - Math.min(1, k)) * 600}px) rotate(${rot + (1 - Math.min(1, k)) * 25}deg)` }}>
    <div style={{ width: w, padding: "22px 22px 90px", background: "#faf8f2", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
      <div style={{ width: w - 44, height: (w - 44) * 0.75, overflow: "hidden" }}><Img src={staticFile(P + img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.05 * e(t, at, at + 5)})` }} /></div>
      <div style={{ position: "absolute", left: 0, bottom: 18, width: "100%", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#2b2b4a" }}>{cap}</div>
    </div>
  </div>;
};

// la quincena: 4 casillas que se tachan al revés (faltan 4 días)
const Quincena: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1, spr(t, at, 1))})` }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: 6, textAlign: "center", textShadow: extrude(4, "#000") }}>LA QUINCENA</div>
    <div style={{ display: "flex", gap: 16, marginTop: 14 }}>{[1, 2, 3, 4].map((i) => {
      const p = e(t, at + 0.3 + i * 0.16, at + 0.5 + i * 0.16);
      return <div key={i} style={{ width: 110, height: 120, borderRadius: 12, background: "rgba(20,24,30,.85)", border: "3px solid #cfd3d8", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - p) * 40}px)`, opacity: p, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#e8eaec" }}>{5 - i}</div>;
    })}<div style={{ width: 120, height: 120, borderRadius: 12, background: "#2f7d3a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff" }}>$</div></div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#ff5a4a", textAlign: "center", marginTop: 14, letterSpacing: 3, opacity: e(t, at + 1.0, at + 1.2), textShadow: extrude(4, "#300") }}>FALTAN 4 DÍAS</div>
  </div>;
};

// la etiqueta del súper pegada sobre el jitomate aguado (precio de ciudad)
const EtiquetaSuper: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = spr(t, at, 1.2), o = oo(t, at, out, 0.05); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-9deg) scale(${1.8 - 0.8 * Math.min(1, k)})` }}>
    <div style={{ padding: "18px 34px", background: "#ffe23a", borderRadius: 14, boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900, color: "#1a1a1a", textAlign: "center" }}>
      <div style={{ fontSize: 30, letterSpacing: 4 }}>JITOMATE BOLA</div>
      <div style={{ fontSize: 96, lineHeight: 1 }}>$46<span style={{ fontSize: 44 }}>.90 /kg</span></div>
    </div>
  </div>;
};
const Aguado: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out, 0.1); if (o <= 0.01) return null;
  const sag = e(t, at, at + 0.9); // las letras se "aguadan": se derriten hacia abajo
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex" }}>{"AGUADO".split("").map((c, i) =>
    <span key={i} style={{ display: "inline-block", fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#e9ddc6", textShadow: extrude(6, "#3a2a1a"), transformOrigin: "50% 100%", transform: `scaleY(${1 - 0.28 * sag * (0.5 + 0.5 * Math.sin(i * 1.7))}) scaleX(${1 + 0.12 * sag}) translateY(${sag * (10 + i * 4)}px) rotate(${sag * (i % 2 ? 4 : -3)}deg)` }}>{c}</span>)}</div>;
};

// trayecto: barra de ruta con el camión que avanza a vuelta de rueda y el reloj que corre hasta 1 h 30
const Trayecto: React.FC<{ t: number; at: number; out: number; y: number }> = ({ t, at, out, y }) => {
  const o = oo(t, at - 0.8, out); if (o <= 0.01) return null;
  const p = e(t, at - 0.8, at + 1.4), mins = Math.round(90 * p), stops = [0.18, 0.36, 0.52, 0.71, 0.88];
  return <div style={{ position: "absolute", left: 160, top: y, width: 1600, opacity: o }}>
    <div style={{ position: "relative", height: 16, borderRadius: 8, background: "rgba(255,255,255,.25)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 16, width: `${p * 100}%`, borderRadius: 8, background: "#ff5a4a" }} />
      {stops.map((sx) => <div key={sx} style={{ position: "absolute", left: `${sx * 100}%`, top: -8, width: 32, height: 32, borderRadius: "50%", background: p > sx ? "#ff5a4a" : "#ddd", border: "5px solid #222", transform: "translateX(-50%)" }} />)}
      <div style={{ position: "absolute", left: `${p * 100}%`, top: -96, transform: `translateX(-50%) translateY(${Math.sin(t * 14) * 2}px)` }}>
        <svg width={150} height={80} viewBox="0 0 150 80"><rect x={4} y={6} width={142} height={56} rx={12} fill="#f2f2f2" stroke="#222" strokeWidth={5} />{[0, 1, 2, 3].map((i) => <rect key={i} x={14 + i * 32} y={16} width={24} height={20} rx={3} fill="#5b7d9a" />)}<circle cx={34} cy={66} r={11} fill="#222" /><circle cx={118} cy={66} r={11} fill="#222" /></svg>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 26, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: "#fff", textShadow: extrude(7, "#2a0a06") }}>{Math.floor(mins / 60)} h {String(mins % 60).padStart(2, "0")}<span style={{ fontSize: 50, alignSelf: "flex-end", marginLeft: 14, marginBottom: 20 }}>min</span></div>
  </div>;
};

// la cuenta que no sale: una suma escrita a gis que se emborrona y se tacha en rojo
const CuentaRoja: React.FC<{ t: number; at: number; noAt: number; out: number; x: number; y: number }> = ({ t, at, noAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const rows = [["renta", "6,500"], ["camión", "1,200"], ["súper", "4,000"], ["luz, gas, agua", "1,500"]];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%) rotate(-2deg)", fontFamily: HAND, fontWeight: 700, color: "#f3f0e8" }}>
    {rows.map(([a, b], i) => { const w = e(t, at + i * 0.35, at + i * 0.35 + 0.5); return <div key={a} style={{ display: "flex", justifyContent: "space-between", width: 720, fontSize: 72, clipPath: `inset(0 ${100 - 100 * w}% 0 0)`, textShadow: "0 4px 16px rgba(0,0,0,.8)" }}><span>{a}</span><span>{b}</span></div>; })}
    <div style={{ height: 6, background: "#f3f0e8", width: 720 * e(t, at + 1.5, at + 1.8), marginTop: 6 }} />
    <div style={{ display: "flex", justifyContent: "space-between", width: 720, fontSize: 84, opacity: e(t, at + 1.7, at + 1.9) }}><span>= ¿ ?</span><span style={{ filter: `blur(${4 * e(t, noAt, noAt + 0.6)}px)` }}>13,200</span></div>
    <div style={{ position: "absolute", left: -60, top: -40 }}><DrawX t={t} at={noAt + 0.2} x={0} y={0} w={840} h={500} /></div>
  </div>;
};

// letra a mano que se escribe sola (lo que piensa)
export const Pensado: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string; rot?: number }> = ({ t, at, out, x, y, text, size = 96, col = "#fff8e6", rot = -4 }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, at, at + 1.1); if (w <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)`, textShadow: "0 6px 20px rgba(0,0,0,.8)" }}>{text}</div>;
};

// mapa VECTORIAL: Jalisco → Michoacán, la ruta se dibuja de Guadalajara al pueblito junto a Pátzcuaro
const MapaRuta: React.FC<{ t: number; at: number; mAt: number; out: number }> = ({ t, at, mAt, out }) => {
  const o = oo(t, at, out, 0.3); if (o <= 0.01) return null;
  const d = e(t, at + 0.2, at + 2.2), route = "M 520 330 C 640 420, 760 470, 880 560 S 1080 690, 1220 720";
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(18,28,22,.35), rgba(8,12,10,.72))" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 300 160 L 760 140 L 900 300 L 860 470 L 640 540 L 420 520 L 280 380 Z" fill="rgba(240,230,200,.10)" stroke="rgba(240,230,200,.55)" strokeWidth={3} strokeDasharray="10 8" />
      <path d="M 860 470 L 1180 430 L 1480 520 L 1560 760 L 1320 900 L 980 880 L 760 720 L 640 540 Z" fill={`rgba(107,138,58,${0.18 + 0.25 * e(t, mAt, mAt + 0.5)})`} stroke="#d9e8b0" strokeWidth={4} />
      <text x={470} y={240} fontFamily={FONT} fontWeight={900} fontSize={40} fill="rgba(240,230,200,.75)" letterSpacing={8}>JALISCO</text>
      <text x={1150} y={830} fontFamily={FONT} fontWeight={900} fontSize={54} fill="#e9f5c8" letterSpacing={10} opacity={e(t, mAt, mAt + 0.4)}>MICHOACÁN</text>
      <ellipse cx={1290} cy={700} rx={70} ry={26} fill="#6fa3c7" opacity={0.85} />
      <path d={route} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={16} strokeLinecap="round" strokeDasharray="1100" strokeDashoffset={1100 * (1 - d)} />
      <path d={route} fill="none" stroke={CH.maiz} strokeWidth={10} strokeLinecap="round" strokeDasharray="1100" strokeDashoffset={1100 * (1 - d)} />
      <circle cx={520} cy={330} r={16} fill="#fff" /><text x={420} y={300} fontFamily={FONT} fontWeight={800} fontSize={36} fill="#fff">Guadalajara</text>
      <g opacity={e(t, at + 2.0, at + 2.3)} transform={`translate(1220 720) scale(${Math.min(1.1, spr(t, at + 2.0, 1.2))})`}>
        <path d="M 0 0 C -30 -40, -38 -60, -38 -80 A 38 38 0 1 1 38 -80 C 38 -60, 30 -40, 0 0 Z" fill={CH.guinda} stroke="#fff" strokeWidth={5} /><circle cx={0} cy={-80} r={14} fill="#fff" />
      </g>
      <text x={1250} y={650} fontFamily={HAND} fontWeight={700} fontSize={58} fill="#fff" opacity={e(t, at + 2.2, at + 2.5)}>mi pueblo</text>
      <text x={1310} y={760} fontFamily={FONT} fontWeight={700} fontSize={26} fill="#cfe3f0" opacity={0.9}>Pátzcuaro</text>
    </svg>
  </AbsoluteFill>;
};

// barras: lo que cuesta vivir en la ciudad vs en el pueblo, contra la línea de la pensión
const Barras: React.FC<{ t: number; at: number; noAt: number; sobraAt: number; out: number }> = ({ t, at, noAt, sobraAt, out }) => {
  const o = oo(t, at, out, 0.2); if (o <= 0.01) return null;
  const base = 860, scale = 0.042, pen = 5200;
  const hc = 13200 * scale * ei(t, at + 0.3, noAt + 0.3), hp = 2950 * scale * ei(t, sobraAt - 0.5, sobraAt + 0.2);
  const yPen = base - pen * scale;
  const bar = (x: number, h: number, col: string, lab: string, val: string, vo: number) => <g>
    <rect x={x} y={base - h} width={220} height={h} rx={10} fill={col} />
    <rect x={x} y={base - h} width={220} height={Math.min(h, 14)} rx={6} fill="rgba(255,255,255,.35)" />
    <text x={x + 110} y={base + 60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#fff" letterSpacing={4}>{lab}</text>
    <text x={x + 110} y={base - h - 24} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill="#fff" opacity={vo}>{val}</text>
  </g>;
  return <AbsoluteFill style={{ opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={1080} y={150} width={760} height={830} rx={26} fill="rgba(20,14,10,.62)" />
      {bar(1180, hc, "#8a8f96", "CIUDAD", "$13,200", e(t, noAt, noAt + 0.3))}
      {bar(1520, hp, "#6b8a3a", "PUEBLO", "$2,950", e(t, sobraAt + 0.1, sobraAt + 0.4))}
      <line x1={1120} x2={1800} y1={yPen} y2={yPen} stroke={CH.maiz} strokeWidth={6} strokeDasharray="18 12" />
      <text x={1130} y={yPen - 16} fontFamily={HAND} fontWeight={700} fontSize={52} fill={CH.maiz}>la pensión</text>
      {hc > base - yPen && <rect x={1180} y={base - hc} width={220} height={hc - (base - yPen)} rx={10} fill="#c8321e" opacity={0.85} />}
    </svg>
    <Sello t={t} at={noAt + 0.3} text="NO ALCANZA" x={1290} y={600} rot={-10} size={46} out={out} col="#ffe2dc" />
    <Sello t={t} at={sobraAt + 0.35} text="SOBRA" x={1630} y={560} rot={8} size={62} col="#2f7d3a" out={out} />
  </AbsoluteFill>;
};

// etiquetas de precio de pueblo colgando de un mecate que se mece
const Colgadas: React.FC<{ t: number; at: number; out: number; items: [string, string][]; x0: number }> = ({ t, at, out, items, x0 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <>{items.map(([a, b], i) => {
    const t0 = at + i * 0.25, k = spr(t, t0, 0.8); if (t < t0) return null;
    const sw = (1 - Math.min(1, k)) * 30 + 4 * Math.sin((t - t0) * 3 + i) * Math.exp(-(t - t0) * 0.6);
    return <div key={i} style={{ position: "absolute", left: x0 + i * 270, top: -10, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - Math.min(1, k)) * -260}px)` }}>
      <div style={{ width: 3, height: 160 + (i % 2) * 90, margin: "0 auto", background: "#d6c49c" }} />
      <div style={{ width: 230, padding: "18px 10px 16px", background: "#f6e7c8", borderRadius: 10, border: `4px solid ${CH.barro}`, textAlign: "center", boxShadow: "0 24px 40px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.tinta }}>{a}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CH.guinda, lineHeight: 1 }}>{b}</div>
      </div>
    </div>;
  })}</>;
};

// renglones que saltan del cuaderno al aire, uno por cosa que nombra
const Renglones: React.FC<{ t: number; items: [number, string][]; out: number; ox: number; oy: number }> = ({ t, items, out, ox, oy }) => <>{items.map(([a, lab], i) => {
  const k = Math.min(1.1, spr(t, a, 1.1)), o = oo(t, a, out, 0.08); if (o <= 0.01) return null;
  const ang = Math.PI * (0.95 - (i / (items.length - 1)) * 0.9), R = 520;
  const tx = ox + Math.cos(ang) * R * 1.45, ty = Math.max(90, oy - Math.sin(ang) * R * 0.7 - 40);
  const x = ox + (tx - ox) * Math.min(1, k), y = oy + (ty - oy) * Math.min(1, k);
  return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * Math.min(1, k)}) rotate(${(i % 2 ? 3 : -3)}deg)` }}>
    <div style={{ padding: "8px 26px 10px", background: "#f3ecd9", borderRadius: 6, boxShadow: "0 16px 30px rgba(0,0,0,.45)", backgroundImage: "linear-gradient(transparent 46px, rgba(70,110,170,.35) 47px)", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: "#22314f", whiteSpace: "nowrap" }}>
      <span style={{ color: "#b3261e", marginRight: 10 }}>{i + 1}.</span>{lab}</div>
  </div>;
})}</>;

// el recibo de la luz con el monto tapado (spoiler) — "te va a dar coraje"
const ReciboLuz: React.FC<{ t: number; at: number; out: number; x: number; y: number; corajeAt: number }> = ({ t, at, out, x, y, corajeAt }) => {
  const k = Math.min(1.06, spr(t, at, 0.9)), o = oo(t, at, out); if (o <= 0.01) return null;
  const shake = t > corajeAt && t < corajeAt + 0.5 ? Math.sin((t - corajeAt) * 70) * 8 * (1 - (t - corajeAt) / 0.5) : 0;
  return <div style={{ position: "absolute", left: x + shake, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${3 - (1 - Math.min(1, k)) * 30}deg) scale(${0.6 + 0.4 * Math.min(1, k)})` }}>
    <div style={{ width: 500, padding: "28px 34px 34px", background: "#f7f7f2", boxShadow: "0 40px 70px rgba(0,0,0,.55)", borderTop: "22px solid #2f7d3a", fontFamily: FONT, color: "#333" }}>
      <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 4 }}>AVISO-RECIBO · LUZ</div>
      <div style={{ fontWeight: 600, fontSize: 24, color: "#777", margin: "6px 0 16px" }}>Periodo bimestral · tarifa 1</div>
      {[0.9, 0.7, 0.8].map((w, i) => <div key={i} style={{ height: 14, width: `${w * 100}%`, background: "#ddd", borderRadius: 7, marginBottom: 10 }} />)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
        <span style={{ fontWeight: 900, fontSize: 32 }}>TOTAL A PAGAR</span>
        <span style={{ position: "relative", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: "#1c1c1c" }}>$146
          <span style={{ position: "absolute", inset: "-6px -14px", background: "#1c1c1c", borderRadius: 8, transform: `rotate(-3deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: 46, color: CH.maiz }}>¿cuánto?</span></span>
      </div>
    </div>
  </div>;
};

// pastillero con la cuenta de salud escondida (adelanto)
const Pastillero: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out), k = Math.min(1.08, spr(t, at, 1)); if (o <= 0.01) return null;
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1, k)}) rotate(-3deg)` }}>
    <div style={{ display: "flex", gap: 8, padding: 14, background: "#3a6fb0", borderRadius: 18, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      {days.map((d, i) => { const op = e(t, at + 0.3 + i * 0.1, at + 0.45 + i * 0.1); return <div key={i} style={{ width: 86, height: 110, borderRadius: 10, background: `rgba(220,235,255,${0.35 + 0.5 * (1 - op)})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "8px 0", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#123" }}>{d}<div style={{ width: 34, height: 18, borderRadius: 9, background: "#f2f2f2", boxShadow: "inset 0 -4px 0 #ccc" }} /></div>; })}
    </div>
    <div style={{ textAlign: "center", marginTop: 16, fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: "#fff", textShadow: extrude(6, "#0a1a30") }}>SALUD: $ ¿ ?</div>
  </div>;
};

// LO MALO: un velo rosa que entra… y se apaga a gris (no todo es color de rosa)
const RosaGris: React.FC<{ t: number; malo: number; rosa: number; out: number }> = ({ t, malo, rosa, out }) => {
  const o = oo(t, malo - 0.2, out, 0.3); if (o <= 0.01) return null;
  const pink = e(t, malo - 0.2, malo + 0.6) * (1 - e(t, rosa + 0.1, rosa + 0.9));
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,150,190,.55), rgba(255,110,160,.25))", mixBlendMode: "screen", opacity: pink }} />
    <AbsoluteFill style={{ backdropFilter: `grayscale(${e(t, rosa + 0.1, rosa + 0.9)})`, WebkitBackdropFilter: `grayscale(${e(t, rosa + 0.1, rosa + 0.9)})` }} />
    <div style={{ position: "absolute", left: 960, top: 500, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, malo, 1))})`, textAlign: "center" }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#fff", textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>al final, también</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 230, lineHeight: 1, color: pink > 0.3 ? "#ffd6e6" : "#e6e6e6", textShadow: extrude(9, pink > 0.3 ? "#8a2a52" : "#333") }}>LO MALO</div>
    </div>
  </AbsoluteFill>;
};

// contador de años en la fábrica (1981 → 2011) con viruta de madera
const Anios: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const yr = Math.round(1981 + 30 * ei(t, at + 0.2, at + 2.2));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: "#f6e7c8", textShadow: extrude(9, "#4a2a10"), lineHeight: 1 }}>30 AÑOS</div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: CH.maiz, letterSpacing: 8, marginTop: 6 }}>1981 — {yr}</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff", marginTop: 4, opacity: e(t, at + 1.5, at + 1.8) }}>fábrica de muebles · Guadalajara</div>
  </div>;
};

// pin de mapa que cae sobre el pueblo en la vista aérea
const Pin: React.FC<{ t: number; at: number; out: number; x: number; y: number; l1: string; l2: string }> = ({ t, at, out, x, y, l1, l2 }) => {
  const k = spr(t, at, 1.1), o = oo(t, at, out, 0.08); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y - (1 - Math.min(1, k)) * 400, opacity: o }}>
    <svg width={120} height={160} viewBox="-60 -150 120 160" style={{ position: "absolute", left: -60, top: -150, filter: "drop-shadow(0 18px 20px rgba(0,0,0,.5))" }}><path d="M 0 0 C -36 -50, -50 -74, -50 -100 A 50 50 0 1 1 50 -100 C 50 -74, 36 -50, 0 0 Z" fill={CH.guinda} stroke="#fff" strokeWidth={6} /><circle cx={0} cy={-100} r={18} fill="#fff" /></svg>
    <div style={{ position: "absolute", left: 70, top: -170, whiteSpace: "nowrap", padding: "12px 26px", background: "rgba(25,14,8,.82)", borderRadius: 12, borderLeft: `8px solid ${CH.maiz}`, opacity: e(t, at + 0.35, at + 0.6) }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#fff", letterSpacing: 3 }}>{l1}</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: CH.maiz, letterSpacing: 4 }}>{l2}</div>
    </div>
  </div>;
};

// corte del portón: las capas de pintura verde de cada diciembre (como anillos de árbol)
const Capas: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const greens = ["#1f4d2b", "#2a6236", "#2f7040", "#3a7d48", "#46895a", "#2b6a3c", "#38784a", "#4f9a62"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, at, 1))})` }}>
    <div style={{ position: "relative", width: 560, height: 220, borderRadius: 16, overflow: "hidden", background: "#8a5a32", boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
      {greens.map((g, i) => { const w = e(t, at + 0.2 + i * 0.14, at + 0.35 + i * 0.14); return <div key={i} style={{ position: "absolute", left: 0, top: 120 - i * 14, height: 14, width: `${w * 100}%`, background: g, borderBottom: "1px solid rgba(0,0,0,.25)" }} />; })}
      <div style={{ position: "absolute", left: 0, top: 134, width: "100%", height: 86, background: "repeating-linear-gradient(90deg,#7a4a26 0 18px,#8f5c34 18px 30px)" }} />
      <div style={{ position: "absolute", right: 20, bottom: 18, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: "#f6e7c8", letterSpacing: 3 }}>MEZQUITE</div>
    </div>
    <div style={{ marginTop: 14, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#fff", textShadow: "0 6px 18px rgba(0,0,0,.7)", textAlign: "center" }}>una mano de verde cada diciembre</div>
  </div>;
};

// ---------- el cierre (veto 21-oct: sin guía) · suscríbase + campanita + UNA pregunta para comentar ----------
// letrero de lámina pintado a mano, clavado en la pared: "SUSCRÍBASE" (se pinta de rojo al "apretarlo")
const Lamina: React.FC<{ t: number; at: number; out: number; pressAt: number; x: number; y: number }> = ({ t, at, out, pressAt, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, at, 0.9)), pr = e(t, pressAt, pressAt + 0.25), bump = 1 - 0.06 * Math.sin(Math.PI * e(t, pressAt - 0.05, pressAt + 0.25));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${-3 + (1 - Math.min(1, k)) * 14}deg) scale(${k * bump})` }}>
    <div style={{ position: "relative", padding: "34px 64px 30px", borderRadius: 18, background: "linear-gradient(160deg,#e9e4d8,#bdb6a6 60%,#a39c8d)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 6px rgba(0,0,0,.12)" }}>
      {[[18, 18], [18, -1], [-1, 18], [-1, -1]].map(([l, tp], i) => <div key={i} style={{ position: "absolute", width: 14, height: 14, borderRadius: 7, background: "#6b6358", boxShadow: "inset 0 2px 3px rgba(255,255,255,.4)", left: l < 0 ? undefined : l, right: l < 0 ? 18 : undefined, top: tp < 0 ? undefined : tp, bottom: tp < 0 ? 18 : undefined }} />)}
      <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "18px 40px", borderRadius: 14, background: `rgb(${200 - 20 * pr},${50 - 10 * pr},${30})`, boxShadow: `0 ${10 - 7 * pr}px 0 #6e1a10` , transform: `translateY(${7 * pr}px)` }}>
        <svg width={70} height={56} viewBox="0 0 70 56"><rect x={2} y={2} width={66} height={52} rx={14} fill="#fff6e6" /><path d="M 28 16 L 48 28 L 28 40 Z" fill="#c8321e" /></svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#fff6e6", letterSpacing: 4, textShadow: "0 3px 0 rgba(0,0,0,.25)" }}>SUSCRÍBASE</div>
      </div>
      <div style={{ marginTop: 14, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CH.tinta }}>si le gusta esta vida de pueblo</div>
    </div>
  </div>;
};

// la campana suena: ondas que salen de la campana real del campanario + el aviso de "video nuevo"
const Ondas: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o, pointerEvents: "none" }}>
    {[0, 1, 2, 3, 4, 5].map((i) => { const p = ((t - at) * 0.9 + i / 6) % 1; if (t - at < i * 0.18) return null; return <circle key={i} cx={x} cy={y} r={60 + p * 520} fill="none" stroke={CH.maiz} strokeWidth={10 * (1 - p)} opacity={(1 - p) * 0.8} />; })}
  </svg>;
};
const Aviso: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 1)), sw = Math.sin((t - at) * 14) * 16 * Math.exp(-(t - at) * 2.2);
  return <div style={{ position: "absolute", left: x, top: y + (1 - k) * -160, opacity: o, transform: "translate(-50%,0)", display: "flex", alignItems: "center", gap: 26, padding: "24px 38px 24px 28px", background: "rgba(250,247,240,.97)", borderRadius: 26, boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
    <svg width={96} height={96} viewBox="0 0 96 96" style={{ transform: `rotate(${sw}deg)`, transformOrigin: "50% 10%" }}>
      <circle cx={48} cy={48} r={46} fill={CH.guinda} />
      <path d="M 48 18 C 34 18 30 30 30 42 L 30 56 L 23 66 L 73 66 L 66 56 L 66 42 C 66 30 62 18 48 18 Z" fill={CH.maiz} />
      <circle cx={48} cy={73} r={7} fill={CH.maiz} />
    </svg>
    <div style={{ fontFamily: FONT }}>
      <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 4, color: "#9a8f80" }}>VIDEO NUEVO · CADA MES</div>
      <div style={{ fontWeight: 900, fontSize: 50, color: "#1b1b1b" }}>Las cuentas de Chencho</div>
    </div>
  </div>;
};

// pa' que no se pierda las cuentas de cada mes: las pestañas del cuaderno, un mes tras otro
const Meses: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const M = ["OCT", "NOV", "DIC", "ENE", "FEB", "MAR"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 18 }}>
    {M.map((m, i) => { const p = Math.min(1.05, spr(t, at + i * 0.13, 1.1)); const on = i === 0; return <div key={m} style={{ width: 150, height: 190, borderRadius: "16px 16px 6px 6px", background: on ? CH.maiz : CH.papel, transform: `translateY(${(1 - Math.min(1, p)) * 300}px) rotate(${(i - 2.5) * 2}deg)`, opacity: Math.min(1, p * 1.4), boxShadow: "0 24px 40px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: CH.guinda, letterSpacing: 3 }}>{m}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.tinta }}>{on ? "$2,950" : "$ ¿?"}</div>
    </div>; })}
  </div>;
};

// el pizarrón de la tortillería: "AQUÍ $22" → "¿Y ALLÁ? $__" con el gis que parpadea
const Pizarron: React.FC<{ t: number; at: number; allaAt: number; out: number; x: number; y: number }> = ({ t, at, allaAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 0.9)), w1 = e(t, at + 0.3, at + 1.0), w2 = e(t, allaAt, allaAt + 0.6), blink = Math.floor(t * 2.4) % 2 ? 1 : 0.15;
  const chalk = { fontFamily: HAND, fontWeight: 700, color: "#f4f1e6", textShadow: "0 0 2px rgba(255,255,255,.5)" } as React.CSSProperties;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(2deg)` }}>
    <div style={{ width: 720, padding: "30px 44px 36px", background: "radial-gradient(circle at 30% 30%,#33433a,#1f2a24)", border: "16px solid #7a5232", borderRadius: 10, boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 6, color: CH.maiz, textAlign: "center" }}>TORTILLA · 1 KILO</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 22, clipPath: `inset(0 ${100 - w1 * 100}% 0 0)` }}>
        <div style={{ ...chalk, fontSize: 70 }}>aquí</div><div style={{ ...chalk, fontSize: 104 }}>$22</div>
      </div>
      <div style={{ height: 4, background: "rgba(244,241,230,.35)", margin: "10px 0", transform: `scaleX(${w2})`, transformOrigin: "left" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", clipPath: `inset(0 ${100 - w2 * 100}% 0 0)` }}>
        <div style={{ ...chalk, fontSize: 70, color: CH.maiz }}>¿y allá?</div>
        <div style={{ ...chalk, fontSize: 104 }}>$<span style={{ opacity: blink }}>__</span></div>
      </div>
    </div>
  </div>;
};

// "escríbamelo abajo": la caja de comentario sube, se escribe sola, y una flecha a mano señala hacia abajo
const Comentario: React.FC<{ t: number; at: number; leoAt: number; out: number }> = ({ t, at, leoAt, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9)), txt = "En mi pueblo está a $", n = Math.floor(txt.length * e(t, at + 0.5, at + 1.8)), cur = Math.floor(t * 2.4) % 2;
  const pile = Math.floor(Math.max(0, (t - leoAt) * 3.2));
  return <div style={{ position: "absolute", left: 960, top: 860 + (1 - k) * 400, opacity: o, transform: "translate(-50%,-50%)" }}>
    {Array.from({ length: Math.min(pile, 7) }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + (i % 2) * 30, top: -40 - i * 26, width: 980, height: 120, borderRadius: 22, background: "rgba(250,247,240,.9)", transform: `rotate(${((i * 37) % 7) - 3}deg) translateY(${-(1 - e(t, leoAt + i / 3.2, leoAt + i / 3.2 + 0.25)) * 80}px)`, boxShadow: "0 18px 30px rgba(0,0,0,.35)" }}>
      <div style={{ position: "absolute", left: 28, top: 28, width: 64, height: 64, borderRadius: 32, background: ["#c2552d", "#6b8a3a", "#2f7fc1", "#7a1f2b", "#e8a321", "#7b4fc8", "#3aa36b"][i] }} />
      {[0.6, 0.4].map((w, j) => <div key={j} style={{ position: "absolute", left: 116, top: 34 + j * 34, height: 18, width: `${w * 70}%`, background: "#ddd8cc", borderRadius: 9 }} />)}
    </div>)}
    <div style={{ position: "relative", width: 1040, display: "flex", alignItems: "center", gap: 28, padding: "28px 36px", background: "#fffdf8", borderRadius: 24, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ width: 84, height: 84, borderRadius: 42, background: CH.maiz, flex: "none" }} />
      <div style={{ flex: 1, fontFamily: FONT, fontWeight: 700, fontSize: 48, color: "#1b1b1b", borderBottom: "3px solid #1b1b1b", paddingBottom: 8 }}>{txt.slice(0, n)}<span style={{ opacity: cur }}>|</span></div>
      <div style={{ padding: "16px 30px", borderRadius: 40, background: "#1a5fb4", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 34 }}>COMENTAR</div>
    </div>
    <div style={{ position: "absolute", right: -40, top: -170, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#fff", textShadow: "0 6px 18px rgba(0,0,0,.85)", opacity: e(t, at + 0.2, at + 0.5), whiteSpace: "nowrap", transform: "rotate(-4deg)" }}>
      {t < leoAt ? "escríbamelo abajo" : "¡los leo todos!"}
      <svg width={120} height={150} viewBox="0 0 120 150" style={{ display: "block", marginLeft: 120, overflow: "visible" }}>
        <path d="M 40 6 C 70 50, 70 90, 52 136" fill="none" stroke={CH.maiz} strokeWidth={12} strokeLinecap="round" strokeDasharray="160" strokeDashoffset={160 * (1 - e(t, at + 0.3, at + 0.8))} />
        <path d="M 26 112 L 52 140 L 78 116" fill="none" stroke={CH.maiz} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={e(t, at + 0.75, at + 0.9)} />
      </svg>
    </div>
  </div>;
};

// ================= EL MINUTO =================
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W = (k: string, tt = t, over?: Partial<WorldProps>, gray = 0) => <World key={k} t={tt} over={over} gray={gray} />;
  const nb = (tt: number) => screenOf(tt, NB);

  // A · 0-4,54 · avatar "ándale, siéntate… mira nomás esta calle" → portal a la calle
  if (t < av(0)[1]) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, T.calle + 0.15, av(0)[1]);
    if (r > 0) L.push(<Portal key="pA" x={1180} y={470} r={r}>{W("wA")}</Portal>);
  }
  // B · 4,54-14,57 · la calle, "piedra por piedra", el cuaderno en la banqueta se escribe "peso por peso"
  if (t >= av(0)[1] && t < av(1)[0]) {
    L.push(W("wB"));
    if (t < 7.6) L.push(<Pensado key="pp" t={t} at={T.piedra} out={7.0} x={1260} y={250} text="piedra por piedra…" size={88} />);
    const c = nb(t);
    L.push(<Tag key="cq" t={t} at={T.cuaderno} x={c.x} y={c.y - 40} dx={-360} dy={-260} text="MI CUADERNO" sub="DE CUENTAS" col={CH.maiz} out={T.peso - 0.2} size={56} />);
    L.push(<Monedas key="mo" t={t} a={T.peso} out={av(1)[0] - 0.3} x={c.x + 330} y={c.y + 120} />);
  }
  // C · 14,57-18,64 · avatar: "fueron 3,000 pesos"
  if (t >= av(1)[0] && t < av(1)[1]) {
    L.push(<Avatar key="avC" t={t} />);
    L.push(<BigNum key="3m" t={t} at={T.tresmil} text="$3,000" x={1380} y={430} size={230} col={CH.maiz} edge="#5a2a10" sub="AL MES · TODO" />);
  }
  // D · 18,64-23,2 · la grúa sube sobre los techos: "como mejor que en la ciudad"
  if (t >= av(1)[1] && t < T.imagina + 0.3) {
    L.push(W("wD"));
    L.push(<Sello key="cm" t={t} at={T.mejor} text="COMO MEJOR" sub="QUE EN LA CIUDAD" x={1400} y={300} out={T.imagina} rot={-6} size={96} col={CH.guinda} />);
  }
  // E · 23,2-30,78 · "imagínate esto": la ciudad se come el color → depto: DÍA 30 → el recibo de la renta
  if (t >= T.imagina - 0.3 && t < av(2)[0]) {
    const city = <Clip k="h_renta" t={t} a={T.imagina} z={[1.0, 1.12]} dur={8} />;
    if (t < T.imagina + 1.3) L.push(<GrisWipe key="gw" t={t} a={T.imagina} A={W("wE", Math.max(t, 23.2))} B={city} />);
    else L.push(<React.Fragment key="cE">{city}</React.Fragment>);
    L.push(<Calendario key="cal" t={t} at={T.dia30} out={T.renta - 0.2} x={1500} y={420} />);
    L.push(<ReciboRenta key="rr" t={t} at={T.renta} amtAt={T.renta$} out={av(2)[0] - 0.1} x={1340} y={560} />);
  }
  // F · 30,78-36,14 · avatar: abres el refri (polaroid) → faltan 4 días para la quincena
  if (t >= av(2)[0] && t < av(2)[1]) {
    L.push(<Avatar key="avF" t={t} />);
    L.push(<Polaroid key="rf" t={t} at={T.refri} out={T.faltan - 0.15} img="img_h_refri.jpg" x={1460} y={500} cap="casi vacío" />);
    L.push(<Quincena key="qn" t={t} at={T.faltan} out={av(2)[1] - 0.1} x={1430} y={520} />);
  }
  // G · 36,14-39,9 · el jitomate del súper: la etiqueta de precio y AGUADO
  if (t >= av(2)[1] && t < T.sales + 0.5) {
    L.push(<Clip key="cj" k="h_jitomate" t={t} a={av(2)[1]} z={[1.12, 1.02]} />);
    L.push(<EtiquetaSuper key="es" t={t} at={T.jitomate + 0.3} out={T.sales + 0.3} x={520} y={300} />);
    L.push(<Aguado key="ag" t={t} at={T.aguado + 0.15} out={T.sales + 0.3} x={1300} y={820} />);
  }
  // H · 39,9-47,6 · el camión lleno: 1 h 30 → la cuenta en la cabeza que no sale
  if (t >= T.sales && t < av(3)[0]) {
    L.push(<Slide key="sh" t={t} a={T.sales} A={<Clip k="h_jitomate" t={t} a={av(2)[1]} z={[1.12, 1.02]} />} B={<Clip k="h_camion" t={t} a={T.sales} z={[1.04, 1.12]} ox={-30} />} />);
    L.push(<Trayecto key="ty" t={t} at={T.hora} out={T.cuenta - 0.1} y={720} />);
    L.push(<AbsoluteFill key="dk" style={{ background: "rgba(8,6,6,.62)", opacity: e(t, T.cuenta - 0.1, T.cuenta + 0.3) }} />);
    L.push(<CuentaRoja key="cr" t={t} at={T.cuenta + 0.1} noAt={T.nosale} out={av(3)[0] - 0.1} x={960} y={520} />);
  }
  // I · 47,6-52,5 · avatar: "así viví yo 30 años… ¿y para qué sigo aquí?"
  if (t >= av(3)[0] && t < av(3)[1]) {
    L.push(<Avatar key="avI" t={t} />);
    L.push(<Pensado key="ps" t={t} at={T.sigo - 0.1} out={av(3)[1] - 0.15} x={1400} y={300} text="¿y pa' qué sigo aquí?" size={92} />);
  }
  // J · 52,5-56,2 · la combi de regreso: el mapa vectorial de Guadalajara al pueblo
  if (t >= av(3)[1] && t < T.casa + 0.9) {
    const combi = <Clip key="cc" k="h_combi" t={t} a={av(3)[1]} z={[1.02, 1.1]} ox={40} />;
    if (t < T.casa) L.push(<React.Fragment key="cJ">{combi}</React.Fragment>);
    else L.push(<ColorBack key="cb" t={t} a={T.casa} A={combi} B={W("wJ")} />);
    L.push(<MapaRuta key="mr" t={t} at={T.regrese} mAt={T.michoacan} out={T.casa - 0.3} />);
  }
  // K · 56,2-62,14 · la casa de sus papás (el portón) y las barras: la pensión no alcanzaba… aquí sobra
  if (t >= T.casa + 0.9 && t < av(4)[0]) {
    L.push(W("wK"));
    const pr = screenOf(t, PT.porton);
    L.push(<Tag key="cp" t={t} at={T.casa + 0.95} x={pr.x} y={pr.y} dx={260} dy={-240} text="LA CASA" sub="DE MIS PAPÁS" col={CH.maiz} out={T.pension} size={52} />);
  }
  if (t >= T.pension - 0.2 && t < av(4)[0]) L.push(<Barras key="bp" t={t} at={T.pension} noAt={T.noalc} sobraAt={T.sobra} out={av(4)[0] - 0.1} />);
  // L · 62,14-66,62 · avatar: "aquí las cosas cuestan lo que de veras cuestan"
  if (t >= av(4)[0] && t < av(4)[1]) {
    L.push(<Avatar key="avL" t={t} />);
    L.push(<Colgadas key="cg" t={t} at={T.cuestan} out={av(4)[1] - 0.1} x0={1040} items={[["tortilla", "$22"], ["jitomate", "$18"], ["huevo", "$0"]]} />);
  }
  // M · 66,62-80,2 · el cuaderno se abre: renglón por renglón (un papelito sale volando por cada cosa que nombra)
  if (t >= av(4)[1] && t < av(5)[0]) {
    L.push(W("wM"));
    const c = nb(Math.max(t, 69.4));
    L.push(<Pensado key="rx" t={t} at={T.renglon} out={T.i_tia - 0.1} x={c.x} y={c.y - 360} text="renglón por renglón" size={84} rot={-2} />);
    L.push(<Renglones key="rg" t={t} out={av(5)[0] - 0.1} ox={c.x} oy={c.y - 120} items={[[T.i_tia, "tianguis"], [T.i_tor, "tortillas"], [T.i_gas, "gas"], [T.i_luz, "luz"], [T.i_agua, "agua"], [T.i_combi, "combi"], [T.i_tienda, "tiendita"], [T.i_salud, "salud"], [T.i_gusto, "el gustito"]]} />);
  }
  // N · 80,2-84,83 · avatar: "con precios de este mes… sin redondear"
  if (t >= av(5)[0] && t < av(5)[1]) {
    L.push(<Avatar key="avN" t={t} />);
    L.push(<Sello key="sr" t={t} at={T.redondear} text="SIN REDONDEAR" sub="PRECIOS DE OCTUBRE" x={1380} y={820} out={av(5)[1] - 0.1} rot={-5} size={84} col={CH.maiz} />);
  }
  // O · 84,83-96,95 · el medidor de luz (el recibo con el monto tapado) → salud (adelanto) → sale a la calle: LO MALO
  if (t >= av(5)[1] && t < av(6)[0]) {
    L.push(W("wO"));
    const m = screenOf(t, PT.recibo);
    L.push(<Tag key="md" t={t} at={av(5)[1] + 0.2} x={m.x} y={m.y} dx={-300} dy={-200} text="EL MEDIDOR" col="#cfe3f0" out={T.coraje - 0.3} size={48} />);
    L.push(<ReciboLuz key="rl" t={t} at={T.luz + 0.4} out={T.salud - 0.1} x={1400} y={540} corajeAt={T.coraje} />);
    L.push(<Pastillero key="pa" t={t} at={T.salud} out={T.aguantate} x={1360} y={520} />);
    L.push(<RosaGris key="rg2" t={t} malo={T.malo} rosa={T.rosa} out={av(6)[0] - 0.15} />);
  }
  // P · 96,95-102,09 · avatar: Crescencio «Chencho» Villanueva, 69 años
  if (t >= av(6)[0] && t < av(6)[1]) {
    L.push(<Avatar key="avP" t={t} />);
    L.push(<LowerThird key="lt" t={t} at={T.cres} out={av(6)[1] - 0.1} name="CRESCENCIO VILLANUEVA" l2="«CHENCHO» · 69 AÑOS · JUBILADO" l2at={T.anos69 - 0.6} />);
  }
  // Q · 102,09-106,36 · su hermana Chayo (la de la cocina) → la fábrica de muebles: 30 años
  if (t >= av(6)[1] && t < T.pueblito + 0.4) {
    const A = <Clip k="h_chayo" t={t} a={av(6)[1]} z={[1.03, 1.1]} rate={0.72} />, B = <Clip k="h_fabrica" t={t} a={T.fabrica - 0.6} z={[1.1, 1.02]} />;
    L.push(<Slide key="sq" t={t} a={T.fabrica - 0.6} A={A} B={B} />);
    L.push(<Pensado key="hc" t={t} at={T.hermano + 0.3} out={T.fabrica - 0.6} x={1350} y={230} text="mi hermana Chayo" size={92} />);
    L.push(<Sello key="lc" t={t} at={T.cocina} text="LA DE LA COCINA" x={1350} y={380} out={T.fabrica - 0.6} rot={4} size={58} col={CH.guinda} />);
    L.push(<AbsoluteFill key="fd" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.6))", opacity: e(t, T.fabrica, T.fabrica + 0.3) }} />);
    L.push(<Anios key="an" t={t} at={T.fabrica} out={T.pueblito + 0.2} x={960} y={800} />);
  }
  // R · 112,96-114,35 · vista aérea del pueblito: el pin "cerca de Pátzcuaro"
  if (t >= T.pueblito + 0.1 && t < av(7)[0]) {
    const fab = <Clip k="h_fabrica" t={t} a={T.fabrica - 0.6} z={[1.1, 1.02]} />;
    if (t < T.pueblito + 0.4) L.push(<ColorBack key="cb2" t={t} a={T.pueblito - 0.4} A={fab} B={W("wR")} />);
    else L.push(W("wR"));
    const ig = screenOf(t, [0, 1, -28]);
    L.push(<Pin key="pin" t={t} at={T.patz} out={av(7)[0] - 0.05} x={ig.x} y={ig.y} l1="CERCA DE PÁTZCUARO" l2="MICHOACÁN · DONDE NACIMOS" />);
  }
  // S · 114,35-119,15 · avatar: la casa es de adobe
  if (t >= av(7)[0] && t < av(7)[1]) {
    L.push(<Avatar key="avS" t={t} />);
    L.push(<Polaroid key="ad" t={t} at={T.adobe + 0.2} out={av(7)[1] - 0.1} img="img_t_adobe.jpg" x={1450} y={480} cap="adobe de mis papás" rot={-4} w={500} />);
  }
  // T · 119,15-123,7 · el portón de mezquite (capas de pintura) se abre
  // U · 123,7-147,86 · el cierre SIN avatar (veto 21-oct): la calle → "suscríbase" → la campana del campanario suena → baja
  //     a la plaza: el pizarrón de la tortillería "aquí $22, ¿y allá?" → la caja de comentario → "vamos a las cuentas"
  if (t >= av(7)[1]) {
    L.push(W("wT"));
    L.push(<Capas key="cap" t={t} at={T.verde - 0.3} out={T.rapidito + 0.2} x={1340} y={330} />);
    L.push(<Lamina key="lam" t={t} at={T.vidap - 0.6} pressAt={T.suscr + 0.3} out={T.campana - 0.5} x={640} y={560} />);
    const bl = screenOf(t, BELL);
    L.push(<Ondas key="on" t={t} at={T.campana} out={T.pregunta - 0.3} x={bl.x} y={bl.y} />);
    L.push(<Aviso key="avi" t={t} at={T.campana + 0.4} out={T.pregunta - 0.2} x={960} y={70} />);
    L.push(<Meses key="ms" t={t} at={T.cmes - 0.9} out={T.pregunta - 0.1} x={960} y={850} />);
    L.push(<Pensado key="pq" t={t} at={T.pregunta} out={T.tortilla - 0.2} x={960} y={250} text="una pregunta, nomás pa' mí…" size={92} />);
    L.push(<Pizarron key="pz" t={t} at={T.tortilla - 0.3} allaAt={T.alla} out={T.vamos - 0.2} x={960} y={330} />);
    L.push(<Comentario key="cm" t={t} at={T.escribe} leoAt={T.leo} out={T.vamos - 0.1} />);
    L.push(<Pensado key="vc" t={t} at={T.vamos + 0.2} out={MIN1_END} x={960} y={220} text="¡vamos a las cuentas!" size={100} rot={-3} />);
  }
  L.push(<Flash key="fl1" t={t} at={T.pueblito + 0.1} col="#fff6e0" peak={0.35} w={0.3} />);

  return <AbsoluteFill style={{ background: "#0b0907" }}>{L}</AbsoluteFill>;
};
