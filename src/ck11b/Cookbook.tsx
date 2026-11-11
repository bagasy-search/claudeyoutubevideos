// ck11b · piezas del recetario de la iglesia (canal 242): tarjeta de receta como objeto de papel a pantalla completa,
// horario de las cinco ollas, CTA con la página del libro + QR (≥9 s), tarjetas del resumen final y apertura de capítulo.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, FONTS, hash } from "./Piezas";
import { Grain } from "./Piezas2";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const sp = (f: number, d = 14, m = 0.7) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const DEPTH = "0 1px 0 rgba(255,255,255,.6) inset, 0 3px 6px rgba(0,0,0,.28), 0 18px 34px rgba(0,0,0,.38), 0 46px 90px rgba(0,0,0,.32)";
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";

export type Line = { t: string; f: number };
export type Recipe = { title: string; sub?: string; crock?: string; lines: Line[]; cols?: number; foot?: string };

// mesa de madera de la iglesia (foto) de fondo, con viñeta cálida
const Table: React.FC<{ src: string; f: number }> = ({ src, f }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#24170d" }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + f * 0.00012})`, filter: "brightness(0.82) saturate(0.9)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(30,18,8,0) 40%, rgba(30,18,8,0.55) 100%)" }} />
  </AbsoluteFill>
);

// sello "FROM MY CHURCH COOKBOOK": cae y golpea (escala 2 → 1), tinta vino algo gastada
export const Stamp: React.FC<{ f0: number; size?: number; rot?: number; text?: string }> = ({ f0, size = 210, rot = -12, text = "FROM MY CHURCH COOKBOOK" }) => {
  const f = useCurrentFrame(); const p = sp(f - f0, 11, 0.6);
  const words = text.split(" ");
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: `${size * 0.03}px solid ${C.ver}`, outline: `${size * 0.012}px solid ${C.ver}`, outlineOffset: -size * 0.075,
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: C.ver, opacity: cl(p * 1.6) * 0.86, mixBlendMode: "multiply",
      transform: `rotate(${rot}deg) scale(${lerp(2.1, 1, p)})`, fontFamily: SANS, fontWeight: 800, letterSpacing: 2, textAlign: "center", lineHeight: 1.05, fontSize: size * 0.1 }}>
      <div style={{ fontSize: size * 0.085 }}>{words.slice(0, 2).join(" ")}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: size * 0.2, margin: `${size * 0.02}px 0`, letterSpacing: 0 }}>✝</div>
      <div style={{ fontSize: size * 0.085 }}>{words.slice(2).join(" ")}</div>
    </div>
  );
};

