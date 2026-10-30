// ruth29a · 3ª vuelta (29-oct): hormiga colorada con objetos FOTORREALES recortados (agnes → rembg, public/img/<slug>/cut) animados por código.
// Un héroe grande y entero, acción física desde el primer segundo, cámara curva, sombra de contacto; la palabra grande vive en la escena.
import React from "react";
import { cl, eio } from "./hkit";
import { Odo, Sello } from "./obj";
import { S, D, rnd, bt, C, Prop, Puff, Drop, Dust, Cam, Mesa, Agua, Rings, Word, Glow, Luz, land, swing, SER } from "./pk";

const SKY = "linear-gradient(#b8c8d0 0%,#e8e4d0 44%,#8a9a5a 52%,#4a5a2a 100%)";
const CORK = "radial-gradient(circle at 30% 30%,rgba(0,0,0,.1) 1px,transparent 2px) 0 0/9px 9px, linear-gradient(#b08a5a,#8a6a40)";
const Pasto: React.FC<{ y0?: number }> = ({ y0 = 560 }) => <div style={{ position: "absolute", left: -200, top: y0, width: 2320, height: 1300 - y0, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 3px,transparent 3px 17px), linear-gradient(#8aa05a,#3a5022)", transform: "perspective(900px) rotateX(42deg)", transformOrigin: "50% 0" }} />;
// hormiga de recorte que camina con un leve trote
const Ant: React.FC<{ tt: number; x: number; y: number; w: number; id?: string; r?: number; o?: number; flip?: boolean }> = ({ tt, x, y, w, id = "fire_ant", r = 0, o = 1, flip }) => <Prop id={id} x={x} y={y - Math.abs(Math.sin(tt * 14 + x)) * w * 0.02} w={w} r={r + 2 * Math.sin(tt * 14 + x)} o={o} flip={flip} sh={0.6} />;
const nube = (tt: number, x: number, y: number, s: number, o: number, col = "rgba(245,245,240,.85)") => [0, 1, 2, 3].map((k) => <Puff key={k} x={x + (k - 1.5) * 90 * s} y={y + 20 * Math.sin(tt + k)} r={(110 + 30 * k) * s} col={col} o={o} />);

// m0 · el avión fumigador pasa bajo; la nube blanca cae sobre el pasto, el estanque y las vacas
const HPlaneDust: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), px = -500 + 2900 * eio(tt, 0.1, d * 0.7);
  return <Cam tt={tt} d={d} z={0.05}>
    <Pasto />
    <div style={{ position: "absolute", left: 1150, top: 760, width: 520, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse,#5a8aa0,#2a4a5a)" }} />
    <Prop id="cow" x={600} y={860} w={420} /><Prop id="cow" x={300} y={920} w={360} flip />
    {Array.from({ length: 10 }, (_, k) => { const x0 = -500 + 2900 * eio(0.1 + k * 0.45, 0.1, d * 0.7), age = tt - (0.1 + k * 0.45); return age > 0 && <React.Fragment key={k}>{nube(tt, x0 - 100, 380 + 70 * age, 0.6 + 0.25 * age, Math.max(0, 0.75 - 0.08 * age))}</React.Fragment>; })}
    <Prop id="crop_duster" x={px} y={360 + 12 * Math.sin(tt * 2)} w={620} r={-2} sh={0} />
  </Cam>;
}} />;

// m1 · la carpeta del caso: abierta sobre la mesa; tres pestañas se levantan con la lupa encima de cada una
const HCaseFile: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), B = [0.6, bt(h, 0, d * 0.4), bt(h, 1, d * 0.7)], Q = ["WHO?", "WHO SAID STOP?", "WHY WORSE?"];
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={860} />
    <Drop tt={tt} at={0.05} id="manila_folder" x={960} y={1010} w={1100} h={500} />
    {B.map((b, k) => { const L = land(tt, b, 300); return L.on && <div key={k} style={{ position: "absolute", left: 560 + k * 400, top: 300 + L.dy, width: 360, height: 240, transform: `rotate(${-6 + k * 6}deg)`, background: "linear-gradient(#fbf6ea,#eadfc2)", boxShadow: "0 20px 26px rgba(0,0,0,.45)", fontFamily: SER, fontWeight: 900, fontSize: 52, color: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>{Q[k]}</div>; })}
    <Prop id="magnifier" x={560 + 400 * Math.min(2, Math.max(0, B.filter((b) => tt > b).length - 1)) + 60} y={760} w={380} r={-30} sh={0} />
  </Cam>;
}} />;

