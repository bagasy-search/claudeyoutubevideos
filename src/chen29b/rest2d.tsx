// clllaves · componentes 2D NUEVOS del resto (min 2 a 15). Mismo lenguaje que el minuto 1 (fichas con volumen,
// tipografía extruida, entradas con resorte), pero cada idea con SU pieza: nada se recicla del minuto 1.
import React from "react";
import { COL, FONT, e, ei, extrude, spr } from "./lib";

const pop = (t: number, at: number, out: number, sp = 1) => ({ k: Math.min(1.1, spr(t, at, sp)), o: e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)) });
const K = (k: number) => Math.min(1, k);
const card: React.CSSProperties = { background: "linear-gradient(180deg, rgba(250,248,242,.97), rgba(226,222,212,.97))", boxShadow: "0 40px 80px rgba(0,0,0,.55), inset 0 -4px 0 rgba(0,0,0,.08)", borderRadius: 24, fontFamily: FONT };
const dark: React.CSSProperties = { background: "linear-gradient(180deg, rgba(22,30,44,.96), rgba(10,15,24,.96))", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.15)", borderRadius: 24, fontFamily: FONT };
const Big: React.FC<{ s: number; c?: string; edge?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ s, c = COL.ink, edge = "#2a2014", children, style }) => <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: s, color: c, textShadow: extrude(Math.round(s / 14), edge), lineHeight: 1, whiteSpace: "nowrap", ...style }}>{children}</div>;

// la taza de café: el terrón de azúcar se deshace y desaparece → "= la piedra en el agua"
export const CafeCup: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const d = e(t, at + 0.5, at + 2.3), eq = e(t, at + 2.1, at + 2.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})`, display: "flex", alignItems: "center", gap: 40 }}>
      <svg width={420} height={360} viewBox="0 0 420 360" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <ellipse cx={200} cy={330} rx={190} ry={22} fill="#e9e4da" />
        <path d="M60 120 L340 120 L310 320 Q200 345 90 320 Z" fill="#f7f4ee" />
        <path d="M340 160 Q410 165 400 220 Q392 268 320 268" fill="none" stroke="#f7f4ee" strokeWidth={26} />
        <ellipse cx={200} cy={122} rx={140} ry={24} fill="#5b3a22" />
        {/* el terrón que se hunde y se deshace */}
        <g transform={`translate(${200 - 34 * (1 - d * 0.6)},${60 + d * 70}) scale(${1 - d})`} opacity={1 - d}><rect width={68} height={60} rx={6} fill="#fffdf7" stroke="#e6dfcf" strokeWidth={3} /></g>
        {Array.from({ length: 14 }, (_, i) => { const ph = (d * 1.4 + i * 0.07) % 1; return d > 0.05 && d < 0.98 ? <circle key={i} cx={150 + (i * 37) % 100} cy={124 - ph * 6} r={3} fill="#fff" opacity={0.5 * (1 - ph)} /> : null; })}
        {[0, 1, 2].map((i) => <path key={i} d={`M${160 + i * 40} 90 q-14 -24 0 -44 q14 -20 0 -40`} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={6} strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t * 2 + i)} />)}
      </svg>
      <div style={{ opacity: eq, transform: `translateX(${(1 - eq) * 60}px)` }}>
        <Big s={70} c={COL.amber}>AZÚCAR → CAFÉ</Big>
        <Big s={70} c={COL.ice} edge="#0a2a40" style={{ marginTop: 18 }}>PIEDRA → AGUA</Big>
      </div>
    </div>
  );
};

// fichas de la tabla periódica que caen: Ca y Mg
export const Elements: React.FC<{ t: number; items: { at: number; sym: string; n: number; name: string; col: string }[]; out: number; x: number; y: number }> = ({ t, items, out, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 34, perspective: 1200 }}>
    {items.map((it, i) => { const { k, o } = pop(t, it.at, out); if (o < 0.01) return null;
      return <div key={i} style={{ ...card, opacity: o, width: 250, height: 290, padding: "18px 22px", position: "relative", transform: `translateY(${(1 - K(k)) * -300}px) rotateX(${(1 - K(k)) * -80}deg) rotateZ(${(i ? 4 : -4) + Math.sin(t + i) * 1.5}deg)`, background: `linear-gradient(180deg, ${it.col}, #d8d2c4)` }}>
        <div style={{ fontWeight: 800, fontSize: 34, color: "#3a3226" }}>{it.n}</div>
        <div style={{ fontWeight: 900, fontSize: 140, color: "#1d2733", lineHeight: 1, textAlign: "center" }}>{it.sym}</div>
        <div style={{ fontWeight: 800, fontSize: 32, color: "#3a3226", textAlign: "center", letterSpacing: 2 }}>{it.name}</div>
      </div>; })}
  </div>
);

