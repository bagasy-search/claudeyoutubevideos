// cuca29d · TAMALES · 25 componentes únicos (1 por truco) + errores / rutina / nunca / preguntas / repaso. Ninguno se repite en la tanda.
import React from "react";
import { BR, cl, DIM, eio, Flame, H, HAND, Head, lerp, MZ, Olla, phys, Photo, RED, rnd, Stage, Tag, TIN, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const im = (h: H, i: number) => h.imgs?.[i];
// hoja de maíz: lanza ancha arriba, punta abajo, con nervaduras; liso = brillo, aspero = estrías marcadas
const Hoja: React.FC<{ x: number; y: number; w?: number; hh?: number; r?: number; o?: number; liso?: boolean; curva?: number; col?: string; style?: React.CSSProperties }> = ({ x, y, w = 260, hh = 460, r = 0, o = 1, liso = true, curva = 0, col = "#e3cf9a", style }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - hh / 2, width: w, height: hh, opacity: o, transform: `rotate(${r}deg) perspective(900px) rotateX(${curva}deg)`, ...style }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: `${w * 0.45}px ${w * 0.45}px 50% 50% / 18% 18% 82% 82%`, overflow: "hidden",
      background: liso ? `linear-gradient(100deg,#c9b27a,${col} 40%,#f6ead0 55%,${col} 70%,#b89c62)` : `repeating-linear-gradient(90deg,#b49a62 0 7px,#d8c18a 7px 15px)`, boxShadow: "0 22px 34px rgba(0,0,0,.5)" }}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${12 + i * 12.5}%`, top: 0, bottom: 0, width: liso ? 1 : 3, background: `rgba(90,70,30,${liso ? 0.25 : 0.55})` }} />)}
    </div>
  </div>
);
// tamal envuelto (de pie o acostado): hoja doblada con amarre
const Tamal: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; dor?: number }> = ({ x, y, s = 1, r = 0, o = 1, dor = 0 }) => (
  <div style={{ position: "absolute", left: x - 60 * s, top: y - 110 * s, width: 120 * s, height: 220 * s, opacity: o, transform: `rotate(${r}deg)` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: `${50 * s}px ${50 * s}px ${30 * s}px ${30 * s}px`, background: `linear-gradient(95deg,${dor ? "#7a4a1a" : "#bba26a"},${dor ? "#b67a32" : "#ead9a8"} 45%,${dor ? "#5a3210" : "#a88e58"})`, boxShadow: "0 14px 22px rgba(0,0,0,.5)", filter: `brightness(${1 - dor * 0.25})` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 150 * s, height: 10 * s, background: "#9a7e46", borderRadius: 5 }} />
  </div>
);
const Bean: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 0, o = 1 }) => (
  <div style={{ position: "absolute", left: x - 13, top: y - 9, width: 26, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#a8634a,#4a1e14 70%)", transform: `rotate(${r}deg)`, opacity: o, boxShadow: "0 3px 4px rgba(0,0,0,.5)" }} />
);

// 1 · SACOS: el de masa martajada (grano quebrado) frente al de harina (polvo fino que se levanta)
const HSacos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = cl(phys(tt, 0.4, 6, 0.5)), b = cl(phys(tt, 1.0, 6, 0.5)), puff = eio(tt, 2.2, 4.2);
  const Saco = ({ x, k, n, sub, from }: { x: number; k: number; n: string; sub: string; from: number }) => <div style={{ position: "absolute", left: x, top: 330, width: 460, height: 560, transform: `translateX(${(1 - k) * from}px) rotate(${(1 - k) * (from > 0 ? 8 : -8)}deg)` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "60px 60px 40px 40px", background: "repeating-linear-gradient(45deg,#c7ab78 0 6px,#b59a68 6px 12px)", boxShadow: "0 50px 70px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: -40, height: 90, borderRadius: "50%", background: "#a88a56" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontWeight: 900, fontSize: 48, color: TIN }}>{n}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontFamily: HAND, fontSize: 40, color: "#5a3a1a" }}>{sub}</div>
  </div>;
  return <>
    <Head tt={tt} kick="TRUCO 1" title="MASA DE MOLINO, O HARINA" />
    <Saco x={300} k={a} n="MOLINO" sub="martajada" from={-900} />
    <Saco x={1160} k={b} n="HARINA" sub="para tamal" from={900} />
    {Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: 400 + rnd(i) * 260, top: 300 - rnd(i + 4) * 120 * a, width: 10 + rnd(i + 1) * 12, height: 8 + rnd(i + 2) * 8, borderRadius: 3, background: "#e8d39a", transform: `rotate(${rnd(i) * 90}deg)`, opacity: a }} />)}
    {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1390 + (rnd(i) - 0.5) * 420 * puff, top: 300 - rnd(i + 3) * 260 * puff, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle,rgba(250,246,236,.55),transparent 70%)", opacity: (1 - puff) * cl(puff * 6) }} />)}
    <Tag tt={tt} at={2.8} x={530} y={960} txt="GRANITO: MÁS SABOR" col={MZ} size={34} />
    <Tag tt={tt} at={3.4} x={1390} y={960} txt="HARINA PARA TAMAL: TAMBIÉN SIRVE" col={TX} size={32} />
  </>;
}}</Stage>;

// 2 · BATIDO EN CORTE: la manteca amarilla se llena de burbujas de aire y se pone blanca
const HBatido: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1b130c">{(tt) => {
  const w = eio(tt, 0.4, 4.4), ang = tt * 420;
  return <>
    <Head tt={tt} kick="TRUCO 2" title="LA MANTECA SE BATE SOLA PRIMERO" />
    <div style={{ position: "absolute", left: 460, top: 420, width: 1000, height: 520, borderRadius: "0 0 500px 500px", background: "linear-gradient(90deg,#5e3a22,#8a5a34 50%,#4a2c18)", boxShadow: "0 60px 90px rgba(0,0,0,.65)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 60, bottom: 30, borderRadius: "0 0 470px 470px", background: `rgb(${lerp(236, 250, w)},${lerp(214, 247, w)},${lerp(150, 238, w)})` }}>
        {Array.from({ length: 70 }, (_, i) => { const on = rnd(i) < w; return <div key={i} style={{ position: "absolute", left: `${6 + rnd(i + 1) * 88}%`, top: `${8 + rnd(i + 2) * 70}%`, width: 10 + rnd(i + 3) * 26, height: 10 + rnd(i + 3) * 26, borderRadius: "50%", border: "2px solid rgba(200,180,140,.6)", background: "radial-gradient(circle at 30% 30%,rgba(255,255,255,.9),rgba(255,255,255,.1))", transform: `scale(${on ? 1 : 0})` }} />; })}
      </div>
    </div>
    <div style={{ position: "absolute", left: 930, top: 160, width: 60, height: 520, transformOrigin: "50% 100%", transform: `rotate(${12 * Math.sin(ang / 57)}deg)` }}>
      <div style={{ position: "absolute", left: 22, top: 0, width: 16, height: 300, background: "#8a6a3a", borderRadius: 8 }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 30 - 60 * Math.abs(Math.cos((ang + i * 45) / 57)), top: 300, width: 120 * Math.abs(Math.cos((ang + i * 45) / 57)), height: 220, borderRadius: "50%", border: "5px solid #c9c9c9" }} />)}
    </div>
    <Tag tt={tt} at={1.2} x={330} y={560} txt="AMARILLA" col={BR} size={36} />
    <Tag tt={tt} at={4.0} x={1600} y={560} txt="BLANCA = AIRE" col={MZ} size={40} />
  </>;
}}</Stage>;

// 3 · FLOTACIÓN: la bolita cae al vaso, baja y vuelve a subir con la flecha de empuje
const HFlota: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fall = cl((tt - 0.6) / 0.5), up = eio(tt, 1.6, 3.4), y = tt < 1.1 ? lerp(220, 640, fall * fall) : lerp(640 + 160 * Math.exp(-(tt - 1.1) * 3) * Math.sin((tt - 1.1) * 4), 470, up);
  return <>
    <Head tt={tt} kick="TRUCO 3" title="LA BOLITA QUE FLOTA" />
    <div style={{ position: "absolute", left: 760, top: 400, width: 400, height: 580, borderRadius: "16px 16px 60px 60px", border: "6px solid rgba(255,255,255,.45)", background: "linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.18) 30%,rgba(255,255,255,.04))", boxShadow: "0 50px 70px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70 + 6 * Math.sin(tt * 3), bottom: 0, background: "linear-gradient(180deg,rgba(150,200,230,.35),rgba(80,130,170,.45))" }} />
      {tt > 1.1 && Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + (rnd(i) - 0.5) * 120, top: 500 - ((tt - 1.1) * 140 + rnd(i) * 300) % 430, width: 10, height: 10, borderRadius: 5, border: "2px solid rgba(255,255,255,.7)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 960 - 55, top: y - 55, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff8e0,#e8d090 60%,#b8a060)", boxShadow: "0 12px 20px rgba(0,0,0,.4)" }} />
    <svg width={200} height={300} style={{ position: "absolute", left: 1200, top: 420, opacity: up }}><path d={`M 100 ${280} L 100 ${280 - 220 * up}`} stroke={MZ} strokeWidth={16} strokeLinecap="round" /><path d={`M 60 ${110 + 220 * (1 - up)} L 100 ${60 + 220 * (1 - up)} L 140 ${110 + 220 * (1 - up)}`} stroke={MZ} strokeWidth={16} fill="none" strokeLinecap="round" /></svg>
    <Tag tt={tt} at={3.0} x={1300} y={300} txt="FLOTA = YA ESTÁ" col={MZ} size={42} />
    <Tag tt={tt} at={3.6} x={540} y={900} txt="SE HUNDE = BATA MÁS" col={RED} size={34} />
  </>;
}}</Stage>;

// 4 · JARRAS EN FILA: cuatro de masa y una de manteca se llenan como en el molino
const HJarras: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  return <>
    <Head tt={tt} kick="TRUCO 4" title="UN KILO DE MASA, UN CUARTO DE MANTECA" />
    {[0, 1, 2, 3, 4].map((i) => { const at = 0.6 + i * 0.6, f = eio(tt, at, at + 0.9), man = i === 4, k = cl(phys(tt, at - 0.4, 7, 0.5));
      return <div key={i} style={{ position: "absolute", left: 260 + i * 300 + (man ? 60 : 0), top: 420, width: 240, height: 420, transform: `translateY(${(1 - k) * 300}px)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 60px 60px", border: "5px solid rgba(255,255,255,.4)", background: "rgba(255,255,255,.05)", overflow: "hidden", boxShadow: "0 40px 60px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${f * 86}%`, background: man ? "linear-gradient(180deg,#fbf6ea,#e9dcc0)" : "linear-gradient(180deg,#f1dc9a,#d8b870)" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontWeight: 900, fontSize: 32, color: man ? MZ : TX }}>{man ? "MANTECA" : "MASA"}</div>
      </div>; })}
    <div style={{ position: "absolute", left: 1460, top: 300, fontFamily: HAND, fontSize: 110, color: MZ, opacity: cl((tt - 3.6) / 0.4) }}>4 : 1</div>
    <Tag tt={tt} at={4.0} x={760} y={980} txt="1 KG DE MASA · 250 G DE MANTECA" col={TX} size={36} />
  </>;
}}</Stage>;

// 5 · TERMÓMETRO DE MERCURIO: sube, se pasa un poco al rojo y vuelve a frenar en TIBIO
const HTermo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#14181c">{(tt) => {
  const lv = tt < 2.4 ? eio(tt, 0.5, 2.4) * 0.82 : lerp(0.82, 0.5, eio(tt, 2.6, 3.6)), tib = cl((tt - 3.6) / 0.4);
  return <>
    <Head tt={tt} kick="TRUCO 5" title="EL CALDO, TIBIO" />
    <div style={{ position: "absolute", left: 900, top: 260, width: 120, height: 640, borderRadius: 60, background: "linear-gradient(90deg,rgba(255,255,255,.12),rgba(255,255,255,.35) 40%,rgba(255,255,255,.1))", border: "4px solid rgba(255,255,255,.5)" }}>
      <div style={{ position: "absolute", left: 38, width: 44, bottom: 20, height: `${12 + lv * 80}%`, borderRadius: 22, background: "linear-gradient(90deg,#9a1c14,#e0402a,#9a1c14)" }} />
    </div>
    <div style={{ position: "absolute", left: 870, top: 860, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a6a,#b0201a 60%,#600c08)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    {[["HIRVIENDO", 0.82, RED], ["TIBIO", 0.5, MZ], ["FRÍO", 0.18, "#8fb4d8"]].map(([n, v, c]) => <div key={n as string} style={{ position: "absolute", left: 1060, top: 880 - 20 - (v as number) * 512 - 22, fontWeight: 900, fontSize: n === "TIBIO" ? 60 : 40, color: c as string, opacity: n === "TIBIO" ? 0.4 + 0.6 * tib : 0.7 }}>— {n as string}</div>)}
    <svg width={400} height={140} style={{ position: "absolute", left: 1060, top: 880 - 0.82 * 512 - 100, opacity: cl((tt - 2.8) / 0.3) }}><path d="M 20 80 L 340 80" stroke={RED} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl((tt - 2.8) / 0.5)} 1`} /></svg>
    <Tag tt={tt} at={3.8} x={480} y={560} txt="COMO AGUA DE BAÑAR A UN BEBÉ" col={TX} size={34} hand />
  </>;
}}</Stage>;