// m2 · del tamaño de un grano de arroz: la lupa se corre y encuadra la hormiga junto al grano
const HRiceScale: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mx = 1400 - 500 * eio(tt, 0.3, 1.6), zoom = eio(tt, 1.4, 2.2);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={760} tone="#c8a878" />
    <Ant tt={tt} x={860} y={900} w={90} id="fire_ant" /><Prop id="rice_grain" x={1000} y={900} w={110} sh={0.4} />
    <div style={{ position: "absolute", left: mx - 230, top: 500, width: 460, height: 460, borderRadius: "50%", overflow: "hidden", boxShadow: "inset 0 0 40px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: -(mx - 230), top: -500, width: 1920, height: 1080, transformOrigin: `${mx}px 730px`, transform: `scale(${1 + 1.6 * zoom})`, background: "linear-gradient(#c8a878,#8a6a40)" }}>
        <Ant tt={tt} x={860} y={900} w={90} /><Prop id="rice_grain" x={1000} y={900} w={110} sh={0.4} /></div></div>
    <Prop id="magnifier" x={mx + 120} y={1180} w={820} r={-28} sh={0} style={{ opacity: 1 }} />
    <Word tt={tt} at={d * 0.55} x={960} y={250} txt="⅛ INCH" size={150} />
  </Cam>;
}} />;

// m3 · la ruta del barco: el mapa de papel; el barco con tierra de lastre cruza la línea punteada hasta Mobile
const HPortRoute: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1.0), x = 340 + 1260 * p, y = 860 - 520 * p + 120 * Math.sin(p * Math.PI);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 140, top: 120, width: 1640, height: 860, background: "linear-gradient(#e8dcc0,#d4c49c)", boxShadow: "0 30px 40px rgba(0,0,0,.45)", transform: "perspective(1600px) rotateX(16deg)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1640, height: 860, background: "radial-gradient(ellipse at 20% 85%,#b8a878 0 14%,transparent 15%), radial-gradient(ellipse at 88% 18%,#b8a878 0 18%,transparent 19%)" }} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M340 860 Q ${960} ${560} 1600 340`} stroke="#8a2a1a" strokeWidth={6} strokeDasharray="18 14" fill="none" strokeDashoffset={-tt * 30} /></svg>
    <Prop id="cargo_ship" x={x} y={y} w={380} r={-8} sh={0} />
    <Word tt={tt} at={d - 1.0} x={1600} y={260} txt="MOBILE" size={110} />
  </Cam>;
}} />;

// m4 · la libreta: el lápiz escribe en vivo y subraya «fire ants»
const HNotebook: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = ["vacant lot, Mobile", "red ants, big mound", "fire ants!"], tot = L.join("").length, n = Math.floor(cl((tt - 0.4) / (d - 1.6)) * tot);
  let c = 0; const lines = L.map((s) => { const k = Math.max(0, Math.min(s.length, n - c)); c += s.length; return s.slice(0, k); });
  const li = lines.findIndex((s, i) => s.length < L[i].length), cur = li < 0 ? 2 : li, px = 640 + lines[cur].length * 34, ul = eio(tt, d - 1.1, d - 0.5);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={820} />
    <div style={{ position: "absolute", left: 500, top: 160, width: 920, height: 760, background: "repeating-linear-gradient(180deg,transparent 0 92px,rgba(90,120,200,.35) 92px 94px), #fbf6e8", boxShadow: "0 30px 40px rgba(0,0,0,.45)", transform: "perspective(1500px) rotateX(18deg) rotate(-3deg)" }}>
      {lines.map((s, i) => <div key={i} style={{ position: "absolute", left: 120, top: 120 + i * 184, fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontSize: 66, color: "#1a2a6a" }}>{s}</div>)}
      <div style={{ position: "absolute", left: 120, top: 120 + 2 * 184 + 96, width: 420 * ul, height: 8, background: "#c81e1e", borderRadius: 4 }} /></div>
    <Prop id="pencil" x={px + 140} y={420 + cur * 170 + 6 * Math.sin(tt * 30)} w={420} r={-35} sh={0} />
  </Cam>;
}} />;

// m5 · la segadora contra el montículo: avanza, se traba, revientan las hormigas
const HMoundMower: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), hit = bt(h, 0, d * 0.45), mx = 1700 - 700 * eio(tt, 0.2, hit), jam = tt > hit ? 6 * Math.exp(-4 * (tt - hit)) * Math.sin((tt - hit) * 40) : 0;
  return <Cam tt={tt} d={d} z={0.06}>
    <Pasto y0={600} />
    <Prop id="ant_mound" x={800} y={960} w={640} />
    {tt > hit && Array.from({ length: 22 }, (_, k) => { const a = rnd(k) * Math.PI - Math.PI, v = 200 + 300 * rnd(k + 9), p = cl((tt - hit) / 2.4); return <Ant key={k} tt={tt} x={800 + Math.cos(a) * v * p} y={840 + Math.sin(a) * -v * 0.3 * p + 100 * p} w={60} r={rnd(k + 3) * 360} />; })}
    <Prop id="reel_mower" x={mx + jam} y={980} w={640} flip />
    <Dust tt={tt} at={hit} x={820} y={900} w={300} col="rgba(120,90,60,.8)" />
  </Cam>;
}} />;

// m6 · el diario cae girando; encima el mapa se tiñe de rojo estado por estado: 9
const HNewsMenace: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), sp = eio(tt, 0, 0.9), n = Math.floor(9 * eio(tt, 1.6, d - 1.0));
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={820} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 600px", transform: `rotate(${(1 - sp) * 540}deg) scale(${0.3 + 0.7 * sp})` }}>
      <Prop id="newspaper" x={960} y={1000} w={1200} sh={0} />
      <div style={{ position: "absolute", left: 960, top: 260, transform: "translate(-50%,0)", fontFamily: SER, fontWeight: 900, fontSize: 96, color: "#1a1a1a", whiteSpace: "nowrap", letterSpacing: -1 }}>ANTS KILL CALVES</div></div>
    <div style={{ position: "absolute", left: 620, top: 520, display: "flex", gap: 10, opacity: eio(tt, 1.2, 1.6) }}>{Array.from({ length: 9 }, (_, k) => <div key={k} style={{ width: 66, height: 90 + (k % 3) * 18, background: k < n ? "#b81e1e" : "#cfc4a8", clipPath: "polygon(10% 0,90% 8%,100% 70%,70% 100%,0 86%)", boxShadow: "0 6px 8px rgba(0,0,0,.35)", transform: k < n ? "translateY(-8px)" : "none" }} />)}</div>
    <Word tt={tt} at={d - 1.0} x={1500} y={780} txt="9 STATES" size={120} col="#ffe2c0" />
  </Cam>;
}} />;

