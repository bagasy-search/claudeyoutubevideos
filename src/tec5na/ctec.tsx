// c5a.tsx · componentes ÚNICOS de tec5na (sesE, «limpiar el tambor de la lavadora»). Ninguno repite los de tec29 (foto/lista/versus/numero/alerta).
// Objetos dibujados en código; los 3D son CSS 3D real (preserve-3d: caras, tapas y cortes que giran), sin WebGL (el farm no lo garantiza).
import React from "react";
import { BR, cl, DIM, eio, eIn, H, HAND, lerp, MZ, phys, RED, rnd, Stage, Tag, TIN, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const q = (h: H) => (h.q ?? {}) as Record<string, any>;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const STEEL = "linear-gradient(90deg,#6d747a,#d9dee2 30%,#9aa1a7 55%,#eef1f3 72%,#7c838a)";
const LODO = (k: number) => `rgb(${Math.round(lerp(200, 92, k))},${Math.round(lerp(214, 70, k))},${Math.round(lerp(220, 46, k))})`;

// cilindro CSS 3D: n caras verticales alrededor de un eje Y
const Cyl: React.FC<{ r: number; hgt: number; n?: number; face: (i: number) => React.CSSProperties; open?: number }> = ({ r, hgt, n = 28, face, open = 0 }) => {
  const w = 2 * r * Math.tan(Math.PI / n) + 1.5;
  return <>{Array.from({ length: n }, (_, i) => {
    const ang = (360 / n) * i;
    if (open > 0 && (ang > 360 - open * 180 || ang < open * 10)) return null; // corte: se quita un gajo de caras
    return <div key={i} style={{ position: "absolute", left: -w / 2, top: -hgt / 2, width: w, height: hgt, transform: `rotateY(${ang}deg) translateZ(${r}px)`, backfaceVisibility: "visible", ...face(i) }} />;
  })}</>;
};
const Disc: React.FC<{ r: number; y: number; bg: string; extra?: React.CSSProperties }> = ({ r, y, bg, extra }) => (
  <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: bg, transform: `translateY(${y}px) rotateX(90deg)`, ...extra }} />
);
const Scene: React.FC<{ x?: number; y?: number; rx: number; ry: number; s?: number; children: React.ReactNode }> = ({ x = 960, y = 540, rx, ry, s = 1, children }) => (
  <div style={ab(x, y, { perspective: 1600, perspectiveOrigin: "50% 40%" })}>
    <div style={{ transformStyle: "preserve-3d", transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)` }}>{children}</div>
  </div>
);

// 1 · cubeta 3D: cubeta translúcida que gira apenas; el agua café se aclara arriba y el lodo gris se asienta en el fondo
const Balde3D: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1d2a33">{(tt) => {
  const set = eio(tt, 0.8, 4.4), W = 620, Hh = 640, tilt = 6 * Math.sin(tt * 0.6);
  return <>
    <div style={ab(960, 560, { transform: `translate(-50%,-50%) perspective(1600px) rotateX(10deg) rotateY(${tilt}deg)`, width: W, height: Hh })}>
      <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,rgba(255,255,255,.55),rgba(255,255,255,.25) 40%,rgba(255,255,255,.6))", overflow: "hidden" }}>
        <div style={ab(0, 90, { width: W, height: Hh - 90, background: `linear-gradient(${LODO(0.7 - 0.25 * set)}, ${LODO(0.85)})`, opacity: 0.95 })} />
        <div style={ab(0, Hh - 40 - 150 * set, { width: W, height: 40 + 150 * set, background: "repeating-linear-gradient(0deg,#5d5852 0 10px,#6d6760 10px 18px,#4e4842 18px 24px)", boxShadow: "0 -8px 20px rgba(60,40,20,.6)" })} />
        {Array.from({ length: 40 }, (_, i) => { const y0 = 110 + rnd(i) * 380, y = lerp(y0, Hh - 50 - rnd(i + 4) * 120 * set, set * (0.5 + 0.5 * rnd(i + 2)));
          return <div key={i} style={ab(60 + rnd(i + 7) * 500, y, { width: 6 + rnd(i + 3) * 14, height: 4 + rnd(i + 1) * 6, borderRadius: 3, background: i % 4 ? "#2c2219" : "#9a948c", transform: `rotate(${i * 37 + tt * 20}deg)` })} />; })}
      </div>
      <div style={ab(-10, -30, { width: W + 20, height: 70, borderRadius: "50%", border: "10px solid rgba(240,244,246,.9)", background: `radial-gradient(ellipse, ${LODO(0.6)}, ${LODO(0.8)})` })} />
      <div style={ab(40, -150, { width: W - 80, height: 260, borderRadius: "50% 50% 0 0", border: "8px solid #8a9096", borderBottom: "none" })} />
    </div>
    <Tag tt={tt} at={1.4} x={1430} y={360} txt="AGUA CAFÉ" col={TX} size={58} />
    <Tag tt={tt} at={3.0} x={1460} y={790} txt="LODO GRIS" col={MZ} size={70} />
  </>;
}}</Stage>;

// 2 · odómetro de años de oficio
const Odometro: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#14202b">{(tt) => {
  const v = eio(tt, 0.3, 2.4) * 20;
  const dig = (d: number, i: number) => <div key={i} style={{ width: 150, height: 210, overflow: "hidden", borderRadius: 14, background: "linear-gradient(#0d0d0d,#2a2a2a 50%,#0d0d0d)", boxShadow: "inset 0 10px 20px #000, 0 20px 40px rgba(0,0,0,.6)", position: "relative" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: -d * 210, fontFamily: "monospace", fontWeight: 900, fontSize: 170, color: "#f2efe6", textAlign: "center", lineHeight: "210px" }}>{Array.from({ length: 11 }, (_, k) => <div key={k}>{k % 10}</div>)}</div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,.6),transparent 30%,transparent 70%,rgba(0,0,0,.6))" }} /></div>;
  return <>
    <div style={ab(960, 470, { transform: "translate(-50%,-50%) rotateX(8deg)", display: "flex", gap: 14, padding: 26, borderRadius: 24, background: "linear-gradient(#5a5f66,#2b2f34)", border: "6px solid #8b9198" })}>
      {dig(Math.floor(v / 10) % 10 + (v % 10 > 9 ? v % 1 : 0), 0)}{dig(v % 10, 1)}
      <div style={{ alignSelf: "center", fontWeight: 900, fontSize: 120, color: MZ, marginLeft: 10 }}>+</div>
    </div>
    <Tag tt={tt} at={2.3} x={960} y={720} txt="AÑOS" col={TX} size={70} />
  </>;
}}</Stage>;

// 3 · rayos X sobre la lavadora: la barra barre y deja ver la capa que no se ve
const RayosX: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#0b1a24" mesa={false}>{(tt) => {
  const x = lerp(260, 1660, eio(tt, 0.5, 3.4));
  return <>
    <div style={ab(560, 170, { width: 800, height: 760, borderRadius: 30, background: "linear-gradient(#eef1f2,#c9cfd3)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
      <div style={ab(150, 170, { width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#2c3a44 0 52%,#9aa3a9 53% 60%,#e3e7ea 61%)" })} />
      <div style={ab(40, 40, { width: 260, height: 70, borderRadius: 10, background: "#d7dce0", boxShadow: "inset 0 -4px 0 rgba(0,0,0,.15)" })} />
    </div>
    <div style={ab(560, 170, { width: 800, height: 760, borderRadius: 30, overflow: "hidden", clipPath: `inset(0 ${Math.max(0, 1360 - x)}px 0 0)` })}>
      <div style={{ position: "absolute", inset: 0, background: "#06202c" }} />
      <div style={ab(130, 150, { width: 540, height: 540, borderRadius: "50%", border: "34px solid rgba(70,52,34,.95)", boxShadow: "0 0 40px rgba(120,90,40,.6), inset 0 0 40px rgba(120,90,40,.5)" })} />
      <div style={ab(190, 210, { width: 420, height: 420, borderRadius: "50%", border: "4px dashed rgba(140,230,255,.8)" })} />
      <div style={ab(40, 40, { width: 260, height: 70, borderRadius: 10, border: "4px solid rgba(140,230,255,.7)", background: "rgba(40,28,18,.8)" })} />
    </div>
    <div style={ab(x - 6, 140, { width: 12, height: 820, background: "rgba(140,230,255,.95)", boxShadow: "0 0 40px 12px rgba(80,200,255,.6)" })} />
    <Tag tt={tt} at={3.0} x={1560} y={260} txt="AQUÍ ESTÁ" col={MZ} />
  </>;
}}</Stage>;

// 4 · perilla de ciclos que va pasando y cada ciclo queda tachado
const Perilla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1b1f26">{(tt) => {
  const ops: string[] = q(h).ops ?? ["RÁPIDO", "FRÍO", "LIMPIEZA"];
  const step = Math.min(ops.length - 1, Math.floor(tt / 1.2)), ang = -60 + 60 * (step + eio(tt % 1.2, 0, 0.5) * (step < ops.length - 1 ? 0 : 0));
  return <>
    <div style={ab(700, 540, { transform: "translate(-50%,-50%)", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fafafa,#b9bec3 70%,#8a9096)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" })}>
      <div style={ab(210, 210, { width: 300, height: 300, marginLeft: -150, marginTop: -150, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#ffffff,#cfd4d8)", transform: `rotate(${ang}deg)`, boxShadow: "0 12px 20px rgba(0,0,0,.35)" })}>
        <div style={ab(140, 14, { width: 20, height: 90, borderRadius: 10, background: RED })} />
      </div>
    </div>
    {ops.map((o, i) => { const last = i === ops.length - 1, on = tt >= i * 1.2 + 0.4, x = last ? 0 : eio(tt, i * 1.2 + 0.7, i * 1.2 + 1.0);
      return <div key={i} style={ab(1050, 330 + i * 150, { fontWeight: 900, fontSize: 76, color: on ? (last ? VER : TX) : "rgba(246,241,228,.3)", letterSpacing: 2, transform: `scale(${last && on ? 1 + 0.12 * phys(tt, i * 1.2 + 0.4, 8, 0.4) : 1})`, transformOrigin: "0 50%" })}>{last && on ? "✓ " : ""}{o}
        <div style={ab(-10, 44, { height: 12, width: (o.length * 52 + 20) * x, background: RED, borderRadius: 6, transform: "rotate(-4deg)" })} /></div>; })}
  </>;
}}</Stage>;

// 5 · dos tazas: en la caliente el azúcar se disuelve, en la fría queda en el fondo
const Tazas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#2a1a12">{(tt) => {
  const fall = eio(tt, 0.4, 1.6), dis = eio(tt, 1.6, 3.6);
  const taza = (x: number, hot: boolean) => <div style={ab(x, 420, { width: 360, height: 300 })}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "0 0 120px 120px", background: "linear-gradient(90deg,#e9e4da,#ffffff 40%,#d6d0c4)", boxShadow: "0 30px 50px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={ab(16, 40, { width: 328, height: 250, borderRadius: "0 0 110px 110px", background: "linear-gradient(#5a3418,#2e1a0c)" })} />
      {Array.from({ length: 34 }, (_, i) => { const gone = hot ? dis : 0, yy = lerp(-60, 230 + rnd(i) * 30, fall * (0.7 + 0.3 * rnd(i + 2)));
        return <div key={i} style={ab(60 + rnd(i + 7) * 240, yy, { width: 12, height: 12, borderRadius: 3, background: "#fbf7ef", opacity: 1 - gone, transform: `rotate(${i * 33}deg)` })} />; })}
    </div>
    <div style={ab(330, 70, { width: 110, height: 140, borderRadius: "0 70px 70px 0", border: "22px solid #ece7dc", borderLeft: "none" })} />
    {hot && [0, 1, 2].map((i) => <div key={i} style={ab(110 + i * 70, -120 - ((tt * 60 + i * 40) % 90), { width: 26, height: 110, borderRadius: 20, background: "rgba(255,255,255,.22)", filter: "blur(8px)" })} />)}
    <div style={ab(180, 330, { transform: "translateX(-50%)", fontWeight: 900, fontSize: 64, color: hot ? MZ : "#9fd6ff" })}>{hot ? "CALIENTE" : "FRÍA"}</div>
  </div>;
  return <>{taza(380, true)}{taza(1180, false)}<Tag tt={tt} at={3.8} x={1360} y={300} txt="NO SE VA" col={RED} /></>;
}}</Stage>;

// 6 · corte de capas: película → lodo → bacterias, como estratos de tierra
const Estratos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a1712">{(tt) => {
  const cap: [string, string][] = [["PELÍCULA", "#c9b98d"], ["LODO", "#6b5236"], ["HONGOS", "#2f3b26"]];
  return <div style={ab(960, 560, { transform: "translate(-50%,-50%) perspective(1200px) rotateX(18deg) rotateY(-18deg)", width: 980 })}>
    <div style={{ height: 90, borderRadius: "16px 16px 0 0", background: STEEL }} />
    {cap.map(([n, c], i) => { const k = phys(tt, 0.5 + i * 0.9, 7, 0.5);
      return <div key={i} style={{ height: 120 * cl(k), overflow: "hidden", background: `repeating-linear-gradient(${20 + i * 30}deg, ${c} 0 14px, rgba(0,0,0,.15) 14px 18px)`, borderBottom: "3px solid rgba(0,0,0,.4)", position: "relative" }}>
        <div style={ab(40, 26, { fontWeight: 900, fontSize: 58, color: "#fff", textShadow: "0 4px 10px #000" })}>{n}</div>
        {i === 2 && Array.from({ length: 16 }, (_, j) => <div key={j} style={ab(420 + rnd(j) * 520, 20 + rnd(j + 1) * 80, { width: 18, height: 18, borderRadius: "50%", background: "#9bd36a", opacity: 0.4 + 0.4 * Math.sin(tt * 3 + j), transform: `scale(${0.6 + 0.5 * Math.sin(tt * 2 + j)})` })} />)}
      </div>; })}
  </div>;
}}</Stage>;

// 7 · fibra de tela al microscopio: el suavizante deja una capa de cera encima (y la misma en el tambor)
const Fibra: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#121d22" mesa={false}>{(tt) => {
  const cera = eio(tt, 0.8, 2.6);
  return <>
    <div style={ab(960, 520, { transform: "translate(-50%,-50%)", width: 760, height: 760, borderRadius: "50%", overflow: "hidden", border: "18px solid #2a2f33", boxShadow: "0 0 0 6px #6c7378, 0 40px 80px rgba(0,0,0,.6)", background: "#e9eef0" })}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={ab(-60, 40 + i * 80, { width: 900, height: 62, borderRadius: 31, transform: `rotate(${(i % 2 ? 8 : -8) + Math.sin(i) * 3}deg)`, background: "repeating-linear-gradient(90deg,#c8d6e0 0 10px,#b1c3cf 10px 20px)", boxShadow: `0 0 0 ${10 * cera}px rgba(240,214,140,${0.75 * cera}), 0 6px 10px rgba(0,0,0,.2)` })} />)}
    </div>
    <Tag tt={tt} at={2.4} x={1560} y={300} txt="CERA" col={MZ} size={80} />
  </>;
}}</Stage>;

// 8 · expediente de la señora Rosa: tres casillas que se sellan
const Expediente: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#24180f">{(tt) => {
  const rows: string[] = q(h).rows ?? ["Todo en frío", "Ciclo rápido", "Doble suavizante"];
  return <div style={ab(960, 540, { transform: `translate(-50%,-50%) rotate(-2deg) translateY(${(1 - phys(tt, 0.1, 6, 0.6)) * 400}px)`, width: 900, padding: "50px 60px", background: "#f1e3c2", borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,.6)", color: TIN, fontFamily: HAND })}>
    <div style={ab(-6, -46, { width: 300, height: 60, borderRadius: "14px 14px 0 0", background: "#e4cf9f" })} />
    <div style={{ fontSize: 66, fontWeight: 700, borderBottom: "3px solid #9b7e47", marginBottom: 20 }}>{q(h).title ?? "Sra. Rosa — Guadalajara"}</div>
    {rows.map((r, i) => { const k = phys(tt, 1.0 + i * 0.9, 9, 0.35);
      return <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 64, margin: "16px 0" }}>
        <div style={{ width: 70, height: 70, border: "5px solid #3a2a1a", borderRadius: 8, position: "relative" }}>
          <div style={ab(-6, -30, { fontSize: 110, color: RED, transform: `scale(${cl(k) * 1.0})`, opacity: cl(k * 3) })}>✗</div></div>{r}</div>; })}
  </div>;
}}</Stage>;

// 9 · pila de trapos blancos que caen uno por uno (contador)
const Trapos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d252b">{(tt) => {
  const n = 4;
  return <>{Array.from({ length: n }, (_, i) => { const k = phys(tt, 0.3 + i * 0.6, 8, 0.45);
    return <div key={i} style={ab(820, 820 - i * 118, { transform: `translate(-50%,-50%) translateY(${(1 - k) * -800}px) rotate(${(i % 2 ? 2 : -3)}deg)`, width: 700 - i * 24, height: 112, borderRadius: "18px 18px 30px 30px", background: "repeating-linear-gradient(0deg, transparent 0 82px, rgba(150,160,165,.55) 82px 92px, transparent 92px 112px), repeating-radial-gradient(circle at 20% 30%, rgba(0,0,0,.06) 0 2px, transparent 2px 5px), linear-gradient(#ffffff,#e4e8ea 60%,#c9d0d3)", boxShadow: "0 16px 26px rgba(0,0,0,.45), inset 0 -10px 16px rgba(0,0,0,.12)" })} />; })}
    <div style={ab(820, 900, { transform: "translateX(-50%)", width: 900, height: 40, borderRadius: 20, background: "rgba(0,0,0,.35)", filter: "blur(14px)" })} />
    <div style={ab(1440, 420, { fontWeight: 900, fontSize: 240, color: MZ, transform: `scale(${0.8 + 0.2 * phys(tt, 0.3 + Math.min(3, Math.floor(tt / 0.6)) * 0.6, 9, 0.4)})` })}>{Math.max(1, Math.min(n, Math.floor((tt - 0.3) / 0.6) + 1))}</div>
    <Tag tt={tt} at={0.2} x={1440} y={330} txt="TRAPOS" col={TX} size={50} />
    <Tag tt={tt} at={2.8} x={1440} y={720} txt="LIMPIOS" col={VER} size={54} />
  </>;
}}</Stage>;

// 10 · carta de color del agua: una aguja recorre clara → gris → café
const Carta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1a1d22">{(tt) => {
  const ops: [string, string, string][] = [["CLARA", "rgba(210,232,240,.95)", "BIEN"], ["GRIS", "#8d9196", "MUGRE"], ["CAFÉ", "#6a4a2c", "AÑOS"]];
  const p = eio(tt, 0.5, 3.6) * 2;
  return <>{ops.map(([n, c, s], i) => { const on = Math.abs(p - i) < 0.5;
    return <div key={i} style={ab(330 + i * 440, 300, { width: 380, height: 460, borderRadius: 26, background: c, transform: `translateY(${on ? -30 : 0}px) scale(${on ? 1.05 : 1})`, boxShadow: on ? `0 0 0 10px ${MZ}, 0 40px 70px rgba(0,0,0,.6)` : "0 30px 50px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 40 })}>
      <div style={{ fontWeight: 900, fontSize: 72, color: i ? "#fff" : TIN }}>{n}</div><div style={{ fontWeight: 800, fontSize: 40, color: i ? "rgba(255,255,255,.8)" : "#355" }}>{s}</div></div>; })}
    <div style={ab(330 + 190 + p * 440, 230, { transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "34px solid transparent", borderRight: "34px solid transparent", borderTop: `50px solid ${MZ}` })} />
  </>;
}}</Stage>;

// 11 · bandeja de herramientas: siete huecos con silueta que se van llenando
const Bandeja: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1b2329">{(tt) => {
  const it: string[] = q(h).items ?? ["Oxígeno", "Trapos", "Cubeta", "Cepillo", "Charola", "Linterna", "Tiempo"];
  return <div style={ab(960, 540, { transform: "translate(-50%,-50%) perspective(1400px) rotateX(24deg)", width: 1500, padding: 34, borderRadius: 26, background: "linear-gradient(#a1342a,#7a221b)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 20 })}>
    {it.map((s, i) => { const k = phys(tt, 0.3 + i * 0.42, 8, 0.45);
      return <div key={i} style={{ height: 300, borderRadius: 16, background: "#3a120e", boxShadow: "inset 0 10px 20px rgba(0,0,0,.7)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 150, height: 210, borderRadius: 20, background: `linear-gradient(${i * 40}deg,#f2efe6,#c9c3b6)`, transform: `translateY(${(1 - k) * -500}px)`, opacity: cl(k * 2), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 96, color: BR }}>{i + 1}</div>
        <div style={ab(0, 310, { width: "100%", textAlign: "center", fontWeight: 900, fontSize: 34, color: TX, opacity: cl(k * 2) })}>{s}</div>
      </div>; })}
  </div>;
}}</Stage>;

