// cuca29e · ARROZ · 25 componentes únicos (1 por truco) + errores / rutina / preguntas / nunca / repaso. Ninguno se repite en la tanda.
import React from "react";
import { BR, cl, DIM, eio, Flame, H, HAND, Head, lerp, MZ, Olla, phys, Photo, RED, rnd, Stage, Tag, TIN, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const im = (h: H, i: number) => h.imgs?.[i];
// grano de arroz: elipse alargada; vid = 1 transparente (crudo) → 0 perla; dor = dorado; col para el rojo
const Grano: React.FC<{ x: number; y: number; s?: number; r?: number; vid?: number; dor?: number; col?: string; o?: number }> = ({ x, y, s = 1, r = 0, vid = 0, dor = 0, col, o = 1 }) => (
  <div style={{ position: "absolute", left: x - 9 * s, top: y - 26 * s, width: 18 * s, height: 52 * s, borderRadius: "50%", transform: `rotate(${r}deg)`, opacity: o,
    background: col ?? `radial-gradient(ellipse at 35% 30%,rgba(255,255,255,${0.9 - vid * 0.5}),rgba(${lerp(244, 214, dor)},${lerp(240, 168, dor)},${lerp(228, 90, dor)},${1 - vid * 0.65}) 70%)`,
    border: vid > 0.3 ? `1px solid rgba(255,255,255,${vid * 0.6})` : "none", boxShadow: `0 ${3 * s}px ${4 * s}px rgba(0,0,0,.35)` }} />
);
const Cazuela: React.FC<{ x: number; y: number; w?: number; hh?: number; children?: React.ReactNode }> = ({ x, y, w = 760, hh = 360, children }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: hh, borderRadius: `20px 20px ${w / 2}px ${w / 2}px / 20px 20px ${hh * 0.9}px ${hh * 0.9}px`, background: "linear-gradient(90deg,#6a3018,#b0582c 45%,#5a2610)", boxShadow: "0 50px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 24, right: 24, top: 24, bottom: 24, borderRadius: "inherit", background: "#2a120a", overflow: "hidden" }}>{children}</div>
  </div>
);

// 1 · REGLA: grano largo, medio y corto acostados sobre una regla de madera, cada uno con su arroz
const HRegla: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const G = [["LARGO", 3.2, "rojo · blanco · verde", MZ], ["MEDIO", 2.3, "con leche", TX], ["CORTO", 1.6, "con leche", TX]] as const;
  return <>
    <Head tt={tt} kick="TRUCO 1" title="EL GRANO CORRECTO PARA CADA ARROZ" />
    <div style={{ position: "absolute", left: 260, top: 760, width: 1400, height: 110, background: "linear-gradient(180deg,#e2c08a,#b8905a)", borderRadius: 8, boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 57 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 24, top: 0, width: 3, height: i % 10 ? (i % 5 ? 22 : 36) : 50, background: "#4a3018" }} />)}
    </div>
    {G.map(([n, s, uso, c], i) => { const k = cl(phys(tt, 0.5 + i * 0.6, 7, 0.5)), x = 460 + i * 500;
      return <React.Fragment key={n}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - k) * -500}px)` }}><Grano x={x} y={640} s={s} r={90} /></div>
        <div style={{ position: "absolute", left: x - 200, width: 400, top: 380, textAlign: "center", opacity: cl(k * 2) }}>
          <div style={{ fontWeight: 900, fontSize: 50, color: c }}>{n}</div>
          <div style={{ fontFamily: HAND, fontSize: 40, color: TX }}>{uso}</div>
        </div>
      </React.Fragment>; })}
    <Tag tt={tt} at={3.4} x={960} y={960} txt="EL LARGO QUEDA SUELTO, CADA GRANO POR SU LADO" col={TX} size={32} />
  </>;
}}</Stage>;

// 2 · COLADOR BAJO EL CHORRO: la nube blanca de almidón se va con el agua hasta que sale clara
const HLavado: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#0f1418">{(tt) => {
  const clar = eio(tt, 0.8, 4.0);
  return <>
    <Head tt={tt} kick="TRUCO 2" title="SE LAVA HASTA QUE EL AGUA SALGA CLARA" />
    <div style={{ position: "absolute", left: 930, top: 200, width: 60, height: 330, background: "linear-gradient(90deg,rgba(170,210,240,.3),rgba(220,240,255,.8),rgba(170,210,240,.3))", borderRadius: 30 }} />
    <div style={{ position: "absolute", left: 660, top: 480, width: 600, height: 300, borderRadius: "0 0 300px 300px", background: "repeating-radial-gradient(circle at 50% 0,#9aa0a8 0 3px,#3a3e44 3px 9px)", boxShadow: "0 40px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {Array.from({ length: 70 }, (_, i) => <Grano key={i} x={60 + rnd(i) * 480} y={60 + rnd(i + 2) * 200 + 6 * Math.sin(tt * 6 + i)} r={rnd(i + 1) * 180} s={0.8} />)}
    </div>
    {Array.from({ length: 30 }, (_, i) => { const p = ((tt * 0.7 + rnd(i)) % 1); return <div key={i} style={{ position: "absolute", left: 760 + rnd(i + 3) * 400, top: 780 + p * 260, width: 70, height: 70, borderRadius: "50%", background: `radial-gradient(circle,rgba(255,255,255,${0.6 * (1 - clar)}),transparent 70%)`, filter: "blur(6px)", opacity: 1 - p }} />; })}
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1400, top: 420 + i * 170, width: 120, height: 140, borderRadius: "10px 10px 30px 30px", border: "4px solid rgba(255,255,255,.45)", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "80%", background: `rgba(255,255,255,${[0.75, 0.4, 0.08][i]})`, opacity: cl((tt - 1 - i * 1.0) * 2) }} /></div>)}
    <Tag tt={tt} at={1.2} x={420} y={600} txt="ESE POLVITO LO PEGA" col={RED} size={34} />
    <Tag tt={tt} at={4.0} x={1640} y={980} txt="CLARA = YA" col={MZ} size={36} />
  </>;
}}</Stage>;

// 3 · SECO CONTRA MOJADO: dos granos caen al aceite; el seco se fríe callado, el mojado salpica en corona
const HSeco: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a0f08">{(tt) => {
  const f = cl((tt - 0.8) / 0.5), sp = cl((tt - 1.3) / 1.2);
  return <>
    <Head tt={tt} kick="TRUCO 3" title="ESCURRIDO Y SECO, DIEZ MINUTOS" />
    {[0, 1].map((i) => { const x = i ? 1360 : 560;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 320, top: 700, width: 640, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%,#e8b04a,#8a5a14 70%)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
        <Grano x={x} y={lerp(260, 720, f * f)} s={2.4} r={70} vid={i ? 0.6 : 0} />
        {i === 1 && f >= 1 && Array.from({ length: 22 }, (_, j) => { const a = -Math.PI * (0.1 + 0.8 * rnd(j)), d = sp * (120 + rnd(j + 4) * 240); return <div key={j} style={{ position: "absolute", left: x + Math.cos(a) * d * 1.4, top: 720 + Math.sin(a) * d + sp * sp * 160, width: 14, height: 14, borderRadius: "50%", background: "#ffcf6a", opacity: 1 - sp, boxShadow: "0 0 10px #ffb03a" }} />; })}
        {i === 0 && f >= 1 && Array.from({ length: 8 }, (_, j) => <div key={j} style={{ position: "absolute", left: x - 60 + rnd(j) * 120, top: 700 - ((tt * 40 + rnd(j) * 40) % 60), width: 10, height: 10, borderRadius: 5, border: "2px solid rgba(255,230,160,.8)" }} />)}
        <div style={{ position: "absolute", left: x - 260, width: 520, top: 880, textAlign: "center", fontWeight: 900, fontSize: 40, color: i ? RED : MZ, opacity: cl((tt - 2.0) / 0.4) }}>{i ? "MOJADO: SALTA Y NO SE FRÍE" : "SECO Y OPACO: SE FRÍE"}</div>
      </React.Fragment>; })}
  </>;
}}</Stage>;

// 4 · DE VIDRIO A PERLA: los granos pasan de transparentes a blanco perla; la onda del sonido cambia de lluvia a arena
const HPerla: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1a1008">{(tt) => {
  const p = eio(tt, 0.6, 3.4), dor = eio(tt, 3.4, 4.6) * 0.35;
  return <>
    <Head tt={tt} kick="TRUCO 4" title="FRITO HASTA QUE SE PONE BLANCO PERLA" />
    {Array.from({ length: 42 }, (_, i) => <Grano key={i} x={440 + (i % 7) * 120 + (Math.floor(i / 7) % 2) * 50} y={340 + Math.floor(i / 7) * 95} s={1.4} r={60 + rnd(i) * 40} vid={1 - p} dor={dor * rnd(i + 3)} />)}
    <svg width={700} height={260} style={{ position: "absolute", left: 1220, top: 420 }}>
      <path d={Array.from({ length: 140 }, (_, i) => { const x = i * 5, a = p < 0.6 ? 18 * Math.sin(i * 0.5 + tt * 8) : 60 * (rnd(i + Math.floor(tt * 10)) - 0.5); return `${i ? "L" : "M"} ${x} ${130 + a}`; }).join(" ")} stroke={p < 0.6 ? "#8fb4d8" : MZ} strokeWidth={4} fill="none" />
    </svg>
    <div style={{ position: "absolute", left: 1220, width: 700, top: 700, textAlign: "center", fontFamily: HAND, fontSize: 60, color: p < 0.6 ? "#8fb4d8" : MZ }}>{p < 0.6 ? "suena a lluvia…" : "¡suena a arena!"}</div>
    <Tag tt={tt} at={1.0} x={760} y={980} txt="TRANSPARENTE → BLANCO PERLA" col={TX} size={34} />
  </>;
}}</Stage>;

// 5 · PROBETA: una taza de arroz y el líquido que sube hasta 2 contando jitomate + caldo juntos
const HProbeta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const j = eio(tt, 1.2, 2.2), c = eio(tt, 2.4, 3.6);
  return <>
    <Head tt={tt} kick="TRUCO 5" title="UNA DE ARROZ, DOS DE LÍQUIDO" />
    <div style={{ position: "absolute", left: 420, top: 520, width: 300, height: 360, borderRadius: "10px 10px 60px 60px", border: "6px solid rgba(255,255,255,.45)", overflow: "hidden", transform: `translateY(${(1 - cl(phys(tt, 0.3, 7, 0.5))) * 400}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "86%", background: "repeating-linear-gradient(60deg,#f6f1e4 0 6px,#e4dcc8 6px 12px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center" }} />
    </div>
    <div style={{ position: "absolute", left: 420, width: 300, top: 900, textAlign: "center", fontWeight: 900, fontSize: 40, color: TX }}>1 TAZA</div>
    <div style={{ position: "absolute", left: 1000, top: 260, width: 240, height: 640, borderRadius: "10px 10px 30px 30px", border: "6px solid rgba(255,255,255,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${j * 30}%`, background: "linear-gradient(180deg,#e0502a,#a8301a)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: `${j * 30}%`, height: `${c * 56}%`, background: "linear-gradient(180deg,#e8c070,#c8962e)" }} />
      {[1, 2].map((n) => <div key={n} style={{ position: "absolute", left: 0, width: 80, bottom: `${n * 43}%`, height: 4, background: "#fff" }} />)}
    </div>
    {[[1, "1"], [2, "2"]].map(([n, s]) => <div key={n} style={{ position: "absolute", left: 1260, top: 900 - (n as number) * 275 - 30, fontWeight: 900, fontSize: 54, color: TX }}>{s as string}</div>)}
    <Tag tt={tt} at={1.8} x={1560} y={760} txt="JITOMATE" col="#e0502a" size={34} />
    <Tag tt={tt} at={3.0} x={1560} y={520} txt="+ CALDO" col={MZ} size={34} />
    <Tag tt={tt} at={3.8} x={1560} y={380} txt="TODO JUNTO = 2" col={TX} size={40} />
  </>;
}}</Stage>;

// 6 · JITOMATE EN MITADES 3D: se abre, va a la licuadora y el colador retiene cáscara y semillas
const HJitomate: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1c0a08">{(tt) => {
  const op = eio(tt, 0.5, 1.4), go = eio(tt, 1.8, 2.8), col = eio(tt, 3.0, 4.2);
  return <>
    <Head tt={tt} kick="TRUCO 6" title="EL JITOMATE SE LICÚA Y SE CUELA" />
    {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 560 + s * 140 * op + go * 300 - 160, top: 360 + go * -40, width: 320, height: 320, transform: `perspective(1200px) rotateY(${s * 50 * op}deg) scale(${1 - go * 0.5})`, opacity: 1 - go }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: s < 0 ? "radial-gradient(circle at 35% 30%,#ff8a6a,#d0301a 60%,#801008)" : "radial-gradient(circle,#ffb09a 0 18%,#e8503a 20% 46%,#ffd0b0 48% 52%,#e8503a 54%)", clipPath: s < 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }} />
    </div>)}
    <div style={{ position: "absolute", left: 860, top: 300, width: 200, height: 420, borderRadius: "20px 20px 10px 10px", border: "6px solid rgba(255,255,255,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${go * 70}%`, background: "#d8402a", transform: `skewY(${6 * Math.sin(tt * 10) * go}deg)` }} />
    </div>
    <div style={{ position: "absolute", left: 1200, top: 620, width: 440, height: 200, borderRadius: "0 0 220px 220px", background: "repeating-radial-gradient(circle at 50% 0,#9aa0a8 0 3px,#3a3e44 3px 9px)", boxShadow: "0 30px 40px rgba(0,0,0,.6)", opacity: cl(col * 3) }}>
      {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + rnd(i) * 300, top: 30 + rnd(i + 1) * 80, width: i % 3 ? 10 : 26, height: i % 3 ? 14 : 10, borderRadius: i % 3 ? "50%" : 3, background: i % 3 ? "#f4e0a0" : "#a8201a", opacity: col }} />)}
    </div>
    <div style={{ position: "absolute", left: 1400, top: 820, width: 30, height: 200 * col, background: "linear-gradient(180deg,#e0502a,#c83a20)", borderRadius: 15 }} />
    <Tag tt={tt} at={3.6} x={1420} y={540} txt="CÁSCARA Y SEMILLA SE QUEDAN" col={MZ} size={30} />
    <Tag tt={tt} at={1.2} x={560} y={800} txt="2 JITOMATES POR TAZA" col={TX} size={32} />
  </>;
}}</Stage>;