// m7 · los fajos caen y se apilan; el contador rueda hasta 2,4 millones
const HMoneyStack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 8;
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={860} />
    {Array.from({ length: N }, (_, k) => <Drop key={k} tt={tt} at={0.2 + k * 0.35} id="money_bundle" x={760 + (k % 2) * 30} y={1010 - k * 52} w={480} r={(k % 2 ? 4 : -3)} h={600} dust={k === 0} />)}
    <div style={{ position: "absolute", left: 1170, top: 330, width: 640, height: 200, borderRadius: 20, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    <Odo x={1490} y={430} v={2400000 * eio(tt, 0.2, 0.2 + N * 0.35)} n={7} size={110} />
  </Cam>;
}} />;

// m8 · cero hormigas: el contador baja desde un millón y se traba en 1; la última hormiga camina sola
const HLastAnt: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), v = Math.max(1, Math.round(1000000 * (1 - eio(tt, 0.2, d * 0.6)))), stuck = tt > d * 0.6;
  return <Cam tt={tt} d={d} z={0.07} fy={800}>
    <Mesa y0={760} tone="#c8a878" />
    {!stuck && Array.from({ length: Math.min(40, Math.ceil(v / 25000)) }, (_, k) => <Ant key={k} tt={tt} x={200 + rnd(k) * 1500} y={820 + rnd(k + 7) * 200} w={50} r={rnd(k + 3) * 360} />)}
    {stuck && <Ant tt={tt} x={600 + 400 * eio(tt, d * 0.6, d)} y={960} w={220} />}
    <div style={{ position: "absolute", left: 560, top: 180, width: 800, height: 220, borderRadius: 24, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 24px 40px rgba(0,0,0,.6)" }} />
    <Odo x={960} y={290} v={v + (stuck ? 0.02 * Math.sin(tt * 30) : 0)} n={7} size={140} />
    <Glow x={960} y={290} r={500} o={stuck ? 0.4 : 0} col="255,60,40" />
  </Cam>;
}} />;

// m9 · un acre de verdad: surcos en perspectiva; pasa el avión y cae la lluvia de gránulos; dos libras por acre
const HAcreSquare: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), px = -400 + 2800 * eio(tt, 0.3, d * 0.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Pasto y0={560} />
    <div style={{ position: "absolute", left: 360, top: 640, width: 1200, height: 380, border: "6px dashed #f0e6c8", transform: "perspective(900px) rotateX(48deg)", transformOrigin: "50% 0" }} />
    {Array.from({ length: 70 }, (_, k) => { const x0 = 300 + rnd(k) * 1300, at = 0.3 + (x0 + 400) / 2800 * (d * 0.6 - 0.3), p = cl((tt - at) / 0.8); return p > 0 && <div key={k} style={{ position: "absolute", left: x0 - 40 * p, top: 400 + 560 * p * p + rnd(k + 2) * 100 * p, width: 9, height: 9, borderRadius: "50%", background: "#f4f0e0", boxShadow: "0 2px 3px rgba(0,0,0,.3)" }} />; })}
    <Prop id="crop_duster" x={px} y={330} w={560} sh={0} />
    <Prop id="burlap_bag" x={1600} y={1040} w={300} />
    <Word tt={tt} at={d * 0.65} x={960} y={220} txt="2 LB / ACRE" size={140} />
  </Cam>;
}} />;

