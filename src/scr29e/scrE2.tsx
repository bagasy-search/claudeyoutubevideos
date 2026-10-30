// scr29e · componentes únicos 17-34 (minutos 9-24). Ninguno repetido con scr29a/b/c/d. CTA: HLever (suscribirse) + HCabinmap (pregunta).
import React from "react";
import { AMB, H, HAND, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Ammo, BLU, Batt, Flame, GRN, Panel, PcFan, Smoke, Sun, abs, it, steel } from "./scrE1";

// ---- 9:47 · LAS CELDAS: la batería se abre en 6 celdas que se llenan de luz (84 Wh); un reloj de arena de horas de ventilador cae hasta 25 h, y una franja roja corta en 12-15 h ----
export const HCells: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fill = eio(tt, 0.5, 2.6), hrs = eio(tt, it(h, 0) - 0.6, it(h, 0) + 1.2), safe = eio(tt, it(h, 1) - 0.3, it(h, 1) + 0.6);
  return <>
    <div style={abs(200, 260, 720, 520, { borderRadius: 20, background: "linear-gradient(180deg,#2b2c30,#151619)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, padding: 30 })}>
      {Array.from({ length: 6 }, (_, k) => { const f = cl(fill * 6 - k); return <div key={k} style={{ borderRadius: 12, background: "#0c0d0f", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${f * 100}%`, background: "linear-gradient(180deg,#9df2bd,#2f9d5a)", boxShadow: "0 0 30px #6fe39a" }} /></div>; })}
    </div>
    <Tag tt={tt} at={2.4} x={560} y={860} txt="12 V × 7 Ah = 84 Wh" col={GRN} size={52} />
    {/* la regla de horas */}
    <div style={abs(1100, 300, 620, 60, { borderRadius: 30, background: "rgba(255,255,255,.08)" })}>
      <div style={abs(0, 0, 620 * hrs, 60, { borderRadius: 30, background: `linear-gradient(90deg,${GRN},${AMB})` })} />
      <div style={abs(620 * 0.5, -20, 620 * 0.5, 100, { borderRadius: 8, background: "repeating-linear-gradient(45deg,rgba(255,90,74,.45) 0 14px,transparent 14px 28px)", opacity: safe })} />
    </div>
    {[0, 12, 25].map((v) => <div key={v} style={abs(1100 + (620 * v) / 25 - 40, 380, 80, 50, { fontFamily: HAND, fontSize: 40, color: TX, textAlign: "center" })}>{v}h</div>)}
    <PcFan x={1410} y={640} s={220} tt={tt} vel={0.8} />
    <Tag tt={tt} at={it(h, 0) + 0.8} x={1410} y={220} txt="25 H IN THEORY" col={AMB} size={48} />
    <Tag tt={tt} at={it(h, 1) + 0.6} x={1410} y={900} txt="12–15 H FOR REAL" col={TX} size={54} />
  </>;
}}</Stage>;

// ---- 10:20 · EL FUSIBLE QUE SE SACRIFICA: un cable roza el filo de la caja y se pone rojo; el fusible de 3 A estalla y el cable se enfría al toque ----
export const HBlowout: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const rub = eio(tt, it(h, 0) - 2, it(h, 0) - 0.2), pop = tt > it(h, 0), glow = rub * (pop ? Math.max(0, 1 - (tt - it(h, 0)) * 2) : 1), flash = cl(1 - Math.abs(tt - it(h, 0)) * 4);
  return <>
    <Ammo x={1400} y={900} w={700} hh={360} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 300 560 C 600 560, 800 500, 1100 540" stroke={`rgb(${40 + 215 * glow},${40 + 60 * glow},${40})`} strokeWidth={22} fill="none" strokeLinecap="round" style={{ filter: glow > 0.1 ? `drop-shadow(0 0 ${30 * glow}px #ff5a2a)` : "none" }} />
      <path d="M 1100 540 C 1300 560, 1360 560, 1420 540" stroke={`rgb(${40 + 215 * glow},${40 + 60 * glow},${40})`} strokeWidth={22} fill="none" strokeLinecap="round" />
    </svg>
    {/* el portafusible */}
    <div style={abs(560, 500, 200, 110, { borderRadius: 20, background: "rgba(240,240,240,.18)", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.4)" })}>
      <div style={abs(30, 35, 140, 40, { borderRadius: 8, background: "#e8b53a" })}>
        <div style={abs(20, 14, pop ? 40 : 100, 12, { background: "#9aa0a7" })} />
        {pop && <div style={abs(80, 14, 40, 12, { background: "#9aa0a7" })} />}
      </div>
    </div>
    <div style={abs(560, 420, 200, 200, { borderRadius: "50%", background: "radial-gradient(circle,#fff,#ffd36a 30%,transparent 70%)", opacity: flash })} />
    <Batt x={200} y={700} w={240} hh={200} lv={0.85} />
    <Tag tt={tt} at={1.0} x={660} y={360} txt="3 A FUSE · $2" col={AMB} size={56} />
    <Tag tt={tt} at={it(h, 1)} x={1000} y={900} txt="CHEAPEST FIRE INSURANCE" col={GRN} size={54} />
  </>;
}}</Stage>;

// ---- 11:11 · LOS BORNES: el controlador de carga gigante de frente; sus tres pares de bornes se encienden uno por uno y de cada uno sale el dibujito de lo que va ahí ----
export const HTerminals: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const T: [string, number][] = [["PANEL", it(h, 0)], ["BATTERY", it(h, 1)], ["LOAD", it(h, 2)]];
  return <>
    <div style={abs(360, 160, 1200, 520, { borderRadius: 30, background: "linear-gradient(180deg,#e8eaee,#b9bdc3)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })}>
      <div style={abs(80, 60, 420, 140, { borderRadius: 12, background: "#16242e", boxShadow: "inset 0 0 0 6px #0d151b" })}><div style={abs(30, 30, 360, 80, { fontFamily: MARK, fontSize: 66, color: "#7ef0b0" })}>12.8V</div></div>
      <div style={abs(620, 90, 60, 60, { borderRadius: "50%", background: GRN, boxShadow: "0 0 30px #6fe39a" })} />
      {T.map(([n, at], i) => { const on = eio(tt, at - 0.2, at + 0.3);
        return <div key={n} style={abs(80 + i * 360, 300, 320, 180)}>
          {[0, 1].map((s) => <div key={s} style={abs(40 + s * 140, 20, 100, 100, { borderRadius: 14, background: s ? "#222" : "#c8352b", boxShadow: on > 0.5 ? `0 0 30px ${s ? "#888" : "#ff5a4a"}` : "none" })}><div style={abs(30, 30, 40, 40, { borderRadius: "50%", background: steel })} /></div>)}
          <div style={abs(0, 130, 320, 50, { fontFamily: HAND, fontWeight: 700, fontSize: 56, color: on > 0.5 ? "#111" : "#666", textAlign: "center" })}>{n}</div>
        </div>; })}
    </div>
    {T.map(([n, at], i) => { const s = phys(tt, at + 0.2, 6, 0.45), x = 520 + i * 360;
      return <div key={n} style={{ position: "absolute", left: 0, top: (1 - s) * 200, opacity: cl(s * 3) }}>
        {i === 0 ? <Panel x={x} y={860} w={260} hh={170} tt={tt} /> : i === 1 ? <Batt x={x} y={960} w={220} hh={170} lv={0.8} /> : <PcFan x={x} y={860} s={190} tt={tt} vel={0.7} />}
      </div>; })}
  </>;
}}</Stage>;

// ---- 11:27 · LA GUARDIA: sin controlador la batería se infla y humea; con controlador una barrera baja y corta el ventilador antes de que la barra toque cero ----
export const HGuard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const swell = eio(tt, 0.6, it(h, 0) + 0.8), lv = 1 - 0.8 * eio(tt, it(h, 1) - 2, it(h, 1)), gate = eio(tt, it(h, 1) - 0.2, it(h, 1) + 0.5), fan = lv > 0.22 ? 1 : 1 - gate;
  return <>
    <div style={abs(80, 120, 760, 840, { borderRadius: 24, background: "rgba(255,90,74,.08)", boxShadow: "inset 0 0 0 4px rgba(255,90,74,.4)" })} />
    <Panel x={460} y={260} w={360} hh={200} tt={tt} />
    <div style={{ position: "absolute", left: 460, top: 760, transform: `translate(-50%,-100%) scale(${1 + 0.18 * swell},${1 + 0.1 * swell})`, transformOrigin: "50% 100%" }}><div style={{ position: "relative", width: 300, height: 220 }}><Batt x={150} y={220} w={300} hh={220} lv={1} col={RED} /></div></div>
    <Smoke x={340} y={470} n={3} tt={tt} op={0.45 * swell} span={90} />
    <Tag tt={tt} at={it(h, 0) + 0.2} x={460} y={850} txt="NO CONTROLLER" col={RED} size={46} />
    <Batt x={1260} y={760} w={300} hh={220} lv={lv} />
    <PcFan x={1600} y={420} s={220} tt={tt} vel={fan} />
    <div style={abs(1440, 520 - 380 * (1 - gate), 30, 380, { background: `repeating-linear-gradient(180deg,${RED} 0 40px,#f4f4f4 40px 80px)`, borderRadius: 8 })} />
    <Tag tt={tt} at={it(h, 1) + 0.5} x={1340} y={890} txt="SAVES THE BATTERY" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 12:18 · LA CINTA DE PAPEL: un pedazo de cinta de pintor se pega sobre la caja y un marcador escribe el orden 1-2-3; después, una flecha lo da vuelta al revés para desarmar ----
export const HTapelabel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const st = phys(tt, 0.3, 6, 0.45), ats = [0.8, it(h, 0), it(h, 1)], back = eio(tt, it(h, 2) - 0.2, it(h, 2) + 0.8), W = ["BATTERY", "PANEL", "LOAD"];
  return <>
    <div style={abs(300, 380, 1320, 420, { borderRadius: 30, background: "linear-gradient(180deg,#e8eaee,#b9bdc3)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })}>
      {W.map((w, i) => <div key={w} style={abs(150 + i * 380, 290, 260, 90)}>{[0, 1].map((s) => <div key={s} style={abs(20 + s * 130, 0, 90, 90, { borderRadius: 12, background: s ? "#222" : "#c8352b" })}><div style={abs(27, 27, 36, 36, { borderRadius: "50%", background: steel })} /></div>)}</div>)}
    </div>
    <div style={abs(380, 300 + (1 - st) * -300, 1160, 300, { background: "#efe4b8", boxShadow: "0 10px 20px rgba(0,0,0,.35)", transform: "rotate(-1.5deg)", clipPath: "polygon(1% 4%,99% 0,100% 96%,0 100%)" })}>
      {W.map((w, i) => { const c = eio(tt, ats[i], ats[i] + 0.6);
        return <div key={w} style={abs(30 + i * 380, 50, 360, 200, { fontFamily: HAND, fontSize: 74, color: "#1d1b18", clipPath: `inset(0 ${100 - c * 100}% 0 0)`, textAlign: "center", lineHeight: 1 })}><div style={{ fontSize: 110 }}>{i + 1}</div>{w}</div>; })}
    </div>
    <svg width={1200} height={160} style={{ position: "absolute", left: 360, top: 820, opacity: back }}><path d="M 1100 80 L 100 80" stroke={RED} strokeWidth={16} strokeDasharray={1100} strokeDashoffset={1100 * (1 - back)} /><path d="M 140 40 L 90 80 L 140 120" stroke={RED} strokeWidth={16} fill="none" opacity={back} /></svg>
    <Tag tt={tt} at={it(h, 2) + 0.8} x={960} y={1010} txt="OFF = BACKWARDS: LOAD · PANEL · BATTERY" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 12:56 · LA PERSIANA DE CARTÓN: un cartón tapa el panel al sol (la flecha de corriente se apaga), los cables se conectan, el cartón sale y la corriente vuelve ----
export const HShutter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const cover = eio(tt, it(h, 0) - 0.6, it(h, 0)) * (1 - eio(tt, it(h, 1) - 0.2, it(h, 1) + 0.5)), wire = eio(tt, it(h, 0) + 0.4, it(h, 1) - 0.4), live = 1 - cover;
  return <>
    <Sun x={300} y={220} r={140} />
    <Panel x={760} y={520} w={760} hh={480} tt={tt} sun={live} />
    <div style={abs(380 + 760 * (1 - cover), 280, 760 * cover, 480, { background: "repeating-linear-gradient(90deg,#b98c58 0 6px,#a87d4b 6px 9px)", boxShadow: "0 20px 40px rgba(0,0,0,.4)" })} />
    <svg width={800} height={400} style={{ position: "absolute", left: 1100, top: 500 }}><path d="M 40 200 C 200 200, 300 100, 560 120" stroke="#222" strokeWidth={18} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - wire)} /></svg>
    {Array.from({ length: 4 }, (_, k) => { const p = (tt * 0.9 + k * 0.25) % 1; return <div key={k} style={abs(1140 + 500 * p, 690 - 80 * p, 40, 14, { borderRadius: 7, background: AMB, opacity: live * wire })} />; })}
    <Tag tt={tt} at={it(h, 0)} x={760} y={140} txt="CARDBOARD ON" col={AMB} size={54} />
    <Tag tt={tt} at={it(h, 1) + 0.4} x={1560} y={960} txt="CARDBOARD OFF" col={GRN} size={54} />
  </>;
}}</Stage>;

// ---- 13:07 · EL SEDIMENTO: el balde de aceite usado se aclara con los días; la mugre y el agua bajan al fondo; se vierten los dos tercios de arriba por una remera vieja a un bidón ----
export const HSediment: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const days = eio(tt, 0.4, it(h, 0) + 0.6), pour = eio(tt, it(h, 1) - 0.4, it(h, 1) + 2);
  return <>
    <div style={abs(300, 320, 460, 560, { borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.22) 30%,rgba(255,255,255,.06))", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.3)", overflow: "hidden" })}>
      <div style={abs(0, 80 + 120 * pour, 460, 480, { background: `linear-gradient(180deg, rgba(${90 + 60 * days},${50 + 30 * days},10,.9) 0%, rgba(40,22,6,.95) ${100 - 33 * days}%, #1a120a ${100 - 30 * days}%, #0a0806 100%)` })} />
      {Array.from({ length: 14 }, (_, k) => <div key={k} style={abs(30 + (k * 71) % 400, 120 + ((k * 53) % 300) + 300 * days, 14, 14, { borderRadius: "50%", background: "#0d0a06", opacity: 0.8 })} />)}
    </div>
    <Tag tt={tt} at={0.8} x={530} y={950} txt="LET IT SIT · A WEEK" col={AMB} size={48} />
    <div style={abs(1300, 400, 40, 300 * pour, { background: "linear-gradient(180deg,#b7802a,#8a5a16)", opacity: pour })} />
    <div style={abs(1180, 640, 320, 300, { borderRadius: "20px 20px 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.85),rgba(230,230,230,.95))", boxShadow: "0 30px 60px rgba(0,0,0,.5)", overflow: "hidden", opacity: cl(pour * 3) })}>
      <div style={abs(0, 300 - 220 * pour, 320, 220 * pour, { background: "rgba(190,130,40,.75)" })} />
    </div>
    <Tag tt={tt} at={it(h, 1) + 0.6} x={1300} y={270} txt="TOP TWO-THIRDS · T-SHIRT" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 13:40 · LA AGUJA: la perilla de la válvula aguja gira de a poquito; la gota se forma, cae y un metrónomo de luz marca una por segundo ----
export const HNeedle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const open = eio(tt, 0.4, it(h, 0)), ph = (tt - it(h, 0)) % 1, drip = tt > it(h, 0);
  return <>
    <div style={abs(0, 300, 1920, 50, { background: "linear-gradient(180deg,#a87d3a,#7a5520)" })} />
    <div style={abs(820, 220, 280, 220, { borderRadius: 26, background: "linear-gradient(180deg,#d8b45a,#a07a26)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })} />
    <div style={abs(880, 80, 160, 160, { borderRadius: "50%", background: "repeating-conic-gradient(#3a3a3a 0 10deg,#555 10deg 20deg)", transform: `rotate(${120 * open}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" })}><div style={abs(70, 6, 20, 50, { borderRadius: 10, background: AMB })} /></div>
    <div style={abs(946, 440, 28, 160, { background: steel, borderRadius: 6 })} />
    {drip && <div style={abs(930, 600 + 360 * ph * ph, 60, 82, { borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "linear-gradient(180deg,#e0a447,#8a5a16)", opacity: ph < 0.92 ? 1 : 0 })} />}
    <div style={abs(760, 960, 400, 60, { borderRadius: "0 0 200px 200px / 0 0 50px 50px", background: "#2a2a2c" })} />
    <div style={abs(1360, 560, 140, 140, { borderRadius: "50%", background: drip ? `rgba(111,227,154,${1 - ph})` : "transparent", boxShadow: drip ? `0 0 ${50 * (1 - ph)}px #6fe39a` : "none", border: "6px solid rgba(255,255,255,.3)" })} />
    <Tag tt={tt} at={0.8} x={500} y={600} txt="TINY TURNS" col={TX} size={56} />
    <Tag tt={tt} at={0.4} x={1130} y={210} txt="NEEDLE VALVE" col={AMB} size={54} anchor="l" />
    <Tag tt={tt} at={it(h, 0) + 0.4} x={1430} y={800} txt="1 DROP / SECOND" col={GRN} size={52} />
  </>;
}}</Stage>;

// ---- 14:16 · EL CAMBIO DE LLAMA: por la puertita, la llama amarilla y perezosa se aprieta, sube el zumbido y se pone azul y rápida; un medidor de dos colores pasa de LAZY a RIGHT ----
export const HFlamecheck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const b = eio(tt, it(h, 0) - 1, it(h, 0) + 0.4);
  return <>
    <div style={abs(460, 160, 1000, 760, { borderRadius: 40, background: "#3c4626", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })}>
      <div style={abs(200, 140, 600, 480, { background: "#070605", boxShadow: "inset 0 0 120px rgba(255,120,40,.35)", overflow: "hidden" })}>
        <Flame x={300} y={500} w={460 - 140 * b} hgt={380 + 60 * b} blue={b} tt={tt} />
      </div>
    </div>
    <div style={abs(1560, 220, 90, 620, { borderRadius: 45, background: "linear-gradient(180deg,#5aa8ff,#ffb84a)", boxShadow: "inset 0 0 0 6px rgba(0,0,0,.4)" })}>
      <div style={abs(-30, 560 - 520 * b, 150, 40, { borderRadius: 20, background: TX, boxShadow: "0 6px 16px rgba(0,0,0,.5)" })} />
    </div>
    <Tag tt={tt} at={0.5} x={420} y={1010} txt="YELLOW · LAZY" col={AMB} size={50} />
    <Tag tt={tt} at={it(h, 0) + 0.3} x={1600} y={140} txt="BLUE · RIGHT" col={BLU} size={56} />
  </>;
}}</Stage>;

// ---- 15:01 · LAS ZONAS DE LA TAPA: mapa de calor sobre la tapa; centro rojo hierve el agua, los costados cocinan suave; la percoladora y la lata de sopa se ubican; la tapa se levanta sola un dedo ----
export const HZones: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const map = eio(tt, 0.4, 1.6), pot = phys(tt, it(h, 1), 6, 0.45), lift = eio(tt, it(h, 2) - 0.2, it(h, 2) + 0.4) * (1 - eio(tt, it(h, 2) + 1.6, it(h, 2) + 2.2));
  return <>
    <div style={abs(260, 560, 1400, 360, { borderRadius: 14, background: "linear-gradient(180deg,#5d6a3c,#2c341b)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })} />
    <div style={abs(260, 520 - 26 * lift, 1400, 60, { borderRadius: 10, background: `linear-gradient(90deg, rgba(255,200,80,${0.5 * map}), rgba(255,60,20,${0.9 * map}) 50%, rgba(255,200,80,${0.5 * map})), #4c5730`, boxShadow: "0 10px 30px rgba(0,0,0,.4)", transform: `rotate(${-1.2 * lift}deg)`, transformOrigin: "0% 100%" })} />
    {/* la olla en el centro con vapor */}
    <div style={abs(820, 300 - 26 * lift, 280, 220, { borderRadius: "10px 10px 40px 40px", background: steel })} />
    {Array.from({ length: 4 }, (_, k) => <div key={k} style={abs(860 + k * 50, 260 - ((tt * 80 + k * 40) % 200), 60, 90, { borderRadius: "50%", background: "rgba(255,255,255,.25)", filter: "blur(10px)", opacity: map })} />)}
    {/* percoladora y lata de sopa en los costados */}
    <div style={abs(420, 520 - 280 * pot - 26 * lift, 160, 280 * pot, { borderRadius: "30px 30px 10px 10px", background: "linear-gradient(90deg,#9ea3aa,#e4e6ea 40%,#8a8f96)", opacity: cl(pot * 3) })} />
    <div style={abs(1380, 520 - 170 * pot - 26 * lift, 150, 170 * pot, { borderRadius: 10, background: "linear-gradient(90deg,#b8261d,#e04a3a 40%,#a01f17)", opacity: cl(pot * 3) })} />
    <Tag tt={tt} at={1.4} x={960} y={1000} txt="CENTER BOILS · ENDS SIMMER" col={AMB} size={48} />
    <Tag tt={tt} at={it(h, 2) + 0.4} x={1500} y={200} txt="DON'T LATCH IT" col={RED} size={52} />
  </>;
}}</Stage>;

// ---- 15:33 · EL PRONÓSTICO: una semana de íconos de clima; cada día la batería sube con el sol y baja de noche; con nubes sube un cuarto; si se corta el ventilador la llama queda perezosa, no peligrosa ----
export const HWeather: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const D = ["S", "S", "C", "C", "C"], run = eio(tt, 0.6, it(h, 1)), lazy = eio(tt, it(h, 1) - 0.2, it(h, 1) + 0.8);
  let lv = 0.9; const pts: [number, number][] = [];
  for (let k = 0; k <= 50; k++) { const d = Math.min(4, Math.floor(k / 10)), ph = (k % 10) / 10; lv += ph < 0.4 ? (D[d] === "S" ? 0.03 : 0.0075) : -0.022; lv = Math.max(0.18, Math.min(1, lv)); pts.push([200 + k * 25, 860 - lv * 380]); }
  const n = Math.max(2, Math.floor(run * 50) + 1);
  return <>
    {D.map((d, k) => <div key={k} style={abs(180 + k * 255 + 20, 190, 210, 210, { opacity: cl(run * 5 - k * 0.8) })}>{d === "S" ? <Sun x={105} y={105} r={95} /> : <div style={abs(10, 60, 190, 95, { borderRadius: 50, background: "#9aa3ad", boxShadow: "40px -26px 0 -8px #b4bcc5" })} />}</div>)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={200} y1={860 - 0.2 * 380} x2={1450} y2={860 - 0.2 * 380} stroke={RED} strokeWidth={4} strokeDasharray="14 10" />
      <polyline points={pts.slice(0, n).map((p) => p.join(",")).join(" ")} fill="none" stroke={GRN} strokeWidth={10} strokeLinejoin="round" />
    </svg>
    <Tag tt={tt} at={it(h, 0)} x={1150} y={460} txt="GREY DAY ≈ ¼" col={ICE} size={46} />
    <div style={abs(1560, 500, 300, 380, { borderRadius: 20, background: "#0b0a09", boxShadow: "inset 0 0 0 10px #3c4626", overflow: "hidden", opacity: lazy })}><Flame x={150} y={360} w={220} hgt={260} blue={0} tt={tt} /></div>
    <Tag tt={tt} at={it(h, 1) + 0.4} x={1560} y={950} txt="LAZY, NOT DANGEROUS" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 17:27 · EL RELOJ DE SOL: un reloj de sol de piedra; la sombra recorre MAÑANA, MEDIODÍA y NOCHE y en cada parada aparece la foto de ese momento del día ----
export const HSundial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const stops = [1.0, it(h, 0), it(h, 1)], seg = stops.filter((s) => tt > s).length - 1, a = -60 + 60 * Math.max(0, seg) + 60 * eio(tt, stops[Math.min(2, seg + 1)] - 0.6, stops[Math.min(2, seg + 1)]) * (seg < 2 ? 1 : 0);
  const L = ["MORNING", "MIDDAY", "EVENING"];
  return <>
    <div style={abs(160, 300, 760, 520, { borderRadius: "50%", background: "radial-gradient(ellipse,#bdb6a5,#8d8676)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", transform: "perspective(1400px) rotateX(48deg)" })}>
      <div style={abs(372, 40, 16, 220, { background: "#222" })} />
      <div style={abs(375, 260, 10, 230, { background: "rgba(0,0,0,.55)", transformOrigin: "5px 0px", transform: `rotate(${a}deg)`, filter: "blur(2px)" })} />
      {L.map((l, k) => <div key={l} style={abs(380 + 210 * Math.sin(((-60 + 60 * k) * Math.PI) / 180) - 120, 260 + 170 * Math.cos(((-60 + 60 * k) * Math.PI) / 180), 240, 50, { fontFamily: MARK, fontSize: 42, color: "#2a2620", textAlign: "center" })}>{l}</div>)}
    </div>
    {(h.imgs ?? []).slice(0, 3).map((id, k) => { const s = phys(tt, stops[k] + 0.2, 6, 0.45);
      return <div key={k} style={{ position: "absolute", left: 1060 + k * 40, top: 60 + k * 330, transform: `rotate(${(k - 1) * 3}deg) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 3) * (k === Math.max(0, seg) ? 1 : 0.55) }}><Photo id={id} w={520} h={280} /><div style={abs(0, 222, 520, 58, { background: "rgba(0,0,0,.6)", fontFamily: HAND, fontWeight: 700, fontSize: 46, color: TX, paddingLeft: 20 })}>{L[k]}</div></div>; })}
  </>;
}}</Stage>;

// ---- 18:52 · EL GRANERO DE ANTES: un granero en sepia; la ventana entreabierta deja entrar una corriente que llega a la estufa (el ventilador de los viejos); de noche, la estufa se apaga ----
export const HBarn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const draft = eio(tt, 0.6, 2), night = eio(tt, it(h, 0) - 0.2, it(h, 0) + 1.2);
  return <>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgb(${120 - 90 * night},${96 - 76 * night},${70 - 50 * night}), rgb(${70 - 50 * night},${52 - 38 * night},${36 - 26 * night}))` }} />
    <div style={{ position: "absolute", inset: 0, filter: `sepia(.75) brightness(${0.85 - 0.55 * night})` }}><Photo id={h.img} w={1920} h={1080} r={0} /></div>
    <div style={abs(0, 0, 1920, 1080, { background: "repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 4px,transparent 4px 160px)", opacity: 0.5 })} />
    <div style={abs(260, 220, 360, 300, { background: `rgba(230,220,180,${0.6 - 0.45 * night})`, boxShadow: "inset 0 0 0 16px #3b2a18" })} />
    {Array.from({ length: 6 }, (_, k) => { const p = (tt * 0.5 + k / 6) % 1; return <svg key={k} width={1200} height={300} style={{ position: "absolute", left: 600, top: 320 + k * 20, opacity: draft * (1 - p) * (1 - night) }}><path d={`M ${p * 900} 50 q 60 -30 120 0`} stroke="#f2e6c8" strokeWidth={6} fill="none" /></svg>; })}
    <div style={abs(1260, 520, 340, 420, { borderRadius: "30px 30px 10px 10px", background: "linear-gradient(90deg,#2b2a28,#4a4846 40%,#232220)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
      <div style={abs(90, 140, 160, 150, { borderRadius: "80px 80px 8px 8px", background: "#080706", boxShadow: `inset 0 0 0 8px #555, 0 0 ${80 * (1 - night)}px rgba(255,140,50,.6)`, overflow: "hidden" })}><Flame x={80} y={150} w={110} hgt={130} blue={0} tt={tt} on={1 - night} /></div>
    </div>
    <div style={abs(1400, 120, 60, 400, { background: "#2b2a28" })} />
    <Tag tt={tt} at={1.4} x={440} y={300} txt="A CRACKED WINDOW" col={TX} size={48} />
    <Tag tt={tt} at={it(h, 0) + 0.6} x={1430} y={1000} txt="NEVER WHILE THEY SLEPT" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 19:24 · LA BANDEJA DE ENTRADA: sobres de papel caen en una bandeja de alambre; cada uno se abre y muestra la pregunta con su respuesta corta en un sello ----
export const HInbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const Q: [string, string, string, number][] = [["CAR BATTERY?", "SURE · DEEP CYCLE LASTS", GRN, 0.5], ["LED STRIP TOO?", "YES · FAN FIRST", AMB, it(h, 0)], ["CLOUDY ALL WINTER?", "TWO 20W PANELS", ICE, it(h, 1)], ["HAIRDRYER?", "NEEDS AN OUTLET", RED, it(h, 2)]];
  return <>
    <div style={abs(160, 820, 1600, 120, { borderRadius: 10, background: "repeating-linear-gradient(90deg,#9ea3aa 0 6px,transparent 6px 40px)", boxShadow: "inset 0 0 0 8px #8a8f96" })} />
    {Q.map(([q, a, c, at], i) => { const s = phys(tt, at, 7, 0.4), open = eio(tt, at + 0.4, at + 0.9), x = 150 + i * 410;
      return <div key={q} style={abs(x, 300 - (1 - s) * 700, 360, 500, { opacity: cl(s * 3), transform: `rotate(${(i % 2 ? 2 : -2)}deg)` })}>
        <div style={abs(0, 120, 360, 360, { background: "#efe6d0", boxShadow: "0 30px 60px rgba(0,0,0,.5)" })}>
          <div style={abs(20, 40, 320, 140, { fontFamily: HAND, fontWeight: 700, fontSize: 42, color: "#222", lineHeight: 1.05, wordBreak: "break-word" })}>{q}</div>
          <div style={abs(30, 210, 300, 110, { border: `6px solid ${c}`, borderRadius: 10, fontFamily: MARK, fontSize: 30, color: c, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transform: `rotate(-6deg) scale(${1.6 - 0.6 * open})`, opacity: open })}>{a}</div>
        </div>
        <div style={abs(0, 120, 360, 160, { background: "#d9cdb0", clipPath: "polygon(0 0,100% 0,50% 100%)", transformOrigin: "50% 0%", transform: `rotateX(${180 * open}deg)`, opacity: 1 - open * 0.8 })} />
      </div>; })}
  </>;
}}</Stage>;

// ---- 20:48 · EL TICKET: un ticket de ferretería sale de la impresora renglón por renglón; al pie, el total de $160 y un sello «HALF WITH A JUNK PILE» ----
export const HReceipt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L: [string, string][] = [["AMMO CAN", "15"], ["PIPE + BOWL", "0"], ["FAN", "8"], ["FAN BOX + DUCT", "10"], ["CHIMNEY", "30"], ["PANEL", "35"], ["CONTROLLER", "10"], ["BATTERY", "25"], ["FUSE + WIRE", "10"], ["NEEDLE VALVE", "15"]];
  const n = Math.floor(eio(tt, 0.5, it(h, 1) - 0.3) * L.length), tot = eio(tt, it(h, 1) - 0.2, it(h, 1) + 0.6), half = phys(tt, it(h, 1) + 2.4, 6, 0.4);
  return <>
    <div style={abs(620, 40, 680, 120, { borderRadius: 16, background: "#2b2c30", boxShadow: "0 30px 60px rgba(0,0,0,.6)" })} />
    <div style={abs(660, 140, 600, 120 + 64 * n + 140 * tot, { background: "#fbfaf6", boxShadow: "0 30px 60px rgba(0,0,0,.45)", overflow: "hidden" })}>
      {L.slice(0, n).map(([a, b], i) => <div key={a} style={abs(40, 56 + i * 64, 520, 62, { display: "flex", justifyContent: "space-between", fontFamily: MARK, fontSize: 43, color: i === 6 ? "#1f6f3a" : "#222" })}><span>{a}</span><span>${b}</span></div>)}
      <div style={abs(40, 76 + 64 * n, 520, 120, { borderTop: "4px dashed #333", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MARK, fontSize: 64, color: "#111", opacity: tot })}><span>TOTAL</span><span>$160</span></div>
    </div>
    <div style={abs(1340, 640, 420, 160, { border: `8px solid ${GRN}`, borderRadius: 14, fontFamily: MARK, fontSize: 44, color: GRN, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transform: `rotate(-8deg) scale(${2 - half})`, opacity: cl(half * 2) })}>HALF WITH A JUNK PILE</div>
    <Tag tt={tt} at={it(h, 0) + 0.3} x={300} y={540} txt="THE $10 BOX" col={GRN} size={52} />
  </>;
}}</Stage>;

// ---- 21:21 · EL SUBIBAJA: un tablón sobre un caballete: de un lado $160 una vez, del otro $300-400 de gas cada invierno; cae del lado del gas y aparece un arbolito de Navidad ----
export const HSeesaw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const gas = phys(tt, 1.6, 4, 0.5), tilt = -14 * gas, xmas = phys(tt, it(h, 0), 6, 0.45);
  return <>
    <div style={abs(900, 760, 120, 180, { clipPath: "polygon(50% 0,100% 100%,0 100%)", background: "#6b4a2a" })} />
    <div style={abs(360, 730, 1200, 40, { borderRadius: 10, background: "repeating-linear-gradient(90deg,#a87b4c 0 160px,#98703f 160px 164px)", transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%", boxShadow: "0 20px 40px rgba(0,0,0,.4)" })}>
      <div style={abs(80, -220, 260, 220, { borderRadius: 16, background: "#2e3a22", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 70, color: GRN })}>$160</div>
      <div style={abs(820, -300 * gas, 300, 300 * gas, { borderRadius: 16, background: "#3a1e1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 56, color: RED, overflow: "hidden", textAlign: "center" })}>$300-400 / WINTER</div>
    </div>
    <div style={abs(1500, 200, 260, 360, { transform: `scale(${xmas})`, transformOrigin: "50% 100%", opacity: cl(xmas * 2) })}>
      {[0, 1, 2].map((k) => <div key={k} style={abs(130 - (60 + k * 50), 40 + k * 90, (60 + k * 50) * 2, 140, { clipPath: "polygon(50% 0,100% 100%,0 100%)", background: "#2f7d3d" })} />)}
      <div style={abs(110, 320, 40, 40, { background: "#5a3a1a" })} />
      <div style={abs(110, 10, 40, 40, { borderRadius: "50%", background: AMB, boxShadow: "0 0 30px #ffb84a" })} />
    </div>
    <Tag tt={tt} at={it(h, 0) + 0.5} x={1300} y={990} txt="PAID BEFORE CHRISTMAS" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 23:22 · LA PALANCA (CTA): una palanca de taller vieja con el escudo de la campanita; la mano invisible la baja con resorte y se prende una lámpara de jaula: SUBSCRIBE ----
export const HLever: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pull = phys(tt, 1.2, 6, 0.42), lamp = eio(tt, 1.6, 2.2);
  return <>
    <div style={abs(560, 260, 300, 520, { borderRadius: 20, background: "linear-gradient(180deg,#3a3d42,#1d1f22)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })}>
      <div style={abs(110, 240, 80, 80, { borderRadius: "50%", background: steel })} />
    </div>
    <div style={abs(700, 280, 22, 300, { borderRadius: 11, background: steel, transformOrigin: "11px 300px", transform: `rotate(${-40 + 80 * pull}deg)` })}><div style={abs(-29, -50, 80, 80, { borderRadius: "50%", background: RED, boxShadow: "0 10px 20px rgba(0,0,0,.5)" })} /></div>
    <div style={abs(1180, 160, 300, 380, { borderRadius: "40% 40% 20px 20px", background: "repeating-linear-gradient(90deg,#2a2a2a 0 6px,transparent 6px 46px)", boxShadow: "inset 0 0 0 8px #2a2a2a" })}>
      <div style={abs(80, 80, 140, 200, { borderRadius: "50% 50% 40% 40%", background: `radial-gradient(circle,rgba(255,240,190,${lamp}),rgba(255,190,90,${0.8 * lamp}) 60%,rgba(80,70,50,.6))`, boxShadow: `0 0 ${200 * lamp}px rgba(255,200,110,${lamp})` })} />
    </div>
    <Tag tt={tt} at={2} x={1330} y={680} txt="SUBSCRIBE" col={RED} size={96} />
    <Tag tt={tt} at={3} x={1330} y={800} txt="NEXT: A WATER COIL" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 23:34 · EL MAPA DE LA CABAÑA (pregunta): un plano a mano de una cabaña en el bosque; un pin de panel solar busca lugar en el techo, el poste y la pared sur con un signo de pregunta ----
export const HCabinmap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = [[960, 360], [1320, 420], [780, 640]], hop = tt * 0.45, k = Math.floor(hop) % 3, f = eio(hop % 1, 0, 0.5), pk = S[k], pn = S[(k + 1) % 3];
  const px = pk[0] + (pn[0] - pk[0]) * f, py = pk[1] + (pn[1] - pk[1]) * f - 80 * Math.sin(f * Math.PI);
  return <>
    <div style={abs(260, 200, 1400, 760, { background: "#ede3c8", boxShadow: "0 50px 90px rgba(0,0,0,.5)", transform: "rotate(-1deg)" })}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={abs(60 + (i * 113) % 1280, 60 + ((i * 197) % 3) * 260, 90, 120, { clipPath: "polygon(50% 0,100% 100%,0 100%)", background: "rgba(60,90,50,.55)" })} />)}
      <svg width={1400} height={800} style={{ position: "absolute", inset: 0 }}>
        <path d="M 480 520 L 700 300 L 920 520 Z M 500 520 L 900 520 L 900 700 L 500 700 Z" stroke="#3a2a1a" strokeWidth={8} fill="rgba(160,120,70,.25)" />
        <path d="M 1060 300 L 1060 560" stroke="#3a2a1a" strokeWidth={8} /><text x={1090} y={740} fontFamily={HAND} fontWeight={700} fontSize={84} fill="#3a2a1a">S ↓</text>
      </svg>
    </div>
    <div style={{ position: "absolute", left: px - 70, top: py - 60, transform: "rotate(-10deg)" }}><Panel x={70} y={40} w={140} hh={80} tt={tt} /></div>
    <Tag tt={tt} at={0.6} x={960} y={150} txt="OFF-GRID?" col={AMB} size={58} />
    <Tag tt={tt} at={it(h, 0)} x={960} y={1010} txt="WHERE WOULD YOU PUT THE PANEL?" col={TX} size={50} />
  </>;
}}</Stage>;