// 7 · CHOQUE FRÍO-CALIENTE: el hervor sigue con el caldo hirviendo y se corta con el frío
const HHervor: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#140c08">{(tt) => {
  const pour = eio(tt, 0.8, 1.8);
  return <>
    <Head tt={tt} kick="TRUCO 7" title="EL CALDO ENTRA HIRVIENDO" />
    {[0, 1].map((i) => { const x = i ? 1360 : 560, cut = i ? cl((tt - 1.8) / 0.4) * (1 - eio(tt, 3.6, 5)) : 0, b = 1 - cut;
      return <React.Fragment key={i}>
        <Cazuela x={x} y={560} w={560} hh={300}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "70%", background: "linear-gradient(180deg,#d8602a,#a83a16)" }}>
            {Array.from({ length: 24 }, (_, j) => { const p = ((tt * 1.6 + rnd(j + i * 9)) % 1); return <div key={j} style={{ position: "absolute", left: `${rnd(j) * 92}%`, bottom: `${p * 90}%`, width: 16 * b, height: 16 * b, borderRadius: "50%", border: "2px solid rgba(255,220,180,.8)", opacity: b * (1 - p) }} />; })}
          </div>
        </Cazuela>
        <div style={{ position: "absolute", left: x - 280, top: 240, width: 180, height: 200, transformOrigin: "100% 100%", transform: `rotate(${60 * pour}deg)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "16px 16px 40px 40px", background: i ? "linear-gradient(90deg,#6a9ac8,#b8d8f0,#5a8ab8)" : "linear-gradient(90deg,#c84a2a,#ff8a5a,#b83a1a)" }} />
        </div>
        <div style={{ position: "absolute", left: x - 260, width: 520, top: 900, textAlign: "center", fontWeight: 900, fontSize: 38, color: i ? RED : MZ, opacity: cl((tt - 2.2) / 0.4) }}>{i ? "FRÍO: CORTA EL HERVOR" : "HIRVIENDO: SIGUE PAREJO"}</div>
      </React.Fragment>; })}
  </>;
}}</Stage>;

// 8 · OLA DEL CUCHARÓN: el cucharón levanta caldo en ola, cae la pizca de sal y se prueba
const HSal: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#16100a">{(tt) => {
  const lift = eio(tt, 0.5, 1.5), pinch = cl((tt - 1.8) / 1.0);
  return <>
    <Head tt={tt} kick="TRUCO 8" title="LA SAL SE PRUEBA EN EL CALDO" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M 300 820 ${Array.from({ length: 28 }, (_, i) => `L ${300 + i * 50} ${820 - 30 * Math.sin(i * 0.5 - tt * 3)}`).join(" ")} L 1650 1080 L 300 1080 Z`} fill="#c8862e" opacity={0.85} />
    </svg>
    <div style={{ position: "absolute", left: 760, top: lerp(780, 400, lift), width: 400, height: 60, transform: `rotate(${-10 * lift}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: -40, width: 200, height: 110, borderRadius: "0 0 100px 100px", background: "linear-gradient(180deg,#d8d8d8,#8a8a8a)", overflow: "hidden" }}><div style={{ position: "absolute", left: 10, right: 10, top: 10, height: 50, background: "#d09a3a", borderRadius: "0 0 80px 80px" }} /></div>
      <div style={{ position: "absolute", left: 190, top: -20, width: 380, height: 18, borderRadius: 9, background: "#9a9a9a", transform: "rotate(-30deg)", transformOrigin: "0 50%" }} />
    </div>
    {Array.from({ length: 26 }, (_, i) => { const p = cl(pinch * 1.4 - rnd(i) * 0.4); return <div key={i} style={{ position: "absolute", left: 850 + (rnd(i + 1) - 0.5) * 50, top: 180 + p * 220, width: 8, height: 8, background: "#fff", transform: `rotate(${rnd(i) * 90}deg)`, opacity: p > 0 && p < 1 ? 1 : 0 }} />; })}
    <div style={{ position: "absolute", left: 1260, top: 360, fontFamily: HAND, fontSize: 64, color: MZ, opacity: cl((tt - 3.0) / 0.4) }}>como sopa</div>
    <div style={{ position: "absolute", left: 1260, top: 440, fontFamily: HAND, fontSize: 64, color: MZ, opacity: cl((tt - 3.4) / 0.4) }}>bien sazonada</div>
    <Tag tt={tt} at={3.8} x={480} y={420} txt="CUBITO: YA TRAE SAL" col={RED} size={32} />
  </>;
}}</Stage>;

// 9 · LA PIEDRA EN LA TAPA: la tapa baja, una piedra de río la asienta y el vapor rebota adentro sin salir
const HTapa: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#14100c">{(tt) => {
  const lid = cl(phys(tt, 0.4, 7, 0.45)), st = cl(phys(tt, 1.4, 8, 0.4));
  return <>
    <Head tt={tt} kick="TRUCO 9" title="LA TAPA NO SE LEVANTA" />
    <Cazuela x={960} y={540} w={860} hh={420}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "60%", background: "repeating-linear-gradient(60deg,#e86a3a 0 6px,#d0582a 6px 12px)" }} />
      {Array.from({ length: 10 }, (_, i) => { const p = ((tt * 0.8 + i / 10) % 1), x = 60 + i * 74; return <div key={i} style={{ position: "absolute", left: x + 30 * Math.sin(p * 6 + i), top: 160 - 140 * Math.abs(Math.sin(p * Math.PI)), width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.5),transparent 70%)" }} />; })}
    </Cazuela>
    <div style={{ position: "absolute", left: 500, top: lerp(-120, 500, lid), width: 920, height: 70, borderRadius: "460px 460px 20px 20px / 70px 70px 20px 20px", background: "linear-gradient(180deg,#c8783a,#7a3a18)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 860, top: lerp(-300, 400, st), width: 200, height: 120, borderRadius: "50% 50% 46% 54% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#9a9a92,#4a4a44 70%)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    <Tag tt={tt} at={2.4} x={1600} y={440} txt="NI PARA VER" col={RED} size={36} />
    <Tag tt={tt} at={2.9} x={1600} y={520} txt="NI PARA OLER" col={RED} size={36} />
    <Tag tt={tt} at={3.6} x={340} y={460} txt="SE CUECE CON SU VAPOR" col={MZ} size={32} />
  </>;
}}</Stage>;

// 10 · PERILLA: la perilla de la estufa gira hasta el mínimo y la flama se encoge a una flamita azul
const HPerilla: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#0e1016">{(tt) => {
  const g = eio(tt, 0.6, 2.2), k = lerp(1, 0.18, g);
  return <>
    <Head tt={tt} kick="TRUCO 10" title="LUMBRE AL MÍNIMO, DIECIOCHO MINUTOS" />
    <div style={{ position: "absolute", left: 300, top: 360, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#f2f2f2,#9a9a9a 60%,#4a4a4a)", boxShadow: "0 40px 70px rgba(0,0,0,.7)", transform: `rotate(${-200 * g}deg)` }}>
      <div style={{ position: "absolute", left: 200, top: 30, width: 60, height: 400, borderRadius: 30, background: "linear-gradient(90deg,#bdbdbd,#fff,#bdbdbd)" }} />
      <div style={{ position: "absolute", left: 218, top: 40, width: 24, height: 60, borderRadius: 12, background: RED }} />
    </div>
    {[["ALTO", 0], ["MEDIO", -100], ["MÍN", -200]].map(([n, a]) => <div key={n as string} style={{ position: "absolute", left: 530 + 300 * Math.sin(((a as number) * Math.PI) / 180) - 60, top: 590 - 300 * Math.cos(((a as number) * Math.PI) / 180) - 20, width: 120, textAlign: "center", fontWeight: 900, fontSize: 32, color: n === "MÍN" && g > 0.9 ? MZ : DIM }}>{n as string}</div>)}
    <div style={{ position: "absolute", left: 1000, top: 700, width: 700, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse,#3a3a3a,#141414 70%)" }} />
    <Flame x={1350} y={740} k={k} tt={tt} s={3.4} />
    <div style={{ position: "absolute", left: 1150, top: 380, fontFamily: HAND, fontSize: 90, color: MZ, opacity: cl((tt - 2.6) / 0.4) }}>15 a 18 min</div>
    <Tag tt={tt} at={3.4} x={1350} y={900} txt="LA FLAMITA, APENITAS" col={TX} size={34} />
  </>;
}}</Stage>;

// 11 · CUCHARA EN HIELO: la cuchara queda presa en un bloque de hielo que se congela por capas
const HHielo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#0c1418">{(tt) => {
  const fr = eio(tt, 0.8, 2.8);
  return <>
    <Head tt={tt} kick="TRUCO 11" title="NO SE MUEVE NUNCA" />
    <div style={{ position: "absolute", left: 900, top: 240, width: 120, height: 620, transform: `rotate(${(1 - fr) * 10 * Math.sin(tt * 8)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 40, top: 0, width: 40, height: 440, borderRadius: 20, background: "linear-gradient(90deg,#8a5a2e,#c08a52,#7a4a22)" }} />
      <div style={{ position: "absolute", left: 0, top: 420, width: 120, height: 200, borderRadius: "50%", background: "linear-gradient(90deg,#8a5a2e,#c08a52,#7a4a22)" }} />
    </div>
    <div style={{ position: "absolute", left: 700, top: 980 - 620 * fr, width: 520, height: 620 * fr, background: "linear-gradient(135deg,rgba(200,235,255,.55),rgba(140,200,240,.3) 50%,rgba(220,245,255,.6))", border: "3px solid rgba(255,255,255,.6)", borderRadius: 18, boxShadow: "inset 0 0 60px rgba(255,255,255,.4)" }}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${rnd(i) * 90}%`, top: `${rnd(i + 2) * 90}%`, width: 60, height: 2, background: "rgba(255,255,255,.7)", transform: `rotate(${rnd(i) * 180}deg)` }} />)}
    </div>
    <Tag tt={tt} at={2.6} x={1520} y={480} txt="SE ROZA, SE ROMPE" col={RED} size={34} />
    <Tag tt={tt} at={3.2} x={1520} y={560} txt="Y SE BATE" col={RED} size={40} />
    <Tag tt={tt} at={3.8} x={380} y={520} txt="SÓLO SE MUEVE AL FREÍR" col={MZ} size={30} />
  </>;
}}</Stage>;

// 12 · CORTE DE LA OLLA EN LA MESA: fuera del fuego, el calor de adentro termina los granos de arriba
const HReposo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#130e0a">{(tt) => {
  const mv = eio(tt, 0.4, 1.4), ck = eio(tt, 1.8, 4.2);
  return <>
    <Head tt={tt} kick="TRUCO 12" title="DIEZ MINUTOS DE REPOSO, TAPADO" />
    <div style={{ position: "absolute", left: 200, top: 940, width: 1520, height: 40, background: "linear-gradient(180deg,#7a4e2e,#4a2c18)", borderRadius: 6 }} />
    <Flame x={600} y={960} k={0.5 * (1 - mv)} tt={tt} s={2} />
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${mv * 560}px)` }}>
      <div style={{ position: "absolute", left: 300, top: 420, width: 600, height: 520, borderRadius: "20px 20px 200px 200px", border: "16px solid #a8582a", background: "#2a120a", overflow: "hidden" }}>
        {Array.from({ length: 60 }, (_, i) => { const row = Math.floor(i / 10), top = row < 2; return <Grano key={i} x={40 + (i % 10) * 52} y={70 + row * 62} s={1.1} r={rnd(i) * 180} vid={top ? 0.8 * (1 - ck) : 0} col={top && ck < 0.5 ? undefined : "radial-gradient(ellipse at 35% 30%,#ffd0b0,#e0703a 70%)"} />; })}
        {Array.from({ length: 7 }, (_, i) => <svg key={i} width={60} height={300} style={{ position: "absolute", left: 40 + i * 80, top: 80, opacity: 0.5 * (1 - ck * 0.6) }}><path d={`M 30 290 C ${10 + 40 * Math.sin(tt * 2 + i)} 200, ${50 - 40 * Math.sin(tt * 2 + i)} 100, 30 0`} stroke="rgba(255,200,150,.8)" strokeWidth={5} fill="none" /></svg>)}
      </div>
      <div style={{ position: "absolute", left: 280, top: 390, width: 640, height: 50, borderRadius: "320px 320px 10px 10px / 50px 50px 10px 10px", background: "#b8683a" }} />
    </div>
    <div style={{ position: "absolute", left: 1580, top: 420, fontFamily: HAND, fontSize: 90, color: MZ, opacity: cl((tt - 2.0) / 0.4) }}>10 min</div>
    <Tag tt={tt} at={3.6} x={1640} y={600} txt="ARRIBA SE TERMINA" col={TX} size={30} />
  </>;
}}</Stage>;

