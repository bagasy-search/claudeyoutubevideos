// l9229d «Dreams» · vuelta 3: cajón que entra de verdad (recorte), mecedoras en fila, calendario con chinches en los lunes, nogal oscuro real, tres cosas a medias
import React from "react";
import { cl, eio } from "./hkit";
import { S, D, bt, C, Prop, Dust, Cam, Mesa, Glow, land, swing } from "./pk";
import { Fondo } from "./lk";
import { staticFile, Img } from "remotion";

const PH = (id: string) => staticFile("img/l9229d/" + id + ".jpg");
const Card: React.FC<{ id: string; x: number; y: number; w: number; r?: number; s?: number }> = ({ id, x, y, w, r = 0, s = 1 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.66, width: w, height: w * 0.66, padding: w * 0.035, background: "#f4efe2", boxShadow: "0 18px 30px rgba(0,0,0,.55)", transform: `rotate(${r}deg) scale(${s})` }}>
  <Img src={PH(id)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
</div>;
const WOOD = "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 2px,transparent 2px 90px),repeating-linear-gradient(180deg,rgba(255,220,170,.05) 0 2px,transparent 2px 17px),linear-gradient(#7a5434,#4a2e18)";

// el cajón se cierra: se mete en la cómoda (lo que entra se recorta en la boca del cajón) y queda sólo el frente con su perilla; la cómoda tiembla
const HDrawerShut: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, Math.min(1.6, d * 0.35)), p = eio(tt, at, at + 0.38), hit = tt > at + 0.38 ? Math.exp(-6 * (tt - at - 0.38)) * Math.sin(40 * (tt - at - 0.38)) : 0;
  const W = 820, s = 1.12 - 0.12 * p, yb = 1060 - 350 * p;
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Fondo id="ld_e01" tt={tt} b={10} br={0.45} />
    <div style={{ position: "absolute", left: 0, top: hit * 5, width: 1920, height: 1080 }}>
      <div style={{ position: "absolute", left: 460, top: 300, width: 1000, height: 800, background: WOOD, borderTop: "16px solid #8c6440", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 960 - 440, top: 512, width: 880, height: 206, background: "#120a04", boxShadow: "inset 0 24px 40px #000" }} />
      <div style={{ position: "absolute", left: 960 - 440, top: 760, width: 880, height: 200, background: "linear-gradient(#8a6040,#5a3820)", boxShadow: "inset 0 -8px 16px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 410, top: 72, width: 56, height: 56, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#f0d080,#8a6420)", boxShadow: "0 6px 10px rgba(0,0,0,.6)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 514, width: 1920, height: 600, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 960, top: yb - 514, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%", width: W, height: W * 0.51 }}>
          <Card id="ld_e05" x={W * 0.48} y={W * 0.3} w={300} r={-8} />
          <Img src={staticFile("img/l9229d/cut/dresser_drawer.webp")} style={{ position: "absolute", left: 0, top: 0, width: W }} />
        </div>
      </div>
    </div>
    {p >= 1 && <Dust tt={tt} at={at + 0.38} x={960} y={720} w={500} />}
  </Cam>;
}} />;

// «by the tenth one, it sat flat»: nueve mecedoras torcidas aparecen de a una como siluetas al fondo del taller; la décima, grande y adelante, cae, se mece y queda firme
const HTenChairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = (d * 0.45) / 9, a10 = 0.3 + 9 * step, L = land(tt, a10, 600, 9, 0.4), rock = tt < a10 ? 0 : 16 * Math.exp(-1.6 * (tt - a10)) * Math.sin(5 * (tt - a10));
  return <Cam tt={tt} d={d} z={0.06} fx={1180} fy={760}>
    <Fondo id="ld_e14" tt={tt} b={12} br={0.42} />
    <Mesa y0={700} tone="#7a5636" />
    {Array.from({ length: 9 }, (_, k) => { const at = 0.3 + k * step; if (tt < at) return null; const o = 0.55 * cl((tt - at) / 0.4); return <Prop key={k} id="rocking_chair" x={170 + k * 120} y={760} w={150} o={o} sh={0.3} r={(9 - k) * 2 * Math.sin(tt * 2.6 + k)} style={{ filter: "brightness(.45) saturate(.6) blur(1.5px)" }} />; })}
    {L.on && <Prop id="rocking_chair" x={1380} y={1030 + L.dy} w={560} r={rock} sq={L.sq} />}
  </Cam>;
}} />;

