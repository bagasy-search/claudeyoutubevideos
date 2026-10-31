// ACENTOS de los héroes de Walt (30-oct, evaluador walt29c v1: «foto + cartel = plantilla, el texto tapa el sujeto, el medio = la salida»).
// Cada héroe suma UN objeto dibujado por código que muestra la idea SOBRE el sujeto de la foto y sigue vivo hasta la salida.
// Coordenadas en % del cuadro (x 0-100, y 0-100); viven dentro del contenedor de la foto, así acompañan el empuje de cámara.
import React from "react";
import { Img } from "remotion";

const cl = (x: number) => Math.max(0, Math.min(1, x));
const phys = (t: number, a: number, w = 7, z = 0.42) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
const ease = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * (3 - 2 * c); };
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const PX = (x: number) => x * 19.2, PY = (y: number) => y * 10.8;
const RED = "#ff4b3a", AMB = "#ffc35a", WHT = "#fff7ea", GRN = "#5fe08f", FONT = "Inter, Helvetica, Arial, sans-serif";
const glow = (c: string, b = 10) => `drop-shadow(0 0 ${b}px ${c}) drop-shadow(0 4px 10px rgba(0,0,0,.55))`;

// trazo a mano: elipse levemente irregular que se dibuja
const handEllipse = (cx: number, cy: number, rx: number, ry: number, seed = 1) => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const a = (i / 40) * Math.PI * 2.12 - 0.4, j = 1 + 0.05 * Math.sin(a * 3 + seed) + 0.03 * Math.sin(a * 7 + seed * 2);
    pts.push(`${i ? "L" : "M"}${(cx + Math.cos(a) * rx * j).toFixed(1)} ${(cy + Math.sin(a) * ry * j).toFixed(1)}`);
  }
  return pts.join(" ");
};
const Draw: React.FC<{ d: string; p: number; col?: string; w?: number; len?: number; dash?: string; op?: number }> = ({ d, p, col = "#fff3d6", w = 9, len = 3000, dash, op = 1 }) =>
  <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op}
    strokeDasharray={dash ?? `${len}`} strokeDashoffset={dash ? undefined : len * (1 - cl(p))} style={{ filter: glow(col === RED ? "rgba(255,80,60,.55)" : "rgba(255,210,140,.45)") }} />;
const Label: React.FC<{ x: number; y: number; txt: string; s: number; col?: string; size?: number; rot?: number }> = ({ x, y, txt, s, col = WHT, size = 54, rot = -3 }) =>
  s <= 0.01 ? null : <div style={{ position: "absolute", left: Math.max(60 + size * txt.length * 0.36, Math.min(1860 - size * txt.length * 0.36, x)), top: Math.max(110, Math.min(980, y)), transform: `translate(-50%,-50%) translateY(${(1 - s) * -30}px) rotate(${rot}deg) scale(${0.85 + 0.15 * s})`, opacity: cl(s * 2),
    fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", letterSpacing: 1,
    textShadow: "0 2px 0 rgba(0,0,0,.55), 0 6px 22px rgba(0,0,0,.85), 0 0 2px rgba(0,0,0,.9)" }}>{txt}</div>;
const arrowHead = (x: number, y: number, ang: number, s = 34) =>
  `M${x - s * Math.cos(ang - 0.45)} ${y - s * Math.sin(ang - 0.45)} L${x} ${y} L${x - s * Math.cos(ang + 0.45)} ${y - s * Math.sin(ang + 0.45)}`;

export type Ac = { m: string; x: number; y: number; x2?: number; y2?: number; r?: number; lab?: string; lab2?: string; to?: number; pts?: any[]; z?: number; n?: number; dir?: number };

