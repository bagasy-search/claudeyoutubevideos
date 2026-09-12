// FaunaKit.tsx v3 — KIT PREMIUM para documentales de fauna/restauración.
// Look de EDITOR REAL: fotos/mapas/texturas reales, CÁMARA VIRTUAL, parallax,
// blur de movimiento, profundidad (sombras/viñeta/capas), partículas.
// Transiciones SUTILES (Ken-Burns/slide/fade) — NADA de pop-in de escala.
// Marca natural crema/tinta/salvia. TrophicWeb (#2) es la referencia dorada.
import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, Easing } from "remotion";

// ── Cámara virtual: recorre keyframes {f,x,y,z}; mueve al inicio de cada tramo
//    y se asienta. Devuelve foco + cuánto se está moviendo (para el blur). ──
const easeIO = Easing.bezier(0.5, 0, 0.2, 1);
function useCam(kf: { f: number; x: number; y: number; z: number }[], f: number, moveMax = 30) {
  let i = 0; while (i < kf.length - 2 && f >= kf[i + 1].f) i++;
  const a = kf[i], b = kf[Math.min(i + 1, kf.length - 1)];
  const segLen = Math.max(1, b.f - a.f);
  const mv = Math.min(moveMax, segLen * 0.72);
  const p = Math.max(0, Math.min(1, (f - a.f) / mv));
  const e = easeIO(p);
  const lerp = (k: "x" | "y" | "z") => a[k] + (b[k] - a[k]) * e;
  const moving = Math.sin(Math.min(1, (f - a.f) / mv) * Math.PI); // 0→1→0 en el tramo
  return { x: lerp("x"), y: lerp("y"), z: lerp("z"), moving: p < 1 ? moving : 0 };
}

const FONT = "Inter, 'Segoe UI', system-ui, sans-serif";
const SERIF = "'Georgia', 'Times New Roman', serif";
const SAGE = "#C7D49B";
const INK = "#161c10";
const CREAM = "#EFE9DC";
const GOLD = "#E3B457";
const RUST = "#E0523E";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);
const A = (n: string) => staticFile(`img/kit/${n}`);
// pseudo-random determinista (para partículas)
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Ken-Burns lento sobre una imagen de fondo
const KenBg: React.FC<{ src: string; dur?: number; dark?: number; blur?: number }> = ({ src, dur = 130, dark = 0, blur = 0 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.06, 1.14], cl);
  return (
    <AbsoluteFill>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined }} />
      {dark > 0 && <AbsoluteFill style={{ background: `rgba(8,12,7,${dark})` }} />}
    </AbsoluteFill>
  );
};
// grano + viñeta (capa de acabado)
const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 320px 60px rgba(0,0,0,0.55)", mixBlendMode: "multiply" as any }} />
);
const Eyebrow: React.FC<{ t: string; dark?: boolean }> = ({ t, dark }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 66, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 21, letterSpacing: 8, color: dark ? "#5b4f36" : SAGE, textTransform: "uppercase", opacity: ease(f, 0, 16) }}>{t}</div>;
};
// Motas de polvo / esporas que derivan hacia ARRIBA (capa de vida/profundidad)
const Motes: React.FC<{ n?: number; color?: string; area?: [number, number, number, number]; rise?: number; seed?: number; size?: number }> =
  ({ n = 16, color = "rgba(199,212,155,0.8)", area = [0, 0, 1920, 1080], rise = 200, seed = 0, size = 4 }) => {
    const f = useCurrentFrame();
    const [ax, ay, aw, ah] = area;
    return (
      <>
        {Array.from({ length: n }).map((_, i) => {
          const r = rnd(i + seed * 13.7), r2 = rnd(i + 4.2 + seed * 7.1), r3 = rnd(i + 9.9 + seed * 3.3);
          const life = 90 + r2 * 90, t0 = r * 70;
          const lf = (((f - t0) % life) + life) % life, prog = lf / life;
          const x = ax + r * aw + Math.sin((f + i * 30) / 40) * 16;
          const y = ay + ah - prog * rise - r3 * 30;
          const op = Math.sin(prog * Math.PI) * (f > t0 ? 1 : 0);
          const sz = size * (0.5 + r3);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: color, opacity: op * 0.8, filter: "blur(0.5px)", boxShadow: `0 0 ${sz * 2}px ${color}` }} />;
        })}
      </>
    );
  };
// Hojas / partículas que CAEN (lado vivo)
const Falling: React.FC<{ n?: number; color?: string; seed?: number; w?: number; h?: number }> =
  ({ n = 14, color = "rgba(150,180,90,0.7)", seed = 0, w = 1920, h = 1160 }) => {
    const f = useCurrentFrame();
    return (
      <>
        {Array.from({ length: n }).map((_, i) => {
          const r = rnd(i + seed), r2 = rnd(i + 2.1 + seed), r3 = rnd(i + 5.5 + seed);
          const life = 150 + r2 * 120, t0 = r * 90;
          const lf = (((f - t0) % life) + life) % life, prog = lf / life;
          const x = r * w + Math.sin((f + i * 20) / 50) * 44;
          const y = prog * h - 60;
          const rot = (f + i * 40) * (r3 > 0.5 ? 1.3 : -1.3);
          const op = Math.sin(prog * Math.PI), sz = 6 + r3 * 8;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz * 0.6, borderRadius: "60% 60% 60% 0", background: color, opacity: op * 0.65, transform: `rotate(${rot}deg)` }} />;
        })}
      </>
    );
  };

