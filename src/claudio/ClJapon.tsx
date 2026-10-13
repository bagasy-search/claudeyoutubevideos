// Kit CLAUDIO EN JAPÓN (serie "Lo que aprendí en Tokio"): listas de reglas clon de The Japanese Method.
//   ClGridHook  la MINIATURA cobra vida en el seg 0: foto de Claudio de fondo + 6 fotos numeradas que entran una por una + titular
//   ClRule      la cuenta de reglas: número GRANDE rojo en tarjeta washi + título + 11 puntos (los hechos en rojo) + "faltan N"
//   ClSato      Sato-san, la jefa del hotel: polaroid + su frase escrita a mano (personaje recurrente y breve)
//   ClNumbers   "la regla en números" (fixes.json → amounts): filas etiqueta / valor que entran de a una
//   ClDryBars   barras de horas que crecen (toalla doblada 12 h vs extendida 2 h, zapato 24 h)
//   ClBodyMap   los 4 lugares que tu nariz no alcanza (orejas, nuca, espalda alta, pecho) sobre un busto dibujado
//   ClDays      la ventana de 2 días (ajo: domingo → martes) sobre 3 hojas de calendario
// ⛔ sin kanji: la fuente del farm no los tiene (saldrían cuadraditos).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, hexA, clamp01, ease } from "./ClTheme";
import { Bed, Card, RoomLight, Tape, lin, pop, useOut } from "./ClParts";

