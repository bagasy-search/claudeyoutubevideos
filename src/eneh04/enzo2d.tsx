// Enzo (Enzo the HVAC Tech) · piezas 2.5D propias del canal, encima del sótano, de las tomas y del avatar:
// la FACTURA de la empresa grande con los cargos que se tachan y el arreglo real abajo, el MAPA de Chicago (Northwest Side,
// el lago a la derecha, la Kennedy en diagonal) con el lugar y el año de la historia, el TERMÓMETRO °F grande (afuera / adentro),
// el CONTADOR de dólares, la LUZ de la placa que parpadea N veces con su significado, la FICHA de la persona y la CARTA del
// próximo video. Mismo idioma visual que el resto: papel real con sombra larga, tipografía gruesa, rojo sólo para lo que miente.
import React from "react";
import { COL, FONT, e, ei, extrude, spr } from "./lib";

const fadeIO = (t: number, at: number, out: number, fi = 0.25, fo = 0.3) => e(t, at - fi, at) * (1 - e(t, out, out + fo));
const HANDF = "'Segoe Print','Bradley Hand','Marker Felt','Comic Sans MS',cursive";
const money = (n: number) => "$" + (Math.abs(n % 1) > 0.001 ? n.toFixed(2) : Math.round(n).toLocaleString("en-US"));