// 6 · LLUVIA LENTA: la cucharita se inclina y el polvo cae en cámara lenta, partícula por partícula
const HPolvo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const tilt = eio(tt, 0.6, 1.6), slow = tt * 0.35;
  return <>
    <Head tt={tt} kick="TRUCO 6" title="EL POLVO DE HORNEAR, APENAS" />
    <div style={{ position: "absolute", left: 760, top: 300, width: 420, height: 60, transformOrigin: "100% 50%", transform: `rotate(${-38 * tilt}deg)` }}>
      <div style={{ position: "absolute", right: 0, top: 22, width: 300, height: 18, borderRadius: 9, background: "linear-gradient(180deg,#e8e8e8,#9a9a9a)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 140, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#fff,#bdbdbd 60%,#7a7a7a)" }} />
    </div>
    {Array.from({ length: 90 }, (_, i) => { const st = 1.4 + rnd(i) * 2.4, p = cl((tt - st) * 0.5); return <div key={i} style={{ position: "absolute", left: 780 + (rnd(i + 1) - 0.5) * 80 + p * (rnd(i + 2) - 0.5) * 140, top: 400 + p * 460, width: 5 + rnd(i) * 6, height: 5 + rnd(i) * 6, borderRadius: "50%", background: "#fbfbf6", opacity: p > 0 && p < 1 ? 0.9 : 0, boxShadow: "0 0 6px rgba(255,255,255,.6)" }} />; })}
    <div style={{ position: "absolute", left: 560, top: 860, width: 460, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse,#f1dc9a,#c8a560 70%)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 1220, top: 520, fontFamily: HAND, fontSize: 96, color: MZ, transform: `rotate(${-4 + slow}deg)`, opacity: cl((tt - 2.4) / 0.5) }}>1 cdita</div>
    <Tag tt={tt} at={3.2} x={1420} y={700} txt="POR KILO, NO MÁS" col={TX} size={38} />
    <Tag tt={tt} at={4.0} x={1420} y={790} txt="DE MÁS = SABE A METAL" col={RED} size={32} />
  </>;
}}</Stage>;

