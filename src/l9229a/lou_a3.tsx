// l9229a «Brother» · VUELTA 3 (última) del evaluador (30-oct): pisa a lou_a2 en las piezas que siguieron en 5-6.
// Lo que faltaba: MANOS de verdad (foto recortada, no dibujadas), el objeto que hace la acción (sello de goma, pluma, marcador,
// lápiz) y la acción clave justo en los momentos que se ven (≈0,6 s y la mitad), con todo el texto dentro del cuadro.
import React from "react";
import { HAND, cl, eio, phys } from "./hkit";
import { Odo, Puff } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Drop, Dust, Cam, Mesa, Word, Glow, land } from "./pk";
import { BOX, Fondo, Formica, Ink } from "./lk";

// m0-1 · la mesa servida en perspectiva: las sillas DETRÁS de la mesa, los platos sobre el mantel con vapor; tres sillas se van y su plato se enfría
const HEmptyChairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), X = [400, 780, 1160, 1540], mid = d / 2;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="L_cocina" tt={tt} b={7} br={0.55} />
    {X.map((x, i) => { const go = i < 3 ? eio(tt, 0.5 + i * (mid - 0.5) / 3, 0.9 + i * (mid - 0.5) / 3 + 0.6) : 0;
      return <div key={i} style={{ ...BOX, transform: `translate(${(i < 2 ? -1 : 1) * 160 * go}px,${-60 * go}px) scale(${1 - 0.25 * go})`, transformOrigin: `${x}px 700px`, filter: `brightness(${1 - 0.65 * go})` }}><Prop id="chrome_chair" x={x} y={760} w={330} flip={i % 2 === 1} /></div>; })}
    <Formica y0={660} />
    <div style={{ position: "absolute", left: -100, top: 650, width: 2120, height: 60, background: "linear-gradient(#f4f0e4,#d8d0bc)", transform: "perspective(900px) rotateX(40deg)", opacity: 0.5 }} />
    {X.map((x, i) => { const cold = i < 3 ? eio(tt, 0.5 + i * (mid - 0.5) / 3 + 0.3, 0.9 + i * (mid - 0.5) / 3 + 0.9) : 0;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 140, top: 760, width: 280, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 45%,#fbfaf4 42%,#d8d4c8 58%,#f4f2ea 68%)", boxShadow: "0 12px 16px rgba(0,0,0,.4)", filter: `brightness(${1 - 0.5 * cold})` }} />
        <div style={{ position: "absolute", left: x - 70, top: 770, width: 140, height: 50, borderRadius: "50%", background: "radial-gradient(#8a5a32,#5a3418)", filter: `saturate(${1 - cold}) brightness(${1 - 0.5 * cold})` }} />
        {Array.from({ length: 3 }, (_, k) => { const p = (tt * 0.5 + k / 3) % 1; return <Puff key={k} x={x + 20 * Math.sin(p * 6 + k)} y={740 - 200 * p} r={30 + 50 * p} o={(1 - cold) * (1 - p) * 0.4} />; })}
      </React.Fragment>; })}
    <Word tt={tt} at={d - 2.0} x={1540} y={300} txt="just me" size={120} r={-3} />
  </Cam>;
}} />;

// m1 · el cajón de madera con bisagras: la tapa se levanta dos dedos (ya a los 0,5 s), sale una cuña de luz dorada con polvo flotando, y baja con rebote
const HBoxTease: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = tt < d - 1.6 ? eio(tt, 0.3, 0.8) * (0.85 + 0.15 * Math.sin(tt * 2)) : 1 - phys(tt, d - 1.6, 9, 0.35), lid = 22 * op;
  return <Cam tt={tt} d={d} z={0.1} fy={640}>
    <Fondo id="L_taller" tt={tt} b={8} br={0.4} />
    <Mesa y0={800} tone="#6a4a2a" />
    <div style={{ position: "absolute", left: 460, top: 120, width: 1000, height: 560, background: "radial-gradient(ellipse 45% 100% at 50% 100%, rgba(255,214,130,.9), transparent 72%)", clipPath: "polygon(22% 100%, 78% 100%, 100% 0, 0 0)", opacity: op, mixBlendMode: "screen", filter: "blur(8px)" }} />
    {Array.from({ length: 22 }, (_, k) => { const p = (tt * 0.25 + rnd(k)) % 1; return <div key={k} style={{ position: "absolute", left: 640 + 640 * rnd(k + 3) + 40 * Math.sin(tt + k), top: 660 - 520 * p, width: 6, height: 6, borderRadius: "50%", background: "rgba(255,230,170,.95)", opacity: op * (1 - p) }} />; })}
    <Prop id="wood_crate" x={960} y={1010} w={980} style={{ clipPath: "inset(26% 0 0 0)" }} />
    <div style={{ ...BOX, transformOrigin: "960px 680px", transform: `perspective(1400px) rotateX(${lid}deg) translateY(${-lid * 1.6}px)` }}><Prop id="wood_crate" x={960} y={1010} w={980} sh={0} style={{ clipPath: "inset(0 0 74% 0)" }} /></div>
    <Glow x={960} y={690} r={300} o={op * 1.2} col="255,205,120" />
    {tt > d - 1.6 && <Dust tt={tt} at={d - 1.45} x={960} y={700} w={700} />}
  </Cam>;
}} />;

