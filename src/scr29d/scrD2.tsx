// scr29d · componentes únicos 15-29 (minutos 8-23). Mismo escenario y lenguaje que scrD1.
import React from "react";
import { AMB, H, HAND, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Can, Flame } from "./scrD1";

const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
const GRN = "#6fe39a", BLU = "#5aa8ff";
const dust = "repeating-radial-gradient(circle at 30% 40%, #c9995a 0 3px, #b7864a 3px 6px, #d8ab6c 6px 8px)";
const iron = "linear-gradient(160deg,#5b5652 0%,#35312e 45%,#1f1c1a 100%)";

// ---- 8:29 · EL DIARIO ENROLLADO: una hoja de diario se enrolla sola en un palito, entra al pozo, el fósforo la prende y sube un anillo de fuego que se abre por toda la boca ----
export const HNewsroll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const roll = eio(tt, 0.4, 2), insert = eio(tt, 2.2, 3.4), lit = cl((tt - it(h, 0)) * 2), ring = eio(tt, it(h, 1) - 0.4, it(h, 1) + 1.6);
  const w = 520 - 440 * roll;
  return <>
    <Can x={960} y={980} w={620} hh={420} />
    <div style={{ position: "absolute", left: 960 - 290, top: 560, width: 580, height: 60, borderRadius: "50%", background: dust, boxShadow: "inset 0 10px 20px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 250, top: 10, width: 80, height: 40, borderRadius: "50%", background: "#0d0b09" }} />
    </div>
    {/* la hoja: ancha y plana, se enrolla en un tubo y baja al pozo */}
    <div style={{ position: "absolute", left: 960 - w / 2, top: 120 + 330 * insert, width: w, height: 420, borderRadius: 10 * (1 - roll) + 40 * roll, background: `repeating-linear-gradient(180deg,#efe9dc 0 18px,#d9d1c0 18px 20px)`, boxShadow: `inset ${-30 * roll}px 0 40px rgba(0,0,0,.35), 0 20px 40px rgba(0,0,0,.4)`, transform: `rotate(${-8 * (1 - roll)}deg)` }}>
      <div style={{ fontFamily: "serif", fontWeight: 900, fontSize: 54 * (1 - roll) + 1, color: "#222", textAlign: "center", marginTop: 20, opacity: 1 - roll }}>THE DAILY</div>
    </div>
    <Flame x={960} y={150 + 330 * insert} w={110} hgt={140} blue={0} tt={tt} on={lit * (1 - ring)} />
    {/* el anillo de llamas alrededor del centro */}
    {Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6, r = 60 + 200 * ring;
      return <Flame key={k} x={960 + r * Math.cos(a)} y={590 + 20 * Math.sin(a)} w={90} hgt={150 * ring} blue={0.1} tt={tt + k} on={ring} />; })}
    <Tag tt={tt} at={it(h, 1) + 0.8} x={960} y={340} txt="A RING OF FLAME" col={AMB} size={64} />
  </>;
}}</Stage>;

// ---- 9:17 · LOS DOS FRASCOS: dos frascos de aceite con la misma marca; el de la sartén se vacía en 40 minutos con humo, el de la lata tarda el doble con llama quieta ----
export const HTwinjars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const T = h.out - h.at - 1.2, k = cl((tt - 0.6) / (T - 0.6)), min = Math.round(80 * k), pan = cl(min / 40), can = cl(min / 80);
  const jar = (x: number, lvl: number, col: string, lbl: string, smoke: number) => <>
    <div style={{ position: "absolute", left: x - 180, top: 280, width: 360, height: 520, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.26) 30%,rgba(255,255,255,.06))", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.22), 0 40px 80px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${Math.max(7, 80 * (1 - lvl))}%`, background: "linear-gradient(180deg,#d39b3a,#7a4c12)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "20%", height: 4, background: "rgba(255,255,255,.5)" }} />
    </div>
    <Flame x={x} y={270} w={lbl === "PAN" ? 260 : 120} hgt={(lbl === "PAN" ? 300 : 150) * (lvl < 1 ? 1 : 0)} blue={lbl === "PAN" ? 0 : 0.2} tt={tt} />
    {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: x - 80 + (j % 3) * 50, top: 120 - ((tt * 70 + j * 60) % 260), width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,30,30,.75), transparent 70%)", opacity: smoke * (lvl < 1 ? 1 : 0), filter: "blur(10px)" }} />)}
    <div style={{ position: "absolute", left: x - 180, top: 830, width: 360, textAlign: "center", fontWeight: 900, fontSize: 64, color: col }}>{lbl}</div>
    <div style={{ position: "absolute", left: x - 180, top: 910, width: 360, textAlign: "center", fontWeight: 800, fontSize: 52, color: TX }}>{lvl < 1 ? `${min} MIN` : "40 MIN"}</div>
  </>;
  return <>{jar(620, pan, "#ff9a5a", "PAN", 1)}{jar(1300, can, BLU, "CAN", 0)}
    <Tag tt={tt} at={it(h, 1) + 0.3} x={960} y={1030} txt="2× LONGER" col={GRN} size={60} />
  </>;
}}</Stage>;

