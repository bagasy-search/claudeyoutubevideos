// cuca29c · MOLE · 25 componentes únicos (1 por truco) + errores / rutina / preguntas / repaso. Ninguno se repite en la tanda.
import React from "react";
import { BR, cl, DIM, eio, Flame, H, HAND, Head, lerp, MZ, Olla, phys, Photo, RED, rnd, Stage, Tag, TIN, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const im = (h: H, i: number) => h.imgs?.[i];
// chile seco: vaina arrugada con brillo; col = ancho (rojo vino) / mulato (casi negro) / pasilla (negro largo)
const Chile: React.FC<{ x: number; y: number; w?: number; hh?: number; r?: number; col?: string; o?: number; bend?: number; style?: React.CSSProperties }> = ({ x, y, w = 150, hh = 360, r = 0, col = "#6a1712", o = 1, bend = 0, style }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - hh / 2, width: w, height: hh, opacity: o, transform: `rotate(${r}deg) skewX(${bend}deg)`, ...style }}>
    <div style={{ position: "absolute", left: w * 0.38, top: -hh * 0.08, width: w * 0.24, height: hh * 0.14, borderRadius: 8, background: "linear-gradient(90deg,#4f5a2a,#7c8a3c)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: `${w / 2}px ${w / 2}px ${w / 2}px ${w / 2}px / ${hh * 0.25}px ${hh * 0.25}px ${hh * 0.75}px ${hh * 0.75}px`,
      background: `radial-gradient(ellipse at 35% 25%, rgba(255,255,255,.35) 0 6%, ${col} 40%, rgba(10,0,0,.9) 120%)`, boxShadow: "0 18px 30px rgba(0,0,0,.55)" }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${15 + rnd(i + w) * 60}%`, top: `${10 + i * 14}%`, width: "40%", height: 3, background: "rgba(0,0,0,.35)", transform: `rotate(${rnd(i) * 40 - 20}deg)` }} />)}
    </div>
  </div>
);
const Seed: React.FC<{ x: number; y: number; s?: number; r?: number; col?: string; o?: number }> = ({ x, y, s = 1, r = 0, col = "#f1e2b8", o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 14 * s, height: 22 * s, marginLeft: -7 * s, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: col, transform: `rotate(${r}deg)`, opacity: o, boxShadow: "0 2px 3px rgba(0,0,0,.4)" }} />
);

// 1 · PODIO: ancho, mulato y pasilla suben cada uno a su escalón
const HPodio: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const P = [["MULATO", "#2a0d0a", 780, 300, 1.4, "EL CUERPO"], ["ANCHO", "#6a1712", 420, 220, 0.6, "EL DULCE"], ["PASILLA", "#160806", 1140, 180, 2.2, "EL AHUMADO"]] as const;
  return <>
    <Head tt={tt} kick="TRUCO 1" title="LOS TRES CHILES DEL RANCHO" />
    {P.map(([n, c, x, hh, at, rol]) => { const k = cl(phys(tt, at, 6, 0.5));
      return <React.Fragment key={n}>
        <div style={{ position: "absolute", left: x, top: 940 - hh, width: 340, height: hh, background: "linear-gradient(180deg,#b9874c,#6b4a2a)", boxShadow: "0 40px 60px rgba(0,0,0,.6)", transform: `translateY(${(1 - k) * hh}px)` }}>
          <div style={{ textAlign: "center", fontWeight: 900, fontSize: 40, color: TX, marginTop: 18 }}>{n}</div>
          <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 34, color: MZ }}>{rol}</div>
        </div>
        <Chile x={x + 170} y={lerp(1200, 940 - hh - 190, k)} col={c} r={-8 + 4 * Math.sin(tt + x)} w={n === "PASILLA" ? 110 : 160} hh={n === "PASILLA" ? 400 : 340} />
      </React.Fragment>; })}
  </>;
}}</Stage>;

// 2 · DOBLAR: el chile bueno se dobla con resorte; el viejo se quiebra y suelta polvo
const HDobla: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const b = eio(tt, 0.8, 2.0) * (1 - 0.3 * Math.exp(-(tt - 2) * 3) * Math.sin((tt - 2) * 12) * cl(tt - 2)), br = cl((tt - 2.6) / 0.3);
  return <>
    <Head tt={tt} kick="TRUCO 2" title="SE DOBLA, NO SE QUIEBRA" />
    <div style={{ position: "absolute", left: 520, top: 560, transformOrigin: "50% 100%", transform: `rotate(${-55 * b}deg)` }}><Chile x={0} y={-180} col="#6a1712" /></div>
    <Chile x={520} y={760} col="#6a1712" hh={180} />
    <Chile x={1400} y={lerp(560, 520, br)} col="#4a2018" r={-40 * br} hh={180} style={{ filter: "saturate(.5)" }} />
    <Chile x={1400 + 40 * br} y={lerp(740, 880, br)} col="#4a2018" r={30 * br} hh={180} style={{ filter: "saturate(.5)" }} />
    {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1400 + (rnd(i) - 0.5) * 300 * br, top: 640 + rnd(i + 2) * 260 * br, width: 8, height: 8, borderRadius: 4, background: "#8a4a2a", opacity: br * (1 - cl((tt - 3.4) / 1.4)) }} />)}
    <Tag tt={tt} at={2.2} x={520} y={940} txt="FLEXIBLE = FRESCO" col={MZ} size={38} />
    <Tag tt={tt} at={3.0} x={1400} y={960} txt="SE QUIEBRA = VIEJO, AMARGA" col={RED} size={34} />
  </>;
}}</Stage>;

// 3 · VISTA EXPLOTADA: el chile se abre en piel, venas y semillas; las semillas van a un frasquito
const HExplota: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const ex = eio(tt, 0.6, 2.2), jar = eio(tt, 3.0, 4.6);
  return <>
    <Head tt={tt} kick="TRUCO 3" title="DESVENADO, Y LAS SEMILLAS SE GUARDAN" />
    <Chile x={960 - 380 * ex} y={560} col="#6a1712" w={220} hh={460} />
    <svg width={300} height={460} style={{ position: "absolute", left: 960 - 150, top: 330, opacity: cl(ex * 2) }}>{[0, 1, 2].map((i) => <path key={i} d={`M ${150 + (i - 1) * 30} 20 C ${120 + i * 40} 160, ${190 - i * 30} 300, ${150 + (i - 1) * 20} 440`} stroke="#e8c79a" strokeWidth={8} fill="none" />)}</svg>
    {Array.from({ length: 40 }, (_, i) => { const sx = 960 + 380 * ex + (rnd(i) - 0.5) * 160, sy = 400 + rnd(i + 3) * 320; return <Seed key={i} x={lerp(sx, 1500 + (rnd(i) - 0.5) * 90, jar)} y={lerp(sy, 820 - rnd(i + 5) * 120, jar)} r={rnd(i) * 360} s={1.4} />; })}
    <div style={{ position: "absolute", left: 1410, top: 640, width: 180, height: 240, borderRadius: "20px 20px 30px 30px", border: "5px solid rgba(255,255,255,.4)", background: "rgba(255,255,255,.06)", opacity: cl(jar * 3) }} />
    <Tag tt={tt} at={1.6} x={580} y={900} txt="PIEL" col={TX} size={32} /><Tag tt={tt} at={2.0} x={960} y={900} txt="VENAS: PICOR" col={RED} size={32} />
    <Tag tt={tt} at={4.4} x={1500} y={960} txt="SEMILLAS: SE TUESTAN APARTE" col={MZ} size={30} />
  </>;
}}</Stage>;

// 4 · TIRA DE TUESTE: tres tonos con cuenta 1-2-3 a mano; el cuarto (negro) se tacha
const HTueste: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1d0f0a">{(tt) => {
  const T = ["#7a1c14", "#5e1610", "#43110c", "#120605"], n = Math.min(4, Math.floor(cl((tt - 0.6) / 3.2) * 4) + 1), tach = cl((tt - 4.0) / 0.6);
  return <>
    <Head tt={tt} kick="TRUCO 4" title="SE CUENTA HASTA TRES" />
    {T.map((c, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 340, top: 380, opacity: i < n ? 1 : 0.15, transform: `translateY(${i < n ? 0 : 40}px)` }}>
      <Chile x={150} y={200} col={c} w={170} hh={330} r={-6} />
      <div style={{ position: "absolute", left: 0, width: 300, top: 420, textAlign: "center", fontFamily: HAND, fontSize: 80, color: i === 3 ? RED : MZ }}>{i < 3 ? i + 1 : "4"}</div>
      {i === 3 && <svg width={300} height={520} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 20 40 L 280 480 M 280 40 L 20 480" stroke={RED} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={`${tach} 1`} /></svg>}
    </div>)}
    <Flame x={960} y={1040} k={0.5} tt={tt} s={2.2} />
    <Tag tt={tt} at={4.4} x={1500} y={300} txt="QUEMADO = MOLE AMARGO" col={RED} size={36} />
  </>;
}}</Stage>;

// 5 · TINA: los chiles se hinchan en agua caliente y el agua oscura se va por un lado
const HTina: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sw = eio(tt, 0.6, 2.6), tilt = eio(tt, 3.0, 4.2), dark = cl(tt / 2.6);
  return <>
    <Head tt={tt} kick="TRUCO 5" title="EL AGUA DEL REMOJO SE TIRA" />
    <div style={{ position: "absolute", left: 540, top: 440, width: 840, height: 440, transformOrigin: "100% 100%", transform: `rotate(${-14 * tilt}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 200px 200px", background: "linear-gradient(90deg,#7a3a1e,#b8643a 45%,#5a2a12)", boxShadow: "0 50px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 50, bottom: 20, borderRadius: "20px 20px 180px 180px", background: `rgba(${lerp(160, 70, dark)},${lerp(90, 22, dark)},${lerp(60, 14, dark)},.85)` }} />
        {Array.from({ length: 7 }, (_, i) => <Chile key={i} x={120 + i * 100} y={210 + 20 * Math.sin(tt * 2 + i)} w={lerp(90, 130, sw)} hh={lerp(200, 250, sw)} r={70 + i * 8} col="#6a1712" />)}
      </div>
    </div>
    {tilt > 0.3 && <div style={{ position: "absolute", left: 1370, top: 820, width: 50, height: 260 * cl((tilt - 0.3) * 2), borderRadius: 25, background: "linear-gradient(180deg,rgba(70,22,14,.9),rgba(70,22,14,.3))" }} />}
    <Tag tt={tt} at={1.8} x={420} y={340} txt="SE HINCHAN EN 15 MIN" col={MZ} size={34} />
    <Tag tt={tt} at={3.6} x={1560} y={560} txt="ESA AGUA AMARGA" col={RED} size={38} />
  </>;
}}</Stage>;

// 6 · CINTA: cada ingrediente viaja por una banda y cae a SU sartén
const HCinta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const I = [["ALMENDRA", "#c08a52"], ["PASA", "#3a1a20"], ["CACAHUATE", "#d7a86a"], ["PLÁTANO", "#e9c96a"], ["TORTILLA", "#e2c27e"]];
  return <>
    <Head tt={tt} kick="TRUCO 6" title="CADA COSA SE FRÍE SOLA" />
    <div style={{ position: "absolute", left: 140, top: 420, width: 1640, height: 60, borderRadius: 30, background: "repeating-linear-gradient(90deg,#3a3430 0 40px,#4b4440 40px 80px)", backgroundPosition: `${tt * 160}px 0`, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    {I.map(([n, c], i) => { const x0 = 200 + i * 330, a = 0.8 + i * 0.5, fall = cl((tt - a) / 0.5);
      return <React.Fragment key={n}>
        <div style={{ position: "absolute", left: x0 - 140, top: 780, width: 280, height: 90, borderRadius: "0 0 140px 140px", background: "linear-gradient(180deg,#2c2826,#121010)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: x0 + 130, top: 800, width: 150, height: 22, borderRadius: 11, background: "#1a1716" }} />
        <div style={{ position: "absolute", left: x0 - 45, top: lerp(350, 740, fall * fall), width: 90, height: 90, borderRadius: n === "PLÁTANO" ? "45px 45px 20px 20px" : "50%", background: `radial-gradient(circle at 35% 30%,#fff5,${c} 50%,rgba(0,0,0,.6))`, transform: `rotate(${fall * 200}deg)` }} />
        <div style={{ position: "absolute", left: x0 - 140, width: 280, top: 900, textAlign: "center", fontWeight: 900, fontSize: 28, color: fall > 0.9 ? TX : DIM }}>{n}</div>
        {fall > 0.9 && <div style={{ position: "absolute", left: x0 - 60, top: 700, width: 120, height: 80, background: "radial-gradient(ellipse,rgba(255,255,255,.25),transparent 70%)", filter: "blur(6px)", transform: `translateY(${-30 * Math.sin(tt * 3 + i)}px)` }} />}
      </React.Fragment>; })}
    <Tag tt={tt} at={3.6} x={960} y={1010} txt="CADA UNA TIENE SU PUNTO" col={MZ} size={34} />
  </>;
}}</Stage>;

// 7 · ESCALERA DE INGREDIENTES: bajan en orden por una cascada de repisas (de lo más duro a lo más suave)
const HOrden: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const O = ["1 ALMENDRA", "2 CACAHUATE", "3 AJONJOLÍ", "4 PASA", "5 PLÁTANO", "6 TORTILLA Y PAN"];
  return <>
    <Head tt={tt} kick="TRUCO 7" title="EL ORDEN EN EL SARTÉN" />
    {O.map((n, i) => { const k = cl(phys(tt, 0.5 + i * 0.55, 6, 0.5)); return <div key={n} style={{ position: "absolute", left: 360 + i * 200, top: 280 + i * 100, opacity: cl(k * 2), transform: `translateX(${(1 - k) * -200}px)` }}>
      <div style={{ width: 300, height: 26, background: "linear-gradient(180deg,#a87a44,#6b4a2a)", borderRadius: 6, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 0, top: -64, fontWeight: 900, fontSize: 34, color: i === Math.floor((tt - 0.5) / 0.55) ? MZ : TX, whiteSpace: "nowrap" }}>{n}</div>
    </div>; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M 380 200 C 900 200, 1500 700, 1640 920" stroke="rgba(255,255,255,.35)" strokeWidth={6} fill="none" strokeDasharray="14 18" strokeDashoffset={-tt * 40} /></svg>
    <Tag tt={tt} at={4.0} x={1560} y={300} txt="DE LO DURO A LO SUAVE" col={MZ} size={36} />
  </>;
}}</Stage>;

// 8 · AJONJOLÍ: las semillas saltan en el comal con física, la cuchara las mueve sin parar
const HAjonjoli: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#24120a">{(tt) => {
  const gold = cl(tt / 4.5);
  return <>
    <Head tt={tt} kick="TRUCO 8" title="SIN DEJAR DE MOVER" />
    <div style={{ position: "absolute", left: 960 - 460, top: 560, width: 920, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%,#3a3330,#141110)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" }} />
    {Array.from({ length: 90 }, (_, i) => { const ph = (tt * (1.3 + rnd(i) * 0.8) + rnd(i + 7)) % 1, jump = Math.sin(ph * Math.PI) * (40 + rnd(i + 2) * 90) * (ph < 0.5 ? 1 : 1);
      return <Seed key={i} x={600 + rnd(i) * 720} y={680 + rnd(i + 1) * 110 - jump} r={rnd(i) * 360 + tt * 200 * rnd(i)} s={1.3} col={`rgb(${lerp(240, 205, gold)},${lerp(226, 160, gold)},${lerp(190, 70, gold)})`} />; })}
    <div style={{ position: "absolute", left: 900 + 160 * Math.sin(tt * 2.4), top: 420, width: 46, height: 380, borderRadius: 23, background: "linear-gradient(90deg,#7a5530,#b07a44)", transform: `rotate(${18 * Math.sin(tt * 2.4)}deg)`, transformOrigin: "50% 0" }} />
    <Tag tt={tt} at={1.4} x={1560} y={360} txt="SE QUEMA EN 10 SEGUNDOS" col={RED} size={34} />
    <Tag tt={tt} at={3.4} x={1560} y={470} txt="DORADITO Y BRINCANDO" col={MZ} size={36} />
  </>;
}}</Stage>;

// 9 · MEDIDOR DE ESPESOR: la cuchara sale del mole y el velo baja lento; tortilla y bolillo lo engrosan
const HNape: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const th = eio(tt, 1.6, 3.8);
  return <>
    <Head tt={tt} kick="TRUCO 9" title="TORTILLA SECA Y BOLILLO ESPESAN" />
    <div style={{ position: "absolute", left: 820, top: 220, width: 120, height: 520, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(90deg,#8a5a30,#c0864c 50%,#7a4c26)", transform: "rotate(-8deg)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: lerp(80, 420, th), background: "linear-gradient(180deg,#3a120c,#5a1c12)", borderRadius: "60px 60px 40% 40%" }} />
    </div>
    {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 856 + i * 16, top: 700 + ((tt * lerp(260, 60, th) + i * 70) % 220), width: 14, height: 30, borderRadius: 7, background: "#4a160e" }} />)}
    <div style={{ position: "absolute", left: 340, top: 500 - 260 * cl(phys(tt, 0.6, 6, 0.5)) + 260, opacity: cl(phys(tt, 0.6, 6, 0.5)) }}>
      <div style={{ width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 42% 38%,#e6cc90,#b8924c)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 30, color: TX, marginTop: 20 }}>TORTILLA DORADA</div></div>
    <div style={{ position: "absolute", left: 1240, top: 540, opacity: cl(phys(tt, 1.0, 6, 0.5)) }}>
      <div style={{ width: 320, height: 160, borderRadius: "80px", background: "radial-gradient(ellipse at 40% 30%,#f0c886,#b77a38)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 30, color: TX, marginTop: 20 }}>BOLILLO DURO</div></div>
    <Tag tt={tt} at={3.6} x={960} y={960} txt="QUE CUBRA LA CUCHARA" col={MZ} size={40} />
  </>;
}}</Stage>;

// 10 · ESPECIERO GIRATORIO: el carrusel gira y cada especia muestra su cuenta exacta
const HEspeciero: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a120c">{(tt) => {
  const E = [["CLAVO", "3"], ["PIMIENTA", "5"], ["CANELA", "1 RAJITA"], ["COMINO", "UNA PIZCA"], ["ANÍS", "4 ESTRELLAS"], ["ORÉGANO", "1 CDITA"]], rot = tt * 30;
  return <>
    <Head tt={tt} kick="TRUCO 10" title="LAS ESPECIAS SE CUENTAN" />
    {E.map(([n, q], i) => { const a = (i / E.length) * Math.PI * 2 + rot * Math.PI / 180, z = Math.cos(a), x = 960 + Math.sin(a) * 480, y = 560 + z * 60, s = 0.7 + 0.3 * (z + 1) / 2;
      return <div key={n} style={{ position: "absolute", left: x - 100 * s, top: y - 150 * s, width: 200 * s, height: 280 * s, zIndex: Math.round(z * 10 + 10), opacity: 0.5 + 0.5 * (z + 1) / 2 }}>
        <div style={{ width: "100%", height: "70%", borderRadius: 18, background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.05) 40%,rgba(255,255,255,.2))", border: "3px solid rgba(255,255,255,.3)", position: "relative" }}>
          <div style={{ position: "absolute", left: 10, right: 10, bottom: 8, height: "55%", borderRadius: 10, background: ["#4a2418", "#2a2a24", "#8a5a30", "#a07a3a", "#5a3020", "#5a6a2a"][i] }} /></div>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 30 * s, color: TX, marginTop: 6 }}>{n}</div>
        <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 36 * s, color: MZ }}>{q}</div>
      </div>; })}
    <div style={{ position: "absolute", left: 960 - 520, top: 700, width: 1040, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,#6b4a2a,#3a2614)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
  </>;
}}</Stage>;

// 11 · COMAL CON ZONAS: termómetro de color por zonas; el jitomate va a la orilla, el tomate al centro
const HZonas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1e0f08">{(tt) => {
  const ch = eio(tt, 1.6, 4.4);
  return <>
    <Head tt={tt} kick="TRUCO 11" title="ASADOS EN EL COMAL" />
    <div style={{ position: "absolute", left: 960 - 480, top: 300, width: 960, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,30,.55) 0 22%, rgba(255,160,60,.35) 22% 48%, rgba(255,220,120,.18) 48% 70%, #1a1514 70%)", boxShadow: "0 50px 80px rgba(0,0,0,.7)" }} />
    {[[960, 600, "#3f7a2a", "TOMATE"], [620, 600, "#c0321e", "JITOMATE"], [1300, 600, "#c0321e", "JITOMATE"], [960, 400, "#f2efe2", "AJO"]].map(([x, y, c, n], i) => <div key={i} style={{ position: "absolute", left: (x as number) - 80, top: (y as number) - 80, opacity: cl(phys(tt, 0.4 + i * 0.3, 6, 0.5)) }}>
      <div style={{ width: 160, height: 150, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%,#fff6,${c} 50%,#000a)`, position: "relative", overflow: "hidden" }}>
        {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: 20 + rnd(j + i * 9) * 110, top: 20 + rnd(j + i * 9 + 3) * 100, width: 30, height: 22, borderRadius: "50%", background: "#140805", opacity: ch * 0.85 }} />)}
      </div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 26, color: TX, marginTop: 6 }}>{n}</div></div>)}
    <Tag tt={tt} at={3.0} x={1600} y={330} txt="CENTRO = MÁS FUEGO" col={RED} size={32} />
    <Tag tt={tt} at={3.6} x={1600} y={430} txt="LA PIEL NEGRITA, NO CARBÓN" col={MZ} size={30} />
  </>;
}}</Stage>;

