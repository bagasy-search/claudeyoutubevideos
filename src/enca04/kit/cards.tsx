// Chief Aurelio · kit de tarjetas (libro de guardias, télex, teléfono satelital, cifra grande, detector de gas,
// ítem numerado, cita, placa de capítulo, recibo, pantalla final). Overlays; reciben `dur` (frames del cue).
import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { C, FONT, k, io, shadow, plateStyle } from "../theme";
import { TelegraphDial } from "./diagrams";

type D = { dur: number };
type Pos = "left" | "right" | "center" | "lowerleft" | "lowerright";
const place = (pos: Pos): React.CSSProperties =>
  pos === "left" ? { left: 90, top: "50%", transform: "translateY(-50%)" }
  : pos === "right" ? { right: 90, top: "50%", transform: "translateY(-50%)" }
  : pos === "lowerleft" ? { left: 90, bottom: 90 }
  : pos === "lowerright" ? { right: 90, bottom: 90 }
  : { left: "50%", top: "50%", transform: "translate(-50%,-50%)" };
const typed = (s: string, f: number, a: number, cps = 1.1) => s.slice(0, Math.max(0, Math.floor((f - a) * cps)));

// ───────── LOG ENTRY: la página del libro de guardias con año, barco, lugar y nota a mano ─────────
export const LogEntry: React.FC<D & { date: string; ship: string; place: string; note?: string; pos?: Pos }> = ({ dur, date, ship, place: where, note, pos = "lowerleft" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  const rows: [string, string][] = [["DATE", date], ["VESSEL", ship], ["POSITION", where]];
  return (
    <div style={{ position: "absolute", ...place(pos), opacity: op }}>
      <div style={{ width: 640, background: C.cream, padding: "26px 34px 30px", borderRadius: 4, boxShadow: shadow, transform: `rotate(-1.2deg) translateY(${24 * (1 - k(f, 0, 14))}px)`,
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0 47px, ${C.paperLine} 47px 49px)`, backgroundPosition: "0 22px" }}>
        <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: C.signal, marginBottom: 6 }}>ENGINE ROOM LOG</div>
        {rows.map(([a, b], i) => (
          <div key={a} style={{ display: "flex", alignItems: "baseline", height: 48 }}>
            <div style={{ width: 170, fontFamily: FONT.mono, fontSize: 22, color: C.steel2, letterSpacing: 2 }}>{a}</div>
            <div style={{ fontFamily: FONT.hand, fontWeight: 700, fontSize: 42, color: "#1B2A6B" }}>{typed(b, f, 10 + i * 14, 1.4)}</div>
          </div>
        ))}
        {note && <div style={{ fontFamily: FONT.hand, fontWeight: 700, fontSize: 44, color: C.signal, marginTop: 4, height: 50 }}>{typed(note, f, 54, 1.2)}</div>}
      </div>
    </div>
  );
};

// ───────── TELEX: tira de papel con letras de teletipo ─────────
export const Telex: React.FC<D & { header?: string; lines: string[]; pos?: Pos }> = ({ dur, header = "TELEX", lines, pos = "center" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  let start = 16;
  return (
    <div style={{ position: "absolute", ...place(pos), opacity: op }}>
      <div style={{ width: 980, background: "#F3EBD6", padding: "30px 46px", boxShadow: shadow, borderTop: `14px dotted ${C.paperLine}`, borderBottom: `14px dotted ${C.paperLine}`, transform: `translateY(${-40 * (1 - k(f, 0, 16))}px)` }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 24, color: C.steel2, letterSpacing: 4, marginBottom: 16 }}>{header}</div>
        {lines.map((l, i) => {
          const a = start; start += l.length / 1.3 + 8;
          return <div key={i} style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 46, color: C.ink, letterSpacing: 3, minHeight: 58 }}>{typed(l.toUpperCase(), f, a, 1.3)}</div>;
        })}
      </div>
    </div>
  );
};

// ───────── CALL METER: llamada por satélite con reloj y costo ─────────
export const CallMeter: React.FC<D & { rate: number; minutes: number; year?: string; label?: string; pos?: Pos }> = ({ dur, rate, minutes, year, label = "SATELLITE CALL", pos = "right" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  const t = k(f, 12, Math.max(30, dur - 20), (x) => x) * minutes * 60;
  const mm = Math.floor(t / 60), ss = Math.floor(t % 60);
  return (
    <div style={{ position: "absolute", ...place(pos), opacity: op }}>
      <div style={{ width: 560, background: C.ink, border: `4px solid ${C.brass}`, borderRadius: 18, padding: "30px 36px", boxShadow: shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.plate, fontWeight: 700, fontSize: 30, color: C.brassHi, letterSpacing: 3 }}>
          <span>{label}</span>{year && <span>{year}</span>}
        </div>
        <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 120, color: C.white, marginTop: 10 }}>{`${mm}:${String(ss).padStart(2, "0")}`}</div>
        <div style={{ height: 3, background: C.steel2, margin: "10px 0 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: 36, color: C.cream }}>
          <span>{`$${rate.toFixed(2)} / min`}</span>
          <span style={{ color: C.signal, fontWeight: 600 }}>{`$${((t / 60) * rate).toFixed(2)}`}</span>
        </div>
      </div>
    </div>
  );
};

// ───────── BIG STAT: cifra que cuenta + unidad + rótulo ─────────
export const BigStat: React.FC<D & { value: number; prefix?: string; suffix?: string; label: string; sub?: string; decimals?: number; pos?: Pos }> = ({ dur, value, prefix = "", suffix = "", label, sub, decimals = 0, pos = "center" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  const v = interpolate(k(f, 6, 40), [0, 1], [0, value]);
  const txt = v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <div style={{ position: "absolute", ...place(pos), opacity: op, textAlign: pos === "right" ? "right" : pos === "center" ? "center" : "left" }}>
      <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 150, color: C.white, lineHeight: 1, textShadow: shadow, whiteSpace: "nowrap" }}>{prefix}{txt}<span style={{ fontSize: 80, color: C.brassHi }}>{suffix}</span></div>
      <div style={{ height: 6, background: C.brass, margin: pos === "center" ? "18px auto" : "18px 0", width: `${70 * k(f, 20, 40)}%`, marginLeft: pos === "right" ? "auto" : undefined }} />
      <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 58, color: C.cream, textTransform: "uppercase", letterSpacing: 2, textShadow: shadow, opacity: k(f, 24, 38) }}>{label}</div>
      {sub && <div style={{ fontFamily: FONT.mono, fontSize: 30, color: C.brassHi, marginTop: 8, opacity: k(f, 34, 48) }}>{sub}</div>}
    </div>
  );
};

// ───────── GAS METER: detector portátil (O2 % o H2S ppm) ─────────
export const GasMeter: React.FC<D & { mode: "o2" | "h2s"; from: number; to: number; label?: string; pos?: Pos }> = ({ dur, mode, from, to, label, pos = "right" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  const v = interpolate(k(f, 14, Math.max(30, dur - 30)), [0, 1], [from, to]);
  const bad = mode === "o2" ? v < 19.5 : v > 10;
  const blink = bad && Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ position: "absolute", ...place(pos), opacity: op }}>
      <div style={{ width: 460, background: "#E2B21F", borderRadius: 36, padding: 26, boxShadow: shadow }}>
        <div style={{ background: bad ? (blink ? "#5A1410" : "#2A0C0A") : "#0E2A1C", borderRadius: 16, padding: "22px 26px", border: "4px solid #222" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 30, color: bad ? "#FF8A7A" : "#8CF5B5", letterSpacing: 3 }}>{mode === "o2" ? "O2  %VOL" : "H2S  PPM"}</div>
          <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 130, color: bad ? "#FFB3A8" : "#C9FFE0", lineHeight: 1.05 }}>{mode === "o2" ? v.toFixed(1) : Math.round(v)}</div>
          <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 34, color: bad ? C.signal : "#8CF5B5", letterSpacing: 4 }}>{bad ? "ALARM" : "OK"}</div>
        </div>
        {label && <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 36, color: C.ink, marginTop: 16, textAlign: "center", letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>}
      </div>
    </div>
  );
};

// ───────── KILLER ITEM: número de latón grande + título que se escribe ─────────
export const NumberItem: React.FC<D & { n: number; title: string; sub?: string; pos?: Pos }> = ({ dur, n, title, sub, pos = "lowerleft" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  return (
    <div style={{ position: "absolute", ...place(pos), opacity: op, display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ ...plateStyle, width: 170, height: 170, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, transform: `scale(${0.6 + 0.4 * k(f, 0, 12)})` }}>{n}</div>
      <div>
        <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 88, color: C.white, textTransform: "uppercase", letterSpacing: 2, textShadow: shadow, lineHeight: 1 }}>{typed(title, f, 10, 1.0)}</div>
        <div style={{ height: 6, background: C.signal, width: `${Math.min(100, (typed(title, f, 10, 1.0).length / title.length) * 100)}%`, marginTop: 10 }} />
        {sub && <div style={{ fontFamily: FONT.mono, fontSize: 32, color: C.cream, marginTop: 14, opacity: k(f, 30, 44), textShadow: shadow }}>{sub}</div>}
      </div>
    </div>
  );
};

// ───────── QUOTE: cita en serif (Svensson, Dahl, Benjie) ─────────
export const Quote: React.FC<D & { text: string; who: string; pos?: Pos }> = ({ dur, text, who, pos = "center" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur, 14, 14);
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", ...place(pos), opacity: op, width: 1300, textAlign: "center" }}>
      <div style={{ fontFamily: FONT.serif, fontSize: 64, lineHeight: 1.3, color: C.white, textShadow: shadow }}>
        <span style={{ color: C.brass, fontSize: 90 }}>“</span>
        {words.map((w, i) => <span key={i} style={{ opacity: k(f, 8 + i * 3, 16 + i * 3) }}>{w} </span>)}
        <span style={{ color: C.brass, fontSize: 90 }}>”</span>
      </div>
      <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 40, color: C.brassHi, letterSpacing: 5, marginTop: 26, textTransform: "uppercase", opacity: k(f, 14 + words.length * 3, 26 + words.length * 3) }}>— {who}</div>
    </div>
  );
};

// ───────── CHAPTER PLATE: placa de latón con el capítulo + mini telégrafo ─────────
export const ChapterPlate: React.FC<D & { n: number; title: string }> = ({ dur, n, title }) => {
  const f = useCurrentFrame();
  const op = io(f, dur, 10, 12);
  const w = k(f, 4, 22);
  return (
    <div style={{ position: "absolute", left: 90, top: 80, display: "flex", alignItems: "center", gap: 22, opacity: op }}>
      <div style={{ transform: `rotate(${-30 + 30 * w}deg)` }}><TelegraphDial angle={-170 + 80 * w} size={130} /></div>
      <div style={{ ...plateStyle, padding: "14px 30px 12px", clipPath: `inset(0 ${100 - 100 * w}% 0 0)` }}>
        <div style={{ fontSize: 26, letterSpacing: 8, opacity: 0.75 }}>{`CHAPTER ${n}`}</div>
        <div style={{ fontSize: 54, letterSpacing: 3, lineHeight: 1 }}>{title}</div>
      </div>
    </div>
  );
};

// ───────── LEDGER: "lo que paga la plata" (renglones con precio) ─────────
export const Ledger: React.FC<D & { title: string; rows: { k: string; v: string }[]; pos?: Pos }> = ({ dur, title, rows, pos = "right" }) => {
  const f = useCurrentFrame();
  const op = io(f, dur);
  return (
    <div style={{ position: "absolute", ...place(pos), opacity: op }}>
      <div style={{ width: 720, background: C.cream, padding: "30px 40px", boxShadow: shadow, borderRadius: 4, transform: `rotate(1deg)` }}>
        <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: C.ink, borderBottom: `3px solid ${C.ink}`, paddingBottom: 10 }}>{title}</div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px dashed ${C.paperLine}`, padding: "12px 0", opacity: k(f, 12 + i * 12, 22 + i * 12) }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 30, color: C.ink }}>{r.k}</span>
            <span style={{ fontFamily: FONT.hand, fontWeight: 700, fontSize: 44, color: C.signal }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────── END CARD: próximo video + subscribe + la frase de Lupe ─────────
export const EndCard: React.FC<D & { next: string; img: string; line?: string }> = ({ dur, next, img, line }) => {
  const f = useCurrentFrame();
  const op = Math.min(k(f, 0, 14), 1);
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(11,22,32,${0.82 * op})`, opacity: op, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      <div style={{ width: 880 }}>
        <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 40, color: C.brassHi, letterSpacing: 8 }}>WATCH NEXT</div>
        <div style={{ position: "relative", width: 880, height: 495, marginTop: 16, border: `6px solid ${C.brass}`, boxShadow: shadow, overflow: "hidden" }}>
          <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * k(f, 0, dur)})` }} />
        </div>
        <div style={{ fontFamily: FONT.plate, fontWeight: 700, fontSize: 54, color: C.white, marginTop: 20, lineHeight: 1.05, textTransform: "uppercase" }}>{next}</div>
      </div>
      <div style={{ width: 600, textAlign: "center" }}>
        <TelegraphDial angle={-170 + 80 * k(f, 10, 30)} size={300} />
        <div style={{ ...plateStyle, display: "inline-block", padding: "16px 40px", fontSize: 50, marginTop: 30, background: C.signal, color: C.white }}>SUBSCRIBE</div>
        {line && <div style={{ fontFamily: FONT.hand, fontWeight: 700, fontSize: 46, color: C.cream, marginTop: 30, lineHeight: 1.15, opacity: k(f, 30, 50) }}>{line}</div>}
      </div>
    </div>
  );
};
