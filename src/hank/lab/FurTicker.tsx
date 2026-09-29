// FurTicker — monitor CRT de piso de operaciones de los 80: fósforo verde, scanlines, cinta de cotizaciones
// "NUTRIA PELT" corriendo arriba y un gráfico de precio que se dibuja punto a punto. En `crashAt` la pantalla
// parpadea en ROJO con sacudida horizontal. Encendido y apagado de tubo (línea → punto) en la entrada/salida.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

type Pt = { label: string; value: number };
export type FurTickerProps = { title: string; points: Pt[]; crashAt?: number; unit?: string };

const Grain: React.FC<{ o?: number }> = ({ o = 0.22 }) => {
  const f = useCurrentFrame();
  return (
    <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
  );
};

const GREEN = "#5CFF8A";
const GREEN_D = "#1f8a45";
const RED = "#FF3B4E";
const SW = 1560; // pantalla
const SH = 880;

export const FurTicker: React.FC<FurTickerProps> = ({ title, points, crashAt, unit = "$" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const n = points.length;
  // crash por defecto = mayor caída relativa
  let crash = crashAt ?? 1;
  if (crashAt == null) {
    let worst = 0;
    for (let i = 1; i < n; i++) { const d = points[i].value / points[i - 1].value; if (1 - d > worst) { worst = 1 - d; crash = i; } }
  }
  const money = (v: number) => (unit === "$" ? `$${v.toFixed(2)}` : `${v.toFixed(2)} ${unit}`);

  // horario
  const segLen = 15;
  const need = 70 + (n - 1) * segLen + 60;
  const k = clamp((D - 10) / need, 0.5, 1.3);
  const t = frame / k;
  const on = ease(t / 12); // encendido del tubo
  const rise = easeInOut((t - 38) / 22); // el primer punto sube desde 0
  const sProg = clamp((t - 64) / segLen, 0, n - 1); // segmentos dibujados
  const offT = clamp((frame - (D - 12)) / 10); // apagado

  // eje X por año (si la etiqueta empieza con un año) o por índice
  const yrs = points.map((p, i) => { const m = /^(\d{4})/.exec(p.label); return m ? parseInt(m[1], 10) : i; });
  // eje con CORTE honesto: los huecos de >2 años se comprimen y se marcan con "//"
  const us: number[] = [0];
  for (let i = 1; i < n; i++) { const d = yrs[i] - yrs[i - 1]; us.push(us[i - 1] + (d > 2 ? 2.4 : Math.max(0.6, d))); }
  const uMax = us[n - 1] || 1;
  const CX0 = 200, CX1 = SW - 300, CY0 = 250, CY1 = SH - 190;
  const vmax = Math.max(...points.map((p) => p.value));
  const top = Math.ceil((vmax * 1.12) / 2) * 2;
  const X = (i: number) => lerp(CX0, CX1, us[i] / uMax);
  const Y = (v: number) => lerp(CY1, CY0, v / top);

  // crash
  const crashT = 64 + (crash - 0.5) * segLen;
  const cr = t - crashT;
  const crashFlash = cr > 0 && cr < 26 ? (Math.sin(cr * 1.9) > -0.2 ? 1 : 0.35) * (1 - cr / 26) : 0;
  const crashHold = ease(cr / 10);
  const shake = crashFlash > 0 ? (rnd(Math.floor(t) * 3.1) - 0.5) * 22 * crashFlash : 0;
  const tint = crashFlash > 0 ? RED : GREEN;

  // parpadeo del fósforo
  const flick = 0.93 + 0.07 * rnd(Math.floor(frame) * 1.7);

  // camino
  const pts: { x: number; y: number }[] = points.map((p, i) => ({ x: X(i), y: Y(i === 0 ? p.value * rise : p.value) }));
  const segs: React.ReactNode[] = [];
  for (let i = 0; i < n - 1; i++) {
    const f = clamp(sProg - i);
    if (f <= 0) break;
    const a = pts[i], b = pts[i + 1];
    const bx = lerp(a.x, b.x, f), by = lerp(a.y, b.y, f);
    const gap = yrs[i + 1] - yrs[i] > 2;
    const col = i + 1 === crash && crashHold > 0 ? RED : GREEN;
    segs.push(
      <g key={i}>
        <line x1={a.x} y1={a.y} x2={bx} y2={by} stroke={col} strokeWidth={14} strokeOpacity={gap ? 0.06 : 0.14} strokeLinecap="round" />
        <line x1={a.x} y1={a.y} x2={bx} y2={by} stroke={col} strokeWidth={4} strokeOpacity={gap ? 0.45 : 1} strokeDasharray={gap ? "10 10" : undefined} strokeLinecap="round" />
      </g>
    );
  }
  const headI = Math.min(n - 1, Math.floor(sProg + 0.0001));
  const headF = sProg - headI;
  const head = headI < n - 1 ? { x: lerp(pts[headI].x, pts[headI + 1].x, headF), y: lerp(pts[headI].y, pts[headI + 1].y, headF) } : pts[n - 1];
  const headV = headI < n - 1 ? lerp(points[headI].value, points[headI + 1].value, headF) : points[n - 1].value;
  const curV = t < 64 ? points[0].value * rise : headV;
  const peak = points.reduce((m, p) => Math.max(m, p.value), 0);
  const dropCrash = Math.round((1 - points[crash].value / points[crash - 1].value) * 100);
  const dropTotal = Math.round((1 - points[n - 1].value / peak) * 100);
  const endIn = ease((t - (64 + (n - 1) * segLen + 4)) / 14);

  // cinta
  const tape = points.map((p, i) => {
    const d = i > 0 ? p.value - points[i - 1].value : 0;
    return `NUTRIA PELT ${p.label}  ${money(p.value)} ${i === 0 ? "■" : d >= 0 ? "▲" : "▼"}${i > 0 ? Math.abs(d).toFixed(2) : ""}`;
  }).join("     ·     ") + "     ·     ";
  const tapeX = -((frame * 5) % (tape.length * 17.4));

  const drift = frame / Math.max(1, D);
  const camS = lerp(1.0, 1.05, easeInOut(drift));
  const offY = offT < 0.6 ? 1 - ease(offT / 0.6) * 0.995 : 0.005;
  const offX = offT < 0.6 ? 1 : 1 - ease((offT - 0.6) / 0.4) * 0.99;
  const tubeY = t < 12 ? Math.max(0.006, ease(t / 10)) : offY;
  const tubeX = t < 12 ? Math.min(1, 0.05 + ease(t / 6)) : offX;

  return (
    <AbsoluteFill style={{ background: "#040504", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${camS}) rotate(${lerp(-0.6, 0.3, drift)}deg)` }}>
        {/* sala oscura con reflejo del monitor */}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% 50%, ${crashFlash > 0 ? "rgba(120,20,30,0.35)" : "rgba(30,90,50,0.22)"} 0%, rgba(0,0,0,0) 70%)` }} />
        {/* carcasa */}
        <div style={{ position: "absolute", left: 960 - SW / 2 - 70, top: 540 - SH / 2 - 60, width: SW + 140, height: SH + 150, borderRadius: 46,
          background: "linear-gradient(180deg,#3b3a36 0%,#2a2926 40%,#1b1a18 100%)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.9), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.6)" }}>
          {/* rejilla y marca genérica */}
          <div style={{ position: "absolute", right: 70, bottom: 22, display: "flex", gap: 6 }}>
            {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ width: 4, height: 22, borderRadius: 2, background: "#111" }} />)}
          </div>
          <div style={{ position: "absolute", left: 76, bottom: 26, width: 12, height: 12, borderRadius: 6, background: offT > 0.9 ? "#2a1a0a" : "#ffb347", boxShadow: offT > 0.9 ? "none" : "0 0 10px #ffb347" }} />
          <div style={{ position: "absolute", left: 100, bottom: 22, fontFamily: SANS, fontSize: 18, letterSpacing: 6, color: "rgba(241,235,221,0.35)" }}>MARKET · TERMINAL</div>
        </div>
        {/* hueco de la pantalla */}
        <div style={{ position: "absolute", left: 960 - SW / 2 - 14, top: 540 - SH / 2 - 14, width: SW + 28, height: SH + 28, borderRadius: 40, background: "#050505", boxShadow: "inset 0 6px 18px rgba(0,0,0,1)" }} />
        {/* pantalla */}
        <div style={{ position: "absolute", left: 960 - SW / 2, top: 540 - SH / 2, width: SW, height: SH, borderRadius: 34, overflow: "hidden", background: "#020904" }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${tubeX}, ${tubeY}) translateX(${shake}px)`, filter: `brightness(${flick * (t < 12 ? 1 + (1 - on) * 3 : 1)})` }}>
            {/* fondo del fósforo */}
            <div style={{ position: "absolute", inset: 0, background: crashFlash > 0 ? `radial-gradient(ellipse at 50% 50%, rgba(90,10,18,${0.9 * crashFlash}), #120204)` : "radial-gradient(ellipse at 50% 50%, #062413 0%, #031208 60%, #010603 100%)" }} />
            {/* cinta superior */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 74, background: "rgba(0,0,0,0.55)", borderBottom: `2px solid ${tint}55`, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: tapeX, top: 18, whiteSpace: "nowrap", fontFamily: MONO, fontWeight: 700, fontSize: 29, color: tint, textShadow: `0 0 8px ${tint}, 0 0 18px ${tint}88` }}>{tape + tape + tape}</div>
            </div>
            {/* título y lectura */}
            <div style={{ position: "absolute", left: CX0 - 40, top: 104, fontFamily: MONO, fontWeight: 700, fontSize: 38, letterSpacing: 2, color: tint, textShadow: `0 0 10px ${tint}` , opacity: ease((t - 14) / 8)}}>
              {title}{Math.floor(frame / 8) % 2 === 0 ? "█" : " "}
            </div>
            <div style={{ position: "absolute", right: 80, top: 96, textAlign: "right", opacity: ease((t - 30) / 8) }}>
              <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: `${tint}bb` }}>AVG PRICE / PELT</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: crashHold > 0 && cr < 40 ? RED : tint, textShadow: `0 0 14px ${crashHold > 0 && cr < 40 ? RED : tint}` }}>{money(curV)}</div>
            </div>
            {/* grilla y ejes */}
            <svg width={SW} height={SH} style={{ position: "absolute", left: 0, top: 0, opacity: ease((t - 18) / 12) }}>
              {Array.from({ length: top / 2 + 1 }).map((_, j) => {
                const v = j * 2;
                return (
                  <g key={j}>
                    <line x1={CX0} x2={CX1 + 40} y1={Y(v)} y2={Y(v)} stroke={tint} strokeOpacity={j === 0 ? 0.55 : 0.14} strokeWidth={j === 0 ? 2 : 1.2} strokeDasharray={j === 0 ? undefined : "4 8"} />
                    <text x={CX0 - 22} y={Y(v) + 8} fill={tint} fillOpacity={0.7} fontFamily={MONO} fontSize={22} textAnchor="end">{unit === "$" ? `$${v}` : v}</text>
                  </g>
                );
              })}
              {points.map((p, i) => (
                <g key={i} opacity={i === 0 ? ease((t - 36) / 8) : clamp((sProg - i + 1) * 3)}>
                  <line x1={X(i)} x2={X(i)} y1={CY1} y2={CY1 + 10} stroke={tint} strokeOpacity={0.6} strokeWidth={2} />
                  <text x={X(i)} y={CY1 + 42 + ((i > 0 && X(i) - X(i - 1) < 120 && i % 2 === 1) ? 30 : 0)} fill={tint} fillOpacity={0.8} fontFamily={MONO} fontSize={22} textAnchor="middle">{p.label}</text>
                </g>
              ))}
              {points.map((_, i) => (i > 0 && yrs[i] - yrs[i - 1] > 2 ? (
                <g key={`br${i}`} stroke={tint} strokeWidth={2.5} strokeOpacity={0.8}>
                  <line x1={(X(i) + X(i - 1)) / 2 - 12} y1={CY1 + 12} x2={(X(i) + X(i - 1)) / 2 - 2} y2={CY1 - 12} />
                  <line x1={(X(i) + X(i - 1)) / 2 + 2} y1={CY1 + 12} x2={(X(i) + X(i - 1)) / 2 + 12} y2={CY1 - 12} />
                  <rect x={(X(i) + X(i - 1)) / 2 - 7} y={CY1 - 3} width={10} height={6} fill="#020904" stroke="none" />
                  <text x={(X(i) + X(i - 1)) / 2} y={CY1 + 76} fill={tint} fillOpacity={0.5} stroke="none" fontFamily={MONO} fontSize={18} textAnchor="middle">{`${yrs[i] - yrs[i - 1] - 1} YRS NOT SHOWN`}</text>
                </g>) : null))}
              {/* primer punto: la columna que sube */}
              {t > 36 && <line x1={pts[0].x} y1={CY1} x2={pts[0].x} y2={pts[0].y} stroke={GREEN} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="3 6" />}
              {segs}
              {/* valores en cada punto alcanzado */}
              {points.map((p, i) => {
                const vis = i === 0 ? ease((t - 58) / 8) : clamp((sProg - i) * 4 + 1) * (sProg >= i ? 1 : 0);
                if (vis <= 0) return null;
                const pv = i > 0 ? points[i - 1].value : -1;
                const nv = i < n - 1 ? points[i + 1].value : -1;
                const isMax = p.value >= pv && p.value >= nv;
                const isMin = (pv < 0 || p.value <= pv) && (nv < 0 || p.value <= nv);
                const dx = isMax || isMin ? 0 : 20;
                const dy = isMax ? -24 : isMin ? 46 : 9;
                const anchor = isMax || isMin ? "middle" : "start";
                const col = i === crash && crashHold > 0 ? RED : GREEN;
                return (
                  <g key={`v${i}`} opacity={vis}>
                    <circle cx={pts[i].x} cy={pts[i].y} r={8} fill="#021006" stroke={col} strokeWidth={3} />
                    <text x={pts[i].x + dx} y={pts[i].y + dy} fill={col} fontFamily={MONO} fontWeight={700} fontSize={28} textAnchor={anchor} style={{ textShadow: `0 0 8px ${col}` } as any}>{money(p.value)}</text>
                  </g>
                );
              })}
              {/* cabezal */}
              {t > 36 && (
                <g>
                  <circle cx={t < 64 ? pts[0].x : head.x} cy={t < 64 ? pts[0].y : head.y} r={16} fill={tint} opacity={0.25} />
                  <circle cx={t < 64 ? pts[0].x : head.x} cy={t < 64 ? pts[0].y : head.y} r={6} fill="#eafff0" />
                </g>
              )}
            </svg>
            {/* alerta de crash */}
            {cr > 0 && (
              <div style={{ position: "absolute", left: Math.max(pts[crash].x, pts[crash - 1].x) + 110, top: (pts[crash].y + pts[crash - 1].y) / 2 - 60, opacity: crashHold * (1 - endIn * 0.6) }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 58, color: RED, textShadow: `0 0 16px ${RED}`, whiteSpace: "nowrap" }}>▼ -{dropCrash}%</div>
                <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: RED, opacity: 0.85, whiteSpace: "nowrap" }}>{yrs[crash] - yrs[crash - 1] <= 1 ? "IN ONE SEASON" : `${points[crash - 1].label} → ${points[crash].label}`}</div>
              </div>
            )}
            {/* resumen final */}
            {endIn > 0 && (
              <div style={{ position: "absolute", right: 80, top: 250, textAlign: "right", opacity: endIn }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 84, color: RED, textShadow: `0 0 18px ${RED}` }}>-{dropTotal}%</div>
                <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: GREEN, opacity: 0.85 }}>FROM PEAK · {points[n - 1].label}</div>
              </div>
            )}
            {/* scanlines + banda que rueda + viñeta del tubo */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.38) 0 2px, rgba(0,0,0,0) 2px 4px)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: ((frame * 7) % (SH + 300)) - 200, height: 160, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(200,255,220,0.05), rgba(255,255,255,0))" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,0,0,0.025) 0 1px, rgba(0,255,0,0.025) 1px 2px, rgba(0,0,255,0.025) 2px 3px)" }} />
          </div>
          {/* apagado: punto de luz */}
          {offT > 0.55 && offT < 1 && (
            <div style={{ position: "absolute", left: SW / 2 - 60, top: SH / 2 - 60, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(closest-side, rgba(230,255,235,0.9), rgba(92,255,138,0.3) 40%, rgba(0,0,0,0))", opacity: 1 - (offT - 0.55) / 0.45 }} />
          )}
          {/* curvatura + reflejo del vidrio */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 34, boxShadow: "inset 0 0 120px 30px rgba(0,0,0,0.85), inset 0 0 30px rgba(0,0,0,0.9)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 22%, rgba(255,255,255,0) 40%), radial-gradient(ellipse 50% 30% at 30% 12%, rgba(255,255,255,0.06), rgba(255,255,255,0))" }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />
      <Grain o={0.18} />
    </AbsoluteFill>
  );
};
