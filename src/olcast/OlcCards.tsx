// OlcCards — tarjetas-pago del guion de olcast: StoreVsCamp (se da vuelta), SmokeLadder (aceites y humo),
// LayerCount (capas finísimas), FirstWeeks (qué cocinar primero) y FixTable (problema → arreglo).
// Datos = los del add-on de hierro de Ole (upsell.json) y fuentes de research_verdad.md.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { OLE, LABEL, SERIF, HAND, SANS, hexA, rnd, Wood, Paper, Kicker, Pencil, Seal, cl, eo, ramp, useT, useIO } from "./OlcKit";

// ─────────────────────────────── StoreVsCamp ───────────────────────────────
const PanSection: React.FC<{ thick: boolean; w?: number }> = ({ thick, w = 980 }) => {
  // corte del hierro con sus poros y la capa: gruesa y blanda (tienda) o finísima y pegada (campamento)
  const pts: string[] = [];
  const N = 60;
  for (let i = 0; i <= N; i++) { const x = (i / N) * w; const pit = Math.max(0, Math.sin(i * 1.7) * Math.sin(i * 0.63 + 1)) * 16 + rnd(i + 3) * 5; pts.push(`${x},${112 - pit}`); }
  const iron = `M 0 200 L 0 112 ${pts.map((p) => "L " + p).join(" ")} L ${w} 200 Z`;
  const th = thick ? 34 : 6;
  const layer = `M 0 ${112 - th} ${pts.map((p, i) => { const [x, y] = p.split(",").map(Number); return `L ${x} ${Math.min(y, 108) - th}`; }).join(" ")} L ${w} 200 L 0 200 Z`;
  return (
    <svg width={w} height={200} viewBox={`0 0 ${w} 200`} style={{ display: "block", margin: "0 auto" }}>
      <path d={iron} fill="#5B5651" />
      <path d={layer} fill={thick ? "#8A6A2F" : "#141416"} opacity={thick ? 0.95 : 1} />
      <path d={iron} fill="#5B5651" opacity={thick ? 0 : 0.0} />
      {thick ? <path d={`M ${w * 0.62} ${112 - th} q 30 -26 62 -10 l -10 8 z`} fill="#8A6A2F" stroke="#5a4319" strokeWidth={2} /> : null}
      <text x={w - 6} y={26} textAnchor="end" fontFamily={LABEL} fontSize={20} letterSpacing={4} fill={OLE.mute}>{thick ? "ONE THICK COAT · SOFT UNDERNEATH" : "THIN LAYERS · BONDED IN THE PITS"}</text>
    </svg>
  );
};
export const OlcStoreVsCamp: React.FC<{ flipAt?: number; storeLines?: string[]; campLines?: string[] }> = ({
  flipAt = 3, storeLines = ["one thick, shiny coat", "bake it once and call it done", "tacky in a week, flaking by the month"], campLines = ["a few drops, then wipe it ALL off", "450–500°F · one hour · upside down", "3 to 5 thin coats, then cook in it"],
}) => {
  const { t } = useT(); const io = useIO();
  const rot = interpolate(t, [flipAt, flipAt + 0.7], [0, 180], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const lift = Math.sin(Math.min(1, Math.max(0, (t - flipAt) / 0.7)) * Math.PI) * 60;
  const face = (title: string, color: string, lines: string[], thick: boolean, verdict: string, ok: boolean, back: boolean) => (
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: back ? "rotateY(180deg)" : undefined, background: OLE.paper, borderRadius: 6, padding: "42px 54px", boxSizing: "border-box",
      boxShadow: `0 26px 50px ${OLE.shadow}`, border: `6px solid ${color}` }}>
      <Kicker color={color} size={28}>{ok ? "OLE'S WAY" : "NOT OLE'S WAY"}</Kicker>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color, lineHeight: 1, margin: "10px 0 20px", letterSpacing: -1 }}>{title}</div>
      <PanSection thick={thick} />
      <div style={{ marginTop: 18 }}>
        {lines.map((l, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: OLE.pencil, lineHeight: 1.25, opacity: ramp(t, (back ? flipAt + 0.6 : 0.2) + i * 0.35, (back ? flipAt + 0.6 : 0.2) + i * 0.35 + 0.4), transform: `translateX(${(1 - ramp(t, (back ? flipAt + 0.6 : 0.2) + i * 0.35, (back ? flipAt + 0.6 : 0.2) + i * 0.35 + 0.4)) * -30}px)` }}>{ok ? "✓ " : "✗ "}{l}</div>)}
      </div>
      <div style={{ position: "absolute", right: 46, bottom: 34, fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 8, color }}>{verdict}</div>
    </div>
  );
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io, perspective: 2200 }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 1120, height: 700, transform: `translate(-50%, -50%) translateY(${-lift}px) rotateY(${rot}deg) rotateZ(-1.5deg)`, transformStyle: "preserve-3d" }}>
          {face("THE STORE WAY", OLE.plaid, storeLines, true, "STICKY", false, false)}
          {face("THE CAMP WAY", OLE.forest, campLines, false, "SLICK", true, true)}
        </div>
      </AbsoluteFill>
    </Wood>
  );
};

