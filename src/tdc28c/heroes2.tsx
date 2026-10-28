// componentes únicos de tdc28c · 17-31 (minutos 10-19): mezcla, proporción y prensa.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Briq, Bucket, Check, Cross, Grains } from "./heroes1";

// tubo de PVC (molde) visto de costado, centrado en x; top = boca
const Pipe: React.FC<{ x: number; top: number; w: number; h: number; fill?: number; op?: number }> = ({ x, top, w, h, fill = 0, op = 1 }) => <div style={{ position: "absolute", left: x - w / 2, top, width: w, height: h, opacity: op }}>
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#7c8288,#e6e9ec 30%,#b9bec3 60%,#6d7378)", borderRadius: 6, opacity: 0.55 }} />
  <div style={{ position: "absolute", left: 8, right: 8, bottom: 0, height: `${fill * 100}%`, background: "linear-gradient(90deg,#141414,#3a3836 40%,#1a1a1a)" }} />
  <div style={{ position: "absolute", inset: 0, borderRadius: 6, boxShadow: "inset 0 0 0 4px rgba(255,255,255,.45)" }} />
</div>;

// ---- 10:19 · SECO CON SECO: bien (gris parejo) contra mal (bolitas de arcilla y carbón suelto) ----
export const HDryFirst: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const mix = eio(tt, 0.8, 3.2), v = cl(tt - 3.6);
  return <>
    <Head tt={tt} kick="EL ORDEN IMPORTA" title="PRIMERO SECO CON SECO" />
    {[0, 1].map((side) => { const x = side ? 1380 : 540, ok = side === 0;
      return <React.Fragment key={side}>
        <div style={{ position: "absolute", left: x - 300, top: 330, width: 600, height: 520, borderRadius: 34, background: "#14120f", boxShadow: `0 0 0 3px ${ok ? GRN : RED}55, 0 30px 70px rgba(0,0,0,.5)`, overflow: "hidden" }}>
          {Array.from({ length: 160 }, (_, i) => { const red = i % 7 === 0, px = 30 + (i * 89) % 540, py = 40 + (i * 53) % 440;
            const c = ok ? (red ? `rgb(${Math.round(176 - 100 * mix)},${Math.round(90 - 30 * mix)},${Math.round(52 - 10 * mix)})` : `rgb(${Math.round(18 + 50 * mix)},${Math.round(18 + 48 * mix)},${Math.round(18 + 46 * mix)})`) : (red ? "#b05a34" : "#121212");
            const s = ok ? 12 : red ? 12 + 26 * mix : 10;
            return <div key={i} style={{ position: "absolute", left: px + (ok ? Math.sin(i + tt * 3) * 10 * (1 - mix) : 0), top: py, width: s, height: s, borderRadius: "50%", background: c, opacity: !ok && red && i % 14 !== 0 && mix > 0.4 ? 0 : 1 }} />; })}
        </div>
        <Tag tt={tt} at={1.0 + side * 0.4} x={x} y={900} txt={ok ? "SECO + SECO, DESPUÉS AGUA" : "AGUA PRIMERO"} size={38} col={ok ? GRN : RED} />
        <Tag tt={tt} at={3.4 + side * 0.3} x={x} y={950} txt={ok ? "gris parejo" : "bolitas de arcilla · carbón suelto"} size={28} col={DIM} />
        {ok ? <Check x={x + 250} y={370} s={110} p={v} /> : <Cross x={x + 250} y={370} s={100} p={v} />}
      </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 10:55 · DE A UN VASO: contador de vasos y la mezcla que pasa de migas a «tierra de maceta recién regada» ----
export const HGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.min(5, Math.floor(cl((tt - 0.8) / 4.6) * 5) + (tt > 0.8 ? 1 : 0)), m = cl(n / 5), tip = (tt * 1.15) % 1;
  return <>
    <Head tt={tt} kick="NI UN BALDE DE GOLPE" title="EL AGUA, DE A UN VASO" col={ICE} />
    {/* vaso que vuelca */}
    <div style={{ position: "absolute", left: 640, top: 330, width: 110, height: 150, transformOrigin: "100% 100%", transform: `rotate(${n < 5 ? Math.sin(tip * Math.PI) * 100 : 0}deg)`, clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", background: "linear-gradient(90deg,rgba(255,255,255,.5),rgba(180,220,255,.2) 40%,rgba(255,255,255,.4))" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "70%", background: "rgba(120,190,255,.55)" }} />
    </div>
    <Bucket x={760} y={520} w={420} h={420} fill={0.62} col={`linear-gradient(180deg, rgb(${Math.round(70 - 30 * m)},${Math.round(66 - 30 * m)},${Math.round(62 - 30 * m)}), #121212)`} />
    {/* marcador de vasos */}
    <div style={{ position: "absolute", left: 1180, top: 360, display: "flex", gap: 22 }}>{Array.from({ length: 5 }, (_, i) => <div key={i} style={{ width: 70, height: 96, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: i < n ? "rgba(120,190,255,.85)" : "rgba(255,255,255,.12)", transform: `scale(${i < n ? 1 : 0.9})` }} />)}</div>
    {/* termómetro de humedad */}
    <div style={{ position: "absolute", left: 1180, top: 560, width: 520, height: 34, borderRadius: 17, background: "linear-gradient(90deg,#c9a77e,#5a4a3a 55%,#1c2d40)" }} />
    <div style={{ position: "absolute", left: 1180 + 520 * (0.1 + 0.48 * m) - 14, top: 540, width: 28, height: 74, borderRadius: 8, background: TX, boxShadow: "0 6px 20px rgba(0,0,0,.5)" }} />
    {[["MIGAS", 0.05], ["TIERRA HÚMEDA", 0.52], ["SOPA", 0.92]].map(([s, p], i) => <div key={i} style={{ position: "absolute", left: 1180 + 520 * (p as number), top: 640, transform: "translateX(-50%)", fontWeight: 900, fontSize: 26, color: i === 1 ? GRN : DIM, whiteSpace: "nowrap" }}>{s}</div>)}
    <Tag tt={tt} at={5.4} x={1440} y={800} txt="NO BARRO CHIRLE" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 11:12 · LA PRUEBA DEL PUÑO: se desarma (le falta) · chorrea (te pasaste) · bola firme con la marca de los dedos ----
export const HFist: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const R = [{ n: "SE DESARMA", s: "le falta agua", c: RED }, { n: "CHORREA", s: "te pasaste", c: ICE }, { n: "BOLA FIRME", s: "esa es la mezcla", c: GRN }];
  return <>
    <Head tt={tt} kick="APRETÁS FUERTE Y ABRÍS" title="LA PRUEBA DEL PUÑO" />
    {R.map((r, i) => { const s = phys(tt, 0.8 + i * 1.6, 6, 0.5), x = 400 + i * 560, open = cl((tt - 1.4 - i * 1.6) * 1.5);
      return <React.Fragment key={i}>
        {/* palma abierta */}
        <div style={{ position: "absolute", left: x - 180, top: 560, width: 360, height: 200, borderRadius: "40% 40% 50% 50%", background: "radial-gradient(ellipse at 50% 40%,#e7b48c,#b77d55)", opacity: cl(s * 2), transform: `translateY(${(1 - cl(s)) * 50}px)` }} />
        {i === 0 && <Grains n={26} x={x - 120 - open * 60} y={520 + open * 120} w={240 + open * 120} h={80 + open * 160} col="#262321" s={14} seed={3} />}
        {i === 1 && <><div style={{ position: "absolute", left: x - 90, top: 480, width: 180, height: 130, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#3a3634,#121110)", opacity: cl(s * 2) }} />
          {Array.from({ length: 6 }, (_, k) => { const ph = (tt * 0.8 + k / 6) % 1; return <div key={k} style={{ position: "absolute", left: x - 70 + k * 28, top: 640 + ph * 220, width: 10, height: 26, borderRadius: 5, background: "rgba(25,22,20,.85)", opacity: open * (1 - ph) }} />; })}</>}
        {i === 2 && <div style={{ position: "absolute", left: x - 100, top: 470, width: 200, height: 150, borderRadius: "48%", background: "radial-gradient(ellipse at 40% 30%,#4a4644,#141312)", opacity: cl(s * 2) }}>
          {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 30 + k * 38, top: 30, width: 22, height: 90, borderRadius: 11, background: "rgba(0,0,0,.35)", transform: `rotate(${(k - 1.5) * 8}deg)` }} />)}
        </div>}
        <Tag tt={tt} at={1.6 + i * 1.6} x={x} y={850} txt={r.n} size={44} col={r.c} />
        <Tag tt={tt} at={1.8 + i * 1.6} x={x} y={905} txt={r.s} size={30} col={DIM} />
        {i === 2 && <Check x={x + 150} y={430} s={110} p={cl(tt - 5.2)} />}
      </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 12:30 · MITAD Y MITAD: la primera tanda; durísima pero no prende — «como prender un ladrillo» ----
export const HHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sp = eio(tt, 0.6, 1.8), lit = cl((tt - 3.0) / 2.2), die = cl((tt - 5.2) / 1.2);
  return <>
    <Head tt={tt} kick="LA PRIMERA TANDA" title="MITAD Y MITAD" col={RED} />
    {/* torta 50/50 */}
    <svg width={360} height={360} style={{ position: "absolute", left: 220, top: 380 }}>
      <circle cx={180} cy={180} r={160} fill="#151515" />
      <path d={`M180 180 L180 20 A160 160 0 0 1 ${180 + 160 * Math.sin(Math.PI * sp)} ${180 - 160 * Math.cos(Math.PI * sp)} Z`} fill="#b05a34" />
      <text x={110} y={190} fill={TX} fontSize={44} fontWeight={900}>50</text><text x={200} y={190} fill={TX} fontSize={44} fontWeight={900} opacity={sp}>50</text>
    </svg>
    <Tag tt={tt} at={1.2} x={400} y={800} txt="CARBÓN · BARRO" size={34} col={DIM} />
    {/* la briqueta resultante = ladrillo; brasero abajo que no la prende */}
    <div style={{ position: "absolute", left: 900, top: 470, width: 360, height: 200, borderRadius: 10, background: "linear-gradient(135deg,#6a4636,#3a2a22)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: `radial-gradient(ellipse at 50% 100%, rgba(255,110,40,${0.7 * lit * (1 - die)}), transparent 60%)` }} />
    </div>
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 1.4 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: 930 + (i * 37) % 300, top: 690 - ph * 60, width: 26, height: 40, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 80%,#ffd27a,#ff5a1a 60%,transparent)", opacity: lit * (1 - die) * Math.sin(ph * Math.PI) }} />; })}
    <div style={{ position: "absolute", left: 880, top: 720, width: 400, height: 40, borderRadius: 20, background: "#2a2522" }} />
    <Tag tt={tt} at={2.0} x={1080} y={420} txt="DURÍSIMA" size={40} col={TX} />
    <Tag tt={tt} at={5.4} x={1520} y={560} txt="Y SE APAGA" size={50} col={RED} anchor="l" />
    <Tag tt={tt} at={6.0} x={1520} y={630} txt="como prender un ladrillo" size={32} col={DIM} anchor="l" />
  </>;
}}</Stage>;

// ---- 13:05 · UNA DE 4, DE 6, DE 8… : gráfico del cuaderno; dureza baja, prende sube, el cruce en 10 ----
export const HTrials: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(160deg,#ece4d2,#d2c6ab)">{(tt) => {
  const d = eio(tt, 0.8, 4.4), X = (v: number) => 260 + (v - 1) * 110, Y1 = (v: number) => 360 + 420 * (1 - Math.max(0, 1 - (v - 1) / 14) ** 1.4), Y2 = (v: number) => 780 - 420 * Math.min(1, ((v - 1) / 9) ** 0.8);
  const pts = (f: (v: number) => number) => Array.from({ length: 41 }, (_, i) => 1 + i * 0.3).filter((v) => v <= 1 + 12 * d).map((v) => `${X(v)},${f(v)}`).join(" ");
  return <>
    <div style={{ position: "absolute", left: 110, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: "#1f2a44" }}>Una de 4, de 6, de 8…</div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={260} y1={800} x2={1640} y2={800} stroke="#1f2a44" strokeWidth={4} /><line x1={260} y1={800} x2={260} y2={330} stroke="#1f2a44" strokeWidth={4} />
      {[1, 4, 6, 8, 10, 12].map((v) => <g key={v}><line x1={X(v)} y1={795} x2={X(v)} y2={812} stroke="#1f2a44" strokeWidth={3} /><text x={X(v)} y={858} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={46} fill="#1f2a44">{v === 1 ? "1:1" : `${v}:1`}</text></g>)}
      <polyline points={pts(Y1)} fill="none" stroke="#a3332b" strokeWidth={8} strokeLinecap="round" />
      <polyline points={pts(Y2)} fill="none" stroke="#1f6b3a" strokeWidth={8} strokeLinecap="round" />
      {d > 0.75 && <><circle cx={X(10)} cy={Y2(10)} r={22 * cl((d - 0.75) * 4)} fill="none" stroke="#c97a10" strokeWidth={6} /><line x1={X(10)} y1={330} x2={X(10)} y2={800} stroke="#c97a10" strokeWidth={4} strokeDasharray="12 10" opacity={cl((d - 0.75) * 4)} /></>}
    </svg>
    <div style={{ position: "absolute", left: 300, top: 300, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#a3332b" }}>dura</div>
    <div style={{ position: "absolute", left: 1380, top: 330, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#1f6b3a", opacity: cl(d * 2 - 0.6) }}>prende</div>
    <div style={{ position: "absolute", left: 1480, top: 880, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#1f2a44" }}>carbón : barro</div>
    <Tag tt={tt} at={5.0} x={X(10)} y={270} txt="20 TANDAS ANOTADAS" col="#c97a10" size={36} />
  </>;
}}</Stage>;

// ---- 13:21 · DIEZ A UNO: diez vasos negros y uno colorado que caen al balde; abajo «20 L + 2 L» ----
export const HTenOne: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Head tt={tt} kick="LA PROPORCIÓN · EN VOLUMEN" title="DIEZ DE CARBÓN · UNA DE ARCILLA" />
  {Array.from({ length: 11 }, (_, i) => { const red = i === 10, s = phys(tt, 0.6 + i * 0.22, 8, 0.45), x = 180 + i * 140 + (red ? 50 : 0);
    return <div key={i} style={{ position: "absolute", left: x, top: 380 + (1 - cl(s)) * -200, width: 100, height: 140, opacity: cl(s * 3), clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,rgba(255,255,255,.45),rgba(255,255,255,.12) 40%,rgba(255,255,255,.35))" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "86%", background: red ? "linear-gradient(180deg,#d07a4a,#9a4524)" : "linear-gradient(180deg,#2b2a28,#0d0d0d)" }} />
    </div>; })}
  {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: "absolute", left: 180 + i * 140 + (i === 10 ? 50 : 0) + 50, top: 560, transform: "translateX(-50%)", fontWeight: 900, fontSize: 32, color: i === 10 ? AMB : DIM, opacity: cl(tt - 0.8 - i * 0.22) }}>{i === 10 ? "1" : i + 1}</div>)}
  <div style={{ position: "absolute", left: 1580, top: 380, width: 4, height: 160, background: "rgba(255,255,255,.3)" }} />
  {/* equivalencia en baldes */}
  <div style={{ position: "absolute", left: 0, top: 0, opacity: cl(tt - 3.6) }}>
    <Bucket x={700} y={680} w={260} h={300} fill={0.88} col="linear-gradient(180deg,#2b2a28,#0d0d0d)" />
    <div style={{ position: "absolute", left: 1150, top: 820, width: 130, height: 150, borderRadius: 10, background: "linear-gradient(90deg,#9aa0a6,#e3e6ea,#8a9096)" }}><div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: "80%", borderRadius: 6, background: "#b8653a" }} /></div>
  </div>
  <Tag tt={tt} at={4.0} x={700} y={1020} txt="20 LITROS" size={40} />
  <Tag tt={tt} at={4.4} x={1215} y={1020} txt="2 LITROS" size={40} col={AMB} />
  <Tag tt={tt} at={4.2} x={960} y={850} txt="+" size={90} col={DIM} />
</>}</Stage>;

// ---- 13:38 · LA PRUEBA DE LA CAÍDA: desde la cintura al piso de tierra, rebota y queda entera ----
export const HDrop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#22303c,#0d1218 70%,#3a2c1e 71%,#241a10)">{(tt) => {
  const ft = Math.max(0, tt - 1.6), g = 1800, H0 = 580, yb = (() => { let y = 0, v = 0, tt2 = 0; const dt = 1 / 60; let pos = 0; for (tt2 = 0; tt2 < ft; tt2 += dt) { v += g * dt; pos += v * dt; if (pos >= H0) { pos = H0; v = -v * 0.32; } } y = pos; return y; })();
  return <>
    <Head tt={tt} kick="LA PRUEBA DE LA CAÍDA" title="DESDE LA CINTURA AL PISO" col={ICE} />
    <div style={{ position: "absolute", left: 1350, top: 330, width: 10, height: 610, background: "rgba(255,255,255,.35)" }} />
    {[0, 0.5, 1].map((k, i) => <div key={i} style={{ position: "absolute", left: 1380, top: 330 + 600 * k - 20, fontWeight: 900, fontSize: 34, color: DIM }}>{["1 m", "50 cm", "0"][i]}</div>)}
    <Briq x={960} y={330 + yb} w={130} h={170} rot={ft > 0 ? Math.min(ft, 0.35) * 220 : 0} />
    {ft > 0.75 && Array.from({ length: 8 }, (_, i) => { const p = cl((ft - 0.75) * 2); return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(i) * 200 * p, top: 990 - Math.abs(Math.sin(i * 1.3)) * 80 * p, width: 12, height: 12, borderRadius: "50%", background: "#6b5235", opacity: 1 - p }} />; })}
    <Check x={720} y={770} s={140} p={cl(tt - 3.6)} />
    <Tag tt={tt} at={3.8} x={720} y={880} txt="NO SE ROMPE" col={GRN} size={44} />
  </>;
}}</Stage>;

// ---- 14:29 · ENGRUDO: almidón cocido hasta gel transparente; medio kilo cada cinco de polvo, y además se quema ----
export const HStarch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const gel = eio(tt, 1.0, 3.6);
  return <>
    <Head tt={tt} kick="SI TU BARRO ES FLACO" title="ENGRUDO DE ALMIDÓN" />
    {/* olla al fuego */}
    <div style={{ position: "absolute", left: 360, top: 470, width: 520, height: 300, borderRadius: "0 0 60px 60px", background: "linear-gradient(90deg,#3c3f44,#9aa0a7 35%,#5c6168)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 30, height: 120, borderRadius: "50%", background: `radial-gradient(ellipse at 40% 40%, rgba(255,255,255,${0.2 + 0.6 * gel}), rgba(${Math.round(240 - 60 * gel)},${Math.round(236 - 40 * gel)},${Math.round(220 - 20 * gel)},${1 - 0.5 * gel}))` }} />
      {gel > 0.3 && [0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 120 + k * 110, top: 60 + 10 * Math.sin(tt * 3 + k), width: 40, height: 22, borderRadius: "50%", border: "3px solid rgba(255,255,255,.6)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 340, top: 440, width: 560, height: 50, borderRadius: "50%", border: "10px solid #b9bec5", boxSizing: "border-box" }} />
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 420 + i * 46, top: 790 - 30 * Math.abs(Math.sin(tt * 4 + i)), width: 30, height: 60 + 30 * Math.abs(Math.sin(tt * 3 + i)), borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 80%, #bfe4ff, #3a7bff 60%, transparent)" }} />)}
    <Tag tt={tt} at={1.6} x={620} y={930} txt={gel > 0.9 ? "GEL TRANSPARENTE" : "SE VA ESPESANDO…"} size={36} col={TX} />
    {/* receta */}
    <div style={{ position: "absolute", left: 1100, top: 380, transform: `translateX(${(1 - cl(phys(tt, 3.6, 6, 0.5))) * 120}px)`, opacity: cl(tt - 3.6) }}>
      <div style={{ fontWeight: 900, fontSize: 110, color: AMB, lineHeight: 1 }}>½ kg</div>
      <div style={{ fontWeight: 800, fontSize: 36, color: DIM, marginTop: 6 }}>de almidón de mandioca o maíz</div>
      <div style={{ fontWeight: 900, fontSize: 60, color: TX, marginTop: 30 }}>por cada 5 kg</div>
      <div style={{ fontWeight: 800, fontSize: 36, color: DIM }}>de polvo de carbón</div>
    </div>
    <Tag tt={tt} at={5.4} x={1340} y={880} txt="PEGA Y ADEMÁS SE QUEMA" col={GRN} size={40} />
  </>;
}}</Stage>;

// ---- 15:38 · EL MOLDE: caño de 5 cm cortado en tramos de 8 cm, untado con aceite usado ----
export const HMold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 40%, #2a2f35, #0a0c0e 80%)">{(tt) => {
  const cut = eio(tt, 1.0, 2.4), dims = cl(tt - 2.8), oil = eio(tt, 4.4, 5.8);
  return <>
    <Head tt={tt} kick="LO QUE SOBRA DE CUALQUIER OBRA" title="EL MOLDE: UN CAÑO" col={ICE} />
    {/* caño largo que se corta en tramos */}
    {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 300 + k * (230 + 60 * cut), top: 470, width: 230, height: 160, borderRadius: 10, background: "linear-gradient(180deg,#e6e9ec,#9ca3a9 55%,#6d7378)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", right: -20, top: 0, width: 40, height: 160, borderRadius: "50%", background: "radial-gradient(ellipse,#2a2d30 45%,#c9ced3 50%)" }} />
    </div>)}
    {/* cotas sobre el primer tramo */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: dims }}>
      <g stroke={AMB} strokeWidth={4}><line x1={300} y1={690} x2={530} y2={690} /><line x1={300} y1={670} x2={300} y2={710} /><line x1={530} y1={670} x2={530} y2={710} />
        <line x1={260} y1={470} x2={260} y2={630} /><line x1={240} y1={470} x2={280} y2={470} /><line x1={240} y1={630} x2={280} y2={630} /></g>
    </svg>
    <div style={{ position: "absolute", left: 415, top: 720, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: AMB, opacity: dims }}>8 cm</div>
    <div style={{ position: "absolute", left: 120, top: 510, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: AMB, opacity: dims }}>5 cm</div>
    {/* trapo con aceite usado */}
    <div style={{ position: "absolute", left: 1350 + 160 * Math.sin(tt * 3) * oil, top: 760, width: 220, height: 120, borderRadius: "40% 50% 45% 55%", background: "linear-gradient(135deg,#c4a46a,#6a5432)", transform: `rotate(${10 * Math.sin(tt * 3)}deg)`, opacity: cl(tt - 4.2) }} />
    <Tag tt={tt} at={4.6} x={1460} y={940} txt="ACEITE USADO: NO SE PEGA" col={DIM} size={32} />
  </>;
}}</Stage>;

