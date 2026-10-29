// cuca29a · FRIJOLES · 25 componentes únicos (1 por truco) + errores / rutina / repaso. Ninguno se repite en la tanda.
import React from "react";
import { Bean, BR, cl, DIM, eio, Flame, H, HAND, Head, lerp, MZ, Olla, phys, Photo, RED, rnd, Stage, Tag, TIN, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const im = (h: H, i: number) => h.imgs?.[i];

// 1 · LUPA: pasa sobre la mesa; bajo el vidrio los granos nuevos brillan y los viejos se ven arrugados
const HLupa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lx = lerp(560, 1360, eio(tt, 0.8, 4.6)), ly = 560 + 60 * Math.sin(tt * 1.1);
  const beans = Array.from({ length: 34 }, (_, i) => ({ x: 380 + (i % 9) * 140 + rnd(i) * 40, y: 380 + Math.floor(i / 9) * 110 + rnd(i + 9) * 30, r: rnd(i + 3) * 180, ok: i % 9 < 4 }));
  return <>
    <Head tt={tt} kick="TRUCO 1" title="BRILLANTE Y DEL AÑO" />
    {beans.map((b, i) => <Bean key={i} x={b.x} y={b.y} r={b.r} s={0.9} ok={b.ok} o={cl(phys(tt, 0.2 + i * 0.02, 8, 0.5))} />)}
    <div style={{ position: "absolute", left: lx - 190, top: ly - 190, width: 380, height: 380, borderRadius: "50%", overflow: "hidden", border: "18px solid #5a3a22", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 40px rgba(255,255,255,.25)", background: "rgba(255,240,210,.08)" }}>
      <div style={{ position: "absolute", left: -lx * 1.8 + 190, top: -ly * 1.8 + 190, width: 1920 * 1.8, height: 1080 * 1.8, transform: "scale(1)", transformOrigin: "0 0" }}>
        {beans.map((b, i) => <Bean key={i} x={b.x * 1.8} y={b.y * 1.8} r={b.r} s={1.8} ok={b.ok} />)}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.35), transparent 40%)" }} />
    </div>
    <div style={{ position: "absolute", left: lx + 120, top: ly + 120, width: 60, height: 230, borderRadius: 20, background: "linear-gradient(90deg,#3b2414,#6b4426)", transform: "rotate(-40deg)", transformOrigin: "50% 0" }} />
    <Tag tt={tt} at={1.4} x={560} y={900} txt="NUEVO · BRILLA" col={MZ} />
    <Tag tt={tt} at={3.4} x={1360} y={900} txt="VIEJO · NUNCA SE ABLANDA" col={RED} />
  </>;
}}</Stage>;

// 2 · CHAROLA: los frijoles ruedan por la charola inclinada; las piedritas se quedan y se encienden
const HCharola: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const tilt = 8 * Math.sin(tt * 1.6) * cl(tt - 0.6);
  return <>
    <Head tt={tt} kick="TRUCO 2" title="DE A PUÑITOS, EN CHAROLA" />
    <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) perspective(1400px) rotateX(52deg) rotateZ(${tilt}deg)`, width: 1100, height: 640, borderRadius: 30, background: "linear-gradient(135deg,#b9b4aa,#7d786f)", boxShadow: "0 60px 90px rgba(0,0,0,.6), inset 0 0 0 16px #8f8a80" }}>
      {Array.from({ length: 46 }, (_, i) => { const sx = 120 + rnd(i) * 860, sy = 100 + rnd(i + 50) * 440, dx = 140 * Math.sin(tt * 1.6 + i) * cl(tt - 0.6) * 0.6;
        return <Bean key={i} x={sx + dx} y={sy} r={rnd(i + 7) * 180} s={1.1} />; })}
      {[0, 1, 2].map((i) => { const g = phys(tt, 2.2 + i * 0.6, 6, 0.4); const x = 300 + i * 260, y = 260 + (i % 2) * 120;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 46, height: 38, marginLeft: -23, marginTop: -19, borderRadius: "40% 55% 45% 50%", background: "#6f6a66", boxShadow: `0 0 ${50 * g}px ${18 * g}px rgba(255,200,80,${0.7 * g}), 0 4px 6px rgba(0,0,0,.5)`, border: `4px solid rgba(255,200,80,${g})` }} />; })}
    </div>
    <Tag tt={tt} at={2.6} x={1500} y={300} txt="UNA PIEDRITA = UN DIENTE" col={MZ} size={40} />
  </>;
}}</Stage>;

// 3 · TRES DEDOS: corte de la olla; el agua sube hasta la marca y una mano de tres dedos la mide
const HTresDedos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const lv = lerp(0.25, 0.68, eio(tt, 0.8, 3.2));
  return <>
    <Head tt={tt} kick="TRUCO 3" title="QUE LE SOBRE TRES DEDOS" />
    <Olla x={860} y={620} w={620} lvl={lv} liq="rgba(140,190,220,.85)" cut tt={tt} />
    {Array.from({ length: 30 }, (_, i) => <Bean key={i} x={620 + rnd(i) * 480} y={770 + rnd(i + 3) * 120 - 120 * eio(tt, 3.2, 5) * rnd(i + 8)} r={rnd(i) * 180} s={1.1} />)}
    {[0, 1, 2].map((i) => { const s = phys(tt, 2.6 + i * 0.3, 7, 0.5); return <div key={i} style={{ position: "absolute", left: 1220, top: 470 + i * 46, width: 220 * s, height: 40, borderRadius: 20, background: "linear-gradient(90deg,#c58b62,#8a5a3a)", boxShadow: "0 8px 14px rgba(0,0,0,.4)" }} />; })}
    <div style={{ position: "absolute", left: 1170, top: 460, width: 4, height: 150 * cl(phys(tt, 3.4, 6, 0.6)), background: MZ }} />
    <Tag tt={tt} at={3.6} x={1420} y={680} txt="3 DEDOS ARRIBA" col={MZ} size={42} />
    <Tag tt={tt} at={4.4} x={860} y={980} txt="AL OTRO DÍA, CASI EL DOBLE" col={DIM} size={30} />
  </>;
}}</Stage>;

// 4 · EL CHORRO: el agua turbia sale de la olla y se lleva las burbujas (los gases) al patio
const HChorro: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const tip = eio(tt, 0.5, 1.6);
  return <>
    <Head tt={tt} kick="TRUCO 4" title="EL AGUA DEL REMOJO SE TIRA" />
    <div style={{ position: "absolute", left: 520, top: 420, transform: `rotate(${-70 * tip}deg)`, transformOrigin: "80% 30%" }}><Olla x={260} y={260} w={420} steam={0} tt={tt} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M 820 380 C 980 420 1080 560 1120 900" fill="none" stroke="rgba(190,170,130,.8)" strokeWidth={46 * cl(tt - 1.3)} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl((tt - 1.3) * 0.9)} 1`} />
    </svg>
    {Array.from({ length: 22 }, (_, i) => { const k = ((tt - 1.6) * 0.45 + i / 22) % 1; if (tt < 1.6) return null;
      const x = lerp(820, 1120, k) + 30 * Math.sin(i), y = lerp(380, 900, k * k) - 10;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18 + (i % 4) * 8, height: 18 + (i % 4) * 8, borderRadius: "50%", border: "3px solid rgba(255,255,255,.8)", background: "rgba(255,255,255,.12)" }} />; })}
    <div style={{ position: "absolute", left: 1000, top: 900, width: 360, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(120,90,60,.9), transparent 70%)", transform: `scale(${cl(phys(tt, 2, 4, 0.6))})` }} />
    <Tag tt={tt} at={2.4} x={1460} y={520} txt="SE VAN LOS GASES" col={MZ} size={44} />
    <Tag tt={tt} at={3.2} x={1460} y={590} txt="AGUA NUEVA, LIMPIA" col={TX} size={32} />
  </>;
}}</Stage>;

