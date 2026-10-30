// l9229b vuelta 2 · reescritura de las piezas que el evaluador puso <8: objetos más grandes y enteros, la acción física visible
// (rebote, polvo, chispa, vapor), luz que cruza, y nada de texto chico: lo escrito es grande y está EN la escena.
import React from "react";
import { HAND, cl, eio, phys } from "./hkit";
import { Odo, Puff } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Dust, Cam, Mesa, Glow, Rings, land, swing } from "./pk";
import { BOX, Fondo, Formica, Ink, Nieve } from "./lk";

const Tiza: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; r?: number }> = ({ tt, at, x, y, txt, size = 110, r = -3 }) => {
  const p = cl((tt - at) / 0.8); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: "rgba(250,248,240,.94)", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, textShadow: "0 0 3px rgba(255,255,255,.7), 2px 2px 0 rgba(255,255,255,.25)", whiteSpace: "nowrap" }}>{txt}</div>;
};
// palito de tiza grueso (para los conteos de a cinco): se dibuja de arriba hacia abajo
const Palo: React.FC<{ tt: number; at: number; x: number; y: number; h?: number; r?: number; w?: number }> = ({ tt, at, x, y, h = 170, r = 4, w = 18 }) => {
  const p = cl((tt - at) / 0.3); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h * p, background: "linear-gradient(90deg,rgba(255,255,250,.75),rgba(255,255,250,.98) 40%,rgba(240,238,230,.8))", borderRadius: w / 2, transform: `rotate(${r}deg)`, transformOrigin: "50% 0", boxShadow: "0 0 4px rgba(255,255,255,.5)" }} />;
};
const Conteo: React.FC<{ tt: number; ats: number[]; x: number; y: number; h?: number }> = ({ tt, ats, x, y, h = 170 }) => <>
  {ats.map((a, i) => i % 5 === 4
    ? <Palo key={i} tt={tt} at={a} x={x + Math.floor(i / 5) * 300 + 200} y={y + 10} h={260} r={62} w={18} />
    : <Palo key={i} tt={tt} at={a} x={x + Math.floor(i / 5) * 300 + (i % 5) * 46} y={y} h={h} r={3 - (i % 2) * 5} />)}
</>;

// m0 · la mudanza: el camión ENTERO entra marcha atrás, las balizas ámbar titilan y cada «bip» sale en anillos ámbar
const HDollyBeep: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.2, d * 0.62), x = 960, w = 460 + 380 * p, by = 760 + 290 * p, blink = Math.floor(tt * 2.5) % 2 === 0 && p < 0.99;
  const lamps = [[x - w * 0.43, by - w * 0.2], [x + w * 0.43, by - w * 0.2]];
  return <Cam tt={tt} d={d} z={0.04} fx={1000}>
    <Fondo id="lb_e02" tt={tt} b={4} br={0.7} />
    <Prop id="moving_truck" x={x} y={by + 3 * Math.sin(tt * 14) * (p < 0.99 ? 1 : 0)} w={w} sh={1} />
    {lamps.map(([lx, ly], i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: lx - 22, top: ly - 22, width: 44, height: 44, borderRadius: "50%", background: blink ? "radial-gradient(#fff6c8,#ffb020 55%,#c86a00)" : "radial-gradient(#8a5a10,#4a2a00)", boxShadow: blink ? "0 0 40px 14px rgba(255,170,30,.8)" : "none" }} />
      <Glow x={lx} y={ly} r={190} o={blink ? 1.5 : 0} col="255,170,40" />
    </React.Fragment>)}
    {Array.from({ length: 9 }, (_, i) => { const at = 0.3 + i * 0.8, q = (tt - at) / 1.1; if (q <= 0 || q >= 1) return null;
      return <svg key={i} width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{[-1, 1].map((sd) => [0, 1, 2].map((j) => { const r = 40 + 300 * q + j * 50, cx = x + sd * w * 0.5, cy = by - w * 0.35; return <path key={sd + "_" + j} d={`M${cx},${cy - r} A${r},${r} 0 0,${sd > 0 ? 1 : 0} ${cx},${cy + r}`} fill="none" stroke={`rgba(255,190,60,${(1 - q) * (1 - j * 0.25)})`} strokeWidth={10 - j * 2} strokeLinecap="round" />; }))}</svg>; })}
  </Cam>;
}} />;

// m1 · la ventana de Lou: la cinta métrica cruza el piso del living HASTA la ventana y el contador de rodillos sube a 66
const HTapeSteps: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d / 2 + 0.8), L = 1180 * p;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="L_salon" tt={tt} b={9} br={0.5} />
    <div style={{ position: "absolute", left: -200, top: 620, width: 2320, height: 520, background: "repeating-linear-gradient(90deg,#6e4a2c 0 5px,#9a6c46 5px 150px)", transform: "perspective(900px) rotateX(58deg)", transformOrigin: "50% 0" }} />
    <Prop id="window_pane" x={1460} y={660} w={560} sh={0} />
    <Glow x={1460} y={420} r={360} o={0.9} col="255,236,190" />
    <div style={{ position: "absolute", left: 1500 - 900, top: 590, width: 900, height: 520, background: "rgba(255,232,180,.22)", clipPath: "polygon(70% 0,100% 0,60% 100%,0 100%)", filter: "blur(14px)", mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", left: 330, top: 950, width: L, height: 80, transformOrigin: "0 50%", transform: "rotate(-24deg) perspective(1200px) rotateY(-12deg)", background: "linear-gradient(#ffe05a,#d8a812)", boxShadow: "0 12px 14px rgba(0,0,0,.5)", overflow: "hidden", borderRadius: 3 }}>
      {Array.from({ length: 70 }, (_, i) => <div key={i} style={{ position: "absolute", left: 18 + i * 17, top: 0, width: 4, height: i % 10 === 0 ? 54 : 26, background: "#1a1a1a" }} />)}
    </div>
    <Prop id="tape_measure" x={300} y={1040} w={340} />
    <div style={{ position: "absolute", left: 140, top: 110, padding: "26px 40px", background: "rgba(20,14,8,.55)", borderRadius: 18, boxShadow: "0 18px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "relative", width: 300, height: 190 }}><Odo x={150} y={95} v={66 * p} n={2} size={170} /></div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#f3e6c6", textAlign: "center" }}>years</div>
    </div>
  </Cam>;
}} />;

// m2 · se van de a una casa: el piano baja por el tablón desde el camión, frena, y aterriza en el escalón del porche con rebote y polvo
const HPianoRamp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = tt < mid ? 0.55 * eio(tt, 0.3, mid - 0.4) : 0.55 + 0.45 * eio(tt, mid, mid + 0.9), at = mid + 0.9, landed = tt > at;
  const x = 520 + 760 * p, y = 600 + 300 * p, bo = landed ? -60 * Math.abs(Math.sin((tt - at) * 7)) * Math.exp(-(tt - at) * 3) : 0;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e03" tt={tt} b={7} br={0.55} />
    <Prop id="wood_step" x={1300} y={1080} w={760} />
    <div style={{ ...BOX, transformOrigin: "520px 640px", transform: "rotate(21deg)" }}><Prop id="wood_plank" x={980} y={680} w={1000} sh={0} /></div>
    <Prop id="upright_piano" x={x} y={y + 30 + bo} w={440} r={landed ? 0 : 21} sq={landed ? cl(1 - (tt - at) * 2.5) : 0} />
    {landed && <Dust tt={tt} at={at} x={x} y={930} w={800} />}
    {landed && <Dust tt={tt} at={at + 0.45} x={x} y={930} w={420} />}
  </Cam>;
}} />;

// m3 · la nota de bienvenida de 1960: el imán de ananá cae desde arriba del cuadro, rebota en la heladera y la nota es un DIBUJO de la casa
const HPineappleNote: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), m = land(tt, 0.3, 700, 8, 0.28), fl = swing(tt, 0.6, 10, 4, 0.7), dr = (a: number, b: number) => cl((tt - a) / (b - a));
  const L = 1200, ln = (a: number, b: number) => ({ strokeDasharray: L, strokeDashoffset: L * (1 - dr(a, b)) });
  return <Cam tt={tt} d={d} z={0.07} fy={460}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Prop id="fridge" x={960} y={1300} w={1100} />
    <div style={{ position: "absolute", left: 700, top: 230, width: 540, height: 470, transformOrigin: "50% 0", transform: `rotate(${fl + 2}deg)`, background: "linear-gradient(#fffbea,#f0e4c0)", boxShadow: "10px 16px 22px rgba(0,0,0,.4)" }}>
      <svg width={540} height={470} style={{ position: "absolute", left: 0, top: 0 }} fill="none" stroke="#22314f" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M150,330 L150,210 L270,120 L390,210 L390,330 Z" style={ln(1.0, 2.4)} />
        <path d="M240,330 L240,260 L300,260 L300,330" style={ln(2.2, 2.9)} />
        <path d="M170,230 L215,230 L215,270 L170,270 Z M325,230 L370,230 L370,270 L325,270 Z" style={ln(2.6, 3.3)} />
        <path d="M60,330 L480,330" style={ln(0.9, 1.6)} />
        <path d="M95,330 L95,180 M65,215 Q95,130 125,215" stroke="#3a6a2a" style={ln(3.2, 3.9)} />
        <path d="M440,120 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0" stroke="#d89a1a" style={ln(3.6, 4.2)} />
      </svg>
      <Ink tt={tt} at={4.4} dur={1.8} x={60} y={350} txt="Welcome!" size={90} w={440} col="#b3322a" />
    </div>
    {m.on && <Prop id="pineapple_magnet" x={970} y={330 + m.dy} w={170} sq={m.sq} sh={0.4} />}
    {m.on && m.k > 0.9 && <Rings tt={tt} at={0.55} x={970} y={300} s={0.5} />}
  </Cam>;
}} />;