// ---- 10:08 · LA PERILLA DE LUZ: un dimmer de pared de casa; la tapa de la lata es su perilla: se corre, la llama crece; se corre de vuelta, baja; se cierra, OFF ----
export const HDimmer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = tt < it(h, 0) ? eio(tt, 0.4, 1.4) : tt < it(h, 1) ? 1 - 0.7 * eio(tt, it(h, 0), it(h, 0) + 0.8) : 0.3 - 0.3 * eio(tt, it(h, 1), it(h, 1) + 0.8);
  return <>
    <div style={{ position: "absolute", left: 260, top: 200, width: 520, height: 700, borderRadius: 30, background: "linear-gradient(160deg,#f4f1ea,#d6d1c6)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 220, top: 80, width: 80, height: 540, borderRadius: 40, background: "#2a2a2a", boxShadow: "inset 0 6px 12px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 140, top: 80 + 440 * (1 - g), width: 240, height: 110, borderRadius: 18, background: "linear-gradient(180deg,#e2e5e9,#8d9399)", boxShadow: "0 16px 30px rgba(0,0,0,.4)" }}>
        <div style={{ fontFamily: MARK, fontSize: 40, color: "#333", textAlign: "center", marginTop: 26 }}>LID</div>
      </div>
      <div style={{ position: "absolute", left: 340, top: 40, fontWeight: 900, fontSize: 44, color: "#333" }}>MORE</div>
      <div style={{ position: "absolute", left: 340, top: 620, fontWeight: 900, fontSize: 44, color: g < 0.05 ? RED : "#333" }}>OFF</div>
    </div>
    <Can x={1380} y={920} w={420} hh={380}>
      <div style={{ position: "absolute", left: -10 + 300 * g, top: -26, width: 440, height: 30, borderRadius: 10, background: "linear-gradient(180deg,#e2e5e9,#8d9399)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    </Can>
    <Flame x={1380 - 210 + 300 * g / 2 + 30} y={530} w={60 + 160 * g} hgt={320 * g} blue={0.15} tt={tt} on={g > 0.03 ? 1 : 0} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M 640 ${335 + 440 * (1 - g)} C 900 ${335 + 440 * (1 - g)}, 1000 520, ${1180 + 300 * g} 520`} stroke={AMB} strokeWidth={8} strokeDasharray="18 14" fill="none" opacity={0.85} /></svg>
    <Tag tt={tt} at={0.8} x={1380} y={180} txt="WIDE GAP · BIG FLAME" col={AMB} size={52} />
  </>;
}}</Stage>;

// ---- 10:26 · EL TRÍPODE DE LADRILLOS: tres ladrillos se paran de punta alrededor de la lata, cae la parrilla de horno y encima la cafetera que empieza a humear ----
export const HTripod: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const b = [0.5, 1.1, 1.7].map((a) => phys(tt, a, 7, 0.4)), rack = phys(tt, it(h, 0), 6, 0.45), pot = phys(tt, it(h, 1), 6, 0.45), steam = cl((tt - it(h, 1) - 1) / 1.5);
  return <>
    <div style={{ position: "absolute", left: 960 - 60, top: 400 - (1 - b[2]) * 700, width: 120, height: 340, borderRadius: 6, background: "linear-gradient(90deg,#6a2c1c,#94432e 40%,#6a2c1c)", opacity: cl(b[2] * 3) }} />
    <Can x={960} y={900} w={300} hh={300} />
    <Flame x={960} y={600} w={120} hgt={140} blue={0.2} tt={tt} />
    {[[600, 0], [1320, 1]].map(([x, i]) => <div key={i} style={{ position: "absolute", left: x - 70, top: 520 - (1 - b[i]) * 700, width: 140, height: 400, borderRadius: 6, background: "linear-gradient(90deg,#8a3a26,#c0583e 40%,#8a3a26)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", opacity: cl(b[i] * 3), zIndex: 2 }} />)}
    <div style={{ position: "absolute", left: 960 - 460, top: 480 - (1 - rack) * 600, width: 920, height: 40, opacity: cl(rack * 3), background: "repeating-linear-gradient(90deg,#b9bdc2 0 8px,transparent 8px 46px)", borderTop: "8px solid #b9bdc2", borderBottom: "8px solid #b9bdc2", zIndex: 3 }} />
    <div style={{ position: "absolute", left: 960 - 160, top: 200 - (1 - pot) * 500, width: 320, height: 280, borderRadius: "40% 40% 20px 20px", background: "linear-gradient(90deg,#3a3d42,#a9aeb5 35%,#5d6066)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", opacity: cl(pot * 3), zIndex: 4 }}>
      <div style={{ position: "absolute", right: -80, top: 60, width: 100, height: 30, borderRadius: 15, background: "#2a2a2a", transform: "rotate(-30deg)" }} />
    </div>
    {Array.from({ length: 5 }, (_, k) => <div key={k} style={{ position: "absolute", left: 900 + k * 30, top: 180 - ((tt * 60 + k * 40) % 200), width: 60, height: 90, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.45), transparent 70%)", opacity: steam, filter: "blur(8px)", zIndex: 5 }} />)}
    <Tag tt={tt} at={it(h, 1) + 1} x={1560} y={300} txt="15 MIN" col="#ffe08a" size={90} />
    <Tag tt={tt} at={it(h, 1) + 1.6} x={1560} y={420} txt="COFFEE" col={TX} size={56} />
  </>;
}}</Stage>;

// ---- 12:07 · LO QUE LOS VIEJOS NUNCA HACÍAN: tres objetos sobre la mesa (bidón de nafta, puerta cerrada, balde de agua); a cada uno le cae una cinta roja de NEVER ----
export const HNevers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const ats = [0.8, it(h, 0), it(h, 1)], obj = [
    <div key="g" style={{ width: 260, height: 300, borderRadius: "20px 60px 20px 20px", background: "linear-gradient(90deg,#9a1410,#e0322a 40%,#a01a14)", position: "relative" }}><div style={{ position: "absolute", right: 10, top: -40, width: 40, height: 80, background: "#c9c9c9", transform: "rotate(30deg)" }} /><div style={{ fontWeight: 900, fontSize: 40, color: "#ffe", textAlign: "center", paddingTop: 120 }}>GAS</div></div>,
    <div key="d" style={{ width: 240, height: 340, borderRadius: 8, background: "linear-gradient(90deg,#6b4a2a,#8a6238)", position: "relative", boxShadow: "inset 0 0 0 12px #4a3018" }}><div style={{ position: "absolute", right: 30, top: 170, width: 26, height: 26, borderRadius: "50%", background: "#d6b56a" }} /></div>,
    <div key="w" style={{ width: 280, height: 260, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#5d6066,#c9cdd2 35%,#6b7077)", position: "relative" }}><div style={{ position: "absolute", left: 20, right: 20, top: 16, height: 40, borderRadius: "50%", background: "#4a8ad0" }} /></div>,
  ];
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 780, height: 300, background: "linear-gradient(180deg,#5a3f26,#3a2816)" }} />
    {obj.map((o, i) => { const s = phys(tt, ats[i] - 0.5, 7, 0.4), x = 380 + i * 580, band = eio(tt, ats[i] + 0.4, ats[i] + 0.9);
      return <div key={i} style={{ position: "absolute", left: x - 150, top: 780 - 340 - (1 - s) * 500, opacity: cl(s * 3) }}>
        <div style={{ transform: "scale(1.4)", transformOrigin: "50% 100%" }}>{o}</div>
        <div style={{ position: "absolute", left: 0, top: 230, width: 280 * band, height: 62, background: RED, transform: "rotate(-10deg)", boxShadow: "0 10px 30px rgba(0,0,0,.5)", overflow: "hidden" }}><div style={{ fontFamily: MARK, fontSize: 44, color: "#fff", paddingLeft: 60, lineHeight: "62px" }}>NEVER</div></div>
      </div>; })}
    <Tag tt={tt} at={ats[2] + 1.6} x={960} y={950} txt="OUT WITH THE LID" col={GRN} size={60} />
  </>;
}}</Stage>;

// ---- 12:37 · LA LATA QUE CRECE: la lata de un galón se estira hasta un balde de 5; los agujeros se multiplican de 8 a 14 y el palo de escoba se vuelve un caño de 2" ----
export const HScaleup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 0.6, it(h, 0) - 0.3), n = Math.round(8 + 6 * eio(tt, it(h, 0) - 0.3, it(h, 0) + 0.8)), pipe = eio(tt, it(h, 1), it(h, 1) + 1);
  const w = 360 + 300 * g, hh = 380 + 260 * g;
  return <>
    <Can x={960} y={960} w={w} hh={hh} holes={n} />
    <div style={{ position: "absolute", left: 960 - (30 + 40 * pipe), top: 960 - hh - 260 + 120 * pipe, width: 60 + 80 * pipe, height: 380, borderRadius: 30 * (1 - pipe) + 8 * pipe, background: pipe > 0.5 ? "linear-gradient(90deg,#3a3d42,#c9ced4 35%,#5d6066)" : "linear-gradient(90deg,#8a5a2a,#d9a466 40%,#a26c34)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 960 - w / 2 - 70, top: 960 - hh, width: 6, height: hh, background: AMB, opacity: cl((tt - 0.6) * 2) }}>
      <div style={{ position: "absolute", left: -17, top: 0, width: 40, height: 6, background: AMB }} /><div style={{ position: "absolute", left: -17, bottom: 0, width: 40, height: 6, background: AMB }} />
    </div>
    <Tag tt={tt} at={0.6} x={960 - w / 2 - 470} y={960 - hh / 2} txt={g > 0.5 ? "5 GALLON" : "1 GALLON"} col={AMB} size={64} anchor="l" />
    <Tag tt={tt} at={it(h, 0)} x={1560} y={300} txt={`${n} HOLES`} col={ICE} size={64} />
    <Tag tt={tt} at={it(h, 1) + 0.6} x={1560} y={420} txt={'2" PIPE'} col={TX} size={64} />
  </>;
}}</Stage>;

// ---- 14:18 · EL PODIO: tres latas de prueba suben al podio de taller; arena tercera (poco calor), cartón afuera (se apagó primero), roble primero con la llama más alta ----
export const HPodium: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const C = [{ n: "SAND", x: 1440, hgt: 160, at: it(h, 0), f: "#d9c49a", fl: 0.45 }, { n: "CARDBOARD", x: 480, hgt: 0, at: it(h, 1), f: "#a88a5a", fl: 0 }, { n: "OAK", x: 960, hgt: 300, at: it(h, 2), f: "#b98a55", fl: 1 }];
  return <>
    {[[960, 300, "1"], [1440, 200, "3"], [480, 120, "—"]].map(([x, hh, n]) => <div key={String(x)} style={{ position: "absolute", left: (x as number) - 210, top: 1000 - (hh as number), width: 420, height: hh as number, background: "linear-gradient(180deg,#3d3a36,#211f1d)", boxShadow: "inset 0 6px 0 rgba(255,255,255,.12)", fontWeight: 900, fontSize: 70, color: "rgba(255,255,255,.22)", textAlign: "center" }}>{n}</div>)}
    {C.map((c) => { const s = phys(tt, c.at - 0.4, 7, 0.4), base = c.n === "OAK" ? 700 : c.n === "SAND" ? 800 : 880;
      return <React.Fragment key={c.n}>
        <div style={{ position: "absolute", left: c.x - 130, top: base - 280 - (1 - s) * 600, opacity: cl(s * 3) }}>
          <Can x={130} y={280} w={240} hh={260}><div style={{ position: "absolute", left: 0, right: 0, top: -2, height: 20, borderRadius: "50%", background: c.f }} /></Can>
          {c.fl > 0 ? <Flame x={130} y={0} w={60 + 70 * c.fl} hgt={c.hgt} blue={0.15} tt={tt} on={cl((tt - c.at) * 2)} /> : <div style={{ position: "absolute", left: 60, top: -120, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(60,60,60,.7), transparent 70%)", filter: "blur(10px)", opacity: cl((tt - c.at) * 2) }} />}
        </div>
        <Tag tt={tt} at={c.at} x={c.x} y={c.n === "OAK" ? 900 : c.n === "SAND" ? 930 : 960} txt={c.n} col={c.n === "OAK" ? GRN : c.n === "SAND" ? "#ffe08a" : "#ff8a7a"} size={c.n === "CARDBOARD" ? 48 : 60} />
      </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 15:41 · LAS NOTITAS: notitas amarillas se pegan en la pared del taller con las preguntas escritas a mano; abajo, con lápiz rojo, la respuesta ----
export const HStickynotes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#6a5a48,#4a3e30)">{(tt) => {
  const N = [{ q: "How long does a gallon burn?", a: "4–5 HOURS", at: 0.6, a2: it(h, 0), x: 560, r: -4 }, { q: "Cooking oil?", a: "YES — STRAIN IT", at: it(h, 1) - 0.4, a2: it(h, 1) + 0.1, x: 1360, r: 3 }];
  return <>{N.map((n) => { const s = phys(tt, n.at, 7, 0.4), w = cl((tt - n.a2) / 0.9);
    return <div key={n.q} style={{ position: "absolute", left: n.x - 300, top: 220 - (1 - s) * 200, opacity: cl(s * 3), transform: `rotate(${n.r}deg) scale(${0.9 + 0.1 * s})`, width: 600, height: 560, background: "linear-gradient(180deg,#ffe98a,#f6d54a)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", padding: 40, boxSizing: "border-box" }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#2a2210", lineHeight: 1.05 }}>{n.q}</div>
      <div style={{ marginTop: 50, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#c0281c", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{n.a}</div>
    </div>; })}</>;
}}</Stage>;

// ---- 16:34 · LA TIRA DE FOTOS: una tira de película de taller avanza por un proyector; cada cuadro es un paso de la rutina con su foto y su número grande ----
export const HStrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const steps = [["1", "STEEL CAN"], ["2", "PACKED DUST"], ["3", "BROOM HOLE"], ["4", "TIN CHIMNEY"]], ats = [0.6, it(h, 0), it(h, 1), it(h, 2)];
  let cur = 0; ats.forEach((a, i) => { if (tt > a) cur = i; });
  const off = ats.reduce((acc, a, i) => acc + (i > 0 ? eio(tt, a - 0.3, a + 0.4) : 0), 0);
  return <>
    <div style={{ position: "absolute", left: 0, top: 220, height: 640, width: 4000, transform: `translateX(${580 - off * 720}px)`, background: "#121212", display: "flex", gap: 40, padding: "60px 0 60px 0", boxSizing: "border-box" }}>
      {steps.map(([n, l], i) => <div key={n} style={{ position: "relative", width: 680, height: 520, flex: "none", opacity: i === cur ? 1 : 0.35, transform: `scale(${i === cur ? 1 : 0.92})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 680, height: 410, borderRadius: 6, overflow: "hidden", background: "radial-gradient(ellipse at 50% 40%,#4a3a2a,#1c1612)" }}>
          {i === 3 ? <><Can x={340} y={380} w={300} hh={190} cut fill={0.9} /><div style={{ position: "absolute", left: 290, top: 60, width: 100, height: 160, borderRadius: 8, background: "linear-gradient(90deg,#b8261c,#e8473a 30%,#b8261c 70%,#7a140e)" }} /><Flame x={340} y={70} w={70} hgt={90} blue={0.2} tt={tt} /></>
            : <Can x={340} y={380} w={300} hh={300} cut={i > 0} fill={i > 0 ? 0.85 : 0}>{i === 2 && <div style={{ position: "absolute", left: 130, top: 60, width: 40, height: 220, background: "#0d0b09", borderRadius: 4 }} />}</Can>}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 418, height: 102, background: "#050505", display: "flex", alignItems: "center", gap: 24, paddingLeft: 24 }}>
          <div style={{ fontWeight: 900, fontSize: 84, color: AMB }}>{n}</div>
          <div style={{ fontWeight: 900, fontSize: 54, color: TX }}>{l}</div>
        </div>
      </div>)}
    </div>
    {[236, 814].map((y) => <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 30, backgroundImage: "linear-gradient(90deg,#f4efe6 0 26px,transparent 26px 60px)", backgroundSize: "60px 30px", backgroundPositionX: -off * 720, opacity: 0.8 }} />)}
  </>;
}}</Stage>;