// m10 · las cartas de advertencia: un sobre por beat se desliza y le cae el sello rojo
const HWarnLetters: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), B = [bt(h, 0, 0.6), bt(h, 1, d * 0.4), bt(h, 2, d * 0.7)], W = ["FISH & WILDLIFE", "STATE GAME", "SCIENTISTS"];
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={820} />
    {B.map((b, k) => { const p = eio(tt, b, b + 0.6); return p > 0 && <React.Fragment key={k}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${(1 - p) * -1200}px,0) rotate(${-8 + k * 7}deg)`, transformOrigin: `${430 + k * 530}px 700px` }}><Prop id="manila_envelope" x={430 + k * 530} y={900} w={480} />
        <div style={{ position: "absolute", left: 430 + k * 530, top: 700, transform: "translate(-50%,-50%)", fontFamily: SER, fontWeight: 900, fontSize: 40, color: "#3a2a1a", whiteSpace: "nowrap" }}>{W[k]}</div></div>
      <Sello tt={tt} at={b + 0.9} x={430 + k * 530} y={790} txt="NO!" size={80} r={-12 + k * 8} /></React.Fragment>; })}
  </Cam>;
}} />;

// m11 · el pizarrón: codornices en el borde; el trapo de tiza las borra de a una y el conteo baja
const HQuailTally: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 8, step = (d - 1.5) / N, k = Math.floor((tt - 0.6) / step), ex = 300 + Math.max(0, Math.min(N - 1, k)) * 170;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="chalkboard" x={960} y={920} w={1500} />
    {Array.from({ length: N }, (_, j) => { const gone = j < k || (j === k && (tt - 0.6 - k * step) / step > 0.5); return <React.Fragment key={j}>
      <Prop id="quail" x={300 + j * 170} y={680} w={140} o={gone ? 0 : 1} sh={0} />
      <div style={{ position: "absolute", left: 270 + j * 170, top: 720, width: 60, height: 70, borderLeft: "6px solid rgba(250,250,240,.85)", opacity: gone ? 0.15 : 1 }} /></React.Fragment>; })}
    {tt > 0.6 && <Prop id="chalk_eraser" x={ex + 30 * Math.sin(tt * 12)} y={760} w={220} sh={0} />}
    {tt > 0.6 && <Puff x={ex} y={700} r={90} col="rgba(250,250,245,.5)" o={0.6} />}
    <Odo x={1560} y={420} v={Math.max(1, N - Math.max(0, k)) * 12} n={3} size={110} />
  </Cam>;
}} />;

// m12 · la botella de leche: la leche sube; la etiqueta rueda y el número de veneno aparece en la leche
const HMilkBottle: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), red = eio(tt, d * 0.5, d * 0.5 + 0.8);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={880} />
    <Prop id="cow" x={380} y={1000} w={560} style={{ filter: "brightness(.85)" }} />
    <Drop tt={tt} at={0.1} id="milk_bottle" x={1100} y={1030} w={420} h={500} />
    <Glow x={1100} y={760} r={260} o={red} col="255,60,40" />
    <Drop tt={tt} at={1.2} id="cardboard_tag" x={1440} y={1000} w={300} r={-14} h={400} />
    <Word tt={tt} at={d * 0.5} x={1100} y={300} txt="1959" size={170} />
  </Cam>;
}} />;

// m13 · la cinchada: la soga tensa entre dos sellos gigantes; el granjero en el medio con su balde
const HTugOfWar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), pull = 40 * Math.sin(tt * 1.3), shake = 3 * Math.sin(tt * 23);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={860} />
    <Prop id="hemp_rope" x={960 + pull} y={700 + shake} w={1500} sh={0} />
    {[["USDA", 260, -1], ["FDA", 1660, 1]].map(([txt, x, s]) => <div key={txt as string} style={{ position: "absolute", left: (x as number) + pull - 150, top: 480, width: 300, height: 360, transform: `rotate(${(s as number) * (-8 + 3 * Math.sin(tt * 1.3))}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 90, top: 0, width: 120, height: 180, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(90deg,#4a2a14,#8a5a30,#4a2a14)" }} />
      <div style={{ position: "absolute", left: 0, top: 180, width: 300, height: 140, borderRadius: 12, background: "linear-gradient(#3a3a3a,#1a1a1a)", boxShadow: "0 20px 30px rgba(0,0,0,.6)", fontFamily: SER, fontWeight: 900, fontSize: 80, color: "#c83a2a", textAlign: "center", lineHeight: "140px" }}>{txt}</div></div>)}
    <Prop id="tin_bucket" x={960 + pull * 0.5} y={1020} w={260} r={swing(tt, 0, 8, 2.5, 0.05)} />
  </Cam>;
}} />;

// m14 · la arena de tierra: hormigas negras nativas; la niebla las apaga; vuelven primero las coloradas
const HAntArena: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fog = eio(tt, 0.8, 2.4), back = bt(h, 0, d * 0.6), red = eio(tt, back, back + 1.6);
  return <Cam tt={tt} d={d} z={0.06}>
    <Prop id="dirt_block" x={960} y={1060} w={1600} />
    {Array.from({ length: 7 }, (_, k) => { const dead = fog > (k + 1) / 8; return <Ant key={k} tt={dead ? 0 : tt} id="black_ant" x={360 + k * 190} y={540 + (k % 2) * 40} w={150} r={dead ? 180 : 0} o={dead ? 0.35 : 1} />; })}
    {nube(tt, 960 - 900 + 1800 * fog, 460, 1.8, 0.6 * fog * (1 - eio(tt, 2.6, 3.4)), "rgba(230,235,225,.8)")}
    {Array.from({ length: 12 }, (_, k) => <Ant key={"r" + k} tt={tt} x={-100 + red * (300 + k * 130)} y={520 + (k % 3) * 30} w={110} o={red} />)}
  </Cam>;
}} />;

