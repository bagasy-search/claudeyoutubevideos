// rk29e · EL VIDEO ENTERO («your smart lock is talking all night»). Base = fotos de Ray haciendo lo que cuenta + Veo + el barrio 3D
// de noche (cámara que vuela de pose en pose). El avatar entra y sale con CORTE SECO. Un componente único por minuto (heroes.tsx),
// anclado a su frase (piezas.py → plan.json). Audio fuera de Remotion (encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import LTXOK from "./ltx_ok.json";
import { World as WorldRaw, makeCam, type Key, type WorldState } from "./barrio3d";
import { Avatar, Cover, Desc, Page, Shot, WIN } from "./parts";
import { COL, FONT, LowerThird, P, Vid, e, extrude } from "./lib";
import { CamaraMano } from "./CamaraMano";
import { HEROES } from "./heroes";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Cta = { cover?: number; page?: number; desc: number; end: number };
const PL = PLAN as unknown as { segs: Seg[]; cam: [number, number, string][]; ov: Ov[]; cta1: Cta; cta2: Cta; cta3: Cta; end: number; txt: { lower: [number, number] } };
export const END = PL.end;
const OK = new Set(LTXOK as string[]);

// ---------------- la cámara del barrio: una pose por tramo, vuela entre tramos seguidos y empuja despacio ----------------
type V3 = [number, number, number];
type Pose = { p: V3; l: V3; fov: number };
const POSE: Record<string, Pose> = {
  street: { p: [-1.5, 2.4, 12.5], l: [-6.2, 0.9, 2.0], fov: 40 }, carSide: { p: [-3.6, 1.6, 5.6], l: [-6.9, 0.9, 2.9], fov: 38 },
  visor: { p: [-4.6, 1.12, 2.75], l: [-7.25, 1.17, 2.8], fov: 34 }, window: { p: [-4.3, 1.3, 4.3], l: [-6.1, 0.95, 3.3], fov: 34 },
  console: { p: [-4.7, 1.12, 2.45], l: [-6.9, 1.2, 2.62], fov: 36 }, glove: { p: [-4.8, 1.05, 2.55], l: [-6.5, 0.85, 2.85], fov: 36 },
  drive: { p: [-7.2, 2.75, 0.75], l: [-6.4, 0.3, 4.8], fov: 62 }, gdoor: { p: [-4.6, 1.9, 6.8], l: [-7.2, 1.2, 0.2], fov: 40 },
  garIn: { p: [-5.9, 3.6, 1.9], l: [-7.2, 0.9, -1.1], fov: 46 }, panel: { p: [-6.7, 1.55, -0.15], l: [-5.62, 1.3, -0.55], fov: 30 },
  door: { p: [-8.2, 2.3, 0.0], l: [-5.6, 1.15, -1.5], fov: 40 }, motor: { p: [-6.0, 1.55, 0.1], l: [-7.0, 2.3, -1.6], fov: 38 },
  kitchen: { p: [-3.4, 2.1, 2.2], l: [-3.8, 1.0, -1.9], fov: 44 }, kids: { p: [6.6, 2.2, 2.6], l: [6.6, 0.5, -1.2], fov: 42 },
  over: { p: [-1.0, 7.0, 9.5], l: [-1.5, 0.4, -0.6], fov: 44 }, overG: { p: [-3.6, 5.2, 6.8], l: [-5.8, 0.6, 0.0], fov: 46 },
};
const push = (q: Pose, k: number): Pose => ({ p: q.p.map((v, i) => v + (q.l[i] - v) * k) as V3, l: q.l, fov: q.fov - 2 });
const KEYS: Key[] = [];
{
  let prev: Pose | null = null, prevEnd = -9;
  PL.cam.forEach(([a, b, name]) => {
    const q = POSE[name] ?? POSE.over;
    // tramo pegado al anterior: vuela (arco); si no, arranca ya en su pose
    const fly = prev && a - prevEnd < 0.3 && b - a > 2.4 ? 1.1 : 0;
    if (fly && prev) KEYS.push({ t: a, ...prev });
    KEYS.push({ t: a + fly, ...q, arc: 0.03 });
    prev = push(q, 0.06 + Math.min(0.12, (b - a) * 0.012)); prevEnd = b;
    KEYS.push({ t: b - 0.01, ...prev });
  });
  if (!KEYS.length) KEYS.push({ t: 0, ...POSE.over });
}
const CAM = makeCam(KEYS);
// el barrio de noche, quieto y vivo: faroles, la luz del garaje, el control en el parasol que brilla apenas
const ST: WorldState = { day: 0, lamps: 0.35, gLight: 0.4, gLift: 0, jam: 0, lock: 0, dbolt: 0, door: 0, learn: 0, plug: 0, motorLight: 0, glove: 0, broken: 0, remote: 1, rGlow: 0,
  console: 0, carLights: 0, loot: 0, thief: 0, thiefAt: [0, 0, 0], thiefYaw: 0, reach: 0, flash: 0, flashAt: [0, 0, 0], flashFrom: [0, 0, 0], route: 0, routeCol: COL.red, heat: {}, good: {} };
const World: React.FC<{ t: number }> = ({ t }) => <AbsoluteFill><WorldRaw t={t} camAt={CAM.camAt} st={ST} /></AbsoluteFill>;

