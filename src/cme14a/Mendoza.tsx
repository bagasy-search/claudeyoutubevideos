// Piezas propias de Claudio Mendoza · look "cuaderno cuadriculado, cartón de caja de batería, cinta aislante y verde lima".
// PURO CSS y DOM: papel, cartón, plástico, acero y madera con gradientes. Sin SVG sobre fotos, sin blur, sin filtros.
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
export const M = { bone: "#EFE9DC", bone2: "#E2D9C6", ink: "#17181A", lime: "#B6E03A", red: "#C8352B", card: "#B48A5A", card2: "#9C7346", grey: "#6E6A62", lcd: "#B9C6A2", blue: "#2F5C9E" };
const fadeIO = (f: number, dur: number, a = 8, b = 8) => interpolate(f, [0, a, dur - b, dur], [0, 1, 1, 0], CL);
const pop = (f: number, f0: number, fps: number) => spring({ frame: f - f0, fps, config: { damping: 14, stiffness: 140 } });

// ---------- materiales
const woodBg = `repeating-linear-gradient(91deg, rgba(40,22,10,0.16) 0px, rgba(40,22,10,0) 9px, rgba(255,226,180,0.06) 16px, rgba(40,22,10,0.12) 27px), linear-gradient(180deg, #7B5434 0%, #5E3D22 100%)`;
const gridBg = `linear-gradient(rgba(70,110,170,0.20) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(70,110,170,0.20) 1.5px, transparent 1.5px), linear-gradient(180deg, #F6F3EA, #ECE6D8)`;
const cardBg = `repeating-linear-gradient(90deg, rgba(70,40,15,0.10) 0px, rgba(70,40,15,0.10) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 9px), linear-gradient(170deg, ${M.card} 0%, ${M.card2} 100%)`;
const pegBg = `radial-gradient(circle at 50% 50%, rgba(40,25,12,0.55) 0 5px, transparent 6px), linear-gradient(180deg, #C9A57A, #B8915F)`;

