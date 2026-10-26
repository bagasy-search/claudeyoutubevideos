// Piezas de lc-a (Ep1-2): actor con valores por defecto, el cuaderno rojo del censo (inserto de pantalla), auto de cerca
// con la campera doblada, la nota de la heladera y el dato grande que rueda.
import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { useF } from "../../anikit/camara";
import { Actor, Paso } from "../../anikit/actor";
import { Look, Pose } from "../../anikit/personaje";
import { F_MANO, F_HUD } from "../../anikit/pantalla";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { F_MONO } from "../hud";

export const kDe = (t0: number) => (t: number) => Math.round((t - t0) * 30);
export type Clv<T> = { f: number; v: T; d?: number }[];

// el kit toma y = 0 en un paso sin y (salvo el último): se arrastra la última y conocida
const llenarY = (r: Paso[]) => { let y = r[0].y ?? 0; return r.map((q) => (q.y === undefined ? { ...q, y } : ((y = q.y), q))); };
// los dos en primer plano, grandes, encima del decorado (svg en pantalla, como la miniatura)
export const DuoFrente: React.FC<{ looks: [Look, Look]; xs?: [number, number]; y?: number; escala?: number; luz?: any; caras?: [string, string]; dir?: 1 | -1; manoJune?: React.ReactNode }> = ({ looks, xs = [330, 600], y = 1250, escala = 2.3, luz, caras = ["neutral", "neutral"], dir = 1, manoJune }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <Pj look={looks[0]} ruta={[{ f: 0, x: xs[0], y }]} escala={escala} dir={[{ f: 0, v: dir }]} caras={[{ f: 0, v: caras[0] }]} miradas={[{ f: 0, v: { x: dir, y: -0.1 } }]} luz={luz} />
    <Pj look={looks[1]} ruta={[{ f: 0, x: xs[1], y: y + 40 }]} escala={escala * 0.93} dir={[{ f: 0, v: dir }]} caras={[{ f: 0, v: caras[1] }]} miradas={[{ f: 0, v: { x: dir, y: -0.1 } }]} luz={luz} seed={2} enManoD={manoJune} />
  </svg>
);
// sin `asiento` explícito, «sentadoSuelo» se apoya en el piso (antes la cadera quedaba en el aire)
const asientoAuto = (poses?: Clv<string | Partial<Pose>>): Clv<number | undefined> | undefined =>
  poses && poses.some((k) => k.v === "sentadoSuelo") ? poses.map((k) => ({ f: k.f, v: k.v === "sentadoSuelo" ? 8 : undefined })) : undefined;
export const Pj: React.FC<{ look: Look; ruta: Paso[]; poses?: Clv<string | Partial<Pose>>; caras?: Clv<string>; dir?: Clv<1 | -1>; habla?: [number, number][]; enManoD?: React.ReactNode | ((f: number) => React.ReactNode); enManoI?: React.ReactNode | ((f: number) => React.ReactNode); miradas?: Clv<{ x: number; y: number }>; escala?: number; seed?: number; luz?: any; asiento?: Clv<number | undefined>; ajuste?: (p: Pose, f: number) => Pose; giros?: Clv<number>; opacidad?: (f: number) => number; correr?: number }> = (p) => (
  <Actor look={p.look} ruta={llenarY(p.ruta)} poses={p.poses ?? [{ f: 0, v: "parado" }]} caras={p.caras ?? [{ f: 0, v: "neutral" }]} dir={p.dir} habla={p.habla}
    enManoD={p.enManoD} enManoI={p.enManoI} miradas={p.miradas} escala={p.escala ?? 1} seed={p.seed ?? 1} luz={p.luz} asiento={p.asiento ?? asientoAuto(p.poses)} ajuste={p.ajuste} giros={p.giros} opacidad={p.opacidad} correr={p.correr} />
);