// 12 · COLADOR: la pasta pasa en hilos por la malla y el bagazo se queda arriba
const HColador: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = eio(tt, 0.8, 4.4);
  return <>
    <Head tt={tt} kick="TRUCO 12" title="POR TANDAS, Y SE CUELA" />
    <div style={{ position: "absolute", left: 660, top: 300, width: 600, height: 300, borderRadius: "0 0 300px 300px", background: "repeating-linear-gradient(45deg,rgba(200,200,200,.6) 0 3px,transparent 3px 12px),repeating-linear-gradient(-45deg,rgba(200,200,200,.6) 0 3px,transparent 3px 12px)", border: "6px solid #9aa0a3", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 30, height: lerp(160, 50, f), borderRadius: "0 0 200px 200px", background: "radial-gradient(ellipse at 50% 30%,#7a2a18,#3a120a)" }} />
      {f > 0.5 && Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 140 + rnd(i) * 320, top: 210 + rnd(i + 3) * 40, width: 14, height: 8, borderRadius: 4, background: "#c9a06a" }} />)}
    </div>
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 800 + i * 36, top: 600, width: 10, height: 220 * cl(f * 1.4 - i * 0.03), borderRadius: 5, background: "linear-gradient(180deg,#5a1c12,#3a120c)" }} />)}
    <div style={{ position: "absolute", left: 660, top: 820, width: 600, height: 160, borderRadius: "0 0 300px 300px", background: "linear-gradient(180deg,#b35a32,#6b2f17)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 10, height: 60 * f, borderRadius: "50%", background: "#4a160e" }} /></div>
    <Tag tt={tt} at={3.4} x={1520} y={420} txt="EL BAGAZO NO VA" col={RED} size={36} />
    <Tag tt={tt} at={4.0} x={1520} y={700} txt="TERCIOPELO" col={MZ} size={44} hand />
  </>;
}}</Stage>;

