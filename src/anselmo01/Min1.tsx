// anselmo01 · MINUTO 1 (0-107,7 s). Un solo hilo: la cocinita sin lugar → la tarima tirada en la banqueta → Don Anselmo la carga
// → portal al TALLER de adobe (el mundo): la tarima se desarma, las tablas vuelan a la pared y SE VUELVEN la mesa plegada
// (8 cm, como un cuadro) → la tarabilla gira, la tabla baja, la patita sale → 4 platos → la bisagra de madera con palo de escoba
// → el metro plegable abre los 7 pasos → herramientas → la prensa de cuñas → Don Anselmo, 50 años en el taller → regla del papá
// → la pila de tarimas → CTA (suscribirse + campanita + pregunta) → de vuelta al taller: paso 1.
// Todo clavado a la voz con at("frase"). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, MESA, V, screenOf, camSpeed, setKeys, win } from "./taller3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, DrawX, Flash, FONT, HAND, LowerThird, P, Portal, SERIF, Tag, at, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < 110);
export const MIN1_END = at("paso numero uno");
export const MIN1_FRAMES = s(MIN1_END);
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);

// ---------------- tiempos clavados a la voz ----------------
const T = {
  dosx3: at("dos por tres"), domingo: at("es domingo"), parados: at("comen parados"), rodillas: at("en las rodillas"), nocabe: at("no cabe una mesa"),
  banqueta: at("en la banqueta"), manchada: at("toda manchada"), chuecos: at("clavos chuecos"), nilave: at("ni la ve"), esa: at("esa tarima"), sumesa: at("es su mesa"),
  noocupa: at("no ocupa lugar"), mide: at("mide 8"), ocho: at("8 y queda"), cuadro: at("un cuadro"), gira: at("usted gira"), baja: at("la tabla baja"),
  patita: at("la patita"), cuatro: at("cuatro platos"), clavo: at("un solo clavo"), fierro: at("de fierro"), bmadera: at("es de madera"), escoba: at("palo de escoba"),
  aguanta: at("como aguanta"), siete: at("siete pasos"), medidas: at("las medidas"), serrucho: at("serrucho"), taladro: at("taladro"), formon: at("formon"),
  maquinas: at("maquinas caras"), paso4: at("paso cuatro"), cunas: at("con cunas"), peso: at("un peso"), compadre: at("su compadre"), nombre: at("anselmo ruiz"),
  setenta: at("70 anos"), cincuenta: at("y 50"), adobe: at("tallercito de adobe"), mich: at("michoacan"), papa: at("mi papa"), regla: at("la primera regla"),
  buena: at("la madera buena"), cajones: at("los cajones"), sillas: at("hacia sillas"), junto: at("yo junto tarimas"), antes: at("antes de seguir"),
  susc: at("suscribase"), campana: at("la campanita"), abajo: at("cuenteme aqui abajo"), usted: at("usted tiene una tarima"), arrumbada: at("arrumbada"), taller: at("vamonos al taller"),
};

// ---------------- cámara del minuto 1 (una sola; los saltos de lugar ocurren mientras el mundo está tapado) ----------------
const MC: V = PT.mesaCerrada;
setKeys([
  { t: 27.2, p: [1.4, 1.9, 3.2], l: [-0.6, 0.2, 0.7], fov: 40 },
  { t: 28.1, p: [1.2, 1.85, 2.9], l: [-0.5, 0.25, 0.5], fov: 40 },
  { t: 30.4, p: [2.2, 1.55, 0.6], l: [1.4, 0.9, -2.5], fov: 40, arc: 0.2 },        // sigue a las tablas que vuelan a la pared
  { t: 31.7, p: [2.6, 1.15, -2.0], l: [1.5, 1.05, -2.8], fov: 34 },                // de costado: el grosor plegada
  { t: 34.8, p: [2.5, 1.12, -2.1], l: [1.5, 1.05, -2.8], fov: 33 },
  { t: 35.7, p: [1.55, 1.1, -0.5], l: [1.55, 1.05, -2.8], fov: 40 },               // de frente: como un cuadro
  { t: 36.6, p: [1.55, 1.1, -0.68], l: [1.55, 1.05, -2.8], fov: 40 },
  { t: 37.0, p: [1.9, 1.2, -1.0], l: [1.55, 1.1, -2.75], fov: 42 },                // (en la mirilla) la tarabilla
  { t: 40.2, p: [2.2, 1.35, -0.8], l: [1.55, 0.85, -2.6], fov: 42 },
  { t: 41.6, p: [2.7, 1.45, -0.9], l: [1.5, 0.72, -2.5], fov: 40, arc: 0.1 },      // la patita sale
  { t: 43.7, p: [0.6, 1.75, -1.0], l: [1.55, 0.78, -2.5], fov: 40 },               // cuatro platos
  { t: 46.0, p: [0.55, 1.72, -1.05], l: [1.55, 0.78, -2.5], fov: 40 },
  { t: 46.7, p: [0.95, 0.62, -2.2], l: [1.25, 0.76, -2.76], fov: 32 },            // la bisagra de madera, de cerca y desde abajo (cubierta en rayos X)
  { t: 50.73, p: [1.0, 0.66, -2.3], l: [1.25, 0.76, -2.76], fov: 30 },
  { t: 56.41, p: [-1.6, 2.05, -0.25], l: [-1.6, 0.88, -1.6], fov: 38 },             // el banco: el metro de los 7 pasos
  { t: 60.6, p: [-1.55, 1.85, -0.4], l: [-1.6, 0.88, -1.6], fov: 38 },
  { t: 74.74, p: [0.2, 1.8, 4.8], l: [0, 1.1, -1.5], fov: 44 },                    // el taller entero: 50 años aquí
  { t: 78.8, p: [1.6, 1.7, 3.8], l: [0, 1.15, -2], fov: 44 },
  { t: 81.0, p: [3.0, 1.6, 1.7], l: [7.5, 1.2, -0.3], fov: 42, arc: 0.2 },         // se asoma al patio: Michoacán
  { t: 82.2, p: [3.2, 1.6, 1.6], l: [7.5, 1.2, -0.3], fov: 42 },
  { t: 83.0, p: [-1.7, 1.85, -1.3], l: [-2.1, 2.05, -2.9], fov: 38 },              // las herramientas del papá
  { t: 86.09, p: [-1.75, 1.85, -1.45], l: [-2.1, 2.05, -2.9], fov: 38 },
  { t: 90.53, p: [-1.9, 1.9, -1.6], l: [-2.1, 2.0, -2.9], fov: 36 },
  { t: 92.6, p: [-1.95, 1.9, -1.7], l: [-2.1, 2.0, -2.9], fov: 36 },
  { t: 93.3, p: [3.5, 1.4, 0.7], l: PT.pila, fov: 40 },                            // la pila de tarimas que junta
  { t: 94.42, p: [3.4, 1.4, 0.6], l: PT.pila, fov: 40 },
  { t: 95.6, p: [0.55, 1.5, -0.55], l: [1.55, 1.0, -2.7], fov: 40 },              // la mesa abierta: "si esto le está sirviendo"
  { t: 99.3, p: [0.75, 1.45, -0.85], l: [1.55, 1.0, -2.7], fov: 38 },
  { t: 101.0, p: [3.3, 1.3, 0.95], l: PT.pila, fov: 38 },                         // "¿usted tiene una tarima arrumbada?"
  { t: 104.96, p: [3.55, 1.25, 0.7], l: PT.pila, fov: 34 },
  { t: 107.7, p: [3.4, 1.4, 0.9], l: PT.pila, fov: 40 },                           // de vuelta a las tarimas: paso 1
]);