// 13 · TENEDOR PEINANDO: el tenedor pasa de la orilla al centro y deja surcos de granos sueltos
const HTenedor: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#160c08">{(tt) => {
  const p = eio(tt, 0.6, 3.2);
  return <>
    <Head tt={tt} kick="TRUCO 13" title="SE ESPONJA CON TENEDOR" />
    <div style={{ position: "absolute", left: 460, top: 340, width: 1000, height: 620, borderRadius: "50%", background: "radial-gradient(ellipse,#e8703a,#b84a1e 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 20px #8a3a18" }}>
      {Array.from({ length: 160 }, (_, i) => { const a = rnd(i) * Math.PI * 2, r = Math.sqrt(rnd(i + 1)), x = 500 + Math.cos(a) * r * 440, y = 310 + Math.sin(a) * r * 260, combed = x < 140 + p * 760, lift = combed ? -6 - rnd(i + 2) * 10 : 0;
        return <Grano key={i} x={x + (combed ? (rnd(i + 5) - 0.5) * 16 : 0)} y={y + lift} s={0.8} r={combed ? rnd(i + 3) * 180 : 70} col="radial-gradient(ellipse at 35% 30%,#ffd8c0,#e06a36 70%)" o={combed ? 1 : 0.7} />; })}
    </div>
    <div style={{ position: "absolute", left: 560 + p * 760, top: 300, width: 80, height: 520, transform: `rotate(${-20 + 10 * Math.sin(tt * 4)}deg)` }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: i * 20, top: 300, width: 8, height: 160, borderRadius: 4, background: "linear-gradient(90deg,#9a9a9a,#eee)" }} />)}
      <div style={{ position: "absolute", left: 0, top: 260, width: 76, height: 50, borderRadius: 10, background: "#cfcfcf" }} />
      <div style={{ position: "absolute", left: 26, top: 0, width: 24, height: 270, borderRadius: 12, background: "linear-gradient(90deg,#9a9a9a,#eee)" }} />
    </div>
    <Tag tt={tt} at={3.4} x={360} y={980} txt="LA CUCHARA APLASTA" col={RED} size={32} />
    <Tag tt={tt} at={3.8} x={1560} y={980} txt="EL TENEDOR SUELTA" col={MZ} size={36} />
  </>;
}}</Stage>;