// 12 · choque prohibido: dos botellas que se acercan y una barrera roja las frena; nube tóxica
const Choque: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#2a0f0d">{(tt) => {
  const k = eio(tt, 0.3, 1.4), stop = tt > 1.4, sh = stop ? 8 * Math.exp(-(tt - 1.4) * 4) * Math.sin((tt - 1.4) * 40) : 0;
  const bot = (x: number, c: string, n: string) => <div style={ab(x, 330, { width: 220, height: 420 })}>
    <div style={ab(70, 0, { width: 80, height: 70, borderRadius: 10, background: "#333" })} />
    <div style={ab(0, 60, { width: 220, height: 360, borderRadius: "60px 60px 30px 30px", background: c, boxShadow: "inset -20px 0 30px rgba(0,0,0,.25), 0 30px 50px rgba(0,0,0,.5)" })} />
    <div style={ab(110, 230, { transform: "translateX(-50%)", fontWeight: 900, fontSize: 44, color: "#fff", textShadow: "0 3px 8px #000" })}>{n}</div></div>;
  return <>
    {bot(380 + 260 * k + sh, "linear-gradient(90deg,#e6eef5,#b9c8d6)", q(h).l ?? "CLORO")}
    {bot(1320 - 260 * k - sh, "linear-gradient(90deg,#d7c9a0,#a8925c)", q(h).r ?? "VINAGRE")}
    <div style={ab(960, 540, { transform: `translate(-50%,-50%) scaleY(${cl(phys(tt, 1.2, 9, 0.4))})`, width: 40, height: 620, borderRadius: 20, background: `repeating-linear-gradient(45deg,${RED} 0 30px,#fff 30px 60px)`, boxShadow: "0 0 40px rgba(255,60,40,.6)" })} />
    {stop && Array.from({ length: 10 }, (_, i) => <div key={i} style={ab(900 + Math.sin(i * 2) * 120, 300 - (tt - 1.4) * 60 - i * 12, { width: 140, height: 100, borderRadius: "50%", background: "rgba(190,230,120,.25)", filter: "blur(16px)" })} />)}
    <Tag tt={tt} at={1.7} x={960} y={150} txt="GAS TÓXICO" col={RED} size={84} />
  </>;
}}</Stage>;