// el tanque de 1.000 litros que se llena y, al lado, la balanza con los 200 gramos de piedra
export const TankScale: React.FC<{ t: number; at: number; gAt: number; out: number; x: number; y: number }> = ({ t, at, gAt, out, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const f = ei(t, at + 0.2, at + 2.0), g = ei(t, gAt, gAt + 1.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})`, display: "flex", alignItems: "flex-end", gap: 70 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 300, height: 400, borderRadius: "60px 60px 30px 30px", background: "rgba(230,240,248,.18)", border: "8px solid #dfe8ef", position: "relative", overflow: "hidden", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${f * 100}%`, background: "linear-gradient(180deg,#7cc4f5,#2f7fbf)" }} />
          {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, width: 50, top: 60 + i * 66, height: 5, background: "#dfe8ef" }} />)}
        </div>
        <Big s={74} c={COL.ice} edge="#0a2a40" style={{ marginTop: 22 }}>{Math.round(f * 1000) >= 1000 ? "1.000" : Math.round(f * 1000)} L</Big>
      </div>
      <div style={{ opacity: e(t, gAt - 0.1, gAt + 0.2), textAlign: "center" }}>
        <svg width={360} height={330} viewBox="0 0 360 330" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
          <rect x={60} y={250} width={240} height={60} rx={14} fill="#c9ced3" /><rect x={90} y={262} width={180} height={36} rx={6} fill="#20262c" />
          <text x={180} y={290} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#7dff9e">{Math.round(g * 200)} g</text>
          <ellipse cx={180} cy={244} rx={150} ry={16} fill="#e3e6e9" />
          {Array.from({ length: 70 }, (_, i) => { const r = (i * 0.618) % 1, a = i * 2.4, rad = Math.sqrt(r) * 95 * g, h = (1 - Math.sqrt(r)) * 80 * g; return g > 0.02 ? <circle key={i} cx={180 + Math.cos(a) * rad} cy={236 - h + Math.sin(a) * 6} r={7 + (i % 4)} fill={["#f4efe2", "#e2d8bf", "#fbf9f2"][i % 3]} /> : null; })}
        </svg>
        <Big s={74} c="#f3ecd8" edge="#5a4a36" style={{ marginTop: 6 }}>DE PIEDRA</Big>
      </div>
    </div>
  );
};

// la familia de cuatro y el contador de litros por mes
export const Familia: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { o } = pop(t, at, out); if (o < 0.01) return null;
  const c = ei(t, at + 0.8, at + 2.6);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%) scale(1.5)", textAlign: "center" }}>
      <div style={{ display: "flex", gap: 26, justifyContent: "center", alignItems: "flex-end" }}>
        {[1, 0.95, 0.68, 0.58].map((s, i) => { const k = K(spr(t, at + i * 0.15)); return (
          <svg key={i} width={110 * s} height={230 * s} viewBox="0 0 110 230" style={{ transform: `translateY(${(1 - k) * 200}px)`, opacity: k, filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
            <circle cx={55} cy={38} r={34} fill={["#f2c48d", "#e9b383", "#f5cfa0", "#eebd8f"][i]} />
            <path d="M10 230 L10 120 Q10 80 55 80 Q100 80 100 120 L100 230 Z" fill={["#2f6db3", "#c2485c", "#e6a23a", "#3f9a6b"][i]} />
          </svg>); })}
      </div>
      <Big s={86} c={COL.ice} edge="#0a2a40" style={{ marginTop: 30 }}>+{Math.round(c * 1000) >= 1000 ? "1.000" : Math.round(c * 1000)} L / MES</Big>
    </div>
  );
};

// contador de semanas que corre mientras la costra crece capa por capa
export const WeekCounter: React.FC<{ t: number; at: number; out: number; per: number; max: number; x: number; y: number }> = ({ t, at, out, per, max, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const n = Math.min(max, 1 + Math.floor(Math.max(0, t - at) / per));
  return (
    <div style={{ ...dark, position: "absolute", left: x, top: y, opacity: o, padding: "18px 36px", transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})`, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ fontWeight: 800, fontSize: 36, color: COL.dim, letterSpacing: 5 }}>SEMANA</div>
      <div style={{ fontWeight: 900, fontSize: 96, color: "#f3ecd8", textShadow: extrude(7, "#5a4a36"), minWidth: 120, textAlign: "center" }}>{n}</div>
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4 }}>{Array.from({ length: max }, (_, i) => <div key={i} style={{ width: 120, height: 7, borderRadius: 3, background: i < n ? ["#cbb98d", "#ddd0b0", "#f1ece0"][i % 3] : "rgba(255,255,255,.08)" }} />)}</div>
    </div>
  );
};

// la rejilla del aireador vista de frente: los agujeritos se tapan uno por uno y el chorro se tuerce
export const AerDots: React.FC<{ t: number; at: number; out: number; x: number; y: number; dur?: number }> = ({ t, at, out, x, y, dur = 3.6 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const holes: [number, number][] = [];
  for (let r = -4; r <= 4; r++) for (let c = -4; c <= 4; c++) { const px = (c + (r % 2 ? 0.5 : 0)) * 46, py = r * 40; if (Math.hypot(px, py) < 175) holes.push([px, py]); }
  const plugged = Math.floor(e(t, at + 0.4, at + dur) * holes.length * 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})` }}>
      <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,.6))" }}>
        <circle r={220} fill="#cfd5da" /><circle r={200} fill="#8e979e" />
        {holes.map(([px, py], i) => { const idx = (i * 37) % holes.length, p = idx < plugged; return <circle key={i} cx={px} cy={py} r={p ? 19 : 15} fill={p ? "#efe9d8" : "#101316"} stroke={p ? "#d8cfb4" : "none"} strokeWidth={3} />; })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center" }}><Big s={58} c="#f3ecd8" edge="#5a4a36">{plugged} TAPADOS</Big></div>
    </div>
  );
};