// ---- 16:23 · LA PRENSA DE PIE: tu peso (70-80 kg) sobre la tabla; la mezcla baja y el agua de más sale por abajo ----
export const HFoot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 1.6, 4.4);
  return <>
    <Head tt={tt} kick="LA QUE NO CUESTA NADA" title="LA PRENSA DE PIE" />
    <div style={{ position: "absolute", left: 560, top: 900, width: 800, height: 60, background: "repeating-linear-gradient(90deg,#8a6a44 0 120px,#6a4e30 120px 130px)" }} />
    <Pipe x={960} top={620} w={150} h={280} fill={1 - 0.3 * p} />
    {/* tarugo */}
    <div style={{ position: "absolute", left: 905, top: 520 + 84 * p, width: 110, height: 120, background: "linear-gradient(90deg,#b8894f,#e4bd84,#a37840)", borderRadius: 6 }} />
    {/* tabla */}
    <div style={{ position: "absolute", left: 700, top: 490 + 84 * p, width: 520, height: 34, borderRadius: 6, background: "linear-gradient(180deg,#c9a066,#8a6a3e)" }} />
    {/* pies */}
    {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 960 + s * 110 - 70, top: 430 + 84 * p, width: 140, height: 60, borderRadius: "50% 60% 20% 20%", background: "#2a2a2e" }} />)}
    <div style={{ position: "absolute", left: 960, top: 300 + 84 * p, transform: "translateX(-50%)", fontWeight: 900, fontSize: 66, color: AMB }}>70 · 80 kg</div>
    <svg width={80} height={120} style={{ position: "absolute", left: 920, top: 360 + 84 * p }}><path d="M40 0 L40 90 M15 65 L40 95 L65 65" stroke={AMB} strokeWidth={8} fill="none" /></svg>
    {/* agua que sale por abajo */}
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.9 + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 890 + (i % 2) * 140 + (i % 2 ? 1 : -1) * ph * 160, top: 892, width: 16 + ph * 30, height: 8, borderRadius: 4, background: "rgba(40,40,40,.8)", opacity: p > 0.3 ? 1 - ph : 0 }} />; })}
    <Tag tt={tt} at={4.8} x={1460} y={600} txt="AGARRATE DE ALGO" col={RED} size={40} />
    <Tag tt={tt} at={5.4} x={1460} y={660} txt="nunca las manos bajo la tabla" col={DIM} size={30} />
  </>;
}}</Stage>;