// ─── 1) RangeMapMorph — push-in sobre el MAPA; el rango colapsa y renace ─────
export const RangeMapMorph: React.FC<{ y0?: number; y1?: number; label?: string }> = ({ y0 = 1900, y1 = 2025, label = "Área de distribución del lobo" }) => {
  const f = useCurrentFrame();
  const p = ease(f, 10, 150);
  const shrink = interpolate(p, [0, 0.42, 0.52, 1], [1, 0.04, 0.04, 0.82], cl);
  const year = Math.round(interpolate(p, [0, 1], [y0, y1]));
  const alive = p > 0.5;
  const cx = 1030, cy = 545; // punto de colapso sobre el mapa (Yellowstone-ish)
  // cámara: mapa entero → empuja hacia el punto que muere → se abre en la recuperación
  const kf = [
    { f: 0, x: 960, y: 540, z: 1.06 },
    { f: 74, x: cx, y: cy, z: 1.95 },
    { f: 152, x: 985, y: 528, z: 1.12 },
    { f: 210, x: 985, y: 528, z: 1.12 },
  ];
  const cam = useCam(kf, f, 42);
  const camT = `translate(960px,540px) scale(${cam.z}) translate(${-cam.x}px,${-cam.y}px)`;
  const bgBlur = cam.moving * 10, fgBlur = cam.moving * 2.2;
  const pulse = interpolate(p, [0.47, 0.52, 0.64], [0, 1, 0], cl); // anillo al renacer
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0a0d07" }}>
      {/* fondo texturado que se emborrona al moverse (profundidad) */}
      <AbsoluteFill style={{ transform: `scale(${1.08 + cam.moving * 0.04})`, filter: `blur(${4 + bgBlur}px) brightness(0.68)` }}>
        <Img src={A("tex_paper_dark.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* MUNDO con el mapa + rango (cámara virtual) */}
      <AbsoluteFill style={{ filter: fgBlur > 0.15 ? `blur(${fgBlur}px)` : undefined }}>
        <div style={{ position: "absolute", width: 1920, height: 1080, transformOrigin: "0 0", transform: camT }}>
          <Img src={A("map_na.png")} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "cover", filter: "brightness(0.92) saturate(0.9)" }} />
          <AbsoluteFill style={{ background: "rgba(8,12,7,0.22)" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
            <g transform={`translate(${cx},${cy})`}>
              <ellipse rx={330 * shrink} ry={205 * shrink} fill={alive ? "rgba(150,196,96,0.4)" : "rgba(214,86,64,0.5)"} stroke={alive ? SAGE : RUST} strokeWidth={3} style={{ filter: "blur(3px)" }} />
              <ellipse rx={330 * shrink} ry={205 * shrink} fill="none" stroke={alive ? SAGE : RUST} strokeWidth={2} strokeDasharray="6 8" opacity={0.85} />
              {pulse > 0 && <circle r={interpolate(pulse, [0, 1], [10, 300])} fill="none" stroke={SAGE} strokeWidth={interpolate(pulse, [0, 1], [7, 1])} opacity={1 - pulse} />}
              {!alive && p > 0.4 && <circle r={7} fill={RUST} opacity={0.75 + 0.25 * Math.sin(f / 4)} style={{ filter: `drop-shadow(0 0 12px ${RUST})` }} />}
            </g>
          </svg>
          {/* esporas de vida que suben en la recuperación */}
          {alive && <Motes n={22} color="rgba(199,212,155,0.85)" area={[cx - 190, cy - 130, 380, 250]} rise={280} seed={3} />}
        </div>
      </AbsoluteFill>
      {/* viñeta que se cierra con el zoom */}
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${220 + cam.z * 120}px ${40 + cam.z * 30}px rgba(0,0,0,0.72)`, pointerEvents: "none" }} />
      <Eyebrow t="Mapa de distribución" />
      {/* tarjeta fija en pantalla */}
      <div style={{ position: "absolute", bottom: 70, left: 90, background: "rgba(12,16,9,0.74)", backdropFilter: "blur(6px)", borderLeft: `4px solid ${alive ? SAGE : RUST}`, padding: "18px 30px", borderRadius: 10, boxShadow: "0 14px 40px rgba(0,0,0,0.5)", opacity: ease(f, 6, 20) }}>
        <div style={{ fontWeight: 900, fontSize: 92, color: CREAM, lineHeight: 0.9, fontVariantNumeric: "tabular-nums" }}>{year}</div>
        <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 3, color: alive ? SAGE : RUST, marginTop: 6 }}>{alive ? "RECUPERACIÓN" : "COLAPSO"}</div>
        <div style={{ fontSize: 19, color: "rgba(239,233,220,0.65)", marginTop: 8 }}>{label}</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 2) TrophicWeb — CÁMARA VIRTUAL que recorre la red (REFERENCIA DORADA) ───
const CANVAS = { w: 2400, h: 1400 };
export const TrophicWeb: React.FC = () => {
  const f = useCurrentFrame();
  // nodos en coords de CANVAS grande
  const N = [
    { k: "LOBO", img: "cut_wolf_full.png", x: 1200, y: 360, ring: "#E0523E", crop: "translate(-3%,-2%) scale(1.6)" },
    { k: "CASTOR", img: "cut_beaver2.png", x: 1830, y: 720, crop: "translate(-8%,-4%) scale(1.15)" },
    { k: "RÍO", img: "bg_green.jpg", x: 1560, y: 1130, crop: "scale(1)" },
    { k: "ZORRO", img: "cut_fox.png", x: 720, y: 1120, crop: "translate(-4%,-6%) scale(1.2)" },
    { k: "CIERVO", img: "cut_elk2.png", x: 600, y: 690, crop: "translate(-6%,-8%) scale(1.1)" },
  ];
  const order = [0, 1, 2, 3, 4]; // orden de revelado (= recorrido de cámara)
  const ST = 42; // frames por tramo
  const appearF = (oi: number) => 6 + oi * ST;       // cuándo aparece el nodo oi
  const edgeF = (oi: number) => oi * ST + 12;         // cuándo se traza la arista oi→oi+1
  // keyframes de cámara: arranca en el 1º nodo (zoom), va a cada uno, y al final se aleja
  const kf = [
    { f: 0, x: N[order[0]].x, y: N[order[0]].y, z: 1.75 },
    ...order.slice(1).map((ni, idx) => ({ f: (idx + 1) * ST, x: N[ni].x, y: N[ni].y, z: 1.6 })),
    { f: order.length * ST + 30, x: CANVAS.w / 2, y: CANVAS.h / 2 - 40, z: 0.72 },
    { f: order.length * ST + 90, x: CANVAS.w / 2, y: CANVAS.h / 2 - 40, z: 0.72 },
  ];
  const cam = useCam(kf, f, 32);
  const camT = `translate(960px,540px) scale(${cam.z}) translate(${-cam.x}px,${-cam.y}px)`;
  const fgBlur = cam.moving * 3.4;      // el mundo se emborrona un toque al moverse
  const bgBlur = 5 + cam.moving * 14;   // el fondo se emborrona MÁS (profundidad)

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0a0f08" }}>
      {/* capa 1: fondo con blur que sube al moverse la cámara */}
      <AbsoluteFill style={{ transform: `scale(${1.1 + cam.moving * 0.05})`, filter: `blur(${bgBlur}px) brightness(0.8)` }}>
        <Img src={A("tex_paper_dark.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* capa 2: viñeta que se cierra con el zoom */}
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${240 + cam.z * 160}px ${40 + cam.z * 40}px rgba(0,0,0,0.7)`, pointerEvents: "none" }} />
      {/* capa 3: MUNDO (cámara) */}
      <AbsoluteFill style={{ filter: fgBlur > 0.15 ? `blur(${fgBlur}px)` : undefined }}>
        <div style={{ position: "absolute", width: CANVAS.w, height: CANVAS.h, transformOrigin: "0 0", transform: camT }}>
          {/* aristas */}
          <svg width={CANVAS.w} height={CANVAS.h} style={{ position: "absolute", overflow: "visible" }}>
            {order.slice(0, -1).map((ni, oi) => {
              const a = N[order[oi]], b = N[order[oi + 1]]; const t = ease(f, edgeF(oi), edgeF(oi) + 26);
              const len = Math.hypot(b.x - a.x, b.y - a.y);
              return (
                <g key={oi}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={SAGE} strokeOpacity={0.28} strokeWidth={2.5} strokeDasharray={`${t * len} ${len}`} />
                  {t > 0 && t < 1 && <circle cx={a.x + (b.x - a.x) * t} cy={a.y + (b.y - a.y) * t} r={6} fill={GOLD} style={{ filter: `drop-shadow(0 0 8px ${GOLD})` }} />}
                </g>
              );
            })}
          </svg>
          {/* nodos foto */}
          {order.map((ni, oi) => {
            const n = N[ni]; const af = appearF(oi);
            const o = ease(f, af, af + 20);
            const s = interpolate(o, [0, 1], [0.86, 1]); // reveal SUAVE (sin rebote)
            const ring = interpolate(f, [af, af + 26], [0, 1], cl);
            return (
              <div key={ni} style={{ position: "absolute", left: n.x - 105, top: n.y - 105, width: 210, height: 210, opacity: o, transform: `scale(${s})` }}>
                <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `2px solid ${(n as any).ring || SAGE}`, opacity: interpolate(ring, [0, 1], [0.9, 0]), transform: `scale(${interpolate(ring, [0, 1], [1, 1.35])})` }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: `3px solid ${(n as any).ring || SAGE}`, boxShadow: "0 18px 44px rgba(0,0,0,0.6)", background: "#0d130a" }}>
                  <Img src={A(n.img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: (n as any).crop }} />
                </div>
                <div style={{ position: "absolute", top: 224, left: -40, width: 290, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: CREAM, letterSpacing: 1, textShadow: "0 2px 12px #000" }}>{n.k}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Eyebrow t="Red trófica" />
    </AbsoluteFill>
  );
};