export const Accent: React.FC<{ tt: number; a0: number; dur: number; ac: Ac; ph: string }> = ({ tt, a0, dur, ac, ph }) => {
  const X = PX(ac.x), Y = PY(ac.y), X2 = PX(ac.x2 ?? ac.x), Y2 = PY(ac.y2 ?? ac.y), R = ac.r ?? 150, d = tt - a0, life = Math.max(1, dur - a0);
  const svg = (ch: React.ReactNode) => <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>{ch}</svg>;
  const s = phys(tt, a0 + 0.5, 6, 0.55);
  switch (ac.m) {
    case "ring": { // círculo a mano que se dibuja y respira; un segundo trazo lo repasa
      const p = ease(tt, a0, a0 + 0.8), p2 = ease(tt, a0 + 1.6, a0 + 2.6), pu = 1 + 0.03 * Math.sin(d * 3);
      return <>{svg(<g transform={`translate(${X} ${Y}) scale(${pu}) translate(${-X} ${-Y})`}><Draw d={handEllipse(X, Y, R * 1.25, R, 2)} p={p} len={R * 9} />
        <Draw d={handEllipse(X, Y, R * 1.32, R * 1.07, 5)} p={p2} len={R * 9} w={4} op={0.6} /></g>)}
        {ac.lab && <Label x={X} y={Y - R * 1.3 - 40 < 70 ? Y + R * 1.3 + 40 : Y - R * 1.3 - 40} txt={ac.lab} s={s} />}</>;
    }
    case "lens": { // lupa de vidrio que llega desde un costado y agranda el sujeto
      const z = ac.z ?? 2.4, k = phys(tt, a0, 4.5, 0.7), lx = X + (1 - k) * 520 + 14 * Math.sin(d * 0.9), ly = Y + (1 - k) * 240 + 10 * Math.sin(d * 0.7 + 1);
      if (k < 0.01) return null;
      return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", left: lx + R * 0.62, top: ly + R * 0.62, width: 46, height: R * 1.25, borderRadius: 23, background: "linear-gradient(90deg,#2b2117,#5b4430,#2b2117)", transform: "rotate(-45deg)", transformOrigin: "50% 0", boxShadow: "0 18px 30px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: lx - R, top: ly - R, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 16px #c9ccd2, 0 0 0 22px #6d7179, 0 30px 60px rgba(0,0,0,.6)" }}>
          <Img src={ph} style={{ position: "absolute", width: 1920 * z, height: 1080 * z, left: R - lx * z, top: R - ly * z, objectFit: "cover", filter: "contrast(1.12) saturate(1.1)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.35), transparent 38%), radial-gradient(circle at 50% 50%, transparent 62%, rgba(0,0,0,.35))" }} />
        </div>
        {ac.lab && <Label x={lx} y={ly + R + 70} txt={ac.lab} s={phys(tt, a0 + 0.9, 6, 0.55)} />}
      </div>;
    }
    case "arrowto": { // flecha curva de un punto a otro (de A a B) y aro en el destino
      const p = ease(tt, a0, a0 + 1.1), mx = (X + X2) / 2, my = Math.min(Y, Y2) - 170, ang = Math.atan2(Y2 - my, X2 - mx);
      const p3 = ease(tt, a0 + 1.0, a0 + 1.7);
      return <>{svg(<><Draw d={handEllipse(X, Y, 95, 62, 3)} p={ease(tt, a0 - 0.6, a0)} col={AMB} w={6} len={600} />
        <Draw d={`M${X} ${Y - 60} Q${mx} ${my} ${X2} ${Y2 - 50}`} p={p} col={WHT} w={8} len={1600} />
        {p > 0.97 && <path d={arrowHead(X2, Y2 - 50, ang)} fill="none" stroke={WHT} strokeWidth={8} strokeLinecap="round" />}
        <Draw d={handEllipse(X2, Y2, 120, 70, 6)} p={p3} len={700} /></>)}
        {ac.lab && <Label x={mx} y={my - 20} txt={ac.lab} s={phys(tt, a0 + 0.8, 6, 0.55)} col={AMB} />}</>;
    }
    case "lattice": { // la costra como enrejado: listones que se arman y una enredadera negra que trepa
      const p = ease(tt, a0, a0 + 1.2), g = cl((tt - a0 - 0.6) / (life - 0.8));
      const bars: React.ReactNode[] = [];
      for (let i = -3; i <= 3; i++) { const o = i * 90; bars.push(<Draw key={"a" + i} d={`M${X + o - 160} ${Y + 170} L${X + o + 160} ${Y - 170}`} p={p} col="#5a3d22" w={10} len={480} op={0.9} />);
        bars.push(<Draw key={"b" + i} d={`M${X + o + 160} ${Y + 170} L${X + o - 160} ${Y - 170}`} p={p} col="#5a3d22" w={10} len={480} op={0.9} />); }
      const vine: string[] = []; for (let i = 0; i <= 30; i++) { const k = i / 30; vine.push(`${i ? "L" : "M"}${X - 120 + 240 * k + 40 * Math.sin(k * 9)} ${Y + 200 - 400 * k}`); }
      return <>{svg(<><g opacity={0.9}>{bars}</g><Draw d={vine.join(" ")} p={g} col="#16120d" w={14} len={700} />
        {Array.from({ length: 8 }, (_, i) => { const k = (i + 1) / 9; if (g < k) return null; const vx = X - 120 + 240 * k + 40 * Math.sin(k * 9), vy = Y + 200 - 400 * k;
          return <ellipse key={i} cx={vx + (i % 2 ? 22 : -22)} cy={vy} rx={18 * cl((g - k) * 8)} ry={9 * cl((g - k) * 8)} fill="#1d1812" transform={`rotate(${i % 2 ? 30 : -30} ${vx} ${vy})`} />; })}</>)}
        {ac.lab && <Label x={X} y={Y - 250} txt={ac.lab} s={s} />}</>;
    }
    case "roots": { // raíces que bajan desde la junta, debajo de donde pasa la esponja
      const g = cl((tt - a0) / Math.min(3.2, life));
      const br: React.ReactNode[] = [];
      for (let i = 0; i < 9; i++) { const x0 = X - 600 + i * 150 + 30 * rnd(i), L = 160 + 120 * rnd(i + 9), pth: string[] = [];
        for (let j = 0; j <= 12; j++) { const k = j / 12; pth.push(`${j ? "L" : "M"}${x0 + 26 * Math.sin(k * 6 + i) * k} ${Y + L * k}`); }
        br.push(<Draw key={i} d={pth.join(" ")} p={g * (0.7 + 0.3 * rnd(i + 3))} col="#2a3a24" w={8 - (i % 3)} len={L + 80} />); }
      return <>{svg(<><line x1={X - 700} y1={Y} x2={X + 700} y2={Y} stroke="rgba(255,255,255,.35)" strokeWidth={3} strokeDasharray="10 12" />{br}
        </>)}
        {ac.lab && <Label x={X} y={Y + 300} txt={ac.lab} s={s} />}</>;
    }
    case "flow": { // migas de jabón y grasa que viajan solas hasta la junta y la van oscureciendo
      const n = 22, acc = cl((tt - a0) / life);
      return <>{svg(<>{Array.from({ length: n }, (_, i) => { const k = ((d * 0.45 + i / n) % 1), on = d > i * 0.08;
          if (!on || d < 0) return null; const mx = (X + X2) / 2, my = Math.min(Y, Y2) - 140;
          const px = (1 - k) * (1 - k) * X + 2 * (1 - k) * k * mx + k * k * X2, py = (1 - k) * (1 - k) * Y + 2 * (1 - k) * k * my + k * k * Y2;
          return <circle key={i} cx={px + 14 * Math.sin(i)} cy={py} r={7 + 5 * rnd(i)} fill={i % 3 ? "#f3e7c8" : "#c9a86b"} opacity={0.85 * Math.sin(k * Math.PI)} />; })}
        <ellipse cx={X2} cy={Y2} rx={40 + 110 * acc} ry={12 + 26 * acc} fill="#14110c" opacity={0.25 + 0.55 * acc} style={{ filter: "blur(6px)" }} /></>)}
        {ac.lab && <Label x={X2} y={Y2 - 160} txt={ac.lab} s={s} />}</>;
    }
    case "tally": { // tarjeta de papel donde se marcan los días uno por uno
      const k = phys(tt, a0 - 0.3, 5, 0.6), n = Math.min(ac.n ?? 7, Math.floor(cl((tt - a0) / Math.min(3.5, life * 0.8)) * ((ac.n ?? 7) + 0.99)));
      return <div style={{ position: "absolute", left: X - 230, top: Y - 150, width: 460, height: 300, transform: `translateY(${(1 - k) * 300}px) rotate(${-4 + 2 * Math.sin(d * 0.5)}deg)`, opacity: cl(k * 2),
        background: "#f6f0e2", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.55)", fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 30, top: 18, fontWeight: 800, fontSize: 30, color: "#7a6a52", letterSpacing: 3 }}>{ac.lab ?? "SCRUBBED"}</div>
        <svg width={460} height={300} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: n }, (_, i) => { const g = Math.floor(i / 5), j = i % 5;
          return j < 4 ? <line key={i} x1={60 + g * 200 + j * 34} y1={110} x2={66 + g * 200 + j * 34} y2={240} stroke="#2b2620" strokeWidth={9} strokeLinecap="round" />
            : <line key={i} x1={40 + g * 200} y1={220} x2={200 + g * 200} y2={120} stroke="#c7342a" strokeWidth={9} strokeLinecap="round" />; })}</svg>
        <div style={{ position: "absolute", right: 30, bottom: 18, fontWeight: 900, fontSize: 52, color: "#c7342a" }}>{n}</div>
      </div>;
    }
    case "spin": { // flechas que giran en círculos sobre el cepillo y chispas de sarro que se rompen
      const rot = d * 160, p = ease(tt, a0, a0 + 0.6);
      return <>{svg(<g opacity={p}><g transform={`rotate(${rot} ${X} ${Y})`}>{[0, 180].map(o => { const a1 = (o + 20) * Math.PI / 180, a2 = (o + 150) * Math.PI / 180;
          return <g key={o}><path d={`M${X + R * Math.cos(a1)} ${Y + R * 0.6 * Math.sin(a1)} A${R} ${R * 0.6} 0 0 1 ${X + R * Math.cos(a2)} ${Y + R * 0.6 * Math.sin(a2)}`} fill="none" stroke={AMB} strokeWidth={13} strokeLinecap="round" style={{ filter: glow("rgba(0,0,0,.6)") }} />
            <path d={arrowHead(X + R * Math.cos(a2), Y + R * 0.6 * Math.sin(a2), a2 + Math.PI / 2, 30)} fill="none" stroke={AMB} strokeWidth={13} strokeLinecap="round" /></g>; })}</g>
        {Array.from({ length: 16 }, (_, i) => { const k = ((d * 0.9 + rnd(i)) % 1), a = rnd(i + 4) * Math.PI * 2;
          return <rect key={i} x={X + Math.cos(a) * (40 + 260 * k)} y={Y + Math.sin(a) * (20 + 120 * k) + 160 * k * k} width={9} height={7} fill="#f0ead9" opacity={1 - k} transform={`rotate(${i * 40} ${X} ${Y})`} />; })}</g>)}
        {ac.lab && <Label x={X} y={Y - R - 40} txt={ac.lab} s={s} />}</>;
    }
    case "wiggle": { // flecha doble que se balancea como la mano que mueve la canilla
      const p = ease(tt, a0, a0 + 0.5), w = 14 * Math.sin(d * 5.2) * cl(d);
      return <>{svg(<g opacity={p} transform={`rotate(${w} ${X} ${Y + R})`}>
        <path d={`M${X - R} ${Y} A${R} ${R} 0 0 1 ${X + R} ${Y}`} fill="none" stroke={AMB} strokeWidth={10} strokeLinecap="round" style={{ filter: glow("rgba(255,195,90,.5)") }} />
        <path d={arrowHead(X - R, Y + 4, Math.PI / 2 + 0.4, 34)} fill="none" stroke={AMB} strokeWidth={10} strokeLinecap="round" />
        <path d={arrowHead(X + R, Y + 4, Math.PI / 2 - 0.4, 34)} fill="none" stroke={AMB} strokeWidth={10} strokeLinecap="round" /></g>)}
        {ac.lab && <Label x={X} y={Y - 90} txt={ac.lab} s={phys(tt, a0 + 1.4, 6, 0.5)} col={AMB} />}</>;
    }
    case "count": { // abanico de palitos que se abre desde el paquete mientras un contador corre hasta 100
      const to = ac.to ?? 100, k = ease(tt, a0, a0 + Math.min(2.6, life * 0.7)), n = 26;
      return <>{svg(<>{Array.from({ length: n }, (_, i) => { const a = (-150 + (120 * i) / (n - 1)) * Math.PI / 180 * k + (-90 * Math.PI / 180) * (1 - k), L = 330;
          return <line key={i} x1={X} y1={Y} x2={X + Math.cos(a) * L} y2={Y + Math.sin(a) * L} stroke="#e4c48e" strokeWidth={7} strokeLinecap="round" opacity={0.95} style={{ filter: "drop-shadow(0 3px 3px rgba(0,0,0,.35))" }} />; })}</>)}
        <div style={{ position: "absolute", left: X2, top: Y2, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: WHT, textShadow: "0 8px 30px rgba(0,0,0,.7)" }}>{Math.round(to * k)}</div></>;
    }
    case "clock": { // esfera de reloj que barre su tiempo, sector ámbar que se llena
      const k = cl((tt - a0) / Math.max(1, life - 0.6)), a = -Math.PI / 2 + k * Math.PI * 2, e = phys(tt, a0 - 0.4, 5, 0.6);
      const big = k > 0.5 ? 1 : 0, ex = X + R * 0.86 * Math.cos(a), ey = Y + R * 0.86 * Math.sin(a);
      return <>{svg(<g opacity={cl(e * 2)} transform={`translate(${X} ${Y}) scale(${0.6 + 0.4 * e}) translate(${-X} ${-Y})`}>
        <circle cx={X} cy={Y + 14} r={R + 18} fill="rgba(0,0,0,.4)" style={{ filter: "blur(12px)" }} />
        <circle cx={X} cy={Y} r={R + 14} fill="#2a2622" /><circle cx={X} cy={Y} r={R} fill="#f6f1e6" />
        {k >= 0.995 ? <circle cx={X} cy={Y} r={R * 0.86} fill="rgba(255,180,60,.55)" /> : k > 0.001 && <path d={`M${X} ${Y} L${X} ${Y - R * 0.86} A${R * 0.86} ${R * 0.86} 0 ${big} 1 ${ex} ${ey} Z`} fill="rgba(255,180,60,.55)" />}
        {Array.from({ length: 12 }, (_, i) => { const b = i * Math.PI / 6; return <line key={i} x1={X + Math.cos(b) * R * 0.8} y1={Y + Math.sin(b) * R * 0.8} x2={X + Math.cos(b) * R * 0.94} y2={Y + Math.sin(b) * R * 0.94} stroke="#2b2620" strokeWidth={i % 3 ? 4 : 8} />; })}
        <line x1={X} y1={Y} x2={X + R * 0.78 * Math.cos(a)} y2={Y + R * 0.78 * Math.sin(a)} stroke="#c7342a" strokeWidth={9} strokeLinecap="round" />
        <circle cx={X} cy={Y} r={14} fill="#2b2620" /></g>)}
        {ac.lab && <Label x={X} y={Y + R + 70} txt={ac.lab} s={s} />}</>;
    }
    case "orbit": { // un punto de luz da UNA vuelta a la base, como la toalla
      const rx = R * 1.3, ry = R * 0.45, k = ease(tt, a0 + 0.3, a0 + 2.3), a = -Math.PI / 2 + k * Math.PI * 2, p = ease(tt, a0, a0 + 0.5);
      return <>{svg(<g opacity={p}><ellipse cx={X} cy={Y} rx={rx} ry={ry} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={5} strokeDasharray="14 14" strokeDashoffset={-d * 40} />
        <Draw d={`M${X} ${Y - ry} A${rx} ${ry} 0 ${k > 0.5 ? 1 : 0} 1 ${X + rx * Math.cos(a)} ${Y + ry * Math.sin(a)}`} p={1} col={AMB} w={10} />
        <circle cx={X + rx * Math.cos(a)} cy={Y + ry * Math.sin(a)} r={16} fill={WHT} style={{ filter: glow("rgba(255,220,150,.9)", 16) }} /></g>)}
        <Label x={X} y={Y - ry - 90} txt={(2 * k).toFixed(1) + " s"} s={p} col={k >= 1 ? AMB : WHT} rot={0} size={84} /></>;
    }
    case "stamp": { // sello de goma que golpea la foto como una ficha vieja
      const k = phys(tt, a0, 9, 0.45);
      return k <= 0.01 ? null : <div style={{ position: "absolute", left: X, top: Y, transform: `translate(-50%,-50%) rotate(-9deg) scale(${2.2 - 1.2 * k})`, opacity: cl(k * 3) * 0.92,
        fontFamily: FONT, fontWeight: 900, fontSize: 118, color: "#d8322a", border: "12px solid #d8322a", borderRadius: 18, padding: "4px 30px", letterSpacing: 6,
        mixBlendMode: "multiply", textShadow: "0 0 1px #d8322a", WebkitMaskImage: "repeating-radial-gradient(circle at 30% 40%, #000 0 3px, rgba(0,0,0,.82) 3px 5px)" } as React.CSSProperties}>{ac.lab}</div>;
    }
    case "xcheck": { // X roja donde NO, tilde verde donde SÍ
      const p1 = ease(tt, a0, a0 + 0.5), p2 = ease(tt, a0 + 0.5, a0 + 0.8), p3 = ease(tt, a0 + 1.2, a0 + 1.8);
      return <>{svg(<><Draw d={`M${X - 70} ${Y - 70} L${X + 70} ${Y + 70}`} p={p1} w={16} len={210} /><Draw d={`M${X + 70} ${Y - 70} L${X - 70} ${Y + 70}`} p={p2} w={16} len={210} />
        <Draw d={handEllipse(X2, Y2, R * 1.2, R * 0.7, 4)} p={p3} col={GRN} w={9} len={R * 9} /></>)}
        {ac.lab && <Label x={X} y={Y + 130} txt={ac.lab} s={phys(tt, a0 + 0.6, 6, 0.55)} col={AMB} />}
        {ac.lab2 && <Label x={X2} y={Y2 - R * 0.7 - 60} txt={ac.lab2} s={phys(tt, a0 + 1.6, 6, 0.55)} col={GRN} />}</>;
    }
    case "squeeze": { // dos flechas marcan la rendija; por la rendija se escapa una línea de luz
      const k = ease(tt, a0, a0 + 0.8), gap = 1 + 0.5 * cl((tt - a0 - 1) / (life - 1)), fl = 0.6 + 0.4 * Math.sin(d * 9);
      return <>{svg(<><rect x={X - 380} y={Y - 5 * gap} width={760} height={10 * gap} rx={5} fill="#fff3cf" opacity={k * fl} style={{ filter: glow("rgba(255,230,160,.9)", 18) }} />
        {[-1, 1].map(sg => <g key={sg} opacity={k}><line x1={X} y1={Y + sg * (260 - 120 * k)} x2={X} y2={Y + sg * (40 + 8 * gap)} stroke={AMB} strokeWidth={10} strokeLinecap="round" />
          <path d={arrowHead(X, Y + sg * (40 + 8 * gap), sg > 0 ? -Math.PI / 2 : Math.PI / 2, 30)} fill="none" stroke={AMB} strokeWidth={10} strokeLinecap="round" /></g>)}</>)}
        {ac.lab && <Label x={X + 300} y={Y - 140} txt={ac.lab} s={s} col={AMB} />}</>;
    }
    case "fall": { // escamas blancas y motas negras que caen del aireador y se juntan abajo
      const n = 40;
      return <>{svg(<>{Array.from({ length: n }, (_, i) => { const st = i * 0.07; if (d < st) return null; const k = Math.min(1, (d - st) / 1.4), sx = X + (rnd(i) - 0.5) * R;
          const yy = Y + 380 * k * k, xx = sx + (rnd(i + 2) - 0.5) * 120 * k; const dark = i % 3 === 0;
          return <rect key={i} x={xx} y={yy} width={dark ? 13 : 24} height={dark ? 12 : 15} rx={2} fill={dark ? "#15120e" : "#f4efe2"} transform={`rotate(${rnd(i) * 360 + k * 220} ${xx} ${yy})`} opacity={0.95} />; })}</>)}
        {ac.lab && <Label x={X + R + 120} y={Y - 60} txt={ac.lab} s={s} />}</>;
    }
    case "rise": { // vapor que sube de la toalla mojada y se queda encerrado debajo
      return <>{svg(<>{Array.from({ length: 12 }, (_, i) => { const k = ((d * 0.35 + rnd(i)) % 1), xx = X + (rnd(i + 5) - 0.5) * R * 1.6 + 30 * Math.sin(k * 6 + i);
          return <ellipse key={i} cx={xx} cy={Y - 300 * k} rx={50 + 60 * k} ry={30 + 30 * k} fill="#fff" opacity={0.28 * Math.sin(k * Math.PI) * cl(d)} style={{ filter: "blur(14px)" }} />; })}
        <Draw d={`M${X - R} ${Y + 40} Q${X} ${Y - R * 0.8} ${X + R} ${Y + 40}`} p={ease(tt, a0, a0 + 1)} col={AMB} w={8} len={R * 4} dash="16 14" /></>)}
        {ac.lab && <Label x={X} y={Y - R - 80} txt={ac.lab} s={s} />}</>;
    }
    case "pins": { // alfileres que caen con peso sobre cada cosa, con su nombre
      return <>{(ac.pts ?? []).map((q: any, i: number) => { const k = phys(tt, a0 + i * 0.5, 7, 0.45), px = PX(q[0]), py = PY(q[1]);
        if (k <= 0.01) return null;
        return <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-100%) translateY(${(1 - k) * -260}px)`, opacity: cl(k * 3), textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 52, color: "#fff", background: q[3], borderRadius: 14, padding: "6px 22px", boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>{q[2]}</div>
          <div style={{ width: 6, height: 70, margin: "0 auto", background: "linear-gradient(#ddd,#888)" }} /><div style={{ width: 26, height: 10, margin: "-4px auto 0", borderRadius: "50%", background: "rgba(0,0,0,.45)", filter: "blur(3px)" }} /></div>; })}</>;
    }
    case "trace": { // una línea de luz recorre el camino (el chorro, el hilo) con una chispa en la punta
      const pts: number[][] = (ac.pts ?? []).map((q: number[]) => [PX(q[0]), PY(q[1])]); if (pts.length < 2) return null;
      const dd = pts.map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");
      let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      const k = ease(tt, a0, a0 + 1.4), sp = (d * 0.6) % 1; let rem = sp * L, sx = pts[0][0], sy = pts[0][1];
      for (let i = 1; i < pts.length; i++) { const sl = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (rem <= sl) { const f = rem / sl; sx = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f; sy = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f; break; } rem -= sl; }
      const e = pts[pts.length - 1];
      return <>{svg(<><Draw d={dd} p={k} col={AMB} w={8} len={L + 20} />{k >= 1 && <circle cx={sx} cy={sy} r={15} fill={WHT} style={{ filter: glow("rgba(255,220,150,.9)", 16) }} />}
</>)}
        {ac.lab && <Label x={e[0]} y={e[1] + 110} txt={ac.lab} s={phys(tt, a0 + 1.5, 6, 0.55)} />}</>;
    }
    case "ruler": { // regla amarilla que se apoya al lado del hilo y marca su largo
      const k = phys(tt, a0, 5.5, 0.55), ang = Math.atan2(Y2 - Y, X2 - X) * 180 / Math.PI, L = Math.hypot(X2 - X, Y2 - Y), m = ease(tt, a0 + 0.6, a0 + 1.8);
      return <div style={{ position: "absolute", left: X, top: Y, transformOrigin: "0 0", transform: `rotate(${ang}deg) translateY(${70 + (1 - k) * 200}px)`, opacity: cl(k * 2) }}>
        <div style={{ position: "relative", width: L, height: 64, background: "linear-gradient(#ffd85a,#e8b52c)", borderRadius: 6, boxShadow: "0 16px 30px rgba(0,0,0,.45)" }}>
          {Array.from({ length: Math.floor(L / 24) }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 24, top: 0, width: 3, height: i % 4 ? 18 : 34, background: "#3a2c10" }} />)}
          <div style={{ position: "absolute", left: 0, top: 40, width: L * m, height: 8, background: "#c7342a", borderRadius: 4 }} />
        </div>
        {ac.lab && <div style={{ position: "absolute", left: L * m, top: 74, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 50, color: WHT, textShadow: "0 4px 14px rgba(0,0,0,.8)", opacity: m }}>{ac.lab}</div>}
      </div>;
    }
    case "drops": { // la gota se forma, cae y salpica, una y otra vez
      return <>{svg(<>{[0, 1, 2].map(i => { const k = ((d * 0.7 + i / 3) % 1), grow = cl(k / 0.45), fallK = cl((k - 0.45) / 0.35), yy = Y + (Y2 - Y) * fallK * fallK;
          return <g key={i}>{k < 0.8 && <ellipse cx={X} cy={yy + 10 * grow} rx={9 + 5 * grow} ry={12 + 8 * grow} fill="rgba(220,240,255,.9)" stroke="rgba(255,255,255,.9)" strokeWidth={2} />}
            {k >= 0.8 && <ellipse cx={X} cy={Y2 + 10} rx={20 + 120 * (k - 0.8) * 5} ry={6 + 26 * (k - 0.8) * 5} fill="none" stroke="rgba(230,245,255,.8)" strokeWidth={4} opacity={1 - (k - 0.8) * 5} />}</g>; })}</>)}
        {ac.lab && <Label x={X + 230} y={Y + 60} txt={ac.lab} s={s} />}</>;
    }
    case "bubbles": { // burbujas que suben y revientan en el desborde / la junta
      return <>{svg(<>{Array.from({ length: 26 }, (_, i) => { const k = ((d * 0.5 + rnd(i)) % 1), xx = X + (rnd(i + 1) - 0.5) * R * 2 + 14 * Math.sin(k * 8 + i), r = 6 + 14 * rnd(i + 7);
          return <circle key={i} cx={xx} cy={Y - 220 * k} r={r * (0.6 + 0.4 * k)} fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.85)" strokeWidth={2.5} opacity={cl(d * 2) * (k > 0.9 ? (1 - k) * 10 : 1)} />; })}</>)}
        {ac.lab && <Label x={X} y={Y + 120} txt={ac.lab} s={s} />}</>;
    }
    case "thirds": { // tres capas numeradas, una por vez, al costado de la toalla doblada
      return <>{[0, 1, 2].map(i => { const k = phys(tt, a0 + i * 0.45, 7, 0.5), yy = Y + (i - 1) * (R * 0.42);
        return k <= 0.01 ? null : <div key={i} style={{ position: "absolute", left: X2, top: yy, transform: `translate(${(1 - k) * 140}px,-50%)`, opacity: cl(k * 2), display: "flex", alignItems: "center", gap: 18, fontFamily: FONT }}>
          <div style={{ width: 120 * k, height: 6, background: AMB, borderRadius: 3 }} /><div style={{ width: 74, height: 74, borderRadius: "50%", background: AMB, color: "#2b2010", fontWeight: 900, fontSize: 46, display: "grid", placeItems: "center", boxShadow: "0 10px 24px rgba(0,0,0,.5)" }}>{i + 1}</div></div>; })}</>;
    }
    case "caliper": { // calibre que se cierra sobre el reborde: casi no se ve, pero está
      const k = ease(tt, a0, a0 + 1.2), w = R * (1.8 - 1.4 * k);
      return <>{svg(<g style={{ filter: glow("rgba(255,210,140,.5)") }}><line x1={X - w} y1={Y - 120} x2={X - w} y2={Y + 40} stroke={WHT} strokeWidth={8} /><line x1={X + w} y1={Y - 120} x2={X + w} y2={Y + 40} stroke={WHT} strokeWidth={8} />
        <line x1={X - w - 60} y1={Y - 120} x2={X + w + 60} y2={Y - 120} stroke={WHT} strokeWidth={12} strokeLinecap="round" />
        <path d={arrowHead(X - w, Y - 40, 0, 26)} fill="none" stroke={AMB} strokeWidth={8} /><path d={arrowHead(X + w, Y - 40, Math.PI, 26)} fill="none" stroke={AMB} strokeWidth={8} /></g>)}
        {ac.lab && <Label x={X} y={Y - 210} txt={ac.lab} s={phys(tt, a0 + 1.1, 6, 0.55)} col={AMB} />}</>;
    }
    case "ripple": { // ondas que salen de un punto: «acá hay otra junta»
      return <>{svg(<>{[0, 1, 2].map(i => { const k = ((d * 0.6 + i / 3) % 1); return <ellipse key={i} cx={X} cy={Y} rx={R * (0.4 + 1.6 * k)} ry={R * 0.45 * (0.4 + 1.6 * k)} fill="none" stroke={AMB} strokeWidth={6} opacity={(1 - k) * cl(d * 2)} />; })}</>)}
        {ac.lab && <Label x={X} y={Y - R * 0.9 - 40} txt={ac.lab} s={s} col={AMB} />}</>;
    }
    case "soak": { // el vinagre empapa hacia abajo: una mancha húmeda que baja hasta la junta y brilla
      const k = ease(tt, a0, a0 + Math.min(3, life * 0.8)), sh = 0.5 + 0.5 * Math.sin(d * 4);
      return <>{svg(<><defs><linearGradient id="soakg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(120,190,255,.0)" /><stop offset=".5" stopColor="rgba(120,190,255,.38)" /><stop offset="1" stopColor="rgba(160,215,255,.6)" /></linearGradient></defs>
        <rect x={X - R} y={Y - R * 0.9} width={R * 2} height={R * 1.9 * k} rx={60} fill="url(#soakg)" style={{ mixBlendMode: "screen", filter: "blur(14px)" }} />
        <ellipse cx={X} cy={Y - R * 0.9 + R * 1.9 * k} rx={R * 1.05} ry={22} fill="none" stroke={`rgba(200,235,255,${0.5 + 0.4 * sh})`} strokeWidth={6} opacity={k} />
        {Array.from({ length: 6 }, (_, i) => { const q = ((d * 0.8 + i / 6) % 1); return <circle key={i} cx={X - R * 0.8 + (i * R * 1.6) / 5} cy={Y - R * 0.9 + R * 1.9 * k + 30 * q} r={7} fill="rgba(210,240,255,.9)" opacity={(1 - q) * k} />; })}</>)}
        {ac.lab && <Label x={X} y={Y - R - 60} txt={ac.lab} s={s} />}</>;
    }
    case "grains": { // granos de arena mojada que se desprenden al frotar
      return <>{svg(<>{Array.from({ length: 34 }, (_, i) => { const k = ((d * 0.8 + rnd(i)) % 1), a = rnd(i + 3) * Math.PI * 2, rr = 30 + R * 1.4 * k;
          return <circle key={i} cx={X + Math.cos(a) * rr} cy={Y + Math.sin(a) * rr * 0.6 + 120 * k * k} r={3 + 4 * rnd(i + 8)} fill="#e8ddc6" opacity={(1 - k) * cl(d * 2)} />; })}</>)}
        {ac.lab && <Label x={X} y={Y - R - 40} txt={ac.lab} s={s} />}</>;
    }
    case "pull": { // cheurones que corren a lo largo del hilo: lo estás sacando entero
      const ang = Math.atan2(Y2 - Y, X2 - X), L = Math.hypot(X2 - X, Y2 - Y);
      return <>{svg(<>{Array.from({ length: 5 }, (_, i) => { const k = ((d * 0.8 + i / 5) % 1), px = X + Math.cos(ang) * L * k, py = Y + Math.sin(ang) * L * k;
          return <path key={i} d={arrowHead(px + Math.cos(ang + Math.PI / 2) * 70, py + Math.sin(ang + Math.PI / 2) * 70, ang, 34)} fill="none" stroke={AMB} strokeWidth={9} strokeLinecap="round" opacity={Math.sin(k * Math.PI) * cl(d * 2)} />; })}
        <Draw d={handEllipse(X, Y, 90, 70, 9)} p={ease(tt, a0, a0 + 0.7)} len={600} /></>)}
        {ac.lab && <Label x={X2 + 60} y={Y2 + 80} txt={ac.lab} s={s} />}</>;
    }
  }
  return null;
};
