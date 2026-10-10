// Kit COCINA (Claudio Cocina, rama ccfrijoles-render y sus hijas).
//   ClBeanCut   corte de un frijol pinto durante la hora de reposo: arrugado y chiquito (centro seco, harinoso) → el agua entra por el
//               ojito blanco y desde la cáscara hasta el centro, el frijol se hincha y la cáscara se estira lisita. Reloj de 1 hora al costado.
//               `at` = [s] de las 3 frases (al principio / en la hora de reposo / cáscara lisita) para sincronizar con la voz.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, SERIF, LABEL, HAND, hexA, rnd } from "./ClTheme";
import { Bed, Card, Tape, lin, pop, useOut } from "./ClParts";

// contorno de frijol (riñón): elipse con la panza hundida del lado del ojito; `wr` = arrugas (0 = lisito)
const beanPath = (cx: number, cy: number, s: number, wr: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * Math.PI * 2;
    let x = Math.cos(t) * 320, y = Math.sin(t) * 165;
    const dent = Math.exp(-Math.pow((t - Math.PI * 1.5) / 0.75, 2)) * 38;   // panza (arriba) hundida, suave
    y += dent;
    const w = wr * (Math.sin(t * 9 + 0.7) * 9 + Math.sin(t * 23 + 2.1) * 5 + Math.sin(t * 5) * 6);
    const n = Math.hypot(Math.cos(t) * 165, Math.sin(t) * 320) || 1;
    x += (Math.cos(t) * 185 / n) * w; y += (Math.sin(t) * 300 / n) * w;
    pts.push(`${(cx + x * s).toFixed(1)},${(cy + y * s).toFixed(1)}`);
  }
  return "M " + pts.join(" L ") + " Z";
};

export const ClBeanCut: React.FC<{ at?: [number, number, number]; bed?: string }> = ({ at = [1.2, 4.6, 9.0], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const [t1, t2, t3] = at.map((s) => Math.round(s * fps));
  // k = avance del reposo (0 seco → 1 hidratado), corre de "en la hora de reposo" a "lisita"
  const k = interpolate(f, [t2, t3 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const s = 0.82 + 0.2 * k, wr = 1 - ease2(k), cx = 700, cy = 560;
  const outline = beanPath(cx, cy, s, wr);
  const front = 14 + k * 160;                  // banda hidratada desde la cáscara hacia el centro (ancho del trazo / 2)
  const hil = 30 + k * 260;                // el ojito: por ahí entra primero
  const hx = cx, hy = cy - 128 * s;
  const l1 = lin(f, t1, t1 + 12), l2 = lin(f, t2, t2 + 12), l3 = lin(f, t3, t3 + 12);
  const clock = lin(f, t2, t3 + 10);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={41} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "-0.6deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>EL FRIJOL, POR DENTRO</div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <clipPath id="bc_in"><path d={outline} /></clipPath>
              <pattern id="bc_dry" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#F7F1E3" /><circle cx="4" cy="5" r="1.6" fill="#DCCDB0" /><circle cx="11" cy="11" r="1.2" fill="#E2D5BB" /></pattern>
            </defs>
            <ellipse cx={cx} cy={cy + 230 * s} rx={300 * s} ry={26} fill="rgba(0,0,0,0.10)" />
            <g clipPath="url(#bc_in)">
              {/* centro seco, harinoso */}
              <rect x={0} y={0} width={1680} height={940} fill="url(#bc_dry)" />
              {/* agua que entra desde la cáscara */}
              <path d={outline} fill="none" stroke="#C99B62" strokeWidth={front * 2} strokeLinejoin="round" />
              <path d={outline} fill="none" stroke={hexA("#7FB2D9", 0.22)} strokeWidth={front * 2} strokeLinejoin="round" />
              {/* y por el ojito, primero */}
              <circle cx={hx} cy={hy} r={hil} fill="#C99B62" />
              <circle cx={hx} cy={hy} r={hil} fill={hexA("#7FB2D9", 0.22)} />
            </g>
            {/* cáscara pinta: borde grueso con pintitas */}
            <path d={outline} fill="none" stroke="#B88A5E" strokeWidth={22 - 6 * k} strokeLinejoin="round" />
            <g clipPath="url(#bc_in)">
              {Array.from({ length: 70 }, (_, i) => { const a = rnd(i) * Math.PI * 2; const x = cx + Math.cos(a) * 320 * s, y = cy + Math.sin(a) * 165 * s + (Math.sin(a) < 0 ? Math.exp(-Math.pow((a - Math.PI * 1.5) / 0.75, 2)) * 38 * s : 0); return <ellipse key={i} cx={x} cy={y} rx={10 + rnd(i + 9) * 10} ry={5 + rnd(i + 4) * 5} fill="#6E3F22" opacity={0.75} transform={`rotate(${rnd(i + 2) * 180} ${x} ${y})`} />; })}
            </g>
            {/* el ojito blanco */}
            <ellipse cx={hx} cy={hy - 2} rx={34 * s} ry={13 * s} fill="#FBF6EA" stroke="#CDBB98" strokeWidth={3} />
            {/* gotitas que entran por el ojito */}
            {k > 0 && k < 0.95 ? Array.from({ length: 4 }, (_, i) => { const ph = ((f + i * 9) % 36) / 36; return <circle key={i} cx={hx + (i - 1.5) * 10} cy={hy - 130 + ph * 140} r={9 - ph * 4} fill={hexA("#4F8FC4", 0.85 * (1 - ph))} />; }) : null}
          </svg>
          {/* rótulos a mano */}
          <div style={{ position: "absolute", left: 1150, top: 230, opacity: l1 * (1 - l2 * 0.65), translate: `${(1 - l1) * 40}px 0` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: CL.inkSoft }}>AL PRINCIPIO</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CL.ink, lineHeight: 1.05 }}>arrugado<br />y chiquito</div>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 470, opacity: l2, translate: `${(1 - l2) * 40}px 0` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: CL.navy }}>LA HORA DE REPOSO</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: CL.navy, lineHeight: 1.05 }}>agua hasta el centro,<br />sin cocerse todavía</div>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 720, opacity: l3, translate: `${(1 - l3) * 40}px 0` }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CL.nitrile }}>la cáscara, lisita</div>
          </div>
          {/* reloj de la hora */}
          <svg width={170} height={170} viewBox="0 0 170 170" style={{ position: "absolute", left: 60, top: 720, opacity: l2 }}>
            <circle cx={85} cy={85} r={74} fill={CL.white} stroke={CL.navy} strokeWidth={8} />
            <path d={`M 85 85 L 85 19 A 66 66 0 ${clock > 0.5 ? 1 : 0} 1 ${85 + 66 * Math.sin(clock * 2 * Math.PI - 1e-4)} ${85 - 66 * Math.cos(clock * 2 * Math.PI - 1e-4)} Z`} fill={hexA(CL.nitrile, 0.75)} />
            <circle cx={85} cy={85} r={7} fill={CL.navy} />
          </svg>
          <div style={{ position: "absolute", left: 250, top: 770, opacity: l2, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>{Math.round(clock * 60)} min</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
const ease2 = (x: number) => x * x * (3 - 2 * x);

// ClRecipeCard: la ficha de receta de la fonda (cartulina con cinta sobre la toma): título, renglones "ingrediente ····· cantidad"
//               que se escriben uno por uno, una nota a mano en rojo (`mark`) y un sello abajo (`note`). Entran hasta 8 renglones.
export const ClRecipeCard: React.FC<{ title: string; rows: { k: string; v: string }[]; mark?: string; note?: string; bed?: string }> = ({ title, rows, mark, note, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const per = Math.max(8, Math.round((T * 0.55) / rows.length));
  const rh = Math.min(84, 560 / rows.length);
  const tm = 14 + rows.length * per;
  const ch = Math.min(930, 200 + rows.length * rh + (mark ? 130 : 50)), top = Math.round((1080 - ch) / 2);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={53} dim={0.3} />
      <div style={{ position: "absolute", left: 470, top, width: 980, height: ch, rotate: `${-1.4 + (1 - p) * 4}deg`, translate: `0 ${(1 - p) * 120}px` }}>
        <Card style={{ width: 980, height: ch, padding: 0, background: "#FFFCF3" }}>
          <div style={{ position: "absolute", left: 70, top: 60, right: 70, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CL.ink, lineHeight: 1 }}>{title}</div>
          <div style={{ position: "absolute", left: 70, right: 70, top: 160, height: 4, background: CL.nitrile, opacity: 0.85 }} />
          {rows.map((r, i) => {
            const k = lin(f, 14 + i * per, 14 + i * per + per * 0.8);
            return (
              <div key={i} style={{ position: "absolute", left: 70, right: 70, top: 200 + i * rh, height: rh, display: "flex", alignItems: "center", gap: 18, opacity: k, translate: `${(1 - k) * 24}px 0` }}>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(60, rh * 0.72), color: "#1F3A8A", whiteSpace: "nowrap" }}>{r.k}</div>
                <div style={{ flex: 1, borderBottom: "4px dotted #C9BBA0", translate: "0 14px" }} />
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(60, rh * 0.72), color: "#1F3A8A", whiteSpace: "nowrap" }}>{r.v}</div>
              </div>
            );
          })}
          {mark ? <div style={{ position: "absolute", left: 90, top: 200 + rows.length * rh + 18, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.red, rotate: "-3deg", opacity: lin(f, tm, tm + 10) }}>{mark}</div> : null}
        </Card>
        <Tape x={430} y={-28} rot={-4} w={160} />
      </div>
      {note ? <div style={{ position: "absolute", right: 150, bottom: 110, opacity: lin(f, tm + 6, tm + 16), rotate: "-6deg", border: `6px solid ${CL.red}`, color: CL.red, fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 4, padding: "8px 28px", borderRadius: 10, textTransform: "uppercase", background: "rgba(255,252,243,0.9)" }}>{note}</div> : null}
    </AbsoluteFill>
  );
};