// ─── 3) PopulationOdometer — número que se desploma + lobos que se apagan ────
export const PopulationOdometer: React.FC<{ from?: number; to?: number; label?: string; icons?: number }> = ({ from = 1000000, to = 18, label = "Población de lobos", icons = 20 }) => {
  const f = useCurrentFrame();
  const p = ease(f, 15, 120);
  const shown = Math.round(interpolate(p, [0, 1], [from, to]));
  const bottom = p > 0.985;
  // sacudida sutil al tocar fondo (18)
  const shakeAmp = interpolate(f, [116, 124, 148], [0, 7, 0], cl);
  const sx = Math.sin(f * 2.3) * shakeAmp, sy = Math.cos(f * 3.1) * shakeAmp * 0.6;
  // push de cámara lento sobre toda la escena
  const push = interpolate(f, [0, 130], [1.0, 1.07], cl);
  const redPulse = bottom ? 0.2 + 0.16 * Math.sin(f / 5) : interpolate(p, [0.6, 1], [0, 0.14], cl);
  const numColor = p > 0.8 ? RUST : CREAM;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0a0d07" }}>
      <KenBg src={A("tex_paper_dark.png")} dark={0.12} />
      {/* viñeta roja que late */}
      <AbsoluteFill style={{ boxShadow: `inset 0 0 300px 70px rgba(190,40,25,${redPulse})`, pointerEvents: "none" }} />
      <Eyebrow t="Contador de población" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${push}) translate(${sx}px,${sy}px)` }}>
        <div style={{ fontWeight: 900, fontSize: 152, color: numColor, fontVariantNumeric: "tabular-nums", textShadow: bottom ? "0 0 44px rgba(224,82,62,0.5)" : "0 8px 40px rgba(0,0,0,0.6)", opacity: ease(f, 8, 22), letterSpacing: -2 }}>{shown.toLocaleString("es")}</div>
        <div style={{ display: "flex", gap: 5, marginTop: 30, maxWidth: 1240, flexWrap: "wrap", justifyContent: "center" }}>
          {Array.from({ length: icons }).map((_, i) => {
            // los lobos se apagan de AFUERA hacia ADENTRO: sobrevive un núcleo central (los 18)
            const dist = Math.abs(i - (icons - 1) / 2) / ((icons - 1) / 2); // 0 centro, 1 bordes
            const deathP = interpolate(dist, [0, 1], [1.25, 0.08]);
            const a = interpolate(p, [deathP - 0.06, deathP + 0.02], [1, 0], cl);
            const flick = a > 0 && a < 1 ? (Math.sin(f * 3 + i) > -0.3 ? 1 : 0.45) : 1;
            return (
              <div key={i} style={{ width: 52, height: 66, position: "relative", transform: `scale(${0.9 + a * 0.14})` }}>
                <Img src={A("cut_wolf_stand.png")} style={{ width: "100%", height: "100%", objectFit: "contain", opacity: (0.12 + 0.88 * a) * flick, filter: a > 0.5 ? "none" : "grayscale(1) brightness(0.45)", transform: `translateY(${(1 - a) * 5}px)` }} />
              </div>
            );
          })}
        </div>
        <div style={{ fontWeight: 700, fontSize: 23, letterSpacing: 3, color: "rgba(239,233,220,0.7)", marginTop: 30, textTransform: "uppercase", opacity: ease(f, 20, 34) }}>{label}</div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 4) TravelingTimeline — la CÁMARA se desliza por la línea (parallax) ─────
export const TravelingTimeline: React.FC = () => {
  const f = useCurrentFrame();
  const events = [
    { y: "1926", l: "El último lobo", img: "bg_barren.jpg" },
    { y: "1974", l: "Ley de especies", img: "map_na.png" },
    { y: "1995", l: "14 lobos vuelven", img: "bg_snow.jpg" },
    { y: "2020", l: "Los ríos cambian", img: "bg_green.jpg" },
  ];
  const N = events.length, gap = 760, x0 = 480, cy = 540;
  const cardX = (i: number) => x0 + i * gap;
  const worldW = cardX(N - 1) + x0;
  const dotY = cy + 150;
  const STEP = 46;
  const kf = [
    ...events.map((_, i) => ({ f: i * STEP, x: cardX(i), y: cy, z: 1.18 })),
    { f: N * STEP + 26, x: (cardX(0) + cardX(N - 1)) / 2, y: cy, z: 0.6 },
    { f: N * STEP + 96, x: (cardX(0) + cardX(N - 1)) / 2, y: cy, z: 0.6 },
  ];
  const cam = useCam(kf, f, 40);
  const camT = `translate(960px,540px) scale(${cam.z}) translate(${-cam.x}px,${-cam.y}px)`;
  const activeIdx = Math.round(interpolate(cam.x, [cardX(0), cardX(N - 1)], [0, N - 1], cl));
  const lineProg = interpolate(cam.x, [cardX(0), cardX(N - 1)], [0, 1], cl);
  const bgBlur = cam.moving * 8, fgBlur = cam.moving * 2.4;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0a0d07" }}>
      {/* fondo parallax (se mueve menos que el mundo) */}
      <AbsoluteFill style={{ transform: `translateX(${-cam.x * 0.25}px) scale(${1.12 + cam.moving * 0.03})`, filter: `blur(${5 + bgBlur}px) brightness(0.58)` }}>
        <Img src={A("tex_paper_dark.png")} style={{ width: "150%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* MUNDO */}
      <AbsoluteFill style={{ filter: fgBlur > 0.15 ? `blur(${fgBlur}px)` : undefined }}>
        <div style={{ position: "absolute", width: worldW, height: 1080, transformOrigin: "0 0", transform: camT }}>
          {/* línea base + progreso */}
          <div style={{ position: "absolute", top: dotY, left: cardX(0), width: cardX(N - 1) - cardX(0), height: 3, background: "rgba(255,255,255,0.16)" }} />
          <div style={{ position: "absolute", top: dotY, left: cardX(0), width: (cardX(N - 1) - cardX(0)) * lineProg, height: 3, background: SAGE, boxShadow: `0 0 12px ${SAGE}` }} />
          {events.map((e, i) => {
            const active = i === activeIdx;
            const o = ease(f, i * STEP - 54, i * STEP - 16); // aparece con anticipación (sin huecos vacíos)
            const kb = interpolate(f, [i * STEP - 12, i * STEP + 90], [1.02, 1.14], cl); // ken-burns del activo
            return (
              <div key={i} style={{ position: "absolute", left: cardX(i) - 170, top: 0, width: 340, opacity: o }}>
                <div style={{ position: "absolute", top: cy - 250, width: 340, textAlign: "center", fontWeight: 900, fontSize: 50, color: active ? GOLD : CREAM, textShadow: "0 2px 12px #000" }}>{e.y}</div>
                <div style={{ position: "absolute", top: cy - 178, left: 0, width: 340, height: 210, borderRadius: 14, overflow: "hidden", border: `3px solid ${active ? GOLD : "rgba(199,212,155,0.35)"}`, boxShadow: active ? `0 16px 40px rgba(0,0,0,0.6), 0 0 30px ${GOLD}44` : "0 10px 26px rgba(0,0,0,0.5)" }}>
                  <Img src={A(e.img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${active ? kb : 1.03})`, filter: active ? "none" : "brightness(0.78) saturate(0.85)" }} />
                </div>
                {/* tallo hasta la línea */}
                <div style={{ position: "absolute", top: cy + 34, left: 169, width: 2, height: dotY - (cy + 34), background: active ? SAGE : "rgba(199,212,155,0.4)" }} />
                {/* punto sobre la línea */}
                <div style={{ position: "absolute", top: dotY - (active ? 13 : 8), left: 170 - (active ? 13 : 8), width: active ? 26 : 16, height: active ? 26 : 16, borderRadius: "50%", background: active ? GOLD : SAGE, boxShadow: active ? `0 0 24px ${GOLD}` : "none", border: "3px solid rgba(10,13,7,0.85)" }} />
                <div style={{ position: "absolute", top: dotY + 26, width: 340, textAlign: "center", fontSize: 24, color: "rgba(239,233,220,0.82)" }}>{e.l}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${200 + cam.z * 120}px 50px rgba(0,0,0,0.6)`, pointerEvents: "none" }} />
      <Eyebrow t="Línea de tiempo" />
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 5) EcosystemSplitWipe — FOTOS reales muerto vs vivo, Ken-Burns + hojas ──
export const EcosystemSplitWipe: React.FC<{ leftLabel?: string; rightLabel?: string }> = ({ leftLabel = "SIN LOBOS", rightLabel = "CON LOBOS" }) => {
  const f = useCurrentFrame();
  const div = interpolate(ease(f, 8, 70), [0, 1], [18, 58]); // slide suave del divisor
  const dolly = interpolate(f, [0, 145], [1.0, 1.06], cl);   // dolly lento del conjunto
  const kbL = interpolate(f, [0, 145], [1.12, 1.2], cl), panL = interpolate(f, [0, 145], [-10, 10], cl);
  const kbR = interpolate(f, [0, 145], [1.2, 1.12], cl), panR = interpolate(f, [0, 145], [12, -8], cl);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {/* lado muerto (desaturado) */}
        <AbsoluteFill style={{ clipPath: `polygon(0 0, ${div}% 0, ${div - 5}% 100%, 0 100%)` }}>
          <Img src={A("bg_barren.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kbL}) translateX(${panL}px)`, filter: "saturate(0.4) brightness(0.66)" }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(60,45,25,0.12), rgba(25,18,8,0.45))" }} />
        </AbsoluteFill>
        {/* lado vivo (saturado) */}
        <AbsoluteFill style={{ clipPath: `polygon(${div}% 0, 100% 0, 100% 100%, ${div - 5}% 100%)` }}>
          <Img src={A("bg_green.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kbR}) translateX(${panR}px)`, filter: "saturate(1.12) brightness(1.02)" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* hojas cayendo — recortadas al lado vivo */}
      <AbsoluteFill style={{ clipPath: `polygon(${div}% 0, 100% 0, 100% 100%, ${div - 5}% 100%)`, pointerEvents: "none" }}>
        <Falling n={16} color="rgba(163,196,96,0.7)" seed={2} />
      </AbsoluteFill>
      {/* divisor con glow */}
      <div style={{ position: "absolute", left: `calc(${div}% - 2px)`, top: -20, bottom: -20, width: 4, background: SAGE, boxShadow: `0 0 34px ${SAGE}`, transform: "skewX(-3deg)" }} />
      <Eyebrow t="Antes / Después" />
      <div style={{ position: "absolute", left: 90, bottom: 110, fontWeight: 900, fontSize: 46, color: "#e7ddc9", letterSpacing: 3, textShadow: "0 3px 16px rgba(0,0,0,0.85)", opacity: ease(f, 32, 48) }}>{leftLabel}</div>
      <div style={{ position: "absolute", right: 90, bottom: 110, fontWeight: 900, fontSize: 46, color: "#eafbe0", letterSpacing: 3, textShadow: "0 3px 16px rgba(0,0,0,0.85)", opacity: ease(f, 32, 48) }}>{rightLabel}</div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 6) FieldGuideCallout — LOBO recortado (Ken-Burns) + callouts trazados ───
export const FieldGuideCallout: React.FC<{ name?: string; sci?: string }> = ({ name = "Lobo gris", sci = "Canis lupus" }) => {
  const f = useCurrentFrame();
  const parts = [
    { px: 1090, py: 430, tx: 1330, side: "r", label: "Mandíbula · 1.500 N de presión" },
    { px: 1010, py: 360, tx: 1330, side: "r", label: "Oído · detecta presas a 10 km" },
    { px: 900, py: 560, tx: 560, side: "l", label: "Patas · 60 km/h en persecución" },
    { px: 940, py: 470, tx: 560, side: "l", label: "Pelaje doble · resiste −40 °C" },
  ];
  const kb = interpolate(f, [0, 150], [1.02, 1.09], cl);
  const drift = interpolate(f, [0, 150], [0, -12], cl);
  const breathe = 1 + Math.sin(f / 55) * 0.006; // respiración muy sutil de la cámara
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Img src={A("tex_parchment.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 60px rgba(90,70,35,0.35)", pointerEvents: "none" }} />
      <Eyebrow t="Guía de campo" dark />
      <AbsoluteFill style={{ transform: `scale(${breathe})`, transformOrigin: "50% 45%" }}>
        {/* sombra de contacto justo bajo la base difuminada del lobo (disimula el borde) */}
        <div style={{ position: "absolute", left: 800, top: 648, width: 360, height: 58, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(60,45,20,0.5), rgba(60,45,20,0))", filter: "blur(8px)" }} />
        {/* lobo con Ken-Burns lento + máscara inferior degradada */}
        <div style={{ position: "absolute", left: 720, top: 245 + drift, width: 520, height: 520, transform: `scale(${kb})`, transformOrigin: "50% 40%", opacity: ease(f, 0, 20), filter: "drop-shadow(0 22px 26px rgba(60,45,20,0.42))", WebkitMaskImage: "linear-gradient(180deg, #000 76%, transparent 96%)", maskImage: "linear-gradient(180deg, #000 76%, transparent 96%)" }}>
          <Img src={A("cut_wolf_full.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {parts.map((p, i) => {
          const t = ease(f, 26 + i * 16, 50 + i * 16); const right = p.side === "r"; const ex = p.px + (p.tx - p.px) * t;
          return (
            <g key={i} opacity={t}>
              <circle cx={p.px} cy={p.py} r={5} fill={GOLD} stroke="#fff" strokeWidth={1.5} />
              <circle cx={p.px} cy={p.py} r={13} fill="none" stroke={GOLD} strokeWidth={1} opacity={interpolate(t, [0, 1], [0.85, 0])} />
              <line x1={p.px} y1={p.py} x2={ex} y2={p.py} stroke={INK} strokeWidth={1.6} />
              <line x1={ex} y1={p.py} x2={ex + (right ? 200 : -200)} y2={p.py} stroke={INK} strokeWidth={1.6} />
              {t > 0.04 && t < 0.98 && <circle cx={ex} cy={p.py} r={4} fill={GOLD} style={{ filter: `drop-shadow(0 0 7px ${GOLD})` }} />}
              <text x={ex + (right ? 8 : -8)} y={p.py - 10} textAnchor={right ? "start" : "end"} fontFamily={FONT} fontWeight={600} fontSize={22} fill={INK}>{p.label}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", bottom: 78, left: 0, right: 0, textAlign: "center", opacity: ease(f, 20, 36) }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 28, color: "#6a5c3f" }}>{sci}</div>
        <div style={{ fontWeight: 900, fontSize: 56, color: INK, letterSpacing: 1 }}>{name}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── 7) MigrationArc — la CÁMARA VIAJA siguiendo el arco sobre el mapa ───────
export const MigrationArc: React.FC<{ from?: string; to?: string; km?: number }> = ({ from = "Alberta, Canadá", to = "Yellowstone", km = 1100 }) => {
  const f = useCurrentFrame();
  const Ap = { x: 640, y: 300 }, B = { x: 1160, y: 720 }, C = { x: 740, y: 250 };
  const bz = (u: number) => ({ x: (1 - u) ** 2 * Ap.x + 2 * (1 - u) * u * C.x + u * u * B.x, y: (1 - u) ** 2 * Ap.y + 2 * (1 - u) * u * C.y + u * u * B.y });
  const tp = ease(f, 20, 118); // avance por la ruta
  const m = bz(tp);
  const open = ease(f, 120, 152); // al llegar, la cámara se abre
  const camX = m.x + (960 - m.x) * open;
  const camY = m.y + (500 - m.y) * open;
  const z = interpolate(f, [0, 20, 118, 152], [1.15, 1.72, 1.72, 1.02], cl);
  const moving = interpolate(f, [18, 30, 108, 120], [0, 1, 1, 0], cl) * (1 - open);
  const camT = `translate(960px,540px) scale(${z}) translate(${-camX}px,${-camY}px)`;
  const bgBlur = moving * 9, fgBlur = moving * 2.4;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0a0d07" }}>
      {/* fondo texturado que se emborrona mientras viaja la cámara */}
      <AbsoluteFill style={{ transform: `scale(${1.08 + moving * 0.05})`, filter: `blur(${4 + bgBlur}px) brightness(0.62)` }}>
        <Img src={A("tex_paper_dark.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* MUNDO: mapa + ruta (cámara viaja) */}
      <AbsoluteFill style={{ filter: fgBlur > 0.15 ? `blur(${fgBlur}px)` : undefined }}>
        <div style={{ position: "absolute", width: 1920, height: 1080, transformOrigin: "0 0", transform: camT }}>
          <Img src={A("map_na.png")} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "cover", filter: "brightness(0.9) saturate(0.92)" }} />
          <AbsoluteFill style={{ background: "rgba(8,12,7,0.28)" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
            <path d={`M${Ap.x},${Ap.y} Q${C.x},${C.y} ${B.x},${B.y}`} fill="none" stroke={GOLD} strokeWidth={4} strokeLinecap="round" style={{ strokeDasharray: `${tp * 1400} 1400`, filter: `drop-shadow(0 0 8px ${GOLD}88)` }} />
            <circle cx={Ap.x} cy={Ap.y} r={11} fill={SAGE} stroke="#fff" strokeWidth={2} />
            <circle cx={B.x} cy={B.y} r={13} fill={GOLD} stroke="#fff" strokeWidth={2} opacity={tp > 0.95 ? 1 : 0.4} />
            {/* comета: estela del marcador */}
            {tp < 1 && [0.03, 0.06, 0.1].map((d, k) => { const q = bz(Math.max(0, tp - d)); return <circle key={k} cx={q.x} cy={q.y} r={7 - k * 2} fill="#fff" opacity={0.4 - k * 0.12} />; })}
            {tp < 1 && <circle cx={m.x} cy={m.y} r={9} fill="#fff" style={{ filter: "drop-shadow(0 0 10px #fff)" }} />}
          </svg>
          {/* etiquetas en coords del mundo */}
          <div style={{ position: "absolute", left: Ap.x - 40, top: Ap.y - 58, fontWeight: 700, fontSize: 22, color: CREAM, textShadow: "0 2px 8px #000" }}>{from}</div>
          <div style={{ position: "absolute", left: B.x - 20, top: B.y + 22, fontWeight: 700, fontSize: 22, color: GOLD, textShadow: "0 2px 8px #000" }}>{to}</div>
          {/* lobo aparece en destino al abrir la cámara */}
          <div style={{ position: "absolute", left: B.x - 70, top: B.y - 190, width: 150, height: 150, opacity: open, transform: `translateY(${interpolate(open, [0, 1], [14, 0])}px)`, filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.6))" }}>
            <Img src={A("cut_wolf_full.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${220 + z * 110}px 46px rgba(0,0,0,0.7)`, pointerEvents: "none" }} />
      <Eyebrow t="Ruta de reintroducción" />
      {/* contador de km fijo en pantalla */}
      <div style={{ position: "absolute", bottom: 70, left: 90, background: "rgba(12,16,9,0.74)", backdropFilter: "blur(6px)", padding: "14px 26px", borderRadius: 10, boxShadow: "0 12px 34px rgba(0,0,0,0.5)", opacity: ease(f, 16, 30) }}>
        <span style={{ fontWeight: 900, fontSize: 56, color: CREAM, fontVariantNumeric: "tabular-nums" }}>{Math.round(tp * km).toLocaleString("es")}</span> <span style={{ fontSize: 26, color: SAGE }}>km recorridos</span>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 8) CascadeDominoes — la CÁMARA sigue la cadena tarjeta por tarjeta ──────
export const CascadeDominoes: React.FC = () => {
  const f = useCurrentFrame();
  const steps = [
    { t: "LOBOS", img: "cut_wolf_stand.png" },
    { t: "MENOS CIERVOS", img: "cut_elk2.png" },
    { t: "VUELVEN LOS SAUCES", img: "bg_green.jpg" },
    { t: "CASTORES", img: "cut_beaver2.png" },
    { t: "RÍOS SANOS", img: "map_yellowstone.png" },
  ];
  const N = steps.length, cardW = 300, gap = 128, x0 = 440, cy = 540;
  const cardX = (i: number) => x0 + i * (cardW + gap);
  const worldW = cardX(N - 1) + cardW + x0;
  const STEP = 40;
  const kf = [
    ...steps.map((_, i) => ({ f: i * STEP, x: cardX(i), y: cy, z: 1.34 })),
    { f: N * STEP + 26, x: (cardX(0) + cardX(N - 1)) / 2, y: cy, z: 0.62 },
    { f: N * STEP + 96, x: (cardX(0) + cardX(N - 1)) / 2, y: cy, z: 0.62 },
  ];
  const cam = useCam(kf, f, 34);
  const camT = `translate(960px,540px) scale(${cam.z}) translate(${-cam.x}px,${-cam.y}px)`;
  const activeIdx = Math.round(interpolate(cam.x, [cardX(0), cardX(N - 1)], [0, N - 1], cl));
  const bgBlur = cam.moving * 8, fgBlur = cam.moving * 2.6;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0a0d07" }}>
      {/* fondo parallax */}
      <AbsoluteFill style={{ transform: `translateX(${-cam.x * 0.28}px) scale(${1.12 + cam.moving * 0.03})`, filter: `blur(${5 + bgBlur}px) brightness(0.58)` }}>
        <Img src={A("tex_paper_dark.png")} style={{ width: "160%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* MUNDO */}
      <AbsoluteFill style={{ filter: fgBlur > 0.15 ? `blur(${fgBlur}px)` : undefined }}>
        <div style={{ position: "absolute", width: worldW, height: 1080, transformOrigin: "0 0", transform: camT }}>
          {steps.map((s, i) => {
            const lit = f >= i * STEP - 6;                 // se enciende al entrar la cámara
            const active = i === activeIdx;
            const o = ease(f, i * STEP - 24, i * STEP + 2);
            const zoom = interpolate(f, [i * STEP - 8, i * STEP + 70], [1.0, 1.12], cl); // micro-zoom de la miniatura
            const isCut = s.img.startsWith("cut");
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: cardX(i), top: cy - 155, width: cardW, borderRadius: 18, overflow: "hidden", background: "rgba(20,28,16,0.92)", border: `2px solid ${lit ? SAGE : "rgba(199,212,155,0.22)"}`, boxShadow: lit ? `0 16px 38px rgba(0,0,0,0.6), 0 0 26px ${SAGE}${active ? "55" : "2e"}` : "0 8px 20px rgba(0,0,0,0.5)", opacity: o, transform: `translateY(${interpolate(o, [0, 1], [18, 0])}px)` }}>
                  <div style={{ height: 200, overflow: "hidden", background: "#0d130a" }}>
                    <Img src={A(s.img)} style={{ width: "100%", height: "100%", objectFit: isCut ? "contain" : "cover", transform: `scale(${active ? zoom : 1.02})`, filter: lit ? "none" : "grayscale(0.6) brightness(0.6)" }} />
                  </div>
                  <div style={{ padding: "16px 10px", textAlign: "center", fontWeight: 800, fontSize: 22, color: lit ? CREAM : "rgba(239,233,220,0.45)", lineHeight: 1.1 }}>{s.t}</div>
                </div>
                {i < N - 1 && <div style={{ position: "absolute", left: cardX(i) + cardW + 30, top: cy - 40, fontSize: 60, color: GOLD, opacity: ease(f, i * STEP + 8, i * STEP + 26), textShadow: `0 0 16px ${GOLD}66` }}>›</div>}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${200 + cam.z * 120}px 50px rgba(0,0,0,0.6)`, pointerEvents: "none" }} />
      <Eyebrow t="Reacción en cadena" />
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 9) SeasonsVignette — polaroid con cross-dissolve, sway y Ken-Burns ──────
export const SeasonsVignette: React.FC<{ place?: string }> = ({ place = "Valle de Lamar" }) => {
  const f = useCurrentFrame();
  const shots = [{ img: "bg_barren.jpg", d: "1995 · sin lobos" }, { img: "bg_snow.jpg", d: "invierno" }, { img: "bg_green.jpg", d: "2020 · restaurado" }];
  const per = 48;
  const idx = Math.min(shots.length - 1, Math.floor(f / per));
  const nx = Math.min(shots.length - 1, idx + 1);
  const mix = interpolate(f % per, [per - 18, per], [0, 1], cl); // dissolve largo y suave
  const sway = Math.sin(f / 42) * 1.1;         // balanceo leve
  const floatY = Math.sin(f / 55) * 7;         // flota
  const kb = (base: number) => interpolate(f % per, [0, per], [base, base + 0.06], cl); // ken-burns por toma
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Img src={A("tex_parchment.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 50px rgba(90,70,35,0.3)", pointerEvents: "none" }} />
      <Eyebrow t="Cuaderno de campo" dark />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", transform: `translateY(${floatY}px)` }}>
          {/* marcos vacíos detrás (profundidad) */}
          <div style={{ position: "absolute", inset: 0, transform: "rotate(-5deg) translate(-26px,14px)", background: "#efe8d6", borderRadius: 12, boxShadow: "0 18px 40px rgba(60,45,20,0.25)" }} />
          <div style={{ position: "absolute", inset: 0, transform: "rotate(3.5deg) translate(22px,10px)", background: "#f4eede", borderRadius: 12, boxShadow: "0 18px 40px rgba(60,45,20,0.22)" }} />
          {/* polaroid activo */}
          <div style={{ position: "relative", width: 900, height: 560, background: "#fff", padding: "14px 14px 64px", borderRadius: 12, boxShadow: "0 30px 74px rgba(60,45,20,0.4)", transform: `rotate(${-1.2 + sway}deg)` }}>
            <div style={{ position: "relative", width: "100%", height: 470, overflow: "hidden", borderRadius: 4 }}>
              <Img src={A(shots[idx].img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb(1.05)})` }} />
              <AbsoluteFill style={{ opacity: mix }}><Img src={A(shots[nx].img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb(1.02)})` }} /></AbsoluteFill>
              <AbsoluteFill style={{ boxShadow: "inset 0 0 110px 18px rgba(0,0,0,0.38)" }} />
            </div>
            {/* fecha manuscrita que cambia con transición */}
            <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 30 }}>
              <span style={{ position: "absolute", left: 0, right: 0, color: "#4a3f28", opacity: 1 - mix }}>{shots[idx].d}</span>
              <span style={{ position: "absolute", left: 0, right: 0, color: "#4a3f28", opacity: mix }}>{shots[nx].d}</span>
            </div>
          </div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 26, color: "#6a5c3f", marginTop: 42, opacity: ease(f, 16, 30) }}>{place} — el mismo encuadre, {shots.length} momentos</div>
      </AbsoluteFill>
      <Motes n={10} color="rgba(120,95,45,0.35)" area={[300, 200, 1320, 700]} rise={160} seed={6} size={3} />
    </AbsoluteFill>
  );
};

// ─── 10) AuthorityQuote — cita palabra por palabra + autor que entra suave ───
export const AuthorityQuote: React.FC<{ quote?: string; who?: string; role?: string }> = ({
  quote = "Los lobos no solo cambiaron la fauna. Cambiaron la geografía física del parque.", who = "Dr. William Ripple", role = "Universidad Estatal de Oregón",
}) => {
  const f = useCurrentFrame(); const words = quote.split(" ");
  const line = interpolate(ease(f, 30, 58), [0, 1], [0, 360]);
  const qDrift = interpolate(ease(f, 8, 40), [0, 1], [16, 0]);
  const aSlide = interpolate(ease(f, 46, 66), [0, 1], [-34, 0]);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <KenBg src={A("bg_wolf.jpg")} dark={0.6} blur={9} dur={150} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,12,7,0.86) 0%, rgba(8,12,7,0.5) 60%, rgba(8,12,7,0.18) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 150px" }}>
        <div style={{ fontFamily: SERIF, fontSize: 190, lineHeight: 0.5, color: SAGE, opacity: 0.55 * ease(f, 0, 14) }}>“</div>
        <div style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1.32, color: CREAM, maxWidth: 1180, marginTop: 6, textShadow: "0 3px 20px rgba(0,0,0,0.7)", transform: `translateY(${qDrift}px)` }}>
          {words.map((w, i) => { const t = ease(f, 12 + i * 3, 24 + i * 3); return <span key={i} style={{ opacity: t, display: "inline-block", transform: `translateY(${interpolate(t, [0, 1], [8, 0])}px)` }}>{w}&nbsp;</span>; })}
        </div>
        <div style={{ height: 3, width: line, background: GOLD, margin: "40px 0 26px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: ease(f, 46, 64), transform: `translateX(${aSlide}px)` }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", overflow: "hidden", border: `2px solid ${GOLD}`, boxShadow: "0 8px 20px rgba(0,0,0,0.6)", background: "#0d130a" }}><Img src={A("cut_wolf_face.png")} style={{ width: "128%", height: "128%", objectFit: "cover", transform: "translate(-11%,-8%)" }} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 30, color: CREAM }}>{who}</div>
            <div style={{ fontSize: 21, color: SAGE, letterSpacing: 1 }}>{role}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Showcase ───────────────────────────────────────────────────────────────
const ITEMS: { name: string; c: React.FC<any> }[] = [
  { name: "1 · RangeMapMorph", c: RangeMapMorph }, { name: "2 · TrophicWeb", c: TrophicWeb },
  { name: "3 · PopulationOdometer", c: PopulationOdometer }, { name: "4 · TravelingTimeline", c: TravelingTimeline },
  { name: "5 · EcosystemSplitWipe", c: EcosystemSplitWipe }, { name: "6 · FieldGuideCallout", c: FieldGuideCallout },
  { name: "7 · MigrationArc", c: MigrationArc }, { name: "8 · CascadeDominoes", c: CascadeDominoes },
  { name: "9 · SeasonsVignette", c: SeasonsVignette }, { name: "10 · AuthorityQuote", c: AuthorityQuote },
];
const SEG = 140;
export const TOTAL_FRAMES_FAUNAKIT = ITEMS.length * SEG;
export const MainFaunaKit: React.FC = () => {
  const f = useCurrentFrame(); const i = Math.min(ITEMS.length - 1, Math.floor(f / SEG)); const Comp = ITEMS[i].c;
  return (
    <AbsoluteFill style={{ background: "#0a0d07" }}>
      <AbsoluteFill key={i}><Comp /></AbsoluteFill>
      <div style={{ position: "absolute", bottom: 40, left: 60, fontFamily: FONT, fontWeight: 800, fontSize: 25, letterSpacing: 2, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "10px 22px", borderRadius: 30 }}>{ITEMS[i].name}</div>
    </AbsoluteFill>
  );
};
