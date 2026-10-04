// Kit del video earldock ($5 en el muelle, $16 en el súper). Tres piezas con profundidad (cama + plano medio +
// hielo/gotas al frente), en el idioma del galpón de Earl:
//   ElPriceChain — el camino del camarón: estaciones en fila (muelle → cabezas → planta → frío → camión →
//                  mayorista → súper) y una etiqueta que viaja y va subiendo de precio en cada parada
//   ElHeadsOff   — un camarón entero en la balanza: la cabeza se separa, la balanza baja a 2/3 y el precio por
//                  libra de colas sube solo
//   ElBagReader  — una bolsa de camarón congelado que se da vuelta; una lupa recorre la etiqueta de atrás y marca
//                  país de origen, silvestre/criadero, ingredientes y conteo
// Textos SIEMPRE por props.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EL, LABEL, MARKER, STENCIL, hexA, rnd } from "./ElTheme";
import { ElBed, Stamp, Tape, ease } from "./ElParts";

const Ice: React.FC<{ n?: number; seed?: number }> = ({ n = 26, seed = 3 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: number) => rnd(seed * 17 + i * 5 + k); const s = 6 + r(1) * 14;
        const y = ((r(2) * 1100 + f * (0.6 + r(3))) % 1140) - 30; const x = r(4) * 1920 + Math.sin(f / 30 + i) * 12;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: 3, transform: `rotate(${f * (r(5) - 0.5) * 2}deg)`, background: "rgba(220,238,244,0.55)", border: "1px solid rgba(255,255,255,0.7)" }} />;
      })}
    </AbsoluteFill>
  );
};
const Title: React.FC<{ t: string; top?: number }> = ({ t, top = 44 }) => <div style={{ position: "absolute", top, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 58, color: EL.white, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{t}</div>;

const ShrimpSvg: React.FC<{ w: number; head?: boolean; headOff?: number }> = ({ w, head = true, headOff = 0 }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 300 180" style={{ overflow: "visible" }}>
    {/* cola + cuerpo en segmentos */}
    <path d="M40 120 C 30 90, 50 60, 90 52 L 190 48 C 210 48, 214 70, 200 84 L 110 112 C 90 120, 70 140, 60 160 L 30 168 Z" fill={EL.shrimp} stroke="#C96B45" strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${100 + i * 24} 52 C ${104 + i * 24} 70, ${102 + i * 24} 90, ${96 + i * 24} 106`} stroke="#C96B45" strokeWidth={4} fill="none" />)}
    <path d="M30 168 L 10 150 L 22 176 Z M30 168 L 52 178 L 40 160 Z" fill="#E9845D" />
    {head ? (
      <g transform={`translate(${headOff * 70} ${-headOff * 40}) rotate(${headOff * 18} 230 70)`}>
        <path d="M196 46 C 230 30, 280 40, 290 70 C 282 92, 240 98, 202 86 Z" fill="#E98D66" stroke="#C96B45" strokeWidth={5} />
        <circle cx={262} cy={58} r={6} fill="#1B1F24" />
        <path d="M285 64 C 320 40, 360 30, 390 34 M286 70 C 320 64, 360 66, 392 74" stroke="#C96B45" strokeWidth={3} fill="none" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${214 + i * 14} 88 L ${206 + i * 16} 120`} stroke="#C96B45" strokeWidth={3} />)}
      </g>
    ) : null}
  </svg>
);