// ---- 16:40 · LA PRENSA DEL GATO: marco de hierro ángulo, gato de botella y la palanca que bombea ----
export const HJack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 40%, #2b2622, #0a0908 80%)">{(tt) => {
  const pump = Math.sin(tt * 5) * cl(tt - 1.4) * (1 - cl(tt - 5)), up = eio(tt, 1.4, 5);
  return <>
    <Head tt={tt} kick="EL GATO DE LA CAMIONETA" title="LA PRENSA DEL GATO" />
    {/* marco */}
    <div style={{ position: "absolute", left: 640, top: 300, width: 640, height: 40, background: "linear-gradient(180deg,#7a7f85,#3a3d40)" }} />
    {[640, 1240].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 300, width: 40, height: 640, background: "linear-gradient(90deg,#7a7f85,#3a3d40)" }} />)}
    <div style={{ position: "absolute", left: 600, top: 920, width: 720, height: 40, background: "linear-gradient(180deg,#8a6a44,#5e4527)" }} />
    {/* caño y tarugo abajo, gato arriba */}
    <Pipe x={960} top={700} w={150} h={220} fill={1 - 0.25 * up} />
    <div style={{ position: "absolute", left: 905, top: 600 + 60 * up, width: 110, height: 110, background: "linear-gradient(90deg,#b8894f,#e4bd84,#a37840)", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 880, top: 340, width: 160, height: 260 + 60 * up, background: "linear-gradient(90deg,#8a1e14,#d63a2a 40%,#7a1a10)", borderRadius: 12 }}>
      <div style={{ position: "absolute", left: 60, bottom: -20, width: 40, height: 40, background: "#c9ced3" }} />
    </div>
    <div style={{ position: "absolute", left: 1030, top: 470 + 30 * up, width: 300, height: 18, borderRadius: 9, background: "#c9ced3", transformOrigin: "0 50%", transform: `rotate(${-20 + 28 * pump}deg)` }} />
    <Tag tt={tt} at={2.0} x={1380} y={430} txt="EMPUJA CONTRA EL MARCO" size={30} anchor="l" />
    <div style={{ position: "absolute", left: 1380, top: 600, opacity: cl(tt - 3.4), whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 900, fontSize: 80, color: AMB, lineHeight: 1 }}>1 cada 30 s</div>
      <div style={{ fontWeight: 800, fontSize: 32, color: DIM }}>más dura que la de pie</div>
    </div>
  </>;
}}</Stage>;