// 13 · ONDAS: la pasta cae a la manteca y el chisporroteo se dibuja como ondas de sonido
const HChilla: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#160a06">{(tt) => {
  const hit = cl((tt - 1.0) / 0.2), amp = hit * Math.exp(-(tt - 1.2) * 0.35) * 1.2;
  return <>
    <Head tt={tt} kick="TRUCO 13" title="TIENE QUE CHILLAR" />
    <Olla x={960} y={900} w={620} lvl={0.4} steam={hit * 0.9} tt={tt} />
    <div style={{ position: "absolute", left: 900, top: lerp(140, 640, cl(tt / 1.0)), width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#7a2414,#3a0e08)", opacity: 1 - hit }} />
    <svg width={1920} height={500} style={{ position: "absolute", left: 0, top: 220 }}>
      {[0, 1, 2].map((k) => <path key={k} d={Array.from({ length: 120 }, (_, i) => { const x = 160 + i * 13.3, y = 250 + Math.sin(i * 0.9 + tt * 14 + k) * (40 + 80 * rnd(i + k * 50)) * amp * (1 - Math.abs(i - 60) / 70); return `${i ? "L" : "M"} ${x} ${y}`; }).join(" ")} stroke={k ? "rgba(255,200,120,.35)" : MZ} strokeWidth={k ? 3 : 6} fill="none" />)}
    </svg>
    <Tag tt={tt} at={1.6} x={1560} y={760} txt="¡SHHHH!" col={TX} size={60} hand />
    <Tag tt={tt} at={2.6} x={1560} y={880} txt="SI NO CHILLA, SABE A CRUDO" col={RED} size={30} />
  </>;
}}</Stage>;

