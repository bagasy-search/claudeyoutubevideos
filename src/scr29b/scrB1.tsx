// scr29b · componentes únicos (uno por minuto, ninguno repetido con scr29a). Mismo escenario hkit: entrada con máscara, cámara curva, salida fundida.
import React from "react";
import { AMB, DIM, H, ICE, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
const GRN = "#6fe39a", BLU = "#5aa8ff";
const iron = "linear-gradient(160deg,#5b5652 0%,#35312e 45%,#1f1c1a 100%)";
const steel = "linear-gradient(90deg,#3a3d42 0%,#8a9098 22%,#c9ced4 34%,#6b7077 55%,#2e3135 100%)";
// llama dibujada: color de naranja (0) a azul (1), parpadeo lento ≤2 Hz
const Flame: React.FC<{ x: number; y: number; w: number; hgt: number; blue: number; tt: number; on?: number }> = ({ x, y, w, hgt, blue, tt, on = 1 }) => {
  const c1 = blue > 0.5 ? "#dff0ff" : "#fff2c0", c2 = `rgb(${255 - 190 * blue},${140 + 30 * blue},${40 + 215 * blue})`;
  return <div style={{ position: "absolute", left: x - w / 2, top: y - hgt, width: w, height: hgt * on, marginTop: hgt * (1 - on), borderRadius: "50% 50% 42% 42%", background: `radial-gradient(ellipse at 50% 88%, ${c1}, ${c2} 45%, rgba(0,0,0,0) 74%)`, transform: `scaleY(${0.94 + 0.06 * Math.sin(tt * 2 * Math.PI * (1.2 + blue * 0.6))})`, transformOrigin: "50% 100%", filter: `blur(${2 + 4 * (1 - blue)}px)` }} />;
};

// ---- 1:11 · LA PILA DE LEÑA: cinco troncos caen de a uno con peso y cada uno trae su tarea (cortar, partir, apilar, cargar, alimentar) ----
export const HLogstack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const jobs = ["CUT", "SPLIT", "STACK", "CARRY", "FEED"], ats = [0.6, it(h, 0), it(h, 1), it(h, 2), it(h, 3)];
  return <>
    <div style={{ position: "absolute", left: 1350, top: 520, transform: "translate(-50%,-50%) rotate(2deg)" }}><Photo id={h.img} w={640} h={460} /></div>
    {jobs.map((j, i) => { const s = phys(tt, ats[i], 6.5, 0.38), y = 860 - i * 112;
      return <div key={j} style={{ position: "absolute", left: 300 + (i % 2) * 26, top: y - (1 - s) * 700, opacity: cl(s * 3), transform: `rotate(${(i % 2 ? -2 : 2) * (1 - s * 0.6)}deg)` }}>
        <div style={{ width: 560, height: 100, borderRadius: 50, background: "linear-gradient(180deg,#9a6a3e,#6b4526 60%,#4a2f1a)", boxShadow: "0 18px 30px rgba(0,0,0,.55), inset 0 6px 0 rgba(255,220,170,.18)", position: "relative" }}>
          <div style={{ position: "absolute", right: -4, top: 0, width: 100, height: 100, borderRadius: "50%", background: "repeating-radial-gradient(circle, #d8a86c 0 6px, #b98450 6px 11px)", boxShadow: "inset 0 0 0 6px #5a3a1f" }} />
          <div style={{ position: "absolute", left: 40, top: 8, fontWeight: 900, fontSize: 70, letterSpacing: 6, color: i === 4 ? "#ffcf8a" : "#f3e2c8", textShadow: "0 3px 0 rgba(0,0,0,.5)", opacity: cl((tt - ats[i]) * 3) * (1 - eio(tt, (ats[i + 1] ?? 1e9) - 0.3, ats[i + 1] ?? 1e9)) }}>{j}</div>
        </div></div>; })}
  </>;
}}</Stage>;