// ======================= tarjeta de receta: objeto de papel que cae sobre la mesa; renglones a mano en sincronía con la voz
export const RecipeCard: React.FC<{ r: Recipe; n?: number; bg: string; dur: number; seed?: number }> = ({ r, n, bg, dur, seed = 1 }) => {
  const f = useCurrentFrame();
  const drop = sp(f - 2, 13, 0.9);
  const rot0 = (hash(seed) % 2 ? 1 : -1) * (1.2 + (hash(seed + 5) % 10) / 10);
  const out = interpolate(f, [dur - 12, dur], [0, 1], CL);
  const cols = r.cols ?? (r.lines.length > 6 ? 2 : 1);
  const per = Math.ceil(r.lines.length / cols);
  // cámara: se arrima al renglón que se está escribiendo y vuelve a la tarjeta entera al final
  const cur = r.lines.reduce((a, l, i) => (f >= l.f ? i : a), -1);
  const lastF = r.lines.length ? r.lines[r.lines.length - 1].f : 0;
  const back = ease((f - lastF - 30) / 40);
  const col = cur < 0 ? 0 : Math.floor(cur / per), row = cur < 0 ? 0 : cur % per;
  const fx = cols === 1 ? 0 : col === 0 ? 120 : -120, fy = lerp(60, -90, per > 1 ? row / (per - 1) : 0);
  const zoom = lerp(cur < 0 ? 1 : 1.07, 1, back);
  const camX = lerp(cur < 0 ? 0 : fx, 0, back), camY = lerp(cur < 0 ? 0 : fy, 0, back);
  const W = 1480, H = 900;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Table src={bg} f={f} />
      <AbsoluteFill style={{ transform: `translate(${camX}px, ${camY}px) scale(${zoom})`, transformOrigin: "50% 50%" }}>
        {/* sombra que "aterriza" */}
        <div style={{ position: "absolute", left: 960 - W / 2 + 30, top: 540 - H / 2 + 40, width: W, height: H, borderRadius: 10, background: "rgba(0,0,0,0.45)", filter: `blur(${lerp(60, 26, drop)}px)`, opacity: drop }} />
        <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, width: W, height: H, borderRadius: 8, boxShadow: DEPTH,
          transform: `translateY(${lerp(-1300, 0, drop)}px) rotate(${lerp(rot0 * 6, rot0, drop)}deg)`,
          background: `radial-gradient(120% 90% at 25% 12%, #FCF5E6 0%, ${C.paper} 55%, ${C.paper2} 100%)`, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.55, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 59px, rgba(90,62,36,0.18) 59px 61px)", backgroundPosition: "0 196px" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 176, height: 3, background: "rgba(142,29,43,0.55)" }} />
          <div style={{ position: "absolute", inset: 14, border: "1.5px solid rgba(90,62,36,0.42)", borderRadius: 4 }} />
          {/* encabezado */}
          <div style={{ position: "absolute", left: 70, top: 40, right: 300 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: C.ver }}>{n ? `SIDE NO. ${n} · ` : ""}{r.sub ?? "FEEDS 20"}</div>
            <div style={{ fontFamily: SERIF, fontSize: 76, lineHeight: 1.02, color: C.ink, marginTop: 6, whiteSpace: "nowrap" }}>{r.title}</div>
          </div>
          {r.crock && <div style={{ position: "absolute", right: 290, top: 64, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: C.indigo, transform: "rotate(-3deg)" }}>{r.crock}</div>}
          <div style={{ position: "absolute", right: 46, top: 18 }}><Stamp f0={16} size={200} rot={-14} /></div>
          {/* renglones */}
          <div style={{ position: "absolute", left: 80, right: 60, top: 206, display: "flex", gap: 60 }}>
            {Array.from({ length: cols }, (_, c) => (
              <div key={c} style={{ flex: 1 }}>
                {r.lines.slice(c * per, (c + 1) * per).map((l, i) => {
                  const k = sp(f - l.f, 18, 0.6); const w = cl((f - l.f) / 12);
                  return (
                    <div key={i} style={{ height: 60, display: "flex", alignItems: "flex-end", paddingBottom: 6, gap: 16, opacity: cl(k * 1.5) }}>
                      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, color: C.ver, width: 20, textAlign: "right" }}>•</span>
                      <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: r.lines.length > 10 ? 40 : 44, color: C.ink, lineHeight: 1, whiteSpace: "nowrap",
                        clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{l.t}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {r.foot && <div style={{ position: "absolute", left: 80, bottom: 34, fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: "rgba(42,26,14,0.6)" }}>{r.foot}</div>}
          <Grain op={0.1} />
        </div>
      </AbsoluteFill>
      {/* "pausá y copiá" */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", opacity: interpolate(f, [20, 32, dur - 14, dur - 4], [0, 1, 1, 0], CL) }}>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: C.white, textShadow: shadow }}>❚❚ PAUSE AND COPY IT DOWN</span>
      </div>
    </AbsoluteFill>
  );
};

// ======================= horario de las ollas para una cena a las 5: regla de tiempo 10 → 17 h, cada olla entra en su hora
export type Slot = { name: string; at: number; end?: number; mode: string; f: number };
export const Sched: React.FC<{ slots: Slot[]; warmF: number; bg: string; dur: number; title?: string }> = ({ slots, warmF, bg, dur, title = "My schedule · supper at 5 o'clock" }) => {
  const f = useCurrentFrame(); const drop = sp(f - 2, 14, 0.9); const out = interpolate(f, [dur - 12, dur], [0, 1], CL);
  const X0 = 300, X1 = 1700, T0 = 10, T1 = 17; const x = (h: number) => X0 + ((h - T0) / (T1 - T0)) * (X1 - X0);
  const warm = sp(f - warmF, 16);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Table src={bg} f={f} />
      <div style={{ position: "absolute", left: 120, top: 110, width: 1680, height: 860, borderRadius: 8, boxShadow: DEPTH, transform: `translateY(${lerp(-1200, 0, drop)}px) rotate(${lerp(-8, -0.8, drop)}deg)`,
        background: `radial-gradient(120% 90% at 25% 12%, #FCF5E6 0%, ${C.paper} 55%, ${C.paper2} 100%)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 14, border: "1.5px solid rgba(90,62,36,0.42)", borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 70, top: 46, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: C.ver }}>THANKSGIVING DAY · FIVE CROCKS · ONE OVEN FREE</div>
        <div style={{ position: "absolute", left: 70, top: 80, fontFamily: SERIF, fontSize: 70, color: C.ink }}>{title}</div>
        <div style={{ position: "absolute", right: 50, top: 24 }}><Stamp f0={14} size={180} rot={-10} /></div>
        {/* regla horaria */}
        <div style={{ position: "absolute", left: X0 - 120, top: 270, width: X1 - X0 + 120, height: 2, background: "rgba(42,26,14,0.5)" }} />
        {Array.from({ length: T1 - T0 + 1 }, (_, i) => T0 + i).map((h) => (
          <div key={h} style={{ position: "absolute", left: x(h) - 120 - 40, top: 226, width: 80, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "rgba(42,26,14,0.75)" }}>{h > 12 ? h - 12 : h}{h >= 12 ? "pm" : "am"}</div>
        ))}
        {slots.map((s, i) => {
          const k = sp(f - s.f, 16); const y = 310 + i * 96; const xa = x(s.at) - 120, xb = x(s.end ?? 16.5) - 120;
          const grow = ease((f - s.f) / 26);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: y, width: "100%", height: 80, opacity: cl(k * 1.5) }}>
              <div style={{ position: "absolute", left: 60, top: 14, width: X0 - 200, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: C.ink, whiteSpace: "nowrap" }}>{s.name}</div>
              <div style={{ position: "absolute", left: xa, top: 18, height: 46, width: (xb - xa) * grow, borderRadius: 23, background: `linear-gradient(180deg, #A8343F, ${C.ver})`, boxShadow: "0 4px 10px rgba(0,0,0,0.25)" }} />
              <div style={{ position: "absolute", left: xa + 18, top: 26, fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: "#F8DDA4", opacity: grow, whiteSpace: "nowrap" }}>
                {(s.at % 1 ? `${Math.floor(s.at > 12.9 ? s.at - 12 : s.at)}:30` : `${s.at > 12 ? s.at - 12 : s.at}:00`)} · {s.mode}</div>
            </div>
          );
        })}
        {/* 4:30 todas a WARM */}
        <div style={{ position: "absolute", left: x(16.5) - 120, top: 286, width: 4, height: 500, background: C.gold, opacity: warm, boxShadow: "0 0 18px rgba(201,151,63,0.8)" }} />
        <div style={{ position: "absolute", left: x(16.5) - 120 - 130, top: 790, width: 260, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: C.ver, opacity: warm, transform: `scale(${lerp(1.4, 1, warm)})` }}>4:30 · ALL TO WARM</div>
        <Grain op={0.1} />
      </div>
    </AbsoluteFill>
  );
};

// ======================= QR del link LIMPIO (sin ?src=) en tarjetita de papel; quieto y nítido (lo verifica cv2)
const QRCard: React.FC<{ f0: number; label: string; url: string }> = ({ f0, label, url }) => {
  const f = useCurrentFrame(); const p = sp(f - f0, 15);
  return (
    <div style={{ width: 430, padding: "26px 26px 22px", background: "#FBF6EA", borderRadius: 10, boxShadow: DEPTH, textAlign: "center", opacity: cl(p * 1.4), transform: `translateY(${(1 - p) * 120}px) rotate(${lerp(6, 0, p)}deg)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 21, letterSpacing: 4, color: C.ver, marginBottom: 14 }}>{label}</div>
      <Img src={staticFile("ck11b/qr.png")} style={{ width: 378, height: 378, display: "block", imageRendering: "pixelated" }} />
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 21, color: C.ink, marginTop: 12 }}>{url}</div>
    </div>
  );
};

// ======================= CTA del libro: la página real (p7 / p39) o la tapa entra como objeto; QR al costado ≥ 9 s
export const BookCTA: React.FC<{ page: string; head: string; title: string; qrF: number; bg: string; dur: number; cover?: boolean; zoomTo?: [number, number] }> = ({ page, head, title, qrF, bg, dur, cover, zoomTo }) => {
  const f = useCurrentFrame(); const p = sp(f - 3, 15, 0.9); const out = interpolate(f, [dur - 12, dur], [0, 1], CL);
  const z = zoomTo ? ease((f - 40) / 60) * (1 - ease((f - qrF + 30) / 30)) : 0;
  const PW = cover ? 620 : 700, PH = PW * (2200 / 1700);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Table src={bg} f={f} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,12,6,0) 40%, rgba(20,12,6,0.35) 100%)" }} />
      {/* página */}
      <div style={{ position: "absolute", left: 200, top: 540 - PH / 2, width: PW, height: PH, perspective: 1600 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: cover ? "4px 12px 12px 4px" : 4, overflow: "hidden", boxShadow: DEPTH,
          transform: `translateX(${lerp(-900, 0, p)}px) rotateY(${lerp(-40, cover ? -10 : -4, p)}deg) rotate(${lerp(-10, -2, p)}deg) scale(${1 + 0.6 * z})`,
          transformOrigin: zoomTo ? `${zoomTo[0]}% ${zoomTo[1]}%` : "50% 50%" }}>
          <Img src={staticFile(page)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {!cover && <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0) 12%)" }} />}
        </div>
      </div>
      {/* rótulo + QR */}
      <div style={{ position: "absolute", left: 1000, top: 120, width: 820, opacity: cl(p * 1.3) }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: C.rose, textShadow: shadow }}>{head}</div>
        <div style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1.05, color: C.white, textShadow: shadow, marginTop: 8 }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: 1180, top: 330 }}><QRCard f0={qrF} label="LORETTA'S CHURCH SUPPER COOKBOOK" url="cookbook.lorettaschurch.com" /></div>
    </AbsoluteFill>
  );
};

// ======================= resumen final: una tarjeta por receta, foto del plato + lista corta que se tilda con la voz
export const SumCard: React.FC<{ n?: number; title: string; lines: Line[]; src: string; bg: string; dur: number; head?: string }> = ({ n, title, lines, src, bg, dur, head }) => {
  const f = useCurrentFrame(); const p = sp(f - 2, 14, 0.8); const out = interpolate(f, [dur - 10, dur], [0, 1], CL);
  const right = (n ?? 0) % 2 === 1;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Table src={bg} f={f} />
      <div style={{ position: "absolute", top: 110, [right ? "right" : "left"]: 110, width: 760, height: 860, padding: 22, background: "#FBF6EA", boxShadow: DEPTH, borderRadius: 6,
        transform: `translateX(${lerp(right ? 1200 : -1200, 0, p)}px) rotate(${lerp(right ? 9 : -9, right ? 1.8 : -1.8, p)}deg)` } as React.CSSProperties}>
        <div style={{ width: "100%", height: 816, overflow: "hidden", borderRadius: 3 }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + f * 0.0004})` }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 150, [right ? "left" : "right"]: 110, width: 880, height: 780, borderRadius: 8, boxShadow: DEPTH, overflow: "hidden",
        background: `radial-gradient(120% 90% at 25% 12%, #FCF5E6 0%, ${C.paper} 55%, ${C.paper2} 100%)`,
        transform: `translateY(${lerp(-1100, 0, sp(f - 6, 14, 0.9))}px) rotate(${right ? -1 : 1}deg)` } as React.CSSProperties}>
        <div style={{ position: "absolute", inset: 14, border: "1.5px solid rgba(90,62,36,0.42)", borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 56, top: 40, fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 5, color: C.ver }}>{head ?? (n ? `THE SUMMARY · ${n} OF 5` : "THE SUMMARY")}</div>
        <div style={{ position: "absolute", left: 56, right: 40, top: 74, fontFamily: SERIF, fontSize: 60, lineHeight: 1.02, color: C.ink }}>{title}</div>
        <div style={{ position: "absolute", left: 56, right: 40, top: 220 }}>
          {lines.map((l, i) => {
            const k = sp(f - l.f, 16); const on = f >= l.f;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 64, opacity: on ? 1 : 0.28 }}>
                <div style={{ width: 34, height: 34, border: `3px solid ${C.ink}`, borderRadius: 4, position: "relative", flex: "none" }}>
                  {on && <div style={{ position: "absolute", left: 2, top: -16, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: C.ver, transform: `scale(${lerp(1.8, 1, k)})` }}>✓</div>}
                </div>
                <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: lines.length > 8 ? 38 : 42, color: C.ink, lineHeight: 1, whiteSpace: "nowrap" }}>{l.t}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 30, bottom: 26 }}><Stamp f0={12} size={150} rot={-10} /></div>
        <Grain op={0.08} />
      </div>
    </AbsoluteFill>
  );
};