// ---- 18:29 · LOS FRASCOS DE MECHA: frascos de vidrio con cada mecha que ustedes nombran (arena, toalla, piedras de gato) y el último vacío con un signo de pregunta que late ----
export const HWickjars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const J = [{ n: "SAND", f: "#d9c49a", at: 0.5 }, { n: "TOWEL", f: "repeating-linear-gradient(0deg,#6a8fc0 0 14px,#5a7eb0 14px 18px)", at: it(h, 0) }, { n: "CAT LITTER", f: "repeating-radial-gradient(circle,#b9b6ad 0 6px,#8e8a80 6px 9px)", at: it(h, 1) }, { n: "?", f: "transparent", at: it(h, 1) + 1.2 }];
  return <>{J.map((j, i) => { const s = phys(tt, j.at, 7, 0.4), x = 300 + i * 440, q = j.n === "?";
    return <div key={j.n} style={{ position: "absolute", left: x - 160, top: 300 - (1 - s) * 600, opacity: cl(s * 3) }}>
      <div style={{ width: 320, height: 420, borderRadius: "36px 36px 24px 24px", background: "linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.28) 30%,rgba(255,255,255,.06))", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.22), 0 30px 60px rgba(0,0,0,.5)", overflow: "hidden", position: "relative" }}>
        {!q && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "62%", background: j.f }} />}
        {q && <div style={{ fontWeight: 900, fontSize: 260, color: AMB, textAlign: "center", lineHeight: "420px", transform: `scale(${1 + 0.06 * Math.sin(tt * 3)})` }}>?</div>}
      </div>
      <div style={{ width: 320, textAlign: "center", marginTop: 20, fontWeight: 900, fontSize: j.n.length > 8 ? 50 : 56, color: q ? AMB : TX }}>{q ? "YOURS" : j.n}</div>
    </div>; })}</>;
}}</Stage>;

