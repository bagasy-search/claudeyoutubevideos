// comps2.tsx · hr8pb minutos 10-29: un mecanismo por minuto.
import React from "react";
import { INK, MANO, ORO, P, PAPER2, ROJO, FONT, Say, Stage, Drop, TINTA, T, abs, center, glow, piedra, cl, e, ei, laton, lerp, madera, papel, rnd, sp } from "./stage";

const Flame: React.FC<{ x: number; y: number; s?: number; t: number; o?: number }> = ({ x, y, s = 1, t, o = 1 }) => <div style={{ ...abs(x - 34 * s, y - 118 * s, 68 * s, 120 * s), opacity: o, borderRadius: "50% 50% 46% 46% / 72% 72% 28% 28%", background: "radial-gradient(ellipse at 50% 76%,#fffbe0,#ffd25e 42%,#f77a1c 76%,transparent)", transform: `scaleY(${1 + 0.07 * Math.sin(t * 9.5 + x)}) skewX(${3 * Math.sin(t * 6.3 + x)}deg)`, transformOrigin: "50% 100%", boxShadow: `0 0 ${70 * s}px rgba(255,180,80,.6)` }} />;

// 10:22 Dos velas: ella prende la primera mitad, se calla, y la otra vela se prende sola
const TwoCandles: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const l2 = b - 2.6, o2 = e(t, l2, l2 + 0.3);
  const C: React.FC<{ x: number }> = ({ x }) => <div style={{ ...abs(x, 420, 170, 520), background: "linear-gradient(90deg,#d8c9a2,#fff6df 44%,#cdbb92)", borderRadius: "14px 14px 8px 8px", boxShadow: "inset 0 7px 0 rgba(255,255,255,.7)" }}><div style={{ ...abs(80, -32, 8, 34), background: "#2a2118" }} /></div>;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960} floor={830}>
    <Drop t={t} at={a + 0.05} x={0} y={0} w={1920} h={980} from={-160} shadow={false}><C x={520} /><C x={1230} /><div style={{ ...abs(420, 930, 1080, 26), ...laton(), borderRadius: 13 }} /></Drop>
    <Flame x={605} y={392} s={1.5} t={t} o={e(t, a + 0.5, a + 0.8)} /><Flame x={1315} y={392} s={1.5} t={t} o={o2} />
    <div style={{ ...abs(40, 500, 470, 300), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 110, color: INK, opacity: e(t, a + 0.8, a + 1.2), textShadow: "0 8px 30px #000" }}>Dios te salve…</div>
    <div style={{ ...abs(710, 500, 500, 300), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 104, lineHeight: 1.05, color: ORO, opacity: o2, textShadow: "0 8px 30px #000" }}>…llena eres de gracia</div>
  </Stage>;
};

// 11:10 Lupa de joyero: de la miniatura sale, grande, lo que dijo en hebreo
const Loupe: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const say = T(p, "say", 5), m = ei(t, a + 0.5, say), x = lerp(300, 960, m), y = lerp(230, 480, m), r = lerp(190, 400, m);
  return <Stage t={t} a={a} b={b} src={src!} beamX={x}>
    <Drop t={t} at={a + 0.05} x={270} y={640} w={1380} h={330} from={-240}><div style={{ ...abs(0, 40, 1380, 290), ...papel("#f7efdc", "#d8c8a6"), borderRadius: 10, ...center, fontFamily: FONT, fontSize: 26, color: "rgba(40,30,20,.32)", letterSpacing: 14, lineHeight: 2.3, padding: 40 }}>{"· · · · · · ".repeat(30)}</div></Drop>
    <div style={{ ...abs(x - r, y - r, r * 2, r * 2), borderRadius: "50%", ...center, background: "radial-gradient(circle at 36% 28%,rgba(255,255,255,.62),rgba(245,235,212,.92) 34%,rgba(180,160,120,.8))", boxShadow: "inset 0 0 0 22px #1e1b1a, inset 0 0 0 26px #b89a55, 0 40px 70px rgba(0,0,0,.6)", opacity: e(t, a + 0.2, a + 0.5) }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40 + m * 100, color: TINTA, letterSpacing: 2 }}>SHEMA</div>
    </div>
    <div style={{ ...abs(x + r * 0.62, y + r * 0.62, 56, 330), background: "linear-gradient(90deg,#141210,#46403a,#141210)", borderRadius: 26, transform: "rotate(-44deg)", transformOrigin: "50% 0", opacity: e(t, a + 0.2, a + 0.5) }} />
  </Stage>;
};