// ---- 2:18 · EL CALIBRE: un calibre de taller se cierra sobre el borde de un tambor de freno y marca media pulgada; después el hierro brilla y se queda caliente ----
export const HCaliper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const close = eio(tt, 0.8, it(h, 0) + 0.2), glow = eio(tt, it(h, 1), it(h, 1) + 2.5), jaw = 420 - 300 * close;
  return <>
    <div style={{ position: "absolute", left: 960, top: 700, transform: "translate(-50%,-50%)", width: 1100, height: 260, borderRadius: "30px 30px 0 0", background: iron, boxShadow: `0 50px 90px rgba(0,0,0,.7), 0 0 ${120 * glow}px rgba(255,90,30,${0.5 * glow})` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, borderRadius: "30px 30px 0 0", background: `linear-gradient(180deg, rgba(255,${120 - 40 * glow},40,${0.75 * glow}), transparent)` }} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 330, transform: "translate(-50%,0)", width: 900, height: 70, borderRadius: 10, background: steel, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: 20 + k * 29, top: 0, width: 2, height: k % 5 ? 18 : 32, background: "#1c1c1c" }} />)}
    </div>
    <div style={{ position: "absolute", left: 960 - jaw / 2 - 40, top: 330, width: 40, height: 330, background: steel, borderRadius: "0 0 8px 8px" }} />
    <div style={{ position: "absolute", left: 960 + jaw / 2, top: 330, width: 40, height: 330, background: steel, borderRadius: "0 0 8px 8px" }} />
    <Tag tt={tt} at={it(h, 0)} x={960} y={240} txt={`${(0.5 + (1 - close) * 1.2).toFixed(2)}"`} col={AMB} size={96} />
    <Tag tt={tt} at={it(h, 1)} x={960} y={930} txt="HOLDS THE HEAT" col={RED} size={50} />
  </>;
}}</Stage>;