// 5 · PERILLA: la perilla de la estufa gira de ALTA a BAJA y la llama obedece; el hervor pasa a borbotón suave
const HPerilla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const r = phys(tt, 2.4, 4, 0.5), ang = lerp(150, 20, cl(r)), k = lerp(1, 0.22, cl(r));
  return <>
    <Head tt={tt} kick="TRUCO 5" title="FUERTE AL PRINCIPIO, BAJITA DESPUÉS" />
    <div style={{ position: "absolute", left: 620, top: 560, width: 380, height: 380, marginLeft: -190, marginTop: -190, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e9e4da, #8c877e 70%)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 -10px 30px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: 160, top: 20, width: 60, height: 340, borderRadius: 30, background: "linear-gradient(90deg,#3c3833,#5f5a53)", transform: `rotate(${ang}deg)` }} />
    </div>
    {["ALTA", "MEDIA", "BAJA"].map((s, i) => <div key={i} style={{ position: "absolute", left: 620 + 250 * Math.cos(((150 - i * 65) - 90) * Math.PI / 180), top: 560 + 250 * Math.sin(((150 - i * 65) - 90) * Math.PI / 180), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 34, color: (i === 0 && r < 0.5) || (i === 2 && r >= 0.5) ? MZ : DIM }}>{s}</div>)}
    <Olla x={1320} y={520} w={440} steam={lerp(1, 0.5, cl(r))} tt={tt} />
    <Flame x={1320} y={900} k={k} tt={tt} s={1.2} />
    <Tag tt={tt} at={3.2} x={1320} y={980} txt="QUE APENAS BORBOTEE" col={MZ} size={36} />
  </>;
}}</Stage>;

// 6 · DUELO DE JARROS: el frío entra y el hervor se apaga (se pone azul); el caliente entra y sigue
const HDuelo: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const side = (x: number, cold: boolean, d: number) => { const p = eio(tt, d, d + 0.8), stop = cold ? cl((tt - d - 0.8) * 1.5) : 0;
    return <>
      <div style={{ position: "absolute", left: x - 120, top: 300, transform: `rotate(${-60 * p}deg)`, transformOrigin: "80% 80%", width: 200, height: 220, borderRadius: "30% 30% 40% 40%", background: cold ? "linear-gradient(135deg,#9fc6e0,#4c7a96)" : "linear-gradient(135deg,#d9894f,#7a3a16)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      <Olla x={x} y={720} w={420} steam={1 - stop} tt={tt} />
      <div style={{ position: "absolute", left: x - 200, top: 520, width: 400, height: 380, borderRadius: "40%", background: `radial-gradient(circle, rgba(120,190,255,${0.35 * stop}), transparent 70%)` }} />
      <Tag tt={tt} at={d + 1.4} x={x} y={1000} txt={cold ? "FRÍA: SE CORTA EL HERVOR" : "CALIENTE: SIGUE IGUAL"} col={cold ? "#9fd0ff" : MZ} size={34} />
    </>; };
  return <>
    <Head tt={tt} kick="TRUCO 6" title="SI LE FALTA AGUA, SIEMPRE CALIENTE" />
    {side(620, true, 0.8)}{side(1300, false, 2.6)}
    <div style={{ position: "absolute", left: 960, top: 640, width: 4, height: 420 * cl(tt - 0.4), background: "rgba(246,241,228,.25)", transform: "translateY(-50%)" }} />
  </>;
}}</Stage>;

// 7 · CUCHARA MEDIDORA: el bicarbonato llena la cucharita y una espátula la NIVELA en un cuarto
const HCuchara: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const fill = eio(tt, 0.8, 2.0), lev = eio(tt, 2.4, 3.4);
  return <>
    <Head tt={tt} kick="TRUCO 7" title="BICARBONATO: UNA PIZCA, Y SÓLO SI…" />
    <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%) rotate(-8deg)" }}>
      <div style={{ position: "relative", width: 300, height: 190, borderRadius: "0 0 150px 150px", background: "linear-gradient(180deg,#d8d8d8,#8a8a8a)", boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 190 * fill + 60 * fill * (1 - lev), background: "#fbfbf7", borderRadius: "50% 50% 0 0 / 30% 30% 0 0" }} />
      </div>
      <div style={{ position: "absolute", left: 290, top: 60, width: 420, height: 50, borderRadius: 25, background: "linear-gradient(180deg,#d8d8d8,#8a8a8a)" }} />
      <div style={{ position: "absolute", left: lerp(-260, 420, lev), top: -18, width: 420, height: 14, background: "#c49a6c", borderRadius: 7, opacity: cl((tt - 2.2) * 3) * (1 - cl((tt - 3.6) * 2)) }} />
      <div style={{ position: "absolute", left: 110, top: 220, fontFamily: HAND, fontWeight: 700, fontSize: 90, color: MZ }}>¼</div>
    </div>
    {Array.from({ length: 16 }, (_, i) => { const k = cl((tt - 2.6 - i * 0.04) * 1.2); return <div key={i} style={{ position: "absolute", left: 1170 + i * 8, top: 520 + k * 420, width: 10, height: 10, borderRadius: "50%", background: "#fff", opacity: k > 0 && k < 1 ? 0.9 : 0 }} />; })}
    <Tag tt={tt} at={3.6} x={960} y={900} txt="SÓLO CON AGUA DURA DE POZO" col={MZ} size={38} />
    <Tag tt={tt} at={4.4} x={960} y={960} txt="DE MÁS: SABOR A JABÓN" col={RED} size={30} />
  </>;
}}</Stage>;