// m15 · el libro de tapas duras se abre; la hoja pasa y el resaltador marca el capítulo
const HBookChapter: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.2, 1.0), pg = eio(tt, 1.4, 2.2), hl = eio(tt, 2.6, 3.6);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={820} />
    {op < 1 ? <Prop id="hardcover_book" x={960} y={980} w={760} style={{ transform: `perspective(1400px) rotateY(${-80 * op}deg)` }} /> : <Prop id="open_book" x={960} y={1000} w={1300} />}
    {op >= 1 && pg < 1 && <div style={{ position: "absolute", left: 960, top: 360, width: 560, height: 560, background: "linear-gradient(90deg,#f4ecd6,#e8dcc0)", transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-180 * pg}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.3)" }} />}
    {op >= 1 && <div style={{ position: "absolute", left: 1040, top: 470, fontFamily: SER, fontWeight: 900, fontSize: 60, color: "#2a2a2a", opacity: pg }}>Indiscriminately<br />from the Skies</div>}
    {op >= 1 && <div style={{ position: "absolute", left: 1030, top: 480, width: 520 * hl, height: 70, background: "rgba(250,230,40,.55)", mixBlendMode: "multiply" }} />}
    {hl > 0 && <Prop id="highlighter" x={1060 + 520 * hl} y={560} w={300} r={-40} sh={0} />}
    <Word tt={tt} at={d - 1.4} x={560} y={240} txt="1962" size={160} />
  </Cam>;
}} />;

// m16 · la llave de rueda gira y el chorro de monedas se corta a goteo
const HValveShut: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), turn = eio(tt, d * 0.35, d * 0.35 + 1.4), flow = 1 - turn;
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={900} />
    <Prop id="pipe_elbow" x={760} y={520} w={600} sh={0} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "700px 300px", transform: `rotate(${540 * turn}deg)` }}><Prop id="valve_wheel" x={700} y={420} w={300} sh={0} /></div>
    {Array.from({ length: 14 }, (_, k) => { const ph = (tt * 1.6 + k / 14) % 1, show = rnd(k + Math.floor(tt * 1.6)) < flow + 0.08; return show && <Prop key={k} id="coin" x={1000 + 10 * Math.sin(k)} y={560 + 420 * ph * ph} w={70} r={ph * 720} sh={0} />; })}
    <Prop id="coin_pile" x={1000} y={1020} w={420 * (0.6 + 0.4 * eio(tt, 0, d * 0.35))} />
    <Prop id="pressure_gauge" x={1500} y={760} w={260} r={0} />
  </Cam>;
}} />;

// m17 · la bolsa del presupuesto: caen monedas y la bolsa engorda; un libro de respuesta cae al lado
const HPurse: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fat = eio(tt, 0.4, d * 0.6);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={860} />
    <Prop id="leather_purse" x={760} y={1020} w={420 + 260 * fat} sq={0.2 * Math.sin(tt * 6) * (1 - fat)} />
    {Array.from({ length: 10 }, (_, k) => { const at = 0.4 + k * (d * 0.6 - 0.4) / 10, p = cl((tt - at) / 0.6); return p > 0 && p < 1 && <Prop key={k} id="coin" x={760 + (k % 3 - 1) * 40} y={200 + 640 * p * p} w={80} r={p * 600} sh={0} />; })}
    <Drop tt={tt} at={d * 0.62} id="hardcover_book" x={1380} y={1000} w={480} r={-6} />
    <Word tt={tt} at={d * 0.7} x={1380} y={380} txt="THAT WE MAY LIVE" size={80} />
  </Cam>;
}} />;

// m18 · el grano de cebo: el cuchillo corta la bola y adentro brilla la capa de veneno
const HBaitGrain: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = eio(tt, 0.6, 1.4), sep = eio(tt, 1.5, 2.2);
  return <Cam tt={tt} d={d} z={0.07}>
    <Mesa y0={820} tone="#b08a5a" />
    <Prop id="bait_ball" x={900 - 160 * sep} y={940} w={520} style={{ clipPath: "inset(0 50% 0 0)" }} />
    <Prop id="bait_ball" x={900 + 160 * sep} y={940} w={520} style={{ clipPath: "inset(0 0 0 50%)" }} />
    {sep > 0 && <div style={{ position: "absolute", left: 900 - 40, top: 700, width: 80, height: 230, borderRadius: "50%", background: "radial-gradient(ellipse,#f8f0c0,#c8a040)", opacity: sep, transform: `scaleX(${sep})` }} />}
    <Prop id="kitchen_knife" x={900 + 100} y={700 + 240 * cut - 300 * sep} w={760} r={-90} sh={0} />
    <Prop id="granules" x={1500} y={1000} w={360} />
    <Prop id="queen_ant" x={1500} y={780 - 30 * Math.sin(tt * 3)} w={200 * eio(tt, 2.4, 3.0) + 1} sh={0} />
  </Cam>;
}} />;

// m19 · el lago en lámina inclinada: el río rojo baja desde la fábrica y tiñe el lago; el pez flota
const HLakeMap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d * 0.65), fish = eio(tt, d * 0.65, d * 0.65 + 1.0);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 160, top: 140, width: 1600, height: 780, background: "linear-gradient(#e8dcc0,#d0c09a)", transform: "perspective(1600px) rotateX(24deg)", boxShadow: "0 30px 40px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: 300, top: 160, width: 900, height: 320, borderRadius: "50% 45% 50% 40%", background: `linear-gradient(90deg,rgba(170,40,30,${0.8 * p}) ${p * 100}%, #6a9ab0 ${p * 100 + 10}%)`, boxShadow: "inset 0 0 30px rgba(0,0,0,.3)" }} />
      <svg width={1600} height={780} style={{ position: "absolute", inset: 0 }}><path d="M1400 700 Q1300 560 1200 400" stroke="#6a9ab0" strokeWidth={30} fill="none" /><path d="M1400 700 Q1300 560 1200 400" stroke="#b8281e" strokeWidth={30} fill="none" strokeDasharray={420} strokeDashoffset={420 * (1 - eio(tt, 0.2, 1.2))} /></svg></div>
    <Prop id="mirex_can" x={1560} y={1000} w={260} />
    <Prop id="fish" x={760} y={540 - 40 * fish} w={340} r={180 * fish} sh={0} o={eio(tt, d * 0.6, d * 0.65)} />
  </Cam>;
}} />;

