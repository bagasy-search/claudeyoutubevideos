// te29d · PERÚ · componentes únicos (uno por minuto), parte 1 de 2. Cada pieza = UN objeto grande con volumen al centro, los elementos llegan de a uno
// con rebote, la acción principal corre hasta la salida (W/K/LIN de tkit) y hay UN solo renglón de texto lejos de los bordes. Registro: D:/rtmp/te29_COMPONENTES.md
import React from "react";
import { AMB, GRN, H, RED, Stage, TX, cl, eio, phys } from "./hkit";
import { HC2 } from "./ta2";
import { Bill, Floor, GOLD, INK, K, LIN, Num, PAPER, PAPERD, Person, Sash, Slab, W, at, lerp } from "./tkit";

// 0:25 · CUATRO CELDAS: el pabellón visto desde arriba en perspectiva con cuatro celdas; en cada una cae una banda presidencial sobre el catre y la reja se cierra, de a una
const XCell4: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), step = (w - 1.0) / 4;
  return <>
    <Floor x={960} y={960} w={1700} />
    <div style={{ ...at(160, 260), transform: "perspective(1800px) rotateX(38deg)", transformOrigin: "50% 80%" }}>
      <Slab w={1600} h={620} depth={40} side="#4a4c50" top="linear-gradient(180deg,#8a8c90,#6a6c70)">
        {[0, 1, 2, 3].map((i) => { const c = eio(tt, 0.4 + i * step, 0.4 + i * step + 0.9), s = phys(tt, 0.2 + i * step, 7, 0.45); return <div key={i} style={{ ...at(30 + i * 392, 30), width: 360, height: 560, background: "linear-gradient(180deg,#b9bcc0,#9a9da2)", boxShadow: "inset 0 0 0 14px #5a5c60" }}>
          <div style={{ ...at(40, 60), width: 120, height: 360, borderRadius: 10, background: "linear-gradient(90deg,#d8d2c4,#f4f0e8)", boxShadow: "0 10px 14px rgba(0,0,0,.35)" }} />
          {s > 0.01 && <div style={{ ...at(30, 140 - (1 - Math.min(1, s)) * 200), opacity: cl(s * 3) }}><Sash w={170} /></div>}
          {Array.from({ length: 7 }, (_, j) => <div key={j} style={{ ...at(14 + j * 52, 546 - 520 * c), width: 14, height: 520 * c, background: "linear-gradient(90deg,#3a3c40,#9aa0a6,#3a3c40)" }} />)}
        </div>; })}
      </Slab>
    </div>
    <Num tt={tt} d={0.2} x={960} y={140} txt="CUATRO EXPRESIDENTES" size={100} col={AMB} />
  </>;
}}</Stage>;