// 11:40 Caja fuerte: la enfermedad golpea afuera y lo que se rezó de rodillas sigue adentro con luz
const Vault: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a, op = ei(t, a + 2.3, a + 3.6);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={440} y={90} w={1040} h={860} from={-500}>
      <div style={{ ...abs(0, 0, 1040, 860), background: "linear-gradient(160deg,#4e5560,#1f242c)", borderRadius: 36, boxShadow: "inset 0 3px 0 rgba(255,255,255,.3)" }} />
      <div style={{ ...abs(110, 90, 820, 680), borderRadius: 26, background: `radial-gradient(ellipse at 50% 60%,rgba(255,226,150,${op}),rgba(190,120,40,${op * 0.9}))`, boxShadow: "inset 0 14px 40px #000" }}>
        <div style={{ ...abs(0, 180, 820, 320), ...center, flexDirection: "column", fontFamily: MANO, fontWeight: 700, color: "#3a2410", opacity: e(t, a + 3.1, a + 3.7), fontSize: 124, lineHeight: 1.05 }}><div>Our Father</div><div>on our knees</div></div>
      </div>
      <div style={{ ...abs(110, 90, 820, 680), borderRadius: 26, background: "linear-gradient(165deg,#646d78,#2c323b)", transformOrigin: "0 50%", transform: `perspective(2000px) rotateY(${-op * 96}deg)`, boxShadow: "inset 0 0 0 10px rgba(255,255,255,.08)" }}>
        <div style={{ ...abs(250, 180, 320, 320), borderRadius: "50%", ...laton(), transform: `rotate(${q * 80 + op * 280}deg)` }}><div style={{ ...abs(146, 0, 28, 320), background: "#5b4418" }} /><div style={{ ...abs(0, 146, 320, 28), background: "#5b4418" }} /></div>
      </div>
    </Drop>
  </Stage>;
};

// 12:46 Marquesina de Market Square: 14 focos, uno por mes de silencio, se apagan en fila
const Bulbs14: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={190} y={210} w={1540} h={620} from={-620}>
      <div style={{ ...abs(0, 0, 1540, 620), ...madera("#6c1f24", "#330d10"), borderRadius: 30 }} />
      {Array.from({ length: 14 }, (_, i) => { const off = a + 0.7 + i * ((b - a - 1.9) / 14), on = 1 - e(t, off, off + 0.14), x = 60 + (i % 7) * 214, y = i < 7 ? 56 : 446; return <div key={i} style={{ ...abs(x, y, 130, 130), borderRadius: "50%", background: on > 0.1 ? "radial-gradient(circle at 40% 34%,#fffbe3,#ffd567 58%,#c98615)" : "radial-gradient(circle at 40% 34%,#7d7263,#312a22)", boxShadow: glow(`rgba(255,205,110,${on * 0.5})`, 22) }} />; })}
      <div style={{ ...abs(0, 210, 1540, 200), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 150, color: INK, textShadow: "0 6px 0 rgba(0,0,0,.5)" }}>14 MONTHS</div>
    </Drop>
  </Stage>;
};

// 13:01 Tres válvulas de trompeta: suben y bajan solas al ritmo de los dedos
const Valves: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a, g = T(p, "get", 4.6), lit = e(t, g, g + 0.4);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={260} y={520} w={1400} h={260} from={-460}><div style={{ ...abs(170, 90, 1040, 250), borderRadius: "0 0 125px 125px", border: "36px solid #c99d44", borderTop: "none" }} /><div style={{ ...abs(0, 40, 1400, 150), ...laton(), borderRadius: 75 }} /><div style={{ ...abs(-70, 62, 110, 106), ...laton(), borderRadius: "50% 14px 14px 50%" }} /><div style={{ ...abs(1270, -130, 290, 490), ...laton(), clipPath: "polygon(0 36%,100% 0,100% 100%,0 64%)" }} /></Drop>
    {[0, 1, 2].map((i) => { const d = Math.max(0, Math.sin(q * 3.4 + i * 1.9)) * 92; return <div key={i} style={{ ...abs(540 + i * 310, 160 + d, 220, 560), opacity: sp(t, a + 0.2 + i * 0.12) }}>
      <div style={{ ...abs(0, 0, 220, 76), ...laton(), borderRadius: "50%", boxShadow: `${glow(`rgba(240,194,75,${lit * 0.55})`, 26)}` }} />
      <div style={{ ...abs(60, 60, 100, 500), background: "linear-gradient(90deg,#8d6c2a,#f2dc9c 46%,#7a5a1e)" }} /></div>; })}
    <Say t={t} at={g + 0.1} tx="HE WAS PLAYING" y={920} size={100} col={ORO} />
  </Stage>;
};

