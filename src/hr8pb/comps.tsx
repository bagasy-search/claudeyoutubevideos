// comps.tsx · hr8pb: un mecanismo distinto por minuto. Cada pieza es un OBJETO que es la idea, sobre el Stage (foto del momento desenfocada).
import React from "react";
import { BRASS, INK, LILA, MANO, ORO, P, PAPER, PAPER2, ROJO, SERIF, FONT, Say, Stage, Drop, TINTA, T, abs, center, glow, piedra, cl, e, ei, laton, lerp, madera, papel, rnd, sp } from "./stage";
import { MAP2 } from "./comps2";

// 00:19 Cartel de parada que se balancea sobre un banco vacío con una cartera: la espera de ella
const BusSign: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a;
  const sw = 8 * Math.exp(-q * 0.42) * Math.sin(q * 2.7) + 1.1 * Math.sin(q * 1.15);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.1} x={920} y={110} w={80} h={880} from={-900} shadow={false}>
      <div style={{ ...abs(26, 0, 28, 880), background: "linear-gradient(90deg,#4a4e57,#aab0ba 45%,#3a3d45)", borderRadius: 8 }} />
    </Drop>
    <Drop t={t} at={a + 0.25} x={330} y={760} w={560} h={190} from={-160}>
      <div style={{ ...abs(0, 40, 560, 34), ...madera(), borderRadius: 8 }} /><div style={{ ...abs(0, 88, 560, 34), ...madera(), borderRadius: 8 }} />
      <div style={{ ...abs(50, 120, 26, 70), background: "#2c2e34" }} /><div style={{ ...abs(484, 120, 26, 70), background: "#2c2e34" }} />
    </Drop>
    <Drop t={t} at={a + 1.3} x={560} y={700} w={170} h={110} from={-320}>
      <div style={{ ...abs(0, 26, 170, 84), background: "linear-gradient(160deg,#7b2d3a,#431620)", borderRadius: "14px 14px 20px 20px", boxShadow: "inset 0 3px 0 rgba(255,200,200,.3)" }} />
      <div style={{ ...abs(40, 0, 90, 60), border: "9px solid #c9a24b", borderBottom: "none", borderRadius: "50px 50px 0 0" }} />
    </Drop>
    <div style={{ ...abs(600, 90, 720, 400), transform: `translateY(${(1 - sp(t, a + 0.45)) * -640}px) rotate(${sw}deg) scale(1.34)`, transformOrigin: "50% 0" }}>
      <div style={{ ...abs(150, 0, 8, 80), background: "#777" }} /><div style={{ ...abs(562, 0, 8, 80), background: "#777" }} />
      <div style={{ ...abs(0, 78, 720, 300), ...center, flexDirection: "column", overflow: "hidden", borderRadius: 26, background: "linear-gradient(170deg,#1f4f8e,#143462)", boxShadow: "inset 0 0 0 10px #eef2f6, inset 0 5px 0 12px rgba(255,255,255,.3), 0 34px 60px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, color: "#fff", fontSize: 96, lineHeight: 1.04 }}>IS THE BUS</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, color: ORO, fontSize: 118, lineHeight: 1.04, textShadow: glow("rgba(240,194,75,.5)", 18) }}>HERE?</div>
        <div style={{ ...abs(-40, 0, 200, 300), background: `linear-gradient(100deg,transparent,rgba(255,255,255,.26),transparent)`, transform: `translateX(${(q % 3.2) * 340}px)` }} />
      </div>
    </div>
  </Stage>;
};

// 00:54 La libreta se hojea sola y el odómetro de páginas clava en 400
const Riffle400: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a, stop = a + 2.6, k = ei(t, a + 0.3, stop), n = Math.round(k * 400);
  const flip = t < stop ? ((q * 7) % 1) : 1;
  const digits = String(n).padStart(3, "0").split("");
  return <Stage t={t} a={a} b={b} src={src!} beamX={700}>
    <Drop t={t} at={a + 0.08} x={440} y={210} w={1040} h={560} from={-520}>
      <div style={{ ...abs(0, 22, 1040, 540), background: "linear-gradient(170deg,#2b2320,#141010)", borderRadius: 22, boxShadow: "inset 0 2px 0 rgba(255,255,255,.2)" }} />
      <div style={{ ...abs(26, 6, 494, 530), ...papel(), borderRadius: "14px 4px 4px 14px" }}>{Array.from({ length: 13 }, (_, i) => <div key={i} style={{ ...abs(46, 54 + i * 34, 390 - (i * 37) % 120, 3), background: "rgba(44,60,120,.34)" }} />)}</div>
      <div style={{ ...abs(520, 6, 494, 530), ...papel(), borderRadius: "4px 14px 14px 4px" }}>{Array.from({ length: 13 }, (_, i) => <div key={i} style={{ ...abs(46, 54 + i * 34, 380 - (i * 53) % 140, 3), background: "rgba(44,60,120,.34)" }} />)}</div>
      {t < stop ? <div style={{ ...abs(520, 6, 494, 530), ...papel("#fff8e8", PAPER2), transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-flip * 178}deg)`, borderRadius: 6 }} /> : null}
      <div style={{ ...abs(516, 0, 8, 540), background: "linear-gradient(90deg,rgba(0,0,0,.45),rgba(0,0,0,.05))" }} />
    </Drop>
    <div style={{ ...abs(620, 330, 680, 300), ...center, gap: 16 }}>
      {digits.map((d, i) => <div key={i} style={{ width: 190, height: 280, ...center, borderRadius: 18, background: "linear-gradient(180deg,#1b1b22,#3a3a44 48%,#111118 52%,#26262e)", boxShadow: "inset 0 0 0 4px #b89a55, 0 18px 34px rgba(0,0,0,.6)", fontFamily: FONT, fontWeight: 900, fontSize: 210, color: t >= stop ? ORO : INK, transform: `scale(${t >= stop ? 1 + 0.08 * Math.exp(-(t - stop) * 4) * Math.cos((t - stop) * 18) : 1})`, opacity: e(t, a + 0.3, a + 0.55), textShadow: t >= stop ? glow("rgba(240,194,75,.55)", 22) : undefined }}>{d}</div>)}
    </div>
    <Say t={t} at={stop + 0.05} tx="BEDSIDES" y={800} size={118} col={INK} />
  </Stage>;
};

// 01:14 Rosario de 9 cuentas: cada cuenta es un punto de la lista y se enciende de a una
const Rosary9: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const n = 9;
  const pts = Array.from({ length: n }, (_, i) => { const u = i / (n - 1), ang = Math.PI * (1.08 - 1.16 * u); return { x: 960 + Math.cos(ang) * 700, y: 200 + Math.sin(ang) * 520 }; });
  const arc = Array.from({ length: 61 }, (_, i) => { const u = i / 60, ang = Math.PI * (1.08 - 1.16 * u); return `${960 + Math.cos(ang) * 700} ${200 + Math.sin(ang) * 520}`; });
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960} floor={820}>
    <svg style={abs(0, 0, 1920, 1080)}><path d={"M" + arc.join(" L")} stroke="#c9a24b" strokeWidth={6} fill="none" opacity={e(t, a + 0.2, a + 0.5)} /><path d="M960 720 L960 800" stroke="#c9a24b" strokeWidth={6} opacity={e(t, a + 0.2, a + 0.5)} /></svg>
    {pts.map((c, i) => { const at = a + 0.5 + i * 0.55, k = sp(t, at), on = e(t, at, at + 0.2), z = 128; return <div key={i} style={{ ...abs(c.x - z / 2, c.y - z / 2, z, z), ...center, borderRadius: "50%", opacity: cl(k * 2), transform: `scale(${k})`, background: on ? "radial-gradient(circle at 34% 28%,#fff6d2,#f0c24b 42%,#8b5a10)" : "radial-gradient(circle at 34% 28%,#8d6a4e,#3a2415)", boxShadow: `0 10px 18px rgba(0,0,0,.6), ${glow(`rgba(240,194,75,${on * 0.45})`, 26)}`, fontFamily: FONT, fontWeight: 900, fontSize: 62, color: "#3a2415" }}>{i + 1}</div>; })}
    <Drop t={t} at={a + 0.3} x={885} y={790} w={150} h={210} from={-300}>
      <div style={{ ...abs(58, 0, 34, 210), ...laton() }} /><div style={{ ...abs(0, 56, 150, 34), ...laton() }} />
    </Drop>
    <Say t={t} at={a + 5.6} tx="WHAT YOUR MOTHER MEANS" y={270} size={92} w={1000} />
  </Stage>;
};

// 02:18 Tres credenciales colgadas: DOCTOR y NURSE se caen del gancho; queda la de capellana
const Badges: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const n1 = a + 2.1, n2 = a + 3.1, ok = a + 4.2;
  const B: React.FC<{ x: number; tx: string; fall?: number; on?: number; d: number }> = ({ x, tx, fall, on, d }) => {
    const f = fall ? cl((t - fall) / 0.6) : 0, sw = 3 * Math.exp(-(t - a - d) * 0.8) * Math.sin((t - a - d) * 4), g = on ? e(t, on, on + 0.3) : 0;
    const mv = on ? ei(t, on - 0.3, on + 0.5) : 0;
    return <div style={{ ...abs(x - mv * 520, 150, 380, 620), transform: `translateY(${(1 - sp(t, a + d)) * -700 + f * f * 1100}px) rotate(${sw + f * (x < 900 ? -38 : 34)}deg) scale(${1 + mv * 0.28})`, transformOrigin: "50% 0" }}>
      <div style={{ ...abs(180, -220, 20, 330), background: "linear-gradient(90deg,#4b3f88,#9a8ad4)" }} />
      <div style={{ ...abs(0, 100, 380, 500), ...papel("#fffaf0"), borderRadius: 26, boxShadow: `0 28px 44px rgba(0,0,0,.55), ${glow(`rgba(180,154,216,${g * 0.55})`, 30)}` }}>
        <div style={{ ...abs(150, 20, 80, 22), background: "#2d2d2d", borderRadius: 11 }} />
        <div style={{ ...abs(90, 72, 200, 230), background: "linear-gradient(170deg,#c8bda9,#8d8069)", borderRadius: 16 }}><div style={{ ...abs(62, 40, 76, 76), borderRadius: "50%", background: "#6a5e4a" }} /><div style={{ ...abs(30, 128, 140, 110), borderRadius: "70px 70px 0 0", background: "#6a5e4a" }} /></div>
        <div style={{ ...abs(0, 330, 380, 110), ...center, fontFamily: FONT, fontWeight: 900, fontSize: tx.length > 6 ? 58 : 76, color: on ? "#4b3f88" : "#2b2a3a" }}>{tx}</div>
      </div>
    </div>;
  };
  return <Stage t={t} a={a} b={b} src={src!} beamX={1400}>
    <div style={{ ...abs(180, 96, 1560, 40), ...madera(), borderRadius: 10, boxShadow: "0 18px 26px rgba(0,0,0,.5)" }} />
    <B x={250} tx="DOCTOR" fall={n1} d={0.1} /><B x={770} tx="NURSE" fall={n2} d={0.25} /><B x={1290} tx="CHAPLAIN" on={ok} d={0.4} />
  </Stage>;
};

// 03:10 La casa de 61 años: se encienden las 5 ventanas de los hijos y una se apaga cuando muere el marido
const House61: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const ks = T(p, "kids", 3), hs = T(p, "hus", 5.4);
  const wins = [[150, 250], [410, 250], [670, 250], [150, 470], [670, 470]];
  return <Stage t={t} a={a} b={b} src={src!} night beamX={520}>
    <Drop t={t} at={a + 0.1} x={520} y={60} w={880} h={840} from={-720}>
      <div style={{ transform: "scale(.82)", transformOrigin: "50% 0", ...abs(-100, 0, 1080, 840) }}>
      <div style={{ ...abs(50, 0, 980, 0), borderLeft: "490px solid transparent", borderRight: "490px solid transparent", borderBottom: "250px solid #5a2f22" }} />
      <div style={{ ...abs(100, 240, 880, 600), background: "linear-gradient(170deg,#e4d2ae,#a8916a)", boxShadow: "inset 0 -30px 40px rgba(50,30,10,.4)" }}>
        {wins.map((w, i) => { const on = e(t, ks + i * 0.26, ks + i * 0.26 + 0.25) * (i === 2 ? 1 - e(t, hs, hs + 0.6) : 1), x = w[0] - 100, y = w[1] - 240 + 20; return <div key={i} style={{ ...abs(x, y, 150, 170), background: `linear-gradient(170deg,rgba(255,226,140,${on}),rgba(240,170,60,${on})),#26304a`, boxShadow: `inset 0 0 0 8px #f5ecdd, ${glow(`rgba(255,200,110,${on * 0.5})`, 34)}` }}><div style={{ ...abs(71, 0, 8, 170), background: "#f5ecdd" }} /><div style={{ ...abs(0, 81, 150, 8), background: "#f5ecdd" }} /></div>; })}
        <div style={{ ...abs(325, 370, 170, 230), ...madera("#6c3320", "#3c1a10"), borderRadius: "90px 90px 0 0" }} />
      </div>
      </div>
    </Drop>
    <div style={{ ...abs(620, 830, 680, 170), ...center, ...laton(), borderRadius: 16, opacity: e(t, a + 1.1, a + 1.4), transform: `scale(${sp(t, a + 1.1)})` }}><span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 104, color: "#3a2510" }}>61 YEARS</span></div>
  </Stage>;
};