// ---- 18:48 · EL TAMIZ: un tamiz de cocina sacude aserrín; el polvo fino cae como harina y se apelmaza seco abajo, las virutas medianas quedan y chupan el aceite hasta el fondo ----
export const HSieve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const shake = Math.sin(tt * 9) * 14 * (1 - eio(tt, it(h, 0) - 0.5, it(h, 0))), soakF = eio(tt, it(h, 0), it(h, 0) + 2), soakM = eio(tt, it(h, 1), it(h, 1) + 2);
  const col = (x: number, fine: boolean, s: number, lbl: string, c: string) => <>
    <div style={{ position: "absolute", left: x - 180, top: 420, width: 360, height: 520, borderRadius: 12, background: "#151311", boxShadow: "inset 0 0 0 8px #8e939a, 0 30px 60px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 8, background: fine ? "linear-gradient(180deg,#e2c79a,#d6b98a)" : dust }} />
      <div style={{ position: "absolute", left: 8, right: 8, top: 8, height: fine ? `${16 + 14 * s}%` : `${16 + 80 * s}%`, background: "linear-gradient(180deg, rgba(40,20,6,.9), rgba(70,40,12,.55) 85%, transparent)" }} />
    </div>
    <Tag tt={tt} at={fine ? it(h, 0) : it(h, 1)} x={x} y={990} txt={lbl} col={c} size={52} />
  </>;
  return <>
    <div style={{ position: "absolute", left: 560 - 300 + shake, top: 110, width: 600, height: 170, borderRadius: "0 0 300px 300px", background: "repeating-linear-gradient(45deg,#9da2a9 0 3px,transparent 3px 12px), repeating-linear-gradient(-45deg,#9da2a9 0 3px,#2a2a2c 3px 12px)", boxShadow: "0 0 0 14px #c9cdd2, 0 30px 60px rgba(0,0,0,.5)" }} />
    {Array.from({ length: 24 }, (_, k) => <div key={k} style={{ position: "absolute", left: 400 + (k * 37) % 320, top: 300 + ((tt * 220 + k * 47) % 140), width: 8, height: 8, borderRadius: "50%", background: "#e2c79a", opacity: 1 - eio(tt, it(h, 0) - 0.5, it(h, 0)) }} />)}
    {col(560, true, soakF, "FLOUR: DRY BOTTOM", RED)}{col(1360, false, soakM, "MEDIUM CHIPS", GRN)}
  </>;
}}</Stage>;

// ---- 19:53 · LA PORCIÓN DE TORTA: la lata se corta como una torta y sale una porción; se ven sus capas: arriba brasa, en el medio caliente, abajo fría y empapada, y el pozo como chimenea ----
export const HCake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const slice = eio(tt, 0.4, 1.8), L = [eio(tt, it(h, 0) - 0.3, it(h, 0) + 0.5), eio(tt, it(h, 1) - 0.3, it(h, 1) + 0.5), eio(tt, it(h, 2) - 0.3, it(h, 2) + 0.5)];
  return <>
    <div style={{ position: "absolute", left: 960 - 360 + 260 * slice, top: 260, width: 720, height: 640, borderRadius: 14, overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.7)", background: "#8e939a" }}>
      <div style={{ position: "absolute", left: 18, right: 18, top: 200, height: 40, background: "#ff7a2a", boxShadow: `0 0 ${60 * L[0]}px rgba(255,120,40,${L[0]})`, filter: `brightness(${0.6 + 0.6 * L[0]})` }} />
      <div style={{ position: "absolute", left: 18, right: 18, top: 240, height: 120, background: "linear-gradient(180deg,#8a4a1e,#6a3a16)", filter: `brightness(${0.6 + 0.5 * L[1]})` }} />
      <div style={{ position: "absolute", left: 18, right: 18, top: 360, bottom: 14, background: "repeating-linear-gradient(180deg,#5a3a1a 0 6px,#4a2f15 6px 8px)", filter: `brightness(${0.6 + 0.5 * L[2]}) saturate(${0.6 + 0.6 * L[2]})` }} />
      <div style={{ position: "absolute", left: 330, top: 200, width: 60, bottom: 14, background: "#0d0b09" }}>
        {Array.from({ length: 5 }, (_, k) => <div key={k} style={{ position: "absolute", left: 14, top: 400 - ((tt * 120 + k * 80) % 420), width: 32, height: 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,160,80,.6), transparent 70%)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 0, height: 200, background: "#151311" }}>
        <Flame x={342} y={200} w={300} hgt={160} blue={0.2} tt={tt} />
      </div>
    </div>
    {[[480, 0, "#ff9a5a"], [560, 1, AMB], [760, 2, ICE]].map(([y, i, c]) => <div key={String(i)} style={{ position: "absolute", left: 520, top: (y as number) - 3, width: (600 + 260 * slice - 520 + 40) * L[i as number], height: 6, background: c as string }} />)}
    <Tag tt={tt} at={it(h, 0)} x={120} y={470} txt="GLOWING" col="#ff9a5a" size={56} anchor="l" />
    <Tag tt={tt} at={it(h, 1)} x={120} y={570} txt="HOT" col={AMB} size={56} anchor="l" />
    <Tag tt={tt} at={it(h, 2)} x={120} y={760} txt="COOL · SOAKED" col={ICE} size={50} anchor="l" />
  </>;
}}</Stage>;