// 13:35 El vinilo gira, la púa baja y el surco se enciende con lo que cantó
const Record: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const q = t - a, pu = ei(t, a + 0.5, a + 1.2), c = T(p, "canta", 3);
  return <Stage t={t} a={a} b={b} src={src!} beamX={760}>
    <Drop t={t} at={a + 0.05} x={320} y={80} w={880} h={880} from={-520}>
      <div style={{ ...abs(0, 0, 880, 880), borderRadius: "50%", background: "repeating-radial-gradient(circle,#101014 0 5px,#26262c 5px 7px)", transform: `rotate(${q * 200}deg)`, boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
        <div style={{ ...abs(290, 290, 300, 300), borderRadius: "50%", background: "radial-gradient(circle,#f0c24b,#b47c1f)" }} /><div style={{ ...abs(420, 420, 40, 40), borderRadius: "50%", background: "#14121a" }} />
      </div>
      <div style={{ ...abs(0, 0, 880, 880), borderRadius: "50%", background: "linear-gradient(120deg,transparent 40%,rgba(255,255,255,.2) 50%,transparent 60%)", pointerEvents: "none" }} />
    </Drop>
    <div style={{ ...abs(1225, 40, 180, 180), ...laton(), borderRadius: "50%", opacity: e(t, a + 0.2, a + 0.5), boxShadow: "0 18px 26px rgba(0,0,0,.5)" }} /><div style={{ ...abs(1280, 90, 70, 620), ...laton(), borderRadius: 32, transformOrigin: "50% 8%", transform: `rotate(${lerp(-6, 25, pu)}deg)`, opacity: e(t, a + 0.2, a + 0.5) }}><div style={{ ...abs(-14, 560, 100, 92), background: "#191820", borderRadius: 10 }} /></div>
    <div style={{ ...abs(0, 800, 1920, 200), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 138, color: ORO, opacity: e(t, c, c + 0.4), transform: `translateY(${(1 - sp(t, c)) * 40}px)`, textShadow: "0 8px 26px #000" }}>canta y no llores</div>
  </Stage>;
};

// 14:06 Regla de carpintero: de toda la vida, sólo se ilumina de 15 a 25
const YardRule: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const m = e(t, a + 1.2, a + 2.4), W = 1720, px = (v: number) => (v / 90) * W;
  return <Stage t={t} a={a} b={b} src={src!} beamX={460}>
    <Drop t={t} at={a + 0.05} x={100} y={380} w={W} h={300} from={-520}>
      <div style={{ ...abs(0, 0, W, 300), ...madera("#e0b672", "#ab7b3f"), borderRadius: 18 }} />
      {Array.from({ length: 91 }, (_, i) => <div key={i} style={{ ...abs(px(i), 0, 4, i % 10 === 0 ? 140 : i % 5 === 0 ? 92 : 54), background: "#2d1d0d" }} />)}
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ ...abs(px(i * 10) - 40, 150, 80, 100), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#2d1d0d" }}>{i * 10}</div>)}
      <div style={{ ...abs(px(15), -30, px(10) * m, 360), borderRadius: 16, background: "rgba(240,194,75,.55)", boxShadow: `0 0 0 6px ${ORO}, ${glow("rgba(240,194,75,.55)", 30)}` }} />
    </Drop>
    <Say t={t} at={a + 2.8} tx="THE SONGS FROM 15 TO 25" y={760} size={100} col={INK} />
  </Stage>;
};

// 15:11 Árbol de familia tallado: las ramas conocidas brillan y aparece una rama que nadie nombró
const FamTree: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const x = a + 4.8, k = e(t, x, x + 0.8);
  const N: React.FC<{ x: number; y: number; tx: string; at: number; col?: string; w?: number }> = ({ x, y, tx, at, col = PAPER2, w = 430 }) => <div style={{ ...abs(x - w / 2, y - 85, w, 170), ...center, borderRadius: 16, ...madera("#caa068", "#8a5e2e"), opacity: e(t, at, at + 0.2), transform: `scale(${sp(t, at)})`, fontFamily: FONT, fontWeight: 900, fontSize: 88, color: col === PAPER2 ? "#21130a" : col, boxShadow: `0 22px 34px rgba(0,0,0,.5)` }}>{tx}</div>;
  const line = (d: string, o: number, c = "#6f4a24") => <path d={d} stroke={c} strokeWidth={22} fill="none" strokeLinecap="round" opacity={o} />;
  return <Stage t={t} a={a} b={b} src={src!} beamX={1400} floor={980}>
    <svg style={abs(0, 0, 1920, 1080)}>{line("M660 250 C 660 420 420 420 420 610", e(t, a + 1.4, a + 1.8))}{line("M660 250 C 660 420 900 420 900 610", e(t, a + 1.8, a + 2.2))}{line("M660 250 C 800 460 1460 300 1460 530", k * 0.9, "#caa068")}</svg>
    <N x={660} y={190} tx="HAROLD" at={a + 0.5} /><N x={420} y={680} tx="BILL" at={a + 1.5} /><N x={900} y={680} tx="RICHARD" at={a + 2.0} />
    <div style={{ ...abs(1240, 470, 440, 200), ...center, borderRadius: 18, background: "linear-gradient(170deg,#ffe48a,#d99e22)", opacity: k, transform: `scale(${0.7 + 0.3 * sp(t, x)}) rotate(-2deg)`, boxShadow: glow("rgba(240,194,75,.55)", 34), fontFamily: MANO, fontWeight: 700, fontSize: 130, color: "#2a1a08" }}>Tommy?</div>
  </Stage>;
};

