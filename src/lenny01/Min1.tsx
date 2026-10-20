// lenny01 · MINUTO 1 (0 → 76,6 s) a mano, vara gary01: un solo hilo visual, sin cortes secos.
// avatar → (zoom a través de la pileta) → la pileta real llena → (luz) → pileta 3D que se llena → (latigazo) → avatar que SE INUNDA
// → el agua tapa todo y la cámara se zambulle por el desagüe al sifón en corte (gluglú) → factura de $500 → avatar (la hija)
// → (portal desde el desagüe) → la hija con la botella → la alacena → la pileta que traga + reloj 15:00 → avatar con fichas
// → tres tarjetas (bicarbonato, sal, pava) → (zoom a través de la tarjeta) → Lenny en su taller + rótulo → avatar
// → (zoom) → recorrido 3D por el caño: 10¢ contra el caño roto. Audio fuera de Remotion (la voz se mezcla en encfin).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BigNum, COL, Card3D, Chips, DrawX, Flash, FONT, LowerThird, Portal, Tag, e, ei, extrude, s, spr } from "../kits/yanqui3d/lib";
import { makeAt, Stamp } from "../kits/yanqui3d/engine";
import { Words } from "../kits/yanqui3d/pieces";
import { project, K } from "./pipe3d";
import { CAM, kf, kf3 } from "./cams";
import { W3, GreyWater, Clock15, Invoice, Banner, Take } from "./bits";
import CAPS from "./caps.json";
import AVW from "./avwin.json";

export const T_MIN1 = 76.6;
export const MIN1_FRAMES = Math.round(T_MIN1 * 30);
const at = makeAt(CAPS as [string, number][]);

