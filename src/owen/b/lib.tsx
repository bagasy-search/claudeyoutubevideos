// Librería de la sesión B (ob04-ob06): armado de planos por segundos de la voz + foley, sets/recursos chicos.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { Trans, PlanoM } from "../../anikit/montaje";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { SetProps } from "../../anikit/sets/comun";
import { Halo } from "../../anikit/luz";
import { PersonaP } from "./gente";
import { BUS_PISO, BUS_PUNTOS } from "../mundo/bus";
import { Look, LuzP } from "../../anikit/personaje";

export const FPS = 30;
export type Sfx = [number, string, number?, Record<string, unknown>?]; // [segundo ABSOLUTO de la voz, pool, dB, opciones]
export type K = (s: number) => number; // segundo absoluto → cuadro local del plano
export type PlanB = { a: number; b: number; el: (k: K) => React.ReactNode; trans?: Trans; sfx?: Sfx[]; nota?: string };

// planos contiguos [a, b) en segundos → Montaje + lista de cues para mezcla_b.py
export const armar = (planos: PlanB[]) => {
  const out: PlanoM[] = [];
  const cues: Sfx[] = [];
  planos.forEach((p, i) => {
    const A = Math.round(p.a * FPS), B = Math.round(p.b * FPS);
    if (i > 0 && Math.abs(planos[i - 1].b - p.a) > 0.001) throw new Error(`plano ${i} no es contiguo (${planos[i - 1].b} → ${p.a})`);
    const k: K = (s) => Math.round((s - p.a) * FPS);
    // el plano se arma dentro de un componente: así los hooks (useF) que van sueltos en las props corren en render
    const El: React.FC = () => {
      // respiración de cámara continua (zoom ±0,6 % y deriva de pocos px): ningún tramo queda idéntico ~2 s y el QC del farm no lo marca congelado
      const f = useF();
      const z = 1.02 + Math.sin(f / 41) * 0.006, dx = Math.sin(f / 53) * 5, dy = Math.cos(f / 47) * 4;
      return <AbsoluteFill style={{ transform: `translate(${dx}px,${dy}px) scale(${z})` }}>{p.el(k)}</AbsoluteFill>;
    };
    out.push({ dur: B - A, el: <El />, trans: p.trans });
    (p.sfx ?? []).forEach((c) => cues.push(c));
  });
  return { planos: out, cues, total: Math.round(planos[planos.length - 1].b * FPS) };
};

// ---------- gente sentada en el bus / parada ----------
export const sentadoBus = (look: Look, x: number, extra: Partial<PersonaP> = {}): PersonaP => ({
  look, ruta: [{ f: 0, x, y: BUS_PISO }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: BUS_PUNTOS.asiento }], poses: [{ f: 0, v: "sentado" }],
  luz: { lado: 1, color: "#d8fff2", fuerza: 0.75 }, seed: Math.round(x) % 97, ...extra,
});
export const parado = (look: Look, x: number, piso: number, extra: Partial<PersonaP> = {}): PersonaP => ({
  look, ruta: [{ f: 0, x, y: piso }], luz: { lado: 1, color: "#ffd88a", fuerza: 0.8 }, seed: Math.round(x) % 89, ...extra,
});
// sentado + celular (cabeza abajo, la pantalla le ilumina la cara)
export const POSE_CELU_SENTADO = { hD: 30, cD: 125, cabeza: 22, tronco: 6, hI: 8, cI: 30, pI: 85, rI: -80, pD: 88, rD: -85 };

// ---------- set PIZARRA: fondo de explicación (azul noche con grilla suave y una luz) ----------
export const Pizarra: React.FC<SetProps & { tono?: string; luz?: string }> = ({ capa, f, tono = "#10202a", luz = "#43e0b4" }) => {
  if (capa === "lejos") return (
    <g>
      <rect x={-3000} y={-2000} width={9000} height={5000} fill={tono} />
      <Halo x={960} y={420} r={1300} color={luz} fuerza={0.18} />
    </g>
  );
  if (capa === "frente") return <g />;
  return (
    <g opacity={0.5} transform={`translate(${-((f * 0.7) % 120)},${-((f * 0.35) % 120)})`}>
      {Array.from({ length: 50 }).map((_, i) => <rect key={`v${i}`} x={-2000 + i * 120} y={-1500} width={1.5} height={4000} fill="#ffffff" opacity={0.05} />)}
      {Array.from({ length: 34 }).map((_, i) => <rect key={`h${i}`} x={-2000} y={-1500 + i * 120} width={6000} height={1.5} fill="#ffffff" opacity={0.05} />)}
      {Array.from({ length: 30 }).map((_, i) => <circle key={`p${i}`} cx={-400 + random(`pz${i}`) * 2800 + Math.sin(f / 30 + i) * 24} cy={-100 + random(`pzy${i}`) * 1300 + Math.cos(f / 26 + i) * 14} r={2 + random(`pzr${i}`) * 3} fill={luz} opacity={0.25} />)}
    </g>
  );
};