// 14 · MACRO DE LA SUPERFICIE: el mole oscuro hace burbujas y brotan gotitas de grasa brillante
const HGrasa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#140604">{(tt) => {
  const g = eio(tt, 1.2, 4.0);
  return <>
    <Head tt={tt} kick="TRUCO 14" title="CUANDO BROTA LA GRASA" />
    <div style={{ position: "absolute", left: 260, top: 260, width: 1400, height: 700, borderRadius: 40, background: "radial-gradient(ellipse at 40% 35%,#4a140c,#240806 70%)", boxShadow: "inset 0 0 120px rgba(0,0,0,.8), 0 40px 70px rgba(0,0,0,.6)", overflow: "hidden", transform: `perspective(1600px) rotateX(${28 + 3 * Math.sin(tt * 0.4)}deg)` }}>
      {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 0.6 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: rnd(i + 3) * 1300, top: rnd(i + 8) * 620, width: 40 + 80 * ph, height: 40 + 80 * ph, borderRadius: "50%", border: `3px solid rgba(120,40,20,${1 - ph})` }} />; })}
      {Array.from({ length: 40 }, (_, i) => { const k = cl(g * 1.6 - rnd(i) * 0.6); return <div key={i} style={{ position: "absolute", left: rnd(i + 11) * 1340, top: rnd(i + 21) * 650, width: 18 + 34 * rnd(i) * k, height: 12 + 22 * rnd(i) * k, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff8,#d99a3a 40%,rgba(160,80,20,.6))", opacity: k }} />; })}
    </div>
    <Tag tt={tt} at={3.2} x={960} y={1010} txt="LA GRASITA ARRIBA = YA SE FRIÓ" col={MZ} size={36} />
  </>;
}}</Stage>;

// 15 · JARRA: el caldo cae de a cucharón y la jarra muestra las marcas que van bajando
const HJarra: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const n = Math.min(4, Math.floor(cl((tt - 0.6) / 4) * 4) + 1), lv = 1 - (n - 1) / 5 - cl(((tt - 0.6) % 1) * 2) * 0.05;
  return <>
    <Head tt={tt} kick="TRUCO 15" title="EL CALDO, DE A CUCHARÓN" />
    <div style={{ position: "absolute", left: 360, top: 280, width: 360, height: 560, borderRadius: "40px 40px 80px 80px", background: "rgba(255,255,255,.08)", border: "5px solid rgba(255,255,255,.35)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 85}%`, background: "linear-gradient(180deg,#d9a85a,#a87436)" }} />
      {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: 20, top: 560 - i * 95, width: 60, height: 4, background: "rgba(255,255,255,.7)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 860, top: 300, width: 220, height: 30, borderRadius: 15, background: "#9aa0a3", transform: `rotate(${-30 + 50 * cl(((tt - 0.6) % 1) * 2)}deg)`, transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", right: -60, top: -40, width: 120, height: 80, borderRadius: "0 0 60px 60px", background: "#b8bcbf" }} /></div>
    <Olla x={1300} y={900} w={560} lvl={0.5} steam={0.4} tt={tt} />
    <Tag tt={tt} at={0.8} x={1560} y={300} txt={`CUCHARÓN ${n}`} col={MZ} size={50} />
    <Tag tt={tt} at={2.4} x={1560} y={410} txt="SE MUEVE Y SE ESPERA" col={TX} size={32} />
  </>;
}}</Stage>;

// 16 · DESLIZADOR DULCE-AMARGO: la tablilla de chocolate se derrite y la aguja va al centro
const HChocolate: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c0e08">{(tt) => {
  const m = eio(tt, 1.0, 3.6), nd = lerp(0.12, 0.5, eio(tt, 1.4, 3.8)) + 0.02 * Math.sin(tt * 3) * (1 - m);
  return <>
    <Head tt={tt} kick="TRUCO 16" title="EL CHOCOLATE, O NADA" />
    <div style={{ position: "absolute", left: 360, top: 360, width: 1200, height: 40, borderRadius: 20, background: "linear-gradient(90deg,#e9c96a,#8a5a30,#2a0d0a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 360 + nd * 1200 - 30, top: 330, width: 60, height: 100, borderRadius: 14, background: TX, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 360, top: 430, fontWeight: 900, fontSize: 32, color: MZ }}>DULCE</div><div style={{ position: "absolute", left: 1420, top: 430, fontWeight: 900, fontSize: 32, color: RED }}>AMARGO</div>
    <div style={{ position: "absolute", left: 760, top: 600, width: 400, height: lerp(200, 90, m), borderRadius: lerp(10, 80, m), background: "linear-gradient(180deg,#5a2a16,#3a1a0e)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", transform: `translateY(${m * 120}px) scaleX(${1 + m * 0.4})` }}>
      {m < 0.5 && Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 10 + (i % 4) * 97, top: 10 + Math.floor(i / 4) * 92, width: 86, height: 82, borderRadius: 8, border: "3px solid rgba(0,0,0,.35)" }} />)}
    </div>
    <Tag tt={tt} at={4.0} x={960} y={980} txt="SÓLO PARA REDONDEAR" col={MZ} size={36} />
  </>;
}}</Stage>;

// 17 · CUCHARA DE PALO: el dedo raya el dorso de la cuchara y la línea NO se cierra
const HCuchara: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const d = eio(tt, 1.2, 2.4);
  return <>
    <Head tt={tt} kick="TRUCO 17" title="EL PUNTO DE LA CUCHARA" />
    <div style={{ position: "absolute", left: 560, top: 330, width: 800, height: 420, borderRadius: "210px", background: "radial-gradient(ellipse at 45% 40%,#4a160e,#2a0a06)", border: "24px solid #a87044", boxShadow: "0 50px 80px rgba(0,0,0,.6)", transform: `perspective(1500px) rotateX(18deg) rotateZ(${-6 + 2 * Math.sin(tt * 0.5)}deg)` }}>
      <div style={{ position: "absolute", left: 40 + d * 640, top: 40, width: 50, height: 290, borderRadius: 25, background: "linear-gradient(180deg,#e7b394,#c98c6c)", opacity: d < 1 ? 1 : 1 - cl(tt - 2.6) }} />
      <div style={{ position: "absolute", left: 60, top: 180, width: 640 * d, height: 24, borderRadius: 12, background: "#a87044", boxShadow: "inset 0 3px 6px rgba(0,0,0,.4)" }} />
    </div>
    <div style={{ position: "absolute", left: 1360, top: 520, width: 420, height: 36, borderRadius: 18, background: "linear-gradient(180deg,#b07a44,#7a5530)" }} />
    <Tag tt={tt} at={3.0} x={960} y={880} txt="LA RAYA SE QUEDA = LISTO" col={MZ} size={42} />
  </>;
}}</Stage>;

