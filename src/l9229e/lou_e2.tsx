// l9229e «Fears» · parte 2: el sótano de la iglesia, el granero, el celular en la caja, la rutina de cinco pasos, el segundo baile y las cartas
import React from "react";
import { cl, eio } from "./hkit";
import { S, D, bt, C, Prop, Cam, Mesa, Glow, Rings, land, swing, rnd } from "./pk";
import { Fondo } from "./lk";

const WOODTOP = "repeating-linear-gradient(90deg,rgba(0,0,0,.10) 0 3px,transparent 3px 160px),repeating-linear-gradient(90deg,rgba(255,230,190,.05) 0 1px,transparent 1px 23px),linear-gradient(180deg,#b08250,#8a6036)";
const HAND = "'Segoe Print','Bradley Hand','Comic Sans MS',cursive";
const Steam: React.FC<{ tt: number; x: number; y: number; s?: number; o?: number }> = ({ tt, x, y, s = 1, o = 1 }) => <>{[0, 1, 2].map((k) => { const p = ((tt * 0.45 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: x - 60 * s + 40 * Math.sin(tt * 1.5 + k * 2) * s, top: y - 320 * p * s, width: 120 * s, height: 180 * s, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.55), rgba(255,255,255,0) 70%)", opacity: o * Math.sin(p * Math.PI), filter: "blur(10px)" }} />; })}</>;
// pantalla de celular encima del prop smartphone (x,y = base del prop, w = ancho del prop)
const Pantalla: React.FC<{ x: number; y: number; w: number; children?: React.ReactNode; bg?: string }> = ({ x, y, w, children, bg = "#101418" }) => { const H = w * 2.02; return <div style={{ position: "absolute", left: x - w * 0.43, top: y - H * 0.95, width: w * 0.86, height: H * 0.9, borderRadius: w * 0.07, background: bg, overflow: "hidden" }}>{children}</div>; };

// «like they'd been saving my seat»: en la mesa larga hay un hueco; una silla plegable se abre sola en ese lugar y un saco de lana cae sobre el respaldo
const HSavedChair: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.4, 1.0), L = land(tt, bt(h, 0, 1.4), 500, 9, 0.45);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="le_e14" tt={tt} b={12} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 880, width: 1920, height: 200, background: "linear-gradient(#5a4632,#2e2216)" }} />
    {[260, 1660].map((x, k) => <Prop key={k} id="folding_chair" x={x} y={980} w={320} o={0.85} style={{ filter: "brightness(.7)" }} />)}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 980px", transform: `scaleX(${0.12 + 0.88 * op}) rotate(${(1 - op) * -6}deg)` }}>
      <Prop id="folding_chair" x={960} y={980} w={420} />
    </div>
    {L.on && <Prop id="wool_coat" x={960} y={900 + L.dy} w={330} sq={L.sq} sh={0.5} />}
    <Glow x={960} y={700} r={420} o={0.4 * op} />
  </Cam>;
}} />;

// «Pick the hardest hour of your day»: una taza de café humeando y alrededor un anillo de 60 marcas que se van llenando, minuto a minuto, despacio
const HSlowCup: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 0.4), R = 360;
  return <Cam tt={tt} d={d} z={0.06} fy={560}>
    <div style={{ position: "absolute", inset: 0, background: WOODTOP }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 52%, rgba(255,230,180,.25), rgba(0,0,0,.5) 70%)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 60 }, (_, k) => { const a = (k / 60) * Math.PI * 2 - Math.PI / 2, on = k / 60 < p, L0 = k % 5 ? 22 : 40; return <line key={k} x1={960 + Math.cos(a) * R} y1={560 + Math.sin(a) * R} x2={960 + Math.cos(a) * (R + L0)} y2={560 + Math.sin(a) * (R + L0)} stroke={on ? "#f4d27a" : "rgba(255,255,255,.25)"} strokeWidth={k % 5 ? 6 : 10} strokeLinecap="round" />; })}
    </svg>
    <Prop id="coffee_cup" x={960} y={760} w={440} />
    <Steam tt={tt} x={960} y={500} s={1.1} o={0.8} />
  </Cam>;
}} />;

// «with June's napkins»: una servilleta de tela se dobla sola sobre la mesa: a la mitad, en triángulo, y queda junto al plato
const HNapkinFold: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), f1 = eio(tt, 0.5, 1.1), f2 = eio(tt, bt(h, 0, 1.5), bt(h, 0, 1.5) + 0.6), W = 640;
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", inset: 0, background: WOODTOP }} />
    <Prop id="dinner_plate" x={1380} y={860} w={520} sh={0.6} />
    <div style={{ position: "absolute", left: 640 - W / 2, top: 540 - W / 2, width: W, height: W, transformStyle: "preserve-3d", perspective: 1600 }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,rgba(255,255,255,.0) 0 38px,rgba(180,40,40,.35) 38px 44px),repeating-linear-gradient(90deg,rgba(255,255,255,0) 0 38px,rgba(180,40,40,.35) 38px 44px),#f6efe2", clipPath: f2 > 0 ? `polygon(0 ${50 * f1}%,100% ${50 * f1}%,100% 100%,${50 * f2}% 100%,0 ${100 - 50 * f2}%)` : `polygon(0 ${50 * f1}%,100% ${50 * f1}%,100% 100%,0 100%)`, boxShadow: "0 20px 30px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: W / 2, transformOrigin: "50% 100%", transform: `rotateX(${-180 * f1}deg)`, background: f1 > 0.5 ? "#e8decb" : "#f6efe2", opacity: f1 >= 1 ? 0 : 1, boxShadow: "0 10px 20px rgba(0,0,0,.25)" }} />
    </div>
  </Cam>;
}} />;