// 7 · ONDAS DE SABOR: la cucharita de prueba suelta anillos que se agrandan; la sal cruda baja al cocerse
const HSalada: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1c1410">{(tt) => {
  const cook = eio(tt, 2.6, 4.2);
  return <>
    <Head tt={tt} kick="TRUCO 7" title="LA MASA SE PRUEBA SALADA" />
    {Array.from({ length: 5 }, (_, i) => { const p = ((tt * 0.6 + i / 5) % 1); return <div key={i} style={{ position: "absolute", left: 620 - 300 * p, top: 560 - 300 * p, width: 600 * p, height: 600 * p, borderRadius: "50%", border: `4px solid rgba(240,190,90,${(1 - p) * 0.8})` }} />; })}
    <div style={{ position: "absolute", left: 470, top: 520, width: 300, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#c08a52,#7a4a22)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 80, top: 16, width: 140, height: 44, borderRadius: "50%", background: "#ecd798" }} />
    </div>
    <div style={{ position: "absolute", left: 770, top: 548, width: 360, height: 24, borderRadius: 12, background: "#8a5a2e" }} />
    {[["CRUDA", "saladita", 1], ["COCIDA", "en su punto", cook]].map(([n, s, k], i) => <div key={i} style={{ position: "absolute", left: 1180 + i * 330, top: 360, width: 280, textAlign: "center", opacity: i ? cl((k as number) * 2) : 1 }}>
      <div style={{ fontWeight: 900, fontSize: 38, color: TX }}>{n as string}</div>
      <div style={{ margin: "20px auto", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle,rgba(255,255,255,${i ? 0.35 : 0.85}) 0 ${i ? 30 : 60}%,transparent 62%)`, border: "4px solid rgba(255,255,255,.4)" }} />
      <div style={{ fontFamily: HAND, fontSize: 46, color: MZ }}>{s as string}</div>
    </div>)}
    <Tag tt={tt} at={3.6} x={1500} y={900} txt="AL VAPOR SE PIERDE LA SAL" col={TX} size={32} />
  </>;
}}</Stage>;

// 8 · LA HOJA SE ABLANDA: tiesa sobre el agua, se hunde, sale curvada y flexible
const HRemojo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#0e1418">{(tt) => {
  const dn = eio(tt, 0.6, 1.6), up = eio(tt, 3.0, 4.0), y = lerp(lerp(380, 700, dn), 420, up), soft = cl((tt - 1.6) / 1.4);
  return <>
    <Head tt={tt} kick="TRUCO 8" title="LAS HOJAS, MEDIA HORA EN AGUA CALIENTE" />
    <div style={{ position: "absolute", left: 420, top: 620, width: 1080, height: 360, borderRadius: "30px 30px 120px 120px", background: "linear-gradient(90deg,#5a6670,#8f9ca6 50%,#4a545c)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 24, right: 24, top: 24, bottom: 24, borderRadius: "20px 20px 100px 100px", background: "linear-gradient(180deg,rgba(170,200,220,.6),rgba(90,120,140,.8))" }} />
    </div>
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 500 + rnd(i) * 900, top: 560 - ((tt * 70 + rnd(i) * 200) % 220), width: 60, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(255,255,255,.22),transparent 70%)", filter: "blur(6px)" }} />)}
    <Hoja x={960} y={y} w={300} hh={520} r={90} curva={lerp(0, 38, soft) + 6 * Math.sin(tt * 2) * soft} />
    <Tag tt={tt} at={1.0} x={420} y={340} txt="TIESA SE RAJA" col={RED} size={34} />
    <Tag tt={tt} at={3.8} x={1500} y={340} txt="BLANDITA SE DOBLA" col={MZ} size={38} />
  </>;
}}</Stage>;

// 9 · LA HOJA GIRA: un lado con estrías (áspero) y el otro liso y brillante; la lupa lo muestra
const HLados: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const rot = eio(tt, 1.2, 2.6) * 180, back = rot > 90;
  return <>
    <Head tt={tt} kick="TRUCO 9" title="SIEMPRE DEL LADO LISO" />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `perspective(1600px) rotateY(${rot}deg)`, transformOrigin: "780px 600px" }}>
      <Hoja x={780} y={600} w={340} hh={620} liso={back} style={{ transform: back ? "scaleX(-1)" : undefined }} />
    </div>
    <div style={{ position: "absolute", left: 1180, top: 330, width: 460, height: 460, borderRadius: "50%", border: "14px solid #3a2a1a", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.6)", background: back ? "linear-gradient(110deg,#d8c38a,#fbf1d6 50%,#d8c38a)" : "repeating-linear-gradient(90deg,#a68c58 0 18px,#d6bd86 18px 36px)" }} />
    <div style={{ position: "absolute", left: 1560, top: 730, width: 40, height: 220, background: "#3a2a1a", borderRadius: 20, transform: "rotate(-40deg)" }} />
    <div style={{ position: "absolute", left: 1180, width: 460, top: 820, textAlign: "center", fontWeight: 900, fontSize: 44, color: back ? MZ : RED }}>{back ? "LISO: AQUÍ SE UNTA" : "RASPOSO: SE PEGA"}</div>
  </>;
}}</Stage>;

// 10 · CALIBRADOR: la espátula unta una franja y el vernier mide el grosor (2 mm)
const HUnta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = eio(tt, 0.6, 2.4), cal = eio(tt, 2.8, 3.8);
  return <>
    <Head tt={tt} kick="TRUCO 10" title="UNTADA DELGADITA" />
    <Hoja x={760} y={620} w={420} hh={720} r={-90} />
    <div style={{ position: "absolute", left: 470, top: 520, width: 580 * s, height: 200, borderRadius: 30, background: "linear-gradient(180deg,#f7e6ae,#e2c47a)", boxShadow: "inset 0 -6px 10px rgba(0,0,0,.15)" }} />
    <div style={{ position: "absolute", left: 440 + 580 * s, top: 470, width: 40, height: 300, borderRadius: 10, background: "linear-gradient(90deg,#9a9a9a,#eee,#9a9a9a)", transform: `rotate(${18 - 6 * Math.sin(tt * 4)}deg)` }} />
    <div style={{ position: "absolute", left: 1220, top: 380, width: 520, height: 400, opacity: cal, transform: `translateX(${(1 - cal) * 200}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 80, background: "linear-gradient(180deg,#d9d9d9,#8a8a8a)", borderRadius: 8 }}>
        {Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: 10 + i * 19.5, top: 0, width: 2, height: i % 5 ? 24 : 44, background: "#222" }} />)}
      </div>
      <div style={{ position: "absolute", left: 40, top: 80, width: 40, height: 240, background: "#9a9a9a" }} />
      <div style={{ position: "absolute", left: 40 + 60 * cal, top: 80, width: 40, height: 240, background: "#bdbdbd" }} />
      <div style={{ position: "absolute", left: 200, top: 160, fontFamily: HAND, fontSize: 90, color: MZ }}>3 mm</div>
    </div>
    <Tag tt={tt} at={3.8} x={760} y={980} txt="GRUESA = CRUDA POR DENTRO" col={RED} size={34} />
  </>;
}}</Stage>;

// 11 · DIANA: anillos sobre la hoja y la cucharada de relleno cae justo al centro
const HDiana: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1e100c">{(tt) => {
  const r = eio(tt, 0.4, 1.4), f = cl((tt - 1.8) / 0.6), sq = f >= 1 ? 1 + 0.25 * Math.exp(-(tt - 2.4) * 5) * Math.sin((tt - 2.4) * 18) : 1;
  return <>
    <Head tt={tt} kick="TRUCO 11" title="EL RELLENO EN EL CENTRO, Y POCO" />
    <Hoja x={960} y={620} w={460} hh={700} />
    <div style={{ position: "absolute", left: 960 - 160, top: 560 - 160, width: 320, height: 320, borderRadius: "50%", background: "#f2dc98" }} />
    {[1, 0.7, 0.4].map((k, i) => <div key={i} style={{ position: "absolute", left: 960 - 160 * k * r, top: 560 - 160 * k * r, width: 320 * k * r, height: 320 * k * r, borderRadius: "50%", border: `5px solid ${i === 2 ? RED : "rgba(160,40,20,.5)"}` }} />)}
    <div style={{ position: "absolute", left: 960 - 70, top: lerp(160, 510, f * f), width: 140, height: 100 / sq, borderRadius: "50%", transform: `scaleX(${sq})`, background: "radial-gradient(circle at 35% 30%,#d0502a,#8a2412 70%)", boxShadow: "0 10px 16px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={2.8} x={1460} y={520} txt="UNA CUCHARADA" col={MZ} size={40} />
    <Tag tt={tt} at={3.4} x={1460} y={620} txt="DE MÁS = SE ABRE" col={RED} size={32} />
  </>;
}}</Stage>;

