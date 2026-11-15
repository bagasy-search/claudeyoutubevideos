// cme14b · piezas del «kit solar de $549» (Claudio Mendoza). PURO CSS y DOM: celdas de panel, lámina, pantalla LCD,
// pizarrón magnético de refri, cinta aislante sobre cartón, etiqueta de anaquel, corcho. Sin SVG, sin blur, sin filtros.
// Ninguna repite un mecanismo de cme14a (cartón con PASO, cuaderno, ticket, medidor, aviso, recortes, etiqueta de batería, turnos, dos).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as lNews } from "@remotion/google-fonts/Newsreader";
import { loadFont as lOsw } from "@remotion/google-fonts/Oswald";
import { loadFont as lHand } from "@remotion/google-fonts/PatrickHand";
import { loadFont as lMono } from "@remotion/google-fonts/ShareTechMono";

const { fontFamily: SERIF } = lNews();
const { fontFamily: SANS } = lOsw();
const { fontFamily: HAND } = lHand();
const { fontFamily: MONO } = lMono();
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
export const S = { bone: "#EFE9DC", ink: "#17181A", lime: "#B6E03A", red: "#C8352B", cell: "#1B2333", cell2: "#26324A", steel: "#C9CCD0", yellow: "#F2C230", lcd: "#C3CFA8", lcdInk: "#1E2A16", cork: "#B88A5A", blue: "#2B54A0" };
const fadeIO = (f: number, dur: number, a = 7, b = 7) => interpolate(f, [0, a, dur - b, dur], [0, 1, 1, 0], CL);
const pop = (f: number, f0: number, fps: number, d = 14) => spring({ frame: f - f0, fps, config: { damping: d, stiffness: 150 } });
const appear = (f: number, f0: number, len = 10) => interpolate(f, [f0, f0 + len], [0, 1], { ...CL, easing: ease });

// ---------- fondos de material
const concrete = `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.06) 0 2px, transparent 3px), linear-gradient(160deg, #A8A39A 0%, #8E8980 100%)`;
const block = `linear-gradient(rgba(60,55,50,0.35) 3px, transparent 3px), linear-gradient(90deg, rgba(60,55,50,0.35) 3px, transparent 3px), linear-gradient(180deg, #B9B3A8, #A39D92)`;
const fridge = `linear-gradient(100deg, #F7F7F4 0%, #ECECE8 40%, #F9F9F6 55%, #E6E6E2 100%)`;
const corkBg = `radial-gradient(circle at 30% 40%, rgba(90,55,25,0.35) 0 1.5px, transparent 2px), radial-gradient(circle at 70% 20%, rgba(255,230,190,0.25) 0 1.5px, transparent 2px), linear-gradient(170deg, #C39463, #A97A4A)`;
const kraft = `repeating-linear-gradient(90deg, rgba(70,40,15,0.08) 0px, rgba(70,40,15,0.08) 2px, transparent 2px, transparent 8px), linear-gradient(170deg, #C49A68 0%, #A97E4E 100%)`;