// «not when the barn burned in 1944»: el granero de noche con el resplandor naranja que late lento y brasas que suben al cielo
const HBarnGlow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fl = 0.8 + 0.2 * Math.sin(tt * 2 * Math.PI * 1.2) * Math.sin(tt * 2.3);
  return <Cam tt={tt} d={d} z={0.07} fy={560}>
    <Fondo id="le_e15" tt={tt} b={1} br={0.45 + 0.15 * fl} />
    <Glow x={960} y={640} r={620} o={0.7 * fl} col="255,120,40" />
    {Array.from({ length: 30 }, (_, k) => { const p = ((tt * (0.18 + rnd(k) * 0.12) + rnd(k + 9)) % 1); return <div key={k} style={{ position: "absolute", left: 700 + rnd(k + 2) * 520 + 80 * Math.sin(p * 6 + k), top: 760 - 760 * p, width: 8, height: 8, borderRadius: "50%", background: "#ffb050", boxShadow: "0 0 12px #ff8020", opacity: Math.sin(p * Math.PI) }} />; })}
  </Cam>;
}} />;

// «I'd go out to the wood shop and close the door»: la puerta del taller se cierra en perspectiva y la franja de luz se angosta hasta apagarse
const HShopDoor: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.6, Math.min(d - 0.8, 2.4));
  return <div style={{ position: "absolute", inset: 0, background: "#0e0a06" }}>
    <div style={{ position: "absolute", left: 560, top: 120, width: 800, height: 900, overflow: "hidden" }}>
      <Fondo id="le_e17" tt={tt} b={2} br={0.7} />
    </div>
    <div style={{ position: "absolute", left: 560, top: 120, width: 800, height: 900, perspective: 1800 }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `rotateY(${-100 + 100 * p}deg)`, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.25) 0 4px,transparent 4px 133px),linear-gradient(90deg,#6a4a2a,#4a3018)", boxShadow: "inset 0 0 60px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", right: 60, top: 440, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#f0d080,#6a4410)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 540, top: 100, width: 840, height: 940, boxShadow: "0 0 0 30px #2a1c10, inset 0 0 40px rgba(0,0,0,.8)" }} />
    <div style={{ position: "absolute", left: 1360, top: 120, width: 400 * (1 - p), height: 960, background: "linear-gradient(90deg,rgba(255,210,140,.35),rgba(255,210,140,0))", transformOrigin: "0 0", transform: "skewY(8deg)" }} />
  </div>;
}} />;

// «She hands me a tissue before the credits»: la caja de pañuelos cae en el apoyabrazos con la luz del televisor; un pañuelo sale y flamea
const HTissuePull: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.3, 500, 9, 0.42), pu = eio(tt, bt(h, 0, 1.2), bt(h, 0, 1.2) + 0.5), fl = Math.sin(tt * 5) * 8 * pu;
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="le_e18" tt={tt} b={10} br={0.4 + 0.08 * Math.sin(tt * 3)} />
    <Glow x={1600} y={400} r={600} o={0.35} col="140,180,255" />
    <Mesa y0={800} tone="#7a5a3e" />
    {L.on && <div style={{ position: "absolute", inset: 0, transform: `translateY(${L.dy}px)` }}>
      <div style={{ position: "absolute", left: 960 - 110, top: 700 - 300 * pu, width: 220, height: 320, background: "linear-gradient(#ffffff,#eef0f2)", clipPath: "polygon(10% 100%,0 30%,25% 0,50% 15%,75% 0,100% 30%,90% 100%)", transformOrigin: "50% 100%", transform: `rotate(${fl}deg) skewX(${fl * 0.8}deg)`, opacity: pu > 0 ? 1 : 0, filter: "drop-shadow(6px 10px 10px rgba(0,0,0,.3))" }} />
      <Prop id="tissue_box" x={960} y={1000} w={560} sq={L.sq} />
    </div>}
  </Cam>;
}} />;