// 1:04 · FUEGO Y AGUA: a la izquierda arde una banca de madera (la política); a la derecha, un vaso de agua con una moneda adentro que ni tiembla (la economía)
const XFireWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = K(tt, h, 0.3);
  return <>
    <div style={{ ...at(0, 860), width: 1920, height: 220, background: "linear-gradient(180deg,#4a3a2a,#1e160e)" }} />
    <Floor x={520} y={870} w={700} o={0.8} /><Floor x={1400} y={870} w={420} o={0.8} />
    <div style={{ ...at(220, 540) }}><svg width={600} height={330}><rect x={0} y={60} width={600} height={60} rx={10} fill="#6a4426" /><rect x={0} y={150} width={600} height={50} rx={10} fill="#5a3a20" /><rect x={40} y={200} width={40} height={130} fill="#3a2614" /><rect x={520} y={200} width={40} height={130} fill="#3a2614" /><rect x={0} y={0} width={600} height={50} rx={10} fill="#7a4e2c" /></svg></div>
    {Array.from({ length: 14 }, (_, i) => { const f = 0.75 + 0.25 * Math.sin(tt * (7 + i) + i * 2), hh = (120 + (i * 37) % 160) * (0.4 + 0.6 * k) * f; return <div key={i} style={{ ...at(230 + i * 42, 600 - hh), width: 70, height: hh, borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 85%, #fff4a8, #ffa03a 40%, rgba(220,60,20,0) 75%)", filter: "blur(1.5px)", mixBlendMode: "screen" }} />; })}
    {Array.from({ length: 6 }, (_, i) => { const p = (tt * 0.4 + i / 6) % 1; return <div key={"s" + i} style={{ ...at(300 + i * 80 + 40 * Math.sin(p * 5), 400 - p * 300), width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(90,90,90,.45), transparent 70%)", opacity: Math.sin(Math.PI * p) }} />; })}
    <div style={{ ...at(1240, 420), width: 320, height: 460, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg, rgba(255,255,255,.18), rgba(255,255,255,.04) 30%, rgba(255,255,255,.2) 75%, rgba(255,255,255,.06))", border: "6px solid rgba(235,248,255,.8)", overflow: "hidden" }}>
      <div style={{ ...at(0, 110), width: 320, height: 360, background: "linear-gradient(180deg, rgba(120,190,230,.45), rgba(60,130,180,.55))" }} />
      <div style={{ ...at(0, 106), width: 320, height: 8, background: "rgba(255,255,255,.6)" }} />
      <div style={{ ...at(100, 330), width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff1b8,#e9b949 45%,#8a6414)", boxShadow: "0 10px 0 #6a4a10" }} />
    </div>
    <Num tt={tt} d={0.3} x={520} y={200} txt="LA POLÍTICA" size={90} col={RED} />
    <Num tt={tt} d={0.9} x={1400} y={200} txt="LA ECONOMÍA" size={90} col={GRN} />
  </>;
}}</Stage>;

// 2:46 · EL CUENTAPRECIOS: un contador mecánico de rodillos (como el de un surtidor) que gira enloquecido hasta 7.000 %; los rodillos traban con un golpe al final
const XOdometer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.3), v = 7000 * k, d = String(Math.floor(v)).padStart(4, "0").split(""), frac = v - Math.floor(v);
  return <>
    <Floor x={960} y={880} w={1500} />
    <div style={{ ...at(260, 330), width: 1400, height: 480, borderRadius: 40, background: "linear-gradient(180deg,#c9cdd1,#6a6e72 60%,#3a3d41)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.4)" }}>
      {d.map((c, i) => { const roll = i === 3 ? frac : 0, n = +c; return <div key={i} style={{ ...at(80 + i * 250, 70), width: 220, height: 340, borderRadius: 14, background: "#111", overflow: "hidden", boxShadow: "inset 0 30px 30px rgba(0,0,0,.8), inset 0 -30px 30px rgba(0,0,0,.8)" }}>
        {[n, (n + 1) % 10].map((m, j) => <div key={j} style={{ ...at(0, 40 + (j - roll) * 260), width: 220, height: 260, textAlign: "center", fontWeight: 900, fontSize: 230, lineHeight: "260px", color: "#f4f1ea", fontFamily: "'Courier New', monospace" }}>{m}</div>)}</div>; })}
      <div style={{ ...at(1100, 70), width: 220, height: 340, borderRadius: 14, background: "linear-gradient(180deg,#c2261e,#7a1410)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 200, color: "#fff" }}>%</div>
    </div>
    <Num tt={tt} d={0.2} x={960} y={190} txt="INFLACIÓN DE 1990" size={96} col={k > 0.98 ? RED : AMB} />
  </>;
}}</Stage>;

// 3:40 · EL CANDADO: la fachada de columnas del Congreso; un candado de hierro gigante baja balanceándose y se cierra con un clac; la luz de adentro se apaga
const XPadlock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), fall = phys(tt, 0.4, 5, 0.4), shut = eio(tt, w * 0.5, w * 0.62), dark = eio(tt, w * 0.62, w - 0.45), sw = 8 * Math.sin(tt * 2.2) * (1 - shut);
  return <>
    <Floor x={960} y={980} w={1700} />
    <svg width={1920} height={1080} style={at(0, 0)}><defs><linearGradient id="cl4" x1="0" x2="1"><stop offset="0" stopColor="#9a9282" /><stop offset=".45" stopColor="#f4efe4" /><stop offset="1" stopColor="#8a8272" /></linearGradient></defs>
      <path d="M260 360 L960 220 L1660 360 Z" fill="#e8e2d2" stroke="#a89e86" strokeWidth={6} /><rect x={280} y={360} width={1360} height={50} fill="#d6cfbd" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={320 + i * 170} y={410} width={80} height={460} fill="url(#cl4)" />)}
      <rect x={260} y={870} width={1400} height={90} fill="#c9c2b0" />
      {Array.from({ length: 7 }, (_, i) => <rect key={"w" + i} x={410 + i * 170} y={520} width={70} height={260} fill={`rgba(255,214,120,${0.8 * (1 - dark)})`} />)}</svg>
    <div style={{ ...at(960 - 190, lerp(-520, 420, Math.min(1, fall))), transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
      <div style={{ ...at(70, -180 + 60 * shut), width: 240, height: 260, borderRadius: "120px 120px 0 0", border: "46px solid #8a9096", borderBottom: "none", boxShadow: "inset 0 6px 0 rgba(255,255,255,.3)" }} />
      <div style={{ width: 380, height: 330, borderRadius: 40, background: "linear-gradient(135deg,#6a7076,#3a3d41 55%,#1a1c1e)", boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.25)", position: "relative" }}>
        <div style={{ ...at(160, 110), width: 60, height: 60, borderRadius: "50%", background: "#0a0a0a" }} /><div style={{ ...at(178, 150), width: 24, height: 80, background: "#0a0a0a" }} /></div>
    </div>
    <Num tt={tt} d={0.2} x={960} y={130} txt="5 DE ABRIL DE 1992" size={90} col={AMB} />
  </>;
}}</Stage>;

// 4:06 · EL VIDEO: un televisor de tubo enorme; entra un casete VHS, la pantalla hace nieve y aparece la escena: una mano que le pasa un fajo de billetes a otra
const XVhs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), ins = eio(tt, 0.3, 1.2), snow = cl((tt - 1.2) * 2) * (1 - cl((tt - 1.9) * 2)), sc = cl((tt - 1.8) * 2), pass = eio(tt, 2.0, w - 0.45);
  return <>
    <Floor x={960} y={980} w={1500} />
    <div style={{ ...at(360, 170), width: 1200, height: 800, borderRadius: 60, background: "linear-gradient(135deg,#5a5048,#2a2420 60%,#1a1612)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" }}>
      <div style={{ ...at(70, 70), width: 860, height: 640, borderRadius: "60px / 50px", background: "#0a0c0e", overflow: "hidden", boxShadow: "inset 0 0 60px rgba(0,0,0,.9)" }}>
        {snow > 0 && <div style={{ position: "absolute", inset: 0, opacity: snow, background: `repeating-linear-gradient(${(tt * 997) % 180}deg, #ddd 0 2px, #333 2px 5px, #999 5px 7px)` }} />}
        <div style={{ position: "absolute", inset: 0, opacity: sc, background: "linear-gradient(180deg,#5a4a3a,#3a2e24)" }}>
          <div style={{ ...at(0, 420), width: 860, height: 220, background: "#4a3424" }} />
          <div style={{ ...at(lerp(40, 260, pass), 300) }}><svg width={300} height={140}><path d="M0 60 L180 60 Q230 60 240 90 L240 120 L0 120 Z" fill="#c9a07a" /><rect x={0} y={60} width={90} height={60} fill="#2a2a30" /></svg></div>
          <div style={{ ...at(lerp(250, 380, pass), 280), transform: `rotate(${-6 + 6 * pass}deg)` }}><Bill w={180} /></div>
          <div style={{ ...at(560, 300) }}><svg width={300} height={140}><path d="M300 60 L120 60 Q70 60 60 90 L60 120 L300 120 Z" fill="#b98a64" /><rect x={210} y={60} width={90} height={60} fill="#1a2a3a" /></svg></div>
          <div style={{ ...at(30, 20), fontWeight: 900, fontSize: 40, color: "#e8402e", fontFamily: "'Courier New', monospace", opacity: Math.sin(tt * 6) > 0 ? 1 : 0.2 }}>● REC</div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)" }} />
      </div>
      {[0, 1].map((i) => <div key={i} style={{ ...at(1000, 140 + i * 160), width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#9a9088,#3a3430)" }} />)}
      <div style={{ ...at(960, 520), width: 200, height: 26, borderRadius: 6, background: "#0a0a0a" }} />
      <div style={{ ...at(980, lerp(380, 520, ins) - 0), width: 160, height: 100, borderRadius: 6, background: "linear-gradient(180deg,#2a2a2a,#111)", opacity: 1 - cl((ins - 0.95) * 20), boxShadow: "0 10px 14px rgba(0,0,0,.5)" }}><div style={{ ...at(20, 30), width: 120, height: 40, background: "#e8e4da" }} /></div>
    </div>
    <Num tt={tt} d={0.2} x={960} y={110} txt="SEPTIEMBRE DE 2000" size={84} col={AMB} />
  </>;
}}</Stage>;

// 5:01 · LA CADENA: una cadena de hierro gruesa baja eslabón por eslabón desde arriba; cada eslabón es un año; el contador llega a 25
const XChain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.3), n = k * 25, L = 64;
  return <>
    <div style={{ ...at(0, 0), width: 1920, height: 1080, background: "repeating-linear-gradient(0deg, transparent 0 118px, rgba(0,0,0,.3) 118px 124px), radial-gradient(ellipse at 50% 45%, #6a6058, #2e2824 80%)" }} />
    <div style={{ ...at(560, 0), width: 800, height: 1080, transform: `translateY(${Math.min(0, 560 - n * L * 0.62) * 0}px)` }}>
      {Array.from({ length: Math.ceil(n) }, (_, i) => { const f = Math.min(1, n - i), x = 400 + (i % 5) * 0 - 50 + Math.sin(i * 0.9 + tt) * 6, y = -60 + i * L * 0.42 * (1 - 0) - (1 - f) * 30;
        const col = Math.floor(i / 9); return <div key={i} style={{ ...at(x - 340 + col * 280 - 0, (i % 9) * 100 + 120 - (1 - f) * 60), width: 100, height: i % 2 ? 150 : 60, borderRadius: 50, border: `${i % 2 ? 22 : 18}px solid #8a9096`, boxShadow: "inset 0 4px 0 rgba(255,255,255,.35), 0 8px 12px rgba(0,0,0,.6)", opacity: cl(f * 3), transform: `rotate(${i % 2 ? 0 : 0}deg)`, display: y > 9999 ? "none" : "block" }} />; })}
    </div>
    <Num tt={tt} d={0.2} x={1560} y={540} txt={`${Math.max(1, Math.round(n))}`} size={230} col={n > 24.5 ? RED : TX} />
    <Num tt={tt} d={0.3} x={1560} y={690} txt={Math.round(n) === 1 ? "AÑO" : "AÑOS"} size={80} col={AMB} />
  </>;
}}</Stage>;

// 6:20 · EL CUARTO SECRETO: la biblioteca de una oficina se corre de costado y detrás aparece un cuarto iluminado: un escritorio con una computadora y fajos que se apilan solos
const XSecretRoom: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), slide = eio(tt, 0.4, w * 0.4), k = LIN(tt, h, w * 0.4), stacks = Math.floor(k * 18);
  return <>
    <div style={{ ...at(260, 160), width: 1400, height: 780, background: "linear-gradient(180deg,#3a3028,#1a1410)", boxShadow: "inset 0 0 0 20px #2a2018" }}>
      <div style={{ ...at(0, 0), width: 1400, height: 780, background: `radial-gradient(ellipse at 50% 20%, rgba(255,220,140,${0.5 * slide}), transparent 60%)` }} />
      <div style={{ ...at(300, 480), width: 800, height: 40, background: "linear-gradient(180deg,#8a5a34,#4a2d16)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
      <div style={{ ...at(340, 520), width: 30, height: 240, background: "#3a2614" }} /><div style={{ ...at(1030, 520), width: 30, height: 240, background: "#3a2614" }} />
      <div style={{ ...at(560, 280), width: 280, height: 190, borderRadius: 10, background: "linear-gradient(180deg,#d8d8d0,#a8a8a0)" }}><div style={{ ...at(16, 16), width: 248, height: 140, background: `linear-gradient(180deg,#1a3a2a,#0a2a1a)`, color: "#6fe39a", fontFamily: "'Courier New', monospace", fontSize: 26, padding: 8, overflow: "hidden" }}>{Array.from({ length: 5 }, (_, i) => <div key={i}>{"$ ".repeat(1 + ((i + Math.floor(tt * 4)) % 6))}</div>)}</div></div>
      <div style={{ ...at(660, 470), width: 80, height: 14, background: "#888" }} />
      {Array.from({ length: stacks }, (_, i) => { const side = i % 2, r = Math.floor(i / 2); return <div key={i} style={{ ...at(side ? 900 : 360, 450 - r * 22) }}><Bill w={150} /></div>; })}
    </div>
    <div style={{ ...at(260 - 1300 * slide, 160), width: 1400, height: 780, background: "linear-gradient(90deg,#4a2d16,#6a4426 50%,#4a2d16)", boxShadow: "20px 0 40px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 5 }, (_, r) => <div key={r} style={{ ...at(30, 30 + r * 150), width: 1340, height: 120, borderBottom: "16px solid #3a2410" }}>{Array.from({ length: 30 }, (_, j) => <div key={j} style={{ ...at(10 + j * 44, 120 - 100 - (j * 13) % 20), width: 36, height: 100 + (j * 13) % 20, background: ["#7a2a1a", "#2a4a6a", "#5a6a2a", "#8a6a2a"][(j + r) % 4], borderRadius: 3 }} />)}</div>)}
    </div>
    <Num tt={tt} d={0.2} x={960} y={100} txt="UN ÁREA PARA PAGAR SOBORNOS" size={78} col={AMB} />
  </>;
}}</Stage>;

// 7:06 · LA PLANILLA: una hoja de cálculo impresa, grande, con renglones de nombres tachados por bloques; un resaltador amarillo pasa renglón por renglón y la cifra de abajo sube a 29 millones
const XHighlighter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = LIN(tt, h, 0.4), N = 9, n = k * N, cur = Math.min(N - 1, Math.floor(n)), f = n - cur;
  return <>
    <Floor x={960} y={980} w={1500} />
    <div style={{ ...at(360, 170), width: 1200, height: 800, background: `linear-gradient(180deg,${PAPER},${PAPERD})`, boxShadow: "0 30px 60px rgba(0,0,0,.6)", transform: "perspective(1800px) rotateX(18deg)", transformOrigin: "50% 100%" }}>
      <div style={{ ...at(60, 40), width: 1080, height: 60, background: "#2a4a3a", color: "#fff", fontWeight: 900, fontSize: 38, lineHeight: "60px", paddingLeft: 20 }}>CÓDIGO · OBRA · MONTO</div>
      {Array.from({ length: N }, (_, i) => { const hl = i < cur ? 1 : i === cur ? f : 0; return <div key={i} style={{ ...at(60, 120 + i * 70), width: 1080, height: 60, borderBottom: "3px solid rgba(80,60,30,.25)" }}>
        <div style={{ ...at(0, 8), width: 1080 * hl, height: 44, background: "rgba(255,230,40,.65)" }} />
        <div style={{ ...at(20, 16), width: 260, height: 26, background: "#1a1814", borderRadius: 4 }} />
        <div style={{ ...at(340, 16), width: 420, height: 26, background: "rgba(40,30,20,.55)", borderRadius: 4 }} />
        <div style={{ ...at(860, 8), fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 38, color: INK }}>{`${(1.2 + ((i * 7) % 9) * 0.6).toFixed(1).replace(".", ",")} M`}</div></div>; })}
    </div>
    <div style={{ ...at(360 + 60 + 1080 * Math.min(1, f) - 40, 330 + cur * 66), transform: "rotate(-30deg)" }}><div style={{ width: 70, height: 260, borderRadius: "14px 14px 30px 30px", background: "linear-gradient(90deg,#c9a80a,#ffe23a 50%,#b8960a)", boxShadow: "0 14px 20px rgba(0,0,0,.5)" }} /></div>
    <Num tt={tt} d={0.2} x={960} y={110} txt={`US$ ${Math.max(1, Math.round(29 * k))} ${Math.round(29 * k) <= 1 ? "MILLÓN" : "MILLONES"} EN PERÚ`} size={84} col={AMB} />
  </>;
}}</Stage>;

// 8:12 · EL ORADOR: un micrófono de pie antiguo al centro, grande y cromado; delante, una plaza de siluetas que levanta los brazos en ola
const XPlaza: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = LIN(tt, h, 0.3), rows = 3;
  return <>
    <div style={{ ...at(0, 0), width: 1920, height: 1080, background: `radial-gradient(ellipse at 50% 30%, rgba(255,214,140,${0.25 + 0.15 * k}), transparent 55%)` }} />
    <div style={{ ...at(930, 380), width: 60, height: 520, background: "linear-gradient(90deg,#6a7076,#f0f2f4,#5a5e62)" }} />
    <div style={{ ...at(800, 880), width: 320, height: 40, borderRadius: "50%", background: "linear-gradient(180deg,#9aa0a6,#3a3d41)" }} />
    <div style={{ ...at(860, 180), width: 200, height: 260, borderRadius: 60, background: "repeating-linear-gradient(0deg,#3a3d41 0 10px,#9aa0a6 10px 16px)", boxShadow: "inset 0 0 0 14px #c9cdd1, 0 20px 30px rgba(0,0,0,.6)" }} />
    {Array.from({ length: rows }, (_, r) => Array.from({ length: 16 }, (_, i) => { const x = 40 + i * 120 + (r % 2) * 60, y = 640 + r * 120, arm = Math.max(0, Math.sin(tt * 3 - i * 0.5 + r)) * k;
      return <div key={r + "_" + i} style={{ ...at(x, y), filter: `brightness(${0.5 + r * 0.2})` }}><Person w={90} col="#14110e" />
        <div style={{ ...at(10, 70 - 80 * arm), width: 16, height: 30 + 80 * arm, background: "#14110e", borderRadius: 8, transform: `rotate(${-20 * arm}deg)` }} /></div>; }))}
    <Num tt={tt} d={0.2} x={960} y={110} txt="LLENABA PLAZAS" size={100} col={AMB} />
  </>;
}}</Stage>;

// 9:01 · LOS CINCO ERRORES: el sillón presidencial de terciopelo rojo, grande; se le abren cinco grietas de a una, numeradas, hasta que una pata cede
const XCrackChair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), step = (w - 1.2) / 5, n = Math.min(5, Math.max(0, Math.floor((tt - 0.6) / step) + 1)), give = eio(tt, 0.6 + 4 * step + 0.5, w - 0.45);
  const C: [number, number, number][] = [[620, 330, 30], [1180, 420, -20], [760, 620, 10], [1080, 700, -40], [880, 480, 60]];
  return <>
    <Floor x={960} y={960} w={1100} />
    <div style={{ ...at(560, 160), transformOrigin: "30% 100%", transform: `rotate(${-5 * give}deg)` }}>
      <svg width={800} height={800}><defs><linearGradient id="vel" x1="0" x2="1"><stop offset="0" stopColor="#5a0a0a" /><stop offset=".45" stopColor="#c2261e" /><stop offset="1" stopColor="#4a0808" /></linearGradient></defs>
        <path d="M120 40 Q400 -20 680 40 L660 470 L140 470 Z" fill={`url(#vel)`} stroke={GOLD} strokeWidth={16} />
        <rect x={60} y={460} width={680} height={130} rx={30} fill="url(#vel)" stroke={GOLD} strokeWidth={14} />
        <rect x={20} y={300} width={90} height={290} rx={30} fill="#8a6414" /><rect x={690} y={300} width={90} height={290} rx={30} fill="#8a6414" />
        <rect x={90} y={590} width={50} height={190} fill="#8a6414" /><rect x={660} y={590} width={50} height={190 - 60 * give} fill="#8a6414" transform={`rotate(${20 * give} 685 590)`} /></svg>
    </div>
    {C.slice(0, n).map(([x, y, a], i) => { const g = cl((tt - 0.6 - i * step) * 3); return <div key={i} style={{ ...at(x, y) }}>
      <svg width={200} height={200} style={{ ...at(-100, -100), transform: `rotate(${a}deg)` }}><path d={`M100 100 L${100 + 70 * g} ${80 - 10 * g} L${100 + 90 * g} ${110 + 20 * g} M100 100 L${100 - 60 * g} ${120 + 20 * g} L${100 - 90 * g} ${100 + 10 * g} M100 100 L${110} ${100 - 70 * g}`} stroke="#1a0606" strokeWidth={8} fill="none" strokeLinecap="round" /></svg>
      <div style={{ ...at(-34, -34), width: 68, height: 68, borderRadius: "50%", background: "#f4f1ea", color: "#b8261e", fontWeight: 900, fontSize: 46, textAlign: "center", lineHeight: "68px", transform: `scale(${phys(tt, 0.6 + i * step, 8, 0.4)})`, boxShadow: "0 6px 14px rgba(0,0,0,.6)" }}>{i + 1}</div></div>; })}
    <Num tt={tt} d={0.2} x={960} y={110} txt="LOS CINCO ERRORES" size={100} col={AMB} />
  </>;
}}</Stage>;