// 15:50 Caja de zapatos 3D: se levanta la tapa, gorrito tejido y pulsera de hospital con el año
const ShoeBox3D: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const op = T(p, "open", 3), yr = T(p, "yr", 5.5), lid = ei(t, op - 0.5, op + 0.3);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={740}>
    <Drop t={t} at={a + 0.05} x={420} y={430} w={1080} h={510} from={-600}>
      <div style={{ ...abs(0, 0, 1080, 124), background: "linear-gradient(180deg,#2a1f12,#57452b)", clipPath: "polygon(7% 0,93% 0,100% 100%,0 100%)" }} />
      <div style={{ ...abs(200, -80 - lid * 150, 320, 320), opacity: e(t, op, op + 0.3), transform: `scale(${sp(t, op)})`, borderRadius: "50% 50% 10% 10% / 70% 70% 12% 12%", background: "repeating-linear-gradient(90deg,#dfe7f2 0 16px,#b7c5d8 16px 22px)", boxShadow: "0 24px 30px rgba(0,0,0,.4)" }}><div style={{ ...abs(-14, 236, 348, 92), borderRadius: 26, background: "repeating-linear-gradient(90deg,#f2f5fa 0 16px,#c9d4e4 16px 24px)", boxShadow: "0 8px 12px rgba(0,0,0,.3)" }} /><div style={{ ...abs(116, -56, 88, 88), borderRadius: "50%", background: "radial-gradient(circle at 40% 34%,#fff,#b7c5d8)" }} /></div>
      <div style={{ ...abs(590, 30 - lid * 70, 360, 96), ...center, opacity: e(t, op + 1, op + 1.3), transform: `rotate(-8deg) scale(${sp(t, op + 1)})`, borderRadius: 48, background: "#f7f3e6", boxShadow: "inset 0 0 0 6px #a9c2d6, 0 16px 22px rgba(0,0,0,.4)", fontFamily: FONT, fontWeight: 900, fontSize: 62, color: "#2c4a6e" }}>1953</div>
      <div style={{ ...abs(0, 124, 1080, 386), background: "linear-gradient(170deg,#c6b28b,#8d7a56)", borderRadius: "0 0 10px 10px", boxShadow: "inset 0 -26px 40px rgba(0,0,0,.3)" }} />
      <div style={{ ...abs(0, -lid * 560, 1080, 180), transform: `rotate(${lid * -8}deg)`, opacity: 1 - e(t, op + 0.2, op + 0.7) }}><div style={{ ...abs(0, 0, 1080, 124), background: "linear-gradient(170deg,#d6c29a,#b09a70)", clipPath: "polygon(7% 0,93% 0,100% 100%,0 100%)" }} /><div style={{ ...abs(-10, 122, 1100, 58), background: "linear-gradient(180deg,#a8926a,#7f6a48)", borderRadius: 6 }} /></div>
    </Drop>
    <Say t={t} at={yr} tx="TOMMY" x={1120} y={230} size={140} col={ORO} w={560} />
  </Stage>;
};

// 16:04 Sobre con sello de lacre: se cierra, y se queda cerrado 70 años
const WaxSeal: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const s0 = a + 1.8, k = sp(t, s0);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <Drop t={t} at={a + 0.05} x={360} y={200} w={1200} h={700} from={-560}>
      <div style={{ ...abs(0, 0, 1200, 700), ...papel("#ede0c2", "#c9b58b"), borderRadius: 10 }} />
      <div style={{ ...abs(0, 0, 1200, 0), borderLeft: "600px solid transparent", borderRight: "600px solid transparent", borderTop: "400px solid #dcc9a0", filter: "drop-shadow(0 8px 10px rgba(0,0,0,.25))" }} />
    </Drop>
    <div style={{ ...abs(840, 440, 240, 240), ...center, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 36% 28%,#d0463a,#7c1712)", opacity: cl(k * 3), transform: `scale(${0.3 + 0.7 * k}) rotate(${(1 - k) * 25}deg)`, boxShadow: "0 18px 24px rgba(0,0,0,.45)", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#ffd3c8" }}>1953</div>
    <Say t={t} at={a + 3.6} tx="NEVER SAID THAT NAME" y={110} size={96} />
    <Say t={t} at={a + 5.2} tx="UNTIL NOW" y={900} size={96} col={ORO} />
  </Stage>;
};

// 17:00 Papeles que caen con lo que grita; ninguno es ella: la última hoja se rompe
const Ransom: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const W = p.w as { tx: string }[], rip = b - 2.3, k = ei(t, rip, rip + 0.7);
  const pos = [[250, 120, -6, "#f4ead6"], [820, 330, 5, "#e8dabf"], [430, 620, -3, "#f0e4cd"]] as const;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    {W.map((w, i) => { const at = a + 0.4 + i * 1.7, [x, y, r, c] = pos[i]; return <div key={i} style={{ ...abs(x + (i === 2 ? -k * 40 : k * 90), y + (1 - sp(t, at)) * -800, 960, 320), ...center, background: c, opacity: e(t, at, at + 0.1) * (1 - k * 0.75), transform: `rotate(${r + k * (i % 2 ? 14 : -14)}deg)`, boxShadow: "0 28px 40px rgba(0,0,0,.55)", fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 140, color: "#1f1712" }}>{w.tx}</div>; })}
    <Say t={t} at={rip + 0.35} tx="THAT IS NOT HIM" y={440} size={136} col={ORO} />
  </Stage>;
};