// cámara en mano lenta: vaivén suave (sin temblor)
const Sway: React.FC<{ dur: number; seed?: number; children: React.ReactNode; z0?: number; z1?: number }> = ({ dur, seed = 0, children, z0 = 1.0, z1 = 1.05 }) => {
  const f = useCurrentFrame();
  const r = Math.sin((f + seed * 37) / 46) * 0.35;
  const x = Math.sin((f + seed * 11) / 61) * 6;
  const y = Math.cos((f + seed * 7) / 53) * 4;
  const s = interpolate(f, [0, dur], [z0, z1]);
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})` }}>{children}</AbsoluteFill>;
};
const Desk: React.FC<{ dur: number; seed?: number; children: React.ReactNode; bg?: string }> = ({ dur, seed = 0, children, bg = woodBg }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: M.ink, opacity: fadeIO(f, dur, 6, 6) }}>
      <Sway dur={dur} seed={seed}>
        <AbsoluteFill style={{ background: bg }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 1200px 700px at 40% 35%, rgba(255,236,200,0.22), rgba(0,0,0,0) 70%)" }} />
        {children}
      </Sway>
    </AbsoluteFill>
  );
};
// cinta aislante negra
const ETape: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 170, height: 40, background: "linear-gradient(180deg, #2B2C2E 0%, #121314 55%, #1E1F21 100%)", boxShadow: "0 3px 6px rgba(0,0,0,0.35)", borderRadius: 2, ...style }} />
);
// cinta de enmascarar
const MTape: React.FC<{ style: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", padding: "6px 22px", background: "linear-gradient(180deg, rgba(240,226,180,0.96), rgba(222,204,150,0.96))", boxShadow: "0 3px 7px rgba(0,0,0,0.25)", fontFamily: HAND, color: "#2B2420", ...style }}>{children}</div>
);
// lápiz que escribe: aparece de izquierda a derecha
const Write: React.FC<{ f0: number; len?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f0, len = 14, children, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [f0, f0 + len], [0, 1], { ...CL, easing: ease });
  return <div style={{ clipPath: `inset(-25% ${(1 - p) * 100 - p * 12}% -25% 0)`, ...style }}>{children}</div>;
};
// resaltador verde lima que pasa por detrás
const Hi: React.FC<{ f0: number; children: React.ReactNode; color?: string }> = ({ f0, children, color = M.lime }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [f0, f0 + 10], [0, 100], CL);
  return <span style={{ backgroundImage: `linear-gradient(90deg, ${color}CC ${p}%, transparent ${p}%)`, padding: "0 8px", borderRadius: 4 }}>{children}</span>;
};

// ---------- 1 · PASO N DE 12: solapa de cartón de la caja de la batería, cinta aislante, foto clavada
export const PasoCard: React.FC<{ n: number; title: string; sub?: string; img?: string; dur: number; seed: number }> = ({ n, title, sub, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = pop(f, 2, fps); const ph = pop(f, 12, fps);
  return (
    <Desk dur={dur} seed={seed}>
      <div style={{ position: "absolute", left: 150, top: 150 + (1 - inn) * 500, width: 980, height: 760, background: cardBg, boxShadow: "0 30px 60px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(60,35,12,0.25)", transform: `rotate(${-1.5 + (seed % 3)}deg)` }}>
        <div style={{ position: "absolute", left: 60, top: 70, fontFamily: SANS, fontSize: 64, letterSpacing: 6, color: "rgba(25,18,10,0.82)" }}>PASO</div>
        <div style={{ position: "absolute", left: 50, top: 120, fontFamily: SANS, fontSize: 300, lineHeight: 1, color: M.ink, fontWeight: 700 }}>{n}<span style={{ fontSize: 110, color: "rgba(25,18,10,0.55)" }}> / 12</span></div>
        <div style={{ position: "absolute", left: 60, top: 470, width: 860, fontFamily: SERIF, fontSize: 64, lineHeight: 1.08, color: "#1A120A" }}>{title}</div>
        {sub ? <div style={{ position: "absolute", left: 62, top: 650, fontFamily: HAND, fontSize: 44, color: "#2A1C0E" }}>{sub}</div> : null}
        <div style={{ position: "absolute", right: 50, top: 80, display: "flex", gap: 10 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: i < n ? M.lime : "rgba(30,20,10,0.25)", boxShadow: i === n - 1 ? `0 0 0 ${3 + 3 * Math.sin(f / 5)}px rgba(182,224,58,0.5)` : "none" }} />
          ))}
        </div>
        <ETape style={{ left: -40, top: 30, transform: "rotate(-24deg)" }} />
        <ETape style={{ right: -50, bottom: 40, transform: "rotate(-18deg)" }} />
      </div>
      {img ? (
        <div style={{ position: "absolute", right: 120, top: 240 + (1 - ph) * 600, width: 640, background: "#F4F1E8", padding: "20px 20px 70px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", transform: `rotate(${3 - (seed % 2) * 2}deg)` }}>
          <Img src={staticFile(img)} style={{ width: 600, height: 400, objectFit: "cover" }} />
          <MTape style={{ left: 220, top: -22, transform: "rotate(-3deg)", width: 120, height: 26, padding: 0 }} />
        </div>
      ) : null}
    </Desk>
  );
};

// ---------- 2 · CUADERNO cuadriculado con la cuenta a lápiz
export type Ln = { t: string; r?: string; f: number; hi?: boolean; strike?: number; big?: boolean };
export const Cuaderno: React.FC<{ head: string; lines: Ln[]; total?: { t: string; r: string; f: number }; source?: string; dur: number; seed: number }> = ({ head, lines, total, source, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = pop(f, 0, fps);
  const big = lines.length <= 4;
  const fs = big ? 66 : lines.length <= 6 ? 56 : 46;
  return (
    <Desk dur={dur} seed={seed}>
      <div style={{ position: "absolute", left: 230, top: 70 + (1 - inn) * 400, width: 1460, height: 960, background: gridBg, backgroundSize: "44px 44px, 44px 44px, 100% 100%", boxShadow: "0 30px 70px rgba(0,0,0,0.5)", transform: `rotate(${seed % 2 ? -0.8 : 0.7}deg)` }}>
        <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "rgba(200,60,50,0.55)" }} />
        {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: -18, top: 70 + i * 100, width: 36, height: 36, borderRadius: 18, background: "#4A3424", boxShadow: "inset 0 3px 4px rgba(0,0,0,0.6)" }} />)}
        <div style={{ position: "absolute", left: 160, top: 50, fontFamily: SANS, fontSize: 46, letterSpacing: 3, color: M.ink }}>{head}</div>
        <div style={{ position: "absolute", left: 160, top: 140, width: 1200 }}>
          {lines.map((l, i) => {
            const st = l.strike !== undefined ? interpolate(f, [l.strike, l.strike + 10], [0, 100], CL) : 0;
            return (
              <Write key={i} f0={l.f} len={16} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: HAND, fontSize: l.big ? fs * 1.35 : fs, color: "#20262E", lineHeight: 1.32, position: "relative" }}>
                <span>{l.hi ? <Hi f0={l.f + 14}>{l.t}</Hi> : l.t}</span>
                {l.r ? <span style={{ fontFamily: HAND, color: "#1B2A44" }}>{l.r}</span> : null}
                {st > 0 ? <div style={{ position: "absolute", left: 0, top: "52%", height: 6, width: `${st}%`, background: M.red, borderRadius: 3 }} /> : null}
              </Write>
            );
          })}
          {total ? (
            <Write f0={total.f} len={18} style={{ marginTop: 18, paddingTop: 12, borderTop: "5px double #1B2A44", display: "flex", justifyContent: "space-between", fontFamily: HAND, fontSize: fs * 1.3, color: "#11161C" }}>
              <span>{total.t}</span><Hi f0={total.f + 18}>{total.r}</Hi>
            </Write>
          ) : null}
        </div>
        {source ? <div style={{ position: "absolute", left: 160, bottom: 36, fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: "rgba(30,30,30,0.7)" }}>{source}</div> : null}
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 120, width: 420, height: 26, borderRadius: 13, background: "linear-gradient(180deg, #F0C84A, #D7A92A)", transform: "rotate(-28deg)", boxShadow: "0 8px 16px rgba(0,0,0,0.4)" }}>
        <div style={{ position: "absolute", right: -40, top: 2, width: 0, height: 0, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: "40px solid #E8C9A0" }} />
      </div>
    </Desk>
  );
};

// ---------- 3 · TICKET de ferretería (papel térmico)
export const Ticket: React.FC<{ head: string; lines: { a: string; b: string; f: number }[]; total?: string; fTotal?: number; note?: string; dur: number; seed: number }> = ({ head, lines, total, fTotal = 0, note, dur, seed }) => {
  const f = useCurrentFrame();
  const up = interpolate(f, [0, 22], [900, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <Desk dur={dur} seed={seed}>
      <div style={{ position: "absolute", left: 600, top: 90, width: 720, transform: `translateY(${up}px) rotate(${seed % 2 ? 1.2 : -1.1}deg)`, background: "linear-gradient(180deg, #FBFAF6, #F0EEE6)", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", padding: "50px 56px 70px", fontFamily: MONO, color: "#222" }}>
        <div style={{ textAlign: "center", fontSize: 40, letterSpacing: 4 }}>FERRETERÍA · CAJA 2</div>
        <div style={{ textAlign: "center", fontSize: 30, opacity: 0.7, marginBottom: 24 }}>{head}</div>
        <div style={{ borderTop: "3px dashed #999", marginBottom: 20 }} />
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 40, lineHeight: 1.5, opacity: interpolate(f, [l.f, l.f + 6], [0, 1], CL), transform: `translateX(${interpolate(f, [l.f, l.f + 8], [-20, 0], CL)}px)` }}>
            <span>{l.a}</span><span>{l.b}</span>
          </div>
        ))}
        {total ? (
          <div style={{ marginTop: 24, borderTop: "3px dashed #999", paddingTop: 18, display: "flex", justifyContent: "space-between", fontSize: 54, opacity: interpolate(f, [fTotal, fTotal + 6], [0, 1], CL) }}>
            <span>TOTAL</span><span style={{ background: M.lime, padding: "0 10px" }}>{total}</span>
          </div>
        ) : null}
        {note ? <div style={{ marginTop: 26, fontFamily: HAND, fontSize: 42, color: M.blue, transform: "rotate(-2deg)" }}>{note}</div> : null}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -18, height: 20, background: "linear-gradient(135deg, #F0EEE6 25%, transparent 25%) -10px 0/20px 20px, linear-gradient(225deg, #F0EEE6 25%, transparent 25%) -10px 0/20px 20px" }} />
      </div>
    </Desk>
  );
};

// ---------- 4 · MEDIDOR de enchufe con pantalla LCD
export const Medidor: React.FC<{ reads: { v: string; f: number; u?: string }[]; label: string; sub?: string; fSub?: number; dur: number; seed: number }> = ({ reads, label, sub, fSub = 0, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const cur = [...reads].reverse().find((r) => f >= r.f) || reads[0];
  const k = reads.indexOf(cur);
  const blink = f - cur.f < 6 && k > 0 ? 0.35 : 1;
  const inn = pop(f, 0, fps);
  return (
    <Desk dur={dur} seed={seed} bg={`linear-gradient(180deg, #E9E6DE 0%, #D8D3C7 100%)`}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(120,115,105,0.35) 3px, transparent 3px), linear-gradient(90deg, rgba(120,115,105,0.35) 3px, transparent 3px)", backgroundSize: "240px 240px" }} />
      <div style={{ position: "absolute", left: 360, top: 120, width: 760, height: 860, borderRadius: 60, transform: `scale(${0.85 + 0.15 * inn}) rotate(${seed % 2 ? -2 : 2}deg)`, background: "linear-gradient(160deg, #F7F6F2 0%, #DCDAD2 60%, #C9C6BC 100%)", boxShadow: "0 40px 80px rgba(0,0,0,0.35), inset 0 -10px 20px rgba(0,0,0,0.12), inset 0 8px 14px rgba(255,255,255,0.8)" }}>
        <div style={{ position: "absolute", left: 80, top: 90, width: 600, height: 330, borderRadius: 18, background: `linear-gradient(180deg, #C6D2AE, ${M.lcd})`, boxShadow: "inset 0 6px 14px rgba(0,0,0,0.35)", padding: "24px 30px" }}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: "rgba(20,30,10,0.6)", letterSpacing: 3 }}>{label}</div>
          <div style={{ fontFamily: MONO, fontSize: 170, color: "#1C2612", textAlign: "right", lineHeight: 1.1, opacity: blink }}>{cur.v}</div>
          <div style={{ fontFamily: MONO, fontSize: 52, color: "#1C2612", textAlign: "right" }}>{cur.u ?? "W"}</div>
        </div>
        {["FUNC", "SET", "W/kWh"].map((b, i) => <div key={b} style={{ position: "absolute", top: 480, left: 110 + i * 190, width: 150, height: 74, borderRadius: 37, background: "linear-gradient(180deg, #8A8F96, #5E636A)", boxShadow: "0 6px 0 #3E4247", color: "#EEE", fontFamily: SANS, fontSize: 26, textAlign: "center", lineHeight: "74px" }}>{b}</div>)}
        <div style={{ position: "absolute", left: 290, top: 620, width: 180, height: 180, borderRadius: 90, background: "radial-gradient(circle, #E8E6DF 0 55%, #CFCcc2 56%)", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.3)" }}>
          <div style={{ position: "absolute", left: 50, top: 60, width: 18, height: 52, borderRadius: 6, background: "#2B2B2B" }} />
          <div style={{ position: "absolute", right: 50, top: 60, width: 18, height: 52, borderRadius: 6, background: "#2B2B2B" }} />
        </div>
      </div>
      {sub ? <div style={{ position: "absolute", left: 1200, top: 380, width: 620, fontFamily: HAND, fontSize: 64, color: M.ink, transform: `rotate(-2deg)`, opacity: interpolate(f, [fSub, fSub + 8], [0, 1], CL) }}><Write f0={fSub} len={20}>{sub}</Write></div> : null}
    </Desk>
  );
};