// 10:44 · EL TRUEQUE: sobre una mesa, de un lado avanza una maqueta de puente (la obra) y del otro un voto de papel; se cruzan en el medio y cambian de dueño
const XVoteTrade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = K(tt, h, 0.3), a = lerp(380, 1200, k), b = lerp(1300, 480, k), lift = Math.sin(Math.PI * k) * 120;
  return <>
    <div style={{ ...at(80, 720), width: 1760, height: 70, background: "linear-gradient(180deg,#2a6a3a,#1a4a2a)", borderRadius: 14, boxShadow: "0 40px 50px rgba(0,0,0,.6)" }} />
    <div style={{ ...at(a - 200, 470 - lift) }}><svg width={420} height={260}><path d="M0 200 L420 200 L420 230 L0 230 Z" fill="#9aa0a6" /><path d="M20 200 Q210 20 400 200" fill="none" stroke="#c9cdd1" strokeWidth={16} />{Array.from({ length: 9 }, (_, i) => <line key={i} x1={40 + i * 42} y1={200} x2={40 + i * 42} y2={200 - Math.sin(((40 + i * 42) / 420) * Math.PI) * 170} stroke="#c9cdd1" strokeWidth={6} />)}
      <rect x={20} y={230} width={30} height={30} fill="#6a6e72" /><rect x={370} y={230} width={30} height={30} fill="#6a6e72" /></svg>
      <div style={{ ...at(150, 4), width: 70, height: 70, borderRadius: "50%", background: "#ffd34a", color: "#2a2216", fontWeight: 900, fontSize: 46, textAlign: "center", lineHeight: "70px" }}>⚒</div></div>
    <div style={{ ...at(b - 150, 430 + lift * 0.4), transform: `rotate(${-8 + 16 * k}deg)` }}>
      <div style={{ width: 300, height: 260, background: `linear-gradient(160deg,${PAPER},${PAPERD})`, boxShadow: "0 16px 30px rgba(0,0,0,.5)", borderRadius: 8, position: "relative" }}>
        <div style={{ ...at(30, 30), width: 240, height: 40, background: "#1a3a6a", color: "#fff", fontWeight: 900, fontSize: 32, textAlign: "center", lineHeight: "40px" }}>VOTO</div>
        <div style={{ ...at(100, 100), width: 110, height: 110, border: "8px solid #1a1814" }}><svg width={94} height={94}><path d="M10 10 L84 84 M84 10 L10 84" stroke="#1a1814" strokeWidth={12} /></svg></div></div></div>
    <Num tt={tt} d={0.2} x={960} y={170} txt="OBRAS A CAMBIO DE VOTOS" size={92} col={AMB} />
  </>;
}}</Stage>;

