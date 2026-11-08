// comps.tsx · hr8pc: un mecanismo distinto por minuto, ninguno repetido con hr8pb. Cada pieza es un OBJETO que es la idea.
import React from "react";
import { INK, MANO, ORO, P, PAPER2, FONT, Say, Stage, Drop, TINTA, T, abs, center, glow, piedra, cl, e, ei, laton, lerp, madera, papel, rnd, sp } from "./stage";

// 00:03 Concentrador de oxígeno: la onda del zumbido se aplana al apagarse
const HumWave: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const off = T(p, "off", 4.4), amp = 1 - e(t, off, off + 0.7), q = t - a;
  const d = "M0 150 " + Array.from({ length: 121 }, (_, i) => `L ${i * 10} ${150 + Math.sin(i * 0.52 + q * 10) * 118 * amp}`).join(" ");
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={320} y={190} w={1280} h={650} from={-620}>
      <div style={{ ...abs(0, 0, 1280, 650), background: "linear-gradient(170deg,#dad7cf,#8d8a82)", borderRadius: 40, boxShadow: "inset 0 4px 0 rgba(255,255,255,.7)" }} />
      <div style={{ ...abs(40, 40, 1200, 320), background: "#07110c", borderRadius: 16, boxShadow: "inset 0 10px 24px #000", overflow: "hidden" }}><svg style={abs(0, 10, 1200, 300)}><path d={d} stroke={amp > 0.05 ? "#79ffb4" : "#3a5c48"} strokeWidth={8} fill="none" style={{ filter: amp > 0.05 ? "drop-shadow(0 0 12px #79ffb4)" : undefined }} /></svg></div>
      <div style={{ ...abs(90, 430, 150, 150), borderRadius: "50%", ...laton() }}><div style={{ ...abs(66, 10, 18, 72), background: "#3a2a10", transformOrigin: "9px 65px", transform: `rotate(${amp * 62 - 62}deg)` }} /></div>
      <div style={{ ...abs(330, 430, 860, 150), borderRadius: 18, background: "repeating-linear-gradient(90deg,#55524c 0 16px,#26241f 16px 30px)" }} />
    </Drop>
    <Say t={t} at={off + 0.5} tx="SWITCHED OFF" y={880} size={120} col={ORO} />
  </Stage>;
};

// 01:25 Dos sobres sobre la mesa: lo que me guardo para el final
const TwoEnvelopes: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const o1 = T(p, "one", 4.4), w = e(t, o1, o1 + 0.4);
  const E: React.FC<{ x: number; r: number; at: number; sealed?: boolean }> = ({ x, r, at, sealed }) => <Drop t={t} at={at} x={x} y={260} w={760} h={480} from={-640} rot={r}><div style={{ ...abs(0, 0, 760, 480), ...papel("#efe3c6", "#c9b58b"), ...center, borderRadius: 10, overflow: "hidden" }}><div style={{ ...abs(0, 0, 760, 0), borderLeft: "380px solid transparent", borderRight: "380px solid transparent", borderTop: "230px solid #dcc9a0" }} />{sealed ? <div style={{ ...abs(315, 170, 130, 124), borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 36% 28%,#d0463a,#7c1712)", boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} /> : <div style={{ ...abs(0, 210, 760, 240), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 112, color: TINTA, opacity: w, transform: `translateY(${(1 - w) * 24}px)` }}>a phone call</div>}</div></Drop>;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}><E x={150} r={-4} at={a + 0.2} /><E x={1010} r={3} at={a + 1.5} sealed /></Stage>;
};

// 02:46 Disco de teléfono: el 911 queda tachado a mano y aparece a quién llamar
const Dial911: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const st = T(p, "st", 4), sh = T(p, "sh", 8), q = t - a, x = e(t, st, st + 0.5), n = e(t, st - 2.0, st - 1.6), pull = e(t, sh, sh + 0.55) * (1 - e(t, sh + 0.9, sh + 1.5)), note = sp(t, a + 6.2);
  const dial = (q < 1.2 ? 20 * Math.sin(q * 2.6) : 0) + pull * 68;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={560}>
    <Drop t={t} at={a + 0.05} x={140} y={150} w={780} h={780} from={-620}>
      <div style={{ ...abs(0, 0, 780, 780), borderRadius: "50%", background: "radial-gradient(circle at 36% 30%,#3a3d46,#101116)", boxShadow: "inset 0 5px 0 rgba(255,255,255,.3)", transform: `rotate(${dial}deg)` }}>
        {Array.from({ length: 10 }, (_, i) => { const ang = (i * 30 - 60) * Math.PI / 180; return <div key={i} style={{ ...abs(330 + Math.cos(ang) * 290, 330 + Math.sin(ang) * 290, 120, 120), ...center, borderRadius: "50%", background: "radial-gradient(circle,#efe8d7,#a59d88)", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: TINTA }}>{(i + 1) % 10}</div>; })}
      </div>
      <div style={{ ...abs(240, 240, 300, 300), ...laton(), borderRadius: "50%" }} />
    </Drop>
    <div style={{ ...abs(960, 200, 860, 330), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 240, color: INK, opacity: n }}>911</div>
    <svg style={abs(960, 200, 860, 330)}><path d="M60 280 L800 40" stroke="#d6453a" strokeWidth={26} strokeLinecap="round" strokeDasharray={800} strokeDashoffset={800 * (1 - x)} /></svg>
    <div style={{ ...abs(1010, 590, 780, 230), ...center, ...papel(), borderRadius: 14, opacity: cl(note * 3), transform: `scale(${note}) rotate(-2deg)`, fontFamily: MANO, fontWeight: 700, fontSize: 100, color: TINTA }}>4 in the morning</div>
  </Stage>;
};

// 03:12 Baliza que gira: se la llevan los que tienen el deber de intentar salvarlo
const Siren: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a, r = q * 280;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960} floor={820}>
    <div style={{ ...abs(-460, 220, 2840, 330), background: "linear-gradient(90deg,transparent,rgba(240,70,50,.42) 46%,rgba(240,70,50,.42) 54%,transparent)", transform: `rotate(${r}deg)`, filter: "blur(24px)", mixBlendMode: "screen" }} />
    <Drop t={t} at={a + 0.05} x={700} y={180} w={520} h={720} from={-620}>
      <div style={{ ...abs(90, 0, 340, 400), borderRadius: "170px 170px 16px 16px", background: `radial-gradient(ellipse at ${50 + Math.cos(r * Math.PI / 180) * 34}% 36%,#ffb4a2,#d7291c 46%,#6d0f09)`, boxShadow: "inset 0 5px 0 rgba(255,255,255,.4)" }} />
      <div style={{ ...abs(40, 392, 440, 70), ...laton(), borderRadius: 16 }} /><div style={{ ...abs(110, 460, 300, 260), background: "linear-gradient(90deg,#2e3036,#55585f,#26272c)" }} />
    </Drop>
    <Say t={t} at={a + 0.5} tx="THE SIRENS COME" y={930} size={112} />
  </Stage>;
};