// ---------- 5 · AVISO impreso en la pared (fuente oficial / rumor / alerta)
export const Aviso: React.FC<{ kicker: string; big: string; sub?: string; source?: string; stamp?: string; fStamp?: number; tone?: "info" | "warn" | "rumor"; fSub?: number; dur: number; seed: number }> = ({ kicker, big, sub, source, stamp, fStamp = 30, tone = "info", fSub = 10, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = pop(f, 0, fps); const sp = pop(f, fStamp, fps);
  const band = tone === "warn" ? M.red : tone === "rumor" ? "#3A3A3A" : M.ink;
  return (
    <Desk dur={dur} seed={seed} bg={`linear-gradient(180deg, #CFC8B8, #BDB5A3)`}>
      <div style={{ position: "absolute", left: 260, top: 90, width: 1400, height: 900, transform: `translateY(${(1 - inn) * -200}px) rotate(${seed % 2 ? 0.8 : -0.9}deg)`, background: "linear-gradient(180deg, #FAF8F2, #EEEAE0)", boxShadow: "0 30px 70px rgba(0,0,0,0.4)" }}>
        <div style={{ height: 120, background: band, color: tone === "warn" ? "#FFF" : M.lime, fontFamily: SANS, fontSize: 52, letterSpacing: 5, paddingLeft: 70, lineHeight: "120px" }}>{kicker}</div>
        <div style={{ padding: "60px 70px 0", fontFamily: SERIF, fontSize: big.length > 40 ? 86 : 112, lineHeight: 1.04, color: M.ink }}>{big}</div>
        {sub ? <div style={{ padding: "34px 70px 0", fontFamily: SANS, fontWeight: 300, fontSize: 50, lineHeight: 1.25, color: "#3A3A3A", opacity: interpolate(f, [fSub, fSub + 10], [0, 1], CL) }}>{sub}</div> : null}
        {source ? <div style={{ position: "absolute", left: 70, bottom: 46, fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: "#555" }}>{source}</div> : null}
        {stamp ? <div style={{ position: "absolute", right: 90, bottom: 150, padding: "14px 34px", border: `8px solid ${M.red}`, color: M.red, fontFamily: SANS, fontSize: 90, letterSpacing: 6, transform: `rotate(-12deg) scale(${2.4 - 1.4 * sp})`, opacity: Math.min(1, sp * 1.5), borderRadius: 10 }}>{stamp}</div> : null}
        <ETape style={{ left: -30, top: -14, transform: "rotate(-14deg)" }} />
        <ETape style={{ right: -36, top: -10, transform: "rotate(12deg)" }} />
      </div>
    </Desk>
  );
};

// ---------- 6 · RECORTES de diario clavados uno tras otro
export const Recortes: React.FC<{ items: { date: string; place: string; note: string; f: number }[]; dur: number; seed: number }> = ({ items, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <Desk dur={dur} seed={seed} bg={pegBg}>
      <AbsoluteFill style={{ backgroundSize: "60px 60px" }} />
      {items.map((it, i) => {
        const p = pop(f, it.f, fps);
        const x = 120 + (i % 2) * 860, y = 90 + Math.floor(i / 2) * 470;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 800, height: 400, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px) rotate(${[-2, 1.5, 1, -1.6][i % 4]}deg)`, background: "linear-gradient(180deg, #ECE7DA, #DCD5C3)", boxShadow: "0 18px 40px rgba(0,0,0,0.4)", padding: "36px 44px", clipPath: "polygon(0 2%, 4% 0, 30% 1.5%, 60% 0, 100% 2%, 99% 40%, 100% 98%, 70% 100%, 35% 98.5%, 2% 100%, 0 60%)" }}>
            <div style={{ fontFamily: SANS, fontSize: 40, letterSpacing: 3, color: M.red }}>{it.date}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: M.ink, marginTop: 10 }}>{it.place}</div>
            <div style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1.2, color: "#3A352C", marginTop: 16 }}>{it.note}</div>
            <div style={{ position: "absolute", left: 380, top: -14, width: 30, height: 30, borderRadius: 15, background: "radial-gradient(circle at 35% 35%, #E85D50, #8E1E16)", boxShadow: "0 4px 6px rgba(0,0,0,0.5)" }} />
          </div>
        );
      })}
    </Desk>
  );
};

// ---------- 7 · ME PREGUNTARON: papelito arrancado del cuaderno con la pregunta
export const Pregunta: React.FC<{ text: string; who?: string; img?: string; dur: number; seed: number }> = ({ text, who, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, 4, fps);
  return (
    <Desk dur={dur} seed={seed}>
      {img ? <div style={{ position: "absolute", left: 1150, top: 160, width: 640, padding: 18, background: "#F4F1E8", boxShadow: "0 22px 44px rgba(0,0,0,0.45)", transform: "rotate(4deg)" }}><Img src={staticFile(img)} style={{ width: 604, height: 400, objectFit: "cover" }} /></div> : null}
      <div style={{ position: "absolute", left: 170, top: 190, width: 1060, minHeight: 560, transform: `rotate(${-2 + p * 0.5}deg) translateX(${(1 - p) * -700}px)`, background: gridBg, backgroundSize: "40px 40px, 40px 40px, 100% 100%", boxShadow: "0 26px 60px rgba(0,0,0,0.5)", padding: "60px 70px 70px", clipPath: "polygon(0 0, 100% 0, 100% 100%, 92% 98%, 84% 100%, 76% 97.5%, 66% 100%, 55% 98%, 44% 100%, 33% 97.6%, 22% 100%, 11% 98%, 0 100%)" }}>
        <div style={{ display: "inline-block", background: M.ink, color: M.lime, fontFamily: SANS, fontSize: 42, letterSpacing: 4, padding: "6px 22px" }}>ME PREGUNTARON</div>
        <Write f0={14} len={30} style={{ fontFamily: HAND, fontSize: text.length > 90 ? 58 : 70, lineHeight: 1.22, color: "#1F2A3A", marginTop: 34 }}>«{text}»</Write>
        {who ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 38, color: "#555", marginTop: 26 }}>— {who}</div> : null}
      </div>
    </Desk>
  );
};

// ---------- 8 · ETIQUETA de la batería (plástico negro impreso) + lista de control
export const Etiqueta: React.FC<{ n: number; items: string[]; detail: string; dur: number; seed: number }> = ({ n, items, detail, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const tick = pop(f, 10, fps);
  return (
    <Desk dur={dur} seed={seed}>
      <div style={{ position: "absolute", left: 120, top: 110, width: 900, height: 860, borderRadius: 26, background: "linear-gradient(160deg, #2E3033 0%, #18191B 60%, #101112 100%)", boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.12)", transform: `rotate(${seed % 2 ? -1 : 1}deg)` }}>
        <div style={{ position: "absolute", left: 60, top: 50, right: 60, height: 120, borderBottom: `6px solid ${M.lime}`, fontFamily: SANS, fontSize: 70, color: "#F2F2F2", letterSpacing: 4 }}>LiFePO4 · 12.8 V</div>
        {[["CAPACIDAD", "100 Ah · 1280 Wh"], ["BMS", "100 A continuo"], ["CICLOS", "3000+ @ 80 % DoD"], ["TRANSPORTE", "UN38.3"], ["PESO", "11 kg"]].map(([a, b], i) => (
          <div key={a} style={{ position: "absolute", left: 60, top: 220 + i * 110, fontFamily: MONO, fontSize: 44, color: "#D9D9D9" }}><span style={{ color: "#8C8C8C" }}>{a}</span>  {b}</div>
        ))}
        <div style={{ position: "absolute", left: 60, bottom: 50, width: 160, height: 60, borderRadius: 8, background: M.red }} />
        <div style={{ position: "absolute", right: 60, bottom: 50, width: 160, height: 60, borderRadius: 8, background: "#0A0A0A", boxShadow: "inset 0 0 0 3px #444" }} />
      </div>
      <div style={{ position: "absolute", left: 1090, top: 120, width: 730, height: 840, background: gridBg, backgroundSize: "40px 40px, 40px 40px, 100% 100%", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", transform: "rotate(1.5deg)", padding: "40px 46px" }}>
        <div style={{ fontFamily: SANS, fontSize: 40, letterSpacing: 3, color: M.ink, marginBottom: 18 }}>QUÉ TIENE QUE DECIR</div>
        {items.map((t, i) => {
          const done = i + 1 < n, cur = i + 1 === n;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: HAND, fontSize: cur ? 54 : 44, lineHeight: 1.45, color: cur ? M.ink : done ? "#3B4A60" : "rgba(40,50,60,0.38)" }}>
              <div style={{ width: 44, height: 44, border: "4px solid #2B3A50", borderRadius: 6, position: "relative", background: cur ? M.lime : "transparent", transform: cur ? `scale(${0.8 + 0.2 * tick})` : "none" }}>
                {done || cur ? <div style={{ position: "absolute", left: 10, top: -4, width: 16, height: 34, borderRight: "6px solid #1A2638", borderBottom: "6px solid #1A2638", transform: "rotate(40deg)" }} /> : null}
              </div>
              <span>{i + 1}. {t}</span>
            </div>
          );
        })}
        <Write f0={20} len={24} style={{ marginTop: 26, fontFamily: HAND, fontSize: 46, color: M.red, transform: "rotate(-1.5deg)" }}>{detail}</Write>
      </div>
    </Desk>
  );
};

// ---------- 9 · BATERÍA con barra de carga y reloj de pared
export const Bateria: React.FC<{ p0: number; p1: number; f0?: number; f1?: number; big: string; sub?: string; clock?: [number, number]; day?: string; dur: number; seed: number }> = ({ p0, p1, f0 = 6, f1, big, sub, clock, day, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pct = interpolate(f, [f0, f1 ?? Math.max(f0 + 30, dur - 20)], [p0, p1], { ...CL, easing: ease });
  const col = pct < 15 ? M.red : pct < 40 ? "#E3B23C" : M.lime;
  const inn = pop(f, 0, fps);
  return (
    <Desk dur={dur} seed={seed} bg={`linear-gradient(180deg, #DCD3C2, #C7BCA6)`}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "repeating-linear-gradient(90deg, #BFA98A 0 238px, #A99372 238px 242px)" }} />
      <div style={{ position: "absolute", left: 210, top: 210, width: 760, height: 620, borderRadius: 30, transform: `scale(${0.9 + 0.1 * inn})`, background: "linear-gradient(160deg, #303235, #141516)", boxShadow: "0 40px 70px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", left: 160, top: -40, width: 100, height: 50, background: M.red, borderRadius: "10px 10px 0 0" }} />
        <div style={{ position: "absolute", right: 160, top: -40, width: 100, height: 50, background: "#0B0B0B", borderRadius: "10px 10px 0 0" }} />
        <div style={{ position: "absolute", left: 70, right: 70, top: 120, height: 300, borderRadius: 16, background: "#0A0A0A", boxShadow: "inset 0 0 0 4px #3A3A3A", padding: 14 }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 8, background: `linear-gradient(180deg, ${col}, ${col}AA)` }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 450, textAlign: "center", fontFamily: MONO, fontSize: 110, color: "#EDEDED" }}>{Math.round(pct)} %</div>
      </div>
      {clock ? (() => {
        const [h, m] = clock; const ma = m * 6, ha = (h % 12) * 30 + m * 0.5;
        return (
          <div style={{ position: "absolute", left: 1200, top: 110, width: 380, height: 380, borderRadius: 190, background: "radial-gradient(circle, #FBFAF5 0 62%, #E6E1D4 63% 70%, #2A2A2A 71%)", boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}>
            {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 186, top: 40, width: 8, height: 26, background: "#222", transformOrigin: "4px 150px", transform: `rotate(${i * 30}deg)` }} />)}
            <div style={{ position: "absolute", left: 184, top: 90, width: 12, height: 100, background: "#111", borderRadius: 6, transformOrigin: "6px 100px", transform: `rotate(${ha}deg)` }} />
            <div style={{ position: "absolute", left: 186, top: 50, width: 8, height: 140, background: "#111", borderRadius: 4, transformOrigin: "4px 140px", transform: `rotate(${ma}deg)` }} />
            <div style={{ position: "absolute", left: 178, top: 178, width: 24, height: 24, borderRadius: 12, background: M.red }} />
          </div>
        );
      })() : null}
      {day ? <MTape style={{ left: 1210, top: 530, fontSize: 52, transform: "rotate(-3deg)" }}>{day}</MTape> : null}
      <div style={{ position: "absolute", left: 1100, top: 640, width: 760, fontFamily: SERIF, fontSize: big.length > 22 ? 70 : 92, lineHeight: 1.05, color: M.ink }}>{big}</div>
      {sub ? <div style={{ position: "absolute", left: 1104, top: 880, width: 760, fontFamily: SANS, fontWeight: 300, fontSize: 44, color: "#3A352C" }}>{sub}</div> : null}
    </Desk>
  );
};

