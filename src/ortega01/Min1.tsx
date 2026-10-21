// ortega01 · MINUTO 1 (0 → fin de la 5ª ventana del avatar). UNA SOLA TOMA, sin cortes secos; todo anclado con at("frase"):
// avatar → (la tarjeta del zaguán se abre a pantalla) → zaguán real → (iris al zaguán 3D) → la casa en corte: el ratero brinca la barda
// (portal a la toma real), su ruta roja se dibuja, cronómetro de 8:00 → (portal desde la puerta del patio) → avatar con fichas tachadas
// SALA / COCINA → (latigazo hacia arriba por la escalera) → la recámara 3D → (portal desde el buró) → buró → colchón → clóset (latigazos)
// con cronómetro que frena en 2:51 y el sobre de 6 meses → (la toma cae como una hoja) → avatar con credencial, foto vieja y expedientes
// → (latigazo) → recámara saqueada, MANOS VACÍAS → (la toma se cierra en la recámara 3D) → vuelo al naranjo del patio, pin verde
// → (portal) → el comandante levanta el naranjo → (empuje lateral) → avatar con el dial de 25 → (el avatar se mete en el retrato de la sala)
// → la casa entera con 25 pines verdes → se apagan, nacen los 5 rojos → (iris desde el buró) → avatar: apuesta + placa de comandante.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, getStaticFiles, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { CasaWorld, PT, screenOf, camSpeed, setKeys, setRoute, setPins, camAt, project, Pin } from "./casa3d";
import { COL, Card3D, FONT, Flash, P, Portal, Tag, at, e, ei, extrude, s, spr } from "./lib";
import { Apuesta, Cinco, Credencial, Crono, Dial25, Expedientes, FichaX, FotoVieja, PinHUD, Placa, SelloTinta, Sobre } from "./piezas_m1";
import AVW from "./avwin.json";

// ---------- avatar: ventanas pagadas (avwin.json) ----------
const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
const W = WIN.slice(0, 5);
export const MIN1_FRAMES = s(W[4].me);

const FILES = new Set(getStaticFiles().map((f) => f.name));
const has = (id: string) => FILES.has(P + id + ".mp4");
const REEL = has("reel0");

// ---------- tiempos: TODO desde la voz ----------
const T = {
  cerro: at("Cerró con llave"), brinca: at("brinca la barda"), prisa: at("No trae prisa"), ocho: at("ocho"),
  sala: at("No se mete a la sala"), cocina: at("No toca la cocina"), sube: at("Sube directito"),
  buro: at("Abre el cajón del buró"), colchon: at("Levanta el colchón"), zapatos: at("Mete la mano en la caja"),
  encuentra: at("encuentra el sobre"), sobre: at("sobre con los ahorros"), seis: at("seis meses"), renta: at("renta"), medicina: at("medicina"),
  treinta: at("Treinta y dos años"), policia: at("policía en Guadalajara"), cientos: at("cientos de veces"),
  revolvio: at("revolvió todo"), tiro: at("tiró los cajones"), rajo: at("rajó el colchón"), manos: at("manos vacías"),
  porque: at("Porque el dinero estaba"), lugar: at("lugar donde a él"), jamas: at("jamás"),
  v25: at("veinticinco lugares"), aqui: at("aquí en mi propia casa"), pero: at("Pero primero"), cincoL: at("los cinco lugares donde siempre"),
  apuesto: at("le apuesto"), uno: at("en uno de esos cinco"), ahorita: at("ahorita mismo"),
  para: at("Para los que no me conocen"), ruben: at("Rubén Ortega"), retirado: at("comandante retirado"),
};