// ---------- globo de diálogo EN EL MUNDO (sigue a la cámara). x,y = punta de la cola ----------
export const GloboM: React.FC<{ x: number; y: number; texto: string; desde: number; hasta: number; tam?: number; lado?: 1 | -1; pensamiento?: boolean }> = ({ x, y, texto, desde, hasta, tam = 30, lado = 1, pensamiento }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 11, stiffness: 170 } });
  const o = interpolate(f, [hasta - 6, hasta], [1, 0], { extrapolateLeft: "clamp" });
  const lineas = texto.split("\n");
  const w = Math.max(...lineas.map((l) => l.length)) * tam * 0.52 + tam * 1.4, h = lineas.length * tam * 1.22 + tam * 0.9;
  const bx = x + lado * 30 - (lado > 0 ? 0 : w), by = y - 40 - h;
  // máquina de escribir: las letras aparecen a ~28 por segundo
  const n = Math.floor((f - desde) * (28 / fps));
  let resto = n;
  return (
    <g opacity={o} transform={`translate(${x},${y}) scale(${0.5 + 0.5 * s}) translate(${-x},${-y})`}>
      {pensamiento
        ? [0, 1].map((i) => <circle key={i} cx={x + lado * (8 + i * 16)} cy={y - 10 - i * 16} r={5 + i * 4} fill="#fbf8f1" stroke="#221c18" strokeWidth={3} />)
        : <path d={`M${x},${y} L${x + lado * 70},${by + h - 4} L${x + lado * 22},${by + h - 4} Z`} fill="#fbf8f1" stroke="#221c18" strokeWidth={3} />}
      <rect x={bx} y={by} width={w} height={h} rx={tam * 0.7} fill="#fbf8f1" stroke="#221c18" strokeWidth={3} />
      {lineas.map((l, i) => {
        const vis = l.slice(0, Math.max(0, resto)); resto -= l.length;
        return <text key={i} x={bx + tam * 0.7} y={by + tam * 1.1 + i * tam * 1.22} fontFamily={F_MANO} fontWeight={700} fontSize={tam * 1.12} fill="#221c18">{vis}</text>;
      })}
    </g>
  );
};