// diagnóstico por colores: cada muestra se da vuelta con su respuesta (sarro / jabón / bronce / óxido)
export const Diagnose: React.FC<{ t: number; items: { at: number; sw: string; tx: string; res: string; ok: boolean }[]; out: number; pick?: number; pickAt?: number }> = ({ t, items, out, pick = -1, pickAt = 1e9 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 30, perspective: 1400 }}>
    {items.map((it, i) => { const { k, o } = pop(t, it.at, out); if (o < 0.01) return <div key={i} style={{ width: 380 }} />;
      const pk = pick === i ? e(t, pickAt, pickAt + 0.3) : 0, dim = pick >= 0 && pick !== i ? e(t, pickAt, pickAt + 0.3) * 0.65 : 0;
      return <div key={i} style={{ ...card, width: 380, padding: 22, opacity: o * (1 - dim), transform: `translateY(${(1 - K(k)) * 220}px) rotateY(${(1 - K(k)) * 90}deg) scale(${1 + pk * 0.1})`, boxShadow: pk > 0.05 ? `0 0 0 8px rgba(125,255,158,${pk}), 0 40px 80px rgba(0,0,0,.6)` : card.boxShadow }}>
        <div style={{ height: 210, borderRadius: 16, background: it.sw, boxShadow: "inset 0 0 40px rgba(0,0,0,.25)" }} />
        <div style={{ fontWeight: 800, fontSize: 32, color: "#3a3226", marginTop: 16, textAlign: "center" }}>{it.tx}</div>
        <div style={{ fontWeight: 900, fontSize: 60, color: it.ok ? "#1d8a4c" : "#b3261e", textAlign: "center", marginTop: 6 }}>{it.res}</div>
      </div>; })}
  </div>
);

// corte de un acabado: la capa de color finita sobre el metal y el ácido que se la come
export const LayerCut: React.FC<{ t: number; at: number; eatAt: number; out: number; x: number; y: number }> = ({ t, at, eatAt, out, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const eat = e(t, eatAt, eatAt + 1.6);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * K(k)) * 0.8}) perspective(1200px) rotateX(18deg)` }}>
      <svg width={900} height={380} viewBox="0 -10 900 390" style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,.6))" }}>
        <rect x={0} y={140} width={900} height={240} fill="#b98a4a" /><text x={450} y={290} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#5a3a12">METAL (BRONCE)</text>
        <path d={`M0 140 L0 96 L900 96 L900 140 Z`} fill="#e2b866" />
        {/* el ácido: gotas que comen la capa */}
        {[180, 420, 660].map((cx, i) => <g key={i}><ellipse cx={cx} cy={112 - 30 * (1 - eat)} rx={60} ry={30} fill="rgba(240,236,214,.75)" />{eat > 0.2 && <rect x={cx - 50 * eat} y={96} width={100 * eat} height={44} fill="#b98a4a" />}</g>)}
        <line x1={760} y1={112} x2={820} y2={44} stroke="#fff" strokeWidth={4} /><text x={826} y={36} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#ffe28a">CAPA DE COLOR</text>
      </svg>
    </div>
  );
};

// reloj circular de tope: el arco se llena hasta el máximo y queda latiendo en rojo
export const MaxTimer: React.FC<{ t: number; at: number; out: number; x: number; y: number; label: string; sub?: string; col?: string }> = ({ t, at, out, x, y, label, sub, col = "#ff9f43" }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const f = ei(t, at + 0.15, at + 1.3), R = 120, C = 2 * Math.PI * R, beat = f >= 1 ? 1 + 0.04 * Math.sin(t * 9) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * K(k)) * beat})`, display: "flex", alignItems: "center", gap: 30 }}>
      <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ filter: "drop-shadow(0 25px 40px rgba(0,0,0,.6))" }}>
        <circle r={140} fill="rgba(12,18,28,.9)" /><circle r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={22} />
        <circle r={R} fill="none" stroke={col} strokeWidth={22} strokeDasharray={`${C * f} ${C}`} transform="rotate(-90)" strokeLinecap="round" />
        <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#fff">{label}</text>
      </svg>
      {sub && <Big s={64} c={col} edge="#3a2006">{sub}</Big>}
    </div>
  );
};

// LA BANDEJA del kit: cada cosa entra con su frase y queda en fila; las prohibidas se tachan
export const KitTray: React.FC<{ t: number; items: { at: number; ic: string; tx: string; no?: boolean }[]; out: number; y?: number }> = ({ t, items, out, y = 760 }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, perspective: 1200 }}>
    {items.map((it, i) => { const { k, o } = pop(t, it.at, out); if (o < 0.01) return null;
      const st = it.no ? e(t, it.at + 0.35, it.at + 0.6) : 0;
      return <div key={i} style={{ ...(it.no ? dark : card), opacity: o, position: "relative", padding: "12px 22px", display: "flex", alignItems: "center", gap: 14, transform: `translateY(${(1 - K(k)) * 160}px) rotateX(${(1 - K(k)) * 60}deg)`, borderRadius: 18 }}>
        <span style={{ fontSize: 50 }}>{it.ic}</span><span style={{ fontWeight: 900, fontSize: 36, color: it.no ? COL.ink : "#1d2733" }}>{it.tx}</span>
        {st > 0 && <div style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 10, borderRadius: 5, background: COL.red, transformOrigin: "0 50%", transform: `scaleX(${st}) rotate(-4deg)`, boxShadow: "0 0 14px rgba(255,60,40,.8)" }} />}
      </div>; })}
  </div>
);