// 04:01 Timer de cocina: diez minutos que no se llenan con nada
const Timer10: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const k = e(t, a + 0.5, b - 1.4), turn = -36 * 10 * (1 - k) * 0.1;
  return <Stage t={t} a={a} b={b} src={src!} beamX={500}>
    <Drop t={t} at={a + 0.05} x={190} y={200} w={720} h={720} from={-620}>
      <div style={{ ...abs(0, 0, 720, 720), borderRadius: "50%", background: "radial-gradient(circle at 36% 30%,#fffef4,#c9c2ae)", boxShadow: "inset 0 -16px 30px rgba(0,0,0,.3), inset 0 0 0 14px #ddd5bf" }}>
        <div style={{ ...abs(60, 60, 600, 600), transform: `rotate(${turn}deg)` }}>{Array.from({ length: 10 }, (_, i) => <div key={i} style={{ ...abs(275, 6, 50, 76), ...center, transformOrigin: "25px 294px", transform: `rotate(${i * 36}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: TINTA }}>{i}</div>)}</div>
        <div style={{ ...abs(300, -14, 120, 70), clipPath: "polygon(50% 100%,0 0,100% 0)", background: "#b5362a" }} />
      </div>
    </Drop>
    <div style={{ ...abs(960, 250, 880, 500), ...center, flexDirection: "column", fontFamily: FONT, fontWeight: 900, color: INK, opacity: e(t, a + 0.3, a + 0.7), lineHeight: 1.04 }}><div style={{ fontSize: 110 }}>DO</div><div style={{ fontSize: 158, color: ORO, textShadow: glow("rgba(240,194,75,.4)", 22) }}>NOTHING</div></div>
  </Stage>;
};

// 05:16 Escurridor: un vaso más, y otro, y ya estaban limpios
const DishRack: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={880}>
    {Array.from({ length: 10 }, (_, i) => { const at = a + 0.3 + i * 0.42, k = sp(t, at), wob = 2 * Math.sin((t - a) * 1.6 + i); return <div key={i} style={{ ...abs(232 + i * 146, 300, 170, 430), opacity: cl(k * 2), transform: `translateY(${(1 - k) * -640}px) rotate(${(1 - k) * 10 + wob * 0.4}deg)`, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%,#f6f3e9 44%,#d6d0c0 49%,#f8f5ed 56%,#7fa2c6 62%,#f8f5ed 67%,#cfc8b6 100%)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.7), 12px 18px 22px rgba(0,0,0,.42)" }} />; })}
    <Drop t={t} at={a + 0.05} x={180} y={690} w={1560} h={150} from={-360}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ ...abs(i * 130, 0, 18, 110), background: "linear-gradient(90deg,#8d9198,#e7e9ec,#7c8087)", borderRadius: 9 }} />)}<div style={{ ...abs(0, 100, 1560, 22), background: "linear-gradient(180deg,#e7e9ec,#7c8087)", borderRadius: 11 }} /></Drop>
    <Say t={t} at={a + 5.3} tx="DOING THE DISHES?" y={100} size={132} col={ORO} />
  </Stage>;
};

// 06:05 Heladera: la tarjeta queda agarrada por el imán antes de que nadie la necesite
const FridgeCard: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const m = a + 0.9, k = sp(t, m), n2 = sp(t, a + 3.0);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={1000}>
    <Drop t={t} at={a + 0.05} x={420} y={-60} w={1080} h={1080} from={-300} shadow={false}><div style={{ ...abs(0, 0, 1080, 1080), background: "linear-gradient(170deg,#f6f2e6,#c2bda9)", borderRadius: 26, boxShadow: "inset 0 5px 0 rgba(255,255,255,.8)" }} /><div style={{ ...abs(50, 600, 56, 380), ...laton(), borderRadius: 28 }} /></Drop>
    <div style={{ ...abs(620, 200, 700, 420), ...papel("#fff9e8", "#eadcbd"), ...center, flexDirection: "column", opacity: e(t, a + 0.4, a + 0.7), transform: `rotate(${(1 - e(t, m - 0.2, m + 0.2)) * 5 - 2}deg)`, boxShadow: "0 22px 28px rgba(0,0,0,.35)", fontFamily: MANO, fontWeight: 700, fontSize: 112, color: TINTA, lineHeight: 1.08 }}><div>first call:</div><div style={{ color: "#8e2f25" }}>the hospice</div></div>
    <div style={{ ...abs(910, 140, 120, 120), borderRadius: "50%", background: "radial-gradient(circle at 36% 30%,#ff8a7a,#b42a1e)", opacity: cl(k * 2), transform: `scale(${1 + (1 - k) * 0.9})`, boxShadow: "0 12px 16px rgba(0,0,0,.45)" }} />
    <div style={{ ...abs(650, 680, 680, 200), ...center, background: "linear-gradient(170deg,#ffe98e,#e9c34f)", opacity: cl(n2 * 3), transform: `scale(${n2}) rotate(1.5deg)`, boxShadow: "0 16px 22px rgba(0,0,0,.3)", fontFamily: MANO, fontWeight: 700, fontSize: 86, color: TINTA }}>my father has died</div>
  </Stage>;
};

// 06:26 Fila de dominós: caés vos una sola vez y ella tira el resto
const Domino: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const tip = T(p, "tip", 4.4), n = 9;
  return <Stage t={t} a={a} b={b} src={src!} beamX={320} floor={760}>
    {Array.from({ length: n }, (_, i) => { const at = tip + i * 0.2, f = ei(t, at, at + 0.3), lk = sp(t, a + 0.1 + i * 0.05); return <div key={i} style={{ ...abs(90 + i * 155, 420, 112, 370), opacity: cl(lk * 2), transform: `translateY(${(1 - lk) * -500}px) rotate(${f * 66}deg)`, transformOrigin: "100% 100%", ...center, flexDirection: "column", gap: 10, background: "linear-gradient(160deg,#fbf7ea,#cfc7b0)", borderRadius: 16, boxShadow: "0 14px 22px rgba(0,0,0,.5)" }}>{Array.from({ length: 3 }, (_, j) => <div key={j} style={{ width: 40, height: 40, borderRadius: "50%", background: i === 0 ? "#b5362a" : TINTA }} />)}</div>; })}
    <Say t={t} at={a + 0.9} tx="ONE PERSON" y={110} size={150} col={ORO} />
    <Say t={t} at={tip + 1.0} tx="WILL YOU TELL THE OTHERS?" y={870} size={90} />
  </Stage>;
};

// 07:43 El papel dice otra hora: el sello cae con 6:05 y la tuya sigue siendo 4:12
const OfficialTime: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const s1 = T(p, "s1", 4), s2 = T(p, "s2", 7), k = sp(t, s2, 1.5);
  return <Stage t={t} a={a} b={b} src={src!} beamX={1400}>
    <Drop t={t} at={a + 0.1} x={1020} y={190} w={720} h={720} from={-640} rot={1.5}><div style={{ ...abs(0, 0, 720, 720), ...papel("#f7f4ec", "#d8d2c1"), borderRadius: 8 }}>{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ ...abs(70, 60 + i * 34, 580 - (i * 41) % 180, 5), background: "rgba(40,40,60,.3)" }} />)}</div></Drop>
    <Drop t={t} at={s1} x={160} y={230} w={700} h={560} from={-560} rot={-2}><div style={{ ...abs(0, 0, 700, 560), ...papel("#fff7e4", "#e6d6b4"), ...center, flexDirection: "column", borderRadius: 14, fontFamily: MANO, fontWeight: 700, color: "#22307e" }}><div style={{ fontSize: 96 }}>in your heart</div><div style={{ fontSize: 210, lineHeight: 1.1 }}>4:12</div></div></Drop>
    <div style={{ ...abs(1130, 480, 520, 300), ...center, borderRadius: 18, border: "16px solid #a82a20", opacity: cl(k * 3), transform: `scale(${1.8 - 0.8 * Math.min(1, k)}) rotate(-8deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 166, color: "#a82a20" }}>6:05</div>
  </Stage>;
};

// 08:16 Caja con candado: lo que quedó se queda cerrado hasta que llegue ella
const MedBox: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const l = T(p, "lock", 4.4), sh = ei(t, l - 0.4, l + 0.1);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={430} y={380} w={1060} h={520} from={-620}><div style={{ ...abs(0, 0, 1060, 520), background: "linear-gradient(170deg,#5e7d6d,#28392f)", borderRadius: 22, boxShadow: "inset 0 5px 0 rgba(255,255,255,.3)" }} /></Drop>
    <div style={{ ...abs(860, 220 + (1 - sh) * -60, 200, 220), border: "34px solid #b9bfc7", borderBottom: "none", borderRadius: "100px 100px 0 0", opacity: e(t, a + 0.5, a + 0.8) }} />
    <div style={{ ...abs(810, 410, 300, 260), ...laton(), ...center, opacity: e(t, a + 0.4, a + 0.7), borderRadius: 26, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#3a2510" }}><div style={{ width: 60, height: 110, background: "#2b1b08", borderRadius: 30 }} /></div>
    <Say t={t} at={l + 0.2} tx="DON'T TOUCH THEM" y={70} size={124} />
    <Say t={t} at={a + 6.3} tx="LET HER HANDLE IT" y={910} size={104} col={ORO} />
  </Stage>;
};

// 09:12 Perchero en disputa: la percha se ladea de un traje al otro
const Hanger: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a, r = 13 * Math.sin(q * 1.45) * Math.exp(-q * 0.08), sw = T(p, "sw", 7);
  const S: React.FC<{ x: number; c: string; c2: string; tx: string; d: number; on: number }> = ({ x, c, c2, tx, d, on }) => <div style={{ ...abs(x, 200, 440, 650), transform: `translateY(${d}px) rotate(${-r * 0.9}deg)`, transformOrigin: "50% 0" }}><div style={{ ...abs(0, 40, 440, 610), background: `linear-gradient(170deg,${c},${c2})`, borderRadius: "26px 26px 8px 8px", clipPath: "polygon(16% 0,84% 0,100% 16%,86% 100%,14% 100%,0 16%)" }} /><div style={{ ...abs(130, 40, 180, 230), background: "#f4f0e6", clipPath: "polygon(0 0,100% 0,50% 100%)" }} /><div style={{ ...abs(204, 60, 32, 190), background: "#6d1f2e", clipPath: "polygon(20% 0,80% 0,100% 80%,50% 100%,0 80%)" }} /><div style={{ ...abs(0, 330, 440, 150), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 100, color: INK, opacity: e(t, on, on + 0.3) }}>{tx}</div></div>;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <div style={{ ...abs(0, 0, 1920, 1080), transform: `rotate(${r}deg)`, transformOrigin: "960px 100px", opacity: e(t, a - 0.1, a + 0.25) }}>
      <svg style={abs(0, 0, 1920, 330)}><path d="M960 30 q40 0 40 34 q0 26 -40 40 L280 240 L1640 240 L960 104" stroke="#b9bfc7" strokeWidth={16} fill="none" strokeLinejoin="round" /></svg>
      <S x={330} c="#253a63" c2="#0f1a33" tx="NAVY" d={40} on={sw} /><S x={1150} c="#70747c" c2="#373a40" tx="GRAY" d={40} on={sw + 0.7} />
    </div>
    <Say t={t} at={a + 3.9} tx="NOT SPEAKING" y={905} size={104} col={ORO} />
  </Stage>;
};

// 10:08 Funda de traje con etiqueta: la pelea puede esperar
const GarmentTag: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const fa = T(p, "f", 4), f = ei(t, fa, fa + 0.7), sw = 4 * Math.sin((t - a) * 2) * Math.exp(-(t - a) * 0.4);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <Drop t={t} at={a + 0.05} x={420} y={40} w={620} h={920} from={-700}><svg style={abs(180, -44, 260, 110)} viewBox="0 0 260 110"><path d="M130 62 C130 30 160 34 160 16 C160 2 134 0 128 14" stroke="#c9ccd4" strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M10 104 L130 58 L250 104" stroke="#8a6a3c" strokeWidth={16} fill="none" strokeLinecap="round" /></svg><div style={{ ...abs(0, 40, 620, 880), background: "linear-gradient(170deg,#3b3e47,#14151b)", borderRadius: "130px 130px 26px 26px" }}><div style={{ ...abs(180, 0, 260, 380), background: "linear-gradient(180deg,#f4f1e8,#d6d1c2)", clipPath: "polygon(0 0,100% 0,50% 100%)" }} /><div style={{ ...abs(282, 70, 56, 300), background: "linear-gradient(180deg,#7a2733,#4a141d)", clipPath: "polygon(30% 0,70% 0,100% 82%,50% 100%,0 82%)" }} /><div style={{ ...abs(90, 0, 230, 470), background: "linear-gradient(120deg,#4a4e59,#23252d)", clipPath: "polygon(40% 0,100% 80%,62% 100%,0 34%)" }} /><div style={{ ...abs(300, 0, 230, 470), background: "linear-gradient(240deg,#4a4e59,#23252d)", clipPath: "polygon(60% 0,100% 34%,38% 100%,0 80%)" }} />{[520, 640, 760].map((y) => <div key={y} style={{ ...abs(292, y, 36, 36), borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#6a6d78,#191a20)", boxShadow: "0 2px 4px rgba(0,0,0,.6)" }} />)}</div></Drop>
    <div style={{ ...abs(1020, 300, 620, 380), ...center, transform: `rotate(${sw + 3}deg) perspective(1500px) rotateY(${f * 360}deg)`, transformOrigin: "0 40%", ...papel("#fff6dd", "#e7d2a2"), opacity: e(t, a + 0.3, a + 0.6), borderRadius: "16px 60px 60px 16px", boxShadow: "0 28px 40px rgba(0,0,0,.5)", fontFamily: MANO, fontWeight: 700, fontSize: f > 0.5 ? 196 : 110, color: f > 0.5 ? "#8e2f25" : TINTA }}><span style={{ transform: f > 0.25 && f < 0.75 ? "scaleX(-1)" : undefined }}>{f > 0.5 ? "later" : "by 10 o'clock?"}</span></div>
  </Stage>;
};

// 11:25 Plaqueta de bronce que se graba sola, letra por letra
const EngravedCard: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const tx = "EVERY MAN'S GOT A DOOR", n = Math.floor(e(t, a + 0.5, a + 2.0) * tx.length), g = lerp(-420, 1520, e(t, a + 2.5, a + 4.1));
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={260} y={270} w={1400} h={520} from={-620}><div style={{ ...abs(0, 0, 1400, 520), ...laton(), ...center, borderRadius: 28, padding: 60, overflow: "hidden", fontFamily: FONT, fontWeight: 900, fontSize: 138, lineHeight: 1.12, color: "#3a2510", textShadow: "0 2px 0 rgba(255,245,210,.65)" }}>{tx.slice(0, n)}<div style={{ ...abs(g, -60, 240, 640), background: "linear-gradient(90deg,transparent,rgba(255,250,225,.55),transparent)", transform: "skewX(-18deg)" }} /></div></Drop>
  </Stage>;
};