// 8 · EL SOPLIDO: macro de un frijol en la cuchara; un soplo y la cascarita se abre y se arruga hacia atrás
const HSoplido: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const blow = cl((tt - 1.4) * 0.8), op = phys(tt, 2.4, 5, 0.4);
  return <>
    <Head tt={tt} kick="TRUCO 8" title="LA PRUEBA DEL SOPLIDO" />
    <div style={{ position: "absolute", left: 960, top: 600, width: 760, height: 380, marginLeft: -380, marginTop: -190, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%, #c79a6a, #6b4426 75%)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960, top: 590, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 380, height: 240, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #d9a06e, #8a4c2c 80%)", position: "relative", overflow: "visible" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,.6) 0 7%, #b5654a 30%, #5a2a18 100%)", clipPath: `polygon(0 0, ${100 - 55 * cl(op)}% 0, ${100 - 70 * cl(op)}% 100%, 0 100%)`, transform: `rotate(${-6 * cl(op)}deg)` }} />
        <svg width={380} height={240} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={`M ${380 - 210 * cl(op)} 10 q ${-30 * cl(op)} 110 ${-40 * cl(op)} 220`} fill="none" stroke="#3a1a0a" strokeWidth={6} opacity={cl(op)} />
        </svg>
      </div>
    </div>
    {Array.from({ length: 9 }, (_, i) => { const k = ((tt - 1.4) * 0.7 + i / 9) % 1; if (tt < 1.4 || tt > 3.4) return null;
      return <div key={i} style={{ position: "absolute", left: lerp(200, 760, k), top: 560 + (i - 4) * 18, width: 140, height: 6, borderRadius: 3, background: "rgba(255,255,255,.5)", opacity: blow * (1 - k) }} />; })}
    <Tag tt={tt} at={3.0} x={1440} y={420} txt="SE ABRE Y SE ARRUGA = YA ESTÁN" col={MZ} size={36} />
  </>;
}}</Stage>;

// 9 · ESTANTE: frascos de cada variedad bajan a la repisa; en la tapa, su reloj de cocción gira hasta su hora
const HEstante: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const V = [["PERUANO", 1.5, "#e8c36a"], ["BAYO", 2, "#c99a5a"], ["FLOR DE MAYO", 2, "#b57a7a"], ["PINTO", 2.5, "#c2906a"], ["NEGRO", 3, "#2a2226"]] as const;
  return <>
    <Head tt={tt} kick="TRUCO 9" title="CADA FRIJOL TIENE SU TIEMPO" />
    <div style={{ position: "absolute", left: 240, right: 240, top: 780, height: 36, borderRadius: 8, background: "linear-gradient(180deg,#7a5232,#4a2f1a)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    {V.map(([n, hr, c], i) => { const s = phys(tt, 0.5 + i * 0.35, 6, 0.4), x = 400 + i * 280, clock = eio(tt, 1.6 + i * 0.35, 3.2 + i * 0.35) * hr / 3;
      return <div key={i} style={{ position: "absolute", left: x, top: 780, transform: `translate(-50%,-100%) translateY(${(1 - s) * -700}px)` }}>
        <div style={{ width: 90, height: 90, margin: "0 auto -6px", borderRadius: "50%", background: "#d8cfbf", border: "8px solid #6b4a2a", position: "relative" }}>
          <div style={{ position: "absolute", inset: 6, borderRadius: "50%", background: `conic-gradient(${MZ} ${clock * 360}deg, transparent 0)` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontWeight: 900, fontSize: 24, color: TIN }}>{hr}h</div>
        </div>
        <div style={{ width: 190, height: 260, borderRadius: "20px 20px 26px 26px", background: "rgba(220,235,240,.18)", border: "4px solid rgba(255,255,255,.4)", overflow: "hidden", position: "relative" }}>
          {Array.from({ length: 26 }, (_, j) => <Bean key={j} x={20 + (j % 5) * 36 + rnd(j + i) * 10} y={250 - Math.floor(j / 5) * 34} r={rnd(j) * 180} s={0.85} col={c} />)}
        </div>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 26, marginTop: 50, color: TX, whiteSpace: "nowrap" }}>{n}</div>
      </div>; })}
  </>;
}}</Stage>;

// 10 · EL SALERO QUE ESPERA: una línea de cocción avanza; el salero camina detrás y sólo se vuelca al llegar a SUAVES
const HSalero: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.6, 3.6), x = lerp(320, 1500, p), pour = cl((tt - 3.8) * 1.4);
  return <>
    <Head tt={tt} kick="TRUCO 10" title="LA SAL, CUANDO YA ESTÁN SUAVES" />
    <div style={{ position: "absolute", left: 300, right: 300, top: 640, height: 10, borderRadius: 5, background: "rgba(246,241,228,.25)" }} />
    <div style={{ position: "absolute", left: 300, top: 640, width: x - 300, height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${BR}, ${MZ})` }} />
    {[["CRUDOS", 320], ["MEDIO", 910], ["SUAVES", 1500]].map(([l, xx], i) => <div key={i} style={{ position: "absolute", left: xx as number, top: 700, transform: "translateX(-50%)", fontWeight: 900, fontSize: 30, color: x >= (xx as number) - 5 ? MZ : DIM }}>{l}</div>)}
    {[320, 910, 1500].map((xx, i) => <Bean key={i} x={xx} y={600} s={1.6} ok={x >= xx - 5} />)}
    <div style={{ position: "absolute", left: x - 60, top: 340, transform: `rotate(${pour * 130}deg)`, transformOrigin: "50% 30%", width: 110, height: 190, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(90deg,#eee,#bbb)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 10, right: 10, top: -14, height: 40, borderRadius: 14, background: "#9a9a9a" }} />
    </div>
    {pour > 0.3 && Array.from({ length: 14 }, (_, i) => { const k = ((tt * 1.3 + i / 14) % 1); return <div key={i} style={{ position: "absolute", left: x + 70 + rnd(i) * 30, top: 480 + k * 140, width: 7, height: 7, background: "#fff", opacity: 0.9 * (1 - k) }} />; })}
    <Tag tt={tt} at={1.4} x={600} y={400} txt="ANTES: CÁSCARA DURA" col={RED} size={32} />
  </>;
}}</Stage>;

// 11 · LAS DOS HOJAS: criollo vs de tienda frente a frente; la criolla huele a anís (ondas) y la otra no
const HHojas: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const leaf = (x: number, ok: boolean, d: number) => { const s = phys(tt, d, 5, 0.45);
    return <div style={{ position: "absolute", left: x, top: 560, transform: `translate(-50%,-50%) rotate(${ok ? -18 : 14}deg) scale(${s})` }}>
      <svg width={420} height={220} viewBox="0 0 420 220"><path d="M 10 110 C 120 0, 320 0, 410 110 C 320 220, 120 220, 10 110 Z" fill={ok ? "#5e7a38" : "#7c8f5a"} stroke="#2e3a1a" strokeWidth={4} /><path d="M 10 110 L 410 110" stroke="#2e3a1a" strokeWidth={4} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${80 + i * 65} 110 l 40 -50 M ${80 + i * 65} 110 l 40 50`} stroke="#2e3a1a" strokeWidth={2} />)}</svg>
      {ok && [0, 1, 2].map((i) => { const k = ((tt * 0.5 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 210 - 60 - k * 120, top: 110 - 60 - k * 120, width: 120 + k * 240, height: 120 + k * 240, borderRadius: "50%", border: `3px solid rgba(255,220,140,${0.6 * (1 - k)})` }} />; })}
    </div>; };
  return <>
    <Head tt={tt} kick="TRUCO 11" title="HOJA DE AGUACATE CRIOLLO" />
    {leaf(620, true, 0.5)}{leaf(1300, false, 1.0)}
    <Tag tt={tt} at={1.8} x={620} y={820} txt="CRIOLLO · HUELE A ANÍS" col={MZ} size={34} />
    <Tag tt={tt} at={2.4} x={1300} y={820} txt="DE TIENDA · NO SIRVE" col={DIM} size={34} />
    <Tag tt={tt} at={3.4} x={960} y={930} txt="SÓLO PARA EL NEGRO · SECA, TOSTADITA" col={TX} size={28} />
  </>;
}}</Stage>;