// ───────────────── ClGridHook
export const ClGridHook: React.FC<{ bed: string; tiles: string[]; words: [string, string]; every?: number }> = ({ bed, tiles, words, every = 9 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(5);
  const W = 360, H = 316, G = 22, X0 = 24, Y0 = 150;
  const ph = pop(f, fps, 2, 13);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={3} dim={0} warm={0} />
      {tiles.map((t, i) => {
        const c = i % 3, r = Math.floor(i / 3), at = 4 + i * every, p = pop(f, fps, at, 12);
        const z = 1.04 + 0.06 * clamp01((f - at) / 120);
        return (
          <div key={i} style={{ position: "absolute", left: X0 + c * (W + G), top: Y0 + r * (H + G), width: W, height: H, borderRadius: 26, border: "6px solid #fff", overflow: "hidden", boxShadow: "0 18px 34px rgba(0,0,0,0.32)", scale: String(interpolate(p, [0, 1], [0.4, 1])), opacity: clamp01(p * 1.5), rotate: `${(1 - p) * (i % 2 ? 8 : -8)}deg` }}>
            <Img src={staticFile(t)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(z) }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", fontFamily: LABEL, fontWeight: 700, fontSize: 150, color: "#fff", WebkitTextStroke: "10px #111", paintOrder: "stroke", lineHeight: 1 }}>{i + 1}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 22, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 112, lineHeight: 1, scale: String(interpolate(ph, [0, 1], [1.4, 1])), opacity: clamp01(ph * 1.6), letterSpacing: -2 }}>
        <span style={{ color: "#fff", WebkitTextStroke: "12px #111", paintOrder: "stroke" }}>{words[0]} </span>
        <span style={{ color: CL.yellow, WebkitTextStroke: "12px #111", paintOrder: "stroke" }}>{words[1]}</span>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────── ClRule
export const ClRule: React.FC<{ n: number; total?: number; title: string; sub?: string; bed?: string; star?: boolean; label?: string; starText?: string }> = ({ n, total = 11, title, sub, bed, star, label = "REGLA", starText = "LA QUE CASI TODOS ROMPEMOS" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const pc = pop(f, fps, 2, 12), pn = pop(f, fps, 8, 9), w = lin(f, 14, 30), wsub = lin(f, 24, 40);
  const left = total - n;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={n * 13} dim={0.18} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(23,18,15,0.55) 0%, rgba(23,18,15,0.15) 60%, rgba(23,18,15,0) 100%)" }} />
      {/* tarjeta washi con el número */}
      <div style={{ position: "absolute", left: 150, top: 170, width: 520, height: 660, rotate: `${interpolate(pc, [0, 1], [-10, -2.5])}deg`, translate: `0 ${(1 - pc) * -700}px` }}>
        <div style={{ position: "absolute", inset: 0, background: CL.tile, borderRadius: 10, boxShadow: `0 40px 80px rgba(0,0,0,0.45)`, borderTop: `22px solid ${CL.nitrile}` }} />
        <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 10, color: CL.navy }}>{label}</div>
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 470, lineHeight: 1.05, color: CL.nitrile, scale: String(interpolate(pn, [0, 1], [2.2, 1])), opacity: clamp01(pn * 1.4) }}>{n}</div>
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontFamily: LABEL, fontWeight: 500, fontSize: 34, letterSpacing: 4, color: CL.inkSoft }}>DE {total}</div>
        <Tape x={190} y={-30} rot={3} w={150} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 300, width: 1050 }}>
        {star ? <div style={{ display: "inline-block", background: CL.yellow, color: CL.navyDeep, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 3, padding: "6px 22px", borderRadius: 8, marginBottom: 18, scale: String(pop(f, fps, 30, 9)) }}>{starText}</div> : null}
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 112, color: "#fff", lineHeight: 1.02, textShadow: "0 6px 24px rgba(0,0,0,0.55)", clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>{title}</div>
        {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CL.yellow, marginTop: 10, textShadow: "0 4px 14px rgba(0,0,0,0.6)", clipPath: `inset(0 ${100 - wsub * 100}% 0 0)`, whiteSpace: "nowrap" }}>{sub}</div> : null}
      </div>
      {/* la cuenta: 11 puntos */}
      <div style={{ position: "absolute", left: 760, top: 800, display: "flex", gap: 22, alignItems: "center" }}>
        {Array.from({ length: total }, (_, i) => {
          const done = i + 1 < n, now = i + 1 === n, k = now ? pop(f, fps, 20 + i, 8) : 1;
          return <div key={i} style={{ width: now ? 58 : 40, height: now ? 58 : 40, borderRadius: "50%", background: done || now ? CL.nitrile : "rgba(255,255,255,0.35)", border: "5px solid #fff", scale: String(k), boxShadow: now ? `0 0 0 ${6 + 4 * Math.sin(f * 0.2)}px ${hexA(CL.nitrile, 0.35)}` : "none" }} />;
        })}
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#fff", marginLeft: 22, textShadow: "0 3px 10px rgba(0,0,0,0.6)", opacity: lin(f, 30, 42) }}>{left === 0 ? "la última" : left === 1 ? "falta 1" : `faltan ${left}`}</div>
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClSato
export const ClSato: React.FC<{ img: string; quote: string; bed?: string; role?: string }> = ({ img, quote, bed, role = "mi jefa en el hotel de Tokio" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 13), q = pop(f, fps, 12, 14), w = lin(f, 20, 20 + Math.max(18, quote.length * 1.1));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={77} dim={0.28} />
      <div style={{ position: "absolute", left: 180, top: 120, rotate: `${interpolate(p, [0, 1], [-16, -4])}deg`, scale: String(interpolate(p, [0, 1], [0.6, 1])), opacity: clamp01(p * 1.5) }}>
        <div style={{ background: "#fff", padding: "22px 22px 100px", boxShadow: `0 36px 70px ${CL.shadow}` }}>
          <Img src={staticFile(img)} style={{ width: 560, height: 620, objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.navy }}>Sato-san</div>
        </div>
        <Tape x={220} y={-18} rot={-4} w={160} />
      </div>
      <div style={{ position: "absolute", left: 900, top: 300, width: 860, translate: `${(1 - q) * 120}px 0`, opacity: clamp01(q * 1.4) }}>
        <Card style={{ padding: "50px 60px", borderLeft: `18px solid ${CL.nitrile}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: CL.inkSoft, marginBottom: 14 }}>{role.toUpperCase()}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, lineHeight: 1.08, color: CL.navy, clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>“{quote}”</div>
        </Card>
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClNumbers
export const ClNumbers: React.FC<{ title?: string; rows: [string, string][]; bed?: string; page?: number }> = ({ title = "La regla en números", rows, bed, page }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14), step = Math.max(12, Math.min(34, (T - 40) / rows.length));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={91} dim={0.24} />
      <div style={{ position: "absolute", left: "50%", top: 110, translate: `-50% ${(1 - p) * 90}px`, width: 1320, rotate: "-1deg" }}>
        <Card style={{ padding: "44px 64px 36px", borderTop: `20px solid ${CL.nitrile}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CL.ink }}>{title}</div>
            {page ? <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, color: CL.inkSoft, letterSpacing: 3 }}>MÉTODO · PÁG. {page}</div> : null}
          </div>
          {rows.map(([a, b], i) => {
            const k = lin(f, 18 + i * step, 28 + i * step);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, padding: "18px 0", borderTop: `3px solid ${CL.grout}`, opacity: 0.15 + 0.85 * k, translate: `${(1 - k) * 40}px 0` }}>
                <div style={{ width: 70, height: 70, flex: "0 0 70px", borderRadius: "50%", background: CL.nitrile, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ flex: "0 0 430px", fontFamily: LABEL, fontWeight: 600, fontSize: 46, color: CL.ink }}>{a}</div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CL.navy, lineHeight: 1.05 }}>{b}</div>
              </div>
            );
          })}
        </Card>
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClDryBars
export const ClDryBars: React.FC<{ title: string; rows: { label: string; h: number; good?: boolean; note?: string }[]; unit?: string; bed?: string; max?: number }> = ({ title, rows, unit = "h", bed, max }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14), M = max || Math.max(...rows.map((r) => r.h));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={53} dim={0.24} />
      <div style={{ position: "absolute", left: "50%", top: 170, translate: `-50% ${(1 - p) * 90}px`, width: 1400 }}>
        <Card style={{ padding: "46px 64px 50px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CL.ink, marginBottom: 34 }}>{title}</div>
          {rows.map((r, i) => {
            const t0 = 16 + i * Math.max(18, (T - 50) / rows.length / 1.4), k = ease(lin(f, t0, t0 + 40)), v = r.h * k;
            return (
              <div key={i} style={{ marginBottom: 34 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: LABEL, fontWeight: 600, fontSize: 46, color: CL.ink, marginBottom: 10 }}>
                  <span>{r.label}</span><span style={{ color: r.good ? CL.navy : CL.nitrile }}>{v < r.h ? Math.round(v) : r.h} {unit}</span>
                </div>
                <div style={{ height: 64, background: CL.tile, borderRadius: 32, overflow: "hidden" }}>
                  <div style={{ width: `${(100 * v) / M}%`, height: "100%", borderRadius: 32, background: r.good ? `linear-gradient(90deg, ${CL.brass}, ${CL.brassLight})` : `linear-gradient(90deg, #8E0B20, ${CL.nitrile})` }} />
                </div>
                {r.note ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CL.inkSoft, marginTop: 6, opacity: lin(f, t0 + 30, t0 + 40) }}>{r.note}</div> : null}
              </div>
            );
          })}
        </Card>
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClBodyMap
const SPOTS: { x: number; y: number; label: string; lx: number; ly: number }[] = [
  { x: 1005, y: 330, label: "detrás de las orejas", lx: 1220, ly: 240 },
  { x: 950, y: 455, label: "la nuca", lx: 1220, ly: 420 },
  { x: 900, y: 640, label: "arriba de la espalda", lx: 1220, ly: 610 },
  { x: 720, y: 690, label: "el pecho", lx: 260, ly: 650 },
];
export const ClBodyMap: React.FC<{ bed?: string; title?: string }> = ({ bed, title = "Donde tu nariz no llega" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14), step = Math.max(14, (T - 60) / 5);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={19} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: p }}>
        {/* busto de perfil (mirando a la izquierda): cabeza, cuello, hombros */}
        <path d="M640 1080 C640 860 700 760 860 720 L880 560 C820 540 760 470 760 380 C760 250 850 180 950 180 C1060 180 1120 260 1120 360 C1120 430 1090 480 1050 510 L1040 600 C1180 640 1300 720 1320 1080 Z" fill={hexA(CL.navy, 0.88)} stroke="#fff" strokeWidth={6} />
        <path d="M760 360 L720 400 L762 412" fill="none" stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
        {/* la nariz y su alcance (línea punteada que no llega) */}
        <circle cx={735} cy={385} r={14} fill={CL.yellow} />
        <path d={`M735 385 Q 820 ${300 - 20 * Math.sin(f * 0.1)} 900 330`} fill="none" stroke={CL.yellow} strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-f * 1.2} opacity={lin(f, 10, 20)} />
        {SPOTS.map((s, i) => {
          const k = pop(f, fps, 20 + i * step, 9), pulse = 1 + 0.25 * Math.sin(f * 0.22 + i);
          return (
            <g key={i} opacity={clamp01(k * 1.4)}>
              <circle cx={s.x} cy={s.y} r={46 * pulse * k} fill={hexA(CL.nitrile, 0.28)} />
              <circle cx={s.x} cy={s.y} r={22 * k} fill={CL.nitrile} stroke="#fff" strokeWidth={5} />
              <line x1={s.x} y1={s.y} x2={s.lx + (s.lx > s.x ? 0 : 420)} y2={s.ly + 30} stroke="#fff" strokeWidth={4} strokeDasharray="8 8" />
            </g>
          );
        })}
      </svg>
      {SPOTS.map((s, i) => {
        const k = pop(f, fps, 24 + i * step, 12);
        return <div key={i} style={{ position: "absolute", left: s.lx, top: s.ly, width: 420, background: "#fff", borderRadius: 12, padding: "10px 22px", fontFamily: LABEL, fontWeight: 600, fontSize: 42, color: CL.ink, boxShadow: `0 12px 26px ${CL.shadow}`, opacity: clamp01(k * 1.4), scale: String(0.7 + 0.3 * k), borderLeft: `12px solid ${CL.nitrile}` }}>{s.label}</div>;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,0.6)", opacity: lin(f, 4, 16) }}>{title}</div>
    </AbsoluteFill>
  );
};

