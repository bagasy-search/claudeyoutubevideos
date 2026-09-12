// Lámina de conversión — "El mapa del techo de chapa" (corte capa por capa).
// Componente Remotion full-screen, texto en español (no horneado). Paleta THEME_EARTH.
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const C = {
  bg0: "#EFE7D3", bg1: "#E6DCC4", paper: "#F5EEDC", ink: "#2A2620",
  soft: "rgba(42,38,32,0.62)", line: "rgba(42,38,32,0.18)",
  gold: "#A9794A", danger: "#B0503C", good: "#6E8B47", metal: "#9AA0A2",
};
const SERIF = "Georgia, 'Times New Roman', serif";

const LAYERS = [
  { key: "chapa", label: "Chapa (metal)", sub: "el punto de partida", fill: C.metal, txt: "#2A2620", h: 46, corr: true },
  { key: "conv", label: "Convertidor de óxido", sub: "detiene el óxido — se vuelve negro", fill: "#20201E", txt: "#EDE7D6", h: 34 },
  { key: "banda", label: "Banda de refuerzo", sub: "sobre cada tornillo y unión", fill: "#C9BE9E", txt: "#2A2620", h: 40, screws: true },
  { key: "m1", label: "1ª mano de membrana", sub: "bien cargada, en un sentido", fill: "#EFEAD8", txt: "#2A2620", h: 34 },
  { key: "m2", label: "2ª mano cruzada", sub: "perpendicular, tapa las zonas finas", fill: "#F6F2E6", txt: "#2A2620", h: 34, hatch: true },
  { key: "top", label: "Blanco reflectivo", sub: "baja la temperatura de la chapa", fill: "#FFFFFF", txt: "#2A2620", h: 30 },
];
const GAP = 34;

const Corrugated: React.FC<{ w: number; y: number; fill: string }> = ({ w, y, fill }) => {
  const step = 26, amp = 7;
  let d = `M0 ${y}`;
  for (let x = 0; x <= w; x += step) d += ` Q ${x + step / 2} ${y - amp} ${x + step} ${y}`;
  return <path d={d} stroke={fill} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.9} />;
};

export const LaminaChapa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = (delay: number) => {
    const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
    return { opacity: s, transform: `translateY(${(1 - s) * 26}px)` };
  };
  // stack geometry (side view), bottom→top
  const stackX = 150, stackW = 560, baseY = 800;
  let acc = 0;
  const geo = LAYERS.map((L, i) => { const yTop = baseY - acc - L.h; acc += L.h + GAP; return { ...L, yTop, i }; });

  const tFill = interpolate(frame, [70, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 120% at 30% 0%, ${C.paper} 0%, ${C.bg0} 60%, ${C.bg1} 100%)`, fontFamily: SERIF, color: C.ink, padding: "48px 64px" }}>
      {/* header */}
      <div style={{ ...rise(0) }}>
        <div style={{ fontSize: 20, letterSpacing: 4, color: C.gold, fontWeight: 700 }}>GUÍA DEL CONSTRUCTOR LIBRE</div>
        <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.02, marginTop: 6 }}>El mapa del techo de chapa</div>
        <div style={{ fontSize: 26, color: C.soft, marginTop: 6 }}>Cómo se arma el sellado, capa por capa</div>
      </div>

      {/* cross-section SVG */}
      <svg width={1180} height={840} style={{ position: "absolute", left: 40, top: 150 }}>
        {geo.map((L) => {
          const st = rise(18 + L.i * 12);
          return (
            <g key={L.key} style={{ opacity: (st.opacity as number) }}>
              <rect x={stackX} y={L.yTop} width={stackW} height={L.h} rx={5} fill={L.fill} stroke={C.line} />
              {L.corr && <g transform={`translate(${stackX},${L.yTop + L.h - 4})`}><Corrugated w={stackW} y={0} fill="#6f7477" /></g>}
              {L.hatch && Array.from({ length: 16 }).map((_, k) => (
                <line key={k} x1={stackX + k * 40} y1={L.yTop + L.h} x2={stackX + k * 40 + L.h} y2={L.yTop} stroke="rgba(124,138,90,0.5)" strokeWidth={2} />
              ))}
              {L.screws && [0.2, 0.5, 0.8].map((f, k) => (
                <g key={k}>
                  <circle cx={stackX + stackW * f} cy={L.yTop + L.h / 2} r={9} fill={C.danger} />
                  <circle cx={stackX + stackW * f} cy={L.yTop + L.h / 2} r={9} fill="none" stroke="#7a2f22" strokeWidth={2} />
                </g>
              ))}
              {/* connector + label */}
              <line x1={stackX + stackW} y1={L.yTop + L.h / 2} x2={stackX + stackW + 60} y2={L.yTop + L.h / 2} stroke={C.gold} strokeWidth={2} />
              <circle cx={stackX + stackW + 60} cy={L.yTop + L.h / 2} r={4} fill={C.gold} />
              <text x={stackX + stackW + 74} y={L.yTop + L.h / 2 - 2} fontSize={26} fontWeight={800} fill={C.ink} fontFamily={SERIF}>{L.label}</text>
              <text x={stackX + stackW + 74} y={L.yTop + L.h / 2 + 24} fontSize={19} fill={C.soft} fontFamily={SERIF}>{L.sub}</text>
            </g>
          );
        })}
        {/* water arrow entering at a screw (top) */}
      </svg>

      {/* right column: thermometer comparison */}
      <div style={{ position: "absolute", right: 70, top: 210, width: 470, ...rise(90) }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.gold, letterSpacing: 1 }}>EL COLOR NO ES ESTÉTICA</div>
        <div style={{ display: "flex", gap: 40, marginTop: 24, alignItems: "flex-end" }}>
          {[{ n: "Chapa oscura", t: 65, c: C.danger, fillPct: 0.95 }, { n: "Blanco reflectivo", t: 45, c: C.good, fillPct: 0.62 }].map((th) => (
            <div key={th.n} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ position: "relative", height: 300, width: 46, margin: "0 auto", border: `4px solid ${C.ink}`, borderRadius: 26, background: C.paper, overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${th.fillPct * tFill * 100}%`, background: th.c }} />
              </div>
              <div style={{ fontSize: 40, fontWeight: 900, marginTop: 10, color: th.c }}>{Math.round(th.t * tFill)}°</div>
              <div style={{ fontSize: 20, color: C.soft }}>{th.n}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 22, color: C.ink, marginTop: 18, textAlign: "center" }}>El blanco puede bajar <b>20° o más</b> la chapa.</div>
      </div>

      {/* bottom strip: mini tabla */}
      <div style={{ position: "absolute", left: 64, right: 64, bottom: 40, ...rise(120) }}>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { k: "1", a: "Chapa seca y limpia", b: "óxido flojo afuera" },
            { k: "2", a: "Convertidor de óxido", b: "esperá que se ponga negro" },
            { k: "3", a: "Banda en tornillos y uniones", b: "malla embebida" },
            { k: "4", a: "Dos manos cruzadas", b: "dejá curar, no solo secar" },
          ].map((r) => (
            <div key={r.k} style={{ flex: 1, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 16px", display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: C.gold, color: "#F7F1DF", fontWeight: 900, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.k}</div>
              <div><div style={{ fontSize: 21, fontWeight: 800 }}>{r.a}</div><div style={{ fontSize: 17, color: C.soft }}>{r.b}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaminaChapa;