// 14 · PALETA DE PINTOR: los verdes del arroz verde se mezclan en la paleta; el cilantro entra crudo
const HPaleta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#0e140c">{(tt) => {
  const V = [["POBLANO ASADO", "#2f6a2a"], ["CILANTRO CRUDO", "#4aa83a"], ["CEBOLLA", "#e8e4cc"], ["AJO", "#f4ecd4"]] as const, mix = eio(tt, 2.6, 3.8);
  return <>
    <Head tt={tt} kick="TRUCO 14" title="ARROZ VERDE: POBLANO Y CILANTRO CRUDOS" />
    <div style={{ position: "absolute", left: 460, top: 330, width: 1000, height: 620, borderRadius: "48% 52% 44% 56% / 52% 46% 54% 48%", background: "linear-gradient(135deg,#d8b080,#b08050)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 120, top: 380, width: 110, height: 110, borderRadius: "50%", background: "#1a120a" }} />
    </div>
    {V.map(([n, c], i) => { const k = cl(phys(tt, 0.4 + i * 0.45, 8, 0.45)), x = 640 + i * 200, y = 470 + (i % 2) * 90;
      return <React.Fragment key={n}>
        <div style={{ position: "absolute", left: lerp(x, 1000, mix) - 70, top: lerp(y, 620, mix) - 50, width: 140, height: 100, borderRadius: "50% 45% 55% 50%", background: `radial-gradient(circle at 35% 30%,rgba(255,255,255,.4),${c} 60%)`, transform: `scale(${k * (1 - mix * 0.6)})` }} />
        <div style={{ position: "absolute", left: x - 100, width: 200, top: y + 70, textAlign: "center", fontWeight: 900, fontSize: 22, color: TIN, opacity: k * (1 - mix) }}>{n}</div>
      </React.Fragment>; })}
    <div style={{ position: "absolute", left: 1000 - 120, top: 620 - 90, width: 240, height: 180, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#8ad070,#3a8a2a 60%)", transform: `scale(${mix})` }} />
    <Tag tt={tt} at={3.6} x={1600} y={380} txt="COCIDO SE PONE CAFÉ" col={RED} size={30} />
  </>;
}}</Stage>;

// 15 · CEBOLLA EN CUARTOS 3D: el cuarto de cebolla y dos ajos enteros entran al caldo y salen al servir
const HCebolla: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#12100c">{(tt) => {
  const cut = eio(tt, 0.5, 1.4), drop = cl(phys(tt, 1.8, 7, 0.45)), out = eio(tt, 3.6, 4.4);
  return <>
    <Head tt={tt} kick="TRUCO 15" title="ARROZ BLANCO: CEBOLLA Y AJO ENTEROS" />
    {[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + Math.PI / 4, sel = i === 0;
      return <div key={i} style={{ position: "absolute", left: 560 + Math.cos(a) * 60 * cut + (sel ? (drop * 400 - out * 0) : 0) - 120, top: 380 + Math.sin(a) * 60 * cut + (sel ? drop * 300 - out * 420 : 0) - 120, width: 240, height: 240, borderRadius: "50%", background: "repeating-radial-gradient(circle at 50% 50%,#f6f0dc 0 14px,#e6dcbc 14px 18px)", clipPath: ["inset(0 0 50% 50%)", "inset(0 50% 50% 0)", "inset(50% 50% 0 0)", "inset(50% 0 0 50%)"][i], opacity: sel ? 1 : 1 - drop * 0.5 }} />; })}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 1000 + i * 90, top: lerp(260, 700, drop) - out * 420, width: 70, height: 90, borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#fffaf0,#e8dcc0 70%)" }} />)}
    <Cazuela x={1020} y={660} w={700} hh={320}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "70%", background: "repeating-linear-gradient(60deg,#f6f1e4 0 6px,#e4dcc8 6px 12px)" }} />
    </Cazuela>
    <Tag tt={tt} at={2.6} x={1580} y={420} txt="SIN PICAR" col={MZ} size={40} />
    <Tag tt={tt} at={4.0} x={1580} y={520} txt="AL SERVIR SE SACAN" col={TX} size={32} />
  </>;
}}</Stage>;