// ---------- 10 · TURNOS: la hoja pegada con cinta aislante en la puerta del refrigerador
export const Turnos: React.FC<{ rows: { h: string; t: string }[]; hi: number; his?: { f: number; hi: number }[]; foot?: string; fFoot?: number; dur: number; seed: number }> = ({ rows, hi: hi0, his, foot, fFoot = 30, dur, seed }) => {
  const f0 = useCurrentFrame();
  const cur = his ? [...his].reverse().find((x) => f0 >= x.f) ?? his[0] : { f: 0, hi: hi0 };
  const hi = cur.hi; const f = f0 - cur.f;
  return (
    <Desk dur={dur} seed={seed} bg={`linear-gradient(90deg, #E9E9E4 0%, #F7F7F3 45%, #DCDCD6 100%)`}>
      <div style={{ position: "absolute", right: 120, top: 0, bottom: 0, width: 46, background: "linear-gradient(90deg, #BFC1C0, #ECEDEA 40%, #A9ABAA)", borderRadius: 23, boxShadow: "-6px 0 14px rgba(0,0,0,0.18)" }} />
      <div style={{ position: "absolute", left: 340, top: 70, width: 1120, height: 940, background: "#FBFBF7", boxShadow: "0 16px 40px rgba(0,0,0,0.25)", transform: `rotate(${seed % 2 ? -1 : 0.8}deg)`, padding: "60px 70px" }}>
        <div style={{ fontFamily: SANS, fontSize: 52, letterSpacing: 4, color: M.ink, marginBottom: 20 }}>MI DÍA DE APAGÓN</div>
        {rows.map((r, i) => {
          const on = i === hi;
          return (
            <div key={i} style={{ display: "flex", gap: 40, fontFamily: HAND, fontSize: 52, lineHeight: 1.5, color: i <= hi ? "#1F2A3A" : "rgba(31,42,58,0.35)", background: on ? `${M.lime}AA` : "transparent", margin: "0 -20px", padding: "0 20px", transform: on ? `translateX(${interpolate(f, [0, 10], [-12, 0], CL)}px)` : "none" }}>
              <span style={{ width: 170, fontFamily: MONO, fontSize: 46 }}>{r.h}</span><span>{r.t}</span>
            </div>
          );
        })}
        {foot ? <Write f0={fFoot} len={22} style={{ marginTop: 26, fontFamily: HAND, fontSize: 50, color: M.red }}>{foot}</Write> : null}
        <ETape style={{ left: -40, top: -16, transform: "rotate(-20deg)" }} />
        <ETape style={{ right: -40, top: -16, transform: "rotate(18deg)" }} />
        <ETape style={{ left: 450, bottom: -20, transform: "rotate(2deg)" }} />
      </div>
    </Desk>
  );
};