// m4-5 · la puerta mosquitero: la gorra verde GRANDE cuelga del clavo y a los 0,5 s se suelta y cae al piso; la puerta se cierra sola y rebota dos veces
const HCapDoor: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fallT = 0.4, cy = tt < fallT ? 360 : Math.min(780, 360 + 1700 * (tt - fallT) ** 2), mid = d / 2;
  const door = tt < mid - 0.6 ? 75 * eio(tt, 0.1, 0.6) : 75 * Math.exp(-2.4 * (tt - mid + 0.6)) * Math.abs(Math.cos(6.5 * (tt - mid + 0.6)));
  return <Cam tt={tt} d={d} z={0.06} fx={900}>
    <Fondo id="L_porche" tt={tt} b={3} br={0.7} />
    <div style={{ position: "absolute", left: 760, top: 40, width: 700, height: 1040, background: "rgba(20,14,8,.25)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 790, top: 70, width: 640, height: 1010, transformOrigin: "0 50%", transform: `perspective(1800px) rotateY(${-door}deg)`, boxShadow: "30px 0 50px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", inset: 0, border: "34px solid #ece4cc", borderTopWidth: 40, boxSizing: "border-box", background: "repeating-linear-gradient(0deg, rgba(30,30,30,.3) 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, rgba(30,30,30,.3) 0 1px, transparent 1px 5px)" }} />
      <div style={{ position: "absolute", left: 0, top: 480, width: 640, height: 30, background: "#ece4cc" }} />
      <div style={{ position: "absolute", left: 560, top: 480, width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(#e8d08a,#8a6a2a)" }} />
    </div>
    <div style={{ position: "absolute", left: 470, top: 300, width: 22, height: 22, borderRadius: "50%", background: "#3a3a3a", boxShadow: "0 3px 0 #bbb" }} />
    <Prop id="farm_cap" x={480 + 60 * cl((tt - fallT) * 1.5)} y={cy + 130} w={380} r={tt < fallT ? -8 : -8 + 200 * cl((tt - fallT) / 0.7)} sh={cy >= 780 ? 1 : 0} />
    {cy >= 780 && <Dust tt={tt} at={fallT + 0.6} x={540} y={910} w={300} />}
  </Cam>;
}} />;

// m7 · la parcela en perspectiva partida en cuatro tiras de tierra de distinto tono, con estacas e hilo tenso; las botas embarradas caen en la tira de Gus a la mitad y salpican barro
const HBootsStrip: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, boot = land(tt, mid - 0.5, 800, 9, 0.3), hz = 520;
  const X = (u: number, v: number) => 960 + (u - 0.5) * (300 + 2300 * v), Y = (v: number) => hz + 560 * v;
  const strip = (i: number) => `polygon(${X(i / 4, 0)}px ${Y(0)}px, ${X((i + 1) / 4, 0)}px ${Y(0)}px, ${X((i + 1) / 4, 1)}px ${Y(1)}px, ${X(i / 4, 1)}px ${Y(1)}px)`;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="L_granja" tt={tt} b={4} br={0.65} y="30%" />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ ...BOX, clipPath: strip(i), background: `repeating-linear-gradient(180deg, rgba(0,0,0,.12) 0 6px, transparent 6px 26px), linear-gradient(${["#6a4a2a", "#5a3a1e", "#6e5030", "#5e4224"][i]}, ${["#3a2614", "#2e1c0c", "#3e2a16", "#32200e"][i]})`, opacity: eio(tt, 0.1 + i * 0.12, 0.5 + i * 0.12) }} />)}
    {[1, 2, 3].map((i) => { const p = eio(tt, 0.3 + i * 0.15, 0.8 + i * 0.15); return <React.Fragment key={i}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><line x1={X(i / 4, 0)} y1={Y(0)} x2={X(i / 4, 0) + (X(i / 4, 1) - X(i / 4, 0)) * p} y2={Y(0) + (Y(1) - Y(0)) * p} stroke="#fffbe8" strokeWidth={4} /></svg>
      <div style={{ position: "absolute", left: X(i / 4, 1) - 14, top: Y(1) - 120, width: 28, height: 140, background: "linear-gradient(90deg,#c8a878,#7a5a32)", opacity: p > 0.9 ? 1 : 0 }} /></React.Fragment>; })}
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: X((i + 0.5) / 4, 0.25) , top: Y(0.25) - 40, transform: "translateX(-50%)", padding: "6px 24px", background: "rgba(250,245,230,.94)", fontFamily: HAND, fontSize: 62, fontWeight: 700, color: "#2a2a40", opacity: cl((tt - 0.9 - i * 0.15) * 3), boxShadow: "0 8px 16px rgba(0,0,0,.4)" }}>{["Earl", "Gus", "Lou", "Vern"][i]}</div>)}
    {boot.on && <Prop id="work_boots" x={X(1.5 / 4, 0.75)} y={Y(0.75) + 60 + boot.dy} w={460} sq={boot.sq} />}
    {boot.on && boot.k > 0.95 && Array.from({ length: 14 }, (_, k) => { const q = cl((tt - mid + 0.15) / 0.6); return <div key={k} style={{ position: "absolute", left: X(1.5 / 4, 0.75) + 380 * (rnd(k) - 0.5) * (0.4 + q), top: Y(0.75) + 60 - 90 * rnd(k + 5) * Math.sin(q * Math.PI), width: 22, height: 16, borderRadius: "50%", background: "#2e1e0c" }} />; })}
    <Glow x={X(1.5 / 4, 0.75)} y={Y(0.75) - 100} r={340} o={boot.on ? cl((tt - mid) * 2) * 0.7 : 0} />
  </Cam>;
}} />;