// ── la cadena del precio ───────────────────────────────────────────────────────────────────────────────────────
export const ElPriceChain: React.FC<{ stops: { label: string; price: string; icon?: string }[]; title?: string; every?: number; bed?: string; final?: string }> = ({ stops, title = "where your $16 goes", every = 34, bed, final = "the shrimper gets the smallest slice" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const n = stops.length; const x0 = 150, x1 = 1770; const step = (x1 - x0) / (n - 1);
  const t = interpolate(f, [10, 10 + (n - 1) * every], [0, n - 1], ease);
  const cur = Math.min(n - 1, Math.floor(t + 0.001)); const tagX = x0 + t * step;
  const bob = Math.sin(f / 5) * 4;
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={41} dim={0.66} />
      <Title t={title} />
      {/* la cinta / la ruta */}
      <div style={{ position: "absolute", left: x0, right: 1920 - x1, top: 560, height: 22, borderRadius: 11, background: hexA(EL.rope, 0.9), boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", left: x0, width: tagX - x0, top: 560, height: 22, borderRadius: 11, background: EL.buoy }} />
      {stops.map((s, i) => {
        const on = t >= i - 0.05; const k = spring({ frame: f - 10 - i * every, fps, config: { damping: 12 } });
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x0 + i * step - 46, top: 525, width: 92, height: 92, borderRadius: 46, background: on ? EL.cooler : hexA(EL.cooler, 0.35), border: `6px solid ${on ? EL.buoy : "rgba(255,255,255,0.4)"}`, transform: `scale(${0.8 + 0.2 * k})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: STENCIL, fontSize: 36, color: EL.marker }}>{i + 1}</div>
            <div style={{ position: "absolute", left: x0 + i * step - 120, top: i % 2 ? 650 : 380, width: 260, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: on ? EL.white : "rgba(255,255,255,0.45)", textTransform: "uppercase", textShadow: "0 3px 8px rgba(0,0,0,0.6)" }}>{s.label}</div>
          </React.Fragment>
        );
      })}
      {/* la etiqueta que viaja */}
      <div style={{ position: "absolute", left: tagX - 120, top: 230 + bob, width: 240, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "14px 26px", background: EL.cooler, borderRadius: 12, border: `5px solid ${EL.marker}`, boxShadow: "0 18px 30px rgba(0,0,0,0.45)" }}>
          <div style={{ fontFamily: MARKER, fontSize: 30, color: EL.inkSoft }}>per pound</div>
          <div style={{ fontFamily: STENCIL, fontSize: 84, color: cur === n - 1 ? EL.red : EL.marker, lineHeight: 1 }}>{stops[cur].price}</div>
        </div>
        <div style={{ width: 4, height: 120, background: EL.marker, margin: "0 auto" }} />
      </div>
      <div style={{ position: "absolute", bottom: 80, width: "100%", textAlign: "center" }}>
        <Stamp text={final} at={14 + (n - 1) * every} size={52} color={EL.red} rot={-3} style={{ background: "rgba(255,255,255,0.92)", mixBlendMode: "normal" }} />
      </div>
      <Ice n={18} seed={41} />
    </AbsoluteFill>
  );
};

// ── la cabeza que se va ────────────────────────────────────────────────────────────────────────────────────────
export const ElHeadsOff: React.FC<{ title?: string; whole?: string; tails?: string; wholeW?: string; tailsW?: string; note?: string; bed?: string }> = ({ title = "heads off", whole = "$5.00", tails = "$7.50", wholeW = "1 lb whole", tailsW = "≈ ⅔ lb of tails", note = "nobody cheated you — that's the head", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const off = spring({ frame: f - 40, fps, config: { damping: 14, stiffness: 60 } });
  const needle = interpolate(off, [0, 1], [38, -10]);
  const pr = interpolate(f, [70, 110], [0, 1], ease);
  const n0 = parseFloat(whole.replace(/[^0-9.]/g, "")), n1 = parseFloat(tails.replace(/[^0-9.]/g, ""));
  const shown = `$${(n0 + (n1 - n0) * pr).toFixed(2)}`;
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={43} dim={0.66} />
      <Title t={title} />
      {/* la balanza de muelle */}
      <div style={{ position: "absolute", left: 300, top: 240, width: 560, height: 560 }}>
        <div style={{ position: "absolute", left: 20, top: 300, width: 520, height: 240, borderRadius: 24, background: "linear-gradient(#e9eef0, #b9c3c8)", boxShadow: "0 30px 50px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 150, top: 330, width: 260, height: 180, borderRadius: "130px 130px 20px 20px", background: EL.white, border: `6px solid ${EL.marker}`, overflow: "hidden" }}>
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 127, top: 20, width: 4, height: 30, background: EL.inkSoft, transformOrigin: "2px 110px", transform: `rotate(${-60 + i * 15}deg)` }} />)}
          <div style={{ position: "absolute", left: 128, top: 30, width: 6, height: 104, background: EL.red, transformOrigin: "3px 100px", transform: `rotate(${needle}deg)`, borderRadius: 3 }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 250, width: 560, height: 40, borderRadius: 10, background: "linear-gradient(#c8d1d5, #8f9aa0)" }} />
        <div style={{ position: "absolute", left: 90, top: 70 }}><ShrimpSvg w={380} headOff={off} /></div>
      </div>
      {/* los números */}
      <div style={{ position: "absolute", left: 1020, top: 280, width: 720 }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: hexA(EL.white, 0.85), textTransform: "uppercase" }}>{off > 0.5 ? tailsW : wholeW}</div>
        <div style={{ fontFamily: STENCIL, fontSize: 150, color: pr > 0.98 ? EL.buoy : EL.white, lineHeight: 1, textShadow: "0 6px 18px rgba(0,0,0,0.6)" }}>{shown}</div>
        <div style={{ fontFamily: MARKER, fontSize: 44, color: EL.white, marginTop: 6 }}>per pound</div>
        <div style={{ marginTop: 40, transform: `scale(${spring({ frame: f - 115, fps, config: { damping: 12 } })})`, transformOrigin: "left center" }}><Tape text={note} size={40} rot={-2} /></div>
      </div>
      <Ice n={20} seed={43} />
    </AbsoluteFill>
  );
};

// ── leer la bolsa ──────────────────────────────────────────────────────────────────────────────────────────────
export const ElBagReader: React.FC<{ title?: string; lines: { k: string; v: string; good?: boolean }[]; brand?: string; every?: number; bed?: string }> = ({ title = "turn the bag over", lines, brand = "SHRIMP", every = 28, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const flip = spring({ frame: f - 8, fps, config: { damping: 15, stiffness: 70 } });
  const showBack = flip > 0.5; const rot = flip * 180;
  const start = 40; const idx = Math.min(lines.length - 1, Math.max(0, Math.floor((f - start) / every)));
  const loupeY = 330 + idx * 110 + Math.sin(f / 9) * 4;
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={45} dim={0.66} />
      <Title t={title} />
      {/* la bolsa */}
      <div style={{ position: "absolute", left: 200, top: 190, width: 620, height: 800, perspective: 1600 }}>
        <div style={{ width: "100%", height: "100%", transform: `rotateY(${rot}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "30px 30px 50px 50px", background: `linear-gradient(160deg, ${EL.sea}, ${EL.navyDeep})`, boxShadow: "0 40px 60px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ fontFamily: STENCIL, fontSize: 96, color: EL.white }}>{brand}</div>
            <ShrimpSvg w={360} />
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: EL.ice }}>2 LB · FROZEN</div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "30px 30px 50px 50px", background: "linear-gradient(160deg, #e7eef1, #c5d2d8)", boxShadow: "0 40px 60px rgba(0,0,0,0.5)", padding: "110px 40px 0", boxSizing: "border-box" }}>
            {lines.map((l, i) => (
              <div key={i} style={{ height: 110, borderBottom: "2px dashed rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 22, color: EL.inkSoft, textTransform: "uppercase" }}>{l.k}</div>
                <div style={{ fontFamily: LABEL, fontSize: 30, color: EL.ink }}>{l.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* la lupa */}
      {showBack ? <div style={{ position: "absolute", left: 640, top: loupeY - 90, width: 180, height: 180, borderRadius: 90, border: `14px solid ${EL.marker}`, background: "rgba(255,255,255,0.12)", boxShadow: "0 16px 26px rgba(0,0,0,0.4)", opacity: interpolate(f, [start - 8, start], [0, 1], ease) }}><div style={{ position: "absolute", right: -60, bottom: -80, width: 34, height: 120, borderRadius: 12, background: EL.marker, transform: "rotate(-40deg)" }} /></div> : null}
      {/* lo que dice cada línea */}
      <div style={{ position: "absolute", left: 960, top: 260, width: 820 }}>
        {lines.map((l, i) => {
          const k = spring({ frame: f - start - i * every, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26, opacity: k, transform: `translateX(${(1 - k) * 70}px)` }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, flexShrink: 0, background: l.good === false ? EL.red : EL.green, color: EL.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: STENCIL, fontSize: 34 }}>{l.good === false ? "!" : "✓"}</div>
              <div style={{ background: hexA(EL.cooler, 0.96), borderRadius: 12, padding: "14px 22px", flex: 1, fontFamily: MARKER, fontSize: 40, color: EL.marker, lineHeight: 1.1 }}>{l.k}</div>
            </div>
          );
        })}
      </div>
      <Ice n={22} seed={45} />
    </AbsoluteFill>
  );
};