// 16 · DADOS EN GRILLA: zanahoria, chícharo y elote caen en cuadritos del tamaño del chícharo
const HDados: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const T = ["#f08a2a", "#6ab83a", "#f4d24a"];
  return <>
    <Head tt={tt} kick="TRUCO 16" title="LAS VERDURAS ENTRAN CRUDAS, EN CUADRITOS" />
    {Array.from({ length: 48 }, (_, i) => { const c = i % 8, r = Math.floor(i / 8), k = cl(phys(tt, 0.4 + (c + r) * 0.12, 9, 0.4)), ty = i % 3;
      return <div key={i} style={{ position: "absolute", left: 520 + c * 110, top: lerp(-100, 330 + r * 100, k), width: 70, height: 70, borderRadius: ty === 1 ? "50%" : 10, background: `radial-gradient(circle at 35% 30%,rgba(255,255,255,.5),${T[ty]} 60%)`, transform: `rotate(${(1 - k) * 200}deg) perspective(400px) rotateX(${ty === 1 ? 0 : 20}deg)`, boxShadow: "0 10px 14px rgba(0,0,0,.45)" }} />; })}
    <div style={{ position: "absolute", left: 1460, top: 400, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#bfe8a0,#6ab83a 60%)", border: `4px dashed ${MZ}` }} />
    <div style={{ position: "absolute", left: 1570, top: 410, fontFamily: HAND, fontSize: 50, color: MZ }}>= la medida</div>
    <Tag tt={tt} at={3.4} x={1620} y={640} txt="ENTRAN CON EL CALDO" col={TX} size={30} />
    <Tag tt={tt} at={3.9} x={1620} y={720} txt="COCIDAS APARTE: PAPILLA" col={RED} size={28} />
  </>;
}}</Stage>;

// 17 · LA TEJA DEL FONDO: corte de la cazuela; la capa dorada se levanta entera como una teja
const HPegadito: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1a0c06">{(tt) => {
  const up = eio(tt, 1.0, 2.8);
  return <>
    <Head tt={tt} kick="TRUCO 17" title="EL PEGADITO NO SE TIRA" />
    <div style={{ position: "absolute", left: 360, top: 400, width: 1200, height: 500, borderRadius: "10px 10px 600px 600px / 10px 10px 300px 300px", border: "20px solid #a8582a", borderTop: "none", background: "repeating-linear-gradient(60deg,#e86a3a 0 6px,#d0582a 6px 12px)", boxShadow: "0 50px 80px rgba(0,0,0,.6)", overflow: "hidden" }} />
    <div style={{ position: "absolute", left: 560, top: lerp(820, 340, up), width: 800, height: 70, borderRadius: "400px 400px 400px 400px / 50px 50px 20px 20px", background: "repeating-linear-gradient(80deg,#c87a2a 0 10px,#e0a040 10px 18px,#a85a1a 18px 24px)", transform: `rotate(${-8 * up}deg) perspective(900px) rotateX(${30 * up}deg)`, boxShadow: `0 ${30 * up}px 40px rgba(0,0,0,.6)` }} />
    {up > 0.6 && Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 600 + rnd(i) * 700, top: 330 - rnd(i + 1) * 60 * Math.abs(Math.sin(tt * 3 + i)), width: 8, height: 8, borderRadius: 4, background: "#ffe0a0", boxShadow: "0 0 10px #ffc060" }} />)}
    <Tag tt={tt} at={3.0} x={1500} y={260} txt="DORADO = ORO" col={MZ} size={40} />
    <Tag tt={tt} at={3.6} x={420} y={260} txt="NEGRO = ESE SÍ NO" col={RED} size={32} />
  </>;
}}</Stage>;

// 18 · LA TAZA SE REPARTE: la taza de arroz crecido se parte como pastel en porciones por persona
const HPorcion: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#140e0a">{(tt) => {
  const g = eio(tt, 0.5, 1.8), cut = eio(tt, 2.0, 3.2), N = 6;
  return <>
    <Head tt={tt} kick="TRUCO 18" title="MEDIA TAZA CRUDA POR PERSONA" />
    <div style={{ position: "absolute", left: 300, top: 600, width: 220, height: 220, borderRadius: "16px 16px 60px 60px", border: "5px solid rgba(255,255,255,.5)", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "86%", background: "repeating-linear-gradient(60deg,#f6f1e4 0 6px,#e4dcc8 6px 12px)" }} /></div>
    <div style={{ position: "absolute", left: 300, width: 220, top: 840, textAlign: "center", fontWeight: 900, fontSize: 32, color: TX }}>1 TAZA CRUDA</div>
    <div style={{ position: "absolute", left: 560, top: 680, fontWeight: 900, fontSize: 80, color: MZ, opacity: g }}>×3</div>
    {Array.from({ length: N }, (_, i) => { const a0 = (i / N) * 360, sep = cut * 30, mid = ((a0 + 30) * Math.PI) / 180;
      return <div key={i} style={{ position: "absolute", left: 1160 - 260 * g + Math.cos(mid - Math.PI / 2) * sep, top: 600 - 260 * g + Math.sin(mid - Math.PI / 2) * sep, width: 520 * g, height: 520 * g, borderRadius: "50%", background: `conic-gradient(from ${a0}deg,#e8703a 0 ${360 / N - 1}deg,transparent ${360 / N - 1}deg)`, filter: "drop-shadow(0 20px 20px rgba(0,0,0,.5))" }} />; })}
    <div style={{ position: "absolute", left: 1460, top: 860, fontFamily: HAND, fontSize: 56, color: MZ, opacity: cut }}>2 o 3 personas</div>
    <Tag tt={tt} at={3.6} x={760} y={420} txt="PLATO FUERTE: 3/4" col={TX} size={32} />
  </>;
}}</Stage>;

// 19 · GOTAS EN LA TAPA: el vapor sube, se pega bajo la tapa y gotea de vuelta sobre el arroz de ayer
const HGotas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#0e1216">{(tt) => {
  const sp = cl(phys(tt, 0.4, 7, 0.5));
  return <>
    <Head tt={tt} kick="TRUCO 19" title="RECALENTADO CON UN CHORRITO, Y TAPADO" />
    <div style={{ position: "absolute", left: 520, top: 760, width: 880, height: 160, borderRadius: "0 0 440px 440px / 0 0 160px 160px", background: "radial-gradient(ellipse at 50% 0,#3a3a3a,#141414 70%)" }}>
      {Array.from({ length: 60 }, (_, i) => <Grano key={i} x={120 + rnd(i) * 640} y={40 + rnd(i + 2) * 60} s={0.8} r={rnd(i + 1) * 180} col="radial-gradient(ellipse at 35% 30%,#ffd8c0,#d0602e 70%)" />)}
    </div>
    <div style={{ position: "absolute", left: 500, top: 380, width: 920, height: 80, borderRadius: "460px 460px 10px 10px / 80px 80px 10px 10px", background: "linear-gradient(180deg,rgba(200,220,235,.35),rgba(160,190,210,.55))", border: "4px solid rgba(255,255,255,.5)" }} />
    {Array.from({ length: 14 }, (_, i) => { const p = ((tt * 0.45 + rnd(i)) % 1), x = 560 + rnd(i + 3) * 800, up = p < 0.5, y = up ? lerp(740, 470, p * 2) : lerp(470, 760, (p - 0.5) * 2);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: up ? 40 : 16, height: up ? 40 : 22, borderRadius: up ? "50%" : "50% 50% 50% 50% / 60% 60% 40% 40%", background: up ? "radial-gradient(circle,rgba(255,255,255,.35),transparent 70%)" : "rgba(200,230,255,.85)" }} />; })}
    <div style={{ position: "absolute", left: 1100, top: 220, width: 160, height: 100, transform: `rotate(${30 * sp}deg)`, opacity: sp }}><div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#6a9ac8,#b8d8f0)" }} /></div>
    <Tag tt={tt} at={2.0} x={1640} y={300} txt="2 CDAS POR TAZA" col={MZ} size={34} />
    <Tag tt={tt} at={3.4} x={360} y={560} txt="5 MIN, LUMBRE BAJA" col={TX} size={32} />
  </>;
}}</Stage>;