// «it sat in the drawer of that hutch still in the box»: la caja blanca del celular sube del cajón; la tapa se levanta y se ve el teléfono nuevo, sin usar
const HPhoneBox: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.3, 1.0), lid = eio(tt, bt(h, 0, 1.4), bt(h, 0, 1.4) + 0.6);
  return <Cam tt={tt} d={d} z={0.07} fy={620}>
    <Fondo id="le_e19" tt={tt} b={10} br={0.45} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 820, overflow: "hidden" }}>
      <Prop id="phone_box" x={960} y={1260 - 460 * up} w={620} />
      {lid > 0 && <Prop id="smartphone" x={960} y={1110 - 460 * up - 180 * lid} w={220} sh={0} r={-8 * lid} />}
    </div>
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 3px,transparent 3px 240px),linear-gradient(#6a4628,#3e2614)", boxShadow: "0 -8px 20px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 960 - 50, top: 90, width: 100, height: 26, borderRadius: 13, background: "linear-gradient(#e8c870,#8a6020)" }} />
    </div>
    <Glow x={960} y={600} r={380} o={0.4 * lid} />
  </Cam>;
}} />;

// «the green one, to make a call»: primer plano del celular con el botón verde que late; el dedo baja, lo toca y salen ondas
const HGreenButton: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tap = bt(h, 0, 1.5), fd = tt < tap ? eio(tt, 0.6, tap) : 1 - 0.3 * eio(tt, tap, tap + 0.3), pul = 1 + 0.08 * Math.sin(tt * 6), X = 960, Y = 1060, W = 520;
  return <Cam tt={tt} d={d} z={0.05} fy={760}>
    <div style={{ position: "absolute", inset: 0, background: WOODTOP }} />
    <Prop id="smartphone" x={X} y={Y} w={W} sh={1} />
    <Pantalla x={X} y={Y} w={W} bg="linear-gradient(#20262e,#0e1216)">
      <div style={{ position: "absolute", left: "50%", bottom: "14%", width: 150, height: 150, marginLeft: -75, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#6ce07a,#1f9a3a)", transform: `scale(${tt > tap ? 1.15 - 0.15 * eio(tt, tap, tap + 0.4) : pul})`, boxShadow: "0 0 40px rgba(80,220,110,.7)" }} />
    </Pantalla>
    <Rings tt={tt} at={tap} x={X} y={Y - 250} s={1.2} />
    <Prop id="hand_pinch" x={X + 210 + 400 * (1 - fd)} y={1010 + 300 * (1 - fd)} w={520} sh={0} r={-20} />
  </Cam>;
}} />;

// «from her house 200 miles away»: el camino entre los maizales; una línea punteada avanza por la ruta y las millas cuentan hasta 200
const HMilesRoad: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 0.6), n = Math.round(200 * p);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="le_e27" tt={tt} b={0} br={0.6} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M960 1080 C 980 860, 900 760, 940 620 S 1000 480, 980 420" fill="none" stroke="#ffd860" strokeWidth={14} strokeLinecap="round" strokeDasharray="0.03 0.025" pathLength={1} strokeDashoffset={-tt * 0.05} style={{ clipPath: `inset(${(1 - p) * 100}% 0 0 0)` }} />
    </svg>
    <div style={{ position: "absolute", left: 1220, top: 380, width: 380, padding: "18px 24px", background: "#2a6a3a", border: "8px solid #f2f2e8", borderRadius: 18, color: "#f2f2e8", fontFamily: "'Arial Narrow',Arial,sans-serif", fontWeight: 800, textAlign: "center", boxShadow: "0 20px 30px rgba(0,0,0,.45)", transform: `rotate(-3deg) translateY(${-30 * Math.exp(-4 * tt) * Math.sin(tt * 18)}px)` }}>
      <div style={{ fontSize: 120, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 46 }}>MILES</div>
    </div>
  </Cam>;
}} />;