// m4 · Elm Street en 1960: casas de distintos colores y tamaños brotan en dos hileras, y a cada una se le prende el farol del porche
const HHouseRows: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06} fy={560}>
    <Fondo id="lb_e05" tt={tt} b={10} br={0.3} />
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, height: 520, background: "linear-gradient(#34442a,#1a2412)" }} />
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, height: 520, clipPath: "polygon(48% 0,52% 0,80% 100%,20% 100%)", background: "linear-gradient(#5a564e,#33312c)" }} />
    {Array.from({ length: 16 }, (_, i) => { const side = i % 2 ? 1 : -1, k = 8 - Math.floor(i / 2), v = k / 8, at = 0.2 + (8 - k) * 0.45, L = land(tt, at, 300 * (1 - v * 0.5), 10, 0.35);
      const x = 960 + side * (110 + 700 * (1 - v)), y = 590 + 470 * (1 - v), w = (100 + 340 * (1 - v)) * (0.85 + 0.3 * rnd(i + 2)), lit = cl((tt - at - 0.6) * 3);
      const lx = x + side * -w * 0.08, ly = y - w * 0.18;
      return L.on ? <React.Fragment key={i}><Prop id="small_house" x={x} y={y + L.dy} w={w} flip={side > 0} sq={L.sq} sh={0.6} style={{ filter: `hue-rotate(${Math.round(rnd(i) * 300)}deg) saturate(${0.8 + rnd(i + 5) * 0.8}) brightness(${0.75 + 0.2 * v})` }} />
        <div style={{ position: "absolute", left: lx - w * 0.025, top: ly - w * 0.03, width: w * 0.05, height: w * 0.06, borderRadius: 4, background: lit > 0 ? "radial-gradient(#fffbe0,#ffc24a)" : "#222", boxShadow: lit > 0 ? `0 0 ${w * 0.12}px ${w * 0.04}px rgba(255,200,90,${lit})` : "none" }} />
        <div style={{ position: "absolute", left: lx - w * 0.2, top: ly, width: w * 0.4, height: w * 0.28, background: `rgba(255,214,140,${0.35 * lit})`, clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)", filter: "blur(4px)", mixBlendMode: "screen" }} />
      </React.Fragment> : null; })}
  </Cam>;
}} />;

// m5 · la kringle: la manga pastelera de verdad recorre la masa y deja un cordón GRUESO de glaseado con brillo; vapor, nieve por la ventana
const HKringleIce: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.5), N = 20, P = Array.from({ length: N }, (_, i) => [560 + i * 42, i % 2 ? 690 : 800] as const);
  const pts = P.map(([x, y]) => `${x},${y}`).join(" "), f = p * (N - 1), i0 = Math.min(N - 2, Math.floor(f)), u = f - i0;
  const tx = P[i0][0] + (P[i0 + 1][0] - P[i0][0]) * u, ty = P[i0][1] + (P[i0 + 1][1] - P[i0][1]) * u, LEN = 2400;
  return <Cam tt={tt} d={d} z={0.07} fy={760}>
    <Fondo id="L_cocina" tt={tt} b={7} br={0.5} />
    <div style={{ position: "absolute", left: 1380, top: 60, width: 460, height: 380, overflow: "hidden", background: "linear-gradient(#5a6a80,#a8b8c8)", boxShadow: "inset 0 0 0 18px #efe8d6, 0 14px 30px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: -1380, top: -60, width: 1920, height: 1080 }}><Nieve tt={tt} n={90} wind={30} o={0.9} /></div>
    </div>
    <Formica y0={760} />
    <div style={{ position: "absolute", left: 420, top: 720, width: 1080, height: 330, borderRadius: "50%", background: "radial-gradient(ellipse,#fbfaf4 55%,#d8d4c8 70%)", boxShadow: "0 18px 24px rgba(0,0,0,.4)" }} />
    <Prop id="kringle" x={960} y={1010} w={940} sh={0} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <polyline points={pts} fill="none" stroke="rgba(120,100,80,.35)" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} transform="translate(5,9)" style={{ filter: "blur(4px)" }} />
      <polyline points={pts} fill="none" stroke="#f7f1e2" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} />
      <polyline points={pts} fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} transform="translate(-4,-6)" />
    </svg>
    {p > 0 && p < 1 && <Prop id="piping_bag" x={tx + 90} y={ty + 10} w={260} r={-28} sh={0} />}
    {Array.from({ length: 4 }, (_, k) => { const q = (tt * 0.4 + k / 4) % 1; return <Puff key={k} x={700 + k * 180 + 30 * Math.sin(q * 6)} y={760 - 300 * q} r={50 + 70 * q} o={(1 - q) * 0.4} />; })}
  </Cam>;
}} />;

// m6 · la pelota de los Kowalski: llega GRANDE con estela de movimiento, a la mitad estalla contra el vidrio: destello, grietas y esquirlas
const HBallCrack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hit = d / 2, cr = cl((tt - hit) / 0.35), sh = tt > hit && tt < hit + 0.3 ? 14 * Math.sin((tt - hit) * 90) : 0, fl = tt > hit ? Math.exp(-(tt - hit) * 9) : 0;
  const bp = (q: number) => ({ x: 1700 - 760 * q, y: 260 + 240 * q - 140 * Math.sin(q * Math.PI), w: 90 + 230 * q * q });
  const q = cl((tt - 0.4) / (hit - 0.4));
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ ...BOX, transform: `translate(${sh}px,${sh * 0.5}px)` }}>
      <Fondo id="lb_e07" tt={tt} b={6} br={0.55} />
      <Prop id="window_pane" x={960} y={1060} w={1000} sh={0} />
    </div>
    {tt < hit + 0.04 && tt > 0.4 && [0.12, 0.08, 0.04, 0].map((g, j) => { const b = bp(cl(q - g)); return <Prop key={j} id="baseball" x={b.x} y={b.y + b.w / 2} w={b.w} r={tt * 700} sh={0} o={j === 3 ? 1 : 0.18 + 0.12 * j} blur={j === 3 ? 1.5 : 5} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2 + rnd(i), L = (220 + 300 * rnd(i + 4)) * cr; return <path key={i} d={`M940,500 L${940 + Math.cos(a) * L * 0.5 + 20 * rnd(i + 8)},${500 + Math.sin(a) * L * 0.5} L${940 + Math.cos(a) * L},${500 + Math.sin(a) * L}`} fill="none" stroke="rgba(255,255,255,.9)" strokeWidth={4} />; })}
      {[80, 160].map((r, i) => <circle key={i} cx={940} cy={500} r={r * cr} fill="none" stroke="rgba(255,255,255,.65)" strokeWidth={3} strokeDasharray="30 18" />)}
      {tt > hit && Array.from({ length: 18 }, (_, i) => { const a = rnd(i + 20) * Math.PI * 2, s = (tt - hit), v = 500 + 600 * rnd(i + 30), x = 940 + Math.cos(a) * v * s, y = 500 + Math.sin(a) * v * s + 900 * s * s, z = 20 + 30 * rnd(i + 40);
        return s < 1.6 ? <polygon key={"s" + i} points={`${x},${y - z} ${x + z * 0.8},${y + z * 0.5} ${x - z * 0.6},${y + z * 0.4}`} fill="rgba(220,236,248,.7)" stroke="rgba(255,255,255,.95)" strokeWidth={2} transform={`rotate(${s * 400 * (rnd(i) - 0.5)},${x},${y})`} /> : null; })}
    </svg>
    {tt >= hit + 0.04 && <Prop id="baseball" x={940 + 260 * (tt - hit)} y={640 + 900 * (tt - hit) ** 2} w={300} r={tt * 300} sh={0} />}
    <div style={{ ...BOX, background: "#fff", opacity: fl * 0.85 }} />
  </Cam>;
}} />;