// ---------------- estado del mundo por segundo ----------------
const worldAt = (t: number): WorldProps => ({
  t,
  explode: win(t, 28.2, 30.8), nails: win(t, 28.0, 29.4),
  mesa: {
    build: 5 * win(t, 29.7, 31.4), oil: 1, dowel: 1,
    latch: win(t, T.gira, T.gira + 0.6),
    open: 0.55 * win(t, T.baja - 0.1, T.baja + 1.0) + 0.45 * win(t, T.patita, T.patita + 0.5),
    arm: win(t, T.patita, T.patita + 0.9),
    plates: win(t, T.cuatro - 0.1, T.cuatro + 0.7) * (1 - win(t, 46.0, 46.3)),
    xray: 0.75 * win(t, 46.3, 46.9) * (1 - win(t, 50.4, 50.7)),
    glowHinge: win(t, T.bmadera - 0.1, T.bmadera + 0.3) * (1 - win(t, 50.4, 50.7)),
  },
});

const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      {/* blur CSS (no SVG url(): sobre el canvas WebGL dejaba recuadros negros y cuelga Chrome en el farm) */}
      <AbsoluteFill style={{ filter: v.bx + v.by > 2.5 ? `blur(${Math.min(7, (v.bx + v.by) * 0.45).toFixed(2)}px)` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- avatar (preroll de 10 cuadros por ventana) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// ---------------- toma real (clip LTX si ya llegó, si no la foto con empuje lento). `from` = segundo dentro del clip ----------------
const Clip: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number]; ox?: number }> = ({ k, t, a, from = 0, z = [1.03, 1.1], ox = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} startFrom={s(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox * e(t, a, a + 7)}px)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ================= PIEZAS NUEVAS (carpintería) =================
const LAPIZ = "#2b2622"; // grafito de lápiz de carpintero
// trazo de lápiz de carpintero: palabra que se escribe sola sobre una tira de madera clara que se pega con una grapa
export const Rayado: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; rot?: number; size?: number; col?: string }> = ({ t, at, out, x, y, text, rot = -3, size = 64, col = LAPIZ }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const w = e(t, at + 0.1, at + 0.75);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) translateY(${(1 - Math.min(1, k)) * -60}px) scale(${0.85 + 0.15 * Math.min(1, k)})` }}>
    <div style={{ position: "relative", padding: "14px 40px 10px", background: "repeating-linear-gradient(90deg, rgba(120,80,40,.10) 0 3px, transparent 3px 11px), linear-gradient(180deg,#e7cfa4,#d2b27e)", borderRadius: 3,
      boxShadow: "0 22px 40px rgba(0,0,0,.55), inset 0 -4px 0 rgba(120,80,40,.35), inset 0 2px 0 rgba(255,255,255,.35)" }}>
      {[14, -14].map((dx, i) => <div key={i} style={{ position: "absolute", top: 8, [i ? "right" : "left"]: 10, width: 16, height: 5, background: "linear-gradient(90deg,#999,#eee,#888)", borderRadius: 2 }} />)}
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)`, letterSpacing: 1 }}>{text}</div>
    </div>
  </div>;
};

// cota de carpintero: dos topes, línea con flechas que se estira entre dos puntos de pantalla y la medida escrita a lápiz
export const Cota: React.FC<{ t: number; at: number; out: number; a: { x: number; y: number }; b: { x: number; y: number }; label: string; side?: number; col?: string }> = ({ t, at, out, a, b, label, side = 1, col = "#fff3d6" }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const d = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / d, uy = (b.y - a.y) / d, nx = -uy * side, ny = ux * side;
  const off = 40, A = { x: a.x + nx * off, y: a.y + ny * off }, B = { x: b.x + nx * off, y: b.y + ny * off };
  const g = e(t, at + 0.1, at + 0.6), M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const pa = { x: M.x + (A.x - M.x) * g, y: M.y + (A.y - M.y) * g }, pb = { x: M.x + (B.x - M.x) * g, y: M.y + (B.y - M.y) * g };
  const ar = (p: { x: number; y: number }, s0: number) => `M ${p.x} ${p.y} L ${p.x + (ux * 18 + nx * 9) * s0} ${p.y + (uy * 18 + ny * 9) * s0} M ${p.x} ${p.y} L ${p.x + (ux * 18 - nx * 9) * s0} ${p.y + (uy * 18 - ny * 9) * s0}`;
  const k = Math.min(1.15, spr(t, at + 0.45, 1.2));
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.85))" }}>
      {[a, b].map((p, i) => <line key={i} x1={p.x + nx * 8} y1={p.y + ny * 8} x2={p.x + nx * (off + 18) * e(t, at, at + 0.2)} y2={p.y + ny * (off + 18) * e(t, at, at + 0.2)} stroke={col} strokeWidth={3} />)}
      <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={col} strokeWidth={4} strokeLinecap="round" />
      {g > 0.95 && <path d={ar(A, 1) + " " + ar(B, -1)} stroke={col} strokeWidth={4} fill="none" strokeLinecap="round" />}
    </svg>
    <div style={{ position: "absolute", left: M.x + nx * 70, top: M.y + ny * 70, transform: `translate(-50%,-50%) scale(${k}) rotate(-4deg)`, fontFamily: HAND, fontWeight: 700, fontSize: 96, color: col, whiteSpace: "nowrap", textShadow: "0 4px 14px rgba(0,0,0,.9)" }}>{label}</div>
  </div>;
};

