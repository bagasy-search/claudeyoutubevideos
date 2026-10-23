// lenny02 · MINUTO 1 (0 → 84,5 s) a mano, vara gary01: un solo hilo visual, sin cortes secos.
// avatar → (zoom) → el inodoro de vidrio que se llena de agua turbia → (luz) → el gancho real: el agua al ras → avatar (el sopapo)
// → (zoom) → sifón en corte: el sopapo plano que no sella → el gancho: chapoteo → las medias → el teléfono y el reloj de las 9
// → avatar (¿cuánto?) → la factura nocturna sobre el inodoro a oscuras → el piso y la cera (sacar el inodoro) → el tapón
// → avatar (20 minutos) → tres tarjetas → avatar (Lenny, 45 años) → lo que sacó de los inodoros → Lenny con el auger
// → la cámara se mete bajo el borde: los agujeros tapados de sarro → avatar (la razón real). Audio fuera de Remotion.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BigNum, COL, Card3D, Flash, FONT, LowerThird, Tag, e, ei, extrude, s, spr } from "../kits/yanqui3d/lib";
import { makeAt, Stamp } from "../kits/yanqui3d/engine";
import { Words } from "../kits/yanqui3d/pieces";
import { project, K, PT } from "./toilet3d";
import { CAM, kf } from "./cams";
import { W3, NightBill, WallClock, Banner, Take } from "./bits";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

export const T_MIN1 = 84.5;
export const MIN1_FRAMES = Math.round(T_MIN1 * 30);
const at = makeAt(CAPS as [string, number][]);