// ---------------- la base: foto/Veo del tramo o el barrio ----------------
const base = (t: number, i: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, b, , id] = g;
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  // Ken-Burns por plano: sentido y velocidad salen del índice (nunca el mismo zoom al centro)
  const k = PL.segs.indexOf(g), zin = k % 2 === 0, d = b - a, amt = Math.min(0.1, 0.028 * d);
  return <Shot k={id} t={t} a={a} dur={d + 0.5} z={zin ? [1.03, 1.03 + amt] : [1.03 + amt, 1.03]} ox={((k * 7) % 5 - 2) * 14} oy={((k * 3) % 3 - 1) * 10} />;
};
const avNow = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
const Stage: React.FC<{ t: number }> = ({ t }) => (avNow(t) ? <Avatar t={t} /> : <>{base(t, 0)}</>);

// ---------------- CTA: la guía (portada) → página real → la descripción + QR grande ----------------
const QR: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at, at + 0.45) * (1 - e(t, out, out + 0.35));
  if (k <= 0.01) return null;
  return <div style={{ position: "absolute", right: 120, top: 250, opacity: k, transform: `translateY(${(1 - k) * 40}px)`, fontFamily: FONT, textAlign: "center" }}>
    <div style={{ padding: 22, background: "#fff", borderRadius: 22, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}><Img src={staticFile(P + "qr.png")} style={{ width: 380, height: 380, display: "block", imageRendering: "pixelated" }} /></div>
    <div style={{ marginTop: 18, fontWeight: 900, fontSize: 36, color: "#ffd60a", textShadow: extrude(4, "#5a4500") }}>THE THOUSAND DOLLAR AFTERNOON</div>
  </div>;
};
const CTA: React.FC<{ t: number; c: Cta; pg?: number; box?: [number, number, number, number]; hl?: string }> = ({ t, c, pg, box, hl }) => <>
  {c.cover !== undefined && <Cover t={t} at={c.cover} out={(c.page ?? c.desc) - 0.2} x={1340} y={560} w={470} />}
  {c.page !== undefined && pg && box && <Page t={t} at={c.page} out={c.desc - 0.2} n={pg} hl={hl ?? ""} box={box} />}
  <Desc t={t} at={c.desc} out={c.end} x={760} />
  <QR t={t} at={c.desc + 0.2} out={c.end} />
</>;
// CTA corto al minuto 1 (sin voz de la guía): portada chica en la esquina + «first line of the description»
const MiniCta: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at, at + 0.5) * (1 - e(t, out, out + 0.4));
  if (k <= 0.01) return null;
  return <div style={{ position: "absolute", left: 70, bottom: 90, display: "flex", alignItems: "center", gap: 26, opacity: k, transform: `translateX(${(1 - k) * -60}px)`, fontFamily: FONT }}>
    <div style={{ perspective: 900 }}><Img src={staticFile(P + "guia_cover.jpg")} style={{ width: 150, height: 212, borderRadius: 6, transform: `rotateY(${18 - 10 * k}deg)`, boxShadow: "-8px 0 0 #c9c2b2, 0 30px 60px rgba(0,0,0,.6)" }} /></div>
    <div><div style={{ fontWeight: 900, fontSize: 40, color: "#ffd60a", textShadow: extrude(4, "#5a4500") }}>THE THOUSAND DOLLAR AFTERNOON</div>
      <div style={{ fontWeight: 800, fontSize: 28, color: "#fff", textShadow: "0 3px 12px #000", marginTop: 6 }}>LINK IN THE FIRST LINE OF THE DESCRIPTION</div></div>
  </div>;
};

// ---------------- los componentes únicos: sólo fuera del avatar (corte seco al entrar/salir él) ----------------
// el fondo de cada componente = la foto del tramo más cercano (desenfocada en Stage); zoom para los que quedan chicos
const ZOOM: Record<string, number> = {};
const fotoCerca = (t: number) => { let best = "", d = 1e9; for (const [a, b, , id] of PL.segs) if (!id.startsWith("v")) { const x = t < a ? a - t : t > b ? t - b : 0; if (x < d) { d = x; best = id; } } return best; };
const OV = PL.ov.map((o) => ({ ...o, bg: o.bg ?? fotoCerca(o.at), zoom: ZOOM[o.k] ?? 1 }));
// el avatar corta en seco y el componente se CONGELA mientras él habla: al volver sigue donde quedó (no se pierde la mitad de la pieza)
const avIn = (a: number, b: number) => WIN.reduce((s, w) => s + Math.max(0, Math.min(b, w.me) - Math.max(a, w.ms)), 0);
const OVX = OV.map((o, i) => { const lim = (OV[i + 1]?.at ?? 1e9) - 0.6; let end = o.out; for (let k = 0; k < 4; k++) end = Math.min(lim, o.out + avIn(o.at, end)); return { ...o, end }; });
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{OVX.map((o, i) => {
  const C = HEROES[o.k];
  if (!C || t < o.at - 0.1 || t > o.end + 0.9 || avNow(t)) return null;
  return <C key={i} t={t - avIn(o.at, t)} h={o} />;
})}</>;

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <Heroes t={t} />
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="RAY KESSLER" l2="LOCKSMITH · 35 YEARS" l2at={PL.txt.lower[0] + 1} />
    <MiniCta t={t} at={61.5} out={67.5} />
    <CTA t={t} c={PL.cta1} pg={52} box={[63, 112, 201, 36]} hl="THE SHOPPING LIST" />
    <CTA t={t} c={PL.cta2} pg={53} box={[63, 112, 296, 36]} hl="THE TEN-MINUTE DOOR TEST" />
    <CTA t={t} c={PL.cta3} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