// ---- 17:27 · SALE COMO UN CORCHO: das vuelta el caño, empujás y sale entera; la versión con agujero en el medio ----
export const HCork: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pop = eio(tt, 0.8, 2.2), hole = phys(tt, 3.6, 6, 0.45);
  return <>
    <Head tt={tt} kick="DAS VUELTA EL CAÑO Y EMPUJÁS" title="SALE ENTERA, COMO UN CORCHO" />
    <Pipe x={560} top={420} w={170} h={300} op={1} />
    <div style={{ position: "absolute", left: 500, top: 300 + 140 * pop, width: 120, height: 130, background: "linear-gradient(90deg,#b8894f,#e4bd84,#a37840)", borderRadius: 6 }} />
    <Briq x={560 + 340 * pop} y={640 + 200 * pop - 260 * Math.sin(pop * Math.PI) * 0.6} w={140} h={190} rot={pop * 90} />
    {/* con agujero: el aire pasa por adentro */}
    <div style={{ position: "absolute", left: 0, top: 0, opacity: cl(hole * 2), transform: `scale(${0.8 + 0.2 * cl(hole)})`, transformOrigin: "1400px 640px" }}>
      <Briq x={1400} y={640} w={240} h={300} hole glow={0.35 + 0.2 * Math.sin(tt * 2)} />
      {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.8 + i / 5) % 1; return <svg key={i} width={40} height={120} style={{ position: "absolute", left: 1380, top: 860 - ph * 640, opacity: Math.sin(ph * Math.PI) }}><path d="M20 120 L20 20 M5 40 L20 15 L35 40" stroke={ICE} strokeWidth={5} fill="none" /></svg>; })}
    </div>
    <Tag tt={tt} at={4.2} x={1400} y={900} txt="CON AGUJERO PRENDE MEJOR" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 17:44 · NO APRETES DE GOLPE: rayos X de dos briquetas; la del golpe tiene la rajadura adentro ----