// m12 · el almanaque colgado ENTERO en el cuadro: la mano con lápiz de carpintero dibuja el óvalo alrededor de UN solo domingo (el 15) y la cámara empuja suave hacia ese casillero
const HCalCircle: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, circ = eio(tt, 0.4, mid), zin = eio(tt, mid + 0.2, d - 0.4);
  const cw = 92, ch = 92, gx = 690, gy = 412, cx = gx + cw * 0.5, cy = gy + ch * 2 + ch * 0.5, a = circ * Math.PI * 2 - Math.PI / 2;
  return <div style={{ ...BOX, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${1 + 0.28 * zin})` }}><Cam tt={tt} d={d} z={0.03}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.55} />
    <div style={{ position: "absolute", left: 952, top: 22, width: 18, height: 18, borderRadius: "50%", background: "#333" }} />
    <div style={{ position: "absolute", left: 670, top: 40, width: 684, height: 900, background: "#f6f2e6", boxShadow: "18px 30px 50px rgba(0,0,0,.55)" }}>
      <div style={{ height: 300, background: "linear-gradient(#5a7a3a,#3a5a22)", color: "#fff6dc", fontFamily: SER, fontWeight: 900, textAlign: "center", paddingTop: 50 }}><div style={{ fontSize: 46 }}>KOSTER FEED & SEED</div><div style={{ fontSize: 120 }}>MARCH</div></div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7,${cw}px)`, padding: "12px 20px" }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((x, i) => <div key={"h" + i} style={{ fontFamily: SER, fontWeight: 900, fontSize: 38, color: i === 0 ? "#b3322a" : "#333", textAlign: "center", height: 60 }}>{x}</div>)}
        {Array.from({ length: 35 }, (_, i) => <div key={i} style={{ fontFamily: SER, fontSize: 50, fontWeight: 700, color: i % 7 === 0 ? "#b3322a" : "#333", textAlign: "center", height: ch, borderTop: "1px solid #ddd", lineHeight: `${ch}px` }}>{i < 31 ? i + 1 : ""}</div>)}
      </div>
    </div>
    <svg width={200} height={160} style={{ position: "absolute", left: cx - 100, top: cy - 80 }}><ellipse cx={100} cy={80} rx={70} ry={52} fill="none" stroke="#7a2a1a" strokeWidth={10} strokeDasharray={400} strokeDashoffset={400 * (1 - circ)} strokeLinecap="round" opacity={0.92} /></svg>
    {tt < mid + 0.3 && <Prop id="hand_pen" x={cx + 70 * Math.cos(a) + 250} y={cy + 52 * Math.sin(a) + 230} w={520} sh={0.5} />}
  </Cam></div>;
}} />;