// 11:31 La casa en corte: la luz recorre el camino de cada mañana hasta la puerta de atrás
const HouseCut: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const go = T(p, "go", 0.9), m = ei(t, go, b - 0.9);
  const path: [number, number][] = [[320, 620], [720, 620], [720, 760], [1160, 760], [1420, 760], [1700, 760]], SEG = path.length - 1, f = m * SEG, i = Math.min(Math.floor(f), SEG - 1), u = f - i, x = lerp(path[i][0], path[i + 1][0], u), y = lerp(path[i][1], path[i + 1][1], u);
  return <Stage t={t} a={a} b={b} src={src!} beamX={x} floor={1020}>
    <Drop t={t} at={a + 0.05} x={120} y={180} w={1680} h={760} from={-560}>
      <div style={{ ...abs(0, 110, 1320, 620), background: "linear-gradient(170deg,#e9dcc0,#ad9673)", boxShadow: "inset 0 0 0 22px #6a4d2c" }} />
      <div style={{ ...abs(0, 0, 1320, 130), background: "linear-gradient(170deg,#7d3a2b,#3f1c15)", clipPath: "polygon(5% 100%,50% 0,95% 100%)" }} />
      <div style={{ ...abs(580, 110, 22, 370), background: "#6a4d2c" }} /><div style={{ ...abs(1200, 440, 110, 290), background: `rgba(255,226,160,${0.55 + m * 0.4})`, boxShadow: "inset 0 0 0 10px #6a4d2c" }} />
      <div style={{ ...abs(100, 330, 340, 140), ...papel("#efe7d4", "#b9ad94"), borderRadius: 14 }} />
      {[0, 1, 2].map((j) => <div key={j} style={{ ...abs(1370 + j * 96, 380, 80, 360), background: "linear-gradient(170deg,#4d7e39,#1e3e1b)", borderRadius: "40px 40px 0 0" }}><div style={{ ...abs(20, 60 + j * 30, 40, 40), borderRadius: "50%", background: "radial-gradient(circle at 36% 30%,#ff8a68,#b92a1b)" }} /></div>)}
    </Drop>
    <svg style={abs(0, 0, 1920, 1080)}><path d={"M" + path.map((c) => c.join(" ")).join(" L")} stroke={ORO} strokeWidth={10} strokeDasharray="4 26" strokeLinecap="round" fill="none" opacity={e(t, go - 0.5, go)} /></svg>
    <div style={{ ...abs(x - 44, y - 44, 88, 88), borderRadius: "50%", background: "radial-gradient(circle,#fff6d4,#f0c24b 58%,transparent)", boxShadow: glow("rgba(240,194,75,.6)", 34), opacity: e(t, go - 0.2, go) }} />
  </Stage>;
};

