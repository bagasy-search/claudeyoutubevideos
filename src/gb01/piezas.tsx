// gb01 · piezas nuevas del minuto 1 (estilo explicador-neon, The Glass Brain). Todo en segundos absolutos y en
// coordenadas del MUNDO (las mueve la cámara del escenario). Vectorial: se puede acercar sin pixelar.
//   TragaTiradas  tragamonedas con resultados elegidos por tirada (pierde, pierde… gana)
//   CelularPull   celular en inglés con "tirar para actualizar" (dedo, ruedita, "No new posts", aviso)
//   CableLuz      cable de luz celular → palanca: en cada tirada corre un paquete de luz
//   CerebroQuizas cerebro de cristal con el núcleo de dopamina que se prende ANTES del premio
//   LineaQuizas   pull → maybe → prize con el pico de dopamina en el "maybe"
//   CerebroPartido el cerebro se abre en 4 piezas y adentro de cada una gira un engranaje (los 4 engranajes)
//   OlaImpulso    la ola del impulso: sube, llega al pico y baja
import React from "react";
import { interpolate } from "remotion";
import { BlurDef, N, NeonPath, SANS, SERIF, balanceo, clamp, ease, easeOut, neonOn, pop, ramp, respira, useSvgId, useT, vis } from "../kits/neon/base";
import { Cerebro } from "../kits/neon/Objetos";

type P2 = [number, number];