// ---- props chicos en la mano ----
export const CuadernoMano: React.FC<{ abierto?: boolean }> = ({ abierto }) => abierto ? (
  <g transform="translate(-10,-30)"><rect x={-34} y={-22} width={68} height={44} rx={3} fill="#f4ecd6" /><rect x={-1} y={-22} width={2} height={44} fill="#c9bfa6" /><rect x={-38} y={-24} width={4} height={48} fill={ROJO_CENSO} /></g>
) : (
  <g transform="translate(-6,-30)"><rect x={-20} y={-28} width={40} height={56} rx={3} fill={ROJO_CENSO} /><circle cx={0} cy={2} r={9} fill="#8a5a32" /></g>
);
export const Matafuego: React.FC = () => (
  <g transform="translate(0,-20)"><rect x={-16} y={-70} width={32} height={90} rx={12} fill="#c0352c" /><rect x={-8} y={-86} width={16} height={18} fill="#2a2228" /><path d="M8,-80 q30,0 34,30" stroke="#2a2228" strokeWidth={6} fill="none" /><rect x={-16} y={-40} width={32} height={18} fill="#f2ece0" /></g>
);
export const Vela: React.FC<{ f: number }> = ({ f }) => (
  <g transform="translate(0,-26)"><rect x={-10} y={-14} width={20} height={44} fill="#f2ece0" /><ellipse cx={0} cy={30} rx={26} ry={8} fill="#b8a888" /><path d={`M0,-14 q-9,-16 ${Math.sin(f / 4) * 3},-34 q9,18 0,34 Z`} fill="#ffd27a" /></g>
);
export const Lapiz: React.FC = () => (<g transform="translate(0,-10) rotate(-30)"><rect x={-4} y={-50} width={8} height={56} fill="#e0a23a" /><path d="M-4,6 L0,18 L4,6 Z" fill="#2a2228" /></g>);
export const Bolsa: React.FC<{ color?: string }> = ({ color = "#3a5a4a" }) => (<g transform="translate(0,-10)"><rect x={-40} y={-10} width={80} height={60} rx={14} fill={color} /><path d="M-20,-10 q20,-30 40,0" stroke={color} strokeWidth={8} fill="none" /></g>);

// alce de dibujito (tapa del cuaderno)
const Alce: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-60,30 Q-62,-10 -20,-14 L40,-14 Q70,-12 70,20 L70,30 Z" fill="#7a4a26" />
    {[-50, -30, 40, 58].map((x) => <rect key={x} x={x} y={26} width={10} height={44} rx={4} fill="#5e3818" />)}
    <path d="M40,-14 Q60,-60 92,-46 Q110,-36 104,-18 Q96,-2 70,-4 Z" fill="#7a4a26" />
    <circle cx={88} cy={-36} r={5} fill="#1a120c" />
    <path d="M56,-44 q-30,-36 -6,-60 q4,20 18,14 q2,-22 18,-26 q-4,22 8,26 q10,-20 24,-14 q-8,30 -46,48 Z" fill="#e8c88a" />
  </g>
);