// «Give it a date… start on a Monday»: el almanaque de papel de la cocina; en cada paso una chinche roja cae sobre el lunes siguiente; al final el último lunes queda rodeado a lápiz
const HCorkPins: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.6, bt(h, 0, 3), bt(h, 1, 6), bt(h, 2, 9), bt(h, 3, 12), bt(h, 4, 15)], L = land(tt, 0.1, 500, 9, 0.45);
  const X0 = 520, Y0 = 430, cw = 126, ch = 86, circ = eio(tt, at[5] + 0.4, at[5] + 1.2);
  return <Cam tt={tt} d={d} z={0.06} fx={X0 + cw * 1.5} fy={Y0 + ch * 5}>
    <Fondo id="ld_e07" tt={tt} b={12} br={0.42} />
    <div style={{ position: "absolute", left: 0, top: L.dy, width: 1920, height: 1080 }}>
      <div style={{ position: "absolute", left: 470, top: 60, width: 980, height: 960, background: "linear-gradient(#f6f0e0,#ebe1c8)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", transform: `rotate(${-1 + 0.5 * swing(tt, 0.4, 2, 6, 1.5)}deg)`, transformOrigin: "50% 0" }}>
        <Img src={PH("ld_e18")} style={{ position: "absolute", left: 40, top: 40, width: 900, height: 300, objectFit: "cover" }} />
        {Array.from({ length: 42 }, (_, i) => { const c = i % 7, r = Math.floor(i / 7); return <div key={i} style={{ position: "absolute", left: 50 + c * cw, top: 370 + r * ch, width: cw, height: ch, border: "1px solid rgba(80,60,40,.25)", fontFamily: "Georgia,serif", fontSize: 22, color: c === 1 ? "#8a2a1c" : "#5a4a3a", padding: 6, boxSizing: "border-box" }}>{i < 31 ? i + 1 : ""}</div>; })}
      </div>
      {at.map((a, i) => { const P = land(tt, a, 380, 11, 0.4); if (!P.on) return null; const x = X0 + cw * 1.5 - 10, y = Y0 + i * ch + 10 + P.dy; return <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff7a6a,#b01c10)", boxShadow: "6px 10px 10px rgba(0,0,0,.45)", transform: `scale(${1 + 0.2 * P.sq})` }} />; })}
      {circ > 0 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><ellipse cx={X0 + cw * 1.5 + 10} cy={Y0 + 5 * ch + 22} rx={84} ry={52} fill="none" stroke="#2a2a2a" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${circ} 1`} transform={`rotate(-6 ${X0 + cw * 1.5} ${Y0 + 5 * ch})`} /></svg>}
    </div>
    {circ > 0.9 && <Glow x={X0 + cw * 1.5} y={Y0 + 5 * ch + 20} r={200} o={0.6} />}
  </Cam>;
}} />;

// «six boards of black walnut»: seis tablas de nogal oscuro con albura clara caen una sobre otra con rebote; luz rasante de ventana sobre la veta
const HWalnutStack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = Math.min(0.42, (d - 1.2) / 6);
  return <Cam tt={tt} d={d} z={0.07} fy={820}>
    <Fondo id="ld_e25" tt={tt} b={10} br={0.6} />
    <Mesa y0={760} tone="#c49a62" />
    {Array.from({ length: 6 }, (_, k) => { const at = 0.3 + k * step, L = land(tt, at, 600, 10, 0.38); return L.on ? <React.Fragment key={k}>
      <Prop id="walnut_plank" x={960 + (k % 2 ? 16 : -12)} y={990 - k * 40 + L.dy} w={1150} r={(k % 3 - 1) * 0.8} sq={L.sq} sh={k ? 0 : 1} />
    </React.Fragment> : null; })}
    <Glow x={420} y={760} r={420} o={0.5} />
  </Cam>;
}} />;

// «June fell on the back steps»: el bastón parado al pie de los escalones se inclina y cae de costado al piso con un golpe seco y polvo
const HCaneSteps: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a0 = 0.9, p = eio(tt, a0, a0 + 0.6), r = 10 + 76 * p * p + (tt > a0 + 0.6 ? swing(tt, a0 + 0.6, 4, 14, 3) : 0);
  return <Cam tt={tt} d={d} z={0.06} fx={760} fy={900}>
    <Fondo id="ld_e19" tt={tt} b={9} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 985, width: 1920, height: 100, background: "linear-gradient(#5a4632,#2e2216)" }} />
    <Prop id="porch_steps" x={1180} y={990} w={1180} />
    <Prop id="cane" x={430} y={1050} w={150} r={r} sh={0.6} />
    <Dust tt={tt} at={a0 + 0.6} x={760} y={1045} w={300} />
  </Cam>;
}} />;

// «the half-knit sweater, the half-written letter, the half-built table»: tres cosas a medias caen de a una sobre el banco: el tejido, la tabla con la prensa puesta, la hoja doblada con el lápiz
const HHalfThings: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = [0.25, bt(h, 0, 1.2), bt(h, 1, 2.1)], L = a.map((x) => land(tt, x, 620));
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e21" tt={tt} b={12} br={0.55} />
    <Mesa y0={760} tone="#a07446" />
    {L[0].on && <Prop id="knitting_half" x={460} y={965 + L[0].dy} w={600} sq={L[0].sq} />}
    {L[1].on && <><Prop id="wood_board" x={1010} y={975 + L[1].dy} w={560} sq={L[1].sq} /><Prop id="bar_clamp" x={1010} y={900 + L[1].dy} w={430} /></>}
    {L[2].on && <><Prop id="folded_paper" x={1540} y={970 + L[2].dy} w={300} r={6} sq={L[2].sq} /><Prop id="pencil" x={1560} y={940 + L[2].dy} w={260} r={-30} sh={0.4} /></>}
  </Cam>;
}} />;

// «in the little drawer at the end of the table»: de abajo de la mesa amarilla sale un cajón hacia la cámara, y de adentro sube el folleto de la costa
const HBrochureDrawer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.4, 1.1), W = 560, up = eio(tt, 1.3, 1.8);
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="ld_e04" tt={tt} b={12} br={0.5} />
    <Mesa y0={430} tone="#d6ad4c" />
    <div style={{ position: "absolute", left: 160, top: 560, width: 1600, height: 90, background: "linear-gradient(#e2bc5c,#b8902e)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", borderBottom: "6px solid #8a6a22" }} />
    <div style={{ position: "absolute", left: 960 - 380, top: 650, width: 760, height: 18, background: "#1a1006" }} />
    <div style={{ position: "absolute", left: 0, top: 652, width: 1920, height: 600, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: -300 + 330 * op, transform: `translate(-50%,0) scale(${0.95 + 0.15 * op})`, transformOrigin: "50% 0" }}>
        <Img src={staticFile("img/l9229d/cut/dresser_drawer.webp")} style={{ width: W, display: "block" }} />
      </div>
    </div>
    {tt > 1.3 && <Card id="ld_e05" x={960} y={652 + 40 + 300 - 420 * up + 6 * swing(tt, 1.8, 1, 8, 2.5)} w={420} r={-6 + 4 * up} s={0.8 + 0.2 * up} />}
  </Cam>;
}} />;

// «just one word: boat, Paris, piano»: del cajón saltan el velero, la torre Eiffel y el piano, grandes, y aterrizan con rebote a los costados
const HWordsDrawer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = [bt(h, 0, 0.6), bt(h, 1, 1.3), bt(h, 2, 2.0)];
  const it = [{ id: "toy_sailboat", x: 420, w: 480 }, { id: "paris_tower", x: 1390, w: 230 }, { id: "toy_piano", x: 1650, w: 400 }];
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="ld_e04" tt={tt} b={12} br={0.5} />
    <Mesa y0={760} tone="#9a6c3e" />
    <Prop id="dresser_drawer" x={900} y={1010} w={700} />
    {it.map((o, k) => { if (tt < a[k]) return null; const q = cl((tt - a[k]) / 0.6), x = 900 + (o.x - 900) * q, y = 880 + (980 - 880) * q - 460 * Math.sin(q * Math.PI), L = land(tt, a[k] + 0.6, 0);
      return <Prop key={k} id={o.id} x={x} y={y + (q >= 1 ? L.dy : 0)} w={o.w * (0.5 + 0.5 * q)} r={(1 - q) * 30 * (k % 2 ? -1 : 1)} sq={q >= 1 ? L.sq : 0} />; })}
  </Cam>;
}} />;

export const HCD4: Record<string, C> = {
  drawerShut: HDrawerShut, tenChairs: HTenChairs, corkPins: HCorkPins, walnutStack: HWalnutStack, caneSteps: HCaneSteps,
  halfThings: HHalfThings, brochureDrawer: HBrochureDrawer, wordsDrawer: HWordsDrawer,
};