// 18 · LÍNEA DE VIDA: frasco de pasta que viaja por los meses (refri 1, congelado 6)
const HMeses: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.8, 4.4), M = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL"];
  return <>
    <Head tt={tt} kick="TRUCO 18" title="LA PASTA GUARDADA DURA MESES" />
    <div style={{ position: "absolute", left: 220, top: 640, width: 1480, height: 10, background: "rgba(255,255,255,.35)", borderRadius: 5 }} />
    <div style={{ position: "absolute", left: 220, top: 640, width: 1480 * k, height: 10, background: MZ, borderRadius: 5 }} />
    {M.map((m, i) => <div key={m} style={{ position: "absolute", left: 220 + i * 246 - 40, top: 680, width: 80, textAlign: "center", fontWeight: 900, fontSize: 30, color: k * 6 >= i ? TX : DIM }}>{m}</div>)}
    <div style={{ position: "absolute", left: 220 + 246 - 120, top: 520, width: 240, padding: "10px 0", borderRadius: 14, background: "#2a5a7a", textAlign: "center", fontWeight: 900, fontSize: 26, color: TX, opacity: cl(tt - 1.4) }}>REFRI: 1 MES</div>
    <div style={{ position: "absolute", left: 220 + 6 * 246 - 150, top: 520, width: 300, padding: "10px 0", borderRadius: 14, background: "#5a7a9a", textAlign: "center", fontWeight: 900, fontSize: 26, color: TX, opacity: cl(tt - 3.6) }}>CONGELADA: 6 MESES</div>
    <div style={{ position: "absolute", left: 220 + 1480 * k - 80, top: 300, width: 160, height: 200, borderRadius: "20px 20px 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.05))", border: "4px solid rgba(255,255,255,.4)", transform: `rotate(${4 * Math.sin(tt * 2)}deg)` }}>
      <div style={{ position: "absolute", left: -8, right: -8, top: -26, height: 30, borderRadius: 8, background: "#9a2a22" }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: "70%", borderRadius: 14, background: "#3a120c", boxShadow: k > 0.8 ? "inset 0 0 30px rgba(180,220,255,.6)" : "none" }} />
    </div>
  </>;
}}</Stage>;