// ─────────────────────────────── SmokeLadder ───────────────────────────────
type Oil = { name: string; f: number; color: string; at: number | string };
export const OlcSmokeLadder: React.FC<{ at?: (number | string)[]; ovenAt?: number | string }> = ({ at = [1, 3.5, 6, 9], ovenAt = 12.5 }) => {
  const { t } = useT(); const io = useIO();
  const oils: Oil[] = [
    { name: "BUTTER", f: 350, color: "#E8C55A", at: at[0] as any },
    { name: "LARD", f: 370, color: "#EDE4CF", at: at[1] as any },
    { name: "REFINED CANOLA", f: 400, color: "#D9B23A", at: at[2] as any },
    { name: "PLAIN VEGETABLE OIL", f: 450, color: "#C99A2A", at: at[3] as any },
  ];
  const Y = (f: number) => 880 - ((f - 300) / 220) * 700; // 300°F abajo, 520°F arriba
  const oven = ramp(t, +ovenAt, +ovenAt + 0.8);
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <Paper w={1180} h={960} rot={-0.6} pad={0}>
          <div style={{ position: "absolute", left: 60, top: 36 }}><Kicker size={26}>WHEN THE OIL STARTS TO SMOKE</Kicker>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: OLE.forest, lineHeight: 1, marginTop: 8 }}>Smoke point ladder</div></div>
          <svg width={1180} height={960} viewBox="0 0 1180 960" style={{ position: "absolute", inset: 0 }}>
            {[300, 350, 400, 450, 500].map((f) => <g key={f}><line x1={390} x2={470} y1={Y(f) - 40} y2={Y(f) - 40} stroke={OLE.pencil} strokeWidth={3} />
              <text x={368} y={Y(f) - 28} textAnchor="end" fontFamily={LABEL} fontWeight={600} fontSize={34} fill={OLE.pencil}>{f}°F</text></g>)}
            <rect x={470} y={Y(520) - 40} width={34} height={Y(300) - Y(520) + 40} rx={17} fill="#DCD2B8" stroke={OLE.pencil} strokeWidth={3} />
            {(() => { const top = oils.reduce((m, o) => (t >= (+o.at || 0) ? Math.max(m, o.f) : m), 300); const y = Y(top) - 40; return <rect x={479} y={y} width={16} height={Y(300) + 40 - y - 8} rx={8} fill={OLE.plaid} />; })()}
            <circle cx={487} cy={Y(300) + 10} r={34} fill={OLE.plaid} stroke={OLE.pencil} strokeWidth={3} />
            {/* banda del horno 450–500 */}
            <rect x={540} y={Y(500) - 40} width={520} height={Y(450) - Y(500)} rx={8} fill={hexA(OLE.fire, 0.22 * oven)} stroke={hexA(OLE.fire, oven)} strokeWidth={4} strokeDasharray="14 8" />
            <text x={1045} y={Y(475) - 40 + 14} textAnchor="end" fontFamily={LABEL} fontWeight={700} fontSize={36} letterSpacing={6} fill={hexA(OLE.fire, oven)}>OVEN · 450–500°F</text>
          </svg>
          {(() => { const ys: number[] = []; const order = oils.map((o, i) => i).sort((a, b) => oils[b].f - oils[a].f); const place: Record<number, number> = {}; let prev = -1e9;
            for (const i of order) { const ideal = Y(oils[i].f) - 40 - 42; const y = Math.max(ideal, prev + 104); place[i] = y; prev = y; ys.push(y); }
            return oils.map((o, i) => { const p = ramp(t, +o.at, +o.at + 0.5); const ty = place[i];
              return (
                <div key={o.name} style={{ position: "absolute", left: 590, top: ty, opacity: p, transform: `translateX(${(1 - p) * 60}px)`, display: "flex", alignItems: "center", gap: 20 }}>
                  <svg width={54} height={84}><rect x={14} y={2} width={26} height={16} fill="#3a3733" rx={3} /><rect x={6} y={16} width={42} height={64} rx={10} fill={o.color} stroke={OLE.pencil} strokeWidth={3} /><rect x={12} y={36} width={30} height={22} fill={hexA("#ffffff", 0.55)} rx={3} /></svg>
                  <div><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 3, color: OLE.forest, lineHeight: 1 }}>{o.name}</div>
                    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: OLE.plaid, lineHeight: 1.1 }}>smokes ≈ {o.f}°F</div></div>
                  <svg width={70} height={20} style={{ position: "absolute", left: -110, top: 42 + (Y(o.f) - 40 - (ty + 42)) + 0 }}><line x1={0} x2={70} y1={10} y2={10} stroke={hexA(OLE.pencil, 0.6)} strokeWidth={3} strokeDasharray="5 5" /></svg>
                </div>);
            }); })()}
          <div style={{ position: "absolute", left: 60, bottom: 30, fontFamily: HAND, fontWeight: 700, fontSize: 34, color: OLE.mute }}>rough numbers · they change by brand and how refined the oil is</div>
        </Paper>
      </AbsoluteFill>
    </Wood>
  );
};