// m13 · el ripio real: el poste de milla «11» entra clavado; el pastel (abajo, cerca) y el frasco (arriba, lejos) se CRUZAN y siguen cada uno al lado contrario
const HPieRoad: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1.0), post = land(tt, 0.4, 700, 9, 0.35);
  return <Cam tt={tt} d={d} z={0.03}>
    <Fondo id="la_e21" tt={tt} b={2} br={0.8} y="60%" />
    {post.on && <div style={{ ...BOX, transform: `translateY(${post.dy}px)` }}><Prop id="mile_post" x={1660} y={1000} w={300} sq={post.sq} />
      <div style={{ position: "absolute", left: 1660 - 110, top: 1000 - 440 * (300 / 300) - 80, width: 220, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 120, color: "#2a2a2a" }}>11</div></div>}
    <Prop id="apple_butter" x={1300 - 820 * p} y={760} w={200} />
    <Prop id="rhubarb_pie" x={420 + 900 * p} y={1000 - 10 * Math.abs(Math.sin(tt * 10))} w={480} />
    {Array.from({ length: 4 }, (_, k) => <Puff key={k} x={420 + 900 * p - 240 - k * 60} y={990} r={50 + k * 20} o={0.35 * (1 - k / 4)} col="rgba(220,200,160,.8)" />)}
  </Cam>;
}} />;

// m14 · el pasillo encerado de la iglesia a la altura del piso: dos pares de zapatos enfrentados de costado; el de la derecha da media vuelta con peso (de espaldas → de frente) a la mitad
const HShoesTurn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, turn = phys(tt, mid - 0.6, 5, 0.42), ry = 180 * (1 - Math.min(1.08, turn));
  return <Cam tt={tt} d={d} z={0.06} fy={820}>
    <Fondo id="la_e23" tt={tt} b={10} br={0.45} />
    <div style={{ position: "absolute", left: -400, top: 700, width: 2720, height: 600, transform: "perspective(700px) rotateX(62deg)", transformOrigin: "50% 0", background: "repeating-linear-gradient(90deg,#6a4626 0 8px,#9a6c40 8px 160px)" }} />
    <div style={{ position: "absolute", left: 600, top: 700, width: 720, height: 600, transform: "perspective(700px) rotateX(62deg)", transformOrigin: "50% 0", background: "linear-gradient(90deg,#5a1010,#8a1e1e 8%,#8a1e1e 92%,#5a1010)" }} />
    <div style={{ position: "absolute", left: 0, top: 700, width: 1920, height: 380, background: "linear-gradient(180deg, rgba(255,240,210,.18), transparent 50%)" }} />
    <Prop id="dress_shoes" x={620} y={940} w={440} />
    <Prop id="dress_shoes" x={1300} y={940} w={440} ry={ry} flip />
    <Glow x={960} y={860} r={260} o={turn > 0.9 ? 0.6 : 0} />
  </Cam>;
}} />;