// 18:17 Compuerta: se rompe el tablón que la sostenía y entra el agua turbia del miedo
const Sluice: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const op = ei(t, a + 1.0, a + 2.2), q = t - a;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={940}>
    <Drop t={t} at={a + 0.05} x={420} y={70} w={120} h={880} from={-760}><div style={{ ...abs(0, 0, 120, 880), ...piedra("#8a8a86", "#4b4b48"), borderRadius: 10 }} /></Drop>
    <Drop t={t} at={a + 0.12} x={1380} y={70} w={120} h={880} from={-760}><div style={{ ...abs(0, 0, 120, 880), ...piedra("#8a8a86", "#4b4b48"), borderRadius: 10 }} /></Drop>
    <div style={{ ...abs(540, 950 - op * 640, 840, op * 640), overflow: "hidden", background: "linear-gradient(180deg,#5a6b76,#2a343b)" }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={{ ...abs(-200, 40 + i * 100, 1300, 26), borderRadius: 13, background: "rgba(220,235,245,.26)", transform: `translateX(${Math.sin(q * 2.5 + i) * 90}px)` }} />)}</div>
    <div style={{ ...abs(540, 180 - op * 118, 840, 240), ...center, ...madera("#7a5730", "#3f2a15"), transform: `rotate(${op * 2}deg)`, boxShadow: "0 18px 30px rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: INK }}>THE DOOR</div>
    <Say t={t} at={a + 2.6} tx="FEAR COMES THROUGH" y={560} size={124} col={ORO} />
  </Stage>;
};

// 19:40 Prendedor de «nueva amiga»: lo que queda cuando no te reconoce
const NameTag: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <Drop t={t} at={a + 0.05} x={410} y={200} w={1100} h={660} from={-620} rot={-3}>
      <div style={{ ...abs(0, 0, 1100, 660), borderRadius: 44, background: "linear-gradient(170deg,#c9443a,#7d1c14)", boxShadow: "inset 0 5px 0 rgba(255,255,255,.3)" }}>
        <div style={{ ...abs(0, 26, 1100, 130), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 92, color: "#fff" }}>HELLO, MY NAME IS</div>
        <div style={{ ...abs(44, 180, 1012, 440), ...center, ...papel("#fff", "#efe8d9"), borderRadius: 26, fontFamily: MANO, fontWeight: 700, fontSize: 188, color: TINTA, lineHeight: 1 }}>{"kind face".slice(0, Math.floor(e(t, a + 2.2, a + 3.5) * 9))}</div>
      </div>
    </Drop>
  </Stage>;
};