// 04:55 El felpudo trae tejida la respuesta; la puerta de atrás se abre y sale la luz de casa
const Doormat: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const op = e(t, a + 1.2, a + 2.6);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960} floor={700}>
    <div style={{ ...abs(640, 40, 640, 650), background: `radial-gradient(ellipse at 50% 70%,rgba(255,226,160,${op}),rgba(255,180,90,${op * 0.7}))`, boxShadow: `0 0 120px rgba(255,200,120,${op * 0.6})` }} />
    <div style={{ ...abs(640, 40, 640, 650), ...madera("#70422a", "#3e2214"), transformOrigin: "0 50%", transform: `perspective(1800px) rotateY(${-op * 74}deg)`, opacity: sp(t, a), boxShadow: "inset 0 0 0 16px rgba(30,16,8,.35)" }}><div style={{ ...abs(560, 320, 42, 42), borderRadius: "50%", ...laton() }} /></div>
    <Drop t={t} at={a + 0.3} x={360} y={720} w={1200} h={290} from={-500}>
      <div style={{ ...abs(0, 0, 1200, 290), ...center, flexDirection: "column", borderRadius: 18, background: "repeating-linear-gradient(90deg,#e6c58c 0 6px,#d3aa6c 6px 10px)", boxShadow: "inset 0 0 0 16px #5a3d1f, 0 14px 30px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 104, color: "#1d1208", textShadow: "0 2px 0 rgba(255,235,190,.5)", lineHeight: 1.05 }}>TELL ME</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 104, color: "#1d1208", textShadow: "0 2px 0 rgba(255,235,190,.5)", lineHeight: 1.05 }}>ABOUT HOME</div>
      </div>
    </Drop>
  </Stage>;
};

// 05:12 Reloj fichador con la tarjeta de Reyes: cada fila perforada es un año, clavan 31
const PunchClock: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const st = a + 1.3, k = e(t, st, st + 3.2), n = Math.floor(k * 31);
  return <Stage t={t} a={a} b={b} src={src!} beamX={500}>
    <Drop t={t} at={a + 0.05} x={180} y={150} w={700} h={800} from={-760}>
      <div style={{ ...abs(0, 0, 700, 800), ...madera("#6d4427", "#38210f"), borderRadius: 24 }} />
      <div style={{ ...abs(110, 70, 480, 480), borderRadius: "50%", background: "radial-gradient(circle at 40% 34%,#fffaf0,#d7ccb2)", boxShadow: "inset 0 0 0 16px #b8965a, inset 0 0 24px rgba(0,0,0,.3)" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ ...abs(235, 24, 10, 34), background: "#2b2a3a", transformOrigin: "5px 216px", transform: `rotate(${i * 30}deg)` }} />)}
        <div style={{ ...abs(232, 110, 16, 136), background: "#1c1c26", transformOrigin: "8px 130px", transform: `rotate(${(t - a) * 62}deg)`, borderRadius: 8 }} />
        <div style={{ ...abs(235, 60, 10, 186), background: ROJO, transformOrigin: "5px 180px", transform: `rotate(${(t - a) * 360}deg)` }} />
      </div>
      <div style={{ ...abs(120, 610, 460, 40), background: "#0e0a06", borderRadius: 10, boxShadow: "inset 0 4px 8px #000" }} />
    </Drop>
    <div style={{ ...abs(980, 110, 690, 860), ...papel(), borderRadius: 12, transform: `translateX(${(1 - sp(t, a + 0.6)) * 900}px) rotate(${1.8 + 1.2 * Math.sin((t - a) * 0.8)}deg)`, boxShadow: "0 36px 60px rgba(0,0,0,.55)" }}>
      <div style={{ ...abs(0, 40, 690, 120), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 96, color: TINTA }}>{n >= 31 ? "31 YEARS" : `${n} YEARS`}</div>
      {Array.from({ length: 31 }, (_, i) => { const on = i < n; return <div key={i} style={{ ...abs(50 + (i % 7) * 86, 190 + Math.floor(i / 7) * 120, 62, 86), borderRadius: 8, background: on ? "#20150b" : "rgba(110,80,40,.14)", boxShadow: on ? "inset 0 4px 8px #000" : "inset 0 0 0 2px rgba(90,60,30,.3)" }} />; })}
    </div>
  </Stage>;
};