// 12 · ORIGAMI 3D: la hoja se dobla en tres tiempos y la punta va hacia atrás
const HDoblez: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const a = eio(tt, 0.6, 1.4), b = eio(tt, 1.6, 2.4), c = eio(tt, 2.8, 3.8);
  const P = (rx: number, ry: number, z: number, o: string, ch?: React.ReactNode) => <div style={{ position: "absolute", inset: 0, transformOrigin: o, transform: `rotateY(${ry}deg) rotateX(${rx}deg) translateZ(${z}px)`, transformStyle: "preserve-3d" }}>{ch}</div>;
  return <>
    <Head tt={tt} kick="TRUCO 12" title="EL DOBLEZ HACIA ATRÁS" />
    <div style={{ position: "absolute", left: 760, top: 300, width: 400, height: 600, transformStyle: "preserve-3d", transform: `perspective(1600px) rotateX(${20 + 6 * Math.sin(tt)}deg) rotateY(${-20 + 10 * c}deg)` }}>
      <div style={{ position: "absolute", left: 130, top: 0, width: 140, height: 400, background: "linear-gradient(90deg,#d8c18a,#f3e4ba,#d8c18a)", boxShadow: "0 30px 40px rgba(0,0,0,.4)" }}><div style={{ position: "absolute", left: 30, right: 30, top: 80, bottom: 80, background: "#f0d68e", borderRadius: 20 }} /></div>
      {P(0, -178 * a, 1, "130px 0", <div style={{ position: "absolute", left: 0, top: 0, width: 130, height: 400, background: "linear-gradient(90deg,#c9b27a,#e9d6a4)" }} />)}
      {P(0, 178 * b, 2, "270px 0", <div style={{ position: "absolute", left: 270, top: 0, width: 130, height: 400, background: "linear-gradient(90deg,#e9d6a4,#c3aa70)" }} />)}
      {P(-178 * c, 0, 3, "0 400px", <div style={{ position: "absolute", left: 130, top: 400, width: 140, height: 200, borderRadius: "0 0 70px 70px", background: "linear-gradient(180deg,#d8c18a,#b49a62)" }} />)}
    </div>
    {["1 · UN LADO", "2 · EL OTRO", "3 · PUNTA ATRÁS"].map((s, i) => <div key={i} style={{ position: "absolute", left: 1300, top: 400 + i * 110, fontFamily: HAND, fontSize: 56, color: [a, b, c][i] > 0.5 ? MZ : DIM }}>{s}</div>)}
    <Tag tt={tt} at={4.0} x={500} y={960} txt="ASÍ NO SE ABRE CON EL VAPOR" col={TX} size={32} />
  </>;
}}</Stage>;

// 13 · EL NUDO: la tirita de hoja da la vuelta y se anuda (trazo que se dibuja)
const HAmarre: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#16100a">{(tt) => {
  const d = eio(tt, 0.8, 3.0), k = eio(tt, 3.0, 3.6);
  return <>
    <Head tt={tt} kick="TRUCO 13" title="EL AMARRE CON LA MISMA HOJA" />
    <Tamal x={960} y={620} s={2.6} r={90} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 1180 380 C 1240 520, 1240 720, 1180 860 C 1120 900, 1080 880, 1100 760 C 1120 640, 1200 560, 1290 600 L 1400 520 M 1290 600 L 1420 680" stroke="#c9ac6e" strokeWidth={26} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
    </svg>
    <div style={{ position: "absolute", left: 1250, top: 560, width: 90, height: 80, borderRadius: "50%", background: "#b89a5e", transform: `scale(${k * (1 + 0.2 * Math.exp(-(tt - 3.6) * 5))})` }} />
    <div style={{ position: "absolute", left: 300, top: 360, width: 300, height: 40, borderRadius: 20, background: "linear-gradient(90deg,#c9ac6e,#e3cf9a)", transform: `translateX(${d * 600}px) scaleX(${1 - d})`, opacity: 1 - d }} />
    <Tag tt={tt} at={3.6} x={1460} y={880} txt="SIN HILO, SIN PLÁSTICO" col={MZ} size={36} />
  </>;
}}</Stage>;

// 14 · VAPORERA EN CORTE: el agua abajo, la rejilla arriba y el vapor que sube en flechas curvas
const HCorte: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#121417">{(tt) => {
  const wl = eio(tt, 0.4, 1.4), st = cl((tt - 1.4) / 0.6);
  return <>
    <Head tt={tt} kick="TRUCO 14" title="EL AGUA NO TOCA LA REJILLA" />
    <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 700, borderRadius: "20px 20px 60px 60px", border: "18px solid #6b6f75", borderTop: "none", background: "rgba(20,22,26,.6)", boxShadow: "0 60px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150 * wl, background: "linear-gradient(180deg,rgba(150,190,220,.7),rgba(60,100,140,.9))" }}>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${rnd(i) * 95}%`, top: 10 + ((tt * 60 + rnd(i) * 100) % 120), width: 12, height: 12, borderRadius: 6, border: "2px solid rgba(255,255,255,.6)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 230, height: 14, background: "repeating-linear-gradient(90deg,#aab0b8 0 24px,transparent 24px 44px)" }} />
      {Array.from({ length: 6 }, (_, i) => <Tamal key={i} x={110 + i * 110} y={330} s={0.9} />)}
      {Array.from({ length: 5 }, (_, i) => { const p = ((tt * 0.5 + i / 5) % 1) * st; return <svg key={i} width={120} height={500} style={{ position: "absolute", left: 80 + i * 140, bottom: 160, opacity: (1 - p) * st }}><path d={`M 60 480 C ${20 + 80 * Math.sin(i)} 360, ${100 - 80 * Math.sin(i)} 220, 60 ${480 - 460 * p}`} stroke="rgba(255,255,255,.6)" strokeWidth={6} fill="none" /></svg>; })}
    </div>
    <div style={{ position: "absolute", left: 1400, top: 760, width: 260, height: 4, background: MZ, opacity: wl }} />
    <Tag tt={tt} at={1.4} x={1560} y={720} txt="AGUA: 2-3 DEDOS ABAJO" col={MZ} size={34} />
    <Tag tt={tt} at={2.2} x={1560} y={560} txt="REJILLA SECA" col={TX} size={34} />
    <Tag tt={tt} at={3.4} x={360} y={560} txt="SI TOCA = AGUADOS" col={RED} size={34} />
  </>;
}}</Stage>;