// m20 · la hoja de registro: el sello CANCELLED baja y aplasta; la lata se cae de lado
const HCancelStamp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hit = d * 0.4, tip = eio(tt, hit + 0.1, hit + 0.7);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={820} />
    <div style={{ position: "absolute", left: 420, top: 200, width: 1080, height: 720, background: "repeating-linear-gradient(180deg,transparent 0 54px,rgba(0,0,0,.08) 54px 56px), linear-gradient(#fbf6ea,#eadfc2)", boxShadow: "0 30px 40px rgba(0,0,0,.45)", transform: "perspective(1600px) rotateX(16deg) rotate(-2deg)", clipPath: "polygon(0 0,100% 0,100% 88%,92% 100%,0 100%)" }}>
      <div style={{ position: "absolute", left: 80, top: 70, fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#2a2a2a" }}>MIREX · REG. 1962</div></div>
    <Sello tt={tt} at={hit} x={960} y={560} txt="CANCELLED" size={140} r={-10} />
    <Prop id="mirex_can" x={1620 + 60 * tip} y={1020} w={280} r={88 * tip} />
    <Word tt={tt} at={hit + 1.4} x={960} y={140} txt="1978" size={140} />
  </Cam>;
}} />;

// m21 · el cuentakilómetros sube de 9 a 15 estados mientras el mapa se tiñe
const HOdometer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1.0);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={880} />
    <div style={{ position: "absolute", left: 260, top: 160, display: "flex", flexWrap: "wrap", width: 1400, gap: 14 }}>{Array.from({ length: 15 }, (_, k) => <div key={k} style={{ width: 170, height: 120 + (k % 4) * 16, background: k < 9 + 6 * p ? "#b81e1e" : "#cfc4a8", clipPath: "polygon(8% 0,92% 10%,100% 72%,72% 100%,0 86%)", boxShadow: "0 6px 10px rgba(0,0,0,.35)", transition: "none" }} />)}</div>
    <div style={{ position: "absolute", left: 660, top: 700, width: 600, height: 220, borderRadius: 24, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 24px 40px rgba(0,0,0,.6)" }} />
    <Odo x={960} y={810} v={9 + 6 * p} n={2} size={150} />
    <Word tt={tt} at={d - 1.0} x={960} y={110} txt="370 MILLION ACRES" size={100} />
  </Cam>;
}} />;

// m22 · la balanza: una hormiga en un platillo; del otro caen codorniz, pez, leche, dinero — y la hormiga igual pesa más
const HPayScale: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), B = [0.6, bt(h, 0, d * 0.3), bt(h, 1, d * 0.55), bt(h, 2, d * 0.8)], ids = ["quail", "fish", "milk_bottle", "money_bundle"], n = B.filter((b) => tt > b).length, tilt = -10 + 3 * n + swing(tt, B[Math.max(0, n - 1)], 3, 5, 1.5);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="balance_scale" x={960} y={1020} w={1100} style={{ transform: `rotate(${tilt * 0.3}deg)` }} />
    <Ant tt={tt} x={620} y={560 + tilt * 8} w={180} />
    {ids.map((id, k) => tt > B[k] && <Drop key={id} tt={tt} at={B[k]} id={id} x={1300 + (k % 2) * 60} y={560 - tilt * 8 - k * 40} w={160} h={400} dust={false} />)}
  </Cam>;
}} />;