// 06:31 Letrero enrollable del colectivo: gira recorrido por recorrido y clava en DAY OFF
const RollSign: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const off = T(p, "off", 4.1), L = ["75 CULEBRA", "DOWNTOWN", "PROSPECT HILL", "ZARZAMORA", "GUADALUPE", "DAY OFF"];
  const pos = lerp(0, L.length - 1, ei(t, a + 0.5, off)) + (t > off ? Math.exp(-(t - off) * 5) * Math.sin((t - off) * 20) * 0.06 : 0), hh = 230, done = t >= off;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={240} y={270} w={1440} h={500} from={-620}>
      <div style={{ ...abs(0, 0, 1440, 500), borderRadius: 30, background: "linear-gradient(175deg,#2e3036,#121317)", boxShadow: "inset 0 2px 0 rgba(255,255,255,.3)" }} />
      <div style={{ ...abs(70, 130, 1300, 240), overflow: "hidden", background: "#06060a", boxShadow: "inset 0 0 0 6px #5e5e66, inset 0 14px 30px #000", borderRadius: 8 }}>
        {L.map((tx, i) => { const y = 5 + (i - pos) * hh; const last = i === L.length - 1; return <div key={i} style={{ ...abs(0, y, 1300, hh), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 150, color: last && done ? ORO : "#f2e3b4", opacity: Math.abs(i - pos) < 1.2 ? 1 : 0, textShadow: last && done ? glow("rgba(240,194,75,.6)", 22) : undefined }}>{tx}</div>; })}
      </div>
      {[[-14, 70], [1430, 70]].map((c, i) => <div key={i} style={{ ...abs(c[0], c[1], 24, 360), ...laton(), borderRadius: 12, backgroundPositionY: `${pos * 80}px` }} />)}
    </Drop>
  </Stage>;
};