// 19 · DOS GOTAS: la caliente cae rápido, la fría cuelga lenta; el reloj de arena entre las dos
const HGotas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a0f0a">{(tt) => {
  const fa = ((tt * 1.4) % 1), sl = cl((tt - 0.6) / 4.2);
  return <>
    <Head tt={tt} kick="TRUCO 19" title="AL ENFRIAR SE ESPESA" />
    {[[560, "CALIENTE", fa, RED], [1360, "FRÍO", sl, "#7ab0d9"]].map(([x, n, p, c], i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: (x as number) - 120, top: 260, width: 240, height: 60, borderRadius: "0 0 120px 120px", background: "linear-gradient(180deg,#a87044,#6b4426)" }} />
      <div style={{ position: "absolute", left: (x as number) - 26, top: 300, width: 52, height: 40 + (p as number) * (i ? 260 : 40), borderRadius: "26px 26px 30px 30px", background: "linear-gradient(180deg,#5a1c12,#3a0e08)" }} />
      {i === 0 && <div style={{ position: "absolute", left: (x as number) - 26, top: 360 + (p as number) * 520, width: 52, height: 64, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#4a160e" }} />}
      <div style={{ position: "absolute", left: (x as number) - 200, top: 920, width: 400, textAlign: "center", fontWeight: 900, fontSize: 40, color: c as string }}>{n}</div>
    </React.Fragment>)}
    <Tag tt={tt} at={2.4} x={960} y={600} txt="NO LE ECHE CALDO EN CALIENTE" col={MZ} size={32} />
  </>;
}}</Stage>;

// 20 · BAÑO MARÍA EN CORTE: la olla chica dentro de la grande, burbujas abajo, el mole quieto arriba
const HBanoMaria: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <>
  <Head tt={tt} kick="TRUCO 20" title="RECALENTADO EN BAÑO MARÍA" />
  <div style={{ position: "absolute", left: 460, top: 360, width: 1000, height: 560, borderRadius: "30px 30px 200px 200px", background: "linear-gradient(90deg,#5d6a70,#8b989e 45%,#4f5a60)", boxShadow: "0 60px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 24, right: 24, top: 120, bottom: 24, borderRadius: "10px 10px 180px 180px", background: "linear-gradient(180deg,rgba(150,200,220,.5),rgba(70,110,130,.85))" }} />
    {Array.from({ length: 24 }, (_, i) => { const ph = (tt * (0.7 + rnd(i) * 0.6) + rnd(i + 3)) % 1; return <div key={i} style={{ position: "absolute", left: 60 + rnd(i + 5) * 880, top: lerp(520, 140, ph), width: 14 + rnd(i) * 16, height: 14 + rnd(i) * 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,.6)", opacity: 1 - ph }} />; })}
    <div style={{ position: "absolute", left: 250, top: 60, width: 500, height: 360, borderRadius: "20px 20px 140px 140px", background: "linear-gradient(90deg,#6b2f17,#b35a32 45%,#4a1f0f)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 30, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse,#5a1c12,#2a0a06)" }} /></div>
  </div>
  <Flame x={960} y={990} k={0.4} tt={tt} s={1.6} />
  <Tag tt={tt} at={2.4} x={1640} y={480} txt="NO SE PEGA" col={MZ} size={40} />
  <Tag tt={tt} at={3.2} x={1640} y={580} txt="NO SE QUEMA" col={MZ} size={40} />
</>}</Stage>;

// 21 · CARRUSEL 3D: tres frascos (rojo, verde, negro) giran y el del frente dice para qué
const HCarrusel: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#140c0a">{(tt) => {
  const F = [["ROJO", "#a8281a", "POLLO Y FIESTA"], ["VERDE", "#4f7a2a", "PUERCO Y PIPIÁN"], ["NEGRO", "#1a0a08", "GUAJOLOTE Y BODA"]], rot = eio(tt, 0.5, 5.2) * 360;
  const front = Math.round(((rot % 360) / 120)) % 3;
  return <>
    <Head tt={tt} kick="TRUCO 21" title="ROJO, VERDE Y NEGRO" />
    {F.map(([n, c], i) => { const a = (i * 120 - rot) * Math.PI / 180, z = Math.cos(a), x = 960 + Math.sin(a) * 420, s = 0.65 + 0.35 * (z + 1) / 2;
      return <div key={n} style={{ position: "absolute", left: x - 140 * s, top: 560 - 220 * s, width: 280 * s, height: 400 * s, zIndex: Math.round(z * 10 + 10) }}>
        <div style={{ position: "absolute", left: -10 * s, right: -10 * s, top: -30 * s, height: 50 * s, borderRadius: 12, background: "#9a7422" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: `${30 * s}px`, background: `linear-gradient(90deg,rgba(255,255,255,.22),rgba(255,255,255,.04) 40%,rgba(255,255,255,.18)), ${c}`, boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "40%", textAlign: "center", fontWeight: 900, fontSize: 44 * s, color: TX }}>{n}</div>
      </div>; })}
    <div style={{ position: "absolute", left: 460, width: 1000, top: 900, textAlign: "center", fontFamily: HAND, fontSize: 52, color: MZ }}>{F[front][2]}</div>
  </>;
}}</Stage>;

// 22 · MESA DE FIESTA: los platos caen uno por uno sobre el mantel y el contador sube a 20
const HFiesta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.min(20, Math.floor(cl((tt - 0.6) / 3.8) * 20));
  return <>
    <Head tt={tt} kick="TRUCO 22" title="MOLE PARA VEINTE" />
    <div style={{ position: "absolute", left: 220, top: 360, width: 1480, height: 560, background: "repeating-linear-gradient(90deg,#b8342a 0 60px,#f1e6d0 60px 120px)", transform: "perspective(1400px) rotateX(48deg)", boxShadow: "0 60px 90px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 20 }, (_, i) => { const k = cl(phys(tt, 0.6 + i * 0.19, 8, 0.4)); return <div key={i} style={{ position: "absolute", left: 60 + (i % 10) * 140, top: 70 + Math.floor(i / 10) * 260 - (1 - k) * 300, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#4a140c 0 42%,#f4ead6 44% 70%,#d8ccb2)", opacity: cl(k * 2), boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} />; })}
    </div>
    <div style={{ position: "absolute", left: 1520, top: 220, fontWeight: 900, fontSize: 120, color: MZ }}>{n}</div>
    <Tag tt={tt} at={4.4} x={960} y={990} txt="1 KG DE PASTA = 20 PLATOS" col={TX} size={38} />
  </>;
}}</Stage>;