// ───────────────── ClDays
export const ClDays: React.FC<{ days?: string[]; label: string; bed?: string }> = ({ days = ["DOMINGO", "LUNES", "MARTES"], label, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = ease(lin(f, 24, Math.max(40, T * 0.65)));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={29} dim={0.3} />
      {days.map((d, i) => {
        const p = pop(f, fps, 2 + i * 6, 13);
        return (
          <div key={i} style={{ position: "absolute", left: 250 + i * 500, top: 200, width: 420, height: 470, rotate: `${(i - 1) * 2}deg`, translate: `0 ${(1 - p) * 300}px`, opacity: clamp01(p * 1.5) }}>
            <Card style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 12 }}>
              <div style={{ background: CL.nitrile, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 4, textAlign: "center", padding: "22px 0" }}>{d}</div>
              <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 230, color: CL.ink, lineHeight: 1.3 }}>{12 + i}</div>
            </Card>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 300, top: 740, width: 1320, height: 90, background: CL.tile, borderRadius: 45, overflow: "hidden", boxShadow: `0 16px 32px ${CL.shadow}` }}>
        <div style={{ width: `${k * 100}%`, height: "100%", background: `repeating-linear-gradient(135deg, ${CL.nitrile} 0 34px, #A50D25 34px 68px)` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 80, color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,0.6)", opacity: lin(f, 30, 44) }}>{label}</div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClAges: las 3 edades del olor (20 · 30 · 40+), la última resaltada en rojo con pulso
export const ClAges: React.FC<{ items?: [string, string][]; bed?: string; title?: string }> = ({ items = [["20", "axilas y pies"], ["30", "la cabeza"], ["40+", "nuca, orejas, pecho y espalda"]], bed, title = "De dónde sale el olor" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const step = Math.max(14, Math.min(45, (T - 40) / items.length));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={37} dim={0.3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,0.6)", opacity: lin(f, 2, 14) }}>{title}</div>
      {items.map(([age, where], i) => {
        const p = pop(f, fps, 10 + i * step, 12), last = i === items.length - 1, pulse = last ? 1 + 0.03 * Math.sin(f * 0.2) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 160 + i * 560, top: 280, width: 480, rotate: `${(i - 1) * 2}deg`, translate: `0 ${(1 - p) * 260}px`, opacity: clamp01(p * 1.5), scale: String(pulse) }}>
            <Card style={{ padding: "40px 30px 46px", textAlign: "center", borderTop: `20px solid ${last ? CL.nitrile : CL.brass}` }}>
              <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: CL.inkSoft }}>A LOS</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 210, lineHeight: 1.05, color: last ? CL.nitrile : CL.ink }}>{age}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.navy, lineHeight: 1.05, minHeight: 130 }}>{where}</div>
            </Card>
          </div>
        );
      })}
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClHeroHook: la miniatura HÉROE cobra vida (foto de la miniatura con push lento + titular que entra de golpe +
// sellos rojos sobre lo que no se compra). marks = [{x,y,text}] en px del cuadro 1920x1080.
export const ClHeroHook: React.FC<{ bed: string; lines: [string, string]; marks?: { x: number; y: number; text: string }[] }> = ({ bed, lines, marks = [] }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(5);
  const z = 1 + 0.06 * clamp01(f / Math.max(1, T)), p1 = pop(f, fps, 2, 10), p2 = pop(f, fps, 8, 10);
  const L: React.CSSProperties = { fontFamily: LABEL, fontWeight: 700, lineHeight: 0.98, WebkitTextStroke: "14px #111", paintOrder: "stroke", textTransform: "uppercase", letterSpacing: 1 };
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: CL.white }}>
      <Img src={staticFile(bed)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z), transformOrigin: "62% 45%" }} />
      <div style={{ position: "absolute", left: 60, top: 40 }}>
        <div style={{ ...L, fontSize: 170, color: "#fff", scale: String(interpolate(p1, [0, 1], [1.6, 1])), opacity: clamp01(p1 * 1.5), transformOrigin: "0 50%" }}>{lines[0]}</div>
        <div style={{ ...L, fontSize: 170, color: CL.yellow, scale: String(interpolate(p2, [0, 1], [1.6, 1])), opacity: clamp01(p2 * 1.5), transformOrigin: "0 50%" }}>{lines[1]}</div>
      </div>
      {marks.map((m, i) => {
        const at = 22 + i * 9, k = pop(f, fps, at, 9);
        return f < at ? null : (
          <div key={i} style={{ position: "absolute", left: m.x, top: m.y, translate: "-50% -50%", scale: String(interpolate(k, [0, 1], [2.2, 1])), opacity: clamp01(k * 1.6), rotate: `${i % 2 ? 8 : -8}deg` }}>
            <svg width={150} height={150} style={{ display: "block", margin: "0 auto" }}><circle cx={75} cy={75} r={64} fill="none" stroke={CL.nitrile} strokeWidth={12} /><path d="M38 38 L112 112" stroke={CL.nitrile} strokeWidth={12} strokeLinecap="round" /></svg>
            <div style={{ background: CL.nitrile, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 36, padding: "2px 14px", borderRadius: 8, textAlign: "center", marginTop: -6, whiteSpace: "nowrap" }}>{m.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