const Drift: React.FC<{ dur: number; seed?: number; children: React.ReactNode }> = ({ dur, seed = 0, children }) => {
  const f = useCurrentFrame();
  const x = Math.sin((f + seed * 13) / 70) * 7;
  const y = Math.cos((f + seed * 5) / 58) * 4;
  const s = interpolate(f, [0, dur], [1.0, 1.045]);
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s})` }}>{children}</AbsoluteFill>;
};
const Stage: React.FC<{ dur: number; seed?: number; bg: string; children: React.ReactNode; light?: boolean }> = ({ dur, seed = 0, bg, children, light = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: S.ink, opacity: fadeIO(f, dur) }}>
      <Drift dur={dur} seed={seed}>
        <AbsoluteFill style={{ background: bg }} />
        {light ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 1300px 800px at 45% 30%, rgba(255,240,210,0.22), rgba(0,0,0,0) 70%), radial-gradient(ellipse 1400px 900px at 50% 120%, rgba(0,0,0,0.35), rgba(0,0,0,0) 70%)" }} /> : null}
        {children}
      </Drift>
    </AbsoluteFill>
  );
};
const Screw: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 26, height: 26, borderRadius: 13, background: "radial-gradient(circle at 35% 35%, #F2F2F2, #8B8E92 70%)", boxShadow: "0 2px 3px rgba(0,0,0,0.5)" }}>
    <div style={{ position: "absolute", left: 4, top: 11, width: 18, height: 4, background: "#55585C", transform: "rotate(35deg)" }} />
  </div>
);
const fmt = (n: number, d = 0) => n.toLocaleString("es-MX", { minimumFractionDigits: d, maximumFractionDigits: d });

// ================= 1 · PASO N DE 10: tira de 10 celdas de panel solar; se encienden hasta la N =================
const Cells: React.FC<{ n: number; total?: number; f0?: number; vertical?: boolean; size?: number }> = ({ n, total = 10, f0 = 6, vertical = true, size = 78 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 8, padding: 12, background: "#C9CCD0", boxShadow: "0 18px 40px rgba(0,0,0,0.5), inset 0 0 0 3px #9EA3A8" }}>
      {Array.from({ length: total }).map((_, i) => {
        const on = i < n - 1 ? 1 : i === n - 1 ? appear(f, f0 + 6, 12) : 0;
        const cur = i === n - 1;
        return (
          <div key={i} style={{ position: "relative", width: size * 1.25, height: size, background: `linear-gradient(135deg, ${S.cell2}, ${S.cell})`, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 32%, rgba(220,225,235,0.55) 32%, rgba(220,225,235,0.55) 34%, transparent 34%, transparent 66%, rgba(220,225,235,0.55) 66%, rgba(220,225,235,0.55) 68%, transparent 68%)" }} />
            <div style={{ position: "absolute", inset: 0, background: S.lime, opacity: on * (cur ? 0.78 + 0.18 * Math.sin(f / 6) : 0.62) }} />
            <div style={{ position: "absolute", left: 8, top: 4, fontFamily: SANS, fontSize: size * 0.38, color: on > 0.5 ? S.ink : "rgba(230,235,245,0.55)" }}>{i + 1}</div>
          </div>
        );
      })}
    </div>
  );
};
export const PasoCelda: React.FC<{ n: number; title: string; sub?: string; img?: string; dur: number; seed: number }> = ({ n, title, sub, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const z = interpolate(f, [0, dur], [1.04, 1.12]);
  const tIn = pop(f, 10, fps);
  return (
    <AbsoluteFill style={{ background: S.ink, opacity: fadeIO(f, dur) }}>
      {img ? <AbsoluteFill style={{ overflow: "hidden" }}><Img src={staticFile(img)} style={{ width: 1920, height: 1080, objectFit: "cover", transform: `scale(${z})`, transformOrigin: "65% 45%" }} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(14,15,17,0.92) 0%, rgba(14,15,17,0.78) 42%, rgba(14,15,17,0.05) 75%)" }} />
      <div style={{ position: "absolute", left: 90, top: 70 }}><Cells n={n} f0={0} size={76} /></div>
      <div style={{ position: "absolute", left: 330, top: 300, opacity: tIn, transform: `translateX(${(1 - tIn) * -60}px)` }}>
        <div style={{ fontFamily: SANS, fontSize: 58, letterSpacing: 10, color: S.lime }}>PASO {n} DE 10</div>
        <div style={{ fontFamily: SERIF, fontSize: 104, lineHeight: 1.02, color: "#F4F0E6", width: 900, marginTop: 14 }}>{title}</div>
        {sub ? <div style={{ fontFamily: HAND, fontSize: 52, color: "#E8DFC8", marginTop: 22 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
// recap: misma tira, la celda N se enciende y deja su dato
export const RecapCelda: React.FC<{ n: number; title: string; fact: string; img?: string; dur: number; seed: number }> = ({ n, title, fact, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = pop(f, 4, fps); const b = appear(f, 16, 14);
  return (
    <AbsoluteFill style={{ background: S.ink, opacity: fadeIO(f, dur) }}>
      {img ? <AbsoluteFill style={{ overflow: "hidden", opacity: 0.55 }}><Img src={staticFile(img)} style={{ width: 1920, height: 1080, objectFit: "cover", transform: `translateX(${interpolate(f, [0, dur], [-60, 60])}px) scale(${interpolate(f, [0, dur], [1.2, 1.04])})` }} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(14,15,17,0.9), rgba(14,15,17,0.55))" }} />
      <div style={{ position: "absolute", left: 90, top: 70 }}><Cells n={n} f0={0} size={76} /></div>
      <div style={{ position: "absolute", left: 330, top: 260, width: 1400, transform: `translateY(${interpolate(f, [0, dur], [10, -24])}px)` }}>
        <div style={{ fontFamily: SANS, fontSize: 52, letterSpacing: 8, color: S.lime, opacity: a }}>{n} · {title.toUpperCase()}</div>
        <div style={{ fontFamily: SERIF, fontSize: 78, lineHeight: 1.12, color: "#F4F0E6", marginTop: 26, clipPath: `inset(0 ${(1 - b) * 100}% 0 0)` }}>{fact}</div>
      </div>
    </AbsoluteFill>
  );
};
// índice: el panel de 10 celdas entero, cada celda con su título
export const IndiceCeldas: React.FC<{ titles: string[]; dur: number; seed: number }> = ({ titles, dur, seed }) => {
  const f = useCurrentFrame();
  return (
    <Stage dur={dur} seed={seed} bg={concrete}>
      <div style={{ position: "absolute", left: 130, top: 90, width: 1660, height: 900, background: "#C9CCD0", padding: 16, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 4px #9EA3A8", transform: "perspective(1800px) rotateX(14deg)" }}>
        {titles.map((t, i) => {
          const on = appear(f, 6 + i * 5, 8);
          return (
            <div key={i} style={{ position: "relative", background: `linear-gradient(135deg, ${S.cell2}, ${S.cell})`, overflow: "hidden", padding: 22 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 49.5%, rgba(220,225,235,0.4) 49.5%, rgba(220,225,235,0.4) 50.5%, transparent 50.5%)" }} />
              <div style={{ position: "absolute", inset: 0, background: S.lime, opacity: on * 0.16 }} />
              <div style={{ position: "relative", fontFamily: SANS, fontSize: 64, color: on > 0.5 ? S.lime : "rgba(230,235,245,0.4)" }}>{i + 1}</div>
              <div style={{ position: "relative", fontFamily: SERIF, fontSize: 36, lineHeight: 1.1, color: "#EEF0F4", opacity: on, marginTop: 8 }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ================= 2 · PLACA plateada de especificaciones, con lupa que baja al renglón =================
export const Placa: React.FC<{ rows: string[]; n: number; detail?: string; head?: string; dur: number; seed: number; lf0?: number; prev?: any }> = ({ rows, n, detail, head = "ESPECIFICACIONES", dur, seed, lf0 = 0, prev }) => {
  const f = useCurrentFrame(); const o = lf0;
  const RH = 92, TOP = 250;
  const y0 = prev && prev.n >= 1 ? TOP + (prev.n - 1) * RH : n === 1 ? -80 : TOP + (n - 2) * RH;
  const lensY = n >= 1 ? interpolate(f, [o + 4, o + 22], [y0, TOP + (n - 1) * RH], { ...CL, easing: ease }) : -400;
  const d = appear(f, o + 26, 12);
  const all = n === 0;
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(170deg, #26272A, #121314)">
      <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, background: "linear-gradient(115deg, #D9DCDF 0%, #B9BDC2 30%, #E4E6E8 52%, #AEB2B7 75%, #CFD2D5 100%)", borderRadius: 18, boxShadow: "0 30px 70px rgba(0,0,0,0.6), inset 0 0 0 3px rgba(255,255,255,0.4)" }}>
        <div style={{ position: "absolute", left: 70, top: 50, fontFamily: SANS, fontSize: 46, letterSpacing: 8, color: "#2A2C30" }}>{head}</div>
        {rows.map((r, i) => {
          const k = i + 1; const hit = k === n; const done = all ? appear(f, 8 + i * 9, 8) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 70, top: TOP - 110 + i * RH, width: 1260, height: RH - 14, display: "flex", alignItems: "center", gap: 26, borderBottom: "2px solid rgba(40,42,46,0.18)" }}>
              <div style={{ fontFamily: MONO, fontSize: 34, color: "rgba(30,32,36,0.55)", width: 70 }}>{String(k).padStart(2, "0")}</div>
              <div style={{ fontFamily: MONO, fontSize: hit ? 46 : 40, color: hit ? "#101114" : "rgba(30,32,36,0.72)" }}>{r}</div>
              {all ? <div style={{ marginLeft: "auto", width: 48, height: 48, borderRadius: 24, background: S.lime, opacity: done, transform: `scale(${0.6 + done * 0.4})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 34, color: S.ink }}>✓</div> : null}
            </div>
          );
        })}
      </div>
      {n >= 1 ? (
        <div style={{ position: "absolute", left: 1080, top: lensY + 30, width: 300, height: 300, borderRadius: 150, border: "22px solid #222", boxShadow: "0 20px 40px rgba(0,0,0,0.55), inset 0 0 40px rgba(255,255,255,0.35)", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0.05) 60%)" }}>
          <div style={{ position: "absolute", left: 230, top: 240, width: 190, height: 44, background: "linear-gradient(180deg, #3A2A1C, #1E140C)", transform: "rotate(45deg)", transformOrigin: "0 50%", borderRadius: 10 }} />
        </div>
      ) : null}
      {detail && n >= 1 ? (
        <div style={{ position: "absolute", left: 300, bottom: 50, padding: "14px 30px", background: S.lime, fontFamily: HAND, fontSize: 52, color: S.ink, opacity: d, transform: `translateY(${(1 - d) * 30}px) rotate(-1deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>{detail}</div>
      ) : null}
    </Stage>
  );
};

// ================= 3 · PANTALLA LCD de la estación (una o dos) =================
type Lcd = { label: string; v0: number; v1: number; unit: string; dec?: number; pct?: number; inW?: number; outW?: number; note?: string; bad?: boolean };
const LcdBox: React.FC<{ d: Lcd; f0: number; w?: number }> = ({ d, f0, w = 760 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [f0, f0 + 28], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const v = d.v0 + (d.v1 - d.v0) * p;
  const pct = d.pct ?? null;
  const blink = d.bad ? (Math.floor(f / 10) % 2 ? 1 : 0.35) : 1;
  return (
    <div style={{ width: w, padding: 26, background: "linear-gradient(180deg, #2A2B2E, #141517)", borderRadius: 26, boxShadow: "0 26px 60px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.08)" }}>
      <div style={{ fontFamily: SANS, fontSize: 34, letterSpacing: 6, color: "#C8CCD2", marginBottom: 14 }}>{d.label}</div>
      <div style={{ position: "relative", background: `linear-gradient(180deg, ${S.lcd}, #AEBB92)`, borderRadius: 10, padding: "20px 34px", boxShadow: "inset 0 4px 14px rgba(0,0,0,0.35)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, opacity: blink }}>
          <div style={{ fontFamily: MONO, fontSize: w > 700 ? 210 : 150, lineHeight: 1, color: d.bad ? "#5A1410" : S.lcdInk, letterSpacing: -4 }}>{fmt(v, d.dec ?? 0)}</div>
          <div style={{ fontFamily: MONO, fontSize: w > 700 ? 76 : 56, color: S.lcdInk }}>{d.unit}</div>
        </div>
        {pct !== null ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <div style={{ width: 300, height: 44, border: `5px solid ${S.lcdInk}`, borderRadius: 6, padding: 4, display: "flex", gap: 4 }}>
              {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ flex: 1, background: i < Math.round(pct / 10) ? S.lcdInk : "transparent" }} />)}
            </div>
            <div style={{ width: 10, height: 20, background: S.lcdInk }} />
          </div>
        ) : null}
        {(d.inW !== undefined || d.outW !== undefined) ? (
          <div style={{ display: "flex", gap: 40, marginTop: 12, fontFamily: MONO, fontSize: 42, color: S.lcdInk }}>
            {d.inW !== undefined ? <div>IN {d.inW} W</div> : null}{d.outW !== undefined ? <div>OUT {d.outW} W</div> : null}
          </div>
        ) : null}
      </div>
      {d.note ? <div style={{ fontFamily: HAND, fontSize: 46, color: "#EDE6D4", marginTop: 16 }}>{d.note}</div> : null}
    </div>
  );
};
export const Pantalla: React.FC<{ a: Lcd; b?: Lcd; fB?: number; verdict?: string; fV?: number; dur: number; seed: number; lf0?: number; prev?: any }> = ({ a, b, fB = 20, verdict, fV = 40, dur, seed, lf0 = 0, prev }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const o = lf0;
  const ia = o ? 1 : pop(f, 0, fps); const ib = prev && prev.b ? 1 : pop(f, o + fB, fps); const iv = appear(f, o + fV, 10);
  return (
    <Stage dur={dur} seed={seed} bg={concrete}>
      {b ? (
        <>
          <div style={{ position: "absolute", left: 140, top: 170, transform: `translateY(${(1 - ia) * 600}px) rotate(-1.5deg)` }}><LcdBox d={a} f0={o + 4} w={760} /></div>
          <div style={{ position: "absolute", right: 140, top: 210, transform: `translateY(${(1 - ib) * 700}px) rotate(1.5deg)` }}><LcdBox d={b} f0={o + fB + 4} w={760} /></div>
        </>
      ) : (
        <div style={{ position: "absolute", left: 560, top: 180, transform: `translateY(${(1 - ia) * 600}px)` }}><LcdBox d={a} f0={o + 4} w={800} /></div>
      )}
      {verdict ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: iv }}><span style={{ padding: "12px 36px", background: S.lime, fontFamily: SANS, fontSize: 60, letterSpacing: 2, color: S.ink, boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>{verdict}</span></div> : null}
    </Stage>
  );
};