// ---------- la cámara del mundo (una sola, toda la toma) ----------
type V3 = [number, number, number];
setKeys([
  { t: 0, p: [1.0, 6.2, 15.5], l: [0.0, 2.2, 0], fov: 42 },
  { t: W[0].me, p: [1.0, 6.2, 15.5], l: [0.0, 2.2, 0], fov: 42 },
  { t: T.brinca - 0.5, p: [-6.5, 4.2, 10.5], l: [-10, 1.4, 0], fov: 40, arc: 0.3 },
  { t: T.brinca + 0.8, p: [-8.2, 3.0, 7.0], l: [-10.5, 1.3, 0], fov: 40 },
  { t: T.ocho + 0.3, p: [-6.6, 3.4, 7.5], l: [-7.2, 1.0, 0.8], fov: 40 },
  { t: W[1].ms, p: [-4.6, 3.8, 8.5], l: [-4.8, 1.3, 0.5], fov: 40 },
  { t: W[1].me - 0.35, p: [-3.3, 1.6, 6.5], l: [-3.3, 1.4, -1], fov: 40 },
  { t: W[1].me + 0.05, p: [-2.9, 4.9, 5.0], l: [-2.8, 3.7, -1.2], fov: 40 },
  { t: T.buro + 0.55, p: [-2.9, 4.9, 4.0], l: [-2.6, 3.7, -1.3], fov: 40 },
  { t: T.porque, p: [-3.3, 4.5, 3.4], l: [-3.3, 3.9, -1.2], fov: 40 },
  { t: T.porque + 0.35, p: [-3.3, 4.5, 3.4], l: [-3.3, 3.9, -1.2], fov: 40 },
  { t: T.lugar, p: [-8.4, 2.5, 3.8], l: [-10.1, 1.2, -1.85], fov: 40, arc: 0.35 },
  { t: T.jamas + 0.85, p: [-9.0, 2.1, 1.7], l: [-10.1, 1.4, -1.85], fov: 40 },
  { t: T.aqui, p: [0.6, 1.88, -0.85], l: [0.6, 1.85, -2.44], fov: 40 },
  { t: T.aqui + 0.35, p: [0.6, 1.88, -0.85], l: [0.6, 1.85, -2.44], fov: 40 },
  { t: W[3].me + 0.6, p: [-1.4, 6.4, 16.5], l: [-1.4, 2.6, 0], fov: 42 },
  { t: T.pero + 0.2, p: [-1.5, 6.2, 16.0], l: [-1.5, 2.6, 0], fov: 42 },
  { t: T.cincoL + 1.0, p: [-3.0, 3.9, 10.5], l: [-3.0, 2.6, 0], fov: 40 },
  { t: W[4].ms, p: [-2.6, 4.3, 6.0], l: [-2.3, 3.6, -1.6], fov: 40 },
]);
const PI = Math.PI;
setRoute([
  { t: 0, p: [-11.9, 0, 0.3], ry: PI / 2 },
  { t: T.brinca - 0.25, p: [-11.7, 0.9, 0.3], ry: PI / 2, pose: "climb" },
  { t: T.brinca + 0.25, p: [-11.05, 2.15, 0.3], ry: PI / 2, pose: "climb" },
  { t: T.brinca + 0.7, p: [-10.3, 0.02, 0.4], ry: PI / 2, pose: "crouch" },
  { t: T.prisa, p: [-10.0, 0.02, 0.5], ry: PI / 2 + 0.35, pose: "walk" },
  { t: T.ocho + 0.5, p: [-6.3, 0.02, 1.2], ry: PI / 2, pose: "walk" },
  { t: W[1].ms, p: [-4.8, 0.12, 1.2], ry: PI / 2, pose: "walk" },
  { t: T.sube, p: [0.9, 0.12, -1.6], ry: PI / 2, pose: "walk" },
  { t: T.sube + 0.9, p: [3.1, 3.12, -1.9], ry: PI / 2, pose: "walk" },
  { t: W[1].me - 0.2, p: [-0.6, 3.12, 1.9], ry: -PI / 2, pose: "walk" },
  { t: T.buro, p: [-2.1, 3.12, -1.25], ry: PI, pose: "reach" },
  { t: T.colchon, p: [-2.0, 3.12, -0.2], ry: -PI / 2, pose: "reach" },
  { t: T.zapatos, p: [-4.4, 3.12, 0.6], ry: -PI / 2, pose: "reach" },
]);
const G = (p: V3, i: number, n: number): Pin => ({ p, col: "g", at: W[3].me + 0.15 + i * (1.5 / n), out: T.pero + 0.05 });
const GREENS: V3[] = [
  [-1.5, 0.66, -2.1], [-3.3, 2.75, -2.2], [-4.3, 0.12, 0.3], [-2.4, 2.75, -2.3], [-3.9, 2.75, -2.3],      // cocina
  [-6.4, 0.9, -2.0], [-7.2, 0.96, -2.25], [-9.0, 0.02, 1.4], [-6.9, 0.02, 1.9],                              // lavado y baño
  [-0.45, 2.55, -2.4], [3.1, 2.4, 1.2], [-0.6, 0.9, -2.2], [0.0, 0.12, 1.6],                               // sala
  [1.9, 4.0, -2.2], [0.0, 3.65, 1.2], [3.1, 5.4, -2.1], [-0.6, 3.12, 2.0],                                  // nietos
  [7.6, 1.25, -2.1], [7.6, 0.62, -2.1], [7.1, 0.03, -1.6], [7.8, 0.03, 0.8], [6.9, 1.9, -2.2],             // cochera
  [-10.6, 0.02, -0.5], [-8.3, 1.6, -2.0],                                                                   // patio (el naranjo va aparte)
];
const NARANJO: Pin = { p: [-10.1, 2.6, -1.85], col: "g", at: T.lugar, out: T.pero + 0.05 };
export const REDS: V3[] = [[-2.05, 3.72, -2.0], [-3.3, 3.75, -0.6], [-5.0, 5.2, 0.4], [-5.0, 2.05, -1.62], [-5.0, 3.2, 1.0]];
setPins([NARANJO, ...GREENS.map((p, i) => G(p, i, GREENS.length)), ...REDS.map((p, i): Pin => ({ p, col: "r", at: T.cincoL + 0.2 + i * 0.22, out: W[4].ms + 1 }))]);