// 12 · IDA Y VUELTA: cebolla y ajo caen a la olla, el caldo toma color, y vuelven a salir por el mismo arco
const HIdaVuelta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const go = eio(tt, 0.6, 1.6), back = eio(tt, 3.4, 4.4), k = go - back;
  const arc = (x0: number, d: number) => { const xx = lerp(x0, 960, k), yy = lerp(330, 560, k) - Math.sin(k * Math.PI) * 180 + d; return { xx, yy }; };
  const c = arc(560, 0), a = arc(1360, 0);
  return <>
    <Head tt={tt} kick="TRUCO 12" title="CEBOLLA Y AJO ENTEROS… Y SE SACAN" />
    <Olla x={960} y={720} w={560} lvl={0.6} liq={`rgb(${lerp(90, 140, cl(tt - 1.6))},${lerp(46, 80, cl(tt - 1.6))},28)`} cut steam={1} tt={tt} />
    <div style={{ position: "absolute", left: c.xx - 70, top: c.yy - 70, width: 140, height: 140, borderRadius: "50% 50% 45% 45%", background: "radial-gradient(circle at 40% 35%, #f6ead4, #c9a880 80%)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", opacity: k > 0.97 ? 0.4 : 1 }} />
    <div style={{ position: "absolute", left: a.xx - 50, top: a.yy - 55, width: 100, height: 110, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 40% 35%, #fffaf0, #d8ccb8 80%)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", opacity: k > 0.97 ? 0.4 : 1 }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M 560 330 Q 760 120 960 560" fill="none" stroke="rgba(255,201,74,.5)" strokeWidth={4} strokeDasharray="12 12" opacity={cl(tt - 0.4)} />
      <path d="M 1360 330 Q 1160 120 960 560" fill="none" stroke="rgba(255,201,74,.5)" strokeWidth={4} strokeDasharray="12 12" opacity={cl(tt - 0.4)} />
    </svg>
    <Tag tt={tt} at={2.0} x={960} y={1000} txt="DEJAN EL SABOR · NO LA TEXTURA" col={MZ} size={34} />
  </>;
}}</Stage>;

// 13 · DOS COSTALES: dos fechas distintas; los granos de uno se ablandan (se inflan) y los del otro siguen chiquitos
const HCostales: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const sack = (x: number, year: string, d: number) => { const s = phys(tt, d, 5, 0.4);
    return <div style={{ position: "absolute", left: x, top: 470, transform: `translate(-50%,-50%) translateY(${(1 - s) * -600}px)` }}>
      <div style={{ width: 300, height: 360, borderRadius: "40% 40% 20% 20%", background: "repeating-linear-gradient(45deg,#b79a6a 0 6px,#a88a5a 6px 12px)", boxShadow: "0 40px 70px rgba(0,0,0,.6)", position: "relative" }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 120, padding: "8px 0", borderRadius: 8, background: "#f3ead6", color: TIN, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52 }}>{year}</div>
      </div>
    </div>; };
  const g = eio(tt, 2.2, 4.4);
  return <>
    <Head tt={tt} kick="TRUCO 13" title="NUNCA MEZCLAR COSTALES" />
    {sack(560, "2025", 0.4)}{sack(1360, "2026", 0.8)}
    {Array.from({ length: 12 }, (_, i) => { const old = i % 2 === 0, x = 760 + (i % 6) * 80, y = 800 + Math.floor(i / 6) * 70;
      return <Bean key={i} x={x} y={y} s={old ? 1.1 : 1.1 + 0.6 * g} ok={!old} r={rnd(i) * 90} o={cl(tt - 1.6)} />; })}
    <Tag tt={tt} at={3.0} x={960} y={990} txt="UNOS SE DESHACEN · OTROS SIGUEN DUROS" col={MZ} size={32} />
  </>;
}}</Stage>;

// 14 · MANÓMETRO: la aguja de la olla exprés sube a la zona verde, la válvula silba, y la marca de 2/3 se enciende
const HManometro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const n = phys(tt, 1.0, 3, 0.35), ang = lerp(-120, 40, cl(n)) + 3 * Math.sin(tt * 14) * cl(tt - 2.6);
  return <>
    <Head tt={tt} kick="TRUCO 14" title="LA OLLA EXPRÉS, SIN MIEDO" />
    <div style={{ position: "absolute", left: 700, top: 560, width: 460, height: 460, marginLeft: -230, marginTop: -230, borderRadius: "50%", background: "radial-gradient(circle, #f4f1ea 60%, #b9b5ad 61%, #6f6b64 100%)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ position: "absolute" }}>
        <path d="M -150 110 A 190 190 0 0 1 150 110" fill="none" stroke="#ddd" strokeWidth={26} transform="rotate(0)" />
        <path d={`M ${190 * Math.cos(-35 * Math.PI / 180 - Math.PI / 2 + Math.PI / 2)} 0`} />
        <path d="M 70 -176 A 190 190 0 0 1 176 -70" fill="none" stroke="#3faa4c" strokeWidth={26} />
        <path d="M 176 -70 A 190 190 0 0 1 176 70" fill="none" stroke={RED} strokeWidth={26} />
        <line x1={0} y1={0} x2={0} y2={-170} stroke="#222" strokeWidth={10} strokeLinecap="round" transform={`rotate(${ang})`} />
        <circle r={22} fill="#222" />
      </svg>
    </div>
    <Olla x={1300} y={640} w={460} lvl={0.66} liq="#5a2e1c" cut tt={tt} />
    <div style={{ position: "absolute", left: 1080, top: 640 - 0.66 * 395 + 395 * 0.5 - 196, width: 440, height: 4, background: MZ, opacity: cl((tt - 3) * 2) }} />
    <Tag tt={tt} at={3.2} x={1300} y={300} txt="HASTA 2/3 · NUNCA LLENA" col={MZ} size={34} />
    {[0, 1, 2].map((i) => { const k = ((tt - 2.6) * 0.8 + i / 3) % 1; if (tt < 2.6) return null; return <div key={i} style={{ position: "absolute", left: 1300 - 10, top: 280 - k * 160, width: 20 + k * 40, height: 20 + k * 40, borderRadius: "50%", background: "rgba(255,255,255,.4)", opacity: 1 - k, filter: "blur(6px)" }} />; })}
    <Tag tt={tt} at={4.2} x={700} y={900} txt="40 MIN EN VEZ DE 3 HORAS" col={TX} size={34} />
  </>;
}}</Stage>;