// 23 · POSTAL: una postal de Michoacán cae girando y un sello la estampa (gallina de rancho y su caldo)
const HPostal: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#20160c">{(tt) => {
  const k = cl(phys(tt, 0.4, 5, 0.55)), st = cl(phys(tt, 2.6, 9, 0.35));
  return <>
    <Head tt={tt} kick="TRUCO 23" title="EL POLLO DE RANCHO Y SU CALDO" />
    <div style={{ position: "absolute", left: 460, top: 260, width: 1000, height: 640, borderRadius: 14, background: "#efe2c4", boxShadow: "0 50px 80px rgba(0,0,0,.6)", transform: `perspective(1600px) rotateX(${(1 - k) * 70}deg) rotateZ(${(1 - k) * -20 - 3}deg) translateY(${(1 - k) * -300}px)`, padding: 30 }}>
      <div style={{ position: "absolute", left: 30, top: 30, width: 560, height: 580 }}><Photo id={h.bg} w={560} h={580} r={8} /></div>
      <div style={{ position: "absolute", left: 620, top: 60, fontFamily: HAND, fontSize: 44, color: TIN, lineHeight: 1.2 }}>Saludos de<br />Michoacán</div>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 620, top: 330 + i * 70, width: 330, height: 3, background: "rgba(60,40,20,.4)" }} />)}
      <div style={{ position: "absolute", left: 800, top: 120, width: 150, height: 150, borderRadius: "50%", border: `8px solid ${RED}`, color: RED, fontWeight: 900, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transform: `scale(${lerp(2.4, 1, st)}) rotate(-14deg)`, opacity: st }}>GALLINA<br />DE RANCHO</div>
    </div>
    <Tag tt={tt} at={3.6} x={960} y={980} txt="EL CALDO ES MEDIO MOLE" col={MZ} size={36} />
  </>;
}}</Stage>;