// 11:31 · LA CALLE: una avenida en perspectiva que se llena de siluetas con pancartas, fila por fila, desde el fondo hacia la cámara
const XCrowdWave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.3), R = 6, rows = k * R;
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M860 380 L1060 380 L1920 1080 L0 1080 Z" fill="#3a3632" /><path d="M960 380 L960 1080" stroke="#e9b949" strokeWidth={10} strokeDasharray="40 40" opacity={0.6} />
      <path d="M0 380 L860 380 L0 1080 Z" fill="#2a2420" /><path d="M1060 380 L1920 380 L1920 1080 Z" fill="#2a2420" /></svg>
    {Array.from({ length: Math.ceil(rows) }, (_, r) => { const f = Math.min(1, rows - r), s = 0.35 + r * 0.22, y = 380 + r * 110, n = 4 + r * 2, span = 220 + r * 280;
      return <div key={r} style={{ opacity: cl(f * 2) }}>{Array.from({ length: n }, (_, i) => { const x = 960 - span + (i / (n - 1)) * span * 2, bob = 6 * Math.sin(tt * 4 + i + r);
        return <div key={i} style={{ ...at(x - 40 * s, y - 220 * s + bob - (1 - f) * 40), transform: `scale(${s})`, transformOrigin: "0 0" }}>
          <Person w={80} col="#14110e" />{i % 2 === 0 && <><div style={{ ...at(36, -150), width: 8, height: 170, background: "#5a3a20" }} /><div style={{ ...at(-30, -200), width: 140, height: 80, background: i % 4 ? "#f1ead9" : "#d91023", borderRadius: 4 }} /></>}</div>; })}</div>; })}
    <Num tt={tt} d={0.2} x={960} y={150} txt="NOVIEMBRE DE 2020" size={96} col={AMB} />
  </>;
}}</Stage>;