// ======================= apertura de capítulo: la foto del plato a pantalla completa y la tarjeta de la receta entra como objeto
export const ChapterOpen: React.FC<{ n: number; total: number; label: string; title: string; src: string; dur: number }> = ({ n, total, label, title, src, dur }) => {
  const f = useCurrentFrame();
  const k = cl(f / dur); const right = n % 2 === 0;
  const card = sp(f - 8, 13, 0.9); const out = interpolate(f, [dur - 10, dur], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <AbsoluteFill style={{ overflow: "hidden", background: "#1a120b" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${lerp(1.22, 1.06, Easing.out(Easing.cubic)(k))}) translateX(${right ? -2 : 2}%)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(20,12,6,0.72) 0%, rgba(20,12,6,0.25) 45%, rgba(20,12,6,0) 70%)` }} />
      <div style={{ position: "absolute", top: 250, [right ? "right" : "left"]: 120, width: 760, padding: "40px 50px 44px", borderRadius: 8, boxShadow: DEPTH,
        background: `radial-gradient(120% 90% at 25% 12%, #FCF5E6 0%, ${C.paper} 55%, ${C.paper2} 100%)`,
        transform: `translateY(${lerp(-900, 0, card)}px) rotate(${lerp(right ? 14 : -14, right ? 2 : -2, card)}deg)` } as React.CSSProperties}>
        <div style={{ position: "absolute", inset: 12, border: "1.5px solid rgba(90,62,36,0.42)", borderRadius: 4 }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: C.ver }}>{label}</div>
        <div style={{ fontFamily: SERIF, fontSize: 84, lineHeight: 1.0, color: C.ink, marginTop: 10 }}>{title}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
          {Array.from({ length: total }, (_, i) => <div key={i} style={{ width: 54, height: 7, borderRadius: 4, background: i < n ? C.ver : "rgba(42,26,14,0.2)" }} />)}
        </div>
        <div style={{ position: "absolute", right: -40, bottom: -50 }}><Stamp f0={22} size={170} rot={-12} /></div>
      </div>
    </AbsoluteFill>
  );
};