// ---- 3:05 · EL NIVEL DE BURBUJA: un nivel gigante sobre la boca del tambor; los ladrillos de abajo se calzan y la burbuja viaja al centro ----
export const HBubble: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fix = phys(tt, it(h, 0), 4, 0.5), tilt = -4 * (1 - cl(fix)), bub = 330 * (1 - cl(fix)) + 18 * Math.sin(tt * 1.6) * (1 - cl(fix));
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotate(${tilt}deg)` }}>
      <div style={{ width: 1200, height: 150, borderRadius: 18, background: "linear-gradient(180deg,#f2c94c,#d4a12a)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.4)", position: "relative" }}>
        <div style={{ position: "absolute", left: 360, top: 34, width: 480, height: 82, borderRadius: 41, background: "linear-gradient(180deg,rgba(200,255,140,.85),rgba(120,200,60,.85))", boxShadow: "inset 0 0 0 5px rgba(0,0,0,.35)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 210, top: 0, width: 4, height: 82, background: "#1c1c1c" }} /><div style={{ position: "absolute", left: 266, top: 0, width: 4, height: 82, background: "#1c1c1c" }} />
          <div style={{ position: "absolute", left: 200 + bub, top: 16, width: 70, height: 50, borderRadius: 25, background: "radial-gradient(circle at 35% 35%, #fff, rgba(255,255,255,.4))" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: 1000, margin: "60px auto 0" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 220, height: 100 + (i === 2 ? 40 * cl(fix) : 0), background: "linear-gradient(180deg,#b5523a,#7a3424)", borderRadius: 6, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />)}
      </div>
    </div>
    <Tag tt={tt} at={it(h, 0)} x={1350} y={850} txt="SHIM" col={AMB} size={60} />
    <Tag tt={tt} at={it(h, 1)} x={960} y={300} txt="LEVEL" col={GRN} size={90} />
  </>;
}}</Stage>;

// ---- 3:57 · LA ESPIRAL: un caño gira y una broca deja agujeros que suben en espiral (no en fila) ----
export const HHelix: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const rot = tt * 40, n = Math.floor(cl((tt - it(h, 1) + 0.3) / 1.3) * 22), rows = cl((tt - 0.4) / 0.8);
  return <>
    <div style={{ position: "absolute", left: 760, top: 560, transform: "translate(-50%,-50%)", width: 260, height: 820, borderRadius: 30, background: steel, boxShadow: "0 50px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {Array.from({ length: n }, (_, k) => { const a = ((k * 50 + rot) % 360) * Math.PI / 180, x = 130 + 110 * Math.sin(a), vis = Math.cos(a);
        return vis > -0.1 ? <div key={k} style={{ position: "absolute", left: x - 11, top: 760 - k * 32, width: 22 * Math.max(0.3, vis), height: 22, borderRadius: "50%", background: "#0b0b0c", boxShadow: `0 0 14px rgba(90,168,255,${0.6 * vis})` }} /> : null; })}
    </div>
    {/* la broca que va perforando: entra de la derecha y sigue el último agujero */}
    {(() => { const k = Math.max(0, n - 1), a = ((k * 50 + rot) % 360) * Math.PI / 180, hx = 630 + 130 + 110 * Math.sin(a), hy = 150 + 760 - k * 32 + 11;
      const on = cl((tt - 0.3) * 2) * (1 - cl((tt - it(h, 1) - 1.3) * 2)), y = n > 0 ? hy : 560;
      return <div style={{ position: "absolute", left: (n > 0 ? hx : 900) + 14, top: y - 9, opacity: on, transform: `translateX(${Math.sin(tt * 40) * 2}px)` }}>
        <div style={{ width: 300, height: 18, borderRadius: "9px 0 0 9px", background: "repeating-linear-gradient(60deg,#d8dde2 0 10px,#7d8389 10px 18px)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
      </div>; })()}
    {/* las filas rectas tachadas, a la derecha */}
    <div style={{ position: "absolute", left: 1320, top: 540, transform: "translate(-50%,-50%)", opacity: rows * (1 - cl((tt - it(h, 1)) / 0.6) * 0.6) }}>
      <div style={{ width: 160, height: 520, borderRadius: 24, background: steel, position: "relative" }}>
        {Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: 69, top: 40 + k * 60, width: 22, height: 22, borderRadius: "50%", background: "#0b0b0c" }} />)}
        <svg width={160} height={520} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M 10 510 L ${10 + 140 * cl((tt - it(h, 0) - 0.6) / 0.5)} ${510 - 500 * cl((tt - it(h, 0) - 0.6) / 0.5)}`} stroke={RED} strokeWidth={14} strokeLinecap="round" /></svg>
      </div>
    </div>
    <Tag tt={tt} at={it(h, 0) + 0.4} x={1320} y={880} txt="NOT ROWS" col={RED} size={60} />
    <Tag tt={tt} at={it(h, 1)} x={760} y={90} txt="A SPIRAL" col={BLU} size={80} />
  </>;
}}</Stage>;