// el plano de la cocinita a gis: 2 × 3 m, estufa, barra… y la mesa que entra, choca y NO CABE
export const Plano: React.FC<{ t: number; at: number; hit: number; out: number }> = ({ t, at, hit, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const dr = (a0: number) => e(t, at + a0, at + a0 + 0.35);
  const slide = ei(t, hit - 0.75, hit), shake = t > hit ? Math.sin((t - hit) * 60) * 10 * Math.exp(-(t - hit) * 5) : 0;
  const red = e(t, hit, hit + 0.1);
  const X = 560, Y = 170, S = 240; // 1 m = 240 px; cocina de 3 × 2 m
  const ch = { stroke: "#f3eee2", strokeWidth: 6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const len = (w: number, h: number) => 2 * (w + h);
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(30,40,34,.86), rgba(12,16,14,.95))" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 2px rgba(255,255,255,.4))" }}>
      <rect x={X} y={Y} width={3 * S} height={2 * S} {...ch} strokeWidth={10} strokeDasharray={len(3 * S, 2 * S)} strokeDashoffset={len(3 * S, 2 * S) * (1 - dr(0))} />
      {/* estufa, barra y puerta */}
      <rect x={X + 30} y={Y + 30} width={150} height={130} {...ch} strokeDasharray={560} strokeDashoffset={560 * (1 - dr(0.25))} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={X + 68 + (i % 2) * 74} cy={Y + 64 + Math.floor(i / 2) * 62} r={20} {...ch} strokeWidth={4} opacity={dr(0.35)} />)}
      <rect x={X + 200} y={Y + 30} width={480} height={90} {...ch} strokeDasharray={1140} strokeDashoffset={1140 * (1 - dr(0.35))} />
      <path d={`M ${X + 3 * S} ${Y + 2 * S - 210} A 170 170 0 0 0 ${X + 3 * S - 170} ${Y + 2 * S - 40}`} {...ch} strokeWidth={4} strokeDasharray="10 12" opacity={dr(0.45)} />
      {/* la mesa entra desde la izquierda */}
      <g transform={`translate(${-700 + 700 * slide + shake}, 0)`}>
        <rect x={X + 140} y={Y + 200} width={1.2 * S} height={0.8 * S} rx={8} fill={`rgba(${200 + 55 * red},${170 - 120 * red},${110 - 80 * red},.35)`} stroke={red > 0.5 ? "#ff5a3d" : "#f2c14e"} strokeWidth={8} />
        {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a0, b0], i) => <circle key={i} cx={X + 140 + a0 * 1.2 * S + (a0 ? 30 : -30)} cy={Y + 200 + b0 * 0.8 * S + (b0 ? 30 : -30)} r={22} fill="none" stroke={red > 0.5 ? "#ff5a3d" : "#f2c14e"} strokeWidth={5} />)}
      </g>
      {red > 0.01 && <circle cx={X + 140 + 1.2 * S} cy={Y + 175} r={30 + 60 * e(t, hit, hit + 0.4)} fill="none" stroke="#ff5a3d" strokeWidth={6} opacity={1 - e(t, hit, hit + 0.4)} />}
    </svg>
    {[["3 m", X + 1.5 * S, Y - 50], ["2 m", X - 90, Y + S]].map(([l, x, y], i) => <div key={i} style={{ position: "absolute", left: x as number, top: y as number, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#f3eee2", opacity: dr(0.2 + i * 0.1) }}>{l}</div>)}
    {t > hit && <div style={{ position: "absolute", left: 960, top: 830, transform: `translate(-50%,-50%) rotate(-6deg) scale(${2.2 - 1.2 * Math.min(1, spr(t, hit + 0.05, 1.3))})`, border: "10px solid #ff5a3d", borderRadius: 14, padding: "2px 36px", fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: "#ff5a3d", letterSpacing: 6, background: "rgba(20,0,0,.35)" }}>NO CABE</div>}
  </AbsoluteFill>;
};

// mirilla: un NUDO de la madera que se abre como ventanita redonda (tapa una parte del avatar con otra toma)
export const Mirilla: React.FC<{ t: number; at: number; out: number; grow?: number; x?: number; y?: number; R?: number; children: React.ReactNode }> = ({ t, at, out, grow, x = 1440, y = 660, R = 300, children }) => {
  const k = Math.min(1.08, spr(t, at, 0.9)), o = 1 - e(t, out, out + 0.2);
  if (t < at || o <= 0.01) return null;
  const g = grow ? ei(t, grow, grow + 0.45) : 0;
  const rr = R * Math.min(1, k) + g * 1500, cx = x + (960 - x) * g, cy = y + (540 - y) * g;
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ clipPath: `circle(${rr}px at ${cx}px ${cy}px)` }}><AbsoluteFill style={{ transform: `translate(${cx - 960}px, ${cy - 540}px)` }}>{children}</AbsoluteFill></AbsoluteFill>
    {g < 0.98 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs><radialGradient id="nudo" cx="50%" cy="50%" r="50%"><stop offset="80%" stopColor="#3a2414" /><stop offset="92%" stopColor="#7a5030" /><stop offset="100%" stopColor="#2a180c" /></radialGradient></defs>
      <circle cx={cx} cy={cy} r={rr + 22} fill="none" stroke="url(#nudo)" strokeWidth={46} opacity={1 - g} style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,.7))" }} />
      {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={cx} cy={cy} rx={rr + 52 + i * 16} ry={(rr + 52 + i * 16) * 0.86} fill="none" stroke="rgba(110,70,35,.55)" strokeWidth={3} opacity={(1 - g) * (1 - i * 0.18)} />)}
    </svg>}
  </AbsoluteFill>;
};

// marco de cuadro dorado que se dibuja alrededor de un rectángulo del mundo (4 puntos proyectados)
export const Marco: React.FC<{ t: number; at: number; out: number; q: { x: number; y: number }[] }> = ({ t, at, out, q }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const d = q.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ") + " Z";
  const per = q.reduce((a, p, i) => a + Math.hypot(p.x - q[(i + 1) % 4].x, p.y - q[(i + 1) % 4].y), 0);
  const w = e(t, at, at + 0.8);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <defs><linearGradient id="oro" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff0b0" /><stop offset="40%" stopColor="#d9a43a" /><stop offset="70%" stopColor="#8a5a14" /><stop offset="100%" stopColor="#f2c86a" /></linearGradient></defs>
    <path d={d} fill="none" stroke="#3a2006" strokeWidth={46} strokeLinejoin="miter" strokeDasharray={per} strokeDashoffset={per * (1 - w)} opacity={0.6} style={{ filter: "blur(6px)" }} />
    <path d={d} fill="none" stroke="url(#oro)" strokeWidth={34} strokeLinejoin="miter" strokeDasharray={per} strokeDashoffset={per * (1 - w)} />
    <path d={d} fill="none" stroke="rgba(255,250,220,.8)" strokeWidth={3} strokeDasharray={per} strokeDashoffset={per * (1 - w)} style={{ transform: "translate(0,-6px)" }} />
    {w > 0.99 && <path d={d} fill="none" stroke="rgba(255,255,255,.9)" strokeWidth={6} strokeDasharray={`60 ${per}`} strokeDashoffset={-per * e(t, at + 0.8, at + 1.6)} style={{ filter: "blur(2px)" }} />}
  </svg>;
};