// 13 · clavija 3D que sale del contacto; el indicador pasa de rojo a verde
const Clavija: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#18232c" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 1.8);
  return <>
    <div style={ab(640, 260, { width: 520, height: 560, borderRadius: 30, background: "linear-gradient(#f4f4f0,#d8d8d2)", boxShadow: "0 30px 70px rgba(0,0,0,.6)" })}>
      {[150, 310].map((y) => <div key={y} style={ab(170, y, { width: 180, height: 120, borderRadius: 18, background: "#e9e9e3", boxShadow: "inset 0 4px 10px rgba(0,0,0,.2)" })}>
        <div style={ab(50, 40, { width: 16, height: 46, background: "#333", borderRadius: 3 })} /><div style={ab(114, 40, { width: 16, height: 46, background: "#333", borderRadius: 3 })} /></div>)}
    </div>
    <div style={ab(800 + 520 * k, 330 + 40 * k, { width: 260, height: 160, transform: `rotate(${-8 * k}deg)` })}>
      <div style={ab(-60, 40, { width: 70, height: 14, background: "linear-gradient(#ddd,#888)", borderRadius: 3 })} /><div style={ab(-60, 100, { width: 70, height: 14, background: "linear-gradient(#ddd,#888)", borderRadius: 3 })} />
      <div style={{ width: 260, height: 160, borderRadius: "20px 50px 50px 20px", background: "linear-gradient(#2d2d2d,#111)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
      <div style={ab(250, 66, { width: 520, height: 28, borderRadius: 14, background: "#1a1a1a" })} />
    </div>
    <div style={ab(1460, 700, { width: 90, height: 90, borderRadius: "50%", background: k > 0.9 ? VER : RED, boxShadow: `0 0 50px ${k > 0.9 ? VER : RED}` })} />
    <Tag tt={tt} at={2.0} x={1250} y={930} txt="DESENCHUFADA" col={VER} size={60} />
  </>;
}}</Stage>;