// ---- 5:15 · EL TERMÓMETRO DEL CAÑO: del tambor al ventilador, un pie de caño baja el color de rojo a frío; el ventilador gira tranquilo ----
export const HGradient: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const len = eio(tt, it(h, 0) - 0.5, it(h, 0) + 1.2), cool = eio(tt, it(h, 1) - 1, it(h, 1) + 0.4), x0 = 420, x1 = 420 + 960 * len;
  return <>
    <div style={{ position: "absolute", left: 120, top: 360, width: 360, height: 420, borderRadius: 30, background: iron, boxShadow: "0 0 140px rgba(255,90,30,.55)" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(90deg, transparent 40%, rgba(255,90,30,.55))" }} />
    </div>
    <div style={{ position: "absolute", left: x0, top: 520, width: x1 - x0, height: 110, borderRadius: 14, background: `linear-gradient(90deg, #ff5a2a, #c96a3a 25%, #6a6e74 ${55 - 20 * cool}%, #4a6f9a)`, boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 8px 0 rgba(255,255,255,.18)" }} />
    <div style={{ position: "absolute", left: 1380, top: 380, width: 400, height: 380, borderRadius: 24, background: "linear-gradient(160deg,#8d9399,#4b5056)", opacity: cl(len * 2), boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 50, top: 40, width: 300, height: 300, borderRadius: "50%", background: "#151517", transform: `rotate(${tt * 300}deg)` }}>
        {[0, 1, 2, 3, 4, 5, 6].map((k) => <div key={k} style={{ position: "absolute", left: 140, top: 20, width: 24, height: 130, borderRadius: 12, background: "#2c2f33", transformOrigin: "12px 130px", transform: `rotate(${k * 51}deg) skewX(-14deg)` }} />)}
      </div>
    </div>
    <Tag tt={tt} at={it(h, 0)} x={(x0 + 1380) / 2} y={450} txt="1 FOOT" col={AMB} size={70} />
    <Tag tt={tt} at={it(h, 1)} x={1580} y={850} txt="FAN STAYS COOL" col={ICE} size={46} />
  </>;
}}</Stage>;

// ---- 6:07 · EL PUNTO DULCE: una perilla grande gira; la llama de al lado pasa por naranja con humo, azul que ruge y soplada que se apaga ----
export const HSweetspot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  // 0 = poco aire, 1 = punto justo, 2 = demasiado
  const v = tt < it(h, 0) + 1.5 ? 0.15 : tt < it(h, 1) ? 0.15 + 0.85 * eio(tt, it(h, 0) + 1.5, it(h, 1) - 0.2) : 1 + eio(tt, it(h, 1), it(h, 1) + 0.8);
  const blue = v < 1 ? cl((v - 0.6) / 0.4) : 1, on = v > 1 ? 1 - cl(v - 1) * 0.85 : 1, smoke = cl(1 - v * 1.6);
  return <>
    <div style={{ position: "absolute", left: 560, top: 560, transform: "translate(-50%,-50%)", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#3a3a3e,#111)", boxShadow: "0 50px 90px rgba(0,0,0,.7), inset 0 0 0 10px #2a2a2c" }}>
      <svg width={440} height={440} style={{ position: "absolute" }}>
        <path d="M 70 330 A 170 170 0 0 1 120 100" stroke="#ff8a2a" strokeWidth={18} fill="none" />
        <path d="M 130 92 A 170 170 0 0 1 310 92" stroke={BLU} strokeWidth={18} fill="none" />
        <path d="M 320 100 A 170 170 0 0 1 370 330" stroke="#888" strokeWidth={18} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 210, top: 70, width: 20, height: 160, borderRadius: 10, background: TX, transformOrigin: "10px 150px", transform: `rotate(${-120 + v * 120}deg)` }} />
    </div>
    <div style={{ position: "absolute", left: 1350, top: 560, transform: "translate(-50%,-50%)", width: 520, height: 600 }}>
      <div style={{ position: "absolute", left: 60, top: 420, width: 400, height: 140, borderRadius: "0 0 60px 60px", background: iron }} />
      <Flame x={260} y={430} w={240} hgt={340} blue={blue} tt={tt} on={on} />
      {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.4 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 180 + Math.sin(ph * 5 + i) * 40, top: 80 - ph * 220, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,20,20,.8), rgba(20,20,20,0) 70%)", opacity: smoke * (1 - ph) }} />; })}
    </div>
    <Tag tt={tt} at={it(h, 0)} x={1350} y={940} txt="BLACK SMOKE" col={RED} size={50} />
    <Tag tt={tt} at={it(h, 0) + 2.2} x={560} y={880} txt="BLUE" col={BLU} size={64} />
    <Tag tt={tt} at={it(h, 1)} x={1350} y={180} txt="TOO MUCH" col={DIM} size={50} />
  </>;
}}</Stage>;