// ---- el cuaderno rojo de cerca (pantalla completa): tapa que se abre, página con renglones a mano ----
export type Renglon = { t: string; desde: number; tam?: number; color?: string; x?: number; y?: number; vel?: number };
export const CuadernoGrande: React.FC<{ tapa?: boolean; renglones?: Renglon[]; arrancada?: boolean; abre?: number; viejo?: number; zoom?: [number, number, number]; luz?: string; vela?: boolean }> = ({ tapa, renglones = [], arrancada, abre, viejo = 0, zoom = [0, 1, 1.06], luz = "#3a2c2a", vela }) => {
  const f = useF();
  const z = interpolate(f, [zoom[0], zoom[0] + 240], [zoom[1], zoom[2]], { extrapolateRight: "clamp" });
  const ab = abre === undefined ? (tapa ? 0 : 1) : interpolate(f, [abre, abre + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const papel = viejo > 0 ? "#efe2c0" : "#f8f2e2";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${luz} 0%, #0f0c14 85%)` }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {/* mesa de madera */}
          <rect x={0} y={0} width={1920} height={1080} fill="#4a2e1e" opacity={0.55} />
          {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={0} y={i * 130} width={1920} height={4} fill="#2e1c12" opacity={0.5} />)}
          {vela && <><circle cx={260} cy={260} r={300} fill="#ffcf6e" opacity={0.12 + 0.02 * Math.sin(f / 4)} /><g transform="translate(260,330) scale(3)"><Vela f={f} /></g></>}
          <g transform="rotate(-3 960 540)">
            <rect x={300 + (1 - ab) * 640} y={204} width={1320 - (1 - ab) * 640} height={720} rx={12} fill="#000" opacity={0.35} />
            {ab > 0.02 && <g opacity={Math.min(1, ab * 2)}>
              <rect x={960 - 640 * ab} y={190} width={640 * ab} height={720} rx={10} fill={papel} />
              {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={980 - 640 * ab} y={270 + i * 46} width={600 * ab} height={2} fill="#9fb4d4" opacity={0.6} />)}
            </g>}
            <rect x={960} y={190} width={640} height={720} rx={10} fill={papel} />
            {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={980} y={270 + i * 46} width={600} height={2} fill="#9fb4d4" opacity={0.6} />)}
            <rect x={1040} y={190} width={3} height={720} fill="#e09a9a" opacity={0.7} />
            {arrancada && <path d="M972,196 l14,40 -10,30 14,40 -12,36 12,50 -14,44 10,60 -12,50 14,60 -10,50 12,70 -14,60 8,110" stroke="#d8cfb6" strokeWidth={10} fill="none" />}
            {viejo > 0 && <><rect x={960 - 640 * ab} y={190} width={1280 * ab} height={720} rx={10} fill="#a07a3a" opacity={0.14 * viejo} /><circle cx={1460} cy={760} r={70} fill="#a07a3a" opacity={0.12 * viejo} /></>}
            {ab < 0.98 && <g transform={`translate(960,0) scale(${Math.cos(ab * Math.PI)},1) translate(-960,0)`}>
              <rect x={960} y={180} width={660} height={740} rx={14} fill={ab < 0.5 ? ROJO_CENSO : "#8a2a22"} />
              {ab < 0.5 && <>
                <rect x={1010} y={240} width={560} height={110} rx={8} fill="#f4ecd6" />
                <text x={1290} y={318} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={74} fill="#1d3a8a">CENSUS</text>
                <g transform="translate(1250,620)"><Alce s={1.6} /></g>
                <text x={1290} y={870} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#f4ecd6" opacity={0.8}>GAS · SNACKS · BAIT</text>
              </>}
            </g>}
            <rect x={952} y={186} width={16} height={728} rx={6} fill="#6a1e18" />
          </g>
        </svg>
        {ab > 0.9 && renglones.map((r, i) => <Escrito key={i} r={r} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Escrito: React.FC<{ r: Renglon }> = ({ r }) => {
  const f = useF();
  if (f < r.desde) return null;
  const n = Math.floor((f - r.desde) / (r.vel ?? 2.2)) + 1;
  return <div style={{ position: "absolute", left: r.x ?? 1100, top: r.y ?? 290, transform: "rotate(-3deg)", transformOrigin: "0 0", fontFamily: F_MANO, fontWeight: 700, fontSize: r.tam ?? 64, color: r.color ?? "#1d3a8a", whiteSpace: "pre" }}>{r.t.slice(0, n)}</div>;
};

// ---- auto de cerca con la campera doblada en el asiento ----
export const AutoCerca: React.FC<{ color?: string; nieve?: number }> = ({ color = "#2f4a5e", nieve = 0 }) => (
  <g>
    <path d="M-900,120 L-760,-160 Q-700,-250 -560,-260 L420,-260 Q560,-250 640,-160 L900,40 L900,330 L-900,330 Z" fill={color} />
    <path d="M-700,-140 Q-660,-220 -560,-226 L-120,-226 L-120,20 L-760,20 Z" fill="#26303c" />
    <path d="M-90,-226 L400,-226 Q520,-220 590,-140 L650,20 L-90,20 Z" fill="#26303c" />
    <rect x={-112} y={-240} width={22} height={560} fill={color} />
    <path d="M-500,20 L-520,-170 Q-500,-200 -440,-190 L-400,20 Z" fill="#4a4048" />
    <rect x={-520} y={-14} width={420} height={40} rx={12} fill="#4a4048" />
    <g transform="translate(-300,-24)">
      <rect x={-100} y={-34} width={200} height={40} rx={10} fill="#6a7a5a" />
      <rect x={-100} y={-62} width={200} height={32} rx={10} fill="#7a8a6a" />
      <path d="M-80,-60 q80,-20 160,0" stroke="#4a5a3a" strokeWidth={6} fill="none" />
      <rect x={-6} y={-62} width={12} height={64} fill="#cfc8b0" opacity={0.7} />
    </g>
    <path d="M-680,-150 q-40,90 0,180" stroke="#141218" strokeWidth={16} fill="none" />
    <path d="M-120,-226 L-700,-140 L-700,-120 L-120,-200 Z" fill="#ffffff" opacity={0.08} />
    <circle cx={-560} cy={330} r={110} fill="#17141a" /><circle cx={-560} cy={330} r={50} fill="#5a5660" />
    <circle cx={560} cy={330} r={110} fill="#17141a" /><circle cx={560} cy={330} r={50} fill="#5a5660" />
    <rect x={180} y={60} width={70} height={14} rx={7} fill="#1d1a20" />
    {nieve > 0 && <path d="M-560,-262 Q0,-300 420,-262 Z" fill="#eef2fa" opacity={nieve} />}
  </g>
);

// ---- nota de heladera (pantalla): título + renglones que se escriben ----
export const NotaHeladera: React.FC<{ titulo?: string; renglones: { t: string; desde: number; tachado?: number }[]; x?: number; y?: number; w?: number; rot?: number; tam?: number }> = ({ titulo, renglones, x = 520, y = 150, w = 880, rot = -2, tam = 60 }) => {
  const f = useF();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${rot}deg)`, background: "#fdf6d8", borderRadius: 6, padding: "44px 54px", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
      <div style={{ position: "absolute", top: -22, left: w / 2 - 30, width: 60, height: 44, borderRadius: 12, background: ROJO_CENSO, boxShadow: "0 4px 8px rgba(0,0,0,0.4)" }} />
      {titulo && <div style={{ fontFamily: F_MANO, fontWeight: 700, fontSize: tam * 0.9, color: "#c0352c", marginBottom: 10 }}>{titulo}</div>}
      {renglones.map((r, i) => {
        const n = f >= r.desde ? Math.floor((f - r.desde) / 1.6) + 1 : 0;
        const raya = r.tachado !== undefined ? interpolate(f, [r.tachado, r.tachado + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        return <div key={i} style={{ position: "relative", fontFamily: F_MANO, fontWeight: 700, fontSize: tam, color: "#1d3a8a", minHeight: tam * 1.3, whiteSpace: "nowrap" }}>
          {r.t.slice(0, n)}
          {raya > 0 && <div style={{ position: "absolute", left: -6, top: "50%", height: 8, width: `${raya * 100}%`, background: "#d8382c", borderRadius: 4 }} />}
        </div>;
      })}
    </div>
  );
};

// ---- dato grande centrado (número que rueda con rótulo), en pantalla ----
export const fmtN = (n: number) => Math.round(n).toLocaleString("en-US");
export const DatoGrande: React.FC<{ claves: Clv<number>; rotulo?: string; sufijo?: string; prefijo?: string; color?: string; y?: number; tam?: number; desde?: number; hasta?: number }> = ({ claves, rotulo, sufijo = "", prefijo = "", color = AMBAR, y = 380, tam = 170, desde = 0, hasta = 1e9 }) => {
  const f = useF();
  let v = claves[0].v;
  for (let i = 1; i < claves.length; i++) { const k = claves[i]; if (f < k.f) break; const u = interpolate(f, [k.f, k.f + (k.d ?? 24)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }); v = v + (k.v - v) * u; }
  const o = interpolate(f, [desde, desde + 8, hasta, hasta + 8], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n = Math.round(v);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, transform: `scale(${0.92 + 0.08 * o})` }}>
      <div style={{ fontFamily: F_MONO, fontWeight: 800, fontSize: tam, color, letterSpacing: 2, textShadow: `0 0 40px ${color}88, 0 8px 22px rgba(0,0,0,0.6)`, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{prefijo}{n < 0 ? "−" + fmtN(-n) : fmtN(n)}{sufijo}</div>
      {rotulo && <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: Math.max(34, tam * 0.24), color: "#f6ecd2", letterSpacing: 6, marginTop: 6, textShadow: "0 4px 12px rgba(0,0,0,0.7)" }}>{rotulo}</div>}
    </div>
  );
};

// rótulo de nombre (persona nueva): nombre en ámbar + bajada
export const Rotulo: React.FC<{ nombre: string; bajada: string; x?: number; y?: number; desde: number; hasta?: number }> = ({ nombre, bajada, x = 120, y = 800, desde, hasta = 1e9 }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 10, hasta, hasta + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dx = interpolate(f, [desde, desde + 14], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x + dx, top: y, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ display: "inline-block", background: "#120f18", borderLeft: `8px solid ${AMBAR}`, padding: "10px 24px", fontFamily: F_HUD, fontWeight: 700, fontSize: 52, color: AMBAR, letterSpacing: 2 }}>{nombre}</div>
      <div style={{ marginTop: 6, display: "inline-block", background: "#120f18cc", padding: "6px 24px", fontFamily: F_HUD, fontWeight: 500, fontSize: 30, color: "#f6ecd2", letterSpacing: 3 }}>{bajada}</div>
    </div>
  );
};