// ---------- tomas (LTX si llegó; si no, la foto del primer cuadro con zoom lento) ----------
// zapatos: las cajas de arriba traen marcas → se recorta la franja de arriba
const CROP: Record<string, { z: [number, number]; o: string }> = { zapatos: { z: [1.3, 1.36], o: "50% 92%" } };
export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z: z0 = [1.03, 1.12] }) => {
  const z = CROP[k]?.z ?? z0;
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 9);
  return <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: CROP[k]?.o ?? "50% 50%" }}>{has("ltx_" + k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + "ltx_" + k + ".mp4")} startFrom={s(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</AbsoluteFill>;
};

// avatar con preroll de 10 cuadros (OffthreadVideo arranca antes de verse) y 10 de cola para las transiciones
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>
      {REEL ? WIN.map((w, i) => (
        <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 22} layout="none">
          <AbsoluteFill style={{ opacity: t >= w.ms - 0.34 && t < w.me + 0.34 ? 1 : 0 }}>
            <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (s(w.ms) >= 10 ? 10 : 0))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />}
    </AbsoluteFill>
  </AbsoluteFill>
);

// mundo 3D con blur de movimiento real
export const World: React.FC<{ t: number; trail?: [number, number]; thief?: boolean; naranjo?: { glow: number; lift: number }; zaguan?: number }> = ({ t, ...rest }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(6, v0.by * 0.6) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><CasaWorld t={t} {...rest} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// latigazo horizontal entre dos capas (sale A a la izquierda, entra B desde la derecha) con blur direccional
export const Whip: React.FC<{ k: number; a: React.ReactNode; b: React.ReactNode; dir?: "x" | "y"; sg?: number }> = ({ k, a, b, dir = "x", sg = 1 }) => {
  const mb = Math.round(Math.sin(k * PI) * 70);
  const id = "wh" + dir + mb;
  const tr = (u: number) => dir === "x" ? `translateX(${u * 1920}px)` : `translateY(${u * 1080}px)`;
  return (
    <AbsoluteFill>
      {mb > 0 && <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={dir === "x" ? `${mb} 0` : `0 ${mb}`} /></filter></svg>}
      <AbsoluteFill style={{ transform: tr(-k * sg), filter: mb > 0 ? `url(#${id})` : undefined }}>{a}</AbsoluteFill>
      <AbsoluteFill style={{ transform: tr((1 - k) * sg), filter: mb > 0 ? `url(#${id})` : undefined }}>{b}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// lista de lo que revisa el ratero (se tilda en rojo con cada palabra)
const Revisa: React.FC<{ t: number; items: { at: number; text: string }[]; out: number }> = ({ t, items, out }) => {
  const o = e(t, items[0].at, items[0].at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 80, opacity: o, padding: "20px 28px", borderRadius: 14, background: "rgba(12,12,14,.82)", boxShadow: "0 20px 40px rgba(0,0,0,.5), inset 0 0 0 2px rgba(255,74,61,.5)", fontFamily: FONT }}>
      <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 5, color: COL.dim, marginBottom: 8 }}>LO QUE REVISA PRIMERO</div>
      {items.map((it, i) => {
        const on = e(t, it.at, it.at + 0.15);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: 0.25 + 0.75 * on, transform: `translateX(${(1 - on) * -20}px)` }}>
          <div style={{ width: 34, height: 34, borderRadius: 6, border: `3px solid ${COL.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 28, color: COL.red }}>{on > 0.5 ? "✓" : ""}</div>
          <div style={{ fontWeight: 900, fontSize: 46, color: COL.ink, letterSpacing: 2 }}>{it.text}</div>
        </div>;
      })}
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const trailB: [number, number] = [T.brinca - 0.25, T.zapatos];

  // ===== A · avatar; en "Cerró con llave" sube la tarjeta del zaguán; la tarjeta se abre a pantalla completa =====
  if (t < W[0].me + 0.05) {
    L.push(<Avatar key="avA" t={t} />);
    const k = spr(t, T.cerro, 0.8), x = ei(t, W[0].me - 0.6, W[0].me - 0.05);
    if (x <= 0) L.push(<Card3D key="zg" id={has("ltx_zaguan") ? "ltx_zaguan" : "img_zaguan"} at={T.cerro} x={1040} y={200} w={760} h={428}
      ry={(1 - Math.min(1, k)) * -60 - 8} rx={4} z={(1 - Math.min(1, k)) * -1200} o={e(t, T.cerro, T.cerro + 0.12)} label="10:00 AM · CON LLAVE" labelCol={COL.gold} />);
    else {
      const r = { l: 1040 * (1 - x), t: 200 * (1 - x), w: 760 + (1920 - 760) * x, h: 428 + (1080 - 428) * x };
      L.push(<div key="zgX" style={{ position: "absolute", left: r.l, top: r.t, width: r.w, height: r.h, overflow: "hidden", borderRadius: 16 * (1 - x), border: `${6 * (1 - x)}px solid rgba(255,255,255,.94)`, boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
        <div style={{ position: "absolute", left: -r.l, top: -r.t, width: 1920, height: 1080 }}><Shot k="zaguan" t={t} a={T.cerro} /></div></div>);
    }
  }
  // ===== B · el zaguán real se cierra en el zaguán 3D; la casa en corte; el ratero brinca la barda; ruta roja; 8:00 =====
  if (t >= W[0].me && t < W[1].ms + 0.05) {
    L.push(<World key="wB" t={t} trail={trailB} />);
    const zr = 1 - ei(t, W[0].me, W[0].me + 0.6);
    if (zr > 0) { const z = screenOf(t, PT.zaguan); L.push(<Portal key="pZ" x={z.x} y={z.y} r={zr}><Shot k="zaguan" t={t} a={T.cerro} /></Portal>); }
    const b = screenOf(t, PT.barda);
    L.push(<Tag key="tB" t={t} at={T.brinca} x={b.x} y={b.y} dx={180} dy={-140} text="LA BARDA DE ATRÁS" col={COL.amber} out={T.brinca + 0.45} />);
    const pr = ei(t, T.brinca + 0.35, T.brinca + 0.8) * (1 - ei(t, T.prisa + 0.9, T.prisa + 1.3));
    if (pr > 0) { const bb = screenOf(t, [-10.6, 1.2, 0.4]); L.push(<Portal key="pB" x={bb.x} y={bb.y} r={pr}><Shot k="barda" t={t} a={T.brinca + 0.35} /></Portal>); }
    L.push(<Crono key="c8" t={t} at={T.ocho} out={W[1].ms - 0.2} x={1580} y={330} size={330} val={480 - Math.max(0, t - T.ocho) * 45} max={480} label="TIEMPO DEL RATERO" />);
    const d = screenOf(t, PT.puertaPatio), ir = ei(t, W[1].ms - 0.3, W[1].ms + 0.05);
    if (ir > 0) L.push(<Portal key="pAv" x={d.x} y={d.y} r={ir}><Avatar t={t} /></Portal>);
  }
  // ===== C · avatar con fichas tachadas; latigazo hacia ARRIBA a la recámara =====
  if (t >= W[1].ms + 0.05 && t < W[1].me + 0.1) {
    const k = ei(t, W[1].me - 0.3, W[1].me + 0.1);
    const av = (
      <AbsoluteFill>
        <Avatar t={t} />
        <FichaX t={t} at={T.sala} out={W[1].me} x={330} y={330} text="SALA" rot={-5} />
        <FichaX t={t} at={T.cocina} out={W[1].me} x={360} y={740} text="COCINA" rot={4} />
        <div style={{ position: "absolute", right: 120, top: 500, opacity: e(t, T.sube, T.sube + 0.15), transform: `translateY(${(1 - e(t, T.sube, T.sube + 0.4)) * 60 - Math.sin((t - T.sube) * 6) * 8}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: COL.red, textShadow: extrude(8, "#3a0705"), textAlign: "center" }}>↑<br />RECÁMARA</div>
      </AbsoluteFill>
    );
    L.push(k > 0 ? <Whip key="wC" k={k} dir="y" sg={-1} a={av} b={<World t={t} trail={trailB} />} /> : <AbsoluteFill key="avC">{av}</AbsoluteFill>);
  }
  // ===== D · la recámara 3D: el ratero en el buró; anillo; portal a la toma del buró =====
  if (t >= W[1].me + 0.1 && t < T.buro + 0.6) {
    L.push(<World key="wD" t={t} trail={trailB} />);
    const q = screenOf(t, PT.buro);
    L.push(<Tag key="tD" t={t} at={T.buro} x={q.x} y={q.y} dx={-200} dy={-130} text="EL BURÓ" sub="SIEMPRE PRIMERO" col={COL.red} />);
    const pr = ei(t, T.buro + 0.15, T.buro + 0.6);
    if (pr > 0) L.push(<Portal key="pD" x={q.x} y={q.y} r={pr}><Shot k="buro" t={t} a={T.buro + 0.15} /></Portal>);
  }
  // ===== E · buró → colchón → clóset (latigazos) con la lista que se tilda; el sobre de 6 meses =====
  if (t >= T.buro + 0.6 && t < W[2].ms + 0.05) {
    const k1 = ei(t, T.colchon - 0.15, T.colchon + 0.15), k2 = ei(t, T.zapatos - 0.15, T.zapatos + 0.15);
    const fall = ei(t, W[2].ms - 0.35, W[2].ms + 0.05);
    let shot: React.ReactNode;
    if (t < T.colchon - 0.15) shot = <Shot k="buro" t={t} a={T.buro + 0.15} />;
    else if (k1 < 1) shot = <Whip k={k1} a={<Shot k="buro" t={t} a={T.buro + 0.15} />} b={<Shot k="colchon" t={t} a={T.colchon - 0.15} />} />;
    else if (t < T.zapatos - 0.15) shot = <Shot k="colchon" t={t} a={T.colchon - 0.15} />;
    else if (k2 < 1) shot = <Whip k={k2} a={<Shot k="colchon" t={t} a={T.colchon - 0.15} />} b={<Shot k="zapatos" t={t} a={T.zapatos - 0.15} />} />;
    else shot = <Shot k="zapatos" t={t} a={T.zapatos - 0.15} />;
    if (fall > 0) L.push(<Avatar key="avE" t={t} />);
    L.push(<AbsoluteFill key="e" style={{ perspective: 1800 }}>
      <AbsoluteFill style={{ transformOrigin: "50% 100%", transform: `rotateX(${fall * 88}deg)`, opacity: 1 - e(fall, 0.8, 1) }}>
        {shot}
        <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 40%, rgba(0,0,0,.55))", opacity: e(t, T.sobre, T.sobre + 0.3) }} />
        <Sobre t={t} at={T.sobre} out={W[2].ms - 0.4} x={1340} y={430} big={{ at: T.seis, text: "6 MESES" }} slips={[{ at: T.renta, text: "RENTA" }, { at: T.medicina, text: "MEDICINA", col: COL.red }]} />
      </AbsoluteFill>
    </AbsoluteFill>);
    L.push(<Revisa key="rv" t={t} items={[{ at: T.buro, text: "BURÓ" }, { at: T.colchon, text: "COLCHÓN" }, { at: T.zapatos, text: "CLÓSET" }]} out={T.sobre} />);
  }
  // cronómetro de la recámara: corre desde el buró y FRENA en "encuentra" (2:51)
  if (t >= T.buro && t < W[2].ms) {
    const v = Math.min(171, ((t - T.buro) / (T.encuentra - T.buro)) * 171);
    L.push(<Crono key="c3" t={t} at={T.buro + 0.1} out={W[2].ms - 0.5} x={1690} y={200} size={240} val={v} max={180} label={t >= T.encuentra ? "ENCONTRADO" : "EN LA RECÁMARA"} freeze={t >= T.encuentra} col={t >= T.encuentra ? COL.red : COL.amber} />);
  }
  // ===== F · avatar: credencial (32 años), foto vieja con uniforme, expedientes; latigazo a la recámara saqueada =====
  if (t >= W[2].ms + 0.05 && t < W[2].me + 0.1) {
    const k = ei(t, W[2].me - 0.25, W[2].me + 0.1);
    const av = (
      <AbsoluteFill>
        <Avatar t={t} />
        <Credencial t={t} at={T.treinta} out={T.cientos - 0.3} l1="POLICÍA · GUADALAJARA" big="32" l2="AÑOS DE POLICÍA, LOS ÚLTIMOS COMO COMANDANTE" l2at={T.treinta + 0.35} />
        <FotoVieja t={t} at={T.policia} out={T.cientos - 0.2} id="img_uniforme" x={1520} y={560} w={430} h={320} rot={7} caption="Guadalajara, '94" />
        <Expedientes t={t} at={T.cientos} out={W[2].me} x={1420} y={470} text="CIENTOS DE VECES" />
      </AbsoluteFill>
    );
    L.push(k > 0 ? <Whip key="wF" k={k} a={av} b={<Shot k="revuelto" t={t} a={W[2].me - 0.25} />} /> : <AbsoluteFill key="avF">{av}</AbsoluteFill>);
  }
  // ===== G · la recámara saqueada; rótulos; MANOS VACÍAS; la toma se cierra en la recámara 3D =====
  if (t >= W[2].me + 0.1 && t < T.porque + 0.55) {
    const shrink = ei(t, T.porque, T.porque + 0.5);
    const shot = (
      <AbsoluteFill>
        <Shot k="revuelto" t={t} a={W[2].me - 0.25} />
        <Tag t={t} at={T.tiro} x={1380} y={720} dx={140} dy={-110} text="TIRÓ LOS CAJONES" col={COL.amber} out={T.manos - 0.1} size={42} />
        <Tag t={t} at={T.rajo} x={640} y={640} dx={-160} dy={-150} text="RAJÓ EL COLCHÓN" col={COL.amber} out={T.manos - 0.1} size={42} />
        <AbsoluteFill style={{ background: "rgba(0,0,0,.35)", opacity: e(t, T.manos - 0.05, T.manos + 0.1) }} />
        <SelloTinta t={t} at={T.manos} out={T.porque + 0.6} x={960} y={540} text="MANOS VACÍAS" sub="SE FUE SIN NADA" col="#ff3b2f" size={130} />
      </AbsoluteFill>
    );
    if (shrink > 0) L.push(<World key="wG" t={t} thief={false} />);
    L.push(shrink > 0 ? <Portal key="pG" x={960} y={560} r={1 - shrink}>{shot}</Portal> : <AbsoluteFill key="g">{shot}</AbsoluteFill>);
  }
  // ===== H · vuelo al naranjo del patio; pin verde; "AQUÍ JAMÁS BUSCA"; portal al comandante levantando el naranjo =====
  if (t >= T.porque + 0.5 && t < T.jamas + 0.95) {
    const glow = e(t, T.lugar - 0.3, T.lugar + 0.3);
    L.push(<World key="wH" t={t} thief={false} naranjo={{ glow, lift: 0 }} />);
    const n = screenOf(t, PT.naranjo);
    L.push(<Tag key="tN" t={t} at={T.jamas} x={n.x} y={n.y} dx={260} dy={-160} text="AQUÍ JAMÁS BUSCA" sub="EL NARANJO DEL PATIO" col={COL.green} size={54} />);
    const pr = ei(t, T.jamas + 0.4, T.jamas + 0.9);
    if (pr > 0) L.push(<Portal key="pN" x={n.x} y={n.y} r={pr}><Shot k="maceta" t={t} a={T.jamas + 0.4} /></Portal>);
  }
  // ===== I · el comandante levanta el naranjo; empuje lateral al avatar =====
  if (t >= T.jamas + 0.9 && t < W[3].ms + 0.05) {
    const k = ei(t, W[3].ms - 0.3, W[3].ms + 0.05);
    const sh = <AbsoluteFill><Shot k="maceta" t={t} a={T.jamas + 0.4} /><Tag t={t} at={T.jamas + 1.0} x={980} y={760} dx={200} dy={-60} text="DOBLE FONDO" col={COL.green} size={44} /></AbsoluteFill>;
    L.push(k > 0 ? <Whip key="wI" k={k} a={sh} b={<Avatar t={t} />} /> : <AbsoluteFill key="i">{sh}</AbsoluteFill>);
  }
  // ===== J · avatar con el dial de 25; en "aquí en mi propia casa" el avatar se mete en el retrato de la sala =====
  const marco = (tt: number) => {
    const c = camAt(tt), a = project(c, new THREE.Vector3(0.6 - 0.48, 1.85 + 0.27, -2.44)), b = project(c, new THREE.Vector3(0.6 + 0.48, 1.85 - 0.27, -2.44));
    return { l: a.x, t: a.y, w: b.x - a.x, h: b.y - a.y };
  };
  if (t >= W[3].ms + 0.05 && t < W[3].me + 0.3) {
    const k = ei(t, T.aqui + 0.15, W[3].me + 0.3);
    const av = (
      <AbsoluteFill>
        <Avatar t={t} />
        <Dial25 t={t} at={T.v25} out={T.aqui - 0.3} x={1460} y={540} label="LUGARES" />
      </AbsoluteFill>
    );
    if (k <= 0) L.push(<AbsoluteFill key="avJ">{av}</AbsoluteFill>);
    else {
      const m = marco(t), r = { l: m.l * k, t: m.t * k, w: 1920 + (m.w - 1920) * k, h: 1080 + (m.h - 1080) * k };
      L.push(<World key="wJ" t={t} thief={false} />);
      L.push(<div key="avJm" style={{ position: "absolute", left: r.l, top: r.t, width: r.w, height: r.h, overflow: "hidden", boxShadow: `0 0 ${40 * k}px rgba(0,0,0,.5)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${r.w / 1920}, ${r.h / 1080})`, transformOrigin: "0 0" }}>{av}</div></div>);
    }
  }
  // ===== K · la casa entera: 25 pines verdes (contador); se apagan y nacen los 5 rojos; iris desde el buró =====
  if (t >= W[3].me + 0.3 && t < W[4].ms + 0.05) {
    L.push(<World key="wK" t={t} thief={false} />);
    const m = marco(t);
    if (m.w > 2) L.push(<Img key="mk" src={staticFile(P + "av_still.jpg")} style={{ position: "absolute", left: m.l, top: m.t, width: m.w, height: m.h, objectFit: "cover" }} />);
    const nG = 1 + GREENS.filter((_, i) => t >= G(GREENS[i], i, GREENS.length).at).length;
    L.push(<PinHUD key="hg" t={t} at={W[3].me + 0.2} out={T.pero} n={Math.min(25, nG)} of={25} text="DONDE EL RATERO NUNCA MIRA" col={COL.green} />);
    const nR = REDS.filter((_, i) => t >= T.cincoL + 0.2 + i * 0.22).length;
    L.push(<PinHUD key="hr" t={t} at={T.cincoL} out={W[4].ms - 0.3} n={nR} of={5} text="DONDE SIEMPRE BUSCA PRIMERO" col={COL.red} />);
    L.push(<Flash key="flP" t={t} at={T.pero} col="#ffb0a0" peak={0.35} />);
    const q = screenOf(t, REDS[0]), ir = ei(t, W[4].ms - 0.3, W[4].ms + 0.05);
    if (ir > 0) L.push(<Portal key="pK" x={q.x} y={q.y} r={ir}><Avatar t={t} /></Portal>);
  }
  // ===== L · avatar: la apuesta (ficha de póker) y los 5; placa de comandante con el nombre =====
  if (t >= W[4].ms + 0.05) {
    L.push(<Avatar key="avL" t={t} />);
    L.push(<Apuesta key="ap" t={t} at={T.apuesto} out={T.para - 0.3} x={1450} y={430} q="¿EL SUYO ESTÁ AHÍ?" qAt={T.uno} />);
    L.push(<Cinco key="c5" t={t} at={T.uno + 0.1} out={T.para - 0.3} items={["CAJITA FUERTE", "CONGELADOR", "CLÓSET", "COLCHÓN", "BURÓ"]} hi={t > T.ahorita ? 4 : -1} />);
    L.push(<Placa key="pl" t={t} at={T.para + 0.2} out={1e9} x={1480} y={470} name="RUBÉN ORTEGA" nameAt={T.ruben} rank="COMANDANTE RETIRADO" rankAt={T.retirado} />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