// 20:27 Relicario que se abre: «la mejor» estaba guardada adentro
const Locket: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const o = ei(t, a + 0.8, a + 1.7), Half: React.FC<{ s: number }> = ({ s }) => <div style={{ ...abs(0, 0, 460, 620), ...laton(), borderRadius: s < 0 ? "100% 0 0 100% / 50% 0 0 50%" : "0 100% 100% 0 / 0 50% 50% 0", boxShadow: "inset 0 3px 0 rgba(255,255,255,.7), 0 30px 50px rgba(0,0,0,.5)" }}><div style={{ ...abs(s < 0 ? 46 : 14, 42, 400, 536), borderRadius: s < 0 ? "100% 0 0 100% / 50% 0 0 50%" : "0 100% 100% 0 / 0 50% 50% 0", background: `radial-gradient(ellipse at 50% 40%,#6d1f2e,#2c0a12 ${70 + o * 10}%)`, opacity: o }} /></div>;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <div style={{ ...abs(0, -30, 1920, 1080), opacity: sp(t, a + 0.05) > 0 ? 1 : 0 }}>
      <svg style={abs(0, 0, 1920, 500)}><path d="M960 170 C 700 -100 1220 -100 960 170" stroke="#caa556" strokeWidth={8} fill="none" /></svg>
      <div style={{ ...abs(960 - o * 470, 240, o * 940, 540), opacity: o, borderRadius: 40, background: "radial-gradient(ellipse at 50% 45%,#6b1f2c,#2c0b12)", boxShadow: "inset 0 0 60px rgba(0,0,0,.65), 0 26px 40px rgba(0,0,0,.55)" }} /><div style={{ ...abs(940, 170, 40, 90), ...laton(), borderRadius: 14 }} /><div style={{ ...abs(960 - 460 - o * 400, 200, 460, 620), transformOrigin: "100% 50%", transform: `perspective(1600px) rotateY(${o * 34}deg)` }}><Half s={-1} /></div>
      <div style={{ ...abs(960 + o * 400, 200, 460, 620), transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-o * 34}deg)` }}><Half s={1} /></div>
      <div style={{ ...abs(620, 330, 680, 360), ...center, flexDirection: "column", opacity: e(t, a + 1.6, a + 2.1), fontFamily: MANO, fontWeight: 700, color: INK, fontSize: 148, lineHeight: 1.05, textShadow: "0 8px 28px #000" }}><div>She's the</div><div style={{ color: ORO }}>best one</div></div>
    </div>
  </Stage>;
};

// 21:33 Naipes: la pregunta mala se da vuelta y del otro lado está la frase buena
const FlipCards: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  const D = [["DO YOU REMEMBER ME?", "HI MOM, IT'S LINDA"], ["DON'T YOU REMEMBER?", "I BROUGHT A PEACH"], ["WE TALKED ABOUT THIS", "TELL ME MORE"]];
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    {D.map((d, i) => { const at = a + 1.6 + i * 1.8, f = ei(t, at, at + 0.55), ang = f * 180; const k = sp(t, a + 0.1 + i * 0.15); const front = ang < 90; return <div key={i} style={{ ...abs(150 + i * 560, 180, 500, 700), opacity: cl(k * 2), transform: `translateY(${(1 - k) * -640}px) perspective(1700px) rotateY(${front ? ang : ang - 180}deg) rotate(${(i - 1) * 2}deg)` }}>
      <div style={{ ...abs(0, 0, 500, 700), ...center, padding: 26, borderRadius: 28, background: front ? "linear-gradient(170deg,#3a3f4a,#1b1e26)" : "linear-gradient(170deg,#fff4d2,#eccf8c)", boxShadow: "0 34px 50px rgba(0,0,0,.55)", fontFamily: front ? FONT : MANO, fontWeight: front ? 900 : 700, fontSize: front ? 74 : 104, lineHeight: 1.08, color: front ? "#c9ced8" : TINTA }}>{front ? d[0] : d[1]}</div></div>; })}
  </Stage>;
};

// 22:41 Vista desde arriba del cuarto: la silla baja y se arrima a la cama; la mirada baja con ella
const FloorPlan: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const m = ei(t, a + 1.0, a + 2.6), lo = T(p, "low", 4), ln = e(t, lo, lo + 0.5);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960} floor={1040}>
    <Drop t={t} at={a + 0.05} x={260} y={70} w={1400} h={880} from={-500} shadow={false}>
      <div style={{ ...abs(0, 0, 1400, 880), ...madera("#a07a4d", "#6e4c28"), borderRadius: 14, boxShadow: "inset 0 0 0 22px #e6dcc6" }} />
      <div style={{ ...abs(90, 230, 620, 420), ...papel("#ece4d3", "#c2b7a0"), borderRadius: 24 }}><div style={{ ...abs(26, 24, 150, 370), background: "#fffdf7", borderRadius: 18 }} /></div>
      <div style={{ ...abs(lerp(1120, 760, m), lerp(620, 370, m), 180, 180), ...madera("#6d3f1f", "#3e2210"), borderRadius: 18, boxShadow: "0 16px 20px rgba(0,0,0,.45)" }} />
      <svg style={abs(0, 0, 1400, 880)}><path d={`M 850 ${lerp(160, 460, ln)} L 300 450`} stroke={ORO} strokeWidth={12} strokeDasharray="10 26" fill="none" strokeLinecap="round" opacity={e(t, lo - 1, lo - 0.6)} /></svg>
    </Drop>
    <Say t={t} at={lo + 0.3} tx="LOWER THAN THEIRS" y={770} size={104} />
  </Stage>;
};

// 23:32 Una vela marcada en cuatro: se consume una raya por cada minuto de callarse
const Candle4: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const k = cl((t - a - 0.8) / (b - a - 1.8)), top = 150 + k * 410;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960} floor={880}>
    <Drop t={t} at={a + 0.05} x={0} y={0} w={1920} h={960} from={-200} shadow={false}>
      <div style={{ ...abs(820, top, 280, 900 - top), background: "linear-gradient(90deg,#d8c9a2,#fff6df 44%,#cdbb92)", borderRadius: "16px 16px 0 0", boxShadow: "inset 0 7px 0 rgba(255,255,255,.7)" }} />
      {[1, 2, 3, 4].map((i) => { const y = 150 + i * 150; return y < top ? null : <div key={i} style={{ ...abs(790, y, 340, 8), background: "#8e2f25", borderRadius: 4 }} />; })}
      <div style={{ ...abs(700, 880, 520, 30), ...laton(), borderRadius: 15 }} />
    </Drop>
    <Flame x={960} y={top - 8} s={1.7} t={t} />
    <div style={{ ...abs(150, 340, 620, 360), ...center, flexDirection: "column", fontFamily: FONT, fontWeight: 900, color: INK, fontSize: 118, lineHeight: 1.05, opacity: e(t, a + 0.6, a + 1) }}><div>FOUR</div><div style={{ color: ORO }}>MINUTES</div></div>
    <div style={{ ...abs(1160, 340, 620, 360), ...center, fontFamily: MANO, fontWeight: 700, color: INK, fontSize: 130, lineHeight: 1.05, opacity: e(t, a + 3, a + 3.4) }}>of nothing</div>
  </Stage>;
};

// 23:48 El fichero de Lola: las tarjetas giran y frenan en lo que nunca hizo
const Rolodex: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const c1 = T(p, "c1", 3), c2 = T(p, "c2", 6), ctr = ei(t, c1 - 0.4, c1 + 0.1) + ei(t, c2 - 0.4, c2 + 0.1);
  const L = ["NEVER LOOKED AT HER WATCH", "NEVER STOOD AT THE FOOT", "NEVER TALKED OVER THEM"];
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <Drop t={t} at={a + 0.05} x={430} y={760} w={1060} h={200} from={-300}><div style={{ ...abs(0, 40, 1060, 160), ...laton(), borderRadius: 26 }} /></Drop>
    {L.map((tx, i) => { const r = (i - ctr) * 62, near = Math.abs(i - ctr) < 0.5; return <div key={i} style={{ ...abs(370, 170, 1180, 590), ...center, padding: 40, borderRadius: 26, transformOrigin: "50% 100%", transform: `translateY(${(1 - sp(t, a + 0.15)) * -500}px) perspective(1800px) rotateX(${-r}deg)`, opacity: 1 - cl((Math.abs(r) - 18) / 26), background: near ? "linear-gradient(170deg,#fff6dc,#ecd5a0)" : "linear-gradient(170deg,#d8c9a8,#a6946e)", boxShadow: "0 22px 40px rgba(0,0,0,.45)", zIndex: 10 - Math.round(Math.abs(i - ctr)), fontFamily: FONT, fontWeight: 900, fontSize: 112, lineHeight: 1.08, color: TINTA }}>{tx}</div>; })}
  </Stage>;
};

// 24:36 Planilla de visitas: el trazo de cada visita se suma aunque ella no lo diga
const VisitTally: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const n = Math.floor(e(t, a + 0.9, b - 2.4) * 17);
  return <Stage t={t} a={a} b={b} src={src!} beamX={1300}>
    <Drop t={t} at={a + 0.05} x={260} y={90} w={1400} h={760} from={-620} rot={-1.5}>
      <div style={{ ...abs(0, 0, 1400, 760), ...papel(), borderRadius: 10 }} />
      {Array.from({ length: n }, (_, i) => { const g = Math.floor(i / 5), r = i % 5, x = 120 + (g % 3) * 440 + r * 72, y = 70 + Math.floor(g / 3) * 340; return r === 4 ? <div key={i} style={{ ...abs(x - 310, y + 120, 350, 22), background: "#22307e", borderRadius: 11, transform: "rotate(-24deg)" }} /> : <div key={i} style={{ ...abs(x, y, 24, 280), background: "#22307e", borderRadius: 12, transform: `rotate(${(rnd(i, 2) - 0.5) * 8}deg)` }} />; })}
    </Drop>
    <Say t={t} at={b - 2.5} tx="KEEP COMING" y={870} size={136} col={ORO} />
  </Stage>;
};

// 25:11 Cinco lunas: cinco noches en las que otra persona cuida y vos dormís
const Moons5: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960} floor={900}>
    {[0, 1, 2, 3, 4].map((i) => { const at = a + 0.4 + i * 0.5, k = sp(t, at), c = 1 - i / 4; return <div key={i} style={{ ...abs(120 + i * 352, 280, 290, 290), borderRadius: "50%", opacity: cl(k * 2), transform: `scale(${k})`, overflow: "hidden", background: "radial-gradient(circle at 40% 36%,#fffbe8,#e6dcb8)", boxShadow: glow("rgba(246,236,190,.42)", 30) }}><div style={{ ...abs(-30 + 300 * (1 - c), -10, 340, 320), borderRadius: "50%", background: "#0d1230", opacity: i === 4 ? 0 : 1 }} /></div>; })}
    <Say t={t} at={a + 3.0} tx="FIVE NIGHTS OF SLEEP" y={680} size={124} />
  </Stage>;
};

// 25:40 Tendedero: cada broche cuelga una frase de la lista, una por dicho
const Clothesline: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  const L = ["GO HOME = SAFE", "I'M LATE = NEEDED", "MI MAMÁ = SEND MOM", "CIELITO = SING"];
  return <Stage t={t} a={a} b={b} src={src!} beamX={460}>
    <svg style={abs(0, 0, 1920, 400)}><path d="M0 70 Q960 240 1920 70" stroke="#e8e0d0" strokeWidth={7} fill="none" /></svg>
    {L.map((tx, i) => { const at = a + 0.5 + i * 2.05, k = sp(t, at), x = 90 + i * 440, sag = 70 + 170 * (1 - Math.pow((x + 200 - 960) / 960, 2)), sw = 2.2 * Math.sin((t - at) * 2 + i); return <div key={i} style={{ ...abs(x, sag, 420, 520), opacity: cl(k * 2), transform: `translateY(${(1 - k) * -420}px) rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ ...abs(190, -30, 36, 86), ...madera("#cfa469", "#946a35"), borderRadius: 6 }} />
      <div style={{ ...abs(0, 26, 420, 480), ...center, padding: 26, ...papel("#fff8e8", "#e6d7b6"), boxShadow: "0 26px 34px rgba(0,0,0,.42)", flexDirection: "column", color: TINTA }}><div style={{ fontFamily: MANO, fontWeight: 700, fontSize: 82, lineHeight: 1 }}>{tx.split(" = ")[0].toLowerCase()}</div><div style={{ height: 8, width: 150, background: "#8e2f25", margin: "24px 0" }} /><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 86, lineHeight: 1 }}>{tx.split(" = ")[1]}</div></div>
    </div>; })}
  </Stage>;
};