// «came over from Norway on a boat»: el vapor cruza el mar entre olas en capas que se mueven a distinta velocidad, cabeceando
const HSteamerSea: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), x = -300 + 2400 * (tt / d), wave = (y: number, amp: number, sp: number, col: string, k: number) => { let s = `M0 1080 L0 ${y}`; for (let i = 0; i <= 48; i++) s += ` L${i * 40} ${y + amp * Math.sin(i * 0.5 + tt * sp + k)}`; return <path key={k} d={s + " L1920 1080 Z"} fill={col} />; };
  return <div style={{ position: "absolute", inset: 0 }}>
    <Fondo id="le_e20" tt={tt} b={14} br={0.5} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(180,200,220,.2),rgba(30,50,70,.5))" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{wave(780, 14, 1.2, "#3a5a74", 1)}</svg>
    <Prop id="steamship" x={x} y={830 + 10 * Math.sin(tt * 1.6)} w={760} sh={0} r={2.5 * Math.sin(tt * 1.6 + 1)} />
    {Array.from({ length: 5 }, (_, k) => { const p = ((tt * 0.4 + k / 5) % 1); return <div key={k} style={{ position: "absolute", left: x - 40 - 200 * p, top: 520 - 200 * p, width: 90 + 140 * p, height: 90 + 140 * p, borderRadius: "50%", background: "rgba(90,90,90,.5)", opacity: 1 - p, filter: "blur(8px)" }} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{wave(860, 20, 1.8, "#2a4a62", 2)}{wave(950, 26, 2.4, "#1c3448", 3)}</svg>
  </div>;
}} />;

// «I sent one of my meatloaf last week»: en el celular aparece la foto del pan de carne, se achica a miniatura y sale disparada hacia arriba dejando estela
const HPhotoSend: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), snap = eio(tt, 0.4, 0.8), go = bt(h, 0, 1.6), q = cl((tt - go) / 0.7), X = 760, Y = 1060, W = 500;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="le_e25" tt={tt} b={14} br={0.45} />
    <Prop id="smartphone" x={X} y={Y} w={W} />
    <Pantalla x={X} y={Y} w={W} bg="#f2f2f2">
      <div style={{ position: "absolute", inset: 0, opacity: tt > 0.3 ? 1 : 0, background: `rgba(255,255,255,${1 - snap})` }} />
    </Pantalla>
    {snap > 0 && <div style={{ position: "absolute", left: X - 180 + (900 * q * q), top: 380 - 600 * q, width: 360 * (1 - 0.7 * q), height: 360 * (1 - 0.7 * q), transform: `rotate(${-10 * q}deg)`, opacity: 1 - cl((q - 0.85) / 0.15), background: "#f6f1e6", borderRadius: 12, boxShadow: "0 10px 20px rgba(0,0,0,.35)", overflow: "hidden" }}>
      <Prop id="meatloaf_pan" x={180 * (1 - 0.7 * q)} y={1080 - 60 * (1 - 0.7 * q)} w={330 * (1 - 0.7 * q)} sh={0} />
    </div>}
    {q > 0 && q < 1 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M${X} 560 Q ${X + 300} 400 ${X + 900 * q * q} ${560 - 600 * q}`} stroke="rgba(255,255,255,.6)" strokeWidth={6} fill="none" strokeDasharray="14 12" /></svg>}
  </Cam>;
}} />;

// «I came to every ball game»: la pelota de béisbol llega en arco desde la izquierda y el guante la atrapa con un golpe seco hacia atrás
const HGloveCatch: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 1.2), p = cl((tt - 0.3) / (at - 0.3)), bx = -100 + (1250 + 100) * p, by = 700 - 420 * Math.sin(p * Math.PI) + 0 * p, rec = tt > at ? 40 * Math.exp(-6 * (tt - at)) * Math.cos(14 * (tt - at)) : 0;
  return <Cam tt={tt} d={d} z={0.06} fx={1200}>
    <Fondo id="le_e21" tt={tt} b={6} br={0.6} />
    <Prop id="baseball_glove" x={1300 + rec} y={900} w={560} sh={0} r={rec * 0.3} style={{ filter: "drop-shadow(12px 20px 16px rgba(0,0,0,.45))" }} />
    {tt < at ? (tt > 0.3 && <Prop id="baseball" x={bx} y={by + 80} w={130} sh={0} r={tt * 900} />) : <Prop id="baseball" x={1240 + rec} y={760} w={130} sh={0} r={20} />}
  </Cam>;
}} />;

// «saying them felt like stepping off a roof»: desde el borde del techo la cámara se inclina hacia abajo con vértigo; las puntas de las botas asoman al vacío
const HRoofEdge: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), v = eio(tt, 0.2, d - 0.5);
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1.05 + 0.25 * v}) rotate(${3 * Math.sin(tt * 0.9) * v}deg)`, transformOrigin: "50% 70%" }}>
      <Fondo id="le_e22" tt={tt} b={0} br={0.6} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 860 + 120 * v, width: 1920, height: 300, background: "repeating-linear-gradient(90deg,#4a4a4a 0 140px,#3a3a3a 140px 146px)", boxShadow: "0 -10px 30px rgba(0,0,0,.6)" }} />
    <Prop id="work_boots" x={960} y={1010 + 120 * v} w={760} sh={1.2} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,.6))" }} />
  </div>;
}} />;