export const HSlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 45%, #0e2236, #03070c 80%)">{(tt) => {
  const scan = cl((tt - 1.0) / 2.4), cr = cl((tt - 2.2) / 1.2);
  return <>
    <Head tt={tt} kick="EL ERROR DE ESTA PARTE" title="APRETAR DE GOLPE" col={RED} />
    {[{ x: 640, bad: true, n: "DE UN SALTO", s: "por fuera se ve bien" }, { x: 1280, bad: false, n: "DESPACIO, PAREJO", s: "unos segundos apretada" }].map((b, i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: b.x - 140, top: 360, width: 280, height: 400, borderRadius: 24, background: "rgba(140,210,255,.08)", boxShadow: "inset 0 0 0 3px rgba(140,210,255,.35)" }} />
      <Briq x={b.x} y={560} w={200} h={280} op={0.9} crack={b.bad ? cr : 0} />
      <div style={{ position: "absolute", left: b.x - 150, top: 360 + 400 * scan, width: 300, height: 6, background: "rgba(140,210,255,.8)", boxShadow: "0 0 20px rgba(140,210,255,.9)", opacity: scan < 1 ? 1 : 0 }} />
      <Tag tt={tt} at={1.2 + i * 0.3} x={b.x} y={830} txt={b.n} col={b.bad ? RED : GRN} size={40} />
      <Tag tt={tt} at={1.5 + i * 0.3} x={b.x} y={885} txt={b.s} col={DIM} size={28} />
    </React.Fragment>)}
    <Tag tt={tt} at={3.8} x={640} y={300} txt="SE PARTE AL SECARSE" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 18:05 · CUÁNTAS SALEN: el contador sube hasta 150-180 y se llenan las hileras ----