// m7 · Bud el cartero: del bolso salen los sobres de a UNO al frente, grande, con el apellido; después cada uno se va al abanico de atrás
const HMailFan: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), nm = ["Lindqvist", "Kowalski", "Dietz", "Haverson", "Pruitt", "Lou & June", "Nguyen"], seg = (d - 1) / nm.length;
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <Fondo id="lb_e08" tt={tt} b={9} br={0.45} />
    <Mesa y0={900} tone="#7a5a3a" />
    {nm.map((n, i) => { const at = 0.3 + i * seg, up = phys(tt, at, 7, 0.5), back = eio(tt, at + seg * 0.75, at + seg * 0.75 + 0.5), a = (-54 + i * 18) * back;
      if (tt < at) return null;
      return <div key={i} style={{ position: "absolute", left: 960 - 330, top: 330 - 120 * (1 - back) + 400 * (1 - up), width: 660, height: 400, zIndex: tt < at + seg * 0.75 ? 50 : i, transformOrigin: "50% 190%", transform: `rotate(${a}deg) scale(${1.1 - 0.35 * back})`, background: "linear-gradient(#f6efdc,#e2d6b6)", boxShadow: "8px 16px 22px rgba(0,0,0,.45)", border: "1px solid #c8b890" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 660, height: 400, background: "linear-gradient(155deg,transparent 49.6%,rgba(160,140,100,.35) 50%,transparent 50.6%), linear-gradient(25deg,transparent 49.6%,rgba(160,140,100,.35) 50%,transparent 50.6%)", clipPath: "inset(0 0 50% 0)" }} />
        <div style={{ position: "absolute", left: 0, width: 660, top: 190, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 104, color: "#22314f" }}>{n}</div>
        <div style={{ position: "absolute", right: 30, top: 26, width: 84, height: 100, background: "#b3322a", border: "5px dashed #fff" }} /></div>; })}
    <div style={{ position: "relative", zIndex: 60 }}><Prop id="mail_bag" x={960} y={1110} w={700} /></div>
  </Cam>;
}} />;

// m8 · Peter se cae de la bici: la bici se vuelca de costado; la cámara entra a la rueda que sigue girando borrosa y frena; la tiza escribe «Peter»
const HWheelName: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fall = phys(tt, 0.3, 6, 0.5), cut = eio(tt, 2.0, 2.8), sp = tt < 2 ? 900 : 900 * Math.exp(-(tt - 2) * 0.5), ang = tt < 2 ? 900 * tt : 1800 + 900 * (1 - Math.exp(-(tt - 2) * 0.5)) / 0.5, bl = cl(sp / 300) * 6;
  return <Cam tt={tt} d={d} z={0.04} fy={760}>
    <Fondo id="L_porche" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: -200, top: 760, width: 2320, height: 340, background: "repeating-linear-gradient(90deg,#9a968e 0 360px,#6e6a62 360px 368px)", transform: "perspective(800px) rotateX(50deg)", transformOrigin: "50% 0" }} />
    <div style={{ ...BOX, opacity: 1 - cut, transformOrigin: "960px 1000px", transform: `scale(${1 + cut * 0.8})` }}>
      <div style={{ ...BOX, transformOrigin: "960px 1010px", transform: `rotate(${-78 * fall}deg)` }}><Prop id="kids_bike" x={960} y={1010} w={640} sh={0} /></div>
      {fall > 0.9 && <Dust tt={tt} at={0.75} x={760} y={1000} w={500} />}
    </div>
    <div style={{ ...BOX, opacity: cut }}>
      <div style={{ position: "absolute", left: 960 - 330, top: 120, width: 660, height: 660, borderRadius: "50%", transform: `rotate(${ang}deg)`, filter: `blur(${bl}px)`,
        background: "radial-gradient(circle closest-side, #bbb 0 7%, #555 7.5% 9%, transparent 9.5% 80%, #8a8a8e 80% 83%, #1a1a1a 83.5% 99%, transparent 100%), repeating-conic-gradient(from 0deg, rgba(220,220,225,.95) 0 1.2deg, transparent 1.2deg 22.5deg)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 960 - 330, top: 120, width: 660, height: 660, borderRadius: "50%", background: "conic-gradient(rgba(255,255,255,.15), transparent 30%, rgba(255,255,255,.1) 60%, transparent)", opacity: cl(sp / 400) }} />
      <Tiza tt={tt} at={d / 2 + 0.6} x={960} y={930} txt="Peter" size={190} r={-4} />
    </div>
  </Cam>;
}} />;

// m9 · la ficha de June pegada a la heladera con cinta e imanes: la mano dibuja la calle, casitas con techo y escribe un nombre en cada una
const HStreetCard: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), road = eio(tt, 0.3, 1.2), nm = ["Lindqvist", "Kowalski", "Dietz", "Pruitt", "Haverson", "Ruth", "Bud", "Peter"], seg = (d - 2.2) / 8;
  const cur = Math.min(7, Math.max(0, Math.floor((tt - 1.4) / seg))), bx = (i: number) => 70 + (i % 4) * 330, by = (i: number) => i < 4 ? 70 : 470, k = cl(((tt - 1.4) % seg) / seg);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 300, top: 150, width: 1360, height: 800, background: "repeating-linear-gradient(#fdfaf0 0 58px,#b9cfe2 58px 60px)", borderTop: "14px solid #c0392b", transform: "rotate(-1.5deg)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 40, top: 395, width: 1280 * road, height: 30, background: "#555", borderRadius: 15 }} />
      <svg width={1360} height={800} style={{ position: "absolute", left: 0, top: 0 }} fill="none" stroke="#3a3a3a" strokeWidth={6} strokeLinejoin="round">
        {nm.map((_, i) => { const x = bx(i), y = by(i), o = cl((tt - 0.8 - i * 0.07) * 4); return <path key={i} opacity={o} d={`M${x},${y + 300} L${x},${y + 110} L${x + 130},${y + 20} L${x + 260},${y + 110} L${x + 260},${y + 300} Z`} />; })}
      </svg>
      {nm.map((n, i) => <Ink key={i} tt={tt} at={1.4 + i * seg} dur={seg * 0.8} x={bx(i) + 10} y={by(i) + 170} txt={n} size={i === 4 ? 46 : 52} w={250} />)}
    </div>
    {[[330, 170, -40], [1620, 175, 38], [320, 930, 35], [1630, 925, -32]].map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: x - 90, top: y - 26, width: 180, height: 52, background: "rgba(240,234,200,.72)", transform: `rotate(${r}deg)`, boxShadow: "0 3px 6px rgba(0,0,0,.2)" }} />)}
    <Prop id="pineapple_magnet" x={980} y={200} w={120} sh={0.4} />
    <Prop id="hand_pen" x={300 + bx(cur) + 60 + 220 * k} y={Math.min(1060, 150 + by(cur) + 220 + 340)} w={440} sh={0.4} />
  </Cam>;
}} />;

// m10 · los diarios del señor Dietz se apilan en el escalón de madera, uno por día, y la tiza cuenta de a cinco (el quinto cruza)
const HPaperStack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = Array.from({ length: 5 }, (_, i) => 0.3 + i * (d - 1.6) / 5);
  return <Cam tt={tt} d={d} z={0.07} fy={800}>
    <Fondo id="lb_e11" tt={tt} b={8} br={0.45} />
    <Prop id="wood_step" x={820} y={1120} w={1100} />
    {st.map((a, i) => { const L = land(tt, a, 600, 10, 0.35); return L.on ? <Prop key={i} id="newspaper" x={820 + 24 * (rnd(i) - 0.5)} y={760 - i * 46 + L.dy} w={480} r={(rnd(i + 3) - 0.5) * 12} sq={L.sq} sh={i === 0 ? 1 : 0.5} /> : null; })}
    <div style={{ position: "absolute", left: 1300, top: 250, width: 520, height: 400, background: "linear-gradient(#2c3a30,#1e2a22)", border: "16px solid #7a5232", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <Conteo tt={tt} ats={st.map((a) => a + 0.45)} x={1400} y={350} h={200} />
  </Cam>;
}} />;

// m11 · la señal del señor Dietz: la cortina de tela con pliegues se abre y entra la luz con polvo flotando; a la mitad se cierra y el cuarto queda en sombra
const HCurtainSun: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, op = tt < mid ? eio(tt, 0.3, 1.6) : 1 - eio(tt, mid, mid + 1.2), dark = eio(tt, mid, mid + 1.4), half = 470;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e12" tt={tt} b={6} br={0.6 - 0.35 * dark} />
    <div style={{ position: "absolute", left: 560, top: 110, width: 800, height: 620, background: "linear-gradient(#cfe4f2,#f6ecc8)", boxShadow: "inset 0 0 0 26px #efe8d6, 0 20px 40px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 600, top: 150, width: 720, height: 540, background: "linear-gradient(90deg, transparent 49%, #efe8d6 49% 51%, transparent 51%), linear-gradient(transparent 49%, #efe8d6 49% 51%, transparent 51%)" }} />
    {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 960 - half + (s > 0 ? half : 0) + s * 400 * op, top: 50, width: half, height: 760, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: s < 0 ? 0 : -half, top: 0, width: half * 2, height: 760, transform: `scaleX(${1 - 0.3 * op})`, transformOrigin: s < 0 ? "0 0" : "100% 0" }}><Prop id="curtain" x={half} y={790} w={half * 2} sh={0} /></div>
    </div>)}
    <div style={{ position: "absolute", left: 440, top: 690, width: 1100, height: 400, background: "linear-gradient(rgba(255,230,170,.6),rgba(255,220,150,.15))", clipPath: "polygon(12% 0,88% 0,100% 100%,0 100%)", opacity: op, mixBlendMode: "screen", filter: "blur(8px)" }} />
    {Array.from({ length: 40 }, (_, k) => { const x = 560 + 800 * rnd(k) + 30 * Math.sin(tt * 0.6 + k), y = 160 + ((rnd(k + 9) * 900 + tt * 18 * (0.5 + rnd(k + 3))) % 900); return <div key={k} style={{ position: "absolute", left: x, top: y, width: 5, height: 5, borderRadius: "50%", background: "#fff6d8", opacity: op * (0.4 + 0.5 * rnd(k + 2)), boxShadow: "0 0 6px #fff2c0" }} />; })}
    <div style={{ ...BOX, background: "rgba(10,14,24,.45)", opacity: dark }} />
  </Cam>;
}} />;