// cartel de PASO que entra girando como una placa del hotel
export const StepPlate: React.FC<{ t: number; at: number; out: number; n: string; tx: string; x?: number; y?: number }> = ({ t, at, out, n, tx, x = 960, y = 200 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, transform: "translate(-50%,-50%)" }}>
      <div style={{ display: "flex", alignItems: "stretch", transform: `rotateY(${(1 - K(k)) * 100 - 6 + 3 * Math.sin(t)}deg)`, borderRadius: 22, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.65)" }}>
        <div style={{ background: "linear-gradient(180deg,#ffe28a,#f2b632)", padding: "16px 34px", fontFamily: FONT, fontWeight: 900, fontSize: 90, color: "#3a2400", whiteSpace: "nowrap" }}>{n}</div>
        <div style={{ background: "linear-gradient(180deg,#1d2a3d,#0e1622)", padding: "16px 40px", fontFamily: FONT, fontWeight: 900, fontSize: 78, color: COL.ink, letterSpacing: 3, display: "flex", alignItems: "center", whiteSpace: "nowrap", textShadow: extrude(6, "#000") }}>{tx}</div>
      </div>
    </div>
  );
};

// los 120 cuartos: una grilla de puertitas que se encienden de golpe
export const Rooms: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { o } = pop(t, at, out); if (o < 0.01) return null;
  const n = Math.round(ei(t, at + 0.1, at + 1.8) * 120);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 30px)", gap: 8, padding: 24, ...dark }}>
        {Array.from({ length: 120 }, (_, i) => <div key={i} style={{ height: 44, borderRadius: 4, background: i < n ? "linear-gradient(180deg,#c9a35a,#7a5426)" : "rgba(255,255,255,.07)", boxShadow: i < n ? "inset 0 -3px 0 rgba(0,0,0,.3)" : undefined }} />)}
      </div>
      <Big s={110} c="#ffd08a" edge="#4a3010" style={{ marginTop: 24 }}>{n} CUARTOS</Big>
    </div>
  );
};

// reloj de pared: la aguja larga da UNA vuelta entera (una hora)
export const HourClock: React.FC<{ t: number; at: number; out: number; x: number; y: number; label?: string }> = ({ t, at, out, x, y, label = "1 HORA" }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const sw = ei(t, at + 0.2, at + 2.4), am = sw * 360 - 90, ah = sw * 30 + 60;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})`, display: "flex", alignItems: "center", gap: 34 }}>
      <svg width={320} height={320} viewBox="-160 -160 320 320" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <circle r={150} fill="#3b2a1c" /><circle r={134} fill="#fbf8ef" />
        <path d={`M0 0 L0 -134 A134 134 0 ${sw > 0.5 ? 1 : 0} 1 ${134 * Math.sin(sw * 2 * Math.PI)} ${-134 * Math.cos(sw * 2 * Math.PI)} Z`} fill="rgba(125,196,245,.4)" />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={118 * Math.sin(i * 0.5236)} y1={-118 * Math.cos(i * 0.5236)} x2={130 * Math.sin(i * 0.5236)} y2={-130 * Math.cos(i * 0.5236)} stroke="#33404d" strokeWidth={i % 3 ? 3 : 8} />)}
        <line x1={0} y1={0} x2={70 * Math.cos((ah * Math.PI) / 180)} y2={70 * Math.sin((ah * Math.PI) / 180)} stroke="#1d2733" strokeWidth={12} strokeLinecap="round" />
        <line x1={0} y1={0} x2={110 * Math.cos((am * Math.PI) / 180)} y2={110 * Math.sin((am * Math.PI) / 180)} stroke={COL.red} strokeWidth={7} strokeLinecap="round" />
        <circle r={12} fill="#222" />
      </svg>
      <Big s={120} c={COL.ink}>{label}</Big>
    </div>
  );
};

// flecha que gira hacia la izquierda alrededor de un punto (desenroscar)
export const TurnLeft: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { o } = pop(t, at, out); if (o < 0.01) return null;
  const a = ((t - at) * 140) % 360;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ transform: `rotate(${-a}deg)`, filter: "drop-shadow(0 0 16px rgba(255,214,10,.6))" }}>
        <path d="M0 -110 A110 110 0 1 0 105 -32" fill="none" stroke="#ffd60a" strokeWidth={18} strokeLinecap="round" />
        <path d="M-18 -132 L22 -110 L-18 -86 Z" fill="#ffd60a" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}><Big s={54} c="#ffd60a" edge="#5a4500">A LA IZQUIERDA</Big></div>
    </div>
  );
};

// escala de dureza: madera < cromo < piedra (la madera no raya el cromo)
export const Hardness: React.FC<{ t: number; at: number; out: number; y?: number }> = ({ t, at, out, y = 820 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const it = [{ tx: "MADERA", c: "#d9b47a", h: 0.3 }, { tx: "CROMO", c: "#dfe4e8", h: 0.65 }, { tx: "FIBRA VERDE", c: "#3f8a4c", h: 0.9 }];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, opacity: o, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 30 }}>
      {it.map((q, i) => { const g = ei(t, at + i * 0.25, at + i * 0.25 + 0.6); return (
        <div key={i} style={{ textAlign: "center", fontFamily: FONT }}>
          <div style={{ width: 200, height: 360 * q.h * g, borderRadius: "14px 14px 0 0", background: `linear-gradient(180deg, ${q.c}, rgba(0,0,0,.35))`, boxShadow: "0 20px 40px rgba(0,0,0,.5)", margin: "0 auto" }} />
          <div style={{ ...dark, borderRadius: 12, padding: "8px 14px", marginTop: 6, fontWeight: 900, fontSize: 30, color: COL.ink, transform: `scale(${0.7 + 0.3 * K(k)})` }}>{q.tx}</div>
        </div>); })}
      <div style={{ position: "absolute", bottom: 420, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.dim, letterSpacing: 6 }}>DUREZA</div>
    </div>
  );
};

// receta: dos cucharadas + una taza tibia (las cantidades caen como fichas)
export const Recipe: React.FC<{ t: number; at: number; at2: number; out: number; x: number; y: number }> = ({ t, at, at2, out, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const k2 = K(spr(t, at2));
  return (
    <div style={{ ...card, position: "absolute", left: x, top: y, opacity: o, padding: "26px 36px", transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - K(k)) * -80 - 8}deg)`, width: 640, whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: "#8a5a1e", letterSpacing: 4 }}>ÁCIDO CÍTRICO</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12 }}><span style={{ fontSize: 70 }}>🥄🥄</span><span style={{ fontWeight: 900, fontSize: 56, color: "#1d2733" }}>2 CUCHARADAS</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 8, opacity: k2, transform: `translateX(${(1 - k2) * 80}px)` }}><span style={{ fontSize: 70 }}>☕</span><span style={{ fontWeight: 900, fontSize: 56, color: "#1d2733" }}>1 TAZA TIBIA</span></div>
    </div>
  );
};