// 15 · FLOR CENITAL: desde arriba, los tamales se paran en espiral alrededor del centro
const HFlor: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#120f0c">{(tt) => {
  const N = 22;
  return <>
    <Head tt={tt} kick="TRUCO 15" title="ACOMODADOS COMO FLOR, SIN APRETAR" />
    <div style={{ position: "absolute", left: 960 - 420, top: 600 - 420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle,#3a3d42,#1c1e22 70%)", border: "16px solid #6b6f75", boxShadow: "0 50px 90px rgba(0,0,0,.7)", transform: `rotate(${tt * 4}deg)` }}>
      {Array.from({ length: N }, (_, i) => { const ring = i < 8 ? 0 : i < 16 ? 1 : 2, idx = ring === 0 ? i : ring === 1 ? i - 8 : i - 16, n = [8, 8, 6][ring], R = [330, 220, 110][ring], a = (idx / n) * Math.PI * 2 + ring * 0.3, k = cl(phys(tt, 0.4 + i * 0.13, 8, 0.5));
        return <div key={i} style={{ position: "absolute", left: 420 + Math.cos(a) * R - 44, top: 420 + Math.sin(a) * R - 44, width: 88, height: 88, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f1e2b4,#c3a86e 70%)", boxShadow: "0 8px 14px rgba(0,0,0,.6)", transform: `scale(${k})` }}><div style={{ position: "absolute", left: 30, top: 30, width: 28, height: 28, borderRadius: "50%", background: "#a88e58" }} /></div>; })}
    </div>
    <Tag tt={tt} at={3.6} x={1600} y={420} txt="PARADITOS" col={MZ} size={40} />
    <Tag tt={tt} at={4.0} x={1600} y={520} txt="CON AIRE ENTRE ELLOS" col={TX} size={32} />
  </>;
}}</Stage>;

// 16 · CAPAS QUE CAEN: hojas, trapo y tapa bajan con peso sobre la vaporera
const HCapas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = [["HOJAS", "#d8c18a", 0.5], ["TRAPO", "#e9e4d6", 1.5], ["TAPA", "#7a7f86", 2.5]] as const;
  return <>
    <Head tt={tt} kick="TRUCO 16" title="TAPADOS CON HOJAS Y UN TRAPO" />
    <div style={{ position: "absolute", left: 560, top: 640, width: 800, height: 360, borderRadius: "10px 10px 60px 60px", background: "linear-gradient(90deg,#4f545a,#8a9098 50%,#454a50)", boxShadow: "0 60px 90px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 7 }, (_, i) => <Tamal key={i} x={640 + i * 106} y={560} s={0.7} />)}
    {L.map(([n, c, at], i) => { const k = cl(phys(tt, at, 7, 0.45)), y = lerp(-200, 600 - i * 34, k);
      return <React.Fragment key={n}>
        <div style={{ position: "absolute", left: 540 - i * 10, top: y, width: 840 + i * 20, height: i === 2 ? 90 : 46, borderRadius: i === 2 ? "420px 420px 20px 20px / 90px 90px 20px 20px" : 20, background: i === 0 ? "repeating-linear-gradient(90deg,#c9b27a 0 30px,#e3cf9a 30px 60px)" : i === 1 ? "repeating-linear-gradient(45deg,#ece6d6 0 14px,#d8d0bc 14px 28px)" : `linear-gradient(180deg,#a8adb4,${c})`, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 1420, top: 560 - i * 90, fontWeight: 900, fontSize: 40, color: k > 0.9 ? MZ : DIM }}>{i + 1}. {n}</div>
      </React.Fragment>; })}
    <Tag tt={tt} at={3.6} x={400} y={420} txt="EL VAPOR NO SE ESCAPA" col={TX} size={32} />
  </>;
}}</Stage>;

// 17 · RELOJ DE COCINA: la perilla mecánica gira hasta 90 y la tapa queda con candado
const HTimer: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#170f0c">{(tt) => {
  const g = eio(tt, 0.5, 2.4) * 270, lock = cl(phys(tt, 2.8, 8, 0.45));
  return <>
    <Head tt={tt} kick="TRUCO 17" title="UNA HORA Y MEDIA SIN DESTAPAR" />
    <div style={{ position: "absolute", left: 560, top: 300, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#ff9a7a,#c8402a 60%,#7a1a10)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 60, top: 60, right: 60, bottom: 60, borderRadius: "50%", background: "#f6efe0", transform: `rotate(${-g}deg)` }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 250 - 2, top: 10, width: 4, height: 30, background: "#2a2420", transformOrigin: "2px 240px", transform: `rotate(${i * 30}deg)` }} />)}
        {[0, 30, 60, 90].map((m, i) => <div key={m} style={{ position: "absolute", left: 250 - 40 + 180 * Math.sin((m * 3 * Math.PI) / 180), top: 250 - 30 - 180 * Math.cos((m * 3 * Math.PI) / 180), width: 80, textAlign: "center", fontWeight: 900, fontSize: 40, color: m === 90 ? RED : "#2a2420", transform: `rotate(${g}deg)` }}>{m}</div>)}
      </div>
      <div style={{ position: "absolute", left: 300, top: 0, width: 20, height: 60, background: "#2a2420", borderRadius: 10 }} />
    </div>
    <div style={{ position: "absolute", left: 1320, top: 380, width: 300, height: 340, transform: `translateY(${(1 - lock) * -400}px)`, opacity: cl(lock * 2) }}>
      <div style={{ position: "absolute", left: 60, top: 0, width: 180, height: 180, borderRadius: "90px 90px 0 0", border: "28px solid #b8b8b8", borderBottom: "none" }} />
      <div style={{ position: "absolute", left: 0, top: 150, width: 300, height: 200, borderRadius: 30, background: "linear-gradient(180deg,#e0b04a,#a87a1e)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    </div>
    <Tag tt={tt} at={3.4} x={1470} y={820} txt="CADA DESTAPE = -30 MIN" col={RED} size={34} />
  </>;
}}</Stage>;

// 18 · MACRO: la hoja del tamal listo se despega limpia; la del crudo se queda pegada con hilos de masa
const HDespega: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#140f0a">{(tt) => {
  const p = eio(tt, 0.8, 2.6), q = eio(tt, 1.2, 3.0);
  return <>
    <Head tt={tt} kick="TRUCO 18" title="LISTO CUANDO LA HOJA SE DESPEGA SOLA" />
    {[0, 1].map((i) => { const x = i ? 1340 : 580, k = i ? q * 0.4 : p;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 140, top: 380, width: 280, height: 500, borderRadius: 80, background: i ? "linear-gradient(90deg,#e6d29a,#f3e3b0,#d8bd7a)" : "linear-gradient(90deg,#f2e2b0,#fff3cc,#e8d39a)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: x - 150, top: 360, width: 160, height: 540, transformOrigin: "0 50%", transform: `perspective(1200px) rotateY(${-110 * k}deg)` }}><Hoja x={80} y={270} w={160} hh={540} /></div>
        {i === 1 && Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: x - 150 + 20 * q, top: 420 + j * 70, width: 30 + 50 * q, height: 6, borderRadius: 3, background: "#f3e3b0", opacity: 0.9 }} />)}
        <div style={{ position: "absolute", left: x - 260, width: 520, top: 920, textAlign: "center", fontWeight: 900, fontSize: 38, color: i ? RED : MZ, opacity: cl((tt - 2.6) / 0.4) }}>{i ? "SE PEGA: LE FALTA" : "SE DESPEGA: LISTO"}</div>
      </React.Fragment>; })}
  </>;
}}</Stage>;

// 19 · EL VAPOR SE CALMA: nube agitada que se va asentando; la manecilla cuenta 15 minutos
const HReposo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#101216">{(tt) => {
  const calm = eio(tt, 0.6, 4.0), mn = Math.round(calm * 15);
  return <>
    <Head tt={tt} kick="TRUCO 19" title="QUINCE MINUTOS DE REPOSO" />
    {Array.from({ length: 34 }, (_, i) => { const agit = 1 - calm; return <div key={i} style={{ position: "absolute", left: 560 + rnd(i) * 700 + agit * 60 * Math.sin(tt * 6 + i), top: 300 + rnd(i + 2) * 300 - agit * 80 * Math.sin(tt * 5 + i * 2) + calm * 140, width: 160, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(255,255,255,.28),transparent 70%)", filter: "blur(10px)", opacity: 1 - calm * 0.7 }} />; })}
    {Array.from({ length: 6 }, (_, i) => <Tamal key={i} x={640 + i * 130} y={800} s={0.9} r={-4 + i * 2} />)}
    <div style={{ position: "absolute", left: 1460, top: 360, width: 280, height: 280, borderRadius: "50%", border: "10px solid #d9d2c2", background: "#f6efe0" }}>
      <div style={{ position: "absolute", left: 136, top: 30, width: 8, height: 110, background: RED, transformOrigin: "4px 110px", transform: `rotate(${calm * 90}deg)`, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: HAND, fontSize: 70, color: MZ }}>{mn} min</div>
    </div>
    <Tag tt={tt} at={3.6} x={900} y={980} txt="LA MASA SE ASIENTA Y SE AFIRMA" col={TX} size={32} />
  </>;
}}</Stage>;

// 20 · POR LA ORILLA: la jarra vierte y el chorro baja pegado a la pared; el camino por encima se tacha
const HOrilla: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#111317">{(tt) => {
  const tilt = eio(tt, 0.5, 1.3), fl = cl((tt - 1.3) / 1.2), x2 = cl((tt - 3.0) / 0.5);
  return <>
    <Head tt={tt} kick="TRUCO 20" title="CUANDO SE ACABA EL AGUA, POR LA ORILLA" />
    <div style={{ position: "absolute", left: 560, top: 460, width: 800, height: 520, borderRadius: "10px 10px 60px 60px", border: "18px solid #6b6f75", borderTop: "none", background: "rgba(20,22,26,.6)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 6 }, (_, i) => <Tamal key={i} x={110 + i * 110} y={180} s={0.85} />)}
    </div>
    <div style={{ position: "absolute", left: 300, top: 220, width: 260, height: 240, transformOrigin: "100% 20%", transform: `rotate(${50 * tilt}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "20px 20px 60px 60px", background: "linear-gradient(90deg,#8a9098,#d0d4da,#7a8088)" }} />
      <div style={{ position: "absolute", right: -40, top: 10, width: 60, height: 30, background: "#a8adb4", borderRadius: "0 20px 20px 0" }} />
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 580 300 C 600 360, 584 420, 590 470 L 590 940" stroke="rgba(150,200,240,.85)" strokeWidth={14} fill="none" pathLength={1} strokeDasharray={`${fl} 1`} strokeLinecap="round" />
      <path d="M 640 300 C 800 260, 960 300, 960 560" stroke="rgba(150,200,240,.35)" strokeWidth={12} fill="none" strokeDasharray="20 18" opacity={cl((tt - 2.6) / 0.4)} />
      <path d="M 860 380 L 1060 520 M 1060 380 L 860 520" stroke={RED} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${x2} 1`} />
    </svg>
    <Tag tt={tt} at={2.0} x={420} y={1000} txt="HIRVIENDO, PEGADA A LA PARED" col={MZ} size={32} />
    <Tag tt={tt} at={3.4} x={1500} y={380} txt="NUNCA ENCIMA" col={RED} size={40} />
    <Tag tt={tt} at={3.9} x={1500} y={300} txt="TRAPO GRUESO: EL VAPOR QUEMA" col={TX} size={28} />
  </>;
}}</Stage>;

// 21 · CONGELADOR: las bolsas caen una encima de otra en la puerta abierta y se escarchan
const HCongela: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#0c1218">{(tt) => {
  const fr = cl((tt - 3.0) / 1.2);
  return <>
    <Head tt={tt} kick="TRUCO 21" title="SE CONGELAN YA COCIDOS" />
    <div style={{ position: "absolute", left: 640, top: 280, width: 640, height: 720, borderRadius: 24, background: "linear-gradient(180deg,#e9f1f6,#b8c8d4)", boxShadow: "0 50px 80px rgba(0,0,0,.6), inset 0 0 80px rgba(120,160,200,.5)" }} />
    {[0, 1, 2, 3].map((i) => { const k = cl(phys(tt, 0.4 + i * 0.6, 7, 0.45));
      return <div key={i} style={{ position: "absolute", left: 700 + (i % 2) * 14, top: lerp(-300, 860 - i * 150, k), width: 520, height: 140, borderRadius: 26, background: "linear-gradient(180deg,rgba(255,255,255,.55),rgba(220,235,245,.35))", border: "3px solid rgba(255,255,255,.8)", boxShadow: "0 16px 24px rgba(0,0,0,.35)", overflow: "hidden" }}>
        {Array.from({ length: 5 }, (_, j) => <div key={j} style={{ position: "absolute", left: 30 + j * 96, top: 30, width: 80, height: 80, borderRadius: 30, background: "#d8c18a" }} />)}
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(60deg,rgba(255,255,255,${0.3 * fr}) 0 4px,transparent 4px 14px)` }} />
      </div>; })}
    <div style={{ position: "absolute", left: 1360, top: 380, fontFamily: HAND, fontSize: 100, color: "#bfe0ff", opacity: fr }}>3 meses</div>
    <Tag tt={tt} at={3.6} x={1560} y={620} txt="SIN DESCONGELAR: DIRECTO AL VAPOR" col={TX} size={28} />
    <Tag tt={tt} at={2.2} x={400} y={460} txt="CRUDOS NUNCA" col={RED} size={36} />
  </>;
}}</Stage>;

// 22 · COMAL: el tamal se dora, la hoja pasa de paja a tostada y suelta chispitas
const HComal: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#150c08">{(tt) => {
  const d = eio(tt, 0.8, 3.6), flip = eio(tt, 2.2, 2.7);
  return <>
    <Head tt={tt} kick="TRUCO 22" title="RECALENTADOS EN EL COMAL" />
    <div style={{ position: "absolute", left: 460, top: 600, width: 1000, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%,#4a4a4a,#1a1a1a 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.7)", transform: "perspective(1200px) rotateX(55deg)" }} />
    <Flame x={960} y={960} k={0.6} tt={tt} s={2.6} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${-60 * Math.sin(flip * Math.PI)}px)` }}>
      <Tamal x={960} y={640} s={2.0} r={90 + 180 * flip} dor={d} />
    </div>
    {d > 0.3 && Array.from({ length: 10 }, (_, i) => { const p = ((tt * 1.3 + rnd(i)) % 1); return <div key={i} style={{ position: "absolute", left: 760 + rnd(i + 1) * 400, top: 640 - p * 200, width: 6, height: 6, borderRadius: 3, background: "#ffb04a", opacity: (1 - p) * d, boxShadow: "0 0 8px #ff9a3a" }} />; })}
    <Tag tt={tt} at={3.2} x={1540} y={420} txt="CRUJIENTE POR FUERA" col={MZ} size={36} />
    <Tag tt={tt} at={3.8} x={1540} y={510} txt="SUAVE POR DENTRO" col={TX} size={32} />
  </>;
}}</Stage>;

// 23 · FRIJOLITOS EN LA MESA: «un frijol, un tamal»; caen de a uno y forman montoncitos de cinco
const HFrijoles: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a120c">{(tt) => {
  const N = 25, n = Math.min(N, Math.floor(cl((tt - 0.5) / 3.2) * N));
  return <>
    <Head tt={tt} kick="TRUCO 23" title="CUÁNTOS SALEN DE UN KILO" />
    <div style={{ position: "absolute", left: 320, top: 380, width: 1280, height: 520, borderRadius: 20, background: "repeating-linear-gradient(90deg,#6b4428 0 120px,#5e3a22 120px 124px)", boxShadow: "0 50px 80px rgba(0,0,0,.6)", transform: "perspective(1400px) rotateX(30deg)" }} />
    {Array.from({ length: n }, (_, i) => { const g = Math.floor(i / 5), j = i % 5, k = cl(phys(tt, 0.5 + (i / N) * 3.2, 9, 0.4));
      return <Bean key={i} x={460 + g * 240 + (j - 2) * 30 + rnd(i) * 10} y={lerp(200, 640 + (j % 2) * 20 - (j === 4 ? 26 : 0), k)} r={rnd(i) * 180} />; })}
    <div style={{ position: "absolute", left: 1640, top: 420, fontWeight: 900, fontSize: 150, color: MZ, lineHeight: 1 }}>{n}</div>
    <div style={{ position: "absolute", left: 1640, top: 590, fontFamily: HAND, fontSize: 44, color: TX }}>tamales</div>
    <Tag tt={tt} at={3.8} x={960} y={1000} txt="1 KG DE MASA = 20 A 25" col={TX} size={34} />
  </>;
}}</Stage>;

// 24 · TORRES DE MONEDAS: la del puesto sube alta y la de la casa queda bajita; la diferencia se va al cochinito
const HMonedas: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = eio(tt, 0.5, 2.2), b = eio(tt, 0.9, 2.0), dif = eio(tt, 2.6, 3.8);
  const Torre = ({ x, n, k, lab, val, col }: { x: number; n: number; k: number; lab: string; val: string; col: string }) => <>
    {Array.from({ length: Math.round(n * k) }, (_, i) => <div key={i} style={{ position: "absolute", left: x - 90 + (rnd(i) - 0.5) * 8, top: 900 - i * 22, width: 180, height: 30, borderRadius: "50%", background: "linear-gradient(180deg,#f3d27a,#b8862a)", border: "2px solid #8a6216" }} />)}
    <div style={{ position: "absolute", left: x - 200, width: 400, top: 950, textAlign: "center", fontWeight: 900, fontSize: 34, color: TX }}>{lab}</div>
    <div style={{ position: "absolute", left: x - 200, width: 400, top: 860 - n * k * 22 - 70, textAlign: "center", fontWeight: 900, fontSize: 58, color: col }}>{val}</div>
  </>;
  return <>
    <Head tt={tt} kick="TRUCO 24" title="LA CUENTA CONTRA EL PUESTO" />
    <Torre x={560} n={25} k={a} lab="25 EN EL PUESTO" val="$500" col={RED} />
    <Torre x={1020} n={8} k={b} lab="25 EN SU CASA" val="$150" col={MZ} />
    <div style={{ position: "absolute", left: 1320, top: 440, width: 360, height: 280, transform: `scale(${0.6 + 0.4 * cl(phys(tt, 2.6, 7, 0.5))})`, opacity: dif }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f6a8b8,#c86a80 70%)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 140, top: -10, width: 80, height: 16, borderRadius: 8, background: "#5a2030" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontWeight: 900, fontSize: 56, color: "#fff" }}>+$350</div>
    </div>
    <Tag tt={tt} at={3.8} x={1500} y={820} txt="$6 CONTRA $18-25 EL TAMAL" col={TX} size={32} />
  </>;
}}</Stage>;

// 25 · EL CALDO VIAJA: de la olla del relleno sale un chorro por un tubo curvo y entra a la masa; las dos se tiñen igual
const HCaldo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a0e08">{(tt) => {
  const f = eio(tt, 0.8, 2.8), tint = eio(tt, 2.6, 4.0);
  return <>
    <Head tt={tt} kick="TRUCO 25 · EL SECRETO" title="EL CALDO DEL RELLENO EN LA MASA" col={MZ} />
    <Olla x={500} y={700} w={420} lvl={0.8} steam tt={tt} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 620 520 C 760 260, 1160 260, 1320 560" stroke="rgba(255,255,255,.12)" strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d="M 620 520 C 760 260, 1160 260, 1320 560" stroke="#c86a2a" strokeWidth={30} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${f} 1`} />
      {Array.from({ length: 8 }, (_, i) => { const p = ((tt * 0.5 + i / 8) % 1) * f; return <circle key={i} r={9} cx={(1 - p) ** 3 * 620 + 3 * (1 - p) ** 2 * p * 760 + 3 * (1 - p) * p * p * 1160 + p ** 3 * 1320} cy={(1 - p) ** 3 * 520 + 3 * (1 - p) ** 2 * p * 260 + 3 * (1 - p) * p * p * 260 + p ** 3 * 560} fill="#ffd2a0" opacity={0.8} />; })}
    </svg>
    <div style={{ position: "absolute", left: 1160, top: 600, width: 400, height: 260, borderRadius: "0 0 200px 200px", background: "linear-gradient(90deg,#5e3a22,#8a5a34,#4a2c18)", boxShadow: "0 40px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 20, bottom: 20, borderRadius: "0 0 180px 180px", background: `rgb(${lerp(241, 226, tint)},${lerp(222, 168, tint)},${lerp(160, 110, tint)})` }} />
    </div>
    <Tag tt={tt} at={3.2} x={960} y={980} txt="MASA Y RELLENO: UNA SOLA COSA" col={MZ} size={40} />
    <Tag tt={tt} at={1.4} x={500} y={1000} txt="EL CALDO DE LA CARNE" col={TX} size={30} />
  </>;
}}</Stage>;

// A · RULETA DE ERRORES: tarjetas 9:16 con su foto pasan en carrusel horizontal; la del centro se agranda
const HRuleta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1e0a08">{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[], cur = Math.max(0, E.reduce((c, e, i) => (t >= e.a ? i : c), -1)), pos = E.reduce((p, e, i) => p + eio(t, e.a - 0.4, e.a + 0.4) * (i ? 1 : 0), 0);
  return <>
    <Head tt={tt} kick="LOS 5 ERRORES" title="QUE DEJAN EL TAMAL CRUDO" col={RED} />
    {E.map((e, i) => { const d = i - pos, x = 960 + d * 420, s = 1 - Math.min(0.35, Math.abs(d) * 0.22), act = i === cur;
      return <div key={i} style={{ position: "absolute", left: x - 170, top: 300, width: 340, height: 600, transform: `scale(${s}) rotateY(${-d * 18}deg)`, opacity: cl(1.4 - Math.abs(d) * 0.45) * cl((t - E[0].a + 0.8) * 2), zIndex: 10 - Math.round(Math.abs(d)) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "#f4ead2", boxShadow: act ? "0 0 0 6px #e04a2a, 0 40px 60px rgba(0,0,0,.7)" : "0 30px 50px rgba(0,0,0,.6)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 20, top: 20 }}><Photo id={im(h, i)} w={300} h={380} r={18} dim={act ? 0 : 0.45} /></div>
          <div style={{ position: "absolute", left: 20, right: 20, top: 420, textAlign: "center", fontWeight: 900, fontSize: 30, color: TIN, lineHeight: 1.2 }}><span style={{ color: RED, fontSize: 54 }}>{i + 1}</span><br />{e.tx}</div>
        </div>
      </div>; })}
  </>;
}}</Stage>;

// B · MESA DE TRABAJO CENITAL: nueve estaciones alrededor de la mesa; se encienden en orden y una línea las une
const HMesa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#140d08">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), -1);
  const P = S.map((_, i) => { const a = -Math.PI / 2 + (i / S.length) * Math.PI * 2; return [960 + Math.cos(a) * 560, 600 + Math.sin(a) * 330]; });
  return <>
    <Head tt={tt} kick="LA RUTINA COMPLETA" title="DE LA HOJA A LA VAPORERA" />
    <div style={{ position: "absolute", left: 300, top: 300, width: 1320, height: 600, borderRadius: 40, background: "repeating-linear-gradient(0deg,#7a4e2e 0 60px,#6b4428 60px 63px)", boxShadow: "0 50px 90px rgba(0,0,0,.7)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{P.slice(0, Math.max(0, cur + 1)).map((p, i) => i ? <line key={i} x1={P[i - 1][0]} y1={P[i - 1][1]} x2={p[0]} y2={p[1]} stroke={MZ} strokeWidth={6} strokeDasharray="14 10" /> : null)}</svg>
    {S.map((s, i) => { const on = i <= cur, k = cl(phys(t, s.a, 8, 0.45)), [x, y] = P[i];
      return <div key={i} style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: "50%", overflow: "hidden", border: `6px solid ${on ? MZ : "#4a3a2a"}`, boxShadow: on ? `0 0 ${40 * k}px rgba(255,200,90,.7)` : "0 10px 20px rgba(0,0,0,.6)", transform: `scale(${1 + 0.15 * k * (i === cur ? 1 : 0)})` }}><Photo id={im(h, i)} w={170} h={170} r={85} dim={on ? 0 : 0.6} /></div>; })}
    <div style={{ position: "absolute", left: 560, width: 800, top: 540, textAlign: "center", fontFamily: HAND, fontSize: 60, color: MZ }}>{cur >= 0 ? `${cur + 1}. ${S[cur].tx}` : ""}</div>
  </>;
}}</Stage>;