// 14 · el hueco del cajón en 3D con una linterna que barre el techo y aparece el moho
const Hueco3D: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#0d1216" mesa={false}>{(tt) => {
  const bx = 960 + Math.sin(tt * 1.3 - 1.2) * 330, by = 430 + Math.cos(tt * 0.9) * 40, R = 210 + 30 * eio(tt, 0, 1.2);
  const mold = Array.from({ length: 34 }, (_, i) => <div key={i} style={ab(560 + rnd(i) * 800, 300 + rnd(i + 7) * 230, { width: 26 + rnd(i + 2) * 70, height: 18 + rnd(i + 5) * 44, borderRadius: "50%", background: "radial-gradient(circle,#0c0f08 0 40%,#22281a 70%,transparent 72%)", transform: "translate(-50%,-50%)" })} />);
  const hole = `radial-gradient(circle at ${bx}px ${by}px, transparent ${R}px, rgba(0,0,0,.94) ${R + 60}px)`;
  return <>
    <div style={ab(960, 560, { transform: "translate(-50%,-50%)", width: 1240, height: 640, borderRadius: 26, background: "linear-gradient(#e9ecee,#b9c0c5)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" })} />
    <div style={{ position: "absolute", left: 400, top: 270, width: 1120, height: 520, clipPath: "polygon(0 0,100% 0,82% 100%,18% 100%)", background: "linear-gradient(#4a4e50,#2c2f31 45%,#1d1f20)" }} />
    <div style={{ position: "absolute", left: 600, top: 520, width: 720, height: 270, background: "linear-gradient(#26292b,#141516)" }} />
    {mold}
    <div style={{ position: "absolute", inset: 0, background: hole }} />
    <div style={{ position: "absolute", left: bx - R, top: by - R, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,210,.22), transparent 70%)", mixBlendMode: "screen" }} />
    <div style={ab(lerp(1500, 1380, eio(tt, 0, 1)), 900, { width: 340, height: 100, borderRadius: 24, background: "linear-gradient(#3b3b3b,#0f0f0f)", transform: `rotate(${-20 + (bx - 960) / 40}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.7)" })} />
    <Tag tt={tt} at={2.4} x={960} y={160} txt="MOHO NEGRO" col={MZ} size={62} />
  </>;
}}</Stage>;

// 15 · temporizador de cocina de 20 minutos
const Timer: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#202018">{(tt) => {
  const m: number = q(h).min ?? 20, k = eio(tt, 0.4, 2.6), deg = (m / 60) * 360 * k;
  return <>
    <div style={ab(960, 520, { transform: "translate(-50%,-50%)", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fff,#dcdcd2 70%,#b8b8ad)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 18px #e2463a" })}>
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: `conic-gradient(rgba(226,70,58,.85) 0 ${deg}deg, transparent ${deg}deg)` }} />
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={ab(272, 46, { width: 16, height: 40, background: TIN, transformOrigin: "8px 234px", transform: `rotate(${i * 30}deg)` })} />)}
      <div style={ab(280, 280, { width: 30, height: 30, marginLeft: -15, marginTop: -15, borderRadius: "50%", background: TIN })} />
    </div>
    <div style={ab(1450, 470, { fontWeight: 900, fontSize: 200, color: MZ })}>{Math.round(m * k)}<span style={{ fontSize: 80 }}> min</span></div>
  </>;
}}</Stage>;

// 16 · la perilla del filtro de la bomba en 3D: gira un cuarto de vuelta y empieza a gotear
const Filtro3D: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#141b20" mesa={false}>{(tt) => {
  const rot = eio(tt, 1.0, 2.0) * 90, drip = tt > 1.8;
  return <>
    <div style={ab(360, 200, { width: 1200, height: 700, borderRadius: 30, background: "linear-gradient(#f1f3f4,#cfd4d8)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
      <div style={ab(700, 200, { width: 420, height: 420, borderRadius: 30, background: "#2a2d30", boxShadow: "inset 0 20px 40px #000" })}>
        <div style={ab(210, 210, { width: 300, height: 300, marginLeft: -150, marginTop: -150, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fafafa,#bfc4c8 70%)", transform: `perspective(800px) rotateY(-18deg) rotateZ(${rot}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.6)" })}>
          <div style={ab(130, 20, { width: 40, height: 260, borderRadius: 20, background: "linear-gradient(90deg,#9aa0a5,#f3f3f3,#9aa0a5)" })} />
        </div>
      </div>
    </div>
    {drip && Array.from({ length: 6 }, (_, i) => { const y = ((tt - 1.8) * 420 + i * 70) % 300; return <div key={i} style={ab(1270 + (i % 2) * 20, 830 + y, { width: 16, height: 24, borderRadius: "50% 50% 50% 50%/60% 60% 40% 40%", background: "rgba(150,120,80,.9)" })} />; })}
    <Tag tt={tt} at={2.1} x={600} y={300} txt="1/4 VUELTA" col={MZ} size={64} />
  </>;
}}</Stage>;

// 17 · tira de tres pasos (toalla, charola, despacito) que se despliega como acordeón
const Acordeon: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1d2125">{(tt) => {
  const ps: string[] = q(h).steps ?? ["Toalla en el piso", "Charola debajo", "Giro despacito"];
  return <div style={ab(960, 540, { transform: "translate(-50%,-50%)", display: "flex", perspective: 1600 })}>
    {ps.map((s, i) => { const k = eio(tt, 0.4 + i * 0.8, 1.0 + i * 0.8);
      return <div key={i} style={{ width: 500, height: 520, transformOrigin: "0 50%", transform: `rotateY(${(1 - k) * (i % 2 ? 90 : -90)}deg)`, background: i % 2 ? "#e9e2d0" : "#f6f0df", border: "4px solid #b8a77d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, boxShadow: "0 30px 60px rgba(0,0,0,.4)" }}>
        <div style={{ width: 170, height: 170, borderRadius: "50%", background: BR, color: "#fff", fontWeight: 900, fontSize: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: TIN, textAlign: "center", padding: "0 30px" }}>{s}</div>
      </div>; })}
  </div>;
}}</Stage>;

// 18 · lo que sale del filtro: monedas, botón, pasador, liga, un arete; caen a la charola y se cuentan
const Tesoros: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a1c1e">{(tt) => {
  const obs = [["#c9a14a", 120, "50%"], ["#b0b4b8", 104, "50%"], ["#e36b8a", 110, "50%"], ["#3c3c3c", 200, "6px"], ["#2b2b2b", 180, "60px"], ["#d9b44a", 80, "50%"], ["#c9a14a", 112, "50%"], ["#7a5a3a", 96, "50%"]] as const;
  const n = Math.min(obs.length, Math.floor(eio(tt, 0.3, 3.0) * obs.length + 0.001));
  return <>
    <div style={ab(960, 760, { transform: "translate(-50%,-50%) perspective(1000px) rotateX(55deg)", width: 1100, height: 420, borderRadius: 30, background: "linear-gradient(#a9b0b5,#6d7378)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 0 0 16px #8a9196" })} />
    {obs.map(([c, s, r], i) => { const k = phys(tt, 0.3 + i * 0.34, 9, 0.4);
      return <div key={i} style={ab(470 + (i % 4) * 260 + (i > 3 ? 110 : 0), 690 + (i > 3 ? 50 : -60), { width: s, height: i === 3 || i === 4 ? 22 : s, borderRadius: r, background: c, transform: `translateY(${(1 - k) * -900}px) rotate(${i * 50}deg)`, boxShadow: "0 10px 14px rgba(0,0,0,.5), inset 0 -6px 0 rgba(0,0,0,.2)", opacity: i < n + 1 ? 1 : 0 })} />; })}
    <div style={ab(960, 220, { transform: "translateX(-50%)", fontWeight: 900, fontSize: 150, color: MZ })}>{n}</div>
  </>;
}}</Stage>;