// comparación de precios: llave nueva + plomero contra la guía
export const PriceCompare: React.FC<{ t: number; at: number; plAt: number; gAt: number; twiceAt: number; out: number }> = ({ t, at, plAt, gAt, twiceAt, out }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const b1 = ei(t, at + 0.1, at + 1.0), pl = ei(t, plAt, plAt + 0.6), g = ei(t, gAt, gAt + 0.6), tw = K(spr(t, twiceAt, 0.9));
  const col = (h: number, c: string, label: React.ReactNode, val: React.ReactNode, w = 300) => <div style={{ textAlign: "center", fontFamily: FONT }}>
    <div style={{ fontWeight: 900, fontSize: 62, color: "#fff", textShadow: extrude(6, "#000"), marginBottom: 10 }}>{val}</div>
    <div style={{ width: w, height: h, borderRadius: "18px 18px 0 0", background: c, boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.3)", margin: "0 auto" }} />
    <div style={{ ...dark, borderRadius: 14, padding: "10px 18px", marginTop: 8, fontWeight: 900, fontSize: 34, color: COL.ink }}>{label}</div></div>;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, opacity: o, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 120, transform: `scale(${0.7 + 0.3 * K(k)})`, transformOrigin: "50% 100%" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        {col(400 * b1, "linear-gradient(180deg,#e05a4a,#8f2a20)", "LLAVE NUEVA", "US$ 40-80")}
        {pl > 0.01 && col(180 * pl, "linear-gradient(180deg,#ff9f43,#a35a10)", "+ PLOMERO", "+ $$", 200)}
      </div>
      {g > 0.01 && col(110 * g, "linear-gradient(180deg,#7dff9e,#1f8a4c)", "LA GUÍA", "US$ 17")}
      {tw > 0.02 && <div style={{ position: "absolute", top: -170, transform: `scale(${tw}) rotate(-6deg)`, border: "10px solid #7dff9e", borderRadius: 18, padding: "8px 34px", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#7dff9e", background: "rgba(0,30,10,.55)", whiteSpace: "nowrap" }}>SE PAGÓ 2 VECES</div>}
    </div>
  );
};

// cartel de ERROR numerado (1 de 5): la tarjeta roja cae y el número late
export const ErrorCard: React.FC<{ t: number; at: number; out: number; n: number; tx: string; x?: number; y?: number }> = ({ t, at, out, n, tx, x = 960, y = 170 }) => {
  const { k, o } = pop(t, at, out, 0.9); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - K(k)) * -260}px) rotate(${(1 - K(k)) * -14 - 2}deg)`, display: "flex", alignItems: "center", gap: 0, borderRadius: 22, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.65)", fontFamily: FONT }}>
      <div style={{ background: "linear-gradient(180deg,#ff5a4a,#a3170e)", padding: "14px 30px", color: "#fff", fontWeight: 900, fontSize: 40, letterSpacing: 4, textAlign: "center" }}>ERROR<div style={{ fontSize: 80, lineHeight: 1.1 }}>✗</div></div>
      <div style={{ background: "linear-gradient(180deg,#fbf8f1,#dcd6c8)", padding: "30px 44px", fontWeight: 900, fontSize: 60, lineHeight: 1.1, maxWidth: 1050, color: "#1d2733" }}>{tx}</div>
    </div>
  );
};

// un pelo contra la capa de cromo (más fina que un pelo)
export const HairVsChrome: React.FC<{ t: number; at: number; cAt: number; out: number; x: number; y: number }> = ({ t, at, cAt, out, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const c = e(t, cAt, cAt + 0.4);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * K(k)) * 1.45})`, display: "flex", alignItems: "center", gap: 90 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #6b4a33, #2a1a10 70%)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 10px #3a2618" }} />
        <Big s={56} c={COL.ink} style={{ marginTop: 20 }}>UN PELO</Big>
      </div>
      <div style={{ textAlign: "center", opacity: c }}>
        <div style={{ width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 300, height: 3, background: "linear-gradient(90deg,#fff,#cfd6dc,#fff)", boxShadow: "0 0 18px #fff, 0 0 40px rgba(143,214,255,.8)" }} /></div>
        <Big s={56} c={COL.ice} edge="#0a2a40" style={{ marginTop: 20 }}>EL CROMO</Big>
      </div>
    </div>
  );
};