// 07:05 Vianda metálica: se abre y adentro hay lo que de verdad dice «estoy tarde»
const Lunchbox: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const op = ei(t, a + 1.0, a + 1.9);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <Drop t={t} at={a + 0.08} x={510} y={420} w={900} h={520} from={-600}>
      <div style={{ ...abs(0, 120, 900, 400), background: "linear-gradient(170deg,#30506b,#172b3e)", borderRadius: "16px 16px 44px 44px", boxShadow: "inset 0 3px 0 rgba(255,255,255,.3)" }}>
        <div style={{ ...abs(370, 30, 160, 60), ...laton(), borderRadius: 10 }} />
      </div>
      <div style={{ ...abs(330, 40, 240, 96), border: "16px solid #9fa6ad", borderBottom: "none", borderRadius: "90px 90px 0 0" }} />
    </Drop>
    <div style={{ ...abs(510, 110, 900, 230), transformOrigin: "50% 100%", transform: `translateY(${(1 - sp(t, a + 0.08)) * -600 + 210}px) perspective(1500px) rotateX(${op * 62}deg)`, background: "linear-gradient(170deg,#3e6685,#20394f)", borderRadius: "340px 340px 16px 16px", boxShadow: "inset 0 5px 0 rgba(255,255,255,.28)" }} />
    <div style={{ ...abs(420, 250, 1080, 370), ...papel(), ...center, flexDirection: "column", borderRadius: 10, opacity: e(t, a + 1.5, a + 1.9), transform: `translateY(${(1 - sp(t, a + 1.5)) * 320}px) rotate(-2deg)`, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ fontFamily: MANO, fontWeight: 700, fontSize: 118, color: TINTA, lineHeight: 1.04 }}>I still have</div>
      <div style={{ fontFamily: MANO, fontWeight: 700, fontSize: 138, color: "#8e2f25", lineHeight: 1.04 }}>a job to do</div>
    </div>
  </Stage>;
};