// ---- 20:43 · LA PIZARRA DEL DOCTOR: cuatro llamas en fila como radiografías en un negatoscopio; cada una se prende cuando se nombra con su remedio en tiza ----
export const HSymptoms: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const S = [{ f: "BIG + SMOKY", fix: "LID DOWN", hgt: 300, blue: 0, sm: 1, at: 0.6 }, { f: "DYING", fix: "OPEN THE HOLE", hgt: 80, blue: 0, sm: 1, at: it(h, 0) }, { f: "OIL LEFT", fix: "DRY CHIPS", hgt: 140, blue: 0.2, sm: 0, at: it(h, 1) }, { f: "SIDE BURN", fix: "HOLES UP HIGH", hgt: 160, blue: 0.1, sm: 0, at: it(h, 2) }];
  return <>{S.map((s, i) => { const on = cl((tt - s.at) * 2.5), x = 240 + i * 480;
    return <div key={s.f} style={{ position: "absolute", left: x - 210, top: 170, width: 420, height: 700, borderRadius: 14, background: on > 0 ? `rgba(220,240,255,${0.06 + 0.16 * on})` : "rgba(255,255,255,.04)", boxShadow: `inset 0 0 0 6px rgba(255,255,255,.18), 0 0 ${80 * on}px rgba(200,230,255,${0.25 * on})` }}>
      <Flame x={210} y={420} w={140} hgt={s.hgt} blue={s.blue} tt={tt} on={on} />
      {s.sm > 0 && <div style={{ position: "absolute", left: 120, top: 40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(40,40,40,.8), transparent 70%)", opacity: on, filter: "blur(12px)" }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 450, textAlign: "center", fontWeight: 900, fontSize: 40, color: TX, opacity: on }}>{s.f}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: GRN, opacity: cl((tt - s.at - 0.7) * 2) }}>{s.fix}</div>
    </div>; })}</>;
}}</Stage>;