// para qué sirve el cloro: dos blancos, uno acierta (moho) y otro no (sarro)
export const ClorTarget: React.FC<{ t: number; at: number; at2: number; out: number }> = ({ t, at, at2, out }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const k2 = K(spr(t, at2));
  const it = (ok: boolean, sw: string, tx: string, kk: number) => <div style={{ ...card, width: 460, padding: 24, textAlign: "center", transform: `translateY(${(1 - kk) * 200}px)`, opacity: kk }}>
    <div style={{ height: 200, borderRadius: 16, background: sw }} />
    <div style={{ fontWeight: 900, fontSize: 56, color: "#1d2733", marginTop: 12 }}>{tx}</div>
    <div style={{ fontWeight: 900, fontSize: 100, color: ok ? "#1d8a4c" : "#b3261e", lineHeight: 1 }}>{ok ? "✓" : "✗"}</div></div>;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, opacity: o, display: "flex", justifyContent: "center", gap: 70, fontFamily: FONT }}>
      {it(true, "radial-gradient(circle at 40% 40%, #1d1f1c, #4b524a 40%, #d9d6cc 75%)", "LO NEGRO · MOHO", K(k))}
      {it(false, "radial-gradient(circle at 50% 50%, #f6f2e6, #ddd2b4 60%, #c8bb98)", "LO BLANCO · SARRO", k2)}
      <div style={{ position: "absolute", top: -110, fontWeight: 900, fontSize: 64, color: COL.ink, textShadow: extrude(6, "#000") }}>EL CLORO SIRVE PARA…</div>
    </div>
  );
};

// la nube de gas: triángulo de peligro + nube que crece
export const GasWarn: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const g = e(t, at, at + 2.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: Math.cos(i * 0.7) * 160 * g - 120, top: Math.sin(i * 1.3) * 90 * g - 120, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(214,230,120,.45), rgba(214,230,120,0) 70%)", transform: `scale(${0.4 + g * 1.2 + 0.05 * Math.sin(t * 2 + i)})` }} />)}
      <svg width={320} height={290} viewBox="0 0 320 290" style={{ position: "relative", transform: `translate(-160px,-145px) scale(${0.6 + 0.4 * K(k)})`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <path d="M160 14 L306 270 L14 270 Z" fill="#ffd60a" stroke="#1d1d1d" strokeWidth={14} strokeLinejoin="round" />
        <text x={160} y={232} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill="#1d1d1d">!</text>
      </svg>
    </div>
  );
};