// ---------- avatar: ventanas pagadas del reel (preroll 10 cuadros) ----------
const WIN = (AVW as number[][]).filter((w) => w[0] < T_MIN1).map(([ms, me, off]) => ({ ms, me, off }));
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile("lenny01/reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  ));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------- anclas ----------
const A = {
  supper: at("after supper"), gray: at("gray", 4), greasy: at("greasy", 4), bits: at("bits of food", 4), faucet: at("faucet", 10), hoping: at("hoping", 10),
  climbing: at("climbing", 13), rim: at("rim", 14), hear: at("you hear it", 16), gurgle: at("gurgle", 17), floor: at("under the floor", 17), choking: at("choking", 19),
  thought: at("the only thought", 22), d500: at("$500", 24), most: at("of the time", 28), month: at("Last month", 30), daughter: at("daughter", 30), exact: at("exact sink", 31),
  bottle: at("bottle of drain cleaner", 34), putDown: at("put that down", 37), pantry: at("pantry", 39), oneCup: at("one cup", 38), fifteen: at("fifteen minutes", 40), later: at("later", 44), brand: at("brand new", 45),
  noChem: at("No chemicals", 48), noSnake: at("no snake", 48), noCall: at("no service call", 48), just: at("Just one cup", 52), two: at("two things", 52), kettle: at("kettle", 53),
  name: at("My name is Lenny", 56), chicago: at("Chicago", 57), years: at("45 years", 58), under: at("under more sinks", 61), still: at("still use", 63),
  show: at("let me show you", 66), step: at("step by step", 67), times: at("the times", 68), mistakes: at("the mistakes", 68), cents: at("10-cent", 70), broken: at("broken pipe", 70),
};

// cámaras de los tramos 3D
const KC: K[] = kf(9.5, 13.9, CAM.wide2, CAM.basin);
const KE: K[] = [
  { t: A.hear + 0.2, ...CAM.surf }, { t: A.hear + 1.3, ...CAM.drain }, { t: A.gurgle + 0.4, ...CAM.trapL }, { t: 21.9, ...CAM.bend }, { t: 23.5, ...CAM.trap },
];
const KF_: K[] = kf(23.2, 30.8, CAM.trap, CAM.wide);
const KL: K[] = kf(50.0, 56.8, CAM.under, CAM.wide2);
const KO: K[] = [
  { t: 67.1, ...CAM.wide }, { t: 69.4, ...CAM.under }, { t: 71.6, ...CAM.trap }, { t: 73.6, ...CAM.nut }, { t: 76.7, ...CAM.trapL },
];

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-3,5 · avatar; zoom a través de la pileta (abajo) =====
  if (t < 3.95) {
    const z = ei(t, 3.15, 3.6);
    L.push(<AbsoluteFill key="avA" style={{ transformOrigin: "960px 980px", transform: `scale(${1 + z * z * 5})`, opacity: 1 - e(t, 3.4, 3.6), filter: z > 0.05 ? `blur(${z * 16}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Tag key="tA" t={t} at={A.supper} x={1500} y={760} dx={-120} dy={-150} text="AFTER SUPPER" col={COL.amber} out={3.1} />);
    if (t > 3.3) L.unshift(<AbsoluteFill key="sinkA" style={{ transform: `scale(${1.35 - 0.3 * ei(t, 3.3, 3.95)})` }}><Take t={t} k="n_sink" a={3.3} need={6.4} /></AbsoluteFill>);
  }
  // ===== B · 3,5-9,7 · la pileta real llena; rótulos por palabra =====
  if (t >= 3.6 && t < 10.1) {
    const lt = e(t, 9.35, 9.95);
    L.push(<AbsoluteFill key="B"><Take t={t} k="n_sink" a={3.3} need={6.4} z={[1.05, 1.13]} />
      <Tag t={t} at={A.gray} x={760} y={430} dx={-170} dy={-110} text="GRAY" out={9.2} size={44} />
      <Tag t={t} at={A.greasy} x={1140} y={500} dx={170} dy={-120} text="GREASY" col={COL.amber} out={9.2} size={44} />
      <Tag t={t} at={A.bits} x={980} y={610} dx={190} dy={110} text="FOOD BITS" out={9.2} size={40} />
    </AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Bl" style={{ opacity: e(t, 9.55, 9.95) }}><W3 t={Math.max(9.5, t)} kf={KC} fx={{ basin: 0.55, grease: 0.7, scum: 0.5 }} /></AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Bll" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,236,200,${0.9 * Math.sin(Math.PI * lt)}), transparent 75%)`, mixBlendMode: "screen" }} />);
  }
  // ===== C · 9,9-13,9 · la pileta 3D en corte se llena; latigazo al avatar =====
  if (t >= 9.95 && t < 14.0) {
    const lv = 0.55 + 0.42 * e(t, A.faucet, A.rim);
    const wp = ei(t, 13.55, 13.95), mb = Math.sin(wp * Math.PI) * 40;
    const rim = project(t, [-0.47, 0.9, 0], KC), dr = project(t, [-0.25, 0.7, 0], KC);
    L.push(<AbsoluteFill key="C" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <W3 t={t} kf={KC} fx={{ basin: lv, grease: 0.7, scum: 0.5, debris: 0.8 }} />
      <Tag t={t} at={A.faucet} x={rim.x + 260} y={rim.y - 160} dx={150} dy={-80} text="A LITTLE MORE…" sub="HOPING" col={COL.ice} out={13.4} size={40} />
      <Tag t={t} at={11.4} x={dr.x} y={dr.y} dx={-220} dy={120} text="THE DRAIN" col={COL.dim} out={13.4} size={36} />
      <Banner t={t} at={A.climbing} out={13.5} text="IT'S CLIMBING" col={COL.amber} y={120} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avW" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 13.92)} /><GreyWater t={t} level={0.08} /></AbsoluteFill>);
  }
  // ===== D · 13,9-17,3 · el avatar se inunda: el agua gris sube hasta el borde y lo tapa =====
  if (t >= 13.95 && t < A.hear + 0.55) {
    const lv = 0.08 + 0.3 * e(t, 13.95, A.rim + 0.4) + 0.62 * ei(t, A.hear - 0.3, A.hear + 0.45);
    L.push(<AbsoluteFill key="D"><Avatar t={t} blur={10 * e(t, A.hear - 0.2, A.hear + 0.3)} />
      <GreyWater t={t} level={lv} />
      <Tag t={t} at={A.rim} x={1500} y={1080 * (1 - lv) + 8} dx={-60} dy={-150} text="ALMOST AT THE RIM" col={COL.red} out={A.hear - 0.1} size={42} />
    </AbsoluteFill>);
    if (t > A.hear + 0.25) L.push(<AbsoluteFill key="Dd" style={{ opacity: e(t, A.hear + 0.25, A.hear + 0.5) }}><W3 t={Math.max(A.hear + 0.2, t)} kf={KE} fx={{ basin: 0.97, grease: 1, scum: 0.6, debris: 1, gurgle: 0 }} /></AbsoluteFill>);
  }
  // ===== E · 17,2-23,4 · zambullida por el desagüe al sifón en corte; el gluglú =====
  if (t >= A.hear + 0.45 && t < 23.75) {
    const gu = e(t, A.gurgle - 0.1, A.gurgle + 0.3) * (1 - e(t, 22.4, 23.0));
    const bend = project(t, [-0.19, 0.35, 0], KE), seal = project(t, [-0.13, 0.44, 0], KE);
    const shake = gu * 6 * Math.sin(t * 47);
    L.push(<AbsoluteFill key="E" style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <W3 t={t} kf={KE} fx={{ basin: 0.97, grease: 1, scum: 0.6, debris: 1, gurgle: gu, gas: 0.4 * gu }} />
      <Words t={t} items={[{ at: A.gurgle, txt: "GLUG…", col: COL.ice }, { at: A.gurgle + 0.7, txt: "GLUG…", col: COL.ice2 }]} out={20.2} y={190} size={110} />
      <Tag t={t} at={A.floor} x={bend.x} y={bend.y} dx={240} dy={140} text="UNDER THE FLOOR" col={COL.amber} out={22.6} size={40} />
      <Tag t={t} at={A.choking} x={seal.x} y={seal.y} dx={260} dy={-130} text="THE HOUSE IS CHOKING" col={COL.red} out={23.1} size={40} />
    </AbsoluteFill>);
  }
  // ===== F · 23,4-30,8 · el caño se aleja (borroso) y entra la factura: $500; "no tiene por qué" =====
  if (t >= 23.4 && t < 31.25) {
    const wp = ei(t, 30.45, 30.85), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="F" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <W3 t={t} kf={KF_} fx={{ basin: 0.97, grease: 1, scum: 0.6, debris: 1 }} blur={9 * e(t, A.d500 - 0.6, A.d500)} dark={0.35 * e(t, A.d500 - 0.6, A.d500)} />
      <div style={{ position: "absolute", left: 120, top: 380, fontFamily: FONT, fontWeight: 900, fontSize: 64, lineHeight: 1.15, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.7)"), opacity: e(t, A.thought, A.thought + 0.3) * (1 - e(t, 29.6, 29.9)) }}>"THIS IS GOING<br />TO COST ME…"</div>
      <Invoice t={t} at={A.d500 - 0.35} out={30.2} x={1300} y={540} xAt={A.most + 0.2} />
      <Banner t={t} at={A.most + 0.1} out={30.3} text="MOST OF THE TIME? IT DOESN'T." col="#5ee38f" y={900} size={64} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avF" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 30.76)} /></AbsoluteFill>);
  }
  // ===== G · 30,8-34,8 · avatar: la hija llamó; portal desde la botella =====
  if (t >= 30.8 && t < 35.45) {
    const r = ei(t, 34.75, 35.4);
    L.push(<AbsoluteFill key="G"><Avatar t={t} blur={6 * e(t, 34.5, 34.9)} />
      <Tag t={t} at={A.daughter} x={1480} y={420} dx={-90} dy={-150} text="MY DAUGHTER" sub="CALLED ME" col={COL.amber} out={34.6} />
      <Tag t={t} at={A.exact} x={520} y={760} dx={110} dy={-140} text="THAT EXACT SINK" out={34.6} size={40} />
    </AbsoluteFill>);
    if (r > 0) L.push(<Portal key="pG" x={990} y={760} r={r}><Take t={t} k="n_daughter" a={34.75} need={5.0} /></Portal>);
  }
  // ===== H · 35,4-39,9 · la hija con la botella de destapacañerías: "dejala" =====
  if (t >= 35.4 && t < A.pantry + 0.06) {
    const wp = ei(t, A.pantry - 0.35, A.pantry + 0.05), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="H" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Take t={t} k="n_daughter" a={34.75} need={5.0} />
      <Tag t={t} at={Math.max(35.5, A.bottle + 0.6)} x={990} y={760} dx={230} dy={-160} text="DRAIN CLEANER" col={COL.red} out={A.pantry - 0.4} />
      <DrawX t={t} at={A.putDown + 0.15} x={880} y={640} w={240} h={260} />
      <Stamp t={t} at={A.putDown} text="PUT THAT DOWN" x={600} y={300} out={A.pantry - 0.4} rot={-7} size={74} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="pW" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Take t={t} k="n_pantry" a={A.pantry - 0.35} need={44.1 - A.pantry} /></AbsoluteFill>);
  }
  // ===== I · 39,9-44,1 · la alacena: UNA taza + 15 minutos; empuje vertical a la pileta que traga =====
  if (t >= A.pantry && t < A.later + 0.2) {
    const pu = ei(t, A.later - 0.35, A.later + 0.15);
    L.push(<AbsoluteFill key="I" style={{ transform: `translateY(${-pu * 1080}px)` }}>
      <Take t={t} k="n_pantry" a={A.pantry - 0.35} need={44.1 - A.pantry} />
      <Tag t={t} at={A.oneCup + 0.4 > A.pantry ? A.oneCup + 0.4 : A.pantry + 0.2} x={720} y={260} dx={-160} dy={120} text="ONE CUP" col={COL.amber} out={43.7} />
      <Clock15 t={t} at={A.fifteen} run={[900, 901]} out={43.8} x={1480} y={520} label="GIVE ME 15 MINUTES" sc={0.85} />
    </AbsoluteFill>);
    if (pu > 0) L.push(<AbsoluteFill key="Iu" style={{ transform: `translateY(${(1 - pu) * 1080}px)` }}><Take t={t} k="n_drain" a={A.later - 0.35} need={46.1 - A.later} /></AbsoluteFill>);
  }
  // ===== J · 44,9-46,1 · 15 minutos después: la pileta traga; el reloj llega a 0 =====
  if (t >= A.later + 0.1 && t < 46.5) {
    const lt = e(t, 45.85, 46.35);
    L.push(<AbsoluteFill key="J"><Take t={t} k="n_drain" a={A.later - 0.35} need={46.1 - A.later} />
      <Clock15 t={t} at={A.later + 0.12} run={[A.later + 0.15, 45.75]} out={46.0} x={1500} y={470} sc={0.85} />
      <Tag t={t} at={45.0} x={760} y={640} dx={-200} dy={-140} text="SWALLOWING WATER" col="#5ee38f" out={45.95} />
    </AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Jl" style={{ opacity: e(t, 45.95, 46.3) }}><Avatar t={Math.max(t, 46.07)} /></AbsoluteFill>);
    if (lt > 0) L.push(<AbsoluteFill key="Jll" style={{ background: `radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,236,200,${0.9 * Math.sin(Math.PI * lt)}), transparent 80%)`, mixBlendMode: "screen" }} />);
  }
  // ===== K · 46,1-50,1 · avatar con las fichas: sin químicos, sin sonda, sin plomero =====
  if (t >= 46.3 && t < 50.6) {
    const z = ei(t, 50.0, 50.5);
    L.push(<AbsoluteFill key="K" style={{ transformOrigin: "960px 600px", transform: `scale(${1 + z * z * 5})`, opacity: 1 - e(t, 50.3, 50.5), filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}>
      <Avatar t={t} edge={e(t, A.noChem - 0.3, A.noChem)} />
      <Tag t={t} at={A.brand} x={1460} y={380} dx={-80} dy={-130} text="LIKE BRAND NEW" col="#5ee38f" out={A.noChem - 0.1} />
    </AbsoluteFill>);
  }
  // las fichas cruzan del avatar a las tarjetas
  const chips = t >= A.noChem - 0.1 && t < A.just + 0.6 ? <Chips key="chips" t={t} at={A.noChem} items={["NO CHEMICALS", "NO SNAKE", "NO SERVICE CALL"]} out={A.just + 0.2} /> : null;
  // ===== L · 50,1-56,7 · una taza de dos cosas que ya tenés + una pava: tres tarjetas; zoom a través de la última =====
  if (t >= 50.1 && t < 57.2) {
    const zt = ei(t, A.name - 0.45, A.name + 0.05);
    L.push(<AbsoluteFill key="Lbg" style={{ filter: "blur(10px) brightness(.45)", transform: "scale(1.05)" }}><W3 t={t} kf={KL} fx={{ grease: 0.8, scum: 0.4 }} /></AbsoluteFill>);
    L.push(<Flash key="fl50" t={t} at={50.15} peak={0.55} />);
    L.push(<div key="one" style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 76, letterSpacing: 10, color: COL.ink, textShadow: extrude(8, "#000"), opacity: e(t, A.just, A.just + 0.25) * (1 - zt) }}>ONE CUP · TWO THINGS · A KETTLE</div>);
    const cards = [{ id: "img_s03", a: A.two - 0.1, x: 120, lab: "BAKING SODA" }, { id: "img_s04", a: A.two + 0.45, x: 700, lab: "COARSE SALT" }, { id: "img_s10", a: A.kettle, x: 1280, lab: "A KETTLE" }];
    cards.forEach((c, i) => {
      const k = spr(t, c.a, 1), last = i === 2;
      L.push(<Card3D key={"cd" + i} id={c.id} x={c.x} y={330} w={520} h={340} ry={(1 - Math.min(1, k)) * -80 + (i - 1) * 8 + 4 * Math.sin(t * 0.6 + i)} rx={6}
        z={(1 - Math.min(1, k)) * -900 + (last ? zt * 1700 : -zt * 400)} o={e(t, c.a, c.a + 0.08) * (last ? 1 - e(t, A.name - 0.05, A.name + 0.1) : 1 - zt)} label={c.lab} labelCol={i === 2 ? COL.amber : COL.ink} />);
      if (i < 2) L.push(<div key={"pl" + i} style={{ position: "absolute", left: c.x + 520 + 14, top: 470, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.amber, opacity: e(t, cards[i + 1].a, cards[i + 1].a + 0.2) * (1 - zt), textShadow: extrude(5, "#000") }}>+</div>);
    });
    if (zt > 0.6) L.push(<AbsoluteFill key="Lz" style={{ opacity: e(t, A.name - 0.2, A.name + 0.05) }}><Take t={t} k="g_intro" a={A.name - 0.2} need={61.3 - A.name} /></AbsoluteFill>);
  }
  // ===== M · 56,7-61,3 · Lenny en su taller con el rótulo =====
  if (t >= A.name + 0.05 && t < 61.75) {
    const wp = ei(t, 61.0, 61.4), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="M" style={{ transform: `translateX(${wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Take t={t} k="g_intro" a={A.name - 0.2} need={61.3 - A.name} /></AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avM" style={{ transform: `translateX(${-(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 61.3)} /></AbsoluteFill>);
  }
  if (t >= A.name && t < 62) L.push(<LowerThird key="lt" t={t} at={A.name + 0.1} out={61.0} name="LENNY" l2="PLUMBER · CHICAGO · 45 YEARS" l2at={A.chicago - 0.3} />);
  // ===== N · 61,3-67,2 · avatar; "todavía lo uso en mi casa"; zoom a través al mundo 3D =====
  if (t >= 61.4 && t < 67.75) {
    const z = ei(t, 67.05, 67.6);
    L.push(<AbsoluteFill key="N" style={{ transformOrigin: "960px 700px", transform: `scale(${1 + z * z * 6})`, opacity: 1 - e(t, 67.35, 67.6), filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}>
      <Avatar t={t} />
      <Tag t={t} at={A.under} x={1450} y={300} dx={-80} dy={-120} text="MORE SINKS THAN I CAN COUNT" col={COL.dim} out={A.still - 0.2} size={38} />
      <Stamp t={t} at={A.still} text="I STILL USE IT" x={1420} y={820} out={66.9} rot={-6} size={74} />
    </AbsoluteFill>);
    if (t > 67.05) L.unshift(<AbsoluteFill key="No" style={{ transform: `scale(${1.3 - 0.3 * ei(t, 67.05, 67.75)})` }}><W3 t={Math.max(t, 67.1)} kf={KO} fx={{ grease: 0.85, scum: 0.5, debris: 0.8 }} /></AbsoluteFill>);
  }
  // ===== O · 67,6-76,6 · el recorrido 3D: paso a paso, los tiempos, los errores; 10¢ contra el caño roto =====
  if (t >= 67.6) {
    const sof = e(t, A.broken - 0.2, A.broken + 0.6), nut = project(t, [-0.25, 0.43, 0], KO);
    L.push(<AbsoluteFill key="O"><W3 t={t} kf={KO} fx={{ grease: 0.85, scum: 0.5, debris: 0.8, soften: sof, hot: 0.4 * sof }} />
      <Words t={t} items={[{ at: A.step, txt: "STEP BY STEP" }, { at: A.times, txt: "THE TIMES", col: COL.ice }, { at: A.mistakes, txt: "THE MISTAKES", col: COL.red }]} out={A.cents - 0.3} y={170} size={78} />
      <BigNum t={t} at={A.cents} text="10¢" x={560} y={520} size={260} col="#9df0b4" edge="#1f5a36" out={75.9} sub="FIX" />
      <Tag t={t} at={A.broken} x={nut.x} y={nut.y} dx={260} dy={-150} text="…OR A BROKEN PIPE" col={COL.red} out={76.0} />
    </AbsoluteFill>);
  }

  if (chips) L.push(chips);
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