// m12 · el canje de llaves: dos llaves GRANDES cruzan en arco por arriba y cada una cae en la palma abierta del otro, que se cierra
const HKeySwap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d / 2), arc = Math.sin(p * Math.PI) * 420, Lb = p >= 1 ? phys(tt, d / 2, 8, 0.35) : 0, cl2 = eio(tt, d / 2 + 0.2, d / 2 + 0.7);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="lb_e29" tt={tt} b={10} br={0.45} />
    <Mesa y0={820} />
    <Prop id="hand_flat" x={560} y={1060} w={520} sh={0.5} />
    <Prop id="hand_flat" x={1360} y={1060} w={520} flip sh={0.5} />
    <Prop id="brass_key" x={560 + 800 * p} y={700 - arc + 30 * (1 - Lb) * (p >= 1 ? 1 : 0)} w={340} r={90 + p * 360} sh={p >= 1 ? 0.8 : 0} />
    <Prop id="silver_key" x={1360 - 800 * p} y={700 - arc * 0.85 + 30 * (1 - Lb) * (p >= 1 ? 1 : 0)} w={340} r={-90 - p * 360} sh={p >= 1 ? 0.8 : 0} />
    <Glow x={960} y={500} r={300} o={cl(1 - Math.abs(p - 0.5) * 4) * 0.8} />
  </Cam>;
}} />;

// m13 · la inundación del 93: la olla vuelca SOPA con verduras en cuatro frascos; cada uno humea y se le cierra la tapa
const HFloodJars: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tilt = eio(tt, 0.3, 0.9), seg = (d - 2.2) / 4, cur = Math.min(3, Math.floor(cl((tt - 0.9) / (d - 2.2)) * 4)), lvl = (i: number) => cl((tt - 0.9 - i * seg) / (seg * 0.8));
  const X = [560, 820, 1080, 1340], px = X[cur] - 160;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e14" tt={tt} b={8} br={0.45} />
    <Formica y0={820} />
    {X.map((x, i) => { const L = land(tt, 0.9 + (i + 1) * seg - 0.15, 260, 11, 0.4); return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 82, top: 960 - 330 * lvl(i), width: 164, height: 330 * lvl(i), background: "linear-gradient(rgba(206,120,46,.92),rgba(150,70,22,.95))", borderRadius: "0 0 18px 18px", overflow: "hidden" }}>
        {Array.from({ length: 16 }, (_, k) => <div key={k} style={{ position: "absolute", left: 10 + 140 * rnd(k + i * 20), top: 330 - 330 * rnd(k + i * 20 + 7), width: 22, height: 16, borderRadius: k % 3 ? 4 : "50%", background: ["#f08a24", "#6aa83a", "#f2e2b0"][k % 3] }} />)}
      </div>
      <Prop id="mason_jar" x={x} y={985} w={220} sh={0.6} style={{ opacity: 0.55 }} />
      {lvl(i) >= 1 && L.on && <div style={{ position: "absolute", left: x - 76, top: 578 + L.dy, width: 152, height: 34, borderRadius: 6, background: "linear-gradient(#e8e8e8,#9a9a9a 60%,#cfcfcf)", boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />}
      {lvl(i) > 0.5 && Array.from({ length: 2 }, (_, k) => { const q = (tt * 0.5 + k / 2 + i * 0.2) % 1; return <Puff key={k} x={x + 20 * Math.sin(q * 6)} y={560 - 220 * q} r={30 + 50 * q} o={(1 - q) * 0.4 * (L.on ? 0.4 : 1)} />; })}
    </React.Fragment>; })}
    {tt > 0.9 && tt < d - 1.2 && <div style={{ position: "absolute", left: X[cur] - 12, top: 520, width: 24, height: 440 - 230 * lvl(cur), background: "linear-gradient(90deg,#a8601e,#e09a46,#a8601e)", borderRadius: 12 }} />}
    <div style={{ ...BOX, transformOrigin: `${px + 200}px 460px`, transform: `rotate(${-55 * tilt}deg)` }}><Prop id="soup_pot" x={px + 260} y={560} w={420} sh={0} /></div>
  </Cam>;
}} />;

// m14 · la escalera prestada contra la casa: la sección de arriba sube tramo a tramo; cada traba hace «clac» con un destello; sombra en la pared
const HLadderUp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), steps = [0.4, 1.4, 2.4, d / 2], ext = steps.reduce((a, s) => a + 160 * phys(tt, s, 9, 0.35), 0);
  return <Cam tt={tt} d={d} z={0.05} fy={500}>
    <Fondo id="L_porche" tt={tt} b={9} br={0.55} />
    <div style={{ ...BOX, transformOrigin: "1000px 1060px", transform: "rotate(8deg) skewX(-18deg) translateX(90px)", opacity: 0.35, filter: "blur(10px) brightness(0)" }}>
      <Prop id="ladder" x={960} y={1080} w={300} sh={0} />
      <div style={{ ...BOX, transform: `translateY(${-ext}px)` }}><Prop id="ladder" x={975} y={1000} w={280} sh={0} /></div>
    </div>
    <div style={{ ...BOX, transformOrigin: "960px 1060px", transform: "rotate(8deg)" }}>
      <Prop id="ladder" x={960} y={1080} w={300} sh={1} />
      <div style={{ ...BOX, transform: `translateY(${-ext}px)` }}><Prop id="ladder" x={975} y={1000} w={280} sh={0} style={{ filter: "brightness(.9)" }} /></div>
      {steps.map((s, i) => { const f = tt > s + 0.2 ? Math.exp(-(tt - s - 0.2) * 5) : 0; return f > 0.02 ? <React.Fragment key={i}><Glow x={960} y={560} r={130} o={f * 2} col="255,255,230" /><Rings tt={tt} at={s + 0.2} x={960} y={560} s={0.5} /></React.Fragment> : null; })}
    </div>
  </Cam>;
}} />;

// m15 · la taza de azúcar es un bumerán: se va vacía hasta la mano de la vecina y VUELVE colmada de azúcar, con un frasco de mermelada con moño
const HSugarBack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, go = eio(tt, 0.4, mid - 0.4), back = eio(tt, mid, mid + 1.4), x = 640 + 760 * go - 760 * back, full = tt > mid - 0.2;
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={760} />
    <Prop id="hand_flat" x={1560} y={1040} w={480} flip sh={0.4} style={{ opacity: cl(1 - back * 1.5) }} />
    <Prop id="sugar_cup" x={x} y={930 - 140 * Math.sin(Math.PI * go) * (back > 0 ? 0 : 1) - 140 * Math.sin(Math.PI * back)} w={360} />
    {full && <div style={{ position: "absolute", left: x - 150, top: 930 - 140 * Math.sin(Math.PI * back) - 360, width: 300, height: 130, borderRadius: "50% 50% 30% 30%", filter: "drop-shadow(0 6px 6px rgba(0,0,0,.35))", background: "radial-gradient(circle at 40% 30%,#ffffff,#f2efe6 50%,#d8d2c4)", boxShadow: "inset 0 -6px 10px rgba(0,0,0,.12)", backgroundImage: "radial-gradient(rgba(150,140,120,.55) 1.4px, transparent 2px), radial-gradient(rgba(255,255,255,1) 1.2px, transparent 1.8px), radial-gradient(circle at 40% 25%,#ffffff,#ece6d6 55%,#bfb6a2)", backgroundSize: "9px 9px, 6px 6px, 100% 100%", backgroundPosition: "0 0, 3px 4px, 0 0" }} />}
    {back > 0.3 && <Prop id="jam_jar" x={x + 300} y={950} w={220} sh={1} o={cl((back - 0.3) * 3)} />}
  </Cam>;
}} />;