// «say them at the end of a phone call»: el teléfono de disco; el disco gira marcando y el cable en espiral rebota como un resorte
const HWallPhone: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dial = (k: number) => { const a = 0.4 + k * 0.7; return tt < a ? 0 : tt < a + 0.3 ? 120 * eio(tt, a, a + 0.3) : 120 * (1 - eio(tt, a + 0.3, a + 0.6)); }, ang = dial(0) + dial(1) + dial(2), b = 30 * Math.sin(tt * 4) * Math.exp(-0.3 * tt);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="le_e23" tt={tt} b={12} br={0.5} />
    <Mesa y0={800} tone="#8a6440" />
    <Prop id="rotary_phone" x={800} y={1000} w={640} />
    <div style={{ position: "absolute", left: 800 - 120, top: 760 - 120, width: 240, height: 240, borderRadius: "50%", border: "16px solid rgba(240,240,240,.85)", borderTopColor: "transparent", transform: `rotate(${ang}deg)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={(() => { let s = "M1050 880"; for (let i = 0; i <= 60; i++) { const q = i / 60, x = 1050 + 500 * q, y = 880 - 200 * Math.sin(q * Math.PI) + b * Math.sin(q * Math.PI); s += ` L${x + 18 * Math.cos(i * 1.4)} ${y + 18 * Math.sin(i * 1.4)}`; } return s; })()} fill="none" stroke="#1a1a1a" strokeWidth={8} strokeLinecap="round" />
    </svg>
  </Cam>;
}} />;

// «Step one, name it»: un lápiz escribe en la libreta, a mano, la palabra del miedo: SCARED — y la subraya
const HNameIt: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, 1.8), u = eio(tt, 1.9, 2.3);
  return <Cam tt={tt} d={d} z={0.08} fx={600 + 720 * p} fy={560}>
    <div style={{ position: "absolute", inset: 0, background: WOODTOP }} />
    <Prop id="notebook_open" x={960} y={1060} w={1400} />
    <div style={{ position: "absolute", left: 560, top: 420, fontFamily: HAND, fontSize: 190, color: "#2a2a3a", clipPath: `inset(0 ${100 - 100 * p}% 0 0)`, transform: "rotate(-2deg)" }}>scared</div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d="M560 700 q380 -26 760 0" stroke="#b02020" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${u} 1`} /></svg>
    <Prop id="pencil" x={600 + 720 * (u > 0 ? u : p) + 90} y={680 + 300} w={160} r={30} sh={0.3} />
  </Cam>;
}} />;

// «Step two. Shrink it»: una escalera altísima ocupa el cuadro y se encoge con resorte hasta quedar del tamaño de un escalón
const HShrinkIt: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 1.0), k = tt < at ? 1 : 0.25 + 0.75 * Math.exp(-3 * (tt - at)) * Math.cos(9 * (tt - at)) * 0.3 + 0.75 * Math.exp(-3 * (tt - at)) * 0.7;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="le_e30" tt={tt} b={14} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 920, width: 1920, height: 160, background: "linear-gradient(#5a7a3a,#3a5a24)" }} />
    <Prop id="ladder" x={960} y={980} w={700 * Math.max(0.2, k)} />
    <Glow x={960} y={900} r={300} o={0.4 * cl((tt - at) / 0.6)} />
  </Cam>;
}} />;

// «Step three. Set the time»: el reloj de pared y una cuña roja que se pinta sobre la esfera marcando el rato elegido
const HSetTime: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.5, 1.6), CX = 960, CY = 520, R = 300;
  return <Cam tt={tt} d={d} z={0.06} fy={CY}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#e8dcc4,#c8b898)" }} />
    <Prop id="wall_clock" x={CX} y={CY + R * 1.02} w={R * 2.04} sh={0} style={{ filter: "drop-shadow(16px 26px 20px rgba(0,0,0,.4))" }} />
    <div style={{ position: "absolute", left: CX - R * 0.6, top: CY - R * 0.6, width: R * 1.2, height: R * 1.2, borderRadius: "50%", background: `conic-gradient(from 0deg, rgba(200,40,30,.75) ${90 * p}deg, #f4f1ea ${90 * p}deg)` }} />
    <div style={{ position: "absolute", left: CX - 6, top: CY - R * 0.62, width: 12, height: R * 0.64, background: "#1a1a1a", borderRadius: 6, transformOrigin: "50% 100%", transform: `rotate(${90 * p}deg)` }} />
    <div style={{ position: "absolute", left: CX - 6, top: CY - R * 0.62, width: 12, height: R * 0.64, background: "#1a1a1a", borderRadius: 6, transformOrigin: "50% 100%" }} />
    <div style={{ position: "absolute", left: CX - 16, top: CY - 16, width: 32, height: 32, borderRadius: "50%", background: "#1a1a1a" }} />
  </Cam>;
}} />;