// ---- 21:50 · LA RAYUELA: un mapa de tiza en el piso; la latita salta de casilla en casilla con su llama: caño congelado, casa de bomba, camioneta, pozo de hielo ----
export const HHopscotch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#4a4846,#2e2c2a)">{(tt) => {
  const P = [[330, 760, "FROZEN PIPE"], [760, 520, "PUMP HOUSE"], [1180, 760, "TRUCK"], [1600, 520, "ICE HOLE"]] as const, ats = [0.5, it(h, 0), it(h, 1), it(h, 2)];
  let i = 0; ats.forEach((a, k) => { if (tt > a) i = k; });
  const j = Math.min(3, i + 1), f = eio(tt, ats[j] - 0.6, ats[j]) * (i < 3 ? 1 : 0), x = P[i][0] + (P[j][0] - P[i][0]) * f, y = P[i][1] + (P[j][1] - P[i][1]) * f - 200 * Math.sin(Math.PI * f);
  return <>
    {P.map(([px, py, n], k) => <div key={n} style={{ position: "absolute", left: px - 190, top: py - 120, width: 380, height: 240, border: "8px solid rgba(255,255,255,.75)", borderRadius: 14, overflow: "visible", opacity: cl((tt - ats[k] + 0.6) * 2) * 0.9 + 0.1 }}>
      <Photo id={k === 0 ? h.img : (h.imgs as string[] | undefined)?.[k - 1] ?? h.img} w={364} h={224} r={6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: k <= i ? AMB : "rgba(255,255,255,.6)" }}>{n}</div>
    </div>)}
    <Can x={x} y={y + 90} w={130} hh={150} />
    <Flame x={x} y={y - 64} w={60} hgt={90} blue={0.2} tt={tt} />
  </>;
}}</Stage>;