// 20 · PUNTITOS QUE SE DUPLICAN: en el arroz tibio los bichitos se multiplican; el frasco frío los congela
const HRefri: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#0e0c10">{(tt) => {
  const n = Math.min(64, Math.floor(Math.pow(2, cl((tt - 0.5) / 2.4) * 6))), fr = eio(tt, 3.2, 4.2);
  return <>
    <Head tt={tt} kick="TRUCO 20 · DE SALUD" title="AL REFRI ANTES DE DOS HORAS" col={RED} />
    <div style={{ position: "absolute", left: 420, top: 340, width: 620, height: 560, borderRadius: 40, background: `linear-gradient(180deg,${fr > 0.5 ? "#dfeaf2" : "#3a2418"},${fr > 0.5 ? "#a8c0d0" : "#1a100a"})`, boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden", transition: "none" }}>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, height: 260, borderRadius: 30, background: "repeating-linear-gradient(60deg,#e86a3a 0 6px,#d0582a 6px 12px)" }} />
      {Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + rnd(i) * 500, top: 300 + rnd(i + 7) * 200, width: 14, height: 14, borderRadius: "50%", background: "#9cff6a", boxShadow: "0 0 10px #8aff5a", opacity: 1 - fr, transform: `scale(${1 + 0.2 * Math.sin(tt * 8 + i)})` }} />)}
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(60deg,rgba(255,255,255,${0.35 * fr}) 0 3px,transparent 3px 14px)` }} />
    </div>
    <div style={{ position: "absolute", left: 1140, top: 400, fontFamily: HAND, fontSize: 80, color: fr > 0.5 ? "#bfe0ff" : RED }}>{fr > 0.5 ? "frío: se detienen" : "tibio: se multiplican"}</div>
    <Tag tt={tt} at={3.8} x={1460} y={620} txt="3-4 DÍAS · RECALENTAR 1 SOLA VEZ" col={TX} size={30} />
    <Tag tt={tt} at={4.2} x={1460} y={700} txt="HASTA QUE SALGA VAPOR DEL CENTRO" col={TX} size={26} />
  </>;
}}</Stage>;

// 21 · BOLSITAS COMO LIBROS: las porciones aplanadas se escarchan y se paran como libros en un librero
const HBolsitas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#0c1218">{(tt) => {
  const fl = eio(tt, 0.4, 1.4);
  return <>
    <Head tt={tt} kick="TRUCO 21" title="CONGELADO EN BOLSITAS PLANAS" />
    <div style={{ position: "absolute", left: 300, top: 500, width: 420, height: lerp(260, 60, fl), borderRadius: lerp(120, 16, fl), background: "linear-gradient(180deg,rgba(255,255,255,.5),rgba(220,235,245,.3))", border: "3px solid rgba(255,255,255,.8)", overflow: "hidden" }}><div style={{ position: "absolute", inset: 10, borderRadius: "inherit", background: "repeating-linear-gradient(60deg,#e86a3a 0 6px,#d0582a 6px 12px)", opacity: 0.85 }} /></div>
    <div style={{ position: "absolute", left: 300, width: 420, top: 800, textAlign: "center", fontFamily: HAND, fontSize: 50, color: MZ, opacity: fl }}>como tortillita</div>
    <div style={{ position: "absolute", left: 920, top: 300, width: 760, height: 640, borderRadius: 20, background: "linear-gradient(180deg,#e9f1f6,#b8c8d4)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 60px rgba(120,160,200,.5)" }}>
      {Array.from({ length: 9 }, (_, i) => { const k = cl(phys(tt, 1.6 + i * 0.2, 9, 0.45)); return <div key={i} style={{ position: "absolute", left: 50 + i * 74, top: 120, width: 60, height: 460, borderRadius: 10, background: "linear-gradient(90deg,rgba(255,255,255,.6),rgba(232,106,58,.7) 30%,rgba(208,88,42,.7) 70%,rgba(255,255,255,.6))", border: "2px solid rgba(255,255,255,.8)", transformOrigin: "50% 100%", transform: `rotate(${(1 - k) * -80}deg)`, opacity: cl(k * 3) }} />; })}
    </div>
    <Tag tt={tt} at={3.8} x={1300} y={990} txt="1 MES · UNA PORCIÓN POR BOLSA" col={TX} size={32} />
  </>;
}}</Stage>;

// 22 · HUEVO EN CORTE: el huevo entero se acomoda sobre el arroz, el vapor lo cuece y se parte mostrando la yema dura
const HHuevo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#140e08">{(tt) => {
  const put = cl(phys(tt, 0.5, 7, 0.45)), cook = eio(tt, 1.4, 3.0), split = eio(tt, 3.2, 4.0);
  return <>
    <Head tt={tt} kick="TRUCO 22 · LA PREGUNTA DE LA FAMILIA" title="LOS HUEVOS COCIDOS EN EL ARROZ" />
    <Cazuela x={760} y={600} w={760} hh={340}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "68%", background: "repeating-linear-gradient(60deg,#e86a3a 0 6px,#d0582a 6px 12px)" }} />
    </Cazuela>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 560 + i * 140, top: lerp(200, 560, put) - 10 * (i % 2), width: 120, height: 150, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#fffaf0,#e8d8b8 70%)", boxShadow: "0 12px 18px rgba(0,0,0,.5)" }} />)}
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 540 + i * 80, top: 520 - ((tt * 60 + i * 30) % 160), width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)", filter: "blur(6px)", opacity: cook }} />)}
    {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 1400 - 110 + s * 70 * split, top: 380, width: 220, height: 280, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 50% 55%,#f2b42a 0 26%,#fbf7ea 28%)", clipPath: s < 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)", transform: `rotate(${s * 8 * split}deg)`, opacity: cl(split * 4), boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />)}
    <Tag tt={tt} at={1.0} x={760} y={1000} txt="A LOS 8-10 MIN, ENTEROS Y LAVADOS" col={TX} size={30} />
    <Tag tt={tt} at={3.6} x={1400} y={720} txt="DURO CON EL VAPOR" col={MZ} size={36} />
  </>;
}}</Stage>;

// 23 · REMOLINO: en el arroz con leche sí se mueve; la cuchara deja un remolino y la canela flota primero
const HRemolino: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#18120c">{(tt) => {
  const sw = tt * 1.6, can = cl(phys(tt, 0.4, 7, 0.45));
  return <>
    <Head tt={tt} kick="TRUCO 23" title="ARROZ CON LECHE: LA CANELA PRIMERO" />
    <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 680, borderRadius: "50%", background: "radial-gradient(ellipse,#fbf4e2,#e8dcc0 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 22px #7a5030" }}>
      <svg width={800} height={680} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 5 }, (_, i) => <path key={i} d={Array.from({ length: 60 }, (_, j) => { const a = j * 0.22 + sw + i * 1.2, r = 30 + j * 5; return `${j ? "L" : "M"} ${400 + Math.cos(a) * r} ${340 + Math.sin(a) * r * 0.8}`; }).join(" ")} stroke="rgba(200,170,120,.5)" strokeWidth={4} fill="none" />)}</svg>
      {Array.from({ length: 40 }, (_, i) => { const a = rnd(i) * 6.28 + sw * (0.5 + rnd(i + 1)), r = 60 + rnd(i + 2) * 240; return <Grano key={i} x={400 + Math.cos(a) * r} y={340 + Math.sin(a) * r * 0.8} s={0.9} r={(a * 180) / Math.PI} />; })}
      <div style={{ position: "absolute", left: 260, top: lerp(-300, 300, can), width: 280, height: 44, borderRadius: 20, background: "repeating-linear-gradient(90deg,#8a4a22 0 14px,#a8622e 14px 28px)", transform: `rotate(${-20 + 10 * Math.sin(tt)}deg)`, boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} />
    </div>
    <Tag tt={tt} at={2.0} x={1580} y={440} txt="GRANO CORTO, SIN FREÍR" col={TX} size={30} />
    <Tag tt={tt} at={2.8} x={1580} y={520} txt="AQUÍ SÍ SE MUEVE" col={MZ} size={36} />
  </>;
}}</Stage>;

// 24 · ETIQUETAS QUE SE BALANCEAN: la de la fonda pesa y cuelga baja; la de la casa queda arriba, ligera
const HEtiquetas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#14100c">{(tt) => {
  const E = [["6 PORCIONES EN LA FONDA", "$150", RED, 1], ["LA OLLA EN SU CASA", "$22", MZ, 0]] as const;
  return <>
    <Head tt={tt} kick="TRUCO 24" title="LA CUENTA CONTRA LA FONDA" />
    <div style={{ position: "absolute", left: 200, top: 300, width: 1520, height: 14, borderRadius: 7, background: "#6b4428" }} />
    {E.map(([lab, v, c, heavy], i) => { const at = 0.5 + i * 0.7, k = cl(phys(tt, at, 5, 0.35)), len = heavy ? 380 : 160, sw = 8 * Math.exp(-(tt - at) * 1.2) * Math.sin((tt - at) * 5) * cl(tt - at), x = 600 + i * 700;
      return <div key={i} style={{ position: "absolute", left: x, top: 307, transformOrigin: "0 0", transform: `rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: len * k, background: "#c9b48a" }} />
        <div style={{ position: "absolute", left: -180, top: len * k, width: 360, height: 220, background: "#f4ead2", borderRadius: "20px 20px 20px 20px", boxShadow: "0 30px 40px rgba(0,0,0,.6)", clipPath: "polygon(16% 0,84% 0,100% 18%,100% 100%,0 100%,0 18%)", opacity: cl(k * 2) }}>
          <div style={{ position: "absolute", left: 160, top: 14, width: 40, height: 40, borderRadius: "50%", background: "#14100c" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontWeight: 900, fontSize: 70, color: c }}>{v}</div>
          <div style={{ position: "absolute", left: 10, right: 10, top: 160, textAlign: "center", fontWeight: 800, fontSize: 24, color: TIN }}>{lab}</div>
        </div>
      </div>; })}
    <div style={{ position: "absolute", left: 1500, top: 700, fontFamily: HAND, fontSize: 72, color: MZ, opacity: cl((tt - 2.8) / 0.4) }}>+$1,500 al mes</div>
    <Tag tt={tt} at={3.4} x={1640} y={820} txt="ARROZ 3 VECES POR SEMANA" col={TX} size={28} />
  </>;
}}</Stage>;