// m16 · el vecino que te sopla la nieve: la sopladora cruza y tira un chorro GRUESO de nieve en arco; detrás queda la entrada limpia y mojada
const HBlowerArc: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), x = 300 + 1100 * eio(tt, 0.2, d - 0.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e16" tt={tt} b={5} br={0.6} />
    <Nieve tt={tt} n={50} wind={30} o={0.6} />
    <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "linear-gradient(#f4f8fa,#cfd8de)", boxShadow: "inset 0 10px 20px rgba(160,180,200,.5)" }} />
    <div style={{ position: "absolute", left: 0, top: 880, width: x - 60, height: 200, background: "linear-gradient(#5a5c5e,#3e4042)" }} />
    <div style={{ position: "absolute", left: 0, top: 880, width: x - 60, height: 200, background: "linear-gradient(100deg,transparent 30%,rgba(200,220,240,.25) 45%,transparent 60%)" }} />
    {[920, 1010].map((y) => <div key={y} style={{ position: "absolute", left: 0, top: y, width: x - 60, height: 8, background: "rgba(30,30,32,.6)" }} />)}
    {Array.from({ length: 140 }, (_, k) => { const q = ((tt * 1.5 + rnd(k)) % 1), s = 12 + 22 * rnd(k + 1); return <div key={k} style={{ position: "absolute", left: x + 60 - 900 * q + 60 * rnd(k + 2), top: 720 - 560 * Math.sin(q * Math.PI * 0.8) + 50 * rnd(k + 3) + 300 * q * q, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: 0.95 * (1 - q * 0.4), filter: k % 4 ? "none" : "blur(2px)" }} />; })}
    {Array.from({ length: 5 }, (_, k) => { const q = (tt * 0.8 + k / 5) % 1; return <Puff key={k} x={x - 300 * q} y={700 - 280 * Math.sin(q * 2.4)} r={60 + 80 * q} col="rgba(255,255,255,.9)" o={(1 - q) * 0.6} />; })}
    <Prop id="snowblower" x={x} y={1010 + 3 * Math.sin(tt * 20)} w={520} flip />
  </Cam>;
}} />;

// m17 · las cercas: delante de una hilera de casas, los paneles ALTOS brotan del pasto de a uno y las van tapando
const HFenceRise: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="lb_e17" tt={tt} b={6} br={0.6} />
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "linear-gradient(#5a7a3a,#34501e)" }} />
    {[[260, -1], [760, 1], [1240, -1], [1700, 1]].map(([x, f], i) => <Prop key={i} id="small_house" x={x} y={840} w={520} flip={f > 0} sh={0.5} style={{ filter: `hue-rotate(${i * 70}deg) drop-shadow(10px 18px 14px rgba(0,0,0,.4))` }} />)}
    {Array.from({ length: 5 }, (_, i) => { const p = phys(tt, 0.3 + i * 0.9, 8, 0.4); return <div key={i} style={{ ...BOX, clipPath: "inset(0 0 0 0)" }}>
      <Prop id="fence_panel" x={190 + i * 385} y={1100 + 760 * (1 - p)} w={430} sh={0} style={{ transform: "scaleY(1.7)", transformOrigin: "50% 100%" }} />
      {p > 0.5 && <Dust tt={tt} at={0.3 + i * 0.9 + 0.25} x={190 + i * 385} y={1060} w={380} />}
    </div>; })}
  </Cam>;
}} />;

// m18 · una sola silla al frente: la reposera de aluminio arranca plegada y se abre en tres bisagras (patas, respaldo, apoyabrazos)
const HChairUnfold: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a1 = phys(tt, 0.6, 8, 0.38), a2 = phys(tt, 1.5, 8, 0.38), a3 = phys(tt, 2.4, 8, 0.38);
  const web = "repeating-linear-gradient(90deg,#2e8a4a 0 30px,#f2efe2 30px 60px)", web2 = "repeating-linear-gradient(0deg,#2e8a4a 0 30px,#f2efe2 30px 60px)", al = "linear-gradient(90deg,#9aa0a6,#eef2f6 45%,#8a9096)";
  const sx = 760, sy = 820, sw = 420;
  return <Cam tt={tt} d={d} z={0.08} fy={800}>
    <Fondo id="lb_e18" tt={tt} b={7} br={0.55} />
    <div style={{ position: "absolute", left: 0, top: 960, width: 1920, height: 120, background: "repeating-linear-gradient(90deg,#8a6a4a 0 6px,#a8845e 6px 200px)" }} />
    <div style={{ position: "absolute", left: sx - 40, top: 1010, width: sw + 80, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.45),transparent 70%)" }} />
    {[[sx, 1], [sx + sw, -1]].map(([x, s], i) => <div key={i} style={{ position: "absolute", left: x - 7, top: sy, width: 14, height: 200, background: al, borderRadius: 7, transformOrigin: "50% 0", transform: `rotate(${s * (100 - 112 * a1)}deg)` }} />)}
    <div style={{ position: "absolute", left: sx, top: sy - 20, width: sw, height: 40, background: web, border: "6px solid #c8ccd0", borderRadius: 6, boxShadow: "0 8px 12px rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: sx - 6, top: sy - 400, width: sw * 0.9, height: 400, transformOrigin: "0 100%", transform: `rotate(${90 - 102 * a2}deg)`, background: web2, border: "8px solid #c8ccd0", borderRadius: 8, boxShadow: "0 10px 16px rgba(0,0,0,.35)" }} />
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: sx + 10, top: sy - 150 - i * 6, width: sw - 20, height: 18, background: al, borderRadius: 9, transformOrigin: "0 50%", transform: `rotate(${-80 + 80 * a3}deg)`, opacity: a2 > 0.5 ? 1 : 0 }} />)}
    <Glow x={960} y={760} r={380} o={cl((tt - 3) * 2) * 0.6} />
  </Cam>;
}} />;

// m19 · dos minutos en los escalones: el termo y la taza, en primer plano GRANDE, chocan a la mitad (brindis) con vapor
const HTwoCups: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = eio(tt, 0.3, mid), bump = tt > mid ? swing(tt, mid, 18, 9, 3) : 0;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="lb_e19" tt={tt} b={12} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 900, width: 1920, height: 180, background: "linear-gradient(#8a847a,#5a564e)", boxShadow: "inset 0 10px 0 #a8a298" }} />
    <Prop id="thermos_cup" x={300 + 400 * p - bump} y={1030} w={480} r={tt > mid ? -bump * 0.4 + 8 : 8 * p} />
    <Prop id="coffee_mug2" x={1640 - 420 * p + bump} y={1030} w={520} flip r={tt > mid ? bump * 0.4 - 8 : -8 * p} />
    <Glow x={960} y={640} r={240} o={tt > mid ? cl(1 - (tt - mid) * 1.5) * 1.6 : 0} col="255,255,230" />
    <Rings tt={tt} at={mid} x={960} y={640} s={0.8} />
    {Array.from({ length: 6 }, (_, k) => { const q = (tt * 0.5 + k / 6) % 1; return <Puff key={k} x={(k % 2 ? 1640 - 420 * p : 300 + 400 * p) + 40 * Math.sin(q * 5)} y={560 - 360 * q} r={50 + 80 * q} o={(1 - q) * 0.4} />; })}
  </Cam>;
}} />;

// m20 · la noche del abrigo finito: el termómetro vertical de la pared baja su columna roja bajo cero y la escarcha crece en el vidrio
const HMercuryDrop: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d * 0.6), fr = eio(tt, 0.8, d - 0.4), top = 160, H = 640, col = H * (0.85 - 0.6 * p);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="lb_e20" tt={tt} b={9} br={0.4} />
    <div style={{ position: "absolute", left: 760, top: top - 40, width: 200, height: H + 200, borderRadius: 30, background: "linear-gradient(90deg,#d8d2c4,#f6f2e8 40%,#c8c2b4)", boxShadow: "0 24px 50px rgba(0,0,0,.55)" }} />
    {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: "absolute", left: 790, top: top + i * (H / 12), width: i % 2 ? 26 : 44, height: 5, background: "#333" }} />)}
    {[[0, "40"], [4, "20"], [8, "0"], [12, "-20"]].map(([i, s]) => <div key={s as string} style={{ position: "absolute", left: 892, top: top + (i as number) * (H / 12) - 22, fontFamily: SER, fontWeight: 900, fontSize: 36, color: "#333" }}>{s}</div>)}
    <div style={{ position: "absolute", left: 850, top: top, width: 22, height: H, borderRadius: 11, background: "rgba(255,255,255,.7)", boxShadow: "inset 0 0 6px rgba(0,0,0,.3)" }} />
    <div style={{ position: "absolute", left: 853, top: top + H - col, width: 16, height: col + 10, borderRadius: 8, background: "linear-gradient(90deg,#8a0a0a,#e8302a,#8a0a0a)" }} />
    <div style={{ position: "absolute", left: 826, top: top + H - 6, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff6a5a,#b30a0a)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 1120, top: 400, fontFamily: SER, fontWeight: 900, fontSize: 210, color: "#e8f2f8", textShadow: "0 6px 16px rgba(0,0,0,.6)" }}>{Math.round(30 - 52 * p)}°</div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 0.9 }}>
      {Array.from({ length: 14 }, (_, i) => { const cx = i % 2 ? 1920 * rnd(i) : (i % 4 < 2 ? 0 : 1920), cy = i % 2 ? (i % 4 < 2 ? 0 : 1080) : 1080 * rnd(i + 3), a = Math.atan2(540 - cy, 960 - cx), L = 420 * fr * (0.6 + 0.6 * rnd(i + 7));
        const ex = cx + Math.cos(a) * L, ey = cy + Math.sin(a) * L;
        return <g key={i} stroke="rgba(235,246,255,.85)" strokeWidth={3} fill="none"><path d={`M${cx},${cy} L${ex},${ey}`} />
          {[0.3, 0.5, 0.7, 0.85].map((u, j) => { const bx = cx + (ex - cx) * u, by = cy + (ey - cy) * u, l = 70 * (1 - u) * fr; return <path key={j} d={`M${bx + Math.cos(a + 0.8) * l},${by + Math.sin(a + 0.8) * l} L${bx},${by} L${bx + Math.cos(a - 0.8) * l},${by + Math.sin(a - 0.8) * l}`} />; })}</g>; })}
    </svg>
    <div style={{ ...BOX, background: "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 55%, rgba(230,242,250,.75) 100%)", opacity: fr }} />
  </Cam>;
}} />;