// C · TENDEDERO: cinco letreros colgados con pinzas; al nombrarse cada uno, se columpia y le cae el sello NUNCA
const HTendedero: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#160c0a">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="LO QUE MI ABUELA" title="NUNCA HACÍA CON LOS TAMALES" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M 100 330 Q 960 ${420 + 6 * Math.sin(tt * 1.5)} 1820 330`} stroke="#c9b48a" strokeWidth={5} fill="none" /></svg>
    {S.map((s, i) => { const u = (i + 0.5) / S.length, x = 100 + u * 1720, y = 330 + 4 * u * (1 - u) * 90, k = cl(phys(t, s.a, 6, 0.4)), sw = 10 * Math.exp(-(t - s.a) * 1.5) * Math.sin((t - s.a) * 6) * cl(t - s.a), st = cl(phys(t, s.a + 0.6, 9, 0.45));
      return <div key={i} style={{ position: "absolute", left: x - 140, top: y, width: 280, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - k) * -500}px)` }}>
        <div style={{ margin: "0 auto", width: 30, height: 50, background: "#b88a4a", borderRadius: 6 }} />
        <div style={{ position: "relative", background: "#f4ead2", borderRadius: 10, padding: 14, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }}>
          <Photo id={im(h, i)} w={252} h={200} r={8} dim={0.15} />
          <div style={{ marginTop: 12, textAlign: "center", fontWeight: 800, fontSize: 26, color: TIN, minHeight: 64 }}>{s.tx}</div>
          <div style={{ position: "absolute", left: 30, top: 70, padding: "6px 18px", border: `6px solid ${RED}`, borderRadius: 10, color: RED, fontWeight: 900, fontSize: 48, transform: `rotate(-14deg) scale(${lerp(2.4, 1, st)})`, opacity: st }}>NUNCA</div>
        </div>
      </div>; })}
  </>;
}}</Stage>;

// Q · CARTAS DE LA FAMILIA: los sobres salen de la canasta; cada uno se abre y la respuesta corta se escribe a mano
const HCartas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#17100b">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = Math.max(0, S.reduce((c, e, i) => (t >= e.a ? i : c), -1)), a0 = S[cur]?.a ?? 0, op = eio(t, a0 + 0.3, a0 + 1.1), [q, r] = (S[cur]?.tx ?? "|").split("|");
  return <>
    <Head tt={tt} kick="LO QUE MÁS ME PREGUNTAN" title="CINCO CARTAS DE LA CANDELARIA" />
    <div style={{ position: "absolute", left: 180, top: 720, width: 420, height: 240, borderRadius: "20px 20px 200px 200px", background: "repeating-linear-gradient(90deg,#a0703a 0 22px,#8a5e2e 22px 44px)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
    {S.map((_, i) => i > cur ? <div key={i} style={{ position: "absolute", left: 240 + i * 50, top: 660 - i * 6, width: 200, height: 130, background: "#efe4c8", borderRadius: 8, transform: `rotate(${-10 + i * 6}deg)`, boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} /> : null)}
    <div style={{ position: "absolute", left: 700, top: 290, width: 1040, height: 640, transform: `translateX(${(1 - cl(phys(t, a0, 7, 0.5))) * -700}px) rotate(${(1 - op) * -6}deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: "#f6eedb", borderRadius: 14, boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1040, height: 320, transformOrigin: "50% 0", transform: `perspective(1600px) rotateX(${-170 * op}deg)`, background: "linear-gradient(180deg,#e9dcbc,#d8c8a0)", clipPath: "polygon(0 0,100% 0,50% 100%)", opacity: op < 0.98 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 50, top: 60, width: 360 }}><Photo id={im(h, cur)} w={360} h={260} r={10} /></div>
      <div style={{ position: "absolute", left: 450, right: 50, top: 60, fontWeight: 800, fontSize: 40, color: "#2a2420", lineHeight: 1.25, opacity: op }}><span style={{ color: BR }}>{cur + 1}.</span> {q}</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 400, fontFamily: HAND, fontSize: 58, color: VER, clipPath: `inset(0 ${100 - 100 * cl((t - a0 - 1.2) / 1.4)}% 0 0)` }}>{r}</div>
    </div>
  </>;
}}</Stage>;