// ================= 4 · PIZARRÓN en la puerta del refri: tiras magnéticas que se pegan + total a plumón =================
export type Tira = { t: string; r?: string; f: number; hi?: boolean; strike?: number };
export const Pizarra: React.FC<{ head: string; lines: Tira[]; total?: { t: string; r: string; f: number }; source?: string; dur: number; seed: number }> = ({ head, lines, total, source, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const fs = lines.length <= 3 ? 66 : lines.length <= 5 ? 56 : 46;
  return (
    <Stage dur={dur} seed={seed} bg={fridge} light={false}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 88%, rgba(0,0,0,0.12) 90%, rgba(255,255,255,0.4) 91%, rgba(0,0,0,0.06) 93%)" }} />
      <div style={{ position: "absolute", left: 1760, top: 200, width: 46, height: 620, borderRadius: 23, background: "linear-gradient(90deg, #BFC2C5, #F2F3F4 45%, #A9ADB1)", boxShadow: "-6px 6px 14px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", left: 180, top: 80, width: 1460, height: 900, background: "linear-gradient(160deg, #FFFFFF, #F1F2EF)", border: "14px solid #D8DADC", borderRadius: 8, boxShadow: "0 16px 34px rgba(0,0,0,0.22)" }}>
        <div style={{ position: "absolute", left: 60, top: 36, fontFamily: HAND, fontSize: 60, color: S.blue }}>{head}</div>
        <div style={{ position: "absolute", left: 60, top: 140, width: 1320 }}>
          {lines.map((l, i) => {
            const k = pop(f, l.f, fps, 11);
            const st = l.strike !== undefined ? appear(f, l.strike, 10) : 0;
            return (
              <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, padding: "10px 26px", background: l.hi ? S.lime : "#232426", color: l.hi ? S.ink : "#F2F0EA", fontFamily: SANS, fontSize: fs, letterSpacing: 1, borderRadius: 6, opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - k) * 120}px) rotate(${(i % 2 ? 0.6 : -0.5) * (1 - k * 0.6)}deg)`, boxShadow: "0 6px 12px rgba(0,0,0,0.25)" }}>
                <span>{l.t}</span>{l.r ? <span style={{ fontFamily: MONO }}>{l.r}</span> : null}
                {st > 0 ? <div style={{ position: "absolute", left: 14, top: "48%", height: 8, width: `calc(${st * 100}% - 28px)`, background: S.red, borderRadius: 4 }} /> : null}
              </div>
            );
          })}
          {total ? (() => {
            const w = appear(f, total.f, 16);
            return (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, paddingTop: 14, borderTop: `6px solid ${S.red}`, fontFamily: HAND, fontSize: fs * 1.35, color: S.red, clipPath: `inset(-20% ${(1 - w) * 100}% -20% 0)` }}>
                <span>{total.t}</span><span>{total.r}</span>
              </div>
            );
          })() : null}
        </div>
        {source ? <div style={{ position: "absolute", left: 60, bottom: 26, fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: "rgba(30,30,30,0.6)" }}>{source}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 1500, top: 50, width: 90, height: 90, borderRadius: 45, background: "radial-gradient(circle at 35% 30%, #F4D35E, #C99B1C)", boxShadow: "0 8px 14px rgba(0,0,0,0.3)" }} />
    </Stage>
  );
};

// ================= 5 · CURVA SOLAR: tiras de cinta aislante pegadas en cartón, una por hora =================
export const Curva: React.FC<{ bars: { h: string; v: number; f: number; bad?: boolean }[]; head: string; total?: { t: string; f: number }; dur: number; seed: number }> = ({ bars, head, total, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const MAXV = 160, H = 560, BW = 92;
  return (
    <Stage dur={dur} seed={seed} bg={kraft}>
      <div style={{ position: "absolute", left: 120, top: 60, fontFamily: SANS, fontSize: 52, letterSpacing: 6, color: "#2A1C0E" }}>{head}</div>
      <div style={{ position: "absolute", left: 150, top: 220, width: 1640, height: H, borderLeft: "5px solid #2A1C0E", borderBottom: "5px solid #2A1C0E" }}>
        {[50, 100, 150].map((g) => <div key={g} style={{ position: "absolute", left: 0, right: 0, bottom: (g / MAXV) * H, borderTop: "2px dashed rgba(42,28,14,0.35)" }}><span style={{ position: "absolute", left: -110, top: -24, fontFamily: HAND, fontSize: 38, color: "#3A2A18" }}>{g} W</span></div>)}
        {bars.map((b, i) => {
          const p = interpolate(f, [b.f, b.f + 10], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
          const lab = appear(f, b.f + 6, 8);
          const h = (b.v / MAXV) * H * p;
          return (
            <div key={i} style={{ position: "absolute", left: 30 + i * (BW + 42), bottom: 0, width: BW }}>
              <div style={{ position: "absolute", bottom: 0, width: BW, height: h, background: b.bad ? `linear-gradient(180deg, ${S.red}, #8E2019)` : "linear-gradient(90deg, #2B2C2E 0%, #0F1011 50%, #2A2B2D 100%)", boxShadow: "0 4px 8px rgba(0,0,0,0.35)" }}>
                <div style={{ position: "absolute", top: -6, left: -4, right: -4, height: 12, background: "rgba(20,20,20,0.85)", transform: "rotate(-3deg)" }} />
              </div>
              <div style={{ position: "absolute", bottom: h + 20, width: BW + 40, left: -20, textAlign: "center", fontFamily: HAND, fontSize: 44, color: b.bad ? S.red : "#1A120A", opacity: lab }}>{b.v}</div>
              <div style={{ position: "absolute", top: 14, width: BW + 40, left: -20, textAlign: "center", fontFamily: SANS, fontSize: 34, color: "#2A1C0E" }}>{b.h}</div>
            </div>
          );
        })}
      </div>
      {total ? <div style={{ position: "absolute", right: 130, top: 60, padding: "10px 30px", background: S.lime, fontFamily: SANS, fontSize: 64, color: S.ink, transform: `scale(${pop(f, total.f, fps)}) rotate(-2deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }}>{total.t}</div> : null}
    </Stage>
  );
};

// ================= 6 · ETIQUETA DE ANAQUEL amarilla, colgada del estante de metal =================
export const Anaquel: React.FC<{ head: string; rows: { a: string; b: string; f: number }[]; big?: string; fBig?: number; old?: string; fOld?: number; note?: string; dur: number; seed: number }> = ({ head, rows, big, fBig = 20, old, fOld = 14, note, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const sw = pop(f, 0, fps, 8);
  const rot = (1 - sw) * -18 + Math.sin(f / 18) * 0.6;
  const so = appear(f, fOld, 10);
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(180deg, #3B3E42 0%, #26282B 100%)">
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 70, background: "linear-gradient(180deg, #D9DCE0, #8C9096)", boxShadow: "0 12px 24px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: kraft, opacity: 0.9 }} />
      <div style={{ position: "absolute", left: 360, top: 170, width: 1200, minHeight: 640, background: `linear-gradient(180deg, #FAD43C, ${S.yellow})`, transformOrigin: "50% 0", transform: `rotate(${rot}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", padding: "40px 60px" }}>
        <div style={{ fontFamily: SANS, fontSize: 44, letterSpacing: 6, color: S.ink }}>{head}</div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 50, color: S.ink, marginTop: 18, opacity: appear(f, r.f, 8) }}><span>{r.a}</span><span style={{ fontFamily: MONO }}>{r.b}</span></div>
        ))}
        {old ? <div style={{ position: "relative", display: "inline-block", fontFamily: SANS, fontSize: 70, color: "rgba(23,24,26,0.6)", marginTop: 24 }}>{old}<div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 8, background: S.red, transform: `scaleX(${so}) rotate(-6deg)`, transformOrigin: "0 50%" }} /></div> : null}
        {big ? <div style={{ fontFamily: SANS, fontSize: 210, lineHeight: 1, color: S.ink, marginTop: 10, transform: `scale(${pop(f, fBig, fps)})`, transformOrigin: "0 50%" }}>{big}</div> : null}
        <div style={{ position: "absolute", right: 60, bottom: 40, width: 300, height: 90, background: "repeating-linear-gradient(90deg, #111 0 4px, transparent 4px 7px, #111 7px 9px, transparent 9px 14px, #111 14px 20px, transparent 20px 23px)" }} />
        {note ? <div style={{ position: "absolute", left: 60, bottom: 46, fontFamily: HAND, fontSize: 44, color: "#3A2A10" }}>{note}</div> : null}
      </div>
    </Stage>
  );
};