// 24 · TERMOGRAFÍA: el fondo de la cazuela visto en calor; la mancha roja del centro es donde se pega
const HTermo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#06040a">{(tt) => {
  const k = eio(tt, 0.6, 3.0), sp = 0.5 + 0.5 * Math.sin(tt * 3);
  return <>
    <Head tt={tt} kick="TRUCO 24" title="POR QUÉ SE PEGA, Y DÓNDE" />
    <div style={{ position: "absolute", left: 960 - 400, top: 560 - 300, width: 800, height: 600, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 50%, rgba(255,40,20,${k}) 0 ${14 + 4 * sp}%, rgba(255,170,30,${k}) 26%, rgba(240,240,60,${k * 0.8}) 40%, rgba(40,200,120,${k * 0.7}) 56%, rgba(30,60,200,${k * 0.8}) 72%, #0a0a20 74%)`, boxShadow: "0 0 80px rgba(80,120,255,.25)" }} />
    <div style={{ position: "absolute", left: 1460, top: 300, width: 40, height: 520, borderRadius: 20, background: "linear-gradient(180deg,#ff2814,#ffaa1e,#f0f03c,#28c878,#1e3cc8)", opacity: k }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M 980 560 C 1100 440, 1280 360, 1440 340" stroke={TX} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${cl(tt - 2.6)} 1`} /></svg>
    <Tag tt={tt} at={3.2} x={1560} y={250} txt="AQUÍ SE PEGA" col={RED} size={40} />
    <Tag tt={tt} at={4.2} x={960} y={980} txt="CUCHARA HASTA EL FONDO, EN OCHO" col={MZ} size={34} />
  </>;
}}</Stage>;

// 25 · EL SURCO: la cuchara abre un surco en la pasta y se queda abierto; una luz baja por el fondo
const HSurco: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#120604">{(tt) => {
  const d = eio(tt, 0.8, 2.6), glow = cl((tt - 3.0) / 1.2);
  return <>
    <Head tt={tt} kick="TRUCO 25" title="LA SEÑAL DE LA CUCHARA" />
    <div style={{ position: "absolute", left: 300, top: 300, width: 1320, height: 640, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#4a140c,#200604 70%)", boxShadow: "0 50px 90px rgba(0,0,0,.7), inset 0 0 80px rgba(0,0,0,.7)", transform: "perspective(1600px) rotateX(40deg)" }}>
      <div style={{ position: "absolute", left: 160, top: 300, width: 1000 * d, height: 46, borderRadius: 23, background: `linear-gradient(180deg,#140402,#3a0e08)`, boxShadow: `0 0 ${50 * glow}px ${16 * glow}px rgba(255,190,90,${0.55 * glow}), inset 0 6px 10px rgba(0,0,0,.8)` }} />
    </div>
    <div style={{ position: "absolute", left: 460 + 1000 * d * 0.98, top: 380, width: 60, height: 360, borderRadius: 30, background: "linear-gradient(90deg,#7a5530,#b07a44)", transform: "rotate(30deg)", opacity: 1 - glow }} />
    <Tag tt={tt} at={3.2} x={960} y={220} txt="SE VE EL FONDO = YA SE COCINÓ" col={MZ} size={42} />
  </>;
}}</Stage>;

// A · ERRORES: cinco chiles de papel con su foto; al nombrarse cada uno, la orilla se quema y se enrosca
const HQuemados: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#200806">{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="LOS 5 ERRORES" title="QUE AMARGAN EL MOLE" col={RED} />
    {E.map((e, i) => { const k = cl(phys(t, e.a, 6, 0.5)), burn = eio(t, e.a + 0.3, e.a + 2.2), cur = E.reduce((c, q, j) => (t >= q.a ? j : c), -1) === i;
      return <div key={i} style={{ position: "absolute", left: 250 + i * 290, top: 320 + (i % 2) * 40, width: 260, height: 520, opacity: cl(k * 2), transform: `translateY(${(1 - k) * 160}px) rotate(${(i - 2) * 3}deg)` }}>
        <div style={{ position: "absolute", inset: 0, background: "#efe2c4", borderRadius: "130px 130px 100px 100px / 120px 120px 260px 260px", boxShadow: "0 30px 50px rgba(0,0,0,.6)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 20, top: 40 }}><Photo id={im(h, i)} w={220} h={260} r={110} dim={cur ? 0 : 0.4} /></div>
          <div style={{ position: "absolute", left: 10, right: 10, top: 330, textAlign: "center", fontWeight: 900, fontSize: 28, color: TIN }}><span style={{ color: RED, fontSize: 44 }}>{i + 1}</span><br />{e.tx}</div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${burn * 26}%`, background: "linear-gradient(0deg,#120604 60%,#5a2008 85%,rgba(255,140,40,.8))", filter: "blur(1px)" }} />
        </div>
        {burn > 0 && burn < 1 && <div style={{ position: "absolute", left: 40, right: 40, bottom: `${burn * 24}%`, height: 30, background: "radial-gradient(ellipse,rgba(255,170,60,.9),transparent 70%)", filter: "blur(4px)" }} />}
      </div>; })}
  </>;
}}</Stage>;

// B · RECETARIO: el cuaderno pasa sus páginas solo; cada paso queda escrito a mano con su foto pegada
const HRecetario: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1c120a">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = Math.max(0, S.reduce((c, e, i) => (t >= e.a ? i : c), -1)), flip = eio(t, S[cur]?.a ?? 0, (S[cur]?.a ?? 0) + 0.8);
  return <>
    <Head tt={tt} kick="LA RUTINA COMPLETA" title="DEL CHILE A LA OLLA" />
    <div style={{ position: "absolute", left: 360, top: 260, width: 1200, height: 700, background: "#6b3a1e", borderRadius: 20, boxShadow: "0 50px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 380, top: 280, width: 580, height: 660, background: "#f3e8cc", borderRadius: "12px 0 0 12px", boxShadow: "inset -20px 0 40px rgba(0,0,0,.2)" }}>
      <div style={{ position: "absolute", left: 40, top: 40 }}><Photo id={im(h, cur)} w={500} h={340} r={6} /></div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 420, fontFamily: HAND, fontSize: 54, color: TIN }}><span style={{ color: BR }}>{cur + 1}.</span> {S[cur]?.tx}</div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 280, width: 580, height: 660, background: "#f3e8cc", borderRadius: "0 12px 12px 0", padding: 40 }}>
      {S.slice(0, cur + 1).map((s, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 40, color: i === cur ? TIN : "#8a7a60", marginBottom: 10 }}>{i + 1}. {s.tx}</div>)}
    </div>
    <div style={{ position: "absolute", left: 960, top: 280, width: 580, height: 660, background: "linear-gradient(90deg,#e6d8b4,#f3e8cc)", transformOrigin: "0 50%", transform: `perspective(1800px) rotateY(${-180 * flip}deg)`, opacity: flip < 1 ? 1 : 0, borderRadius: "0 12px 12px 0" }} />
  </>;
}}</Stage>;

// C · PREGUNTAS DE LA FAMILIA: tarjetas de comentario que caen; la respuesta de Cuca se escribe a mano debajo
const HPreguntas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="USTEDES ME PREGUNTARON" title="Y AQUÍ LE CONTESTO" />
    {S.map((s, i) => { const k = cl(phys(t, s.a, 6, 0.5)), [q, r] = s.tx.split("|"), x = 300 + i * 680;
      return <div key={i} style={{ position: "absolute", left: x, top: 300, width: 620, opacity: cl(k * 2), transform: `translateY(${(1 - k) * -260}px) rotate(${(i ? 2 : -2) * k}deg)` }}>
        <div style={{ background: "#f7f3ea", borderRadius: 22, padding: "26px 30px", boxShadow: "0 30px 50px rgba(0,0,0,.6)", display: "flex", gap: 20 }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", flexShrink: 0, background: ["#c0784a", "#6a8ab0"][i % 2] }} />
          <div style={{ fontWeight: 800, fontSize: 36, color: "#2a2420", lineHeight: 1.2 }}>{q}</div>
        </div>
        <div style={{ marginTop: 30, marginLeft: 40, fontFamily: HAND, fontSize: 50, color: MZ, clipPath: `inset(0 ${100 - 100 * cl((t - s.a - 1.0) / 1.2)}% 0 0)` }}>{r}</div>
        <div style={{ marginLeft: 40, marginTop: 20 }}><Photo id={im(h, i)} w={420} h={230} r={14} /></div>
      </div>; })}
  </>;
}}</Stage>;

// D · REPASO: collar de 25 cuentas de barro; cada cuenta se enciende al nombrarse
const HCollar: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a100a">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), -1);
  return <>
    <Head tt={tt} kick="REPASO RÁPIDO" title="LAS CUENTAS DEL MOLE" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M 260 330 Q 960 ${1010 + 8 * Math.sin(tt)} 1660 330`} stroke="#8a6a3a" strokeWidth={4} fill="none" /></svg>
    {S.map((s, i) => { const u = (i + 0.5) / S.length, x = (1 - u) * (1 - u) * 260 + 2 * u * (1 - u) * 960 + u * u * 1660, y = (1 - u) * (1 - u) * 330 + 2 * u * (1 - u) * 1010 + u * u * 330, on = t >= s.a, k = cl(phys(t, s.a, 8, 0.4));
      return <div key={i} style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: "50%", background: on ? "radial-gradient(circle at 35% 30%,#ffe7a0,#e0902e)" : "radial-gradient(circle at 35% 30%,#c08060,#6b3a1e)", boxShadow: on ? `0 0 ${30 * k}px rgba(255,200,90,.8)` : "0 6px 10px rgba(0,0,0,.5)", transform: `scale(${1 + 0.3 * k * (i === cur ? 1 : 0)})` }} />; })}
    <div style={{ position: "absolute", left: 460, width: 1000, top: 470, textAlign: "center", fontFamily: HAND, fontSize: 70, color: MZ }}>{cur >= 0 ? `${cur + 1}. ${S[cur].tx}` : ""}</div>
  </>;
}}</Stage>;

export const MAP: Record<string, C> = { podio: HPodio, dobla: HDobla, explota: HExplota, tueste: HTueste, tina: HTina, cinta: HCinta, orden: HOrden, ajonjoli: HAjonjoli,
  nape: HNape, especiero: HEspeciero, zonas: HZonas, colador: HColador, chilla: HChilla, grasa: HGrasa, jarra: HJarra, chocolate: HChocolate, cuchara: HCuchara,
  meses: HMeses, gotas: HGotas, banomaria: HBanoMaria, carrusel: HCarrusel, fiesta: HFiesta, postal: HPostal, termo: HTermo, surco: HSurco,
  quemados: HQuemados, recetario: HRecetario, preguntas: HPreguntas, collar: HCollar };

import { MAP3 } from "./heroes3d";
Object.assign(MAP, MAP3);

// ── reemplazos por TOPE DEL EVALUADOR (30-oct): los componentes que no pasaron de 6 van como clip Veo de 8 s (manos de Cuca)
import { OffthreadVideo, Sequence, staticFile } from "remotion";
const CLIP_H: Record<string, number> = {};   // k → nº de clips; se llena a medida que llegan los h_<k>*.mp4 a public
const HClip: C = ({ t, h }) => {
  const n = CLIP_H[h.k] ?? 1, seg = (h.out - h.at) / n, i = Math.min(n - 1, Math.max(0, Math.floor((t - h.at) / seg)));
  const o = Math.min(1, (t - h.at + 0.05) / 0.3, (h.out + 0.85 - t) / 0.3);
  return <div style={{ position: "absolute", inset: 0, opacity: Math.max(0, o) }}><Sequence key={i} from={Math.round((h.at - 0.05 + i * seg) * 30)} layout="none"><OffthreadVideo src={staticFile(`cuca29c/${n > 1 ? `h_${h.k}_${i + 1}` : "h_" + h.k}.mp4`)} muted playbackRate={Math.min(1, 7.9 / (seg + 0.9))} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence></div>; };
for (const k of Object.keys(CLIP_H)) MAP[k] = HClip;