// ---- 6:43 · LA BATERÍA: una batería chica se carga de horas como un vaso; las horas se cuentan solas arriba ----
export const HBattery: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const f = eio(tt, 0.8, 5.5), hrs = Math.round(f * 30);
  return <>
    <div style={{ position: "absolute", left: 700, top: 700, transform: "translate(-50%,-50%)", width: 560, height: 420, borderRadius: 22, background: "linear-gradient(180deg,#2b2d31,#141518)", boxShadow: "0 50px 90px rgba(0,0,0,.7), inset 0 6px 0 rgba(255,255,255,.12)" }}>
      <div style={{ position: "absolute", left: 80, top: -40, width: 80, height: 40, borderRadius: "8px 8px 0 0", background: RED }} />
      <div style={{ position: "absolute", right: 80, top: -40, width: 80, height: 40, borderRadius: "8px 8px 0 0", background: "#222" }} />
      <div style={{ position: "absolute", left: 250, top: 300, width: 60, height: 60, borderRadius: "50%", background: GRN, opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(tt * 2 * Math.PI * 0.8)), boxShadow: `0 0 40px ${GRN}` }} />
      <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ position: "absolute", left: 130, top: -420 }}><rect x={-150} y={-150} width={300} height={300} rx={30} fill="#1c1d20" /><g transform={`rotate(${tt * 300})`}>{[0, 1, 2, 3, 4].map((b) => <path key={b} d="M 0 -18 C 40 -60, 100 -90, 124 -30 C 90 -24, 46 -8, 0 18 Z" fill="#9aa0a6" transform={`rotate(${b * 72})`} />)}</g><circle r={26} fill="#2b2d31" stroke="#9aa0a6" strokeWidth={5} /></svg>
      <svg width={560} height={140} style={{ position: "absolute", left: 0, top: -140 }}><path d="M 120 140 C 120 80, 220 90, 230 20" stroke={RED} strokeWidth={10} fill="none" /><path d="M 440 140 C 440 80, 360 90, 330 20" stroke="#111" strokeWidth={10} fill="none" /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontWeight: 900, fontSize: 64, color: TX }}>7 Ah</div>
    </div>
    <div style={{ position: "absolute", left: 1350, top: 520, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 220, color: TX, lineHeight: 1 }}>{hrs}</div>
      <div style={{ fontWeight: 800, fontSize: 48, letterSpacing: 8, color: DIM }}>HOURS</div>
    </div>
    <Tag tt={tt} at={1.2} x={1350} y={820} txt="2-3 WATTS" col={AMB} size={54} />
  </>;
}}</Stage>;