// 08:23 Plato tapado con vapor: la frase en español sube y nadie la entiende, se deshace sobre la silla vacía
const PlateRim: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a, up = e(t, a + 0.8, a + 3.2), go = e(t, a + 4.6, a + 6.4);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <Drop t={t} at={a + 0.05} x={520} y={640} w={880} h={300} from={-300}>
      <div style={{ ...abs(0, 50, 880, 240), borderRadius: "50%", background: "radial-gradient(ellipse at 50% 42%,#fff,#d8d3c6 70%,#a6a092)", boxShadow: "inset 0 0 0 26px rgba(70,110,170,.5)" }} />
      <div style={{ ...abs(170, 96, 290, 150), borderRadius: "50%", background: "radial-gradient(ellipse at 44% 34%,#fffdf2,#e0c98f 80%)", boxShadow: "inset 0 -10px 16px rgba(160,110,40,.45)" }} />
      <div style={{ ...abs(430, 104, 260, 140), borderRadius: "50%", background: "radial-gradient(ellipse at 46% 34%,#6e3b24,#2a130b 85%)", boxShadow: "inset 0 -8px 14px #000" }} />
      <div style={{ ...abs(760, 120, 26, 170), background: "linear-gradient(90deg,#858b93,#e4e8ec,#7d838b)", borderRadius: 13, transform: "rotate(10deg)" }} />
    </Drop>
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ ...abs(760 + i * 70, 160 + Math.sin(q + i) * 26, 56, 500), background: "linear-gradient(0deg,rgba(255,255,255,.75),transparent)", filter: "blur(18px)", transform: `translateX(${Math.sin(q * 0.8 + i * 1.7) * 44}px)` }} />)}
    <div style={{ ...abs(0, 230 - up * 40, 1920, 260), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 158, color: INK, letterSpacing: 2 + go * 30, opacity: up * (1 - go), filter: `blur(${go * 22}px)`, textShadow: "0 10px 34px rgba(0,0,0,.7)" }}>¿Ya comiste, mijo?</div>
    <Say t={t} at={a + 5.5} tx="HE NEVER TAUGHT HIM" y={290} size={92} />
  </Stage>;
};