// 26:57 Pared de páginas: en cada hoja la misma palabra, y entre todas se arma una sola, enorme
const WallMama: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const W = p.w ?? a + 4; const zoom = ei(t, a + 4.6, a + 7);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960} floor={1040}>
    <div style={{ ...abs(0, 0, 1920, 1080), transform: `scale(${1 + zoom * 0.14})`, opacity: 1 - zoom * 0.55 }}>
      {Array.from({ length: 40 }, (_, i) => { const at = a + 0.2 + rnd(i, 3) * 3.6, x = (i % 8) * 240, y = Math.floor(i / 8) * 216, on = e(t, at, at + 0.16); return <div key={i} style={{ ...abs(x + 6, y + 6, 228, 204), ...center, opacity: on, ...papel(i % 3 ? "#f2e6cc" : "#e7d8b6", "#c7b48e"), transform: `rotate(${(rnd(i, 5) - 0.5) * 7}deg) scale(${0.8 + 0.2 * sp(t, at)})`, fontFamily: MANO, fontWeight: 700, fontSize: 62, color: "#26307f" }}>{["mamá", "mama", "mommy", "mother", "mamita", "madre"][i % 6]}</div>; })}
    </div>
    <div style={{ ...abs(0, 330, 1920, 420), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 360, color: ORO, opacity: zoom, transform: `scale(${0.8 + 0.2 * zoom})`, textShadow: "0 14px 50px #000" }}>Mamá</div>
  </Stage>;
};