// m21 · el piloto: chispa del encendedor a los 0,5 s, se prende una llama azul ALTA, y a la mitad una ola de luz naranja barre el cuarto
const HPilotRelight: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), on = eio(tt, 0.7, 1.1), warm = eio(tt, d / 2, d / 2 + 1.6), sw = cl((tt - d / 2) / 1.6);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="lb_e21" tt={tt} b={9} br={0.28 + 0.3 * warm} />
    <Prop id="furnace" x={960} y={1060} w={760} />
    <div style={{ position: "absolute", left: 800, top: 640, width: 320, height: 170, background: "#060606", borderRadius: 12, boxShadow: "inset 0 0 24px #000", overflow: "hidden" }}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 14 + i * 30, bottom: 12, width: 22, height: (80 + 26 * Math.sin(tt * 16 + i * 1.7)) * on, borderRadius: "50% 50% 30% 30%", background: "linear-gradient(#e6f6ff,#4a8aff 45%,#0a2a8a)", boxShadow: "0 0 18px #4a8aff" }} />)}
    </div>
    {tt > 0.4 && tt < 1.3 && Array.from({ length: 22 }, (_, k) => { const s = tt - 0.45 - 0.02 * (k % 4), a = -Math.PI * rnd(k), v = 300 + 300 * rnd(k + 5); return s > 0 && s < 0.6 ? <div key={k} style={{ position: "absolute", left: 960 + Math.cos(a) * v * s, top: 780 + Math.sin(a) * v * s + 600 * s * s, width: 7, height: 7, borderRadius: "50%", background: "#fff4b0", boxShadow: "0 0 10px #ffc040", opacity: 1 - s / 0.6 }} /> : null; })}
    <Glow x={960} y={720} r={340} o={on * 1.4} col="90,150,255" />
    <div style={{ ...BOX, background: "radial-gradient(ellipse at 50% 70%, rgba(255,150,60,.45), rgba(255,120,40,.14) 60%, transparent)", opacity: warm, mixBlendMode: "screen" }} />
    {sw > 0 && sw < 1 && <div style={{ position: "absolute", left: -900 + 2900 * sw, top: 0, width: 900, height: 1080, background: "linear-gradient(90deg,transparent,rgba(255,160,70,.45),transparent)", mixBlendMode: "screen" }} />}
  </Cam>;
}} />;

// m22 · el día de la basura: el tacho verde baja RODANDO por la entrada hasta el cordón y se tambalea; al lado cae una hoja gigante de almanaque: TUESDAY
const HGarbageTuesday: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = eio(tt, 0.3, mid), wob = tt > mid ? swing(tt, mid, 9, 8, 2.2) : Math.sin(tt * 24) * 3, L = land(tt, mid + 0.6, 900, 9, 0.32);
  return <Cam tt={tt} d={d} z={0.05} fy={800}>
    <Fondo id="lb_e22" tt={tt} b={5} br={0.6} />
    <Prop id="garbage_can" x={300 + 760 * p} y={760 + 280 * p} w={300 + 160 * p} r={-6 + wob} style={{ filter: "hue-rotate(80deg) saturate(1.6) drop-shadow(14px 22px 16px rgba(0,0,0,.45))" }} />
    {p > 0 && p < 1 && Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 300 + 760 * p - 120 - k * 60, top: 1000 + 280 * p * 0 - 20, width: 30, height: 8, borderRadius: 4, background: "rgba(255,255,255,.3)", opacity: 1 - k / 6 }} />)}
    {L.on && <div style={{ position: "absolute", left: 1320, top: 260 + L.dy, width: 500, height: 600, background: "#fbf6e6", boxShadow: "14px 24px 32px rgba(0,0,0,.5)", transform: `rotate(${4 + 10 * (1 - L.k)}deg) scaleY(${1 - 0.06 * L.sq})`, transformOrigin: "50% 100%" }}>
      <div style={{ height: 120, background: "#b3322a", color: "#fff", fontFamily: SER, fontWeight: 900, fontSize: 64, textAlign: "center", lineHeight: "120px" }}>OCTOBER</div>
      <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 250, textAlign: "center", color: "#222", lineHeight: "300px" }}>14</div>
      <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 96, textAlign: "center", color: "#b3322a" }}>TUESDAY</div>
    </div>}
  </Cam>;
}} />;

// m23 · el libro de firmas: nueve firmas se escriben solas en la hoja limpia de la izquierda, y aparece un 9 grande bien adentro del cuadro
const HGuestBook: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), sg = ["Lou", "June", "Peter L.", "Bud Pruitt", "Rev. Olsen", "A. Kowalski", "Danny N.", "M. Dietz", "Ruth"], seg = (d / 2) / 9;
  return <Cam tt={tt} d={d} z={0.06} fy={540}>
    <Fondo id="lb_e23" tt={tt} b={10} br={0.4} />
    <Prop id="guest_book" x={900} y={1040} w={1300} />
    <div style={{ position: "absolute", left: 440, top: 260, width: 470, height: 620, transform: "rotate(-1deg)", background: "linear-gradient(90deg,#f6f0e0,#efe6d0)", boxShadow: "inset -14px 0 20px rgba(120,100,70,.25)" }}>
      {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20, top: 80 + i * 50, width: 430, height: 2, background: "rgba(80,80,100,.35)" }} />)}
      {sg.map((s_, i) => <Ink key={i} tt={tt} at={0.4 + i * seg} dur={seg * 0.9} x={34} y={30 + i * 50} txt={s_} size={46} w={420} col="#1e2a48" />)}
    </div>
    <div style={{ position: "absolute", left: 1010, top: 520, width: 300, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 300, color: "#1e2a48", opacity: cl((tt - d / 2 - 0.4) * 2), transform: `scale(${0.7 + 0.3 * phys(tt, d / 2 + 0.4, 8, 0.4)})` }}>9</div>
  </Cam>;
}} />;

// m24 · los 30 días: cuatro tablas se clavan una debajo de otra; el martillo, entero en cuadro, hunde un clavo de verdad en cada una
const HSignNails: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.4, bt(h, 0, 3.4), bt(h, 1, 6.4), bt(h, 2, 9.2)], tx = ["Week 1 · the card", "Week 2 · a key", "Week 3 · borrow", "Week 4 · host"];
  const cur = Math.max(0, st.filter((x) => tt >= x).length - 1), blows = (i: number) => [0.5, 0.8, 1.1].filter((b) => tt > st[i] + b).length;
  const ph = ((tt - st[cur] - 0.35) / 0.3), sw = ph > 0 && ph < 3 ? Math.abs(Math.sin(ph * Math.PI)) : 0;
  const nx = 1330, ny = (i: number) => 150 + i * 200;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="L_taller" tt={tt} b={8} br={0.45} />
    {tx.map((s_, i) => { const L = land(tt, st[i], 500, 10, 0.35), b = blows(i); return L.on ? <div key={i} style={{ ...BOX, transform: `translateY(${L.dy}px)` }}>
      <div style={{ position: "absolute", left: 420, top: 90 + i * 200, width: 960, height: 160, borderRadius: 10, background: "repeating-linear-gradient(0deg,#a8784a 0 18px,#9a6a3e 18px 22px,#b0824e 22px 40px)", boxShadow: "0 16px 24px rgba(0,0,0,.5), inset 0 0 0 5px rgba(60,30,10,.4)" }} />
      <div style={{ position: "absolute", left: 420, top: 124 + i * 200, width: 880, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 68, color: "#2a1606" }}>{s_}</div>
      <div style={{ position: "absolute", left: nx - 9, top: ny(i) - 70 + b * 22, width: 18, height: 70 - b * 22, background: "linear-gradient(90deg,#6a6a6a,#d8d8d8,#6a6a6a)" }} />
      <div style={{ position: "absolute", left: nx - 20, top: ny(i) - 80 + b * 22, width: 40, height: 14, borderRadius: 7, background: "linear-gradient(#e8e8e8,#7a7a7a)", boxShadow: "0 3px 4px rgba(0,0,0,.5)" }} />
      {b > 0 && tt - st[i] < 1.4 && <Rings tt={tt} at={st[i] + 0.5 + (b - 1) * 0.3} x={nx} y={ny(i) - 70} s={0.35} />}
    </div> : null; })}
    <Prop id="hammer" x={nx + 300} y={ny(cur) + 170 - 110 * sw} w={480} r={-10 - 45 * sw} sh={0} />
  </Cam>;
}} />;