// 12:38 Cinco ganchos: el primero se cuelga con su frase y los demás esperan su turno
const FiveHangers: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  return <Stage t={t} a={a} b={b} src={src!} beamX={420}>
    <div style={{ ...abs(90, 120, 1740, 48), ...madera(), borderRadius: 12, boxShadow: "0 18px 26px rgba(0,0,0,.5)" }} />
    {[1, 2, 3, 4, 5].map((n, i) => { const first = i === 0, k = sp(t, a + 0.1 + i * 0.14), sw = 3 * Math.sin((t - a) * 1.9 + i); return <div key={i} style={{ ...abs(first ? 110 : 760 + (i - 1) * 270, 150, first ? 620 : 240, first ? 740 : 500), opacity: cl(k * 2), transform: `translateY(${(1 - k) * -600}px) rotate(${sw}deg)`, transformOrigin: "50% 0" }}><div style={{ ...abs(0, 50, first ? 620 : 240, first ? 690 : 450), ...center, flexDirection: "column", ...papel(first ? "#fff6dd" : "#b9ad94", first ? "#e7d2a2" : "#847a65"), borderRadius: 16, boxShadow: "0 26px 34px rgba(0,0,0,.45)", fontFamily: FONT, fontWeight: 900, color: TINTA }}><div style={{ ...abs((first ? 620 : 240) / 2 - 10, -46, 20, 66), ...laton(), borderRadius: 10 }} /><div style={{ fontSize: first ? 200 : 170 }}>{n}</div>{first ? <div style={{ fontFamily: MANO, fontSize: 112, lineHeight: 1.05, padding: 20 }}>don't clean out the room</div> : null}</div></div>; })}
  </Stage>;
};

// 13:16 La billetera atada con cinta y lacre: todavía no es tuya para usar
const WalletSeal: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const se = T(p, "se", 3.7), w = e(t, a + 0.4, a + 1.2), k = sp(t, se);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={470} y={260} w={980} h={600} from={-620}><div style={{ ...abs(0, 0, 980, 600), background: "linear-gradient(165deg,#6f4326,#2e180b)", borderRadius: 40, boxShadow: "inset 0 5px 0 rgba(255,220,180,.35)" }}><div style={{ ...abs(26, 26, 928, 548), borderRadius: 26, border: "5px dashed rgba(255,220,180,.38)" }} /><div style={{ ...abs(488, 0, 4, 600), background: "rgba(0,0,0,.4)" }} /></div></Drop>
    <div style={{ ...abs(960 - 490 * w, 515, 980 * w, 70), background: "linear-gradient(180deg,#d0473a,#7c1712)" }} />
    <div style={{ ...abs(830, 430, 260, 240), ...center, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 36% 28%,#d0463a,#7c1712)", opacity: cl(k * 3), transform: `scale(${1.4 - 0.4 * Math.min(1, k)})`, boxShadow: "0 18px 24px rgba(0,0,0,.45)", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#ffd3c8" }}>ASK</div>
    <Say t={t} at={a + 1.2} tx="WHO KNOWS THE LAW?" y={90} size={104} />
  </Stage>;
};

// 14:04 La alfombra: la cama se levanta y queda el rectángulo con sus cuatro hoyos
const Carpet: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const d = T(p, "dents", 3), up = ei(t, a + 0.4, d - 0.5);
  const dots = [[430, 330], [1420, 330], [430, 840], [1420, 840]];
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={1040}>
    <div style={{ ...abs(0, 0, 1920, 1080), background: "repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 2px,transparent 2px 5px),repeating-linear-gradient(0deg,rgba(0,0,0,.05) 0 2px,transparent 2px 5px),radial-gradient(ellipse at 50% 55%,#b09678,#6b5740)", opacity: e(t, a - 0.1, a + 0.2) }} />
    <div style={{ ...abs(400, 300, 1050, 570), background: "#c9b294", boxShadow: "inset 0 0 26px rgba(90,60,30,.35)", opacity: up }} />
    {dots.map((c, i) => { const k = sp(t, d + i * 0.22); return <div key={i} style={{ ...abs(c[0], c[1], 70, 70), borderRadius: "50%", background: "radial-gradient(circle at 56% 60%,#6a543b,#957a5a)", opacity: cl(k * 3), transform: `scale(${k})`, boxShadow: "inset 0 7px 12px rgba(50,30,10,.7)" }} />; })}
    <div style={{ ...abs(380, 270 - up * 1200, 1090, 620), background: "linear-gradient(170deg,#efe7d4,#a79b82)", borderRadius: 26, boxShadow: `0 ${30 + up * 60}px ${40 + up * 80}px rgba(0,0,0,.55)`, transform: `scale(${1 + up * 0.1})` }}><div style={{ ...abs(34, 30, 240, 560), background: "#fffdf6", borderRadius: 20 }} /></div>
    <Say t={t} at={d + 0.5} tx="FOUR DENTS" y={460} size={170} col={ORO} />
  </Stage>;
};

// 14:59 Las patitas de Duke: van solas hasta el lugar y ahí se quedan
const DukePrints: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const n = 11, end = [1460, 460], s0 = a + 2.3, lit = e(t, s0, s0 + 0.5), bowl = sp(t, a + 2.6);
  return <Stage t={t} a={a} b={b} src={src!} beamX={end[0]} floor={980}>
    <div style={{ ...abs(0, 0, 1920, 1080), background: "repeating-linear-gradient(0deg,rgba(0,0,0,.14) 0 3px,transparent 3px 92px),linear-gradient(170deg,#7c5e3c,#3e2a18)", opacity: e(t, a - 0.1, a + 0.2) }} />
    {Array.from({ length: n }, (_, i) => { const u = i / (n - 1), x = lerp(140, end[0] - 80, u), y = 880 - Math.sin(u * 2.6) * 180 - u * 300 + (i % 2 ? 40 : -40), at = a + 0.3 + i * 0.2, k = sp(t, at), ang = -18 - u * 16; return <div key={i} style={{ ...abs(x, y, 140, 140), opacity: cl(k * 3), transform: `scale(${k}) rotate(${ang}deg)` }}><div style={{ ...abs(34, 56, 74, 66), borderRadius: "50%", background: "#14100a" }} />{[[8, 34], [38, 4], [76, 4], [108, 34]].map((c, j) => <div key={j} style={{ ...abs(c[0], c[1], 32, 44), borderRadius: "50%", background: "#14100a" }} />)}</div>; })}
    <div style={{ ...abs(end[0] - 180, end[1] - 180, 400, 400), borderRadius: "50%", background: `radial-gradient(circle,rgba(255,216,130,${lit * 0.85}),transparent 68%)` }} />
    <div style={{ ...abs(1090, 760, 300, 120), borderRadius: "16px 16px 70px 70px", background: "linear-gradient(95deg,#7a8591,#d3dae0 44%,#566069)", opacity: cl(bowl * 3), transform: `scale(${bowl})`, boxShadow: "0 16px 22px rgba(0,0,0,.5)" }}><div style={{ ...abs(16, 0, 268, 34), borderRadius: "50%", background: "radial-gradient(circle,#8a5a2e,#5a3618)" }} /></div>
    <Say t={t} at={a + 0.5} tx="HE WOULDN'T EAT" y={100} size={124} col={ORO} />
  </Stage>;
};

// 16:56 Bandeja giratoria: la comida da la vuelta y nadie se anima a empezar
const LazySusan: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const r = (t - a) * 34;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={1000}>
    <Drop t={t} at={a + 0.05} x={410} y={300} w={1100} h={720} from={-560} shadow={false}><div style={{ ...abs(0, 0, 1100, 720), transform: "perspective(1800px) rotateX(46deg)" }}><div style={{ ...abs(190, 0, 720, 720), borderRadius: "50%", ...madera("#a57744", "#5e3d1f"), transform: `rotate(${r}deg)` }}>{[0, 1, 2, 3].map((i) => { const ang = i * 90 * Math.PI / 180; return <div key={i} style={{ ...abs(290 + Math.cos(ang) * 230, 290 + Math.sin(ang) * 230, 140, 140), borderRadius: "50%", background: "radial-gradient(circle,#c9c3b4 30%,#f4f1e6 34%,#b9b2a2)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }}><div style={{ ...abs(35, 35, 70, 70), borderRadius: 14, background: i % 2 ? "#6f8c3f" : "#d4a44a" }} /></div>; })}</div></div></Drop>
    <Say t={t} at={a + 1.2} tx="THEY LOOK SO GUILTY" y={100} size={128} col={ORO} />
  </Stage>;
};

// 17:36 Carretera de Lubbock: 6 horas de ruta y faltaron 40 minutos
const Odometer: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const m = T(p, "m", 2.8), k = ei(t, a + 0.3, m), L = 1500, st = 150, x = st + (L - 180) * k * 0.84;
  return <Stage t={t} a={a} b={b} src={src!} beamX={x} floor={780}>
    <div style={{ ...abs(st, 640, L, 150), background: "linear-gradient(180deg,#3d3f43,#1b1c1f)", opacity: sp(t, a), borderRadius: 14 }}><div style={{ ...abs(0, 68, L, 12), background: "repeating-linear-gradient(90deg,#f0d776 0 60px,transparent 60px 110px)" }} /></div>
    <div style={{ ...abs(x, 560, 180, 116), borderRadius: "28px 60px 12px 12px", background: "linear-gradient(170deg,#c3462f,#6e1c10)", boxShadow: "0 14px 20px rgba(0,0,0,.5)" }}><div style={{ ...abs(90, 12, 66, 46), background: "#c8dbe6", borderRadius: 8 }} /></div>
    <div style={{ ...abs(st + L - 60, 220, 28, 440), background: "#bfc4cc" }} /><div style={{ ...abs(st + L - 240, 190, 380, 170), ...center, ...papel("#2d6a4e", "#154030"), borderRadius: 16, fontFamily: FONT, fontWeight: 900, fontSize: 76, color: "#fff" }}>HOME</div>
    <Say t={t} at={m + 0.4} tx="40 MINUTES" y={230} size={186} x={760} w={1200} col={ORO} />
  </Stage>;
};

// 18:40 La viga: un solo poste sosteniendo el techo, y sus grietas no las ve nadie
const RoofHold: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a, cr = e(t, a + 1.2, a + 3.6), sw = e(t, a + 4.4, a + 4.8);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={940}>
    <Drop t={t} at={a + 0.05} x={120} y={150} w={1680} h={160} from={-420} shadow={false}><div style={{ ...abs(0, 0, 1680, 160), ...madera("#7c5532", "#3d2613"), borderRadius: 12, transform: `rotate(${Math.sin(q * 11) * 0.12}deg)` }} /></Drop>
    <Drop t={t} at={a + 0.3} x={860} y={310} w={200} h={640} from={-620}><div style={{ ...abs(0, 0, 200, 640), ...madera("#a07649", "#5a3a1c") }} /></Drop>
    <svg style={abs(860, 310, 200, 640)}><path d="M100 90 L70 180 L120 260 L80 360 L128 470 L96 560" stroke="#190f07" strokeWidth={8} fill="none" strokeDasharray={640} strokeDashoffset={640 * (1 - cr)} /></svg>
    <div style={{ ...abs(90, 450, 700, 300), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 130, lineHeight: 1.05, color: INK, opacity: e(t, a + 0.4, a + 0.8) * (1 - sw), textShadow: "0 8px 26px #000" }}>she's taking it well</div>
    <div style={{ ...abs(90, 450, 700, 300), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 130, lineHeight: 1.05, color: "#ff9d8c", opacity: sw, textShadow: "0 8px 26px #000" }}>in seven months</div>
    <div style={{ ...abs(1130, 450, 700, 300), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: 1.05, color: ORO, opacity: e(t, a + 0.9, a + 1.3), textShadow: "0 8px 26px #000" }}>HOLDING UP THE ROOF</div>
  </Stage>;
};

// 19:04 La cuadra de noche: las casas se van apagando y la tuya queda sola
const BlockLights: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960} floor={830}>
    {Array.from({ length: 7 }, (_, i) => { const mine = i === 3, off = a + 1.0 + (mine ? 99 : (i < 3 ? i : i - 1) * 0.55), on = 1 - e(t, off, off + 0.2), k = sp(t, a + 0.1 + i * 0.1), dx = 90 + i * 250; return <div key={i} style={{ ...abs(dx, 340, 240, 480), opacity: cl(k * 2), transform: `translateY(${(1 - k) * -420}px)` }}><div style={{ ...abs(0, 0, 240, 0), borderLeft: "120px solid transparent", borderRight: "120px solid transparent", borderBottom: "120px solid #2a2230" }} /><div style={{ ...abs(0, 120, 240, 360), background: "linear-gradient(170deg,#3b3540,#1c1820)" }}><div style={{ ...abs(70, 80, 100, 130), background: `linear-gradient(170deg,rgba(255,224,140,${on}),rgba(226,150,50,${on})),#10121c`, boxShadow: glow(`rgba(255,200,110,${on * 0.5})`, 24) }} /><div style={{ ...abs(90, 250, 60, 110), background: mine ? "#5a3724" : "#17141a" }} /></div></div>; })}
    <Say t={t} at={a + 3.7} tx="AROUND NINE" y={120} size={132} />
  </Stage>;
};

// 20:24 Abanico de actas con sello en relieve: se abren hasta diez
const Certificates: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={960}>
    {Array.from({ length: 10 }, (_, i) => { const at = a + 0.3 + i * 0.42, k = sp(t, at), r = (i - 4.5) * 8 * Math.min(1, k); return <div key={i} style={{ ...abs(690, 260, 540, 700), opacity: cl(k * 3), transformOrigin: "50% 112%", transform: `rotate(${r}deg)`, ...papel("#faf6ea", "#d8cfb7"), borderRadius: 10, boxShadow: "0 16px 24px rgba(0,0,0,.42)" }}><div style={{ ...abs(180, 480, 180, 180), borderRadius: "50%", background: "radial-gradient(circle at 36% 30%,#f7f1dd,#c8bea1)", boxShadow: "inset 0 0 0 10px rgba(170,150,110,.5)" }} /></div>; })}
    <Say t={t} at={a + 1.5} tx="MORE THAN YOU THINK" y={70} size={112} col={ORO} />
  </Stage>;
};

// 21:38 El reloj de la cocina da toda la vuelta y va prendiendo cada hora del día
const ClockRecap: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const h = lerp(1, 2, ei(t, a + 0.3, a + 7.5)), hr = [1, 2, 4, 6, 8, 12], R = 300;
  const PH: [number, string][] = [[0.3, "four calls"], [2.4, "hospice"], [3.4, "one person"], [4.3, "your priest"], [5.6, "funeral home"], [7.6, "the nurse comes"], [8.9, "ask to wash him"]];
  const q = t - a; const i = PH.reduce((v, c, j) => (q >= c[0] ? j : v), 0), k = sp(t, a + PH[i][0]);
  return <Stage t={t} a={a} b={b} src={src!} beamX={500}>
    <Drop t={t} at={a + 0.05} x={110} y={140} w={800} h={800} from={-620}>
      <div style={{ ...abs(0, 0, 800, 800), borderRadius: "50%", background: "radial-gradient(circle at 36% 30%,#fff7e1,#c8bb9e)", boxShadow: "inset 0 0 0 26px #7a5a33" }} />
      {hr.map((v, j) => { const ang = (v / 12) * 2 * Math.PI - Math.PI / 2, x = 400 + Math.cos(ang) * R, y = 400 + Math.sin(ang) * R, on = h >= v - 0.02; return <div key={j} style={{ ...abs(x - 56, y - 56, 112, 112), ...center, borderRadius: "50%", background: on ? "radial-gradient(circle at 36% 30%,#ffe9a6,#e0a227)" : "#b4a88d", boxShadow: glow(`rgba(240,194,75,${on ? 0.45 : 0})`, 20), fontFamily: FONT, fontWeight: 900, fontSize: 52, color: TINTA }}>{v}</div>; })}
      <div style={{ ...abs(391, 170, 18, 240), background: "#1c1a26", transformOrigin: "9px 230px", transform: `rotate(${h * 30}deg)`, borderRadius: 9 }} />
      <div style={{ ...abs(395, 90, 10, 320), background: "#8e2f25", transformOrigin: "5px 310px", transform: `rotate(${q * 75}deg)`, borderRadius: 5 }} /><div style={{ ...abs(360, 360, 80, 80), ...laton(), borderRadius: "50%" }} />
    </Drop>
    <div style={{ ...abs(960, 230, 860, 150), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 96, color: INK, opacity: e(t, a + 0.1, a + 0.4) }}>{q < 7.5 ? "HOUR 1" : "HOUR 2"}</div>
    <div key={i} style={{ ...abs(960, 400, 860, 330), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 150, lineHeight: 1.04, color: ORO, opacity: cl(k * 3), transform: `translateY(${(1 - k) * 40}px)`, textShadow: "0 8px 26px #000" }}>{PH[i][1]}</div>
  </Stage>;
};