// ---------- la factura / cotización: membrete genérico de "big company", renglones que entran, los "x" se tachan
// en rojo; "fix" = el arreglo real (renglón verde escrito a mano por Enzo) y el total cae al real
export const Invoice: React.FC<{ t: number; at: number; out: number; co?: string; rows: { at: number; item: string; v: number; xAt?: number; fix?: boolean }[]; totalAt?: number; px?: number; py?: number; sign?: boolean }> =
  ({ t, at, out, co = "A BIG COMPANY · HOME COMFORT", rows, totalAt = 1e9, px = 1240, py = 90, sign = true }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const shown = rows.filter((r) => t >= r.at - 0.1);
  const tot = shown.reduce((s, r) => s + (r.xAt !== undefined && t >= r.xAt + 0.3 ? 0 : r.v), 0);
  const k = Math.min(1.04, spr(t, at, 0.8));
  return (
    <div style={{ position: "absolute", left: px, top: py, opacity: o, perspective: 1500 }}>
      <div style={{ transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateY(-12deg) rotateX(6deg) rotateZ(${1.5 - (1 - Math.min(1, k)) * 6}deg)`, width: 600, background: "linear-gradient(180deg,#fdfcf8,#f0ece2)", borderRadius: 4, boxShadow: "0 60px 110px rgba(0,0,0,.7), 0 2px 0 #fff inset", padding: "0 0 26px", color: "#1c1c1c", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(90deg,#1d3f7a,#2b5aa8)", padding: "18px 30px 14px", color: "#fff", fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: 3 }}>{co}</div>
          <div style={{ fontWeight: 600, fontSize: 17, letterSpacing: 2, opacity: 0.85 }}>SERVICE QUOTE · CUSTOMER COPY</div>
        </div>
        <div style={{ padding: "16px 34px 0", fontFamily: "'Courier New', monospace" }}>
          {shown.map((r, i) => {
            const xq = r.xAt !== undefined ? e(t, r.xAt, r.xAt + 0.3) : 0;
            if (r.fix) return <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: HANDF, fontSize: 34, fontWeight: 700, lineHeight: "58px", color: "#13723d", opacity: e(t, r.at, r.at + 0.25), transform: `rotate(-2deg) translateX(${(1 - e(t, r.at, r.at + 0.3)) * -30}px)` }}><span>{r.item}</span><span>{money(r.v)}</span></div>;
            return <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 27, fontWeight: 700, lineHeight: "52px", opacity: e(t, r.at, r.at + 0.2), color: xq > 0.5 ? "#8a8a8a" : "#1c1c1c", borderBottom: "1px dashed rgba(0,0,0,.15)" }}>
              <span>{r.item}</span><span>{money(r.v)}</span>
              {xq > 0 && <div style={{ position: "absolute", left: -8, top: 24, height: 7, width: `${xq * 105}%`, background: COL.red, borderRadius: 3, transform: "rotate(-1.8deg)", boxShadow: "0 0 10px rgba(255,74,61,.6)" }} />}
            </div>;
          })}
          {t >= totalAt && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 46, fontWeight: 900, borderTop: "4px double #1c1c1c", marginTop: 12, paddingTop: 10, color: tot < 100 ? "#13723d" : "#b3261e", transform: `scale(${Math.min(1.06, spr(t, totalAt))})`, transformOrigin: "100% 50%" }}>
            <span>TOTAL</span><span>{money(tot)}</span></div>}
          {sign && <div style={{ marginTop: 18, fontFamily: FONT, fontSize: 18, color: "#555", letterSpacing: 2, borderTop: "2px solid #333", width: 300, paddingTop: 4 }}>CUSTOMER SIGNATURE</div>}
        </div>
      </div>
    </div>
  );
};

// ---------- mapa de Chicago (Northwest Side + West Side): grilla de calles, el lago a la derecha, la Kennedy y la Eisenhower,
// los barrios de la serie. pins = lugar de la historia (k) + subtítulo (año / quién)
export const HOODS: Record<string, [number, number]> = {
  "ELMWOOD PARK": [250, 420], NORRIDGE: [210, 300], "HARWOOD HEIGHTS": [170, 230], "BELMONT-CRAGIN": [380, 450], AVONDALE: [560, 400],
  AUSTIN: [330, 610], "OAK PARK": [230, 650], CICERO: [330, 760], BERWYN: [210, 780], SKOKIE: [460, 70], "GRAND AVE": [520, 560],
  "O'HARE": [70, 330], "HARLEM AVE": [250, 520], "THE LOOP": [830, 650], "ST. ROSALIE": [190, 260], SCHAUMBURG: [40, 140],
};
export const ChicagoMap: React.FC<{ t: number; at: number; out: number; pins: { at: number; k: string; sub?: string }[] }> = ({ t, at, out, pins }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 0.9), last = pins.filter((p) => t >= p.at).pop();
  const fx = last ? HOODS[last.k]?.[0] ?? 400 : 400, fy = last ? HOODS[last.k]?.[1] ?? 450 : 450;
  const snow = Array.from({ length: 70 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, perspective: 1500, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - fx, top: 560 - fy, width: 1000, height: 900, transformOrigin: `${fx}px ${fy}px`, transform: `rotateX(${50 - 12 * k}deg) rotateZ(${-10 + 5 * k}deg) scale(${0.85 + 0.35 * k})`, borderRadius: 28,
        background: "linear-gradient(160deg,#eef0ef,#dfe3e2)", boxShadow: "0 80px 160px rgba(0,0,0,.75)", overflow: "hidden" }}>
        <svg width={1000} height={900} style={{ position: "absolute", inset: 0 }}>
          {/* el lago Michigan */}
          <path d="M760 0 C 740 160, 800 300, 790 430 C 780 560, 900 640, 940 900 L 1000 900 L 1000 0 Z" fill="#6fa8c9" />
          <path d="M760 0 C 740 160, 800 300, 790 430 C 780 560, 900 640, 940 900" fill="none" stroke="#e6f1f6" strokeWidth={6} />
          {/* grilla: cada milla una avenida gruesa */}
          {Array.from({ length: 14 }, (_, i) => <line key={"h" + i} x1={0} y1={30 + i * 64} x2={790} y2={30 + i * 64} stroke="#c3c9c8" strokeWidth={i % 2 === 0 ? 6 : 2.5} />)}
          {Array.from({ length: 13 }, (_, i) => <line key={"v" + i} x1={40 + i * 64} y1={0} x2={40 + i * 64} y2={900} stroke="#c3c9c8" strokeWidth={i % 2 === 1 ? 6 : 2.5} />)}
          {/* Harlem Ave (oeste) y Lawrence (norte), Grand (diagonal corta) */}
          <line x1={250} y1={0} x2={250} y2={900} stroke="#e0a43a" strokeWidth={9} opacity={0.85} />
          <text x={262} y={880} fontFamily={FONT} fontWeight={800} fontSize={18} fill="#a8741f" letterSpacing={2}>HARLEM AVE</text>
          <line x1={0} y1={222} x2={790} y2={222} stroke="#e0a43a" strokeWidth={7} opacity={0.7} />
          <text x={560} y={212} fontFamily={FONT} fontWeight={800} fontSize={18} fill="#a8741f" letterSpacing={2}>LAWRENCE AVE</text>
          {/* la Kennedy (diagonal NO→Loop) y la Eisenhower (O→Loop) */}
          <path d="M60 300 C 300 420, 560 500, 830 650" fill="none" stroke="#b9473a" strokeWidth={12} opacity={0.75} />
          <text x={470} y={455} fontFamily={FONT} fontWeight={900} fontSize={19} fill="#8f2f25" letterSpacing={3} transform="rotate(24 470 455)">KENNEDY</text>
          <path d="M0 700 L 830 660" fill="none" stroke="#b9473a" strokeWidth={10} opacity={0.6} />
          <text x={420} y={705} fontFamily={FONT} fontWeight={900} fontSize={17} fill="#8f2f25" letterSpacing={3}>EISENHOWER</text>
          {Object.entries(HOODS).filter(([n]) => n !== "HARLEM AVE" && n !== "ST. ROSALIE").map(([n, [x, y]]) => <text key={n} x={x} y={y + 40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={19} letterSpacing={2} fill="#5d6564">{n}</text>)}
          {pins.filter((p) => t >= p.at).map((p, i) => { const [x, y] = HOODS[p.k] ?? [400, 450], q = Math.min(1.15, spr(t, p.at)); return <g key={i} transform={`translate(${x} ${y}) scale(${q})`}>
            <circle r={36 + 34 * e(t, p.at, p.at + 0.9)} fill="none" stroke={COL.red} strokeWidth={4} opacity={1 - e(t, p.at, p.at + 0.9)} />
            <path d="M0 0 C -26 -30, -26 -62, 0 -62 C 26 -62, 26 -30, 0 0 Z" fill={COL.red} stroke="#fff" strokeWidth={4} /><circle cy={-42} r={9} fill="#fff" /></g>; })}
        </svg>
        {/* nieve que cae sobre la maqueta */}
        {snow.map((i) => { const u = ((t * 0.12 + (i * 0.137) % 1) % 1); return <div key={i} style={{ position: "absolute", left: ((i * 97) % 1000), top: u * 900, width: 5, height: 5, borderRadius: 3, background: "rgba(255,255,255,.85)" }} />; })}
      </div>
      {last && <div style={{ position: "absolute", left: 960, top: 120, transform: `translateX(-50%) scale(${Math.min(1.05, spr(t, last.at))})`, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 84, color: COL.ink, letterSpacing: 4, textShadow: extrude(8, "#000"), whiteSpace: "nowrap" }}>{last.k}</div>
        {last.sub && <div style={{ fontWeight: 800, fontSize: 38, color: COL.ice, letterSpacing: 6, textShadow: "0 3px 12px #000" }}>{last.sub}</div>}
      </div>}
    </div>
  );
};

// ---------- termómetro grande °F (de vidrio, el líquido sube o baja); cold = azul hielo, si no rojo. label debajo
export const ThermoF: React.FC<{ t: number; at: number; out: number; from: number; to: number; label?: string; x?: number; y?: number; dur?: number; lo?: number; hi?: number }> =
  ({ t, at, out, from, to, label, x = 1280, y = 540, dur = 1.8, lo = -30, hi = 100 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, at, 0.85)), v = from + (to - from) * ei(t, at + 0.3, at + 0.3 + dur);
  const f = (v - lo) / (hi - lo), cold = v < 45, H = 620;
  const liq = cold ? "linear-gradient(180deg,#bfe9ff,#3fa3e8)" : "linear-gradient(180deg,#ff8a70,#d42a1d)";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.75 + 0.25 * Math.min(1, k)})`, opacity: o, textAlign: "center", fontFamily: FONT }}>
      <div style={{ position: "relative", width: 150, height: H + 120, margin: "0 auto" }}>
        <div style={{ position: "absolute", left: 40, top: 0, width: 70, height: H, borderRadius: 35, background: "linear-gradient(90deg,rgba(255,255,255,.35),rgba(255,255,255,.08) 40%,rgba(255,255,255,.3))", border: "4px solid rgba(255,255,255,.7)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 0, height: `${Math.max(0, Math.min(1, f)) * 100}%`, borderRadius: 20, background: liq, boxShadow: `0 0 26px ${cold ? "#7fd0ff" : "#ff6a4d"}` }} />
          {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", right: 0, top: (i / 13) * (H - 20) + 10, width: i % 2 ? 14 : 24, height: 3, background: "rgba(255,255,255,.75)" }} />)}
        </div>
        <div style={{ position: "absolute", left: 20, top: H - 40, width: 110, height: 110, borderRadius: 55, background: liq, border: "4px solid rgba(255,255,255,.7)", boxShadow: `0 0 40px ${cold ? "#7fd0ff" : "#ff6a4d"}, 0 30px 60px rgba(0,0,0,.6)` }} />
        <div style={{ position: "absolute", left: 140, top: (1 - Math.max(0, Math.min(1, f))) * H - 50, fontWeight: 900, fontSize: 120, color: cold ? COL.ice2 : COL.ink, textShadow: extrude(10, cold ? "#123a5a" : "#5a1a12"), whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{v < -0.5 ? "−" : ""}{Math.abs(Math.round(v))}°F</div>
      </div>
      {label && <div style={{ marginTop: 10, fontWeight: 800, fontSize: 38, letterSpacing: 6, color: COL.dim, textShadow: extrude(4, "#000"), whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};

// ---------- contador de dólares (de → a)
export const MoneyRoll: React.FC<{ t: number; at: number; out: number; from: number; to: number; label?: string; col?: string; x?: number; y?: number; size?: number; dur?: number; pre?: string; suf?: string; dec?: boolean }> = ({ t, at, out, from, to, label, col = COL.ink, x = 960, y = 520, size = 200, dur = 1.4, pre = "$", suf = "", dec = false }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.08, spr(t, at, 0.9)), v = from + (to - from) * ei(t, at + 0.15, at + 0.15 + dur);
  const txt = dec ? Math.abs(v).toFixed(2) : Math.abs(Math.round(v)).toLocaleString("en-US");
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o, textAlign: "center" }}>
      <div style={{ transform: `rotateX(${(1 - Math.min(1, k)) * 70}deg) scale(${0.7 + 0.3 * Math.min(1, k)})`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, lineHeight: 1, textShadow: extrude(14, "#2a1d12"), whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
        {v < -0.5 ? "−" : ""}{pre}{txt}{suf}
      </div>
      {label && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: Math.max(30, size * 0.2), letterSpacing: 7, color: COL.dim, marginTop: 10, textShadow: extrude(4, "#000"), whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};

// ---------- la luz de la placa: un LED que parpadea n veces (pausa) en una ventanita de la puerta, con la tabla del sticker
// y el renglón que corresponde marcado
export const BlinkCode: React.FC<{ t: number; at: number; out: number; n: number; codes?: [number, string][]; x?: number; y?: number }> = ({ t, at, out, n, codes = [[1, "SYSTEM LOCKOUT"], [2, "PRESSURE SWITCH STUCK"], [3, "PRESSURE SWITCH / VENT"], [4, "LIMIT SWITCH OPEN"], [5, "FLAME SENSED, NO CALL"]], x = 960, y = 540 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const cyc = n * 0.6 + 1.4, u = ((t - at - 0.4) % cyc + cyc) % cyc, on = t > at + 0.4 && u < n * 0.6 && (u % 0.6) < 0.32;
  const cnt = t > at + 0.4 ? Math.min(n, Math.floor(u / 0.6) + 1) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o, display: "flex", gap: 60, alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 360, height: 360, borderRadius: 26, background: "linear-gradient(160deg,#c9ccc8,#8e928e)", boxShadow: "0 50px 90px rgba(0,0,0,.7), inset 0 2px 0 #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 200, height: 200, borderRadius: 18, background: "#0e1410", boxShadow: "inset 0 10px 30px #000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: on ? "#59ff7a" : "#1d3a22", boxShadow: on ? "0 0 50px 18px rgba(89,255,122,.75)" : "none" }} />
          <div style={{ position: "absolute", bottom: 12, fontWeight: 900, fontSize: 40, color: "#59ff7a", opacity: cnt ? 0.9 : 0 }}>{cnt}</div>
        </div>
      </div>
      <div style={{ background: "#f5f1e6", borderRadius: 6, padding: "20px 28px", boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `rotateZ(1.5deg) translateX(${(1 - e(t, at + 0.2, at + 0.6)) * 80}px)`, opacity: e(t, at + 0.2, at + 0.6) }}>
        <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: 3, color: "#222", borderBottom: "3px solid #222", marginBottom: 8 }}>LED FLASH CODES</div>
        {codes.map(([k, tx]) => <div key={k} style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 28, lineHeight: "46px", color: "#222", padding: "0 8px", background: k === n && t > at + 1.2 ? "rgba(255,214,10,.75)" : "transparent", borderRadius: 4 }}>{"●".repeat(k).padEnd(6, " ")} {tx}</div>)}
      </div>
    </div>
  );
};

// ---------- ficha de la persona: nombre + lugar · año
export const PersonCard: React.FC<{ t: number; at: number; out: number; name: string; l2: string; x?: number; y?: number }> = ({ t, at, out, name, l2, x = 1420, y = 840 }) => {
  const o = fadeIO(t, at, out, 0.15, 0.3); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at, 0.85)), n2 = Math.round(l2.length * e(t, at + 0.35, at + 1.1));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70 - 8}deg)`, transformOrigin: "100% 50%", padding: "18px 34px 18px 30px", background: "linear-gradient(180deg, rgba(14,22,34,.95), rgba(8,12,20,.95))", borderRight: "10px solid #5ab4e8", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.ink, letterSpacing: 2, textShadow: extrude(5, "#000"), whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: COL.ice, letterSpacing: 5, minHeight: 36, whiteSpace: "nowrap" }}>{l2.slice(0, n2)}</div>
      </div>
    </div>
  );
};

// ---------- la pregunta (la tarjeta que va a la heladera): texto a mano sobre una ficha con imán
export const FridgeCard: React.FC<{ t: number; at: number; out: number; text: string; x?: number; y?: number }> = ({ t, at, out, text, x = 960, y = 560 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at, 0.8)), n = Math.round(text.length * e(t, at + 0.3, at + 0.3 + text.length * 0.035));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${-3 + (1 - Math.min(1, k)) * 20}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, opacity: o }}>
      <div style={{ width: 980, minHeight: 360, background: "repeating-linear-gradient(180deg,#fffdf6 0 54px,#c9dbe9 54px 56px)", borderRadius: 6, boxShadow: "0 60px 120px rgba(0,0,0,.7)", padding: "70px 60px 40px", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: -26, width: 70, height: 70, borderRadius: 35, background: "radial-gradient(circle at 35% 30%,#ff8a80,#c62828)", boxShadow: "0 10px 20px rgba(0,0,0,.5)", transform: "translateX(-50%)" }} />
        <div style={{ fontFamily: HANDF, fontSize: 62, lineHeight: "56px", color: "#1b2a4a", fontWeight: 700 }}>{text.slice(0, n)}</div>
      </div>
    </div>
  );
};

// ---------- la carta del próximo video (pantalla final): miniatura dibujada (título) + flecha + subscribe
export const NextCard: React.FC<{ t: number; at: number; out: number; title: string; sub?: string }> = ({ t, at, out, title, sub = "SUBSCRIBE · TELL ME WHAT THE COMPANY TOLD YOU" }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 0.8));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 960, top: 470, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${(1 - Math.min(1, k)) * 50 - 6}deg)`, width: 980, padding: "34px 40px", borderRadius: 18, background: "linear-gradient(160deg,#16253a,#0b1424)", border: "4px solid #5ab4e8", boxShadow: "0 60px 120px rgba(0,0,0,.7), 0 0 60px rgba(90,180,232,.35)" }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 8, color: COL.ice }}>NEXT · WATCH THIS ONE</div>
        <div style={{ fontWeight: 900, fontSize: 66, lineHeight: 1.08, color: COL.ink, marginTop: 10, textShadow: extrude(5, "#000") }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: 960, top: 860, transform: `translateX(-50%) scale(${Math.min(1.05, spr(t, at + 0.6))})`, padding: "18px 40px", borderRadius: 50, background: "#c62828", color: "#fff", fontWeight: 900, fontSize: 34, letterSpacing: 4, boxShadow: "0 20px 50px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  );
};
