// Escenas propias de stan12b (chuletas). PURO CSS y DOM sobre las fotos reales del video; sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { K, F, slateBg, kraftBg } from "./Stan";

const { SLAB, SANS, HAND } = F;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => Easing.inOut(Easing.cubic)(cl(t, 0, 1));
const SH = "0 3px 0 rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.55)";
const chalk: React.CSSProperties = { fontFamily: HAND, fontWeight: 700, color: K.chalk, textShadow: "0 0 2px rgba(243,239,228,0.6), 1px 1px 0 rgba(0,0,0,0.25)" };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// ---------- pizarra de precios de la carnicería: renglones que se escriben con tiza sobre su palabra
export const Board: React.FC<{ head: string; rows: { t: string; f: number; st: number }[]; foot?: string; dur: number; seed?: number }> = ({ head, rows, foot, dur, seed = 0 }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.045]);
  const big = rows.length <= 2;
  return (
    <AbsoluteFill style={{ background: "#F1EEE6", backgroundImage: "linear-gradient(rgba(0,0,0,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.07) 2px, transparent 2px)", backgroundSize: "150px 110px", opacity: interpolate(f, [dur - 8, dur], [1, 0], CL) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0) 40%, rgba(60,45,30,0.35) 100%)" }} />
      <div style={{ position: "absolute", left: 190, top: 96, width: 1540, height: 880, transform: `scale(${z}) rotate(${(seed % 2 ? 0.5 : -0.5)}deg)`, borderRadius: 8, border: "26px solid #7A5230", borderTopColor: "#8B6038", borderBottomColor: "#5E3E22", boxShadow: "0 30px 70px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.55)", ...slateBg, padding: "50px 80px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 9, color: K.gold }}>{head}</div>
          <div style={{ ...chalk, fontSize: 40, opacity: 0.55 }}>Stan's Meats</div>
        </div>
        <div style={{ height: 4, background: "rgba(243,239,228,0.5)", margin: "16px 0 10px", borderRadius: 2 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: big ? 26 : 16 }}>
          {rows.map((r, i) => {
            const p = interpolate(f, [r.f, r.f + 14], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
            const fs = r.st === 2 ? Math.min(big ? 190 : 150, Math.floor(1330 / (r.t.length * 0.66))) : r.st === 1 ? Math.min(124, Math.floor(1330 / (r.t.length * 0.44))) : Math.min(96, Math.floor(1330 / (r.t.length * 0.42)));
            return <div key={i} style={{ ...chalk, fontFamily: r.st === 2 ? SLAB : HAND, fontWeight: r.st === 2 ? 400 : 700, fontSize: fs, lineHeight: 1.08, color: r.st === 2 ? K.gold : K.chalk, clipPath: `inset(0 ${100 - p * 100}% 0 0)`, whiteSpace: "nowrap" }}>{r.t}</div>;
          })}
        </div>
        {foot ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 2, color: "rgba(243,239,228,0.7)" }}>Source: {foot}</div> : null}
        {/* borrador y tiza en la repisa */}
        <div style={{ position: "absolute", right: 90, bottom: -22, width: 150, height: 36, borderRadius: 5, background: "linear-gradient(180deg,#8E6A46,#5A3E24)", boxShadow: "0 6px 10px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", right: 270, bottom: -12, width: 70, height: 16, borderRadius: 8, background: K.chalk, transform: "rotate(-6deg)", boxShadow: "0 3px 5px rgba(0,0,0,0.5)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- lado a lado: dos fotos reales del mismo corte, cada una en su mitad, con su chapa
export const Versus: React.FC<{ a: string; la: string; b: string; lb: string; dur: number }> = ({ a, la, b, lb, dur }) => {
  const f = useCurrentFrame();
  const pa = spring({ frame: f, fps: 30, config: { damping: 18 } }), pb = spring({ frame: f - 8, fps: 30, config: { damping: 18 } });
  const win = eio((f - 34) / 16); // la mitad ganadora (b) se agranda un poco
  const half = (src: string, left: boolean, p: number, w: number) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: left ? 0 : 960 - w, width: 960 + (left ? -w : w), overflow: "hidden", transform: `translateX(${(1 - p) * (left ? -100 : 100)}%)` }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: "50%", top: 0, height: 1080, width: 1920, marginLeft: -960, objectFit: "cover", transform: `scale(${interpolate(f, [0, dur], [1.12, 1.22])})`, filter: left ? `saturate(${1 - 0.35 * win}) brightness(${1 - 0.18 * win})` : undefined }} />
    </div>
  );
  const w = 70 * win;
  const tag = (t: string, left: boolean, good: boolean, p: number) => (
    <div style={{ position: "absolute", bottom: 90, left: left ? 0 : 960 - w, width: 960 + (left ? -w : w), display: "flex", justifyContent: "center", opacity: cl((f - 14) / 8, 0, 1) * p }}>
      <div style={{ background: K.paper, padding: "16px 54px", transform: `rotate(${left ? -2 : 1.5}deg) scale(${good ? 1 + 0.12 * win : 1})`, boxShadow: SH }}>
        <span style={{ fontFamily: SLAB, fontSize: 96, color: good ? K.red : K.ink, lineHeight: 1 }}>{t}</span>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: K.ink, opacity: interpolate(f, [dur - 8, dur], [1, 0], CL) }}>
      {half(a, true, pa, w)}{half(b, false, pb, w)}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 960 - w - 5, width: 10, backgroundImage: `repeating-linear-gradient(150deg, ${K.twine} 0 6px, #CDBF9F 6px 11px)`, boxShadow: "0 0 14px rgba(0,0,0,0.7)", opacity: pb }} />
      {tag(la, true, false, pa)}{tag(lb, false, true, pb)}
    </AbsoluteFill>
  );
};