// 22:32 Hojas de almanaque que se arrancan: trece meses que ya están pagos
const Calendar13: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const pd = T(p, "paid", 6.2), n = Math.floor(e(t, a + 0.7, pd - 0.4) * 13);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    {n < 13 ? <div style={{ ...abs(620, 130, 680, 780), ...papel(), ...center, flexDirection: "column", boxShadow: "0 30px 44px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900, color: TINTA, borderRadius: 10 }}><div style={{ fontSize: 96 }}>MONTH</div><div style={{ fontSize: 330, lineHeight: 1 }}>{n + 1}</div></div> : <div style={{ ...abs(620, 130, 680, 780), ...center, flexDirection: "column", ...papel("#ffe9a6", "#dca534"), borderRadius: 10, boxShadow: `0 30px 44px rgba(0,0,0,.5), ${glow("rgba(240,194,75,.5)", 34)}`, fontFamily: FONT, fontWeight: 900, color: "#2b1b08" }}><div style={{ fontSize: 210, lineHeight: 1 }}>13</div><div style={{ fontSize: 96 }}>MONTHS</div></div>}
    {Array.from({ length: Math.min(n, 13) }, (_, i) => { const at = a + 0.7 + (i / 13) * (pd - 0.4 - a - 0.7), f = cl((t - at) / 0.8); return f < 1 ? <div key={i} style={{ ...abs(620 + f * (i % 2 ? 620 : -620), 130 + f * f * 900, 680, 780), ...papel(), opacity: 1 - f, transform: `rotate(${f * (i % 2 ? 24 : -24)}deg)`, boxShadow: "0 26px 34px rgba(0,0,0,.4)" }} /> : null; })}
    <Say t={t} at={pd} tx="ALREADY PAID FOR" y={900} size={118} col={ORO} />
  </Stage>;
};

// 23:49 Los números de la tarjeta se borran: 34 años y no se acordaba de uno
const FadingNumber: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const ds = "210-555-0147".split("");
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={240} y={240} w={1440} h={520} from={-620}><div style={{ ...abs(0, 0, 1440, 520), ...papel("#fff8e6", "#e0ceaa"), borderRadius: 14 }} /></Drop>
    <div style={{ ...abs(240, 370, 1440, 260), ...center, gap: 2 }}>{ds.map((d, i) => { const g = e(t, a + 1.6 + rnd(i, 6) * 2.4, a + 2.4 + rnd(i, 6) * 2.4); return <span key={i} style={{ fontFamily: MANO, fontWeight: 700, fontSize: 212, color: "#22307e", opacity: 1 - g, filter: `blur(${g * 14}px)`, transform: `translateY(${g * 30}px)` }}>{d}</span>; })}</div>
    <Say t={t} at={a + 0.5} tx="ON MY OWN REFRIGERATOR" y={830} size={96} col={ORO} />
  </Stage>;
};

// 24:40 La bandeja con la taza va hacia la cama y se frena de golpe
const TrayWalk: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const st = T(p, "stop", 6.4), k = e(t, a + 0.4, st), x = lerp(-620, 610, k), tilt = t > st ? 4 * Math.exp(-(t - st) * 2) * Math.sin((t - st) * 10) : Math.sin((t - a) * 5) * 1.2;
  return <Stage t={t} a={a} b={b} src={src!} beamX={1100}>
    <div style={{ ...abs(x, 330, 720, 400), transform: `scale(1.4) rotate(${tilt}deg)` }}>
      <div style={{ ...abs(0, 330, 720, 54), ...madera("#a57744", "#5e3d1f"), borderRadius: 12, boxShadow: "0 26px 34px rgba(0,0,0,.45)" }} />
      <div style={{ ...abs(250, 100, 220, 232), background: "linear-gradient(95deg,#5f8cc2,#c2dbf2 44%,#3f6898)", borderRadius: "0 0 66px 66px" }} /><div style={{ ...abs(440, 150, 90, 120), border: "18px solid #6f98c9", borderRadius: "0 60px 60px 0" }} />
      {[0, 1].map((i) => <div key={i} style={{ ...abs(300 + i * 70, -70, 46, 160), background: "linear-gradient(0deg,rgba(255,255,255,.6),transparent)", filter: "blur(10px)", transform: `translateX(${Math.sin((t - a) * 2 + i * 2) * 16}px)` }} />)}
    </div>
    <Say t={t} at={st + 0.1} tx="AND THEN I REMEMBERED" y={70} size={112} />
  </Stage>;
};