// 19 · corte del tambor girando con los trapos que golpean (vista de frente, 2D con giro)
const Tumble: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#13202a" mesa={false}>{(tt) => {
  const a = tt * 140;
  return <>
    <div style={ab(960, 540, { transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,#2a3a46 0 60%,#a9b2b8 61% 66%,#e6eaec 67%)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${a}deg)` }}>
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,14,18,.9) 0 4px, transparent 5px) 0 0/30px 30px", WebkitMaskImage: "radial-gradient(circle, transparent 0 66%, #000 67% 70%, transparent 71%)", maskImage: "radial-gradient(circle, transparent 0 66%, #000 67% 70%, transparent 71%)" } as React.CSSProperties} />
        {[0, 120, 240].map((d) => <div key={d} style={ab(330, 40, { width: 40, height: 90, borderRadius: 10, background: "#cfd6da", transformOrigin: "20px 310px", transform: `rotate(${d}deg)` })} />)}
        {Array.from({ length: 3 }, (_, i) => <div key={i} style={ab(200 + i * 90, 110 + i * 40, { width: 180, height: 80, borderRadius: 30, background: "#f4f4f2", transformOrigin: `${150 - i * 90}px ${240 - i * 40}px`, transform: `rotate(${Math.sin(tt * 3 + i) * 30}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,.35)" })} />)}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 60, height: 230, borderRadius: "0 0 300px 300px", background: "rgba(150,200,220,.35)", transform: `translateX(${Math.sin(tt * 4) * 20}px)` }} />
    </div>
    <Tag tt={tt} at={1.2} x={1550} y={330} txt="TALLAN" col={MZ} size={80} />
  </>;
}}</Stage>;

// 20 · báscula de cocina: la aguja llega a 150 gramos
const Bascula: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1f1e1a">{(tt) => {
  const g: number = q(h).g ?? 150, k = phys(tt, 0.5, 5, 0.35), ang = -120 + 240 * (g / 500) * cl(k);
  return <>
    <div style={ab(960, 560, { transform: "translate(-50%,-50%)", width: 640, height: 640, borderRadius: 60, background: "linear-gradient(#e9e6df,#c8c3b8)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
      <div style={ab(70, 150, { width: 500, height: 420, borderRadius: "250px 250px 40px 40px", background: "#fffdf6", boxShadow: "inset 0 6px 14px rgba(0,0,0,.2)" })}>
        {Array.from({ length: 11 }, (_, i) => <div key={i} style={ab(244, 30, { width: 12, height: i % 2 ? 26 : 46, background: TIN, transformOrigin: "6px 220px", transform: `rotate(${-120 + i * 24}deg)` })} />)}
        <div style={ab(244, 30, { width: 12, height: 220, background: RED, transformOrigin: "6px 220px", transform: `rotate(${ang}deg)`, borderRadius: 6 })} />
      </div>
      <div style={ab(40, -50, { width: 560, height: 70, borderRadius: 30, background: "linear-gradient(#cfd4d8,#9aa1a7)" })} />
      <div style={ab(150, -150, { width: 340, height: 110, borderRadius: "50%", background: "radial-gradient(#fff,#e9eef0)", boxShadow: "0 6px 0 rgba(0,0,0,.15)" })} />
    </div>
    <div style={ab(1460, 460, { fontWeight: 900, fontSize: 180, color: MZ })}>{Math.round(g * cl(k))}<span style={{ fontSize: 80 }}> g</span></div>
  </>;
}}</Stage>;

// 21 · curva de temperatura: cuánto trabaja el oxígeno según los grados
const Curva: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#151a1f" mesa={false}>{(tt) => {
  const k = eio(tt, 0.4, 2.8), W = 1300, Hh = 560;
  const f = (x: number) => 1 / (1 + Math.exp(-(x - 0.45) * 9));
  const pts = Array.from({ length: 60 }, (_, i) => { const x = i / 59; return `${x * W},${Hh - f(x) * Hh * 0.9}`; }).join(" ");
  return <div style={ab(310, 230, { width: W, height: Hh })}>
    <svg width={W} height={Hh + 80} style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={W * 0.33} height={Hh} fill="rgba(120,190,255,.12)" /><rect x={W * 0.55} y={0} width={W * 0.45} height={Hh} fill="rgba(255,120,60,.16)" />
      <line x1={0} y1={Hh} x2={W} y2={Hh} stroke={TX} strokeWidth={4} /><line x1={0} y1={0} x2={0} y2={Hh} stroke={TX} strokeWidth={4} />
      <polyline points={pts} fill="none" stroke={MZ} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - k} />
      {[["20°", 0.0], ["40°", 0.33], ["60°", 0.55], ["90°", 0.98]].map(([s, x]) => <text key={s as string} x={(x as number) * W} y={Hh + 60} fill={TX} fontSize={44} fontWeight={900} textAnchor="middle">{s}</text>)}
    </svg>
    <div style={ab(40, 40, { fontWeight: 900, fontSize: 52, color: "#9fd6ff", opacity: e1(tt, 1.0) })}>casi nada</div>
    <div style={ab(W * 0.62, 30, { fontWeight: 900, fontSize: 56, color: MZ, opacity: e1(tt, 2.2) })}>despega</div>
  </div>;
}}</Stage>;
const e1 = (tt: number, a: number) => cl((tt - a) / 0.4);

// 22 · ojo de buey: la puerta de vidrio, el agua entra clara y se va oscureciendo
const OjoBuey: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#12191e" mesa={false}>{(tt) => {
  const lvl = eio(tt, 0.2, 1.6), dirt = eio(tt, 1.4, 4.4);
  return <div style={ab(960, 540, { transform: "translate(-50%,-50%)", width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle,#dfe4e7 0 62%,#9aa3a9 63% 70%,#eef1f2 71%)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
    <div style={ab(100, 100, { width: 560, height: 560, borderRadius: "50%", overflow: "hidden", background: "#1d2a33" })}>
      <div style={ab(-40, 560 * (1 - lvl * 0.62), { width: 640, height: 600, background: LODO(0.15 + 0.75 * dirt), borderRadius: "46%", transform: `rotate(${tt * 40}deg)` })} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 30% at 35% 20%, rgba(255,255,255,.35), transparent)" }} />
    </div>
  </div>;
}}</Stage>;

// 23 · contrato de la garantía: dos columnas, lo que sí y lo que no, con sello
const Contrato: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1e1a14">{(tt) => {
  const si: string[] = q(h).si ?? ["Cada ciclo sale más clara", "La cubeta no miente"], no: string[] = q(h).no ?? ["Como nueva en un día", "Tambor sellado de fábrica"];
  const col = (tit: string, xs: string[], ok: boolean, d: number) => <div style={{ flex: 1, padding: 30 }}>
    <div style={{ fontWeight: 900, fontSize: 52, color: ok ? "#1d6b2a" : RED, borderBottom: `4px solid ${ok ? "#1d6b2a" : RED}`, marginBottom: 20 }}>{tit}</div>
    {xs.map((x, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 52, color: TIN, margin: "14px 0", opacity: e1(tt, d + i * 0.6) }}>{ok ? "✓ " : "✗ "}{x}</div>)}</div>;
  return <div style={ab(960, 540, { transform: `translate(-50%,-50%) rotate(-1.5deg)`, width: 1400, background: "#f7f1e1", borderRadius: 8, boxShadow: "0 40px 80px rgba(0,0,0,.6)", display: "flex" })}>
    {col("GARANTIZADO", si, true, 0.6)}<div style={{ width: 4, background: "#c9b88f" }} />{col("NO GARANTIZO", no, false, 2.0)}
    <div style={ab(1180, 330, { transform: `rotate(-14deg) scale(${2 - cl(phys(tt, 3.2, 9, 0.5))})`, opacity: e1(tt, 3.2), border: `8px solid ${RED}`, borderRadius: 20, padding: "6px 24px", fontWeight: 900, fontSize: 56, color: RED })}>CUBETA</div>
  </div>;
}}</Stage>;

// 24 · el empaque de la puerta en 3D (anillo de fuelle) con el pliegue de abajo que se abre
const Fuelle3D: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#101418" mesa={false}>{(tt) => {
  const open = eio(tt, 1.0, 2.2), n = 36;
  return <Scene rx={-28} ry={-20 + 6 * Math.sin(tt * 0.5)} s={1.1} y={560}>
    {Array.from({ length: n }, (_, i) => { const ang = (360 / n) * i, low = Math.cos((ang * Math.PI) / 180) < -0.6, pull = low ? open * 70 : 0;
      return <div key={i} style={{ position: "absolute", left: -38, top: -60, width: 76, height: 120, transform: `rotateZ(${ang}deg) translateY(${-300 - pull}px) rotateX(${low ? -40 * open : 0}deg)`, borderRadius: 20,
        background: low && open > 0.5 ? "radial-gradient(circle at 40% 60%, #111 0 12px, transparent 13px), radial-gradient(circle at 70% 30%, #1a1a1a 0 8px, transparent 9px), linear-gradient(#5d6266,#3a3e42)" : "linear-gradient(#7a8085,#4b5054)", boxShadow: "inset 0 -10px 16px rgba(0,0,0,.4)" }} />; })}
    <div style={{ position: "absolute", left: -240, top: -240, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, #222 0 70%, #888 71% 74%, #2b2b2b 75%)", transform: "translateZ(-60px)" }} />
  </Scene>;
}}</Stage>;

// 25 · reloj de arena: una hora de remojo
const Arena: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d1a14">{(tt) => {
  const k = eio(tt, 0.4, 4.4);
  return <>
    <div style={ab(960, 540, { transform: `translate(-50%,-50%) rotate(${(1 - phys(tt, 0, 5, 0.5)) * 180}deg)`, width: 360, height: 640 })}>
      <div style={ab(0, 0, { width: 360, height: 30, borderRadius: 8, background: "#6b4a2a" })} /><div style={ab(0, 610, { width: 360, height: 30, borderRadius: 8, background: "#6b4a2a" })} />
      <div style={ab(40, 30, { width: 280, height: 290, clipPath: "polygon(0 0,100% 0,55% 100%,45% 100%)", background: "rgba(220,235,245,.25)", overflow: "hidden" })}>
        <div style={ab(0, 290 * (0.15 + 0.85 * k), { width: 280, height: 290, background: "#d9b76a" })} /></div>
      <div style={ab(40, 320, { width: 280, height: 290, clipPath: "polygon(45% 0,55% 0,100% 100%,0 100%)", background: "rgba(220,235,245,.25)", overflow: "hidden" })}>
        <div style={ab(0, 290 * (1 - 0.85 * k), { width: 280, height: 290, background: "#d9b76a", clipPath: "polygon(50% 0,100% 100%,0 100%)" })} /></div>
      <div style={ab(178, 300, { width: 4, height: 300 * (k < 0.98 ? 1 : 0), background: "#d9b76a" })} />
    </div>
    <div style={ab(1450, 470, { fontWeight: 900, fontSize: 150, color: MZ })}>1 h</div>
  </>;
}}</Stage>;

// 26 · calendario: el primer domingo de cada mes se marca con un círculo a mano
const Calendario: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c1a17">{(tt) => {
  const M = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return <div style={ab(960, 540, { transform: "translate(-50%,-50%)", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 22 })}>
    {M.map((m, i) => { const k = e1(tt, 0.4 + i * 0.22);
      return <div key={i} style={{ width: 230, height: 200, background: "#fbf8f0", borderRadius: 12, boxShadow: "0 16px 30px rgba(0,0,0,.45)", position: "relative", overflow: "hidden" }}>
        <div style={{ height: 50, background: RED, color: "#fff", fontWeight: 900, fontSize: 36, textAlign: "center", lineHeight: "50px" }}>{m}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: 10, gap: 4 }}>{Array.from({ length: 28 }, (_, d) => <div key={d} style={{ height: 20, borderRadius: 3, background: d === (i * 3) % 7 ? "#c9d6e0" : "#ecebe6" }} />)}</div>
        <svg width={230} height={200} style={{ position: "absolute", left: 0, top: 0 }}><ellipse cx={24 + ((i * 3) % 7) * 30} cy={72} rx={26} ry={20} fill="none" stroke={BR} strokeWidth={6} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - k} /></svg>
      </div>; })}
  </div>;
}}</Stage>;

// 27 · la cruceta de aluminio en 3D girando, con puntos de corrosión que aparecen
const Cruceta3D: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#0f1418" mesa={false}>{(tt) => {
  const cor = eio(tt, 1.4, 3.0);
  const spots = (d: number) => Array.from({ length: 6 }, (_, j) => `radial-gradient(ellipse ${16 + rnd(d + j) * 20}px ${12 + rnd(d + j + 3) * 14}px at ${30 + rnd(d + j + 1) * 40}% ${15 + j * 13}%, rgba(245,244,236,${cor}) 0 60%, rgba(200,200,190,${cor * 0.6}) 61%, transparent 100%)`).join(",");
  return <><Scene rx={-14} ry={-28 + 22 * Math.sin(tt * 0.5)} s={1.15} y={560}>
    {[0, 120, 240].map((d) => <div key={d} style={{ position: "absolute", left: -75, top: -360, width: 150, height: 360, transformOrigin: "75px 360px", transform: `rotateZ(${d}deg) translateZ(18px)`, clipPath: "polygon(30% 0,70% 0,100% 100%,0 100%)", background: `${spots(d)}, radial-gradient(circle at 50% 10%, #1b1f22 0 12px, #c9ced2 13px 18px, transparent 19px), linear-gradient(90deg,#7f878d,#e6eaec 45%,#9aa2a8)` }} />)}
    {[0, 120, 240].map((d) => <div key={"b" + d} style={{ position: "absolute", left: -75, top: -360, width: 150, height: 360, transformOrigin: "75px 360px", transform: `rotateZ(${d}deg) translateZ(-18px)`, clipPath: "polygon(30% 0,70% 0,100% 100%,0 100%)", background: "#4c5358" }} />)}
    <div style={{ position: "absolute", left: -120, top: -120, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,#2a2e31 0 26px,#d0d5d8 27px 40px,#9aa2a8 41px, #eef1f2 70%, #7f878d)", transform: "translateZ(24px)", boxShadow: "0 10px 30px rgba(0,0,0,.6)" }} />
  </Scene>
    <Tag tt={tt} at={0.4} x={330} y={200} txt="ALUMINIO" col={TX} size={50} />
    <Tag tt={tt} at={2.6} x={1560} y={880} txt="CORROSIÓN" col={MZ} size={58} />
  </>;
}}</Stage>;

// 28 · tabla de frecuencia: según cuánto laves
const Frecuencia: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#171c21">{(tt) => {
  const rows: [string, string][] = q(h).rows ?? [["Todos los días", "1 vez al mes"], ["Cada 2 o 3 días", "Cada 3 o 4 meses"]];
  return <div style={ab(960, 560, { transform: "translate(-50%,-50%)", width: 1300 })}>
    <div style={{ display: "flex", opacity: e1(tt, 0.1), marginBottom: 10 }}><div style={{ flex: 1, textAlign: "center", fontWeight: 900, fontSize: 44, color: DIM }}>SI LAVAS…</div><div style={{ width: 160 }} /><div style={{ flex: 1, textAlign: "center", fontWeight: 900, fontSize: 44, color: MZ }}>LIMPIA LA MÁQUINA</div></div>
    {rows.map(([a, b], i) => { const k = phys(tt, 0.4 + i * 1.0, 7, 0.5);
      return <div key={i} style={{ display: "flex", alignItems: "center", margin: "36px 0", transform: `translateX(${(1 - cl(k)) * (i % 2 ? 160 : -160)}px)`, opacity: cl(k * 2) }}>
        <div style={{ flex: 1, padding: "34px 40px", borderRadius: 20, background: "#f4efe3", fontWeight: 900, fontSize: 60, color: TIN }}>{a}</div>
        <div style={{ fontSize: 100, color: MZ, margin: "0 30px", fontWeight: 900 }}>→</div>
        <div style={{ flex: 1, padding: "34px 40px", borderRadius: 20, background: BR, fontWeight: 900, fontSize: 60, color: "#fff" }}>{b}</div>
      </div>; })}
  </div>;
}}</Stage>;

// 29 · ⭐ el tambor dentro de la tina, en corte 3D: el gajo abierto deja ver el lodo en el espacio entre los dos
const Corte3D: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#0e151b" mesa={false} cam={0.6}>{(tt) => {
  const op = eio(tt, 0.8, 2.2), sl = eio(tt, 2.4, 3.6);
  return <>
    <Scene rx={-16} ry={-40 + tt * 10} s={1.05} y={560}>
      {/* tina de plástico (afuera), con el gajo abierto */}
      <Cyl r={330} hgt={420} n={36} open={op} face={(i) => ({ background: i % 2 ? "rgba(230,232,228,.95)" : "rgba(210,213,208,.95)" })} />
      {/* el lodo pegado en la cara de AFUERA del tambor */}
      <Cyl r={292} hgt={390} n={32} open={op * 0.9} face={() => ({ background: `rgba(${70},${56},${40},${0.92 * sl + 0.0})`, borderTop: "6px solid rgba(40,30,20,.6)" })} />
      {/* tambor de acero con agujeritos (adentro), brillante */}
      <Cyl r={270} hgt={380} n={32} face={() => ({ background: `radial-gradient(circle, #2b3136 0 3px, transparent 4px) 0 0/22px 22px, ${STEEL}` })} />
      <Disc r={270} y={190} bg={`radial-gradient(circle,#3a4046 0 22%, #c9cfd3 23% 26%, #9aa1a7 27%)`} />
    </Scene>
    <Tag tt={tt} at={1.6} x={330} y={240} txt="TINA" col={TX} size={64} />
    <Tag tt={tt} at={2.0} x={1600} y={240} txt="TAMBOR" col={TX} size={64} />
    <Tag tt={tt} at={3.2} x={1560} y={880} txt="AQUÍ EL LODO" col={MZ} size={64} />
  </>;
}}</Stage>;

// 30 · la linterna por un agujerito: chapa perforada a oscuras, un haz que pasa y del otro lado la capa de terciopelo gris
const Linterna: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#060809" mesa={false}>{(tt) => {
  const k = eio(tt, 0.6, 1.6), rev = eio(tt, 1.8, 3.0);
  return <>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 960px 520px, rgba(0,0,0,0) ${60 + 520 * rev}px, rgba(0,0,0,.92) ${140 + 560 * rev}px)` }} />
    <div style={ab(960, 520, { transform: "translate(-50%,-50%)", width: 1100 * rev + 1, height: 700 * rev + 1, borderRadius: 30, overflow: "hidden", opacity: rev, background: "repeating-radial-gradient(circle at 30% 40%, #4b4640 0 6px, #3e3a34 6px 11px), #45403a", filter: "contrast(1.1)" })} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, #0b0c0d 0 9px, transparent 10px) 0 0/48px 48px, linear-gradient(90deg,#6b7277,#c4cace 40%,#7e868c)`, WebkitMaskImage: `radial-gradient(circle at 960px 520px, transparent ${40 + 500 * rev}px, #000 ${44 + 520 * rev}px)`, maskImage: `radial-gradient(circle at 960px 520px, transparent ${40 + 500 * rev}px, #000 ${44 + 520 * rev}px)` } as React.CSSProperties} />
    <div style={ab(lerp(1900, 1080, k), lerp(900, 600, k), { width: 300, height: 90, borderRadius: 20, background: "linear-gradient(#3a3a3a,#111)", transform: "rotate(-32deg)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" })} />
    <Tag tt={tt} at={3.0} x={960} y={950} txt="TERCIOPELO" col={MZ} size={66} />
  </>;
}}</Stage>;