// lo prohibido: un clavo y una bisagra de fierro dibujados que se tachan
export const Prohibido: React.FC<{ t: number; a1: number; a2: number; out: number }> = ({ t, a1, a2, out }) => {
  const o = 1 - e(t, out, out + 0.25);
  const card = (a0: number, x: number, icon: React.ReactNode, lab: string) => {
    const k = Math.min(1.1, spr(t, a0, 1)), oo = e(t, a0, a0 + 0.1) * o;
    if (oo <= 0.01) return null;
    return <div key={lab} style={{ position: "absolute", left: x, top: 300, opacity: oo, transform: `translate(-50%,0) rotateY(${(1 - Math.min(1, k)) * 70}deg) scale(${0.7 + 0.3 * Math.min(1, k)})` }}>
      <div style={{ width: 330, height: 330, borderRadius: 26, background: "radial-gradient(circle at 40% 30%, #3b2a20, #1a100a)", boxShadow: "0 30px 60px rgba(0,0,0,.65), inset 0 0 0 3px rgba(242,193,78,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ textAlign: "center", marginTop: 16, fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: CH.crema, letterSpacing: 3, textShadow: extrude(5, "#000") }}>{lab}</div>
      <div style={{ position: "absolute", left: 0, top: 0 }}><DrawX t={t} at={a0 + 0.35} x={0} y={0} w={330} h={330} /></div>
    </div>;
  };
  return <AbsoluteFill>
    {card(a1, 700, <svg width={220} height={220} viewBox="-110 -110 220 220"><rect x={-70} y={-96} width={140} height={22} rx={6} fill="#a9abad" /><rect x={-12} y={-76} width={24} height={150} fill="#8f9194" /><path d="M -12 74 L 0 104 L 12 74 Z" fill="#8f9194" />{[-50, -20, 10, 40].map((y) => <line key={y} x1={-13} y1={y} x2={13} y2={y + 10} stroke="#6b6d70" strokeWidth={4} />)}</svg>, "NI UN CLAVO")}
    {card(a2, 1220, <svg width={240} height={220} viewBox="-120 -110 240 220"><rect x={-100} y={-80} width={92} height={160} rx={8} fill="#9a9c9f" /><rect x={8} y={-80} width={92} height={160} rx={8} fill="#b4b6b9" /><rect x={-10} y={-84} width={20} height={168} rx={10} fill="#76787b" />{[[-55, -45], [-55, 45], [55, -45], [55, 45]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#5d5f62" />)}</svg>, "NI FIERROS")}
  </AbsoluteFill>;
};

// metro plegable de carpintero: se despliega tramo por tramo y cada tramo trae su número de paso
export const Metro: React.FC<{ t: number; at: number; out: number; x: number; y: number; n?: number; dt?: number }> = ({ t, at, out, x, y, n = 7, dt = 0.16 }) => {
  const o = e(t, at - 0.05, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const L = 210, Hh = 64;
  // cada tramo gira desde plegado (180°) a abierto (0°) en cadena
  let px = 0, py = 0, ang = 0;
  const segs = Array.from({ length: n }, (_, i) => {
    const u = ei(t, at + i * dt, at + i * dt + 0.35);
    const a = i === 0 ? -6 : (1 - u) * (i % 2 ? 178 : -178);
    ang += a;
    const r = ang * Math.PI / 180, seg = { px, py, ang, u, i };
    px += Math.cos(r) * L; py += Math.sin(r) * L;
    return seg;
  });
  const cx = -((n - 1) * L) / 2 * ei(t, at, at + n * dt + 0.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <div style={{ position: "absolute", left: cx, top: 0 }}>
      {segs.map((g) => <div key={g.i} style={{ position: "absolute", left: g.px, top: g.py, width: L + 10, height: Hh, marginTop: -Hh / 2, transformOrigin: "0 50%", transform: `rotate(${g.ang}deg)`,
        background: "linear-gradient(180deg,#f7dc6a,#e8b92c 60%,#c8951a)", borderRadius: 6, boxShadow: "0 16px 26px rgba(0,0,0,.55), inset 0 2px 0 rgba(255,255,255,.5)", zIndex: g.i }}>
        {Array.from({ length: 20 }, (_, k) => <div key={k} style={{ position: "absolute", left: 8 + k * 10, top: 0, width: 2, height: k % 10 === 0 ? 26 : k % 5 === 0 ? 18 : 10, background: "#2a1a0c" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 12, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: "#7a1f2b", opacity: e(t, at + g.i * dt + 0.25, at + g.i * dt + 0.45), transform: `rotate(${-g.ang}deg)` }}>{g.i + 1}</div>
        <div style={{ position: "absolute", left: -7, top: Hh / 2 - 7, width: 14, height: 14, borderRadius: 7, background: "radial-gradient(circle,#eee,#777)" }} />
      </div>)}
    </div>
  </div>;
};

// etiqueta de precio de ferretería (máquina cara) que se tacha
export const Etiqueta: React.FC<{ t: number; at: number; out: number; x: number; y: number; top: string; $: string; cross?: number }> = ({ t, at, out, x, y, top, $, cross }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = (1 - Math.min(1, k)) * 22 + 4 * Math.sin((t - at) * 3) * Math.exp(-(t - at) * 0.8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% 0", transform: `translate(-50%,0) rotate(${sw}deg)` }}>
    <div style={{ width: 4, height: 90, margin: "0 auto", background: "#d9c7a0" }} />
    <div style={{ position: "relative", padding: "20px 40px 16px", background: "linear-gradient(180deg,#fff8e6,#efe0bc)", borderRadius: 10, boxShadow: "0 26px 50px rgba(0,0,0,.55)", textAlign: "center" }}>
      <div style={{ position: "absolute", left: "50%", top: 10, width: 16, height: 16, marginLeft: -8, borderRadius: 8, background: "#2a120c" }} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#5a4a36", letterSpacing: 3, marginTop: 14 }}>{top}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CH.guinda, lineHeight: 1 }}>{$}</div>
      {cross !== undefined && <div style={{ position: "absolute", left: "4%", top: "56%", height: 10, width: `${92 * e(t, cross, cross + 0.2)}%`, background: "#d8402c", transform: "rotate(-8deg)", borderRadius: 4, boxShadow: "0 0 10px rgba(216,64,44,.8)" }} />}
    </div>
  </div>;
};

// sello de tinta que cae
export const Sello: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -8, size = 120, col = "#d8402c" }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
    <div style={{ border: `10px solid ${col}`, borderRadius: 16, padding: "4px 34px", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", whiteSpace: "nowrap", textShadow: "0 4px 10px rgba(0,0,0,.6)" }}>{text}</div>
  </div>;
};

// $0 colgado de un clavo… de madera (tarugo)
export const Cero: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.12, spr(t, at, 1.1)), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(${4 * Math.sin((t - at) * 2.5) * Math.exp(-(t - at))}deg)`, textAlign: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 230, color: CH.maiz, lineHeight: 1, textShadow: extrude(14, "#5a2a10") }}>$0</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: CH.crema, letterSpacing: 6, textShadow: extrude(4, "#000") }}>NO CUESTA UN PESO</div>
  </div>;
};

// nota escrita a mano en papel de estraza (se escribe sola)
export const Nota: React.FC<{ t: number; at: number; out: number; x: number; y: number; lines: string[]; rot?: number; w?: number; size?: number }> = ({ t, at, out, x, y, lines, rot = -4, w = 520, size = 58 }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 60}deg) rotate(${rot + 1.2 * Math.sin(t * 1.3)}deg)`, width: w, padding: "30px 38px 32px", background: "linear-gradient(180deg,#c9a57a,#b38b5c)", borderRadius: 4,
      boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 50px rgba(80,50,20,.35)" }}>
      <div style={{ position: "absolute", left: "50%", top: -16, width: 26, height: 26, marginLeft: -13, borderRadius: 13, background: "radial-gradient(circle at 35% 35%, #c8935a, #6b4024)", boxShadow: "0 4px 8px rgba(0,0,0,.5)" }} />
      {lines.map((ln, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: i === 0 ? size + 6 : size, lineHeight: `${size + 8}px`, color: "#24160c", clipPath: `inset(-10% ${100 - 100 * e(t, at + 0.15 + i * 0.4, at + 0.75 + i * 0.4)}% -10% 0)` }}>{ln}</div>)}
    </div>
  </div>;
};

// letra a mano que se escribe sola (lo que piensa el que mira)
export const Pensado: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string }> = ({ t, at, out, x, y, text, size = 100, col = CH.crema }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, at, at + 1.0);
  if (w <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-4deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)`, textShadow: "0 6px 20px rgba(0,0,0,.8)" }}>{text}</div>;
};

// foto vieja (polaroid) que cae girando y se asienta
export const FotoVieja: React.FC<{ t: number; at: number; out: number; k: string; x: number; y: number; cap: string }> = ({ t, at, out, k, x, y, cap }) => {
  const q = Math.min(1.06, spr(t, at, 0.75)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
    <div style={{ transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, q)) * -700}px) rotate(${-7 + (1 - Math.min(1, q)) * 40}deg) rotateX(${(1 - Math.min(1, q)) * 30}deg)`, padding: "26px 26px 90px", background: "linear-gradient(180deg,#f3ead6,#e3d5b6)", boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
      <div style={{ width: 720, height: 480, overflow: "hidden", filter: "sepia(.55) contrast(.95)" }}><Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * e(t, at, at + 4)})` }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: "#3b2414" }}>{cap}</div>
    </div>
  </div>;
};

// hoja de medidas (lista de corte) escrita a lápiz que aterriza en el banco, renglón por renglón



// cortina de ASERRÍN: una ráfaga de viruta y polvo de madera barre la pantalla (transición de taller, ida y vuelta)
export const Aserrin: React.FC<{ t: number; mid: number; w?: number }> = ({ t, mid, w = 0.4 }) => {
  const u = (t - mid + w) / (2 * w);
  if (u <= 0 || u >= 1) return null;
  const k = 1 - Math.abs(u - 0.5) * 2;
  const bits = Array.from({ length: 70 }, (_, i) => {
    const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 47.3) * 43758.5; return x - Math.floor(x); };
    const x = -400 + (2700 * (u * 1.25 - r(1) * 0.25)), y = r(2) * 1080 + Math.sin(u * 6 + i) * 40;
    const sz = 30 + r(3) * 120;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz * (0.35 + r(4) * 0.4), borderRadius: "50%", transform: `rotate(${r(5) * 180 + u * 300}deg)`, background: `rgba(${220 + r(6) * 30},${180 + r(7) * 40},${120 + r(8) * 40},${0.85})`, filter: `blur(${r(9) * 3}px)` }} />;
  });
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: `linear-gradient(90deg, transparent ${(u * 1.4 - 0.6) * 100}%, rgba(214,176,120,${0.92 * k}) ${(u * 1.4 - 0.3) * 100}%, rgba(214,176,120,${0.92 * k}) ${(u * 1.4 - 0.1) * 100}%, transparent ${(u * 1.4 + 0.2) * 100}%)`, filter: "blur(30px)" }} />
    {bits}
  </AbsoluteFill>;
};

// CTA de la ola (21-oct): suscribirse + campanita + UNA pregunta para comentar. Todo de taller: tabla pintada, campana de bronce, tablita a lápiz.
// botón = tabla pintada de rojo; al "suscríbase" se hunde como tecla y queda "SUSCRITO ✓"
export const BotonTabla: React.FC<{ t: number; at: number; press: number; out: number; x: number; y: number }> = ({ t, at, press, out, x, y }) => {
  const k = spr(t, at, 0.7), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const pr = e(t, press, press + 0.08) * (1 - e(t, press + 0.12, press + 0.3)), done = t >= press + 0.15;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 260 + pr * 12}px) rotate(${-2 + (1 - Math.min(1, k)) * 8}deg)` }}>
    <div style={{ position: "relative", padding: "26px 64px", borderRadius: 18, background: done ? "linear-gradient(180deg,#8a5a34,#6b4224)" : "linear-gradient(180deg,#c9402c,#9a2a1c)",
      boxShadow: `0 ${18 - pr * 12}px 0 ${done ? "#3e2412" : "#5a160e"}, 0 ${40 - pr * 20}px 60px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,255,255,.25)`,
      fontFamily: SERIF, fontWeight: 900, fontSize: 84, letterSpacing: 4, color: "#fbe8c8", textShadow: "0 3px 0 rgba(40,10,4,.7)", whiteSpace: "nowrap" }}>
      {/* veta de la tabla debajo de la pintura */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "repeating-linear-gradient(178deg, rgba(0,0,0,.08) 0 3px, transparent 3px 11px)" }} />
      <span style={{ position: "relative" }}>{done ? "SUSCRITO ✓" : "SUSCRÍBASE"}</span>
      {[-1, 1].map((sg) => <div key={sg} style={{ position: "absolute", top: "50%", ...(sg < 0 ? { left: 18 } : { right: 18 }), width: 16, height: 16, marginTop: -8, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#e8e2d8,#7a7268)" }} />)}
    </div>
  </div>;
};
// campana de bronce colgada de una correa: entra, suena al decir "campanita" (se mece y salen ondas)
export const Campana: React.FC<{ t: number; at: number; ring: number; out: number; x: number; y: number }> = ({ t, at, ring, out, x, y }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const dt = t - ring, sw = dt > 0 ? Math.sin(dt * 14) * 26 * Math.exp(-dt * 1.6) : 0;
  return <div style={{ position: "absolute", left: x, top: y - (1 - Math.min(1, k)) * 600, opacity: o }}>
    <svg width={360} height={420} viewBox="-180 -60 360 420" style={{ overflow: "visible", position: "absolute", left: -180, top: -60 }}>
      <defs><linearGradient id="bronce" x1="0" x2="1"><stop offset="0" stopColor="#7a4e14" /><stop offset=".35" stopColor="#e9b44c" /><stop offset=".55" stopColor="#fff0b8" /><stop offset=".75" stopColor="#c48a2a" /><stop offset="1" stopColor="#6a400e" /></linearGradient></defs>
      <rect x={-9} y={-60} width={18} height={90} rx={4} fill="#5a3418" />
      {dt > 0 && [0, 1, 2].map((i) => { const d2 = dt - i * 0.18, u = (d2 % 0.9) / 0.9; return d2 > 0 ? <path key={i} d={`M ${-120 - u * 70} ${150 - u * 40} Q ${-150 - u * 90} 210 ${-120 - u * 70} ${270 + u * 40} M ${120 + u * 70} ${150 - u * 40} Q ${150 + u * 90} 210 ${120 + u * 70} ${270 + u * 40}`} fill="none" stroke="#f6d27a" strokeWidth={7} strokeLinecap="round" opacity={(1 - u) * Math.exp(-dt * 0.5)} /> : null; })}
      <g transform={`rotate(${sw} 0 30)`}>
        <circle cx={0} cy={30} r={16} fill="url(#bronce)" />
        <path d="M -30 50 C -36 120 -60 190 -112 240 L 112 240 C 60 190 36 120 30 50 Z" fill="url(#bronce)" stroke="#5a360c" strokeWidth={4} />
        <rect x={-122} y={232} width={244} height={22} rx={11} fill="url(#bronce)" stroke="#5a360c" strokeWidth={4} />
        <circle cx={-sw * 1.3} cy={272} r={20} fill="#5a360c" />
      </g>
    </svg>
  </div>;
};
// la pregunta para comentar, a lápiz en una tablita colgada de dos clavos
export const Tablita: React.FC<{ t: number; at: number; out: number; x: number; y: number; lines: string[]; rot?: number }> = ({ t, at, out, x, y, lines, rot = -2 }) => {
  const k = spr(t, at, 0.75), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot + (1 - Math.min(1, k)) * -12}deg) scale(${0.6 + 0.4 * k})` }}>
    <div style={{ position: "relative", padding: "34px 56px 30px", borderRadius: 10, background: "linear-gradient(180deg,#e9cfa4,#d8b886)", boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 -6px 0 rgba(90,55,25,.25)" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "repeating-linear-gradient(181deg, rgba(120,80,40,.10) 0 2px, transparent 2px 13px)" }} />
      {[-1, 1].map((sg) => <div key={sg} style={{ position: "absolute", top: 14, ...(sg < 0 ? { left: 22 } : { right: 22 }), width: 14, height: 14, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#d8d2c8,#6a6258)" }} />)}
      {lines.map((ln, i) => { const w = e(t, at + 0.25 + i * 0.45, at + 0.7 + i * 0.45); return <div key={i} style={{ position: "relative", fontFamily: HAND, fontWeight: 700, fontSize: 62, lineHeight: "74px", color: LAPIZ, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)` }}>{ln}</div>; })}
    </div>
  </div>;
};