// 12:45 · EL FICHERO: un fichero giratorio de escritorio (rolodex) grande; las tarjetas de ministro pasan volando una tras otra, cada vez más rápido
const XRolodex: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = LIN(tt, h, 0.3), ang = 60 * (tt + 2.2 * tt * tt * k / Math.max(1, W(h))), N = 16, cnt = Math.floor(ang / (360 / N));
  return <>
    <Floor x={960} y={930} w={1200} />
    <div style={{ ...at(500, 840), width: 920, height: 60, borderRadius: 20, background: "linear-gradient(180deg,#3a3d41,#1a1c1e)" }} />
    <div style={{ ...at(560, 520), width: 30, height: 340, background: "#2a2c2e" }} /><div style={{ ...at(1330, 520), width: 30, height: 340, background: "#2a2c2e" }} />
    {Array.from({ length: N }, (_, i) => { const a = ((i * (360 / N) + ang) % 360), rad = (a * Math.PI) / 180, z = Math.cos(rad), y = 520 + Math.sin(rad) * 240;
      return z > -0.1 ? <div key={i} style={{ ...at(600, y - 170), width: 720, height: 340, zIndex: Math.round(z * 100), transformOrigin: "50% 100%", transform: `perspective(1600px) rotateX(${-a + 90}deg)`, background: `linear-gradient(180deg,#fdfaf2,#e8e0cc)`, borderRadius: 12, boxShadow: "0 6px 14px rgba(0,0,0,.35)", filter: `brightness(${0.55 + 0.45 * z})` }}>
        <div style={{ ...at(30, 30), width: 120, height: 150, borderRadius: 10, background: "#c9c2b0", overflow: "hidden" }}><div style={{ ...at(20, 30) }}><Person w={80} col="#4a443c" /></div></div>
        <div style={{ ...at(180, 50), width: 460, height: 28, background: "#2a2622", borderRadius: 4 }} /><div style={{ ...at(180, 110), width: 320, height: 22, background: "#8a8272", borderRadius: 4 }} />
        <div style={{ ...at(180, 160), fontWeight: 900, fontSize: 44, color: "#b8261e" }}>MINISTRO</div></div> : null; })}
    <div style={{ ...at(560, 500), width: 800, height: 40, borderRadius: 20, background: "linear-gradient(180deg,#9aa0a6,#3a3d41)", zIndex: 200 }} />
    <Num tt={tt} d={0.2} x={960} y={130} txt={`${Math.max(1, cnt)} ${cnt <= 1 ? "MINISTRO" : "MINISTROS"}`} size={100} col={AMB} />
  </>;
}}</Stage>;