// ---------- los 5 errores: cada uno su foto a pantalla completa, con el sello rojo que cae
export const Mistakes: React.FC<{ items: { f: number; title: string; src: string; n: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame(); let cur = 0; items.forEach((it, i) => { if (f >= it.f) cur = i; });
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      {items.map((it, i) => {
        const end = items[i + 1]?.f ?? dur; if (f < it.f - 1 || f > end + 10) return null;
        const lf = f - it.f; const o = interpolate(lf, [0, 8], [0, 1], CL);
        const st = spring({ frame: lf - 6, fps: 30, config: { damping: 9, mass: 0.8 } });
        const right = i % 2 === 1;
        return (
          <AbsoluteFill key={i} style={{ opacity: o }}>
            <AbsoluteFill style={{ overflow: "hidden" }}><Img src={staticFile(it.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${lerp(1.08, 1.2, lf / Math.max(1, end - it.f))}) translateX(${(right ? -1 : 1) * lf * 0.012}%)` }} /></AbsoluteFill>
            <AbsoluteFill style={{ background: `linear-gradient(0deg, rgba(14,8,6,0.85) 0%, rgba(14,8,6,0.25) 40%, rgba(14,8,6,0) 60%)` }} />
            <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 46, flexDirection: right ? "row-reverse" : "row" }}>
              <div style={{ border: `8px solid ${K.red}`, outline: `3px solid ${K.red}`, outlineOffset: 6, borderRadius: 10, padding: "8px 30px 12px", transform: `scale(${lerp(2.6, 1, st)}) rotate(${lerp(-22, right ? 5 : -6, st)}deg)`, opacity: cl(st * 1.8, 0, 1), background: "rgba(20,10,8,0.35)", textAlign: "center" }}>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, letterSpacing: 9, color: K.red }}>MISTAKE</div>
                <div style={{ fontFamily: SLAB, fontSize: 220, color: K.red, lineHeight: 0.9 }}>{it.n}</div>
              </div>
              <div style={{ fontFamily: SLAB, fontSize: 110, color: K.chalk, textShadow: SH, lineHeight: 1, maxWidth: 1100, clipPath: `inset(0 ${100 - cl((lf - 14) / 14, 0, 1) * 100}% 0 0)` }}>{it.title}</div>
            </div>
          </AbsoluteFill>
        );
      })}
      <div style={{ position: "absolute", right: 60, top: 50, display: "flex", gap: 12 }}>
        {items.map((_, i) => <div key={i} style={{ width: 34, height: 34, borderRadius: 6, border: `3px solid ${K.chalk}`, background: i <= cur ? K.red : "rgba(0,0,0,0.3)", boxShadow: "0 2px 6px rgba(0,0,0,0.5)" }} />)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- el domingo completo: el reloj de pared de la cocina (CSS) recorre las horas; cada parada, su foto y sus renglones
export const Sunday: React.FC<{ stops: { f: number; day: string; h: number; m: number; src: string; lines: { t: string; f: number }[] }[]; dur: number }> = ({ stops, dur }) => {
  const f = useCurrentFrame(); let cur = 0; stops.forEach((s, i) => { if (f >= s.f) cur = i; });
  const mins = (s: { h: number; m: number }, i: number) => s.h * 60 + s.m + (i >= 2 ? 24 * 60 : 0);
  const prev = stops[Math.max(0, cur - 1)], now = stops[cur];
  const t = eio((f - now.f) / 22);
  const tot = cur === 0 ? mins(now, 0) : lerp(mins(prev, cur - 1), mins(now, cur), t);
  const hh = (tot / 60) % 12, mm = tot % 60;
  const hr = Math.floor((tot / 60) % 24), mi = Math.round(mm) % 60;
  const lab = `${((hr + 11) % 12) + 1}:${String(mi).padStart(2, "0")}`;
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      {stops.map((s, i) => {
        const end = stops[i + 1]?.f ?? dur; if (f < s.f - 1 || f > end + 12) return null;
        const lf = f - s.f; const o = i === 0 ? 1 : interpolate(lf, [0, 10], [0, 1], CL);
        const k = lf / Math.max(1, end - s.f);
        return (
          <AbsoluteFill key={i} style={{ opacity: o, overflow: "hidden" }}>
            <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${i % 2 ? lerp(1.16, 1.06, k) : lerp(1.06, 1.16, k)}) translate(${(i % 3 - 1) * k * 1.2}%, ${((i + 1) % 3 - 1) * k * 0.8}%)`, transformOrigin: `${40 + (i * 13) % 25}% ${40 + (i * 7) % 22}%` }} />
            <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(14,8,6,0.82) 0%, rgba(14,8,6,0.2) 36%, rgba(14,8,6,0) 55%)" }} />
            <div style={{ position: "absolute", left: 110, right: 520, bottom: 84 }}>
              {s.lines.map((l, j) => { const p = interpolate(lf, [l.f, l.f + 10], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
                return <div key={j} style={{ ...chalk, fontSize: 96, lineHeight: 1.1, textShadow: SH, clipPath: `inset(0 ${100 - p * 100}% 0 0)`, whiteSpace: "nowrap" }}>{l.t}</div>; })}
            </div>
          </AbsoluteFill>
        );
      })}
      {/* reloj de pared */}
      <div style={{ position: "absolute", right: 110, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #FFFEF8, #F1EADA 70%, #CFC5AE 100%)", boxShadow: "0 18px 40px rgba(0,0,0,0.6), inset 0 0 0 10px #2B2B2B, inset 0 0 0 14px #8E969A", position: "relative" }}>
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 147, top: 22, width: 6, height: i % 3 ? 16 : 30, background: K.ink, transformOrigin: "50% 128px", transform: `rotate(${i * 30}deg)` }} />)}
          <div style={{ position: "absolute", left: 144, top: 76, width: 12, height: 80, borderRadius: 6, background: K.ink, transformOrigin: "50% 74px", transform: `rotate(${hh * 30}deg)` }} />
          <div style={{ position: "absolute", left: 146, top: 42, width: 8, height: 114, borderRadius: 4, background: K.ink, transformOrigin: "50% 108px", transform: `rotate(${mm * 6}deg)` }} />
          <div style={{ position: "absolute", left: 138, top: 138, width: 24, height: 24, borderRadius: "50%", background: K.red }} />
        </div>
        <div style={{ ...kraftBg(4), marginTop: 16, padding: "8px 30px", boxShadow: SH, textAlign: "center", transform: "rotate(-1.5deg)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: K.redD }}>{now.day}</div>
          <div style={{ fontFamily: SLAB, fontSize: 70, color: K.ink, lineHeight: 1 }}>{lab}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- el lomo entero (e_loin, cenital 1920x1080): la foto se acuesta como un piso y se camina a ras del hombro a la cadera
export const EscLoin: React.FC<{ src: string; fA: number; fB: number; fC: number; dur: number }> = ({ src, fA, fB, fC, dur }) => {
  const f = useCurrentFrame();
  // 0..fC: cenital con empuje lento; fC..: la foto gira sobre su borde inferior (rotateX) y avanza de izquierda a derecha
  const tilt = eio((f - fC) / 26);                         // 0 cenital → 1 a ras
  const walk = cl((f - fC - 10) / Math.max(30, dur - fC - 10), 0, 1);
  const rx = lerp(0, 66, tilt);
  const sc = lerp(1.03 + 0.02 * (f / Math.max(1, fC)), 2.5, tilt);
  // punto del lomo bajo los pies: del hombro (x=140) hacia la cadera (x=1750); y del lomo = 475
  const px = lerp(960, lerp(260, 1500, Easing.inOut(Easing.sin)(walk)), tilt);
  const py = lerp(540, 475, tilt);
  const lab = (t: string, x: number, at: number) => (
    <div style={{ position: "absolute", left: x, top: 236, transform: "translateX(-50%)", opacity: interpolate(f, [at, at + 8, fC - 4, fC + 6], [0, 1, 1, 0], CL) }}>
      <div style={{ fontFamily: SLAB, fontSize: 66, color: K.chalk, textShadow: SH, whiteSpace: "nowrap", clipPath: `inset(0 ${100 - cl((f - at) / 10, 0, 1) * 100}% 0 0)` }}>{t}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120B07", perspective: 1100, perspectiveOrigin: "50% 38%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${px}px ${py}px`,
        transform: `translate(${960 - px}px, ${lerp(540, 700, tilt) - py}px) rotateX(${rx}deg) rotateZ(${lerp(0, -90, tilt)}deg) scale(${sc})` }}>
        <Img src={staticFile(src)} style={FULL} />
        {lab("SHOULDER", 190, fA)}{lab("HIP", 1720, fB)}
      </div>
      {/* el fondo del pasillo se pierde en la sombra (tapa el borde lejano de la foto) */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(18,11,7,1) 0%, rgba(18,11,7,0.85) 14%, rgba(18,11,7,0) 44%)", opacity: tilt }} />
      <AbsoluteFill style={{ opacity: interpolate(f, [dur - 6, dur], [0, 1], CL), background: "#120B07" }} />
    </AbsoluteFill>
  );
};

// ---------- el cinturón (g3410): la foto se ciñe como una cintura a la altura de la tira plateada (y 290-700, centro 480)
export const EscBelt: React.FC<{ src: string; fShrink: number; fFast: number; dur: number }> = ({ src, fShrink, fFast, dur }) => {
  const f = useCurrentFrame();
  const a1 = spring({ frame: f - fShrink, fps: 30, config: { damping: 9, mass: 0.6 } });
  const a2 = spring({ frame: f - fFast, fps: 30, config: { damping: 8, mass: 0.5 } });
  const amt = 0.085 * a1 + 0.07 * a2;                       // cuánto se angosta la hilera del centro
  const base = 1.22 + 0.03 * (f / Math.max(1, dur));         // la foto va agrandada: al angostarse nunca deja borde
  const H = 12, N = 1080 / H, YC = 480, SIG = 150, OX = 1200;
  const rows = [];
  for (let i = 0; i < N; i++) {
    const y = i * H + H / 2; const g = Math.exp(-((y - YC) * (y - YC)) / (2 * SIG * SIG));
    const sx = base * (1 - amt * g);
    rows.push(
      <div key={i} style={{ position: "absolute", left: 0, top: i * H, width: 1920, height: H + 1, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: -i * H, width: 1920, height: 1080, objectFit: "fill", transformOrigin: `${OX}px ${YC}px`, transform: `scale(${sx}, ${base})` }} />
      </div>
    );
  }
  return <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>{rows}</AbsoluteFill>;
};

// ---------- pasos con fotos: cada parada cambia la foto real a pantalla completa, deja caer su chapa de papel y escribe sus renglones en tiza
export const Steps: React.FC<{ stops: { f: number; src: string; tag?: string; sub?: string; lines?: { t: string; f: number }[] }[]; dur: number }> = ({ stops, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      {stops.map((s, i) => {
        const end = stops[i + 1]?.f ?? dur; if (f < s.f - 1 || f > end + 12) return null;
        const lf = f - s.f; const o = i === 0 ? 1 : interpolate(lf, [0, 10], [0, 1], CL); const k = lf / Math.max(1, end - s.f);
        const tg = spring({ frame: lf - 5, fps: 30, config: { damping: 11, mass: 0.7 } }); const right = i % 2 === 0;
        return (
          <AbsoluteFill key={i} style={{ opacity: o, overflow: "hidden" }}>
            <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${i % 2 ? lerp(1.17, 1.06, k) : lerp(1.06, 1.17, k)}) translate(${((i % 3) - 1) * k * 1.3}%, ${(((i + 1) % 3) - 1) * k * 0.8}%)`, transformOrigin: `${38 + (i * 13) % 26}% ${40 + (i * 7) % 22}%` }} />
            <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(14,8,6,0.84) 0%, rgba(14,8,6,0.22) 36%, rgba(14,8,6,0) 56%)" }} />
            {s.tag ? (
              <div style={{ position: "absolute", top: 70, ...(right ? { right: 90 } : { left: 90 }), transformOrigin: right ? "100% 0" : "0 0", transform: `rotate(${lerp(right ? 18 : -18, right ? 2.5 : -2.5, tg)}deg) scale(${lerp(1.6, 1, tg)})`, opacity: cl(tg * 1.8, 0, 1) }}>
                <div style={{ ...kraftBg(i + 2), padding: "16px 44px 20px", boxShadow: SH, textAlign: "center" }}>
                  <div style={{ fontFamily: SLAB, fontSize: s.tag.length > 16 ? 60 : 84, color: K.ink, lineHeight: 1.02, whiteSpace: "nowrap" }}>{s.tag}</div>
                  {s.sub ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: K.redD, marginTop: 4, whiteSpace: "nowrap" }}>{s.sub}</div> : null}
                </div>
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 110, right: 110, bottom: 84 }}>
              {(s.lines || []).map((l, j) => { const p = interpolate(lf, [l.f, l.f + 10], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
                return <div key={j} style={{ ...chalk, fontSize: 80, lineHeight: 1.12, textShadow: SH, clipPath: `inset(0 ${100 - p * 100}% 0 0)`, whiteSpace: "nowrap" }}>{l.t}</div>; })}
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