// ───────── tragamonedas con tiradas elegidas ─────────
const SIM_H = 26;
const TIRAS = [[0, 1, 2, 3], [0, 3, 1, 2], [0, 2, 3, 1]]; // 0 = 7 · 1 = estrella · 2 = cerezas · 3 = BAR
const Simbolo: React.FC<{ k: number; y: number }> = ({ k, y }) => {
  const s = k % 4;
  if (s === 0) return <text x={18} y={y + 9} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={24} fill="#d3122c">7</text>;
  if (s === 1) return <polygon transform={`translate(18,${y})`} points="0,-10 2.9,-3.1 10,-3.1 4.3,1.4 6.5,8.5 0,4.3 -6.5,8.5 -4.3,1.4 -10,-3.1 -2.9,-3.1" fill="#e9a400" />;
  if (s === 2) return <g transform={`translate(18,${y})`}><circle cx={-4} cy={4} r={5} fill="#c8102e" /><circle cx={5} cy={5} r={5} fill="#c8102e" /><path d="M-4,0 Q0,-10 6,-11 M5,1 Q3,-6 6,-11" stroke="#2f7a2f" strokeWidth={1.6} fill="none" /></g>;
  return <g transform={`translate(18,${y})`}><rect x={-13} y={-6} width={26} height={12} rx={2} fill="#111" /><text x={0} y={3.5} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={9} fill="#f4c24a">BAR</text></g>;
};
export type Tirada = { t: number; res: [number, number, number] };
const DUR_RODILLO = [0.7, 0.9, 1.1];
// posición de cada rodillo (en símbolos) en el segundo t: cada tirada suma vueltas + lo que falta para caer en su símbolo
const posRodillo = (t: number, i: number, tiradas: Tirada[], inicio: number) => {
  let p = TIRAS[i].indexOf(inicio);
  for (const [j, tr] of tiradas.entries()) {
    const destino = TIRAS[i].indexOf(tr.res[i]);
    const salto = 4 * (2 + i + (j % 2)) + ((((destino - p) % 4) + 4) % 4);
    if (t <= tr.t) return { pos: p, vel: 0 };
    const k = interpolate(t, [tr.t, tr.t + DUR_RODILLO[i]], [0, 1], { ...clamp, easing: easeOut });
    if (k < 1) return { pos: p + salto * k, vel: 1 - k };
    p += salto;
  }
  return { pos: p, vel: 0 };
};
export const finTirada = (tr: Tirada) => tr.t + DUR_RODILLO[2];
export const TragaTiradas: React.FC<{ x: number; y: number; t0: number; tam?: number; tiradas: Tirada[]; apagada?: [number, number]; t1?: number }> = ({ x, y, t0, tam = 360, tiradas, apagada, t1 = Infinity }) => {
  const t = useT();
  const b = useSvgId("gtb"), oro = useSvgId("gto"), rod = useSvgId("gtr"), mar = useSvgId("gtm"), vb = useSvgId("gtv");
  if (!vis(t, t0, t1)) return null;
  const h = tam * 1.29;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  // apagada = [desde, hasta]: la máquina se ve como contorno sin luces (la escena "no ves las luces")
  const luz = apagada ? Math.max(1 - ramp(t, apagada[0], 0.5), neonOn(t, apagada[1])) : 1;
  const on = neonOn(t, t0) * respira(t, 0.3, 0.05);
  const ult = [...tiradas].reverse().find((tr) => t > finTirada(tr));
  const gano = !!ult && ult.res[0] === ult.res[1] && ult.res[1] === ult.res[2] && t < finTirada(ult) + 2.6;
  const palanca = tiradas.reduce((m, tr) => Math.max(m, interpolate(t, [tr.t - 0.18, tr.t, tr.t + 0.4], [0, 1, 0], clamp)), 0);
  const rot = balanceo(t, t0, 5, 0.4);
  return (
    <div style={{ position: "absolute", left: x - tam / 2, top: y - h / 2, width: tam, height: h, transformOrigin: "50% 0%", transform: `rotate(${rot * 0.5}deg) scale(${(0.82 + 0.18 * pop(t, t0, 11)) * (1 - 0.3 * sal)})`, opacity: on * (1 - sal) }}>
      <svg viewBox="0 0 210 270" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <BlurDef id={b} s={6} />
          <filter id={vb} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="0 2.6" /></filter>
          <linearGradient id={oro} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3b2608" /><stop offset="0.18" stopColor="#b8862e" /><stop offset="0.42" stopColor="#ffe9a8" /><stop offset="0.6" stopColor="#d4a446" /><stop offset="0.85" stopColor="#6b4610" /><stop offset="1" stopColor="#2a1a05" /></linearGradient>
          <linearGradient id={rod} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d8d8d" /><stop offset="0.25" stopColor="#f4f1ea" /><stop offset="0.75" stopColor="#f4f1ea" /><stop offset="1" stopColor="#8d8d8d" /></linearGradient>
          <linearGradient id={mar} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a0c14" /><stop offset="1" stopColor="#1c0306" /></linearGradient>
        </defs>
        {/* contorno de neón blanco: lo único que se ve con la máquina apagada */}
        <g opacity={1 - luz * 0.85}>
          <NeonPath d="M28,72 L28,42 Q28,10 100,10 Q172,10 172,42 L172,72 M18,70 L182,70 L182,222 L18,222 Z M14,242 L186,242 L186,260 L14,260 Z M30,92 L170,92 L170,172 L30,172 Z" color="#e6eeff" ancho={1.6} blurId={b} len={1600} k={ramp(t, t0, 0.8, easeOut)} />
        </g>
        <g opacity={luz}>
          <ellipse cx={100} cy={140} rx={110} ry={130} fill="#ffcf70" opacity={gano ? 0.24 + 0.1 * Math.sin(t * 14) : 0.1} filter={`url(#${b})`} />
          <path d="M28,72 L28,42 Q28,10 100,10 Q172,10 172,42 L172,72 Z" fill={`url(#${mar})`} stroke={`url(#${oro})`} strokeWidth={4} />
          {Array.from({ length: 15 }).map((_, i) => {
            const an = Math.PI + (i / 14) * Math.PI, bx = 100 + 66 * Math.cos(an), by = 44 + 28 * Math.sin(an);
            const lit = (Math.floor(t * (gano ? 16 : 6)) + i) % 3 === 0;
            return <circle key={i} cx={bx} cy={by} r={3.2} fill={lit ? "#fff6d0" : "#7a5a20"} style={{ filter: lit ? "drop-shadow(0 0 3px #ffd36b)" : undefined }} />;
          })}
          <text x={100} y={58} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={17} fill="#ffd36b" letterSpacing={1}>777</text>
          <rect x={18} y={70} width={164} height={152} rx={9} fill={`url(#${oro})`} />
          <rect x={30} y={92} width={140} height={80} rx={7} fill="#0b0b0d" stroke="#2a1a05" strokeWidth={2} />
        </g>
        {[0, 1, 2].map((i) => {
          const { pos, vel } = posRodillo(t, i, tiradas, [2, 3, 1][i]);
          const idx = Math.floor(pos), frac = pos - idx;
          return (
            <g key={i} transform={`translate(${38 + i * 44},98)`} opacity={0.15 + 0.85 * luz}>
              <rect width={36} height={68} rx={3} fill={`url(#${rod})`} />
              <svg x={0} y={0} width={36} height={68} style={{ overflow: "hidden" }}>
                <g filter={vel > 0.15 ? `url(#${vb})` : undefined}>
                  {[-2, -1, 0, 1, 2].map((j) => <Simbolo key={j} k={TIRAS[i][(((idx - j) % 4) + 4) % 4]} y={34 + (j + frac) * SIM_H} />)}
                </g>
              </svg>
              <rect width={36} height={68} rx={3} fill="none" stroke="#000" strokeOpacity={0.35} />
            </g>
          );
        })}
        {ult && gano && <rect x={30} y={92} width={140} height={80} rx={7} fill="#fff" opacity={interpolate(t, [finTirada(ult), finTirada(ult) + 0.08, finTirada(ult) + 0.5], [0, 0.55, 0], clamp)} />}
        <g opacity={luz}>
          <rect x={40} y={182} width={120} height={14} rx={3} fill="#1a1206" stroke="#7a5a20" strokeWidth={1.5} />
          <rect x={26} y={222} width={148} height={20} rx={3} fill="#2a1a05" stroke={`url(#${oro})`} strokeWidth={3} />
          <rect x={14} y={242} width={172} height={18} rx={4} fill={`url(#${oro})`} />
          <g transform={`rotate(${palanca * 52} 192 150)`}>
            <rect x={188} y={92} width={8} height={60} rx={3} fill={`url(#${oro})`} />
            <circle cx={192} cy={88} r={11} fill="#d3122c" />
            <circle cx={188} cy={84} r={3.5} fill="#fff" opacity={0.7} />
          </g>
          <rect x={182} y={140} width={18} height={20} rx={4} fill={`url(#${oro})`} />
        </g>
      </svg>
    </div>
  );
};
// enchufe del costado izquierdo (a la altura de los rodillos): ahí llega el cable de luz del celular
export const enchufeIzq = (x: number, y: number, tam = 360): P2 => [x - tam / 2 + (18 / 210) * tam, y - (tam * 1.29) / 2 + (132 / 270) * tam * 1.29];
// punta de la bola de la palanca en el mundo (para enchufarle el cable de luz)
export const bolaPalanca = (x: number, y: number, tam = 360): P2 => [x - tam / 2 + (192 / 210) * tam, y - (tam * 1.29) / 2 + (88 / 270) * tam * 1.29];