// 25:08 Tres tazas: dos humean y la azul con la mella se va enfriando sola en el medio
const ThreeCups: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const bl = T(p, "blue", 0.9), fi = a + 3.2, co = e(t, a + 6.4, b - 0.8);
  const C: React.FC<{ x: number; c: string; c2: string; at: number; blue?: boolean; st: number }> = ({ x, c, c2, at, blue, st }) => <><Drop t={t} at={at} x={x} y={440} w={360} h={440} from={-640}><div style={{ ...abs(0, 60, 310, 300), background: `linear-gradient(95deg,${c2},${c} 44%,${c2})`, borderRadius: "0 0 90px 90px" }}><div style={{ ...abs(0, 0, 310, 30), borderRadius: "50%", background: "#2d1d10" }} />{blue ? <div style={{ ...abs(46, -6, 44, 34), background: "#0c0806", clipPath: "polygon(0 0,100% 0,60% 100%)" }} /> : null}</div><div style={{ ...abs(280, 120, 110, 160), border: `26px solid ${c}`, borderRadius: "0 80px 80px 0" }} /></Drop>{Array.from({ length: 3 }, (_, i) => <div key={i} style={{ ...abs(x + 80 + i * 56, 170 + Math.sin((t - a) * 1.4 + i) * 12, 44, 280), opacity: st, background: "linear-gradient(0deg,rgba(255,255,255,.68),transparent)", filter: "blur(14px)", transform: `translateX(${Math.sin((t - a) * 1.8 + i * 2) * 20}px)` }} />)}</>;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={830}>
    <C x={230} c="#efe7d4" c2="#a79b82" at={a + 0.05} st={e(t, a + 0.2, a + 0.6)} /><C x={1330} c="#efe7d4" c2="#a79b82" at={a + 0.25} st={e(t, a + 0.4, a + 0.8)} /><C x={780} c="#7fb0e0" c2="#2f5a8c" at={bl} blue st={e(t, fi, fi + 0.6) * (1 - co)} />
    <Say t={t} at={bl + 0.3} tx="HER CUP" y={90} size={156} col={ORO} />
  </Stage>;
};