// ================= 7 · LÁMINA estampada atornillada a la barda de block (letras que se estampan) =================
export const Lamina: React.FC<{ kicker: string; big: string; sub?: string; fSub?: number; tone?: "warn" | "info"; source?: string; dur: number; seed: number }> = ({ kicker, big, sub, fSub = 24, tone = "warn", source, dur, seed }) => {
  const f = useCurrentFrame();
  const bg = tone === "warn" ? "linear-gradient(160deg, #D23C2E, #A8291F)" : "linear-gradient(160deg, #2E5FA8, #234A86)";
  const words = big.split(" ");
  const sb = appear(f, fSub, 12);
  return (
    <Stage dur={dur} seed={seed} bg={block}>
      <div style={{ position: "absolute", left: 230, top: 150, width: 1460, height: 780, background: bg, borderRadius: 22, boxShadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 0 0 10px rgba(255,255,255,0.14), inset 0 0 0 16px rgba(0,0,0,0.12)" }}>
        <Screw x={30} y={30} /><Screw x={1404} y={30} /><Screw x={30} y={724} /><Screw x={1404} y={724} />
        <div style={{ position: "absolute", left: 90, top: 80, fontFamily: SANS, fontSize: 44, letterSpacing: 8, color: "rgba(255,255,255,0.85)" }}>{kicker}</div>
        <div style={{ position: "absolute", left: 90, top: 170, width: 1280, fontFamily: SANS, fontSize: big.length > 30 ? 96 : 128, lineHeight: 1.06, color: "#FFFFFF", textShadow: "0 3px 0 rgba(0,0,0,0.25), 0 -2px 0 rgba(255,255,255,0.15)" }}>
          {words.map((w, i) => {
            const k = interpolate(f, [6 + i * 4, 12 + i * 4], [0, 1], CL);
            return <span key={i} style={{ display: "inline-block", marginRight: 26, opacity: k, transform: `scale(${1.5 - 0.5 * k})` }}>{w}</span>;
          })}
        </div>
        {sub ? <div style={{ position: "absolute", left: 90, bottom: source ? 110 : 80, width: 1280, fontFamily: SERIF, fontSize: 54, lineHeight: 1.15, color: "#FFF4E8", opacity: sb }}>{sub}</div> : null}
        {source ? <div style={{ position: "absolute", left: 90, bottom: 50, fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: "rgba(255,255,255,0.8)" }}>{source}</div> : null}
      </div>
    </Stage>
  );
};

// ================= 8 · CORCHO: la pregunta en un papelito clavado con tachuela =================
export const Corcho: React.FC<{ text: string; who?: string; kicker?: string; dur: number; seed: number }> = ({ text, who, kicker = "ME PREGUNTARON", dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, 2, fps, 9);
  const sw = (1 - k) * 14 + Math.sin(f / 22) * 0.8;
  return (
    <Stage dur={dur} seed={seed} bg={corkBg}>
      <div style={{ position: "absolute", left: 300, top: 120, width: 1320, minHeight: 700, background: "linear-gradient(180deg, #FFFDF6, #F3EEDF)", padding: "110px 90px 70px", transformOrigin: "50% 40px", transform: `rotate(${sw}deg) translateY(${(1 - k) * -200}px)`, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, background: "repeating-linear-gradient(90deg, transparent 0 40px, rgba(0,0,0,0.04) 40px 42px)" }} />
        <div style={{ position: "absolute", left: 640, top: 18, width: 54, height: 54, borderRadius: 27, background: "radial-gradient(circle at 35% 30%, #F26B5B, #A51E14)", boxShadow: "0 8px 12px rgba(0,0,0,0.4)" }} />
        <div style={{ fontFamily: SANS, fontSize: 40, letterSpacing: 8, color: S.red }}>{kicker}</div>
        <div style={{ fontFamily: HAND, fontSize: text.length > 70 ? 70 : 88, lineHeight: 1.15, color: "#1C2430", marginTop: 26 }}>«{text}»</div>
        {who ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: "#5A4A38", marginTop: 34 }}>— {who}</div> : null}
      </div>
    </Stage>
  );
};

// ================= 9 · RUEDA DEL DÍA: 24 horas, los turnos del refri como gajos de color =================
export const Rueda: React.FC<{ segs: { a: number; b: number; on: boolean }[]; hi: number; label?: string; foot?: string; fFoot?: number; dur: number; seed: number; lf0?: number; prev?: any }> = ({ segs, hi, label, foot, fFoot = 30, dur, seed, lf0 = 0, prev }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, 0, fps);
  const deg = (h: number) => (h / 24) * 360;
  const stops = segs.map((s) => `${s.on ? S.lime : "#33363B"} ${deg(s.a)}deg ${deg(s.b)}deg`).join(", ");
  const hand = hi >= 0 ? interpolate(f, [lf0 + 4, lf0 + 24], [prev && prev.hi >= 0 ? deg(prev.hi) : deg(hi) - 40, deg(hi)], { ...CL, easing: ease }) : -999;
  const ft = appear(f, lf0 + fFoot, 12);
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(170deg, #2B2D31, #17181A)">
      <div style={{ position: "absolute", left: 210, top: 90, width: 900, height: 900, borderRadius: 450, background: `conic-gradient(${stops})`, transform: `scale(${0.8 + 0.2 * k}) rotate(${(1 - k) * -30}deg)`, boxShadow: "0 30px 70px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: 150, top: 150, width: 600, height: 600, borderRadius: 300, background: "radial-gradient(circle, #F1ECE0, #DCD4C2)" }} />
        {Array.from({ length: 24 }).map((_, h) => (
          <div key={h} style={{ position: "absolute", left: 450, top: 450, width: 0, height: 0, transform: `rotate(${deg(h)}deg)` }}>
            <div style={{ position: "absolute", left: -2, top: -300, width: 4, height: h % 6 === 0 ? 30 : 14, background: "#3A3A3A" }} />
            {h % 3 === 0 ? <div style={{ position: "absolute", left: -40, top: -262, width: 80, textAlign: "center", fontFamily: SANS, fontSize: 36, color: "#2A2A2A", transform: `rotate(${-deg(h)}deg)` }}>{h}</div> : null}
          </div>
        ))}
        {hi >= 0 ? <div style={{ position: "absolute", left: 450, top: 450, width: 0, height: 0, transform: `rotate(${hand}deg)` }}><div style={{ position: "absolute", left: -7, top: -400, width: 14, height: 410, background: S.red, borderRadius: 7, boxShadow: "0 4px 8px rgba(0,0,0,0.4)" }} /></div> : null}
        <div style={{ position: "absolute", left: 420, top: 420, width: 60, height: 60, borderRadius: 30, background: S.ink }} />
      </div>
      <div style={{ position: "absolute", left: 1200, top: 260, width: 620 }}>
        <div style={{ fontFamily: SANS, fontSize: 46, letterSpacing: 6, color: S.lime }}>EL REFRI POR TURNOS</div>
        {label ? <div style={{ fontFamily: SERIF, fontSize: 84, lineHeight: 1.05, color: "#F3EFE6", marginTop: 20 }}>{label}</div> : null}
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 40, fontFamily: SANS, fontSize: 38, color: "#DAD5CA" }}><div style={{ width: 40, height: 40, background: S.lime }} />conectado<div style={{ width: 40, height: 40, background: "#33363B", marginLeft: 24, border: "2px solid #666" }} />descansa</div>
        {foot ? <div style={{ fontFamily: HAND, fontSize: 52, color: "#F4EFE4", marginTop: 40, opacity: ft }}>{foot}</div> : null}
      </div>
    </Stage>
  );
};