// 15 · OLLA QUEMADA: corte de la olla con la capa negra abajo; el cucharón saca sólo de arriba a la olla limpia
const HQuemada: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const scoop = (tt - 1.4) * 0.6, k = scoop % 1, n = Math.floor(Math.max(0, scoop));
  const lv1 = lerp(0.62, 0.3, eio(tt, 1.4, 5)), lv2 = lerp(0.05, 0.42, eio(tt, 1.4, 5));
  const cx = lerp(620, 1300, Math.sin(k * Math.PI / 2)), cy = 420 - Math.sin(k * Math.PI) * 180;
  return <>
    <Head tt={tt} kick="TRUCO 15" title="SE QUEMARON: CAMBIE DE OLLA, SIN RASPAR" />
    <Olla x={620} y={720} w={520} lvl={lv1} liq="#5a2e1c" cut tt={tt} />
    <div style={{ position: "absolute", left: 420, top: 900, width: 400, height: 46, borderRadius: "0 0 200px 200px", background: "#0d0907", boxShadow: "0 -6px 20px rgba(0,0,0,.6)" }} />
    <Olla x={1300} y={720} w={520} lvl={lv2} liq="#5a2e1c" cut tt={tt} />
    {tt > 1.4 && n < 5 && <div style={{ position: "absolute", left: cx - 60, top: cy - 40, width: 120, height: 70, borderRadius: "0 0 60px 60px", background: "linear-gradient(180deg,#bdbdbd,#777)", boxShadow: "0 16px 30px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 56, top: -220, width: 10, height: 230, background: "#888", borderRadius: 5 }} /></div>}
    <Tag tt={tt} at={1.0} x={620} y={1000} txt="LO DE ABAJO NO SE TOCA" col={RED} size={32} />
    <Tag tt={tt} at={2.6} x={1300} y={1000} txt="SIN SABOR A QUEMADO" col={MZ} size={32} />
  </>;
}}</Stage>;

// 16 · CAPAS DEL SARTÉN: corte transversal; primero la manteca que humea, luego la cebolla, luego el frijol
const HCapas: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = [["MANTECA BIEN CALIENTE", "#f1e3b8", 0.6], ["CEBOLLITA", "#e7d3a0", 1.8], ["FRIJOL CON SU CALDO", "#6b3420", 3.0]] as const;
  return <>
    <Head tt={tt} kick="TRUCO 16" title="PRIMERO LA MANTECA, BIEN CALIENTE" />
    <div style={{ position: "absolute", left: 960, top: 640, transform: "translate(-50%,-50%) perspective(1500px) rotateX(18deg)", width: 1100, height: 260 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, borderRadius: "0 0 40px 40px", background: "linear-gradient(180deg,#2a2a2a,#0e0e0e)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" }} />
      <div style={{ position: "absolute", right: -380, bottom: 18, width: 420, height: 34, borderRadius: 17, background: "#1a1a1a" }} />
      {L.map(([n, c, d], i) => { const s = phys(tt, d, 6, 0.45); return <div key={i} style={{ position: "absolute", left: 40, right: 40, bottom: 60 + i * 52, height: 52, borderRadius: 10, background: c, transform: `translateY(${(1 - cl(s)) * -500}px)`, opacity: cl(s * 2), boxShadow: "inset 0 -6px 10px rgba(0,0,0,.25)" }}>
        <div style={{ position: "absolute", left: 1060, top: 6, whiteSpace: "nowrap", fontWeight: 900, fontSize: 30, color: i === 2 ? MZ : TX }}>{i + 1} · {n}</div></div>; })}
      {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.6 + i / 8) % 1); return <div key={i} style={{ position: "absolute", left: 100 + i * 120, bottom: 120 + k * 260, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.35)", filter: "blur(10px)", opacity: (1 - k) * cl(tt - 0.8) }} />; })}
    </div>
    <Tag tt={tt} at={4.0} x={960} y={930} txt="QUE CHILLE AL ENTRAR" col={MZ} size={36} />
  </>;
}}</Stage>;

// 17 · MACHACADOR: baja con peso tres veces; cada golpe aplasta los frijoles y salpica un chorrito de caldo
const HMachaca: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const cyc = (tt - 0.8) / 1.2, ph = cyc - Math.floor(cyc), down = tt > 0.8 ? (ph < 0.35 ? eio(ph, 0, 0.35) : 1 - eio(ph, 0.5, 1)) : 0, hits = Math.max(0, Math.floor(cyc + 0.65));
  return <>
    <Head tt={tt} kick="TRUCO 17" title="MACHACADOS CON SU CALDO, POCO A POCO" />
    <div style={{ position: "absolute", left: 960, top: 300 + down * 330, transform: "translateX(-50%)" }}>
      <div style={{ width: 40, height: 340, margin: "0 auto", borderRadius: 20, background: "linear-gradient(90deg,#6b4426,#a5764a,#6b4426)" }} />
      <div style={{ width: 260, height: 60, borderRadius: 18, background: "linear-gradient(180deg,#a5764a,#5a3a22)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 820, transform: "translate(-50%,-50%)", width: 900, height: 170, borderRadius: "50%", background: "radial-gradient(ellipse, #2a2a2a 55%, #0e0e0e 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 20 }, (_, i) => { const flat = cl(hits / 3) * (Math.abs((i % 10) - 4.5) < 3 ? 1 : 0.4); return <div key={i} style={{ position: "absolute", left: 640 + (i % 10) * 66, top: 790 + Math.floor(i / 10) * 40, width: 52 + 30 * flat, height: 34 - 18 * flat, borderRadius: "50%", background: "radial-gradient(ellipse at 35% 30%, #b5654a, #5a2a18)" }} />; })}
    {Array.from({ length: 4 }, (_, i) => { const k = cl((ph - 0.33) * 5); if (down < 0.95 || tt < 0.8) return null; return <div key={i} style={{ position: "absolute", left: 960 + (i - 1.5) * 90 * k, top: 760 - 90 * Math.sin(k * Math.PI), width: 16, height: 16, borderRadius: "50%", background: "#6b3420", opacity: 1 - k }} />; })}
    <div style={{ position: "absolute", left: 1460, top: 520, fontFamily: HAND, fontWeight: 700, fontSize: 120, color: MZ, transform: `scale(${phys(tt, 0.8 + hits * 1.2 - 0.8, 9, 0.4)})` }}>{Math.min(3, hits) || ""}</div>
    <Tag tt={tt} at={3.8} x={960} y={1000} txt="UN CUCHARÓN DE CALDO CADA VEZ" col={MZ} size={32} />
  </>;
}}</Stage>;

// 18 · EL SARTÉN SE INCLINA: el refrito resbala en una sola pieza; el fondo queda limpio y brilla
const HInclina: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tilt = eio(tt, 1.2, 2.4) * 28, slide = eio(tt, 2.2, 3.6);
  return <>
    <Head tt={tt} kick="TRUCO 18" title="HASTA QUE SE DESPEGAN SOLOS" />
    <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) rotate(${-tilt}deg)` }}>
      <div style={{ width: 820, height: 240, borderRadius: "50%", background: "radial-gradient(ellipse, #343434 50%, #0e0e0e 72%)", boxShadow: "0 50px 80px rgba(0,0,0,.7)", position: "relative" }}>
        <div style={{ position: "absolute", left: 140 + slide * 300, top: 50, width: 480, height: 130, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #8a4a2c, #4a2010 80%)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 160, top: 70, width: 220, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.35), transparent 70%)", opacity: slide }} />
      </div>
      <div style={{ position: "absolute", left: -380, top: 100, width: 420, height: 40, borderRadius: 20, background: "#1a1a1a" }} />
    </div>
    <Tag tt={tt} at={3.4} x={960} y={900} txt="SE MUEVEN DE UNA PIEZA = LISTOS" col={MZ} size={36} />
  </>;
}}</Stage>;

// 19 · EL FRASCO: el caldo baja por el embudo y llena el frasco; la etiqueta escrita a mano se pega
const HFrasco: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const f = eio(tt, 0.9, 3.4), lab = phys(tt, 3.6, 6, 0.45);
  return <>
    <Head tt={tt} kick="TRUCO 19" title="EL CALDO, EN FRASCO APARTE" />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M 860 260 L 1060 260 L 990 400 L 990 460 L 930 460 L 930 400 Z" fill="rgba(200,200,200,.5)" stroke="#ddd" strokeWidth={4} />
      <rect x={950} y={260} width={20} height={200 * cl(tt - 0.8) * (1 - cl(tt - 3.6))} fill="#7a3e1e" />
    </svg>
    <div style={{ position: "absolute", left: 960, top: 750, transform: "translate(-50%,-50%)", width: 340, height: 440, borderRadius: "40px 40px 50px 50px", border: "6px solid rgba(255,255,255,.55)", background: "rgba(220,235,240,.12)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${f * 88}%`, background: "linear-gradient(180deg,#8a4a24,#4a2010)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: `${f * 88}%`, height: 10, background: "rgba(255,220,180,.3)" }} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 780, transform: `translate(-50%,-50%) rotate(${-4 + (1 - lab) * 20}deg) scale(${lab})`, padding: "10px 30px", borderRadius: 8, background: "#f3ead6", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: TIN, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}>caldito · martes</div>
    <Tag tt={tt} at={2.4} x={1460} y={500} txt="PARA SOPA, ARROZ, ENFRIJOLADAS" col={MZ} size={30} />
  </>;
}}</Stage>;