// ─────────────────────────────── LayerCount ────────────────────────────────
export const OlcLayerCount: React.FC<{ n?: number; label?: string }> = ({ n = 5, label = "THIN EACH TIME" }) => {
  const { t, dur } = useT(); const io = useIO();
  const per = (dur - 2.2) / n;
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <Paper w={1240} h={780} rot={0.8}>
          <Kicker>THE BASE</Kicker>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: OLE.forest, lineHeight: 1, marginTop: 10 }}>Three to five coats</div>
          <svg width={1170} height={430} viewBox="0 0 1170 430" style={{ marginTop: 26 }}>
            <rect x={30} y={300} width={1110} height={120} fill="#5B5651" />
            {Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={50 + i * 46 + rnd(i) * 12} cy={302 + rnd(i + 9) * 8} r={8 + rnd(i + 4) * 8} fill="#3d3a36" />)}
            {Array.from({ length: n }).map((_, k) => {
              const p = ramp(t, 0.7 + k * per, 0.7 + k * per + Math.min(1, per * 0.8));
              const h = 12;
              return <rect key={k} x={30} y={300 - (k + 1) * h} width={1110 * p} height={h - 1} fill={`hsl(${230}, ${10 + k * 2}%, ${8 + (n - k) * 1.4}%)`} />;
            })}
            {Array.from({ length: n }).map((_, k) => { const p = ramp(t, 0.9 + k * per, 1.2 + k * per); return (
              <g key={"n" + k} opacity={p} transform={`translate(${60 + k * 216}, ${70 - (1 - p) * 20})`}>
                <rect x={0} y={0} width={190} height={62} rx={31} fill={OLE.paper} stroke={OLE.plaid} strokeWidth={4} /><text x={95} y={44} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={40} fill={OLE.plaid}>coat {k + 1}</text></g>); })}
          </svg>
          <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginTop: -8 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: OLE.fire, lineHeight: 0.8, minWidth: 120 }}>{Math.min(n, Math.max(1, 1 + Math.floor((t - 0.7) / per)))}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, letterSpacing: 8, color: OLE.forest }}>of {n} · {label}</div>
          </div>
        </Paper>
      </AbsoluteFill>
    </Wood>
  );
};