// 31 · resumen: siete fichas que se apilan como cartas en abanico
const Abanico: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#181b1f">{(tt) => {
  const it: string[] = q(h).items ?? ["Trapos blancos", "Desenchufa", "Filtro", "Ciclo caliente", "Cubeta", "Empaque", "Linterna"];
  return <>{it.map((s, i) => { const k = phys(tt, 0.3 + i * 0.35, 8, 0.45), ang = (i - 3) * 14.5 * cl(k);
    return <div key={i} style={ab(960, 1180, { width: 340, height: 480, marginLeft: -170, marginTop: -1000, transformOrigin: "170px 1000px", transform: `rotate(${ang * 1.15}deg) translateY(${(1 - cl(k)) * 700}px)`, opacity: cl(k * 4), borderRadius: 22, background: i % 2 ? "#f4efe3" : "#ffffff", boxShadow: "0 20px 40px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 26, gap: 6 })}>
      <div style={{ fontWeight: 900, fontSize: 96, color: BR, lineHeight: 1 }}>{i + 1}</div><div style={{ fontWeight: 900, fontSize: 34, color: TIN, textAlign: "center", padding: "0 18px" }}>{s}</div></div>; })}
    <Tag tt={tt} at={2.8} x={960} y={950} txt="7 PASOS" col={MZ} size={60} /></>;
}}</Stage>;

export const TEC: Record<string, C> = {
  balde3d: Balde3D, odometro: Odometro, rayosx: RayosX, perilla: Perilla, tazas: Tazas, estratos: Estratos, fibra: Fibra, expediente: Expediente,
  trapos: Trapos, carta: Carta, bandeja: Bandeja, choque: Choque, clavija: Clavija, hueco3d: Hueco3D, timer: Timer, filtro3d: Filtro3D,
  acordeon: Acordeon, tesoros: Tesoros, tumble: Tumble, bascula: Bascula, curva: Curva, ojobuey: OjoBuey, contrato: Contrato, fuelle3d: Fuelle3D,
  arena: Arena, calendario: Calendario, cruceta3d: Cruceta3D, frecuencia: Frecuencia, corte3d: Corte3D, linterna: Linterna, abanico: Abanico,
};

// 32 · marcador de 7 errores: placas que giran en un tablero tipo estación (flip) y se ponen rojas
const Marcador: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#121417">{(tt) => {
  const es: string[] = q(h).items ?? ["Todo en frío", "Suavizante doble", "Detergente de más", "Puerta cerrada", "Ropa mojada adentro", "Ropa con lodo", "Mezclar productos"];
  return <div style={ab(960, 540, { transform: "translate(-50%,-50%)", width: 1400, display: "flex", flexDirection: "column", gap: 14, perspective: 1600 })}>
    {es.map((s, i) => { const k = eio(tt, 0.3 + i * 0.45, 0.75 + i * 0.45);
      return <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, transformOrigin: "50% 0", transform: `rotateX(${(1 - k) * -90}deg)`, opacity: cl(k * 3) }}>
        <div style={{ width: 96, height: 96, borderRadius: 12, background: RED, color: "#fff", fontWeight: 900, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
        <div style={{ flex: 1, height: 96, borderRadius: 12, background: "linear-gradient(#262a2f 49%,#111 50%,#1d2024)", color: "#f4efe3", fontFamily: "monospace", fontWeight: 900, fontSize: 52, letterSpacing: 3, display: "flex", alignItems: "center", paddingLeft: 34, textTransform: "uppercase" }}>{s}</div>
      </div>; })}
  </div>;
}}</Stage>;