// m23 · año por año: el taco de almanaque; cada hoja se arranca y vuela a clavarse en el corcho
const YA = ["1918", "1930s", "1942", "1957", "1958", "1959", "1962", "1978"];
const HTimelineRail: C = ({ t, h }) => <S t={t} h={h} bg={CORK} f={(tt) => {
  const d = D(h), B = YA.map((_, i) => i === 0 ? 0.4 : bt(h, i - 1, 0.4 + i * 2.6)), cur = B.filter((b) => tt >= b).length - 1;
  return <Cam tt={tt} d={d} z={0.05}>
    {YA.map((y, i) => { if (i > cur) return null; const p = eio(tt, B[i], B[i] + 0.7), x = 1500 + (180 + (i % 4) * 300 - 1500) * p, yy = 820 + (200 + Math.floor(i / 4) * 330 - 820) * p;
      return <div key={y} style={{ position: "absolute", left: x - 120, top: yy - 80, width: 240, height: 200, transform: `rotate(${(1 - p) * 30 + (i % 2 ? 3 : -3)}deg)`, background: "linear-gradient(#fbf6ea,#eadfc2)", boxShadow: "0 14px 20px rgba(0,0,0,.45)", borderTop: "22px solid #b8281e", fontFamily: SER, fontWeight: 900, fontSize: 64, color: "#1a1a1a", textAlign: "center", lineHeight: "170px" }}>{y}
        {p >= 1 && <div style={{ position: "absolute", left: 104, top: -36, width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff6a5a,#a01810)", boxShadow: "0 4px 4px rgba(0,0,0,.4)" }} />}</div>; })}
    <Prop id="calendar_pad" x={1500} y={1040} w={380} />
  </Cam>;
}} />;

// m24 · el método de dos pasos: dos peldaños; en el 1 se vuelca el cebo, en el 2 sólo el montículo malo
const HTwoStep: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, d * 0.45), b1 = bt(h, 1, d * 0.75), tip = eio(tt, 0.4, 1.2);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="wood_steps" x={960} y={1030} w={1300} />
    <Prop id="bait_bag" x={520} y={760} w={360} r={-40 * tip} />
    {tip > 0.5 && Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: 380 + rnd(k) * 400, top: 760 + rnd(k + 5) * 40, width: 8, height: 8, borderRadius: "50%", background: "#f4f0e0", opacity: eio(tt, 1.0 + k * 0.02, 1.2 + k * 0.02) }} />)}
    <Word tt={tt} at={0.4} x={520} y={300} txt="1" size={180} />
    {tt > b0 && <><Drop tt={tt} at={b0} id="ant_mound" x={1320} y={600} w={300} /><Prop id="sprayer" x={1560} y={620} w={260} r={-10} /><Word tt={tt} at={b0} x={1320} y={260} txt="2" size={180} /></>}
    {tt > b1 && <Prop id="soil_thermometer" x={960} y={1060 + 100 * (1 - eio(tt, b1, b1 + 0.6))} w={160} />}
  </Cam>;
}} />;

// m25 · la patada: la bota revienta el montículo; la reina se va más abajo y aparecen dos montículos nuevos
const HKickedMound: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), hit = 1.0, k = eio(tt, 0.2, hit), qd = eio(tt, hit + 0.6, hit + 2.0), nw = eio(tt, d * 0.65, d * 0.65 + 0.8);
  return <Cam tt={tt} d={d} z={0.06}>
    <Prop id="dirt_block" x={960} y={1080} w={1600} />
    <Prop id="ant_mound" x={960} y={500} w={520} sq={tt > hit ? 0.6 * Math.exp(-3 * (tt - hit)) : 0} />
    <Prop id="boot" x={500 + 420 * k} y={300 + 180 * k} w={420} r={-30 + 30 * k} sh={0} />
    <Dust tt={tt} at={hit} x={960} y={480} w={420} col="rgba(120,90,60,.85)" />
    <Prop id="queen_ant" x={960} y={640 + 300 * qd} w={160} sh={0} />
    {[0, 1].map((j) => <Prop key={j} id="ant_mound" x={460 + j * 1000} y={500} w={300 * nw + 1} o={nw} />)}
  </Cam>;
}} />;

// m26 · el corte de tierra: una reina a la izquierda; a la derecha muchas reinas en red de túneles
const HQueenNet: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), n = Math.floor(1 + 9 * eio(tt, d * 0.4, d - 1.0));
  return <Cam tt={tt} d={d} z={0.05}>
    <Prop id="dirt_block" x={960} y={1080} w={1700} />
    <div style={{ position: "absolute", left: 958, top: 300, width: 6, height: 700, background: "rgba(250,240,220,.6)" }} />
    <Prop id="queen_ant" x={480} y={760} w={220} sh={0} />
    <Glow x={480} y={720} r={150} o={0.6} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: n }, (_, k) => <path key={k} d={`M1440 400 Q${1100 + rnd(k) * 600} ${500 + rnd(k + 1) * 200} ${1100 + rnd(k + 2) * 700} ${560 + rnd(k + 3) * 380}`} stroke="#2a1a0a" strokeWidth={22} fill="none" opacity={0.7} />)}</svg>
    {Array.from({ length: n }, (_, k) => <Prop key={k} id="queen_ant" x={1100 + rnd(k + 2) * 700} y={600 + rnd(k + 3) * 380} w={120} sh={0} />)}
    <Word tt={tt} at={d * 0.45} x={1440} y={250} txt="100s / ACRE" size={110} />
  </Cam>;
}} />;

// m27 · macro: la mosca fórida baja en picada sobre la hormiga
const HPhoridFly: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dv = eio(tt, 0.4, 1.6), hov = 10 * Math.sin(tt * 30);
  return <Cam tt={tt} d={d} z={0.08}>
    <Prop id="dirt_block" x={960} y={1200} w={2200} style={{ filter: "blur(2px)" }} />
    <Ant tt={tt} x={900 + 60 * Math.sin(tt * 0.7)} y={900} w={760} />
    <Prop id="phorid_fly" x={1500 - 500 * dv} y={200 + 440 * dv + hov} w={300} r={-20 + 20 * dv} sh={0} />
    {dv >= 1 && <Glow x={980} y={650} r={120} o={0.4 + 0.3 * Math.sin(tt * 8)} col="255,240,200" />}
  </Cam>;
}} />;