// ───────── celular en inglés con pull-to-refresh ─────────
export type Tiron = { t: number; nada?: boolean }; // cada tirón: el dedo baja ~0,55 s y suelta; nada = "No new posts"
const FONDOS = [["#2b3a55", "#141b2b", "#06080d"], ["#4a2a3a", "#22131c", "#0a0508"], ["#2c4a3b", "#14231c", "#050a08"], ["#4b3a1f", "#241b0e", "#0a0704"]];
export const CelularPull: React.FC<{ x: number; y: number; t0: number; t1?: number; ancho?: number; tirones: Tiron[]; reloj?: string; aviso?: { t: number; quien: string; texto: string }; like?: number; risa?: number }> = ({ x, y, t0, t1 = Infinity, ancho = 300, tirones, reloj = "2:07", aviso, like, risa }) => {
  const t = useT();
  if (!vis(t, t0, t1)) return null;
  const w = ancho, h = w * 2.12, bz = w * 0.034, r = w * 0.16, iw = w - bz * 2, ih = h - bz * 2;
  const e = pop(t, t0, 12, 140);
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const rot = balanceo(t, t0, 5, 0.7) * 0.6;
  // estirón del contenido: baja con el dedo, la ruedita gira y vuelve
  let tiro = 0, rueda = 0, nada = 0, hechos = 0;
  for (const tr of tirones) {
    const k = interpolate(t, [tr.t - 0.45, tr.t, tr.t + 0.55], [0, 1, 0], { ...clamp, easing: ease });
    tiro = Math.max(tiro, k);
    if (t > tr.t - 0.3 && t < tr.t + 0.5) rueda = 1;
    if (tr.nada) nada = Math.max(nada, interpolate(t, [tr.t + 0.35, tr.t + 0.5, tr.t + 1.2, tr.t + 1.4], [0, 1, 1, 0], clamp));
    if (t > tr.t + 0.45) hechos++;
  }
  const ultimoGana = tirones.length && !tirones[tirones.length - 1].nada && t > tirones[tirones.length - 1].t + 0.45;
  const fondo = FONDOS[ultimoGana ? 3 : 0];
  const kAv = aviso ? pop(t, aviso.t, 13) : 0;
  const kLike = like ? pop(t, like, 9) : 0;
  const kRisa = risa ? ramp(t, risa, 0.4) : 0;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transformOrigin: "50% 0%", transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * e})`, opacity: Math.min(1, e * 1.4) * (1 - sal), filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: "linear-gradient(135deg,#c9ced6 0%,#3a3e46 22%,#e6e9ee 48%,#2c2f35 72%,#aab0b9 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,.25), 0 0 24px rgba(255,255,255,.18)" }} />
      <div style={{ position: "absolute", right: -3, top: h * 0.28, width: 3, height: h * 0.11, borderRadius: 2, background: "#8a9099" }} />
      <div style={{ position: "absolute", inset: bz, borderRadius: r - bz, overflow: "hidden", background: "#000" }}>
        {/* ruedita que aparece arriba al estirar */}
        <div style={{ position: "absolute", left: iw / 2 - 16, top: ih * 0.11 + tiro * ih * 0.05, width: 32, height: 32, borderRadius: "50%", border: "3px solid rgba(255,255,255,.25)", borderTopColor: "#fff", opacity: tiro, transform: `rotate(${rueda ? t * 720 : tiro * 300}deg)` }} />
        {/* contenido que baja con el dedo */}
        <div style={{ position: "absolute", left: 0, top: tiro * ih * 0.16, width: iw, height: ih, background: `radial-gradient(circle at 35% 38%, ${fondo[0]} 0%, ${fondo[1]} 40%, ${fondo[2]} 88%)`, borderRadius: tiro > 0.02 ? 18 : 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: ih * 0.075, display: "flex", justifyContent: "center", gap: iw * 0.08, fontFamily: SANS, fontWeight: 700, fontSize: iw * 0.052, color: "rgba(255,255,255,.65)" }}>
            <span>Following</span><span style={{ color: "#fff", borderBottom: "2px solid #fff", paddingBottom: 3 }}>For You</span>
          </div>
          {/* "video" que cambia con cada tirón: una silueta y una cara que se ríe cuando gana */}
          <div style={{ position: "absolute", left: iw * 0.26, top: ih * 0.3, width: iw * 0.48, height: iw * 0.48, borderRadius: "50%", background: ultimoGana ? "rgba(255,214,120,.5)" : "rgba(255,255,255,.14)", filter: "blur(3px)", transform: `translateY(${Math.sin(t * 2 + hechos) * 6}px)` }} />
          {ultimoGana && (
            <svg viewBox="0 0 100 100" style={{ position: "absolute", left: iw * 0.3, top: ih * 0.32, width: iw * 0.4, height: iw * 0.4 }}>
              <circle cx={36} cy={40} r={5} fill="#1a1206" /><circle cx={64} cy={40} r={5} fill="#1a1206" />
              <path d={`M28,58 Q50,${70 + 14 * kRisa} 72,58 Z`} fill="#1a1206" />
            </svg>
          )}
          <div style={{ position: "absolute", left: iw * 0.2, top: ih * 0.56, width: iw * 0.6, height: ih * 0.26, borderRadius: `${iw * 0.3}px ${iw * 0.3}px 0 0`, background: "rgba(0,0,0,.25)", filter: "blur(4px)" }} />
          {/* columna de íconos: el corazón se llena con el like */}
          <div style={{ position: "absolute", right: iw * 0.05, top: ih * 0.5, display: "flex", flexDirection: "column", alignItems: "center", gap: ih * 0.02, fontFamily: SANS, fontWeight: 700, fontSize: iw * 0.04, color: "#fff" }}>
            <svg viewBox="0 0 24 24" width={iw * 0.12} height={iw * 0.12} style={{ transform: `scale(${1 + 0.5 * kLike * Math.max(0, 1 - (t - (like ?? 0)) * 2)})` }}>
              <path d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2 4.5 5.8 4.5c2.3 0 3.6 1.4 4.2 2.6.6-1.2 1.9-2.6 4.2-2.6 3.8 0 5.5 3.9 3.8 7.2C19.5 16.4 12 21 12 21z" fill={kLike > 0.5 ? "#ff2d55" : "none"} stroke="#fff" strokeWidth={1.6} />
            </svg>
            <div>{kLike > 0.5 ? "1" : "0"}</div>
          </div>
          <div style={{ position: "absolute", left: iw * 0.06, bottom: ih * 0.07, width: iw * 0.7 }}>
            <div style={{ height: 6, width: "90%", borderRadius: 3, background: "rgba(255,255,255,.7)", marginBottom: 5 }} />
            <div style={{ height: 6, width: "60%", borderRadius: 3, background: "rgba(255,255,255,.5)" }} />
          </div>
        </div>
        {/* "No new posts" */}
        {nada > 0.01 && (
          <div style={{ position: "absolute", left: "50%", top: ih * 0.2, transform: `translate(-50%,0) scale(${0.9 + 0.1 * nada})`, opacity: nada, padding: `${iw * 0.04}px ${iw * 0.07}px`, borderRadius: 60, background: "rgba(30,30,34,.92)", border: "1.5px solid rgba(255,255,255,.3)", fontFamily: SANS, fontWeight: 800, fontSize: iw * 0.075, color: "rgba(255,255,255,.85)", whiteSpace: "nowrap" }}>No new posts</div>
        )}
        {/* aviso que baja */}
        {kAv > 0 && aviso && (
          <div style={{ position: "absolute", left: iw * 0.04, right: iw * 0.04, top: ih * 0.05 + (kAv - 1) * 120, borderRadius: iw * 0.07, padding: `${iw * 0.035}px ${iw * 0.04}px`, background: "rgba(40,40,46,.86)", border: "1px solid rgba(255,255,255,.18)", display: "flex", gap: iw * 0.03, alignItems: "center", boxShadow: "0 10px 26px rgba(0,0,0,.45)" }}>
            <div style={{ width: iw * 0.11, height: iw * 0.11, borderRadius: iw * 0.03, background: "linear-gradient(135deg,#34c759,#1f9d48)", flexShrink: 0 }} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: iw * 0.046, color: "#fff", lineHeight: 1.15 }}>{aviso.quien}<div style={{ fontWeight: 600, fontSize: iw * 0.04, color: "rgba(255,255,255,.75)" }}>{aviso.texto}</div></div>
          </div>
        )}
        {/* reloj de pantalla bloqueada arriba: la hora de la escena */}
        <div style={{ position: "absolute", left: iw * 0.07, top: ih * 0.018, fontFamily: SANS, fontWeight: 700, fontSize: iw * 0.045, color: "#fff" }}>{reloj}</div>
        <div style={{ position: "absolute", left: "50%", top: ih * 0.014, width: iw * 0.3, height: iw * 0.085, borderRadius: iw * 0.05, background: "#000", transform: "translateX(-50%)" }} />
        {/* dedo */}
        {tirones.map((tr, i) => {
          const k = interpolate(t, [tr.t - 0.6, tr.t + 0.15], [0, 1], clamp);
          if (k <= 0 || k >= 1) return null;
          const yy = ih * (0.22 + 0.3 * ease(Math.min(1, Math.max(0, (k - 0.15) / 0.75))));
          return <div key={i} style={{ position: "absolute", left: iw / 2 - 24, top: yy - 24, width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.4)", border: "2px solid rgba(255,255,255,.85)", opacity: Math.sin(Math.PI * k) }} />;
        })}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, rgba(255,255,255,.15) 0%, rgba(255,255,255,.04) 30%, transparent 46%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
};
export const altoCelular = (ancho = 300) => ancho * 2.12;

// ───────── cable de luz: una curva fija; en cada pulso corre un paquete brillante de a → b ─────────
export const CableLuz: React.FC<{ a: P2; b: P2; t0: number; t1?: number; pulsos: number[]; sag?: number; color?: string; haciaA?: boolean }> = ({ a, b, t0, t1 = Infinity, pulsos, sag = 80, color = "#ffffff", haciaA = false }) => {
  const t = useT();
  const id = useSvgId("cl");
  if (!vis(t, t0, t1)) return null;
  const x0 = Math.min(a[0], b[0]) - 60, y0 = Math.min(a[1], b[1]) - 60 - Math.max(0, -sag), x1 = Math.max(a[0], b[0]) + 60, y1 = Math.max(a[1], b[1]) + 60 + Math.max(0, sag);
  const c: P2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
  const d = `M${a[0] - x0},${a[1] - y0} Q${c[0] - x0},${c[1] - y0} ${b[0] - x0},${b[1] - y0}`;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.15;
  const k = ramp(t, t0, 0.45, easeOut);
  const op = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.3, 0.3);
  return (
    <svg width={x1 - x0} height={y1 - y0} style={{ position: "absolute", left: x0, top: y0, overflow: "visible", opacity: op, pointerEvents: "none" }}>
      <defs><BlurDef id={id} s={4} /></defs>
      <path d={d} fill="none" stroke={color} strokeWidth={8} opacity={0.22} filter={`url(#${id})`} strokeDasharray={`${L * k} ${L * 2}`} />
      <path d={d} fill="none" stroke={color} strokeWidth={2} opacity={0.8} strokeLinecap="round" strokeDasharray={`${L * k} ${L * 2}`} />
      {pulsos.map((p, i) => {
        const f = interpolate(t, [p - 0.35, p], [0, 1], clamp);
        if (f <= 0 || f >= 1) return null;
        return <path key={i} d={d} fill="none" stroke={N.oroClaro} strokeWidth={7} strokeLinecap="round" filter={`url(#${id})`} strokeDasharray={`${L * 0.14} ${L * 3}`} strokeDashoffset={-L * ((haciaA ? 1 - f : f) * 1.05 - 0.12)} />;
      })}
    </svg>
  );
};