// 08:58 Corte de capas: el último idioma se erosiona primero y abajo de todo el primero brilla
const Strata: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const ero = e(t, a + 1.2, a + 3.6), fi = T(p, "first", 3.8);
  const on = e(t, fi, fi + 0.5), L = [["LAST IN: ENGLISH", "#a68e6b", 150], ["SCHOOL", "#856a4c", 130], ["CHURCH", "#664d36", 130]];
  let y = 120;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={1000}>
    {L.map((l, i) => { const h = l[2] as number, top = y; y += h + 8; const k = i === 0 ? ero : 0; return <div key={i} style={{ ...abs(300, top, 1320, h), ...center, ...piedra(l[1] as string, "#3a2b1b"), borderRadius: 12, opacity: sp(t, a + 0.1 + i * 0.2) * (1 - k), filter: `blur(${k * 16}px)`, transform: `translateX(${k * 460}px) rotate(${k * 6}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 78, color: INK }}>{l[0]}</div>; })}
    <div style={{ ...abs(300, y, 1320, 330), ...center, flexDirection: "column", borderRadius: 16, background: `linear-gradient(170deg,${on ? "#f6cf6c" : "#4a3626"},${on ? "#b27a18" : "#2b1d12"})`, opacity: sp(t, a + 0.7), boxShadow: `inset 0 3px 0 rgba(255,235,200,.4), ${glow(`rgba(240,194,75,${on * 0.5})`, 42)}`, fontFamily: FONT, fontWeight: 900, color: on ? "#3a2510" : INK }}>
      <div style={{ fontSize: 58 }}>AT THE BOTTOM</div><div style={{ fontSize: 124, lineHeight: 1.05 }}>THE FIRST ONE</div>
    </div>
  </Stage>;
};

// 09:12 Espejo del baño: cada frase en español queda pegada en una notita, de a una en su palabra
const MirrorNotes: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const W = p.w as { tx: string }[];
  const pos = [[300, 150, -4], [930, 110, 3], [330, 520, 3], [920, 500, -3]];
  return <Stage t={t} a={a} b={b} src={src!} beamX={700} floor={940}>
    <Drop t={t} at={a + 0.05} x={190} y={30} w={1540} h={940} from={-500} shadow={false}>
      <div style={{ ...abs(0, 0, 1540, 940), borderRadius: 34, ...laton() }} />
      <div style={{ ...abs(28, 28, 1484, 884), borderRadius: 18, background: "linear-gradient(140deg,#7f8d92,#39454b 44%,#90a0a5 72%,#465359)", boxShadow: "inset 0 0 40px rgba(0,0,0,.45)", overflow: "hidden" }}>
        <div style={{ ...abs(-300, -120, 300, 1300), background: "linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)", transform: `translateX(${(t - a) * 240}px) rotate(14deg)` }} />
      </div>
    </Drop>
    {W.map((w, i) => { const at = Math.min(a + 0.9 + i * 1.7, b - 1.4), k = sp(t, at), o = e(t, at, at + 0.1), [x, y, r] = pos[i], peel = 5 + 3 * Math.sin((t - a) * 1.3 + i); return o > 0 ? <div key={i} style={{ ...abs(x, y, 660, 330), ...center, opacity: o, background: "linear-gradient(170deg,#ffe78a,#f2c94e)", transform: `scale(${0.4 + 0.6 * k}) rotate(${r + (1 - k) * 18}deg) perspective(1200px) rotateX(${peel}deg)`, transformOrigin: "50% 0", boxShadow: "0 24px 30px rgba(0,0,0,.42)", fontFamily: MANO, fontWeight: 700, fontSize: 102, color: TINTA, lineHeight: 1 }}>{w.tx}</div> : null; })}
  </Stage>;
};

export const MAP: Record<string, React.FC<P>> = { BusSign, Riffle400, Rosary9, Badges, House61, Doormat, PunchClock, RollSign, Lunchbox, PlateRim, Strata, MirrorNotes, ...MAP2 };
export const Comp: React.FC<{ o: any; t: number }> = ({ o, t }) => { const C = MAP[o.n]; return C ? <C {...o} t={t - 0.18} /> : null; }; // eslint-disable-line @typescript-eslint/no-explicit-any
export { BRASS, LILA, PAPER, SERIF, rnd };