// 20 · LICUADORA EN CORTE: el remolino gira y los frijoles se vuelven crema; sale por la coladera sin cáscaras
const HLicuadora: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const sp = cl((tt - 0.8) * 0.6), cream = eio(tt, 1.2, 3.4);
  return <>
    <Head tt={tt} kick="TRUCO 20" title="COLADOS, PARA ENFRIJOLADAS" />
    <div style={{ position: "absolute", left: 760, top: 560, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 340, height: 460, clipPath: "polygon(0 0,100% 0,85% 100%,15% 100%)", background: "rgba(220,235,240,.15)", border: "6px solid rgba(255,255,255,.4)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "70%", background: `rgb(${lerp(110, 90, cream)},${lerp(50, 48, cream)},${lerp(30, 34, cream)})` }} />
        {Array.from({ length: 18 }, (_, i) => { const a = tt * 9 * sp + i, rr = 40 + (i % 5) * 26; return <Bean key={i} x={170 + rr * Math.cos(a)} y={300 + rr * Math.sin(a) * 0.4 - (i % 3) * 30} s={0.8 * (1 - cream)} r={a * 57} />; })}
        <svg width={340} height={460} style={{ position: "absolute", left: 0, top: 0 }}>{[0, 1, 2].map((i) => <ellipse key={i} cx={170} cy={300 - i * 40} rx={120 - i * 20} ry={18} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth={3} strokeDasharray="30 20" strokeDashoffset={-tt * 200 * sp} />)}</svg>
      </div>
      <div style={{ width: 380, height: 160, marginLeft: -20, borderRadius: 20, background: "linear-gradient(180deg,#d8d4cc,#8a857c)" }} />
    </div>
    <div style={{ position: "absolute", left: 1320, top: 520, width: 300, height: 130, borderRadius: "0 0 150px 150px", background: "repeating-linear-gradient(90deg,#aaa 0 3px,#666 3px 7px)", opacity: cl(tt - 3), boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    {tt > 3.2 && Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.9 + i / 10) % 1); return <div key={i} style={{ position: "absolute", left: 1440 + (i % 3) * 20, top: 650 + k * 260, width: 18, height: 30, borderRadius: 9, background: "#5a2a18", opacity: 1 - k }} />; })}
    <Tag tt={tt} at={3.6} x={1470} y={960} txt="LISITOS COMO CREMA" col={MZ} size={34} />
  </>;
}}</Stage>;

// 21 · CALENDARIO: las hojas se arrancan 1-2-3-4; cada día la olla vuelve a hervir (llamita) y al quinto, una cruz
const HCalendario: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const day = Math.min(4, Math.floor(Math.max(0, tt - 0.8) / 0.9) + 1), fl = cl(((tt - 0.8) % 0.9) / 0.5);
  return <>
    <Head tt={tt} kick="TRUCO 21" title="REFRI 3 O 4 DÍAS, Y HERVIDOS CADA VEZ" />
    <div style={{ position: "absolute", left: 720, top: 560, transform: "translate(-50%,-50%)", width: 420, height: 480 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#f7f0e0", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, borderRadius: "18px 18px 0 0", background: RED }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontWeight: 900, fontSize: 260, color: TIN }}>{tt > 4.6 ? 5 : day}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontWeight: 900, fontSize: 40, color: BR }}>DÍA</div>
      {tt > 0.8 && tt < 4.6 && <div style={{ position: "absolute", left: 0, top: 90, width: 420, height: 390, background: "#f7f0e0", transformOrigin: "50% 0", transform: `rotateX(${fl * 100}deg) translateY(${fl * 120}px) rotate(${fl * 18}deg)`, opacity: 1 - fl, boxShadow: "0 20px 30px rgba(0,0,0,.3)" }} />}
      {tt > 4.6 && <svg width={420} height={480} style={{ position: "absolute" }}><path d="M 60 140 L 360 440 M 360 140 L 60 440" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl((tt - 4.6) * 2)} 1`} /></svg>}
    </div>
    <Olla x={1320} y={600} w={420} steam={1} tt={tt} />
    <Flame x={1320} y={940} k={0.6 * fl} tt={tt} />
    <Tag tt={tt} at={1.6} x={1320} y={1010} txt="UN HERVOR CADA VEZ QUE LOS SACA" col={MZ} size={30} />
  </>;
}}</Stage>;

// 22 · CONGELADOR: la puerta se abre con su vaho y las bolsitas planas se acomodan de canto como libros
const HCongelador: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#13202a">{(tt) => {
  const op = eio(tt, 0.5, 1.6);
  return <>
    <Head tt={tt} kick="TRUCO 22" title="CONGELADOS, CON SU CALDO" col="#9fd0ff" />
    <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%)", width: 760, height: 520, borderRadius: 20, background: "linear-gradient(180deg,#dfe9ee,#a9b9c2)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 0 60px rgba(120,170,200,.5)" }}>
      {Array.from({ length: 7 }, (_, i) => { const s = phys(tt, 1.6 + i * 0.3, 7, 0.45); return <div key={i} style={{ position: "absolute", left: 60 + i * 92, bottom: 40, width: 74, height: 300, borderRadius: 10, background: "linear-gradient(90deg,rgba(255,255,255,.5),rgba(255,255,255,.2))", border: "3px solid rgba(255,255,255,.7)", transform: `translateY(${(1 - cl(s)) * -500}px)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, top: 60, borderRadius: 6, background: "linear-gradient(180deg,#7a3e1e,#4a2010)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 26, color: TIN }}>{["lun", "mar", "mié", "jue", "vie", "sáb", "dom"][i]}</div></div>; })}
      <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 520, borderRadius: 20, background: "linear-gradient(90deg,#f2f6f8,#c7d3d9)", transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-100 * op}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.4)" }} />
    </div>
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.4 + i / 10) % 1); return <div key={i} style={{ position: "absolute", left: 640 + i * 70, top: 560 + k * 300, width: 120, height: 120, borderRadius: "50%", background: "rgba(220,240,255,.25)", filter: "blur(20px)", opacity: op * (1 - k) }} />; })}
    <Tag tt={tt} at={3.8} x={960} y={950} txt="HASTA 3 MESES · PLANITAS" col="#9fd0ff" size={36} />
  </>;
}}</Stage>;