// ───────── cerebro de cristal con el núcleo de dopamina (área tegmental ventral, en el medio) ─────────
// tQuizas = se prende fuerte (el "maybe"), tPremio = llega el premio y el núcleo casi no reacciona.
export const NUCLEO: P2 = [142 / 240, 112 / 180]; // dónde cae el núcleo dentro de la caja del cerebro
export const CerebroQuizas: React.FC<{ x: number; y: number; t0: number; t1?: number; tam?: number; quizas?: number[]; tPremio?: number; etiqueta?: { texto: string; t: number } }> = ({ x, y, t0, t1 = Infinity, tam = 420, quizas = [], tPremio, etiqueta }) => {
  const t = useT();
  if (!vis(t, t0, t1)) return null;
  const h = tam * 0.75;
  const on = neonOn(t, t0) * respira(t, 1.2, 0.05);
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const fuego = quizas.reduce((m, q) => Math.max(m, interpolate(t, [q - 0.05, q + 0.15, q + 1.6], [0, 1, 0.35], clamp) * (t < q + 3.2 ? 1 : 0.35)), 0);
  const premio = tPremio ? interpolate(t, [tPremio, tPremio + 0.15, tPremio + 0.6], [0, 0.25, 0.1], clamp) : 0;
  const k = Math.max(fuego, premio);
  const nx = NUCLEO[0] * tam, ny = NUCLEO[1] * h;
  return (
    <div style={{ position: "absolute", left: x - tam / 2, top: y - h / 2, width: tam, height: h, transform: `scale(${(0.82 + 0.18 * pop(t, t0, 11)) * (1 - 0.3 * sal)}) rotate(${balanceo(t, t0, 3, 0.2) * 0.5}deg)`, opacity: 1 - sal }}>
      <div style={{ position: "absolute", left: -tam * 0.35, top: -h * 0.35, width: tam * 1.7, height: h * 1.7, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,230,255,.14) 0%, transparent 62%)", opacity: on }} />
      <Cerebro t={t} t0={t0} on={on} color="#fff" />
      {/* el núcleo: punto dorado que se prende y tira rayos hacia el frente del cerebro */}
      <div style={{ position: "absolute", left: nx - tam * 0.3, top: ny - tam * 0.3, width: tam * 0.6, height: tam * 0.6, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,214,110,${0.75 * k}) 0%, rgba(255,160,40,${0.3 * k}) 30%, transparent 65%)`, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: nx - 9, top: ny - 9, width: 18, height: 18, borderRadius: "50%", background: N.oroClaro, opacity: on * (0.35 + 0.65 * k), boxShadow: `0 0 ${10 + 40 * k}px ${N.oro}, 0 0 ${30 + 90 * k}px rgba(244,194,74,.6)`, transform: `scale(${1 + 0.6 * k})` }} />
      <svg viewBox="0 0 240 180" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {["M142,112 C130,96 104,84 74,70", "M142,112 C138,90 128,62 118,36", "M142,112 C120,108 96,108 70,100"].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={N.oroClaro} strokeWidth={2.4} strokeLinecap="round" opacity={k * (0.5 + 0.5 * Math.sin(t * 9 + i))} strokeDasharray="10 160" strokeDashoffset={-((t * 120 + i * 40) % 170)} style={{ filter: `drop-shadow(0 0 4px ${N.oro})` }} />
        ))}
      </svg>
      {etiqueta && t > etiqueta.t && (
        <div style={{ position: "absolute", left: nx + tam * 0.5, top: ny + tam * 0.1, transform: `scale(${pop(t, etiqueta.t, 12)})`, transformOrigin: "0 0", fontFamily: SERIF, fontStyle: "italic", fontSize: tam * 0.12, color: N.oroClaro, whiteSpace: "nowrap", textShadow: `0 0 18px ${N.oro}` }}>{etiqueta.texto}</div>
      )}
    </div>
  );
};

// ───────── pull → maybe → prize: el pico de dopamina cae en el MAYBE, no en el premio ─────────
export const LineaQuizas: React.FC<{ x: number; y: number; t0: number; tMarcas: [number, number, number]; tPico: number; t1?: number; ancho?: number }> = ({ x, y, t0, tMarcas, tPico, t1 = Infinity, ancho = 900 }) => {
  const t = useT();
  const id = useSvgId("lq");
  if (!vis(t, t0, t1)) return null;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const alto = 340, base = 270;
  const X = [ancho * 0.1, ancho * 0.5, ancho * 0.88];
  const nombres = ["pull", "*maybe*", "prize"];
  // curva: plana, sube fuerte antes del maybe, pico en el maybe, baja antes del premio y queda un rulito chico
  const curva = `M0,${base} L${X[0]},${base} C${X[0] + 120},${base} ${X[1] - 120},${base - 230} ${X[1]},${base - 240} C${X[1] + 110},${base - 230} ${X[2] - 170},${base - 40} ${X[2]},${base - 46} C${X[2] + 40},${base - 50} ${ancho - 20},${base - 10} ${ancho},${base}`;
  return (
    <div style={{ position: "absolute", left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, opacity: (1 - sal) * neonOn(t, t0) }}>
      <svg width={ancho} height={alto} style={{ overflow: "visible" }}>
        <defs><BlurDef id={id} s={5} /></defs>
        <NeonPath d={`M0,${base} L${ancho},${base}`} color="#e6eeff" ancho={1.6} k={ramp(t, t0, 0.6, easeOut)} len={ancho + 10} blurId={id} halo={0.5} />
        {X.map((xx, i) => (
          <g key={i} opacity={neonOn(t, tMarcas[i])}>
            <line x1={xx} x2={xx} y1={base - 14} y2={base + 14} stroke="#fff" strokeWidth={3} />
          </g>
        ))}
        <NeonPath d={curva} color={N.oro} alma={N.oroClaro} ancho={3.2} k={ramp(t, tPico - 0.9, 1.6, ease)} len={ancho * 1.6} blurId={id} />
        {t > tPico && <circle cx={X[1]} cy={base - 240} r={10 + 6 * Math.sin(t * 6)} fill={N.oroClaro} opacity={0.9} style={{ filter: `drop-shadow(0 0 14px ${N.oro})` }} />}
      </svg>
      {X.map((xx, i) => {
        const it = nombres[i].startsWith("*");
        return (
          <div key={i} style={{ position: "absolute", left: xx, top: base + 26, transform: `translate(-50%,0) scale(${pop(t, tMarcas[i], 12)})`, opacity: t > tMarcas[i] ? 1 : 0, fontFamily: it ? SERIF : SANS, fontStyle: it ? "italic" : "normal", fontWeight: it ? 400 : 800, fontSize: it ? 64 : 40, color: it ? N.oroClaro : "#fff", textShadow: it ? `0 0 18px ${N.oro}` : undefined, whiteSpace: "nowrap" }}>{nombres[i].replace(/\*/g, "")}</div>
        );
      })}
    </div>
  );
};

// ───────── engranaje de neón ─────────
const engranaje = (n: number, R: number, r: number) => {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 0.25) / n) * Math.PI * 2, a2 = ((i + 0.5) / n) * Math.PI * 2, a3 = ((i + 0.75) / n) * Math.PI * 2;
    const p = (a: number, rr: number) => `${(rr * Math.cos(a)).toFixed(1)},${(rr * Math.sin(a)).toFixed(1)}`;
    d += `${i ? "L" : "M"}${p(a0, r)} L${p(a1, R)} L${p(a2, R)} L${p(a3, r)} `;
  }
  return d + "Z";
};
export const Engranaje: React.FC<{ n?: number; R: number; color: string; ang: number; on: number; id: string }> = ({ n = 10, R, color, ang, on, id }) => (
  <g transform={`rotate(${ang})`} opacity={on}>
    <NeonPath d={engranaje(n, R, R * 0.8)} color={color} ancho={2.4} blurId={id} fill={`${color}14`} />
    <NeonPath d={`M${R * 0.32},0 A${R * 0.32},${R * 0.32} 0 1 1 ${R * 0.32 - 0.1},0`} color={color} ancho={1.8} blurId={id} halo={0.5} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={0} x2={R * 0.62 * Math.cos((i * Math.PI) / 2)} y2={R * 0.62 * Math.sin((i * Math.PI) / 2)} stroke={color} strokeWidth={2} opacity={0.6} />)}
  </g>
);

// ───────── el cerebro se parte en 4 y deja ver los 4 engranajes ─────────
// tParte = se abre (piece by piece) · tEngr[i] = se prende el engranaje i con su número · tGira = empiezan a girar
// juntos (keep you scrolling) · tFrena = frenan y se apagan (la práctica que detiene la máquina)
const COLORES = [N.oro, "#ff5a6e", N.cian, N.verde];
export const CerebroPartido: React.FC<{ x: number; y: number; t0: number; tParte: number; tEngr: number[]; tGira: number; tFrena?: number; t1?: number; tam?: number }> = ({ x, y, t0, tParte, tEngr, tGira, tFrena = Infinity, t1 = Infinity, tam = 520 }) => {
  const t = useT();
  const ids = [useSvgId("cp0"), useSvgId("cp1"), useSvgId("cp2"), useSvgId("cp3")], gid = useSvgId("cpg");
  if (!vis(t, t0, t1)) return null;
  const h = tam * 0.75;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const ab = ramp(t, tParte, 0.9, easeOut);
  const on = respira(t, 0.4, 0.05);
  // velocidad de giro: arranca en tGira, frena en tFrena (el ángulo es la integral, sin saltos)
  const vel = (u: number) => interpolate(u, [tGira, tGira + 0.6, tFrena, tFrena + 1.8], [0, 1, 1, 0], clamp);
  let ang = 0; for (let u = tGira; u < t; u += 1 / 30) ang += vel(u) * 3.2;
  const apaga = tFrena === Infinity ? 0 : ramp(t, tFrena + 1.2, 1.0);
  const Q: { cx: number; cy: number; dx: number; dy: number }[] = [
    { cx: 0, cy: 0, dx: -1, dy: -1 }, { cx: 0.5, cy: 0, dx: 1, dy: -1 }, { cx: 0, cy: 0.5, dx: -1, dy: 1 }, { cx: 0.5, cy: 0.5, dx: 1, dy: 1 },
  ];
  const sep = tam * 0.2;
  return (
    <div style={{ position: "absolute", left: x - tam / 2, top: y - h / 2, width: tam, height: h, opacity: 1 - sal }}>
      {Q.map((q, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, clipPath: `inset(${q.cy * 100}% ${(0.5 - q.cx) * 100}% ${(0.5 - q.cy) * 100}% ${q.cx * 100}%)`, transform: `translate(${q.dx * sep * ab}px,${q.dy * sep * 0.75 * ab}px) rotate(${q.dx * q.dy * 4 * ab}deg)`, opacity: 1 - 0.55 * ramp(t, tEngr[i] ?? Infinity, 0.5) }}>
          <Cerebro t={t} t0={t0} on={on} color="#fff" />
        </div>
      ))}
      {/* grietas de luz en el instante en que se parte */}
      <svg width={tam} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs><BlurDef id={gid} s={4} /></defs>
        <g opacity={interpolate(t, [tParte - 0.1, tParte, tParte + 0.6], [0, 1, 0], clamp)}>
          <path d={`M${tam / 2},0 L${tam / 2},${h} M0,${h / 2} L${tam},${h / 2}`} stroke="#fff" strokeWidth={4} filter={`url(#${gid})`} />
        </g>
      </svg>
      {/* engranajes: uno en el centro de cada pieza (los vecinos giran al revés, como engranados) */}
      <svg width={tam} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Q.map((q, i) => {
          const te = tEngr[i] ?? Infinity;
          if (t < te - 0.05) return null;
          const gx = (q.cx + 0.25) * tam + q.dx * sep * ab, gy = (q.cy + 0.25) * h + q.dy * sep * 0.75 * ab;
          const R = tam * 0.15 * (0.7 + 0.3 * pop(t, te, 10));
          const sentido = (i === 0 || i === 3) ? 1 : -1;
          return (
            <g key={i} transform={`translate(${gx},${gy})`}>
              <Engranaje R={R} color={COLORES[i]} ang={sentido * ang + i * 9} on={neonOn(t, te) * (1 - 0.75 * apaga)} id={ids[i]} />
              <text x={0} y={R * 0.24} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={R * 0.7} fill="#fff" opacity={neonOn(t, te + 0.1) * (1 - 0.6 * apaga)} style={{ filter: `drop-shadow(0 0 8px ${COLORES[i]})` }}>{i + 1}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ───────── la ola del impulso: sube, pico, baja (urge surfing) ─────────
export const OlaImpulso: React.FC<{ x: number; y: number; t0: number; t1?: number; ancho?: number; texto?: string }> = ({ x, y, t0, t1 = Infinity, ancho = 800, texto }) => {
  const t = useT();
  const id = useSvgId("ola");
  if (!vis(t, t0, t1)) return null;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const alto = 260, base = 220;
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const u = i / 80, xx = u * ancho;
    const env = Math.exp(-(((u - 0.5) / 0.17) ** 2));
    pts.push(`${xx.toFixed(1)},${(base - 180 * env - 8 * Math.sin(u * 40 + t * 3) * (1 - env)).toFixed(1)}`);
  }
  const k = ramp(t, t0, 1.6, ease);
  const surf = 0.06 + 0.88 * k;
  const sx = surf * ancho, sy = base - 180 * Math.exp(-(((surf - 0.5) / 0.17) ** 2));
  return (
    <div style={{ position: "absolute", left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, opacity: (1 - sal) * neonOn(t, t0) }}>
      <svg width={ancho} height={alto} style={{ overflow: "visible" }}>
        <defs><BlurDef id={id} s={5} /></defs>
        <NeonPath d={"M" + pts.join(" L")} color={N.cian} alma={N.cianClaro} ancho={3} k={k} len={ancho * 1.8} blurId={id} />
        <circle cx={sx} cy={sy - 10} r={9} fill="#fff" opacity={k < 1 ? 1 : 0.8} style={{ filter: `drop-shadow(0 0 10px ${N.cian})` }} />
      </svg>
      {texto && <div style={{ position: "absolute", left: ancho / 2, top: base + 18, transform: `translate(-50%,0) scale(${pop(t, t0 + 0.4, 12)})`, opacity: t > t0 + 0.4 ? 1 : 0, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: "#fff", whiteSpace: "nowrap" }}>{texto}</div>}
    </div>
  );
};

// ───────── el ojo que observa la mente ("watching the mind, my own first") ─────────
// La pupila sigue al cerebro (mira hacia `mira`), parpadea, y en tPropia gira hacia el espectador: en el iris se
// refleja un cerebrito de luz (la mente propia).
export const OjoMente: React.FC<{ x: number; y: number; t0: number; tPropia: number; t1?: number; tam?: number; mira: P2 }> = ({ x, y, t0, tPropia, t1 = Infinity, tam = 260, mira }) => {
  const t = useT();
  const id = useSvgId("om");
  if (!vis(t, t0, t1)) return null;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const on = neonOn(t, t0);
  // apertura del párpado: se abre al nacer, parpadea cada ~2,6 s y al mirarse a sí mismo
  const parp = (c: number) => interpolate(t, [c - 0.08, c, c + 0.1], [1, 0.08, 1], clamp);
  const ab = Math.min(ramp(t, t0, 0.5, easeOut), parp(t0 + 1.6), parp(tPropia - 0.05), parp(t0 + 4.4));
  const dx = mira[0] - x, dy = mira[1] - y, L = Math.hypot(dx, dy) || 1;
  const kP = ramp(t, tPropia, 0.45, ease);
  const px = (dx / L) * 34 * (1 - kP), py = (dy / L) * 18 * (1 - kP);
  const rIris = 40 + 8 * kP;
  return (
    <div style={{ position: "absolute", left: x - tam / 2, top: y - tam / 2, width: tam, height: tam, opacity: on * (1 - sal), transform: `scale(${0.85 + 0.15 * pop(t, t0, 12)})` }}>
      <svg viewBox="-100 -100 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs><BlurDef id={id} s={4} /><clipPath id={id + "c"}><path d={`M-88,0 C-50,${-62 * ab} 50,${-62 * ab} 88,0 C50,${62 * ab} -50,${62 * ab} -88,0 Z`} /></clipPath></defs>
        <NeonPath d={`M-88,0 C-50,${-62 * ab} 50,${-62 * ab} 88,0 C50,${62 * ab} -50,${62 * ab} -88,0 Z`} color={N.cianClaro} ancho={2.6} blurId={id} />
        <g clipPath={`url(#${id}c)`}>
          <circle cx={px} cy={py} r={rIris} fill="rgba(39,227,255,.08)" stroke={N.cian} strokeWidth={3} style={{ filter: `drop-shadow(0 0 8px ${N.cian})` }} />
          {Array.from({ length: 16 }).map((_, i) => { const a = (i / 16) * Math.PI * 2; return <line key={i} x1={px + Math.cos(a) * 18} y1={py + Math.sin(a) * 18} x2={px + Math.cos(a) * (rIris - 4)} y2={py + Math.sin(a) * (rIris - 4)} stroke={N.cianClaro} strokeWidth={1} opacity={0.45} />; })}
          <circle cx={px} cy={py} r={17 - 5 * kP} fill="#020405" stroke={N.cianClaro} strokeWidth={1.4} />
          {/* reflejo: la mente propia en el iris */}
          <g transform={`translate(${px},${py}) scale(${0.16 * kP})`} opacity={kP}>
            <path d="M-100,10 C-110,-40 -60,-80 -10,-70 C40,-90 100,-60 100,-10 C110,40 60,70 0,64 C-50,74 -95,50 -100,10 Z" fill="none" stroke={N.oroClaro} strokeWidth={10} />
            <path d="M-60,-20 C-30,-40 -10,-10 20,-30 M-40,20 C-10,0 20,30 60,10" fill="none" stroke={N.oroClaro} strokeWidth={8} />
          </g>
          <circle cx={px - 10} cy={py - 12} r={5} fill="#fff" opacity={0.9} />
        </g>
      </svg>
    </div>
  );
};

// ───────── mala de cuentas de neón ("I am an old monk… most of my life"): las cuentas se prenden de a una ─────────
export const tiemposMala = (t0: number, n = 21, paso = 0.28) => Array.from({ length: n }, (_, i) => t0 + i * paso);
export const MalaNeon: React.FC<{ x: number; y: number; t0: number; t1?: number; r?: number; n?: number; paso?: number }> = ({ x, y, t0, t1 = Infinity, r = 170, n = 21, paso = 0.28 }) => {
  const t = useT();
  const id = useSvgId("ml");
  if (!vis(t, t0, t1)) return null;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.4, 0.4);
  const tt = tiemposMala(t0, n, paso);
  const S = r + 90;
  return (
    <div style={{ position: "absolute", left: x - S, top: y - S, width: S * 2, height: S * 2 + 120, opacity: (1 - sal) * neonOn(t, t0 - 0.3) }}>
      <svg viewBox={`${-S} ${-S} ${S * 2} ${S * 2 + 120}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs><BlurDef id={id} s={5} /></defs>
        {/* hilo de la mala + borla que cuelga */}
        <circle r={r} fill="none" stroke="rgba(255,240,200,.25)" strokeWidth={1.5} />
        <NeonPath d={`M0,${r} L0,${r + 50} M-14,${r + 50} L14,${r + 50} L8,${r + 110} L-8,${r + 110} Z`} color={N.oro} alma={N.oroClaro} ancho={2} blurId={id} k={ramp(t, t0 - 0.3, 0.5)} len={300} />
        {tt.map((tb, i) => {
          const a = Math.PI / 2 + ((i + 0.5) / n) * Math.PI * 2;
          const k = neonOn(t, tb), viva = interpolate(t, [tb, tb + 0.12, tb + 0.6], [0, 1, 0.55], clamp);
          return (
            <g key={i} transform={`translate(${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)})`}>
              <circle r={15} fill="rgba(122,40,24,.55)" stroke="rgba(255,210,150,.35)" strokeWidth={1.4} />
              <circle r={15} fill={N.oroClaro} opacity={k * (0.25 + 0.75 * viva)} style={{ filter: `drop-shadow(0 0 ${6 + 14 * viva}px ${N.oro})` }} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