// 13:23 · EN VIVO: una mesa larga de gabinete con placas de nombre; las placas caen boca abajo de a una, con golpe, hasta que queda una sola en pie
const XNameplates: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), N = 7, step = (w - 1.2) / (N - 1);
  return <>
    <div style={{ ...at(80, 640), width: 1760, height: 90, background: "linear-gradient(180deg,#6a4426,#3a2410)", borderRadius: 14, boxShadow: "0 40px 50px rgba(0,0,0,.6)" }} />
    {Array.from({ length: N }, (_, i) => { const mid = i === 3, f = mid ? 0 : phys(tt, 0.5 + (i < 3 ? i : i - 1) * step, 7, 0.5), ang = 90 * Math.min(1.04, f);
      return <div key={i} style={{ ...at(150 + i * 235, 470), width: 210, height: 170, transformOrigin: "50% 100%", transform: `perspective(900px) rotateX(${-ang}deg)` }}>
        <div style={{ position: "absolute", inset: 0, background: mid ? `linear-gradient(180deg,#fff1b8,${GOLD} 50%,#8a6414)` : "linear-gradient(180deg,#f4f1ea,#c9c2b0)", borderRadius: 8, boxShadow: "0 14px 20px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 150, height: 24, background: mid ? "#3a2614" : "#2a2622", borderRadius: 4 }} /></div></div>; })}
    <Num tt={tt} d={0.2} x={960} y={200} txt="RENUNCIAN EN VIVO" size={100} col={RED} />
  </>;
}}</Stage>;

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { cell4: XCell4, firewater: XFireWater, odometer: XOdometer, padlock: XPadlock, vhs: XVhs, chain: XChain, secretroom: XSecretRoom,
  highlighter: XHighlighter, plaza: XPlaza, crackchair: XCrackChair, votetrade: XVoteTrade, crowdwave: XCrowdWave, rolodex: XRolodex, nameplates: XNameplates, ...HC2 };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
const _t = TX; void _t;