export const HYield: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const f = eio(tt, 0.8, 4.6), n = Math.round(f * 180);
  return <>
    <Head tt={tt} kick="UN BALDE DE 20 LITROS DE POLVO" title="CUÁNTAS SALEN POR TANDA" />
    <div style={{ position: "absolute", left: 200, top: 300, width: 1000, height: 640, perspective: 1200 }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateX(48deg)", transformOrigin: "50% 100%", background: "repeating-linear-gradient(90deg,#8a6a44 0 98px,#5e4527 98px 104px)", borderRadius: 10 }}>
        {Array.from({ length: 180 }, (_, i) => i < n ? <div key={i} style={{ position: "absolute", left: 20 + (i % 18) * 54, top: 20 + Math.floor(i / 18) * 60, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#4a4846,#0f0f0f)", boxShadow: "0 6px 8px rgba(0,0,0,.5)" }} /> : null)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1300, top: 380 }}>
      <div style={{ fontWeight: 900, fontSize: 190, color: AMB, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontWeight: 800, fontSize: 40, color: DIM }}>briquetas</div>
    </div>
    <Tag tt={tt} at={5.0} x={1300} y={720} txt="ENTRE 150 Y 180" col={TX} size={46} anchor="l" />
    <Tag tt={tt} at={5.6} x={1300} y={790} txt="un sábado de sol, con el mate" col={DIM} size={32} anchor="l" />
  </>;
}}</Stage>;

// ---- 18:55 · EL SECADERO: rejilla sobre dos ladrillos, a un palmo del piso; dos dedos entre una y otra; el aire pasa por abajo ----
export const HRack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#f3d39a,#e6b874 50%,#7d6648 51%,#4f3e2a)">{(tt) => {
  const s = phys(tt, 0.6, 6, 0.5), n = Math.floor(cl((tt - 1.2) / 2.6) * 8);
  return <>
    <div style={{ position: "absolute", left: 110, top: 80, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: "#5a3a1c" }}>AL SOL, DONDE PEGUE TODA LA TARDE</div>
    <div style={{ position: "absolute", left: 110, top: 116, fontWeight: 900, fontSize: 60, color: "#2a1a0c" }}>A UN PALMO DEL PISO</div>
    <div style={{ position: "absolute", left: 1620, top: 110, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle,#fff7c8,#ffc23a)", boxShadow: "0 0 90px #ffc23a" }} />
    {[420, 1380].map((x) => <div key={x} style={{ position: "absolute", left: x - 70, top: 760, width: 140, height: 170, background: "linear-gradient(180deg,#c0603a,#8a3e22)", borderRadius: 6, opacity: cl(s * 2) }} />)}
    <div style={{ position: "absolute", left: 300, top: 730 + (1 - cl(s)) * -80, width: 1220, height: 30, opacity: cl(s * 2), backgroundImage: "linear-gradient(90deg, #4a4f55 3px, transparent 3px)", backgroundSize: "30px 30px", borderTop: "6px solid #4a4f55", borderBottom: "6px solid #4a4f55" }} />
    {Array.from({ length: 8 }, (_, i) => i < n ? <Briq key={i} x={380 + i * 150} y={650} w={100} h={140} /> : null)}
    {n >= 2 && <><svg width={200} height={60} style={{ position: "absolute", left: 425, top: 540 }}><path d="M5 30 L145 30 M5 15 L5 45 M145 15 L145 45" stroke="#1b1b1b" strokeWidth={5} /></svg><div style={{ position: "absolute", left: 420, top: 480, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: "#1b1b1b" }}>dos dedos</div></>}
    {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.5 + i / 5) % 1; return <svg key={i} width={260} height={40} style={{ position: "absolute", left: 200 + ph * 1400, top: 820 + (i % 2) * 50, opacity: Math.sin(ph * Math.PI) * cl(tt - 3) }}><path d="M0 20 Q65 0 130 20 T260 20" stroke="#ffffff" strokeWidth={6} fill="none" /></svg>; })}
    <Tag tt={tt} at={3.4} x={960} y={990} txt="EL AIRE PASA POR ABAJO" col="#fff" size={40} />
  </>;
}}</Stage>;
