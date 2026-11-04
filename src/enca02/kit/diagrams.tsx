// Chief Aurelio · kit de diagramas (corte del barco, motor de 4 pisos, mapa de ruta, reloj de guardias, termómetro, telégrafo).
// Todos dibujan su propio panel y reciben `dur` (frames del cue). Se montan como OVERLAY sobre el b-roll (ver Player.tsx).
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C, FONT, k, io, shadow } from "../theme";
import { LAND, proj } from "../world";

type D = { dur: number };
const T = (s: string) => s; // marcador: los textos de pantalla van siempre por props

// ───────────────────────── TELEGRAPH (emblema del canal) ─────────────────────────
export const ORDERS = ["FULL AHEAD", "HALF AHEAD", "SLOW AHEAD", "DEAD SLOW AHEAD", "STOP", "DEAD SLOW ASTERN", "SLOW ASTERN", "HALF ASTERN", "FULL ASTERN"] as const;
const ORD_ANG = [-170, -150, -130, -110, -90, -70, -50, -30, -10];
const ORD_SHORT = ["FULL", "HALF", "SLOW", "DEAD\nSLOW", "STOP", "DEAD\nSLOW", "SLOW", "HALF", "FULL"];
export const TelegraphDial: React.FC<{ angle: number; size?: number; glow?: number }> = ({ angle, size = 520, glow = 0 }) => {
  const R = 230;
  return (
    <svg width={size} height={size} viewBox="-260 -260 520 520">
      <defs>
        <radialGradient id="tgFace" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#F6F0E0" />
          <stop offset="100%" stopColor="#D9CDAE" />
        </radialGradient>
        <linearGradient id="tgRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.brassHi} />
          <stop offset="55%" stopColor={C.brass} />
          <stop offset="100%" stopColor={C.brassLo} />
        </linearGradient>
      </defs>
      <circle r={R + 22} fill="url(#tgRim)" />
      <circle r={R + 4} fill={C.brassLo} />
      <circle r={R} fill="url(#tgFace)" />
      {/* semicírculo superior partido: AHEAD a la izquierda, ASTERN a la derecha */}
      {ORD_ANG.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const x = Math.cos(rad), y = Math.sin(rad);
        const isStop = i === 4;
        return (
          <g key={i}>
            <line x1={x * 120} y1={y * 120} x2={x * (R - 6)} y2={y * (R - 6)} stroke={C.ink} strokeWidth={2} opacity={0.5} />
            <text x={x * 178} y={y * 178} fill={isStop ? C.signal : C.ink} fontFamily={FONT.plate} fontWeight={700}
              fontSize={isStop ? 30 : 21} textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${a + 90} ${x * 178} ${y * 178})`}>
              {ORD_SHORT[i].split("\n").map((l, j, arr) => (
                <tspan key={j} x={x * 178} dy={j === 0 ? -(arr.length - 1) * 10 : 21}>{l}</tspan>
              ))}
            </text>
          </g>
        );
      })}
      <text x={-118} y={40} fill={C.ink} fontFamily={FONT.plate} fontWeight={700} fontSize={26} textAnchor="middle" letterSpacing={4}>AHEAD</text>
      <text x={118} y={40} fill={C.signal} fontFamily={FONT.plate} fontWeight={700} fontSize={26} textAnchor="middle" letterSpacing={4}>ASTERN</text>
      <text x={0} y={110} fill={C.ink} fontFamily={FONT.plate} fontWeight={600} fontSize={20} textAnchor="middle" letterSpacing={6} opacity={0.7}>ENGINE ROOM</text>
      {/* manija */}
      <g transform={`rotate(${angle})`}>
        <rect x={0} y={-9} width={R - 30} height={18} rx={9} fill="url(#tgRim)" stroke={C.brassLo} strokeWidth={2} />
        <rect x={R - 70} y={-16} width={40} height={32} rx={8} fill={C.signal} opacity={0.85 + glow * 0.15} />
      </g>
      <circle r={34} fill="url(#tgRim)" stroke={C.brassLo} strokeWidth={3} />
      <circle r={10} fill={C.brassLo} />
    </svg>
  );
};

export const Telegraph: React.FC<D & { from?: string; to: string; caption?: string; sub?: string }> = ({ dur, from = "FULL AHEAD", to, caption, sub }) => {
  const f = useCurrentFrame();
  const a0 = ORD_ANG[Math.max(0, ORDERS.indexOf(from as any))];
  const a1 = ORD_ANG[Math.max(0, ORDERS.indexOf(to as any))];
  const swing = k(f, 14, 34);
  const over = Math.sin(k(f, 34, 52) * Math.PI) * 4 * (a1 > a0 ? 1 : -1); // rebote del latón
  const ang = a0 + (a1 - a0) * swing + over;
  const op = io(f, dur);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 70, opacity: op }}>
      <div style={{ transform: `scale(${0.9 + 0.1 * k(f, 0, 14)})`, filter: `drop-shadow(${shadow})` }}>
        <TelegraphDial angle={ang} size={600} glow={k(f, 34, 40)} />
      </div>
      {caption && (
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 92, color: C.white, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: 2, opacity: k(f, 30, 44), transform: `translateY(${20 * (1 - k(f, 30, 44))}px)`, textShadow: shadow }}>{caption}</div>
          {sub && <div style={{ fontFamily: FONT.mono, fontSize: 30, color: C.brassHi, marginTop: 22, opacity: k(f, 44, 58) }}>{sub}</div>}
        </div>
      )}
    </div>
  );
};

// ───────────────────────── SHIP CUTAWAY ─────────────────────────
// Perfil de un VLCC: proa a la derecha. Zonas: bridge, accommodation, engine, tanks, bow, deck.
type Zone = "engine" | "accommodation" | "bridge" | "tanks" | "bow" | "pumproom" | "none";
const ZONES: Record<Exclude<Zone, "none">, { x: number; y: number; w: number; h: number }> = {
  bridge: { x: 150, y: 70, w: 150, h: 40 },
  accommodation: { x: 150, y: 110, w: 150, h: 160 },
  engine: { x: 110, y: 290, w: 230, h: 170 },
  pumproom: { x: 340, y: 300, w: 50, h: 160 },
  tanks: { x: 390, y: 280, w: 1250, h: 180 },
  bow: { x: 1640, y: 270, w: 160, h: 190 },
};
export const ShipCut: React.FC<D & { highlight?: Zone; label?: string; sub?: string; dim?: string; crew?: string; waterline?: boolean }> = ({ dur, highlight = "none", label, sub, dim, crew, waterline = true }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  const draw = k(f, 0, 30);
  const hl = k(f, 26, 42);
  const z = highlight !== "none" ? ZONES[highlight] : null;
  const hull = "M60 280 L1700 280 Q1790 282 1830 300 L1800 470 L120 470 Q70 470 60 430 Z";
  const pulse = 0.55 + 0.25 * Math.sin(f / 6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <g transform="translate(40 300)">
          {waterline && <rect x={-40} y={360} width={1960} height={260} fill={C.sea} opacity={0.35 * draw} />}
          {waterline && <line x1={-40} y1={360} x2={1900} y2={360} stroke={C.seaHi} strokeWidth={3} strokeDasharray="18 10" opacity={draw} />}
          {/* casco */}
          <path d={hull} fill={C.steel} fillOpacity={0.85} stroke={C.white} strokeWidth={4} strokeDasharray={4000} strokeDashoffset={4000 * (1 - draw)} />
          {/* tanques de carga */}
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={395 + i * 207} y={286} width={200} height={176} fill="none" stroke={C.line} strokeWidth={2} opacity={draw} />
          ))}
          {/* cubierta y cañerías */}
          <line x1={380} y1={272} x2={1700} y2={272} stroke={C.line} strokeWidth={6} opacity={draw} />
          {/* casa (accommodation) */}
          <rect x={150} y={110} width={150} height={170} fill={C.steel2} stroke={C.white} strokeWidth={3} opacity={draw} />
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={150} y1={135 + i * 24} x2={300} y2={135 + i * 24} stroke={C.line} strokeWidth={1.5} opacity={draw} />
          ))}
          <rect x={130} y={70} width={190} height={40} fill={C.steel2} stroke={C.white} strokeWidth={3} opacity={draw} />
          {/* chimenea */}
          <path d="M90 140 L130 140 L135 280 L80 280 Z" fill={C.steel2} stroke={C.white} strokeWidth={3} opacity={draw} />
          {/* sala de máquinas: motor como bloque */}
          <rect x={150} y={330} width={70} height={120} fill={C.ink} stroke={C.line} strokeWidth={2} opacity={draw} />
          <line x1={220} y1={430} x2={60} y2={430} stroke={C.line} strokeWidth={4} opacity={draw} />
          {z && (
            <g opacity={hl}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h} fill={C.brass} opacity={pulse * 0.55} />
              <rect x={z.x} y={z.y} width={z.w} height={z.h} fill="none" stroke={C.brassHi} strokeWidth={5} />
            </g>
          )}
          {dim && (
            <g opacity={k(f, 30, 44)}>
              <line x1={60} y1={540} x2={1830} y2={540} stroke={C.brassHi} strokeWidth={3} />
              <line x1={60} y1={520} x2={60} y2={560} stroke={C.brassHi} strokeWidth={3} />
              <line x1={1830} y1={520} x2={1830} y2={560} stroke={C.brassHi} strokeWidth={3} />
              <rect x={845} y={515} width={240} height={50} fill={C.ink} />
              <text x={965} y={550} fill={C.brassHi} fontFamily={FONT.mono} fontWeight={600} fontSize={34} textAnchor="middle">{dim}</text>
            </g>
          )}
        </g>
      </svg>
      {label && (
        <div style={{ position: "absolute", left: 120, top: 110, opacity: k(f, 34, 48), transform: `translateX(${-30 * (1 - k(f, 34, 48))}px)` }}>
          <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 84, color: C.white, letterSpacing: 2, textTransform: "uppercase", textShadow: shadow, lineHeight: 1 }}>{label}</div>
          {sub && <div style={{ fontFamily: FONT.mono, fontSize: 32, color: C.brassHi, marginTop: 14 }}>{sub}</div>}
        </div>
      )}
      {crew && (
        <div style={{ position: "absolute", right: 120, top: 120, opacity: k(f, 44, 58), fontFamily: FONT.plate, fontWeight: 700, fontSize: 56, color: C.ink, background: C.brass, padding: "10px 26px", borderRadius: 6, letterSpacing: 2 }}>{crew}</div>
      )}
    </div>
  );
};

// ───────────────────────── ENGINE TOWER (2 tiempos, 4 pisos, escala humana) ─────────────────────────
const Person: React.FC<{ x: number; y: number; h: number; c?: string }> = ({ x, y, h, c = C.brassHi }) => {
  const s = h / 180;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
      <circle cx={0} cy={-165} r={15} />
      <rect x={-17} y={-148} width={34} height={70} rx={10} />
      <rect x={-15} y={-80} width={13} height={80} rx={5} />
      <rect x={2} y={-80} width={13} height={80} rx={5} />
      <rect x={-27} y={-145} width={10} height={60} rx={5} />
      <rect x={17} y={-145} width={10} height={60} rx={5} />
    </g>
  );
};
export const EngineTower: React.FC<D & { title?: string; callouts?: string[]; rpm?: number; cyl?: number; personLabel?: string }> = ({ dur, title, callouts = [], rpm = 76, cyl = 7, personLabel = "6 ft" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  const draw = k(f, 0, 28);
  // 1 piso ≈ 11 ft. Motor ≈ 44 ft ≈ 4 pisos. Escala: 1 ft = 15 px → 660 px de alto. Persona 6 ft = 90 px.
  const FT = 15, H = 44 * FT, baseY = 900, x0 = 170, W = 800;
  const phase = (f / 30) * (rpm / 60) * Math.PI * 2;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        {/* pisos (gratings) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity={draw}>
            <line x1={x0 - 60} y1={baseY - i * 11 * FT} x2={x0 + W + 60} y2={baseY - i * 11 * FT} stroke={C.line} strokeWidth={3} strokeDasharray="10 8" />
            {i > 0 && <text x={x0 - 80} y={baseY - i * 11 * FT + 8} fill={C.line} fontFamily={FONT.plate} fontWeight={600} fontSize={26} textAnchor="end">{`FLOOR ${i + 1}`}</text>}
          </g>
        ))}
        <text x={x0 - 80} y={baseY + 8} fill={C.line} fontFamily={FONT.plate} fontWeight={600} fontSize={26} textAnchor="end" opacity={draw}>FLOOR 1</text>
        {/* bancada y cárter */}
        <rect x={x0} y={baseY - 8 * FT} width={W} height={8 * FT} fill={C.steel2} stroke={C.white} strokeWidth={3} opacity={draw} />
        {/* bloque de cilindros */}
        <rect x={x0 + 20} y={baseY - 30 * FT} width={W - 40} height={22 * FT} fill={C.steel} stroke={C.white} strokeWidth={3} opacity={draw} />
        {/* culatas y escape */}
        <rect x={x0 + 10} y={baseY - 36 * FT} width={W - 20} height={6 * FT} fill={C.steel2} stroke={C.white} strokeWidth={3} opacity={draw} />
        <rect x={x0 + 40} y={baseY - 44 * FT} width={W - 80} height={7 * FT} rx={40} fill={C.steel} stroke={C.white} strokeWidth={3} opacity={draw} />
        {/* cilindros con pistones en movimiento */}
        {Array.from({ length: cyl }).map((_, i) => {
          const cw = (W - 80) / cyl, cx = x0 + 40 + i * cw + cw / 2;
          const stroke = 10 * FT; // carrera ~10 ft
          const p = (Math.cos(phase + (i * 2 * Math.PI) / cyl) + 1) / 2; // 0..1
          const top = baseY - 30 * FT + 20 + p * (stroke * 0.55);
          return (
            <g key={i} opacity={k(f, 10 + i * 2, 28 + i * 2)}>
              <rect x={cx - cw * 0.34} y={baseY - 30 * FT + 10} width={cw * 0.68} height={20 * FT} fill={C.ink} stroke={C.line} strokeWidth={2} />
              <rect x={cx - cw * 0.3} y={top} width={cw * 0.6} height={3 * FT} fill={C.brass} />
              <line x1={cx} y1={top + 3 * FT} x2={cx} y2={baseY - 6 * FT} stroke={C.brassHi} strokeWidth={6} />
            </g>
          );
        })}
        {/* persona a escala */}
        <g opacity={k(f, 24, 38)}>
          <Person x={x0 + W + 130} y={baseY} h={6 * FT} />
          <text x={x0 + W + 130} y={baseY + 44} fill={C.brassHi} fontFamily={FONT.mono} fontSize={26} textAnchor="middle">{personLabel}</text>
          {/* cota de altura */}
          <line x1={x0 + W + 60} y1={baseY} x2={x0 + W + 60} y2={baseY - H} stroke={C.brassHi} strokeWidth={3} strokeDasharray={`${H}`} strokeDashoffset={H * (1 - k(f, 28, 48))} />
          <text x={x0 + W + 76} y={baseY - H - 16} fill={C.brassHi} fontFamily={FONT.mono} fontWeight={600} fontSize={34}>~44 ft</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1290, top: 150, width: 560 }}>
        {title && <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 70, color: C.white, textTransform: "uppercase", lineHeight: 1, letterSpacing: 2, textShadow: shadow, opacity: k(f, 18, 32) }}>{title}</div>}
        {callouts.map((c, i) => (
          <div key={i} style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: 38, color: C.cream, opacity: k(f, 40 + i * 14, 52 + i * 14), transform: `translateX(${20 * (1 - k(f, 40 + i * 14, 52 + i * 14))}px)`, borderLeft: `5px solid ${C.brass}`, paddingLeft: 18 }}>{c}</div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────── ROUTE MAP ─────────────────────────
export type Port = { name: string; lon: number; lat: number; side?: "l" | "r" | "t" | "b" };
export const RouteMap: React.FC<D & { points: Port[]; view: [number, number, number]; view2?: [number, number, number]; title?: string; sub?: string; mark?: number[] }> = ({ dur, points, view, view2, title, sub, mark }) => {
  const f = useCurrentFrame();
  const op = io(f, dur, 14, 12);
  const vk = view2 ? k(f, 10, dur - 20) : 0;
  const v = view.map((a, i) => a + ((view2 ?? view)[i] - a) * vk);
  // view = [lon centro, lat centro, ancho en grados]; alto = ancho·9/16 → siempre 16:9, sin recorte
  const wDeg = v[2], hDeg = (v[2] * 9) / 16;
  const [x0, y0] = proj(v[0] - wDeg / 2, v[1] + hDeg / 2);
  const [x1, y1] = proj(v[0] + wDeg / 2, v[1] - hDeg / 2);
  const vb = `${x0} ${y0} ${x1 - x0} ${y1 - y0}`;
  const sc = (x1 - x0) / 1920; // px de mapa por px de pantalla
  const pts = points.map((p) => proj(p.lon, p.lat));
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0) || 1;
  const prog = k(f, 16, Math.max(40, dur - 30), (t) => t);
  // posición del barquito a lo largo de la ruta
  let acc = 0, ship = pts[0];
  for (let i = 0; i < segs.length; i++) {
    const L = segs[i] / total;
    if (prog <= acc + L || i === segs.length - 1) { const t = Math.min(1, Math.max(0, (prog - acc) / L)); ship = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; break; }
    acc += L;
  }
  const d = "M" + pts.map((p) => `${p[0]} ${p[1]}`).join(" L");
  const reached = (i: number) => { let a = 0; for (let j = 0; j < i; j++) a += segs[j] / total; return prog >= a - 0.001; };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <svg width="100%" height="100%" viewBox={vb} preserveAspectRatio="xMidYMid slice">
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={C.ink} opacity={0.92} />
        {/* retícula de carta náutica cada 10° */}
        {Array.from({ length: 37 }).map((_, i) => <line key={"v" + i} x1={i * 100} y1={0} x2={i * 100} y2={1800} stroke={C.line} strokeWidth={0.6 * sc} opacity={0.35} />)}
        {Array.from({ length: 19 }).map((_, i) => <line key={"h" + i} x1={0} y1={i * 100} x2={3600} y2={i * 100} stroke={C.line} strokeWidth={0.6 * sc} opacity={0.35} />)}
        <path d={LAND} fill={C.steel2} stroke={C.line} strokeWidth={1.2 * sc} />
        <path d={d} fill="none" stroke={C.brassHi} strokeWidth={4 * sc} strokeDasharray={`${total * prog} ${total * 2}`} strokeLinecap="round" />
        {points.map((p, i) => {
          const [px, py] = pts[i];
          if (!p.name) return null; // punto de paso (sigue la costa), sin rótulo
          const on = reached(i) && (!mark || mark.includes(i));
          const side = p.side ?? "r";
          const dx = side === "r" ? 14 : side === "l" ? -14 : 0, dy = side === "t" ? -16 : side === "b" ? 30 : 8;
          return (
            <g key={i} opacity={on ? 1 : 0}>
              <circle cx={px} cy={py} r={6 * sc} fill={C.signal} stroke={C.white} strokeWidth={2 * sc} />
              <text x={px + dx * sc} y={py + dy * sc} fill={C.white} fontFamily={FONT.plate} fontWeight={700} fontSize={28 * sc}
                textAnchor={side === "l" ? "end" : side === "r" ? "start" : "middle"} style={{ paintOrder: "stroke" }} stroke={C.ink} strokeWidth={6 * sc}>{p.name}</text>
            </g>
          );
        })}
        <circle cx={ship[0]} cy={ship[1]} r={9 * sc} fill={C.brassHi} stroke={C.ink} strokeWidth={3 * sc} />
      </svg>
      {title && (
        <div style={{ position: "absolute", left: 90, top: 80 }}>
          <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 64, color: C.white, textTransform: "uppercase", letterSpacing: 2, textShadow: shadow }}>{title}</div>
          {sub && <div style={{ fontFamily: FONT.mono, fontSize: 30, color: C.brassHi, marginTop: 8 }}>{sub}</div>}
        </div>
      )}
    </div>
  );
};

// ───────────────────────── WATCH CLOCK (guardias de 4 h) ─────────────────────────
export const WatchClock: React.FC<D & { highlight?: string; from?: string; to?: string; caption?: string; corner?: boolean }> = ({ dur, highlight = "4-8", from = "03:50", to = "04:00", caption, corner = false }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  const toMin = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  const m = interpolate(k(f, 10, Math.max(30, dur - 40)), [0, 1], [toMin(from), toMin(to)]);
  // esfera de 24 h: 0 arriba
  const ang = (min: number) => (min / 1440) * 360 - 90;
  const R = 300;
  const watches = [
    { a: 0, b: 4, l: "12-4" }, { a: 4, b: 8, l: "4-8" }, { a: 8, b: 12, l: "8-12" },
    { a: 12, b: 16, l: "12-4" }, { a: 16, b: 20, l: "4-8" }, { a: 20, b: 24, l: "8-12" },
  ];
  const arc = (a: number, b: number, r0: number, r1: number) => {
    const p = (h: number, r: number) => { const t = ((h / 24) * 360 - 90) * Math.PI / 180; return `${Math.cos(t) * r} ${Math.sin(t) * r}`; };
    return `M${p(a, r1)} A${r1} ${r1} 0 0 1 ${p(b, r1)} L${p(b, r0)} A${r0} ${r0} 0 0 0 ${p(a, r0)} Z`;
  };
  const scale = corner ? 0.55 : 1;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: corner ? "flex-end" : "center", padding: corner ? "0 80px" : 0, gap: 60, opacity: op }}>
      {caption && !corner && (
        <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 86, color: C.white, textTransform: "uppercase", lineHeight: 0.95, maxWidth: 560, textShadow: shadow, opacity: k(f, 20, 34) }}>{caption}</div>
      )}
      <svg width={760 * scale} height={760 * scale} viewBox="-380 -380 760 760" style={{ filter: `drop-shadow(${shadow})` }}>
        <circle r={R + 50} fill={C.ink} stroke={C.brass} strokeWidth={10} />
        {watches.map((w, i) => (
          <g key={i}>
            <path d={arc(w.a, w.b, R - 70, R + 30)} fill={w.l === highlight ? C.brass : C.steel2} opacity={w.l === highlight ? 0.55 + 0.45 * k(f, 14, 30) : 0.9} stroke={C.ink} strokeWidth={4} />
            {(() => { const t = ((((w.a + w.b) / 2) / 24) * 360 - 90) * Math.PI / 180; return (
              <text x={Math.cos(t) * (R - 20)} y={Math.sin(t) * (R - 20)} fill={w.l === highlight ? C.ink : C.cream} fontFamily={FONT.plate} fontWeight={700} fontSize={40} textAnchor="middle" dominantBaseline="middle">{w.l}</text>); })()}
          </g>
        ))}
        {Array.from({ length: 24 }).map((_, h) => { const t = ((h / 24) * 360 - 90) * Math.PI / 180; return (
          <text key={h} x={Math.cos(t) * (R - 110)} y={Math.sin(t) * (R - 110)} fill={C.cream} opacity={0.7} fontFamily={FONT.mono} fontSize={24} textAnchor="middle" dominantBaseline="middle">{String(h).padStart(2, "0")}</text>); })}
        <g transform={`rotate(${ang(m)})`}>
          <rect x={0} y={-6} width={R - 70} height={12} rx={6} fill={C.signal} />
        </g>
        <circle r={18} fill={C.brass} />
        <text y={95} fill={C.brassHi} fontFamily={FONT.mono} fontWeight={600} fontSize={54} textAnchor="middle">{`${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`}</text>
      </svg>
    </div>
  );
};

// ───────────────────────── THERMOMETER ─────────────────────────
export const Thermo: React.FC<D & { to: number; from?: number; label?: string; sub?: string; side?: "left" | "right" }> = ({ dur, to, from = 70, label, sub, side = "right" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  const t = interpolate(k(f, 10, 50), [0, 1], [from, to]);
  const c = Math.round(((t - 32) * 5) / 9);
  const fill = (t - 40) / (130 - 40);
  const H = 560;
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, [side]: 110, display: "flex", alignItems: "center", gap: 36, flexDirection: side === "right" ? "row-reverse" : "row", opacity: op } as React.CSSProperties}>
      <svg width={150} height={H + 140} viewBox={`0 0 150 ${H + 140}`} style={{ filter: `drop-shadow(${shadow})` }}>
        <rect x={45} y={10} width={60} height={H} rx={30} fill={C.ink} stroke={C.brass} strokeWidth={6} />
        <rect x={57} y={10 + H * (1 - fill)} width={36} height={H * fill} rx={18} fill={t > 100 ? C.signal : C.heat} />
        <circle cx={75} cy={H + 60} r={60} fill={t > 100 ? C.signal : C.heat} stroke={C.brass} strokeWidth={6} />
        {[50, 70, 90, 110, 130].map((v) => { const y = 10 + H * (1 - (v - 40) / 90); return <line key={v} x1={110} y1={y} x2={135} y2={y} stroke={C.cream} strokeWidth={3} />; })}
      </svg>
      <div style={{ textAlign: side === "right" ? "right" : "left" }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 150, color: C.white, lineHeight: 1, textShadow: shadow }}>{Math.round(t)}°F</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.brassHi, marginTop: 6 }}>{c}°C</div>
        {label && <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 52, color: C.cream, textTransform: "uppercase", marginTop: 20, letterSpacing: 2, opacity: k(f, 40, 56) }}>{label}</div>}
        {sub && <div style={{ fontFamily: FONT.mono, fontSize: 28, color: C.cream, opacity: 0.85 * k(f, 50, 64), marginTop: 6 }}>{sub}</div>}
      </div>
    </div>
  );
};
export { T };