// almanaque que da vuelta la hoja: HOY cloro ✗ vinagre → MAÑANA ✓
export const NextDay: React.FC<{ t: number; at: number; flip: number; out: number; x: number; y: number }> = ({ t, at, flip, out, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const r = ei(t, flip, flip + 0.5) * 180;
  const face = (back: boolean): React.CSSProperties => ({ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: back ? "rotateX(180deg)" : undefined, ...card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 520, height: 520, opacity: o, perspective: 1400, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})` }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: "50% 50%", transform: `rotateX(${r}deg)` }}>
        <div style={face(false)}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "#c0392b" }} /><div style={{ fontWeight: 900, fontSize: 130, color: "#1d2733", marginTop: 80 }}>HOY</div><div style={{ fontWeight: 900, fontSize: 52, color: "#b3261e" }}>VINAGRE ✗</div></div>
        <div style={face(true)}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "#1f8a4c" }} /><div style={{ fontWeight: 900, fontSize: 92, color: "#1d2733", marginTop: 80 }}>MAÑANA</div><div style={{ fontWeight: 900, fontSize: 52, color: "#1d8a4c" }}>VINAGRE ✓</div></div>
      </div>
    </div>
  );
};

// toda la noche ✗ contra una hora ✓ (luna que cruza / sol)
export const NightVsHour: React.FC<{ t: number; at: number; at2: number; out: number }> = ({ t, at, at2, out }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const k2 = K(spr(t, at2)), m = e(t, at, at + 3);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, opacity: o, display: "flex", justifyContent: "center", gap: 70, fontFamily: FONT }}>
      <div style={{ ...dark, width: 560, height: 520, position: "relative", overflow: "hidden", transform: `scale(${0.7 + 0.3 * K(k)})` }}>
        {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 97) % 540, top: (i * 61) % 300, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)) }} />)}
        <div style={{ position: "absolute", left: 60 + m * 360, top: 130 - Math.sin(m * Math.PI) * 70, width: 110, height: 110, borderRadius: "50%", boxShadow: "-26px 10px 0 0 #f4ead0" }} />
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 70, color: COL.ink }}>12 HORAS <span style={{ color: COL.red }}>✗</span></div>
      </div>
      <div style={{ ...card, width: 440, height: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: k2, transform: `translateY(${(1 - k2) * 200}px)` }}>
        <div style={{ fontSize: 170 }}>⏱️</div>
        <div style={{ fontWeight: 900, fontSize: 76, color: "#1d2733" }}>1 HORA <span style={{ color: "#1d8a4c" }}>✓</span></div>
      </div>
    </div>
  );
};

// una de cada diez: diez llavecitas, nueve se ponen verdes ✓ y una roja ✗
export const OneInTen: React.FC<{ t: number; at: number; nineAt: number; out: number }> = ({ t, at, nineAt, out }) => {
  const { o } = pop(t, at, out); if (o < 0.01) return null;
  const n9 = e(t, nineAt, nineAt + 0.8);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, opacity: o, textAlign: "center", fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 22 }}>
        {Array.from({ length: 10 }, (_, i) => { const k = K(spr(t, at + i * 0.06)), bad = i === 6, c = bad ? COL.red : n9 > i / 10 ? "#7dff9e" : "#dfe4e8"; return (
          <svg key={i} width={130} height={200} viewBox="0 0 130 200" style={{ transform: `translateY(${(1 - k) * 150}px) scale(${bad ? 1.12 : 1})`, opacity: k, filter: `drop-shadow(0 0 ${bad ? 22 : 10}px ${c}88)` }}>
            <rect x={45} y={60} width={40} height={120} rx={10} fill={c} /><path d="M65 70 Q65 20 120 30" fill="none" stroke={c} strokeWidth={22} strokeLinecap="round" /><rect x={20} y={176} width={90} height={18} rx={8} fill={c} />
          </svg>); })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 120, marginTop: 30 }}>
        <Big s={74} c={COL.red} edge="#3a0a06">1 · CAMBIARLA</Big>
        <Big s={74} c="#7dff9e" edge="#0a3a1a" style={{ opacity: n9 }}>9 · VINAGRE</Big>
      </div>
    </div>
  );
};

// tarjeta de video del canal (sin marcas): "la regadera, ya en el canal"
export const VideoCard: React.FC<{ t: number; at: number; out: number; img: string; title: string; x: number; y: number }> = ({ t, at, out, img, title, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  return (
    <div style={{ ...dark, position: "absolute", left: x, top: y, opacity: o, width: 760, padding: 18, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${(1 - K(k)) * 70 - 10}deg) rotateX(4deg)` }}>
      <div style={{ position: "relative", height: 400, borderRadius: 16, overflow: "hidden", background: img ? `center/cover url(${img})` : "linear-gradient(180deg,#5d7d96,#23384a)" }}>
        {!img && <svg width="100%" height="100%" viewBox="0 0 720 400" style={{ position: "absolute", inset: 0 }}><path d="M120 60 L420 60 Q470 60 470 110 L470 150" fill="none" stroke="#dfe6ea" strokeWidth={22} strokeLinecap="round" /><ellipse cx={470} cy={170} rx={110} ry={30} fill="#e9eef1" /><ellipse cx={470} cy={176} rx={96} ry={20} fill="#b9c3c9" />{Array.from({ length: 13 }, (_, i) => <circle key={i} cx={390 + (i % 7) * 26 + (i > 6 ? 13 : 0)} cy={172 + (i > 6 ? 8 : -4)} r={5} fill={i % 3 ? "#f3ecd8" : "#3a4650"} />)}{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={420 + i * 25} y1={200} x2={400 + i * 30} y2={380} stroke="rgba(200,230,255,.55)" strokeWidth={4} />)}</svg>}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 130, height: 130, borderRadius: "50%", background: "rgba(0,0,0,.55)", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 0, height: 0, borderLeft: "46px solid #fff", borderTop: "28px solid transparent", borderBottom: "28px solid transparent", marginLeft: 12 }} /></div>
        <div style={{ position: "absolute", right: 14, bottom: 14, padding: "4px 12px", borderRadius: 8, background: "rgba(0,0,0,.75)", color: "#fff", fontWeight: 800, fontSize: 26 }}>YA EN EL CANAL</div>
      </div>
      <div style={{ color: COL.ink, fontWeight: 900, fontSize: 44, marginTop: 16 }}>{title}</div>
    </div>
  );
};

// LA RUTINA: almanaque de cuatro renglones que se arma con la voz (cada uso / semana / mes / 3 meses)
export const Routine: React.FC<{ t: number; rows: { at: number; when: string; what: string; ic: string }[]; out: number; hl?: number; x?: number; y?: number; sc?: number }> = ({ t, rows, out, hl = -1, x = 1440, y = 540, sc = 1 }) => (
  <div style={{ ...dark, position: "absolute", left: x, top: y, padding: "26px 30px", width: 760, opacity: e(t, rows[0].at, rows[0].at + 0.15) * (1 - e(t, out, out + 0.3)), transform: `translate(-50%,-50%) scale(${sc}) perspective(1400px) rotateY(-10deg)` }}>
    <div style={{ fontWeight: 800, fontSize: 30, color: COL.dim, letterSpacing: 6, marginBottom: 12 }}>PARA QUE NO VUELVA</div>
    {rows.map((r, i) => { const k = K(spr(t, r.at)), on = i === hl; return (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 14px", borderRadius: 14, marginTop: 8, opacity: k, transform: `translateX(${(1 - k) * 120}px) scale(${on ? 1.04 : 1})`, background: on ? "linear-gradient(90deg, rgba(255,214,10,.28), rgba(255,214,10,.05))" : "rgba(255,255,255,.04)", boxShadow: on ? "0 0 0 3px rgba(255,214,10,.8)" : undefined }}>
        <span style={{ fontSize: 50, width: 64, textAlign: "center" }}>{r.ic}</span>
        <div><div style={{ fontWeight: 900, fontSize: 40, color: on ? "#ffd60a" : COL.ink }}>{r.when}</div><div style={{ fontWeight: 700, fontSize: 28, color: COL.dim }}>{r.what}</div></div>
      </div>); })}
  </div>
);