// ---------------- EL MINUTO ----------------
const MCUAD: V[] = [[MESA.x - 0.43, MESA.hingeY + 0.64, MESA.wallZ + 0.08], [MESA.x + 0.43, MESA.hingeY + 0.64, MESA.wallZ + 0.08], [MESA.x + 0.43, MESA.hingeY - 0.1, MESA.wallZ + 0.08], [MESA.x - 0.43, MESA.hingeY - 0.1, MESA.wallZ + 0.08]];
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W = (k: string, tt = t, over?: Partial<WorldProps>) => <World key={k} t={tt} over={over} />;
  const av = (i: number) => t >= AVS[i][0] && t < AVS[i][1];

  // A · 0-4,6 · avatar: "usted está en su cocina, de dos por tres metros" → portal a la cocinita
  if (av(0)) {
    L.push(<Avatar key="avA" t={t} />);
    L.push(<Rayado key="r23" t={t} at={T.dosx3} out={AVS[0][1]} x={1450} y={250} text="2 × 3 metros" rot={-4} />);
    const r = ei(t, 3.95, AVS[0][1]);
    if (r > 0) L.push(<Portal key="pA" x={1380} y={560} r={r}><Clip k="h_cocina" t={t} a={3.95} z={[1.12, 1.03]} /></Portal>);
  }
  // B · 4,6-16,9 · la cocinita del domingo: nietos parados, el plato en las rodillas → el plano: NO CABE una mesa
  if (t >= AVS[0][1] && t < 17.0) {
    L.push(<Clip key="cB" k="h_cocina" t={t} a={3.95} z={[1.12, 1.03]} />);
    L.push(<Rayado key="dom" t={t} at={T.domingo} out={T.nocabe - 0.3} x={330} y={150} text="domingo" rot={-6} size={72} />);
    L.push(<Tag key="pa" t={t} at={T.parados} x={760} y={520} dx={-220} dy={-170} text="PARADOS" sub="JUNTO A LA ESTUFA" col={CH.maiz} out={T.nocabe - 0.3} size={54} />);
    L.push(<Tag key="ro" t={t} at={T.rodillas} x={1150} y={760} dx={240} dy={-150} text="EL PLATO" sub="EN LAS RODILLAS" col={CH.maiz} out={T.nocabe - 0.3} size={54} />);
    L.push(<Plano key="pl" t={t} at={T.nocabe - 0.35} hit={T.nocabe + 0.9} out={16.75} />);
  }
  L.push(<Aserrin key="as1" t={t} mid={16.95} w={0.35} />);
  // C · 16,9-17,9 · allá afuera, en la banqueta: la tarima tirada
  if (t >= 16.9 && t < AVS[1][0] + 0.02) L.push(<Clip key="cC" k="h_banqueta" t={t} a={16.9} z={[1.0, 1.06]} />);
  // D · avatar: "de esas de madera, toda manchada, con los clavos chuecos"
  if (av(1)) {
    L.push(<Avatar key="avD" t={t} />);
    L.push(<Rayado key="mn" t={t} at={T.manchada} out={AVS[1][1] - 0.1} x={1480} y={300} text="toda manchada" rot={-5} />);
    L.push(<Rayado key="cc" t={t} at={T.chuecos} out={AVS[1][1] - 0.1} x={1500} y={460} text="clavos chuecos" rot={3} />);
  }
  // E · 23,1-25,5 · la banqueta otra vez (más adelante en la toma): "usted pasa al lado y ni la ve"
  if (t >= AVS[1][1] && t < T.esa) {
    L.push(<Clip key="cE" k="h_banqueta" t={t} a={AVS[1][1]} from={AVS[1][1] - 16.9 + 1.0} z={[1.06, 1.14]} />);
    L.push(<Pensado key="nv" t={t} at={T.nilave} out={T.esa - 0.25} x={1300} y={240} text="…y ni la ve" />);
  }
  L.push(<Aserrin key="as2" t={t} mid={T.esa} w={0.3} />);
  // F · 25,5-28,0 · "pues esa tarima, mijo, es su mesa": Don Anselmo se la lleva al hombro → portal al taller
  if (t >= T.esa && t < 28.05) {
    L.push(<Clip key="cF" k="h_cargar" t={t} a={T.esa} z={[1.04, 1.1]} />);
    L.push(<BigNum key="sm" t={t} at={T.sumesa} text="ES SU MESA" size={150} y={860} col={CH.maiz} edge="#5a2a10" out={27.5} />);
    const r = ei(t, 27.3, 28.05);
    if (r > 0) L.push(<Portal key="pF" x={900} y={420} r={r}>{W("wF", Math.max(27.2, t))}</Portal>);
  }
  // G · 28,0-36,6 · el taller: la tarima se desarma y las tablas SE VUELVEN la mesa plegada · 8 cm · como un cuadro
  if (t >= 28.0 && t < AVS[2][0] + 0.02) {
    L.push(W("wG"));
    L.push(<Rayado key="no" t={t} at={T.noocupa} out={31.6} x={560} y={200} text="no ocupa lugar" rot={-4} />);
    if (t >= 31.7) {
      const a0 = screenOf(t, [MESA.x + 0.4, MESA.hingeY + 0.75, MESA.wallZ - 0.02]), b0 = screenOf(t, [MESA.x + 0.4, MESA.hingeY + 0.75, MESA.wallZ + 0.1]);
      L.push(<Cota key="ct" t={t} at={T.mide} out={35.5} a={a0} b={b0} label="8 cm" side={-1} />);
      L.push(<BigNum key="o8" t={t} at={T.ocho} text="8" size={300} x={520} y={500} col={CH.maiz} edge="#5a2a10" out={35.4} sub="CENTÍMETROS" />);
    }
    if (t >= 35.7) L.push(<Marco key="mc" t={t} at={T.cuadro} out={AVS[2][0] + 0.5} q={MCUAD.map((q) => screenOf(t, q))} />);
  }
  // H · avatar: "usted gira esta tarabilla, la tabla baja" — por un NUDO de la madera se ve la tarabilla y la mesa bajando
  if (av(2)) {
    L.push(<Avatar key="avH" t={t} />);
    L.push(<Mirilla key="mH" t={t} at={T.gira - 0.15} out={AVS[2][1] + 0.3} grow={AVS[2][1] - 0.45}>{W("wH")}</Mirilla>);
  }
  // I · 40,2-46,1 · la patita sale sola y ahí está: una mesa para cuatro platos
  if (t >= AVS[2][1] && t < 46.7) {
    L.push(W("wI"));
    const m = screenOf(t, [MESA.x + 0.05, MESA.hingeY - 0.3, MESA.wallZ + 0.3]);
    L.push(<Tag key="pt" t={t} at={T.patita + 0.2} x={m.x} y={m.y} dx={240} dy={120} text="LA PATITA" sub="SALE SOLA" col={CH.maiz} out={43.3} size={56} />);
    const c = screenOf(t, PT.mesa);
    L.push(<Tag key="4p" t={t} at={T.cuatro} x={c.x} y={c.y - 30} dx={-260} dy={-200} text="4 PLATOS" col={CH.maiz} out={T.cuatro + 0.9} size={64} />);
    // y la mesa ya en una cocina de verdad, con los nietos sentados (portal desde la cubierta)
    const r = ei(t, T.cuatro + 0.7, T.cuatro + 1.3);
    if (r > 0) L.push(<Portal key="pI" x={c.x} y={c.y} r={r}><Clip k="h_abierta" t={t} a={T.cuatro + 0.7} z={[1.1, 1.03]} /></Portal>);
  }
  // J · 46,1-50,7 · de cerca a la bisagra: ni un clavo, ni fierros → la bisagra es de madera
  if (t >= 46.0 && t < AVS[3][0] + 0.02) {
    L.push(W("wJ"));
    L.push(<AbsoluteFill key="dk" style={{ background: "rgba(10,6,3,.55)", opacity: e(t, T.clavo - 0.2, T.clavo + 0.1) * (1 - e(t, T.bmadera - 0.4, T.bmadera)) }} />);
    L.push(<Prohibido key="ph" t={t} a1={T.clavo} a2={T.fierro} out={T.bmadera - 0.35} />);
    const b = screenOf(t, PT.bisagraL);
    L.push(<Tag key="bm" t={t} at={T.bmadera} x={b.x} y={b.y} dx={-220} dy={-230} text="BISAGRA" sub="DE MADERA" col={CH.maiz} out={AVS[3][0] + 0.5} size={62} />);
  }
  // K · avatar: "y el perno es un palo de escoba" (mirilla) → "¿cómo aguanta?"
  if (av(3)) {
    L.push(<Avatar key="avK" t={t} />);
    L.push(<Mirilla key="mK" t={t} at={T.escoba - 0.1} out={T.aguanta + 0.2}><Clip k="h_escoba" t={t} a={T.escoba - 0.1} z={[1.0, 1.08]} /></Mirilla>);
    L.push(<Pensado key="ag" t={t} at={T.aguanta + 0.1} out={AVS[3][1] - 0.2} x={1380} y={300} text="¿sin clavos ni fierros?" size={86} />);
  }
  // L · 56,4-60,6 · el banco: el metro plegable se abre en los 7 pasos
  if (t >= AVS[3][1] && t < 60.75) {
    L.push(W("wL"));
    L.push(<Metro key="mt" t={t} at={T.siete - 0.2} out={60.4} x={960} y={560} />);
    L.push(<Rayado key="md" t={t} at={T.medidas} out={60.4} x={960} y={250} text="con las medidas de cada pieza" rot={-2} size={60} />);
  }
  L.push(<Aserrin key="as3" t={t} mid={60.7} w={0.3} />);
  // M · 60,6-64,6 · serrucho, taladro y formón — nada de máquinas caras
  if (t >= 60.6 && t < 64.75) {
    L.push(<Clip key="cM" k="h_herram" t={t} a={60.6} z={[1.1, 1.02]} />);
    L.push(<Tag key="t1" t={t} at={T.serrucho} x={560} y={430} dx={-160} dy={-170} text="SERRUCHO" col={CH.maiz} out={64.4} size={50} />);
    L.push(<Tag key="t2" t={t} at={T.taladro} x={1160} y={480} dx={150} dy={-200} text="TALADRO" col={CH.maiz} out={64.4} size={50} />);
    L.push(<Tag key="t3" t={t} at={T.formon} x={960} y={720} dx={-200} dy={150} text="FORMÓN" col={CH.maiz} out={64.4} size={50} />);
    L.push(<Etiqueta key="et" t={t} at={T.maquinas - 0.1} out={64.45} x={1580} y={180} top="SIERRA DE MESA" $="$14,900" cross={T.maquinas + 0.6} />);
  }
  // N · 64,6-69,2 · paso 4: la prensa de cuñas que no cuesta un peso
  if (t >= 64.6 && t < AVS[4][0] + 0.02) {
    L.push(<Clip key="cN" k="h_cunas" t={t} a={64.6} z={[1.02, 1.1]} />);
    L.push(<Sello key="p4" t={t} at={T.paso4} text="PASO 4" x={420} y={220} out={AVS[4][0]} rot={-7} size={96} col={CH.maiz} />);
    L.push(<Tag key="cu" t={t} at={T.cunas} x={1100} y={640} dx={220} dy={-220} text="DOS CUÑAS" sub="Y UN MARTILLO" col={CH.maiz} out={AVS[4][0]} size={54} />);
    L.push(<Cero key="c0" t={t} at={T.peso} out={AVS[4][0] + 0.4} x={560} y={640} />);
  }
  // O · avatar: "…lo que su compadre el de la ferretería no quiere que conozca" · "Yo me llamo Anselmo Ruiz"
  if (av(4)) {
    L.push(<Avatar key="avO" t={t} />);
    L.push(<Nota key="fe" t={t} at={T.compadre} out={T.nombre - 0.3} x={1460} y={300} rot={4} lines={["lo que en la", "ferretería no", "le cuentan"]} w={470} />);
  }
  L.push(<LowerThird key="lt" t={t} at={T.nombre} out={77.6} name="DON ANSELMO" l2="CARPINTERO · 70 AÑOS · MICHOACÁN" l2at={T.setenta - 0.2} />);
  // P · 74,7-86,1 · el taller entero: 50 años aquí · el adobe · el patio de Michoacán · la regla del papá
  if (t >= AVS[4][1] && t < AVS[5][0] + 0.02) {
    L.push(W("wP"));
    L.push(<BigNum key="50" t={t} at={T.cincuenta} text="50 AÑOS" size={190} x={1250} y={330} col={CH.maiz} edge="#5a2a10" out={78.9} sub="EN ESTE TALLER" />);
    if (t > 78.8 && t < 81.2) { const w0 = screenOf(t, [-3.0, 1.2, -2.94]); L.push(<Tag key="ad" t={t} at={T.adobe} x={w0.x} y={w0.y} dx={200} dy={-160} text="ADOBE" sub="PAREDES DE 30 CM" col={CH.maiz} out={80.9} size={58} />); }
    if (t > 80.8 && t < 82.6) { const p0 = screenOf(t, [7.2, 1.0, -1.2]); L.push(<Rayado key="mi" t={t} at={T.mich} out={82.4} x={Math.min(1700, p0.x)} y={260} text="Michoacán" rot={-4} size={80} />); }
    if (t > 82.6) {
      const h0 = screenOf(t, [-1.85, 2.0, -2.92]);
      L.push(<Tag key="pp" t={t} at={T.papa} x={h0.x} y={h0.y} dx={260} dy={-120} text="LOS SERRUCHOS" sub="DE MI PAPÁ" col={CH.maiz} out={AVS[5][0] - 0.1} size={54} />);
      L.push(<Nota key="rg" t={t} at={T.regla} out={AVS[5][0] + 0.2} x={1380} y={760} rot={3} w={520} lines={["Regla nº 1", "del oficio:"]} />);
    }
  }
  // Q · avatar: "la madera buena no se compra, se encuentra"
  if (av(5)) {
    L.push(<Avatar key="avQ" t={t} />);
    L.push(<Nota key="mb" t={t} at={T.buena} out={AVS[5][1] - 0.15} x={1420} y={330} rot={-3} w={560} lines={["La madera buena", "no se compra,", "se encuentra."]} />);
  }
  // R · 90,5-94,4 · la foto vieja: las sillas de cajones de fruta del papá → la pila de tarimas que junta él
  if (t >= AVS[5][1] && t < T.antes + 0.05) {
    L.push(W("wR"));
    L.push(<AbsoluteFill key="rdk" style={{ background: "rgba(14,8,4,.45)", opacity: 1 - e(t, T.junto - 0.4, T.junto) }} />);
    L.push(<FotoVieja key="fv" t={t} at={AVS[5][1] + 0.05} out={T.junto - 0.35} k="h_cajones" x={960} y={520} cap="sillas de cajón de fruta, 1974" />);
    L.push(<Rayado key="si" t={t} at={T.sillas} out={T.junto - 0.35} x={1520} y={180} text="hacía sillas" rot={5} />);
    if (t > T.junto - 0.2) { const pp = screenOf(t, PT.pila); L.push(<Tag key="jt" t={t} at={T.junto} x={pp.x} y={pp.y} dx={-260} dy={-200} text="YO JUNTO" sub="TARIMAS" col={CH.maiz} out={T.antes} size={64} />); }
  }
  // S · 94,4-105 · CTA: "si esto le está sirviendo, suscríbase y tóquele a la campanita. Y cuénteme aquí abajo: ¿usted tiene una tarima arrumbada en su casa?"
  // (sin avatar: el tramo se regrabó y el reel decía otra cosa)
  if (t >= T.antes && t < 105.0) {
    L.push(W("wS"));
    L.push(<BotonTabla key="sb" t={t} at={T.antes + 0.5} press={T.susc + 0.1} out={T.abajo - 0.2} x={760} y={800} />);
    L.push(<Campana key="cp" t={t} at={T.susc + 0.6} ring={T.campana + 0.15} out={T.abajo - 0.2} x={1420} y={330} />);
    L.push(<Rayado key="ab" t={t} at={T.abajo} out={104.9} x={560} y={930} text="escríbamelo aquí abajo ↓" rot={-3} size={64} />);
    L.push(<Tablita key="tq" t={t} at={T.usted - 0.15} out={104.9} x={720} y={330} lines={["¿Usted tiene una tarima", "arrumbada en su casa?"]} />);
    if (t > T.arrumbada - 0.3) { const pp = screenOf(t, PT.pila); L.push(<Tag key="ar" t={t} at={T.arrumbada} x={pp.x} y={pp.y} dx={180} dy={-160} text="ARRUMBADA" sub="NO ES BASURA" col={CH.maiz} out={104.9} size={58} />); }
  }
  // U · 105-107,7 · "ahora sí, vámonos al taller": la cámara cruza el taller hasta la pila de tarimas (sigue en Rest)
  if (t >= 105.0) {
    L.push(W("wU"));
    L.push(<Rayado key="vt" t={t} at={T.taller} out={MIN1_END + 2} x={960} y={200} text="vámonos al taller" rot={-3} size={76} />);
  }

  return <AbsoluteFill style={{ background: "#0a0603" }}>{L}</AbsoluteFill>;
};