// ---------- 11 · DOS etiquetas colgadas del tablero perforado (comparación)
export const Dos: React.FC<{ a: { big: string; label: string }; b: { big: string; label: string }; fB: number; verdict?: string; fV?: number; good?: "a" | "b"; dur: number; seed: number }> = ({ a, b, fB, verdict, fV = 60, good, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pa = pop(f, 2, fps), pb = pop(f, fB, fps), pv = pop(f, fV, fps);
  const Tag = ({ d, p, x, rot, ok }: { d: { big: string; label: string }; p: number; x: number; rot: number; ok?: boolean }) => (
    <div style={{ position: "absolute", left: x, top: 150, width: 640, transformOrigin: "320px -60px", transform: `rotate(${rot + Math.sin(f / 18 + x) * 1.2 * (1 - p * 0.6)}deg) translateY(${(1 - p) * -500}px)` }}>
      <div style={{ position: "absolute", left: 312, top: -64, width: 16, height: 70, background: "#777" }} />
      <div style={{ height: 620, borderRadius: 26, background: "linear-gradient(180deg, #F7F4EC, #E6E0D2)", boxShadow: "0 28px 50px rgba(0,0,0,0.45)", padding: "60px 50px", border: ok ? `10px solid ${M.lime}` : "10px solid transparent" }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, background: "#8B6B45", margin: "0 auto 30px", boxShadow: "inset 0 4px 8px rgba(0,0,0,0.6)" }} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: d.big.length > 7 ? 110 : 160, textAlign: "center", color: M.ink, lineHeight: 1 }}>{d.big}</div>
        <div style={{ fontFamily: SERIF, fontSize: 52, textAlign: "center", color: "#3A352C", marginTop: 30, lineHeight: 1.15 }}>{d.label}</div>
      </div>
    </div>
  );
  return (
    <Desk dur={dur} seed={seed} bg={pegBg}>
      <AbsoluteFill style={{ backgroundSize: "60px 60px" }} />
      <Tag d={a} p={pa} x={220} rot={-3} ok={good === "a" && f > fV} />
      {f >= fB ? <Tag d={b} p={pb} x={1060} rot={3} ok={good === "b" && f > fV} /> : null}
      {verdict ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: Math.min(1, pv * 1.3), transform: `translateY(${(1 - pv) * 40}px)` }}><span style={{ background: M.ink, color: M.lime, fontFamily: SANS, fontSize: 60, letterSpacing: 2, padding: "12px 36px" }}>{verdict}</span></div> : null}
    </Desk>
  );
};