// 25 · FLOR DE AJO: el diente de ajo en medio del arroz se dora color miel y abre como flor: ahí entra el jitomate
const HAjoFlor: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a1006">{(tt) => {
  const d = eio(tt, 0.6, 2.6), op = eio(tt, 2.6, 3.8), j = cl((tt - 3.8) / 0.6);
  return <>
    <Head tt={tt} kick="TRUCO 25 · EL SECRETO" title="EL AJO QUE AVISA" col={MZ} />
    {Array.from({ length: 70 }, (_, i) => { const a = rnd(i) * 6.28, r = 180 + rnd(i + 1) * 300; return <Grano key={i} x={960 + Math.cos(a) * r} y={620 + Math.sin(a) * r * 0.55} s={1.1} r={rnd(i + 2) * 180} dor={0.2} />; })}
    {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * 360; return <div key={i} style={{ position: "absolute", left: 960 - 60, top: 620 - 150, width: 120, height: 150, transformOrigin: "50% 100%", transform: `rotate(${a * op}deg) translateY(${-20 * op}px)`, borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%", background: `radial-gradient(circle at 40% 30%,rgb(${lerp(255, 250, d)},${lerp(250, 196, d)},${lerp(236, 90, d)}),rgb(${lerp(232, 200, d)},${lerp(220, 130, d)},${lerp(190, 40, d)}) 70%)`, boxShadow: `0 0 ${40 * op}px rgba(255,190,80,${0.6 * op})` }} />; })}
    <div style={{ position: "absolute", left: 1320, top: 380, fontFamily: HAND, fontSize: 80, color: MZ, opacity: cl((tt - 2.2) / 0.4) }}>color de miel</div>
    <div style={{ position: "absolute", left: 1320, top: 480, fontWeight: 900, fontSize: 40, color: TX, opacity: j }}>= AHORA EL JITOMATE</div>
    <Tag tt={tt} at={1.2} x={420} y={420} txt="UN DIENTE ENTERO, PELADO" col={TX} size={30} />
  </>;
}}</Stage>;

// A · OLLAS QUE SE APAGAN: cinco ollas destapadas en fila con su foto; al nombrar cada error su lumbre se apaga
const HOllasError: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c0a08">{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="LOS 5 ERRORES" title="QUE DEJAN EL ARROZ BATIDO" col={RED} />
    {E.map((e, i) => { const x = 240 + i * 360, k = cl(phys(t, e.a, 7, 0.5)), off = cl((t - e.a - 0.4) / 0.6);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 150, top: 300, width: 300, opacity: cl(k * 2), transform: `translateY(${(1 - k) * 200}px)` }}>
          <Photo id={im(h, i)} w={300} h={200} r={16} dim={off * 0.35} />
          <div style={{ marginTop: 14, textAlign: "center", fontWeight: 900, fontSize: 26, color: TX, minHeight: 64 }}><span style={{ color: RED, fontSize: 40 }}>{i + 1}</span> {e.tx}</div>
        </div>
        <div style={{ position: "absolute", left: x - 130, top: 680, width: 260, height: 150, borderRadius: "10px 10px 130px 130px / 10px 10px 120px 120px", background: "linear-gradient(90deg,#6a3018,#b0582c 45%,#5a2610)", boxShadow: "0 30px 40px rgba(0,0,0,.6)", opacity: cl(k * 2) }} />
        <Flame x={x} y={880} k={0.6 * (1 - off) * cl(k * 2)} tt={tt} s={1.4} />
        {off > 0.2 && <div style={{ position: "absolute", left: x - 30, top: 820 - 80 * off, width: 60, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(160,160,160,.35),transparent 70%)", filter: "blur(6px)", opacity: 1 - off * 0.6 }} />}
      </React.Fragment>; })}
  </>;
}}</Stage>;

// B · VÍA DE TREN: un trenecito recorre la vía y cada estación se enciende con su paso
const HTren: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#10100c">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), -1), pos = S.reduce((p, e, i) => p + eio(t, e.a - 0.3, e.a + 0.5) * (i ? 1 : 0), 0);
  const X = (i: number) => 160 + i * (1600 / Math.max(1, S.length - 1)), Y = (i: number) => 760 + 60 * Math.sin(i * 0.9);
  const tx = X(0) + pos * (1600 / Math.max(1, S.length - 1)), ty = 760 + 60 * Math.sin(pos * 0.9);
  return <>
    <Head tt={tt} kick="LA RUTINA COMPLETA" title="DEL COLADOR AL TENEDOR" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={S.map((_, i) => `${i ? "L" : "M"} ${X(i)} ${Y(i) + 40}`).join(" ")} stroke="#6b4428" strokeWidth={24} fill="none" />
      <path d={S.map((_, i) => `${i ? "L" : "M"} ${X(i)} ${Y(i) + 40}`).join(" ")} stroke="#c9c9c9" strokeWidth={4} fill="none" strokeDasharray="30 14" />
    </svg>
    {S.map((s, i) => { const on = i <= cur, k = cl(phys(t, s.a, 8, 0.45));
      return <div key={i} style={{ position: "absolute", left: X(i) - 70, top: Y(i) - 230, width: 140, opacity: on ? 1 : 0.45 }}>
        <div style={{ width: 140, height: 140, borderRadius: 16, overflow: "hidden", border: `5px solid ${on ? MZ : "#4a3a2a"}`, boxShadow: on ? `0 0 ${30 * k}px rgba(255,200,90,.7)` : "none" }}><Photo id={im(h, i)} w={130} h={130} r={10} dim={on ? 0 : 0.6} /></div>
        <div style={{ marginTop: 6, textAlign: "center", fontWeight: 900, fontSize: 30, color: on ? MZ : DIM }}>{i + 1}</div>
      </div>; })}
    <div style={{ position: "absolute", left: tx - 60, top: ty - 10, width: 120, height: 60, borderRadius: "16px 30px 10px 10px", background: "linear-gradient(180deg,#d0402a,#8a2010)", boxShadow: "0 12px 18px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 76, top: -40, width: 24, height: 44, background: "#2a2420", borderRadius: 4 }} />
      {[16, 80].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 46, width: 28, height: 28, borderRadius: "50%", background: "#2a2420", transform: `rotate(${tt * 300}deg)`, border: "4px solid #8a8a8a" }} />)}
    </div>
    <div style={{ position: "absolute", left: 360, width: 1200, top: 310, textAlign: "center", fontFamily: HAND, fontSize: 64, color: MZ }}>{cur >= 0 ? `${cur + 1}. ${S[cur].tx}` : ""}</div>
  </>;
}}</Stage>;