// ================= 10 · TERMÓMETRO de carátula del refri =================
export const Termo: React.FC<{ d0: number; d1: number; label: string; sub?: string; fSub?: number; dur: number; seed: number }> = ({ d0, d1, label, sub, fSub = 24, dur, seed }) => {
  const f = useCurrentFrame();
  const d = interpolate(f, [6, 34], [d0, d1], { ...CL, easing: ease });
  const ang = interpolate(d, [-10, 15], [-130, 130]);
  const s = appear(f, fSub, 12);
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(180deg, #E9EEF1 0%, #CBD5DB 100%)">
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, transparent 0 140px, rgba(150,160,170,0.5) 140px 146px)" }} />
      <div style={{ position: "absolute", left: 260, top: 120, width: 840, height: 840, borderRadius: 420, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E2E4E6 70%)", border: "26px solid #B9BEC3", boxShadow: "0 30px 60px rgba(0,0,0,0.35)" }}>
        <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: `conic-gradient(from -130deg, #6EA8D8 0deg ${((4 + 10) / 25) * 260}deg, ${S.red} ${((4 + 10) / 25) * 260}deg 260deg, transparent 260deg 360deg)`, WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 63%)", maskImage: "radial-gradient(circle, transparent 62%, black 63%)" }} />
        {[-10, -5, 0, 4, 10, 15].map((v) => {
          const a = interpolate(v, [-10, 15], [-130, 130]);
          return <div key={v} style={{ position: "absolute", left: 394, top: 394, width: 0, height: 0, transform: `rotate(${a}deg)` }}><div style={{ position: "absolute", left: -40, top: -300, width: 80, textAlign: "center", fontFamily: SANS, fontSize: 44, color: v === 4 ? S.red : "#2A2A2A", transform: `rotate(${-a}deg)` }}>{v}°</div></div>;
        })}
        <div style={{ position: "absolute", left: 394, top: 394, width: 0, height: 0, transform: `rotate(${ang}deg)` }}><div style={{ position: "absolute", left: -6, top: -260, width: 12, height: 290, background: S.ink, borderRadius: 6 }} /></div>
        <div style={{ position: "absolute", left: 364, top: 364, width: 60, height: 60, borderRadius: 30, background: S.ink }} />
      </div>
      <div style={{ position: "absolute", left: 1200, top: 300, width: 620 }}>
        <div style={{ fontFamily: SANS, fontSize: 46, letterSpacing: 5, color: "#24303A" }}>{label}</div>
        <div style={{ fontFamily: MONO, fontSize: 160, color: d > 4.05 ? S.red : "#1E2A33" }}>{fmt(d, 0)}°C</div>
        {sub ? <div style={{ fontFamily: SERIF, fontSize: 52, lineHeight: 1.15, color: "#1E2A33", opacity: s }}>{sub}</div> : null}
      </div>
    </Stage>
  );
};

