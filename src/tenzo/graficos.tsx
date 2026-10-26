// Gráficos de pantalla completa de Tenzo Films (gris + UN acento): el celular gigante, la barra del día, la ola del impulso.
// Van como plano entero o encima de una Escena (en `hud` o después de ella). Tiempos en cuadros locales del plano.
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";
import { ACENTO, BLANCO_MANO } from "./elenco";
import { hm } from "./hud";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const suave = (t: number) => t * t * (3 - 2 * t);

// tarjeta del feed (rectángulos grises, ninguna imagen): `k` decide el tono y el alto
const Tarjeta: React.FC<{ y: number; k: number; w: number }> = ({ y, k, w }) => {
  const h = [300, 420, 360, 260][k % 4];
  const tono = ["#3a3f48", "#2e333b", "#444a54", "#353a43"][k % 4];
  return (
    <div style={{ position: "absolute", left: 24, top: y, width: w - 48, height: h, borderRadius: 26, background: tono, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 22, top: 22, width: 54, height: 54, borderRadius: 27, background: k % 3 === 0 ? ACENTO : "#5a606b" }} />
      <div style={{ position: "absolute", left: 92, top: 30, width: 180, height: 14, borderRadius: 7, background: "#6a707b" }} />
      <div style={{ position: "absolute", left: 92, top: 56, width: 110, height: 12, borderRadius: 6, background: "#525863" }} />
      <div style={{ position: "absolute", left: 22, top: 96, right: 22, bottom: 60, borderRadius: 18, background: k % 2 ? "#4c525d" : "#3f4550" }} />
      {[0, 1, 2].map((q) => <div key={q} style={{ position: "absolute", left: 22 + q * 70, bottom: 18, width: 40, height: 26, borderRadius: 8, background: q === 0 && k % 3 === 0 ? ACENTO : "#5a606b" }} />)}
    </div>
  );
};