// «Count one, two, three, four, five, and open the car door»: dentro del auto, cinco dedos de luz se encienden de a uno y en el cinco la puerta se abre a la luz
const HCountOpen: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = Math.min(0.55, (d - 1.6) / 6), op = eio(tt, 0.4 + 5 * step, 0.4 + 5 * step + 0.7);
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <Fondo id="le_e01" tt={tt} b={4} br={0.35} />
    {[0, 1, 2, 3, 4].map((k) => { const at = 0.4 + k * step, s = tt < at ? 0 : 1 + 0.4 * Math.exp(-8 * (tt - at)) * Math.cos(20 * (tt - at)); return <div key={k} style={{ position: "absolute", left: 300 + k * 270, top: 300, width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fff4d0,#e0a840)", color: "#3a2410", fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 150, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s * (1 - op)})`, boxShadow: "0 0 40px rgba(255,200,100,.6)" }}>{k + 1}</div>; })}
    <div style={{ position: "absolute", left: 1920 - 1920 * op, top: 0, width: 1920, height: 1080, overflow: "hidden", transformOrigin: "100% 50%", transform: `perspective(1600px) rotateY(${-30 * (1 - op)}deg)`, boxShadow: "-40px 0 80px rgba(255,220,160,.7)" }}><Fondo id="le_e13" tt={tt} b={0} br={0.95} /><div style={{ position: "absolute", inset: 0, background: `rgba(255,236,200,${0.6 - 0.5 * op})` }} /></div>
  </div>;
}} />;

// «write down what happened. One line»: una ficha en blanco; el lápiz traza un solo renglón y al final un tilde
const HWriteLine: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 400, 10, 0.4), p = eio(tt, 0.7, 1.9), ck = eio(tt, 2.0, 2.4), px = 560 + 700 * p + 120 * ck, py = 560 - 40 * ck;
  return <Cam tt={tt} d={d} z={0.08} fx={px} fy={600}>
    <div style={{ position: "absolute", inset: 0, background: WOODTOP }} />
    {L.on && <div style={{ position: "absolute", left: 460, top: 300 + L.dy, width: 1000, height: 560, background: "repeating-linear-gradient(transparent 0 78px,rgba(70,110,180,.35) 78px 81px),#fbf8f0", borderTop: "10px solid #e05050", boxShadow: "0 24px 40px rgba(0,0,0,.4)", transform: "rotate(-2deg)" }} />}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-2deg)" }}>
      <path d="M560 560 q40 -30 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t60 0" stroke="#2a2a3a" strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
      <path d="M1300 540 l30 36 l60 -90" stroke="#2a8a3a" strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${ck} 1`} />
    </svg>
    <Prop id="pencil" x={px + 70} y={py + 300} w={150} r={28} sh={0.3} />
  </Cam>;
}} />;

// «He'd walk into a burning barn for a calf»: un farol se balancea en la mano y avanza hacia el granero oscuro; su círculo de luz encuentra al ternero
const HCalfLantern: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.2, d - 0.4), lx = 1500 - 700 * p, ly = 560 + 20 * Math.sin(tt * 3), a = 10 * Math.sin(tt * 3);
  return <div style={{ position: "absolute", inset: 0 }}>
    <Fondo id="le_e29" tt={tt} b={0} br={0.95} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle ${560 + 50 * Math.sin(tt * 2)}px at ${lx}px ${ly + 60}px, rgba(0,0,0,0), rgba(0,0,0,.92) 80%)` }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${lx}px 200px`, transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: lx - 3, top: 200, width: 6, height: ly - 280, background: "#2a2a2a" }} />
      <Prop id="barn_lantern" x={lx} y={ly + 160} w={220} sh={0} />
    </div>
    <Glow x={lx} y={ly + 60} r={240} o={0.7} col="255,190,90" />
  </div>;
}} />;

// «there was another dance»: en el salón, la bota de campo y el zapatito azul se deslizan uno hacia el otro y se encuentran en el centro del foco
const HSecondDance: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.5, bt(h, 0, 2.0)), lt = eio(tt, 0, 0.6);
  return <Cam tt={tt} d={d} z={0.07} fy={820}>
    <Fondo id="le_e04" tt={tt} b={8} br={0.3} />
    <div style={{ position: "absolute", left: 960 - 520, top: 680, width: 1040, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,240,200,.55), rgba(255,240,200,0) 70%)", opacity: lt }} />
    <Prop id="work_boots" x={200 + 520 * p} y={960} w={440} />
    <Prop id="dress_shoe" x={1720 - 520 * p} y={950} w={300} flip />
    {p >= 1 && <Glow x={960} y={880} r={260} o={0.6 * cl((tt - bt(h, 0, 2.0)) / 0.4)} />}
  </Cam>;
}} />;

// «well, I'll teach you»: vista cenital del piso: huellas de zapatos aparecen en el cuadrado del vals, uno-dos-tres, una y otra vez
const HWaltzSteps: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), P = [[760, 760, 0], [960, 560, 30], [760, 560, 0], [960, 360, -10], [1160, 360, 0], [1160, 560, 20]], step = Math.min(0.5, (d - 1) / 7);
  const Shoe = ({ x, y, r, o, L }: { x: number; y: number; r: number; o: number; L: boolean }) => <svg width={120} height={200} style={{ position: "absolute", left: x - 60, top: y - 100, transform: `rotate(${r}deg) scaleX(${L ? -1 : 1})`, opacity: o }}><ellipse cx={60} cy={70} rx={42} ry={62} fill="rgba(40,30,20,.75)" /><ellipse cx={64} cy={160} rx={30} ry={34} fill="rgba(40,30,20,.75)" /></svg>;
  return <Cam tt={tt} d={d} z={0.06} fy={560}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 120px),linear-gradient(#c89a62,#a87a46)" }} />
    {P.map(([x, y, r], k) => { const at = 0.4 + k * step; return tt < at ? null : <Shoe key={k} x={x} y={y} r={r} o={cl((tt - at) / 0.12) * (1 - 0.5 * cl((tt - at - 2.5) / 1))} L={k % 2 === 0} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {P.slice(0, -1).map(([x, y], k) => { const [x2, y2] = P[k + 1], at = 0.4 + (k + 1) * step; return tt < at ? null : <line key={k} x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(255,250,230,.6)" strokeWidth={4} strokeDasharray="10 10" />; })}
    </svg>
    <Glow x={960} y={560} r={420} o={0.3} />
  </Cam>;
}} />;

// «with that record player, Tennessee Waltz, over and over»: el brazo del tocadiscos baja sobre el disco que gira y salen ondas del surco
const HNeedleDrop: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), arm = eio(tt, 0.4, 1.1), ang = 200 * tt, CX = 860, CY = 560, R = 380;
  return <Cam tt={tt} d={d} z={0.07} fx={CX + 250} fy={CY}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#5a3a22,#3a2414)" }} />
    <div style={{ position: "absolute", left: CX - R - 40, top: CY - R - 40, width: 2 * R + 80, height: 2 * R + 80, borderRadius: 30, background: "#2a2a2a", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
    <Prop id="vinyl_record" x={CX} y={CY + R} w={2 * R} sh={0} r={ang} style={{ transformOrigin: "50% 50%" }} />
    <div style={{ position: "absolute", left: CX - R, top: CY - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: `conic-gradient(from ${ang}deg, rgba(255,255,255,0), rgba(255,255,255,.22) 6%, rgba(255,255,255,0) 12%, rgba(255,255,255,0) 50%, rgba(255,255,255,.18) 56%, rgba(255,255,255,0) 62%)`, mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", left: CX - 80, top: CY - 80, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(#111 0 9%, #c0392b 10% 100%)", transform: `rotate(${ang}deg)` }} />
    <div style={{ position: "absolute", left: CX + R + 60, top: CY - R + 20, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#d8d8d8,#5a5a5a)" }} />
    <div style={{ position: "absolute", left: CX + R + 82, top: CY - R + 50, width: 16, height: 560, background: "linear-gradient(90deg,#bdbdbd,#f2f2f2,#9a9a9a)", borderRadius: 8, transformOrigin: "50% 0", transform: `rotate(${12 + 26 * arm}deg)`, boxShadow: "10px 10px 14px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: -22, bottom: -40, width: 60, height: 70, background: "#222", borderRadius: 8 }} />
    </div>
    {arm >= 1 && <Rings tt={tt} at={1.1} x={CX + 200} y={CY + 200} s={1.2} />}
  </Cam>;
}} />;

// «she found that record in the cabinet»: las fundas del armario pasan una por una, volteándose, hasta que una sale hacia adelante con luz
const HSleeveCabinet: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 7, fp = 0.3 + 0.22 * N, pull = eio(tt, fp, fp + 0.7), COL = ["#c8b8a0", "#a8b8c8", "#d0a8a0", "#b8c8a8", "#c8c0a0", "#b0a8c8", "#e8d4a0"];
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="le_e26" tt={tt} b={12} br={0.45} />
    <div style={{ position: "absolute", left: 460, top: 640, width: 1000, height: 440, background: "linear-gradient(#5a3a22,#3a2414)", boxShadow: "inset 0 20px 40px rgba(0,0,0,.6)" }} />
    {Array.from({ length: N }, (_, k) => { const at = 0.3 + k * 0.22, f = eio(tt, at, at + 0.25), last = k === N - 1, s = last ? 1 + 0.4 * pull : 1, y = last ? 700 - 300 * pull : 700; return <div key={k} style={{ position: "absolute", left: 960 - 260 * s, top: y - 260 * s + k * 8, width: 520 * s, height: 520 * s, background: `linear-gradient(135deg,${COL[k]},${COL[k]}aa)`, transformOrigin: "50% 100%", transform: `perspective(1400px) rotateX(${last ? 0 : -78 * f}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.4)", zIndex: last ? 10 : N - k }}>
      {last && <div style={{ position: "absolute", left: "30%", top: "30%", width: "40%", height: "40%", borderRadius: "50%", background: "radial-gradient(#111 0 12%, #2a2a2a 13% 60%, #c0392b 61%)", opacity: 0.85 }} />}
    </div>; })}
    <Glow x={960} y={400} r={420} o={0.6 * pull} />
  </Cam>;
}} />;