// ---- 7:00 · EL FUSIBLE: un cable rojo lleva corriente (chispas que viajan); al llegar al fusible el filamento brilla y se corta antes que el cable ----
export const HFuse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ins = phys(tt, it(h, 0) - 0.4, 5, 0.5), blow = tt > it(h, 0) + 0.9, glow = cl((tt - it(h, 0)) / 0.9);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 120 560 C 500 560, 600 420, 820 540" stroke={RED} strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d="M 1100 540 C 1320 660, 1420 560, 1800 560" stroke={RED} strokeWidth={26} fill="none" strokeLinecap="round" opacity={blow ? 0.45 : 1} />
    </svg>
    {!blow && Array.from({ length: 5 }, (_, i) => { const u = (tt * 0.5 + i / 5) % 1; return <div key={i} style={{ position: "absolute", left: 120 + u * 700 - 10, top: 540 - Math.sin(u * Math.PI) * 60, width: 20, height: 20, borderRadius: "50%", background: "#ffe08a", boxShadow: "0 0 20px #ffd060" }} />; })}
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) translateY(${(1 - ins) * -400}px)`, width: 300, height: 120, borderRadius: 60, background: "rgba(220,235,255,.25)", border: "6px solid rgba(220,235,255,.6)", boxShadow: `0 0 ${80 * glow * (blow ? 0 : 1)}px rgba(255,200,80,.9)` }}>
      <div style={{ position: "absolute", left: 30, top: 50, width: blow ? 100 : 240, height: 8, background: blow ? "#333" : `rgb(255,${200 - 100 * glow},${80 - 60 * glow})`, borderRadius: 4 }} />
      {blow && <div style={{ position: "absolute", right: 30, top: 50, width: 100, height: 8, background: "#333", borderRadius: 4 }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: -70, textAlign: "center", fontWeight: 900, fontSize: 44, color: AMB }}>2 AMP</div>
    </div>
    <Tag tt={tt} at={it(h, 0) + 1.2} x={960} y={780} txt="40 CENTS" col={TX} size={80} />
  </>;
}}</Stage>;

// ---- 7:18 · EL BOTÓN DE TALLER: un pulgador industrial rojo cae sobre una chapa, el dedo lo aprieta con peso y se enciende la campana ----
export const HPushbutton: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const drop = phys(tt, 0.3, 6, 0.4), press = eio(tt, 1.8, 2.1) * (1 - eio(tt, 2.4, 2.8)), lit = cl((tt - 2.1) * 3);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560 - (1 - drop) * 600, transform: "translate(-50%,-50%)", width: 640, height: 400, borderRadius: 28, background: "linear-gradient(160deg,#c9a227,#8a6c12)", boxShadow: "0 50px 90px rgba(0,0,0,.7)", opacity: cl(drop * 3) }}>
      {[30, 590].map((x) => [30, 350].map((y) => <div key={x + "-" + y} style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: "50%", background: "#444", boxShadow: "inset 0 2px 0 #888" }} />))}
      <div style={{ position: "absolute", left: 170, top: 60, width: 300, height: 220, borderRadius: "50%", background: "#3a0d0a" }} />
      <div style={{ position: "absolute", left: 170, top: 40 + 40 * press, width: 300, height: 220, borderRadius: "50%", background: `radial-gradient(circle at 40% 30%, #ff7a6a, ${RED} 50%, #9a1e14)`, boxShadow: `0 ${30 - 26 * press}px 0 #7a160e, 0 0 ${90 * lit}px rgba(255,90,74,.8)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontWeight: 900, fontSize: 52, letterSpacing: 6, color: "#1c1608" }}>SUBSCRIBE</div>
    </div>
    {/* pulgar con guante de trabajo que baja y aprieta */}
    <div style={{ position: "absolute", left: 960, top: 300 - 420 * (1 - eio(tt, 1.2, 1.8)) + 40 * press - 360 * eio(tt, 2.9, 3.5), transform: "translate(-50%,-100%) rotate(-8deg)", width: 170, height: 340, borderRadius: "80px 80px 40px 40px", background: "linear-gradient(90deg,#6b4a2a,#a87a48 45%,#5a3c20)", boxShadow: "inset 0 -30px 0 rgba(0,0,0,.25), 0 30px 60px rgba(0,0,0,.5)" }}>
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 20, right: 20, top: 120 + k * 60, height: 6, borderRadius: 3, background: "rgba(0,0,0,.25)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1460, top: 360, fontSize: 130, opacity: lit, transform: `rotate(${18 * Math.sin(tt * 2 * Math.PI * 1.5) * cl(3 - (tt - 2.1))}deg)`, transformOrigin: "50% 10%" }}>
      <svg width={150} height={160} viewBox="0 0 24 26"><path d="M12 2a7 7 0 0 0-7 7v5l-2 4h18l-2-4V9a7 7 0 0 0-7-7zm-3 18a3 3 0 0 0 6 0" fill={AMB} /></svg>
    </div>
  </>;
}}</Stage>;

// ---- 8:37 · EL REMOLINO: vista desde arriba del caño; las llamas salen por la espiral y giran, el color pasa de amarillo a azul ----
export const HVortex: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const blue = eio(tt, it(h, 1) - 0.4, it(h, 1) + 0.6), spin = tt * (40 + 140 * blue);
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", width: 760, height: 760, borderRadius: "50%", background: iron, boxShadow: "0 0 0 24px #2a2725, 0 60px 120px rgba(0,0,0,.8)" }}>
      {Array.from({ length: 18 }, (_, k) => { const a = (k * 20 + spin) * Math.PI / 180, r = 90 + k * 13;
        const c = `rgb(${255 - 180 * blue},${190 - 10 * blue},${60 + 195 * blue})`;
        return <div key={k} style={{ position: "absolute", left: 380 + r * Math.cos(a) - 40, top: 380 + r * Math.sin(a) - 40, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${c}, rgba(0,0,0,0) 70%)`, opacity: 0.85 }} />; })}
      <div style={{ position: "absolute", left: 300, top: 300, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${blue > 0.5 ? "#dff0ff" : "#fff2c0"}, rgba(0,0,0,0) 70%)` }} />
    </div>
    <Tag tt={tt} at={it(h, 0)} x={330} y={780} txt="YELLOW" col="#ffcc55" size={56} />
    <Tag tt={tt} at={it(h, 1)} x={1620} y={780} txt="BLUE" col={BLU} size={90} />
  </>;
}}</Stage>;