// EL CELULAR GIGANTE. modo: "hora" (texto grande, p. ej. 3:00 AM) · "screentime" (min, con barras) · "feed" (scroll: vel px/cuadro) · "apagado"
export const TelGrande: React.FC<{ modo: "hora" | "screentime" | "feed" | "apagado"; texto?: string; sub?: string; min?: number; minHasta?: number; vel?: number; x?: number; y?: number; s?: number; desde?: number; pulgar?: boolean; inclina?: number }> = ({ modo, texto = "3:00", sub = "AM", min = 582, minHasta, vel = 14, x = 960, y = 560, s = 1, desde = 0, pulgar, inclina = 0 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f - desde, fps, config: { damping: 16, stiffness: 120 } });
  const W = 520, H = 1000;
  const m = minHasta !== undefined ? Math.round(interpolate(f, [desde + 10, desde + 50], [min, minHasta], cl)) : min;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: x - (W / 2) * s, top: y - (H / 2) * s, width: W, height: H, transform: `scale(${s * (0.85 + 0.15 * e)}) rotate(${inclina}deg)`, transformOrigin: "0 0", opacity: desde <= 2 ? 1 : Math.min(1, e * 1.6) }}>
        {/* halo de la pantalla */}
        {modo !== "apagado" && <div style={{ position: "absolute", left: -260, top: -260, width: W + 520, height: H + 520, borderRadius: "50%", background: `radial-gradient(closest-side, ${ACENTO}55, transparent)` }} />}
        <div style={{ position: "absolute", inset: 0, borderRadius: 70, background: "#15171c", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", left: 22, top: 22, right: 22, bottom: 22, borderRadius: 52, overflow: "hidden", background: modo === "apagado" ? "#0b0c0f" : "#22262d" }}>
          {modo === "hora" && (
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(#2a2e36, #1a1d23)` }}>
              <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 190, color: BLANCO_MANO, letterSpacing: -4 }}>{texto}</div>
              <div style={{ position: "absolute", top: 370, width: "100%", textAlign: "center", fontFamily: F_HUD, fontWeight: 500, fontSize: 64, color: ACENTO }}>{sub}</div>
              {[0, 1, 2].map((q) => <div key={q} style={{ position: "absolute", left: 40, right: 40, top: 520 + q * 120, height: 96, borderRadius: 24, background: "#353a43", opacity: interpolate(f, [desde + 12 + q * 6, desde + 20 + q * 6], [0, 1], cl) }}><div style={{ position: "absolute", left: 20, top: 22, width: 52, height: 52, borderRadius: 14, background: q === 0 ? ACENTO : "#5a606b" }} /><div style={{ position: "absolute", left: 92, top: 30, width: 220, height: 14, borderRadius: 7, background: "#6a707b" }} /><div style={{ position: "absolute", left: 92, top: 56, width: 140, height: 12, borderRadius: 6, background: "#525863" }} /></div>)}
            </div>
          )}
          {modo === "screentime" && (
            <div style={{ position: "absolute", inset: 0, padding: 40, fontFamily: F_HUD }}>
              <div style={{ color: "#9aa0aa", fontSize: 38, fontWeight: 500, marginTop: 40 }}>SCREEN TIME</div>
              <div style={{ color: "#9aa0aa", fontSize: 30, marginTop: 4 }}>Today</div>
              <div style={{ color: ACENTO, fontSize: 118, fontWeight: 600, marginTop: 20, letterSpacing: -3, whiteSpace: "nowrap", textShadow: `0 0 30px ${ACENTO}88` }}>{hm(m)}</div>
              <div style={{ position: "absolute", left: 40, right: 40, top: 430, height: 300, display: "flex", alignItems: "flex-end", gap: 12 }}>
                {[0.2, 0.1, 0.05, 0.0, 0.0, 0.1, 0.3, 0.45, 0.4, 0.6, 0.55, 0.7, 0.8, 0.9, 1].map((v, q) => <div key={q} style={{ flex: 1, height: `${100 * v * interpolate(f, [desde + 6 + q * 2, desde + 18 + q * 2], [0, 1], cl)}%`, borderRadius: 6, background: q > 10 ? ACENTO : "#5a606b" }} />)}
              </div>
              {["Social", "Video", "Games"].map((n, q) => <div key={n} style={{ position: "absolute", left: 40, right: 40, top: 770 + q * 56, height: 40, color: "#c9ced6", fontSize: 30, display: "flex", justifyContent: "space-between" }}><span>{n}</span><span style={{ color: q === 0 ? ACENTO : "#c9ced6" }}>{["5h 51m", "2h 37m", "1h 14m"][q]}</span></div>)}
            </div>
          )}
          {modo === "feed" && (
            <div style={{ position: "absolute", inset: 0 }}>
              {Array.from({ length: 14 }).map((_, k) => {
                const alto = 460; const off = ((f - desde) * vel) % (alto * 14);
                return <Tarjeta key={k} k={k} w={W - 44} y={k * alto - off + (k * alto - off < -alto ? alto * 14 : 0)} />;
              })}
            </div>
          )}
          <div style={{ position: "absolute", left: "50%", top: 18, width: 120, height: 32, marginLeft: -60, borderRadius: 16, background: "#0b0c0f" }} />
        </div>
        {pulgar && (() => {
          const ciclo = ((f - desde) % 24) / 24;
          const py = interpolate(ciclo, [0, 0.45, 0.6, 1], [760, 420, 420, 760]);
          return <div style={{ position: "absolute", left: 300, top: py, width: 210, height: 560, borderRadius: "100px 100px 40px 40px", background: "#ecc9a3", border: "6px solid #3a2a20", transform: "rotate(-16deg)" }}><div style={{ position: "absolute", left: 40, top: 26, width: 120, height: 90, borderRadius: "50px 50px 30px 30px", background: "#f6dcc0" }} /></div>;
        })()}
      </div>
    </AbsoluteFill>
  );
};