// 23 · RULETA DE LA SEMANA: una olla al centro y siete platos que giran alrededor; cada uno se enciende con su comida
const HRuleta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const D = ["DE OLLA", "REFRITOS", "ENFRIJOLADAS", "SOPA", "MOLLETES", "TACOS", "TOSTADAS"], rot = eio(tt, 0.4, 4.6) * 360 * 1.5;
  const lit = Math.min(7, Math.floor(Math.max(0, tt - 0.8) / 0.55));
  return <>
    <Head tt={tt} kick="TRUCO 23" title="UNA OLLA, SIETE COMIDAS" />
    <Olla x={960} y={600} w={300} steam={1} tt={tt} />
    {D.map((d, i) => { const a = (i / 7) * Math.PI * 2 + rot * Math.PI / 180, x = 960 + 400 * Math.cos(a), y = 560 + 300 * Math.sin(a), on = i < lit;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${on ? 1.05 : 0.9})` }}>
        <div style={{ width: 170, height: 170, borderRadius: "50%", background: on ? "radial-gradient(circle, #7a3e1e 40%, #f3ead6 42%, #d9cdb4 70%)" : "radial-gradient(circle, #f3ead6 40%, #b9ad94 70%)", boxShadow: on ? `0 0 40px rgba(255,201,74,.5), 0 20px 40px rgba(0,0,0,.5)` : "0 20px 40px rgba(0,0,0,.5)" }} />
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 24, marginTop: 6, color: on ? MZ : DIM, whiteSpace: "nowrap" }}>{d}</div>
      </div>; })}
  </>;
}}</Stage>;

// 24 · ODÓMETRO: un kilo de frijol en la balanza y el contador de platos rueda hasta clavar 14
const HOdometro: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const v = eio(tt, 1.0, 3.8) * 14, d1 = v % 10;
  const wheel = (val: number, x: number) => <div style={{ position: "absolute", left: x, top: 380, width: 200, height: 280, overflow: "hidden", borderRadius: 16, background: "#141010", boxShadow: "inset 0 20px 30px rgba(0,0,0,.8), inset 0 -20px 30px rgba(0,0,0,.8), 0 30px 60px rgba(0,0,0,.6)" }}>
    <div style={{ transform: `translateY(${-val * 280 + 0}px)` }}>{Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: 280, lineHeight: "280px", textAlign: "center", fontWeight: 900, fontSize: 220, color: TX }}>{i % 10}</div>)}</div>
  </div>;
  const k = cl(phys(tt, 3.9, 8, 0.4));
  return <>
    <Head tt={tt} kick="TRUCO 24" title="LA CUENTA: UN KILO RINDE…" />
    {wheel(cl(v - 9), 760)}{wheel(d1, 980)}
    <div style={{ position: "absolute", left: 1220, top: 560, fontWeight: 900, fontSize: 80, color: MZ, opacity: k, transform: `scale(${0.6 + 0.4 * k})` }}>PLATOS</div>
    <div style={{ position: "absolute", left: 360, top: 420, width: 280, height: 200, borderRadius: "20px 20px 6px 6px", background: "repeating-linear-gradient(45deg,#b79a6a 0 6px,#a88a5a 6px 12px)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 60, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: TIN, background: "#f3ead6", borderRadius: 8 }}>1 kg</div>
    </div>
    <Tag tt={tt} at={4.4} x={960} y={820} txt="UN KILO = CATORCE PLATOS" col={MZ} size={44} />
    <Tag tt={tt} at={5.0} x={960} y={890} txt="MENOS DE $3 EL PLATO" col={TX} size={32} />
  </>;
}}</Stage>;

// 25 · EL CAJÓN: se abre el cajón de la cocina y adentro está la libreta de la abuela; se abre y aparece «UN DÍA ANTES»
const HCajon: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const op = eio(tt, 0.6, 1.8), up = phys(tt, 2.0, 4.5, 0.5), pg = eio(tt, 3.2, 4.2);
  return <>
    <Head tt={tt} kick="TRUCO 25 · EL DE MI ABUELA" title="LOS FRIJOLES SE HACEN UN DÍA ANTES" />
    <div style={{ position: "absolute", left: 960, top: 820, transform: "translate(-50%,-50%)", width: 1000, height: 260, background: "linear-gradient(180deg,#5a3a22,#2e1d10)", borderRadius: 10, boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: -40 + op * -120, height: 200, background: "linear-gradient(180deg,#7a5232,#4a2f1a)", borderRadius: 8, transform: `perspective(1200px) rotateX(${op * 30}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: "50%", top: 80, width: 120, height: 24, marginLeft: -60, borderRadius: 12, background: "#c9a26a" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 960, top: lerp(800, 470, cl(up)), transform: `translate(-50%,-50%) rotate(${-4 + 4 * cl(up)}deg)`, display: "flex", opacity: cl(up * 2) }}>
      <div style={{ width: 360, height: 460, background: "#e9dcbc", borderRadius: "12px 0 0 12px", boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: 40, fontFamily: HAND, fontSize: 40, color: "#5a4030" }}>Frijoles de olla<br />de mi mamá</div>
      <div style={{ width: 360, height: 460, background: "#f2e8cf", borderRadius: "0 12px 12px 0", boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: 40, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: TIN, clipPath: `inset(0 ${100 - pg * 100}% 0 0)` }}>un día antes,<br />y se dejan<br />reposar…</div>
    </div>
    <Tag tt={tt} at={4.6} x={960} y={990} txt="SABEN A DOMINGO AUNQUE SEA MARTES" col={MZ} size={34} />
  </>;
}}</Stage>;