// 33 · puerta entreabierta: la puerta de la lavadora gira en 3D y el aire (flechas de humo) sale; cerrada se empaña
const Puerta3D: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#121b21" mesa={false}>{(tt) => {
  const ab_ = eio(tt, 1.2, 2.4), fog = 1 - ab_;
  const drops = Array.from({ length: 40 }, (_, i) => `radial-gradient(circle at ${10 + rnd(i) * 80}% ${10 + rnd(i + 3) * 80}%, rgba(255,255,255,${0.55 * fog}) 0 ${3 + rnd(i + 1) * 5}px, transparent ${5 + rnd(i + 1) * 5}px)`).join(",");
  return <>
    <div style={ab(500, 110, { width: 820, height: 880, borderRadius: 30, background: "linear-gradient(#f2f4f5,#c6ccd0)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", perspective: 1400 })}>
      <div style={ab(0, 0, { width: 820, height: 120, borderRadius: "30px 30px 0 0", background: "linear-gradient(#dfe3e6,#c3c9cd)", borderBottom: "4px solid #a9b0b5" })} />
      <div style={ab(40, 30, { width: 220, height: 60, borderRadius: 10, background: "linear-gradient(#e8ebed,#cfd5d8)", boxShadow: "inset 0 2px 4px rgba(0,0,0,.25)" })} />
      <div style={ab(640, 22, { width: 76, height: 76, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fdfdfd,#9aa1a7)", boxShadow: "0 4px 8px rgba(0,0,0,.3)" })} />
      <div style={ab(470, 44, { width: 120, height: 30, borderRadius: 6, background: "#1c2a33", color: "#7fe0a8", fontFamily: "monospace", fontSize: 24, textAlign: "center", lineHeight: "30px" })}>0:00</div>
      <div style={ab(140, 240, { width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle,#0f1418 0 40%,#2b333a 70%,#3d464d)" })} />
      <div style={ab(110, 210, { width: 600, height: 600, borderRadius: "50%", transformOrigin: "0 50%", transform: `rotateY(${-58 * ab_}deg)`, background: `${drops}, radial-gradient(circle, rgba(215,228,235,${0.18 + 0.6 * fog}) 0 60%, #8e979e 61% 72%, #e6eaec 73%)`, boxShadow: "0 20px 40px rgba(0,0,0,.4)" })} />
    </div>
    {ab_ > 0.3 && Array.from({ length: 7 }, (_, i) => { const p = ((tt - 1.6) * 0.5 + i / 7) % 1;
      return <div key={i} style={ab(1150 + p * 500, 360 + i * 70 + Math.sin(p * 6 + i) * 30, { width: 180, height: 34, borderRadius: 20, background: "rgba(200,235,255,.4)", filter: "blur(6px)", opacity: Math.sin(p * Math.PI) })} />; })}
    <Tag tt={tt} at={0.5} x={1560} y={220} txt={fog > 0.5 ? "SE EMPAÑA" : "ENTREABIERTA"} col={fog > 0.5 ? RED : VER} size={54} />
    <Tag tt={tt} at={2.6} x={1560} y={880} txt="QUE RESPIRE" col={MZ} size={58} />
  </>;
}}</Stage>;

// 34 · la regla de don Ernesto: una libreta vieja del taller con la frase escrita a mano, renglón por renglón
const Libreta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1f160e">{(tt) => {
  const ls: string[] = q(h).lines ?? ["La lavadora lava la ropa", "toda la semana.", "Un día al mes,", "alguien tiene que", "lavar a la lavadora."];
  return <div style={ab(960, 540, { transform: `translate(-50%,-50%) rotate(-3deg) translateY(${(1 - phys(tt, 0.1, 6, 0.6)) * 500}px)`, width: 1000, height: 760, background: "repeating-linear-gradient(#f3ead2 0 82px,#a9c2d8 82px 85px)", borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: "70px 80px 0 150px", fontFamily: HAND, color: "#22324a" })}>
    <div style={ab(110, 0, { width: 4, height: 760, background: "#d9827a" })} />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={ab(30, 80 + i * 115, { width: 40, height: 40, borderRadius: "50%", background: "#1f160e", boxShadow: "inset 0 4px 6px #000" })} />)}
    {ls.map((l, i) => { const k = cl((tt - 0.7 - i * 0.7) / 0.6);
      return <div key={i} style={{ fontSize: 64, fontWeight: 700, height: 85, lineHeight: "80px", whiteSpace: "nowrap", overflow: "hidden", width: `${k * 100}%` }}>{l}</div>; })}
    <div style={ab(560, 640, { fontSize: 50, fontWeight: 700, color: BR, opacity: e1(tt, 4.4) })}>— don Ernesto</div>
  </div>;
}}</Stage>;
Object.assign(TEC, { marcador: Marcador, puerta3d: Puerta3D, libreta: Libreta });
const ZM: Record<string, number> = {"clavija": 1.3, "timer": 1.3, "acordeon": 1.12, "tesoros": 1.25, "tumble": 1.35, "curva": 1.15, "ojobuey": 1.35, "contrato": 1.25, "odometro": 2.0, "perilla": 1.35, "estratos": 1.3, "fibra": 1.3, "expediente": 1.4, "trapos": 1.3, "carta": 1.2, "bandeja": 1.08, "rayosx": 1.2, "tazas": 1.4, "choque": 1.6, "filtro3d": 1.15, "bascula": 1.3, "fuelle3d": 1.4, "balde3d": 1.1};
for (const k of Object.keys(ZM)) { const Co = TEC[k]; TEC[k] = ({ t, h }) => <Co t={t} h={{ ...h, zoom: ZM[k] }} />; }