// ---------- viñeta: una escena chica dentro de un marco (recuerdo / lo que cuenta el personaje) ----------
export const Vineta: React.FC<{ x: number; y: number; w: number; desde: number; hasta: number; rot?: number; children: React.ReactNode; color?: string }> = ({ x, y, w, desde, hasta, rot = -2, children, color = "#f4efe4" }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde - 1 || f > hasta) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 120 } });
  const o = interpolate(f, [hasta - 8, hasta], [1, 0], { extrapolateLeft: "clamp" });
  const h = (w * 9) / 16, e = w / 1920;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `rotate(${rot}deg) scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 60}px)`, borderRadius: 18, border: `8px solid ${color}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${e})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
};

// ---------- tarjeta de la semana (WEEK 4 · PARTICIPANT 47 · 44 STILL IN) ----------
export const TarjetaSemana: React.FC<{ lineas: { t: string; desde: number; color?: string; tam?: number }[]; hasta: number }> = ({ lineas, hasta }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const o = interpolate(f, [hasta - 8, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      {lineas.map((l, i) => {
        const s = spring({ frame: f - l.desde, fps, config: { damping: 12, stiffness: 160 } });
        if (f < l.desde) return <div key={i} style={{ height: (l.tam ?? 90) * 1.15 }} />;
        return <div key={i} style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: l.tam ?? 90, lineHeight: 1.15, color: l.color ?? "#f4efe4", letterSpacing: 4, transform: `scale(${0.6 + 0.4 * s})`, opacity: s, textShadow: "0 6px 0 rgba(0,0,0,0.35)" }}>{l.t}</div>;
      })}
    </AbsoluteFill>
  );
};

// ---------- celular en primer plano con un mensaje que se escribe ----------
export const CeluMensaje: React.FC<{ de: string; lineas: string[]; desde: number; escribe?: number; x?: number; y?: number; esc?: number; vibra?: number; hora?: string }> = ({ de, lineas, desde, escribe, x = 960, y = 560, esc = 1, vibra = 0, hora = "5:12" }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 90 } });
  const vib = vibra && f >= vibra && f < vibra + 24 ? Math.sin(f * 2.6) * 6 : 0;
  // escribe = cuadro en que empieza a aparecer el texto (por defecto, apenas sube el celular)
  let n = Math.max(0, Math.floor((f - (escribe ?? desde + 12)) * 1.1));
  // flota siempre (el QC del farm marca congelado todo tramo quieto de ~2 s)
  const fx = Math.sin(f / 33) * 6, fy = Math.sin(f / 24) * 9, fr = Math.sin(f / 45) * 0.8;
  return (
    <div style={{ position: "absolute", left: x - 230 * esc + vib + fx, top: y - 420 * esc + (1 - s) * 700 + fy, transform: `rotate(${fr}deg)`, width: 460 * esc, height: 860 * esc, borderRadius: 60 * esc, background: "#141418", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", padding: 18 * esc, boxSizing: "border-box" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 44 * esc, background: "linear-gradient(#1d2733,#0e141b)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 60 * esc, width: "100%", textAlign: "center", fontFamily: F_HUD, fontWeight: 500, color: "#e9eef2", fontSize: 92 * esc }}>{hora}</div>
        <div style={{ position: "absolute", top: 230 * esc, left: 22 * esc, right: 22 * esc, borderRadius: 28 * esc, background: "rgba(240,244,248,0.94)", padding: `${22 * esc}px ${24 * esc}px`, fontFamily: F_HUD, color: "#20242c" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 * esc, fontSize: 22 * esc, fontWeight: 600, color: "#2a6fd6" }}>
            <div style={{ width: 34 * esc, height: 34 * esc, borderRadius: 9 * esc, background: "#2a6fd6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 * esc }}>H</div>{de}
          </div>
          {lineas.map((l, i) => {
            const vis = l.slice(0, Math.max(0, n)); n -= l.length;
            return <div key={i} style={{ fontSize: 30 * esc, fontWeight: i === 0 ? 600 : 500, marginTop: 10 * esc, minHeight: 36 * esc }}>{vis}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

// ---------- utilería ----------
// factura del hospital (la de la cadera de Rosa): monto con el número grande
export const Factura: React.FC<{ x: number; y: number; s?: number; rot?: number; monto?: string; titulo?: string; sello?: number }> = ({ x, y, s = 1, rot = 0, monto = "$31,412.00", titulo = "SAINT ANTHONY HOSPITAL", sello = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-160} width={240} height={320} rx={4} fill="#fbf7ee" stroke="#c9c2b0" strokeWidth={2} />
    <text x={0} y={-126} fontFamily={F_HUD} fontWeight={600} fontSize={15} fill="#2a3a5a" textAnchor="middle">{titulo}</text>
    <text x={0} y={-104} fontFamily={F_HUD} fontSize={11} fill="#6a7280" textAnchor="middle">PATIENT: R. MARSH · HIP REPLACEMENT</text>
    {Array.from({ length: 8 }).map((_, i) => <g key={i}><rect x={-100} y={-84 + i * 18} width={120} height={5} rx={2} fill="#d6d2c6" /><rect x={50} y={-84 + i * 18} width={50} height={5} rx={2} fill="#d6d2c6" /></g>)}
    <rect x={-100} y={74} width={200} height={2} fill="#2a2a2a" />
    <text x={-100} y={104} fontFamily={F_HUD} fontWeight={600} fontSize={14} fill="#2a2a2a">AMOUNT DUE</text>
    <text x={100} y={134} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#c23a2e" textAnchor="end">{monto}</text>
    {sello > 0 && <g opacity={sello} transform={`rotate(-16) scale(${1 + (1 - sello) * 0.6})`}><rect x={-96} y={-20} width={192} height={52} rx={6} fill="none" stroke="#c23a2e" strokeWidth={5} /><text x={0} y={16} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#c23a2e" textAnchor="middle">PAST DUE</text></g>}
  </g>
);

// tostadora con humo (humo 0..1) y tostadas que saltan (salto 0..1)
export const Tostadora: React.FC<{ x: number; y: number; humo?: number; salto?: number; f: number; quemada?: number }> = ({ x, y, humo = 0, salto = 0, f, quemada = 0 }) => {
  const tost = (k: number) => {
    const c = interpolate(quemada, [0, 0.5, 1], [0, 0.6, 1]);
    const col = `rgb(${Math.round(230 - 180 * c)},${Math.round(190 - 160 * c)},${Math.round(120 - 105 * c)})`;
    return <rect key={k} x={-34 + k * 38} y={-96 - salto * 70} width={30} height={50} rx={8} fill={col} />;
  };
  return (
    <g transform={`translate(${x},${y})`}>
      {humo > 0 && Array.from({ length: 6 }).map((_, i) => {
        const t = ((f * 1.2 + i * 24) % 140) / 140;
        return <circle key={i} cx={Math.sin(f / 9 + i) * 18 * t + (i % 2 ? 14 : -14)} cy={-90 - t * 260} r={14 + t * 50} fill="#5a5a5a" opacity={humo * (1 - t) * 0.55} />;
      })}
      {tost(0)}{tost(1)}
      <rect x={-56} y={-70} width={112} height={70} rx={20} fill="#c9ced2" />
      <rect x={-50} y={-62} width={100} height={8} rx={4} fill="#e9edf0" opacity={0.7} />
      <rect x={44} y={-44} width={22} height={9} rx={4} fill="#3a3a3a" />
      {quemada > 0.6 && <circle cx={-40} cy={-20} r={5} fill="#ff3a2e" />}
    </g>
  );
};

// grilla de personitas (estadística «4 de cada 10»): encendidas = color
export const Personitas: React.FC<{ x: number; y: number; n: number; cols: number; on: number; color?: string; apagado?: string; tam?: number; desde?: number; f: number; paso?: number }> = ({ x, y, n, cols, on, color = "#7dff6a", apagado = "#3a4a52", tam = 60, desde = 0, f, paso = 2 }) => (
  <g transform={`translate(${x},${y})`}>
    {Array.from({ length: n }).map((_, i) => {
      const t = interpolate(f, [desde + i * paso, desde + i * paso + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const cx = (i % cols) * tam * 1.15, cy = Math.floor(i / cols) * tam * 1.6;
      const c = i < on ? color : apagado;
      return (
        <g key={i} transform={`translate(${cx},${cy}) scale(${t})`} opacity={t}>
          <circle cx={0} cy={-tam * 0.62} r={tam * 0.26} fill={c} />
          <path d={`M${-tam * 0.38},${tam * 0.4} Q${-tam * 0.38},${-tam * 0.3} 0,${-tam * 0.3} Q${tam * 0.38},${-tam * 0.3} ${tam * 0.38},${tam * 0.4} Z`} fill={c} />
        </g>
      );
    })}
  </g>
);

// número enorme EN EL MUNDO (para pizarras): rueda de a/b, con rótulo
export const NumeroM: React.FC<{ x: number; y: number; texto: string; rotulo?: string; desde: number; color?: string; tam?: number; ancla?: "middle" | "start" | "end" }> = ({ x, y, texto, rotulo, desde, color = "#7dff6a", tam = 160, ancla = "middle" }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 10, stiffness: 140 } });
  return (
    <g transform={`translate(${x},${y}) scale(${0.5 + 0.5 * s})`} opacity={Math.min(1, s * 1.4)}>
      <text x={0} y={0} fontFamily={F_HUD} fontWeight={600} fontSize={tam} fill={color} textAnchor={ancla} stroke="#000" strokeOpacity={0.25} strokeWidth={8} paintOrder="stroke">{texto}</text>
      {rotulo && <text x={0} y={tam * 0.42} fontFamily={F_HUD} fontWeight={500} fontSize={tam * 0.22} letterSpacing={5} fill="#e9e3d6" textAnchor={ancla}>{rotulo}</text>}
    </g>
  );
};

// rótulo de fuente chiquito abajo a la izquierda (dato real)
export const FuenteB: React.FC<{ texto: string; desde: number; hasta: number }> = ({ texto, desde, hasta }) => {
  const f = useF();
  const o = Math.min(interpolate(f, [desde, desde + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return <div style={{ position: "absolute", left: 70, bottom: 54, fontFamily: F_HUD, fontWeight: 500, fontSize: 24, color: "#e9e3d6", opacity: o * 0.85, letterSpacing: 1, textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>{texto}</div>;
};

export const luzDe = (color: string, lado: 1 | -1 = 1, fuerza = 0.8): LuzP => ({ lado, color, fuerza });