// «the fear is the price of the ticket»: la entrada se rasga por la mitad: las dos partes se separan girando y queda el talón
const HTicketTear: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 1.0), p = eio(tt, at, at + 0.6), jag = "polygon(0 0,52% 0,49% 12%,53% 25%,48% 38%,52% 50%,47% 63%,53% 76%,49% 88%,52% 100%,0 100%)", jag2 = "polygon(52% 0,100% 0,100% 100%,52% 100%,49% 88%,53% 76%,47% 63%,52% 50%,48% 38%,53% 25%,49% 12%)";
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="le_e02" tt={tt} b={16} br={0.4} />
    <div style={{ position: "absolute", inset: 0, clipPath: jag, transform: `translate(${-120 * p}px,${30 * p}px) rotate(${-10 * p}deg)`, transformOrigin: "50% 60%" }}><Prop id="ticket_stub" x={960} y={820} w={900} /></div>
    <div style={{ position: "absolute", inset: 0, clipPath: jag2, transform: `translate(${160 * p}px,${90 * p}px) rotate(${14 * p}deg)`, transformOrigin: "50% 60%" }}><Prop id="ticket_stub" x={960} y={820} w={900} /></div>
    {tt < at && <div style={{ position: "absolute", left: 950, top: 560 + 30 * Math.sin(tt * 8), width: 20, height: 20 }} />}
  </Cam>;
}} />;