// ---------- 12 · RECAP: tira de cinta de enmascarar numerada sobre la foto del paso
export const RecapTira: React.FC<{ n: number; title: string; fact: string; img: string; dur: number; seed: number }> = ({ n, title, fact, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, 2, fps);
  const z = interpolate(f, [0, dur], [1.04, 1.12]);
  return (
    <AbsoluteFill style={{ background: M.ink, opacity: fadeIO(f, dur, 5, 5), overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}><Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 820, background: "linear-gradient(90deg, rgba(20,20,22,0.92) 0%, rgba(20,20,22,0.85) 75%, rgba(20,20,22,0) 100%)" }} />
      <div style={{ position: "absolute", left: 90, top: 200, transform: `translateX(${(1 - p) * -600}px)` }}>
        <div style={{ display: "inline-block", background: "linear-gradient(180deg, #F0E2B4, #DECC96)", padding: "8px 30px", fontFamily: SANS, fontSize: 56, color: M.ink, transform: "rotate(-3deg)" }}>{n} / 12</div>
        <div style={{ fontFamily: SERIF, fontSize: 96, lineHeight: 1.02, color: "#F4F1E8", width: 640, marginTop: 40 }}>{title}</div>
        <Write f0={14} len={20} style={{ fontFamily: HAND, fontSize: 52, color: M.lime, width: 640, marginTop: 30 }}>{fact}</Write>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 13 · PRÓXIMO VIDEO: la caja del kit con la etiqueta de precio
export const Proximo: React.FC<{ title: string; price: string; img: string; dur: number; seed: number }> = ({ title, price, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, 4, fps), t = pop(f, 22, fps);
  return (
    <Desk dur={dur} seed={seed}>
      <div style={{ position: "absolute", left: 160, top: 160, width: 980, height: 660, background: "#F4F1E8", padding: 22, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", transform: `rotate(-2deg) scale(${0.9 + 0.1 * p})` }}>
        <Img src={staticFile(img)} style={{ width: 936, height: 616, objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 1180, top: 210, width: 640, fontFamily: SANS, fontSize: 44, letterSpacing: 5, color: M.lime }}>EL PRÓXIMO VIDEO</div>
      <div style={{ position: "absolute", left: 1180, top: 290, width: 640, fontFamily: SERIF, fontSize: 76, lineHeight: 1.06, color: "#F4F1E8" }}>{title}</div>
      <div style={{ position: "absolute", left: 1000, top: 700, width: 300, height: 170, borderRadius: "16px 60px 60px 16px", background: "linear-gradient(180deg, #F3EEDF, #DCD4BF)", boxShadow: "0 16px 30px rgba(0,0,0,0.45)", transform: `rotate(${-8 + 8 * (1 - t)}deg) scale(${t})`, fontFamily: SANS, fontWeight: 700, fontSize: 90, color: M.ink, textAlign: "center", lineHeight: "170px" }}>{price}</div>
    </Desk>
  );
};