// m25 · seis millas: sobre el mapa de papel del condado la brújula de bronce marca la granja, se abre el círculo y caen alfileres rojos grandes
const HSixMiles: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), r = 360 * eio(tt, 0.8, 2.6), cx = 960, cy = 560;
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="lb_e24" tt={tt} b={10} br={0.35} />
    <div style={{ ...BOX, transform: "perspective(1800px) rotateX(18deg)", transformOrigin: "50% 100%" }}>
      <Prop id="county_map" x={960} y={1080} w={1500} sh={0.6} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><circle cx={cx} cy={cy} r={r} fill="rgba(179,50,42,.10)" stroke="#b3322a" strokeWidth={10} strokeDasharray="28 16" /></svg>
      <Prop id="small_house" x={cx} y={cy + 30} w={110} sh={0.6} style={{ filter: "hue-rotate(-20deg) saturate(1.6)" }} />
      {Array.from({ length: 12 }, (_, i) => { const a = rnd(i) * Math.PI * 2, rr = 90 + 260 * rnd(i + 9), at = 2.4 + i * 0.3, L = land(tt, at, 400, 12, 0.3); return L.on ? <Prop key={i} id="map_pin" x={cx + rr * Math.cos(a)} y={cy + rr * Math.sin(a) + L.dy} w={70} r={-12} sq={L.sq} sh={0.6} /> : null; })}
    </div>
    <Prop id="brass_compass" x={1520 - 300 * eio(tt, 0.2, 0.8)} y={1040 - 120 * eio(tt, 0.2, 0.8)} w={360} r={20 * (1 - eio(tt, 0.2, 0.8))} sh={1} />
  </Cam>;
}} />;

// m26 · no se hacen amigos apurado: el reloj de arena se da vuelta de golpe; un hilo de arena con granos que caen y el montículo crece
const HHourglassFlip: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fl = phys(tt, 0.3, 7, 0.4), sand = cl((tt - 0.9) / (d - 1.2));
  return <Cam tt={tt} d={d} z={0.1} fy={640}>
    <Fondo id="L_cocina" tt={tt} b={9} br={0.45} />
    <Formica y0={860} />
    <div style={{ ...BOX, transformOrigin: "960px 640px", transform: `rotate(${180 * fl}deg)` }}><Prop id="hourglass" x={960} y={1000} w={420} sh={0} /></div>
    {tt > 0.9 && <div style={{ position: "absolute", left: 955, top: 640, width: 10, height: 300 - 100 * sand, background: "linear-gradient(90deg,#c8a050,#f2d890,#c8a050)", borderRadius: 5 }} />}
    {tt > 0.9 && Array.from({ length: 10 }, (_, k) => { const q = (tt * 2.2 + k / 10) % 1; return <div key={k} style={{ position: "absolute", left: 957 + 6 * (rnd(k) - 0.5), top: 640 + (300 - 100 * sand) * q, width: 6, height: 6, borderRadius: "50%", background: "#fff0c0" }} />; })}
    {tt > 0.9 && <div style={{ position: "absolute", left: 960 - 120 * Math.sqrt(sand), top: 940 - 110 * Math.sqrt(sand), width: 240 * Math.sqrt(sand), height: 110 * Math.sqrt(sand), background: "radial-gradient(ellipse at 50% 0,#f0d080,#c89a48)", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />}
  </Cam>;
}} />;

// m27 · la vereda limpia: una pala chica levanta terrones de nieve que vuelan; detrás queda el camino mojado y brillante hasta la puerta
const HShovelPath: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1.0), sx = 1700 - 1300 * p, sc = (tt * 1.4) % 1;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e25" tt={tt} b={2} br={0.8} />
    <div style={{ position: "absolute", left: 0, top: 700, width: 1920, height: 380, background: "linear-gradient(#80848a,#5c6066)" }} />
    <div style={{ position: "absolute", left: 0, top: 700, width: 1920, height: 380, background: "linear-gradient(95deg,transparent 30%,rgba(220,235,250,.28) 42%,transparent 55%), radial-gradient(ellipse 30% 10% at 60% 70%,rgba(255,255,255,.25),transparent)" }} />
    <div style={{ position: "absolute", left: 0, top: 640, width: sx + 40, height: 440, background: "linear-gradient(#f4f8fa,#dce6ec)", borderRadius: "0 80px 0 0", boxShadow: "inset -20px 10px 30px rgba(150,170,190,.6)" }} />
    <div style={{ position: "absolute", left: sx + 40, top: 620, width: 1920 - sx, height: 90, background: "linear-gradient(#ffffff,#d8e2ea)", borderRadius: "50% 50% 0 0" }} />
    <Nieve tt={tt} n={40} wind={20} o={0.7} />
    <Prop id="snow_shovel" x={sx + 60} y={990} w={320} r={-22 + 14 * Math.sin(sc * Math.PI * 2)} />
    {Array.from({ length: 22 }, (_, k) => { const q = ((tt * 1.4 + rnd(k) * 0.3) % 1), s = 20 + 30 * rnd(k + 3); return <div key={k} style={{ position: "absolute", left: sx - 40 - 360 * q + 40 * rnd(k), top: 820 - 340 * Math.sin(q * Math.PI) + 40 * rnd(k + 1), width: s, height: s * 0.8, borderRadius: "40%", background: "radial-gradient(circle at 35% 30%,#fff,#dfe8ee)", opacity: 1 - q * 0.6, transform: `rotate(${q * 300}deg)` }} />; })}
  </Cam>;
}} />;

// m28 · la nota en la bolsita: la bolsa de plástico cuelga del picaporte; sale la nota y se despliega con pliegues y sombra, con la letra de Danny
const HNoteBag: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), come = eio(tt, 1.0, 2.4), unf = eio(tt, 2.4, 3.2);
  return <Cam tt={tt} d={d} z={0.04}>
    <Fondo id="lb_e26" tt={tt} b={8} br={0.45} />
    <Prop id="front_door" x={960} y={1120} w={760} />
    <div style={{ ...BOX, transformOrigin: "1120px 560px", transform: `rotate(${swing(tt, 0.2, 8, 4, 0.8)}deg)` }}><Prop id="plastic_bag" x={1120} y={900} w={300} sh={0.4} /></div>
    {unf < 0.05 && come > 0 && <div style={{ position: "absolute", left: 1120 - 160 + (960 - 1120) * come - 160 * come, top: 760 - 420 * come, width: 320 + 320 * come, height: 220 + 220 * come, background: "linear-gradient(#fdfbf2,#e8e0c8)", boxShadow: "0 24px 40px rgba(0,0,0,.5)", transform: `rotate(${-8 + 8 * come}deg)` }} />}
    {unf > 0 && <div style={{ position: "absolute", left: 960 - 520, top: 140, width: 1040, height: 760, transformOrigin: "50% 0", transform: `scaleY(${unf})`, boxShadow: "0 40px 70px rgba(0,0,0,.55)", padding: 60, background: "linear-gradient(rgba(0,0,0,.1) 0, transparent 2%, transparent 31%, rgba(0,0,0,.12) 33%, rgba(255,255,255,.3) 34%, transparent 36%, transparent 64%, rgba(0,0,0,.12) 66%, rgba(255,255,255,.3) 67%, transparent 69%), linear-gradient(#fdfbf2,#efe8d2)" }}>
      <Ink tt={tt} at={3.3} dur={2.2} x={70} y={70} txt="Mr. Lou," size={110} w={900} />
      <Ink tt={tt} at={5.6} dur={2.6} x={70} y={270} txt="we shovel your walk now." size={96} w={920} />
      <Ink tt={tt} at={8.4} dur={1.4} x={520} y={540} txt="— Danny" size={96} w={460} col="#4a2a1a" />
    </div>}
  </Cam>;
}} />;