// LA BARRA DEL DÍA: 24 bloques; se llenan `horas` de ámbar (9,7 = nueve horas y 42)
export const BarraDia: React.FC<{ horas: number; desde?: number; rotulo?: string }> = ({ horas, desde = 0, rotulo = "ONE DAY" }) => {
  const f = useF();
  const lleno = interpolate(f, [desde + 8, desde + 60], [0, horas], { ...cl, easing: suave });
  return (
    <AbsoluteFill style={{ background: "#14161b" }}>
      <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: F_HUD, fontWeight: 500, fontSize: 52, color: "#9aa0aa", letterSpacing: 8 }}>{rotulo}</div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 420, height: 170, display: "flex", gap: 10 }}>
        {Array.from({ length: 24 }).map((_, k) => {
          const v = Math.max(0, Math.min(1, lleno - k));
          return <div key={k} style={{ flex: 1, borderRadius: 10, background: "#2b2f37", overflow: "hidden", position: "relative" }}><div style={{ position: "absolute", left: 0, bottom: 0, top: 0, width: `${v * 100}%`, background: ACENTO, boxShadow: v > 0 ? `0 0 24px ${ACENTO}aa` : undefined }} /></div>;
        })}
      </div>
      <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 110, color: ACENTO }}>{hm(Math.round(lleno * 60))}</div>
    </AbsoluteFill>
  );
};

// LA OLA DEL IMPULSO: curva que sube y baja en ~90 s simulados. `p` 0..1 = cuánto se dibujó; reloj 0:00→1:30 si `reloj`
export const Ola: React.FC<{ p: number; reloj?: boolean; seg?: number; fondo?: boolean; y?: number; color?: string }> = ({ p, reloj = true, seg, fondo = true, y = 0, color = ACENTO }) => {
  const W = 1400, H = 420, X0 = 260, Y0 = 760 + y;
  const curva = (u: number) => Math.exp(-Math.pow((u - 0.45) / 0.2, 2)); // campana: pico a los ~40 s
  const n = 80;
  const pts = Array.from({ length: Math.max(2, Math.round(n * p)) }).map((_, i) => { const u = (i / n); return `${X0 + u * W},${Y0 - curva(u) * H}`; });
  const u = p, px = X0 + u * W, py = Y0 - curva(u) * H;
  const s = seg ?? Math.round(p * 90);
  return (
    <AbsoluteFill style={{ background: fondo ? "#14161b" : undefined }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke="#4a4f58" strokeWidth={4} />
        {[0, 30, 60, 90].map((t) => <g key={t}><line x1={X0 + (t / 90) * W * 0.92} y1={Y0} x2={X0 + (t / 90) * W * 0.92} y2={Y0 + 16} stroke="#6a707b" strokeWidth={4} /><text x={X0 + (t / 90) * W * 0.92} y={Y0 + 60} fill="#9aa0aa" fontFamily={F_HUD} fontSize={36} textAnchor="middle">{t}s</text></g>)}
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={px} cy={py} r={18} fill={color} />
        <circle cx={px} cy={py} r={40} fill={color} opacity={0.25} />
      </svg>
      {reloj && <div style={{ position: "absolute", right: 200, top: 160, fontFamily: F_HUD, fontWeight: 600, fontSize: 120, color: BLANCO_MANO, fontVariantNumeric: "tabular-nums" }}>{Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}</div>}
    </AbsoluteFill>
  );
};

// LLAMA (fuego del deseo) en coordenadas SVG del mundo: `t` tamaño 0..1, `f` para el temblor
export const Llama: React.FC<{ x: number; y: number; t: number; f: number; color?: string }> = ({ x, y, t, f, color = ACENTO }) => {
  if (t <= 0.01) return null;
  const a = 1 + 0.08 * Math.sin(f / 3) + 0.05 * Math.sin(f / 1.7);
  return (
    <g transform={`translate(${x},${y}) scale(${t},${t * a})`}>
      <circle cx={0} cy={-60} r={140} fill={color} opacity={0.18} />
      <path d="M0,0 C-70,-20 -60,-110 -10,-170 C-20,-110 30,-110 20,-60 C50,-90 50,-130 40,-160 C90,-110 80,-20 0,0 Z" fill={color} />
      <path d="M0,-6 C-30,-16 -30,-60 0,-96 C10,-60 30,-40 0,-6 Z" fill="#ffd2a0" />
    </g>
  );
};