// «Count to five and open the door»: oscuro; una rendija de luz con forma de puerta se abre de a poco y llena el cuadro hacia la casa al atardecer
const HDoorLight: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 0.5), W = 20 + 1880 * p * p, H = 760 + 320 * p;
  return <div style={{ position: "absolute", inset: 0, background: "#07060a", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, width: W, height: H, overflow: "hidden", boxShadow: `0 0 ${80 + 200 * p}px rgba(255,220,160,.6)` }}>
      <div style={{ position: "absolute", left: W / 2 - 960, top: H / 2 - 540, width: 1920, height: 1080 }}><Fondo id="le_e30" tt={tt} b={0} br={0.85} /></div>
    </div>
    <div style={{ position: "absolute", left: 960 - W / 2, top: 540 + H / 2, width: W, height: 600, background: "linear-gradient(rgba(255,220,160,.35),rgba(255,220,160,0))", transform: "perspective(800px) rotateX(70deg)", transformOrigin: "50% 0" }} />
  </div>;
}} />;

// recapitulación: seis objetos de la historia caen en fila, uno por cada consejo, y el que se nombra se ilumina
const RECAP = [{ id: "apron_check", w: 270 }, { id: "hand_flat", w: 230 }, { id: "coffee_cup", w: 290 }, { id: "tissue_box", w: 300 }, { id: "smartphone", w: 150 }, { id: "letter_envelope", w: 300 }];
const HRecapRow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = RECAP.map((_, k) => bt(h, k, 0.6 + k * 3)), cur = at.reduce((a, v, k) => (tt >= v ? k : a), -1);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="le_e25" tt={tt} b={16} br={0.4} />
    <Mesa y0={600} tone="#c89a5a" />
    {RECAP.map((o, k) => { const L = land(tt, at[k], 500, 9, 0.42), x = 190 + k * 308, on = k === cur; return L.on ? <React.Fragment key={k}>
      {on && <Glow x={x} y={720} r={240} o={0.7} />}
      <Prop id={o.id} x={x} y={860 + L.dy} w={o.w * 1.25 * (on ? 1.15 : 1)} sq={L.sq} style={{ filter: on ? "brightness(1.15) saturate(1.2)" : "brightness(.7) saturate(.6)" }} />
    </React.Fragment> : null; })}
  </Cam>;
}} />;

// «The letters she wrote me»: los sobres caen uno sobre otro formando un atado y un hilo rojo se dibuja alrededor y se anuda
const HLettersBundle: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 6, tie = eio(tt, 0.3 + N * 0.25 + 0.2, 0.3 + N * 0.25 + 1.2);
  return <Cam tt={tt} d={d} z={0.08} fy={720}>
    <Fondo id="le_e19" tt={tt} b={14} br={0.5} />
    <Mesa y0={760} tone="#9a6c42" />
    {Array.from({ length: N }, (_, k) => { const L = land(tt, 0.3 + k * 0.25, 500, 10, 0.45); return L.on ? <Prop key={k} id="letter_envelope" x={960 + (k % 2 ? 12 : -10)} y={990 - k * 22 + L.dy} w={720} r={(k % 3 - 1) * 2.5} sq={L.sq} sh={k ? 0 : 1} /> : null; })}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M960 690 L960 1000 M600 860 L1320 840" stroke="#b02020" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${tie} 1`} />
      {tie >= 1 && <path d="M960 850 c-60 -70 -120 -10 -40 10 M960 850 c60 -70 120 -10 40 10 M960 852 l-40 70 M960 852 l40 70" stroke="#b02020" strokeWidth={8} fill="none" strokeLinecap="round" />}
    </svg>
    <Glow x={960} y={760} r={420} o={0.35 * tie} />
  </Cam>;
}} />;

export const HCE2: Record<string, C> = {
  savedChair: HSavedChair, slowCup: HSlowCup, napkinFold: HNapkinFold, barnGlow: HBarnGlow, shopDoor: HShopDoor, tissuePull: HTissuePull, phoneBox: HPhoneBox,
  greenButton: HGreenButton, milesRoad: HMilesRoad, steamerSea: HSteamerSea, photoSend: HPhotoSend, gloveCatch: HGloveCatch, roofEdge: HRoofEdge, wallPhone: HWallPhone,
  nameIt: HNameIt, shrinkIt: HShrinkIt, setTime: HSetTime, countOpen: HCountOpen, writeLine: HWriteLine, calfLantern: HCalfLantern, secondDance: HSecondDance,
  waltzSteps: HWaltzSteps, needleDrop: HNeedleDrop, sleeveCabinet: HSleeveCabinet, ticketTear: HTicketTear, doorLight: HDoorLight, recapRow: HRecapRow, lettersBundle: HLettersBundle,
};