// 27:50 Velador de chico: la llamada a oscuras se responde prendiendo la luz
const NightLamp: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const onT = T(p, "on", 4.9), on = e(t, onT, onT + 0.4);
  return <Stage t={t} a={a} b={b} src={src!} night beamX={960}>
    <div style={{ ...abs(460, 40, 1000, 1000), background: `radial-gradient(circle,rgba(255,206,120,${on * 0.75}),transparent 62%)` }} />
    <Drop t={t} at={a + 0.05} x={680} y={200} w={560} h={700} from={-620}>
      <div style={{ ...abs(0, 0, 560, 330), borderRadius: "200px 200px 16px 16px", background: `linear-gradient(170deg,rgba(255,226,160,${0.25 + on * 0.75}),rgba(160,110,50,.9))` }} />
      <div style={{ ...abs(245, 330, 70, 290), ...madera("#9a6a3c", "#54331a"), borderRadius: 30 }} /><div style={{ ...abs(130, 610, 300, 90), ...madera("#a77949", "#5b3a1d"), borderRadius: 30 }} />
    </Drop>
    <Say t={t} at={a + 0.5} tx="WHEN A CHILD CALLS" y={70} size={98} />
    <Say t={t} at={onT + 0.05} tx="YOU ANSWER" y={910} size={130} col={ORO} />
  </Stage>;
};

// 28:18 Tinta que se escribe sola: lo que le dijo el hijo como si fuera su madre
const InkAqui: React.FC<P> = (p) => {
  const { t, a, b, src } = p; const tx = "Aquí estoy, mija", n = Math.floor(cl((t - a - 1) / 3.2) * tx.length);
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <Drop t={t} at={a + 0.05} x={190} y={180} w={1540} h={700} from={-620} rot={-1}>
      <div style={{ ...abs(0, 0, 1540, 700), ...papel("#fbf2dd", "#e0cfab"), borderRadius: 14 }} />
      <div style={{ ...abs(0, 0, 1540, 700), ...center, fontFamily: MANO, fontWeight: 700, fontSize: 190, color: "#1c2878" }}>{tx.slice(0, n)}</div>
    </Drop>
    <div style={{ ...abs(0, 900, 1920, 120), ...center, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: ORO, opacity: e(t, a + 4.8, a + 5.2), textShadow: "0 6px 24px #000" }}>I'M RIGHT HERE</div>
  </Stage>;
};

// 29:38 Tarjeta sobre la mesa: la pregunta queda escrita para que le contestes
const CommentCard: React.FC<P> = (p) => {
  const { t, a, b, src } = p;
  return <Stage t={t} a={a} b={b} src={src!} beamX={960}>
    <Drop t={t} at={a + 0.05} x={340} y={150} w={1240} h={740} from={-620} rot={-2}>
      <div style={{ ...abs(0, 0, 1240, 740), ...papel(), ...center, flexDirection: "column", borderRadius: 16, fontFamily: MANO, fontWeight: 700, color: TINTA, fontSize: 156, lineHeight: 1.04 }}>
        <div>{"Who are you".slice(0, Math.floor(e(t, a + 0.9, a + 2.0) * 11))}</div><div style={{ color: ROJO }}>{"taking care of?".slice(0, Math.floor(e(t, a + 2.0, a + 3.4) * 15))}</div>
      </div>
    </Drop>
  </Stage>;
};

export const MAP2: Record<string, React.FC<P>> = { TwoCandles, Loupe, Vault, Bulbs14, Valves, Record, YardRule, FamTree, ShoeBox3D, WaxSeal, Ransom, Sluice, NameTag, Locket, FlipCards, FloorPlan, Candle4, Rolodex, VisitTally, Moons5, Clothesline, WallMama, NightLamp, InkAqui, CommentCard };