// dos minutos por semana contra un sábado entero cada seis meses (balanza que se inclina)
export const TwoMinVsSat: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const tilt = ei(t, at + 0.8, at + 1.8) * 12;
  return (
    <div style={{ position: "absolute", left: 960, top: 830, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * K(k)})` }}>
      <div style={{ width: 1100, height: 14, borderRadius: 7, background: "#dfe4e8", transform: `rotate(${-tilt}deg)`, position: "relative", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>
        <div style={{ ...card, position: "absolute", left: 0, bottom: 24, padding: "14px 26px", fontWeight: 900, fontSize: 50, color: "#1d8a4c", transform: `rotate(${tilt}deg)` }}>2 MIN / SEMANA</div>
        <div style={{ ...dark, position: "absolute", right: 0, bottom: 24, padding: "14px 26px", fontWeight: 900, fontSize: 50, color: COL.red, transform: `rotate(${tilt}deg)` }}>😩 UN SÁBADO ENTERO</div>
      </div>
      <div style={{ width: 0, height: 0, margin: "0 auto", borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: "70px solid #9aa3aa" }} />
    </div>
  );
};

// EL REPASO: la lista se arma renglón por renglón y cada uno se tilda
export const Recap: React.FC<{ t: number; rows: { at: number; tx: string; no?: boolean }[]; out: number }> = ({ t, rows, out }) => {
  const o = e(t, rows[0].at - 0.2, rows[0].at) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  return (
    <div style={{ ...card, position: "absolute", left: 40, top: 150, width: 720, height: 780, padding: "26px 30px", opacity: o, overflow: "hidden", transform: "perspective(1400px) rotateY(8deg)", background: "repeating-linear-gradient(180deg, #fbf8ef 0 57px, #c9d6e6 57px 58px)" }}>
      <div style={{ fontWeight: 900, fontSize: 38, color: "#8a5a1e", letterSpacing: 4, marginBottom: 14 }}>EL REPASO DEL TÍO CHENCHO</div>
      {rows.map((r, i) => { const w = e(t, r.at, r.at + 0.35), ck = e(t, r.at + 0.35, r.at + 0.55); return (
        <div key={i} style={{ height: 58, display: "flex", alignItems: "center", gap: 14, clipPath: `inset(0 ${100 - 100 * w}% 0 0)` }}>
          <span style={{ fontSize: 40, color: r.no ? COL.red : "#1d8a4c", fontWeight: 900, transform: `scale(${ck})`, width: 44 }}>{r.no ? "✗" : "✓"}</span>
          <span style={{ fontWeight: 800, fontSize: 32, color: "#1f3557", whiteSpace: "nowrap" }}>{r.tx}</span>
        </div>); })}
    </div>
  );
};

// el comentario que se escribe solo: "chorro torcido"
export const Comment: React.FC<{ t: number; at: number; typeAt: number; out: number; text: string; x: number; y: number }> = ({ t, at, typeAt, out, text, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const n = Math.round(e(t, typeAt, typeAt + 1.2) * text.length), sent = e(t, typeAt + 1.5, typeAt + 1.8);
  return (
    <div style={{ ...dark, position: "absolute", left: x, top: y, opacity: o, width: 900, padding: "24px 30px", transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * K(k)})`, display: "flex", gap: 22, alignItems: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, background: "linear-gradient(135deg,#6fb4ff,#2f6db3)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ color: COL.dim, fontWeight: 800, fontSize: 26 }}>Agregar un comentario…</div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 52, borderBottom: "3px solid rgba(255,255,255,.4)", paddingBottom: 6, minHeight: 64 }}>{text.slice(0, n)}<span style={{ opacity: Math.sin(t * 8) > 0 && n < text.length ? 1 : 0 }}>|</span></div>
      </div>
      <div style={{ padding: "12px 24px", borderRadius: 30, background: sent > 0.5 ? "#7dff9e" : "#3a7bd5", color: sent > 0.5 ? "#0a3a1a" : "#fff", fontWeight: 900, fontSize: 32, transform: `scale(${1 + 0.15 * Math.sin(sent * Math.PI)})` }}>{sent > 0.5 ? "✓" : "COMENTAR"}</div>
    </div>
  );
};

// el avatar en una medalla redonda (CTA2), con el nombre en cinta
export const AvBadge: React.FC<{ t: number; at: number; out: number; x: number; y: number; children: React.ReactNode }> = ({ t, at, out, x, y, children }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * K(k)})` }}>
      <div style={{ width: 520, height: 520, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 12px #f2b632, 0 50px 100px rgba(0,0,0,.7)", position: "relative" }}>{children}</div>
      <div style={{ position: "absolute", left: "50%", bottom: -30, transform: "translateX(-50%)", padding: "8px 30px", borderRadius: 12, background: "linear-gradient(180deg,#ffe28a,#f2b632)", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#3a2400", whiteSpace: "nowrap" }}>CLAUDIO · MI GUÍA</div>
    </div>
  );
};