// m28 · el reloj de arena: arriba el avioncito hundido; la arena cae y abajo aparece la mosca
const HHourglass: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), s = eio(tt, 0.2, d - 0.8);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={900} />
    <Prop id="hourglass" x={960} y={1020} w={520} />
    <Prop id="toy_plane" x={960} y={480 + 160 * s} w={160 * (1 - 0.5 * s)} o={1 - s} r={-20} sh={0} />
    <Prop id="phorid_fly" x={960} y={900} w={120 * s + 1} o={s} sh={0} />
    <Word tt={tt} at={0.5} x={420} y={420} txt="1957" size={140} out={d * 0.6} />
    <Word tt={tt} at={d * 0.6} x={1500} y={420} txt="40 YEARS" size={140} />
  </Cam>;
}} />;

// m29 · el fichero: la ficha sale del cajón y se da vuelta: pregunta → respuesta
const HQCards: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.3, 1.0), fl = eio(tt, d * 0.5, d * 0.5 + 0.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={880} />
    <Prop id="card_box" x={520} y={1020} w={620} />
    <div style={{ position: "absolute", left: 1200, top: 520, width: 900, height: 540, transform: `translate(-50%,-50%) translateY(${300 * (1 - up)}px) perspective(1600px) rotateY(${180 * fl}deg)`, transformStyle: "preserve-3d" }}>
      {[0, 1].map((f) => <div key={f} style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: f ? "rotateY(180deg)" : "none", background: "repeating-linear-gradient(180deg,transparent 0 64px,rgba(80,120,200,.3) 64px 66px), linear-gradient(#fbf6ea,#eee2c4)", borderTop: "10px solid #c84a3a", boxShadow: "0 30px 40px rgba(0,0,0,.5)", fontFamily: SER, fontWeight: 900, fontSize: 92, color: f ? "#1a5a2a" : "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>{f ? "IT WAS REAL." : "REAL THREAT?"}</div>)}</div>
    <Ant tt={tt} x={1500} y={1000} w={200} />
  </Cam>;
}} />;

// m30 · ¿quién está abajo?: el avión pasa; su sombra cruza el potrero y se detiene sobre la bota en el pasto
const HUnderneath: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), p = eio(tt, 0.2, d * 0.7), sx = -300 + 1300 * p;
  return <Cam tt={tt} d={d} z={0.08} fx={1000} fy={850}>
    <Pasto y0={420} />
    <Prop id="boot" x={1000} y={900} w={300} /><Prop id="tin_bucket" x={1180} y={910} w={180} />
    <div style={{ position: "absolute", left: sx - 260, top: 800, width: 520, height: 140, background: "rgba(0,0,0,.45)", filter: "blur(8px)", clipPath: "polygon(0 45%,40% 40%,45% 0,55% 0,60% 40%,100% 45%,100% 60%,60% 62%,56% 100%,44% 100%,40% 62%,0 60%)" }} />
    <Prop id="crop_duster" x={sx + 200} y={240} w={420} sh={0} />
    <Word tt={tt} at={d * 0.75} x={960} y={300} txt="WHO'S UNDERNEATH?" size={110} />
  </Cam>;
}} />;

// m31 · el resumen: la tira de película cuelga del proyector y el haz recorre los cuadros (objetos del video)
const HRecapReel: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 40%,#2a2420,#060504 75%)" f={(tt) => {
  const d = D(h), ids = ["cargo_ship", "ant_mound", "crop_duster", "quail", "milk_bottle", "phorid_fly"], off = -tt * 140;
  return <Cam tt={tt} d={d} z={0.05}>
    <Prop id="projector" x={300} y={760} w={480} />
    <div style={{ position: "absolute", left: 380, top: 380, width: 1500, height: 300, background: "linear-gradient(90deg,rgba(255,240,200,.35),rgba(255,240,200,.05))", clipPath: "polygon(0 45%,100% 0,100% 100%,0 55%)" }} />
    <div style={{ position: "absolute", left: 640, top: 380, width: 1280, height: 300, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: off % 1680, top: 0, display: "flex", gap: 0 }}>{[...ids, ...ids, ...ids].map((id, k) => <div key={k} style={{ position: "relative", width: 280, height: 300, background: "#1a1410", borderLeft: "14px solid #0a0806", borderRight: "14px solid #0a0806" }}>
        <div style={{ position: "absolute", left: 10, top: 40, width: 232, height: 220, background: "linear-gradient(#e8dcc0,#b8a878)", overflow: "hidden" }}><Prop id={id} x={116} y={200} w={200} sh={0} /></div></div>)}</div></div>
  </Cam>;
}} />;

export const HCA4: Record<string, C> = {
  planeDust: HPlaneDust, caseFile: HCaseFile, riceScale: HRiceScale, portRoute: HPortRoute, notebook: HNotebook, moundMower: HMoundMower,
  newsMenace: HNewsMenace, moneyStack: HMoneyStack, lastAnt: HLastAnt, acreSquare: HAcreSquare, warnLetters: HWarnLetters, quailTally: HQuailTally,
  milkBottle: HMilkBottle, tugOfWar: HTugOfWar, antArena: HAntArena, bookChapter: HBookChapter, valveShut: HValveShut, purse: HPurse, baitGrain: HBaitGrain,
  lakeMap: HLakeMap, cancelStamp: HCancelStamp, odometer: HOdometer, payScale: HPayScale, timelineRail: HTimelineRail, twoStep: HTwoStep,
  kickedMound: HKickedMound, queenNet: HQueenNet, phoridFly: HPhoridFly, hourglass: HHourglass, qCards: HQCards, underneath: HUnderneath, recapReel: HRecapReel,
};