// ================= 11 · BRÚJULA (sur / norte) y TRANSPORTADOR (inclinación) =================
export const Brujula: React.FC<{ mode: "sur" | "norte" | "incl"; dur: number; seed: number; lf0?: number; prev?: any }> = ({ mode, dur, seed, lf0 = 0, prev }) => {
  const f = useCurrentFrame();
  if (mode === "incl") {
    const a = interpolate(f, [6, 30], [0, 25], { ...CL, easing: ease });
    return (
      <Stage dur={dur} seed={seed} bg={concrete}>
        <div style={{ position: "absolute", left: 360, top: 780, width: 1200, height: 10, background: "#3A3631" }} />
        <div style={{ position: "absolute", left: 560, top: 180, width: 1200, height: 1200, borderRadius: 600, background: `conic-gradient(from 270deg, rgba(182,224,58,0.55) 0deg ${a}deg, transparent ${a}deg 90deg, transparent 90deg)`, transform: "translate(-600px, 0)", clipPath: "inset(0 0 50% 50%)" }} />
        <div style={{ position: "absolute", left: 560, top: 774, width: 900, height: 34, background: `linear-gradient(90deg, ${S.cell2}, ${S.cell})`, transformOrigin: "0 50%", transform: `rotate(${-a}deg)`, boxShadow: "0 8px 16px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 1100, top: 230, fontFamily: MONO, fontSize: 200, color: S.ink }}>{Math.round(a)}°</div>
        <div style={{ position: "absolute", left: 1100, top: 470, width: 700, fontFamily: SERIF, fontSize: 56, color: "#1E1E1E", opacity: appear(f, 30, 12) }}>Monterrey: latitud 25°</div>
      </Stage>
    );
  }
  const target = mode === "sur" ? 180 : 0;
  const n = interpolate(f, [lf0 + 4, lf0 + 26], [prev && prev.mode !== "incl" ? (prev.mode === "sur" ? 180 : 0) : target + 70, target], { ...CL, easing: Easing.out(Easing.back(1.6)) });
  return (
    <Stage dur={dur} seed={seed} bg={concrete}>
      <div style={{ position: "absolute", left: 300, top: 110, width: 860, height: 860, borderRadius: 430, background: "radial-gradient(circle at 40% 35%, #FBF7EE, #E3DBC8 75%)", border: "24px solid #6B4A2B", boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}>
        {["N", "E", "S", "O"].map((c, i) => <div key={c} style={{ position: "absolute", left: 386, top: 386, width: 0, height: 0, transform: `rotate(${i * 90}deg)` }}><div style={{ position: "absolute", left: -40, top: -360, width: 80, textAlign: "center", fontFamily: SANS, fontSize: 70, color: (mode === "sur" && c === "S") || (mode === "norte" && c === "N") ? S.red : "#2A2A2A", transform: `rotate(${-i * 90}deg)` }}>{c}</div></div>)}
        <div style={{ position: "absolute", left: 386, top: 386, width: 0, height: 0, transform: `rotate(${n}deg)` }}>
          <div style={{ position: "absolute", left: -26, top: -300, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderBottom: `300px solid ${S.red}` }} />
          <div style={{ position: "absolute", left: -26, top: 0, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "300px solid #3A3A3A" }} />
        </div>
        <div style={{ position: "absolute", left: 356, top: 356, width: 60, height: 60, borderRadius: 30, background: "#6B4A2B" }} />
      </div>
      <div style={{ position: "absolute", left: 1260, top: 330, width: 600 }}>
        <div style={{ fontFamily: SANS, fontSize: 46, letterSpacing: 6, color: "#1E1E1E" }}>{mode === "sur" ? "ARRIBA DEL ECUADOR" : "ABAJO DEL ECUADOR"}</div>
        <div style={{ fontFamily: SERIF, fontSize: 92, lineHeight: 1.05, color: "#141414", marginTop: 16 }}>el panel mira al {mode}</div>
        <div style={{ fontFamily: HAND, fontSize: 48, color: "#2A2A2A", marginTop: 24, opacity: appear(f, lf0 + 20, 10) }}>{mode === "sur" ? "México · Estados Unidos · Centroamérica" : "Argentina · Chile · Perú"}</div>
      </div>
    </Stage>
  );
};

// ================= 12 · RELOJ DE SOL: la sombra del panel gira y se acorta con la hora =================
export const RelojSol: React.FC<{ h: number; label: string; dur: number; seed: number; lf0?: number; prev?: any }> = ({ h, label, dur, seed, lf0 = 0, prev }) => {
  const f = useCurrentFrame();
  const sa = (x: number) => interpolate(x, [6, 12, 18], [-80, 0, 80]);
  const sunA = sa(h);
  const ang = interpolate(f, [lf0 + 4, lf0 + 26], [prev ? sa(prev.h) : sunA - 25, sunA], { ...CL, easing: ease });
  const len = 120 + Math.abs(ang) * 4.2;
  return (
    <Stage dur={dur} seed={seed} bg={concrete}>
      <div style={{ position: "absolute", left: 960, top: 600, width: 0, height: 0, transform: `rotate(${180 + ang}deg)` }}>
        <div style={{ position: "absolute", left: -110, top: 0, width: 220, height: len, background: "linear-gradient(180deg, rgba(30,28,25,0.55), rgba(30,28,25,0.12))", borderRadius: "0 0 40px 40px" }} />
      </div>
      <div style={{ position: "absolute", left: 960, top: 600, width: 0, height: 0, transform: `rotate(${ang}deg)` }}>
        <div style={{ position: "absolute", left: -220, top: -70, width: 440, height: 140, background: `linear-gradient(135deg, ${S.cell2}, ${S.cell})`, boxShadow: "0 10px 24px rgba(0,0,0,0.5)", backgroundSize: "auto" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 49%, rgba(220,225,235,0.5) 49%, rgba(220,225,235,0.5) 51%, transparent 51%)" }} />
        </div>
        <div style={{ position: "absolute", left: -60, top: -760, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle, #FFF6C8, #F7C933 60%, rgba(247,201,51,0) 72%)" }} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 70, padding: "16px 34px", background: S.ink, fontFamily: MONO, fontSize: 110, color: S.lime }}>{String(h).padStart(2, "0")}:00</div>
      <div style={{ position: "absolute", left: 90, top: 250, fontFamily: SERIF, fontSize: 70, color: "#141414" }}>{label}</div>
      <div style={{ position: "absolute", left: 90, bottom: 70, fontFamily: HAND, fontSize: 50, color: "#1E1E1E" }}>la sombra más chica = el panel bien puesto</div>
    </Stage>
  );
};

// ================= 13 · LA CAJA abierta desde arriba: 4 compartimentos; el que se nombra se marca con cinta lima =================
export const Caja: React.FC<{ k: number; items: string[]; inner?: string[]; dur: number; seed: number; lf0?: number }> = ({ k, items, inner, dur, seed, lf0 = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const flap = interpolate(f, [0, 16], [70, 0], { ...CL, easing: ease });
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(170deg, #6E4C2E, #4F3420)">
      <div style={{ position: "absolute", left: 260, top: 120, width: 1400, height: 840, background: kraft, boxShadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 0 0 14px rgba(80,50,22,0.5)", perspective: 1600 }}>
        <div style={{ position: "absolute", left: -10, top: -150, width: 1420, height: 160, background: kraft, transformOrigin: "50% 100%", transform: `rotateX(${flap}deg)`, boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", inset: 34, display: "grid", gridTemplateColumns: "1.3fr 1fr", gridTemplateRows: "1fr 1fr", gap: 22 }}>
          {items.map((t, i) => {
            const cur = i + 1 === k; const p = cur ? pop(f, lf0 + 8, fps) : 0;
            return (
              <div key={i} style={{ position: "relative", background: "linear-gradient(160deg, #8A6440, #6F4F31)", boxShadow: "inset 0 10px 24px rgba(0,0,0,0.45)", padding: 30, opacity: k === 0 || cur || i + 1 < k ? 1 : 0.45 }}>
                <div style={{ fontFamily: SANS, fontSize: 90, color: cur ? S.lime : "rgba(255,240,215,0.5)" }}>{i + 1}</div>
                <div style={{ fontFamily: SERIF, fontSize: 58, lineHeight: 1.08, color: "#FFF4E2", width: "92%" }}>{t}</div>
                {cur ? <div style={{ position: "absolute", left: -18, top: 22, width: 220, height: 44, background: S.lime, transform: `rotate(-12deg) scaleX(${p})`, transformOrigin: "0 50%", boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }} /> : null}
                {cur && inner ? (
                  <div style={{ marginTop: 20 }}>
                    {inner.map((x, j) => <div key={j} style={{ fontFamily: HAND, fontSize: 46, color: "#FFF4E2", opacity: appear(f, lf0 + 14 + j * 10, 8) }}>+ {x}</div>)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

// ================= 14 · CICLOS: cuadrícula que se llena como un calendario de recargas =================
export const Ciclos: React.FC<{ n: number; max?: number; label: string; sub?: string; dur: number; seed: number; lf0?: number; prev?: any }> = ({ n, max = 3000, label, sub, dur, seed, lf0 = 0, prev }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [lf0 + 4, lf0 + 40], [prev ? prev.n / max : 0, n / max], { ...CL, easing: Easing.out(Easing.cubic) });
  const COLS = 75, ROWS = 40, W = 1500, H = 800;
  const filledRows = p * ROWS;
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(170deg, #2B2D31, #17181A)">
      <div style={{ position: "absolute", left: 210, top: 200, width: W, height: H, background: "rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: (filledRows / ROWS) * H, background: `repeating-linear-gradient(90deg, ${S.lime} 0 ${W / COLS - 4}px, transparent ${W / COLS - 4}px ${W / COLS}px)` }} />
        <AbsoluteFill style={{ background: `repeating-linear-gradient(0deg, transparent 0 ${H / ROWS - 4}px, #17181A ${H / ROWS - 4}px ${H / ROWS}px)` }} />
      </div>
      <div style={{ position: "absolute", left: 210, top: 70, fontFamily: SANS, fontSize: 64, color: "#F2EEE4" }}>{label} <span style={{ fontFamily: MONO, color: S.lime }}>{fmt(Math.round(p * max))}</span></div>
      {sub ? <div style={{ position: "absolute", left: 210, bottom: 30, fontFamily: HAND, fontSize: 48, color: "#E6E0D2", opacity: appear(f, lf0 + 10, 12) }}>{sub}</div> : null}
    </Stage>
  );
};

// ================= 15 · BALANCE: dos garrafones; lo que entra (sol) y lo que sale (refri) =================
export const Balance: React.FC<{ a: { label: string; v: number }; b: { label: string; v: number }; max: number; fB?: number; verdict?: string; fV?: number; vs?: { f: number; t: string }[]; dur: number; seed: number }> = ({ a, b, max, fB = 14, verdict, fV = 40, vs, dur, seed }) => {
  const f = useCurrentFrame();
  const la = interpolate(f, [4, 30], [0, a.v / max], { ...CL, easing: ease });
  const lb = interpolate(f, [fB, fB + 26], [0, b.v / max], { ...CL, easing: ease });
  const Jug: React.FC<{ x: number; l: number; label: string; v: number; col: string }> = ({ x, l, label, v, col }) => (
    <div style={{ position: "absolute", left: x, top: 170, width: 520 }}>
      <div style={{ position: "relative", width: 420, height: 640, margin: "0 auto", borderRadius: "60px 60px 40px 40px", background: "rgba(220,235,245,0.18)", border: "8px solid rgba(220,235,245,0.55)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${l * 100}%`, background: col, opacity: 0.85 }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: `${l * 100}%`, height: 10, background: "rgba(255,255,255,0.5)" }} />
      </div>
      <div style={{ textAlign: "center", fontFamily: SANS, fontSize: 44, color: "#E9E4D8", marginTop: 20 }}>{label}</div>
      <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 72, color: "#FFFFFF" }}>{fmt(Math.round(v * Math.min(1, l / (v / max || 1))))} Wh</div>
    </div>
  );
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(170deg, #2B2D31, #17181A)">
      <Jug x={280} l={la} label={a.label} v={a.v} col={S.lime} />
      {fB < 9000 ? <Jug x={1120} l={lb} label={b.label} v={b.v} col="#E07B3A" /> : null}
      {(() => { const L = vs || (verdict ? [{ f: fV, t: verdict }] : []); const cur = [...L].reverse().find((x) => f >= x.f); if (!cur) return null; return <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", opacity: appear(f, cur.f, 8) }}><span style={{ padding: "10px 34px", background: S.lime, fontFamily: SANS, fontSize: 58, color: S.ink }}>{cur.t}</span></div>; })()}
    </Stage>
  );
};

// ================= 16 · COMPRESOR: 24 h en una tira de cinta; los tramos encendidos se pegan uno a uno =================
export const Compresor: React.FC<{ on: [number, number][]; label: string; sub?: string; dur: number; seed: number }> = ({ on, label, sub, dur, seed }) => {
  const f = useCurrentFrame();
  const W = 1640;
  return (
    <Stage dur={dur} seed={seed} bg={kraft}>
      <div style={{ position: "absolute", left: 140, top: 140, fontFamily: SANS, fontSize: 56, letterSpacing: 4, color: "#24180C" }}>{label}</div>
      <div style={{ position: "absolute", left: 140, top: 430, width: W, height: 150, background: "rgba(255,248,232,0.85)", boxShadow: "0 10px 20px rgba(0,0,0,0.25)" }}>
        {on.map(([a, b], i) => <div key={i} style={{ position: "absolute", left: (a / 24) * W, top: 20, width: ((b - a) / 24) * W, height: 110, background: "linear-gradient(180deg, #2B2C2E, #0F1011)", transform: `scaleX(${appear(f, 6 + i * 3, 6)})`, transformOrigin: "0 50%" }} />)}
        {[0, 6, 12, 18, 24].map((h) => <div key={h} style={{ position: "absolute", left: (h / 24) * W - 30, top: 170, width: 60, textAlign: "center", fontFamily: SANS, fontSize: 38, color: "#24180C" }}>{h}h</div>)}
      </div>
      {sub ? <div style={{ position: "absolute", left: 140, bottom: 160, fontFamily: HAND, fontSize: 60, color: "#1C140A", opacity: appear(f, 30, 12) }}>{sub}</div> : null}
    </Stage>
  );
};

// ================= 17 · ETIQUETA DE ENERGÍA (genérica, sin logos) =================
export const Energia: React.FC<{ mx?: boolean; kwh: number; sub?: string; dur: number; seed: number }> = ({ mx, kwh, sub, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, 0, fps);
  const v = Math.round(interpolate(f, [8, 30], [0, kwh], CL));
  return (
    <Stage dur={dur} seed={seed} bg={fridge} light={false}>
      <div style={{ position: "absolute", left: 620, top: 80, width: 680, height: 920, background: mx ? "#FFFFFF" : "linear-gradient(180deg, #FFE45C, #F7D637)", border: "6px solid #222", transform: `translateY(${(1 - k) * 300}px) rotate(-1deg)`, boxShadow: "0 24px 50px rgba(0,0,0,0.35)", padding: 40 }}>
        <div style={{ fontFamily: SANS, fontSize: 54, color: "#111" }}>{mx ? "EFICIENCIA ENERGÉTICA" : "ENERGY GUIDE"}</div>
        <div style={{ height: 6, background: "#111", margin: "16px 0 30px" }} />
        <div style={{ fontFamily: SANS, fontSize: 40, color: "#222" }}>Consumo de energía</div>
        <div style={{ border: "6px solid #111", padding: "20px 30px", marginTop: 16, background: mx ? "#F4F4F4" : "#FFF6B8" }}>
          <span style={{ fontFamily: MONO, fontSize: 170, color: "#111" }}>{v}</span><span style={{ fontFamily: SANS, fontSize: 52, color: "#111" }}> kWh/año</span>
        </div>
        {mx ? (
          <div style={{ marginTop: 40 }}>{[["#1C8C3A", 85], ["#6DB33F", 70], ["#E9D23A", 55], ["#E88A2E", 42], ["#D7372C", 30]].map(([c, w], i) => <div key={i} style={{ width: `${w}%`, height: 50, background: c as string, marginBottom: 10 }} />)}</div>
        ) : (
          <div style={{ marginTop: 50, height: 30, background: "linear-gradient(90deg, #111 0 2px, transparent 2px)", backgroundSize: "60px 30px", borderBottom: "6px solid #111" }} />
        )}
        <div style={{ position: "absolute", left: 40, bottom: 40, fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: "#333" }}>{mx ? "México · norma de eficiencia" : "Estados Unidos · etiqueta amarilla"}</div>
      </div>
      {sub ? <div style={{ position: "absolute", left: 120, bottom: 120, width: 420, fontFamily: HAND, fontSize: 52, color: "#222", opacity: appear(f, 26, 10) }}>{sub}</div> : null}
    </Stage>
  );
};

// ================= 18 · TRES ENCHUFES (pared, sol, auto): la entrada que se nombra se prende =================
export const Tres: React.FC<{ k: number; dur: number; seed: number; lf0?: number }> = ({ k, dur, seed, lf0 = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const L = [["PARED", "antes del apagón", "0 → 100 % en 1 h 30"], ["SOL", "durante", "600 – 845 Wh por día"], ["AUTO", "andando, en la calle", "≈ 100 Wh por hora"]];
  return (
    <Stage dur={dur} seed={seed} bg={block}>
      {L.map(([a, b, c], i) => {
        const on = k === 0 ? appear(f, lf0 + 6 + i * 8, 8) : i + 1 === k ? pop(f, lf0 + 4, fps) : 0;
        const dim = k !== 0 && i + 1 !== k;
        return (
          <div key={i} style={{ position: "absolute", left: 150 + i * 560, top: 200, width: 500, height: 680, background: "linear-gradient(170deg, #F4F1EA, #DCD6CA)", borderRadius: 22, boxShadow: "0 24px 50px rgba(0,0,0,0.45)", opacity: dim ? 0.45 : 1, padding: 40 }}>
            <div style={{ width: 160, height: 160, borderRadius: 80, margin: "30px auto", background: on > 0.3 ? `radial-gradient(circle, ${S.lime}, #6F9A12)` : "radial-gradient(circle, #BFB8AA, #8E877B)", boxShadow: on > 0.3 ? `0 0 ${40 * on}px ${S.lime}` : "none" }} />
            <div style={{ textAlign: "center", fontFamily: SANS, fontSize: 84, color: S.ink }}>{a}</div>
            <div style={{ textAlign: "center", fontFamily: SERIF, fontSize: 44, color: "#333", marginTop: 6 }}>{b}</div>
            <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 46, color: S.red, marginTop: 30, opacity: on }}>{c}</div>
          </div>
        );
      })}
    </Stage>
  );
};

// ================= 19 · GUARDARLA: tira de cinta de enmascarar en la puerta con las 5 reglas =================
export const Guarda: React.FC<{ k: number; rules: string[]; dur: number; seed: number; lf0?: number }> = ({ k, rules, dur, seed, lf0 = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <Stage dur={dur} seed={seed} bg="repeating-linear-gradient(90deg, rgba(60,35,15,0.10) 0 3px, transparent 3px 26px), linear-gradient(180deg, #8B6440, #6C4A2C)">
      <div style={{ position: "absolute", left: 1500, top: 470, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 35% 30%, #E8D9A8, #A88C45)", boxShadow: "0 10px 18px rgba(0,0,0,0.45)" }} />
      {rules.map((r, i) => {
        const cur = i + 1 === k; const p = cur ? pop(f, lf0 + 2, fps) : 1;
        const show = i + 1 <= k;
        if (!show) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 200, top: 110 + i * 170, width: 1180, padding: "18px 40px", background: "linear-gradient(180deg, rgba(240,226,180,0.98), rgba(222,204,150,0.98))", transform: `rotate(${(i % 2 ? 0.8 : -0.7)}deg) scaleX(${p})`, transformOrigin: "0 50%", boxShadow: "0 6px 12px rgba(0,0,0,0.3)", opacity: cur ? 1 : 0.7 }}>
            <span style={{ fontFamily: SANS, fontSize: 48, color: cur ? S.red : "#3A2A18", marginRight: 26 }}>{i + 1}</span>
            <span style={{ fontFamily: HAND, fontSize: 62, color: "#1E1A14" }}>{r}</span>
          </div>
        );
      })}
    </Stage>
  );
};

// ================= 20 · RANGO: regla de carpintero con la zona marcada =================
export const Rango: React.FC<{ a: number; b: number; lo: number; hi: number; unit: string; label: string; sub?: string; fSub?: number; dur: number; seed: number }> = ({ a, b, lo, hi, unit, label, sub, fSub = 28, dur, seed }) => {
  const f = useCurrentFrame();
  const W = 1600; const x = (v: number) => ((v - lo) / (hi - lo)) * W;
  const p = appear(f, 8, 18);
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(170deg, #6E4C2E, #4F3420)">
      <div style={{ position: "absolute", left: 160, top: 120, fontFamily: SANS, fontSize: 52, letterSpacing: 4, color: "#F6EEDC" }}>{label}</div>
      <div style={{ position: "absolute", left: 160, top: 380, width: W, height: 170, background: "linear-gradient(180deg, #F2D26A, #D9B13C)", boxShadow: "0 16px 30px rgba(0,0,0,0.45)" }}>
        {Array.from({ length: 41 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i / 40) * W, top: 0, width: 3, height: i % 5 === 0 ? 70 : 34, background: "#2A1C0A" }} />)}
        {Array.from({ length: 9 }).map((_, i) => { const v = lo + ((hi - lo) / 8) * i; return <div key={i} style={{ position: "absolute", left: x(v) - 50, top: 80, width: 100, textAlign: "center", fontFamily: SANS, fontSize: 36, color: "#2A1C0A" }}>{Math.round(v)}</div>; })}
        <div style={{ position: "absolute", left: x(a), top: -30, width: (x(b) - x(a)) * p, height: 230, background: "rgba(182,224,58,0.45)", border: `5px solid ${S.lime}` }} />
      </div>
      <div style={{ position: "absolute", left: 160 + x(a), top: 640, fontFamily: MONO, fontSize: 90, color: "#FFFFFF", opacity: p }}>{a} – {b} {unit}</div>
      {sub ? <div style={{ position: "absolute", left: 160, bottom: 90, fontFamily: HAND, fontSize: 58, color: "#F6EEDC", opacity: appear(f, fSub, 12) }}>{sub}</div> : null}
    </Stage>
  );
};

// ================= 21 · MAPA de papel doblado con la tachuela en Monterrey =================
export const Mapa: React.FC<{ place: string; sub?: string; dur: number; seed: number }> = ({ place, sub, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pin = pop(f, 10, fps, 9);
  const z = interpolate(f, [0, dur], [1.0, 1.25], { ...CL, easing: ease });
  return (
    <Stage dur={dur} seed={seed} bg="linear-gradient(170deg, #3B3E42, #26282B)">
      <div style={{ position: "absolute", left: 160, top: 80, width: 1600, height: 920, transform: `scale(${z})`, transformOrigin: "58% 46%", background: "linear-gradient(90deg, rgba(0,0,0,0.06) 0 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.06) 0 1px, transparent 1px), linear-gradient(160deg, #EFE6CF, #E1D5B7)", backgroundSize: "60px 60px, 60px 60px, 100% 100%", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
        <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 33%, rgba(0,0,0,0.10) 33.2%, transparent 33.6%, transparent 66.4%, rgba(0,0,0,0.10) 66.6%, transparent 67%), linear-gradient(0deg, transparent 49.6%, rgba(0,0,0,0.10) 50%, transparent 50.4%)" }} />
        {[[200, 300, 1300, 40, 8], [500, 120, 40, 800, 6], [900, 80, 30, 900, 5], [100, 620, 1500, 30, 6], [1200, 200, 34, 700, 5]].map(([l, t, w, h, b], i) => <div key={i} style={{ position: "absolute", left: l, top: t, width: w, height: h, background: i % 2 ? "#D9A441" : "#C8C0AA", border: `${b}px solid rgba(120,90,40,0.35)`, transform: `rotate(${(i - 2) * 9}deg)` }} />)}
        <div style={{ position: "absolute", left: 640, top: 210, width: 520, height: 300, borderRadius: "48% 52% 40% 60%", background: "rgba(130,110,80,0.18)" }} />
        <div style={{ position: "absolute", left: 900, top: 360 - (1 - pin) * 300, opacity: Math.min(1, pin * 2) }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: "radial-gradient(circle at 35% 30%, #F26B5B, #A51E14)", boxShadow: "0 8px 12px rgba(0,0,0,0.4)" }} />
          <div style={{ width: 6, height: 50, background: "#666", marginLeft: 27 }} />
        </div>
        <div style={{ position: "absolute", left: 990, top: 360, padding: "8px 26px", background: S.ink, fontFamily: SANS, fontSize: 56, color: "#F2EEE4", opacity: appear(f, 20, 10) }}>{place}</div>
        {sub ? <div style={{ position: "absolute", left: 990, top: 450, fontFamily: HAND, fontSize: 46, color: "#2A1C0E", opacity: appear(f, 28, 10) }}>{sub}</div> : null}
      </div>
    </Stage>
  );
};

// ================= 22 · POLAROID de la tía (recuerdo como objeto físico, sobre la puerta del congelador) =================
export const Recuerdo: React.FC<{ img: string; caption: string; dur: number; seed: number }> = ({ img, caption, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, 2, fps, 10);
  const dev = interpolate(f, [6, 46], [0, 1], CL);
  return (
    <Stage dur={dur} seed={seed} bg={fridge} light={false}>
      <div style={{ position: "absolute", left: 520, top: 90, width: 880, padding: "40px 40px 150px", background: "#FBF9F3", transform: `rotate(${-3 + (1 - k) * 12}deg) translateY(${(1 - k) * -500}px)`, boxShadow: "0 30px 60px rgba(0,0,0,0.35)" }}>
        <div style={{ position: "relative", width: 800, height: 600, background: "#2A2622", overflow: "hidden" }}>
          <Img src={staticFile(img)} style={{ width: 800, height: 600, objectFit: "cover", opacity: dev }} />
          <AbsoluteFill style={{ background: "rgba(245,230,200,0.25)", opacity: 1 - dev * 0.6 }} />
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 40, fontFamily: HAND, fontSize: 60, color: "#2A2620" }}>{caption}</div>
        <div style={{ position: "absolute", left: 360, top: -40, width: 110, height: 110, borderRadius: 55, background: "radial-gradient(circle at 35% 30%, #5FA8E8, #1F5FA0)", boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }} />
      </div>
    </Stage>
  );
};

// ================= 23 · PRÓXIMO VIDEO: nota pegada con imán en la puerta del refri =================
export const ProximoRefri: React.FC<{ title: string; img: string; dur: number; seed: number }> = ({ title, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, 4, fps, 11);
  return (
    <AbsoluteFill style={{ background: S.ink, opacity: fadeIO(f, dur) }}>
      <AbsoluteFill style={{ overflow: "hidden" }}><Img src={staticFile(img)} style={{ width: 1920, height: 1080, objectFit: "cover", transform: `scale(${interpolate(f, [0, dur], [1.05, 1.15])})` }} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(14,15,17,0.15), rgba(14,15,17,0.75))" }} />
      <div style={{ position: "absolute", right: 150, top: 200, width: 760, padding: "70px 60px", background: "#FFFDF6", transform: `rotate(${2 + (1 - k) * 10}deg) translateX(${(1 - k) * 600}px)`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 330, top: -40, width: 100, height: 100, borderRadius: 50, background: `radial-gradient(circle at 35% 30%, #D8F07A, #7FA41A)` }} />
        <div style={{ fontFamily: SANS, fontSize: 44, letterSpacing: 8, color: S.red }}>EL PRÓXIMO VIDEO</div>
        <div style={{ fontFamily: SERIF, fontSize: 70, lineHeight: 1.08, color: "#141414", marginTop: 20 }}>{title}</div>
        <div style={{ fontFamily: HAND, fontSize: 54, color: "#2A2620", marginTop: 26 }}>¿llega o no llega?</div>
      </div>
    </AbsoluteFill>
  );
};