// A · ERRORES: cinco tarjetas verticales con su foto en carrusel 3D (coverflow); cada una se voltea al nombrarse
const HErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#2a0f0a">{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[], cur = E.reduce((c, e, i) => (t >= e.a ? i : c), 0);
  const sel = lerp(cur - 1, cur, cl(phys(t, E[cur]?.a ?? 0, 6, 0.6)));
  return <>
    <Head tt={tt} kick="LOS 5 ERRORES" title="LO QUE DEJA EL FRIJOL DURO" col={RED} />
    {E.map((e, i) => { const d = i - sel, on = t >= e.a; return <div key={i} style={{ position: "absolute", left: 960 + d * 330, top: 590, transform: `translate(-50%,-50%) perspective(1600px) rotateY(${-d * 38}deg) translateZ(${-Math.abs(d) * 220}px)`, zIndex: 10 - Math.round(Math.abs(d)), opacity: on ? 1 : 0.35 }}>
      <Photo id={im(h, i)} w={320} h={520} r={22} dim={on ? 0.15 : 0.6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: -64, textAlign: "center", fontWeight: 900, fontSize: 60, color: RED, textShadow: "0 6px 20px #000" }}>{i + 1}</div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 16, padding: "12px 10px", borderRadius: 12, background: "rgba(20,8,6,.85)", textAlign: "center", fontWeight: 900, fontSize: 28, color: TX }}>{e.tx}</div>
    </div>; })}
  </>;
}}</Stage>;

// B · RUTINA: mesa vista desde arriba; cada paso deja su objeto en la mesa en el lugar que le toca (mise en place)
const HRutina: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="LA RUTINA COMPLETA" title="DE LA CHAROLA AL PLATO" />
    <div style={{ position: "absolute", left: 160, right: 160, top: 220, bottom: 80, borderRadius: 30, background: "repeating-linear-gradient(90deg,#6b4628 0 120px,#5f3e23 120px 124px)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", transform: "perspective(1800px) rotateX(18deg)" }}>
      {S.map((s, i) => { const k = phys(t, s.a, 6, 0.5), x = 80 + (i % 4) * 400, y = 50 + Math.floor(i / 4) * 330;
        return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - cl(k)) * -400}px) rotate(${(rnd(i) - 0.5) * 8}deg)`, opacity: cl(k * 2) }}>
          <Photo id={im(h, i)} w={340} h={210} r={16} />
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 48, height: 48, borderRadius: "50%", background: MZ, color: TIN, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontWeight: 900, fontSize: 28, color: TX, whiteSpace: "nowrap" }}>{s.tx}</div></div>
        </div>; })}
    </div>
  </>;
}}</Stage>;

// D · REPASO: un mazo de 24 cartitas se reparte en abanico, una por truco, al ritmo de la voz
const HRepaso: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="REPASO RÁPIDO" title="LOS 24, EN UN ABANICO" />
    {S.map((s, i) => { const k = cl(phys(t, s.a, 7, 0.55)), ang = lerp(-70, 70, i / Math.max(1, S.length - 1)) * k, last = S.findIndex((x) => x.a > t) - 1 === i || (i === S.length - 1 && t > s.a);
      return <div key={i} style={{ position: "absolute", left: 960, top: 980, width: 150, height: 230, marginLeft: -75, marginTop: -560, transformOrigin: "50% 560px", transform: `rotate(${ang}deg) translateY(${last ? -30 : 0}px)`, opacity: cl(k * 3), borderRadius: 14, background: last ? "#fff4d6" : "#efe2c4", border: `4px solid ${last ? MZ : "#b89a6a"}`, boxShadow: "0 14px 30px rgba(0,0,0,.5)", padding: 10, zIndex: i }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: BR, textAlign: "center" }}>{i + 1}</div>
        <div style={{ fontWeight: 800, fontSize: 19, color: TIN, textAlign: "center", lineHeight: 1.15 }}>{s.tx}</div>
      </div>; })}
  </>;
}}</Stage>;

// C · LO QUE NUNCA HACÍA: tres fotos se cuelgan de un cordel con pinzas y cada una recibe una cinta roja de NUNCA
const HNunca: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#24140c">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="LO QUE MI ABUELA" title="NUNCA HACÍA" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M -200 300 Q 960 ${380 + 10 * Math.sin(tt * 0.6)} 2120 300`} fill="none" stroke="#c9b48a" strokeWidth={5} /></svg>
    {S.map((s, i) => { const cur = S.reduce((c, e, j) => (t >= e.a ? j : c), 0), sh = lerp(Math.max(0, cur - 2) * 540, Math.max(0, cur - 1) * 540, cl(phys(t, S[cur].a, 5, 0.6)));
      const k = phys(t, s.a, 5, 0.35), x = 420 + i * 540 - sh, sw = 6 * Math.exp(-(t - s.a) * 1.2) * Math.sin((t - s.a) * 6);
      const st = cl(phys(t, s.a + 0.8, 8, 0.45));
      return <div key={i} style={{ position: "absolute", left: x, top: 330, transformOrigin: "50% 0", transform: `translateX(-50%) rotate(${sw}deg) translateY(${(1 - cl(k)) * -500}px)`, opacity: cl(k * 2) }}>
        <div style={{ width: 30, height: 60, margin: "0 auto -20px", background: "#b38a52", borderRadius: 6 }} />
        <div style={{ background: "#f7f0e0", padding: "16px 16px 60px", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}><Photo id={im(h, i)} w={420} h={300} r={4} /></div>
        <div style={{ position: "absolute", left: -20, right: -20, top: 190, padding: "8px 0", background: RED, transform: `rotate(-8deg) scaleX(${st})`, textAlign: "center", fontWeight: 900, fontSize: 40, color: TX, letterSpacing: 6 }}>NUNCA</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: TIN }}>{s.tx}</div>
      </div>; })}
  </>;
}}</Stage>;

export const MAP: Record<string, C> = { lupa: HLupa, charola: HCharola, tresdedos: HTresDedos, chorro: HChorro, perilla: HPerilla, duelo: HDuelo, cuchara: HCuchara, soplido: HSoplido,
  estante: HEstante, salero: HSalero, hojas: HHojas, idavuelta: HIdaVuelta, costales: HCostales, manometro: HManometro, quemada: HQuemada, capas: HCapas, machaca: HMachaca,
  inclina: HInclina, frasco: HFrasco, licuadora: HLicuadora, calendario: HCalendario, congelador: HCongelador, ruleta: HRuleta, odometro: HOdometro, cajon: HCajon,
  errores: HErrores, rutina: HRutina, repaso: HRepaso, nunca: HNunca };

import { MAP3 } from "./heroes3d";
Object.assign(MAP, MAP3);
import { MAP3B } from "./heroes3d2";
Object.assign(MAP, MAP3B);
import { MAP3C } from "./heroes3d3";
Object.assign(MAP, MAP3C);