// m29 · cuarenta minutos: el botón del cronómetro se hunde, la aguja GRUESA barre con estela y el contador llega a 40
const HStopwatch40: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.2), click = phys(tt, 0.3, 10, 0.3), a = p * 40 * 36, cx = 760, cy = 620;
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="lb_e20" tt={tt} b={10} br={0.35} />
    <div style={{ ...BOX, transform: `translateY(${-10 * (1 - click)}px)` }}><Prop id="stopwatch" x={cx} y={1000} w={760} /></div>
    <div style={{ position: "absolute", left: cx - 240, top: cy - 240, width: 480, height: 480, borderRadius: "50%", background: `conic-gradient(from ${a - 60}deg, transparent 0deg, rgba(179,50,42,.35) 60deg, transparent 60deg)`, opacity: cl((p < 1 ? 1 : 0)) }} />
    <div style={{ position: "absolute", left: cx - 9, top: cy - 230, width: 18, height: 250, background: "linear-gradient(90deg,#7a0a0a,#e8302a,#7a0a0a)", borderRadius: 9, transformOrigin: "50% 230px", transform: `rotate(${a}deg)`, boxShadow: "0 0 8px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: cx - 22, top: cy - 22, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(#eee,#555)" }} />
    <Odo x={1480} y={480} v={40 * p} n={2} size={210} />
    <div style={{ position: "absolute", left: 1250, top: 640, width: 460, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 120, color: "#f3e6c6", textShadow: "0 6px 16px rgba(0,0,0,.6)" }}>minutes</div>
  </Cam>;
}} />;

// m30 · todo lo que te perdés: los bowls blancos se apilan en una torre, la cámara sube con ella y el contador llega a 792
const HChiliTower: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1.2), N = 16, f = N * p, n = Math.floor(f), lift = Math.max(0, n - 6) * 52;
  return <Cam tt={tt} d={d} z={0.05} fy={500}>
    <Fondo id="lb_e28" tt={tt} b={9} br={0.45} />
    <div style={{ ...BOX, transform: `translateY(${lift}px)` }}>
      <Mesa y0={900} />
      {Array.from({ length: n }, (_, i) => <Prop key={i} id="white_bowl" x={760 + 6 * Math.sin(i * 1.3)} y={990 - i * 52} w={320} sh={i === 0 ? 1 : 0.2} />)}
      {n < N && <Prop id="white_bowl" x={760} y={990 - n * 52 - 380 * (1 - (f % 1))} w={320} sh={0} />}
    </div>
    <div style={{ position: "absolute", left: 1220, top: 360, padding: "30px 50px", background: "rgba(20,14,8,.55)", borderRadius: 20 }}>
      <div style={{ position: "relative", width: 420, height: 200 }}><Odo x={210} y={100} v={Math.round(792 * p)} n={3} size={170} /></div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: "#f3e6c6", textAlign: "center" }}>bowls</div>
    </div>
  </Cam>;
}} />;

// m31 · la olla de chili: una mano levanta los bowls de a uno y se los lleva; en el pizarrón grande la tiza cuenta siete
const HBowlsTaken: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), seg = (d - 1.4) / 7;
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="lb_e27" tt={tt} b={8} br={0.5} />
    <Mesa y0={880} tone="#7a5a3a" />
    <Prop id="slow_cooker" x={480} y={990} w={520} />
    {Array.from({ length: 4 }, (_, k) => { const q = (tt * 0.4 + k / 4) % 1; return <Puff key={k} x={480 + 30 * Math.sin(q * 6)} y={700 - 240 * q} r={40 + 50 * q} o={(1 - q) * 0.4} />; })}
    {Array.from({ length: 7 }, (_, i) => { const at = 0.4 + i * seg, go = eio(tt, at + 0.3, at + 0.9), gone = tt > at + 0.9, y = 990 - (6 - i) * 40;
      if (gone) return null;
      const lifting = tt > at;
      return <React.Fragment key={i}>
        <Prop id="white_bowl" x={960 - 500 * go} y={y - 520 * go} w={260} sh={go > 0 ? 0 : 0.3} />
        {lifting && <Prop id="hand_pinch" x={1000 - 500 * go} y={y - 60 - 520 * go - 140 * (1 - eio(tt, at, at + 0.3))} w={300} r={160} sh={0} />}
      </React.Fragment>; })}
    <div style={{ position: "absolute", left: 1230, top: 140, width: 600, height: 420, background: "linear-gradient(#2c3a30,#1e2a22)", border: "18px solid #7a5232", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <Conteo tt={tt} ats={Array.from({ length: 7 }, (_, i) => 0.4 + i * seg + 0.8)} x={1310} y={230} h={240} />
  </Cam>;
}} />;

// m32 · la tarea: el cartel cuelga de dos cadenas de hierro de verdad, se hamaca hasta quedar quieto y una franja de luz lo cruza
const HSignSwing: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = swing(tt, 0.2, 22, 3.4, 0.55) + (tt < 0.2 ? 22 : 0), drop = eio(tt, 0, 0.3), lx = cl((tt - d / 2) / 1.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e32" tt={tt} b={8} br={0.45} />
    <div style={{ ...BOX, transformOrigin: "960px 0", transform: `translateY(${-300 * (1 - drop)}px) rotate(${a}deg)` }}>
      {[700, 1220].map((x) => <div key={x} style={{ position: "absolute", left: x - 40, top: -40, width: 80, height: 440, overflow: "hidden" }}>
        {[0, 1, 2].map((j) => <Prop key={j} id="chain_link" x={40} y={150 + j * 140} w={60} sh={0} />)}</div>)}
      <Prop id="porch_sign" x={960} y={780} w={780} sh={0} />
      <div style={{ position: "absolute", left: 600, top: 540, width: 720, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 116, color: "#b3322a", textShadow: "0 3px 0 rgba(255,255,255,.4)" }}>HOMEWORK</div>
      {lx > 0 && lx < 1 && <div style={{ position: "absolute", left: 560 + 900 * lx - 120, top: 380, width: 240, height: 480, background: "linear-gradient(90deg,transparent,rgba(255,240,200,.55),transparent)", transform: "skewX(-20deg)", mixBlendMode: "screen" }} />}
    </div>
  </Cam>;
}} />;

// m33 · el repaso: Elm Street al anochecer, casas de verdad; con cada consejo se prende un farol de porche y su cono de luz baja a los escalones
const HPorchLights: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.4, ...Array.from({ length: 6 }, (_, i) => bt(h, i, 2 + i * 1.7))];
  const P: [number, number, number, boolean][] = [[300, 1080, 1.25, false], [1620, 1080, 1.25, true], [960, 1040, 1.1, false], [620, 820, 0.75, true], [1300, 820, 0.75, false], [820, 700, 0.5, true], [1100, 700, 0.5, false]];
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Fondo id="lb_e34" tt={tt} b={6} br={0.25} />
    <div style={{ ...BOX, background: "linear-gradient(rgba(10,14,40,.55), rgba(10,10,20,.25))" }} />
    {[...P].reverse().map(([x, y, s, f], j) => { const i = P.length - 1 - j, on = cl((tt - st[i]) * 5), fl = tt > st[i] && tt < st[i] + 0.25 ? 0.5 + 0.5 * Math.sin(tt * 80) : 1, w = 560 * s, lx = x + (f ? -1 : 1) * w * 0.12, ly = y - w * 0.36;
      return <React.Fragment key={i}>
        <Prop id="small_house" x={x} y={y} w={w} flip={f} sh={0.5} style={{ filter: `brightness(${0.35 + 0.25 * on}) hue-rotate(${i * 50}deg)` }} />
        <div style={{ position: "absolute", left: lx - w * 0.25, top: ly, width: w * 0.5, height: w * 0.42, background: `linear-gradient(rgba(255,214,140,${0.55 * on * fl}),rgba(255,200,120,0))`, clipPath: "polygon(45% 0,55% 0,100% 100%,0 100%)", mixBlendMode: "screen" }} />
        <Prop id="porch_lamp" x={lx} y={ly + w * 0.04} w={w * 0.08} sh={0} style={{ filter: `brightness(${0.4 + 0.8 * on * fl})` }} />
      </React.Fragment>; })}
  </Cam>;
}} />;

export const HCB2: Record<string, C> = {
  dollyBeep: HDollyBeep, tapeSteps: HTapeSteps, pianoRamp: HPianoRamp, pineappleNote: HPineappleNote, houseRows: HHouseRows, kringleIce: HKringleIce,
  ballCrack: HBallCrack, mailFan: HMailFan, wheelName: HWheelName, streetCard: HStreetCard, paperStack: HPaperStack, curtainSun: HCurtainSun,
  keySwap: HKeySwap, floodJars: HFloodJars, ladderUp: HLadderUp, sugarBack: HSugarBack, blowerArc: HBlowerArc, fenceRise: HFenceRise,
  chairUnfold: HChairUnfold, twoCups: HTwoCups, mercuryDrop: HMercuryDrop, pilotRelight: HPilotRelight, garbageTuesday: HGarbageTuesday,
  guestBook: HGuestBook, signNails: HSignNails, sixMiles: HSixMiles, hourglassFlip: HHourglassFlip, shovelPath: HShovelPath, noteBag: HNoteBag,
  stopwatch40: HStopwatch40, chiliTower: HChiliTower, bowlsTaken: HBowlsTaken, signSwing: HSignSwing, porchLights: HPorchLights,
};