// ---- 22:38 · LOS FLANCOS: planta del garage; un banco en el medio y dos latitas a los lados; dos aureolas tibias crecen y se tocan sobre el banco ----
export const HFlank: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = eio(tt, 0.8, 2.6), b = eio(tt, 1.6, 3.4), mv = eio(tt, it(h, 0), it(h, 0) + 1.5);
  return <>
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 840, borderRadius: 10, background: "repeating-linear-gradient(0deg,#3a3836 0 2px,transparent 2px 80px), repeating-linear-gradient(90deg,#3a3836 0 2px,#2a2826 2px 80px)", boxShadow: "inset 0 0 0 10px #555" }} />
    <div style={{ position: "absolute", left: 760, top: 470, width: 400, height: 160, background: "linear-gradient(180deg,#9a6a3e,#6b4526)", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}><div style={{ fontWeight: 900, fontSize: 44, color: "#f3e2c8", textAlign: "center", lineHeight: "160px" }}>BENCH</div></div>
    {[[520 - 80 * mv, a], [1400 + 80 * mv, b]].map(([x, s], k) => <React.Fragment key={k}>
      <div style={{ position: "absolute", left: x - 420 * s, top: 550 - 420 * s, width: 840 * s, height: 840 * s, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,150,60,.35), rgba(255,150,60,.12) 55%, transparent 70%)" }} />
      <Can x={x} y={640} w={130} hh={150} />
      <Flame x={x} y={492} w={70} hgt={110} blue={0.15} tt={tt + k} />
      <svg width={200} height={80} style={{ position: "absolute", left: k ? x + 80 : x - 280, top: 600, opacity: cl((tt - it(h, 0)) * 2) * (1 - mv * 0.6) }}><path d={k ? "M 10 40 L 170 40 M 130 10 L 175 40 L 130 70" : "M 190 40 L 30 40 M 70 10 L 25 40 L 70 70"} stroke={AMB} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
    </React.Fragment>)}
    <Tag tt={tt} at={it(h, 0)} x={960} y={930} txt="MOVE THEM AROUND" col={AMB} size={56} />
  </>;
}}</Stage>;
void iron; void Photo;