// ---------- avatar: ventanas pagadas del reel (preroll 10 cuadros) ----------
const WIN = (AVW as number[][]).map(([ms, me, off]) => ({ ms, me, off }));
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  // sin reel todavía (stills de control): la foto de referencia en su lugar
  const face = !AVAIL.reel ? [<Img key="st" src={staticFile("lenny02/av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />] : WIN.filter((w) => t > w.ms - 1 && t < w.me + 1.2).map((w) => (
    <Sequence key={w.ms} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile("lenny02/reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  ));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- anclas ----------
const A = {
  flushed: at("flushed"), coming: at("coming up"), brown: at("brown"), climbing: at("climbing"), handle: at("handle"), inch: at("an inch"), half: at("half an inch"),
  plunger: at("grab the plunger"), push1: at("push", 18), push2: at("push", 20), nothing: at("nothing happens"), sloshes: at("sloshes"), socks: at("socks"), thinking: at("thinking"),
  nine: at("9 o'clock"), cost: at("cost me"), tell: at("I'll tell you"), night: at("at night", 36), d150: at("$150"), d300: at("$300."), pull: at("pull the toilet"), more: at("be more"),
  calls: at("those calls"), clogs: at("clogs the homeowner"), m20: at("20 minutes"), three: at("three things"), right: at("The right plunger"), fails: at("plunger fails"), why: at("why that toilet"),
  nobody: at("almost nobody"), name: at("My name is Lenny"), chicago: at("Chicago"), toys: at("toys"), brushes: at("toothbrushes"), keys: at("car keys"), show: at("I'll show you"),
  step: at("step by step"), order: at("in order"), holes: at("little holes"), rim: at("rim of your"), real: at("real reason"),
};

// cámaras de los tramos 3D
const KB: K[] = [{ t: 3.3, ...CAM.wide2 }, { t: 7.4, ...CAM.wide, arc: 0.15 }, { t: 11.7, ...CAM.bowl }];
const KE: K[] = kf(19.6, 22.7, CAM.bowl, CAM.trap);
const KJ: K[] = kf(35.0, 45.8, CAM.wide2, CAM.wide);
const KK: K[] = kf(A.pull - 0.4, 45.8, CAM.wide, CAM.floor);
const KL: K[] = kf(45.6, 48.4, CAM.trap, CAM.crest);
const KN: K[] = kf(51.6, 64.4, CAM.wide, CAM.wide2);
const KR: K[] = [{ t: 77.2, ...CAM.bowl }, { t: 78.6, ...CAM.rim }, { t: 80.6, ...CAM.under }];

const whip = (t: number, a: number, b: number) => { const wp = ei(t, a, b); return { wp, mb: Math.sin(wp * Math.PI) * 40 }; };

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-3,5 · avatar; zoom hacia el inodoro =====
  if (t < 3.95) {
    const z = ei(t, 3.1, 3.6);
    L.push(<AbsoluteFill key="avA" style={{ transformOrigin: "960px 760px", transform: `scale(${1 + z * z * 5})`, opacity: 1 - e(t, 3.4, 3.6), filter: z > 0.05 ? `blur(${z * 16}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Tag key="tA" t={t} at={A.flushed} x={1480} y={700} dx={-120} dy={-150} text="YOU JUST FLUSHED" col={COL.amber} out={3.1} />);
    if (t > 3.2) L.unshift(<AbsoluteFill key="Ab" style={{ transform: `scale(${1.3 - 0.3 * ei(t, 3.2, 3.95)})` }}><W3 t={Math.max(t, 3.3)} kf={KB} fx={{ bowl: 0.3, dirty: 0.2, paper: 0.6 }} /></AbsoluteFill>);
  }
  // ===== B · 3,5-11,9 · el inodoro de vidrio: el agua no baja, SUBE; turbia; trepa =====
  if (t >= 3.5 && t < 12.0) {
    const lv = 0.3 + 0.66 * ei(t, 4.0, 11.6), lt = e(t, 11.35, 11.9);
    const bw = project(t, PT.bowl, KB), rf = project(t, PT.rimF, KB);
    L.push(<AbsoluteFill key="B"><W3 t={t} kf={KB} fx={{ bowl: lv, dirty: 0.2 + 0.7 * e(t, A.brown - 0.5, A.brown + 0.8), paper: 1, clog: 1 }} />
      <Words t={t} items={[{ at: 3.9, txt: "NOT GOING DOWN", col: COL.dim }, { at: A.coming, txt: "COMING UP", col: COL.red }]} out={A.brown - 0.4} y={150} size={92} />
      <Tag t={t} at={A.brown} x={bw.x} y={bw.y} dx={-260} dy={-120} text="BROWN & CLOUDY" col={COL.amber} out={11.2} size={42} />
      <Tag t={t} at={A.climbing} x={rf.x} y={rf.y} dx={-200} dy={-130} text="CLIMBING" col={COL.red} out={11.2} size={44} />
    </AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Bl" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,236,200,${0.9 * Math.sin(Math.PI * lt)}), transparent 75%)`, mixBlendMode: "screen" }} />);
  }
  // ===== C · 11,7-15,2 · el gancho real: la mano en la manija, el agua al ras =====
  if (t >= 11.6 && t < 15.45) {
    const { wp, mb } = whip(t, 14.85, 15.25);
    L.push(<AbsoluteFill key="C" style={{ opacity: e(t, 11.6, 11.85), transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Take t={t} k="gancho" alt="n_rise" a={11.6} need={3.6} rate={1} />
      <Banner t={t} at={A.inch} out={14.7} text="1 INCH FROM THE RIM" col={COL.red} y={880} size={72} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avC" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 15.2)} /></AbsoluteFill>);
  }
  // ===== D · 15,2-20,1 · avatar: "½ pulgada", agarrás el sopapo; zoom al sifón =====
  if (t >= 15.2 && t < 20.4) {
    const z = ei(t, 19.65, 20.15);
    L.push(<AbsoluteFill key="D" style={{ transformOrigin: "960px 820px", transform: `scale(${1 + z * z * 5})`, opacity: 1 - e(t, 19.9, 20.15), filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}>
      <Avatar t={t} />
      <Tag t={t} at={A.half} x={1480} y={760} dx={-80} dy={-140} text="½ INCH" col={COL.red} out={A.plunger - 0.2} />
      <Tag t={t} at={A.plunger + 0.3} x={460} y={700} dx={120} dy={-140} text="THE PLUNGER" col={COL.amber} out={19.6} />
    </AbsoluteFill>);
    if (t > 19.65) L.unshift(<AbsoluteFill key="De" style={{ transform: `scale(${1.3 - 0.3 * ei(t, 19.65, 20.4)})` }}><W3 t={Math.max(t, 19.7)} kf={KE} fx={{ bowl: 0.96, dirty: 0.9, paper: 1, clog: 1, flat: 1, pump: 1 }} /></AbsoluteFill>);
  }
  // ===== E · 20,1-22,6 · sifón en corte: el sopapo plano bombea aire, nada pasa =====
  if (t >= 20.1 && t < 22.95) {
    const { wp, mb } = whip(t, 22.5, 22.9), cr = project(t, PT.crest, KE);
    L.push(<AbsoluteFill key="E" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <W3 t={t} kf={KE} fx={{ bowl: 0.96, dirty: 0.9, paper: 1, clog: 1, flat: 1, pump: 1 }} />
      <Words t={t} items={[{ at: A.push1, txt: "PUSH…", col: COL.ink }, { at: A.push2, txt: "PUSH…", col: COL.ink }]} out={21.0} y={140} size={100} />
      <Tag t={t} at={A.nothing} x={cr.x} y={cr.y} dx={220} dy={-140} text="NOTHING HAPPENS" col={COL.red} out={22.4} size={42} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="Eg" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Take t={t} k="gancho" alt="n_plunge" a={22.5} from={5} need={3} rate={1} /></AbsoluteFill>);
  }
  // ===== F · 22,6-25,5 · el gancho: chapoteo =====
  if (t >= 22.6 && t < 25.75) {
    const { wp, mb } = whip(t, 25.35, 25.75);
    L.push(<AbsoluteFill key="F" style={{ transform: `translateY(${-wp * 1080}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Take t={t} k="gancho" alt="n_plunge" a={22.5} from={5} need={3} rate={1} />
      <Tag t={t} at={A.sloshes} x={980} y={560} dx={220} dy={-150} text="BACK AND FORTH" col={COL.ice} out={25.2} size={40} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="Fs" style={{ transform: `translateY(${(1 - wp) * 1080}px)` }}><Take t={t} k="n_socks" a={25.35} need={3.2} /></AbsoluteFill>);
  }
  // ===== G · 25,5-28,3 · las medias que se mojan =====
  if (t >= 25.7 && t < A.thinking + 0.3) {
    const lt = e(t, A.thinking - 0.2, A.thinking + 0.3);
    L.push(<AbsoluteFill key="G"><Take t={t} k="n_socks" a={25.35} need={3.2} />
      <Tag t={t} at={A.socks} x={960} y={720} dx={240} dy={-170} text="SOCKS GETTING WET" col={COL.ice} out={A.thinking - 0.2} size={40} />
    </AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Gp" style={{ opacity: lt }}><Take t={t} k="n_phone" a={A.thinking - 0.2} need={31.1 - A.thinking} /></AbsoluteFill>);
  }
  // ===== H · 28,3-31,0 · el teléfono a las 9 de la noche =====
  if (t >= A.thinking + 0.25 && t < 31.3) {
    const lt = e(t, 30.85, 31.2);
    L.push(<AbsoluteFill key="H"><Take t={t} k="n_phone" a={A.thinking - 0.2} need={31.1 - A.thinking} />
      <WallClock t={t} at={A.nine - 0.6} out={30.8} x={1480} y={420} />
      <Banner t={t} at={A.thinking + 0.3} out={30.8} text="WHO DO I CALL?" y={860} size={74} />
    </AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Hl" style={{ opacity: lt }}><Avatar t={Math.max(t, 31.03)} /></AbsoluteFill>);
  }
  // ===== I · 31,0-35,4 · avatar: "¿cuánto me va a costar?" — "te digo cuánto" =====
  if (t >= 31.03 && t < 35.75) {
    const { wp, mb } = whip(t, 35.3, 35.7);
    L.push(<AbsoluteFill key="I" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Avatar t={t} />
      <Tag t={t} at={A.cost - 0.4} x={1460} y={420} dx={-90} dy={-140} text="HOW MUCH?" col={COL.amber} out={A.tell - 0.1} size={48} />
      <Stamp t={t} at={A.tell + 0.2} text="HERE'S WHAT IT COSTS" x={1320} y={830} out={35.2} rot={-6} size={64} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="Ij" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><W3 t={Math.max(t, 35.3)} kf={KJ} fx={{ bowl: 0.96, dirty: 0.9, paper: 1, clog: 1 }} night={0.7} blur={8} dark={0.35} /></AbsoluteFill>);
  }
  // ===== J · 35,4-42,0 · el inodoro a oscuras y la factura nocturna: $150 → $300 =====
  if (t >= 35.4 && t < A.pull + 0.1) {
    L.push(<AbsoluteFill key="J"><W3 t={t} kf={KJ} fx={{ bowl: 0.96, dirty: 0.9, paper: 1, clog: 1 }} night={0.7} blur={8} dark={0.35} />
      <Tag t={t} at={A.night} x={520} y={300} dx={-60} dy={-110} text="A NIGHT CALL" col={COL.ice} out={41.6} size={42} />
      <NightBill t={t} at={A.d150 - 0.4} at2={A.d300 - 0.3} more={A.pull + 0.1} out={45.4} x={1300} y={560} />
    </AbsoluteFill>);
  }
  // ===== K · 41,9-45,8 · sacar el inodoro del piso: la cera, más plata =====
  if (t >= A.pull - 0.4 && t < 45.95) {
    const lt = e(t, A.pull - 0.4, A.pull + 0.1), wx = project(t, PT.wax, KK), { wp, mb } = whip(t, 45.5, 45.9);
    L.push(<AbsoluteFill key="K" style={{ opacity: lt, transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <W3 t={t} kf={KK} fx={{ bowl: 0.96, dirty: 0.9, clog: 1, wax: 1 }} />
      <Tag t={t} at={A.pull + 0.4} x={wx.x} y={wx.y} dx={-240} dy={-150} text="OFF THE FLOOR" col={COL.amber} out={45.3} size={42} />
      <BigNum t={t} at={A.more} text="MORE $" x={1420} y={330} size={150} col="#ff8a7a" edge="#5a1f1f" out={45.4} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="Kl" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><W3 t={Math.max(t, 45.6)} kf={KL} fx={{ bowl: 0.6, dirty: 0.6, clog: 1 }} /></AbsoluteFill>);
  }
  if (t >= A.pull - 0.4 && t < 45.6) L.push(<NightBill key="Jb" t={t} at={A.d150 - 0.4} at2={A.d300 - 0.3} more={A.pull + 0.1} out={44.9} x={1300} y={720} />);
  // ===== L · 45,8-48,2 · el tapón en la cresta del sifón: "la mayoría de esas llamadas" =====
  if (t >= 45.8 && t < 48.5) {
    const cr = project(t, PT.crest, KL), lt = e(t, 48.0, 48.4);
    L.push(<AbsoluteFill key="L"><W3 t={t} kf={KL} fx={{ bowl: 0.6, dirty: 0.6, clog: 1 }} />
      <Tag t={t} at={A.calls} x={cr.x} y={cr.y} dx={-260} dy={-160} text="MOST OF THOSE CALLS" col={COL.ice} out={47.9} size={40} />
    </AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Ll" style={{ opacity: lt }}><Avatar t={Math.max(t, 48.16)} /></AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Lll" style={{ background: `radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,236,200,${0.85 * Math.sin(Math.PI * lt)}), transparent 80%)`, mixBlendMode: "screen" }} />);
  }
  // ===== M · 48,2-51,9 · avatar: "un tapón que podías sacar en 20 minutos" =====
  if (t >= 48.16 && t < 52.3) {
    const z = ei(t, 51.75, 52.25);
    L.push(<AbsoluteFill key="M" style={{ transformOrigin: "960px 560px", transform: `scale(${1 + z * z * 5})`, opacity: 1 - e(t, 52.0, 52.25), filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}>
      <Avatar t={t} />
      <Tag t={t} at={A.clogs} x={540} y={420} dx={90} dy={-140} text="YOU COULD CLEAR IT" col="#5ee38f" out={51.6} size={42} />
      <BigNum t={t} at={A.m20} text="20 MIN" x={1450} y={760} size={170} col="#9df0b4" edge="#1f5a36" out={51.6} />
    </AbsoluteFill>);
  }
  // ===== N · 51,9-64,2 · tres cosas: tres tarjetas sobre el baño borroso =====
  if (t >= 51.8 && t < 64.5) {
    const zt = ei(t, 63.7, 64.25);
    L.push(<AbsoluteFill key="Nbg" style={{ filter: "blur(10px) brightness(.45)", transform: "scale(1.05)" }}><W3 t={t} kf={KN} fx={{ bowl: 0.5, dirty: 0.4, scale: 0.7 }} /></AbsoluteFill>);
    L.push(<Flash key="flN" t={t} at={51.95} peak={0.55} />);
    L.push(<div key="nt" style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, letterSpacing: 12, color: COL.ink, textShadow: extrude(8, "#000"), opacity: e(t, A.three - 0.2, A.three + 0.1) * (1 - zt) }}>THREE THINGS</div>);
    const cards = [{ id: "img_s15", a: A.right, x: 120, lab: "THE RIGHT PLUNGER" }, { id: "img_s17", a: A.fails - 0.4, x: 700, lab: "WHEN IT FAILS" }, { id: "img_s42", a: A.why, x: 1280, lab: "WHY IT KEEPS CLOGGING" }];
    cards.forEach((c, i) => {
      const k = spr(t, c.a, 1), last = i === 2;
      L.push(<Card3D key={"cd" + i} id={c.id} x={c.x} y={330} w={520} h={340} ry={(1 - Math.min(1, k)) * -80 + (i - 1) * 8 + 4 * Math.sin(t * 0.6 + i)} rx={6}
        z={(1 - Math.min(1, k)) * -900 + (last ? zt * 1700 : -zt * 400)} o={e(t, c.a, c.a + 0.08) * (last ? 1 - e(t, 64.0, 64.25) : 1 - zt)} label={c.lab} labelCol={last ? COL.amber : COL.ink} />);
    });
    L.push(<Stamp key="nb" t={t} at={A.nobody} text="NOBODY TELLS YOU" x={1540} y={800} out={63.6} rot={-7} size={58} />);
    if (zt > 0.5) L.push(<AbsoluteFill key="Nz" style={{ opacity: e(t, 64.0, 64.25) }}><Avatar t={Math.max(t, 64.23)} /></AbsoluteFill>);
  }
  // ===== O · 64,2-69,0 · avatar: Lenny, plomero en Chicago 45 años =====
  if (t >= 64.23 && t < 69.3) {
    const { wp, mb } = whip(t, 68.9, 69.3);
    L.push(<AbsoluteFill key="O" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={t} />
      <LowerThird t={t} at={A.name + 0.1} out={68.7} name="LENNY" l2="PLUMBER · CHICAGO · 45 YEARS" l2at={A.chicago - 0.3} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="Of" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Take t={t} k="n_found" a={68.9} need={4.4} /></AbsoluteFill>);
  }
  // ===== P · 69,0-73,3 · lo que sacó de los inodoros =====
  if (t >= 69.0 && t < A.show + 0.15) {
    const { wp, mb } = whip(t, A.show - 0.3, A.show + 0.1);
    L.push(<AbsoluteFill key="P" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Take t={t} k="n_found" a={68.9} need={4.4} />
      <Tag t={t} at={A.toys} x={560} y={430} dx={-120} dy={-140} text="TOYS" col={COL.amber} out={A.show - 0.4} />
      <Tag t={t} at={A.brushes} x={760} y={640} dx={-80} dy={150} text="TOOTHBRUSHES" col={COL.ice} out={A.show - 0.4} />
      <Tag t={t} at={A.keys} x={1060} y={520} dx={200} dy={-150} text="CAR KEYS" col={COL.ink} out={A.show - 0.4} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="Pg" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Take t={t} k="g_intro" a={A.show - 0.3} need={77.5 - A.show} /></AbsoluteFill>);
  }
  // ===== Q · 73,3-77,4 · Lenny con el auger en la puerta del baño: paso a paso, en orden =====
  if (t >= A.show && t < 77.65) {
    const z = ei(t, 77.0, 77.6);
    L.push(<AbsoluteFill key="Q" style={{ transformOrigin: "1000px 640px", transform: `scale(${1 + z * z * 5})`, opacity: 1 - e(t, 77.3, 77.6), filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}>
      <Take t={t} k="g_intro" a={A.show - 0.3} need={77.5 - A.show} />
      <Words t={t} items={[{ at: A.step, txt: "STEP BY STEP" }, { at: A.order, txt: "IN ORDER", col: COL.amber }]} out={76.9} y={150} size={84} />
    </AbsoluteFill>);
    if (t > 77.0) L.unshift(<AbsoluteFill key="Qr" style={{ transform: `scale(${1.3 - 0.3 * ei(t, 77.0, 77.65)})` }}><W3 t={Math.max(t, 77.2)} kf={KR} fx={{ bowl: 0.2, scale: 0.85, jets: 0.5, jetScale: 0.7 }} /></AbsoluteFill>);
  }
  // ===== R · 77,4-80,5 · la cámara se mete bajo el borde: los agujeros tapados de sarro =====
  if (t >= 77.5 && t < 80.75) {
    const lt = e(t, 80.3, 80.7), h = project(t, [PT.rimF[0] + 0.05, PT.rimF[1] - 0.02, 0.06], KR);
    L.push(<AbsoluteFill key="R"><W3 t={t} kf={KR} fx={{ bowl: 0.2, scale: 0.85, jets: 0.5, jetScale: 0.7 }} />
      <Tag t={t} at={A.holes} x={Math.min(1700, Math.max(200, h.x))} y={Math.min(950, Math.max(150, h.y))} dx={200} dy={150} text="LITTLE HOLES UNDER THE RIM" col={COL.amber} out={80.2} size={42} />
    </AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Rl" style={{ opacity: lt }}><Avatar t={Math.max(t, 80.45)} /></AbsoluteFill>);
  }
  // ===== S · 80,5-84,5 · avatar: la razón real =====
  if (t >= 80.45) {
    L.push(<AbsoluteFill key="S"><Avatar t={t} />
      <Stamp t={t} at={A.real} text="THE REAL REASON" x={1400} y={800} out={84.3} rot={-6} size={72} />
    </AbsoluteFill>);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