// m17 · el monitor entero en su brazo: la línea verde late; el marcador rojo de verdad escribe «tomorrow» GRANDE sobre el vidrio y lo tacha; la línea sigue
const HMonitorTomorrow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, wr = cl((tt - 0.3) / (mid - 0.5)), st = eio(tt, mid, mid + 0.6);
  const N = 70, pts = Array.from({ length: N }, (_, i) => { const x = i / (N - 1), ph = ((x * 3 + tt * 0.9) % 1); const y = ph > 0.42 && ph < 0.46 ? -1 : ph > 0.46 && ph < 0.5 ? 0.8 : 0; return `${x * 1240},${360 + y * 120}`; }).join(" ");
  const mx = wr < 1 ? 420 + 1080 * wr : 420 + 1100 * st, my = wr < 1 ? 330 + 20 * Math.sin(wr * 40) : 330 + 10 * st;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="la_e25" tt={tt} b={8} br={0.45} />
    <div style={{ position: "absolute", left: 930, top: 880, width: 60, height: 200, background: "linear-gradient(90deg,#666,#ccc,#666)" }} />
    <div style={{ position: "absolute", left: 300, top: 90, width: 1320, height: 800, borderRadius: 30, background: "linear-gradient(#3a4044,#1a1e20)", padding: 40, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
      <div style={{ position: "relative", width: 1240, height: 720, background: "#020806", borderRadius: 12, overflow: "hidden" }}>
        <svg width={1240} height={720}><polyline points={pts} fill="none" stroke="#5aff9a" strokeWidth={7} style={{ filter: "drop-shadow(0 0 10px #5aff9a)" }} /><text x={1030} y={660} fill="#5aff9a" fontFamily="monospace" fontSize={70} fontWeight={700}>{Math.round(64 + 3 * Math.sin(tt))}</text></svg>
        <div style={{ position: "absolute", left: 80, top: 80, width: 1100, fontFamily: HAND, fontWeight: 700, fontSize: 210, color: "#ff4a3a", clipPath: `inset(0 ${(1 - wr) * 100}% 0 0)`, textShadow: "0 0 8px rgba(255,80,60,.5)" }}>tomorrow</div>
        <svg width={1240} height={720} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M80,250 L${80 + 1080 * st},235`} stroke="#ff4a3a" strokeWidth={22} strokeLinecap="round" /></svg>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,.14), transparent 35%)" }} />
      </div>
    </div>
    {tt > 0.2 && tt < mid + 0.9 && <Prop id="red_marker" x={mx + 330} y={my + 250} w={620} r={-28} sh={0.4} />}
  </Cam>;
}} />;

// m17-18 · la cama de hospital real en la pieza con luz fría de ventana; la silla verde sale del marco de la puerta y se arrastra hasta la cama (llega a la mitad); la mano vieja se apoya en la sábana
const HChairInRoom: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = eio(tt, 0.3, mid), jig = Math.sin(tt * 26) * 2 * (p > 0 && p < 1 ? 1 : 0), hand = eio(tt, mid + 0.3, mid + 1.2);
  return <Cam tt={tt} d={d} z={0.06} fx={1100}>
    <Fondo id="la_e25" tt={tt} b={10} br={0.4} />
    <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "linear-gradient(#9aa4a8,#6a7276)" }} />
    <div style={{ position: "absolute", left: 1300, top: 60, width: 480, height: 520, background: "linear-gradient(#d8e8f2,#a4bccc)", boxShadow: "inset 0 0 0 18px #e8ece8" }} />
    <div style={{ position: "absolute", left: 900, top: 60, width: 1020, height: 1020, background: "linear-gradient(225deg, rgba(200,225,245,.35), transparent 55%)", mixBlendMode: "screen" }} />
    <Prop id="hospital_bed" x={1360} y={1000} w={980} />
    <div style={{ position: "absolute", left: 80, top: 120, width: 420, height: 960, border: "30px solid #8a7a5a", borderBottom: "none", background: "linear-gradient(#2a2a22,#121210)" }} />
    <Prop id="hospital_chair" x={290 + 520 * p + jig} y={1020} w={400 + 60 * p} />
    {p > 0.05 && p < 0.95 && <Dust tt={tt} at={tt - 0.3} x={290 + 520 * p - 120} y={1020} w={220} />}
    {hand > 0 && <Prop id="hand_flat" x={1180} y={760 + 30 * (1 - hand)} w={240} r={-70} o={hand} sh={0.5} />}
  </Cam>;
}} />;

// m18-19 · la navaja de hueso en manos viejas de verdad: una mano entra con la navaja, la abre (destello por el filo) y otra mano la toma; el sello estampa cada nombre en la tira de cuero
const HKnifeHands: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.3, bt(h, 0, 2.5), bt(h, 1, 5), bt(h, 2, 7.5)], nm = ["HENRY", "EARL", "LOU", "TOMMY"], cur = Math.max(0, st.filter((x) => tt >= x).length - 1);
  const pass = cl((tt - st[cur]) / 0.9), open = eio(tt, 0.5, 0.9), shine = cl(1 - Math.abs(tt - 1.1) * 3), sx = 280 + 440 * cur;
  const stamp = (i: number) => { const a = st[i] + 0.4, dn = eio(tt, a - 0.3, a), up = eio(tt, a + 0.15, a + 0.5); return { y: -260 * (1 - dn) - 260 * up, on: tt > a - 0.3 && tt < a + 0.5, ink: tt > a }; };
  return <Cam tt={tt} d={d} z={0.05} fy={600}>
    <Fondo id="la_e27" tt={tt} b={9} br={0.45} />
    {/* la mano que entrega sale por la izquierda, la que recibe entra por la derecha */}
    {cur > 0 && <Prop id="hand_pinch" x={700 - 500 * pass} y={600} w={560} o={1 - pass} sh={0} />}
    <Prop id="hand_pinch" x={cur > 0 ? 1500 - 600 * Math.min(1, pass * 1.4) : 900} y={600} w={560} flip={cur % 2 === 1} sh={0} />
    <div style={{ ...BOX, transform: `translateX(${cur > 0 ? -200 + 0 * pass : 0}px)` }}>
      <Prop id={open > 0.5 ? "knife_open" : "knife_closed"} x={cur > 0 ? 1140 - 400 * Math.min(1, pass * 1.4) + 200 : 940} y={560} w={560} r={-6} sh={0} />
    </div>
    <Glow x={980} y={520} r={240} o={shine} col="255,255,255" />
    <div style={{ position: "absolute", left: 160, top: 860, width: 1600, height: 130, background: "linear-gradient(#8a5a2a,#5a3618)", borderRadius: 10, boxShadow: "0 16px 24px rgba(0,0,0,.5), inset 0 0 0 4px rgba(40,20,5,.4)" }}>
      {nm.map((n, i) => { const s = stamp(i); return <React.Fragment key={i}>
        {s.ink && <div style={{ position: "absolute", left: 220 + i * 390 - 160, top: 22, width: 320, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 70, letterSpacing: 6, color: "#2a1606", textShadow: "0 2px 0 rgba(255,200,140,.35)" }}>{n}</div>}
        {s.on && <Prop id="rubber_stamp" x={220 + i * 390} y={40 + s.y} w={230} sh={0} />}
      </React.Fragment>; })}
    </div>
  </Cam>;
}} />;

// m21 · la foto de la mula cae a los 0,2 s; el sello de goma con mango de madera baja sobre el cielo de la foto, aplasta y deja «1936» ENTERO en rojo
const HMuleStamp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = Math.max(1.0, d / 2), dn = eio(tt, a - 0.45, a), up = eio(tt, a + 0.2, a + 0.7), sy = -500 * (1 - dn) - 500 * up;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="la_e08" tt={tt} b={10} br={0.45} />
    <Mesa y0={740} />
    <Drop tt={tt} at={0.15} id="mule_photo" x={860} y={1020} w={900} r={-3} />
    {tt > a && <div style={{ position: "absolute", left: 820, top: 560, transform: `translate(-50%,-50%) rotate(-8deg) scale(${1 + 0.06 * (1 - cl((tt - a) * 4))})`, padding: "8px 30px", border: "8px solid #b3322a", borderRadius: 12, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 92, lineHeight: 1, color: "#b3322a", opacity: 0.9, whiteSpace: "nowrap" }}>1936</div>}
    {tt > a - 0.45 && tt < a + 0.7 && <Prop id="rubber_stamp" x={820} y={640 + sy} w={300} sh={dn * (1 - up)} />}
    <Word tt={tt} at={a + 0.6} x={1560} y={400} txt="over a mule" size={100} r={-3} />
  </Cam>;
}} />;

// m24 · la libreta de espiral en perspectiva: la mano vieja con lápiz de carpintero escribe el número y dos palabras; al terminar dibuja una tilde de grafito
const HStepsPad: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.2, bt(h, 0, 4), bt(h, 1, 8), bt(h, 2, 12)], tx = ["1  Plain Tuesday", "2  Call. Don't text.", "3  Not the old business", "4  Talk about nothing"];
  const cur = Math.max(0, st.filter((x) => tt >= x).length - 1), pw = cl((tt - st[cur]) / 1.2), tk = cl((tt - st[cur] - 1.3) * 3);
  const hx = tk > 0 ? 1180 + 60 * tk : 460 + 760 * pw * (tx[cur].length / 22), hy = 220 + cur * 190;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={760} />
    <div style={{ position: "absolute", left: 360, top: 60, width: 1200, height: 900, transform: "perspective(1800px) rotateX(18deg)", transformOrigin: "50% 100%", background: "repeating-linear-gradient(#fbf8ef 0 94px,#9fc0dd 94px 96px)", borderLeft: "6px solid #d9534f", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 0, top: -30, width: 1200, height: 40, background: "repeating-linear-gradient(90deg,transparent 0 30px,#888 30px 44px,transparent 44px 60px)", borderRadius: 10 }} />
      {tx.map((s_, i) => <React.Fragment key={i}><Ink tt={tt} at={st[i]} dur={1.2} x={70} y={120 + i * 190} txt={s_} size={88} w={1000} col="#3a3a3a" />
        {tt > st[i] + 1.3 && <svg width={120} height={110} style={{ position: "absolute", left: 1060, top: 110 + i * 190 }}><path d="M10,60 L45,95 L110,10" fill="none" stroke="#4a4a4a" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={200} strokeDashoffset={200 * (1 - cl((tt - st[i] - 1.3) * 3))} /></svg>}</React.Fragment>)}
    </div>
    <Prop id="hand_pen" x={hx + 230} y={hy + 300} w={560} sh={0.5} />
  </Cam>;
}} />;

// m25 · la servilleta: el marcador rojo de verdad tacha «I'm sorry if you felt» de un trazo (a los 0,6 s) y a la mitad da la vuelta completa alrededor de «my part»
const HSorryScrap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, x1 = eio(tt, 0.3, 0.9), circ = eio(tt, mid - 0.6, mid + 0.4), ca = circ * Math.PI * 2;
  const mk = tt < 1.2 ? { x: 260 + 900 * x1, y: 300 } : tt < mid - 0.6 ? { x: 1160 - 200 * eio(tt, 1.2, mid - 0.6), y: 300 + 340 * eio(tt, 1.2, mid - 0.6) } : { x: 1150 + 330 * Math.cos(ca - Math.PI / 2), y: 640 + 100 * Math.sin(ca - Math.PI / 2) };
  return <Cam tt={tt} d={d} z={0.04}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.45} />
    <Formica y0={700} />
    <div style={{ position: "absolute", left: 160, top: 130, width: 1600, height: 760, background: "radial-gradient(circle at 30% 30%,#fffdf6,#ece6d4)", transform: "rotate(-2deg)", boxShadow: "0 40px 70px rgba(0,0,0,.5)", clipPath: "polygon(1% 3%,20% 0,45% 2%,70% 0,99% 2%,100% 40%,98% 97%,60% 100%,30% 98%,0 100%,2% 50%)" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(35deg, rgba(0,0,0,.035) 0 30px, rgba(255,255,255,.45) 30px 34px, transparent 34px 90px), repeating-linear-gradient(-55deg, rgba(0,0,0,.025) 0 50px, transparent 50px 120px)" }} />
      <div style={{ position: "absolute", left: 80, top: 110, fontFamily: HAND, fontWeight: 700, fontSize: 96, color: "#555" }}>I'm sorry if you felt…</div>
      <div style={{ position: "absolute", left: 70, top: 168, width: 940 * x1, height: 16, background: "#d42a1a", borderRadius: 8, transform: "rotate(-1deg)" }} />
      <div style={{ position: "absolute", left: 80, top: 420, fontFamily: HAND, fontWeight: 700, fontSize: 120, color: "#22314f" }}>I'm sorry for my part.</div>
      <svg width={800} height={300} style={{ position: "absolute", left: 600, top: 350 }}><ellipse cx={400} cy={150} rx={360} ry={115} fill="none" stroke="#d42a1a" strokeWidth={14} strokeDasharray={1900} strokeDashoffset={1900 * (1 - circ)} strokeLinecap="round" /></svg>
    </div>
    {tt > 0.2 && tt < mid + 0.8 && <Prop id="red_marker" x={mk.x + 300} y={mk.y + 260} w={600} r={-28} sh={0.4} />}
  </Cam>;
}} />;

// m26 · el saco de granero desplegado: la mano vieja entra, saca el sobre amarillo del bolsillo interior y lo trae a cámara hasta llenar el cuadro
const HCoatPocket: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b = Math.min(bt(h, 0, 3), d / 2 - 0.6), dip = eio(tt, b - 0.6, b), up = eio(tt, b + 0.2, b + 1.6), unf = eio(tt, 0.1, 0.7);
  const ex = 1060 + 40 * up, ey = 760 - 260 * up, ew = 300 + 380 * up;
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="la_e05" tt={tt} b={9} br={0.45} />
    <Mesa y0={620} tone="#6a4a2a" />
    <div style={{ ...BOX, transformOrigin: "960px 1060px", transform: `scaleY(${0.3 + 0.7 * unf})` }}><Prop id="barn_coat" x={960} y={1080} w={1000} /></div>
    {tt > b && <Prop id="envelope_stamp" x={ex} y={ey} w={ew} r={-10 + 10 * up} sh={up} />}
    <Prop id="hand_pinch" x={tt > b ? ex + ew * 0.35 : 1500 - 380 * dip} y={(tt > b ? ey - ew * 0.25 : 760) + 0} w={420 + 200 * up} flip sh={0} o={cl((tt - b + 0.8) * 3)} />
    <Glow x={1100} y={540} r={360} o={up * 0.7} />
  </Cam>;
}} />;

// m27 · la carta en perspectiva sobre el escritorio: la pluma fuente de verdad escribe renglón por renglón, la tinta fresca brilla azul y se opaca al secar; el sobre abierto al costado
const HLetterInk: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = ["Lou.", "You were right.", "I was just tired.", "I'm sorry I walked out.", "— Gus"], dt = (d - 1.2) / L.length, cur = Math.min(L.length - 1, Math.max(0, Math.floor((tt - 0.2) / dt))), pw = cl(((tt - 0.2) - cur * dt) / (dt * 0.85));
  const nx = 560 + 70 + Math.min(880, L[cur].length * 42) * pw, ny = 150 + cur * 150;
  return <Cam tt={tt} d={d} z={0.05} fy={460}>
    <Fondo id="la_e34" tt={tt} b={9} br={0.45} />
    <Mesa y0={760} />
    <div style={{ position: "absolute", left: 560, top: 90, width: 1000, height: 900, background: "linear-gradient(#f4ead0,#e2d2a8)", transform: "perspective(1800px) rotateX(16deg) rotate(1deg)", transformOrigin: "50% 100%", boxShadow: "0 40px 80px rgba(0,0,0,.6)", borderRadius: 4 }}>
      {L.map((l, i) => <Ink key={i} tt={tt} at={0.2 + i * dt} dur={dt * 0.85} x={70} y={70 + i * 150} txt={l} size={i === 0 || i === L.length - 1 ? 88 : 76} w={900} col={i === cur && pw < 1 ? "#1a3aa8" : "#1e2a48"} />)}
    </div>
    <Prop id="envelope_stamp" x={300} y={1000} w={440} r={-12} />
    {tt > 0.2 && tt < d - 0.6 && <Prop id="fountain_pen" x={nx + 150} y={ny + 200} w={420} r={-10} sh={0.3} />}
  </Cam>;
}} />;

// m28-29 · la camioneta entra ENTERA por la izquierda con nube de polvo y se aleja por el ripio; abajo a la derecha, el tablero real con el odómetro de rodillos que llega a 11
const HTruckMiles: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.2, d - 0.6), sc = 1.0 - 0.5 * p, x = 560 + 820 * p, y = 990 - 280 * p;
  return <Cam tt={tt} d={d} z={0.04}>
    <Fondo id="la_e21" tt={tt} b={2} br={0.8} y="60%" />
    {Array.from({ length: 8 }, (_, k) => <Puff key={k} x={x - (330 + k * 100) * sc} y={y - 70 * sc - k * 8} r={(80 + k * 34) * sc} o={0.9 * (1 - k / 8) * cl(p * 8 + 0.3)} col="rgba(200,178,135,.95)" />)}
    <Prop id="pickup_truck" x={x} y={y + 4 * Math.sin(tt * 18)} w={760 * sc} flip />
    <div style={{ position: "absolute", left: 1320, top: 760, width: 560, height: 280, borderRadius: "30px 30px 0 0", background: "linear-gradient(#3a3226,#1a160e)", boxShadow: "0 -10px 30px rgba(0,0,0,.6), inset 0 0 0 6px #5a4a32" }}>
      <div style={{ position: "absolute", left: 120, top: 40, width: 320, height: 200, borderRadius: "50%", background: "radial-gradient(#1a1a1a,#000)", boxShadow: "inset 0 0 0 8px #888" }} />
      <div style={{ position: "absolute", left: 180, top: 70, width: 200, height: 140, background: "linear-gradient(125deg, rgba(255,255,255,.18), transparent 40%)", borderRadius: "50%" }} />
    </div>
    <Odo x={1600} y={900} v={11 * p} n={2} size={120} />
  </Cam>;
}} />;

// m30 · el repaso: siete fichas caen con peso en DOS filas abiertas que no se pisan; «GO FIRST» cae al final en el octavo lugar, grande y amarilla
const HRecapCards: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tx = ["Right is expensive", "Talk money early", "Oldest isn't boss", "Call on dull days", "Spouses keep the road", "Say it in the room", "One thing for all", "GO FIRST"];
  const st = [0.2, ...Array.from({ length: 7 }, (_, i) => bt(h, i, 2 + i * 2.6))], pos = [[270, 330], [720, 300], [1170, 330], [1620, 300], [270, 700], [720, 670], [1170, 700], [1620, 690]];
  return <Cam tt={tt} d={d} z={0.04}>
    <Fondo id="L_cocina" tt={tt} b={9} br={0.45} />
    <Formica y0={380} />
    {tx.map((s_, i) => { const L = land(tt, st[i], 600, 9, 0.4); if (!L.on) return null; const [x, y] = pos[i], last = i === 7, r = (rnd(i) - 0.5) * 7, w = last ? 470 : 420;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - w / 2 + 14, top: y - 110 + 26, width: w, height: last ? 260 : 220, background: "rgba(0,0,0,.35)", filter: "blur(10px)", transform: `rotate(${r}deg)`, opacity: L.k }} />
        <div style={{ position: "absolute", left: x - w / 2, top: y - 120 + L.dy, width: w, height: last ? 260 : 220, background: last ? "#fff3c8" : "repeating-linear-gradient(#fbf6e6 0 52px,#b9cfe2 52px 54px)", borderTop: `12px solid ${last ? "#b3322a" : "#c0392b"}`, transform: `rotate(${r}deg) scaleY(${1 - 0.1 * L.sq})`, fontFamily: HAND, fontWeight: 700, fontSize: last ? 96 : 54, color: "#22314f", padding: last ? "60px 10px" : "50px 14px", textAlign: "center", lineHeight: 1.1 }}>{s_}</div>
      </React.Fragment>; })}
  </Cam>;
}} />;

export const HCA3: Record<string, C> = {
  emptyChairs: HEmptyChairs, boxTease: HBoxTease, capDoor: HCapDoor, bootsStrip: HBootsStrip, calCircle: HCalCircle, pieRoad: HPieRoad, shoesTurn: HShoesTurn,
  monitorTomorrow: HMonitorTomorrow, chairInRoom: HChairInRoom, knifeHands: HKnifeHands, muleStamp: HMuleStamp, stepsPad: HStepsPad, sorryScrap: HSorryScrap,
  coatPocket: HCoatPocket, letterInk: HLetterInk, truckMiles: HTruckMiles, recapCards: HRecapCards,
};