// C · PREGUNTAS: cinco notitas pegadas en el refri con imán; la que se contesta se despega, gira y muestra la respuesta
const HNotas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#10141a">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), -1);
  return <>
    <Head tt={tt} kick="ME PREGUNTAN" title="Y AQUÍ LE CONTESTO" />
    <div style={{ position: "absolute", left: 200, top: 280, width: 1520, height: 720, borderRadius: 30, background: "linear-gradient(90deg,#d8dde2,#f4f6f8 50%,#c8cdd2)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
    {S.map((s, i) => { const [q, r] = s.tx.split("|"), act = i === cur, k = cl(phys(t, s.a - 0.2, 6, 0.5)), fl = act ? eio(t, s.a + 0.6, s.a + 1.4) : t > s.a ? 1 : 0, done = i < cur;
      const x = act ? lerp(260 + i * 290, 960 - 260, k) : 260 + i * 290, y = act ? lerp(360, 380, k) : 360 + (i % 2) * 40, sc = act ? lerp(1, 1.9, k) : 1;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 260, height: 260, transformOrigin: "0 0", transform: `scale(${sc}) rotate(${act ? 0 : (i - 2) * 3}deg)`, zIndex: act ? 5 : 1, opacity: done ? 0.35 : 1 }}>
        <div style={{ position: "absolute", inset: 0, background: ["#fff3a0", "#ffd0e0", "#c8f0d0", "#d0e4ff", "#ffe0b8"][i % 5], boxShadow: "0 16px 24px rgba(0,0,0,.4)", transform: `perspective(1000px) rotateY(${180 * fl}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, padding: 20, fontWeight: 800, fontSize: 26, color: "#2a2420", backfaceVisibility: "hidden" }}>{q}</div>
          <div style={{ position: "absolute", inset: 0, padding: 20, fontFamily: HAND, fontSize: 34, color: VER, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>{r}</div>
        </div>
        <div style={{ position: "absolute", left: 110, top: -16, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a6a,#b0201a)" }} />
      </div>; })}
  </>;
}}</Stage>;

// D · NUNCA: seis frascos en la alacena; al nombrarse, cada tapa se enrosca y la etiqueta dice NUNCA
const HFrascos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#160c08">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="LO QUE MI ABUELA" title="NUNCA HACÍA CON EL ARROZ" col={RED} />
    {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 220, top: 600 + r * 330, width: 1480, height: 26, background: "linear-gradient(180deg,#8a5a2e,#5a3418)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />)}
    {S.map((s, i) => { const r = Math.floor(i / 3), c = i % 3, x = 380 + c * 520, y = 600 + r * 330, k = cl(phys(t, s.a, 7, 0.45)), lid = eio(t, s.a + 0.4, s.a + 1.2);
      return <div key={i} style={{ position: "absolute", left: x - 140, top: y - 280, width: 280, height: 280, opacity: cl(k * 2), transform: `translateY(${(1 - k) * -300}px)` }}>
        <div style={{ position: "absolute", left: 20, top: 40, width: 240, height: 240, borderRadius: "20px 20px 40px 40px", background: "linear-gradient(90deg,rgba(255,255,255,.12),rgba(255,255,255,.3) 30%,rgba(255,255,255,.08))", border: "4px solid rgba(255,255,255,.45)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 10, top: 10 }}><Photo id={im(h, i)} w={212} h={212} r={16} dim={0.1} /></div>
          <div style={{ position: "absolute", left: 10, right: 10, bottom: 14, padding: 6, background: "#f4ead2", textAlign: "center", fontWeight: 800, fontSize: 20, color: TIN }}>{s.tx}</div>
        </div>
        <div style={{ position: "absolute", left: 30, top: lerp(-60, 20, lid), width: 220, height: 40, borderRadius: 10, background: "repeating-linear-gradient(90deg,#c0302a 0 10px,#e04a3a 10px 20px)", transform: `rotate(${(1 - lid) * 30}deg)` }} />
        <div style={{ position: "absolute", left: 60, top: 110, padding: "4px 14px", border: `5px solid ${RED}`, borderRadius: 8, color: RED, fontWeight: 900, fontSize: 40, transform: `rotate(-12deg) scale(${lerp(2, 1, lid)})`, opacity: lid, background: "rgba(255,245,230,.85)" }}>NUNCA</div>
      </div>; })}
  </>;
}}</Stage>;

// E · REPASO: rueda de la fortuna con 24 canastillas; la que se nombra llega arriba y se enciende
const HRueda: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#0e0c14">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), -1), N = Math.max(1, S.length);
  const target = cur < 0 ? 0 : cur + eio(t, S[cur].a - 0.2, S[cur].a + 0.4) - 1, rot = -(Math.max(0, target) / N) * 360;
  return <>
    <Head tt={tt} kick="REPASO RÁPIDO" title="LA RUEDA DEL ARROZ" />
    <div style={{ position: "absolute", left: 960 - 6, top: 600, width: 12, height: 420, background: "#5a5a6a", transform: "rotate(18deg)", transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 960 - 6, top: 600, width: 12, height: 420, background: "#5a5a6a", transform: "rotate(-18deg)", transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 960 - 360, top: 600 - 360, width: 720, height: 720, borderRadius: "50%", border: "8px solid #8a8aa0", transform: `rotate(${rot}deg)` }}>
      {Array.from({ length: N }, (_, i) => <div key={i} style={{ position: "absolute", left: 356, top: 0, width: 4, height: 360, background: "rgba(160,160,180,.5)", transformOrigin: "2px 360px", transform: `rotate(${(i / N) * 360}deg)` }} />)}
    </div>
    {S.map((s, i) => { const a = ((i / N) * 360 + rot - 90) * (Math.PI / 180), x = 960 + Math.cos(a) * 360, y = 600 + Math.sin(a) * 360, on = t >= s.a, act = i === cur;
      return <div key={i} style={{ position: "absolute", left: x - 34, top: y - 10, width: 68, height: 56, borderRadius: "8px 8px 24px 24px", background: on ? "linear-gradient(180deg,#ffe08a,#e0902e)" : "linear-gradient(180deg,#6a6a80,#3a3a4a)", boxShadow: on ? "0 0 24px rgba(255,200,90,.8)" : "0 6px 10px rgba(0,0,0,.6)", transform: `scale(${act ? 1.5 : 1})`, zIndex: act ? 3 : 1 }}>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 24, color: on ? TIN : "#c8c8d8", marginTop: 12 }}>{i + 1}</div>
      </div>; })}
    <div style={{ position: "absolute", left: 960 - 80, top: 600 - 80, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,#2a2a3a,#14141c)", border: "6px solid #8a8aa0" }} />
    <div style={{ position: "absolute", left: 1360, width: 520, top: 480, textAlign: "center", fontFamily: HAND, fontSize: 60, color: MZ }}>{cur >= 0 ? S[cur].tx : ""}</div>
  </>;
}}</Stage>;

export const MAP: Record<string, C> = { regla: HRegla, lavado: HLavado, seco: HSeco, perla: HPerla, probeta: HProbeta, jitomate: HJitomate, hervor: HHervor, sal: HSal,
  tapa: HTapa, perilla: HPerilla, hielo: HHielo, reposo: HReposo, tenedor: HTenedor, paleta: HPaleta, cebolla: HCebolla, dados: HDados, pegadito: HPegadito,
  porcion: HPorcion, gotas: HGotas, refri: HRefri, bolsitas: HBolsitas, huevo: HHuevo, remolino: HRemolino, etiquetas: HEtiquetas, ajoflor: HAjoFlor,
  ollaserror: HOllasError, tren: HTren, notas: HNotas, frascos: HFrascos, rueda: HRueda };

import { MAP3 } from "./heroes3d";
Object.assign(MAP, MAP3);

// ── reemplazos por TOPE DEL EVALUADOR (30-oct): los componentes que no pasaron de 6 van como clip(s) Veo de 8 s (manos de Cuca);
//    los largos (ollaserror, tren) reparten su tramo entre h_<k>_1..n
import { OffthreadVideo, Sequence, staticFile } from "remotion";
const CLIP_H: Record<string, number> = {};   // k → nº de clips; se llena a medida que llegan los h_<k>*.mp4 a public
const HClip: C = ({ t, h }) => {
  const n = CLIP_H[h.k] ?? 1, seg = (h.out - h.at) / n, i = Math.min(n - 1, Math.max(0, Math.floor((t - h.at) / seg)));
  const o = Math.min(1, (t - h.at + 0.05) / 0.3, (h.out + 0.85 - t) / 0.3);
  return <div style={{ position: "absolute", inset: 0, opacity: Math.max(0, o) }}><Sequence key={i} from={Math.round((h.at - 0.05 + i * seg) * 30)} layout="none"><OffthreadVideo src={staticFile(`cuca29e/${n > 1 ? `h_${h.k}_${i + 1}` : "h_" + h.k}.mp4`)} muted playbackRate={Math.min(1, 7.9 / (seg + 0.9))} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence></div>; };
for (const k of Object.keys(CLIP_H)) MAP[k] = HClip;