// ─────────────────────────────── FirstWeeks ────────────────────────────────
export const OlcFirstWeeks: React.FC<{ hold?: string[]; fine?: string[]; okAt?: number | string }> = ({
  hold = ["long simmers of tomato", "wine", "vinegar", "lemon juice"], fine = ["a quick tomato sauce · 20–30 min", "bacon · sausage · cornbread"], okAt = 6,
}) => {
  const { t, dur } = useT(); const io = useIO();
  const ok = ramp(t, +okAt, +okAt + 0.6);
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <Paper w={1300} h={800} rot={-0.9} pad={48}>
          <Kicker>THE FIRST FEW WEEKS</Kicker>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: OLE.forest, lineHeight: 1, margin: "8px 0 26px" }}>A new coat is tender</div>
          <div style={{ display: "flex", gap: 60 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 8, color: OLE.plaid, marginBottom: 12 }}>HOLD OFF ON</div>
              {hold.map((h, i) => { const p = ramp(t, 0.5 + i * 0.6, 1.0 + i * 0.6); return <div key={h} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: OLE.pencil, opacity: p, transform: `translateX(${(1 - p) * -40}px)`, position: "relative", lineHeight: 1.25 }}>
                {h}<div style={{ position: "absolute", left: 0, right: 0, top: "58%", height: 6, background: OLE.plaid, width: `${ramp(t, 1.0 + i * 0.6, 1.5 + i * 0.6) * 100}%`, borderRadius: 3 }} /></div>; })}
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: OLE.mute, marginTop: 14, opacity: ramp(t, 3.4, 3.9) }}>acid dulls the coat and pulls a metal taste</div>
            </div>
            <div style={{ flex: 1, opacity: ok, transform: `translateY(${(1 - ok) * 40}px)` }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 8, color: OLE.forest, marginBottom: 12 }}>PERFECTLY FINE</div>
              {fine.map((h) => <div key={h} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: OLE.forest, lineHeight: 1.25 }}>✓ {h}</div>)}
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: OLE.mute, marginTop: 14 }}>a day-long chili in a young pan? might not be</div>
            </div>
          </div>
        </Paper>
      </AbsoluteFill>
    </Wood>
  );
};

// ─────────────────────────────── FixTable ──────────────────────────────────
export type Fix = { problem: string; cause: string; fix: string; at: number | string };
export const OlcFixTable: React.FC<{ rows?: Fix[] }> = ({ rows = [
  { problem: "STICKY OR GUMMY", cause: "too much oil", fix: "bake upside down, 450–500°F, 1 hr · still tacky? scrub it back and go thinner", at: 0.6 },
  { problem: "FLAKING BLACK BITS", cause: "thick coat baked on", fix: "scrape it off · re-season in thin coats", at: 8.5 },
  { problem: "FOOD STICKS", cause: "pan too cold going in", fix: "preheat longer · add a little fat", at: 15.5 },
] }) => {
  const { t } = useT(); const io = useIO();
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <Paper w={1620} h={900} rot={0.5} pad={44}>
          <Kicker>WHEN THE PAN MISBEHAVES</Kicker>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: OLE.forest, lineHeight: 1, margin: "6px 0 22px" }}>Find it. Fix it.</div>
          {rows.map((r, i) => { const p = ramp(t, +r.at, +r.at + 0.6); return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "480px 60px 1fr", alignItems: "center", gap: 20, padding: "20px 0", borderTop: `3px solid ${hexA(OLE.pencil, 0.35)}`, opacity: p, transform: `translateY(${(1 - p) * 36}px)` }}>
              <div><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: OLE.plaid }}>{r.problem}</div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: OLE.mute }}>{r.cause}</div></div>
              <svg width={60} height={30}><path d="M2 15 H48 M36 4 L50 15 L36 26" stroke={OLE.fire} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: OLE.forest, lineHeight: 1.2 }}>{r.fix}</div>
            </div>); })}
        </Paper>
      </AbsoluteFill>
    </Wood>
  );
};