// ClRibCut: corte de una costilla de cerdo (de lado): el hueso al centro y la carne arriba y abajo, cruzada por hebras blancas de
//           tejido. Fuego fuerte → las hebras se encogen y la carne suelta jugo (se aprieta). Calor bajito, húmedo y con tiempo →
//           las hebras se derriten en gelatina ámbar brillosa, la carne se afloja y al final se separa del hueso.
//           `at` = [s] de las 4 frases (fuego fuerte / calor bajito / gelatina / se suelta del hueso).
export const ClRibCut: React.FC<{ at?: [number, number, number, number]; bed?: string }> = ({ at = [0.4, 4.6, 8.2, 12.2], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const [t1, t2, t3, t4] = at.map((s) => Math.round(s * fps));
  const hot = lin(f, t1, t1 + 30) * (1 - lin(f, t2, t2 + 40));          // se aprieta y vuelve
  const melt = ease2(lin(f, t2 + 10, t3 + 40));                          // hebras → gelatina
  const free = ease2(lin(f, t4, t4 + 40));                               // se suelta del hueso
  const cx = 640, cy = 500, L = 900;
  const squeeze = 1 - 0.12 * hot + 0.04 * melt;                          // la carne se encoge con el fuego fuerte
  const gap = free * 26;
  const meat = (top: boolean) => {
    const h = 150 * squeeze, y0 = top ? cy - 42 - gap - h : cy + 42 + gap;
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) { const x = cx - L / 2 + (L * i) / 60; const r = Math.sin(i * 0.9 + (top ? 0 : 2)) * 7 + Math.sin(i * 0.37) * 9; pts.push(`${x.toFixed(1)},${(top ? y0 - r : y0 + h + r).toFixed(1)}`); }
    const edge = top ? `${cx + L / 2},${y0 + h} ${cx - L / 2},${y0 + h}` : `${cx + L / 2},${y0} ${cx - L / 2},${y0}`;
    return { d: `M ${pts.join(" L ")} L ${edge} Z`, y0, h };
  };
  const A = meat(true), B = meat(false);
  // hebras de tejido: ondas blancas; con fuego se rizan (amplitud ↑, más cortas), con calor bajito se derriten
  const strands = (m: { y0: number; h: number }, seed: number) => Array.from({ length: 6 }, (_, j) => {
    const y = m.y0 + m.h * (0.16 + j * 0.14), amp = 5 + 7 * hot + rnd(seed + j) * 4, wl = 70 - 14 * hot;
    const x0 = cx - L / 2 + 30 + rnd(seed + j * 3) * 60 + 40 * hot, x1 = cx + L / 2 - 30 - rnd(seed + j * 5) * 60 - 40 * hot;
    const pts: string[] = []; for (let x = x0; x <= x1; x += 8) pts.push(`${x.toFixed(1)},${(y + Math.sin((x + seed * 40) / wl * Math.PI * 2) * amp).toFixed(1)}`);
    return <polyline key={j} points={pts.join(" ")} fill="none" stroke={hexA("#FBF4EA", 0.95 * (1 - melt))} strokeWidth={7 - 2 * melt} strokeLinecap="round" />;
  });
  // gelatina: las hebras se vuelven vetas ámbar brillosas, irregulares, que se corren un poco (no franjas parejas)
  const glaze = (m: { y0: number; h: number }, seed: number) => Array.from({ length: 6 }, (_, j) => {
    const y = m.y0 + m.h * (0.16 + j * 0.14), pts: string[] = [];
    for (let x = cx - L / 2 + 40; x <= cx + L / 2 - 40; x += 10) pts.push(`${x.toFixed(1)},${(y + Math.sin((x + seed * 40) / 70 * Math.PI * 2) * 5 + Math.sin(x / 23 + j) * 3).toFixed(1)}`);
    return <g key={j}><polyline points={pts.join(" ")} fill="none" stroke={hexA("#E0A84A", 0.55 * melt)} strokeWidth={4 + 5 * melt + rnd(seed + j) * 3} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts.join(" ")} fill="none" stroke={hexA("#FFF3D2", 0.55 * melt)} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="40 70" strokeDashoffset={-f * 0.6 - j * 30} /></g>;
  });
  const l1 = lin(f, t1, t1 + 12), l2 = lin(f, t2, t2 + 12), l3 = lin(f, t3, t3 + 12), l4 = lin(f, t4, t4 + 12);
  const meatCol = hot > 0.01 ? `rgb(${Math.round(176 - 30 * hot)},${Math.round(92 - 6 * hot)},${Math.round(78 - 4 * hot)})` : "#B05C4E";
  const drops = hot > 0.15 ? Array.from({ length: 7 }, (_, i) => { const ph = ((f + i * 11) % 40) / 40; const x = cx - L / 2 + 60 + i * 130; return <circle key={i} cx={x} cy={B.y0 + B.h + 20 + ph * 120} r={9 - ph * 4} fill={hexA("#C9772E", 0.85 * (1 - ph) * hot)} />; }) : null;
  const steam = l2 * (1 - l4 * 0.5);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={43} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "0.5deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>LA COSTILLA, POR DENTRO</div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            <ellipse cx={cx} cy={B.y0 + B.h + 40} rx={L / 2} ry={22} fill="rgba(0,0,0,0.10)" />
            {[A, B].map((m, k) => (
              <g key={k}>
                <path d={m.d} fill={meatCol} stroke="#7A3A2E" strokeWidth={5} strokeLinejoin="round" />
                {glaze(m, k * 20 + 3)}
                {strands(m, k * 20 + 3)}
                {melt > 0.3 ? <path d={m.d} fill="none" stroke={hexA("#FFF6DD", 0.35 * melt)} strokeWidth={4} /> : null}
              </g>
            ))}
            {/* el hueso */}
            <rect x={cx - L / 2 - 40 - free * 30} y={cy - 40} width={L + 80} height={80} rx={40} fill="#EFE3C8" stroke="#BFA97E" strokeWidth={5} />
            <rect x={cx - L / 2 - 10 - free * 30} y={cy - 14} width={L + 20} height={28} rx={14} fill="#E2CFA6" opacity={0.6} />
            {drops}
            {/* llama: grande con fuego fuerte, chiquita con calor bajito */}
            {[0, 1, 2].map((i) => { const big = hot, small = l2 * (1 - hot); const s = 0.5 + 1.1 * big + 0.45 * small; const fl = 1 + Math.sin((f + i * 7) / 3) * 0.08; return (l1 > 0 ? <path key={i} d={`M ${cx - 90 + i * 90} 905 q ${-28 * s} ${-40 * s * fl} 0 ${-90 * s * fl} q ${28 * s} ${50 * s * fl} 0 ${90 * s * fl} Z`} fill={big > small ? "#E8632B" : "#4E86C9"} opacity={0.85 * Math.max(big, small, l1 * 0.3)} /> : null); })}
            {/* vapor (húmedo) */}
            {steam > 0 ? Array.from({ length: 5 }, (_, i) => { const ph = ((f + i * 13) % 60) / 60; const x = cx - 360 + i * 180; return <path key={i} d={`M ${x} ${A.y0 - 20 - ph * 110} q 18 -20 0 -40 q -18 -20 0 -40`} fill="none" stroke={hexA("#8FA6BF", 0.6 * (1 - ph) * steam)} strokeWidth={6} strokeLinecap="round" />; }) : null}
          </svg>
          {/* rótulos a mano */}
          <div style={{ position: "absolute", left: 1170, top: 170, opacity: l1 * (1 - l2 * 0.7), translate: `${(1 - l1) * 40}px 0` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: "#C2481E" }}>FUEGO FUERTE</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.ink, lineHeight: 1.05 }}>el tejido<br />se aprieta</div>
          </div>
          <div style={{ position: "absolute", left: 1170, top: 380, opacity: l2, translate: `${(1 - l2) * 40}px 0` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: CL.navy }}>BAJITO, HÚMEDO<br />Y CON TIEMPO</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.navy, lineHeight: 1.05, opacity: 0.35 + 0.65 * l3 }}>se vuelve<br />gelatina</div>
          </div>
          <div style={{ position: "absolute", left: 1170, top: 700, opacity: l4, translate: `${(1 - l4) * 40}px 0` }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CL.nitrile }}>y se suelta del hueso</div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ClGreenClock: el "reloj del verde" del ejote. Siete trozos de ejote grandes que cambian de color con el tiempo de cocción:
//               crudo verde claro mate → minuto 2 más verde → minuto 4 verde brillante (la VENTANA: ahí se destapa) → minuto 8 se
//               apaga → minuto 12 verde olivo grisáceo, blando (se dobla). Debajo, la regla de 0 a 12 minutos con la ventana marcada.
//               `at` = [s] de las 4 frases (minuto dos / minuto cuatro / minuto ocho / minuto doce).
const GC = [[0, "#A9C77A"], [2, "#79B84E"], [4, "#3E9F36"], [8, "#6E923F"], [12, "#80834F"]] as [number, string][];
const mixHex = (a: string, b: string, t: number) => { const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16); return "#" + [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * t).toString(16).padStart(2, "0")).join(""); };
const greenAt = (m: number) => { for (let i = 1; i < GC.length; i++) if (m <= GC[i][0]) return mixHex(GC[i - 1][1], GC[i][1], (m - GC[i - 1][0]) / (GC[i][0] - GC[i - 1][0])); return GC[GC.length - 1][1]; };
export const ClGreenClock: React.FC<{ at?: [number, number, number, number]; bed?: string }> = ({ at = [1.0, 5.0, 10.0, 13.5], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const T = at.map((s) => Math.round(s * fps));
  const m = interpolate(f, [0, T[0], T[1], T[2], T[3]], [0, 2, 4, 8, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const col = greenAt(m);
  const shine = interpolate(m, [1.5, 4, 6.5], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const limp = interpolate(m, [6, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });   // blando: se dobla
  const X0 = 170, X1 = 1510, xm = (mm: number) => X0 + ((X1 - X0) * mm) / 12;
  const L = [lin(f, T[0], T[0] + 12), lin(f, T[1], T[1] + 12), lin(f, T[2], T[2] + 12), lin(f, T[3], T[3] + 12)];
  const stage = m < 3 ? 0 : m < 6 ? 1 : m < 10 ? 2 : 3;
  const labels = [["MINUTO 2", "más verde que crudo", CL.ink], ["MINUTO 4", "verde brillante: ¡destapa!", "#2F7D2A"], ["MINUTO 8", "empieza a apagarse", CL.inkSoft], ["MINUTO 12", "verde olivo, el de la olla", "#6B6A3A"]] as [string, string, string][];
  const bean = (i: number) => {
    const cx = 250 + i * 197, cy = 330 + (rnd(i + 3) - 0.5) * 40, len = 150 + rnd(i) * 30, rot = (rnd(i + 7) - 0.5) * 24;
    const sag = 10 + limp * 55;                                   // curvatura: tieso → se dobla
    const d = `M ${-len} 0 Q 0 ${sag} ${len} 0`;
    return (
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
        <path d={d} transform="translate(6 14)" fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth={62} strokeLinecap="round" />
        <path d={d} fill="none" stroke={mixHex(col, "#22351A", 0.25)} strokeWidth={64} strokeLinecap="round" />
        <path d={d} fill="none" stroke={col} strokeWidth={56} strokeLinecap="round" />
        <path d={`M ${-len + 14} -10 Q 0 ${sag - 12} ${len - 14} -10`} fill="none" stroke={hexA("#FFFFFF", 0.12 + 0.38 * shine)} strokeWidth={9} strokeLinecap="round" />
        <path d={`M ${-len + 10} 13 Q 0 ${sag + 12} ${len - 10} 13`} fill="none" stroke={hexA("#1F3315", 0.22)} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 16" />
      </g>
    );
  };
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={47} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "-0.5deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>EL RELOJ DEL VERDE</div>
          <div style={{ position: "absolute", right: 70, top: 26, fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CL.ink }}>{Math.floor(m)}<span style={{ fontSize: 48 }}> min</span></div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="gc_bar" x1="0" x2="1" y1="0" y2="0">
                {GC.map(([mm, c]) => <stop key={mm} offset={mm / 12} stopColor={c} />)}
              </linearGradient>
            </defs>
            {Array.from({ length: 7 }, (_, i) => bean(i))}
            {/* la regla de 0 a 12 minutos */}
            <rect x={X0} y={640} width={X1 - X0} height={46} rx={23} fill="url(#gc_bar)" stroke={hexA(CL.ink, 0.35)} strokeWidth={3} />
            {/* la ventana: de 3 a 5 minutos */}
            <rect x={xm(3)} y={622} width={xm(5) - xm(3)} height={82} rx={14} fill="none" stroke="#2F7D2A" strokeWidth={6} strokeDasharray="14 9" opacity={0.35 + 0.65 * L[1]} />
            <text x={(xm(3) + xm(5)) / 2} y={606} textAnchor="middle" style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 4 }} fill="#2F7D2A" opacity={0.35 + 0.65 * L[1]}>LA VENTANA</text>
            {[0, 2, 4, 8, 12].map((mm) => (
              <g key={mm}>
                <line x1={xm(mm)} x2={xm(mm)} y1={692} y2={712} stroke={CL.ink} strokeWidth={4} />
                <text x={xm(mm)} y={748} textAnchor="middle" style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 36 }} fill={CL.ink}>{mm}</text>
              </g>
            ))}
            {/* aguja */}
            <path d={`M ${xm(m)} 632 l -18 -30 h 36 Z`} fill={CL.red} />
            <line x1={xm(m)} x2={xm(m)} y1={632} y2={694} stroke={CL.red} strokeWidth={6} strokeLinecap="round" />
          </svg>
          {/* rótulo de la etapa */}
          {labels.map(([k, v, c], i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", opacity: L[i] * (stage === i ? 1 : 0), translate: `0 ${(1 - L[i]) * 20}px` }}>
              <span style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 36, letterSpacing: 4, color: CL.inkSoft, marginRight: 26 }}>{k}</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: c }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ClCoffeeThermo: el termómetro del café de olla. Termómetro grande a la izquierda (80 a 102 °C) y la olla de barro a la derecha:
//               hierve a 100 (burbujas, vapor fuerte, "saca lo amargo") → apagas la lumbre → baja un poco (sin burbujas) → la franja
//               92-96 °C justo debajo del hervor = "suelta lo rico sin tanto amargo". `at` = [s] de las 4 frases (hierve a cien /
//               apagas la lumbre / ya bajó un poco / ahí, justo debajo del hervor).
export const ClCoffeeThermo: React.FC<{ at?: [number, number, number, number]; bed?: string }> = ({ at = [1.2, 4.0, 7.0, 9.5], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const T = at.map((s) => Math.round(s * fps));
  const temp = interpolate(f, [0, T[0], T[1], T[2]], [70, 100, 100, 94.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const boil = interpolate(f, [T[0] - 10, T[0] + 6, T[1], T[1] + 24], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const L = [lin(f, T[0], T[0] + 12), lin(f, T[1], T[1] + 12), lin(f, T[2], T[2] + 12), lin(f, T[3], T[3] + 14)];
  const Y0 = 800, Y1 = 150, yt = (c: number) => Y0 - ((c - 80) / 22) * (Y0 - Y1);   // 80 °C abajo, 102 arriba
  const TX = 300;
  const stage = f < T[1] ? 0 : f < T[3] ? 1 : 2;
  const labels = [["HIERVE · 100 °C", "burbujas: saca lo amargo", CL.red], ["APAGAS LA LUMBRE", "baja un poquito", CL.inkSoft], ["95 °C · SIN BURBUJAS", "suelta lo rico, no lo amargo", "#2F7D2A"]] as [string, string, string][];
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={53} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "0.4deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>EL TERMÓMETRO DEL CAFÉ</div>
          <div style={{ position: "absolute", right: 70, top: 26, fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: stage === 0 ? CL.red : stage === 2 ? "#2F7D2A" : CL.ink }}>{Math.round(temp)}<span style={{ fontSize: 48 }}> °C</span></div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            {/* termómetro */}
            <rect x={TX - 34} y={Y1 - 40} width={68} height={Y0 - Y1 + 70} rx={34} fill="#FBF7EE" stroke={CL.ink} strokeWidth={5} />
            <circle cx={TX} cy={Y0 + 62} r={62} fill={CL.red} stroke={CL.ink} strokeWidth={5} />
            <rect x={TX - 16} y={yt(temp)} width={32} height={Y0 + 30 - yt(temp)} fill={CL.red} />
            {/* franja buena 92-96 */}
            <rect x={TX - 60} y={yt(96)} width={120} height={yt(92) - yt(96)} rx={10} fill={hexA("#2F7D2A", 0.12 + 0.2 * L[3])} stroke="#2F7D2A" strokeWidth={5} strokeDasharray="12 8" opacity={0.25 + 0.75 * L[3]} />
            {[80, 85, 90, 95, 100].map((c) => (
              <g key={c}>
                <line x1={TX + 40} x2={TX + 72} y1={yt(c)} y2={yt(c)} stroke={CL.ink} strokeWidth={4} />
                <text x={TX + 86} y={yt(c) + 13} style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 38 }} fill={CL.ink}>{c}°</text>
              </g>
            ))}
            <text x={TX + 190} y={yt(100) + 12} style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 3 }} fill={CL.red} opacity={0.3 + 0.7 * L[0]}>HERVOR</text>
            <text x={TX + 190} y={yt(94) + 12} style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 3 }} fill="#2F7D2A" opacity={L[3]}>AQUÍ VA EL CAFÉ</text>
            {/* olla de barro */}
            <g transform="translate(1130 560)">
              <ellipse cx={0} cy={-150} rx={250} ry={46} fill="#5A3A22" />
              <ellipse cx={0} cy={-150} rx={226} ry={36} fill="#4A2A14" />
              {Array.from({ length: 14 }, (_, i) => {
                const ph = ((f * (0.9 + rnd(i) * 0.8)) / 18 + rnd(i + 9)) % 1;
                return <circle key={i} cx={(rnd(i + 2) - 0.5) * 380} cy={-150 + (rnd(i + 5) - 0.5) * 40} r={(5 + rnd(i + 4) * 13) * (0.4 + ph)} fill="none" stroke="#C9A27A" strokeWidth={3} opacity={boil * (1 - ph)} />;
              })}
              <path d="M -250 -150 C -280 -40 -250 120 -170 190 L 170 190 C 250 120 280 -40 250 -150" fill="#B5643A" stroke={hexA(CL.ink, 0.6)} strokeWidth={5} />
              <path d="M -255 -150 C -300 -170 -320 -110 -275 -95" fill="none" stroke="#9E5230" strokeWidth={22} strokeLinecap="round" />
              <path d="M 255 -150 C 300 -170 320 -110 275 -95" fill="none" stroke="#9E5230" strokeWidth={22} strokeLinecap="round" />
              <path d="M -230 -60 Q 0 -20 230 -60" fill="none" stroke="#F3E3C8" strokeWidth={6} opacity={0.6} />
              {/* vapor */}
              {Array.from({ length: 5 }, (_, i) => {
                const k = 0.25 + 0.75 * boil, ph = ((f / 40) + i / 5) % 1;
                return <path key={i} d={`M ${-140 + i * 70} -200 q 30 -50 0 -100 q -30 -50 0 -100`} fill="none" stroke={hexA("#8C7B66", 0.5 * k * (1 - ph))} strokeWidth={10} strokeLinecap="round" transform={`translate(0 ${-ph * 80})`} />;
              })}
              {/* llama */}
              <g opacity={1 - L[1]}>
                {[-90, 0, 90].map((x) => <path key={x} d={`M ${x - 26} 250 Q ${x} 180 ${x + 26} 250 Z`} fill="#3E7BE0" />)}
              </g>
            </g>
          </svg>
          {labels.map(([k, v, c], i) => (
            <div key={i} style={{ position: "absolute", left: 640, right: 40, top: 800, textAlign: "center", opacity: (i === 0 ? L[0] : i === 1 ? L[1] : L[3]) * (stage === i ? 1 : 0) }}>
              <span style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: CL.inkSoft, marginRight: 22 }}>{k}</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: c }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ClSmellClock: el reloj del olor del repollo hervido. Olla de aluminio a la izquierda (el olor a azufre sube en nubes amarillentas
//               que crecen con los minutos) y un reloj de 0 a 30 min a la derecha cuyo arco se pinta de verde a ocre. `at` = [s] de las
//               4 frases (primeros cinco minutos / a los diez ya empieza / a los veinte o treinta / ahí la casa huele a hospital).
export const ClSmellClock: React.FC<{ at?: [number, number, number, number]; bed?: string }> = ({ at = [1.4, 4.4, 6.6, 11.0], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const T = at.map((s) => Math.round(s * fps));
  const min = interpolate(f, [0, T[0], T[0] + 20, T[1], T[1] + 20, T[2], T[2] + 40], [0, 0, 5, 5, 10, 10, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const smell = interpolate(min, [0, 5, 10, 20, 30], [0, 0.08, 0.35, 0.8, 1], { extrapolateRight: "clamp" });
  const L = [lin(f, T[0], T[0] + 12), lin(f, T[1], T[1] + 12), lin(f, T[2], T[2] + 12), lin(f, T[3], T[3] + 14)];
  const stage = f < T[1] ? 0 : f < T[2] ? 1 : f < T[3] ? 2 : 3;
  const CX = 1180, CY = 470, R = 300;
  const ang = (m: number) => (-90 + (m / 30) * 360) * (Math.PI / 180);
  const pt = (m: number, r: number) => [CX + Math.cos(ang(m)) * r, CY + Math.sin(ang(m)) * r];
  const col = (m: number) => mixHex("#5E9E3A", m < 15 ? "#C9A227" : "#A8741A", m < 15 ? m / 15 : 1) ;
  const arc = (m0: number, m1: number) => { const [x0, y0] = pt(m0, R - 30), [x1, y1] = pt(m1, R - 30); return `M ${x0} ${y0} A ${R - 30} ${R - 30} 0 ${m1 - m0 > 15 ? 1 : 0} 1 ${x1} ${y1}`; };
  const labels = [["5 MIN", "casi no huele", "#2F7D2A"], ["10 MIN", "ya empieza", "#9A7A12"], ["20 a 30 MIN", "lo peor del olor", "#8A5A10"], ["30 MIN DE HERVOR", "la casa huele a hospital", CL.red]] as [string, string, string][];
  const [hx, hy] = pt(min, R - 70);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={61} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "-0.4deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>EL RELOJ DEL OLOR · REPOLLO HERVIDO</div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            {/* olla de aluminio con repollo */}
            <g transform="translate(400 600)">
              {Array.from({ length: 9 }, (_, i) => {
                const ph = ((f / 55) + i / 9) % 1, sx = (rnd(i + 3) - 0.5) * 300;
                return <ellipse key={i} cx={sx + Math.sin(ph * 6 + i) * 30} cy={-230 - ph * 330} rx={40 + ph * 70} ry={26 + ph * 40} fill={hexA("#C9B23A", 0.55 * smell * (1 - ph))} />;
              })}
              <ellipse cx={0} cy={-150} rx={230} ry={42} fill="#8E949A" />
              <ellipse cx={0} cy={-150} rx={208} ry={32} fill="#C8CBA0" />
              {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${-170 + i * 55} -152 q 18 -14 36 0`} fill="none" stroke="#9FA86A" strokeWidth={8} strokeLinecap="round" />)}
              <path d="M -230 -150 L -205 170 Q 0 200 205 170 L 230 -150" fill="#B9BEC3" stroke={hexA(CL.ink, 0.6)} strokeWidth={5} />
              <path d="M -110 -40 q 20 30 0 60" fill="none" stroke="#9AA0A6" strokeWidth={6} />
              <path d="M 120 20 q -18 26 6 50" fill="none" stroke="#9AA0A6" strokeWidth={6} />
              <rect x={-300} y={-140} width={70} height={22} rx={10} fill="#6E7378" />
              <rect x={230} y={-140} width={70} height={22} rx={10} fill="#6E7378" />
              {[-90, 0, 90].map((x) => <path key={x} d={`M ${x - 26} 250 Q ${x} 180 ${x + 26} 250 Z`} fill="#3E7BE0" />)}
            </g>
            {/* reloj 0-30 min */}
            <circle cx={CX} cy={CY} r={R} fill="#FBF7EE" stroke={CL.ink} strokeWidth={6} />
            {min > 0.05 && <path d={arc(0, Math.min(min, 29.95))} fill="none" stroke={col(min)} strokeWidth={46} strokeLinecap="butt" opacity={0.85} />}
            {[0, 5, 10, 15, 20, 25].map((m) => {
              const [x0, y0] = pt(m, R - 4), [x1, y1] = pt(m, R - 56), [tx, ty] = pt(m, R + 46);
              return <g key={m}><line x1={x0} y1={y0} x2={x1} y2={y1} stroke={CL.ink} strokeWidth={5} /><text x={tx} y={ty + 14} textAnchor="middle" style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40 }} fill={CL.ink}>{m === 0 ? "30" : m}</text></g>;
            })}
            <line x1={CX} y1={CY} x2={hx} y2={hy} stroke={CL.ink} strokeWidth={12} strokeLinecap="round" />
            <circle cx={CX} cy={CY} r={20} fill={CL.ink} />
            <text x={CX} y={CY + 120} textAnchor="middle" style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96 }} fill={col(min)}>{Math.round(min)}<tspan style={{ fontSize: 46 }}> min</tspan></text>
          </svg>
          {labels.map(([k, v, c], i) => (
            <div key={i} style={{ position: "absolute", left: 640, right: 40, top: 838, textAlign: "center", opacity: L[i] * (stage === i ? 1 : 0) }}>
              <span style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: CL.inkSoft, marginRight: 22 }}>{k}</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: c }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ClSkinLayers: el corte de la piel del muslo. Bloque en corte (piel delgada arriba, capa de grasa, carne rosada) que aparece capa por
//               capa; en la 4ª frase la grasa se derrite y sale en gotas doradas, la piel queda dorada y crujiente. `at` = [s] de
//               las 4 frases (arriba la piel / debajo una capa de grasa / y debajo la carne / se tiene que derretir y salir).
export const ClSkinLayers: React.FC<{ at?: [number, number, number, number]; bed?: string }> = ({ at = [1.0, 3.0, 5.0, 8.0], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const T = at.map((s) => Math.round(s * fps));
  const L = [lin(f, T[0], T[0] + 14), lin(f, T[1], T[1] + 14), lin(f, T[2], T[2] + 14), lin(f, T[3], T[3] + 70)];
  const X0 = 200, W = 900, Y = 190;
  const FAT0 = 200, fatH = FAT0 * (1 - 0.8 * L[3]), skinH = 70, meatH = 380;
  const _u = 0; const skinC = mixHex("#F1D9B0", "#B8732A", L[3]);
  const wave = (y: number, a: number, ph: number) => Array.from({ length: 21 }, (_, i) => `${i === 0 ? "M" : "L"} ${X0 + (i * W) / 20} ${y + Math.sin(i * 0.9 + ph) * a}`).join(" ");
  const lab = (i: number, y: number, ty: number, k: string, v: string, c: string) => (
    <g opacity={L[i]} transform={`translate(${(1 - L[i]) * 40} 0)`}>
      <polyline points={`${X0 + W + 14},${y} ${X0 + W + 60},${ty} ${X0 + W + 90},${ty}`} fill="none" stroke={CL.ink} strokeWidth={4} />
      <text x={X0 + W + 110} y={ty - 6} style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 4 }} fill={CL.inkSoft}>{k}</text>
      <text x={X0 + W + 110} y={ty + 48} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52 }} fill={c}>{v}</text>
    </g>
  );
  const yS = Y, yF = Y + skinH, yM = yF + fatH;
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={67} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "0.3deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>EL MUSLO EN CORTE</div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            {/* carne */}
            <g opacity={L[2]}>
              <rect x={X0} y={yM} width={W} height={meatH} rx={18} fill="#E39C8C" />
              {Array.from({ length: 9 }, (_, i) => <path key={i} d={wave(yM + 30 + i * 30, 6, i)} fill="none" stroke="#C97A6C" strokeWidth={4} opacity={0.6} />)}
            </g>
            {/* grasa */}
            <g opacity={L[1]}>
              <rect x={X0} y={yF} width={W} height={fatH + 8} fill="#F6E7B8" />
              {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={X0 + 40 + rnd(i) * (W - 80)} cy={yF + 16 + rnd(i + 7) * Math.max(4, fatH - 30)} r={10 + rnd(i + 3) * 16} fill="#FBF2D2" opacity={1 - L[3]} />)}
            </g>
            {/* piel */}
            <g opacity={L[0]}>
              <path d={`${wave(yS, 5, 0)} L ${X0 + W} ${yF + 4} L ${X0} ${yF + 4} Z`} fill={skinC} stroke={hexA(CL.ink, 0.5)} strokeWidth={3} />
              {L[3] > 0.3 && Array.from({ length: 20 }, (_, i) => <circle key={i} cx={X0 + 30 + i * 44} cy={yS + 14 + rnd(i) * 22} r={4 + rnd(i + 2) * 4} fill="#8C4E18" opacity={(L[3] - 0.3) * 0.8} />)}
            </g>
            {/* gotas de grasa que salen */}
            {Array.from({ length: 14 }, (_, i) => {
              const ph = ((f - T[3]) / 45 + rnd(i + 11)) % 1;
              return f > T[3] ? <ellipse key={i} cx={X0 + 60 + rnd(i + 5) * (W - 120)} cy={yS - 20 - ph * 140} rx={9} ry={13} fill="#E8B83A" opacity={(1 - ph) * Math.min(1, L[3] * 2)} /> : null;
            })}
            {lab(0, yS + skinH / 2, Y + 35, "PIEL", L[3] > 0.5 ? "dorada, crujiente" : "delgadita", L[3] > 0.5 ? "#8C4E18" : CL.ink)}
            {lab(1, yF + fatH / 2, Y + skinH + FAT0 / 2 + 20, "GRASA", L[3] > 0.5 ? "se derrite y sale" : "tiene que salir", "#9A7A12")}
            {lab(2, yM + meatH / 2, Y + skinH + FAT0 + meatH / 2, "CARNE", "jugosa", "#B5503E")}
          </svg>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ClMeatClock: el reloj de la carne (chambarete en la olla tapada). Reloj de 0 a 3 horas a la derecha; a la izquierda un trozo
//              de carne con un tenedor que baja en cada hora: 1 h rebota (dura), 2 h entra un poco (cede), 3 h la carne se abre en
//              hebras. Última frase: "colágeno → gelatina". `at` = [s] de las 4 frases (a la hora / a las dos / a las tres / colágeno).
export const ClMeatClock: React.FC<{ at?: [number, number, number, number]; bed?: string }> = ({ at = [1.4, 4.0, 6.2, 9.0], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const T = at.map((s) => Math.round(s * fps));
  const hrs = interpolate(f, [0, T[0], T[0] + 20, T[1], T[1] + 20, T[2], T[2] + 20], [0, 0, 1, 1, 2, 2, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const L = [lin(f, T[0], T[0] + 12), lin(f, T[1], T[1] + 12), lin(f, T[2], T[2] + 12), lin(f, T[3], T[3] + 14)];
  const stage = f < T[1] ? 0 : f < T[2] ? 1 : f < T[3] ? 2 : 3;
  const stab = (t0: number, depth: number) => { const k = (f - t0 - 18) / 22; return k < 0 || k > 1 ? 0 : Math.sin(k * Math.PI) * depth; };
  const forkY = stab(T[0], 18) + stab(T[1], 60) + (f > T[2] + 18 ? Math.min(1, (f - T[2] - 18) / 18) * 110 : 0);
  const split = lin(f, T[2] + 26, T[2] + 60);
  const meatC = mixHex("#B5473A", "#5E2E1E", Math.min(1, hrs / 3));
  const CX = 1220, CY = 470, R = 280;
  const ang = (h: number) => (-90 + (h / 3) * 360) * (Math.PI / 180);
  const pt = (h: number, r: number) => [CX + Math.cos(ang(h)) * r, CY + Math.sin(ang(h)) * r];
  const arc = (h1: number) => { const [x0, y0] = pt(0, R - 30), [x1, y1] = pt(h1, R - 30); return `M ${x0} ${y0} A ${R - 30} ${R - 30} 0 ${h1 > 1.5 ? 1 : 0} 1 ${x1} ${y1}`; };
  const [hx, hy] = pt(hrs, R - 70);
  const labels = [["1 HORA", "todavía dura", CL.red], ["2 HORAS", "ya cede", "#9A7A12"], ["3 HORAS", "se deshace con el tenedor", "#2F7D2A"], ["COLÁGENO", "ya es gelatina", "#2F7D2A"]] as [string, string, string][];
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={71} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "-0.3deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>EL RELOJ DE LA CARNE · OLLA TAPADA, FUEGO MÍNIMO</div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform="translate(420 600) scale(1.25)">
              <ellipse cx={0} cy={150} rx={300} ry={34} fill={hexA(CL.ink, 0.12)} />
              {split === 0 && <path d="M 0 -130 C -120 -140 -230 -100 -240 0 C -245 90 -170 140 0 140 C 170 140 245 90 240 0 C 230 -100 120 -140 0 -130 Z" fill={meatC} stroke={hexA(CL.ink, 0.4)} strokeWidth={4} />}
              {[-1, 1].map((sd) => (
                <g key={sd} transform={`translate(${sd * split * 60} 0) rotate(${sd * split * 8})`}>
                  <path d={sd < 0 ? "M 0 -130 C -120 -140 -230 -100 -240 0 C -245 90 -170 140 0 140 Z" : "M 0 -130 C 120 -140 230 -100 240 0 C 245 90 170 140 0 140 Z"} fill={meatC} stroke={hexA(CL.ink, 0.4)} strokeWidth={4} opacity={split > 0 ? 1 : 0} />
                  {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${sd * 20} ${-100 + i * 40} q ${sd * 100} ${-14} ${sd * 200} 4`} fill="none" stroke={mixHex("#E9C2A8", "#8A4A30", Math.min(1, hrs / 3))} strokeWidth={5} opacity={0.6} />)}
                </g>
              ))}
              {split > 0 && Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${-30 + i * 10} ${-90 + i * 30} q 30 10 60 0`} fill="none" stroke="#7A3A24" strokeWidth={6} strokeLinecap="round" opacity={split} />)}
              <g transform={`translate(0 ${-250 + forkY})`}>
                <rect x={-14} y={-150} width={28} height={140} rx={10} fill="#C9CCD0" stroke={CL.ink} strokeWidth={3} />
                <rect x={-48} y={-14} width={96} height={30} rx={8} fill="#C9CCD0" stroke={CL.ink} strokeWidth={3} />
                {[-36, -12, 12, 36].map((x) => <rect key={x} x={x - 5} y={10} width={10} height={90} rx={4} fill="#C9CCD0" stroke={CL.ink} strokeWidth={2} />)}
              </g>
            </g>
            <circle cx={CX} cy={CY} r={R} fill="#FBF7EE" stroke={CL.ink} strokeWidth={6} />
            {hrs > 0.03 && <path d={arc(Math.min(hrs, 2.98))} fill="none" stroke={mixHex("#C9A227", "#2F7D2A", Math.min(1, hrs / 3))} strokeWidth={46} opacity={0.85} />}
            {[0, 1, 2].map((h) => { const [x0, y0] = pt(h, R - 4), [x1, y1] = pt(h, R - 60), [tx, ty] = pt(h, R + 48); return <g key={h}><line x1={x0} y1={y0} x2={x1} y2={y1} stroke={CL.ink} strokeWidth={6} /><text x={tx} y={ty + 14} textAnchor="middle" style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 42 }} fill={CL.ink}>{h === 0 ? "3 h" : `${h} h`}</text></g>; })}
            <line x1={CX} y1={CY} x2={hx} y2={hy} stroke={CL.ink} strokeWidth={12} strokeLinecap="round" />
            <circle cx={CX} cy={CY} r={20} fill={CL.ink} />
          </svg>
          {labels.map(([k, v, c], i) => (
            <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 838, textAlign: "center", opacity: L[i] * (stage === i ? 1 : 0) }}>
              <span style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: CL.inkSoft, marginRight: 22 }}>{k}</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: c }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </AbsoluteFill>
  );
};