// 26:31 Servilleta con la huella del café: la pregunta escrita con lo que había a mano
const Napkin: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = T(p, "q", 2.6), tx = "Who are you taking care of?", n = Math.floor(e(t, q, q + 1.4) * tx.length);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <Drop t={t} at={a + 0.05} x={420} y={130} w={1080} h={820} from={-620} rot={-3}><div style={{ ...abs(0, 0, 1080, 820), background: "linear-gradient(135deg,#fffaf0,#efe6d3 50%,#fffaf0)", borderRadius: 8, boxShadow: "inset 0 0 0 1px rgba(120,90,50,.22)" }}><div style={{ ...abs(0, 406, 1080, 4), background: "rgba(120,90,50,.16)" }} /><div style={{ ...abs(538, 0, 4, 820), background: "rgba(120,90,50,.16)" }} /><div style={{ ...abs(730, 60, 280, 280), borderRadius: "50%", border: "12px solid rgba(120,74,30,.32)" }} /><div style={{ ...abs(60, 220, 960, 420), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 150, lineHeight: 1.06, color: "#22307e" }}>{tx.slice(0, n)}</div></div></Drop>
  </Stage>;
};

export const MAP: Record<string, React.FC<P>> = { HumWave, TwoEnvelopes, Dial911, Siren, Timer10, DishRack, FridgeCard, Domino, OfficialTime, MedBox, Hanger, GarmentTag, EngravedCard, HouseCut, FiveHangers, WalletSeal, Carpet, DukePrints, LazySusan, Odometer, RoofHold, BlockLights, Certificates, ClockRecap, Calendar13, FadingNumber, TrayWalk, ThreeCups, Napkin };
export const Comp: React.FC<{ o: any; t: number }> = ({ o, t }) => { const C = MAP[o.n]; return C ? <C {...o} t={t - 0.18} /> : null; }; // eslint-disable-line @typescript-eslint/no-explicit-any
export { PAPER2, piedra };