// D · REPASO: la vaporera se destapa y las 24 hojas salen volando a formar una cuadrícula; cada una se enciende al nombrarse
const HVuelo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#120e0a">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), -1), lid = eio(tt, 0.2, 0.9);
  return <>
    <Head tt={tt} kick="REPASO RÁPIDO" title="LAS 24 HOJAS DE LA VAPORERA" />
    <div style={{ position: "absolute", left: 860, top: 900, width: 200, height: 140, borderRadius: "10px 10px 50px 50px", background: "linear-gradient(90deg,#4f545a,#8a9098,#454a50)" }} />
    <div style={{ position: "absolute", left: 850, top: 880 - 260 * lid, width: 220, height: 40, borderRadius: "110px 110px 10px 10px", background: "#9aa0a8", transform: `rotate(${-30 * lid}deg)`, opacity: 1 - lid * 0.8 }} />
    {S.map((s, i) => { const col = i % 8, row = Math.floor(i / 8), gx = 330 + col * 180, gy = 330 + row * 190, fly = eio(tt, 0.6 + i * 0.03, 1.6 + i * 0.03), on = t >= s.a, k = cl(phys(t, s.a, 8, 0.4));
      return <div key={i} style={{ position: "absolute", left: lerp(960, gx, fly) - 70, top: lerp(900, gy, fly) - 80, width: 140, height: 160, transform: `rotate(${(1 - fly) * (rnd(i) * 360 - 180)}deg) scale(${1 + 0.18 * k * (i === cur ? 1 : 0)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "60px 60px 50% 50% / 20% 20% 80% 80%", background: on ? "linear-gradient(100deg,#e0b44a,#ffe7a0 50%,#e0b44a)" : "linear-gradient(100deg,#8a7650,#b49e6c 50%,#8a7650)", boxShadow: on ? `0 0 ${30 * k}px rgba(255,210,100,.8)` : "0 8px 14px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontWeight: 900, fontSize: 34, color: on ? TIN : "#3a2e1c" }}>{i + 1}</div>
      </div>; })}
    <div style={{ position: "absolute", left: 360, width: 1200, top: 800, textAlign: "center", fontFamily: HAND, fontSize: 64, color: MZ, opacity: cur >= 0 ? 1 : 0 }}>{cur >= 0 ? S[cur].tx : ""}</div>
  </>;
}}</Stage>;

export const MAP: Record<string, C> = { sacos: HSacos, batido: HBatido, flota: HFlota, jarras: HJarras, termometro: HTermo, polvo: HPolvo, salada: HSalada, remojo: HRemojo,
  lados: HLados, unta: HUnta, diana: HDiana, doblez: HDoblez, amarre: HAmarre, corte: HCorte, flor: HFlor, capas: HCapas, timer: HTimer, despega: HDespega,
  reposo: HReposo, orilla: HOrilla, congela: HCongela, comal: HComal, frijoles: HFrijoles, monedas: HMonedas, caldo: HCaldo,
  ruleta: HRuleta, mesa: HMesa, tendedero: HTendedero, cartas: HCartas, vuelo: HVuelo };

import { MAP3 } from "./heroes3d";
Object.assign(MAP, MAP3);

import { MAPD2 } from "./heroes3d_d2";
Object.assign(MAP, MAPD2);

// ── reemplazos por TOPE DEL EVALUADOR (30-oct): los componentes que no pasaron de 6 van como clip Veo de 8 s (manos de Cuca)
import { OffthreadVideo, Sequence, staticFile } from "remotion";
const CLIP_H: Record<string, number> = {};   // k → nº de clips; se llena a medida que llegan los h_<k>*.mp4 a public
const HClip: C = ({ t, h }) => {
  const n = CLIP_H[h.k] ?? 1, seg = (h.out - h.at) / n, i = Math.min(n - 1, Math.max(0, Math.floor((t - h.at) / seg)));
  const o = Math.min(1, (t - h.at + 0.05) / 0.3, (h.out + 0.85 - t) / 0.3);
  return <div style={{ position: "absolute", inset: 0, opacity: Math.max(0, o) }}><Sequence key={i} from={Math.round((h.at - 0.05 + i * seg) * 30)} layout="none"><OffthreadVideo src={staticFile(`cuca29d/${n > 1 ? `h_${h.k}_${i + 1}` : "h_" + h.k}.mp4`)} muted playbackRate={Math.min(1, 7.9 / (seg + 0.9))} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence></div>; };
for (const k of Object.keys(CLIP_H)) MAP[k] = HClip;
